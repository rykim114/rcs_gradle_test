<%@ page language="java" import="java.sql.*,java.io.*,java.lang.*,java.text.*,java.net.*,java.util.*" %>
<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import="com.activeintra.manager.*" %>
<%@ page import="org.apache.log4j.Logger" %>

<%

    final Logger logger = Logger.getLogger("com.activeintra");

    try{

        AIScriptManager manager = new AIScriptManager(request, response, pageContext, out, logger, null);
        if(manager.init()){
            //AIReport.properties에서 각종 option을 읽어 AIreqres객체의 각종member에 해당 값을 setting.
            Enumeration keys=AIScriptManager.aiProps.propertyNames();
            while(keys.hasMoreElements()){

                String key=(String)keys.nextElement();
                String value=AIScriptManager.aiProps.getProperties(key);
                manager.reqres.setParam(key,value);

            }
            manager.setParam(manager.reqres.getParameterB("chainReportParams"));

            AIHtmlMerge htmlMerge = new AIHtmlMerge(manager.reqres);
            htmlMerge.runMerge(out);
        }
        else{
            throw new Exception("manager init error");
        }

    }
    catch(IOException e){
        logger.error("#9997 " + e);
    }
    catch(NullPointerException e){
        logger.error("#9998 " + e);
    }
    catch(Exception e){
        logger.error("#9999 " + e);
    }
    finally{

    }

%>