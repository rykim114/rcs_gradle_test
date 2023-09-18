'use strict';
// Class definition

$(document).ready(function() {
	$(".selectpicker").selectpicker();

	// 기본적으로 팝업관련 데이터는 disabled로 처리
	$('#popupYN').val('N');
	$('#popupContent').attr('disabled', true);
	$('#popupDate').find('input').attr('disabled', true);

	if($('input:checkbox[name=Checkboxes1]').is(':checked') == true){
		$('#2Top').val('Y');
	}else{
		$('#2Top').val('N');
	}

	// 공지사항 팝업 노출/미노출에 따른 처리
	$('.popup_check_wrap input').on('click', function() {
		var $this = $(this);
		if($this.is(':checked')) {
			$('#popupYN').val('Y');
			$('#popupContent').removeAttr('disabled');
			$('#popupDate').find('input').removeAttr('disabled');
			popupDate();
		} else {
			$('#popupYN').val('N');
			$('#popupContent').attr('disabled', true);
			$('#popupDate').find('input').attr('disabled', true);
			$('#popupDate').find('input').val('');
		}
	})
	var seq = z.getValue("noticeSeq");
	var noticeCount = z.xA("Admin", "zeons_공지사항유무", "select", {"seq": seq}, "json2");


	if(  noticeCount[0].count < 1){

		$('#submitNotice').on('click', function(e){
			if($('input:checkbox[name=Checkboxes1]').is(':checked') == true){
				$('#2Top').val('Y');
			}else{
				$('#2Top').val('N');
			}
			const startYMD = $("#startYMD").val();
			const startHHMM = $("#startHHMM").val();
			const endYMD = $("#endYMD").val();
			const endHHMM = $("#endHHMM").val();
			if($("#status").val() != "" && $("#title").val() != "" && $("#content").val() != "" && $("#noticeYN").val() != "" &&
					(
						($('#popupYN').val() == 'Y' && $('#popupContent').val() != "" &&
							startYMD != "" && startHHMM != "" &&
							endYMD != "" && endHHMM != "" &&
							(new Date(`${startYMD} ${startHHMM}`) < new Date(`${endYMD} ${endHHMM}`))
						) || $('#popupYN').val() == 'N'
					)
				){
				z.msgYN("공지사항을 등록하시겠습니까?",  function (res) {
					if(res == true){

						var dataJSONArray  = z.xA("Admin", "zeons_공지사항", "insert",
							{
								"status" : $("#status").val(),
								"title" : $("#title").val(),
								"content" : $("#content").val(),
								"masterSeq" : $("#masterSeq").val(),
								"noticeYN" : $("#noticeYN").val(),
								"noticeTop" : $("#2Top").val(),
								"popupYN" : $("#popupYN").val(),
								"popupContent" : $("#popupContent").val(),
								"popupStartDate" : $("startYMD").val(),
								"popupStartDate" : `${startYMD} ${startHHMM}`,
								"popupEndDate" : `${endYMD} ${endHHMM}`
							}, "json2");
						z.buttonClick("MA0612", "신규등록", "C" );
						z.menuLink("MA0612");

					}else{
						return;
					}
				});
			}else{
				if($("#status").val() == ""){
					z.msg("분류를 설정해주세요");
					return;
				}
				if($("#noticeYN").val() == ""){
					z.msg("공지구분을 설정해주세요");
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
				if($("#popupYN").val() == "Y") {
					if($("#popupContent").val() == "") {
						$("#popupContent").focus();
						z.msg("팝업내용을 입력해주세요");
						return;
					}
					if(startYMD == "" || startHHMM == "") {
						$("#startYMD").focus();
						z.msg("팝업 게시 기간을 설정해주세요");
						return;
					}
					if(endYMD == "" || endHHMM == "") {
						$("#endYMD").focus();
						z.msg("팝업 게시 기간을 설정해주세요");
						return;
					}
					if(new Date(`${startYMD} ${startHHMM}`) >= new Date(`${endYMD} ${endHHMM}`)) {
						$("#endHHMM").focus();
						z.msg("종료시간이 시작시간을 넘길 수 없습니다");
						return;
					}
				}
			}
		})
	}else{
		var dataJSONArray = z.xA("Admin","zeons_공지사항상세수정", "select", {"순번":seq}, "json2");
		var noticeDetail = dataJSONArray[0];
		var checkYn = noticeDetail.상단공지여부;
		var popupYn = noticeDetail.팝업여부;
		var checkFile = false;
		var startDate = noticeDetail.팝업시작일시.split(' ');
		var endDate = noticeDetail.팝업종료일시.split(' ');

		$('#status').val(noticeDetail.분류).prop('selected', true);
		$('#noticeYN').val(noticeDetail.공지구분).prop('selected', true);
		$('#title').attr('value', noticeDetail.t_title);
		$('#content').html(noticeDetail.내용);

		if(popupYn == 'Y') {
			$('#popupYN').prop('checked', true);
			$('#popupContent').removeAttr('disabled');
			$('#popupDate').find('input').removeAttr('disabled');

			$('#popupContent').html(noticeDetail.팝업내용);
			$('#startYMD').val(startDate[0]);
			$('#startHHMM').val(startDate[1].slice(0, 5));
			$('#endYMD').val(endDate[0]);
			$('#endHHMM').val(endDate[1].slice(0, 5));
			popupDate();
		}
	
		var statusText = $('#status option:selected').text();
		var noticeYNText = $('#noticeYN option:selected').text();
		$('#status').siblings().find('.filter-option .filter-option-inner .filter-option-inner-inner').text(statusText);
		$('#noticeYN').siblings().find('.filter-option .filter-option-inner .filter-option-inner-inner').text(noticeYNText);

		if(checkYn == 'Y'){
			$('#2Top').prop('checked', true);
		}
		// 팝업 관련
		if(dataJSONArray[0].첨부파일id != null && dataJSONArray[0].첨부파일id != ''){

			for(var i=0; i<dataJSONArray.length; i++){

				myDropzone4.addFile({ name: dataJSONArray[i].원본파일명, size: dataJSONArray[i].파일사이즈, type: dataJSONArray[i].파일확장자, imageUrl: dataJSONArray[i].파일저장경로, accepted: true});
				//, masterSeq : dataJSONArray[i].첨부파일id, detailSeq : dataJSONArray[i].순번

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

		$('#submitNotice').on('click', function(){
			if($('input:checkbox[name=Checkboxes1]').is(':checked') == true){
				$('#2Top').val('Y');
			}else{
				$('#2Top').val('N');
			}
			// 팝업 여부
			if($('input:checkbox[name=Checkboxes2]').is(':checked') == true){
				$('#popupYN').val('Y');
			}else{
				$('#popupYN').val('N');
			}
			const startYMD = $("#startYMD").val();
			const startHHMM = $("#startHHMM").val();
			const endYMD = $("#endYMD").val();
			const endHHMM = $("#endHHMM").val();
			z.msgYN("수정하시겠습니까?",  function (res) {
				if(res == true){
					if($('#masterSeq').val() == null && dataJSONArray[0].첨부파일id != null && dataJSONArray[0].첨부파일id != ''){

						$('#masterSeq').val(dataJSONArray[0].첨부파일id);
					}
					if($("#status").val() != "" && $("#title").val() != "" && $("#content").val() != "" && $("#noticeYN").val() != "" &&
							(
								($('#popupYN').val() == 'Y' && $('#popupContent').val() != "" &&
									startYMD != "" && startHHMM != "" &&
									endYMD != "" && endHHMM != "" &&
									(new Date(`${startYMD} ${startHHMM}`) < new Date(`${endYMD} ${endHHMM}`))
								) || $('#popupYN').val() == 'N'
							)
						){

						var dataJSONArray2 = z.xA("Admin", "zeons_공지사항", "update",
							{	"status" : $("#status").val(),
								"title" : $("#title").val(),
								"content" : $("#content").val(),
								"masterSeq" : $("#masterSeq").val(),
								"noticeYN" : $("#noticeYN").val(),
								"noticeTop" : $("#2Top").val(),
								"popupYN" : $("#popupYN").val(),
								"popupContent" : $("#popupContent").val(),
								"popupStartDate" : `${startYMD} ${startHHMM}`,
								"popupEndDate" : `${endYMD} ${endHHMM}`,
								"seq" : seq
							}, "json2");
						z.msg("수정이 완료됐습니다.", function(res){
							if(res){
								z.buttonClick("MA0612", "공지수정", "U" );
								z.menuLink('MA0612');
							}
						});

					}else{
						if($("#status").val() == ""){
							z.msg("분류를 설정해주세요");
							return;
						}
						if($("#noticeYN").val() == ""){
							z.msg("공지구분을 설정해주세요");
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
						if($("#popupYN").val() == "Y") {
							if($("#popupContent").val() == "") {
								$("#popupContent").focus();
								z.msg("팝업내용을 입력해주세요");
								return;
							}
							if(startYMD == "" || startHHMM == "") {
								$("#startYMD").focus();
								z.msg("팝업 게시 기간을 설정해주세요");
								return;
							}
							if(endYMD == "" || endHHMM == "") {
								$("#endYMD").focus();
								z.msg("팝업 게시 기간을 설정해주세요");
								return;
							}
							if(new Date(`${startYMD} ${startHHMM}`) >= new Date(`${endYMD} ${endHHMM}`)) {
								$("#endHHMM").focus();
								z.msg("종료시간이 시작시간을 넘길 수 없습니다");
								return;
							}
						}
					}
				}else{
					return;
				}
			});
		});
	}

	// 공지사항 관련 팝업 게시기간 설정
function popupDate() {
	var now = moment(),
		future = now.clone().add(5, 'years');
	const $searchDateRange = $('[data-search-time]');	// 날짜
	const $dataTime = $('[data-time]');					// 시간
	const $startYMD = $searchDateRange.find('[name=startYMD]');
	const $endYMD = $searchDateRange.find('[name=endYMD]');
	const $startHHMM = $dataTime.find('[name=startHHMM]');
	const $endHHMM = $dataTime.find('[name=endHHMM]');

	const startYMD = $startYMD.val();
	const endYMD = $endYMD.val();
	const startHHMM = $startHHMM.val();
	const endHHMM = $endHHMM.val();

	if (noticeCount[0].count < 1) {
		$startYMD.val(now.format('YYYY-MM-DD')).attr('data-prev', startYMD);
		$endYMD.val(now.clone().add(7, 'days').format('YYYY-MM-DD')).attr('data-prev', endYMD);
		$startHHMM.val(now.format('HH:mm')).attr('data-prev', startHHMM);
		$endHHMM.val(now.format('HH:mm')).attr('data-prev', endHHMM);
	} else {
		$startYMD.val(startYMD == '' ? now.format('YYYY-MM-DD') : startYMD).attr('data-prev', startYMD);
		$endYMD.val(endYMD == '' ? now.clone().add(7, 'days').format('YYYY-MM-DD') : endYMD).attr('data-prev', endYMD);
		$startHHMM.val(startHHMM == '' ? now.format('HH:mm') : startHHMM).attr('data-prev', startHHMM);
		$endHHMM.val(endHHMM == '' ? now.format('HH:mm') : endHHMM).attr('data-prev', endHHMM);
	}
	$searchDateRange.datepicker({
		todayHighlight: true,
		templates: {
			leftArrow: '<i class="la la-angle-left"></i>',
			rightArrow: '<i class="la la-angle-right"></i>'
		},
		format: "yyyy-mm-dd",
		language: "kr",
		autoclose: true,
		endDate: future.format('YYYY-MM-DD')
	}).on('changeDate', function(evt) {
		if (startYMD > endYMD) {
			if ($startYMD[0] === evt.target) {
				$.notify({message: '종료일은 시작일보다 빠를 수 없습니다.'});
				return;
			}

			$startYMD.datepicker('setDate', $startYMD.attr('data-prev'));
			$endYMD.datepicker('setDate', $endYMD.attr('data-prev'));
		} else {
			$startYMD.attr('data-prev', startYMD);
			$endYMD.attr('data-prev', endYMD);
		}
	});

	$searchDateRange.find('[data-btn-time]').click(function() {
		$(this).prev('input').datepicker('show');
	});

	$dataTime.on('keyup', function(evt) {
		const replaceTime = evt.target.value.replace(/\:/g, "");

		// 텍스트박스의 입력값이 4~5글자 사이가 되는 경우에만 실행
        if(replaceTime.length >= 4 && replaceTime.length < 5) {
            var hours = replaceTime.substring(0, 2);
            var minute = replaceTime.substring(2, 4);

            if(replaceTime == false) {
				$.notify({message: '문자는 입력하실 수 없습니다.'});
                evt.target.value = "00:00";
                return;
            }

            if(hours + minute > 2400) {
				$.notify({message: '시간은 24시를 넘길 수 없습니다.'});
                evt.target.value = "24:00";
                return;
            }

            if(minute > 60) {
				$.notify({message: '분은 60분을 넘길 수 없습니다.'});
                evt.target.value = hours + ":00";
                return;
            }
            const dateTime = hours + ":" + minute;
			evt.target.id == 'startHHMM' ? $startHHMM.val(dateTime).attr('data-prev', dateTime) : $endHHMM.val(dateTime).attr('data-prev', dateTime);
        }
	});
}
});


function noticeList(){
	z.buttonClick("MA0612", "공지목록", "R" );
	z.menuLink("MA0612");
}

