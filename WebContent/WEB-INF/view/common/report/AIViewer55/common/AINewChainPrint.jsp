<%@ page language="java" import="java.sql.*,java.io.*,java.lang.*,java.text.*,java.net.*,java.util.*" %>
<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import="com.activeintra.manager.*" %>
<%@ page import="org.apache.log4j.Logger" %>

<%
    out.clear();
    out=pageContext.pushBody();

    final Logger logger = Logger.getLogger("com.activeintra");

    try{

        HttpParameterDecoder decoder = HttpParameterDecoder.newInstance(request, application);
        request.setAttribute("paramsDecoder", decoder);

        AIScriptManager manager = new AIScriptManager(request, response, pageContext, out, logger, null);
        if(manager.init()){

            Enumeration keys=AIScriptManager.aiProps.propertyNames();
            while(keys.hasMoreElements()){

                String key=(String)keys.nextElement();
                String value=AIScriptManager.aiProps.getProperties(key);
                manager.reqres.setParam(key,value);

            }
            AINewPdfMerge pdfMerge = new AINewPdfMerge(pageContext,request,response,logger, manager.reqres);
            pdfMerge.runMerge(out);
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