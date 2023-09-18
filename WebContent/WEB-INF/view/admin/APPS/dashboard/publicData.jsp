<%@ page language="java" contentType="text/html; charset=UTF-8"	session="true" pageEncoding="utf-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!--begin::Entry-->
<div class="d-flex flex-column-fluid dashboard dashboard2">
	<!--begin::Container-->
	<div class="container-fluid">
		<!--begin::Card-->
		<div class="card card-custom card-stretch rounded-0">
			<!--begin::Header-->
			<div class="card-header align-items-center">
				<h3 class="card-title align-items-center">
					<span class="font-weight-bolder text-dark">공공데이터</span>
				</h3>
				<div class="card-toolbar">
					<div class="d-flex align-items-center">
						<i class="flaticon-buildings text-dark mb-1"></i>
						<i class="ki ki-arrow-next icon-sm mx-2"></i>
						<a href="javascript:;">대시보드</a>
						<i class="ki ki-arrow-next icon-sm mx-2"></i>
						<a href="javascript:;">공공데이터</a>
					</div>
				</div>
			</div>
			
			<ul class="nav nav-tabs nav-tabs-line nav-tabs-line-2x nav-tabs-line-danger mb-1 ml-0"><!-- 230824수정 -->
				<li class="nav-item">
					<a class="nav-link active font-size-lg px-5" data-toggle="tab" data-target="#tab01" id="ktAreaBtn">정보</a>
				</li>
				<li class="nav-item">
					<a class="nav-link font-size-lg px-5" data-toggle="tab" data-target="#tab02" id="ktAreaBtn">층별정보</a>
				</li>
			</ul>
			
			<ul class="fliter_wrap searchResult2 mt-0"><!-- 230824수정 -->
				<li>
					<label>지역선택 : </label>
					<button id="btnSearchArea">
						<span data-list-addr-chkbizdist= "" data-list-addr-sidocd="" data-list-addr-sggcd="" data-list-addr-dongcd="" data-list-addr-bizdist= ""></span>											
						<i class="fa fa-angle-down"></i>
					</button> 
					<%@ include file="/WEB-INF/view/admin/APPS/dashboard/publicMap.jsp"%>
				</li>
				<li data-search-sangga>
					<label>상가유형 : </label>
					<span>전체</span>
				</li>
				<li>
					<label>검색기간 : </label>
					<span data-search-time></span>
				</li>		
				<li class="filter_btn">
					<a href="javascript:;" class="searchOption filter_btn" data-btn-search-detail>검색옵션 <i class="fa fa-chevron-down"></i></a>
				</li>
			</ul>
			
			<div class="tab-content">
				<div class="tab-pane fade show active bg-light" role="tabpanel" id="tab01" data-wrapper="addr">
					<div class="card-body">
						<div class="detailSearch" data-wrapper="searchDetail" style="display: none;">
							<div class="navTabs">
								<!--begin:: Nav Line -->
								<ul class="nav nav-tabs nav-tabs-second nav-tabs-line nav-tabs-line-2x nav-tabs-line-danger">
									<li class="nav-item">
										<a class="nav-link active font-size-lg px-5" data-toggle="tab" data-target="#tab01_01">검색조건</a>
									</li>
								</ul>
								<!--end:: Nav Line -->
							</div>
							<div class="tab-content">
								<div class="tab-pane fade show active mt-6" role="tabpanel" id="tab01_01">
									<div data-column-mode="sangga">
									<div class="form-horizontal" data-ui-search-detail>
										<div class="form-group">
											<label class="control-label col-1">검색기간</label>
											<div class="col-11">
												<div class="d-flex align-items-center">
													<div class="input-daterange input-group w-140px mr-10" data-search-time>
														<input type="text" class="form-control dateStart" name="startYMD" />
														<span class="input-group-text border-left-0 cursor-pointer" data-btn-time="startYMD">
															<i class="la la-calendar-check-o"></i>
														</span>
													</div>
													<div class="input-daterange input-group w-140px" data-search-time>
														<input type="text" class="form-control dateEnd" name="endYMD" />
														<span class="input-group-text border-left-0 cursor-pointer" data-btn-time="endYMD">
															<i class="la la-calendar-check-o"></i>
														</span>
													</div>
												</div>
											</div>
										</div>
										<div class="form-group">
											<label class="control-label col-1">상가유형</label>
											<div class="col-11 radioWrap" data-search-wrapper="sanggaType">
												<label><input type="checkbox" name="sanggaType" value=""  checked="checked"> 전체선택</label>
												<label><input type="checkbox" name="sanggaType" value="집합_상가"> 집합_상가</label>
												<label><input type="checkbox" name="sanggaType" value="중대형_상가"> 중대형_상가</label>
												<label><input type="checkbox" name="sanggaType" value="소규모_상가"> 소규모_상가</label>
												<label><input type="checkbox" name="sanggaType" value="오피스"> 오피스</label>
											</div>
										</div>
										<div class="text-center mb-10 btnWrap">
											<button class="btn btn-danger btn-lg px-11 font-weight-bold" data-btn-ok>확인</button>
											<button class="btn btn-outline-secondary btn-lg px-11 font-weight-bold detailSearch-close" data-btn-close>취소</button>
										</div>
									</div>
								</div>
								<div class="tab-pane fade mt-6" role="tabpanel" id="tab01_02">
									<div data-column-mode="area">
									</div>
								</div>
							</div>						
						</div>
					</div>	      
					<div data-content-mode="emd">
						<div class="detailContent">			
							<div class="pb-0"><!-- 230824수정 -->	
								<div class="position-relative " data-table-wrapper="table_1_1" data-ui-user-date="false"><!-- 230824수정 -->
									<div class="d-flex justify-content-between align-items-center">
										<h4>
											<!-- span class="font-weight-bold text-dark">평균분양가 추이 데이터</span> <span data-search-price-text></span>
											<i class="fas fa-question-circle icon-md text-muted ml-3" data-toggle="tooltip" data-placement="right" data-width="auto" title="선택지역의 상가 유형별 평균분양가 동향을 그래프 및 테이블 형식제공"></i -->
										</h4>
										<!-- 201215 버튼추가 -->
										<div class="btn_wrap">	
											<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1" data-btn-download="table_1_1"><i class="flaticon-download icon-md"></i> 다운로드</button>	
										</div>	
									</div>
									<div class="table-wrap head_fix_wrap head_fix_public_type"><!-- 230824수정 -->
										<!--begin: Datatable-->
										<table id="table_1_1" class="table-vertical thin double-header table-header" style="overflow-x: auto;">
											<thead>
												<tr>
													<th colspan="4" class="border-bottom-0">지역</th>
												</tr>
												<tr>
													<th class="basic">지역</th>
													<th class="basic">광역상권</th>
													<th class="basic">하위상권</th>
													<th class="basic">상가유형</th>
												</tr>
											</thead>
											<tbody id="tbody_1_1">
											</tbody>
										</table>
										<!--end: Datatable-->
									</div>
									<div class="reference"></div>
								</div>
							</div>	
						</div>
					</div>	      
					<div data-content-mode="floor" style="display:none;">
						<div class="detailContent">			
							<div class="pb-0">	<!-- 230824수정 -->
								<div class="position-relative " data-table-wrapper="table_2_1" data-ui-user-date="false"><!-- 230824수정 -->
									<div class="d-flex justify-content-between align-items-center">
										<h4>
											<!-- span class="font-weight-bold text-dark">평균분양가 추이 데이터</span> <span data-search-price-text></span>
											<i class="fas fa-question-circle icon-md text-muted ml-3" data-toggle="tooltip" data-placement="right" data-width="auto" title="선택지역의 상가 유형별 평균분양가 동향을 그래프 및 테이블 형식제공"></i -->
										</h4>
										<!-- 201215 버튼추가 -->
										<div class="btn_wrap">	
											<button type="button" class="btn btn-outline-secondary btn-sm rounded-0 px-3 py-1" data-btn-download="table_2_1"><i class="flaticon-download icon-md"></i> 다운로드</button>	
										</div>	
									</div>
									<div class="table-wrap head_fix_wrap head_fix_public_type"><!-- 230824수정 -->
										<!--begin: Datatable-->
										<table id="table_2_1" class="table-vertical thin double-header table-header" style="overflow-x: auto;">
											<thead>
												<tr>
													<th colspan="5" class="border-bottom-0">지역</th>
												</tr>
												<tr>
													<th class="basic">지역</th>
													<th class="basic">광역상권</th>
													<th class="basic">하위상권</th>
													<th class="basic">상가유형</th>
													<th class="basic">구분</th>
												</tr>
											</thead>
											<tbody id="tbody_2_1">
											</tbody>
										</table>
										<!--end: Datatable-->
									</div>
									<div class="reference"></div>
								</div>
							</div>	
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>	

<c:out value="<script type='text/template' id='tmplTablepublicData'>" escapeXml="false" />
{{#each dataArr}}
	{{#each ../sanggaArr}}
		{{#ifEquals ../sidonm "전체"}}
			<tr class="tr-border data-show maintotal" data-sidonm="{{../sidonm}}" data-wideareanm="{{../wideareanm}}" data-areanm="{{../areanm}}">
		{{else}}
			{{#ifEquals ../wideareanm "전체"}}
				<tr class="tr-border data-show subtotal" data-sidonm="{{../sidonm}}" data-wideareanm="{{../wideareanm}}" data-areanm="{{../areanm}}">
			{{else}}	
				{{#ifEquals ../areanm "전체"}}
					<tr class="tr-border data-show subtotal2" data-sidonm="{{../sidonm}}" data-wideareanm="{{../wideareanm}}" data-areanm="{{../areanm}}">
				{{else}}
					<tr class="tr-border data-show subdata" data-sidonm="{{../sidonm}}" data-wideareanm="{{../wideareanm}}" data-areanm="{{../areanm}}">		
				{{/ifEquals}}	
			{{/ifEquals}}
		{{/ifEquals}}	
		<td>{{../sidonm}}</td>
		<td>{{../wideareanm}}</td>
		<td>{{../areanm}}</td>
		<td>{{this}}</td>
		{{#each (lookup ../this.data @index)}}
			<td>{{this}}</td>
		{{/each}}
	</tr>
	{{/each}}
{{/each}}
<c:out value="</script>" escapeXml="false" />

<c:out value="<script type='text/template' id='tmplTablepublicData2'>" escapeXml="false" />
{{#each dataArr}}
	{{#each ../sanggaArr}}
		{{#each ../../gbnTypeArr}}
			{{#ifEquals ../../sidonm "전체"}}
				<tr class="tr-border data-show maintotal" data-sidonm="{{../../sidonm}}" data-wideareanm="{{../../wideareanm}}" data-areanm="{{../../areanm}}">
			{{else}}
				{{#ifEquals ../../wideareanm "전체"}}
					<tr class="tr-border data-show subtotal" data-sidonm="{{../../sidonm}}" data-wideareanm="{{../../wideareanm}}" data-areanm="{{../../areanm}}">
				{{else}}	
					{{#ifEquals ../../areanm "전체"}}
						<tr class="tr-border data-show subtotal2" data-sidonm="{{../../sidonm}}" data-wideareanm="{{../../wideareanm}}" data-areanm="{{../../areanm}}">
					{{else}}
						<tr class="tr-border data-show subdata" data-sidonm="{{../../sidonm}}" data-wideareanm="{{../../wideareanm}}" data-areanm="{{../../areanm}}">		
					{{/ifEquals}}	
				{{/ifEquals}}
			{{/ifEquals}}	
			<td>{{../../sidonm}}</td>
			<td>{{../../wideareanm}}</td>
			<td>{{../../areanm}}</td>
			<td>{{../this}}</td>
				<td>{{this}}</td>
				{{#with (lookup ../../this.sanggaData @../index)}}
					{{#each (lookup this.data @index)}}
						<td>{{this}}</td>
					{{/each}}
				{{/with}}
			</tr>
		{{/each}}
	{{/each}}
{{/each}}
<c:out value="</script>" escapeXml="false" />