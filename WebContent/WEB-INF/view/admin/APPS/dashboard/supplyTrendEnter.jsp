<%@ page language="java" contentType="text/html; charset=UTF-8"	session="true" pageEncoding="utf-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!--begin::Entry-->
<div class="d-flex flex-column-fluid dashboard dashboard2">
	<!--begin::Container-->
	<div class="container-fluid">
		<!--begin::Card-->
		<div class="card card-custom card-stretch rounded-0">
			<!--begin::Header-->
			<div class="card-header align-items-center">
				<h3 class="card-title align-items-center">
					<span class="font-weight-bolder text-dark">공급동향(입주)</span>
				</h3>
				<div class="card-toolbar">
					<div class="d-flex align-items-center">
						<i class="flaticon-buildings text-dark mb-1"></i>
						<i class="ki ki-arrow-next icon-sm mx-2"></i>
						<a href="javascript:;">지역현황판</a>
						<i class="ki ki-arrow-next icon-sm mx-2"></i>
						<a href="javascript:;">공급동향</a>
					</div>
				</div>
			</div>
			
			<!-- 필터 -->
			<ul class="fliter_wrap searchResult2">
				<li>
					<label>지역선택 : </label>
					<button id="btnSearchArea">
						<span data-list-addr-chkbizdist= "" data-list-addr-sidocd="" data-list-addr-sggcd="" data-list-addr-dongcd="" data-list-addr-bizdist= ""></span>											
						<i class="fa fa-angle-down"></i>
					</button> 

					<%@ include file="/WEB-INF/view/admin/APPS/dashboard/areaMap.jsp"%>
				</li>
				<li data-search-sangga>
					<label>상가유형 : </label>
					<span>전체</span>
				</li>
				<li data-search-area>
					<label>면적유형 : </label>
					<span>전체</span>
				</li>
				<li>
					<label>검색기간 : </label>
					<span data-search-time></span>
				</li>
				<li data-search-start-time-wrapper>
					<label>시작시점 : </label>
					<span data-search-start-time></span>
				</li>
				<li>
					<label>검색기준 : </label>
					<span data-search-column-text></span>
				</li>
				<li>
					<label>결과유형 : </label>
					<span data-search-result-column-text></span>
				</li>
				<li class="filter_btn">
					<a href="javascript:;" class="searchOption filter_btn" data-btn-search-detail>검색옵션 <i class="fa fa-chevron-down"></i></a>
				</li>
			</ul>
			<!--end::Header-->
			<!--begin::Body-->
<!-- 			<div class="card-body"> -->
				<!--begin: Search Form-->
				<!--end:: Nav Line -->
				<!-- ################# tab 01 -->
				<div class="tab-content">
					<div class="tab-pane fade show active bg-light" role="tabpanel" id="tab01" data-wrapper="addr">
						<div class="card-body">
							<!-- search -->
							<div class="d-flex form-inline align-items-center pb-6">
								<div class="form-group">
									<label class="control-label">지역명 선택 : </label>
									<div class="">
										<div class="row">
											<div class="d-flex align-items-center">
												<select class="form-control selectpicker w-200px" name="listSido">
													<option value="">시, 도</option>
												</select>
											</div>
											<div class="d-flex align-items-center">
												<select class="form-control selectpicker w-200px" name="listSgg">
													<option value="">전체</option>
												</select>
											</div>
	
										</div>
									</div>
									<a href="javascript:;" class="searchOption" data-btn-search-detail>검색옵션 <i class="fa fa-chevron-down"></i></a>
								</div>
							</div>
							<!-- detail search -->
							<div data-search-mode="emd">
							<div class="detailSearch" data-wrapper="searchDetail" style="display: none;">
								<div class="navTabs">
									<!--begin:: Nav Line -->
									<ul class="nav nav-tabs nav-tabs-second nav-tabs-line nav-tabs-line-2x nav-tabs-line-danger">
										<li class="nav-item">
											<a class="nav-link active font-size-lg px-5" data-toggle="tab" data-target="#tab01_01">상가유형 기준</a>
										</li>
										<li class="nav-item">
											<a class="nav-link font-size-lg px-5" data-toggle="tab" data-target="#tab01_02">연면적 기준</a>
										</li>
									</ul>
									<!--end:: Nav Line -->
								</div>
								
								<div class="tab-content">
								<!-- ################# tab 01-01 -->
								<div class="tab-pane fade show active" role="tabpanel" id="tab01_01">
									<div data-column-mode="sangga">
									<div class="form-horizontal" data-ui-search-detail>
										<div class="form-group">
											<label class="control-label col-1">검색기간</label>
											<div class="col-7">
												<div class="d-flex align-items-center">
													<div class="radioWrap">
														<label><input type="radio" name="timeBound" value="month"> 월 (최근 1년)</label>
														<label><input type="radio" name="timeBound" value="quarter"> 분기</label>
														<label><input type="radio" name="timeBound" value="half"> 반기</label>
														<label><input type="radio" name="timeBound" value="year" checked="checked"> 년</label>
													</div>
												</div>
											</div>
											<div class="col-4">
												<div class="d-flex align-items-center">
													<label class="mr-10">시작시점</label>
													<div class="input-daterange input-group w-140px">
														<input type="text" class="form-control dateStart" name="startDurationYMD" />
														<span class="input-group-text border-left-0 cursor-pointer" data-btn-time="startDurationYMD">
															<i class="la la-calendar-check-o"></i>
														</span>
													</div>
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="control-label col-1">검색기간</label>
											<div class="col-11">
												<div class="d-flex align-items-center">
													<label class="mb-0 mr-10"><input type="radio" name="timeBound" value="custom"> 사용자 설정</label>
													<div class="input-daterange input-group w-140px mr-10" data-search-time>
														<input type="text" class="form-control dateStart" name="startYMD" />
														<span class="input-group-text border-left-0 cursor-pointer" data-btn-time="startYMD">
															<i class="la la-calendar-check-o"></i>
														</span>
													</div>
													<div class="input-daterange input-group w-140px" data-search-time>
														<input type="text" class="form-control dateEnd" name="endYMD" />
														<span class="input-group-text border-left-0 cursor-pointer" data-btn-time="endYMD">
															<i class="la la-calendar-check-o"></i>
														</span>
													</div>
													<label class="ml-10 mr-10">사용자 설정 시 합산 데이터가 제공되며 차트는 제공되지 않을 수 있습니다</label>
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="control-label col-1">상가유형</label>
											<div class="col-11 radioWrap" data-search-wrapper="sanggaType">
												<label><input type="checkbox" name="sanggaType" value="" checked="checked"> 전체선택</label>
												<label><input type="checkbox" name="sanggaType" value="근린상가"> 근린상가</label>
												<label><input type="checkbox" name="sanggaType" value="단지내상가"> 단지내 상가</label>
												<label><input type="checkbox" name="sanggaType" value="복합상가"> 복합 상가</label>
												<label><input type="checkbox" name="sanggaType" value="테마상가"> 테마 상가</label>
												<label><input type="checkbox" name="sanggaType" value="오피스상가"> 오피스 상가</label>
												<label><input type="checkbox" name="sanggaType" value="기타상가"> 기타 상가</label>
											</div>
										</div>
										<div class="form-group">
											<label class="control-label col-1">면적유형</label>
											<div class="col-11">
												<div class="btnWrap-group mb-2">
													<button class="btn btn-outline-danger" data-checked="true" data-area-unit="">㎡</button>
													<button class="btn btn-outline-darklight" data-area-unit="py">3.3㎡</button>
													<label class="ml-10 mr-10">면적유형 개별선택 시 선택된 면적유형의 합산 데이터가 제공됩니다</label>
												</div>
												
												<div class="mb-5 radioWrap large" data-search-wrapper="areaBound">
													<label><input type="checkbox" name="areaBound" value="" checked="checked"><span class="areaSpan"> 전체선택</span></label>
													<label><input type="checkbox" name="areaBound" value="0,1000"><span class="areaSpan"> 1,000 미만</span></label>
													<label><input type="checkbox" name="areaBound" value="1000,3000"><span class="areaSpan"> 1,000 이상 ~ 3,000 미만</span></label>
													<label><input type="checkbox" name="areaBound" value="3000,5000"><span class="areaSpan"> 3,000 이상 ~ 5,000 미만</span></label>
													<label><input type="checkbox" name="areaBound" value="5000,7000"><span class="areaSpan"> 5,000 이상 ~ 7,000 미만</span></label>
													<label><input type="checkbox" name="areaBound" value="7000,10000"><span class="areaSpan"> 7,000 이상 ~ 10,000 미만</span></label>
													<label><input type="checkbox" name="areaBound" value="10000,15000"><span class="areaSpan"> 10,000 이상 ~ 15,000 미만</span></label>
													<label><input type="checkbox" name="areaBound" value="15000,30000"><span class="areaSpan"> 15,000 이상 ~ 30,000 미만</span></label>
													<label><input type="checkbox" name="areaBound" value="30000,1000000000"><span class="areaSpan"> 30,000 이상</span></label>
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="control-label col-1">결과유형</label>
											<div class="col-11 radioWrap large">
												<label><input type="radio" name="resultColumn" value="총점포수" checked="checked" > 점포 수 (단위 : 개소)</label>
												<label><input type="radio" name="resultColumn" value="공급건수"> 공급 건 수 (단위 : 건)</label>
												<label><input type="radio" name="resultColumn" value="연면적"> 연면적 기준 (단위 : ㎡)</label>
											</div>
										</div>
										<div class="text-center mb-10 btnWrap">
											<button class="btn btn-danger btn-lg px-11 font-weight-bold" data-btn-ok>확인</button>
											<button class="btn btn-outline-secondary btn-lg px-11 font-weight-bold detailSearch-close" data-btn-close>취소</button>
										</div>
									</div>
									</div>
								</div>
	
								<!-- ################# tab 01-02 -->
								<div class="tab-pane fade mt-6" role="tabpanel" id="tab01_02">
									<div data-column-mode="area">
									</div>
								</div>
							</div>
							</div>
							</div>
							<!-- //detailSearch #01 -->
									
						<div data-content-mode="emd">
						<div class="detailContent">
							<div class="pb-20">
							<div class="fixedWrap" data-ui-user-date="false">
								<div class="d-flex justify-content-between align-items-center h-40px">
									<h3 class="mb-5 changeTitle" data-select-sgg>
										<span class="font-weight-bold text-dark"><span data-sgg-nm=""></span> <span data-search-column-text></span> 공급 추이</span>
										<i class="fa fa-question-circle icon-md ml-3 tooltipCustom">
											<span class="tooltipCustom-text">
												부동산R114가 자체 분류한 8가지 상가유형에 따라 연도별,면적별 상가 공급(입주)정보를 제공합니다.
												<br>
												<br>
												<img src="\resources\common\custom\images\help\help0103.png"
											</span>
										</i>
									</h3>
								</div>
								<!-- div class="scrollHorizonWrap">
									<a href="javascript:;" class="left"><i class="fa fa-angle-left"></i></a>
									<div class="scrollHorizon">
										<ul class="shoppingTypeList" data-list-dong>
										</ul>
									</div>
									<a href="javascript:;" class="right"><i class="fa fa-angle-right"></i></a>
								</div -->
								<div class="tableHeaderWrap"></div>
							</div> 
							
							<!-- chart start -->
							<div class="row" data-ui-user-date="false">
								<div class="col-6">
									<div class="chartWrap border height-600px" data-chart-wrapper="chart_1_1">
										<h4>
											<span data-sgg-nm></span> <span data-dong-nm></span> <span data-search-column-text></span> 공급 점포수 추이 <span data-search-result-column-text></span>
										</h4>
				
										<div class="chart mb-10">
											<div id="chart_1_1"></div>
										</div>
										<div class="reference"></div>
									</div>
								</div>
								<div class="col-6">
									<div class="border">
										<div class="chartWrap height-300px"  data-chart-wrapper="chart_2_1">
		
											<h4>
												<span data-last-year></span> <span data-sgg-nm></span> <span data-dong-nm></span> <span data-search-column-text></span> 공급 추이 - 선택 연도로부터 최근 5구간 동향<span data-search-result-column-text></span>
											</h4>
				
											<div class="chart">
												<div id="chart_2_1"></div>
		
												<div class="clickYears">
													<span data-idx="0"></span>
													<span data-idx="1"></span>
													<span data-idx="2"></span>
													<span data-idx="3"></span>
													<span data-idx="4"></span>
												</div>
											</div>
											<div class="reference"></div>
										</div>
		
										<div class="chartWrap bg-lightgray height-300px">
											<div style="position:relative;">
												<div class="all" data-chart-wrapper="chart_3_1">
													<h4>
														<span data-last-year></span> <span data-sgg-nm></span> <span data-dong-nm></span> <span data-search-column-text></span> 공급 동향 <span data-search-result-column-text></span>
													</h4>
<!-- 													<h5>2020 년 강남구 전체 업종 : 13,444 건 / 전년 대비 <span class="text-danger">6%</span> 상승</h5> -->
												
													<div class="chart-area">
<%--														<div class="chart depth-second" id="chart_3_1"></div> --%>
														<div class="chart" id="chart_3_1" style="width: 100%;"></div>
													</div>
<%--												
													<div class="detailValueDeprecated">
														<table class="detailTable" id="table_3_1" style="display: none;">
															<thead>
																<tr>
																	<th>1전대비</th>
																	<th>2전대비</th>
																	<th>3전대비</th>
																</tr>
															</thead>
															<tbody>
															</tbody>
														</table>
													</div>
--%>													
												</div>
		
												<div data-chart-wrapper="chart_3_2" style="display: none;">
													<h4>
														<span data-last-year></span> <span data-sgg-nm></span> <span data-dong-nm></span> <span data-search-column-text></span> 공급 동향
													</h4>
<!-- 													<h5>2020 년 강남구 전체 업종 : 13,444 건 / 전년 대비 <span class="text-danger">6%</span> 상승</h5> -->
													
													<div class="chart-area">
<%--														<div class="chart depth-second" id="chart_3_2"></div> --%>
														<div class="chart" id="chart_3_2" style="width: 100%;"></div>
													</div>
<%--													
													<div class="detailValueDeprecated">
														<table class="detailTable" id="table_3_2" style="display: none;">
															<thead>
																<tr>
																	<th>1전대비</th>
																	<th>2전대비</th>
																	<th>3전대비</th>
																</tr>
															</thead>
															<tbody>
															</tbody>
														</table>
													</div>
--%>
												</div>
													
											</div>
											<div class="reference"></div>
					
		
										</div>
									</div>
								</div>
							</div>
							</div>
							
							<div class="position-relative pb-10 " data-table-wrapper="table_5_1" data-ui-user-date="false"><!-- 230824수정 -->
								<div class="d-flex justify-content-between align-items-center h-40px">
									<h3>
										<span class="font-weight-bold text-dark">공급 추이 데이터</span> <span data-search-result-column-text></span>
										<i class="fa fa-question-circle icon-md ml-3 tooltipCustom">
											<span class="tooltipCustom-text">
												선택한 지역과 필터에 맞춰 통계 데이터를 제공합니다.<br>
												구분값을 클릭할 시 하위 정보를 열람하실 수 있습니다.
											</span>
										</i>
									</h3>
									<div class="btn_wrap">	
										<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1" data-btn-download="table_5_1" style="visibility: hidden;"><i class="flaticon-download icon-md"></i> 다운로드</button>
										<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1 allView2"><i class="flaticon-list-1 icon-md"></i> 전체보기</button>	
									</div>	
								</div>
			
								<div class="table-wrap head_fix_wrap"><!-- 230824수정 -->
									<!--begin: Datatable -->
									<table id="table_5_1" class="table-vertical thin double-header table-header">
										<thead>
											<tr>
												<th>지역</th>
												<th>구분</th>
											</tr>
										</thead>
										<tbody id="tbody_5_1">
										</tbody>
									</table>
								</div>
								<div class="reference"></div>
							</div>
							
							<div class="position-relative pb-10 mb-10" data-table-wrapper="table_5_3" style="display: none;" data-ui-user-date="true">
								<div class="d-flex justify-content-between align-items-center h-40px">
									<h3>
										<span class="font-weight-bold text-dark">공급 추이 합산 데이터</span> (단위: 개소)
										<i class="fas fa-question-circle icon-md text-muted ml-3" data-toggle="tooltip" data-placement="right" data-width="auto" title="선택지역의 상가 유형별 공급(분양) 동향을 그래프 및 테이블 형식으로 제공"></i>
									</h3>
								</div>
								<div class="mb-2">
									<div class="row align-items-end">
										<div class="col-lg-3 col-xl-4">
										</div>
										<div class="col-lg-9 col-xl-8 text-right">
											<!-- 201215 버튼추가 -->
											<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1" data-btn-download="table_5_3" style="visibility: hidden;"><i class="flaticon-download icon-md"></i> 다운로드</button>
										</div>
									</div>
								</div>	
			
								<!--begin: Datatable-->
								<table id="table_5_3" class="table-vertical border-bottom table-header">
									<thead>
										<tr>
											<th>지역</th>
											<th>총점포수</th>
										</tr>
									</thead>
									<tbody id="tbody_5_3">
									</tbody>
								</table>
								<div class="reference"></div>
							</div>				
			 				
							<div class="position-relative pb-10 mb-10" data-table-wrapper="table_5_2" style="display: none;">
								<div class="d-flex justify-content-between align-items-center h-40px">
									<h3>
										<span class="font-weight-bold text-dark">공급 추이 상세 데이터</span>
										<i class="fas fa-question-circle icon-md text-muted ml-3" data-toggle="tooltip" data-placement="right" data-width="auto" title="선택지역의 상가 유형별 공급(분양) 동향을 그래프 및 테이블 형식으로 제공"></i>
									</h3>
								</div>
								<div class="mb-2">
									<div class="row align-items-end">
										<div class="col-lg-3 col-xl-4">
											<label class="count">총 <span data-cnt-rawdata>0</span>건</label>
										</div>
										<div class="col-lg-9 col-xl-8 text-right">
											<!-- 201215 버튼추가 -->
											<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1" data-btn-download="table_5_2" style="visibility: hidden;"><i class="flaticon-download icon-md"></i> 다운로드</button>
										</div>
									</div>
								</div>
			
								<!--begin: Datatable-->
								<table id="table_5_2" class="table-vertical border-bottom table-header ${admin_excelyn == 'Y' ? '' : 'user-select-none'}">
									<thead>
										<tr>
											<th>지역</th>
											<th>상가명</th>
											<th>상가유형</th>
											<th>총점포수</th>
											<th>분양면적당분양가(만원/m2)</th>
											<th>분양년월</th>
											<th>입주년월</th>
											<th>연면적</th>
											<th>입주진행상황</th>
										</tr>
									</thead>
									<tbody id="tbody_5_2">
									</tbody>
								</table>
								<!--end: Datatable-->
								<div class="text-center py-6">
									<button class="btn btn-lg px-11 font-weight-bold allView">전체보기</button>
								</div>
								<div class="reference"></div>
							</div>
						</div>
						</div>
						<!--end: Card Body-->					
					</div>
				</div>
				<!-- //tab #01 -->
				
				<!-- ################# tab 02 -->
				<div class="tab-pane fade" role="tabpanel" id="tab02" data-wrapper="bizdist">
					<div class="card-body">
						<!-- search -->
						<div class="d-flex form-inline align-items-center pb-6">
							<div class="form-group" style="display: none;">
								<label class="control-label">검색어 입력 : </label>
								<div class="">
									<div class="input-icon">
										<input type="text" class="form-control w-300px" placeholder="예)  홍대입구, 가로수길, 샤로수길" name="bizdistSearchText">
										<span>
											<i class="flaticon2-search-1 text-muted"></i>
										</span>
									</div>
								</div>
							</div>
<!-- 						</div> -->
<!-- 						<div class="d-flex form-inline align-items-center pb-6"> -->
							<div class="form-group">
								<label class="control-label">지역명 선택 : </label>
								<div class="">
									<div class="row">
										<div class="d-flex align-items-center">
											<select class="form-control selectpicker w-140px" name="listSidoBizdist">
												<option value="">시, 도</option>
											</select>
										</div>
										<div class="d-flex align-items-center">
											<select class="form-control selectpicker w-140px" name="listSggBizdist">
												<option value="">시, 군, 구</option>
											</select>
										</div>
										
										<div class="d-flex align-items-center">
											<select class="form-control selectpicker w-160px" name="listBizdist" data-list-bizdist>
												<option value="">상권을 선택해 주세요</option>
											</select>
										</div>       
										<button class="btn btn-dark" name="btnBizdist">검색</button>       
									</div>
								</div>
							</div>

							<div class="form-group">
								<label class="control-label">선택 상권 연관지역 : </label>
								<div class="row">
									<div class="d-flex align-items-center">
										<select class="form-control selectpicker" name="listBizdistDong">
											<option value="">연관지역(동)</option>
										</select>
									</div>
<!-- 									<button class="btn btn-outline-secondary">변경</button> -->
								</div>
							</div>
							<a href="javascript:;" class="searchOption" data-btn-search-detail>검색옵션 <i class="fa fa-chevron-down"></i></a>
						</div>
						
						<div data-search-mode="bizdist">

						</div>
						
						<div data-content-mode="bizdist">
						
						</div>
					</div>
				</div>
				<!-- //tab #02 -->
			</div>

		</div>
		<!--end: Card-->
	</div>
	<!--end::Container-->
</div>
<!--end::Entry-->


<!--begin::Modal-->
<div id="modalAllView" class="modal fade" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-lg" style="max-width: 80%;">
		<div class="modal-content dashboard">
			<div class="modal-header py-5">
				<div class="d-flex justify-content-between align-items-center h-40px">
					<h3>
						<span class="font-weight-bold text-dark">공급 추이 상세 데이터</span>
						<i class="fas fa-question-circle icon-md text-muted ml-3" data-toggle="tooltip" data-placement="right" data-width="auto" title="선택지역의 상가 유형별 공급(분양) 동향을 그래프 및 테이블 형식으로 제공"></i>
					</h3>
				</div>
				<div class="mb-2">
					<div class="row align-items-end">
						<div class="col-lg-9 col-xl-8 text-right">
							<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1" data-btn-dtldownload="rowDataTable" style="visibility: hidden;"><i class="flaticon-download icon-md"></i> 다운로드</button>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-body" data-modal-body>
				<div class="mb-2">
					<div class="row align-items-center">
						<div class="col-lg-9 col-xl-8">
							<div class="row align-items-center">
								<div class="col-md-3 my-2 my-md-0">
									<div class="d-flex align-items-center">
										<label class="mr-3 mb-0 d-none d-md-block text-nowrap">입주년도 : </label>
										<select class="form-control datatable-input" id="kt_datatable_search_status" data-col-index="1">
											<option value="">전체</option>
										</select>
									</div>
								</div>																				
							</div>
						</div>
					</div>
				</div>
				<div class="datatable datatable-bordered datatable-head-custom" id="rowDataTable"></div>
			</div>
			<div class="modal-footer justify-content-center">
				<button type="reset" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold" data-dismiss="modal" aria-label="Close">닫기</button>
			</div>
		</div>
	</div>
</div>
<!--end::Modal-->

<c:out value="<script type='text/template' id='tmplTablePrevCompareList'>" escapeXml="false" />
{{#each compareArr}}
	<tr>
		<td class="{{class1}}">{{compare1}}{{{icon1}}}</td>
		<td class="{{class2}}">{{compare2}}{{{icon2}}}</td>
		<td class="{{class3}}">{{compare3}}{{{icon3}}}</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />

<c:out value="<script type='text/template' id='tmplTableSupplyTrendEnterSanggaType'>" escapeXml="false" />
{{#each dataArr}}
	{{#each ../sanggaTypeArr}}		
		{{#if (lookup ../../firstLineArr @index)}}
		<tr class="tr-border data-show maintotal" data-dong="{{../dongnm}}">
			<td id="td_dong" rowspan="{{../../rowspan}}">{{../dongnm}}</td>
			<td class="relative">{{{this}}}</td>
		{{else}}
		<tr class="tr-border data-show subdata" data-dong="{{../dongnm}}">
			<td>{{this}}</td>
		{{/if}}
			{{#each (lookup ../this.data @index)}}
				<td style="text-align: right;">{{this}}</td>
			{{/each}}
		</tr>
	{{/each}}
{{/each}}
<c:out value="</script>" escapeXml="false" />


<c:out value="<script type='text/template' id='tmplTableSupplyTrendEnterDetail'>" escapeXml="false" />
{{#each dataArr}}
	<tr {{#if isHidden}}data-hidden{{/if}}>
		<td>{{dongnm}}</td>
		<td>{{상가명}}</td>
		<td>{{상가유형}}</td>
		<td style="text-align: right;">{{총점포수}}</td>
		<td style="text-align: right;">{{분양가}}</td>
		<td>{{분양일}}</td>
		<td>{{입주일}}</td>
		<td>{{연면적}}</td>
		<td>{{cmplText}}</td>
	</tr>
{{else}}
	<tr>
		<td colspan="8">검색된 데이터가 없습니다</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />


<c:out value="<script type='text/template' id='tmplTableSupplyTrendSum'>" escapeXml="false" />
{{#each dataArr}}
	<tr>
		<td>{{dongnm}}</td>
		<td>{{value}}</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />

<c:out value="<script type='text/template' id='tmplSearchInputCheck'>" escapeXml="false" />
<label>
	<input type="checkbox" name="{{name}}" value="{{value}}" {{#if checked}}checked="checked"{{/if}}> {{text}}
</label>
<c:out value="</script>" escapeXml="false" />
