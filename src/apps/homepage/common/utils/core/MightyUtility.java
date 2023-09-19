package apps.homepage.common.utils.core;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStreamReader;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Enumeration;
import java.util.Locale;
import java.util.StringTokenizer;
import java.util.Vector;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;


public final class MightyUtility {
    private static final Log logger = LogFactory.getLog(MightyUtility.class);
	
	private MightyUtility()
    {
    }
	
	public static String GetXmlTagValue(Element eml, String tagName)
    {
        NodeList nodeList = eml.getElementsByTagName(tagName);
        if(eml == null || nodeList == null || nodeList.getLength() <= 0)
            return "";
        try
        {
            Element elmnt = (Element)nodeList.item(0);
            Node sqlNode = elmnt.getFirstChild();
            return sqlNode.getNodeValue();
        }
        catch(Exception ex)
        {
        	ex.printStackTrace();
        }
        return "";
    }

    public static String yntotf(String yn)
    {
        if(yn.toUpperCase().substring(0, 1).equals("Y"))
            return "true";
        else
            return "false";
    }

    public static String escape(String src)
    {
        StringBuffer tmp = new StringBuffer();
        tmp.ensureCapacity(src.length() * 6);
        for(int i = 0; i < src.length(); i++)
        {
            char j = src.charAt(i);
            if(Character.isDigit(j) || Character.isLowerCase(j) || Character.isUpperCase(j))
                tmp.append(j);
            else
            if(j < '\u0100')
            {
                tmp.append("%");
                if(j < '\020')
                    tmp.append("0");
                tmp.append(Integer.toString(j, 16));
            } else
            {
                tmp.append("%u");
                tmp.append(Integer.toString(j, 16));
            }
        }

        return tmp.toString();
    }

    public static String unescape(String src)
    {
        StringBuffer tmp = new StringBuffer();
        tmp.ensureCapacity(src.length());
        int lastPos = 0;
        int pos = 0;
        while(lastPos < src.length()) 
        {
            pos = src.indexOf("%", lastPos);
            if(pos == lastPos)
            {
                if(src.charAt(pos + 1) == 'u')
                {
                    char ch = (char)Integer.parseInt(src.substring(pos + 2, pos + 6), 16);
                    tmp.append(ch);
                    lastPos = pos + 6;
                } else
                {
                    char ch = (char)Integer.parseInt(src.substring(pos + 1, pos + 3), 16);
                    tmp.append(ch);
                    lastPos = pos + 3;
                }
            } else
            if(pos == -1)
            {
                tmp.append(src.substring(lastPos));
                lastPos = src.length();
            } else
            {
                tmp.append(src.substring(lastPos, pos));
                lastPos = pos;
            }
        }
        return tmp.toString();
    }

    public static Object[] clone(Object objects[])
    {
        int length = objects.length;
        Class c = ((Object) (objects)).getClass().getComponentType();
        Object array = Array.newInstance(c, length);
        for(int i = 0; i < length; i++)
            Array.set(array, i, clone(objects[i]));

        return (Object[])array;
    }

    public static Object clone(Object object)
    {
        Class c = object.getClass();
        Object newObject = null;
        try
        {
            newObject = c.newInstance();
        }
        catch(Exception e)
        {
            return null;
        }
        Field field[] = c.getFields();
        for(int i = 0; i < field.length; i++)
            try
            {
                Object f = field[i].get(object);
                field[i].set(newObject, f);
            }
            catch(Exception exception) { }

        return newObject;
    }

    public static Vector clone(Vector objects)
    {
        Vector newObjects = new Vector();
        Object o;
        for(Enumeration e = objects.elements(); e.hasMoreElements(); newObjects.addElement(clone(o)))
            o = e.nextElement();

        return newObjects;
    }

    public static Object deepClone(Object o)
    {
        try
        {
            ByteArrayOutputStream b = new ByteArrayOutputStream();
            ObjectOutputStream out = new ObjectOutputStream(b);
            out.writeObject(o);
            ByteArrayInputStream bi = new ByteArrayInputStream(b.toByteArray());
            ObjectInputStream in = new ObjectInputStream(bi);
            return in.readObject();
        }
        catch(Exception e)
        {
        	logger.error(e); //e.printStackTrace();
        }
        return null;
    }

    public static void fixNull(Object o)
    {
        if(o == null)
            return;
        Class c = o.getClass();
        if(c.isPrimitive())
            return;
        Field fields[] = c.getFields();
        for(int i = 0; i < fields.length; i++)
            try
            {
                Object f = fields[i].get(o);
                Class fc = fields[i].getType();
                if(fc.getName().equals("java.lang.String"))
                    if(f == null)
                        fields[i].set(o, "");
                    else
                        fields[i].set(o, f);
            }
            catch(Exception exception) { }

    }

    

    public static void fixNullAndTrim(Object o)
    {
        if(o == null)
            return;
        Class c = o.getClass();
        if(c.isPrimitive())
            return;
        Field fields[] = c.getFields();
        for(int i = 0; i < fields.length; i++)
            try
            {
                Object f = fields[i].get(o);
                Class fc = fields[i].getType();
                if(fc.getName().equals("java.lang.String"))
                    if(f == null)
                    {
                        fields[i].set(o, "");
                    } else
                    {
                        String item = trim((String)f);
                        fields[i].set(o, item);
                    }
            }
            catch(Exception exception) { }

    }

    



    public static String removeComma(String s)
    {
        if(s == null)
            return null;
        if(s.indexOf(",") != -1)
        {
            StringBuffer buf = new StringBuffer();
            for(int i = 0; i < s.length(); i++)
            {
                char c = s.charAt(i);
                if(c != ',')
                    buf.append(c);
            }

            return buf.toString();
        } else
        {
            return s;
        }
    }

    public static String removeSpace(String s)
    {
        if(s == null)
            return null;
        if(s.indexOf(" ") != -1)
        {
            StringBuffer buf = new StringBuffer();
            for(int i = 0; i < s.length(); i++)
            {
                char c = s.charAt(i);
                if(c != ' ')
                    buf.append(c);
            }

            return buf.toString();
        } else
        {
            return s;
        }
    }

    public static String removeSingleQuotation(String s)
    {
        if(s == null)
            return null;
        if(s.indexOf("'") != -1)
        {
            StringBuffer buf = new StringBuffer();
            for(int i = 0; i < s.length(); i++)
            {
                char c = s.charAt(i);
                if(c != '\'')
                    buf.append(c);
            }

            return buf.toString();
        } else
        {
            return s;
        }
    }

    public static String getStackTrace(Throwable e)
    {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(bos);
        e.printStackTrace(writer);
        writer.flush();
        return bos.toString();
    }

    public static String trim(String s)
    {
        int st = 0;
        char val[] = s.toCharArray();
        int count = val.length;
        int len;
        for(len = count; st < len && (val[st] <= ' ' || val[st] == '\u3000'); st++);
        for(; st < len && (val[len - 1] <= ' ' || val[len - 1] == '\u3000'); len--);
        return st <= 0 && len >= count ? s : s.substring(st, len);
    }

    public static String E2K(String english)
    {
        String korean = null;
        if(english == null)
            return "";
        try
        {
            korean = new String(english.getBytes("8859_1"), "KSC5601");
        }
        catch(UnsupportedEncodingException e)
        {
            korean = new String(english);
        }
        return korean;
    }

    public static String E2K2(String english)
    {
        String korean = null;
        if(english == null)
            return "";
        try
        {
            korean = new String(english.getBytes("8859_1"), "euc-kr");
        }
        catch(UnsupportedEncodingException e)
        {
            korean = new String(english);
        }
        return korean;
    }

    public static String K2E(String korean)
    {
        String english = null;
        if(korean == null)
            return "";
        english = new String(korean);
        try
        {
            english = new String(korean.getBytes("KSC5601"), "8859_1");
        }
        catch(UnsupportedEncodingException e)
        {
            english = new String(korean);
        }
        return english;
    }

    public static String K2E2(String korean)
    {
        String english = null;
        if(korean == null)
            return "";
        english = new String(korean);
        try
        {
            english = new String(korean.getBytes("euc-kr"), "8859_1");
        }
        catch(UnsupportedEncodingException e)
        {
            english = new String(korean);
        }
        return english;
    }

    public static int alphaIdx(char src)
    {
        return src <= '`' ? src - 65 : src - 71;
    }

    public static String alphaEncode(String src)
        throws UnsupportedEncodingException
    {
        return XBase64.byteArrayToBase64(src.getBytes("ms949"), false).replace('C', '-');
    }

    public static String alphaEncode_old(String src)
    {
        char charstr[] = src.toCharArray();
        int charlen = charstr.length;
        StringBuffer sb = new StringBuffer();
        for(int i = 0; i < charlen; i++)
        {
            int num0 = charstr[i] + 12321;
            int num1 = num0 / 2704;
            int num2 = (num0 - num1 * 2704) / 52;
            int num3 = num0 - num1 * 2704 - num2 * 52;
            sb.append(alphaHex[num1]);
            sb.append(alphaHex[num2]);
            sb.append(alphaHex[num3]);
        }

        return sb.toString();
    }

    public static String alphaDecode(String src)
    {
        src = src.replaceAll(" ", "+");
        try
        {
            return new String(XBase64.base64ToByteArray(src.replace('-', 'C'), false), "ms949");
        }
        catch(Exception ex)
        {            
        	ex.printStackTrace();
        }
        return src;
    }

    public static String strDecode_old(String src)
    {
        try
        {
            int byteLen = src.length() / 3;
            byte bytestr[] = new byte[byteLen];
            for(int i = 0; i < byteLen; i++)
                bytestr[i] = (byte)(Integer.parseInt(src.substring(i * 3, i * 3 + 3)) - 815);

            return new String(bytestr, "euc-kr");
        }
        catch(UnsupportedEncodingException e)
        {
            return src;
        }
    }

    public static String strEncode(String src)
    {
        StringBuffer sb = new StringBuffer();
        char charstr[] = src.toCharArray();
        for(int i = 0; i < charstr.length; i++)
            sb.append(charstr[i] + 12321);

        return sb.toString();
    }

    public static String strDecode(String src)
    {
        int charLen = src.length() / 5;
        char charstr[] = new char[charLen];
        for(int i = 0; i < charLen; i++)
            charstr[i] = (char)(Integer.parseInt(src.substring(i * 5, i * 5 + 5)) - 12321);

        return new String(charstr);
    }

    public static boolean isHangul(char c)
    {
        return isHangulSyllables(c) || isHangulJamo(c) || isHangulCompatibilityJamo(c);
    }

    public static boolean isHangulSyllables(char c)
    {
        return c >= '\uAC00' && c <= '\uD7A3';
    }

    public static boolean isHangulJamo(char c)
    {
        return c >= '\u1100' && c <= '\u1159' || c >= '\u1161' && c <= '\u11A2' || c >= '\u11A8' && c <= '\u11F9';
    }

    public static boolean isHangulCompatibilityJamo(char c)
    {
        return c >= '\u3131' && c <= '\u318E';
    }

    public static String itos(int i)
    {
        return (new Integer(i)).toString();
    }

    public static String LTrim(String s)
    {
        int i = s.length();
        int j = 0;
        for(j = 0; j < i; j++)
            if(s.charAt(j) != ' ')
                break;

        return s.substring(j);
    }

    public static String getKSTDate()
    {
        SimpleDateFormat simpledateformat = new SimpleDateFormat("yyyyyMMdd");
        Date date = new Date();
        return simpledateformat.format(date);
    }

    public static String[] toStringArray(String s)
    {
        return toStringArray(s, "@");
    }

    public static String[] toStringArray(String s, String seperator)
    {
        return s.split(seperator);
    }

    public static String[][] toStringArray(String s, int alen)
    {
        return toStringArray(s, alen, "@");
    }

    public static String[][] toStringArray(String s, int alen, String seperator)
    {
        String sArray[] = toStringArray(s);
        String sArray2[][] = new String[sArray.length / 2][];
        for(int i = 0; i < sArray.length / 2; i++)
        {
            sArray2[i] = new String[alen];
            for(int j = 0; j < alen; j++)
                sArray2[i][j] = sArray[i * 2 + j].toString();

        }

        return sArray2;
    }

    public static String StringToHex(String s)
    {
        String s2 = "";
        char c = s.charAt(0);
        s2 = Integer.toHexString(c);
        if(s2.length() == 1)
            s2 = (new StringBuilder("0")).append(s2).toString();
        return s2.toUpperCase();
    }

    public static String HexEncode(String s)
    {
        int i = 0;
        String s1 = "";
        int bufSize = s.length() * 4;
        StringBuffer buf = new StringBuffer(bufSize);
        for(i = 0; i < s.length(); i++)
        {
            s1 = Integer.toHexString(s.charAt(i));
            if(s1.length() == 1)
                buf.append((new StringBuilder("%0")).append(s1.toUpperCase()).toString());
            else
            if(s1.length() == 2)
                buf.append((new StringBuilder("%")).append(s1.toUpperCase()).toString());
            else
            if(s1.length() == 4)
                buf.append((new StringBuilder("%u")).append(s1.toUpperCase()).toString());
        }

        return buf.toString();
    }

    public static String UniToJis(String s)
    {
        try
        {
            return new String(s.getBytes("SHIFT_JIS"), "8859_1");
        }
        catch(Exception exception)
        {
            return s;
        }
    }

    public static String makeFillStr(String s, String s1, int i)
    {
        int j = s.length();
        int k = i - j;
        String s2 = "";
        for(int l = 0; l < k; l++)
            s2 = (new StringBuilder(String.valueOf(s2))).append(s1).toString();

        return (new StringBuilder(String.valueOf(s2))).append(s).toString();
    }

    public static String ByteToString(String s)
    {
        return (new StringBuilder(String.valueOf(StringToHex(s.substring(0, 1))))).append(StringToHex(s.substring(1, 2))).append(StringToHex(s.substring(2, 3))).append(StringToHex(s.substring(3, 4))).toString();
    }

    public static String UniToUtf8(String s)
    {
        try
        {
            return new String(s.getBytes("UTF-8"), "8859_1");
        }
        catch(Exception exception)
        {
            return s;
        }
    }

    public static String KscToUni(String s)
    {
        try
        {
            return new String(s.getBytes("8859_1"), "KSC5601");
        }
        catch(Exception exception)
        {
            return s;
        }
    }

    public static String IntToString(int i)
    {
        return new String(String.valueOf(i));
    }

    public static String dtos(double d)
    {
        return new String(String.valueOf(d));
    }

    public static String quote(String s)
    {
        if(s == null)
            return "''";
        else
            return (new StringBuilder("'")).append(s).append("'").toString();
    }

    public static String ByteToFFString(String s)
    {
        return StringToHex(s);
    }

    public static int stoi(String s)
    {
        if(s == null)
            return 0;
        else
            return Integer.valueOf(LTrim(s)).intValue();
    }

    public static char[] StringToChar(String s)
    {
        int i = s.length();
        char ac[] = new char[i];
        for(int j = 0; j < i; j++)
            ac[j] = s.charAt(j);

        return ac;
    }

    public static String HexToString(String s)
    {
        String s1 = "";
        int i = Integer.parseInt(s, 16);
        s1 = itos(i);
        return s1;
    }

    public static String RPad(int s, String s1, int i)
    {
        return RPad(IntToString(s), s1, i);
    }

    public static String RPad(String s, String s1, int i)
    {
        String s2 = s;
        int j = i - s.length();
        for(int k = s1.length(); j >= k;)
        {
            j -= k;
            s2 = (new StringBuilder(String.valueOf(s2))).append(s1).toString();
        }

        if(j > 0)
            s2 = (new StringBuilder(String.valueOf(s2))).append(s1.substring(0, j)).toString();
        return s2;
    }

    public static String UniToKsc(String s)
    {
        try
        {
            return new String(s.getBytes("KSC5601"), "8859_1");
        }
        catch(Exception exception)
        {
            return s;
        }
    }

    public static String StringToByteString(String s, int i)
    {
        byte abyte0[] = new byte[i];
        byte abyte1[] = s.getBytes();
        System.arraycopy(abyte1, 0, abyte0, 0, abyte1.length);
        return new String(abyte0);
    }

    public static String IntToHex(int i)
    {
        String s1 = "";
        s1 = Integer.toHexString(i);
        if(s1.length() == 1)
            s1 = (new StringBuilder("0")).append(s1).toString();
        return s1.toUpperCase();
    }

    public static String IntToFFString(int i)
    {
        byte abyte0[] = new byte[1];
        abyte0[0] = (byte)(i & 0xff);
        String s = "";
        try
        {
            s = new String(abyte0, "ISO-8859-1");
        }
        catch(Exception exception)
        {
            exception.toString();
        }
        return s;
    }

    public static String EucToUni(String s)
    {
        try
        {
            return new String(s.getBytes("8859_1"), "EUC-KR");
        }
        catch(Exception exception)
        {
            return s;
        }
    }

    public static String IntToByteString(int i)
    {
        byte abyte0[] = new byte[4];
        abyte0[0] = (byte)((i & 0xff000000) >> 32);
        abyte0[1] = (byte)((i & 0xff0000) >> 16);
        abyte0[2] = (byte)((i & 0xff00) >> 8);
        abyte0[3] = (byte)(i & 0xff);
        String s = "";
        try
        {
            s = new String(abyte0, "ISO-8859-1");
        }
        catch(Exception exception)
        {
            exception.toString();
        }
        return s;
    }

    public static int ByteToInt(Byte byte1)
    {
        return byte1.intValue();
    }

    public static String IntToString(int i, int j)
    {
        byte abyte0[] = new byte[1];
        abyte0[0] = (byte)(i & j);
        String s = "";
        try
        {
            s = new String(abyte0, "ISO-8859-1");
        }
        catch(Exception exception)
        {
            exception.toString();
        }
        return s;
    }

    public static String LPad(int s, String s1, int i)
    {
        return LPad(IntToString(s), s1, i);
    }

    public static String LPad(String s, String s1, int i)
    {
        String s2 = "";
        int j = i - s.length();
        for(int k = s1.length(); j >= k;)
        {
            j -= k;
            s2 = (new StringBuilder(String.valueOf(s2))).append(s1).toString();
        }

        if(j > 0)
            s2 = (new StringBuilder(String.valueOf(s2))).append(s1.substring(0, j)).toString();
        s2 = (new StringBuilder(String.valueOf(s2))).append(s).toString();
        return s2;
    }

    public static String Utf8ToUni(String s)
    {
        try
        {
            return new String(s.getBytes("8859_1"), "UTF-8");
        }
        catch(Exception exception)
        {
            return s;
        }
    }

    public static char[] byteToChar(byte abyte0[])
    {
        ByteArrayInputStream bytearrayinputstream = new ByteArrayInputStream(abyte0);
        int i = bytearrayinputstream.available();
        char ac[] = new char[i];
        int k = 0;
        do
        {
            int j = bytearrayinputstream.read();
            if(j != -1)
                ac[k++] = (char)j;
            else
                return ac;
        } while(true);
    }

    public static int HexToInt(String s)
    {
        int i = Integer.parseInt(s, 16);
        return i;
    }

    public static String JisToUni(String s)
    {
        try
        {
            return new String(s.getBytes("8859_1"), "SHIFT_JIS");
        }
        catch(Exception exception)
        {
            return s;
        }
    }

    public static String UniToEuc(String s)
    {
        try
        {
            return new String(s.getBytes("EUC-KR"), "8859_1");
        }
        catch(Exception exception)
        {
            return s;
        }
    }

    public static int intSum(int ivalues[])
    {
        int tot = 0;
        for(int i = 0; i < ivalues.length; i++)
            tot += ivalues[i];

        return tot;
    }

    public static String GetCurrentDate(String dFormat)
    {
        SimpleDateFormat dateFormat = new SimpleDateFormat(dFormat, Locale.KOREA);
        return dateFormat.format(new Date());
    }

    public static String getDate()
    {
        return getDate("yyyyMMdd");
    }

    public static String getDate(String dFormat)
    {
        return GetCurrentDate(dFormat);
    }

    public static int GetLastDay(int year, int month)
    {
        Calendar lastday = Calendar.getInstance();
        lastday.set(year, month + 1, 1);
        lastday.add(5, -1);
        return lastday.get(5);
    }

    public static String WeekChineseName(Calendar dt)
    {
        switch(7)
        {
        case 2: // '\002'
            return "月";

        case 3: // '\003'
            return "火";

        case 4: // '\004'
            return "水";

        case 5: // '\005'
            return "木";

        case 6: // '\006'
            return "金";

        case 7: // '\007'
            return "土";

        case 1: // '\001'
            return "日";
        }
        return "";
    }

    public static String toString(Object objValue)
    {
        if(objValue == null)
            return "";
        else
            return objValue.toString();
    }

    public static String LineUpScript(String src)
    {
        return src;
    }

    public static String EnodeParam(String a_data)
    {
        return a_data.replace("&", "[(am)]").replace("=", "[(eq)]").replace("?", "[(qu))]").replace("%", "[(ps)]").replace("#", "[(Sh)]".replace("+", "[(pl)]"));
    }

    public static String DecodeParam(String a_data)
    {
        return a_data.replace("[(am)]", "&").replace("[(eq)]", "=").replace("[(qu))]", "?").replace("[(ps)]", "%").replace("[(Sh)]", "#").replace("[(pl)]", "+");
    }

    public static String getCurrentMethodName()
    {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        PrintWriter printWriter = new PrintWriter(byteArrayOutputStream);
        (new Throwable()).printStackTrace(printWriter);
        printWriter.flush();
        String stackTrace = byteArrayOutputStream.toString();
        printWriter.close();
        StringTokenizer stringTokenizer = new StringTokenizer(stackTrace, "\n");
        stringTokenizer.nextToken();
        stringTokenizer.nextToken();
        String methodName = stringTokenizer.nextToken();
        return (new StringBuilder("[")).append(trim(methodName)).append("]").toString();
    }

    public static String getCurrentMethodNameFromThread(int stackLevel)
    {
        StackTraceElement stackTraceElement = Thread.currentThread().getStackTrace()[4 + stackLevel];
        String className = stackTraceElement.getClassName();
        String methodName = stackTraceElement.getMethodName();
        int lineNumber = stackTraceElement.getLineNumber();
        return (new StringBuilder(String.valueOf(className))).append(".").append(methodName).append(".").append(Integer.toString(lineNumber)).toString();
    }

    public static String getMethodName(boolean full, int offset)
    {
        String result = null;
        Throwable t = new Throwable();
        if(t != null)
        {
            StackTraceElement stes[] = t.getStackTrace();
            if(stes != null && stes.length > 0)
                if(full)
                    result = stes[offset].getClassName().concat(".").concat(stes[offset].getMethodName());
                else
                    result = stes[offset].getMethodName();
        }
        return result;
    }

    public static String SimpleEncode(String src)
    {
        return (new StringBuffer(Base64Coder.encodeString(src))).reverse().toString();
    }

    public static boolean isMobile(HttpServletRequest request)
    {
        String userAgent = request.getHeader("user-agent");
        boolean mobile1 = userAgent.matches(".*(iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson).*");
        boolean mobile2 = userAgent.matches(".*(LG|SAMSUNG|Samsung).*");
        return mobile1 || mobile2;
    }

    public static String getHttpData(HttpServletRequest request, String url)
    {
        BufferedReader oBufReader = null;
        HttpURLConnection httpConn = null;
        String strBuffer = "";
        String strRslt = "";
        try
        {
            URL oOpenURL = new URL(url);
            httpConn = (HttpURLConnection)oOpenURL.openConnection();
            httpConn.setRequestMethod("POST");
            httpConn.connect();
            oBufReader = new BufferedReader(new InputStreamReader(oOpenURL.openStream()));
            while((strBuffer = oBufReader.readLine()) != null) 
                if(strBuffer.length() > 1)
                    strRslt = (new StringBuilder(String.valueOf(strRslt))).append(strBuffer).toString();
            
            oBufReader.close();
        }
        catch(Exception ee)
        {
            ee.getMessage();
        }finally{
        	if ( oBufReader != null) oBufReader = null;
        }
        return strRslt;
    }

   
    static char alphaHex[] = {
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
        'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 
        'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 
        'y', 'z'
    };
    
}
