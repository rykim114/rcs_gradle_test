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
                    <span class="font-weight-bolder text-dark">메뉴등록</span>
                </h3>
				<div class="card-toolbar">
					<div class="d-flex align-items-center">
						<i class="flaticon-buildings text-dark mb-1"></i>
						<i class="ki ki-arrow-next icon-sm mx-2"></i>
						<a href="javascript:;">메뉴관리</a>
					</div>
				</div>
            </div>
            <!--end::Header-->
            <!--begin::Body-->
            <div class="card-body pt-9">
                <!--begin: Write Form-->
                <div class="table-responsive-sm">
                    <table class="table">
                        <colgroup>
                            <col style="width:20%" />
                            <col style="width:80%" />
                        </colgroup>
                        <tbody>	                                     	
                            <tr>
                                <th class="border-0 d-none d-md-block">
                                    <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">· 메뉴명</span></label>
                                </th>
                                <td class="border-0">
                                    <input id="imenuname" class="form-control border border-secondary rounded-sm w-md-50" type="text" value="" placeholder="메뉴명을 입력해주세요">
                                </td>
                            </tr>                                   	
                            <tr>
                                <th class="border-0 d-none d-md-block">
                                    <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">· 메뉴코드</span></label>
                                </th>
                                <td class="border-0">
                                    <input id="imenucode" class="form-control border border-secondary rounded-sm w-md-50" type="text" value="" placeholder="메뉴코드를 입력해주세요">
                                </td>
                            </tr>
                            <tr>
                                <th class="border-0 d-none d-md-block">
                                    <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">· 레벨</span></label>
                                </th>
                                <td class="border-0">
                                    <div class="d-flex align-items-center w-md-50">
                                        <select id="ilvl" class="form-control selectpicker">
                                            <option value="1">1 레벨</option>
                                            <option value="2">2 레벨</option>
                                            <option value="3">3 레벨</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th class="border-0 d-none d-md-block">
                                    <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">· 상위메뉴코드</span></label>
                                </th>
                                <td class="border-0">
                                    <input id="iupmenucode" class="form-control border border-secondary rounded-sm w-md-50" type="text" value="" placeholder="상위메뉴코드를 입력해주세요">
                                </td>
                            </tr>
                            <tr>
                                <th class="border-0 d-none d-md-block">
                                    <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">· 아이콘</span></label>
                                </th>
                                <td class="border-0">
                                    <input id="iicon" class="form-control border border-secondary rounded-sm w-md-50" type="text" value="" placeholder="아이콘을 입력해주세요">
                                </td>
                            </tr>
                            <tr>
                                <th class="border-0 d-none d-md-block">
                                    <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">· 메뉴 URL</span></label>
                                </th>
                                <td class="border-0">
                                    <input id="iurl" class="form-control border border-secondary rounded-sm w-md-50" type="text" value="" placeholder="메뉴 URL을 입력해주세요">
                                </td>
                            </tr>
                            <tr>
                                <th class="border-0 d-none d-md-block">
                                    <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">· 정렬순서</span></label>
                                </th>
                                <td class="border-0">
                                    <input id="isortcode" class="form-control border border-secondary rounded-sm w-md-50" type="text" value="" placeholder="정렬순서를 입력해주세요">
                                </td>
                            </tr>
                            <tr>
                                <th class="border-0 d-none d-md-block">
                                    <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">· 메뉴바오픈여부</span></label>
                                </th>
                                <td class="border-0">
                                    <div class="d-flex align-items-center w-md-50">
                                        <select id="imenubaryn" class="form-control selectpicker">
                                            <option value="Y">사용</option>
                                            <option value="N">사용안함</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th class="border-0 d-none d-md-block">
                                    <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">· 모달창사용여부</span></label>
                                </th>
                                <td class="border-0">
                                    <div class="d-flex align-items-center w-md-50">
                                        <select id="imodalyn" class="form-control selectpicker">
                                            <option value="Y">사용</option>
                                            <option value="N">사용안함</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th class="border-0 d-none d-md-block">
                                    <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">· 사용유무</span></label>
                                </th>
                                <td class="border-0">
                                    <div class="d-flex align-items-center w-md-50">
                                        <select id="iuseyn" class="form-control selectpicker">
                                            <option value="Y">사용</option>
                                            <option value="N">사용안함</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        </tbody> 
                    </table>
                </div>
                <div class="text-center border-top mt-8 pt-8">
                    <button id="submitMenuAuth" type="submit" class="btn btn-danger btn-lg mr-2 font-weight-bold px-11">확인</button>
                    <button id="resetMenuAuth" type="reset" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold">취소</button>
                </div>
                <!--end: Write Form-->
            </div>
		</div>
		<!--end: Card-->
	</div>
	<!--end::Container-->
</div>
<!--end::Entry-->