<%@ page language="java" import="java.sql.*,java.io.*,java.lang.*,java.text.*,java.net.*,java.util.*" %>
<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import="com.activeintra.manager.*" %>
<%@ page import="org.apache.log4j.Logger" %>

<%

    final Logger logger = Logger.getLogger("com.activeintra");

    try{

        String filename = request.getParameter("nameTag");

        if(filename!=null){
            out.clear();
            out=pageContext.pushBody();
        }

        AIScriptManager manager = new AIScriptManager(request, response, pageContext, out, logger, null);
        if(manager.init()){
            AIPdfMerge pdfMerge = new AIPdfMerge(pageContext,request,response,logger, manager.reqres);
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