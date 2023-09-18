'use strict';
// Class definition

var apiSearchEmd;
var excelyn;
var dtlexcelyn;
var averageTrading = function() {
    // Private functions

	// FIXME: 상가코드 공통코드화 필요
	var sanggaTypeArr = [
		'근린상가',
		'단지내상가',
		'복합상가',
		'테마상가',
		'오피스상가',
		'기타상가'
	];
	var sanggaTypeMap = {
		'근린상가': 0,
		'단지내상가': 1,
		'복합상가': 2,
		'테마상가': 3,
		'오피스상가': 4,
		'기타상가': 5
	};

	// 상가유형 DB 조회
	z.getCommCode('100100').done(function(resp) {
		if (! resp || ! resp.length) {
			return;
		}

		sanggaTypeMap = resp.reduce(function(acc, cur) {
			acc[cur['공통상세명']] = parseInt(cur['정렬코드']);
			return acc;
		}, {});

		sanggaTypeArr = [];
		
		for (var i in resp) {
			sanggaTypeArr.push(resp[i]['공통상세명']);
		}
	});
	
	// FIXME: 층 공통코드화 필요
	var floorTypeArr = [
		'B1F',
		'1F',
		'2F',
		'3F',
		'4F이상'
	];
	var floorTypeMap = {
		'B1F': 0,
		'1F': 1,
		'2F': 2,
		'3F': 3,
		'4F이상': 4
	};
	
	var	areaTypeArr = [
		'1,000㎡ 미만',
		'1,000㎡~3,000㎡',
		'3,000㎡~5,000㎡',
		'5,000㎡~7,000㎡',
		'7,000㎡~10,000㎡',
		'10,000㎡~15,000㎡',
		'15,000㎡~30,000㎡',
		'30,000㎡ 이상'
	];
	
	var areaTypeMap = {
		'1,000㎡ 미만' : 0,
		'1,000㎡~3,000㎡' : 1,
		'3,000㎡~5,000㎡' : 2,
		'5,000㎡~7,000㎡' : 3,
		'7,000㎡~10,000㎡' : 4,
		'10,000㎡~15,000㎡' : 5,
		'15,000㎡~30,000㎡' : 6,
		'30,000㎡ 이상' : 7
	}

	// 평균매매가 추이 차트
	var chartaverageTradingAll = {
		init: function(param, searchDtl) {
			var self = this,
				apexChart = '#chart_1_1';
			
			self.$wrapper = $(apexChart).closest('[data-chart-wrapper]');
			self.param = param;
			self.searchDtl = searchDtl;
			
			// 상가 설정
			// 상가유형
			if (self.searchDtl && self.searchDtl.checkSanggaType.length) {
				self.isCustomSangga = true;
				self.sanggaArr = $.extend(true, [], self.searchDtl.checkSanggaType);
				self.sanggaMap = {};
				
				for (var i in self.sanggaArr) {
					self.sanggaMap[self.sanggaArr[i]] = i;
				}
			} else {
				self.isCustomSangga = false;
				self.sanggaArr = $.extend(true, [], sanggaTypeArr);
				self.sanggaMap = $.extend(true, {}, sanggaTypeMap);
			}
			
			// 층 설정
			if (self.searchDtl && self.searchDtl.checkFloorBound.length) {  
				self.isCustomFloor = true;
				self.floorArr = $.extend(true, [], self.searchDtl.checkFloorBound);
			} else {
				self.isCustomFloor = false;
				self.floorArr = $.extend(true, [], floorTypeArr);
			}
			
			// 면적유형 설정
			if (self.searchDtl && self.searchDtl.checkAreaBound.length) {
				self.isCustomArea = true;
				self.areaArr = $.extend(true, [], self.searchDtl.checkAreaBound);
				if(self.searchDtl.radioResultArea == 'rent_ua') {
					self.areaNm = 'usage_area';
				} else {
					self.areaNm = 'cont_area';
				}
			} else {
				self.isCustomArea = false;
				self.areaArr = [];
			}
			// 기간 설정
			if (self.searchDtl && self.searchDtl.radioTimeBound) {
				self.period = self.searchDtl.radioTimeBound;
			}
			
			// 결과유형 설정
			if (self.searchDtl && self.searchDtl.radioResultColumn) {
				self.resultNm = self.searchDtl.radioResultColumn;
			}
			
			// 가격기준 설정
			if (self.searchDtl && self.searchDtl.radioPriceUnit) {
				self.priceUnit = self.searchDtl.radioPriceUnit;
			}
			
			// 사용자설정에서 시작일 설정했을 때
			if (self.searchDtl && self.searchDtl.pastYMD) {
				//선택시 반기 일때 반기, 분기일때 분기, 연간일때 연간 x 
				var tmp = self.searchDtl.pastYMD,
					tmpYear =  parseInt(tmp.substring(0,4)),
					tmpMonth = parseInt(tmp.substr(4,2)),
					start = null,
					minYMD = null;
				switch (self.period) {
				case '1' : 
					minYMD = tmpYear + '';
					start = tmpYear - 1 + '';
					break;
				case '2' :
					minYMD = tmpYear + '' + (Math.ceil(tmpMonth / 6 ));
					start = (Math.ceil(tmpMonth / 6 ) == 1 ? tmpYear -1 : tmpYear) + '' + (Math.ceil(tmpMonth / 6) == 1 ? 2 : 1);
					break;
				case '3' :
					minYMD = tmpYear + '' + (Math.ceil(tmpMonth / 3 ));
					start = (Math.ceil(tmpMonth/ 3) == 1 ? tmpYear -1 + '' : tmpYear) + '' + (Math.ceil(tmpMonth / 3) == 1 ? '4' : Math.ceil(tmpMonth/ 3) - 1);
					break;
				}
				self.minYMD = minYMD;
				self.startDate = start;
			}
			
			// FIXME: param null 로 들어올 수도 있어서 검토 부탁드립니다
			if (! self.param) {
				self.param = {
					year: null
				};
			};	
			// 차트 초기화 
			var options = {
				series: [{
					name: '매매가',
					data: [756, 636, 860]
				}],
				chart: {
					width: '100%',
					height: 520,
					type: 'line',
					stacked: false,
			        toolbar: {
			            show: true,
			            offsetY: -27,
			            export: {
							csv: {
								headerCategory: '\uFEFF',
								filename: '평균매매가_추이'
							}	
						}
			        },
					zoom: {
						enabled: false
					},
					events: {
			        	click: function(event, chartContext, config) {
			        		var year = config.dataPointIndex,
			        			$target = $(event.target);
							
							if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
								z.addDownloadLog('추이', 'chart');
							}
							
			    			if(excelyn == "N"){
			    				$('#chart_1_1 .exportCSV').css("display", "none");
							} else {
								$('#chart_1_1 .exportCSV').css("display", "block");
							};
							
							self.loadNextObj(self.xAxisArr[year]);         
						}
				    }
		        },
				dataLabels: {
					enabled: false
				},
				tooltip: {
					y: {
		                formatter: function(value) {
							return z.toComma(value) + ' ' + self.searchDtl.unitText;
						}
					}
				},
				xaxis: {
					categories: ['2018', '2019', '2020'],
					axisBorder: {
			            show: false,
			        },
					tooltip: {
						enabled: false
					}
				},
				yaxis: [{
					title: {
						text: '당해연도 매매가'
					}
				}],
				colors: ['#009dd7'],
			    stroke: {
			        show: true,
			        width: 4,
			        dashArray: 0,
			    },
			    markers: {
			        size: 8,
			        colors: ['#009dd7'],
			        strokeColors: '#fff',
			        strokeWidth: 2,
			        strokeOpacity: 0.9,
			        shape: "circle",
			        radius: 2,
			        offsetX: 0,
			        offsetY: 0,
			    },
			    legend: {
			        show: true,
			        showForSingleSeries: false,
			        showForNullSeries: true,
			        showForZeroSeries: true,
			        position: 'bottom',
			        horizontalAlign: 'center',
			        floating: false,
			        fontSize: '10px',
			        fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
			        fontWeight: 400,
			        inverseOrder: false,
			        offsetX: 0,
			        offsetY: 8,
			        labels: {
			            useSeriesColors: false
			        },
			        markers: {
			            width: 8,
			            height: 8,
			            strokeWidth: 0,
			            strokeColor: '#fff',
			            radius: 12,
			            offsetX: 0,
			            offsetY: 20
			        },
			        itemMargin: {
			            horizontal: 5,
			            vertical: 0
			        },
			        onItemClick: {
			            toggleDataSeries: true
			        },
			        onItemHover: {
			            highlightDataSeries: true
			        },
			    }
			};
			
			if (self.chart) {
				self.chart.destroy();
			}

			var chart = new ApexCharts($(apexChart)[0], options);
			self.chart = chart;
			
			self.setBtnListener();

			chart.render().then(function() {
				chart.updateSeries([]);
				
				if (self.param) {
					if (! self.param.isBizdist) {
						self.$wrapper.find('[data-sgg-nm]').text(param.sggnm || param.sidonm);
						self.$wrapper.find('[data-dong-nm]').text(param.dongnm);
					} else {
						self.$wrapper.find('[data-sgg-nm]').text('');
						self.$wrapper.find('[data-dong-nm]').text(param.bizdistnm);
					}
					
					self.loadData().done(function(resp) {
						self.loadAxis();
						self.updateData();	
					});
				}
			});

		},
		
		// input, form 변경 시 수정사항 정리영역
		// 검색 조건 바뀔 때 + 업데이트 전 파라메터 정리 필요하면 여기에서 실행
		setBtnListener: function() {
		},
		
		loadNextObj: function(year) {
			var self = this,
				$chart = $(self.apexChart);
			if (typeof year !== 'undefined' || year !== undefined) {
				switch (self.period) {
				case '1' : 
					year = year.substring(0,4);
					break;
				default : 
					year = year.substring(0,4) + year.substr(5,1);
				break;
				}
				if (! self.param) {
					self.param = {
						year: null
					};
				}
				self.param.year = year;
				// 2번째 차트에 넣기
				chartaverageTradingYear.init(self.param, self.searchDtl);
			}
		},
		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			debugger;
			var self = this,
				selectNm = (self.param.isBizdist ? '평균매매가상권추이차트' : (self.param.sidonm == '전국'? '평균매매가전국추이차트' : '평균매매가시도추이차트')),
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					pnu2: '',
					jusoCd : self.param.jusoCd,
					period : self.period,// default 값이 분기
					startDate : self.startDate,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' 
				};

			switch (param.jusoCd) {
				case 'sgg' : 
					param.pnu2 = param.pnu.substring(0,2); 
					break;
				case 'emd' :
					param.pnu = param.pnu.substring(0,8);
					param.pnu2 = param.pnu.substring(0,5);
					break;
			}
			
			// 상가 설정했는지 배열로 보내기
			param.sanggaArr = self.sanggaArr;
				 
			// 층유형 설정했는지 배열로 보내기
			if (self.isCustomFloor) {
				param.floorArr = self.floorArr;
			}
			
			// 면적유형 설정했는지 배열로 보내기
			if (self.isCustomArea) {
				param.areaArr = self.areaArr.toString();
				param.areaNm = self.areaNm;
			}

			// 결과유형 설정했는지 배열로 보내기
			if (self.searchDtl && self.searchDtl.radioResultColumn) {
				param.areaArr = self.areaArr.toString();
				param.areaNm = self.areaNm;
			}

			return z.xAsync('averageTrading', selectNm, 'select', param, 'json').done(function(resp) {
				if(! self.param.isBizdist) {
					self.rawDataArr = [];
					for (var i in resp) {
						if(self.param.sidonm == '전국') {
							self.rawDataArr.push(resp[i]);
						} else {
							if(resp[i].cd == self.param.dongCd) {
								self.rawDataArr.push(resp[i]);
							}
						}
					}
				} else {
					self.rawDataArr = resp;
				}
			});
		},
		
		loadCondition: function() {
		},
		
		loadAxis: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				xAxisArr = [],
				yAxisObj = [{
					title: {
						text: '매매가'
					},
					labels: {
						formatter: function(value) {
							value =  z.toComma(Math.round(value * 100) / 100);
							return value;
						}
					}
				}];

			// 정렬: 분양연도 오름차순
			// 연도 - 1년 기간, 년도 - 10년 기간
			rawDataArr = rawDataArr.sort(function(a, b) {	//  배열값 순서대로 넣기
				if (a['period'] < b['period']) {
					return -1;
				}
				if (a['period'] > b['period']) {
					return 1;
				}
				return 0;
			});
			// 데이터 부족으로 인해서, 전체 데이터 표시
			var minYearInt = 1000,
				maxYearInt = Math.ceil(moment().year()),
				maxQuater = self.period == '1' ? '' : self.period == '2' ? Math.ceil((moment().month() + 1) / 6) : Math.ceil((moment().month()+1) / 3),
				minQuater = '',
				xAxisPeriod = [],
				xAxisRatePeriod = [],
				isRate = false,
				periodCount = 0,
				tmp = self.minYMD;
		
			switch(self.period){
				case '1': //년
					minYearInt = parseInt(tmp);
					if (maxYearInt - minYearInt > 11) {
						minYearInt = maxYearInt - 11;
					}	
					periodCount = maxYearInt - minYearInt + 1;

					for (var i = 0; periodCount > i; ++i) {
						xAxisArr.push('' + (minYearInt + i));
						xAxisPeriod.push('' + (minYearInt + i));
					}	
					if(isRate) { // 환산임대료변동율 계산하기 위한 값
						xAxisRatePeriod = JSON.parse(JSON.stringify(xAxisPeriod));
						xAxisRatePeriod.unshift(minYearInt - 1);
					}
					break;
				case '2': //반기
					minYearInt = parseInt(tmp.substr(0,4));
					minQuater =	parseInt(tmp.substr(4,1));
					if (((maxYearInt - minYearInt) * 2 + maxQuater - minQuater) > 11) {
						minYearInt = maxYearInt - 6;
						minQuater = maxQuater + 1;
						if (2 < minQuater) {
							minYearInt++;
							minQuater = 1;
						}
					}
					
					periodCount = (maxYearInt - minYearInt) * 2 + maxQuater - minQuater + 1;
					for(var j = 0; j <= periodCount / 2; ++j){
						for(var i = 1; i <= 2; i++){
							if(j == 0 && i < minQuater) continue;
							if(j == periodCount / 2 + (minQuater == 1 ? 0 : 1) && i > maxQuater) continue;
							xAxisArr.push('' + (minYearInt + j + '.' + i + 'H'));
							xAxisPeriod.push(minYearInt + j + '' + i);
						}
					}
					if(isRate) {	// 환산임대료변동율일때
						xAxisRatePeriod = JSON.parse(JSON.stringify(xAxisPeriod));
						if (minQuater == 1) {
							xAxisRatePeriod.unshift(minYearInt -1 + '2');
						} else {
							xAxisRatePeriod.unshift(minYearInt + '1');
						}
					}
					self.minYearQuater = xAxisArr[0].substring(0,4) + xAxisArr[0].substring(5,1);
					self.maxYearQuater =  xAxisArr[xAxisArr.length-1].substring(0,4) + xAxisArr[xAxisArr.length-1].substring(5,1);
					break;
				
				case '3': //분기
					minYearInt = parseInt(tmp.substr(0,4));
					minQuater =	parseInt(tmp.substr(4,1));
				
					if ( ((maxYearInt - minYearInt) * 4 + maxQuater - minQuater ) > 11) {
						minYearInt = maxYearInt - 3;
						minQuater = maxQuater + 1;
						if (4 < minQuater) {
							minYearInt++;
							minQuater = 1;
						}
					}

					periodCount = (maxYearInt - minYearInt) * 4 + maxQuater - minQuater + 1;
					for(var j = 0; j < periodCount / 4 + (minQuater == 1 ? 0 : 1); j++ ){
						for(var i = 1; i <= 4; i++){
							if(periodCount > 12) {
								if(j == 0 && i < minQuater) continue;
								if(j == Math.floor(periodCount / 4) + minQuater == 1 ? 0 : minQuater == 2 ? 0 : 1 && i > maxQuater) continue;
							} else if(periodCount == 12){
								if(j == 0 && i < minQuater) continue;
								if(j == Math.floor(periodCount / 4) /*+(minQuater==1 || minQuater==2? 0 : 1) */&& i > maxQuater) continue;
							} else {
								if(j == 0 && i < minQuater) continue;
								if(j == Math.floor(periodCount / 4) +(minQuater == 1 || minQuater == 2 ? 0 : 1) && i > maxQuater) continue;
							}
							xAxisArr.push('' + (minYearInt + j + '.' + i + 'Q'));
							xAxisPeriod.push(minYearInt + j + '' + i);
						}
					}
					self.minYearQuater = xAxisArr[0].substring(0,4) + xAxisArr[0].substring(5,1);
					self.maxYearQuater =  xAxisArr[xAxisArr.length-1].substring(0,4) + xAxisArr[xAxisArr.length-1].substring(5,1);
					break;
			}				
				
			// 엑셀 저장용 정보로도 활용될 예정
			self.xAxisPeriod = xAxisPeriod;
			self.xAxisRatePeriod = xAxisRatePeriod;
			self.xAxisArr = xAxisArr;
			self.yAxisObj = yAxisObj;
			self.periodCount = periodCount;
		},

		// 데이터 정제 후에 updateOptions, updateSeries 호출
		updateData: function() {
			var self = this,
				chartOptions = {
					xaxis: {
						categories: self.xAxisArr
					},
					yaxis: self.yAxisObj
				},
				chartSeries = [];

			self.updateDataByYear(chartOptions, chartSeries);

			// 엑셀 저장용 정보로도 활용될 예정
//				self.yAxisArr = chartSeries;
		
			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);			
		},
		
		updateDataByYear: function(chartOptions, chartSeries) {
			var self = this,
				sanggaMap = self.sanggaMap,
				averageTradingData = {
					name: '매매가',
					data: []
				},
				columnNm = self.searchDtl.radioResultArea;
				chartSeries.push(averageTradingData);
			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));
		
			for (var i = 0; i < self.periodCount; ++i) { // 초기값 0으로 설정
				averageTradingData.data.push(0);
			}
			
			for (var i in rawDataArr) { // x축이랑 데이터period 같을때 값 넣기
				var raw = rawDataArr[i],
					rawPeriod = raw['period'],
					result = parseFloat(raw[columnNm]);
				
				// FIXME: 점포수, 공급건수, 면적 구분 필요
				for ( var j = 0; j < self.periodCount; j++){
					if(self.xAxisPeriod[j] == parseInt(rawPeriod)) {
						averageTradingData.data[j] = result;
					} 
				}
			}
			
			// 합산 이후에는 모든 데이터 소수점 2자리까지 출력 
			// 여기서 전용면적인지 계약면적인지 또는 평균임대료 변동율인지에 따라서 다르게 구하면 된다.
			for (var i in averageTradingData.data) {
				if (self.searchDtl.radioPriceUnit === 'py') {
					averageTradingData.data[i] *= zo.py2m;
				}
				averageTradingData.data[i] = Math.round(averageTradingData.data[i]);
			}	
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = self.xAxisArr,
				yAxisArr = self.yAxisArr,
				excelData = [],
				excelOpt = {header: ['업종분포']};

			return result;
		}
	};

	
	// 평균매매가 5건 
	var chartaverageTradingYear = {
		init: function(param, searchDtl) {
			var self = this;
			self.apexChart = '#chart_2_1';
			self.$wrapper = $(self.apexChart).closest('[data-chart-wrapper]');
			self.param = param;
			self.searchDtl = searchDtl;
			
			// 상가유형
			if (self.searchDtl && self.searchDtl.checkSanggaType.length) {
				self.isCustomSangga = true;
				self.sanggaArr = $.extend(true, [], self.searchDtl.checkSanggaType);
				self.sanggaMap = {};
				
				for (var i in self.sanggaArr) {
					self.sanggaMap[self.sanggaArr[i]] = i;
				}
			} else {
				self.isCustomSangga = false;
				self.sanggaArr = $.extend(true, [], sanggaTypeArr);
				self.sanggaMap = $.extend(true, {}, sanggaTypeMap);
			}
			
			// 층설정
			if (self.searchDtl && self.searchDtl.checkFloorBound.length) {
				self.isCustomFloor = true;
				self.floorArr = $.extend(true, [], self.searchDtl.checkFloorBound);
				self.floorMap = {};
				
				for (var i in self.floorArr) {
					self.floorMap[self.floorArr[i]] = i;
				}
			} else {
				self.isCustomFloor = false;
				self.floorArr = $.extend(true, [], floorTypeArr);
				self.floorMap = $.extend(true, {}, floorTypeMap);
			}

			// 면적유형 설정
			if (self.searchDtl && self.searchDtl.checkAreaBound.length) {
				self.isCustomArea = true;
				self.areaArr = $.extend(true, [], self.searchDtl.checkAreaBound);
				if(self.searchDtl.radioResultArea == 'rent_ua') {
					self.areaNm = 'usage_area';
				} else {
					self.areaNm = 'cont_area';
				}
			} else {
				self.idCustomArea = false;
				self.areaArr = [];
			}
			// 기간 설정 // period 반기인지 분기인지 설정하는것 하기 
			if (self.searchDtl && self.searchDtl.radioTimeBound) {
				self.period = self.searchDtl.radioTimeBound;
			}
			
			// 가격기준 설정
			if (self.searchDtl && self.searchDtl.radioPriceUnit) {
				self.priceUnit = self.searchDtl.radioPriceUnit;
			}
			// FIXME: param null 로 들어올 수도 있어서 검토 부탁드립니다
			if (! self.param) {
				self.param = {
					year: null
				};
			}
			if (typeof self.param.year != 'undefined' && self.param.year != '' && self.param.year != null) { // 초기값
				var maxYear = self.param.year.substring(0,4);
				if (self.period != '1') {
					var maxQuater = parseInt(self.param.year.substr(4,1));
				}
				self.isClick = true;
			} else { 
				switch (self.period) {
					case '1':
						var maxYear = moment().year();
					break;
					case '2': 
						var maxQuater = Math.ceil((moment().month() + 1 ) / 6),
							maxYear = moment().year();
					break;
					case '3':
						var maxQuater = Math.ceil((moment().month() + 1 ) / 3),
							maxYear = moment().year();
					break;	
				}
				self.isClick = false;
			}
			// 차트 초기화 퍼블리싱 코드 옮겨옴
			var options = {
				series: [{
					name: '근린상가',
	                data: [563, 577, 96, 370, 120, 350]
	            }],
				chart: {
					width: '100%',
					height: 243,
					type: 'bar',
					toolbar: {
						show: false
					},
					zoom: {
						enabled: false
					},
					events: {
						updated: function() {
							if ( self.updateTimeout ) {
								return;
							}
						}
					}
				},
				plotOptions: {
					bar: {
						horizontal: false,
						columnWidth: '80%'
					}
				},
				dataLabels: { 	
					enabled: false
				},
				tooltip: {
					y: {
		                formatter: function(value) {
							return z.toComma(value) + ' ' + self.searchDtl.unitText;
						}
					}
				},
				xaxis: {
					categories: [],
				},
			    colors: ['#5e58c9','#2985d2','#2eb7c4','#6d9d64','#b5bf1b','#f1c644','#f28f6c'],
				grid: {
					padding: {
						bottom: 20
					}
				},
			    legend: {
			        show: true,
			        showForSingleSeries: true,
			        showForNullSeries: true,
			        showForZeroSeries: true,
			        position: 'bottom',
			        horizontalAlign: 'left',
			        floating: false,
			        fontSize: '10px',
			        fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
			        fontWeight: 400,
			        offsetX: -40,
		        	height: 40,
			        markers: {
			            width: 8,
			            height: 8,
			            strokeWidth: 0,
			            strokeColor: '#fff',
			            radius: 12,
			            offsetX: 0,
			            offsetY: 20
			        },
			        itemMargin: {
			            horizontal: 10,
			            vertical: 0
			        },
			        onItemClick: {
			            toggleDataSeries: true
			        },
			        onItemHover: {
			            highlightDataSeries: true
			        },
			    }
			};

			if (self.chart) {
				self.chart.destroy();
			}
			var chart = new ApexCharts($(self.apexChart)[0], options);
			
			self.chart = chart;
			
			self.setBtnListener();

			chart.render().then(function() {
				chart.updateSeries([]);

				if (self.param) {
					self.maxYearQuater = '';
					self.minYearQuater = '';
					var text = '',
						startMM; 
					
					switch (self.period) {
					case '1': 
						self.diffYear = 5;
						self.maxYear = maxYear;
						self.minYear = maxYear - self.diffYear + 1;
						self.startDate = maxYear - self.diffYear;
						self.param.year = self.maxYear;
						text = maxYear;
						break;
					case '2': 
						self.maxQuater = maxQuater;
						self.maxYear = maxYear
						self.maxYearQuater = self.maxYear + '' + self.maxQuater; 
						self.diffYear = 2;
						self.minYear = self.maxYear - self.diffYear;
						self.minQuater = self.maxQuater;
						self.minYearQuater = self.minYear + '' + self.minQuater;
						startMM = self.maxQuater == 1 ? 2 : 1;
						self.startDate = maxQuater == 1 ? self.minYear - 1 + '' + startMM : self.minYear + '' + startMM;
						self.param.year = self.maxYearQuater;
						text = maxYear + '.' + maxQuater + 'H';
						break;
					case '3' : 
						self.maxYear = maxYear;
						self.maxQuater = maxQuater;
						self.maxYearQuater = self.maxYear + '' + self.maxQuater; 
						self.diffYear = 1;
						self.minYear = self.maxYear - self.diffYear;
						self.minQuater = self.maxQuater;
						self.minYearQuater = self.minYear + '' + self.minQuater;
						startMM = self.minYearQuater.substr(4,1) == '1' ? 4 : parseInt(self.minYearQuater.substr(4,1)) - 1;
						self.startDate = self.minYearQuater.substr(4,1) == '1' ? parseInt(self.minYearQuater.substring(0,4)) - 1 + '' + startMM : self.minYearQuater.substring(0,4) + startMM;
						self.param.year = self.maxYearQuater;
						text = maxYear + '.' + maxQuater + 'Q';
						break;
					}
				
					
					if (self.param.isBizdist) {
						self.$wrapper.find('[data-sgg-nm]').text('');
						self.$wrapper.find('[data-dong-nm]').text(param.bizdistnm);
					} else {
						self.$wrapper.find('[data-sgg-nm]').text(param.sggnm);
						self.$wrapper.find('[data-dong-nm]').text(param.dongnm);						
					}
					
					self.$wrapper.find('[data-last-year]').text(text);
					
					self.loadData().done(function(resp) {
						self.loadAxis();
						self.updateData();
						
						self.param.isClick = false;
						chartaverageTradingSanggaType.init(self.param, self.searchDtl);
					
					});
				}
			});

		},
		
		// input, form 변경 시 수정사항 정리영역
		// 검색 조건 바뀔 때 + 업데이트 전 파라메터 정리 필요하면 여기에서 실행
		setBtnListener: function() {
			var self = this;
			
			self.$wrapper.find('.clickYears').children('span').removeClass('on');
			self.$wrapper.find('.clickYears').children('span').off('click').on('click', function(){
				var $this = $(this),
					$list = $(this).siblings('span').removeClass('on');
					
				$this.addClass('on');
				self.loadNextObj(self.xAxisArr[parseInt($this.attr('data-idx'))]);
			})			
		},
	
		loadNextObj: function(year) {
			var self = this,
				$chart = $(self.apexChart);
			self.param.isClick = true;
			if(self.period == '1') {					
				self.param.endYYYY = year;
			} else {
				self.param.endYYYY = year.substring(0,4);
				self.param.endMM = year.length > 6 ? year.substr(5,1) : year.substr(4,1);
			}
			chartaverageTradingSanggaType.init(self.param, self.searchDtl);
		},
		
		// x,y 라벨에 버튼 추가 api 가 없어서 배경 객체를 추가하는 방식 
		addAxisBackground: function(year) {
			var self = this,
				$chart = $(self.apexChart);

			if (! year && self.param && self.param.endYYYY) {
				year = self.param.endYYYY;
				if(self.period != '1') {
					mm = self.param.endMM;
				}
			}
			// 선택된 라벨 css class 수정
			$chart.find('.apexcharts-xaxis-label').removeClass('xaxis-selected');

			if (year) {
				$chart.find('.apexcharts-xaxis-label:contains("' + year + '")').addClass('xaxis-selected');
				if( self.period != '1' ) {
					$chart.find('.apexcharts-xaxis-label:contains("' + year + mm + '")').addClass('xaxis-selected');
				}
			}
			
			$chart.find('.apexcharts-xaxis-label').each(function(idx, elm) {
				var $elm = $(elm),
					x = $elm.attr('x'),
					y = $elm.attr('y');

				// attr 없으면 생성 패스
				if (! x) {
					return false;
				}
				
				var $rect = $(document.createElementNS('http://www.w3.org/2000/svg', 'rect'));
				
				$rect.attr({
					fill: $elm.hasClass('xaxis-selected') ? '#FF3E4B' : '#FFFFFF',
					x: parseFloat(x) - 30,
					y: parseFloat(y) - 20,
					width: 60,
					height: 30,
					rx: 10,
					ry: 10,
					class: 'btn-xaxis',
					style: 'cursor: pointer; stroke: #A9A9A9; stroke-width: 2;'
				});

				$rect.insertBefore($elm);
				
				$elm.css('cursor', 'pointer');
			});
		},
		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
				selectNm = (self.param.isBizdist ? '평균매매가상권5건추이차트' : (self.param.sidonm == '전국' ? '평균매매가전국5건추이차트' : '평균매매가시도5건추이차트')),
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					pnu2: '',
					startDate: self.startDate, 
					jusoCd : self.param.jusoCd,
					period : self.period,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' 
				};
			
			param.sanggaArr = self.sanggaArr;
		
			// 층유형 설정했는지 배열로 보내기
			if (self.isCustomFloor) {
				param.floorArr = self.floorArr;
			}
			// 면적유형 설정했는지 배열로 보내기
			if (self.isCustomArea) {
				param.areaArr = self.areaArr.toString();
				param.areaNm = self.areaNm;
			}

			switch(param.jusoCd) {
				case 'sgg': 
					param.pnu2 = param.pnu.substring(0,2); 
				break;
				case 'emd': 
					param.pnu = param.pnu.substring(0,8);
					param.pnu2 = param.pnu.substring(0,5);
				break;
			}
			
			return z.xAsync('averageTrading', selectNm, 'select', param, 'json').done(function(resp) {
				if (! self.param.isBizdist) {
					self.rawDataArr = [];
					for (var i in resp) {
						// 전국 데이터 작업
						if(self.param.sidonm == '전국') {
							self.rawDataArr.push(resp[i]);
						} else {
							if(resp[i].cd == self.param.dongCd) {
								self.rawDataArr.push(resp[i]);
							}
						}
					}
				} else {
					self.rawDataArr = resp;
				}
			});
			
		},
		
		loadCondition: function() {
		},
		loadAxis: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				sanggaMap = self.sanggaMap,
				xAxisArr = [],
				yAxisObj = {
					title: {
						text: ''
					},
					labels: {
						formatter: function(value) {
							value =  z.toComma(Math.round(value * 100) / 100);
							return value;
						}
					}
				};
				
			switch (self.period) {
				case '1': 
					for (var i = 0; self.diffYear > i; ++i) {
						xAxisArr.push('' + (self.minYear + i));
					}
				break;
				case '2': 
					var minYearInt = self.minYear,
						minQuater = self.minQuater;
					for( var j = 0; j < 3; j++ ){
						for( var i = 1; i <= 2; i++ ){
							if( j == 0 && i < minQuater) continue;
							if( j == 2 && i > minQuater + (self.maxQuater=='1'?0:1)) continue;
							xAxisArr.push('' + (minYearInt + j + '.' + i + 'H'));
						}
					}
				break;
				case '3': 
					var minYearInt = self.minYear,
						minQuater = self.minQuater;
					for( var j = 0; j < 2; j++ ){
						for( var i = 1; i <= 4; i++ ){
							if( j == 0 && i < minQuater) continue;
							if( j == 1 && i > self.maxQuater) continue;
							xAxisArr.push('' + (minYearInt + j + '.' + i + 'Q'));
						}
					}
				break;
			}
		
			// 정렬: 상가종류, 분양연도 오름차순
			// 연도 - 1년 기간, 년도 - 10년 기간
			rawDataArr = rawDataArr.sort(function(a, b) {
				var aType = sanggaMap[a['상가유형']],
					bType = sanggaMap[b['상가유형']];
					
				if (aType < bType) {
					return -1;
				}
				if (aType > bType) {
					return 1;
				}
				if (a['입주연도'] < b['입주연도']) {
					return -1;
				}
				if (a['입주연도'] > b['입주연도']) {
					return 1;
				}
				return 0;
			});
			// 엑셀 저장용 정보로도 활용될 예정
			self.xAxisArr = xAxisArr;
			self.yAxisObj = yAxisObj;
		},

		// 데이터 정제 후에 updateOptions, updateSeries 호출
		updateData: function() {
			var self = this,
				chartOptions = {
					xaxis: {
						categories: self.xAxisArr
					},
					yaxis: self.yAxisObj
				},
				chartSeries = [];

			self.updateDataByYear(chartOptions, chartSeries);

			// 엑셀 저장용 정보로도 활용될 예정
//				self.yAxisArr = chartSeries;

			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);	
			self.$wrapper.find('.clickYears').children('span').last().click();
		},
		
		updateDataByYear: function(chartOptions, chartSeries) {
			var self = this,
				sanggaMap = self.sanggaMap,
				prevData,
				columnNm = self.searchDtl.radioResultArea,
				copyChartSeries = [],
				idx = 0;
	
			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));

			for (var i in self.sanggaArr) {
				prevData = {
					name: self.sanggaArr[i],
					data: []
				};
				
				chartSeries.push(prevData);
				for (var j = 0;	 5 > j; ++j) {
					prevData.data.push(0);
				}
			}
			
			for (var i in rawDataArr) {
				var raw = rawDataArr[i],
					idxData = sanggaMap[raw['상가유형']],
					rawPeriod = raw['period'];
				
				if (isNaN(idxData) || idxData == 'undefined') {
					continue;
				}
	
				switch (self.period) {
					case '1': 
						var idxYear = parseInt(rawPeriod) - self.minYear;
						if (idxYear < self.diffYear) {
							chartSeries[idxData].data[idxYear] += parseFloat(raw[columnNm]);
						}
					break;
					case '2': 
						if(parseInt(rawPeriod) > parseInt(self.maxYearQuater)) continue;
						if(parseInt(rawPeriod) >= parseInt(self.minYearQuater)) {
							if (rawPeriod.substring(0,4) == self.minYear) {
								idx = 1;
								if(parseInt(rawPeriod) == parseInt(self.minYearQuater)){
									idx = 0;
								} 
							} else if (parseInt(rawPeriod.substring(0,4)) > self.minYear) {
								idx = (parseInt(rawPeriod.substring(0,4)) - self.minYear) * 2 + parseInt(rawPeriod.substr(4,1)) - self.minQuater;
							}
							chartSeries[idxData].data[idx] += parseFloat(raw[columnNm]);
						}
					break;
					case '3': 
						var minYear = self.maxYear - 1 ;
						if( parseInt(rawPeriod) >= parseInt(self.minYearQuater) ) {
							if(parseInt(rawPeriod) > parseInt(self.maxYearQuater)) continue;
							if (parseInt(rawPeriod.substring(0,4)) == minYear) {
								idx = parseInt(rawPeriod) - parseInt(self.minYearQuater);
							} else if (parseInt(rawPeriod.substring(0,4)) > minYear) {
								idx = (parseInt(rawPeriod.substring(0,4)) - minYear) * 4 + parseInt(rawPeriod.substr(4,1)) - self.minQuater;
							}
							chartSeries[idxData].data[idx] += parseFloat(raw[columnNm]);
						}
					break;
				}
		
			}
			
			// 합산 이후에는 모든 데이터 소수점 2자리까지 출력 // 평당인지 아닌지에 따라서                      
			for (var i in chartSeries) {
				var series = chartSeries[i];
				
				for (var j in series.data) {
					// 환산임대료 계산
					if (self.searchDtl.radioPriceUnit === 'py') {
						series.data[j] *= zo.py2m;
					}
					series.data[j] = Math.round(series.data[j]);
				}
			}
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = self.xAxisArr,
				yAxisArr = self.yAxisArr,
				excelData = [],
				excelOpt = {header: ['업종분포']};
			return result;
		}
	};	
	
	// 상가 유형별 평균 임대료 차트 
	var chartaverageTradingSanggaType = {
	
		init: function(param, searchDtl) {
			var self = this,
				apexChart = '#chart_3_1'; 
			
			self.tableSelector = '#table_3_1';
			self.$wrapper = $(apexChart).closest('[data-chart-wrapper]').show();
			self.param = param;
			self.searchDtl = searchDtl;
			
			// 상가유형 상권분석으로 검색하거나 상가타입 체크 했을 경우
			if (self.searchDtl && self.searchDtl.checkSanggaType.length) {
				self.isCustomSangga = true;
				self.sanggaArr = $.extend(true, [], self.searchDtl.checkSanggaType);
				self.sanggaMap = {};
				
				for (var i in self.sanggaArr) {
					self.sanggaMap[self.sanggaArr[i]] = i;
				}
			} else {
				self.isCustomSangga = false;                                                                              
				self.sanggaArr = $.extend(true, [], sanggaTypeArr);
				self.sanggaMap = $.extend(true, {}, sanggaTypeMap);
			}	
			// 층설정
			if (self.searchDtl && self.searchDtl.checkFloorBound.length) {
				self.isCustomFloor = true;
				self.floorArr = $.extend(true, [], self.searchDtl.checkFloorBound);
				self.floorMap = {};
				
				for (var i in self.floorArr) {
					self.floorMap[self.floorArr[i]] = i;
				}
			} else {
				self.isCustomFloor = false;
				self.floorArr = $.extend(true, [], floorTypeArr);
				self.floorMap = $.extend(true, {}, floorTypeMap);
			}
			// 면적유형 설정
			if (self.searchDtl && self.searchDtl.checkAreaBound.length) {
				self.isCustomArea = true;
				self.areaArr = $.extend(true, [], self.searchDtl.checkAreaBound);
				if(self.searchDtl.radioResultArea == 'rent_ua') {
					self.areaNm = 'usage_area';
				}else {
					self.areaNm = 'cont_area';
				}
			} else {
				self.isCustomArea = false;
				self.areaArr = [];
			}
			// 기간 설정
			if (self.searchDtl && self.searchDtl.radioTimeBound) {
				self.period = self.searchDtl.radioTimeBound;
			}
			// 가격기준 설정
				if (self.searchDtl && self.searchDtl.radioPriceUnit) {
					self.priceUnit = self.searchDtl.radioPriceUnit;
				}
			// 2번 차트 클릭시 변경
			if (self.param.isClick) { 
				var maxYear = parseInt(self.param.endYYYY);
				if (self.period != '1') {
					var maxQuater = parseInt(self.param.endMM);
				}
			
			} else { 
				if (self.param.year != '' && self.param.year != null) {
					switch(self.period) {
						case '1' :
							var maxYear = parseInt(self.param.year);
						break;
						case '2' : 
							var maxQuater = parseInt(self.param.year.substr(4,1)),
								maxYear = parseInt(self.param.year.substring(0,4));
						break;
						case '3' : 
							var maxQuater =  parseInt(self.param.year.substr(4,1)),
								maxYear =  parseInt(self.param.year.substring(0,4));
						break;
					}
				}
				
			}
			// 차트 초기화 퍼블리싱 코드 옮겨옴
			var options = { 
				series: [],
				chart: {
					width : '100%',
					height: 238,
					type : 'bar',
					zoom : {
						enabled : false
					},
					toolbar: {
						show: false
					}
				},
				labels : self.floorArr,
				plotOptions:{
					bar: {
						horizontal : false,
						columWidth : '80%'
					}
				},
				tooltip: {
					y: {
		                formatter: function(value) {
							return z.toComma(value) + ' ' + self.searchDtl.unitText;
						}
					}
				},
				dataLabels: {
					enabled: false
				},
				stroke : {
					width : 1,
					colors : ['#fff']
				},
				fill : {
					opacity : 1
				},
				xaxis:{
					categories : [],
				},
			    colors: ['#2985d2','#60bd85','#f4eb00','#edaa4b','#e55d81'],
			    stroke: {
			        show: true,
			        lineCap: 'butt',
			        colors: '#ffffff',
			        width: 2,
			        dashArray: 0,
			    }
			};
			if (self.chart) {
				self.chart.destroy();
			}

			var chart = new ApexCharts($(apexChart)[0], options);
			
			self.chart = chart;

			self.$wrapper.find('[data-sgg-nm]').text('');
			self.$wrapper.find('[data-dong-nm]').text('');
			self.$wrapper.find('[data-last-year]').text('');
			
			self.setBtnListener();
			chart.render().then(function() {
				chart.updateSeries([]);
				
				if (self.param) {	
					switch (self.period){
						case '1' : 
							self.diffYear = 4;
							self.maxYearInt = maxYear;
							self.minYearInt = self.maxYearInt - self.diffYear + 1;
							self.$wrapper.find('[data-sgg-nm]').text(param.sggnm);
							if (self.param.isBizdist) {
								self.$wrapper.find('[data-dong-nm]').text(param.bizdistnm);
							} else {
								self.$wrapper.find('[data-dong-nm]').text(param.dongnm);
							}
							self.$wrapper.find('[data-last-year]').text(self.maxYearInt + '년도');
						break;
						case '2' :
							self.diffYear = 1;
							self.maxYearInt = maxYear;
							self.maxQuater = maxQuater;
							self.minQuater = self.maxQuater == 1 ? 2 : 1;
							self.minYearInt = self.maxYearInt - self.diffYear;
							self.maxYearQuater = self.maxYearInt + '' + self.maxQuater;
							self.minYearQuater = self.minYearInt + '' + self.minQuater ;
							self.$wrapper.find('[data-sgg-nm]').text(param.sggnm);
							if (self.param.isBizdist) {
								self.$wrapper.find('[data-dong-nm]').text(param.bizdistnm);
							} else {
								self.$wrapper.find('[data-dong-nm]').text(param.dongnm);
							}
							self.$wrapper.find('[data-last-year]').text(self.maxYearInt + '년 ' + self.maxQuater + '반기');
						break;
						case '3' :
							self.diffYear = 3;
							self.maxYearInt = maxYear;
							self.maxQuater = maxQuater;
							self.maxYearQuater = self.maxYearInt + '' + self.maxQuater;  
							if( self.maxQuater == 1){	
								self.minYearQuater = self.maxYearInt - 1 + '2';
							} else if (self.maxQuater == 2) {
								self.minYearQuater  = self.maxYearInt - 1 + '3';
							} else if (self.maxQuater == 3) {
								self.minYearQuater = self.maxYearInt - 1 + '4';
							} else  {
								self.minYearQuater = parseInt(self.maxYearQuater) - self.diffYear + '';
							}
							self.minYearInt = parseInt(self.minYearQuater.substring(0,4));
							self.$wrapper.find('[data-sgg-nm]').text(param.sggnm);
							if (self.param.isBizdist) {
								self.$wrapper.find('[data-dong-nm]').text(param.bizdistnm);
							} else {
								self.$wrapper.find('[data-dong-nm]').text(param.dongnm);
							}
							self.$wrapper.find('[data-last-year]').text(self.maxYearInt + '년 ' + self.maxQuater + '분기');
						break;
							
					}
					
					self.loadData().done(function(resp) {
						self.loadAxis();
						self.updateData();
					});
				}
			});

		},
		
		hide: function() {
			var self = this;

			if (self.$wrapper) {
				self.$wrapper.hide();
				self.$wrapper.find(self.tableSelector).hide();
			}
		},
		
		// input, form 변경 시 수정사항 정리영역
		// 검색 조건 바뀔 때 + 업데이트 전 파라메터 정리 필요하면 여기에서 실행
		setBtnListener: function() {
		},
		
		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
				selectNm = (self.param.isBizdist ? '평균매매가상권유형별추이' : (self.param.sidonm == '전국' ? '평균매매가전국유형별추이' : '평균매매가시도유형별추이')),
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					pnu2: '',
					jusoCd: self.param.jusoCd,
					period: self.period,
					startYYYY: '' + self.minYearInt,
					endYYYY:  '' + self.maxYearInt,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' 
				};
			
			param.sanggaArr = self.sanggaArr;

			// 층유형 설정했는지 배열로 보내기
			if (self.isCustomFloor) {
				param.floorArr = self.floorArr;
			}
			
			// 면적유형 설정했는지 배열로 보내기
			if (self.isCustomArea) {
				param.areaArr = self.areaArr.toString();
				param.areaNm = self.areaNm;
			}
	
			if(self.period != '1') {
				param.startYYYY = self.minYearQuater;
				param.endYYYY = self.maxYearQuater;
			}
			
			switch (param.jusoCd) {
				case 'sgg': 
					param.pnu2 = param.pnu.substring(0,2); 
				break;
				case 'emd':
					param.pnu = param.pnu.substring(0,8);
					param.pnu2 = param.pnu.substring(0,5);
				break;
			}
			
			return z.xAsync('averageTrading', selectNm, 'select', param, 'json').done(function(resp) {
				if(! self.param.isBizdist) {
					self.rawDataArr = [];
					for (var i in resp) {
						// 전국 데이터 작업
						if(self.param.sidonm == '전국') {
							self.rawDataArr.push(resp[i]);
						} else {
							if(resp[i].cd == self.param.dongCd) {
								self.rawDataArr.push(resp[i]);
							}
						}
					}
				} else {
					self.rawDataArr = resp;
				}
			});
		},
		
		loadCondition: function() {
		},

		loadAxis: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				xAxisArr = $.extend(true, [], self.sanggaArr),
				sanggaMap = self.sanggaMap,
				floorMap = self.floorMap,
				yAxisObj = {
					title: {
						text: ''
					},
					labels: {
						formatter: function(value) {
							value =  z.toComma(Math.round(value * 100) / 100);
							return value;
						}
					}
				}; 
			// 정렬: 상가종류, 분양연도 오름차순
			// 연도 - 1년 기간, 년도 - 10년 기간
			rawDataArr = rawDataArr.sort(function(a, b) {
				var aFloorType = floorMap[a['floor']],
					bFloorType = floorMap[b['floor']];
					
				var aType = sanggaMap[a['상가유형']],
					bType = sanggaMap[b['상가유형']];
				
				if (aType < bType) {
					return -1;
				}
				if (aType > bType) {
					return 1;
				}

				if (aFloorType < bFloorType) {
					return -1;
				}
				if (aFloorType > bFloorType) {
					return 1;
				}

				return 0;
			});
			
			// 엑셀 저장용 정보로도 활용될 예정
			self.xAxisArr = xAxisArr;
			self.yAxisObj = yAxisObj;
		},

		// 데이터 정제 후에 updateOptions, updateSeries 호출
		updateData: function() {
			var self = this,
				chartOptions = {
					xaxis: {
						categories: self.xAxisArr
					},
					yaxis: self.yAxisObj
				},
				chartSeries = [];
				
			self.updateDataComparePrev();
			self.updateDataBySanggaType(chartOptions, chartSeries);
			
			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);	
		},
		
		updateDataBySanggaType: function(chartOptions, chartSeries) {
			var self = this,
				sanggaArr = self.sanggaArr,
				sanggaMap = self.sanggaMap,
				floorArr = self.floorArr,
				floorMap = self.floorMap,
				prevData,
				columnNm = self.searchDtl.radioResultArea;
			
			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));
			
			for (var i in floorArr) {
				prevData = {
					name: floorArr[i],
					data: [],
					copydata: []
				};
				chartSeries.push(prevData);
				for (var j in sanggaArr) {
					prevData.data.push(0);
					prevData.copydata.push(0);
				}
			}
			for (var i in rawDataArr) {
				var raw = rawDataArr[i],
					idxFloor = floorMap[raw['floor']],
					idxSangga = sanggaMap[raw['상가유형']];
				// 데이터 표시는 선택한(마지막) 연도 데이터만
				if (isNaN(idxFloor) || isNaN(idxSangga)) {
					continue;
				}
					
				switch (self.period) {
					case '1': 
						if(self.maxYearInt == parseInt(raw['period'])) {
							chartSeries[idxFloor].data[idxSangga] += parseFloat(raw[columnNm]);
						}
					break;
					case '2': 
						if(parseInt(self.maxYearQuater) == parseInt(raw['period'])) {
							chartSeries[idxFloor].data[idxSangga] += parseFloat(raw[columnNm]);
						} 
					break;
					case '3': 
						if(parseInt(self.maxYearQuater) == parseInt(raw['period'])) {
							chartSeries[idxFloor].data[idxSangga] += parseFloat(raw[columnNm]);
						}
					break;
				}
			}
			
			// 합산 이후에는 모든 데이터 소수점 2자리까지 출력
			for (var i in chartSeries) {
				var series = chartSeries[i];
				
				for (var j in series.data) {
					if (self.searchDtl.radioPriceUnit === 'py') {
						series.data[j] *= zo.py2m;
					}
					series.data[j] = Math.round(series.data[j]);
				}
			}
		},
		
		updateDataComparePrev: function() {
			var self = this,
				sanggaArr = self.sanggaArr,
				sanggaMap = self.sanggaMap,
				columnNm = self.searchDtl.radioResultArea;

			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));

			// 정렬: 상가종류 오름차순, 분양연도 내림차순
			rawDataArr = rawDataArr.sort(function(a, b) {
				var aType = sanggaMap[a['상가유형']],
					bType = sanggaMap[b['상가유형']];
					
				if (aType < bType) {
					return -1;
				}
				if (aType > bType) {
					return 1;
				}
				
				if (a['period'] < b['period']) {
					return -1;
				}
				if (a['period'] > b['period']) {
					return 1;
				}
	
				return 0;
			});
	
			var compResultArr = [],
				prevArr = [],
				copyCompResultArr = [],
				titleArr = ['1전대비', '2전대비', '3전대비'],
				areaNm = (columnNm == 'rent_ua' ? 'usage_area' : 'cont_area');
	
			switch (self.period) {
				case '1': 
					for (var i =0; i <= 3; i++) {
						prevArr.push(self.maxYearInt - i + '');
					}
				break;	
				case '2':
					var minQuater = (self.maxQuater== 1 ? 2 : 1);
					var minYear = (self.maxQuater == 1 ? self.maxYearInt - 2 : self.maxYearInt - 1);
					for (var j = 0; j < 2 + (self.maxQuater == 1 ? 1 : 0); j++) {
						for (var i = 1; i <=2; i++) {
							if(j == 0 && i < minQuater) continue;
							if(j == 1 + (minQuater == 1 ? 0 : 1) && i > self.maxQuater) continue;
							prevArr.push(minYear + j + '' + i);
						}
					}	
					prevArr.reverse();
				break;	
				case '3' : 
					var minQuater = (self.maxQuater == 4 ? 1 : self.maxQuater + 1);
					var minYear = (self.maxQuater == 4 ? self.maxYearInt : self.maxYearInt -1);
					for(var j = 0; j < 1 + (minQuater == 1 ? 0 : 1); j++){
						for(var i = 1; i <= 4; i++){
							if(self.maxQuater != 4 && j == 0 && i < minQuater) continue;
							if(j == 1 && i >= minQuater) continue;
							prevArr.push(minYear + j + '' + i);
						}
					}
					prevArr.reverse();
				break;
			}
	
			// 출력용 데이터 원본 생성
			for (var i in titleArr) {
				var compareObj = {
					title: titleArr[i],
					compData: [],
					compClass : [],
					icon : []
				};
				compResultArr.push(compareObj);
				for (var j = 0; j < sanggaArr.length; j++) {
					compareObj.compData.push(0);
					compareObj.compClass.push('text-success');
					compareObj.icon.push('<i class="fa fa-caret-down text-success"></i>');
				}
			}
			// 변동율을 만들기 위한 데이터
			for (var i in prevArr) {
				var copyPrevData = {
					name: prevArr[i],
					rentSum: [],
					areaSum : [],
					data: []
				};		
				copyCompResultArr.push(copyPrevData);
				for (var j = 0;	j < sanggaArr.length; j++) {
					copyPrevData.rentSum.push(0);
					copyPrevData.areaSum.push(0);
				}
			}
			for (var i in rawDataArr) {
				var raw = rawDataArr[i],
					idxYear = prevArr.indexOf(raw['period']),
					idxSangga = sanggaMap[raw['상가유형']];
				
				for(var j in prevArr) {
					if (0 > idxYear) {
						continue;
					}
					if(prevArr[j] == raw['period']) {
						copyCompResultArr[idxYear].areaSum[idxSangga] += parseFloat(raw[areaNm]);
						copyCompResultArr[idxYear].rentSum[idxSangga] += parseFloat(raw['rent']);
					}
				}
			}	
			
			for (var i in titleArr) {
				for (var j in sanggaArr) {
					var idx = Number(i) + 1;
					
					if(copyCompResultArr[0].areaSum[j] == 0) continue;
					if(copyCompResultArr[idx].areaSum[j] == 0) continue;
					compResultArr[i].compData[j] = ((parseFloat(copyCompResultArr[0].rentSum[j]) / copyCompResultArr[0].areaSum[j]) / (parseFloat(copyCompResultArr[idx].rentSum[j]) / copyCompResultArr[idx].areaSum[j]) - 1 ) * 100;
				}
			}
			
			// 비교치 % 계산
			for (var j=0; j < titleArr.length; j++) {
				for (var i =0; i < sanggaArr.length; i++) {
					if (compResultArr[j].compData[i] == 0) {
						compResultArr[j].icon[i] = '';
						if (compResultArr[j].compData[i] == 0 && copyCompResultArr[0].areaSum[i] > 0 ) {
							compResultArr[j].compClass[i] = 'text-danger';
							compResultArr[j].compData[i] = 'New';
						} else {
							compResultArr[j].compClass[i] = '';
							compResultArr[j].compData[i] = '-';
						}						
					} else {						
						compResultArr[j].compData[i] = Math.round(compResultArr[j].compData[i] );
						if(compResultArr[j].compData[i] > 0) {
							compResultArr[j].compClass[i] = 'text-danger';
							compResultArr[j].icon[i] = '<i class="fa fa-caret-up text-danger"></i>';
						}
						compResultArr[j].compData[i] = compResultArr[j].compData[i] + '%';
					}
				}
			}
			$(self.tableSelector).hide();
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = self.xAxisArr,
				yAxisArr = self.yAxisArr,
				excelData = [],
				excelOpt = {header: ['업종분포']};
			
			return result;
		}
	};
	
	// 공급 추이 상가유형 데이터
	var tableaverageTradingSanggaType = {
		init: function(param, searchDtl) {
			var self = this;
			
			self.param = param;
			self.$table = $('#table_5_1');
			self.$thead = self.$table.find('thead');
			self.$tbody = $('#tbody_5_1').html('');
			self.searchDtl = searchDtl;
			self.startYMD = null;
			self.endYMD = null;
			
			// 상가유형 체크시
			if (self.searchDtl && self.searchDtl.checkSanggaType.length) {
				self.isCustomSangga = true;
				self.sanggaArr = $.extend(true, [], self.searchDtl.checkSanggaType);
			} else {
				self.isCustomSangga = false;
				self.sanggaArr = $.extend(true, [], sanggaTypeArr);
			}
			
			self.floorArr = $.extend(true, [], floorTypeArr);
			self.floorTypeMap = $.extend(true, {}, floorTypeMap); 
			self.isCustomFloor = false;
			// 층유형 체크시
			if (self.searchDtl && self.searchDtl.checkFloorBound.length) {
				self.isCustomFloor = true;
				self.floorArr = $.extend(true, [], self.searchDtl.checkFloorBound);
				self.floorMap = {};
				for (var i in self.floorArr) {
					self.floorMap[self.floorArr[i]] = i;
				}
			}
			// 면적유형 설정
			if (self.searchDtl && self.searchDtl.checkAreaBound.length) {
				self.isCustomArea = true;
				self.areaArr = $.extend(true, [], self.searchDtl.checkAreaBound);
				
			} else {
				self.isCustomArea = false;
				self.areaArr = [];
			}
			
			if(self.searchDtl && self.searchDtl.radioResultArea == 'rent_ua') {
				self.areaNm = 'usage_area';
			} else {
				self.areaNm = 'cont_area';
			}
			
			// 기간 설정
			if (self.searchDtl && self.searchDtl.radioTimeBound) {
				self.period = self.searchDtl.radioTimeBound;
			}
			
			// 결과유형 설정
			if (self.searchDtl && self.searchDtl.radioResultColumn) {
				self.resultNm = self.searchDtl.radioResultColumn;
			}
			
			// 초기값 설정
			self.maxYearInt = moment().year();
			
			// 사용자설정에서 시작일 설정했을 때
			if (self.searchDtl && self.searchDtl.pastYMD) {
				self.startDate = self.searchDtl.pastYMD;
				//선택시 반기 일때 반기, 분기일때 분기, 연간일때 연간 x 
				switch (self.period) {
					case '1':
						self.minYearPeriod = self.startDate.substring(0,4);
						self.startDate = parseInt(self.startDate.substring(0,4)) - 1 + '';
						self.maxYearPeriod = self.maxYearInt + ''; 
					break;
					case '2': 
						var startYear = parseInt(self.startDate.substring(0,4));
							startMonth = Math.ceil(parseInt(self.startDate.substr(4,2)) / 6) + '';
						self.minYearPeriod = startYear + startMonth; 
						var minYear = (startMonth == '1' ? startYear - 1 : startYear),
							minMonth = (startMonth == '1' ? '2' : '1');
						self.startDate = minYear + '' + minMonth;
						self.maxYearPeriod = self.maxYearInt + '' + Math.ceil((moment().month() + 1) / 6); 
					break;
					case '3': 
						var startYear = self.startDate.substring(0,4),
							startMonth = Math.ceil( parseInt(self.startDate.substr(4,2)) / 3) + '';
						self.minYearPeriod = startYear + startMonth;
						var minYear = (startMonth == '1' ? parseInt(startYear) - 1 : startYear),
							minMonth = (startMonth == '1' ? 4 : parseInt(startMonth) - 1);
						self.startDate = minYear + '' + minMonth;
						self.maxYearPeriod = self.maxYearInt + '' + Math.ceil((moment().month() + 1) / 3); 
					break;	
				}
				
				self.minYearCopyPeriod = self.startDate;
				
			}
			// 동 이름 목록 로딩
			self.dongArr = [];
			self.sidoArr = [];
			self.isSgg = (! param) || ('emd' !== param.jusoCd  && ! param.sggnm) ;	// 파람이 없거나, 주소코드가 읍면동이 아닐때 
			
			// 상권검색할때
			if (param && param.isBizdist) {	
				self.isSgg = false; 
			}
			// 시군구에서 버튼클릭시
			var dongArr = apiSearchEmd.getDongArr();
			var sidoArr = apiSearchEmd.getSidoArr();	// 전국 데이터 작업
			// 읍면동에서 버튼 클릭시
			if (self.isSgg) {
				dongArr = apiSearchEmd.getSggArr();
			} else if (param && param.isBizdist) {
				dongArr = apiSearchEmd.getBizdistArr();
			}

			for (var i in dongArr) { // self.dongArr에 밀어 넣기
				self.dongArr.push(self.isSgg ? dongArr[i].sggnm : dongArr[i].dongnm);
			}

			// 전국 데이터 작업
			for(var i in sidoArr) {
				// 공급추이차트 데이터와 맞추기 위해 [전국]은 제외
				if(sidoArr[i].sidonm.substring(0, 2) != '전국') {
					self.sidoArr.push(sidoArr[i].sidonm);
				}
			}
			
			self.setBtnListener();
			self.loadData().done( function(resp) {
				self.updateDataByFloorType();
				self.updateData();
			});
			
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {
			var self=this;
			self.$tbody = $('#tbody_5_1').html('');
			self.$wrapper = self.$tbody.closest('[data-table-wrapper]');
			
			self.$wrapper.find('.allView2').off('click').on('click', function() {
				setTimeout(function() {
					KTApp.blockPage({message: '잠시 기다려 주십시오'});
				}, 0);	
				tableaverageTradingDetail.openAllView();
				setTimeout(function() {
					KTApp.unblockPage();
				}, 1000);
			});
		},

		loadData: function() {
			var self = this,
				jusoCd = self.param.jusoCd,
				selectNm = (self.param.isBizdist ? '평균매매가상권유형별추이' : (self.param.sidonm == '전국' ? '평균매매가전국유형별추이' : '평균매매가시도유형별추이')),
				pnu = self.param.isBizdist ? '' : self.param.dongCd,
				pnu2 = '';
				
			if (jusoCd == 'sgg' && ! self.isBizdist) {
				pnu2 = pnu.substring(0, 2);
			} else if (jusoCd == 'emd' && ! self.isBizdist) {
				pnu = pnu.substring(0, 8);
				pnu2 = pnu.substring(0, 5);
			}
			
			var	param = {
					pnu: pnu,
					pnu2: pnu2,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					jusoCd : jusoCd,
					startYYYY: self.minYearCopyPeriod,
					endYYYY: self.maxYearPeriod,
					period : self.period,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' 
				}; 
			
			// 상가 설정했는지 배열로 보내기
			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;
			}
			
			// 층유형 설정했는지 배열로 보내기
			if (self.isCustomFloor) {
				param.floorArr = self.floorArr;
			}
			// 면적유형 설정했는지 배열로 보내기
			if (self.isCustomArea) {
				param.areaArr = self.areaArr.toString();
				param.areaNm = self.areaNm;
			}
			
			return z.xAsync('averageTrading', selectNm, 'select', param, 'json').done(function(resp) {
				var rawDataArr = self.rawDataArr = resp,
					dongColumnNm =  self.isSgg ? 'sggnm': 'dongnm';
				// 정렬: 기간 오름차순
				rawDataArr = rawDataArr.sort(function(a, b) {
					if (a[dongColumnNm] < b[dongColumnNm]) {
						return -1;
					}
					if (a[dongColumnNm] > b[dongColumnNm]) {
						return 1;
					}
					if (a["period"] < b["period"]) {
						return -1;
					}
					if (a["period"] > b["period"]) {
						return 1;
					}
					return 0;
				});
				
			});
		},
  
		updateDataByFloorType: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				dongArr = (self.param.sidonm == '전국' ? self.sidoArr : self.dongArr),
				sanggaTypeArr = self.sanggaArr,
				floorTypeArr = self.floorArr,
				isSgg = self.isSgg,
				isBizdist = self.param.isBizdist,
				resultArr = [],
				areaNm = self.areaNm,
				minYear = 0,
				minMonth = 0,
				maxMonth = 0,
				maxYear = moment().year(),
				minCopyYear, minCopyMonth;
			
			
			if(self.searchDtl && self.searchDtl.isStartDate){ // 시작일이 DB보다 큰경우 시작일로 변경
				switch(self.period){
					case '1': //년
						minYear = parseInt(self.minYearPeriod);
						minCopyYear = minYear - 1;
						minCopyMonth = (rawDataArr.length < 1? '0': parseInt(rawDataArr[0]['period'].substr(4, 1)));
					break;
					case '2': //반기
						minYear = parseInt(self.minYearPeriod.substr(0,4));
						minMonth = parseInt(self.minYearPeriod.substr(4,1));
						minCopyMonth = (minMonth == 1) ? 2 : 1;
						minCopyYear = (minMonth == 1) ? minYear - 1 : minYear; 
						maxMonth = Math.ceil((moment().month() + 1) / 6);
					break;
					case '3': //분기
						minYear = parseInt(self.minYearPeriod.substr(0,4));
						minMonth = parseInt(self.minYearPeriod.substr(4,1));
						minCopyMonth = minMonth == 1 ? 4 : minMonth - 1;
						minCopyYear = minCopyMonth == 4 ? minYear - 1 : minYear; 
						maxMonth = Math.ceil((moment().month() + 1) / 3);
					break;
				}				
			}
			
			self.minYear = minYear;
			self.minMonth = minMonth;
			self.maxYear = maxYear;
			self.maxMonth = maxMonth;
			
			switch(self.period){
				case '1': //년도
					self.diffPeriod = maxYear - minYear + 1;
				break;
				case '2': //반기 
					self.diffPeriod = ((maxYear - minYear ) * 2) + (maxMonth - minMonth) + 1;
					break;
				case '3': //분기
					self.diffPeriod = ((maxYear - minYear ) * 4) + (maxMonth - minMonth) + 1;
				break;
			}
			
			var	row = {
					dongnm: isBizdist ? self.param.bizdistnm : (isSgg ? self.param.sidonm : self.param.sggnm),
					sanggaData : []
			};
			
			// 1. 동 + 상가유형 별 데이터 생성
			if (!isBizdist) {
				for (var i in dongArr) {
					var dongData = $.extend(true, {}, row);
		
					dongData.dongnm = dongArr[i];
					// 상가유형 + 층별 데이터 생성
					for (var j in sanggaTypeArr) {		
						dongData.sanggaData.push({
							sanggaType: sanggaTypeArr[j],
							data: Array.apply(null, Array(floorTypeArr.length)).map(function() { // 데이터 가로
								return Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;}); // 데이터 세로
								
							}),
							areaData: Array.apply(null, Array(floorTypeArr.length)).map(function() { // 데이터 가로
								return Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;}); // 데이터 세로
								
							}),
							rentData: Array.apply(null, Array(floorTypeArr.length)).map(function() { // 데이터 가로
								return Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;}); // 데이터 세로
								
							}),
							
							copyAreaData: Array.apply(null, Array(floorTypeArr.length)).map(function() { // 데이터 가로
								return Array.apply(null, Array(self.diffPeriod + 1)).map(function() {return 0;}); // 데이터 세로
							}),
							copyRentData: Array.apply(null, Array(floorTypeArr.length)).map(function() { // 데이터 가로
								return Array.apply(null, Array(self.diffPeriod + 1)).map(function() {return 0;}); // 데이터 세로
							}),
							copydata: Array.apply(null, Array(floorTypeArr.length)).map(function() { // 데이터 가로
								return Array.apply(null, Array(self.diffPeriod + 1)).map(function() {return 0;}); // 데이터 세로
							})
						});
					
					}
					resultArr.push(dongData);
				}			
			}
			
			// 맨 처음 줄에 시도/시군구 데이터 생성
			var sumRow = $.extend(true, {}, row);
		
			for (var j in sanggaTypeArr) {		
				sumRow.sanggaData.push({
					sanggaType: sanggaTypeArr[j],
					data: Array.apply(null, Array(floorTypeArr.length)).map(function() { // 데이터 가로
						return Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;}); // 데이터 세로
					}),
					areaData: Array.apply(null, Array(floorTypeArr.length)).map(function() { // 데이터 가로
						return Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;}); // 데이터 세로
					}),
					rentData: Array.apply(null, Array(floorTypeArr.length)).map(function() { // 데이터 가로
						return Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;}); // 데이터 세로
					}),
					
					copydata: Array.apply(null, Array(floorTypeArr.length)).map(function() { // 데이터 가로
						return Array.apply(null, Array(self.diffPeriod + 1)).map(function() {return 0;}); // 데이터 세로 
					}),
					copyAreaData: Array.apply(null, Array(floorTypeArr.length)).map(function() { // 데이터 가로
						return Array.apply(null, Array(self.diffPeriod + 1)).map(function() {return 0;}); // 데이터 세로 
					}),
					copyRentData: Array.apply(null, Array(floorTypeArr.length)).map(function() { // 데이터 가로
						return Array.apply(null, Array(self.diffPeriod + 1)).map(function() {return 0;}); // 데이터 세로 
					})
				});
			}
			resultArr.unshift(sumRow);
			dongArr.unshift(isSgg ? self.param.sidonm : self.param.sggnm);
			// 2. 1번 형식대로 데이터 입력
			for (var i in rawDataArr) {

				var rawData = rawDataArr[i],
					idxDong = self.param.sidonm == '전국' ? dongArr.indexOf(rawData.dongnm) : (isBizdist ? 0 : dongArr.indexOf(rawData.dongnm)),
					idxSangga = sanggaTypeArr.indexOf(rawData['상가유형']),
					idxFloor = floorTypeArr.indexOf(rawData['floor']);
			
				var dongData = resultArr[idxDong];
				if (0 > idxDong || 0 > idxFloor || 0 > idxSangga) continue;
				switch (self.period) {
					case '1' :
						var idxPeriod = parseInt(rawData['period']) - minYear;
					break;
					case '2' : 
						var idxPeriod = ((parseInt(rawData['period'].substr(0,4)) - minYear) * 2) + (parseInt(rawData['period'].substr(4,1)) - minMonth);
					break;	
					case '3' :
						var idxPeriod = ((parseInt(rawData['period'].substr(0,4)) - minYear) * 4) + (parseInt(rawData['period'].substr(4,1)) - minMonth);
					break;
				}
				
				dongData.sanggaData[idxSangga].areaData[idxFloor][idxPeriod] += parseFloat(rawData[areaNm]);
				dongData.sanggaData[idxSangga].rentData[idxFloor][idxPeriod] += parseFloat(rawData['deal']);
				dongData.sanggaData[idxSangga].data[idxFloor][idxPeriod] += parseFloat(rawData[areaNm]) == 0 ? 0 : parseFloat(rawData['deal']) / parseFloat(rawData[areaNm]);
			}
			
			// 3. 각 줄에 대한 합산을 마지막 줄에 추가
			for (var i in resultArr) {
				var sanggaData = resultArr[i].sanggaData;
				for( var j in sanggaData ) { 
					var areaRow = sanggaData[j].areaData,
						rentRow = sanggaData[j].rentData,
						rentAvg = Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;}),
						rentSum = Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;}),
						areaSum = Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;});
						// 층별 합계
						for (var k in areaRow) { 
							var areaSumRow = areaRow[k],
								rentSumRow = rentRow[k];
							
							for ( var h in areaSumRow ) {
								areaSum[h] += parseFloat(areaSumRow[h]);
								rentSum[h] += parseFloat(rentSumRow[h]);
							}
						}
						
						resultArr[i].sanggaData[j].sanggarentSum = rentSum;
						resultArr[i].sanggaData[j].sanggaareaSum = areaSum;
						
						for (var k in resultArr[i].sanggaData[j].sanggaareaSum){
							if(parseFloat(resultArr[i].sanggaData[j].sanggaareaSum[k]) == 0){
								rentAvg[k] = 0;
							} else {
								rentAvg[k] = parseFloat(parseFloat(resultArr[i].sanggaData[j].sanggarentSum[k]) / parseFloat(resultArr[i].sanggaData[j].sanggaareaSum[k]));
							}						
						}
						resultArr[i].sanggaData[j].sanggaAVG = rentAvg;
				}	
			}
			
			
			for (var i in resultArr) {
				var dongData = resultArr[i].dongnm,
					sanggaData = resultArr[i].sanggaData,
					rentAvg = Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;}),
		            rentSum = Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;});
					areaSum = Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;});
					
				for (var j in sanggaData) {			
					var totalAreaSum = sanggaData[j].sanggaareaSum,
						totalRentSum = sanggaData[j].sanggarentSum;
					
				    for (var k in totalAreaSum) {
				    	rentSum[k] += parseFloat(totalRentSum[k]);
				    	areaSum[k] += parseFloat(totalAreaSum[k]);
					}
					
					resultArr[i].totalRentSum = rentSum;
					resultArr[i].totalAreaSum = areaSum;
				
					for (var k in resultArr[i].totalAreaSum) {
			            if(parseFloat(resultArr[i].totalAreaSum[k]) == 0){
			                rentAvg[k] = 0;
			            } else {
			            	rentAvg[k] = parseFloat(parseFloat(resultArr[i].totalRentSum[k]) / parseFloat(resultArr[i].totalAreaSum[k]));
			            }
			        }					
					resultArr[i].totalAVG = rentAvg;
				}
			} 
			// 5. 최종 결과 소수점 반올림 후 3자리 콤마
			// 각각의 데이터
			for (var i in resultArr) {
				var sanggaData = resultArr[i].sanggaData;
				for (var j in sanggaData) {
					var data = sanggaData[j].data;
					
					for (var l in data) {
						for (var k in data[l]) {
							if (data[l][k]  == 0) {
								// 0 이면 - 로 치환
								data[l][k] = '-';
							} else {
								if (self.searchDtl.radioPriceUnit === 'py') {
									data[l][k] *= zo.py2m;
								}
								data[l][k] = z.toComma(Math.round(data[l][k]));
							}
						}
					}
				}	
			}
			// 상가별 총 평균
			for (var i in resultArr) {
				var sanggaData = resultArr[i].sanggaData;
				for (var j in sanggaData) {
					var sanggaAVG = sanggaData[j].sanggaAVG;
					for (var l in sanggaAVG) {
						if (sanggaAVG[l]  == 0 ) {
							sanggaAVG[l] = '-';
						} else {
							if (self.searchDtl.radioPriceUnit === 'py') {
								sanggaAVG[l] *= zo.py2m;
							}
							sanggaAVG[l] = z.toComma(Math.round(sanggaAVG[l]));
						}
					}	
				}
			}
			
			// 지역별 총평균
			for (var i in resultArr) {
				var totalAVG = resultArr[i].totalAVG;
				for (var j in totalAVG) {
					if (totalAVG[j] == 0) {
						// 0 이면 - 로 치환
						totalAVG[j] = '-';
					} else {
						if (self.searchDtl.radioPriceUnit === 'py') {
							totalAVG[j] *= zo.py2m;
						}
						totalAVG[j] = z.toComma(Math.round(totalAVG[j]));
					}
				}	
			}
			// 6. 전체선택이 아닌 경우, 선택된 시군구 or 읍면동의 데이터만 표시되도록 수정됨
			// 총합 때문에 합산 끝내놓고 정리
			var selectedDongNm = self.param.dongnm;
			
			if ('전체' !== selectedDongNm) {
				for (var i = 1, len = resultArr.length; len > i; ++i) {
					if (selectedDongNm !== resultArr[i].dongnm) {
						resultArr.splice(i--, 1);
						len--;
					}
				}
			}
			self.resultArr = resultArr;
		},	
		updateData: function() {
			var self = this,
				tmpl = Handlebars.compile($('#tmplTableaverageTradingSanggaType').html()),
				$tr = self.$thead.find('tr:first-child'),
				floorTypeArr = $.extend([], true, self.floorArr),
				classNameArr = Array.apply(null, Array(self.floorArr.length - 1)).map(function() {return '';}),
				sanggaTypeArr = $.extend([], true, self.sanggaArr);
			$tr.find('th[rowspan="1"]:not("[data-dont-delete]")').remove();
			
			classNameArr.push('tr-border');

			switch (self.period) {
				case '1': 
					for (var i = 0; self.diffPeriod > i; ++i) {
						var $th = $('<th/>', {rowspan: '1', text: (parseInt(self.minYear) + i)});
						$tr.append($th);
					}	
				break;	
				case '2':
					for(var j = 0; j <= self.diffPeriod / 2; ++j){
						for(var i = 1; i <= 2; i++){
							if(j == 0 && i < self.minMonth) continue;
							if(j == Math.floor(self.diffPeriod / 2) && i > self.maxMonth) continue;
							if(self.diffPeriod == 12 && j >= self.diffPeriod /2 && self.maxMonth == 2) continue;
							var $th = $('<th/>', {rowspan: '1', text: (parseInt(self.minYear) + j + '.' + i + 'H')});
							$tr.append($th);
						}
					}
				break;	
				case '3' :
					for(var j = 0; j <= self.diffPeriod / 4; j++){
						for(var i = 1; i <= 4; i++ ){
							if(j == 0 && i < self.minMonth) continue;
							if(j == Math.floor(self.diffPeriod / 4) && i > self.maxMonth) continue;
							if( self.maxMonth == 4 && j == Math.floor(self.diffPeriod / 4)) continue; //4분기인경우 3년만 가져와야함!
							var $th = $('<th/>', {rowspan: '1', text: (parseInt(self.minYear) + j + '.' + i + 'Q')});
							$tr.append($th);
						}
					}
				break;
			}

			self.$tbody.html('').append(tmpl({sanggaTypeArr: sanggaTypeArr, 
											  floorTypeArr: floorTypeArr,
											  dongRowSpan: ((sanggaTypeArr.length) * (floorTypeArr.length + 1)) + 1,
											  dataArr: self.resultArr, 
											  sanggaSapn: (floorTypeArr.length + 1),
											  classNameArr: classNameArr}));
			
			$('[data-search-result-text]').text('상가유형별 평균 매매가');
			$('#tbody_5_1 .maintotal').click();
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			setTimeout(function() {
				var $table = self.$tbody.closest('table');
				var wsBody = XLSX.utils.table_to_sheet($table[0]);
				var jsonBody = XLSX.utils.sheet_to_json(wsBody, {header: 1});
				
				jsonBody[0][1] = '구분';

				var jsonMerge = jsonBody;				
				
				var mainlen = jsonBody[0].length;
				var sublen  = mainlen - 1;				
				var area = '';
				var sangga = '';
				for (var i in jsonBody) {
					var row = jsonBody[i];
					
					if(mainlen === row.length){
						area = row[0];
					}
					
					if(sublen === row.length){
						sangga = row[0];
					}
					
					if(mainlen > row.length ){
						if(sublen == row.length){
							row.unshift(area);
						} else {
							row.unshift(sangga);
							row.unshift(area);
						}
					} 
				}
								
				var wsJson = [];
				for (var i in jsonBody) {
					var row = jsonBody[i];
					
					if (row.length > 0) {
						wsJson.push(row)
					} 
				}
				
				var ws = XLSX.utils.json_to_sheet(wsJson, {skipHeader: true});	

				result.resolve(ws);
				apiSearchEmd.addDownloadLog('추이');
			});

			return result;
		}
	};	
	
	// 평균 분양가 추이 상세 데이터
	var tableaverageTradingDetail = {
		init: function(param, searchDtl) {
			var self = this;
			
			self.param = param;
			self.searchDtl = searchDtl;
			self.$tbody = $('#rowDataTable').html('');
			self.$wrapper = self.$tbody.closest('[data-table-wrapper]');
			self.columnMode = 'sangga';
			self.startYMD = null;
			self.endYMD = null;
			
			if (self.searchDtl && self.searchDtl.checkSanggaType.length) {
				self.isCustomSangga = true;
				self.sanggaArr = $.extend(true, [], self.searchDtl.checkSanggaType);
			} else {
				self.isCustomSangga = false;
				self.sanggaArr = $.extend(true, [], sanggaTypeArr);
			}
			
			if (self.searchDtl && self.searchDtl.checkFloorBound.length) {
				self.isCustomFloor = true;
				self.floorArr = $.extend(true, [], self.searchDtl.checkFloorBound);
			} else {
				self.isCustomFloor = false;
				self.floorArr = $.extend(true, [], floorTypeArr);
			}
			
			if (self.searchDtl && (self.searchDtl.radioPriceUnit == "" || self.searchDtl.radioPriceUnit == 'py')) {
				self.isPy = self.searchDtl.radioPriceUnit;
			}
			
			if (self.searchDtl && self.searchDtl.checkAreaBound.length) {
				self.isCustomArea = true;
				self.areaArr = $.extend(true, [], self.searchDtl.checkAreaBound);
				self.areaMap = {};
				
				for (var i in self.areaArr) {
					self.areaMap[self.areaArr[i]] = parseInt(i);
				}
				
			} else {
				self.isCustomArea = false;
				self.areaArr = $.extend(true, [], areaTypeArr);
			}
			
			if (self.searchDtl && self.searchDtl.radioTimeBound) {
				self.period = self.searchDtl.radioTimeBound;
			} else {
				self.period = '4'
			}
			
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				//self.updateData();
			});
		},
		
		setBtnListener: function() {
		},
		
		loadData: function() {
			var self = this,
				startYMD = moment(self.startYMD),
				endYMD,
				xAxisArr = [],
				xAxisPeriod = [],
				diffPeriod = 0,				
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					period: self.period,
					startYMD: self.startYMD,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' ,
					period: self.period == 'custom' ? '4' : self.period
				};
			
			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;
			}	
			
			if (self.isCustomFloor) {
				param.floorArr = self.floorArr;				
			}
				
			if (self.isCustomArea) {
				param.areaArr = self.areaArr;				
			}
			
			// 상세 데이터는 한단계 위의 전체데이터 표시
			// ex: 읍면동 선택 > 시군구 목록, 시군구 선택 > 시도 목록
			switch (parseInt(self.period)) {
				case 1:
					endYMD = moment().endOf('year');
					diffPeriod = endYMD.diff(startYMD, 'years') + 1;
					
					var tmp = startYMD.clone();
					for (var i = 0; diffPeriod > i; ++i) {
						xAxisArr.push(tmp.format('YYYY'));
						xAxisPeriod.push(tmp.format('YYYY'));
						tmp.add(1, 'year');
					}
					break;
				case 2:
					endYMD = moment();
					
					if (6 > endYMD.get('month')) {
						endYMD.set('month', 5).endOf('month');
					} else {
						endYMD = endYMD.endOf('year');
					}
					
					diffPeriod = Math.floor(endYMD.diff(startYMD, 'quarters') / 2) + 1;
	
					var tmp = startYMD.clone();
					for (var i = 0; diffPeriod > i; ++i) {
						xAxisArr.push(tmp.format('YYYY.') + (6 > tmp.get('month') ? '1' : '2') + 'H');
						xAxisPeriod.push(tmp.format('YYYY') + (6 > tmp.get('month') ? '1' : '2'));
						tmp.add(2, 'quarter');
					}
					
					break;
				case 3:
					endYMD = moment().endOf('quarter');
					diffPeriod = endYMD.diff(startYMD, 'quarters') + 1;
					
					var tmp = startYMD.clone();
					for (var i = 0; diffPeriod > i; ++i) {
						xAxisArr.push(tmp.format('YYYY.Q[Q]'));
						xAxisPeriod.push(tmp.format('YYYYQ'));
						tmp.add(1, 'quarter');
					}
	
					break;
			}
			
			param.endYMD = 'custom' !== self.searchDtl.radioTimeBound ? endYMD : self.endYMD;
			param.queryname = "5번";
			
			return z.xAsync('averageTrading', '평균매매가추이테이블', 'select', param, 'json').done(function(resp) {
				self.rawDataArr = resp;
				self.rawDataArr = self.rawDataArr.sort(function(a, b) {
					
					if (a['구시군'] < b['구시군']) {
						return -1;
					} else if (a['구시군'] > b['구시군']) {
						return 1;
					}					
					if (a['읍면동'] < b['읍면동']) {
						return -1;
					} else if (a['읍면동'] > b['읍면동']) {
						return 1;
					}					
					if (a['매물코드'] < b['매물코드']) {
						return -1;
					} else if (a['매물코드'] > b['매물코드']) {
						return 1;
					}
					return 0;
				});									
			});
		},
		
		updateData: function() {
			var self = this,
				dataArr = self.rawDataArr;
				
				var rawDataArr = JSON.parse(JSON.stringify(dataArr));
				rawDataArr.sort(function(a, b) {
					if (a['매물년도'] < b['매물년도']) {
						return -1;
					} else if (a['매물년도'] > b['매물년도']) {
						return 1;
					}					
				});				
				
				var yearArray = rawDataArr.map(function (val, index) {
					return val['매물년도'];
				}).filter(function (val, index, arr) {
					return arr.indexOf(val) === index;
				});
								
				$('#kt_datatable_search_status').children('option:not(:first)').remove();
				for(var i=0; i<yearArray.length; i++){
					var option = $("<option>"+yearArray[i]+"</option>");
	                $('#kt_datatable_search_status').append(option);
				}
				
				var rowdatatable = $('#rowDataTable').KTDatatable({
					data: {
		                type: 'local',
		                source: dataArr,
		                pageSize: 10,
		                pageSizeSelect: [10, 20, 30, 50, 100]
		            },
		        	layout: {
		                scroll: true,
		                minHeight: 400,
		                footer: false,
		            },            
		            sortable: true,
		            pagination: true,	
		  
		            columns: [{
		                field: '매물등록일',
		                title: '매물등록일',
		                width: 80,
		                textAlign: 'center'
		            }, {
		                field: '상가유형',
		                title: '상가유형',
		                width: 70,
		                textAlign: 'center'
		            }, {
		            	field: '건물명',
		                title: '건물명',
		                width: 180,
		                textAlign: 'center'
		            }, {
		            	field: '주소',
		                title: '주소',
		                width: 250,
		                textAlign: 'center'
		            }, {
		            	field: '층정보',
		                title: '층',
		                width: 60,
		                textAlign: 'center'
		            }, {
		            	field: '전용면적',
		                title: '전용면적(㎡)',
		                width: 100,
		                textAlign: 'center',
		                sortCallback: function (data, sort, column) {
		                    var field = column['field'];
		                    return $(data).sort(function (a, b) {
		                        var aField = a[field].replace(/\,/g,'');
		                        var bField = b[field].replace(/\,/g,'');
		                        if (sort === 'asc') {
		                            return parseFloat(aField) > parseFloat(bField)
		                                ? 1 : parseFloat(aField) < parseFloat(bField)
		                                    ? -1
		                                    : 0;
		                        } else {
		                            return parseFloat(aField) < parseFloat(bField)
		                                ? 1 : parseFloat(aField) > parseFloat(bField)
		                                    ? -1
		                                    : 0;
		                        }
		                    });          
		                }
		            }, {
		            	field: '계약면적',
		                title: '계약면적(㎡)', 
		                width: 100,
		                textAlign: 'center',
		                sortCallback: function (data, sort, column) {
		                    var field = column['field'];
		                    return $(data).sort(function (a, b) {
		                        var aField = a[field].replace(/\,/g,'');
		                        var bField = b[field].replace(/\,/g,'');
		                        if (sort === 'asc') {
		                            return parseFloat(aField) > parseFloat(bField)
		                                ? 1 : parseFloat(aField) < parseFloat(bField)
		                                    ? -1
		                                    : 0;
		                        } else {
		                            return parseFloat(aField) < parseFloat(bField)
		                                ? 1 : parseFloat(aField) > parseFloat(bField)
		                                    ? -1
		                                    : 0;
		                        }
		                    });          
		                }
		            }, {
		            	field: '매매가',
		                title: '매매가(만원)',
		                width: 100,
		                textAlign: 'center',
		                template: function(row) {
		                    return z.toComma(row.매매가);
		                },
		                sortCallback: function (data, sort, column) {
		                    var field = column['field'];
		                    return $(data).sort(function (a, b) {
		                        var aField = a[field].replace(/\,/g,'');
		                        var bField = b[field].replace(/\,/g,'');
		                        if (sort === 'asc') {
		                            return parseFloat(aField) > parseFloat(bField)
		                                ? 1 : parseFloat(aField) < parseFloat(bField)
		                                    ? -1
		                                    : 0;
		                        } else {
		                            return parseFloat(aField) < parseFloat(bField)
		                                ? 1 : parseFloat(aField) > parseFloat(bField)
		                                    ? -1
		                                    : 0;
		                        }
		                    });          
		                }
		            }, {          
		            	field: '권리금',
		                title: '권리금(만원)',  
		                width: 100,
		                textAlign: 'center',
		                template: function(row) {
		                    return z.toComma(row.권리금);                   
		                },
		                sortCallback: function (data, sort, column) {
		                    var field = column['field'];
		                    return $(data).sort(function (a, b) {
		                        var aField = a[field].replace(/\,/g,'');
		                        var bField = b[field].replace(/\,/g,'');
		                        if (sort === 'asc') {
		                            return parseFloat(aField) > parseFloat(bField)
		                                ? 1 : parseFloat(aField) < parseFloat(bField)
		                                    ? -1
		                                    : 0;
		                        } else {
		                            return parseFloat(aField) < parseFloat(bField)
		                                ? 1 : parseFloat(aField) > parseFloat(bField)
		                                    ? -1
		                                    : 0;
		                        }
		                    });          
		                }
		            }, {
		            	field: '매물년도',
		                title: '매물년도',
		                width: 100,
		                textAlign: 'center'
		            }]
				});
				self.rowdatatable = rowdatatable;
				rowdatatable.columns('매물년도').visible(false);
				$("#kt_datatable_search_status").on("change", (function() {
					rowdatatable.search($(this).val(), "매물년도");
				}))
			
		},	
		
		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			setTimeout(function() {
				var $table = self.$tbody.children('table');
				var wsBody = XLSX.utils.table_to_sheet($table[0]);
				var jsonBody = XLSX.utils.sheet_to_json(wsBody, {header: 1});
				var jsonHeader = jsonBody[0];
				var jsonBody2 = [];
				
				var headerData = $.extend(true, [], row);
				for (var i in jsonHeader) {
					headerData.push(jsonHeader[i]);
				}
				jsonBody2.push(headerData);
				
				var row = Array.apply(null, Array(10)).map(function() {return 0;});
				for (var i in self.rawDataArr) {
					var rowData = $.extend(true, [], row);
					rowData[0] = self.rawDataArr[i]['매물등록일'];
					rowData[1] = self.rawDataArr[i]['상가유형'];				
					rowData[2] = self.rawDataArr[i]['건물명'];				
					rowData[3] = self.rawDataArr[i]['주소'];
					rowData[4] = self.rawDataArr[i]['층정보'];
					rowData[5] = self.rawDataArr[i]['전용면적'];
					rowData[6] = self.rawDataArr[i]['계약면적'];					
					rowData[7] = self.rawDataArr[i]['매매가'];					
					rowData[8] = self.rawDataArr[i]['권리금'];				
					rowData[9] = self.rawDataArr[i]['매물년도'];
					jsonBody2.push(rowData);
				}
				
				var ws = XLSX.utils.json_to_sheet(jsonBody2, {skipHeader: true});
				result.resolve(ws);
				apiSearchEmd.addDownloadLog('추이_상세');
			});

			return result;
		},
		
		openAllView: function() {
			var self = this,
				$modal = $('#modalAllView'),
				$modalBody = $modal.find('[data-modal-body]');
			
			self.updateData(true);
			self.rowdatatable.load();
			
			$modal.modal({
				backdrop: 'static'
			}).modal('show');
			
			$modal.on('hidden.bs.modal', function() {
				self.rowdatatable.KTDatatable('destroy');
	        });
		},
	};
	
	// 사용자 설정 평균매매가 추이 합산
	var tableAverageTradingSum = {
		init: function(param, searchDtl) {
			var self = this;
				selectNm = (self.param.sidonm == '전국' ? '평균매매가전국추이차트' : '평균매매가시도추이차트');
			self.param = param;
			self.searchDtl = searchDtl;
			self.$tbody = $('#tbody_5_3').html('');
			self.startYMD = null;
			self.endYMD = null;
			self.floorArr = $.extend(true, [], floorTypeArr);
			self.areaArr = $.extend(true, [], areaTypeArr);			

			if (self.searchDtl && self.searchDtl.radioTimeBound) {
				self.period = self.searchDtl.radioTimeBound;
			} else {
				self.period = '4'
			}
			
			if (self.searchDtl && self.searchDtl.startYMD) {
				self.startYMD = self.searchDtl.startYMD;
				self.endYMD = self.searchDtl.endYMD;
			}
			
			if (self.searchDtl && self.searchDtl.checkSanggaType.length) {
				self.isCustomSangga = true;
				self.sanggaArr = $.extend(true, [], self.searchDtl.checkSanggaType);
			} else {
				self.isCustomSangga = false;
				self.sanggaArr = $.extend(true, [], sanggaTypeArr);
			}
			
			if (self.searchDtl && self.searchDtl.checkFloorBound.length) {
				self.isCustomFloor = true;
				self.floorArr = $.extend(true, [], self.searchDtl.checkFloorBound);
			} else {
				self.isCustomFloor = false;
				self.floorArr = $.extend(true, [], floorTypeArr);
			}
			
			if (self.searchDtl && self.searchDtl.checkAreaBound.length) {
				self.isCustomArea = true;
				self.areaArr = $.extend(true, [], self.searchDtl.checkAreaBound);
			} else {
				self.isCustomArea = false;
				self.areaArr = $.extend(true, [], areaTypeArr);
			}
			
			self.columnMode = 'sangga';
			
			if (self.searchDtl && (self.searchDtl.radioPriceUnit == "" || self.searchDtl.radioPriceUnit == 'py')) {
				self.isPy = self.searchDtl.radioPriceUnit;
			} 

			// 동 이름 목록 로딩
			self.dongArr = [];
			self.isSgg = (! param) || ('emd' !== param.jusoCd && ! param.sggnm);

			if (param && param.isBizdist) {
				self.isSgg = false;
			}	
			// 구 전체 + 특정 동 선택	
			var dongArr = apiSearchEmd.getDongArr();		
			// 시 전체 선택
			if (self.isSgg) {	
				dongArr = apiSearchEmd.getSggArr();
			} else if (param && param.isBizdist) {
				dongArr = apiSearchEmd.getBizdistArr();
			}
			
			for (var i in dongArr) {			
				self.dongArr.push(self.isSgg ? dongArr[i].sggnm : dongArr[i].dongnm);
			}
	
			self.setBtnListener();
			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		
		setBtnListener: function() {},

		loadData: function() {
			var self = this,
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					startYMD: self.startYMD,
					endYMD: 'custom' !== self.searchDtl.radioTimeBound ? '' : self.endYMD,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' ,
					jusoCd: self.param.jusoCd,
					period : '4',
				},
				// 테이블은 시작부터 최근까지 전체데이터 조회 + 사용자 시간선택 아닐 때
				price = '매매가';
			
			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;
			}
			
			if (self.isCustomFloor) {
				param.floorArr = self.floorArr;
			}
			
			if (self.isCustomArea) {
				param.areaArr = self.areaArr;
			}
			
			// 상세 데이터는 한단계 위의 전체데이터 표시
			// ex: 읍면동 선택 > 시군구 목록, 시군구 선택 > 시도 목록
			if (! self.isBizdist) {
				switch (self.param.jusoCd) {
					case 'emd':
						param.pnu2 = param.pnu.substring(0, 5);
						break;
					case 'sgg':
						param.pnu = param.pnu.substring(0, 2);
						param.pnu2 = param.pnu.substring(0, 5);
						break; 
				}
			}
			return z.xAsync('averageTrading', selectNm, 'select', param, 'json').done(function(resp) {
				self.rawDataArr = resp;

				for (var i in resp) {
					var row = resp[i],
						value = parseFloat(row[price]);
					row[price] = isNaN(value) ? 0 : value;

				}
			});
		},
		
		updateData: function() {
			var self = this,
				tmpl = Handlebars.compile($('#tmplTableaverageTradingSum').html()),
				rawDataArr = self.rawDataArr,
				dataArr = [],
				dongArr = [],
				isPy = self.isPy === 'py' ? true : false,
				columnNm = (self.param.sidonm == '전국' ? '도시' : 'sggnm'),
				sumNm = self.param.sidonm,
				areaStd = ''

			if (self.param.isBizdist) {
				dongArr = apiSearchEmd.getBizdistArr();
				columnNm = 'dongnm';
				sumNm = self.param.bizdistnm;
			} else {
				switch (self.param.jusoCd) {
					case 'emd':
						dongArr = apiSearchEmd.getDongArr();
						columnNm = 'dongnm';
						sumNm = self.param.sggnm;
						break;
					default:
						if(self.param.sidonm == '전국') {
							sidoArr = apiSearchEmd.getSidoArr();
							for(var i in sidoArr) {
								if(sidoArr[i].sidonm.substring(0, 2) != '전국') {
									dongArr.push(sidoArr[i]);
								}
							}
						} else {
							dongArr = apiSearchEmd.getSggArr();
						}
						break;
				}
			}

			// 면적 기준 ex) 전용면적, 계약면적
			if (self.searchDtl && self.searchDtl.radioResultArea) {
				areaStd = self.searchDtl.radioResultArea === "rent_ua" ? "usage_area" : "cont_area";
			}
			
			for (var i in dongArr) {
				dataArr.push({
					dongnm: (self.param.sidonm == '전국' ? dongArr[i].sidonm : (dongArr[i].dongnm || dongArr[i].sggnm)),
					area: 0,
					sum: 0,
					value: 0
				});
			}
			
			for (var i in rawDataArr) {
				var row = rawDataArr[i],
					key = row[columnNm];
				
				for (var j in dataArr) {
					if (key === dataArr[j].dongnm) {
						dataArr[j].sum += parseFloat(row['deal']);
						dataArr[j].area += parseFloat(row[areaStd]);		
					}
				}
			}
			
			for (var i in rawDataArr) {
				var row = rawDataArr[i],
					key = row[columnNm];
				
				for (var j in dataArr) {
					if(dataArr[j].sum > 0 && dataArr[j].area > 0) {
						dataArr[j].value = dataArr[j].sum / dataArr[j].area;
					}
				}
			}

			// 전체 합산 row 추가
			var result = {
				dongnm: sumNm,
				sum: 0,
				area: 0,
				value: 0
			};
			
			// 전체 분양가, 면적 합산
			for (var i in dataArr) {
				result.sum += dataArr[i].sum;
				result.area += dataArr[i].area;
			}

			if (result.sum > 0 && result.area > 0) {
				result.value = result.sum / result.area;				
			}
			
			dataArr.unshift(result);
			
			// 3자리 콤마 표시 + 소숫점 첫째 자리 반올림
			for (var i in dataArr) {
				if(dataArr[i].value > 0) {		
					dataArr[i].value = z.toComma(Math.round(dataArr[i].value * (isPy === true ? zo.py2m : 1)));					
				} else {
					dataArr[i].value = '-';
				}

			}
			
			// 상권조회는 합산결과만 표시
			if (self.param.isBizdist) {
				dataArr = [dataArr[0]];
			} else {
				// 특정 시군구/읍면동 선택 시 선택한 데이터만 표시
				if ('전체' !== self.param.dongnm) {
					dataArr = [
						dataArr[0],
						dataArr.filter(function(elm) {
							return elm.dongnm === self.param.dongnm;
						})[0]
					];
				}
			}		
			
			self.$tbody.html(tmpl({dataArr: dataArr}));
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				self.updateData(true);
				
				var $table = self.$tbody.closest('table');
				var wsBody = XLSX.utils.table_to_sheet($table[0]);
				var jsonBody = XLSX.utils.sheet_to_json(wsBody, {header: 1});
				var jsonMerge = jsonBody;
				var ws = XLSX.utils.json_to_sheet(jsonMerge, {skipHeader: true});

				self.$tbody.find('[data-hidden]').hide();
				result.resolve(ws);
				apiSearchEmd.addDownloadLog('추이_합산');
			});

			return result;
		}
	};
   
	return {
        // Public functions
        init: function() {
			var self = this;
			self.setBtnListener();
        },

		setBtnListener: function() {
			$('[data-btn-download="table_5_1"]').click(function() {
				if(_isDemo) {
					z.msg(_DemoMsgDownloadX);
					return;
				}
				
				if(excelyn == "N"){
					z.msg(_NoPemissionMsgDownloadX);
					return;
				}

				$.when(
					tableaverageTradingSanggaType.exportSheet()
				).done(function(workSheet) {
					var wb = XLSX.utils.book_new();
					
					XLSX.utils.book_append_sheet(wb, workSheet, '평균매매가_데이터');
					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_평균매매가_데이터.xlsx');					
				});
			});
			
			/* 추이클릭시 펼치기/닫기(지역별 평균 분양가) */ 
			$('#tbody_5_1').on('click', '.maintotal', function() {
				var dong = $(this).attr('data-dong');
				var sangga = $(this).attr('data-sangga');
				var show = $(this).hasClass('data-show');
				var len = 0;
				var sanggalen = 0;
				var sanggadata = 0;
				var showlen = 0;
								
				$('#tbody_5_1 tr').each(function(index, item){
					if($(item).attr('data-dong') === dong){
						len++;
						if($(this).hasClass('subtotal')){
							sanggalen++;
						}
						if($(this).hasClass('subdata') && $(this).hasClass('data-show')){
							sanggadata++;
						}
						if($(this).hasClass('data-show')){
							showlen++;
						}
					} 
				});
				
				if(show){//숨기기
					$('#tbody_5_1 tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){
							$(item).children().eq(0).attr('rowspan','1');
							$(item).not('.maintotal').hide();
							$(item).removeClass('data-show').addClass('data-hide');
							$(item).removeClass('data-s-show').addClass('data-s-hide');
						}
					});		
				} else {//보이기
					$('#tbody_5_1 tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){
							if($(item).hasClass('maintotal')){
								if($(item).children().eq(0).attr('rowspan') == '1'){
									$(item).children().eq(0).attr('rowspan', sanggalen + 1);
								};
								$(item).removeClass('data-hide').addClass('data-show');
							}
							if($(item).hasClass('subtotal')){
								$(item).children().eq(0).attr('rowspan', '1');
								$(item).show();
								$(item).removeClass('data-hide').addClass('data-show');
							}
							$(item).removeClass('data-s-show').addClass('data-s-hide');
						}
					});	
				}	
			});	
			
			/* 추이클릭시 펼치기/닫기(상가유형별 평균 분양가) */ 
			$('#tbody_5_1').on('click', '.subtotal', function() {
				var dong = $(this).attr('data-dong');
				var sangga = $(this).attr('data-sangga');
				var show = $(this).hasClass('data-s-show');
				var len = 0;
				var sanggalen = 0;
				var sanggadata = 0;
				
				$('#tbody_5_1 tr').each(function(index, item){
					if($(item).attr('data-dong') === dong && $(this).hasClass('data-show')){
						len++;
					}
					
					if($(item).attr('data-dong') === dong && $(item).attr('data-sangga') === sangga){
						if($(this).hasClass('subtotal')){
							sanggalen++;
						}
						if(show){//상세숨기기
							if($(this).hasClass('subdata') && $(this).hasClass('data-s-show')){
								sanggadata++;
							}
						}else{
							if($(this).hasClass('subdata') && $(this).hasClass('data-s-hide')){
								sanggadata++;
							}
						}
					}
				});
				
				if(show){ // 상세숨기기
					$('#tbody_5_1 tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){//첫번째 rowspan 수정
							if($(item).hasClass('maintotal')){
								if($(item).children().eq(0).attr('rowspan') == len){
									$(item).children().eq(0).attr('rowspan', len - sanggadata ); //전체에서 상가로우데이터 빼면 
								}
							}
						}	
						
						if($(item).attr('data-dong') === dong && $(item).attr('data-sangga') === sangga){
							if($(item).hasClass('subtotal')){
								$(item).children().eq(0).attr('rowspan', '1' );
							} else {
								$(item).hide();
								$(item).removeClass('data-show').addClass('data-hide');
							}
							$(item).removeClass('data-s-show').addClass('data-s-hide');	
						}
					});
					
				} else { // 상세보기
					$('#tbody_5_1 tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){//첫번째 rowspan 수정
							if($(item).hasClass('maintotal')){
								if($(item).children().eq(0).attr('rowspan') == len){
									$(item).children().eq(0).attr('rowspan', len + sanggalen + sanggadata - 1); //자기자신 빼기!
								}
							}
						}	
						
						if($(item).attr('data-dong') === dong && $(item).attr('data-sangga') === sangga){
							if($(item).hasClass('subtotal')){
								if($(item).children().eq(0).attr('rowspan') == '1'){
									$(item).children().eq(0).attr('rowspan', sanggalen + sanggadata );
								}
							}
							$(item).show();
							$(item).removeClass('data-hide').addClass('data-show');
							$(item).removeClass('data-s-hide').addClass('data-s-show');
						}
					});
				}
			});	
			
			$('[data-btn-dtldownload="rowDataTable"]').click(function() {
				if(_isDemo) {
					z.msg(_DemoMsgDownloadX);
					return;
				}
				
				if(dtlexcelyn == "N"){
					z.msg(_NoPemissionMsgDownloadX);
					return;
				}

				$.when(
					tableaverageTradingDetail.exportSheet()
				).done(function(workSheet) {
					var wb = XLSX.utils.book_new();
					
					XLSX.utils.book_append_sheet(wb, workSheet, '평균매매가_상세');
					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_평균매매가_상세.xlsx');					
				});
			});

			$('[data-btn-download="table_5_3"]').click(function() {
				if(_isDemo) {
					z.msg(_DemoMsgDownloadX);
					return;
				}
				
				if(excelyn == "N"){
					z.msg(_NoPemissionMsgDownloadX);
					return;
				}

				$.when(
					tableaverageTradingAvg.exportSheet()
				).done(function(workSheet) {
					var wb = XLSX.utils.book_new();
					
					XLSX.utils.book_append_sheet(wb, workSheet, '평균매매가_평균');
					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_평균매매가_평균.xlsx');					
				});
			});

		},

		setDongCd: function(param) {
			if (! param.isBizdist && ! param.dongCd) {
				return;
			}

			if (! param.isBizdist) {
				$('[data-select-sgg] [data-sgg-nm]').text(param.sggnm || param.sidonm);
			}
			
			var searchDtl = apiSearchaverageTrading.getSearchDtl(param);
			
			if ('custom' === searchDtl.radioTimeBound) {
				$('[data-ui-user-date=true]').show();
				$('[data-ui-user-date=false]').hide();

				tableAverageTradingSum.init(param, searchDtl);
			} else {
				$('[data-ui-user-date=true]').hide();
				$('[data-ui-user-date=false]').show();
				chartaverageTradingAll.init(param, searchDtl);
				chartaverageTradingYear.init(param, searchDtl);
				tableaverageTradingSanggaType.init(param, searchDtl); //5_1
			}	
			tableaverageTradingDetail.init(param, searchDtl);
		}
    };
}();

$(function() {
	$.when(
		$.getScript('/resources/admin/APPS/dashboard/apiSearchAreaMap_dev.js'),
		$.getScript('/resources/admin/APPS/dashboard/averageTradingSearch.js'),
		$.getScript('/resources/common/custom/js/commonDashboard.js')
	).done(function() {
		z.xAsync('AdminMain', 'getExcelDown', 'select', {pgmCode:"MA0108"}, 'json').done(function(resp) {
			excelyn = resp[0].excelyn;
			dtlexcelyn = resp[0].dtlexcelyn;
			if(excelyn == "N"){
				$("[data-btn-download]").css("visibility", "hidden");
			} else {
				$("[data-btn-download]").css("visibility", "visible");
			}
			
			if(dtlexcelyn == "N"){
				$("[data-btn-dtldownload]").css("visibility", "hidden");
			} else {
				$("[data-btn-dtldownload]").css("visibility", "visible");
			}
		}); 
		
		apiSearchAreaMap.init({
			btnSearchArea: $('#btnSearchArea'),
			btnSearchAreaSpan: $('#btnSearchArea > span'),
			areaCdListener: averageTrading.setDongCd
		});
		
		apiSearchEmd = apiSearchAreaMap;
		
		apiSearchaverageTrading.init({
			btnActivate: $('[data-btn-search-detail]'),
			searchWrapper: $('[data-wrapper="searchDetail"]'),
			searchDateRange: $('[data-wrapper="searchDetail"] [data-search-time]'),
			btnOk: $('[data-wrapper="searchDetail"] [data-btn-ok]'),
			btnClose: $('[data-wrapper="searchDetail"] [data-btn-close]'),
		});
		
		averageTrading.init();

		z.formatDataReference('매매').done(function(refText) {
			$('.dashboard .reference').text(refText);
		});
	});
	
});
