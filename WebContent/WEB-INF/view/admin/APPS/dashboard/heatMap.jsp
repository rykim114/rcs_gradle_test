<%@ page language="java" contentType="text/html; charset=UTF-8"	session="true" pageEncoding="utf-8" trimDirectiveWhitespaces="true"%>
		
<!--begin::Entry-->
<div class="d-flex flex-column-fluid">
	<!--begin::Container-->
	<div class="container-fluid">
		<!--begin::Card-->
		<div class="card card-custom card-stretch rounded-0">
			<!--begin::Header-->
			<div class="card-header align-items-center border-bottom">
				<h3 class="card-title align-items-center">
					<span class="font-weight-bolder text-dark">HeatMap</span>
				</h3>
				<div class="card-toolbar">
					<div class="d-flex align-items-center">
						<i class="flaticon-buildings text-dark mb-1"></i>
						<i class="ki ki-arrow-next icon-sm mx-2"></i>
						<a href="javascript:;">대시보드</a>
						<i class="ki ki-arrow-next icon-sm mx-2"></i>
						<a href="javascript:;">평균분양가</a>
					</div>
				</div>
			</div>
			<!--end::Header-->
			<!--begin::Body-->
			<div class="card-body px-0 py-0">
				<!--begin: Search Form-->
				<div class="px-9 py-2 bg-gray-200">
					<div class="row align-items-center">
						<div class="col-lg-10 col-xl-10">
							<div class="row align-items-center">
								<div class="col-md-6 my-2 my-md-0 d-flex align-items-center">
									<div class="d-flex align-items-center pr-7 position-relative">
										<button type="button" class="btn btn-danger rounded-0 px-4 m-0" id="ktAreaBtn">지역</button>
										<button type="button" class="btn btn-outline-secondary rounded-0 px-4 m-0" id="ktStrBtn">상권</button>
										<!--begin:: Search Result -->
										<div class="position-absolute border bg-white str-block-layer w-350px" id="strStrLayer" style="display: none">
											<div class="px-3 pt-3">
												<h3 class="font-size-h6">역세권 검색</h3>
											</div>
											<div class="d-flex align-items-center px-3 py-3">
												<select class="form-control selectpicker mr-2 w-120px">
													<option value="">서울특별시</option>
												</select>
												<select class="form-control selectpicker mr-2 w-120px">
													<option value="">관악구</option>
												</select>
												<button type="button" class="btn btn-dark btn-search px-6">조회</button>
											</div>
											<div class="ps scroll" data-scroll="true" data-height="200" data-mobile-height="200" style="height:200px" >
												<div class="">
													<ul class="list-group rounded-0">
														<li class="list-group-item pt-3 pb-0 border-0">
															<a href="javascript:;" class="d-block border-bottom border-light-secondary pb-5"><i class="flaticon2-pin text-muted mr-1"></i> <span class="font-size-lg font-weight-bold">서울특별시 강남구 역삼역</span></a>
														</li>
														<li class="list-group-item pt-3 pb-0 border-0">
															<a href="javascript:;" class="d-block border-bottom border-light-secondary pb-5"><i class="flaticon2-pin text-muted mr-1"></i> <span class="font-size-lg font-weight-bold">서울특별시 강남구 역삼역</span></a>
														</li>
														<li class="list-group-item pt-3 pb-0 border-0">
															<a href="javascript:;" class="d-block border-bottom border-light-secondary pb-5"><i class="flaticon2-pin text-muted mr-1"></i> <span class="font-size-lg font-weight-bold">서울특별시 강남구 역삼역</span></a>
														</li>
														<li class="list-group-item pt-3 pb-0 border-0">
															<a href="javascript:;" class="d-block border-bottom border-light-secondary pb-5"><i class="flaticon2-pin text-muted mr-1"></i> <span class="font-size-lg font-weight-bold">서울특별시 강남구 역삼역</span></a>
														</li>
														<li class="list-group-item pt-3 pb-0 border-0">
															<a href="javascript:;" class="d-block border-bottom border-light-secondary pb-5"><i class="flaticon2-pin text-muted mr-1"></i> <span class="font-size-lg font-weight-bold">서울특별시 강남구 역삼역</span></a>
														</li>
													</ul>
													<div class="">
														<button type="button" class="btn btn-square btn-secondary border-0 bg-light-secondary btn-block font-size-lg">+ 더보기</button>
													</div>
												</div>
											</div>
										</div>
										<!--end:: Search Result -->
									</div>
									<div class="d-flex align-items-center pl-7 border-left">
										<select class="form-control selectpicker mr-2 w-120px">
											<option value="">서울특별시</option>
										</select>
										<select class="form-control selectpicker mr-2 w-120px">
											<option value="">관악구</option>
										</select>
										<!-- 201215 삭제 -->
										<!-- <select class="form-control selectpicker mr-2 w-120px">
											<option value="">전체</option>
										</select> -->
									</div>
								</div>
								<div class="col-md-3 my-2 my-md-0">
									<div class="d-flex align-items-center">
										<label class="mr-3 mb-0 d-none d-md-block text-nowrap">기간</label>
										<select class="form-control selectpicker w-80px">
											<option value="">연간</option>
										</select>
										<label class="mr-3 mb-0 d-none d-md-block text-nowrap ml-3">유형</label>
										<select class="form-control selectpicker w-120px">
											<option value="">전체</option>
										</select>
									</div>
								</div>
								<div class="col-md-3 my-2 my-md-0">
									<div class="d-flex align-items-center">
										<label class="mr-3 mb-0 d-none d-md-block text-nowrap">층별</label>
										<select class="form-control selectpicker w-80px">
											<option value="">B1</option>
										</select>
										<label class="mr-3 mb-0 d-none d-md-block text-nowrap ml-3">면적</label>
										<select class="form-control selectpicker w-120px">
											<option value="">계약면적</option>
										</select>
									</div>
								</div>
							</div>
						</div>
						<div class="col-lg-2 col-xl-2 mt-5 text-right">
							<button class="border px-5 py-1 border-danger text-danger bg-white border-right-0">㎡</button><button class="border px-3 py-1 bg-white">3.3㎡</button>
							<p class="font-size-sm mt-2 mb-0">출처:부동산114</p>
						</div>
					</div>
				</div>
				<!--end: Search Form-->
				<div class="row mt-11">
					<div class="col-lg-6 px-9 pr-md-4">
						<div class="d-flex justify-content-between align-items-center h-40px">
							<h3 class="font-size-h5">
								<span class="font-weight-bold text-dark">선택지역 과거추이</span>
								<i class="fas fa-question-circle icon-md text-muted ml-3" data-toggle="tooltip" data-placement="right" title="기간별 전년대비 상가유형별 임대료 변동율 그래프"></i>
							</h3>
							<!-- 201215 삭제 -->
							<!-- <button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1"><i class="flaticon-download icon-md"></i> 다운로드</button> -->
						</div>
						<div class="border border-secondary px-6 pt-2 h-275px overflow-auto">
							<div id="chart_2"></div>
							<div class="px-6">
								<div class="mt-1">
									<div id="kt_nouislider_1" class="nouislider nouislider-connect-danger"></div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-lg-6 px-9 pl-md-4">
						<!-- 201215 수정 -->
						<div class="dashboard_tab_content_box">
							<!-- S: 차트 -->
							<div class="dashboard_tab_content active" id="dashboard_tab_content_0">
								<div class="d-flex justify-content-between align-items-center h-40px">
									<div class="d-flex align-items-center">
										<h3 class="font-size-h5 mr-3">
											<span class="font-weight-bold text-dark">지역비교</span>
										</h3>
										<div class="d-flex align-items-center">
											<select class="form-control selectpicker w-100px mr-2">
												<option value="">근린상가</option>
											</select>
											<select class="form-control selectpicker w-80px mr-2">
												<option value="">2020</option>
											</select>
										</div>
									</div>
									<div class="d-flex align-items-center dashboard_tab_box">
										<button type="button" class="btn btn-danger btn-sm rounded-0 px-4 m-0">차트</button>
										<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-4 m-0">단지목록</button>
									</div>
								</div>
								<div class="border border-secondary px-6 pt-2 h-275px overflow-auto">
									<div id="chart_1_1"></div>
								</div>
							</div>
							
							<!-- E: 차트 -->
							<!-- S: 목록  -->
							<div class="dashboard_tab_content" id="dashboard_tab_content_1" >
								<div class="d-flex justify-content-between align-items-center h-40px ">
									<div class="d-flex align-items-center">
										<h3 class="font-size-h5 mr-3">
											<span class="font-weight-bold text-dark">단지목록</span>
										</h3>
										<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1"><i class="flaticon-download icon-md"></i> 다운로드</button>
									</div>
									<div class="d-flex align-items-center dashboard_tab_box">
										<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-4 m-0">차트</button>
										<button type="button" class="btn btn-danger btn-sm rounded-0 px-4 m-0">단지목록</button>
									</div>
								</div>
								<div class="border border-secondary h-275px scroll_table_box overflow-hidden" >
									<!--begin: Datatable-->
									<div class="datatable datatable-bordered datatable-head-custom scroll_x_table" id="kt_datatable_1"></div>
									<!--end: Datatable-->
								</div>
							</div>
							<!-- E: 목록 -->
						</div>
					</div>
				</div>
				<div class="row mt-11 mb-9">
					<div class="col-lg-12 px-9">
						<div class="d-flex justify-content-between align-items-center h-40px">
							<h3 class="font-size-h5">
								<span class="font-weight-bold text-dark">지역별가격동향</span>
								<i class="fas fa-question-circle icon-md text-muted ml-3" data-toggle="tooltip" data-placement="right" title="선택지역의 상가 유형별 공급(분양) 동향을 그래프 및 테이블 형식제공"></i>
							</h3>
							<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1"><i class="flaticon-download icon-md"></i> 다운로드</button>
						</div>
						<div class="border border-secondary h-275px overflow-hidden">
							<!--begin: Datatable-->
							<div class="datatable datatable-bordered datatable-head-custom" id="kt_datatable_2"></div>
							<!--end: Datatable-->
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
<script src="/resources/admin/APPS/dashboard/heatMap.js" type="text/javascript"></script>
<script src="/resources/common/custom/js/pages/gis/nouislider.js"></script>