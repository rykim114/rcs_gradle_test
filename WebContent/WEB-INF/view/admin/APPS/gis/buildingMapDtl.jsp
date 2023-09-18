<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!-- mapPannel1 -->
<!--begin::Detail Panel-->

	<!-- 건물  -->
	<div id="mapPannel1" class="position-fixed w-800px pb-0 d-none flex-column border map-pannel bg-white">
		<div class="position-absolute map-pannel-close" id="mapPannel1Close">
			<button class="btn btn-square btn-outline-secondary pl-5 pr-4 py-5 bg-white"><i class="flaticon2-cross text-dark"></i></button>
		</div>
		<!--begin::Content-->
		<div class="flex-column-fluid scroll ps bg-light-secondary" data-scroll="true" data-height="600" style="height:600px">
			<!--begin::Header-->
			<div class="d-flex align-items-center justify-content-between bg-white pt-6 pb-4 px-6 flex-column-auto">
				<div class="pb-3">
					<h3 class="font-size-h3 text-dark mb-1" id="y_위치"></h3>
					<span class="font-size-lg" id="y_건물명">-</span>
				</div>
				<div class="mt-n1" style="display: none;">
					<!-- 즐겨찾기 전 버튼 -->
					<button class="btn btn-outline-secondary pl-2 pr-1 py-2" data-btn-favorite><i class="flaticon-star"></i></button>
					
					<!-- 즐겨찾기 후 버튼 -->
					<!-- <button class="btn pl-2 pr-1 py-2 btn-outline-secondary" data-btn-favorite data-toggle="modal" data-target="#favModal"><i class="flaticon-star"></i></button> -->
				</div>
			</div>
			<div class="d-flex justify-content-between bg-white">
				<div class="basic-info">
					<h4 class="font-size-h5 mb-4">기본정보</h4>
					<ul>
						<li>
							<label>사용승인일</label>
							<strong id="z_사용승인일">-</strong>
						</li>
						<li>
							<label>건축규모</label>
							<strong id="z_건축규모">-</strong>
						</li>
						<li>
							<label>주용도</label>
							<strong id="z_주용도">-</strong>
						</li>
					</ul>
				</div>
			</div>
			<ul class="nav nav-tabs nav-tabs-line nav-justified nav-tabs-line-2x nav-tabs-line-danger border-top bg-white sticky">
				<li class="nav-item border-right">
					<a class="nav-link active justify-content-center m-0 font-size-h6 kt_tab_pane_1 tab_content_show" data-toggle="tab" href="#kt_tab_pane_1">개요</a>
				</li>

				<li class="nav-item">
					<a class="nav-link justify-content-center m-0 font-size-h6 tab_content_show" data-toggle="tab" href="#kt_tab_pane_3">상권분석</a>
				</li>
			</ul>
			<!--end::Header-->
			<div class="tab-content" id="myTabContent">
				<div class="tab-pane fade show active" id="kt_tab_pane_1" role="tabpanel" aria-labelledby="kt_tab_pane_1">
					<div class="px-6 py-6 bg-white mb-4">
						<h4 class="font-size-h5 mb-4">기본정보</h4>
						<table class="table table-bordered m-0">
							<colgroup>
								<col style="width:120px">
								<col style="width:auto">
							</colgroup>
							<tbody>
								<tr>
									<td class="bg-light-secondary py-2">상가명</td>
									<td class="py-2" id="s_건물명"></td>
								</tr>								
								<tr>
									<td class="bg-light-secondary py-2">대지위치</td>
									<td class="py-2" id="s_위치"></td>
								</tr>
								<tr>
									<td class="bg-light-secondary py-2">대지면적</td>
									<td class="py-2" id="s_대지면적"></td>
								</tr>
								<tr>
									<td class="bg-light-secondary py-2">연면적</td>
									<td class="py-2" id="s_연면적"></td>
								</tr>
								<tr>
									<td class="bg-light-secondary py-2">주용도</td>
									<td class="py-2" id="s_주용도"></td>
								</tr>
								<tr>
									<td class="bg-light-secondary py-2">규모</td>
									<td class="py-2" id="s_규모"></td>
								</tr>
								<tr>
									<td class="bg-light-secondary py-2">주차장/승강기</td>
									<td class="py-2" id="s_주차장"></td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="px-6 py-6 bg-white mb-4">
						<div class="d-flex justify-content-between">
							<h4 class="font-size-h5 mb-4">상가면적</h4>
						</div>
						
						<table class="table table-bordered m-0">
							<colgroup>
								<col style="width:20%">
								<col style="width:auto">
								<col style="width:20%">
								<col style="width:20%">
							</colgroup>
							<thead>
								<tr>
									<th class="py-2 text-center bg-light-secondary align-middle">구분</th>
									<th class="py-2 text-center bg-light-secondary align-middle">전용면적</th>
									<th class="py-2 text-center bg-light-secondary align-middle">계약면적</th>
									<th class="py-2 text-center bg-light-secondary align-middle">전용율</th>
								</tr>
							</thead>ㅇ
							<tbody id="tbodyBuildingComplex7_1"></tbody>
						</table>
					</div>
					
					<div class="px-6 py-6 bg-white mb-4">
						<div class="d-flex justify-content-between">
							<h4 class="font-size-h5 mb-4">건축물현황</h4>
						</div>
						<table class="table table-bordered m-0">
							<colgroup>
								<col width="20%">
								<col width="*">
								<col width="30%">
							</colgroup>
							<thead>
							<tr>
								<th class="py-2 text-center bg-light-secondary align-middle">층</th>
								<th class="py-2 text-center bg-light-secondary align-middle">주 용도</th>
								<th class="py-2 text-center bg-light-secondary align-middle">면적<span class="font-weight-normal">(㎡ / 평)</span></th>
							</tr>
							</thead>
							<tbody id="tbodyBuildingComplex1_2"></tbody>
<!-- 									<tr>
									<td class="py-2 text-center align-middle bg-light-secondary">B1</td>
									<td class="py-2 text-center align-middle">일반 공장</td>
									<td class="py-2 text-center align-middle">109/33</td>
								</tr>
								<tr>
									<td class="py-2 text-center align-middle bg-light-secondary">1F</td>
									<td class="py-2 text-center align-middle">기타 공장</td>
									<td class="py-2 text-center align-middle">109/33</td>
								</tr>
								<tr>
									<td class="py-2 text-center align-middle bg-light-secondary">2F</td>
									<td class="py-2 text-center align-middle">제 2종 근린 생활 시설</td>
									<td class="py-2 text-center align-middle">109/33</td>
								</tr>
							</tbody> -->
						</table>
					</div>
					
					<div class="px-6 py-6 bg-white mb-4">
						<div class="d-flex justify-content-between">
							<h4 class="font-size-h5 mb-4">상가 업소 정보</h4>
						</div>
						<table class="table table-bordered m-0">
							<colgroup>
								<col width="*">
								<col width="12%">
								<col width="20%">
								<col width="22%">
								<col width="25%">
							</colgroup>
							<thead>
							<tr>
								<th class="py-2 text-center bg-light-secondary align-middle">상가업소명</th>
								<th class="py-2 text-center bg-light-secondary align-middle">층</th>
								<th class="py-2 text-center bg-light-secondary align-middle">업종 대분류</th>
								<th class="py-2 text-center bg-light-secondary align-middle">업종 중분류</th>
								<th class="py-2 text-center bg-light-secondary align-middle">업종 소분류</th>
							</tr>
							</thead>
							<tbody id="tbodyBuildingComplex5"></tbody>
						</table>							
					</div>
											
					<div class="px-6 py-6 bg-white mb-4 font-size-sm">
						<p class="text-center">@2020 RCS</p>
						위의 정보는 시점 기준으로 지속적으로 업데이트 하고 있으나, 변동사항 있을 수 있습니다. 공식적인 자료 등 열람하여 반드시 재확인 바랍니다.<br> RCS에서 제공된 정보를 무단으로 사용 할 수 없음을 알려드립니다.
					</div>
				</div>										
				
				<div class="tab-pane fade" id="kt_tab_pane_3" role="tabpanel" aria-labelledby="kt_tab_pane_3">
					<div class="position-relative px-6 py-6 bg-white mb-4" id="form_g_chart_5_1">
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
							<div id="g_chart_5_1"></div>
						</div>
						<div class="reference"></div>
					</div>
							
					<div class="position-relative px-6 py-6 bg-white mb-4" id="form_g_chart_lobz_6">
						<div class="d-flex justify-content-between align-items-center mb-2">
							<h4 class="font-size-h5">총 매출 추이</h4>
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
							<div id="g_chart_lobz_6"></div>
						</div>
						<div class="reference"></div>
					</div>
							
					<div class="position-relative px-6 py-6 bg-white mb-4">
						<div class="d-flex justify-content-between align-items-center mb-2">
							<h4 class="font-size-h5">업종별 매출 추이</h4>
							<span>단위 : 억원</span>
						</div>
						<div class="">
							<div id="g_chart_lobz_5"></div>
						</div>
						<div class="reference"></div>
					</div>
					<div id="g_chart_11" style="display: none;"></div>
						<div class="position-relative px-6 py-6 bg-white mb-4">
							<div class="d-flex justify-content-between align-items-center mb-2">
								<h4 class="font-size-h5 mb-2">거주인구 : 성별 x 연령별</h4>
								<span>단위 : 명</span>
							</div>							
							<div class="">								
								<div id="g_chart_7_1"></div>
			<!-- 								<ul class="chart_y_label">
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
								<h4 class="font-size-h5 mb-2">직장인구 : 성별 x 연령별</h4>
								<span>단위 : 명</span>
							</div>
							<div class="">
								<div id="g_chart_7_2"></div>
							</div>
							<div class="reference"></div>
						</div>

						<div class="position-relative px-6 py-6 bg-white mb-4">
							<div class="d-flex justify-content-between align-items-center mb-2">
								<h4 class="font-size-h5 mb-2">유동인구 : 성별 x 연령별</h4>
								<span>단위 : 명</span>
							</div>
							<div class="">
								<div id="g_chart_7_3"></div>
							</div>
							<div class="reference"></div>
						</div>

						<div class="position-relative px-6 py-6 bg-white mb-4">
							<div class="d-flex justify-content-between align-items-center mb-2">
								<h4 class="font-size-h5 m-0">유동인구 : 요일 x 시간대별</h4>
								<span>단위 : 명</span>
							</div>
							<div class="">
								<div id="g_chart_pop_flow_time"></div>
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
				<!-- 21.01.04 수정 -->
				<!-- <button class="btn btn-danger btn-square btn-lg btn-block"><i class="flaticon2-copy"></i>복사하기</button> -->
				<button class="btn btn-danger btn-square btn-lg btn-block mt-0" data-btn-export="excel"><i class="flaticon-download"></i>내려받기</button>
			</div>
		</div>
		<!--end::Footer -->
	</div>
	<!-- end:: 건물  -->
<!--end::Detail Panel-->


	<!-- 임대 / 매매 / 실거래 -->
	<div id="mapPannel1_2" class="map-pannel-rent position-fixed w-800px pb-0 d-none flex-column border map-pannel bg-white">  
		<div class="position-absolute map-pannel-close" id="mapPannel1_2Close">
			<button class="btn btn-square btn-outline-secondary pl-5 pr-4 py-5 bg-white"><i class="flaticon2-cross text-dark"></i></button>
		</div>
		<!--begin::Content-->
		<div class="flex-column-fluid scroll ps bg-light-secondary" data-scroll="true" data-height="600" style="height:600px">
			<!--begin::Header-->
			<div class="d-flex align-items-center justify-content-between bg-white pt-6 pb-4 px-6 flex-column-auto">
				<div class="pb-3">
					<h3 class="font-size-h3 text-dark mb-1" id="o_위치">-</h3>
					<span class="font-size-lg" id="o_기타용도">-</span>
				</div>
				<div class="mt-n1" style="display: none;">
					<!-- 즐겨찾기 전 버튼 -->
					<button class="btn btn-outline-secondary pl-2 pr-1 py-2" data-btn-favorite><i class="flaticon-star"></i></button>
					<!-- 즐겨찾기 후 버튼 -->
					<!-- <button class="btn btn-danger pl-2 pr-1 py-2" data-toggle="modal" data-target="#favModal"><i class="flaticon-star text-white"></i></button> -->
				</div>
			</div>
			<div class="d-flex justify-content-between bg-white">
				<div class="basic-info">
					<h4 class="font-size-h5 mb-4">기본정보</h4>
					<ul>
						<li>
							<label>사용승인일</label>
							<strong id="o_사용승인일">-</strong>
						</li>
						<li>
							<label>건축규모</label>
							<strong id="o_건축규모">-</strong>
						</li>
						<li>
							<label>주용도</label>
							<strong id="o_주용도">-</strong>
						</li>
					</ul>
				</div>
			</div>
			<ul class="nav nav-tabs nav-tabs-line nav-justified nav-tabs-line-2x nav-tabs-line-danger border-top bg-white sticky" id="detailTabList">
				<li class="nav-item border-right">
					<a class="nav-link active justify-content-center m-0 font-size-h6 kt_tab_pane_1_2_1 tab_content_show" data-toggle="tab" href="#kt_tab_pane_1_2_1">개요</a>
				</li>
				<li class="nav-item border-right">
					<a class="nav-link justify-content-center m-0 font-size-h6 tab_content_show" data-toggle="tab" href="#kt_tab_pane_1_2_2">가격</a>
				</li>
				<li class="nav-item border-right">
					<a class="nav-link justify-content-center m-0 font-size-h6 tab_content_show" data-toggle="tab" href="#kt_tab_pane_1_2_3">상권분석</a>
				</li>
				<!-- 리맥스 매물 탭 영역 -->
			</ul>
			<!--end::Header-->
			<div class="tab-content" id="myTabContent1_2">
				<div class="tab-pane fade show active" id="kt_tab_pane_1_2_1" role="tabpanel" aria-labelledby="kt_tab_pane_1">
					<div class="px-6 py-6 bg-white mb-4">
						<h4 class="font-size-h5 mb-4">기본정보</h4>
						<table class="table table-bordered m-0 ${admin_usertag > 1 ? 'user-select-none' : ''}">
							<colgroup>
								<col width="120px">
								<col width="auto">
							</colgroup>
							<tbody>
							<tr>
								<td class="bg-light-secondary py-2">대지면적</td>
								<td class="py-2" id="o_대지면적">-</td>
							</tr>
							<tr>
								<td class="bg-light-secondary py-2">건축면적</td>
								<td class="py-2" id="o_건축면적">-</td>
							</tr>
							<tr>
								<td class="bg-light-secondary py-2">연면적</td>
								<td class="py-2" id="o_연면적">-</td>
							</tr>
							<tr>
								<td class="bg-light-secondary py-2">건폐율</td>
								<td class="py-2" id="o_건폐율">-</td>
							</tr>
							<tr>
								<td class="bg-light-secondary py-2">용적률</td>
								<td class="py-2" id="o_용적률">-</td>
							</tr>
							<tr>
								<td class="bg-light-secondary py-2">주차</td>
								<td class="px-0 py-0">
									<table class="table-detail">
										<thead>
										<tr>
											<th>구분</th>
											<th>옥내</th>
											<th>옥외</th>
										</tr>
										</thead>
										<tbody>
										<tr>
											<th>자주식</th>
											<td id="o_a주차">-</td>
											<td id="o_b주차">-</td>
										</tr>
										<tr>
											<th>기계식</th>
											<td id="o_c주차">-</td>
											<td id="o_d주차">-</td>
										</tr>
										</tbody>
									</table>
								</td>
							</tr>
							<tr>
								<td class="bg-light-secondary py-2">승강기</td>
								<td class="py-2" id="o_승강기">-</td>
							</tr>
							</tbody>
						</table>
					</div>
					<div class="px-6 py-6 bg-white mb-4">
						<div class="d-flex justify-content-between">
							<h4 class="font-size-h5 mb-4">물건현황</h4>
						</div>
						<table class="table table-bordered m-0">
							<colgroup>
								<col width="20%">
								<col width="*">
								<col width="30%">
							</colgroup>
							<thead>
							<tr>
								<th class="py-2 text-center bg-light-secondary align-middle">구분</th>
								<th class="py-2 text-center bg-light-secondary align-middle">주 용도</th>
								<th class="py-2 text-center bg-light-secondary align-middle">면적<span class="font-weight-normal">(평)</span></th>
							</tr>
							</thead>
							<tbody id="tbodyBuildingComplex1_22"></tbody>
						</table>
					</div>
					
					<div class="px-6 py-6 bg-white mb-4">
						<div class="d-flex justify-content-between">
							<h4 class="font-size-h5 mb-4">상가 업소 정보</h4>
						</div>
						<table class="table table-bordered m-0">
							<colgroup>
								<col width="*">
								<col width="12%">
								<col width="20%">
								<col width="22%">
								<col width="25%">
							</colgroup>
							<thead>
							<tr>
								<th class="py-2 text-center bg-light-secondary align-middle">상가업소명</th>
								<th class="py-2 text-center bg-light-secondary align-middle">층</th>
								<th class="py-2 text-center bg-light-secondary align-middle">업종 대분류</th>
								<th class="py-2 text-center bg-light-secondary align-middle">업종 중분류</th>
								<th class="py-2 text-center bg-light-secondary align-middle">업종 소분류</th>
							</tr>
							</thead>
							<tbody id="tbodyBuildingComplex5_1"></tbody>
						</table>							
					</div>						
									
					<div class="px-6 py-6 bg-white mb-4 font-size-sm">
						<p class="text-center">@2020 RCS</p>
						위의 정보는 시점 기준으로 지속적으로 업데이트 하고 있으나, 변동사항 있을 수 있습니다. 공식적인 자료 등 열람하여 반드시 재확인 바랍니다.<br> RCS에서 제공된 정보를 무단으로 사용 할 수 없음을 알려드립니다.
					</div>
				</div>
				<div class="tab-pane fade" id="kt_tab_pane_1_2_2" role="tabpanel" aria-labelledby="kt_tab_pane_2">
					<div class="px-6 py-6 bg-white mb-4 rent_one">
						<div class="d-flex justify-content-between">
							<h4 class="font-size-h5 mb-4">임대 매물 정보 (지번)</h4>
							<h4 style="font-size: 14px;"><span data-cnt-trading/>
							<i class="fa fa-question-circle icon-ms text-muted ml-1" data-toggle="tooltip" data-placement="right" title="화면에는 최대 30건의 매물이 조회되며 전체 매물이 하단에서 내려받기 후 엑셀파일로 확인이 가능합니다."></i>
							</h4>
						</div>
						<table class="table table-bordered m-0">
							<colgroup>
								<col width="*">
								<col width="10%">
								<col width="8%">
								<col width="11%">
								<col width="10%">
								<col width="10%">
								<col width="9%">
								<col width="9%">
								<col width="9%">
								<col width="12%">
							</colgroup>
							<thead>
							<tr>
								<th class="py-2 text-center bg-light-secondary align-middle">건물명</th>
								<th class="py-2 text-center bg-light-secondary align-middle">지번</th>
								<th class="py-2 text-center bg-light-secondary align-middle">층</th>
								<th class="py-2 text-center bg-light-secondary align-middle">상가유형</th>
								<th class="py-2 text-center bg-light-secondary align-middle">계약면적<span class="font-weight-normal">(㎡)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">전용면적<span class="font-weight-normal">(㎡)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">보증금 <span class="font-weight-normal" style="margin: 5%">(만원)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">월세 <span class="font-weight-normal" style="margin:  5%">(만원)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">권리금 <span class="font-weight-normal" style="margin: 5%">(만원)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">등록일</th>
							</tr>
							</thead>
							<tbody id="tbodyBuildingComplex2_1"></tbody>
						</table>
					</div>
					
					<div class="px-6 py-6 bg-white mb-4 rent_two">
						<div class="d-flex justify-content-between">
							<h4 class="font-size-h5 mb-4">임대 매물 정보 (동)</h4>
							<h4 style="font-size: 14px;"><span data-cnt-trading/>
							<i class="fa fa-question-circle icon-ms text-muted ml-1" data-toggle="tooltip" data-placement="right" title="화면에는 최대 30건의 매물이 조회되며 전체 매물이 하단에서 내려받기 후 엑셀파일로 확인이 가능합니다."></i>
							</h4>
						</div>
						<table class="table table-bordered m-0">
							<colgroup>
								<col width="*">
								<col width="10%">
								<col width="8%">
								<col width="10%">
								<col width="10%">
								<col width="10%">
								<col width="9%">
								<col width="9%">
								<col width="9%">
								<col width="12%">
							</colgroup>
							<thead>
							<tr>
								<th class="py-2 text-center bg-light-secondary align-middle">건물명</th>
								<th class="py-2 text-center bg-light-secondary align-middle">지번</th>
								<th class="py-2 text-center bg-light-secondary align-middle">층</th>
								<th class="py-2 text-center bg-light-secondary align-middle">상가유형</th>
								<th class="py-2 text-center bg-light-secondary align-middle">계약면적<span class="font-weight-normal">(㎡)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">전용면적<span class="font-weight-normal">(㎡)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">보증금 <span class="font-weight-normal" style="margin: 5%">(만원)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">월세 <span class="font-weight-normal" style="margin:  5%">(만원)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">권리금 <span class="font-weight-normal" style="margin: 5%">(만원)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">등록일</th>
							</tr>
							</thead>
							<tbody id="tbodyBuildingComplex2"></tbody>
						</table>
					</div>	
										
					<div class="px-6 py-6 bg-white mb-4 realtran_one">
						<div class="d-flex justify-content-between">
							<h4 class="font-size-h5 mb-4">매매 실거래가 정보 (지번)</h4>
							<h4 style="font-size: 14px;"><span data-cnt-trading/>
							<i class="fa fa-question-circle icon-ms text-muted ml-1" data-toggle="tooltip" data-placement="right" title="화면에는 최대 30건의 실거래가가 조회되며 전체 실거래가가 하단에서 내려받기 후 엑셀파일로 확인이 가능합니다."></i>
							</h4>
						</div>
						<table class="table table-bordered m-0">
							<colgroup>
								<col width="11%">
								<col width="10%">
								<col width="5%">
								<col width="13%">
								<col width="20%">
								<col width="13%">
								<col width="16%">
								<col width="12%">
							</colgroup>
							<thead>
							<tr>
								<th class="py-2 text-center bg-light-secondary align-middle">건물명</th>
								<th class="py-2 text-center bg-light-secondary align-middle">번지</th>
								<th class="py-2 text-center bg-light-secondary align-middle">층</th>
								<th class="py-2 text-center bg-light-secondary align-middle">상가유형</th>
								<th class="py-2 text-center bg-light-secondary align-middle">주 용도</th>
								<th class="py-2 text-center bg-light-secondary align-middle">전용면적<span class="font-weight-normal">(㎡)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">거래금액<span class="font-weight-normal">(만원)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">계약일</th>
							</tr>
							</thead>
							<tbody id="tbodyBuildingComplex3_1"></tbody>
						</table>
					</div>
					
					<div class="px-6 py-6 bg-white mb-4 realtran_two">
						<div class="d-flex justify-content-between">
							<h4 class="font-size-h5 mb-4">매매 실거래가 정보 (동)</h4>
							<h4 style="font-size: 14px;"><span data-cnt-trading/>
							<i class="fa fa-question-circle icon-ms text-muted ml-1" data-toggle="tooltip" data-placement="right" title="화면에는 최대 30건의 실거래가가 조회되며 전체 실거래가가 하단에서 내려받기 후 엑셀파일로 확인이 가능합니다."></i>
							</h4>
						</div>
						<table class="table table-bordered m-0">
							<colgroup>
								<col width="11%">
								<col width="10%">
								<col width="5%">
								<col width="13%">
								<col width="20%">
								<col width="13%">
								<col width="16%">
								<col width="12%">
							</colgroup>
							<thead>
							<tr>
								<th class="py-2 text-center bg-light-secondary align-middle">건물명</th>
								<th class="py-2 text-center bg-light-secondary align-middle">번지</th>
								<th class="py-2 text-center bg-light-secondary align-middle">층</th>
								<th class="py-2 text-center bg-light-secondary align-middle">상가유형</th>
								<th class="py-2 text-center bg-light-secondary align-middle">주 용도</th>
								<th class="py-2 text-center bg-light-secondary align-middle">전용면적<span class="font-weight-normal">(㎡)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">거래금액<span class="font-weight-normal">(만원)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">계약일</th>
							</tr>
							</thead>
							<tbody id="tbodyBuildingComplex3"></tbody>
						</table>
					</div>		
					
					<div class="px-6 py-6 bg-white mb-4 trading_one">
						<div class="d-flex justify-content-between">
							<h4 class="font-size-h5 mb-4">매매 매물 정보 (지번)</h4>
							<h4 style="font-size: 14px;"><span data-cnt-trading/>
							<i class="fa fa-question-circle icon-ms text-muted ml-1" data-toggle="tooltip" data-placement="right" title="화면에는 최대 30건의 매물이 조회되며 전체 매물이 하단에서 내려받기 후 엑셀파일로 확인이 가능합니다."></i>
							</h4>
						</div>
						<table class="table table-bordered m-0">
							<colgroup>
								<col width="*">
								<col width="10%">
								<col width="8%">
								<col width="10%">
								<col width="10%">
								<col width="10%">
								<col width="9%">
								<col width="9%">
								<col width="9%">
								<col width="12%">
							</colgroup>
							<thead>
							<tr>
								<th class="py-2 text-center bg-light-secondary align-middle">건물명</th>
								<th class="py-2 text-center bg-light-secondary align-middle">지번</th>
								<th class="py-2 text-center bg-light-secondary align-middle">층</th>
								<th class="py-2 text-center bg-light-secondary align-middle">상가유형</th>
								<th class="py-2 text-center bg-light-secondary align-middle">계약면적<span class="font-weight-normal">(㎡)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">전용면적<span class="font-weight-normal">(㎡)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">매매가 <span class="font-weight-normal" style="margin: 10%">(만원)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">권리금 <span class="font-weight-normal" style="margin: 10%">(만원)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">수익률</th>
								<th class="py-2 text-center bg-light-secondary align-middle">등록일</th>
							</tr>
							</thead>
							<tbody id="tbodyBuildingComplex4_1"></tbody>
						</table>
					</div>
					
					<div class="px-6 py-6 bg-white mb-4 trading_two">
						<div class="d-flex justify-content-between">
							<h4 class="font-size-h5 mb-4">매매 매물 정보 (동)</h4>
							<h4 style="font-size: 14px;"><span data-cnt-trading/>
							<i class="fa fa-question-circle icon-ms text-muted ml-1" data-toggle="tooltip" data-placement="right" title="화면에는 최대 30건의 매물이 조회되며 전체 매물이 하단에서 내려받기 후 엑셀파일로 확인이 가능합니다."></i>
							</h4>
						</div>
						<table class="table table-bordered m-0">
							<colgroup>
								<col width="*">
								<col width="10%">
								<col width="8%">
								<col width="10%">
								<col width="10%">
								<col width="10%">
								<col width="9%">
								<col width="9%">
								<col width="9%">
								<col width="12%">
							</colgroup>
							<thead>
							<tr>
								<th class="py-2 text-center bg-light-secondary align-middle">건물명</th>
								<th class="py-2 text-center bg-light-secondary align-middle">지번</th>
								<th class="py-2 text-center bg-light-secondary align-middle">층</th>
								<th class="py-2 text-center bg-light-secondary align-middle">상가유형</th>
								<th class="py-2 text-center bg-light-secondary align-middle">계약면적<span class="font-weight-normal">(㎡)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">전용면적<span class="font-weight-normal">(㎡)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">매매가 <span class="font-weight-normal" style="margin: 10%">(만원)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">권리금 <span class="font-weight-normal" style="margin: 10%">(만원)</span></th>
								<th class="py-2 text-center bg-light-secondary align-middle">수익률</th>
								<th class="py-2 text-center bg-light-secondary align-middle">등록일</th>
							</tr>
							</thead>
							<tbody id="tbodyBuildingComplex4"></tbody>
						</table>
					</div>	

					<div class="px-6 py-6 bg-white mb-4 font-size-sm">
						<p class="text-center">@2020 RCS</p>
						위의 정보는 시점 기준으로 지속적으로 업데이트 하고 있으나, 변동사항 있을 수 있습니다. 공식적인 자료 등 열람하여 반드시 재확인 바랍니다.<br> RCS에서 제공된 정보를 무단으로 사용 할 수 없음을 알려드립니다.
					</div>
				</div>
				
				<div class="tab-pane fade" id="kt_tab_pane_1_2_3" role="tabpanel" aria-labelledby="kt_tab_pane_3">
				
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
						<div>
							<div id="chart_5_1"></div>
						</div>
						<div class="reference"></div>
					</div>
		
					<div class="position-relative px-6 py-6 bg-white mb-4" id="form_chart_lobz_6">
						<div class="d-flex justify-content-between align-items-center mb-2">
							<h4 class="font-size-h5">총 매출 추이</h4>
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
						<div class="d-flex justify-content-between align-items-center mb-2">
							<h4 class="font-size-h5">업종별 매출 추이</h4>
							<span>단위 : 억원</span>
						</div>
						<div class="">
							<div id="chart_lobz_5"></div>
						</div>
						<div class="reference"></div>
					</div>
					<div id="chart_11" style="display: none;"></div>
					<div class="position-relative px-6 py-6 bg-white mb-4">
						<div class="d-flex justify-content-between align-items-center mb-2">
							<h4 class="font-size-h5 mb-2">거주인구 : 성별 x 연령별</h4>
							<span>단위 : 명</span>
						</div>							
						<div class="">								
							<div id="chart_7_1"></div>
									<!--<ul class="chart_y_label">
											<li>거주인구(남)</li>
											<li>거주인구(여)</li>
											<li>직장인구(남)</li>
											<li>직장인구(여)</li>
										</ul>-->
						</div>
						<div class="reference"></div>
					</div>
		
					<div class="position-relative px-6 py-6 bg-white mb-4">
						<div class="d-flex justify-content-between align-items-center mb-2">
							<h4 class="font-size-h5 mb-2">직장인구 : 성별 x 연령별</h4>
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

					<div class="px-6 py-6 bg-white mb-4 font-size-sm">
						<p class="text-center">@2020 RCS</p>
						위의 정보는 시점 기준으로 지속적으로 업데이트 하고 있으나, 변동사항 있을 수 있습니다. 공식적인 자료 등 열람하여 반드시 재확인 바랍니다.<br> RCS에서 제공된 정보를 무단으로 사용 할 수 없음을 알려드립니다.
					</div>
				</div>
				
				<div class="tab-pane fade" id="kt_tab_pane_1_2_4" role="tabpanel" aria-labelledby="kt_tab_pane_4">
					<div id="remaxMemulList"></div>
					<div class="flex-column-auto">
						<div class="d-flex">
							<button class="btn btn-light-danger btn-square btn-lg btn-block" id="btn_remax_more" style="display:none;"><i class="flaticon2-plus"></i>매물 더 보기</button>
						</div>
					</div>
				
					<div class="px-6 py-6 bg-white mb-4 font-size-sm">
						<p class="text-center">@2020 RCS</p>
						위의 정보는 시점 기준으로 지속적으로 업데이트 하고 있으나, 변동사항 있을 수 있습니다. 공식적인 자료 등 열람하여 반드시 재확인 바랍니다.<br> RCS에서 제공된 정보를 무단으로 사용 할 수 없음을 알려드립니다.
					</div>
					
					<!-- 엑셀 다운로드용 -->
					<div style="display:none">
						<table id="tableRemax_1">
							<thead>
							<tr>
								<th>매물코드</th>
								<th>매물구분</th>
								<th>PNU코드</th>
								<th>주소</th>
								<th>번지</th>
								<th>건물명</th>
								<th>매매 층</th>
								<th>매매면적</th>
								<th>전용면적</th>
								<th>주변환경</th>
								<th>주요내용</th>
								<th>상세내용</th>
								<th>입주예정일</th>
								<th>매매가격</th>
								<th>월 관리비</th>
								<th>총 보증금</th>
								<th>월 임대료</th>
								<th>담당자 명</th>
								<th>담당자 연락처</th>
								<th>담당자 이메일</th>
								<th>리맥스 가맹점명</th>
								<th>중개법인 명칭</th>
								<th>중개법인 대표번호</th>
								<th>중개법인 주소</th>
								<th>X좌표</th>
								<th>Y좌표</th>
								<th>매물등록일자</th>
							</tr>
							</thead>
							<tbody id="tbodyTableRemax_1"></tbody>
						</table>
						<table id="tableRemax_2">
							<thead>
							<tr>
								<th>매물코드</th>
								<th>매물구분</th>
								<th>PNU코드</th>
								<th>주소</th>
								<th>번지</th>
								<th>건물명</th>
								<th>매매 층</th>
								<th>매매면적</th>
								<th>전용면적</th>
								<th>주변환경</th>
								<th>주요내용</th>
								<th>상세내용</th>
								<th>입주예정일</th>
								<th>월 임대료</th>
								<th>관리비 유형</th>
								<th>총 보증금</th>
								<th>총 관리비</th>
								<th>권리금</th>
								<th>평당 관리비</th>
								<th>담당자 명</th>
								<th>담당자 연락처</th>
								<th>담당자 이메일</th>
								<th>리맥스 가맹점명</th>
								<th>중개법인 명칭</th>
								<th>중개법인 대표번호</th>
								<th>중개법인 주소</th>
								<th>X좌표</th>
								<th>Y좌표</th>
								<th>매물등록일자</th>
							</tr>
							</thead>
							<tbody id="tbodyTableRemax_2"></tbody>
						</table>
					</div>
					<!-- // 엑셀 다운로드용 -->
				</div>
			</div>
		</div>
		<!--end::Content-->
		<!--begin::Footer-->
		<div class="flex-column-auto">
			<div class="d-flex">
				<!-- 21.01.04 수정 -->
				<!-- <button class="btn btn-danger btn-square btn-lg btn-block"><i class="flaticon2-copy"></i>복사하기</button> -->
				<button class="btn btn-danger btn-square btn-lg btn-block mt-0" data-btn-export="excel"><i class="flaticon-download"></i>내려받기</button>
			</div>
		</div>
		<!--end::Footer -->
	</div>
	<!-- end::임대 / 매매 / 실거래 -->

	<!-- 분양  -->
	<div id="mapPannel2" class="map-pannel-sale position-fixed w-800px pb-0 d-none flex-column border map-pannel bg-white">
		<div class="position-absolute map-pannel-close" id="mapPannel2Close">
			<button class="btn btn-square btn-outline-secondary pl-5 pr-4 py-5 bg-white"><i class="flaticon2-cross text-dark"></i></button>
		</div>
		<!--begin::Content-->
		<div class="flex-column-fluid scroll ps bg-light-secondary" data-scroll="true" data-height="600" style="height:600px">
			<!--end::Header-->
			<!--begin::Header-->
			<div class="d-flex align-items-center justify-content-between bg-white pt-6 pb-4 px-6 flex-column-auto">
				<div class="pb-3">
					<h3 class="font-size-h3 text-dark mb-1" id="q_위치">-</h3>
					<span class="font-size-lg" id="q_사업명">-</span>
				</div>
				<div class="mt-n1" style="display: none;">
					<!-- 즐겨찾기 전 버튼 -->
					<button class="btn btn-outline-secondary pl-2 pr-1 py-2" data-btn-favorite><i class="flaticon-star"></i></button>
					<!-- 즐겨찾기 후 버튼 -->
					<!-- <button class="btn btn-danger pl-2 pr-1 py-2" data-toggle="modal" data-target="#favModal"><i class="flaticon-star text-white"></i></button> -->
				</div>
			</div>
			<div class="d-flex justify-content-between bg-white">
				<div class="basic-info">
					<h4 class="font-size-h5 mb-4">기본정보</h4>
					<ul class="">
						<li>
							<label>분양일</label>
							<strong id="q_분양일">-</strong>
						</li>
						<li>
							<label>입주일</label>
							<strong id="q_입주일">-</strong>
						</li>
						<li>
							<label>점포 수(상가)</label>
							<strong id="q_점포수">-</strong>
						</li>
					</ul>
				</div>
				<div class="px-6 bg-white mb-4 sales_img">
					<h4 class="font-size-h5 mb-4">평면도 및 조감도</h4>
					<div class="d-flex">
						<div class="border h-130px w-180px d-flex align-items-center justify-content-center"><img id="img_src" width="180" height="130" alt=""></div>
						<div class="border h-130px w-180px d-flex align-items-center justify-content-center position-relative ml-1 cursor-pointer" data-toggle="modal" data-target="#exampleModal">
							<img id="img_src2" width="180" height="130" alt="">
							<div class="d-flex justify-content-center align-items-center bg-dark-o-50 position-absolute w-100 h-100">
								<span id="img_length" class="text-white font-size-h1 font-weight-bold">0</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<ul class="nav nav-tabs nav-tabs-line nav-justified nav-tabs-line-2x nav-tabs-line-danger border-top bg-white sticky">
				<li class="nav-item border-right">
					<a class="nav-link active justify-content-center m-0 font-size-h6 kt_tab_pane_1_1_1 tab_content_show" data-toggle="tab" href="#kt_tab_pane_1_1_1">개요</a>
				</li>
				<li class="nav-item border-right">
					<a class="nav-link justify-content-center m-0 font-size-h6 tab_content_show" data-toggle="tab" href="#kt_tab_pane_1_1_2">분양가</a>
				</li>
				<li class="nav-item">
					<a class="nav-link justify-content-center m-0 font-size-h6 tab_content_show" data-toggle="tab" href="#kt_tab_pane_1_1_3">상권분석</a>
				</li>
			</ul>
			<!--end::Header-->

			<!-- S: 21.01.04 tab컨텐츠 추가  -->
			<div class="tab-content" id="myTabContent1">
				<div class="tab-pane fade show active" id="kt_tab_pane_1_1_1" role="tabpanel" aria-labelledby="kt_tab_pane_1">
					<div class="px-6 py-6 bg-white mb-4">
						<h4 class="font-size-h5 mb-4">기본정보</h4>
						<table class="table table-bordered m-0">
							<colgroup>
								<col style="width:120px">
								<col style="width:auto">
							</colgroup>
							<tbody>
								<tr>
									<td class="bg-light-secondary py-2">상가명</td>
									<td class="py-2" id="a_상가명">-</td>
								</tr>
								<tr>
									<td class="bg-light-secondary py-2">주용도</td>
									<td class="py-2" id="a_주용도">-</td>
								</tr>									
								<tr>
									<td class="bg-light-secondary py-2">대지위치</td>
									<td class="py-2" id="a_위치">-</td>
								</tr>
								<tr>
									<td class="bg-light-secondary py-2">대지면적</td>
									<td class="py-2" id="a_대지면적">-</td>
								</tr>
								<tr>
									<td class="bg-light-secondary py-2">연면적</td>
									<td class="py-2" id="a_연면적">-</td>
								</tr>
								<tr>
									<td class="bg-light-secondary py-2">건축규모</td>
									<td class="py-2" id="a_건축규모">-</td>
								</tr>
								<tr>
									<td class="bg-light-secondary py-2">건페/용적율</td>
									<td class="py-2" id="a_건폐율">-</td>
								</tr>
								<tr>
									<td class="bg-light-secondary py-2">주차장/승강기</td>
									<td class="py-2" id="a_주차장">-</td>
								</tr>
								<tr>
									<td class="bg-light-secondary py-2">시행사</td>
									<td class="py-2" id="a_시행사">-</td>
								</tr>									
							</tbody>
						</table>
					</div>
					<div class="px-6 py-6 bg-white mb-4">
						<div class="d-flex justify-content-between">
							<h4 class="font-size-h5 mb-4">상가면적</h4>
						</div>
						<table class="table table-bordered m-0">
							<colgroup>
								<col style="width:20%">
								<col style="width:25%">
								<col style="width:25%">
								<col style="width:25%">
							</colgroup>
							<thead>
								<tr>
									<th class="py-2 text-center bg-light-secondary align-middle">구분</th>
									<th class="py-2 text-center bg-light-secondary align-middle">전용면적</th>
									<th class="py-2 text-center bg-light-secondary align-middle">계약면적</th>
									<th class="py-2 text-center bg-light-secondary align-middle">전용율</th>
								</tr>
							</thead>
							<tbody id="tbodyBuildingComplex7"></tbody>
						</table>
					</div>
					
					<div class="px-6 py-6 bg-white mb-4">
						<div class="d-flex justify-content-between">
							<h4 class="font-size-h5 mb-4">상가 업소 정보</h4>
						</div>
						<table class="table table-bordered m-0">
							<colgroup>
								<col width="*">
								<col width="12%">
								<col width="20%">
								<col width="22%">
								<col width="25%">
							</colgroup>
							<thead>
							<tr>
								<th class="py-2 text-center bg-light-secondary align-middle">상가업소명</th>
								<th class="py-2 text-center bg-light-secondary align-middle">층</th>
								<th class="py-2 text-center bg-light-secondary align-middle">업종 대분류</th>
								<th class="py-2 text-center bg-light-secondary align-middle">업종 중분류</th>
								<th class="py-2 text-center bg-light-secondary align-middle">업종 소분류</th>
							</tr>
							</thead>
							<tbody id="tbodyBuildingComplex5_2"></tbody>
						</table>							
					</div>
											
					<div class="px-6 py-6 bg-white mb-4 font-size-sm">
						<p class="text-center">@2020 RCS</p>
						위의 정보는 시점 기준으로 지속적으로 업데이트 하고 있으나, 변동사항 있을 수 있습니다. 공식적인 자료 등 열람하여 반드시 재확인 바랍니다.<br> RCS에서 제공된 정보를 무단으로 사용 할 수 없음을 알려드립니다.
					</div>
				</div>
				
				<div class="tab-pane fade" id="kt_tab_pane_1_1_2" role="tabpanel" aria-labelledby="kt_tab_pane_2">
					<div class="px-6 py-6 bg-white mb-4">
						<div class="d-flex justify-content-between">
							<h4 class="font-size-h5 mb-4">층 · 호별 분양가 정보</h4>
						</div>
						<table class="table table-bordered m-0">
							<thead>
								<tr>
									<th class="py-2 text-center bg-light-secondary align-middle">동</th>
									<th class="py-2 text-center bg-light-secondary align-middle">층</th>
									<th class="py-2 text-center bg-light-secondary align-middle">호</th>
									<th class="py-2 text-center bg-light-secondary align-middle">전용면적<br><span class="font-weight-normal">(㎡)</span></th>
									<th class="py-2 text-center bg-light-secondary align-middle">계약면적<br><span class="font-weight-normal">(㎡)</span></th>
									<th class="py-2 text-center bg-light-secondary align-middle">분양가<br><span class="font-weight-normal">(만원)</span></th>
									<th class="py-2 text-center bg-light-secondary align-middle">평단가<br><span class="font-weight-normal">(만원)</span></th>
									<th class="py-2 text-center bg-light-secondary align-middle">전용률</th>
									<th class="py-2 text-center bg-light-secondary align-middle">낙찰가<br><span class="font-weight-normal">(만원)</span></th>
									<th class="py-2 text-center bg-light-secondary align-middle">기타정보</th>
								</tr>
							</thead>
							<tbody id="tbodyBuildingComplex6"></tbody>
						</table>
					</div>

					<div class="px-6 py-6 bg-white mb-4 font-size-sm">
						<p class="text-center">@2020 RCS</p>
						위의 정보는 시점 기준으로 지속적으로 업데이트 하고 있으나, 변동사항 있을 수 있습니다. 공식적인 자료 등 열람하여 반드시 재확인 바랍니다.<br> RCS에서 제공된 정보를 무단으로 사용 할 수 없음을 알려드립니다.
					</div>
				</div>
				
				<div class="tab-pane fade" id="kt_tab_pane_1_1_3" role="tabpanel" aria-labelledby="kt_tab_pane_3">
					<div class="position-relative px-6 py-6 bg-white mb-4" id="form_z_chart_5_1">
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
							<div id="z_chart_5_1"></div>
						</div>
						<div class="reference"></div>
					</div>

					<div class="position-relative px-6 py-6 bg-white mb-4" id="form_z_chart_lobz_6">
						<div class="d-flex justify-content-between align-items-center mb-2">
							<h4 class="font-size-h5">총 매출 추이</h4>
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
							<div id="z_chart_lobz_6"></div>
						</div>
						<div class="reference"></div>
					</div>

					<div class="position-relative px-6 py-6 bg-white mb-4">
						<div class="d-flex justify-content-between align-items-center mb-2">
							<h4 class="font-size-h5">업종별 매출 추이</h4>
							<span>단위 : 억원</span>
						</div>
						<div class="">
							<div id="z_chart_lobz_5"></div>
						</div>
						<div class="reference"></div>
					</div>
					<div id="z_chart_11" style="display: none;"></div>
					<div class="position-relative px-6 py-6 bg-white mb-4">
						<div class="d-flex justify-content-between align-items-center mb-2">
							<h4 class="font-size-h5 mb-2">거주인구 : 성별 x 연령별</h4>
							<span>단위 : 명</span>
						</div>							
						<div class="">								
							<div id="z_chart_7_1"></div>
						</div>
						<div class="reference"></div>
					</div>

					<div class="position-relative px-6 py-6 bg-white mb-4">
						<div class="d-flex justify-content-between align-items-center mb-2">
							<h4 class="font-size-h5 mb-2">직장인구 : 성별 x 연령별</h4>
							<span>단위 : 명</span>
						</div>
						<div class="">
							<div id="z_chart_7_2"></div>
						</div>
						<div class="reference"></div>
					</div>
	
					<div class="position-relative px-6 py-6 bg-white mb-4">
						<div class="d-flex justify-content-between align-items-center mb-2">
							<h4 class="font-size-h5 mb-2">유동인구 : 성별 x 연령별</h4>
							<span>단위 : 명</span>
						</div>
						<div class="">
							<div id="z_chart_7_3"></div>
						</div>
						<div class="reference"></div>
					</div>
					
					<div class="position-relative px-6 py-6 bg-white mb-4">
						<div class="d-flex justify-content-between align-items-center mb-2">
							<h4 class="font-size-h5 m-0">유동인구 : 요일 x 시간대별</h4>
							<span>단위 : 명</span>
						</div>
						<div class="">
							<div id="z_chart_pop_flow_time"></div>
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
		<!-- E: 21.01.04 tab컨텐츠 추가 -->
		<!--end::Content-->
		<!--begin::Footer-->
		<div class="flex-column-auto">
			<div class="d-flex">
				<!-- 21.01.04 삭제 -->
				<!-- <button class="btn btn-danger btn-square btn-lg btn-block"><i class="flaticon2-copy"></i>복사하기</button> -->
				<button class="btn btn-danger btn-square btn-lg btn-block mt-0" data-btn-export="excel"><i class="flaticon-download"></i>내려받기</button>
			</div>
		</div>
	</div>
	<!--end::Footer -->
	<!-- end::분양  -->
		
	<!-- Modal -->
	<div class="modal fade" id="exampleModal"  data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered modal-lg">
			<div class="modal-content">
				<div class="modal-header">
				<h5 class="modal-title" id="exampleModalLabel">조감도사진</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><i class="flaticon2-cross text-dark"></i></button>
				</div>
				<div id="owl_slide" class="modal-body p-0">
					<div class="owl-carousel owl-theme">
<!-- 							<div class="item"><img src="/resources/common/custom/media/stock-600x400/img-1.jpg" alt=""></div>
						<div class="item"><img src="/resources/common/custom/media/stock-600x400/img-2.jpg" alt=""></div>
						<div class="item"><img src="/resources/common/custom/media/stock-600x400/img-3.jpg" alt=""></div> -->
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- end::Modal -->
		
	<div class="modal fade" id="favModal" tabindex="-1" aria-labelledby="favModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered ">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="favModalLabel">즐겨찾기 등록</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<i aria-hidden="true" class="ki ki-close"></i>
					</button>
				</div>
				<div class="modal-body">
					<table class="table m-0">
						<colgroup>
							<col style="width:25%" />
							<col style="width:75%" />
						</colgroup>
						<tbody>
							<tr>
								<th class="border-0">
									<label class=""><span class="d-block font-size-lg font-weight-bold mt-3">저장할 제목</span></label>
								</th>
								<td class="border-0">
									<input class="form-control border border-secondary rounded-sm" type="text" value="" placeholder="" name="즐겨찾기_제목" required aria-discribedby="validation_즐겨찾기_제목">
									<div id="validation_즐겨찾기_제목" class="invalid-feedback">
										제목을 입력 해주세요
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="modal-footer justify-content-center">
					<button type="reset" class="btn btn-danger btn-lg mr-2 font-weight-bold px-11" data-btn-save-favorite>확인</button>
					<button type="reset" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold" data-dismiss="modal" aria-label="Close">취소</button>
				</div>
			</div>
		</div>
	</div>

<%@ include file="/WEB-INF/view/admin/APPS/gis/tmplBuildingMapDtl.jsp"%>