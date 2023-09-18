package apps.framework.service;

import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.utils.CmPathInfo;
import apps.framework.utils.CmSecretUtil;
import apps.framework.utils.eForm;
import apps.homepage.common.dao.core.SendDao;


@Service
@SuppressWarnings("rawtypes")
public class SendService  extends CmService  {
	
	/** The Constant logger. */
	protected final Log	logger = LogFactory.getLog(this.getClass());
	

	@Autowired
	private SendDao sendDao;
	
	/**
	 * 메일발송건수 pms 전송 
	 *
	 * @param p the p
	 * @param rmap the rmap
	 * @return true, if successful
	 * @throws Exception the exception
	 */
	
	public void sendMailCountToPms() {
		
		//메일 발송 건수 전송 
		try {

			Date dDate = new Date();
			
			dDate = new Date(dDate.getTime()+(1000*60*60*24*-1));
			
			SimpleDateFormat dSdf = new SimpleDateFormat("yyyyMMdd", Locale.KOREA);
			
			String yesterday = dSdf.format(dDate);


			CmMap cm = new CmResMap();
			
			
			cm.put("s_date", yesterday);
			
			List<CmResMap> mailInfo = sendDao.selectEmailSendHistory(cm);

			JSONObject jsonObj = new JSONObject();
			
			jsonObj.put("table_name","sm_email");
			jsonObj.put("key_columns","email_seq");
			List li = new ArrayList();
			
			for(int i=0;i<mailInfo.size();i++) {
				CmResMap mailMp = mailInfo.get(i);

				JSONObject d_jsonObj = new JSONObject();
				d_jsonObj.put("email_seq"        , mailMp.getString("email_seq"));
				d_jsonObj.put("email_subject"    , mailMp.getString("email_subject"));
				d_jsonObj.put("email_note"       , mailMp.getString("email_note"));
				d_jsonObj.put("send_date"        , mailMp.getString("send_date"));
				d_jsonObj.put("row_input_date"   , mailMp.getString("row_input_date"));
				d_jsonObj.put("row_input_emp_no" , "mail");
				d_jsonObj.put("row_input_ip"     , "127.0.0.1");
				d_jsonObj.put("company_code"     , "101");
				d_jsonObj.put("proj_code"        , "100001");
				d_jsonObj.put("sell_code"        , "10");
				d_jsonObj.put("send_email"       , mailMp.getString("send_email"));
				
				li.add(d_jsonObj);
				
			}

			jsonObj.put("insert_data", li);
			
			if (mailInfo.size() > 0) {
				//CmMap extudata = new CmMap();
				
				//extudata.put("extudata", URLEncoder.encode(CmSecretUtil.encodeAES_Base64(jsonObj.toString(), CmPathInfo.getSECRET_AES_KEY()), "UTF-8"));
				logger.debug("extudata0==>"+CmPathInfo.getSECRET_AES_KEY());
				logger.debug("extudata1==>"+CmSecretUtil.encodeAES(jsonObj.toString(), CmPathInfo.getSECRET_AES_KEY()));
				logger.debug("extudata2==>"+URLEncoder.encode(CmSecretUtil.encodeAES(jsonObj.toString(), CmPathInfo.getSECRET_AES_KEY()), "UTF-8"));
				
				
				logger.debug("extudata9==>"+CmSecretUtil.decodeAES(CmSecretUtil.encodeAES(jsonObj.toString(), CmPathInfo.getSECRET_AES_KEY()),CmPathInfo.getSECRET_AES_KEY()));
				
				String extudata = "extudata="+URLEncoder.encode(CmSecretUtil.encodeAES(jsonObj.toString(), CmPathInfo.getSECRET_AES_KEY()), "UTF-8");
				
				eForm.AccessKey_send2("https://pms.ezrems.com/proc/procExternalServiceInsertUseData.do", extudata);
			}
			
		}catch(Exception e) {
			logger.debug(e);
		}
		
	}

	/**
	 * 문자건수 pms 전송 
	 *
	 * @param p the p
	 * @param rmap the rmap
	 * @return true, if successful
	 * @throws Exception the exception
	 */
	
	public void sendSmSCountToPms() {
		
		//메일 발송 건수 전송 
		try {

			Date dDate = new Date();
			
			dDate = new Date(dDate.getTime()+(1000*60*60*24*-1));
			//dDate = new Date(dDate.getTime());
			
			SimpleDateFormat dSdf = new SimpleDateFormat("yyyyMMdd", Locale.KOREA);
			
			String yesterday = dSdf.format(dDate);


			CmMap cm = new CmResMap();
			
			
			cm.put("s_date", yesterday);
			
			List<CmResMap> smsInfo = sendDao.selectSmSSendHistory(cm);

			JSONObject jsonObj = new JSONObject();
			
			jsonObj.put("table_name","cf_msg_send");
			jsonObj.put("key_columns","send_id");
			List li = new ArrayList();
			
			for(int i=0;i<smsInfo.size();i++) {
				CmResMap smsMp = smsInfo.get(i);

				JSONObject d_jsonObj = new JSONObject();
				
				
				d_jsonObj.put("send_id"       , smsMp.getString("send_id"));
				d_jsonObj.put("send_date"     , smsMp.getString("send_date"));
				d_jsonObj.put("rs_date"       , smsMp.getString("rs_date"));
				d_jsonObj.put("msg_type"      , smsMp.getString("msg_type"));
				d_jsonObj.put("msg_title"     , smsMp.getString("msg_title"));
				d_jsonObj.put("msg_content"   , smsMp.getString("msg_content"));
				d_jsonObj.put("send_num"      , smsMp.getString("send_num"));
				d_jsonObj.put("recv_num"      , smsMp.getString("recv_num"));
				d_jsonObj.put("send_stat"     , smsMp.getString("send_stat"));
				d_jsonObj.put("send_result"   , smsMp.getString("send_result"));
				d_jsonObj.put("sms_key"       , smsMp.getString("sms_key"));
				d_jsonObj.put("ex_col1"       , smsMp.getString("ex_col1"));
				d_jsonObj.put("ex_col2"       , smsMp.getString("ex_col2"));
				d_jsonObj.put("ex_col3"       , smsMp.getString("ex_col3"));
				d_jsonObj.put("company_code"  , "101");
				d_jsonObj.put("proj_code"     , "100001");
				d_jsonObj.put("sell_code"     , "10");
				
				li.add(d_jsonObj);
				
			}
			
			jsonObj.put("insert_data", li);
			
			if (smsInfo.size() > 0) {
				//CmMap extudata = new CmMap();
				
				//extudata.put("extudata", URLEncoder.encode(CmSecretUtil.encodeAES_Base64(jsonObj.toString(), CmPathInfo.getSECRET_AES_KEY()), "UTF-8"));
//				logger.debug("extudata0==>"+CmPathInfo.getSECRET_AES_KEY());
//				logger.debug("extudata1==>"+CmSecretUtil.encodeAES(jsonObj.toString(), CmPathInfo.getSECRET_AES_KEY()));
//				logger.debug("extudata2==>"+URLEncoder.encode(CmSecretUtil.encodeAES(jsonObj.toString(), CmPathInfo.getSECRET_AES_KEY()), "UTF-8"));
				
				
//				logger.debug("extudata9==>"+CmSecretUtil.decodeAES(CmSecretUtil.encodeAES(jsonObj.toString(), CmPathInfo.getSECRET_AES_KEY()),CmPathInfo.getSECRET_AES_KEY()));
				
				String extudata = "extudata="+URLEncoder.encode(CmSecretUtil.encodeAES(jsonObj.toString(), CmPathInfo.getSECRET_AES_KEY()), "UTF-8");
				
				eForm.AccessKey_send2("https://pms.ezrems.com/proc/procExternalServiceInsertUseData.do", extudata);
			}
			
		}catch(Exception e) {
			logger.debug(e);
		}
		
	}	
}
