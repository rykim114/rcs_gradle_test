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
						<span class="font-weight-bolder text-dark">업종정보</span>
						<!-- 230601추가 -->
                        <i class="fa fa-question-circle icon-md ml-3 tooltipCustom">
                            <span class="tooltipCustom-text">2023년 1분기부터 소상공인 진흥공단 업종코드가 변경되었습니다.<br> 시점을 선택하여 비교해보세요.</span>
						</i>
                        <!--// 230601추가 -->
				</h3>
				<div class="card-toolbar">
					<div class="d-flex align-items-center">
						<i class="flaticon-buildings text-dark mb-1"></i>
						<i class="ki ki-arrow-next icon-sm mx-2"></i>
						<a href="javascript:;">지역현황판</a>
						<i class="ki ki-arrow-next icon-sm mx-2"></i>
						<a href="javascript:;">업종정보</a>
					</div>
				</div>
			</div>
			<!-- 230601탭추가 -->
			<ul class="nav nav-tabs nav-tabs-line nav-tabs-line-2x nav-tabs-line-danger ml-0">
				<li class="nav-item">
					<a class="nav-link active font-size-lg px-5" data-toggle="tab" data-target="#tab01" id="ktAreaBtn">2022년</a>
				</li>
				<li class="nav-item">
					<a class="nav-link font-size-lg px-5" data-toggle="tab" data-target="#tab02" id="ktAreaBtn">2023년</a>
				</li>
			</ul>
			<!--// 230601탭추가 -->
			<!-- 필터 -->
			<ul class="fliter_wrap searchResult2 mt-1">
				<li>
					<label>지역선택 : </label>
					<button id="btnSearchArea">
						<span data-list-addr-chkbizdist= "" data-list-addr-sidocd="" data-list-addr-sggcd="" data-list-addr-dongcd="" data-list-addr-bizdist= ""></span>											
						<i class="fa fa-angle-down"></i>
					</button> 

					<%@ include file="/WEB-INF/view/admin/APPS/dashboard/areaMap.jsp"%>
				</li>
				<li data-search-sangga>
					<label>업종유형 : </label>
					<span>전체</span>
				</li>
				<li data-search-floor>
					<label>층유형 : </label>
					<span>전체</span>
				</li>
				<li>
					<label>검색기간 : </label>
					<span data-search-time></span>
				</li>
				<li data-search-start-time-wrapper>
					<label>시작일자 : </label>
					<span data-search-start-time></span>
				</li>		
				<li class="filter_btn">
					<a href="javascript:;" class="searchOption filter_btn" data-btn-search-detail>검색옵션 <i class="fa fa-chevron-down"></i></a>
				</li>
			</ul>
			<!--end::Header-->
			
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
										<div class="form-horizontal">
											<div class="form-group">
												<label class="control-label col-1">검색기간</label>
												<div class="col-7">
													<div class="d-flex align-items-center">
														<div class="radioWrap">
	<%--														<label><input type="radio" name="timeBound" value="month"> 월 (최근 1년)</label> --%>
															<label><input type="radio" name="timeBound" value="quarter"  checked="checked"> 분기</label>
															<label><input type="radio" name="timeBound" value="half"> 반기</label>
															<label><input type="radio" name="timeBound" value="year"> 년</label>
														</div>
													</div>
												</div>
												<div class="col-4">
													<div class="d-flex align-items-center">
														<label class="mr-10">시작일자</label>
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
												<label class="control-label col-1">업종유형</label>
												<div class="col-11 radioWrap" data-search-wrapper="sanggaType">
													<label><input type="checkbox"  name="sanggaType" value="" checked="checked" /> 전체선택</label>
													<label><input type="checkbox"  name="sanggaType" value="관광/여가/오락" /> 관광/여가/오락</label>
													<label><input type="checkbox"  name="sanggaType" value="부동산" /> 부동산</label>
													<label><input type="checkbox"  name="sanggaType" value="생활서비스" /> 생활서비스</label>
													<label><input type="checkbox"  name="sanggaType" value="소매" /> 소매</label>
													<label><input type="checkbox"  name="sanggaType" value="숙박" /> 숙박</label>
													<label><input type="checkbox"  name="sanggaType" value="스포츠" /> 스포츠</label>
													<label><input type="checkbox"  name="sanggaType" value="음식" /> 음식</label>
													<label><input type="checkbox"  name="sanggaType" value="학문/교육" /> 학문/교육</label>
												</div>
												<div class="col-11 radioWrap sector-code" data-search-wrapper="sanggaType2" style="display:none;">
													<label><input type="checkbox"  name="sanggaType" value="" checked="checked" /> 전체선택</label>
													<label><input type="checkbox"  name="sanggaType" value="소매" /> 소매</label>
													<label><input type="checkbox"  name="sanggaType" value="숙박" /> 숙박</label>
													<label><input type="checkbox"  name="sanggaType" value="음식점" /> 음식점</label>
													<label><input type="checkbox"  name="sanggaType" value="부동산" /> 부동산</label>
													<label><input type="checkbox"  name="sanggaType" value="과학·기술" /> 과학·기술</label>
													<label><input type="checkbox"  name="sanggaType" value="시설관리·임대" /> 시설관리·임대</label>
													<label><input type="checkbox"  name="sanggaType" value="교육" /> 교육</label>
													<label><input type="checkbox"  name="sanggaType" value="보건의료" /> 보건의료</label>
													<label><input type="checkbox"  name="sanggaType" value="예술·스포츠" /> 예술·스포츠</label>
													<label><input type="checkbox"  name="sanggaType" value="수리·개인" /> 수리·개인</label>
												</div>
											</div>
											<div class="form-group">
												<label class="control-label col-1">층유형</label>
												<div class="col-11 radioWrap" data-search-wrapper="floorBound">
													<label><input type="checkbox"  name="floorBound" value="" checked="checked" /> 전체선택</label>
													<label><input type="checkbox"  name="floorBound" value="B1F" /> B1F</label>
													<label><input type="checkbox"  name="floorBound" value="1F" /> 1F</label>
													<label><input type="checkbox"  name="floorBound" value="2F" /> 2F</label>
													<label><input type="checkbox"  name="floorBound" value="3F" /> 3F</label>
													<label><input type="checkbox"  name="floorBound" value="4F" /> 4F 이상</label>
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
									</div>
								</div>
							</div>
						</div>
							<!-- //detailSearch #01 -->

						<div data-content-mode="2022">
						<div class="detailContent">
							<div class="pb-20">
							<div class="fixedWrap" data-ui-user-date="false">
								<div class="d-flex justify-content-between align-items-center h-40px">
									<h3 class="mb-5 changeTitle" data-select-sgg>
										<span class="font-weight-bold text-dark">업종분포현황</span>
										<i class="fa fa-question-circle icon-md ml-3 tooltipCustom">
											<span class="tooltipCustom-text">
												소상공인진흥원에서 매 분기 제공하는 상가업소정보를 바탕으로 업종 유형을 구분하여 제공합니다.
											</span>
										</i>
									</h3>
								</div>
								<div class="tableHeaderWrap"></div>
							</div>


							<!-- chart start -->
							<div class="row" data-ui-user-date="false">
								<div class="col-6">
									<div class="chartWrap border height-600px" data-chart-wrapper="chart_1_1_1">
										<h4>
											<span data-sgg-nm></span> <span data-dong-nm></span> 업종분포현황 추이 차트 (단위: 개소)
										</h4>

										<div class="chart mb-10">
											<div id="chart_1_1_1"></div>
<!-- 											<div class="px-6"> -->
<!-- 												<div class="mt-1"> -->
<!-- 													<div id="kt_nouislider_1" class="nouislider nouislider-connect-danger"></div> -->
<!-- 												</div> -->
<!-- 											</div> -->
										</div>
										<div class="reference"></div>
									</div>
								</div>

								<div class="col-6">
									<div class="border">
										<div class="chartWrap height-300px"  data-chart-wrapper="chart_2_1_1">
											<h4>
												<span data-last-year></span> <span data-sgg-nm></span> <span data-dong-nm></span> 업종분포현황 추이 - 선택 연도로부터 최근 <span data-section></span>구간 (단위: 개소)
											</h4>

											<div class="chart">
												<div id="chart_2_1_1"></div>

												<div class="clickYears">
													<!-- <span data-idx="0"></span>
													<span data-idx="1"></span>
													<span data-idx="2"></span>
													<span data-idx="3"></span>
													<span data-idx="4"></span> -->
												</div>
											</div>
											<div class="reference"></div>
										</div>

										<div class="chartWrap bg-lightgray height-300px">
											<div style="position:relative;">
												<div class="all" data-chart-wrapper="chart_3_1_1">
													<h4>
														<span data-last-year></span> <span data-sgg-nm></span> <span data-dong-nm></span> 업종분포현황 동향
													</h4>
													<h5>전체 업종 : <span data-industry-total></span> 건 / 1전 대비 <span class="text-danger" data-industry-rate></span> <span data-industry-rate-up> </span></h5>

													<div class="chart-area">
														<div class="rate-wrap-deprecated">

															<table id="table_3_1_1" class="table-no-border" style="display: none;">
																<thead>
																	<tr>
																		<th></th>
																		<th></th>
																		<th>1전대비</th>
																	</tr>
																</thead>
																<tbody>
																</tbody>
															</table>
														</div>

														<div id="chart_3_1_1" class="w-100"></div>
													</div>
												</div>

												<div class="all" data-chart-wrapper="chart_3_2_1" style="display: none;">
													<h4>
														<span data-last-year></span> <span data-sgg-nm></span> <span data-dong-nm></span> 업종분포현황 동향 (단위: 개소)
													</h4>
													<h5><span data-last-year></span> <span data-sgg-nm></span> <span data-dong-nm></span> 전체 업종 : <span data-industry-total></span> 개소 / 전년 대비 <span class="text-danger" data-industry-rate> </span> <span data-industry-rate-up> </span></h5>

													<div class="chart-area">
<%--
														<div class="rate-wrap-deprecated">
															<table id="table_3_2" class="table-no-border" style="display: none;" style="display: none;">
																<thead>
																	<tr>
																		<th></th>
																		<th></th>
																		<th>전년대비</th>
																	</tr>
																</thead>
																<tbody>
																</tbody>
															</table>
														</div>
--%>
														<div id="chart_3_2_1" class="w-100"></div>
													</div>
												</div>
											</div>
											<div class="reference"></div>
										</div>
									</div>
								</div>
							</div>
							</div>

							<div class="position-relative pb-10 " data-table-wrapper="table_5_1_1" data-ui-user-date="false"><!-- 230824수정 -->
								<div class="d-flex justify-content-between align-items-center h-40px">
									<h3>
										<span class="font-weight-bold text-dark">업종분포 추이 데이터 (단위: 개소)</span>
										<i class="fa fa-question-circle icon-md ml-3 tooltipCustom">
											<span class="tooltipCustom-text">
												선택한 지역과 필터에 맞춰 통계 데이터를 제공합니다.<br>
												구분값을 클릭할 시 하위 정보를 열람하실 수 있습니다.
											</span>
										</i>
									</h3>
									<!-- 201215 버튼추가 -->
									<div class="btn_wrap">
										<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1" data-btn-download="table_5_1_1" style="visibility: hidden;"><i class="flaticon-download icon-md"></i> 다운로드</button>
									</div>
								</div>

								<div class="table-wrap head_fix_wrap"><!-- 230824수정 -->
									<!--begin: Datatable-->
									<table id="table_5_1_1" class="table-vertical thin double-header table-header ${admin_usertag > 1 ? 'user-select-none' : ''}">
										<thead>
											<tr>
												<th>지역</th>
												<th>대분류</th>
												<th>중분류</th>
												<th>층</th>
											</tr>
										</thead>
										<tbody id="tbody_5_1_1">
										</tbody>
									</table>
									<!--end: Datatable-->
								</div>
								<div class="reference"></div>
							</div>

							<div class="position-relative pb-10 " data-table-wrapper="table_5_3_1" style="display: none;" data-ui-user-date="true"><!-- 230824수정 -->
								<div class="d-flex justify-content-between align-items-center h-40px">
									<h3>
										<span class="font-weight-bold text-dark">공급 추이 합산 데이터</span>
										<i class="fas fa-question-circle icon-md text-muted ml-3" data-toggle="tooltip" data-placement="right" title="선택지역의 상가 유형별 공급(분양) 동향을 그래프 및 테이블 형식제공"></i>
									</h3>
								</div>
								<div class="mb-2">
									<div class="row align-items-end">
										<div class="col-lg-3 col-xl-4">
										</div>
										<div class="col-lg-9 col-xl-8 text-right">
											<!-- 201215 버튼추가 -->
											<c:if test="${admin_usertag < 2}">
											<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1" data-btn-download="table_5_3_1" style="visibility: hidden;"><i class="flaticon-download icon-md"></i> 다운로드</button>
											</c:if>
										</div>
									</div>
								</div>
								<div class="table-wrap head_fix_wrap"><!-- 230824수정 -->
									<!--begin: Datatable-->
									<table id="table_5_3_1" class="table-vertical border-bottom table-header ${admin_usertag > 1 ? 'user-select-none' : ''}">
										<thead>
											<tr>
												<th>지역</th>
												<th>총점포수</th>
											</tr>
										</thead>
										<tbody id="tbody_5_3_1">
										</tbody>
									</table>
								</div>
								<div class="reference"></div>
							</div>

							<div class="position-relative pb-10 mb-10" data-table-wrapper="table_5_2_1" style="display: none;">
								<div class="d-flex justify-content-between align-items-center h-40px">
									<h3>
										<span class="font-weight-bold text-dark">업종분포 추이 상세 데이터 (단위: 개소)</span>
										<i class="fas fa-question-circle icon-md text-muted ml-3" data-toggle="tooltip" data-placement="right" title="선택지역의 상가 유형별 공급(분양) 동향을 그래프 및 테이블 형식제공"></i>
									</h3>
								</div>
								<div class="mb-2">
									<div class="row align-items-end">
										<div class="col-lg-3 col-xl-4">
											<label class="count">총 <span data-cnt-rawdata>0</span>건</label>
										</div>
										<div class="col-lg-9 col-xl-8 text-right">
											<!-- 201215 버튼추가 -->
											<c:if test="${admin_usertag < 2}">
											<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1" data-btn-download="table_5_2_1" style="visibility: hidden;"><i class="flaticon-download icon-md"></i> 다운로드</button>
											</c:if>
										</div>
									</div>
								</div>

								<!--begin: Datatable-->
								<table id="table_5_2_1" class="table-vertical border-bottom table-header ${admin_usertag > 1 ? 'user-select-none' : ''}">
									<thead>
										<tr>
											<th>지역</th>
											<th>상가명</th>
											<th>대분류</th>
											<th>중분류</th>
											<th>소분류</th>
											<th>층</th>
											<th>등록년월</th>
										</tr>
									</thead>
									<tbody id="tbody_5_2_1">
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

					<div class="tab-pane fade show active bg-light" role="tabpanel" id="tab02" data-wrapper="wrapper2023" style="display:none">
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
							<!-- //detailSearch #01 -->

						<div data-content-mode="2023" style="display:none">
						<div class="detailContent">
							<div class="pb-20">
							<div class="fixedWrap" data-ui-user-date="false">
								<div class="d-flex justify-content-between align-items-center h-40px">
									<h3 class="mb-5 changeTitle" data-select-sgg>
										<span class="font-weight-bold text-dark">업종분포현황</span>
										<i class="fa fa-question-circle icon-md ml-3 tooltipCustom">
											<span class="tooltipCustom-text">
												소상공인진흥원에서 매 분기 제공하는 상가업소정보를 바탕으로 업종 유형을 구분하여 제공합니다.
											</span>
										</i>
									</h3>
								</div>
								<div class="tableHeaderWrap"></div>
							</div>


							<!-- chart start -->
							<div class="row" data-ui-user-date="false">
								<div class="col-6">
									<div class="chartWrap border height-600px" data-chart-wrapper="chart_1_1_2">
										<h4>
											<span data-sgg-nm></span> <span data-dong-nm></span> 업종분포현황 추이 차트 (단위: 개소)
										</h4>

										<div class="chart mb-10">
											<div id="chart_1_1_2"></div>
<!-- 											<div class="px-6"> -->
<!-- 												<div class="mt-1"> -->
<!-- 													<div id="kt_nouislider_1" class="nouislider nouislider-connect-danger"></div> -->
<!-- 												</div> -->
<!-- 											</div> -->
										</div>
										<div class="reference"></div>
									</div>
								</div>

								<div class="col-6">
									<div class="border">
										<div class="chartWrap height-300px"  data-chart-wrapper="chart_2_1_2">
											<h4>
												<span data-last-year></span> <span data-sgg-nm></span> <span data-dong-nm></span> 업종분포현황 추이 - 선택 연도로부터 최근 <span data-section></span>구간 (단위: 개소)
											</h4>

											<div class="chart">
												<div id="chart_2_1_2"></div>

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
												<div class="all" data-chart-wrapper="chart_3_1_2">
													<h4>
														<span data-last-year></span> <span data-sgg-nm></span> <span data-dong-nm></span> 업종분포현황 동향
													</h4>
													<h5>전체 업종 : <span data-industry-total></span> 건 / 1전 대비 <span class="text-danger" data-industry-rate></span> <span data-industry-rate-up> </span></h5>

													<div class="chart-area">
														<div class="rate-wrap-deprecated">

															<table id="table_3_1_2" class="table-no-border" style="display: none;">
																<thead>
																	<tr>
																		<th></th>
																		<th></th>
																		<th>1전대비</th>
																	</tr>
																</thead>
																<tbody>
																</tbody>
															</table>
														</div>

														<div id="chart_3_1_2" class="w-100"></div>
													</div>
												</div>

												<div class="all" data-chart-wrapper="chart_3_2_2" style="display: none;">
													<h4>
														<span data-last-year></span> <span data-sgg-nm></span> <span data-dong-nm></span> 업종분포현황 동향 (단위: 개소)
													</h4>
													<h5><span data-last-year></span> <span data-sgg-nm></span> <span data-dong-nm></span> 전체 업종 : <span data-industry-total></span> 개소 / 전년 대비 <span class="text-danger" data-industry-rate> </span> <span data-industry-rate-up> </span></h5>

													<div class="chart-area">
<%--
														<div class="rate-wrap-deprecated">
															<table id="table_3_2" class="table-no-border" style="display: none;" style="display: none;">
																<thead>
																	<tr>
																		<th></th>
																		<th></th>
																		<th>전년대비</th>
																	</tr>
																</thead>
																<tbody>
																</tbody>
															</table>
														</div>
--%>
														<div id="chart_3_2_2" class="w-100"></div>
													</div>
												</div>
											</div>
											<div class="reference"></div>
										</div>
									</div>
								</div>
							</div>
							</div>

							<div class="position-relative pb-10 " data-table-wrapper="table_5_1_2" data-ui-user-date="false"><!-- 230824수정 -->
								<div class="d-flex justify-content-between align-items-center h-40px">
									<h3>
										<span class="font-weight-bold text-dark">업종분포 추이 데이터 (단위: 개소)</span>
										<i class="fa fa-question-circle icon-md ml-3 tooltipCustom">
											<span class="tooltipCustom-text">
												선택한 지역과 필터에 맞춰 통계 데이터를 제공합니다.<br>
												구분값을 클릭할 시 하위 정보를 열람하실 수 있습니다.
											</span>
										</i>
									</h3>
									<!-- 201215 버튼추가 -->
									<div class="btn_wrap">
										<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1" data-btn-download="table_5_1_2" style="visibility: hidden;"><i class="flaticon-download icon-md"></i> 다운로드</button>
									</div>
								</div>

								<div class="table-wrap head_fix_wrap"><!-- 230824수정 -->
									<!--begin: Datatable-->
									<table id="table_5_1_2" class="table-vertical thin double-header table-header ${admin_usertag > 1 ? 'user-select-none' : ''}">
										<thead>
											<tr>
												<th>지역</th>
												<th>대분류</th>
												<th>중분류</th>
												<th>층</th>
											</tr>
										</thead>
										<tbody id="tbody_5_1_2">
										</tbody>
									</table>
									<!--end: Datatable-->
								</div>
								<div class="reference"></div>
							</div>

							<div class="position-relative pb-10 mb-10" data-table-wrapper="table_5_3_2" style="display: none;" data-ui-user-date="true">
								<div class="d-flex justify-content-between align-items-center h-40px">
									<h3>
										<span class="font-weight-bold text-dark">공급 추이 합산 데이터</span>
										<i class="fas fa-question-circle icon-md text-muted ml-3" data-toggle="tooltip" data-placement="right" title="선택지역의 상가 유형별 공급(분양) 동향을 그래프 및 테이블 형식제공"></i>
									</h3>
								</div>
								<div class="mb-2">
									<div class="row align-items-end">
										<div class="col-lg-3 col-xl-4">
										</div>
										<div class="col-lg-9 col-xl-8 text-right">
											<!-- 201215 버튼추가 -->
											<c:if test="${admin_usertag < 2}">
											<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1" data-btn-download="table_5_3_2" style="visibility: hidden;"><i class="flaticon-download icon-md"></i> 다운로드</button>
											</c:if>
										</div>
									</div>
								</div>

								<!--begin: Datatable-->
								<table id="table_5_3_2" class="table-vertical border-bottom table-header ${admin_usertag > 1 ? 'user-select-none' : ''}">
									<thead>
										<tr>
											<th>지역</th>
											<th>총점포수</th>
										</tr>
									</thead>
									<tbody id="tbody_5_3_2">
									</tbody>
								</table>
								<div class="reference"></div>
							</div>

							<div class="position-relative pb-10 mb-10" data-table-wrapper="table_5_2_2" style="display: none;">
								<div class="d-flex justify-content-between align-items-center h-40px">
									<h3>
										<span class="font-weight-bold text-dark">업종분포 추이 상세 데이터 (단위: 개소)</span>
										<i class="fas fa-question-circle icon-md text-muted ml-3" data-toggle="tooltip" data-placement="right" title="선택지역의 상가 유형별 공급(분양) 동향을 그래프 및 테이블 형식제공"></i>
									</h3>
								</div>
								<div class="mb-2">
									<div class="row align-items-end">
										<div class="col-lg-3 col-xl-4">
											<label class="count">총 <span data-cnt-rawdata>0</span>건</label>
										</div>
										<div class="col-lg-9 col-xl-8 text-right">
											<!-- 201215 버튼추가 -->
											<c:if test="${admin_usertag < 2}">
											<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1" data-btn-download="table_5_2_2" style="visibility: hidden;"><i class="flaticon-download icon-md"></i> 다운로드</button>
											</c:if>
										</div>
									</div>
								</div>

								<!--begin: Datatable-->
								<table id="table_5_2_2" class="table-vertical border-bottom table-header ${admin_usertag > 1 ? 'user-select-none' : ''}">
									<thead>
										<tr>
											<th>지역</th>
											<th>상가명</th>
											<th>대분류</th>
											<th>중분류</th>
											<th>소분류</th>
											<th>층</th>
											<th>등록년월</th>
										</tr>
									</thead>
									<tbody id="tbody_5_2_2">
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
				<h5 class="modal-title">전체보기</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<i aria-hidden="true" class="ki ki-close"></i>
				</button>
			</div>
			<div class="modal-body" data-modal-body>
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
		<td style="white-space: nowrap;">{{title}}</td>
		<td style="white-space: nowrap;">{{compare0}}개소({{total}})</td>
		<td>{{compare1}}</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />

<c:out value="<script type='text/template' id='tmplTableIndustryInfoSanggaType'>" escapeXml="false" />
{{#each dataArr}}
	<tr class="tr-border data-show maintotal" data-dong="{{dongnm}}">
		<td>{{dongnm}}</td>
		<td style="text-align:center;" colspan="3">총계</td>
		{{#each sum}}
			<td style="text-align: right;">{{this}}</td>
		{{/each}}
	</tr>	
	{{#each industryTypeData}}
		<tr class="tr-border data-show subtotal" data-dong="{{../dongnm}}" data-type="{{industryType}}">
			<td>{{industryType}}</td>
			<td style="text-align:center;" colspan="2">합계</td>
			{{#each sum}}
				<td style="text-align: right;">{{this}}</td>
			{{/each}}
		</tr>	
		{{#each industryTypemData}}
			{{#each ../../../floorTypeArr}}
				{{#if @first}}					
					<tr class="tr-border data-show subtotal2" data-dong="{{../../../dongnm}}" data-type="{{../../industryType}}" data-sex="{{../industryTypeM}}">
						<td>{{../industryTypeM}}</td>
						<td>계</td>
				{{else}}
					<tr class="tr-border data-show subdata" data-dong="{{../../../dongnm}}" data-type="{{../../industryType}}" data-sex="{{../industryTypeM}}">
						<td>{{this}}</td>
				{{/if}}
				{{#with (lookup ../../this.industryTypemData @../index)}}
					{{#each (lookup this.data @index)}}
						<td style="text-align: right;">{{this}}</td>
					{{/each}}
				{{/with}}
				</tr>
			{{/each}}
			
		{{/each}}	
	{{/each}}
{{/each}}
<c:out value="</script>" escapeXml="false" />



<c:out value="<script type='text/template' id='tmplTableIndustryInfoSanggaType2'>" escapeXml="false" />
{{#each dataArr}}
	<tr class="tr-border data-show maintotal" data-dong="{{dongnm}}">
		<td rowspan="{{../dongRowSpan}}">{{dongnm}}</td>
		<td style="text-align:center;" colspan="2" class="relative2">총계</td>
		{{#each sum}}
			<td style="text-align: right;">{{this}}</td>
		{{/each}}
	</tr>
	{{#each ../sanggaTypeArr}}
		{{#each ../../floorTypeArr}}
			{{#if (lookup ../../../firstLineArr @index)}}
				<tr class="tr-border data-show subtotal" data-dong="{{../../dongnm}}" data-sangga="{{../this}}">
					<td rowspan="{{../../../sanggaRowSpan}}" class="border-weight bg-white">{{../this}}</td>
					<td class="relative">{{{this}}}</td>
			{{else}}
				<tr class="tr-border data-show subdata" data-dong="{{../../dongnm}}" data-sangga="{{../this}}">
					<td>{{this}}</td>
			{{/if}}
				{{#with (lookup ../../this.industryTypeData @../index)}}
					{{#each (lookup this.data @index)}}
						<td style="text-align: right;">{{this}}</td>
					{{/each}}
				{{/with}}
			</tr>
		{{/each}}
	{{/each}}

{{/each}}
<c:out value="</script>" escapeXml="false" />

<c:out value="<script type='text/template' id='tmplTableIndustryInfoDetail'>" escapeXml="false" />
{{#each dataArr}}
	<tr {{#if isHidden}}data-hidden{{/if}}>
		<td>{{dongnm}}</td>
		<td>{{상가명}}</td>
		<td>{{상권업종대분류명}}</td>
		<td>{{상권업종중분류명}}</td>
		<td>{{상권업종소분류명}}</td>
		<td>{{층정보}}</td>
		<td>{{기준월}}</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />

<c:out value="<script type='text/template' id='tmplTableIndustryInfoSum'>" escapeXml="false" />
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

