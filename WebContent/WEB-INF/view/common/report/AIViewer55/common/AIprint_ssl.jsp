<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="utf-8" import="java.util.*, java.io.*, java.net.*" %>
<%@ page import="org.apache.log4j.Logger" %>
<%@ page import="com.activeintra.manager.*"%>

<%@ page import = "javax.net.ssl.HostnameVerifier" %>
<%@ page import = "javax.net.ssl.HttpsURLConnection" %>
<%@ page import = "javax.net.ssl.SSLContext" %>
<%@ page import = "javax.net.ssl.SSLSession" %>
<%@ page import = "javax.net.ssl.TrustManager" %>
<%@ page import = "javax.net.ssl.X509TrustManager" %>
<%@ page import = "java.security.KeyManagementException" %>
<%@ page import = "java.security.NoSuchAlgorithmException" %>
<%@ page import = "java.security.cert.X509Certificate" %>


<%!

	final Logger logger = Logger.getLogger("com.activeintra");
	String charSet=null;

	private BufferedInputStream getPdfFile(String filename) throws Exception {
		BufferedReader  reader = null;
		BufferedInputStream bis = null;
		try {
			bis = new BufferedInputStream(new FileInputStream(filename));
			
		} catch (Exception e) {
			logger.error("#9010 pdffile open error");
			logger.error("#9020 " + e);
			throw new Exception(e);
		}
		finally{
			
		}
		
		return bis;
	}

	private String toKor(String s){
		if(s==null){
			return ""; 
		}
		
		try{
			return new String(s.getBytes(charSet),"UTF-8");
		}catch(Exception e){
			return s;
		}
		finally{
			
		}
	}
	
	public byte[] readStreamAll(InputStream in){
	       
		ByteArrayOutputStream out = new ByteArrayOutputStream(1024);
        final int capa = 512;
        byte[] data = new byte[capa];
        BufferedInputStream bin = new BufferedInputStream(in, capa);
        int reads;
        try {
			while ((reads = bin.read(data, 0, capa)) != -1) {
				out.write(data, 0, reads);
			}
		} catch (IOException e) {
			logger.error("#9030 " + e);
		}
		finally{
			
		}
        return out.toByteArray();
    }
	
	private boolean getCommHTTPS() {
		try {
			/*
		     *  fix for
		     *    Exception in thread "main" javax.net.ssl.SSLHandshakeException:
		     *       sun.security.validator.ValidatorException:
		     *           PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException:
		     *               unable to find valid certification path to requested target
		     */
			TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
				public java.security.cert.X509Certificate[] getAcceptedIssuers() {
					return null;
				}

				public void checkClientTrusted(X509Certificate[] certs, String authType) {
				}

				public void checkServerTrusted(X509Certificate[] certs, String authType) {
				}
			} };
			SSLContext sslcontext = null;
			sslcontext = SSLContext.getInstance("TLS");
			sslcontext.init(null, trustAllCerts, new java.security.SecureRandom());
		    HttpsURLConnection.setDefaultSSLSocketFactory(sslcontext.getSocketFactory());
		    // Create all-trusting host name verifier
		    HostnameVerifier allHostsValid = new HostnameVerifier() {
		        public boolean verify(String hostname, SSLSession session) {
		          return true;
		        }
		    };
		    // Install the all-trusting host verifier
		    HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
		} catch (KeyManagementException e) {
			// TODO Auto-generated catch block
		}
		return true;
	}

%>

<%
	try {
		AIScriptManager manager = new AIScriptManager(request, response, pageContext, out, logger, null);
        
		charSet=AIScriptManager.aiProps.getProperties("charSetEncoding");
         
		if(charSet==null)
			charSet="8859_1";

		String reportFlag=toKor(request.getParameter("reportFlag"));
		//String requestMethod=AIScriptManager.aiProps.getProperties("parameterTranferMethod");
        String requestMethod=request.getMethod();
		if(requestMethod==null)
			requestMethod="GET";
		
        if(reportFlag==null)
            reportFlag="";
		if(!reportFlag.equals("pdfserversave")){
			
			out.clear();
			out=pageContext.pushBody();
		}

		String filename = request.getParameter("nameTag");
		if(filename==null){
		
			filename = request.getParameter("key");

            //URLDecoding이 않된경우 처리
            if(filename.indexOf("+") == -1)
                filename=URLDecoder.decode(filename, "UTF-8");

			String reportUrl = manager.getReportUrl(filename);

            String domainName=AIScriptManager.aiProps.getProperties("domainName");
            String ipAddress=AIScriptManager.aiProps.getProperties("ipAddress");
            if(domainName!=null && ipAddress!=null)
                reportUrl=reportUrl.replace(domainName,ipAddress);

			//logger.error("#9040 " + "reportUrl " + reportUrl);

            String splitUrl[]=reportUrl.split("/");
            StringBuffer realUrl= new StringBuffer();
            for(int i=3; i<splitUrl.length; i++){
                realUrl.append("/");
                realUrl.append(splitUrl[i]);
            }

            if(AIScriptManager.aiProps.getProperties("domainNameToLocalIpAddress") !=null &&
                    AIScriptManager.aiProps.getProperties("domainNameToLocalIpAddress").equals("false")){
                    reportUrl=reportUrl.replace("https","http");
            }
            else{
                String ipAddr = "http://" +  "127.0.0.1:" + request.getLocalPort();
                //reportUrl = ipAddr + realUrl;
            }

            /*
            //dispatcher.forward구간 시작
            String parameter = manager.getReportParameters(filename, "UTF-8");

            System.out.println(parameter);

            ServletContext context = pageContext.getServletContext();
            String contextName=context.getContext(realUrl.toString()).getContextPath();

            //url에서 context name를 삭제함
            String forwardUrl = null;
            if(!contextName.equals("/")){
                forwardUrl = realUrl.toString().replaceFirst(contextName, "");
            }
            else
                forwardUrl = realUrl.toString();

            if(requestMethod.equals("POST"))
                forwardUrl=forwardUrl+"?"+parameter;
            RequestDispatcher dispatcher = request.getRequestDispatcher(forwardUrl);
            dispatcher.forward(request, response);
            //dispatcher.forward구간 end
            */

            //logger.error(reportUrl);
            //urlConnection구간 시작
            //logger.debug("AI REPORT URL ==="+reportUrl);
            //KDY
            //reportUrl = reportUrl.replace("10.205.0.104","10.205.0.105");
            if (!getCommHTTPS()) {
            	logger.error("SSL Exception Error!!!!!!!");
            }
			HttpURLConnection conn = null;
			conn = (HttpURLConnection) new URL(reportUrl).openConnection();
			if(!requestMethod.toUpperCase().equals("GET"))
				conn.setRequestMethod("POST");
			else
				conn.setRequestMethod("GET");
			
			conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=" + "utf-8");
			conn.setRequestProperty("user-agent", request.getHeader("user-agent"));
		
			conn.setUseCaches(false);
			conn.setDoOutput(true);
			conn.setDoInput(true);
			
			if(request.getCookies()!=null){
				
				Iterator<Cookie> iHeader = java.util.Arrays.asList(
						request.getCookies()).iterator();
 
				StringBuffer buf = new StringBuffer();
				while (iHeader.hasNext()) {
	
					Cookie cookie = (Cookie) iHeader.next();
	     
					if (!cookie.getValue().equals("")) {
						buf.append(cookie.getName());
						buf.append("=");
						buf.append(cookie.getValue());
						buf.append("; ");
					}
				}
			
				conn.setRequestProperty("Cookie", buf.toString());
					
			}
			
			if(!requestMethod.toUpperCase().equals("GET")){
				
				String parameter = manager.getReportParameters(filename, "UTF-8");
				PrintWriter pw=new PrintWriter(new OutputStreamWriter(conn.getOutputStream(),"utf-8"));
				
				pw.write(parameter);
				pw.flush();
				pw.close();
				
				//logger.error("#9050 " + "parameter " + parameter);
				
			}


			int resultCode = conn.getResponseCode();
			if (resultCode != 200) { // 보고서 호출 결과가 성공이 아닌 경우
				logger.error("#9060 " + "url request responded with code[" + resultCode + "]");
                logger.error("#9061 " + "url=[" + reportUrl + "]");

                response.setContentType("text/html; charset=UTF-8");
                BufferedOutputStream outs = new BufferedOutputStream(response.getOutputStream());
                outs.write("#9060 변환중 에라가 발생하였습니다...\n".getBytes("utf-8"));
                outs.write(String.format("error code : %d",resultCode).getBytes("utf-8"));
                outs.flush();
                outs.close();

				return;
			}

			if(!reportFlag.equals("pdfserversave")){

				String headerString=conn.getHeaderField("Content-Disposition");

				response.setContentType(conn.getContentType());
                String result="success";
                if(conn.getContentType().indexOf("text/html")!=-1)
                    result="fail";
                else
                    response.setHeader("Content-Disposition",headerString);

                //Cookie cookie = new Cookie("fileDownloadToken", result);
                //cookie.setMaxAge(60*60*24);                // 쿠키 유지 기간 - 1일
                //cookie.setPath("/");                       // 모든 경로에서 접근 가능하도록
                //cookie.setHttpOnly(false);
                //response.addCookie(cookie);

                String cookieValue="fileDownloadToken=" + result + "; Path=/";
                response.setHeader("Set-Cookie",cookieValue);

                java.io.BufferedOutputStream outs = new java.io.BufferedOutputStream(response.getOutputStream());
				
				byte[] data=readStreamAll(conn.getInputStream());
                response.setContentLength(data.length);

				outs.write(data);
				outs.flush();
				outs.close();

			}
			else{
				String data=new String(readStreamAll(conn.getInputStream()),"utf-8");
				out.print(data);
			}
			//urlConnection구간 end

			return;
			
		}

        //URLDecoding이 않된경우 처리
        if(filename.indexOf("+") == -1)
            filename=URLDecoder.decode(filename, "UTF-8");

		filename=manager.getDecryptString(filename);
		//logger.error("#9099 " +filename);
		
		response.setContentType("application/pdf");
		java.io.BufferedOutputStream outs = new java.io.BufferedOutputStream(response.getOutputStream());
		BufferedInputStream reader = getPdfFile(filename);
		
		byte[] b = new byte[1024];
		
		int read = 0;
		while( (read = reader.read(b)) != -1){
		
			outs.write(b,0,read);	
		}
		
		outs.close();
        
		reader.close();
	
	}
	catch(Exception e){
		logger.error("#9999 " + e);
	}
	finally{
	
	}
	

%>
