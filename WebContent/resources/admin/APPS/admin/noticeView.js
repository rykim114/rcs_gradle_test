'use strict';
// Class definition

var seq = z.getValue("seq");
var dataJSONArray = z.xA("Admin","zeons_공지사항상세보기", "select", {순번 : seq}, "json2");
var noticeDetail = dataJSONArray[0];
var detailView = z.getValue("detailView");
var searchtext = z.getValue("searchtext");

var status = '';

switch(noticeDetail.분류){
case '10':
	status = '<span class="label font-weight-bold label-lg  label-outline-primary label-inline">공지</span>';
	break;
case '20':
	status = '<span class="label font-weight-bold label-lg  label-outline-secondary label-inline">안내</span>';
	break;
case '30': 
	status = '<span class="label font-weight-bold label-lg  label-outline-danger label-inline">업데이트</span>';
	break;
case '40':
	status = '<span class="label font-weight-bold label-lg  label-outline-info label-inline">이벤트</span>';
	break;
default:
	'';
}

var html = "",
	noticeTitle = "";

switch(detailView) {
	case 'Y':
		noticeTitle = '공지사항'
	break;
	case 'N': 
		noticeTitle = '공지관리'
	break;
}         

html += '<div class="d-flex flex-column-fluid">'
html += '<div class="container-fluid">'
html += '<div class="card card-custom card-stretch rounded-0">'
html += '<div class="card-header align-items-center border-bottom">'
html +=	'<h3 class="card-title align-items-center">'
html +=	'<span class="font-weight-bolder text-dark">' + noticeTitle + '</span></h3>'
html +=	'<div class="card-toolbar">'
html +=	'<div class="d-flex align-items-center">'
html +=	'<i class="flaticon-buildings text-dark mb-1"></i>'
html +=	'<i class="ki ki-arrow-next icon-sm mx-2"></i>'
html +=	'<a href="javascript:;">' + noticeTitle +'</a>'
html +=	'</div>'
html +=	'</div>'
html +=	'</div>'
html +=	'<div class="card-body pt-9">'
html +=	'<table class="table">'
html += '<tbody>'
html += '<tr>'
html +=	'<td class="border-0 px-0">'
html += status
html += '</td>'
html +=	'</tr>'	
html +=	'<tr>'	
html +=	'<td class="font-size-h5 font-weight-bold px-0">'+ noticeDetail.t_title
html +=	'</td>'		
html +=	'</tr>'		
html +=	'<tr>'	
html +=	'<td class="px-0">'
html +=	'<span class="font-weight-normal font-size-lg"> 등록일: ' + noticeDetail.입력일자 + '</span>'
html +=	'</td>'		
html +=	'</tr>'	
html +=	'<tr>'	
html +=	'<td class="px-0">'		
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
html +=	'<td class="font-size-lg px-0 border-bottom border-secondary">' + noticeDetail.내용
html += '</td>'	
html +=	'</tr>'		
html +=	'</tbody>'		
html +=	'</table>'		
html +=	'<div class="text-center mt-16">'		
html +=	'<a href="javascript:;" class="btn btn-outline-secondary btn-lg px-11 font-weight-bold" onclick="noticeList();">목록</a>'	
html += '</div>'
html += '</div>'
html += '</div>'
html += '</div>'
html +=	'</div>'

$("#noticeContent").append(html);

function noticeList(){
	
	 if(detailView == 'Y'){
		 z.setValue('searchtext', searchtext);
		 z.buttonClick("MA0515", "공지목록", "R");
		 z.menuLink("MA0515");
	 }else{
		 z.setValue('searchtext', searchtext);
		 z.buttonClick("MA0612", "공지목록", "R");
		 z.menuLink("MA0612");
	 }
 }

function getExtension(data){
	
	if(data.slice(-3) == 'png' || data.slice(-4) == 'jpeg' || data.slice(-3) == 'jpg'){
		return '<i class="far fa-file-image"></i>';
	} else if(data.slice(-3) == 'pdf'){
		return '<i class="far fa-file-pdf"></i>';
	} else if(data.slice(-4) == 'xlsx' || data.slice(-3) == 'xls'){
		return '<i class="far fa-file-excel"></i>';
	} else if(data.slice(-3) == 'zip'){
		return '<i class="far fa-file-archive"></i>';
	} else {
		return '<i class="far fa-file-image"></i>';
	}
	
}

//파일 다운로드
function uf_fileDownload(atchFileId, fileSn) {
	_X.FileDownload(atchFileId, fileSn);
}
 
 


