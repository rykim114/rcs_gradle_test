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
                           <span class="font-weight-bolder text-dark">PC 등록정보</span>
                       </h3>
		            	<div class="card-toolbar">
							<div class="d-flex align-items-center">
								<i class="flaticon-buildings text-dark mb-1"></i>
								<i class="ki ki-arrow-next icon-sm mx-2"></i>
								PC 등록정보
							</div>
                         </div>
                     </div>
                     <!--end::Header-->
                     <!--begin::Body-->
                     <div class="card-body pt-9">
                        <div class="bg-light px-6 py-6 font-size-lg line-height-xl" id="pcInfoDetail">
		                   	PC 등록대수 :  <span id="showName"></span><br>
							구입날짜 : <span id="showDate"></span><br>
							계약기간 : <span id="showContDuration"></span><br>
							사용기간 : <span id="showUsageDuraion"></span><br>
							계약문의 : <span id="showTel"></span>
			            </div>
					<div class="pt-8">
						<div>
							<h4>IP 등록 현황</h4>
							<div class="pt-4 pb-4">
								IP를 변경하려면, 담당자에게 연락하여 기존 IP를 삭제하시고 새로 등록할 수 있습니다.<br>
								IP 관련 문의 : <span id="showStatusTel"></span>
							</div>
							<div class="pt-4 pb-4">
								사용 중인 IP : <span id="currentIp"></span> 개  / 잔여 사용 가능 IP : <span id="availableIp"></span> 개
							</div>
							<div class="datatable datatable-bordered datatable-head-custom" id="kt_datatable_status" data-order = ''></div>
						</div>
						<div class="mt-9">
							<h4>접속정보</h4>
							<div class="mb-3">
								<div class="row align-items-end">
									<div class="col-lg-9 col-xl-9">
									</div>
									<div class="col-lg-3 col-xl-3 mt-5 mt-lg-0 text-right">
										<div class="input-icon">
											<input type="text" class="form-control input_bottom_line" placeholder="검색어를 입력하세요" id="kt_datatable_search_query"/>
											<span>
										<i class="flaticon2-search-1 text-muted"></i>
									</span>
										</div>
									</div>
								</div>
							</div>
							<div>
								총 <span id="total"></span> 건
							</div>
							<div class="datatable datatable-bordered datatable-head-custom" id="kt_datatable_info" data-order = ''></div>
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
