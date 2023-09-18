<%-- <%@ page language="java" contentType="text/html; charset=utf-8"	session="true" pageEncoding="utf-8" trimDirectiveWhitespaces="true"%> --%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%-- <%@ taglib prefix="validator" uri="http://www.springmodules.org/tags/commons-validator"%> --%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui"%>

<%@ page import ="apps.framework.utils.CmPathInfo"%>

<%
	String _CompanyCode = (String) session.getAttribute("admin_companyCode");
	String _UserId		= (String) session.getAttribute("admin_userId");
 %>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<!-- <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, target-densitydpi=medium-dpi"> -->
<meta name="format-detection" content="telephone=no">
<meta http-equiv="X-UA-Compatible" content="IE=edge">


<title>Dawul 지도</title>

<script src="/resources/common/core/3rd/jquery/jquery-1.11.2/jquery-1.11.2.js" type="text/javascript"></script>


<%-- <script charset='UTF-8' src="https://vapi.dawulmap.com:8443/MapAppServer/DWService?req={'header':{'format':'JSON','serviceName':'SDK_REQ','key':'14cc08123cd6d425d603917caf3ee061895e4192'},'body':{'sdkType':'AJAX','version':'2.0'}}"></script> --%>
<%-- <script type="text/javascript" src="/api/gis/js/dawulMap.do"></script> --%>
<!-- $.getScript("https://vapi.dawulmap.com:8443/MapAppServer/DWService?req={'header':{'format':'JSON','serviceName':'SDK_REQ','key':'14cc08123cd6d425d603917caf3ee061895e4192'},'body':{'sdkType':'AJAX','version':'2.0'}}"), -->

<!-- 지도API -->
<!-- <link rel="stylesheet" href="http://vapi.dawulmap.com:8000/MapAppServer/DWService?req={'header':{'format':'JSON','serviceName':'SDK_REQ','key':'c507f63d67f91877e3b93ee816838b3302c3cce6'},'body':{'sdkType':'CSS','version':'2.0'}}" />
<script charset="UTF-8" src="http://vapi.dawulmap.com:8000/MapAppServer/DWService?req={'header':{'format':'JSON','serviceName':'SDK_REQ','key':'c507f63d67f91877e3b93ee816838b3302c3cce6'},'body':{'sdkType':'AJAX','version':'2.0'}}"></script>
<script type="text/javascript" charset='UTF-8' src="http://vapi.dawulmap.com:8000/MapAppServer/DWService?req={'header':{'format':'JSON','serviceName':'SDK_PLUGIN_REQ','key':'c507f63d67f91877e3b93ee816838b3302c3cce6'},'body':{'plugInType':'AJAX_PLUGIN','plugInName':'MARKER_CLUSTER','version':'2.0'}}"></script> -->

<!-- 상권관련? -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/terraformer/1.0.12/terraformer.min.js" type="text/javascript"></script>



<!-- <link type="text/css" rel="stylesheet" href="/resources/common/core/3rd_extends/leaflet.draw/leaflet.draw-src.css" /> -->
<link rel="stylesheet" type="text/css" href="/resources/common/custom/plugins/custom/owlcarousel/assets/owl.carousel.min.css">


	
<link rel="stylesheet" type="text/css" href="/resources/common/custom/css/kor/layout.css">

<link href="/resources/common/custom/plugins/global/plugins.bundle.css" rel="stylesheet" type="text/css" />
<link href="/resources/common/custom/plugins/custom/prismjs/prismjs.bundle.css" rel="stylesheet" type="text/css" />
<link href="/resources/common/custom/css/style.bundle.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="/resources/common/custom/css/dw_popup.css">
<link href="/resources/common/custom/css/common.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" href="/resources/common/custom/fonts/NotoSansKR-Hestia.css" />
<!-- bootstrap -->
<!-- <script charset='UTF-8' src="/resources/common/custom/plugin/bootstrap/bootstrap.min.js"></script> -->
<!-- //bootstrap -->

<script charset='UTF-8' src="/resources/common/custom/js/hashMaps.js"></script>
<script charset='UTF-8' src="/resources/common/custom/js/json_datas.js"></script>
<script charset='UTF-8' src="/resources/common/custom/js/dawul_url-src.js"></script>


<script charset='UTF-8' src="/resources/common/custom/js/language_change.js"></script>
<script charset='UTF-8' src="/resources/common/custom/js/search.js"></script>
<script charset='UTF-8' src="/resources/common/custom/js/navi.js"></script>
<script charset='UTF-8' src="/resources/common/custom/js/map_copy.js"></script>
<script charset='UTF-8' src="/resources/common/custom/js/grid.js"></script> <!-- 격자주소 -->
<script charset='UTF-8' src="/resources/common/custom/js/poc.js"></script>



<script src="/resources/common/core/js/metronic_v7.0.5/comm.js" type="text/javascript"></script>
<script src="/resources/common/core/js/metronic_v7.0.5/xmlAjax.js" type="text/javascript"></script>
<script src="/resources/admin/main/js/metronic_v7.0.5/adminMain.js" type="text/javascript"></script>
<%@ include file="/WEB-INF/view/admin/APPS/gis/tmplApiAddr.jsp"%>
<script src="/resources/common/custom/js/scripts.bundle.js"></script>
<!-- <script src="/resources/common/core/3rd_extends/leaflet.draw/leaflet.draw-src.js" type="text/javascript"></script>
<script src="https://cdn.jsdelivr.net/npm/@turf/turf@5/turf.min.js" type="text/javascript"></script> -->			

<!-- custom-scrollbar -->

<link type="text/css" rel="stylesheet" href="/resources/common/custom/plugin/scrollbar/jquery.mCustomScrollbar.min.css">
<style>
	#map > div.leaflet-map-pane > div.leaflet-objects-pane > div.leaflet-marker-pane > div {height:0px !important;} 
	.leaflet-div-icon {
	  background: #fff;
	  border: 0px solid #666 !important; 
	}  
</style>
<!-- //custom-scrollbar -->

<script type="text/javascript">
var lan = 'KOR';
var mapCopyType = '';
var mapCopyData1 = '';
var mapCopyData2 = '';
var mapCopyData3 = '';
var mapCopyData4 = '';
var mapCopyData5 = '';
var mapCopyData6 = '';
var firstLat = '';
var firstLng = '';
var firstLevel = '';

// 체험하기 지역설정
var _GroupCode						= '${admin_groupcode}';		// 41
var _isDemo	= false;
var _isTest	= false;
if(_GroupCode == '41') { _isDemo = true; }
if(_GroupCode == '40') { _isTest = true; }
var _DemoSidocd						= '11';						// 서울특별시
var _DemoSidonm						= '서울특별시';				// 서울특별시
var _DemoSggcd						= '11680';					// 강남구
var _DemoSggnm						= '강남구';					// 강남구
var _DemoMsgX						= '체험하기에서 가능한 지역이 아닙니다.';
var _DemoLdongcd					= '11680';					// 강남구

</script>

</head>
<!-- body --> 

	<body>

<!-- wrap -->
<div id="wrap" style="-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none">
	
	<!-- //header -->
	
	<div id="noticeBg" style="display:none; position:absolute; background:white; z-index: 1001; width: 100%; height:100%;">
		<div style="width:998px; margin:0 auto; z-index: 10000; margin-top:40px;"><div id="noticeClose" align="right" style="height: 28px; cursor: pointer;"><a onclick="notice();"><img src="/resources/common/custom/images/close_btn.gif" alt="닫기" /></a></div></div>
		<!-- <iframe id='ifrm1' name='ifrm1' src='/resources/common/custom/customer2/notice/notice.php?type=B0002' width='100%' frameborder='0' scrolling='yes' style='height: calc(100% - 120px);'></iframe>   포팅시 URL 수정 -->
		<!-- <iframe id='ifrm1' name='ifrm1' src='http://222.239.253.18/dawulmap/customer2/notice/notice.php?type=B0002' width='100%' frameborder='0' scrolling='yes' style='height: calc(100% - 120px);'></iframe>-->  <!--포팅시 URL 수정 -->
		<iframe id='ifrm1' name='ifrm1' src='https://pns.dawulmap.com/customer2/notice/notice.php?type=B0002' width='100%' frameborder='0' scrolling='yes' style='height: calc(100% - 120px);'></iframe>
	</div>
	<!-- 배경지도 -->
	<div id="map" style="width: 100%; height: 100%;"></div>

	<!-- ==================================== 주소,poi 검색 ====================================== -->	
	
	<div class="position-absolute map-search-layer" id="mapSearchLayer">
		<div class="border bg-white px-6 pt-6 pb-4 position-relative">        
			<div class="map-search-wrap d-flex align-items-center px-4 py-0">
				<img src="/resources/common/custom/images/svg/map/ic-search.gif" alt="">
				<input type="text" class="form-control border-0 font-size-h5" placeholder="지역명을 검색해 주세요" data-addr-search-text>
				<a href="javascript:;" data-btn-clear-addr><img src="/resources/common/custom/images/svg/map/ic-delete.svg" alt="검색삭제"></a>
			</div>
			
			<div class="d-flex align-items-center justify-content-center pt-4">
			</div>
			<div id="mapSrcResult" style="display: none;">
				<div class="px-6">
					<span class="font-size-lg text-muted">검색결과</span><span class="font-size-lg"> : <span data-search-result-text></span></span>
				</div>
				<ul class="nav nav-tabs nav-tabs-line nav-justified nav-tabs-line-2x nav-tabs-line-danger bg-white">
					<li class="nav-item">
						<a class="nav-link active justify-content-center m-0 font-size-h6" data-toggle="tab" href="#kt_tab_pane_4">전체 (<span data-cnt="addrSearchResultAll">0</span>)</a>
					</li>
					<li class="nav-item">
						<a class="nav-link justify-content-center m-0 font-size-h6" data-toggle="tab" href="#kt_tab_pane_5">주소 (<span data-cnt="addrSearchResultAddr">0</span>)</a>
					</li>
					<li class="nav-item">
						<a class="nav-link justify-content-center m-0 font-size-h6" data-toggle="tab" href="#kt_tab_pane_6">장소 (<span data-cnt="addrSearchResultPlace">0</span>)</a>
					</li>
				</ul>
				<div class="tab-content ps scroll" data-scroll="true" data-height="500" data-mobile-height="300" style="height:500px" id="myTabContent2">
					<div class="tab-pane fade show active" id="kt_tab_pane_4" role="tabpanel" aria-labelledby="kt_tab_pane_4">
					</div>
					<div class="tab-pane fade" id="kt_tab_pane_5" role="tabpanel" aria-labelledby="kt_tab_pane_5">
					</div>
					<div class="tab-pane fade" id="kt_tab_pane_6" role="tabpanel" aria-labelledby="kt_tab_pane_6">
					</div>
				</div>
			</div>
		</div>
		
		<div class="border border-top-0 bg-white px-6 py-6">
			<div class="d-flex align-items-center justify-content-between">
				<span class="font-size-h5">GIS (건물) 분양정보 및 시세정보</span>
				<!-- img src="/resources/common/custom/media/svg/map/icon-info.svg" class="tooltipCustom" -->
				<i class="fa fa-question-circle icon-md ml-3 tooltipCustom">
					<span class="tooltipCustom-text">
						부동산R114가 보유한 상업시설의 분양/ 임대료/ 매매/ 실거래 자료를 연도별, 층별, 상가유형별로 구분하여 보실 수 있습니다.
						<br>
						선택 마커를 클릭시 우측에 건축물의 개요 및 가격정보, 해당 선택 매물이 속한 읍면동의 상권 분석자료를 확인하실 수 있습니다.
					</span>
				</i>
				<!-- alt=""  data-toggle="tooltip" data-placement="right" title="선택지역의 상가 유형별 공급(분양) 동향을 그래프 및 테이블 형식제공" --> 
			</div>
			<div class="d-flex pt-4">
				<button type="button" class="btn btn-toggle btn-sm font-size-h6 rounded-sm px-4 btn-sale on">분양</button>
				<button type="button" class="btn btn-toggle btn-sm font-size-h6 rounded-sm px-4 ml-2 btn-rent on">임대료</button>		
				<button type="button" class="btn btn-toggle btn-sm font-size-h6 rounded-sm px-4 ml-2 btn-trading on">매매</button>
				<button type="button" class="btn btn-toggle btn-sm font-size-h6 rounded-sm px-4 ml-2 btn-actual on">실거래</button>				
				<button type="button" class="btn btn-sm btn-outline-secondary font-size-h5 rounded-sm px-4 ml-2" id="btnFilter1" style="cursor:pointer"><i class="flaticon-interface-7 px-0"></i></button>
			</div>
			<div class="select-header d-flex align-items-center pt-4">
				<span class="font-size-h5">
					<ul class="radio-salepriceall radio-all">
	 					<li class="item" alltarget="radio-saleprice"  style="width:30px;"><span></span><strong></strong></li>
					</ul>					
				</span>
				<span class="font-size-h5">분양가 물건만 보기</span>
			</div>
		</div>
		
		<div class="border border-top-0 bg-white px-6 py-6">
			<div class="d-flex align-items-center justify-content-between">
				<span class="font-size-h5">상품 유형</span>				
				<i class="fa fa-question-circle icon-md ml-3 tooltipCustom">
					<span class="tooltipCustom-text">
						선택한 상품 유형의 정보를 표시합니다.
					</span>
				</i>
			</div>
			<div class="d-flex pt-4 select-article-type">
				<span class="font-size-h6">&emsp;</span>		
				<button type="button" class="btn btn-toggle btn-sm font-size-h6 rounded-sm px-4 btn-article-type btn-article-type-01 on" data-item="D02">상가</button>
				<button type="button" class="btn btn-toggle btn-sm font-size-h6 rounded-sm px-4 ml-2 btn-article-type btn-article-type-02 on" data-item="E04">지식산업센터</button>		
				<button type="button" class="btn btn-toggle btn-sm font-size-h6 rounded-sm px-4 ml-2 btn-article-type btn-article-type-03 on" data-item="D01">오피스/사무실</button>
			</div>
		</div>
		
		<div class="border border-top-0 bg-white px-6 py-6" id="filterLayer1" style="display: none;">
			<div class="select-header d-flex align-items-center justify-content-between">
				<span class="font-size-h5">등록년도</span>
				<span class="font-size-h5">
					<ul class="radio-yearsall radio-all">
	 					<li class="item on" alltarget="radio-years"><span></span><strong> 전체</strong></li>
					</ul>
				</span>						
			</div>
			<div class="select-years">
				<a href="javascript:;" class="left"></a>
					<ul class="radio-years owl-carousel owl-theme">
					</ul>
				<a href="javascript:;" class="right"></a>
			</div>
		</div>
		<div class="border border-top-0 bg-white px-6 py-6" id="filterLayer2" style="display: none;">
			<div class="select-header d-flex align-items-center justify-content-between">
				<span class="font-size-h5">연면적 (㎡)</span>
				<span class="font-size-h5">
					<ul class="radio-areaall radio-all">
	 					<li class="item on" alltarget="radio-areabound"><span></span><strong> 전체</strong></li>
					</ul>					
				</span>
			</div>
			<div class="select-areabound">
				<a href="javascript:;" class="left"></a>
					<ul class="radio-areabound owl-carousel owl-theme">
	 					<li class="item" data-item="0"><span></span><strong> 1,000미만 </strong></li>
						<li class="item" data-item="1000"><span></span><strong> 1,000이상 <br>3,000미만  </strong></li>
						<li class="item" data-item="3000"><span></span><strong> 3,000이상 <br>5,000미만  </strong></li> 
						<li class="item" data-item="5000"><span></span><strong> 5,000이상 <br>7,000미만  </strong></li> 
						<li class="item" data-item="7000"><span></span><strong> 7,000이상 <br>10,000미만</strong></li> 
						<li class="item" data-item="10000"><span></span><strong>10,000이상 <br>15,000미만</strong></li>
						<li class="item" data-item="15000"><span></span><strong>15,000이상 <br>30,000미만</strong></li> 
						<li class="item" data-item="30000"><span></span><strong>30,000이상 </strong></li> 
					</ul> 
				<a href="javascript:;" class="right"></a>
			</div>
		</div>
		<div class="border border-top-0 bg-white px-6 py-6" id="filterLayer3" style="display: none;">
			<div class="select-header d-flex align-items-center justify-content-between">
				<span class="font-size-h5">층</span>
				<span class="font-size-h5">
					<ul class="radio-floorall radio-all">
	 					<li class="item on" alltarget="radio-floor"><span></span><strong> 전체</strong></li>
					</ul>					
				</span>
			</div>
			<div class="select-floor">
				<ul class="radio-floor">
 					<li class="item" data-item="B1F"><span></span><strong> B1F이하</strong></li>
					<li class="item" data-item="1F"><span></span><strong> 1F    </strong></li>
					<li class="item" data-item="2F"><span></span><strong> 2F    </strong></li> 
					<li class="item" data-item="3F"><span></span><strong> 3F    </strong></li> 
					<li class="item" data-item="4F"><span></span><strong> 4F이상 </strong></li> 
				</ul>
			</div>
		</div>					
		<div class="border border-top-0 bg-white px-6 py-6" id="filterLayer4" style="display: none;">
			<div class="select-header2 d-flex align-items-center justify-content-between">
				<span class="font-size-h5">상가유형</span>
			</div>
			<div class="d-flex pt-4 select-sangga" >      
				<button type="button" class="btn btn-togsanga btn-sm font-size-h7 rounded-sm px-1 ml-2 on" data-item="단지내상가">단지내<br>상가</button>
				<button type="button" class="btn btn-togsanga btn-sm font-size-h7 rounded-sm px-1 ml-2 on" data-item="주상복합상가">주상복합<br>상가</button>
				<button type="button" class="btn btn-togsanga btn-sm font-size-h7 rounded-sm px-1 ml-2 on" data-item="프라자상가">프라자<br>상가</button>					
				<button type="button" class="btn btn-togsanga btn-sm font-size-h7 rounded-sm px-1 ml-2 on" data-item="근린상가">근린상가</button>
			</div>
			<div class="d-flex pt-4 select-sangga">      
				<button type="button" class="btn btn-togsanga btn-sm font-size-h7 rounded-sm px-1 ml-2 on" data-item="복합쇼핑몰">복합쇼핑몰<br>상가</button>
				<button type="button" class="btn btn-togsanga btn-sm font-size-h7 rounded-sm px-1 ml-2 on" data-item="오피스상가">오피스<br>상가</button>
				<button type="button" class="btn btn-togsanga btn-sm font-size-h7 rounded-sm px-1 ml-2 on" data-item="지식산업센터상가">지식산업<br>센터상가</button>					
				<button type="button" class="btn btn-togsanga btn-sm font-size-h7 rounded-sm px-1 ml-2 on" data-item="기타상가">기타상가</button>
			</div>
			<div class="text-center px-6 py-4"> 
				<button class="btn btn-danger btn mr-2 rounded-sm btnFilterOk">확인</button>
				<button class="btn btn-outline-secondary btn rounded-sm btnFilterCancel">취소</button>
			</div>	
		</div>	
	</div>
	<%@ include file="/WEB-INF/view/admin/APPS/gis/buildingMapDtl.jsp"%>
										
		  
	<!-- 검색창 -->
	<div id="mSearchDForm" class="m_search d_form" style="display: none;">
		<form onsubmit="return false">
			<fieldset>
				<legend>Dawul 지도 검색</legend>
				<label for="inputSearch">검색어 입력</label>
				<!-- input box --><input type="text" id="inputSearch" class="lan_inputSearch" name="" placeholder="" onKeyDown="javascript:if(event.keyCode == 13){unifiedSearch(0,1);}">
				<!-- 검색버튼 --><button id="inputSearchBtn" type="button" class="btn_search" onclick="unifiedSearch(0,1)"></button>
				<!-- 초기화 버튼 --><button id="inputSearchDel" type="button" class="btn_reset" style="display:none;" onclick="searchReset();"></button><!-- 검색결과 후 노출 -->
			</fieldset>
		</form>
		<div class="close" id="searchCloseM"><a href="javascript:void(0);" onclick="inputSearchClick2(); searchReset();"></a></div><!-- LJW : 추가 -->
	</div>
	<!-- //검색창 -->

	<div class="position-absolute w-100 pointer-events-none" style="top: 0; left: 0;">
		<div class="text-center mt-10">
			<!--begin::Address search-->
			<div class="dropdown d-inline-block pointer-events-auto">
				<!--begin::Toggle-->
				<div class="" data-offset="10px,0px" id="btnSearchAddr">
					<button class="btn btn-pill btn-dropdown ps mb-4 p-0 bg-white" aria-expanded="true">
						<!-- <span class="d-inline-block pl-4 pr-3 font-size-lg text-dark" data-today="YYYY.MM.DD"></span> -->
						<span class="d-inline-block bg-lts font-size-lg text-white px-4 pt-2 pb-3"><i class="flaticon2-pin text-white mr-1"></i> <span data-addr-sidob></span> <i class="ki ki-arrow-next icon-sm"></i> <span data-addr-sggb></span> <i class="ki ki-arrow-next icon-sm"></i> <span data-addr-dongb></span> <i class="flaticon2-down text-white icon-sm ml-3"></i></span>
					</button>
				</div>  
				<!--end::Toggle-->
				<!--begin::Dropdown-->
				<div class="dropdown-menu p-0 m-0 dropdown-menu-xl rounded-0 border dropdown-menu-center" id="divSearchAddr" style="display: none;">
					<div class="font-size-lg font-dark px-6 py-4 border-bottom"><span data-addr-sidob></span> <i class="ki ki-arrow-next icon-sm"></i> <span data-addr-sggb></span> <i class="ki ki-arrow-next icon-sm"></i> <span data-addr-dongb></span></div>
					<div class="row no-gutters" id="addrWrapperb">
						<div class="col scroll ps border-right" data-scroll="true" data-height="300" data-mobile-height="200" style="height:300px">
							<ul class="nav flex-column nav-light-danger nav-address nav-pills">
							</ul>
						</div>
						<div class="col scroll ps border-right" data-scroll="true" data-height="300" data-mobile-height="200" style="height:300px">
							<ul class="nav flex-column nav-light-danger nav-address nav-pills">
								<li class="nav-item m-0 all-item">
									<a href="javascript:;" class="nav-link rounded-0" data-toggle="pill" data-list-addr-sgg="">전체</a>
								</li>
							</ul>
						</div>
						<div class="col scroll ps" data-scroll="true" data-height="300" data-mobile-height="200" style="height:300px">
							<ul class="nav flex-column nav-light-danger nav-address nav-pills">
								<li class="nav-item m-0 all-item">
									<a href="javascript:;" class="nav-link rounded-0" data-toggle="pill" data-list-addr-dong="">전체</a>
								</li>
							</ul>
						</div>
					</div>
					<div class="text-center px-6 py-4 border-top">
						<button class="btn btn-danger btn-sm mr-2 rounded-0 btnSearchAddrClose" >검색</button>
						<button class="btn btn-outline-secondary btn-sm rounded-0 btnSearchAddrClose">취소</button>
					</div>
				</div>
				<!--end::Dropdown-->
			</div>
			<!--end::Address search-->
		</div>
	</div>
		
	<!-- 검색결과 -->
	<div id="searchListForm" class="s_section" style="display: none;">
	     <!-- //mobile : 검색창 추가 -->    
	        
		<!-- ================================== 통합검색 ==================================== -->
		<div id="unifiedSearchForm" style="display: none;">
			<!-- 결과 문구 --><div id="search_info_form" class="result_word"><span></span> 검색결과</div>
			
			<div id="searchOpen">
	
				<!-- 리스트 -->
				<div class="pa_list l_size oa pa mCustomScrollbar scrollbar" data-mcs-theme="minimal-dark">
					<div id="addressSearchForm">
						<!-- 주소 건수 -->
						<div class="result_num clear">	
							<div class="num_line"></div>
							<h2>
								<!-- 건수 --><span id="addressTotalCount" class="num">주소(<span></span>건)</span>
								<!-- 더보기 버튼 --><span id="address_list_more" class="more" onclick="unifiedSearch(1,1);"><a class="lan_etcList" href="javascript:;">더보기</a></span>
							</h2>
						</div>
						<!-- //건수 -->
					
						<!-- list -->
						<div id="addressListForm"><!-- A ~ E 까지 노출 --> <!-- 주소 -->
						</div>
						<!-- //list -->
					</div>
					
					<div id="searchNullForm" style="display: none;">
						<div>
							<div class="lan_searchNull list_no">다시 검색해주세요.</div>
						</div>
					</div>
				</div>
				<!-- //리스트 -->
			</div>
		</div>
		<!-- ================================== //통합검색 ==================================== -->
		<!-- ================================== 건물내 검색 ==================================== -->
	</div>
	
	<div id="m_nearby" class="m_nearby" onmouseenter="ncodeHover();" style="display: none;"></div>

	<!-- //주변시설 -->
		<div class="tool-group">
			<div class="map-type-container">
				<button type="button" class="btn-map d-block" id="btnMapType1">일반</button>
				<div class="map-type-layer" id="mapTypeLayer1" style="display:none">
					<div class="d-flex">
						<button type="button" id="btnMapType1_1" class="btn-map border-right-0 px-0 active btnMapType1Close" onclick="baseMapChanges(1);">일반</button>
						<button type="button" id="btnMapType1_2" class="btn-map border-right-0 px-0 btnMapType1Close" onclick="baseMapChanges(2); if ($(this).hasClass('active')) $('#btnMapType1').text('지적용도');">지적<br/>용도</button>
						<button type="button" id="btnMapType1_3" class="btn-map border-right-0 px-0 btnMapType1Close" onclick="baseMapChanges(3);">위성</button>
					</div>
				</div>
			</div>
			<div class="map-type-container mt-3">
				<button type="button" id="btnMapType2_2" class="btn-map d-block">개발</button>
			</div>
			
			
			<div class="map-type-container mt-3">
				<!-- <button type="button" class="btn-map d-block" onclick="ncodeHover();">편의시설</button> -->
				<button type="button" id="map_plant_bt" class="btn-map d-block">편의시설</button>
				<!-- 210104 편의시설 추가  -->
				<div class="map_plant_box">
					<div class="map_plant_list_box">
						<ul class="plant_box_left" id="m_nearby2_sub1_1">
							
						</ul>
						<ul class="plant_box_right" id="m_nearby2_sub1_2">

						</ul>
					</div>
					<div id="plant_sub_depth_box">
						<div id="m_nearby2_sub2_form" class="col scroll ps " data-scroll="true" data-height="278" data-mobile-height="200" style="height:278px">
							<ul class="nav flex-column nav-light-danger nav-address nav-pills" id="m_nearby2_sub2">

							</ul>							
						</div>
						
						<div id="m_nearby2_sub3_form" class="col scroll ps " data-scroll="true" data-height="278" data-mobile-height="200" style="height:278px">
							<ul class="nav flex-column nav-light-danger nav-address nav-pills" id="m_nearby2_sub3">

							</ul>							
						</div>						
					</div>

				</div>
			</div>

			<div class="tool-measurement-button mt-3 mb-3">
				<button id="dist_b" type="button" class="btn-map d-block btn-measure" onclick="distStart();">거리</button>								
			</div>
			
			<div class="tool-measurement-button mt-3 mb-3">
				<button type="button" class="btn-map d-block btn-measure">축척<span data-gis-zoom>0</span></button>
			</div>			
						
			<button type="button" class="btn-map d-block btn-zoom-in border-bottom-0"><i class="ki ki-plus text-dark"></i></button>
			<button type="button" class="btn-map d-block btn-zoom-out border-top-secondary"><i class="ki ki-minus text-dark"></i></button>
		</div>	

	<!-- 거리/면적 재기 -->
	<div id="measureOff" class="measure" style="display:none;" onmouseenter="measureHover();"><span></span></div>
	<!-- over -->
	<div id="measureOn" class="measure2" style="display:none;" onmouseleave="measureHover();">
		<ul>
			<!-- 면적 재기 --><li class="area"><span class="off"><a href="javascript:;" onclick="areaStart();"></a></span></li><!-- off 상태 -->
			<!-- 거리 재기 --><li class="distance"><span class="off"><a href="javascript:;" onclick="distStart();"></a></span></li><!-- 클릭 시 on 상태 -->
		</ul>
	</div>
</div>

<div id="wrapGisPopup" class="z_leaflet-popup" style="display:none;">
	<div class="z_leaflet-popup-content">
		<div class="z_leaflet-content-box">
			<div class="z_leaflet-header">
				<h3><span id="spnm">임대료</span></h3>
				<strong><span id="spdt">등록일 : </span><span></span></strong>
			</div>
			<div class="leaflet-body scroll ps ps--active-y" data-scroll="true" data-height="155" data-mobile-height="155" style="height: 155px; overflow: hidden;">
			</div>
			<div class="z_leaflet-footer">
				<button type="button" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold" id="mapInfo1">더보기</button>
			</div>
		</div>
		<div class="t_arrow" style="top:325px"></div>
	</div>
	<button class="z_leaflet-popup-close-button"><i class="ki ki-close"></i></button>
</div>

<!-- //wrap -->
<!--end::Scrolltop-->
		<script src="/resources/common/custom/plugins/global/plugins.bundle.js"></script>
		<script src="/resources/common/custom/plugins/custom/prismjs/prismjs.bundle.js"></script>		
		
 		<!-- <script src="/resources/common/core/3rd_extends/leaflet.draw/leaflet.draw-src.js" type="text/javascript"></script> -->
		<script src="https://cdn.jsdelivr.net/npm/@turf/turf@5/turf.min.js" type="text/javascript"></script>	
		<script src="/resources/admin/APPS/gis/building_apiAddress.js" type="text/javascript"></script>
		<!--end::Global Theme Bundle-->
		<!--begin::Page Scripts(used by this page)-->
		<!-- <script src="/resources/common/custom/js/pages/gis/nouislider.js"></script> -->
		<!-- <script src="/resources/common/custom/js/pages/gis/buildingcharts.js"></script> -->
		<script src="/resources/common/custom/plugins/custom/owlcarousel/owl.carousel.min.js"></script>
		
		<!-- <script src="/resources/common/custom/js/pages/gis/nouislider.js"></script> -->
		<script charset='UTF-8' src="/resources/admin/APPS/gis/apiBuildingDtl.js"></script>
		
		<script src="https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js"></script>
		<script src="https://unpkg.com/xlsx@0.16.9/dist/xlsx.core.min.js"></script>
		<!-- store js -->
		<script src="https://unpkg.com/store@2.0.12/dist/store.modern.min.js"></script>		

		<script>
 			jQuery(document).ready(function() {
 				$.when(
 					$.getScript("/api/gis/js/dawulMap.do")
 				).always(function() {
 					$.when(	
 						$.getScript("/resources/common/custom/js/tooltipLayout.js"),
 						$.getScript("/resources/common/custom/js/commonup.js")	
 					).always(function() {
 						init();
 					});
 				});
 			});
		</script>
		<!--end::Page Scripts-->
<!-- custom-scrollbar js -->
<script src="/resources/common/custom/plugin/scrollbar/jquery.mCustomScrollbar.concat.min.js"></script>
<!-- //custom-scrollbar js -->


</body>


<!-- //body -->