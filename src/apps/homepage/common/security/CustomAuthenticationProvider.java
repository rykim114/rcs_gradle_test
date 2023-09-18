package apps.homepage.common.security;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.captcha.botdetect.web.servlet.Captcha;

import apps.framework.object.CustomUserDetails;
import apps.framework.service.CmService;
import apps.framework.utils.CmPathInfo;
import apps.framework.utils.CmSecretUtil;

//@Service
@SuppressWarnings("rawtypes")
public class CustomAuthenticationProvider extends CmService implements AuthenticationProvider { 
      
	/** The Constant logger. */
	protected final Log	logger = LogFactory.getLog(this.getClass());
	
	
    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
  
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
         
    	try{
	        String user_id = (String)authentication.getPrincipal();    
	        String user_pw = (String)authentication.getCredentials();
	         
	        
	        ServletRequestAttributes sra = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
	        HttpServletRequest request = sra.getRequest();        
	        
	        String captchaCode = request.getParameter("captchaCode");
	        String captchachk = "0";
	        //logger.info("사용자가 입력한 로그인정보입니다. {}"+ user_id + "/" + user_pw);
	
	        if (captchaCode == null || captchaCode.equals("")){
	        	logger.info("보안문자 없음");
	        	captchaCode = "";
//	        	throw new UsernameNotFoundException("captcha null");		
			}else{
				Captcha captcha = Captcha.load(request, "BasicCaptcha");
				boolean isHuman = captcha.validate(captchaCode);
				if (!isHuman){
					logger.info("보안문자 틀림");
					captchaCode = "0";
				}
			}
			

	        
			String account = request.getParameter("account");
	        
			if(!user_id.equals("") && !user_pw.equals("")){
				
				HttpSession session = request.getSession();
				if (session != null ) {
				 	session.invalidate();
				 	request.getSession();
			 	}
				
				user_pw = CmSecretUtil.encodeAES(user_pw, CmPathInfo.getSECRET_AES_KEY());
	            logger.info("정상 로그인입니다.");
	            List<GrantedAuthority> roles = new ArrayList<GrantedAuthority>();
	            String	uri	= request.getRequestURI();
	    		String	url	= request.getRequestURL().toString();
	    		
	    		logger.info("uri==>"+uri);
	    		logger.info("url==>"+url);
	    		
	    		if (uri.toLowerCase().indexOf("/admin/")  > -1 ) {
	    			roles.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
	    		}else {
	    			roles.add(new SimpleGrantedAuthority("ROLE_USER"));
	    		}
	             
	            UsernamePasswordAuthenticationToken result = new UsernamePasswordAuthenticationToken(user_id, user_pw, roles);
	            result.setDetails(new CustomUserDetails(user_id, user_pw, captchaCode, account));//captchachk
	            return result;         
	        }else{
	        	logger.info("사용자 크리덴셜 정보가 틀립니다. 에러가 발생합니다.");
	        	throw new BadCredentialsException("Bad credentials");
	        }
	
    	}catch (Exception ex){
    		logger.error("CustomAuthenticationProvider Exception===>"+(new StringBuilder("CustomAuthenticationProvider : exception ")).append(ex.getMessage()).append("\r\n").append(ex.getStackTrace().toString()).toString());
    		ex.printStackTrace();
    		throw new BadCredentialsException("Bad credentials");
		}
    }
    
    
}
