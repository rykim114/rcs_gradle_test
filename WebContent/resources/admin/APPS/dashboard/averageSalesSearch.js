'use strict';
// Class definition

var apiSearchAverageSales = function() {
    // Private functions
	var isActivated,
		$btnActivate,
		$searchWrapper,
		$startDurationYMD,		         
		$searchDateRange,
		$radioTimeBound,
		$startYMD,
		$endYMD,
		$checkSanggaType,
		$radioAreaUnit,
		$radioPriceUnit,
		$checkAreaBound,
		$checkFloorBound,
		$radioResultArea,
		$radioResultColumn,
		$btnOk,
		$btnClose,
		$searchResult = $('.searchResult2'),
		columnMode = 'sangga';

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

		$checkAreaBound.click(function() {
			var $this = $(this),
				$wrapper = $this.closest('[data-search-wrapper=areaBound]'),
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
		
		// 면적유형 선택에 따라 면적 범위, 가격 기준 변경
		$radioPriceUnit.click(function() {		
			var	$areaSpan = $('.areaSpan'), 
				$this = $(this).val(),
				idx = $this === "" ? 0 : 1,
				areaCheck = $radioAreaUnit.eq(idx),
				areaRange = 0;

			/*
			if (areaCheck.data('checked')) {
				return;
			} else {
				areaCheck.addClass('btn-outline-danger').removeClass('btn-outline-darklight');				
				areaCheck.attr('data-checked', true);
				$radioAreaUnit.eq(idx === 0 ? 1 : 0).removeClass('btn-outline-danger').addClass('btn-outline-darklight')
				$radioAreaUnit.eq(idx === 0 ? 1 : 0).removeAttr('data-checked');
			}
			
				
			for(var i = 1; i < $checkAreaBound.length; ++i) {
				var areaArr = [],
					areaArr = $checkAreaBound.eq(i).val().split(','),
					areaRangeStart = parseInt(areaArr[0]),
					areaRangeEnd = parseInt(areaArr[1]); 
					
				if(areaRangeStart == 0) {
					areaRange = z.toComma(Math.round(areaRangeEnd / ($this === 'py' ? zo.py2m : 1))); 
					$areaSpan.eq(i).text(' ' + areaRange +' 미만');
				} else if(areaRangeEnd == 1000000000) { 
					areaRange = z.toComma(Math.round(areaRangeStart / ($this === 'py' ? zo.py2m : 1)));
					$areaSpan.eq(i).text(' ' + areaRange + ' 이상');
				} else {
					areaRange = ' ' + z.toComma(Math.round(areaRangeStart / ($this === 'py' ? zo.py2m : 1))) + ' 이상 ~ ' + z.toComma(Math.round(areaRangeEnd / ($this === 'py' ? zo.py2m : 1))) + ' 미만';								
					$areaSpan.eq(i).text(areaRange);														
				}					
			}
			*/											
		});
		
		// 가격기준 선택에 따라 면적 범위, 가격 기준 변경
		$radioAreaUnit.click(function() {
			var $this = $(this),
				$areaSpan = $('.areaSpan'), 		
				areaRange = 0,
				areaUnit = $this[0].dataset.areaUnit,
				idx = areaUnit === 'py' ? 1 : 0;				
		
			if ($this.attr('data-checked')) {
				return;
			}

			$radioAreaUnit.removeAttr('data-checked');
			$radioAreaUnit.removeClass('btn-outline-danger').addClass('btn-outline-darklight');
			
			$this.attr('data-checked', true);
			$this.addClass('btn-outline-danger').removeClass('btn-outline-darklight');			

			for(var i = 1; i < $checkAreaBound.length; ++i) {
				var areaArr = [],
					areaArr = $checkAreaBound.eq(i).val().split(','),
					areaRangeStart = parseInt(areaArr[0]),
					areaRangeEnd = parseInt(areaArr[1]); 
					
				if(areaRangeStart == 0) {
					areaRange = z.toComma(Math.round(areaRangeEnd / (areaUnit === 'py' ? zo.py2m : 1))); 
					$areaSpan.eq(i).text(' ' + areaRange + ' 미만');
				} else if(areaRangeEnd == 1000000000) { 
					areaRange = z.toComma(Math.round(areaRangeStart / (areaUnit === 'py' ? zo.py2m : 1)));
					$areaSpan.eq(i).text(' ' + areaRange + ' 이상');
				} else {
					areaRange = ' ' + z.toComma(Math.round(areaRangeStart / (areaUnit === 'py' ? zo.py2m : 1))) + ' 이상 ~ ' + z.toComma(Math.round(areaRangeEnd / (areaUnit === 'py' ? zo.py2m : 1))) + ' 미만';								
					$areaSpan.eq(i).text(areaRange);														
				}					
			}
			
			//$radioPriceUnit.eq(idx).prop('checked',true);
		
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

		$('[data-target="#tab01_01"], [data-target="#tab01_02"]').off('click').on('click', function() {
			var $this = $(this),
				tab = $this.attr('data-target'),
				$tab1 = $('#tab01_01 [data-ui-search-detail]'),
				$tab2 = $('#tab01_02 [data-ui-search-detail]'),
				$detail = $tab1.length ? $tab1 : $tab2;
				
			switch (tab) {
				case '#tab01_01':
					columnMode = 'sangga';
					$detail.detach().appendTo('#tab01_01 [data-column-mode]');
					break;
				case '#tab01_02':
					columnMode = 'area';
					$detail.detach().appendTo('#tab01_02 [data-column-mode]');
					break;
			}
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
				case '4':
					now = moment().endOf('month');
					nowCalc = now.clone().subtract(1, 'month');
					past = now.clone().subtract(12, 'month').add(1, 'day');
					break;
			}
			past = moment.min(nowCalc, past);
			
			$startDurationYMD.datepicker('setEndDate', nowCalc.format('YYYY-MM-DD'));
			$startDurationYMD.datepicker('setDate', past.format('YYYY-MM-DD'));
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
				past = now.clone().subtract(5, 'years');

			$startYMD = $searchDateRange.find('[name=startYMD]');
			$endYMD = $searchDateRange.find('[name=endYMD]');
				
			$startYMD.val(past.format('YYYY-MM-DD')).attr('data-prev', $startYMD.val());
			$endYMD.val(now.format('YYYY-MM-DD')).attr('data-prev', $endYMD.val());

	        $searchDateRange.datepicker({
	            todayHighlight: true,
	            templates: {
		            leftArrow: '<i class="la la-angle-left"></i>',
		            rightArrow: '<i class="la la-angle-right"></i>'		
				},
	            format: "yyyy-mm-dd",
	            language: "kr",
				autoclose: true,
				endDate: moment().format('YYYY-MM-DD')
			}).on('changeDate', function(evt) {
				if ($startYMD.val() > $endYMD.val()) {
					if ($startYMD[0] === evt.target) {
						$.notify({message: '종료일은 시작일보다 빠를 수 없습니다.'});
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
			
			$radioTimeBound = $searchWrapper.find('[type=radio][name=timeBound]');
			$checkSanggaType = $searchWrapper.find('[type=checkbox][name=sanggaType]');
			$radioAreaUnit = $searchWrapper.find('[data-area-unit]');
			$checkAreaBound = $searchWrapper.find('[type=checkbox][name=areaBound]');
			$checkFloorBound = $searchWrapper.find('[type=checkbox][name=floorBound]');
			$radioResultArea = $searchWrapper.find('[type=radio][name=resultArea]');
			$radioPriceUnit = $searchWrapper.find('[type=radio][name=priceUnit]');
			$startDurationYMD = $searchWrapper.find('[name=startDurationYMD]');
			$startDurationYMD.attr('data-prev', $startDurationYMD.val());

	        $startDurationYMD.datepicker({
	            todayHighlight: true,
	            templates: {
		            leftArrow: '<i class="la la-angle-left"></i>',
		            rightArrow: '<i class="la la-angle-right"></i>'		
				},
	            format: "yyyy-mm-dd",
	            language: "kr",
				autoclose: true
			});

			$startDurationYMD.next('[data-btn-time]').click(function() {
				$(this).prev('input').datepicker('show');
			});

			//toggleSearchTime(true, '4');
			toggleSearchTime(true, '3');

			// 상가유형 DB 조회
			z.getCommCode('100100').done(function(resp) {
				var $wrapper = $searchWrapper.find('[data-search-wrapper=sanggaType]'),
					//$sangga = $searchResult.find('[data-search-sangga]').html(''),
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
				
				//$radioAreaUnit.click();
			});
        },


		getSearchDtl: function(param) {
//			if (! isActivated) {
//				return {
//					radioTimeBound: '',
//					radioAreaUnit: '',
//					//radioResultColumn: '연면적',
//					radioResultArea: '전용면적당분양가',
//					radioPriceUnit: '',
//					selectedTimeGap: '',
//					checkSanggaType: [],
//					checkAreaBound: [],
//					checkFloorBound: []					
//				};
//			}

			var searchDtl = {
					radioTimeBound: $searchWrapper.find('[type=radio][name=timeBound]:checked').val(),
					radioAreaUnit: $searchWrapper.find('[data-area-unit][data-checked=true]').attr('data-area-unit'),
					radioResultColumn: $searchWrapper.find('[type=radio][name=resultColumn]:checked').val(),
					radioResultArea: $searchWrapper.find('[type=radio][name=resultArea]:checked').val(),
					radioPriceUnit: $searchWrapper.find('[type=radio][name=priceUnit]:checked').val(),
					checkSanggaType: [],
					checkAreaBound: [],
					checkFloorBound: [],
					columnMode: columnMode
				},
				$checkSangga = $searchWrapper.find('[type=checkbox][name=sanggaType]:checked'),
				$checkArea = $searchWrapper.find('[type=checkbox][name=areaBound]:checked'),
				$checkFloor = $searchWrapper.find('[type=checkbox][name=floorBound]:checked');

			if ('' !== $checkSangga.val()) {
				$checkSangga.each(function(idx, elm) {
					searchDtl.checkSanggaType.push($(elm).val());
				});
			}
			
			if ('' !== $checkArea.val()) {
				$checkArea.each(function(idx, elm) {
					searchDtl.checkAreaBound.push($(elm).val());
				});
			}
			if ('' !== $checkFloor.val()) {
				$checkFloor.each(function(idx, elm) { 
					searchDtl.checkFloorBound.push($(elm).val());
				});
			}
						
			switch (searchDtl.radioResultArea) {
				case '':
					break;
				case '전용면적':
					searchDtl.radioResultArea = '전용면적';
					break;
				case '계약면적':
					searchDtl.radioResultArea = '계약면적';
					break;
				default:
					searchDtl.radioResultArea = '전용면적';
					break;
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
				case '1':
					searchTimeText = '년';

					now = moment().endOf('year');
					past = past.startOf('year');
					pastCalc = now.clone().subtract(11, 'year'). startOf('year');
					
					pastCalc = moment.max(past, pastCalc);
					break;
				case '2':
					searchTimeText = '반기';
					
					now = moment();
					if (6 > now.get('month')) {
						now.set('month', 5).endOf('month');
					} else {
						now = now.endOf('year');
					}
					
					pastCalc = now.clone().subtract(23, 'quarter');

					pastCalc = moment.max(past, pastCalc);
					break;
				case '3':
					searchTimeText = '분기';

					now = moment().endOf('quarter');
					pastCalc = now.clone().subtract(11, 'quarter').startOf('quarter');
					
					pastCalc = moment.max(past, pastCalc);
					break;
				case '4':
					searchTimeText = '매월';

					now = moment().endOf('month');
					pastCalc = now.clone().subtract(11, 'month').startOf('month');
					
					pastCalc = moment.max(past, pastCalc);
					break;
			}
			
			searchDtl.startYMD = pastCalc.format('YYYYMMDD');
			searchDtl.endYMD = now.format('YYYYMMDD');
			searchDtl.pastYMD = past.format('YYYYMMDD');

			$searchResult.find('[data-search-time]').text(searchTimeText);

			var $sangga = $searchResult.find('[data-search-sangga]').html(''),
				$area = $searchResult.find('[data-search-area]').html(''),
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
	
			if (! searchDtl.checkAreaBound.length) {
				$area.append('<label>면적유형 : </label><span>전체</span>');
			} else {
				var areatext = "";
				$area.append('<label>면적유형 : </label>')
				for (var i in searchDtl.checkAreaBound) {
					var bound = searchDtl.checkAreaBound[i].split(','),
						isPy = 'py' === searchDtl.radioAreaUnit,
						min = bound[0],
						max = bound[1],
						minInt = ((! parseInt(min)) ? '' : min) / (isPy ? zo.py2m : 1),
						maxInt = ((parseInt(max) > 30000) ? '' : max) / (isPy ? zo.py2m : 1),
						text = (minInt ? z.toComma(minInt) + (isPy ? '평' : '㎡') : '')
							+ '~'
							+ (maxInt ? z.toComma(maxInt) + (isPy ? '평' : '㎡') : '');

					if(i==searchDtl.checkAreaBound.length-1){
						areatext += text;
					} else {
						areatext += text + ",";
					}
				}  
				$area.append('<strong>' + areatext + '</strong>');
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
			

			
			if (searchDtl.checkAreaBound.length) {
				$checkArea.each(function(idx, elm) {
					
					var areaArr = [];
					var areaUnit = ''; 
					areaArr = $(elm).val().split(',');
					
					if(areaArr[0] == '0') {
						areaUnit = '1,000㎡ 미만'; 
					} else if(areaArr[1] == '1000000000') {
						areaUnit = '30,000㎡ 이상';
					} else {
						areaUnit = z.toComma(areaArr[0]) + '㎡~' + z.toComma(areaArr[1]) + '㎡';
					}

					searchDtl.checkAreaBound.splice(0);
					searchDtl.checkAreaBound.push(areaUnit);
					
				});
			}
			
			
			if ('area' === columnMode) {
				 $('[data-search-column-text]').text('연면적별');
			} else {
				 $('[data-search-column-text]').text('상가유형별');
			}
			
			// 시작시점 표시
			$('[data-search-start-time]').text(moment(searchDtl.startYMD, 'YYYYMMDD').format('YYYY.MM'));
			
			// 결과유형 표시
			$('[data-search-area-text]').text($searchWrapper.find('[type=radio][name=resultArea]:checked').parent('label').text());
			
			var unitText = searchDtl.radioPriceUnit == 'py' ? ' (단위 : 만원 / 3.3㎡)' : ' (단위 : 만원 / ㎡)';
			$('[data-search-price-text]').text($searchWrapper.find('[type=radio][name=priceUnit]:checked').parent('label').text());
			
			// 단위 표시
			$('[data-search-unit-text]').text(unitText);
			searchDtl.unitText = unitText.substring(unitText.indexOf(':') + 1, unitText.indexOf(')'));
			
			// 검색옵션 수정 시 높이 수정
		    $('.card-body').css('height', $(window).height() - $('.card-body').offset().top - 20);
			
			return searchDtl;
		}

    };
}();
