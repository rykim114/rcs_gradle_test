'use strict';
// Class definition

var apiSearchIndustryInfo = function() {
    // Private functions
	var isActivated,
		$btnActivate,
		$searchWrapper,
		$searchDateRange,
		$startDurationYMD,
		$radioTimeBound,
		$startYMD,
		$endYMD,
		$checkSanggaType,
		$checkFloorBound,
		$btnOk,
		$btnClose,
		$searchResult = $('.searchResult2');

	var setBtnListener = function() {

//		$btnActivate.click(function() {
//
//			if (! isActivated) {
//				isActivated = true;
//				$searchWrapper.show();
//			} else {
//				isActivated = false;
//				$searchWrapper.hide();
//			}
//		});
		
		$radioTimeBound.change(function() {
			var value = $(this).val();
			switch (value) {
				case 'custom':
					toggleSearchTime(false, value);
					break;
				default:
					toggleSearchTime(true, value);
					break;
			}
		});
		
		$checkSanggaType.click(function() {
			var $this = $(this),
				$wrapper = (isTabidx == '1' ? $this.closest('[data-search-wrapper=sanggaType]') : $this.closest('[data-search-wrapper=sanggaType2]')),
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


		$checkFloorBound.click(function() {
			var $this = $(this),
				$wrapper = $this.closest('[data-search-wrapper=floorBound]'),
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
		
//		$btnClose.click(function() {
//			if (! isActivated) {
//				isActivated = true;
//				$searchWrapper.show();
//			} else {
//				isActivated = false;
//				$searchWrapper.hide();
//			}
//		});

		$btnOk.click(function() {
			$btnClose.click();
				
			apiSearchEmd.getAreaOk().click();
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
	
		if (isDisabled) {
			var now, past, nowCalc;
			
			switch (value) {
				case 'year':
					now = moment().endOf('year');
					nowCalc = now.clone().subtract(1, 'year');
					if(isTabidx == '1') {
						// past = now.clone().subtract(12, 'year').add(1, 'day');
						// 2022, 2023년 이후로 분리 작업 
						past = moment('2022-12-31').subtract(12, 'year').add(1, 'day');
					} else {
						past = moment().clone().startOf('year');
					}
					break;
				case 'half':
					now = moment();
					if (6 > now.get('month')) {
						now.set('month', 5).endOf('month');
					} else {
						now = now.endOf('year');
					}
					nowCalc = now.clone().subtract(2, 'quarter');
					
					if(isTabidx == '1') {
						// past = now.clone().subtract(24, 'quarter').add(1, 'day');
						// 2022, 2023년 이후로 분리 작업 
						past = moment('2022-12-31').subtract(24, 'quarter').add(1, 'day');
					} else {
						past = moment().clone().startOf('year');
					}
					break;
				case 'quarter':
					now = moment().endOf('quarter');
					nowCalc = now.clone().subtract(1, 'quarter');

					if(isTabidx == '1') {
						// past = now.clone().subtract(12, 'quarter').add(1, 'day');
						// 2022, 2023년 이후로 분리 작업 
						past = moment('2022-12-31').subtract(12, 'quarter').add(1, 'day');
					} else {
						past = moment().clone().startOf('year');
					}
					break;
				case 'month':
					now = moment().endOf('month');
					nowCalc = now.clone().subtract(1, 'month');

					if(isTabidx == '1') {
						past = now.clone().subtract(12, 'month').add(1, 'day');
					} else {
						past = moment().clone().startOf('year');
					}
					break;
			}
			past = (isTabidx == '1' ? moment.min(nowCalc, past) : past);
			nowCalc = (isTabidx == '1' ? nowCalc.format('YYYY-MM-DD') : null);

			$startDurationYMD.datepicker('setDate', past.format('YYYY-MM-DD'));
			$startDurationYMD.datepicker('setEndDate', nowCalc);
		}
	};
	

	
    return {
        // Public functions
        init: function(options) {
			$btnActivate = options.btnActivate;
			$searchWrapper = options.searchWrapper;
			$searchDateRange = options.searchDateRange;
			$btnOk = options.btnOk;
			$btnClose = options.btnClose;
			
			var now = moment(),
				past = now.clone().subtract(5, 'years'),
				past_new = now.clone().startOf('year');;
				
			$startYMD = $searchDateRange.find('[name=startYMD]');
			$endYMD = $searchDateRange.find('[name=endYMD]');
			
			isTabidx == '1' ? $startYMD.val(past.format('YYYY-MM-DD')) : $startYMD.val(past_new.format('YYYY-MM-DD'));
			isTabidx == '1' ? $endYMD.val(moment('2022-12-31').format('YYYY-MM-DD')) : $endYMD.val(now.format('YYYY-MM-DD'));
		
	        $searchDateRange.datepicker({
	            todayHighlight: true,
	            templates: {
		            leftArrow: '<i class="la la-angle-left"></i>',
		            rightArrow: '<i class="la la-angle-right"></i>'		
				},
	            format: "yyyy-mm-dd",
	            language: "kr",
	            autoclose: true
			});

			$searchDateRange.find('[data-btn-time]').click(function() {
				$(this).prev('input').datepicker('show');
			});
			 
			// 상세검색 체크박스를 모두 options 파라메터로 넣을 필요는 없어보임
			// 공통이 아니라 화면마다 달라서 각자의 js 에서 지정
			
			$radioTimeBound = $searchWrapper.find('[type=radio][name=timeBound]');
			$startYMD = $searchDateRange.find('[name=startYMD]');
			$endYMD = $searchDateRange.find('[name=endYMD]');
			$checkSanggaType = $searchWrapper.find('[type=checkbox][name=sanggaType]');
			$checkFloorBound = $searchWrapper.find('[type=checkbox][name=floorBound]');

			$startDurationYMD = $searchWrapper.find('[name=startDurationYMD]');
			
	        $startDurationYMD.datepicker({
	            todayHighlight: true,
	            templates: {
		            leftArrow: '<i class="la la-angle-left"></i>',
		            rightArrow: '<i class="la la-angle-right"></i>'		
				},
	            format: "yyyy-mm-dd",
	            language: "kr",
				autoclose: true
			}).on('changeDate', function(evt) {
				if(isTabidx == '1') {
					$startDurationYMD.datepicker('setEndDate', moment('2022-12-31').format('YYYY-MM-DD'));
					$endYMD.datepicker('setEndDate', moment('2022-12-31').format('YYYY-MM-DD'));
				}
			});
	        
			$startDurationYMD.next('[data-btn-time]').click(function() {
				$(this).prev('input').datepicker('show');
			});
			
			toggleSearchTime(true, 'quarter');

			var commCode = (isTabidx == '1' ? '100120' : '100201');
			// 업종유형 DB 조회
			z.getCommCode(commCode).done(function(resp) {
				var $wrapper = (isTabidx == '1' ? $searchWrapper.find('[data-search-wrapper=sanggaType]') : $searchWrapper.find('[data-search-wrapper=sanggaType2]')),
					$sangga = $searchResult.find('[data-search-sangga]').html(''),
					tmpl = Handlebars.compile($('#tmplSearchInputCheck').html());
					
				$wrapper.find('[type=checkbox][name=sanggaType][value!=""]').parent('label').remove();
				
				for (var i in resp) {
					var row = resp[i];
					
					$wrapper.append(tmpl({
						name: 'sanggaType',
						value: row['공통상세명'],
						text: row['공통상세명'],
						checked: ''
					}));
					
					//$sangga.append($('<strong/>', {text: row['공통상세명']}));
				}
				$checkSanggaType = $wrapper.find('[type=checkbox][name=sanggaType]');
				setBtnListener();
			});
        },


		getSearchDtl: function(param) {
			var searchDtl = {
					radioTimeBound: $searchWrapper.find('[type=radio][name=timeBound]:checked').val(),
					checkSanggaType: [],
					checkFloorBound: []
				},
				$checkSangga = (isTabidx == '1' ? 
					  $searchWrapper.find('[data-search-wrapper=sanggaType]').find('[type=checkbox][name=sanggaType]:checked')
					: $searchWrapper.find('[data-search-wrapper=sanggaType2]').find('[type=checkbox][name=sanggaType]:checked')),
				$checkFloor = $searchWrapper.find('[type=checkbox][name=floorBound]:checked');

			if ('' !== $checkSangga.val()) {
				$checkSangga.each(function(idx, elm) {
					searchDtl.checkSanggaType.push($(elm).val());
				});
			}
			
			if ('' !== $checkFloor.val()) {
				$checkFloor.each(function(idx, elm) {
					searchDtl.checkFloorBound.push($(elm).val());
				});
			}

			var searchTimeText = '',
			now,
			nowCalc,
			pastCalc,
			past = moment($startDurationYMD.val(), 'YYYY-MM-DD');
			// 단위 기준으로 12개 구간 출력
			switch (searchDtl.radioTimeBound) {
				
				case 'custom':
					now = moment($endYMD.val(), 'YYYY-MM-DD');
					past = moment($startYMD.val(), 'YYYY-MM-DD');
					pastCalc = past.clone();
					
					searchTimeText = '사용자 설정 / ' + past.format('YYYY-MM-DD') + ' ~ ' + now.format('YYYY-MM-DD');
					break;
				case 'year':
					searchTimeText = '년';
	
					if(isTabidx == '1') {
						now = moment('2022-12-31').endOf('year');
					} else {
						now = moment().endOf('year');
					}
					past = past.startOf('year');
					pastCalc = now.clone().subtract(11, 'year'). startOf('year');
					
					pastCalc = moment.max(past, pastCalc);
					break;
				case 'half':
					searchTimeText = '반기';
					
					if(isTabidx == '1') {
						now = moment('2022-12-31');
					} else {
						now = moment();
					}
					if (6 > now.get('month')) {
						now.set('month', 5).endOf('month');
					} else {
						now = now.endOf('year');
					}
					
					pastCalc = now.clone().subtract(23, 'quarter');
	
					pastCalc = moment.max(past, pastCalc);
					break;
				case 'quarter':
					searchTimeText = '분기';
					
					now = moment().endOf('quarter');
					// pastCalc = now.clone().subtract(11, 'quarter').startOf('quarter');

					if(isTabidx == '1') {
						pastCalc = moment('2022-12-31').subtract(12, 'quarter').add(1, 'day');
					} else {
						pastCalc = moment().clone().startOf('year');	
					}
					
					pastCalc = moment.max(past, pastCalc);
					break;
				case 'month':
					searchTimeText = '월';
	
					now = moment().endOf('month');
					pastCalc = now.clone().subtract(11, 'month').startOf('month');
					
					pastCalc = moment.max(past, pastCalc);
					break;
			}
			searchDtl.startYMD = (isTabidx == '1' ? pastCalc.format('YYYYMMDD') : moment().clone().startOf('year'));
			searchDtl.endYMD = (isTabidx == '1' ? moment('2022-12-31').format('YYYYMMDD') : now.format('YYYYMMDD'));
			searchDtl.pastYMD = past.format('YYYYMMDD');

			$searchResult.find('[data-search-time]').text(searchTimeText);
			var $sangga = $searchResult.find('[data-search-sangga]').html(''),
				$floor = $searchResult.find('[data-search-floor]').html('');
			
			if (! searchDtl.checkSanggaType.length) {
				$sangga.append('<label>상가유형 : </label><span>전체</span>');
			} else {				
				var sanggatypetext = "";
				$sangga.append('<label>상가유형 : </label>')
				for (var i in searchDtl.checkSanggaType) {
					if(i==searchDtl.checkSanggaType.length-1){
						sanggatypetext += searchDtl.checkSanggaType[i];
					} else {
						sanggatypetext += searchDtl.checkSanggaType[i] + ",";
					}	
				}
				$sangga.append('<strong>' + sanggatypetext + '</strong>');
			}
	
			if (! searchDtl.checkFloorBound.length) {
				$floor.append('<label>층유형 : </label><span>전체</span>');
			} else {				
				var floortypetext = "";
				$floor.append('<label>층유형 : </label>')
				for (var i in searchDtl.checkFloorBound) {
					if(i==searchDtl.checkFloorBound.length-1){
						floortypetext += searchDtl.checkFloorBound[i];
					} else {
						floortypetext += searchDtl.checkFloorBound[i] + ",";
					}	
				}
				$floor.append('<strong>' + floortypetext + '</strong>');
			}
			$('[data-search-start-time]').text(moment(searchDtl.startYMD, 'YYYYMMDD').format('YYYY.MM'));
			
			searchDtl.unitText = '개소';

			// 검색옵션 수정 시 높이 수정
		    $('.card-body').css('height', $(window).height() - $('.card-body').offset().top - 20);
		
			return searchDtl;
		}

    };
}();
