<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ taglib prefix="botDetect" uri="https://captcha.com/java/jsp"%>
<!-- 
	@author sanggyu.lee(zeons)
-->
<!-- <!DOCTYPE html> -->
<!DOCTYPE html>
<html lang="ko" class="global">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
		<meta id="metaURL" property="og:url" content='https://www.r114.com/Default.asp?_c=StartupSupport&_s=StoreInfo'>
		<meta id="metaType" property="og:type" content='website' />
		<meta id="metaImg" property="og:image" content='https://image.r114.co.kr/W1/images/common/fe_logo.png' />
		<meta id="metaTitle" property="og:title" content='부동산 빅데이터 플랫폼 부동산114' />
		<meta id="metaDescription" property="og:description" content='종합부동산포털, 매물, 시세, 실거래가, 분양, 리서치, 매물의뢰, 창업지원, 컨설팅, 솔루션, 부동산뉴스 제공' />
		<meta id="metaKeyword" name="keyword" content='종합부동산포털, 매물, 시세, 실거래가, 분양, 리서치, 매물의뢰, 창업지원, 컨설팅, 솔루션, 부동산뉴스 제공' />
		<meta name="description" content="종합부동산포털, 매물, 시세, 실거래가, 분양, 리서치, 매물의뢰, 창업지원, 컨설팅, 솔루션, 부동산뉴스 제공" />
		<meta name="twitter:card" content="summary" />
		<title>부동산114 - RCS</title>
		<!--begin::Fonts-->
		<link rel="stylesheet" href="/resources/common/custom/fonts/NotoSansKR-Hestia.css" />
		<!--end::Fonts-->
		<!--begin::Global Theme Styles(used by all pages)-->
		<link href="/resources/common/custom/plugins/global/plugins.bundle.css" rel="stylesheet" type="text/css" />
		<link href="/resources/common/custom/plugins/custom/prismjs/prismjs.bundle.css" rel="stylesheet" type="text/css" />
		<link href="/resources/common/custom/css/style.bundle.css" rel="stylesheet" type="text/css" />
		<link href="/resources/common/custom/css/style.bundle.extend.css" rel="stylesheet" type="text/css" />
		<!--end::Global Theme Styles-->
		<!--begin::Layout Themes(used by all pages)-->		
		<link href="/resources/common/custom/css/themes/layout/header/base/light.css" rel="stylesheet" type="text/css" />
		<link href="/resources/common/custom/css/themes/layout/header/menu/light.css" rel="stylesheet" type="text/css" />
		<link href="/resources/common/custom/css/themes/layout/brand/dark.css" rel="stylesheet" type="text/css" />
		<link href="/resources/common/custom/css/themes/layout/aside/dark.css" rel="stylesheet" type="text/css" />
		<link href="/resources/common/custom/css/pages/login/login.css" rel="stylesheet" type="text/css" />
		<!--end::Layout Themes-->
		<link rel="shortcut icon" href="/resources/common/custom/media/logos/favicon.ico" />
	</head>
	
	
	<body id="kt_body" class="page-loading">
		<!--begin::Page-->
		<div class="login-wrapper-bg"></div>
		<div class="login-wrap" id="kt_login">
			<!-- 230816 석재 -->
			<!-- <div class="login-bg">
				<a href="#"></a>
				<div class="slogan">Realestate<br>Commercial Solution</div>
			</div> -->
			<!--// 230816 석재 -->
			<!--begin::Body-->
			<div class="login-input-wrap">
				<div class="login-logo">
					<!-- 230816수정 -->
					<strong class="logo">RCS 1.0</strong>
					<span>Realestate Commercial Solution</span>
					<!--// 230816수정 -->
				</div>
				<form class="form" id="LoginFrm" name="LoginFrm" method="post">
					<div class="login-input">			
						<input type="hidden" id="companyCode" name="companyCode" value="${companyCode}" />
						<input type="hidden" id="message" name="message" value="${message}">
						<input type="hidden" id="account" name="account" value="${account}" />
                        <input type="hidden" id="sle_compcode" name="sle_compcode" value="100">
						<input type="hidden" id="sle_password2" name="sle_password2">
						<input type="hidden" id="strongpwd" name="strongpwd" value="N">		
						<div class="input_box">
							<input class="login_input" type="text" id="id" name="id" autocomplete="off" placeholder="아이디">
						</div>
						<div class="input_box">
							<input class="login_input" type="password" id="password" name="password" autocomplete="off" placeholder="비밀번호">
						</div>
						<div class="input_check">
							<input type="checkbox" id="checkId">
							<label for="checkId">아이디 저장</label>
						</div>
						<a id="kt_login_signin_submit" class="login_btn">로그인</a>
						<!-- <a id="kt_login_demo_submit" href="/admin/member/adminActionLoginDemo.do" class="mt-5 p-2 d-block text-center cursor-pointer">체험하기</a>	 -->
					</div>
				</form>	  
				<div class="login_footer">
					<!-- 230816수정 -->
					<div class="copyright-wrap">
						아이디/비밀번호 찾기는 RCS 담당자에게 문의 바랍니다.<br>
						RCS 관리자 문의 : 02-580-7103
					</div>
					<!--// 230816수정 -->
					<span class="copyright">Copyright ⓒ 부동산R114, All rights reserved.</span>
				</div>
			</div>
		</div>
		<!--end::Main-->
		<!--begin::Global Config(global config for global JS scripts)-->
		<!--end::Global Config-->
		<!--begin::Global Theme Bundle(used by all pages)-->		
		<script src="/resources/common/custom/plugins/global/plugins.bundle.js"></script>
		<script src="/resources/common/custom/plugins/custom/prismjs/prismjs.bundle.js"></script>
		<script src="/resources/common/custom/js/scripts.bundle.js"></script>	
		<!--end::Global Theme Bundle-->
		<!--begin::Page Scripts(used by this page)-->
		<!--end::Page Scripts-->
		<script src="/resources/common/core/3rd/jquery/jquery-1.11.2/jquery-1.11.2.js" type="text/javascript"></script>
		<!--begin::zeons script -->
		<script src="/resources/admin/member/js/metronic_v7.0.5/adminLogin.js" type="text/javascript"></script>
		<!--end::zeons script -->
	</body>
</html>
