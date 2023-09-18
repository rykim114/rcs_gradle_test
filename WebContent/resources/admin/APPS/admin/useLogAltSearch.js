'use strict';
// Class definition

var apiSearchUseLog = function() {
    // Private functions
	var $searchWrapper,
		$searchDateRange,
		$startYMD,
		$endYMD,
		$btnOk,
		fnListener;

	var setBtnListener = function() {

		$btnOk.click(function() {
			if (fnListener) {
				fnListener(getSearchDtlPriv());
			}
		});

	};
	
	var getSearchDtlPriv = function(param) {
		var searchDtl = {};
	
		var now = moment($endYMD.val(), 'YYYY-MM-DD'),
			past = moment($startYMD.val(), 'YYYY-MM-DD');
	
		searchDtl.startYMD = past.format('YYYY-MM-DD');
		searchDtl.endYMD = now.format('YYYY-MM-DD');
	
		return searchDtl;
	};
	
    return {
        // Public functions
        init: function(options) {
			$searchWrapper = options.searchWrapper;
			$searchDateRange = options.searchDateRange;
			$btnOk = options.btnOk;
			fnListener = options.fnListener;
			
			var now = moment().endOf('day').subtract(1, 'days'),
				past = now.clone().subtract(1, 'months');

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
				endDate: now.format('YYYY-MM-DD')
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

			setBtnListener();
        },


		getSearchDtl: function(param) {
			return getSearchDtlPriv(param);
		}

    };
}();
