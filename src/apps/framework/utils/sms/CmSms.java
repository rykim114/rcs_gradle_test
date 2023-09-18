package apps.framework.utils.sms;


import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Properties;

import org.apache.ibatis.io.Resources;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.service.CmService;
import apps.framework.utils.CmFunction;
import apps.homepage.common.dao.core.CommonDao;
import apps.homepage.common.dao.core.SMSDao;
import apps.homepage.common.service.core.TelNumberConfirmService;

@Service
@SuppressWarnings("rawtypes")
public class CmSms extends CmService {

	@Autowired
	private SMSDao smsDao;
	
	@Autowired
	private CommonDao commonDao;
	
	@Autowired
	private TelNumberConfirmService telNumberConfirmService;
	
	public  CmMap send(CmMap SMSreqVo, String sendNm, String receNm, String title, String content) {
		CmMap reqVo = new CmMap();
		String msg_type ="1";  	
		boolean result = true;
    	
		try {
			if ( content.getBytes().length < 80 ){
				//SMS
	    		msg_type = "1";
			}else{
				//LMS
				msg_type = "2";
			}
			
			sendNm = sendNm.replace("-", "");
			sendNm = sendNm.replace("-", "");
			sendNm = sendNm.replace("-", "");
			sendNm = sendNm.replace("-", "");
			 
			receNm = receNm.replace("-", "");
			receNm = receNm.replace("-", "");
			receNm = receNm.replace("-", "");
			receNm = receNm.replace("-", "");
	 
			if (sendNm == null || sendNm.equals("")){
				try {
					Properties props = Resources.getResourceAsProperties("ezREMS.properties");
					sendNm = CmFunction.getStringValue(props.getProperty("SEND_SMS"));
				} catch (Exception e) {
					//System.out.println("### CmSMS Properties ###");
					logger.error(e); //e.printStackTrace();
				}
			}
	 
	 
			if (receNm.length() <= 8 ){    		 
				reqVo.put("FlagSend", "E");
				reqVo.put("Content", "수신자 번호 자릿수 오류");
				return reqVo;
			}
	 
			if (receNm.substring(0, 3).equals("010") ||
					receNm.substring(0, 3).equals("011") ||
					receNm.substring(0, 3).equals("016") ||
					receNm.substring(0, 3).equals("017") ||
					receNm.substring(0, 3).equals("019") ) {
				// 정상
	
			} else{
				reqVo.put("FlagSend", "E");
				reqVo.put("Content", "수신자 번호 오류");
				return reqVo;
			}
	
			if (content == null || content.equals("")){
				reqVo.put("FlagSend", "E");
				reqVo.put("Content", "메시지 없음");
				return reqVo;    		 
			}
	 
			//20170817 bill36524 발신자번호 제한에 따른 발신 불가 처리  시작
//			boolean sendNmValid = false;
//			
//			CmMap reqCompMap = new CmMap();
//			String daoname = "BICOMM_Dao.SMS_SENDNM_LIST.select";
//			List<LinkedHashMap> smsnmList = commonDao.XmlSelectsql(daoname, reqCompMap);
//			if (smsnmList.size() > 0){
//				Iterator itr = smsnmList.iterator();
//				while(itr.hasNext()) {
//					LinkedHashMap cmResMap = (LinkedHashMap) itr.next();
//					if(cmResMap.get("sendnm").toString().equals(sendNm)) {
//						sendNmValid = true;
//					}
//				}
//			}
			
//			if(!sendNmValid) {
//			reqVo.put("FlagSend", "E");
//			reqVo.put("Content", "발신자번호 제한");
//			return reqVo;    		 
//		}		
			SMSreqVo.put("tel_no", sendNm);
			
			int resultCnt = telNumberConfirmService.bizTongConfirmListTelNumber(SMSreqVo);
			if (resultCnt == 0){
				reqVo.put("FlagSend", "E");
				reqVo.put("Content", "발신자번호 제한");
				return reqVo;   
			}
			

			//20170817 bill36524 발신자번호 제한에 따른 발신 불가 처리  끝
			
			
			reqVo.put("msg_type", msg_type); //메시지 타입
			reqVo.put("msg_title", title); //메시지 제목
			reqVo.put("msg_content", content); //메시지 내용
			reqVo.put("send_num", sendNm); //발신자 전화번호
			reqVo.put("recv_num", receNm); //수신자 전화번호
			reqVo.put("recv_cont", "1"); //수신자 수
			
			reqVo.put("company_code", SMSreqVo.getString("companyCode")); //회사코드
			reqVo.put("proj_code", SMSreqVo.getString("proj_code")); //사업지코드
			reqVo.put("sell_code", SMSreqVo.getString("sell_code")); //업무구분코드
			reqVo.put("form_id", (SMSreqVo.getString("form_id").equals(""))? "00" : SMSreqVo.getString("form_id"));
			reqVo.put("userId", SMSreqVo.getString("userId"));
			reqVo.put("userIp", SMSreqVo.getString("regIp"));
			
			reqVo.put("batch_id", smsDao.getSmsBatchId());
			 
			/*smsDao.insertSmsQueue(reqVo);
			smsDao.insertSmsQueueReceiver(reqVo);			*/
			
			smsDao.insertReSmsSendZo(reqVo);
			smsDao.insertSmsQueueZo(reqVo);
			smsDao.insertSmsQueueReceiverZo(reqVo);	
			
	    	 
			reqVo.put("FlagSend", "OK");
			reqVo.put("Content", "전송 완료");
			
						
		} catch (Exception e) {
			reqVo.put("FlagSend", "E");
			reqVo.put("Content", "오류 발생");
			
			logger.error(e); //e.printStackTrace();
		}
    	
    	return reqVo;
    }
	
	
	public  CmMap sendChg(CmMap SMSreqVo, String sendNm, String receNm, String title, CmMap SMSdata, String msg_form_id, int sendGbn) {
		CmMap reqVo = new CmMap();
		String msg_type ="1";  	
		boolean result = true;
		
		SMSreqVo.put("msg_form_id", msg_form_id);
		
		CmMap smsfrom = smsDao.getSmsFormInfo(SMSreqVo);
		
		String template_code = "";
		String temp_content_cust = "";
//		String temp_content_admin = "";
//		String temp_content_cooperation = "";
		
		
		if (smsfrom != null){
			template_code = smsfrom.getString("template_code");
			temp_content_cust = smsfrom.getString("sms_form_html_cust");
//			temp_content_admin = smsfrom.getString("sms_form_html_admin");
//			temp_content_cooperation = smsfrom.getString("sms_form_html_cooperation");
			
			
			/*logger.info("KakaoAlimtalkSendContent  template_code :"+template_code);
			logger.info("KakaoAlimtalkSendContent  temp_content_cust :"+temp_content_cust);*/
			
			if (temp_content_cust == null ) temp_content_cust = "";
//			if (temp_content_admin == null ) temp_content_admin = "";
//			if (temp_content_cooperation == null ) temp_content_cooperation = "";
			
			Iterator<String> keys = SMSdata.keySet().iterator();
	        while( keys.hasNext() ){
	            String key = keys.next();
	            //System.out.println( String.format("키 : %s, 값 : %s", key, reqVo.get(key)) );
	            temp_content_cust = temp_content_cust.replaceAll("%"+key+"%", SMSdata.getString(key));
	            temp_content_cust = temp_content_cust.replaceAll("\\#\\{"+key+"\\}", SMSdata.getString(key));
	            
//	            temp_content_admin = temp_content_admin.replaceAll("%"+key+"%", SMSdata.getString(key));
//	            temp_content_admin = temp_content_admin.replaceAll("\\#\\{"+key+"\\}", SMSdata.getString(key));
//	            
//	            temp_content_cooperation = temp_content_cooperation.replaceAll("%"+key+"%", SMSdata.getString(key));
//	            temp_content_cooperation = temp_content_cooperation.replaceAll("\\#\\{"+key+"\\}", SMSdata.getString(key));
	        }
		}
		
		
		//타이틀 없으면 기본 타이틀로
		if(title.equals("") || title == null){
			title = smsfrom.getString("msg_title");
		}
		//발신번호 없으면 기본 발신번호로
		if(sendNm.replaceAll("-", "").equals("") || sendNm.replaceAll("-", "") == null){
			sendNm = smsfrom.getString("basic_send_num");
		}
		
		
		String content = "";
		
		if (sendGbn == 1 ) content = temp_content_cust;
//		if (sendGbn == 2 ) content = temp_content_admin;
//		if (sendGbn == 3 ) content = temp_content_cooperation;

		
		try {
			System.out.println(">>>>>>>>>>>>>>>>>>>>>>>" + content.getBytes("euc_kr").length);
			if ( content.getBytes("euc_kr").length <= 80 ){
				//SMS
	    		msg_type = "1";
			}else{
				//LMS
				msg_type = "2";
			}
			
			sendNm = sendNm.replace("-", "");
			sendNm = sendNm.replace("-", "");
			sendNm = sendNm.replace("-", "");
			sendNm = sendNm.replace("-", "");
			 
			receNm = receNm.replace("-", "");
			receNm = receNm.replace("-", "");
			receNm = receNm.replace("-", "");
			receNm = receNm.replace("-", "");
	 
			if (sendNm == null || sendNm.equals("")){
				try {
					Properties props = Resources.getResourceAsProperties("ezREMS.properties");
					sendNm = CmFunction.getStringValue(props.getProperty("SEND_SMS"));
				} catch (Exception e) {
					//System.out.println("### CmSMS Properties ###");
					logger.error(e); //e.printStackTrace();
				}
			}
	 
	 
			if (receNm.length() <= 8 ){    		 
				reqVo.put("FlagSend", "E");
				reqVo.put("Content", "수신자 번호 자릿수 오류");
				return reqVo;
			}
	 
			if (receNm.substring(0, 3).equals("010") ||
					receNm.substring(0, 3).equals("011") ||
					receNm.substring(0, 3).equals("016") ||
					receNm.substring(0, 3).equals("017") ||
					receNm.substring(0, 3).equals("019") ) {
				// 정상
	
			} else{
				reqVo.put("FlagSend", "E");
				reqVo.put("Content", "수신자 번호 오류");
				return reqVo;
			}
	
			if (content == null || content.equals("")){
				reqVo.put("FlagSend", "E");
				reqVo.put("Content", "메시지 없음");
				return reqVo;    		 
			}
	 
			//20170817 bill36524 발신자번호 제한에 따른 발신 불가 처리  시작
//			boolean sendNmValid = false;
//			
//			CmMap reqCompMap = new CmMap();
//			String daoname = "BICOMM_Dao.SMS_SENDNM_LIST.select";
//			List<LinkedHashMap> smsnmList = commonDao.XmlSelectsql(daoname, reqCompMap);
//			if (smsnmList.size() > 0){
//				Iterator itr = smsnmList.iterator();
//				while(itr.hasNext()) {
//					LinkedHashMap cmResMap = (LinkedHashMap) itr.next();
//					if(cmResMap.get("sendnm").toString().equals(sendNm)) {
//						sendNmValid = true;
//					}
//				}
//			}
//			
//			if(!sendNmValid) {
//				reqVo.put("FlagSend", "E");
//				reqVo.put("Content", "발신자번호 제한");
//				return reqVo;    		 
//			}
			
			
//			SMSreqVo.put("tel_no", sendNm);
			
//			int resultCnt = telNumberConfirmService.bizTongConfirmListTelNumber(SMSreqVo);
//			if (resultCnt == 0){
//				reqVo.put("FlagSend", "E");
//				reqVo.put("Content", "발신자번호 제한");
//				return reqVo;   
//			}
			
			
			//20170817 bill36524 발신자번호 제한에 따른 발신 불가 처리  끝
			
			
			reqVo.put("msg_type", msg_type); //메시지 타입
			reqVo.put("msg_title", title); //메시지 제목
			reqVo.put("msg_content", content); //메시지 내용
			reqVo.put("send_num", sendNm); //발신자 전화번호
			reqVo.put("recv_num", receNm); //수신자 전화번호
			reqVo.put("recv_cont", "1"); //수신자 수
			
			reqVo.put("company_code", SMSreqVo.getString("companyCode")); //회사코드
			reqVo.put("msg_form_id", msg_form_id);
			
			reqVo.put("userId", SMSreqVo.getString("userId"));
			reqVo.put("userIp", SMSreqVo.getString("regIp"));

			reqVo.put("batch_id", smsDao.getSmsBatchId());
			
			reqVo.put("template_code", template_code);
			/*smsDao.insertSmsQueue(reqVo);
			smsDao.insertSmsQueueReceiver(reqVo);			*/
			
			smsDao.insertReSmsSendZo_Ezrems(reqVo);
			
			
			//카카오톡 주석 처리 (table 없음)
//            if(SMSreqVo.getString("send_type").equals("K")){
//                smsDao.insertKakaoAlimTalk(reqVo);
//            }else{
                smsDao.insertSmsQueueZo(reqVo);
                smsDao.insertSmsQueueReceiverZo(reqVo);
//            }
	    	 
			reqVo.put("FlagSend", "OK");
			reqVo.put("Content", "전송 완료");
			
						
		} catch (Exception e) {
			reqVo.put("FlagSend", "E");
			reqVo.put("Content", "오류 발생");
			
			logger.error(e); //e.printStackTrace();
		}
    	
    	return reqVo;
    }
	public  CmMap send(String sendNm, String receNm, String title, String content) {
		CmMap reqVo = new CmMap();
		String msg_type ="1";  	
		boolean result = true;
    	
		try {
			if ( content.getBytes().length < 80 ){
				//SMS
	    		msg_type = "1";
			}else{
				//LMS
				msg_type = "2";
			}
			
			sendNm = sendNm.replace("-", "");
			sendNm = sendNm.replace("-", "");
			sendNm = sendNm.replace("-", "");
			sendNm = sendNm.replace("-", "");
			 
			receNm = receNm.replace("-", "");
			receNm = receNm.replace("-", "");
			receNm = receNm.replace("-", "");
			receNm = receNm.replace("-", "");
	 
			if (sendNm == null || sendNm.equals("")){
				try {
					Properties props = Resources.getResourceAsProperties("ezREMS.properties");
					sendNm = CmFunction.getStringValue(props.getProperty("SEND_SMS"));
				} catch (Exception e) {
					//System.out.println("### CmSMS Properties ###");
					logger.error(e); //e.printStackTrace();
				}
			}
	 
	 
			if (receNm.length() <= 8 ){    		 
				reqVo.put("FlagSend", "E");
				reqVo.put("Content", "수신자 번호 자릿수 오류");
				return reqVo;
			}
	 
			if (receNm.substring(0, 3).equals("010") ||
					receNm.substring(0, 3).equals("011") ||
					receNm.substring(0, 3).equals("016") ||
					receNm.substring(0, 3).equals("017") ||
					receNm.substring(0, 3).equals("019") ) {
				// 정상
	
			} else{
				reqVo.put("FlagSend", "E");
				reqVo.put("Content", "수신자 번호 오류");
				return reqVo;
			}
	
			if (content == null || content.equals("")){
				reqVo.put("FlagSend", "E");
				reqVo.put("Content", "메시지 없음");
				return reqVo;    		 
			}

			//20170817 bill36524 발신자번호 제한에 따른 발신 불가 처리  시작
			boolean sendNmValid = false;
			
			CmMap reqCompMap = new CmMap();
			String daoname = "BICOMM_Dao.SMS_SENDNM_LIST.select";
			List<CmResMap> smsnmList = commonDao.XmlSelectsql(daoname, reqCompMap);
			if (smsnmList.size() > 0){
				Iterator itr = smsnmList.iterator();
				while(itr.hasNext()) {
					LinkedHashMap cmResMap = (LinkedHashMap) itr.next();
					if(cmResMap.get("sendnm").toString().equals(sendNm)) {
						sendNmValid = true;
					}
				}
			}
			
			if(!sendNmValid) {
				reqVo.put("FlagSend", "E");
				reqVo.put("Content", "발신자번호 제한");
				return reqVo;    		 
			}
			
			
			//20170817 bill36524 발신자번호 제한에 따른 발신 불가 처리  끝

			
			
			reqVo.put("msg_type", msg_type); //메시지 타입
			reqVo.put("msg_title", title); //메시지 제목
			reqVo.put("msg_content", content); //메시지 내용
			reqVo.put("send_num", sendNm); //발신자 전화번호
			reqVo.put("recv_num", receNm); //수신자 전화번호
			reqVo.put("recv_cont", "1"); //수신자 수
			 
			smsDao.insertSmsQueue(reqVo);
			smsDao.insertSmsQueueReceiver(reqVo);			
	    	 
			reqVo.put("FlagSend", "OK");
			reqVo.put("Content", "전송 완료");
    	
		} catch (Exception e) {
			reqVo.put("FlagSend", "E");
			reqVo.put("Content", "오류 발생");
			
			logger.error(e); //e.printStackTrace();
		}
    	
    	return reqVo;
    }
	
	
	//발송정보를 저장하게 변경함
	public  CmMap sendZo(String sendNm, String receNm, String title, String content, String companyCode, String projCode, String formId, String userId, String userIp, String reserveYN, String reserveDT) {
		CmMap reqVo = new CmMap();
		String msg_type ="1";  	
		boolean result = true;
    	
		try {
			if ( content.getBytes().length < 80 ){
				//SMS
	    		msg_type = "1";
			}else{
				//LMS
				msg_type = "2";
			}
			
			sendNm = sendNm.replace("-", "");
			sendNm = sendNm.replace("-", "");
			sendNm = sendNm.replace("-", "");
			sendNm = sendNm.replace("-", "");
			 
			receNm = receNm.replace("-", "");
			receNm = receNm.replace("-", "");
			receNm = receNm.replace("-", "");
			receNm = receNm.replace("-", "");
	 
			if (sendNm == null || sendNm.equals("")){
				try {
					Properties props = Resources.getResourceAsProperties("ezREMS.properties");
					sendNm = CmFunction.getStringValue(props.getProperty("SEND_SMS"));
				} catch (Exception e) {
					//System.out.println("### CmSMS Properties ###");
					logger.error(e); //e.printStackTrace();
				}
			}
	 
	 
			if (receNm.length() <= 8 ){    		 
				reqVo.put("FlagSend", "E");
				reqVo.put("Content", "수신자 번호 자릿수 오류");
				return reqVo;
			}
	 
			if (receNm.substring(0, 3).equals("010") ||
					receNm.substring(0, 3).equals("011") ||
					receNm.substring(0, 3).equals("016") ||
					receNm.substring(0, 3).equals("017") ||
					receNm.substring(0, 3).equals("019") ) {
				// 정상
	
			} else{
				reqVo.put("FlagSend", "E");
				reqVo.put("Content", "수신자 번호 오류");
				return reqVo;
			}
	
			if (content == null || content.equals("")){
				reqVo.put("FlagSend", "E");
				reqVo.put("Content", "메시지 없음");
				return reqVo;    		 
			}

			//20170817 bill36524 발신자번호 제한에 따른 발신 불가 처리  시작
			boolean sendNmValid = false;
			
			CmMap reqCompMap = new CmMap();
			String daoname = "BICOMM_Dao.SMS_SENDNM_LIST.select";
			List<CmResMap> smsnmList = commonDao.XmlSelectsql(daoname, reqCompMap);
			if (smsnmList.size() > 0){
				Iterator itr = smsnmList.iterator();
				while(itr.hasNext()) {
					LinkedHashMap cmResMap = (LinkedHashMap) itr.next();
					if(cmResMap.get("sendnm").toString().equals(sendNm)) {
						sendNmValid = true;
					}
				}
			}
			
			if(!sendNmValid) {
				reqVo.put("FlagSend", "E");
				reqVo.put("Content", "발신자번호 제한");
				return reqVo;    		 
			}
			//20170817 bill36524 발신자번호 제한에 따른 발신 불가 처리  끝

			
			reqVo.put("msg_type", msg_type); //메시지 타입
			reqVo.put("msg_title", title); //메시지 제목
			reqVo.put("msg_content", content); //메시지 내용
			reqVo.put("send_num", sendNm); //발신자 전화번호
			reqVo.put("recv_num", receNm); //수신자 전화번호
			reqVo.put("recv_cont", "1"); //수신자 수

			reqVo.put("company_code", companyCode); //회사코드
			reqVo.put("proj_code", projCode); //사업지코드
			reqVo.put("form_id", formId);
			reqVo.put("userId", userId);
			reqVo.put("userIp", userIp);
			reqVo.put("reserve_dt", reserveDT);

			reqVo.put("batch_id", smsDao.getSmsBatchId());

			if(reserveYN.equals("Y")) {
				smsDao.insertSmsReserve(reqVo);
				reqVo.put("FlagSend", "OK");
				reqVo.put("Content", "예약 완료");
			} else {
				smsDao.insertSmsQueueZo(reqVo);
				smsDao.insertSmsQueueReceiverZo(reqVo);	
				smsDao.insertReSmsSendZo(reqVo);
				reqVo.put("FlagSend", "OK");
				reqVo.put("Content", "전송 완료");
			}
	    	 
    	
		} catch (Exception e) {
			reqVo.put("FlagSend", "E");
			reqVo.put("Content", "오류 발생");
			
			logger.error(e); //e.printStackTrace();
		}
    	
    	return reqVo;
    }

	
	//베치
	public void batchSendZo() {
		
		String sendNm = "";
    	String receNm = "";
    	String title = "";
    	String content = "";
    	String companyCode = "";
    	String projCode = "";
    	String formId = "";
    	String userId = "";
    	String userIp = "";
    	String chkDatetime = "";
    	//보낼 데이터 가져오기
    	List<CmResMap> smsList = smsDao.getSmsReserveList();
    	for(int i=0; i<smsList.size(); i++) {
    		sendNm = smsList.get(i).getString("send_num");
    		receNm = smsList.get(i).getString("recv_num");
        	title = smsList.get(i).getString("msg_title");
        	content = smsList.get(i).getString("msg_content");
        	companyCode = smsList.get(i).getString("company_code");
        	projCode = smsList.get(i).getString("proj_code");
        	formId = smsList.get(i).getString("form_id");
        	userId = smsList.get(i).getString("row_input_id");
        	userIp = smsList.get(i).getString("row_input_ip");
        	
        	CmMap reqVo = new CmMap();
    		String msg_type ="1";  	
        	
    		try {
    			if ( content.getBytes().length < 80 ){
    				//SMS
    	    		msg_type = "1";
    			}else{
    				//LMS
    				msg_type = "2";
    			}
    			
    			sendNm = sendNm.replace("-", "");
    			sendNm = sendNm.replace("-", "");
    			sendNm = sendNm.replace("-", "");
    			sendNm = sendNm.replace("-", "");
    			 
    			receNm = receNm.replace("-", "");
    			receNm = receNm.replace("-", "");
    			receNm = receNm.replace("-", "");
    			receNm = receNm.replace("-", "");
    	 
    			if (sendNm == null || sendNm.equals("")){
    				try {
    					Properties props = Resources.getResourceAsProperties("ezREMS.properties");
    					sendNm = CmFunction.getStringValue(props.getProperty("SEND_SMS"));
    				} catch (Exception e) {
    					///System.out.println("### CmSMS Properties ###");
    					logger.error(e); //e.printStackTrace();
    				}
    			}
    	 
    	 
    			if (receNm.length() <= 8 ){    		 
    				return;
    			}
    	 
    			if (receNm.substring(0, 3).equals("010") ||
    					receNm.substring(0, 3).equals("011") ||
    					receNm.substring(0, 3).equals("016") ||
    					receNm.substring(0, 3).equals("017") ||
    					receNm.substring(0, 3).equals("019") ) {
    				// 정상
    	
    			} else{
    				return;
    			}
    	
    			if (content == null || content.equals("")){
    				return;    		 
    			}
    	 
    			reqVo.put("msg_type", msg_type); //메시지 타입
    			reqVo.put("msg_title", title); //메시지 제목
    			reqVo.put("msg_content", content); //메시지 내용
    			reqVo.put("send_num", sendNm); //발신자 전화번호
    			reqVo.put("recv_num", receNm); //수신자 전화번호
    			reqVo.put("recv_cont", "1"); //수신자 수

    			reqVo.put("company_code", companyCode); //회사코드
    			reqVo.put("proj_code", projCode); //사업지코드
    			reqVo.put("form_id", formId);
    			reqVo.put("userId", userId);
    			reqVo.put("userIp", userIp);
    			
    			reqVo.put("batch_id", smsDao.getSmsBatchId());
    			
				smsDao.insertSmsQueueZo(reqVo);
				smsDao.insertSmsQueueReceiverZo(reqVo);
				smsDao.insertReSmsSendZo(reqVo);
    	    
    		} catch (Exception e) {
    			logger.error(e); //e.printStackTrace();
    		}
        	chkDatetime = smsList.get(i).getString("cnk_datetime");
    	}

    	if(smsList.size() > 0) {
    		CmMap reqVo = new CmMap();
    		reqVo.put("chk_datetime", chkDatetime);
    		smsDao.deleteSmsReserveList(reqVo);
    	}
    }
	
}