package apps.homepage.common.utils.core;

public class Base64Coder {
	public Base64Coder()
    {
    }

    public static String encodeString(String s)
    {
        try
        {
            return new String(encode(s.getBytes("utf-8")));
        }
        catch(Exception e)
        {
            return "";
        }
    }

    public static char[] encode(byte in[])
    {
        return encode(in, in.length);
    }

    public static char[] encode(byte in[], int iLen)
    {
        int oDataLen = (iLen * 4 + 2) / 3;
        int oLen = ((iLen + 2) / 3) * 4;
        char out[] = new char[oLen];
        int ip = 0;
        for(int op = 0; ip < iLen; op++)
        {
            int i0 = in[ip++] & 0xff;
            int i1 = ip >= iLen ? 0 : in[ip++] & 0xff;
            int i2 = ip >= iLen ? 0 : in[ip++] & 0xff;
            int o0 = i0 >>> 2;
            int o1 = (i0 & 3) << 4 | i1 >>> 4;
            int o2 = (i1 & 0xf) << 2 | i2 >>> 6;
            int o3 = i2 & 0x3f;
            out[op++] = map1[o0];
            out[op++] = map1[o1];
            out[op] = op >= oDataLen ? '=' : map1[o2];
            op++;
            out[op] = op >= oDataLen ? '=' : map1[o3];
        }

        return out;
    }

    public static String decodeString(String s)
    {
        return new String(decode(s));
    }

    public static byte[] decode(String s)
    {
        return decode(s.toCharArray());
    }

    public static byte[] decode(char in[])
    {
        int iLen = in.length;
        if(iLen % 4 != 0)
            throw new IllegalArgumentException("Length of Base64 encoded input string is not a multiple of 4.");
        for(; iLen > 0 && in[iLen - 1] == '='; iLen--);
        int oLen = (iLen * 3) / 4;
        byte out[] = new byte[oLen];
        int ip = 0;
        int op = 0;
        while(ip < iLen) 
        {
            int i0 = in[ip++];
            int i1 = in[ip++];
            int i2 = ip >= iLen ? 65 : ((int) (in[ip++]));
            int i3 = ip >= iLen ? 65 : ((int) (in[ip++]));
            if(i0 > 127 || i1 > 127 || i2 > 127 || i3 > 127)
                throw new IllegalArgumentException("Illegal character in Base64 encoded data.");
            int b0 = map2[i0];
            int b1 = map2[i1];
            int b2 = map2[i2];
            int b3 = map2[i3];
            if(b0 < 0 || b1 < 0 || b2 < 0 || b3 < 0)
                throw new IllegalArgumentException("Illegal character in Base64 encoded data.");
            int o0 = b0 << 2 | b1 >>> 4;
            int o1 = (b1 & 0xf) << 4 | b2 >>> 2;
            int o2 = (b2 & 3) << 6 | b3;
            out[op++] = (byte)o0;
            if(op < oLen)
                out[op++] = (byte)o1;
            if(op < oLen)
                out[op++] = (byte)o2;
        }
        return out;
    }

    private static char map1[];
    private static byte map2[];

    static 
    {
        map1 = new char[64];
        int i = 0;
        for(char c = 'A'; c <= 'Z'; c++)
            map1[i++] = c;

        for(char c = 'a'; c <= 'z'; c++)
            map1[i++] = c;

        for(char c = '0'; c <= '9'; c++)
            map1[i++] = c;

        map1[i++] = '+';
        map1[i++] = '/';
        map2 = new byte[128];
        for(i = 0; i < map2.length; i++)
            map2[i] = -1;

        for(i = 0; i < 64; i++)
            map2[map1[i]] = (byte)i;

    }
}
