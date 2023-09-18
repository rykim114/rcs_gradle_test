/**** 전역변수 ******************************************************************************************************************/
var master_code = '';
var detail_code = '';
var whichButton = '';
var corp_code = '';
var isCorpRNCheck = false;
var corp_num = '';

function getCorpCode(){
	$('#corpTitle').text('법인등록');
	$('#navCorpTitle').text('법인등록');
	z.buttonClick("MA0607", "법인관리등록", "C");
	var html_1 = '';
	var html_2 = '';
	var html_3 = '';
	
	var dataJSONArray_1 = z.xA("Admin", "zeons_법인관리대불러오기", "select", {}, "json2");	
	if(dataJSONArray_1.length < 1){
			html_1 += '<option value="0">해당없음</option>';				
	} else {
			for(var i = 0; i < dataJSONArray_1.length; i++){
			html_1 += '<option value="'+ dataJSONArray_1[i].법인마스터코드 +'">'+ dataJSONArray_1[i].법인마스터명 +'</option>'					
		}
		master_code = dataJSONArray_1[0].법인마스터코드;
	}
	
	var dataJSONArray_2 = z.xA("Admin", "zeons_법인관리중불러오기", "select", {"master" : master_code}, "json2");	
	if(dataJSONArray_2.length < 1){
		html_2 += '<option value="0">해당없음</option>';
	} else {		
		for(var i = 0; i < dataJSONArray_2.length; i++){
		html_2 += '<option value="'+ dataJSONArray_2[i].법인상세코드 +'">'+ dataJSONArray_2[i].법인상세명 +'</option>'
		}
		detail_code = dataJSONArray_2[0].법인상세코드;
	}
		
	var dataJSONArray_3 = z.xA("Admin", "zeons_법인관리소불러오기", "select", {"master" : master_code, "detail" : detail_code}, "json2");	
	if(dataJSONArray_3.length < 1){
		html_3 += '<option value="0">해당없음</option>';
	} else {
		for(var i = 0; i < dataJSONArray_3.length; i++){
			html_3 += '<option value="'+ dataJSONArray_3[i].법인상세세부코드 +'">'+ dataJSONArray_3[i].법인상세세부명 +'</option>'
		}
	}
		
	$("#corp1").html(html_1);
	$("#corp2").html(html_2);
	$("#corp3").html(html_3);	
	
	$('input:checkbox[id="useYN"]').prop('checked',true);

	$(".selectpicker").selectpicker('refresh');
}

function updateCorp(corpCode){
	corp_code = corpCode;
	$('#corpTitle').text('법인수정');
	$('#navCorpTitle').text('법인수정');
	z.buttonClick("MA0607", "법인관리수정", "U");
	var html_big = '';
	var html_mid = '';
	var html_sml = '';

	var dataJSONArray_4 = z.xA("Admin", "zeons_법인관리", "select", {"corpCode":corpCode}, "json2");	
	var dataJSONArray_corp1 = z.xA("Admin", "zeons_법인관리대불러오기", "select", {}, "json2");
	var dataJSONArray_corp2 = z.xA("Admin", "zeons_법인관리중불러오기", "select", {"master":dataJSONArray_4[0].법인구분_대}, "json2");
	var dataJSONArray_corp3 = z.xA("Admin", "zeons_법인관리소불러오기", "select", {"master":dataJSONArray_4[0].법인구분_대, "detail":dataJSONArray_4[0].법인구분_중}, "json2");		

	if(dataJSONArray_4[0].법인명 != ""){
		$('#corpName').val(dataJSONArray_4[0].법인명);
	}
	
	if(dataJSONArray_4[0].사업자번호 != ""){
		$('#corpRNumber').val(dataJSONArray_4[0].사업자번호);
		corp_num = dataJSONArray_4[0].사업자번호;
	}
	
	if(dataJSONArray_4[0].담당자 != ""){
		$('#userName').val(dataJSONArray_4[0].담당자);
	}
	
	if(dataJSONArray_4[0].담당자연락처 != ""){
		$('#telNumber').val(dataJSONArray_4[0].담당자연락처);
	}	

	if(dataJSONArray_corp1.length < 1){
		html_big += '<option value="0">해당없음</option>'
	} else {
		for(var i = 0; i< dataJSONArray_corp1.length; i++){
			if(dataJSONArray_corp1[i].법인마스터코드 == dataJSONArray_4[0].법인구분_대){
				html_big += '<option selected value="'+ dataJSONArray_corp1[i].법인마스터코드 +'">'+ dataJSONArray_corp1[i].법인마스터명 +'</option>'		
			} else {
				html_big += '<option value="'+ dataJSONArray_corp1[i].법인마스터코드 +'">'+ dataJSONArray_corp1[i].법인마스터명 +'</option>'				
			}
		}
	}
	
	if(dataJSONArray_corp2.length < 1 || dataJSONArray_4[0].법인구분_중 == ""){
		html_mid += '<option value="0">해당없음</option>'
	} else {
		for(var i = 0; i< dataJSONArray_corp2.length; i++){
			if(dataJSONArray_corp2[i].법인상세코드 == dataJSONArray_4[0].법인구분_중){
				html_mid += '<option selected value="'+ dataJSONArray_corp2[i].법인상세코드 +'">'+ dataJSONArray_corp2[i].법인상세명 +'</option>'		
			} else {
				html_mid += '<option value="'+ dataJSONArray_corp2[i].법인상세코드 +'">'+ dataJSONArray_corp2[i].법인상세명 +'</option>'		
			}
		}
	}
	
	if(dataJSONArray_corp3.length < 1 || dataJSONArray_4[0].법인구분_소 == ""){
		html_sml += '<option value="0">해당없음</option>'
	} else {
		for(var i = 0; i< dataJSONArray_corp3.length; i++){
			if(dataJSONArray_corp3[i].법인상세세부코드 == dataJSONArray_4[0].법인구분_소){
				html_sml += '<option selected value="'+ dataJSONArray_corp3[i].법인상세세부코드 +'">'+ dataJSONArray_corp3[i].법인상세세부명 +'</option>'		
			} else {				
				html_sml += '<option value="'+ dataJSONArray_corp3[i].법인상세세부코드 +'">'+ dataJSONArray_corp3[i].법인상세세부명 +'</option>'
			}
		}
	}
	
	$("#corp1").html(html_big);	
	$("#corp2").html(html_mid);	
	$("#corp3").html(html_sml);	
	
	if(dataJSONArray_4[0].사용여부 == 'Y'){
		$('input:checkbox[id="useYN"]').prop('checked',true);
	} else {
		$('input:checkbox[id="useYN"]').prop('checked',false);			
	}
	
	$(".selectpicker").selectpicker('refresh');	
}

$('#corp1').change(function(){
	var masterCode = $('#corp1 option:selected').val();	
	var dataJSONArray_mid = z.xA("Admin", "zeons_법인관리중불러오기", "select", {"master" : masterCode}, "json2");
	var html_2 = '';
	
	if(dataJSONArray_mid.length < 1){
		detail1 = "";		
		html_2 += '<option value="0">해당없음</option>'
	} else {
		detail1 = dataJSONArray_mid[0].법인상세코드;
		for(var i = 0; i < dataJSONArray_mid.length; i++){
		html_2 += '<option value="'+ dataJSONArray_mid[i].법인상세코드 +'">'+ dataJSONArray_mid[i].법인상세명 +'</option>'
		}		 
	}
	$("#corp2").html(html_2);
			
	var dataJSONArray_sm = z.xA("Admin", "zeons_법인관리소불러오기", "select", {"master" : masterCode, "detail" : detail1}, "json2");
	var html_3 = '';
			
	if(dataJSONArray_sm.length < 1){
		html_3 += '<option value="0">해당없음</option>'
	} else {
		for(var i = 0; i < dataJSONArray_sm.length; i++){
		html_3 += '<option value="'+ dataJSONArray_sm[i].법인상세세부코드 +'">'+ dataJSONArray_sm[i].법인상세세부명 +'</option>'
		}
		var detailCode = $('#corp2 option:selected').val();			
	}
	
	$("#corp3").html(html_3);
	$(".selectpicker").selectpicker('refresh');
	master_code = masterCode;	
//	detail_code = detailCode;	
});

$('#corp2').change(function(){
	var detailCode = $('#corp2 option:selected').val();	
	var dataJSONArray = z.xA("Admin", "zeons_법인관리소불러오기", "select", {"master" : master_code, "detail" : detailCode}, "json2");
	var html_3 = '';
	
	if(dataJSONArray.length < 1){
		html_3 += '<option value="0">해당없음</option>'
	}

	for(var i = 0; i < dataJSONArray.length; i++){
		html_3 += '<option value="'+ dataJSONArray[i].법인상세세부코드 +'">'+ dataJSONArray[i].법인상세세부명 +'</option>'
	}
	$("#corp3").html(html_3);
	
	$(".selectpicker").selectpicker('refresh');
//	detail_code = detailCode;	
});

function insertCorp(){	
	
	var 법인구분_대 = $("#corp1 option:selected").val();
	var 법인구분_중 = $("#corp2 option:selected").val();
	var 법인구분_소 = $("#corp3 option:selected").val();
	var 사업자번호 = $('#corpRNumber').val();
	var 담당자 = $('#userName').val();
	var 담당자연락처 = $('#telNumber').val();	
	var corpRN = 사업자번호.replace(/-/g,'');
	var telN = 담당자연락처.replace(/-/g,'');
	
	if(사업자번호 == ""){
		z.msg('사업자번호를 등록해 주세요.'); 
		return;
	}
	
	var useYN = '';
	if($("input:checkbox[id='useYN']").is(":checked")){		
		useYN = 'Y'
	} else {
		useYN = 'N'
	}
	
	if($('#corpName').val() == ""){
		z.msg('법인명을 입력해주세요.'); return;
	} else {
		var 법인명 = $('#corpName').val();
		switch( whichButton ) {			
			case 'update':
			
				if( corp_num != 사업자번호 ){
					if( (corpRN !='0000000000') && (isCorpRNCheck == false)){
						z.msg('사업자번호 중복확인을 먼저 해주세요.'); return;
					}					
				} else {
					var dataJSONArray_1 = z.xA("Admin", "zeons_법인관리수정", "update", {"corpCode":corp_code,"법인명":법인명, "법인구분_대":법인구분_대, "법인구분_중":법인구분_중, "법인구분_소":법인구분_소, "담당자":담당자, "담당자연락처":telN, "사업자번호":corpRN, "사용여부":useYN	}, "json2");
					$('#corpName').val('');
					$('#userName').val('');
					$('#telNumber').val('')
					$('#corpRNumber').val('');
					$("#corp1").selectpicker("refresh");
					$("#corp2").selectpicker("refresh");
					$("#corp3").selectpicker("refresh");
						
					z.msg('법인정보가 성공적으로 수정되었습니다.');
					z.buttonClick("MA0607", "법인등록조회", "R" );
					z.menuLink("MA0607");	
					$(".selectpicker").selectpicker();						
				}	
			break;
			
			case 'insert':
			
				if( (corpRN !='0000000000') && (isCorpRNCheck == false)){
					z.msg('사업자번호 중복확인을 먼저 해주세요.'); return;
				}
				z.buttonClick("MA0607", "법인관리신규등록", "C");
				var corpName = $('#corpName').val();
				var dataJSONArray = z.xA("Admin", "zeons_법인관리법인명체크", "select", {"corpName":corpName}, "json2");
				if(dataJSONArray.length > 0){
					z.msgYN("중복된 법인명이 존재합니다. 그래도 진행하시겠습니까?", function(res){
						if(res == true){
							    var dataJSONArray_1 = z.xA("Admin", "zeons_법인관리등록", "insert", {"법인명":법인명, "법인구분_대":법인구분_대, "법인구분_중":법인구분_중, "법인구분_소":법인구분_소, "담당자":담당자, "담당자연락처":telN, "사업자번호":corpRN, "사용여부":useYN}, "json2");
								$('#corpName').val('');
								$('#userName').val('');
								$('#telNumber').val('')
								$('#corpRNumber').val('');
								$("#corp1").selectpicker("refresh");
								$("#corp2").selectpicker("refresh");
								$("#corp3").selectpicker("refresh");
									
								z.msg('법인정보가 성공적으로 등록되었습니다.');
								z.buttonClick("MA0607", "법인등록조회", "R" );
								z.menuLink("MA0607");
							} else {
								
							}
						})		
					} else {
					 	var dataJSONArray_1 = z.xA("Admin", "zeons_법인관리등록", "insert", {"법인명":법인명, "법인구분_대":법인구분_대, "법인구분_중":법인구분_중, "법인구분_소":법인구분_소, "담당자":담당자, "담당자연락처":telN, "사업자번호":corpRN, "사용여부":useYN}, "json2");
						$('#corpName').val('');
						$('#userName').val('');
						$('#telNumber').val('')
						$('#corpRNumber').val('');
						$("#corp1").selectpicker("refresh");
						$("#corp2").selectpicker("refresh");
						$("#corp3").selectpicker("refresh");
							
						z.msg('법인정보가 성공적으로 등록되었습니다.');
						z.buttonClick("MA0607", "법인등록조회", "R" );
						z.menuLink("MA0607");
						//$('#kt_cor_modal').modal('toggle');	
						//$('#kt_datatable').KTDatatable().destroy();
					
						//KTDatatableCorporation.init();
						//$(".selectpicker").selectpicker();			
			break;	
						
			}				
		}			
	}
}

$('#corpRNumber').keyup(function(){
	var str = $('#corpRNumber').val();
	if(str.length == 12){
		var str_1 = str.replace(/-/g,'');
		if(str_1.length > 10 && str != ""){
			$('#corpRNumber').attr('disabled',true);
			$('#corpRNumber').val(''); 
			z.msg("사업자번호 양식이 틀립니다.");
			$('#corpRNumber').attr('disabled',false);		
		}
	}
})

$("#corpRNumber").focusout(function(){
	var str = $('#corpRNumber').val();
	var str_1 = str.replace(/-/g,'');
	
	if(str_1.length < 10 && str != ""){
		$('#corpRNumber').val(''); 
		z.msg("사업자번호 양식이 틀립니다.");		
		return;				 		
	} else if(str.length >= 0 && checkNum(str) == true){
		if(str.length == 10){
			var str_1 = str.substring(0,3);
			var str_2 = str.substring(2,4);
			var str_3 = str.substring(5,10);
			var corpRNumber = str_1.concat('-', str_2, '-', str_3);
			$('#corpRNumber').val(corpRNumber);	
		}		
	} else {
		$('#corpRNumber').val(''); 
		z.msg("사업자번호 양식이 틀립니다.");		
		return;
	}
});

$("#telNumber").keyup(function(e){
	e.preventDefault();
	var str = $('#telNumber').val();
	if(str.length > 0 && checkNum(str) == false){
		z.msg('숫자만 입력해주세요.');
		$('#telNumber').val('');		
	}
});

function checkNum(str){
	if (/[0-9]/.test(str) || str.length == 0){
		return true;
	} else {
		return false;
	}
}

function corpRNcheck(){
	var corpRNCheck = $('#corpRNumber').val();
	var str_corp = corpRNCheck.replace(/-/g,'');
	if(str_corp != '0000000000'){
		var dataJSONArray_count = z.xA("Admin", "zeons_법인관리사업자번호체크", "select", {"사업자번호":str_corp}, "json2");
		if(dataJSONArray_count[0].count > 1){
			z.msg('중복된 사업자번호가 존재합니다. <br/>다시 입력해 주세요.');
			$('#corpRNumber').val('');
			isCorpRNCheck = false;
		} else {		
			z.msg('입력하신 사업자번호를 사용하셔도 좋습니다.');
			isCorpRNCheck = true;
		}
	} else{
		z.msg('데모용 사업자번호를 등록하셨습니다.');
		isCorpRNCheck = true;
	}

}

$('#corpRNumber').keyup(function(){
	isCorpRNCheck = false;
	var corpRNCheck = $('#corpRNumber').val();
	var str_corp_check = corpRNCheck.replace(/-/g,'');
	if(str_corp_check == '0000000000'){
		isCorpRNCheck = true;
	}
	
});


$('#cancel').on('click', function(){
	$('#corpName').val('');
	$('#userName').val('');
	$('#telNumber').val('')
	$('#corpRNumber').val('');
	$("#corp1").selectpicker("refresh");
	$("#corp2").selectpicker("refresh");
	$("#corp3").selectpicker("refresh");
	z.buttonClick("MA0607", "법인등록조회", "R" );
	z.menuLink("MA0607");
})


jQuery(document).ready(function() {
	$(".selectpicker").selectpicker();
	whichButton = z.getValue("button");
	var corpCode = z.getValue("seq");
	
	if(whichButton === 'insert'){
		getCorpCode();
	} else {
		updateCorp(corpCode);
	}
});