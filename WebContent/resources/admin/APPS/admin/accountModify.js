/**** 전역변수  START******************************************************************************************************************/
var master_code = '';
var inputCount = '';
/**** 전역변수 END******************************************************************************************************************/

$(document).ready(function() {	
	
	var 아이디 = z.getValue("seq");
	var dataJSONArray_set = z.xA("Admin", "zeons_계정관리수정리스트", "select", {"아이디":아이디}, "json2");
		
	$('#userId').val(dataJSONArray_set[0].아이디);	
	$('#userPW').val(dataJSONArray_set[0].아이디);	
	$('#kt_datepicker_1').val(dataJSONArray_set[0].계약일자);	
	$('input[name=start]').val(dataJSONArray_set[0].계약시작일);
	$('input[name=end]').val(dataJSONArray_set[0].계약종료일);	
	$('#userName').val(dataJSONArray_set[0].사용자이름);
	$('#telNumber').val(dataJSONArray_set[0].전화번호);			
	
	var html_cont = '';
	var dataJSONArray_cont = z.xA("Admin", "zeons_공통코드관리상세", "select", {"master":'100000','YN':'Y'}, "json2");

	if(dataJSONArray_cont.length < 1 || dataJSONArray_set[0].계약구분 == "") {
		html_cont += '<option value="0">해당없음</option>';	
	} else {
		for(var i = 0; i < dataJSONArray_cont.length; i++){
			if(dataJSONArray_set[0].계약구분 == dataJSONArray_cont[i].공통상세코드){
				html_cont += '<option selected value="'+ dataJSONArray_cont[i].공통상세코드 +'">'+ dataJSONArray_cont[i].공통상세명 +'</option>'	
			} else {
				html_cont += '<option value="'+ dataJSONArray_cont[i].공통상세코드 +'">'+ dataJSONArray_cont[i].공통상세명 +'</option>'		
			}				
		}
	}
	
	$('#contract').html(html_cont);	

/// 법인명 수정 불가로 처리!!	
	var dataJSONArray_corpName = z.xA("Admin", "zeons_법인관리", "select", {'YN':'Y'}, "json2");
	
	if(dataJSONArray_set.length < 1 || dataJSONArray_corpName.length < 1) {
		$('#corpName').val('해당없음')	
	} else {
		$('#corpName').val(dataJSONArray_set[0].법인명);
		$('#corpCode').val(dataJSONArray_set[0].법인코드);	
	}	
	
	var html_big = '';
	var html_mid = '';
	var html_sml = '';	
	var dataJSONArray_corp1 = z.xA("Admin", "zeons_법인관리대불러오기", "select", {}, "json2");
	var dataJSONArray_corp2 = z.xA("Admin", "zeons_법인관리중불러오기", "select", {"master":dataJSONArray_set[0].법인구분_대}, "json2");
	var dataJSONArray_corp3 = z.xA("Admin", "zeons_법인관리소불러오기", "select", {"master":dataJSONArray_set[0].법인구분_대, "detail":dataJSONArray_set[0].법인구분_중}, "json2");		
	
	if(dataJSONArray_set[0].법인구분_대 == "" || dataJSONArray_corp1.length < 1){
		html_big += '<option value="0">해당없음</option>'
	} else {
		for(var i = 0; i< dataJSONArray_corp1.length; i++){
			if(dataJSONArray_corp1[i].법인마스터코드 == dataJSONArray_set[0].법인구분_대){
				html_big += '<option selected value="'+ dataJSONArray_corp1[i].법인마스터코드 +'">'+ dataJSONArray_corp1[i].법인마스터명 +'</option>'		
			} else {
				html_big += '<option value="'+ dataJSONArray_corp1[i].법인마스터코드 +'">'+ dataJSONArray_corp1[i].법인마스터명 +'</option>'				
			}
		}
	}

	$("#corp1").html(html_big);	
	
	if(dataJSONArray_set[0].법인구분_중 == "" || dataJSONArray_corp2.length < 1){
		html_mid += '<option value="0">해당없음</option>'
	} else {
		for(var i = 0; i< dataJSONArray_corp2.length; i++){
			if( dataJSONArray_corp2[i].법인상세코드 == dataJSONArray_set[0].법인구분_중){
				html_mid += '<option selected value="'+ dataJSONArray_corp2[i].법인상세코드 +'">'+ dataJSONArray_corp2[i].법인상세명 +'</option>'		
			} else {
				html_mid += '<option value="'+ dataJSONArray_corp2[i].법인상세코드 +'">'+ dataJSONArray_corp2[i].법인상세명 +'</option>'				
			}
		}		
	}

	$("#corp2").html(html_mid);	
	
	if(dataJSONArray_set[0].법인구분_소 == "" || dataJSONArray_corp3.length < 1){
			html_mid += '<option value="0">해당없음</option>'
	} else {
		for(var i = 0; i< dataJSONArray_corp3.length; i++){
			if(dataJSONArray_corp3[i].법인상세세부코드 == dataJSONArray_set[0].법인구분_소){
				html_sml += '<option selected value="'+ dataJSONArray_corp3[i].법인상세세부코드 +'">'+ dataJSONArray_corp3[i].법인상세세부명 +'</option>'		
			} else {
				html_sml += '<option value="'+ dataJSONArray_corp3[i].법인상세세부코드 +'">'+ dataJSONArray_corp3[i].법인상세세부명 +'</option>'				
			}
		}		
	}

	$("#corp3").html(html_sml);	
	
	var html_group = '';
	var dataJSONArray_group = z.xA("Admin", "zeons_공통코드관리상세", "select", {"master":'100001','YN':'Y'}, "json2");

	if(dataJSONArray_group.length < 1 || dataJSONArray_set[0].그룹코드 == "") {
		html_group += '<option value="0">해당없음</option>';	
	} else {
		for(var i = 0; i < dataJSONArray_group.length; i++){
			if(dataJSONArray_set[0].그룹코드 == dataJSONArray_group[i].공통상세코드){
				html_group += '<option selected value="'+ dataJSONArray_group[i].공통상세코드 +'">'+ dataJSONArray_group[i].공통상세명 +'</option>'	
			} else {
				html_group += '<option value="'+ dataJSONArray_group[i].공통상세코드 +'">'+ dataJSONArray_group[i].공통상세명 +'</option>'		
			}				
		}
	}

	$('#group').html(html_group);
		
	var html_rights = '';
	var dataJSONArray_rights = z.xA("Admin", "zeons_공통코드관리상세", "select", {"master":'100002','YN':'Y'}, "json2");

	if(dataJSONArray_rights.length < 1 || dataJSONArray_set[0].기능권한 == "") {
			html_rights += '<option value="0">해당없음</option>';	
	} else {
		for(var i = 0; i < dataJSONArray_rights.length; i++){
			if(dataJSONArray_set[0].그룹코드 == dataJSONArray_rights[i].공통상세코드){
				html_rights += '<option selected value="'+ dataJSONArray_rights[i].공통상세코드 +'">'+ dataJSONArray_rights[i].공통상세명 +'</option>'	
			} else {
				html_rights += '<option value="'+ dataJSONArray_rights[i].공통상세코드 +'">'+ dataJSONArray_rights[i].공통상세명 +'</option>'		
			}				
		}
	}
	
	$('#rights').html(html_rights);
	
	var html_pc = '';
//	var pcNum = z.xA("Admin", "zeons_계정관리PC등록상세정보", "select", {"아이디":dataJSONArray_set[0].아이디}, "json2");
//	var pcArr = pcNum[0].아이피;
	var pcInutNum = '';
	var pcNum = dataJSONArray_set[0].pc등록대수;// 공통코드를 0~50으로 입력했다고 했을 때로 가정 / 아니면 몇대인지 구하는 쿼리 필요

//	$('#pcQty').text('/ ' + pcArr);
	for(var i = 0; i < pcNum; i++){
		pcInutNum ++;
		if( dataJSONArray_set[i].아이피 != null || dataJSONArray_set[i].아이피 != ""){
			html_pc += '<div class="mb-2">'
			html_pc += '<input class="form-control form-control-solid border border-secondary rounded-sm pc-list" value="'+ dataJSONArray_set[i].아이피 +'" type="text">'
			html_pc += '</div>'		
			pcInutNum ++;	
		} else {
			html_pc += '<div class="mb-2">'
			html_pc += '<input class="form-control form-control-solid border border-secondary rounded-sm pc-list" value="" type="text">'
			html_pc += '</div>'			
		}
	}
	$('#pcInput').html(html_pc);
	$('#inputQty').text(pcInutNum);
	
	var html_pcList = '';
	var dataJSONArray_pc = z.xA("Admin", "zeons_공통코드관리상세", "select", {"master":'100003','YN':'Y'}, "json2");
	
	if(dataJSONArray_set[0].pc등록대수 == "" || dataJSONArray_pc.length < 1) {
		html_pcList += '<option value="0">해당없음</option>';	
	} else {
		for(var i = 0; i < dataJSONArray_pc.length; i++){
			if(dataJSONArray_set[0].pc등록대수 == dataJSONArray_pc[i].공통상세코드){
				html_pcList += '<option selected value="'+ dataJSONArray_pc[i].공통상세코드 +'">'+ dataJSONArray_pc[i].공통상세명 +'</option>'	
			} else {
				html_pcList += '<option value="'+ dataJSONArray_pc[i].공통상세코드 +'">'+ dataJSONArray_pc[i].공통상세명 +'</option>'									
			}
		}
	}	
	
	$('#pcCapacity').html(html_pcList);	
		
});	


var KTAccountDatepicker = function () {

    var arrows;
    if (KTUtil.isRTL()) {
        arrows = {
            leftArrow: '<i class="la la-angle-right"></i>',
            rightArrow: '<i class="la la-angle-left"></i>'
        }
    } else {
        arrows = {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    }
    
    // Private functions
    var demos = function () {

        // basic
        $('#kt_datepicker_1').datepicker({
            rtl: KTUtil.isRTL(),
            todayHighlight: true,
            templates: arrows,
            format: "yyyy-mm-dd",
            language: "kr"
        });
        // range picker
        $('#kt_datepicker_2').datepicker({
            rtl: KTUtil.isRTL(),
            todayHighlight: true,
            templates: arrows,
            format: "yyyy-mm-dd",
            language: "kr"
        });
        // basic
        $('#kt_datepicker_2_1').datepicker({
            rtl: KTUtil.isRTL(),
            todayHighlight: true,
            templates: arrows,
            format: "yyyy-mm-dd",
            language: "kr"
        });
        // range picker
        $('#kt_datepicker_2_2').datepicker({
            rtl: KTUtil.isRTL(),
            todayHighlight: true,
            templates: arrows,
            format: "yyyy-mm-dd",
            language: "kr"
        });        
    }

    return {
        // public functions
        init: function() {
            demos(); 
        }
    };
}();

;(function($){
	$.fn.datepicker.dates['kr'] = {
		days: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"],
		daysShort: ["일", "월", "화", "수", "목", "금", "토", "일"],
		daysMin: ["일", "월", "화", "수", "목", "금", "토", "일"],
		months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        monthsShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        titleFormat: "yyyy년 MM", /* Leverages same syntax as 'format' */
	};
}(jQuery));


/*// Class definition
var KTAccountSelect2 = function() {

    var demos = function() {
        $('#kt_select2_1_modal').select2({
            placeholder: corpOldName,
            allowClear: true
        });
        $('#kt_select2_2_modal').select2({
            placeholder: "법인명을 선택해주세요",
            allowClear: true
        });
    }


    // Public functions
    return {
        init: function() {
            demos();
        }
    };
}();*/

$('#corp1').change(function(){
	var masterCode = $('#corp1 option:selected').val();	
	var dataJSONArray_mid = z.xA("Admin", "zeons_법인관리중불러오기", "select", {"master" : masterCode}, "json2");
	var html_2 = '';
	
	if(dataJSONArray_mid.length < 1){
		detailCode = '';
		html_2 += '<option value="0">해당없음</option>'
	} else {
		detailCode = dataJSONArray_mid[0].법인상세코드;
		for(var i = 0; i < dataJSONArray_mid.length; i++){
			html_2 += '<option value="'+ dataJSONArray_mid[i].법인상세코드 +'">'+ dataJSONArray_mid[i].법인상세명 +'</option>'
		}		
	}
	$("#corp2").html(html_2);
		
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
	detail_code = detailCode;	
});

var isIdChecked = false;

function checkId(){
	var userId = $('#userId').val();
	var dataJSONArray_1 = z.xA("Admin", "zeons_아이디중복체크", "select", {"아이디":userId}, "json2");
	
	if(dataJSONArray_1[0].user_id > 0){
		isIdChecked = false;
		z.msg("이미 사용중인 아이디입니다.");
	} else {
		isIdChecked = true;
		z.msg("이 아이디는 사용하실 수 있습니다.");
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

$('#pcCapacity').change(function(){
	var selectedPc = $("#pcCapacity option:selected").val();
	var dataJSONArray_getPc = z.xA("Admin", "zeons_공통코드관리상세", "select", {"master" : "100003", "detail" : selectedPc}, "json2");
	
	var pcVal = dataJSONArray_getPc[0].공통상세명.replace(/대/g,'');
	$('#pcQty').text(pcVal);
	var html = '';
	
	for(var i = 0; i < pcVal; i++){		
		html += '<div class="mb-2">'
		html += '<input class="form-control form-control-solid border border-secondary rounded-sm pc-list" type="text" placeholder="IP를 입력해주세요.">'
		html += '</div>'	
	}
//	$('#inputQty').text(inputCount);
	$("#pcInput").html(html);	
})

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

$('#cancel').on('click', function(){
	z.menuLink("MA0606");
})

$('#submit').on('click', function(){
	
	if(isIdChecked == false){
		z.msg('아이디 중복확인이 필요합니다.');
		$('#userId').focus();
		return;
	}
	var userPW = $.trim($('#userPW').val());
	if(!chkPassword(userPW)){
		z.msg("비밀번호는 8자리 이상 30자 이내여야 하며 특수문자, 숫자를 포함해야 합니다.")
		$('#userPW').focus();
		return;
	}
	
	var date_1 = $('input[name=start]').val();
	var date_2 = $('input[name=end]').val();
	
	if(date_1 === date_2){
		z.msgYN('사용기간이 하루 맞습니까?', function (res){
			if(res){
			} else {
				return;
			}
		});
	}
	
	if(userPW == ""){
		userPW = resetPW();	 
	} else if(!chkPassword(userPW)){
		z.msg("비밀번호는 영문, 숫자, 특수문자 포함 8자리 이상 20자 이내여야 합니다.");
		$('#userPW').focus();
		return;
	}
	
	if($('#userId') == "" || $('#userId') == null){
		z.msg('아이디를 입력해주세요.');
		$('#userId').focus();
		return;
	}
	
	if($('#contract') == "" || $('#contract') == null){
		z.msg('계약구분을 선택해주세요.');
		$('#contract').focus();
		return;
	}

	if($('#kt_datepicker_1') == "" || $('#kt_datepicker_1') == null){
		z.msg('계약일자 선택해주세요.');
		$('#kt_datepicker_1').focus();
		return;
	}
	
	if($('input[name=start]').val() == "" || $('input[name=start]').val() == null || $('input[name=end]').val() == "" || $('input[name=end]').val() == null){
		z.msg('사용기간을 선택해주세요.');
		$('#kt_datepicker_2').focus();
		return;
	}
	
	if($("#kt_select2_1_modal option:selected").val() == "" || $("#kt_select2_1_modal option:selected").val() == null){
		z.msg('법인명을 선택해주세요.');
		$('#userId').focus();
		return;
	}
	
	if($.trim($('#corp1 option:selected').val()) == "" || $.trim($('#corp1 option:selected').val()) == null){
		z.msg('법인구분을 선택해주세요.');
		$('#corp1').focus();
		return;
	}
	
	if($.trim($('#corp2 option:selected').val()) == "" || $.trim($('#corp2 option:selected').val()) == null){
		z.msg('법인구분을 선택해주세요.');
		$('#corp2').focus();
		return;
	}
	
	if($.trim($('#corp3 option:selected').val()) == "" || $.trim($('#corp3 option:selected').val()) == null){
		z.msg('법인구분을 선택해주세요.');
		$('#corp3').focus();
		return;
	}
	
	if($('#userName') == "" || $('#userName') == null){
		z.msg('사용자명을 입력해주세요.');
		$('#userName').focus();
		return;
	}
	
	if($('#telNumber') == "" || $('#telNumber') == null){
		z.msg('전화번호를 입력해주세요.');
		$('#telNumber').focus();
		return;
	}
	
	if($('#group') == "" || $('#group') == null){
		z.msg('그룹을 선택해주세요.');
		$('#group').focus();
		return;
	}
		
	if($('#right') == "" || $('#right') == null){
		z.msg('기능권한을 입력해주세요.');
		$('#right').focus();
		return;
	}	
	
	var userPWUpper = $.trim($('#userPW').val()).toUpperCase();
	
	var data_user = {
		"아이디": $.trim($('#userId').val()),
		"비밀번호": userPWUpper,
		"계약구분": $.trim($('#contract').val()),
		"계약일자": $.trim($('#kt_datepicker_1').val()),
		"계약시작일": $('input[name=start]').val(),
		"계약종료일": $('input[name=end]').val(),
		"법인코드": $("#kt_select2_1_modal option:selected").val(),
		"사용자이름": $.trim($('#userName').val()),
		"전화번호": $.trim($('#telNumber').val()),
		"그룹코드": $.trim($('#group').val()),
		"기능권한": $.trim($('#right').val()),
		"PC등록대수": $.trim($('#pcCapacity').val()),
		"비고": $.trim($('#content').val())
	};
	
	var data_corp = {
		"법인코드": $("#kt_select2_1_modal option:selected").val(),
		"법인구분_대": $.trim($('#corp1 option:selected').val()),
		"법인구분_중": $.trim($('#corp2 option:selected').val()),
		"법인구분_소": $.trim($('#corp3 option:selected').val())		
	}
	
	var data_pc = {
		"아이디": $.trim($('#userId').val()),
//		for문 돌리기
//		"아이피": $.trim($('#userId').val())
	}

	var dataJSONArray_update_user = z.xA("Admin", "zeons_계정관리사용자등록", "insert", data, "json2");
	var dataJSONArray_udpate_pc = z.xA("Admin", "zeons_계정관리pc등록", "insert", data, "json2");
	
	if(dataJSONArray_update_user != "" && dataJSONArray_udpate_pc != ""){
		z.msg('계정정보가 성공적으로 수정되었습니다.')
	//	z.menuLink('MA0606');
	} else if(dataJSONArray_update_user == ""){
		z.msg('계정정보 등록 처리 중 오류가 발생했습니다.')
		return;
	} else if(dataJSONArray_udpate_pc == ""){
		z.msg('계정정보 등록 처리 중 오류가 발생했습니다.')
		return;
	}
	
})

function resetPW(){
	var dataJSONArray_reset = z.xA("Admin", "zeons_계정관리비밀번호초기화", "update", {"아이디" : userId}, "json2");
	if(dataJSONArray_reset != null) {	
		$('#userId').val('R12345678!');
		z.msg('비밀번호가 r12345678!로 초기화 되었습니다.');
	} else {
		z.msg('초기화 실패했습니다.')
	}			
}

jQuery(document).ready(function() {
//    KTAccountSelect2.init();
	KTAccountDatepicker.init();
	$(".selectpicker").selectpicker();
	$(".kt_datepicker_1").datepicker();
	$(".kt_datepicker_2").datepicker();
});
