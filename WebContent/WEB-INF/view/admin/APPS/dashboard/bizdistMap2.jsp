<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:out value="<script type='text/template' id='tmplBizdistList'>" escapeXml="false" />
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
{{#each bizdistArr}}
	<li class="nav-item m-0">
		<a href="javascript:;" class="nav-link rounded-0" data-toggle="pill"
			data-list-addr-bizdistseq="{{순번}}" data-list-addr-bizdistcd="{{adm_cd}}" data-list-addr-bizdist="{{bizdist_nm}}" 
			data-list-addr-x="{{x좌표}}" data-list-addr-y="{{y좌표}}">{{bizdist_nm}}</a>
	</li>
{{/each}}
<c:out value="</script>" escapeXml="false" />


<!--begin::Modal-->
<div id="modalBizdist" class="modal fade" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-lg">
		<div class="modal-content searchbizdist">
			<div class="font-size-lg font-dark px-6 py-4 border-bottom"><span data-addr-sido></span> <i class="ki ki-arrow-next icon-sm"></i> <span data-addr-sgg></span> <i class="ki ki-arrow-next icon-sm"></i> <span data-addr-bizdist></span></div>
												
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
				<div class="map-body">
					<div id="map" style="width: 100%; height: 100%;"></div>
				</div>
			</div>
			
			<button type="button" class="btn-map d-block btn-zoom-in border-bottom-0"><i class="ki ki-plus text-dark"></i></button>
			<button type="button" class="btn-map d-block btn-zoom-out border-top-secondary"><i class="ki ki-minus text-dark"></i></button>
			
			<div class="modal-footer justify-content-center">
				<button type="reset" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold" data-dismiss="modal" aria-label="Close">닫기</button>
				<button class="btn btn-danger btn-sm mr-2 rounded-0 btnSearchAddrClose">검색</button>
				<button class="btn btn-outline-secondary btn-sm rounded-0 btnSearchAddrClose">취소</button>
			</div>
		</div>
	</div>
</div>
<!--end::Modal-->