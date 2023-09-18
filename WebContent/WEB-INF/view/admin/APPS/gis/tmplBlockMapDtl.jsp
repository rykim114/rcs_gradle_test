<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:out value="<script type='text/template' id='tmplBlockComplexList'>" escapeXml="false" />
{{#each cmplArr}}
	<tr>
		<td class="py-2 text-center align-middle bg-light-secondary fixed-side text-truncate w-180px h-35px">
			<a href="javascript:;" data-btn-open-building data-x="{{x}}" data-y="{{y}}" style="text-decoration: underline;">
				{{상가명}}
			</a>
		</td>
		<td class="py-2 text-center align-middle w-300px h-35px text-truncate">{{주소}}</td>
		<td class="py-2 text-center align-middle w-140px h-35px">{{건축규모}}</td>
		<td class="py-2 text-center align-right  w-100px h-35px">{{대지면적}}㎡</td>
		<td class="py-2 text-center align-right  w-100px h-35px">{{연면적}}㎡</td>
		<td class="py-2 text-center align-right  w-100px h-35px">{{총점포수}}</td>
		<td class="py-2 text-center align-right  w-100px h-35px">{{점포수1f}}</td>
		<td class="py-2 text-center align-right  w-120px h-35px">{{계약평당가1f}}</td>
		<td class="py-2 text-center align-right  w-120px h-35px">{{전용평당가1f}}</td>
		<td class="py-2 text-center align-right  w-100px h-35px">{{전용율}}</td>
		<td class="py-2 text-center align-middle w-100px h-35px">{{분양년월}}</td>
		<td class="py-2 text-center align-middle w-100px h-35px">{{입주년월}}</td>
	</tr>
{{else}}
	<tr>
		<td class="py-2 text-center align-middle w-500px h-35px" colspan="5">검색된 데이터가 없습니다</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />


<c:out value="<script type='text/template' id='tmplBlockTRDList'>" escapeXml="false" />
{{#each trdArr}}
	<tr>
		<td class="py-2 text-center align-middle" style="display: table-cell;">{{계약일자}}</td>
		<td class="py-2 text-center align-middle" style="display: table-cell;">{{상가유형}}</td>
		<td class="py-2 text-center align-middle" style="display: table-cell;">{{건물명}}</td>
		<td class="py-2 text-center align-middle text-truncate" style="display: table-cell;">
			<a href="javascript:;" data-btn-open-building data-x="{{x}}" data-y="{{y}}" style="text-decoration: underline;">
				{{시군구명}}
			</a>	
		</td>
		<td class="py-2 text-center align-middle" style="display: table-cell;">{{건물용도}}</td>
		<td class="py-2 text-center align-middle" style="display: table-cell;">{{층}}</td>
		<td class="py-2 text-center align-middle" style="display: table-cell;">{{전유면적}}㎡</td>
		<td class="py-2 text-center align-middle" style="display: table-cell;">{{용도지역}}</td>
		<td class="py-2 text-center align-middle" style="display: table-cell;">{{거래금액}}</td>
		<td class="py-2 text-center align-middle" style="display: table-cell;">{{건축년도}}</td>
	</tr>
{{else}}
	<tr>
		<td class="py-2 text-center align-middle" style="display: table-cell;" colspan="10">검색된 데이터가 없습니다</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />


<c:out value="<script type='text/template' id='tmplBlockNearAptList'>" escapeXml="false" />
{{#each aptArr}}
	<tr>
		<td class="py-2 text-center align-middle fixed-side w-100px h-35px">{{상품구분}}</td>
		<td class="py-2 text-center align-middle bg-light-secondary fixed-side w-100px h-35px">{{시군구}}</td>
		<td class="py-2 text-center align-middle fixed-side w-100px h-35px">{{읍면동}}</td>
		<td class="py-2 text-center align-middle fixed-side text-truncate w-200px h-35px">
			<a href="javascript:;" data-btn-open-building data-x="{{x좌표}}" data-y="{{y좌표}}" style="text-decoration: underline;">
				{{단지명}}
			</a>
		</td>
		<td class="py-2 text-center align-middle w-100px h-35px">{{구분}}</td>
		<td class="py-2 text-center align-middle w-100px h-35px">{{세대수}}세대</td>
		<td class="py-2 text-center align-middle w-70px h-35px">{{km}}km</td>
		<td class="py-2 text-center align-middle w-110px h-35px">{{사용승인일}}</td>
		<td class="py-2 text-center align-middle w-110px h-35px">{{착공일}}</td>
		<td class="py-2 text-center align-middle w-200px h-35px text-truncate">{{시공사}}</td>
	</tr>
{{else}}
	<tr>
		<td class="py-2 text-center align-middle w-500px" colspan="4">검색된 데이터가 없습니다</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />

<c:out value="<script type='text/template' id='tmplBlockNearFacStat'>" escapeXml="false" />
{{#each facStatCnt}}
	<tr>
		<td class="py-2 text-center align-middle col-sm-3">{{cntFacStat1}}</td>
		<td class="py-2 text-center align-middle col-sm-3">{{cntFacStat2}}</td>
		<td class="py-2 text-center align-middle col-sm-3">{{cntFacStat3}}</td>
		<td class="py-2 text-center align-middle col-sm-3">{{cntFacStat4}}</td>
	</tr>
{{else}}
	<tr>
		<td class="py-2 text-center align-middle" colspan="4">검색된 데이터가 없습니다</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />

<c:out value="<script type='text/template' id='tmplBlockNearFacList'>" escapeXml="false" />
{{#each facStatArr}}
	<tr>
		<td class="py-2 text-center align-middle bg-light-secondary fixed-side w-100px h-35px">{{시설구분}}</td>
		<td class="py-2 text-center align-middle bg-light-secondary fixed-side w-100px h-35px">{{구분}}</td>
		<td class="py-2 text-center align-middle fixed-side text-truncate w-200px h-35px">
			<a href="javascript:;" data-btn-open-building data-x="{{x좌표}}" data-y="{{y좌표}}" style="text-decoration: underline;">
				{{시설명}}
			</a>
		</td>
		<td class="py-2 text-center align-middle w-70px h-35px">{{km}}km</td>
		<td class="py-2 text-center align-middle w-110px h-35px">{{특징}}</td>
		<td class="py-2 text-center align-right  w-110px h-35px">{{특징2}}</td>      
		<td class="py-2 text-center align-middle w-400px h-35px">{{도로명주소}}</td>
	</tr>
{{else}}
	<tr>
		<td class="py-2 text-center align-middle w-500px" colspan="7">검색된 데이터가 없습니다</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />

<c:out value="<script type='text/template' id='tmplBlockNearTrafficStat'>" escapeXml="false" />
{{#each trafficStatCnt}}
	<tr>
		<td class="py-2 text-center align-middle col-sm-3">{{cntTrafficStat1}}</td>
		<td class="py-2 text-center align-middle col-sm-3">{{cntTrafficStat2}}</td>
		<td class="py-2 text-center align-middle col-sm-3">{{cntTrafficStat3}}</td>
		<td class="py-2 text-center align-middle col-sm-3">{{cntTrafficStat4}}</td>
	</tr>
{{else}}
	<tr>
		<td class="py-2 text-center align-middle" colspan="4">검색된 데이터가 없습니다</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />


<c:out value="<script type='text/template' id='tmplBlockNearTrafficList'>" escapeXml="false" />
{{#each trafficStatArr}}
	<tr>
		<td class="py-2 text-center align-middle bg-light-secondary fixed-side w-100px h-35px">{{시설구분}}</td>
		<td class="py-2 text-center align-middle bg-light-secondary fixed-side w-100px h-35px">{{구분}}</td>
		<td class="py-2 text-center align-middle fixed-side text-truncate w-200px h-35px">
			<a href="javascript:;" data-btn-open-building data-x="{{x좌표}}" data-y="{{y좌표}}" style="text-decoration: underline;">
				{{시설명}}
			</a>
		</td>
		<td class="py-2 text-center align-middle w-70px h-35px">{{km}}km</td>
		<td class="py-2 text-center align-middle w-110px h-35px">{{특징}}</td>
		<td class="py-2 text-center align-right  w-110px h-35px">{{특징2}}</td>
		<td class="py-2 text-center align-middle w-400px h-35px">{{도로명주소}}</td>
	</tr>
{{else}}
	<tr>
		<td class="py-2 text-center align-middle w-500px" colspan="7">검색된 데이터가 없습니다</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />


<c:out value="<script type='text/template' id='tmplBlockRentForSaleList'>" escapeXml="false" />
{{#each saleArr}}
	<tr>
		<td class="py-2 text-center align-middle bg-light-secondary fixed-side w-100px h-35px">
			{{매물등록일}}
		</td>
		<td class="py-2 text-center align-middle w-100px h-35px">{{상가유형}}</td>
		<td class="py-2 text-center align-middle w-150px h-35px">{{건물명}}</td>
		<td class="py-2 text-center align-middle w-300px h-35px text-truncate">
			<a href="javascript:;" data-btn-open-building data-x="{{x}}" data-y="{{y}}" style="text-decoration: underline;">
				{{주소}}
			</a>
		</td>
		<td class="py-2 text-center align-middle w-60px h-35px">{{층}}</td>
		<td class="py-2 text-center align-right w-80px h-35px">{{전용면적}}㎡</td>
		<td class="py-2 text-center align-right w-80px h-35px">{{계약면적}}㎡</td>
		<td class="py-2 text-center align-right w-90px h-35px">{{보증금}}</td>
		<td class="py-2 text-center align-right w-90px h-35px">{{월세}}</td>
		<td class="py-2 text-center align-right w-90px h-35px">{{권리금}}</td>
		<td class="py-2 text-center align-middle w-90px h-35px">{{사용승인일}}</td>
	</tr>
{{else}}
	<tr>
		<td class="py-2 text-center align-middle w-500px" colspan="4">검색된 데이터가 없습니다</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />

<c:out value="<script type='text/template' id='tmplBlockTradingForSaleList'>" escapeXml="false" />           
{{#each saleArr}}
	<tr>
		<td class="py-2 text-center align-middle bg-light-secondary fixed-side" style="display: table-cell;">
			{{매물등록일}}
		</td>
		<td class="py-2 text-center align-middle" style="display: table-cell;">{{상가유형}}</td>
		<td class="py-2 text-center align-middle" style="display: table-cell;">{{건물명}}</td>
		<td class="py-2 text-center align-middle text-truncate" style="display: table-cell;">
			<a href="javascript:;" data-btn-open-building data-x="{{x}}" data-y="{{y}}" style="text-decoration: underline;">
				{{주소}}
			</a>  
		</td>
		<td class="py-2 text-center align-middle" style="display: table-cell;">{{층}}</td>
		<td class="py-2 text-center align-right" style="display: table-cell;">{{전용면적}}㎡</td>
		<td class="py-2 text-center align-right" style="display: table-cell;">{{계약면적}}㎡</td>    
		<td class="py-2 text-center align-right" style="display: table-cell;">{{매매가}}</td>
		<td class="py-2 text-center align-right" style="display: table-cell;">{{권리금}}</td>
		<td class="py-2 text-center align-right" style="display: table-cell;">{{수익률}}</td>
	</tr>
{{else}}     
	<tr>
		<td class="py-2 text-center align-middle" style="display: table-cell;" colspan="10">검색된 데이터가 없습니다</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />
