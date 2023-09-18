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
		<div class="position-absolute w-100 pointer-events-none" style="top: 0; left: 0;">
			<div class="text-center mt-10">
				<!--begin::Address search-->
				<div class="dropdown d-inline-block pointer-events-auto">
					<!--begin::Toggle-->
					<div class="" data-offset="10px,0px" id="btnSearchAddr">
						<button class="btn btn-pill border border-lts btn-dropdown ps mb-4 p-0 bg-white" aria-expanded="true">
<!-- 							<span class="d-inline-block pl-4 pr-3 font-size-lg text-dark" data-today="YYYY.MM.DD"></span> -->
							<span class="d-inline-block bg-lts font-size-lg text-white px-4 pt-2 pb-3"><i class="flaticon2-pin text-white mr-1"></i> <span data-addr-sido></span> <i class="ki ki-arrow-next icon-sm"></i> <span data-addr-sgg></span> <i class="ki ki-arrow-next icon-sm"></i> <span data-addr-dong></span> <i class="flaticon2-down text-white icon-sm ml-3"></i></span>
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
		<div class="position-absolute w-100 block-layer pointer-events-none">
			<div class="density" id="averageSales">
				<label>밀집도</label>
				<ul>
					<li><strong><span></span></strong> ~ 20%</li>
					<li><strong><span></span></strong> ~ 40%</li>
					<li><strong><span></span></strong> ~ 60%</li>
					<li><strong><span></span></strong> ~ 80%</li>
					<li><strong><span></span></strong> ~ 100%</li>
				</ul>
			</div>
			<div class="density" id="averageRent">
				<label>밀집도</label>
				<ul>
					<li><strong><span></span></strong> ~ 20%</li>
					<li><strong><span></span></strong> ~ 40%</li>
					<li><strong><span></span></strong> ~ 60%</li>
					<li><strong><span></span></strong> ~ 80%</li>
					<li><strong><span></span></strong> ~ 100%</li>
				</ul>
			</div>
			<div class="density" id="population">
				<label>밀집도</label>
				<ul>
					<li><strong><span></span></strong> ~ 20%</li>
					<li><strong><span></span></strong> ~ 40%</li>
					<li><strong><span></span></strong> ~ 60%</li>
					<li><strong><span></span></strong> ~ 80%</li>
					<li><strong><span></span></strong> ~ 100%</li>
				</ul>
			</div>
			<div class="density" id="sales">
				<label>밀집도</label>
				<ul>
					<li><strong><span></span></strong> ~ 20%</li>
					<li><strong><span></span></strong> ~ 40%</li>
					<li><strong><span></span></strong> ~ 60%</li>
					<li><strong><span></span></strong> ~ 80%</li>
					<li><strong><span></span></strong> ~ 100%</li>
				</ul>
			</div>
			<div class="toolbar pointer-events-auto">
<%--			
				<ul class="d-flex align-items-center justify-content-between">
					<li data-btn-gis-stat="p"><a href="javascript:;" class="averageSales">평균분양가</a></li>
					<li data-btn-gis-stat="rent"><a href="javascript:;" class="averageRent">평균임대료</a></li>
					<li data-btn-gis-stat="pop"><a href="javascript:;" class="population">인구</a></li>
					<li data-btn-gis-stat="lobz"><a href="javascript:;" class="sales">매출</a></li>
					<li data-btn-gis-stat="industry"><a href="javascript:;" class="sales">업종</a></li>
				</ul>
--%>
				<ul class="d-flex align-items-center justify-content-between">
					<li data-btn-select-block="circle">
						<a href="javascript:;" class="circleSelect">반경 선택</a>
					</li>
					<li data-btn-select-block="undo" style="display: none;">
						<a href="javascript:;" style="padding-left: 0px;"><i class="fas fa-undo"></i>&nbsp;&nbsp;&nbsp;되돌리기</a>
					</li>
					<li data-btn-select-block="polygon"><a href="javascript:;" class="polagonSelect">다각형 선택</a></li>
					<li data-btn-select-block="point" class="on"><a href="javascript:;" class="oneSelect">단일 선택</a></li>
				</ul>
				<div>
					<button class="btn btn-pill border border-secondary px-3 bg-white" aria-expanded="true" id="btnNonBlock" data-cnt-text="empty">
						<div class="d-flex align-items-center">
							<span class="d-inline-block font-size-lg label label-xl label-secondary" style="padding-top: 0.4rem" data-cnt-square>0</span>
							<span class="d-inline-block font-size-lg font-weight-bold px-3">선택된 블럭이 없습니다.</span>
						</div>
					</button>
					<button class="btn btn-pill border border-secondary px-3 bg-white" aria-expanded="true" id="btnBlock" data-cnt-text="selected" style="display:none;">
						<div class="d-flex align-items-center">
							<span class="d-inline-block font-size-lg label label-xl label-danger" style="padding-top: 0.4rem" data-cnt-square>0</span>
							<span class="d-inline-block font-size-lg font-weight-bold px-3">선택한 블럭의 상권 분석보기</span>
						</div>
					</button>
				</div> 
				<a href="javascript:;" class="gis-refresh" onclick="blockMap.fnDrawPolygonDelete(); window.event.stopPropagation();"><img src="/resources/common/custom/images/gis/gis_icon_refresh.png"></a>
			</div>
		</div>
		<!--end::block popup -->
		<!--begin map search-->
		<div class="position-absolute map-search-layer" id="mapSearchLayer">
			<ul class="nav nav-tabs nav-tabs-block-search">
				<li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#tab-search-01">지역명 검색</a></li>
				<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#tab-search-02">상권 검색</a></li>
			</ul>
			<div class="tab-content gid-block-search-tab-content">	
				<div class="tab-pane fade active show" id="tab-search-01">
					<div class="border bg-white px-6 pt-6 pb-4 position-relative">
						<div class="map-search-wrap d-flex align-items-center px-4 py-0">
							<img src="/resources/common/custom/images/svg/map/ic-search.gif" alt="">
							<input type="text" class="form-control border-0 font-size-h5" placeholder="지역명을 검색해 주세요" data-addr-search-text>
							<a href="javascript:;" data-btn-clear-addr><img src="/resources/common/custom/images/svg/map/ic-delete.svg" alt="검색삭제"></a>
						</div>
						<div class="d-flex align-items-center justify-content-center pt-4">
						</div>
						<div id="mapSrcResult" style="display: none;">
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
							<div class="tab-content ps scroll" data-scroll="true" data-height="140" data-mobile-height="140" style="height:140px" id="myTabContent2">
								<div class="tab-pane fade show active" id="kt_tab_pane_4" role="tabpanel" aria-labelledby="kt_tab_pane_4">
								</div>
								<div class="tab-pane fade" id="kt_tab_pane_5" role="tabpanel" aria-labelledby="kt_tab_pane_5">
								</div>
								<div class="tab-pane fade" id="kt_tab_pane_6" role="tabpanel" aria-labelledby="kt_tab_pane_6">
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="tab-pane fade" id="tab-search-02">
					<div class="bg-white px-6 pt-6 pb-4 position-relative">
						<div class="map-search-wrap d-flex align-items-center px-4 py-0">
							<img src="/resources/common/custom/images/svg/map/ic-search.gif" alt="">
							<input type="text" class="form-control border-0 font-size-h5" placeholder="상권을 검색해 주세요" data-bizdist-search-text>
							<a href="javascript:;" data-btn-clear-bizdist><img src="/resources/common/custom/images/svg/map/ic-delete.svg" alt="검색삭제"></a>
						</div>
						<div class="d-flex align-items-center justify-content-center pt-4">
						</div>
						<div id="mapSrcResultBizdist" style="display: none;">
							<div class="px-6">
								<span class="font-size-lg text-muted">검색결과</span><span class="font-size-lg"> : <span data-bizdist-search-result-text></span></span>
							</div>
							<div class="tab-content ps scroll" data-scroll="true" data-height="140" data-mobile-height="140" style="height:140px" id="myTabContent3">
								<div class="tab-pane fade show active" id="kt_tab_pane_2_1" role="tabpanel" aria-labelledby="kt_tab_pane_2_1">
								</div>
							</div>
						</div>
					</div>
				</div>

                <!-- 2021. 08. 18. -->
                <div class="data-items" id="wrapMapBlockVis">
                    <div class="data-items-header">
                        <span>시각화 데이터 항목</span>
                        <i class="fa fa-chevron-down"></i>
                    </div>
                    <div class="data-items-body">
                        <div class="data-items-list-group">
                            <h4>데이터 항목
                                <i class="fa fa-question-circle icon-md ml-3 tooltipCustom">
									<span class="tooltipCustom-text">
										부동산R114가 보유한 100*100 격자에 맞춰 공급 및 밀집도, 거주인구, 직장인구 등을 확인하실 수있습니다.
										<br>
										블록 선택 후 상권 분석 보기 클릭 시 우측에 블럭의 가격정보, 해당 선택 블럭의 상권 분석자료를 확인하실 수 있습니다.
										<br>
										<br>
										<img src="\resources\common\custom\images\help\help04.png"/> 
									</span>
								</i>
                            </h4>
                            <ul class="data-item-list">
                                <li data-btn-gis-stat="supply" class="on">공급(분양)</li>
                                <li data-btn-gis-stat="industry">상가업소 밀집도</li>
                                <li data-btn-gis-stat="popDwl">거주 인구</li>
                                <li data-btn-gis-stat="popWkPlc">직장 인구</li>
                                <li data-btn-gis-stat="popFlow">유동 인구</li>
                                <li data-btn-gis-stat="lobz">매출</li>
                                <li data-btn-gis-stat="rent">임대료</li>
                                <li data-btn-gis-stat="under">매매가</li>
                                <li data-btn-gis-stat="p">분양가</li>
                            </ul>
                        </div>
                    
                        <div class="data-items-timeline">
                            <%--<h4>데이터시점 <em>2018 ~ 2020</em></h4>
                            <div class="sub-section first">
                                <h5>현재시점</h5>
                                <div class="years-item">
                                    <a href="#" class="nav left"><i class="fa fa-chevron-left"></i></a>
                                    <ul>
                                        <li>
                                            <span class="radio on"></span>
                                            <em>2019<br>상반기</em>
                                        </li>
                                        <li>
                                            <span class="radio"></span>
                                            <em>2019<br>하반기</em>
                                        </li>
                                        <li>
                                            <span class="radio"></span>
                                            <em>2020<br>상반기</em>
                                        </li>
                                        <li>
                                            <span class="radio"></span>
                                            <em>2020<br>하반기</em>
                                        </li>
                                    </ul>
                                    <a href="#" class="nav right"><i class="fa fa-chevron-right"></i></a>
                                </div>
                            </div>
                            <div class="sub-section second">
                                <h5>비교시점</h5>
                                <div class="years-item">
                                    <a href="#" class="nav left"><i class="fa fa-chevron-left"></i></a>
                                    <ul>
                                        <li>
                                            <span class="radio"></span>
                                            <em>2019<br>상반기</em>
                                        </li>
                                        <li>
                                            <span class="radio"></span>
                                            <em>2019<br>하반기</em>
                                        </li>
                                        <li>
                                            <span class="radio on"></span>
                                            <em>2020<br>상반기</em>
                                        </li>
                                        <li>
                                            <span class="radio"></span>
                                            <em>2020<br>하반기</em>
                                        </li>
                                    </ul>
                                    <a href="#" class="nav right"><i class="fa fa-chevron-right"></i></a>
                                </div>
                            </div --%>
                            <div class="control" data-toggle="modal" data-btn-filter-stat="filter" data-btn-gis-statsel="supply"><i class="fas fa-sliders-h"></i> 시각화 데이터 필터 설정</div>
                        </div>
                    

                        <div class="data-items-legend" data-wrap-vis-legend style="display: none;">
                            <div class="legend">
                                <h5><span data-legend-title></span> 데이터 범례</h5>
                                <ul>
                                    <li>
                                        <span class="datanon-color"></span>
                                        <label>데이터없음</label>
                                        <strong></strong>
                                    </li>
                                    <li>
                                        <span class="thumb-color"></span>
                                        <label>&nbsp;&nbsp;0 ~ 20%</label>
                                        <strong data-grade>0 ~ 5,500만원</strong>
                                    </li>
                                    <li>
                                        <span class="thumb-color"></span>
                                        <label>21 ~ 40%</label>
                                        <strong data-grade>5,500 ~ 7,500만원</strong>
                                    </li>
                                    <li>
                                        <span class="thumb-color"></span>
                                        <label>41 ~ 60%</label>
                                        <strong data-grade>7,500 ~ 10,000만원</strong>
                                    </li>
                                    <li>
                                        <span class="thumb-color"></span>
                                        <label>61 ~ 80%</label>
                                        <strong data-grade>10,000 ~ 12,500만원</strong>
                                    </li>
                                    <li>
                                        <span class="thumb-color"></span>
                                        <label>81 ~ 100%</label>
                                        <strong data-grade>12,500 ~ 15,000만원</strong>
                                    </li>
                                </ul>
                            </div>
                            <span data-reference></span>
                        </div>
                        <button class="btn btn-square btn-lg btn-block mt-0" data-btn-run-vis>적용</button>
                    </div>
                </div>
			</div>

		</div>
        <div class="supply" id="wrapMapBlockVisSearch">
            <label>데이터 시점.</label>
            <span data-opt-time></span>
            <label data-opt-title>상가유형.</label>
            <span data-opt-checked></span>
        </div>
        <!-- //2021. 08. 18. -->
		
		<!--end map search-->
<%--		
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
--%>		
		<!--begin::Tool Group-->
		<div class="tool-group">
			<div class="map-type-container">
				<button type="button" class="btn-map d-block" id="btnMapType1">일반</button>
				<div class="map-type-layer" id="mapTypeLayer1" style="display:none">
					<div class="d-flex">
						<button type="button" id="btnMapType1_1" class="btn-map border-right-0 px-0 active btnMapType1Close" onclick="baseMapChanges(1);">일반</button>
						<button type="button" id="btnMapType1_2" class="btn-map border-right-0 px-0 btnMapType1Close" onclick="baseMapChanges(2); if ($(this).hasClass('active')) $('#btnMapType1').text('지적용도');">지적<br/>용도</button>
						<button type="button" id="btnMapType1_3" class="btn-map border-right-0 px-0 btnMapType1Close" onclick="baseMapChanges(3);">위성</button>
					</div>
				</div>
			</div>

			<div class="map-type-container mt-3">
				<button type="button" id="btnMapType2_2" class="btn-map d-block">개발</button>
			</div>

			<div class="map-type-container mt-3">
				<button type="button" id="map_plant_bt" class="btn-map d-block">편의시설</button>
				<!-- 210104 편의시설 추가  -->
				<div class="map_plant_box">
					<div class="map_plant_list_box">
						<ul class="plant_box_left" id="m_nearby2_sub1_1">
							
						</ul>
						<ul class="plant_box_right" id="m_nearby2_sub1_2">

						</ul>
					</div>
					<div id="plant_sub_depth_box">
						<div id="m_nearby2_sub2_form" class="col scroll ps " data-scroll="true" data-height="278" data-mobile-height="200" style="height:278px">
							<ul class="nav flex-column nav-light-danger nav-address nav-pills" id="m_nearby2_sub2">

							</ul>							
						</div>
						
						<div id="m_nearby2_sub3_form" class="col scroll ps " data-scroll="true" data-height="278" data-mobile-height="200" style="height:278px">
							<ul class="nav flex-column nav-light-danger nav-address nav-pills" id="m_nearby2_sub3">

							</ul>							
						</div>						
					</div>

				</div>
			</div>

			<div class="tool-measurement-button mt-3 mb-3">
				<button type="button" id="dist_b" class="btn-map d-block btn-measure" onclick="distStart();">거리</button>
			</div>

			<div class="tool-measurement-button mt-3 mb-3">
				<button type="button" class="btn-map d-block" data-btn-toggle-grid>격자</button>
			</div>

			<div class="tool-measurement-button mt-3 mb-3">
				<button type="button" class="btn-map d-block btn-toggle-bizdist">상권</button>
			</div>

			<!-- div class="tool-measurement-button mt-3 mb-3">
				<button type="button" class="btn-map d-block" data-btn-near-area>인근</button>
			</div -->

<%--
			<div class="tool-measurement-button mt-3 mb-3">
				<button type="button" class="btn-map d-block">범례</button>
			</div>
--%>
			<div class="tool-measurement-button mt-3 mb-3">
				<button type="button" class="btn-map d-block btn-measure">축척<span data-gis-zoom>0</span></button>
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
										<label class=""><span class="d-block font-size-lg font-weight-bold mt-3" style="white-space: nowrap;">저장할 제목</span></label>
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
		<!--end::Favorite Panel-->

		
		<!-- 데이터 항목 : 공급(분양) -->
		<div class="modal fade" id="modalVisSupply" tabindex="-1" aria-labelledby="favModalLabel" aria-hidden="true">
		    <div class="modal-dialog modal-dialog-centered modal-data-item">
		        <div class="modal-content">
		            <div class="modal-header">
		                <h5 class="modal-title">공급(분양) 시각화 데이터 필터 설정</h5>
		                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		                    <i aria-hidden="true" class="ki ki-close"></i>
		                </button>
		            </div>
		            <div class="modal-body">
		                <div class="filter-setting">
		                    <div class="filter-setting-top">
		                        <ul>
		                            <li>상가유형별 공급량</li>
		                        </ul>
		                    </div>
		                    <div class="filter-setting-body">
		                        <label class="total font-weight-bold"><input type="checkbox" checked="checked" name="sanggaType" value=""> 전체</label>
		                        <div class="check-wrap">
		                        </div>
		                    </div>
		                </div>
		            </div>
		            <div class="modal-footer justify-content-center">
		                <button type="reset" class="btn btn-danger btn-lg mr-2 font-weight-bold px-11" data-btn-confirm>확인</button>
		                <button type="reset" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold" data-dismiss="modal" aria-label="Close">취소</button>
		            </div>
		        </div>
		    </div>
		</div>
		<!-- 데이터 항목 : 상가업소 (업종) -->
		<div class="modal fade" id="modalVisIndustry" tabindex="-1" aria-labelledby="favModalLabel" aria-hidden="true">
		    <div class="modal-dialog modal-dialog-centered modal-data-item">
		        <div class="modal-content">
		            <div class="modal-header">
		                <h5 class="modal-title">상가업소 밀집도 시각화 데이터 필터 설정</h5>
		                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		                    <i aria-hidden="true" class="ki ki-close"></i>
		                </button>
		            </div>
		            <div class="modal-body">
		                <div class="filter-setting">
		                    <div class="filter-setting-top">
		                        <ul>
		                            <li>업소유형별 업소 수</li>
		                        </ul>
		                    </div>
		                    <div class="filter-setting-body">
		                        <label class="total font-weight-bold"><input type="checkbox" checked="checked" name="sanggaType" value=""> 전체</label>
		                        <div class="check-wrap">
		                        </div>
		                    </div>
		                </div>
		            </div>
		            <div class="modal-footer justify-content-center">
		                <button type="reset" class="btn btn-danger btn-lg mr-2 font-weight-bold px-11" data-btn-confirm>확인</button>
		                <button type="reset" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold" data-dismiss="modal" aria-label="Close">취소</button>
		            </div>
		        </div>
		    </div>
		</div>
		<!-- 데이터 항목 : 거주인구 -->
		<div class="modal fade" id="modalVisPopDwl" tabindex="-1" aria-labelledby="favModalLabel" aria-hidden="true">
		    <div class="modal-dialog modal-dialog-centered modal-data-item">
		        <div class="modal-content">
		            <div class="modal-header">
		                <h5 class="modal-title">거주인구 시각화 데이터 필터 설정</h5>
		                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		                    <i aria-hidden="true" class="ki ki-close"></i>
		                </button>
		            </div>
		            <div class="modal-body">
		                <div class="filter-setting">
		                    <div class="filter-setting-top">
		                        <ul>
		                            <li>성/연령별 인구수</li>
		                        </ul>
		                    </div>
		                    <div class="filter-setting-body">
		                        <label class="total font-weight-bold"><input type="checkbox" checked="checked" name="genderType" value=""> 전체(남,여)</label>
		                        <div class="check-wrap">
		                            <label><input type="checkbox" name="genderType" value="남성"> 남</label>
		                            <label><input type="checkbox" name="genderType" value="여성"> 여</label>
		                        </div>
		                    </div>
		                    <div class="filter-setting-body">
		                        <label class="total font-weight-bold"><input type="checkbox" checked="checked" name="ageType" value=""> 전체(연령별)</label>
		                        <div class="check-wrap">
		                            <label><input type="checkbox" name="ageType" value="10l"> 10대 미만</label>
		                            <label><input type="checkbox" name="ageType" value="10"> 10대</label>
		                            <label><input type="checkbox" name="ageType" value="20"> 20대</label>
		                            <label><input type="checkbox" name="ageType" value="30"> 30대</label>
		                            <label><input type="checkbox" name="ageType" value="40"> 40대</label>
		                            <label><input type="checkbox" name="ageType" value="50"> 50대</label>
		                            <label><input type="checkbox" name="ageType" value="60u"> 60대 이상</label>
		                        </div>
		                    </div>
		                </div>
		            </div>
		            <div class="modal-footer justify-content-center">
		                <button type="reset" class="btn btn-danger btn-lg mr-2 font-weight-bold px-11" data-btn-confirm>확인</button>
		                <button type="reset" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold" data-dismiss="modal" aria-label="Close">취소</button>
		            </div>
		        </div>
		    </div>
		</div>
		<!-- 데이터 항목 : 직장인구 -->
		<div class="modal fade" id="modalVisPopWkPlc" tabindex="-1" aria-labelledby="favModalLabel" aria-hidden="true">
		    <div class="modal-dialog modal-dialog-centered modal-data-item">
		        <div class="modal-content">
		            <div class="modal-header">
		                <h5 class="modal-title">직장인구 시각화 데이터 필터 설정</h5>
		                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		                    <i aria-hidden="true" class="ki ki-close"></i>
		                </button>
		            </div>
		            <div class="modal-body">
		                <div class="filter-setting">
		                    <div class="filter-setting-top">
		                        <ul>
		                            <li>성/연령별 인구수</li>
		                        </ul>
		                    </div>
		                    <div class="filter-setting-body">
		                        <label class="total font-weight-bold"><input type="checkbox" checked="checked" name="genderType" value=""> 전체(남,여)</label>
		                        <div class="check-wrap">
		                            <label><input type="checkbox" name="genderType" value="남성"> 남</label>
		                            <label><input type="checkbox" name="genderType" value="여성"> 여</label>
		                        </div>
		                    </div>
		                    <div class="filter-setting-body">
		                        <label class="total font-weight-bold"><input type="checkbox" checked="checked" name="ageType" value=""> 전체(연령별)</label>
		                        <div class="check-wrap">
		                            <label><input type="checkbox" name="ageType" value="20"> 20대</label>
		                            <label><input type="checkbox" name="ageType" value="30"> 30대</label>
		                            <label><input type="checkbox" name="ageType" value="40"> 40대</label>
		                            <label><input type="checkbox" name="ageType" value="50"> 50대</label>
		                            <label><input type="checkbox" name="ageType" value="60u"> 60대 이상</label>
		                        </div>
		                    </div>
		                </div>
		            </div>
		            <div class="modal-footer justify-content-center">
		                <button type="reset" class="btn btn-danger btn-lg mr-2 font-weight-bold px-11" data-btn-confirm>확인</button>
		                <button type="reset" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold" data-dismiss="modal" aria-label="Close">취소</button>
		            </div>
		        </div>
		    </div>
		</div>
		<!-- 데이터 항목 : 유동인구 -->
		<div class="modal fade" id="modalVisPopFlow" tabindex="-1" aria-labelledby="favModalLabel" aria-hidden="true">
		    <div class="modal-dialog modal-dialog-centered modal-data-item">
		        <div class="modal-content">
		            <div class="modal-header">
		                <h5 class="modal-title">유동인구 시각화 데이터 필터 설정</h5>
		                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		                    <i aria-hidden="true" class="ki ki-close"></i>
		                </button>
		            </div>
		            <div class="modal-body">
		                <div class="filter-setting">
		                    <div class="filter-setting-top">
		                        <ul>
		                            <li>요일 X 시간대별 인구수</li>
		                        </ul>
		                    </div>
		                    <div class="filter-setting-body">
		                        <label class="total font-weight-bold"><input type="checkbox" checked="checked" name="weekdayTimeType" value=""> 주중 전체</label>
		                        <div class="check-wrap">
		                            <label><input type="checkbox" name="weekdayTimeType" value="1"> 0~8시</label>
		                            <label><input type="checkbox" name="weekdayTimeType" value="2"> 9~12시</label>
		                            <label><input type="checkbox" name="weekdayTimeType" value="3"> 13~18시</label>
		                            <label><input type="checkbox" name="weekdayTimeType" value="4"> 19~23시</label>
		                        </div>
		                        <label class="total font-weight-bold"><input type="checkbox" checked="checked" name="weekendTimeType" value=""> 주말 전체</label>
		                        <div class="check-wrap">
		                            <label><input type="checkbox" name="weekendTimeType" value="1"> 0~8시</label>
		                            <label><input type="checkbox" name="weekendTimeType" value="2"> 9~12시</label>
		                            <label><input type="checkbox" name="weekendTimeType" value="3"> 13~18시</label>
		                            <label><input type="checkbox" name="weekendTimeType" value="4"> 19~23시</label>
		                        </div>
		                    </div>
		                </div>
		            </div>
		            <div class="modal-footer justify-content-center">
		                <button type="reset" class="btn btn-danger btn-lg mr-2 font-weight-bold px-11" data-btn-confirm>확인</button>
		                <button type="reset" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold" data-dismiss="modal" aria-label="Close">취소</button>
		            </div>
		        </div>
		    </div>
		</div>
		<!-- 데이터 항목 : 매출 -->
		<div class="modal fade" id="modalVisLobz" tabindex="-1" aria-labelledby="favModalLabel" aria-hidden="true">
		    <div class="modal-dialog modal-dialog-centered modal-data-item">
		        <div class="modal-content">
		            <div class="modal-header">
		                <h5 class="modal-title">매출 시각화 데이터 필터 설정</h5>
		                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		                    <i aria-hidden="true" class="ki ki-close"></i>
		                </button>
		            </div>
		            <div class="modal-body">
		                <div class="filter-setting">
		                    <div class="filter-setting-top">
		                        <ul>
		                            <li>업종별 매출 현황</li>
		                        </ul>
		                    </div>
		                    <div class="filter-setting-body">
		                        <label class="total font-weight-bold"><input type="checkbox" checked="checked" name="sanggaType" value=""> 전체</label>
		                        <div class="check-wrap">
		                        </div>
		                        <div class="check-wrap">
		                        </div>
		                    </div>
		                </div>
		            </div>
		            <div class="modal-footer justify-content-center">
		                <button type="reset" class="btn btn-danger btn-lg mr-2 font-weight-bold px-11" data-btn-confirm>확인</button>
		                <button type="reset" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold" data-dismiss="modal" aria-label="Close">취소</button>
		            </div>
		        </div>
		    </div>
		</div>
		<!-- 데이터 항목 : 임대료 -->
		<div class="modal fade" id="modalVisRent" tabindex="-1" aria-labelledby="favModalLabel" aria-hidden="true">
		    <div class="modal-dialog modal-dialog-centered modal-data-item">
		        <div class="modal-content">
		            <div class="modal-header">
		                <h5 class="modal-title">임대료 시각화 데이터 필터 설정</h5>
		                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		                    <i aria-hidden="true" class="ki ki-close"></i>
		                </button>
		            </div>
		            <div class="modal-body">
		                <div class="filter-setting">
		                    <div class="filter-setting-top">
		                        <ul>
		                            <li>상가유형별 환산임대료</li>
		                        </ul>
		                    </div>
		                    <div class="filter-setting-body">
		                        <label class="total font-weight-bold"><input type="checkbox" checked="checked" name="sanggaType" value=""> 전체</label>
		                        <div class="check-wrap">
		                        </div>
		                    </div>
		                </div>
		            </div>
		            <div class="modal-footer justify-content-center">
		                <button type="reset" class="btn btn-danger btn-lg mr-2 font-weight-bold px-11" data-btn-confirm>확인</button>
		                <button type="reset" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold" data-dismiss="modal" aria-label="Close">취소</button>
		            </div>
		        </div>
		    </div>
		</div>
		<!-- 데이터 항목 : 매매가 -->
		<div class="modal fade" id="modalVisUnder" tabindex="-1" aria-labelledby="favModalLabel" aria-hidden="true">
		    <div class="modal-dialog modal-dialog-centered modal-data-item">
		        <div class="modal-content">
		            <div class="modal-header">
		                <h5 class="modal-title">매매가 시각화 데이터 필터 설정</h5>
		                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		                    <i aria-hidden="true" class="ki ki-close"></i>
		                </button>
		            </div>
		            <div class="modal-body">
		                <div class="filter-setting">
		                    <div class="filter-setting-top">
		                        <ul>
		                            <li>상가유형별 평균매매가</li>
		                        </ul>
		                    </div>
		                    <div class="filter-setting-body">
		                        <label class="total font-weight-bold"><input type="checkbox" checked="checked" name="sanggaType" value=""> 전체</label>
		                        <div class="check-wrap">
		                        </div>
		                    </div>
		                </div>
		            </div>
		            <div class="modal-footer justify-content-center">
		                <button type="reset" class="btn btn-danger btn-lg mr-2 font-weight-bold px-11" data-btn-confirm>확인</button>
		                <button type="reset" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold" data-dismiss="modal" aria-label="Close">취소</button>
		            </div>
		        </div>
		    </div>
		</div>
		<!-- 데이터 항목 : 분양가 -->
		<div class="modal fade" id="modalVisP" tabindex="-1" aria-labelledby="favModalLabel" aria-hidden="true">
		    <div class="modal-dialog modal-dialog-centered modal-data-item">
		        <div class="modal-content">
		            <div class="modal-header">
		                <h5 class="modal-title">분양가 시각화 데이터 필터 설정</h5>
		                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		                    <i aria-hidden="true" class="ki ki-close"></i>
		                </button>
		            </div>
		            <div class="modal-body">
		                <div class="filter-setting">
		                    <div class="filter-setting-top">
		                        <ul>
		                            <li>상가유형별 평당 분양가(전용면적)</li>
		                        </ul>
		                    </div>
		                    <div class="filter-setting-body">
		                        <label class="total font-weight-bold"><input type="checkbox" checked="checked" name="sanggaType" value=""> 전체</label>
		                        <div class="check-wrap">
		                        </div>
		                    </div>
		                </div>
		            </div>
		            <div class="modal-footer justify-content-center">
		                <button type="reset" class="btn btn-danger btn-lg mr-2 font-weight-bold px-11" data-btn-confirm>확인</button>
		                <button type="reset" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold" data-dismiss="modal" aria-label="Close">취소</button>
		            </div>
		        </div>
		    </div>
		</div>
		
		<%@ include file="/WEB-INF/view/admin/APPS/gis/blockMapDtl.jsp"%>

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

		<div class="block-number" id="wrapGisBlockDtl" style="display: none;">
		    <div class="block-number-header">
		        <h4>블럭넘버</h4>
		        <strong data-block-id></strong>
		    </div>
		    <div class="block-number-body">
		        <ul>
		            <li>
		                <div class="item-header">시, 도</div>
		                <div class="item-content" data-sido></div>
		            </li>
		            <li>
		                <div class="item-header">시, 군, 구</div>
		                <div class="item-content" data-sgg></div>
		            </li>
		            <li>
		                <div class="item-header">읍, 면, 동</div>
		                <div class="item-content" data-emd></div>
		            </li>
		            <li>
		                <div class="item-header" data-vis-title>1</div>
		                <div class="item-content" data-vis-content>2</div>
		            </li>
		        </ul>
		    </div>
		</div>

<%@ include file="/WEB-INF/view/admin/APPS/gis/tmplApiAddr.jsp"%>
