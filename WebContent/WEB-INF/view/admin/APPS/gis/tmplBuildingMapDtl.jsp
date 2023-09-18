<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!-- 상가연면적 -->
<c:out value="<script type='text/template' id='tmplBuildingComplexList'>" escapeXml="false" />
{{#each cmplArr}}
	<tr>
		<td class="py-2 text-center align-middle bg-light-secondary">{{구분}}</td>
		<td class="py-2 text-center align-middle bg-light-secondary">{{전용면적}}</td>
		<td class="py-2 text-center align-middle bg-light-secondary">{{분양면적}}</td>
		<td class="py-2 text-center align-middle bg-light-secondary">{{전용율}}</td>		
	</tr>
{{else}}
	<tr>
		<td class="py-2 text-center align-middle" colspan="4">검색 결과가 없습니다</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />

<!-- 물건현황-->
<c:out value="<script type='text/template' id='tmplBuildingComplexList2'>" escapeXml="false" />
{{#each trdArr}}
	<tr>
		<td class="py-2 text-center align-middle">{{구분}}</td>
		<td class="py-2 text-center align-middle">{{용도}}</td>
		<td class="py-2 text-center align-middle">{{면적}}</td>
	</tr>
{{else}}
	<tr>
		<td class="py-2 text-center align-middle" colspan="3">검색 결과가 없습니다</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />

									
<!-- 임대매물정보-->
<c:out value="<script type='text/template' id='tmplBuildingComplexList3'>" escapeXml="false" />
{{#each urdArr}}
	<tr>		
		<td class="py-2 text-center align-middle">{{건물명}}</td>
		<td class="py-2 text-center align-middle">{{번지}}</td>
		<td class="py-2 text-center align-middle">{{층}}</td>
		<td class="py-2 text-center align-middle">{{상가유형}}</td>
		<td class="py-2 text-center align-middle">{{면적}}</td>
		<td class="py-2 text-center align-middle">{{전용면적}}</td>
		<td class="py-2 text-right align-middle">{{보증금}}</td>
		<td class="py-2 text-right align-middle">{{월세}}</td>
		<td class="py-2 text-right align-middle">{{권리금}}</td>
		<td class="py-2 text-center align-middle">{{등록일}}</td>		
	</tr>
{{else}}
	<tr>
		<td class="py-2 text-center align-middle" colspan="10">검색 결과가 없습니다</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />

<!-- 매매실거래가정보-->
<c:out value="<script type='text/template' id='tmplBuildingComplexList4'>" escapeXml="false" />
{{#each rrdArr}}
	<tr>
		<td class="py-2 text-center align-middle">{{건물명}}</td>
		<td class="py-2 text-center align-middle">{{번지}}</td>
		<td class="py-2 text-center align-middle">{{층}}</td>
		<td class="py-2 text-center align-middle">{{상가유형}}</td>
		<td class="py-2 text-center align-middle">{{주용도}}</td>
		<td class="py-2 text-center align-middle">{{전용면적}}</td>
		<td class="py-2 text-right align-middle">{{거래금액}}</td>
		<td class="py-2 text-center align-middle">{{계약일}}</td>
	</tr>
{{else}}
	<tr>
		<td class="py-2 text-center align-middle" colspan="8">검색 결과가 없습니다</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />

<!-- 상가업소정보-->
<c:out value="<script type='text/template' id='tmplBuildingComplexList5'>" escapeXml="false" />
{{#each srdArr}}
	<tr>		
		<td class="py-2 text-left align-middle">{{상가업소명}}</td>
		<td class="py-2 text-center align-middle">{{층}}</td>
		<td class="py-2 text-left align-middle">{{업종대분류}}</td>
		<td class="py-2 text-left align-middle">{{업종중분류}}</td>
		<td class="py-2 text-left align-middle">{{업종소분류}}</td>		
	</tr>
{{else}}
	<tr>
		<td class="py-2 text-center align-middle" colspan="5">검색 결과가 없습니다</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />
<!-- 호구분별분양가정보-->
<c:out value="<script type='text/template' id='tmplBuildingComplexList6'>" escapeXml="false" />
{{#each lrdArr}}
	<tr>		
		<td class="py-2 text-center align-middle bg-light-secondary">{{동}}</td> 
		<td class="py-2 text-center align-middle">{{층}}</td>
		<td class="py-2 text-center align-middle">{{호}}</td>
		<td class="py-2 text-center align-middle">{{전용면적}}</td>
		<td class="py-2 text-center align-middle">{{분양면적}}</td>
		<td class="py-2 text-right align-middle">{{분양가}}</td>
		<td class="py-2 text-right align-middle">{{평단가}}</td>
		<td class="py-2 text-center align-middle">{{전용율}}</td>	
		<td class="py-2 text-right align-middle">{{낙찰가}}</td>
		<td class="py-2 text-center align-middle">{{기타호정보}}</td>		
	</tr>
{{else}}
	<tr>
		<td class="py-2 text-center align-middle" colspan="8">검색 결과가 없습니다</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />

<!-- 상가면적 -->
<c:out value="<script type='text/template' id='tmplBuildingComplexList7'>" escapeXml="false" />
{{#each zrdArr}}
	<tr>		
		<td class="py-2 text-center align-middle bg-light-secondary">{{층}}</td>
		<td class="py-2 text-center align-middle">{{전용면적}}</td>
		<td class="py-2 text-center align-middle">{{분양면적}}</td>
		<td class="py-2 text-center align-middle">{{전용율}}</td>
	</tr>
{{else}}
	<tr>
		<td class="py-2 text-center align-middle" colspan="4">검색 결과가 없습니다</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />

<!-- 매매매물정보-->
<c:out value="<script type='text/template' id='tmplBuildingComplexList8'>" escapeXml="false" />
{{#each urdArr}}
	<tr>		
		<td class="py-2 text-center align-middle">{{건뭉명}}</td>
		<td class="py-2 text-center align-middle">{{번지}}</td>
		<td class="py-2 text-center align-middle">{{층}}</td>
		<td class="py-2 text-center align-middle">{{상가유형}}</td>
		<td class="py-2 text-center align-middle">{{면적}}</td>
		<td class="py-2 text-center align-middle">{{전용면적}}</td>
		<td class="py-2 text-right align-middle">{{매매가}}</td>
		<td class="py-2 text-right align-middle">{{권리금}}</td>
		<td class="py-2 text-right align-middle">{{수익률}}</td>
		<td class="py-2 text-center align-middle">{{등록일}}</td>		
	</tr>
{{else}}
	<tr>
		<td class="py-2 text-center align-middle" colspan="10">검색 결과가 없습니다</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />

<!-- 리맥스 매물 정보 -->
<c:out value="<script type='text/template' id='tmplRemaxMemulList'>" escapeXml="false" />
{{#each memulArr}}
	<div class="px-6 py-6 bg-white m-4 border border-secondary remax-page-{{페이지번호}}" style="display:{{페이지디스플레이}};">
	
		<h5 class="font-size-h5 mb-2">{{매물구분}} 정보</h5>
		
		<table class="table table-bordered m-1">
			<colgroup>
				<col style="width:140px">
				<col style="width:225px">
				<col style="width:140px">
				<col style="width:auto">
			</colgroup>
			<thead style="font-size:12px;">
		        <tr>
		            <th scope="col" colspan="4">매물 정보</th>
		        </tr>
		    </thead>
			<tbody>
				<tr>
					<td class="bg-light-secondary py-2">{{층정보항목명}}</td>
					<td class="py-2">{{층정보}}</td>
					<td class="bg-light-secondary py-2">사진 정보</td>
					<td class="py-2">
						<div id="btnRemaxPhoto" class="h-0px" data-toggle="modal" data-target="#exampleModal"></div>
						<a href="javascript:;" onclick="showRemaxPhoto(this);" data-code="{{매물코드}}" data-type="{{매물구분}}" style="text-decoration:underline;">{{사진보기링크}}</a>
					</td>
				</tr>
				<tr>
					<td class="bg-light-secondary py-2">{{면적항목명}}</td>
					<td class="py-2">{{면적정보}}</td>
					<td class="bg-light-secondary py-2">전용면적</td>
					<td class="py-2">{{전용면적정보}}</td>
				</tr>	
				<tr>
					<td class="bg-light-secondary py-2">주변환경</td>
					<td class="py-2" colspan="3">{{주변환경}}</td>
				</tr>
				<tr>
					<td class="bg-light-secondary py-2">주요내용</td>
					<td class="py-2" colspan="3">{{매물제목}}</td>
				</tr>		
				<tr>
					<td class="bg-light-secondary py-2">상세내용</td>
					<td class="py-2" colspan="3">{{상세내용}}</td>
				</tr>	
				<tr>
					<td class="bg-light-secondary py-2">입주예정일</td>
					<td class="py-2" colspan="3">{{입주예정일}}</td>
				</tr>							
			</tbody>
		</table>
		
		<table class="table table-bordered m-1">
			<colgroup>
				<col style="width:140px">
				<col style="width:225px">
				<col style="width:140px">
				<col style="width:auto">
			</colgroup>
			<thead style="font-size:12px;">
		        <tr>
		            <th scope="col" colspan="4">가격 정보</th>
		        </tr>
		    </thead>
			<tbody>
				<tr>
					<td class="bg-light-secondary py-2">{{가격정보1항목명}}</td>
					<td class="py-2">{{가격정보1}}</td>
					<td class="bg-light-secondary py-2">{{가격정보2항목명}}</td>
					<td class="py-2">{{가격정보2}}</td>
				</tr>
				<tr>
					<td class="bg-light-secondary py-2">{{가격정보3항목명}}</td>
					<td class="py-2">{{가격정보3}}</td>
					<td class="bg-light-secondary py-2">{{가격정보4항목명}}</td>
					<td class="py-2">{{가격정보4}}</td>
				</tr>		
				{{#if 추가가격정보여부}}
				<tr>
					<td class="bg-light-secondary py-2">{{가격정보5항목명}}</td>
					<td class="py-2">{{가격정보5}}</td>
					<td class="bg-light-secondary py-2">{{가격정보6항목명}}</td>
					<td class="py-2">{{가격정보6}}</td>
				</tr>		
				{{/if}}		
			</tbody>
		</table>
		
		<table class="table table-bordered m-1">
			<colgroup>
				<col style="width:140px">
				<col style="width:225px">
				<col style="width:140px">
				<col style="width:auto">
			</colgroup>
			<thead style="font-size:12px;">
		        <tr>
		            <th scope="col" colspan="4">중개인 정보</th>
		        </tr>
		    </thead>
			<tbody>
				<tr>
					<td class="bg-light-secondary py-2">담당자 명</td>
					<td class="py-2" colspan="3">{{담당자}}</td>
				</tr>	
				<tr>
					<td class="bg-light-secondary py-2">담당자 연락처</td>
					<td class="py-2">{{담당자연락처}}</td>
					<td class="bg-light-secondary py-2">담당자 이메일</td>
					<td class="py-2">{{담당자이메일}}</td>
				</tr>	
				<tr>
					<td class="bg-light-secondary py-2">리맥스 가맹점명</td>
					<td class="py-2" colspan="3">{{가맹점명}}</td>
				</tr>
				<tr>
					<td class="bg-light-secondary py-2">중개법인 명칭</td>
					<td class="py-2">{{중개법인명}}</td>
					<td class="bg-light-secondary py-2">중개법인 대표번호</td>
					<td class="py-2">{{중개법인대표번호}}</td>
				</tr>		
				<tr>
					<td class="bg-light-secondary py-2">중개법인 주소</td>
					<td class="py-2" colspan="3">{{중개법인주소}}</td>
				</tr>							
			</tbody>
		</table>
		
		<div class="d-flex justify-content-between">
			<h4 class="font-size-h5 mb-4">&nbsp;</h4>
			<h4 style="font-size: 14px;">
				<span>출처 : 리맥스 코리아_&#35;{{매물코드}}</span>
				<br>
				<span>등록일자 : {{매물등록일}}</span>
			</h4>
		</div>
		
	</div>
{{else}}
	<div class="px-6 py-6 bg-white mb-4">매물 정보가 없습니다.</div>
{{/each}}
<c:out value="</script>" escapeXml="false" />

<!-- 리맥스 매물 정보 엑셀(매매)-->
<c:out value="<script type='text/template' id='tmplTbodyTableRemax_1'>" escapeXml="false" />
{{#each memulExcelArr1}}
	<tr>		
		<td>{{매물코드}}</td>
		<td>{{매물구분}}</td>
		<td>{{pnu코드}}</td>
		<td>{{주소}}</td>
		<td>{{번지}}</td>
		<td>{{건물명}}</td>
		<td>{{층정보}}</td>
		<td>{{면적정보}}</td>
		<td>{{전용면적정보}}</td>
		<td>{{주변환경}}</td>
		<td>{{매물제목}}</td>
		<td>{{상세내용}}</td>
		<td>{{입주예정일}}</td>
		<td>{{가격정보1}}</td>
		<td>{{가격정보2}}</td>
		<td>{{가격정보3}}</td>
		<td>{{가격정보4}}</td>
		<td>{{담당자}}</td>
		<td>{{담당자연락처}}</td>
		<td>{{담당자이메일}}</td>
		<td>{{가맹점명}}</td>
		<td>{{중개법인명}}</td>
		<td>{{중개법인대표번호}}</td>
		<td>{{중개법인주소}}</td>
		<td>{{x좌표}}</td>
		<td>{{y좌표}}</td>
		<td>{{매물등록일}}</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />

<!-- 리맥스 매물 정보 엑셀(임대)-->
<c:out value="<script type='text/template' id='tmplTbodyTableRemax_2'>" escapeXml="false" />
{{#each memulExcelArr2}}
	<tr>		
		<td>{{매물코드}}</td>
		<td>{{매물구분}}</td>
		<td>{{pnu코드}}</td>
		<td>{{주소}}</td>
		<td>{{번지}}</td>
		<td>{{건물명}}</td>
		<td>{{층정보}}</td>
		<td>{{면적정보}}</td>
		<td>{{전용면적정보}}</td>
		<td>{{주변환경}}</td>
		<td>{{매물제목}}</td>
		<td>{{상세내용}}</td>
		<td>{{입주예정일}}</td>
		<td>{{가격정보1}}</td>
		<td>{{가격정보2}}</td>
		<td>{{가격정보3}}</td>
		<td>{{가격정보4}}</td>
		<td>{{가격정보5}}</td>
		<td>{{가격정보6}}</td>
		<td>{{담당자}}</td>
		<td>{{담당자연락처}}</td>
		<td>{{담당자이메일}}</td>
		<td>{{가맹점명}}</td>
		<td>{{중개법인명}}</td>
		<td>{{중개법인대표번호}}</td>
		<td>{{중개법인주소}}</td>
		<td>{{x좌표}}</td>
		<td>{{y좌표}}</td>
		<td>{{매물등록일}}</td>
	</tr>
{{/each}}
<c:out value="</script>" escapeXml="false" />
