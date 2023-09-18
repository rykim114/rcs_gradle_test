package apps.framework.utils.httpssession;

import java.util.Date;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import apps.framework.object.CmMap;
import apps.framework.service.CmService;
import apps.framework.utils.CmFunction;


@SuppressWarnings("rawtypes")
public class HttpSessionServiceImpl extends CmService implements HttpSessionListener{
	
	public void sessionCreated(HttpSessionEvent se) {
		HttpSession	session	= se.getSession();
		
		if (logger.isDebugEnabled()) {
			logger.debug("[sessionCreated] " + session.getId());
		}
	}

	public void sessionDestroyed(HttpSessionEvent se) {
		HttpSession	session	= se.getSession();
		
		if (logger.isDebugEnabled()) {
			logger.debug("[sessionDestroyed] " + session.getId()); 
		}
		
		try {
			
			CmMap logVo = new CmMap();
			
			logVo.put("i_sSessionId", session.getId());
			logVo.put("i_sLogoutTime", CmFunction.getDateToString(new Date(session.getLastAccessedTime()), "yyyyMMddHHmmssSSS"));
			
			//this.cmDao.update("AuthUserDao.updateUserLoginLog", logVo);
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
	}
}


