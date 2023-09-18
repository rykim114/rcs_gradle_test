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
			<ul class="nav nav-tabs nav-tabs-line nav-tabs-line-2x nav-tabs-line-danger">
				<li class="nav-item">
					<a class="nav-link font-size-lg px-5" data-bs-toggle="tab" data-bs-target="#tab01">법인등록 현황</a>
				</li>
				<li class="nav-item" onclick="goWrite();">
					<a class="nav-link active font-size-lg px-5" data-bs-toggle="tab" data-bs-target="#tab02">법인 등록</a>
				</li>
			</ul>
			<!--end:: Nav Line -->
			<div class="tab-content">
				<div class="tab-pane show active fade mt-10" role="tabpanel" id="tab02">
					<h4 class="mt-10">법인 신규 등록</h4>
					<div class="form-wrap">
						<div class="governing">법인정보를 입력하는 공간입니다.</div>
						<div class="d-flex">
							<div class="col-6">
								<div class="form-group">
									<label class="control-label col-4">사업자등록번호</label>
									<div class="col-8">
										<div class="d-flex">
											<input class="form-control" type="text" value="" placeholder="">
											<button type="button" class="btn btn-outline-secondary w-100px ml-3">중복확인</button>
										</div>
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-4">법인명</label>
									<div class="col-8">
										<input type="text" class="form-control">
									</div>
								</div>
							</div>
							<div class="col-6">
								<div class="form-group">
									<label class="control-label col-4">법인구분1</label>
									<div class="col-8">
										<input type="text" class="form-control">
									</div>
								</div>
								<div class="form-group">
									<label class="control-label col-4">법인구분2</label>
									<div class="col-8">
										<input type="text" class="form-control">
									</div>
								</div>
							</div>
						</div>
						<div class="d-flex">
							<div class="col-12">
								<div class="form-group">
									<label class="control-label col-2">특이사항(메모)</label>
									<div class="col-10">
										<textarea class="form-control" rows="5">

										</textarea>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="text-center pt-8 border-top">
						<a href="setting/notice.html" class="btn btn-danger btn-lg px-11 font-weight-bold">등록완료</a>
					</div>
				</div>
			</div>
                             <!--end: Card Body-->
             <!--end: Card Body-->
          </div>
          <!--end: Card-->
	</div>
	<!--end::Container-->
</div>
<!--end::Entry-->
