package apps.framework.interceptor;

import java.net.URLEncoder;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import apps.framework.object.CmMap;
import apps.framework.utils.CmFunction;
import apps.framework.utils.CmPathInfo;

@SuppressWarnings("rawtypes")
public class RequestValueInterceptor implements MethodInterceptor {
	
	protected final Log logger	= LogFactory.getLog(getClass());
	
	@SuppressWarnings("unchecked")
	public Object invoke(MethodInvocation invocation) throws Throwable {
		
		if (logger.isDebugEnabled()) {
			logger.debug("# RequestValueInterceptor");
		}
		
		if (invocation.getMethod().getReturnType().equals(ModelAndView.class)
			|| invocation.getMethod().getReturnType().equals(String.class)) {
			
			Class[] params		= invocation.getMethod().getParameterTypes();
			
			
			if (params.length >= 2 
					&& params[0].equals(CmMap.class)
					&& params[1].equals(HttpServletRequest.class)) {
				
				HttpServletRequest 		request		= (HttpServletRequest) invocation.getArguments()[1];
				CmMap<Object, Object>	reqMap		= new CmMap<Object, Object>();
				CmMap<Object, Object>	reloadMap	= new CmMap<Object, Object>();
				
				StringBuffer 	param = new StringBuffer();
				String[] 		values;
				String 			url			= "";
				String 			name;
				boolean 		isTemp;
				int				len;
				
				boolean chk_request = true;
				try{
					Enumeration<String>  enumeration	= request.getParameterNames();	
				}catch(Exception ex){
					chk_request = false;
				}
				
				
				if (chk_request){
					
					Enumeration<String>  enumeration	= request.getParameterNames();					
					url			= request.getRequestURI();
										
					while (enumeration.hasMoreElements()) {
						name		= enumeration.nextElement();
						values		= request.getParameterValues(name);
						isTemp		= name.indexOf("_temp") > -1 && name.indexOf("_temp") == name.length() - 5 ? true : false;
						
						if (name.indexOf("[") > -1 && name.indexOf("[]") == name.length() - 2) {
							name = name.substring(0, name.length() - 2);
						}
						
						if (values != null) {
							
							if (logger.isDebugEnabled()) {
								if (!isTemp) {
									for (int i = 0; i < values.length; i++) {
										logger.debug( name + "=" + values[i]);
									}
								}
								else {
									logger.debug( name + "<= \"_temp\" 로 끝나는 parameter 는 CmMap 삽입에서 제외 !!!! ");
								}
							}
							
							// 현재 페이지 요청 정보 가져옴
							if (!isTemp) {
								
								// key 값이 i_arr 로 시작하면 1개라도 무조건 배열로 처리
								reqMap.put(name, name.indexOf("i_arr") == 0 || values.length > 1 ? values : values[0]);
								reloadMap.put(name, values);
								
								if ( !name.equals("i_sReturnUrl") && !name.equals("i_sReturnParam") ) {
			 	    				len				= values.length;
			 	    				
			 	    				if (len > 1) {
			 	    					for (int i = 0; i < len; i++) {
			 	    						param.append(name).append("=").append(URLEncoder.encode(values[i], CmPathInfo.getCHARSET())).append("&");
			 	    					}
			 	    				}
			 	    				else {
			 	    					param.append(name).append("=").append(URLEncoder.encode(values[0], CmPathInfo.getCHARSET())).append("&");
			 	    				}
			 	    			}
							}
							
														
						}
					}
				}
				
				reqMap.put("i_iRecordCnt", reqMap.get("i_iRecordCnt") == null ? 0 : reqMap.get("i_iRecordCnt")); 
				reqMap.put("i_iTotalPageCnt", reqMap.get("i_iTotalPageCnt") == null ? 0 : reqMap.get("i_iTotalPageCnt"));
				reqMap.put("pageUrl", url);
				reqMap.put("pageParam", param.toString());
				
				if (request instanceof MultipartHttpServletRequest) {
					MultipartHttpServletRequest multi	= (MultipartHttpServletRequest) request;
					
					Map files	= multi.getFileMap();
					
					Iterator<Map.Entry<String, MultipartFile>> iterator	= files.entrySet().iterator();
					
					while(iterator.hasNext()) {
						Map.Entry<String, MultipartFile> entry	= iterator.next();
						String key = entry.getKey();
						MultipartFile value = entry.getValue();
						if (!value.isEmpty())
							reqMap.put(key, value);
					}
				}
				
				// [s] view, reg 페이지일 경우 i_sReturnUrl 셋팅
				String urlPatten	= "";
				if(url.indexOf(".") > -1) {
					urlPatten	= url.substring(url.lastIndexOf("_") + 1, url.lastIndexOf("."));
				} else {
					urlPatten	= url.substring(url.lastIndexOf("_") + 1);
				}
				
				if (urlPatten.equals("view") || urlPatten.equals("reg")) {
					
					String i_sReturnUrl		= CmFunction.getStrVal((String) reqMap.get("i_sReturnUrl"));
					String ext				= "";
					
					if(url.indexOf(".") > -1) {
						ext				= url.substring(url.lastIndexOf("."), url.length());
					} else {
						ext				= "";
					}
					
					if (i_sReturnUrl.equals("")) {
						i_sReturnUrl			= url.substring(0, url.lastIndexOf("_")) + "_list" + ext;
						reqMap.put("i_sReturnUrl", i_sReturnUrl);
						reqMap.put("i_sReturnParam", null);
						
						if (logger.isDebugEnabled())
							logger.debug("# auto i_sReturnUrl : " + i_sReturnUrl);
					}
				}
				// [e] view, reg 페이지일 경우 i_sReturnUrl 셋팅
				
				if (chk_request){
					// 페이지 리로드를 위한 셋팅
					request.setAttribute("requestUri", url);
					request.setAttribute("reloadInfoMap", reloadMap);
					
					// session 
					CmFunction.setSessionValue(request, reqMap);
				}
				
				
				// XXX: ip 공통설정: 운영서버 설정에 따라서 X-Forwarded-For 헤더 추가할 필요 있음
				reqMap.put("ipAddr", request.getRemoteAddr());
				
				invocation.getArguments()[0]	= reqMap;
			}
		}
		
		return invocation.proceed();
	}
	
}
