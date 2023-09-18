<%@ page language="java" contentType="text/html; charset=UTF-8"	session="true" pageEncoding="utf-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!--begin::Entry-->
<div class="user-log d-flex flex-column-fluid">
	<!--begin::Container-->
	<div class="container-fluid">
		<!--begin::Card-->
		<div class="card card-custom card-stretch rounded-0">
		    <!--begin::Header-->
		    <div class="card-header align-items-center border-bottom">
		        <h3 class="card-title align-items-center">
		            <span class="font-weight-bolder text-dark">사용자로그분석</span>
		        </h3>
		        <div class="card-toolbar">
					<div class="d-flex align-items-center">
						<i class="flaticon-buildings text-dark mb-1"></i>
						<i class="ki ki-arrow-next icon-sm mx-2"></i>
						사용자로그분석
					</div>
		        </div>
		    </div>
		    <!--end::Header-->
		    <!--begin::Body-->
		    <div class="card-body pt-9">
		        <!--begin:: Nav Line -->
		        <ul class="nav nav-tabs nav-tabs-line nav-tabs-line-2x nav-tabs-line-danger">
		            <li class="nav-item">
		                <a class="nav-link active font-size-lg px-5" href="javascript:;" onclick="userCount();">접속자수</a>
		            </li>
		            <li class="nav-item">
		                <a class="nav-link font-size-lg px-5" href="javascript:;" onclick="menuCount();">메뉴별/버튼 클릭수</a>
		            </li>
		            <li class="nav-item">
		                <a class="nav-link font-size-lg px-5" href="javascript:;" onclick="searchCount();">주요 검색 지역</a>
		            </li>
		            <li class="nav-item">
		                <a class="nav-link font-size-lg px-5" href="javascript:;" onclick="downloadCount();">주요 다운로드 메뉴</a>
		            </li>
		        </ul>
		        <!--end:: Nav Line -->

				<div class="row" style="margin-top:40px;">
					<div class="col-5" data-wrapper="tableVisit">
						<div class="connectCount">
							<div class="count-wrap">
								<span data-date> </span>
								<strong>접속자 수</strong>
								<label data-cnt>0<em>명</em></label>
							</div>
						</div>
					</div>
					<div class="col-7">
						<div class="relative">
							<h4 class="d-flex align-items-start justify-content-between">
								메뉴별 페이지뷰
								<ul class="radioSelect">
									<li class="on" data-menu-cd="MA01%,MA02%,MA03%,MA04%"><strong><span></span>서비스</strong></li>
									<li data-menu-cd="MA05%"><strong><span></span>사용자페이지</strong></li>
									<li data-menu-cd="MA06%"><strong><span></span>관리자페이지</strong></li>
								</ul>
							</h4>
							<div id="useLogPageViewCount"></div>
						</div>
					</div>
				</div>
				<div class="row" style="margin-top:30px;">
					<div class="col-5 pr-5" style="margin-top:30px;" data-wrapper="tableLogMinMax">
						<div class="connect-list-wrap">
							<label class="title">메뉴별</label>
							<div class="connect-list">
								<ul data-list>
								</ul>
							</div>
						</div>
						<div class="connect-list-wrap">
							<label class="title">검색별</label>
							<div class="connect-list">
								<ul data-list>
								</ul>
							</div>
						</div>
						<div class="connect-list-wrap">
							<label class="title">다운로드별</label>
							<div class="connect-list">
								<ul data-list>
								</ul>
							</div>
						</div>
					</div>
					<div class="col-7 pl-5" data-wrapper="tableLogClick">
						<h4 class="d-flex align-items-center justify-content-between">
							인기 사용중인 페이지
							<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1" data-btn-download>
								<i class="flaticon-download icon-md"></i>
								다운로드
							</button>
						</h4>
						<table class="table-vertical" data-table="head">
							<colgroup>
								<col width="80px">
								<col width="*">
								<col width="20%">
								<col width="20%">
							</colgroup>
							<thead>
							<tr>
								<th>no</th>
								<th>사용중인 페이지</th>
								<th>건수</th>
								<th>사용률</th>
							</tr>
							</thead>
						</table>
						<div data-scroll="true" data-height="550">
							<table class="table table-vertical" data-table="body">
								<colgroup>
									<col width="80px">
									<col width="*">
									<col width="20%">
									<col width="20%">
								</colgroup>
								<tbody>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<!--end: Body-->

		</div>
		<!--end: Card-->
	</div>
	<!--end::Container-->
</div>
<!--end::Entry-->


<c:out value="<script type='text/template' id='tmplTableLogClick'>" escapeXml="false" />
{{#each dataArr}}
	<tr data-is-hidden="{{isHidden}}">
		<td>{{no}}</td>
		<td class="text-left">{{메뉴명}}</td>
		<td class="text-right">{{tdText}}</td>
		<td class="text-right">{{사용률}}</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />


<c:out value="<script type='text/template' id='tmplTableLogMinMax'>" escapeXml="false" />
{{#each dataArr}}
	<li>
		<div>
			<label data-toggle="tooltip" data-placement="left" data-width="auto" title="{{title}}">{{title}}</label>
			<strong {{#if @first}}class="on"{{/if}}>{{{tdText}}}</strong>
		</div>
	</li>
{{/each}}
<c:out value="</script>" escapeXml="false" />

