'use strict';
// Class definition

$(document).ready(function() {
	
	
	var fnGetList = function() {

		/* 
			수정자 	: 김범유 사원
			원 인 	: 게시글을 수정하는 경우 
					  var dataJSONArray = z.xA("Admin","zeons_상권분석상세수정", "select", {"seq":seq}, "json2"); 의 조회하여 셀렉트박스의 값을 변경하는데 
					  셀렉트박스 값을 변경하기 이전 셀렉트박스를 세팅하는 구문이 비동기 처리되어 세팅되어 있지 않은 값으로 셀렉트박스 값을 변경하려 해서 발생하는 문제
			처리방식	: 셀렉트박스를 세팅하는 부분을 비동기에서 동기 방식으로 변경 하여 셀렉트박스를 세팅 후 값을 변경하도록 처리하였습니다. 
					  해당 부분을 비동기로 처리한 이유가 따로 있으시다면 해당 내용 확인 후 적용하여 처리 부탁드립니다.
			
			return z.xAsync("Admin", "zeons_공통코드관리상세", "select", {master: '100200', detail: '', YN: 'Y', order: 'asc'}, "json2").done(function(resp) {
				var	$selectpicker = $("#kt_datatable_search_status");
				var listArr = resp;
				$selectpicker.html('').append($('<option/>', {value: '', text: '전체'}));
				
				for (var i in listArr) {
					var list = listArr[i],
						$opt = $('<option/>', {text: list.공통상세명, value: list.공통상세코드});
					$selectpicker.append($opt);	
				}
				
				$selectpicker.selectpicker('refresh');
			})
		*/
		
		var	$selectpicker = $("#kt_datatable_search_status");
		var listArr = z.xA("Admin", "zeons_공통코드관리상세", "select", {master: '100200', detail: '', YN: 'Y', order: 'asc'}, "json2");
		
		$selectpicker.html('').append($('<option/>', {value: '', text: '전체'}));
		
		for (var i in listArr) {
			var list = listArr[i],
				$opt = $('<option/>', {text: list.공통상세명, value: list.공통상세코드});
			$selectpicker.append($opt);	
		}
		
		$selectpicker.selectpicker('refresh');
		
	};
	
	fnGetList();
	var seq = z.getValue("businessSeq");

	
	var noticeCount =z.xA("Admin", "zeons_상권분석관리유무", "select", {"seq": seq}, "json2");
	

	if( noticeCount[0].count < 1){
		$(".selectpicker").selectpicker();
		$('#submitbusinessAnal').on('click', function(e){
		/*	
			if($('input:checkbox[name=noticeTop]').is(':checked') == true){
				$('#noticeTop').val('Y'); 
			}else{
				$('#noticeTop').val('N');
			}*/
			if($("#kt_datatable_search_status").val() != "" && $("#title").val() != "" && $("#content").val() != "" && $("#noticeYN").val() != ""){
				
				z.msgYN("공고 & 분기리포트를 등록하시겠습니까?",  function (res) {	
					if(res == true){
						var dataJSONArray  = z.xA("Admin", "zeons_상권분석관리", "insert", {"title" : $("#title").val(), "content" : $("#content").val(), "masterSeq" : $("#masterSeq").val(), "noticeYN" : $("#noticeYN").val(), "status" : $("#kt_datatable_search_status").val() }, "json2");
						z.buttonClick("MA0615", "신규등록", "C" );
						z.menuLink("MA0615");
						
					}else{
						return;
					}
				});
			}else{
				if($("#kt_datatable_search_status").val() == ""){
					z.msg("분류 설정해주세요");
					return;        
				}
				if($("#noticeYN").val() == ""){
					z.msg("상권분석구분을 설정해주세요");
					return;
				}
				if($("#title").val() == ""){
					$("#title").focus();
					z.msg("제목을 입력해주세요");
					return;
				}
				if($("#content").val() == ""){
					$("#content").focus();
					z.msg("내용을 입력해주세요");
					return;
				}
			}
		})
	}else{
		
		
		var dataJSONArray = z.xA("Admin","zeons_상권분석상세수정", "select", {"seq":seq}, "json2");
  
		var businessAnalDetail = dataJSONArray[0];
		var checkYn = businessAnalDetail.상단공지여부;
		var checkFile = false;
		var chk = businessAnalDetail.분류;
		
		$('#kt_datatable_search_status').val(businessAnalDetail.분류);
		$('#noticeYN').val(businessAnalDetail.공지구분);
		$('#title').attr('value', businessAnalDetail.t_title);
		$('#content').html(businessAnalDetail.내용);
	
		$(".selectpicker").selectpicker('refresh');
		
		if(dataJSONArray[0].첨부파일id != null && dataJSONArray[0].첨부파일id != ''){
			
			for(var i=0; i<dataJSONArray.length; i++){
				myDropzone4.addFile({ name: dataJSONArray[i].원본파일명, size: dataJSONArray[i].파일사이즈, type: dataJSONArray[i].파일확장자, imageUrl: dataJSONArray[i].파일저장경로, accepted: true});
			}
			$( " .dropzone-select").css('display', 'none');
			$( " .dropzone-upload").css('display', 'none');
			$( " .dropzone-start").css('display', 'none');
			$( " .dropzone-delete").css('display', 'none');

			$('#masterSeq').val(dataJSONArray[0].첨부파일id);
		
		}
		
		$('.dropzone-remove-all').on('click', function(){
			$("#fileUpload").css('display', '');
			$('#masterSeq').val('');
		})
		
		$('#fileUpload').on('click', function(){
			$( " .dropzone-upload").css('display', '');
			$( " .dropzone-start").css('display', '');
			$( " .dropzone-delete").css('display', '');

			$('#masterSeq').val('');
		});
	
		$('#submitbusinessAnal').on('click', function(){
		
			z.msgYN("수정하시겠습니까?",  function (res) {
				if(res == true){
					if($('#masterSeq').val() == null && dataJSONArray[0].첨부파일id != null && dataJSONArray[0].첨부파일id != ''){
						
						$('#masterSeq').val(dataJSONArray[0].첨부파일id);
					}
					
					if($("#kt_datatable_search_status").val() != "" && $("#title").val() != "" && $("#content").val() != "" && $("#noticeYN").val() != ""){
						var dataJSONArray2 = z.xA("Admin", "zeons_상권분석관리", "update", {"title" : $("#title").val(), "content" : $("#content").val(), "masterSeq" : $("#masterSeq").val(), "noticeYN" : $("#noticeYN").val(), "status" : $("#kt_datatable_search_status").val(), "seq" : seq}, "json2");
						z.msg("수정이 완료됐습니다.", function(res){
							if(res){
								z.buttonClick("MA0615", "상권분석수정", "U" );
								z.menuLink("MA0615");
							}
						});
					}else{
						if($("#noticeYN").val() == ""){
							z.msg("상권분석구분을 설정해주세요");
						}
						if($("#kt_datatable_search_status").val() == ""){
							z.msg("분류를 설정해주세요");
						}
						if($("#title").val() == ""){
							$("#title").focus();
							z.msg("제목을 입력해주세요");
						}
						if($("#content").val() == ""){
							$("#content").focus();
							z.msg("내용을 입력해주세요");
						}
					}
				}
			});
		
		});

	}	
})

function businessList(){
	z.menuLink("MA0615");	
}


