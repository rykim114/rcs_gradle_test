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
				        <a class="nav-link font-size-lg px-5" href="javascript:;" onclick="userCount();">접속자리스트</a>
					</li>
					<li class="nav-item">
					    <a class="nav-link font-size-lg px-5" href="javascript:;" onclick="menuCount();">메뉴별/버튼 클릭수</a>
					</li>
					<li class="nav-item">
					    <a class="nav-link active font-size-lg px-5" href="javascript:;" onclick="searchCount();">주요 검색 지역</a>
					</li>
					<li class="nav-item">
					    <a class="nav-link font-size-lg px-5" href="javascript:;" onclick="downloadCount();">주요 다운로드 메뉴</a>
				    </li>
				</ul>
				<!--end:: Nav Line -->
                <!--begin: Search Form-->
				<div class="mt-9 mb-7" data-wrapper="searchDetail">
					<div class="row align-items-center">
						<div class="searchTerm">
							<label class="font-size-lg">기간별검색</label>
							<div class="input-daterange input-group" id="kt_datepicker_1" data-search-time>
								<input type="text" class="form-control" name="startYMD" placeholder="연도 선택" />
								<span class="input-group-text border-left-0">
									<i class="la la-calendar-check-o"></i>
								</span>
								<div class="px-2 py-3">~</div>
								<input type="text" class="form-control" name="endYMD" placeholder="연도 선택" />
								<span class="input-group-text border-left-0">
									<i class="la la-calendar-check-o"></i>
								</span>
							</div>
						</div>
						<div class="toggleTerm col-lg-3 col-xl-4">
							<button type="button" class="btn btn-dark btn-search px-6" data-btn-ok>검색</button>
						</div>
					</div>
				</div>
				<div class="row pt-15">
					<div class="col-5 pr-5">
						<div class="section" data-wrapper="tableLogMinMax">
							<h4>최대 주소 순위</h4>
							<div class="ranking-wrap">
								<ul data-list>
								</ul>
							</div>
						</div>
						<div class="section" data-wrapper="tableLogClick">
							<h4 class="d-flex align-items-center justify-content-between">
								<label>검색지역</label>
								<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1" data-btn-download>
									<i class="flaticon-download icon-md"></i>
									다운로드
								</button>
							</h4>
							<table class="table table-vertical mb-0" data-table="head">
								<colgroup>
									<col width="80px">
									<col width="*">
									<col width="120px">
								</colgroup>
								<thead class="thead-light">
								<tr>
									<th>no</th>
									<th>검색지역</th>
									<th>검색건수</th>
								</tr>
								</thead>
							</table>
							<div data-scroll="true" data-height="270">
								<table class="table table-vertical" data-table="body">
									<colgroup>
										<col width="80px">
										<col width="*">
										<col width="120px">
									</colgroup>
									<tbody>
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div class="col-7 pl-5">
						<div class="row" data-wrapper="tableLogMinMax">
							<div class="col-6 pr-5">
								<div class="section">
									<h4>최대 읍면동 순위</h4>
									<div class="ranking-wrap">
										<ul data-list>
										</ul>
									</div>
								</div>
							</div>
							<div class="col-6 pl-5">
								<div class="section">
									<h4>최대 상권 순위</h4>
									<div class="ranking-wrap">
										<ul data-list>
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div class="section">
							<h4>시간별(클릭 수 높은 지역)</h4>
							<div class="chart" id="useLogTimeClick"></div>
						</div>
					</div>
				</div>
			</div>
			<!--end: Card Body-->
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
		<td class="text-left">{{검색지역}}</td>
		<td class="text-right">{{tdText}}</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />


<c:out value="<script type='text/template' id='tmplTableLogMinMax'>" escapeXml="false" />
{{#each dataArr}}
	<li>
		<div>
			<label data-toggle="tooltip" data-placement="left" data-width="auto" title="{{검색지역}}">{{검색지역}}</label>
			<strong {{#if @first}}class="on"{{/if}}>{{{tdText}}}</strong>
		</div>
	</li>
{{/each}}
<c:out value="</script>" escapeXml="false" />

