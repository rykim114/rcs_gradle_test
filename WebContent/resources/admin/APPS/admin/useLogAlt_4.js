'use strict';
// Class definition

var KTDatatableUserLog4 = function() {
	 // Private functions

	var useLogDownloadStatistics = {
		init: function(param) {
			var self = this;

			self.param = param;
			
			var options = {
			    chart: {
			        type: 'line',
			        toolbar: {
			            show: false,
			        },
			        width: '100%',
			        height: 360,
			        zoom: {
			            enabled: false,
			        }
			    },
			    grid: {
			        padding: {
			            left: 30,
			            right: 30,
			        },
			    },
			    series: [{
			        name: '엑셀',
			        data: [6, 3, 5.5, 9, 32, , , , , , , , , , , , , , , , , , , , , ],
			    },{
			        name: '그래프',
			        data: [9, 22, 12, 17, 22, , , , , , , , , , , , , , , , , , , , , ],
			    }],
			    xaxis: {
			        categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24',],
					labels: {
						rotateAlways: true,
						hideOverlappingLabels: false
					},
					tooltip: {
						enabled: false
					}
			    },
			    colors: ['#2eb7c4','#eab600'],
			    stroke: {
			        show: true,
			        width: 2,
			        dashArray: 0,
			    },
			    markers: {
			        size: 6,
			        colors: ['#2eb7c4', '#eab600',],
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
			        position: 'top',
			        horizontalAlign: 'right',
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
			            horizontal: 20,
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
			
			self.chart = new ApexCharts($('#useLogDownloadStatistics')[0], options);

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

				z.xAsync('UseLog', 'zeons_주요다운로드메뉴', 'select', param, 'json').done(function(resp) {
					// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
					self.rawDataArr = $.extend(true, [], resp);
					
					for (var i in self.rawDataArr) {
						var row = self.rawDataArr[i];
						
						row['클릭수'] = parseInt(row['클릭수']);
					}


					self.dfrLoad.resolve(resp);
					/**
						주요다운로드: "평균임대료_추이"
						클릭수: "12",
						다운로드구분: 'excel'
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
						text: '엑셀'
					},
					labels: {
						formatter: function(value) {
							return z.toComma(value);
						}
					}
				}, {
					opposite: true,
					title: {
						text: '그래프'
					},
					labels: {
						formatter: function(value) {
							return z.toComma(value);
						}
					}
				}];
				
			for (var i in rawDataArr) {
				xAxisArr.push(rawDataArr[i]['주요다운로드']);
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

			var cateArr = chartOptions.xaxis.categories;
			
			for (var i in cateArr) {
				var idxUnderscore = cateArr[i].indexOf('_');
				
				if (-1 < idxUnderscore) {
					cateArr[i] = [cateArr[i].substring(0, idxUnderscore), cateArr[i].substring(idxUnderscore + 1)];
				}
			}

			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);			
		},


		updateDataByClick: function(chartOptions, chartSeries) {
			var self = this,
				rawDataArr = self.rawDataArr,
				rankArr = self.xAxisArr,
				clickData = [
					{
						name: '엑셀',
						data: Array.apply(null, Array(rankArr.length)).map(function() {return 0;})
					},
					{
						name: '그래프',
						data: Array.apply(null, Array(rankArr.length)).map(function() {return 0;})
					}
				];
				
			for (var i in clickData) {
				chartSeries.push(clickData[i]);
			}

			for (var i = 0, len = rawDataArr.length; len > i; ++i) {
				var row = rawDataArr[i],
					idx = rankArr.indexOf(row['주요다운로드']);
				
				if (0 > idx) {
					continue;
				}
				
				clickData['chart' === row['다운로드구분'] ? 1 : 0].data[idx] = row['클릭수'];
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
					
					XLSX.utils.book_append_sheet(wb, workSheet, '다운로드_항목');
					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_다운로드_항목.xlsx');
				});
			});			
		},
		
		loadData: function() {
			return useLogDownloadStatistics.loadData();
		},
		
		updateData: function() {
			var self = this,
				$tbody = self.$wrapper.find('[data-table="body"] > tbody'),
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
					rawDataArr = [[], []];

				for (var i in rawDataClickArr) {
					var elm = rawDataClickArr[i];

					elm['클릭수'] = parseInt(elm['클릭수']);
					elm['tdText'] = '<span>' + z.toComma(elm['클릭수']) + '</span>건';
					
					rawDataArr['chart' === elm['다운로드구분'] ? 1 : 0].push(elm);
				}
				
				for (var i in rawDataArr) {
					rawDataArr[i] = rawDataArr[i].sort(function(a, b) {
						if (a['클릭수'] < b['클릭수']) {
							return 1;
						}
						if (a['클릭수'] > b['클릭수']) {
							return -1;
						}
						
						return 0;
					});
				}

				self.rawDataArr = rawDataArr;
					
				self.updateData();
			});
		},
		
		setBtnListener: function() {},
		
		loadData: function() {
			return useLogDownloadStatistics.loadData();
		},
		
		updateData: function() {
			var self = this,
				$list = self.$wrapper.find('ul[data-list]'),
				rawDataArr = self.rawDataArr,
				tmpl = Handlebars.compile($('#tmplTableLogMinMax').html());
			
			$list.each(function(idx, elm) {
				$(elm).html(tmpl({dataArr: rawDataArr[idx].slice(0, 3)}));
			});

			KTApp.init();
		}
	};


	return {
		// Public functions
		init: function() {
		},

		setTime: function(param) {
			useLogDownloadStatistics.init(param);
			tableLogClick.init(param);
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
			fnListener: KTDatatableUserLog4.setTime
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
