'use strict';
// Class definition

var KTDatatableUserLog3 = function() {
	 // Private functions

	// 시간별(클릭수 높은 지역)
	var useLogTimeClick = {
		init: function(param) {
			var self = this;
			
			self.param = param;

			var options = {
			    chart: {
			        type: 'bar',
			        toolbar: {
			            show: false,
			        },
			        width:'100%',
			        height: 340,
			    },
			    series: [{
			        name: '오전',
			        data: [0,0,0,0,0]
			    },{
			        name: '오후',
			        data: [0,0,0,0,0]
			    }],
			    xaxis: {
			        // categories: ['서울시 강남구 역삼동', '서울시 강남구 압구정동', '서울시 송파구 잠실4동', '수원시 팔달구 시원동', '경기도 용인시 처인구 유방동'],
			        categories: ['서울시 강남구 역삼동', '서울시 강남구 압구정동', '서울시 송파구 잠실4동', '수원시 팔달구 시원동', '경기도 용인시 처인구 유방동'],
			    },
			    plotOptions: {
			        bar: {
			            horizontal: false,
			            columnWidth: '60%',
			            // endingShape: 'rounded'
			        },
			    },
			    dataLabels: {
			        enabled: false,
			    },
//			    responsive: [
//			        {
//			            breakpoint: 1000,
//			            options: {
//			                plotOptions: {
//			                    bar: {
//			                        horizontal: true
//			                    }
//			                },
//			                legend: {
//			                    position: "bottom"
//			                }
//			            }
//			        }
//			    ],
			    colors: ['#2eb7c4','#b5bf1b','#f1c644'],
			    stroke: {
			        show: true,
			        // curve: 'smooth',
			        lineCap: 'butt',
			        colors: '#ffffff',
			        width: 2,
			        dashArray: 0,
			    },
			    grid: {
			        padding: {
			            left: -60,
			        }
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
			
			self.chart = new ApexCharts($('#useLogTimeClick')[0], options);

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

				z.xAsync('UseLog', 'zeons_주요검색지역', 'select', param, 'json').done(function(resp) {
					// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
					self.rawDataArr = $.extend(true, [], resp);

					// resp 는 AM/PM 합산 - 차트만 구분
					var dataMap = resp.reduce(function(rv, elm, idx) {
						if (1 === idx) {
							var rvPrev = rv;
							
							rv = {};
							rv[rvPrev['검색지역']] = rvPrev;
							rvPrev['클릭수'] = parseInt(rvPrev['클릭수']);
						}
						
						if (! rv[elm['검색지역']]) {
							rv[elm['검색지역']] = elm;
							elm['클릭수'] = parseInt(elm['클릭수']);	
						} else {
							rv[elm['검색지역']]['클릭수'] += parseInt(elm['클릭수']);
						}
						return rv;
					});

					var dataArr = Object.values(dataMap).sort(function(a, b) {
						if (a['클릭수'] < b['클릭수']) {
							return 1;
						}
						if (a['클릭수'] > b['클릭수']) {
							return -1;
						}
						return 0;
					});
					
					self.rankArr = $.extend(true, [], dataArr);

					self.dfrLoad.resolve(dataArr);
					/**
						ap: "AM"
						검색지역: "서울특별시 강남구 "
						클릭수: "694"
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
						text: '클릭수'
					},
					labels: {
						formatter: function(value) {
							return z.toComma(value);
						}
					}
				}];
				
			// 상위 5개만
			var rankArr = self.rankArr.splice(0, 5);
				
			for (var i in rankArr) {
				xAxisArr.push(rankArr[i]['검색지역']);
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
				rankArr = self.xAxisArr,
				rawDataArr = self.rawDataArr,
				clickData = [
					{
						name: '오전',
						data: Array.apply(null, Array(rankArr.length)).map(function() {return 0;})
					},
					{
						name: '오후',
						data: Array.apply(null, Array(rankArr.length)).map(function() {return 0;})
					}
				];
				
			for (var i in clickData) {
				chartSeries.push(clickData[i]);
			}

			for (var i = 0, len = rawDataArr.length; len > i; ++i) {
				var row = rawDataArr[i],
					idx = rankArr.indexOf(row['검색지역']);
				
				if (0 > idx) {
					continue;
				}
				
				clickData['AM' === row['ap'] ? 0 : 1].data[idx] = row['클릭수'];
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
					
					if (6 < elm.no) {
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
					
					XLSX.utils.book_append_sheet(wb, workSheet, '검색지역_클릭수');
					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_검색지역_클릭수.xlsx');
				});
			});			
		},
		
		loadData: function() {
			return useLogTimeClick.loadData();
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
					rawDataArr = [[], []];

				for (var i in rawDataClickArr) {
					var elm = rawDataClickArr[i];

					elm['클릭수'] = parseInt(elm['클릭수']);
					elm['tdText'] = '<span>' + z.toComma(elm['클릭수']) + '</span>건';
					
					rawDataArr['biz' === elm['검색구분'] ? 1 : 0].push(elm);
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
			return useLogTimeClick.loadData();
		},
		
		updateData: function() {
			var self = this,
				$list = self.$wrapper.find('ul[data-list]'),
				rawDataArr = self.rawDataArr,
				minMaxArr = [],
				tmpl = Handlebars.compile($('#tmplTableLogMinMax').html());

			minMaxArr.push(rawDataArr[0].slice(0, 3));
			
			var emdArr = rawDataArr[0].filter(function(elm, idx) {
				return 2 < $.trim(elm['검색지역']).split(' ').length;
			});
			
			minMaxArr.push(emdArr.slice(0, 3));
			
			minMaxArr.push(rawDataArr[1].slice(0, 3));

			$list.each(function(idx, elm) {
				$(elm).html(tmpl({dataArr: minMaxArr[idx]}));
			});
			
			KTApp.init();
		}
	};


	return {
		// Public functions
		init: function() {
	
			useLogTimeClick.init();
		},

		setTime: function(param) {
			useLogTimeClick.init(param);
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
			fnListener: KTDatatableUserLog3.setTime
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
