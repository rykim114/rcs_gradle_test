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
                                       <span class="font-weight-bolder text-dark">비밀번호 수정</span>
                                   </h3>
									<div class="card-toolbar">
										<div class="d-flex align-items-center">
											<i class="flaticon-buildings text-dark mb-1"></i>
											<i class="ki ki-arrow-next icon-sm mx-2"></i>
											비밀번호 수정
										</div>
									</div>
                               </div>
                               <!--end::Header-->
                               <!--begin::Body-->
                     <div class="card-body pt-20">
						<div class="col-md-6 offset-md-3">
							<div class="font-size-lg mb-9 pb-8">
								<div class="bg-light px-6 py-6 font-size-lg line-height-xl mb-6">
									- 최초 또는 비밀번호 분실 신고 시 받은 임시 비밀번호는 반드시 변경해 주세요.<br>
									- 비밀번호는 정기적으로 변경해 주셔야 합니다. 1개월 단위로 변경하시는 것을 추천드립니다.<br>
									- 8~16자의 영문 대소문자, 숫자, 특수문자만 가능합니다.<br>   
									  (사용 가능한 특수문자 : ! " # $ % & ' ( ) * + , - . / : ; ? @ [ ＼ ] ^ _ ` { | } ~ \)
								</div>
							</div>
							<!--begin: Write Form-->
							<div class="form-group row">
<%-- 								<label class="col-md-3 col-form-label"><span class="font-size-lg">사용자 아이디</span></label> --%>
								<input class="form-control rounded-sm text-center" type="text" disabled="disabled" id="userId">
							</div>
							<div class="form-group row">
<%--								<label class="col-md-3 col-form-label"><span class="d-block font-size-lg">기존 비밀번호</span></label> --%>
								<input class="form-control rounded-sm text-center" maxlength="20" id="oldPW" autocomplete="new-password" type="password" value="" placeholder="현재 비밀번호를 입력해 주세요.">
								<div class="offset-md-4 invalid-feedback">비밀번호가 틀립니다. 다시 한 번 정확히 입력해 주세요.</div>
							</div>
							<div class="form-group row">
<%--								<label class="col-md-3 col-form-label"><span class="d-block font-size-lg">새 비밀번호</span></label> --%>
								<input class="form-control rounded-sm text-center" id="newPW"  maxlength="20" autocomplete="new-password" type="password" value="" placeholder="새 비밀번호를 입력해 주세요.">
								<div class="offset-md-3 invalid-feedback">비밀번호는 영문, 숫자, 특수문자 포함 8자리 이상 20자 이내여야 합니다.</div>
							</div>
							<div class="form-group row">
<%--								<label class="col-md-3 col-form-label"><span class="d-block font-size-lg">새 비밀번호 확인</span></label> --%>
								<input class="form-control rounded-sm text-center" id="confirmNewPW" maxlength="20" autocomplete="new-password" type="password" value="" placeholder="새 비밀번호를 확인해 주세요.">
								<div class="offset-md-4 invalid-feedback"">입력하신 비밀번호와 일치하지 않습니다.</div>
							</div>
							<!--end: Write Form-->
							<div class="text-center mt-9 pt-8">
								<button type="button" class="btn btn-danger btn-lg font-weight-bold px-11 mr-2" onclick="submitPW();">확인</button>
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
