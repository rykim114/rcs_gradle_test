'use strict';
// Class definition

var apiSearchEmd;
var excelyn;
var isTabidx = '1';	// Tab 

var apiIndustryInfo = function() {
	// 업종정보 2023년 이후 개편으로 인한 8개분류 및 10개분류 분리 
	var industryTypeMap_old = [],
		industryTypeArr_old = [],
		industryTypeGbnArr_old = [],
		industryTypeMap_new = [],
		industryTypeArr_new = [],
		industryTypeGbnArr_new = [];

	var tab01 = {
		commCode: '100120',				// 공통상세명
		chart_1_1: '#chart_1_1_1',		// 업종분포현황 추이 차트	
		chart_2_1: '#chart_2_1_1',		// 최근 N년간 업종분포현황 추이 차트
		chart_3_1: '#chart_3_1_1', 		// 동 + 상가 유형별 공급 추이 차트
		table_3_1: '#table_3_1_1',
		chart_3_2: '#chart_3_2_1', 		// 상가 유형별 공급 추이 차트
		table_3_2: '#table_3_2_1',	
		table_5_1: '#table_5_1_1',		// 업종분포 추이 데이터 
		tbody_5_1: '#tbody_5_1_1',
		table_5_2: 'table_5_2_1',
		tbody_5_2: '#tbody_5_2_1',
		table_5_3: 'table_5_3_1',
		tbody_5_3: '#tbody_5_3_1'
	};
	var tab02 = {
		commCode: '100201',
		chart_1_1: '#chart_1_1_2',
		chart_2_1: '#chart_2_1_2',
		chart_3_1: '#chart_3_1_2',
		table_3_1: '#table_3_1_2',
		chart_3_2: '#chart_3_2_2',
		table_3_2: '#table_3_2_2',
		table_5_1: '#table_5_1_2',
		tbody_5_1: '#tbody_5_1_2',
		table_5_2: 'table_5_2_2',
		tbody_5_2: '#tbody_5_2_2',
		table_5_3: 'table_5_3_2',
		tbody_5_3: '#tbody_5_3_2'
	};

	var floorTypeArr = [
		"B1F",
		"1F", 
		"2F",
		"3F",
		"4F이상"
  	];

 	var floorTypeMap = {
	   "B1F": 0,
	   "1F": 1,
	   "2F": 2,
	   "3F": 3,
	   "4F이상": 4
  	};

	// 공통상세코드 조회 
	var industryCommInfo = {
		init: function() {
			// 2022년 이전
			z.getCommCode(tab01.commCode).done(function(respIndustry) {
				industryTypeMap_old = respIndustry.reduce(function(acc, cur) {
					acc[cur['공통상세명']] = parseInt(cur['정렬코드']);
					return acc;
				}, {});

				industryTypeArr_old = [];
				
				for (var i in respIndustry) {
					industryTypeArr_old.push(respIndustry[i]['공통상세명']);
				}
			});

			// 2023년 이후
			z.getCommCode(tab02.commCode).done(function(respIndustry) {
				industryTypeMap_new = respIndustry.reduce(function(acc, cur) {
					acc[cur['공통상세명']] = parseInt(cur['정렬코드']);
					return acc;
				}, {});

				industryTypeArr_new = [];
				
				for (var i in respIndustry) {
					industryTypeArr_new.push(respIndustry[i]['공통상세명']);
				}
			});

			var param_old = {
				industryCode: '1'
			};
			var	param_new = {
				industryCode: '2'
			};

			// 2022년 이전
			industryTypeGbnArr_old = [];
			z.xAsync('IndustryInfo', '업종대중분류', 'select', param_old, 'json').done(function(resp){
				for (var i in resp) {
					industryTypeGbnArr_old.push(resp[i]['업종분류']);
				}
			});	

			// 2023년 이후
			industryTypeGbnArr_new = [];
			z.xAsync('IndustryInfo', '업종대중분류', 'select', param_new, 'json').done(function(resp){
				for (var i in resp) {
					industryTypeGbnArr_new.push(resp[i]['업종분류']);
				}
			});	
		}
	};	// end - industryCommInfo


	// 업종분포현황 추이 차트
	var chartIndustryInfoAll = {
		init: function(param, searchDtl) {
			var self = this,
				apexChart = (isTabidx == '1' ? tab01.chart_1_1 : tab02.chart_1_1),
				industryTypeArr = (isTabidx == '1' ? industryTypeArr_old : industryTypeArr_new);

			self.$wrapper = $(apexChart).closest('[data-chart-wrapper]');
			self.param = param;
			self.searchDtl = searchDtl;

			if (self.searchDtl && self.searchDtl.checkSanggaType.length) {
				self.isCustomSangga = true;
				self.sanggaArr = $.extend(true, [], self.searchDtl.checkSanggaType);
			} else {
				self.isCustomSangga = false;
				self.sanggaArr = $.extend(true, [], industryTypeArr);
			}
			
			if (self.searchDtl && self.searchDtl.checkFloorBound.length) {
					self.isCustomFloor = true;
					self.floorArr = $.extend(true, [], self.searchDtl.checkFloorBound);
			} else {
				self.isCustomFloor = false;
				self.floorArr = $.extend(true, [], floorTypeArr);
			}

			// 차트 초기화 
			var options = {
				series: [{
					name: '',
					type: 'column',
					data: []
				}, {
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
					stacked: false,
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
								filename: '업종현황 추이'
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
						},
					}
				},
				plotOptions: {
					bar: {
						horizontal: false,
						columnWidth: '50%'
					},
				},
				dataLabels: {
					enabled: true,
					enabledOnSeries: [1],
					formatter: function(value) {
						return z.toComma(value);
					}
				},
				stroke: {
					width: [1, 4]
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
					tooltip: {
						enabled: false
					}
				},
				yaxis: [{
					title: {
						text: ''
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
				}],
				colors: ['#d4cfc9','#d45769']
			};

			if (self.chart) {
				self.chart.destroy();
			}

			var chart = new ApexCharts($(apexChart)[0], options);
			self.chart = chart;
			

			chart.render().then(function() {
				chart.updateSeries([]);
				
				if (self.param) {
					self.$wrapper.find('[data-sgg-nm]').text(param.sggnm);
					if (! self.param.isBizdist) {
						self.$wrapper.find('[data-dong-nm]').text(param.dongnm);
					} else {
						self.$wrapper.find('[data-dong-nm]').text(param.bizdistnm);
					}
					
					self.loadData().done(function() {
						self.loadAxis();
						self.updateData();
					});
				}
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
					endYMD = moment(selected, 'YYYY Q').endOf('quarter').format('YYYYMMDD');
					break;
				case 'month':
					endYMD = moment(selected, 'YYYY MM').endOf('month').format('YYYYMMDD');
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
		
			chartIndustryInfoYear.init(self.param, self.searchDtl);
		},
		loadData: function() {
			var self = this,
				param = {
					pnu: self.param.isBizdist ? self.param.bizdistAdmCd : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					jusoCd: self.param.jusoCd,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '',
					industryCode: isTabidx
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

			// geom boundary
			if (param.geom) {
				var geoJson = Terraformer.WKT.parse(param.geom),
					bbox = turf.bbox(turf.polygon(geoJson.coordinates));

				param.west = bbox[0];
				param.east = bbox[2];
				param.south = bbox[1];
				param.north = bbox[3];
			}

			KTApp.blockPage({message: '잠시 기다려 주십시오'});
			return z.xAsync('IndustryInfo', '업종분포현황추이차트', 'select', param, 'json').always(function() {
				KTApp.unblockPage();
			}).done(function(resp) {
				self.rawDataArr = resp;
			});
		},
		loadAxis: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				xAxisArr = [],
				yAxisObj = [{
					title: {
						text: ''
					},
					labels: {
						formatter: function(value) {
							return z.toComma(value);
						}
					}
				}];

			// 1. 데이터 시간 구간 확정 후
			var startYMD = moment(self.searchDtl.startYMD),
				endYMD = moment(self.searchDtl.endYMD),
				timeBound = self.searchDtl.radioTimeBound,
				diffTime = 0,
				xAxisMap = {};

			switch (timeBound) {
				case 'year':
					diffTime = endYMD.diff(startYMD, 'years') + 1;
					var tmp = startYMD.clone();
					
					for (var i = 0 ; diffTime > i ; ++i) {
						xAxisArr.push(tmp.format('YYYY'));
						tmp.add(1, 'year');
					}
					break;
				case 'quarter':
					diffTime = endYMD.diff(startYMD, 'quarters') + 1;
					var tmp = startYMD.clone();
					
					for (var i = 0 ; diffTime > i ; ++i) {
						xAxisArr.push(tmp.format('YYYY.Q[Q]'));
						tmp.add(1, 'quarter');
					}
					break;
				case 'month':
					diffTime = endYMD.diff(startYMD, 'months') + 1;
					var tmp = startYMD.clone();
					
					for (var i = 0 ; diffTime > i ; ++i) {
						xAxisArr.push(tmp.format('YYYY.MM'));
						tmp.add(1, 'month');
					}
					break;
				case 'half':
					diffTime = Math.floor(endYMD.diff(startYMD, 'quarters') / 2) + 1;
					var tmp = startYMD.clone();
					
					for (var i = 0 ; diffTime > i ; ++i) {
						xAxisArr.push(tmp.format('YYYY.') + (6 > tmp.get('month') ? '1' : '2') + 'H');
						tmp.add(2, 'quarter');
					}
					break;
			}

			// 2. 기존 분양연도 컬럼 규칙에 맞도록 수정 + 검색기간의 마지막 데이터만 반영되도록 filter
			for (var i in rawDataArr) {
				var raw = rawDataArr[i],
					mmt = moment(raw['기준년월'], 'YYYYMM');

				switch (timeBound) {
					case 'year':
						raw['기준년월'] = mmt.format('YYYY');

						if (xAxisMap[raw['기준년월']] && xAxisMap[raw['기준년월']] !== raw['std_yyyymm']) {
							raw.isExcluded = true;
						} else {
							xAxisMap[raw['기준년월']] = raw['std_yyyymm'];
						}
						break;
					case 'month':
						raw['기준년월'] = mmt.format('YYYY.MM');
						break;
					case 'half':
						raw['기준년월'] = mmt.format('YYYY.') + (6 > mmt.get('month') ? '1' : '2') + 'H';

						if (xAxisMap[raw['기준년월']] && xAxisMap[raw['기준년월']] !== raw['std_yyyymm']) {
							raw.isExcluded = true;
						} else {
							xAxisMap[raw['기준년월']] = raw['std_yyyymm'];
						}
						break;
					case 'quarter':
						raw['기준년월'] = mmt.format('YYYY.Q[Q]');
						break;
				}
			}
			
			self.rawDataArr = rawDataArr.filter(function(elm) {
				return ! elm.isExcluded;
			});
			
			self.diffTime = diffTime;
			self.xAxisArr = xAxisArr;
			self.yAxisObj = yAxisObj;
		},
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
			
			// 마지막 연도 강제선택
			self.loadNextObj(self.xAxisArr[self.xAxisArr.length - 1]);
		},
		updateDataByYear: function(chartOptions, chartSeries) {
			var self = this,
				supplyData = {
					name: '구간별 물량',
					type: 'column',
					data: []
				},
				supplySumData = {
					name: '누적물량',
					type: 'line',
					data: []
				};
			
			chartSeries.push(supplyData);
//			chartSeries.push(supplySumData);
			
			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));
			
			for (var i = 0; self.diffTime > i; ++i) {
				supplyData.data.push(0);
				supplySumData.data.push(0);
			}

			for (var i in rawDataArr) {
				var raw = rawDataArr[i],
					idx = self.xAxisArr.indexOf(raw['기준년월']),
					result = parseInt(raw['상권업종수']);
				
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
	};	// end - chartIndustryInfoAll

	// 최근 N년간 업종분포현황 추이 차트
	var chartIndustryInfoYear = {
		init: function(param, searchDtl) {
			var self = this,
				industryTypeArr = (isTabidx == '1' ? industryTypeArr_old : industryTypeArr_new),
				industryTypeMap = (isTabidx == '1' ? industryTypeMap_old : industryTypeMap_new);

			self.apexChart = (isTabidx == '1' ? tab01.chart_2_1 : tab02.chart_2_1);
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
				self.sanggaArr = $.extend(true, [], industryTypeArr);
				self.sanggaMap = $.extend(true, {}, industryTypeMap);
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

			// 차트 초기화 퍼블리싱 코드 옮겨옴
			var options = {
				series: [{
					name: '',
					data: []
				}],
				chart: {
					width: '100%',
					height: 235,
					type: 'bar',
					toolbar: {
						show: false
					},
					events: {
						updated: function() {
							if (self.updateTimeout) {
								return;
							}
						}
					},
					export: {
						csv: {
							headerCategory: '\uFEFF',
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
				},
				stroke: {
					width: 1,
					colors: ['#fff']
				},
				fill: {
					opacity: 1
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
				},
				colors: ["#7ed0f3", "#4b8eef", "#ff6f38", "#dcdcde", '#00ff00', '#0000ff']
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
					self.diffTime = 5;
					self.endYMD = self.searchDtl.endYMD;
			
					// 1. 데이터 시간 구간 확정 후
					var endYMD = moment(self.searchDtl.endYMD),
						startYMD = null,
						timeBound = self.searchDtl.radioTimeBound;
						
					switch (timeBound) {
						case 'year':
							startYMD = endYMD.clone().subtract(self.diffTime, 'year').endOf('year').add(1, 'day');
							break;
						case 'quarter':
							startYMD = endYMD.clone().subtract(self.diffTime, 'quarter').endOf('quarter').add(1, 'day');
							break;
						case 'month':
							startYMD = endYMD.clone().subtract(self.diffTime, 'month').endOf('month').add(1, 'day');
							break;
						case 'half':
							startYMD = endYMD.clone().subtract(self.diffTime * 2, 'quarter').add(1, 'day');
							break;
					}
					
					self.startYMD = (isTabidx == '1' ? startYMD.format('YYYYMMDD') : moment('20230101').format('YYYYMMDD'));
					
					self.$wrapper.find('[data-sgg-nm]').text(param.sggnm || param.sidonm);
					if (self.param.isBizdist) {
						self.$wrapper.find('[data-dong-nm]').text(param.bizdistnm);
					} else {
						self.$wrapper.find('[data-dong-nm]').text(param.dongnm);
					}
					
					self.$wrapper.find('[data-last-year]').text(moment(self.searchDtl.endYMD, 'YYYYMMDD').format('YYYY') + '년도');
					
					self.loadData().done(function(resp) {
						self.loadAxis();
						self.updateData();
					});
				}
			});
		},
		setBtnListener: function() {
			var self = this;

			self.$wrapper.find('.clickYears').children('span').removeClass('on');
			self.$wrapper.find('.clickYears').children('span').off('click').on('click', function() {
				var $this = $(this),
					$list = $this.siblings('span').removeClass('on');
					
				$this.addClass('on');
				self.loadNextObj(self.xAxisArr[parseInt($this.attr('data-idx'))]);
			});
		},
		loadNextObj: function(selected) {
			var self = this,
				endYMD = '';
			
			switch (self.searchDtl.radioTimeBound) {
				case 'year':
					endYMD = selected + '1231';
					break;
				case 'quarter':
					endYMD = moment(selected, 'YYYY Q').endOf('quarter').format('YYYYMMDD');
					break;
				case 'month':
					endYMD = moment(selected, 'YYYY MM').endOf('month').format('YYYYMMDD');
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

			chartIndustryInfoDong.hide();
			chartIndustryInfoSanggaType.hide();
				
			if ('전체' === self.param.dongnm) {
				chartIndustryInfoDong.init(self.param, self.searchDtl);
			} else {
				chartIndustryInfoSanggaType.init(self.param, self.searchDtl);
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
		loadData: function() {
			var self = this,
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					startYMD: self.startYMD,
					endYMD: self.endYMD,
					jusoCd: self.param.jusoCd,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '',
					industryCode: isTabidx
				};
				
			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;
			}

			if (self.isCustomFloor) {
				param.floorArr = self.floorArr;
			}

			// geom boundary
			if (param.geom) {
				var geoJson = Terraformer.WKT.parse(param.geom),
					bbox = turf.bbox(turf.polygon(geoJson.coordinates));

				param.west = bbox[0];
				param.east = bbox[2];
				param.south = bbox[1];
				param.north = bbox[3];
			}			

			KTApp.blockPage({message: '잠시 기다려 주십시오'});
			return z.xAsync('IndustryInfo', '업종분포현황추이차트', 'select', param, 'json').always(function() {
				KTApp.unblockPage();
			}).done(function(resp) {
				self.rawDataArr = resp;
			});
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
				diffTime = 0,
				xAxisMap = {};
				
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

			for (var i in rawDataArr) {
				var raw = rawDataArr[i],
					mmt = moment(raw['기준년월'], 'YYYYMM');

				switch (timeBound) {
					case 'year':
						raw['기준년월'] = mmt.format('YYYY');
						
						if (xAxisMap[raw['기준년월']] && xAxisMap[raw['기준년월']] !== raw['std_yyyymm']) {
							raw.isExcluded = true;
						} else {
							xAxisMap[raw['기준년월']] = raw['std_yyyymm'];
						}
						break;
					case 'month':
						raw['기준년월'] = mmt.format('YYYY.MM');
						break;
					case 'half':
						raw['기준년월'] = mmt.format('YYYY.') + (6 > mmt.get('month') ? '1' : '2') + 'H';

						if (xAxisMap[raw['기준년월']] && xAxisMap[raw['기준년월']] !== raw['std_yyyymm']) {
							raw.isExcluded = true;
						} else {
							xAxisMap[raw['기준년월']] = raw['std_yyyymm'];
						}
						break;
					case 'quarter':
						raw['기준년월'] = mmt.format('YYYY.Q[Q]');
						break;
				}
			}
			
			self.rawDataArr = rawDataArr = rawDataArr.filter(function(elm) {
				return ! elm.isExcluded;
			});

			// 정렬: 상가종류, 분양연도 오름차순
			rawDataArr = rawDataArr.sort(function(a, b) {
				var aType = sanggaMap[a['상권업종대분류명']],
					bType = sanggaMap[b['상권업종대분류명']];
					
				if (aType < bType) {
					return -1;
				}
				if (aType > bType) {
					return 1;
				}

				if (a['기준년월'] < b['기준년월']) {
					return -1;
				}
				if (a['기준년월'] > b['기준년월']) {
					return 1;
				}

				return 0;
			});

			// 엑셀 저장용 정보로도 활용될 예정
			self.xAxisArr = xAxisArr;
			self.yAxisObj = yAxisObj;
			self.diffTime = diffTime;
		},
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

			// 2023년 업종정보 변경으로 인한 추가 
			self.$wrapper.find('.clickYears').children('span').remove();
			let dataIdx = '';
			for(var i = 0; i < self.xAxisArr.length; i++) {
				dataIdx += `<span data-idx="${i}"></span>`;
			}

			self.$wrapper.find('[data-section]').text(self.xAxisArr.length);
			self.$wrapper.find('.clickYears').append(dataIdx);

			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);			
			self.setBtnListener();

			// 마지막 구간 바로 실행
			self.$wrapper.find('.clickYears').children('span').last().click();
		},
		updateDataByYear: function(chartOptions, chartSeries) {
			var self = this,
				sanggaMap = self.sanggaMap,
				prevSanggaType = '',
				prevData;

			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));
			
			for (var i in self.sanggaArr) {
				prevData = {
					name: self.sanggaArr[i],
					data: Array.apply(null, Array(self.diffTime)).map(function() {return 0;})
				};
				chartSeries.push(prevData);
			}
			
			for (var i in rawDataArr) {
				var raw = rawDataArr[i],
					idxData = sanggaMap[raw['상권업종대분류명']];
				
				if (isNaN(idxData)) {
					continue;
				}

				var idxYear = self.xAxisArr.indexOf(raw['기준년월']);
				if (-1 < idxYear) {
					chartSeries[idxData].data[idxYear] += parseInt(raw['상권업종수']);
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
	}	// end - chartIndustryInfoYear

	// 동 + 상가 유형별 공급 추이 차트
	var chartIndustryInfoDong = {
		init: function(param, searchDtl) {
			var self = this,
				industryTypeArr = (isTabidx == '1' ? industryTypeArr_old : industryTypeArr_new),
				industryTypeMap = (isTabidx == '1' ? industryTypeMap_old : industryTypeMap_new);

			self.apexChart = (isTabidx == '1' ? tab01.chart_3_1 : tab02.chart_3_1);
			self.tableSelector = (isTabidx == '1' ? tab01.table_3_1 : tab02.table_3_1);
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
				self.sanggaArr = $.extend(true, [], industryTypeArr);
				self.sanggaMap = $.extend(true, {}, industryTypeMap);
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
			self.sidoArr = [];
			self.isSgg = (! param) || ('emd' !== param.jusoCd && !param.sggnm);
			
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
				// 공급추이차트 데이터와 맞추기 위해 [전국]은 제외
				if(sidoArr[i].sidonm.substring(0, 2) != '전국') {
					self.sidoArr.push(sidoArr[i].sidonm);
				}
			}

			self.$wrapper.find('[data-sgg-nm]').text('');
			self.$wrapper.find('[data-dong-nm]').text('');
			self.$wrapper.find('[data-last-year]').text('');
			
			if (self.param) {
				self.diffTime = 2,
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
		},
		hide: function() {
			var self = this;
			if (self.$wrapper) {
				self.$wrapper.hide();
				self.$wrapper.find(self.tableSelector).hide();
			}
		},
		loadData: function() {
			var self = this,
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					startYMD: self.startYMD,
					endYMD: self.endYMD,
					jusoCd: self.param.jusoCd,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '',
					industryCode: isTabidx
				};
				
			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;
			}

			if (self.isCustomFloor) {
				param.floorArr = self.floorArr;
			}

			// geom boundary
			if (param.geom) {
				var geoJson = Terraformer.WKT.parse(param.geom),
					bbox = turf.bbox(turf.polygon(geoJson.coordinates));

				param.west = bbox[0];
				param.east = bbox[2];
				param.south = bbox[1];
				param.north = bbox[3];
			}

			KTApp.blockPage({message: '잠시 기다려 주십시오'});
			return z.xAsync('IndustryInfo', '업종분포현황추이차트', 'select', param, 'json').always(function() {
				KTApp.unblockPage();
			}).done(function(resp) {
				self.rawDataArr = resp;

				var timeBound = self.searchDtl.radioTimeBound,
					xAxisMap = {};

				// 2. 기존 분양연도 컬럼 규칙에 맞도록 수정 + 검색기간의 마지막 데이터만 반영되도록 filter
				for (var i in self.rawDataArr) {
					var raw = self.rawDataArr[i],
						mmt = moment(raw['기준년월'], 'YYYYMM');
	
					switch (timeBound) {
						case 'year':
							raw['기준년월'] = mmt.format('YYYY');

							if (xAxisMap[raw['기준년월']] && xAxisMap[raw['기준년월']] !== raw['std_yyyymm']) {
								raw.isExcluded = true;
							} else {
								xAxisMap[raw['기준년월']] = raw['std_yyyymm'];
							}
							break;
						case 'month':
							raw['기준년월'] = mmt.format('YYYY.MM');
							break;
						case 'half':
							raw['기준년월'] = mmt.format('YYYY.') + (6 > mmt.get('month') ? '1' : '2') + 'H';

							if (xAxisMap[raw['기준년월']] && xAxisMap[raw['기준년월']] !== raw['std_yyyymm']) {
								raw.isExcluded = true;
							} else {
								xAxisMap[raw['기준년월']] = raw['std_yyyymm'];
							}
							break;
						case 'quarter':
							raw['기준년월'] = mmt.format('YYYY.Q[Q]');
							break;
					}
				}
				
				self.rawDataArr = self.rawDataArr.filter(function(elm) {
					return ! elm.isExcluded;
				});
			});
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

				var aType = sanggaMap[a['상권업종대분류명']],
					bType = sanggaMap[b['상권업종대분류명']];
					
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
		},
		updateData: function() {
			var self = this,
				chartOptions = {},
				chartSeries = [],
				categories = self.sanggaArr;
			
			// 이전 대비 데이터 가공 후 출력
			self.updateDataComparePrev();
			self.updateDataByDong(chartOptions, chartSeries);

			// 차트 초기화 퍼블리싱 코드 옮겨옴
			var options = {
				series: chartSeries,
				chart: {
					width: '100%',
					height: 230,
					type: 'bar',
					stacked: true,
			        toolbar: {
			            show: false
			        }
				},
				plotOptions: {
					bar: {
						horizontal: true
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
					},
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
				dongArr = (self.param.sidonm == '전국' ? self.sidoArr: self.dongArr),
				sanggaArr = self.sanggaArr,
				sanggaMap = self.sanggaMap,
				prevDong = '',
				idxDong,
				prevData;
				
			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));

			// 전국 데이터 작업 
			if(self.param.sidonm == '전국') {
				for (var i in self.sidoArr) {
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
				if (self.endYMDText !== raw['기준년월']) {
					continue;
				}
				
				// 전국 데이터 작업
				if(self.param.sidonm == '전국') {
					idxDong = self.sidoArr.indexOf(raw.sidonm);
				} else {
					idxDong = self.dongArr.indexOf(raw.dongnm);
				}
				
				if (0 > idxDong) {
					continue;
				}
				prevData = chartSeries[idxDong];
				var idxSangga = sanggaMap[raw['상권업종대분류명']];
				prevData.data[idxSangga] += parseFloat(raw['상권업종수'] || 0);
			}
		},
		updateDataComparePrev: function() {
			var self = this,
				dongArr = (self.param.sidonm == '전국' ? self.sidoArr: self.dongArr),
				sanggaArr = self.sanggaArr,
				sanggaMap = self.sanggaMap,
				prevSanggaType = '',
				prevYear = '',
				prevData,
				timeBound = self.searchDtl.radioTimeBound;
			
			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));

			// 정렬: 상가종류 오름차순, 분양연도 내림차순
			rawDataArr = rawDataArr.sort(function(a, b) {
				var aType = sanggaMap[a['상권업종대분류명']],
					bType = sanggaMap[b['상권업종대분류명']];
					
				if (aType < bType) {
					return -1;
				}
				if (aType > bType) {
					return 1;
				}
				
				if (a['기준년월'] < b['기준년월']) {
					return -1;
				}
				if (a['기준년월'] > b['기준년월']) {
					return 1;
				}
				return 0;
			});

			var compResultArr = [];

			// 출력용 데이터 원본 생성
			for (var i in sanggaArr) {
				var compareObj = {
					title: sanggaArr[i],
					total: 0,
					compare0: 0,
					compare1: 0,
					class1: 'text-success',
					icon1: '<i class="fa fa-caret-down text-success"></i>',
				};
				compResultArr.push(compareObj);
			}
						
			// 정렬된 데이터 순서로 합산 진행
			var total = 0;
			var total_pre = 0;
			var endYMD = moment(self.endYMD, 'YYYYMMDD');
			for (var i in rawDataArr) {
				var raw = rawDataArr[i],
					comp = compResultArr[sanggaMap[raw['상권업종대분류명']]],
					startYMD = raw['기준년월'],
					diff = 0;

				switch (timeBound) {
					case 'year':
						startYMD = moment(startYMD, 'YYYY');
						diff = endYMD.diff(startYMD, 'year');
						break;
					case 'quarter':
						startYMD = moment(startYMD, 'YYYY Q');
						diff = endYMD.diff(startYMD, 'quarter');
						break;
					case 'month':
						startYMD = moment(startYMD, 'YYYY MM');
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
					comp['compare' + diff] +=  parseFloat(raw['상권업종수']);
					if(diff == 0){
						total +=  parseFloat(raw['상권업종수']); 
					}else if(diff == 1){
						total_pre +=  parseFloat(raw['상권업종수']);
					}
				}
			}
			
			// 비교치 % 계산
			for (var i in compResultArr) {
				var comp = compResultArr[i];

				if(total > 0){
					comp['total'] = (comp['compare0'] / total  * 100).toFixed(1) + '%';
				}
				
				for (var j = 1; self.diffTime > j; ++j) {
					// 둘 다 0 이면 계산 제외, 예전만 0 이고 신규 데이터 있으면 New 표시
					// + class, icon 표시 수정
					if (! comp['compare' + j]) {
						comp['class' + j] = '';
						comp['icon' + j] = '';
						
						if (! comp['compare0']) {
							comp['total'] = '0%';
							comp['compare' + j] = '-';
						} else {
							comp['compare' + j] = 'New';
							comp['class' + j] = 'text-danger';
						}

					} else {
						comp['compare' + j] = Math.round(100 * (comp['compare0'] - comp['compare' + j]) / comp['compare' + j]) + '%';
						
						if (0 > ('' + comp['compare' + j]).indexOf('-')) {
							comp['class' + j] = 'text-danger';
							comp['icon' + j] = '<i class="fa fa-caret-up text-danger"></i>';
						}
					}
				}
				if(total > 0){
					comp['compare0'] =  z.toComma(comp['compare0']);
				}
			}

			self.$wrapper.find('[data-industry-total]').text('0%');
			self.$wrapper.find('[data-industry-rate]').text('0');
			self.$wrapper.find('[data-industry-rate-up]').text("");
			
			var pre_upDown = "하락";
			var pre_rete = 0;
			if(total_pre > 0) {
				pre_rete = Math.round(100 * (total - total_pre) / total_pre);
			}else{
				if(total > 0) {
					pre_rete = 100;
				}
			}

			if(0 > ("" + pre_rete).indexOf('-')) {
				pre_upDown = "상승";
			}
			self.$wrapper.find('[data-industry-total]').text(z.toComma(total));
			self.$wrapper.find('[data-industry-rate]').text(pre_rete + '%');
			self.$wrapper.find('[data-industry-rate-up]').text(pre_upDown);
			
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
	}	// end - chartIndustryInfoDong

	// 상가 유형별 공급 추이 차트
	var chartIndustryInfoSanggaType = {
		init: function(param, searchDtl) {
			var self = this,
				apexChart = (isTabidx == '1' ? tab01.chart_3_2 : tab02.chart_3_2),
				industryTypeArr = (isTabidx == '1' ? industryTypeArr_old : industryTypeArr_new),
				industryTypeMap = (isTabidx == '1' ? industryTypeMap_old : industryTypeMap_new);
			
			self.tableSelector = (isTabidx == '1' ? tab01.table_3_2 : tab02.table_3_2);
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
				self.sanggaArr = $.extend(true, [], industryTypeArr);
				self.sanggaMap = $.extend(true, {}, industryTypeMap);
			}			
			
			if (self.searchDtl && self.searchDtl.checkFloorBound.length) {
				self.isCustomFloor = true;
				self.floorArr = $.extend(true, [], self.searchDtl.checkFloorBound);
				self.floorMap = {};
				
				for (var i in self.floorArr) {
					self.floorMap[self.floorArr[i]] = i;
				}
			}else{
				self.isCustomFloor = false;
				self.floorArr = $.extend(true, [], floorTypeArr);
				self.floorMap = $.extend(true, {}, floorTypeMap);
			}
			
			// 차트 초기화 퍼블리싱 코드 옮겨옴
			var options = {
				series: Array.apply(null, Array(self.sanggaArr.length)).map(function() {return 0;}),
				chart: {
					width: 300,
					type: 'donut',
				},
				labels: self.sanggaArr,
			    colors: ['#5e58c9','#2985d2','#2eb7c4','#6d9d64','#b5bf1b','#f1c644','#f28f6c'],
			    dataLabels: {
			        enabled: false,
			    },
				tooltip: {
					y: {
		                formatter: function(value) {
							var percent = '';
							if (self.totalIndustry) {
								percent = ' (' + Math.round(value / self.totalIndustry * 100) + '%)';
							}
							return z.toComma(value) + ' ' + self.searchDtl.unitText + percent;
						}
					}
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

			chart.render().then(function() {
				// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
				chart.updateSeries([]);

				if (self.param) {
					self.diffTime = 2;
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
					
					if (startYMD) {
						self.startYMD = startYMD.format('YYYYMMDD');
					}
					
					self.$wrapper.find('[data-sgg-nm]').text(param.sggnm);
					if (self.param.isBizdist) {
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
		loadData: function() {
			var self = this,
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					startYMD: self.startYMD,
					endYMD: self.endYMD,
					jusoCd: self.param.jusoCd,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '',
					industryCode: isTabidx
				};
				
			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;
			}

			if (self.isCustomFloor) {
				param.floorArr = self.floorArr;
			}

			// geom boundary
			if (param.geom) {
				var geoJson = Terraformer.WKT.parse(param.geom),
					bbox = turf.bbox(turf.polygon(geoJson.coordinates));

				param.west = bbox[0];
				param.east = bbox[2];
				param.south = bbox[1];
				param.north = bbox[3];
			}
			
			KTApp.blockPage({message: '잠시 기다려 주십시오'});
			return z.xAsync('IndustryInfo', '업종분포현황추이차트', 'select', param, 'json').always(function() {
				KTApp.unblockPage();
			}).done(function(resp) {
				self.rawDataArr = resp;
				
				var timeBound = self.searchDtl.radioTimeBound,
					xAxisMap = {};

				// 2. 기존 분양연도 컬럼 규칙에 맞도록 수정 + 검색기간의 마지막 데이터만 반영되도록 filter
				for (var i in self.rawDataArr) {
					var raw = self.rawDataArr[i],
						mmt = moment(raw['기준년월'], 'YYYYMM');
	
					switch (timeBound) {
						case 'year':
							raw['기준년월'] = mmt.format('YYYY');
							
							if (xAxisMap[raw['기준년월']] && xAxisMap[raw['기준년월']] !== raw['std_yyyymm']) {
								raw.isExcluded = true;
							} else {
								xAxisMap[raw['기준년월']] = raw['std_yyyymm'];
							}
							break;
						case 'month':
							raw['기준년월'] = mmt.format('YYYY.MM');
							break;
						case 'half':
							raw['기준년월'] = mmt.format('YYYY.') + (6 > mmt.get('month') ? '1' : '2') + 'H';

							if (xAxisMap[raw['기준년월']] && xAxisMap[raw['기준년월']] !== raw['std_yyyymm']) {
								raw.isExcluded = true;
							} else {
								xAxisMap[raw['기준년월']] = raw['std_yyyymm'];
							}
							break;
						case 'quarter':
							raw['기준년월'] = mmt.format('YYYY.Q[Q]');
							break;
					}
				}
				self.rawDataArr = self.rawDataArr.filter(function(elm) {
					return ! elm.isExcluded;
				});
				
			});
		},
		loadAxis: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				xAxisArr = $.extend(true, [], self.sanggaArr),
				sanggaMap = self.sanggaMap,
				yAxisObj = {
					title: {
						text: ''
					}
				};

			// 정렬: 상가종류, 분양연도 오름차순
			// 연도 - 1년 기간, 년도 - 10년 기간 ㄷㄷ
			rawDataArr = rawDataArr.sort(function(a, b) {
				var aType = sanggaMap[a['상권업종대분류명']],
					bType = sanggaMap[b['상권업종대분류명']];
					
				if (aType < bType) {
					return -1;
				}
				if (aType > bType) {
					return 1;
				}

				if (a['기준년월'] < b['기준년월']) {
					return -1;
				}
				if (a['기준년월'] > b['기준년월']) {
					return 1;
				}
				return 0;
			});

			// 엑셀 저장용 정보로도 활용될 예정
			self.xAxisArr = xAxisArr;
		},
		updateData: function() {
			var self = this,
				chartOptions = {
					xaxis: {
						categories: self.xAxisArr
					},
				},
				chartSeries = [];

			// 이전 대비 데이터 가공 후 출력
			self.updateDataComparePrev();

			self.updateDataBySanggaType(chartOptions, chartSeries);
			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);			
		},
		
		updateDataBySanggaType: function(chartOptions, chartSeries) {
			var self = this,
				sanggaArr = self.sanggaArr,
				sanggaMap = self.sanggaMap;

			// pie, donut 차트는 배열 그대로 입력
			for (var i in sanggaArr) {
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
				if (self.endYMDText !== raw['기준년월']) {
					continue;
				}

				var idxSangga = sanggaMap[raw['상권업종대분류명']];
				prevData.data[idxSangga] += parseFloat(raw['상권업종수']);
			}
		},
		updateDataComparePrev: function() {
			var self = this,
				dongArr = self.dongArr,
				sanggaArr = self.sanggaArr,
				sanggaMap = self.sanggaMap,
				prevSanggaType = '',
				prevYear = '',
				prevData,
				timeBound = self.searchDtl.radioTimeBound;
			
			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));

			// 정렬: 상가종류 오름차순, 분양연도 내림차순
			rawDataArr = rawDataArr.sort(function(a, b) {
				var aType = sanggaMap[a['상권업종대분류명']],
					bType = sanggaMap[b['상권업종대분류명']];
					
				if (aType < bType) {
					return -1;
				}
				if (aType > bType) {
					return 1;
				}
				
				if (a['기준년월'] < b['기준년월']) {
					return -1;
				}
				if (a['기준년월'] > b['기준년월']) {
					return 1;
				}
				return 0;
			});

			var compResultArr = [];

			// 출력용 데이터 원본 생성
			for (var i in sanggaArr) {
				var compareObj = {
					title: sanggaArr[i],
					total: 0,
					compare0: 0,
					compare1: 0,
				};
				compResultArr.push(compareObj);
			}
			
			// 정렬된 데이터 순서로 합산 진행
			var total =  0;
			var total_pre = 0;
			var endYMD = moment(self.endYMD, 'YYYYMMDD');
			for (var i in rawDataArr) {
				var raw = rawDataArr[i],
					comp = compResultArr[sanggaMap[raw['상권업종대분류명']]],
					startYMD = raw['기준년월'],
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
					comp['compare' + diff] +=  parseFloat(raw['상권업종수']);
					if(diff == 0){
						total +=  parseFloat(raw['상권업종수']); 
					}else if(diff == 1){
						total_pre +=  parseFloat(raw['상권업종수']);
					}
				}
			}
			
			// 비교치 % 계산
			for (var i in compResultArr) {
				var comp = compResultArr[i];
				
				if(total > 0){
					comp['total'] = (comp['compare0'] / total  * 100).toFixed(1) + '%';
				}
				
				for (var j = 1; self.diffTime > j; ++j) {
					// 둘 다 0 이면 계산 제외, 예전만 0 이고 신규 데이터 있으면 New 표시
					// + class, icon 표시 수정
					if (! comp['compare' + j]) {
						if (! comp['compare0']) {
							comp['total'] = '0%';
						} else {
							comp['compare' + j] = 'New';
						}
						comp['class' + j] = '';
						comp['icon' + j] = '';

					} else {
						comp['compare' + j] = Math.round(100 * (comp['compare0'] - comp['compare' + j]) / comp['compare' + j]) + '%';
						
						if (0 > ('' + comp['compare' + j]).indexOf('-')) {
							comp['class' + j] = 'text-danger';
							comp['icon' + j] = '<i class="fa fa-caret-up text-danger"></i>';
						}
					}
				}
				
				if(total > 0) {
					comp['compare0'] =  z.toComma(comp['compare0']);
				}
			}
			self.$wrapper.find('[data-industry-total]').text("0%");
			self.$wrapper.find('[data-industry-rate]').text('0');
			self.$wrapper.find('[data-industry-rate-up]').text("");

			var pre_upDown = "하락";
			var pre_rete = 0;
			if(total_pre > 0){
				pre_rete = Math.round(100 * (total - total_pre) / total_pre);
			} else {
				if(total > 0){
					pre_rete = 100;
				}
			}

			if(0 > (""+pre_rete).indexOf('-')){
				pre_upDown = "상승";
			}
			self.$wrapper.find('[data-industry-total]').text(z.toComma(total));
			self.$wrapper.find('[data-industry-rate]').text(pre_rete + '%');
			self.$wrapper.find('[data-industry-rate-up]').text(pre_upDown);
			
			$(self.tableSelector).hide();
			self.totalIndustry = total;
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
	}	// end - chartIndustryInfoSanggaType

	// 업종분포 추이 데이터
	var tableIndustryInfoSanggaType = {
		init: function(param, searchDtl) {
			var self = this,
				industryTypeArr = (isTabidx == '1' ? industryTypeArr_old : industryTypeArr_new);

			self.param = param;
			self.searchDtl = searchDtl;
			self.$table = (isTabidx == '1' ? $(tab01.table_5_1) : $(tab02.table_5_1));
			self.$thead = self.$table.find('thead');
			self.$tbody = (isTabidx == '1' ? $(tab01.tbody_5_1).html('') : $(tab02.tbody_5_1).html(''));

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
				self.sanggaArr = $.extend(true, [], industryTypeArr);
			}

			if (self.searchDtl && self.searchDtl.checkFloorBound.length) {
				self.isCustomFloor = true;
				self.floorArr = $.extend(true, [], self.searchDtl.checkFloorBound);
			}else{
				self.isCustomFloor = false;
				self.floorArr = $.extend(true, [], floorTypeArr);
			}
			
			// 동 이름 목록 로딩
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

			// 전국 데이터 작업
			for(var i in sidoArr) {
				// 공급추이차트 데이터와 맞추기 위해 [전국]은 제외
				if(sidoArr[i].sidonm.substring(0, 2) != '전국') {
					self.sidoArr.push(sidoArr[i].sidonm);
				}
			}

			self.setBtnListener();
		
			self.loadData().done(function(resp) {
				self.updateDataBySanggaType();
				self.updateData();
			});
		},
		setBtnListener: function() {
			var tbody = (isTabidx == '1' ? tab01.tbody_5_1 : tab02.tbody_5_1),
				table = (isTabidx == '1' ? 'table_5_1_1' : 'table_5_1_2');
			
			$(`[data-btn-download=${table}]`).click(function() {
				if(_isDemo) {
					z.msg(_DemoMsgDownloadX);
					return;
				}
				
				if(excelyn == "N"){
					z.msg(_NoPemissionMsgDownloadX);
					return;
				}

				$.when(
					tableIndustryInfoSanggaType.exportSheet()
				).done(function(workSheet) {
					var wb = XLSX.utils.book_new();
					
					XLSX.utils.book_append_sheet(wb, workSheet, '업종분포추이_데이터');
					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_업종분포추이_데이터.xlsx');					
				});
			});

			/* 추이클릭시 펼치기/닫기(지역별 인구) */ 
			$(tbody).off().on('click', '.maintotal', function() {
				var dong = $(this).attr('data-dong');
				var show = $(this).hasClass('data-show');
				var mainlen = 0;
				var sublen = 0;
				
				$(tbody).children('tr').each(function(index, item){
					if($(item).attr('data-dong') === dong){
						if($(this).hasClass('maintotal')){
							mainlen++;
						}
						if($(this).hasClass('subtotal')){
							sublen++;
						}
					} 
				});
				
				if(show){	//숨기기
					$(tbody).children('tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){
							$(item).children().eq(0).attr('rowspan', mainlen);
							$(item).not('.maintotal').hide();
							$(item).removeClass('data-show').addClass('data-hide');
							$(item).removeClass('data-s-show').addClass('data-s-hide');
							$(item).removeClass('data-s-show2').addClass('data-s-hide2');	
						}
					});		
				} else {	//보이기
					$(tbody).children('tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){
							if($(item).hasClass('maintotal')){
								if($(item).children().eq(0).attr('rowspan') == mainlen){
									$(item).children().eq(0).attr('rowspan', mainlen + sublen);
								};
								$(item).removeClass('data-hide').addClass('data-show');
							}
							if($(item).hasClass('subtotal')){
								$(item).children().eq(0).attr('rowspan', mainlen);
								$(item).show();
								$(item).removeClass('data-hide').addClass('data-show');
							}
						}
					});	
				}
			});

			/* 추이클릭시 펼치기/닫기(인구유형별) */
			$(tbody).on('click', '.subtotal', function() {
				var dong = $(this).attr('data-dong');
				var type = $(this).attr('data-type');
				var show = $(this).hasClass('data-s-show');
				var oldshowlen = 0;
				var newshowlen = 0;
				
				$(tbody).children('tr').each(function(index, item){
					if($(item).attr('data-dong') === dong ){
						if($(this).hasClass('data-show')){
							oldshowlen++;
						} 
						if($(item).attr('data-type') == type && $(item).hasClass('subtotal2')){
							newshowlen++;
						} 
					} 
				});
				
				if(show){	//숨기기
					$(tbody).children('tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){
							if($(item).hasClass('maintotal')){
								$(item).children().eq(0).attr('rowspan', oldshowlen - newshowlen);
							} 
							if($(item).attr('data-type') === type){
								if($(item).hasClass('subtotal')){
									$(item).children().eq(0).attr('rowspan', "1");  //합계
									$(item).removeClass('data-s-show').addClass('data-s-hide');
								} else if($(item).hasClass('subtotal2')){
									$(item).hide();
									$(item).removeClass('data-show').addClass('data-hide');
									$(item).removeClass('data-s-show').addClass('data-s-hide');
								} else if($(item).hasClass('subdata')){
									$(item).hide();
									$(item).removeClass('data-show').addClass('data-hide');
									$(item).removeClass('data-s-show').addClass('data-s-hide');
									$(item).removeClass('data-s-show2').addClass('data-s-hide2');
								}
							}	
						}
					});		
				} else {	//보이기
					$(tbody).children('tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){
							if($(item).hasClass('maintotal')){
								$(item).children().eq(0).attr('rowspan', oldshowlen + newshowlen);
							} 
							if($(item).attr('data-type') === type){
								if($(item).hasClass('subtotal')){
									$(item).children().eq(0).attr('rowspan', newshowlen + 1);  //합계
									$(item).removeClass('data-hide').addClass('data-show');
									$(item).removeClass('data-s-hide').addClass('data-s-show');
								} else if($(item).hasClass('subtotal2')){
									$(item).children().eq(0).attr('rowspan', "1");
									$(item).show();
									$(item).removeClass('data-hide').addClass('data-show');
									$(item).removeClass('data-s-hide').addClass('data-s-show');
								} 
							}	
						}
					});	
				}
			});

			/* 추이클릭시 펼치기/닫기(성별) */
			$(tbody).on('click', '.subtotal2', function() {
				var dong = $(this).attr('data-dong');
				var type = $(this).attr('data-type');
				var sex = $(this).attr('data-sex');
				var show = $(this).hasClass('data-s-show2');
				var mainlen  = 0;
				var sublen = 0;
				var sublen2 = 0;
				var newlen  = 0;
				
				$(tbody).children('tr').each(function(index, item){
					if($(item).attr('data-dong') === dong && $(this).hasClass('data-show')){
						mainlen++
					}

					if($(item).attr('data-dong') === dong && $(item).attr('data-type') === type && $(this).hasClass('data-s-show')){
						sublen++
					}
										
					if($(item).attr('data-dong') === dong && $(item).attr('data-type') === type && $(item).attr('data-sex') === sex){
						if($(this).hasClass('data-s-show2')){
							sublen2++
						}
						if($(item).hasClass('subdata')){
							newlen++
						}
					} 
				});
								
				if(show){	//숨기기
					$(tbody).children('tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){
							if($(item).hasClass('maintotal')){
								var oldlen = $(item).children().eq(0).attr('rowspan');
								$(item).children().eq(0).attr('rowspan', parseInt(mainlen) - newlen);
							}
							if($(item).attr('data-type') === type){
								if($(item).hasClass('subtotal')){
									var oldlen = $(item).children().eq(0).attr('rowspan');  //합계
									$(item).children().eq(0).attr('rowspan', parseInt(sublen) - newlen);	
								} 
								if($(item).attr('data-sex') === sex){								
									if($(item).hasClass('subtotal2')){
										var oldlen = $(item).children().eq(0).attr('rowspan');  //합계
										$(item).children().eq(0).attr('rowspan', parseInt(sublen2) - newlen);
										$(item).removeClass('data-s-show2').addClass('data-s-hide2');
									} else if($(item).hasClass('subdata')){
										$(item).hide();
										$(item).removeClass('data-show').addClass('data-hide');
										$(item).removeClass('data-s-show').addClass('data-s-hide');
										$(item).removeClass('data-s-show2').addClass('data-s-hide2');
									}
								}	
							}
						}	
					});	
				} else {	//보이기
					$(tbody).children('tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){
							if($(item).hasClass('maintotal')){
								var oldlen = $(item).children().eq(0).attr('rowspan');
								$(item).children().eq(0).attr('rowspan', parseInt(oldlen) + newlen);
							} 
							if($(item).attr('data-type') === type){
								if($(item).hasClass('subtotal')){
									var oldlen = $(item).children().eq(0).attr('rowspan');  //합계
									$(item).children().eq(0).attr('rowspan', parseInt(oldlen) + newlen);
								} 
								if($(item).attr('data-sex') === sex){								
									if($(item).hasClass('subtotal2')){
										var oldlen = $(item).children().eq(0).attr('rowspan');  //합계
										$(item).children().eq(0).attr('rowspan', parseInt(oldlen) + newlen);
										$(item).removeClass('data-s-hide2').addClass('data-s-show2');
									} else if($(item).hasClass('subdata')){
										$(item).show();
										$(item).removeClass('data-hide').addClass('data-show');
										$(item).removeClass('data-s-hide').addClass('data-s-show');
										$(item).removeClass('data-s-hide2').addClass('data-s-show2');
									}
								}	
							}	
						}
					});	
				}
			});
		},
		loadData: function() {
			var self = this,
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					startYMD: self.startYMD,
					endYMD: self.endYMD,
					jusoCd: self.param.jusoCd,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '',
					industryCode: isTabidx
				};
				
			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;
			}

			if (self.isCustomFloor) {
				param.floorArr = self.floorArr;
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
				endYMD,
				timeBound = self.searchDtl.radioTimeBound,
				diffTime = 0,
				xAxisArr = [],
				pastYMD = moment('20221231');	// 2023년 이후 업종코드 체계 변경으로 인해 추가
				
			switch (timeBound) {
			case 'year':
				endYMD = (isTabidx == '1' ? moment('20221231') : moment().endOf('year')),
				diffTime = endYMD.diff(startYMD, 'years') + 1;
				
				var tmp = startYMD.clone();
				for (var i = 0; diffTime > i; ++i) {
					xAxisArr.push(tmp.format('YYYY'));
					tmp.add(1, 'year');
				}
				break;
			case 'quarter':
				endYMD = (isTabidx == '1' ? pastYMD : moment().endOf('quarter')),
				diffTime = endYMD.diff(startYMD, 'quarters') + 1;
				
				var tmp = startYMD.clone();
				for (var i = 0; diffTime > i; ++i) {
					xAxisArr.push(tmp.format('YYYY.Q[Q]'));
					tmp.add(1, 'quarter');
				}
				break;
			case 'month':
				endYMD = moment().endOf('month'),
				diffTime = endYMD.diff(startYMD, 'months') + 1;

				var tmp = startYMD.clone();
				for (var i = 0; diffTime > i; ++i) {
					xAxisArr.push(tmp.format('YYYY.MM'));
					tmp.add(1, 'month');
				}
				break;
			case 'half':
				endYMD = moment();
				
				if (6 > endYMD.get('month')) {
					endYMD.set('month', 5).endOf('month');
				} else {
					endYMD = endYMD.endOf('year');
				}
				if(isTabidx == '1') {
					endYMD = pastYMD;
				}
				diffTime = Math.floor(endYMD.diff(startYMD, 'quarters') / 2) + 1;

				var tmp = startYMD.clone();
				for (var i = 0; diffTime > i; ++i) {
					xAxisArr.push(tmp.format('YYYY.') + (6 > tmp.get('month') ? '1' : '2') + 'H');
					tmp.add(2, 'quarter');
				}
				break;
			}
		
			param.endYMD = 'custom' !== self.searchDtl.radioTimeBound ? endYMD.format('YYYYMMDD') : self.endYMD;

			// geom boundary
			if (param.geom) {
				var geoJson = Terraformer.WKT.parse(param.geom),
					bbox = turf.bbox(turf.polygon(geoJson.coordinates));

				param.west = bbox[0];
				param.east = bbox[2];
				param.south = bbox[1];
				param.north = bbox[3];
			}
			return z.xAsync('IndustryInfo', '업종분포추이데이터', 'select', param, 'json').done(function(resp) {
				var rawDataArr = self.rawDataArr = resp,
					xAxisMap = [];

				// 2. 기존 분양연도 컬럼 규칙에 맞도록 수정 + 검색기간의 마지막 데이터만 반영되도록 filter
				for (var i in rawDataArr) {
					var raw = rawDataArr[i],
						mmt = moment(raw['기준년월'], 'YYYYMM');
	
					switch (timeBound) {
						case 'year':
							raw['기준년월'] = mmt.format('YYYY');

							if (xAxisMap[raw['기준년월']] && xAxisMap[raw['기준년월']] !== raw['std_yyyymm']) {
								raw.isExcluded = true;
							} else {
								xAxisMap[raw['기준년월']] = raw['std_yyyymm'];
							}
							break;
						case 'month':
							raw['기준년월'] = mmt.format('YYYY.MM');
							break;
						case 'half':
							raw['기준년월'] = mmt.format('YYYY.') + (6 > mmt.get('month') ? '1' : '2') + 'H';

							if (xAxisMap[raw['기준년월']] && xAxisMap[raw['기준년월']] !== raw['std_yyyymm']) {
								raw.isExcluded = true;
							} else {
								xAxisMap[raw['기준년월']] = raw['std_yyyymm'];
							}
							break;
						case 'quarter':
							raw['기준년월'] = mmt.format('YYYY.Q[Q]');
							break;
					}
				}
				self.rawDataArr = rawDataArr.filter(function(elm) {
					return ! elm.isExcluded;
				});

				self.diffTime = diffTime;
				self.xAxisArr = xAxisArr;
			});
		},
		updateDataBySanggaType: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				dongArr = (self.param.sidonm == '전국' ? self.sidoArr : self.dongArr),
				isSgg = self.isSgg,
				isBizdist = self.param.isBizdist,
				sanggaArr = self.sanggaArr,
				minYearInt = self.minYearInt,
				resultArr = [],
				industryTypeGbnArr = (isTabidx == '1' ? industryTypeGbnArr_old : industryTypeGbnArr_new);
			
			var	row = {
				dongnm: isBizdist ? self.param.bizdistnm : (isSgg ? self.param.sidonm : self.param.sggnm),
				industryTypeData : []
			};
			
			dongArr.unshift((isSgg ? self.param.sidonm : self.param.sggnm));
			// 1. 동 + 상가유형 별 데이터 생성
			for (var i in dongArr) {
				var dongData = $.extend(true, {}, row);
				
				dongData.dongnm = dongArr[i];
				
				/* 대분류  */
				for (var j in sanggaArr) {		
					dongData.industryTypeData.push({
						industryType: sanggaArr[j],
						industryTypemData :[]
					});
					
					for(var k in industryTypeGbnArr){
						var idx = industryTypeGbnArr[k].split("@")[0].indexOf(sanggaArr[j]);
						if(idx >= 0){
							dongData.industryTypeData[j].industryTypemData.push({
								industryTypeM: industryTypeGbnArr[k].split("@")[1].trim(),
								data: Array.apply(null, Array(floorTypeArr.length + 1)).map(function() { // 데이터 가로
									return Array.apply(null, Array(self.diffTime)).map(function() {return 0;}); // 데이터 세로
								})
							});
						}	
					}  
				}
				resultArr.push(dongData);
			}
			var j=0, idxMdata;
			// 1-1. 1번 형식대로 데이터 입력
			for (var i in rawDataArr) {
				var rawData = rawDataArr[i],
					idxDong = isBizdist ? 0 : (self.param.sidonm == '전국' ? dongArr.indexOf(rawData.sidonm) : dongArr.indexOf(rawData.dongnm)),
					idxMain = sanggaArr.indexOf(rawData['상권업종대분류명'].trim()),
					idxfloor = floorTypeArr.indexOf(rawData['층정보']),
					rawindMain = rawData['상권업종대분류명'].trim(),
					rawindSub = rawData['상권업종중분류명'].trim();				

				// 미포함 데이터 제외
				if (0 > idxDong || 0 > idxMain) {
					continue;
				}
				
				var dongData = resultArr[idxDong],
					idxYear = self.xAxisArr.indexOf(rawData['기준년월']);
				
				for(var k in dongData.industryTypeData[idxMain].industryTypemData){
					if(dongData.industryTypeData[idxMain].industryTypemData[k].industryTypeM != rawindSub){
						continue;
					}
					
					resultArr[0].industryTypeData[idxMain].industryTypemData[k].data[0].name = "소계";
					resultArr[0].industryTypeData[idxMain].industryTypemData[k].data[0][idxYear] += parseFloat(rawData['상권업종수']);  
					resultArr[0].industryTypeData[idxMain].industryTypemData[k].data[idxfloor + 1].name = rawData['층정보'];
					resultArr[0].industryTypeData[idxMain].industryTypemData[k].data[idxfloor + 1][idxYear] += parseFloat(rawData['상권업종수']);
				
					dongData.industryTypeData[idxMain].industryTypemData[k].data[0].name = "소계";
					dongData.industryTypeData[idxMain].industryTypemData[k].data[0][idxYear] += parseFloat(rawData['상권업종수']);  
					dongData.industryTypeData[idxMain].industryTypemData[k].data[idxfloor + 1].name = rawData['층정보'];
					dongData.industryTypeData[idxMain].industryTypemData[k].data[idxfloor + 1][idxYear] += parseFloat(rawData['상권업종수']);
				}	
			}
			
			/* 대분류 중분류 총계 */
			for (var i in dongArr) {
				for (var j in sanggaArr) {	
					var industryTypemData = resultArr[i].industryTypeData[j].industryTypemData,
						msum = Array.apply(null, Array(self.diffTime)).map(function() {return 0;});

					for (var k in industryTypemData) {
						var sumFloorRow = industryTypemData[k].data[0];
						for (var l in sumFloorRow) {
							msum[l] += sumFloorRow[l];
						}		
					}	
					resultArr[i].industryTypeData[j].sum = msum;
				}
				
				var industryTypeData = resultArr[i].industryTypeData,
					sum = Array.apply(null, Array(self.diffTime)).map(function() {return 0;});
				for (var j in industryTypeData) {
					var sumFloorRow = industryTypeData[j].sum;
				
					for (var k in sumFloorRow) {
						sum[k] += sumFloorRow[k];
					}	
				}
				resultArr[i].sum = sum;
			}
		 	
			
			/* 6. 최종 결과 3자리 콤마 */
			for (var i in resultArr) {
				for (var j in sanggaArr) {	
					var industryTypemData = resultArr[i].industryTypeData[j].industryTypemData;
					var sum = resultArr[i].sum;
					var msum = resultArr[i].industryTypeData[j].sum;
				
					for (var j in industryTypemData) {
						for (var k in industryTypemData[j].data) {
							for (var h in industryTypemData[j].data[k]) {
								if (0 === industryTypemData[j].data[k][h]) { //0 이면 - 로 치환
									industryTypemData[j].data[k][h] = '-';
								}else{
									industryTypemData[j].data[k][h] = z.toComma(industryTypemData[j].data[k][h]);
								}
							}
						}
					}
					for (var j in msum) {
						if(0 === msum[j]) {
							msum[j] = '-';
						} else {
							msum[j] = z.toComma(msum[j]);	
						}
					}	
				}	
				for (var j in sum) {
					if(0 === sum[j]) {
						sum[j] = '-';
					} else {
						sum[j] = z.toComma(sum[j]);	
					}
				}
			}
			
			// 7. 전체선택이 아닌 경우, 선택된 시군구 or 읍면동의 데이터만 표시되도록 수정됨
			// 총합 때문에 합산 끝내놓고 정리
			var selectedDongNm = isBizdist ? self.param.bizdistnm : (self.param.dongnm != "" ? self.param.dongnm : self.param.bizdistnm);
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
				tmpl = Handlebars.compile($('#tmplTableIndustryInfoSanggaType').html()),
				$tr = self.$thead.find('tr:first-child'),
				floorCopyArr = $.extend(true, [], self.floorArr),
				sanggaCopyArr = $.extend(true, [], self.sanggaArr),
				classNameArr = Array.apply(null, Array(floorCopyArr.length - 1)).map(function() {return '';}),
				firstLineArr = Array.apply(null, Array(floorCopyArr.length)).map(function() {return false;});
			
			$tr.find('th[rowspan="1"]').remove();

			for (var i = 0, len = self.xAxisArr.length; len > i; ++i) {
				var $th = $('<th/>', {rowspan: '1', text: self.xAxisArr[i]});
				$tr.append($th);
			}
			
			floorCopyArr.unshift('소계');
			classNameArr.unshift('maintotal');
			classNameArr.push('tr-border');
			firstLineArr.unshift(true);
			
			self.$tbody.html('').append(tmpl({
				  sanggaTypeArr: sanggaCopyArr, 
				  floorTypeArr: floorCopyArr, 
				  dongRowSpan: ((sanggaCopyArr.length) * (floorCopyArr.length)) + 1, 
				  sanggaRowSpan: (floorTypeArr.length + 1),
				  dataArr: self.resultArr,
				  classNameArr: classNameArr,
				  firstLineArr: firstLineArr
			}));
			$(self.$tbody).children('.maintotal').click();
			// $(`${self.$tbody} .maintotal`).click();
		},
		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = self.$tbody.closest('table'),
					wsBody = XLSX.utils.table_to_sheet($table[0]),
					jsonBody = XLSX.utils.sheet_to_json(wsBody, {header: 1}),
					jsonMerge = jsonBody,
					mainlen = jsonBody[0].length,
					sublen  = mainlen - 1,
					sublen2  = mainlen - 2,
					area = '',
					industry = '',
					industry2 = '';

				for (var i in jsonBody) {
					var row = jsonBody[i];
					if(mainlen === row.length){
						area = row[0];
					}
					if(sublen === row.length){
						industry = row[0];
					}
					if(sublen2 === row.length){
						industry2 = row[0];
					}
					if(mainlen > row.length ){
						if(sublen == row.length) {
							row.unshift(area);
						} else if(sublen2 == row.length) {
							row.unshift(industry);
							row.unshift(area);
						} else {
							row.unshift(industry2);
							row.unshift(industry);
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
			});
			return result;
		}
	}	// end - tableIndustryInfoSanggaType

	// 공급 추이 상세 데이터
	var tableIndustryInfoDetail = {
		init: function(param, searchDtl) {
			var self = this,
				industryTypeArr = (isTabidx == '1' ? industryTypeArr_old : industryTypeArr_new);

			self.param = param;
			self.searchDtl = searchDtl;
			self.$tbody = (isTabidx == '1' ? $(tab01.tbody_5_2).html('') : $(tab02.tbody_5_2).html(''));
			self.$wrapper = self.$tbody.closest('[data-table-wrapper]');
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
				self.sanggaArr = $.extend(true, [], industryTypeArr);
			}
			
			if (self.searchDtl && self.searchDtl.checkFloorBound.length) {
				self.isCustomFloor = true;
				self.floorArr = $.extend(true, [], self.searchDtl.checkFloorBound);
			}else{
				self.isCustomFloor = false;
				self.floorArr = $.extend(true, [], floorTypeArr);
			}
			
			self.setBtnListener();

			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		setBtnListener: function() {
			var self = this;
			self.$wrapper.find('.allView').off('click').on('click', function() {
				self.openAllView();
			});
		},
		loadData: function() {
			var self = this,
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					startYMD: self.startYMD,
					jusoCd: self.param.jusoCd,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '',
					industryCode: isTabidx
				};
				
			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;
			}
			
			if (self.isCustomFloor) {
				param.floorArr = self.floorArr;
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
				endYMD,
				timeBound = self.searchDtl.radioTimeBound,
				diffTime = 0,
				xAxisArr = [];
				
			switch (timeBound) {
				case 'year':
					endYMD = moment().subtract(1, 'year').endOf('year');
					diffTime = endYMD.diff(startYMD, 'years') + 1;
					
					var tmp = startYMD.clone();
					for (var i = 0; diffTime > i; ++i) {
						xAxisArr.push(tmp.format('YYYY'));
						tmp.add(1, 'year');
					}
					break;
				case 'quarter':
					endYMD = moment().subtract(1, 'quarter').endOf('quarter');
					diffTime = endYMD.diff(startYMD, 'quarters') + 1;
					
					var tmp = startYMD.clone();
					for (var i = 0; diffTime > i; ++i) {
						xAxisArr.push(tmp.format('YYYY.Q[Q]'));
						tmp.add(1, 'quarter');
					}
					break;
				case 'month':
					endYMD = moment().subtract(1, 'month').endOf('month');
					diffTime = endYMD.diff(startYMD, 'months') + 1;

					var tmp = startYMD.clone();
					for (var i = 0; diffTime > i; ++i) {
						xAxisArr.push(tmp.format('YYYY.MM'));
						tmp.add(1, 'month');
					}
					break;
				case 'half':
					endYMD = moment();
					
					if (6 > endYMD.get('month')) {
						endYMD = endYMD.subtract(1, 'year').endOf('year');
					} else {
						endYMD.set('month', 5).endOf('month');
					}
					
					diffTime = Math.floor(endYMD.diff(startYMD, 'quarters') / 2) + 1;

					var tmp = startYMD.clone();
					
					for (var i = 0; diffTime > i; ++i) {
						xAxisArr.push(tmp.format('YYYY.') + (6 > tmp.get('month') ? '1' : '2') + 'H');
						tmp.add(2, 'quarter');
					}
					break;
			}
			param.endYMD = 'custom' !== self.searchDtl.radioTimeBound ? endYMD.format('YYYYMMDD') : self.endYMD;

			// geom boundary
			if (param.geom) {
				var geoJson = Terraformer.WKT.parse(param.geom),
					bbox = turf.bbox(turf.polygon(geoJson.coordinates));

				param.west = bbox[0];
				param.east = bbox[2];
				param.south = bbox[1];
				param.north = bbox[3];
			}

			return z.xAsync('IndustryInfo', '업종분포추이상세데이터', 'select', param, 'json').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;

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
					// 10줄 초과는 히든처리
					if (9 < i) {
						row.isHidden = true;
					}
				}
			});
		},
		updateData: function(isAppendHidden) {
			var self = this,
				tmpl = Handlebars.compile($('#tmplTableIndustryInfoDetail').html()),
				dataArr = [],
				cnt = self.rawDataArr.length || 0;

			if (!isAppendHidden) {
				dataArr = self.rawDataArr.filter(function(elm) {
					return !elm.isHidden;
				});
			} else {
				dataArr = self.rawDataArr;
			}
			self.$tbody.html(tmpl({dataArr: dataArr}));
			self.$tbody.closest('[data-table-wrapper]').find('[data-cnt-rawdata]').text(z.toComma(cnt));
		},
		exportSheet: function() {
			var self = this,
				result = $.Deferred();

			setTimeout(function() {
				self.updateData(true);
				
				var $table = self.$tbody.closest('table'),
					wsBody = XLSX.utils.table_to_sheet($table[0]),
					jsonBody = XLSX.utils.sheet_to_json(wsBody, {header: 1}),
					jsonMerge = jsonBody,
					ws = XLSX.utils.json_to_sheet(jsonMerge, {skipHeader: true});

				self.$tbody.find('[data-hidden]').hide();
				result.resolve(ws);
			});
			return result;
		},
		openAllView: function() {
			var self = this,
				$modal = $('#modalAllView'),
				$modalBody = $modal.find('[data-modal-body]');

			self.updateData(true);
			
			var $clone = self.$wrapper.clone();
			
			// 다운로드, 전체보기 버튼 삭제
			$clone.find('[data-btn-download]').remove();
			$clone.find('.allView').remove();

			$modalBody.html($clone);

			self.$tbody.find('[data-hidden]').hide();
			
			$modal.modal({
				backdrop: 'static'
			}).modal('show');
		}
	}	// end - tableIndustryInfoDetail

	// 공급 추이 상세 데이터
	var tableIndustryInfoSum = {
		init: function(param, searchDtl) {
			var self = this,
				industryTypeArr = (isTabidx == '1' ? industryTypeArr_old : industryTypeArr_new);

			self.param = param;
			self.searchDtl = searchDtl;
			self.$tbody = (isTabidx == '1' ? $(tab01.tbody_5_3).html('') : $(tab02.tbody_5_3).html(''));
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
				self.sanggaArr = $.extend(true, [], industryTypeArr);
			}
			
			if (self.searchDtl && self.searchDtl.checkFloorBound.length) {
				self.isCustomFloor = true;
				self.floorArr = $.extend(true, [], self.searchDtl.checkFloorBound);
			}else{
				self.isCustomFloor = false;
				self.floorArr = $.extend(true, [], floorTypeArr);
			}
			
			self.setBtnListener();

			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		loadData: function() {
			var self = this,
				param = {
					pnu: self.param.isBizdist ? '' : self.param.dongCd,
					geom: self.param.isBizdist ? self.param.bizdistGeom : '',
					startYMD: self.startYMD,
					endYMD: 'custom' !== self.searchDtl.radioTimeBound ? '' : self.endYMD,
					jusoCd: self.param.jusoCd,
					bizdistseq : self.param.isBizdist ? self.param.bizdistcd : '',
					industryCode: isTabidx
				};
				
			if (self.isCustomSangga) {
				param.sanggaArr = self.sanggaArr;
			}
			
			if (self.isCustomFloor) {
				param.floorArr = self.floorArr;
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

			// geom boundary
			if (param.geom) {
				var geoJson = Terraformer.WKT.parse(param.geom),
					bbox = turf.bbox(turf.polygon(geoJson.coordinates));

				param.west = bbox[0];
				param.east = bbox[2];
				param.south = bbox[1];
				param.north = bbox[3];
			}
			
			return z.xAsync('IndustryInfo', '업종분포추이데이터', 'select', param, 'json').done(function(resp) {
				self.rawDataArr = resp;
				
			});
		},
		updateData: function(isAppendHidden) {
			var self = this,
				tmpl = Handlebars.compile($('#tmplTableIndustryInfoSum').html()),
				rawDataArr = self.rawDataArr,
				dataArr = [],
				dongArr = [],
				columnNm = 'sggnm',
				sumNm = self.param.sidonm;;

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
						dongArr = apiSearchEmd.getSggArr();
						break;
				}
			}

			for (var i in dongArr) {
				dataArr.push({
					dongnm: dongArr[i].dongnm || dongArr[i].sggnm,
					value: 0,
					cnt: 0
				});
			}
				
			for (var i in rawDataArr) {
				var row = rawDataArr[i],
					key = row[columnNm];
				
				for (var j in dataArr) {
					if (key === dataArr[j].dongnm) {
						dataArr[j].value += parseInt(row['상권업종수']);
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
				sum.value += parseInt(dataArr[i].value);
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
			
			setTimeout(function() {
				self.updateData(true);

				var $table = self.$tbody.closest('table'),
					wsBody = XLSX.utils.table_to_sheet($table[0]),
					jsonBody = XLSX.utils.sheet_to_json(wsBody, {header: 1}),
					jsonMerge = jsonBody,
					ws = XLSX.utils.json_to_sheet(jsonMerge, {skipHeader: true});

				self.$tbody.find('[data-hidden]').hide();
				result.resolve(ws);
			});
			return result;
		}
	}	// end - tableIndustryInfoSum
	
	return {
		init: function() {
			var self = this;
			
			self.setBtnListener();

			industryCommInfo.init();
			chartIndustryInfoDong.hide();
			chartIndustryInfoSanggaType.hide();
		},
		setBtnListener: function() {
			let table_5_2 = (isTabidx == '1' ? tab01.table_5_2 : tab02.table_5_2);
			$('[data-btn-download="' + table_5_2 + '"]').click(function() {
				if(_isDemo) {
					z.msg(_DemoMsgDownloadX);
					return;
				}
				if(excelyn == "N"){
					z.msg(_NoPemissionMsgDownloadX);
					return;
				}

				$.when(
					tableIndustryInfoDetail.exportSheet()
				).done(function(workSheet) {
					var wb = XLSX.utils.book_new();
					
					XLSX.utils.book_append_sheet(wb, workSheet, '업종분포추이_상세');
					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_업종분포추이_상세.xlsx');					
				});
			});
			let table_5_3 = (isTabidx == '1' ? tab01.table_5_3 : tab02.table_5_3);
			$('[data-btn-download="' + table_5_3 + '"]').click(function() {
				if(_isDemo) {
					z.msg(_DemoMsgDownloadX);
					return;
				}
				if(excelyn == "N"){
					z.msg(_NoPemissionMsgDownloadX);
					return;
				}

				$.when(
					tableIndustryInfoSum.exportSheet()
				).done(function(workSheet) {
					var wb = XLSX.utils.book_new();
					
					XLSX.utils.book_append_sheet(wb, workSheet, '업종분포추이_합산');
					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_업종분포추이_합산.xlsx');					
				});
			});

			$('[data-target="#tab01"], [data-target="#tab02"]').on('click', function() {
				var $this = $(this),
					tab = $this.attr('data-target'),
					now = moment(),
					$startYMD = $('[name=startYMD]'),
					$endYMD = $('[name=endYMD]'),
					$radioTimeBound = $('[name=timeBound]'),
					$startDurationYMD = $('#tab01_01 [name=startDurationYMD]'),
					$checkbox_wrapper1 = $('[data-search-wrapper="sanggaType"]'),
					$checkbox_wrapper2 = $('[data-search-wrapper="sanggaType2"]');

				switch (tab) {
					case '#tab01':
						isTabidx = '1';
						const past = now.clone().subtract(5, 'years');
						$('[data-wrapper="wrapper2023"]').hide();
						$('[data-content-mode="2022"]').show();
						$('[data-content-mode="2023"]').hide();
						$checkbox_wrapper1.show();
						$checkbox_wrapper2.hide();
						$checkbox_wrapper1.find('[type=checkbox]').prop('checked', false);
						$checkbox_wrapper1.find('[type=checkbox][value=""]').prop('checked', true);
						$checkbox_wrapper2.find('[type=checkbox][value=""]').prop('checked', false);

						$startDurationYMD.datepicker('setStartDate', null);
						$startDurationYMD.datepicker('setEndDate', moment('2022-12-31').format('YYYY-MM-DD'));
						$startYMD.val(past.format('YYYY-MM-DD'));
						$startYMD.datepicker('setStartDate', null);
						$endYMD.datepicker('setStartDate', null);

						if($radioTimeBound.val() == 'year') {
							$startDurationYMD.val(moment('2022-12-31').subtract(12, 'year').add(1, 'day').format('YYYY-MM-DD'));
						} else if($radioTimeBound.val() == 'half') { 
							$startDurationYMD.val(moment('2022-12-31').subtract(24, 'quarter').add(1, 'day').format('YYYY-MM-DD'));
						} else {
							$startDurationYMD.val(moment('2022-12-31').subtract(12, 'quarter').add(1, 'day').format('YYYY-MM-DD'));
						}
						$endYMD.val(moment('2022-12-31').format('YYYY-MM-DD'));

						break;
					case '#tab02':
						isTabidx = '2';
						const past_new = now.clone().startOf('year');
						$('[data-wrapper="wrapper2023"]').show();
						$('[data-content-mode="2022"]').hide();
						$('[data-content-mode="2023"]').show();
						$checkbox_wrapper1.hide();
						$checkbox_wrapper2.show();
						$checkbox_wrapper2.find('[type=checkbox]').prop('checked', false);
						$checkbox_wrapper1.find('[type=checkbox][value=""]').prop('checked', false);
						$checkbox_wrapper2.find('[type=checkbox][value=""]').prop('checked', true);

						$startDurationYMD.datepicker('setStartDate', past_new.format('YYYY-MM-DD'));
						$startDurationYMD.datepicker('setEndDate', null);
						$startDurationYMD.val(past_new.format('YYYY-MM-DD'));
						$startYMD.val(past_new.format('YYYY-MM-DD'));
						$endYMD.val(now.clone().format('YYYY-MM-DD'));
						$startYMD.datepicker('setStartDate', past_new.format('YYYY-MM-DD'));
						$endYMD.datepicker('setStartDate', past_new.format('YYYY-MM-DD'));

						// apiIndustryInfo.init();
						break;	
				}
				
				$('.btnSearchAreaOk').click();
			});

			
			$('[data-search-wrapper="sanggaType2"]').find('[type=checkbox]').click(function() {
				var $this = $(this),
					$wrapper = $this.closest('[data-search-wrapper=sanggaType2]'),
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
		},
		setDongCd: function(param) {
			if (! param.isBizdist && ! param.dongCd) {
				return;
			}
			
			if (! param.isBizdist) {
				$('[data-select-sgg] [data-sgg-nm]').text(param.sggnm || param.sidonm);
			}
			
			var searchDtl = apiSearchIndustryInfo.getSearchDtl(param);
			if ('custom' === searchDtl.radioTimeBound) {
				$('[data-ui-user-date=true]').show();
				$('[data-ui-user-date=false]').hide();

				tableIndustryInfoSum.init(param, searchDtl);
			}else{
				$('[data-ui-user-date=true]').hide();
				$('[data-ui-user-date=false]').show();
				
				chartIndustryInfoAll.init(param, searchDtl);
				chartIndustryInfoDong.hide();
				chartIndustryInfoSanggaType.hide();
				
				if ('전체' === param.dongnm) {
					chartIndustryInfoDong.init();
				} else {
					chartIndustryInfoSanggaType.init();
				}
				// 차트 표시가 우선이어서 나중 실행으로 옮김
				// FIXME: 세번째 차트 로딩 완료 직후 1회 실행으로 최적화 가능
				setTimeout(function() {
					tableIndustryInfoSanggaType.init(param, searchDtl);
				}, param.isBizdist ? 20000 : 0);
			}
		}
	}
}(); // end - apiIndustryInfo


$(function() {
	$.when(
		$.getScript("https://cdnjs.cloudflare.com/ajax/libs/terraformer/1.0.12/terraformer.min.js"),
		$.getScript('/resources/admin/APPS/dashboard/apiSearchAreaMap_dev.js'),
		$.getScript('/resources/admin/APPS/dashboard/industryInfoSearch.js'),
		$.getScript('/resources/common/custom/js/commonDashboard.js')
	).always(function() {
		$.when(
			$.getScript("https://cdn.jsdelivr.net/npm/terraformer-wkt-parser@1.2.1/terraformer-wkt-parser.min.js"),
			$.getScript("https://cdnjs.cloudflare.com/ajax/libs/Turf.js/5.1.6/turf.min.js")
		).done(function() {
			z.xAsync('AdminMain', 'getExcelDown', 'select', {pgmCode:"MA0115"}, 'json').done(function(resp) {
				excelyn = resp[0].excelyn;
				if(excelyn == "N"){
					$("[data-btn-download]").css("visibility", "hidden");
				} else {
					$("[data-btn-download]").css("visibility", "visible");
				}
			}); 

			apiSearchAreaMap.init({
				btnSearchArea: $('#btnSearchArea'),
				btnSearchAreaSpan: $('#btnSearchArea > span'),
				areaCdListener: apiIndustryInfo.setDongCd,
				bizdistShow : false,     
			});
			
			apiSearchEmd = apiSearchAreaMap;
			apiSearchIndustryInfo.init({
				btnActivate: $('[data-btn-search-detail]'),
				searchWrapper: $('[data-wrapper="searchDetail"]'),
				searchDateRange: $('[data-wrapper="searchDetail"] [data-search-time]'),
				btnOk: $('[data-wrapper="searchDetail"] [data-btn-ok]'),
				btnClose: $('[data-wrapper="searchDetail"] [data-btn-close]')
			});
			
			apiIndustryInfo.init();

			z.formatDataReference('업종').done(function(refText) {
				$('.dashboard .reference').text(refText);
			});
		});
	});

});
