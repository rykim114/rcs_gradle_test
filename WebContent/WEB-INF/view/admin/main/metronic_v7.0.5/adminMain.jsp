<%@ page language="java" contentType="text/html; charset=UTF-8"	session="true" pageEncoding="utf-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="validator" uri="http://www.springmodules.org/tags/commons-validator"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui"%>

<%@ page import ="apps.framework.utils.CmPathInfo"%>

<%
	String _CompanyCode = (String) session.getAttribute("admin_companyCode");
	String _UserId		= (String) session.getAttribute("admin_userId");
	String _UserName	= (String) session.getAttribute("admin_userNm");
	/*
	String _PassDayCnt	= (String) session.getAttribute("passdaycnt");
	String _ContDayCnt	= (String) session.getAttribute("contdaycnt");
	*/
 %>
<!DOCTYPE html>

<%@ include file="/WEB-INF/view/admin/main/metronic_v7.0.5/header.jsp"%>

<!--begin::Content-->
<div class="content d-flex flex-column flex-column-fluid" id="kt_content"></div>
<!--end::Content-->
			
<%@ include file="/WEB-INF/view/admin/main/metronic_v7.0.5/footer.jsp"%>
