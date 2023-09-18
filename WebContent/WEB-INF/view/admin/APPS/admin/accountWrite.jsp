<%@ page language="java" contentType="text/html; charset=UTF-8"	session="true" pageEncoding="utf-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!--begin::Entry-->
<div class="d-flex flex-column-fluid account">
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
						<a class="nav-link font-size-lg px-5" data-bs-toggle="tab" data-bs-target="#tab01" onclick="listAccount();">사용자 계정 현황</a>
					</li>
					<li class="nav-item" onclick="newAccount();">
						<a class="nav-link active font-size-lg px-5" >사용자 계정 등록</a>
					</li>
				</ul>
				<!--end:: Nav Line -->
				<div class="tab-content">
					<div class="tab-pane show active fade addUser" role="tabpanel" id="tab02">
						<h4 class="mt-10">사용자 계정 신규등록</h4>
						<div class="form-wrap">
							<div class="governing">법인정보를 입력하는 공간입니다.</div>
							<div class="d-flex">
								<div class="col-12">
									<div class="form-group">
										<label class="control-label col-2">법인선택</label>
										<!-- <div class="col-4">
											<input type="text" class="form-control">
										</div> -->
										<div class="input-icon">
											<input type="text" class="form-control w-300px" name="addrSearchText" id="addrSearchText"/>
											<input type="hidden" id="corpCode" />
											<span>
												<i class="flaticon2-search-1 text-muted"></i>
											</span>
										</div>
										
										
									</div>
									<div class="form-group">
										<label class="control-label col-2">선택한 법인</label>
										<div class="col-10 d-flex depth-second" style="padding-left: 0px;">
											<div class="form-group col-4" style="padding-left: 0px;">
												<label class="control-label">법인명</label>
												<div class="">
													<input type="text" class="form-control" disabled="disabled" id="corpName">
												</div>
											</div>
											<div class="form-group col-4">
												<label class="control-label">법인구분 1</label>
												<div class="">
													<input type="text" class="form-control" disabled="disabled" id="corpDetail1">
													<input type="hidden" id="corpDetail1code"/>
												</div>
											</div>
											<div class="form-group col-4">
												<label class="control-label">법인구분 2</label>
												<div class="">
													<input type="text" class="form-control" disabled="disabled" id="corpDetail2">
													<input type="hidden" id="corpDetail2code"/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="form-wrap">
							<div class="governing">계정정보를 입력하는 공간입니다.</div>
							<div class="d-flex">
								<div class="col-12">
									<div class="form-group">
										<label class="control-label col-2">아이디</label>
										<div class="col-4">
											<div class="d-flex">
												<input class="form-control" type="text" value="" placeholder="" id="userId"/>
												<button type="button" class="btn btn-outline-secondary w-100px ml-3" onclick="checkId();">중복확인</button>
												<button type="button" class="btn btn-outline-secondary w-120px ml-3" onclick="initPWD();" style="display:none;" id="initPwd">비밀번호 초기화</button>
											</div>
										</div>
										<div style="padding-top: 10px;">비밀번호는 12345678* 자동 생성됩니다</div>
									</div>
									<div class="form-group">
										<label class="control-label col-2">사용자정보</label>
										<div class="col-10 d-flex depth-second" style="padding-left: 0px;">
											<div class="form-group col-4">
												<label class="control-label">사용자 명</label>
												<div class="">
													<input type="text" class="form-control" id="userName" placeholder="예)홍길동">
												</div>
											</div>
											<div class="form-group col-4">
												<label class="control-label">사용자 연락처</label>
												<div class="">
													<input type="text" class="form-control" id="userNumber" placeholder="예)01012345678" onkeyup="checkInt();" maxlength="11" >
												</div>
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="control-label col-2">계약구분</label>
										<div class="col-4">
											<div class="d-flex align-items-center">
												<select class="form-control" id="contract1" style="display:block;">
												</select>
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="control-label col-2">계정그룹</label>
										<div class="col-4">
											<div class="d-flex align-items-center">
												<select class="form-control" id="contract2" style="display:block;">
												</select>
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="control-label col-2">계약일자</label>
										<div class="col-4">
											<div class="input-daterange input-group">
												<input type="text" class="form-control" name="contractStartDay" id="kt_datepicker_2_1"/>
												<span class="input-group-text border-left-0">
													<i class="la la-calendar-check-o"></i>
												</span>
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="control-label col-2">사용기간</label>
										<div class="col-10 d-flex depth-second" style="padding-left: 0px;">
											<div class="form-group col-4">
												<label class="control-label">사용시작일자</label>
												<div class="">
													<div class="input-daterange input-group">
														<input type="text" class="form-control" name="start" id="kt_datepicker_1"/>
														<span class="input-group-text border-left-0">
															<i class="la la-calendar-check-o"></i>
														</span>
													</div>
												</div>
											</div>
											<div class="form-group col-4">
												<label class="control-label">사용종료일자</label>
												<div class="">
													<div class="input-daterange input-group">
														<input type="text" class="form-control" name="end" id="kt_datepicker_2"/>
														<span class="input-group-text border-left-0">
															<i class="la la-calendar-check-o"></i>
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="control-label col-2">특이사항(메모)</label>
										<div class="col-10">
											<textarea class="form-control" rows="5" id="remarks"></textarea>
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
												<select class="form-control" id="ipMax" onchange="ipInsertForm();">
													<option value="">선택</option>
													<c:forEach begin="1" end="20" varStatus="status">
														<option value="${status.count}">${status.count}</option>
													</c:forEach>
												</select>
											</div>
										</div>
										<!-- <button type="button" class="btn btn-outline-secondary w-100px ml-3" onclick="checkId();">중복확인</button> -->
									</div>
									<div style="text-align: -webkit-right;">
										<label class="btn btn-outline-secondary w-100px ml-3" for="xsfile" >엑셀업로드</label>
									</div>
								</div>
								<div class="col-8">
									<ul class="ipList">
									</ul>
									<input type="file" name="xsfile" id="xsfile" style="display:none;" onchange="exFileUpload();"/>
								</div>
							</div>
						</div>
						<div class="text-center pt-8 border-top">
							<a href="javascript:;" id="submit" class="btn btn-danger btn-lg px-11 font-weight-bold">저장</a>
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
<div id="kt_cor_modal" class="modal fade" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-md">
		<div class="modal-content">
			<div class="modal-header py-5">
				<h5 class="modal-title">법인등록</h5>
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
                                 <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">법인구분</span></label>
                             </th>
                             <td class="border-0">
                                 <div class="d-flex align-items-center mb-2">
                                     <select class="form-control selectpicker" id="corpModal_1">
                                     </select>
                                 </div>
                                 <div class="d-flex align-items-center mb-2">
                                     <select class="form-control selectpicker" id="corpModal_2">
                                     </select>
                                 </div>
                                 <div class="d-flex align-items-center mb-2">
                                     <select class="form-control selectpicker" id="corpModal_3">
                                     </select>
                                 </div>
                             </td>
                         </tr>
                         <tr>
                             <th>
                                 <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">법인명</span></label>
                             </th>
                             <td>
                                 <input class="form-control form-control-solid border border-secondary rounded-sm" type="text" value="" required="required" placeholder="법인명을 입력해주세요.">
                             </td>
                         </tr>
                         <tr>
                             <th>
                                 <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">사업자등록번호</span></label>
                             </th>
                             <td>
                                 <input id="corpRNumber" class="form-control form-control-solid border border-secondary rounded-sm" type="text" value="" maxlength="12" placeholder="사업자등록번호을 입력해주세요.">
                             </td>
                         </tr>
                         <tr>
                             <th>
                                 <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">담당자</span></label>
                             </th>
                             <td>
                                 <input id="userNameModal" class="form-control form-control-solid border border-secondary rounded-sm" type="text" value="" placeholder="사용자명을 입력해주세요.">
                             </td>
                         </tr>
                         <tr>
                             <th>
                                 <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">담당자연락처</span></label>
                             </th>
                             <td>
                                 <input id="telNumberModal" class="form-control form-control-solid border border-secondary rounded-sm" type="text" value="" maxlength="20" placeholder="전화번호를 입력해주세요.">
                             </td>
                         </tr>
                     </tbody>
                 </table>
                 <!--end: Write Form-->
			</div>
            <div class="modal-footer justify-content-center">
                    <button onclick="insertCorp();" type="reset" class="btn btn-danger btn-lg mr-2 font-weight-bold px-11">확인</button>
                    <button onclick="closeModal();" type="reset" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold" data-dismiss="modal" aria-label="Close">취소</button>
             </div>
		</div>
	</div>
</div>
<!--end::Modal-->

<!-- <script src="/resources/common/custom/js/pages/setting/accountMng.js"></script> -->
<script src="/resources/common/custom/js/pages/admin/account-datepicker.js"></script>
