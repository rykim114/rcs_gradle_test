package apps.homepage.common.service.core;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.service.CmService;
import apps.homepage.common.dao.core.PushDao;





@Service
@SuppressWarnings("rawtypes")
public class PushService extends CmService {
	
	/** The Constant logger. */
	protected final Log	logger = LogFactory.getLog(this.getClass());
	
	@Autowired
	private PushDao pushDao;
	
	public boolean PushSend(CmMap reqVo, HttpServletRequest request, HttpServletResponse response, Map<String, Object> model){
		
		boolean ret = true;
		String company_code = reqVo.getString("company_code");
		String proj_code = reqVo.getString("proj_code");
		String sell_code = reqVo.getString("sell_code");
		String push_gub  = reqVo.getString("push_gub");
		String userId  = reqVo.getString("userId");
		String userNm  = reqVo.getString("usernm");
		String dong = "";
		String floor = "";
		String ho = "";
		
		
		if (push_gub == null) {
			
			model.put("result", "ERROR");
			model.put("ERRCD", "push_gub null");
			model.put("message", "push_gub 구분없음");
			
			ret = false;
			return ret;		
		}
		
		if (userId == null || userId.equals("")){
			dong = reqVo.getString("dong");
			ho = reqVo.getString("ho");
			
			if (dong == null || ho == null || proj_code == null || dong.equals("") || ho.equals("") || proj_code.equals("") ){
				model.put("result", "ERROR");
				model.put("ERRCD", "user not info");
				model.put("message", "고객정보 없음");
				
				ret = false;
				return ret;	
			}else{
				List<CmResMap> userinfo = pushDao.selectUserInfo(reqVo);
				
				Iterator iterator = userinfo.iterator();
				while ( iterator.hasNext()){
					CmResMap cmResMap = (CmResMap) iterator.next();
					
					reqVo.put("userId", cmResMap.getString("cust_email"));
					sell_code = cmResMap.getString("sell_code");
					userNm = cmResMap.getString("cust_name");
					dong = cmResMap.getString("dong");					
					floor = cmResMap.getString("floor");
					ho = cmResMap.getString("ho2");
				}
			}
		}else{
			
			CmMap temp = new CmMap();
			temp.put("proj_code", proj_code);
			temp.put("userId", userId);
			List<CmResMap> userinfo = pushDao.selectUserInfo(temp);
			
			Iterator iterator = userinfo.iterator();
			while ( iterator.hasNext()){
				CmResMap cmResMap = (CmResMap) iterator.next();
				
				sell_code = cmResMap.getString("sell_code");
				userNm = cmResMap.getString("cust_name");
				dong = cmResMap.getString("dong");
				floor = cmResMap.getString("floor");
				ho = cmResMap.getString("ho");
			}
			
		}
		
		
		List<CmResMap> deviceInfo = pushDao.selectDeviceInfo(reqVo);
		
		if (deviceInfo == null || deviceInfo.size() == 0){
			model.put("result", "ERROR");
			model.put("ERRCD", "device info null");
			model.put("message", "device 정보 없음");
			
			ret = false;
			return ret;
		}
				
		
		CmResMap pushgubInfo =  pushDao.selectPushInfo(reqVo);
		
		String pushGubSendYN = "";
		if (pushgubInfo == null ){
			pushGubSendYN = "Y";
		}else{
			pushGubSendYN = pushgubInfo.getString("usr_yn");
			if (pushGubSendYN == null || pushGubSendYN.equals("")){
				pushGubSendYN = "Y";
			}
		}
		
		if (pushGubSendYN.equals("N")){
			model.put("result", "ERROR");
			model.put("ERRCD", "push No");
			model.put("message", "push 받지 않음");
			
			ret = false;
			return ret;
		}
		
		
		Iterator iterator = deviceInfo.iterator();
		while ( iterator.hasNext()){
			CmResMap cmResMap = (CmResMap) iterator.next();
			
			String device_id = cmResMap.getString("device_id");
			String device_os = cmResMap.getString("device_os");
			String device_os_version = cmResMap.getString("device_os_version");
			String device_uuid = cmResMap.getString("device_uuid");
			String push_type = "";
			
			if (device_os.equals("1")){
				push_type = "FCM";
			}else{
				push_type = "APNS";
			}
			
			CmMap temp = new CmMap();
			temp.put("company_code", "400");
			temp.put("proj_code", proj_code);
			temp.put("sell_code", sell_code);
			temp.put("dong", dong);
			temp.put("floor", floor);
			temp.put("ho", ho);
			temp.put("push_type", push_type);
			temp.put("userId", userId);
			temp.put("usernm", userNm);
			temp.put("device_id", device_id);
			temp.put("device_os", device_os);
			temp.put("device_os_version", device_os_version);
			temp.put("device_uuid", device_uuid);
			
			temp.put("status_return", "I");
			temp.put("push_gbn", "H"+push_gub);
			
			temp.put("userIp", request.getRemoteAddr());
			
			String push_title = reqVo.getString("push_title");
			String push_content = reqVo.getString("push_content");
			
			push_content = push_content.replaceAll("&lt;p&gt;", "");
			push_content = push_content.replaceAll("&lt;/p&gt;", "");
			push_content = push_content.replaceAll("&lt;br&gt;", "");
			push_content = push_content.replaceAll("&lt;/br&gt;", "");
			
			push_content = push_content.replaceAll("&#59;", ";");
			push_content = push_content.replaceAll("&lt;", "<");
			push_content = push_content.replaceAll("&gt;", ">");
			
			if (device_id.length() > 10) {
				
				if ( push_gub.equals("01")){
					// 무인우편택배
										
					if (push_title == null || push_title.equals("")) push_title =  "무인 우편/택배가 도착했습니다.";
					if (push_content == null || push_content.equals("")) push_title =  "무인 우편/택배가 도착했습니다.";
					temp.put("push_title", push_title);
					temp.put("push_content", push_content);
									
					pushDao.insertPush(temp);
				}else if ( push_gub.equals("02")){
					// 청구서 발송
				}else if ( push_gub.equals("03")){
					// 공지사항
				}else if ( push_gub.equals("04")){
					// 소식
				}else if ( push_gub.equals("05")){
					// 입주민장터
					
					
					if (push_title == null || push_title.equals("")) push_title =  "입주민장터 알림";
					if (push_content == null || push_content.equals("")) push_title =  "댓글이 추가되었습니다. 지금 확인하세요";
					temp.put("push_title", push_title);
					temp.put("push_content", push_content);
					
					 pushDao.insertPush(temp);
				}else if ( push_gub.equals("06")){
					// 1:1 문의
				}
				
				
			}else{
				// 디바이스 ID 없음
			}
		}
		
		return ret;
	}
}
