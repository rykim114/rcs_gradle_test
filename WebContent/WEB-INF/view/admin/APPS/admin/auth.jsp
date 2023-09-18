<%@ page language="java" contentType="text/html; charset=UTF-8"	session="true" pageEncoding="utf-8" trimDirectiveWhitespaces="true"%>
<!--begin::Entry-->

<style>
	.trSelected {
		background-color : #fff3f3 !important;
	}
</style>	
<div class="d-flex flex-column-fluid">
	<!--begin::Container-->
	<div class="container-fluid">
		<!--begin::Card-->
		<div class="card card-custom card-stretch rounded-0">
			<!--begin::Header-->
			<div class="card-header align-items-center border-bottom">
				<h3 class="card-title align-items-center">
					<span class="font-weight-bolder text-dark">권한관리</span>
				</h3>
				<div class="card-toolbar">
					<div class="d-flex align-items-center">
						<i class="flaticon-buildings text-dark mb-1"></i>
						<i class="ki ki-arrow-next icon-sm mx-2"></i>
						<a href="javascript:;">권한관리</a>
					</div>
				</div>
			</div>
			<!--end::Header-->
			<!--begin::Body-->
			<div id="authMenu" class="card-body pt-9">
				<div class="row">
					<div class="col-md-5">
						<div class="d-flex justify-content-between align-items-end h-40px">
							<h3 class="font-size-h5">그룹권한</h3>
							<div>
								<button class="btn btn-square btn-outline-danger btn-md" data-btn-auth >신규등록</button>

							</div>
						</div>
						<div class="border mt-4 nav-auth-wrap h-700px overflow-auto">
							 <div class="datatable datatable-bordered datatable-head-custom" id="authTable"></div>
						</div>
						<input type="hidden" name="groupCode" value=""/>
					</div>
					<div class="col-md-7 pl-md-10">
						<div class="d-flex align-items-end justify-content-between h-40px">
							<h3 class="font-size-h5">각 그룹별 메뉴를 선택하세요</h3>
							<div>
								<button class="btn btn-square btn-outline-danger btn-md ml-2" data-btn-save-menu >저장</button>
							</div>
						</div>
						<div class="border mt-4 h-700px overflow-auto">
							<table id="authMenuTable" class="table border-bottom">
								<thead>
									<tr>
										<th class="text-center bg-gray-200">No</th>
										<th class="text-center bg-gray-200">메뉴</th>
										<th class="text-center bg-gray-200">
											<label class="checkbox justify-content-center">
												<input type="checkbox" id="allCheck" name="allCheck"/>
												<span></span>
											</label>
										</th>
										<th class="text-center bg-gray-200">
											<span>엑셀다운</span>
										</th>
										<th class="text-center bg-gray-200">
											<span>상세다운</span>
										</th>
									</tr>
								</thead>
								<tbody>
								   
								</tbody>
							</table>
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
<!--begin::Modal-->
 <div id="authModal" class="modal fade" tabindex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header py-5">
				<h5 class="modal-title" id="authModalLabel">권한관리</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<i aria-hidden="true" class="ki ki-close"></i>
				</button>
			</div>
			<div class="modal-body">
				<!--begin: Write Form-->
				<table class="table">
					<colgroup>
						<col style="width:30%" />
						<col style="width:70%" />
					</colgroup>
					<tbody>
						<tr>
							<th class="border-0">
								<label class=""><span class="d-block font-size-lg font-weight-bold mt-3">그룹명</span></label>
							</th>
							<td class="border-0">
								<input class="form-control form-control-solid border border-secondary rounded-sm" type="text" value="" placeholder="" name="권한_그룹명" required aria-discribedby="validation_권한_그룹명" >
								<div id="validation_권한_그룹명" class="invalid-feedback">
									그룹명을 입력해주세요
								</div>
							</td>
						</tr>
						<tr>
							<th>
								<label class=""><span class="d-block font-size-lg font-weight-bold mt-3">설명</span></label>
							</th>
							<td>
								<input class="form-control form-control-solid border border-secondary rounded-sm" type="text" value="" placeholder="" name="권한_그룹설명" required aria-discribedby="validation_권한_그룹설명">
								<div id="validation_권한_그룹설명" class="invalid-feedback">
									설명을 입력해주세요
								</div>
							</td>
						</tr>
						<tr>
							<th>
								<label class=""><span class="d-block font-size-lg font-weight-bold mt-3">드래그 금지</span></label>
							</th>
							<td class="datatable-cell-center datatable-cell datatable-cell-check" style="vertical-align:inherit;">
								 <span style="width: 20px;">
	                                <label class="checkbox checkbox-single seq">
										<input type="checkbox" value="" name="권한_드래그금지"><span></span>
									</label>
                                </span>
							</td>
						</tr>
						<tr>
							<th>
								<label class=""><span class="d-block font-size-lg font-weight-bold mt-3">아이피확인</span></label>
							</th>
							<td class="datatable-cell-center datatable-cell datatable-cell-check" style="vertical-align:inherit;">
								 <span style="width: 20px;">
	                                <label class="checkbox checkbox-single seq">
										<input type="checkbox" value="" name="권한_아이피확인"><span></span>
									</label>
                                </span>
							</td>
						</tr>
					</tbody>
				</table>
				<!--end: Write Form-->
			</div>
			<div class="modal-footer justify-content-center">
				<button type="reset" id="confirmBtn" class="btn btn-danger btn-lg mr-2 font-weight-bold px-110" data-btn-save-auth>확인</button>
				<button type="reset" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold" data-dismiss="modal" aria-label="Close">취소</button>
			</div>
		</div>
	</div>
</div>
<!--end::Modal-->