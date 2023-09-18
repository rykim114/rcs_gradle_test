package apps.framework.controller;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.ModelAndViewDefiningException;
import org.springframework.mobile.device.Device;

import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.utils.CmFunction;
import apps.framework.utils.CmPathInfo;


@SuppressWarnings("rawtypes")
public class CmController {
	
	protected final Log	logger = LogFactory.getLog(this.getClass());
	
	
	protected MessageSource messageSource;
	
	/**
	 * paging
	 * @param dataMap
	 */
	protected CmMap  setListPaging (int recordCnt, CmMap reqVo, int i_iPageSize, int i_iNowPageNo) {
		
		CmMap page = new CmMap();
		
		if (reqVo == null)
			reqVo		= new CmMap();
		
		int	totalPageCnt		= 0;
		int startRownum			= 0;
		int endRownum			= 0;
		
		if (i_iPageSize <= 0)	i_iPageSize	= 10;
		if (i_iNowPageNo <= 0)	i_iNowPageNo	= 1;
		
		if (recordCnt <= i_iPageSize)
			totalPageCnt	= 1;
		else
			totalPageCnt	= ((recordCnt - 1) / i_iPageSize) + 1;
		
		if (totalPageCnt < i_iNowPageNo)	i_iNowPageNo		= totalPageCnt;
		
		startRownum = (i_iNowPageNo - 1) * i_iPageSize + 1;
		endRownum 	= i_iNowPageNo * i_iPageSize;
		
		reqVo.put("i_iTotalPageCnt", "" + totalPageCnt);
		reqVo.put("i_iRecordCnt", ""+recordCnt);
		reqVo.put("i_iPageSize", ""+i_iPageSize);
		reqVo.put("i_iNowPageNo", ""+i_iNowPageNo);
		reqVo.put("i_iStartRownum", "" + startRownum);
		reqVo.put("i_iEndRownum", "" + endRownum);
		
		page.put("i_iTotalPageCnt", "" + totalPageCnt);
		page.put("i_iRecordCnt", ""+recordCnt);
		page.put("i_iPageSize", ""+i_iPageSize);
		page.put("i_iNowPageNo", ""+i_iNowPageNo);
		page.put("i_iStartRownum", "" + startRownum);
		page.put("i_iEndRownum", "" + endRownum);
		
		return page;
	}
	
	public boolean isCmLoginCheck () {
		
		HttpServletRequest 	request = CmFunction.getCurrentRequest();
		HttpSession			session	= request.getSession();
		
		String userId = CmFunction.getStrVal((String)session.getAttribute("s_userId"));
		
		boolean			bReturn			= false;
		if (!userId.equals("")) {
			bReturn = true;
		}
		return bReturn;
	}
	
	public boolean isCmAdminLoginCheck () {
		
		HttpServletRequest 	request = CmFunction.getCurrentRequest();
		HttpSession			session	= request.getSession();
		
		String userId = CmFunction.getStrVal((String)session.getAttribute("admin_userId"));
		
		boolean			bReturn			= false;
		if (!userId.equals("")) {
			bReturn = true;
		}
		return bReturn;
	}
	
	
	public String isDeviceCheck (HttpServletRequest request ) {
		String retViewStr = "";
		
		Device device = (Device)request.getAttribute("currentDevice");
		
		if (device.isNormal()) {
			retViewStr = "/pc";
	    } else if (device.isTablet()) {
	    	retViewStr = "/pc";
	    } else if (device.isMobile()) {
	    	retViewStr = "/mobile";
	    }
		
		String	uri	= request.getRequestURI();
		if (uri.startsWith("/front")) {
			retViewStr = "/front"+retViewStr;
		}
	    return retViewStr;
	}

	public String isBrowserCheck (HttpServletRequest request ) {
		String retViewStr = "";
		
		String browser = request.getHeader("User-Agent");
		browser = browser.toLowerCase();
		
		if (browser.indexOf("trident/4.0") > -1) retViewStr = "IE 8";
		else if (browser.indexOf("trident/5.0") > -1) retViewStr = "IE 9";
		else if (browser.indexOf("trident/6.0") > -1) retViewStr = "IE 10";
		else if (browser.indexOf("trident/7.0") > -1) retViewStr = "IE 11";
		else if (browser.indexOf("msie") > -1) retViewStr = "IE";
		else if (browser.indexOf("chrome") > -1) retViewStr = "Chrome";
		else if (browser.indexOf("opera") > -1) retViewStr = "Opera";
		else if (browser.indexOf("staroffice") > -1) retViewStr = "Star Office";
		else if (browser.indexOf("webtv") > -1) retViewStr = "WebTV";
		else if (browser.indexOf("beonex") > -1) retViewStr = "Beonex";
		else if (browser.indexOf("chimera") > -1) retViewStr = "Chimera";
		else if (browser.indexOf("netpositive") > -1) retViewStr = "NetPositive";
		else if (browser.indexOf("phoenix") > -1) retViewStr = "Phoenix";
		else if (browser.indexOf("firefox") > -1) retViewStr = "Firefox";
		else if (browser.indexOf("safari") > -1) retViewStr = "Safari";
		else if (browser.indexOf("skipstone") > -1) retViewStr = "SkipStone";
		else if (browser.indexOf("netscape") > -1) retViewStr = "Netscape";
		else if (browser.indexOf("mozilla/5.0") > -1) retViewStr = "Mozilla";
		else retViewStr = browser;
	
	    return retViewStr;
	}
	
	/**
	 * 
	 * @param e
	 */
	protected void errorLogger(Exception e) {
		
		logger.error(e); //e.printStackTrace();
		/*
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
		*/
	}
	
	/**
	 * 
	 * @param mav
	 * @param status	[succ(성공) | fail(필수 인자값 오류 등) | error(작업중 오류)]
	 * @param message
	 * @param object
	 * @return
	 */
	@SuppressWarnings("unchecked")
	protected ModelAndView makeJsonResult (ModelAndView mav, String status, String message, Object object) {
		StringBuffer		sb		= new StringBuffer();
		String				tempStr	= "";
		try {
			
			sb.append("{");
			sb.append("    \"status\" : \"").append(status).append("\"");
			sb.append("    , \"message\" : \"").append(message).append("\"");
			
			if (object != null) {
				sb.append("    , \"object\" : ");
				
				if (object instanceof String ) {
					String	str		= CmFunction.getStrVal((String)object).trim();
					
					if ( (str.indexOf("{") == 0 && str.indexOf("}") == str.length()-1)
							|| (str.indexOf("[") == 0 && str.indexOf("]") == str.length()-1) ) {
						
						sb.append(str);
					}
					else {
						sb.append("\"").append(str).append("\"");
					}
				} 
				else if (object instanceof JSONArray) {
					JSONArray		jArr	= (JSONArray) object;
					Object			obj		= null;
					int 			len		= jArr.length();
					
					try {
						sb.append("[");
						
						for (int i = 0; i < len; i++) {
							if (i > 0)
								sb.append(",");
							
							obj	= jArr.get(i);
							
							if (obj instanceof JSONObject) {
								tempStr	= ((JSONObject)obj).toString();
							}
							else if (obj instanceof CmMap){
								tempStr	= new JSONObject((CmMap)obj).toString();
							}
							else {
								tempStr	= new JSONObject(obj).toString();
							}
							
							sb.append(tempStr);
						}
						sb.append("]");
					} catch (Exception e) {
						logger.error(e); //e.printStackTrace();
						sb		= new StringBuffer();
						sb.append("[]");
					}
				} 
				else if (object instanceof JSONObject) {
					sb.append( ((JSONObject)object).toString() );
				}
                else if (object instanceof Integer ) {
                    int	str		= CmFunction.getIntVal(object);
                    sb.append(str);
                }
                else if (object instanceof CmMap){
					sb.append( (new JSONObject((CmMap<Object, Object>)object).toString()) );
				}
				else if (object instanceof CmResMap){
					sb.append( (new JSONObject((CmResMap<Object, Object>)object).toString()) );
				}
				else if (object instanceof List){
					
					sb.append( (new JSONArray((List<CmMap>)object).toString()) );
				}
				else {
					sb.append( (new JSONObject(object).toString()) );
				}
			}
			
			sb.append("}");
			
			tempStr		= sb.toString();
			tempStr 	= tempStr.replaceAll("\\r\\n", "<br/>");
			tempStr 	= tempStr.replaceAll("\\n", "<br/>");
			
			if (logger.isDebugEnabled()) {
				logger.debug(tempStr);
			}
			
			mav.addObject("JSON", tempStr);
			mav.setViewName("jsonView");
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		
		return mav;
	}
	
	/**
	 * 
	 * @param mav
	 * @param status	[succ(성공) | fail(필수 인자값 오류 등) | error(작업중 오류)]
	 * @param message
	 * @param object
	 * @return
	 */
	protected ModelAndView makeHtmlResult (ModelAndView mav, String html) {
		try {
			
			if (logger.isDebugEnabled()) {
				logger.debug(html);
			}
			
			mav.addObject("HTML", html);
			mav.setViewName("htmlView");
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		
		return mav;
	}
	
	/**
	 * 로그인 페이지 이동
	 * @param mav
	 * @param request
	 * @return
	 */
	protected ModelAndView setUserLoginPage(ModelAndView mav, HttpServletRequest request) {
		
		CmMap reqVo = new CmMap();
		StringBuffer sb = new StringBuffer();
		
		CmFunction.setPageUrlAndPars(request, reqVo);
		reqVo.put("pageUrl", request.getRequestURL());
		
		try {
			sb.append("returnUrl=").append(URLEncoder.encode(CmFunction.getStrVal(reqVo.getString("pageUrl")), CmPathInfo.getCHARSET()));
			sb.append("&");
			sb.append("returnParam=").append(URLEncoder.encode(CmFunction.getStrVal(reqVo.getString("pageParam")), CmPathInfo.getCHARSET()));
			sb.append("&");
			sb.append("i_sReturnUrl=").append(URLEncoder.encode(CmFunction.getStrVal(reqVo.getString("i_sReturnUrl")), CmPathInfo.getCHARSET()));
			sb.append("&");
			sb.append("i_sReturnParam=").append(URLEncoder.encode(CmFunction.getStrVal(reqVo.getString("i_sReturnParam")), CmPathInfo.getCHARSET()));
			
			if (!reqVo.getString("i_sReturnUrl2").equals(""))
				sb.append("&").append("i_sReturnUrl2=").append(URLEncoder.encode(CmFunction.getStrVal(reqVo.getString("i_sReturnUrl2")), CmPathInfo.getCHARSET()));
			if (!reqVo.getString("i_sReturnParam2").equals(""))
				sb.append("&").append("i_sReturnParam2=").append(URLEncoder.encode(CmFunction.getStrVal(reqVo.getString("i_sReturnParam2")), CmPathInfo.getCHARSET()));
		}
		catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		
		mav.setViewName("redirect:" + CmPathInfo.getSSL_URL_CHANGE() + "user/lo/user_lo_login.do?" + sb.toString());                         
		
		return mav;
	}
	
	/**
	 * 
	 * @param mav
	 * @param reqVo
	 * @param returnUrl
	 * @param returnPars
	 * @param message
	 * @param script
	 * @return
	 */
	protected ModelAndView makeMessageResult (ModelAndView mav, CmMap reqVo, String i_sReturnUrl, String i_sReturnParam, String message, String script) {
		mav.addObject("returnParam", i_sReturnParam);
		mav.addObject("returnUrl", i_sReturnUrl);
		mav.addObject("message", message);
		mav.addObject("script", script);
		mav.addObject("reqVo", reqVo);
		mav.setViewName("/include/cm_message");
		
		return mav;
	}
	
	@Resource(name="messageSource")
    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }
	
	public String getMessageSource(String str) {
		String message = "";
		
		try {
			message = this.messageSource.getMessage(
					str, 
					null, 
					new java.util.Locale(String.valueOf(CmFunction.getCurrentRequest().getSession().getAttribute("s_language")), ""));
		} catch (Exception e) {
			message = "::: " + str + " :::";
		}
		return message;
	}
	
 	/**크로스 사이트 요청 위조 체크
 	 * @param referer
 	 */
 	public boolean isAllowedUrls(String referer) {
 		
 		HashSet<String> allowedUrls = new HashSet<String>();
 		allowedUrls.add("www.miseenscene.com");
 		allowedUrls.add("www.likeithair.com");
 		allowedUrls.add("www.likeithair.co.kr");
 		allowedUrls.add("58.236.189.24");
 		allowedUrls.add("dev.likeithair.com");
 		allowedUrls.add("127.0.0.1");
 		allowedUrls.add("test.miseenscene.com");

 		if(referer != null && referer.length() > 0){
 			
 			Pattern urlPattern  = Pattern.compile("^(https?):\\/\\/([^:\\/\\s]+)(:([^\\/]*))?((\\/[^\\s/\\/]+)*)?\\/?([^#\\s\\?]*)(\\?([^#\\s]*))?(#(\\w*))?$");
 			Matcher mc = urlPattern.matcher(referer);

 			if(mc.matches()){           

 				if(mc.groupCount() >= 2){

 					if(allowedUrls.contains(mc.group(2)) == false) {
 				 		return false;
 					}
 				}
 			}
 		}
 		return true;
 	}
 	
 	public String isDeviceNm (HttpServletRequest request ) {
		String retViewStr = "";
		
		Device device = (Device)request.getAttribute("currentDevice");
		
		if (device == null){
			
		}else{
			HttpSession session = request.getSession();
			String mode = (String)session.getAttribute("PCmode");
			
			if (mode == null) mode = "";
			if (mode.equals("true")){
				retViewStr = "";
			}else{
				if (device.isNormal()) {
					retViewStr = "";
			    } else if (device.isTablet()) {
			    	retViewStr = "";
			    } else if (device.isMobile()) {
			    	retViewStr = "/mobile";
			    }
			}
		}
	    return retViewStr;
	}
 	
 	public String xmlAjaxReplaceString(String str ) {
 		try {
 			str = URLDecoder.decode(str,"utf-8");
 		} catch ( Exception ex ) {
 			
 		}
		str = str.replaceAll("\\[\\(am\\)\\]","&");
		str = str.replaceAll("\\[\\(eq\\)\\]","=");
		str = str.replaceAll("\\[\\(qu\\)\\]","?");
		str = str.replaceAll("\\[\\(ps\\)\\]","%");
		str = str.replaceAll("\\[\\(Sh\\)\\]","#");
		str = str.replaceAll("\\[\\(pl\\)\\]","+");
		
		
	    return str;
	}
 	
}
