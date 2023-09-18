<%@ page language="java" contentType="text/html; charset=UTF-8"	session="true" pageEncoding="utf-8" trimDirectiveWhitespaces="true"%>
<script src="/resources/common/custom/js/pages/admin/dropzonejs.js"></script>
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
				<!--begin: Write Form-->
				<form id="noticeForm" action="" method="post">
					<table class="table">
						<colgroup>
							<col style="width:20%" />
							<col style="width:80%" />
						</colgroup>
						<tbody>
							<tr>
								<th class="border-0">
									<label class=""><span class="d-block font-size-lg font-weight-bold mt-3">분류</span></label>
								</th>
								<td class="border-0">
									<div class="d-flex align-items-center">
									   <div class="w-md-50">
											<select id="status" class="form-control selectpicker">
												<option value="">전체</option>
												<option value="10">공지</option>
												<option value="20">안내</option>
												<option value="30">업데이트</option>
												<option value="40">이벤트</option>
											</select>
										</div> 
										<div class="checkbox-inline ml-11">
											<label class="checkbox">
												<input type="checkbox" id="2Top"  name="Checkboxes1"/>
												<span></span>
												상단노출
											</label>
											<label class="checkbox popup_check_wrap">
                                                <input type="checkbox" id="popupYN" name="Checkboxes2"/>
                                                <span></span>
                                                팝업노출
                                            </label>
										</div>
									</div>
								</td>
							</tr>
							 <tr>
								<th class="border-0">
									<label class=""><span class="d-block font-size-lg font-weight-bold mt-3">공지구분</span></label>
								</th>
								<td class="border-0">
									<div class="d-flex align-items-center w-md-50">
										<select id="noticeYN" class="form-control selectpicker">
											<option value="">전체</option>
											<option value="N">작성중</option>
											<option value="Y">작성완료</option>
										</select>
									</div>
								</td>
							</tr>
							<tr>
								<th>
									<label class=""><span class="d-block font-size-lg font-weight-bold mt-3">제목</span></label>
								</th>
								<td>
									<input id="title" maxlength="50" class="form-control form-control-solid border border-secondary rounded-sm" type="text" value="" placeholder="제목을 입력해주세요">
								</td>
							</tr>
							<tr>
								<th>
									<label class=""><span class="d-block font-size-lg font-weight-bold mt-3">내용</span></label>
								</th>
								<td>
									<textarea id="content" class="form-control form-control-solid border border-secondary rounded-sm" value="" rows="3" placeholder="내용을 입력해주세요"></textarea>
								</td>
							</tr>
							<tr>
								<th>
									<label class=""><span class="d-block font-size-lg font-weight-bold mt-3">파일첨부</span></label>
								</th>
								<td>
									<div class="dropzone dropzone-multi" id="kt_dropzone_4">
										<input type="hidden" value="" id="masterSeq"/>
										<input type="hidden" value="0" id="detailSeq"/>

										<div class="dropzone-panel mb-lg-0 mb-2">
											<a class="dropzone-select btn btn-light-primary font-weight-bold btn-sm" id="fileUpload" >파일첨부</a>
											<a class="dropzone-upload btn btn-light-primary font-weight-bold btn-sm">전체업로드</a>
											<a value="Y" class="dropzone-remove-all btn btn-light-primary font-weight-bold btn-sm">전체삭제</a>
										</div>
										<div class="dropzone-items">
											<div class="dropzone-item" style="display:none">
												<div class="dropzone-file">
													<div class="dropzone-filename" title="some_image_file_name.jpg">
														<span data-dz-name="">some_image_file_name.jpg</span>
														<strong>(
														<span data-dz-size="">340kb</span>)</strong>
													</div>
													<div class="dropzone-error" data-dz-errormessage=""></div>
												</div>
												<div class="dropzone-progress">
													<div class="progress">
														<div class="progress-bar bg-primary" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-dz-uploadprogress=""></div>
													</div>
												</div>
												<div class="dropzone-toolbar">
													<span class="dropzone-start">
														<i class="flaticon2-arrow"></i>
													</span>
													<span class="dropzone-cancel" data-dz-remove="" style="display: none;">
														<i class="flaticon2-cross"></i>
													</span>
													<span class="dropzone-delete" data-dz-remove="">
														<i class="flaticon2-cross"></i>
													</span>
												</div>
											</div>
										</div>
									</div>
									<span class="form-text text-muted">파일 한 개당 최대 업로드 용량은 10MB 입니다. 한 번에 최대 5개의 파일을 업로드 할 수 있습니다.</span>
								</td>
							</tr>
							<tr>
                                <th>
                                    <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">팝업 내용</span></label>
                                </th>
                                <td>
                                    <textarea id="popupContent" class="form-control form-control-solid border border-secondary rounded-sm" value="" rows="3" maxlength="100" placeholder="공지 팝업에 노출할 간략한 안내 내용을 100자 이내로 입력해주세요"></textarea>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">팝업 게시 기간</span></label>
                                </th>
                                <td>
                                    <div id="popupDate" class="d-flex">
                                        <div class="input-daterange input-group w-150px mr-5" data-search-time>
                                            <input type="text" id="startYMD" class="form-control dateStart" name="startYMD" placeholder="YYYY-MM-DD"/>
                                            <span class="input-group-text border-left-0 cursor-pointer" data-btn-time="startYMD">
                                                <i class="la la-calendar-check-o"></i>
                                            </span>
                                        </div>
                                        <div class="input-daterange input-group w-70px mr-5" data-time>
                                            <input type="text" id="startHHMM" class="form-control" name="startHHMM" placeholder="HH:MM"/>
                                        </div>
                                        <div class="px-2 py-3">~</div>
                                        <div class="input-daterange input-group w-150px ml-5 mr-5" data-search-time>
                                            <input type="text" id="endYMD" class="form-control dateEnd" name="endYMD" placeholder="YYYY-MM-DD" />
                                            <span class="input-group-text border-left-0 cursor-pointer" data-btn-time="endYMD">
                                                <i class="la la-calendar-check-o"></i>
                                            </span>
                                        </div>
                                        <div class="input-daterange input-group w-70px" data-time>
                                            <input type="text" id="endHHMM" class="form-control" name="endHHMM" placeholder="HH:MM"/>
                                        </div>
                                    </div>
                                </td>
                            </tr>

						</tbody>
					</table>

				<div class="text-center mt-16">
					<button type="button" id="submitNotice" class="btn btn-danger btn-lg mr-2 font-weight-bold px-11">확인</button>
					<button type="reset" onclick="noticeList();" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold">취소</button>
				</div>
			  </form>
				<!--end: Write Form-->
			</div>
			<!--end: Card Body-->
		</div>
		<!--end: Card-->
	</div>
	<!--end::Container-->
</div>
<!--end::Entry-->