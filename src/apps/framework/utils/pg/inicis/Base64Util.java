package apps.framework.utils.pg.inicis;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class Base64Util {
	private int lineLength;
	private boolean lineCut;
	public static final int RFC_MAX_LINE_LENGTH = 76;
	public static final int USUAL_LINE_LENGTH = 64;

	/* static {
		reset();
	} */
	
	Base64Util(){
		reset();
	}

	public void decode(InputStream inputstream, OutputStream outputstream) throws IOException {
		byte[] abyte0 = new byte[4];
		byte[] abyte1 = new byte[3];
		while (inputstream.available() != 0) {
			int i = 0;
			while (inputstream.available() != 0) {
				byte byte0 = (byte) inputstream.read();
				if (!(isDecodDomain(byte0)))
					continue;
				abyte0[i] = byte0;
				if (++i == 4)
					break;
			}
			if ((i != 4) && (i != 0))
				throw new IOException("Base64 decode fail, last: " + i);
			if (i == 0)
				continue;
			int j = decodeBlock(abyte0, abyte1);
			outputstream.write(abyte1, 0, j);
		}
	}

	public byte[] decode(byte[] abyte0) throws IOException {
		ByteArrayOutputStream bytearrayoutputstream = new ByteArrayOutputStream();
		decode(new ByteArrayInputStream(abyte0), bytearrayoutputstream);
		bytearrayoutputstream.close();
		return bytearrayoutputstream.toByteArray();
	}

	public final int decodeBlock(byte[] abyte0, byte[] abyte1) {
		byte byte0 = 3;
		int[] ai = new int[4];
		for (int i = 0; i < 4; ++i) {
			byte byte1 = abyte0[i];
			if (byte1 == 61) {
				byte0 = (i != 2) ? (byte)2 : (byte)1;
				break;
			}
			if (byte1 > 96) {
				ai[i] = (byte1 - 71);
			} else if (byte1 > 64) {
				ai[i] = (byte1 - 65);
			} else if (byte1 > 47) {
				ai[i] = (byte1 + 4);
			} else if (byte1 == 43) {
				ai[i] = 62;
			} else if (byte1 == 47) {
				ai[i] = 63;
			}
		}
		abyte1[0] = (byte) ((ai[0] & 0xFF) << 2 | (ai[1] & 0xFF) >> 4);
		abyte1[1] = (byte) ((ai[1] & 0xFF) << 4 | (ai[2] & 0xFF) >> 2);
		abyte1[2] = (byte) ((ai[2] & 0xFF) << 6 | ai[3] & 0xFF);
		return byte0;
	}

	public void encode(InputStream inputstream, OutputStream outputstream) throws IOException {
		byte[] abyte0 = new byte[3];
		byte[] abyte1 = new byte[4];
		int i = 0;
		while (inputstream.available() != 0) {
			int j = inputstream.read(abyte0);
			encodeBlock(abyte0, j, abyte1);
			outputstream.write(abyte1);
			i += 4;
			if ((!(lineCut)) || (lineLength > i))
				continue;
			outputstream.write(10);
			i = 0;
		}

		if ((lineCut) && (i != 0))
			outputstream.write(10);
	}

	public byte[] encode(byte[] abyte0) throws IOException {
		ByteArrayOutputStream bytearrayoutputstream = new ByteArrayOutputStream();
		encode(new ByteArrayInputStream(abyte0), bytearrayoutputstream);
		bytearrayoutputstream.close();
		return bytearrayoutputstream.toByteArray();
	}

	public void encode(InputStream inputstream, OutputStream outputstream, boolean cut) throws IOException {
		byte[] abyte0 = new byte[3];
		byte[] abyte1 = new byte[4];
		int i = 0;
		while (inputstream.available() != 0) {
			int j = inputstream.read(abyte0);
			encodeBlock(abyte0, j, abyte1);
			outputstream.write(abyte1);
			i += 4;
			if ((!(cut)) || (lineLength > i))
				continue;
			outputstream.write(10);
			i = 0;
		}

		if ((cut) && (i != 0))
			outputstream.write(10);
	}

	public byte[] encode(byte[] abyte0, boolean cut) throws IOException {
		ByteArrayOutputStream bytearrayoutputstream = new ByteArrayOutputStream();
		encode(new ByteArrayInputStream(abyte0), bytearrayoutputstream, cut);
		bytearrayoutputstream.close();
		return bytearrayoutputstream.toByteArray();
	}

	public final void encodeBlock(byte[] abyte0, int i, byte[] abyte1) {
		if (abyte1 == null)
			abyte1 = new byte[4];
		for (int j = 3; i < j;) {
			abyte0[(--j)] = 0;
		}
		abyte1[0] = (byte) ((abyte0[0] & 0xFC) >>> 2);
		abyte1[1] = (byte) ((abyte0[0] & 0x3) << 4 | (abyte0[1] & 0xF0) >>> 4);
		abyte1[2] = (byte) ((abyte0[1] & 0xF) << 2 | (abyte0[2] & 0xC0) >>> 6);
		abyte1[3] = (byte) (abyte0[2] & 0x3F);
		for (int k = 0; k < 4; ++k) {
			if (abyte1[k] < 26) {
				abyte1[k] = (byte) (abyte1[k] + 65);
			} else if (abyte1[k] < 52) {
				abyte1[k] = (byte) (abyte1[k] + 71);
			} else if (abyte1[k] < 62) {
				abyte1[k] = (byte) (abyte1[k] - 4);
			} else if (abyte1[k] == 62) {
				abyte1[k] = 43;
			} else if (abyte1[k] == 63)
				abyte1[k] = 47;
		}
		if (i < 3)
			abyte1[3] = 61;
		if (i < 2)
			abyte1[2] = 61;
	}

	private boolean isDecodDomain(byte byte0) {
		if (byte0 > 122)
			return false;
		if (byte0 == 43)
			return true;
		if (byte0 < 47)
			return false;
		if (byte0 <= 57)
			return true;
		if (byte0 == 61)
			return true;
		if (byte0 < 65)
			return false;
		if (byte0 <= 90)
			return true;
		if (byte0 < 97)
			return false;
		return (byte0 <= 122);
	}

	public void reset() {
		lineLength = 64;
		lineCut = true;
	}

	public void setLineCut(boolean flag) {
		lineCut = flag;
	}

	public void setLineLength(int i) {
		lineLength = i;
	}
}