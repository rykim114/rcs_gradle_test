<%@ page language="java" contentType="text/html; charset=UTF-8"	session="true" pageEncoding="utf-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>       
					
<!--begin::Entry-->
<div class="d-flex flex-column-fluid">
	<!--begin::Container-->
	<div class="container-fluid">
		<!--begin::Card-->
		<div class="card card-custom card-stretch rounded-0">
			<!--begin::Header-->
			<div class="card-header align-items-center border-bottom">
				<h3 class="card-title align-items-center">
					<span class="font-weight-bolder text-dark">공지관리</span>
				</h3>
				<div class="card-toolbar">
					<div class="d-flex align-items-center">
						<i class="flaticon-buildings text-dark mb-1"></i>
						<i class="ki ki-arrow-next icon-sm mx-2"></i>
						<a href="javascript:;">공지관리</a>
					</div>
				</div>
			</div>
			<!--end::Header-->
			<!--begin::Body-->
			<div class="card-body pt-9">
				<!--begin: Search Form-->
				<div class="mb-7">
					<div class="row align-items-center">
						<div class="col-lg-9 col-xl-8">
							<div class="row align-items-center">
								<div class="col-md-4 my-2 my-md-0">
									<div class="input-icon">
										<input type="text" autocomplete="off" class="form-control input_bottom_line" placeholder="검색어를 입력하세요" id="kt_datatable_search_query" />
										<input type="password" value="" autocomplete="new-password" style="display:none;" />				
										<span>
											<i class="flaticon2-search-1 text-muted"></i>
										</span>
									</div>
								</div>
								<div class="col-md-3 my-2 my-md-0">
									<div class="d-flex align-items-center">
										<label class="mr-3 mb-0 d-none d-md-block text-nowrap">분류:</label>
										<select class="form-control" id="kt_datatable_search_status">
											<option value="">전체</option>
											<option value="1">공지</option>
											<option value="2">안내</option>
											<option value="3">업데이트</option>
											<option value="4">이벤트</option>
										</select>
									</div>
								</div>
								
							</div>
						</div>
						<div class="col-lg-3 col-xl-4 mt-5 mt-lg-0 text-right">
							<a href="javascript:;" id="noticeWrite" class="btn btn-square btn-outline-danger btn-md ml-3">신규등록</a>
						</div>
					</div>
				</div>
				<!--end: Search Form-->
				<!--begin: Datatable-->
				<div class="datatable datatable-bordered datatable-head-custom" id="notice_table" data-order = ''></div>
				<!--end: Datatable-->
			</div>
			<!--end: Card Body-->
		</div>
		<!--end: Card-->
	</div>
	<!--end::Container-->
</div>
<!--end::Entry-->