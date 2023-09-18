<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:out value="<script type='text/template' id='tmplAddrList'>" escapeXml="false" />
{{#each sidoArr}}
	<li class="nav-item m-0">
		<a href="javascript:;" class="nav-link rounded-0" data-toggle="pill"
			data-list-addr-sido="{{sidonm}}" data-list-addr-x="{{x좌표}}" data-list-addr-y="{{y좌표}}">{{sidonm}}</a>
	</li>
{{/each}}
{{#each sggArr}}
	<li class="nav-item m-0">
		<a href="javascript:;" class="nav-link rounded-0" data-toggle="pill"
			data-list-addr-sgg="{{sggnm}}" data-list-addr-x="{{x좌표}}" data-list-addr-y="{{y좌표}}">{{sggnm}}</a>
	</li>
{{/each}}
{{#each dongArr}}
	<li class="nav-item m-0">
		<a href="javascript:;" class="nav-link rounded-0" data-toggle="pill"
			data-list-addr-dong="{{dongnm}}" data-list-addr-x="{{x좌표}}" data-list-addr-y="{{y좌표}}">{{dongnm}}</a>
	</li>
{{/each}}
<c:out value="</script>" escapeXml="false" />



<c:out value="<script type='text/template' id='tmplAddrTextSearchList'>" escapeXml="false" />
{{#if searchArr}}
<div class="map_search_list_wrap pa_list">
<div class="map_search_list" >
	<div class="addressListForm">

	{{#each searchArr}}
		<div class="JusoResult list clear">
			<!-- class on : 리스트 on 상태 -->
			<!-- pin -->
			<div class="pin"><i class="flaticon2-pin"></i></div>
			<dl class="one_depth_dl clear">
				<dt data-btn-gis data-gis-x="{{geometry.coordinates.[0].[0].[1]}}" data-gis-y="{{geometry.coordinates.[0].[0].[0]}}">{{properties.name}}</dt>
			{{#if isSubList}}
				<dd class="sub_address plus" data-btn-road="{{properties.code}}">
					<a href="javascript:;" ></a>
				</dd>
			{{/if}}
			</dl>
		{{#if isSubList}}
			<!--S: 2뎁스 주소 -->
			<div class="sub_list slist clear" data-list-road="{{properties.code}}">
			</div>
			<!-- E: 2뎁스 주소 -->			
		{{/if}}
		</div>
	{{/each}}
	</div>
</div>
</div>
{{else}}
	<p class="font-size-h3 text-center py-20 text-muted">검색결과가 없습니다.</p>
{{/if}}
<c:out value="</script>" escapeXml="false" />

<c:out value="<script type='text/template' id='tmplAddrRoadSubList'>" escapeXml="false" />
{{#each searchArr}}
	<div class="subGeoResult blank clear" data-btn-gis data-gis-x="{{geometry.coordinates.[0].[0].[1]}}" data-gis-y="{{geometry.coordinates.[0].[0].[0]}}">
		<div class="pin"><i class="flaticon2-pin"></i></div>
		<dl>
			<dt>{{properties.newrpnuname}}</dt>
			<dd>{{properties.addrname}}</dd>
		</dl>
	</div>
{{/each}}
<c:out value="</script>" escapeXml="false" />

<c:out value="<script type='text/template' id='tmplPlaceTextSearchList'>" escapeXml="false" />
{{#if searchArr}}
<div class="map_search_list_wrap pa_list">
<div class="map_search_list">
	<div class="poiListForm">
	{{#each searchArr}}
		<div class="PoiResult list clear">
			<!-- pin -->
			<div class="pin"><i class="flaticon2-pin"></i></div>
			<dl class="one_depth_dl" data-btn-gis data-gis-x="{{geometry.coordinates.[1]}}" data-gis-y="{{geometry.coordinates.[0]}}">
				<dt>{{properties.name}}</dt>
				<dd class="txt">{{properties.newrpnuname}}</dd>
				<dd class="txt2">지번 : {{properties.pnuname}}</dd>
				<dd class="blank"></dd>
				<dd class="txt2">{{properties.sv_cls}}</dd>
			</dl>
		</div>
	{{/each}}
	</div>
</div>
</div>
<!--
	<div class="">
		<button type="button" class="btn btn-square btn-secondary border-0 bg-light-secondary btn-block font-size-lg">+ 더보기</button>
	</div>
-->
{{else}}
	<p class="font-size-h3 text-center py-20 text-muted">검색결과가 없습니다.</p>
{{/if}}
<c:out value="</script>" escapeXml="false" />


<c:out value="<script type='text/template' id='tmplAllTextSearchList'>" escapeXml="false" />
<div class="map_search_list_wrap pa_list">
<div class="map_search_list">
	<div class="result_num clear">
		<h2>
			<!-- 건수 -->
			<span class="num">주소</span>
			<!-- 더보기 버튼 -->
			<span class="more" ><a class="lan_etcList" data-btn-toggle-tab="#kt_tab_pane_5" href="javascript:;">더보기<i class="ki ki-arrow-next icon-sm"></i></a></span>
		</h2> 
	</div>
	<div class="addressListForm">
	{{#if addrArr}}
	{{#each addrArr}}
		<div class="JusoResult list clear">
			<!-- class on : 리스트 on 상태 -->
			<!-- pin -->
			<div class="pin"><i class="flaticon2-pin"></i></div>
			<dl class="one_depth_dl clear">
				<dt data-btn-gis data-gis-x="{{x}}" data-gis-y="{{y}}">{{properties.name}}</dt>
			{{#if isSubList}}
				<dd class="sub_address plus" data-btn-road="{{properties.code}}">
					<a href="javascript:;" ></a>
				</dd>
			{{/if}}
			</dl>
		{{#if isSubList}}
			<!--S: 2뎁스 주소 -->
			<div class="sub_list slist clear" data-list-road="{{properties.code}}">
			</div>
			<!-- E: 2뎁스 주소 -->			
		{{/if}}
		</div>
	{{/each}}
	{{else}}
		<p class="font-size-h3 text-center py-5 text-muted">검색결과가 없습니다.</p>
	{{/if}}

	</div>
</div>

<div class="map_search_list">
	<div class="result_num clear">
		<h2>
			<!-- 건수 -->
			<span class="num">장소</span>
			<!-- 더보기 버튼 -->
			<span class="more" ><a class="lan_etcList" data-btn-toggle-tab="#kt_tab_pane_6" href="javascript:;">더보기<i class="ki ki-arrow-next icon-sm"></i></a></span>
		</h2> 
	</div>
	<div class="poiListForm">
	{{#if placeArr}}
	{{#each placeArr}}
		<div class="PoiResult list clear">
			<!-- pin -->
			<div class="pin"><i class="flaticon2-pin"></i></div>
			<dl class="one_depth_dl" data-btn-gis data-gis-x="{{geometry.coordinates.[1]}}" data-gis-y="{{geometry.coordinates.[0]}}">
				<dt>{{properties.name}}</dt>
				<dd class="txt">{{properties.newrpnuname}}</dd>
				<dd class="txt2">지번 : {{properties.pnuname}}</dd>
				<dd class="blank"></dd>
				<dd class="txt2">{{properties.sv_cls}}</dd>
			</dl>
		</div>
	{{/each}}
	{{else}}
		<p class="font-size-h3 text-center py-5 text-muted">검색결과가 없습니다.</p>
	{{/if}}

	</div>
</div>
</div>
<c:out value="</script>" escapeXml="false" />

<c:out value="<script type='text/template' id='tmplBizdistList'>" escapeXml="false" />
{{#if searchArr}}
<div class="map_search_list_wrap pa_list">
<div class="map_search_list">
	<div class="poiListForm">
	{{#each searchArr}}
		<div class="PoiResult list clear">
			<!-- pin -->
			<div class="pin"><i class="flaticon2-pin"></i></div>
			<dl class="one_depth_dl" data-btn-bizdist="{{bizdist.순번}}" data-gis-x="{{center.[0]}}" data-gis-y="{{center.[1]}}">
				<dt>{{bizdist.상권}}</dt>
				<dd class="txt"></dd>
				<dd class="txt2"></dd>
				<dd class="blank"></dd>
				<dd class="txt2"></dd>
			</dl>
		</div>
	{{/each}}
	</div> 
</div>
</div>
{{else}}
	<p class="font-size-h3 text-center py-5 text-muted">검색결과가 없습니다.</p>
{{/if}}
<c:out value="</script>" escapeXml="false" />
