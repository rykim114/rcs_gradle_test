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
                            <span class="font-weight-bolder text-dark">공통코드 관리</span>
                        </h3>
                        <div class="card-toolbar">
                    		<div class="d-flex align-items-center">
								<i class="flaticon-buildings text-dark mb-1"></i>
								<i class="ki ki-arrow-next icon-sm mx-2"></i>
								공통코드 관리
							</div>
                        </div>
                    </div>
                    <!--end::Header-->
                    <!--begin::Body-->
                    <div class="card-body pt-9">
                          <div class="row">
                              <div class="col-md-4">
                                  <div class="d-flex justify-content-between align-items-end h-40px">
                                      <h3 class="font-size-h5">공통마스터코드</h3>											
                                      <input type="text" class="form-control input_bottom_line2" placeholder="검색어를 입력하세요" id="kt_datatable_search_query">                                    
                                      <div>
                                          <button onclick="masterModal();" class="btn btn-square btn-outline-danger btn-md" data-toggle="modal" data-target="#kt_auth_modal">등록</button>
                             <!--              <button class="btn btn-square btn-outline-secondary btn-md ml-2" data-toggle="modal" data-target="#kt_auth_modal">수정</button> 
                                          <button class="btn btn-square btn-outline-secondary btn-md ml-2">삭제</button> -->
                                      </div>
                                  </div>
                                  <div class="border mt-4 nav-auth-wrap h-700px overflow-auto">
                                      <div class="datatable datatable-bordered datatable-head-custom" id="comCodeTable"></div>                                        
                                  </div>
                              </div>
                              <div class="col-md-8 pl-md-10" id="masterCodeDiv">
                                  <div class="d-flex justify-content-between align-items-end h-40px">
                                     <h3 class="font-size-h5">공통상세코드</h3> 
                                     <div>
                                          <button onclick="detailModal();" class="btn btn-square btn-outline-danger btn-md" data-toggle="modal" data-target="#kt_auth_modal">등록</button>
                             <!--              <button class="btn btn-square btn-outline-secondary btn-md ml-2" data-toggle="modal" data-target="#kt_auth_modal">수정</button> 
                                          <button class="btn btn-square btn-outline-secondary btn-md ml-2">삭제</button >-->
                                      </div>
                                  </div>
                                  <div class="border mt-4 h-700px overflow-auto">
                                      <div class="datatable datatable-bordered datatable-head-custom" id="comCodeDetailTable"></div>
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
	</div>

<!--begin::Modal-->
<div id="kt_auth_modal" class="modal fade" role="dialog" aria-hidden="true">
<div class="modal-dialog modal-dialog-centered modal-md">
	<div class="modal-content">
		<div class="modal-header py-5">
			<h5 id="insertModal" class="modal-title">공통코드 관리</h5>
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
                                    <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">코드</span></label>
                                </th>
                                <td class="border-0">
                                    <input id="masterCode" class="form-control form-control-solid border border-secondary rounded-sm" maxlength="6" type="text" value="" placeholder="코드를 입력해주세요">
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">코드명</span></label>
                                </th>
                                <td>
                                    <input id="masterCodeName" class="form-control form-control-solid border border-secondary rounded-sm" type="text" value="" placeholder="코드명을 입력해주세요">
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">정렬코드</span></label>
                                </th>
                                <td>
                                    <input id="masterCodeSort" class="form-control form-control-solid border border-secondary rounded-sm" type="text" value="" placeholder="">
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">사용여부</span></label>
                                </th>
                                <td class="datatable-cell-center datatable-cell datatable-cell-check" style="vertical-align:inherit;">
	                                <span style="width: 20px;">
		                                <label class="checkbox checkbox-single seq">
		                                	<input type="checkbox" id="useYN" value=""><span></span>
		                                </label>
	                                </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!--end: Write Form-->
			</div>
             <div class="modal-footer justify-content-center">
                   <button type="reset" onclick="insertCode();" class="btn btn-danger btn-lg mr-2 font-weight-bold px-11">확인</button>
                   <button type="reset" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold" data-dismiss="modal" aria-label="Close">취소</button>
             </div>
		</div>
	</div>
</div>
<!--end::Modal-->
