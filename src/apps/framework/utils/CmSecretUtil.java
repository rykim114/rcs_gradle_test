package apps.framework.utils;

import java.security.MessageDigest;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class CmSecretUtil {
	
	protected static final Log	logger = LogFactory.getLog(CmSecretUtil.class);
	
	/**
	 * hex to byte[] : 16진수 문자열을 바이트 배열로 변환한다.
	 * @param hex
	 * @return
	 */
	public static byte[] hexToByteArray(String hex) {
		if (hex == null || hex.length() == 0) {
			return null;
		}
		
		byte[] ba = new byte[hex.length() / 2];
		
		for (int i = 0; i < ba.length; i++) {
			ba[i] = (byte)Integer.parseInt(hex.substring(2 * i, 2 * i + 2), 16);
		}
		return ba;
	}
	
	/**
	 * byte[] to hex : unsigned byte(바이트) 배열을 16진수 문자열로 바꾼다.
	 * @param ba
	 * @return
	 */
	public static String byteArrayToHex(byte[] ba) {
		return byteArrayToHex(ba, false);
	}	
	
	public static String byteArrayToHex(byte[] ba, boolean isUpperCase) {
		if (ba == null || ba.length == 0) {
			return null;
		}
		
		StringBuffer sb = new StringBuffer(ba.length * 2);
		String hexNumber;
		for (int x = 0; x < ba.length; x++) {
			hexNumber = "0" + Integer.toHexString(0xff & ba[x]);
			
			sb.append(hexNumber.substring(hexNumber.length() - 2));
		}
		if (isUpperCase) {
			return sb.toString().toUpperCase();
		}
		
		return sb.toString();
	}

	public static String encodeAES(String message) throws Exception {
		return encodeAES(message, CmPathInfo.getSECRET_AES_KEY());
	}
	
	/**
	 * AES 방식의 암호화
	 * @param message
	 * @return
	 * @throws Exception
	 */
	public static String encodeAES(String message, String key) throws Exception {
		
		if (message == null || message.equals("")) {
			return "";
		}
		
		SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes(), "AES");
		
		Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");
		cipher.init(Cipher.ENCRYPT_MODE, skeySpec);
		
		byte[] encrypted = cipher.doFinal(message.getBytes("UTF-8"));
		return byteArrayToHex(encrypted);
	}
	
	public static String decodeAES(String encrypted) throws Exception {
		return decodeAES(encrypted, CmPathInfo.getSECRET_AES_KEY());
	}
	
	/**
	 * AES 방식의 복호화
	 * @param encrypted
	 * @return
	 * @throws Exception
	 */
	public static String decodeAES(String encrypted, String key) throws Exception {
		if (encrypted == null || encrypted.equals("")) {
			return "";
		}
		SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes(), "AES");
		
		Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");
		cipher.init(Cipher.DECRYPT_MODE, skeySpec);
		
		byte[] original = cipher.doFinal(hexToByteArray(encrypted));
		String originalString = new String(original, "UTF-8");
		return originalString;
	}

	public static String xEncrypt(String message) throws Exception {
		// "ehdgoafnrhkqorentksdl"
		return xEncrypt(message, "Real Estate Land", "ehdgoafnrhkqoren");
	}

	public static String xEncrypt(String message, String key, String iv) throws Exception {
		
		if (message == null || message.equals("")) {
			return "";
		}
		
		SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes(), "AES");
		
		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
		cipher.init(Cipher.ENCRYPT_MODE, skeySpec, new IvParameterSpec(iv.getBytes()));
		
		byte[] encrypted = cipher.doFinal(message.getBytes("UTF-8"));
		return byteArrayToHex(encrypted, true);
	}
	
	public static String xDecrypt(String encrypted) throws Exception {
		// "ehdgoafnrhkqorentksdl"
		return xDecrypt(encrypted, "Real Estate Land", "ehdgoafnrhkqoren");
	}
	
	public static String xDecrypt(String encrypted, String key, String iv) throws Exception {
		if (encrypted == null || encrypted.equals("")) {
			return "";
		}
		SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes(), "AES");
		
		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
		cipher.init(Cipher.DECRYPT_MODE, skeySpec, new IvParameterSpec(iv.getBytes()));
		
		byte[] original = cipher.doFinal(hexToByteArray(encrypted));
		String originalString = new String(original);
		return originalString;
	}

	/**
	 * 
	 * @param str
	 * @return
	 */
	public static String encodeSha512(String str) {
		MessageDigest md;
		String rtn = "";
		try {
			md = MessageDigest.getInstance("SHA-512");
			
			md.update(str.getBytes());
			byte[] mb = md.digest();
			for (int i = 0; i < mb.length; i++) {
				byte temp = mb[i];
				String s = Integer.toHexString(new Byte(temp));
				while (s.length() < 2) {
					s = "0" + s;
				}
				s = s.substring(s.length() - 2);
				rtn += s;
			}
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		return rtn;
	}
	
	
	public static String encodeSha256(String str) {		
		String rtn = "";
		try {
			byte[] plainText = null;
		    byte[] hashValue = null;
		    plainText = str.getBytes();
		    
		    MessageDigest md = MessageDigest.getInstance("SHA-256");
		    hashValue = md.digest(plainText);
		    return new String(Base64.encodeBase64(hashValue));
		    
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		return rtn;
	}
	
	
	/**
	 * AES 방식의 암호화
	 * @param message
	 * @return
	 * @throws Exception
	 */
	public static String encodeAES_Base64(String message, String key) throws Exception {
		
		if (message == null || message.equals("") || message.equals("null") ) {
			return "";
		}
		try {
			SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes(), "AES");
			
			Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");
			cipher.init(Cipher.ENCRYPT_MODE, skeySpec);
			
			byte[] encrypted = cipher.doFinal(message.getBytes("UTF-8"));
			return new String(Base64.encodeBase64(encrypted));

		}catch (Exception ex) {
			logger.error(ex);
			return message;
		}
	}
	
	/**
	 * AES 방식의 복호화
	 * @param encrypted
	 * @return
	 * @throws Exception
	 */
	public static String decodeAES_Base64(String encrypted, String key) throws Exception {
		if (encrypted == null || encrypted.equals("") || encrypted.equals("null") ) {
			return "";
		}
		
		try {
			SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes(), "AES");
			
			Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");
			cipher.init(Cipher.DECRYPT_MODE, skeySpec);
			
			byte[] original = cipher.doFinal(Base64.decodeBase64(encrypted));
			String originalString = new String(original, "UTF-8");
			return originalString;
		}catch (Exception ex) {
			logger.error(ex);
			return encrypted;
			
		}		
	}

	/**
	 * 암호화/복호화 테스트용 메인 메소드
	 * */
//	public static void main(String[] args) throws Exception {
//		System.out.println("encrypt test");
//		String[] rawArr = {"sunjong.park@zeons.co.kr"};
//		for (String raw : rawArr) {
//			System.out.println(raw + ": " + xEncrypt(raw));
//		}
//		System.out.println("decrypt test");
//		String[] encryptArr = {"529A1D443DE703822BCE0D1B95FF3A23CACC611BA2358D0EBD19BA8E1DB58136"};
//		for (String enc : encryptArr) {
//			System.out.println(enc + ": " + xDecrypt(enc));
//		}
//	}

}
