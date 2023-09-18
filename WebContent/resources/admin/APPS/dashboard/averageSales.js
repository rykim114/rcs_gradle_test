'use strict';
// Class definition

var apiSearchEmd;
var excelyn;
var dtlexcelyn;
var apiAverageSales = function() { 
    // Private functions
       
	var sanggaTypeArr = [];
	var sanggaTypeMap = {};

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
	
	var floorTypeArr = [
		'B1 이하',
		'1F',
		'2F',
		'3F',
		'4F 이상'
	];
	
	var floorTypeMap = {
		'B1 이하': 0,
		'1F': 1,
		'2F': 2,
		'3F': 3,
		'4F 이상': 4
	}

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
	var chartAverageSalesAll = {
		
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
			if (self.searchDtl && 'area' === self.searchDtl.columnMode) {
				self.columnMode = 'area';
			}
		
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
			            export: {
							csv: {
								headerCategory: '\uFEFF',
								filename: '평균분양가_추이'
							}	
						}
			        },
					events: {
						click: function(event, chartContext, config) {
							var maxIdxDate = config.globals.categoryLabels[config.dataPointIndex],
								maxDate,
								$target = $(event.target);
								
							if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG') || $target.hasClass('exportCSV')) {
								z.addDownloadLog('추이', 'chart');
							}						
							
			    			if(excelyn == "N"){
			    				$('#chart_1_1 .exportCSV').css("display", "none");
							} else {
								$('#chart_1_1 .exportCSV').css("display", "block");
							};
							
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
						text: '평균 분양가'
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
			
			return z.xAsync('AverageSales', '평균분양가상세', 'select', param, 'json').done(function(resp) {
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
					name: '구간별 평균분양가',
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
					result = parseFloat(raw['분양가']);
					
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
				
			chartAverageSalesYear.init(param, searchDtl);
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = self.xAxisArr,
				yAxisArr = self.yAxisArr, // yAxisObj
				excelData = [],
				excelOpt = {header: ['평균분양가']};
		
			return result;
		}
	};


	// 최근 5구간 평균분양가 추이 차트: 상가유형별 or 연면적별
	var chartAverageSalesYear = {
		
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
			if (self.searchDtl && 'area' === self.searchDtl.columnMode) {
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
				};
			} else {
				self.isCustomSangga = false;
				self.sanggaArr = $.extend(true, [], sanggaTypeArr);
				self.sanggaMap = $.extend(true, {}, sanggaTypeMap);
			}
			
			if (self.searchDtl && self.searchDtl.checkAreaBound.length) {
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

			} else {
				self.isCustomArea = false;
				self.areaArr = $.extend(true, [], areaTypeArr);
				self.areaMap = $.extend(true, {}, areaTypeMap);
				
				if (self.isPy) {
					self.areaPyArr = $.extend(true, [], areaPyTypeArr);
					self.areaPyMap = $.extend(true, {}, areaPyTypeMap);	
				}				
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
			            export: {
							csv: {
								headerCategory: '\uFEFF',
								filename: '최근 5구간 평균분양가'
							}	
						}
			        },
					events: {
						dataPointSelection: function(event, chartContext, config) {
							var idx = config.dataPointIndex,
								name = '',
								distrVal = '';

							self.param.maxDateIdx = self.xAxisPeriod[idx];

							var distrNameVal = config.w.config.series[config.seriesIndex].name;
							
							if (self.columnMode === 'sangga') {
								name = self.sanggaMap[distrNameVal].toString().trim();
								distrVal = self.sanggaMap[distrNameVal];	
							} else {
								if (self.isPy) {
									name = self.areaPyMap[distrNameVal].toString().trim();
									distrVal = self.areaPyMap[distrNameVal];
								} else {									
									name = self.areaMap[distrNameVal].toString().trim();
									distrVal = self.areaMap[distrNameVal];	
								};
								
							}

							self.distrName = distrVal;						
							self.$wrapper.find('.clickYears').children('span').removeClass('on');
							$('.clickYears').children('span').eq(idx).addClass('on');
						
							self.loadNextObj(self.param, self.searchDtl);							
						},
						
				       	click: function(event, chartContext, config) {
							var $target = $(event.target);
												
							if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG') || $target.hasClass('exportCSV')) {
								z.addDownloadLog('5구간', 'chart');
							}						
							
			    			if(excelyn == "N"){
			    				$('#chart_2_1 .exportCSV').css("display", "none");
							} else {
								$('#chart_2_1 .exportCSV').css("display", "block");
							};
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
						self.loadNextObj(param, searchDtl);
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

			return z.xAsync('AverageSales', '평균분양가상세', 'select', param, 'json').done(function(resp) {
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
				
				var aAreaType = areaMap[a['연면적코드']],
					bAreaType = areaMap[b['연면적코드']];
					
				if (aAreaType < bAreaType) {
					return -1;
				}
				if (aAreaType > bAreaType) {
					return 1;
				}

				if (a['분양일'] < b['분양일']) {
					return -1;
				}
				if (a['분양일'] > b['분양일']) {
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
//			self.yAxisArr = chartSeries;

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

			if (columnMode === 'sangga') {
				dataArr = self.sanggaArr;
				stdNm = '상가유형';
			} else if (columnMode === 'area') {
				var areaArr = self.areaArr;
				stdNm = '연면적코드';
				
				if (isPy) {					
					for (var i in areaArr) {
						var bound = areaArr[i].split('~');	
						
						if (bound.length > 1) {
							var min = bound[0].replace( /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' ).replace('㎡','').replace(',', '').trim(),
								max = bound[1].replace( /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' ).replace('㎡','').replace(',', '').trim(),
								text = z.toComma(Math.round((parseInt(min) / zo.py2m))) + '평~' + z.toComma(Math.round((parseInt(max) / zo.py2m))) + '평';								
						} else {
							var odd = bound[0].replace( /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' ).replace('㎡','').replace(',', '').trim();
							if(odd == "1000") {
								text =  z.toComma(Math.round((parseInt(odd) / zo.py2m))) + '평 미만';														
							} else {
								text =  z.toComma(Math.round((parseInt(odd) / zo.py2m))) + '평 이상';
							}
						}
						pyArr.push(text);									
					} 
					dataArr = pyArr.slice();
				} else {
					dataArr = areaArr.slice();
				}			
			} 					
			
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
					idxData = columnMode === 'sangga' ? self.sanggaMap[raw[stdNm]] : self.areaMap[raw[stdNm]],  
					result = parseFloat(raw['분양가']),
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

			chartAverageSalesDong.init(param, searchDtl);
			tableCompare.init(param, searchDtl);
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = self.xAxisArr,
				yAxisArr = self.yAxisArr,
				excelData = [],
				excelOpt = {header: ['평균분양가']};

			return result;
		}
	};
	
	
	// 상가 유형 or 연면적별 공급 추이 차트 
	var chartAverageSalesDong = {		
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
			
			if (self.searchDtl && self.searchDtl.checkAreaBound.length) {
				
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

			} else {
				self.isCustomArea = false;
				self.areaArr = $.extend(true, [], areaTypeArr);
				self.areaMap = $.extend(true, [], areaTypeMap);
				
				if (self.isPy) {
					self.areaPyArr = $.extend(true, [], areaPyTypeArr);
					self.areaPyMap = $.extend(true, {}, areaPyTypeMap);
				}
			}			
			
	
			if (self.searchDtl && self.searchDtl.checkFloorBound.length) {
				self.isCustomFloor = true;
				self.floorArr = $.extend(true, [], self.searchDtl.checkFloorBound);
			} else {
				self.isCustomFloor = false;
				self.floorArr = $.extend(true, [], floorTypeArr);
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

				var typeName = 'sanggaArea';
				
				if (self.$distrWrapper.children('li')) {
					self.$distrWrapper.children('li').remove();
				}

				switch (self.columnMode) {
					case 'sangga':
						for (var i = 0; i < self.sanggaArr.length; ++i) {
							var text = self.sanggaArr[i],
								sanggaLi = '<li><span></span>' + text + '</li>';								
							
							$(sanggaLi).appendTo(self.$distrWrapper);
							$(self.$distrWrapper).children('li').eq(i).attr('name', typeName);														
							
							if (i === self.distrVal) {								
								$(self.$distrWrapper).children('li').eq(i).addClass('on');
							} else {
								$(self.$distrWrapper).children('li').eq(i).removeClass('on');
							}							
						}
						
						break;
					case 'area' :
						var areaArr = self.areaArr,
							dataArr = [],
							pyArr = [];
						
						if (self.isPy) {
							
							for (var i in areaArr) {
								var bound = areaArr[i].split('~');
								if(bound.length > 1) {
									var min = bound[0].replace( /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' ).replace('㎡','').replace(',', '').trim(),
										max = bound[1].replace( /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' ).replace('㎡','').replace(',', '').trim(),
										text = z.toComma(Math.round((parseInt(min) / zo.py2m))) + '평~' + z.toComma(Math.round((parseInt(max) / zo.py2m))) + '평';								
								} else {
									var odd = bound[0].replace( /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' ).replace('㎡','').replace(',', '').trim();
									if(odd == "1000") {
										text =  z.toComma(Math.round((parseInt(odd) / zo.py2m))) + '평 미만';														
									} else {
										text =  z.toComma(Math.round((parseInt(odd) / zo.py2m))) + '평 이상';
									}
								}	
								pyArr.push(text);									
							} 
							dataArr = pyArr.slice();
						} else {
							dataArr = areaArr.slice();				
						}
						
						for (var i = 0; i < dataArr.length; ++i) {
							var text = dataArr[i],
								areaLi = '<li><span></span>' + text + '</li>';								
							
							$(areaLi).appendTo(self.$distrWrapper);
							$(self.$distrWrapper).children('li').eq(i).attr('name', typeName);														
							
							if (i === self.distrVal) {								
								$(self.$distrWrapper).children('li').eq(i).addClass('on');
							} else {
								$(self.$distrWrapper).children('li').eq(i).removeClass('on');
							}							
						}
						break;
				}
				
				self.loadData().done(function(resp) {
					self.loadAxis();
					self.updateData();
				});
			}

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
			var self = this,
				$distrWrapper = $('[data-wrapper="sanggaArea"]');

			$distrWrapper.off('click').on('click', '[name=sanggaArea]', function() {
				
				var $click = this.innerText,
					distrVal = 0;
				
				switch (self.columnMode) {
					case 'sangga' :
						distrVal = self.sanggaArr.indexOf($click);						
						break;
					case 'area' :
						if (self.isPy) {
							distrVal = self.areaPyArr.indexOf($click);
						} else {
							distrVal = self.areaArr.indexOf($click);							
						}
						break;
				}

				self.param.distrName = distrVal;
				self.init(self.param, self.searchDtl);
				tableCompare.init(self.param, self.searchDtl);									
			});
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

			return z.xAsync('AverageSales', '평균분양가상세', 'select', param, 'json').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;
				
			});
		},
		
		loadCondition: function() {
		},


		loadAxis: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				rawDataArrStd = [], 
				columnMode = self.columnMode,
				distrVal = self.distrVal,
				sanggaMap = self.sanggaMap,
				areaMap = self.areaMap,
				xAxisArr = [],
				areaStd = '',
				isPy = self.isPy === 'py' ? true : false,
				defaultPrice;

			// 정렬: 동이름, 상가종류 오름차순
			rawDataArr = rawDataArr.sort(function(a, b) {
				if (a['dongnm'] < b['dongnm']) {
					return -1;
				}
				if (a['dongnm'] > b['dongnm']) {
					return 1;
				}

				var aType = sanggaMap[a['상가유형']],
					bType = sanggaMap[b['상가유형']];
					
				if (aType < bType) {
					return -1;
				}
				if (aType > bType) {
					return 1;
				}
				
				var aAreaType = areaMap[a['연면적코드']],
					bAreaType = areaMap[b['연면적코드']];
					
				if (aAreaType < bAreaType) {
					return -1;
				}
				if (aAreaType > bAreaType) {
					return 1;
				}	

				return 0;
			});

			if (self.searchDtl && self.searchDtl.radioResultArea) {
				areaStd = self.searchDtl.radioResultArea;
			}

			for (var i in rawDataArr) {
		
				var rawData = rawDataArr[i];

				if (columnMode === 'sangga') {
					if(rawData['상가유형'] != self.sanggaArr[distrVal]) {
						continue;
					} 
				} else if (columnMode === 'area'){
					if (rawData['연면적코드'] != self.areaArr[distrVal]) { 
						continue;
					}
				}

				if (rawData['period'] != self.periodStd) {
					continue;
				}
										
				defaultPrice = areaStd === '전용면적' ? parseFloat(rawDataArr[i].전용면적당분양가) : parseFloat(rawDataArr[i].계약면적당분양가);				
			}			

			// x축 범례 구하기
			var min = defaultPrice * (isPy === true ? zo.py2m : 1),	
				salesPrice = 0,
				max = 0.0,
				gap = 0,
				gapArr = new Array(5),
				gapDataArr = new Array(5);
			
			for (var i in rawDataArr) {
				if (columnMode === 'sangga') {
					if(rawDataArr[i].상가유형 != self.sanggaArr[distrVal]) {
						continue;
					} 
				} else if (columnMode === 'area'){
					if (rawDataArr[i].연면적코드 != self.areaArr[distrVal]) { 
						continue;
					}
				}
				
				if (areaStd === "전용면적") {
					salesPrice = parseFloat(rawDataArr[i].분양가) / parseFloat(rawDataArr[i].전용면적); 
				} else if (areaStd === "계약면적") {
					salesPrice = parseFloat(rawDataArr[i].분양가) / parseFloat(rawDataArr[i].계약면적);
				}

				if (self.isPy) {
					salesPrice = salesPrice * zo.py2m;
				}

				if ( min > salesPrice ) {
					min = salesPrice;
				}
				
				if ( max < salesPrice ) {
					max = salesPrice;
				}	
			}
			
			min = (Math.floor(min / 10)) * 10;
			gap = Math.ceil(((max - min) / 5) / 10) * 10;
			
			var gapData = 0;
			
			for (var i = 0; i < 6; ++i) {
				gapData = min + Math.round(gap * i);
				gapDataArr[i] = gapData;
				
				for (var j = 0; j < 5; ++j) {	
					gapArr[j] = z.toComma(gapDataArr[j]) + '~' + z.toComma(gapDataArr[j+1]);
				}				
			}		
			
			// 값 없을 때 x축 범례 공백 처리
			if (gapArr[0] == "~") {
				for (var i in gapArr) {
					gapArr[i] = "";
				}
			}		

			// 엑셀 저장용 정보로도 활용될 예정
			xAxisArr = gapArr.slice();
			self.xAxisArr = xAxisArr;			
			self.gapDataArr = gapDataArr; 
			self.gapArr = gapArr;
			self.distrVal = distrVal;
//			self.gap = Math.ceil(gap); 
			//self.yAxisObj = yAxisObj;
		},

		// 데이터 정제 후에 updateOptions, updateSeries 호출
		updateData: function() { 
			var self = this;
			
			var	chartOptions = {
					xaxis: {
						labels: {
							show: true
						},
						categories: self.xAxisArr
					},
					yaxis: {
						title: {
							text: undefined
						}
					}
				},
				chartSeries = [];								

			self.updateDataByDong(chartOptions, chartSeries);

			// 엑셀 저장용 정보로도 활용될 예정
//			self.yAxisArr = chartSeries;			

			var options = {
				series: chartSeries,
				chart: {
//					width: 400,
					width: '100%',
					height: 180,
					type: 'bar',
					toolbar: {
						show: false
					}
				},
				plotOptions: {
					bar: {
						horizontal: false,
						borderRadius: 8,
			            dataLabels: {
			              position: 'top', // top, center, bottom
			            }
					},
				},
				stroke: {
					width: 1,
					colors: ['#fff']
				},
				tooltip: {
					enabled: true,
			        style: {
			            fontSize: '10px',
			        },
					y: {
					    formatter: function(val) {
					    	var toolTipStr = val + ' 개소';					    	
						
					    	return toolTipStr;
						}
					}
				},
				
				xaxis: {
					categories: self.xAxisArr
				},
				yaxis: {
					title: {
						text: ''
					},
					labels: {
						formatter: function(value) {
							return Math.floor(value);
						}
					},

				},
				responsive: [{
					breakpoint: 360,
					options: {
						chart: {
							width: 150
						},
						legend: {
							position: 'bottom'
						}
					}
				}],
		        dataLabels: {
		          enabled: true,
		          offsetY: -20,
		          style: {
		        	  fontSize: '10px',
		        	  colors: ["#304758"]
		          }
		        }
			};
			
// y축 범례 구간 5개 고정 max 데이터가 5보다 작을 때 차트 정리		
//			var dataArr = chartSeries.slice(),
//				maxVal = 0;
//		
//			dataArr[0].data.map(d => {
//				 maxVal = Math.max(maxVal, d)
//			});
//			
//			if (maxVal < 5) {
//				options.yaxis.max = 5;	
//				options.yaxis.tickAmount = 5;
//			}
			
			if (self.chart) { 
				self.chart.destroy();
			}
			
			var chart = new ApexCharts($(self.apexChart)[0], options);
			
			self.chart = chart;

			chart.render();
		},
		
		updateDataByDong: function(chartOptions, chartSeries) {
			var self = this,
				columnMode = self.columnMode,
				areaArr = self.areaArr,
				areaMap = self.areaMap,
				sanggaArr = self.sanggaArr,
				sanggaMap = self.sanggaMap,
				gapDataArr = self.gapDataArr,
				isPy = self.isPy === 'py' ? true : false,
				gapArr = self.gapArr,
				distrVal = self.distrVal,
				rangeArr,
				prevData,
				areaStd = '',
				price = '',
				stdNm = columnMode === 'sangga' ? '상가유형' : '연면적코드';	

			// 면적 기준							
			if (self.searchDtl && self.searchDtl.radioResultArea) {
				areaStd = self.searchDtl.radioResultArea;
			}

			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr)),
				rangeArr = gapArr === undefined ? 0 : gapArr.length;				

				prevData = {
					name: '',
					data: Array.apply(null, Array(rangeArr)).map(function() {return 0;}),				
				};				

			chartSeries.push(prevData);				

			for (var i in rawDataArr) {
				var raw = rawDataArr[i];
				
				if (areaStd === "전용면적") {
					var rawPrice = parseFloat(rawDataArr[i].전용면적당분양가)
				} else if (areaStd === "계약면적"){
					var rawPrice = parseFloat(rawDataArr[i].계약면적당분양가)
				}

				if (isPy) {					
					rawPrice = rawPrice * zo.py2m;										
				}
				
				prevData = chartSeries[0];
				
				if(columnMode === 'sangga') {
					if(distrVal != sanggaMap[raw[stdNm]]) {
						continue;
					}
				} else {
					if(distrVal != areaMap[raw[stdNm]]) {
						continue;
					}
				}
				
				if (raw['period'] != self.periodStd) {
					continue;
				}

				for ( var j = 0; j < gapDataArr.length - 1; ++j) {
					var k = j + 1;
					if (rawPrice >= gapDataArr[j] && rawPrice < gapDataArr[k]) {		
						prevData.data[j]++;
						prevData.name = raw[stdNm]; 
					}					
				}

			}

			// 연면적 평일 때 범례 출력 수정
			if (isPy && stdNm === "연면적코드" && prevData.name !== "") {

				var mapVal = areaMap[prevData.name],
					mapArr = [];

				prevData.name = Object.keys(self.areaPyMap)[mapVal];

			} 
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = self.xAxisArr,
				yAxisArr = self.yAxisArr,
				excelData = [],
				excelOpt = {header: ['평균분양가']};

			
			return result;
		}
	};
	
	// 비교 테이블
	var tableCompare = {
		
		init: function(param, searchDtl) {
			var self = this;

			self.tableSelector = '#table_3_1';
			self.param = param;
			self.searchDtl = searchDtl;
			self.$wrapper = $('#chart_3_1').closest('[data-chart-wrapper]').show();
			self.startYMD = null;
			self.endYMD = null;
			
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
			
			self.columnMode = 'sangga';
			
			if (self.searchDtl && 'area' === self.searchDtl.columnMode) {
				self.columnMode = 'area';
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
				self.areaMap = $.extend(true, [], areaTypeMap);
			}
			
			if (self.searchDtl && (self.searchDtl.radioPriceUnit == "" || self.searchDtl.radioPriceUnit == 'py')) {
				self.isPy = self.searchDtl.radioPriceUnit;
			} 
			
			if (self.searchDtl && self.searchDtl.checkFloorBound.length) {
				self.isCustomFloor = true;
				self.floorArr = $.extend(true, [], self.searchDtl.checkFloorBound);
			} else {
				self.isCustomFloor = false;
				self.floorArr = $.extend(true, [], floorTypeArr);
			}			
						
			self.setBtnListener();

			if (self.param) {
				self.period = self.param.period;
				
				if (self.param.endYYYY) {
					self.endYYYY = self.param.endYYYY;
				} else {
					self.endYYYY = self.param.xAxisPeriod[self.param.xAxisPeriod.length - 1];
				}			

				if (self.param.distrName) {
					self.distrVal = self.param.distrName;
				} else {
					self.distrVal = 0;
				}

				self.loadCondition();
				
				self.loadData().done(function(resp) {
					self.updateData();
				});
			}
		},
		
		setBtnListener: function() {
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
		
		loadData: function() {
			var self = this,
				resArr = self.resArr,
				periodArr = resArr.slice(),
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					period: self.period		,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' 
				};	
			
			// 해당 기간만 조회				
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

			return z.xAsync('AverageSales', '평균분양가상세', 'select', param, 'json').done(function(resp) {
				self.rawDataArr = resp;
			});
		},
				
		updateData: function() {
			var self = this,
				columnMode = self.columnMode,
				areaMap = self.areaMap,
				sanggaMap = self.sanggaMap,
				resArr = self.resArr,
				distrVal = self.distrVal,
				averagePrice = 0,
				price = '분양가',
				areaStd = '',
				isPy = self.isPy === 'py' ? true : false ,
				stdNm = columnMode === 'sangga' ? '상가유형' : '연면적코드';				
			
			if (self.searchDtl && self.searchDtl.radioResultArea) {
				areaStd = self.searchDtl.radioResultArea === "전용면적" ? "전용면적" : "계약면적";
			}

			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));

			// 정렬: 상가종류 연면적코드 오름차순, 분양연도 내림차순
			rawDataArr = rawDataArr.sort(function(a, b) {
				var aType = sanggaMap[a['상가유형']],
					bType = sanggaMap[b['상가유형']];
					
				if (aType < bType) {
					return -1;
				}
				if (aType > bType) {
					return 1;
				}
				
				var aAreaType = areaMap[a['연면적코드']],
					bAreaType = areaMap[b['연면적코드']];
					
				if (aAreaType < bAreaType) {
					return -1;
				}
				if (aAreaType > bAreaType) {
					return 1;
				}
				
				if (a['period'] < b['period']) {
					return 1;
				}
				if (a['period'] > b['period']) {
					return -1;
				}

				return 0;
			});
			
			// 평균분양가
			var avgPriceData = {
				data: 0,
				area: 0
			};
			
			for (var i in rawDataArr) {
				var raw = rawDataArr[i],
					rawPeriod = raw['period'],
					result = raw[price],
					resultStd = raw[areaStd];
				
				// 해당 상가 OR 연면적 아니면 제외
				if(columnMode === 'sangga') {
					if(distrVal != sanggaMap[raw[stdNm]]) {
						continue;
					}
				} else if(columnMode === 'area'){
					if(distrVal != areaMap[raw[stdNm]]) {
						continue;
					}
				}
				
				// 해당 분양일 아니면 제외
				if(resArr[resArr.length - 1] != rawPeriod) {
					continue;
				}
				
				avgPriceData.data += parseFloat(result) * (isPy === true ? zo.py2m : 1);
				avgPriceData.area += parseFloat(resultStd);			
			}
			
			if (avgPriceData.data && avgPriceData.area) {
				averagePrice = parseFloat(avgPriceData.data / avgPriceData.area);
			} else {
				averagePrice = 0;
			}
					
			var compResultArr = [];

			// 출력용 데이터 원본 생성
			var compareObj = {
					averagePrice: 0,
					compare0: 0,
					compare1: 0,
					compare2: 0,
					compare3: 0,
					area0: 0,
					area1: 0,
					area2: 0,
					area3: 0,
					class1: 'text-success',
					class2: 'text-success',
					class3: 'text-success',
					icon1: '<i class="fa fa-caret-down text-success"></i>',
					icon2: '<i class="fa fa-caret-down text-success"></i>',
					icon3: '<i class="fa fa-caret-down text-success"></i>'
			}
			compareObj.averagePrice = averagePrice > 0 ? z.toComma(averagePrice) + '만원' : '데이터 없음';			
			compResultArr.push(compareObj);

			for (var i in rawDataArr) {
				var raw = rawDataArr[i],
					rawPeriod = raw['period'],
					result = parseFloat(raw[price]),
					area = parseFloat(raw[areaStd]),
					comp = compResultArr[0],
					periodIdx = resArr.indexOf(rawPeriod);				
				
				if(columnMode === 'sangga') {
					if(distrVal != sanggaMap[raw[stdNm]]) {
						continue;
					}					
				} else if(columnMode === 'area') {
					if(distrVal != areaMap[raw[stdNm]]) {
						continue;
					}
				}

				if (periodIdx < 0) {
					continue;
				}				

				if (rawPeriod == resArr[periodIdx] && 'number' === (typeof comp['compare' + periodIdx])) {
					comp['compare' + (3 - periodIdx)] += result;
					comp['area' + (3 - periodIdx)] += area;
				};				
			}
			
			// 평균 계산
			var comp = compResultArr[0];

			for (var i = 0; i < 4; ++i) {
				if (parseFloat(comp['compare' + i]) > 0 && parseFloat(comp['area' + i]) > 0) {
					comp['compare' + i] = parseFloat(comp['compare' + i]) / parseFloat(comp['area' + i]);
				}
			}

			// 비교치 % 계산
			var compArr = compResultArr[0];
			
			for (var j = 1; j < 4; ++j) {
				// 둘 다 0 이면 계산 제외, 예전만 0 이고 신규 데이터 있으면 New 표시
				// + class, icon 표시 수정
				if (! compArr['compare' + j]) {
						compArr['class' + j] = '';
						compArr['icon' + j] = '';
						
					if (!compArr['compare0']) {						
					} else {
						compArr['compare' + j] = 'New';
						compArr['class' + j] = 'text-danger';
					}
					
				} else {
					compArr['compare' + j] = z.toComma(Math.round(100 * (compArr['compare0'] - compArr['compare' + j]) / compArr['compare' + j])) + '%';
						
					if (0 > ('' + compArr['compare' + j]).indexOf('-')) {
						compArr['class' + j] = 'text-danger';
						compArr['icon' + j] = '<i class="fa fa-caret-up text-danger"></i>';
					}													
				}
			}
			
			// 데이터 없을 때 '데이터 없음' 표시
			if (compArr['compare0'] === 0) {				
				for (var i = 0; i < 4; ++i) {
					compArr['compare' + i] = '-';
				}				
			}

			$(self.tableSelector).hide();
			// 출력부분 분리 없이 바로 실행
//			var tmplCompare = Handlebars.compile($('#tmplTablePrevCompareList').html()),
//				$table = $(self.tableSelector).show().find('tbody').html('');
//
//			$table.append(tmplCompare({compareArr: compResultArr}));

		},
		
		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = self.xAxisArr,
				yAxisArr = self.yAxisArr,
				excelData = [],
				excelOpt = {header: ['상가별 분양가']};
			
			return result;
		}
	};
	
	// 추이 데이터
	var tableAverageSalesSanggaType = {
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
			self.areaArr = $.extend(true, [], areaTypeArr);
			

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
			} else {
				self.isCustomArea = false;
				self.areaArr = $.extend(true, [], areaTypeArr);
			}
			
			self.columnMode = 'sangga';
			if(self.searchDtl && 'area' === self.searchDtl.columnMode) {
				self.columnMode = 'area';
			}
			
			if (self.searchDtl && (self.searchDtl.radioPriceUnit == "" || self.searchDtl.radioPriceUnit == 'py')) {
				self.isPy = self.searchDtl.radioPriceUnit;
			} 

			// 동 이름 목록 로딩
			self.dongArr = [];
			self.sidoArr = [];
			self.isSgg = (! param) || ('emd' !== param.jusoCd && ! param.sggnm);

			if (param && param.isBizdist) {
				self.isSgg = false;
			}	
			// 구 전체 + 특정 동 선택	
			var dongArr = apiSearchEmd.getDongArr();
			var sidoArr = apiSearchEmd.getSidoArr();
			// 시 전체 선택
			if (self.isSgg) {	
				dongArr = apiSearchEmd.getSggArr();
			} else if (param && param.isBizdist) {
				dongArr = apiSearchEmd.getBizdistArr();
			}
			
			for (var i in dongArr) {			
				self.dongArr.push(self.isSgg ? dongArr[i].sggnm : dongArr[i].dongnm);
			}

			// 전국 데이터 작업
			for(var i in sidoArr) {
				// 상가 테이블과 법정동코드 통합 테이블의 데이터가 상이하여 추가
				if(sidoArr[i].sidonm.substring(0, 2) == '세종') sidoArr[i].sidonm = '세종특별시';
				if(sidoArr[i].sidonm.substring(0, 2) == '제주') sidoArr[i].sidonm = '제주도';
				
				// 공급추이차트 데이터와 맞추기 위해 [전국]은 제외
				if(sidoArr[i].sidonm.substring(0, 2) != '전국') {
					self.sidoArr.push(sidoArr[i].sidonm);
				}
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
				KTApp.blockPage({message: '잠시 기다려 주십시오'});
				tableAverageSalesDetail.openAllView();
				setTimeout(function() {
					KTApp.unblockPage();
				}, 1000);
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

			return z.xAsync('AverageSales', '평균분양가상세', 'select', param, 'json').done(function(resp) {
			
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
										
					var aFloorType = floorTypeMap[a['층']],
						bFloorType = floorTypeMap[b['층']]; 
						
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
					
					var aAreaType = areaTypeMap[a['연면적코드']],
						bAreaType = areaTypeMap[b['연면적코드']];
						
					if (aAreaType < bAreaType) {
						return -1;
					}
					if (aAreaType > bAreaType) {
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
				dongArr = (self.param.sidonm == '전국' ? self.sidoArr : self.dongArr),
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

			var columnArr = self.columnMode === "sangga" ? sanggaArr : areaArr;
			
			for (var i in dongArr) {
				var dongData = $.extend(true, {}, row);
				dongData.dongnm = dongArr[i];
				
				for (var j in columnArr) {
					dongData.sanggaData.push({
						sanggaType: self.columnMode === "sangga" ? sanggaArr[j] : areaArr[j],
						
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
						})
					})
				}
				
				resultArr.push(dongData)
			}
			
			for (var i in rawDataArr) {
				var rawData = rawDataArr[i],
					idxDong = self.param.sidonm == '전국' ? dongArr.indexOf(rawData.도시) : (isBizdist ? 0 : dongArr.indexOf(isSgg ? rawData.sggnm : rawData.dongnm)),
					idxSangga = sanggaArr.indexOf(rawData['상가유형']),
					idxFloor = floorArr.indexOf(rawData['층']),
					idxArea = areaArr.indexOf(rawData['연면적코드']);
				
				//if (0 > idxDong || 0 > idxSangga + 1 || 0 > idxFloor + 1 || 0 > parseInt(rawData['period'])) {
				if (0 > idxDong || 0 > idxSangga || 0 > idxFloor || 0 > parseInt(rawData['period'])) {
					continue;
				};
				
				var dongData = resultArr[idxDong],
					idxYear = self.xAxisPeriod.indexOf(rawData['period']);
				
				if (self.columnMode === "sangga") {
					dongData.sanggaData[idxSangga].priceSum[idxFloor][idxYear] += parseFloat(rawData['분양가']);
					dongData.sanggaData[idxSangga].areaSum[idxFloor][idxYear] += parseFloat(rawData[areaStd]);
					dongData.sanggaData[idxSangga].sanggaPriceSum[idxYear] += parseFloat(rawData['분양가']);
					dongData.sanggaData[idxSangga].sanggaAreaSum[idxYear] += parseFloat(rawData[areaStd]);
					dongData.dongPriceSum[idxYear] += parseFloat(rawData['분양가']);
					dongData.dongAreaSum[idxYear] += parseFloat(rawData[areaStd]);
				} else if (self.columnMode === "area") {
					dongData.sanggaData[idxArea].priceSum[idxFloor][idxYear] += parseFloat(rawData['분양가']);
					dongData.sanggaData[idxArea].areaSum[idxFloor][idxYear] += parseFloat(rawData[areaStd]);
					dongData.sanggaData[idxArea].sanggaPriceSum[idxYear] += parseFloat(rawData['분양가']);
					dongData.sanggaData[idxArea].sanggaAreaSum[idxYear] += parseFloat(rawData[areaStd]);
					dongData.dongPriceSum[idxYear] += parseFloat(rawData['분양가']);
					dongData.dongAreaSum[idxYear] += parseFloat(rawData[areaStd]);
				}	
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
					sanggaType: self.columnMode === "sangga" ? sanggaArr[i] : areaArr[i],
							
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
					idxFloor = floorArr.indexOf(rawData['층']),
					idxArea = areaArr.indexOf(rawData['연면적코드']);
				
				if ( 0 > idxSangga || 0 > idxFloor || 0 > parseInt(rawData['period'])) {
				//if ( 0 > idxSangga + 1 || 0 > idxFloor + 1 || 0 > parseInt(rawData['period'])) {
					continue;
				};
				
//				var dongData = resultArr[idxDong],
				var	idxYear = self.xAxisPeriod.indexOf(rawData['period']),
					merArr = mergeArr[0];
				
				if (self.columnMode === "sangga") {
					
					merArr.sanggaData[idxSangga].priceSum[idxFloor][idxYear] += parseFloat(rawData['분양가']);
					merArr.sanggaData[idxSangga].areaSum[idxFloor][idxYear] += parseFloat(rawData[areaStd]);
					merArr.sanggaData[idxSangga].sanggaPriceSum[idxYear] += parseFloat(rawData['분양가']);
					merArr.sanggaData[idxSangga].sanggaAreaSum[idxYear] += parseFloat(rawData[areaStd]);
					merArr.dongPriceSum[idxYear] += parseFloat(rawData['분양가']);
					merArr.dongAreaSum[idxYear] += parseFloat(rawData[areaStd]);
					
				} else if (self.columnMode === "area") {
					
					merArr.sanggaData[idxArea].priceSum[idxFloor][idxYear] += parseFloat(rawData['분양가']);
					merArr.sanggaData[idxArea].areaSum[idxFloor][idxYear] += parseFloat(rawData[areaStd]);
					merArr.sanggaData[idxArea].sanggaPriceSum[idxYear] += parseFloat(rawData['분양가']);
					merArr.sanggaData[idxArea].sanggaAreaSum[idxYear] += parseFloat(rawData[areaStd]);
					merArr.dongPriceSum[idxYear] += parseFloat(rawData['분양가']);
					merArr.dongAreaSum[idxYear] += parseFloat(rawData[areaStd]);
					
				}	
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
				tmplDefault = Handlebars.compile($('#tmplTableAverageSalesSanggaTypeDefault').html()),
				tmpl = Handlebars.compile($('#tmplTableAverageSalesSanggaType').html()),
				$tr = self.$thead.find('tr:first-child'),
				isPy = self.isPy === 'py' ? true : false,
				sanggaCopyArr = $.extend([], true, self.sanggaArr),
				floorCopyArr = $.extend([], true, self.floorArr),			
				classNameArr = Array.apply(null, Array(self.floorArr.length - 1)).map(function() {return '';}),
				firstLineArr = Array.apply(null, Array(self.floorArr.length)).map(function() {return false;});
			
			var areaCopyArr = $.extend([], true, self.pyArr);
			
			if (columnMode == "area") {
				sanggaCopyArr = areaCopyArr.slice(0, areaCopyArr.length + 1);
			}

			$tr.find('th[rowspan="1"]:not("[data-dont-delete]")').remove();

			for (var i = 0, len = self.xAxisArr.length; i < len; ++i) {
				var $th = $('<th/>', {rowspan: '1', text: self.xAxisArr[i]});				
				$tr.append($th);
			}	
			
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
					
			if (columnMode == "area") {
				$('[data-sanggaArea-text]').text('연면적별 ');
			} else {
				$('[data-sanggaArea-text]').text('상가유형별 ');
			}			
			
			self.resultArr = [];
			self.mergeArr = [];

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
				apiSearchEmd.addDownloadLog('추이_데이터');		
			});

			return result;
		}		
	};
	
	// 평균 분양가 추이 상세 데이터
	var tableAverageSalesDetail = {
		init: function(param, searchDtl) {
			var self = this;
			
			self.param = param;
			self.searchDtl = searchDtl;
			self.$tbody = $('#rowDataTable').html('');
			self.$wrapper = self.$tbody.closest('[data-table-wrapper]');


			self.columnMode = 'sangga';
			if (self.searchDtl && 'area' === self.searchDtl.columnMode) {
				self.columnMode = 'area';
			}
			
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
				self.areaMap = $.extend(true, {}, areaTypeMap);
			}
			if (self.searchDtl && self.searchDtl.radioTimeBound) {
				self.period = self.searchDtl.radioTimeBound;
			} else {
				self.period = '4'
			}
			
			
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
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
				
			return z.xAsync('AverageSales', '평균분양가상세테이블', 'select', param, 'json').done(function(resp) {
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
					if (a['상가명'] < b['상가명']) {
						return -1;
					} else if (a['상가명'] > b['상가명']) {
						return 1;
					}
					return 0;
				});
				
				for (var i in resp) {
					var row = resp[i];
					
					row['주소'] = row['도시'] + ' ' + row['구시군'] + ' ' + row['읍면동'] + ' ' +row['번지']; 
					row['건축규모'] = '지상' + row['지상총층'] + '층';
					
					if (row['지하총층']) {
						row['건축규모'] += '/지하' + row['지하총층'] + '층';						
					}
					
					row['대지면적'] = z.toComma(row['대지면적']);
					row['연면적'] = z.toComma(row['연면적']);
					
					if (1 > row['총점포수']) {
						row['총점포수'] = '-';
					} else {
						row['총점포수'] = z.toComma(row['총점포수']);
					}
					
					if (0 > row['1f점포수']) {
						row['1f점포수'] = '-';
					} else {
						row['1f점포수'] = z.toComma(row['1f점포수']);
					}
					if (0 > row['1f계약평당가']) {
						row['1f계약평당가'] = '-';
					} else {
						row['1f계약평당가'] = z.toComma(row['1f계약평당가']);
					}
					if (0 > row['1f전용평당가']) {
						row['1f전용평당가'] = '-';
					} else {
						row['1f전용평당가'] = z.toComma(row['1f전용평당가']);
					}
					if (0 > row['전용율']) {
						row['전용율'] = '-';
					} else {
						row['전용율'] = z.toComma(row['전용율']) + '%';
					}
					if ('' == row['입주연월']) {
						row['입주연월'] = '-';
					} else if (row['입주연월'].length > 5) {
						row['입주연월'] = row['입주연월'].substr(0, 4) + '.' + row['입주연월'].substr(4, 2);
					} else {
						row['입주연월'] = row['입주연월'].substr(0, 4) + '.' + '00'
					}					
					if ('' == row['분양연월']) {
						row['분양연월'] = '-';
					} else if (row['분양연월'].length > 5) {
						row['분양연월'] = row['분양연월'].substr(0, 4) + '.' + row['분양연월'].substr(4, 2);
					} else {
						row['분양연월'] = row['분양연월'].substr(0, 4) + '.' + '00'
					}						
					// 10줄 초과는 히든처리
					if (9 < i) {
						row.isHidden = true;
					}
				}
													
			});
		},
		
		updateData: function() {
			var self = this,
				dataArr = [],
				yearArray = [];
			
				dataArr = self.rawDataArr;
				
				var rawDataArr = JSON.parse(JSON.stringify(dataArr));
				rawDataArr.sort(function(a, b) {
					if (a['분양년도'] < b['분양년도']) {
						return -1;
					} else if (a['분양년도'] > b['분양년도']) {
						return 1;
					}					
				});				
				
				var yearArray = rawDataArr.map(function (val, index) {
					return val['분양년도'];
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
		                field: '상가명',
		                title: '상가명',
		                width: 200,
		                textAlign: 'center'
		            }, {
		                field: '주소',
		                title: '주소',
		                width: 200,
		                textAlign: 'center'
		            }, {
		            	field: '건축규모',
		                title: '건축규모',
		                textAlign: 'center'
		            }, {
		            	field: '대지면적',
		                title: '대지면적(㎡)',
		                width: 75,
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
		            	field: '연면적',
		                title: '연면적(㎡)',
		                width: 75,
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
		            	field: '총점포수',
		                title: '총점포수',
		                width: 65,
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
		            	field: '1f계약평당가',
		                title: '1F계약<br>평당가',
		                width: 70,
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
		            	field: '1f전용평당가',
		                title: '1F전용<br>평당가',
		                width: 70,
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
		            	field: '분양연월',
		                title: '분양연월',
		                width: 65,
		                textAlign: 'center'
		            }, {
		            	field: '입주연월',
		                title: '입주연월',
		                width: 65,
		                textAlign: 'center'
		            }, {
		            	field: '전용율',
		                title: '전용율',
		                width: 60,
		                textAlign: 'center'
		            }, {
		            	field: '분양년도',
		                title: '분양년도',
		                width: 65,
		                textAlign: 'center'
		            }]
				});
				self.rowdatatable = rowdatatable;
				rowdatatable.columns('분양년도').visible(false);
				$("#kt_datatable_search_status").on("change", (function() {
					rowdatatable.search($(this).val(), "분양년도");
				}))
				
		},	
		
		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = self.$tbody.children('table');
				
				var wsBody = XLSX.utils.table_to_sheet($table[0]);
				
				var jsonBody = XLSX.utils.sheet_to_json(wsBody, {header: 1});

				var jsonHeader = jsonBody[0];
				var jsonBody2 = [];
				
				var headerData = $.extend(true, [], row);
				for (var i in jsonHeader ) {
					headerData.push(jsonHeader[i]);
				}
				jsonBody2.push(headerData);
				
				var row = Array.apply(null, Array(12)).map(function() {return 0;})
				
				for (var i in self.rawDataArr ) {
					var rowData = $.extend(true, [], row);
					rowData[0] = self.rawDataArr[i]['상가명'];
					rowData[1] = self.rawDataArr[i]['주소'];
					rowData[2] = self.rawDataArr[i]['건축규모'];
					rowData[3] = self.rawDataArr[i]['대지면적'] + '㎡';
					rowData[4] = self.rawDataArr[i]['연면적'] + '㎡';					
					rowData[5] = self.rawDataArr[i]['총점포수'];	
					rowData[6] = self.rawDataArr[i]['1f계약평당가'];
					rowData[7] = self.rawDataArr[i]['1f전용평당가'];
					rowData[8] = self.rawDataArr[i]['분양연월'];
					rowData[9] = self.rawDataArr[i]['입주연월'];
					rowData[10] = self.rawDataArr[i]['전용율'];
					rowData[11] = self.rawDataArr[i]['분양년도'];
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
	
	// 사용자 설정 평균분양가 추이 합산
	var tableAverageSalesSum = {
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
			if(self.searchDtl && 'area' === self.searchDtl.columnMode) {
				self.columnMode = 'area';
			}
			
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
				price = '분양가';
			
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

			return z.xAsync('AverageSales', '평균분양가상세', 'select', param, 'json').done(function(resp) {
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
				tmpl = Handlebars.compile($('#tmplTableAverageSalesSum').html()),
				rawDataArr = self.rawDataArr,
				dataArr = [],
				dongArr = [],
				sidoArr = [],
				isPy = self.isPy === 'py' ? true : false,
				columnNm = (self.param.sidonm == '전국' ? '도시' : 'sggnm'),
				sumNm = self.param.sidonm,
				areaStd = '',  
				price = '분양가';

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
				areaStd = self.searchDtl.radioResultArea === "전용면적" ? "전용면적" : "계약면적";
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

			chartAverageSalesAll.init();
//			chartAverageSalesYear.init();
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
					tableAverageSalesSanggaType.exportSheet()
				).done(function(workSheet) {

					var wb = XLSX.utils.book_new();
					
					XLSX.utils.book_append_sheet(wb, workSheet, '평균분양가_데이터');

					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_평균분양가_데이터.xlsx');					
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
					tableAverageSalesDetail.exportSheet()
				).done(function(workSheet) {

					var wb = XLSX.utils.book_new();
					
					XLSX.utils.book_append_sheet(wb, workSheet, ' 평균분양가_상세');

					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_평균분양가_상세.xlsx');					
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
					tableAverageSalesSum.exportSheet()
				).done(function(workSheet) {

					var wb = XLSX.utils.book_new();
					
					XLSX.utils.book_append_sheet(wb, workSheet, '평균분양가_합산');

					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_평균분양가_합산.xlsx');					
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
			
			var searchDtl = apiSearchAverageSales.getSearchDtl(param);
			
			if ('custom' === searchDtl.radioTimeBound) {
				$('[data-ui-user-date=true]').show();
				$('[data-ui-user-date=false]').hide();
				
				tableAverageSalesSum.init(param, searchDtl);
//				tableSupplyTrendDetail.init(param, searchDtl);
			} else {
				$('[data-ui-user-date=true]').hide();
				$('[data-ui-user-date=false]').show();
				
				chartAverageSalesAll.init(param, searchDtl);		
				tableAverageSalesSanggaType.init(param, searchDtl);
			}
			
			tableAverageSalesDetail.init(param, searchDtl);
		
		},
		
    };
}();


$(function() {
	$.when(
		$.getScript('/resources/admin/APPS/dashboard/apiSearchAreaMap_dev.js'),
		$.getScript('/resources/admin/APPS/dashboard/averageSalesSearch.js'),
		$.getScript('/resources/common/custom/js/commonDashboard.js')		
	).done(function() {
		
		z.xAsync('AdminMain', 'getExcelDown', 'select', {pgmCode:"MA0106"}, 'json').done(function(resp) {
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
			areaCdListener: apiAverageSales.setDongCd
		});
		
		apiSearchEmd = apiSearchAreaMap;
		
		apiSearchAverageSales.init({
			btnActivate: $('[data-btn-search-detail]'),
			searchWrapper: $('[data-wrapper="searchDetail"]'),
			searchDateRange: $('[data-wrapper="searchDetail"] [data-search-time]'),
			btnOk: $('[data-wrapper="searchDetail"] [data-btn-ok]'),
			btnClose: $('[data-wrapper="searchDetail"] [data-btn-close]')
		});
		
	    apiAverageSales.init();

		z.formatDataReference('상가').done(function(refText) {
			$('.dashboard .reference').text(refText);
		});
	});
	
});
