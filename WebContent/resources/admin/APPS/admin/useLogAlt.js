'use strict';
// Class definition


var KTDatatableUserLog = function() {
    // Private functions

	// 페이지 뷰 수
	var useLogPageViewCount = {
		
		init: function(param) {
			var self = this;
			
			self.param = param;
			
			self.$wrapper = $('#useLogPageViewCount').parent('div');

			var options = {
			    chart: {
			        type: 'bar',
			        toolbar: {
			            show: false,
			        },
			        width:'100%',
			        height: 400,
			    },
			    series: [{
			        name: '월',
			        data: [0,0,0,0,0,0,0,0,0,0],
			    }],
			    xaxis: {
			        categories: ['', '', '', '', '', '', '', '', '', '']
			    },
			    plotOptions: {
			        bar: {
			            horizontal: false,
			            columnWidth: '80%',
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
			    colors: ['#2eb7c4'],
			    stroke: {
			        show: true,
			        // curve: 'smooth',
			        lineCap: 'butt',
			        colors: '#ffffff',
			        width: 2,
			        dashArray: 0,
			    },
			    legend: {
			        show: false,
			    }
			};
			
			if (self.chart) {
				self.chart.destroy();
			}
			
			self.chart = new ApexCharts($('#useLogPageViewCount')[0], options);


			self.chart.render().then(function() {

				// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
//				chart.updateSeries([]);

				self.loadData(true).done(function(resp) {
					// 상위 10개만
					self.rawDataArr = self.rawDataArr.filter(function(elm, idx) {
						return 10 > idx;
					});
					
					self.loadAxis();
					self.updateData();
				});
			});
			
			self.setBtnListener();
		},
		
		setBtnListener: function() {
			var self = this;
			
			var $btn = self.$wrapper.find('.radioSelect').children('li');
			
			$btn.off('click').on('click', function() {
				var $this = $(this);
				
				$btn.removeClass('on');
				$this.addClass('on');
				
				self.loadData(true).done(function() {
					// 상위 10개만
					self.rawDataArr = self.rawDataArr.filter(function(elm, idx) {
						return 10 > idx;
					});
					
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
					dateEnd: self.param.endYMD,
					menuCdArr: self.$wrapper.find('.radioSelect').children('li.on').attr('data-menu-cd').split(',')
				};

			if (! self.dfrLoad || 'pending' !== self.dfrLoad.state()) {
				self.dfrLoad = $.Deferred();
			}
				
			if (isFromServer) {

				z.xAsync('UseLog', 'zeons_메뉴별접속로그', 'select', param, 'json').done(function(resp) {
					// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
					self.rawDataArr = $.extend(true, [], resp);
					
					for (var i in self.rawDataArr) {
						var row = self.rawDataArr[i];
						
						row['클릭수'] = parseInt(row['클릭수']);
					}


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
						text: '페이지뷰'
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
				rankArr = self.xAxisArr,
				clickData = [
					{
						name: '페이지뷰',
						data: Array.apply(null, Array(rankArr.length)).map(function() {return 0;})
					}
				];
				
			for (var i in clickData) {
				chartSeries.push(clickData[i]);
			}

			for (var i = 0, len = rawDataArr.length; len > i; ++i) {
				var row = rawDataArr[i],
					idx = rankArr.indexOf(row['메뉴명']);
				
				if (0 > idx) {
					continue;
				}
				
				clickData[0].data[idx] = row['클릭수'];
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
					
					XLSX.utils.book_append_sheet(wb, workSheet, '인기_페이지');
					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_인기_페이지.xlsx');
				});
			});			
		},
		
		loadData: function() {
			return useLogPageViewCount.loadData();
		},
		
		updateData: function() {
			var self = this,
				$tbody = self.$wrapper.find('[data-table="body"] > tbody'),
				rawDataArr = self.rawDataArr,
				tmpl = Handlebars.compile($('#tmplTableLogClick').html()),
				total = 0;
				
			// 사용률 퍼센트 계산
			for (var i in rawDataArr) {
				total += rawDataArr[i]['클릭수'];
			}
			
			if (0 < total) {
				for (var i in rawDataArr) {
					var row = rawDataArr[i];
					
					row['사용률'] = (Math.round(1000.0 * row['클릭수'] / total) / 10) + '%';
				}
			}

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
	

	var tableVisit = {
		init: function(param) {
			var self = this;
			
			self.param = param;
			self.$wrapper = $('[data-wrapper=tableVisit]');

			self.$wrapper.find('[data-date]').text(moment(param.endYMD, 'YYYYMMDD').format('YYYY.MM.DD'));
			
			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		
		setBtnListener: function() {},
		
		loadData: function() {
			var self = this,
				param = {
					dateStart: self.param.endYMD,
					dateEnd: self.param.endYMD
				};
			
			return z.xAsync('UseLog', 'zeons_사용자접속로그', 'select', param, 'json').done(function(resp) {
				var rawDataArr = $.extend(true, [], resp);

				self.rawDataArr = rawDataArr;
			});
		},
		
		updateData: function() {
			var self = this,
				$cnt = self.$wrapper.find('[data-cnt]');
			
			$cnt.html(z.toComma(self.rawDataArr && self.rawDataArr.length || 0) + '<em>명</em>');
		}
	};	


	var tableLogMinMax = {
		init: function(param) {
			var self = this;
			
			self.param = param;
			self.$wrapper = $('[data-wrapper=tableLogMinMax]');
			
			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		
		setBtnListener: function() {},
		
		loadData: function() {
			var self = this,
				param = {
					dateStart: self.param.startYMD,
					dateEnd: self.param.endYMD
				};
				
			return $.when(
				useLogPageViewCount.loadData(),
				z.xAsync('UseLog', 'zeons_주요검색지역', 'select', param, 'json'),
				z.xAsync('UseLog', 'zeons_주요다운로드메뉴', 'select', param, 'json')
			).done(function(menuArr, searchArr, downArr) {
				
				menuArr = $.extend(true, [], menuArr);
				searchArr = $.extend(true, [], searchArr);
				downArr = $.extend(true, [], downArr);

				menuArr = menuArr.slice(0, 3);
				downArr = downArr.slice(0, 3);
				
				var dataMap = searchArr.reduce(function(rv, elm, idx) {
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

				searchArr = Object.values(dataMap).sort(function(a, b) {
					if (a['클릭수'] < b['클릭수']) {
						return 1;
					}
					if (a['클릭수'] > b['클릭수']) {
						return -1;
					}
					return 0;
				});

				searchArr = searchArr.slice(0, 3);
				
				for (var i in menuArr) {
					var row = menuArr[i];
					
					row.title = row['메뉴명'];
					row.tdText = '<span>' + z.toComma(row['클릭수']) + '</span>건';
				}

				for (var i in searchArr) {
					var row = searchArr[i];
					
					row.title = row['검색지역'];
					row.tdText = '<span>' + z.toComma(row['클릭수']) + '</span>건';
				}


				for (var i in downArr) {
					var row = downArr[i];
					
					row.title = row['주요다운로드'];
					row.tdText = '<span>' + z.toComma(row['클릭수']) + '</span>건';
				}
			
				self.minMaxArr = [
					menuArr,
					searchArr,
					downArr
				];
			});
		},
		
		updateData: function() {
			var self = this,
				$list = self.$wrapper.find('ul[data-list]'),
				minMaxArr = self.minMaxArr,
				tmpl = Handlebars.compile($('#tmplTableLogMinMax').html());

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
			useLogPageViewCount.init(param);
			tableVisit.init(param);
			tableLogClick.init(param);
			tableLogMinMax.init(param);
		}
    };
}();

$(function() {
	var yesterday = moment().endOf('day').subtract(1, 'days'),
		start = yesterday.clone().subtract(1, 'months'),
		param = {
			startYMD: start.format('YYYY-MM-DD'),
			endYMD: yesterday.format('YYYY-MM-DD')
		};

	KTDatatableUserLog.setTime(param);
});

function userCount(){
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


