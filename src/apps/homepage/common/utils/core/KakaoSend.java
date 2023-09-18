package apps.homepage.common.utils.core;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Iterator;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;


import apps.framework.utils.CmFunction;

public class KakaoSend {
	
	private static final Log	logger = LogFactory.getLog(KakaoSend.class);
	
	// Result
		public static class Response {
	    	public Object  data    ;
	    	public String  errcode = "";
	    	public String  errmsg  = "";
	    }
		
		// Send
		public static Response send(String accessToken,String address, Map<String, Object> data) throws Exception {

			HttpURLConnection conn = null;
			OutputStreamWriter out = null;
			
			try {
				
				URL  url = new URL(address); 
				conn = (HttpURLConnection) url.openConnection();
				conn.setDefaultUseCaches(false);
				conn.setDoInput(true);
				conn.setDoOutput(true);
				conn.setRequestMethod("POST");
				conn.setRequestProperty("Authorization", "Bearer " + accessToken);
				conn.connect();
				logger.info("Step1-connect Start");
				out = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
				out.write(makeParam(data));
				out.flush();
				out.close();
				
				BufferedReader br = null;
				InputStream    is = null;
				String         line;
				int            respCode;
				
				if ( (respCode=conn.getResponseCode()) >= 400) {
					logger.info("ErrorCode:" + respCode + " " + conn.getResponseMessage());
					is = conn.getErrorStream();
				} else {
					is = conn.getInputStream();
				}
				br = new BufferedReader(new InputStreamReader(is,"UTF-8"));
				StringBuffer bf = new StringBuffer();
				while((line = br.readLine()) != null){
					bf.append(line.trim());
				}
				br.close();
				logger.info("Step2-connect End");
				return parseRecv(bf.toString());
				
			} catch (Exception e) {
				return new Response();
			} finally {
				if (conn!=null) conn.disconnect();
				conn = null;
				out = null;
			}
		}
		
		// Parameter Setting
		public static String makeParam(Map<String,Object> params) throws IOException {
			StringBuffer sb = new StringBuffer() ;
			if( params == null ) return "" ;
			for (Iterator<String> i = params.keySet().iterator() ; i.hasNext();){
				String key = i.next() ;
				sb.append( key + "=" + URLEncoder.encode(String.valueOf(params.get(key)),"UTF-8")) ;
				if (i.hasNext()) sb.append("&") ;
			}
			return sb.toString() ;
		}
		
		// Receive Parsing
		public static Response parseRecv (String result) throws Exception {
			Response recv = new Response();
			JSONObject json = (JSONObject) new JSONParser().parse(result);
			recv.errcode = (String) json.get("errcode");
			recv.errmsg  = (String) json.get("errmsg");
			recv.data    =  json.get("data");
			return recv;
		}	
}
