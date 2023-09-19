package apps.homepage.common.utils.core.push;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONException;
import javapns.Push;
import javapns.communication.exceptions.KeystoreException;
import javapns.notification.PushNotificationBigPayload;
import javapns.notification.PushNotificationPayload;
import javapns.notification.PushedNotification;
import javapns.notification.PushedNotifications;
import javapns.notification.transmission.PushQueue;

public class ApnsSender {
	
	private static final Logger logger = LogManager.getLogger(ApnsSender.class);
	
	private PushQueue pushQueue;
	
	public ApnsSender() {
	}

	public ApnsSender(String p12Path, String p12Passwd) {
		try {
			File file = new File(p12Path);
			//System.out.println("file Name = " + file.getName());
			if (file.exists()) {
				pushQueue = Push.queue(p12Path, p12Passwd, true, 10);
				pushQueue.start();
			}
		} catch (KeystoreException e) {
			logger.error(e); //e.printStackTrace();
		}
	}
	
	private List<PushResult> getResult(PushedNotifications pushedNotifications) {
		List<PushResult> result = null;
		
		if(!pushedNotifications.isEmpty()) {
			result = new ArrayList<PushResult>();
			PushResult pushApnsResult = null;
			
			for(PushedNotification notification : pushedNotifications) {
				String resMsg = "";
				try{					
					resMsg = notification.getResponse().getMessage();
				}catch (Exception e) {
					if(notification.isSuccessful())	
						resMsg = "성공";
					else
						resMsg = "실패";
				}
				
				if(notification.isSuccessful())	pushApnsResult = new PushResult("SUCCESS", resMsg);	// 성공
				else 							pushApnsResult = new PushResult("FAIL", resMsg);	// 실패
				
				result.add(pushApnsResult);
				
			}
		}
		
		return result;
	}
	
	public PushResult send(Map<String, String> pushData, String pushId) throws Exception {
		// 메시지 생성
		PushNotificationBigPayload payload = createMessage(pushData);
		
		// 메시지 전송
		//System.out.println("data = " + payload);
		//System.out.println("pushId = " + pushId);
		pushQueue.add(payload, pushId);
		Thread.sleep(1000);
		// 메시지 결과
		PushedNotifications pushedNotifications = pushQueue.getPushedNotifications();
		List<PushResult> resultList = getResult(pushedNotifications);
		
		// 메시지 큐 클리어
		pushQueue.clearPushedNotifications();
		
		return resultList.get(0);
	}

	public List<PushResult> send(Map<String, String> pushData , List<String> pushIds) throws Exception {
		
		// 메시지 생성
		//PushNotificationBigPayload payload = createMessage(pushData);
		PushNotificationPayload payload = PushNotificationPayload.complex();
       
		payload.addAlert(pushData.get("title"));
		payload.addAlert(pushData.get("contents"));
        payload.addCustomDictionary("custom1", "1");
        payload.addCustomDictionary("custom2", 2);
		
		// 메시지 전송
		for(String pushId : pushIds) {
			//System.out.println("data = " + payload);
			//System.out.println("pushId = " + pushId);
			pushQueue.add(payload, pushId);
		}
		Thread.sleep(1000);
		// 메시지 결과
		PushedNotifications pushedNotifications = pushQueue.getPushedNotifications();
		List<PushResult> PushResult = getResult(pushedNotifications);
		
		// 메시지 큐 클리어
		pushQueue.clearPushedNotifications();
		
		return PushResult;
	}
	
	private PushNotificationBigPayload createMessage(Map<String, String> pushData) throws JSONException {
		PushNotificationBigPayload payload = PushNotificationBigPayload.complex();
		
		payload.addAlert(pushData.get("contents"));
        payload.addBadge(1);
        payload.getPayload().put("customMsg", "customMsg");
		
		return payload; 
	}
}
