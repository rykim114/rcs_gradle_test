<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:out value="<script type='text/template' id='tmplAreaList'>" escapeXml="false" />
{{#each sidoArr}}
	<li class="nav-item m-0">
		<a href="javascript:;" class="nav-link rounded-0" data-toggle="pill"
			data-list-addr-sidocd="{{adm_cd}}" data-list-addr-sido="{{sidonm}}" data-list-addr-x="{{x좌표}}" data-list-addr-y="{{y좌표}}">{{sidonm}}</a>
	</li>
{{/each}}
{{#each sggArr}}
	<li class="nav-item m-0">
		<a href="javascript:;" class="nav-link rounded-0" data-toggle="pill"
			data-list-addr-sggcd="{{adm_cd}}" data-list-addr-sgg="{{sggnm}}" data-list-addr-x="{{x좌표}}" data-list-addr-y="{{y좌표}}">{{sggnm}}</a>
	</li>
{{/each}}
{{#each dongArr}}
	<li class="nav-item m-0">
		<a href="javascript:;" class="nav-link rounded-0" data-toggle="pill"
			data-list-addr-dongcd="{{adm_cd}}" data-list-addr-dong="{{dongnm}}" data-list-addr-x="{{x좌표}}" data-list-addr-y="{{y좌표}}">{{dongnm}}</a>
	</li>
{{/each}}
{{#each bizdistArr}}
	<li class="nav-item m-0">
		<a href="javascript:;" class="nav-link rounded-0" data-toggle="pill"
			data-list-addr-bizdistseq="{{순번}}" data-list-addr-bizdistcd="{{adm_cd}}" data-list-addr-bizdist="{{bizdist_nm}}" 
			data-list-addr-x="{{x좌표}}" data-list-addr-y="{{y좌표}}" data-geom="{{geom}}">{{bizdist_nm}}</a>
	</li>
{{/each}}
<c:out value="</script>" escapeXml="false" />


<div class="dropdown-menu p-0 m-0 dropdown-menu-xl rounded-0 border dropdown-menu-center market_UI searchbizdist" id="divSearchArea" style="display: none;"><!-- 상권으로 검색 활성화 시 market_ui 클래스 추가 -->
	<div class="font-size-lg font-dark px-6 py-4 border-bottom">
		<span data-addr-sido></span>
		<i class="ki ki-arrow-next icon-sm"></i>
		<span data-addr-sgg=""></span>
		<i class="ki ki-arrow-next icon-sm"></i> 
		<span data-addr-area=""></span>
		<!-- 1.체크박스 영역 마크업 추가 -->
		<div id="market_check" class="market_check_wrap"><input type="checkbox" value=""><span>상권으로 검색</span></div>
		<!-- // 1.체크박스 영역 마크업 추가 -->
	</div>
	<div class="row no-gutters" id="addrWrapper">
		<div id="pop_sido" class="col scroll ps border-right" data-scroll="true" data-height="300" data-mobile-height="200" style="height:300px">
			<ul class="nav flex-column nav-light-danger nav-address nav-pills">
			</ul>
		</div>
		<div id="pop_sgg" class="col scroll ps border-right" data-scroll="true" data-height="300" data-mobile-height="200" style="height:300px">
			<ul class="nav flex-column nav-light-danger nav-address nav-pills">
			</ul>
		</div>
		<div id="pop_area" class="col scroll ps border-right" data-scroll="true" data-height="300" data-mobile-height="200" style="height:300px">
			<ul class="nav flex-column nav-light-danger nav-address nav-pills">
			</ul>
		</div>
	</div>
	<div class="text-center px-6 py-4 border-top">
		<button class="btn btn-danger btn-sm mr-2 rounded-0 btnSearchAreaOk">검색</button>
		<button class="btn btn-outline-secondary btn-sm rounded-0 btnSearchAreaClose">취소</button>
	</div>
	<!-- 3.지도 미리보기 영역 마크업 추가 -->
	<div class="market_map_warp"  style="display: none;">
		<div id="map" style="width: 100%; height: 100%;"></div>
	</div>
	<!-- // 3.지도 미리보기 영역 마크업 추가 -->	
</div>