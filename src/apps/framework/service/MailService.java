package apps.framework.service;

import apps.framework.object.CmMailVo;
import apps.framework.object.CmMap;
import apps.framework.utils.email.CmMail;
import apps.homepage.common.dao.core.CommDao;
import apps.homepage.common.dao.custom.sign.SignDao;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Map;


@Service
@SuppressWarnings("rawtypes")
public class MailService  extends CmService  {
	
	@Autowired
	private SignDao adminSignDao;	
	
	/** The Constant logger. */
	protected final Log	logger = LogFactory.getLog(this.getClass());
	

	@Autowired
	private CommDao commDao;
	
	/*
	 * 메일발송 CmMail.send 호출
	 * 히스토리 insert
	 * */
	public void mailSend(CmMap reqVo , Map<String, Object> model) {
		// TODO Auto-generated method stub

		/*String fromName = (String)reqVo.get("company_code");*/
		String fromName  =	"[SignON]";
		String fromEmail =	"no-reply@signon.kr";
		String to = (String)reqVo.get("to");
		String cc = "";
		String title = (String)reqVo.get("title");
		String content = (String)reqVo.get("contents");
		
		CmMailVo mailvo = new CmMailVo();
		
		String[] content_file_list;					
		String content_file = "";		
		
		try {
			content_file = (String)reqVo.get("email_file") + ";" + (String)reqVo.get("awrt_anth_img_path");					
			content_file_list = content_file.split(";");
	
			mailvo = CmMail.send(fromName, fromEmail, to, cc, title, content,content_file_list);
			
			reqVo.put("mail_flag", mailvo.getFlagSend());
			reqVo.put("send_email", fromEmail);
			reqVo.put("email_title", title);
			reqVo.put("contents", content);			
			reqVo.put("to", (String)reqVo.get("user_email"));
		
			adminSignDao.insertemaillog(reqVo);	
			} catch (Exception e) {
				e.printStackTrace();
				logger.error(e);
				model.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
				model.put("message", e.getLocalizedMessage());				
			}

	}

}
