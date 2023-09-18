<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


<link type="text/css" rel="stylesheet" href="/resources/common/core/3rd_extends/leaflet.draw/leaflet.draw-src.css" />


<!--begin::Entry-->
<div class="d-flex flex-column-fluid">
	<!--begin::Container-->
	<div class="container-fluid p-0 position-relative">

		<!--begin::Map-->
		<div id="map" style="width: 100%; height: 100%;"></div>

		<!--begin::block popup-->
<!-- 		<div class="position-absolute map-info-popup cursor-pointer" id="mapBlock1"> -->
<!-- 			<div class="border map-block"></div> -->
<!-- 		</div> -->
		<!--end::block popup-->
		<!--begin::Row address search-->
		<div class="position-absolute w-100" style="top: 0; left: 0;">
			<div class="text-center mt-10">
				<!--begin::Address search-->
				<div class="dropdown d-inline-block">
					<!--begin::Toggle-->
					<div class="" data-offset="10px,0px" id="btnSearchAddr">
						<button class="btn btn-pill border border-info btn-dropdown ps mb-4 p-0 bg-white" aria-expanded="true">
							<span class="d-inline-block pl-4 pr-3 font-size-lg text-dark" data-today="YYYY.MM.DD"></span>
							<span class="d-inline-block bg-info font-size-lg text-white px-4 pt-2 pb-3"><i class="flaticon2-pin text-white mr-1"></i> <span data-addr-sido></span> <i class="ki ki-arrow-next icon-sm"></i> <span data-addr-sgg></span> <i class="ki ki-arrow-next icon-sm"></i> <span data-addr-dong></span> <i class="flaticon2-down text-white icon-sm ml-3"></i></span>
						</button>
					</div>
					<!--end::Toggle-->
					<!--begin::Dropdown-->
					<div class="dropdown-menu p-0 m-0 dropdown-menu-xl rounded-0 border dropdown-menu-center" id="divSearchAddr" style="display: none;">
						<div class="font-size-lg font-dark px-6 py-4 border-bottom"><span data-addr-sido></span> <i class="ki ki-arrow-next icon-sm"></i> <span data-addr-sgg></span> <i class="ki ki-arrow-next icon-sm"></i> <span data-addr-dong></span></div>
						<div class="row no-gutters" id="addrWrapper">
							<div class="col scroll ps border-right" data-scroll="true" data-height="300" data-mobile-height="200" style="height:300px">
								<ul class="nav flex-column nav-light-danger nav-address nav-pills">
								</ul>
							</div>
							<div class="col scroll ps border-right" data-scroll="true" data-height="300" data-mobile-height="200" style="height:300px">
								<ul class="nav flex-column nav-light-danger nav-address nav-pills">
									<li class="nav-item m-0 all-item">
										<a href="javascript:;" class="nav-link rounded-0" data-toggle="pill" data-list-addr-sgg="">전체</a>
									</li>
								</ul>
							</div>
							<div class="col scroll ps" data-scroll="true" data-height="300" data-mobile-height="200" style="height:300px">
								<ul class="nav flex-column nav-light-danger nav-address nav-pills">
									<li class="nav-item m-0 all-item">
										<a href="javascript:;" class="nav-link rounded-0" data-toggle="pill" data-list-addr-dong="">전체</a>
									</li>
								</ul>
							</div>
						</div>
						<div class="text-center px-6 py-4 border-top">
							<button class="btn btn-danger btn-sm mr-2 rounded-0 btnSearchAddrClose">검색</button>
							<button class="btn btn-outline-secondary btn-sm rounded-0 btnSearchAddrClose">취소</button>
						</div>
					</div>
					<!--end::Dropdown-->
				</div>
				<!--end::Address search-->
			</div>
		</div>
		<!--end::Row address search-->
		<!--begin::block popup -->
		<div class="position-absolute w-100 block-layer">
			<div class="text-center">
				<button class="btn btn-pill border border-secondary px-3 bg-white" aria-expanded="true" id="btnBlock">
					<div class="d-flex align-items-center">
						<span class="d-inline-block font-size-lg label label-xl label-secondary pt-2" data-cnt-square>0</span>
						<span data-cnt-text="empty">
							<span class="d-inline-block font-size-lg font-weight-bold px-3">선택된 블럭이 없습니다.</span>
						</span>
						<span data-cnt-text="selected" style="display: none;">
							<span class="d-inline-block font-size-lg font-weight-bold px-3">선택한 블럭의 상권 분석보기</span>
							<i class="la la-refresh font-size-h3"></i>
						</span>
					</div>
				</button>
			</div>
		</div>
		<!--end::block popup -->
		<!--begin map search-->
		<div class="position-absolute map-search-layer" id="mapSearchLayer">
			<div class="border bg-white px-6 pt-6 pb-4 position-relative">
				<div class="map-search-wrap d-flex align-items-center px-4 py-0">
					<img src="/resources/common/custom/images/svg/map/ic-search.svg" alt="">
					<input type="text" class="form-control border-0 font-size-h5" placeholder="지역명을 검색해 주세요" data-addr-search-text>
					<a href="javascript:;" data-btn-clear-addr><img src="/resources/common/custom/images/svg/map/ic-delete.svg" alt="검색삭제"></a>
				</div>
			<!-- 
				<div class="d-flex align-items-center justify-content-center pt-4">
					<img src="/resources/common/custom/images/svg/map/ic-position.svg" alt="">
					<span class="font-size-h4 ml-2">서울시 강남구 역삼동</span>
				</div>
			-->
			</div>
		</div>
		<!--end map search-->
		<!--begin:: Search Result -->
		<div class="position-absolute border bg-white map-search-layer" id="mapSrcResult" style="display: none;">
			<div class="position-absolute map-pannel-close" id="mapSrcClose">
				<button class="btn btn-square btn-outline-secondary pl-5 pr-4 py-5 bg-white"><i class="flaticon2-cross text-dark"></i></button>
			</div>
			<div class="px-6 pt-6 pb-4 position-relative">
				<div class="map-search-wrap d-flex align-items-center px-4 py-0">
					<img src="/resources/common/custom/images/svg/map/ic-search.svg" alt="">
					<input type="text" class="form-control border-0 font-size-h5" value="" placeholder="지역명을 검색해 주세요" data-addr-search-text>
					<a href="javascript:;" data-btn-clear-addr><img src="/resources/common/custom/images/svg/map/ic-delete.svg" alt="검색삭제"></a>
				</div>
			</div>
			<div class="px-6">
				<span class="font-size-lg text-muted">검색결과</span><span class="font-size-lg"> : <span data-search-result-text></span></span>
			</div>
			<ul class="nav nav-tabs nav-tabs-line nav-justified nav-tabs-line-2x nav-tabs-line-danger bg-white">
				<li class="nav-item">
					<a class="nav-link active justify-content-center m-0 font-size-h6" data-toggle="tab" href="#kt_tab_pane_4">전체 (<span data-cnt="addrSearchResultAll">0</span>)</a>
				</li>
				<li class="nav-item">
					<a class="nav-link justify-content-center m-0 font-size-h6" data-toggle="tab" href="#kt_tab_pane_5">주소 (<span data-cnt="addrSearchResultAddr">0</span>)</a>
				</li>
				<li class="nav-item">
					<a class="nav-link justify-content-center m-0 font-size-h6" data-toggle="tab" href="#kt_tab_pane_6">장소 (<span data-cnt="addrSearchResultPlace">0</span>)</a>
				</li>
			</ul>
			<div class="tab-content ps scroll" data-scroll="true" data-height="500" data-mobile-height="300" style="height:500px" id="myTabContent2">
				<div class="tab-pane fade show active" id="kt_tab_pane_4" role="tabpanel" aria-labelledby="kt_tab_pane_4">
				</div>
				<div class="tab-pane fade" id="kt_tab_pane_5" role="tabpanel" aria-labelledby="kt_tab_pane_5">
				</div>
				<div class="tab-pane fade" id="kt_tab_pane_6" role="tabpanel" aria-labelledby="kt_tab_pane_6">
				</div>
			</div>
		</div>
		<!--end:: Search Result -->
		<!--begin::Tool Group-->
		<div class="tool-group">
			<div class="map-type-container">
				<button type="button" class="btn-map d-block" id="btnMapType1">일반</button>
				<div class="map-type-layer" id="mapTypeLayer1" style="display:none">
					<div class="d-flex">
						<button type="button" class="btn-map border-right-0 px-0 active btnMapType1Close">일반</button>
						<button type="button" class="btn-map border-right-0 px-0 btnMapType1Close">부동산</button>
						<button type="button" class="btn-map border-right-0 px-0 btnMapType1Close">위성</button>
					</div>
				</div>
			</div>
			<div class="map-type-container mt-3">
				<button type="button" class="btn-map d-block px-0" id="btnMapType2">지적</button>
				<div class="map-type-layer" id="mapTypeLayer2" style="display:none">
					<div class="d-flex">
						<button type="button" class="btn-map border-right-0 px-0 active btnMapType2Close">지적</button>
						<button type="button" class="btn-map border-right-0 px-0 btnMapType2Close">개발</button>
						<button type="button" class="btn-map border-right-0 px-0 btnMapType2Close">용도</button>
						<button type="button" class="btn-map px-0 btnMapType2Close">기폭도</button>
					</div>
				</div>
			</div>
			<div class="map-type-container mt-3">
				<button type="button" class="btn-map d-block">편의시설</button>
				<div class="map-type-layer" style="display:none">
					<a href="#" class="active">지적</a>
					<a href="#" class="">개발</a>
					<a href="#" class="">용도</a>
					<a href="#" class="">기폭도</a>
				</div>
			</div>
			<div class="tool-measurement-button mt-3 mb-3">
				<button type="button" class="btn-map d-block">상권</button>
			</div>
			<div class="tool-measurement-button mt-3 mb-3">
				<button type="button" class="btn-map d-block">법례</button>
			</div>
			<div class="tool-measurement-button mt-3 mb-3">
				<button type="button" class="btn-map d-block btn-measure">거리</button>
			</div>
			<div class="tool-measurement-button mt-3 mb-3">
				<button type="button" class="btn-map d-block" onclick="outputAreaMap.fnDrawPolygonAdd();">추가</button>
			</div>
			<div class="tool-measurement-button mt-3 mb-3">
				<button type="button" class="btn-map d-block" onclick="outputAreaMap.fnDrawPolygonDelete();">삭제</button>
			</div>
			<button type="button" class="btn-map d-block btn-zoom-in border-bottom-0"><i class="ki ki-plus text-dark"></i></button>
			<button type="button" class="btn-map d-block btn-zoom-out border-top-secondary"><i class="ki ki-minus text-dark"></i></button>
		</div>
		<!--end::Tool Group-->
		<!--end::Map-->
	</div>
	<!--end::Container-->
</div>
<!--end::Entry-->


		<!--begin::Favorite Panel-->
		<!-- Button trigger modal -->
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
								<col style="width:20%" />
								<col style="width:80%" />
							</colgroup>
							<tbody>
								<tr>
									<th class="border-0">
										<label class=""><span class="d-block font-size-lg font-weight-bold mt-3">저장할제목</span></label>
									</th>
									<td class="border-0">
										<input class="form-control border border-secondary rounded-sm" type="text" value="" placeholder="">
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="modal-footer justify-content-center">
						<button type="reset" class="btn btn-danger btn-lg mr-2 font-weight-bold px-11">확인</button>
						<button type="reset" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold" data-dismiss="modal" aria-label="Close">취소</button>
					</div>
				</div>
			</div>
		</div>
		<!--end::Favorite Panel-->
		<!--begin::Detail Panel-->
		<div id="mapBlockPanel" class="position-fixed w-400px pb-0 d-none flex-column border map-pannel bg-white">
			<div class="position-absolute map-pannel-close" id="mapBlockClose">
				<button class="btn btn-square btn-outline-secondary pl-5 pr-4 py-5 bg-white"><i class="flaticon2-cross text-dark"></i></button>
			</div>
			<!--begin::Content-->
			<div class="flex-column-fluid scroll ps bg-light-secondary" data-scroll="true" data-height="600" style="height:600px">
				<!--begin::Header-->
				<div class="d-flex align-items-center justify-content-between bg-white pt-6 pb-3 px-6 flex-column-auto">
					<div class="">
						<h3 class="font-size-h3 text-dark mb-1">상권분석정보</h3>
					</div>
					<div class="mt-n1">
						<!-- 즐겨찾기 전 버튼 -->
						<button class="btn btn-outline-secondary pl-2 pr-1 py-2" data-toggle="modal" data-target="#favModal"><i class="flaticon-star"></i></button>
						<!-- 즐겨찾기 후 버튼 -->
						<!-- <button class="btn btn-danger pl-2 pr-1 py-2" data-toggle="modal" data-target="#favModal"><i class="flaticon-star text-white"></i></button> -->
					</div>
				</div>
				<div class="d-flex justify-content-between align-items-center bg-white px-6 pb-8">
					<div class="">
						<span class="label label-lg label-outline-secondary rounded-0 label-inline">4개 블럭 지정</span>
					</div>
					<div class="text-muted">
						등록일: 2020.10.15<br>수정일: 2020.10.15
					</div>
				</div>
				<ul class="nav nav-tabs nav-tabs-line nav-justified nav-tabs-line-2x nav-tabs-line-danger border-top bg-white sticky">
					<li class="nav-item border-right">
						<a class="nav-link active justify-content-center m-0 font-size-h6" data-toggle="tab" href="#kt_tab_pane_1">건물정보</a>
					</li>
					<li class="nav-item border-right">
						<a class="nav-link justify-content-center m-0 font-size-h6" data-toggle="tab" href="#kt_tab_pane_2">분양정보</a>
					</li>
					<li class="nav-item">
						<a class="nav-link justify-content-center m-0 font-size-h6" data-toggle="tab" href="#kt_tab_pane_3">시세정보</a>
					</li>
				</ul>
				<!--end::Header-->
				<div class="tab-content" id="myTabContent">
					<div class="tab-pane fade show active" id="kt_tab_pane_1" role="tabpanel" aria-labelledby="kt_tab_pane_1">
						<div class="px-6 py-6 bg-white mb-4">
							<div class="d-flex justify-content-between align-items-center mb-2">
								<div class="d-flex align-items-center">
									<h4 class="font-size-h5 m-0">업종정보(업종별사업자수)</h4>
								</div>
								<span></span>
							</div>
							<div class="">
								<div id="chart_13"></div>
							</div>
						</div>
						<div class="px-6 py-6 bg-white mb-4">
							<div class="d-flex justify-content-between align-items-center mb-2">
								<div class="d-flex align-items-center">
									<h4 class="font-size-h5 m-0">인구정보</h4>
								</div>
								<span></span>
							</div>
							<h5 class="font-size-lg mb2 text-center">주거인구</h5>
							<div class="d-flex">
								<div class="w-50 mr-1">
									<div class="text-center mb-2">
										<div class="d-inline-block border rounded-xl py-2 px-4">
											세대수
										</div>
									</div>
									<div class="mb-4">
										<div id="chart_8"></div>
									</div>
								</div>
								<div class="w-50 ml-1">
									<div class="text-center mb-2">
										<div class="d-inline-block border rounded-xl py-2 px-4">
											성별/연령
										</div>
									</div>
									<div class="mb-4">
										<div id="chart_9"></div>
									</div>
								</div>
							</div>
							<h5 class="font-size-lg mb2 text-center">유동인구</h5>
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
							<h5 class="font-size-lg mb2 text-center">직장인구</h5>
							<div class="text-center mb-2">
								<div class="d-inline-block border rounded-xl py-2 px-4">
									성별
								</div>
							</div>
							<div class="mb-4">
								<div id="chart_12"></div>
							</div>
						</div>
						<div class="px-6 py-6 bg-white mb-4">
							<div class="d-flex justify-content-between align-items-center mb-4">
								<h4 class="font-size-h5">상가유형별 물량 및 비율</h4>
								<span>단위: 건, %</span>
							</div>
							<table class="table table-bordered mb-4">
								<thead>
									<tr>
										<th rowspan="2" class="py-2 text-center bg-light-secondary align-middle">구분</th>
										<th colspan="2" class="py-2 text-center bg-light-secondary">2018</th>
									</tr>
									<tr>
										<th class="py-2 text-center bg-light-secondary">물량</th>
										<th class="py-2 text-center bg-light-secondary">비율</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td class="py-2 text-center align-middle">근린</td>
										<td class="py-2 text-center">40</td>
										<td class="py-2 text-center">16%</td>
									</tr>
									<tr>
										<td class="py-2 text-center align-middle">단지내</td>
										<td class="py-2 text-center">40</td>
										<td class="py-2 text-center">16%</td>
									</tr>
									<tr>
										<td class="py-2 text-center align-middle">복합</td>
										<td class="py-2 text-center">40</td>
										<td class="py-2 text-center">16%</td>
									</tr>
									<tr>
										<td class="py-2 text-center align-middle">테마</td>
										<td class="py-2 text-center">40</td>
										<td class="py-2 text-center">16%</td>
									</tr>
									<tr>
										<td class="py-2 text-center align-middle">계</td>
										<td class="py-2 text-center">40</td>
										<td class="py-2 text-center">16%</td>
									</tr>
								</tbody>
							</table>
							<div class="">
								<div id="chart_14"></div>
							</div>
						</div>
						<div class="px-6 py-6 bg-white mb-4">
							<div class="d-flex justify-content-between align-items-center mb-4">
								<h4 class="font-size-h5">신축비율(2년내기준)</h4>
								<span>단위: 건, %, 기준일 2020.10.07</span>
							</div>
							<table class="table table-bordered mb-4">
								<thead>
									<tr>
										<th class="py-2 text-center bg-light-secondary">구분</th>
										<th class="py-2 text-center bg-light-secondary">총건물</th>
										<th class="py-2 text-center bg-light-secondary">신축</th>
										<th class="py-2 text-center bg-light-secondary">비율</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td class="py-2 text-center align-middle">상가</td>
										<td class="py-2 text-center">70</td>
										<td class="py-2 text-center">20</td>
										<td class="py-2 text-center">29%</td>
									</tr>
								</tbody>
							</table>
							<div class="">
								<div id="chart_15" class="d-flex justify-content-center"></div>
							</div>
						</div>
						<div class="px-6 py-6 bg-white mb-4">
							<div class="d-flex justify-content-between align-items-center mb-4">
								<h4 class="font-size-h5">소유자통계</h4>
								<div class="w-80px">
									<select class="form-control selectpicker">
										<option value="0">전체</option>
										<option value="1">근린상가</option>
										<option value="2">단지내상가</option>
										<option value="3">복합상가</option>
										<option value="4">테마상가</option>
										<option value="5">기타상가</option>
									</select>
								</div>
							</div>
							<table class="table table-bordered m-0">
								<thead>
									<tr>
										<th class="py-2 text-center bg-light-secondary">번호</th>
										<th class="py-2 text-center bg-light-secondary">읍면동</th>
										<th class="py-2 text-center bg-light-secondary">비율</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td class="py-2 text-center align-middle">1</td>
										<td class="py-2 text-center">00구00동</td>
										<td class="py-2 text-center">15%</td>
									</tr>
									<tr>
										<td class="py-2 text-center align-middle">1</td>
										<td class="py-2 text-center">00구00동</td>
										<td class="py-2 text-center">15%</td>
									</tr>
									<tr>
										<td class="py-2 text-center align-middle">1</td>
										<td class="py-2 text-center">00구00동</td>
										<td class="py-2 text-center">15%</td>
									</tr>
									<tr>
										<td class="py-2 text-center align-middle">1</td>
										<td class="py-2 text-center">00구00동</td>
										<td class="py-2 text-center">15%</td>
									</tr>
									<tr>
										<td class="py-2 text-center align-middle">1</td>
										<td class="py-2 text-center">00구00동</td>
										<td class="py-2 text-center">15%</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="px-6 py-6 bg-white mb-4">
							<div class="d-flex justify-content-between align-items-center mb-2">
								<div class="d-flex align-items-center">
									<h4 class="font-size-h5 m-0">매출통계</h4>
								</div>
								<span>단위 : 천원</span>
							</div>
							<div class="text-center mb-2">
								<div class="d-inline-block border rounded-xl py-2 px-4">
									업종별 월평균
								</div>
							</div>
							<div class="mb-4">
								<div id="chart_2"></div>
							</div>
							<div class="text-center mb-2">
								<div class="d-inline-block border rounded-xl py-2 px-4">
									년도별총매출
								</div>
							</div>
							<div class="mb-4">
								<div id="chart_3"></div>
							</div>
							<div class="d-flex">
								<div class="w-50 mr-1">
									<div class="text-center mb-2">
										<div class="d-inline-block border rounded-xl py-2 px-4">
											성별
										</div>
									</div>
									<div class="mb-4">
										<div id="chart_4"></div>
									</div>
								</div>
								<div class="w-50 ml-1">
									<div class="text-center mb-2">
										<div class="d-inline-block border rounded-xl py-2 px-4">
											연령
										</div>
									</div>
									<div class="mb-4">
										<div id="chart_5"></div>
									</div>
								</div>
							</div>
							<div class="d-flex">
								<div class="w-50 mr-1">
									<div class="text-center mb-2">
										<div class="d-inline-block border rounded-xl py-2 px-4">
											시간별
										</div>
									</div>
									<div class="mb-4">
										<div id="chart_6"></div>
									</div>
								</div>
								<div class="w-50 ml-1">
									<div class="text-center mb-2">
										<div class="d-inline-block border rounded-xl py-2 px-4">
											요일별
										</div>
									</div>
									<div class="mb-4">
										<div id="chart_7"></div>
									</div>
								</div>
							</div>
						</div>
						<div class="px-6 py-6 bg-white mb-4 font-size-sm">
							<p class="text-center">@2020 MABS</p>
							위의 정보는 시점 기준으로 지속적으로 업데이트 하고 있으나, 변동사항 있을 수 있습니다. 공식적인 자료 등 열람하여 반드시 재확인 바랍니다.<br> MABS에서 제공된 정보를무단으로 사용 할 수 없을 알려드립니다
						</div>
					</div>
					<div class="tab-pane fade" id="kt_tab_pane_2" role="tabpanel" aria-labelledby="kt_tab_pane_2">
						<div class="px-6 py-6 bg-white mb-4">
							<div class="d-flex justify-content-between align-items-center mb-2">
								<h4 class="font-size-h5 m-0">분양정보(평당분양가)</h4>
								<div class="w-80px">
									<select class="form-control selectpicker">
										<option value="1">월간</option>
										<option value="2">분기</option>
									</select>
								</div>
							</div>
							<div class="mb-4">
								<div id="chart_1"></div>
							</div>
							<div class="text-right mb-1">단위 : 천원/㎡</div>
							<table class="table table-bordered m-0">
								<thead>
									<tr>
										<th class="py-2 text-center bg-light-secondary align-middle">구분</th>
										<th class="py-2 text-center bg-light-secondary">60㎡<br>이하</th>
										<th class="py-2 text-center bg-light-secondary">85㎡<br>이하</th>
										<th class="py-2 text-center bg-light-secondary">102㎡<br>이하</th>
										<th class="py-2 text-center bg-light-secondary">102㎡<br>초과</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td class="py-2 text-center align-middle bg-light-secondary">2020년<br>1분기</td>
										<td class="py-2 text-center align-middle">8,274</td>
										<td class="py-2 text-center align-middle">8,049</td>
										<td class="py-2 text-center align-middle">9,938</td>
										<td class="py-2 text-center align-middle">9,938</td>
									</tr>
									<tr>
										<td class="py-2 text-center align-middle bg-light-secondary">2020년<br>2분기</td>
										<td class="py-2 text-center align-middle">8,274</td>
										<td class="py-2 text-center align-middle">8,049</td>
										<td class="py-2 text-center align-middle">9,938</td>
										<td class="py-2 text-center align-middle">9,938</td>
									</tr>
								</tbody>
							</table>
						</div>	
						<div class="px-6 py-6 bg-white mb-4">
							<div class="d-flex justify-content-between">
								<h4 class="font-size-h5 mb-4">주변건물정보</h4>
								<span>단위 : 천원</span>
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
										<th class="py-2 text-center bg-light-secondary align-middle">구분<br>상가종류<br>등록일</th>
										<th class="py-2 text-center bg-light-secondary align-middle">주소</th>
										<th class="py-2 text-center bg-light-secondary align-middle">분양가<br>또는<br>시세가</th>
										<th class="py-2 text-center bg-light-secondary align-middle">현입점<br>업종</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td class="py-2 text-center align-middle bg-light-secondary">[분양]<br>근린상가<br>2020.06.01</td>
										<td class="py-2 text-center align-middle">서울특별시 중구 만리동 00번지</td>
										<td class="py-2 text-center align-middle">8,500</td>
										<td class="py-2 text-center align-middle">오르빌</td>
									</tr>
									<tr>
										<td class="py-2 text-center align-middle bg-light-secondary">[분양]<br>근린상가<br>2020.06.01</td>
										<td class="py-2 text-center align-middle">서울특별시 중구 만리동 00번지</td>
										<td class="py-2 text-center align-middle">8,500</td>
										<td class="py-2 text-center align-middle">오르빌</td>
									</tr>
									<tr>
										<td class="py-2 text-center align-middle bg-light-secondary">[분양]<br>근린상가<br>2020.06.01</td>
										<td class="py-2 text-center align-middle">서울특별시 중구 만리동 00번지</td>
										<td class="py-2 text-center align-middle">8,500</td>
										<td class="py-2 text-center align-middle">오르빌</td>
									</tr>
								</tbody>
							</table>
							<div class="text-muted pt-2">* 클릭하시면 상세정보를 보실 수 있습니다.</div>
						</div>
						<div class="px-6 py-6 bg-white mb-4 font-size-sm">
							<p class="text-center">@2020 MABS</p>
							위의 정보는 시점 기준으로 지속적으로 업데이트 하고 있으나, 변동사항 있을 수 있습니다. 공식적인 자료 등 열람하여 반드시 재확인 바랍니다.<br> MABS에서 제공된 정보를무단으로 사용 할 수 없을 알려드립니다
						</div>
					</div>
					<div class="tab-pane fade" id="kt_tab_pane_3" role="tabpanel" aria-labelledby="kt_tab_pane_3">
						<div class="px-6 py-6 bg-white mb-4">
							<div class="d-flex justify-content-between align-items-center mb-2">
								<h4 class="font-size-h5 m-0">통계정보(평당분양가)</h4>
								<div class="w-80px">
									<select class="form-control selectpicker">
										<option value="0">전체</option>
										<option value="1">월간</option>
										<option value="2">연간</option>
									</select>
								</div>
							</div>
							<div class="mb-4">
								<div id="chart_16"></div>
							</div>
							<div class="text-right mb-1">단위 : 천원/㎡</div>
							<table class="table table-bordered m-0">
								<thead>
									<tr>
										<th class="py-2 text-center bg-light-secondary align-middle">시점</th>
										<th class="py-2 text-center bg-light-secondary align-middle">층</th>
										<th class="py-2 text-center bg-light-secondary align-middle">면적<br>(3.3㎡)</th>
										<th class="py-2 text-center bg-light-secondary align-middle">금액</th>
										<th class="py-2 text-center bg-light-secondary align-middle">3.3㎡<br>단가</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td class="py-2 text-center align-middle bg-light-secondary">2020년<br>04월</td>
										<td class="py-2 text-center align-middle">2층</td>
										<td class="py-2 text-center align-middle">42.53</td>
										<td class="py-2 text-center align-middle">690,000</td>
										<td class="py-2 text-center align-middle">16,223,270</td>
									</tr>
									<tr>
										<td class="py-2 text-center align-middle bg-light-secondary">2020년<br>04월</td>
										<td class="py-2 text-center align-middle">2층</td>
										<td class="py-2 text-center align-middle">42.53</td>
										<td class="py-2 text-center align-middle">690,000</td>
										<td class="py-2 text-center align-middle">16,223,270</td>
									</tr>
									<tr>
										<td class="py-2 text-center align-middle bg-light-secondary">2020년<br>04월</td>
										<td class="py-2 text-center align-middle">2층</td>
										<td class="py-2 text-center align-middle">42.53</td>
										<td class="py-2 text-center align-middle">690,000</td>
										<td class="py-2 text-center align-middle">16,223,270</td>
									</tr>
									<tr>
										<td class="py-2 text-center align-middle bg-light-secondary">2020년<br>04월</td>
										<td class="py-2 text-center align-middle">2층</td>
										<td class="py-2 text-center align-middle">42.53</td>
										<td class="py-2 text-center align-middle">690,000</td>
										<td class="py-2 text-center align-middle">16,223,270</td>
									</tr>
								</tbody>
							</table>
						</div>	
						<div class="px-6 py-6 bg-white mb-4">
							<div class="d-flex justify-content-between">
								<h4 class="font-size-h5 mb-4">주변건물정보</h4>
								<span>단위 : 천원</span>
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
										<th class="py-2 text-center bg-light-secondary align-middle">구분<br>상가종류<br>등록일</th>
										<th class="py-2 text-center bg-light-secondary align-middle">주소</th>
										<th class="py-2 text-center bg-light-secondary align-middle">분양가<br>또는<br>시세가</th>
										<th class="py-2 text-center bg-light-secondary align-middle">현입점<br>업종</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td class="py-2 text-center align-middle bg-light-secondary">[분양]<br>근린상가<br>2020.06.01</td>
										<td class="py-2 text-center align-middle">서울특별시 중구 만리동 00번지</td>
										<td class="py-2 text-center align-middle">8,500</td>
										<td class="py-2 text-center align-middle">오르빌</td>
									</tr>
									<tr>
										<td class="py-2 text-center align-middle bg-light-secondary">[분양]<br>근린상가<br>2020.06.01</td>
										<td class="py-2 text-center align-middle">서울특별시 중구 만리동 00번지</td>
										<td class="py-2 text-center align-middle">8,500</td>
										<td class="py-2 text-center align-middle">오르빌</td>
									</tr>
									<tr>
										<td class="py-2 text-center align-middle bg-light-secondary">[분양]<br>근린상가<br>2020.06.01</td>
										<td class="py-2 text-center align-middle">서울특별시 중구 만리동 00번지</td>
										<td class="py-2 text-center align-middle">8,500</td>
										<td class="py-2 text-center align-middle">오르빌</td>
									</tr>
								</tbody>
							</table>
							<div class="text-muted pt-2">* 클릭하시면 상세정보를 보실 수 있습니다.</div>
						</div>
						<div class="px-6 py-6 bg-white mb-4 font-size-sm">
							<p class="text-center">@2020 MABS</p>
							위의 정보는 시점 기준으로 지속적으로 업데이트 하고 있으나, 변동사항 있을 수 있습니다. 공식적인 자료 등 열람하여 반드시 재확인 바랍니다.<br> MABS에서 제공된 정보를무단으로 사용 할 수 없을 알려드립니다
						</div>
					</div>
				</div>
			</div>
			<!--end::Content-->
			<!--begin::Footer-->
			<div class="flex-column-auto">
				<div class="d-flex">
					<button class="btn btn-danger btn-square btn-lg btn-block"><i class="flaticon2-copy"></i>복사하기</button>
					<button class="btn btn-danger btn-square btn-lg btn-block mt-0"><i class="flaticon-download"></i>다운로드</button>
				</div>
			</div>
			<!--end::Footer -->
		</div>
		<!--end::Detail Panel-->
		<!--begin::Scrolltop-->
		<div id="kt_scrolltop_blockmap" class="scrolltop">
			<span class="svg-icon">
				<!--begin::Svg Icon | path:assets/media/svg/icons/Navigation/Up-2.svg-->
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
					<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
						<polygon points="0 0 24 0 24 24 0 24" />
						<rect fill="#000000" opacity="0.3" x="11" y="10" width="2" height="10" rx="1" />
						<path d="M6.70710678,12.7071068 C6.31658249,13.0976311 5.68341751,13.0976311 5.29289322,12.7071068 C4.90236893,12.3165825 4.90236893,11.6834175 5.29289322,11.2928932 L11.2928932,5.29289322 C11.6714722,4.91431428 12.2810586,4.90106866 12.6757246,5.26284586 L18.6757246,10.7628459 C19.0828436,11.1360383 19.1103465,11.7686056 18.7371541,12.1757246 C18.3639617,12.5828436 17.7313944,12.6103465 17.3242754,12.2371541 L12.0300757,7.38413782 L6.70710678,12.7071068 Z" fill="#000000" fill-rule="nonzero" />
					</g>
				</svg>
				<!--end::Svg Icon-->
			</span>
		</div>
		<!--end::Scrolltop-->


<%@ include file="/WEB-INF/view/admin/APPS/gis/tmplApiAddr.jsp"%>
