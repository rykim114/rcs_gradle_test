package apps.homepage.common.security;

import java.io.IOException;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.stereotype.Service;

import apps.framework.dao.CmDao;
import apps.framework.object.CmMap;


@Service
public class CustomLogoutSuccessHandler extends  SimpleUrlLogoutSuccessHandler implements LogoutSuccessHandler {
 
	@Autowired	
	private CmDao cmDao;
	
	
	
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
  
    	    	
    	String userId 		= "";
    	
    	try{    	
    		userId 		= (String)authentication.getPrincipal();
    	}catch (Exception ex)
		{
		
		}
    	
    	CmMap reqVo = new CmMap();
    	if (!userId.equals("")){
	    	
	    	reqVo.put("userId", userId);
	    	//logInOutDao.updateLogout(reqVo);
	    	//cmDao.update("LogInOutDao.updateLogout", reqVo);
    	}
    	
		HttpSession session = request.getSession();
		/*String session_id = session.getId();
		reqVo.put("session_id", session_id);		
		cmDao.update("LogInOutDao.updateUserLoginHistory", reqVo);
		*/
		if (session != null ) {
		 	session.invalidate();
		 	request.getSession();
	 	}
		
		response.setStatus(HttpServletResponse.SC_OK);
		response.sendRedirect("/admin/member/aLogin.do");
	        
        super.onLogoutSuccess(request, response, authentication);
    }
    
}
