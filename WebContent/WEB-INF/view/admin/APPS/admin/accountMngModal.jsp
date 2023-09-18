<%@ page language="java" contentType="text/html; charset=UTF-8"	session="true" pageEncoding="utf-8" trimDirectiveWhitespaces="true"%>
		
<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
	<div class="modal-content" style="min-height: 590px;">
		<div class="modal-header py-5">
			<h5 class="modal-title">사용자통합정보</h5>
			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				<i aria-hidden="true" class="ki ki-close"></i>
			</button>
		</div>
		<div class="modal-body ps" data-scroll="true" data-height="700">
	        <div>
	        	<ul class="nav nav-tabs nav-tabs-line nav-bolder">
				    <li class="nav-item">
				        <a class="nav-link active" data-toggle="tab" href="#kt_tab_pane_1">사용자PC등록정보</a>
				    </li>
				    <li class="nav-item">
				        <a class="nav-link" data-toggle="tab" href="#kt_tab_pane_2">사용자접속정보</a>
				    </li>
				</ul>    
				
	            <div class="tab-content mt-5" id="myTabContent">
		            <div class="tab-pane fade show active" id="kt_tab_pane_1" role="tabpanel" aria-labelledby="kt_tab_pane_2">
		            	<div class="datatable datatable-bordered datatable-head-custom" id="kt_datatable_2"></div>
		            </div>
		            <div class="tab-pane fade" id="kt_tab_pane_2" role="tabpanel" aria-labelledby="kt_tab_pane_2">
		            	<div class="datatable datatable-bordered datatable-head-custom" id="kt_datatable_3"></div>
		            </div>
	            </div>
	        </div>
		</div>
	</div>
</div>