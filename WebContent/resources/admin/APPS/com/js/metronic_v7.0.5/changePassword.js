
zo.changePassword = function () {
	if ( z.getValue("changePassword_portlet", "oldPassword") == "" ) {
		z.msg("현재 비밀번호를 입력해 주세요.");
		return;
	}
	if ( z.getValue("changePassword_portlet", "newPassword") == "" ) {
		z.msg("신규 비밀번호를 입력해 주세요.");
		return;
	}
	if ( z.getValue("changePassword_portlet", "newPassword2") == "" ) {
		z.msg("비밀번호 확인을 입력해 주세요.");
		return;
	}
	if ( z.getValue("changePassword_portlet", "oldPassword") == z.getValue("changePassword_portlet", "newPassword") ) {
		z.msg("현재 패스워드와 동일하게 변경할 수 없습니다.");
		return;
	}
	if ( z.getValue("changePassword_portlet", "newPassword") != z.getValue("changePassword_portlet", "newPassword2") ) {
		z.msg("신규 패스워드와 비밀번호 확인이 동일하지 않습니다.");
		return;
	}
	
	var oldPassword  = z.getValue("changePassword_portlet", "oldPassword");
	var newPassword  = z.getValue("changePassword_portlet", "newPassword");
	var newPassword2 = z.getValue("changePassword_portlet", "newPassword2");
	
	$.ajax({
		url: "/admin/member/adminPassWordChangeUpdate.do",
		type: 'POST',
		data: {oldPassword: oldPassword, newPassword: newPassword, newPassword2: newPassword2, userId : _UserId},
		dataType: 'json',
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		async: false,
		cache: false,
		beforeSend: function(xhr){
			//$('#loading').show().fadeIn('fast');
			  
			xhr.setRequestHeader("X-Requested-With","XMLHttpRequest"); 
			xhr.setRequestHeader("Cache-Control","no-store, no-cache, must-revalidate");
			xhr.setRequestHeader("Progma","no-cache");
		},
		complete:function(){
			//$('#loading').fadeOut();
		},      
		error: function(xhr, status, err) {
		
			if (xhr.status == 401) {
				alert("401 Unauthorized");
			} else if (xhr.status == 403) {
				alert("403 Forbidden");
			} else {
				alert("예외가 발생했습니다. 관리자에게 문의해 주시기 바랍니다.");
			}		        
		},
		success: function(data) {
			if(data.result == "OK"){
				alert("변경이 완료 되었습니다.");
				
				z.hideModal("Passward_modal_1");
			}else{
				alert(data.message);
			}						 			 
		}			
	});
}
