package apps.homepage.common.controller.custom.sign;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskExecutor;
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
import apps.framework.object.CmResMap;
import apps.framework.service.MailService;
import apps.framework.utils.CmPathInfo;
import apps.framework.utils.CmSecretUtil;
import apps.homepage.common.dao.custom.sign.SignDao;
import apps.homepage.common.service.custom.log.LogService;
import apps.homepage.common.service.custom.sign.SignService;

@Controller
@SuppressWarnings({"rawtypes", "unchecked"})
@RequestMapping("/common")
public class SignController extends CmController {
	
	/** The Constant logger. */
	protected final Log logger = LogFactory.getLog(this.getClass());

	@Autowired
	SignService adminSignService;

	@Resource
	MappingJackson2JsonView ajaxMainView;
	
	@Autowired
	private MailService mailService;	
	
	@Autowired
	private LogService logService;

	@Autowired
	private SignDao adminSignDao;
	
	@Resource(name="taskExecutor")
	TaskExecutor taskExecutor;
	
	
	// 내 목록 조회
	@SslOn
	@RequestMapping(value="/sign/myList", method={RequestMethod.GET, RequestMethod.POST})
	public ModelAndView selectSignMyList(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> model = new HashMap<>();
		Map<String, Object> mod = new HashMap<>();

		// XXX: 로그인 권한 확인 추가 예정
		if (! isCmAdminLoginCheck()) {
			model.put("message", "본인 인증이 필요합니다");
			return new ModelAndView(this.ajaxMainView, model);
		}
		
		// XXX: 로그인 정보 기준으로 user_phon, user_email 세팅 필요
//		logger.debug(reqVo);

		try {
			String mobileNo = reqVo.getString("admin_mobileno");
			if (StringUtils.isNotEmpty(mobileNo)) {
				request.getSession().setAttribute("auth_mobile_no", CmSecretUtil.decodeAES_Base64(mobileNo, CmPathInfo.getSECRET_AES_DB_KEY()));
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
			
			String error_content = e.getLocalizedMessage();
			if(error_content == null) {
				error_content = e.getClass().toString();
			}
			mod.put("process_name", "selectSignMyList1");
			mod.put("error_content", error_content);
			logService.insertLogMsg(mod);			
		}
		
		try {
			adminSignService.selectSignMyList(reqVo, model);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
			model.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
			model.put("message", e.getLocalizedMessage());

//			log 삽입
			String company_code = request.getSession().toString();
			String error_content = e.getLocalizedMessage();
			if(error_content == null) {
				error_content = e.getClass().toString();
			}
			mod.put("process_name", "selectSignMyList2");
			mod.put("company_code", company_code);
			mod.put("error_content", error_content);
			logService.insertLogMsg(mod);
		}

		return new ModelAndView(this.ajaxMainView, model);
	}

	
	@SslOn
	@RequestMapping(value="/sign/report", method=RequestMethod.GET)
	public ModelAndView selectSignReport(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> model = new HashMap<>();
		Map<String, Object> mod = new HashMap<>();
		// 미리 생성하면 모델 인식이 안되네
//		ModelAndView mav = new ModelAndView(this.ajaxMainView, model);

		// XXX: 로그인 권한 확인 추가 예정
		if (! isCmAdminLoginCheck()) {
			model.put("message", "본인 인증이 필요합니다");
			return new ModelAndView(this.ajaxMainView, model);
		}
		
		try {
			// 리포트 데이터 조회: model 에 형식대로 입력돼있음
			adminSignService.selectSignReport(reqVo, model);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("메세지는 " + e.getMessage());
			
			logger.error(e);
			model.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
			model.put("message", e.getLocalizedMessage());
			
//			log 삽입			
			String error_content = e.getLocalizedMessage();
			if(error_content == null) {
				error_content = e.getClass().toString();
			}
			mod.put("process_name", "selectSignReport");
			mod.put("error_content", error_content);
			logService.insertLogMsg(mod);
		}
		
		return new ModelAndView(this.ajaxMainView, model);
	}
	

	// 수신확인 시간 업데이트
	@SslOn
	@RequestMapping(value="/sign/read", method=RequestMethod.POST)
	public ModelAndView updateSignRead(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response,
			@RequestBody Map<String, Object> param) {
		Map<String, Object> model = new HashMap<>();
		Map<String, Object> mod = new HashMap<>();
		
		HttpSession session = request.getSession();
		
		reqVo.putAll(param);
		
		// service_no, recipient_seq 로 구분
		String[] requiredKeyArr = {"service_no", "recipient_seq"};
		
//		logger.debug(reqVo);
//		logger.debug(param);

		for (String key : requiredKeyArr) {
			if (StringUtils.isBlank(reqVo.getString(key))) {
				model.put("code", HttpStatus.BAD_REQUEST.value());
				model.put("message", "필수 파라메터 누락: " + key);
				return new ModelAndView(this.ajaxMainView, model);
			}
		}

		try {
			adminSignService.updateSignRead(reqVo, model);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
			model.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
			model.put("message", e.getLocalizedMessage());

//			log 삽입
			String process_name = "updateSignRead";
			String error_content = e.getLocalizedMessage();
			if(error_content == null) {
				error_content = e.getClass().toString();
			}
			mod.put("process_name", process_name);
			mod.put("error_content", error_content);
			mod.put("receipt_seq", session.getAttribute("receipt_seq"));
			mod.put("signature_seq", session.getAttribute("signature_seq"));
			mod.put("company_code", session.getAttribute("company_code"));
//  		mod.put("service_seq", session.getAttribute("service_seq"));
			logService.insertLogMsg(mod);
		}

		return new ModelAndView(this.ajaxMainView, model);
	}

	
	// 서명 업데이트
	@SslOn
	@RequestMapping(value="/sign/on", method=RequestMethod.POST)
	public ModelAndView updateSignOn(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> model = new HashMap<>();
		Map<String, Object> mod = new HashMap<>();

		HttpSession session = request.getSession();
		
		reqVo.put("receipt_seq", session.getAttribute("receipt_seq"));
		reqVo.put("signature_seq", session.getAttribute("signature_seq"));
		reqVo.put("recipient_seq", session.getAttribute("recipient_seq"));
		reqVo.put("company_code", session.getAttribute("company_code"));
		reqVo.put("signature_detail_seq", session.getAttribute("signature_detail_seq"));

		logger.debug(reqVo);

		// signature_seq, recipient_seq 로 구분
//		String[] requiredKeyArr = {"service_no", "recipient_seq", "sign_img"};
		String[] requiredKeyArr = {"receipt_seq", "recipient_seq", "sign_img"};
//		String[] requiredKeyArr = {};
		
//		logger.debug(reqVo);
//		logger.debug(param);

		for (String key : requiredKeyArr) {
			if (StringUtils.isBlank(reqVo.getString(key))) {
				model.put("code", HttpStatus.BAD_REQUEST.value());
				model.put("message", "필수 파라메터 누락: " + key);
				return new ModelAndView(this.ajaxMainView, model);
			}
		}

		try {
			adminSignService.updateSignOn(request, reqVo, model);
			
			// 이미 서명한 문서인 경우 처음 생성된 원본만 남김
			if (HttpStatus.OK.value() == (Integer) model.get("code")) {
				// 리포트 백그라운드에서 생성 후 메일 전송
				taskExecutor.execute(new Runnable() {

					@Override
					public void run() {
						adminSignService.madeReportUpdate(reqVo, model);
					}
				});
			}
			
//			session.removeAttribute("recipient_seq");
//			session.removeAttribute("signature_seq");

		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
			model.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
			model.put("message", e.getLocalizedMessage());
			
//			log 삽입
			String process_name = "updateSignOn";
			String error_content = e.getLocalizedMessage();
			if(error_content == null) {
				error_content = e.getClass().toString();
			}
			mod.put("process_name", process_name);
			mod.put("error_content", error_content);
			mod.put("receipt_seq", session.getAttribute("receipt_seq"));
			mod.put("signature_seq", session.getAttribute("signature_seq"));
			mod.put("company_code", session.getAttribute("company_code"));
//  		mod.put("service_seq", session.getAttribute("service_seq"));
						
			logService.insertLogMsg(mod);
		}

		return new ModelAndView(this.ajaxMainView, model);
	}
	
	// 메일 테스트
	@SslOn
	@RequestMapping(value="/sign/email_resend", method=RequestMethod.POST)
	public ModelAndView updateSignOn2(@ModelAttribute("reqMap") CmMap reqVo , HttpServletRequest request, HttpServletResponse response ,@RequestBody Map<String, Object> param) {
		logger.info("==== MAIL START ======");
		Map<String, Object> model = new HashMap<>();
		
		try {
			
		reqVo.putAll(param);

		mailService.mailSend(reqVo , model);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
			model.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
			model.put("message", e.getLocalizedMessage());			
		}

		return new ModelAndView(this.ajaxMainView, model);
	}	
	
	
	// 미리보기 
	@SslOn
	@RequestMapping(value="/sign/preview", method=RequestMethod.POST)
	public ModelAndView selectSignPreview(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response, @RequestBody Map<String, Object> param) {
		
		Map<String, Object> model = new HashMap<>();
		
		reqVo.putAll(param);
	
		CmResMap preview = adminSignService.selectSignPreview(reqVo);
		
		String pdfurl = "";
		boolean is_exist_deputy = false;
		
			if(preview != null && !StringUtils.isAnyBlank(preview.getString("sign_report_path"), preview.getString("sign_report_name")) ){
				pdfurl = preview.getString("sign_report_path") + preview.getString("sign_report_name") + ".do";
				
				CmResMap signDetail = adminSignDao.selectSignDetail(reqVo);
				List<CmResMap> recipientList = adminSignDao.selectRecipientList(reqVo);
			
				String send_date = DateFormatUtils.format((Date) signDetail.get("send_date"), "yyyyMMdd");
				 
				for(CmResMap recp : recipientList) {
					
					if(StringUtils.equals("D", recp.getString("recpnt_div"))) {
						is_exist_deputy = true;
						break;
					}
				}
				
				try {
					
					JSONObject jsonObject1 = new JSONObject();
					jsonObject1.put("recipient", recipientList);
					model.put("send_date", send_date);
					model.put("report",  (JSONObject) new JSONParser().parse(signDetail.getString("report_param")));
					model.put("recipient", jsonObject1.toString());
					model.put("D", (is_exist_deputy == true)? "Y" : "N");
					model.put("pdfurl", pdfurl);
					
				} catch (ParseException e) {
					
				}
					
			}
						
		
		return new ModelAndView(this.ajaxMainView, model);
		
	}
	
	
	 
}
