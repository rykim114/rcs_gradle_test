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
                                            <span class="font-weight-bolder text-dark">사용자로그분석</span>
                                        </h3>
                                        <div class="card-toolbar">
                                        </div>
                                    </div>
                                    <!--end::Header-->
                                    <!--begin::Body-->
                                    <div class="card-body pt-9">
                                        <!--begin:: Nav Line -->
                                        <ul class="nav nav-tabs nav-tabs-line nav-tabs-line-2x nav-tabs-line-danger">
                                           <li class="nav-item">
                                                <a class="nav-link font-size-lg px-5" href="#" onclick="userCount();">접속자리스트</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link font-size-lg px-5" href="#" onclick="menuCount();">메뉴별/버튼 클릭수</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link font-size-lg px-5" href="#" onclick="searchCount();">주요 검색 지역</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link active font-size-lg px-5" href="#" onclick="downloadCount();">주요 다운로드 메뉴</a>
                                            </li>
                                        </ul>
                                        <!--end:: Nav Line -->
                                        <!--begin: Search Form-->
										<div class="mt-9 mb-7">
											<div class="row align-items-center">
												<div class="col-lg-9 col-xl-8">
													<div class="row align-items-center">
														<div class="col-md-6 my-2 my-md-0 d-flex align-items-center">
                                                            <span class="font-size-lg text-nowrap mr-4 d-none d-md-block ">기간별검색</span>
															<div class="input-daterange input-group" id="kt_datepicker_1">
                                                                <input type="text" class="form-control dateStart" name="start" />
                                                                <span class="input-group-text border-left-0">
                                                                    <i class="la la-calendar-check-o"></i>
                                                                </span>
                                                                <div class="px-2 py-3">~</div>
                                                                <input type="text" class="form-control dateEnd" name="end" />
                                                                <span class="input-group-text border-left-0">
                                                                    <i class="la la-calendar-check-o"></i>
                                                                </span>
                                                            </div>
														</div>
														<div class="col-md-4 my-2 my-md-0">
															<button type="button" onclick="dateSearch();" class="btn btn-dark btn-search px-6">검색</button>
														</div>
													</div>
												</div>
												<div class="col-lg-3 col-xl-4 mt-5 mt-lg-0 text-right">
												</div>
											</div>
										</div>
										<!--end: Search Form-->
										<!--begin: row-->
										<div class="row">
                                            <div class="col-lg-4">
                                                <div class="datatable datatable-bordered datatable-head-custom" id="kt_datatable"></div>
                                            </div>
                                            <div class="col-lg-8">
                                                <div class="row">
                                                    <div class="col">
                                                        <div class="border border-secondary px-5 py-5 ml-md-9">
                                                            <span class="font-size-lg">최대 클릭수 및 항목</span>
                                                            <div class="d-flex align-items-center justify-content-center py-9">
                                                                <span class="font-size-h3 font-weight-bold mr-6 maxMenu"></span>
                                                                <span class="display-4 text-danger font-weight-bold maxCount"></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col">
                                                        <div class="border border-secondary px-5 py-5 ml-md-9">
                                                            <span class="font-size-lg">최소 클릭수 및 항목</span>
                                                            <div class="d-flex align-items-center justify-content-center py-9">
                                                                <span class="font-size-h3 font-weight-bold mr-6 minMenu"></span>
                                                                <span class="display-4 text-danger font-weight-bold minCount"></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col">
                                                        <div class="border border-secondary px-5 py-5 ml-md-9 mt-md-11">
                                                            <span class="font-size-lg">시간별(클릭수 높은 10가지 항목)</span>
                                                            <div id="usechart_1"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
										<!--end: row-->
                                    </div>
                                    <!--end: Card Body-->
                                </div>
                                <!--end: Card-->
							</div>
							<!--end::Container-->
						</div>
						<!--end::Entry-->
	<script src="/resources/common/custom/js/pages/admin/useLog-datepicker.js"></script>
    <script src="/resources/common/custom/js/pages/admin/useLogcharts.js"></script>										