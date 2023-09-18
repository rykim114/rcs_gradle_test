package apps.homepage.common.controller.custom.sign;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import apps.framework.annotation.SslOn;
import apps.framework.controller.CmController;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.utils.CmFunction;
import apps.homepage.common.service.custom.log.LogService;
import apps.homepage.common.service.custom.sign.SignService;

@Controller
@SuppressWarnings({ "rawtypes", "unchecked" })
@RequestMapping("/view")
public class SignViewController extends CmController {

	@Autowired
	SignService adminSignService;

	@Autowired
	private LogService logService;
	/** The Constant logger. */
	protected final Log logger = LogFactory.getLog(this.getClass());

	@SslOn
	@RequestMapping(value = "/sign/splash", method = RequestMethod.GET)
	public String splash(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request,
			HttpServletResponse response) {
		return "front/pc/signon/splash";
	}

	@SslOn
	@RequestMapping(value = "/sign/userAuth", method = RequestMethod.GET)
	public String userAuth(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request,
			HttpServletResponse response) {
		return "front/pc/signon/userAuth";
	}

	@SslOn
	@RequestMapping(value = "/sign/agree", method = RequestMethod.GET)
	public String agree(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request,
			HttpServletResponse response) {
		return "front/pc/signon/elesign_agree";
	}

	@SslOn
	@RequestMapping(value = "/sign/reportList", method = RequestMethod.GET)
	public String reportList(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request,
			HttpServletResponse response) {
		return "front/pc/signon/elesign_list";
	}

	@SslOn
	@RequestMapping(value = "/sign/reportD", method = RequestMethod.GET)
	public ModelAndView reportD(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request,
			HttpServletResponse response) {
		ModelAndView mav = new ModelAndView();
		Map<String, Object> model = new HashMap<>();
		reqVo.put("key", "service_no");
		adminSignService.selectSignReport(reqVo, model);
		logger.debug(model);
		return new ModelAndView("front/pc/signon/report_sell", model);

	}

	@SslOn
	@RequestMapping(value = "/sign/testingReportDataSend", method = RequestMethod.GET)
	public String testingReportDataSend(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request,
			HttpServletResponse response) {
		return "front/pc/signon/test";
	}

	@SslOn
	@RequestMapping(value = "/sign/reportL", method = RequestMethod.GET)
	public ModelAndView reportlease(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request,
			HttpServletResponse response) {
		ModelAndView mav = new ModelAndView();
		Map<String, Object> model = new HashMap<>();
		reqVo.put("key", "service_no");
		adminSignService.selectSignReport(reqVo, model);
		logger.debug(model);
		return new ModelAndView("common/report/AIViewer55/report/remax_lease_report", model);

	}

	@SslOn
	@RequestMapping(value = "/sign/report_sell_popUp", method = RequestMethod.GET)
	public String reportP(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request,
			HttpServletResponse response) {
		return "common/custom/sign/signPopUp";
	}

	@SslOn
	@RequestMapping(value = "/sign/report_sell_popUp2", method = RequestMethod.GET)
	public String reportP2(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request,
			HttpServletResponse response) {
		return "common/custom/sign/signPopUp2";
	}

	@SslOn
	@RequestMapping(value = "/sign/report_sell_popUp3", method = RequestMethod.GET)
	public String reportP3(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request,
			HttpServletResponse response) {
		return "common/custom/sign/signPopUp3";
	}

	@SslOn
	@RequestMapping(value = "/sign/email", method = RequestMethod.GET)
	public String email(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request,
			HttpServletResponse response) {
		return "front/pc/signon/email";
	}

	@SslOn
	@RequestMapping(value = "/sign/lease_report", method = RequestMethod.GET)
	public String lease_report(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request,
			HttpServletResponse response) {
		return "common/report/AIViewer55/report/remax_lease_report";
	}

	@SslOn
	@RequestMapping(value = "/sign/report", method = { RequestMethod.GET })
	public ModelAndView reportView(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request,
			HttpServletResponse response) {
		Map<String, Object> model = new HashMap<>();
		Map<String, Object> mod = new HashMap<>();
//		logger.debug(reqVo);

		CmResMap paper = adminSignService.selectSignPaper(reqVo);

//		logger.debug(paper);

		if (null == paper
				|| StringUtils.isAnyBlank(paper.getString("sign_form_path"), paper.getString("sign_form_name"))) {
			ModelAndView mav = new ModelAndView("common/core/javascript");
			mav.addObject("excute_script", CmFunction.jsmsg("서명양식이 없습니다", "B"));

			return mav;
		}

		try {

			adminSignService.selectSignReport(reqVo, model);

			List<CmResMap> reportInfo = (List<CmResMap>) model.get("report_info");
			List<CmResMap> recipientInfo = (List<CmResMap>) model.get("recipient_info");

			String path = paper.getString("sign_form_path") + paper.getString("sign_form_name");
			if (null != reportInfo && null != recipientInfo) {
				HttpSession session = request.getSession();
				session.setAttribute("receipt_seq", reqVo.getString("receipt_seq"));
				session.setAttribute("company_code", reqVo.getString("company_code"));
				session.setAttribute("signature_detail_seq", reqVo.getString("signature_detail_seq"));
				session.setAttribute("recipient_seq", reqVo.getString("recipient_seq"));
				session.setAttribute("jsp_path", path);

				for (CmResMap report : reportInfo) {
					session.setAttribute("signature_seq", report.get("no"));
					break;
				}

				String userId = (String) session.getAttribute("admin_userId");
//				for (CmResMap recp : recipientInfo) {
//				if (StringUtils.equals(userId, recp.getString("email"))) {
//					session.setAttribute("recipient_seq", recp.get("no"));
//					break;
//				}
//			}
			
			// 수신 확인 시간 업데이트 여기에서 호출: 쿼리에서 처음 한번만 기록됨
				adminSignService.updateSignRead(reqVo);
			}
		} catch (Exception e) {
			  e.printStackTrace();
			  String error_content = e.getLocalizedMessage();
			  if(error_content == null) {
				 error_content = e.getClass().toString();
			  }
			  mod.put("process_name", "selectSignReport");
			  mod.put("error_content", error_content); 
			  
			  logService.insertLogMsg(mod);
			 

		}
		return new ModelAndView("front/pc/signon/report", model);

	}

}
