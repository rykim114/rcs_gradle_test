<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!--begin::Detail Panel-->
<div id="mapBlockPanel" class="map-pannel-block position-fixed w-600px pb-0 d-none flex-column border map-pannel bg-white">
	<div class="position-absolute map-pannel-close" id="mapBlockClose">
		<button class="btn btn-square btn-outline-secondary pl-5 pr-4 py-5 bg-white"><i class="flaticon2-cross text-dark"></i></button>
	</div>
	<!--begin::Content-->
	<div class="flex-column-fluid scroll ps bg-light-secondary" data-scroll="true" data-height="600" style="height:600px">
		<!--begin::Header-->
		<div class="d-flex align-items-center justify-content-between bg-white pt-6 pb-3 px-6 flex-column-auto">
			<div class="">
				<h3 class="font-size-h3 text-dark mb-3">상권분석정보</h3>
			</div>
			<div class="mt-n1">
				<!-- 즐겨찾기 전 버튼 -->
				<button class="btn btn-outline-secondary pl-2 pr-1 py-2" data-btn-favorite><i class="flaticon-star"></i></button>
				<!-- 즐겨찾기 후 버튼 -->
				<!-- <button class="btn btn-danger pl-2 pr-1 py-2" data-toggle="modal" data-target="#favModal"><i class="flaticon-star text-white"></i></button> -->
			</div>
		</div>
<%--		
		<div class="d-flex justify-content-between align-items-center bg-white px-6 pb-8">
			<div class="">
				<span class="label label-lg label-outline-secondary rounded-0 label-inline"><span id="cntDtlBlockArr">0</span>개 블럭 지정</span>
			</div>
			<div class="text-muted">
<%--				등록일: 2020.10.15<br>수정일: 2020.10.15
			</div>
		</div>
--%>		
		<ul class="nav nav-tabs nav-tabs-line nav-justified nav-tabs-line-2x nav-tabs-line-danger border-top bg-white sticky">
			<li class="nav-item border-right">
				<a class="nav-link active justify-content-center m-0 font-size-h6" data-toggle="tab" data-target="#kt_tab_pane_1">가격정보</a>
			</li>
			<li class="nav-item border-right">
				<a class="nav-link justify-content-center m-0 font-size-h6" data-toggle="tab" data-target="#kt_tab_pane_2">상권정보</a>
			</li>
			<!-- <li class="nav-item">
				<a class="nav-link justify-content-center m-0 font-size-h6" data-toggle="tab" href="#kt_tab_pane_3">시세정보</a>
			</li> -->
		</ul>
		<!--end::Header-->
		<div class="tab-content" id="myTabContent">
			<div class="tab-pane fade show active" id="kt_tab_pane_1" role="tabpanel" aria-labelledby="kt_tab_pane_1">
				<div class="position-relative px-6 py-6 bg-white mb-4">
					<div class="d-flex justify-content-between align-items-center mb-2">
					<div class="d-flex align-items-center" id="form_chart_1_1">
						<h4 class="font-size-h5 m-0">평균분양가</h4>
						<div class="w-80px mx-2">
							<select class="form-control selectpicker" name="select_면적단위">
								<option value="미터">㎡ </option>
								<option value="평">3.3㎡</option>
							</select>
						</div>
						<div class="w-140px mx-2">
							<select class="form-control selectpicker" name="select_면적구분">
								<option value="전용면적">전용면적</option>
								<option value="분양면적">계약면적</option>
							</select>
						</div>
						<div class="w-80px mx-2">
							<select class="form-control selectpicker" name="select_층">
								<option value="">층</option>
							</select>
						</div>
					</div>
					<span>단위 : 만원</span>
					</div>
					<div class="">
						<div id="chart_1_1"></div>
					</div>

					<div class="reference"></div>					
				</div>

				<div class="position-relative px-6 py-6 bg-white mb-4" id="blockListSales">
					<div class="d-flex justify-content-between align-items-center mb-4">
						<h4 class="font-size-h5 ">분양현장 리스트</h4>
						<h4 style="font-size: 14px;"><span data-cnt-sales/>
						<i class="fa fa-question-circle icon-ms text-muted ml-1" data-toggle="tooltip" data-placement="right" title="화면에는 최대 30건의 자료가 조회되며 전체 자료는 하단에서 내려받기 후 엑셀파일로 확인이 가능합니다."> </i>
						</h4>
					</div>
					<div class="scroll_x_table table-scroll" id="table-scroll-sale">
						<div class="table-wrap table-fixed-header">
							<table class="table table-bordered m-0 row_10_table main-table-sale" style="width: 1590px;">
								<colgroup>
								</colgroup>
								<thead>
									<tr>
										<th class="py-2 text-center bg-light-secondary align-middle fixed-side w-180px h-35px">상가명</th>
										<th class="py-2 text-center bg-light-secondary w-300px h-35px">주소</th>
										<th class="py-2 text-center bg-light-secondary w-140px h-35px">건축규모</th>
										<th class="py-2 text-center bg-light-secondary w-100px h-35px">대지면적</th>
										<th class="py-2 text-center bg-light-secondary w-100px h-35px">연면적</th>
										<th class="py-2 text-center bg-light-secondary w-100px h-35px">총점포수</th>
										<th class="py-2 text-center bg-light-secondary w-100px h-35px">점포수(1F)</th>
										<th class="py-2 text-center bg-light-secondary w-120px h-35px">계약평당가(1F)</th>
										<th class="py-2 text-center bg-light-secondary w-120px h-35px">전용평당가(1F)</th>
										<th class="py-2 text-center bg-light-secondary w-100px h-35px">전용율</th>
										<th class="py-2 text-center bg-light-secondary w-100px h-35px">분양년월</th>
										<th class="py-2 text-center bg-light-secondary w-100px h-35px">입주년월</th>
									</tr>
								</thead>
							</table>
						</div>
						<div class="table-wrap table-fixed-body">
							<table class="table table-bordered m-0 row_9_table main-table-apart" style="width: 1590px;">
								<tbody id="tbodyBlockComplex">
									<!-- Handlebars -->
								</tbody>
							</table>
						</div>
					</div>
					
					<div class="reference"></div>					
				</div>
				<div class="position-relative px-6 py-6 bg-white mb-4">
					<div class="d-flex justify-content-between align-items-center mb-2">
						<div class="d-flex align-items-center" id="form_chart_3_1">
							<h4 class="font-size-h5 m-0">평균임대료</h4>
							<div class="w-80px mx-2">
								<select class="form-control selectpicker" name="select_면적단위">
									<option value="미터">㎡ </option>
									<option value="평">3.3㎡</option>
								</select>
							</div>
							<div class="w-140px mx-2">
								<select class="form-control selectpicker" name="select_면적구분">
									<option value="전용면적">전용면적</option>
									<option value="계약면적">계약면적</option>
								</select>
							</div>
							<div class="w-80px mx-2">
								<select class="form-control selectpicker" name="select_층">
									<option value="">층</option>
									<option value="-1">B1 이하</option>
									<option value="1">1F</option>
									<option value="2">2F</option>
									<option value="3">3F</option>
									<option value="4">4F 이상</option>
								</select>
							</div>
						</div>
						<span>단위 : 만원</span>
					</div>
					<div class="mt-4">
						<div id="chart_3_1"></div>
					</div>
<%--					<span>* 현 시점의 면적별 임대료 정보제공</span> --%>
					<div class="reference"></div>
				</div>

				<div class="position-relative px-6 py-6 bg-white mb-4" id="blockListRent">
					<div class="d-flex justify-content-between align-items-center mb-4">
						<h4 class="font-size-h5 ">임대매물 리스트 <span style="font-size: 12px;"> (단위 : 만원)</span></h4>
						<h4 style="font-size: 14px;"><span data-cnt-rent/>
						<i class="fa fa-question-circle icon-ms text-muted ml-1" data-toggle="tooltip" data-placement="right" title="화면에는 최대 30건의 매물이 조회되며 전체 매물이 하단에서 내려받기 후 엑셀파일로 확인이 가능합니다."> </i>
						</h4>
					</div>                
					<div class="scroll_x_table table-scroll" id="table-scroll-rent">
						<div class="table-wrap table-fixed-header">
							<table class="table table-bordered m-0 row_11_table main-table-rent">
								<colgroup>
								<%--
									<col style="width:7%">
									<col style="width:7%">
									<col style="width:auto">
									<col style="width:7%">
									<col style="width:7%">
									<col style="width:7%">
									<col style="width:7%">
									<col style="width:7%">
									<col style="width:7%">
								--%>
								</colgroup>
								<thead>
									<tr>
										<th class="py-2 text-center bg-light-secondary fixed-side w-100px h-35px">매물등록일</th>
										<th class="py-2 text-center bg-light-secondary w-100px h-35px">상가유형</th>
										<th class="py-2 text-center bg-light-secondary w-150px h-35px">건물명</th>
										<th class="py-2 text-center bg-light-secondary w-300px h-35px">주소</th>
										<th class="py-2 text-center bg-light-secondary w-60px h-35px">층</th>
										<th class="py-2 text-center bg-light-secondary w-80px h-35px">전용면적</th>
										<th class="py-2 text-center bg-light-secondary w-80px h-35px">계약면적</th>
										<th class="py-2 text-center bg-light-secondary w-90px h-35px">보증금</th>
										<th class="py-2 text-center bg-light-secondary w-90px h-35px">월세</th>
										<th class="py-2 text-center bg-light-secondary w-90px h-35px">권리금</th>
										<th class="py-2 text-center bg-light-secondary w-90px h-35px">사용승인일</th>
									</tr>
								</thead>
							</table>
						</div>
					<div class="table-wrap table-fixed-body">
						<table class="table table-bordered m-0 row_11_table main-table-apart">
							<tbody id="tbodyBlockRentForSale">
								<!-- Handlebars -->
							</tbody>
						</table>
					</div>
					</div>
					
					<div class="reference"></div>					
				</div>
				
				<div class="position-relative px-6 py-6 bg-white mb-4">
					<div class="d-flex justify-content-between align-items-center mb-2">
						<div class="d-flex align-items-center" id="form_chart_4_1">
							<h4 class="font-size-h5 m-0">평균매매가</h4>
							<div class="w-80px mx-2">
								<select class="form-control selectpicker" name="select_면적단위">
									<option value="미터">㎡ </option>
									<option value="평">3.3㎡</option>
								</select>
							</div>
							<div class="w-140px mx-2">
								<select class="form-control selectpicker" name="select_면적구분">
									<option value="전용면적">전용면적</option>
									<option value="계약면적">계약면적</option>
								</select>
							</div>
							<div class="w-80px mx-2">
								<select class="form-control selectpicker" name="select_층">
									<option value="">층</option>
									<option value="-1">B1 이하</option>
									<option value="1">1F</option>
									<option value="2">2F</option>
									<option value="3">3F</option>
									<option value="4">4F 이상</option>
								</select>
							</div>
						</div>
						<span>단위 : 만원</span>
					</div>
					<div class="mt-4">
						<div id="chart_4_1"></div>
					</div>
<%--					<span>* 현 시점의 면적별 임대료 정보제공</span> --%>
					<div class="reference"></div>
				</div>

				<div class="position-relative px-6 py-6 bg-white mb-4" id="blockListTrading">
					<div class="d-flex justify-content-between align-items-center mb-4">
						<h4 class="font-size-h5">매매매물 리스트 <span style="font-size: 12px;"> (단위 : 만원)</span></h4>
						<h4 style="font-size: 14px;"><span data-cnt-trading/>
						<i class="fa fa-question-circle icon-ms text-muted ml-1" data-toggle="tooltip" data-placement="right" title="화면에는 최대 30건의 매물이 조회되며 전체 매물이 하단에서 내려받기 후 엑셀파일로 확인이 가능합니다."> </i>
						</h4>
					</div>
					<div class="scroll_x_table table-scroll" id="table-scroll-trading">
						<div class="table-wrap table-fixed-header" style="display:none;">
							<table class="table table-bordered m-0 row_10_table main-table-trading">
								<colgroup>
								</colgroup>
								<thead>
									<tr>
										<th class="py-2 text-center bg-light-secondary fixed-side w-100px h-35px">매물등록일</th>
										<th class="py-2 text-center bg-light-secondary w-100px h-35px">상가유형</th>
										<th class="py-2 text-center bg-light-secondary w-150px h-35px">건물명</th>
										<th class="py-2 text-center bg-light-secondary w-300px h-35px">주소</th>
										<th class="py-2 text-center bg-light-secondary w-60px h-35px">층</th>
										<th class="py-2 text-center bg-light-secondary w-80px h-35px">전용면적</th>
										<th class="py-2 text-center bg-light-secondary w-80px h-35px">계약면적</th>
										<th class="py-2 text-center bg-light-secondary w-90px h-35px">매매가</th>
										<th class="py-2 text-center bg-light-secondary w-90px h-35px">권리금</th>
										<th class="py-2 text-center bg-light-secondary w-90px h-35px">수익률</th>
									</tr>
								</thead>
							</table>
						</div>
						<div class="table-wrap table-fixed-body">
							<table class="table table-bordered m-0 main-table-apart" style="width:1300px;">
								<colgroup>
									<col style="width:10%">
									<col style="width:auto">
									<col style="width:10%">
									<col style="width:10%">
									<col style="width:10%">
									<col style="width:4%">
									<col style="width:8%">
									<col style="width:10%">
									<col style="width:8%">
									<col style="width:8%">
								</colgroup>
								<thead>
									<tr>
										<th class="py-2 text-center bg-light-secondary fixed-side" style="display: table-cell;">매물등록일</th>
										<th class="py-2 text-center bg-light-secondary" style="display: table-cell;">상가유형</th>
										<th class="py-2 text-center bg-light-secondary" style="display: table-cell;">건물명</th>
										<th class="py-2 text-center bg-light-secondary" style="display: table-cell;">주소</th>
										<th class="py-2 text-center bg-light-secondary" style="display: table-cell;">층</th>
										<th class="py-2 text-center bg-light-secondary" style="display: table-cell;">전용면적</th>
										<th class="py-2 text-center bg-light-secondary" style="display: table-cell;">계약면적</th>
										<th class="py-2 text-center bg-light-secondary" style="display: table-cell;">매매가</th>
										<th class="py-2 text-center bg-light-secondary" style="display: table-cell;">권리금</th>
										<th class="py-2 text-center bg-light-secondary" style="display: table-cell;">수익률</th>
									</tr>
								</thead>
								<tbody id="tbodyBlockTradingForSale">
									<!-- Handlebars -->
								</tbody>
							</table>
						</div>
					</div>					
					<div class="reference"></div>					
				</div>

				<div class="position-relative px-6 py-6 bg-white mb-4" id="blockListRealTran">
					<div class="d-flex justify-content-between align-items-center mb-4">
						<h4 class="font-size-h5 ">실거래 리스트 <span style="font-size: 12px;"> (단위 : 만원)</span></h4>
						<h4 style="font-size: 14px;"><span data-cnt-realtran/>
						<i class="fa fa-question-circle icon-ms text-muted ml-1" data-toggle="tooltip" data-placement="right" title="화면에는 최대 30건의 매물이 조회되며 전체 매물이 하단에서 내려받기 후 엑셀파일로 확인이 가능합니다."> </i>
						</h4>
					</div>
					<div class="scroll_x_table table-scroll" id="table-scroll-actual">
						<div class="table-wrap table-fixed-header" style="display:none;">
							<table class="table table-bordered table-fixed-header m-0 row_11_table main-table-actual" style="width:1300px;">
								<colgroup>
								<%--
									<col style="width:10%">
									<col style="width:10%">
									<col style="width:auto">
									<col style="width:10%">
									<col style="width:7%">
									<col style="width:7%">
									<col style="width:10%">
									<col style="width:7%">
								--%>
								</colgroup>
								<thead>
									<tr>
										<th class="py-2 text-center bg-light-secondary align-middle fixed-side w-100px h-35px" style="display: table-cell;">계약일</th>
										<th class="py-2 text-center bg-light-secondary align-middle fixed-side w-140px h-35px" style="display: table-cell;">상가유형</th>
										<th class="py-2 text-center bg-light-secondary align-middle fixed-side w-140px h-35px" style="display: table-cell;">건물명</th>
										<th class="py-2 text-center bg-light-secondary w-265px h-35px" style="display: table-cell;">주소</th>
										<th class="py-2 text-center bg-light-secondary fixed-side w-140px h-35px" style="display: table-cell;">주용도</th>
										<th class="py-2 text-center bg-light-secondary w-50px  h-35px" style="display: table-cell;">층</th>
										<th class="py-2 text-center bg-light-secondary w-100px h-35px" style="display: table-cell;">전용면적</th>
										<th class="py-2 text-center bg-light-secondary w-100px h-35px" style="display: table-cell;">용도지역</th>
										<th class="py-2 text-center bg-light-secondary w-100px h-35px" style="display: table-cell;">거래금액</th>
										<th class="py-2 text-center bg-light-secondary w-100px h-35px" style="display: table-cell;">건축년도</th>
									</tr>
								</thead>
							</table>
						</div>
						<div class="table-wrap table-fixed-body" style="float:none">
							<table class="table table-bordered m-0 row_11_table main-table-apart" style="width:1300px;">
								<colgroup>
										<col style="width:10%">
										<col style="width:10%">
										<col style="width:auto">
										<col style="width:10%">
										<col style="width:10%">
										<col style="width:4%">
										<col style="width:8%">
										<col style="width:10%">
										<col style="width:8%">
										<col style="width:8%">
								</colgroup>
								<thead>
									<tr>
										<th class="py-2 text-center bg-light-secondary align-middle" style="display: table-cell;">계약일</th>
										<th class="py-2 text-center bg-light-secondary align-middle" style="display: table-cell;">상가유형</th>
										<th class="py-2 text-center bg-light-secondary align-middle" style="display: table-cell;">건물명</th>
										<th class="py-2 text-center bg-light-secondary" style="display: table-cell;">주소</th>
										<th class="py-2 text-center bg-light-secondary" style="display: table-cell;">주용도</th>
										<th class="py-2 text-center bg-light-secondary" style="display: table-cell;">층</th>
										<th class="py-2 text-center bg-light-secondary" style="display: table-cell;">전용면적</th>
										<th class="py-2 text-center bg-light-secondary" style="display: table-cell;">용도지역</th>
										<th class="py-2 text-center bg-light-secondary" style="display: table-cell;">거래금액</th>
										<th class="py-2 text-center bg-light-secondary" style="display: table-cell;">건축년도</th>
									</tr>
								</thead>
								<tbody id="tbodyBlockTRD">
									<!-- Handlebars -->
								</tbody>
							</table>
						</div>
					</div>
					<div class="reference"></div>					
				</div>
				
				
				
				<div class="px-6 py-6 bg-white mb-4 font-size-sm">
					<p class="text-center">@2020 RCS</p>
					위의 정보는 시점 기준으로 지속적으로 업데이트 하고 있으나, 변동사항 있을 수 있습니다. 공식적인 자료 등 열람하여 반드시 재확인 바랍니다.<br> RCS에서 제공된 정보를 무단으로 사용 할 수 없음을 알려드립니다.
				</div>
			</div>
			
			<div class="tab-pane fade" id="kt_tab_pane_2" role="tabpanel" aria-labelledby="kt_tab_pane_2">
				<div class="position-relative px-6 py-6 bg-white mb-4" id="form_chart_5_1">
					<div class="d-flex justify-content-between align-items-center mb-2">
						<h4 class="font-size-h5 mb-2">
							<span>업종 현황</span>
							<!-- 230601추가 -->
							<i class="fa fa-question-circle icon-md ml-3 tooltipCustom">
								<span class="tooltipCustom-text">2023년 1분기부터 소상공인 진흥공단 업종코드가 변경되었습니다. <br>시점을 선택하여 변경 전후의 차트를 비교해보세요.</span>
							</i>
							<!--// 230601추가 -->
						</h4>
						<div class="w-200px mx-2">
							<select class="form-control selectpicker" name="select_업종현황">
								<option value="2022">2022년 이전</option>
								<option value="2023">2023년 이후</option>
							</select>
						</div>
						<span>단위 : 개소</span>
					</div>
					<div class="">
						<div id="chart_5_1"></div>
					</div>
					<div class="reference"></div>
				</div>

				<div class="position-relative px-6 py-6 bg-white mb-4" id="form_chart_lobz_6">
					<div class="d-flex justify-content-between align-items-center mb-4">
						<h4 class="font-size-h5 ">총 매출 추이</h4>
						<div class="w-200px mx-2">
							<select class="form-control selectpicker" name="select_업종구분" multiple>
								<option value="">업종 전체</option>
								<option value="0">교육</option>
								<option value="1">서비스</option>
								<option value="2">소매</option>
								<option value="3">음식</option>
								<option value="4">의료</option>
								<option value="5">F_교육</option>
								<option value="6">F_서비스</option>
								<option value="7">F_소매</option>
								<option value="8">F_음식</option>
								<option value="9">F_의료</option>
							</select>
						</div>
						<span>단위 : 억원</span>
					</div>
					
					<div class="">
						<div id="chart_lobz_6"></div>
					</div>
					<div class="reference"></div>					
				</div>

				<div class="position-relative px-6 py-6 bg-white mb-4">
					<div class="d-flex justify-content-between align-items-center mb-4">
						<h4 class="font-size-h5 ">업종별 매출 추이</h4>
						<span>단위 : 억원</span>
					</div>
					<div class="">
						<div id="chart_lobz_5"></div>
					</div>
					<div class="reference"></div>					
				</div>
				
				
				<div class="position-relative px-6 py-6 bg-white mb-4">
					<div class="d-flex justify-content-between align-items-center mb-2">
						<h4 class="font-size-h5 mb-2">거주인구 : 성별 x 연령별</h4>
						<span>단위 : 명</span>
					</div>
					<div class="relative">
						<div id="chart_map_commerce_04"></div>
						<!-- <ul class="chart_y_label" style="display: none;">
							<li>거주인구(남)</li>
							<li>거주인구(여)</li>
							<li>직장인구(남)</li>
							<li>직장인구(여)</li>
						</ul> -->
					</div>
					<div class="reference"></div>
				</div>

				<div class="position-relative px-6 py-6 bg-white mb-4">
					<div class="d-flex justify-content-between align-items-center mb-2">
						<h4 class="font-size-h5 m-0">직장인구 : 성별 x 연령별</h4>
						<span>단위 : 명</span>
					</div>
					<div class="">
						<div id="chart_7_2"></div>
					</div>
					<div class="reference"></div>
				</div>

				<div class="position-relative px-6 py-6 bg-white mb-4">
					<div class="d-flex justify-content-between align-items-center mb-2">
						<h4 class="font-size-h5 mb-2">유동인구 : 성별 x 연령별</h4>
						<span>단위 : 명</span>
					</div>
					<div class="">
						<div id="chart_7_3"></div>
					</div>
					<div class="reference"></div>
				</div>

				<div class="position-relative px-6 py-6 bg-white mb-4">
					<div class="d-flex justify-content-between align-items-center mb-2">
						<h4 class="font-size-h5 m-0">유동인구 : 요일 x 시간대별</h4>
						<span>단위 : 명</span>
					</div>
					<div class="">
						<div id="chart_pop_flow_time"></div>
					</div>
					<div class="reference"></div>
				</div>
<%--
				<div class="px-6 py-6 bg-white mb-4" style="display: none;">
					<div class="d-flex justify-content-between align-items-center mb-2">
						<h4 class="font-size-h5 m-0">유동인구</h4>
					</div>
					<div class="d-flex">
						<div class="w-50 mr-1">
							<div class="text-center mb-2">
								<div class="d-inline-block border rounded-xl py-2 px-4">
									요일별
								</div>
							</div>
							<div class="mb-4">
								<div id="chart_10"></div>
							</div>
						</div>
						<div class="w-50 ml-1">
							<div class="text-center mb-2">
								<div class="d-inline-block border rounded-xl py-2 px-4">
									시간별
								</div>
							</div>
							<div class="mb-4">
								<div id="chart_11"></div>
							</div>
						</div>
					</div>
				</div>
--%>				
<%--
				<div class="px-6 py-6 bg-white mb-4">
					<div class="d-flex justify-content-between align-items-center mb-2">
						<div class="d-flex align-items-center">
							<h4 class="font-size-h5 m-0">매출정보</h4>
						</div>
						<span></span>
					</div>
					<h5 class="font-size-lg mb2 text-center">인구구분</h5>
					<div class="d-flex">
						<div class="w-50 mr-1">
							<div class="text-center mb-2">
								<div class="d-inline-block border rounded-xl py-2 px-4">
									계절별
								</div>
							</div>
							<div class="mb-4">
								<div id="chart_lobz_1"></div>
							</div>
						</div>
						<div class="w-50 ml-1">
							<div class="text-center mb-2">
								<div class="d-inline-block border rounded-xl py-2 px-4">
									성별/연령
								</div>
							</div>
							<div class="mb-4">
								<div id="chart_lobz_2"></div>
							</div>
						</div>
					</div>
					<h5 class="font-size-lg mb2 text-center">시간구분</h5>
					<div class="d-flex">
						<div class="w-50 mr-1">
							<div class="text-center mb-2">
								<div class="d-inline-block border rounded-xl py-2 px-4">
									요일별
								</div>
							</div>
							<div class="mb-4">
								<div id="chart_lobz_3"></div>
							</div>
						</div>
						<div class="w-50 ml-1">
							<div class="text-center mb-2">
								<div class="d-inline-block border rounded-xl py-2 px-4">
									시간별
								</div>
							</div>
							<div class="mb-4">
								<div id="chart_lobz_4"></div>
							</div>
						</div>
					</div>
				</div>
--%>
				<div class="position-relative px-6 py-6 bg-white mb-4" id="blockNearApt">
					<div class="d-flex justify-content-between align-items-center mb-4">
						<h4 class="font-size-h5">배후수요 정보: 선택 블록 반경 5km 이내</h4>
						<h4 data-cnt-apt style="font-size: 14px;">총 단지 / 세대</h4>
					</div>
					<div class="scroll_x_table table-scroll" id="table-scroll-apart">
						<div class="table-wrap table-fixed-header">
							<table class="table table-bordered m-0 row_10_table main-table-apart">
								<thead>
									<tr>
										<th class="py-2 text-center bg-light-secondary fixed-side w-100px h-35px">상품구분</th>
										<th class="py-2 text-center bg-light-secondary fixed-side w-100px h-35px">시군구</th>
										<th class="py-2 text-center bg-light-secondary fixed-side w-100px h-35px">읍면동</th>
										<th class="py-2 text-center bg-light-secondary fixed-side w-200px h-35px">단지명</th>
										<th class="py-2 text-center bg-light-secondary w-100px h-35px">구분</th>
										<th class="py-2 text-center bg-light-secondary w-100px h-35px">세대수</th>
										<th class="py-2 text-center bg-light-secondary w-70px h-35px">거리</th>
										<th class="py-2 text-center bg-light-secondary w-110px h-35px">입주일</th>
										<th class="py-2 text-center bg-light-secondary w-110px h-35px">분양일</th>
										<th class="py-2 text-center bg-light-secondary w-200px h-35px">시공사</th>
									</tr>
								</thead>
							</table>
						</div>
						<div class="table-wrap table-fixed-body">
							<table class="table table-bordered m-0 row_10_table main-table-apart">
								<tbody id="tbodyBlockNearApt">
									<!-- Handlebars -->
								</tbody>
							</table>
						</div>
					</div>
					<div class="reference"></div>					
				</div>

				<div class="position-relative px-6 py-6 bg-white mb-4" id="blockNearFac">
					<div class="d-flex justify-content-between align-items-center mb-4">
						<h4 class="font-size-h5">시설 정보: 선택 블록 반경 5km 이내</h4>
					</div>	
									
					<div class="d-flex justify-content-between align-items-center mb-2 addUser ">
						<h6 class="control-label">통계</h6>
					</div>
					<table class="table table-bordered mb-4">
						<colgroup>
							<col width="25%">
							<col width="25%">
							<col width="25%">
							<col width="*">
						</colgroup>
						<thead>
						<tr>
							<th class="blockNear py-2 text-center bg-light-secondary align-middle">관공서</th>
							<th class="blockNear py-2 text-center bg-light-secondary align-middle">병원</th>
							<th class="blockNear py-2 text-center bg-light-secondary align-middle">학교</th>
							<th class="blockNear py-2 text-center bg-light-secondary align-middle">문화시설</th>
						</tr>
						</thead>
						<tbody id="tbodyBlockNearFacStat">	
						</tbody>
					</table>
					
					<div class="d-flex justify-content-between align-items-center mb-2 addUser">
						<h6 class="control-label">상세정보</h6>
					</div>
					<div class="scroll_x_table table-scroll" id="table-scroll-nearfaclist">
						<div class="table-wrap table-fixed-header">
							<table class="table table-bordered m-0 row_9_table main-table-nearfaclist">
								<thead>
									<tr>
										<th class="py-2 text-center bg-light-secondary w-100px h-35px">시설구분</th>
										<th class="py-2 text-center bg-light-secondary w-100px h-35px">구분</th>
										<th class="py-2 text-center bg-light-secondary w-200px h-35px">시설명</th>
										<th class="py-2 text-center bg-light-secondary w-70px  h-35px">거리</th>
										<th class="py-2 text-center bg-light-secondary w-110px h-35px">특징</th>
										<th class="py-2 text-center bg-light-secondary w-110px h-35px">특징2(이용객,학생수)</th>
										<th class="py-2 text-center bg-light-secondary w-400px h-35px">주소상세</th>
									</tr> 
								</thead>
							</table>
						</div>
						<div class="table-wrap table-fixed-body">
							<table class="table table-bordered m-0 row_9_table main-table-nearfaclist">
								<tbody id="tbodyBlockNearFacList">
									<!-- Handlebars -->
								</tbody>
							</table>
						</div>
					</div>
					<div class="reference"></div>			
				</div>

				<div class="position-relative px-6 py-6 bg-white mb-4" id="blockNearTraffic">
					<div class="d-flex justify-content-between align-items-center mb-4">
						<h4 class="font-size-h5">교통 정보: 선택 블록 반경 5km 이내</h4>
					</div>	
									
					<div class="d-flex justify-content-between align-items-center mb-2 addUser ">
						<h6 class="control-label">통계</h6>
					</div>
					<table class="table table-bordered mb-4">
						<colgroup>
							<col width="25%">
							<col width="*">
							<col width="25%">
							<col width="25%">
						</colgroup>
						<thead>
						<tr>
							<th class="blockNear py-2 text-center bg-light-secondary align-middle">지하철역</th>
							<th class="blockNear py-2 text-center bg-light-secondary align-middle">철도역</th>
							<th class="blockNear py-2 text-center bg-light-secondary align-middle">톨게이트</th>
							<th class="blockNear py-2 text-center bg-light-secondary align-middle">공항</th>
						</tr>
						</thead>
						<tbody id="tbodyBlockNearTrafficStat">									
						</tbody>
					</table>
					
					<div class="d-flex justify-content-between align-items-center mb-2 addUser">
						<h6 class="control-label">상세정보</h6>
					</div>
					<div class="scroll_x_table table-scroll" id="table-scroll-neartrafficlist">
						<div class="table-wrap table-fixed-header">
							<table class="table table-bordered m-0 row_10_table main-table-neartrafficlist">
								<thead>
									<tr>
										<th class="py-2 text-center bg-light-secondary w-100px h-35px">교통구분</th>
										<th class="py-2 text-center bg-light-secondary w-100px h-35px">구분</th>
										<th class="py-2 text-center bg-light-secondary w-200px h-35px">시설명</th>
										<th class="py-2 text-center bg-light-secondary w-70px  h-35px">거리</th>
										<th class="py-2 text-center bg-light-secondary w-110px h-35px">특징</th>
										<th class="py-2 text-center bg-light-secondary w-110px h-35px">승하차인구</th>
										<th class="py-2 text-center bg-light-secondary w-400px h-35px">주소상세</th>
									</tr>
								</thead>
							</table>
						</div>
						<div class="table-wrap table-fixed-body">
							<table class="table table-bordered m-0 row_10_table main-table-neartrafficlist">
								<tbody id="tbodyBlockNearTrafficList">
								</tbody>
							</table>
						</div>
					</div>
					<div class="reference"></div>			
				</div>

				<div class="px-6 py-6 bg-white mb-4 font-size-sm">
					<p class="text-center">@2020 RCS</p>
					위의 정보는 시점 기준으로 지속적으로 업데이트 하고 있으나, 변동사항 있을 수 있습니다. 공식적인 자료 등 열람하여 반드시 재확인 바랍니다.<br> RCS에서 제공된 정보를 무단으로 사용 할 수 없음을 알려드립니다.
				</div>
			</div>

		</div>
	</div>
	<!--end::Content-->
	<!--begin::Footer-->
	<div class="flex-column-auto">
		<div class="d-flex">
		<%--
			<button class="btn btn-danger btn-square btn-lg btn-block"><i class="flaticon2-copy"></i>복사하기</button>
		--%>
			<button class="btn btn-danger btn-square btn-lg btn-block mt-0" data-btn-export="excel"><i class="flaticon-download"></i>내려받기</button>
		</div>
	</div>
	<!--end::Footer -->
</div>
<!--end::Detail Panel-->

<%@ include file="/WEB-INF/view/admin/APPS/gis/tmplBlockMapDtl.jsp"%>

