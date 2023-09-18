<%@ page language="java" import="java.sql.*,java.io.*,java.lang.*,java.text.*,java.net.*,java.util.*" %>
<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import="com.activeintra.manager.*" %>
<%@ page import="org.apache.log4j.Logger" %>

<%

    final Logger logger = Logger.getLogger("com.activeintra");

    try{

        out.clear();
        out = pageContext.pushBody();

        String result="success";
        AIScriptManager manager = new AIScriptManager(request, response, pageContext, out, logger, null);
        if(manager.init()){
            //AIReport.properties에서 각종 option을 읽어 AIreqres객체의 각종member에 해당 값을 setting.
            Enumeration keys=AIScriptManager.aiProps.propertyNames();
            while(keys.hasMoreElements()){

                String key=(String)keys.nextElement();
                String value=AIScriptManager.aiProps.getProperties(key);
                manager.reqres.setParam(key,value);

            }

            AIExcelMerge excelMerge = new AIExcelMerge(pageContext,request,response,logger, manager.reqres);
            excelMerge.runMerge();

            //Cookie cookie = new Cookie("fileDownloadToken", result);
            //cookie.setMaxAge(60*60*24);                // 쿠키 유지 기간 - 1일
            //cookie.setPath("/");                       // 모든 경로에서 접근 가능하도록
            //response.addCookie(cookie);

            String cookieValue="fileDownloadToken=" + result + "; Path=/";
            response.setHeader("Set-Cookie",cookieValue);
        }
        else{
            throw new Exception("manager init error");
        }

    }
    catch(Exception e){
        logger.error("#9999 " + e);
    }
    finally{

    }

%>
