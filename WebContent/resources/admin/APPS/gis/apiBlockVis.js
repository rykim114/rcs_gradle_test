

var apiBlockVis = (function() {

	var sanggaTypeArr,
		sanggaTypeMap,
		industryTypeArr,
		industryTypeMap,
		industryTypeSKArr,
		$wrapVis = $('#wrapMapBlockVis'),
		$wrapVisSearch = $('#wrapMapBlockVisSearch'),
		blockColor = '#CCCCCC',
		blockOpacity = 0.5;
		//blockColor = '#FF5354';

	var compVis = {
		
		init: function() {
			var self = this;
			self.$legend = $('#wrapMapBlockVis [data-wrap-vis-legend]');
			self.setBtnListener();

			blockMap.fnGetCommCode().done(function(resp) {
				sanggaTypeArr = resp.sanggaTypeArr;
				sanggaTypeMap = resp.sanggaTypeMap;
				industryTypeArr = resp.industryTypeArr_new;
				industryTypeMap = resp.industryTypeMap_new;
				industryTypeSKArr = resp.industryTypeSKArr;
				
				self.setSearchModal();
			});
				
			self.$legend.find('.datanon-color').css({'background':blockColor, opaciry:blockOpacity});
		},
					
		// input, form 변경 시 수정사항 정리영역
		// 검색 조건 바뀔 때 + 업데이트 전 파라메터 정리 필요하면 여기에서 실행
		setBtnListener: function() {
			var self = this;

			// v1
			$('.block-layer [data-btn-gis-stat]').click(function() {
				$('.block-layer [data-btn-gis-stat]').removeClass('on');
				$(this).addClass('on');
				//self.fnSelectGisStat($(this)); 
				/* 시각화 데이터 필터 설정 클릭시로 변경 */
			});
			
			// v2
			var $btnStat = $wrapVis.find('[data-btn-gis-stat]'),
				$btnRunVis = $wrapVis.find('[data-btn-run-vis]'),
				$btnFilter = $wrapVis.find('[data-btn-filter-stat]');
			
			$btnStat.click(function() {
				var $this = $(this),
					stat = $this.attr('data-btn-gis-stat');
								
				$btnStat.removeClass('on');
				$this.addClass('on');
				
				switch (stat) {
					case 'supply':
					case 'industry':
					case 'popDwl':
					case 'popWkPlc':
					case 'popFlow':
					case 'lobz':
					case 'rent':
					case 'p':
					case 'under':
						$btnFilter.attr('data-btn-gis-statsel', stat);
						break;
				}
			});
			
			$btnFilter.click(function(){
				var $this = $(this),
				stat = $this.attr('data-btn-gis-statsel');
				
				switch (stat) {
					case 'supply':
					case 'industry':
					case 'popDwl':
					case 'popWkPlc':
					case 'popFlow':
					case 'lobz':
					case 'rent':
					case 'p':
					case 'under':
						$('#modalVis' + stat.charAt(0).toUpperCase() + stat.substring(1)).modal('show');
						break;
				}
				
			});
			
			$('#mapSearchLayer .years-item').find('span').click(function(){
			    $(this).parents('ul').find('.radio').removeClass('on');
			    $(this).addClass('on');
			});
			
			$('#mapSearchLayer .data-items-header').click(function(){
			    $(this).find('i').toggleClass('fa-chevron-up fa-chevron-down');
			    $('.data-items-body').slideToggle(200);
			});
						
			$('[id^=modalVis]').on('show.bs.modal', function() {
				// 오픈 시 원래 검색조건 백업 
				var $prevChecked = $(this).find('[type=checkbox]:checked');

				$prevChecked.attr('data-prev-checked', 'true');
				
			}).on('hidden.bs.modal', function() {
				// 취소 시 검색조건 원복
				var $prevChecked = $(this).find('[type=checkbox][data-prev-checked=true]'),
					$prevNotChecked = $(this).find('[type=checkbox][data-prev-checked!=true]');

				$prevChecked.prop('checked', true);
				$prevNotChecked.prop('checked', false);
				
				$prevChecked.removeAttr('data-prev-checked');
			}).on('click', '[data-btn-confirm]', function() {
				var $modal = $(this).closest('.modal'),
					$prevChecked = $modal.find('[type=checkbox][data-prev-checked=true]'),
					$checked = $modal.find('[type=checkbox]:checked');
					
				if (! $checked.length) {
					toastr.error('1개 이상의 값은 반드시 선택되어야 합니다', '오류', {timeOut: 3000});
					return;
				}

				$prevChecked.removeAttr('data-prev-checked');
				$checked.attr('data-prev-checked', 'true');
				
				$modal.modal('hide');
			});
			
			$btnRunVis.click(function() {
				if (! $btnRunVis.hasClass('btn-danger')) {
					z.msgAlert({
						html: '블럭을 2개 이상 선택 해주세요',
						icon: 'error'
					});
					return;
				}
				var stat = $wrapVis.find('[data-btn-gis-stat].on').attr('data-btn-gis-stat'),
					blockIdArr = blockMap.fnGetBlockIdArr(),
					blockCdArr = blockMap.fnGetBlockCdArr(),
					bounds = blockMap.fnGetBlockIdArrBounds(),
					blockCdSet = new Set();
					
				for (var i in blockCdArr) {
					blockCdSet.add(blockCdArr[i].substring(0, 13));
				}
				
				var blockCdUniqArr = Array.from(blockCdSet);

				switch (stat) {
					case 'supply':
						statSupply.init(blockIdArr, blockCdUniqArr, bounds, $btnRunVis);
						break;
					case 'industry':
						statIndustry.init(blockIdArr, blockCdUniqArr, bounds, $btnRunVis);
						break;
					case 'popDwl':
						statPopDwl.init(blockIdArr, blockCdUniqArr, bounds, $btnRunVis);
						break;
					case 'popWkPlc':
						statPopWkPlc.init(blockIdArr, blockCdUniqArr, bounds, $btnRunVis);
						break;
					case 'popFlow':
						statPopFlow.init(blockIdArr, blockCdUniqArr, bounds, $btnRunVis);
						break;
					case 'lobz':
						statLobz.init(blockIdArr, blockCdUniqArr, bounds, $btnRunVis);
						break;
					case 'rent':
						statRent.init(blockIdArr, blockCdUniqArr, bounds, $btnRunVis);
						break;
					case 'p':
						statP.init(blockIdArr, blockCdUniqArr, bounds, $btnRunVis);
						break;
					case 'under':
						statUnder.init(blockIdArr, blockCdUniqArr, bounds, $btnRunVis);
						break;
				}
			});
		},

		fnSelectGisStat: function($btn) {
			var self = this,
				blockIdArr = blockMap.fnGetBlockIdArr();
	
			if (! blockIdArr || 2 > blockIdArr.length) {
				z.msgAlert({
					html: '블럭을 2개 이상 선택 해주세요',
					icon: 'error'
				});
				
				$btn.removeClass('on');
				return;
			}
			
			$('.block-layer .density').hide();
	
			var toolID = $btn.children('a').attr('class');
			$('#' + toolID).css('display','flex');
	
			var blockCdArr = blockMap.fnGetBlockCdArr(),
				bounds = blockMap.fnGetBlockIdArrBounds(),
				stat = $btn.attr('data-btn-gis-stat'),
				blockCdSet = new Set();
			
			//FIXME : 추후에 년도기준으로 집계구 선택되는경우 자르지않고 처리해야함
			for (var i in blockCdArr) {
				blockCdSet.add(blockCdArr[i].substring(0, 13));
			}

			switch (stat) {
				case 'p':
					statP.init(blockIdArr, Array.from(blockCdSet), bounds, $btn);
					break;
				case 'rent':
					statRent.init(blockIdArr, Array.from(blockCdSet), bounds, $btn);
					break;
				case 'under':
					statUnder.init(blockIdArr, Array.from(blockCdSet), bounds, $btn);
					break;
				case 'pop':
					statPop.init(blockIdArr, Array.from(blockCdSet), bounds, $btn);
					break;
				case 'lobz':
					statLobz.init(blockIdArr, Array.from(blockCdSet), bounds, $btn);
					break;
				case 'industry':
					statIndustry.init(blockIdArr, Array.from(blockCdSet), bounds, $btn);
					break;
			}
		},
		
		
		// 시각화 케이스마다 필요한 모달이 달라서 각각 하드코딩 분류
		setSearchModal: function() {
			var self = this,
				$modalSupply = $('#modalVisSupply,#modalVisRent,#modalVisUnder,#modalVisP'),
				$modalIndustry = $('#modalVisIndustry'),
				$modalLobz = $('#modalVisLobz');

			var $wrapSupply = $modalSupply.find('.check-wrap').html('');
			
			for (var i in sanggaTypeArr) {
				var sangga = sanggaTypeArr[i],
					$check = $('<input/>', {type: 'checkbox', name: 'sanggaType', value: sangga});
					
				$wrapSupply.append($('<label/>', {text: sangga}).prepend($check));
			}

			var $wrapIndustry = $modalIndustry.find('.check-wrap').html('');
			
			for (var i in industryTypeArr) {
				var sangga = industryTypeArr[i],
					$check = $('<input/>', {type: 'checkbox', name: 'sanggaType', value: sangga});
					
				$wrapIndustry.append($('<label/>', {text: sangga}).prepend($check));
			}


			var $wrapLobz = $modalLobz.find('.check-wrap').html('');
			
			for (var i in industryTypeSKArr) {
				var sangga = industryTypeSKArr[i],
					idxWrap = Math.floor(i / 5),
					$check = $('<input/>', {type: 'checkbox', name: 'sanggaType', value: (parseInt(i) + 1) % 10});
					
				$wrapLobz.eq(idxWrap).append($('<label/>', {text: sangga}).prepend($check));
			}
			
			// 체크 수정 이벤트 리스너
			var btnArr = ['sanggaType', 'genderType', 'ageType'];
			
			$('[id^=modalVis]').each(function(idx, elm) {
				var $elm = $(elm);
				
				for (var j in btnArr) {
					var $all = $elm.find('[name=' + btnArr[j] + '][value=""]'),
						$check = $elm.find('[name=' + btnArr[j] + '][value!=""]');
						
					(function($all, $check) {
						$all.click(function() {
							var $this = $(this);
							
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
						});
						
						$check.click(function() {
							var $this = $(this);
							
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
						});
					})($all, $check);
				}
			});
			
			// 유동인구 시간선택 별도
			var $wrapPopFlow = $('#modalVisPopFlow');
			
			btnArr = ['weekdayTimeType', 'weekendTimeType'];
			
			for (var j in btnArr) {
				var $all = $wrapPopFlow.find('[name=' + btnArr[j] + '][value=""]'),
					$check = $wrapPopFlow.find('[name=' + btnArr[j] + '][value!=""]');

				(function($all, $check) {
					$all.click(function() {
						var $this = $(this);
						
						if ($this.prop('checked')) {
							// 나머지 해제
							$check.prop('checked', false);
						} else {
							// 모두 해제
						}
					});
					
					$check.click(function() {
						var $this = $(this);
						
						if ($this.prop('checked')) {
							$all.prop('checked', false);
						} else {
							// 모두 해제
						}
					});
				})($all, $check);
			}

		},
	};

	var statSupply = {
		
		init: function(blockIdArr, blockCdArr, bounds, $btn) {
			var self = this;
			
			self.blockIdArr = blockIdArr;
			self.blockCdArr = blockCdArr;
			self.bounds = bounds;

			self.$modal = $('#modalVisSupply');
			self.$legend = $('#wrapMapBlockVis [data-wrap-vis-legend]');
			
			if (! $btn.hasClass('spinner')) {
			    KTUtil.btnWait($btn[0], "spinner spinner-left spinner-dark");
			}
			
			self.loadData().always(function() {
				if ($btn.hasClass('spinner')) {
					KTUtil.btnRelease($btn[0]);
				}
			}).done(function(resp) {
				var statArr = [];
				
				for (var i in resp) {
					var row = resp[i];

					statArr.push({
						blockId: row.blockid,
						stat: 0 !== parseFloat(row['총점포수']) ? parseFloat(row['총점포수']) : 0
					});
				}

				self.updateData(statArr);
			});
		},
		
		loadData: function() {
			var self = this,
				param = {
					blockIdArr: self.blockIdArr,
					south: self.bounds.getSouth(),
					west: self.bounds.getWest(),
					north: self.bounds.getNorth(),
					east: self.bounds.getEast(),
					sanggaArr: [],
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
					demoLdongcd: _DemoLdongcd
				},
				checkedStr = '전체';
				result = $.Deferred();

			var $check = self.$modal.find('[name=sanggaType]:checked');
			
			if ('' !== $check.val()) {
				checkedStr = '';
				$check.each(function(idx, elm) {
					param.sanggaArr.push($(elm).val());
					checkedStr += ', ' + $(elm).parent().text();
				});
				
				checkedStr = checkedStr.substring(2);
			}
			
			
			z.getDataReference().done(function(map) {
				var latestYm = map['상가']['최종시간'],
					timeStr = moment(latestYm, 'YYYYMM').format('YYYY.MM'),
					titleStr = '상가유형.';
				
				param.yyyymmArr = [latestYm];

				fnSetVisSearch(timeStr, titleStr, checkedStr);

				z.xAsync('Gis', 'statSupplyList', 'select', param, 'json').done(function(resp) {
					result.resolve(resp);
				});
			});

			return result;
		},
		
		updateData: function(statArr) {
			var self = this,
				blockIdArr = self.blockIdArr,
				colorStat = [
					'#C6DBEF',
					'#9ECAE1',
					'#6BAED6',
					'#3182BD',
					'#08519C'
				],
				opacityMap = {
					'0': 0.2,
					'1': 0.35,
					'2': 0.5,
					'3': 0.65,
					'4': 0.8
				};

			statArr = statArr.sort(function(a, b) {
				if (a.stat < b.stat) {
					return -1;
				}
				
				if (a.stat > b.stat) {
					return 1;
				}
				
				return 0;
			});
			
			if (! statArr.length) {
				statArr = [{stat: 0}];
			}

			for (var i in map.userSelectedClickArr) {
				var block = map.userSelectedClickArr[i];
				
				block.visTitle = '총점포수';
				block.visContent = '데이터 없음';
				block.setStyle({
					fillColor: blockColor,
					fillOpacity: 0.5
				});
			}
	
			var maxValue = statArr[statArr.length - 1].stat,
				minValue = statArr[0].stat,
				diff = (maxValue - minValue) / 5,
				gradeArr = [
					minValue,
					minValue + diff,
					minValue + 2 * diff,
					minValue + 3 * diff,
					minValue + 4 * diff,
					maxValue + 0.0001
				];
	
			for (var i in statArr) {
				var stat = statArr[i],
					color = stat.stat,
					blockId = stat.blockId;
	
				// 1. 색상 정하고
				for (var j = 0, jLength = gradeArr.length - 1; jLength > j; ++j) {
					if (gradeArr[j] <= color && gradeArr[j + 1] >= color) {
						color = j;
						break;
					}
				}
				
				// 2. 블럭 찾아서 수정
				var isFound = false;
				for (var i in map.userSelectedClickArr) {
					if (blockId === map.userSelectedClickArr[i].blockId) {
						var block = map.userSelectedClickArr[i];
						
						isFound = true;
						
						block.visTitle = '총점포수';
						block.visContent = z.toComma(stat.stat) + ' 개소';
						
						block.setStyle({
							fillColor: colorStat[color],
							fillOpacity: 0.7
						});
						
						break;
					}
				}
				
			}

			
			// 범례 표시
			z.formatDataReference('상가').done(function(refText) {
				var $legend = self.$legend;
				
				$legend.find('[data-legend-title]').text('공급 총점포수');
				
				$legend.find('[data-reference]').text(refText);
				
				$legend.find('[data-grade]').each(function(idx, elm) {
					$(elm).text(z.toComma(gradeArr[idx]) + ' ~ ' + z.toComma(gradeArr[idx + 1]) + ' 개소');
				});				
				
				$legend.find('.thumb-color').each(function(idx, elm) {
					$(elm).css('background', colorStat[idx]);
				});

				$legend.show();
			});
		},
	};	


	var statIndustry = {
		
		init: function(blockIdArr, blockCdArr, bounds, $btn) {
			var self = this;
			
			self.blockIdArr = blockIdArr;
			self.blockCdArr = blockCdArr;
			self.bounds = bounds;

			self.$modal = $('#modalVisIndustry');
			self.$legend = $('#wrapMapBlockVis [data-wrap-vis-legend]');
			
			if (! $btn.hasClass('spinner')) {
			    KTUtil.btnWait($btn[0], "spinner spinner-left spinner-dark");
			}
			
			self.loadData().always(function() {
				if ($btn.hasClass('spinner')) {
					KTUtil.btnRelease($btn[0]);
				}
			}).done(function(resp) {
				self.updateData(resp);
			});
		},
		
		loadData: function() {
			var self = this,
				param = {
					blockIdArr: self.blockIdArr,
					south: self.bounds.getSouth(),
					west: self.bounds.getWest(),
					north: self.bounds.getNorth(),
					east: self.bounds.getEast(),
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
					demoLdongcd: _DemoLdongcd
				},
				sanggaArr = [],
				checkedStr = '전체';
				result = $.Deferred();

			var $check = self.$modal.find('[name=sanggaType]:checked');
			
			if ('' !== $check.val()) {
				checkedStr = '';
				$check.each(function(idx, elm) {
					sanggaArr.push($(elm).val());
					checkedStr += ', ' + $(elm).parent().text();
				});
				
				checkedStr = checkedStr.substring(2);
			} else {
				$check = self.$modal.find('[name=sanggaType][value!=""]');

				$check.each(function(idx, elm) {
					sanggaArr.push($(elm).val());
				});
			}

			z.getDataReference().done(function(map) {
				var latestYm = map['업종_블럭']['최종시간'],
					timeStr = moment(latestYm, 'YYYYMM').format('YYYY.MM'),
					titleStr = '업종유형.';
				
				param.yyyymmArr = [latestYm];

				fnSetVisSearch(timeStr, titleStr, checkedStr);

				z.xAsync('Gis', 'statIndustryList', 'select', param, 'json').done(function(resp) {
					// FIXME: 시간별 정리
					
					var statArr = [];

					for (var i in resp) {
						var row = resp[i],
							stat = 0;
							
						for (var j in sanggaArr) {
							stat += parseFloat(row[sanggaArr[j]]);
						}
	
						statArr.push({
							blockId: row.blockid,
							stat: stat
						});
					}

					result.resolve(statArr);
				});
			});
			
			return result;			
		},
		
		updateData: function(statArr) {
			var self = this,
				blockIdArr = self.blockIdArr,
				colorStat = [
					'#C6DBEF',
					'#9ECAE1',
					'#6BAED6',
					'#3182BD',
					'#08519C'
				],
				opacityMap = {
					'0': 0.2,
					'1': 0.35,
					'2': 0.5,
					'3': 0.65,
					'4': 0.8
				};

			statArr = statArr.sort(function(a, b) {
				if (a.stat < b.stat) {
					return -1;
				}
				
				if (a.stat > b.stat) {
					return 1;
				}
				
				return 0;
			});
			
			if (! statArr.length) {
				statArr = [{stat: 0}];
			}


			for (var i in map.userSelectedClickArr) {
				var block = map.userSelectedClickArr[i];
				
				block.visTitle = '밀집도';
				block.visContent = '데이터 없음';
				block.setStyle({
					fillColor: blockColor,
					fillOpacity: 0.5
				});
			}

			var maxValue = statArr[statArr.length - 1].stat,
				minValue = statArr[0].stat,
				diff = (maxValue - minValue) / 5,
				gradeArr = [
					minValue,
					minValue + diff,
					minValue + 2 * diff,
					minValue + 3 * diff,
					minValue + 4 * diff,
					maxValue + 0.0001
				];
	
			for (var i in statArr) {
				var stat = statArr[i],
					color = stat.stat,
					blockId = stat.blockId;
	
				// 1. 색상 정하고
				for (var j = 0, jLength = gradeArr.length - 1; jLength > j; ++j) {
					if (gradeArr[j] <= color && gradeArr[j + 1] >= color) {
						color = j;
						break;
					}
				}
				
				// 2. 블럭 찾아서 수정
				var isFound = false;
				for (var i in map.userSelectedClickArr) {
					if (blockId === map.userSelectedClickArr[i].blockId) {
						var block = map.userSelectedClickArr[i];
						
						isFound = true;
						
						block.visTitle = '밀집도';
						block.visContent = z.toComma(stat.stat) + ' 개소';
						
						block.setStyle({
							fillColor: colorStat[color],
							fillOpacity: 0.7
						});
						
						break;
					}
				}
				
//				if (! isFound) {
//					for (var i in map.userSelectedAreaArr) {
//						var arr = map.userSelectedAreaArr[i].squareArr;
//			
//						for (var j in arr) {
//							if (blockId === arr[j].blockId) {
//								isFound = true;
//								
//								arr[j].setStyle({
//									fillColor: colorStat[color],
//									fillOpacity: 0.7
//								});
//								
//								break;
//							}
//						}
//						
//						if (isFound) {
//							break;
//						}
//					}
//				}
			}

			
			// 범례 표시
			z.formatDataReference('업종_블럭').done(function(refText) {
				var $legend = self.$legend;
				
				$legend.find('[data-legend-title]').text('밀집도');
				
				$legend.find('[data-reference]').text(refText);
				
				$legend.find('[data-grade]').each(function(idx, elm) {
					$(elm).text(z.toComma(gradeArr[idx]) + ' ~ ' + z.toComma(gradeArr[idx + 1]) + ' 개소');
				});
				
				$legend.find('.thumb-color').each(function(idx, elm) {
					$(elm).css('background', colorStat[idx]);
				});

				$legend.show();
			});
		},
	};
	
	//거주인구
	var statPopDwl = {
		
		init: function(blockIdArr, blockCdArr, bounds, $btn) {
			var self = this;
			
			self.blockIdArr = blockIdArr;
			self.blockCdArr = blockCdArr;
			self.bounds = bounds;

			self.$modal = $('#modalVisPopDwl');
			self.$legend = $('#wrapMapBlockVis [data-wrap-vis-legend]');
			
			
			if (! $btn.hasClass('spinner')) {
			    KTUtil.btnWait($btn[0], "spinner spinner-left spinner-dark");
			}
			
			self.loadData().always(function() {
				if ($btn.hasClass('spinner')) {
					KTUtil.btnRelease($btn[0]);
				}
			}).done(function(resp) {
				self.updateData(resp);
			});
		},
		
		loadData: function() {
			var self = this,
				param = {
					blockCdArr: self.blockCdArr,
					south: self.bounds.getSouth(),
					west: self.bounds.getWest(),
					north: self.bounds.getNorth(),
					east: self.bounds.getEast(),
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
					demoLdongcd: _DemoLdongcd,
					yyyymmArr: ['202104']
				},
				genderArr = [],
				ageArr = [],
				checkedStr = '성별 전체',
				ageStr = ', 연령 전체',
				result = $.Deferred();
			
			var $check = self.$modal.find('[name=genderType]:checked');
			
			if ('' !== $check.val()) {
				checkedStr = '';
				$check.each(function(idx, elm) {
					genderArr.push($(elm).val());
					checkedStr += ', ' + $(elm).parent().text();
				});
				
				checkedStr = checkedStr.substring(2);
			} else {
				$check = self.$modal.find('[name=genderType][value!=""]');

				$check.each(function(idx, elm) {
					genderArr.push($(elm).val());
				});
			}

			$check = self.$modal.find('[name=ageType]:checked');
			
			if ('' !== $check.val()) {
				ageStr = '';
				$check.each(function(idx, elm) {
					ageArr.push($(elm).val());
					ageStr += ', ' + $(elm).parent().text();
				});
			} else {
				$check = self.$modal.find('[name=ageType][value!=""]');

				$check.each(function(idx, elm) {
					ageArr.push($(elm).val());
				});
			}

			z.getDataReference().done(function(map) {
				var latestYm = map['인구']['최종시간'],
					timeStr = moment(latestYm, 'YYYYMM').format('YYYY.MM'),
					titleStr = '인구유형.';
				
				param.yyyymmArr = [latestYm];

				fnSetVisSearch(timeStr, titleStr, checkedStr + ageStr);

				z.xAsync('Gis', 'statPopList', 'select', param, 'json').done(function(resp) {
					var statArr = [];
					
					for (var i in resp) {
						var row = resp[i],
							rowCopy = {
								blockCd: row.blockcd,
								stat: 0
							};
							
						for (var j in genderArr) {
							var gender = genderArr[j];
							
							for (var k in ageArr) {
								rowCopy.stat += parseFloat(row['거주_' + gender + '_' + ageArr[k]]);
							}
						}	
						statArr.push(rowCopy);
					}
					result.resolve(statArr);
				});
			});
			
			return result;
		},
		
		updateData: function(statArr) {
			var self = this,
				blockIdArr = self.blockIdArr,
				colorStat = [
					'#FCC5C0',
					'#FA9FB5',
					'#F768A1',
					'#C51B8A',
					'#7A0177'
				],
				opacityMap = {
					'0': 0.2,
					'1': 0.35,
					'2': 0.5,
					'3': 0.65,
					'4': 0.8
				};
			
			// 집계구 기준이면 100격자로 매핑
			if (statArr[0] && statArr[0].blockCd) {
				var statCopyArr = statArr;
				
				statArr = Array.apply(null, Array(blockIdArr.length)).map(function(v, idx) {
					return {
						blockid: blockIdArr[idx],
						stat: 0,
						cnt: 0
					};
				});
				
				for (var j in statCopyArr) {
					var statCopy = statCopyArr[j];
					for (var i in map.userSelectedClickArr) {
						var m100 = map.userSelectedClickArr[i];
						if (m100.outputAreaSet && m100.outputAreaSet.has(statCopy.blockCd)) {
							var row = statArr[blockIdArr.indexOf(m100.blockId)];

							row.stat += statCopy.stat;
							row.cnt++;
						}
					}
				}

				// 경계선의 값을 합계가 아닌 평균 값으로 변경 
				for(var k in statArr) {
					var row = statArr[k];
					if(row.cnt > 1) {
						row.stat = (row.stat / row.cnt);
					}
				}
			}
			
			statArr = statArr.sort(function(a, b) {
				if (a.stat < b.stat) {
					return -1;
				}
				
				if (a.stat > b.stat) {
					return 1;
				}
				
				return 0;
			});
			
			if (! statArr.length) {
				statArr = [{stat: 0}];
			}

			for (var i in map.userSelectedClickArr) {
				var block = map.userSelectedClickArr[i];
				
				block.visTitle = '인구수';
				block.visContent = '데이터 없음';
				block.setStyle({
					fillColor: blockColor,
					fillOpacity: 0.5
				});
			}			

			var maxValue = statArr[statArr.length - 1].stat,
				minValue = statArr[0].stat,
				diff = (maxValue - minValue) / 5,
				gradeArr = [
					minValue,
					minValue + diff,
					minValue + 2 * diff,
					minValue + 3 * diff,
					minValue + 4 * diff,
					maxValue + 0.0001
				];
			
			for (var i in statArr) {
				var stat = statArr[i],
					color = stat.stat,
					blockId = stat.blockid;
	
				// 1. 색상 정하고
				for (var j = 0, jLength = gradeArr.length - 1; jLength > j; ++j) {
					if (gradeArr[j] <= color && gradeArr[j + 1] >= color) {
						color = j;
						break;
					}
				}
				
				// 2. 블럭 찾아서 수정
				var isFound = false;
				for (var i in map.userSelectedClickArr) {
					if (blockId === map.userSelectedClickArr[i].blockId) {
						var block = map.userSelectedClickArr[i];
						
						isFound = true;
						
						block.visTitle = '인구수';
						block.visContent = z.toComma(stat.stat) + ' 명';
						
						block.setStyle({
							fillColor: colorStat[color],
							fillOpacity: 0.7
						});
						
						break;
					}
				}
			}
			
			// 범례 표시
			z.formatDataReference('인구').done(function(refText) {
				var $legend = self.$legend;
				
				$legend.find('[data-legend-title]').text('인구수');
				
				$legend.find('[data-reference]').text(refText);
				
				$legend.find('[data-grade]').each(function(idx, elm) {
					$(elm).text(z.toComma(gradeArr[idx]) + ' ~ ' + z.toComma(gradeArr[idx + 1]) + ' 명');
				});
				
				$legend.find('.thumb-color').each(function(idx, elm) {
					$(elm).css('background', colorStat[idx]);
				});

				$legend.show();
			});
		},
	};

	// 직장인구
	var statPopWkPlc = {
		
		init: function(blockIdArr, blockCdArr, bounds, $btn) {
			var self = this;
			
			self.blockIdArr = blockIdArr;
			self.blockCdArr = blockCdArr;
			self.bounds = bounds;

			self.$modal = $('#modalVisPopWkPlc');
			self.$legend = $('#wrapMapBlockVis [data-wrap-vis-legend]');
			
			
			if (! $btn.hasClass('spinner')) {
			    KTUtil.btnWait($btn[0], "spinner spinner-left spinner-dark");
			}
			
			self.loadData().always(function() {
				if ($btn.hasClass('spinner')) {
					KTUtil.btnRelease($btn[0]);
				}
			}).done(function(resp) {
				self.updateData(resp);
			});
		},
		
		loadData: function() {
			var self = this,
				param = {
					blockCdArr: self.blockCdArr,
					south: self.bounds.getSouth(),
					west: self.bounds.getWest(),
					north: self.bounds.getNorth(),
					east: self.bounds.getEast(),
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
					demoLdongcd: _DemoLdongcd,
					yyyymmArr: ['202104']
				},
				genderArr = [],
				ageArr = [],
				checkedStr = '성별 전체',
				ageStr = ', 연령 전체',
				result = $.Deferred();


			var $check = self.$modal.find('[name=genderType]:checked');
			
			if ('' !== $check.val()) {
				checkedStr = '';
				$check.each(function(idx, elm) {
					genderArr.push($(elm).val());
					checkedStr += ', ' + $(elm).parent().text();
				});
				
				checkedStr = checkedStr.substring(2);
			} else {
				$check = self.$modal.find('[name=genderType][value!=""]');

				$check.each(function(idx, elm) {
					genderArr.push($(elm).val());
				});
			}

			$check = self.$modal.find('[name=ageType]:checked');
			
			if ('' !== $check.val()) {
				ageStr = '';
				$check.each(function(idx, elm) {
					ageArr.push($(elm).val());
					ageStr += ', ' + $(elm).parent().text();
				});
			} else {
				$check = self.$modal.find('[name=ageType][value!=""]');

				$check.each(function(idx, elm) {
					ageArr.push($(elm).val());
				});
			}

			z.getDataReference().done(function(map) {
				var latestYm = map['인구']['최종시간'],
					timeStr = moment(latestYm, 'YYYYMM').format('YYYY.MM'),
					titleStr = '인구유형.';
				
				param.yyyymmArr = [latestYm];

				fnSetVisSearch(timeStr, titleStr, checkedStr + ageStr);

				z.xAsync('Gis', 'statPopList', 'select', param, 'json').done(function(resp) {
					
					var statArr = [];
					
					for (var i in resp) {
						var row = resp[i],
							rowCopy = {
								blockCd: row.blockcd,
								stat: 0
							};
							
						for (var j in genderArr) {
							var gender = genderArr[j];
							
							for (var k in ageArr) {
								rowCopy.stat += parseFloat(row['직장_' + gender + '_' + ageArr[k]]);
							}
						}
	
						statArr.push(rowCopy);
					}
					
					result.resolve(statArr);
				});
			});
			
			return result;
		},
		
		updateData: function(statArr) {
			var self = this,
				blockIdArr = self.blockIdArr,
				colorStat = [
					'#FCC5C0',
					'#FA9FB5',
					'#F768A1',
					'#C51B8A',
					'#7A0177'
				],
				opacityMap = {
					'0': 0.2,
					'1': 0.35,
					'2': 0.5,
					'3': 0.65,
					'4': 0.8
				};
			
			// 집계구 기준이면 100격자로 매핑
			if (statArr[0] && statArr[0].blockCd) {
				var statCopyArr = statArr;
				
				statArr = Array.apply(null, Array(blockIdArr.length)).map(function(v, idx) {
					return {
						blockid: blockIdArr[idx],
						stat: 0,
						cnt: 0
					};
				});
	
				for (var j in statCopyArr) {
					var statCopy = statCopyArr[j];
					
					for (var i in map.userSelectedClickArr) {
						var m100 = map.userSelectedClickArr[i];
						
						if (m100.outputAreaSet && m100.outputAreaSet.has(statCopy.blockCd)) {
							var row = statArr[blockIdArr.indexOf(m100.blockId)];
							
							row.stat += statCopy.stat;
							row.cnt++;
						}
					}
				}
				// 경계선의 값을 합계가 아닌 평균 값으로 변경 
				for(var k in statArr) {
					var row = statArr[k];
					if(row.cnt > 1) {
						row.stat = (row.stat / row.cnt);
					}
				}
			}
	
			statArr = statArr.sort(function(a, b) {
				if (a.stat < b.stat) {
					return -1;
				}
				
				if (a.stat > b.stat) {
					return 1;
				}
				
				return 0;
			});
			
			if (! statArr.length) {
				statArr = [{stat: 0}];
			}

			for (var i in map.userSelectedClickArr) {
				var block = map.userSelectedClickArr[i];
				
				block.visTitle = '인구수';
				block.visContent = '데이터 없음';
				block.setStyle({
					fillColor: blockColor,
					fillOpacity: 0.5
				});
			}
			
			var maxValue = statArr[statArr.length - 1].stat,
				minValue = statArr[0].stat,
				diff = (maxValue - minValue) / 5,
				gradeArr = [
					minValue,
					minValue + diff,
					minValue + 2 * diff,
					minValue + 3 * diff,
					minValue + 4 * diff,
					maxValue + 0.0001
				];
	
			for (var i in statArr) {
				var stat = statArr[i],
					color = stat.stat,
					blockId = stat.blockid;
	
				// 1. 색상 정하고
				for (var j = 0, jLength = gradeArr.length - 1; jLength > j; ++j) {
					if (gradeArr[j] <= color && gradeArr[j + 1] >= color) {
						color = j;
						break;
					}
				}
				
				// 2. 블럭 찾아서 수정
				var isFound = false;
				for (var i in map.userSelectedClickArr) {
					if (blockId === map.userSelectedClickArr[i].blockId) {
						var block = map.userSelectedClickArr[i];
						
						isFound = true;
						
						block.visTitle = '인구수';
						block.visContent = z.toComma(stat.stat) + ' 명';
						
						block.setStyle({
							fillColor: colorStat[color],
							fillOpacity: 0.7
						});
						
						break;
					}
				}
			}
			
			// 범례 표시
			z.formatDataReference('인구').done(function(refText) {
				var $legend = self.$legend;
				
				$legend.find('[data-legend-title]').text('인구수');
				
				$legend.find('[data-reference]').text(refText);
				
				$legend.find('[data-grade]').each(function(idx, elm) {
					$(elm).text(z.toComma(gradeArr[idx]) + ' ~ ' + z.toComma(gradeArr[idx + 1]) + ' 명');
				});
				
				$legend.find('.thumb-color').each(function(idx, elm) {
					$(elm).css('background', colorStat[idx]);
				});

				$legend.show();
			});
		},
	};

	// 유동인구
	var statPopFlow = {
		
		init: function(blockIdArr, blockCdArr, bounds, $btn) {
			var self = this;
			
			self.blockIdArr = blockIdArr;
			self.blockCdArr = blockCdArr;
			self.bounds = bounds;

			self.$modal = $('#modalVisPopFlow');
			self.$legend = $('#wrapMapBlockVis [data-wrap-vis-legend]');
			
			
			if (! $btn.hasClass('spinner')) {
			    KTUtil.btnWait($btn[0], "spinner spinner-left spinner-dark");
			}
			
			self.loadData().always(function() {
				if ($btn.hasClass('spinner')) {
					KTUtil.btnRelease($btn[0]);
				}
			}).done(function(resp) {
				self.updateData(resp);
			});
		},
		
		loadData: function() {
			var self = this,
				param = {
					blockCdArr: self.blockCdArr,
					south: self.bounds.getSouth(),
					west: self.bounds.getWest(),
					north: self.bounds.getNorth(),
					east: self.bounds.getEast(),
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
					demoLdongcd: _DemoLdongcd,
					yyyymmArr: ['202104']
				},
				weekdayArr = [],
				weekendArr = [],
				checkedStr = '주중 전체',
				ageStr = '주말 전체',
				result = $.Deferred();


			var $check = self.$modal.find('[name=weekdayTimeType]:checked');

			if ($check.val()) {
				checkedStr = '';
				$check.each(function(idx, elm) {
					weekdayArr.push($(elm).val());
					checkedStr += ', ' + $(elm).parent().text();
				});
				
				checkedStr = '주중 ' + checkedStr.substring(2);
			} else if (1 === $check.length) {
				$check = self.$modal.find('[name=weekdayTimeType][value!=""]');

				$check.each(function(idx, elm) {
					weekdayArr.push($(elm).val());
				});
			} else {
				checkedStr = '';
			}

			$check = self.$modal.find('[name=weekendTimeType]:checked');
			
			if ($check.val()) {
				ageStr = '';
				$check.each(function(idx, elm) {
					weekendArr.push($(elm).val());
					ageStr += ', ' + $(elm).parent().text();
				});

				ageStr = '주말 ' + ageStr.substring(2);
			} else if (1 === $check.length) {
				$check = self.$modal.find('[name=weekendTimeType][value!=""]');

				$check.each(function(idx, elm) {
					weekendArr.push($(elm).val());
				});
			} else {
				ageStr = '';
			}
			z.getDataReference().done(function(map) {
				var latestYm = map['유동인구_블럭']['최종시간'],
					timeStr = moment(latestYm, 'YYYYMM').format('YYYY.MM'),
					titleStr = '시간유형.';
				
				param.yyyymmArr = [moment(latestYm, 'YYYYMM').format('YYYY')];

				fnSetVisSearch(timeStr, titleStr, checkedStr + (checkedStr ? ', ' : '') + ageStr);
				
				z.xAsync('Gis', 'statPopFlowList', 'select', param, 'json').done(function(resp) {
					
					var statArr = [],
						blockCdMap = {};
					
					for (var i in resp) {
						var row = resp[i],
							rowCopy = blockCdMap[row.blockcd],
							cntMan = parseInt(row['남성']),
							cntWoman = parseInt(row['여성']);
							
						if (! rowCopy) {
							rowCopy = {
								blockCd: row.blockcd,
								stat: 0
							};
							
							blockCdMap[row.blockCd] = rowCopy;
							statArr.push(rowCopy);
						}
						
						if (isNaN(cntMan) || isNaN(cntWoman)) {
							continue;
						}
						
						switch (row['요일']) {
							case '1': case '7': // 주말
								if (-1 < weekendArr.indexOf(row['시간'])) {
									rowCopy.stat += cntMan + cntWoman;
								}
								break;
							default: // 주중
								if (-1 < weekdayArr.indexOf(row['시간'])) {
									rowCopy.stat += cntMan + cntWoman;
								}
								break;
						}
					}
					
					result.resolve(statArr);
				});
			});
			
			return result;
		},
		
		updateData: function(statArr) {
			var self = this,
				blockIdArr = self.blockIdArr,
				colorStat = [
					'#FCC5C0',
					'#FA9FB5',
					'#F768A1',
					'#C51B8A',
					'#7A0177'
				],
				opacityMap = {
					'0': 0.2,
					'1': 0.35,
					'2': 0.5,
					'3': 0.65,
					'4': 0.8
				};
			
			// 집계구 기준이면 100격자로 매핑
			if (statArr[0] && statArr[0].blockCd) {
				var statCopyArr = statArr;
				
				statArr = Array.apply(null, Array(blockIdArr.length)).map(function(v, idx) {
					return {
						blockid: blockIdArr[idx],
						stat: 0,
						cnt: 0
					};
				});
				
				for (var j in statCopyArr) {
					var statCopy = statCopyArr[j];
					
					for (var i in map.userSelectedClickArr) {
						var m100 = map.userSelectedClickArr[i];
						
						if (m100.outputAreaSet && m100.outputAreaSet.has(statCopy.blockCd)) {
							var row = statArr[blockIdArr.indexOf(m100.blockId)];
							
							row.stat += statCopy.stat;
							row.cnt++;
						}
					}
				}

				// 경계선의 값을 합계가 아닌 평균 값으로 변경 
				for(var k in statArr) {
					var row = statArr[k];
					if(row.cnt > 1) {
						row.stat = (row.stat / 7);
					}
				}
			}
	
			statArr = statArr.sort(function(a, b) {
				if (a.stat < b.stat) {
					return -1;
				}
				
				if (a.stat > b.stat) {
					return 1;
				}
				
				return 0;
			});
			
			if (! statArr.length) {
				statArr = [{stat: 0}];
			}

			for (var i in map.userSelectedClickArr) {
				var block = map.userSelectedClickArr[i];
				
				block.visTitle = '인구수';
				block.visContent = '데이터 없음';
				block.setStyle({
					fillColor: blockColor,
					fillOpacity: 0.5
				});
			}
							
			var maxValue = statArr[statArr.length - 1].stat,
				minValue = statArr[0].stat,
				diff = (maxValue - minValue) / 5,
				gradeArr = [
					minValue,
					minValue + diff,
					minValue + 2 * diff,
					minValue + 3 * diff,
					minValue + 4 * diff,
					maxValue + 0.0001
				];
	
			for (var i in statArr) {
				var stat = statArr[i],
					color = stat.stat,
					blockId = stat.blockid;
	
				// 1. 색상 정하고
				for (var j = 0, jLength = gradeArr.length - 1; jLength > j; ++j) {
					if (gradeArr[j] <= color && gradeArr[j + 1] >= color) {
						color = j;
						break;
					}
				}
				
				// 2. 블럭 찾아서 수정
				var isFound = false;
				for (var i in map.userSelectedClickArr) {
					if (blockId === map.userSelectedClickArr[i].blockId) {
						var block = map.userSelectedClickArr[i];
						
						isFound = true;
						
						block.visTitle = '인구수';
						block.visContent = z.toComma(stat.stat) + ' 명';
						
						block.setStyle({
							fillColor: colorStat[color],
							fillOpacity: 0.7
						});
						
						break;
					}
				}
			}
			
			// 범례 표시
			z.formatDataReference('유동인구_블럭').done(function(refText) {
				var $legend = self.$legend;
				
				$legend.find('[data-legend-title]').text('인구수');
				
				$legend.find('[data-reference]').text(refText);
				
				$legend.find('[data-grade]').each(function(idx, elm) {
					$(elm).text(z.toComma(gradeArr[idx]) + ' ~ ' + z.toComma(gradeArr[idx + 1]) + ' 명');
				});
				
				$legend.find('.thumb-color').each(function(idx, elm) {
					$(elm).css('background', colorStat[idx]);
				});

				$legend.show();
			});
		},
	};

	// 매출
	var statLobz = {
		
		init: function(blockIdArr, blockCdArr, bounds, $btn) {
			var self = this;
			
			self.blockIdArr = blockIdArr;
			self.blockCdArr = blockCdArr;
			self.bounds = bounds;
			
			self.$modal = $('#modalVisLobz');
			self.$legend = $('#wrapMapBlockVis [data-wrap-vis-legend]');
			
			
			if (! $btn.hasClass('spinner')) {
			    KTUtil.btnWait($btn[0], "spinner spinner-left spinner-dark");
			}
			
			self.loadData().always(function() {
				if ($btn.hasClass('spinner')) {
					KTUtil.btnRelease($btn[0]);
				}
			}).done(function(resp) {
				var statArr = [];
				// FIXME: 업종별, 날짜별 검색
				
				for (var i in resp) {
					var row = resp[i];
					
					statArr.push({
						blockCd: row.blockcd,
						stat: parseFloat(row.stat)
					});
				}

				self.updateData(statArr);
			});			
		},
		
		loadData: function() {
			var self = this,
				param = {
					blockCdArr: self.blockCdArr,
					south: self.bounds.getSouth(),
					west: self.bounds.getWest(),
					north: self.bounds.getNorth(),
					east: self.bounds.getEast(),
					industryArr: [],
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
					demoLdongcd: _DemoLdongcd
				},
				checkedStr = '전체';
				result = $.Deferred();
				
			var $check = self.$modal.find('[name=sanggaType]:checked');
			
			if ('' !== $check.val()) {
				checkedStr = '';
				$check.each(function(idx, elm) {
					param.industryArr.push($(elm).val());
					checkedStr += ', ' + $(elm).parent().text();
				});
				
				checkedStr = checkedStr.substring(2);
			}
			
			
			z.getDataReference().done(function(map) {
				var latestYm = map['매출']['최종시간'],
					timeStr = moment(latestYm, 'YYYYMM').format('YYYY.MM'),
					titleStr = '업종유형.';
				
				param.yyyymmArr = [latestYm];

				fnSetVisSearch(timeStr, titleStr, checkedStr);
				z.xAsync('Gis', 'statLobzList', 'select', param, 'json').done(function(resp) {
					result.resolve(resp);
				});
			});
			
			return result;			
		},
		
		updateData: function(statArr) {
			var self = this,
				blockIdArr = self.blockIdArr,
				colorStat = [
					'#FED976',
					'#FEB24C',
					'#FD8D3C',
					'#F03B20',
					'#BD0026'
				],
				opacityMap = {
					'0': 0.2,
					'1': 0.35,
					'2': 0.5,
					'3': 0.65,
					'4': 0.8
				};

			
			// 집계구 기준이면 100격자로 매핑
			if (statArr[0] && statArr[0].blockCd) {
				var statCopyArr = statArr;
				
				statArr = Array.apply(null, Array(blockIdArr.length)).map(function(v, idx) {
					return {
						blockid: blockIdArr[idx],
						stat: 0,
						cnt: 0
					};
				});
	
				for (var j in statCopyArr) {
					var statCopy = statCopyArr[j];
					
					for (var i in map.userSelectedClickArr) {
						var m100 = map.userSelectedClickArr[i];
						
						if (m100.outputAreaSet && m100.outputAreaSet.has(statCopy.blockCd)) {
							var row = statArr[blockIdArr.indexOf(m100.blockId)];
							
							row.stat += statCopy.stat;
							row.cnt++;
						}
					}
				}
				// 경계선의 값을 합계가 아닌 평균 값으로 변경 
				for(var k in statArr) {
					var row = statArr[k];
					if(row.cnt > 1) {
						row.stat = (row.stat / row.cnt);
					}
				}
			}
	
			statArr = statArr.sort(function(a, b) {
				if (a.stat < b.stat) {
					return -1;
				}
				
				if (a.stat > b.stat) {
					return 1;
				}
				
				return 0;
			});

			if (! statArr.length) {
				statArr = [{stat: 0}];
			}

			for (var i in map.userSelectedClickArr) {
				var block = map.userSelectedClickArr[i];
				
				block.visTitle = '매출';
				block.visContent = '데이터 없음';
				block.setStyle({
					fillColor: blockColor,
					fillOpacity: 0.5
				});
			}

			var maxValue = statArr[statArr.length - 1].stat,
				minValue = statArr[0].stat,
				diff = (maxValue - minValue) / 5,
				gradeArr = [
					minValue,
					minValue + diff,
					minValue + 2 * diff,
					minValue + 3 * diff,
					minValue + 4 * diff,
					maxValue + 0.0001
				];
	
			for (var i in statArr) {
				var stat = statArr[i],
					color = stat.stat,
					blockId = stat.blockid;
	
				// 1. 색상 정하고
				for (var j = 0, jLength = gradeArr.length - 1; jLength > j; ++j) {
					if (gradeArr[j] <= color && gradeArr[j + 1] >= color) {
						color = j;
						break;
					}
				}
				
				// 2. 블럭 찾아서 수정
				var isFound = false;
				for (var i in map.userSelectedClickArr) {
					if (blockId === map.userSelectedClickArr[i].blockId) {
						var block = map.userSelectedClickArr[i];
						
						isFound = true;
						
						block.visTitle = '매출';
						block.visContent = z.toComma(stat.stat / 10000 / 10000) + ' 억원';
						
						block.setStyle({
							fillColor: colorStat[color],
							fillOpacity: 0.7
						});
						
						break;
					}
				}
			}
			
			
			// 범례 표시
			z.formatDataReference('매출').done(function(refText) {
				var $legend = self.$legend;
				
				$legend.find('[data-legend-title]').text('매출');
				
				$legend.find('[data-reference]').text(refText);
				
				$legend.find('[data-grade]').each(function(idx, elm) {
					$(elm).text(z.toComma(gradeArr[idx] / 10000 / 10000) + ' ~ ' + z.toComma(gradeArr[idx + 1] / 10000 / 10000) + ' 억원');
				});
				
				$legend.find('.thumb-color').each(function(idx, elm) {
					$(elm).css('background', colorStat[idx]);
				});

				$legend.show();
			});
		},
	};


	var statRent = {
		
		init: function(blockIdArr, blockCdArr, bounds, $btn) {
			var self = this;
			
			self.blockIdArr = blockIdArr;
			self.blockCdArr = blockCdArr;
			self.bounds = bounds;
			
			self.$modal = $('#modalVisRent');
			self.$legend = $('#wrapMapBlockVis [data-wrap-vis-legend]');
			
			if (! $btn.hasClass('spinner')) {
			    KTUtil.btnWait($btn[0], "spinner spinner-left spinner-dark");
			}
			
			self.loadData().always(function() {
				if ($btn.hasClass('spinner')) {
					KTUtil.btnRelease($btn[0]);
				}
			}).done(function(resp) {
				var statArr = [];
				
				for (var i in resp) {
					var row = resp[i],
						stat = 0 !== parseFloat(row['전용면적']) ? (parseFloat(row['임대료']) / parseFloat(row['전용면적'])) : 0;
						
					if (stat) {
						stat = Math.round(100 * stat) / 100;
					}

					statArr.push({
						blockId: row.blockid,
						stat: stat
					});
				}

				self.updateData(statArr);
			});
		},
		
		loadData: function() {
			var self = this,
				param = {
					blockIdArr: self.blockIdArr,
					south: self.bounds.getSouth(),
					west: self.bounds.getWest(),
					north: self.bounds.getNorth(),
					east: self.bounds.getEast(),
					sanggaArr: [],
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
					demoLdongcd: _DemoLdongcd
				},
				checkedStr = '전체';
				result = $.Deferred();

			var $check = self.$modal.find('[name=sanggaType]:checked');
			
			if ('' !== $check.val()) {
				checkedStr = '';
				$check.each(function(idx, elm) {
					param.sanggaArr.push($(elm).val());
					checkedStr += ', ' + $(elm).parent().text();
				});
				
				checkedStr = checkedStr.substring(2);
			}

			z.getDataReference().done(function(map) {
				var latestYm = map['임대료_블럭']['최종시간'],
					timeStr = moment(latestYm, 'YYYYMM').format('YYYY.MM'),
					titleStr = '상가유형.';
				
				param.yyyymmArr = [latestYm];

				fnSetVisSearch(timeStr, titleStr, checkedStr);


				z.xAsync('Gis', 'statRentList', 'select', param, 'json').done(function(resp) {
					result.resolve(resp);
				});
			});
			
			return result;
		},
		
		updateData: function(statArr) {
			var self = this,
				blockIdArr = self.blockIdArr,
				colorStat = [
					'#D9F0A3',
					'#ADDD8E',
					'#78C679',
					'#31A354',
					'#006837'
				],
				opacityMap = {
					'0': 0.2,
					'1': 0.35,
					'2': 0.5,
					'3': 0.65,
					'4': 0.8
				};


			statArr = statArr.sort(function(a, b) {
				if (a.stat < b.stat) {
					return -1;
				}
				
				if (a.stat > b.stat) {
					return 1;
				}
				
				return 0;
			});

			if (! statArr.length) {
				statArr = [{stat: 0}];
			}

			for (var i in map.userSelectedClickArr) {
				var block = map.userSelectedClickArr[i];
				
				block.visTitle = '임대료';
				block.visContent = '데이터 없음';
				block.setStyle({
					fillColor: blockColor,
					fillOpacity: 0.5
				});
			}

			var maxValue = statArr[statArr.length - 1].stat,
				minValue = statArr[0].stat,
				diff = (maxValue - minValue) / 5,
				gradeArr = [
					minValue,
					minValue + diff,
					minValue + 2 * diff,
					minValue + 3 * diff,
					minValue + 4 * diff,
					maxValue + 0.0001
				];
	
			for (var i in statArr) {
				var stat = statArr[i],
					color = stat.stat,
					blockId = stat.blockId;
	
				// 1. 색상 정하고
				for (var j = 0, jLength = gradeArr.length - 1; jLength > j; ++j) {
					if (gradeArr[j] <= color && gradeArr[j + 1] >= color) {
						color = j;
						break;
					}
				}
				
				// 2. 블럭 찾아서 수정
				var isFound = false;
				for (var i in map.userSelectedClickArr) {
					if (blockId === map.userSelectedClickArr[i].blockId) {
						var block = map.userSelectedClickArr[i];
						
						isFound = true;
						
						block.visTitle = '임대료';
						block.visContent = stat.stat + ' 만원';
						
						block.setStyle({
							fillColor: colorStat[color],
							fillOpacity: 0.7
						});
						
						break;
					}
				}
			}

			// 범례 표시
			z.formatDataReference('임대료_블럭').done(function(refText) {
				var $legend = self.$legend;
				
				$legend.find('[data-legend-title]').text('전용면적 당 임대료');
				
				$legend.find('[data-reference]').text(refText);
				
				// m^2 당 임대료가 천만원 넘는경우가 거의 없어서 소수점 2자리 표시함
				$legend.find('[data-grade]').each(function(idx, elm) {
					$(elm).text((Math.round(gradeArr[idx] * 100) / 100) + ' ~ ' + (Math.round(gradeArr[idx + 1] * 100) / 100) + ' 만원');
				});
				
				$legend.find('.thumb-color').each(function(idx, elm) {
					$(elm).css('background', colorStat[idx]);
				});

				$legend.show();
			});
		},
	};


	var statUnder = {
		
		init: function(blockIdArr, blockCdArr, bounds, $btn) {
			var self = this;
			
			self.blockIdArr = blockIdArr;
			self.blockCdArr = blockCdArr;
			self.bounds = bounds;
			
			self.$modal = $('#modalVisUnder');
			self.$legend = $('#wrapMapBlockVis [data-wrap-vis-legend]');
			
			if (! $btn.hasClass('spinner')) {
			    KTUtil.btnWait($btn[0], "spinner spinner-left spinner-dark");
			}
			
			self.loadData().always(function() {
				if ($btn.hasClass('spinner')) {
					KTUtil.btnRelease($btn[0]);
				}
			}).done(function(resp) {
				var statArr = [];
				
				for (var i in resp) {
					var row = resp[i],
						stat = 0 !== parseFloat(row['전용면적']) ? (parseFloat(row['매매가']) / parseFloat(row['전용면적'])) : 0;
						
					if (stat) {
						stat = Math.round(100 * stat) / 100;
					}

					statArr.push({
						blockId: row.blockid,
						stat: stat
					});
				}

				self.updateData(statArr);
			});
		},
		
		loadData: function() {
			var self = this,
				param = {
					blockIdArr: self.blockIdArr,
					south: self.bounds.getSouth(),
					west: self.bounds.getWest(),
					north: self.bounds.getNorth(),
					east: self.bounds.getEast(),
					sanggaArr: [],
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
					demoLdongcd: _DemoLdongcd
				},
				checkedStr = '전체';
				result = $.Deferred();

			var $check = self.$modal.find('[name=sanggaType]:checked');
			
			if ('' !== $check.val()) {
				checkedStr = '';
				$check.each(function(idx, elm) {
					param.sanggaArr.push($(elm).val());
					checkedStr += ', ' + $(elm).parent().text();
				});
				
				checkedStr = checkedStr.substring(2);
			}

			z.getDataReference().done(function(map) {
				var latestYm = map['매매가_블럭']['최종시간'],
					timeStr = moment(latestYm, 'YYYYMM').format('YYYY.MM'),
					titleStr = '상가유형.';
				
				param.yyyymmArr = [latestYm];

				fnSetVisSearch(timeStr, titleStr, checkedStr);
				
				z.xAsync('Gis', 'statTradingList', 'select', param, 'json').done(function(resp) {
					result.resolve(resp);
				});
			});
			
			return result;
		},
		
		updateData: function(statArr) {
			var self = this,
				blockIdArr = self.blockIdArr,
				colorStat = [
					'#D9F0A3',
					'#ADDD8E',
					'#78C679',
					'#31A354',
					'#006837'
				],
				opacityMap = {
					'0': 0.2,
					'1': 0.35,
					'2': 0.5,
					'3': 0.65,
					'4': 0.8
				};


			statArr = statArr.sort(function(a, b) {
				if (a.stat < b.stat) {
					return -1;
				}
				
				if (a.stat > b.stat) {
					return 1;
				}
				
				return 0;
			});

			if (! statArr.length) {
				statArr = [{stat: 0}];
			}

			for (var i in map.userSelectedClickArr) {
				var block = map.userSelectedClickArr[i];
				
				block.visTitle = '매매가';
				block.visContent = '데이터 없음';
				block.setStyle({
					fillColor: blockColor,
					fillOpacity: 0.5
				});
			}

			var maxValue = statArr[statArr.length - 1].stat,
				minValue = statArr[0].stat,
				diff = (maxValue - minValue) / 5,
				gradeArr = [
					minValue,
					minValue + diff,
					minValue + 2 * diff,
					minValue + 3 * diff,
					minValue + 4 * diff,
					maxValue + 0.0001
				];
	
			for (var i in statArr) {
				var stat = statArr[i],
					color = stat.stat,
					blockId = stat.blockId;
	
				// 1. 색상 정하고
				for (var j = 0, jLength = gradeArr.length - 1; jLength > j; ++j) {
					if (gradeArr[j] <= color && gradeArr[j + 1] >= color) {
						color = j;
						break;
					}
				}
				
				// 2. 블럭 찾아서 수정
				var isFound = false;
				for (var i in map.userSelectedClickArr) {
					if (blockId === map.userSelectedClickArr[i].blockId) {
						var block = map.userSelectedClickArr[i];
						
						isFound = true;
						
						block.visTitle = '매매가';
						block.visContent = stat.stat + ' 만원';
						
						block.setStyle({
							fillColor: colorStat[color],
							fillOpacity: 0.7
						});
						
						break;
					}
				}
			}

			// 범례 표시
			z.formatDataReference('매매가_블럭').done(function(refText) {
				var $legend = self.$legend;
				
				$legend.find('[data-legend-title]').text('전용면적 당 매매가');
				
				$legend.find('[data-reference]').text(refText);
				
				// m^2 당 임대료가 천만원 넘는경우가 거의 없어서 소수점 2자리 표시함
				$legend.find('[data-grade]').each(function(idx, elm) {
					$(elm).text((Math.round(gradeArr[idx] * 100) / 100) + ' ~ ' + (Math.round(gradeArr[idx + 1] * 100) / 100) + ' 만원');
				});
				
				$legend.find('.thumb-color').each(function(idx, elm) {
					$(elm).css('background', colorStat[idx]);
				});

				$legend.show();
			});
		},
	};

	
	var statP = {
		
		init: function(blockIdArr, blockCdArr, bounds, $btn) {
			var self = this;
			
			self.blockIdArr = blockIdArr;
			self.blockCdArr = blockCdArr;
			self.bounds = bounds;

			self.$modal = $('#modalVisP');
			self.$legend = $('#wrapMapBlockVis [data-wrap-vis-legend]');
			
			if (! $btn.hasClass('spinner')) {
			    KTUtil.btnWait($btn[0], "spinner spinner-left spinner-dark");
			}
			
			self.loadData().always(function() {
				if ($btn.hasClass('spinner')) {
					KTUtil.btnRelease($btn[0]);
				}
			}).done(function(resp) {
				var statArr = [];
				
				for (var i in resp) {
					var row = resp[i];

					statArr.push({
						blockId: row.blockid,
						stat: 0 !== parseFloat(row['전용면적']) ? (parseFloat(row['분양가']) / parseFloat(row['전용면적'])) : 0
					});
				}

				self.updateData(statArr);
			});
		},
		
		loadData: function() {
			var self = this,
				param = {
					blockIdArr: self.blockIdArr,
					south: self.bounds.getSouth(),
					west: self.bounds.getWest(),
					north: self.bounds.getNorth(),
					east: self.bounds.getEast(),
					sanggaArr: [],
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
					demoLdongcd: _DemoLdongcd
				},
				checkedStr = '전체';
				result = $.Deferred();

			var $check = self.$modal.find('[name=sanggaType]:checked');
			
			if ('' !== $check.val()) {
				checkedStr = '';
				$check.each(function(idx, elm) {
					param.sanggaArr.push($(elm).val());
					checkedStr += ', ' + $(elm).parent().text();
				});
				
				checkedStr = checkedStr.substring(2);
			}
			
			
			z.getDataReference().done(function(map) {
				var latestYm = map['상가']['최종시간'],
					timeStr = moment(latestYm, 'YYYYMM').format('YYYY.MM'),
					titleStr = '상가유형.';
				
				param.yyyymmArr = [latestYm];

				fnSetVisSearch(timeStr, titleStr, checkedStr);

				z.xAsync('Gis', 'statPList', 'select', param, 'json').done(function(resp) {
					result.resolve(resp);
				});
			});

			return result;
		},
		
		updateData: function(statArr) {
			var self = this,
				blockIdArr = self.blockIdArr,
				colorStat = [
					'#C6DBEF',
					'#9ECAE1',
					'#6BAED6',
					'#3182BD',
					'#08519C'
				],
				opacityMap = {
					'0': 0.2,
					'1': 0.35,
					'2': 0.5,
					'3': 0.65,
					'4': 0.8
				};
				
			// 분양가 0 데이터 제외
			statArr = statArr.filter(function(elm) {
				return elm.stat;
			});

			statArr = statArr.sort(function(a, b) {
				if (a.stat < b.stat) {
					return -1;
				}
				
				if (a.stat > b.stat) {
					return 1;
				}
				
				return 0;
			});
			
			if (! statArr.length) {
				statArr = [{stat: 0}];
			}

			for (var i in map.userSelectedClickArr) {
				var block = map.userSelectedClickArr[i];
				
				block.visTitle = '분양가';
				block.visContent = '데이터 없음';
				block.setStyle({
					fillColor: blockColor,
					fillOpacity: 0.5
				});
			}

			var maxValue = statArr[statArr.length - 1].stat,
				minValue = statArr[0].stat,
				diff = (maxValue - minValue) / 5,
				gradeArr = [
					minValue,
					minValue + diff,
					minValue + 2 * diff,
					minValue + 3 * diff,
					minValue + 4 * diff,
					maxValue + 0.0001
				];
	
			for (var i in statArr) {
				var stat = statArr[i],
					color = stat.stat,
					blockId = stat.blockId;
	
				// 1. 색상 정하고
				for (var j = 0, jLength = gradeArr.length - 1; jLength > j; ++j) {
					if (gradeArr[j] <= color && gradeArr[j + 1] >= color) {
						color = j;
						break;
					}
				}
				
				// 2. 블럭 찾아서 수정
				var isFound = false;
				for (var i in map.userSelectedClickArr) {
					if (blockId === map.userSelectedClickArr[i].blockId) {
						var block = map.userSelectedClickArr[i];
						
						isFound = true;
						
						block.visTitle = '분양가';
						block.visContent = z.toComma(stat.stat) + ' 만원';
						
						block.setStyle({
							fillColor: colorStat[color],
							fillOpacity: 0.7
						});
						
						break;
					}
				}
				
			}

			
			// 범례 표시
			z.formatDataReference('상가').done(function(refText) {
				var $legend = self.$legend;
				
				$legend.find('[data-legend-title]').text('전용면적 당 분양가');
				
				$legend.find('[data-reference]').text(refText);
				
				$legend.find('[data-grade]').each(function(idx, elm) {
					$(elm).text(z.toComma(gradeArr[idx]) + ' ~ ' + z.toComma(gradeArr[idx + 1]) + ' 만원');
				});
				
				$legend.find('.thumb-color').each(function(idx, elm) {
					$(elm).css('background', colorStat[idx]);
				});

				$legend.show();
			});
		},
	};

	
	var fnSetVisSearch = function(timeStr, titleStr, checkedStr) {
		$wrapVisSearch.find('[data-opt-time]').text(timeStr);
		$wrapVisSearch.find('[data-opt-title]').text(titleStr);
		$wrapVisSearch.find('[data-opt-checked]').text(checkedStr);
		
		$wrapVisSearch.addClass('on');
	};


	return {
		
		fnInitVis: function() {
			var self = this;
			compVis.init();
		}
	};
})();