/**** 전역변수  START******************************************************************************************************************/
var master_code = '';
var detail_code = '';
var master_code_modal = '';
var detail_code_modal = '';
/**** 전역변수 END******************************************************************************************************************/

/*var KTAccountSelect2 = function() {

    var demos = function() {
        $('#kt_select2_1_modal').select2({
            placeholder: "법인명을 선택해주세요",
            allowClear: true,
        });
        $('#kt_select2_2_modal').select2({
            placeholder: "법인명을 선택해주세요",
            allowClear: true,
        });
    }

    // Public functions
    return {
        init: function() {
            demos();
        }
    };
}();*/

/*function getContract(){
	var html_cont = '';
	var dataJSONArray_cont = z.xA("Admin", "zeons_공통코드관리상세", "select", {"master":'100000','YN':'Y'}, "json2");

	if(dataJSONArray_cont.length < 1) {
		html_cont += '<option value="0">해당없음</option>';	
	} else {
		for(var i = 0; i < dataJSONArray_cont.length; i++){
			html_cont += '<option value="'+ dataJSONArray_cont[i].공통상세코드 +'">'+ dataJSONArray_cont[i].공통상세명 +'</option>'					
		}
	}		
	
	$('#contract').html(html_cont);
	$(".selectpicker").selectpicker('refresh');
}*/

function getCorp(code){	
	var corp_1 = '';
	var corp_2 = '';
	var corp_3 = '';
	var corpCode = '';
	
	if(code != ""){
		corpCode = code;
	
//		var dataJSONArray_1 = z.xA("Admin", "zeons_법인관리대불러오기", "select", {}, "json2");
		var dataJSONArray_corp_big = z.xA("Admin", "zeons_법인관리", "select", {"corpCode":corpCode,'YN':'Y'}, "json2");
		
		if(dataJSONArray_corp_big.length < 1) {
			corp_1.val('해당없음');
		} else {
			corp_1.val(dataJSONArray_corp_big[0].법인마스터명);		
			master_code = dataJSONArray_corp_big[0].법인마스터코드;	
		}		
	} else {
		var dataJSONArray_corp_big = z.xA("Admin", "zeons_법인관리", "select", {'YN':'Y'}, "json2");
		if(dataJSONArray_corp_big.length < 1){
			corp_1.val('해당없음');
		} else {
			corp_1.val(dataJSONArray_corp_big[0].법인마스터명);
			master_code = dataJSONArray_corp_big[0].법인마스터코드;
		}		
	}
/*		if(dataJSONArray_1.length < 1){
				html_1 += '<option value="0">해당없음</option>';				
		} else {
				for(var i = 0; i < dataJSONArray_1.length; i++){
					if(dataJSONArray_corp_big[0].법인구분_대 == dataJSONArray_1[i].법인마스터코드){
						html_1 += '<option selected value="'+ dataJSONArray_1[i].법인마스터코드 +'">'+ dataJSONArray_1[i].법인마스터명 +'</option>';		
					} else {					
						html_1 += '<option value="'+ dataJSONArray_1[i].법인마스터코드 +'">'+ dataJSONArray_1[i].법인마스터명 +'</option>';					
					}
				}
			master_code = dataJSONArray_corp_big[0].법인구분_대;
		}
	
	} else {
		var dataJSONArray_1 = z.xA("Admin", "zeons_법인관리대불러오기", "select", {}, "json2");
		if(dataJSONArray_1.length < 1){
				html_1 += '<option value="0">해당없음</option>';				
		} else {
				for(var i = 0; i < dataJSONArray_1.length; i++){
				html_1 += '<option value="'+ dataJSONArray_1[i].법인마스터코드 +'">'+ dataJSONArray_1[i].법인마스터명 +'</option>'					
			}
			master_code = dataJSONArray_1[0].법인마스터코드;
		}
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
	}*/
		
/*	$("#corp1").val(html_1);
	$("#corp2").val(html_2);
	$("#corp3").val(html_3);

	$(".selectpicker").selectpicker('refresh');*/	
}

/*function getCorpNameList(){
	var html_corpName = '';
	var dataJSONArray_corpName = z.xA("Admin", "zeons_법인관리", "select", {'YN':'Y'}, "json2");
	
	if(dataJSONArray_corpName.length < 1) {
		html_corpName += '<option value="0">해당없음</option>';	
	} else {
		for(var i = 0; i < dataJSONArray_corpName.length; i++){
			html_corpName += '<option value="'+ dataJSONArray_corpName[i].법인코드 +'">'+ dataJSONArray_corpName[i].법인명 +'</option>'					
		}
	}	

	$('#kt_select2_1_modal').html(html_corpName);
	$(".selectpicker").selectpicker('refresh');		
		
}*/

$('#kt_select2_1_modal').on('change',function(){
	var corpCode = $('#kt_select2_1_modal option:selected').val();
	getCorp(corpCode);
});


/*function getGroup(){
	var html_group = '';
	var dataJSONArray_group = z.xA("Admin", "zeons_공통코드관리상세", "select", {"master":'100001','YN':'Y'}, "json2");
	
	if(dataJSONArray_group.length < 1) {
		html_group += '<option value="0">해당없음</option>';	
	} else {
		for(var i = 0; i < dataJSONArray_group.length; i++){
			html_group += '<option value="'+ dataJSONArray_group[i].공통상세코드 +'">'+ dataJSONArray_group[i].공통상세명 +'</option>'					
		}
	}	

	$('#group').html(html_group);
}*/

/*function getRights(){
	var html_rights = '';
	var dataJSONArray_rights = z.xA("Admin", "zeons_공통코드관리상세", "select", {"master":'100002','YN':'Y'}, "json2");
	
	if(dataJSONArray_rights.length < 1) {
		html_rights += '<option value="0">해당없음</option>';	
	} else {
		for(var i = 0; i < dataJSONArray_rights.length; i++){
			html_rights += '<option value="'+ dataJSONArray_rights[i].공통상세코드 +'">'+ dataJSONArray_rights[i].공통상세명 +'</option>'					
		}
	}	
	
	$('#rights').html(html_rights);	
}*/

/*function getPc(){
	var html_pc = '';
	var dataJSONArray_pc = z.xA("Admin", "zeons_공통코드관리상세", "select", {"master":'100003','YN':'Y'}, "json2");
	
	if(dataJSONArray_pc.length < 1) {
		html_pc += '<option value="0">해당없음</option>';	
	} else {
		for(var i = 0; i < dataJSONArray_pc.length; i++){
			html_pc += '<option value="'+ dataJSONArray_pc[i].공통상세코드 +'">'+ dataJSONArray_pc[i].공통상세명 +'</option>'					
		}
	}	
	
	$('#pcCapacity').html(html_pc);	
}*/

/*$('#corp1').change(function(){
	var masterCode = $('#corp1 option:selected').val();	
	var dataJSONArray_mid = z.xA("Admin", "zeons_법인관리중불러오기", "select", {"master" : masterCode}, "json2");
	var html_2 = '';
	
	if(dataJSONArray_mid.length < 1){
		detailCode = '';
		html_2 += '<option value="0">해당없음</option>'
	} else {
		detail1Code = dataJSONArray_mid[0].법인상세코드;
		for(var i = 0; i < dataJSONArray_mid.length; i++){
			html_2 += '<option value="'+ dataJSONArray_mid[i].법인상세코드 +'">'+ dataJSONArray_mid[i].법인상세명 +'</option>'
		}		
	}
	$("#corp2").html(html_2);
		
//	var dataJSONArray_sm = z.xA("Admin", "zeons_법인관리소불러오기", "select", {"master" : masterCode, "detail" : dataJSONArray_mid[0].법인상세코드}, "json2");
	var dataJSONArray_sm = z.xA("Admin", "zeons_법인관리소불러오기", "select", {"master" : masterCode, "detail" : detailCode}, "json2");
	var html_3 = '';
	
	if(dataJSONArray_sm.length < 1){
		html_3 += '<option value="0">해당없음</option>'
	}

	for(var i = 0; i < dataJSONArray_sm.length; i++){
		html_3 += '<option value="'+ dataJSONArray_sm[i].법인상세세부코드 +'">'+ dataJSONArray_sm[i].법인상세세부명 +'</option>'
	}
	$("#corp3").html(html_3);
		
	$(".selectpicker").selectpicker('refresh');
	master_code = masterCode;	
	detail_code = detailCode;	
});*/

/*$('#corp2').change(function(){
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
	detail_code = detailCode;	
});*/


/*$('#pcCapacity').change(function(){
	var pcArr = $("#pcCapacity option:selected").val();
	var dataJSONArray_getPc = z.xA("Admin", "zeons_공통코드관리상세", "select", {"master" : "100003", "detail" : pcArr}, "json2");
	var pcVal = dataJSONArray_getPc[0].공통상세명.replace(/대/g,'');
	$('#pcQty').text(pcVal);
	var html = '';
	
	for(var i = 0; i < pcVal; i++){		
		html += '<div class="mb-2">'
		html += '<input class="form-control form-control-solid border border-secondary rounded-sm pc-list" type="text" placeholder="IP를 입력해주세요.">'
		html += '</div>'		
	}
	$("#pcInput").html(html);
});*/


/**** 법인등록 모달  ******************************************************************************************************************/
/*function getCorpCode(){
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
		master_code_modal = dataJSONArray_1[0].법인마스터코드;
	}
	
	var dataJSONArray_2 = z.xA("Admin", "zeons_법인관리중불러오기", "select", {"master" : master_code_modal}, "json2");	
	if(dataJSONArray_2.length < 1){
		html_2 += '<option value="0">해당없음</option>';
	} else {		
		for(var i = 0; i < dataJSONArray_2.length; i++){
		html_2 += '<option value="'+ dataJSONArray_2[i].법인상세코드 +'">'+ dataJSONArray_2[i].법인상세명 +'</option>'
		}
		detail_code_modal = dataJSONArray_2[0].법인상세코드;
	}
		
	var dataJSONArray_3 = z.xA("Admin", "zeons_법인관리소불러오기", "select", {"master" : master_code_modal, "detail" : detail_code_modal}, "json2");	
	if(dataJSONArray_3.length < 1){
		html_3 += '<option value="0">해당없음</option>';
	} else {
		for(var i = 0; i < dataJSONArray_3.length; i++){
			html_3 += '<option value="'+ dataJSONArray_3[i].법인상세세부코드 +'">'+ dataJSONArray_3[i].법인상세세부명 +'</option>'
		}
	}
		
	$("#corpModal_1").html(html_1);
	$("#corpModal_2").html(html_2);
	$("#corpModal_3").html(html_3);	

	$(".selectpicker").selectpicker('refresh');
}*/

/*$('#corpModal_1').change(function(){
	var masterCode = $('#corpModal_1 option:selected').val();	
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
	$("#corpModal_2").html(html_2);
			
	var dataJSONArray_sm = z.xA("Admin", "zeons_법인관리소불러오기", "select", {"master" : masterCode, "detail" : detail1}, "json2");
	var html_3 = '';
			
	if(dataJSONArray_sm.length < 1){
		html_3 += '<option value="0">해당없음</option>'
	} else {
		for(var i = 0; i < dataJSONArray_sm.length; i++){
		html_3 += '<option value="'+ dataJSONArray_sm[i].법인상세세부코드 +'">'+ dataJSONArray_sm[i].법인상세세부명 +'</option>'
		}
		var detailCode = $('#corpModal_2 option:selected').val();			
	}
	
	$("#corpModal_3").html(html_3);
	$(".selectpicker").selectpicker('refresh');
	master_code_modal = masterCode;	
	detail_code_modal = detailCode;	
});*/

/*$('#corpModal_2').change(function(){
	var detailCode = $('#corpModal_2 option:selected').val();	
	var dataJSONArray = z.xA("Admin", "zeons_법인관리소불러오기", "select", {"master" : master_code_modal, "detail" : detailCode}, "json2");
	var html_3 = '';
	
	if(dataJSONArray.length < 1){
		html_3 += '<option value="0">해당없음</option>'
	}

	for(var i = 0; i < dataJSONArray.length; i++){
		html_3 += '<option value="'+ dataJSONArray[i].법인상세세부코드 +'">'+ dataJSONArray[i].법인상세세부명 +'</option>'
	}
	$("#corpModal_3").html(html_3);
	
	$(".selectpicker").selectpicker('refresh');
	detail_code_modal = detailCode;	
});*/

/*$("#corpRNumber").focusout(function(){
	var str = $('#corpRNumber').val();
	var str_1 = str.replace(/-/g,'');
	
	if(str_1.length < 10){
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
});*/

/*$('#corpRNumber').keyup(function(){
	var str = $('#corpRNumber').val();
	if(str.length == 12){
		var str_1 = str.replace(/-/g,'');
		if(str_1.length > 10){
			$('#corpRNumber').attr('disabled',true);
			$('#corpRNumber').val(''); 
			z.msg("사업자번호 양식이 틀립니다.");
			$('#corpRNumber').attr('disabled',false);		
		}
	}
})*/

/*$("#telNumberModal").keyup(function(e){
	e.preventDefault();
	var str = $('#telNumberModal').val();
	if(str.length > 0 && checkNum(str) == false){
		z.msg('숫자만 입력해주세요.');
		$('#telNumberModal').val('');		
	}
});*/

/*function checkNum(str){
	if (/[0-9]/.test(str) || str.length == 0){
		return true;
	} else {
		return false;
	}
}*/

function insertCorp(){
	var 법인구분_대 = $("#corpModal_1 option:selected").val();
	var 법인구분_중 = $("#corpModal_2 option:selected").val();
	var 법인구분_소 = $("#corpModal_3 option:selected").val();
	var 사업자번호 = $('#corpRNumber').val();
	var 담당자 = $('#userNameModal').val();
	var 담당자연락처 = $('#telNumberModal').val();	
	var corpRN = 사업자번호.replace(/-/g,'');
	var telN = 담당자연락처.replace(/-/g,'');	
	
	if($('#corpName').val() == ""){
		z.msg('법인명을 입력해주세요.'); return;
	} else {
		z.buttonClick("MA0607", "법인관리신규등록", "C");
		var corpName = $('#corpName').val();
		var dataJSONArray_corpCheck = z.xA("Admin", "zeons_법인관리법인명체크", "select", {"corpName":corpName}, "json2");
		if(dataJSONArray_corpCheck.length > 0){
			z.msgYN("중복된 법인명이 존재합니다. 그래도 진행하시겠습니까?", function(res){
				if(res == true){
			    	var dataJSONArray_insertCorp_1 = z.xA("Admin", "zeons_법인관리등록", "insert", {"법인명":corpName, "법인구분_대":법인구분_대, "법인구분_중":법인구분_중, "법인구분_소":법인구분_소, "담당자":담당자, "담당자연락처":telN, "사업자번호":corpRN}, "json2");					
						$('#corpName').val('');
						$('#userNameModal').val('');
						$('#telNumberModal').val('')
						$('#corpRNumber').val('');
						$("#corpModal_1").selectpicker("refresh");
						$("#corpModal_2").selectpicker("refresh");
						$("#corpModal_3").selectpicker("refresh");
							
						z.msg('법인정보가 성공적으로 등록되었습니다.');
						$('#kt_cor_modal').modal('hide');	
					
						$(".selectpicker").selectpicker();	
						getCorpNameList();						

				} else {
					
				}
			})
		} else {
    		var dataJSONArray_insertCorp_2 = z.xA("Admin", "zeons_법인관리등록", "insert", {"법인명":corpName, "법인구분_대":법인구분_대, "법인구분_중":법인구분_중, "법인구분_소":법인구분_소, "담당자":담당자, "담당자연락처":telN, "사업자번호":corpRN}, "json2");
			$('#corpName').val('');
			$('#userNameModal').val('');
			$('#telNumberModal').val('')
			$('#corpRNumber').val('');
			$("#corpModal_1").selectpicker("refresh");
			$("#corpModal_2").selectpicker("refresh");
			$("#corpModal_3").selectpicker("refresh");
				
			z.msg('법인정보가 성공적으로 등록되었습니다.');
			$('#kt_cor_modal').modal('hide');	
		
			$(".selectpicker").selectpicker();
			getCorpNameList();
		}
	}		
}


function closeModal(){
	$('#corpName').val('');
	$('#userName').val('');
	$('#telNumber').val('')
	$('#corpRNumber').val('');
	$("#corpModal_1").selectpicker("refresh");
	$("#corpModal_2").selectpicker("refresh");
	$("#corpModal_3").selectpicker("refresh");	
}

/**** SUBMIT START******************************************************************************************************************/
var isIdChecked = false;

function checkId(){
	var userId = $('#userId').val().trim();
	if(userId!=""){
		var dataJSONArray_1 = z.xA("Admin", "zeons_아이디중복체크", "select", {"아이디":userId}, "json2");
		
		if(dataJSONArray_1[0].user_id > 0){
			isIdChecked = false;
			z.msg("이미 사용중인 아이디입니다.");
		} else {
			isIdChecked = true;
			z.msg("이 아이디는 사용하실 수 있습니다.");
		}
	}else{
		z.msg("아이디를 입력해주세요.");
	}
	
	/*
	if(dataJSONArray_1[0].user_id > 0){
		isIdChecked = false;
		z.msg("이미 사용중인 아이디입니다.");
	} else {		
		if(userId.length < 5){
			z.msg("아이디는 5글자 이상이어야 합니다.");
			isIdChecked = false;
			$('#userId').focus();
		} else {
			isIdChecked = true;
			z.msg("이 아이디는 사용하실 수 있습니다.");
		}		
	}*/
}

function chkPassword(str) {
	var passCnt = 0;
	
	if(str.length >= 8)
		passCnt++;
	if (/[a-z]/.test(str) || /[A-Z]/.test(str))
		passCnt++;
	if (/[0-9]/.test(str))
		passCnt++;
	if (/[!@#\$%\^&\*]/.test(str))
		passCnt++;

	return (passCnt >= 4);
}

/*function to_date(date_str){
    var yyyyMMdd = String(date_str);
    var sYear = yyyyMMdd.substring(0,4);
    var sMonth = yyyyMMdd.substring(5,7);
    var sDate = yyyyMMdd.substring(8,10);

    //alert("sYear :"+sYear +"   sMonth :"+sMonth + "   sDate :"+sDate);
    return new Date(Number(sYear), Number(sMonth)-1, Number(sDate));
}
*/
function parse(str) {
    var y = str.substr(0, 4);
    var m = str.substr(4, 2);
    var d = str.substr(6, 2);
    return new Date(y,m-1,d);
}

function resetPW(){
	return 'R12345678!';
}

$('#submit').on('click', function(){
	if($("[name=addrSearchText]").val().trim()==""){
		z.msg('법인을 선택해주세요.');
		$("[name=addrSearchText]").focus();
		return;
	}
	
	if($("#userId").val().trim()==""){
		z.msg('아이디를 입력해 주세요.');
		$("#userId").focus();
		return;
	}
	
	if(z.getValue("seq")=="" || z.getValue("seq")==null){
		if( isIdChecked == false){
			z.msg('아이디 중복확인이 필요합니다.');
			$('#userId').focus();
			return;
		}
	}
	
	if($('#userName') == "" || $('#userName') == null){
		z.msg('사용자 명을 입력해주세요.');
		$('#userName').focus();
		return;
	}
	
	if($('#userNumber').val().trim() == ""){
		z.msg('사용자 연락처를 입력해주세요.');
		$('#userNumber').focus();
		return;
	}
	
	var date_1 = $('input[name=start]').val();
	var date_2 = $('input[name=end]').val();
	
	if($('#kt_datepicker_2_1') == "" || $('#kt_datepicker_2_1') == null){
		z.msg('계약일자 선택해주세요.');
		$('##kt_datepicker_2_1').focus();
		return;
	}
	
	if(date_1 === date_2){
		z.msgYN('사용기간이 하루 맞습니까?', function (res){
			if(res){
				date_1 = $('input[name=start]').val();
				date_2 = $('input[name=end]').val();
			} else {
				$('input[name=start]').val('');
				$('input[name=end]').val('');
				return;
			}
		});
	}
	
	if($('input[name=start]').val() == "" || $('input[name=start]').val() == null || $('input[name=end]').val() == "" || $('input[name=end]').val() == null){
		z.msg('사용기간을 선택해주세요.');
		$('#kt_datepicker_1').focus();
		return;
	}
	
	/*var data_corp = {
			"법인코드": $("#corpCode").val(),
			"법인구분_대": $('#corpDetail1code').val(),
			"법인구분_중": $('#corpDetail2code').val(),
		};*/
	
	var data_user = {
		"아이디": $.trim($('#userId').val()),
		"사용자이름": $.trim($('#userName').val()),
		"전화번호": $.trim($('#userNumber').val()),
		"계약구분": $.trim($('#contract1').val()),
		"그룹코드": $.trim($('#contract2').val()),
		"계약일자": $.trim($('#kt_datepicker_2_1').val()),
		"계약시작일": $('input[name=start]').val(),
		"계약종료일": $('input[name=end]').val(),
		"메모": $.trim($('#remarks').val()),
		"법인코드": $("#corpCode").val(),
		"PC등록대수":$("#ipMax option:selected").val()
	};	
	if(z.getValue("seq")!="" && z.getValue("seq")!=null){
		var dataJSONArray_2 = z.xA("Admin", "zeons_계정관리수정", "update", data_user, "json2");
	}else{
		data_user.비밀번호 = getPwd();
		data_user.접속오류수 = '0';
		data_user.로그인락 = 'N';
		var dataJSONArray_2 = z.xA("Admin", "zeons_계정관리등록", "insert", data_user, "json2");
	}
	
	/*//var dataJSONArray_21 = z.xA("Admin", "zeons_계정관리법인등록", "insert", data_corp, "json2");*/
	var pc = $('#ipMax option:selected').val();
	if(pc > 0){
		/*//var dataJSONArray_getPc = z.xA("Admin", "zeons_공통코드관리상세", "select", {"master" : "100003", "detail" : pc}, "json2");
		//var pcVol = dataJSONArray_getPc[0].공통상세명.replace(/대/g,'');*/
		var first,second;
		for(var i = 0; i < pc; i++){
			var aObj = $(".ipList > li").eq(i).find("input");
			first = aObj[0].value;
			second = aObj[1].value;
			if(second!="" && !ipcheckInFuntion(second)){
				z.msg("아이피를 다시 확인해주세요.");
				$(aObj[1]).focus();
				break;
			}
		}
	}
	
	if(z.getValue("seq")!="" && z.getValue("seq")!=null){
		z.xA("Admin", "zeons_계정관리pc삭제", "delete", {"targetId":z.getValue("seq")}, "json2");
	}
	
	if(pc > 0){
		var first,second,cnt=1;;
		for(var i = 0; i < pc; i++){
			var aObj = $(".ipList > li").eq(i).find("input");
			first = aObj[0].value;
			second = aObj[1].value;
			if(second!=""){
				z.xA("Admin", "zeons_계정관리pc등록", "insert", {"아이디" : $.trim($('#userId').val()), "아이피" : second , "PC명": first ,"순번" : cnt}, "json2");
				cnt++;
			}
		}
	}
	if(z.getValue("seq")!="" && z.getValue("seq")!=null){
		z.msg("계정이 성공적으로 수정되었습니다.",function(){
			z.menuLink("MA0606");
			z.buttonClick("MA0606", "계정관리", "R" )
		});
	}else{
		z.msg("계정이 성공적으로 등록되었습니다.",function(){
			z.menuLink("MA0606");
			z.buttonClick("MA0606", "계정관리", "R" )
		});
	}
});

/**** SUBMIT END******************************************************************************************************************/

$('#cancel').on('click', function(){
	z.menuLink("MA0606");
	z.buttonClick("MA0606", "계정관리", "R" );	
});


var fnAddrSearch = function(query, result, resultAsync) {
	z.xAsync('Admin', 'zeons_법인관리', 'select', {"corpName": query}, 'json').done(function(resp) {
		acArr = [];
		if (resp.length && resp[0] ) {
			for (var i in resp) {
				var addr = resp[i];
				acArr.push(addr.법인명);
			}
		}
		resultAsync(acArr);
	});
};


var fnUpdateAddrTextSelected = function(selected) {
	if (! selected) {
		return;
	}
	z.xAsync('Admin', 'zeons_법인관리', 'select', {"corpName": selected}, 'json').done(function(resp) {
		if (resp.length && resp[0] ) {
			for (var i in resp) {
				if(selected == resp[i].법인명){
					$("#corpName").val(resp[i].법인명);
					$("#corpCode").val(resp[i].법인코드);
					$("#corpDetail1").val(resp[i].법인구분1);
					$("#corpDetail1code").val(resp[i].법인구분코드1);
					$("#corpDetail2").val(resp[i].법인구분2);
					$("#corpDetail2code").val(resp[i].법인구분코드2);
				}
			}
		}
		
	});
};

function listAccount(){
	z.menuLink("MA0606");
	z.buttonClick("MA0606", "계정관리", "R" );
}



function getContractKind(){
	var dataContract = z.xA("Admin", "zeons_계정관리계약구분", "select", {}, "json2");
	var html="";
	for(var i in dataContract){
		html+="<option value='"+dataContract[i].공통상세코드+"'>"+dataContract[i].계약구분+"</option>";
	}
	$("#contract1").append(html);
}

function getContractGroup(){
	var dataContract = z.xA("Admin", "zeons_계정관리계정그룹", "select", {}, "json2");
	var html="";
	for(var i in dataContract){
		html+="<option value='"+dataContract[i].그룹코드+"'>"+dataContract[i].그룹명+"</option>";
	}
	$("#contract2").append(html);
}

function ipInsertForm(){
	var max = $("#ipMax option:selected").val();
	/*if($(".ipList > li").length>0){
		z.msgYN("이전 등록 폼이 있습니다 삭제하시겠습니까?",  function (res) {
			if(res == true){
				$(".ipList *").remove();
				ipFormAdd();
			}else{
				return;
			}
		});
	}else{
		ipFormAdd();
	}*/
	if($(".ipList > li").length != max){
		if($(".ipList > li").length > max){
			$(".ipList > li").each(function(idx){
				if(idx>=max){
					$(this).fadeOut('nomal', function(){$(this).remove();});
				}else{
					$(this).find("label").text((idx+1)+"/"+max);
				}
			});
			return false;
		}
	}
	for(var i=$(".ipList > li").length ; i<max ;i++){
		ipFormAdd(i);
	}
}

function ipFormAdd(cnt){
	var max = $("#ipMax option:selected").val();
	//기존에 있는  input의 라벨 텍스트를 수정
	if($(".ipList > li").length>0){
		$(".ipList > li").each(function(idx){
			$(this).find("label").text((idx+1)+"/"+max);
		});
	}
	
	//input 생성
	if($(".ipList > li").length<max){
		var html="";
		html+='<li>';
		html+='<label>'+(cnt+1)+"/"+max+'</label>';
		html+='<input type="text" class="form-control first" placeholder="IP 구분명을 입력해 주세요">';
		html+='<input type="text" class="form-control second" placeholder="IP 주소를 입력해 주세요" onKeyup="ipcheck(this);">';
		html+='<a href="javascript:;"><i class="fa fa-edit" onclick="editAble(this);"></i></a>';
		html+='<a href="javascript:;" class="text-danger"><i class="fa fa-times-circle"></i></a>';
		if($(".ipList > li").length == 0){
			html+=' <button type="button" onclick="showIpChange();" class="btn btn-dark">변경이력보기</button> ';
			//html+='<label class="btn btn-dark" for="xsfile" style="width: 88px; margin-bottom: 0px;">엑셀업로드</label>';
		}
		html+='</li>';
		$(html).hide().appendTo(".ipList").fadeIn(500);
		
		/*$(".ipList > li").find("label").each(function(){
			if($(this).attr("class") == undefined){
				$(this).text((cnt+1)+"/"+max);
			}
		})*/
	}
}

function checkInt(){
	$("#userNumber").keypress(function (e) {
		if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
			console.log(e.which);
			return false;
		}
	})
}

function editAble(obj){
	if($(obj).parent().parent().find("input").attr("disabled")=="disabled"){
		$(obj).parent().parent().find("input").removeAttr("disabled");
	}else{
		$(obj).parent().parent().find("input").attr("disabled","disabled");
	}
	
}

function ipcheckInFuntion(val){
	var pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	if (!pattern.test(val)) {
		return false;
	} else {
		return true;
	}
}

function ipcheck(){
	var pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	x = 46;
	$(".second").keypress(function (e) {
		if (e.which != 8 && e.which != 0 && e.which != x && (e.which < 48 || e.which > 57)) {
			console.log(e.which);
			return false;
		}
	}).keyup(function () {
		var this1 = $(this);
		if (!pattern.test(this1.val())) {
			$(this).next("a").next("a").removeClass().addClass("text-danger");
			$(this).next("a").next("a").find("i").removeClass().addClass("fa fa-times-circle");
			while (this1.val().indexOf("..") !== -1) {
				this1.val(this1.val().replace('..', '.'));
			}
			x = 46;
		} else {
			x = 0;
			var lastChar = this1.val().substr(this1.val().length - 1);
			if (lastChar == '.') {
				this1.val(this1.val().slice(0, -1));
			}
			var ip = this1.val().split('.');
			if (ip.length == 4) {
				$(this).next("a").next("a").removeClass().addClass("text-success");
				$(this).next("a").next("a").find("i").removeClass().addClass("fa fa-check-circle");
				//$(this).prev().attr("disabled","disabled");
				//$(this).attr("disabled","disabled");
				
				/*if($(".ipList > li").length < $("#ipMax option:selected").val()){
					if($(".ipList > li").last().find("a").last().attr("class")!="text-danger"){
						ipFormAdd();
					}
				}*/
			}
		}
	});
}

function updateInfoSet(){
	$("#initPwd").show();
	var dataD = z.xA("Admin", "zeons_계정관리수정정보", "select", {"targetId":z.getValue("seq")}, "json2");
	var dataI = z.xA("Admin", "zeons_계정관리수정아이피", "select", {"targetId":z.getValue("seq")}, "json2");
	
	if(dataD!=null){
		$("#addrSearchText").val(dataD[0].법인명);
		$("#addrSearchText").attr("disabled","disabled");
		$("#corpName").val(dataD[0].법인명);
		$("#corpDetail1").val(dataD[0].법인구분1);
		$("#corpDetail1code").val(dataD[0].법인구분1코드);
		$("#corpDetail2").val(dataD[0].법인구분2);
		$("#corpDetail2code").val(dataD[0].법인구분2코드);
		$("#userId").val(z.getValue("seq"));
		$("#userId").attr("disabled","disabled");
		$("#userName").val(dataD[0].사용자이름);
		$("#userNumber").val(dataD[0].전화번호);
		$("#contract1").val(dataD[0].계약구분).prop("selected",true);
		$("#contract2").val(dataD[0].그룹코드).prop("selected",true);
		$("#kt_datepicker_2_1").val(dataD[0].계약일자);
		$("#kt_datepicker_1").val(dataD[0].계약시작일);
		$("#kt_datepicker_2").val(dataD[0].계약종료일);
		$("#remarks").val(dataD[0].메모);
		if(dataD[0].pc등록대수<=20){
			$("#ipMax").val(dataD[0].pc등록대수).prop("selected",true);
		}
	}
	if(dataI!=null){
		var html="";
		for(var i=0; i<dataI.length; i++){
			html+='<li>';
			html+='<label>'+(i+1)+"/"+dataD[0].pc등록대수+'</label>';
			html+='<input type="text" class="form-control first" placeholder="IP 구분명을 입력해 주세요" value="'+dataI[i].pc명+'" disabled="disabled">';
			html+='<input type="text" class="form-control second" placeholder="IP 주소를 입력해 주세요" onKeyup="ipcheck(this);" value="'+dataI[i].아이피+'" disabled="disabled">';
			html+='<a href="javascript:;"><i class="fa fa-edit" onclick="editAble(this);"></i></a>';
			html+='<a href="javascript:;" class="text-success"><i class="fa fa-check-circle"></i></a>';
			if(i==0){
				html+=' <button type="button" onclick="showIpChange();" class="btn btn-dark">변경이력보기</button> ';
				//html+='<label class="btn btn-dark" for="xsfile" style="width: 88px; margin-bottom: 0px;">엑셀업로드</label>';
			}
			html+='</li>';
		}
		$(".ipList").append(html);

		var html="";
		if($(".ipList > li").length < dataD[0].pc등록대수){
			for(var i=dataI.length; i<dataD[0].pc등록대수; i++){
				html+='<li>';
				html+='<label>'+(i+1)+"/"+dataD[0].pc등록대수+'</label>';
				html+='<input type="text" class="form-control first" placeholder="IP 구분명을 입력해 주세요" value="" disabled="disabled">';
				html+='<input type="text" class="form-control second" placeholder="IP 주소를 입력해 주세요" onKeyup="ipcheck(this);" value="" disabled="disabled">';
				html+='<a href="javascript:;"><i class="fa fa-edit" onclick="editAble(this);"></i></a>';
				html+='<a href="javascript:;" class="text-danger"><i class="fa fa-times-circle"></i></a>';
				html+='</li>';
			}
			$(".ipList").append(html);
		}
	}
}

function exFileUpload(){
	var formData = new FormData(); 
	formData.append("xsfile" ,  $("#xsfile")[0].files[0]);
	$.ajax({ 
		url: '/admin/account/excelRead.do',
		data: formData,
		contentType: false,
		processData: false,
		type: 'POST', 
		success: function(data){
			console.log(data)
			if(data!=null && data!=""){
				if(data.result.exList.length>20){
					$("#ipMax").append("<option value='"+data.result.exList.length+"' selected='selected'>"+data.result.exList.length+"</option>");
				}else{
					$("#ipMax").val(data.result.exList.length).prop("selected", true);
				}
				$("#ipMax").attr("disabled","disabled");
				
				var html="";
				$(".ipList *").remove();
				for(var i=0; i<data.result.exList.length; i++){
					var dataI=data.result.exList;
					html+='<li>';
					html+='<label>'+(i+1)+"/"+dataI.length+'</label>';
					html+='<input type="text" class="form-control first" placeholder="IP 구분명을 입력해 주세요" value="'+dataI[i].pcName+'" disabled="disabled">';
					html+='<input type="text" class="form-control second" placeholder="IP 주소를 입력해 주세요" onKeyup="ipcheck(this);" value="'+dataI[i].ip+'" disabled="disabled">';
					html+='<a href="javascript:;"><i class="fa fa-edit" onclick="editAble(this);"></i></a>';
					if(ipcheckInFuntion(dataI[i].ip)){
						html+='<a href="javascript:;" class="text-success"><i class="fa fa-check-circle"></i></a>';
					}else{
						html+='<a href="javascript:;" class="text-danger"><i class="fa fa-times-circle"></i></a>';
					}
					if(i==0){
						html+=' <button type="button" onclick="showIpChange();" class="btn btn-dark">변경이력보기</button> ';
						//html+='<label class="btn btn-dark" for="xsfile" style="width: 88px; margin-bottom: 0px;">엑셀업로드</label>';
					}
					html+='</li>';
					$(".ipList").append(html);
					html="";
				}
			}
		},error: function(xhr, status, err) {
			alert("예외가 발생했습니다. 관리자에게 문의해 주시기 바랍니다.");return false;
		},
	});
}

function showIpChange(){
	z.setValue("showIpChange" , "show");
	z.menuLink("MA060601");
	z.buttonClick("MA060601", "계정관리상세", "R" );
}

function getPwd(){
	var strPwd = "";
	if($("#userId").val()!=""){
		$.ajax({ 
			url: '/admin/account/getPwdStr.do',
			data: {"userId":$("#userId").val()},
			type: 'POST', 
			async: false,
			success: function(data){
				strPwd = data.pwdStr;
			},error: function(xhr, status, err) {
				alert("예외가 발생했습니다. 관리자에게 문의해 주시기 바랍니다.");return false;
			}
		});
	}
	return strPwd;
}

function initPWD(){
	z.msgYN("비밀번호를 초기화 하시겠습니까?",  function (res) {
		if(res == true){
			var dataJSONArray  = z.xA("Admin", "zeons_비밀번호초기화", "update", {"아이디" : $("#userId").val() , "비밀번호":getPwd()}, "json2");
			z.buttonClick("MA0606", "계정관리비번초기화", "D");
		}else{
			return;
		}
	});
}

jQuery(document).ready(function() {
    /*KTAccountSelect2.init();
	KTAccountDatepicker.init();
	$(".selectpicker").selectpicker();
	*/
	//$(".kt_datepicker_1").datepicker();
	//$(".kt_datepicker_2").datepicker();
	/*
	getContract();
	getGroup();
	getRights();
	getCorp();
	getPc();
	getCorpNameList();*/
	getContractKind();
	getContractGroup();
	
	//수정일떄
	if(z.getValue("seq")!="" && z.getValue("seq")!=null){
		updateInfoSet();
	}else{//등록 일때
		$addrSearchText = $("[name=addrSearchText]");
		$addrSearchText.typeahead({
			hint: true,
			highlight: true,
			minLength: 2
		}, {
			limit: 100,
			source: fnAddrSearch
		});
		$addrSearchText.on('typeahead:select', function(evt, selected) {
			fnUpdateAddrTextSelected(selected);
		});
	}
});



