<%@ page language="java" contentType="text/html; charset=UTF-8"	session="true" pageEncoding="utf-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="CmTagLib" uri="/WEB-INF/taglib/CmTagLib.tld"%>  
<%@ taglib prefix="cfn" uri="/WEB-INF/taglib/CmFunction.tld"%>

<!--
Template Name: Metronic - Responsive Admin Dashboard Template build with Twitter Bootstrap 4 & Angular 8
Author: KeenThemes
Website: http://www.keenthemes.com/
Contact: support@keenthemes.com
Follow: www.twitter.com/keenthemes
Dribbble: www.dribbble.com/keenthemes
Like: www.facebook.com/keenthemes
Purchase: http://themeforest.net/item/metronic-responsive-admin-dashboard-template/4021469?ref=keenthemes
Renew Support: http://themeforest.net/item/metronic-responsive-admin-dashboard-template/4021469?ref=keenthemes
License: You must have a valid license purchased only from themeforest(the above link) in order to legally use the theme for your project.
-->

<head>
	<base href="">
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
	<link href="/resources/common/custom/css/common.css" rel="stylesheet" type="text/css" />
	<!--end::Layout Themes-->	

	
	<script src="/resources/common/core/3rd/jquery/jquery-1.11.2/jquery-1.11.2.js" type="text/javascript"></script>
	<script src="/resources/common/core/js/metronic_v7.0.5/comm.js" type="text/javascript"></script>
	<script src="/resources/common/core/js/metronic_v7.0.5/xmlAjax.js" type="text/javascript"></script>
	<script src="/resources/admin/main/js/metronic_v7.0.5/adminMain.js" type="text/javascript"></script>
	<!--end::Global Theme Bundle-->
	<link rel="shortcut icon" href="/resources/common/custom/media/logos/favicon.ico" />

	<script type="text/javascript">	   
	
		var	GLOBAL_WEB_ROOT					= '${WEB_ROOT}';
		var	GLOBAL_IMG_UPLOAD_URL			= '${IMG_UPLOAD_URL}';
		var	GLOBAL_WEB_URL					= '${WEB_URL}';
		var	GLOBAL_SSL_URL					= '${SSL_URL}/';
		var	GLOBAL_UPLOAD_PATH				= '${UPLOAD_PATH}';
		
		// 체험하기 지역설정
		var _GroupCode						= '${admin_groupcode}';		// 41
		var _isDemo	= false;
		var _isTest	= false;
		if(_GroupCode == '41') { _isDemo = true; }
		if(_GroupCode == '42') { _isTest = true; }
		var _DemoSidocd						= '11';						// 서울특별시
		var _DemoSidonm						= '서울특별시';				// 서울특별시
		var _DemoSggcd						= '11680';					// 강남구
		var _DemoSggnm						= '강남구';					// 강남구
		var _DemoMsgX						= '체험하기에서 가능한 지역이 아닙니다.';
		var _DemoLdongcd					= '11680';					// 강남구
		var _DemoMsgDownloadX				= '체험하기에서는 다운로드가 불가능 합니다.';
		var _DemoMsgMapX					= '체험하기에서는 \'서울특별시 강남구\' 지역만<br/>조회 됩니다.';
		var _DemoMsgBlockX					= '체험하기에서는 \'서울특별시 강남구\' 지역에서만<br/>데이터분석 기능을 제공합니다.';
		var _NoPemissionMsgDownloadX		= '다운로드가 불가능한 권한입니다.';
		if('"${admin_excelyn}"' == "Y"){
			document.oncontextmenu = function(){return false;}
		}      
		
		// 지역현황판 메뉴 내 선택한 지역설정 값 유지
		var dashboardSelectedAddr = {
				sidonm : '서울특별시',
				sggnm : '강남구',
				dongnm : '',
				sidocd : '1111010100',
				sggcd : '1168010100',
				dongcd : ''
		};
		
	</script>
	<!-- 기존 변수처리 끝 -->

	<!-- Swiper -->
	<!-- Link Swiper's CSS -->
	<!-- <link rel="stylesheet" href="/resources/common/custom/css/swiper-bundle.min.css" /> -->
	<!-- Swiper JS -->
	<!-- <script src="/resources/common/custom/jquery/swiper-bundle.min.js"></script> -->
	<!--// Swiper -->
</head>
<!-- end::Head -->

<!--end::Head-->
<!--begin::Body-->
<body id="kt_body" class="header-mobile-fixed aside-enabled aside-fixed page-loading" <c:if test="${admin_excelyn == 'Y'}"> oncontextmenu="return false" onselectstart="return false" ondragstart="return false" </c:if></body>

	<!--begin::Main-->
	<!--begin::Header Mobile-->
	<div id="kt_header_mobile" class="header-mobile align-items-center header-mobile-fixed">
		<!--begin::Logo-->
		<a href="adminMain.do">
			<span style="color: white; font-size: 24px; font-weight: 500;">RCS</span>
		</a>
		<!--end::Logo-->
		<!--begin::Toolbar-->
		<div class="d-flex align-items-center">
			<!--begin::Aside Mobile Toggle-->
			<button class="btn p-0" id="kt_aside_mobile_toggle">
				<i class="ki ki-menu text-white pr-0 icon-lg"></i>
			</button>
			<!--end::Aside Mobile Toggle-->
		</div>
		<!--end::Toolbar-->
	</div>
	<!--end::Header Mobile-->
	<div class="d-flex flex-column flex-root">
		<!--begin::Page-->
		<div class="d-flex flex-row flex-column-fluid page">
			<!--begin::Aside-->
			<div class="aside aside-left aside-fixed d-flex flex-column flex-row-auto" id="kt_aside">
				<!--begin::Brand-->
				<div class="brand flex-column-auto" id="kt_brand">
					<!--begin::Logo-->
					<!-- 230816 로고변경 -->
					<a href="adminMain.do" class="brand-logo">
						<!-- <img src="/resources/common/custom/media/logos/logo.png" alt="logo-RCS" style="height: 40px;" /> -->
						RCS 1.0
					</a>
					<!--// 230816 로고변경 -->
					<!--end::Logo-->
					<!--begin::Toggle-->
					<button class="brand-toggle btn btn-sm px-0 text-center" id="kt_aside_toggle">
						<i class="ki ki-menu pr-0"></i>
					</button>
					<!--end::Toolbar-->
				</div>
				<!--end::Brand-->
				<!--begin::Aside Menu-->
				<div class="aside-menu-wrapper flex-column-fluid" id="kt_aside_menu_wrapper">
					<!--begin::Menu Container-->
					<div id="kt_aside_menu" class="aside-menu mb-4" data-menu-dropdown-timeout="500">
						<!--begin::Menu Nav-->
						<ul class="menu-nav py-0">
							<c:forEach items="${pgmList}" var="menucol">	
								<c:choose>
								<c:when test="${menucol.lvl eq 1 && menucol.downyn eq 'N'}">
									<li class="menu-item z_menu-item${menucol.lvl}" aria-haspopup="true" data-menu-toggle="hover">
										<a url="${menucol.filepath}" id="${menucol.opencode}" class="z-menu-link menu-link menu-toggle sub">
											<span class="svg-icon menu-icon">
												<img src="/resources/common/custom/media/svg/icons/r114/${menucol.icon}" alt="${menucol.menuname}">
											</span>
											<span class="z-menu-text menu-text">${menucol.menuname}</span>
										</a>
										<span class="menu-tooltip">${menucol.menuname}</span>
									</li>
								</c:when>
								<c:when test="${menucol.lvl eq 1 && menucol.downyn eq 'Y' && menucol.menuorder1 eq 1 }">
									<li class="menu-item z_menu-item${menucol.lvl} menu-item-submenu menu-item-open" aria-haspopup="true" data-menu-toggle="hover">
							        	<a url="${menucol.filepath}" id="${menucol.opencode}" class="z-menu-link menu-link menu-toggle">
							         		<span class="svg-icon menu-icon">
							          			<img src="/resources/common/custom/media/svg/icons/r114/${menucol.icon}" alt="${menucol.menuname}">
							         		</span>
							         		<span class="menu-text">${menucol.menuname}</span>
							         		<i class="menu-arrow"></i>
							        	</a>
							        	<span class="menu-tooltip">${menucol.menuname}</span>
							        	<div class="menu-submenu">
							         		<i class="menu-arrow"></i>
							         			<ul class="menu-subnav">
							          				<li class="menu-item menu-item-parent" aria-haspopup="true">
								           				<span class="menu-link">
								            				<span class="menu-text">"${menucol.menuname}"</span>
								           				</span>
							          				</li>					
								</c:when>
								<c:when test="${menucol.lvl eq 1 && menucol.downyn eq 'Y'}">
									<li class="menu-item z_menu-item${menucol.lvl} menu-item-submenu" aria-haspopup="true" data-menu-toggle="hover">
							        	<a url="${menucol.filepath}" id="${menucol.opencode}" class="z-menu-link menu-link menu-toggle">
							         		<span class="svg-icon menu-icon">
							          			<img src="/resources/common/custom/media/svg/icons/r114/${menucol.icon}" alt="${menucol.menuname}">
							         		</span>
							         		<span class="menu-text">${menucol.menuname}</span>
							         		<i class="menu-arrow"></i>
							        	</a>
							        	<span class="menu-tooltip">${menucol.menuname}</span>
							        	<div class="menu-submenu">
							         		<i class="menu-arrow"></i>
							         			<ul class="menu-subnav">
							          				<li class="menu-item menu-item-parent" aria-haspopup="true">
								           				<span class="menu-link">
								            				<span class="z-menu-text menu-text">"${menucol.menuname}"</span>
								           				</span>
							          				</li>
								</c:when>
								<c:when test="${menucol.lvl eq 2 && menucol.downsort eq 1}">  
									<li class="menu-item z_menu-item${menucol.lvl}" aria-haspopup="true" data-menu-toggle="hover">
							        	<a url="${menucol.filepath}" id="${menucol.opencode}" class="z-menu-link menu-link">
							            	<i class="menu-bullet menu-bullet-dot">
							            		<span></span>
							            	</i>
							            	<span class="z-menu-text menu-text">${menucol.menuname}</span>
							           	</a>
							        </li>			
								</c:when>
								<c:when test="${menucol.lvl eq 2 && menucol.downsort eq menucol.downcnt}">
											<li class="menu-item z_menu-item${menucol.lvl}" aria-haspopup="true">
									        	<a url="${menucol.filepath}" id="${menucol.opencode}" class="z-menu-link menu-link">
									            	<i class="menu-bullet menu-bullet-dot">
									             		<span></span>
									            	</i>
									            	<span class="z-menu-text menu-text">${menucol.menuname}</span>
									           	</a>
									    	</li> 
								    	</ul>
								   	</div>
							       </li>						
								</c:when>
								<c:otherwise>
									<li class="menu-item z_menu-item${menucol.lvl}" aria-haspopup="true" data-menu-toggle="hover">
							        	<a url="${menucol.filepath}" id="${menucol.opencode}" class="z-menu-link menu-link">
							            	<i class="menu-bullet menu-bullet-dot">
							            		<span></span>
							            	</i>
							            	<span class="z-menu-text menu-text">${menucol.menuname}</span>
							           	</a>
							        </li>																						
								</c:otherwise>
								</c:choose>
							</c:forEach>
						</ul>
						<!--end::Menu Nav-->
					</div>
					<!--end::Menu Container-->
				</div>
				<!--end::Aside Menu-->
				<!--begin::Copyright -->
				<div class="r114-copyright flex-column-auto">
					<div class="text-center pb-12">
						<p class="text-white font-size-h5">${admin_userNm}님</p>
						<button class="btn btn-outline-white font-weight-bold btn-pill z-btn-sign-out px-7 pb-3">로그아웃</button>
						<c:if test="${pDayCnt < 1000}">
							<p class="text-white font-size-sm pt-2">
								비밀번호 만료일이 <span id="span_passday" value="${pDayCnt}">${pDayCnt}</span> 일남았습니다.
							</p>	
						</c:if>
						<c:if test="${p_contday < 10}">
							<!-- p id="p_contday"  class="text-white font-size-sm pt-2">
								계약종료일이  <span id="span_contday">${cDayCnt}</span> 일남았습니다.
							</p -->
						</c:if>		
						</div>
					<div class="text-center text-white font-size-sm border-top py-7">
						Copyright ⓒ 부동산R114, <br>All rights reserved.
					</div>
				</div>
				<!--end::Copyright -->
			</div>		
			<!--end::Aside-->
			<!--begin::Modal-->
 <div id="change-password" class="modal fade password" tabindex="-1" aria-labelledby="pwModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-md">
		<div class="modal-content">
			<div class="modal-header py-5">
				<h5 class="modal-title" id="pwModalLabel">비밀번호 변경 안내</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<i aria-hidden="true" class="ki ki-close"></i>
				</button>
			</div>
			<div class="modal-body">
				<p>
					고객님의 소중한 정보보호를 위해 <span class="text-danger font-weight-bold">2개월 주기로 비밀번호 변경</span>을
					안내해 드리고 있습니다. 불편하시더라도 주기적으로 비밀번호를
					변경하여 주시길 부탁드립니다.
				</p>
				<div class="modal-button-wrap">
					<button class="btn btn-danger" data-btn-pw-change>비밀번호 변경</button>
				</div>
			</div>
			<div class="modal-footer d-flex">
				<button class="btn" data-btn-pw-due>90일 연장하기</button>
				<button class="btn modal-close" data-dismiss="modal" aria-label="Close">닫기</button>
			</div>
			
		</div>
	</div>
</div>

<!--end::Modal-->
			<!--begin::Wrapper-->
			<div class="d-flex flex-column flex-row-fluid wrapper" id="kt_wrapper">
				<!--begin::Content-->
				<div class="content d-flex flex-column flex-column-fluid" id="kt_content">
				
				

