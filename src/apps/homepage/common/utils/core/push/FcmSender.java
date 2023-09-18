package apps.homepage.common.utils.core.push;

import java.io.BufferedWriter;
import java.io.DataOutputStream;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.util.ArrayList;

import javax.net.ssl.HttpsURLConnection;

import ai.com.lowagie.text.List;
import apps.framework.object.CmResMap;

public class FcmSender {
	
	private static String fcmKey = "";
	private static String fcmUrl = "";
	
	public FcmSender(String key , String url) {
		fcmKey = key;
		fcmUrl = url;
	}
	
	public CmResMap send(String pushInfo) throws Exception {
		HttpsURLConnection con = null;
		URL obj = new URL(fcmUrl);
		con = (HttpsURLConnection) obj.openConnection();
		
		con.setRequestMethod("POST");
		
		// Set POST headers
		con.setRequestProperty("Authorization", "key="+fcmKey);
		con.setRequestProperty("Content-Type", "application/json;charset=UTF-8");
		
		// Send POST body
		con.setDoOutput(true);
		DataOutputStream wr = new DataOutputStream(con.getOutputStream());
		BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(wr, "UTF-8"));
		//System.out.println("pushInfo" + pushInfo.toString());
		writer.write(pushInfo);
		writer.close();
		wr.close();

		wr.flush();
		wr.close();
		
		con.getResponseCode();
		con.disconnect();
		//System.out.println("code = "+con.getResponseCode());
		
		CmResMap push_result = new CmResMap<>();
		push_result.put("code", con.getResponseCode());
		
		return push_result;
	}
}
