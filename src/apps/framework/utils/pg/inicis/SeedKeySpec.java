package apps.framework.utils.pg.inicis;

import java.security.InvalidKeyException;
import java.security.spec.KeySpec;

/**
 * SEED 암호화처리(Billing용)
 *
 **/
public class SeedKeySpec implements KeySpec {
	private byte[] a;
	public static final int SEED_KEY_LEN = 16;
	//private static final String z;
	private String z;

	public SeedKeySpec(byte[] paramArrayOfByte) throws InvalidKeyException {
		if (paramArrayOfByte.length < 16)
			throw new InvalidKeyException(z);
		this.a = new byte[16];
		System.arraycopy(paramArrayOfByte, 0, this.a, 0, 16);
	}

	public byte[] getKey() {
		return this.a;
	}
}

