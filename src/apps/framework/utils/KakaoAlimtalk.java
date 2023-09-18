package apps.framework.utils;

import java.io.BufferedReader;
import java.io.BufferedWriter;
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

public class KakaoAlimtalk {
	
	private static final Log	logger = LogFactory.getLog(KakaoAlimtalk.class);
	
	// Result
		public static class Response {
	    	public Object  data    ;
	    	public String  code = "";
	    	public String  msg  = "";
	    	
	    }
		
		public static Response AccessKey_send(String address, Map<String, Object> data) throws Exception {

			HttpURLConnection conn = null;
			OutputStreamWriter out = null;
			
			try {
				
				//Proxy proxy = null;				
				
				//소켓일때
				//Proxy.Type type = Proxy.Type.SOCKS;
				//proxy = new Proxy(type, new InetSocketAddress(SOCKS_PROXY_HOST, SOCKS_PROXY_PORT));
				
				//http 일때
				//Proxy.Type type = Proxy.Type.HTTP;
				//proxy = new Proxy(type, new InetSocketAddress(HTTP_PROXY_HOST, HTTP_PROXY_PORT));
				//HttpURLConnection conn = (HttpURLConnection)url.openConnection(proxy);
				
				URL  url = new URL(address); 
				conn = (HttpURLConnection) url.openConnection();
				conn.setDefaultUseCaches(false);
				conn.setDoInput(true);
				conn.setDoOutput(true);
				conn.setRequestMethod("POST");
				
				conn.setRequestProperty("Content-type", "application/json");
				
				conn.connect();
				logger.info("Step1-connect Start");
				
				BufferedWriter bw;
				out = new OutputStreamWriter(conn.getOutputStream());
				bw = new BufferedWriter(out);
				//System.out.println("AccessKey_send write  =>"+getJsonStringFromMap(data));
				//logger.info("AccessKey_send write  =>"+getJsonStringFromMap(data));
				
				bw.write(getJsonStringFromMap(data));				
				bw.flush();
				bw.close();				
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
				//System.out.println("AccessKey_send ret  =>"+(bf.toString()));
				
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
		
		// Send
		public static Response send(String accessToken,String address, Map<String, Object> data) throws Exception {

			HttpURLConnection conn = null;
			OutputStreamWriter out = null;
			
			try {
				logger.info("address:" + address);
				URL  url = new URL(address); 
				conn = (HttpURLConnection) url.openConnection();
				conn.setDefaultUseCaches(false);
				conn.setDoInput(true);
				conn.setDoOutput(true);
				conn.setRequestMethod("POST");
				conn.setRequestProperty("Content-type", "application/json");
				conn.setRequestProperty("Authorization", "Basic " + accessToken);
				System.out.println("send accessToken  =>"+accessToken);
				conn.connect();
				logger.info("Step1-connect Start");
				//out = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
				BufferedWriter bw;
				out = new OutputStreamWriter(conn.getOutputStream());
				bw = new BufferedWriter(out);
				String temp_str = getJsonStringFromMap(data);
				if (temp_str.equals("{}")) temp_str = "";
				System.out.println("send write  =>"+temp_str);
				
				bw.write(temp_str);				
				bw.flush();
				bw.close();	
				
				/*out.write(makeParam(data));
				out.flush();*/
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
				
				//System.out.println("send ret  =>"+(bf.toString()));
				
				return parseRecv(bf.toString());
				
			} catch (Exception e) {
				logger.error("send Exception===>"+(new StringBuilder("send : exception ")).append(e.getMessage()).append("\r\n").append(e.getStackTrace().toString()).toString());
				return new Response();
			} finally {
				if (conn!=null) conn.disconnect();
				conn = null;
				out = null;
			}
		}
		
		
		public static Response sendget(String accessToken,String address, Map<String, Object> data) throws Exception {

			HttpURLConnection conn = null;
			OutputStreamWriter out = null;
			
			try {
				logger.info("address:" + address);
				URL  url = new URL(address); 
				conn = (HttpURLConnection) url.openConnection();
				/*conn.setDefaultUseCaches(false);
				conn.setDoInput(true);
				conn.setDoOutput(true);*/
				conn.setRequestMethod("GET");
				
				logger.info("Authorization , Basic " + accessToken);
				
				//conn.setRequestProperty("Content-type", "application/json");
				conn.setRequestProperty("Authorization", "Basic " + accessToken);
				//System.out.println("send accessToken  =>"+accessToken);
				conn.connect();
				logger.info("Step1-connect Start");

				/*BufferedWriter bw;
				out = new OutputStreamWriter(conn.getOutputStream());
				bw = new BufferedWriter(out);
				String temp_str = getJsonStringFromMap(data);
				if (temp_str.equals("{}")) temp_str = "";
				
				bw.write(temp_str);				
				bw.flush();
				bw.close();					
				out.close();*/
				
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
				
				//System.out.println("send ret  =>"+(bf.toString()));
				
				return parseRecv(bf.toString());
				
			} catch (Exception e) {
				logger.error("send Exception===>"+(new StringBuilder("send : exception ")).append(e.getMessage()).append("\r\n").append(e.getStackTrace().toString()).toString());
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
			try{
				JSONObject json = (JSONObject) new JSONParser().parse(result);
				recv.code = json.get("code").toString();
				recv.msg  = json.get("msg").toString();
				
				if (recv.msg.toString().equals("")){
					recv.msg  = (String) json.get("message");				
				}
			
				
				recv.data    =  json.get("data");
			} catch (Exception ex) {
				logger.error("parseRecv Exception===>"+(new StringBuilder("parseRecv : exception ")).append(ex.getMessage()).append("\r\n").append(ex.getStackTrace().toString()).toString());
			}
			return recv;
		}	
		
		
		
		public static String getJsonStringFromMap( Map<String, Object> map ) {

			JSONObject json = new JSONObject();
			for( Map.Entry<String, Object> entry : map.entrySet() ) {
				String key = entry.getKey();
				Object value = entry.getValue();
				json.put(key, value);
			}
			
			return json.toJSONString();
		}
}
