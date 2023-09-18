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
                                            <span class="font-weight-bolder text-dark">공고 & 분기리포트</span>
                                        </h3>
										<div class="card-toolbar">
											<div class="d-flex align-items-center">
												<i class="flaticon-buildings text-dark mb-1"></i>
												<i class="ki ki-arrow-next icon-sm mx-2"></i>
												<a href="javascript:;">공고 & 분기리포트</a>
											</div>
										</div>
                                    </div>
                                    <!--end::Header-->
                                    <!--begin::Body-->
                                    <div class="card-body pt-9">
                                        <!--begin: Search Form-->
										<div class="mt-9 mb-7">
											<div class="row align-items-center">
												<div class="col-lg-9 col-xl-8">
													<div class="row align-items-center">
														<div class="col-md-4 my-2 my-md-0">
															<div class="input-icon">
																<input type="text" class="form-control input_bottom_line" placeholder="검색어를 입력하세요" id="kt_datatable_search_query" />
																<span>
																	<i class="flaticon2-search-1 text-muted"></i>
																</span>
															</div>
														</div>
														<div class="col-md-3 my-2 my-md-0">
															<div class="d-flex align-items-center">
																<label class="mr-3 mb-0 d-none d-md-block text-nowrap">분류:</label>
																<select class="form-control" id="kt_datatable_search_status"></select>
															</div>
														</div>																												
													</div>
												</div>
												<div class="col-lg-3 col-xl-4 mt-5 mt-lg-0 text-right">
												</div>
											</div>
										</div>
										<!--end: Search Form-->
										<!--begin: Datatable-->
										<div class="datatable datatable-bordered datatable-head-custom" id="kt_datatable"></div>
										<!--end: Datatable-->
                                    </div>
                                    <!--end: Card Body-->
                                </div>
                                <!--end: Card-->
							</div>
							<!--end::Container-->
						</div>
						<!--end::Entry-->
