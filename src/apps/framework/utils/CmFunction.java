package apps.framework.utils;

import apps.framework.object.CmMap;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mortennobel.imagescaling.AdvancedResizeOp;
import com.mortennobel.imagescaling.ResampleOp;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.ibatis.io.Resources;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.tools.imageio.ImageIOUtil;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONObject;
import org.json.XML;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.imageio.ImageIO;
import javax.media.jai.JAI;
import javax.media.jai.RenderedOp;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.awt.Color;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.*;
import java.nio.channels.FileChannel;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.*;
import java.util.List;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@SuppressWarnings("rawtypes")
public class CmFunction {
	
	
	private static final Log	logger = LogFactory.getLog(CmFunction.class);
	private static final int	MAX_FRACTION_FIELD	= 64;

	// 1881 ~ 2050
	private static final String[]	LTBL
			= {"1212122322121", "1212121221220", "1121121222120", "2112132122122", "2112112121220",
			   "2121211212120", "2212321121212", "2122121121210", "2122121212120", "1232122121212",
			   "1212121221220", "1121123221222", "1121121212220", "1212112121220", "2121231212121",
			   "2221211212120", "1221212121210", "2123221212121", "2121212212120", "1211212232212",
			   "1211212122210", "2121121212220", "1212132112212", "2212112112210", "2212211212120",
			   "1221412121212", "1212122121210", "2112212122120", "1231212122212", "1211212122210",
			   "2121123122122", "2121121122120", "2212112112120", "2212231212112", "2122121212120",
			   "1212122121210", "2132122122121", "2112121222120", "1211212322122", "1211211221220",
			   "2121121121220", "2122132112122", "1221212121120", "2121221212110", "2122321221212",
			   "1121212212210", "2112121221220", "1231211221222", "1211211212220", "1221123121221",
			   "2221121121210", "2221212112120", "1221241212112", "1212212212120", "1121212212210",
			   "2114121212221", "2112112122210", "2211211412212", "2211211212120", "2212121121210",
			   "2212214112121", "2122122121120", "1212122122120", "1121412122122", "1121121222120",
			   "2112112122120", "2231211212122", "2121211212120", "2212121321212", "2122121121210",
			   "2122121212120", "1212142121212", "1211221221220", "1121121221220", "2114112121222",
			   "1212112121220", "2121211232122", "1221211212120", "1221212121210", "2121223212121",
			   "2121212212120", "1211212212210", "2121321212221", "2121121212220", "1212112112210",
			   "2223211211221", "2212211212120", "1221212321212", "1212122121210", "2112212122120",
			   "1211232122212", "1211212122210", "2121121122210", "2212312112212", "2212112112120",
			   "2212121232112", "2122121212110", "2212122121210", "2112124122121", "2112121221220",
			   "1211211221220", "2121321122122", "2121121121220", "2122112112322", "1221212112120",
			   "1221221212110", "2122123221212", "1121212212210", "2112121221220", "1211231212222",
			   "1211211212220", "1221121121220", "1223212112121", "2221212112120", "1221221232112",
			   "1212212122120", "1121212212210", "2112132212221", "2112112122210", "2211211212210",
			   "2221321121212", "2212121121210", "2212212112120", "1232212122112", "1212122122120",
			   "1121212322122", "1121121222120", "2112112122120", "2211231212122", "2121211212120",
			   "2122121121210", "2124212112121", "2122121212120", "1212121223212", "1211212221220",
			   "1121121221220", "2112132121222", "1212112121220", "2121211212120", "2122321121212",
			   "1221212121210", "2121221212120", "1232121221212", "1211212212210", "2121123212221",
			   "2121121212220", "1212112112220", "1221231211221", "2212211211220", "1212212121210",
			   "2123212212121", "2112122122120", "1211212322212", "1211212122210", "2121121122120",
			   "2212114112122", "2212112112120", "2212121211210", "2212232121211", "2122122121210",
			   "2112122122120", "1231212122212", "1211211221220", "2121121321222", "2121121121220",
			   "2122112112120", "2122141211212", "1221221212110", "2121221221210", "2114121221221"};

	private static final String[]	YUK
			= {"갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"};

	private static final String[]	GAP
			= {"자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"};

	private static final String[]	DDI
			= {"쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"};

	private static final String[]	WEEK
			= {"일", "월", "화", "수", "목", "금", "토"};
	
	private static final String[]	MONTH
			= {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
    
	private static final String[]	FULL_MONTH
		= {"Janurary", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};
	/**
	 * 
	 * @param obj
	 * @return
	 */
	public static String getStrVal(Object obj) {
		if (obj == null)
			return "";
		return getStrVal(obj.toString());
	}

	/**
	 * 
	 * @param str
	 * @return
	 */
	public static String getStrVal(String str) {
		if (str == null || "".equals(str))
			return "";
		return str.trim();
	}

    /**
     * Object => int 형으로 변환
     * @param i_oSource
     * @return
     */
    public static int getIntVal(Object i_oSource) {
        if ((null == i_oSource)) {
            return 0;
        }

        return getIntVal(i_oSource.toString());
    }
	
	/**
	 * String => int 형으로 변환
	 * @param str
	 * @return
	 */
	public static int getIntVal(String str) {
		int	iResult = 0;
		if (str != null && !str.equals("") ) {
			str	= getOnlyNumber(str);
			if ( !str.equals("") ) {
				iResult		= Integer.parseInt(str);
			}
		}
		return iResult;
	}
	
	/**
	 * String => int 형으로 변환
	 * @param str
	 * @return
	 */
	public static int getIntValue2(String str) {
		int	iResult = -1;
		
		if (str != null && !str.equals("") ) {
			str	= getOnlyNumber(str);
			if ( !str.equals("") ) {
				iResult		= Integer.parseInt(str);
			}
		}
		return iResult;
	}
	
	/**
	 * 
	 * @param str
	 * @return
	 */
	public static long getLongValue(String str) {
		long	iResult = 0;
		if (str != null && !str.equals("") ) {
			str	= getOnlyNumber(str);
			if ( !str.equals("") ) {
				iResult		= Long.parseLong(str);
			}
		}
		return iResult;
	}
	
	/**
	 * 숫자만 String으로 반환
	 * @param str
	 * @return
	 */
	public static String getOnlyNumber(String str) {
		StringBuffer sb	= new StringBuffer();
		if (str != null) {
			int len		= str.length();
			for (int i = 0; i < len; i++) {
				char	c	= str.charAt(i);
				if ((i == 0 && c == '-') || (c >= '0' && c <= '9')) {
					sb.append(c);
	           }				
			}
		}
		return sb.toString();
	}
	
	/**
	 * 영문, 숫자만 있는제 체크
	 * @param str
	 * @return
	 */
	public static boolean isOnlyEngOrNum(String str) {
		Pattern p = Pattern.compile("^[a-zA-Z0-9]*$");
		
		if (str == null || str.equals(""))
			return true;
		
		Matcher mc = p.matcher(str);
		
		return mc.matches();
	}
	
	/**
	 * 
	 * @param str
	 * @return
	 */
	public static double getDoubleVal(String str) {
		double d = 0;
		
		str = getOnlyDouble(str);
		if (!str.equals("")) {
			try {
				d = Double.parseDouble(str);
			} catch (Exception e) {
				d = 0;
			}
		}
		return d;
	}
	
	/**
	 * 
	 * @param str
	 * @return
	 */
	public static String getOnlyDouble(String str) {
		StringBuffer 	sb	= new StringBuffer();
		boolean isPoint	= true;
		
		if (str != null) {
			int len		= str.length();
			
			for (int i = 0; i < len; i++) {
				char	c	= str.charAt(i);
				
				if (c >= '0' && c <= '9' || (isPoint && c == '.')) {
					sb.append(c);
					
					if (c == '.') {
						isPoint	= false;
					}
				}
			}
		}
		return sb.toString();
	}
	
	/**
	 * Date => String
	 * @param date
	 * @param format
	 * @return
	 */
	public static String getDateToString(Date date, String format) {
		SimpleDateFormat sdf;
		
		if (format == null || format.equals(""))
			format = "yyyyMMdd";
		
		try {
			sdf = new SimpleDateFormat(format);
		} catch (Exception e) {
			sdf = new SimpleDateFormat("yyyyMMdd");
		}
		return sdf.format(date);
	}
	
	public static String SnsPolcyDate(String nowDay, int range_date) {
		try {
			DateFormat format = new SimpleDateFormat("yyyyMMdd");
			Date date = format.parse(nowDay.toString());
			
			Calendar calendar = Calendar.getInstance();
			
			calendar.setTime(date);
			
			calendar.add(Calendar.DATE, range_date);
			
			return format.format(calendar.getTime());
		
		} catch (ParseException e) {
			logger.error(e); //e.printStackTrace();
		}
		
		return "";
	}
	
	/**
	 * 오늘날짜 가져오기
	 * @param format
	 * @return
	 */
	public static String getTodayString(String format) {
		return getDateToString(new Date(), format);
	}
	
	/**
	 * 등록 년월일시분초 [YYYYMMDDHHMMSS]
	 * @return
	 */
	public static String getRegDate3() {
		return getTodayString("yyyy-MM-dd HH:mm:ss");
	}
	
	public static String getRegDate3(Date date) {
		return getTodayString("yyyy-MM-dd HH:mm:ss");
	}
	
	/**
	 * 등록 년월일시분초 [YYYYMMDDHHMMSS]
	 * @return
	 */
	public static String getRegDate14() {
		return getTodayString("yyyyMMddHHmmss");
	}

	/**
	 * 등록 년월일 [YYYYMMDD]
	 * @return
	 */
	public static String getRegDate8() {
		return getTodayString("yyyyMMdd");
	}
	
	/**
	 * 등록 년월 [YYYYMM]
	 * @return
	 */
	public static String getRegDate6() {
		return getTodayString("yyyyMM");
	}
	
	/**
	 * 등록 년 [YYYY]
	 * @return
	 */
	public static String getRegDate4() {
		return getTodayString("yyyy");
	}

	/**
	 * 등록 시분초 [HHMMSS]
	 * @return
	 */
	public static String getRegTime() {
		return getTodayString("HHmmss");
	}
	
	/**
	 * 등록 시분초 [HHMM]
	 * @return
	 */
	public static String getRegTime2() {
		return getTodayString("HHmm");
	}

	/**
	 * 입력한 날짜 기준 [년|월|일|] 차이를 구한다.
	 * @param date
	 * @param gapInt
	 * @return
	 */
	public static String getDateGapToString(String date, int gapInt){
		if (date == null)
			return "";
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		String str = getOnlyNumber(date);

		Calendar cal = Calendar.getInstance();

		cal.set(Integer.parseInt(str.substring(0, 4)),Integer.parseInt(str.substring(4,6))-1,Integer.parseInt(str.substring(6,8)));
		cal.add(Calendar.DATE, gapInt);
		
		return sdf.format(cal.getTime());	
	}
	
	/**
	 * 오늘 날짜 기준 [년|월|일|시|분|초] 차이를 구한다.
	 * @param paramInt
	 * @param gapInt
	 * @param format
	 * @return
	 */
	public static String getTodayGapToString(int paramInt, int gapInt, String format) {
		GregorianCalendar	calendar	= new GregorianCalendar();
		switch (paramInt) {
		case Calendar.YEAR :
			calendar.add(Calendar.YEAR, gapInt);
			break;
		case Calendar.MONTH :
			calendar.add(Calendar.MONTH, gapInt);
			break;
		case Calendar.DATE :
			calendar.add(Calendar.DATE, gapInt);
			break;
		case Calendar.HOUR :
			calendar.add(Calendar.HOUR, gapInt);
			break;
		case Calendar.MINUTE :
			calendar.add(Calendar.MINUTE, gapInt);
			break;
		case Calendar.SECOND :
			calendar.add(Calendar.SECOND, gapInt);
			break;
		}
		return getDateToString(calendar.getTime(), format);
	}

	/**
	 * 해당월의 마지막 일을 가져온다.
	 * @param strDate
	 * @return
	 */
	public static String getStrDateToMonthLastDate(String strDate) {
		
		if (strDate == null)
			return "";
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		String str = getOnlyNumber(strDate);

		Calendar cal = Calendar.getInstance();
		
		cal.set(Integer.parseInt(str.substring(0, 4)), Integer.parseInt(str.substring(4, 6)), 1);
		cal.add(Calendar.DATE, -1);
		
		return sdf.format(cal.getTime());
	}
	
	/**
	 * strDate => String
	 * @param strDate
	 * @param format
	 * @return
	 */
	public static String getStrDateToString(String strDate, String format) {
		ParsePosition pp = new ParsePosition(0);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		String result = "";
		Date date = null;
		int len;
		
		strDate = getOnlyNumber(strDate);
		len = strDate.length();
		
		if (len == 4) {
			strDate = getStringPad("RPAD", strDate + "0101", 14, '0');
		}
		else if (len == 6) {
			strDate = getStringPad("RPAD", strDate + "01", 14, '0');
		}
		else if (len > 6 && len < 14) {
			strDate = getStringPad("RPAD", strDate, 14, '0');
		}
		else if (len == 14) {
		}
		else if (len > 14) {
			strDate = strDate.substring(0, 14);
		}
		else {
			return strDate;
		}
		
		try {
			date = sdf.parse(strDate, pp);
			result = getDateToString(date, format); 
		} catch (Exception e) {
			result = strDate;
		}
		return result; 
	}
	
	/**
	 * 
	 * @param strDate
	 * @return
	 */
	public static String getPointYm(String strDate) {
		return getStrDateToString(strDate,  "yyyy.MM");
	}
	
	/**
	 * 
	 * @param strDate
	 * @return
	 */
	public static String getPointDt(String strDate) {
		return getStrDateToString(strDate,  "yyyy.MM.dd");
	}
	
	/**
	 * 
	 * @param strDate
	 * @return
	 */
	public static String getPointDtm(String strDate) {
		return getStrDateToString(strDate,  "yyyy.MM.dd HH:mm:ss");
	}
	
	/**
	 * 
	 * @return
	 */
	public static String getCmFromDt() {
		return getTodayGapToString(Calendar.DATE, -6, "yyyyMMdd");
	}
	
	/**
	 * 
	 * @return
	 */
	public static String getCmToDt() {
		return getTodayString("yyyyMMdd");
	}
	
	public static String getCmToMDt() {
		return getTodayString("MM/dd");
	}
	
	/**
	 * 년월일 [YYYYMMDD -> DD MM YYYY] ex : 20090712	- > 12 Jul 2009
	 * @param strDate
	 * @return
	 */
	public static String getUsDate(String strDate) {
		String sResult	= "";
		
		if (strDate != null && strDate.length() >= "YYYYMMDD".length() ) {
			String	sYear		= strDate.substring(0, 4);
			String 	sMonth		= strDate.substring(4, 6);
			String 	sDate		= strDate.substring(6, 8);
			
			int		iMonth		= getIntVal(sMonth);
			
			if (iMonth > 0 && iMonth < 13 ) {
				sResult	= sDate + " " + MONTH[iMonth - 1] + " " + sYear;
			}
		}
		return sResult;
	}
	
	/**
	 * 
	 * @param strDate
	 * @return
	 */
	public static String getUsDateTime(String strDate) {
		String sResult	= "";
		
		if (strDate != null && strDate.length() >= "YYYYMMDDHHMI".length() ) {
			String	sDate		= getUsDate(strDate);
			
			String 	sHour		= strDate.substring(8, 10);
			String 	sMinute		= strDate.substring(10, 12);
			
			if ( !sDate.equals("") ) {
				sResult	= sDate + " " + sHour + ":" + sMinute; 
			}
		}
		return sResult;
	}

	// 숫자 세 자리마다 ','를 표시
	public static String setNumComma(int i_iSource) {
		return setNumComma(Integer.toString(i_iSource));
	}

	public static String setNumComma(int i_iSource, int i_iFractionLength) {
		return setNumComma(Integer.toString(i_iSource), i_iFractionLength);
	}

	public static String setNumComma(long i_iSource) {
		return setNumComma(Long.toString(i_iSource));
	}

	public static String setNumComma(long i_iSource, int i_iFractionLength) {
		return setNumComma(Long.toString(i_iSource), i_iFractionLength);
	}

	public static String setNumComma(float i_dSource) {
		return setNumComma(Float.toString(i_dSource));
	}

	public static String setNumComma(float i_dSource, int i_iFractionLength) {
		return setNumComma(Float.toString(i_dSource), i_iFractionLength);
	}

	public static String setNumComma(double i_dSource) {
		return setNumComma(Double.toString(i_dSource));
	}

	public static String setNumComma(double i_dSource, int i_iFractionLength) {
		return setNumComma(Double.toString(i_dSource), i_iFractionLength);
	}

	public static String setNumComma(String i_sSource) {
		if ("".equals(getStrVal(i_sSource))) {
			return "";
		}
		return setNumComma(i_sSource, MAX_FRACTION_FIELD);
	}

	public static String setNumComma(String i_sSource, int i_iFractionLength) {
		String			result	= "";
		DecimalFormat	dFormat	= new DecimalFormat();

		if (MAX_FRACTION_FIELD != i_iFractionLength) {
			dFormat.setMinimumFractionDigits(i_iFractionLength);
			dFormat.setMaximumFractionDigits(i_iFractionLength);
		}

		result	= dFormat.format(Double.parseDouble(i_sSource));

		return result;
	}

	/**
	 * HTML 문자열 그대로 출력
	 * @param i_sSource
	 * @return
	 */
	public static String getHTMLEncode(String i_sSource) {
		String	result	= "";

		if ((null == i_sSource) || "".equals(i_sSource)) {
			return "";
		}

		result	= replace(replace(replace(i_sSource, "<", "&lt;"), ">", "&gt;"), "\"", "&quot;");

		return result;
	}
	
	/**
	 * 문자열의 byte 값을 가져온다.
	 * @param i_sSource
	 * @return
	 */
	public static int getStringByte(String i_sSource) {
		int		iResult		= 0;

		if (i_sSource != null && !i_sSource.equals("")) {
			try {
	    		
	    		char 	cTmp;
	    		byte[]	bTmp;
	    		
	    		for (int i = 0 ; i < i_sSource.length(); i++ )
	    		{
	    			cTmp	= i_sSource.charAt(i);
	    			
	    			bTmp		= ("" + cTmp).getBytes("UTF-8");
	    			iResult		+= bTmp.length;
	    		}
	    		
	    	} catch (Exception e) {
	    		logger.error(e); //e.printStackTrace();
	    	}
		}
		
		return iResult;
	}
	
	public static String getByteString(String i_sSource, String i_sLength) {
		return	getByteString(i_sSource, getIntVal(i_sLength));
	}

	// 문자열을 Byte 수 만큼 자르고 "..." 을 붙여 잘린 문자열임을 표시
    public static String getByteString(String i_sSource, int i_iLength) {
    	String	result	= "";

    	if ((null == i_sSource) || "".equals(i_sSource))
    		return result;

    	if (i_iLength <= 0)
    		return i_sSource;

    	try {
    		
    		char 	cTmp;
    		byte[]	bTmp;
    		int		nowLength	= 0;
    		int		strLemgth	= 0;
    		
    		for (int i = 0 ; i < i_sSource.length(); i++ ) {
    			cTmp	= i_sSource.charAt(i);
    			
    			bTmp		= ("" + cTmp).getBytes("UTF-8");
    			strLemgth	= bTmp.length;
    			
    			if (strLemgth == 3)
    				nowLength += 2;
    			else
    				nowLength += strLemgth;
    			
    			if (nowLength <= i_iLength) {
    				result	+= cTmp;
    			}
    			else
    			{
    				break;
    			}
    		}
    		
    		if (i_sSource.length() > result.length())
    			result += "...";
    		
    	} catch (Exception e) {
    		result	= i_sSource;
    	}

    	return result;
    }
    
    public static String getByteString2(String i_sSource, String i_iLength) {
    	return getByteString2(i_sSource, Integer.parseInt(i_iLength));
    }

    // 문자열을 Byte 수 만큼자른다
    public static String getByteString2(String i_sSource, int i_iLength) {
    	StringBuffer sb = new StringBuffer();
    	
    	if ((null == i_sSource) || "".equals(i_sSource))
    		return sb.toString();
    	
    	if (i_iLength <= 0)
    		return i_sSource;
    	
    	try {
    		
    		char 	cTmp;
    		byte[]	bTmp;
    		int		nowLength	= 0;
    		int		strLemgth	= 0;
    		
    		for (int i = 0 ; i < i_sSource.length(); i++ )
    		{
    			cTmp	= i_sSource.charAt(i);
    			
    			bTmp		= ("" + cTmp).getBytes("UTF-8");
    			strLemgth	= bTmp.length;
    			
    			if (strLemgth == 3)
    				nowLength += 2;
    			else
    				nowLength += strLemgth;
    			
    			if (nowLength <= i_iLength)
    			{
    				sb.append(cTmp);
    			}
    			else
    			{
    				break;
    			}
    		}
    		
    	} catch (Exception e) {
    		return i_sSource;
    	}
    	
    	return sb.toString();
    }
    
    
    public static String getByteStringUtf8(String i_sSource, int i_iLength) {
    	StringBuffer sb = new StringBuffer();
    	
    	if ((null == i_sSource) || "".equals(i_sSource))
    		return sb.toString();
    	
    	if (i_iLength <= 0)
    		return i_sSource;
    	
    	try {
    		
    		char 	cTmp;
    		byte[]	bTmp;
    		int		nowLength	= 0;
    		int		strLemgth	= 0;
    		
    		for (int i = 0 ; i < i_sSource.length(); i++ ) {
    			cTmp	= i_sSource.charAt(i);
    			
    			bTmp		= ("" + cTmp).getBytes("UTF-8");
    			strLemgth	= bTmp.length;
    			
    			if (strLemgth == 3)
    				nowLength += 3;
    			else
    				nowLength += strLemgth;
    			
    			if (nowLength <= i_iLength) {
    				sb.append(cTmp);
    			}
    			else {
    				break;
    			}
    		}
    		
    	} catch (Exception e) {
    		return i_sSource;
    	}
    	
    	return sb.toString();
    }
    
	// 문자열에서 <br>만 남기고 모든 HTML 태그 삭제
	public static String removeHTML(String i_sHTML) {
		String	result	= "";

		if ((null == i_sHTML) || "".equals(i_sHTML)) {
			return "";
		}

		i_sHTML	= replace(i_sHTML, "<br>", "@#$%^&*");
		i_sHTML	= replace(i_sHTML, "<BR>", "@#$%^&*");
		i_sHTML	= replace(i_sHTML, "<Br>", "@#$%^&*");
		i_sHTML	= replace(i_sHTML, "<bR>", "@#$%^&*");

		result	= i_sHTML.replaceAll("<.+?>", "");

		result	= replace(result, "@#$%^&*", "<br>");

		result	= replace(result, "P {margin-top:2px;margin-bottom:2px;}", "");

		return result;
	}
	
	// 문자열에서 모든 HTML 태그 삭제
	public static String removeAllHTML(String i_sHTML) {
		String	result	= "";
		
		if ((null == i_sHTML) || "".equals(i_sHTML)) {
			return "";
		}
		result	= i_sHTML.replaceAll("<.+?>", "");
		return result;
	}
	
	// 문자열에서 모든 HTML 태그 삭제
	public static String removeHtmlForCmnt(String i_sHTML) {
		String	result	= "";
		
		if ((null == i_sHTML) || "".equals(i_sHTML)) {
			return "";
		}
		result	= i_sHTML.replaceAll("<.+?>", "").replaceAll("\\[image#(.*?)\\]", "").replaceAll("&nbsp;", " ");
		return result;
	}
	
	// 문자열에서 모든 HTML 태그 삭제
	public static String changeBoardContent(String content) {
		String	result	= "";
		
		if ((null == content) || "".equals(content)) {
			return "";
		}
		result	= content.replaceAll("<.+?>", "").toLowerCase().replaceAll("&nbsp;", "").replaceAll(" ", "");
		return result;
	}

	// 문자열 교체 함수
	public static String replace(String i_sOrigin, String i_sPattern, String i_sReplace) { 
		int	sIndex	= 0; 
		int	eIndex	= 0; 

		if ((null == i_sOrigin) || "".equals(i_sOrigin)) {
			return "";
		}

		StringBuffer	result	= new StringBuffer(); 

		while ((eIndex = i_sOrigin.indexOf(i_sPattern, sIndex)) >= 0) { 
			result.append(i_sOrigin.substring(sIndex, eIndex)); 
			result.append(i_sReplace); 

			sIndex	= eIndex + i_sPattern.length(); 
		}

		result.append(i_sOrigin.substring(sIndex)); 

		return result.toString(); 
	}

	// 파일 경로 생성
    public static boolean makeFilePath(String i_sFullPathWithFileName) {
    	boolean	result	= true;

    	if ((null == i_sFullPathWithFileName) || "".equals(i_sFullPathWithFileName)) {
    		result	= false;
    		return result;
    	}

    	String[]	arrFullPath	= i_sFullPathWithFileName.split("/", -1);
    	String		filePath	= "";
    	File		file		= null;

    	if (null != arrFullPath) {
	    	for (int i = 0; i < arrFullPath.length - 1; i++) {
	    		filePath	= filePath + arrFullPath[i] + "/";

	    		file	= new File(filePath);
	    		if (!file.exists()) {
	    			result	= file.mkdir();
	    		}
	    	}
    	}

    	return result;
    }

    // 파일 복사
    public static boolean fileCopy(String i_sSourceFilePath, String i_sTargetFilePath) {
    	boolean	result	= true;

    	FileInputStream 	inputStream 	= null;         
    	FileOutputStream 	outputStream 	= null;
    	File				targetfile		= null;
    	FileChannel 		fcin			= null;
    	FileChannel 		fcout			= null;
    	long 				size			= 0l;    

    	makeFilePath(i_sTargetFilePath);
    	
    	try {
    		targetfile		= new File(i_sTargetFilePath);
    		
    		if (targetfile.exists())
	    	{
	    		fileDelete(i_sTargetFilePath);
	    	}
    		
    		inputStream 	= new FileInputStream(i_sSourceFilePath); 
    		outputStream 	= new FileOutputStream(i_sTargetFilePath);
    		fcin			= inputStream.getChannel();
    		fcout			= outputStream.getChannel();
    		size			= fcin.size();
    		
    		fcin.transferTo(0, size, fcout);
    		
    	} catch (Exception e) {
    		result		= false;
    		logger.error(e); //e.printStackTrace();
    	} finally {
    		try {
				fcout.close();
	    		fcin.close();
	    		outputStream.close();
	    		inputStream.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
	    		result		= false;
				logger.error(e); //e.printStackTrace();
			}
    		
    	}

    	return result;
    }
    
    // 파일 삭제
    public static boolean fileDelete(String i_sSourceFilePath)
    {
    	boolean	result	= true;
    	
    	File file	= new File( i_sSourceFilePath );
    	
    	if (file.exists()) 
    	{
    		try {
    			file.delete();
    		} catch (Exception e) {
    			result		= false;
    			
    			if (logger.isDebugEnabled()) {
    				logger.debug("### CmFunction error ###");
    				logger.debug("### CmFunction.fileDelete( " + i_sSourceFilePath + " ) ###");
    			}
    			
    			logger.error(e); //e.printStackTrace();
    		}
    	}
    	return result;
    }
    
    public static boolean fileMove(String i_sSourceFilePath, String i_sTargetFilePath) {
    	boolean	result	= true;
    	
    	result		= fileCopy(i_sSourceFilePath, i_sTargetFilePath);
    	
    	if (result)
    	{
    		result		= fileDelete(i_sSourceFilePath);
    	}
    	return result;
    }

	// Thumbnail 이미지 만들기
	public static boolean createThumbnail(File sourceFile , String targetPath , String targetFileName, int width, int height) {
		boolean	result	= true;
		
		System.setProperty("java.awt.headless", "true");
		
		if (logger.isDebugEnabled())
			logger.debug("!!!! [start] createThumbnail !!!!");
		
		if (sourceFile == null || !sourceFile.exists()) {
			return false;
		}
		
		try {
			
			RenderedOp renderedOp = JAI.create("fileload", sourceFile.getPath());
			
			int imgWidth = renderedOp.getWidth();
			int imgHeight = renderedOp.getHeight();
			int destWidth = -1;
			int destHeight = -1;
			
			if (logger.isDebugEnabled()) {
				logger.debug("sourceFile : " + sourceFile.getPath());
				logger.debug("targetFile " + targetPath + targetFileName);
				logger.debug("sourceImg : width = " + imgWidth + ", height = " + imgHeight);
				logger.debug("targetImg : width = " + width + ", height = " + height);
			}
			
			// 가로, 세로 모두 변경
			if (width > 0 && height > 0) {
				if (imgWidth <= width) {
					destWidth = imgWidth;
				}
				else {
					destWidth = width;
				}
				if (imgHeight <= height) {
					destHeight = imgHeight;
				}
				else {
					destHeight = height;
				}
			}
			// 가로 변경
			else if (width > 0 && height <= 0) {
				if (imgWidth <= width) {
					destWidth = imgWidth;
					destHeight = imgHeight;
				}
				else {
					destWidth = width;
					destHeight = (int)(imgHeight * width / imgWidth); 
				}
			}
			// 세로 변경
			else if (width <= 0 && height > 0) {
				if (imgHeight <= height) {
					destWidth = imgWidth;
					destHeight = imgHeight;
				}
				else {
					destWidth = (int)(imgWidth * height / imgHeight);
					destHeight = imgHeight;
				}
			}
			
			// 크기 변경이 없을 경우 복사만
			if (imgWidth == destWidth && imgHeight == destHeight) {
				fileCopy(sourceFile.getPath(), targetPath + targetFileName);
			}
			else {
			
				String imageName = sourceFile.getName().toLowerCase();
				String imageExt = imageName.substring(imageName.lastIndexOf(".") + 1, imageName.length());
				
				BufferedImage srcImage = ImageIO.read(sourceFile);
				
				ResampleOp resampleOp = new ResampleOp(destWidth, destHeight);
				resampleOp.setUnsharpenMask(AdvancedResizeOp.UnsharpenMask.Soft);
				
				BufferedImage rescaledImage = resampleOp.filter(srcImage, null);
				
				File file = new File(targetPath);
				
				if (!file.exists()) {
					file.mkdirs();
				}
				
				ImageIO.write(rescaledImage, imageExt, new File(targetPath + targetFileName));
			}
			
			/*
			
			BufferedImage sourceImage = renderedOp.getAsBufferedImage();
			BufferedImage thumbImage = new BufferedImage(destWidth, destHeight, imageExt.equals("png") ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB);
			Graphics2D graphics2D = thumbImage.createGraphics();
			graphics2D.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
			graphics2D.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
			graphics2D.drawImage(sourceImage, 0, 0, destWidth, destHeight, null);
			graphics2D.dispose();
			
			File file = new File(targetPath);
			
			if (!file.exists()) {
				file.mkdirs();
			}
			
			ImageIO.write(thumbImage, imageExt, new File(targetPath + targetFileName));
			*/
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
			result = false;
		}
		finally {
			if (logger.isDebugEnabled())
				logger.debug("!!!! [end] createThumbnail !!!!");
		}
		return result;
	}
	
	
	// Thumbnail 이미지 만들기
	public static boolean createThumbnail(File sourceFile , String targetPath , String targetFileName, int width, int height, String flagFixed) {
		boolean	result	= true;
		
		System.setProperty("java.awt.headless", "true");
		
		if (logger.isDebugEnabled())
			logger.debug("!!!! [start] createThumbnail !!!!");
		
		if (sourceFile == null || !sourceFile.exists()) {
			return false;
		}
		
		try {
			
			RenderedOp renderedOp = JAI.create("fileload", sourceFile.getPath());
			
			int imgWidth = renderedOp.getWidth();
			int imgHeight = renderedOp.getHeight();
			int destWidth = -1;
			int destHeight = -1;
			
			if (logger.isDebugEnabled()) {
				logger.debug("sourceFile : " + sourceFile.getPath());
				logger.debug("targetFile " + targetPath + targetFileName);
				logger.debug("sourceImg : width = " + imgWidth + ", height = " + imgHeight);
				logger.debug("targetImg : width = " + width + ", height = " + height);
			}
			
			// 가로, 세로 모두 변경
			if (width > 0 && height > 0) {
				if (imgWidth <= width) {
					destWidth = imgWidth;
				}
				else {
					destWidth = width;
				}
				if (imgHeight <= height) {
					destHeight = imgHeight;
				}
				else {
					destHeight = height;
				}
			}
			// 가로 변경
			else if (width > 0 && height <= 0) {
				if (imgWidth <= width) {
					destWidth = imgWidth;
					destHeight = imgHeight;
				}
				else {
					destWidth = width;
					destHeight = (int)(imgHeight * width / imgWidth); 
				}
			}
			// 세로 변경
			else if (width <= 0 && height > 0) {
				if (imgHeight <= height) {
					destWidth = imgWidth;
					destHeight = imgHeight;
				}
				else {
					destWidth = (int)(imgWidth * height / imgHeight);
					destHeight = imgHeight;
				}
			}
			
			// 크기 변경이 없을 경우 복사만
			if (imgWidth == destWidth && imgHeight == destHeight) {
				fileCopy(sourceFile.getPath(), targetPath + targetFileName);
			}
			else {
			
				String imageName = sourceFile.getName().toLowerCase();
				String imageExt = imageName.substring(imageName.lastIndexOf(".") + 1, imageName.length());
				
				BufferedImage srcImage = ImageIO.read(sourceFile);
				
				ResampleOp resampleOp = new ResampleOp(destWidth, destHeight);
				resampleOp.setUnsharpenMask(AdvancedResizeOp.UnsharpenMask.Soft);
				
				BufferedImage rescaledImage = resampleOp.filter(srcImage, null);
				
				File file = new File(targetPath);
				
				if (!file.exists()) {
					file.mkdirs();
				}
				
				ImageIO.write(rescaledImage, imageExt, new File(targetPath + targetFileName));
			}
			
			/*
			BufferedImage sourceImage = renderedOp.getAsBufferedImage();
			BufferedImage thumbImage = new BufferedImage(destWidth, destHeight, imageExt.equals("png") ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB);
			Graphics2D graphics2D = thumbImage.createGraphics();
			graphics2D.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
			graphics2D.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
			graphics2D.drawImage(sourceImage, 0, 0, destWidth, destHeight, null);
			graphics2D.dispose();
			
			File file = new File(targetPath);
			
			if (!file.exists()) {
				file.mkdirs();
			}
			
			ImageIO.write(thumbImage, imageExt, new File(targetPath + targetFileName));
			*/
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
			result = false;
		}
		finally {
			if (logger.isDebugEnabled())
				logger.debug("!!!! [end] createThumbnail !!!!");
		}
		return result;
	}
	
	/**
	 * Crop
	 * @param sourceFile
	 * @param targetPath
	 * @param targetFileName
	 * @param cropWidth
	 * @param cropHeight
	 * @return
	 */
	public static File createCrop(File sourceFile , String targetPath , String targetFileName, int cropWidth, int cropHeight) {
		
		File rtnFile = null;
		
		try {
			BufferedImage srcImage = ImageIO.read(sourceFile);
			
			if (cropWidth == 0 && cropHeight == 0) {
				return null;
			}
			
			if (cropHeight == 0) {
				cropHeight = cropWidth;
			}
			
			if (cropWidth == 0) {
				cropWidth = cropHeight;
			}
			
			int srcImageWidth = srcImage.getWidth();
			int srcImageHeight = srcImage.getHeight();
			
			int regionX1 = (int)(Math.round((double)srcImageWidth / 2) - Math.round((double)cropWidth / 2));
			int regionY1 = (int)(Math.round((double)srcImageHeight / 2) - Math.round((double)cropHeight / 2));
			
			rtnFile = new File(targetPath + targetFileName);
			
			Thumbnails.of(sourceFile).sourceRegion(regionX1, regionY1, cropWidth, cropHeight).size(cropWidth, cropHeight).toFile(rtnFile);
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		
		return rtnFile;
	}
	
	

	// 음력 -> 양력변환
	public static String convertLunar2Solar(String i_sDate) {
		return convertLunar2Solar(i_sDate, true);
	}

	// 음력 -> 양력변환
	public static String convertLunar2Solar(String i_sDate, boolean i_iIsYun) {
		if (CmFunction.getStrVal(i_sDate).length() < 8) {
			return "";
		}

		int	iYear	= Integer.parseInt(i_sDate.substring(0, 4));
		int	iMonth	= Integer.parseInt(i_sDate.substring(4, 6));
		int	iDate	= Integer.parseInt(i_sDate.substring(6, 8));

		return convertLunar2Solar(iYear, iMonth, iDate, i_iIsYun);
	}

	// 음력 -> 양력변환
	public static String convertLunar2Solar(int i_iYear, int i_iMonth, int i_iDate) {
		return convertLunar2Solar(i_iYear, i_iMonth, i_iDate, true);
	}

	// 음력 -> 양력변환
	public static String convertLunar2Solar(int i_iYear, int i_iMonth, int i_iDate, boolean i_iIsYun) {
		String	result	= "";
		int		sYear	= 0;
		int		sMonth	= 0;
		int		sDate	= 0;

		int[]	LDAY = {31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

		if ((i_iYear < 1881) && (i_iYear > 2050)) {
			return result;
		}

		if ((i_iMonth + 1) > 13) {
			return result;
		}

		int	iYearIndex		= i_iYear - 1881;
		int	iMonthIndex1	= 0;
		int	iMonthIndex2	= 0;
		int	iDayCount		= 0;
		int	iDateLeap		= 0;

		boolean	iIsYun		= false;

		if ("0".equals(LTBL[iYearIndex].substring(LTBL[iYearIndex].length() - 1))) {
			iIsYun	= false;
		} else {
			if (Integer.parseInt(LTBL[iYearIndex].substring(i_iMonth, (i_iMonth + 1))) > 2) {
				iIsYun	= true;
			} else {
				iIsYun	= false;
			}
		}

		iIsYun	&= i_iIsYun;

		iYearIndex	= -1;
		iDayCount	= 0;

		if ((i_iYear >= 1881) && (i_iYear < 2050)) {
			iYearIndex	= i_iYear - 1881;

			for (int i = 0; i < iYearIndex; i++) {
				for (int j = 0; j < LTBL[i].length(); j++) {
					iDayCount	+= Integer.parseInt(LTBL[i].substring(j, j + 1));
				}

				if ("0".equals(LTBL[i].substring(LTBL[i].length() - 1))) {
					iDayCount	+= 336;
				} else {
					iDayCount	+= 362;
				}
			}
		} else {
			result	= "0";
		}

		iYearIndex++;
		iMonthIndex1	= i_iMonth - 1;
		iMonthIndex2	= -1;

		do {
			iMonthIndex2++;

			if (Integer.parseInt(LTBL[iYearIndex].substring(iMonthIndex2, iMonthIndex2 + 1)) > 2) {
				iDayCount	= iDayCount + 26 + Integer.parseInt(LTBL[iYearIndex].substring(iMonthIndex2, iMonthIndex2 + 1));
				iMonthIndex1++;
			} else {
				if (iMonthIndex2 == iMonthIndex1) {
					if (iIsYun) {
						iDayCount	= iDayCount + 28 + Integer.parseInt(LTBL[iYearIndex].substring(iMonthIndex2, iMonthIndex2 + 1));
					}

					break;
				} else {
					iDayCount	= iDayCount + 28 + Integer.parseInt(LTBL[iYearIndex].substring(iMonthIndex2, iMonthIndex2 + 1));
				}
			}
		} while (true);

		iDayCount	= iDayCount + i_iDate + 29;
		iYearIndex	= 1880;

		do {
			iYearIndex++;
			if (((iYearIndex % 400) == 0) || ((iYearIndex % 100) != 0) && ((iYearIndex % 4) == 0)) {
				iDateLeap	= 1;
			} else {
				iDateLeap	= 0;
			}

			iMonthIndex2	= 365 + iDateLeap;

			if (iDayCount < iMonthIndex2) {
				break;
			}

			iDayCount	-= iMonthIndex2;
		} while (true);

		sYear	= iYearIndex;
		LDAY[1]	= iMonthIndex2 - 337;

		iYearIndex	= 0;
		do {
			iYearIndex++;
			if (iDayCount <= LDAY[iYearIndex - 1]) {
				break;
			}

			iDayCount	-= LDAY[iYearIndex - 1];
		} while (true);

		sMonth	= iYearIndex;
		sDate	= iDayCount;

		iDayCount	= (sYear - 1) * 365 + (sYear - 1) / 4 - (sYear - 1) / 100 + (sYear - 1) / 400;

		if (((sYear % 400) == 0) || ((sYear % 100) != 0) && ((sYear % 4) == 0)) {
			iDateLeap	= 1;
		} else {
			iDateLeap	= 0;
		}

		LDAY[1]	= 28 + iDateLeap;

		for (int i = 0; i < sMonth - 1; i++) {
			iDayCount	+= LDAY[i];
		}

		iDayCount	+= sDate;

		result	= Integer.toString(sYear)
					+ (((sMonth < 10) ? "0" : "") + Integer.toString(sMonth))
					+ (((sDate  < 10) ? "0" : "") + Integer.toString(sDate))
					+ "/" + WEEK[(iDayCount % 7)] + "요일";
		return result;
	}

	// 양력 -> 음력변환
	public static String convertSolar2Lunar(String i_sDate) {
		if (CmFunction.getStrVal(i_sDate).length() < 8) {
			return "";
		}

		int	iYear	= Integer.parseInt(i_sDate.substring(0, 4));
		int	iMonth	= Integer.parseInt(i_sDate.substring(4, 6));
		int	iDate	= Integer.parseInt(i_sDate.substring(6, 8));

		return convertSolar2Lunar(iYear, iMonth, iDate);
	}

	// 양력 -> 음력변환
	public static String convertSolar2Lunar(int i_iYear, int i_iMonth, int i_iDate) {
		String	result	= "";
		int		sYear	= 0;
		int		sMonth	= 0;
		int		sDate	= 0;

		int[]	LDAY = {31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

		int		i;

		if ((i_iYear < 1881) && (i_iYear > 2050)) {
			return result;
		}

		if ((i_iMonth + 1) > 13) {
			return result;
		}

		int	iYearIndex		= i_iYear - 1881;
		int	iMonthIndex1	= 0;
		int	iMonthIndex2	= 0;

		boolean	iIsYun		= false;

		if ("0".equals(LTBL[iYearIndex].substring(LTBL[iYearIndex].length() - 1))) {
			iIsYun	= false;
		} else {
			if (Integer.parseInt(LTBL[iYearIndex].substring(i_iMonth, (i_iMonth + 1))) > 2) {
				iIsYun	= true;
			} else {
				iIsYun	= false;
			}
		}

		int[]	iDayCount	= new int[169];

		for (i = 0; i < 169; i++) {
			iDayCount[i]	= 0;

			for (int j = 0; j < LTBL[i].length(); j++) {
				switch (Integer.parseInt(LTBL[i].substring(j, j + 1))) {
					case	1 :
					case	3 :
						iDayCount[i]	+= 29;
						break;
					case	2 :
					case	4 :
						iDayCount[i]	+= 30;
						break;
				}
			}
		}

		int	iTotalDate1	= 1880 * 365 + 1880 / 4 - 1880 / 100 + 1880 / 400 + 30;
		int	iTotalDate2	= (i_iYear - 1) * 365 + (i_iYear - 1) / 4 - (i_iYear - 1) / 100 + (i_iYear - 1) / 400;

		if ((i_iYear % 400 == 0) || (i_iYear % 100 != 0) && (i_iYear % 4 == 0)) {
			LDAY[1]	= 29;
		} else {
			LDAY[1]	= 28;
		}

		for (i = 0; i < i_iMonth - 1; i++) {
			iTotalDate2	+= LDAY[i];
		}

		iTotalDate2	+= i_iDate;

		iTotalDate1	= iTotalDate2 - iTotalDate1 + 1;
		iTotalDate2	= iDayCount[0];

		for (i = 0; i < iDayCount.length - 1; i++) {
			if (iTotalDate1 <= iTotalDate2) {
				break;
			}

			iTotalDate2	+= iDayCount[i + 1];
		}

		sYear	= i + 1881;
		iTotalDate2	-= iDayCount[i];
		iTotalDate1	-= iTotalDate2;

		if ("0".equals(LTBL[i].substring(LTBL[i].length() - 1))) {
			iMonthIndex1	= 11;
		} else {
			iMonthIndex1	= 12;
		}

		iMonthIndex2	= 0;

		for (int j = 0; j <= iMonthIndex1; j++) {
			if (Integer.parseInt(LTBL[i].substring(j, j + 1)) <= 2) {
				iMonthIndex2++;
				iYearIndex	= Integer.parseInt(LTBL[i].substring(j, j + 1)) + 28;
				iIsYun		= false;
			} else {
				iYearIndex	= Integer.parseInt(LTBL[i].substring(j, j + 1)) + 26;
				iIsYun		= true;
			}

			if (iTotalDate1 <= iYearIndex) {
				break;
			}

			iTotalDate1	-= iYearIndex;
		}

		sMonth	= iMonthIndex2;
		sDate	= iTotalDate1;

		result	= Integer.toString(sYear)
					+ (((sMonth < 10) ? "0" : "") + Integer.toString(sMonth))
					+ (((sDate  < 10) ? "0" : "") + Integer.toString(sDate))
					+ "/" + (iIsYun ? "윤달" : "평달")
					+ "/" + YUK[((sYear + 6) % 10)] + GAP[(sYear + 8) % 12] + "년"
					+ "/" + DDI[(sYear + 8) % 12];

		return result;
	}
	
	/**
	 * strDate => String
	 * @param strDate
	 * @return
	 */
	public static String getStrWeekToString(String strDate) {
		
		ParsePosition pp = new ParsePosition(0);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		String result = "";
		Date date = null;
		int len;
		
		strDate = getOnlyNumber(strDate);
		len = strDate.length();
		
		if (len == 4) {
			strDate = getStringPad("RPAD", strDate + "0101", 14, '0');
		}
		else if (len == 6) {
			strDate = getStringPad("RPAD", strDate + "01", 14, '0');
		}
		else if (len > 6 && len < 14) {
			strDate = getStringPad("RPAD", strDate, 14, '0');
		}
		else if (len == 14) {
		}
		else if (len > 14) {
			strDate = strDate.substring(0, 14);
		}
		else {
			return strDate;
		}
		
		try {
			date = sdf.parse(strDate, pp);			
			Calendar cal = Calendar.getInstance() ;
		    cal.setTime(date);
		    
		    int dayNum = cal.get(Calendar.DAY_OF_WEEK) - 1;			
			result = WEEK[dayNum];			
			
		} catch (Exception e) {
			result = strDate;
		}
		return result; 
	}
	
	// 다국어
	public static ResourceBundle getBundle(String str, HttpServletRequest request) {
		
		ResourceBundle bundle 		= null;
		String	tmpStr			 	= request.getHeader("Accept-Language");
		String	sAcceptLanguage 	= "en";
		
		if (tmpStr != null && tmpStr.length() > 1)
		{
			sAcceptLanguage 	= tmpStr.substring(0, 2).toLowerCase();
		}
		java.util.Locale locale 	= new java.util.Locale(sAcceptLanguage, "");

		try {
			bundle = ResourceBundle.getBundle(str, locale);
		} catch (Exception e) { 
			bundle = ResourceBundle.getBundle(str, Locale.ENGLISH);
		}
		
		return bundle;
	}
	
	public static String getBundleString(String str) {
		
		String baseName = getBaseName(str);
		
		ResourceBundle bundle = CmFunction.getBundle(baseName, String.valueOf(CmFunction.getCurrentRequest().getSession().getAttribute("s_language")));
		
		return CmFunction.getBundleString(str, bundle);
	}
	
	public static String getBaseName(String str) {
		
		String baseName = "message.pms.";
		
		String str3 = str.replace(".", "_");
		
		String[] strArray = str3.split("_");
		
		str3 = str3.replace("_"+strArray[strArray.length - 1], "");
		
		return baseName+str3;
	}
	

	// 다국어
	public static ResourceBundle getBundle(String str, String lenguage) {
		ResourceBundle bundle 		= null;
		java.util.Locale locale 	= new java.util.Locale(lenguage.toLowerCase(), "");
		try {
			bundle = ResourceBundle.getBundle(str, locale);
		} catch (Exception e) { 
			bundle = ResourceBundle.getBundle(str, Locale.ENGLISH);
		}
		return bundle;
	}
	
	
	// 다국어
	public static String getBundleString(String str, ResourceBundle bundle) {
		String returnStr	= "";
		try {
			returnStr = bundle.getString(str).replaceAll("\r\n", "<br/>");
		} catch (Exception e) {
			returnStr		= "<font color='red'>Text error</font>";
			if (logger.isDebugEnabled()) {
				logger.debug("#######################");
				logger.debug("# str    : " + str);
				logger.debug("#######################");
			}
		}
		return  returnStr;
	}
	
	public static String getBundleString2(String str, ResourceBundle bundle) {
		String returnStr	= "";
		try {
			returnStr = bundle.getString(str);
		} catch (Exception e) {
			returnStr		= "<font color='red'>Text error</font>";
			if (logger.isDebugEnabled()) {
				logger.debug("#######################");
				logger.debug("# str    : " + str);
				logger.debug("#######################");
			}
		}
		return  returnStr;
		
	}

	// 랜덤 영문 숫자 조합 ( 영문보다 숫자가 나올 확률이 2배 높다. )
	public static String getRandomString(int strLength) {
		
		String 		returnStr	= "";
		String[] 	strArr		= new String[]{"0123456789", "0123456789", "abcdefghijklmnopqrstuvwxyz", "abcdefghijklmnopqrstuvwxyz", "abcdefghijklmnopqrstuvwxyz"};
		int			len			= strArr.length;
		Random		random		= new Random();
		
		for (int i = 0; i < strLength; i++)
		{
			int iRan1 	= random.nextInt(len);
			int iRan2	= random.nextInt(strArr[iRan1].length());
			returnStr	+= strArr[iRan1].substring(iRan2, iRan2+1);
		}
		return returnStr;
	}
	
	/**
	 * 영문만
	 * @param strLength
	 * @return
	 */
	public static String getRandomOnlyString(int strLength) {
		
		StringBuffer sb	= new StringBuffer();
		
		String	str			= "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		int 	len 		= str.length();
		Random	random		= new Random();
		
		for (int i = 0; i < strLength; i++) {
			int iRan1 	= random.nextInt(len);
			sb.append(str.substring(iRan1, iRan1+1));
		}
		return sb.toString();
	}
	
	/**
	 * cookie
	 * @param cookieName
	 * @return
	 */
	public static String getCookie(String cookieName) {
		Cookie[] 	cookies 	= getCurrentRequest().getCookies();
		
		String resultStr = "";
		if(ArrayUtils.isNotEmpty(cookies)) {
			for( int i = 0; i < cookies.length; i++ ) {
				Cookie thisCookie =  cookies[i];
				if ( thisCookie.getName().equals(cookieName) ) {
					resultStr   = thisCookie.getValue();
					break;
				}
			}					
		} else {
			return "";
		}
		
		return resultStr;
	}
	
	/**
	 * Cookie 저장
	 * @param response
	 * @param cookieName
	 * @param cookieValue
	 * @param day
	 */
	public static void setCookie(HttpServletResponse response, String cookieName, String cookieValue, int day) {
		try {
			Cookie	cookie		= new Cookie(cookieName, cookieValue);
			if (day > 0) {
				cookie.setMaxAge(day * 60 * 60 * 24);
			}
			else {
				cookie.setMaxAge(day);
			}
			cookie.setPath("/");
			response.addCookie(cookie);
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
	}
	
	// LPAD, RPAD
	public static String getStringPad(String type, String str, int len, char spaceChr) {
		String	sResult		= "";
		int		strLen		= 0;
		
		if (str == null)	str		= "";
		
		strLen	= str.length();
		
		if (strLen < len) {
			for (int i = 0; i < len - strLen ; i++) {
				sResult	+= spaceChr;
			}
			
			if ("LPAD".equals(type.toUpperCase()) ) {
				sResult	+= str;
			}
			else if ("RPAD".equals(type.toUpperCase()) ) {
				sResult	=  str + sResult;
			}
		}
		else {
			sResult		= str;
		}
		
		return sResult;
	}

	// 파일경로 가져오기
	public static String getAttachFileUrl(String sFullUrl ) {
		String	sReturn = "";
		
		if (sFullUrl != null) {
			sReturn		= sFullUrl.replaceAll(CmPathInfo.getROOT_PATH() , "/");
		}
		return sReturn;
	}
	
	// 파일경로 가져오기
	public static String getAttachFileUrl(String sAttachId, String sAttachExt, String sAttachPath ) {
		String	sReturn = "";
		
		if (sAttachId != null && sAttachExt != null && sAttachPath != null) {
			sReturn		= getAttachFileUrl(sAttachPath + sAttachId + sAttachExt);
		}
		return sReturn;
	}
	
	// 텍스트를 * 로 변환  (ex : ("abcdebe" , 2)  = ab*****)
	public static String getStringHidden(String i_sSourcd, int length) {
		String	sReturn	= "";
		
		if (i_sSourcd != null && !i_sSourcd.equals("")) {
			int	strLen		= i_sSourcd.length();
			
			for (int i = 0; i < strLen; i++) {
				if (i < length) {
					sReturn		+= i_sSourcd.charAt(i);
				}
				else {
					sReturn		+= "*";
				}
			}
		}
		return sReturn;
	}
	
	// 텍스트를 * 로 변환  (ex : ("abcdebe" , 2)  = abcde**)
	public static String getStringReverseHidden(String i_sSourcd, String length) {
		return getStringHidden(i_sSourcd, getIntVal(length));
	}
	
	// e-mail    (ex : ("abcdebe@test.com" , 2)  = ab*****@test.com)
	public static String getEmailHidden(String i_sEmail, String sLength) {
		
		int	length		= 0;
		
		try {
			length	= Integer.parseInt(sLength);
		} catch (Exception e) {
			length	= 2;
		}
	
		return getEmailHidden(i_sEmail, length);
	}
	
	// e-mail    (ex : ("abcdebe@test.com" , 2)  = ab*****@test.com)
	public static String getEmailHidden(String i_sEmail, int length) {
		String	sReturn	= "";
		
		if (i_sEmail != null && !i_sEmail.equals(""))
		{
			if (i_sEmail.indexOf("@") > -1)
			{
				String	emailFirst	= i_sEmail.substring(0, i_sEmail.indexOf("@"));
				String	emailLast	= i_sEmail.substring(i_sEmail.indexOf("@"), i_sEmail.length());
				
				sReturn	= getStringHidden(emailFirst, length) + emailLast;
			}
			else
			{
				sReturn		= getStringHidden(i_sEmail, length);
			}
		}
		return sReturn;
	}
	
	/**
	 * 해당 url의 html을 가져온다.
	 * @param i_sUrl
	 * @return
	 */
	public static String urlToString(String i_sUrl, String charset) {
		String	sReturn			= "";
		
		try {
			
			
			URL					url			= new URL(i_sUrl);
			HttpURLConnection	conn		= (HttpURLConnection) url.openConnection();
			byte[]				bTmp		= null;
			InputStream 		in			= null;
			
			try {
				conn.connect();
				
				in 			= conn.getInputStream();
				bTmp		= fileToByte(in);				// file => byte
				sReturn		= new String(bTmp, charset);
			} catch (Exception e) {
				logger.error(e); //e.printStackTrace();
							
			} finally{
				if (in != null) in.close();
			}
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
						
		}
		
		return sReturn;
	}
	
	/**
	 * 해당 url의 html을 가져온다.
	 * @param pUrl
	 * @param pTimeOut
	 * @return
	 */
	public static String urlToString(String pUrl, int pTimeOut) throws Exception {
		String	sReturn			= "";
		
		URL					url			= new URL(pUrl);
		HttpURLConnection	conn		= (HttpURLConnection) url.openConnection();
		byte[]				bTmp		= null;
		InputStream 		in			= null;
		
		if (pTimeOut > 0) {
			conn.setConnectTimeout(pTimeOut);
		}
		conn.connect();
		
		in 			= conn.getInputStream();
		bTmp		= CmFunction.fileToByte(in);				// file => byte
		sReturn		= new String(bTmp, CmPathInfo.getCHARSET());
			
		return sReturn;
	}
	
	/**
	 * url 주소의 파일을 byte 로 변환
	 * @param i_sUrl
	 * @return
	 */
	public static byte[] urlToByte(String i_sUrl) {
		
		byte[] 					bResult		= null;
		
		try {
			
			URL					url			= new URL(i_sUrl);
			HttpURLConnection	conn		= (HttpURLConnection) url.openConnection();
			InputStream 		in			= null;
			
			conn.connect();
			bResult		= CmFunction.fileToByte(in);				// file => byte
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		
		return bResult;
	}
	
	/**
	 * url 주소의 파일을 가져온다.
	 * @param i_sUrl
	 * @param i_sTarget
	 * @return
	 */
	public static File urlToFile(String i_sUrl, String i_sTarget )
	{
		File		fResult		= null;
		
		try {
			URL					url			= new URL(i_sUrl);
			HttpURLConnection	conn		= (HttpURLConnection) url.openConnection();
			byte[]				bTmp		= null;
			InputStream 		in			= null;
			
			conn.connect();
			
			in 			= conn.getInputStream();
			bTmp		= CmFunction.fileToByte(in);				// file => byte
			fResult		= CmFunction.byteToFile(bTmp, i_sTarget);	// byte => file 
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		
		return fResult;
	}
	
	/**
	 * file => Byte 로
	 * @param in
	 * @return
	 * @throws IOException
	 */
	public static byte[] fileToByte (InputStream in) throws IOException {
		
		byte[] 					bResult		= null;
		byte[] 					bTmp		= new byte[1024];
		ByteArrayOutputStream 	baos		= new ByteArrayOutputStream();
		
		try { 
			int		j;
			while (( j = in.read(bTmp)) != -1) {
				baos.write(bTmp, 0, j);
			}
			bResult	= baos.toByteArray();
		}
		finally {
			if (in != null) {
				try {
					in.close();
				} 
				catch (IOException e) {
					logger.error(e); //e.printStackTrace();
				}
			}
		}
		return bResult;
	}
	
	/**
	 * byte => file
	 * @param b
	 * @param i_sTargetFile
	 * @return
	 */
	public static File byteToFile(byte[] b, String i_sTargetFile) {
		
		File					fResult	= null;
		BufferedOutputStream 	bops	= null;
		FileOutputStream        fos	    = null;
		
		try {
			fResult						= new File(i_sTargetFile);
			fos		= new FileOutputStream(fResult);
			
			bops	= new BufferedOutputStream(fos);
			bops.write(b);
		}
		catch (IOException e) {
			logger.error(e); //e.printStackTrace();
		}
		finally {
			if (bops != null) {
				try {
					bops.close();
					fos.close();
				} 
				catch (IOException e) {
					logger.error(e); //e.printStackTrace();
				}
			}
		}
		return fResult;
	}

	/**
	 * properties 속성값을 읽어 온다.
	 * @param fileName
	 * @param attributeName
	 * @return
	 */
	public static String getStringProperties(String fileName, String attributeName) {
		String sReturn		= "";
		try {
			Properties	props	= Resources.getResourceAsProperties(fileName);
			sReturn		= CmFunction.getStrVal(props.getProperty(attributeName));
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return sReturn;
	}
	
	/**
	 * 
	 * @param string
	 * @return
	 */
	public static String escape(String string){
	       StringBuffer sb = new StringBuffer();
	       String ncStr = "*+-./0123456789@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
	       char c;
	       
	       for(int i=0;i<string.length();i++){
	              c = string.charAt(i);
	              if(c>0x7f){
	                     sb.append("%u"); 
	                     sb.append(Integer.toHexString((int)c).toUpperCase());
	              }
	              else if(ncStr.indexOf((int)c)==-1){
	                     sb.append('%');
	                     if(c<=0xf)
	                            sb.append('0');
	                     sb.append(Integer.toHexString((int)c).toUpperCase());
	              }
	              else 
	                     sb.append(c);
	       }
	       
	       return sb.toString();
	}
	
	/**
	 * \n을  --> <br> 로 변경
	 * @param tmpStr
	 * @return
	 */
	public static String getStrChangeBr(String tmpStr) {
		String	sReturn	= "";
		
		if (tmpStr != null && !tmpStr.equals(""))
			sReturn			= tmpStr.replaceAll("\n", "<br/>");
		
		return sReturn;
	}
	public static String getEditorChangeBr(String str){
		String sReturn = str;
		Pattern pattern = Pattern.compile("<(/)?([a-zA-Z]*)(\\s[a-zA-Z]*=[^>]*)?(\\s)*(/)?>");
		
		Matcher match = null;
		match = pattern.matcher(str);
		if(str != null && !str.equals("")){
			if(match.find()){
				return sReturn;
			}else{
				sReturn = str.replaceAll("\n", "<br/>");
			}
		}
		
		return sReturn;
	}
	
	/**
	 * 문자열에서 모든 HTML 태그 삭제 하고  \n을  --> <br> 로 변경
	 * @param i_sHTML
	 * @return
	 */
	public static String removeHTMLChangeBr(String i_sHTML) {
		String	result	= "";
		
		if ((null == i_sHTML) || "".equals(i_sHTML)) {
			return "";
		}
		
		result	= i_sHTML.replaceAll("<.+?>", "").replaceAll("\n", "<br/>");
		result = result.replaceAll("\r", "");
		
		return result;
	}
	
	/**
	 * 
	 * @param filePath
	 * @param fileName
	 * @return
	 */
	public static String fnFileNameCheck(String	filePath, String fileName) {
		String		sReturn			= "";
		String		tmpFileName		= "";
		String		tmpExt			= "";
		File		file			= null;
		boolean		bLoop			= true;
		int			cnt				= 0;
		
		if (filePath != null && fileName != null) {
			if (fileName.indexOf(".") > -1) {
				tmpFileName			= fileName.substring(0, fileName.lastIndexOf("."));
				tmpExt				= fileName.substring(fileName.lastIndexOf("."), fileName.length());
			}
			else {
				tmpFileName			= fileName;
				tmpExt				= "";
			}
			
			while (bLoop) {
				if (cnt == 0)
					file		= new File(filePath + tmpFileName + tmpExt);
				else
					file		= new File(filePath + tmpFileName + "[" + cnt + "]" + tmpExt);
				
				if (file.exists()) {
					cnt++;
				}
				else {
					bLoop		= false;
					
					if (cnt == 0)
						sReturn		= tmpFileName + tmpExt;
					else
						sReturn		= tmpFileName + "[" + cnt + "]" + tmpExt;
				}
			}
		}
		return sReturn;
	}
	
	/**
	 * - 가 있는 전화번호 에서 필요한 부분 가져오기
	 * ex ) getPhoneNumber("02-1234-5678", 1) => return "1234"
	 * ex ) getPhoneNumber("02-1234-5678", 2) => return "5678"
	 * @param i_sPhone
	 * @param sIndex
	 * @return
	 */
	public static String cutPhone(String i_sPhone, String sIndex) {
		String 	sReturn		= "";
		int		index		= CmFunction.getIntVal(sIndex);
		
		if (i_sPhone != null && !i_sPhone.equals("")) {
			String[] arrPhone		= i_sPhone.split("-");
			
			if (index < arrPhone.length)
				sReturn	= arrPhone[index];
		}
		return sReturn;
	}
	
	/**
	 * Xml Node 값을 가져온다.
	 * @param element
	 * @param tagName
	 * @return
	 */
	public static String getXmlNodeValue(Element element, String tagName) {
		String		sReturn 	= null;
		NodeList	nList		= null;
		Element		elTmp		= null;
		
		nList 		= element.getElementsByTagName(tagName);
		
		if (nList != null) {
			elTmp 		= (Element) nList.item(0);
			
			if (elTmp != null && elTmp.getFirstChild() != null)
				sReturn = elTmp.getFirstChild().getNodeValue();
		}
		return sReturn;
	}
	
	/**
	 * 값 등록유무 체크
	 * @param str
	 * @return
	 */
	public static boolean isNotEmpty (String str) {
		if (str != null && !str.equals(""))
			return true;
		else
			return false;
	}
	
	/**
	 * 값 등록 유무 체크
	 * @param str
	 * @return
	 */
	public static boolean isEmpty (String str) {
		if (str != null && !str.equals(""))
			return false;
		else
			return true;
	}
	
	public static String getFileSize(long fileSize) {
		String		sReturn		= "";
		
		if (fileSize >= (1 * 1024 * 1024 * 1024))
			sReturn	= setNumComma(Math.ceil((double)(fileSize / 1024 / 1024 / 1024))) + "GB";
		else if (fileSize >= (1 * 1024 * 1024)) 
			sReturn	= setNumComma(Math.ceil((double)(fileSize / 1024 / 1024))) + "MB";
		else if (fileSize >= (1 * 1024)) 
			sReturn	= setNumComma(Math.ceil((double)(fileSize / 1024))) + "KB";
		else if (fileSize > 0 )
			sReturn	= "1KB";
		
		return sReturn;
	}
	
	/**
	 * 첨부파일 웹 위치
	 * @param str
	 * @return
	 */
	public static String getFilePath(String str) {
		String		sReturn		= "";
		String		tmpStr		= "/UPLOAD/";
		
		if ( str != null && str.indexOf(tmpStr) > -1 ) {
			sReturn		= str.substring( str.indexOf(tmpStr) + tmpStr.length() );
		}
		else if ( str != null && str.indexOf("\\UPLOAD\\") > -1 ) {
			sReturn		= str.substring( str.indexOf("\\UPLOAD\\") + "\\UPLOAD\\".length() );
		}
		
		return sReturn;
	}
	
	/**
	 * 
	 * @param str
	 * @return
	 */
	public static String getDbClobCheck(String str) {
		if (isNotEmpty(str)) {
			int length		= (int)(CmFunction.getStringByte(str) * 2) / 3;
			
			if (length > 900 && length < 2500)
				return "N";
		}
		return "Y";
	}
	
	/**
	 * Database 등록 값 변경
	 * @param str
	 * @return
	 */
	public static String getDbValChange(String str) {
		String	sReturn		= "null";
		
		if (str != null && !str.equals("")){
			str			= str.replaceAll("'", "''");		//  ' 값 변경
			sReturn		= "'" + str + "'";
		}
		return sReturn;
	}
	
	/**
	 * 
	 * @param str
	 * @return
	 */
	public static String getJsSpecilaChaChange(String str) {
		String	sReturn		= "";
		
		if (str != null && !str.equals("")) {
			str	= str.replaceAll("\\", "\\\\");
			str	= str.replaceAll("\"", "\\\"");
			str	= str.replaceAll("\n", "\\n");
			
			sReturn		= str;
		}
		return sReturn;
	}
	
	
	/**
	 * 날짜간 차이 구하기
	 * @param sDt
	 * @param eDt
	 * @return
	 */
	public static String getDateGap( String sDt, String eDt ) {
		
		String		sReturn			= "";
		Calendar	startDt			= Calendar.getInstance();		
		Calendar	endDt			= Calendar.getInstance();
		long		gap;
		
		if (isNotEmpty(sDt) && isNotEmpty(eDt) ) {
			DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
			
			try {
				startDt.setTime(dateFormat.parse(sDt));
				endDt.setTime(dateFormat.parse(eDt));
				
				gap		= (endDt.getTimeInMillis() - startDt.getTimeInMillis()) / (24 * 60 * 60 * 1000);
				
				if (gap >= 0)
					sReturn		= "" + (gap + 1);
				else
					sReturn		= "" + (gap);

			} catch (Exception e) {
				sReturn		= "";
			}
		}
		return sReturn;
	}

    /**
     * 파일을 읽어서 내용을 리턴한다.
     * @param sPath           파일의 패스+파일명
     * @return result         파일 내용을 담고 있는 스트링 객체
     * @throws Exception
     */
    public static String fileRead(String path) throws Exception
    {
        String result = "";
        BufferedReader reader = null;
        FileReader fr = null;
        try {
            fr = new FileReader(path);
            reader = new BufferedReader(fr);
            StringBuffer sb = new StringBuffer();
            int len = 4096; // 4k
            char[] buff = new char[len];
            while (true)  {
                int rsize = reader.read(buff, 0, len);
                if (rsize < 0)
                    break;
                
                sb.append(buff, 0, rsize);
            }
            buff = null;
            result = sb.toString();
        } catch (FileNotFoundException ex){
            //throw new FileNotFoundException(ex.getMessage());
            return "파일 읽기 오류";
        }
        catch (Exception ex) {
            //throw new Exception(ex.getMessage());
            return "파일 읽기 오류";
        }
        finally {
        	if (reader != null) {
        		reader.close();
        	}
        	fr.close();
        }
        return result;
    }
    
    /**
     * 파일작성
     * @param  path       파일  패스+이름
     * @param  contents   컨텐츠 내용
     * @throws Exception
     */
     public static void fileWrite(String path, String contents) throws Exception {
         File file = null;
         FileWriter fw = null;
         try {
            file = new File(path);
            fw = new FileWriter(file);
            BufferedWriter owriter = new BufferedWriter( fw );
            owriter.write(contents);
            owriter.flush();
            owriter.close();
         } catch(Exception ex) {
             throw new Exception(ex.getMessage());
         } finally {
        	 fw.close();
		}
     }
     
     /**
      * REQUEST 객체를 뽑아올수 없는 곳에서 리턴 시킴
      * web.xml 에 리스너 설정
      * @return
      */
     public static  HttpServletRequest getCurrentRequest() {
    	 try{
	       ServletRequestAttributes sra = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();

	       HttpServletRequest hsr = sra.getRequest();
	       return hsr;
    	 } catch (Exception ex) {
    		 return null;
    	 }
	   }
     
     /**
      * 현재 언어 코드를 반환 ( ko, en ...)
      * @return
      */
     public static String getLanguage() {
    	 return CmFunction.getStrVal(CmFunction.getCurrentRequest().getSession().getAttribute("language"));
     }
     
 	/**
 	 * 
 	 * @param request
 	 * @param dataMap
 	 */
 	public static void setPageUrlAndPars(HttpServletRequest request, CmMap dataMap ) {
 		
 		StringBuffer 	sb 			= new StringBuffer();
 		String 			pageUrl 	= request.getRequestURI();
 	    String			pagePars	= "";
 	    int				len			= 0;
 	    String 			key 		= "";
 	    int				idx			= -1;
 	    String[]		values		= null;
 	    
 	    try {
 	    	
 	    	for (Enumeration en = request.getParameterNames(); en.hasMoreElements(); )
 	    	{
 	    		key  	= CmFunction.getStrVal((String)en.nextElement());
 	    		idx		= key.indexOf("_temp");
 	    		if ( !key.equals("") && idx == -1 ) {
 	    			if ( !key.equals("i_sReturnUrl") && !key.equals("i_sReturnParam") ) {
 	    				
 	    				values			= request.getParameterValues(key);
 	    				len				= values.length;
 	    				
 	    				if (len > 1) {
 	    					for (int i = 0; i < len; i++) {
 	    						sb.append(key).append("=").append(URLEncoder.encode(values[i], CmPathInfo.getCHARSET())).append("&");
 	    					}
 	    				}
 	    				else {
 	    					sb.append(key).append("=").append(URLEncoder.encode(values[0], CmPathInfo.getCHARSET())).append("&");
 	    				}
 	    			}
 	    		}
 	    	}
 	    	pagePars	= sb.toString();
 	    	
 	    	dataMap.put("pageUrl", pageUrl);
 	    	dataMap.put("pageParam", pagePars);
 	    	
 	    } catch (Exception e) {
 	    	logger.error(e); //e.printStackTrace();
 	    }
 	}
 	
 	/**
 	 * 
 	 * @param key
 	 * @return
 	 */
 	public static String getSessionStringValue(String key) {
 		return CmFunction.getStrVal(getCurrentRequest().getSession().getAttribute(key));
 	}
 	
 	
 	/**
 	 * 
 	 * @param dataMap
 	 */
 	public static void setSessionValue(CmMap dataMap) {
 		setSessionValue(getCurrentRequest(), dataMap);
 	}
 	
	/**
	 * 
	 * @param request
	 * @param dataMap
	 */
	public static void setSessionValue(HttpServletRequest request, CmMap dataMap ) {
		if(request == null)
			request = getCurrentRequest();
		
		if (dataMap == null)
			dataMap		= new CmMap<Object, Object>();
		
		
		HttpSession	session	= request.getSession();
		
		String		url			= request.getRequestURI();
		String		regChannel	= "PC";
		String		mobileYn	= (String)request.getAttribute("s_mobile_device");

		if ("Y".equals(mobileYn)) {
			regChannel = "MOBILE";
	    }
		
		String			userid		= (String)session.getAttribute("s_userId");
		String			usernm		= (String)session.getAttribute("s_userNm");
		String			companyCode	= (String)session.getAttribute("s_companyCode");
		String			companyName	= (String)session.getAttribute("s_companyName");
		
		
		dataMap.put("admin_userId", 		session.getAttribute("admin_userId"));
		dataMap.put("admin_userNm", 		session.getAttribute("admin_userNm"));
		dataMap.put("admin_companyCode", 	session.getAttribute("admin_companyCode"));
		dataMap.put("admin_companyName", 	session.getAttribute("admin_companyName"));
		
		dataMap.put("admin_deptcode", 		session.getAttribute("admin_deptcode"));
		dataMap.put("admin_deptname", 		session.getAttribute("admin_deptname"));
		dataMap.put("admin_usertag", 		session.getAttribute("admin_usertag"));
		dataMap.put("admin_useyesno", 		session.getAttribute("admin_useyesno"));
		dataMap.put("admin_userdesc", 		session.getAttribute("admin_userdesc"));
		dataMap.put("admin_stdcode", 		session.getAttribute("admin_stdcode"));
		dataMap.put("admin_stdyesno", 		session.getAttribute("admin_stdyesno"));
		dataMap.put("admin_mobileno", 		session.getAttribute("admin_mobileno"));
		dataMap.put("admin_email", 			session.getAttribute("admin_email"));
		dataMap.put("admin_loginlockyesno", session.getAttribute("admin_loginlockyesno"));
		dataMap.put("admin_vendorcode", 	session.getAttribute("admin_vendorcode"));
		dataMap.put("admin_vendorname", 	session.getAttribute("admin_vendorname"));
		dataMap.put("admin_groupcode", 		session.getAttribute("admin_groupcode"));
		
		dataMap.put("admin_groupcode", 		session.getAttribute("admin_groupcode"));

		
		dataMap.put("userId", 		session.getAttribute("s_userId"));
		dataMap.put("userNm", 		session.getAttribute("s_userNm"));
		dataMap.put("companyCode", 		session.getAttribute("s_companyCode"));
		dataMap.put("companyName", 		session.getAttribute("s_companyName"));
		
		dataMap.put("s_userId", 		session.getAttribute("s_userId"));
		dataMap.put("s_userNm", 		session.getAttribute("s_userNm"));
		dataMap.put("s_companyCode", 	session.getAttribute("s_companyCode"));
		dataMap.put("s_companyName", 	session.getAttribute("s_companyName"));
		
		dataMap.put("s_deptcode", 		session.getAttribute("s_deptcode"));
		dataMap.put("s_deptname", 		session.getAttribute("s_deptname"));
		dataMap.put("s_usertag", 		session.getAttribute("s_usertag"));
		dataMap.put("s_useyesno", 		session.getAttribute("s_useyesno"));
		dataMap.put("s_userdesc", 		session.getAttribute("s_userdesc"));
		dataMap.put("s_stdcode", 		session.getAttribute("s_stdcode"));
		dataMap.put("s_stdyesno", 		session.getAttribute("s_stdyesno"));
		dataMap.put("s_mobileno", 		session.getAttribute("s_mobileno"));
		dataMap.put("s_email", 			session.getAttribute("s_email"));
		dataMap.put("s_loginlockyesno", session.getAttribute("s_loginlockyesno"));
		dataMap.put("s_vendorcode", 	session.getAttribute("s_vendorcode"));
		dataMap.put("s_vendorname", 	session.getAttribute("s_vendorname"));

		dataMap.put("access_token", 	session.getAttribute("access_token"));
		
		
		/*if (session.getAttribute("s_language")  == null){
			Locale locale = null; 
			
			
			try {
				locale = localeResolver.resolveLocale(request);
	
				if (locale == null ) {
					locale = Locale.KOREAN;
				}
			} catch (Exception e) {
				locale = Locale.KOREAN;
			}
			
			dataMap.put("s_language", 		locale.toString());
		}else{
			dataMap.put("s_language", 		session.getAttribute("s_language"));
		}*/
		
		
		dataMap.put("ENTRY_CODE_SESSION_KEY", 		session.getAttribute("ENTRY_CODE_SESSION_KEY"));
		
		dataMap.put("METRONIC_VERSION", 		CmPathInfo.getMETRONIC_VERSION());
		
		
		/*if (CmFunction.isNotEmpty(userId)) {
			dataMap.put("s_flag_login", "Y");
		}
		else {
			dataMap.put("s_flag_login", "N");
			userId		= "99999999999999999999";
		}*/

		dataMap.put("regIp", request.getRemoteAddr());

	}
	
	/**
	 * 
	 * @param map
	 * @return
	 */
	public static CmMap changeCmMapKey( CmMap map ) {
		
		if (map == null)
			return null;
		
		CmMap		resMap				= new CmMap();
		Iterator	itr					= map.keySet().iterator();
		String		filter[]			= {"v_", "n_", "c_"};
		String		arrKey[];
		String		oldKey				= "";
		String		newKey				= "";
		int			len					= filter.length;
		int			i, index;
		
		while (itr.hasNext()) 
		{
			oldKey 	= (String)itr.next();
			index	= -1;
			for (i = 0; i < len; i++) {
				if (oldKey.indexOf(filter[i]) == 0) {
					index	= i;
				}
			}
			
			switch (index) {
				case 0 :
					newKey	= "i_s";
					break;
				case 1 :
					newKey	= "i_i";
					break;
				case 2 :
					newKey	= "i_s";
					break;
				default :
					newKey	= "";
					break;
			}
			
			if (newKey.equals(""))
				continue;
			
			arrKey	= oldKey.split("_");
			
			if (arrKey == null || arrKey.length <= 1)
				continue;
				
			for (i = 1; i < arrKey.length; i++) {
				
				if (arrKey[i].length() == 0)
					continue;
				else if (arrKey[i].length() == 1)
					newKey += arrKey[i].toUpperCase();
				else
					newKey += arrKey[i].substring(0, 1).toUpperCase() + arrKey[i].substring(1, arrKey[i].length()).toLowerCase();	
			}
			
			
			resMap.put(newKey, map.get(oldKey));
		}
		
		return resMap;
	}

	/**
	 * 
	 * @param resMap	
	 * @param map
	 * @return
	 */
	public static CmMap changeCmMapKey( CmMap resMap, CmMap map) {
		
		if (map == null)
			return resMap;
		
		if (resMap == null)
			resMap				= new CmMap();
		
		Iterator	itr			= map.keySet().iterator();
		String		filter[]	= {"v_", "n_", "c_"};
		String		arrKey[];
		String		oldKey		= "";
		String		newKey		= "";
		int			len			= filter.length;
		int			i, index;
		
		while (itr.hasNext()) 
		{
			oldKey 	= (String)itr.next();
			index	= -1;
			for (i = 0; i < len; i++) {
				if (oldKey.indexOf(filter[i]) == 0) {
					index	= i;
				}
			}
			
			switch (index) {
				case 0 :
					newKey	= "i_s";
					break;
				case 1 :
					newKey	= "i_i";
					break;
				case 2 :
					newKey	= "i_s";
					break;
				default :
					newKey	= "";
					break;
			}
			
			if (newKey.equals(""))
				continue;
			
			arrKey	= oldKey.split("_");
			
			if (arrKey == null || arrKey.length <= 1)
				continue;
			
			for (i = 1; i < arrKey.length; i++) {
				
				if (arrKey[i].length() == 0)
					continue;
				else if (arrKey[i].length() == 1)
					newKey += arrKey[i].toUpperCase();
				else
					newKey += arrKey[i].substring(0, 1).toUpperCase() + arrKey[i].substring(1, arrKey[i].length()).toLowerCase();	
			}
			
			
			resMap.put(newKey, map.get(oldKey));
		}
		
		return resMap;
	}
	
	/**
	 * 
	 * @param returnMap
	 * @param map
	 * @return
	 */
	public static CmMap cloneCmMap( CmMap returnMap, CmMap map ) {
		if (map == null) {
			return returnMap;
		}

		if (returnMap == null) {
			returnMap				= new CmMap();
		}
		
		Iterator	itr		        = map.keySet().iterator();
		String		oldKey	        = "";
		
		while (itr.hasNext()) {
			oldKey 	= (String)itr.next();
			returnMap.put(oldKey, map.get(oldKey));
		}
		
		return returnMap;
	}
	
	/**
	 * CmMap 객체 복사
	 * @param map
	 * @return
	 */
	public static CmMap cloneCmMap( CmMap map ) {
		if (map == null)
			return null;
		
		CmMap		resMap		= new CmMap();
		Iterator	itr			= map.keySet().iterator();
		String		oldKey		= "";
		
		while (itr.hasNext()) {
			oldKey 	= (String)itr.next();
			resMap.put(oldKey, map.get(oldKey));
		}
		
		return resMap;
	}
	
	/**
	 * 영문, 숫자만 있는제 체크
	 * @param str
	 * @return
	 */
	public static boolean isCDATA(String str) {
		
		Pattern p = Pattern.compile("^[a-zA-Z0-9ㄱ-힝\\-.()\\s/]+$");
		
		if (str == null || str.equals(""))
			return false;
		
		Matcher mc = p.matcher(str);
		
		return !mc.matches();
	}
	
	/**
	 * CmMap => xml
	 * @param cmMap
	 * @return
	 */
	public static String changeCmMapToXml(CmMap cmMap, String nodeName ) {
		StringBuffer sb = new StringBuffer();
		
		if (cmMap == null) {
			if (nodeName != null && !nodeName.equals("")) {
				sb.append("<" + nodeName +  "/>");
			}
			return sb.toString();
		}
		
		if (nodeName != null && !nodeName.equals("")) {
			sb.append("<").append(nodeName).append(">\n");
		}
		
		Iterator itr = cmMap.keySet().iterator();
		String[] values = null;
		String key = "";
		int i, len;
		
		while (itr.hasNext()) {
			key = (String)itr.next();
			
			if (cmMap.get(key) instanceof String[]) {
				values = (String[])cmMap.get(key);
			}
			else {
				values = new String[1];
				try {
					values[0] = (String)cmMap.get(key);
				} catch (Exception e) {
					values[0] = String.valueOf(cmMap.get(key));
				}
			}
			
			len = values.length;
			
			for (i = 0; i < len; i++) {
				sb.append("\t<").append(key).append(">");
				if (isCDATA(values[i])) {
					sb.append("<![CDATA[").append(CmFunction.getStrVal(values[i])).append("]]>");
				}
				else {
					sb.append(CmFunction.getStrVal(values[i]));
				}
				sb.append("</").append(key).append(">\n");
			}
		}
		
		if (nodeName != null && !nodeName.equals("")) {
			sb.append("</").append(nodeName).append(">\n");
		}
		return sb.toString();
	}
	
	/**
	 * List<CmMap> => xml
	 * @param obj
	 * @param nodeName
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static String changeListToXml(Object obj, String nodeName ) {
		
		List<CmMap> list = obj == null ? null : (List<CmMap>)obj;
		
		StringBuffer sb = new StringBuffer();
		
		if (nodeName == null || nodeName.equals("")) {
			nodeName = "rows";
		}
		
		if (list == null || list.size() == 0) {
			sb.append("<" + nodeName +  "/>");
			return sb.toString();
		}
		
		for (CmMap tmp : list ) {
			sb.append(changeCmMapToXml(tmp, nodeName));
		}
		
		return sb.toString();
	}
	
	/**
	 * xml ==> CmMap
	 * @param xmlStr
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static CmMap changeXmlToCmMap(String xmlStr ) {
		
		
        CmMap jreqMap = null;
        try{
        	JSONObject xmlJSONObj = XML.toJSONObject(xmlStr);
            String xmlJSONObjString = xmlJSONObj.toString();
            
	        jreqMap = new ObjectMapper().readValue(xmlJSONObjString, CmMap.class);
		}catch(Exception ex){
			if (logger.isDebugEnabled()) logger.error(ex); //e.printStackTrace();
		}
		return jreqMap;
	}
	
	/**
	 * 
	 * @param filePath
	 * @return
	 */
	@SuppressWarnings("static-access")
	public static List<CmMap> readXlsToCmMap (String filePath , String[] arrTitleClass) {
		FileInputStream 	fis 	= null;
		POIFSFileSystem 	fs 		= null;
		HSSFWorkbook 		wb 		= null;
		CmMap 				map 	= null;
		List<CmMap> 		list 	= new ArrayList<CmMap>();
		SimpleDateFormat	sdf		= new SimpleDateFormat("yyyy-MM-dd");
		
		
		if (filePath == null || filePath.equals("")) return list;
		
		try {
			fis = new FileInputStream(filePath);
			fs = new POIFSFileSystem(fis);
			wb = new HSSFWorkbook(fs);
			
			HSSFSheet sheet = wb.getSheetAt(0);
			
			Cell cell = null;
			int firstRow = sheet.getFirstRowNum();
			int lastRow = sheet.getLastRowNum();
			int firstCell = 0;
			int lastCell = 0;
			
			for (int rowIdx = firstRow; rowIdx <= lastRow; rowIdx++) {
				
				Row row = sheet.getRow(rowIdx);
				
				if (row == null) {
					continue;
				}
				
				firstCell = row.getFirstCellNum();
				lastCell = row.getLastCellNum();
				
				map = new CmMap();
				
				for (int cellIdx = firstCell; cellIdx <= lastCell; cellIdx++) {
					
					cell = row.getCell(cellIdx);
					
					if (cell == null)
						continue;
					
					/*
					switch (cell.getCellType()) {
						case Cell.CELL_TYPE_BOOLEAN :
							break;
						case Cell.CELL_TYPE_BLANK :
							break;
						case Cell.CELL_TYPE_ERROR :
							break;
						case Cell.CELL_TYPE_FORMULA :
							break;
						case Cell.CELL_TYPE_NUMERIC :
							break;
						case Cell.CELL_TYPE_STRING :
							break;
					}
					*/
					
					if (arrTitleClass != null && arrTitleClass.length > cellIdx && arrTitleClass[cellIdx] != null && arrTitleClass[cellIdx].indexOf("cal") > -1) {
						try {
							map.put("i_sCell" + (cellIdx + 1) , sdf.format(cell.getDateCellValue()));
						} catch (Exception e) {
							cell.setCellType(cell.CELL_TYPE_STRING);
							map.put("i_sCell" + (cellIdx + 1) , cell.getStringCellValue());
						}
					}
					else {
						cell.setCellType(cell.CELL_TYPE_STRING);
						map.put("i_sCell" + (cellIdx + 1) , cell.getStringCellValue());
					}
				}
				
				list.add(map);
			}
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		} finally {
			try {
				fis.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				logger.error(e); //e.printStackTrace();
			}
		}
		
		return list;
	}

	/**
	 * 
	 * @param filePath
	 * @return
	 */
	@SuppressWarnings("static-access")
	public static List<CmMap> readXlsxToCmMap (String filePath , String[] arrTitleClass) {
		XSSFWorkbook 		xb 		= null;
		CmMap 				map 	= null;
		List<CmMap> 		list 	= new ArrayList<CmMap>();
		SimpleDateFormat	sdf		= new SimpleDateFormat("yyyy-MM-dd");
		try {
			xb = new XSSFWorkbook(filePath);
			
			XSSFSheet sheet = xb.getSheetAt(0);
			
			Cell cell = null;
			int firstRow = sheet.getFirstRowNum();
			int lastRow = sheet.getLastRowNum();
			int firstCell = 0;
			int lastCell = 0;
			
			for (int rowIdx = firstRow; rowIdx <= lastRow; rowIdx++) {
				
				Row row = sheet.getRow(rowIdx);
				
				if (row == null) {
					continue;
				}
				
				firstCell = row.getFirstCellNum();
				lastCell = row.getLastCellNum();
				
				map = new CmMap();
				
				for (int cellIdx = firstCell; cellIdx <= lastCell; cellIdx++) {
					
					cell = row.getCell(cellIdx);
					
					if (cell == null)
						continue;
					
					/*
					switch (cell.getCellType()) {
						case Cell.CELL_TYPE_BOOLEAN :
							break;
						case Cell.CELL_TYPE_BLANK :
							break;
						case Cell.CELL_TYPE_ERROR :
							break;
						case Cell.CELL_TYPE_FORMULA :
							break;
						case Cell.CELL_TYPE_NUMERIC :
							break;
						case Cell.CELL_TYPE_STRING :
							break;
					}
					*/
					
					if (arrTitleClass != null && arrTitleClass.length > cellIdx && arrTitleClass[cellIdx] != null && arrTitleClass[cellIdx].indexOf("cal") > -1) {
						try {
							map.put("i_sCell" + (cellIdx + 1) , sdf.format(cell.getDateCellValue()));
						} catch (Exception e) {
							cell.setCellType(cell.CELL_TYPE_STRING);
							map.put("i_sCell" + (cellIdx + 1) , cell.getStringCellValue());
						}
					}
					else {
						cell.setCellType(cell.CELL_TYPE_STRING);
						map.put("i_sCell" + (cellIdx + 1) , cell.getStringCellValue());
					}
				}
				
				list.add(map);
			}
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		
		return list;
	}

	/**
	 * 
	 * @param i_sSource
	 * @param ch
	 * @param length
	 * @return
	 */
    public static String getSubStr(String i_sSource, String ch, String length) {
        if (i_sSource.length() > getIntVal( length) ) {
            return i_sSource.substring( 0, getIntVal( length) ) + ch + ch;
        }
        else {
            return i_sSource;
        }
    }
    
    /**
     * 
     * @param strings
     * @return
     */
    public static CmMap newMap(String ...strings) {
		CmMap result = new CmMap();
		
		String[] keyArray = new String[strings.length/2];
		String[] valueArray = new String[strings.length/2];
		
		for ( int i = 1 ; i < strings.length +1 ; i++) {
			String param = strings[i-1];
			if ( i%2 == 0 ) {
				valueArray[(i/2+i%2 - 1)] = param;
			}
			else {
				keyArray[(i/2+i%2 - 1)] = param;
			}
		}
		
		for ( int i = 0 ; i < keyArray.length ; i++ ) {
			result.put(keyArray[i], valueArray[i]);
		}
		
		return result;
	}
    
    /**
     * 
     * @param str
     * @param integerLen
     * @param decimalLen
     * @return
     */
    public static String getDoubleFormat( String str, int integerLen, int decimalLen ) {
    	
    	if (str == null || str.equals("")) {
    		
    		StringBuffer sb		= new StringBuffer();
    		sb.append("0");
    		
    		if (decimalLen > 0) {
    			sb.append(".");
    			for (int i = 0; i < decimalLen; i++) {
    				sb.append("0");
    			}
    		}
    		return sb.toString();
    	}
    	
    	if (integerLen < 0)
    		integerLen = 1;
    	
    	StringBuffer intSb = new StringBuffer();
    	StringBuffer deciSb = new StringBuffer();
    	
    	for (int i = 0; i < integerLen; i++) {
    		intSb.append("#");
    	}
    	for (int i = 0; i < decimalLen; i++) {
    		deciSb.append("#");
    	}
    	
    	intSb.append(".").append(deciSb.toString());
    	
    	DecimalFormat format	= new DecimalFormat(intSb.toString());
    	
    	return "" + format.format(Double.parseDouble(getOnlyDouble(str)));
    }
    
    /**
     * 
     * @param str
     * @return
     */
    public static CmMap getReturnParsToCmMap( String str ) {
    	CmMap		map		= new CmMap();
    	
    	try {
    		if (str != null && !str.equals("")) {
    			
    			String[] 	parse	= str.split("&");
    			String[]	arrKey	= null;
    			String		key		= "";
    			String		val		= "";
    			int 		len		= parse.length;
    			
    			for (int i = 0; i < len; i++) {
    				
    				arrKey	= parse[i].split("=");
    				
    				if (arrKey == null)
    					continue;
    					
   					key = arrKey[0];
    					
   					if (arrKey.length != 2)
   						continue;
   					
   					val = URLDecoder.decode(arrKey[1],CmPathInfo.getCHARSET());
    					
    				map.put(key, val);
    			}
    		}
    	} catch (Exception e) {
    		logger.error(e); //e.printStackTrace();
    	}
    	return map;
    }
    
    
   
    
   
    
    public static String getChangeApprDocs(String document) {
    	
    	if (document == null) {
    		return "";
    	}
    	
    	SimpleDateFormat sdf = new SimpleDateFormat("yyyy.MM.dd");
    	
    	// 오늘 일자
    	if (document.indexOf("VAR$today$") > -1) {
    		document.replaceAll("VAR$today$", sdf.format(new Date()));
    	}
    	
    	// 전달 form to
    	if (document.indexOf("VAR$last_month_from_to$") > -1) {
    		Calendar cal = Calendar.getInstance();
    		
    		cal.add(Calendar.DATE, cal.get(Calendar.DATE) - cal.get(Calendar.DATE) + 1);
    		cal.add(Calendar.MONTH, -1);
    		
    		String fromDt = sdf.format(cal.getTime());
    		
    		cal.add(Calendar.MONTH, 1);
    		cal.add(Calendar.DATE, -1);
    		
    		String toDt = sdf.format(cal.getTime());
    		document.replaceAll("VAR$last_month_from_to$", fromDt + " ~ " + toDt);
    	}
    	
    	return document;
    }
    
    
    /**
     * md5 암호화
     * @param inpara
     * @return
     */
    public static String md5Encoding(String inpara) {
    	
    	if (inpara == null || inpara.equals("")) {
    		return "";
    	}
    	
    	byte[] bpara = new byte[inpara.length()];
    	byte[] rethash;
    	
    	for (int i = 0; i < inpara.length(); i++) {
    		bpara[i] = (byte)(inpara.charAt(i) & 0xff);
    	}
    	
    	try {
    		MessageDigest md5er = MessageDigest.getInstance("MD5");
    		rethash = md5er.digest(bpara);
    	} catch (GeneralSecurityException e) {
    		throw new RuntimeException(e);
    	}
    	
    	StringBuffer r = new StringBuffer(32);
    	
    	for (int i = 0; i < rethash.length; i++) {
    		String x = Integer.toHexString(rethash[i] & 0Xff).toLowerCase();
    		
    		if (x.length() < 2)
    			r.append("0");
    		
    		r.append(x);
    	}
    	
    	return r.toString();
    }
    
    /**
     * AES decode
     * @param str
     * @return
     */
    public static String decodeAES (String str) {
    	String r = "";
    	try {
    		r = CmSecretUtil.decodeAES(str, CmPathInfo.getSECRET_AES_KEY());
    	} catch (Exception e) {
    		r = str;
    	}
    	return r;
    }


    /**
     * Excel Cell Style
     * @param wb
     * @return
     */
    public static HSSFCellStyle getHSSFCellStyle(HSSFWorkbook wb) {
    	return (HSSFCellStyle)createStyles(wb).get("default");
    }
    
    public static HSSFSheet getHSSFSheet(HSSFWorkbook wb, String[] titleArray) {
    	return getHSSFSheet(wb, titleArray, null, null);
    }
    
    public static HSSFSheet getHSSFSheet(HSSFWorkbook wb, String[] titleArray, int[] columnWidth) {
		return getHSSFSheet(wb, titleArray, columnWidth, null);
    }
    
    public static HSSFSheet getHSSFSheet(HSSFWorkbook wb, String[] titleArray, int[] columnWidth, String[] styleArray ) {
    	
    	int titleLen	= titleArray == null ? 0 : titleArray.length;
    	int widthLen	= columnWidth == null ? 0 : columnWidth.length;
    	int csLen		= styleArray == null ? 0 : styleArray.length;
    	
    	Map<String, CellStyle>	stylesMap	= createStyles(wb);	
    	HSSFSheet 				sheet 		= wb.createSheet();			// POI 객체 생성
    	HSSFRow 				header 		= sheet.createRow(0);		// 조회일자가 들어갈 행을 만든다.
    	
    	for ( int i = 0 ; i < titleLen ; i++ ) {
    		header.createCell(i);
    	}
    	
    	SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
    	
    	//header.getCell(0).setCellValue("(조회일자 : "+simpleDateFormat.format(new Date())+")");
    	
    	//sheet.createRow(1);
    	
    	HSSFRow row;
    	HSSFCell cell;
    	
    	//컬럼 타이틀 row 생성
    	row = sheet.createRow(0);
    	//컬럼 타이틀 설정
    	for ( int i = 0 ; i < titleLen ; i++ ) {
    		cell = row.createCell(i); 
    		cell.setCellValue(titleArray[i]);
    		
    		if (csLen > i && styleArray[i] != null) {
    			cell.setCellStyle(stylesMap.get(styleArray[i]));
    		}
    		else {
    			cell.setCellStyle(stylesMap.get("default"));
    		}
    		
    		// width 설정
    		if (widthLen > i) {
    			sheet.setColumnWidth(i, columnWidth[i] * 265);
    		}
    		else {
    			sheet.autoSizeColumn(i);
    		}
    	}
    	
    	return sheet;
    }
    
    /**
     * Cell Style
     * @param wb
     * @return
     */
    public static Map<String, CellStyle> createStyles(HSSFWorkbook wb){
    	
    	Map<String, CellStyle> styles = new HashMap<String, CellStyle>();
    	CellStyle style;
    	Font font = wb.createFont();
    	font.setFontName("Gulim");
    	
		Font titleFont = wb.createFont();
		titleFont.setFontName("Gulim");
		titleFont.setFontHeightInPoints((short)20);
		titleFont.setBoldweight(Font.BOLDWEIGHT_BOLD);
		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_LEFT);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setFont(titleFont);
		styles.put("title", style);
         
        Font monthFont = wb.createFont();
        monthFont.setFontHeightInPoints((short)11);
        monthFont.setColor(IndexedColors.WHITE.getIndex());
        monthFont.setFontName("Gulim");
        style = wb.createCellStyle();
        style.setAlignment(CellStyle.ALIGN_CENTER);
        style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        style.setFillForegroundColor(IndexedColors.GREY_50_PERCENT.getIndex());
        style.setFillPattern(CellStyle.SOLID_FOREGROUND);
        style.setFont(monthFont);
        style.setWrapText(true);
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
    	style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
    	style.setBottomBorderColor(HSSFColor.BLACK.index);
    	style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
    	style.setLeftBorderColor(HSSFColor.BLACK.index);
    	style.setBorderRight(HSSFCellStyle.BORDER_THIN);
    	style.setRightBorderColor(HSSFColor.BLACK.index);
    	style.setBorderTop(HSSFCellStyle.BORDER_THIN);
    	style.setTopBorderColor(HSSFColor.BLACK.index);
        styles.put("header2", style);
        
        style = wb.createCellStyle();
        style.setFont(font);
        style.setWrapText(true);
        style.setAlignment(CellStyle.ALIGN_CENTER);
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
    	style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
    	style.setBottomBorderColor(HSSFColor.BLACK.index);
    	style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
    	style.setLeftBorderColor(HSSFColor.BLACK.index);
    	style.setBorderRight(HSSFCellStyle.BORDER_THIN);
    	style.setRightBorderColor(HSSFColor.BLACK.index);
    	style.setBorderTop(HSSFCellStyle.BORDER_THIN);
    	style.setTopBorderColor(HSSFColor.BLACK.index);
    	styles.put("header", style);
    	
        /*
        style = wb.createCellStyle();
        style.setAlignment(CellStyle.ALIGN_CENTER);
        style.setWrapText(true);
        style.setBorderRight(CellStyle.BORDER_THIN);
        style.setRightBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderLeft(CellStyle.BORDER_THIN);
        style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderTop(CellStyle.BORDER_THIN);
        style.setTopBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderBottom(CellStyle.BORDER_THIN);
        style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
        styles.put("cell", style);

        style = wb.createCellStyle();
        style.setAlignment(CellStyle.ALIGN_CENTER);
        style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(CellStyle.SOLID_FOREGROUND);
        style.setDataFormat(wb.createDataFormat().getFormat("0.00"));
        styles.put("formula", style);

        style = wb.createCellStyle();
        style.setAlignment(CellStyle.ALIGN_CENTER);
        style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        style.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());
        style.setFillPattern(CellStyle.SOLID_FOREGROUND);
        style.setDataFormat(wb.createDataFormat().getFormat("0.00"));
        styles.put("formula_2", style);
        */
    	
    	// 숫자형 기본
    	style = wb.createCellStyle();
    	style.setFont(font);
        style.setAlignment(CellStyle.ALIGN_RIGHT);
        style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
    	style.setBottomBorderColor(HSSFColor.BLACK.index);
    	style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
    	style.setLeftBorderColor(HSSFColor.BLACK.index);
    	style.setBorderRight(HSSFCellStyle.BORDER_THIN);
    	style.setRightBorderColor(HSSFColor.BLACK.index);
    	style.setBorderTop(HSSFCellStyle.BORDER_THIN);
    	style.setTopBorderColor(HSSFColor.BLACK.index);
        style.setDataFormat(wb.createDataFormat().getFormat("#,###"));
        styles.put("number", style);
        
        // 숫자형 기본
        style = wb.createCellStyle();
        style.setFont(font);
        style.setAlignment(CellStyle.ALIGN_RIGHT);
        style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBottomBorderColor(HSSFColor.BLACK.index);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setLeftBorderColor(HSSFColor.BLACK.index);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);
        style.setRightBorderColor(HSSFColor.BLACK.index);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style.setTopBorderColor(HSSFColor.BLACK.index);
        style.setDataFormat(wb.createDataFormat().getFormat("###.##"));
        styles.put("percent", style);
        
        // 기본
        style = wb.createCellStyle();
        style.setFont(font);
        style.setWrapText(true);
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
    	style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
    	style.setBottomBorderColor(HSSFColor.BLACK.index);
    	style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
    	style.setLeftBorderColor(HSSFColor.BLACK.index);
    	style.setBorderRight(HSSFCellStyle.BORDER_THIN);
    	style.setRightBorderColor(HSSFColor.BLACK.index);
    	style.setBorderTop(HSSFCellStyle.BORDER_THIN);
    	style.setTopBorderColor(HSSFColor.BLACK.index);
    	styles.put("default", style);
    	
    	font.setBoldweight(Font.BOLDWEIGHT_BOLD);
    	style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
    	style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
    	style.setBottomBorderColor(HSSFColor.BLACK.index);
    	style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
    	style.setLeftBorderColor(HSSFColor.BLACK.index);
    	style.setBorderRight(HSSFCellStyle.BORDER_THIN);
    	style.setRightBorderColor(HSSFColor.BLACK.index);
    	style.setBorderTop(HSSFCellStyle.BORDER_THIN);
    	style.setTopBorderColor(HSSFColor.BLACK.index);
    	styles.put("default_bold", style);
    	
    	// 다운로드 날짜
    	style = wb.createCellStyle();
    	style.setFont(font);
    	style.setWrapText(false);
    	style.setAlignment(CellStyle.ALIGN_LEFT);
    	style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
    	styles.put("downloadDate", style);

        return styles;
    }


    /**
     * ��¥
     * @param sDate
     * @return
     */
    public static String changeDatePatten (String sDate) {
        StringBuffer	sb		= new StringBuffer();

        if (sDate != null && sDate.length() >= 8) {
            sb.append(sDate.substring(0, 4));
            sb.append(".");
            sb.append(sDate.substring(4, 6));
            sb.append(".");
            sb.append(sDate.substring(6, 8));
        } else if (sDate != null && sDate.length() >= 6) {
            sb.append(sDate.substring(0, 4));
            sb.append(".");
            sb.append(sDate.substring(4, 6));
        }

        return sb.toString();
    }
    
    /**
     * ��¥
     * @param sDate
     * @return
     */
    public static String changeDatePatten2 (String sDate) {
        StringBuffer	sb		= new StringBuffer();

        if (sDate != null && sDate.length() >= 8) {
            sb.append(sDate.substring(0, 4));
            sb.append("-");
            sb.append(sDate.substring(4, 6));
            sb.append("-");
            sb.append(sDate.substring(6, 8));
        } else if (sDate != null && sDate.length() >= 6) {
            sb.append(sDate.substring(0, 4));
            sb.append("-");
            sb.append(sDate.substring(4, 6));
        }

        return sb.toString();
    }

    public static String getRegDate8_beforeYear() {
        GregorianCalendar	calendar	= new GregorianCalendar();

        String	sYear	= Integer.toString(calendar.get((Calendar.YEAR))-1);
        String	sMonth	= Integer.toString(calendar.get(Calendar.MONTH)+1);
        String	sDate	= Integer.toString(calendar.get(Calendar.DATE));

        if (sMonth.length() < 2)	sMonth	= "0" + sMonth;
        if (sDate.length()  < 2)	sDate	= "0" + sDate;

        return sYear + sMonth + sDate;
    }

    public static String getRegDate8Nowday() {
        GregorianCalendar	calendar	= new GregorianCalendar();

        String	sYear	= Integer.toString(calendar.get(Calendar.YEAR));
        String	sMonth	= Integer.toString(calendar.get(Calendar.MONTH) + 1);
        String	sDate	= Integer.toString(calendar.get(Calendar.DATE));

        if (sMonth.length() < 2)	sMonth	= "0" + sMonth;
        if (sDate.length()  < 2)	sDate	= "0" + sDate;

        return sYear + sMonth + sDate;
    }
    
    public static String getRegDate8_MonthBefore(int Month) {
    	GregorianCalendar	calendar	= new GregorianCalendar();
    	
    	String	sYear	=	Integer.toString(calendar.get(Calendar.YEAR));
    	String	sMonth	= Integer.toString(calendar.get(Calendar.MONTH) - Month);
        
        if (sMonth.length() < 2)	sMonth	= "0" + sMonth;

        return sYear + sMonth;
    }

    /*YCHOI : 인자값에 비교해 전달 가져오기*/
    public static String getRegDate9_MonthBefore(int Month){
    	
    	GregorianCalendar	calendar	= new GregorianCalendar();
    	
    	calendar.add(Calendar.MONTH, -Month);

    	SimpleDateFormat sdf =  new SimpleDateFormat("yyyyMM");
    	
    	String sDate = sdf.format(calendar.getTime());
    	
    	return sDate;
    };
    
    /* JUHOKIM 해당 날짜에 Month 더하기*/     
    public static String getRegDate6_MonthBefore(int Month, String dgDate){
    	Calendar cal = Calendar.getInstance();
    	
    	SimpleDateFormat sdf =  new SimpleDateFormat("yyyyMMdd");
    	
    	String sDate = dgDate.substring(0,8);
		try {
			Date cDate  = sdf.parse(sDate);
				cal.setTime(cDate);
				cal.add(Calendar.MONTH, +Month);
				
				sDate = sdf.format(cal.getTime());
				
		} catch (ParseException e) {
			logger.error(e); //e.printStackTrace();
		}
    	return sDate;
    };
    
    public static String getRegDate8_MonthDayBefore(int month) {
    	GregorianCalendar	calendar	= new GregorianCalendar();
    	
    	calendar.add(Calendar.MONTH, -month);

    	SimpleDateFormat sdf =  new SimpleDateFormat("yyyyMMdd");
    	
    	String sDate = sdf.format(calendar.getTime());
    	
    	return sDate;
    }


    public static String getPointDate(String i_sSource) {
        if (getStrVal(i_sSource).length() < "YYYYMMDD".length()) {
            return i_sSource;
        }

        return i_sSource.substring(0, 4) + "." + i_sSource.substring(4, 6) + "." + i_sSource.substring(6, 8);
    }


    public static String getRegDate8_nextMonth() {
        GregorianCalendar	calendar	= new GregorianCalendar();

        String	sYear	= Integer.toString(calendar.get(Calendar.YEAR));
        String	sMonth	= Integer.toString(calendar.get(Calendar.MONTH) + 2);
        String	sDate	= Integer.toString(calendar.get(Calendar.DATE));

        if (sMonth.length() < 2)	sMonth	= "0" + sMonth;
        if (sDate.length()  < 2)	sDate	= "0" + sDate;

        return sYear + sMonth + sDate;
    }

    public static String URLConnection(String snsUrl){
    	String resultToken="";
    	try {
    		URL url = new URL(snsUrl);
    		URLConnection uc = url.openConnection();
    		HttpURLConnection huc = (HttpURLConnection)uc;
    		int responseCode = huc.getResponseCode();   			// HTTP 응답 메세지 상태 코드를 가져옵니다.
    		if (responseCode == HttpURLConnection.HTTP_OK) {        // HTTP_OK : HTTP Status-Code 200: 정상
    			InputStream is = huc.getInputStream();
    			DataInputStream dis = new DataInputStream(new BufferedInputStream(is));
    			byte[] buffer = new byte[512];
    			int len = 0;
    			while((len = dis.read(buffer, 0, buffer.length)) > 0) {
    				byte[] req_byte = null;
    				req_byte = new byte[len];
    				for (int i = 0; i < len; i++) {
    					req_byte[i] = buffer[i];
    				}
    				String Token = new String(req_byte);
    				resultToken = Token.trim();
    			}
    		}
    			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
    	return resultToken;		
    }

    /**
     * 공통 SSO 서버 유효성 여부 
     * @param url
     * @return
     */
	public static boolean isValidSession(String url) {
		boolean result = false;
		try {
			URL servletUrl = new URL(url);
			HttpURLConnection uc = (HttpURLConnection) servletUrl.openConnection();
			uc.setRequestMethod("GET");
			uc.setDoOutput(true);
			uc.setDoInput(true);
			uc.setUseCaches(false);
			uc.connect();
			if (uc.getResponseCode() == HttpURLConnection.HTTP_OK) {
				result = true;
			}
			logger.debug(url);
			logger.debug("SSO validation :: isValidSession RESP_CODE="+uc.getResponseCode());
	            
			uc.disconnect();
		} catch (Exception e) { 
			logger.error(e); //e.printStackTrace();
			result = false; 
		}
		return result;
	}
		
	/**
	 * 현재 페이지 URL 반환, QueryString 포함
	 * @param request
	 * @return
	 */
	public static String getCurrentURL(HttpServletRequest request) {
		String currentUrl = request.getRequestURL().toString();
		//String queryString = request.getQueryString();
		String queryString = "";
		String key = "";
		String[] values = null;
		StringBuffer sb = new StringBuffer();
		
		try {
			for (Enumeration en = request.getParameterNames(); en.hasMoreElements(); ) 	{
				key  	= CmFunction.getStrVal((String)en.nextElement());
				
				if ( !key.equals("") ) {
					values			= request.getParameterValues(key);
					
					if (values != null) {
						for (String str : values) {
							sb.append(key).append("=").append(URLEncoder.encode(str, CmPathInfo.getCHARSET())).append("&");
						}
					}
				}      
			}
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
    		
    	queryString = sb.toString();
		
		if ( queryString != null && !"".equals(queryString) ) {
			currentUrl += "?" + queryString;
		}
		return currentUrl;
	}
	
	
    /**
     * 이미지 원본과 썸내일 이동
     * @param uploadMovePath, fileId, fileExt
     * @return
     */	
	public static boolean fileMove(String uploadTempPath,String uploadMovePath,String fileId,String fileExt){
		boolean result      	= true;
		FileInputStream inputStream 	= null;
		FileOutputStream outputStream 	= null;
		FileChannel fcin				= null;
		FileChannel fcout				= null;
		
		try {
			String fileMovePath = uploadMovePath+fileId+fileExt;
			String fileTempPath = uploadTempPath+fileId+fileExt;
			File    fileMove	= new File(uploadMovePath);
			File 	file 		= new File(fileTempPath);
			
			
			if (!fileMove.exists())
	    	{
				fileMove.mkdir();		    			
	    	}
			
			inputStream 	= new FileInputStream(fileTempPath); 
			outputStream 	= new FileOutputStream(fileMovePath);
			fcin				= inputStream.getChannel();
			fcout				= outputStream.getChannel();
			long size						= fcin.size();
			
			fcin.transferTo(0, size, fcout);
			
			if(file.exists()){
	    		file.delete();
	    	}
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		} finally {
			try {
				fcout.close();
				fcin.close();
				outputStream.close();
				inputStream.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				logger.error(e); //e.printStackTrace();
			}
			
		}
		return result;
	}
	
	public static String getStringValue(Object i_oSource) {
		if ((null == i_oSource)) {
			return "";
		}
		return getStringValue(i_oSource.toString());
	}

	public static String getStringValue(String i_sSource) {
		if ((null == i_sSource) || "".equals(i_sSource)) {
			return "";
		} else if ((null == i_sSource.trim()) || "".equals(i_sSource.trim())) {
			return "";
		}

		return i_sSource.trim();
	}
	
	public static long getLongValue(Object i_oSource){
		if ((null == i_oSource)) {
			return 0;
		}

		return getLongValue(i_oSource.toString());
	}
	
	public static String onlyNumber(String source) {
		StringBuffer	sb		= new StringBuffer();
		
		if (source != null) {
			int len		= source.length();
			
			for (int i = 0; i < len; i++) {
				char c		= source.charAt(i);
				
				if (c >= '0' && c <= '9')
					sb.append(""+c);
			}
		}
		
		return sb.toString();
	}
	
	public static String changeCafeDate(String strDate) {
		String sResult = "";
		
		if (strDate == null || strDate.length() < 14) {
			return sResult;
		}
		
		Date nowDate = new Date();
		Date regDate = null;
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		try {
			regDate = sdf.parse(strDate);
			
			long gap = (nowDate.getTime() - regDate.getTime()) / 1000 / 60;
			
			if (gap == 0) {
				sResult = "방금";
			}
			else if (gap < 60) {
				sResult = gap + "분전";
			}
			else if (gap >= 60 && gap < (60 * 24) ) {
				sResult = (gap / 60) + "시간전";
			}
			else if (gap >= (60 * 24) && gap < (60 * 48) ){
				int time = Integer.parseInt(strDate.substring(8, 10));
				String minute  = strDate.substring(10, 12);
				sResult = time > 12 ? "어제 오후 " + (time - 12) + ":" + minute : "어제 오전 " + time + ":" + minute;
			}
			else {
				sResult = getStrDateToString(strDate, "yyyy.MM.dd");
			}
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
			sResult = "";
		}
		return sResult;
	}
	public static String changeCafeDate2(String strDate) {
		String sResult = "";
		
		if (strDate == null || strDate.length() < 14) {
			return sResult;
		}
		
		Date nowDate = new Date();
		Date regDate = null;
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		try {
			regDate = sdf.parse(strDate);
			
			long gap = (nowDate.getTime() - regDate.getTime()) / 1000 / 60;
			
			if (gap <(60*24)){
				String hour = strDate.substring(8, 10);
				String minute  = strDate.substring(10, 12);
				sResult = hour +":"+minute;
			}
			else {
				sResult = getStrDateToString(strDate, "yyyy.MM.dd");
			}
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
			sResult = "";
		}
		return sResult;
	}
	
	public static String  Replace_Html_Char(String shtml_char){
		String dhtml_char = "";
		StringBuffer sb = new StringBuffer();
		 
		for(int i=0; i < shtml_char.length(); i++) 
		{
			char c = shtml_char.charAt(i);
			switch (c) 
			{
				case '<' : 
					sb.append("&lt;");
					break;
				case '>' : 
					sb.append("&gt;");
					break;
				case '&' :
					sb.append("&amp;");
					break;
				case '"' :
					sb.append("&quot;");
					break;
				case '\'' :
					sb.append("&apos;");
					break;
				default:
					sb.append(c);
				} 
		}
			dhtml_char = sb.toString();
			return dhtml_char;
	}
	
    public static String YoutubeThumbNailPath(String id, int type) {
    	
		String thumbnailPath = "http://i3.ytimg.com/vi/";
		String thumbnailext  = ".jpg";		
		String thumbnail     = thumbnailPath+id+"/"+type+thumbnailext;
		
		return thumbnail;
		
    }
 // 년월일 [YYYYMMDD -> MM DD YYYY] ex : 20090712	- > Jul MM만 영어달로 나옴.
 	public static String getUsDatePatten2(String i_sSource)
 	{
 		String sResult	= "";
 		
 		if (i_sSource != null && i_sSource.length() >= "YYYYMMDD".length() )
 		{
 			//String	sYear		= i_sSource.substring(0, 4);
 			String 	sMonth		= i_sSource.substring(4, 6);
 			//String 	sDate		= i_sSource.substring(6, 8);
 			
 			int		iMonth		= getIntValue(sMonth);
 			
 			if (iMonth > 0 && iMonth < 13 )
 			{
 				sResult	= MONTH[iMonth - 1];
 			}
 		}
 		return sResult;
 	}
 // String => int 로 변환
 	public static int getIntValue(String i_sSource) {
 		int	iResult = 0;
 		
 		if (i_sSource != null && !i_sSource.equals("") )
 		{
 			i_sSource	= getOnlyNumber(i_sSource);
 			
 			if ( !i_sSource.equals("") )
 			{
 				iResult		= Integer.parseInt(i_sSource);
 			}
 		}
 		return iResult;
 	}
 	
  	public static String getGrade(String i_sGrade) {
  		String	iResult = "00";
  		
  		if (i_sGrade != null && !i_sGrade.equals("") )
  		{
  			if("10".equals(i_sGrade)){
  				iResult = "01";
  			}else if("20".equals(i_sGrade)){
  				iResult = "02";
  			}else if("30".equals(i_sGrade)){
  				iResult = "03";
  			}else if("40".equals(i_sGrade)){
  				iResult = "04";
  			}else if("50".equals(i_sGrade)){
  				iResult = "05";
  			}else if("60".equals(i_sGrade)){
  				iResult = "06";
  			}else if("70".equals(i_sGrade)){
  				iResult = "07";
  			}else if("80".equals(i_sGrade)){
  				iResult = "08";
  			}else if("90".equals(i_sGrade)){
  				iResult = "09";
  			}else if("100".equals(i_sGrade)){
  				iResult = "10";
  			}else{
  				iResult = "00";
  			}
  		}
  		return iResult;
  	}
  	
  	public static String getGradeAvg(double i_sGrade) {
  		String	iResult = "00";
  		
		if(0 >= i_sGrade){
			iResult = "00";
		}else if(10 >= i_sGrade){
			iResult = "01";
		}else if(20 >= i_sGrade){
			iResult = "02";
		}else if(30 >= i_sGrade){
			iResult = "03";
		}else if(40 >= i_sGrade){
			iResult = "04";
		}else if(50 >= i_sGrade){
			iResult = "05";
		}else if(60 >= i_sGrade){
			iResult = "06";
		}else if(70 >= i_sGrade){
			iResult = "07";
		}else if(80 >= i_sGrade){
			iResult = "08";
		}else if(90 >= i_sGrade){
			iResult = "09";
		}else if(100 >= i_sGrade){
			iResult = "10";
		}else{
			iResult = "00";
		}
  		return iResult;
  	}
  	
  	/*소문자로 변환*/
  	public static String changeToLowerCase(String ch) {
  		return ch.toLowerCase();
  	}

	public static String urlToString(String i_sUrl) {
		String	sReturn		=	"";
		
		if (logger.isDebugEnabled()) {
		}
		
		try {
			URL					url		=	new URL(i_sUrl);
			HttpURLConnection	conn	=	(HttpURLConnection) url.openConnection();
			byte[]				bTmp	=	null;
			InputStream			in		=	null;
			
			conn.connect();
			
			in		=	conn.getInputStream();
			bTmp	=	CmFunction.fileToByte(in);
			sReturn	=	new String(bTmp, CmPathInfo.getCHARSET());
			
		} catch(Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		
		return sReturn;
	}
	
	public static String urlofHttpsToString(String i_sUrl) {
		String	sReturn		=	"";
		
		if (logger.isDebugEnabled()) {
		}
		
		try {
			
			
			URL					url		=	new URL(i_sUrl);
			HttpsURLConnection	conn	=	(HttpsURLConnection) url.openConnection();
			byte[]				bTmp	=	null;
			InputStream			in		=	null;
			
			// SSL setting  
			SSLContext context = SSLContext.getInstance("TLS");  
			context.init(null, null, null);  // No validation for now  
			conn.setSSLSocketFactory(context.getSocketFactory());  
			  
			conn.connect();
			
			in		=	conn.getInputStream();
			bTmp	=	CmFunction.fileToByte(in);
			sReturn	=	new String(bTmp, CmPathInfo.getCHARSET());
			
		} catch(Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		
		return sReturn;
	}
	
	public static String urlofPostToString(String i_sUrl, CmMap pardata) {
		String	sReturn		=	"";
		StringBuffer result = new StringBuffer();
		
		if (logger.isDebugEnabled()) {
		}
		
		try {
			
			
			HttpClient client = new DefaultHttpClient();
			HttpPost post = new HttpPost(i_sUrl);
			//logger.info("urlofPostToString= url  :"+i_sUrl);
			// add header
			/*post.setHeader("Content-Type","application/json");
			post.setHeader("Accept","application/json");*/
			
			
			post.setHeader("Content-Type", "application/x-www-form-urlencoded");
			post.setHeader("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			if (pardata != null) {
				Iterator<String> keys = pardata.keySet().iterator();
				while( keys.hasNext() ){
					String key = keys.next();
					
					//urlParameters.add(new BasicNameValuePair(key,  URLEncoder.encode(pardata.getString(key), "UTF-8")));
					urlParameters.add(new BasicNameValuePair(key,  pardata.getString(key)));
					
					//logger.info("urlofPostToString= post  :"+key+"  /  "+ pardata.getString(key));
					
				}
			}
			post.setEntity(new UrlEncodedFormEntity(urlParameters, "UTF-8"));

			HttpResponse response = client.execute(post);

			BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
			
			String line = "";
			while ((line = rd.readLine()) != null) {
				result.append(line);
			}
			

			//logger.info("urlofPostToString= result  :"+result.toString());
			
		} catch(Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		
		return result.toString();
	}
	
	public static String getFullMonth() {
		Calendar cal = Calendar.getInstance();
		int month = cal.get(Calendar.MONTH);
		
		return FULL_MONTH[month];
	}
	
	public static String getFullMonth2(int setyear, int setmonth) {
		Calendar cal = Calendar.getInstance();
		cal.set(setyear, setmonth,0);
		int month = cal.get(Calendar.MONTH);
		
		return FULL_MONTH[month];
	}
	
    /*YHCHOI : Google Shorten Url*/
	public static String setGoogleLongUrlConvertShorten(String longUrl) {
		if (longUrl != null && longUrl.indexOf("redirect:") > -1) {
			longUrl = longUrl.replace("redirect:", "");
		}
		
		final String googUrl = "https://www.googleapis.com/urlshortener/v1/url?shortUrl=http://goo.gl/fbsS&key=";
		final String apikey = "AIzaSyC2ryowExMRe8eWHt7Jt4qSVHZlA0mNzXw";
		String url = googUrl + apikey;
		String shortUrl = "";
		
		OutputStreamWriter wr = null;
		BufferedReader rd = null;
		
		try {
			URLConnection conn = new URL(url).openConnection();
	        conn.setDoOutput(true);
	        conn.setRequestProperty("Content-Type", "application/json");
	        wr = new OutputStreamWriter(conn.getOutputStream());
	        wr.write("{\"longUrl\":\"" + longUrl + "\"}");
	        wr.flush();
	        rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
	        String line;
	        while ((line = rd.readLine()) != null) {
	            if (line.indexOf("id") > -1) {
	                shortUrl = line.substring(8, line.length() - 2);
	                break;
	            }
	        }
	        wr.close();
	        rd.close();
		} catch(Exception e) {
			logger.error(e); //e.printStackTrace();
		}finally{
			if ( wr != null){
				wr = null;
			}
			if ( rd != null){
				rd = null;
			}
		}
		return shortUrl;
	}
	
	/**
	 * 해당 연수의 나이를 구해서 나이가 몇대인지 구하기 (10대 초반, 20대 중반, 30대 중반 등등) 
	 * @param birthyear
	 * @return
	 */
	public static String changeAgeYear(String birthyear){
		String cAge = null;
		if(birthyear.equals("")){
			return "";
		}
		int birthyear2 = Integer.parseInt(birthyear);
		Date today = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
		try {
			String year = sdf.format(today);
			int year2 = Integer.parseInt(year);
			int age = year2 - birthyear2 + 1;
			int first_age = age/10;
			int last_age = age%10;
			if(age<10){
				cAge = "10대 이하";
			}else if(age>49){
				cAge = "50대 이상";
			}else if(last_age>=0 && last_age<4){
				cAge = first_age+"0대 초반";
			}else if(last_age>3 && last_age<7){
				cAge = first_age+"0대 중반";
			}else if(last_age>6 && last_age<=9){
				cAge = first_age+"0대 후반";
			}
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
			cAge = "";
		}
	
		return cAge;
	}
	
	/**
	 * 상품 검색필터에서 사용함
	 * @param reqVo
	 * @param name
	 * @return
	 */
	public static String getProdBitFilter(CmMap reqVo, String name) {
		
		String[] arrParam = null;
		
		if (name.equals("i_sPrdService")) {
			arrParam = new String[] {
				"DG_P001"
				, "DG_P002"
				, "DG_P019"
			};
		}
		else if (name.equals("i_sPrdFeature")) {
			arrParam = new String[] {
				"DG_P003"
				, "DG_P004"
				, "DG_P005"
				, "DG_P006"
				, "DG_P007"
				, "DG_P008"
				, "DG_P017"
				, "DG_P011"
				, "DG_P012"
				, "DG_P010"
				, "DG_P009"
			};
		} 
		else if(name.equals("i_sPrdPrice")) {
			arrParam = new String[] {
				"DG_P013"
				, "DG_P014"
				, "DG_P015"
				, "DG_P016"
			};
		} 
		else if(name.equals("i_sPrdFunc")) {
			arrParam = new String[] {
				"DR_001"
				, "DR_002"
				, "DR_003"
			};
		} 
		else if(name.equals("i_sPrdSkin")) {
			arrParam = new String[] {
				"AT010"
				, "AT011"
				, "AT012"
				, "AT013"
				, "AT014"
				, "AT017"
			};
		} 
		else if(name.equals("i_sPrdTrubleType")) {
			arrParam = new String[] {
				"DW_0101"
				, "DW_0102"
				, "DW_0103"
				, "DW_0104"
				, "DW_0105"
				, "DW_0106"
				, "DW_0107"
			};
		} 
		else if(name.equals("i_sOptMakeupeft")) {
			arrParam = new String[] {
				"DI_001"
				, "DI_002"
				, "DI_003"
				, "DI_004"
				, "DI_005"
				, "DI_006"
				, "DI_007"
				, "DI_008"
				, "DI_009"
				, "DI_010"
				, "DI_011"
				, "DI_012"
				, "DI_013"
				, "DI_014"
				, "DI_015"
				, "DI_016"
				, "DI_017"
				, "DI_018"
				, "DI_019"
				, "DI_020"
				, "DI_021"
			};
		} 
		
		StringBuffer sbNum = new StringBuffer();
		StringBuffer sbParam = new StringBuffer();
		
		int len = arrParam == null ? 0 : arrParam.length;
		int flag = 0;
		int num = 0;
		for (int i = 0; i < len; i++) {
			
			flag = reqVo.getString(name + "_" + arrParam[i]).equals("Y") ? 1 : 0;
			num += flag * Math.pow(2, len - i - 1);
			
			sbNum.append(i > 0 ? ",":"").append(flag);
			sbParam.append(flag > 0? ";":"").append(flag > 0 ? arrParam[i] : "");
		}
		
		if(CmFunction.isNotEmpty(sbParam.toString())) {
			reqVo.put(name, sbParam.toString().substring(1, sbParam.toString().length()));
		}

		logger.debug(sbNum.toString());
		logger.debug(sbParam.toString());
		logger.debug(num);
		
		return "" + num;
	}
	
	/**
	 * strDate => Date
	 * @param date
	 * @param format
	 * @return
	 */
	public static Long getStrDateToLong(String strDate, String format) {
		ParsePosition pp = new ParsePosition(0);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		Date date = null;
		int len;
		
		strDate = getOnlyNumber(strDate);
		len = strDate.length();
		
		if (len == 4) {
			strDate = getStringPad("RPAD", strDate + "0101", 14, '0');
		}
		else if (len == 6) {
			strDate = getStringPad("RPAD", strDate + "01", 14, '0');
		}
		else if (len > 6 && len < 14) {
			strDate = getStringPad("RPAD", strDate, 14, '0');
		}
		else if (len == 14) {
			
		}
		else if (len > 14) {
			strDate = strDate.substring(0, 14);
		}
		else {
			return 0L;
		}
		
		try {
			date = sdf.parse(strDate, pp);
		} catch (Exception e) {
		}
		
		return date == null ? 0 : date.getTime(); 
	}
	
	public static String getNoMbrPcId(String cookieId, HttpServletRequest request, HttpServletResponse response) throws Exception {
		String pcid = getCookie(cookieId);
		
		if(pcid == null || "".equals(pcid)) {
		// 24*60*60 1day
			int year2 = (24*60*60) * 365; // 2년
			pcid = getDateTimeStamp() + getNoMbrPcIdRandomNumber();
			setCookie(response, cookieId, pcid, year2);
				
		}
		return pcid;
	}
	    
	private static String getNoMbrPcIdRandomNumber() {
		int result = (int) (Math.floor(Math.random() * 9999));
		String num = String.valueOf(result);
		for(int i = (4-num.length()); i >= 1; i--) {
			num += "0";
		}
		return num;
	}
	    
	    /**
	     * millisecond TimeStamp 
	     * @return String
	     */
	public static String getDateTimeStamp() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");
		Calendar cal = Calendar.getInstance();
		
		return sdf.format(cal.getTime());
	}
	
	
	/**
	 * YHCHOI : 날짜 나타내주는 형식 변환 
	 * @param date
	 * @param sChar
	 * @returns {String}
	 */
	public static String dateStrucChange(String date, int sChar) {
		
		String StringDate = date.replace("/./gi","");

	    String sYear  = StringDate.substring(0,4);
	    String sMonth = StringDate.substring(4,6);
	    String sDate  = StringDate.substring(6,8);
	    
		if(sChar == 1){
	    
		    date = sYear+"년 "+sMonth+"월 "+sDate+"일";
		    
		}else if(sChar == 2){
			
			date = sYear+""+sMonth+""+sDate+"";
			
		}else if(sChar == 3){
			
			date = sYear+"/"+sMonth+"/"+sDate+"";
			
		}else if(sChar == 4){
			
			date = sYear+"-"+sMonth+"-"+sDate+"";
			
		}else{
			
			date = sYear+"."+sMonth+"."+sDate+"";
			
		}
		
		return date;
	}
	
	/**
	 * 연락처 변환 및 마킹 처리
	 * @param phoneno
	 * @param flagHidden
	 * @return
	 */
	public static String getChangePhone(String phoneno, String flagHidden) {
		if (phoneno == null || phoneno.equals("")) {
			return "";
		}
		
		try {
			
			StringBuffer sb = new StringBuffer();
			
			if (phoneno.indexOf("-") > -1) {
				String[] arr = phoneno.split("-");
				int len = arr == null ? 0 : arr.length;
				
				if (!"Y".equals(flagHidden)) {
					return phoneno;
				}
				
				for (int i = 0; i < len; i++) {
					if (i > 0) {
						sb.append("-");
					}
					if (i == 1) {
						int len2 = arr[i] == null ? 0 : arr[i].length();
						
						for (int j = 0; j < len2; j++) {
							sb.append("*");
						}
					}
					else {
						sb.append(arr[i]);
					}
				}
			}
			else {
				
				String[] arrPhone1 = {
						"010", "011", "016", "017", "018", "019", "070"
						, "02", "051", "053", "032", "062", "042", "052"
						, "044", "031", "033", "043", "041", "063", "061"
						, "054", "055", "064", "0505", "080"
				};
				int len = arrPhone1.length;
				
				boolean isChange = false;
				String phone1 = "";
				String phone2 = "";
				String phone3 = "";
				String phoneTemp = "";
				
				for (int i = 0; i < len; i++) {
					if (phoneno.indexOf(arrPhone1[i]) == 0) {
						phone1 = arrPhone1[i];
						phoneTemp = phoneno.replace(arrPhone1[i], "");
						
						if (phoneTemp != null && phoneTemp.length() == 7) {
							phone2 = phoneTemp.substring(0, 3);
							phone3 = phoneTemp.substring(3, 7);
						}
						else if (phoneTemp != null && phoneTemp.length() >= 8) {
							phone2 = phoneTemp.substring(0, 4);
							phone3 = phoneTemp.substring(4, phoneTemp.length());
						}
						else {
							if (phoneTemp != null && phoneTemp.length() >= 4) {
								phone2 = phoneTemp.substring(0, 4);
								phone3 = phoneTemp.substring(4, phoneTemp.length()); 
							}
							else {
								phone2 = phoneTemp;
								phone3 = "";
							}
						}
						isChange = true;
						break;
					}
				}
				
				if (!isChange) {
					if (phoneno.length() >= 11) {
						phone1 = phoneno.substring(0, 3);
						phone2 = phoneno.substring(3, 7);
						phone3 = phoneno.substring(7, phoneno.length());
					}
					else {
						
						switch (phoneno.length()) {
						case 0 :
						case 1 :
						case 2 :
						case 3 :
							phone1 = phoneno;
							phone2 = "";
							phone3 = "";
							break;
						case 4 :
						case 5 :
						case 6 :
						case 7 :
							phone1 = phoneno.substring(0, 3);
							phone2 = phoneno.substring(3, phoneno.length());
							phone3 = "";
							break;
						default : 
							phone1 = phoneno.substring(0, 3);
							phone2 = phoneno.substring(3, 7);
							phone3 = phoneno.substring(7, phoneno.length());
						}
					}
				}
				
				sb.append(phone1).append("-");
				
				if ( "Y".equals(flagHidden) ) {
					for (int i = 0; i <phone2.length(); i++) {
						sb.append("*");
					}
				}
				else {
					sb.append(phone2);
				}
				
				sb.append("-").append(phone3);
			}
			
			return sb.toString();
			
		} catch (Exception e) {
			return phoneno;
		}
	}
	
	/**
	 * 이름 마스킹 처리
	 * @param usernm
	 * @return
	 */
	public static String getChangeUserName(String usernm) {
		
		StringBuffer sb = new StringBuffer();
		
		if (usernm == null || usernm.equals("")) {
			return "";
		}
		
		switch (usernm.length()) {
		case 0 : 
		case 1 :
			sb.append(usernm);
			break;
		case 2 : 
			sb.append(usernm.substring(0, 1) + "*");
			break;
		case 3 : 
			sb.append(usernm.substring(0, 1) + "*" + usernm.substring(2, 3));
			break;
		default :
			sb.append(usernm.substring(0, 2));
			for (int i = 2; i < usernm.length(); i++) {
				sb.append("*");
			}
		}
		
		return sb.toString();
	}
	
	/**
	 * 
	 * @param userid
	 * @param usernm
	 * @param nickname
	 * @return
	 */
	public static String getChangeUserInfo(String userid, String usernm, String nickname) {
		StringBuffer sb = new StringBuffer();
		
		if ("99999999999999999999".equals(userid)) {
			return "비회원";
		}
		
		userid = userid == null ? "" : getStringHidden(userid.trim(), 3);
		usernm = usernm == null ? "" : usernm.trim();
		nickname = nickname == null ? "" : nickname.trim();
		
		if (userid.equals("")) {
			return "";
		}
		
		switch (usernm.length()) {
		case 0 : 
		case 1 :
			sb.append(usernm);
			sb.append("(").append(nickname.equals("") ? userid : nickname).append(")");
			break;
		case 2 : 
			sb.append(usernm.substring(0, 1) + "*");
			sb.append("(").append(nickname.equals("") ? userid : nickname).append(")");
			break;
		case 3 : 
			sb.append(usernm.substring(0, 1) + "*" + usernm.substring(2, 3));
			sb.append("(").append(nickname.equals("") ? userid : nickname).append(")");
			break;
		default :
			sb.append(usernm.substring(0, 2));
			for (int i = 2; i < usernm.length(); i++) {
				sb.append("*");
			}
			sb.append("(").append(nickname.equals("") ? userid : nickname).append(")");
		}
		
		return sb.toString();
	}
	
	

	/**
	 * YHCHOI : KAKAO PAY 관련 암호화
	 * @param strData
	 * @return
	 */
	 public static String SHA256(String strData) { // 암호화 시킬 데이터
		 
	  String SHA = "";
	    try{
	    	
	        MessageDigest sh = MessageDigest.getInstance("SHA-256");
	        
	        sh.update(strData.getBytes());
	        
	        byte byteData[] = sh.digest();
	        
	        StringBuffer sb = new StringBuffer();
	        
	        for(int i = 0 ; i < byteData.length ; i++){
	            sb.append(Integer.toString((byteData[i]&0xff) + 0x100, 16).substring(1));
	        }
	        
	        SHA = sb.toString();
	        byte[] raw = SHA.getBytes();
	        
	    byte[] encodedBytes = Base64.encodeBase64(raw);
	    
	    SHA = new String(encodedBytes);
	    
	    }catch(NoSuchAlgorithmException e){
	        logger.error(e); //e.printStackTrace();
	        SHA = null;
	    }
	    return SHA;
	 }
	 
	/**
	 * YHCHOI : 현재 서버 아이피 가지고 오기
	 * @return
	 */	 
	 public static String getLocalServerIp()
	 {
	 	try
	 	{
	 	    for (Enumeration<NetworkInterface> en = NetworkInterface.getNetworkInterfaces(); en.hasMoreElements();)
	 	    {
	 	        NetworkInterface intf = en.nextElement();
	 	        for (Enumeration<InetAddress> enumIpAddr = intf.getInetAddresses(); enumIpAddr.hasMoreElements();)
	 	        {
	 	            InetAddress inetAddress = enumIpAddr.nextElement();
	 	            if (!inetAddress.isLoopbackAddress() && !inetAddress.isLinkLocalAddress() && inetAddress.isSiteLocalAddress())
	 	            {
	 	            	return inetAddress.getHostAddress().toString();
	 	            }
	 	        }
	 	    }
	 	}
	 	catch (SocketException ex) {}
	 	return null;
	 }
	 
	 public static String getEncodeAes(String str) {
			String rtn = "";
			try {
				rtn = CmSecretUtil.encodeAES(str, CmPathInfo.getSECRET_AES_KEY());
			} catch (Exception e) {
				logger.error(e); //e.printStackTrace();
			}
			return rtn;
		}
		
	/**
	 * 
	 * @param str
	 * @return
	 */
	public static String getDecodeAes(String str) {
		String rtn = "";
		try {
			rtn = CmSecretUtil.decodeAES(str, CmPathInfo.getSECRET_AES_KEY());
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		return rtn;
	}
	
	/**
	 * YHCHOI : PC HOSTNAME 가지고 오기 
	 * @returns {String}
	 */	
	 public static String getHostName() {
	  String hostName = "";
	  
	  	try {
		  
		    Runtime rt = java.lang.Runtime.getRuntime();
		    Process proc = rt.exec("hostname");
		    int inp;
		    
		    while ((inp = proc.getInputStream().read()) != -1) {
		    	
		    hostName+=(char)inp;
		    
		    }
		    
		    proc.waitFor();
		
	  	} catch (Exception e) {
	  		logger.error(e); //e.printStackTrace();
	  	}
	  
	  return hostName.trim();
	  
	 }
	 
	@Deprecated
	public static boolean useSSL(String secureurl) {
		String url = secureurl.toLowerCase();
		if (url.length() < 5) return false;
		return url.substring(0,5).equals("https");
	}
	
	/**
	 * 자바스크립트 문자열
	 *
	 * @param msg the msg
	 * @return the string
	 */
	public static String jsmsg(String msg) {
		return jsmsg(msg, "");
	}
	
	/**
	 * 코드가 있는 자바스크립트 문자열
	 *
	 * @param msg the msg
	 * @param code the code
	 * @return the string
	 */
	public static String jsmsg(String msg, String code) {
		return String.format("__jsmsg('%s', '%s');", msg, code);
	}

	/**
	 * 자바스크립트 리로드
	 *
	 * @param msg the msg
	 * @param code the code
	 * @return the string
	 */
	public static String jsmsgReload(String msg, String code) {
		return String.format("__jsmsgReload('%s', '%s');", msg, code);
	}

	/**
	 * 자바스크립트 close
	 *
	 * @param msg the msg
	 * @return the string
	 */
	public static String jsmsgClose(String msg) {
		return String.format("__jsmsgClose('%s');", msg);
	}

	/**
	 * 자바스크립트 url 이동
	 *
	 * @param msg the msg
	 * @return the string
	 */
	public static String gotoURL(String msg) {
		return gotoURL(msg, "");
	}
	
	/**
	 * 코드가 있는 자바스크립트 url 이동
	 *
	 * @param msg the msg
	 * @param code the code
	 * @return the string
	 */
	public static String gotoURL(String msg, String code) {
		return String.format("__gotoURL('%s', '%s');", msg, code);
	}
	
	/**
	 * 자바스크립트 링크 메시지
	 *
	 * @param msg the msg
	 * @param url the url
	 * @param mode the mode
	 * @return the string
	 */
	public static String jsmsgLink(String msg, String url, String mode) {
		return String.format("__jsmsgLink('%s', '%s', '%s');", msg, url, mode);
	}
	
	/**
	 * 자바스크립트 페이지 리로드
	 *
	 * @param mode the mode
	 * @return the string
	 */
	public static String pageReload(String mode) {
		return String.format("__pageReload('%s');", mode);
	}
	
	/**
	 * Dec request.
	 *
	 * @param value the value
	 * @return the string
	 */
	public static String decRequest(String value){
		String ret = "";
		ret = CmFunction.getStrVal(value);
		ret = ret.replace("&#39;", "'");
		ret = ret.replace("&quot;", "\"");
		ret = ret.replace("&gt;", ">");
		ret = ret.replace("&lt;", "<");
		ret = ret.replace("&amp;", "&");
		
		return ret;
	}
	
	/**
	 * 싱글쿼테이션 더블쿼테이션 치환
	 *
	 * @param value the value
	 * @return String
	 */
	public static String encQuote(String value) {
		return value == null ? "" : value.replaceAll("'", "&#39;").replaceAll("\"","&quot;");
	}

	/**
	 * encQuote의 역변환
	 *
	 * @param value the value
	 * @return the string
	 */
	public static String decQuote(String value) {
		return value == null ? "" : value.replaceAll("&#39;", "'").replaceAll("&quot;","\"");
	}
	
	// 숫자 랜덤문자열 반환
	// strLen : 문자열 길이
	//
	public static String getRandomInt(int strLen) {
		Random random = new Random();

	    String ranStr = "";
		int cnt = 0;
		
		// 문자열의 길이만큼 값이 들어올때까지 실행
		//
		while ( cnt < strLen ) {
			// 숫자범위의 난수발생
			//
			int num1 = random.nextInt(10);
		
			ranStr += (num1)+"";
		    	cnt++;
		}
		
		return ranStr;
	}
	
	
	// 설문조사용 체크박스 value 값처리 
	// checkbox value 1,2,4,8,16,32,64,128,256,512,1024 주고 
	// 저장시는 value 값을 전부 더한값  출력시 해당 함수로  값을 분해한다
	public static String[] getCheckBoxValueDis(int val) {
		String []retArr = null;
	
		try {
			String retStr = "";
			if (val >= 2048){if (!retStr.equals("")) retStr += ",";retStr += "2048";val = val - 2048;}
			if (val >= 1024){if (!retStr.equals("")) retStr += ",";retStr += "1024";val = val - 1024;}
			if (val >= 512){if (!retStr.equals("")) retStr += ",";retStr += "512";val = val - 512;}
			if (val >= 256){if (!retStr.equals("")) retStr += ",";retStr += "256";val = val - 256;}
			if (val >= 128){if (!retStr.equals("")) retStr += ",";retStr += "128";val = val - 128;}
			if (val >= 64){if (!retStr.equals("")) retStr += ",";retStr += "64";val = val - 64;}
			if (val >= 32){if (!retStr.equals("")) retStr += ",";retStr += "32";val = val - 32;}
			if (val >= 16){if (!retStr.equals("")) retStr += ",";retStr += "16";val = val - 16;}		
			if (val >= 8){if (!retStr.equals("")) retStr += ",";retStr += "8";val = val - 8;}
			if (val >= 4){if (!retStr.equals("")) retStr += ",";retStr += "4";val = val - 4;}
			if (val >= 2){if (!retStr.equals("")) retStr += ",";retStr += "2";val = val - 2;}
			if (val >= 1){if (!retStr.equals("")) retStr += ",";retStr += "1";val = val - 1;}
			
			if (val != 0 ){
				retStr = "";
			}
			String []temp = retStr.split(",");
			String tempStr = "";
			for (int i=temp.length; i > 0 ; i--){
				if (!tempStr.equals("")) tempStr += ",";
				tempStr  += temp[i-1];
			}
			retArr = tempStr.split(",");
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		
		return retArr;
	}
	
	
	public static String[] getCheckBoxValueDisBack(int val) {
		String []retArr = null;
	
		try {
			String retStr = "";
			if (val >= 2048){if (!retStr.equals("")) retStr += ",";retStr += "2048";val = val - 2048;}
			if (val >= 1024){if (!retStr.equals("")) retStr += ",";retStr += "1024";val = val - 1024;}
			if (val >= 512){if (!retStr.equals("")) retStr += ",";retStr += "512";val = val - 512;}
			if (val >= 256){if (!retStr.equals("")) retStr += ",";retStr += "256";val = val - 256;}
			if (val >= 128){if (!retStr.equals("")) retStr += ",";retStr += "128";val = val - 128;}
			if (val >= 64){if (!retStr.equals("")) retStr += ",";retStr += "64";val = val - 64;}
			if (val >= 32){if (!retStr.equals("")) retStr += ",";retStr += "32";val = val - 32;}
			if (val >= 16){if (!retStr.equals("")) retStr += ",";retStr += "16";val = val - 16;}		
			if (val >= 8){if (!retStr.equals("")) retStr += ",";retStr += "8";val = val - 8;}
			if (val >= 4){if (!retStr.equals("")) retStr += ",";retStr += "4";val = val - 4;}
			if (val >= 2){if (!retStr.equals("")) retStr += ",";retStr += "2";val = val - 2;}
			if (val >= 1){if (!retStr.equals("")) retStr += ",";retStr += "1";val = val - 1;}
			
			if (val != 0 ){
				retStr = "";
			}
			retArr = retStr.split(",");
						
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		
		return retArr;
	}
	
	// 설문조사용 체크박스 value 값처리 
	// checkbox value 1,2,4,8,16,32,64,128,256,512,1024 주고 
	// 저장시는 value 값을 전부 더한값  DB에서 체크값을 가져올때 사용한다  SQL문은 IN 쿼리다.
	// max 값은 512 가 checkbox 최고 value 이면 1024을 준다. 
	// chkval 값은  1,2,4,8,16,32,64,128,256,512 이것들 중 하나여야 한다.
	public static String getCheckBoxValueSQLIN(int chkval, int maxval) {
		String retStrValue = "";
		Map<String, Object> model = new HashMap();
		
		for (int i=1 ; i <= maxval; i++){
			String [] temp = getCheckBoxValueDisBack(i);
			
			if (temp.length > 0){
				for (int j=0 ; j < temp.length; j++){
					if (Integer.parseInt(temp[j]) == chkval){
						model.put(i+"", chkval);
					}
				}
			}
		}
		
		Set key = model.keySet();
		  
		for (Iterator iterator = key.iterator(); iterator.hasNext();) {
			String keyName = (String) iterator.next();
			//String valueName = (String) model.get(keyName);
	   
			if (!retStrValue.equals("")) retStrValue += ",";
			retStrValue += "'"+keyName+"'"; 
		}
		
		
		
		return retStrValue;
	}
	
	public static String URLConnectionXmlShorten(String ConnUrl, String xmlstr) {
		if (ConnUrl != null && ConnUrl.indexOf("redirect:") > -1) {
			ConnUrl = ConnUrl.replace("redirect:", "");
		}
		
		String shortUrl = "";
		
		try {
			URLConnection urlConn = null;
			//Properties systemProperties = System.getProperties();
					
			urlConn = new URL(ConnUrl).openConnection();
			
			
			URL  url = new URL(ConnUrl);
			HttpURLConnection conn = (HttpURLConnection) urlConn;
			
			/*httpConnection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");*/
			conn.setRequestMethod("POST");
			conn.setDoOutput(true);
			conn.setDoInput(true);
			conn.setUseCaches(false);
			conn.setConnectTimeout(3000);
			conn.setReadTimeout(3000);
	        
			conn.connect();
			
			
			OutputStreamWriter out = null;
			StringBuffer bf = new StringBuffer();
			
			try {
				BufferedWriter bw;
				out = new OutputStreamWriter(conn.getOutputStream());
				bw = new BufferedWriter(out);
								
				bw.write(xmlstr);				
				bw.flush();
				bw.close();				
				out.close();
				
				BufferedReader br = null;
				InputStream    is = null;
				String         line;
				int            respCode;
				
				if ( (respCode=conn.getResponseCode()) >= 400) {
					logger.info("ErrorCode:" + respCode + " " + conn.getResponseMessage());
					is = conn.getErrorStream();
				} else {
					is = conn.getInputStream();
				}
				br = new BufferedReader(new InputStreamReader(is,"UTF-8"));
				
				while((line = br.readLine()) != null){
					bf.append(line.trim());
				}
				br.close();
				logger.info("Step2-connect End");
				//return parseRecv(bf.toString());
				
			} catch (Exception e) {
				//return new Response();
				logger.error(e); //e.printStackTrace();
			} finally {
				if (conn!=null) conn.disconnect();
				conn = null;
				out = null;
			}
			/*
			StringBuffer sb = new StringBuffer();
			
			try {		        
		       	OutputStream out = httpConnection.getOutputStream();
		       	out.write(xmlstr.getBytes("utf-8"));
		       	out.flush();
		       	out.close();
		        
		        
		        InputStream is = httpConnection.getInputStream();
		        Scanner scan = new Scanner(is);
		        int line =1;
		        while (scan.hasNext()){
		        	String  str = scan.nextLine();
		        	sb.append(str);
		        }
		        scan.close();
			} catch(Exception e) {
				logger.error(e); //e.printStackTrace();
				
			}*/
	        
	       /* InputStream is = httpConnection.getInputStream();
	        BufferedReader in = new BufferedReader(new InputStreamReader(is));

	        StringBuffer sb = new StringBuffer();
	        String line = null;
	        while( (line=in.readLine())!= null ) sb.append(line);*/
	        
	        //BufferedReader rd = new BufferedReader(new InputStreamReader(httpConnection.getInputStream()));
	        
	       
	        shortUrl = bf.toString();
	        
	        

	      
		} catch(Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		return shortUrl;
	}
	
	
	public static String URLConnectionCall(String ConnUrl, String conttype, String data, String proxy_ip, String proxy_port) throws Exception {
		if (ConnUrl != null && ConnUrl.indexOf("redirect:") > -1) {
			ConnUrl = ConnUrl.replace("redirect:", "");
		}
		
		String shortUrl = "";
		
		HttpURLConnection conn = null;
		OutputStreamWriter out = null;
		
		try {
			URLConnection urlConn = null;
			Properties systemProperties = System.getProperties();
			
			URL  url = new URL(ConnUrl); 
			if (!proxy_ip.equals("")){
				Proxy proxy = new Proxy (Proxy.Type.HTTP, new InetSocketAddress(proxy_ip,Integer.parseInt(proxy_port)));
				conn = (HttpURLConnection) url.openConnection(proxy);
			}else{
				conn = (HttpURLConnection) url.openConnection();
			}
			
			conn.setDefaultUseCaches(false);
			conn.setDoInput(true);
			conn.setDoOutput(true);
			if (conttype.equals("")) conttype = "application/x-www-form-urlencoded";
			//application/json
			conn.addRequestProperty("Content-type", conttype);
			conn.setRequestMethod("POST");
			conn.connect();
			logger.info("URLConnectionCall Step1-connect Start");
			
			//out = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
			BufferedWriter bw;
			out = new OutputStreamWriter(conn.getOutputStream());			
			bw = new BufferedWriter(out);
			
			logger.info("data==>"+data);
			bw.write(data);				
			bw.flush();
			bw.close();	
			/*out.write(makeParam(data));
			out.flush();*/
			out.close();
			
			BufferedReader br = null;
			InputStream    is = null;
			String         line;
			int            respCode;
			
			if ( (respCode=conn.getResponseCode()) >= 400) {
				logger.info("ErrorCode:" + respCode + " " + conn.getResponseMessage());
				is = conn.getErrorStream();
			} else {
				is = conn.getInputStream();
			}
			br = new BufferedReader(new InputStreamReader(is,"UTF-8"));
			StringBuffer bf = new StringBuffer();
			while((line = br.readLine()) != null){
				bf.append(line.trim());
			}
			br.close();
			logger.info("URLConnectionCall Step2-connect End");
			
			//System.out.println("send ret  =>"+(bf.toString()));
			
			return bf.toString();
	    	      
		} catch(Exception e) {
			logger.error("URLConnectionCall send Exception===>"+(new StringBuilder("send : exception ")).append(e.getMessage()).append("\r\n").append(e.getStackTrace().toString()).toString());
			return "";
		} finally {
			if (conn!=null) conn.disconnect();
			conn = null;
			out = null;
		}
		
	}
	
	public static String URLConnectionCall(String ConnUrl, String conttype, String data, String proxy_ip, String proxy_port, String charset) throws Exception {
		if (ConnUrl != null && ConnUrl.indexOf("redirect:") > -1) {
			ConnUrl = ConnUrl.replace("redirect:", "");
		}
		
		String shortUrl = "";
		
		HttpURLConnection conn = null;
		OutputStreamWriter out = null;
		
		try {
			URLConnection urlConn = null;
			Properties systemProperties = System.getProperties();
			
			URL  url = new URL(ConnUrl); 
			if (!proxy_ip.equals("")){
				Proxy proxy = new Proxy (Proxy.Type.HTTP, new InetSocketAddress(proxy_ip,Integer.parseInt(proxy_port)));
				conn = (HttpURLConnection) url.openConnection(proxy);
			}else{
				conn = (HttpURLConnection) url.openConnection();
			}
			
			conn.setDefaultUseCaches(false);
			conn.setDoInput(true);
			conn.setDoOutput(true);
			if (conttype.equals("")) conttype = "application/x-www-form-urlencoded";
			//application/json
			conn.addRequestProperty("Content-type", conttype);
			conn.setRequestMethod("POST");
			conn.connect();
			logger.info("URLConnectionCall Step1-connect Start");
			
			//out = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
			BufferedWriter bw;
			out = new OutputStreamWriter(conn.getOutputStream());			
			bw = new BufferedWriter(out);
			
			logger.info("data==>"+data);
			bw.write(data);				
			bw.flush();
			bw.close();	
			/*out.write(makeParam(data));
			out.flush();*/
			out.close();
			
			BufferedReader br = null;
			InputStream    is = null;
			String         line;
			int            respCode;
			
			if ( (respCode=conn.getResponseCode()) >= 400) {
				logger.info("ErrorCode:" + respCode + " " + conn.getResponseMessage());
				is = conn.getErrorStream();
			} else {
				is = conn.getInputStream();
			}
			br = new BufferedReader(new InputStreamReader(is, charset));
			StringBuffer bf = new StringBuffer();
			while((line = br.readLine()) != null){
				bf.append(line.trim());
			}
			br.close();
			logger.info("URLConnectionCall Step2-connect End");
			
			//System.out.println("send ret  =>"+(bf.toString()));
			
			return bf.toString();
	    	      
		} catch(Exception e) {
			logger.error("URLConnectionCall send Exception===>"+(new StringBuilder("send : exception ")).append(e.getMessage()).append("\r\n").append(e.getStackTrace().toString()).toString());
			return "";
		} finally {
			if (conn!=null) conn.disconnect();
			conn = null;
			out = null;
		}
		
	}
	
	public static String SOAPURLConnectionSend(String ConnUrl, String accessToken, String conttype, String soapaction, String data) throws Exception {

		HttpURLConnection conn = null;
		OutputStreamWriter out = null;
		
		try {
			logger.info("address:" + ConnUrl);
			URL  url = new URL(ConnUrl); 
			conn = (HttpURLConnection) url.openConnection();
			conn.setDefaultUseCaches(false);
			conn.setDoInput(true);
			conn.setDoOutput(true);
			
			conn.addRequestProperty("Content-type", conttype);
			conn.addRequestProperty("SOAPAction", soapaction);
			conn.setRequestMethod("POST");
			
			System.out.println("send accessToken  =>"+accessToken);
			if (!accessToken.equals("")){
				conn.setRequestProperty("Authorization", "Basic " + accessToken);
			}
			
			conn.connect();
			
		/*	Map<String, List<String>> headers = conn.getHeaderFields();
			
			Iterator<String> it = headers.keySet().iterator();
            while(it.hasNext()) {
                 String key = it.next();
                 List<String> values = headers.get(key);
                 StringBuffer sb = new StringBuffer();
                 for(int i=0; i<values.size(); i++) {
                      sb.append(";" + values.get(i));
                 } 
                 logger.info(( key + "=" + sb.toString().substring(1)));
            }*/
			
			logger.info("Step1-connect Start");
			//out = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
			BufferedWriter bw;
			out = new OutputStreamWriter(conn.getOutputStream());			
			bw = new BufferedWriter(out);
			
			logger.info("data==>"+data);
			bw.write(data);				
			bw.flush();
			bw.close();	
			
			/*out.write(makeParam(data));
			out.flush();*/
			out.close();
			
			BufferedReader br = null;
			InputStream    is = null;
			String         line;
			int            respCode;
			
			if ( (respCode=conn.getResponseCode()) >= 400) {
				logger.info("ErrorCode:" + respCode + " " + conn.getResponseMessage());
				is = conn.getErrorStream();
			} else {
				is = conn.getInputStream();
			}
			br = new BufferedReader(new InputStreamReader(is,"UTF-8"));
			StringBuffer bf = new StringBuffer();
			while((line = br.readLine()) != null){
				bf.append(line.trim());
			}
			br.close();
			logger.info("Step2-connect End");
			
			//System.out.println("send ret  =>"+(bf.toString()));
			
			return bf.toString();
			
		} catch (Exception e) {
			logger.error("send Exception===>"+(new StringBuilder("send : exception ")).append(e.getMessage()).append("\r\n").append(e.getStackTrace().toString()).toString());
			return "";
		} finally {
			if (conn!=null) conn.disconnect();
			conn = null;
			out = null;
		}
	}
	
	
	public static String convertHangul(String money){ 
		String[] han1 = {"","일","이","삼","사","오","육","칠","팔","구"}; 
		String[] han2 = {"","십","백","천"}; 
		String[] han3 = {"","만","억","조","경"}; 
		StringBuffer result = new StringBuffer(); 
		int len = money.length(); 
		for(int i=len-1; i>=0; i--){ 
			result.append(han1[Integer.parseInt(money.substring(len-i-1, len-i))]); 
			if(Integer.parseInt(money.substring(len-i-1, len-i)) > 0) 
				result.append(han2[i%4]); 
			if(i%4 == 0) 
				result.append(han3[i/4]); 
		} 
		return result.toString(); 
	}

	public static long hangulToNum(String input){
		long result = 0;
		long tmpResult =0;
		long num = 0;
   
		final String NUMBER="영일이삼사오육칠팔구";
		final String UNIT= "십백천만억조";
		final long[] UNIT_NUM = {
				10,100,1000,10000,(long)Math.pow(10, 8),(long)Math.pow(10,12)
		};
   
		try{
			StringTokenizer st = new StringTokenizer(input,UNIT,true);//단위
			while(st.hasMoreTokens()){//삼,*,*,삼,*,*
				String token =st.nextToken();
				//숫자인지 단위(UNIT)인지 확인한다.
				int check =NUMBER.indexOf(token);//1)삼 ->3 2)십 ->-1
				System.out.println("CHECK:"+check);
	  
				if(check==-1){//단위인경우
					if("만억조".indexOf(token)==-1){//만억조가 아니면 3)만
						tmpResult+=(num!=0?num:1)*UNIT_NUM[UNIT.indexOf(token)];//num=30 * 10000
					}else{
						//만,억,조 경우 ->result
						tmpResult +=num;
						result +=(tmpResult!=0?tmpResult:1)*UNIT_NUM[UNIT.indexOf(token)];
						tmpResult = 0;
					}
					num = 0;
				}else{//숫자
					num = check;
				}
			}
		} catch (Exception e) {
			logger.error("send Exception===>"+(new StringBuilder("send : exception ")).append(e.getMessage()).append("\r\n").append(e.getStackTrace().toString()).toString());			
		}
		
		System.out.println("result:"+result);
		System.out.println("tmpResult:"+tmpResult);
		System.out.println("num:"+num);
       
		return result +tmpResult + num;      
	}
	
	
	public static String getDecimalFormatZeroPadding(double source) {
		return getDecimalFormatZeroPadding(source, 11, 3, false);
	}

	public static String getDecimalFormatZeroPadding(double source, boolean isThrow) {
		return getDecimalFormatZeroPadding(source, 11, 3, isThrow);
	}

	public static String getDecimalFormatZeroPadding(double source, int length, int precision) {
		return getDecimalFormatZeroPadding(source, length, precision, false);
	}

	/**
	 * 이지스밴 전문 형식에 맞게 숫자 변환하려고 만든 유틸함수.
	 * 정수의 최대 자리수를 넘기는 경우 최대 자리수로 잘라서 표시한다.
	 * length, precision 에 음수 넣으면 오류나는데 핸들링 하지 않음.
	 * 
	 *  @param	source		변환할 숫자
	 *  @param	length		전체 자리수 (소수점 포함)
	 *  @param	precision	소수점 자리수
	 *  @param	isThrow		익셉션(오버플로우) 발생 시 던질지 
	 *  
	 *  @return	변환 결과
	 * */
	public static String getDecimalFormatZeroPadding(double source, int length, int precision, boolean isThrow) {
		int order = length - precision;
		double decimal = source - (int) source;
		String str1 = String.format("%0" + order + "d", (int) source);

		if (isThrow) {
			if (order < StringUtils.length(str1)) {
				throw new RuntimeException("overflow");
			}
		}
		
		str1 = StringUtils.right(str1, order);
		
		if (0 != precision || 0 != decimal) {
			String str2 = String.format("%." + precision + "f", decimal);
			
			str1 += "." + StringUtils.substringAfter(str2, ".");
		}
		
		return str1;
	}
	
	/*
	 * pdfToImage  pdf 파일을 png 로 변환
	 * pdfFile   CmPathInfo.getUPLOAD_PATH()  제외한 전체 경로 파일명
	 * imgFile   CmPathInfo.getUPLOAD_PATH()  제외한 png 저장경로
	 * pageGub   0 한장, 1 한장씩
	 */
	
	public static boolean pdfToImage(String pdfFile, String imgFile, int pageGub, Map<String, Object> model) {
		boolean result = true;
		String retmsg = "";
		String filePathName = "";
		List<String> savedImgList = new ArrayList<>();
		
		//File file = new File(CmPathInfo.getUPLOAD_PATH() + pdfFile);
		File file = new File( pdfFile);
		
		if (file.exists()) {
	
			
			//makeFilePath(CmPathInfo.getUPLOAD_PATH() + imgFile);
			makeFilePath( imgFile);
					
			//try (final PDDocument document = PDDocument.load(new File(CmPathInfo.getUPLOAD_PATH() + pdfFile))){
			try (final PDDocument document = PDDocument.load(new File( pdfFile))){
	            PDFRenderer pdfRenderer = new PDFRenderer(document);
	            
	            List<BufferedImage> imgList = new ArrayList<BufferedImage>();
	            
	            for (int page = 0; page < document.getPages().getCount(); page++)
	            {
	                BufferedImage bim = pdfRenderer.renderImageWithDPI(page, 300, ImageType.RGB);
	                
	                imgList.add(bim);
	            }
	            
	            
	            if (pageGub == 0) {
		            int width1 = 0;
		            int width_temp = 0;
		            int heigth1 =0 ;
		            int heigth_temp = 0;
		            BufferedImage image_temp = null;
		            
		            for (int i=0; i<imgList.size(); i++) {
		            	if ( i == 0) {
		            		width1 = imgList.get(i).getWidth();
		            		heigth1 = imgList.get(i).getHeight();
		            		image_temp = imgList.get(i);            		
		            	}else {
		            		width_temp = imgList.get(i).getWidth();
		            		heigth_temp = imgList.get(i).getHeight();
		            		
		            		int width = Math.max(width1, width_temp);
		            		int height = heigth1 + heigth_temp;
		            		
		            		BufferedImage mergedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		            		Graphics2D graphics = (Graphics2D) mergedImage.getGraphics();
		
		            		graphics.setBackground(Color.WHITE);
		            		graphics.drawImage(image_temp, 0, 0, null);
		            		graphics.drawImage(imgList.get(i), 0, heigth1, null);
		            		
		            		image_temp = mergedImage;
		            		width1 = image_temp.getWidth();
		            		heigth1 = image_temp.getHeight();
		            	}
		            	
		            }
		            //String fileName = CmPathInfo.getUPLOAD_PATH() + imgFile;
		            String fileName = imgFile;
		            
		            ImageIOUtil.writeImage(image_temp, fileName, 300);
		            		            
		            filePathName = fileName;
	            }else {
	            	
	            	String imgFileNum = imgFile.substring(0,imgFile.length()-4);
	            	for (int i=0; i<imgList.size(); i++) {
	            		
	            		//String fileName = CmPathInfo.getUPLOAD_PATH() + imgFileNum+"-P"+i+".png";
	            		String fileName = imgFileNum+"-P"+i+".png";
	            		ImageIOUtil.writeImage(imgList.get(i), fileName, 300);
	            		
	            		
	            		savedImgList.add(fileName);
	            	}
	            	
	            }
	            
	            document.close();
	        } catch (IOException e){
	        	
	        	logger.error("Pdf 변환 EERROR "+e);
	            result = false;
	            retmsg = e.toString();
	        }
			
		}else {
			
			result = false;
			retmsg = "pdf 파일이 존재 하지 않습니다.";
			
		}
		
		
		model.put("retmsg", retmsg);
		model.put("filePathName", filePathName);
		model.put("FilePathNameList", savedImgList);
		
		
		return result;
	}
	
	public static String byteArrayToBinaryString(byte[] b){
	    StringBuilder sb=new StringBuilder();
	    for(int i=0; i<b.length; ++i){
	        sb.append(byteToBinaryString(b[i]));
	    }
	    return sb.toString();
	}

	public static String byteToBinaryString(byte n) {
	    StringBuilder sb = new StringBuilder("00000000");
	    for (int bit = 0; bit < 8; bit++) {
	        if (((n >> bit) & 1) > 0) {
	            sb.setCharAt(7 - bit, '1');
	        }
	    }
	    return sb.toString();
	}

	public static byte[] binaryStringToByteArray(String s){
	    int count=s.length()/8;
	    byte[] b=new byte[count];
	    for(int i=1; i<count; ++i){
	        String t=s.substring((i-1)*8, i*8);
	        b[i-1]=binaryStringToByte(t);
	    }
	    return b;
	}

	public static byte binaryStringToByte(String s){
	    byte ret=0, total=0;
	    for(int i=0; i<8; ++i){        
	        ret = (s.charAt(7-i)=='1') ? (byte)(1 << i) : 0;
	        total = (byte) (ret|total);
	    }
	    return total;
	}
	
	
}
