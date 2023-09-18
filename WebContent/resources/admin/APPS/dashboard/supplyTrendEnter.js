'use strict';
// Class definition

var apiSearchEmd;
var excelyn;
var dtlexcelyn;
var apiSupplyTrendEnter = function() {
	
    // Private functions
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


	// FIXME: 면적코드 공통코드화 필요
	var areaTypeArr = [
		'1,000 미만',
		'1,000 이상 ~ 3,000 미만',
		'3,000 이상 ~ 5,000 미만',
		'5,000 이상 ~ 7,000 미만',
		'7,000 이상 ~ 10,000 미만',
		'10,000 이상 ~ 15,000 미만',
		'15,000 이상 ~ 30,000 미만',
		'30,000 이상'
	];
	
	var areaTypePyArr = [
		'302 미만',
		'302 이상 ~ 907 미만',
		'907 이상 ~ 1,512 미만',
		'1,512 이상 ~ 2,117 미만',
		'2,117 이상 ~ 3,025 미만',
		'3,025 이상 ~ 4,537 미만',
		'4,537 이상 ~ 9,075 미만',
		'9,075 이상'
	];

	var areaTypeValueArr = [
		0,
		1000,
		3000,
		5000,
		7000,
		10000,
		15000,
		30000
	];

	var areaTypeIncludeMap = {
		0: 0,
		1: 1,
		2: 2,
		3: 3,
		4: 4,
		5: 5,
		6: 6,
		7: 7
	};

			
	// 공급 추이 차트
	var chartSupplyTrendEnterAll = {
		
		init: function(param, searchDtl) {
			var self = this,
				apexChart = '#chart_1_1';
			
			self.$wrapper = $(apexChart).closest('[data-chart-wrapper]');
			self.param = param;
			self.searchDtl = searchDtl;

			if (self.searchDtl && self.searchDtl.checkSanggaType.length) {
				self.isCustomSangga = true;
				self.sanggaArr = $.extend(true, [], self.searchDtl.checkSanggaType);
			} else {
				self.isCustomSangga = false;
				self.sanggaArr = $.extend(true, [], sanggaTypeArr);
			}

			self.columnMode = 'sangga';
			if (self.searchDtl && 'area' === self.searchDtl.columnMode) {
				self.columnMode = 'area';
			}
			
			var isPy = self.searchDtl && 'py' === self.searchDtl.radioAreaUnit;

			self.areaArr = $.extend(true, [], isPy ? areaTypePyArr : areaTypeArr);
			self.areaValueArr = $.extend(true, [], areaTypeValueArr);
			self.areaIncludeMap = $.extend(true, {}, areaTypeIncludeMap); 
			
			if (self.searchDtl && self.searchDtl.checkAreaBound.length) {
				var includeArr = $.extend(true, [], self.searchDtl.checkAreaBound).map(function(val) {
						return parseInt(val.split(',')[0]);
					});

				for (var i in self.areaIncludeMap) {
					self.areaIncludeMap[i] = includeArr.indexOf(self.areaValueArr[i]);
				}
				
				self.areaArr = self.areaArr.filter(function(elm, idx) {
					return -1 < self.areaIncludeMap[idx];
				});
			}
			
			/*
			
			*/	

			// 차트 초기화 퍼블리싱 코드 옮겨옴		
			var options = {
				series: [{
					name: '구간별 물량',
					type: 'column',
					data: [210, 788, 791]
				}, {
					name: '누적동향',
					data: [756, 636, 860]
				}],
				chart: {
					width: '100%',
					height: 550,
					type: 'line',
					stacked: false,
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
								filename: '공급동향_입주_추이'
							}	
						}
			        },
			        dropShadow: {
			            enabled: true,
			            enabledOnSeries: [1],
			            top: 3,
			            left: 0,
			            blur: 1,
			            opacity: 0.2
			        },

					events: {
						dataPointSelection: function(event, chartContext, config) {
							var idx = config.dataPointIndex;
							// console.log(self.xAxisArr[idx]);
							self.loadNextObj(self.xAxisArr[idx]);
						},
			        	click: function(event, chartContext, config) {
							var $target = $(event.target);
							
							if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG') || $target.hasClass('exportCSV')) {
								z.addDownloadLog('추이', 'chart');
							}							
							
			    			if(excelyn == "N"){
			    				$('#chart_1_1 .exportCSV').css("display", "none");
							} else {
								$('#chart_1_1 .exportCSV').css("display", "block");
							};
						}
					}
		        },
			    plotOptions: {
			        bar: {
			            horizontal: false,
			            columnWidth: '50%',
			            // endingShape: 'rounded'
			        },
			    },
				stroke: {
					width: [1, 4],
				},
			    title: {
			        // text: 'XYZ - Stock Analysis (2009 - 2016)',
			        align: 'left',
			        offsetX: 110
			    },
				dataLabels: {
					enabled: true,
					enabledOnSeries: [1],
					formatter: function(value) {
						return z.toComma(value);
					}
				},
				markers: {
					size: 1
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
						text: '구간별 물량'
					},
		            axisTicks: {
		                show: false,
		            },
		            axisBorder: {
		                show: false,
		                color: '#e0dcd8'
		            },
		            labels: {
		                style: {
		                    colors: '#e0dcd8',
		                }
		            },
		            tooltip: {
		                enabled: true
		            }
				}, {
					opposite: true,
					title: {
						text: '누적동향'
					},
		            axisTicks: {
		                show: false,
		            },
		            axisBorder: {
		                show: false,
		                color: '#e39ba4'
		            },
		            labels: {
		                style: {
		                    colors: '#e39ba4',
		                }
		            },

				}],
				colors: ['#d4cfc9','#d45769']
			};
			
			if (self.chart) {
				self.chart.destroy();
			}
	
			var chart = new ApexCharts($(apexChart)[0], options);
			
			self.chart = chart;
			
			self.setBtnListener();
			if (self.param) {
				self.loadDataPre();
			}	
			chart.render().then(function() {
				// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
				chart.updateSeries([]);

				if (self.param) {
					self.$wrapper.find('[data-sgg-nm]').text(param.sggnm || param.sidonm);
					if (! self.param.isBizdist) {
						self.$wrapper.find('[data-dong-nm]').text(param.dongnm);
					} else {
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
		
		
		loadNextObj: function(selected) {
			var self = this,
				$chart = $(self.apexChart),
				endYMD = '';
			
			switch (self.searchDtl.radioTimeBound) {
				case 'year':
					endYMD = selected + '1231';
					break;
				case 'quarter':
					endYMD = moment(selected, 'YYYY.Q').endOf('quarter').format('YYYYMMDD');
					break;
				case 'month':
					endYMD = moment(selected, 'YYYY.MM').endOf('month').format('YYYYMMDD');
					break;
				case 'half':
					if ('1' === selected.substr(5, 1)) {
						endYMD = selected.substr(0, 4) + '0630';
					} else {
						endYMD = selected.substr(0, 4) + '1231';
					}
					break;
			}
			self.searchDtl.endYMD = endYMD;

			chartSupplyTrendEnterYear.init(self.param, self.searchDtl);
		},		
		loadDataPre: function (){
			var self = this,
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' 
				};
			
			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;
			}
			
			if (self.searchDtl){
				var data = z.xmlAjax('SupplyTrendEnter', '입주최종일자', 'select', param, 'json');
				var $startYMD = $('[data-wrapper="searchDetail"]').find('[name=startDurationYMD]');
				var now, nowCalc, pastCalc, pastCalc2;
				var past = moment($startYMD.val(), 'YYYY-MM-DD');
				if(data.length) {
					switch (self.searchDtl.radioTimeBound) {
						case 'year':
							now = moment(data[0].입주일).endOf('year');
							nowCalc = now.format('YYYYMMDD');
							past = past.startOf('year');
							pastCalc = now.clone().subtract(11, 'year').format('YYYYMMDD');
							pastCalc2 = now.clone().subtract(11, 'year').format('YYYY-MM-DD');
						break;	
						case 'half':
							now = moment(data[0].입주일);
							nowCalc = now;
							
							if (6 > nowCalc.get('month')) {
								nowCalc.set('month', 5).endOf('month');
							} else {
								nowCalc = nowCalc.endOf('year');
							}
							pastCalc = nowCalc.clone().subtract(23, 'quarter');
							pastCalc2 = nowCalc.clone().subtract(23, 'quarter').format('YYYY-MM-DD');
						break;
						case 'quarter':
							now = moment(data[0].입주일);
							nowCalc = now.endOf('quarter');
							pastCalc = now.clone().subtract(11, 'quarter').startOf('quarter');
							pastCalc2 = now.clone().subtract(11, 'quarter').startOf('quarter').format('YYYY-MM-DD');
						break;
						case 'month':
							now = moment(data[0].입주일);
							nowCalc = now.endOf('month');
							pastCalc = now.clone().subtract(11, 'month').startOf('month');
							pastCalc2 = now.clone().subtract(11, 'month').startOf('month').format('YYYY-MM-DD');
						break;	
					}
				}
				self.searchDtl.startYMD = pastCalc;
				self.searchDtl.endYMD = nowCalc;
				self.searchDtl.pastYMD = past.format('YYYYMMDD');
				
				$startYMD.val(pastCalc2);
				$('[data-search-start-time]').text(moment(self.searchDtl.startYMD, 'YYYYMMDD').format('YYYY.MM'));
			}	
		}, 
		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' 
				};
			
			if (self.searchDtl && self.searchDtl.startYMD) {
				param.startYMD = self.searchDtl.startYMD;
				param.endYMD = self.searchDtl.endYMD;
			}
			
			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;
			}
			
			var paramAcc = $.extend(true, {}, param);
			
			paramAcc.endYMD = param.startYMD;
			paramAcc.startYMD = '';
			
			return $.when(
				z.xAsync('SupplyTrendEnter', '공급추이차트', 'select', param, 'json'),
				z.xAsync('SupplyTrendEnter', '공급추이차트_누적', 'select', paramAcc, 'json')
			).done(function(resp, respAccumulate) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;
				self.accumulateArr = respAccumulate;

				// 면적 기준에 제외될 데이터 정리
				var areaFilterArr = [
					{arr: resp, code: '연면적'},
					{arr: respAccumulate, code: '연면적코드'}
				];
				
				for (var j in areaFilterArr) {
					var areaFilter = areaFilterArr[j];
					
					for (var i in areaFilter.arr) {
						var raw = areaFilter.arr[i],
							idxData = 0,
							value = parseFloat(raw[areaFilter.code]);
	
						if (isNaN(value) || 0 > value) {
							raw.idxData = -1;
							continue;
						}
	
						for (var len = self.areaValueArr.length - 1; len > idxData; ++idxData) {
							if (value >= self.areaValueArr[idxData] && value < self.areaValueArr[idxData + 1]) {
								break;
							}
						}
						
						raw.idxData = self.areaIncludeMap[idxData];
					}
				}

				self.rawDataArr = resp.filter(function(elm) {
					return -1 < elm.idxData;
				});

				self.accumulateArr = respAccumulate.filter(function(elm) {
					return -1 < elm.idxData;
				});
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
						text: '구간별 동향'
					},
					labels: {
						formatter: function(value) {
							return z.toComma(value);
						}
					}
				}, {
					opposite: true,
					title: {
						text: '누적동향'
					},
					labels: {
						formatter: function(value) {
							return z.toComma(value);
						}
					}
				}];

			// 정렬: 분양연도 오름차순
			// 연도 - 1년 기간, 년도 - 10년 기간 ㄷㄷ
			rawDataArr = rawDataArr.sort(function(a, b) {
				if (a['입주연도'] < b['입주연도']) {
					return -1;
				}
				if (a['입주연도'] > b['입주연도']) {
					return 1;
				}
				return 0;
			});
			
			// 1. 데이터 시간 구간 확정 후
			var startYMD = moment(self.searchDtl.startYMD),
				endYMD = moment(self.searchDtl.endYMD),
				timeBound = self.searchDtl.radioTimeBound,
				diffTime = 0;
				
			switch (timeBound) {
				case 'year':
					diffTime = endYMD.diff(startYMD, 'years') + 1;
					
					var tmp = startYMD.clone();
					
					for (var i = 0; diffTime > i; ++i) {
						xAxisArr.push(tmp.format('YYYY'));
						tmp.add(1, 'year');
					}
					break;
				case 'quarter':
					diffTime = endYMD.diff(startYMD, 'quarters') + 1;
					
					var tmp = startYMD.clone();
					
					for (var i = 0; diffTime > i; ++i) {
						xAxisArr.push(tmp.format('YYYY.Q[Q]'));
						tmp.add(1, 'quarter');
					}
					break;
				case 'month':
					diffTime = endYMD.diff(startYMD, 'months') + 1;

					var tmp = startYMD.clone();
					
					for (var i = 0; diffTime > i; ++i) {
						xAxisArr.push(tmp.format('YYYY.MM'));
						tmp.add(1, 'month');
					}
					break;
				case 'half':
					diffTime = Math.floor(endYMD.diff(startYMD, 'quarters') / 2) + 1;

					var tmp = startYMD.clone();
					
					for (var i = 0; diffTime > i; ++i) {
						xAxisArr.push(tmp.format('YYYY.') + (6 > tmp.get('month') ? '1' : '2') + 'H');
						tmp.add(2, 'quarter');
					}
					break;
			}

			// 2. 기존 입주연도 컬럼 규칙에 맞도록 수정
			for (var i in rawDataArr) {
				var raw = rawDataArr[i],
					mmt = moment(raw['입주일'], 'YYYYMM');

				switch (timeBound) {
					case 'year':
						raw['입주일'] = mmt.format('YYYY');
						break;
					case 'month':
						raw['입주일'] = mmt.format('YYYY.MM');
						break;
					case 'half':
						raw['입주일'] = mmt.format('YYYY.') + (6 > mmt.get('month') ? '1' : '2') + 'H';
						break;
					case 'quarter':
						raw['입주일'] = mmt.format('YYYY.Q[Q]');
						break;
				}
			}

			self.diffTime = diffTime;

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
			
//			console.log(chartOptions);
//			console.log(chartSeries);

			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);			
		},
		
		updateDataByYear: function(chartOptions, chartSeries) {
			var self = this,
				supplyData = {
					name: '구간별 물량',
					type: 'column',
					data: []
				},
				supplySumData = {
					name: '누적동향',
					type: 'line',
					data: []
				},
				columnNm = '총점포수';
				
			if (self.searchDtl && self.searchDtl.radioResultColumn) {
				columnNm = self.searchDtl.radioResultColumn;
			}

			chartSeries.push(supplyData);
			chartSeries.push(supplySumData);
			
			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr)),
				accumulateArr = self.accumulateArr;

			for (var i = 0; self.diffTime > i; ++i) {
				supplyData.data.push(0);
				supplySumData.data.push(0);
			}
			
			for (var i in rawDataArr) {
				var raw = rawDataArr[i],
					idx = self.xAxisArr.indexOf(raw['입주일']),
					result = parseFloat(raw[columnNm]);

				if (0 > idx || isNaN(result)) {
					continue;
				}

				// 연면적, 총점포수, 공급건수
				supplyData.data[idx] += result;
				
				// 누적 은 이후 연도에도 다 합산
				for (var j = idx; self.diffTime > j; ++j) {
					supplySumData.data[j] += result;
				}
			}

			// 누적 데이터는 전체 구간에 합산
			for (var i in accumulateArr) {
				var acc = accumulateArr[i],
					result = parseFloat(acc[columnNm]);
					
				if (isNaN(result)) {
					continue;
				}
				
				for (var j in supplySumData.data) {
					supplySumData.data[j] += result;
				}
			}
			
			// 합산 이후에는 모든 데이터 소수점 2자리까지 출력
			for (var i in supplyData.data) {
				// 연면적 && 평 계산인 경우 3.3 으로 나누기
				if ('연면적' === columnNm && self.searchDtl && 'py' === self.searchDtl.radioAreaUnit) {
					supplyData.data[i] /= zo.py2m;
					supplySumData.data[i] /= zo.py2m;
				}
				
				supplyData.data[i] = Math.round(100 * supplyData.data[i]) / 100;
				supplySumData.data[i] = Math.round(100 * supplySumData.data[i]) / 100;
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


	// 최근 5년간 공급 추이 차트: 상가유형별 or 연면적별
	var chartSupplyTrendEnterYear = {
		
		init: function(param, searchDtl) {
			var self = this;
			
			self.apexChart = '#chart_2_1';
			
			self.$wrapper = $(self.apexChart).closest('[data-chart-wrapper]');
			self.param = param;
			self.searchDtl = searchDtl;

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


			self.columnMode = 'sangga';
			if (self.searchDtl && 'area' === self.searchDtl.columnMode) {
				self.columnMode = 'area';
			}

			var isPy = self.searchDtl && 'py' === self.searchDtl.radioAreaUnit;

			self.areaArr = $.extend(true, [], isPy ? areaTypePyArr : areaTypeArr);
			self.areaValueArr = $.extend(true, [], areaTypeValueArr);
			self.areaIncludeMap = $.extend(true, {}, areaTypeIncludeMap); 
			
			if (self.searchDtl && self.searchDtl.checkAreaBound.length) {
				var includeArr = $.extend(true, [], self.searchDtl.checkAreaBound).map(function(val) {
						return parseInt(val.split(',')[0]);
					});

				for (var i in self.areaIncludeMap) {
					self.areaIncludeMap[i] = includeArr.indexOf(self.areaValueArr[i]);
				}
				
				self.areaArr = self.areaArr.filter(function(elm, idx) {
					return -1 < self.areaIncludeMap[idx];
				});
			}

			
			// 차트 초기화 퍼블리싱 코드 옮겨옴
			var options = {
				series: [{
					name: '',
	                data: []
	            }],
				chart: {
					width: '100%',
					height: 240,
					type: 'bar',
					toolbar: {
						show: false
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
			    colors: ['#5e58c9','#2985d2','#2eb7c4','#6d9d64','#b5bf1b','#f1c644','#f28f6c'],
// FIXME: stroke 에 뭔가 문제가 있는지 차트 표시가 안됨
//				stroke: {
//			        show: true,
//			        // curve: 'smooth',
//			        lineCap: 'butt',
//			        colors: '#ffffff',
//			        width: 2,
//			        dashArray: 0
//				},
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
//			        offsetY: 20,
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
			    },
				tooltip: {
					y: {
		                formatter: function(value) {
							return z.toComma(value) + ' ' + self.searchDtl.unitText;
						}
					}
				},
				xaxis: {
					categories: []
				}
			};
			
			if (self.chart) {
				self.chart.destroy();
			}

			var chart = new ApexCharts($(self.apexChart)[0], options);
			
			self.chart = chart;
			
			
			self.setBtnListener();

			chart.render().then(function() {
				// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
				chart.updateSeries([]);

				if (self.param) {
					self.diffTime = 5;
					
					self.endYMD = self.searchDtl.endYMD;
					
					// 1. 데이터 시간 구간 확정 후
					var endYMD = moment(self.searchDtl.endYMD),
						startYMD = null,
						endYMDText = '',
						timeBound = self.searchDtl.radioTimeBound;
						
					switch (timeBound) {
						case 'year':
							startYMD = endYMD.clone().subtract(self.diffTime, 'year').endOf('year').add(1, 'day');
							endYMDText = endYMD.format('YYYY');
							break;
						case 'quarter':
							startYMD = endYMD.clone().subtract(self.diffTime, 'quarter').endOf('quarter').add(1, 'day');
							endYMDText = endYMD.format('YYYY.Q[Q]');
							break;
						case 'month':
							startYMD = endYMD.clone().subtract(self.diffTime, 'month').endOf('month').add(1, 'day');
							endYMDText = endYMD.format('YYYY.MM');
							break;
						case 'half':
							startYMD = endYMD.clone().subtract(self.diffTime * 2, 'quarter').add(1, 'day');
							endYMDText = endYMD.format('YYYY.') + (6 > endYMD.get('month') ? '1' : '2') + 'H';
							break;
					}
					
					self.startYMD = startYMD.format('YYYYMMDD');

					self.$wrapper.find('[data-sgg-nm]').text(param.sggnm || param.sidonm);
					if (self.param.isBizdist) {
						self.$wrapper.find('[data-dong-nm]').text(param.bizdistnm);
					} else {
						self.$wrapper.find('[data-dong-nm]').text(param.dongnm);
					}

					self.$wrapper.find('[data-last-year]').text(endYMDText);
					
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
			var self = this;

//			$(self.apexChart).off('click', '.btn-xaxis').on('click', '.btn-xaxis', function(evt) {
//				self.loadNextObj($(evt.target).next('text').find('title').text());
//			});
//
//			$(self.apexChart).off('click', '.apexcharts-xaxis-label').on('click', '.apexcharts-xaxis-label', function(evt) {
//				self.loadNextObj($(evt.target).text());
//			});

			self.$wrapper.find('.clickYears').children('span').removeClass('on');
			
			self.$wrapper.find('.clickYears').children('span').off('click').on('click', function(){
				var $this = $(this),
					$list = $(this).siblings('span').removeClass('on');
					
				$this.addClass('on');

				self.loadNextObj(self.xAxisArr[parseInt($this.attr('data-idx'))]);
			});
		},
		
		loadNextObj: function(selected) {
			var self = this,
				$chart = $(self.apexChart),
				endYMD = '';

			switch (self.searchDtl.radioTimeBound) {
				case 'year':
					endYMD = selected + '1231';
					break;
				case 'quarter':
					endYMD = moment(selected, 'YYYY.Q').endOf('quarter').format('YYYYMMDD');
					break;
				case 'month':
					endYMD = moment(selected, 'YYYY.MM').endOf('month').format('YYYYMMDD');
					break;
				case 'half':
					if ('1' === selected.substr(5, 1)) {
						endYMD = selected.substr(0, 4) + '0630';
					} else {
						endYMD = selected.substr(0, 4) + '1231';
					}
					break;
			}
			self.searchDtl.endYMD = endYMD;
			
//			self.addAxisBackground(year);
			
			chartSupplyTrendEnterDong.hide();
			chartSupplyTrendEnterSanggaType.hide();
				
			if ('전체' === self.param.dongnm) {
				chartSupplyTrendEnterDong.init(self.param, self.searchDtl);
			} else {
				chartSupplyTrendEnterSanggaType.init(self.param, self.searchDtl);
			}
		},

		// x,y 라벨에 버튼 추가 api 가 없어서 배경 객체를 추가하는 방식 
		addAxisBackground: function(year) {
			var self = this,
				$chart = $(self.apexChart);

			if (! year && self.param && self.param.endYYYY) {
				year = self.param.endYYYY;
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
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					startYMD: self.startYMD,
					endYMD: self.endYMD,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' 
				};
				
			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;
			}
			// 20230717 전국 데이터 시간 소요로 인해 추가 
			KTApp.blockPage({message: '잠시 기다려 주십시오'});
			return z.xAsync('SupplyTrendEnter', '공급추이차트', 'select', param, 'json').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;
				
//				console.log(resp);
				
				/**
					분양가: ""
					분양면적: ""
					분양일: "20140408"
					상가명: "강남더샵포레스트단지내상가"
					상가유형: "단지내상가"
					상가코드: "S01010000000732"
					연면적: "569.03"
					입주일: "20160727"
					전용면적: ""
					층: ""
					호수: ""
				 */
			
				// 면적 기준에 제외될 데이터 정리
				for (var i in resp) {
					var raw = resp[i],
						idxData = 0,
						value = parseFloat(raw['연면적']);

					if (isNaN(value) || 0 > value) {
						raw.idxData = -1;
						continue;
					}

					for (var len = self.areaValueArr.length - 1; len > idxData; ++idxData) {
						if (value >= self.areaValueArr[idxData] && value < self.areaValueArr[idxData + 1]) {
							break;
						}
					}
					
					raw.idxData = self.areaIncludeMap[idxData];
				}
				
				self.rawDataArr = resp.filter(function(elm) {
					return -1 < elm.idxData;
				});
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
							return z.toComma(value);
						}
					}					
				};

			
			// 1. 데이터 시간 구간 확정 후
			var startYMD = moment(self.startYMD),
				endYMD = moment(self.endYMD),
				timeBound = self.searchDtl.radioTimeBound,
				diffTime = 0;
				
			switch (timeBound) {
				case 'year':
					diffTime = endYMD.diff(startYMD, 'years') + 1;
					
					var tmp = startYMD.clone();
					
					for (var i = 0; diffTime > i; ++i) {
						xAxisArr.push(tmp.format('YYYY'));
						tmp.add(1, 'year');
					}
					break;
				case 'quarter':
					diffTime = endYMD.diff(startYMD, 'quarters') + 1;
					
					var tmp = startYMD.clone();
					
					for (var i = 0; diffTime > i; ++i) {
						xAxisArr.push(tmp.format('YYYY.Q[Q]'));
						tmp.add(1, 'quarter');
					}
					break;
				case 'month':
					diffTime = endYMD.diff(startYMD, 'months') + 1;

					var tmp = startYMD.clone();
					
					for (var i = 0; diffTime > i; ++i) {
						xAxisArr.push(tmp.format('YYYY.MM'));
						tmp.add(1, 'month');
					}
					break;
				case 'half':
					diffTime = Math.floor(endYMD.diff(startYMD, 'quarters') / 2) + 1;

					var tmp = startYMD.clone();
					
					for (var i = 0; diffTime > i; ++i) {
						xAxisArr.push(tmp.format('YYYY.') + (6 > tmp.get('month') ? '1' : '2') + 'H');
						tmp.add(2, 'quarter');
					}
					break;
			}

			// 2. 기존 분양연도 컬럼 규칙에 맞도록 수정
			for (var i in rawDataArr) {
				var raw = rawDataArr[i],
					mmt = moment(raw['입주일'], 'YYYYMM');

				switch (timeBound) {
					case 'year':
						raw['입주일'] = mmt.format('YYYY');
						break;
					case 'month':
						raw['입주일'] = mmt.format('YYYY.MM');
						break;
					case 'half':
						raw['입주일'] = mmt.format('YYYY.') + (6 > mmt.get('month') ? '1' : '2') + 'H';
						break;
					case 'quarter':
						raw['입주일'] = mmt.format('YYYY.Q[Q]');
						break;
				}
			}


			// 정렬: 상가종류, 분양연도 오름차순
			// 연도 - 1년 기간, 년도 - 10년 기간 ㄷㄷ
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
//			self.yAxisArr = chartSeries;
			
//			console.log(chartOptions);
//			console.log(chartSeries);

			// 20230717 전국 데이터 시간 소요로 인해 추가 
			KTApp.unblockPage();
			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);

			// 마지막 구간 바로 실행
			self.$wrapper.find('.clickYears').children('span').last().click();
		},
		
		updateDataByYear: function(chartOptions, chartSeries) {
			var self = this,
				sanggaMap = self.sanggaMap,
				prevSanggaType = '',
				prevData,
				columnNm = '총점포수',
				searchDtl = self.searchDtl;
				
			if (searchDtl && searchDtl.radioResultColumn) {
				columnNm = searchDtl.radioResultColumn;
			}

			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));
			
			// 목록에 일단 전부 넣어놓아야 null 목록도 표시됨 ㅠㅠ
			if ('area' === self.columnMode) {
				for (var i in self.areaArr) {
					prevData = {
						name: self.areaArr[i],
						data: Array.apply(null, Array(self.diffTime)).map(function() {return 0;})
					};
					
					chartSeries.push(prevData);
				}

				for (var i in rawDataArr) {
					var raw = rawDataArr[i];

					var idxYear = self.xAxisArr.indexOf(raw['입주일']);
					if (-1 < idxYear) {
						chartSeries[raw.idxData].data[idxYear] += parseFloat(raw[columnNm]);
					}
				}
			} else {
				for (var i in self.sanggaArr) {
					prevData = {
						name: self.sanggaArr[i],
						data: Array.apply(null, Array(self.diffTime)).map(function() {return 0;})
					};
					
					chartSeries.push(prevData);
				}

			
				for (var i in rawDataArr) {
					var raw = rawDataArr[i],
						idxData = sanggaMap[raw['상가유형']];
	
					if (isNaN(idxData)) {
						continue;
					}
	
					var idxYear = self.xAxisArr.indexOf(raw['입주일']);
					
					if (-1 < idxYear) {
						chartSeries[idxData].data[idxYear] += parseFloat(raw[columnNm]);
					}
				}
			}

			var isPy = '연면적' === columnNm && self.searchDtl && 'py' === self.searchDtl.radioAreaUnit;
			
			// 합산 이후에는 모든 데이터 소수점 2자리까지 출력
			for (var i in chartSeries) {
				var series = chartSeries[i];
				
				for (var j in series.data) {
					if (isPy) {
						series.data[j] /= zo.py2m;
					}
					
					series.data[j] = Math.round(100 * series.data[j]) / 100;
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
	
	
	// 동 + 상가 유형별 공급 추이 차트
	var chartSupplyTrendEnterDong = {
		
		init: function(param, searchDtl) {
			var self = this;
			
			self.apexChart = '#chart_3_1';
			self.tableSelector = '#table_3_1';
			self.$wrapper = $(self.apexChart).closest('[data-chart-wrapper]').show();
			self.param = param;
			self.searchDtl = searchDtl;

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


			self.columnMode = 'sangga';
			if (self.searchDtl && 'area' === self.searchDtl.columnMode) {
				self.columnMode = 'area';
			}

			var isPy = self.searchDtl && 'py' === self.searchDtl.radioAreaUnit;

			self.areaArr = $.extend(true, [], isPy ? areaTypePyArr : areaTypeArr);
			self.areaValueArr = $.extend(true, [], areaTypeValueArr);
			self.areaIncludeMap = $.extend(true, {}, areaTypeIncludeMap); 
			
			if (self.searchDtl && self.searchDtl.checkAreaBound.length) {
				var includeArr = $.extend(true, [], self.searchDtl.checkAreaBound).map(function(val) {
						return parseInt(val.split(',')[0]);
					});

				for (var i in self.areaIncludeMap) {
					self.areaIncludeMap[i] = includeArr.indexOf(self.areaValueArr[i]);
				}
				
				self.areaArr = self.areaArr.filter(function(elm, idx) {
					return -1 < self.areaIncludeMap[idx];
				});
			}

			// 동 이름 목록 로딩
			// FIXME: 이름으로 매칭했는데, 법정동코드로 해야되면 수정 필요
			self.dongArr = [];
			self.isSgg = (! param) || ('emd' !== param.jusoCd && ! param.sggnm);
			self.sidoArr = [];
			
			if (param && param.isBizdist) {
				self.isSgg = false;
			}
			
			var dongArr = apiSearchEmd.getDongArr();
			var sidoArr = apiSearchEmd.getSidoArr();

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

			self.$wrapper.find('[data-sgg-nm]').text('');
			self.$wrapper.find('[data-dong-nm]').text('');
			self.$wrapper.find('[data-last-year]').text('');
			
			self.setBtnListener();

//			chart.render().then(function() {
//				// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
//				chart.updateSeries([]);

//				chart.updateSeries([{
//					name: '동',
//					data: [0, 0, 0, 0, 0, 0]
//				}]);

				if (self.param) {
					self.diffTime = 4;

					self.endYMD = self.searchDtl.endYMD;

					// 1. 데이터 시간 구간 확정 후
					var endYMD = moment(self.searchDtl.endYMD),
						startYMD = null,
						timeBound = self.searchDtl.radioTimeBound;
						
					switch (timeBound) {
						case 'year':
							startYMD = endYMD.clone().subtract(self.diffTime, 'year').endOf('year').add(1, 'day');
							self.endYMDText = endYMD.format('YYYY');
							break;
						case 'quarter':
							startYMD = endYMD.clone().subtract(self.diffTime, 'quarter').endOf('quarter').add(1, 'day');
							self.endYMDText = endYMD.format('YYYY.Q[Q]');
							break;
						case 'month':
							startYMD = endYMD.clone().subtract(self.diffTime, 'month').endOf('month').add(1, 'day');
							self.endYMDText = endYMD.format('YYYY.MM');
							break;
						case 'half':
							startYMD = endYMD.clone().subtract(self.diffTime * 2, 'quarter').add(1, 'day');
							self.endYMDText = endYMD.format('YYYY.') + (6 > endYMD.get('month') ? '1' : '2') + 'H';
							break;
					}

					self.startYMD = startYMD.format('YYYYMMDD');

					self.$wrapper.find('[data-sgg-nm]').text(param.sggnm || param.sidonm);
					if (self.param.isBizdist) {
						self.$wrapper.find('[data-dong-nm]').text(param.bizdistnm);
					} else {
						self.$wrapper.find('[data-dong-nm]').text(param.dongnm);
					}
					self.$wrapper.find('[data-last-year]').text(self.endYMDText);
					
					self.loadData().done(function(resp) {
						self.loadAxis();
						self.updateData();
					});
				}
//			});

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
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					startYMD: self.startYMD,
					endYMD: self.endYMD,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' 
				};

			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;
			}

			return z.xAsync('SupplyTrendEnter', '공급추이차트', 'select', param, 'json').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;

				var timeBound = self.searchDtl.radioTimeBound;

				// 2. 기존 분양연도 컬럼 규칙에 맞도록 수정
				for (var i in resp) {
					var raw = resp[i],
						ymd = 4 === raw['입주일'].length ? raw['입주일'] + '01' : raw['입주일'],
						mmt = moment(ymd, 'YYYYMM');
	
					switch (timeBound) {
						case 'year':
							raw['입주일'] = mmt.format('YYYY');
							break;
						case 'month':
							raw['입주일'] = mmt.format('YYYY.MM');
							break;
						case 'half':
							raw['입주일'] = mmt.format('YYYY.') + (6 > mmt.get('month') ? '1' : '2') + 'H';
							break;
						case 'quarter':
							raw['입주일'] = mmt.format('YYYY.Q[Q]');
							break;
					}
				}

				// 면적 기준에 제외될 데이터 정리
				for (var i in resp) {
					var raw = resp[i],
						idxData = 0,
						value = parseFloat(raw['연면적']);

					if (isNaN(value) || 0 > value) {
						raw.idxData = -1;
						continue;
					}

					for (var len = self.areaValueArr.length - 1; len > idxData; ++idxData) {
						if (value >= self.areaValueArr[idxData] && value < self.areaValueArr[idxData + 1]) {
							break;
						}
					}
					
					raw.idxData = self.areaIncludeMap[idxData];
				}
				
				self.rawDataArr = resp.filter(function(elm) {
					return -1 < elm.idxData;
				});
			});
		},
		
		loadCondition: function() {
		},


		loadAxis: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				sanggaMap = self.sanggaMap,
				xAxisArr = $.extend(true, [], self.sanggaArr);


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

				return 0;
			});

			// 엑셀 저장용 정보로도 활용될 예정
			self.xAxisArr = xAxisArr;
//			self.yAxisObj = yAxisObj;
		},

		// 데이터 정제 후에 updateOptions, updateSeries 호출
		updateData: function() {
			var self = this,
				chartOptions = {},
				chartSeries = [],
				categories = self.sanggaArr;
				
			// 이전 대비 데이터 가공 후 출력
			self.updateDataComparePrev();

			self.updateDataByDong(chartOptions, chartSeries);
			
			if ('area' === self.columnMode) {
				categories = self.areaArr;
			}

			// 엑셀 저장용 정보로도 활용될 예정
//			self.yAxisArr = chartSeries;
			
//			console.log(chartOptions);
//			console.log(chartSeries);

			// bar + stack 은 왜 동적 수정이 안되는지 모르겠음 > 결국 매번 새로 생성하도록 수정
			// 차트 초기화 퍼블리싱 코드 옮겨옴
			var options = {
				series: chartSeries,
				chart: {
					width: '100%',
					height: 240,
					type: 'bar',
					stacked: true,
			        toolbar: {
			            show: false
			        }
//			        zoom: {
//			            enabled: true
//			        }					
				},
//			    responsive: [{
//			        breakpoint: 480,
//			        options: {
//			            legend: {
//			                position: 'bottom',
//			                offsetX: -10,
//			                offsetY: 0
//			            }
//			        }
//			    }],				
				plotOptions: {
					bar: {
						horizontal: true
//						borderRadius: 8
					},
				},
				dataLabels: { 	
					enabled: false
				},
			    colors: ['#8176d4','#4d5dbe','#2985d2','#2eb7c4','#4cd3c5','#60bd85','#609057','#a7b01e','#b5d130','#f4eb00','#f1d200','#edaa4b','#ec6751','#e55d81'],
				stroke: {
					width: 1,
					colors: ['#fff']
				},
				tooltip: {
					y: {
		                formatter: function(value) {
							return z.toComma(value) + ' ' + self.searchDtl.unitText;
						}
					}
				},				
				xaxis: {
					categories: categories,
			        axisBorder: {
			            show: false,
			        },
			        axisTicks: {
			            show: false,
			        },
			        labels: {
			            show: false,
			        },
				},
				yaxis: {
					title: {
						text: undefined
					}
				},
			    grid: {
			        show: false,
			    },
			    legend: {
					showForSingleSeries: true,
					showForNullSeries: true,
			        show: true,
			        position: 'bottom',
			        horizontalAlign: 'left',
			        fontSize: '10px',
			        fontFamily: 'Noto Sans Korean',
			        fontWeight: 400,
			        markers: {
			            width: 8,
			            height: 8,
			            radius: 12,
			        },
			    },
			    fill: {
			        opacity: 1
			    }
			};
			
			if (self.chart) {
				self.chart.destroy();
			}
	
			var chart = new ApexCharts($(self.apexChart)[0], options);
			
			self.chart = chart;

			chart.render();
		},
		
		updateDataByDong: function(chartOptions, chartSeries) {
			var self = this,
				dongArr = self.dongArr,
				sanggaArr = self.sanggaArr,
				sanggaMap = self.sanggaMap,
				prevDong = '',
				prevData,
				columnNm = '총점포수',
				searchDtl = self.searchDtl;
				
			if (searchDtl && searchDtl.radioResultColumn) {
				columnNm = searchDtl.radioResultColumn;
			}

			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));

			if ('area' === self.columnMode) {
				// 전국 데이터 작업
				// 지역설정 시 전국을 선택했을 경우 
				if(self.param.sidonm == '전국') {
					for(var i in self.sidoArr) {
						prevData = {
							name: self.sidoArr[i],
							data: Array.apply(null, Array(self.areaArr.length)).map(function() {return 0;})
						};
	
						chartSeries.push(prevData);
					}
				} else {
					for (var i in self.dongArr) {
						prevData = {
							name: self.dongArr[i],
							data: Array.apply(null, Array(self.areaArr.length)).map(function() {return 0;})
						};
	
						chartSeries.push(prevData);
					}
				}
				for (var i in rawDataArr) {
					var raw = rawDataArr[i];
					
					// 데이터 표시는 선택한(마지막) 연도 데이터만
					if (self.endYMDText !== raw['입주일']) {
						continue;
					}
	
					if(self.param.sidonm == '전국') {
						prevData = chartSeries[self.sidoArr.indexOf(raw.sidonm)];
					} else {
						prevData = chartSeries[self.dongArr.indexOf(self.isSgg ? raw.sggnm : raw.dongnm)];	
					}

					prevData.data[raw.idxData] += parseFloat(raw[columnNm]);
				}
			} else {
				// 지역설정 시 전국을 선택했을 경우 
				if(self.param.sidonm == '전국') {
					for(var i in self.sidoArr) {
						prevData = {
							name: self.sidoArr[i],
							data: Array.apply(null, Array(sanggaArr.length)).map(function() {return 0;})
						};

						chartSeries.push(prevData);
					}
				} else {
					for (var i in self.dongArr) {
						prevData = {
							name: self.dongArr[i],
							data: Array.apply(null, Array(sanggaArr.length)).map(function() {return 0;})
						};

						chartSeries.push(prevData);
					}
				}
				for (var i in rawDataArr) {
					var raw = rawDataArr[i];
	
					// 데이터 표시는 선택한(마지막) 연도 데이터만
					if (self.endYMDText !== raw['입주일']) {
						continue;
					}
					
					if(self.param.sidonm == '전국') {
						prevData = chartSeries[self.sidoArr.indexOf(raw.sidonm)];
					} else {
						prevData = chartSeries[self.dongArr.indexOf(self.isSgg ? raw.sggnm : raw.dongnm)];	
					}
					
					var idxSangga = sanggaMap[raw['상가유형']];
					prevData.data[idxSangga] += parseFloat(raw[columnNm]);
				}
			}
			
			var isPy = '연면적' === columnNm && self.searchDtl && 'py' === self.searchDtl.radioAreaUnit;

			// 합산 이후에는 모든 데이터 소수점 2자리까지 출력
			for (var i in chartSeries) {
				var series = chartSeries[i];
				
				for (var j in series.data) {
					if (isPy) {
						series.data[j] /= zo.py2m;
					}
					
					series.data[j] = Math.round(100 * series.data[j]) / 100;
				}
			}
		},
		
		updateDataComparePrev: function() {
			var self = this,
				dongArr = self.dongArr,
				areaArr = self.areaArr,
				sanggaArr = self.sanggaArr,
				sanggaMap = self.sanggaMap,
				prevSanggaType = '',
				prevYear = '',
				prevData,
				columnNm = '총점포수',
				timeBound = self.searchDtl.radioTimeBound,
				searchDtl = self.searchDtl,
				columnMode = self.columnMode,
				columnArr = 'area' === columnMode ? areaArr : sanggaArr;
				
			if (searchDtl && searchDtl.radioResultColumn) {
				columnNm = searchDtl.radioResultColumn;
			}
			
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
				
				if (a['입주일'] < b['입주일']) {
					return -1;
				}
				if (a['입주일'] > b['입주일']) {
					return 1;
				}

				return 0;
			});

			var compResultArr = [];

			// 출력용 데이터 원본 생성
			for (var i in columnArr) {
				var compareObj = {
					title: columnArr[i],
					compare0: 0,
					compare1: 0,
					compare2: 0,
					compare3: 0,
					class1: 'text-success',
					class2: 'text-success',
					class3: 'text-success',
					icon1: '<i class="fa fa-caret-down text-success"></i>',
					icon2: '<i class="fa fa-caret-down text-success"></i>',
					icon3: '<i class="fa fa-caret-down text-success"></i>'
				};
				
				compResultArr.push(compareObj);
			}

			// 정렬된 데이터 순서로 합산 진행
			var endYMD = moment(self.endYMD, 'YYYYMMDD');
			for (var i in rawDataArr) {
				var raw = rawDataArr[i],
					comp = compResultArr['area' === columnMode ? raw.idxData : sanggaMap[raw['상가유형']]],
					startYMD = raw['입주일'],
					diff = 0;
					
				if (! comp) {
					// console.log(raw);
					continue;
				}

				switch (timeBound) {
					case 'year':
						startYMD = moment(startYMD, 'YYYY');
						diff = endYMD.diff(startYMD, 'year');
						break;
					case 'quarter':
						startYMD = moment(startYMD, 'YYYY.Q');
						diff = endYMD.diff(startYMD, 'quarter');
						break;
					case 'month':
						startYMD = moment(startYMD, 'YYYY.MM');
						diff = endYMD.diff(startYMD, 'month');
						break;
					case 'half':
						var endHalf = 6 > endYMD.get('month') ? 1 : 2,
							startHalf = parseInt(startYMD.substr(5, 1));
						
						startYMD = moment(startYMD, 'YYYY');
						
						diff = endYMD.diff(startYMD, 'year') * 2 + (endHalf - startHalf);
						break;
				}

				if ('number' === (typeof comp['compare' + diff])) {
					comp['compare' + diff] +=  parseFloat(raw[columnNm]);
				}
			}
			
			// 비교치 % 계산
			for (var i in compResultArr) {
				var comp = compResultArr[i];
				
				for (var j = 1; self.diffTime > j; ++j) {
					// 둘 다 0 이면 계산 제외, 예전만 0 이고 신규 데이터 있으면 New 표시
					// + class, icon 표시 수정
					if (! comp['compare' + j]) {
						comp['class' + j] = '';
						comp['icon' + j] = '';
						
						if (! comp['compare0']) {
							comp['compare' + j] = '-';
						} else {
							comp['compare' + j] = 'New';
							comp['class' + j] = 'text-danger';
						}
					} else {
						comp['compare' + j] = z.toComma(Math.round(100 * (comp['compare0'] - comp['compare' + j]) / comp['compare' + j])) + '%';
						
						if (0 > ('' + comp['compare' + j]).indexOf('-')) {
							comp['class' + j] = 'text-danger';
							comp['icon' + j] = '<i class="fa fa-caret-up text-danger"></i>';
						}
					}
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
				excelOpt = {header: ['업종분포']};

			// FIXME: 엑셀 표시 나중에
			
			return result;
		}
	};

	// 상가 유형별 or 연면적 크기별 공급 추이 차트
	var chartSupplyTrendEnterSanggaType = {
		
		init: function(param, searchDtl) {
			var self = this,
				apexChart = '#chart_3_2';
			
			self.tableSelector = '#table_3_2';
			self.$wrapper = $(apexChart).closest('[data-chart-wrapper]').show();
			self.param = param;
			self.searchDtl = searchDtl;

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
			

			self.columnMode = 'sangga';
			if (self.searchDtl && 'area' === self.searchDtl.columnMode) {
				self.columnMode = 'area';
			}

			var isPy = self.searchDtl && 'py' === self.searchDtl.radioAreaUnit;

			self.areaArr = $.extend(true, [], isPy ? areaTypePyArr : areaTypeArr);
			self.areaValueArr = $.extend(true, [], areaTypeValueArr);
			self.areaIncludeMap = $.extend(true, {}, areaTypeIncludeMap); 
			
			if (self.searchDtl && self.searchDtl.checkAreaBound.length) {
				var includeArr = $.extend(true, [], self.searchDtl.checkAreaBound).map(function(val) {
						return parseInt(val.split(',')[0]);
					});

				for (var i in self.areaIncludeMap) {
					self.areaIncludeMap[i] = includeArr.indexOf(self.areaValueArr[i]);
				}
				
				self.areaArr = self.areaArr.filter(function(elm, idx) {
					return -1 < self.areaIncludeMap[idx];
				});
			}
			
			var columnArr = 'area' === self.columnMode ? self.areaArr : self.sanggaArr;
			
			// 차트 초기화 퍼블리싱 코드 옮겨옴
			var options = {
				series: Array.apply(null, Array(columnArr.length)).map(function() {return 0;}),
				chart: {
					width: '100%',
					height: 260,  
					type: 'donut',
				},
				labels: columnArr,
//				responsive: [{
//					breakpoint: 360,
//					options: {
//						chart: {
//							width: 180
//						},
//						legend: {
//							position: 'bottom'
//						}
//					}
//				}],
			    colors: ['#5e58c9','#2985d2','#2eb7c4','#6d9d64','#b5bf1b','#f1c644','#f28f6c'],
//			    stroke: {
//			        show: true,
//			        colors: '#ffffff',
//			        width: 1,
//			        dashArray: 0,
//			    },
			    dataLabels: {
			        enabled: false,
			    },
				tooltip: {
					y: {
		                formatter: function(value) {
							var percent = '';
							
							if (self.totalSupply) {
								percent = ' (' + Math.round(value / self.totalSupply * 100) + '%)';
							}
							
							return z.toComma(value) + ' ' + self.searchDtl.unitText + percent;
						}
					}
				},
			    legend: {
			        show: true,
			        showForSingleSeries: true,
			        showForNullSeries: true,
			        showForZeroSeries: true,
			        position: 'bottom',
			        horizontalAlign: 'center',
			        floating: false,
			        fontSize: '10px',
			        fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
			        fontWeight: 400,
			        markers: {
			            width: 8,
			            height: 8,
			            radius: 12,
			        },
			    },

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
				// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
				chart.updateSeries([]);

				if (self.param) {
					self.diffTime = 4;
					self.endYMD = self.searchDtl.endYMD;

					// 1. 데이터 시간 구간 확정 후
					var endYMD = moment(self.searchDtl.endYMD),
						startYMD = null,
						timeBound = self.searchDtl.radioTimeBound;

					switch (timeBound) {
						case 'year':
							startYMD = endYMD.clone().subtract(self.diffTime, 'year').endOf('year').add(1, 'day');
							self.endYMDText = endYMD.format('YYYY');
							break;
						case 'quarter':
							startYMD = endYMD.clone().subtract(self.diffTime, 'quarter').endOf('quarter').add(1, 'day');
							self.endYMDText = endYMD.format('YYYY.Q[Q]');
							break;
						case 'month':
							startYMD = endYMD.clone().subtract(self.diffTime, 'month').endOf('month').add(1, 'day');
							self.endYMDText = endYMD.format('YYYY.MM');
							break;
						case 'half':
							startYMD = endYMD.clone().subtract(self.diffTime * 2, 'quarter').add(1, 'day');
							self.endYMDText = endYMD.format('YYYY.') + (6 > endYMD.get('month') ? '1' : '2') + 'H';
							break;
					}
					
					self.startYMD = startYMD.format('YYYYMMDD');

					self.$wrapper.find('[data-sgg-nm]').text(param.sggnm || param.sidonm);
					if (! self.param.isBizdist) {
						self.$wrapper.find('[data-dong-nm]').text(param.dongnm);
					} else {
						self.$wrapper.find('[data-dong-nm]').text(param.bizdistnm);
					}

					self.$wrapper.find('[data-last-year]').text(self.endYMDText);
					
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
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					startYMD: self.startYMD,
					endYMD: self.endYMD,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' 
				};
				
			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;
			}

			return z.xAsync('SupplyTrendEnter', '공급추이차트', 'select', param, 'json').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;
				
//				console.log(resp);
				
				/**
					분양가: ""
					분양면적: ""
					분양일: "20140408"
					상가명: "강남더샵포레스트단지내상가"
					상가유형: "단지내상가"
					상가코드: "S01010000000732"
					연면적: "569.03"
					입주일: "20160727"
					전용면적: ""
					층: ""
					호수: ""
				 */

				var timeBound = self.searchDtl.radioTimeBound;

				// 2. 기존 분양연도 컬럼 규칙에 맞도록 수정
				for (var i in self.rawDataArr) {
					var raw = self.rawDataArr[i],
						mmt = moment(raw['입주일'], 'YYYYMM');
	
					switch (timeBound) {
						case 'year':
							raw['입주일'] = mmt.format('YYYY');
							break;
						case 'month':
							raw['입주일'] = mmt.format('YYYY.MM');
							break;
						case 'half':
							raw['입주일'] = mmt.format('YYYY.') + (6 > mmt.get('month') ? '1' : '2') + 'H';
							break;
						case 'quarter':
							raw['입주일'] = mmt.format('YYYY.Q[Q]');
							break;
					}
				}

				// 면적 기준에 제외될 데이터 정리
				for (var i in resp) {
					var raw = resp[i],
						idxData = 0,
						value = parseFloat(raw['연면적']);

					if (isNaN(value) || 0 > value) {
						raw.idxData = -1;
						continue;
					}

					for (var len = self.areaValueArr.length - 1; len > idxData; ++idxData) {
						if (value >= self.areaValueArr[idxData] && value < self.areaValueArr[idxData + 1]) {
							break;
						}
					}
					
					raw.idxData = self.areaIncludeMap[idxData];
				}
				
				self.rawDataArr = resp.filter(function(elm) {
					return -1 < elm.idxData;
				});
			});
		},
		
		loadCondition: function() {
		},


		loadAxis: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				xAxisArr = $.extend(true, [], 'area' === self.columnMode ? self.areaArr : self.sanggaArr),
				sanggaMap = self.sanggaMap,
				yAxisObj = {
					title: {
						text: ''
					}
				};

			// 정렬: 상가종류, 분양연도 오름차순
			// 연도 - 1년 기간, 년도 - 10년 기간 ㄷㄷ
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
//			self.yAxisObj = yAxisObj;
		},

		// 데이터 정제 후에 updateOptions, updateSeries 호출
		updateData: function() {
			var self = this,
				chartOptions = {
					xaxis: {
						categories: self.xAxisArr
					},
//					yaxis: self.yAxisObj
				},
				chartSeries = [];

			// 이전 대비 데이터 가공 후 출력
			//self.updateDataComparePrev();
			
			self.updateDataBySanggaType(chartOptions, chartSeries);

			// 엑셀 저장용 정보로도 활용될 예정
//			self.yAxisArr = chartSeries;
			
//			console.log(chartOptions);
//			console.log(chartSeries);

			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);			
		},
		
		updateDataBySanggaType: function(chartOptions, chartSeries) {
			var self = this,
				sanggaArr = self.sanggaArr,
				sanggaMap = self.sanggaMap,
				areaArr = self.areaArr,
				columnNm = '총점포수',
				searchDtl = self.searchDtl,
				columnMode = self.columnMode,
				columnArr = 'area' === columnMode ? areaArr : sanggaArr;
				
			if (searchDtl && searchDtl.radioResultColumn) {
				columnNm = searchDtl.radioResultColumn;
			}

			// pie, donut 차트는 배열 그대로 입력
			for (var i in columnArr) {
				chartSeries.push(0);
			}
			
			var prevData = {
				data: chartSeries
			};

			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));

			for (var i in rawDataArr) {
				var raw = rawDataArr[i];

				// 데이터 표시는 선택한(마지막) 연도 데이터만
				if (self.endYMDText !== raw['입주일']) {
					continue;
				}
				
				var idxData = 'area' === columnMode ? raw.idxData : sanggaMap[raw['상가유형']];

				prevData.data[idxData] += parseFloat(raw[columnNm]);
			}
			
			var isPy = '연면적' === columnNm && self.searchDtl && 'py' === self.searchDtl.radioAreaUnit;

			// 합산 이후에는 모든 데이터 소수점 2자리까지 출력 + 퍼센트% 계산
			var total = 0;
			for (var i in chartSeries) {
				if (isPy) {
					chartSeries[i] /= zo.py2m;
				}
				
				chartSeries[i] = Math.round(100 * chartSeries[i]) / 100;
				total += chartSeries[i];
			}
			
			self.totalSupply = total; 
		},


		updateDataComparePrev: function() {
			var self = this,
				dongArr = self.dongArr,
				sanggaArr = self.sanggaArr,
				sanggaMap = self.sanggaMap,
				areaArr = self.areaArr,
				prevSanggaType = '',
				prevYear = '',
				prevData,
				columnNm = '총점포수',
				timeBound = self.searchDtl.radioTimeBound,
				columnMode = self.columnMode,
				columnArr = 'area' === columnMode ? areaArr : sanggaArr;
				
			if (self.searchDtl && self.searchDtl.radioResultColumn) {
				columnNm = self.searchDtl.radioResultColumn;
			}
			
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
				
				if (a['입주연도'] < b['입주연도']) {
					return -1;
				}
				if (a['입주연도'] > b['입주연도']) {
					return 1;
				}

				return 0;
			});

			var compResultArr = [];

			// 출력용 데이터 원본 생성
			for (var i in columnArr) {
				var compareObj = {
					title: columnArr[i],
					compare0: 0,
					compare1: 0,
					compare2: 0,
					compare3: 0,
					class1: 'text-success',
					class2: 'text-success',
					class3: 'text-success',
					icon1: '<i class="fa fa-caret-down text-success"></i>',
					icon2: '<i class="fa fa-caret-down text-success"></i>',
					icon3: '<i class="fa fa-caret-down text-success"></i>'

				};
				
				compResultArr.push(compareObj);
			}
						
			
			// 정렬된 데이터 순서로 합산 진행
			var endYMD = moment(self.endYMD, 'YYYYMMDD');

			for (var i in rawDataArr) {
				var raw = rawDataArr[i],
					comp = compResultArr['area' === columnMode ? raw.idxData : sanggaMap[raw['상가유형']]],
					startYMD = raw['입주일'],
					diff = 0;

				switch (timeBound) {
					case 'year':
						startYMD = moment(startYMD, 'YYYY');
						diff = endYMD.diff(startYMD, 'year');
						break;
					case 'quarter':
						startYMD = moment(startYMD, 'YYYY.Q');
						diff = endYMD.diff(startYMD, 'quarter');
						break;
					case 'month':
						startYMD = moment(startYMD, 'YYYY.MM');
						diff = endYMD.diff(startYMD, 'month');
						break;
					case 'half':
						var endHalf = 6 > endYMD.get('month') ? 1 : 2,
							startHalf = parseInt(startYMD.substr(5, 1));
						
						startYMD = moment(startYMD, 'YYYY');
						
						diff = endYMD.diff(startYMD, 'year') * 2 + (endHalf - startHalf);
						break;
				}

				if ('number' === (typeof comp['compare' + diff])) {
					comp['compare' + diff] +=  parseFloat(raw[columnNm]);
				}
			}
			
			// 비교치 % 계산
			for (var i in compResultArr) {
				var comp = compResultArr[i];
				
				for (var j = 1; self.diffTime > j; ++j) {
					// 둘 다 0 이면 계산 제외, 예전만 0 이고 신규 데이터 있으면 New 표시
					// + class, icon 표시 수정
					if (! comp['compare' + j]) {
						comp['class' + j] = '';
						comp['icon' + j] = '';
						
						if (! comp['compare0']) {
						} else {
							comp['compare' + j] = 'New';
							comp['class' + j] = 'text-danger';
						}
					} else {
						comp['compare' + j] = z.toComma(Math.round(100 * (comp['compare0'] - comp['compare' + j]) / comp['compare' + j])) + '%';

						if (0 > ('' + comp['compare' + j]).indexOf('-')) {
							comp['class' + j] = 'text-danger';
							comp['icon' + j] = '<i class="fa fa-caret-up text-danger"></i>';
						}						
					}
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
				excelOpt = {header: ['업종분포']};

			// FIXME: 엑셀 표시 나중에
			
			return result;
		}
	};
	
	
	// 공급 추이 상가유형 데이터
	var tableSupplyTrendEnterSanggaType = {
		init: function(param, searchDtl) {
			var self = this;

			self.param = param;
			self.searchDtl = searchDtl;
			self.$table = $('#table_5_1');
			self.$thead = self.$table.find('thead');
			self.$tbody = $('#tbody_5_1').html('');
			self.$wrapper = self.$tbody.closest('[data-table-wrapper]');
			self.startYMD = null;
			self.endYMD = null;
			
			
			if (self.searchDtl && self.searchDtl.checkSanggaType.length) {
				self.isCustomSangga = true;
				self.sanggaArr = $.extend(true, [], self.searchDtl.checkSanggaType);
			} else {
				self.isCustomSangga = false;
				self.sanggaArr = $.extend(true, [], sanggaTypeArr);
			}


			self.columnMode = 'sangga';
			if (self.searchDtl && 'area' === self.searchDtl.columnMode) {
				self.columnMode = 'area';
			}

			var isPy = self.searchDtl && 'py' === self.searchDtl.radioAreaUnit;

			self.areaArr = $.extend(true, [], isPy ? areaTypePyArr : areaTypeArr);
			self.areaValueArr = $.extend(true, [], areaTypeValueArr);
			self.areaIncludeMap = $.extend(true, {}, areaTypeIncludeMap); 
			
			if (self.searchDtl && self.searchDtl.checkAreaBound.length) {
				var includeArr = $.extend(true, [], self.searchDtl.checkAreaBound).map(function(val) {
						return parseInt(val.split(',')[0]);
					});

				for (var i in self.areaIncludeMap) {
					self.areaIncludeMap[i] = includeArr.indexOf(self.areaValueArr[i]);
				}
				
				self.areaArr = self.areaArr.filter(function(elm, idx) {
					return -1 < self.areaIncludeMap[idx];
				});
			}
			
			// 동 이름 목록 로딩
			// FIXME: 이름으로 매칭했는데, 법정동코드로 해야되면 수정 필요
			self.dongArr = [];
			self.sidoArr = [];
			self.isSgg = (! param) || ('emd' !== param.jusoCd && ! param.sggnm);
			
			if (param && param.isBizdist) {
				self.isSgg = false;
			}
			       
			var dongArr = apiSearchEmd.getDongArr();
			var sidoArr = apiSearchEmd.getSidoArr();

			if (self.isSgg) {
				dongArr = apiSearchEmd.getSggArr();
			} else if (param && param.isBizdist) {
				dongArr = apiSearchEmd.getBizdistArr();
			} 
			
			for (var i in dongArr) {
				self.dongArr.push(self.isSgg ? dongArr[i].sggnm : dongArr[i].dongnm);
			}
			

			if (self.param) {
				self.loadDataPre();
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
			
			self.setBtnListener();

			self.loadData().done(function(resp) {
				self.updateDataBySanggaType();
				self.updateData();
				$('#tbody_5_1 .maintotal').click();
			});
		},
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {
			var self=this;
			self.$tbody = $('#tbody_5_1').html('');
			self.$wrapper = self.$tbody.closest('[data-table-wrapper]');
			
			self.$wrapper.find('.allView2').off('click').on('click', function() {
				tableSupplyTrendEnterDetail.openAllView();
			});
		},
		
		loadDataPre: function (){
			var self = this,
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' 
				};
			
			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;
			}
			
			if (self.searchDtl){
				var data = z.xmlAjax('SupplyTrendEnter', '입주최종일자', 'select', param, 'json');
				var $startYMD = $('[data-wrapper="searchDetail"]').find('[name=startDurationYMD]');
				var now, nowCalc, pastCalc, pastCalc2;
				var past = moment($startYMD.val(), 'YYYY-MM-DD');
				if(data.length) {
					switch (self.searchDtl.radioTimeBound) {
						case 'year':
							now = moment(data[0].입주일).endOf('year');
							nowCalc = now.format('YYYYMMDD');
							past = past.startOf('year');
							pastCalc = now.clone().subtract(11, 'year').format('YYYYMMDD');
							pastCalc2 = now.clone().subtract(11, 'year').format('YYYY-MM-DD');
						break;	
						case 'half':
							now = moment(data[0].입주일);
							nowCalc = now;
							
							if (6 > nowCalc.get('month')) {
								nowCalc.set('month', 5).endOf('month');
							} else {
								nowCalc = nowCalc.endOf('year');
							}
							pastCalc = nowCalc.clone().subtract(23, 'quarter');
							pastCalc2 = nowCalc.clone().subtract(23, 'quarter').format('YYYY-MM-DD');
						break;
						case 'quarter':
							now = moment(data[0].입주일);
							nowCalc = now.endOf('quarter');
							pastCalc = now.clone().subtract(11, 'quarter').startOf('quarter');
							pastCalc2 = now.clone().subtract(11, 'quarter').startOf('quarter').format('YYYY-MM-DD');
						break;
						case 'month':
							now = moment(data[0].입주일);
							nowCalc = now.endOf('month');
							pastCalc = now.clone().subtract(11, 'month').startOf('month');
							pastCalc2 = now.clone().subtract(11, 'month').startOf('month').format('YYYY-MM-DD');
						break;
					}	
				}
				
				self.startYMD = past.format('YYYYMMDD');
				self.endYMD = nowCalc;
			}	
		},
		
		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					startYMD: self.startYMD,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' 
				};
				// 테이블은 시작부터 최근까지 전체데이터 조회 + 사용자 시간선택 아닐 떄에
			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;
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

			// 1. 데이터 시간 구간 확정 후: 테이블은 시작부터 현재까지 전체조회
			var startYMD = moment(self.startYMD),
//				endYMD = moment(self.endYMD),
				endYMD,
				timeBound = self.searchDtl.radioTimeBound,
				diffTime = 0,
				xAxisArr = [];
				
			switch (timeBound) {
				case 'year':
					endYMD = moment(self.endYMD).endOf('year');
					
					diffTime = endYMD.diff(startYMD, 'years') + 1;
					
					var tmp = startYMD.clone();
					
					for (var i = 0; diffTime > i; ++i) {
						xAxisArr.push(tmp.format('YYYY'));
						tmp.add(1, 'year');
					}
					break;
				case 'quarter':
					endYMD = moment(self.endYMD).endOf('quarter');
					diffTime = endYMD.diff(startYMD, 'quarters') + 1;
					
					var tmp = startYMD.clone();
					
					for (var i = 0; diffTime > i; ++i) {
						xAxisArr.push(tmp.format('YYYY.Q[Q]'));
						tmp.add(1, 'quarter');
					}
					break;
				case 'month':
					endYMD = moment(self.endYMD).endOf('month');
					diffTime = endYMD.diff(startYMD, 'months') + 1;

					var tmp = startYMD.clone();
					
					for (var i = 0; diffTime > i; ++i) {
						xAxisArr.push(tmp.format('YYYY.MM'));
						tmp.add(1, 'month');
					}
					break;
				case 'half':
					endYMD = moment(self.endYMD);
					
					if (6 > endYMD.get('month')) {
						endYMD.set('month', 5).endOf('month');
					} else {
						endYMD = endYMD.endOf('year');
					}
					
					diffTime = Math.floor(endYMD.diff(startYMD, 'quarters') / 2) + 1;

					var tmp = startYMD.clone();
					
					for (var i = 0; diffTime > i; ++i) {
						xAxisArr.push(tmp.format('YYYY.') + (6 > tmp.get('month') ? '1' : '2') + 'H');
						tmp.add(2, 'quarter');
					}
					break;
			}
			
			param.endYMD = 'custom' !== self.searchDtl.radioTimeBound ? endYMD : self.endYMD;
			
			return z.xAsync('SupplyTrendEnter', '공급추이차트', 'select', param, 'json').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				var rawDataArr = self.rawDataArr = resp,
					dongColumnNm = self.isSgg ? 'sggnm': 'dongnm';

				// 정렬: 동이름, 상가종류 오름차순
				rawDataArr = rawDataArr.sort(function(a, b) {
					if (a[dongColumnNm] < b[dongColumnNm]) {
						return -1;
					}
					if (a[dongColumnNm] > b[dongColumnNm]) {
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

	
				// 2. 기존 분양연도 컬럼 규칙에 맞도록 수정
				for (var i in rawDataArr) {
					var raw = rawDataArr[i],
						mmt = moment(raw['입주일'], 'YYYYMM');
	
					switch (timeBound) {
						case 'year':
							raw['입주일'] = mmt.format('YYYY');
							break;
						case 'month':
							raw['입주일'] = mmt.format('YYYY.MM');
							break;
						case 'half':
							raw['입주일'] = mmt.format('YYYY.') + (6 > mmt.get('month') ? '1' : '2') + 'H';
							break;
						case 'quarter':
							raw['입주일'] = mmt.format('YYYY.Q[Q]');
							break;
					}
				}

				// 면적 기준에 제외될 데이터 정리
				for (var i in rawDataArr) {
					var raw = rawDataArr[i],
						idxData = 0,
						value = parseFloat(raw['연면적']);

					if (isNaN(value) || 0 > value) {
						raw.idxData = -1;
						continue;
					}

					for (var len = self.areaValueArr.length - 1; len > idxData; ++idxData) {
						if (value >= self.areaValueArr[idxData] && value < self.areaValueArr[idxData + 1]) {
							break;
						}
					}
					
					raw.idxData = self.areaIncludeMap[idxData];
				}
				
				self.rawDataArr = resp.filter(function(elm) {
					if(elm.idxData <= -1){
						console.log(elm)
					}
					return -1 < elm.idxData;
				});

				self.diffTime = diffTime;
				self.xAxisArr = xAxisArr;
			});
		},

		updateDataBySanggaType: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				dongArr = self.dongArr,
				sidoArr = self.sidoArr,
				areaArr = self.areaArr,
				isSgg = self.isSgg,
				isBizdist = self.param.isBizdist,
				sanggaArr = self.sanggaArr,
				minYearInt = self.minYearInt,
				resultArr = [],
				columnNm = '총점포수',
				searchDtl = self.searchDtl,
				columnMode = self.columnMode,
				columnArr = 'area' === columnMode ? areaArr : sanggaArr;
				
			if (self.searchDtl && self.searchDtl.radioResultColumn) {
				columnNm = self.searchDtl.radioResultColumn;
			}

			if(self.param.sidonm == '전국') {
				var row = {
					dongnm: self.param.sidonm,
					data: Array.apply(null, Array(columnArr.length)).map(function() {
						return Array.apply(null, Array(self.diffTime)).map(function() {return 0;});
					})
				};

				// 1. 동 + 상가유형 별 데이터 생성
				for (var i in sidoArr) {
					var sidoData = $.extend(true, {}, row);
					
					sidoData.dongnm = sidoArr[i];
					resultArr.push(sidoData);
				}	
				// 2. 1번 형식대로 데이터 입력
				for (var i in rawDataArr) {
					var rawData = rawDataArr[i],
						idxSido = sidoArr.indexOf(rawData.sidonm),
						idxData = 'area' === columnMode ? rawData.idxData : sanggaArr.indexOf(rawData['상가유형']);
					
					// 미포함 데이터 제외
					if (0 > idxDong || 0 > idxData) {
						continue;
					}
					
					var sidoData = resultArr[idxSido],
						idxYear = self.xAxisArr.indexOf(rawData['입주일']);
						
					if (0 > idxYear) {
						continue;
					}
					
					sidoData.data[idxData][idxYear] += parseFloat(rawData[columnNm]);
				}
			} else {
				var row = {
					dongnm: isBizdist ? self.param.bizdistnm : (isSgg ? self.param.sidonm : self.param.sggnm),
					data: Array.apply(null, Array(columnArr.length)).map(function() {
						return Array.apply(null, Array(self.diffTime)).map(function() {return 0;});
					})
				};
			
				// 1. 동 + 상가유형 별 데이터 생성
				for (var i in dongArr) {
					var dongData = $.extend(true, {}, row);
					
					dongData.dongnm = dongArr[i];
					resultArr.push(dongData);
				}	
				// 2. 1번 형식대로 데이터 입력
				for (var i in rawDataArr) {
					var rawData = rawDataArr[i],
						idxDong = isBizdist ? 0 : dongArr.indexOf(isSgg ? rawData.sggnm : rawData.dongnm),
						idxData = 'area' === columnMode ? rawData.idxData : sanggaArr.indexOf(rawData['상가유형']);
					
					// 미포함 데이터 제외
					if (0 > idxDong || 0 > idxData) {
						continue;
					}
					
					var dongData = resultArr[idxDong],
						idxYear = self.xAxisArr.indexOf(rawData['입주일']);
						
					if (0 > idxYear) {
						continue;
					}
					
					dongData.data[idxData][idxYear] += parseFloat(rawData[columnNm]);
				}
			}
			
			
			// 3. 각 줄에 대한 합산을 마지막 줄에 추가 > 처음 줄에 추가
			for (var i in resultArr) {
				var data = resultArr[i].data,
					sum = Array.apply(null, Array(self.diffTime)).map(function() {return 0;});
				
				for (var j in data) {
					var sanggaRow = data[j];

					for (var k in sanggaRow) {
						sum[k] += sanggaRow[k];
					}
				}
				
				data.unshift(sum);
			}

			// 4. 전체 데이터 합산을 맨 처음 줄에 추가
			var sumRow = $.extend(true, {}, row),
				sumRowData = sumRow.data;
			
			sumRowData.push(Array.apply(null, Array(self.diffTime)).map(function() {return 0;}));
			
			for (var i in resultArr) {
				var data = resultArr[i].data;
				
				for (var j in data) {
					for (var k in data[j]) {
						sumRowData[j][k] += data[j][k];
					}
				}
			}
			
			resultArr.unshift(sumRow);
			
			// 연면적 + 평 조회의 경우 / 3.3
			var isPy = '연면적' === columnNm && searchDtl && 'py' === searchDtl.radioAreaUnit;
			
			// 5. 최종 결과 소수점 반올림 후 3자리 콤마
			for (var i in resultArr) {
				var data = resultArr[i].data;

				for (var j in data) {
					for (var k in data[j]) {
						if (0 === data[j][k]) {
							// 0 이면 - 로 치환
							data[j][k] = '-';
						} else {
							if (isPy) {
								data[j][k] /= zo.py2m;
							}

							data[j][k] = z.toComma(Math.round(data[j][k]));
						}
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
				tmpl = Handlebars.compile($('#tmplTableSupplyTrendEnterSanggaType').html()),
				$tr = self.$thead.find('tr:first-child'),
				columnMode = self.columnMode,
				columnArr = $.extend(true, [], 'area' === columnMode ? self.areaArr : self.sanggaArr),
				classNameArr = Array.apply(null, Array(columnArr.length - 1)).map(function() {return 'data-show';}),
				firstLineArr = Array.apply(null, Array(columnArr.length)).map(function() {return false;});

			$tr.find('th[rowspan="1"]').remove();

			for (var i = 0, len = self.xAxisArr.length; len > i; ++i) {
				var $th = $('<th/>', {rowspan: '1', text: self.xAxisArr[i]});
				
				$tr.append($th);
			}
			
			// 전체 합산도 표시하기 위해서 추가
			columnArr.unshift('계');
			classNameArr.unshift('maintotal');
			classNameArr.push('tr-border');
			firstLineArr.unshift(true);

			// 상권조회는 합산결과만 표시
			if (self.param.isBizdist) {
				self.resultArr = [self.resultArr[0]];
			}			
			
			self.$tbody.html('').append(tmpl({sanggaTypeArr: columnArr, dataArr: self.resultArr, rowspan: columnArr.length, classNameArr: classNameArr, firstLineArr: firstLineArr}));
		},
		
		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
//				var $header = $('#table_5_1');
				var $table = self.$tbody.closest('table');
				
//				var wsHeader = XLSX.utils.table_to_sheet($header[0]);
				var wsBody = XLSX.utils.table_to_sheet($table[0]);
				
//				var jsonHeader = XLSX.utils.sheet_to_json(wsHeader, {header: 1});
				var jsonBody = XLSX.utils.sheet_to_json(wsBody, {header: 1});

				// FIXME: 꼼수, 정확하게 정렬할 필요 있음
				jsonBody[0][1] = '연도';
				var jsonMerge = jsonBody;
				
				// XXX: 앞부분 라벨 채워넣기 - 필터 이후 확인용
				var lastLabel = '';
				var mainlen = jsonBody[0].length;
				var area = '';
				for (var i in jsonBody) {
					var row = jsonBody[i];
					
					if(i == 0 || mainlen === row.length){
						area = row[0];
					}
					
					if(mainlen !== row.length){						
						row.unshift(area);
					} 
				}
				
				var ws = XLSX.utils.json_to_sheet(jsonMerge, {skipHeader: true});
				result.resolve(ws);

				apiSearchEmd.addDownloadLog('추이');
			});

			return result;
		}
	};	
	

	// 공급 추이 상세 데이터
	var tableSupplyTrendEnterDetail = {
		init: function(param, searchDtl) {
			var self = this;
			self.$tbody = $('#rowDataTable').html('');
			self.param = param;
			self.searchDtl = searchDtl;
			self.startYMD = null;
			self.endYMD = null;
			
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

			self.columnMode = 'sangga';
			if (self.searchDtl && 'area' === self.searchDtl.columnMode) {
				self.columnMode = 'area';
			}

			var isPy = self.searchDtl && 'py' === self.searchDtl.radioAreaUnit;

			self.areaArr = $.extend(true, [], isPy ? areaTypePyArr : areaTypeArr);
			self.areaValueArr = $.extend(true, [], areaTypeValueArr);
			self.areaIncludeMap = $.extend(true, {}, areaTypeIncludeMap); 
			
			if (self.searchDtl && self.searchDtl.checkAreaBound.length) {
				var includeArr = $.extend(true, [], self.searchDtl.checkAreaBound).map(function(val) {
						return parseInt(val.split(',')[0]);
					});

				for (var i in self.areaIncludeMap) {
					self.areaIncludeMap[i] = includeArr.indexOf(self.areaValueArr[i]);
				}
				
				self.areaArr = self.areaArr.filter(function(elm, idx) {
					return -1 < self.areaIncludeMap[idx];
				});
			}

			if (self.param) {
				self.loadDataPre();
			}	
			
			self.loadData().done(function(resp) {
				//self.updateData();
			});
		},
		
		loadDataPre: function (){
			var self = this,
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' 
				};
			
			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;
			}
			
			if (self.searchDtl){
				var data = z.xmlAjax('SupplyTrendEnter', '입주최종일자', 'select', param, 'json');
				var $startYMD = $('[data-wrapper="searchDetail"]').find('[name=startDurationYMD]');
				var now, nowCalc, pastCalc, pastCalc2;
				var past = moment($startYMD.val(), 'YYYY-MM-DD');
				if(data.length) {
					switch (self.searchDtl.radioTimeBound) {
						case 'year':
							now = moment(data[0].입주일).endOf('year');
							nowCalc = now.format('YYYYMMDD');
							past = past.startOf('year');
							pastCalc = now.clone().subtract(11, 'year').format('YYYYMMDD');
							pastCalc2 = now.clone().subtract(11, 'year').format('YYYY-MM-DD');
						break;	
						case 'half':
							now = moment(data[0].입주일);
							nowCalc = now;
							
							if (6 > nowCalc.get('month')) {
								nowCalc.set('month', 5).endOf('month');
							} else {
								nowCalc = nowCalc.endOf('year');
							}
							pastCalc = nowCalc.clone().subtract(23, 'quarter');
							pastCalc2 = nowCalc.clone().subtract(23, 'quarter').format('YYYY-MM-DD');
						break;
						case 'quarter':
							now = moment(data[0].입주일);
							nowCalc = now.endOf('quarter');
							pastCalc = now.clone().subtract(11, 'quarter').startOf('quarter');
							pastCalc2 = now.clone().subtract(11, 'quarter').startOf('quarter').format('YYYY-MM-DD');
						break;
						case 'month':
							now = moment(data[0].입주일);
							nowCalc = now.endOf('month');
							pastCalc = now.clone().subtract(11, 'month').startOf('month');
							pastCalc2 = now.clone().subtract(11, 'month').startOf('month').format('YYYY-MM-DD');
						break;	
					}
				}
				
				self.startYMD = past.format('YYYYMMDD');
				self.endYMD = nowCalc;
			}	
		},
		
		loadData: function() {
			var self = this,
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					startYMD: self.startYMD,
					endYMD: self.endYMD,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '' 
				};
				// 테이블은 시작부터 최근까지 전체데이터 조회 + 사용자 시간선택 아닐 떄에
				self.param = param;
			
			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;
			}
		
			// 상세 데이터는 한단계 위의 전체데이터 표시
			// ex: 읍면동 선택 > 시군구 목록, 시군구 선택 > 시도 목록
			if (! self.isBizdist) {
				switch (self.param.jusoCd) {
					case 'sgg':
						param.pnu = param.pnu.substring(0, 5);
						break;
					case 'sido':
						param.pnu = param.pnu.substring(0, 2);
						break; 
				}
			}
			
			return z.xAsync('SupplyTrendEnter', '공급추이차트', 'select', param, 'json').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;
				
				// 면적조건 삽입 
				// 면적 기준에 제외될 데이터 정리
				for (var i in self.rawDataArr) {
					var raw = self.rawDataArr[i],
						idxData = 0,
						value = parseFloat(raw['연면적']);
					
					if (isNaN(value) || 0 > value) {
						raw.idxData = -1;
						continue;
					}

					for (var len = self.areaValueArr.length - 1; len > idxData; ++idxData) {
						if (value >= self.areaValueArr[idxData] && value < self.areaValueArr[idxData + 1]) {
							break;
						}
					}
					
					raw.idxData = self.areaIncludeMap[idxData];
				}
				
				self.rawDataArr = resp.filter(function(elm) {
					return -1 < elm.idxData;
				});

				self.rawDataArr = self.rawDataArr.sort(function(a, b) {
					if (a.dongnm < b.dongnm) {
						return -1;
					} else if (a.dongnm > b.dongnm) {
						return 1;
					}
					
					if (a['상가명'] < b['상가명']) {
						return -1;
					} else if (a['상가명'] > b['상가명']) {
						return 1;
					}
					
					return 0;					
				});
				
				for (var i in self.rawDataArr) {
					var row = self.rawDataArr[i];
					
					if ($.isNumeric(row['총점포수'])) {
						row['총점포수'] = z.toComma(row['총점포수']);
					}
					
					if (! row['분양가'] || ! row['분양면적']) {
						row['분양가'] = '-';
					} else {
						row['분양가'] = z.toComma(Math.round(row['분양가'] / row['분양면적']));
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
				dataArr = [];

			dataArr = self.rawDataArr;
			
			var rawDataArr = JSON.parse(JSON.stringify(dataArr));
			rawDataArr.sort(function(a, b) {
				if (a['입주년도'] < b['입주년도']) {
					return -1;
				} else if (a['입주년도'] > b['입주년도']) {
					return 1;
				}					
			});				
			
			var yearArray = rawDataArr.map(function (val, index) {
				return val['입주년도'];
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
	            toolbar: {
	                items: {
	                    info: true,
	                }
	            },
	            columns: [{
	                field: 'dongnm',
	                title: '지역',
	                width: 70,
	                textAlign: 'center'
	            }, {
	                field: '상가명',
	                title: '상가명',
	                width: 300,
	                textAlign: 'center'
	            }, {
	            	field: '상가유형',
	                title: '상가유형',
	                textAlign: 'center'
	            }, {
	            	field: '총점포수',
	                title: '총점포수',
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
	            	field: '분양가',
	                title: '분양면적당<br>분양가<br>(만원/m2)',
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
	            	field: '분양일',
	                title: '분양년월',
	                width: 70,
	                textAlign: 'center'
	            }, {
	            	field: '입주일',
	                title: '입주년월',
	                width: 70,
	                textAlign: 'center'
	            }, {
	            	field: '연면적',
	                title: '연면적',
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
	            	field: '입주진행상황',
	                title: '입주진행상황',
	                width: 70,
	                textAlign: 'center'
	            }, {
	            	field: '입주년도',
	                title: '입주년도',
	                width: 65,
	                textAlign: 'center'
	            }]
			});
			self.rowdatatable = rowdatatable;
			rowdatatable.columns('입주년도').visible(false);
			$("#kt_datatable_search_status").on("change", (function() {
				rowdatatable.search($(this).val(), "입주년도");
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
				
				var row = Array.apply(null, Array(10)).map(function() {return 0;})
				
				for (var i in self.rawDataArr ) {
					var rowData = $.extend(true, [], row);
					rowData[0] = self.rawDataArr[i]['dongnm'];
					rowData[1] = self.rawDataArr[i]['상가명'];
					rowData[2] = self.rawDataArr[i]['상가유형'];
					rowData[3] = self.rawDataArr[i]['총점포수'];
					rowData[4] = self.rawDataArr[i]['분양가'];
					rowData[5] = self.rawDataArr[i]['분양일'];					
					rowData[6] = self.rawDataArr[i]['입주일'];
					rowData[7] = self.rawDataArr[i]['연면적'];
					rowData[8] = self.rawDataArr[i]['입주진행상황'];
					rowData[9] = self.rawDataArr[i]['입주년도'];
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
	
	// 공급 추이 합산
	var tableSupplyTrendEnterSum = {
		init: function(param, searchDtl) {
			var self = this;

			self.param = param;
			self.searchDtl = searchDtl;
			self.$tbody = $('#tbody_5_3').html('');
			
			self.startYMD = null;
			self.endYMD = null;
			
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

			self.columnMode = 'sangga';
			if (self.searchDtl && 'area' === self.searchDtl.columnMode) {
				self.columnMode = 'area';
			}

			var isPy = self.searchDtl && 'py' === self.searchDtl.radioAreaUnit;

			self.areaArr = $.extend(true, [], isPy ? areaTypePyArr : areaTypeArr);
			self.areaValueArr = $.extend(true, [], areaTypeValueArr);
			self.areaIncludeMap = $.extend(true, {}, areaTypeIncludeMap); 
			
			if (self.searchDtl && self.searchDtl.checkAreaBound.length) {
				var includeArr = $.extend(true, [], self.searchDtl.checkAreaBound).map(function(val) {
						return parseInt(val.split(',')[0]);
					});

				for (var i in self.areaIncludeMap) {
					self.areaIncludeMap[i] = includeArr.indexOf(self.areaValueArr[i]);
				}
				
				self.areaArr = self.areaArr.filter(function(elm, idx) {
					return -1 < self.areaIncludeMap[idx];
				});
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
				};
				// 테이블은 시작부터 최근까지 전체데이터 조회 + 사용자 시간선택 아닐 떄에

			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;
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

			return z.xAsync('SupplyTrendEnter', '공급추이차트', 'select', param, 'json').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;

				// 면적 기준에 제외될 데이터 정리
				for (var i in resp) {
					var raw = resp[i],
						idxData = 0,
						value = parseFloat(raw['연면적']);

					if (isNaN(value) || 0 > value) {
						raw.idxData = -1;
						continue;
					}

					for (var len = self.areaValueArr.length - 1; len > idxData; ++idxData) {
						if (value >= self.areaValueArr[idxData] && value < self.areaValueArr[idxData + 1]) {
							break;
						}
					}
					
					raw.idxData = self.areaIncludeMap[idxData];
				}
				
				self.rawDataArr = resp.filter(function(elm) {
					return -1 < elm.idxData;
				});
				
				for (var i in self.rawDataArr) {
					var row = self.rawDataArr[i],
						value = parseInt(row['총점포수']);
					
					row['총점포수'] = isNaN(value) ? 0 : value;
				}

			});
		},
		
		updateData: function(isAppendHidden) {
			debugger;
			var self = this,
				tmpl = Handlebars.compile($('#tmplTableSupplyTrendEnterSum').html()),
				rawDataArr = self.rawDataArr,
				dataArr = [],
				dongArr = [],
				sidoArr = [],
				columnNm = (self.param.sidonm == '전국' ? 'sidonm' : 'sggnm'),
				sumNm = self.param.sidonm;

			if (self.param.isBizdist) {
				dongArr = apiSearchEmd.getBizdistArr();
				columnNm = 'sggnm';
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

			for (var i in dongArr) {
				dataArr.push({
					dongnm: (self.param.sidonm == '전국' ? dongArr[i].sidonm : (dongArr[i].dongnm || dongArr[i].sggnm)),
					value: 0,
					cnt: 0
				});
			}

			for (var i in rawDataArr) {
				var row = rawDataArr[i],
					key = row[columnNm];
				
				for (var j in dataArr) {
					if (key === dataArr[j].dongnm) {
						dataArr[j].value += row['총점포수'];
						dataArr[j].cnt += 1;
					}
				}
			}

			// 전체 합산 row 추가
			var sum = {
				dongnm: sumNm,
				value: 0,
				cnt: 0
			};
			
			for (var i in dataArr) {
				sum.value += dataArr[i].value;
				sum.cnt += dataArr[i].cnt;
			}
			
			dataArr.unshift(sum);
			
			// 3자리 콤마 표시
			for (var i in dataArr) {
				dataArr[i].value = z.toComma(dataArr[i].value);
				dataArr[i].cnt = z.toComma(dataArr[i].cnt);
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
			});

			return result;
		}
	};	
	
    return {
        // Public functions
        init: function() {
			var self = this;
			
			self.setBtnListener();

			chartSupplyTrendEnterAll.init();
			chartSupplyTrendEnterYear.init();
			
			chartSupplyTrendEnterDong.init();
			chartSupplyTrendEnterSanggaType.init();
			
			chartSupplyTrendEnterDong.hide();
			chartSupplyTrendEnterSanggaType.hide();
        },

		setBtnListener: function() {
			var self = this;
			
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
					tableSupplyTrendEnterSanggaType.exportSheet()
				).done(function(workSheet) {

					var wb = XLSX.utils.book_new();
					
					XLSX.utils.book_append_sheet(wb, workSheet, '공급추이_데이터');

					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_공급추이_데이터.xlsx');					
				});
			});
			
			/* 추이클릭시 펼치기/닫기 */ 
			$('#tbody_5_1').on('click', '.maintotal', function() {
				var dong = $(this).attr('data-dong');
				var show = $(this).hasClass('data-hide');
				var len = 0;
				$('#tbody_5_1 tr').each(function(index, item){
					if($(item).attr('data-dong') === dong){
						len++
					}
				});
				
				if(!show){
					$('#tbody_5_1 tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){
							if($(item).children().eq(0).attr('rowspan') == len){
								$(item).children().eq(0).attr('rowspan','1');
							}	
							$(item).not('.maintotal').hide();
							$(item).removeClass('data-show').addClass('data-hide');
						}
					});		
				} else {
					$('#tbody_5_1 tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){
							if($(item).children().eq(0).attr('rowspan') =='1'){
								$(item).children().eq(0).attr('rowspan', len);
							};
								
							$(item).not('.maintotal').show();
							$(item).removeClass('data-hide').addClass('data-show');
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
					tableSupplyTrendEnterDetail.exportSheet()
				).done(function(workSheet) {

					var wb = XLSX.utils.book_new();
					
					XLSX.utils.book_append_sheet(wb, workSheet, '공급추이_상세');

					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_공급추이_상세.xlsx');					
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
					tableSupplyTrendEnterSum.exportSheet()
				).done(function(workSheet) {

					var wb = XLSX.utils.book_new();
					
					XLSX.utils.book_append_sheet(wb, workSheet, '공급추이_합산');

					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_공급추이_합산.xlsx');					
				});
			});
		},

		setDongCd: function(param) {
			if (! param.isBizdist && ! param.dongCd) {
				return;
			}
			/*
			if (! param.isBizdist) {
				$('[data-select-sgg] [data-sgg-nm]').text(param.sggnm || param.sidonm);
			}
			*/  
			
			var searchDtl = apiSearchSupplyTrendEnter.getSearchDtl(param);

			if ('custom' === searchDtl.radioTimeBound) {
				$('[data-ui-user-date=true]').show();
				$('[data-ui-user-date=false]').hide();

				tableSupplyTrendEnterSum.init(param, searchDtl);
				tableSupplyTrendEnterDetail.init(param, searchDtl);
			} else {
				$('[data-ui-user-date=true]').hide();
				$('[data-ui-user-date=false]').show();
				
				chartSupplyTrendEnterAll.init(param, searchDtl);
				chartSupplyTrendEnterYear.init(param, searchDtl);
				
				chartSupplyTrendEnterDong.hide();
				chartSupplyTrendEnterSanggaType.hide();
				
				if ('전체' === param.dongnm) {
					chartSupplyTrendEnterDong.init();
				} else {
					chartSupplyTrendEnterSanggaType.init();
				}

				tableSupplyTrendEnterSanggaType.init(param, searchDtl);
				tableSupplyTrendEnterDetail.init(param, searchDtl);
			}
		}
    };
}();


$(function() {
	$.when(
		//$.getScript('/resources/admin/APPS/dashboard/apiSearchEmd.js'),
		$.getScript('/resources/admin/APPS/dashboard/apiSearchAreaMap_dev.js'),
		$.getScript('/resources/admin/APPS/dashboard/supplyTrendEnterSearch.js'),
		$.getScript('/resources/common/custom/js/commonDashboard.js')
	).done(function() {
		
		z.xAsync('AdminMain', 'getExcelDown', 'select', {pgmCode:"MA0104"}, 'json').done(function(resp) {
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
			areaCdListener: apiSupplyTrendEnter.setDongCd
		});
		
		apiSearchEmd = apiSearchAreaMap;
		
		apiSearchSupplyTrendEnter.init({
			btnActivate: $('[data-btn-search-detail]'),
			searchWrapper: $('[data-wrapper="searchDetail"]'),
			searchDateRange: $('[data-wrapper="searchDetail"] [data-search-time]'),
			btnOk: $('[data-wrapper="searchDetail"] [data-btn-ok]'),
			btnClose: $('[data-wrapper="searchDetail"] [data-btn-close]')
		});
		
	    apiSupplyTrendEnter.init();

		z.formatDataReference('상가').done(function(refText) {
			$('.dashboard .reference').text(refText);
		});
	});
});
