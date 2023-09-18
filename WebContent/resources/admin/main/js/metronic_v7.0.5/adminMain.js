
// Shared Colors Definition
var primary = '#6993FF';
var success = '#1BC5BD';
var info = '#8950FC';
var warning = '#FFA800';
var danger = '#F64E60';

$(document).ready(function() {
	$(".z-menu-link").off("click").on("click", function (e) {
		var $this = $(e.currentTarget);
		z.menuLink($this.attr("id"));
		
		$(".menu-item").removeClass('menu-item-active');
		
		if($(this).parent().hasClass("z_menu-item2") == false) { //1뎁스면
			$(".z_menu-item1").removeClass('menu-item-open');
			$(this).parent().children('div').children('ul').children('li:eq(1)').addClass('menu-item-active');
		} else {
			$(this).parent().addClass('menu-item-active');
		}
	}); 
	
	$(".z-btn-sign-out").off("click").on("click", function () {
		z.msgYN("로그아웃 하시겠습니까?", function (res) {
			if ( res ) {
				zoMainLogout();
			}
		});
	});
		
	if($("#span_passday").html() < 30){
		var $modalPw = $('#change-password'),
			$btnPwChange = $modalPw.find('[data-btn-pw-change]'),
			$btnPwAutoDue = $modalPw.find('[data-btn-pw-due]'),
			$btnModalClose = $modalPw.find('[data-btn-modal-close]');
		
		$modalPw.modal({keyboard:false, backdrop: 'static'});
		$modalPw.modal('show');
		$btnPwChange.click(function() {
			$("#kt_aside_menu > ul > li.menu-item.z_menu-item1.menu-item-submenu").removeClass('menu-item-open');
			$("#kt_aside_menu > ul > li:nth-child(5)").addClass('menu-item-open');
			$("#kt_aside_menu > ul > li:nth-child(5)").children('div').children('ul').children('li:eq(2)').addClass('menu-item-active');
			
			//$("#kt_aside_menu > ul > li.menu-item.z_menu-item1.menu-item-submenu.menu-item-open > div > ul > li:nth-child(2)").addClass('menu-item-active');
			$modalPw.modal('toggle');
			z.menuLink("MA0506");			
		});
		
		$btnPwAutoDue.click(function() {
			var dataJSONArray_delay = z.xA("Setting", "zeons_비밀번호수정연기", "update", {}, "json2");
			$modalPw.modal('toggle');
			z.msg('비밀번호 만료기한이 90일 연장되었습니다.');
			location.reload();
		});
	
		$btnModalClose.click(function() {
			$modalPw.modal('toggle');
			z.menuLink("MA01"); 	
		})
	} else {
		//시작페이지
		$("#kt_aside_menu > ul > li.menu-item.z_menu-item1.menu-item-submenu.menu-item-open > div > ul > li:nth-child(2)").addClass('menu-item-active');
//		z.menuLink("MA01");
		
		// 시작메뉴 파라메터가 있으면 처음에 열리도록 수정
		z.menuSelect(true);
	}	
	
	// 중복 로그인 체크 후 세션 정리
	
	$.ajax({
		url: '/admin/member/checkDuplicateSession.do',
		method: 'GET'
	}).done(function(resp) {
		var cntMax = resp.cntMax,
			cntSession = resp.cntSession;
		
		if (! cntMax || ! cntSession || ! (cntMax < cntSession)) {
			return;
		}
		
		z.msgYN('이미 로그인 되어 있습니다.<br/>이전 접속을 해제 하시겠습니까?<br/>취소 시 로그아웃 됩니다.', function (res) {
			if (! res ) {
				zoMainLogout();
			} else {
				$.ajax({
					url: '/admin/member/invalidateDuplicateSession.do',
					method: 'POST'
				});
			}
		});
	});
	
	z.pushStateInit();
	
	// FIXME: 다국어 스크립트로 분리 필요 > 퍼블리싱 새로 오는 내용 보고 결정
	$.fn.datepicker.dates['kr'] = {
		days: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"],
		daysShort: ["일", "월", "화", "수", "목", "금", "토", "일"],
		daysMin: ["일", "월", "화", "수", "목", "금", "토", "일"],
		months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        monthsShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        titleFormat: "yyyy년 MM", /* Leverages same syntax as 'format' */
	};
});

//로그아웃
function zoMainLogout() {
	setTimeout("document.location.href='/admin/member/adminActionLogout.do'", 1000);
}


function zoMainOpenReLogin(){      
	window.top.location.href = "/admin/member/aLogin.do";
}