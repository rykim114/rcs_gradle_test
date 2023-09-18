package apps.framework.utils.listener;


import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import org.springframework.web.context.support.WebApplicationContextUtils;

import apps.framework.dao.CmDao;
import apps.framework.object.CmMap;
import apps.framework.utils.CmFunction;
import apps.framework.utils.CmPathInfo;

@Component
public class ezREMSHttpSessionListener implements HttpSessionListener 
{
	
	protected final Log logger	= LogFactory.getLog(getClass());
	
	/*public static ezREMSHttpSessionListener sessionManager = null;
	public static Hashtable loginSessionMonitor;
	public static int maxSessionValidCount;*/

	public static Map<String, Map<String, HttpSession>> loginSessionMonitor = new ConcurrentHashMap<>();

	public static int maxSessionValidCount = CmPathInfo.getSESSION_LOGIN_CONCURRENT_MAX_CNT();

	@Autowired	
	private CmDao cmDao;
	
	/*public ezREMSHttpSessionListener() {	
		if (loginSessionMonitor == null) loginSessionMonitor = new Hashtable();
		sessionManager = this;		 
		maxSessionValidCount = 5000;		  
	}
	
	public static synchronized ezREMSHttpSessionListener getInstance() {
		if (sessionManager == null)
			sessionManager = new ezREMSHttpSessionListener();
			return sessionManager;
	}*/
	  
	/** 현재 활성화 된 session의 수를 반환한다. */
	public int getActiveLoginSessionCount() {
		int size = 0;
		
		for (Map<String, HttpSession> user : loginSessionMonitor.values()) {
			size += user.size();
		}
		
		return size;
	}
	
	/*public void setChkSession(HttpSession session) {
		boolean chk = false;
		Enumeration eNum = loginSessionMonitor.elements();
		
		while (eNum.hasMoreElements()) {
			HttpSession sh_session = null;			
			try {
				sh_session = (HttpSession) eNum.nextElement();
			} catch (Exception e) {
				continue;
			}
			if (sh_session != null) {
				if (session.getId().equals(sh_session.getId())) {
					chk = true;
					break;
				}
				
			}
		}
		
		if (chk == false){
			synchronized (loginSessionMonitor) {
				loginSessionMonitor.put(session.getId(), session);		    
				//logger.debug(" # 접속자 (사이트 접속자수) : " + getActiveSessionCount() + " 명#");
				logger.debug(" # 접속자 (로그인 사용자수) : " + getActiveLoginSessionCount() + " 명#");
			}
		}
		
	}*/
	  
	 /** 로그인한 Session Put */
	public void setLoginSession(HttpSession session) {
		String userId = (String) session.getAttribute("admin_userId");
		
		if (StringUtils.isBlank(userId)) {
			return;
		}
		
		Map<String, HttpSession> loginMap = loginSessionMonitor.get(userId);
		
		if (null == loginMap) {
			loginMap = new ConcurrentHashMap<>();
			loginSessionMonitor.put(userId, loginMap);
		}
		
		loginMap.put(session.getId(), session);
		
		logger.debug(" # 접속자 (로그인 사용자수) : " + getActiveLoginSessionCount() + " 명, 계정 당 동시접속 최대 : " + maxSessionValidCount + " 명 #");
	}
	  
	 /** 로그아웃한 Session Remove */
	public void setLogoutSession(HttpSession session) {
		String userId = (String) session.getAttribute("admin_userId");
		
		if (StringUtils.isBlank(userId)) {
			return;
		}

		Map<String, HttpSession> loginMap = loginSessionMonitor.get(userId);
		
		if (null == loginMap) {
			return;
		}
		
		loginMap.remove(session.getId());
		
		if (1 > loginMap.size()) {
			loginSessionMonitor.remove(userId);
		}
	}

	 
	public int getMaxSessionValidCount() {
		return maxSessionValidCount;
	}
	
	 /**
	  * 현재 등록된 session중 현재 접속된 사용자 정보와 중복 여부 확인만
	  * 이전 세션의 소멸은 confirm 시 별도 진행
	  */
	public int checkDuplicationLogin(String sessionId, String userId) {
		int ret = 0;
		logger.debug("session count : " + getActiveLoginSessionCount());
		
		Map<String, HttpSession> loginMap = loginSessionMonitor.get(userId);
		
		if (null == loginMap) {
			return ret;
		}
		
		ret = loginMap.size();
		
		// 내 로그인도 카운트는 추가함
//		if (loginMap.containsKey(sessionId)) {
//			ret--;
//		}

		return ret;
	}

	/**
	 * 이전 세션 소멸
	 * 현재는 가장 오래된 로그인세션 부터 없애는데, 정책 수정될 수도 있음
	 * */
	public int invalidateDuplicationLogin(String userId, HttpSession session) {
		int cntInvalidate = 0;
		
		if (StringUtils.isBlank(userId)) {
			return cntInvalidate;
		}

		Map<String, HttpSession> loginMap = loginSessionMonitor.get(userId);
		
		if (null == loginMap || 1 > (cntInvalidate = loginMap.size() - maxSessionValidCount)) {
			return cntInvalidate;
		}

		List<HttpSession> sessionArr = new ArrayList<>(loginMap.values());
		
		// 소멸 요청한 세션은 제외
		sessionArr.remove(session);
		
		Collections.sort(sessionArr, new Comparator<HttpSession>() {

			@Override
			public int compare(HttpSession o1, HttpSession o2) {
				return (int) (o1.getCreationTime() - o2.getCreationTime());
			}
		});
		
		List<HttpSession> invalidSessionArr = sessionArr.subList(0, cntInvalidate);
		
		for (HttpSession ss : invalidSessionArr) {
			ss.invalidate();
		}
		
		
		return cntInvalidate;
	}
	
	@Override
	public void sessionCreated(HttpSessionEvent event)
	{
		HttpSession session = event.getSession();
		
		String admin_userId = CmFunction.getStrVal((String)session.getAttribute("admin_userId"));		
		String userId = CmFunction.getStrVal((String)session.getAttribute("s_userId"));		
		logger.info("sessionCreated ==>"+session.getId()+"  /  "+admin_userId+"  /  "+userId);		
	}
	
	@SuppressWarnings("rawtypes")
	@Override
	public void sessionDestroyed(HttpSessionEvent event) 
	{
		HttpSession session = event.getSession();
		String admin_userId = CmFunction.getStrVal((String)session.getAttribute("admin_userId"));
		String userId = CmFunction.getStrVal((String)session.getAttribute("s_userId"));
    	
    	if ( (admin_userId != null && !admin_userId.equals("")) ||  (userId != null && !userId.equals("")) ){	    		
			if (cmDao == null){
				ApplicationContext context = WebApplicationContextUtils.getWebApplicationContext( session.getServletContext());
						
				if (context.containsBean("cmDao")) {
					cmDao = (CmDao)context.getBean("cmDao");				
				}
			}
			
			if (cmDao != null){
				CmMap reqVo = new CmMap();
				
				try{
					try{
						logger.info("sessionDestroyed ==>"+admin_userId);
						if (admin_userId != null && !admin_userId.equals("")){
							reqVo.put("userId", admin_userId);
						}else {
							reqVo.put("userId", userId);
						}
				       	cmDao.update("AdminLoginDao.updateLogout", reqVo);
				       	
				       	setLogoutSession(session);
					}catch(Exception e){
			            System.out.println(e.toString());
			    	}
			    	
			    	String session_id = session.getId();
		    		reqVo.put("session_id", session_id);		
//		    		System.out.println(session_id);
		    		cmDao.update("AdminLoginDao.updateUserLoginHistorySessionKey", reqVo);

		    		cmDao.update("AdminMainDao.updateMenuTime", reqVo);

				}catch(Exception e){
		            System.out.println(e.toString());
		    	}				
			}
    	}
    	
    	/*synchronized (loginSessionMonitor) {
    		loginSessionMonitor.remove(session.getId());    		        		
    		logger.debug(" # 접속자 (로그인 사용자수) : " + getActiveLoginSessionCount() + " 명#");		  
    	}*/
		
		
	}
	
	
}