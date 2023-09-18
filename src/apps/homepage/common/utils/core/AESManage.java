package apps.homepage.common.utils.core;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.Security;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.CipherInputStream;
import javax.crypto.CipherOutputStream;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.ShortBufferException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.util.Strings;
import org.bouncycastle.util.encoders.Base64;
import org.bouncycastle.util.encoders.Hex;

interface AESManagable {
	
	public static final Log	logger = LogFactory.getLog(AESManagable.class);
	
    byte[] encryptionBytes(byte[] bytePlain);
    byte[] encryptionBytesFromFile (String fileName) throws FileNotFoundException;
    boolean decryptionBytesToFile(byte[] byteEncryption, String outFileName);
    byte[] decryptionBytes(byte[] byteEncryption);
    void addJCEProvider();
    void createSecretKey(String algorithm);
    boolean createIvParameter();
    boolean createCipher(String transFormation, String providerName);
}

class AESGeneralManage implements AESManagable {
	
    protected byte[]	keyBytes = new byte[] {
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
	protected byte[] ivBytes = new byte[] {
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };

	private SecretKeySpec key = null;
	private IvParameterSpec ivSpec = null;
	private Cipher cipherAES = null;
	
	public byte[] getIvBytes() {
		return ivBytes;
	}

	public void setIvBytes(byte[] ivBytes) {
		this.ivBytes = ivBytes;
	}

    public byte[] getKeyBytes() {
		return keyBytes;
	}

	public void setKeyBytes(byte[] keyBytes) {
		this.keyBytes = keyBytes;
	}

	public boolean setKeyText(String key) {
		if(key != null)	{
			int keyLength = key.length();
			if(keyLength == 16) {
				keyBytes = Strings.toByteArray(key);
				return true;
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
	}
	
	public boolean setIvHexText(String ivHex) {
		if(ivHex != null) {
			int ivHexLength = ivHex.length();
			if(ivHexLength == (16 * 2)) {
				ivBytes = Hex.decode(ivHex);
				return true;
			}
			else {
				return false;				
			}
		}
		else {
			return false;
		}
	}
	
	@Override
	public byte[] encryptionBytes(byte[] bytePlain) {
		byte[] cipherBytes = null;
		if(bytePlain != null && bytePlain.length > 0) {
			if(cipherAES != null && key != null && ivSpec != null) {
				try {
					cipherAES.init(Cipher.ENCRYPT_MODE, key, ivSpec);
					try {
						cipherBytes = new byte[cipherAES.getOutputSize(bytePlain.length)];
						if(cipherBytes != null) {
							int cipherBytesLength = 0;
							try {
								cipherBytesLength = cipherAES.update(bytePlain, 0, bytePlain.length, cipherBytes, 0);
								try {
									cipherBytesLength += cipherAES.doFinal(cipherBytes, cipherBytesLength);
								} catch (IllegalStateException e) {
									StringWriter strOut = new StringWriter();
									e.printStackTrace(new PrintWriter(strOut));
								} catch (IllegalBlockSizeException e) {
									StringWriter strOut = new StringWriter();
									e.printStackTrace(new PrintWriter(strOut));
								} catch (ShortBufferException e) {
									StringWriter strOut = new StringWriter();
									e.printStackTrace(new PrintWriter(strOut));
								} catch (BadPaddingException e) {
									StringWriter strOut = new StringWriter();
									e.printStackTrace(new PrintWriter(strOut));
								}
								if(cipherBytesLength > 0 && cipherBytes != null) {
									return cipherBytes;
								}
							}
							catch(IllegalStateException ex) {
								StringWriter strOut = new StringWriter();
								ex.printStackTrace(new PrintWriter(strOut));
							}
							catch(ShortBufferException ex) {
								StringWriter strOut = new StringWriter();
								ex.printStackTrace(new PrintWriter(strOut));
							}
						}
					}
					catch(IllegalStateException ex) {
						StringWriter strOut = new StringWriter();
						ex.printStackTrace(new PrintWriter(strOut));
					}
				}
				catch(InvalidKeyException ex) {
					StringWriter strOut = new StringWriter();
					ex.printStackTrace(new PrintWriter(strOut));
				}
				catch(InvalidAlgorithmParameterException ex) {
					StringWriter strOut = new StringWriter();
					ex.printStackTrace(new PrintWriter(strOut));
				}
			}
		}
		return null;
	}

	@Override
	public byte[] encryptionBytesFromFile(String fileName) throws FileNotFoundException {
		if(fileName != null && fileName.length() > 0) {
			File inputFile = new File(fileName);
			if(inputFile != null) {
				if(inputFile.exists() == true) {
					if(cipherAES != null && key != null && ivSpec != null) {
						try {
							try {
								cipherAES.init(Cipher.ENCRYPT_MODE, key, ivSpec);
								CipherInputStream cis = new CipherInputStream(new FileInputStream(inputFile), cipherAES);
								try {
									int dataInteger = 0;
									ByteArrayOutputStream byteCipherOutputStream = new ByteArrayOutputStream();
									while((dataInteger = cis.read()) >= 0) {
										byteCipherOutputStream.write(dataInteger);
									}
									byte[] cipherBytes = byteCipherOutputStream.toByteArray();
									if(cipherBytes != null && cipherBytes.length > 0) {
										return cipherBytes;
									}
									cis.close();
								} catch (IOException e) {
									StringWriter strOut = new StringWriter();
									e.printStackTrace(new PrintWriter(strOut));
								}finally{
									if (cis != null){
										cis = null;
									}
									
								}
							} catch (InvalidKeyException e) {
								StringWriter strOut = new StringWriter();
								e.printStackTrace(new PrintWriter(strOut));
							} catch (InvalidAlgorithmParameterException e) {
								StringWriter strOut = new StringWriter();
								e.printStackTrace(new PrintWriter(strOut));
							}
						} catch (FileNotFoundException e) {
							throw new FileNotFoundException("cannot find the" + fileName);
						}
					}
				}
				else {
					throw new FileNotFoundException("cannot find the" + fileName);
				}
			}
		}
		return null;
	}
	
	@Override
	public boolean decryptionBytesToFile(byte[] byteEncryption, String outFileName) {
		if(outFileName != null && outFileName.length() > 0) {
			if(byteEncryption != null && byteEncryption.length > 0) {
				File outputFile = new File(outFileName);
				if(outputFile != null) {
					if(cipherAES != null && key != null && ivSpec != null) {
						try {
							cipherAES.init(Cipher.DECRYPT_MODE, key, ivSpec);
							boolean bResult = true;
							CipherOutputStream cOutputStream = null;							
							try {
								cOutputStream = new CipherOutputStream(new FileOutputStream(outputFile), cipherAES);
								if(cOutputStream != null) {
									try {
										cOutputStream.write(byteEncryption);
										bResult = true;
									} catch (IOException e) {
										bResult = false;
										logger.error(e); //e.printStackTrace();
									}
								}
							} catch (FileNotFoundException e) {
								bResult = false;
								logger.error(e); //e.printStackTrace();
							} finally {
								if(cOutputStream != null && bResult == true) {
									try {
										cOutputStream.close();
									} catch (IOException e) {
										bResult = false;
										logger.error(e); //e.printStackTrace();
									}
								}
							}
							return bResult;
						} catch (InvalidKeyException e) {
							logger.error(e); //e.printStackTrace();
						} catch (InvalidAlgorithmParameterException e) {
							logger.error(e); //e.printStackTrace();
						}
					}
					else {
						return false;
					}					
				}
			}
		}
		return false;
	}
	
	@Override
	public byte[] decryptionBytes(byte[] byteEncryption) {
		byte[] plainBytes = null;
		if(byteEncryption != null && byteEncryption.length > 0) {
			if(cipherAES != null && key != null && ivSpec != null) {
				try {
					cipherAES.init(Cipher.DECRYPT_MODE, key, ivSpec);
					try {
						plainBytes = new byte[cipherAES.getOutputSize(byteEncryption.length)];
						if(plainBytes != null) {
							int plainBytesLength = 0;
							try {
								plainBytesLength = cipherAES.update(byteEncryption, 0, byteEncryption.length, plainBytes, 0);
								try {
									plainBytesLength += cipherAES.doFinal(plainBytes, plainBytesLength);
								} catch (IllegalStateException e) {
									logger.error(e); //e.printStackTrace();
								} catch (IllegalBlockSizeException e) {
									logger.error(e); //e.printStackTrace();
								} catch (ShortBufferException e) {
									logger.error(e); //e.printStackTrace();
								} catch (BadPaddingException e) {
									logger.error(e); //e.printStackTrace();
								}
								if(plainBytesLength > 0 && plainBytes != null) {
									return plainBytes;
								}
							}
							catch(IllegalStateException ex) {
								ex.printStackTrace();
							}
							catch(ShortBufferException ex) {
								ex.printStackTrace();
							}
						}
					}
					catch(IllegalStateException ex) {
						ex.printStackTrace();
					}
				}
				catch(InvalidKeyException ex) {
					ex.printStackTrace();
				}
				catch(InvalidAlgorithmParameterException ex) {
					ex.printStackTrace();
				}
			}
				
		}
		return null;
	}

	@Override
	public boolean createCipher(String transFormation, String providerName)
	{
		if(transFormation != null && transFormation.length() > 0 && providerName != null && providerName.length() > 0)
		{
			try {
				cipherAES = Cipher.getInstance(transFormation, providerName);
				return true;
			}
			catch(NoSuchAlgorithmException ex) {
				ex.printStackTrace();
			}
			catch(NoSuchPaddingException ex) {
				ex.printStackTrace();
			}
			catch(IllegalArgumentException ex) {
				ex.printStackTrace();
			} 
			catch (NoSuchProviderException ex) {
				ex.printStackTrace();
			}
		}
		return false;
	}
	
	@Override
	public void addJCEProvider() {
		try {
			Security.addProvider(new BouncyCastleProvider());
		} catch(NullPointerException ex) {
			throw new NullPointerException("the provider is null.");
		}
		catch(SecurityException ex) {
			ex.printStackTrace();
		}
	}
	
	@Override
	public void createSecretKey(String algorithm) {
		try {
			if(algorithm != null && algorithm.length() > 0)
				key = new SecretKeySpec(keyBytes, algorithm);
		}
		catch(IllegalArgumentException ex) {
			StringWriter strOut = new StringWriter();
			ex.printStackTrace(new PrintWriter(strOut));
		}
	}
	
	@Override
	public boolean createIvParameter() {
		if(ivBytes != null) {
			ivSpec = new IvParameterSpec(ivBytes);
			return true;
		}
		else {
			return false;
		}
	}
}

/**
 * 복호화의 결과물들에는 상황에 따라서 문자열 뒤에 " "(공백)이 있을 수 있습니다.
 * 그러므로 사용할 때에는 trim()을 이용해서 문자열 뒤의 공백을 지우고 사용합니다.
 */
public class AESManage extends AESGeneralManage {
	
	public boolean initializeAES() {
		addJCEProvider();
		if(createCipher("AES/CBC/PKCS5Padding", "BC") == true) {
			createSecretKey("AES");
			if(createIvParameter() == true) {
				return true;
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
	}
	
	public String encryptionTextWithHexString(String plainText) {
		if(plainText != null && plainText.length() > 0) {
			byte[] plainBytes = null;
			try {
				plainBytes = plainText.getBytes("euc-kr");
			}
			catch(UnsupportedEncodingException e) {
				StringWriter strOut = new StringWriter();
				e.printStackTrace(new PrintWriter(strOut));
			}
			if(plainBytes != null && plainBytes.length > 0) {
				byte[] encryptionData = encryptionBytes(plainBytes);
				if(encryptionData != null && encryptionData.length > 0) {
					String resultText = Hex.toHexString(encryptionData);
					if(resultText != null && resultText.length() > 0) {
						return resultText;
					}
				}
			}
		}
		return null;
	}
	
	public String decryptionTextWithHexString(String cipherHexText) {
		if(cipherHexText != null && cipherHexText.length() > 0) {
			byte[] cipherBytes = Hex.decode(cipherHexText);
			if(cipherBytes != null && cipherBytes.length > 0) {
				byte[] decryptionData = decryptionBytes(cipherBytes);
				if(decryptionData != null && decryptionData.length > 0) {
					String resultText;
					try {
						resultText = new String(decryptionData, "euc_kr");
						return resultText;
					} catch (UnsupportedEncodingException e) {
						StringWriter strOut = new StringWriter();
						e.printStackTrace(new PrintWriter(strOut));
					}
				}
			}
		}
		return null;
	}
	
	public String encryptionBytesFromFileWithHexString(String fileName) {
		if(fileName != null && fileName.length() > 0) {
			byte[] cipherBytes = null;
			try {
				cipherBytes = encryptionBytesFromFile(fileName);
			} catch (FileNotFoundException e) {
				StringWriter strOut = new StringWriter();
				e.printStackTrace(new PrintWriter(strOut));
			}
			if(cipherBytes != null && cipherBytes.length > 0) {
				String resultText = Hex.toHexString(cipherBytes);
				if(resultText != null && resultText.length() > 0) {
					return resultText;
				}
			}
		}
		return null;
	}
	
	public boolean decryptionBytesToFileWithHexString(String cipherHexBytes, String fileName) {
		if(fileName != null && fileName.length() > 0) {
			if(cipherHexBytes != null && cipherHexBytes.length() > 0) {
				byte[] cipherBytes = Hex.decode(cipherHexBytes);
				if(cipherBytes != null && cipherBytes.length > 0) {
					boolean result = decryptionBytesToFile(cipherBytes, fileName);
					return result;
				}
			}
		}
		return false;
	}
	
	public String encryptionTextWithBase64Encoding(String plainText) {
		if(plainText != null && plainText.length() > 0) {
			byte[] plainBytes = null;
			try {
				plainBytes = plainText.getBytes("euc-kr");
			}
			catch(UnsupportedEncodingException e) {
				StringWriter strOut = new StringWriter();
				e.printStackTrace(new PrintWriter(strOut));
			}
			if(plainBytes != null && plainBytes.length > 0) {
				byte[] encryptionData = encryptionBytes(plainBytes);
				if(encryptionData != null && encryptionData.length > 0) {
					String resultText = Base64.toBase64String(encryptionData);
					if(resultText != null && resultText.length() > 0) {
						return resultText;
					}
				}
			}
		}
		return null;
	}
	
	public String decryptionTextWithBase64Decoding(String base64Text) {
		if(base64Text != null && base64Text.length() > 0) {
			byte[] cipherBytes = Base64.decode(base64Text);
			if(cipherBytes != null && cipherBytes.length > 0) {
				byte[] decryptionData = decryptionBytes(cipherBytes);
				if(decryptionData != null && decryptionData.length > 0) {
					String resultText = new String(decryptionData);
					if(resultText != null && resultText.length() > 0) {
						return resultText;
					}
				}
			}
		}
		return null;
	}
}