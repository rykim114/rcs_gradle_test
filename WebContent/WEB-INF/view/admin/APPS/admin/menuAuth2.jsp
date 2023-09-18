<%@ page language="java" contentType="text/html; charset=UTF-8"	session="true" pageEncoding="utf-8" trimDirectiveWhitespaces="true"%>
<!-- <script src="/resources/common/custom/plugins/global/plugins.bundle.js"></script> -->
<!--begin::Entry-->
<div class="d-flex flex-column-fluid">
	<!--begin::Container-->
	<div class="container-fluid">
	    <!--begin::Card-->
	    <div class="card card-custom card-stretch rounded-0">
	        <!--begin::Header-->
	        <div class="card-header align-items-center border-bottom">
	            <h3 class="card-title align-items-center">
	                <span class="font-weight-bolder text-dark">메뉴관리</span>
	            </h3>
	            <div class="card-toolbar">
	            </div>
	        </div> 
	        <!--end::Header-->
	        <!--begin::Body-->
	        <div class="card-body pt-9">
	            <div class="row">
	                <div class="col-md-3">
	                    <div class="d-flex justify-content-between align-items-end h-40px">
	                    	<h3 class="font-size-h5">메뉴리스트</h3>
	                    	<div>
                            	<a href="admin/accountWrite.html" class="btn btn-square btn-outline-danger btn-md">신규등록</a>
                             	<a href="admin/accountMod.html" class="btn btn-square btn-outline-secondary btn-md ml-3">수정</a>
                             	<button type="button" class="btn btn-square btn-outline-secondary btn-md ml-3">삭제</button>
	                    	</div>
	                    </div>
	                    <div class="border mt-4 nav-auth-wrap">
	                        <div class="bg-light-secondary px-6 py-4 font-size-h6 font-weight-bold">메뉴</div>
	                        <ul id="ulmenulist" class="nav flex-column nav-light-danger nav-auth nav-pills">
	                        </ul>
	                    </div>   
	                </div>
	                <div class="col-md-9">
	                    <div class="card card-custom rounded-0 ml-md-15 mt-md-16">
	                        <!--begin::Header-->
	                        <div class="card-header align-items-center border-bottom">
	                            <h3 class="card-title align-items-center">
	                                <span id="imenunamequery" class="font-weight-bolder text-dark-75 font-size-h5"></span>
	                            </h3>
	                            <div class="card-toolbar">
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
	                                                <input id="imenuname" class="form-control border border-secondary rounded-sm w-md-50" disabled type="text" value="" placeholder="메뉴명을 입력해주세요">
	                                            </td>
	                                        </tr>                                   	
	                                        <tr>
	                                            <th class="border-0 d-none d-md-block">
	                                                <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">· 메뉴코드</span></label>
	                                            </th>
	                                            <td class="border-0">
	                                                <input id="imenucode" class="form-control border border-secondary rounded-sm w-md-50" disabled type="text" value="" placeholder="메뉴코드를 입력해주세요">
	                                            </td>
	                                        </tr>
	                                        <tr>
	                                            <th class="border-0 d-none d-md-block">
	                                                <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">· 레벨</span></label>
	                                            </th>
	                                            <td class="border-0">
	                                                <div class="d-flex align-items-center w-md-50">
	                                                    <select id="ilvl" disabled class="form-control selectpicker">
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
	                                                <input id="iupmenucode" disabled class="form-control border border-secondary rounded-sm w-md-50" type="text" value="">
	                                            </td>
	                                        </tr>
	                                        <tr>
	                                            <th class="border-0 d-none d-md-block">
	                                                <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">· 아이콘</span></label>
	                                            </th>
	                                            <td class="border-0">
	                                                <input id="iicon" disabled class="form-control border border-secondary rounded-sm w-md-50" type="text" value="" placeholder="아이콘을 입력해주세요">
	                                            </td>
	                                        </tr>
	                                        <tr>
	                                            <th class="border-0 d-none d-md-block">
	                                                <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">· 메뉴 URL</span></label>
	                                            </th>
	                                            <td class="border-0">
	                                                <input id="iurl" disabled class="form-control border border-secondary rounded-sm w-md-50" type="text" value="" placeholder="메뉴 URL을 입력해주세요">
	                                            </td>
	                                        </tr>
	                                        <tr>
	                                            <th class="border-0 d-none d-md-block">
	                                                <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">· 정렬순서</span></label>
	                                            </th>
	                                            <td class="border-0">
	                                                <input id="isortcode" disabled class="form-control border border-secondary rounded-sm w-md-50" type="text" value="" placeholder="정렬순서를 입력해주세요">
	                                            </td>
	                                        </tr>
	                                        <tr>
	                                            <th class="border-0 d-none d-md-block">
	                                                <label class=""><span class="d-block font-size-lg font-weight-bold mt-3">· 메뉴바오픈여부</span></label>
	                                            </th>
	                                            <td class="border-0">
	                                                <div class="d-flex align-items-center w-md-50">
	                                                    <select id="imenubaryn" disabled class="form-control selectpicker">
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
	                                                    <select id="imodalyn" disabled class="form-control selectpicker">
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
	                                                    <select id="iuseyn" disabled class="form-control selectpicker">
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
