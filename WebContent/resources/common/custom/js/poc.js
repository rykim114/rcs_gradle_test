var poc_sub = ''; 

function pocPopup(mode) {  //mode (0:메인팝업 , 1:디테일 팝업)
	if(mode==0) {
		$("#pocMainPop").css("display","");
		$("#pocDetailPop").css("display","none");
	}else if(mode==1) {
		$('li').click(function(){
			poc_sub = $(this).text();
			PocCssModeChange(poc_sub);
		})
		$("#pocMainPop").css("display","none");
		$("#pocDetailPop").css("display","");
	}
}

function pocPopupClose(mode) {
	if(mode==0) {
		$("#pocMainPop").css("display","none");
	}else if(mode==1) {
		$("#pocMainPop").css("display","");
		$("#pocDetailPop").css("display","none");
	}
}

function PocCssModeChange(poc_sub){
	
	if(poc_sub == '물류/유통'){
		$("#p_bx_sub1").css("display","");
		$("#p_bx_sub2").css("display","none");
		$("#p_bx_sub3").css("display","none");
		$("#p_bx_sub4").css("display","none");
		$("#p_bx_sub5").css("display","none");
		$("#p_bx_sub6").css("display","none");
	}else if (poc_sub=='금융/보험'){
		$("#p_bx_sub1").css("display","none");
		$("#p_bx_sub2").css("display","");
		$("#p_bx_sub3").css("display","none");
		$("#p_bx_sub4").css("display","none");
		$("#p_bx_sub5").css("display","none");
		$("#p_bx_sub6").css("display","none");
	}else if (poc_sub=='공공/재난'){
		$("#p_bx_sub1").css("display","none");
		$("#p_bx_sub2").css("display","none");
		$("#p_bx_sub3").css("display","");
		$("#p_bx_sub4").css("display","none");
		$("#p_bx_sub5").css("display","none");
		$("#p_bx_sub6").css("display","none");
	}else if (poc_sub=='부동산/자산'){
		$("#p_bx_sub1").css("display","none");
		$("#p_bx_sub2").css("display","none");
		$("#p_bx_sub3").css("display","none");
		$("#p_bx_sub4").css("display","");
		$("#p_bx_sub5").css("display","none");
		$("#p_bx_sub6").css("display","none");
	}else if (poc_sub=='여행/관광'){
		$("#p_bx_sub1").css("display","none");
		$("#p_bx_sub2").css("display","none");
		$("#p_bx_sub3").css("display","none");
		$("#p_bx_sub4").css("display","none");
		$("#p_bx_sub5").css("display","");
		$("#p_bx_sub6").css("display","none");
	}else if (poc_sub=='다울지도 부가서비스'){
		$("#p_bx_sub1").css("display","none");
		$("#p_bx_sub2").css("display","none");
		$("#p_bx_sub3").css("display","none");
		$("#p_bx_sub4").css("display","none");
		$("#p_bx_sub5").css("display","none");
		$("#p_bx_sub6").css("display","");
	}	
	poc_sub = '';
}


function pocLink(url) {
	window.open(url,"_blank");
}