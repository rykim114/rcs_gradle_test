package apps.homepage.common.service.custom.dataLink;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;


import org.apache.commons.lang.time.DateUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.ui.ModelMap;

import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.service.CmService;
import apps.framework.utils.CmFunction;
import apps.framework.utils.CmPathInfo;
import apps.framework.utils.CmSecretUtil;
import apps.framework.utils.sms.CmSms;
import apps.homepage.common.dao.custom.dataLink.DataLinkDao;

@Service
@SuppressWarnings("rawtypes")
public class DataLinkService   extends CmService {
	
	/** The Constant logger. */
	protected final Log	logger = LogFactory.getLog(this.getClass());
	
	@Autowired
	private DataLinkDao apiCommonDao;
	
	@Autowired 
	private CmSms cmSms;
	
	public boolean insertApiData(CmMap reqVo,  HttpServletRequest request, ModelMap model ) {
		boolean prcf_chk = true;
		String result_code = "";
		String result_message = "";
		CmMap ClonMap = new CmMap();
		String body = null;
        StringBuilder stringBuilder = new StringBuilder();
        BufferedReader bufferedReader = null;
 
        try {
            InputStream inputStream = request.getInputStream();
            if (inputStream != null) {
                bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
                char[] charBuffer = new char[128];
                int bytesRead = -1;
                while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
                    stringBuilder.append(charBuffer, 0, bytesRead);
                }
            } else {
                stringBuilder.append("");
            }
        } catch (Exception ex) {
			model.put("result_code", "9000");
			model.put("result_message", "전문수신오류");
			
        	logger.error(ex);
        	
        } finally {
            if (bufferedReader != null) {
                try {
                    bufferedReader.close();
                } catch (Exception ex) {
                	logger.error(ex);
                }
            }
        }
        
        body = stringBuilder.toString();
		        
        if (body == null || body.equals("")) {
			model.put("result_code", "9000");
			model.put("result_message", "전문수신오류");
        }
        
        if (!result_code.equals("")) return false;
    	
        JSONObject ret_data = new JSONObject();        
        try {        	
        	ret_data = (JSONObject) new JSONParser().parse(body);
        	SimpleDateFormat format1 = new SimpleDateFormat ( "yyyy-MM-dd HH:mm:ss");
        	Date receiptDate = new Date();
        	int sign_seq = 0;
        	//String receipt_seq = "random_1";
    		reqVo.put("receipt_date", receiptDate);
    		reqVo.put("receipt_data", body);
    		//암호화 키?? 
    		String receipt_seq = CmFunction.getRandomString(20); 
    		reqVo.put("receipt_seq", receipt_seq);
        	
        	/* 회사코드 */
        	JSONArray arr_company_info = (JSONArray) ret_data.get("company_info");
        	for(int i=0; i<arr_company_info.size(); i++){
    			JSONObject arrCompInArray = (JSONObject) arr_company_info.get(i);
    			/* 파라미터 회사코드를 암호화 값으로 변경처리 */    			
    			String company_code= CmSecretUtil.xDecrypt( (String) arrCompInArray.get("company_code"));
    			reqVo.put("company_code", company_code);
        		reqVo.put("service_seq", arrCompInArray.get("service_seq"));
        		
        		int compCnt = apiCommonDao.selectCompCnt(reqVo);
        		
        		if (compCnt < 1 ) {
        			prcf_chk = false;       
					model.put("result_code", "5000");
					model.put("result_message", "회사코드없음");
    				logger.info("####### 회사코드없음 #######");
    				return false;
        		}
        	}
        	
        	JSONArray arr_sender_info = (JSONArray) ret_data.get("sender_info");
        	for(int i=0; i<arr_sender_info.size(); i++){
        		JSONObject arrSenderInArray = (JSONObject) arr_sender_info.get(i);
        		reqVo.put("user_id", arrSenderInArray.get("email"));
        		
        		/* 애넨 어디쓰는거지?? 
        		logger.info("service_id : " + arrSenderInArray.get("service_id"));
        		logger.info("user_name : " + arrSenderInArray.get("user_name"));
        		logger.info("user_phon : " + arrSenderInArray.get("user_phon"));
        		*/
        	}
        	
        	JSONArray arr_report_info = (JSONArray) ret_data.get("report_info");
        	
        	for(int i=0; i<arr_report_info.size(); i++){
        		JSONObject arrReportInArray = (JSONObject) arr_report_info.get(i);
        		reqVo.put("paper_seq", arrReportInArray.get("paper_no"));
        		
        		int paperCnt = apiCommonDao.selectPaperCnt(reqVo);
        		
        		if (paperCnt < 1 ) {
        			prcf_chk = false;       
					model.put("result_code", "5200");
					model.put("result_message", "양식없음");
    				
    				logger.info("####### 양식없음 #######");
    				return false;
        		}
        		
        		reqVo.put("service_no", arrReportInArray.get("service_no"));
        		reqVo.put("send_date", arrReportInArray.get("send_date"));
        		reqVo.put("possible_time_s", arrReportInArray.get("possible_time_s"));
        		reqVo.put("possible_time_e", arrReportInArray.get("possible_time_e"));
        		
        		arrReportInArray.remove("no");
        		arrReportInArray.remove("paper_seq");
        		arrReportInArray.remove("service_no");
        		arrReportInArray.remove("send_date");
        		arrReportInArray.remove("possible_time_s");
        		arrReportInArray.remove("possible_time_e");
        		
        		reqVo.put("report_param", arrReportInArray.toString());
        		
        		int dataCnt = apiCommonDao.selectDataCnt(reqVo);
    			if (dataCnt < 1) {
            		apiCommonDao.insertApiHistory(reqVo);	// 원본 저장
    				apiCommonDao.insertSignMaster(reqVo);	// 사인마스터 저장
    			} else {
    				prcf_chk = false;    
					model.put("result_code", "5100");
					model.put("result_message", "자료중복오류");

    				logger.info("####### 자료중복오류 #######");
    				return false;
    			}
    			
        		/* 수정필요 */
    			// FIXME: 서명 가능시간 파라메터 필요
    			reqVo.put("sign_possible_s", new Date());
    			reqVo.put("sign_possible_e", DateUtils.addDays(new Date(), 10));
    			
        		apiCommonDao.insertSignDetail(reqVo);	// 원본 저장
        		
        		/* 서명수신인 */
            	JSONArray arr_recipient_info = (JSONArray) ret_data.get("recipient_info");
            	
            	logger.info("####### recipient_info #######" + arr_recipient_info);
            	for(int j=0; j<arr_recipient_info.size(); j++){
            		
            		JSONObject arrReceiptInArray = (JSONObject) arr_recipient_info.get(j);
            		logger.info(j + " ####### arrReceiptInArray #######" + arrReceiptInArray);            		
            		reqVo.put("user_name", arrReceiptInArray.get("user_name"));
            		/*reqVo.put("user_phon", arrReceiptInArray.get("user_phon"));*/
            		reqVo.put("user_phon", arrReceiptInArray.get("user_phon"));
            		reqVo.put("recpnt_div", arrReceiptInArray.get("recpnt_div"));
            		reqVo.put("paper_seq", arrReceiptInArray.get("paper_no"));
            		reqVo.put("user_email", arrReceiptInArray.get("email"));
            		
            		logger.info("####### user_name #######" + arrReceiptInArray.get("user_name"));
            		logger.info("####### reqVo #######" + reqVo);
            		
            		apiCommonDao.insertRecipientInfo(reqVo);	// 원본 저장
            	}
            	logger.info("####### recipient_info_end #######");
        	}
        	logger.info("####### report_info_end #######");
        	
        	
        	logger.info("####### sms_send_start #######");
        	List<CmResMap> receipientList = apiCommonDao.selectReceipientInfo(reqVo);
			
			logger.info("receipientList" + receipientList);
			
			boolean is_exist_deputy = false;
			
			for (CmResMap recp : receipientList) {
				if (StringUtils.equals("D", recp.getString("recpnt_div"))) {
					is_exist_deputy = true;
					break;
				}
			}
			
			if(is_exist_deputy){
				apiCommonDao.updateRecipientD(reqVo);
			}
			
			if (null != receipientList) {
				for (CmResMap receipient : receipientList) {
					
					if(receipient.getString("recpnt_div").equals("S") || receipient.getString("recpnt_div").equals("C")) continue;
					if(is_exist_deputy && receipient.getString("recpnt_div").equals("R")) continue;
					
					String username = receipient.getString("user_name");
					String userphon = receipient.getString("user_phon");
					
					// URL 접속안내 form_id "2"
					// sendGbn 1
					CmMap smsData = new CmMap();
					smsData.put("cust_name", username);
					smsData.put("url", CmPathInfo.getSSL_URL());
					
					String sendNm = "070-8811-8881";
					String title = "";
					
					CmMap smsResult = cmSms.sendChg(reqVo, sendNm, userphon, title, smsData, "2", 1);
					
					if (null == smsResult || ! StringUtils.equals("OK", smsResult.getString("FlagSend"))) {
						model.put("result_code", "1500");
						model.put("result_message", "SMS 전송오류");
						break;
					}

//					cmSms.sendChg(CmMap SMSreqVo, String sendNm, String receNm, String title, CmMap SMSdata, String form_id, int sendGbn) 
					//CmMap smsvo = cmSms.send(sendNm, receNm, title, content)        
				}
			}	
        	logger.info("####### sms_send_end #######");

        	if (! model.containsKey("result_code")) {
				model.put("result_code", "0000");
				model.put("result_message", "정상처리완료");
        	}
        	
        } catch (Exception ex) {
        	prcf_chk = false;        	
        	result_code = "1040";
			result_message = "전문변환오류";
			model.put("result_code", result_code);
			model.put("result_message", result_message);
        	logger.error(ex);        	
        	return false;
        }
        
		return prcf_chk;
	}

	public void selectSignResult(CmMap reqVo, ModelMap model) {
		
		List<CmResMap> pdfList = apiCommonDao.selectSignResultByServiceSeq(reqVo);
		
		if (null == pdfList || pdfList.isEmpty()) {
			model.put("result_code", HttpStatus.NOT_FOUND.value());
			model.put("result_message", "서명 완료된 리포트가 없습니다");
			return;
		}
		
		List<CmResMap> seqList = new ArrayList<>();
		
		for (CmResMap pdf : pdfList) {
			CmResMap seq = new CmResMap();
			
			seq.put("seq", pdf.get("signature_seq"));
			seq.put("detail_seq", pdf.get("signature_detail_seq"));
			
			seq.put("has_deputy_img", StringUtils.isNotBlank(pdf.getString("awrt_anth_img_path")) ? "Y" : "N");

			seqList.add(seq);
		}

		model.put("report_info", seqList);

		model.put("result_code", HttpStatus.OK.value());
	}


	public CmResMap selectSignReport(CmMap reqVo) {
		return apiCommonDao.selectSignResultBySignatureSeq(reqVo);
	}


}
