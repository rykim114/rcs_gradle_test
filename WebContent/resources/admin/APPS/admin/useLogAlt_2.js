'use strict';
//Class definition
var KTDatatableUserLog2 = function() {
 // Private functions

	// 클릭수 및 체류시간 그래프
	var useLogClickStayTime = {
		init: function(param) {
			var self = this;
			
			self.param = param;

			var options = {
			    series: [{
			        name: '클릭수',
			        type: 'column',
			        data: [0],
			    },{
			        name: '체류시간',
			        type: 'line',
			        data: [0],
			    }],
			    chart: {
			        width:'100%',
			        height: 500,
			        type: 'line',
			        stacked: false,
			        toolbar: {
			            show: false,
			        },
			    },
			    plotOptions: {
			        bar: {
			            horizontal: false,
			            columnWidth: '40%',
			            // endingShape: 'rounded'
			        },
			    },
			    markers: {
			        size: 8,
			        colors: ['#2eb7c4'],
			        strokeColors: '#fff',
			        strokeWidth: 0,
			        strokeOpacity: 0.9,
			        strokeDashArray: 0,
			        fillOpacity: 1,
			        discrete: [],
			        shape: "circle",
			        radius: 10,
			        offsetX: 0,
			        dropShadow: {
			            enabled: true,
			            // enabledOnSeries: [1],
			            top: 3,
			            left: 3,
			            blur: 0,
			            opacity: 0.2
			        },
			    },
			    stroke: {
			        width: [1, 4]
			    },
			    title: {
			        // text: 'XYZ - Stock Analysis (2009 - 2016)',
			        align: 'left',
			        offsetX: 110
			    },
			    dataLabels: {
			        enabled: false,
			    },
			    // grid: {
			    //     padding: {
			    //         left: 100,
			    //         right: 100,
			    //     },
			    // },
			    xaxis: {
			        categories: ['공급동향', '평균분양가', '임대료변동률', '평균임대료', '실거래추이', '업종정보', 'GIS건물/분양', '상권분석리포트', '상권분석리포트 상세', '인구정보'],
			        axisBorder: {
			            show: false,
			        },
					labels: {
						rotateAlways: true,
						hideOverlappingLabels: false
					},
					tooltip: {
						enabled: false
					}
			    },
			    yaxis: [
			        {
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
			        },
			        {
			            // seriesName: '매출정보추이',
			            opposite: true,
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
			        },
			    ],
			    tooltip: {
			        fixed: {
			            enabled: false,
			            position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
			            offsetY: 30,
			            offsetX: 60
			        },
			    },
			    colors: ['#d4cfc9','#2eb7c4'],
			    legend: {
			        show: true,
			        position: 'top',
			        horizontalAlign: 'right',
			        fontSize: '10px',
			        fontFamily: 'Noto Sans Korean',
			        fontWeight: 400,
			        markers: {
			            width: 8,
			            height: 8,
			            radius: 100,
			        },
			        itemMargin: {
			            horizontal: 20,
			            vertical: 0
			        },
			    },
			};
			
			if (self.chart) {
				self.chart.destroy();
			}
			
			self.chart = new ApexCharts($('#useLogClickStayTime')[0], options);

			self.chart.render().then(function() {

				// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
//				chart.updateSeries([]);

				self.loadData(true).done(function(resp) {
					self.loadAxis();
					self.updateData();
				});
			});

		},
		

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function(isFromServer) {
			var self = this,
				param = {
					dateStart: self.param.startYMD,
					dateEnd: self.param.endYMD
				};

			if (! self.dfrLoad || 'pending' !== self.dfrLoad.state()) {
				self.dfrLoad = $.Deferred();
			}
				
			if (isFromServer) {

				z.xAsync('UseLog', 'zeons_메뉴별접속로그', 'select', param, 'json').done(function(resp) {
					// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
					self.rawDataArr = $.extend(true, [], resp);
	
					self.dfrLoad.resolve(resp);
					/**
						메뉴명: "지역/상권현황"
						클릭수: "9586"
						평균체류시간: "1.54                          "
					 */
				});
								
			}

			return self.dfrLoad;
		},


		loadAxis: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				xAxisArr = [],
				yAxisObj = [{
					title: {
						text: '체류시간'
					},
					labels: {
						formatter: function(value) {
							return z.toComma(value);
						}
					}
				}, {
					opposite: true,
					title: {
						text: '클릭수'
					},
					labels: {
						formatter: function(value) {
							return z.toComma(value);
						}
					}
				}];
				
			for (var i in rawDataArr) {
				xAxisArr.push(rawDataArr[i]['메뉴명']);
			}


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

			self.updateDataByClick(chartOptions, chartSeries);

			// 엑셀 저장용 정보로도 활용될 예정
//			self.yAxisArr = chartSeries;
			
//			console.log(chartOptions);
//			console.log(chartSeries);

			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);			
		},


		updateDataByClick: function(chartOptions, chartSeries) {
			var self = this,
				rawDataArr = self.rawDataArr,
				clickData = {
					name: '클릭수',
					type: 'column',
					data: Array.apply(null, Array(rawDataArr.length)).map(function() {return 0;})
				},
				stayTimeData = {
					name: '체류시간',
					type: 'line',
					data: Array.apply(null, Array(rawDataArr.length)).map(function() {return 0;})
				};
				

			chartSeries.push(clickData);
			chartSeries.push(stayTimeData);

			for (var i = 0, len = rawDataArr.length; len > i; ++i) {
				clickData.data[i] = rawDataArr[i]['클릭수'];
				stayTimeData.data[i] = rawDataArr[i]['평균체류시간'];
			}
			

		},

	};
	
	var tableLogClick = {
		init: function(param) {
			var self = this;
			
			self.$wrapper = $('[data-wrapper=tableLogClick]');
			
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				var rawDataArr = $.extend(true, [], resp);

				for (var i in rawDataArr) {
					var elm = rawDataArr[i];
					
					elm['클릭수'] = parseInt(elm['클릭수']);
					elm['tdText'] = z.toComma(elm['클릭수']);					
				}

				rawDataArr = rawDataArr.sort(function(a, b) {
					if (a['클릭수'] < b['클릭수']) {
						return 1;
					}
					if (a['클릭수'] > b['클릭수']) {
						return -1;
					}
					
					return 0;
				});

				for (var i in rawDataArr) {
					var elm = rawDataArr[i];
					
					elm.no = parseInt(i) + 1;
					
					if (12 < elm.no) {
						elm.isHidden = true;
					}
				}

				self.rawDataArr = rawDataArr;

				self.updateData();
			});
		},
		
		setBtnListener: function() {
			var self = this;

			self.$wrapper.find('[data-btn-download]').click(function() {
				self.exportSheet().done(function(workSheet) {
					var wb = XLSX.utils.book_new();
					
					XLSX.utils.book_append_sheet(wb, workSheet, '메뉴별_클릭수');
					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_메뉴별_클릭수.xlsx');
				});
			});			
		},
		
		loadData: function() {
			return useLogClickStayTime.loadData();
		},
		
		updateData: function() {
			var self = this,
				$tbody = self.$wrapper.find('table.table > tbody'),
				rawDataArr = self.rawDataArr,
				tmpl = Handlebars.compile($('#tmplTableLogClick').html());
			
			$tbody.html(tmpl({dataArr: rawDataArr}));
			
			$tbody.children('[data-is-hidden=true]').hide();
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $header = self.$wrapper.find('[data-table="head"]');
				var $table = self.$wrapper.find('[data-table="body"]');
				
				var wsHeader = XLSX.utils.table_to_sheet($header[0]);
				var wsBody = XLSX.utils.table_to_sheet($table[0]);
				
				var jsonHeader = XLSX.utils.sheet_to_json(wsHeader, {header: 1});
				var jsonBody = XLSX.utils.sheet_to_json(wsBody, {header: 1});

				var jsonMerge = jsonHeader.concat(jsonBody);

				var ws = XLSX.utils.json_to_sheet(jsonMerge, {skipHeader: true});

				result.resolve(ws);

//				apiSearchEmd.addDownloadLog('추이');
			});

			return result;
		}
	};



	var tableLogStayTime = {
		init: function(param) {
			var self = this;
			
			self.$wrapper = $('[data-wrapper=tableLogStayTime]');
			
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				var rawDataArr = $.extend(true, [], resp);

				for (var i in rawDataArr) {
					var elm = rawDataArr[i];
					
					elm['체류시간'] = parseFloat(elm['평균체류시간']);
					elm['tdText'] = z.toComma(elm['체류시간']) + '분';					
				}

				rawDataArr = rawDataArr.sort(function(a, b) {
					if (a['체류시간'] < b['체류시간']) {
						return 1;
					}
					if (a['체류시간'] > b['체류시간']) {
						return -1;
					}
					
					return 0;
				});

				for (var i in rawDataArr) {
					var elm = rawDataArr[i];
					
					elm.no = parseInt(i) + 1;
					
					if (12 < elm.no) {
						elm.isHidden = true;
					}
				}

				self.rawDataArr = rawDataArr;
					
				self.updateData();
			});
		},
		
		setBtnListener: function() {
			var self = this;

			self.$wrapper.find('[data-btn-download]').click(function() {
				self.exportSheet().done(function(workSheet) {
					var wb = XLSX.utils.book_new();
					
					XLSX.utils.book_append_sheet(wb, workSheet, '메뉴별_체류시간');
					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_메뉴별_체류시간.xlsx');
				});
			});			
			
		},
		
		loadData: function() {
			return useLogClickStayTime.loadData();
		},
		
		updateData: function() {
			var self = this,
				$tbody = self.$wrapper.find('table.table > tbody'),
				rawDataArr = self.rawDataArr,
				tmpl = Handlebars.compile($('#tmplTableLogClick').html());
			
			
			$tbody.html(tmpl({dataArr: rawDataArr}));
			
			$tbody.children('[data-is-hidden=true]').hide();
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $header = self.$wrapper.find('[data-table="head"]');
				var $table = self.$wrapper.find('[data-table="body"]');
				
				var wsHeader = XLSX.utils.table_to_sheet($header[0]);
				var wsBody = XLSX.utils.table_to_sheet($table[0]);
				
				var jsonHeader = XLSX.utils.sheet_to_json(wsHeader, {header: 1});
				var jsonBody = XLSX.utils.sheet_to_json(wsBody, {header: 1});

				var jsonMerge = jsonHeader.concat(jsonBody);

				var ws = XLSX.utils.json_to_sheet(jsonMerge, {skipHeader: true});

				result.resolve(ws);

//				apiSearchEmd.addDownloadLog('추이');
			});

			return result;
		}		
	};
	
	
	var tableLogMinMax = {
		init: function(param) {
			var self = this;
			
			self.$wrapper = $('[data-wrapper=tableLogMinMax]');
			
			self.loadData().done(function(resp) {
				var rawDataClickArr = $.extend(true, [], resp),
					rawDataStayTimeArr = $.extend(true, [], resp);

				for (var i in rawDataClickArr) {
					var elm = rawDataClickArr[i],
						elmStayTime = rawDataStayTimeArr[i];

					elm['클릭수'] = parseInt(elm['클릭수']);
					elmStayTime['체류시간'] = parseFloat(elmStayTime['평균체류시간']);
					
					elm['tdText'] = '<span>' + z.toComma(elm['클릭수']) + '</span>건';
					elmStayTime['tdText'] = '<span>' + z.toComma(elmStayTime['체류시간']) + '</span>분';
				}

				rawDataStayTimeArr = rawDataStayTimeArr.sort(function(a, b) {
					if (a['체류시간'] < b['체류시간']) {
						return 1;
					}
					if (a['체류시간'] > b['체류시간']) {
						return -1;
					}
					
					return 0;
				});

				rawDataClickArr = rawDataClickArr.sort(function(a, b) {
					if (a['클릭수'] < b['클릭수']) {
						return 1;
					}
					if (a['클릭수'] > b['클릭수']) {
						return -1;
					}
					
					return 0;
				});

				self.rawDataClickArr = rawDataClickArr;
				self.rawDataStayTimeArr = rawDataStayTimeArr;
					
				self.updateData();
			});
		},
		
		setBtnListener: function() {},
		
		loadData: function() {
			return useLogClickStayTime.loadData();
		},
		
		updateData: function() {
			var self = this,
				$list = self.$wrapper.find('ul[data-list]'),
				rawDataClickArr = self.rawDataClickArr,
				rawDataStayTimeArr = self.rawDataStayTimeArr,
				minMaxArr = [],
				tmpl = Handlebars.compile($('#tmplTableLogMinMax').html());
			
			minMaxArr.push(rawDataClickArr.slice(0, 3));
			minMaxArr.push(rawDataStayTimeArr.slice(0, 3));
			
			minMaxArr.push(rawDataClickArr.slice(rawDataClickArr.length - 3).reverse());
			minMaxArr.push(rawDataStayTimeArr.slice(rawDataStayTimeArr.length - 3).reverse());

			$list.each(function(idx, elm) {
				$(elm).html(tmpl({dataArr: minMaxArr[idx]}));
			});

			KTApp.init();
		}
	};
		
	
	return {
		// Public functions
		init: function() {
		},

		setTime: function(param) {
			useLogClickStayTime.init(param);
			tableLogClick.init(param);
			tableLogStayTime.init(param);
			tableLogMinMax.init(param);
		}
		
	};
}();

$(function() {
	$.when(
		$.getScript('/resources/admin/APPS/admin/useLogAltSearch.js')
	).done(function() {

		apiSearchUseLog.init({
			searchWrapper: $('[data-wrapper="searchDetail"]'),
			searchDateRange: $('[data-wrapper="searchDetail"] [data-search-time]'),
			btnOk: $('[data-wrapper="searchDetail"] [data-btn-ok]'),
			fnListener: KTDatatableUserLog2.setTime
		});
		
		
		$('[data-wrapper="searchDetail"] [data-btn-ok]').click();
	});
});


function userCount(){
	z.setValue("checkDate", "Y");
	z.menuLink("MA0604");
}

function menuCount(){
	z.menuLink("MA060403");
}
function searchCount(){
	z.menuLink("MA060406");
}
function downloadCount(){
	z.menuLink("MA060409");
}
