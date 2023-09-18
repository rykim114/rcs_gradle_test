package apps.homepage.common.controller.custom.dashboard;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import apps.framework.annotation.SslOn;
import apps.framework.controller.CmController;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.utils.CmFunction;
import apps.framework.utils.CmPathInfo;
import apps.framework.utils.CmSecretUtil;
import apps.homepage.common.service.custom.dashboard.DashBoardService;
import apps.homepage.common.service.custom.log.LogService;
import apps.homepage.common.service.custom.sign.SignService;

@Controller
@SuppressWarnings({"rawtypes", "unchecked"})
@RequestMapping("/admin")
public class DashBoardController extends CmController {
	
	@Resource
	MappingJackson2JsonView ajaxMainView;
	
	@Autowired
	DashBoardService dashBoardService;	
	
	@Autowired
	private LogService logService;
	
	/** The Constant logger. */
	protected final Log	logger = LogFactory.getLog(this.getClass());

	// 대시보드조회
	@SslOn
	@RequestMapping(value="/dashboard/top", method={RequestMethod.GET, RequestMethod.POST})
	public ModelAndView selectSignMyList(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> mod = new HashMap<>();
		Map<String, Object> model = new HashMap<>();
		HttpSession			session	= request.getSession();

		// XXX: 로그인 권한 확인 추가 예정
		if (! isCmAdminLoginCheck()) {
			model.put("message", "본인 인증이 필요합니다");
			return new ModelAndView(this.ajaxMainView, model);
		}
		
		String userId = CmFunction.getStrVal((String)session.getAttribute("admin_userId"));

		try {
			reqVo.put("user_id", userId);
			reqVo.put("user_id", "younjeong.eo@zeons.co.kr");
			dashBoardService.selectDashBoardTop(reqVo, model);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
			mod.put("process_name", "selectDashboard");
			mod.put("error_content", e.getClass().toString());
			
			logService.insertLogMsg(mod);
		}
		
		return new ModelAndView(this.ajaxMainView, model);
	}

}
