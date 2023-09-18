package apps.homepage.common.utils.core.push;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import apps.framework.object.CmMap;

import com.google.android.gcm.server.Message;
import com.google.android.gcm.server.MulticastResult;
import com.google.android.gcm.server.Result;
import com.google.android.gcm.server.Sender;

public class GcmSender {
	
	private Sender sender;
	
	public GcmSender(String gcmKey) {
		sender = new Sender(gcmKey); 
	}

	public PushResult send(CmMap pushData, String pushId) throws Exception {
		Message message = createMessage(pushData);
		Result result = sender.send(message, pushId, 0);
		return getResult(result);
	}

	public List<PushResult> send(CmMap pushData, List<String> pushIds) throws Exception {
		
		Message message = createMessage(pushData);
		MulticastResult mResult = sender.send(message, pushIds, 0);
		
		List<PushResult> pushResultList = null;
		
		if(mResult.getTotal() > 0) {
			pushResultList = new ArrayList<PushResult>();

			List<Result> resultList = mResult.getResults();
			for(Result result : resultList) {
				PushResult pushResult = getResult(result);
				pushResultList.add(pushResult);
			}
		}
		
		return pushResultList;
	}
	
	private Message createMessage(CmMap pushData) {
		return new Message.Builder()
				.collapseKey(String.valueOf(Math.random() % 100 + 1))
				.addData("title", pushData.getString("title"))				
				.addData("pushContents", pushData.getString("contents"))	
				//.addData("publishOpt", pushData.get(""))
				//.addData("imgType", pushData.get(""))
				//.addData("imgUrl", pushData.get(""))
				//.addData("pushMsgType", pushData.get(""))
				//.addData("statusBarImgType", pushData.get(""))
				//.addData("statusBarImgUrl", pushData.get(""))
				//.addData("smryText", pushData.get(""))
				//.addData("trgtUrl", pushData.get(""))
				.addData("badge", "0")
				.delayWhileIdle(false)
				.timeToLive(3600)
				.build();
	}
	
	private PushResult getResult(Result result) {
		PushResult pushResult = null;
		
		if(result.getErrorCodeName() == null) 	pushResult = new PushResult("SUCCESS", null);	
		else									pushResult = new PushResult("FAIL", result.getErrorCodeName());	
		
		return pushResult;
	}
	
}

