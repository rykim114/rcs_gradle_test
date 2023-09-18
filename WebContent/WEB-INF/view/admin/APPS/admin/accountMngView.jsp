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
	                <span class="font-weight-bolder text-dark">계정관리</span>
	            </h3>
	            <div class="card-toolbar">
	            </div>
	        </div>
	        <!--end::Header-->
	        <!--begin::Body-->
	        <div class="card-body pt-9">
				<h4 class="mt-5 mb-5">cooky815 상세정보</h4>
				<!--begin: Search Form-->
				<div class="bg-light px-6 py-6 font-size-lg line-height-xl">
					법인명 : (주) 대림건설 > 전략사업부<br>
					담당자 : 류현진 / 010-1234-5678<br>
					상품명 : IP 3개 등록<br>
					계약기간 : 2020년 03월 12일 ~ 2021년 03월 11일  <br>
					사용기간 : 15일 남았습니다.
				</div>
				<div class="text-center mt-5 mb-8">
					<button type="button" class="btn btn-danger btn-lg font-weight-bold px-11 mr-2">수정</button>
					<!-- 201223 삭제 -->
	<!--											<button type="button" class="btn btn-outline-secondary btn-lg font-weight-bold px-11" data-dismiss="modal">취소</button>-->
				</div>
	
				<!--end: Search Form-->
				<!--begin: Datatable-->
				<div class="datatable datatable-bordered datatable-head-custom datatable-default datatable-primary datatable-loaded mb-20">
					<table class="table-vertical">
						<colgroup>
							<col width="60px">
							<col width="*">
							<col width="15%">
							<col width="15%">
							<col width="30%">
						</colgroup>
						<thead>
						<tr>
							<th>no</th>
							<th>PC 명</th>
							<th>IP 주소</th>
							<th>접속상태</th>
							<th>발생시간</th>
						</tr>
						</thead>
						<tbody>
						<tr>
							<td>1</td>
							<td>집_PC</td>
							<td>210.102.195.13</td>
							<td>로그아웃</td>
							<td>2020년 01월 31일 오전 03:51:16</td>
						</tr>
						<tr>
							<td>2</td>
							<td>회사_PC</td>
							<td>211.23.45.32</td>
							<td>로그인</td>
							<td>2020년 01월 31일 오전 03:51:16</td>
						</tr>
						<tr>
							<td>3</td>
							<td>회사_노트북</td>
							<td>211.102.195.13</td>
							<td>로그아웃</td>
							<td>2020년 01월 31일 오전 03:51:16</td>
						</tr>
						</tbody>
					</table>
					<btn class="btn btn-outline-secondary btn-block">전체보기 <span class="px-2">9개</span> <i class="fa fa-chevron-down"></i></btn>
				</div>
				<!--end: Datatable-->
	
				<!--begin:: Nav Line -->
				<ul class="nav nav-tabs nav-tabs-line nav-tabs-line-2x nav-tabs-line-danger">
					<li class="nav-item">
						<a class="nav-link active font-size-lg px-5" data-bs-toggle="tab" data-bs-target="#tab01">사용자 계정 접속내역</a>
					</li>
					<li class="nav-item">
						<a class="nav-link font-size-lg px-5" data-bs-toggle="tab" data-bs-target="#tab02">사용자 계정 IP 변경 내역</a>
					</li>
				</ul>
				<!--end:: Nav Line -->
				<div class="tab-content">
					<div class="tab-pane fade show active mt-10" id="tab01" role="tabpanel">
						<div class="row mb-3">
							<div class="col-9"></div>
							<div class="col-3">
								<div class="input-icon mb-2">
									<input type="text" class="form-control input_bottom_line" placeholder="검색어를 입력하세요">
									<span><i class="flaticon2-search-1 text-muted"></i></span>
								</div>
								<div class="d-flex align-items-center">
									<select class="form-control selectpicker">
										<option value="1">10개 보기</option>
										<option value="2">15개 보기</option>
										<option value="3">20개 보기</option>
										<option value="4">30개 보기</option>
									</select>
								</div>
							</div>
						</div>
						<div class="datatable datatable-bordered datatable-head-custom datatable-default datatable-primary datatable-loaded">
							<table class="table-vertical">
								<thead>
								<tr>
									<th>no</th>
									<th>PC 명</th>
									<th>IP 주소</th>
									<th>접속시간</th>
									<th>종료시간</th>
									<th>체류시간</th>
									<th>상세정보</th>
								</tr>
								</thead>
								<tbody>
								<tr>
									<td>1</td>
									<td>집_PC</td>
									<td>210.102.195.13</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td></td>
									<td>메뉴별 접속시간</td>
								</tr>
								<tr>
									<td>2</td>
									<td>집_PC</td>
									<td>210.102.195.13</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td></td>
									<td>메뉴별 접속시간</td>
								</tr>
								<tr>
									<td>3</td>
									<td>회사_PC</td>
									<td>211.23.45.32</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td></td>
									<td>메뉴별 접속시간</td>
								</tr>
								<tr>
									<td>4</td>
									<td>집_PC</td>
									<td>210.102.195.13</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td></td>
									<td>메뉴별 접속시간</td>
								</tr>
								<tr>
									<td>5</td>
									<td>회사_PC</td>
									<td>211.23.45.32</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td></td>
									<td>메뉴별 접속시간</td>
								</tr>
								<tr>
									<td>6</td>
									<td>집_PC</td>
									<td>210.102.195.13</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td></td>
									<td>메뉴별 접속시간</td>
								</tr>
								<tr>
									<td>7</td>
									<td>집_PC</td>
									<td>210.102.195.13</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td></td>
									<td>메뉴별 접속시간</td>
								</tr>
								<tr>
									<td>8</td>
									<td>회사_PC</td>
									<td>211.23.45.32</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td></td>
									<td>메뉴별 접속시간</td>
								</tr>
								<tr>
									<td>9</td>
									<td>집_PC</td>
									<td>210.102.195.13</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td></td>
									<td>메뉴별 접속시간</td>
								</tr>
								<tr>
									<td>10</td>
									<td>211.23.45.32</td>
									<td>210.102.195.13</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td></td>
									<td>메뉴별 접속시간</td>
								</tr>
								</tbody>
							</table>
							<div class="datatable-pager datatable-paging-loaded">
								<ul class="datatable-pager-nav my-2 mb-sm-0">
									<li>
										<a title="First" class="datatable-pager-link datatable-pager-link-first datatable-pager-link-disabled" data-page="1" disabled="disabled">
											<i class="flaticon2-fast-back"></i>
										</a>
									</li>
									<li>
										<a title="Previous" class="datatable-pager-link datatable-pager-link-prev datatable-pager-link-disabled" data-page="1" disabled="disabled">
											<i class="flaticon2-back"></i>
										</a>
									</li>
									<li style="display: none;">
										<input type="text" class="datatable-pager-input form-control" title="Page number">
									</li>
									<li>
										<a class="datatable-pager-link datatable-pager-link-number datatable-pager-link-active" data-page="1" title="1">1</a>
									</li>
									<li>
										<a title="Next" class="datatable-pager-link datatable-pager-link-next datatable-pager-link-disabled" data-page="1" disabled="disabled">
											<i class="flaticon2-next"></i>
										</a>
									</li>
									<li>
										<a title="Last" class="datatable-pager-link datatable-pager-link-last datatable-pager-link-disabled" data-page="1" disabled="disabled">
											<i class="flaticon2-fast-next"></i>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<!-- tab 02 -->
					<div class="tab-pane fade mt-10" id="tab02" role="tabpanel">
						<div class="row mb-3">
							<div class="col-9"></div>
							<div class="col-3">
								<div class="input-icon mb-2">
									<input type="text" class="form-control input_bottom_line" placeholder="검색어를 입력하세요">
									<span><i class="flaticon2-search-1 text-muted"></i></span>
								</div>
								<div class="d-flex align-items-center">
									<select class="form-control selectpicker">
										<option value="1">10개 보기</option>
										<option value="2">15개 보기</option>
										<option value="3">20개 보기</option>
										<option value="4">30개 보기</option>
									</select>
								</div>
							</div>
						</div>
						<div class="datatable datatable-bordered datatable-head-custom datatable-default datatable-primary datatable-loaded">
							<table class="table-vertical">
								<thead>
								<tr>
									<th>no</th>
									<th>PC 명</th>
									<th>IP 주소</th>
									<th>이벤트</th>
									<th>종료시간</th>
									<th>담당자</th>
								</tr>
								</thead>
								<tbody>
								<tr>
									<td>1</td>
									<td>집_PC</td>
									<td>210.102.195.13</td>
									<td>등록</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td></td>
								</tr>
								<tr>
									<td>2</td>
									<td>집_PC</td>
									<td>210.102.195.13</td>
									<td>비활성</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td></td>
								</tr>
								<tr>
									<td>3</td>
									<td>회사_PC</td>
									<td>211.23.45.32</td>
									<td>비활성</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td></td>
								</tr>
								<tr>
									<td>4</td>
									<td>집_PC</td>
									<td>210.102.195.13</td>
									<td>비활성</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td></td>
								</tr>
								<tr>
									<td>5</td>
									<td>회사_PC</td>
									<td>211.23.45.32</td>
									<td>등록</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td></td>
								</tr>
								<tr>
									<td>6</td>
									<td>집_PC</td>
									<td>210.102.195.13</td>
									<td>비활성</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td></td>
								</tr>
								<tr>
									<td>7</td>
									<td>집_PC</td>
									<td>210.102.195.13</td>
									<td>등록</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td></td>
								</tr>
								<tr>
									<td>8</td>
									<td>회사_PC</td>
									<td>211.23.45.32</td>
									<td>등록</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td></td>
								</tr>
								<tr>
									<td>9</td>
									<td>집_PC</td>
									<td>210.102.195.13</td>
									<td>등록</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td></td>
								</tr>
								<tr>
									<td>10</td>
									<td>211.23.45.32</td>
									<td>210.102.195.13</td>
									<td>비활성</td>
									<td>2020년 01월 31일 오전 03:51:16</td>
									<td></td>
								</tr>
								</tbody>
							</table>
							<div class="datatable-pager datatable-paging-loaded">
								<ul class="datatable-pager-nav my-2 mb-sm-0">
									<li>
										<a title="First" class="datatable-pager-link datatable-pager-link-first datatable-pager-link-disabled" data-page="1" disabled="disabled">
											<i class="flaticon2-fast-back"></i>
										</a>
									</li>
									<li>
										<a title="Previous" class="datatable-pager-link datatable-pager-link-prev datatable-pager-link-disabled" data-page="1" disabled="disabled">
											<i class="flaticon2-back"></i>
										</a>
									</li>
									<li style="display: none;">
										<input type="text" class="datatable-pager-input form-control" title="Page number">
									</li>
									<li>
										<a class="datatable-pager-link datatable-pager-link-number datatable-pager-link-active" data-page="1" title="1">1</a>
									</li>
									<li>
										<a title="Next" class="datatable-pager-link datatable-pager-link-next datatable-pager-link-disabled" data-page="1" disabled="disabled">
											<i class="flaticon2-next"></i>
										</a>
									</li>
									<li>
										<a title="Last" class="datatable-pager-link datatable-pager-link-last datatable-pager-link-disabled" data-page="1" disabled="disabled">
											<i class="flaticon2-fast-next"></i>
										</a>
									</li>
								</ul>
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



        