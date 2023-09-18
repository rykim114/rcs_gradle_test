'use strict';
// Class definition

var apiSearchPopulation = function() {
    // Private functions
	var isActivated,
		$btnActivate,
		$searchWrapper,
		$searchDateRange,
		$startDurationYMD,
		$radioTimeBound,
		$startYMD,
		$endYMD,
		$checkpopulationType,
		$checksexType,
		$checkageType,
		$checkdayNameType,
		$checktimeZoneType,
		$radioResultColumn,
		$checkSearchType,
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
		
		
		$checkSearchType.click(function(){
			var $this = $(this);
			//$wrapper = $this.closest('[data-search-wrapper=searchType]'),			
			//$check = $wrapper.find('[type=checkbox]:checked]');
			
			if($this.val() == 0){//성별,연령별검색일경우
				$('#searchDayTime').css("display", "none");
				$('[data-search-date]').css("display", "none");
				$('[data-search-time-duartion]').css("display", "none");
				var $dayName = $('[data-search-wrapper=dayNameType]').find('[type=checkbox][value=""]');
				var $timeZone =  $('[data-search-wrapper=timeZoneType]').find('[type=checkbox][value=""]');
				
				var $dayNameChecked = $('[data-search-wrapper=dayNameType]').find('[type=checkbox]:checked')				
				var $timeZoneChecked = $('[data-search-wrapper=timeZoneType]').find('[type=checkbox]:checked')
				
				$dayNameChecked.each(function(idx, elm) {
					$dayNameChecked.prop('checked', false);
				});
				
				$timeZoneChecked.each(function(idx, elm) {
					$timeZoneChecked.prop('checked', false);
				});
				
				$dayName.eq(0).prop('checked', true);
				$timeZone.eq(0).prop('checked', true);
				
					
			}else{//요일,시간별검색(유동인구현황)일경우
				$('#searchDayTime').css("display", "block")
				$('[data-search-date]').css("display", "inline-block")
				$('[data-search-time-duartion]').css("display", "inline-block")
			}
			
		})
		
		$checkpopulationType.click(function() {			
			var $this = $(this),
				$wrapper = $this.closest('[data-search-wrapper=populationType]'),
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

		$checksexType.click(function() {
			var $this = $(this),
				$wrapper = $this.closest('[data-search-wrapper=sexType]'),
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
		
		$checkageType.click(function() {
			var $this = $(this),
				$wrapper = $this.closest('[data-search-wrapper=ageType]'),
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
		
		$checkdayNameType.click(function() {
			var $this = $(this),
				$wrapper = $this.closest('[data-search-wrapper=dayNameType]'),
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
		
		$checktimeZoneType.click(function() {
			var $this = $(this),
				$wrapper = $this.closest('[data-search-wrapper=timeZoneType]'),
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
					past = now.clone().subtract(12, 'year').add(1, 'day');
					break;
				case 'half':
					now = moment();
					
					if (6 > now.get('month')) {
						now.set('month', 5).endOf('month');
					} else {
						now = now.endOf('year');
					}
					nowCalc = now.clone().subtract(2, 'quarter');

					past = now.clone().subtract(24, 'quarter').add(1, 'day');
					
					break;
				case 'quarter':
					now = moment().endOf('quarter');
					nowCalc = now.clone().subtract(1, 'quarter');
					past = now.clone().subtract(12, 'quarter').add(1, 'day');
					break;
				case 'month':
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
			});;
			
			$searchDateRange.find('[data-btn-time]').click(function() {
				$(this).prev('input').datepicker('show');
			});
			// 상세검색 체크박스를 모두 options 파라메터로 넣을 필요는 없어보임
			// 공통이 아니라 화면마다 달라서 각자의 js 에서 지정
			
			$radioTimeBound = $searchWrapper.find('[type=radio][name=timeBound]');
			//$endYMD = $searchDateRange.find('[name=endYMD]');
			$checkpopulationType = $searchWrapper.find('[type=checkbox][name=populationType]');
			$checksexType 		 = $searchWrapper.find('[type=checkbox][name=sexType]');
			$checkageType		 = $searchWrapper.find('[type=checkbox][name=ageType]');
			$checkdayNameType	 = $searchWrapper.find('[type=checkbox][name=dayNameType]');
			$checktimeZoneType	 = $searchWrapper.find('[type=checkbox][name=timeZoneType]');
			$checkSearchType  	 = $searchWrapper.find('[type=radio][name=searchType]');
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
			
			toggleSearchTime(true, 'quarter');

			setBtnListener();
        },


		getSearchDtl: function(param) {
//			if (! isActivated) {
//				return {
//					checkpopulationType: [],
//					checksexType: [],
//					checkageType: [],
//					checkdayNameType: [],
//					checktimeZoneType: []
//				};
//			}
			
			var searchDtl = {
					radioTimeBound: $searchWrapper.find('[type=radio][name=timeBound]:checked').val(),
					checkpopulationType: [],
					checksexType: [],
					checkageType: [],
					checkdayNameType: [],
					checktimeZoneType: []
				},
				$checkpopulation = $searchWrapper.find('[type=checkbox][name=populationType]:checked'),
				$checksex = $searchWrapper.find('[type=checkbox][name=sexType]:checked'),
				$checkage = $searchWrapper.find('[type=checkbox][name=ageType]:checked'),
				$checkdayName = $searchWrapper.find('[type=checkbox][name=dayNameType]:checked'),
				$checktimeZone = $searchWrapper.find('[type=checkbox][name=timeZoneType]:checked');
				
			if ('' !== $checkpopulation.val()) {
				$checkpopulation.each(function(idx, elm) {
					searchDtl.checkpopulationType.push($(elm)[0].labels[0].innerText.trim());
				});
			}
			
			if ('' !== $checksex.val()) {
				$checksex.each(function(idx, elm) {
					searchDtl.checksexType.push($(elm)[0].labels[0].innerText.trim());
				});
			}
			
			if ('' !== $checkage.val()) {
				$checkage.each(function(idx, elm) {
					searchDtl.checkageType.push($(elm)[0].labels[0].innerText.trim());
				});
			}
			
			if ('' !== $checkdayName.val()) {
				$checkdayName.each(function(idx, elm) {
					searchDtl.checkdayNameType.push($(elm)[0].labels[0].innerText.trim());
				});
			}
			
			if ('' !== $checktimeZone.val()) {
				$checktimeZone.each(function(idx, elm) {
					searchDtl.checktimeZoneType.push($(elm)[0].labels[0].innerText.trim());
				});
			}
						
			var $population = $searchResult.find('[data-search-population]').html(''),
				$gender = $searchResult.find('[data-search-sex]').html(''),
				$age = $searchResult.find('[data-search-age]').html(''),
				$date = $searchResult.find('[data-search-dayname]').html(''),
				$timeZone = $searchResult.find('[data-search-timezone]').html('');
					
			//인구유형
			if (! searchDtl.checkpopulationType.length) {
				$population.append('<label>인구유형 : </label><span>전체</span>');
			} else {				
				var populationtypetext = "";
				$population.append('<label>인구유형 : </label>')
				for (var i in searchDtl.checkpopulationType) {
					if(i==searchDtl.checkpopulationType.length-1){
						populationtypetext += searchDtl.checkpopulationType[i];
					} else {
						populationtypetext += searchDtl.checkpopulationType[i] + ",";
					}	
				}
				$population.append('<strong>' + populationtypetext + '</strong>');
			}
			          
			//성별
			if (! searchDtl.checksexType.length) {
				$gender.append('<label>성별 : </label><span>전체</span>');
			} else {				
				var gendertypetext = "";
				$gender.append('<label>성별 : </label>')
				for (var i in searchDtl.checksexType) {
					if(i==searchDtl.checksexType.length-1){
						gendertypetext += searchDtl.checksexType[i];
					} else {
						gendertypetext += searchDtl.checksexType[i] + ",";
					}	
				}
				$gender.append('<strong>' + gendertypetext + '</strong>');
			}
			
			//연령대
			if (! searchDtl.checkageType.length) {
				$age.append('<label>연령대 : </label><span>전체</span>');
			} else {				
				var agetypetext = "";
				$age.append('<label>연령대 : </label>')
				for (var i in searchDtl.checkageType) {
					if(i==searchDtl.checkageType.length-1){
						agetypetext += searchDtl.checkageType[i];
					} else {
						agetypetext += searchDtl.checkageType[i] + ",";
					}	
				}
				$age.append('<strong>' + agetypetext + '</strong>');
			}
			
			//요일
			if (! searchDtl.checkdayNameType.length) {
				$date.append('<label>요일 : </label><span>전체</span>');
			} else {				
				var datetypetext = "";
				$date.append('<label>요일 : </label>')
				for (var i in searchDtl.checkdayNameType) {
					if(i==searchDtl.checkdayNameType.length-1){
						datetypetext += searchDtl.checkdayNameType[i];
					} else {
						datetypetext += searchDtl.checkdayNameType[i] + ",";
					}	
				}
				$date.append('<strong>' + datetypetext + '</strong>');
			}
			
			//시간대
			if (! searchDtl.checktimeZoneType.length) {
				$timeZone.append('<label>요일 : </label><span>전체</span>');
			} else {				
				var timezonetypetext = "";
				$timeZone.append('<label>요일 : </label>')
				for (var i in searchDtl.checktimeZoneType) {
					if(i==searchDtl.checktimeZoneType.length-1){
						timezonetypetext += searchDtl.checktimeZoneType[i];
					} else {
						timezonetypetext += searchDtl.checktimeZoneType[i] + ",";
					}	
				}
				$timeZone.append('<strong>' + timezonetypetext + '</strong>');
			}
			

			var searchTimeText = '',
			now,
			nowCalc,
			pastCalc,
			past = moment($startDurationYMD.val(), 'YYYY-MM-DD');

			switch (searchDtl.radioTimeBound) {
				case 'custom':
					now = moment($endYMD.val(), 'YYYY-MM-DD');
					past = moment($startYMD.val(), 'YYYY-MM-DD');
					pastCalc = past.clone();
					
					searchTimeText = '사용자 설정 / ' + past.format('YYYY-MM-DD') + ' ~ ' + now.format('YYYY-MM-DD');
					break;
				case 'year':
					searchTimeText = '년';
	
					now = moment().endOf('year');
					past = past.startOf('year');
					pastCalc = now.clone().subtract(11, 'year'). startOf('year');
					
					pastCalc = moment.max(past, pastCalc);
					break;
				case 'half':
					searchTimeText = '반기';
					
					now = moment();
					if (6 > now.get('month')) {
						now.set('month', 5).endOf('month');
					} else {
						now = now.endOf('year');
					}
					
					pastCalc = now.clone().subtract(24, 'quarter');
	
					pastCalc = moment.max(past, pastCalc);
					break;
				case 'quarter':
					searchTimeText = '분기';
	
					now = moment().endOf('quarter');
					pastCalc = now.clone().subtract(11, 'quarter').startOf('quarter');
					
					pastCalc = moment.max(past, pastCalc);
					break;
				case 'month':
					searchTimeText = '월';
					now = moment().endOf('month');
					pastCalc = now.clone().subtract(12, 'month').startOf('month');
					
					pastCalc = moment.max(past, pastCalc);
					break;
			}

			searchDtl.startYMD = pastCalc.format('YYYYMMDD');
			searchDtl.endYMD = now.format('YYYYMMDD');
			searchDtl.pastYMD = past.format('YYYYMMDD');			

			$searchResult.find('[data-search-time]').text(searchTimeText);
			
			// 시작시점 표시
			$searchResult.find('[data-search-start-time]').text(moment(searchDtl.startYMD, 'YYYYMMDD').format('YYYY.MM'));
			
			// 검색옵션 수정 시 높이 수정
		    $('.card-body').css('height', $(window).height() - $('.card-body').offset().top - 20);
				
			return searchDtl;
		}

    };
}();
