package apps.framework.utils;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.text.DecimalFormat;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.TreeMap;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONObject;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.util.CookieGenerator;

//import com.ap.common.sso.entity.SsoLoginEntity;
//import com.ari.vo.QtyDiscountVo;
import apps.framework.object.CmMap;
import apps.framework.utils.CmFunction;

import com.ufo.common.UFORequest;
import com.ufo.common.utility.CmUtil;
import com.ufo.common.utility.JSPHelper;
import com.ufo.common.utility.LoginHelper;
import com.ufo.member.entity.MemberMstEntity;
import com.ufo.member.entity.SiteMemberEntity;


@SuppressWarnings("rawtypes")
public class CommUtil {
	private static final Log	logger = LogFactory.getLog(CommUtil.class);
	/**
	* @Method Name  : changeCommaWon
	* @Date      	: 2013. 8. 8.
	* @Author      	: jumgmin
	* @Description 	: 세자리마다 콤마 찍기
	* 
	* @param d
	* @return
	*/
	public static String changeCommaWon(String d){
		
		String retStr = "";
		
		if (d == null || d.equals("")){
			retStr = "0";
		}else{
			
			java.text.DecimalFormat df = (java.text.DecimalFormat)java.text.NumberFormat.getInstance();
			df = new java.text.DecimalFormat("###,###,###,###");
			int maskMoney=Integer.parseInt(d);
			retStr = df.format(maskMoney);
		}
		
		return retStr;
	}
	
	
	/**
	* @Method Name  : MD5로 암호화
	* @Date      	: 2013. 2. 7.
	* @Author      	: jumgmin
	* @Description 	: 
	* 
	* @param param
	* @return
	*/
	public static String makeMD5(String param) {
		StringBuffer md5 = new StringBuffer();

		try {
			byte[] digest = MessageDigest.getInstance("MD5").digest(
					param.getBytes());

			for (int i = 0; i < digest.length; i++) {
				md5.append(Integer.toString((digest[i] & 0xf0) >> 4, 16));
				md5.append(Integer.toString(digest[i] & 0x0f, 16));
			}
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		return md5.toString();
	}
		
	/**
	* @Method Name  : getRandomNumber
	* @Date      	: 2013. 2. 7.
	* @Author      	: jumgmin
	* @Description 	: 인수에 만큼 랜덤숫자 생성 (ex : 122341123)
	* 
	* @param count
	* @return
	*/
	public static String getRandomNumber(int count){
		StringBuffer randomString = new StringBuffer();
		for(int i = 0; i < count; i++){
			randomString.append(String.valueOf((int) (Math.random()*10)));
		}
		return randomString.toString();
	}
	
	/**
	* @Method Name  : getXmlTagContent
	* @Date      	: 2013. 2. 7.
	* @Author      	: jumgmin
	* @Description 	: URLConnection 을 사용하여 반환된 xml중 tag안의 content를 가지고 온다.
	* 
	* @param StringUrl
	* @param startTag
	* @param endTag
	* @return
	*/
	public static String getXmlTagContent(String StringUrl, String startTag, String endTag){
		StringBuffer content = new StringBuffer();
		String xmlTagContent = ""; 
		
		if (StringUrl == null || StringUrl.equals("")){
			content = new StringBuffer("error");
			xmlTagContent = content.toString();
			return xmlTagContent;
		}
		
		BufferedReader in = null;
		try {

			URL url = new URL(StringUrl);
			URLConnection connection = url.openConnection();

			in = new BufferedReader(new InputStreamReader(
					connection.getInputStream()));

			String line = null;
			while ((line = in.readLine()) != null) {
				content.append(line);
			}

			in.close();
			
			xmlTagContent = content.substring(content.indexOf(startTag)+startTag.length(),content.indexOf(endTag));
			
		} catch (Exception e) {

			content = new StringBuffer("error");
			xmlTagContent = content.toString();
		}finally{
			if ( in != null){
				in = null;
			}
		}
		
		
		return xmlTagContent;
	}
	/**
	* @Method Name  : getXmlString
	* @Date      	: 2013. 2. 7.
	* @Author      	: jumgmin
	* @Description 	: URLConnection 을 사용하여 반환된 xml을 String 으로 가져온다.
	* 
	* @param StringUrl
	* @return
	*/
	public static String getXmlString(String StringUrl){
		StringBuffer content = new StringBuffer();
		
		if (StringUrl == null || StringUrl.equals("")) {
			content = new StringBuffer("error");
			return content.toString();
		}
		
		BufferedReader in = null;
		try {

			URL url = new URL(StringUrl);
			URLConnection connection = url.openConnection();
			
			
			in = new BufferedReader(new InputStreamReader(connection.getInputStream()));

			String line = null;
			while ((line = in.readLine()) != null) {
				content.append(line);
			}
			in.close();
		} catch (Exception e) {
			content = new StringBuffer("error");
			
		}finally{
			if ( in != null){
				in = null;
			}
		}
		
		return content.toString();
	}
	
	
	
	/**
	* @Method Name  : defaultString
	* @Date      	: 2013. 1. 30.
	* @Author      	: jumgmin
	* @Description 	: Map 에 담겨진 파라미터와 디폴트 값을 넣어 해당 데이터가 null 이거나 데이터가 빈값일 경우 default String 을 리턴한다.
	* 
	* @param v
	* @param d
	* @return
	*/
	public static String defaultString(Object v, String d){
		String returnValue;
		if(v == null ){
			returnValue = d;
		}else{
			returnValue = String.valueOf(v);
		}
		return returnValue;
	}
	
	/**
	* @Method Name  : setMessageCookie
	* @Date      	: 2013. 2. 1.
	* @Author      	: jumgmin
	* @Description 	: 메시지를 쿠키에 담는다.
	* 
	* @param response
	* @param message
	* @return
	* @throws Exception
	*/
	public static HttpServletResponse setMessageCookie(HttpServletResponse response, String message) throws Exception{
		
		Cookie killCookie = new Cookie("SCRIPT_MSG", null);
		killCookie.setMaxAge(0);
		response.addCookie(killCookie);
		 
		CookieGenerator cg = new CookieGenerator();
		cg.setCookieName("SCRIPT_MSG");
		cg.setCookiePath("/");
		cg.addCookie(response, URLEncoder.encode(message, "UTF-8"));
		
		//Cookie cookie = new Cookie("SCRIPT_MSG", URLEncoder.encode(message, "UTF-8"));
		//response.addCookie(cookie);
		
		return response;
	}
	
	/**
	* @Method Name  : setUrlCookie
	* @Date      	: 2013. 2. 1.
	* @Author      	: jumgmin
	* @Description 	: url을 쿠키에 담는다.
	* 
	* @param response
	* @param url
	* @return
	* @throws Exception
	*/
	public static HttpServletResponse setUrlCookie(HttpServletResponse response, String url) throws Exception{
		Cookie killCookie = new Cookie("SCRIPT_URL", null);
		killCookie.setMaxAge(0);
		response.addCookie(killCookie);
		
		CookieGenerator cg = new CookieGenerator();
		cg.setCookieName("SCRIPT_URL");
		cg.setCookiePath("/");
		cg.addCookie(response, URLEncoder.encode(url, "UTF-8"));
		
		//Cookie cookie = new Cookie("SCRIPT_URL", URLEncoder.encode(url, "UTF-8"));
		//response.addCookie(cookie);
		
		return response;
	}
	
	
	/**
	* @Method Name  : fillZero
	* @Date      	: 2013. 2. 14.
	* @Author      	: jumgmin
	* @Description 	: "0"으로 채운다 
	* 
	* @param gubun
	* @param seq
	* @param maxlength
	* @return
	*/
	public static String fillZero(String gubun, String seq, int maxlength){
		String temp = gubun + seq;
		StringBuffer zeroString = new StringBuffer();
		for(int i = temp.length(); i < maxlength; i++){
			zeroString.append("0");
		}
		return gubun+zeroString+seq;
	}
	
	/**
	 * 쿠키를 저장하는 메쏘드
	 *
	 * @param 	res						HttpServletResponse
	 * @param		cookieName		쿠키명
	 * @param		cookieValue		쿠키값
	 */
	static public void setCookie (HttpServletResponse res, String cookieName, String cookieValue) {
		Cookie saveCookie = new Cookie (cookieName, cookieValue);
		saveCookie.setPath("/");
		res.addCookie(saveCookie);
	}
	
	/**
	 * 쿠키를 저장하는 메쏘드
	 *
	 * @param 	res						HttpServletResponse
	 * @param		cookieName		쿠키명
	 * @param		cookieValue		쿠키값
	 * @param		maxAge				쿠키저장시간 
	 * @throws UnsupportedEncodingException 
	 */
	static public void setCookie (HttpServletResponse res, String cookieName, String cookieValue, int maxAge) throws UnsupportedEncodingException {
		Cookie saveCookie = new Cookie (cookieName, java.net.URLEncoder.encode(cookieValue,"euc-kr"));
		saveCookie.setMaxAge(maxAge);
		saveCookie.setPath("/");
		res.addCookie(saveCookie);
	}

	
	/**
	 * 쿠키값을 가져오는 메쏘드
	 *
	 * @param 	req						HttpServletRequest
	 * @param		cookieName		쿠키명
	 * @return	String				쿠키값
	 */
	static public String getCookie (HttpServletRequest req, String cookieName) {
		Cookie[] readCookie = req.getCookies();
		
		String cookieValue = "";
		
		if (readCookie != null)
			for (int i=0; i< readCookie.length; i++) {
				if (readCookie[i].getName().equals(cookieName)) {
					try {
						cookieValue = URLDecoder.decode(readCookie[i].getValue(),"euc-kr");
					} catch (UnsupportedEncodingException e) {}
				}	
			}
		
		return cookieValue;
	}

	/**
	 * 전체 쿠키값 비우기
	 *
	 * @param 	req						HttpServletRequest
	 * @param	res						HttpServletResponse	
	 */	
	static public void clearCookie (HttpServletRequest req, HttpServletResponse res) {
		Cookie[] cookies = req.getCookies();
		for(int i=0; i < cookies.length; i++) {			
			cookies[i].setMaxAge(0);	
			cookies[i].setPath("/");
			res.addCookie(cookies[i]);
		}
	}	
	
	/**
	 * 요일 가져오기
	 * <pre>
	  Calendar cal = Calendar.getInstance();
	  String dow = CommUtil.getDayOfWeek(cal);
	  
	  
	  </pre>
	 * @param 	cal						Calendar
	 * @return	String				요일(월요일, 화요일...)
	 */	
	static public String getDayOfWeek (Calendar cal) {
				
		String dayOfWeek="";
		int i = cal.get(Calendar.DAY_OF_WEEK);
		switch(i){
			case Calendar.SUNDAY:
				dayOfWeek="일요일";
				break;
			case Calendar.MONDAY:
				dayOfWeek="월요일";
				break;
			case Calendar.TUESDAY:
				dayOfWeek="화요일";
				break;
			case Calendar.WEDNESDAY:
				dayOfWeek="수요일";
				break;
			case Calendar.THURSDAY:
				dayOfWeek="목요일";
				break;
			case Calendar.FRIDAY:
				dayOfWeek="금요일";
				break;
			case Calendar.SATURDAY	:	
				dayOfWeek="토요일";
				break;
			default:
				dayOfWeek="";
				break;
				
		
		}
		
		
		
		
		return dayOfWeek;
	}		
	

    /**
     * 엑셀 파일 다운로드
     * 공통모듈
     * @param response, file_nm, xTitle, dataArray,	sheetName
     * @throws Exception
     
    public static void getExcel(HttpServletResponse response, String file_nm, ArrayList xTitle,  ArrayList dataArray,	String sheetName) throws Exception {
        logger.debug("[TestCaseMngrController.getExcel]");
         
        //Excel Write
        HSSFWorkbook workbook = new HSSFWorkbook();
        HSSFSheet sheet = workbook.createSheet(sheetName);
        
                
        OutputStream out = response.getOutputStream();
        FileOutputStream fileOut = null;
        
        HSSFCell cell = null;
        String value = null;
        double num;
        
        try {
            //Font 설정.
            HSSFFont font = workbook.createFont();
            font.setFontName(HSSFFont.FONT_ARIAL);
                    
            //제목의 스타일 지정
            HSSFCellStyle titlestyle = workbook.createCellStyle();
            titlestyle.setFillForegroundColor(HSSFColor.SKY_BLUE.index);
            titlestyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
            titlestyle.setAlignment(CellStyle.ALIGN_CENTER);
            titlestyle.setFont(font);

            //Row 생성
            //PJT.PJT_NM, MT.MSTR_NM, CYCL.CYCL_NM 
                  
            
            
            //제목row
            HSSFRow row5 = sheet.createRow((short)0); // 제목 row
            //Cell 생성
            for(short i=0; i<xTitle.size(); i++) 
            {
                cell = row5.createCell(i);
                cell.setCellStyle(titlestyle);
                //cell.setCellType( HSSFCell.CELL_TYPE_STRING );
                value = (String)xTitle.get(i);
                cell.setCellValue(value);
            }

            //내용 스타일 지정
            HSSFCellStyle style = workbook.createCellStyle();
            style.setWrapText(true);
            style.setFont(font);

            //내용중 가운데 정렬 추가
            HSSFCellStyle styleCenter = workbook.createCellStyle();
            styleCenter.setAlignment(CellStyle.ALIGN_CENTER);
            styleCenter.setFont(font);
            
          //데이터 입력 row
            HSSFRow rowRst ;
            // 2 row 부터 시작.
            for(int j=0, k=1; k<=dataArray.size(); j++, k++) 
            {
                ArrayList list = (ArrayList)dataArray.get(j);
                int len=list.size();
                rowRst = sheet.createRow(k);	//k = row
            
                if(len>0 )
                { 
                    for(int l=0; l<len; l++) 
                    {
                        cell = rowRst.createCell( l );
                        cell.setCellStyle(style);
                        cell.setCellType( Cell.CELL_TYPE_STRING );
                        value =(String)list.get(l);                        
                        cell.setCellValue(value);                        
                    }
                }
            }

            //실제 생성될 엑셀파일 이름
            String realName = file_nm + ".xls";
            
            response.setContentType("application/vnd.ms-excel");
            //response.setContentType("application/octet-stream");

            response.setHeader(
                    "Content-disposition",
                    "attachment;filename=" + java.net.URLEncoder.encode(realName,"UTF-8"));
            
            workbook.write(out);
            out.close();    

            logger.debug("[excel 파일 생성 성공...] " + realName);

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw e;
        } finally
        {
            if (out != null)
            out.close();
        }
     
    }*/

    /**
    * @Method Name  : get10to36Radix
    * @Date      	: 2013. 5. 20.
    * @Author      	: hong
    * @Description 	: sap 주문 연동에서 일자별 주문번호 컬럼(4자리)에 데이터를 채우기 위해 int 를 36 진수로 변환함
    * 값의 범위는 0~ 999999 임(편의상 6자리로 제한함)
    *  ex) CommUtil.get10to36Radix(10); // =====> 000A
    * @param iVal
    * @return
    * @throws Exception 값의 범위가 0 ~ 999999 가 아닐경우 발생
    */
    public static String get10to36Radix (int iVal) throws Exception{

    	if (iVal <0 || iVal > 999999 ){
    		throw new Exception("값의 범위는 0 ~ 999999 입니다..");
    	}    	
    	
    	String radix36 =  (Integer.toString(iVal, 36)).toUpperCase();
    	int len = radix36.length();
    	if(len==1){
    		radix36 = "000"+radix36;
    	}else if(len==2){
    		radix36 = "00"+radix36;
    	}else if(len==3){
    		radix36 = "0"+radix36;
    	}
    	
    	return radix36;
    }
    /**
    * @Method Name  : get36to10Radix
    * @Date      	: 2013. 5. 20.
    * @Author      	: hong
    * @Description 	: 36 진수를 10 진수로 변환함
    * 값의 범위는 0~ 999999 임(편의상 6자리로 제한함)
    *  ex) CommUtil.get36to10Radix("000A"); // =====> 10
    * @param iVal
    * @return
    * @throws Exception 값의 범위가 0000 ~ ZZZZ 가 아닐경우 발생
    */
    public static int get36to10Radix (String val36) throws Exception{
    	if (val36.length() <4 ){
    		throw new Exception("값의 범위는 0000 ~ ZZZZ 입니다..");
    	}    	
    	int radix10 =  Integer.parseInt(val36, 36);
    	
    	return radix10;
    }	
    

	//문자열에서 모든 HTML 태그를 삭제한다.
	public static String removeHtmlTag(String i_sHTML) {
		String result = "";
		if ((null == i_sHTML) || "".equals(i_sHTML)) {
			return "";
		}
		
		result	= i_sHTML.replaceAll("<.+?>", "");
		result = result.replaceAll("\r", "");
		result = result.replaceAll("&nbsp;", " ");
		return result;
	}
	// 문자열에서 \n을  --> <br> 로 변경
	public static String changeBr(String str) {
 		String	result	= "";
 		
 		if ((null == str) || "".equals(str)) {
 			return "";
 		}
 		
 		result = str.replaceAll("\n", "<br/>");
		result = result.replaceAll("\r", "");
 		
 		return result;
 	}
   
	/**
	* @Method Name  : cleanXSS
	* @Date      	: 2013. 7. 30.
	* @Author      	: ikara
	* @Description 	: XSS 공격 가능 문제 제거 
	* @param request
	* @return HashMap
	*/
	public static String cleanXSS(Object val){
		String value = "";
		try{
			value = val.toString();
			value = value.replaceAll("#", "&#35;");
			value = value.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
	        value = value.replaceAll("\\(", "&#40;").replaceAll("\\)", "&#41;");
	        value = value.replaceAll("'", "&#39;");
	        //value = value.replaceAll("&", "&#38;");
	        value = value.replaceAll("\\\"", "&quot;");
	        value = value.replaceAll("eval\\((.*)\\)", "");
	        //value = value.replaceAll("[\\\"\\\'][\\s]*javascript:(.*)[\\\"\\\']", "\"\"");
	        //value = value.replaceAll("script", "");
		}catch(Exception e){
			value = "";
		}
		
        return value;
	}
	
	private static Random random = new Random();
	
	/**
	 * YHCHOI :: 인증코드 코드 - get Random Number
	 * @return
	 */
	private static int getRandomNum() {
		return random.nextInt(10);
	}
	
	public static String getRandomCodeForAuth() {
		String result = "";
		int counter = 0;
		while(true) {
			result = result.concat(String.valueOf(getRandomNum()));
			counter++;
			
			if(counter == 6) {
				break;
			}
		}
		return result;
	}
	
	public static String getRandomCode() {
		//난수 만들기
		StringBuffer sb	= new StringBuffer();
		String	str			= "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		int 	len 		= str.length();
		Random	random		= new Random();
		
		for (int i = 0; i < 2; i++) {
			int iRan1 	= random.nextInt(len);
			sb.append(str.substring(iRan1, iRan1+1));
		}
		
		return sb.toString();
	}
	
	
	/**
	 * 
	 * @param strLength
	 * @return
	 */
	public static String getRandomString(int strLength, int numPer, int strPer) {
		
		String 		returnStr	= "";
		String[] 	strArr		= null;
		
		numPer = numPer < 0 ? 0 : numPer;
		strPer = strPer < 0 ? 0 : strPer;
		
		if (numPer == 0 && strPer == 0) {
			strArr		= new String[]{"0123456789", "abcdefghijklmnopqrstuvwxyz"};
		}
		else {
			strArr 		= new String[numPer + strPer];
			int idx = 0;
			
			for (int i = 0; i < numPer; i++) {
				strArr[idx++] = "0123456789";
			}
			for (int i = 0; i < strPer; i++) {
				strArr[idx++] = "abcdefghijklmnopqrstuvwxyz";
			}
		}
		
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
	 * @Method UCC 이벤트 엑셀다운로드 기능 위해 추가
	 * @author YKLEE
	 * @param strValue
	 * @param strDefault
	 * @return
	 */
	public static String evl(Object strValue, String strDefault) {
		String strReturn = "";
		
		if(strValue == null) {
			strReturn = strDefault;
			
		} else if("".equalsIgnoreCase(strValue.toString())) {
			strReturn = strDefault;
			
		} else {
			strReturn = strValue.toString();
		}
		
		return strReturn;
	}
	
	
	/**
	 * @Method 현재 페이지 URL 반환, QueryString 포함
	 * @author gschoi
	 * @param request
	 * @return String
	 */
	public static String getCurrentURL(HttpServletRequest request) {
		String currentUrl = request.getAttribute("javax.servlet.forward.request_uri") != null ? request.getAttribute("javax.servlet.forward.request_uri").toString() : request.getRequestURL().toString();// return URL
		String queryString = request.getAttribute("javax.servlet.forward.query_string") != null ? request.getAttribute("javax.servlet.forward.query_string").toString() : request.getQueryString() != null ? request.getQueryString().toString() : "";
		if ( queryString != null && !"".equals(queryString) ) {
			currentUrl += "?" + queryString;
		}
		return currentUrl;
	}
	
	public static String getCurrentURL2(HttpServletRequest request) {
		String currentUrl = request.getRequestURI();// return URL
		String queryString = request.getAttribute("javax.servlet.forward.query_string") != null ? request.getAttribute("javax.servlet.forward.query_string").toString() : request.getQueryString() != null ? request.getQueryString().toString() : "";
		if ( queryString != null && !"".equals(queryString) ) {
			currentUrl += "?" + queryString;
		}
		return currentUrl;
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
	
	/**
	 * @Method 총페이지수 계산
	 * @author gschoi
	 * @param hMap
	 * @param totalCnt
	 * @return int
	 */
	public static int getTotalPageCnt(HashMap<String,String> hMap ,int totalCnt) {
		if(hMap.get("ROWCOUNT") == null || "".equals("ROWCOUNT")){
			hMap.put("ROWCOUNT","10");
		}
		int		rowCnt		=	Integer.parseInt(hMap.get("ROWCOUNT"));
		int		totalPage	=	0;
		
		if(totalCnt > 0){
			totalPage	=	totalCnt%rowCnt == 0 ? totalCnt/rowCnt : Math.round(totalCnt/rowCnt)+1;
		}
		
		return totalPage;
	}
	
	public static String urlToString(String i_sUrl) {
		String	sReturn	= "";
		
		try {
				URL					url			= new URL(i_sUrl);
				HttpURLConnection	conn		= (HttpURLConnection) url.openConnection();
				byte[]				bTmp		= null;
				InputStream 		in			= null;
				
				conn.connect();
				
				in			= conn.getInputStream();
				
				bTmp		= CmFunction.fileToByte(in);				// file => byte
				sReturn		= new String(bTmp, "UTF-8");
				
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		return sReturn;
	}
	
	
	
	public static  HttpServletRequest getCurrentRequest() {

	       ServletRequestAttributes sra = (ServletRequestAttributes) RequestContextHolder
	               .currentRequestAttributes();

	       HttpServletRequest hsr = sra.getRequest();
	       return hsr;
	}
	
	/**
	 * 
	 * @param i_oSource
	 * @return
	 */
	public static String getStrVal(Object obj) {
		return obj == null ? "" : getStrVal(obj.toString());
	}

	/**
	 * 
	 * @param str
	 * @return
	 */
	public static String getStrVal(String str) {
		return str == null ? "" : str.trim();
	}
	
    /**
     * Object => int 형으로 변환
     * @param str
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
	 * CmMap => Map 
	 * @param reqVo
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static HashMap cloneCmMapToHashMap(CmMap map) {
		
		if (map == null) {
			return null;
		}
		
		Iterator	itr		        = map.keySet().iterator();
		String		oldKey	        = "";
		HashMap retMap = new HashMap();
		
		while (itr.hasNext()) {
			oldKey 	= (String)itr.next();
			retMap.put(oldKey, map.get(oldKey));
		}
		return retMap;
	}
	
	
	
	@SuppressWarnings("unchecked")
	public static void setSessionValue(HttpServletRequest request, CmMap dataMap ) {

    	if (request == null)
    		request = getCurrentRequest();

    	if (dataMap == null)
			dataMap		= new CmMap();
		
		HttpSession		session		= request.getSession();
		
		String userid = "";
		
		MemberMstEntity memberInfo = (MemberMstEntity)session.getAttribute("loginInfo");
		
		if (memberInfo != null) {
			userid = memberInfo.getCstmId();
		}
		
		dataMap.put("loginInfo", session.getAttribute("loginInfo"));
		dataMap.put("_USER_CLASS", session.getAttribute("_USER_CLASS"));
		dataMap.put("_VIP_JOIN_DATE", session.getAttribute("_VIP_JOIN_DATE"));
		
		String USER_IP = request.getRemoteAddr();
		
		dataMap.put("REGIP", USER_IP);
		dataMap.put("REGUSER", userid != null && !userid.equals("") ? userid : "guest");
		dataMap.put("UPDIP", USER_IP);
		dataMap.put("UPDUSER", userid != null && !userid.equals("") ? userid : "guest");
	}
	
	
	/**
	 * 에러로그 출력
	 * @param e
	 */
	public static void errorLogger(Exception e) {
		
		if (!logger.isErrorEnabled()) {
			return;
		}
		
		StackTraceElement[]	ste = e.getStackTrace();
		
		String	className	= "";
		String	className2	= "";
		String	methodName	= "";
		int		lineNumber	= 0;
		
		logger.error("============ [Start] Exception =======================");
		for (int i = 0; i < ste.length; i++) {
            className      = ste[i].getClassName();
            className2     = className.substring(className.lastIndexOf(".") + 1, className.length()); 
            methodName     = ste[i].getMethodName();
            lineNumber     = ste[i].getLineNumber();
            
            if (lineNumber > -1)
            	logger.error(className + "." + methodName + "(" + className2 + ".java:" + lineNumber + ")");
            else
            	logger.error(className + "." + methodName + "(Unknown Source)");
        }
		logger.error("============ [end] Exception =======================");
		
	}
	
	

	
	
	
	public static void jsonArrayToList(List<CmMap> list, JSONArray jsonArray, String[][] arr) throws Exception  {
		
		if (jsonArray == null) {
			return;
		}
		
		if (list == null) {
			list =  new ArrayList<CmMap>();
		}
		
		int len = jsonArray == null ? 0 : jsonArray.length();
		
		for (int i = 0; i < len; i++) {
			list.add(CommUtil.jsonObjectToCmMap(jsonArray.getJSONObject(i), arr ));
		}
		
		return;
	}
	
	
	@SuppressWarnings("unchecked")
	public static CmMap jsonObjectToCmMap(JSONObject jsonObject, String[][] arr) throws Exception {
		
		if (jsonObject == null) {
			return null;
		}
		
		CmMap map = new CmMap();
		
		if (arr != null) {
			int len = arr.length;
			String val = "";
			
			for (int i = 0; i < len; i++) {
				val = "";
				if (!arr[i][1].equals("")) {
					try {
						val = jsonObject.get(arr[i][1]).toString();
					} catch (Exception e) {
					}
				}
				map.put(arr[i][0], val);
			}
		}
		else {
			
			Iterator itr = jsonObject.keys();
			
			String key = "";
			
			while (itr.hasNext()) {
				key = (String)itr.next();
				map.put(key, jsonObject.get(key).toString());
			}
		}
		return map;
	}
	
	/**
	 * 널체크
	 * @ kdh
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public static boolean isNullCheck(Object _o) {
		try {
			if(_o == null) return false;
			if(_o instanceof Integer) {
				if((Integer)_o != 0) return true;
			} else if(_o instanceof String) {
				if((String)_o != null && !"".equals((String)_o)) return true;
			} else if(_o instanceof Long) {
				if((Long)_o != 0L) return true;
			} else if(_o instanceof List) {
				if(_o != null && ((List)_o).size() > 0) return true; 
			} else if(_o instanceof Map) {
				if(_o != null && ((Map)_o).size() > 0) return true; 
			} else {
				if(_o != null) return true;
			}
		} catch(Exception e) {
			logger.error(e); //e.printStackTrace();
			return false;
		}
		return false;
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
	
	
	// 텍스트를 * 로 변환  (ex : ("abcdebe" , 2)  = ab*****)
	 public static String getStringHidden(String str, int length) {
		 StringBuffer sb = new StringBuffer();
			
		if (str != null && !str.equals("")) {
			int	strLen		= str.length();
			
			if (length >= strLen) {
				sb.append(str.subSequence(0, strLen - 1)).append("*");
			}
			else {
				for (int i = 0; i < strLen; i++) {
					if (i < length) {
						sb.append(str.charAt(i));
					}
					else {
						sb.append("*");
					}
				}
			}
		}
		return sb.toString();
	}
	 
	 public static String getChangeUserNm(String usernm) {
		StringBuffer sb = new StringBuffer();
		
		usernm = usernm == null ? "" : usernm.trim();
		
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
	* @Method Name  : getLocalAddr
	* @Date      	: 2012. 8. 2.
	* @Author      	: ds.choi
	* @Description 	: 현재 서버의 IP를 얻어옴(리눅스에서 loopback 어드레스를 걸러냄)
	* 
	* @return
	*/
	public static String getLocalAddr(){
		String ret = "";
		boolean loopback = true;
		
		try{
			Enumeration nets = NetworkInterface.getNetworkInterfaces();
			while(nets.hasMoreElements()){
				NetworkInterface netint = (NetworkInterface)nets.nextElement();
				//if(netint.isLoopback()) continue;

				Enumeration inetAddresses = netint.getInetAddresses();
				while(inetAddresses.hasMoreElements()){
					InetAddress inetAddress = (InetAddress)inetAddresses.nextElement();
					String hostAddress = inetAddress.getHostAddress();
					if(hostAddress!=null && !hostAddress.startsWith("127") && !hostAddress.startsWith("192") && hostAddress.indexOf('.')!=-1){
						ret = inetAddress.getHostAddress();
						loopback = false;
					}
				}

				if(!loopback) break;
			}
		}catch(SocketException ex){
			ex.printStackTrace();
			ret = "";
		}

		return ret;
	}
	 
	 
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
	 
}