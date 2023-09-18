package apps.framework.utils.pg.inicis;

import java.security.Provider;
import java.security.Security;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESedeKeySpec;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import com.extrus.jce.provider.ExecureProvider;
import com.initech.provider.crypto.InitechProvider;
import com.initech.provider.crypto.spec.SeedKeySpec;

/**
 * SEED 암호화처리(Billing용)
 *
 **/
public class CryptUtil{
	
	private byte[] merchantKey;
	private SecretKeySpec keyspec;
	private DESedeKeySpec tdesKeyspec;
	private SeedKeySpec seedKeyspec;
	private SecretKeyFactory keyfactory;
	private SecretKey key;
	private Cipher cipher;
	

	static {

//	    Security.addProvider(new ExecureProvider());
	    Security.addProvider(new InitechProvider());
	}	
	
	public String encrypt_SEED(String plainText, String mrechant_seedkey, String merchant_iv) throws Exception {
		
		Base64Util base64Util = new Base64Util(); 
		
		this.merchantKey = base64Util.decode(mrechant_seedkey.getBytes());

		this.seedKeyspec = new SeedKeySpec(this.merchantKey);
		SecretKeyFactory skf = SecretKeyFactory.getInstance("SEED", "Initech");
//		SecretKeyFactory skf = SecretKeyFactory.getInstance("SEED", provider);
		this.key = skf.generateSecret(this.seedKeyspec);

		this.cipher = Cipher.getInstance("SEED/CBC/PKCS5Padding", "Initech");
//		this.cipher = Cipher.getInstance("SEED/CBC/PKCS5Padding", provider);
		this.cipher.init(1, this.key, new IvParameterSpec(merchant_iv.getBytes()));

		return new String(base64Util.encode(this.cipher.doFinal(plainText.getBytes())));
	}
}
