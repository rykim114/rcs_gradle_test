package apps.homepage.common.controller.core;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import apps.framework.annotation.SslPass;
import apps.framework.controller.CmController;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.homepage.common.dao.core.CheckDao;

@Controller
@SuppressWarnings("rawtypes")
@RequestMapping("/common")
public class ZipCodeController extends CmController{

	/** The Constant logger. */
	protected final Log	logger = LogFactory.getLog(this.getClass());

	@Autowired
	private CheckDao checkDao;

	@SslPass
	@RequestMapping(value={"/zipcode"})
	public ModelAndView conncheck(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		//ModelAndView mav = new ModelAndView(this.isDeviceCheck(request)+"/main/main");
		ModelAndView mav = new ModelAndView("/common/core/zipcode");
		CmResMap rvo     = null;

		
		
		
		
		
		

		return mav;
	}
}
