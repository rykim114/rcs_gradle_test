package apps.homepage.admin.controller.member;

import java.util.HashMap;
import java.util.Map;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import ai.org.apache.commons.logging.Log;
import ai.org.apache.commons.logging.LogFactory;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;
import apps.framework.annotation.SslOn;
import apps.framework.controller.CmController;
import apps.framework.object.CmMap;
import apps.framework.utils.sms.CmSms;
import apps.homepage.admin.service.member.AdminAuthService;
import apps.homepage.common.service.custom.log.LogService;

@Controller
@SuppressWarnings("rawtypes")
@RequestMapping("/admin")
public class AdminAuthController extends CmController {
	
	/** The Constant logger. */
	protected final Log logger = LogFactory.getLog(this.getClass());

	@Autowired
	AdminAuthService adminAuthService;

	@Autowired
	CmSms cmSms;
	
	@Autowired
	private LogService logService;
	
	@Resource
	MappingJackson2JsonView ajaxMainView;
	
	@Resource(name = "cacheManager")
	EhCacheCacheManager cacheManager;
	
	
	// 본인인증 문자전송
	@SslOn
	@RequestMapping(value="/auth/send", method=RequestMethod.POST)
	public ModelAndView updateAuthSend(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response,
		@RequestBody Map<String, Object> param) {
		
		Map<String, Object> model = new HashMap<>();
		Map<String, Object> mod = new HashMap<>();
		
		reqVo.putAll(param);

		String[] requiredKeyArr = {"cust_name", "recv_num"};

		for (String key : requiredKeyArr) {
			if (StringUtils.isBlank(reqVo.getString(key))) {
				model.put("code", HttpStatus.BAD_REQUEST.value());
				model.put("message", "필수 파라메터 누락: " + key);
				return new ModelAndView(this.ajaxMainView, model);
			}
		}

		
		try {
			adminAuthService.updateAuthSend(reqVo, model);
			
			if (HttpStatus.OK.value() == (Integer) model.get("code")) {
				CmMap smsData = new CmMap();
				smsData.put("cust_name", reqVo.get("cust_name"));
				smsData.put("otp_num", reqVo.get("otp_num"));
				
				String sendNm = "070-8811-8881";
				String receNm = reqVo.getString("recv_num");
				String title = "";
				
				// 본인인증 form_id "1"
				// sendGbn 1
				cmSms.sendChg(reqVo, sendNm, receNm, title, smsData, "1", 1);
			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
			model.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
			model.put("message", e.getLocalizedMessage());
			
			String error_content = e.getLocalizedMessage();
			if(error_content == null) {
				error_content = e.getClass().toString();
			}
			mod.put("process_name", "updateAuthSend");
			mod.put("error_content", error_content);
			logService.insertLogMsg(mod);
		}

		return new ModelAndView(this.ajaxMainView, model);
	}

	// OTP 확인
	@SslOn
	@RequestMapping(value="/auth/check", method=RequestMethod.POST)
	public ModelAndView updateAuthCheck(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response,
		@RequestBody Map<String, Object> param) {

		Map<String, Object> model = new HashMap<>();
		Map<String, Object> mod = new HashMap<>();
		
		reqVo.putAll(param);

		try {
			logger.info("========================================");
			logger.info("========================================");
			logger.info("========================================");
			logger.info("controler");
			logger.info("========================================");
			logger.info("========================================");
			logger.info("========================================");
			adminAuthService.updateAuthCheck(reqVo, model);

			if (HttpStatus.OK.value() == (Integer) model.get("code")) {
				// 인증된 번호만 이후 회원가입 가능
				request.getSession().setAttribute("auth_mobile_no", reqVo.get("recv_num"));
				request.getSession().setAttribute("company_code", reqVo.get("company_code"));
				cacheManager.getCache("StaticCache").put("otpNum",reqVo.get("otp_num"));
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
			model.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
			model.put("message", e.getLocalizedMessage());
			
			String error_content = e.getLocalizedMessage();
			if(error_content == null) {
				error_content = e.getClass().toString();
			}
			mod.put("process_name", "updateAuthCheck");
			mod.put("error_content", error_content);
			
			logService.insertLogMsg(mod);
			
		}

		return new ModelAndView(this.ajaxMainView, model);
	}
	

	@SslOn
	@RequestMapping(value="/agree/privacy", method=RequestMethod.GET)
	public String agreePrivacy(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		return "front/pc/signon/elesign_agree_privacy";
	}
	
	// 인증된 휴대폰번호로 회원가입+로그인
	@SslOn
	@RequestMapping(value="/auth/start", method=RequestMethod.POST)
	public ModelAndView updateAuthStart(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response,
		@RequestBody Map<String, Object> param) {

		Map<String, Object> model = new HashMap<>();
		Map<String, Object> mod = new HashMap<>();
		
		reqVo.putAll(param);

		String[] requiredKeyArr = {"cust_name", "recv_num"};

		for (String key : requiredKeyArr) {
			if (StringUtils.isBlank(reqVo.getString(key))) {
				model.put("code", HttpStatus.BAD_REQUEST.value());
				model.put("message", "필수 파라메터 누락: " + key);
				return new ModelAndView(this.ajaxMainView, model);
			}
		}
		
		// 인증된 번호 없거나 불일치 시 진행불가
		HttpSession session = request.getSession();
		String authMobileNo = (String) session.getAttribute("auth_mobile_no");
		String recvNum = reqVo.getString("recv_num");
		
		// 데모 계정은 인증 제외하고 진행
		String[] demoAccountArr = {"010-4345-1371"};
		
		if (! StringUtils.equalsAny(recvNum, demoAccountArr)) {
			if (! StringUtils.equals(authMobileNo, recvNum)) {
				model.put("code", HttpStatus.BAD_REQUEST.value());
				model.put("message", "인증되지 않은 전화번호");
				return new ModelAndView(this.ajaxMainView, model);
			}
		}

		
		String companyCode = StringUtils.defaultIfBlank((String) session.getAttribute("company_code"), "100");
		
		reqVo.put("companyCode", companyCode);
		reqVo.put("company_code", companyCode);
		
		

//		reqVo.put("userId", reqVo.get("user_id"));

		try {
			adminAuthService.updateAuthStart(reqVo, model);
			
			if (HttpStatus.OK.value() == (Integer) model.get("code")) {
				// 스프링 시큐리티 로그인을 위해서 인증번호 세션에 남겨둠
				// 캐시에서 꺼내서 쓰도록 수정
//				session.removeAttribute("auth_mobile_no");
				cacheManager.getCache("StaticCache").put("loginId|" + model.get("userId"), "true");
				
				// XXX: 회원정보를 가지고 스프링 시큐리티 로그인 따로 필요함
				/*
					$.ajax({
					    url: '/admin/member/adminActionLogin.do',
					    method: 'POST',
					    data: {
					        id: 'sunjong.park@zeons.co.kr',
					        password: '01043451371'
					    }
					})
				*/
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
			model.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
			model.put("message", e.getLocalizedMessage());			
			
			String error_content = e.getLocalizedMessage();
			if(error_content == null) {
				error_content = e.getClass().toString();
			}
			mod.put("process_name", "updateAuthStart");
			mod.put("company_code", session.getAttribute("companyCode"));
			mod.put("error_content", error_content);
			
			logService.insertLogMsg(mod);
		}
		
		return new ModelAndView(this.ajaxMainView, model);
	}
	
}
