package apps.homepage.common.service.custom.sign;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import apps.framework.object.CmMailVo;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.service.CmService;
import apps.framework.utils.CmFunction;
import apps.framework.utils.CmPathInfo;
import apps.framework.utils.email.CmMail;
import apps.homepage.common.dao.custom.sign.SignDao;
import apps.homepage.common.service.custom.log.LogService;

@Service
@SuppressWarnings({"rawtypes", "unchecked"})
public class SignService extends CmService {

	protected final Log	logger = LogFactory.getLog(this.getClass());

	@Autowired
	private SignDao adminSignDao;

	@Autowired
	private LogService logService;
	
	public void selectSignMyList(CmMap reqVo, Map<String, Object> model) {
		List<CmResMap> myList = adminSignDao.selectSignMyList(reqVo);
		
		if (null == myList) {
			model.put("code", HttpStatus.NOT_FOUND.value());
		} else {
			model.put("code", HttpStatus.OK.value());
			model.put("response", myList);
		}
	}
	

	public CmResMap selectSignPaper(CmMap reqVo) {
		return adminSignDao.selectSignPaper(reqVo);
	}
	
	/**
	 * API json 과 동일한 데이터 제공
	 * 원래는 로그인 되어있지 않으면 제공불가
	 * parameter: receipt_seq
	 * */
	public void selectSignReport(CmMap reqVo, Map<String, Object> model) {
		Map<String, Object> mod = new HashMap<>();

		CmResMap signDetail = adminSignDao.selectSignDetail(reqVo);

//		logger.debug(signDetail);

		if (null == signDetail) {
			model.put("error_msg", "리포트 정보 없음");
			return;
		}
		
		reqVo.put("signature_seq", signDetail.get("signature_seq"));
		reqVo.put("signature_detail_seq", signDetail.get("signature_detail_seq"));
		
		List<CmResMap> recipientList = adminSignDao.selectRecipientList(reqVo);

		if (null == recipientList) {
			model.put("error_msg", "서명인 정보 없음");
			return;
		}
		
		List<Object> companyInfo = new ArrayList<>();
		List<Object> senderInfo = new ArrayList<>();
		List<Object> recipientInfo = new ArrayList<>();
		List<Object> reportInfo = new ArrayList<>();

		
		CmResMap company = new CmResMap();
		
		company.put("company_code", signDetail.get("company_code"));
		companyInfo.add(company);
		reqVo.put("company_code", signDetail.get("company_code"));

		List<CmResMap> senderList = null;
		
		for (CmResMap recipient : recipientList) {
			if (StringUtils.equals("S", recipient.getString("recpnt_div"))) {
				senderList = adminSignDao.selectSenderList(recipient);
				break;
			}
		}
		
		if (null != senderList) {
			for (CmResMap sender : senderList) {
				sender.remove("company_code");

				senderInfo.add(sender);
			}
		}

		for (CmResMap recp : recipientList) {
			recp.put("no", recp.get("recipient_seq"));
			
			recp.remove("signature_detail_seq");
			recp.remove("signature_seq");
			recp.remove("company_code");
			recp.remove("recipient_seq");
			recp.remove("user_id");

			recipientInfo.add(recp);
		}
		
		CmResMap report = new CmResMap();
		
		report.put("no", signDetail.get("signature_seq"));
		report.put("paper_no", signDetail.get("paper_seq"));
		report.put("send_date", DateFormatUtils.format((Date) signDetail.get("send_date"), "yyyy년MM월dd일"));
		report.put("service_no", signDetail.get("service_no"));
		
		// 대리인이 있는지/없는지 여부 추가
		report.put("is_exist_deputy", false);
		for (CmResMap recp : recipientList) {
			if (StringUtils.equals("D", recp.getString("recpnt_div"))) {
				report.put("is_exist_deputy", true);
				break;
			}
		}

		try {
//			logger.debug(signDetail.getString("report_param"));
			report.putAll((JSONObject) new JSONParser().parse(signDetail.getString("report_param")));
		} catch (Exception e) {
			// FIXME: json 형식 아닌 경우 예외처리
			
			e.printStackTrace();
			mod.put("process_name", "selectSignReport");
			mod.put("error_content", e.getClass().toString());
			
			
			logService.insertLogMsg(mod);
		}
		
		reportInfo.add(report);

		// FIXME: 조회 후 2차 보안검사

		model.put("company_info", companyInfo);
		model.put("sender_info", senderInfo);
		model.put("recipient_info", recipientInfo);
		model.put("report_info", reportInfo);
	}

	public int updateSignRead(CmMap reqVo) {
		return adminSignDao.updateRecipientRead(reqVo);
	}

	public void updateSignRead(CmMap reqVo, Map<String, Object> model) {
	
		int result = updateSignRead(reqVo);
		
		if (0 < result) {
			model.put("code", HttpStatus.OK.value());
		} else {
			model.put("code", HttpStatus.NOT_MODIFIED.value());
		}
	}

	public void updateSignOn(HttpServletRequest request, CmMap reqVo, Map<String, Object> model) {
		
		int result = adminSignDao.updateRecipientSignOn(reqVo);
		Map<String, Object> mod = new HashMap<>();
		
		if (0 < result) {
			model.put("code", HttpStatus.OK.value());
		} else {
			model.put("code", HttpStatus.NOT_MODIFIED.value());
			model.put("message", "이미 서명하신 문서입니다");
			return;
		}
		
		// 첨부파일이 있는 경우: 대리인 위임장 저장
		if (request instanceof MultipartHttpServletRequest) {
			MultipartFile file = ((MultipartHttpServletRequest) request).getFile("awrt_anth_img_path");
		
			if (null != file) {
				String company_code = reqVo.getString("company_code");
				// XXX: 메일주소 앞부분만 경로에 입력되도록 수정함, 다른 개인정보로 수정 시 문제될 수 있는지 확인 필요
				String user_id = StringUtils.substringBefore(reqVo.getString("admin_userId"), "@");
				String signature_detail_seq = reqVo.getString("signature_detail_seq");
				String signature_seq = reqVo.getString("signature_seq");
				String upload_path = CmPathInfo.getUPLOAD_PATH() + company_code + "/" + user_id + "/" + CmFunction.getTodayString("yyyyMM")+"/";
		
				File destdir = new File(upload_path);
				if(!destdir.exists()){
					destdir.mkdirs();
				}
				
				String fileExtension = StringUtils.defaultIfBlank(StringUtils.substringAfterLast(file.getOriginalFilename(), "."), "png");
		
				String save_file = "awrt_img_"+company_code+"_"+signature_detail_seq+"_"+signature_seq + "." + fileExtension;
				String awrt_anth_img_path =  upload_path + save_file;
				
				reqVo.put("awrt_anth_img_path", awrt_anth_img_path);
				
				try {
					file.transferTo(new File(awrt_anth_img_path));
				} catch (IllegalStateException | IOException e) {
					logger.error(e);
					e.printStackTrace();
					mod.put("process_name", "updateSignOn");
					mod.put("error_content", e.getClass().toString());
					mod.put("user_id", user_id);
					mod.put("signatre_seq", signature_seq);
					mod.put("company_code", company_code);
					logService.insertLogMsg(mod);
				}
		
				
			}

			adminSignDao.updateAwrtAnthImgPathSignOn(reqVo);
		}
	}
	
	public void madeReportUpdate(CmMap reqVo, Map<String, Object> model) {
		Map<String, Object> mod = new HashMap<>();
		String company_code = reqVo.getString("company_code");
		// XXX: 메일주소 앞부분만 경로에 입력되도록 수정함, 다른 개인정보로 수정 시 문제될 수 있는지 확인 필요
		String user_id = StringUtils.substringBefore(reqVo.getString("admin_userId"), "@");
		String signature_detail_seq = reqVo.getString("signature_detail_seq");
		String signature_seq = reqVo.getString("signature_seq");
		String upload_path = CmPathInfo.getUPLOAD_PATH() + company_code + "/" + user_id + "/" + CmFunction.getTodayString("yyyyMM")+"/";


		
		File destdir = new File(upload_path);
		if(!destdir.exists()){
			destdir.mkdirs();
		}
		

		String save_path = (upload_path).replaceAll(":","!@");					
		String save_file = "signreport_"+company_code+"_"+signature_detail_seq+"_"+signature_seq;
		
		String filename ="";
		String pdfurl = "";
		
		int result = 0;
		
		boolean is_exist_deputy = false;
		
		CmMap postMap = new CmMap();
		try{
			CmResMap paper = selectSignPaper(reqVo);
			
			if(paper != null && !StringUtils.isAnyBlank(paper.getString("sign_report_path"), paper.getString("sign_report_name")) ){
				
				pdfurl = paper.getString("sign_report_path") + "/" + paper.getString("sign_report_name") + ".do"; 
				
				CmResMap signDetail = adminSignDao.selectSignDetail(reqVo);
				List<CmResMap> recipientList = adminSignDao.selectRecipientList(reqVo);
				
				
				for (CmResMap recp : recipientList) {
					if (StringUtils.equals("D", recp.getString("recpnt_div"))) {
						is_exist_deputy = true;
						break;
					}
				}
				
				
//				JSONObject jsonObject = new JSONObject();
//				jsonObject.put("report", signDetail);
//				System.out.println(jsonObject.toString());
				
				JSONObject jsonObject1 = new JSONObject();
				jsonObject1.put("recipient", recipientList);
//				System.out.println(jsonObject1.toString());
				logger.debug(jsonObject1.toString());
				
				postMap.put("send_date", DateFormatUtils.format((Date) signDetail.get("send_date"), "yyyyMMdd"));
				postMap.put("report", (JSONObject) new JSONParser().parse(signDetail.getString("report_param")));
				postMap.put("recipient", jsonObject1.toString());
				postMap.put("sq", "Y");
				postMap.put("reportMode", "PDF");
				postMap.put("reportParams", "pdfserversave:true,savename:" + save_path + save_file);
				postMap.put("D", (is_exist_deputy == true)? "Y" : "N");
				
//				String retStr = "[{\"TV\":\"3d tv\"},{\"computer\":\"Computer\notebook\",\"LG\":\"1\",\"count\":\"20\"}]";

				String retStr = (String)CmFunction.urlofPostToString( CmPathInfo.getSSL_URL()+pdfurl, postMap).toString();

				try{
					
					if (!retStr.equals("")){ 
						JSONParser parser = new JSONParser();
						JSONArray ja = (JSONArray)parser.parse(retStr);
						
						for (int i = 0; i < ja.size(); i++){
							JSONObject order =(JSONObject) ja.get(i);
							if (!order.get("targetURL").equals("")){
								filename = (String) order.get("targetURL");
							}
						}
					}
					String[] savefile_name = filename.split("/");
					
					filename = savefile_name[savefile_name.length - 1];
					reqVo.put("filename", filename);
					reqVo.put("upload_path", upload_path);
										
					
					String signfilename = upload_path + filename;					
					String[] content_file_list = signfilename.split(";");					
					String content_file = content_file_list[0];

					
					content_file = content_file + ";" + signDetail.get("awrt_anth_img_path");					
					content_file_list = content_file.split(";");


					if(filename.equals("")){
						model.put("code", HttpStatus.NOT_MODIFIED.value());
						model.put("message", "서명문서 저장에 문제가 발생하였습니다.");
						return;
					}else{												
						result = adminSignDao.updateSaveReportPath(reqVo);												
						
						List<CmResMap> fdatalist = adminSignDao.selectemaillist(reqVo);
				
						String sUrl = CmPathInfo.getWEB_URL()+"view/sign/email.do";
						String content = CmFunction.urlToString(sUrl);
						
						String fromName  =	"[SignON]";
						String fromEmail =	"no-reply@signon.kr";
						String cc =  "";
						
						String to = "";
						String title = "";
						CmMailVo mailvo = new CmMailVo();
												
						if (fdatalist != null) {
							for(HashMap<String, Object> rvo : fdatalist){
								if(rvo.get("recpnt_div").toString().equals("C")) {
									cc = rvo.get("toemail").toString() + "," + cc;
								}else {
									to = rvo.get("toemail").toString() + "," + to;
								}
								title = rvo.get("title").toString();
							}
							if(cc.toString().equals("")){
								to = to.substring(0, to.length()-1);								
							}else {
								cc = cc.substring(0, cc.length()-1);
								to = to.substring(0, to.length()-1);
							}									
							
							mailvo = CmMail.send(fromName, fromEmail, to, cc, title, content,content_file_list);
							
							reqVo.put("mail_flag", mailvo.getFlagSend());
							reqVo.put("send_email", fromEmail);
							reqVo.put("email_title", title);
							reqVo.put("contents", content);
							
							adminSignDao.insertemaillog(reqVo);
							
						}
					}
				} catch (Exception e) {
					logger.error(e); //e.printStackTrace();			
					
					mod.put("process_name", "madeReportUpdate1");
					mod.put("error_content", e.getClass().toString());
					
					logService.insertLogMsg(mod);
				}
				
			}else{
				model.put("code", HttpStatus.NOT_MODIFIED.value());
				model.put("message", "서명양식 정보가 존재 하지 않습니다.");
				return;
			}
			
		}catch(Exception e){
			model.put("code", HttpStatus.NOT_MODIFIED.value());
			model.put("message", "첨부파일이 생성에 문제가 발생하였습니다.");
			
			mod.put("process_name", "madeReportUpdate");
			mod.put("error_content", e.getClass().toString());
			
			logService.insertLogMsg(mod);
			return;
		
		}
		

		if (0 < result) {
			model.put("code", HttpStatus.OK.value());
		} else {
			model.put("code", HttpStatus.NOT_MODIFIED.value());
			model.put("message", "첨부파일이 경로에 문제가 발생하였습니다.");
		}
	}

	public CmResMap selectSignPreview(CmMap reqVo) {
		return adminSignDao.selectSignPreview(reqVo);
	}
	
}
