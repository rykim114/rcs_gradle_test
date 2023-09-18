<%@ page language="java" contentType="text/html; charset=utf-8"	session="true" pageEncoding="utf-8" trimDirectiveWhitespaces="true"%>


<div class="tmpl_list z-kt-portlet kt-portlet" id="changePassword_portlet" name="" data-zc="z-kt-portlet">
    <!-- begin: top box -->
    <div class="kt-portlet__body kt-portlet__body--fit">
        <div class="kt-grid kt-wizard-v2 kt-wizard-v2--white" data-ktwizard-state="first">
            <div class="z-kt-wizard-v2__wrapper kt-grid__item kt-grid__item--fluid kt-wizard-v2__wrapper"
            id="" name="" data-zc="z-kt-wizard-v2__wrapper">
                <!-- begin: content -->
                <div class="kt-wizard-v2__content" data-ktwizard-type="step-content" data-ktwizard-state="current">
                    
                    <!--begin::Form-->
                    <div class="kt-portlet__body">
                    	<input type="hidden" class="z-form-control form-control z-update" name="company_code" value="{{company_code}}">
                    	
                        <div class="z-kt-form__section kt-form__section kt-form__section--first "
                        id="" name="" data-zc="z-kt-form__section">
                            <div class="kt-wizard-v2__form">
                                <div class="z-form-group form-group" id="" name="" data-zc="z-form-group">
                                    <div class="z-row row" id="" name="" data-zc="z-row">
                                        <div class="z-col col-lg-12" id="" name="" data-zc="z-col" data-colspan="col-lg-12">
	                                        <label for="" class="z-label" id="" name="label_modal_1_user_password" data-zc="z-label">현재 비밀번호</label>
	                                        <input type="password" class="z-form-control form-control z-update" id="oldPassword" name="oldPassword" data-zc="z-form-control">
	                                    </div>
                                    </div>
                                    <div class="z-row row" id="" name="" data-zc="z-row">
                                        <div class="z-col col-lg-12" id="" name="" data-zc="z-col" data-colspan="col-lg-12">
	                                        <label for="" class="z-label" id="" name="label_modal_1_user_password" data-zc="z-label">신규 비밀번호</label>
	                                        <input type="password" class="z-form-control form-control z-update" id="newPassword" name="newPassword" data-zc="z-form-control">
	                                    </div>
									</div>
									<div class="z-row row" id="" name="" data-zc="z-row">
                                        <div class="z-col col-lg-12" id="" name="" data-zc="z-col" data-colspan="col-lg-12">
	                                        <label for="" class="z-label" id="" name="label_modal_1_user_password" data-zc="z-label">비밀번호 확인</label>
	                                        <input type="password" class="z-form-control form-control z-update" id="newPassword2" name="newPassword2" data-zc="z-form-control">
	                                    </div>
                                    </div>
                                    
                                    <div class="kt-separator kt-separator--solid"></div>
                                    
									<div class="z-row row" id="" name="" data-zc="z-row">
                                        <div class="z-col col-lg-12" id="" name="" data-zc="z-col" data-colspan="col-lg-12">
	                                        <button type="button" class="btn btn-outline-success" name="btn_copy" onclick="javascript:zo.changePassword()">변경</button>
	                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- end: content -->
            </div>
        </div>
    </div>
    <!-- end: top box -->
</div>
