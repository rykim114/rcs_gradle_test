package apps.homepage.common.controller.custom.dataLink;

import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import apps.framework.annotation.SslOn;
import apps.framework.controller.CmController;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.utils.CmSecretUtil;
import apps.homepage.common.service.custom.dataLink.DataLinkService;
import apps.homepage.common.service.custom.log.LogService;

@Controller
@RequestMapping(value={"/api", "/dataLink"})
@SuppressWarnings({"rawtypes", "unchecked"})
public class DataLinkController   extends CmController {
	
	/** The Constant logger. */
	protected final Log	logger = LogFactory.getLog(this.getClass());
	@Resource
	MappingJackson2JsonView ajaxMainView;
	
	@Autowired
	private DataLinkService apiCommonService;

	@Autowired
	private LogService logService;
	
	@ResponseBody
	@SslOn
	@RequestMapping(value="/apiDataIntr")
	public ModelAndView extrDataIntr(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) throws Exception {		
//		ModelAndView mav = new ModelAndView("jsonView");
		ModelMap   model = new ModelMap();

		reqVo.put("ipAddr", request.getRemoteAddr());
		
		/* json data */
		JSONObject ret_data =  new JSONObject();
		if (apiCommonService.insertApiData(reqVo, request, model) == true ) {	
			logger.info("ret_data" + ret_data);
		}
		return new ModelAndView(this.ajaxMainView, model);
	}


	@ResponseBody
	@SslOn
	@RequestMapping(value="/signResult", method=RequestMethod.POST)	
	public ModelAndView selectSignResult(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response,
			@RequestBody(required=false) Map<String, Object> param) throws Exception {		
		ModelMap model = new ModelMap();
		List<Object> companyInfo = null;

		if (null == param || null == (companyInfo = (List<Object>) param.get("company_info")) || companyInfo.isEmpty()) {
			model.put("result_code", HttpStatus.BAD_REQUEST.value());
			model.put("result_message", "Content-Type: application/json 으로 보내주세요");
			return new ModelAndView(this.ajaxMainView, model);
		}

		Map<String, Object> company = (Map<String, Object>) companyInfo.get(0);

		reqVo.putAll(company);

		String[] requiredKeyArr = {"company_code", "service_seq"};

		for (String key : requiredKeyArr) {
			if (StringUtils.isBlank(reqVo.getString(key))) {
				model.put("result_code", HttpStatus.BAD_REQUEST.value());
				model.put("result_message", "필수 파라메터 누락: " + key);
				return new ModelAndView(this.ajaxMainView, model);
			}
		}
				
		reqVo.put("company_code", CmSecretUtil.xDecrypt(reqVo.getString("company_code")));
		// 혹시나 숫자로 올 수도 있어서 문자로 변경
		reqVo.put("service_seq", "" + reqVo.get("service_seq"));

		apiCommonService.selectSignResult(reqVo, model);


		return new ModelAndView(this.ajaxMainView, model);
	}

	@ResponseBody
	@SslOn
	@RequestMapping(value="/downloadReport", method=RequestMethod.POST)	
	public ModelAndView downloadReport(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response,
			@RequestBody(required=false) Map<String, Object> param) throws Exception {		

		// FIXME: 리포트 다운로드 이력 저장 필요할듯?

		ModelMap model = new ModelMap();
		List<Object> companyInfo = null;
		List<Object> reportInfo = null;

		if (null == param || null == (companyInfo = (List<Object>) param.get("company_info")) || companyInfo.isEmpty()
				|| null == (reportInfo = (List<Object>) param.get("report_info")) || reportInfo.isEmpty()) {
			model.put("result_code", HttpStatus.BAD_REQUEST.value());
			model.put("result_message", "Content-Type: application/json 으로 보내주세요");
			return new ModelAndView(this.ajaxMainView, model);
		}

		Map<String, Object> company = (Map<String, Object>) companyInfo.get(0);
		Map<String, Object> reportObj = (Map<String, Object>) reportInfo.get(0);
		Map<String, Object> mod = new HashMap<>();
		
		reqVo.putAll(company);
		reqVo.putAll(reportObj);

		String[] requiredKeyArr = {"company_code", "seq", "detail_seq"};

		for (String key : requiredKeyArr) {
			if (StringUtils.isBlank(reqVo.getString(key))) {
				model.put("result_code", HttpStatus.BAD_REQUEST.value());
				model.put("result_message", "필수 파라메터 누락: " + key);
				return new ModelAndView(this.ajaxMainView, model);
			}
		}
				
		reqVo.put("company_code", CmSecretUtil.xDecrypt(reqVo.getString("company_code")));
		// 혹시나 숫자로 올 수도 있어서 문자로 변경
		reqVo.put("signature_seq", "" + reqVo.get("seq"));
		reqVo.put("signature_detail_seq", "" + reqVo.get("detail_seq"));

		CmResMap report = apiCommonService.selectSignReport(reqVo);

		if (null == report) {
			model.put("result_code", HttpStatus.NOT_FOUND.value());
			model.put("result_message", "리포트가 없습니다");
			return new ModelAndView(this.ajaxMainView, model);
		}

		// XXX: pdf 아니면 img 만 있다고 가정함
		String fileName = "", filePath = "";
		
		if (StringUtils.equalsIgnoreCase("Y", reqVo.getString("is_deputy"))) {
			String imgPath = report.getString("awrt_anth_img_path");
			
			if (StringUtils.isBlank(imgPath)) {
				model.put("result_code", HttpStatus.NOT_FOUND.value());
				model.put("result_message", "대리인 위임장이 없습니다");
				return new ModelAndView(this.ajaxMainView, model);
			}
			
			fileName = StringUtils.substringAfterLast(report.getString("awrt_anth_img_path"), "/");
			filePath = StringUtils.substringBeforeLast(report.getString("awrt_anth_img_path"), "/") + "/";
		} else {
			fileName = report.getString("pdf_save_name");
			filePath = report.getString("pdf_save_path");
		}
		
		String contentType = URLConnection.guessContentTypeFromName(filePath + fileName);

//		try (FileInputStream fis = new FileInputStream(new File(CmPathInfo.getUPLOAD_PATH() + "/signreport_100_102_114.pdf"));
		try (FileInputStream fis = new FileInputStream(new File(filePath + fileName));
			OutputStream ros = response.getOutputStream()) {
			
			response.setContentType(contentType);
			response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
			
			IOUtils.copy(fis, response.getOutputStream());
			
			response.flushBuffer();
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);

			model.put("result_code", HttpStatus.INTERNAL_SERVER_ERROR.value());
			model.put("result_message", e.getLocalizedMessage());
			
			String error_content = e.getLocalizedMessage();
			if(error_content == null) {
				error_content = e.getClass().toString();
			}
			mod.put("process_name", "downloadReport");
			mod.put("company_code", CmSecretUtil.xDecrypt(reqVo.getString("company_code")));
			mod.put("signature_seq", reqVo.get("seq"));
			mod.put("error_content", error_content);
			
			logService.insertLogMsg(mod);
			
			return new ModelAndView(this.ajaxMainView, model);
		}


		return null;
	}
	
}
