'use strict';
// Class definition

var apiSearchEmd;
var excelyn;
var apiPopulation = function() {
	var populationSexTypeArr = [
		'거주인구_남',
		'거주인구_여',
		'유동인구_남',
		'유동인구_여',
		'직장인구_남',
		'직장인구_여'
	];
	
	var populationSexTypeMap = {
		'거주인구_남' : 0,
		'거주인구_여' : 1,
		'유동인구_남' : 2,
		'유동인구_여' : 3,
		'직장인구_남' : 4,
		'직장인구_여' : 5
	};	
	
	var ageTypeArr = [
		'10대 미만',
		'10대',
		'20대',
		'30대',
		'40대',
		'50대',
		'60대'
	];
	
	var timeZoneTypeArr = [
		'00시 ~ 08시',
		'09시 ~ 12시',
		'13시 ~ 18시',
		'19시 ~ 23시'
	];
	
	var timeZoneTypeMap = {
		'00시 ~ 08시' : 0,
		'09시 ~ 12시' : 1,
		'13시 ~ 18시' : 2,
		'19시 ~ 23시' : 3
	};
	
	var checkedSearchCondition = {
		'population' : [],
		'gender'	 : [],
		'age'		 : [],
		'day'	     : [],
		'time'       : []
	};
	
	// 인구 추이 차트
	var chartPopulationAll = {
		init: function(param, searchDtl) {
			var self = this;
			var apexChart = '#chart_1_1';			
			
			self.$wrapper = $(apexChart).closest('[data-chart-wrapper]');			
			self.param = param;
			self.searchDtl = searchDtl;
			
			// 차트 초기화 퍼블리싱 코드 옮겨옴		
			var options = {
				series: [{
					name: '거주인구',
					data: [210, 788, 791]
				}, {
					name: '직장인구',
					data: [756, 636, 860]
				}, {
					name: '유동인구',
					data: [756, 636, 860]
				}],
				chart: {
					width: '100%',
					height: 550,
					type: 'line',
					stacked: false,
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
						}
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
								filename: '인구추이'
							}	
						}
					},
					zoom: {
						enabled: false,
					}
				},
				colors: ['#009dd7','#2eb7c4','#eab600'],
				stroke: {
					show: true,
					width: 4,
					dashArray: 0,
				},
				markers: {
					size: 8,
					colors: ['#009dd7', '#2eb7c4', '#eab600'],
					strokeColors: '#fff',
					strokeWidth: 2,
					strokeOpacity: 0.9,
					shape: "circle",
					radius: 2,
					offsetX: 0,
					offsetY: 0,
				},
				tooltip : {
					intersect: true,
					shared: false,
					y: {
						formatter: function (val) {
							return z.toComma(val) + '명';
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
					inverseOrder: false,
					offsetX: 0,
					offsetY: 0,
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
		        },
				dataLabels: {
					enabled: false
				},
				stroke: {
					show: true,
					width: 4,
				},
				xaxis: {
					categories: ['2018', '2019', '2020'],
					tooltip: {
						enabled: false
					}
				},
				yaxis: [{
					title: {
						text: '인구수'
					}
				}]				
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
						self.$wrapper.find('[data-sgg-nm]').text(param.sggnm);
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
		loadData: function() {
			var self = this;
			var param = {
					pnu: self.param.dongCd							
				};
			
			if(self.param.sggnm === ''){ //시전체 선택시(ex:서울시)
				param.jusoCd = 'sido'
			} else if(self.param.sggnm !== ''){
				if(self.param.dongnm == '전체'){
					param.jusoCd = 'sgg'
				} else {
					param.jusoCd = 'emd'
				}
			}
			
			if (self.searchDtl && self.searchDtl.startYMD) {
				param.startYMD = self.searchDtl.startYMD.substring(0,6);
				param.endYMD = self.searchDtl.endYMD.substring(0,6);
				param.timeBound = self.searchDtl.radioTimeBound
			}
			
			return z.xAsync('population', '인구유형_NEW', 'select', param, 'json').done(function(resp) {
				self.rawDataArr = resp;
			});
		},
		setBtnListener: function() {
		},
		loadNextObj: function(selected) {
			var self = this;
			var endYMD = '';
			
			switch (self.searchDtl.radioTimeBound) {
				case 'year':
					endYMD = selected + '12';
					break;
				case 'quarter':
					endYMD = moment(selected, 'YYYY.Q').endOf('quarter').format('YYYYMM');
					break;
				case 'month':					
					endYMD	 = moment(selected, 'YYYY.MM').endOf('month').format('YYYYMM');
					break;
				case 'half':
					if ('1' === selected.substr(5, 1)) {
						endYMD = selected.substr(0, 4) + '06';
					} else {
						endYMD = selected.substr(0, 4) + '12';
					}
					break;
			}
			self.searchDtl.endYMD = endYMD;	
			chartPopulationYear.init(self.param, self.searchDtl);
			chartPopulationAge.init(self.param, self.searchDtl);
			chartPopulationDayName.init(self.param, self.searchDtl);
		},	
		
		loadAxis: function() {			
			var self = this,
				rawDataArr = self.rawDataArr,
				xAxisArr = [],
				yAxisObj = [{
					title: {
						text: '인구수'
					},
					labels: {
						formatter: function(value) {
							return z.toComma(value) + '명';
						}
					}
				}];

			if (rawDataArr == null) return;
			
			rawDataArr = rawDataArr.sort(function(a, b) {
				if (a['년도'] < b['년도']) {
					return -1;
				}
				if (a['년도'] > b['년도']) {
					return 1;
				}
				return 0;
			});
			
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
			
			// 2. 기존 분양연도 컬럼 규칙에 맞도록 수정
			for (var i in rawDataArr) {
				var raw = rawDataArr[i],
					mmt = moment(raw['년도'], 'YYYYMM');
	
				switch (timeBound) {
					case 'month':
						raw['년도'] = raw['년도'] + '.' + raw['월'];
						break;
					case 'half':
						raw['년도'] = raw['년도'] + '.' + raw['반기'] + 'H';
						break;
					case 'quarter':
						raw['년도'] = raw['년도'] + '.' + raw['분기'] + 'Q';
						break;
				}
			}			
			self.diffTime = diffTime;
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
			 	rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr)),
				timeBound  = self.searchDtl.radioTimeBound,
				population = checkedSearchCondition.population,
				gender	   = checkedSearchCondition.gender,
				age		   = checkedSearchCondition.age;
			
			for(var p in population){
				var tempData = {
					name: population[p],
					data: Array.apply(null, Array(self.diffTime)).map(function() {return 0;})
				}
				
				
				for(var g in gender) {
					for(var a in age) {
						var columnStr = population[p] + '_' + gender[g] + age[a];
						for(var i in rawDataArr){
							for(var year in self.xAxisArr){
								if(self.xAxisArr[year] == rawDataArr[i]['년도']){
									tempData.data[year] += Number(rawDataArr[i][columnStr])
								}
							}
						}
					}
				}
				chartSeries.push(tempData)
			}
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = self.xAxisArr,
				yAxisArr = self.yAxisArr,
				excelData = [],
				excelOpt = {header: ['인구정보']};

			return result;
		}
	};

	// 성별 인구분포
	var chartPopulationYear = {
		init: function(param, searchDtl) {
			var self = this,
				apexChart1 = '#chart_2_1',
				apexChart2 = '#chart_2_2',
				apexChart3 = '#chart_2_3',
				endYMDText = "";
			
			self.$wrapper = $(apexChart1).closest('[data-chart-wrapper]').show();
			self.param = param;
			self.searchDtl = searchDtl;
			self.maxYearInt = parseInt(self.searchDtl.endYMD.substring(0,4));
			
			if (self.param.isBizdist) {
				self.$wrapper.find('[data-dong-nm]').text(param.bizdistnm);
			} else {
				self.$wrapper.find('[data-sgg-nm]').text(param.sggnm);
				self.$wrapper.find('[data-dong-nm]').text(param.dongnm);
			}
			
			switch (self.searchDtl.radioTimeBound) {
				case 'year':
					endYMDText = self.searchDtl.endYMD.substr(0,4);
					break;
				case 'half':
					endYMDText = self.searchDtl.endYMD.substr(0,4) + '.' + (parseInt(self.searchDtl.endYMD.substr(4,2)) / 6) + 'H';
					break;
				case 'quarter':
					endYMDText = self.searchDtl.endYMD.substr(0,4) + '.' + (parseInt(self.searchDtl.endYMD.substr(4,2)) / 3) + 'Q';
					break;
				case 'month':
					endYMDText = self.searchDtl.endYMD.substr(0,4) + '.' + self.searchDtl.endYMD.substr(4,2);
					break;
			}
			self.searchDtl.endYMDText = endYMDText;
			self.$wrapper.find('[data-last-year]').text(endYMDText);
			
			
			//검색조건에서 선택안된 인구유형 차트는 display:none 처리
			var population = checkedSearchCondition['population']
			
			if(!population.includes('거주인구')){
				$('#chart_2_1').css('display','none')
				$('#chart_2_1').next().css('display','none')
				
			}else{
				$('#chart_2_1').css('display','block')
				$('#chart_2_1').next().css('display','block')
			}
			
			if(!population.includes('직장인구')){
				$('#chart_2_2').css('display','none')
				$('#chart_2_2').next().css('display','none')
			}else{
				$('#chart_2_2').css('display','block')	
				$('#chart_2_2').next().css('display','block')
			}
			
			if(!population.includes('유동인구')){
				$('#chart_2_3').css('display','none')
				$('#chart_2_3').next().css('display','none')
			}else{
				$('#chart_2_3').css('display','block')
				$('#chart_2_3').next().css('display','block')
			}

			// 차트 초기화 퍼블리싱 코드 옮겨옴
			var options1 = {
				series: [0, 0],
				labels: ['남자','여자'],
				chart: {
					type: 'donut',
					width:'100%',
					height: 280,
				},
				title: {
					text: '거주인구',
					align: 'center',
					margin: 0,
					offsetX: 0,
					offsetY: 205,
					floating: true,
					style: {
						fontSize:  '14px',
						fontWeight:  'bold',
						fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
						color:  '#263238'
					},
				},
				colors: ['#009dd7', '#7fceeb'],
				stroke: {
					show: true,
					colors: '#009dd7',
					width: 1,
					dashArray: 0,
				},
				dataLabels: {
					enabled: false,
				},
				tooltip: {
					y: {
						formatter: function (val) {
							return z.toComma(val) + '명'
						}
					}
				},
				legend: {
					position: 'bottom',
					horizontalAlign: 'center',
					floating: false,
					fontSize: '10px',
					fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
					fontWeight: 400,
					offsetY: 8,
					markers: {
						width: 8,
						height: 8,
						radius: 12,
					},
				},
		};
			
		var options2 = {
			series: [0, 0],
			labels: ['남자','여자'],
			chart: {
				type: 'donut',
				width:'100%',
				height: 280,
			},
			title: {
				text: '직장인구',
				align: 'center',
				margin: 0,
				offsetX: 0,
				offsetY: 205,
				floating: true,
				style: {
					fontSize:  '14px',
					fontWeight:  'bold',
					fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
					color:  '#263238'
				},
			},
			colors: ['#2eb7c4', '#96dbe1'],
			stroke: {
				show: true,
				colors: '#2eb7c4',
				width: 1,
				dashArray: 0,
			},
			dataLabels: {
				enabled: false,
			},
			tooltip: {
				y: {
				formatter: function (val) {
					return z.toComma(val) + '명'
					}
				}
			},
			legend: {
				position: 'bottom',
				horizontalAlign: 'center',
				floating: false,
				fontSize: '10px',
				fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
				fontWeight: 400,
				offsetY: 8,
				markers: {
					width: 8,
					height: 8,
					radius: 12,
				},
			},
		};
			
		var options3 = {
			series: [0, 0],
			labels: ['남자','여자'],
			chart: {
				type: 'donut',
				width:'100%',
				height: 280,
			},
			title: {
				text: '유동인구',
				align: 'center',
				margin: 0,
				offsetX: 0,
				offsetY: 205,
				floating: true,
				style: {
					fontSize:  '14px',
					fontWeight:  'bold',
					fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
					color:  '#263238'
				},
			},
			colors: ['#eab600', '#f4da7f'],
			stroke: {
				show: true,
				colors: '#eab600',
				width: 1,
				dashArray: 0,
			},
			dataLabels: {
				enabled: false,
			},
			tooltip: {
				y: {
				formatter: function (val) {
					return z.toComma(val) + '명'
					}
				}
			},
			legend: {
				position: 'bottom',
				horizontalAlign: 'center',
				floating: false,
				fontSize: '10px',
				fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
				fontWeight: 400,
				offsetY: 8,
				markers: {
					width: 8,
					height: 8,
					radius: 12,
				},
			},
		};

			if (self.chart1) {
				self.chart1.destroy();
			}
			
			if (self.chart2) {
				self.chart2.destroy();
			}
			
			if (self.chart3) {
				self.chart3.destroy();
			}
			
			var chart1 = new ApexCharts($(apexChart1)[0], options1);
			var chart2 = new ApexCharts($(apexChart2)[0], options2);
			var chart3 = new ApexCharts($(apexChart3)[0], options3);
			
			self.chart1 = chart1;
			self.chart2 = chart2;  
			self.chart3 = chart3;  
			
			self.setBtnListener();
			
			chart1.render().then(function() {
				chart1.updateSeries([]);

				chart2.render().then(function() {
					chart2.updateSeries([]);
				
					chart3.render().then(function() {
						chart3.updateSeries([]);
				
						if (self.param) {
							self.loadData().done(function(resp) {
								self.loadAxis();
								self.updateData();
							});
						};
					});
				});	
			}).catch(error => console.log(error));
		},
		
		loadAxis: function() {
			var self = this;
			var rawDataArr = self.rawDataArr;
		
			if (rawDataArr == null) return;
			rawDataArr = rawDataArr.sort(function(a, b) {
				if (a['년도'] < b['년도']) {
					return -1;
				}
				if (a['년도'] > b['년도']) {
					return 1;
				}
				return 0;
			});
		},
		
		hide: function() {
			var self = this;		
			if (self.$wrapper) {
				self.$wrapper.hide();
			}
		},
		setBtnListener: function() {			
		},
		loadData: function() {
			//chart_1에서 조회된 결과중 가장 마지막 기간만 조회 함(1년,1분기,1반기,1개월)
			var self = this;			
			var endYMD = moment(self.searchDtl.endYMD);
			var param = {
				pnu: self.param.dongCd,					
				endYMD 		: endYMD.format('YYYYMM'),
				timeBound   : self.searchDtl.radioTimeBound,
				chartType   : 'donut'
			};
			
			
			if(self.param.sggnm === ''){ //시전체 선택시(ex:서울시)
				param.jusoCd = 'sido'
			}else if(self.param.sggnm !== ''){
				if(self.param.dongnm == '전체'){
					param.jusoCd = 'sgg'
				}else{
					param.jusoCd = 'emd'
				}
			}
			
			switch(self.searchDtl.radioTimeBound){
				case "year" :
					var tmp = endYMD.clone();
					param.startYMD = tmp.add(-1,'year').add(1,'month').format('YYYYMM');
					break;
				case "half" :
					var tmp = endYMD.clone();
					param.startYMD = tmp.add(-2,'quarter').add(1,'month').format('YYYYMM')
					break;
				case "quarter" :
					var tmp = endYMD.clone();
					param.startYMD = tmp.add(-1,'quarter').add(1,'month').format('YYYYMM')
					break;	
				case "month" :
				    param.startYMD = endYMD.subtract(1,'month').format('YYYYMM')
			}
			
			return z.xAsync('population', '인구유형_NEW', 'select', param, 'json').done(function(resp) {
				self.rawDataArr = resp;
			});
		},		
	
		// 데이터 정제 후에 updateOptions, updateSeries 호출
		updateData: function(chart) {
			var self = this;
			var chartOptions = {};
			var chartSeries1 = [];
			var chartSeries2 = [];
			var chartSeries3 = [];
			var population = checkedSearchCondition.population
			
			for(var i in population){
				switch(population[i]){
					case '거주인구' :
						self.updateDataByYear(chartOptions, chartSeries1, '거주인구');
						break;
					case '직장인구' :
						self.updateDataByYear(chartOptions, chartSeries2, '직장인구');
						break;	
					case '유동인구' :
						self.updateDataByYear(chartOptions, chartSeries3, '유동인구');
						break;
				}
			}
			
			self.chart1.updateSeries(chartSeries1);			
			self.chart2.updateSeries(chartSeries2);
			self.chart3.updateSeries(chartSeries3);
		},
		
		updateDataByYear: function(chartOptions, chartSeries, popDiv) {
			var self = this;
			var maleCnt 	   = 0;
			var femaleCnt 	   = 0;
			var totalPeopleCnt = 0;
			var malePercent    = 0;
			var femalePercent  = 0;
			var maleStr = '';
			var femaleStr = '';			
			
			if(self.rawDataArr.length != 0){
				var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));
				var raw 	= rawDataArr[0];
				var pop 	= checkedSearchCondition.population
				var gender 	= checkedSearchCondition.gender
				var age 	= checkedSearchCondition.age
			
				for(var r in rawDataArr){
					var raw = rawDataArr[r];
					for(var g in gender){
						for(var a in age){
							var columnStr = popDiv + '_' + gender[g] + age[a]
							if(raw[columnStr] == 'undefined' || isNaN(raw[columnStr]) || raw[columnStr] == '')
								continue;
							
							if(gender[g] == '남'){
								
								maleCnt += parseFloat(raw[columnStr])
							}
							if(gender[g] == '여'){
								femaleCnt += parseFloat(raw[columnStr])
							}
						}
					}
				}
			}
			
			//퍼센트계산
			totalPeopleCnt = parseInt(maleCnt) + parseInt(femaleCnt);
			malePercent = totalPeopleCnt == 0 ? 0 : Math.round((maleCnt / totalPeopleCnt) * 100);
			femalePercent = totalPeopleCnt == 0 ? 0 : Math.round((femaleCnt / totalPeopleCnt) * 100);				
			
			switch(popDiv){
				case '거주인구' :
					if(malePercent > femalePercent){
						$('#pop_label').text('남자');
						$('#pop_data').text(malePercent + '%');
					}else{
						$('#pop_label').text('여자');
						$('#pop_data').text(femalePercent + '%');
					}
					break;
				case '직장인구' :
					if(malePercent > femalePercent){
						$('#work_label').text('남자');
						$('#work_data').text(malePercent + '%');
					}else{
						$('#work_label').text('여자');
						$('#work_data').text(femalePercent + '%');
					}
					break;
				case '유동인구' :
					if(malePercent > femalePercent){
						$('#move_label').text('남자');
						$('#move_data').text(malePercent + '%');
					}else{
						$('#move_label').text('여자');
						$('#move_data').text(femalePercent + '%');
					}
					break;	
			}
			chartSeries.push(parseInt(parseFloat(maleCnt)))
			chartSeries.push(parseInt(parseFloat(femaleCnt)))
			
		},
		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = self.xAxisArr,
				yAxisArr = self.yAxisArr,
				excelData = [],
				excelOpt = {header: ['인구정보']};

			return result;
		}
	};	
	
	// 연령별 인구분포
	var chartPopulationAge = {		
		init: function(param, searchDtl) {
			var self = this;
			self.apexChart = '#chart_3_1';
			self.tableSelector = '#table_3_1';
			self.$wrapper = $(self.apexChart).closest('[data-chart-wrapper]').show();				
			self.$sectionWrapper = $(self.apexChart).closest('[data-chart-wrapper]');
			self.param = param;
			self.searchDtl = searchDtl;
			
			//populationSexTypeArr 에 상세검색에서 선택된 조회조건으로 차트 name 생성시작---------------------------------------------------------------------------
			if(self.searchDtl != undefined) {
				var population = checkedSearchCondition.population;
				var gender = checkedSearchCondition.gender;
				var checkedPopulationGenderArr = [];
				
				for(var p in population){
					for(var g in gender){
						checkedPopulationGenderArr.push(population[p] + '_' + gender[g])
					}
				}
				self.populationSexArr = $.extend(true, [], checkedPopulationGenderArr);
				self.populationSexMap = $.extend(true, {}, populationSexTypeMap);
			}
			
			self.isSgg = (! param) || ('emd' !== param.jusoCd);
			if (param && param.isBizdist) {
				self.isSgg = false;
			}		
						
			self.$wrapper.find('[data-sgg-nm]').text('');
			self.$wrapper.find('[data-dong-nm]').text('');
			self.$wrapper.find('[data-last-year]').text('');
			self.setBtnListener();
			
			if (self.param) {
				self.diffYear = 4;
				self.maxYearInt = parseInt(self.searchDtl.endYMD.substring(0,4));
				self.minYearInt = self.maxYearInt - self.diffYear + 1;
		
				if (self.param.isBizdist) {
					self.$wrapper.find('[data-dong-nm]').text(param.bizdistnm);
				} else {
					self.$wrapper.find('[data-sgg-nm]').text(param.sggnm);
					self.$wrapper.find('[data-dong-nm]').text(param.dongnm);
				}
				self.$wrapper.find('[data-last-year]').text(self.searchDtl.endYMDText);
				
				switch(self.searchDtl.radioTimeBound){
					case 'year' :
						self.$sectionWrapper.find('[data-pre-section]').text('년');
						break;
					case 'half' :
						self.$sectionWrapper.find('[data-pre-section]').text('반기');
						break;
					case 'quarter' :
						self.$sectionWrapper.find('[data-pre-section]').text('분기');
						break;
					case 'month' :
						self.$sectionWrapper.find('[data-pre-section]').text('월');
						break;
				}
				
				self.loadData().done(function(resp) {
					self.loadAxis();
					self.updateData();
				});
			}
			
			if (self.chart) {
				self.chart.destroy();
			}
		},
		
		hide: function() {
			var self = this;
			if (self.$wrapper) {
				self.$wrapper.hide();
				self.$wrapper.find(self.tableSelector).hide();
			}
		},
			
		setBtnListener: function() {
		},
		
		loadData: function() {
			//chart_1에서 조회된 결과중 가장 마지막 기간만 조회 함(1년,1분기,1반기,1개월)
			var self = this;			
			var endYMD = moment(self.searchDtl.endYMD);
			var param = {
				pnu: self.param.dongCd,					
				endYMD 		: endYMD.format('YYYYMM'),
				timeBound   : self.searchDtl.radioTimeBound,
				chartType   : 'donut',
				pch : 'pch'
			};
			
			
			if(self.param.sggnm === ''){ //시전체 선택시(ex:서울시)
				param.jusoCd = 'sido'
			}else if(self.param.sggnm !== ''){
				if(self.param.dongnm == '전체'){
					param.jusoCd = 'sgg'
				}else{
					param.jusoCd = 'emd'
				}
			}
			
			switch(self.searchDtl.radioTimeBound){
				case "year" :
					var tmp = endYMD.clone();
					param.startYMD = tmp.add(-1,'year').add(1,'month').format('YYYYMM');
					break;
				case "half" :
					var tmp = endYMD.clone();
					param.startYMD = tmp.add(-2,'quarter').add(1,'month').format('YYYYMM')
					break;
				case "quarter" :
					var tmp = endYMD.clone();
					param.startYMD = tmp.add(-1,'quarter').add(1,'month').format('YYYYMM')
					break;	
				case "month" :
					param.startYMD = endYMD.subtract(1,'month').format('YYYYMM')
			}
			
			return chartPopulationAll.loadData(true).done(function(resp) {
				self.rawDataArr = resp;					
			});
		},	
			
		loadCondition: function() {
		},

		loadAxis: function() {
			var self = this,
				xAxisArr = $.extend(true, [], self.populationSexArr);
				
				// 엑셀 저장용 정보로도 활용될 예정
				self.xAxisArr = xAxisArr;
		},

		// 데이터 정제 후에 updateOptions, updateSeries 호출
		updateData: function() {
			var self = this,
				chartOptions = {},
				chartSeries = [];
				
			// 이전 대비 데이터 가공 후 출력
			self.updateDataByAge(chartOptions, chartSeries);
			
			//부동산 114 요청으로 구간 비교 테이블 삭제
			//self.updateDataComparePrev();
			
			var options = {
				series: chartSeries,
				chart: {
					width: '135%',
					height: 250,
					type: 'bar',
					stacked: true,
					toolbar: {
						show: false,
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
				},
				plotOptions: {
					bar: {
						horizontal: true,
						borderRadius: 8
					},
				},
				stroke: {
					width: 1,
					colors: ['#fff']
				},
				dataLabels: { 	
					enabled: false
				},		
				tooltip: {
					y: {
						formatter: function (val) {
							return z.toComma(val) + '명'
						}
					}
				},
				xaxis: {
					categories: self.populationSexArr,
					labels : {
						formatter: function(val) {
							return z.toComma(val);
							}
					}					
				},
				yaxis: {						
					title: {
						text: undefined
					},
					labels: {
						formatter: function(value) {
							return value;
						}
					}
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
					inverseOrder: false,
					offsetX: 0,
					offsetY: 0,
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
			
			var chart = new ApexCharts($(self.apexChart)[0], options);			
			self.chart = chart;
			chart.render();
		},
			
		updateDataByAge: function(chartOptions, chartSeries) {
			var self = this,
				rawChartSeries = [];				
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));
			
			//서버 쿼리 결과를 년도별로 내림차순 정렬
			var rawDataArr = rawDataArr.sort(function (a, b) {
				return b.년도 - a.년도;
			});
			
			var population = checkedSearchCondition.population
			var gender = checkedSearchCondition.gender
			var age = checkedSearchCondition.age
			
			//default Array Object 생성
			for(var a in age){
				var ageName = '';
				
				switch(age[a]){
				case '00' :
					ageName = '10대미만';
					break;
				case '60' :
					ageName = '60대이상';
					break;
				default :
					ageName = age[a] + '대';
					break;
				}
				
				rawChartSeries.push({
					name : ageName,
					data : Array.apply(null, Array((gender.length * population.length))).map(function() {return 0;})
				});
			}
			
			for(var a in age){
				var dataArrIdx = 0
				for(var p in population){					
					for(var g in gender){
						var columnStr = population[p] + '_' + gender[g] + age[a];
						var pplCnt = 0
						
						for(var r in rawDataArr){
							if(rawDataArr[r][columnStr] != undefined){
								switch(self.searchDtl.radioTimeBound){
								case 'year' :
									var year = moment(self.searchDtl.endYMD).year();
									if(rawDataArr[r]['년도'] == year){		
										pplCnt += parseInt(rawDataArr[r][columnStr])
									}
									break;
								case 'half' :
									var year = moment(self.searchDtl.endYMD).year();
									var quarter =  moment(self.searchDtl.endYMD).quarter();
									var half = quarter <= 2 ? 1 : 2
									if(rawDataArr[r]['년도'] == year && rawDataArr[r]['반기'] == half){
										pplCnt += +parseFloat(rawDataArr[r][columnStr]).toFixed(2)
									}
									break;
								case 'quarter' :
									var year = moment(self.searchDtl.endYMD).year();
									var quarter = moment(self.searchDtl.endYMD).quarter();
									if(rawDataArr[r]['년도'] == year && rawDataArr[r]['분기'] == quarter){
										pplCnt += +parseFloat(rawDataArr[r][columnStr]).toFixed(2)
									}
									break;
								case 'month' : 
									var year = moment(self.searchDtl.endYMD).year();
									var month = moment(self.searchDtl.endYMD).month() + 1;
									if(rawDataArr[r]['년도'] == year && rawDataArr[r]['월'] == month){
										pplCnt += +parseFloat(rawDataArr[r][columnStr]).toFixed(2)
									}
									break;
								}
							}
						}
						rawChartSeries[a].data[dataArrIdx] = parseInt(pplCnt)
						dataArrIdx++;
					}
				}
			}
			for(var idx in rawChartSeries){
				chartSeries.push(rawChartSeries[idx])
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
	
	// 최근 5년간 공급 추이 차트
	var chartPopulationDayName = {
		init: function(param, searchDtl) {
			var self = this;
			self.apexChart = '#chart_4_1';
			self.$wrapper = $(self.apexChart).closest('[data-chart-wrapper]');
			self.param = param;
			self.searchDtl = searchDtl;

			// 차트 초기화 퍼블리싱 코드 옮겨옴
			var options = {
				series: [{
					name: '요일',
	                data: [563, 577, 96, 370, 120, 370, 120]
	            }],
				chart: {
					height: 220,
					type: 'bar',
					zoom: {
						enabled: false
					},
			        toolbar: {
			            show: false,
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
						columnWidth: '90%'
					}
				},
				dataLabels: { 	
					enabled: false
				},
				stroke: {
					width: 1,
					colors: ['#fff']
				},
				fill: {
					opacity: 1
				},
				xaxis: {
					categories: []
				},
				colors: ["#7ed0f3", "#4b8eef", "#ff6f38", "#dcdcde", '#00ff00', "#1cdcde", '#40ff00'],
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
			        inverseOrder: false,
			        offsetX: 0,
			        offsetY: 0,
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
			            offsetY: 30
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
			
			var chart = new ApexCharts($(self.apexChart)[0], options);
			self.chart = chart;
			self.setBtnListener();

			chart.render().then(function() {
				chart.updateSeries([]);
				
				if (self.param) {
					self.diffYear = 5;
					self.maxYearInt = moment(self.searchDtl.endYMD,'YYYY').format('YYYY')
					self.minYearInt = self.maxYearInt - self.diffYear + 1;
			
					if (self.param.isBizdist) {
						self.$wrapper.find('[data-dong-nm]').text(param.bizdistnm);
					} else {
						self.$wrapper.find('[data-sgg-nm]').text(param.sggnm);
						self.$wrapper.find('[data-dong-nm]').text(param.dongnm);
					}
					self.$wrapper.find('[data-last-year]').text(self.maxYearInt);
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
			self.$wrapper.find('.clickYears').children('span').off('click').on('click', function(){
				var $this = $(this),
					$list = $(this).siblings('span').removeClass('on');
					
				$this.addClass('on');
				self.loadNextObj(self.xAxisArr[parseInt($this.attr('data-idx'))]);
				self.$wrapper.find('[data-last-year]').text(self.xAxisArr[parseInt($this.attr('data-idx'))]);
			});
		},
		
		loadNextObj: function(year) {
			var self = this;
			self.param.endYYYY = year;
			self.param.selday = 1
			chartPopulationTimeZone.init(self.param, self.searchDtl);			
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
				startYM = '',
				endYM = '';
			
			var timeBound = self.searchDtl.radioTimeBound;
			var endYMD = moment(self.searchDtl.endYMD);
			var diffBounceTime = 5;
				
			var	param = {
					pnu: self.param.dongCd,	
					startYMD : moment(self.searchDtl.endYMD,'YYYY').subtract(4,'year').startOf('year').format('YYYY'),					
					endYMD : endYMD.clone().format('YYYY'),					
			};
			
			if(self.param.sggnm === ''){ //시전체 선택시(ex:서울시)
				param.jusoCd = 'sido'
			}else if(self.param.sggnm !== ''){
				if(self.param.dongnm == '전체'){
					param.jusoCd = 'sgg'
				}else{
					param.jusoCd = 'emd'
				}
			}
			KTApp.blockPage({message: '잠시 기다려 주십시오'});
			return z.xAsync('population', '유동인구_요일별', 'select', param, 'json').done(function(resp) {
				KTApp.unblockPage();	
			}).done(function(resp) {
				self.rawDataArr = resp;
			});
		},		
		loadCondition: function() {
		},
		loadAxis: function() {
			var self = this,
				startYM = moment(self.searchDtl.endYMD,'YYYY').subtract(4,'year').startOf('year').format('YYYY'),				
				rawDataArr = self.rawDataArr,
				dayNameMap = self.dayNameTypeMap,
				xAxisArr = [],
				tableHeaderArr = [],
				yAxisObj = {
					labels: {
						formatter: function(value) {
							return z.toComma(value);
						}
					}					
				};
			
			var endYMD = moment(self.searchDtl.endYMD);
			var timeBound = self.searchDtl.radioTimeBound;
			var diffBounceTime = 5;
			
			switch (timeBound) {
				case 'year':
				case 'quarter':
				case 'month':
				case 'half':
					for(var i = 1; i <= diffBounceTime ; i++){
						xAxisArr.push(moment(self.searchDtl.endYMD).subtract(diffBounceTime - i,'year').format('YYYY'))							
					}
					break;
				case 'custom':
					tableHeaderArr.push('총인구수');
					break;
			}
		
			if (rawDataArr == null) return;
			rawDataArr = rawDataArr.sort(function(a, b) {
				if (a['년도'] < b['년도']) {
					return -1;
				}
				if (a['년도'] > b['년도']) {
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

			self.updateDataByDayName(chartOptions, chartSeries);
			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);
			
			// 마지막 구간 바로 실행
			self.$wrapper.find('.clickYears').children('span').last().click();
		},
		
		updateDataByDayName: function(chartOptions, chartSeries) {
			var self = this,
				dayNameMap = self.dayNameTypeMap,
				dayNameArr = self.dayNameTypeArr,
				xAxisArr = self.xAxisArr,
				prevData;

			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));
			var gender 	= checkedSearchCondition.gender;
			var day		= checkedSearchCondition.day;
					
			for(var d in day){
				prevData = {
					name : day[d],
					data : []
				}
				chartSeries.push(prevData);
				
				for (var j = 0; self.diffYear > j; ++j) {
					prevData.data.push(0);
				}
			}
			
			for(var c in chartSeries){
				var chartDay = chartSeries[c].name;
				
				for(var g in gender){
					for(var d in day){
						var columnStr = gender[g] + '_' + day[d] + '총계';
						
						for (var i in rawDataArr) {
							var raw = rawDataArr[i];
							
							for(var x in xAxisArr){
								if(raw['년도'] == xAxisArr[x] && chartDay == day[d]){									
									chartSeries[c].data[x] += parseInt(raw[columnStr]);
								}
							}
						}
					}
				}
			}
		
			// 합산 이후에는 모든 데이터 소수점 2자리까지 출력
			for (var i in chartSeries) {
				var series = chartSeries[i];
				
				for (var j in series.data) {
					series.data[j] = Math.floor(100 * series.data[j]) / 100;
				}
			}
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = self.xAxisArr,
				yAxisArr = self.yAxisArr,
				excelData = [],
				excelOpt = {header: ['요일별 유동인구']};
			return result;
		}
	};	
	
	// 유동인구 + 시간대 공급 추이 차트
	var chartPopulationTimeZone = {
		init: function(param, searchDtl) {
			var self = this;
			
			self.apexChart = '#chart_5_1';
			self.$wrapper = $(self.apexChart).closest('[data-chart-wrapper]');
			self.$dayWrapper = $('[data-wrapper="clickDays"]');
			self.param = param;
			self.searchDtl = searchDtl;
			self.timeZoneArr = timeZoneTypeArr;
			self.timeZoneMap = timeZoneTypeMap;
			
			// 차트 초기화 퍼블리싱 코드 옮겨옴
			var options = {
				series: [{					
	                data: [563, 577, 96, 370]
	            }],
				chart: {
					height: 200,
					type: 'bar',
					zoom: {
						enabled: false
					},
			        toolbar: {
			            show: false,
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
						columnWidth: '70%'
					}
				},
				dataLabels: { 	
					enabled: false
				},
				stroke: {
					width: 1,
					colors: ['#fff']
				},
				fill: {
					opacity: 1
				},
				xaxis: {
					categories: []
				},
				colors: ["#7ed0f3", "#4b8eef", "#ff6f38", "#dcdcde"],
			    legend: {
			        show: false,
					showForSingleSeries: true,
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
			        offsetY: 0,
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
			            offsetY: 30
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
			
			var chart = new ApexCharts($(self.apexChart)[0], options);
			self.chart = chart;
			
			if (self.$dayWrapper.children('span')) {
				self.$dayWrapper.children('span').remove();
			}
			
			var selectedDays = checkedSearchCondition.day;
			
			for (var i = 0; i < selectedDays.length; ++i) {
				var text = selectedDays[i]
				var daysList = '';
				var dayNum = 0;
				
				switch(text){
					case "월" : 
						dayNum = 2;
						break;
					case "화" :
						dayNum = 3;
						break;
					case "수" : 
						dayNum = 4;
						break;
					case "목" : 
						dayNum = 5;
						break;
					case "금" : 
						dayNum = 6;
						break;
					case "토" : 
						dayNum = 7;
						break;
					case "일" : 
						dayNum = 1;
						break;	
				}
				
				if(self.param.selday == dayNum){
					daysList = '<span style="margin:0 auto; text-align:center" class="on">' + text + '</span>';
				}else{
					daysList = '<span style="margin:0 auto; text-align:center">' + text + '</span>';
				}
				
				$(daysList).appendTo(self.$dayWrapper);
			}

			self.setBtnListener();

			chart.render().then(function() {
				chart.updateSeries([]);
				
				if (self.param) {
					self.diffYear = 5;
					self.maxYearInt = moment(self.searchDtl.endYMD,'YYYY').format('YYYY')
					self.minYearInt = self.maxYearInt - self.diffYear + 1;
			
					if (self.param.isBizdist) {
						self.$wrapper.find('[data-dong-nm]').text(param.bizdistnm);
					} else {
						self.$wrapper.find('[data-sgg-nm]').text(param.sggnm);
						self.$wrapper.find('[data-dong-nm]').text(param.dongnm);
					}
					self.$wrapper.find('[data-last-year]').text(self.param.endYYYY.substring(0,4));
					self.loadData().done(function(resp) {
						self.loadAxis();
						self.updateData();
					});
				}
			});
		},
		
		setBtnListener: function() {
			var self = this;
			
			$(self.apexChart).off('click', '.btn-xaxis').on('click', '.btn-xaxis', function(evt) {
				self.loadNextObj($(evt.target).next('text').find('title').text());
			});

			$(self.apexChart).off('click', '.apexcharts-xaxis-label').on('click', '.apexcharts-xaxis-label', function(evt) {				
				self.loadNextObj($(evt.target).text());
			});
		
						
			self.$wrapper.find('.clickYears').children('span').off('click').on('click', function(){
				var $this = $(this),
					$list = $(this).siblings('span').removeClass('on');
												
				var selectDay = 0;
				
				switch($this.text()){
					case "월" :
						selectDay = 2
						break;
					case "화" :
						selectDay = 3
						break;
					case "수" :
						selectDay = 4
						break;
					case "목" :
						selectDay = 5
						break;
					case "금" :
						selectDay = 6
						break;	
					case "토" :
						selectDay = 7
						break;	
					case "일" :
						selectDay = 1
						break;	
				}
				
				self.param.selday = selectDay;
				self.param.selfSelectDay = selectDay;
				self.init(self.param, self.searchDtl);
			});
		},
		
		loadNextObj: function(timeZone) {
			var self = this,
				$chart = $(self.apexChart);
		},
		// x,y 라벨에 버튼 추가 api 가 없어서 배경 객체를 추가하는 방식 
		addAxisBackground: function(timeZone) {
			var self = this,
				$chart = $(self.apexChart);
			// 선택된 라벨 css class 수정
			$chart.find('.apexcharts-xaxis-label').removeClass('xaxis-selected');

			if (timeZone) {
				$chart.find('.apexcharts-xaxis-label:contains("' + timeZone + '")').addClass('xaxis-selected');
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
			var self = this;
			var time = checkedSearchCondition.time;
			var timeArr = []
			var	param = {
				pnu: self.param.dongCd,
				startYMD : self.param.endYYYY.substring(0,4),
				selday : self.param.selday === undefined ? 1 : self.param.selday
			};
			
			if(time.length < 4){
				for(var i in time){
					if(time[i] == '0008'){
						timeArr.push('0');
					}else if(time[i] == '0912'){
						timeArr.push('1');
					}else if(time[i] == '1318'){
						timeArr.push('2');
					}else if(time[i] == '1923'){
						timeArr.push('3');
					}
				}
				param.selTime = timeArr;
			}
			
			KTApp.blockPage({message: '잠시 기다려 주십시오'});
			return z.xAsync('population', '유동인구_시간대별', 'select', param, 'json').done(function(resp) {
				KTApp.unblockPage();	
			}).done(function(resp) {
				self.rawDataArr = resp;
			});
		},		
		loadCondition: function() {
		},
		loadAxis: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				timeZoneMap = self.timeZoneMap,
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
			
			if (rawDataArr == null) return;
			
			// 엑셀 저장용 정보로도 활용될 예정
			self.xAxisArr = xAxisArr;
			self.yAxisObj = yAxisObj;
		},
		// 데이터 정제 후에 updateOptions, updateSeries 호출
		updateData: function() {
			var localTimeZoneArr = []
			var time = checkedSearchCondition.time;
			
			for(var i in time){
				switch(checkedSearchCondition.time[i]){
					case '0008' : 
						localTimeZoneArr.push('00시 ~ 08시');
						break;
					case '0912' :
						localTimeZoneArr.push('09시 ~ 12시');
						break;
					case '1318' :
						localTimeZoneArr.push('13시 ~ 18시');
						break;
					case '1923' :
						localTimeZoneArr.push('19시 ~ 23시');
						break;			
				}
			}
			
			var self = this,
				chartOptions = {
					xaxis: {
						categories: localTimeZoneArr
					},
					yaxis: self.yAxisObj
				},
				chartSeries = [];

			self.updateDataByTimeZone(chartOptions, chartSeries);
			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);			
		},
		
		updateDataByTimeZone: function(chartOptions, chartSeries) {
			var self = this
			var timeZoneMap = self.timeZoneMap
			var timeZoneArr = self.timeZoneArr
			var time = checkedSearchCondition.time;
			var gender = checkedSearchCondition.gender;
			var prevData;

			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));

			prevData = {	
				name : ['유동인구'],
				data : Array.apply(null, Array(time.length)).map(function() {return 0;})
			};

			chartSeries.push(prevData);
			
			for(var r in rawDataArr){
				var row = rawDataArr[r];
				for(var t in time){
					for(var g in gender){
						var columnStr = gender[g] + '_' + time[t]
						prevData.data[t] += isNaN(parseFloat(row[columnStr])) ? 0 : parseFloat(row[columnStr]);
					}
				}
			}
			
			// 합산 이후에는 모든 데이터 소수점 2자리까지 출력
			for (var i in chartSeries) {
				var series = chartSeries[i];
				for (var j in series.data) {
					series.data[j] = Math.floor(100 * series.data[j]) / 100;
				}
			}
		}
	}  
	
	// 연령별 인구정보 추이 데이터
	var tablePopulationAge = {
		init: function(param, searchDtl) {
			var self = this;

			self.param = param;
			self.searchDtl = searchDtl;
			self.$table = $('#table_6_1');
			self.$thead = self.$table.find('thead');
			self.$tbody = $('#tbody_6_1').html('');

			self.diffYear = 10;
			self.maxYearInt = moment().year();
			self.minYearInt = self.maxYearInt - self.diffYear + 1;
			self.startYMD = null;
			self.ageArr = ageTypeArr
			self.populationSexArr = populationSexTypeArr;
			
			if (self.searchDtl && self.searchDtl.startYMD) {
				self.startYMD = self.searchDtl.startYMD;
				self.endYMD = self.searchDtl.endYMD;
				
				var start = moment(self.startYMD, 'YYYYMMDD'),
					end = moment(self.endYMD, 'YYYYMMDD');
					
				self.diffYear = end.diff(start, 'years') + 1;
				self.maxYearInt = parseInt(end.format('YYYY'));
				self.minYearInt = parseInt(start.format('YYYY'));
			}
		
			self.dongArr = [];
			self.sidoArr = [];
			self.isSgg = (! param) || ('emd' !== param.jusoCd);
			
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
				self.updateData();
			});
		},
		
		updateData : function(){
			var self = this;
			var rowDataArr = self.rawDataArr;
			var searchTime = self.searchTime;
			var dongArr = (self.param.sidonm == '전국' ? self.sidoArr : self.dongArr);
			var resultArr = [];
			var population = checkedSearchCondition.population;						
			var age = checkedSearchCondition.age;
			var gender = checkedSearchCondition.gender;						
			var tmpl = Handlebars.compile($('#tmplTablePopulationAge').html());
			var popMiddleSum = [];
			var genderAgeMiddleSum = [];
			
			//구분1 타이틀(인구유형_성별) 리스트 추출
			var respPList = [];
			for(var p in population){
				respPList.push(population[p])
			}
			
			var respGList = [];
			for(var t in gender){
				respGList.push(gender[t])
			}
			
			var respAList = [];
			for(var a in age){
				var ageName = '';
				switch(age[a]){
				case '00' :
					ageName = '10대미만';
					break;
				case '60' :
					ageName = '60대이상';
					break;
				default :
					ageName = age[a] + '대';
					break;
				}
				respAList.push(ageName)
			}
			
			//resp데이터에서 가져올 컬럼리스트 추출
			var respColumnName = [];
			for(var p in population){			
				for(var g in gender){
					for(var a in age){
						respColumnName.push(population[p] + '_' + gender[g] + age[a])
					}
				}
			}
			
			//self.diffYear -- 이숫자만큼 데이터 배열에 push해야함
			var row = {
				dongnm: self.isSgg ? self.param.sidonm : self.param.sggnm,
				data: Array.apply(null, Array(respColumnName.length)).map(function() {
					return Array.apply(null, Array(self.diffTime)).map(function() {return 0;});
				})
			};
			
			// 2. 1번 형식대로 데이터 입력
			for (var i in dongArr) {
				var dongData = $.extend(true, {}, row);
				dongData.dongnm = dongArr[i];
				resultArr.push(dongData);
			}
			
			for(var r in rowDataArr){
				var respDongNm = (self.isSgg ? (self.param.sidonm == '전국' ? rowDataArr[r].sidonm : rowDataArr[r].sggnm) : rowDataArr[r].dongnm);
				for(var i in resultArr){
					var dongNm = resultArr[i].dongnm
					if(respDongNm == dongNm){
						var data = resultArr[i].data;
						for(var c in respColumnName){
							for(var s in searchTime){
								if(rowDataArr[r]['년도'] == searchTime[s]){
									var columnStr = respColumnName[c];
									var peopleCount = 0
									if(!isNaN(rowDataArr[r][columnStr])){
										peopleCount = +rowDataArr[r][columnStr]
									}
									data[c][s] += parseInt(peopleCount)
								}
							}
						}
					}
				}
			}
			
			
			// 3. 각 줄에 대한 합산을 마지막 줄에 추가 > 처음 줄에 추가
			for (var i in resultArr) {
				var data = resultArr[i].data,
					sum = Array.apply(null, Array(self.diffTime)).map(function() {return 0;});
				
				for (var j in data) {
					var pgaRow = data[j];

					for (var k in pgaRow) {
						sum[k] += pgaRow[k];
					}
				}
			}
			
			// 4. 전체 데이터 합산을 맨 처음 줄에 추가
			var sumRow = $.extend(true, {}, row),
				sumRowData = sumRow.data;
			
			for (var i in resultArr) {
				var data = resultArr[i].data;
				
				for (var j in data) {
					for (var k in data[j]) {
						sumRowData[j][k] += data[j][k];
					}
				}
			}
			resultArr.unshift(sumRow);
	
			
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
			
			//인구유형별 중간계
			for (var i in resultArr) {				
				var data = resultArr[i].data
				var popMiddleSumCount = respAList.length * respGList.length
				var sum = Array.apply(null, Array(self.diffTime)).map(function() {return 0;});
				
				for (var j in data) {
					var pgaRow = data[j];
	
					for (var k in pgaRow) {
						sum[k] += +pgaRow[k];
					}
					
					if((parseInt(j) + 1) % popMiddleSumCount == 0){
						popMiddleSum.push(sum)
						sum = Array.apply(null, Array(self.diffTime)).map(function() {return 0;});
					}
				}
			}
			
			
			//성별 중간계
			for (var i in resultArr) {				
				var data = resultArr[i].data
				var ageCount = respAList.length;
				var sum = Array.apply(null, Array(self.diffTime)).map(function() {return 0;});
				var tempMiddleSum = [];
				
				for (var j in data) {
					var pgaRow = data[j];
	
					for (var k in pgaRow) {
						sum[k] += +pgaRow[k];
					}
					
					if((parseInt(j)+1) % ageCount == 0){
						genderAgeMiddleSum.push(sum)
						sum = Array.apply(null, Array(self.diffTime)).map(function() {return 0;});
					}
				}
			}
			
			var totalSum = []
			for(var i in resultArr){							
				var data = resultArr[i].data
				var sum = Array.apply(null, Array(self.diffTime)).map(function() {return 0;});
				
				for(var j in data){
					for(var k in data[j]){
						sum[k]+= +data[j][k];
					}
				}
				totalSum.push(sum)
			}
			
			// 5. 최종 결과 콤마
			for (var i in resultArr) {
				var data = resultArr[i].data;

				for (var j in data) {
					for (var k in data[j]) {
						if (0 === data[j][k]) {
							// 0 이면 - 로 치환
							data[j][k] = '-';
						} else {
							data[j][k] = z.toComma(data[j][k]);
						}
					}
				}
			}
			
			for (var i in totalSum) {
				var data = totalSum[i];

				for (var j in data) {
					if (0 === data[j]) {
						// 0 이면 - 로 치환
						data[j] = '-';
					} else {
						data[j] = z.toComma(data[j]);
					}
				}
			}
			
			for (var i in popMiddleSum) {
				var data = popMiddleSum[i];

				for (var j in data) {
					if (0 === data[j]) {
						// 0 이면 - 로 치환
						data[j] = '-';
					} else {
						data[j] = z.toComma(data[j]);
					}
				}
			}
			
			for (var i in genderAgeMiddleSum) {
				var data = genderAgeMiddleSum[i];

				for (var j in data) {
					if (0 === data[j]) {
						// 0 이면 - 로 치환
						data[j] = '-';
					} else {
						data[j] = z.toComma(data[j]);
					}
				}
			}
			
			self.resultArr = resultArr;
			respColumnName.unshift('<span></span>계');
							
			var genderRowspan = (respAList.length + 1)
			var populationRowspan = genderRowspan * respGList.length + 1
			var dongRowspan = (populationRowspan * respPList.length) + 1
									
			var firstLineArr = Array.apply(null, Array(dongRowspan)).map(function() {return false;});
			var classNameArr = Array.apply(null, Array(dongRowspan-1)).map(function() {return '';})
			classNameArr.unshift('total');
			classNameArr.push('tr-border');
			firstLineArr.unshift(true);
			
			//전체 총계 헬퍼
			var helperCount = 0;
			var dongIdxCount = 0;
			Handlebars.registerHelper("resultArrData", function(dongIdx, options){
				if(dongIdxCount < dongIdx){
					helperCount = 0;
					dongIdxCount = dongIdx;
				}
				var str = '';
				var currentData = self.resultArr[dongIdx].data[helperCount];
				for(var i = 0; i < currentData.length; i++){
					str += '<td style="text-align:right;">' + currentData[i] + '</td>'
				}
				helperCount++;
				return str;
			});
			
			//인구유형별 합계 helper
			var popMiddleSumCount = 0;
			Handlebars.registerHelper("popMiddleSumData", function(dongIdx, options){
				var str = '';
				var middleSumData = popMiddleSum[popMiddleSumCount];
				
				for(var i = 0; i < middleSumData.length; i++){								
					str += '<td style="text-align:right;">' + middleSumData[i] + '</td>';
				}
				popMiddleSumCount++;
				return str;
			});
			
			//연령별 합계 helper
			var genderAgeMiddleSumCount = 0;
			Handlebars.registerHelper("genderAgeMiddleSumData", function(dongIdx, options){
				var str = '';
				var middleSumData = genderAgeMiddleSum[genderAgeMiddleSumCount];
				
				for(var i = 0; i < middleSumData.length; i++){								
					str += '<td style="text-align:right;">' + middleSumData[i] + '</td>';
				}
				genderAgeMiddleSumCount++;
				return str;
			});
			
			
			self.$tbody.html('').append(tmpl({
				populationTypeArr	: respPList, 
				genderTypeArr		: respGList,
				ageTypeArr			: respAList,
				dataArr		 		: self.resultArr, 
				rowspan		 		: respAList.length, 
				dongRowspan			: dongRowspan,
				populationRowspan   : populationRowspan,
				genderRowspan		: genderRowspan,				
				classNameArr 		: classNameArr, 
				totalSum   			: totalSum,
				popMiddleSum		: popMiddleSum,
				genderAgeMiddleSum  : genderAgeMiddleSum,
				firstLineArr		: firstLineArr}));

			$('#tbody_6_1 .maintotal').click();
		},
		
		setBtnListener: function() {},
		loadData: function() {
			var self = this;
			var param = {
				pnu: self.param.isBizdist ? self.param.bizdistAdmCd : self.param.dongCd.substring(0,5),	
				endYMD : self.searchDtl.endYMD.substring(0,6),
				timeBound : self.searchDtl.radioTimeBound,					
			};
				
			if(self.param.sggnm === ''){ //시전체 선택시(ex:서울시)
				param.jusoCd = 'sido'
			} else if(self.param.sggnm !== ''){
					param.jusoCd = 'sgg'
			}
		
			var startYMD = moment(self.searchDtl.startYMD);
			switch(self.searchDtl.radioTimeBound){
				case "year" :
					param.startYMD = self.searchDtl.startYMD.substring(0,4) + '01';
					break;
				case "half" :
					var tmp = startYMD.clone();
					param.startYMD = tmp.add(1,'quarter').add(1,'month').format('YYYYMM');
					break;
				case "quarter" :
					var tmp = startYMD.clone();
					var startYMD = tmp.format('YYYYMM');
					param.startYMD = startYMD;
					break;	
				case "month" :
					var startYMD = self.searchDtl.endYMD.substring(0,6);
					break;
			}
			return z.xAsync('population', '인구유형_NEW', 'select', param, 'json').done(function(resp) {
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
					return 0;
				});
				
				for(var r in self.rawDataArr){
					var raw = self.rawDataArr[r];
					
					switch(self.searchDtl.radioTimeBound){
						case 'quarter' :
							raw['년도'] = raw['년도'] + '.' + raw['분기'] + 'Q' 
							break;
						case 'half' :
							raw['년도'] = raw['년도'] + '.' + raw['반기'] + 'H'
							break;
						case 'month' :
							var month = raw['월'].length < 2 ? '0' + raw['월'] : raw['월'];
							raw['년도'] = raw['년도'] + '.' + month
							break;	
					}
				}
				
				
				//char_6_1 헤더부분 셋팅부 시작---------------------------------------------------
				var startYMD = moment(self.searchDtl.startYMD),
					endYMD = moment(self.searchDtl.endYMD),
					timeBound = self.searchDtl.radioTimeBound,
					tableHeaderArr = [],
					diffTime = 0,
					tmpl = Handlebars.compile($('#tmplTablePopulationAge').html()),
					$tr = self.$thead.find('tr:first-child');
			
				switch (timeBound) {
					case 'year':
						diffTime = endYMD.diff(startYMD, 'years') + 1;
						
						var tmp = startYMD.clone();
						for (var i = 0; diffTime > i; ++i) {
							tableHeaderArr.push(tmp.format('YYYY'));
							tmp.add(1, 'year');
						}
						break;
					case 'quarter':
						diffTime = endYMD.diff(startYMD, 'quarters') + 1;
						
						var tmp = startYMD.clone();
						for (var i = 0; diffTime > i; ++i) {
							tableHeaderArr.push(tmp.format('YYYY.Q[Q]'));
							tmp.add(1, 'quarter');
						}
						break;
					case 'month':
						diffTime = endYMD.diff(startYMD, 'months') + 1;
		
						var tmp = startYMD.clone();
						for (var i = 0; diffTime > i; ++i) {
							tableHeaderArr.push(tmp.format('YYYY.MM'));
							tmp.add(1, 'month');
						}
						break;
					case 'half':
						diffTime = Math.floor(endYMD.diff(startYMD, 'quarters') / 2) + 1;
		
						var tmp = startYMD.clone();
						for (var i = 0; diffTime > i; ++i) {
							tableHeaderArr.push(tmp.format('YYYY.') + (6 > tmp.get('month') ? '1' : '2') + 'H');
							tmp.add(2, 'quarter');
						}
						break;
					case 'custom':
						tableHeaderArr.push('총인구수');
						break;
				}
			
				$tr.find('th[rowspan="1"]').remove();
				
			  	for(var h in tableHeaderArr){
					var $th = $('<th/>', {rowspan: '1', text: tableHeaderArr[h]});
					$tr.append($th);
				}
			  	
			  	self.searchTime = tableHeaderArr;
			  	self.diffTime = diffTime;
			  	//char_6_1 헤더부분 셋팅부 종료---------------------------------------------------
			});
		},
		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
			    selectedDongNm = self.param.dongnm;
			
			var fileLocationName = '';
			if ('전체' !== selectedDongNm) {
				if(self.isSgg){
					fileLocationName = self.param.dongnm;
				}else{
					fileLocationName = self.param.sggnm;
				}
			}else{
				fileLocationName = self.param.sidonm;
			}
			
			self.fileLocationName = fileLocationName;

			setTimeout(function() {
				var $table = self.$tbody.closest('table');
				var wsBody = XLSX.utils.table_to_sheet($table[0]);
				var jsonBody = XLSX.utils.sheet_to_json(wsBody, {header: 1});
				
				var mainlen = jsonBody[0].length;
				var sublen  = mainlen - 1;
				var sublen2  = mainlen - 2;	
				var area = '';
				var population = '';
				var population2 = '';
				for (var i in jsonBody) {
					var row = jsonBody[i];
					if(mainlen === row.length){
						area = row[0];
					}
					
					if(sublen === row.length){
						population = row[0];
					}
					
					if(sublen2 === row.length){
						population2 = row[0];
					}
					
					if(mainlen > row.length ){
						if(sublen == row.length){
							row.unshift(area);
						} else if(sublen2 == row.length){
							row.unshift(population);
							row.unshift(area);
						} else {
							row.unshift(population2);
							row.unshift(population);
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
	};	
	
	//공급추이 합산데이터(검색기간 조회조건 사용자설정 선택시{timeBound = custom})
	//--------------------------------------------------------------------------
	var tablePopulationAgeCustom = {			
		init: function(param, searchDtl) {
			var self = this;

			self.param = param;
			self.searchDtl = searchDtl;
			self.$table = $('#table_6_2');
			self.$thead = self.$table.find('thead');
			self.$tbody = $('#tbody_6_2').html('');
			
			self.diffYear = 10;
			self.maxYearInt = moment().year();
			self.minYearInt = self.maxYearInt - self.diffYear + 1;
			self.startYMD = null;
			self.ageArr = ageTypeArr
			self.populationSexArr = populationSexTypeArr;
			
			if (self.searchDtl && self.searchDtl.startYMD) {
				self.startYMD = self.searchDtl.startYMD;
				self.endYMD = self.searchDtl.endYMD;
				
				var start = moment(self.startYMD, 'YYYYMMDD'),
					end = moment(self.endYMD, 'YYYYMMDD');
					
				self.diffYear = end.diff(start, 'years') + 1;
				self.maxYearInt = parseInt(end.format('YYYY'));
				self.minYearInt = parseInt(start.format('YYYY'));
			}
			self.dongArr = [];
			self.isSgg = (! param) || ('emd' !== param.jusoCd);
			
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
			
			self.setBtnListener();
			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
			
		updateData : function(){
			var self = this;
			var rowDataArr = self.rawDataArr;
			var dongArr = self.dongArr;
			var resultArr = [];
			var population = checkedSearchCondition.population;						
			var age = checkedSearchCondition.age;
			var gender = checkedSearchCondition.gender;						
			var tmpl = Handlebars.compile($('#tmplTablePopulationAgeCustom').html());
			
			//구분1 타이틀(인구유형_성별) 리스트 추출
			var respPList = [];
			for(var p in population){
				respPList.push(population[p])
			}

			var respGList = [];
			for(var t in gender){
				respGList.push(gender[t])
			}
			
			var respAList = [];
			for(var a in age){
				var ageName = '';
				
				switch(age[a]){
				case '00' :
					ageName = '10대미만';
					break;
				case '60' :
					ageName = '60대이상';
					break;
				default :
					ageName = age[a] + '대';
					break;
				}
				
				respAList.push(ageName)
			}
			
			//resp데이터에서 가져올 컬럼리스트 추출
			var respColumnName = [];
			for(var p in population){			
				for(var g in gender){
					for(var a in age){
						respColumnName.push(population[p] + '_' + gender[g] + age[a])
					}
				}
			}
			
			//self.diffYear -- 이숫자만큼 데이터 배열에 push해야함
			var row = {
				dongnm: self.isSgg ? self.param.sidonm : self.param.sggnm,
				data: Array.apply(null, Array(population.length)).map(function() {
					return Array.apply(null, Array(1)).map(function() {return 0;});
				})
			};
			
			
			// 2. 1번 형식대로 데이터 입력
			for (var i in dongArr) {
				var dongData = $.extend(true, {}, row);
				dongData.dongnm = dongArr[i];
				resultArr.push(dongData);
			}
			
			for(var r in rowDataArr){
				var respDongNm = self.isSgg ? rowDataArr[r].sggnm : rowDataArr[r].dongnm
				for(var i in resultArr){
					var dongNm = resultArr[i].dongnm;
					var data = resultArr[i].data;
					
					if(respDongNm == dongNm){
						for(var p in population){
							var popNm = population[p]
							for(var g in gender){
								var genNm = gender[g]
								for(var a in age){
									var ageNm = age[a]
									var columnStr = popNm + '_' + genNm + ageNm;
									var peopleCount = 0
									if(!isNaN(rowDataArr[r][columnStr])){
										peopleCount = parseInt(rowDataArr[r][columnStr])
									}
									data[p][0] += peopleCount
								}
							}
						}
					}
				}
			}
			
			// 3. 각 줄에 대한 합산을 마지막 줄에 추가 > 처음 줄에 추가
			for (var i in resultArr) {
				var data = resultArr[i].data,
					sum = Array.apply(null, Array(1)).map(function() {return 0;});
				
				for (var j in data) {
					var pgaRow = data[j];

					for (var k in pgaRow) {
						sum[k] += pgaRow[k];
					}
				}
				data.unshift(sum);
			}
			
			// 4. 전체 데이터 합산을 맨 처음 줄에 추가
			var sumRow = $.extend(true, {}, row)
			sumRow.data = Array.apply(null, Array(respColumnName.length + 1)).map(function() {
				return Array.apply(null, Array(1)).map(function() {return 0;})})
			
			var sumRowData = sumRow.data;
			
			for (var i in resultArr) {
				var data = resultArr[i].data;
				
				for (var j in data) {
					for (var k in data[j]) {
						sumRowData[j][k] += data[j][k];
					}
				}
			}
			resultArr.unshift(sumRow);
	
			
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
			
			// 5. 최종 결과 소수점 반올림 후 3자리 콤마
			for (var i in resultArr) {
				var data = resultArr[i].data;

				for (var j in data) {
					for (var k in data[j]) {
						if (0 === data[j][k]) {
							// 0 이면 - 로 치환
							data[j][k] = '-';
						} else {
							data[j][k] = z.toComma(Math.round(data[j][k]));
						}
					}
				}
			}
			
			self.resultArr = resultArr;
		
			var populationTypeArr = $.extend(true,[],respPList);
			populationTypeArr.unshift('계');
			
			var dongRowspan = (populationTypeArr.length);
			
			self.$tbody.html('').append(tmpl({
				populationTypeArr	: populationTypeArr, 
				dataArr		 		: self.resultArr,
				dongRowspan			: dongRowspan
			}));
			
			
		},

		setBtnListener: function() {},
		loadData: function() {
			var self = this,
				param = {
					pnu: self.param.isBizdist ? self.param.bizdistAdmCd : self.param.dongCd,
					startYMD : self.searchDtl.startYMD.substring(0,6),					
					endYMD: self.searchDtl.endYMD.substring(0,6),
					timeBound : self.searchDtl.radioTimeBound					
				};
				
			
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
			
			var startYMD = moment(self.searchDtl.startYMD);
			switch(self.searchDtl.radioTimeBound){
				case "year" :
					param.startYMD = self.searchDtl.startYMD.substring(0,4) + '01'
					break;
				case "half" :
					var tmp = startYMD.clone();
					param.startYMD = tmp.add(1,'quarter').add(1,'month').format('YYYYMM')
					break;
				case "quarter" :
					var tmp = startYMD.clone();
					var startYMD = tmp.format('YYYYMM')
					param.startYMD = startYMD;
					break;	
				case "month" :
					var startYMD = self.searchDtl.endYMD.substring(0,6)
					break;
			}
			
			return z.xAsync('population', '인구차트', 'select', param, 'json').done(function(resp) {
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
					return 0;
				});
				
				for(var r in self.rawDataArr){
					var raw = self.rawDataArr[r];
					switch(self.searchDtl.radioTimeBound){
						case 'quarter' :
							raw['년도'] = raw['년도'] + '.' + raw['분기'] + 'Q' 
							break;
						case 'half' :
							raw['년도'] = raw['년도'] + '.' + raw['반기'] + 'H'
							break;
						case 'month' :
							var month = parseInt(raw['월'])
							raw['년도'] = raw['년도'] + '.' + month
							break;	
					}
				}
				
				
				//헤더부분 셋팅부 시작---------------------------------------------------
				var startYMD = moment(self.searchDtl.startYMD);
				var endYMD = moment(self.searchDtl.endYMD);
				var timeBound = self.searchDtl.radioTimeBound;
				var tableHeaderArr = ['총인구수'];
				var diffTime = 0;
				var tmpl = Handlebars.compile($('#tmplTablePopulationAge').html());
				var $tr = self.$thead.find('tr:first-child');
			
				$tr.find('th[rowspan="2"]').remove();
				
			  	for(var h in tableHeaderArr){
					var $th = $('<th/>', {text: tableHeaderArr[h]});
					$tr.append($th);
				}
			  	
			  	self.searchTime = tableHeaderArr;
			  	self.diffTime = diffTime;
			  	//헤더부분 셋팅부 종료---------------------------------------------------
			});
		},
		
		
		
		exportSheet: function() {
			var self = this,
			result = $.Deferred();
		
		setTimeout(function() {
			var $table = self.n.closest('table');
			var wsBody = XLSX.utils.table_to_sheet($table[0]);
			var jsonBody = XLSX.utils.sheet_to_json(wsBody, {header: 1});
				jsonBody[0][1] = '연도';
			var jsonMerge = jsonBody;
			var ws = XLSX.utils.json_to_sheet(jsonMerge, {skipHeader: true});

			result.resolve(ws);
			apiSearchEmd.addDownloadLog('추이');
			});
			return result;
		}
	};	
	
	//--------------------------------------------------------------------------
	
	// 시간대별 유동인구 데이터
	var tablePopulationDayName = {
		init: function(param, searchDtl) {
			var self = this;

			self.param = param;
			self.searchDtl = searchDtl;
			self.$table = $('#table_7_1');
			self.$thead = self.$table.find('thead');
			self.$tbody = $('#tbody_7_1').html('');
			self.$tablearea = $('[data-table-wrapper="table_7_1"]');

			self.diffYear = 10;
			self.maxYearInt = moment().year();
			self.minYearInt = self.maxYearInt - self.diffYear + 1;
			self.startYMD = null;
			self.ageArr = ageTypeArr
			self.populationSexArr = populationSexTypeArr;
			
			if (self.searchDtl && self.searchDtl.startYMD) {
				self.startYMD = self.searchDtl.startYMD;
				self.endYMD = self.searchDtl.endYMD;
				
				var start = moment(self.startYMD, 'YYYYMMDD'),
					end = moment(self.endYMD, 'YYYYMMDD');
					
				self.diffYear = end.diff(start, 'years') + 1;
				self.maxYearInt = parseInt(end.format('YYYY'));
				self.minYearInt = parseInt(start.format('YYYY'));
			}

			if(self.searchDtl && self.searchDtl.radioTimeBound){
				switch(self.searchDtl.radioTimeBound){
					case 'year' :
						self.$tablearea.css("display", "block");
					break;
					default:
						self.$tablearea.css("display", "none");
						return;
					break;
				}
			}	
			// 동 이름 목록 로딩
			self.dongArr = [];
			self.isSgg = (! param) || ('emd' !== param.jusoCd);
			
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
			
			self.setBtnListener();

			self.loadData().done(function(resp) {
				//self.updateDataByPopulationAge();
				self.updateData();
			});
		},
		
		updateData : function(){
			var self = this;
			var rowDataArr = self.rawDataArr;
			var searchTime = self.searchTime;
			var dongArr = self.dongArr;
			var resultArr = [];
			var day = checkedSearchCondition.day;
			var time = checkedSearchCondition.time;
			var gender = checkedSearchCondition.gender;
			var tmpl = Handlebars.compile($('#tmplTableTimeDivFloatingPeople').html());
			var dtSumArr = [];
			var timeTypeArr = [];
			var dtTotalSum = Array.apply(null, Array(self.diffTime)).map(function() {return 0;})
			
			//구분1 타이틀(요일) 리스트 추출
			var respDList = [];
			for(var d in day){
				respDList.push(day[d])
			}
			
			//구분2 타이틀(시간) 리스트 추출
			var respTList = []
			for(var t in time){
				respTList.push(time[t])
			}
			
			//resp데이터에서 가져올 컬럼리스트 추출
			var respColumnName = [];
			for(var g in gender){
				respColumnName.push('유동인구_' + gender[g])
			}
			
			//self.diffYear -- 이숫자만큼 데이터 배열에 push해야함
			var row = {
				dongnm: self.isSgg ? self.param.sidonm : self.param.sggnm,
				data: Array.apply(null, Array(respDList.length * respTList.length)).map(function() {
					return Array.apply(null, Array(self.diffTime)).map(function() {return 0;});
				})
			};
			
			
			// 2. 1번 형식대로 데이터 입력
			for (var i in dongArr) {
				var dongData = $.extend(true, {}, row);
				dongData.dongnm = dongArr[i];
				resultArr.push(dongData);
			}
			
			//resp 1차가공(동,연도,요일,시간,인구수 Obejct Array생성)
			var arrangeRowArr = [];
			for(var r in rowDataArr){
				var pplSumCount = 0;
				for(var c in respColumnName){
					var columnStr = respColumnName[c];
					
					if(!isNaN(rowDataArr[r][columnStr])){
						pplSumCount += parseInt(rowDataArr[r][columnStr]);
					}
					pplSumCount += 0;
				}
				var tempRowObj = {};
				
				tempRowObj.dongnm = self.isSgg ? rowDataArr[r].sggnm : rowDataArr[r].dongnm;
				tempRowObj['년도'] = rowDataArr[r]['년도'];
				tempRowObj.day = rowDataArr[r]['요일'];
				tempRowObj.time = rowDataArr[r]['시간']; 
				tempRowObj.pplCount = pplSumCount;
				arrangeRowArr.push(tempRowObj);
			}
			
			var dataMaxIdx = day.length * time.length;
			var dataFirstIdx = 0;
			
			for(var a in arrangeRowArr){
				var arrangeDongnm = arrangeRowArr[a].dongnm;
				var arrangeData = arrangeRowArr[a];
				
				for(var i in resultArr){
					var dongnm = resultArr[i].dongnm;
					var data = resultArr[i].data;
					
					if(arrangeDongnm == dongnm){
						var yearIdx = 0;
						
						for(var j in data){
							for(var k in data[j]){
								
								for(var s in searchTime){
									if(searchTime[s] == arrangeData['년도']){
										yearIdx = s;
									}
								}
							}
						}
						data[dataFirstIdx][yearIdx] = arrangeData.pplCount;
						
						if(dataFirstIdx < dataMaxIdx-1){
							dataFirstIdx++;
						}else if(dataFirstIdx == dataMaxIdx-1){
							dataFirstIdx = 0;
						}
					}
				}
			}
			
			//전체(시또는 구) 합계 데이터 생성
			var sumRow = $.extend(true, {}, row),
				sumRowData = sumRow.data;
				
			for (var i in resultArr) {
				var data = resultArr[i].data;
				
				for (var j in data) {
					for (var k in data[j]) {
						sumRowData[j][k] += data[j][k];
						dtTotalSum[k] += data[j][k]
					}
				}
			}
			resultArr.unshift(sumRow);
			
			//middleSum Array 생성
			for (var i in resultArr) {
				var tempMiddleSum = {};
				var data = resultArr[i].data;
				var sum = Array.apply(null, Array(self.diffTime)).map(function() {return 0;})
				tempMiddleSum.dongnm = resultArr[i].dongnm;
				tempMiddleSum.middleSumData = [];
				tempMiddleSum.dongSumData = Array.apply(null, Array(self.diffTime)).map(function() {return 0;})
				
				for(var j in data){
					for(var k in data[j]){
						sum[k] += data[j][k];
						tempMiddleSum.dongSumData[k] += data[j][k];
					}
					if((parseInt(j) + 1) % time.length == 0){
						tempMiddleSum.middleSumData.push(sum);
						sum = Array.apply(null, Array(self.diffTime)).map(function() {return 0;})
					}
				}
				dtSumArr.push(tempMiddleSum);
			}
			
			// 전체선택이 아닌 경우, 선택된 시군구 or 읍면동의 데이터만 표시되도록 수정됨
			// 총합 때문에 합산 끝내놓고 정리
			var selectedDongNm = self.param.dongnm;
			if ('전체' !== selectedDongNm) {
				for (var i = 1, len = resultArr.length; len > i; ++i) {
					if (selectedDongNm !== resultArr[i].dongnm) {
						resultArr.splice(i--, 1);
						len--;
					}
				}
				for (var i = 1, len = dtSumArr.length; len > i; ++i) {
					if (selectedDongNm !== dtSumArr[i].dongnm) {
						dtSumArr.splice(i--, 1);
						len--;
					}
				}
			}
			for(var t in time){
				timeTypeArr.push(time[t].substring(0,2) + '시 ~ ' + time[t].substring(2,4)) 
			}
			
			for (var i in resultArr) {
				var data = resultArr[i].data;

				for (var j in data) {
					for (var k in data[j]) {
						if (0 === data[j][k]) {
							// 0 이면 - 로 치환
							data[j][k] = '-';
						} else {
							data[j][k] = z.toComma(Math.round(data[j][k]));
						}
					}
				}
			}
			
			for (var i in dtSumArr) {
				var middleSumData = dtSumArr[i].middleSumData;
				var dongSumData = dtSumArr[i].dongSumData;
				//일별시간 합계 '-' 치환
				for (var j in middleSumData) {
					for (var k in middleSumData[j]) {
						if (0 === middleSumData[j][k]) {
							// 0 이면 - 로 치환
							middleSumData[j][k] = '-';
						} else {
							middleSumData[j][k] = z.toComma(Math.round(middleSumData[j][k]));
						}
					}
				}
				//동합계 '-'치환
				for (var d in dongSumData) {
					if (0 === dongSumData[d]) {
						// 0 이면 - 로 치환
						dongSumData[d] = '-';
					} else {
						dongSumData[d] = z.toComma(Math.round(dongSumData[d]));
					}
				}
			}
			
			self.resultArr = resultArr;
			self.dtSumArr = dtSumArr;
			
			Handlebars.registerHelper("dongTotalSumRow", function(dongnm, options) {
				var dongSumDataIdx = dtSumArr.findIndex(i => i.dongnm == dongnm);
				var dontSumData = dtSumArr[dongSumDataIdx].dongSumData;
				
				var str = '';
				for(var i = 0; i < dontSumData.length; i++){
					str += '<td style="text-align:right;">' + dontSumData[i] + '</td>';
				}
			    return str;
			});
			
			var helperCount = 0;
			var dongIdxCount = 0;
			Handlebars.registerHelper("resultMoveArrData", function(dongIdx, options){
				if(dongIdxCount < dongIdx){
					helperCount = 0;
					dongIdxCount = dongIdx;
				}
				var str = '';
				var currentData = self.resultArr[dongIdx].data[helperCount];
				for(var i = 0; i < currentData.length; i++){
					str += '<td style="text-align:right;">' + currentData[i] + '</td>'
				}
				helperCount++		
			    return str;
			});
			
			Handlebars.registerHelper("dayTotalSumRow", function(dongIdx, dayIndex, options) {
				var str = '';
				var currentData = self.dtSumArr[dongIdx].middleSumData[dayIndex];
				for(var i = 0; i < currentData.length; i++){
					str += '<td style="text-align:right;">' + currentData[i] + '</td>'
				}
			    return str;
			});
			
			var dongRowspan = (respDList.length * (respTList.length  + 1)) + 1;
			var populationRowspan = dongRowspan;
			var dayRowspan = respTList.length + 1;
			
			self.$tbody.html('').append(tmpl({				
				dayTypeArr			: day,
				timeTypeArr			: timeTypeArr,
				dataArr		 		: self.resultArr, 
				dtSumArr 			: dtSumArr,
				dongRowspan			: dongRowspan,
				populationRowspan   : populationRowspan,
				dayRowspan			: dayRowspan}));
			
			$('#tbody_7_1 .maintotal').click();
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
				dayArr = [],
				timeArr = [],
				day = checkedSearchCondition.day,
				time = checkedSearchCondition.time,
				param = {
					pnu: self.param.isBizdist ? self.param.bizdistAdmCd : self.param.dongCd,
					startYMD : moment(self.searchDtl.endYMD,'YYYY').subtract(11,'year').startOf('year').format('YYYY'),
					endYMD: self.searchDtl.endYMD.substring(0,4)				
				};
				
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
			
			if(day.length < 7){
				for(var d in day){
					switch(day[d]){
						case '월' : 
							dayArr.push('2');
							break;
						case '화' :
							dayArr.push('3');
							break;
						case '수' : 
							dayArr.push('4');
							break;
						case '목' : 
							dayArr.push('5');
							break;
						case '금' :
							dayArr.push('6');
							break;
						case '토' : 
							dayArr.push('7');
							break;
						case '일' : 
							dayArr.push('1');
							break;	
					}
				}
				param.selday = dayArr;
			}
			
			if(time.length < 4){
				for(var t in time){
					switch(time[t]){
					case '0008' : 
						timeArr.push(1);
						break;
					case '0912' :
						timeArr.push(2);
						break;
					case '1318' : 
						timeArr.push(3);
						break;
					case '1923' : 
						timeArr.push(4);
						break;
					}
				}
				param.seltime = timeArr;
			}
			
			return z.xAsync('population', '유동인구_시간대별_table', 'select', param, 'json').done(function(resp) {
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
					return 0;
				});
				
				for(var r in self.rawDataArr){
					var raw = self.rawDataArr[r];
				}
				
				//char_6_1 헤더부분 셋팅부 시작---------------------------------------------------
				var startYMD = moment(self.searchDtl.startYMD),
				endYMD = moment(self.searchDtl.endYMD),
				timeBound = self.searchDtl.radioTimeBound,
				tableHeaderArr = [],
				diffTime = 0,
				$tr = self.$thead.find('tr:first-child');
			
				switch (timeBound) {
					case 'year':
						diffTime = endYMD.diff(startYMD, 'years') + 1;
						
						var tmp = startYMD.clone();
						for (var i = 0; diffTime > i; ++i) {
							tableHeaderArr.push(tmp.format('YYYY'));
							tmp.add(1, 'year');
						}
						break;
					
				}
			
				$tr.find('th[rowspan="1"]').remove();
				
			  	for(var h in tableHeaderArr){
					var $th = $('<th/>', {rowspan: '1', text: tableHeaderArr[h]});
					$tr.append($th);
				}
			  	
			  	self.searchTime = tableHeaderArr;
			  	self.diffTime = diffTime;
			  	//char_6_1 헤더부분 셋팅부 종료---------------------------------------------------
			});
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			setTimeout(function() {
				var $table = self.$tbody.closest('table');
				var wsBody = XLSX.utils.table_to_sheet($table[0]);
				var jsonBody = XLSX.utils.sheet_to_json(wsBody, {header: 1});
				
				var mainlen = jsonBody[0].length;
				var sublen  = mainlen - 2;
				var area = '';
				var type = '';
				var population = '';
				for (var i in jsonBody) {
					var row = jsonBody[i];
					
					if(mainlen === row.length){
						area = row[0];
						type = row[1];
					}
					
					if(sublen === row.length){
						population = row[0];
					}
					
					if(mainlen > row.length ){
						if(sublen == row.length){
							row.unshift(type);
							row.unshift(area);
						} else {
							row.unshift(population);
							row.unshift(type);
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
	};		
	
    return {
        // Public functions
        init: function() {
			var self = this;
			self.setBtnListener();
			chartPopulationAll.init();
			chartPopulationAge.init();
			chartPopulationTimeZone.init();
        },

		setBtnListener: function() {
			$('[data-btn-download="table_6_1"]').click(function() {
				if(_isDemo) {
					z.msg(_DemoMsgDownloadX);
					return;
				}
				
				if(excelyn == "N"){
					z.msg(_NoPemissionMsgDownloadX);
					return;
				}

				$.when(
					tablePopulationAge.exportSheet()
				).done(function(workSheet) {
					var wb = XLSX.utils.book_new();
					XLSX.utils.book_append_sheet(wb, workSheet, '인구정보데이터');
					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_인구정보데이터(성별,연령별).xlsx');					
				});
			});
			
			/* 추이클릭시 펼치기/닫기(지역별 인구) */ 
			$('#tbody_6_1').on('click', '.maintotal', function() {
				var dong = $(this).attr('data-dong');
				var show = $(this).hasClass('data-show');
				var mainlen = 0;
				var sublen = 0;
				
				$('#tbody_6_1 tr').each(function(index, item){
					if($(item).attr('data-dong') === dong){
						if($(this).hasClass('maintotal')){
							mainlen++;
						}
						if($(this).hasClass('subtotal')){
							sublen++;
						}
					} 
				});
				
				if(show){//숨기기
					$('#tbody_6_1 tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){
							$(item).children().eq(0).attr('rowspan', mainlen);
							$(item).not('.maintotal').hide();
							$(item).removeClass('data-show').addClass('data-hide');
							$(item).removeClass('data-s-show').addClass('data-s-hide');
							$(item).removeClass('data-s-show2').addClass('data-s-hide2');	
						}
					});		
				} else {//보이기
					$('#tbody_6_1 tr').each(function(index, item){
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
			$('#tbody_6_1').on('click', '.subtotal', function() {
				var dong = $(this).attr('data-dong');
				var type = $(this).attr('data-type');
				var show = $(this).hasClass('data-s-show');
				var oldshowlen = 0;
				var newshowlen = 0;
				
				$('#tbody_6_1 tr').each(function(index, item){
					if($(item).attr('data-dong') === dong ){
						if($(this).hasClass('data-show')){
							oldshowlen++;
						} 
						if($(item).attr('data-type') == type && $(item).hasClass('subtotal2')){
							newshowlen++;
						} 
					} 
				});
				
				if(show){//숨기기
					$('#tbody_6_1 tr').each(function(index, item){
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
				} else {//보이기
					$('#tbody_6_1 tr').each(function(index, item){
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
			$('#tbody_6_1').on('click', '.subtotal2', function() {
				var dong = $(this).attr('data-dong');
				var type = $(this).attr('data-type');
				var sex = $(this).attr('data-sex');
				var show = $(this).hasClass('data-s-show2');
				var mainlen  = 0;
				var sublen = 0;
				var sublen2 = 0;
				var newlen  = 0;
				
				$('#tbody_6_1 tr').each(function(index, item){
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
								
				if(show){//숨기기
					$('#tbody_6_1 tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){
							if($(item).hasClass('maintotal')){
								$(item).children().eq(0).attr('rowspan', parseInt(mainlen) - newlen);
							}
							if($(item).attr('data-type') === type){
								if($(item).hasClass('subtotal')){
									$(item).children().eq(0).attr('rowspan', parseInt(sublen) - newlen);	
								} 
								if($(item).attr('data-sex') === sex){								
									if($(item).hasClass('subtotal2')){
										$(item).children().eq(0).attr('rowspan', parseInt(sublen2) - newlen);
										$(item).removeClass('data-s-show2').addClass('data-s-hide2');
									} else if($(item).hasClass('subdata')){
										$(item).hide();
										$(item).removeClass('data-show').addClass('data-hide');
										$(item).removeClass('data-s-show').addClass('data-s-hide');
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
				} else {//보이기
					$('#tbody_6_1 tr').each(function(index, item){
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
			
			$('[data-btn-download="table_6_2"]').click(function() {
				if(_isDemo) {
					z.msg(_DemoMsgDownloadX);
					return;
				}
				
				if(excelyn == "N"){
					z.msg(_NoPemissionMsgDownloadX);
					return;
				}

				$.when(
					tablePopulationAgeCustom.exportSheet()
				).done(function(workSheet) {

					var wb = XLSX.utils.book_new();
					
					XLSX.utils.book_append_sheet(wb, workSheet, '인구정보데이터');

					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_인구정보데이터(성별,연령별).xlsx');					
				});
			});
			
			/* 추이클릭시 펼치기/닫기(지역별 평균 분양가) */ 
			$('#tbody_7_1').on('click', '.maintotal', function() {
				var dong = $(this).attr('data-dong');
				var type = $(this).attr('data-type');
				var show = $(this).hasClass('data-show');
				var len = 0;
				var sanggalen = 0;
				var sanggadata = 0;
				var showlen = 0;
								
				$('#tbody_7_1 tr').each(function(index, item){
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
					$('#tbody_7_1 tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){
							$(item).children().eq(0).attr('rowspan','1');
							$(item).children().eq(1).attr('rowspan','1');
							$(item).not('.maintotal').hide();
							$(item).removeClass('data-show').addClass('data-hide');
							$(item).removeClass('data-s-show').addClass('data-s-hide');
						}
					});		
				} else {//보이기
					$('#tbody_7_1 tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){
							if($(item).hasClass('maintotal')){
								if($(item).children().eq(0).attr('rowspan') == '1'){
									$(item).children().eq(0).attr('rowspan', sanggalen + 1);
									$(item).children().eq(1).attr('rowspan', sanggalen + 1);
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
			$('#tbody_7_1').on('click', '.subtotal', function() {
				var dong = $(this).attr('data-dong');
				var type = $(this).attr('data-type');
				var show = $(this).hasClass('data-s-show');
				var len = 0;
				var sanggalen = 0;
				var sanggadata = 0;
				
				$('#tbody_7_1 tr').each(function(index, item){
					if($(item).attr('data-dong') === dong && $(this).hasClass('data-show')){
						len++;
					}
					
					if($(item).attr('data-dong') === dong && $(item).attr('data-type') === type){
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
					$('#tbody_7_1 tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){//첫번째 rowspan 수정
							if($(item).hasClass('maintotal')){
								if($(item).children().eq(0).attr('rowspan') == len){
									$(item).children().eq(0).attr('rowspan', len - sanggadata ); //전체에서 상가로우데이터 빼면 
									$(item).children().eq(1).attr('rowspan', len - sanggadata ); //전체에서 상가로우데이터 빼면
								}
							}
						}	
						
						if($(item).attr('data-dong') === dong && $(item).attr('data-type') === type){
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
					$('#tbody_7_1 tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){//첫번째 rowspan 수정
							if($(item).hasClass('maintotal')){
								if($(item).children().eq(0).attr('rowspan') == len){
									$(item).children().eq(0).attr('rowspan', len + sanggalen + sanggadata - 1); //자기자신 빼기!
									$(item).children().eq(1).attr('rowspan', len + sanggalen + sanggadata - 1); //자기자신 빼기!
								}
							}
						}	
						
						if($(item).attr('data-dong') === dong && $(item).attr('data-type') === type){
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
			
			
			$('[data-btn-download="table_7_1"]').click(function() {
				if(_isDemo) {
					z.msg(_DemoMsgDownloadX);
					return;
				}
				if(excelyn == "N"){
					z.msg(_NoPemissionMsgDownloadX);
					return;
				}
				$.when(
					tablePopulationDayName.exportSheet()
				).done(function(workSheet) {

					var wb = XLSX.utils.book_new();
					
					XLSX.utils.book_append_sheet(wb, workSheet, '인구정보데이터');

					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_인구정보데이터(요일,시간대별 /유동인구 한정).xlsx');					
				});
			});
		},

		setDongCd: function(param) {
			if (! param.isBizdist && ! param.dongCd) {
				return;
			}
			
			var searchDtl = apiSearchPopulation.getSearchDtl(param);
			
			//거주인구,직장인구 만 선택시 차트2만 보임
			//전체나 유동인구만 선택시 차트2,3 둘다 보임
			if ('custom' != searchDtl.radioTimeBound) {
				if(searchDtl.checkpopulationType.includes("2") || searchDtl.checkpopulationType.length == 0){
					$('[data-ui-user-date=false]').eq(1).show();
				}else{
					$('[data-ui-user-date=false]').eq(1).hide();
				}
			}
			checkedSearchCondition = {
				'population' : [],
				'gender'	 : [],
				'age'		 : [],
				'day'		 : [],
				'time'		 : []
			}
			
			//인구유형
			if(searchDtl.checkpopulationType.length == 0){
				checkedSearchCondition.population.push('거주인구','직장인구','유동인구')
			}else{				
				for(var p in searchDtl.checkpopulationType){
					checkedSearchCondition.population.push(searchDtl.checkpopulationType[p]);
				}				
			}
			
			//성별
			if(searchDtl.checksexType.length == 0){
				checkedSearchCondition.gender.push('남','여')
			}else{
				for(var gender in searchDtl.checksexType){
					if(searchDtl.checksexType[gender] == '남성'){ 
						checkedSearchCondition.gender.push('남')
					}else{
						checkedSearchCondition.gender.push('여')
					}
						
				}				
			}
			
			
			//연령
			if(searchDtl.checkageType.length == 0){
				checkedSearchCondition.age.push('00','10','20','30','40','50','60')
			}else{
				for(var a in searchDtl.checkageType){
					switch(searchDtl.checkageType[a]){
						case '10대 미만' :
							checkedSearchCondition.age.push('00')
							break;
						case '10대' :
							checkedSearchCondition.age.push('10')
							break;
						case '20대' :
							checkedSearchCondition.age.push('20')
							break;
						case '30대' :
							checkedSearchCondition.age.push('30')
							break;
						case '40대' :
							checkedSearchCondition.age.push('40')
							break;
						case '50대' :
							checkedSearchCondition.age.push('50')
							break;
						case '60대 이상' :
							checkedSearchCondition.age.push('60')
							break;					
					}					
				}				
			}
			//요일  checkdayNameType 
			if(searchDtl.checkdayNameType.length == 0){
				checkedSearchCondition.day.push('월','화','수','목','금','토','일')
			}else{
				for(var a in searchDtl.checkdayNameType){
					checkedSearchCondition.day.push(searchDtl.checkdayNameType[a]);
				}
			}
			
			//시간대
			if(searchDtl.checktimeZoneType.length == 0){
				checkedSearchCondition.time.push('0008','0912','1318','1923')
			}else{
				for(var a in searchDtl.checktimeZoneType){
					switch(searchDtl.checktimeZoneType[a]){
						case '0시~08시' :
							checkedSearchCondition.time.push('0008')
							break;
						case '09시~12시' :
							checkedSearchCondition.time.push('0912')
							break;
						case '13시~18시' :
							checkedSearchCondition.time.push('1318')
							break;
						case '19시~23시' :
							checkedSearchCondition.time.push('1923')
							break;
					}
				}
			}
			
			
			chartPopulationAll.init(param, searchDtl);
			chartPopulationYear.init(param, searchDtl);
			chartPopulationAge.init(param, searchDtl);
			chartPopulationDayName.init(param, searchDtl);
			
			if ('custom' === searchDtl.radioTimeBound) {
				$('[data-ui-user-date=true]').show();
				$('[data-ui-user-date=false]').hide();
				
				tablePopulationAgeCustom.init(param, searchDtl);
			}else{
				$('[data-ui-user-date=true]').hide();
				$('[data-ui-user-date=false]').show();
				tablePopulationAge.init(param, searchDtl);
				tablePopulationDayName.init(param, searchDtl);
			}
		}
    };
}();


$(function() {
	$.when(
		$.getScript('/resources/admin/APPS/dashboard/apiSearchAreaMap_dev.js'),
		$.getScript('/resources/admin/APPS/dashboard/populationSearch.js'),
		$.getScript('/resources/common/custom/js/commonDashboard.js')
	).done(function() {
		z.xAsync('AdminMain', 'getExcelDown', 'select', {pgmCode:"MA0118"}, 'json').done(function(resp) {
			if(resp[0].excelyn == "N"){
				$("[data-btn-download]").css("display", "none");
			} else {
				$("[data-btn-download]").css("display", "block");
			}
		}); 

		apiSearchAreaMap.init({
			btnSearchArea: $('#btnSearchArea'),
			btnSearchAreaSpan: $('#btnSearchArea > span'),
			areaCdListener: apiPopulation.setDongCd,
			bizdistShow: false
		});
		
		apiSearchEmd = apiSearchAreaMap;
		
		apiSearchPopulation.init({  
			btnActivate: $('[data-btn-search-detail]'),
			searchWrapper: $('[data-wrapper="searchDetail"]'),
			searchDateRange: $('[data-wrapper="searchDetail"] [data-search-time]'),
			btnOk: $('[data-wrapper="searchDetail"] [data-btn-ok]'),
			btnClose: $('[data-wrapper="searchDetail"] [data-btn-close]')
		});
		
		apiPopulation.init();
		
		z.formatDataReference('인구').done(function(refText) {
			$('.dashboard .reference').text(refText);
		});
	});
});
