jQuery(document).ready(function(){
	var dataJSONArray = z.xA("Setting", "zeons_비밀번호수정보기", "select", {}, "json2");
	$('#userId').val(dataJSONArray[0].아이디);
})

$("#oldPW").keyup(function () {
	$('.rounded-sm:eq(1)').removeClass('is-invalid');
});

$("#newPW").keyup(function () {

var str =  $.trim($('#newPW').val());
	
	if(chkPassword(str)){
		$('.rounded-sm:eq(2)').removeClass('is-invalid');		
	} else {
		$('.rounded-sm:eq(2)').addClass('is-invalid'); 		
	}
	
});

$("#confirmNewPW").keyup(function () {
	
	var oldPW = $.trim($('#newPW').val());
	var confirmPW = $.trim($('#confirmNewPW').val());
	
	if(oldPW === confirmPW){
		$('.rounded-sm:eq(3)').removeClass('is-invalid');		
	} else {
		$('.rounded-sm:eq(3)').addClass('is-invalid');	
	};
});


function submitPW(){
	var	$newPW = $.trim($('#newPW').val()), 
		$confirmNewPW = $.trim($('#confirmNewPW').val());

	if(!chkPassword($newPW) || !chkPassword($confirmNewPW)) {
		z.msg('변경하실 비밀번호를 다시 확인해 주세요.');
		return false;
	}
	
	if($.trim($('#oldPW').val()) == null || $.trim($('#oldPW').val()) == ""){
		z.msg('기존 비밀번호를 다시 등록해주세요.'); 
		$('#oldPW').focus(); 
		return;
	} else if($.trim($('#newPW').val()) == null || $.trim($('#newPW').val()) == ""){
		z.msg('새 비밀번호를 다시 등록해주세요.'); 
		$('#newPW').focus(); 
		return false; 
	} else if($.trim($('#confirmNewPW').val()) == null || $.trim($('#confirmNewPW').val()) == ""){
		z.msg('새 비밀번호 확인을 다시 해주세요.'); 
		$('#confirmNewPW').focus();
		return false;
	} else {
		var newPW = $.trim($('#confirmNewPW').val());
	}		
	
	$.ajax({
		url: '/admin/member/adminPassWordChangeUpdate.do',
		method: 'post',
		contentType: 'application/json',
		data: JSON.stringify({
			oldPassword: $.trim($('#userId').val() + $('#oldPW').val()),
			newPassword: $.trim($('#newPW').val()),
			newPassword2: $.trim($('#confirmNewPW').val())
		})
	}).done(function(resp){
		
		if(resp.result == 'ERROR1'){
			$('.rounded-sm:eq(1)').addClass('is-invalid'); 
			$('#oldPW').focus();
			return;				
		} else if(resp.result == 'ERROR2'){
			$('.rounded-sm:eq(2)').addClass('is-invalid'); 
			$('#NewPW').focus();
			return;		
		} else if(resp.result == 'ERROR3'){
			$('.rounded-sm:eq(3)').addClass('is-invalid'); 
			$('#confirmNewPW').focus();
			return;	
		} else if(resp.result == 'OK') {
			z.msg('비밀번호가 성공적으로 수정되었습니다.', function (res){
				if(res) {
					location.reload();
				} else {
					return;
				}
			});			
		};		
	});		
}

function chkPassword(str) {
	var passCnt = 0;
	
	if(str.length >= 8 && str.length <= 16)
		passCnt++;
	if (/[a-z]/.test(str) || /[A-Z]/.test(str))
		passCnt++;
	if (/[0-9]/.test(str))
		passCnt++;
	if (/[!@#\$%\^&\*]/.test(str))
		passCnt++;

	return (passCnt >= 4);
}
