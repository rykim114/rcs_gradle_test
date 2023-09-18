<%@ page language="java" contentType="text/html; charset=UTF-8"	session="true" pageEncoding="utf-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!-- Notice Popup Modal -->
<div class="main_popup_wrap open"><!-- 클래스 open 삭제시 닫힘  -->
	<div class="popup_area">
		<!-- 팝업컨텐츠영역 -->
		<div class="content_area">
			<input type="hidden" id="noticeSeq"/>
			<input type="hidden" id="noticeStartDate"/>
			<input type="hidden" id="noticeEndDate"/>
			<dl>
				<dt id="noticeTitle"></dt>
				<dd id="noticeContent">
				</dd>
			</dl>
		</div>
		<!--// 팝업컨텐츠영역 -->
		<div class="util_area">
			<div class="checkbox-inline">
				<label class="checkbox">
					<input type="checkbox" id="popupClose" name="Checkboxes1" value="N">
					<span></span>
					다시 보지 않기
				</label>
			</div>
				<a href="javascript:;" class="but_notice_view">자세히보기</a>
		</div>
		<a href="javascript:;" class="but_close">닫기</a>
	</div>
</div>
<!-- end:: Notice Popup Modal -->

<div class="d-flex flex-column-fluid index">
	<!--begin::Container-->
	<div class="container-fluid pb-5">
		<!--begin::Dashboard-->
		<!--begin::Row-->
		<div class="row" style="height: 99%;">
			<div class="col-6">
				<div class="row">
					<div class="col-6">
						<div class="card card-custom card-stretch rounded-0 gutter-b dashboardTitle" data-chart-wrapper>
							<!-- 230816수정 -->
							<h1>
								<!--<img src="/resources/common/custom/media/logos/logo.png" alt="logo-RCS" style="height: 50px;">--> <strong>지역현황 대시보드</strong>
							</h1>
							<!--// 230816수정 -->
							<h5 style="text-align: center;"><label>지역설정</label></h5>
							<div class="dropdown">
								<div class="" data-offset="10px,0px" id="btnSearchAddr">
									<button class="address" aria-expanded="true">
										<span><span data-addr-sido></span> <span data-addr-sgg></span> <span data-addr-dong></span></span><i class="fa fa-angle-down"></i>
									</button>
								</div>
								<div class="dropdown-menu p-0 m-0 dropdown-menu-xl rounded-0 border dropdown-menu-center" id="divSearchAddr" style="display: none;">											
									<div class="font-size-lg font-dark px-6 py-4 border-bottom">
										<span data-addr-sido></span> <i class="ki ki-arrow-next icon-sm"></i> <span data-addr-sgg></span> <i class="ki ki-arrow-next icon-sm"></i> <span data-addr-dong></span>
									</div>
									<div class="row no-gutters" id="addrWrapper">
										<div class="col scroll ps border-right" data-scroll="true" data-height="300" data-mobile-height="200" style="height:300px">
											<ul class="nav flex-column nav-light-danger nav-address nav-pills">
											</ul>
										</div>
										<div class="col scroll ps border-right" data-scroll="true" data-height="300" data-mobile-height="200" style="height:300px">
											<ul class="nav flex-column nav-light-danger nav-address nav-pills">
												<li class="nav-item m-0 all-item">
													<a href="javascript:;" class="nav-link rounded-0 active" data-toggle="pill" data-list-addr-sgg="" data-list-addr-sggcd="">전체</a>
												</li>
											</ul>
										</div>
										<div class="col scroll ps border-right" data-scroll="true" data-height="300" data-mobile-height="200" style="height:300px">
											<ul class="nav flex-column nav-light-danger nav-address nav-pills">
												<li class="nav-item m-0 all-item">
													<a href="javascript:;" class="nav-link rounded-0 active" data-toggle="pill" data-list-addr-dong="" data-list-addr-dongcd="">전체</a>
												</li>
											</ul>
										</div>
									</div>
									<div class="text-center px-6 py-4 border-top">
										<button class="btn btn-danger btn-sm mr-2 rounded-0 btnSearchAddrClose">검색</button>
										<button class="btn btn-outline-secondary btn-sm rounded-0 btnSearchAddrClose">취소</button>
									</div>
								</div>
							</div>	
						</div>
					</div>												
					<div class="col-6">
						<div class="card card-custom card-stretch rounded-0 gutter-b" data-chart-wrapper>
							<div class="card-header zindex-2">
								<h3>임대료 변동률</h3>
								<div class="unit">
									(기준: 1F 전용면적당 임대료 변동률, 단위: %)
								</div>
							</div>
							<div class="card-body">
		<!--														<img src="assets/images/chart_index_01.png">-->
								<div class="chart" id="chartRentChange"></div>
							</div>
							<div class="card-footer p-0 border-none">
								<div class="unit float-right"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-6">
				<div class="card card-custom card-stretch rounded-0 gutter-b" data-chart-wrapper>
					<div class="card-header zindex-2">
						<h3>공급동향(분양)</h3>
						<div class="unit">
							(단위:점포수)
						</div>
	<!--												<div class="card-toolbar"><span class="font-size-sm">(단위: 상가유형, 만원)</span></div>-->
					</div>
					<div class="card-body">
	<!--												<img src="assets/images/chart_index_02.png">-->
						<div class="row w100p">
							<div class="col-6">
								<div class="chart right" id="chartSupply"></div>
							</div>
							<div class="col-6">
								<div class="chart right" id="chartSupply2"></div>
							</div>
						</div>
	
					</div>
					<div class="card-footer p-0 border-none">
						<div class="unit float-right"></div>
					</div>
				</div>
			</div>
			
			<div class="col-6">
				<div class="card card-custom card-stretch rounded-0 gutter-b" data-chart-wrapper>
					<div class="card-header zindex-2">
						<h3>상가유형별 평균분양가</h3>
						<div class="unit">
							(기준: 전용면적, 단위: 만원/3.3㎡)
						</div>
					</div>
					<div class="card-body">
						<div class="chart" id="chartAverageRent"></div>
					</div>
					<div class="card-footer p-0 border-none">
						<div class="unit float-right"></div>
					</div>
				</div>
			</div>
			<div class="col-6">
				<div class="card card-custom card-stretch rounded-0 gutter-b" data-chart-wrapper>
					<div class="card-header zindex-2">
						<h3>상가유형별 평균임대료</h3>
						<div class="unit">
							(기준: 1F 전용면적, 단위: 만원/3.3㎡)
						</div>
					</div>
					<div class="card-body">
						<div class="chart" id="chartAveragesale"></div>
					</div>
					<div class="card-footer p-0 border-none">
						<div class="unit float-right"></div>
					</div>
				</div>
			</div>
			<div class="col-6">
				<div class="row">
					<div class="col-6">
						<div class="card card-custom card-stretch rounded-0 gutter-b" data-chart-wrapper>
							<div class="card-header zindex-2">
								<h3>매출정보추이</h3>
								<div class="unit">
									(단위:억원/총매출,만명/유동인구)
								</div>
							</div>
							<div class="card-body">
	<!--														<img src="assets/images/chart_index_05.png">-->
								<div class="chart" id="chartInformationTrend"></div>
							</div>
							<div class="card-footer p-0 border-none">
								<div class="unit float-right"></div>
							</div>
						</div>
					</div>
					<div class="col-6">
						<div class="card card-custom card-stretch rounded-0 gutter-b" data-chart-wrapper>
							<div class="card-header zindex-2">
								<h3>업종정보</h3>
								<div class="unit">
									(단위:개소)
								</div>
							</div>
							<div class="card-body">
	<!--														<img src="assets/images/chart_index_06.png">-->
								<div class="chart" id="chartIndustryInformation"></div>
							</div>
							<div class="card-footer p-0 border-none">
								<div class="unit float-right"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-6">
				<div class="card card-custom card-stretch rounded-0 gutter-b" data-chart-wrapper>
					<div class="card-header">
						<h3>인구정보</h3>
					</div>
					<div class="card-body">
	<!--												<img src="assets/images/chart_index_07.png">-->
						<div class="d-flex w100p">
							<div class="people-first-chart zindex-2">
								<h4>각 특성 인구 연도별 추이 
									<span style="font-weight:normal;">
										(단위:만명)
									</span>
								</h4>
								<div class="chart" id="chartPopulationInformationYears"></div>
							</div>
							<div class="people-second-chart">
								<h4 id="man_cnt"></h4>
								<div class="row donut">
									<div class="col-4">
										<div class="chart" id="chartPopulationInformationFab1"></div>
										<div class="label-lady first">
											<label id='dwl_label'></label>
											<strong id='dwl_data'></strong>
										</div>
									</div>
									<div class="col-4">
										<div class="chart" id="chartPopulationInformationFab2"></div>
										<div class="label-lady second">
											<label id='plc_label'></label>
											<strong id='plc_data'></strong>
										</div>
									</div>
									<div class="col-4">
										<div class="chart" id="chartPopulationInformationFab3"></div>
										<div class="label-lady third">
											<label id='flow_label'></label>
											<strong id='flow_data'></strong>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="card-footer p-0 border-none">
						<div class="unit float-right"></div>
					</div>
				</div>
			</div>
		</div>
	<!--end::Row-->
	</div>
	<!--end::Dashboard-->
</div>
<!--end::Container-->
</div>
<!--end::Entry-->


<c:out value="<script type='text/template' id='tmplAddrList'>" escapeXml="false" />
	{{#each sidoArr}}
		<li class="nav-item m-0">
			<a href="javascript:;" class="nav-link rounded-0" data-toggle="pill"
				data-list-addr-sido="{{sidonm}}" data-list-addr-sidocd="{{sidocd}}" data-list-addr-x="{{x좌표}}" data-list-addr-y="{{y좌표}}">{{sidonm}}</a>
		</li>
	{{/each}}
	{{#each sggArr}}
		<li class="nav-item m-0">
			<a href="javascript:;" class="nav-link rounded-0" data-toggle="pill"
				data-list-addr-sgg="{{sggnm}}" data-list-addr-sggcd="{{sggcd}}" data-list-addr-x="{{x좌표}}" data-list-addr-y="{{y좌표}}">{{sggnm}}</a>
		</li>
	{{/each}}
	{{#each dongArr}}
		<li class="nav-item m-0">
			<a href="javascript:;" class="nav-link rounded-0" data-toggle="pill"
				data-list-addr-dong="{{dongnm}}" data-list-addr-dongcd="{{dongcd}}" data-list-addr-x="{{x좌표}}" data-list-addr-y="{{y좌표}}">{{dongnm}}</a>
		</li>
	{{/each}}
<c:out value="</script>" escapeXml="false" />
		
