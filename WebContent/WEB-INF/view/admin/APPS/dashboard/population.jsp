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
					<span class="font-weight-bolder text-dark">인구정보</span>
				</h3>
				<div class="card-toolbar">
					<div class="d-flex align-items-center">
						<i class="flaticon-buildings text-dark mb-1"></i>
						<i class="ki ki-arrow-next icon-sm mx-2"></i>
						<a href="javascript:;">지역현황판</a>
						<i class="ki ki-arrow-next icon-sm mx-2"></i>
						<a href="javascript:;">인구정보</a>
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
				<li data-search-population>
					<label>인구유형 : </label>
					<span>전체</span>
				</li>
				<li data-search-sex>
					<label>성별 : </label>
					<span>전체</span>
				</li>
				<li data-search-age>
					<label>연령대 : </label>
					<span>전체</span>
				</li>				
				<li data-search-dayname>
					<label>요일 : </label>
					<span>전체</span>
				</li>				
				<li data-search-timezone>
					<label>시간대 : </label>
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
				<li class="filter_btn">
					<a href="javascript:;" class="searchOption filter_btn" data-btn-search-detail>검색옵션 <i class="fa fa-chevron-down"></i></a>
				</li>
			</ul>
			<!--end::Header-->
			<!--begin::Body-->
<!-- 			<div class="card-body px-0 py-0"> -->
				<!--begin: Search Form-->
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
													<option value="">시, 군, 구</option>
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
										</li>
										<li class="nav-item">
										</li>
									</ul>
									<!--end:: Nav Line -->
								</div>
								
								<div class="tab-content">
								<!-- ################# tab 01-01 -->
								<div class="tab-pane fade show active" role="tabpanel" id="tab01_01">
									<div class="form-horizontal" data-search-wrapper="timeBound">
										<div class="form-group">
											<label class="control-label col-1">검색기간</label>
											<div class="col-7">
												<div class="d-flex align-items-center">
													<div class="radioWrap">
														<label><input type="radio" name="timeBound" value="month"> 월 (최근 1년)</label>
														<label><input type="radio" name="timeBound" value="quarter"  checked="checked"> 분기</label>
														<label><input type="radio" name="timeBound" value="half"> 반기</label>
														<label><input type="radio" name="timeBound" value="year"> 년</label>
													</div>
												</div>
											</div>
											<div class="col-4">
												<div class="d-flex align-items-center">
													<label class="mr-10">시작시간</label>
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
											<label class="control-label col-1">검색유형</label>
											<div class="col-11 radioWrap" data-search-wrapper="searchType">
												<label><input type="radio"  name="searchType" value="0" checked="checked"/> 성별,연령별검색</label>
												<label><input type="radio"  name="searchType" value="1" /> 요일,시간별검색(유동인구한정)</label>
											</div>
										</div>
										<div class="form-group">
											<label class="control-label col-1">인구유형</label>
											<div class="col-11 radioWrap" data-search-wrapper="populationType">
												<label><input type="checkbox"  name="populationType" value="" checked="checked" /> 전체선택</label>
												<label><input type="checkbox"  name="populationType" value="0" /> 거주인구</label>
												<label><input type="checkbox"  name="populationType" value="1" /> 직장인구</label>
												<label><input type="checkbox"  name="populationType" value="2" /> 유동인구</label>
											</div>
										</div>
										<div class="form-group">
											<label class="control-label col-1">성별</label>
											<div class="col-11 radioWrap" data-search-wrapper="sexType">
												<label><input type="checkbox"  name="sexType" value="" checked="checked" /> 전체선택</label>
												<label><input type="checkbox"  name="sexType" value="남성" /> 남성</label>
												<label><input type="checkbox"  name="sexType" value="여성" /> 여성</label>
											</div>
										</div>
										<div class="form-group">
											<label class="control-label col-1">연령</label>
											<div class="col-11 radioWrap" data-search-wrapper="ageType">
												<label><input type="checkbox"  name="ageType" value="" checked="checked" /> 전체선택</label>
												<label><input type="checkbox"  name="ageType" value="0" /> 10대 미만</label>
												<label><input type="checkbox"  name="ageType" value="10" /> 10대</label>
												<label><input type="checkbox"  name="ageType" value="20" /> 20대</label>
												<label><input type="checkbox"  name="ageType" value="30" /> 30대</label>
												<label><input type="checkbox"  name="ageType" value="40" /> 40대</label>
												<label><input type="checkbox"  name="ageType" value="50" /> 50대</label>
												<label><input type="checkbox"  name="ageType" value="60" /> 60대 이상</label>
											</div>
										</div>
										<div id="searchDayTime" style="display:none;">
											<div class="form-group">
												<label class="control-label col-1">요일</label>
												<div class="col-11 radioWrap" data-search-wrapper="dayNameType">
													<label><input type="checkbox"  name="dayNameType" value="" checked="checked" /> 전체선택</label>
													<label><input type="checkbox"  name="dayNameType" value="0" /> 월</label>
													<label><input type="checkbox"  name="dayNameType" value="1" /> 화</label>
													<label><input type="checkbox"  name="dayNameType" value="2" /> 수</label>
													<label><input type="checkbox"  name="dayNameType" value="3" /> 목</label>
													<label><input type="checkbox"  name="dayNameType" value="4" /> 금</label>
													<label><input type="checkbox"  name="dayNameType" value="5" /> 토</label>
													<label><input type="checkbox"  name="dayNameType" value="6" /> 일</label>
												</div>
											</div>
											<div class="form-group">
												<label class="control-label col-1">시간대</label>
												<div class="col-11 radioWrap" data-search-wrapper="timeZoneType">
													<label><input type="checkbox"  name="timeZoneType" value="" checked="checked" /> 전체선택</label>
													<label><input type="checkbox"  name="timeZoneType" value="0" /> 0시~08시</label>
													<label><input type="checkbox"  name="timeZoneType" value="1" /> 09시~12시</label>
													<label><input type="checkbox"  name="timeZoneType" value="2" /> 13시~18시</label>
													<label><input type="checkbox"  name="timeZoneType" value="3" /> 19시~23시</label>
												</div>
											</div>
										</div>
										<div class="text-center mb-10 btnWrap">
											<button class="btn btn-danger btn-lg px-11 font-weight-bold" data-btn-ok>확인</button>
											<button class="btn btn-outline-secondary btn-lg px-11 font-weight-bold detailSearch-close" data-btn-close>취소</button>
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
							<!-- //detailSearch #01 (detail search End)-->

						<div data-content-mode="emd">
						<div class="detailContent">
							<div class="pb-20">
								<div class="fixedWrap" data-ui-user-date="false">
									<div class="d-flex justify-content-between align-items-center h-40px">
										<h3 class="mb-5 changeTitle" data-select-sgg>
											<span class="font-weight-bold text-dark">인구추이 동 선택</span>
										</h3>
									</div>
									<div class="tableHeaderWrap"></div>
									</div>
							
									<!-- chart start (chart draw)-->
									<div class="row" data-ui-user-date="false">
										<div class="col-6">
											<div class="chartWrap border height-600px" data-chart-wrapper="chart_1_1" style="height:100%">
												<h4>
													<span data-sgg-nm></span> <span data-dong-nm></span> <span data-search-column-text></span> 인구유형별 추이 
													<i class="fa fa-question-circle icon-md ml-3 tooltipCustom">
														<span class="tooltipCustom-text">
															SK텔레콤에서 제공하는 인구정보를 토대로 거주인구/직장인구/유동인구로 구분하여 성·연령별/요일별/요일*시간대별로 제공합니다.
														</span>
													</i>
												</h4>
						
												<div class="chart mb-10">
													<div id="chart_1_1"></div>
												</div>				
												<div class="reference"></div>
											</div>
										</div>
										
										<div class="col-6">
											<div class="border">
												<div class="chartWrap height-300px"  data-chart-wrapper="chart_2_1" style="height:376px;">
													<h4>
														<span data-last-year></span> <span data-sgg-nm></span> <span data-dong-nm></span> 성별 인구분포
													</h4>
													<div class="d-flex">
														<div class="relative col-4">
															<div class="chart">
																<div  class="chart depth-second" id="chart_2_1"></div>																
																<div class="label-lady first">
																	<label id='pop_label'></label>
																	<strong id='pop_data'></strong>
																</div>
															</div>
														</div>
														<div class="relative col-4">
															<div class="chart">
																<div  class="chart depth-second" id="chart_2_2"></div>
																<div class="label-lady second">
																	<label id='work_label'></label>
																	<strong id='work_data'></strong>
																</div>
															</div>
														</div>
														<div class="relative col-4">
															<div class="chart">
																<div  class="chart depth-second" id="chart_2_3"></div>
																<div class="label-lady third">
																	<label id='move_label'></label>
																	<strong id='move_data'></strong>
																</div>
															</div>
														</div>
													</div>
													<div class="reference"></div>						
												</div>		
												<!-- 230627수정 -->
												<div class="chartWrap" data-chart-wrapper="chart_3_1">
													<!-- <div style="position:relative;">
														<div class="all" > -->
													<h4>
														<span data-last-year></span> <span data-sgg-nm></span> <span data-dong-nm></span> 연령별 인구분포
													</h4>
													<div class="chart" style="position: relative; width: 74%;">
														<div id="chart_3_1" style="width: 100%; justify-content: start;"></div>
													</div>
															<!-- <div class="chart-area">
																<div class="chart depth-second" id="chart_3_1"></div>
															</div> -->
															<!-- 부동산 114측 요청으로 삭제처리 20210805
															<div class="detailValue" style="width:40%; margin-top:4%">
																<table class="detailTable" id="table_3_1" style="width:101%;">
																	<thead>
																		<tr>
																			<th></th>
																			<th style="padding:10px 4px 10px;">전<span data-pre-section></span>대비</th>
																			<th style="padding:10px 4px 10px;">2<span data-pre-section></span>대비</th>
																			<th style="padding:10px 4px 10px;">3<span data-pre-section></span>대비</th>
																		</tr>
																	</thead>
																	<tbody>
																	</tbody>
																</table>
															</div>
															 -->
														<!-- </div> -->
														<div class="reference"></div>	
													<!-- </div> -->
												</div>	
												<!--// 230627수정 -->
												
											</div>
										</div>			
									</div>
									<div class="row pt-3" data-ui-user-date="false">
										<div class="col-6">
											<div class="border">
												<div class="chartWrap height-300px"  data-chart-wrapper="chart_4_1">
													<h4>
														<span data-last-year></span> <span data-sgg-nm></span> <span data-dong-nm></span> 요일에 따른 유동인구 추이 - 선택 년도로 부터 최근 5년 간 :
													</h4>
						
													<div class="chart">
														<div id="chart_4_1"></div>
														<div class="clickYears" style="bottom: 13%">
															<span style="left:21px;" data-idx="0"></span>
															<span style="left:16px;" data-idx="1"></span>
															<span style="left:11px;" data-idx="2"></span>
															<span style="left:6px;" data-idx="3"></span>
															<span data-idx="4"></span>
														</div>													
													</div>
												</div>
											</div>
										</div>
										
										<div class="col-6">
											<div class="border">
												<div class="chartWrap height-300px"  data-chart-wrapper="chart_5_1">
													<h4>
														<span data-last-year></span> <span data-sgg-nm></span> <span data-dong-nm></span> 시간대별 유동인구 분포
													</h4>
						
													<div class="chart">
														<div id="chart_5_1"></div>
														<div class="clickYears" style="bottom: 10%" data-wrapper="clickDays">
													</div>		
													</div>
												</div>
											</div>
										</div>
									</div>								
									</div>

					<div class="pb-0" data-table-wrapper="table_6_1" data-ui-user-date="false"><!-- 230824수정 -->
						<div class="d-flex justify-content-between align-items-center h-40px">
							<h3>
								<span class="font-weight-bold text-dark">유동인구 추이 데이터 (단위: 명)</span>
								<i class="fa fa-question-circle icon-md ml-3 tooltipCustom">
									<span class="tooltipCustom-text">
										선택한 지역과 필터에 맞춰 통계 데이터를 제공합니다.<br>
										구분값을 클릭할 시 하위 정보를 열람하실 수 있습니다.
									</span>
								</i>
							</h3>
							<!-- 201215 버튼추가 -->
							<c:if test="${admin_excelyn == 'Y'}">
								<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1" data-btn-download="table_6_1" style="visibility: hidden;"><i class="flaticon-download icon-md"></i> 다운로드</button>
							</c:if>
						</div>
						<div class="table-wrap head_fix_wrap"><!-- 230824수정 -->
							<!--begin: Datatable-->
							<table id="table_6_1" class="table-vertical thin double-header table-header">
								<thead>
									<tr>
										<th>지역</th>
										<th>인구유형</th>
										<th>성별</th>
										<th>연령대</th>
									</tr>
								</thead>
								<tbody id="tbody_6_1">
								</tbody>
							</table>
							<!--end: Datatable-->						
						</div>
					</div>
					
					<div class="mb-30" data-table-wrapper="table_6_2" style="display: none;" data-ui-user-date="true">
						<div class="d-flex justify-content-between align-items-center h-40px">
							<h3>
								<span class="font-weight-bold text-dark">인구 합산 데이터 (단위: 명)</span>
								<i class="fa fa-question-circle icon-md ml-3 tooltipCustom">
									<span class="tooltipCustom-text">
										선택한 지역과 필터에 맞춰 통계 데이터를 제공합니다.<br>
										구분값을 클릭할 시 하위 정보를 열람하실 수 있습니다.
									</span>
								</i>
							</h3>
						</div>
						<div class="mb-2">
							<div class="row align-items-end">
								<div class="col-lg-3 col-xl-4">
								</div>
								<div class="col-lg-9 col-xl-8 text-right">
									<!-- 201215 버튼추가 -->
									<c:if test="${admin_excelyn == 'Y'}">
										<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1" data-btn-download="table_6_2" style="visibility: hidden;"><i class="flaticon-download icon-md"></i> 다운로드</button>
									</c:if>
								</div>
							</div>
						</div>	
	
						<!--begin: Datatable-->
						<table id="table_6_2" class="table-vertical border-bottom table-header">
							<thead>
								<tr>
									<th>지역</th>
									<th>구분</th>
								</tr>
							</thead>
							<tbody id="tbody_6_2">
							</tbody>
						</table>
					</div>		
					
					<div class="mt-30" data-table-wrapper="table_7_1"><!-- 230824수정 -->
						<div class="d-flex justify-content-between align-items-center h-40px">
							<h3>
								<span class="font-weight-bold text-dark">시간대별 유동인구 데이터 (단위: 명)</span>
								<i class="fas fa-question-circle icon-md text-muted ml-3" data-toggle="tooltip" data-placement="right" title="선택지역의 상가 유형별 공급(분양) 동향을 그래프 및 테이블 형식제공"></i>
							</h3>
							<!-- 201215 버튼추가 -->
							<c:if test="${admin_excelyn == 'Y'}">
								<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1" data-btn-download="table_7_1" style="visibility: hidden;"><i class="flaticon-download icon-md"></i> 다운로드</button>
							</c:if>	
						</div>
						<div class="table-wrap head_fix_wrap"><!-- 230824수정 -->
							<table id="table_7_1" class="table-vertical thin double-header table-header">
								<thead>
									<tr>
										<th>지역</th>
										<th>인구유형</th>
										<th>요일</th>
										<th>시간대</th>
									</tr>
								</thead>
								<tbody id="tbody_7_1">
								</tbody>
							</table>
							<!--end: Datatable-->
						</div>
					</div>
					</div>
					<!--end: Card Body-->
				</div>
				</div>
			</div>
		</div>
	</div>

		<!--end: Card-->
	</div>
	<!--end::Container-->
 
<!--end::Entry-->


<c:out value="<script type='text/template' id='tmplTablePrevCompareList'>" escapeXml="false" />
{{#each compareArr}}
	<tr style="height:33px;">
		<td>{{title}}</td>
		{{#noneColor compare1}}
			{{#percentColor compare1}}
				<td style="color:#e12b2c; text-align:center">{{compare1}}</td>
			{{else}}
				<td style="color:#007bff; text-align:center">{{compare1}}</td>
			{{/percentColor}}
		{{else}}
			<td style="text-align:center">{{compare1}}</td>
		{{/noneColor}}
		
		{{#noneColor compare2}}
			{{#percentColor compare2}}
				<td style="color:#e12b2c; text-align:center">{{compare2}}</td>
			{{else}}
				<td style="color:#007bff; text-align:center">{{compare2}}</td>
			{{/percentColor}}
		{{else}}
			<td style="text-align:center">{{compare2}}</td>
		{{/noneColor}}
		
		{{#noneColor compare3}}
			{{#percentColor compare3}}
				<td style="color:#e12b2c; text-align:center">{{compare3}}</td>
			{{else}}
				<td style="color:#007bff; text-align:center">{{compare3}}</td>
			{{/percentColor}}
		{{else}}
			<td style="text-align:center">{{compare3}}</td>
		{{/noneColor}}
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />

<c:out value="<script type='text/template' id='tmplTablePopulationAge'>" escapeXml="false" />
{{#each dataArr}}
	<tr class="tr-border data-show maintotal" data-dong="{{dongnm}}">
		<td rowspan="{{../dongRowspan}}">{{dongnm}}</td>
		<td style="text-align:center; border-top: 1px solid #4848b0;" class="relative" colspan="3">총계</td>		
		{{#with (lookup ../totalSum @index)}}
			{{#each this}}
				<td style="text-align: right;">{{this}}</td>
			{{/each}}
		{{/with}}
	</tr>	
	{{#each ../populationTypeArr}}		
		<tr class="tr-border data-show subtotal" data-dong="{{../dongnm}}" data-type="{{this}}">
			<td rowspan="{{../../populationRowspan}}">{{this}}</td>
			<td style="text-align:center;" class="relative" colspan="2">합계</td>
			{{#popMiddleSumData @index}}
			{{/popMiddleSumData}}
		</tr>
		{{#each ../../genderTypeArr}}
		<tr class="tr-border data-show subtotal2" data-dong="{{../../dongnm}}" data-type="{{../this}}" data-sex="{{this}}">
			<td rowspan="{{../../../genderRowspan}}">{{this}}</td>
			<td>계</td>
			{{#genderAgeMiddleSumData @index}}
			{{/genderAgeMiddleSumData}}			
		</tr>
			{{#each ../../../ageTypeArr}}
				<tr class="tr-border data-show subdata" data-dong="{{../../../dongnm}}" data-type="{{../../this}}" data-sex="{{../this}}">
					<td>{{this}}</td>
					{{#resultArrData @../../../index}}
					{{/resultArrData}}
				</tr>
			{{/each}}
		{{/each}}		
	{{/each}}
{{/each}}
<c:out value="</script>" escapeXml="false" />

<c:out value="<script type='text/template' id='tmplTableTimeDivFloatingPeople'>" escapeXml="false" />
{{#each dataArr}}
	<tr class="tr-border data-show maintotal" data-dong="{{dongnm}}">
		<td rowspan="{{../dongRowspan}}" >{{dongnm}}</td>
		<td rowspan="{{../populationRowspan}}">유동인구</td>
		<td style="text-align:center; class="relative"  colspan="2">총계</td>
		{{#dongTotalSumRow dongnm}}
		{{/dongTotalSumRow}}
	</tr>		
	{{#each ../dayTypeArr}}
		<tr class="tr-border data-show subtotal" data-dong="{{../dongnm}}" data-type="{{this}}">
			<td rowspan="{{../../dayRowspan}}">{{this}}</td>
			<td>계</td>
			{{#dayTotalSumRow @../index @index}}
			{{/dayTotalSumRow}}
		</tr>
		{{#each ../../timeTypeArr}}
			{{#if @last}}
			<tr class="tr-border data-show subdata" data-dong="{{../../dongnm}}" data-type="{{../this}}">
			{{else}}
			<tr class="data-show subdata" data-dong="{{../../dongnm}}" data-type="{{../this}}">
			{{/if}}			
				<td>{{this}}</td>
				{{#resultMoveArrData @../../index}}
				{{/resultMoveArrData}}
			</tr>
			{{/each}}
		{{/each}}
{{/each}}
<c:out value="</script>" escapeXml="false" />


<c:out value="<script type='text/template' id='tmplTablePopulationAgeCustom'>" escapeXml="false" />
{{#each dataArr}}
	
	<tr class="total">
		<td rowspan="{{../dongRowspan}}" class="border-weight bg-white">{{dongnm}}</td>
	
	
	{{#each ../populationTypeArr}}
		<td class="relative">{{this}}</td>
		{{#each (lookup ../this.data @index)}}
				<td style="text-align: center;">{{this}}</td>
			{{/each}}
			</tr>
	{{/each}}
	
{{/each}}
<c:out value="</script>" escapeXml="false" />

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
