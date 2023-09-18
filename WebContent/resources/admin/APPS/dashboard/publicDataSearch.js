'use strict';
// Class definition

var apiSearchPublicData = function() {
    // Private functions
	var isActivated,
		$btnActivate,
		$searchWrapper,
		$searchDateRange,
		$startYMD,	// 사용자설정 시작
		$endYMD,	// 사용자 설정 종료
		$startDurationYMD,		// 시작시점
		$checkSanggaColumn,		// 상가유형
		//$checkResultColumn,		// 결과유형
		$btnOk,
		$btnClose,
		$searchResult = $('.searchResult2' );   

	var setBtnListener = function() {
		
		$checkSanggaColumn.click(function() {
			var $this = $(this),
				$wrapper = $this.closest('[data-search-wrapper=sanggaType]'),
				$all = $wrapper.find('[type=checkbox][value=""]'),
				$check = $wrapper.find('[type=checkbox][value!=""]');
			
			switch ($this.val()) {
				case '': // 전체
					if ($this.prop('checked')) {
						// 나머지 해제
						$check.prop('checked', false);
					} else {
						// 모두 해제 시 1개 선택
						var isChecked = false;
						$check.each(function(idx, elm) {
							if (isChecked = $(elm).prop('checked')) {
								return false;
							}
						});
						
						if (! isChecked) {
							$check.eq(0).prop('checked', true);
						}
					}
					break;
				default: // 나머지
					if ($this.prop('checked')) {
						$all.prop('checked', false);
					} else {
						// 모두 해제 시 전체 선택
						var isChecked = false;
						$check.each(function(idx, elm) {
							if (isChecked = $(elm).prop('checked')) {
								return false;
							}
						});
						
						if (! isChecked) {
							$all.prop('checked', true);
						}
					}
					break;
			}
		});
		
		
		/*
		$checkResultColumn.click(function() {
			var $this = $(this),
				$wrapper = $this.closest('[data-search-wrapper=resultType]'),
				$all = $wrapper.find('[type=checkbox][value=""]'),
				$check = $wrapper.find('[type=checkbox][value!=""]');
			
			switch ($this.val()) {
				case '': // 전체
					if ($this.prop('checked')) {
						// 나머지 해제
						$check.prop('checked', false);
					} else {
						// 모두 해제 시 1개 선택
						var isChecked = false;
						$check.each(function(idx, elm) {
							if (isChecked = $(elm).prop('checked')) {
								return false;
							}
						});
						
						if (! isChecked) {
							$check.eq(0).prop('checked', true);
						}
					}
					break;
				default: // 나머지
					if ($this.prop('checked')) {
						$all.prop('checked', false);
					} else {
						// 모두 해제 시 전체 선택
						var isChecked = false;
						$check.each(function(idx, elm) {
							if (isChecked = $(elm).prop('checked')) {
								return false;
							}
						});
						
						if (! isChecked) {
							$all.prop('checked', true);
						}
					}
					break;
			}
		}); 
		*/
		
		$btnOk.click(function() {
			$btnClose.click();
			
			apiSearchPublicMap.getAreaOk().click();
		});
	};
	
	var toggleSearchTime = function(isDisabled, value) {
		if (undefined === isDisabled) {
			isDisabled = ! $startYMD.prop('disabled');
		}
		
		$startYMD.prop('disabled', isDisabled);
		$endYMD.prop('disabled', isDisabled);
		$searchDateRange.find('[data-btn-time]').prop('disabled', isDisabled);

		$startDurationYMD.prop('disabled', ! isDisabled);
		/*
		if (isDisabled) {
			var now, past, nowCalc;
			switch (value) {
				case '1':
					now = moment().endOf('year');
					nowCalc = now.clone().subtract(1, 'year');
					past = now.clone().subtract(12, 'year').add(1, 'day');
					break;
				case '2':
					now = moment();
					
					if (6 > now.get('month')) {
						now.set('month', 5).endOf('month');
					} else {
						now = now.endOf('year');
					}
					nowCalc = now.clone().subtract(2, 'quarter');
					past = now.clone().subtract(24, 'quarter').add(1, 'day');
					
					break;
				case '3':
					now = moment().endOf('quarter');
					nowCalc = now.clone().subtract(1, 'quarter');
					past = now.clone().subtract(12, 'quarter').add(1, 'day');
					break;
			}
			past = moment.min(nowCalc, past);
			
			$startDurationYMD.datepicker('setEndDate', nowCalc.format('YYYY-MM-DD'));
			$startDurationYMD.datepicker('setDate', past.format('YYYY-MM-DD'));
		}
		*/
		setBtnListener();
	};
	
    return {
        // Public functions
        init: function(options) {
			$btnActivate = options.btnActivate;
			$searchWrapper = options.searchWrapper;
			$searchDateRange = options.searchDateRange;
			$btnOk = options.btnOk;
			$btnClose = options.btnClose;
			
			var data = z.xmlAjax('publicData', '자료최종일자', 'select', null, 'json');
			
			var now = data[0].시점;
				
			$startYMD = $searchDateRange.find('[name=startYMD]');
			$endYMD = $searchDateRange.find('[name=endYMD]');
			
			$startYMD.val(now).attr('data-prev', $startYMD.val());
			$endYMD.val(now).attr('data-prev', $endYMD.val());

	        $searchDateRange.datepicker({
	            todayHighlight: true,
	            minViewMode: 'years',
	            templates: {
		            leftArrow: '<i class="la la-angle-left"></i>',
		            rightArrow: '<i class="la la-angle-right"></i>'		
				},
	            format: "yyyy",
	            language: "kr",
	            autoclose: true,
				endDate: now
			}).on('changeDate', function(evt) {
				if ($startYMD.val() > $endYMD.val()) {
					if ($startYMD[0] === evt.target) {
						$.notify({message: '종료년은 시작년도보다 빠를 수 없습니다.'});
					}

					$startYMD.datepicker('setDate', $startYMD.attr('data-prev'));
					$endYMD.datepicker('setDate', $endYMD.attr('data-prev'));
				} else {
					$startYMD.attr('data-prev', $startYMD.val());
					$endYMD.attr('data-prev', $endYMD.val());
				}
			});
	        
	    	$searchDateRange.find('[data-btn-time]').click(function() {
				$(this).prev('input').datepicker('show');
			});
			// 상세검색 체크박스를 모두 options 파라메터로 넣을 필요는 없어보임
			// 공통이 아니라 화면마다 달라서 각자의 js 에서 지정
	    	
			
			$startDurationYMD = $searchWrapper.find('[type=text][name=startDurationYMD]');
			
			$startDurationYMD.attr('data-prev', $startDurationYMD.val());
			
			$startDurationYMD.datepicker({
	            todayHighlight: true,
	            minViewMode: 'years',
	            templates: {
		            leftArrow: '<i class="la la-angle-left"></i>',
		            rightArrow: '<i class="la la-angle-right"></i>'		
				},
	            format: "yyyy",
	            language: "kr",
				autoclose: true
			});
			
			$startDurationYMD.next('[data-btn-time]').click(function() {
				$(this).prev('input').datepicker('show');
			});

			$checkSanggaColumn = $searchWrapper.find('[type=checkbox][name=sanggaType]');
			//$checkResultColumn = $searchWrapper.find('[type=checkbox][name=resultType]');
			
			toggleSearchTime(false , '4');
        },

		getSearchDtl: function(param) {
			var searchDtl = {
					checkSanggaType: [],
					checkResultType: []
				},
				$checkSangga = $searchWrapper.find('[type=checkbox][name=sanggaType]:checked');
				//$checkResult = $searchWrapper.find('[type=checkbox][name=resultType]:checked');

				if ('' !== $checkSangga.val()) {
					$checkSangga.each(function(idx, elm) {
						searchDtl.checkSanggaType.push($(elm).val());
					});
				}
				
			/*
				if ('' !== $checkResult.val()) {
					$checkResult.each(function(idx, elm) {
						searchDtl.checkResultType.push($(elm).val());
					});
				}
			*/
			var searchTimeText = '',
				now,
				nowCalc,
				pastCalc,
				past = moment($startDurationYMD.val(), 'YYYY');
		
				now = moment($endYMD.val(), 'YYYY');
				past = moment($startYMD.val(), 'YYYY');
				pastCalc = past.clone();
				
				searchTimeText = '년 / ' + past.format('YYYY') + ' ~ ' + now.format('YYYY');
					
				pastCalc = moment.max(past, pastCalc);
				/*
				 	now = moment($endYMD.val(), 'YYYY-MM-DD');
					past = moment($startYMD.val(), 'YYYY-MM-DD');

					pastCalc = past.clone();
					searchTimeText = '사용자 설정 / ' + past.format('YYYY-MM-DD') + ' ~ ' + now.format('YYYY-MM-DD');
				*/
					
			searchDtl.startYMD = pastCalc.format('YYYY');
			searchDtl.endYMD = now.format('YYYY');
			searchDtl.pastYMD = past.format('YYYY');
			
			$searchResult.find('[data-search-time]').text(searchTimeText);
			
			var $sanggatype = $searchResult.find('[data-search-sangga]').html('');
			//var $resulttype = $searchResult.find('[data-search-result-column-text]').html('');
			
			if (! searchDtl.checkSanggaType.length) {
				$sanggatype.append('<label>상가유형 : </label><span>전체</span>');
			} else {
				var sanggatypetext = "";
				$sanggatype.append('<label>상가유형 : </label>')
				for (var i in searchDtl.checkSanggaType) {
					if(i==searchDtl.checkSanggaType.length-1){
						sanggatypetext += searchDtl.checkSanggaType[i];
					} else {
						sanggatypetext += searchDtl.checkSanggaType[i] + ",";
					}	
				}
				$sanggatype.append('<strong>' + sanggatypetext + '</strong>');
			}
			/*
			if (! searchDtl.checkResultType.length) {
				$resulttype.append('<label>결과유형 : </label><span>전체</span>');
			} else {
				var resulttypetext = "";
				$resulttype.append('<label>결과유형 : </label>')
				for (var i in searchDtl.checkResultType) {
					if(i==searchDtl.checkResultType.length-1){
						resulttypetext += searchDtl.checkResultType[i];
					} else {
						resulttypetext += searchDtl.checkResultType[i] + ",";
					}	
				}
				$resulttype.append('<strong>' + resulttypetext + '</strong>');
			}
			*/
			//$('[data-search-result-column-text]').text($searchWrapper.find('[type=radio][name=resultColumn]:checked').parent('label').text());
			
			// 시작시점 표시
			$('[data-search-start-time]').text(moment(searchDtl.startYMD, 'YYYYMMDD').format('YYYY.MM'));
						
			// 검색옵션 수정 시 높이 수정
		    $('.card-body').css('height', $(window).height() - $('.card-body').offset().top - 20);

			// 검색옵션 수정 시 높이 수정
		    $('.dashboard2 .detailSearch').css('top', 134);

			return searchDtl;
		}
    };
}();
