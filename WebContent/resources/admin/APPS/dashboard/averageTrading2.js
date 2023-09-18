'use strict';
// Class definition

var apiSearchEmd;
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

	var	areaPyTypeArr = [
		'302평 미만',
		'302평~907평',
		'907평~1,512평',
		'1,512평~2,117평',
		'2,117평~3,025평',
		'3,025평~4,537평',
		'4,537평~9,075평',
		'9,075평 이상'
	];
	
	var areaPyTypeMap = {
		'302평 미만' : 0,
		'302평~907평' : 1,
		'907평~1,512평' : 2,
		'1,512평~2,117평' : 3,
		'2,117평~3,025평' : 4,
		'3,025평~4,537평' : 5,
		'4,537평~9,075평' : 6,
		'9,075평 이상' : 7
	}
	
	// 평균분양가 추이 차트
	var chartaverageTradingAll = {		
		init: function(param, searchDtl) {
			var self = this,
				apexChart = '#chart_1_1';

			self.$wrapper = $(apexChart).closest('[data-chart-wrapper]');
			self.param = param;
			self.searchDtl = searchDtl;
			
			if(self.chart) {
				self.chart.destroy();
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
				self.areaMap = $.extend(true, {}, areaTypeMap);
			}
						
			if (self.searchDtl && self.searchDtl.radioTimeBound) {
				self.period = self.searchDtl.radioTimeBound;
			} else {
				self.period = '1'
			}

			self.columnMode = 'sangga';
		
			// 차트 초기화 퍼블리싱 코드 옮겨옴		
			var options = {
				series: [{
					name: '',        
					data: []
				}],
				chart: {
					width: '100%',
					height: 520,
					type: 'line',
					zoom: {
						enabled: false
					},
			        toolbar: {
			            show: true,
			            offsetX: -20,
			            offsetY: -30,
			            tools: {
			                download: true,
			                selection: false,
			                zoom: false,
			                zoomin: false,
			                zoomout: false,
			                pan: false,
			                reset: false,
			            },
			        },
					events: {
						click: function(event, chartContext, config) {
							var maxIdxDate = config.globals.categoryLabels[config.dataPointIndex],
								maxDate,
								$target = $(event.target);
								
							if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
								z.addDownloadLog('추이', 'chart');
							}
							
							if (maxIdxDate) {
								switch(self.period) {
									case '1' :
										maxDate = maxIdxDate.substr(0, 4);
										break;
									case '2' :
										maxDate = (parseInt(maxIdxDate.substr(0, 4))) + maxIdxDate.substr(-2, 1);
										break;
									case '3' :									
										maxDate = maxIdxDate.substr(0, 4) + maxIdxDate.substr(-2, 1);
										break;
									case '4' :
										maxDate = maxIdxDate.replace('.', '');
										break;
									default :
										maxDate = maxIdxDate.substr(0, 4);
										break;
								}
	
								param.maxIdxDate = maxDate;
								
								self.loadNextObj(param, searchDtl);								
							}	

						}
					}
		        },
				
				dataLabels: {
					enabled: false
				},
				tooltip: {
					y: {
		                formatter: function(value) {
		                	var str = self.isPy === "py" ? '만원 / 3.3㎡' : "만원 / ㎡";
							return z.toComma(value) + ' ' + str;
						}
					}
				},
			    stroke: {
			        show: true,
			        width: 4,
			        dashArray: 0,
			    },
				xaxis: {
					categories: [],
					tooltip: {
						enabled: false
					}
				},
				yaxis: [{
					title: {
						text: '평균 매매가'
					}
				}],
				colors: ['#009dd7'],
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
			        horizontalAlign: 'left',
			        floating: false,
			        fontSize: '10px',
			        fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
			        fontWeight: 400,
			        offsetX: -40,
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
			    },
			};
	
			var chart = new ApexCharts($(apexChart)[0], options);
			
			self.chart = chart;
			
			self.setBtnListener();

			chart.render().then(function() {
				// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
				chart.updateSeries([]);
				
				if (self.param) {
					if (! self.param.isBizdist) {
						self.$wrapper.find('[data-sgg-nm]').text(param.sggnm || param.sidonm);
						self.$wrapper.find('[data-dong-nm]').text(param.dongnm);
					} else {
						self.$wrapper.find('[data-dong-nm]').text(param.bizdistnm);
					}
					
					self.loadData().done(function(resp) {
						self.loadAxis();
						self.updateData();						
						self.loadNextObj(param, searchDtl);						
					});
				}
			});
		},
		
		// input, form 변경 시 수정사항 정리영역
		// 검색 조건 바뀔 때 + 업데이트 전 파라메터 정리 필요하면 여기에서 실행
		setBtnListener: function() {
		},
		
		loadCondition: function() {							 
		},
		
		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					period: self.period,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' 		
				};
			
			if (self.searchDtl && self.searchDtl.startYMD) {
				param.startYMD = self.searchDtl.startYMD;
				param.endYMD = self.searchDtl.endYMD;
			}	

			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;				
			}
			
			if (self.isCustomFloor) {
				param.floorArr = self.floorArr;
			}
			
			if (self.isCustomArea) {
				param.areaArr = self.areaArr;
			}
			
			selectNm = self.param.isBizdist ? '평균매매가상권추이차트' :  '평균매매가시도추이차트',
			
			param.queryname = "1번";
			//chartaverageTradingAll (1번차트)
			return z.xAsync('averageTrading', selectNm, 'select', param, 'json').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;
			});
		},

		loadAxis: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				xAxisArr = [],
				xAxisPeriod = [],
				period = parseInt(self.period),
				diffPeriod = 0;
				
			var	yAxisObj = [{
					title: {
						text: '구간별 동향'
					},
					labels: {
						formatter: function(value) {
							return z.toComma(value);
						}
					}
				}];

			// 정렬: 분양연도 오름차순
			rawDataArr = rawDataArr.sort(function(a, b) {
				if (a['period'] < b['period']) {
					return -1;
				}
				if (a['period'] > b['period']) {
					return 1;
				}
				return 0;
			});

			var startYMD = moment(self.searchDtl.startYMD),
				endYMD = moment(self.searchDtl.endYMD),
				diffPeriod = 0;	
			
			switch(period) {

				case 1:
					diffPeriod = endYMD.diff(startYMD, 'years') + 1;
					
					var tmp = startYMD.clone();
					
					for (var i = 0; diffPeriod > i; ++i) {
						xAxisArr.push(tmp.format('YYYY'));
						xAxisPeriod.push(tmp.format('YYYY'));
						tmp.add(1, 'year');
					}							
					break;

				case 2:
					diffPeriod = Math.floor(endYMD.diff(startYMD, 'quarters') / 2) + 1;

					var tmp = startYMD.clone();
					
					for (var i = 0; diffPeriod > i; ++i) {
						xAxisArr.push(tmp.format('YYYY.') + (6 > tmp.get('month') ? '1' : '2') + 'H');
						xAxisPeriod.push(tmp.format('YYYY') + (6 > tmp.get('month') ? '1' : '2'));
						tmp.add(2, 'quarter');
					}
					break;

				case 3:				
					diffPeriod = endYMD.diff(startYMD, 'quarters') + 1;
					
					var tmp = startYMD.clone();
					
					for (var i = 0; diffPeriod > i; ++i) {
						xAxisArr.push(tmp.format('YYYY.Q[Q]'));
						xAxisPeriod.push(tmp.format('YYYYQ'));
						tmp.add(1, 'quarter');
					}
					break;

				case 4:		
					diffPeriod = endYMD.diff(startYMD, 'months') + 1;

					var tmp = startYMD.clone();
					
					for (var i = 0; diffPeriod > i; ++i) {
						xAxisArr.push(tmp.format('YYYY.MM'));
						xAxisPeriod.push(tmp.format('YYYYMM'));
						tmp.add(1, 'month');
					}
					break;													
			}
								
				self.diffPeriod = diffPeriod;
				
				// 엑셀 저장용 정보로도 활용될 예정
				self.xAxisArr = xAxisArr;
				self.xAxisPeriod = xAxisPeriod;
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

			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);			
		},
		
		updateDataByYear: function(chartOptions, chartSeries) {
			var self = this,
				period = parseInt(self.period),
				diffPeriod = self.diffPeriod,
				xAxisPeriod = self.xAxisPeriod,
				areaStd = '',
				isPy = self.isPy === 'py' ? true : false;
			
			var	salesData = {
					name: '구간별 평균매매가',
					data: [],
					area: []
				}		
			
			// 가격면적 기준 : 전용면적, 계약면적
			if (self.searchDtl && self.searchDtl.radioResultArea) {
				areaStd = self.searchDtl.radioResultArea;
			}

			chartSeries.push(salesData);
			
			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));
			for (var i = 0; diffPeriod > i; ++i) {
				salesData.data.push(0);
				salesData.area.push(0);
			}
			
			for (var i in rawDataArr) {
				var raw = rawDataArr[i],
					rawPeriod = raw['period'],
					resultArea = parseFloat(raw[areaStd]),
					result = parseFloat(raw['매매가']);
					
				var idx = xAxisPeriod.indexOf(rawPeriod);
	
				if (isNaN(result) || 0 > idx) {
					continue;
				}	
				
				salesData.data[idx] += result;
				salesData.area[idx] += resultArea;											
			}
						
			for (var i = 0; i < salesData.data.length; i++) {
				
				if (salesData.data[i] > 0 && salesData.area[i] > 0) {
					salesData.data[i] = salesData.data[i] / salesData.area[i];
				}

			}
		
			// 합산 이후에는 모든 데이터 소수점 2자리까지 출력
			for (var i in salesData.data) {
				
				if (isPy) {
					salesData.data[i] *= zo.py2m;
				}
				
				salesData.data[i] = Math.round(salesData.data[i]);
			}
			
		},
		
		loadNextObj: function(param, searchDtl) {
			var self = this,
				param = param;	
				param.period = self.period;
				param.xAxisArr = self.xAxisArr;
				param.xAxisPeriod = self.xAxisPeriod;		
				
			chartaverageTradingYear.init(param, searchDtl);
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = self.xAxisArr,
				yAxisArr = self.yAxisArr, // yAxisObj
				excelData = [],
				excelOpt = {header: ['평균매매가']};
		
			return result;
		}
	};

	
	// 최근 5구간 평균분양가 추이 차트: 상가유형별 or 연면적별
	var chartaverageTradingYear = {
		init: function(param, searchDtl) {
			var self = this;
				
			self.apexChart = '#chart_2_1';
			self.$wrapper = $(self.apexChart).closest('[data-chart-wrapper]');
			self.param = param;
			self.searchDtl = searchDtl;
			
			if (self.param.maxIdxDate) {
				self.maxDate = self.param.maxIdxDate;
			} else {
				self.maxDate = self.param.xAxisPeriod[param.xAxisPeriod.length - 1];
			}

			self.endYYYY = self.maxDate;

			if (self.param.period) {
				self.period = self.param.period;
			}		

			self.columnMode = 'sangga';
			
			if (self.searchDtl && (self.searchDtl.radioPriceUnit == "" || self.searchDtl.radioPriceUnit == 'py')) {
				self.isPy = self.searchDtl.radioPriceUnit;
			}
			
			if (self.searchDtl && self.searchDtl.checkSanggaType.length) {
				self.isCustomSangga = true;
				self.sanggaArr = $.extend(true, [], self.searchDtl.checkSanggaType);
				self.sanggaMap = {};
				
				for (var i in self.sanggaArr) {
					self.sanggaMap[self.sanggaArr[i]] = parseInt(i);
				};
			} else {
				self.isCustomSangga = false;
				self.sanggaArr = $.extend(true, [], sanggaTypeArr);
				self.sanggaMap = $.extend(true, {}, sanggaTypeMap);
			}
			self.isCustomArea = true;
			self.areaArr = $.extend(true, [], self.searchDtl.checkAreaBound);
			self.areaMap = {};
			self.areaPyMap = {};
			self.areaPyArr = [];
			
			for (var i in self.areaArr) {
				self.areaMap[self.areaArr[i]] = parseInt(i);
			};
			
			var pyArr = new Array(),
				areaPyArr = [];
			if (self.isPy) {
				for (var i in self.areaArr) {
					pyArr.push(areaTypeMap[self.areaArr[i]]);
				}
				for (var i in pyArr) {
					areaPyArr[i] = areaPyTypeArr[pyArr[i]];
				}
			
				for (var j in areaPyArr) {
					self.areaPyMap[areaPyArr[j]] = parseInt(j);
				}	

				self.areaPyArr = JSON.parse(JSON.stringify(areaPyArr));
			} 	
			
			
			
			if (self.searchDtl && self.searchDtl.checkFloorBound.length) {
				self.isCustomFloor = true;
				self.floorArr = $.extend(true, [], self.searchDtl.checkFloorBound);
			} else {
				self.isCustomFloor = false;
				self.floorArr = $.extend(true, [], floorTypeArr);
			}
			
			self.distrName = 0;		
					
			var options = {
				series: [{
					name: '',
	                data: []
	            }],
				chart: {
					width: '100%',
					height: 243,
					type: 'bar',
					zoom: {
						enabled: false
					},
			        toolbar: {
			            show: true,
			            offsetX: -20,
			            offsetY: -27,
			            tools: {
			                download: true,
			                selection: false,
			                zoom: false,
			                zoomin: false,
			                zoomout: false,
			                pan: false,
			                reset: false,
			            },
			        },
					events: {
						dataPointSelection: function(event, chartContext, config) {
							var idx = config.dataPointIndex,
								name = '',
								distrVal = '';

							self.param.maxDateIdx = self.xAxisPeriod[idx];

							var distrNameVal = config.w.config.series[config.seriesIndex].name;
							
							name = self.sanggaMap[distrNameVal].toString().trim();
							distrVal = self.sanggaMap[distrNameVal];	
							
							self.distrName = distrVal;						
							self.$wrapper.find('.clickYears').children('span').removeClass('on');
							$('.clickYears').children('span').eq(idx).addClass('on');
						
							self.loadNextObj(self.param, self.searchDtl);							
						},
						
				       	click: function(event, chartContext, config) {
							var $target = $(event.target);
												
							if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
								z.addDownloadLog('5구간', 'chart');
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
		                	var str = self.isPy === "py" ? '만원 / 3.3㎡' : "만원 / ㎡";
		                	return z.toComma(value) + ' ' + str;
						}
					}
				},
								
				stroke: {
					width: 1,
					colors: ['#fff']
				},
				fill: {
					opacity: 1
				},
				xaxis: {
					categories: [],
				},
				colors: ['#5e58c9','#2985d2','#2eb7c4','#6d9d64','#b5bf1b'],
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


			var chart = new ApexCharts($(self.apexChart)[0], options);
			
			self.chart = chart;
						
			self.setBtnListener();

			chart.render().then(function() {
				// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
				chart.updateSeries([]);

				if (self.param) {

					var	maxDate = self.maxDate,
						xAxisArr = [],
						xAxisPeriod = [],
						minYearInt = '',
						maxYearInt = '',
						minMonthInt = '',
						diffPeriod = 5;
	
					switch(self.period) {					
						case '1':
							maxYearInt = parseInt(maxDate.substr(0, 4));																	
							minYearInt = parseInt(maxYearInt) - 4;
							
							for (var i = 0; diffPeriod > i; ++i) {
								xAxisArr.push('' + (minYearInt + i));
								xAxisPeriod.push('' + (minYearInt + i));
							}
							
							break;
								
						case '2':
							minYearInt = moment(maxDate, 'YYYY').subtract(2, 'years').format('YYYY');
							var half = maxDate.substr(4, 1);

							for(var i = 0; i < 3; ++i) {							
								for(var j = 1; j < 3; ++j) {
									if(i === 0 && j === 1 && half === '2') continue;							
									if(i === 2 && j === 2 && half === '1') continue;
									xAxisArr.push(parseInt(minYearInt) + i + '.' + j + 'H');
									xAxisPeriod.push(parseInt(minYearInt) + i + '' + j);
								}
							}
	
							break;
								
						case '3':
							var maxY = maxDate.substr(0, 4);
							var maxQ = maxDate.substr(4, 1);
							var minQ = maxQ;						
							var minY = parseInt(maxY) - 1;
													
							for(var i = 0; i < 2; ++i) {
							    for(var j = 1; j < 5; ++j) {
							        if(i === 0 && j < parseInt(minQ))continue;
							        if(i === 1 && j > parseInt(maxQ))continue;	
							        xAxisArr.push((parseInt(minY) + i) + '.' + j + 'Q');
							        xAxisPeriod.push((parseInt(minY) + i) + '' + j);
							    }						
							}
	
							break;
								
						case '4':
							minMonthInt = moment(maxDate, 'YYYYMM').subtract(4, 'M').format('YYYYMM');
							maxYearInt = parseInt(maxDate);
							minYearInt = minMonthInt.substr(0, 4);
	
							for (var i = 0; diffPeriod > i; ++i) {
								var setDate = moment(minMonthInt, 'YYYYMM').add(i, 'M').format('YYYYMM');
								xAxisArr.push('' + setDate.substr(0, 4) + '.' + setDate.substr(4, 2));	
								xAxisPeriod.push('' + (moment(minMonthInt, 'YYYYMM').add(i, 'M').format('YYYYMM')));
							}
						
							break;
								
						default: 
							maxYearInt = parseInt(maxDate.substr(0, 4));																	
							minYearInt = parseInt(maxYearInt) - 4;
							
							for (var i = 0; diffPeriod > i; ++i) {
								xAxisArr.push('' + (minYearInt + i));
								xAxisPeriod.push('' + (minYearInt + i));
							}
							
							break;
						}
					
					if (maxDate == "") {
						xAxisArr = [];
						xAxisPeriod = [];
					}

					self.minYearInt = minYearInt;
					self.maxYearInt = maxYearInt;
					self.xAxisArr = xAxisArr;
					self.xAxisPeriod = xAxisPeriod;
					self.diffPeriod = diffPeriod;

					if (self.param.isBizdist) {
						self.$wrapper.find('[data-dong-nm]').text(param.bizdistnm);
					} else {
						self.$wrapper.find('[data-sgg-nm]').text(param.sggnm || param.sidonm);
						self.$wrapper.find('[data-dong-nm]').text(param.dongnm);
					}
					
					self.$wrapper.find('[data-last-year]').text((self.xAxisArr[self.xAxisArr.length - 1]));
					
					self.loadData().done(function(resp) {
						self.loadAxis();
						self.updateData();
						//self.loadNextObj(param, searchDtl);
					});
				}
			});
		},
		
		// input, form 변경 시 수정사항 정리영역
		// 검색 조건 바뀔 때 + 업데이트 전 파라메터 정리 필요하면 여기에서 실행
		setBtnListener: function() {
			var self = this,
				param = self.param,
				searchDtl = self.searchDtl;		
			
			self.$wrapper.find('.clickYears').children('span').removeClass('on');

			self.$wrapper.find('.clickYears').children('span').off('click').on('click', function(){
				var $this = $(this),
					$list = $(this).siblings('span').removeClass('on');
					
				$this.addClass('on');
				
				self.param.maxDateIdx = self.xAxisPeriod[parseInt($this.attr('data-idx'))];

				// default: 근린상가(상가유형) or 첫 번째 연면적
				self.distrName = 0;

				self.loadNextObj(param, searchDtl);
			})			
			
		},		
		
		// x,y 라벨에 버튼 추가 api 가 없어서 배경 객체를 추가하는 방식 
		addAxisBackground: function(year) {
			var self = this,
				$chart = $(self.apexChart);

			if (! year && self.param) {
				year = self.param.xAxisPeriod
			}

			// 선택된 라벨 css class 수정
			$chart.find('.apexcharts-xaxis-label').removeClass('xaxis-selected');

			if (year) {
				$chart.find('.apexcharts-xaxis-label:contains("' + year + '")').addClass('xaxis-selected');
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
				periodArr = self.xAxisPeriod,
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					period: self.period,			// default 값 1년(12개월)
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' 
				};

			param.periodArr = periodArr;	
				
			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;
			}
			
			if (self.isCustomFloor) {
				param.floorArr = self.floorArr;
			}
			
			if (self.isCustomArea) {
				param.areaArr = self.areaArr;
			}

			//chartaverageTradingYear (2번차트)
			param.queryname = "2번";
			return z.xAsync('averageTrading', '평균매매가시도추이차트', 'select', param, 'json').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;
			});
		},
		
		loadCondition: function() {
		},


		loadAxis: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				sanggaMap = self.sanggaMap,
				areaMap = self.areaMap,				
				xAxisArr = self.xAxisArr,
				yAxisObj = {
					title: {
						text: ''
					},
					labels: {
						formatter: function(value) {
							return z.toComma(value);
						}
					}
				};


			// 정렬: 상가종류, 분양연도 오름차순
			rawDataArr = rawDataArr.sort(function(a, b) {
				var aType = sanggaMap[a['상가유형']],
					bType = sanggaMap[b['상가유형']];
					
				if (aType < bType) {
					return -1;
				}
				if (aType > bType) {
					return 1;
				}
				
				if (a['매물게시일'] < b['매물게시일']) {
					return -1;
				}
				if (a['매물게시일'] > b['매물게시일']) {
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

			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);
			
			// 마지막 구간 바로 실행
			self.$wrapper.find('.clickYears').children('span').last().click();						
		},
		
		updateDataByYear: function(chartOptions, chartSeries) {
			var self = this,
				diffPeriod = self.diffPeriod,
				period = parseInt(self.period),
				xAxisPeriod = self.xAxisPeriod,
				priceStd = '',
				stdNm = '',
				isPy = self.isPy === 'py' ? true : false ,
				dataArr = [],
				pyArr = [],
				prevData,
				columnMode = self.columnMode;
				
			// 면적 기준	
			if (self.searchDtl && self.searchDtl.radioResultArea) {
				priceStd = self.searchDtl.radioResultArea;
			}	

			dataArr = self.sanggaArr;
			
			stdNm = '상가유형';
			
			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));	
			
			for (var i in dataArr) {
				prevData = {
					name: dataArr[i],
					data: [],
					area: [],
					subData: ''
				};
				
				chartSeries.push(prevData);
				
				for (var j = 0; diffPeriod > j; ++j) {
					prevData.data.push(0);
					prevData.area.push(0);
				}
			}
			
			for (var i in rawDataArr) {
				var raw = rawDataArr[i], 
					resultArea = parseFloat(raw[priceStd]),		
					idxData = self.sanggaMap[raw[stdNm]],  
					result = parseFloat(raw['매매가']),
					rawPeriod = raw['period'];

				var idxYear = xAxisPeriod.indexOf(rawPeriod);	
				
				if (isNaN(idxData) || 0 > idxData) {
					continue;
				}						
	
				chartSeries[idxData].data[idxYear] += result;
				chartSeries[idxData].area[idxYear] += resultArea;
	
				if (result > 0){
					chartSeries[idxData].subData = idxData;	 					
				} 						
			}
			
			for (var i in chartSeries) {
				var series = chartSeries[i];

				for (var j = 0; j < series.data.length; j++) {
					if (series.data[j] > 0 && series.area[j] > 0) {
						series.data[j] = series.data[j] / series.area[j]; 						
					}
					
				}
			}
			
			// 합산 이후에는 모든 데이터 소수점 2자리까지 출력 + 면적 유형 평일 경우 * 3.3058
			for (var i in chartSeries) {
				var series = chartSeries[i];
				
				for (var j in series.data) {
					
					if (isPy) {
						series.data[j] *= zo.py2m;
					}
					
					series.data[j] = Math.round(series.data[j]);
				}
			}
		},
		
		loadNextObj: function(param, searchDtl) {
			var self = this,
				param = param;				
				param.period = self.period,
				param.xAxisArr = self.xAxisArr,
				param.xAxisPeriod = self.xAxisPeriod;
				param.distrName = self.distrName;
				
				if(self.xAxisPeriod[self.xAxisPeriod.length - 1] != param.endYYYY) {
					param.endYYYY = self.xAxisPeriod[self.xAxisPeriod.length - 1];
				}
				
				if(self.param.maxDateIdx) {
					param.endYYYY = self.param.maxDateIdx;
				}
				
				self.param.maxDateIdx = '';

			chartaverageTradingSanggaType.init(param, searchDtl);
			//tableCompare.init(param, searchDtl);
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = self.xAxisArr,
				yAxisArr = self.yAxisArr,
				excelData = [],
				excelOpt = {header: ['평균매매가']};

			return result;
		}
	};
	
	
	// 상가 유형별 평균 임대료 차트 
	var chartaverageTradingSanggaType = {	
			init: function(param, searchDtl) {
			var self = this;
			self.apexChart = '#chart_3_1';
			self.$wrapper = $(self.apexChart).closest('[data-chart-wrapper]').show();
			self.$distrWrapper = $('[data-wrapper="sanggaArea"]');
			
			self.param = param;
			self.searchDtl = searchDtl;
			
			if (self.chart) {
				self.chart.destroy();
			}

			self.columnMode = 'sangga';
			if(self.searchDtl && 'area' === self.searchDtl.columnMode) {
				self.columnMode = 'area';
			}
			
			if (self.searchDtl && (self.searchDtl.radioPriceUnit == "" || self.searchDtl.radioPriceUnit == 'py')) {
				self.isPy = self.searchDtl.radioPriceUnit;
			} 

			if (self.searchDtl && self.searchDtl.checkSanggaType.length) {
				self.isCustomSangga = true;
				self.sanggaArr = $.extend(true, [], self.searchDtl.checkSanggaType);
				self.sanggaMap = {};
				
				for (var i in self.sanggaArr) {
					self.sanggaMap[self.sanggaArr[i]] = parseInt(i);
				}
			} else {
				self.isCustomSangga = false;
				self.sanggaArr = $.extend(true, [], sanggaTypeArr);
				self.sanggaMap = $.extend(true, {}, sanggaTypeMap);
			}
			
			self.isCustomArea = true;
			self.areaArr = $.extend(true, [], self.searchDtl.checkAreaBound);
			self.areaMap = {};
			self.areaPyMap = {};
			self.areaPyArr = [];
			
			for (var i in self.areaArr) {
				self.areaMap[self.areaArr[i]] = parseInt(i);
			};

			var pyArr = [],
				areaPyArr = [];
			
			if (self.isPy) {
				
				for (var i in self.areaArr) {
					pyArr.push(areaTypeMap[self.areaArr[i]]);
				}
				
				for (var i in pyArr) {
					areaPyArr[i] = areaPyTypeArr[pyArr[i]];
				}

				for (var j in areaPyArr) {
					self.areaPyMap[areaPyArr[j]] = parseInt(j);
				}	

				self.areaPyArr = JSON.parse(JSON.stringify(areaPyArr));
			}	
	
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
			
			// 동 이름 목록 로딩
			self.dongArr = [];
			self.isSgg = (! param) || ('emd' !== param.jusoCd && ! param.sggnm);
						
			if (param && param.isBizdist) {
				self.isSgg = false;
			}
			
			var dongArr = apiSearchEmd.getDongArr();
			
			if (self.isSgg) {				
				dongArr = apiSearchEmd.getSggArr();
			} else if (param && param.isBizdist) {
				dongArr = apiSearchEmd.getBizdistArr();
			}
		
			for (var i in dongArr) {			
				self.dongArr.push(self.isSgg ? dongArr[i].sggnm : dongArr[i].dongnm);
			}

			if (self.param) {
				self.period = self.param.period;
				
				if (self.param.endYYYY) {
					self.endYYYY = self.param.endYYYY;
				} else {
					self.endYYYY = self.param.xAxisPeriod[self.param.xAxisPeriod.length - 1];
				}
			}	
			
			// 차트 초기화 퍼블리싱 코드 옮겨옴
			var options = { 
				series: [], // Array.apply(null, Array(self.floorArr.length)).map(function() {return 0;}),
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
		                	var str = self.isPy === "py" ? '만원 / 3.3㎡' : "만원 / ㎡";
		                	return z.toComma(value) + ' ' + str;
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
			        // curve: 'smooth',
			        lineCap: 'butt',
			        colors: '#ffffff',
			        width: 2,
			        dashArray: 0,
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

			self.$wrapper.find('[data-sgg-nm]').text('');
			self.$wrapper.find('[data-dong-nm]').text('');
			self.$wrapper.find('[data-last-year]').text('');
			
			self.setBtnListener();
			
			if (self.param && typeof(self.param.endYYYY) != 'undefined') {
				self.period = self.param.period;
				self.periodStd = self.param.endYYYY;
//				self.maxYearInt = self.periodStd.substr(0, 4);
				
				if (self.param.isBizdist) {
					self.$wrapper.find('[data-dong-nm]').text(param.bizdistnm);
				} else {
					self.$wrapper.find('[data-sgg-nm]').text(param.sggnm || param.sidonm);
					self.$wrapper.find('[data-dong-nm]').text(param.dongnm);
				}				
			
				if (self.param.distrName) {
					self.distrVal = self.param.distrName;
				} else {
					self.distrVal = 0;
				}
			}
			chart.render().then(function() {
				self.loadData().done(function(resp) {
					self.loadCondition();
					self.loadAxis();
					self.updateData();
				});
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
				periodArr = [],
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					period: self.period,		// default 값 1년(12개월)	,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' 				
				};	
			
			periodArr.push(self.periodStd);
			
			param.periodArr = periodArr;	
	
			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;				
			}
			
			if (self.isCustomFloor) {
				param.floorArr = self.floorArr;
			}
			
			if (self.isCustomArea) {
				param.areaArr = self.areaArr;
			}

			//chartaverageTradingSanggaType (3번차트)
			param.queryname = "3번";
			return z.xAsync('averageTrading', '평균매매가시도추이차트', 'select', param, 'json').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;
			});
		
		},
		
		loadCondition: function() {	
			var self = this,
				text = '',
				diffTime = 3,
				period = parseInt(self.period),
				endYYYY = self.endYYYY;		
			
			// 데이터 기간 만들기
			var resArr = [];
			
			switch(period) {
				case 1:
					for (var i = diffTime; i > -1 ; --i) {
						resArr.push(parseInt(endYYYY) - i + '');
					}				
					break;
				case 2:
					var endHalf = parseInt(endYYYY.substr(4, 1));				
						for (var i = 2; i > - 1; --i) {							
							for(var j = 1; j < 3; ++j) {
								if(i === 2 && j === 1 && endHalf === 1) continue;							
								if(i === 0 && j === 2 && endHalf === 1) continue;
								if(i === 2 && endHalf === 2) continue;
								resArr.push(parseInt(endYYYY.substr(0, 4)) - i + '' + j);
							}
						}
					break;
				case 3:
				var endQuater = parseInt(endYYYY.substr(4, 1));					
					for (var i = 0; i < 2; ++i) {
						for (var j = 1; j < 5; ++j) {
							if(i === 0 && j < endQuater + 1) continue;
							if(i === 1 && j > endQuater) continue;
							if(endQuater === 4 && i === 0) continue;
							resArr.push(parseInt(endYYYY.substr(0, 4)) + - 1 + i + '' + j);
						}
					}				
					break;
				case 4:
					for (var i = 0; i < 4; ++i) {
						resArr.unshift(moment(endYYYY).subtract(i, 'M').format('YYYYMM'));
					}				
					break;
				default:
					for (var i = 0; i < 4; ++i) {
						resArr.unshift(moment(endYYYY).subtract(i, 'M').format('YYYYMM'));
					}
					break;
			}
			
			self.resArr = resArr;
			
			var dateStd = resArr[resArr.length - 1],
				yearStd = dateStd.substr(0, 4);

			switch (parseInt(self.period)) {
				case 1:
					text = yearStd;
					break;
				case 2:
					text = yearStd + '.' + dateStd.substr(4, 1) + 'H';
					break;
				case 3:
					text = yearStd + '.' + dateStd.substr(4, 1) + 'Q';
					break;
				case 4:
					text = yearStd + '.' + dateStd.substr(4, 2);
					break;
			}

			self.$wrapper.find('[data-last-year]').text(text);		
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
							value =  Math.round(value * 100) / 100; 
							return value;
						}
					}
				}; 
			// 정렬: 상가종류, 분양연도 오름차순
			// 연도 - 1년 기간, 년도 - 10년 기간 ㄷㄷ
			rawDataArr = rawDataArr.sort(function(a, b) {
				var aFloorType = floorMap[a['층정보']],
					bFloorType = floorMap[b['층정보']];
					
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
			
			self.updateDataBySanggaType(chartOptions, chartSeries);

			// 엑셀 저장용 정보로도 활용될 예정
			self.yAxisArr = chartSeries;
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
					area: [],
					copydata: []
				};
				chartSeries.push(prevData);
				for (var j in sanggaArr) {
					prevData.data.push(0);
					prevData.area.push(0);
					prevData.copydata.push(0);
				}
			}
			
			for (var i in rawDataArr) {
				var raw = rawDataArr[i],
					idxFloor = floorMap[raw['층정보']],
					idxSangga = sanggaMap[raw['상가유형']];
				
				// 데이터 표시는 선택한(마지막) 연도 데이터만
				if (isNaN(idxFloor) || isNaN(idxSangga) || idxFloor < 0 || idxSangga < 0 ) {
					continue;
				}
					
				if (raw['period'] != self.periodStd) {
					continue;
				}
				
				chartSeries[idxFloor].data[idxSangga] += parseFloat(raw["매매가"]);
				chartSeries[idxFloor].area[idxSangga] += parseFloat(raw[columnNm]);
			}
			
			for (var i in chartSeries) {
				var series = chartSeries[i];

				for (var j = 0; j < series.data.length; j++) {
					if (series.data[j] > 0 && series.area[j] > 0) {
						series.data[j] = series.data[j] / series.area[j]; 						
					}
					
				}
			}
			
			// 합산 이후에는 모든 데이터 소수점 2자리까지 출력 + 면적 유형 평일 경우 * 3.3058
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
		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = self.xAxisArr,
				yAxisArr = self.yAxisArr,
				excelData = [],
				excelOpt = {header: ['업종분포']};

			// FIXME: 엑셀 표시 나중에
			
			return result;
		}
	};
	
	// 추이 데이터
	var tableaverageTradingSanggaType = {
		init: function(param, searchDtl, isAll) {
			var self = this;
			
			self.param = param;
			self.searchDtl = searchDtl;
			self.$table = $('#table_5_1');
			self.$thead = self.$table.find('thead');
			self.$tbody = $('#tbody_5_1').html('');

			self.startYMD = null;
			self.endYMD = null;
			self.floorArr = $.extend(true, [], floorTypeArr);
			

			if (self.searchDtl && self.searchDtl.radioTimeBound) {
				self.period = self.searchDtl.radioTimeBound;
			} else {
				self.period = '1'
			}
			
			if (self.searchDtl && self.searchDtl.pastYMD) {
				self.startYMD = self.searchDtl.pastYMD;
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
				self.areaMap = {};
				
				for (var i in self.areaArr) {
					self.areaMap[self.areaArr[i]] = parseInt(i);
				}
			} else {
				self.isCustomArea = false;
				self.areaArr = $.extend(true, [], areaTypeArr);
				self.areaMap = $.extend(true, {}, areaTypeMap);
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
			
			if (typeof(isAll) != 'undefined') {
				self.isAll = isAll;	
			} else {
				self.isAll = false;
			}

			self.setBtnListener();

			self.loadData().done(function(resp) {
				self.loadCondition();
				self.updateDataBySanggaType();
				self.updateData();
			});
		},	

		setBtnListener: function() {
			var self=this;
			self.$tbody = $('#tbody_5_1').html('');
			self.$wrapper = self.$tbody.closest('[data-table-wrapper]');
			
			self.$wrapper.find('.allView2').off('click').on('click', function() {
				tableaverageTradingDetail.openAllView();
			});
		},	

		loadCondition: function() {
			var self = this,
				areaArr = self.areaArr,
				pyArr = [],
				isPy = self.isPy === 'py' ? true : false ;
			
			if (isPy) {
				
				for (var i in areaArr) {
					var bound = areaArr[i].split('~');
					if(bound.length > 1) {
						var min = bound[0].replace( /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' ).replace('㎡','').replace(',', '').trim(),
							max = bound[1].replace( /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' ).replace('㎡','').replace(',', '').trim(),
							text = z.toComma(Math.round((parseInt(min) / zo.py2m))) + ' 이상 ~ ' + z.toComma(Math.round((parseInt(max) / zo.py2m))) + ' 미만';								
					} else {
						var odd = bound[0].replace( /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' ).replace('㎡','').replace(',', '').trim();
						if(odd == "1000") {
							text =  z.toComma(Math.round((parseInt(odd) / zo.py2m))) + ' 미만';														
						} else {
							text =  z.toComma(Math.round((parseInt(odd) / zo.py2m))) + ' 이상';
						}
					}	
					pyArr.push(text);									
				} 
				self.pyArr = pyArr.slice();
			} else {
				for (var i in areaArr) {
					var bound = areaArr[i].split('~');
					if(bound.length > 1) {
						var min = bound[0].replace( /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' ).replace('㎡','').replace(',', '').trim(),
							max = bound[1].replace( /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' ).replace('㎡','').replace(',', '').trim(),
							text = z.toComma(parseInt(min)) + ' 이상 ~ ' + z.toComma(parseInt(max)) + ' 미만';								
					} else {
						var odd = bound[0].replace( /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' ).replace('㎡','').replace(',', '').trim();
						if(odd == "1000") {
							text =  z.toComma(odd) + ' 미만';														
						} else {
							text =  z.toComma(odd) + ' 이상';
						}
					}	
					pyArr.push(text);									
				} 
				self.pyArr = pyArr.slice();				
			}
		},
		
		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
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
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' 
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
			if (! self.isBizdist) {
				switch (self.param.jusoCd) {
					case 'emd':
						param.pnu = param.pnu.substring(0, 5);
						break;
					case 'sgg':
						param.pnu = param.pnu.substring(0, 2);
						break; 
				}
			}	
			
			
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
				case 4:
					endYMD = moment().endOf('month');
					diffPeriod = endYMD.diff(startYMD, 'months') + 1;
					
					var tmp = startYMD.clone();
					
					for (var i = 0; i < diffPeriod; ++i) {
						xAxisArr.push(tmp.format('YYYY.MM'));
						xAxisPeriod.push(tmp.format('YYYYMM'));
						tmp.add(1, 'month');
					}					
					
					break;
			}
			
			param.endYMD = 'custom' !== self.searchDtl.radioTimeBound ? endYMD : self.endYMD;

			self.diffPeriod = diffPeriod;
			self.xAxisPeriod = xAxisPeriod;
			self.xAxisArr = xAxisArr;

			param.queryname = "4번";
			return z.xAsync('averageTrading', '평균매매가추이테이블', 'select', param, 'json').done(function(resp){
			
				var rawDataArr = self.rawDataArr = resp,
					dongColumnNm = self.isSgg ? 'sggnm': 'dongnm'; 
					
				// 정렬: 동이름, 상가종류 오름차순, 층, 연면적
				rawDataArr = rawDataArr.sort(function(a, b) {
					if (a[dongColumnNm] < b[dongColumnNm]) {
						return -1;
					}
					if (a[dongColumnNm] > b[dongColumnNm]) {
						return 1;
					}
										
					var aFloorType = floorTypeMap[a['층정보']],
						bFloorType = floorTypeMap[b['층정보']]; 
						
					if (aFloorType < bFloorType) {
						return -1;
					}
					if (aFloorType > bFloorType) {
						return 1;
					}
	
					var aType = sanggaTypeMap[a['상가유형']],
						bType = sanggaTypeMap[b['상가유형']];
						
					if (aType < bType) {
						return -1;
					}
					if (aType > bType) {
						return 1;
					}
					return 0;
				});
			});
		},	
		
		updateDataBySanggaType: function() {
			
			var self = this,
				rawDataArr = self.rawDataArr,
				diffPeriod = self.diffPeriod,
				dongArr = self.dongArr,
				sanggaArr = self.sanggaArr,
				floorArr = self.floorArr,
				areaArr = self.areaArr,
				isSgg = self.isSgg,
				isPy = self.isPy === 'py' ? true : false ,
				isSelected = false,
				isBizdist = self.param.isBizdist,
				areaStd = '',
				priceStd = '',
				resultArr = [],
				mergeArr = [];
			
			if (self.searchDtl && self.searchDtl.radioResultArea) {			
				areaStd = self.searchDtl.radioResultArea ===  "전용면적" ? "전용면적" : "계약면적";
			}
						
			if(self.param.dongnm !== '전체') {
				isSelected = true;
			} else {
				isSelected = false;
			}	
			
			var rawArr = JSON.parse(JSON.stringify(rawDataArr));

			var row = {
					dongnm: isBizdist ? self.param.bizdistnm : (isSgg ? self.param.sidonm : self.param.sggnm),
//					dongnm: isSgg ? self.param.sidonm : self.param.sggnm,
					sanggaData : [],
					// 지역별 평균분양가
					dongPriceSum: Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;}),
					dongAreaSum: Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;}),
					dongAvg: Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;})
			}	

			var columnArr = sanggaArr;
			
			for (var i in dongArr) {
				var dongData = $.extend(true, {}, row);
				dongData.dongnm = dongArr[i];
				
				for (var j in columnArr) {
					dongData.sanggaData.push({
						sanggaType: sanggaArr[j],
						
						// 상가별 평균분양가 
						sanggaPriceSum: Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;}),
						sanggaAreaSum: Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;}),
						sanggaAvg: Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;}),
						
						// 층별 평균분양가
						priceSum: Array.apply(null, Array(floorArr.length)).map(function() {
							return Array.apply(null, Array(self.diffPeriod)).map(function() { return 0});
						}),
						areaSum: Array.apply(null, Array(floorArr.length)).map(function() {
							return Array.apply(null, Array(self.diffPeriod)).map(function() { return 0});
						}),
						floorPrice: Array.apply(null, Array(floorArr.length)).map(function() {
							return Array.apply(null, Array(self.diffPeriod)).map(function() { return 0});
						}),
					})
				}
				
				resultArr.push(dongData)
			}
			
			for (var i in rawDataArr) {
				var rawData = rawDataArr[i],
					idxDong = isBizdist ? 0 : dongArr.indexOf(isSgg ? rawData.sggnm : rawData.dongnm),
					idxSangga = sanggaArr.indexOf(rawData['상가유형']),
					idxFloor = floorArr.indexOf(rawData['층']);
				
				//if (0 > idxDong || 0 > idxSangga + 1 || 0 > idxFloor + 1 || 0 > parseInt(rawData['period'])) {
				if (0 > idxDong || 0 > idxSangga || 0 > idxFloor || 0 > parseInt(rawData['period'])) {
					continue;
				};
				
				var dongData = resultArr[idxDong],
					idxYear = self.xAxisPeriod.indexOf(rawData['period']);
				
				dongData.sanggaData[idxSangga].priceSum[idxFloor][idxYear] += parseFloat(rawData['매매가']);
				dongData.sanggaData[idxSangga].areaSum[idxFloor][idxYear] += parseFloat(rawData[areaStd]);
				dongData.sanggaData[idxSangga].sanggaPriceSum[idxYear] += parseFloat(rawData['매매가']);
				dongData.sanggaData[idxSangga].sanggaAreaSum[idxYear] += parseFloat(rawData[areaStd]);
				dongData.dongPriceSum[idxYear] += parseFloat(rawData['매매가']);
				dongData.dongAreaSum[idxYear] += parseFloat(rawData[areaStd]);
			}
			
			// 층별 평균 분양가
			for (var i in resultArr) {
				var sanggaData = resultArr[i].sanggaData;
				
				for (var j in sanggaData) {
					var priceSum = sanggaData[j].priceSum,
						areaSum = sanggaData[j].areaSum,
						floorPrice = sanggaData[j].floorPrice;
					
					for (var k = 0, kLength = priceSum.length; k < kLength; k++) {
						var pSum = priceSum[k],
							aSum = areaSum[k],
							fSum = floorPrice[k];
						
						for (var h = 0, hLength = pSum.length; h < hLength; h++) {
							if(pSum[h] > 0 && aSum[h] > 0) {
								fSum[h] = z.toComma(Math.round((pSum[h] / aSum[h]) * (isPy === true ? zo.py2m : 1)));
							} else {
								fSum[h] = '-';
							}
						}
					}
				}
			}
			
			// 상가별 평균 분양가
			for (var i in resultArr) {
				var sangData = resultArr[i].sanggaData;
				
				for (var j in sangData) {
					var sanggaPriceSum = sangData[j].sanggaPriceSum,
						sanggaAreaSum = sangData[j].sanggaAreaSum,
						sanggaAvg = sangData[j].sanggaAvg;
					
					for (var k = 0, klength = sanggaPriceSum.length; k < klength; k++) {
						if (sanggaPriceSum[k] > 0 && sanggaAreaSum[k] > 0) {
							sanggaAvg[k] = z.toComma(Math.round((sanggaPriceSum[k] / sanggaAreaSum[k]) * (isPy === true ? zo.py2m : 1)));  
						} else {
							sanggaAvg[k] = '-';
						}
					}
				}
			}
			
			for (var i in resultArr) {
				var dongPriceSum = resultArr[i].dongPriceSum,
					dongAreaSum = resultArr[i].dongAreaSum,
					dongAvg = resultArr[i].dongAvg;
				
				for (var j = 0, jLength = dongPriceSum.length; j < jLength; j++) {
					if (dongPriceSum[j] > 0 && dongAreaSum[j] > 0) {
						dongAvg[j] = z.toComma(Math.round((dongPriceSum[j] / dongAreaSum[j]) * (isPy === true ? zo.py2m : 1)));
					} else {
						dongAvg[j] = '-';
					}
				}
			}
			
			var SggRow = {
				dongnm: isBizdist ? self.param.bizdistnm : (isSgg ? self.param.sidonm : self.param.sggnm),
	//			dongnm: isSgg ? self.param.sidonm : self.param.sggnm,
				sanggaData : [],
				// 총 평균분양가
				dongPriceSum: Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;}),
				dongAreaSum: Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;}),
				dongAvg: Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;})
			}
			
			var sggDongData = $.extend(true, {}, SggRow);

			for (var i in columnArr) {
			    sggDongData.sanggaData.push({
					sanggaType: sanggaArr[i],
							
					// 상가별 평균분양가 
					sanggaPriceSum: Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;}),
					sanggaAreaSum: Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;}),
					sanggaAvg: Array.apply(null, Array(self.diffPeriod)).map(function() {return 0;}),
					
					// 층별 평균분양가
					priceSum: Array.apply(null, Array(floorArr.length)).map(function() {
						return Array.apply(null, Array(self.diffPeriod)).map(function() { return 0});
					}),
					areaSum: Array.apply(null, Array(floorArr.length)).map(function() {
						return Array.apply(null, Array(self.diffPeriod)).map(function() { return 0});
					}),
					floorPrice: Array.apply(null, Array(floorArr.length)).map(function() {
						return Array.apply(null, Array(self.diffPeriod)).map(function() { return 0});
					}),
			    })
			}
			
			mergeArr.push(sggDongData);
			
			for (var i in rawArr) {
				var rawData = rawArr[i],
//					idxDong = isBizdist ? 0 : dongArr.indexOf(isSgg ? rawData.sggnm : rawData.dongnm),
					idxSangga = sanggaArr.indexOf(rawData['상가유형']),
					idxFloor = floorArr.indexOf(rawData['층정보']);
				
				if ( 0 > idxSangga || 0 > idxFloor || 0 > parseInt(rawData['period'])) {
				//if ( 0 > idxSangga + 1 || 0 > idxFloor + 1 || 0 > parseInt(rawData['period'])) {
					continue;
				};
				
//				var dongData = resultArr[idxDong],
				var	idxYear = self.xAxisPeriod.indexOf(rawData['period']),
					merArr = mergeArr[0];
				
				merArr.sanggaData[idxSangga].priceSum[idxFloor][idxYear] += parseFloat(rawData['매매가']);
				merArr.sanggaData[idxSangga].areaSum[idxFloor][idxYear] += parseFloat(rawData[areaStd]);
				merArr.sanggaData[idxSangga].sanggaPriceSum[idxYear] += parseFloat(rawData['매매가']);
				merArr.sanggaData[idxSangga].sanggaAreaSum[idxYear] += parseFloat(rawData[areaStd]);
				merArr.dongPriceSum[idxYear] += parseFloat(rawData['매매가']);
				merArr.dongAreaSum[idxYear] += parseFloat(rawData[areaStd]);
			}	
			
			// 층별 분양가
			var merge = mergeArr[0];
			for (var i in merge.sanggaData) {
				var mergePriceSum = merge.sanggaData[i].priceSum,
					mergeAreaSum = merge.sanggaData[i].areaSum,
					mergeAvg = merge.sanggaData[i].floorPrice;
				
				for (var j = 0, jlength = mergePriceSum.length; j < jlength; j++) {
					var mPriceSum = mergePriceSum[j],
						mAreaSum = mergeAreaSum[j],
						mAvg = mergeAvg[j];
					
					for (var k = 0, kllength = mPriceSum.length; k < kllength; k++) {
						if (mPriceSum[k] > 0 && mAreaSum[k] > 0) {
							mAvg[k] = z.toComma(Math.round((mPriceSum[k] / mAreaSum[k]) * (isPy === true ? zo.py2m : 1)));
						} else {
							mAvg[k] = '-';
						}
					}  
				}
			}
			
			// 상가별 평균 분양가			
			for (var a in merge.sanggaData) {
				var sanggaPriceSum = merge.sanggaData[a].sanggaPriceSum,
					sanggaAreaSum = merge.sanggaData[a].sanggaAreaSum,
					sanggaAvg = merge.sanggaData[a].sanggaAvg;
				
				for (var b = 0, bLength = sanggaPriceSum.length; b < bLength; b++) {
					if (sanggaPriceSum[b] > 0 && sanggaAreaSum[b] > 0) {
						sanggaAvg[b] = z.toComma(Math.round((sanggaPriceSum[b] / sanggaAreaSum[b]) * (isPy === true ? zo.py2m : 1)));
					} else {
						sanggaAvg[b] = '-';
					}
				}
			}
			
			for (var i = 0, iLength = merge.dongPriceSum.length; i < iLength; i++) {
				if (merge.dongPriceSum[i] > 0 && merge.dongAreaSum[i] > 0) {
					merge.dongAvg[i] = z.toComma(Math.round((merge.dongPriceSum[i] / merge.dongAreaSum[i]) * (isPy === true ? zo.py2m : 1)));;
				} else {
					merge.dongAvg[i] = '-';
				}					
			}		
		
			self.mergeArr = mergeArr;
			self.resultArr = resultArr;
			/* 상권조회는 합산결과만 표시 */
			if (self.param.isBizdist) {
				self.resultArr = [self.resultArr[0]];
			} else {
				// 특정 시군구/읍면동 선택 시 선택한 데이터만 표시
				if ('전체' !== self.param.dongnm) {
					self.resultArr = [
						//self.resultArr[0],
						self.resultArr.filter(function(elm) {
							return elm.dongnm === self.param.dongnm;
						})[0]
					];
				}
			}	
			isSelected = false;				
		
		},			
				
		updateData: function() {					
			var self = this,
				columnMode = self.columnMode,
				tmplDefault = Handlebars.compile($('#tmplTablaverageTradingDefault').html()),
				tmpl = Handlebars.compile($('#tmplTableaverageTradingSanggaType').html()),
				$tr = self.$thead.find('tr:first-child'),
				isPy = self.isPy === 'py' ? true : false,
				sanggaCopyArr = $.extend([], true, self.sanggaArr),
				floorCopyArr = $.extend([], true, self.floorArr),			
				classNameArr = Array.apply(null, Array(self.floorArr.length - 1)).map(function() {return '';}),
				firstLineArr = Array.apply(null, Array(self.floorArr.length)).map(function() {return false;});
			
			var areaCopyArr = $.extend([], true, self.pyArr);
			
			$tr.find('th[rowspan="2"]:not("[data-dont-delete]")').remove();

			for (var i = 0, len = self.xAxisArr.length; i < len; ++i) {
				var $th = $('<th/>', {rowspan: '2', text: self.xAxisArr[i]});				
				$tr.append($th);
			}	
			
//			classNameArr.unshift('total');
			classNameArr.push('tr-border');
			firstLineArr.unshift(true);								
			
			// 상권조회는 합산결과만 표시
			if(self.param.isBizdist){
				self.$tbody.html('').append(tmpl({sanggaTypeArr: sanggaCopyArr
												, floorTypeArr: floorCopyArr
												, dataArr: self.mergeArr
												, classNameArr: classNameArr
												, firstLineArr: firstLineArr	
												, dongRowSpan : ((sanggaCopyArr.length) * (floorCopyArr.length + 1)) + 1
												, floorRowSpan : (floorCopyArr.length + 1)
												}));		

			} else if(!self.param.isBizdist) {							
				self.$tbody.html('').append(tmpl({sanggaTypeArr: sanggaCopyArr
												, floorTypeArr: floorCopyArr
												, dataArr: self.mergeArr
												, classNameArr: classNameArr
												, firstLineArr: firstLineArr	
												, dongRowSpan : ((sanggaCopyArr.length) * (floorCopyArr.length + 1)) + 1
												, floorRowSpan : (floorCopyArr.length + 1)
												}));

				self.$tbody.append(tmplDefault({sanggaTypeArr: sanggaCopyArr
												, floorTypeArr: floorCopyArr
												, dataArr: self.resultArr
												, classNameArr: classNameArr
												, firstLineArr: firstLineArr	
												, dongRowSpan : ((sanggaCopyArr.length) * (floorCopyArr.length + 1)) + 1
												, floorRowSpan : (floorCopyArr.length + 1)
												}));
			};
					
			$('[data-sanggaArea-text]').text('상가유형별 ');
			
			self.resultArr = [];
			self.mergeArr = [];

			$('#tbody_5_1 .maintotal').click();
		},
		
		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			setTimeout(function() {
//				var $header = $('#table_5_1');
				var $table = self.$tbody.closest('table');
				
//				var wsHeader = XLSX.utils.table_to_sheet($header[0]);
				var wsBody = XLSX.utils.table_to_sheet($table[0], {
					display: true
				});
				
//				var jsonHeader = XLSX.utils.sheet_to_json(wsHeader, {header: 1});
				var jsonBody = XLSX.utils.sheet_to_json(wsBody, {header: 1});
							
				jsonBody[0][1] = '구분';
//				jsonBody[0][3] = '검색옵션';

//				var jsonMerge = jsonHeader.concat(jsonBody);
				var jsonMerge = jsonBody;
			
				var lastLabelArr = ['', ''];
				for (var i in jsonBody) {
					var row = jsonBody[i];
					
					for (var j in lastLabelArr) {
						if (! row[j]) {
							if (row[2] || '지역별 평균매매가' === row[1]) {
								row[j] = lastLabelArr[j];
							}
						} else {
							if (lastLabelArr[j] !== row[j]) {
								lastLabelArr[j] = row[j];
							}
						}
					}
				}
				
				for (var i in jsonBody) {
					var row = jsonBody[i];

					for (var j in row) {
						if (! row[0] && ! row[2]) {
							jsonBody[i] = [];
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
				apiSearchEmd.addDownloadLog('추이_데이터');		
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
			
//			if (self.searchDtl && self.searchDtl.pastYMD) {
//				self.startYMD = self.searchDtl.pastYMD;
//				self.endYMD = self.searchDtl.endYMD;
//			}
			
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
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {
		},
		
				// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
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
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' 
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
				case 4:
					endYMD = moment().endOf('month');
					diffPeriod = endYMD.diff(startYMD, 'months') + 1;
					
					var tmp = startYMD.clone();
					
					for (var i = 0; i < diffPeriod; ++i) {
						xAxisArr.push(tmp.format('YYYY.MM'));
						xAxisPeriod.push(tmp.format('YYYYMM'));
						tmp.add(1, 'month');
					}					
					
					break;
			}
			
			param.endYMD = 'custom' !== self.searchDtl.radioTimeBound ? endYMD : self.endYMD;

			param.queryname = "5번";
			return z.xAsync('averageTrading', '평균매매가추이테이블', 'select', param, 'json').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
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
				dataArr = [];
				
				dataArr = self.rawDataArr;
				console.log('b');
				console.log(dataArr);
				var rowdatatable = $('#rowDataTable').KTDatatable({
					data: {
		                type: 'local',
		                source: dataArr,
		                pageSize: 10,
		                pageSizeSelect: [10, 20, 30, 50, 100]
		            },
		            // layout definition
		        	layout: {
		                scroll: true, // enable/disable datatable scroll both horizontal and vertical when needed.
		                minHeight: 400,
		                footer: false, // display/hide footer
		            },            
		            // column sorting
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
		                title: '전용면적',
		                width: 80,
		                textAlign: 'center'
		            }, {
		            	field: '계약면적',
		                title: '계약면적', 
		                width: 80,
		                textAlign: 'center'
		            }, {
		            	field: '매매가',
		                title: '매매가',
		                width: 100,
		                textAlign: 'center',
		                template: function(row) {
		                    return z.toComma(row.매매가);
		                }
		            }]
				});
				self.rowdatatable = rowdatatable;
			
		},	
		
		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				self.updateData(true);
				
//				var $header = $('#table_5_2');
				var $table = self.$tbody.children('table');
				
//				var wsHeader = XLSX.utils.table_to_sheet($header[0]);
				
				var wsBody = XLSX.utils.table_to_sheet($table[0], {raw: true});
				
//				var jsonHeader = XLSX.utils.sheet_to_json(wsHeader, {header: 1});
				var jsonBody = XLSX.utils.sheet_to_json(wsBody, {header: 1});

//				for (var i = 1; i < jsonBody.length; ++i) {
//					for (var j = 0; j < 10; ++j) {
//						if (jsonBody[i][j] != '-' && j === 9) {
//							jsonBody[i][j] = jsonBody[i][j] * 100;
//						}
//					}
//				}
				
//				var jsonMerge = jsonHeader.concat(jsonBody);
				var jsonMerge = jsonBody;

				var ws = XLSX.utils.json_to_sheet(jsonMerge, {skipHeader: true});				

				self.$tbody.find('[data-hidden]').hide();

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
	
	// 사용자 설정 평균분양가 추이 합산
	var tableaverageTradingSum = {
		init: function(param, searchDtl) {
			var self = this;

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
			// FIXME: 이름으로 매칭했는데, 법정동코드로 해야되면 수정 필요
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
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					startYMD: self.startYMD,
					endYMD: 'custom' !== self.searchDtl.radioTimeBound ? '' : self.endYMD,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' 
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
						param.pnu = param.pnu.substring(0, 5);
						break;
					case 'sgg':
						param.pnu = param.pnu.substring(0, 2);
						break; 
				}
			}

			return z.xAsync('averageTrading', '평균매매가시도추이차트', 'select', param, 'json').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
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
				columnNm = 'sggnm',
				sumNm = self.param.sidonm,
				areaStd = '',
				price = '매매가';

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
						dongArr = apiSearchEmd.getSggArr();
						break;
				}
			}

			// 면적 기준 ex) 전용면적, 계약면적
			if (self.searchDtl && self.searchDtl.radioResultArea) {
				areaStd = self.searchDtl.radioResultArea === "전용면적" ? "전용면적" : "계약면적";
			}
			
			for (var i in dongArr) {
				dataArr.push({
					dongnm: dongArr[i].dongnm || dongArr[i].sggnm,
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
						dataArr[j].sum += parseFloat(row[price]);
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
				
//				var $header = $('#table_5_3');
				var $table = self.$tbody.closest('table');
				
//				var wsHeader = XLSX.utils.table_to_sheet($header[0]);
				var wsBody = XLSX.utils.table_to_sheet($table[0]);
				
//				var jsonHeader = XLSX.utils.sheet_to_json(wsHeader, {header: 1});
				var jsonBody = XLSX.utils.sheet_to_json(wsBody, {header: 1});

//				var jsonMerge = jsonHeader.concat(jsonBody);
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

		//	chartRentVariationAll.init();
		//	chartRentVariationYear.init();
			
		//	chartRentVariationDong.init();
		//	chartRentVariationSanggaType.init();
			
		//	chartRentVariationDong.hide();
		//	chartRentVariationSanggaType.hide();
        },

		setBtnListener: function() {
			var self = this;
			
			$('[data-btn-download="table_5_1"]').click(function() {
				if(_isDemo) {
					z.msg(_DemoMsgDownloadX);
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
							//if($(item).children().eq(0).attr('rowspan') == len || $(item).children().eq(0).attr('rowspan') == sanggalen+1){
							$(item).children().eq(0).attr('rowspan','1');
							//}	
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
			
			$('[data-btn-download="table_5_2"]').click(function() {
				if(_isDemo) {
					z.msg(_DemoMsgDownloadX);
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

				tableAverageSalesSum.init(param, searchDtl);
			} else {
				$('[data-ui-user-date=true]').hide();
				$('[data-ui-user-date=false]').show();
				chartaverageTradingAll.init(param, searchDtl);
				tableaverageTradingSanggaType.init(param, searchDtl); //5_1
			}	
			tableaverageTradingDetail.init(param, searchDtl);
		}
    };
}();

$(function() {
	$.when(
		//$.getScript('/resources/admin/APPS/dashboard/apiSearchEmd.js'),
		$.getScript('/resources/admin/APPS/dashboard/apiSearchAreaMap.js'),
		$.getScript('/resources/admin/APPS/dashboard/averageTradingSearch.js'),
		$.getScript('/resources/common/custom/js/commonDashboard.js')
	).done(function() {
		/*
		apiSearchEmd.init({
			addrSearchWrapper: $('[data-wrapper="addr"]'),
			bizdistSearchWrapper: $('[data-wrapper="bizdist"]'),
			btnShowAddr: $('#ktAreaBtn'),
			btnShowBizdist: $('#ktStrBtn'),
			bizdistSearchText: $('[name=bizdistSearchText]'),
			addrSearchText: $('[name=addrSearchText]'),
			listSido: $('[name=listSido]'),
			listSgg: $('[name=listSgg]'),
			listDong: $('[data-list-dong]'),
			listSidoBizdist: $('[name=listSidoBizdist]'),
			listSggBizdist: $('[name=listSggBizdist]'),
			listBizdist: $('[data-list-bizdist]'),
			dongCdListener: RentVariation.setDongCd,
			btnTag: 'list'
		});
		*/
		
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

		z.formatDataReference('매물').done(function(refText) {
			$('.dashboard .reference').text(refText);
		});
	});
	
});
