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
					<span class="font-weight-bolder text-dark">사용자 계정 상세정보</span>
				</h3>
				<!-- 201215 추가 -->
				<div class="card-toolbar">
					<div class="d-flex align-items-center">
						<i class="flaticon-buildings text-dark mb-1"></i>
						<i class="ki ki-arrow-next icon-sm mx-2"></i>
						계정관리
					</div>
				</div>
			</div>
			<!--end::Header-->
			<!--begin::Body-->
			<div class="card-body pt-9">

				<h4 class="mt-5 mb-5" id="showUserId"></h4>
				<!--begin: Search Form-->
				<div class="bg-light px-6 py-6 font-size-lg line-height-xl">
					법인명 : <span id="showCom"></span><br>
					담당자 : <span id="showManager"></span><br>
					PC 등록대수 : <span id="showIP"></span><br>
					계약기간 : <span id="showContract"></span><br>
					사용기간 : <span id="showLastDay"></span>
				</div>
				<div class="text-center mt-5 mb-8">
					<button type="button" class="btn btn-danger btn-lg font-weight-bold px-11 mr-2" id="updateBtn" onclick="updateAccount();">수정</button>
					<!-- 201223 삭제 -->
<!--											<button type="button" class="btn btn-outline-secondary btn-lg font-weight-bold px-11" data-dismiss="modal">취소</button>-->
				</div>

				<!--end: Search Form-->
				<!--begin: Datatable-->
				<div class="datatable datatable-bordered datatable-head-custom" id="kt_datatable_IP_list" data-order = ''></div>
				<!--end: Datatable-->

				<!--begin:: Nav Line -->
				<ul class="nav nav-tabs nav-tabs-line nav-tabs-line-2x nav-tabs-line-danger">
					<li class="nav-item">
						<a class="nav-link active font-size-lg px-5" data-toggle="tab" data-target="#tab01">사용자 계정 접속내역</a>
					</li>
					<li class="nav-item">
						<a class="nav-link font-size-lg px-5" data-toggle="tab" data-target="#tab02">사용자 계정 IP 변경 내역</a>
					</li>
				</ul>
				<!--end:: Nav Line -->
				<div class="tab-content">
					<div class="tab-pane fade show active mt-10" id="tab01" role="tabpanel">
						<div class="row mb-3">
							<div class="col-9"></div>
							<div class="col-3">
								<div class="input-icon mb-2">
									<input type="text" class="form-control input_bottom_line" placeholder="검색어를 입력하세요" id="kt_datatable_login_search">
									<span><i class="flaticon2-search-1 text-muted"></i></span>
								</div>
								<!-- <div class="d-flex align-items-center">
									<select class="form-control selectpicker" id="historyShowCnt" onchange="reShow('kt_datatable_login_history');">
										<option value="10" selected="selected">10개 보기</option>
										<option value="15">15개 보기</option>
										<option value="20">20개 보기</option>
										<option value="30">30개 보기</option>
									</select>
								</div> -->
							</div>
						</div>
						
						<div class="datatable datatable-bordered datatable-head-custom" id="kt_datatable_login_history" data-order = ''></div>
					</div>
					<!-- tab 02 -->
					<div class="tab-pane fade mt-10" id="tab02" role="tabpanel">
						<div class="row mb-3">
							<div class="col-9"></div>
							<div class="col-3">
								<div class="input-icon mb-2">
									<input type="text" class="form-control input_bottom_line" placeholder="검색어를 입력하세요" id="kt_datatable_ipchange_search">
									<span><i class="flaticon2-search-1 text-muted"></i></span>
								</div>
								<!-- <div class="d-flex align-items-center">
									<select class="form-control selectpicker" id="IPChangeShowCnt">
										<option value="10">10개 보기</option>
										<option value="15">15개 보기</option>
										<option value="20">20개 보기</option>
										<option value="30">30개 보기</option>
									</select>
								</div> -->
							</div>
						</div>
						<div class="datatable datatable-bordered datatable-head-custom" id="kt_datatable_IPChange_history" data-order = ''></div>
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

<!--begin::Modal-->
<div id="kt_datatable_modal" class="modal fade" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-xl">
		<div class="modal-content" style="min-height: 590px;">
			<div class="modal-header py-5">
				<h5 class="modal-title">메뉴별 접속시간</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<i aria-hidden="true" class="ki ki-close"></i>
				</button>
			</div>
			<div class="modal-body">
				<div class="mb-5">
					<div class="row align-items-center">
						<div class="col-lg-9 col-xl-8"></div>
					</div>
				</div>
				<!--begin: Datatable-->
				<div class="datatable datatable-bordered datatable-head-custom" id="kt_datatable_menu_access_time"></div>
				<!--end: Datatable-->
			</div>
		</div>
	</div>
</div>
<!--end::Modal-->