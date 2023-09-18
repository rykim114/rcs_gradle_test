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
					<span class="font-weight-bolder text-dark">계정관리</span>
				</h3>
				<div class="card-toolbar">
					<div class="d-flex align-items-center">
						<i class="flaticon-buildings text-dark mb-1"></i>
						<i class="ki ki-arrow-next icon-sm mx-2"></i>
						<a href="javascript:;">계정관리</a>
					</div>
				</div>
			</div>
			<!--end::Header-->
			<!--begin::Body-->
			<div class="card-body pt-9">
				<!--begin:: Nav Line -->
				<ul class="nav nav-tabs nav-tabs-line nav-tabs-line-2x nav-tabs-line-danger">
					<li class="nav-item">
						<a class="nav-link active font-size-lg px-5" data-bs-toggle="tab" data-bs-target="#tab01" onclick="listAccount();">사용자 계정 현황</a>
					</li>
					<li class="nav-item">
						<a class="nav-link font-size-lg px-5" onclick="newAccount();">사용자 계정 등록</a>
					</li>
				</ul>
				<!--end:: Nav Line -->
				<div class="tab-content">
					<div class="tab-pane fade show active mt-10" role="tabpanel" id="tab01">
						<h4 class="mt-10">사용자 계정 리스트</h4>
						<!--begin: Search Form-->
						<div class="mt-9 mb-2">
							<div class="row align-items-end">
								<div class="col-lg-3 col-xl-4">
									<label class="count">총 <span id="accountMngCnt">0</span>건</label>
								</div>
								<div class="col-lg-9 col-xl-8">
									<div class="row align-items-center justify-content-end">
										<div class="col-md-3 my-2 my-md-0">
											<div class="d-flex align-items-center">
												<label class="mr-3 mb-0 d-none d-md-block text-nowrap">사용여부:</label>
												<select class="form-control" id="kt_datatable_search_use">
													<option value="">전체</option>
													<option value="사용중" selected>사용중</option>
													<option value="만료">만료</option>
												</select>
											</div>
										</div>	
										<div class="col-md-3 my-2 my-md-0">
											<div class="input-icon">
												<input type="text" class="form-control input_bottom_line" placeholder="검색어를 입력하세요" id="kt_datatable_search_query">
												<span><i class="flaticon2-search-1 text-muted"></i></span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!--end: Search Form-->
						<!--begin: Datatable-->
						<!-- <div class="datatable datatable-bordered datatable-head-custom datatable-default datatable-primary datatable-loaded" id="kt_datatable"></div> -->
						
						<div class="datatable datatable-bordered datatable-head-custom" id="kt_datatable" data-order = ''></div>
						<!--end: Datatable-->
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



        