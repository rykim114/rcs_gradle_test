package apps.framework.interceptor;

import apps.framework.annotation.CheckSSL;
import apps.framework.annotation.SslOn;
import apps.framework.annotation.SslPass;
import apps.framework.utils.CmFunction;
import apps.framework.utils.CmPathInfo;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.ModelAndViewDefiningException;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

public class CmInterceptor extends HandlerInterceptorAdapter {
	
	private final Log logger = LogFactory.getLog(this.getClass());

	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		String	uri	= request.getRequestURI();
		String	url	= request.getRequestURL().toString();
		
		SslPass sslPass = null;
		CheckSSL checkSSL = null;
		
		boolean isHandlerMethod = handler instanceof HandlerMethod;
		
		try {
			if (isHandlerMethod) {
				sslPass = ((HandlerMethod) handler).getMethodAnnotation(SslPass.class);
				checkSSL = ((HandlerMethod) handler).getMethodAnnotation(CheckSSL.class);
			}
		} catch (Exception e) {
			logger.error(e);//e.printStackTrace();
		}
		
		if (null == uri) {
			return super.preHandle(request, response, handler);
		}
		
		if (uri.equals("/conncheck.do")) {
			return super.preHandle(request, response, handler);
		}
		
		if (logger.isInfoEnabled()) {
			logger.info("##### url =="+url);
		}
		
		// 공사중 여부 체크
		if (this.isUnderConstruction(request)) {
			ModelAndView mav = new ModelAndView();
			mav.setViewName("redirect:" + CmPathInfo.getWEB_URL() + "html/renewal.html");
			throw new ModelAndViewDefiningException(mav);
		}
		
/*		if (url.toLowerCase().indexOf("http://www..remark.com") > -1 || url.toLowerCase().indexOf("http://remark.com") > -1 
				|| url.toLowerCase().indexOf("http://local.remark.com") > -1 || url.toLowerCase().indexOf("http://dev.remark.com/") > -1 
				|| url.toLowerCase().indexOf("http://127.0.0.1") > -1) {
			
			CmMap reqVo = new CmMap();
			CmFunction.setPageUrlAndPars(request, reqVo);
			
			ModelAndView mav = new ModelAndView();
			mav.setViewName("redirect:" + CmPathInfo.getWEB_URL() +"/index.do");
			throw new ModelAndViewDefiningException(mav);
		}*/
		
		this.pageLogPrint("CmInterceptor.Start", url);
		
		try {
	         
			this.setPathInfo(request);
			this.setLanguage(request, response);
			this.setSessionInfo(request);
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		
		try { 
			do {
				if (checkSSL != null) break;
				if (sslPass != null) break;
				if (! isHandlerMethod) break;

				String secureURL = CmPathInfo.getSSL_URL();
				if (logger.isDebugEnabled()) {
					logger.debug(String.format("secureURL[%s]", secureURL));
				}
				if (!CmFunction.useSSL(secureURL)) break;
								
				boolean https = request.isSecure();	
				//SslOn usingSslOn = ((HandlerMethod) handler).getMethodAnnotation(SslOn.class);
				
				SslOn usingSslOn = null;
				try {
					if (isHandlerMethod) {
						usingSslOn = ((HandlerMethod) handler).getMethodAnnotation(SslOn.class);
					}
				} catch (Exception e) {
					logger.error(e); //e.printStackTrace();
				}
				

				if (logger.isDebugEnabled()) {
					logger.debug(String.format("https[%b] usingSslOn[%s]", https, usingSslOn));
				}

		 		if (usingSslOn != null && https) break;
		 		if (usingSslOn == null && ! https) break;
		 		
		 		String refererurl = request.getHeader("referer");
		 		//System.out.println("refererurl====>"+refererurl.substring(0, 5));
		 		if ( refererurl != null && refererurl.length() > 5 ) {
		 			if ( refererurl.substring(0, 5).equals("https") && https ) break;
		 		}
		 		
				String siteURL = CmPathInfo.getSITE_URL();

				String query = request.getQueryString() != null ? "?" + request.getQueryString() : "";
				String urlstr = String.format("%s%s%s", https ? siteURL : secureURL, request.getRequestURI(), query);
				urlstr = urlstr.replaceAll("//", "/");
				urlstr = urlstr.replaceAll("//", "/");
				String script = CmFunction.gotoURL(urlstr, "");
				ModelAndView mav = new ModelAndView("common/core/javascript");
				mav.addObject("excute_script", script);
				throw new ModelAndViewDefiningException(mav);

			} while(false);		
		
			
		} catch (ModelAndViewDefiningException e) {
			throw e;
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
				

		return super.preHandle(request, response, handler);
	}
	
	/**
	 * postHandle
	 */
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView mav) throws Exception {
		try {
			String	url	= request.getRequestURI();
			
			if (url.equals("/conncheck.do")) {
				return;
			}
			
			if (null != mav) {
				
				Map<String, Object>	mavMap	= mav.getModel();

				String	pageTitle		= CmFunction.getStrVal(mavMap.get("PAGE_TITLE"));
				String	pageKeyword		= CmFunction.getStrVal(mavMap.get("PAGE_KEYWORD"));
				String	pageDescription	= CmFunction.getStrVal(mavMap.get("PAGE_DESCRIPTION"));

/*				if (CmFunction.isEmpty(pageTitle)) {
					mav.addObject("PAGE_TITLE", commonService.getMessageSource("ITHAIR_SEO_KEYWORD_T001"));
				}

				if (CmFunction.isEmpty(pageKeyword)) {
					mav.addObject("PAGE_KEYWORD", commonService.getMessageSource("ITHAIR_SEO_KEYWORD_T001"));
				}

				if (CmFunction.isEmpty(pageDescription)) {
					mav.addObject("PAGE_DESCRIPTION", commonService.getMessageSource("ITHAIR_SEO_KEYWORD_T001"));
				}
				*/
				//this.pageLogPrint("View", mav.getViewName());
			}

			this.pageLogPrint("CmInterceptor.End", url);
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
	}

	/**
	 * 
	 * @param flag
	 * @param url
	 */
	private void pageLogPrint(String flag, String url) {
		//if (logger.isDebugEnabled()) {
		if (logger.isInfoEnabled()) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS");
			logger.info("#### [" + flag + "]" + sdf.format(new Date()) + " : " + url + " ####");
		}
	}

	/**
	 * 
	 * @param request
	 * @param response
	 */
	private void setLanguage(HttpServletRequest request, HttpServletResponse response) {
		/*String	uri		= request.getRequestURI();
		String	lang	= "ko";
		
		if (-1 < uri.indexOf("/en/")) {
			lang	= "en";
		}*/

		/*Locale	locale	= new Locale(lang);
		localeResolver.setLocale(request, response, locale);*/
		
		
	}

	/**
	 * 
	 * @param request
	 */
	private void setPathInfo(HttpServletRequest request) {
		String uri = request.getRequestURI();
		String url = request.getRequestURL().toString();

		String pageId = "";
		
		if (uri.indexOf(".") > -1) {
			pageId = uri.substring(uri.indexOf("/") + 1, uri.lastIndexOf("."));			
		}else{
			pageId = uri.substring(uri.indexOf("/") + 1);			
		}

		/*String tagPath = commonService.getMessageSource("page_tag_path." + pageId.replaceAll("/", "."));*/

		request.setAttribute("PAGE_URL",		url);
		request.setAttribute("PAGE_ID",			pageId);
		/*request.setAttribute("PAGE_TAG_PATH",	tagPath);*/

		request.setAttribute("SERVER_TYPE", 	CmPathInfo.getSERVER_TYPE());
		request.setAttribute("WEB_ROOT", 		CmPathInfo.getWEB_ROOT());
		request.setAttribute("IMG_UPLOAD_URL",	CmPathInfo.getIMG_UPLOAD_URL());
		request.setAttribute("WEB_URL",			CmPathInfo.getWEB_URL());
		
		String sslurl = CmPathInfo.getSSL_URL();
		if (sslurl.substring(sslurl.length()-1).equals("/")) sslurl = sslurl.substring(0,sslurl.length()-1);
		
		request.setAttribute("SSL_URL",			sslurl);
		request.setAttribute("SITE_URL",		CmPathInfo.getSITE_URL());
		request.setAttribute("UPLOAD_PATH",		CmPathInfo.getUPLOAD_PATH());
		request.setAttribute("ROW_SEPARATE",		CmPathInfo.getROW_SEPARATE());
		request.setAttribute("COL_SEPARATE",		CmPathInfo.getCOL_SEPARATE());
		
		request.setAttribute("TASK_SCHEDULER_URL", 	CmPathInfo.getTASK_SCHEDULER_URL());
		request.setAttribute("TASK_SCHEDULER_SERVER", 	CmPathInfo.getTASK_SCHEDULER_SERVER());
		
		
		if (url != null && url.toLowerCase().indexOf("https://") > -1) {
			request.setAttribute("FLAG_SSL", 					"Y");
			request.setAttribute("COMMON_IMG_URL", 				this.getChangeSSL(CmPathInfo.getCOMMON_IMG_URL()));
			request.setAttribute("COMMON_CSS_URL", 				this.getChangeSSL(CmPathInfo.getCOMMON_CSS_URL()));
			request.setAttribute("COMMON_JS_URL", 				this.getChangeSSL(CmPathInfo.getCOMMON_JS_URL()));			
		}
		else {
			request.setAttribute("FLAG_SSL", 					"N");
			request.setAttribute("COMMON_IMG_URL", 				CmPathInfo.getCOMMON_IMG_URL());
			request.setAttribute("COMMON_CSS_URL", 				CmPathInfo.getCOMMON_CSS_URL());
			request.setAttribute("COMMON_JS_URL", 				CmPathInfo.getCOMMON_JS_URL());			
		}
	}
	
	private String getChangeSSL(String str) {
		
		String rtn = "";
		
		if (str == null || str.equals("")) {
			return str;
		}
		
		if (str.indexOf(CmPathInfo.getCDN_URL()) > -1) {
			rtn = str.replaceAll(CmPathInfo.getCDN_URL(), CmPathInfo.getSSL_URL());
		}
		else {
			rtn = str.replaceAll("http://", "https://");
		}
		return rtn;
	}
	
	/**
	 * 공통 session 정보
	 * @param request
	 */
	private void setSessionInfo (HttpServletRequest request) {
		HttpSession	session	= request.getSession();
		
/*		String sitecd = CmFunction.getStrVal(session.getAttribute("s_sitecd"));
		
		if (sitecd.equals("")) {
			session.setAttribute("s_sitecd", CmPathInfo.getSERVER_SITECD());
		}*/
		
		request.setAttribute("admin_userId", session.getAttribute("admin_userId"));
		request.setAttribute("admin_userNm", session.getAttribute("admin_userNm"));
		
		request.setAttribute("companyCode", session.getAttribute("admin_companyCode"));
		request.setAttribute("companyName", session.getAttribute("admin_companyName"));
		
		request.setAttribute("admin_deptcode", session.getAttribute("admin_deptcode"));
		request.setAttribute("admin_deptname", session.getAttribute("admin_deptname"));
		request.setAttribute("admin_usertag", session.getAttribute("admin_usertag"));
		request.setAttribute("admin_useyesno", session.getAttribute("admin_useyesno"));
		request.setAttribute("admin_userdesc", session.getAttribute("admin_userdesc"));
		request.setAttribute("admin_stdcode", session.getAttribute("admin_stdcode"));
		request.setAttribute("admin_stdyesno", session.getAttribute("admin_stdyesno"));
		request.setAttribute("admin_mobileno", session.getAttribute("admin_mobileno"));
		request.setAttribute("admin_email", session.getAttribute("admin_email"));
		request.setAttribute("admin_loginlockyesno", session.getAttribute("admin_loginlockyesno"));
		request.setAttribute("admin_vendorcode", session.getAttribute("admin_vendorcode"));
		request.setAttribute("admin_vendorname", session.getAttribute("admin_vendorname"));
				
		request.setAttribute("admin_mobile1", session.getAttribute("admin_mobile1"));
		request.setAttribute("admin_mobile2", session.getAttribute("admin_mobile2"));
		request.setAttribute("admin_mobile3", session.getAttribute("admin_mobile3"));
		
		request.setAttribute("admin_groupcode", session.getAttribute("admin_groupcode"));
		
		
		request.setAttribute("s_userId", session.getAttribute("s_userId"));
		request.setAttribute("s_userNm", session.getAttribute("s_userNm"));
		
		request.setAttribute("userId", session.getAttribute("s_userId"));
		request.setAttribute("userNm", session.getAttribute("s_userNm"));
		
		request.setAttribute("companyCode", session.getAttribute("s_companyCode"));
		request.setAttribute("companyName", session.getAttribute("s_companyName"));
		
		request.setAttribute("s_deptcode", session.getAttribute("s_deptcode"));
		request.setAttribute("s_deptname", session.getAttribute("s_deptname"));
		request.setAttribute("s_usertag", session.getAttribute("s_usertag"));
		request.setAttribute("s_useyesno", session.getAttribute("s_useyesno"));
		request.setAttribute("s_userdesc", session.getAttribute("s_userdesc"));
		request.setAttribute("s_stdcode", session.getAttribute("s_stdcode"));
		request.setAttribute("s_stdyesno", session.getAttribute("s_stdyesno"));
		request.setAttribute("s_mobileno", session.getAttribute("s_mobileno"));
		request.setAttribute("s_email", session.getAttribute("s_email"));
		request.setAttribute("s_loginlockyesno", session.getAttribute("s_loginlockyesno"));
		request.setAttribute("s_vendorcode", session.getAttribute("s_vendorcode"));
		request.setAttribute("s_vendorname", session.getAttribute("s_vendorname"));
		
		request.setAttribute("s_mobile1", session.getAttribute("s_mobile1"));
		request.setAttribute("s_mobile2", session.getAttribute("s_mobile2"));
		request.setAttribute("s_mobile3", session.getAttribute("s_mobile3"));

		request.setAttribute("access_token", session.getAttribute("access_token"));
		
		String userId = CmFunction.getStrVal((String)session.getAttribute("s_userId"));	
		request.setAttribute("contdaycnt", session.getAttribute("contdaycnt"));			

	}
	

	/**
     * 공사중 페이지로 이동
     * @param request
     * @return
     */
    private boolean isUnderConstruction(HttpServletRequest request) {
    	HttpSession session = request.getSession();
    	boolean isPass = "Y".equals(request.getParameter("i_sUnderConstructionPass")) || "Y".equals((String)session.getAttribute("s_under_construction_pass"));
    	
    	if (isPass) {
    		if ("Y".equals(request.getParameter("i_sUnderConstructionPass"))) {
    			session.setAttribute("s_under_construction_pass", "Y");
    		}
    		return false;
    	}
    	
    	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmm");
    	
    	long now = Long.parseLong(sdf.format(new Date()));
    	long st1 = 201601181700l;
    	long st2 = 201601181700l;
    	long end = 201601182200l;
    	
    	// 공사중 시간이 아닐 경우 false
    	if (now < st1  ||  now > end) {
    		return false;
    	}
    	
    	// 모두 차단
    	if (now >= st2) {
    		return true;
    	}
    	
    	String[] arrUrl = {
    		"/main.do"
    		, "/index.do"    		
    	};
    	
    	String	uri	= request.getRequestURI();
    	
    	if (uri.indexOf("/under_construction.html") > -1) {
    		return false;
    	}
    	
    	for (String str : arrUrl) {
    		if (uri.indexOf(str) > -1) {
    			return true;
    		}
    	}
    	
    	return false;
    }
}
