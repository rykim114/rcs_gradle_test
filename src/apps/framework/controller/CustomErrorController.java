package apps.framework.controller;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.mobile.device.Device;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import apps.framework.object.CmMap;
import apps.framework.utils.CmFunction;

@Controller
public class CustomErrorController implements ErrorController { 
	
	
	@RequestMapping(value = "/error") 
	public ModelAndView handleError(HttpServletRequest request) {
		ModelAndView mav = new ModelAndView("/common/core/error/error");
		
		
		Boolean admin_chk = false;
		
		HttpSession			session	= request.getSession();		
		String userId = CmFunction.getStrVal((String)session.getAttribute("admin_userId"));
		if (!userId.equals("")) {
			admin_chk = true;
		}
		
		
		String ErrCode = "";
		Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE); 
		if(status != null){ 
			int statusCode = Integer.valueOf(status.toString()); 
			if(statusCode == HttpStatus.NOT_FOUND.value()){ 
				ErrCode = "404";
			}else if(statusCode == HttpStatus.FORBIDDEN.value()){ 
				ErrCode = "500";
			}else {
				ErrCode = "Ext";
			}
			if (admin_chk == true) {
				mav.setViewName("/common/core/error/admin_error");
			}else {
				mav.setViewName("/common/core/error/front_error");
			}
		} 
		
		
		String retViewStr = "";
		
		Device device = (Device)request.getAttribute("currentDevice");
		
		if (device == null){
			
		}else{
			
			if (device.isNormal()) {
				mav.addObject("devicemode", "pc");
		    } else if (device.isTablet()) {
		    	mav.addObject("devicemode", "pc");
		    } else if (device.isMobile()) {
		    	mav.addObject("devicemode", "mobile");		    	
		    }
		
		}
		
		
		
		
		return mav;
	} 
	
	@Override 
	public String getErrorPath() { 
		return "/error"; 
	}

}
