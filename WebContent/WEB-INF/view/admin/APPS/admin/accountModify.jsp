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
               </div>
           </div>
           <!--end::Header-->
           <!--begin::Body-->
           <div class="card-body pt-9">
				<!--begin:: Nav Line -->
				<ul class="nav nav-tabs nav-tabs-line nav-tabs-line-2x nav-tabs-line-danger">
					<li class="nav-item">
						<a class="nav-link font-size-lg px-5" data-bs-toggle="tab" data-bs-target="#tab01">사용자 계정 현황</a>
					</li>
					<li class="nav-item" onclick="newAccount();">
						<a class="nav-link active font-size-lg px-5" >사용자 계정 등록</a>
					</li>
				</ul>
				<!--end:: Nav Line -->
				<div class="tab-content">
					<div class="tab-pane show active fade" role="tabpanel" id="tab02">
						<h4 class="mt-10">사용자 계정 신규등록</h4>
						<div class="form-wrap">
							<div class="governing">법인정보를 입력하는 공간입니다.</div>
							<div class="d-flex">
								<div class="col-6">
									<div class="form-group">
										<label class="control-label col-4">법인선택</label>
										<div class="col-8">
											<input type="text" class="form-control">
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
						</div>
						<div class="form-wrap">
							<div class="governing">계정정보를 입력하는 공간입니다.</div>
							<div class="d-flex">
								<div class="col-6">
									<div class="form-group">
										<label class="control-label col-4">아이디</label>
										<div class="col-8">
											<div class="d-flex">
												<input class="form-control" type="text" value="" placeholder="">
												<button type="button" class="btn btn-outline-secondary w-100px ml-3">중복확인</button>
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="control-label col-4">계약구분</label>
										<div class="col-8">
											<div class="d-flex align-items-center">
												<select class="form-control selectpicker" id="contract">
													<!-- <option value="">선택하세요</option> -->
												</select>
											</div>
											<!-- <div class="d-flex align-items-center">
												<select class="form-control selectpicker">
													<option value="">선택하세요</option>
													<option value="1">신규계약</option>
													<option value="2">재계약</option>
													<option value="3">계약종료</option>
													<option value="4">테스트사용</option>
													<option value="5">무료사용</option>
												</select>
											</div> -->
										</div>
									</div>
									<div class="form-group">
										<label class="control-label col-4">계정그룹</label>
										<div class="col-8">
											<div class="d-flex align-items-center">
												<select class="form-control selectpicker" id="contract">
													<!-- <option value="">선택하세요</option> -->
												</select>
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="control-label col-4">계약일자</label>
										<div class="col-8">
											<input type="text" class="form-control">
										</div>
									</div>
								</div>
								<div class="col-6">
									<div class="form-group">
										<label class="control-label col-4">사용자명</label>
										<div class="col-8">
											<input type="text" class="form-control">
										</div>
									</div>
									<div class="form-group">
										<label class="control-label col-4">사용자연락처</label>
										<div class="col-8">
											<input type="text" class="form-control">
										</div>
									</div>
									<div class="form-group">
										<label class="control-label col-4">사용시작일자</label>
										<div class="col-8">
											<div class="input-daterange input-group">
												<input type="text" class="form-control" name="start" />
												<span class="input-group-text border-left-0">
													<i class="la la-calendar-check-o"></i>
												</span>
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="control-label col-4">사용종료일자</label>
										<div class="col-8">
											<div class="input-daterange input-group">
												<input type="text" class="form-control" name="start" />
												<span class="input-group-text border-left-0">
													<i class="la la-calendar-check-o"></i>
												</span>
											</div>
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
						<div class="form-wrap">
							<div class="governing">IP정보를 입력하는 공간입니다.</div>
							<div class="d-flex">
								<div class="col-4">
									<div class="form-group">
										<label class="control-label col-6">IP등록</label>
										<div class="col-6">
											<div class="d-flex align-items-center">
												<select class="form-control selectpicker" id="contract">
													<!-- <option value="">선택하세요</option> -->
												</select>
											</div>
										</div>
									</div>
								</div>
								<div class="col-8">
									<ul class="ipList">
										<li>
											<label>12/12</label>
											<input type="text" class="form-control first">
											<input type="text" class="form-control second">
											<a href="javascript:;" class="text-success"><i class="fa fa-check-circle"></i></a>
											<button class="btn btn-dark">변경이력보기</button>
											<button class="btn btn-dark">엑셀업로드</button>
										</li>
										<li>
											<label>11/12</label>
											<input type="text" class="form-control first">
											<input type="text" class="form-control second">
											<a href="javascript:;"><i class="fa fa-edit"></i></a>
											<a href="javascript:;" class="text-danger"><i class="fa fa-times-circle"></i></a>
										</li>
										<li>
											<label>10/12</label>
											<input type="text" class="form-control first">
											<input type="text" class="form-control second">
											<a href="javascript:;"><i class="fa fa-edit"></i></a>
											<a href="javascript:;" class="text-danger"><i class="fa fa-times-circle"></i></a>
										</li>
										<li>
											<label>9/12</label>
											<input type="text" class="form-control first">
											<input type="text" class="form-control second">
											<a href="javascript:;"><i class="fa fa-edit"></i></a>
											<a href="javascript:;" class="text-danger"><i class="fa fa-times-circle"></i></a>
										</li>
										<li>
											<label>8/12</label>
											<input type="text" class="form-control first">
											<input type="text" class="form-control second">
											<a href="javascript:;"><i class="fa fa-edit"></i></a>
											<a href="javascript:;" class="text-danger"><i class="fa fa-times-circle"></i></a>
										</li>
										<li>
											<label>7/12</label>
											<input type="text" class="form-control first">
											<input type="text" class="form-control second">
											<a href="javascript:;"><i class="fa fa-edit"></i></a>
											<a href="javascript:;" class="text-danger"><i class="fa fa-times-circle"></i></a>
										</li>
										<li>
											<label>6/12</label>
											<input type="text" class="form-control first">
											<input type="text" class="form-control second">
											<a href="javascript:;" class="text-success"><i class="fa fa-check-circle"></i></a>
											<a href="javascript:;" class="text-danger"><i class="fa fa-times-circle"></i></a>
										</li>
										<li>
											<label>5/12</label>
											<input type="text" class="form-control first">
											<input type="text" class="form-control second">
											<a href="javascript:;"><i class="fa fa-edit"></i></a>
											<a href="javascript:;" class="text-danger"><i class="fa fa-times-circle"></i></a>
										</li>
										<li>
											<label>4/12</label>
											<input type="text" class="form-control first">
											<input type="text" class="form-control second">
											<a href="javascript:;"><i class="fa fa-edit"></i></a>
											<a href="javascript:;" class="text-danger"><i class="fa fa-times-circle"></i></a>
										</li>
										<li>
											<label>3/12</label>
											<input type="text" class="form-control first">
											<input type="text" class="form-control second">
											<a href="javascript:;"><i class="fa fa-edit"></i></a>
											<a href="javascript:;" class="text-danger"><i class="fa fa-times-circle"></i></a>
										</li>
										<li>
											<label>2/12</label>
											<input type="text" class="form-control first">
											<input type="text" class="form-control second">
											<a href="javascript:;"><i class="fa fa-edit"></i></a>
											<a href="javascript:;" class="text-danger"><i class="fa fa-times-circle"></i></a>
										</li>
										<li>
											<label>1/12</label>
											<input type="text" class="form-control first">
											<input type="text" class="form-control second">
											<a href="javascript:;"><i class="fa fa-edit"></i></a>
											<a href="javascript:;" class="text-danger"><i class="fa fa-times-circle"></i></a>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div class="text-center pt-8 border-top">
							<a href="setting/notice.html" class="btn btn-danger btn-lg px-11 font-weight-bold">저장</a>
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
