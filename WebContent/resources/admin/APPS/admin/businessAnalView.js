'use strict';
// Class definition

var detailView = z.getValue("detailView"),
	seq = z.getValue("seq"),
	searchtext = z.getValue("searchtext");
	
$(function() {	
	fnGetDetail(seq, detailView);	
})

var fnGetDetail = function(seq, detailView) {
	var dataJSONArray = z.xA("Admin","zeons_상권분석상세보기", "select", {"seq" : seq}, "json2");
	var businessAnalDetail = dataJSONArray[0],
	html = "",         	
	status  = '<span class="label font-weight-bold label-lg label-inline">'+businessAnalDetail.공통상세명+'</span>';
		
	var FileArray = '';
	
	html += '<div class="d-flex flex-column-fluid">'
	html += '<div class="container-fluid">'
	html += '<div class="card card-custom card-stretch rounded-0">'
	html += '<div class="card-header align-items-center border-bottom">'
	html +=	'<h3 class="card-title align-items-center">'
	html +=	'<span class="font-weight-bolder text-dark analTitle">공고 & 분기리포트</span></h3>'	
	html +=	'<div class="card-toolbar">'	
	html += '<div class="d-flex align-items-center">'
	html += '<i class="flaticon-buildings text-dark mb-1"></i>'
	html += '<i class="ki ki-arrow-next icon-sm mx-2"></i>'
	html += '공고 & 분기리포트</div>'
	html +=	'</div>'	
	html +=	'</div>'
	html +=	'<div class="card-body pt-9">'
	html +=	'<table class="table">'
	html += '<tbody>'
	html += '<tr>'
	html +=	'<td class="border-0 px-0">'
	html += '<span class="label font-weight-bold label-lg label-inline">' + status + '</span>'
	html += '</td>'
	html +=	'</tr>'	
	html +=	'<tr>'	
	html +=	'<td class="font-size-h5 font-weight-bold px-0">'+ businessAnalDetail.t_title
	html +=	'</td>'		
	html +=	'</tr>'		
	html +=	'<tr>'	
	html +=	'<td class="px-0 regisDate">'
	html +=	'<span class="font-weight-normal font-size-lg"> 등록일: ' + businessAnalDetail.입력일자 + '</span>'
	html +=	'</td>'		
	html +=	'</tr>'	
	html +=	'<tr>'	
	html +=	'<td class="px-0">';		
	html += ' 첨부파일: ';  
	
	if(dataJSONArray[0].첨부파일id != ""){
		
			for(var i = 0; i < dataJSONArray.length; i++){
				html += getExtension(dataJSONArray[i].원본파일명);
				html +='<a href="/admin/file/download.do?atchFileId=' + dataJSONArray[i].첨부파일id + '&fileSn=' + dataJSONArray[i].파일순번 + '" download> ' + dataJSONArray[i].원본파일명;
				html += '</a> &nbsp;';
			}
		
		} else {
		html += '';
	}
	
	html += '</td>'
	html += '</tr>'
	html += '<tr>'
	html +=	'<td class="font-size-lg px-0 border-bottom border-secondary">' + businessAnalDetail.내용
	html += '</td>'	
	html +=	'</tr>'		
	html +=	'</tbody>'		
	html +=	'</table>'		
	html +=	'<div class="text-center mt-16">'		
	html +=	'<a href="javascript:;" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold" onclick="businessAnalList();">목록</a>'	
	html += '</div>'
	html += '</div>'
	html += '</div>'
	html += '</div>'
	html +=	'</div>'

	$("#businessContent").append(html);	
	
	if (detailView == 'N') {
		$('.analTitle').text('공고 & 분기리포트');
	}
	
	if (dataJSONArray[0].수정일자) {
		fnGetUpdateDate(dataJSONArray[0].수정일자);
	}

}

var fnGetUpdateDate = function(date) {
	var $regisDate = $('.regisDate'), 
		$date = date,
		$text = '수정일자:  ' + $date;

	$regisDate.append($('<span/>', {text: '    ' + $text}));  	
}

function getExtension(data){
	
	if(data.slice(-3) == 'png' || data.slice(-4) == 'jpeg' || data.slice(-3) == 'jpg'){
		return '<i class="far fa-file-image"></i>';
	} else if(data.slice(-3) == 'pdf'){
		return '<i class="far fa-file-pdf"></i>';
	} else if(data.slice(-4) == 'xlsx' || data.slice(-3) == 'xls'){
		return '<i class="far fa-file-excel"></i>';
	} else if(data.slice(-3) == 'zip'){
		return '<<i class="far fa-file-archive"></i>';
	} else {
		return '<i class="far fa-file-excel"></i>';
	}
	
}

function businessAnalList(){
	
	 if(detailView == 'Y'){
		 z.setValue('searchtext', searchtext);
		 z.buttonClick("MA0615", "상권분석관리목록", "R");
		 z.menuLink("MA0615");
	 }else{
		 z.setValue('searchtext', searchtext);
		 z.buttonClick("MA0615", "상권분석리포트목록", "R");
		 z.menuLink("MA02");
	 }
 }
 