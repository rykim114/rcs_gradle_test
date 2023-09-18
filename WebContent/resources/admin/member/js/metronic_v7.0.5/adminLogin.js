$(document).ready(function() {
	if ( ($("#message").val() || "") != "" ) {		
		alert($("#message").val());
	}

    var userId = KTCookie.getCookie("userId");
    $("input[name='id']").val(userId);
    
    // 아이디가 입력된 경우 아이디 저장 체크박스 체크
    if($("input[name='id']").val() != ""){
    	$("#checkId").attr("checked", true);
    }
    
    // 아이디 저장하기 체크박스 onchange
    $("#checkId").change(function() {
    	if($("#checkId").is(":checked")) {
        	var userId = $("input[name='id']").val();
            KTCookie.setCookie("userId", userId, 90); // 90일 동안 쿠키 보관
         } else {
			KTCookie.deleteCookie("userId");
        }
    });
     
     
     // 아이디 저장하기가 체크된 상태에서, 아이디를 입력한 경우
     $("input[name='id']").keyup(function() {
     	if($("#checkId").is(":checked")){
            var userId = $("input[name='id']").val();
            KTCookie.setCookie("userId", userId, 90); // 90일 동안 쿠키 보관
        }
    });
})

$('#kt_login_signin_submit').click(function(e) {
	e.preventDefault();
	
	if ( $("#companyCode").val() == "" ) {
		$("#companyCode").val("100");
	}
	
	if ( document.LoginFrm.id.value == "" ) {
		alert("아이디를 입력하세요");
		$("#id").focus();
		return false;
	}
	
	if ( document.LoginFrm.password.value == "" ) {
		alert("비밀번호를 입력하세요");
		$("#password").focus();
		return false;
	}
	
	$("#strongpwd").val(chkPassword($("#password").val()) ? "Y" : "N");
	
	var $form = $("#LoginFrm");
	$form[0].action = "/admin/member/adminActionLogin.do";
	$form[0].submit();
});

$('#kt_login #password').keyup(function(evt) {
	if (13 === evt.which) {
		$('#kt_login_signin_submit').click();
	}
});

function chkPassword(str) {
	var passCnt = 0;

	if (/[a-z]/.test(str))
		passCnt++;
	if (/[A-Z]/.test(str))
		passCnt++;
	if (/[0-9]/.test(str))
		passCnt++;
	if (/[!@#\$%\^&\*]/.test(str))
		passCnt++;

	//세가지 조건이상 만족하면 PASS
	return (passCnt >= 3);
}
