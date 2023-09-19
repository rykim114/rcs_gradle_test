package apps.framework.interceptor;

import apps.framework.utils.CmFunction;
import apps.framework.utils.CmUAgentInfo;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class CmLoginInterceptor extends HandlerInterceptorAdapter {

	public boolean preHandle (HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		String	url	= request.getRequestURI();

		String[]	urlFilter	= {				
				 "ajax.do"
				, "_save.do"
				, "_save_ajax.do"				
			};
		
		int		len			= (null == urlFilter) ? 0 : urlFilter.length;
		boolean	isFilter	= false;

		for (int i = 0; i < len; i++) {
			if (url.indexOf(urlFilter[i]) > -1) {
				isFilter = true;
				break;
			}
		}
		HttpSession	session	= request.getSession();
		
		//모바일 디바이스 체크 시작//
		String userAgent = request.getHeader("User-Agent");
		String httpAccept = request.getHeader("Accept");
		String mobile_flag = "";

		CmUAgentInfo detector = new CmUAgentInfo(userAgent, httpAccept);
		
		if (detector.detectMobileQuick()) {
			mobile_flag=  "Y";
	    }else{
	    	mobile_flag = "N";
	    }
				//모바일 디바이스 체크 끝//
				
		if(mobile_flag.equals("Y")){
			isFilter = true; 
		}
		
		boolean isLogin = this.isLoginCheck(request);
		
		
/*		boolean isSsoSessionKey = isFilter ? false : this.isSsoSessionKey2013(request);
		
		if (!isLogin && isSsoSessionKey) {
			ssoLoginCheckPrc2013(request, response);
		}*/
		
		return super.preHandle(request, response, handler);
	}
	
	/**
	 * 로그인 여부 확인.
	 * 
	 * @param request
	 *            the request
	 * @return login check이면 true
	 * @throws Exception
	 *             the exception
	 */
	private boolean isAdminLoginCheck(HttpServletRequest request) throws Exception {
		HttpSession	session		= request.getSession();
		String		admin_userId	= CmFunction.getStrVal((String)session.getAttribute("admin_userId"));

		return CmFunction.isNotEmpty(admin_userId);
	}
	
	private boolean isLoginCheck(HttpServletRequest request) throws Exception {
		HttpSession	session		= request.getSession();
		String		s_userId	= CmFunction.getStrVal((String)session.getAttribute("s_userId"));
		
		return CmFunction.isNotEmpty(s_userId);
	}
}
