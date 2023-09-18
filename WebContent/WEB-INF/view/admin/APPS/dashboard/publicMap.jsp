<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:out value="<script type='text/template' id='tmplAreaList'>" escapeXml="false" />
{{#each sidoArr}}
	<li class="nav-item m-0">
		<a href="javascript:;" class="nav-link rounded-0" data-toggle="pill" data-list-addr-sidonm="{{지역}}">{{지역}}</a>
	</li>
{{/each}}
{{#each wideAreaArr}}
	<li class="nav-item m-0">
		<a href="javascript:;" class="nav-link rounded-0" data-toggle="pill" data-list-addr-sidonm="{{지역}}" data-list-addr-wideareanm="{{광역상권}}">{{광역상권}}</a>
	</li>
{{/each}}
{{#each areaArr}}
	<li class="nav-item m-0">
		<a href="javascript:;" class="nav-link rounded-0" data-toggle="pill" 
		    data-list-addr-sidonm="{{지역}}" data-list-addr-wideareanm="{{광역상권}}" data-list-addr-areanm="{{하위상권}}">{{하위상권}}</a>
	</li>
{{/each}}
<c:out value="</script>" escapeXml="false" />


<div class="dropdown-menu p-0 m-0 dropdown-menu-xl rounded-0 border dropdown-menu-center market_UI searchbizdist" id="divSearchArea" style="display: none;"><!-- 상권으로 검색 활성화 시 market_ui 클래스 추가 -->
	<div class="font-size-lg font-dark px-6 py-4 border-bottom">
		<span data-addr-sidonm></span>
		<i class="ki ki-arrow-next icon-sm"></i>
		<span data-addr-wideareanm></span>
		<i class="ki ki-arrow-next icon-sm"></i> 
		<span data-addr-areanm></span>
	</div>
	<div class="row no-gutters" id="addrWrapper">
		<div class="col scroll ps border-right" data-scroll="true" data-height="300" data-mobile-height="200" style="height:300px">
			<ul class="nav flex-column nav-light-danger nav-address nav-pills">
			</ul>
		</div>
		<div class="col scroll ps border-right" data-scroll="true" data-height="300" data-mobile-height="200" style="height:300px">
			<ul class="nav flex-column nav-light-danger nav-address nav-pills">
			</ul>
		</div>
		<div class="col scroll ps border-right" data-scroll="true" data-height="300" data-mobile-height="200" style="height:300px">
			<ul class="nav flex-column nav-light-danger nav-address nav-pills">
			</ul>
		</div>
	</div>
	<div class="text-center px-6 py-4 border-top">
		<button class="btn btn-danger btn-sm mr-2 rounded-0 btnSearchAreaOk">검색</button>
		<button class="btn btn-outline-secondary btn-sm rounded-0 btnSearchAreaClose">취소</button>
	</div>
</div>