<%@ page language="java" contentType="text/html; charset=UTF-8"	session="true" pageEncoding="utf-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<div class="d-flex flex-column-fluid">
							<!--begin::Container-->
							<div class="container-fluid">
                                <!--begin::Card-->
                                <div class="card card-custom card-stretch rounded-0">
                                    <!--begin::Header-->
                                    <div class="card-header align-items-center border-bottom">
                                        <h3 class="card-title align-items-center">
                                            <span class="font-weight-bolder text-dark">북마크</span>
                                        </h3>
                                        <div class="card-toolbar">
											<div class="d-flex align-items-center">
												<i class="flaticon-buildings text-dark mb-1"></i>
												<i class="ki ki-arrow-next icon-sm mx-2"></i>
												북마크
											</div>
                                        </div>
                                    </div>
                                    <!--end::Header-->
                                    <!--begin::Body-->
                                    <div class="card-body pt-9">
                                        <div class="bg-light px-6 py-6 font-size-lg line-height-xl mb-6">
                                            - GIS 건물, GIS 블럭에서 북마크한 내용들이 보여지는 공간입니다.
                                        </div>
                                        <!--begin: Section-->
										<ul class="bookmark" id="save_append">
											<li class="count">총 <span>0</span>건</li>
										</ul>
										<!--end: Section-->
                                    </div>
                                    <!--end: Card Body-->
                                </div>
                                <!--end: Card-->
							</div>
							<!--end::Container-->
						</div>


<c:out value="<script type='text/template' id='tmplFavoriteList'>" escapeXml="false" />
{{#each favoriteArr}}
<li class="li-wrapper">
	<div class="title-wrap">
		<div class="star">
			<span class="text-warning" data-btn-fav="{{순번}}"><em class="fa fa-star"></em></span>
		</div>
		<div class="name">
			<span class="font-weight-bold text-dark-75 font-size-lg">{{제목}}</span>
			<span class="font-weight-normal">{{gis분류}}</span>
			<span class="font-weight-normal">{{설명}}</span>
		</div>
	</div>
	<div class="control-wrap">
		<div class="state">
		{{#if isBuild}}
		<%--
			<span class="label label-lg label-success rounded-sm label-inline">분양완료</span>
			<span class="label label-lg label-outline-dark rounded-sm label-inline mx-md-2 text-break">복합상가</span>
		--%>
		{{/if}}
		</div>
		<div class="directMove">
			<a href="javascript:;" data-btn-dtl="{{순번}}"><span class="font-weight-normal ml-md-6">바로가기 <i class="fas fa-external-link-square-alt"></i></span></a>
		</div>
	</div>
</li>	
{{else}}
<li>
	저장하신 즐겨찾기가 없습니다.
</li>
{{/each}}
<c:out value="</script>" escapeXml="false" />

