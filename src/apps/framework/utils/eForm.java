package apps.framework.utils;


import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;


public class eForm {
	
	
	private static final Log	logger = LogFactory.getLog(eForm.class);
	
	// Result
	public static class Response {
	   	public Object  data    ;
	   	public String  result_code = "";
	   	public String  message  = "";
	   	public String  result  = "";
	   	public String  access_token  = "";
	   	public String  rq_end_time  = "";
	   	public String  rq_start_time  = "";
	    	
	}
	

	public static Response AccessKey_send(String address,  String id, String key) throws Exception {
		
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
			//conn.setRequestProperty("Content-type", "application/json");
			conn.setRequestProperty("x-api-id", id);
			conn.setRequestProperty("x-api-key", key);
			
			conn.connect();
			logger.info("Step1-connect Start");
			
			BufferedWriter bw;
			out = new OutputStreamWriter(conn.getOutputStream());
			bw = new BufferedWriter(out);
			
			bw.write("");				
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
			logger.error(e);
			return new Response();
		} finally {
			if (conn!=null) conn.disconnect();
			conn = null;
			out = null;
		}
	}
	
	
	public static Response AccessKey_send(String address, String param) throws Exception {
		
		HttpURLConnection conn = null;		
		OutputStreamWriter out = null;
		
		try {
			
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
			
			bw.write(param);				
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
			logger.error(e);
			return new Response();
		} finally {
			if (conn!=null) conn.disconnect();
			conn = null;
			out = null;
		}
	}
	
	
	public static Response AccessKey_send2(String address, String param) throws Exception {
		
		HttpURLConnection conn = null;		
		OutputStreamWriter out = null;
		
		try {
			
			URL  url = new URL(address); 			
			conn = (HttpURLConnection) url.openConnection();			
			conn.setDefaultUseCaches(false);
			conn.setDoInput(true);
			conn.setDoOutput(true);
			conn.setRequestMethod("POST");						
			//conn.setRequestProperty("Content-type", "application/json");
			conn.setRequestProperty("Cache-Control","no-cache");
			conn.connect();
			logger.info("Step1-connect Start");
			
			BufferedWriter bw;
			out = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
			out.write(param);
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
			//System.out.println("AccessKey_send ret  =>"+(bf.toString()));
			
			logger.info("Step2-connect End");
			return parseRecv(bf.toString());
			
		} catch (Exception e) {
			logger.error(e);
			return new Response();
		} finally {
			if (conn!=null) conn.disconnect();
			conn = null;
			out = null;
		}
	}
	

	
	// Send
	public static Response send(String tkey, String accessToken,String address, String Method, JSONObject jdata) throws Exception {

		HttpURLConnection conn = null;
		OutputStreamWriter out = null;
		
		try {
			logger.info("address:" + address);
			URL  url = new URL(address); 
			conn = (HttpURLConnection) url.openConnection();
			conn.setDefaultUseCaches(false);
			conn.setDoInput(true);
			conn.setDoOutput(true);
			conn.setRequestMethod(Method);
			conn.setRequestProperty("Content-type", "application/json");
			conn.setRequestProperty("x-api-key", tkey);
			conn.setRequestProperty("x-access-token", accessToken);
			
			conn.connect();
			logger.info("Step1-connect Start");
			//out = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
			BufferedWriter bw;
			out = new OutputStreamWriter(conn.getOutputStream());
			bw = new BufferedWriter(out);
			
			if (jdata != null) {
				
				String temp_str = jdata.toString();			
				if (temp_str.equals("{}")) temp_str = "";
				//logger.info("send data==>"+temp_str);
				
				if (!temp_str.equals("")) {
					bw.write(temp_str);
				}
			}
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
	// Send
	public static CmMap send(String address, String accessToken, String Method) throws Exception {

		HttpURLConnection conn = null;
		OutputStreamWriter out = null;
		 
		try {
			logger.info("address:" + address);
			URL  url = new URL(address); 
			conn = (HttpURLConnection) url.openConnection();
			conn.setDefaultUseCaches(false);
			conn.setDoInput(true);
			conn.setDoOutput(true);
			conn.setRequestMethod(Method);
			//conn.setRequestProperty("Content-type", "application/json");
			conn.setRequestProperty("X-Auth-Token", accessToken);
			
			conn.connect();
			logger.info("Step1-connect Start");
			//out = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
			//BufferedWriter bw;
			//out = new OutputStreamWriter(conn.getOutputStream());
			//bw = new BufferedWriter(out);
			//
			//bw.write("");
			//
			//bw.flush();
			//bw.close();	
			
			/*out.write(makeParam(data));
			out.flush();*/
			//out.close();
			
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

			//logger.info(bf.toString());
			
			return reseiveDataToMap(bf.toString());
			
		} catch (Exception e) {
			logger.error("send Exception===>"+(new StringBuilder("send : exception ")).append(e.getMessage()).append("\r\n").append(e.getStackTrace().toString()).toString());
			return new CmResMap();
		} finally {
			if (conn!=null) conn.disconnect();
			conn = null;
			out = null;
		}
	}
	
	// Send
	public static Response MapOfsend(String tkey, String accessToken,String address, String Method,  Map<String, Object> data) throws Exception {

		HttpURLConnection conn = null;
		OutputStreamWriter out = null;
		
		try {
			logger.info("address:" + address);
			URL  url = new URL(address); 
			conn = (HttpURLConnection) url.openConnection();
			conn.setDefaultUseCaches(false);
			conn.setDoInput(true);
			//conn.setDoOutput(true);
			conn.setRequestMethod(Method);
			//conn.setRequestProperty("Content-type", "application/json");
			conn.setRequestProperty("x-api-key", tkey);
			conn.setRequestProperty("x-access-token", accessToken);
			// 컨트롤 캐쉬 설정
			conn.setRequestProperty("Cache-Control","no-cache");
			
	/*		conn.connect();
			logger.info("Step1-connect Start");
			//out = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
			
			out = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
			logger.info("send data==>"+makeParam(data));
			out.write(makeParam(data));
			
			
			out.flush();
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
	
	
	public static Response getSend(String tkey, String accessToken,String address) throws Exception {

		HttpURLConnection conn = null;
		OutputStreamWriter out = null;
		
		try {
			logger.info("address:" + address);
			URL  url = new URL(address); 
			conn = (HttpURLConnection) url.openConnection();
			conn.setDefaultUseCaches(false);
			conn.setDoInput(true);
			//conn.setDoOutput(true);
			conn.setRequestMethod("GET");
			conn.setRequestProperty("Accept", "application/zip");
			conn.setRequestProperty("x-api-key", tkey);
			conn.setRequestProperty("x-access-token", accessToken);
			// 컨트롤 캐쉬 설정
			conn.setRequestProperty("Cache-Control","no-cache");
			
			//conn.connect();
			logger.info("Step1-connect Start");
			//out = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
			
			/*		out = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
			logger.info("send data==>"+makeParam(data));
			out.write(makeParam(data));
			
			
			out.flush();
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
			logger.error("getSend Exception===>"+(new StringBuilder("getSend : exception ")).append(e.getMessage()).append("\r\n").append(e.getStackTrace().toString()).toString());
			e.printStackTrace();
			return new Response();
		} finally {
			if (conn!=null) conn.disconnect();
			conn = null;
			out = null;
		}
	}
	
	//public static boolean zipdownload(String tkey, String accessToken,String address, String fpath, String fname) throws Exception {
	public static boolean zipdownload(String address, String fpath, String fname) throws Exception {

		HttpURLConnection conn = null;
		OutputStreamWriter out = null;
		
		try {
			logger.info("address:" + address);
			URL  url = new URL(address); 
			conn = (HttpURLConnection) url.openConnection();
			conn.setDefaultUseCaches(false);
			conn.setDoInput(true);
			//conn.setDoOutput(true);
			conn.setRequestMethod("GET");
			conn.setRequestProperty("Accept", "application/zip");
			/*conn.setRequestProperty("x-api-key", tkey);
			conn.setRequestProperty("x-access-token", accessToken);*/
			// 컨트롤 캐쉬 설정
			conn.setRequestProperty("Cache-Control","no-cache");
			
			//conn.connect();
			logger.info("Step1-connect Start");
			//out = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
			
			/*		out = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
			logger.info("send data==>"+makeParam(data));
			out.write(makeParam(data));
			
			
			out.flush();
			out.close();*/
			
			
			BufferedReader br = null;
			InputStream    is = null;
			String         line;
			int            respCode;
			
			logger.info("getResponseCode"+conn.getResponseCode());
			if ( (respCode=conn.getResponseCode()) >= 400) {
				logger.info("ErrorCode:" + respCode + " " + conn.getResponseMessage());
				is = conn.getErrorStream();
			} else {
				is = conn.getInputStream();
			}
			//StringBuffer bf = new StringBuffer();
			FileOutputStream testFileOutputStream = new FileOutputStream(fpath+fname);
			byte[] buffer = new byte[4096];
			int byteLength = 0;
			
			
			while (-1 < (byteLength = is.read(buffer))) {
				testFileOutputStream.write(buffer, 0, byteLength);
			}
			
			testFileOutputStream.close();
/*			

			ZipFile zipFile = new ZipFile("E:/_Project/test.zip");
			Enumeration<? extends ZipEntry> entries = zipFile.entries();
			
			while (entries.hasMoreElements()) {
				ZipEntry entry = entries.nextElement();
				
				if (! entry.isDirectory()) {
					String entryName = entry.getName();					
					System.out.println("zip entry: " + entryName);
				}
			}
			*/
			logger.info("Step2-connect End");
			
//			System.out.println("send ret  =>"+(bf.toString()));
			
			return true;
			
		} catch (Exception e) {
			logger.error("send Exception===>"+(new StringBuilder("send : exception ")).append(e.getMessage()).append("\r\n").append(e.getStackTrace().toString()).toString());
			e.printStackTrace();
			return false;
		} finally {
			if (conn!=null) conn.disconnect();
			conn = null;
			out = null;
		}
	}
	
	
	
	
	//Parameter Setting
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

	public static Response parseRecv (String result) throws Exception {
		Response recv = new Response();
		try{
			if (result != null && !result.equals("")) {
				JSONObject json = (JSONObject) new JSONParser().parse(result);
				
				if (json.get("result_code") != null) {
					recv.result_code = json.get("result_code").toString();
				}else {
					recv.result_code = "0";
				}
				if (json.get("message") != null) {
					recv.message  = json.get("message").toString();
				}else {
					recv.message  = "";
				}
				
				if (json.get("result") != null) {

					JSONObject json_detail = (JSONObject) new JSONParser().parse(json.get("result").toString());

					if (json_detail.get("access_token") != null) {
						recv.access_token = json_detail.get("access_token").toString();
						recv.rq_start_time = json_detail.get("rq_start_time").toString();
						recv.rq_end_time = json_detail.get("rq_end_time").toString();
					}
				}
				recv.data = json;
			}else {
				recv.result_code = "0";
				recv.message  = "";
				recv.result  = "";
				recv.data = "";
			}
		
			
		} catch (Exception ex) {
		}
		return recv;
	}



	/*
	 * map 에 result data 전부 put
	 * */

	public static CmMap<String,Object> reseiveDataToMap (String result) throws Exception {
		CmMap mp = new CmResMap();
		try{
			
			//System.out.println(result);
			
			if (result != null && !result.equals("")) {
				JSONObject json = (JSONObject) new JSONParser().parse(result);
            
				Iterator iter = json.keySet().iterator();
				while (iter.hasNext()) {
					String key = (String) iter.next();
					
					//object to string
					String json_detail = json.get(key) + "";
					
					mp.put(key, json_detail);
					
				}
			}
		}catch (Exception ex) {
			ex.printStackTrace();
		}
		return mp;
	}


	public static List<CmMap<String,Object>> reseiveDataToList (String result) throws Exception {
		List<CmMap<String,Object>> li = new ArrayList<CmMap<String,Object>>();
		
		try{
			
			//System.out.println(result);
			
			if (result != null && !result.equals("")) {
				JSONArray jsonArray = (JSONArray) new JSONParser().parse(result);
				
				for(int i = 0;i<jsonArray.size();i++) {
					JSONObject jsonObj = (JSONObject)jsonArray.get(i);
					
					Iterator iter = jsonObj.keySet().iterator();
					CmMap mp = new CmResMap();
					while (iter.hasNext()) {
						String key = (String) iter.next();
						
						//object to string
						String json_detail = jsonObj.get(key) + "";
						
						mp.put(key, json_detail);
						
					}
					li.add(mp);
				}
			}
		}catch (Exception ex) {
			ex.printStackTrace();
		}
		return li;
	}
}
