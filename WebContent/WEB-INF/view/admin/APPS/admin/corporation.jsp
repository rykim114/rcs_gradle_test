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
                  <span id="corpTitle" class="font-weight-bolder text-dark">법인등록</span>
              </h3>
            <div class="card-toolbar">
				<div class="d-flex align-items-center">
					<i class="flaticon-buildings text-dark mb-1"></i>
					<i class="ki ki-arrow-next icon-sm mx-2"></i>
					<a id="navCorpTitle" href="javascript:;">법인등록</a>
				</div>
         </div>
     </div>
     <!--end::Header-->
	     <!--begin::Body-->
	     <div class="card-body pt-9">
			<!--begin:: Nav Line -->
			<ul class="nav nav-tabs nav-tabs-line nav-tabs-line-2x nav-tabs-line-danger" name="tabWrapper">
				<li class="nav-item">
					<a class="nav-link active font-size-lg px-5" data-toggle="tab" data-target="#tab01">법인 등록 현황</a>
				</li>
				<li class="nav-item" id="insertCorp" onclick="goWrite();">
					<a class="nav-link font-size-lg px-5" data-toggle="tab" data-target="#tab02">법인 신규 등록</a>
				</li>
				<li class="nav-item" style="display: none;">
					<a class="nav-link font-size-lg px-5" data-toggle="tab" data-target="#tab03">법인 수정</a>
				</li>				
			</ul>
			<!--end:: Nav Line -->
			<div class="tab-content">
				<div class="tab-pane fade show active mt-10" role="tabpanel" id="tab01">
					<h4 class="mt-10">법인등록 리스트</h4>
					<!--begin: Search Form-->
					<div class="mt-9 mb-2">
						<div class="row align-items-end">
							<div class="col-lg-3 col-xl-4">
								<label class="count">총 <span id="count"></span>건</label>
							</div>
							<div class="col-lg-9 col-xl-8"> 
								<div class="row align-items-center justify-content-end">
									<div class="col-md-4 my-2 my-md-0">
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
					<div class="datatable datatable-bordered datatable-head-custom datatable-default datatable-primary" id="kt_datatable" data-order = ''>
					</div>
					<!--end: Datatable-->
				</div>
				<div class="tab-pane fade mt-10" role="tabpanel" id="tab02">
					<h4 class="mt-10">법인 신규 등록</h4>
					<div class="form-wrap">
						<div class="governing">법인정보를 입력하는 공간입니다.</div>
						<div class="d-flex">
							<div class="col-6">
								<div class="form-group">
									<label class="control-label col-4">사업자등록번호</label>
									<div class="col-8">
										<div class="d-flex">
											<input class="form-control" type="text" name="corpRNumber" id="newCorpRNumber" placeholder="사업자등록번호를 입력해 주세요">
											<button type="button" class="btn btn-outline-secondary w-100px ml-3" onclick="newCorpNumChk(this);">중복확인</button>
										</div>
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-4">법인명</label>
									<div class="col-8">
										<input type="text" class="form-control" id="newCorpName" placeholder="법인명을 입력해 주세요">
									</div>
								</div>
							</div>
							<div class="col-6">
								<div class="form-group">
									<label class="control-label col-4" id="newCorp1">법인구분1</label>
									<div class="col-8">
										<select class="form-control selectpicker" name="corporation1">
											<option value=""></option>
										</select>
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-4" id="newCorp2">법인구분2</label>
									<div class="col-8">
										<select class="form-control selectpicker" name="corporation2">
											<option value="">법인구분 1을 먼저 선택해 주세요.</option>
										</select>
									</div>
								</div>
							</div>
						</div>
						<div class="d-flex">
							<div class="col-12">
								<div class="form-group">
									<label class="control-label col-2">특이사항(메모)</label>
									<div class="col-10">
										<textarea class="form-control" id="newRemarks" rows="5" placeholder="메모할 내용을 입력해 주세요"></textarea>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="text-center pt-8 border-top">
						<a href="javascript:;" class="btn btn-danger btn-lg px-11 font-weight-bold" onclick="insertCorp();">등록완료</a>
					</div>
				</div>
				
			<!-- 법인 수정 -->				
				<div class="tab-pane fade mt-10" role="tabpanel" id="tab03">
					<h4 class="mt-10">법인 수정</h4>
					<div class="form-wrap">
						<div class="governing">법인정보를 수정하는 공간입니다.</div>
						<div class="d-flex">
							<div class="col-6">
								<div class="form-group">
									<label class="control-label col-4">사업자등록번호</label>
									<div class="col-8">
										<div class="d-flex">
											<input class="form-control" type="text" name="corpRNumber" id="corpRNumber" placeholder="사업자등록번호를 입력해 주세요">
											<button type="button" class="btn btn-outline-secondary w-100px ml-3" onclick="corpNumChk(this);">중복확인</button>
										</div>
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-4">법인명</label>
									<div class="col-8">
										<input type="text" class="form-control" id="corpName" placeholder="법인명을 입력해 주세요">
									</div>
								</div>
							</div>
							<div class="col-6">
								<div class="form-group">
									<label class="control-label col-4" id="corp1">법인구분1</label>
									<div class="col-8">
										<select class="form-control selectpicker" name="corporation3">
											<option value=""></option>
										</select>
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-4" id="corp2">법인구분2</label>
									<div class="col-8">
										<select class="form-control selectpicker" name="corporation4">
											<option value=""></option>
										</select>
									</div>
								</div>
							</div>
						</div>
						<div class="d-flex">
							<div class="col-12">
								<div class="form-group">
									<label class="control-label col-2">특이사항(메모)</label>
									<div class="col-10">
										<textarea class="form-control" id="remarks" rows="5" placeholder="메모할 내용을 입력해 주세요">
										</textarea>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="text-center pt-8 border-top">
						<a href="javascript:;" class="btn btn-danger btn-lg px-11 font-weight-bold" onclick="updateCorp();">수정완료</a>
					</div>
					<div style="display: hidden;">
						<input type="hidden" id="updateCorpCode">
						<input type="hidden" id="updateCorpName">
						<input type="hidden" id="updateCorpRNum">
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
