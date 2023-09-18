/*'use strict';*/
var primary = '#4b8eef';
var success = '#7ed0f3';
var info = '#ff6f38';
var warning = '#ffac5c';
var danger = '#F64E60';
var excelyn;

var apiDashBoard = function() {
	var prevAddr = { 
		sidonm: '',
		sggnm: '',
		dongnm: '',
		sidocd: '',
		sggcd: '',
		dongcd: ''
	},
	$addrWrapper = $('#addrWrapper'),
	$listSido = $addrWrapper.children().eq(0),
	$listSgg = $addrWrapper.children().eq(1),
	$listDong = $addrWrapper.children().eq(2),
	$btnSearchAddr = $('#btnSearchAddr'),
	$btnSearchAddrSido = $btnSearchAddr.find('[data-addr-sido]'),
	$btnSearchAddrSgg = $btnSearchAddr.find('[data-addr-sgg]'),
	$btnSearchAddrDong = $btnSearchAddr.find('[data-addr-dong]'),
	$divSearchAddr = $('#divSearchAddr'),
	$divSearchAddrSido = $divSearchAddr.find('[data-addr-sido]'),
	$divSearchAddrSgg = $divSearchAddr.find('[data-addr-sgg]'),
	$divSearchAddrDong = $divSearchAddr.find('[data-addr-dong]'),
	tmplAddr = Handlebars.compile($('#tmplAddrList').html()),
	sidoArr = null,
	sggArr = null,
	dongArr = null,
	initAddr = false,
	apiMap = null;

	var sanggaArr = [
		'근린상가',
		'단지내상가',
		'복합상가',
		'테마상가',
		'오피스상가',
		'기타상가'
	];
	var sanggaMap = {
		'근린상가': 0,
		'단지내상가': 1,
		'복합상가': 2,
		'테마상가': 3,
		'오피스상가': 4,
		'기타상가': 5
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
	
	var	areaTypeArr2 = [
		'1，000㎡ 미만',
		'1，000㎡~3，000㎡',
		'3，000㎡~5，000㎡',
		'5，000㎡~7，000㎡',
		'7，000㎡~10，000㎡',
		'10，000㎡~15，000㎡',
		'15，000㎡~30，000㎡',
		'30，000㎡ 이상'
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
	
	var popTypeArr = [
		'거주인구',
		'유동인구',
		'직장인구'
	];
	
	var popTypeMap = {
		'거주인구' : 0,
		'유동인구' : 1,
		'직장인구' : 2
	};
	
	var indTypeArr = [
		  '관광/오락'
		, '부동산'
		, '생활서비스'
		, '소매'
		, '숙박'
		, '스포츠'
		, '음식'
		, '학문/교육'
	];

	var indTypeArr_new = [
		'과학·기술',
		'교육',
		'보건의료',
		'부동산',
		'소매',
		'수리·개인',
		'숙박',
		'시설관리·임대',
		'예술·스포츠',
		'음식'
	];
	
	var indTypeMap = {
		  '관광/여가/오락' : 0
		, '부동산' : 1
		, '생활서비스' : 2
		, '소매' : 3
		, '숙박' : 4
		, '스포츠' : 5
		, '음식' : 6
		, '학문/교육' : 7
	};

	var indTypeMap_new = {
		'과학·기술': 0,
		'교육': 1,
		'보건의료': 2,
		'부동산': 3,
		'소매': 4,
		'수리·개인': 5,
		'숙박': 6,
		'시설관리·임대': 7,
		'예술·스포츠': 8,
		'음식': 9
	};

	
	var listAddr = {
		init: function(){
		var self = this;
		
		KTUtil.scrollInit($listSido[0],{
			mobileNativeScroll: true,
			handleWindowResize: true,
			rememberPosition: ($listSido.data('remember-position') == 'true' ? true : false)
		});
		
		KTUtil.scrollInit($listSgg[0], {
			mobileNativeScroll: true,
			handleWindowResize: true,
			rememberPosition: ($listSgg.data('remember-position') == 'true' ? true : false)
		});

		KTUtil.scrollInit($listDong[0], {
			mobileNativeScroll: true,
			handleWindowResize: true,
			rememberPosition: ($listDong.data('remember-position') == 'true' ? true : false)
		});
	},
	listPrivate : function(jsonText){
		return z.xAsync("Dashboard", "zeons_지역상권현황", "select", jsonText, "json2");
	},
	updateSidoList : function() {
		var self = this;
		if (sidoArr) {
			return $.Deferred().resolve({response: sidoArr});
		}
		
		return self.listPrivate({
		}).done(function(resp) {
			var	$list = $listSido.children('ul');
			var sidoAll = {'sidocd': '00', 'sidonm': '전국'};
			sidoArr = resp;
			sidoArr.unshift(sidoAll);
			$list.append(tmplAddr({sidoArr: sidoArr}));
			
			// 지역현황판 메뉴 내 선택한 지역설정 값 유지
			var addr = {
				sidonm : dashboardSelectedAddr.sidonm,
				sggnm : dashboardSelectedAddr.sggnm,
				dongnm : dashboardSelectedAddr.dongnm,
				sidocd : dashboardSelectedAddr.sidocd.substr(0, 2),
				sggcd : dashboardSelectedAddr.sggcd.substr(0, 5),
				dongcd : dashboardSelectedAddr.dongcd.substr(0, 8)
			}
			
			prevAddr.sggnm = addr.sggnm;
			
			$listSido.find('ul a').removeClass('active');
			$listSido.find('[data-list-addr-sido="' + addr.sidonm + '"]').addClass('active');
			self.updateAddr(addr);	
		});
	},
	updateSggList : function(sidonm, sidocd) {
		var self = this;
		return self.listPrivate({
			sidocd: sidocd
		}).done(function(resp) {	
			sggArr = resp;		
			var	$list = $listSgg.children('ul');
			// 동 정보도 삭제
			$listDong.children('ul').children(':not(.all-item)').remove();
			if(!initAddr){				
				if (prevAddr.sggnm == '') {
					$list.children('.all-item').children().addClass('active');
					$list.children(':not(.all-item)').remove();
					$list.append(tmplAddr({sggArr: sggArr})); 
				} else {
					$list.append(tmplAddr({sggArr: sggArr}));
					$list.find('[data-list-addr-sgg="' + prevAddr.sggnm + '"]').addClass('active');	
					$list.children('.all-item').children().removeClass('active');	
				}						
			} else {
				$list.children('.all-item').children().addClass('active');
				$list.children(':not(.all-item)').remove();
				$list.append(tmplAddr({sggArr: sggArr})); 
				self.updateDongList();				
			}				
		});
	},
	updateDongList : function(sggnm, sggcd, dongnm, dongcd) {
		var self = this;
		var	$list = $listDong.children('ul');
		return self.listPrivate({
			sidocd: prevAddr.sidocd,
			sggcd: prevAddr.sggcd      
		}).done(function(resp) {
			dongArr = resp;
			$list.children(':not(.all-item)').remove();			
			if(!initAddr){
				if(sggcd == ""){
					dongArr = {};
					$list.children('.all-item').children().addClass('active');
					$list.append(tmplAddr({dongArr: dongArr})); 
				} else {
					$list.append(tmplAddr({dongArr: dongArr})); 
					$list.find('[data-list-addr-dong="' + prevAddr.dongnm + '"]').addClass('active');	
					$list.children('.all-item').children().removeClass('active');	
				}
				initAddr = true;						
			} else {
				if(sggcd == ""){
					dongArr = {};
				}
				$list.children('.all-item').children().addClass('active');
				$list.append(tmplAddr({dongArr: dongArr})); 
			}
			$list.find('[data-list-addr-dong="' + dongnm + '"]').addClass('active');			
		});
	},
	updateAddr : function(addr) {
		var self = this;
		if(!initAddr){				
			$btnSearchAddrSido.text(addr.sidonm);
			$btnSearchAddrSgg.text(addr.sggnm);
			$btnSearchAddrDong.text(addr.dongnm);
			$divSearchAddrSido.text(addr.sidonm);
			$divSearchAddrSgg.text((addr.sggnm == '' ? '전체' : addr.sggnm));
			$divSearchAddrDong.text((addr.dongnm == '' ? '전체' : addr.dongnm));
		}	
		prevAddr.sidonm = addr.sidonm;
		prevAddr.sggnm = addr.sggnm;
		prevAddr.dongnm = addr.dongnm;
		prevAddr.sidocd = addr.sidocd;
		prevAddr.sggcd = addr.sggcd;
		prevAddr.dongcd = addr.dongcd;
		
		self.updateSggList(addr.sidonm, addr.sidocd).then(function(){
			return self.updateDongList(addr.sggnm, addr.sggcd, addr.dongnm, addr.dongcd);
		}).fail(console.log.bind(console));
	}
}		    

//임대료변동율
var chart_1_1 = { 
	init: function(param) {
		var self = this,
			thisYear =  Math.floor(moment().format('YYYY'));
		self.apexChart = '#chartRentChange';	
		self.$wrapper = $(self.apexChart).closest('[data-chart-wrapper]');
		self.param = param;
		self.diffYear = 3;
		self.maxYearInt = thisYear;
		self.minYearInt = self.maxYearInt - self.diffYear;
					
		// 차트 초기화 퍼블리싱 코드 옮겨옴		
		var options = {
			series: [{
				name: '누적동향',
				data: [0, 0, 0]
			}, {
				name: '당해년도 물량',
				data: [0, 0, 0]
			}],
			chart: {
		        type: 'line',
		        toolbar: {
		            show: true,
		            offsetY: -40,
		            export: {
						csv: {
							headerCategory: '\uFEFF',
							//columnDelimiter: ';',
							filename: '임대료 변동율'
						}	
					}
		        },
		        width: '100%',
		        height: '90%',
		        zoom: {
		            enabled: false,
		        },
		        events: {
		           	click: function(event, chartContext, config) {
			    		var $target = $(event.target);
			    		if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG') || $target.hasClass('exportCSV')) {
			    			z.addDownloadLog('임대료변동율', 'chart');
			    		}	
		    			if(excelyn == "N"){
		    				$('#chartRentChange .exportCSV').css("display", "none");
						} else {
							$('#chartRentChange .exportCSV').css("display", "block");
						};
		           	}
		     	}
	        },
			dataLabels: {
				enabled: false
			},
			xaxis: {
				categories: ['', '', ''],
				tooltip: {
					enabled: false
				}
			},
			yaxis: [{
				title: {
					text: '변동율'
				}
			}],
			colors: ['#5e58c9','#2985d2','#2eb7c4','#6d9d64','#b5bf1b','#f1c644','#f28f6c'],
		    stroke: {
		        show: true,
		        width: 2,
		        dashArray: 0,
		    },
		    markers: {
		        size: 5,
		        colors: ['#5e58c9','#2985d2', '#2eb7c4','#6d9d64','#b5bf1b','#f1c644','#f28f6c'],
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
		        fontSize: '8px',
		        fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
		        fontWeight: 300,
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

		var chart = new ApexCharts($(self.apexChart)[0], options);
		
		self.chart = chart;
		self.setBtnListener();
		
		chart.render().then(function() {
			chart.updateSeries([]);
			if (self.param) {
				self.loadData().done(function(resp) {
					self.loadAxis();
					self.updateData();
				});
			}
		});

		z.formatDataReference('매물').done(function(refText) {
			self.$wrapper.find('.card-footer .unit').text(refText);
		});
	},
	setBtnListener: function() {
	},
	// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
	loadData: function() {
		var self = this;
		var ls_sql = '상가유형별평균임대료';
		
		if(prevAddr.dongcd != ""){
			self.param.jusoCd = 'emd'
			self.param.pnu = self.param.dongcd;
		} else if(prevAddr.dongcd == "" && prevAddr.sggcd != "" ){
			self.param.jusoCd = 'sgg'
			self.param.pnu = self.param.sggcd;
		} else {
			self.param.jusoCd = 'sido'
			self.param.pnu = self.param.sidocd;
		}	
		
		self.param.endYMD = self.maxYearInt;
		self.param.startYMD = self.minYearInt;
		
		return z.xAsync('Dashboard', ls_sql, 'select', self.param, 'json').done(function(resp) {
			self.rawDataArr = resp;
		});
	},
	loadAxis: function() {
		var self = this,
		rawDataArr = self.rawDataArr,
		xAxisArr = [],
		yAxisObj = {
			title: {
				text: ''
			},
			labels: {
				formatter: function(value) {
					value =  Math.round(value * 100) / 100 + '%';
					return value;
				}
			}
		};
		for (var i = 0; self.diffYear > i; ++i) {
			xAxisArr.push('' + (self.minYearInt + i + 1));
		}

		// 엑셀 저장용 정보로도 활용될 예정
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
		self.updateDataByRent(chartOptions, chartSeries);
		self.chart.updateOptions(chartOptions);
		self.chart.updateSeries(chartSeries);			
		
	},
	updateDataByRent: function(chartOptions, chartSeries){
		var self = this,
			prevData,
			preRentAmt,
			thisRentAmt,
			copyPrevData,
			copyChartSeries = [];
		
		// 원본 복사 후 복사본 정렬
		var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));
		
		for (var i in sanggaArr) {
			prevData = {
				name: sanggaArr[i],
				data: []
			};
			chartSeries.push(prevData);
			for (var j = 0; self.diffYear > j; ++j) {
				prevData.data.push(0);
			}
			
			copyPrevData = {
				name: sanggaArr[i],
				data: []	
			};
			copyChartSeries.push(copyPrevData);
			for (var j = 0; self.diffYear >= j; ++j) {
				copyPrevData.data.push(0);
			}
		}

		
		for (var i in rawDataArr) {
			var raw = rawDataArr[i],
				idxData = sanggaArr.indexOf(raw['상가유형']),
				rawYear = raw['period'];
			if (isNaN(idxData) || idxData < 0) {
				continue;
			}
			var idxYear = parseInt(rawYear) - self.minYearInt;
			copyChartSeries[idxData].data[idxYear] += parseFloat(raw['rent_ua']);
		}
		for(var i in chartSeries) {
			var series = chartSeries[i];
			var copyRentData = copyChartSeries[i];
			for (var j in series.data) {
				var	rentIdx = Number(j) + 1;
				series.data[j] = Math.round((copyRentData.data[rentIdx] /  copyRentData.data[j] - 1) * 100 * 100) / 100;
				if (isNaN(series.data[j])) {
					series.data[j] = null;
				}
				if (series.data[j] === Infinity ) {
					series.data[j] = 0;
				}
			}
		}
	}
}

// 공급동향
var chart_2_1 = {
	    init: function(param) {
	        var self = this,
			thisYear = Math.floor(moment().format('YYYY'));	
	        self.apexChart = '#chartSupply';   
	        self.$wrapper = $(self.apexChart).closest('[data-chart-wrapper]');
	        self.diffYear = 3;
	        self.maxYearInt = thisYear;
	        self.minYearInt = self.maxYearInt - self.diffYear + 1;
	        self.param = param;
	        // 차트 초기화 퍼블리싱 코드 옮겨옴

	        self.setBtnListener();

	        if (self.param) {
	            // 중간중간 빈칸도 있어서 활용 차 추가 ㅠㅠ
	            self.loadData().done(function(resp) {
	                self.loadAxis();
	                self.updateData();
	            });
	        }

			z.formatDataReference('상가').done(function(refText) {
				self.$wrapper.find('.card-footer .unit').text(refText);
			});
	        
	    },
	    setBtnListener: function() {
	    },
	    // 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
	    loadData: function() {
	        var self = this;
	        self.param.year = self.maxYearInt;
	        return z.xAsync('Dashboard', '공급동향_1', 'select', self.param, 'json').done(function(resp) {
	            self.rawDataArr = resp;
	        });
	    },
	    loadAxis: function() {
	        var self = this,
	        rawDataArr = self.rawDataArr,
	        xAxisArr = $.extend(true, [], sanggaArr);
	        
	        // 엑셀 저장용 정보로도 활용될 예정
	        self.xAxisArr = xAxisArr;
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
	        self.updateDataBySector(chartOptions, chartSeries);
	        var options = {
	            series: chartSeries,
	            colors: ['#b5d130','#2eb7c4','#2985d2'],
	            chart: {
	                width:'100%',
	                height: '75%',
	                type: 'bar',
	                stacked: true,
	                zoom: {
	                    enabled: true
	                },
	                toolbar: {
	                    show: true,
						offsetY: -40,
			            export: {
			            	csv: {
								headerCategory: '\uFEFF',
								//columnDelimiter: ';',
								filename: '공급동향_상가'
							}
						}
	                },
					events: {
						click: function(event, chartContext, config) {
				    		var $target = $(event.target);
				    							
				    		if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
				    			z.addDownloadLog('공급동향_상가', 'chart');
				    		}

			    			if(excelyn == "N"){
			    				$('#chartSupply .exportCSV').css("display", "none");
							} else {
								$('#chartSupply .exportCSV').css("display", "block");
							};
			           	}
					}
	            },
	            responsive: [{
	                breakpoint: 480,
	                options: {
	                    legend: {
	                        position: 'bottom',
	                        offsetX: -10,
	                        offsetY: 0
	                    }
	                }
	            }],         
	            plotOptions: {
	                bar: {
	                    horizontal: true,
	                },
	            },
	            stroke: {
	                width: 1,
	                colors: ['#fff']
	            },
	            legend: {
	                showForSingleSeries: true,
	                showForNullSeries: true
	            },
	            dataLabels: {   
	                enabled: false
	            },              
	            xaxis: {
	                categories: sanggaArr,
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
	            grid: {
	                show: false,
	            },
	            legend: {
	                show: true,
	                position: 'bottom',
	                horizontalAlign: 'left',
	                fontSize: '10px',
	                fontFamily: 'Noto Sans Korean',
	                fontWeight: 400,
	                offsetY: 8,
	                markers: {
	                    width: 8,
	                    height: 8,
	                    radius: 12,
	                },
	            },
	            fill: {
	                opacity: 1
	            },          
	            yaxis: {
	                title: {
	                    text: undefined
	                },
	                labels: {
	                    formatter: function (value) {
	                        return value.toLocaleString()
	                    }
	                }
	            }
	        };
	        
	        if (self.chart) {
	            self.chart.destroy();
	        }

	        var chart = new ApexCharts($(self.apexChart)[0], options);
	        
	        self.chart = chart;

	        chart.render();
	    },
	    updateDataBySector: function(chartOptions, chartSeries){
	        var self = this,
	            prevSanggaType = '',
	            prevData,
	            idxData;

	        // 원본 복사 후 복사본 정렬
	        var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));
	        
	        if (rawDataArr == null) return;
	        
	        // 목록에 일단 전부 넣어놓아야 null 목록도 표시됨 ㅠㅠ
	        for (var j = 0; self.diffYear > j; ++j) {	        	
	        	/*alert(self.maxYearInt - self.diffYear + (j + 1));*/
	            prevData = {
	                name: self.maxYearInt - self.diffYear + (j + 1),
	                data: []
	            }
	            
	            chartSeries.push(prevData);
	            
	            for (var i in sanggaArr) {
	                prevData.data.push(0);
	            }
	        }       
	        
	        for (var i in rawDataArr) {
	            var raw = rawDataArr[i];
	            idxData = sanggaMap[raw['상가유형']];
	            
	            if (isNaN(idxData)) {
	                continue;
	            }
	            // 5년 이내에 들어오는 데이터만 추가
	            var idxYear = parseInt(raw['년도']) - self.minYearInt;
	            if (idxYear < self.diffYear) {
	                chartSeries[idxYear].data[idxData] += parseFloat(raw['총점포수']);
	            }
	        }
	    }
	}

// 연면적별공급동향
var chart_2_2 = {
	    init: function(param) {
	        var self = this,
				thisYear = Math.floor(moment().format('YYYY'));	;
	        self.apexChart = '#chartSupply2';   
	        self.$wrapper = $(self.apexChart).closest('[data-chart-wrapper]');
	        self.diffYear = 3;
	        self.maxYearInt = thisYear;
	        self.minYearInt = self.maxYearInt - self.diffYear + 1;
	        self.param = param;
	        // 차트 초기화 퍼블리싱 코드 옮겨옴
	        
	        self.setBtnListener();

	        if (self.param) {
	            // 중간중간 빈칸도 있어서 활용 차 추가 ㅠㅠ
	            self.loadData().done(function(resp) {
	                self.loadAxis();
	                self.updateData();
	            });
	        }
	    },
	    setBtnListener: function() {
	    },
	    // 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
	    loadData: function() {
	        var self = this;
	        self.param.year = self.maxYearInt;
	        return z.xAsync('Dashboard', '연면적별공급동향', 'select', self.param, 'json').done(function(resp) {
	            self.rawDataArr = resp;
	        });
	    },
	    loadAxis: function() {
	        var self = this,
	        rawDataArr = self.rawDataArr,
	        xAxisArr = $.extend(true, [], areaTypeArr);
	        
	        // 엑셀 저장용 정보로도 활용될 예정
	        self.xAxisArr = xAxisArr;
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
	        self.updateDataBySector(chartOptions, chartSeries);
	        var options = {
	            series: chartSeries,
	            colors: ['#b5d130','#2eb7c4','#2985d2'],
	            chart: {
	                width:'100%',
	                height: '75%',
	                type: 'bar',
	                stacked: true,
	                zoom: {
	                    enabled: true
	                },
	                toolbar: {
	                    show: true,
						offsetY: -40,
			            export: {
			            	csv: {
								headerCategory: '\uFEFF',
								//columnDelimiter: ';',
								filename: '공급동향_면적'
							}
						}
	                },
					events: {
						click: function(event, chartContext, config) {
				    		var $target = $(event.target);
				    							
				    		if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
				    			z.addDownloadLog('공급동향_면적', 'chart');
				    		}

			    			if(excelyn == "N"){
			    				$('#chartSupply2 .exportCSV').css("display", "none");
							} else {
								$('#chartSupply2 .exportCSV').css("display", "block");
							};
			           	}
					}
	            },
	            responsive: [{
	                breakpoint: 480,
	                options: {
	                    legend: {
	                        position: 'bottom',
	                        offsetX: -10,
	                        offsetY: 0
	                    }
	                }
	            }],         
	            plotOptions: {
	                bar: {
	                    horizontal: true,
	                },
	            },
	            stroke: {
	                width: 1,
	                colors: ['#fff']
	            },
	            legend: {
	                showForSingleSeries: true,
	                showForNullSeries: true
	            },
	            dataLabels: {   
	                enabled: false
	            },              
	            xaxis: {
	                categories: areaTypeArr,
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
	            grid: {
	                show: false,
	            },
	            legend: {
	                show: true,
	                position: 'bottom',
	                horizontalAlign: 'left',
	                fontSize: '10px',
	                fontFamily: 'Noto Sans Korean',
	                fontWeight: 400,
	                offsetY: 8,
	                markers: {
	                    width: 8,
	                    height: 8,
	                    radius: 12,
	                },
	            },
	            fill: {
	                opacity: 1
	            },          
	            yaxis: {
	                title: {
	                    text: undefined
	                },
	                labels: {
	                    formatter: function (value) {
	                        return value.toLocaleString()
	                    }
	                }
	            }
	        };
	        
	        if (self.chart) {
	            self.chart.destroy();
	        }

	        var chart = new ApexCharts($(self.apexChart)[0], options);
	        
	        self.chart = chart;

	        chart.render();
	    },
	    updateDataBySector: function(chartOptions, chartSeries){
	        var self = this,
	            prevSanggaType = '',
	            prevData,
	            idxData;

	        // 원본 복사 후 복사본 정렬
	        var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));
	        
	        if (rawDataArr == null) return;
	        
	        // 목록에 일단 전부 넣어놓아야 null 목록도 표시됨 ㅠㅠ
	        for (var j = 0; self.diffYear > j; ++j) {
	            prevData = {
	                name: self.maxYearInt - self.diffYear + (j + 1),
	                data: []
	            }
	            
	            chartSeries.push(prevData);
	            
	            for (var i in areaTypeArr) {
	                prevData.data.push(0);
	            }
	        }     

	        for (var i in rawDataArr) {
	            var raw = rawDataArr[i];
	            idxData = areaTypeMap[raw['연면적코드']];
	            
	            if (isNaN(idxData)) {
	                continue;
	            }
	            // 3년 이내에 들어오는 데이터만 추가
	            var idxYear = parseInt(raw['년도']) - self.minYearInt;

	            if (idxYear < self.diffYear) {
//	                chartSeries[idxYear].data[idxData] += parseFloat(raw['연면적']);
					chartSeries[idxYear].data[idxData] += parseFloat(raw['총점포수']);
	            }
	        }
	    }
	}

// 평균분양가
var chart_3_1 = {
	init: function(param) {
		var self = this,
			thisYear = Math.floor(moment().format('YYYY'));	;
		self.apexChart = '#chartAverageRent';	
		self.$wrapper = $(self.apexChart).closest('[data-chart-wrapper]');
		self.diffYear = 3;		
		self.maxYearInt = thisYear;
		self.minYearInt = self.maxYearInt - self.diffYear + 1;
		self.param = param;
		// 차트 초기화 퍼블리싱 코드 옮겨옴
		var options = {
			series: [{
				name: '근린상가',
                data: [0, 0, 0]
            }],
			chart: {
				type: 'bar',
		        toolbar: {
		            show: true,
		            offsetY: -40,
		            export: {
		            	csv: {
							headerCategory: '\uFEFF',
							filename: '평균분양가'
						}
					}
		        },
		        width: '100%',
		        height: '80%',
				events: {
					updated: function() {
						if (self.updateTimeout) {
							return;
						}
						self.updateTimeout = setTimeout(function() {
							clearTimeout(self.updateTimeout);
							self.updateTimeout = null;
						}, 200);
					},
					click: function(event, chartContext, config) {
			    		var $target = $(event.target);
			    							
			    		if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
			    			z.addDownloadLog('평균분양가', 'chart');
			    		}

		    			if(excelyn == "N"){
		    				$('#chartAverageRent .exportCSV').css("display", "none");
						} else {
							$('#chartAverageRent .exportCSV').css("display", "block");
						};
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
			xaxis: {
				categories: []
			},
			colors: ['#5e58c9','#2985d2','#2eb7c4','#6d9d64','#b5bf1b','#f1c644','#f28f6c'],
		    dataLabels: {
		        enabled: false,
		    },
		    markers: {
		        size: 5,
		        colors: ['#5e58c9','#2985d2', '#2eb7c4','#6d9d64','#b5bf1b','#f1c644','#f28f6c'],
		        strokeColors: '#fff',
		        strokeWidth: 2,
		        strokeOpacity: 0.9,
		        strokeDashArray: 0,
		        fillOpacity: 1,
		        discrete: [],
		        shape: "circle",
		        radius: 2,
		        offsetX: 0,
		    },
			tooltip: {
				y: {
	                formatter: function(value) {
	                	var str = '만원 / 3.3㎡';
						return z.toComma(value) + ' ' + str;
					}
				}
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
				// 중간중간 빈칸도 있어서 활용 차 추가 ㅠㅠ
				self.loadData().done(function(resp) {
					self.loadAxis();
					self.updateData();
				});
			}
		}).catch(error => console.log(error));

		z.formatDataReference('상가').done(function(refText) {
			self.$wrapper.find('.card-footer .unit').text(refText);
		});
	},
	setBtnListener: function() {
	},
	loadData: function() {
		var self = this;
		self.param.year = self.maxYearInt;
		return z.xAsync('Dashboard', '평균분양가_1', 'select', self.param, 'json').done(function(resp) {
			self.rawDataArr = resp;
		});
	},
	loadAxis: function() {
		var self = this,
			rawDataArr = self.rawDataArr,
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

		for (var i = 0; self.diffYear > i; ++i) {
			xAxisArr.push('' + (self.minYearInt + i));
		}
		
		if (rawDataArr == null) return;
		// 정렬: 상가종류, 분양연도 오름차순
		// 연도 - 1년 기간, 년도 - 10년 기간 ㄷㄷ
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
	updateData: function() {
		var self = this,
		chartOptions = {
			xaxis: {
				categories: self.xAxisArr
			},
			yaxis: self.yAxisObj
		},
		chartSeries = [];

		self.updateDataBySale(chartOptions, chartSeries);

		self.chart.updateOptions(chartOptions);
		self.chart.updateSeries(chartSeries);

	},
	updateDataBySale: function(chartOptions, chartSeries){
		var self = this,
			prevSanggaType = '',
			prevData,
			idxData;

		// 원본 복사 후 복사본 정렬
		var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));
		
		if (rawDataArr == null) return;
		
		// 목록에 일단 전부 넣어놓아야 null 목록도 표시됨 ㅠㅠ
		for (var i in sanggaArr) {
			prevData = {
				name: sanggaArr[i],
				data: [],
//				cnt: []
				area: []
			}
			
			chartSeries.push(prevData);
			
			for (var j = 0; self.diffYear > j; ++j) {
				prevData.data.push(0);
				prevData.area.push(0);
//				prevData.cnt.push(0);
			}
		}		

		for (var i in rawDataArr) {
			var raw = rawDataArr[i],
				idxData = sanggaMap[raw['상가유형']];

			if (isNaN(idxData)) {
				continue;
			}
			// 5년 이내에 들어오는 데이터만 추가
			var idxYear = parseInt(raw['년도']) - self.minYearInt;
			
			if (idxYear < self.diffYear) {
//				chartSeries[idxData].data[idxYear] += parseFloat(raw['전용면적당분양가']);
//				chartSeries[idxData].cnt[idxYear] += 1;
				chartSeries[idxData].data[idxYear] += parseFloat(raw['분양가']);	
				chartSeries[idxData].area[idxYear] += parseFloat(raw['전용면적']);
			}
		}

		for (var i in chartSeries) {
			var seriesData = chartSeries[i];

			for (var j = 0; j < seriesData.data.length; j++) {
				if (seriesData.data[j] > 0 && seriesData.area[j] > 0) {
					seriesData.data[j] = seriesData.data[j] / seriesData.area[j]; 						
				}				
			}
		}
	
		
		for (var i in chartSeries) {
			var series = chartSeries[i];
			
			for (var j in series.data) {
				series.data[j] = Math.round(series.data[j] * zo.py2m);
			}
		}
	}
}	
	
// 평균임대료
var chart_4_1 = { 
	init: function(param) {
		var self = this,
			thisYear = Math.floor(moment().format('YYYY'));	;
		self.apexChart = '#chartAveragesale';	
		self.$wrapper = $(self.apexChart).closest('[data-chart-wrapper]');
		self.diffYear = 2;
		self.maxYearInt = thisYear;
		self.minYearInt = self.maxYearInt - self.diffYear;
		self.param = param;
		
		// 차트 초기화 퍼블리싱 코드 옮겨옴
		var options = {
			series: [{
				name: '상가유형별 평균임대료',
                data: [0, 0, 0, 0, 0]
            }],
			chart: {
				type: 'bar',
			        toolbar: {
			            show: true,
			            offsetY: -40,
			            export: {
			            	csv: {
								headerCategory: '\uFEFF',
								//columnDelimiter: ';',
								filename: '평균임대료'
							}
						}
			        },				
		        width: '100%',
		        height: '80%',
		        //stacked: true,
				zoom: {
					enabled: false
				},
				events: {
					updated: function() {
						// 중복호출 최소화... 핵쟁이 다되겠네							
						if (self.updateTimeout) {
							return;
						}
						self.updateTimeout = setTimeout(function() {
							clearTimeout(self.updateTimeout);
							self.updateTimeout = null;
						}, 200);
					},
					click: function(event, chartContext, config) {
			    		var $target = $(event.target);
			    							
			    		if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
			    			z.addDownloadLog('평균임대료', 'chart');
			    		}

		    			if(excelyn == "N"){
		    				$('#chartAveragesale .exportCSV').css("display", "none");
						} else {
							$('#chartAveragesale .exportCSV').css("display", "block");
						};
		           	}
				}
			},
			dataLabels: { 	
				enabled: false
			},
			tooltip: {
				y: {
	                formatter: function(value) {
	                	var str = '만원 / 3.3㎡';
						return value + ' ' + str;
					}
				}
			},
			xaxis: {
				categories: []
			},
			colors: ['#5e58c9','#2985d2','#2eb7c4','#6d9d64','#b5bf1b','#f1c644','#f28f6c'],
//		    stroke: {
//		        show: true,
//		        // curve: 'smooth',
//		        lineCap: 'butt',
//		        colors: '#ffffff',
//		        width: 2,
//		        dashArray: 0,
//		    },
		    dataLabels: {
		        enabled: false,
		    },
		    markers: {
		        size: 5,
		        colors: ['#5e58c9','#2985d2', '#2eb7c4','#6d9d64','#b5bf1b','#f1c644','#f28f6c'],
		        strokeColors: '#fff',
		        strokeWidth: 2,
		        strokeOpacity: 0.9,
		        strokeDashArray: 0,
		        fillOpacity: 1,
		        discrete: [],
		        shape: "circle",
		        radius: 2,
		        offsetX: 0,
		        // offsetY: 0,
		        // onClick: undefined,
		        // onDblClick: undefined,
		        // showNullDataPoints: true,
		        // hover: {
		        //  size: undefined,
		        //  sizeOffset: 3
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
		        // formatter: undefined,
		        inverseOrder: false,
		        // width: undefined,
		        // height: undefined,
		        // tooltipHoverFormatter: undefined,
		        offsetX: 0,
		        offsetY: 0,
		        labels: {
		            // colors: undefined,
		            useSeriesColors: false
		        },
		        markers: {
		            width: 8,
		            height: 8,
		            strokeWidth: 0,
		            strokeColor: '#fff',
		            // fillColors: undefined,
		            radius: 12,
		            // customHTML: undefined,
		            // onClick: undefined,
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
		
		var chart = new ApexCharts($(self.apexChart)[0], options);
		 
		self.chart = chart;  
		self.setBtnListener();

		chart.render().then(function() {
			// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
			chart.updateSeries([]);

			if (self.param) {
				// 중간중간 빈칸도 있어서 활용 차 추가 ㅠㅠ
				self.loadData().done(function(resp) {
					self.loadAxis();
					self.updateData();
				});
			}
		}).catch(error => console.log(error));

		z.formatDataReference('매물').done(function(refText) {
			self.$wrapper.find('.card-footer .unit').text(refText);
		});
	},
	setBtnListener: function() {
	},
	// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
	loadData: function() {
		var self = this;
		var ls_sql = '상가유형별평균임대료';
		
		if(prevAddr.dongcd != ""){
			self.param.jusoCd = 'emd'
			self.param.pnu = self.param.dongcd;
		} else if(prevAddr.dongcd == "" && prevAddr.sggcd != "" ){
			self.param.jusoCd = 'sgg'
			self.param.pnu = self.param.sggcd;
		} else {
			self.param.jusoCd = 'sido'
			self.param.pnu = self.param.sidocd;
		}	
		self.param.endYMD = self.maxYearInt;
		self.param.startYMD = self.minYearInt;
		return z.xAsync('Dashboard', ls_sql, 'select', self.param, 'json').done(function(resp) {
			self.rawDataArr = resp;
		});
	},
	loadAxis: function() {
		var self = this,
			rawDataArr = self.rawDataArr,
			xAxisArr = [],
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

		for (var i = 0; self.diffYear >= i; ++i) {
			xAxisArr.push('' + (self.minYearInt + i));
		}
		
		if (rawDataArr == null) return;
		// 정렬: 상가종류, 분양연도 오름차순
		// 연도 - 1년 기간, 년도 - 10년 기간 ㄷㄷ
		rawDataArr = rawDataArr.sort(function(a, b) {
			if (a['period'] < b['period']) {
				return -1;
			}
			if (a['period'] > b['period']) {
				return 1;
			}
			return 0;
		});

		// 엑셀 저장용 정보로도 활용될 예정
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
		self.updateDataByAvg(chartOptions, chartSeries);
		self.chart.updateOptions(chartOptions);
		self.chart.updateSeries(chartSeries);			
	},
	updateDataByAvg: function(chartOptions, chartSeries){
		var self = this,
			prevSanggaType = '',
			prevData,
			idxData;

		// 원본 복사 후 복사본 정렬
		var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));
		if (rawDataArr == null) return;

		// 목록에 일단 전부 넣어놓아야 null 목록도 표시됨 ㅠㅠ
		for (var i in sanggaArr) {
			prevData = {
				name: sanggaArr[i],
				data: []
			}
			
			chartSeries.push(prevData);
			
			for (var j = 0; self.diffYear >= j; ++j) {
				prevData.data.push(0);
			}
		}	
		
		for (var i in rawDataArr) {
			var raw = rawDataArr[i];
			idxData = sanggaMap[raw['상가유형']];
			
			if (isNaN(idxData)) {
				continue;
			}
			// 5년 이내에 들어오는 데이터만 추가
			var idxYear = parseInt(raw['period']) - self.minYearInt;
			
			if (idxYear <= self.diffYear) {
				chartSeries[idxData].data[idxYear] += parseFloat(raw['rent_ua']);
			}
		}
		
		// 합산 이후에는 모든 데이터 소수점 2자리까지 출력
		for (var i in chartSeries) {
			var series = chartSeries[i];
			
			for (var j in series.data) {
				series.data[j] = Math.round(100 * series.data[j] * zo.py2m) / 100;
			}
		}
	}
}

// 매출정보
var chart_5_1 = { 
	init: function(param) {
		var self = this,
			thisYear = Math.floor(moment().format('YYYY'));
		self.apexChart = '#chartInformationTrend';	
		self.$wrapper = $(self.apexChart).closest('[data-chart-wrapper]');
		self.diffYear = 3;
		self.maxYearInt = thisYear;
		self.minYearInt = self.maxYearInt - self.diffYear + 1;
		self.param = param;
		// 차트 초기화 퍼블리싱 코드 옮겨옴
		var options = {
			series: [{
				name: '',
				type: 'column',
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		    }, {
		    	name: '',
		        type: 'line',
		        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		    }],
			chart: {
		        width:'100%',
		        height: '75%',
		        type: 'line',
		        stacked: false,
				zoom: {
					enabled: false
				},
                toolbar: {
                    show: true,
					offsetY: -40,
		            export: {
		            	csv: {
							headerCategory: '\uFEFF',
							//columnDelimiter: ';',
							filename: '매출'
						}
					}
                },
				events: {
					click: function(event, chartContext, config) {
			    		var $target = $(event.target);
			    							
			    		if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
			    			z.addDownloadLog('매출', 'chart');
			    		}

		    			if(excelyn == "N"){
		    				$('#chartInformationTrend .exportCSV').css("display", "none");
						} else {
							$('#chartInformationTrend .exportCSV').css("display", "block");
						};
		           	}
				}
			},
		    plotOptions: {
		        bar: {
		            horizontal: false,
		            columnWidth: '30%',
		            // endingShape: 'rounded'
		        },
		    },
		    markers: {
		        size: 5,
		        colors: ['#d45769'],
		        strokeColors: '#fff',
		        strokeWidth: 0,
		        strokeOpacity: 0.9,
		        strokeDashArray: 0,
		        fillOpacity: 1,
		        discrete: [],
		        shape: "circle",
		        radius: 2,
		        offsetX: 0,
		    },		    
			dataLabels: { 	
				enabled: false
			},
			labels: [],
	        xaxis: {
	            axisBorder: {
	                show: false,
	            },
				tooltip: {
					enabled: false
				}
			},		
			yaxis: [{
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
	                enabled: false
	            }
			}, {
	            // seriesName: '매출정보추이',
	            opposite: true,
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
	        tooltip: {
	            fixed: {
	                enabled: true,
					offsetY: -50
	            },
	            y: {
					formatter: function(value, setting) {
						if (! setting || 0 === setting.seriesIndex) {
							return z.toComma(value) + ' 억원';
						} else {
							return z.toComma(value) + '명';
						}
					}
				}
	        },
	        colors: ['#d4cfc9','#d45769'],
	        legend: {
	            show: true,
	            position: 'bottom',
	            horizontalAlign: 'left',
	            fontSize: '10px',
	            fontFamily: 'Noto Sans Korean',
	            fontWeight: 400,
	            offsetY: 8,
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
		
		var chart = new ApexCharts($(self.apexChart)[0], options);
		 
		self.chart = chart;  
		self.setBtnListener();
		
		chart.render().then(function() {
			// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
			chart.updateSeries([]);

			if (self.param) {
				self.loadData().done(function(resp) {
					self.loadAxis();
					self.updateData();
				});
			}
		}).catch(error => console.log(error));

		z.formatDataReference('매출').done(function(refText) {
			self.$wrapper.find('.card-footer .unit').text(refText);
		});
	},
	setBtnListener: function() {
	},
	// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
	loadData: function() {
		var self = this;
		self.param.year = self.maxYearInt;
		return z.xAsync('Dashboard', '매출정보추이_1_NEW', 'select', self.param, 'json').done(function(resp) {
			self.rawDataArr = resp;

			for (var i in resp) {
				var row = resp[i];
				
				row['매출액'] = Math.round(row['매출액']);
			}	
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
				}, {
					opposite: true,
					title: {
						text: ''
					},
					labels: {
						formatter: function(value) {
							return z.toComma(value);
						}
					}
				}];

		for (var i = 0; self.diffYear > i; ++i) {
			xAxisArr.push('' + (self.minYearInt + i));
		}
		
		if (rawDataArr == null) return;
		// 정렬: 상가종류, 분양연도 오름차순
		// 연도 - 1년 기간, 년도 - 10년 기간 ㄷㄷ
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
	updateData: function() {
		var self = this,
		chartOptions = {
			xaxis: {
				categories: self.xAxisArr
			},
			yaxis: self.yAxisObj
		},
		chartSeries = [];
		self.updateDataByAvg(chartOptions, chartSeries);
		self.chart.updateOptions(chartOptions);
		self.chart.updateSeries(chartSeries);			
	},
	updateDataByAvg: function(chartOptions, chartSeries){
		var self = this,
			prevSanggaType = '',
			prevData1,
			prevData2;

		// 원본 복사 후 복사본 정렬
		var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));
		
		if (rawDataArr == null) return;
		
		prevData1 = {
			name: '연도별 매출총액',
			type: 'column',
			data: []
		},
		prevData2 = {
			name: '연도별 유동인구',
			type: 'line',
			data: []
		}
			
		chartSeries.push(prevData1);
		chartSeries.push(prevData2);
			
		for (var j = 0; self.diffYear > j; ++j) {
			prevData1.data.push(0);
			prevData2.data.push(0);
		}
		
		for (var i in rawDataArr) {
			var raw = rawDataArr[i];
		
			// 5년 이내에 들어오는 데이터만 추가
			var idxYear = parseInt(raw['년도']) - self.minYearInt;
			
			if (idxYear < self.diffYear) {
				chartSeries[0].data[idxYear] = parseFloat(raw['매출액']);
				chartSeries[1].data[idxYear] = parseFloat(raw['유동인구']);
			}
		}

		// 단위 백만원으로 맞추기 > 억원 으로 변경
		var series = chartSeries[0];
		
		for (var i in series.data) {
			series.data[i] /= 10000 * 10000;
		}
		
		// 인구 만명단위로 수정
		series = chartSeries[1];
		/*
		for (var i in series.data) {
			series.data[i] /= 10000;
		}
		*/			
	}
}	

// 업종정보
var chart_6_1 = {
	init: function(param) {
		var self = this,
			thisYear = Math.floor(moment().format('YYYY'));
		self.apexChart = '#chartIndustryInformation';	
		self.$wrapper = $(self.apexChart).closest('[data-chart-wrapper]');
		self.diffYear = 3;
		self.maxYearInt = thisYear;
		self.minYearInt = self.maxYearInt - self.diffYear + 1;
		self.param = param;
		// 차트 초기화 퍼블리싱 코드 옮겨옴
		
		self.setBtnListener();

		if (self.param) {
			// 중간중간 빈칸도 있어서 활용 차 추가 ㅠㅠ
			self.loadData().done(function(resp) {
				self.loadAxis();
				self.updateData();
			});
		}

		z.formatDataReference('업종').done(function(refText) {
			self.$wrapper.find('.card-footer .unit').text(refText);
		});
	},
	setBtnListener: function() {
	},
	// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
	loadData: function() {
		var self = this;
		self.param.year = self.maxYearInt;
		return z.xAsync('Dashboard', '업종정보_1', 'select', self.param, 'json').done(function(resp) {
			self.rawDataArr = resp;
		});
	},
	loadAxis: function() {
		var self = this,
		rawDataArr = self.rawDataArr,
		xAxisArr = [];

		for (var i = 0; self.diffYear > i; ++i) {
			xAxisArr.push('' + (self.minYearInt + i));
		}

		// 엑셀 저장용 정보로도 활용될 예정
		self.xAxisArr = xAxisArr;
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
		self.updateDataBySector(chartOptions, chartSeries);
		var options = {
			series: chartSeries,
//			colors: ['#b5d130','#2eb7c4','#2985d2'],
			colors: ['#5e58c9','#2985d2','#2eb7c4','#6d9d64','#b5bf1b','#f1c644','#f28f6c'],
		    chart: {
		        width:'100%',
		        height: '90%',
		        type: 'line',
		        zoom: {
		            enabled: false
		        },
                toolbar: {
                    show: true,
					offsetY: -40,
		            export: {
		            	csv: {
							headerCategory: '\uFEFF',
							//columnDelimiter: ';',
							filename: '업종'
						}
					}
                },
				events: {
					click: function(event, chartContext, config) {
			    		var $target = $(event.target);
			    							
			    		if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
			    			z.addDownloadLog('업종', 'chart');
			    		}

		    			if(excelyn == "N"){
		    				$('#chartIndustryInformation .exportCSV').css("display", "none");
						} else {
							$('#chartIndustryInformation .exportCSV').css("display", "block");
						};
		           	}
				}
		    },
			stroke: {
				show: true,
				width: 2
			},
			dataLabels: { 	
				enabled: false
			},				
			xaxis: {
				categories: self.xAxisArr,
		        axisBorder: {
		            show: false,
		        },
				tooltip: {
					enabled: false
				}
			},
//		    grid: {
//		        show: false,
//		    },
		    markers: {
		        size: 5,
		        colors: ['#5e58c9','#2985d2', '#2eb7c4','#6d9d64','#b5bf1b','#f1c644','#f28f6c'],
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
				showForSingleSeries: true,
				showForNullSeries: true,
		        position: 'bottom',
		        horizontalAlign: 'left',
		        fontSize: '8px',
		        fontFamily: 'Noto Sans Korean',
		        fontWeight: 300,
		        offsetY: 8,
		        markers: {
		            width: 8,
		            height: 8,
		            radius: 12,
		        },
		    },
		    fill: {
		        opacity: 1
		    },			
			yaxis: {
				title: {
					text: undefined
				},
				labels: {
			        formatter: function (value) {
			        	return value.toLocaleString()
			        }
			    }
			},
		    tooltip: {
	            fixed: {
	                enabled: true,
	               	position: 'bottomRight',
					offsetY: 100
	            },
	            style: {
					fontSize: '10px'
				},
				y: {
					formatter: function(value) {
						return z.toComma(value) + ' 개소';
					}
				}
			}			
		};

		if (self.chart) {
			self.chart.destroy();
		}

		var chart = new ApexCharts($(self.apexChart)[0], options);
		
		self.chart = chart;

		chart.render();
	},
	updateDataBySector: function(chartOptions, chartSeries){
		var self = this,
			prevSanggaType = '',
			prevData,
			idxData;

		// 원본 복사 후 복사본 정렬
		var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));

		if (rawDataArr == null) return;
		
		// 목록에 일단 전부 넣어놓아야 null 목록도 표시됨 ㅠㅠ
		for (var j = 0, len = indTypeArr.length; len > j; ++j) {
			prevData = {
				name: indTypeArr[j],
				data: Array.apply(null, Array(self.diffYear)).map(function(v, idx) {return 0;})
			}
			
			chartSeries.push(prevData);
		}
		
		var xAxisMap = {};
		
		for (var i in rawDataArr) {
			var raw = rawDataArr[i];
			idxData = indTypeMap[raw['상권업종대분류명']];
			
			if (isNaN(idxData)) {
				continue;
			}
			
			if (xAxisMap[raw['년도']] && xAxisMap[raw['년도']] !== raw['월']) {
				continue;
			} else {
				xAxisMap[raw['년도']] = raw['월'];				
			}

			// 5년 이내에 들어오는 데이터만 추가 + 마지막 분기 데이터만 추가
			
			var idxYear = parseInt(raw['년도']) - self.minYearInt;
			
			if (idxYear < self.diffYear) {
				chartSeries[idxData].data[idxYear] += parseFloat(raw['점포수']);
			}
		}
	}
}		

// 인구정보
var chart_7_1 = {
	init: function(param) {
		var self = this,
			thisYear = Math.floor(moment().format('YYYY'));
		self.apexChart = '#chartPopulationInformationYears';	
		self.$wrapper = $(self.apexChart).closest('[data-chart-wrapper]');
		self.diffYear = 3;
		self.maxYearInt = thisYear;
		self.minYearInt = self.maxYearInt - self.diffYear + 1;
		self.param = param;
		
		// 차트 초기화 퍼블리싱 코드 옮겨옴
		var options = {
			series: [{
				name: '평균분양가',
                data: [0, 0, 0, 0, 0]
            }],
            chart: {
                type: 'bar',
                width: '100%',
                height: '75%',
                toolbar: {
                    show: true,
					offsetY: -10,
		            export: {
		            	csv: {
							headerCategory: '\uFEFF',
							filename: '인구_연도'
						}
					}
                },
				events: {
					click: function(event, chartContext, config) {
			    		var $target = $(event.target);
			    							
			    		if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
			    			z.addDownloadLog('인구_연도', 'chart');
			    		}

		    			if(excelyn == "N"){
		    				$('#chartPopulationInformationYears .exportCSV').css("display", "none");
						} else {
							$('#chartPopulationInformationYears .exportCSV').css("display", "block");
						};
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
			xaxis: {
				categories: []
			},
			colors: ['#009dd7','#2eb7c4','#eab600'],
		    stroke: {
		        show: true,
		        // curve: 'smooth',
		        lineCap: 'butt',
		        colors: '#ffffff',
		        width: 2,
		        dashArray: 0,
		    },
		    tooltip: {
				y: {
					formatter: function(value) {
						return z.toComma(value) + ' 만명';
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
		        offsetX: -20,
		        offsetY: 7,
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
		
		var chart = new ApexCharts($(self.apexChart)[0], options);
		 
		self.chart = chart;  
		self.setBtnListener();

		chart.render().then(function() {
			chart.updateSeries([]);

			if (self.param) {
				self.loadData().done(function(resp) {
					self.loadAxis();
					self.updateData();
				});
			}
		}).catch(error => console.log(error));

		z.formatDataReference('인구').done(function(refText) {
			self.$wrapper.find('.card-footer .unit').text(refText);
		});
	},
	setBtnListener: function() {
	},
	// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
	loadData: function() {
		var self = this;
		self.param.year = self.maxYearInt;
		return z.xAsync('Dashboard', '인구정보_1_NEW', 'select', self.param, 'json').done(function(resp) {
			self.rawDataArr = resp;
		});
	},
	loadAxis: function() {
		var self = this,
			rawDataArr = self.rawDataArr,
			xAxisArr = [],
			yAxisObj = {  
				title: {
					text: ''
				},
				labels: {
			        formatter: function (value) {
			        	return value.toLocaleString()
			        }
			    }
			};

		for (var i = 0; self.diffYear > i; ++i) {
			xAxisArr.push('' + (self.minYearInt + i));
		}
		
		if (rawDataArr == null) return;
		// 정렬: 상가종류, 분양연도 오름차순
		// 연도 - 1년 기간, 년도 - 10년 기간
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
	updateData: function() {
		var self = this,
		chartOptions = {
			xaxis: {
				categories: self.xAxisArr
			},
			yaxis: self.yAxisObj
		},
		chartSeries = [];
		self.updateDataByPop(chartOptions, chartSeries);
		self.chart.updateOptions(chartOptions);
		self.chart.updateSeries(chartSeries);			
	},
	updateDataByPop: function(chartOptions, chartSeries){
		var self = this,
			prevSanggaType = '',
			prevData,
			idxData;

		// 원본 복사 후 복사본 정렬
		var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));
		if (rawDataArr == null) return;
		
		for (var i in popTypeArr) {
			prevData = {
				name: popTypeArr[i],
				data: []
			}
			
			chartSeries.push(prevData);
			
			for (var j = 0; self.diffYear > j; ++j) {
				prevData.data.push(0);
			}
		}	
		
		for (var i in rawDataArr) {
			var raw = rawDataArr[i];
			
			// 5년 이내에 들어오는 데이터만 추가
			var idxYear = parseInt(raw['년도']) - self.minYearInt;
			
			if (idxYear < self.diffYear) {
				chartSeries[0].data[idxYear] += parseInt(raw['거주인구_총인구']);
				chartSeries[1].data[idxYear] += parseInt(raw['유동인구_총인구']);
				chartSeries[2].data[idxYear] += parseInt(raw['직장인구_총인구']);
			}
		}
		
		// 합산 이후에는 모든 데이터 만명 단위 출력
		for (var i in chartSeries) {
			var series = chartSeries[i];
			
			for (var j in series.data) {
				series.data[j] = series.data[j];
			}
		}
	}
}		

// 인구성별정보
var chart_8_1 = {
	init: function(param) {
		var self = this,
			thisYear = Math.floor(moment().format('YYYY')),
			apexChart1 = '#chartPopulationInformationFab1',
			apexChart2 = '#chartPopulationInformationFab2',
			apexChart3 = '#chartPopulationInformationFab3';
		
		self.$wrapper = $(apexChart1).closest('[data-chart-wrapper]');
		self.$wrapper = $(apexChart2).closest('[data-chart-wrapper]');
		self.$wrapper = $(apexChart3).closest('[data-chart-wrapper]');
		
		self.param = param;
		self.thisYear = thisYear;
		
		 var options = {
			series: [0, 0],
			seriesPercent: [0, 0],
		    chart: {
		        type: 'donut',
		        width:'100%',
		        height: '90%',
                toolbar: {
                    show: true,
					offsetY: -20,
		            export: {
		            	csv: {
							headerCategory: '\uFEFF',
							filename: '인구_거주'
						}
					}
                },
				events: {
					click: function(event, chartContext, config) {
			    		var $target = $(event.target);
			    							
			    		if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
			    			z.addDownloadLog('인구_거주', 'chart');
			    		}

		    			if(excelyn == "N"){
		    				$('#chartPopulationInformationFab1 .exportCSV').css("display", "none");
						} else {
							$('#chartPopulationInformationFab1 .exportCSV').css("display", "block");
						};
		           	}
				}
		    },
			noData: {
				text: 'loading'
			},		    
		    colors: ['#009dd7', '#7fceeb'],
            labels: ["남성", "여성"],
            stroke: {
                show: true,
                colors: '#009dd7',
                width: 1,
                dashArray: 0,
            },	        
            dataLabels: {
                enabled: false,
            },  
            legend: {
                show: true,
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
			tooltip: {
				enabled: true,
		        style: {
		            fontSize: '10px',
		        },
				y: {
				    formatter: function(val, setting) {
				    	var toolTipStr = '',
							series = setting.config.series,
							idx = val === series[0] ? 0 : 1,
							percent = setting.config.seriesPercent[idx];

				    	toolTipStr = z.toComma(val) + '명(' + percent + '%)';
				    	
				    	return toolTipStr;
				    }
				}
			},
	    };
		 
		 var options2 = {
			series: [0, 0],
			seriesPercent: [0, 0],
			chart: {
				type: 'donut',
				width:'100%',
				height: '90%',
				toolbar: {
					show: true,
					offsetY: -20,
					export: {
						csv: {
							headerCategory: '\uFEFF',
							filename: '인구_직장'
						}
					}
				},
				events: {
					click: function(event, chartContext, config) {
						var $target = $(event.target);
											
						if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
							z.addDownloadLog('인구_직장', 'chart');
						}

						if(excelyn == "N"){
							$('#chartPopulationInformationFab2 .exportCSV').css("display", "none");
						} else {
							$('#chartPopulationInformationFab2 .exportCSV').css("display", "block");
						};
					}
				}
			},
			colors: ['#2eb7c4', '#96dbe1'],
			labels: ["남성", "여성"],
			stroke: {
				show: true,
				colors: '#2eb7c4',
				width: 1,
				dashArray: 0,
			},
			dataLabels: {
				enabled: false,
			},          
			legend: {
				show: true,
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
			tooltip: {
				enabled: true,
				style: {
					fontSize: '10px',
				},
				y: {
					formatter: function(val, setting) {
						var toolTipStr = '',
							series = setting.config.series,
							idx = val === series[0] ? 0 : 1,
							percent = setting.config.seriesPercent[idx];

						toolTipStr = z.toComma(val) + '명(' + percent + '%)';
						
						return toolTipStr;
						}
				}
			},
		};
		 
		 var options3 = {
			series: [0, 0],
			seriesPercent: [0, 0],
			chart: {
				type: 'donut',
				width:'100%',
				height: '90%',
				toolbar: {
					show: true,
					offsetY: -20,
					export: {
						csv: {
							headerCategory: '\uFEFF',
							//columnDelimiter: ';',
							filename: '인구_유동'
						}
					}
				},
				events: {
					click: function(event, chartContext, config) {
						var $target = $(event.target);
											
						if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
							z.addDownloadLog('인구_유동', 'chart');
						}

						if(excelyn == "N"){
							$('#chartPopulationInformationFab2 .exportCSV').css("display", "none");
						} else {
							$('#chartPopulationInformationFab2 .exportCSV').css("display", "block");
						};
						
					}
				}
			},
			colors: ['#eab600', '#f4da7f'],
			labels: ["남성", "여성"],
			stroke: {
				show: true,
				colors: '#eab600',
				width: 1,
				dashArray: 0,
			},	        
			dataLabels: {
				enabled: false,
			},     
			legend: {
				show: true,
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
			tooltip: {
				enabled: true,
				style: {
					fontSize: '10px',
				},
				y: {
					formatter: function(val, setting) {
						var toolTipStr = '',
							series = setting.config.series,
							idx = val === series[0] ? 0 : 1,
							percent = setting.config.seriesPercent[idx];

						toolTipStr = z.toComma(val) + '명(' + percent + '%)';
						
						return toolTipStr;
					}
				}
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

		var chart1 = new ApexCharts($(apexChart1)[0], options);
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
	setBtnListener: function() {
	},
	// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
	loadData: function() {
		var self = this;
		self.param.year = self.thisYear;
		
		var data = z.xmlAjax('Dashboard', '인구데이터일자', 'select', self.param, 'json');
		
		self.param.maxym = data[0].max_ym;
		self.param.minym = data[0].min_ym;
		
		var thistxt = data[0].min_ym.substr(0,4) + '.' + data[0].min_ym.substr(4,2) + ' ~ ' +  data[0].max_ym.substr(0,4) + '.' + data[0].max_ym.substr(4,2)
		$("#man_cnt").text(thistxt + ' 각 특성인구별 성별분포');
		
		return z.xAsync('Dashboard', '인구성별정보_1_NEW', 'select', self.param, 'json2').done(function(resp) {
			self.rawDataArr = resp;
		});
	},
	loadAxis: function() {
	},
	updateData: function() {
		var self = this,
		chartOptions = {},
		chartSeries1 = [],
		chartSeries2 = [],
		chartSeries3 = [];
		self.updateDataByPop(chartOptions, chartSeries1, 0);
		self.chart1.updateOptions(chartOptions);
		self.chart1.updateSeries(chartSeries1);			
		self.updateDataByPop(chartOptions, chartSeries2, 1);
		self.chart2.updateOptions(chartOptions);
		self.chart2.updateSeries(chartSeries2);
		self.updateDataByPop(chartOptions, chartSeries3, 2);
		self.chart3.updateOptions(chartOptions);
		self.chart3.updateSeries(chartSeries3);
	},
	updateDataByPop: function(chartOptions, chartSeries, id){
		var self = this,
			data1 = '',
			data2 = '',
			malePer = '',
			femalePer = '';
		
		// 원본 복사 후 복사본 정렬
		var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));
		if (rawDataArr == null) return;

		for (var i in rawDataArr) {
			var raw = rawDataArr[i];			
			
			switch(id){
				case 0:
					data1 = parseInt(raw['거주인구_총남']);
					data2 = parseInt(raw['거주인구_총여']);
					malePer = parseFloat(raw['거주인구_남']);
					femalePer = parseFloat(raw['거주인구_여']);
					
					if(malePer > femalePer){
						$('#dwl_label').html('거주인구<br/>남성');
						$('#dwl_data').text(malePer + '%');
					}else{
						$('#dwl_label').html('거주인구<br/>여성');
						$('#dwl_data').text(femalePer + '%');
					}
					chartOptions.seriesPercent = [malePer, femalePer];
					break;
				case 1:
					data1 = parseInt(raw['직장인구_총남']);
					data2 = parseInt(raw['직장인구_총여']);
					malePer = parseFloat(raw['직장인구_남']);
					femalePer = parseFloat(raw['직장인구_여']);
					
					if(malePer > femalePer){
						$('#plc_label').html('직장인구<br/>남성');
						$('#plc_data').text(malePer + '%');
					}else{
						$('#plc_label').html('직장인구<br/>여성');
						$('#plc_data').text(femalePer + '%');
					}					
					chartOptions.seriesPercent = [malePer, femalePer];
					break;
				case 2:
					data1 = parseFloat(raw['유동인구_총남']) ;
					data2 = parseFloat(raw['유동인구_총여']);
					malePer = parseFloat(raw['유동인구_남']);
					femalePer = parseFloat(raw['유동인구_여']);
					
					if(malePer > femalePer){
						$('#flow_label').html('유동인구<br/>남성');
						$('#flow_data').text(malePer+ '%');
					}else{
						$('#flow_label').html('유동인구<br/>여성');
						$('#flow_data').text(femalePer+ '%');
					}
					chartOptions.seriesPercent = [malePer, femalePer];
					break;
			}
		}
		/*alert($('#plc_label').text());*/
		chartSeries.push(parseInt(data1));
		chartSeries.push(parseInt(data2));
		
		// 합산 이후에는 모든 데이터 소수점 2자리까지 출력
//		for (var i in chartSeries) {
//			chartSeries[i] = Math.floor(chartSeries[i]);
//		}
	}
}			

return {
	init: function() {
		var self = this;
		// 행정동 주소 검색 레이어
		listAddr.init();
		self.setBtnListener();

		z.xAsync('AdminMain', 'getExcelDown', 'select', {pgmCode:"MA0101"}, 'json').done(function(resp) {
			excelyn = resp[0].excelyn;
		});
		
		// 상가유형 DB 조회
		$.when(
			z.getCommCode('100100'),
			z.getCommCode('100120'),
			listAddr.updateSidoList()
		).done(function(respSangga, respIndustry) {

			sanggaMap = respSangga.reduce(function(acc, cur) {
				acc[cur['공통상세명']] = parseInt(cur['정렬코드']);
				return acc;
			}, {});
	
			sanggaArr = [];

			for (var i in respSangga) {
				sanggaArr.push(respSangga[i]['공통상세명']);
			}
	
			
			indTypeMap = respIndustry.reduce(function(acc, cur) {
				acc[cur['공통상세명']] = parseInt(cur['정렬코드']);
				return acc;
			}, {});
	
			indTypeArr = [];
			
			for (var i in respIndustry) {
				indTypeArr.push(respIndustry[i]['공통상세명']);
			}

			var param = $.extend(true, {}, prevAddr);
						
			chart_1_1.init(param);	
			chart_2_1.init(param);
			chart_2_2.init(param);
			chart_3_1.init(param);
			chart_4_1.init(param);
			chart_5_1.init(param);
			chart_6_1.init(param);
			chart_7_1.init(param);
			chart_8_1.init(param);
			
		});
		
	},
	setBtnListener: function() {
		var self = this;
		
		$btnSearchAddr.click(function(){
		    $divSearchAddr.show();
		});
		
		$('.btnSearchAddrClose').click(function(){
		    $divSearchAddr.hide();
		});
		
		$(document).mouseup(function (e){
		    var container = $divSearchAddr;
		    if( container.has(e.target).length === 0){
		      container.hide();
		    }
		});
		
		$listSido.on('click', '[data-list-addr-sido]', function() {
			var $this = $(this),
				sidonm = $this.attr('data-list-addr-sido'),
				sidocd = $this.attr('data-list-addr-sidocd');
			
			if (prevAddr.sidonm === sidonm) {
				return;
			}	
			
			if(_isDemo && _DemoSidocd != sidocd) {
				z.msg(_DemoMsgX);
				return false;
			}
				
			prevAddr.sidonm = sidonm;
			prevAddr.sidocd = sidocd;
			prevAddr.sggnm = "";
			prevAddr.sggcd = "";
			prevAddr.dongnm = "";
			prevAddr.dongcd = "";
			
			var	$list = $listSgg.children('ul');
			$list.find('.active').removeClass('active');
			$listSido.find('a').removeClass('active');
			$this.addClass('active');	
			listAddr.updateSggList(sidonm, sidocd);
		});
		
		$listSgg.on('click', '[data-list-addr-sgg]', function() {
			var $this = $(this),
				sggnm = $this.attr('data-list-addr-sgg'),
				sggcd = $this.attr('data-list-addr-sggcd');
			if (prevAddr.sggnm === sggnm) {
				return;
			}
			
			if(_isDemo && _DemoSggcd != sggcd) {
				z.msg(_DemoMsgX);
				return false;
			}
			
			prevAddr.sggnm = sggnm;
			prevAddr.sggcd = sggcd;
			prevAddr.dongnm = "";
			prevAddr.dongcd = "";  
			
			$listSgg.find('a').removeClass('active');
			$this.addClass('active');
			
			listAddr.updateDongList(sggnm, sggcd, '', '');
		});
		
		$listDong.on('click', '[data-list-addr-dong]', function() {
			var $this = $(this),
				dong = $this.attr('data-list-addr-dong'),	
				dongcd = $this.attr('data-list-addr-dongcd');
				prevAddr.dongnm = dong;
				prevAddr.dongcd = dongcd;
		});
		
		$('.btnSearchAddrClose.btn-danger').click(function() {
			$btnSearchAddrSido.text(prevAddr.sidonm);
			$btnSearchAddrSgg.text(prevAddr.sggnm);
			$btnSearchAddrDong.text(prevAddr.dongnm);
			$divSearchAddrSido.text(prevAddr.sidonm); 
			$divSearchAddrSgg.text((prevAddr.sggnm == '' ? '전체' : prevAddr.sggnm));
			$divSearchAddrDong.text((prevAddr.dongnm == '' ? '전체' : prevAddr.dongnm));
			
			// 지역현황판 메뉴 내 선택한 지역설정 값 유지
			dashboardSelectedAddr.sidonm = prevAddr.sidonm;
			dashboardSelectedAddr.sggnm = prevAddr.sggnm;
			dashboardSelectedAddr.dongnm = prevAddr.dongnm;
			dashboardSelectedAddr.sidocd = prevAddr.sidocd;
			dashboardSelectedAddr.sggcd = prevAddr.sggcd;
			dashboardSelectedAddr.dongcd = prevAddr.dongcd;
			
			var param = $.extend(true, {}, prevAddr);
			chart_1_1.init(param);
			chart_2_1.init(param);
			chart_2_2.init(param);
			chart_3_1.init(param);
			chart_4_1.init(param);
			chart_5_1.init(param);
			chart_6_1.init(param);
			chart_7_1.init(param);
			chart_8_1.init(param);
			
			if(excelyn == "N"){
				$(".apexcharts-menu-item.exportCSV").css("display", "none");
			} else {
				$(".apexcharts-menu-item.exportCSV").css("display", "block");
			};
		});
	}
}
}();

//2021년 2월 각 특성인구별 성별분포(거주인구)
chartPopulationInformationFab1.options = {
    series: [46, 54],
    labels: ['남자', '여자'],
    chart: {
        type: 'donut',
        width:'100%',
        height: '90%',
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
    title: {
        text: '거주인구',
        align: 'center',
        margin: 0,
        offsetX: 0,
        offsetY: 150,
        floating: true,
        style: {
            fontSize:  '14px',
            fontWeight:  'bold',
            fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
            color:  '#263238'
        },
    },
    legend: {
        show: true,
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
}

//2021년 2월 각 특성인구별 성별분포(직장인구)
chartPopulationInformationFab2.options = {
    series: [59, 41],
    labels: ['남자', '여자'],
    chart: {
        type: 'donut',
        width:'100%',
        height: '90%',
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
    title: {
        text: '직장인구',
        align: 'center',
        margin: 0,
        offsetX: 0,
        offsetY: 150,
        floating: true,
        style: {
            fontSize:  '14px',
            fontWeight:  'bold',
            fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
            color:  '#263238'
        },
    },
    legend: {
        show: true,
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
}

//2021년 2월 각 특성인구별 성별분포(유동인구)
chartPopulationInformationFab3.options = {
    series: [42, 58],
    labels: ['남자', '여자'],
    chart: {
        type: 'donut',
        width:'100%',
        height: '90%',
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
    title: {
        text: '유동인구',
        align: 'center',
        margin: 0,
        offsetX: 0,
        offsetY: 150,
        floating: true,
        style: {
            fontSize:  '14px',
            fontWeight:  'bold',
            fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
            color:  '#263238'
        },
    },
    legend: {
        show: true,
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
}

// 공지사항 팝업 데이터 조회
var noticePopup = {
	init: function() {
		
		$($('input:checkbox[name=Checkboxes1]').on('click', function() {
			if($(this).is(':checked') == true) {
				$('#popupClose').val('Y');
			} else {
				$('#popupClose').val('N');
			}
		}));

		z.xAsync("Admin", "공지사항팝업", "select", '', "json2").done(function(resp) {
			if(resp.length > 0) {
				const noticeDetail = resp[0];
				const now = new Date();
				const noticeStartDate = noticeDetail.팝업시작일시;
				const noticeContent = noticeDetail.팝업내용.replaceAll('\n', '<br>');

				if(now > new Date(noticeStartDate)) {
					$('.main_popup_wrap').css('display', 'block');
					$('#noticeSeq').val(noticeDetail.seq);
					$('#noticeStartDate').val(noticeDetail.팝업시작일시);
					$('#noticeEndDate').val(noticeDetail.팝업종료일시);
					$('#noticeTitle').html(noticeDetail.제목);
					$('#noticeContent').html(noticeContent);
				}
			}
		});
	},
	
	// 공지사항 상세보기
	detailData: function(seq) {
		z.setValue('seq', seq);
		z.setValue('detailView', 'Y');
		z.buttonClick("MA0612", "공지상세", "R");
		z.menuLink("MA061209");
	}
};

$(document).ready(function() {
	const popupCls = document.querySelector('.but_close');
    const popupCk = document.querySelector('#popupClose');
    const popupBox = document.querySelector('.main_popup_wrap');
	const noticeView = document.querySelector('.but_notice_view');

	var cookie = {
		setCookie: function(name, value, exp) {
			const expDate = new Date(exp);
			var expires = '';

			if (expDate) {
				expires = '; expires=' + expDate.toUTCString();
			}
			// 실제로 쿠키 작성하기
			document.cookie = name + '=' + (value || '') + expires + '; path=/';
		  },
		  // 쿠키 읽어오기(쿠키 이름을 기준으로 정규식 이용해서 가져오기)
		  getCookie: function(name) {
			var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
			return value ? value[2] : null;
		  }
	}

	apiDashBoard.init();
	// 공지사항 팝업 기능 추가
	noticePopup.init();
	
	// 팝업 닫기
    popupCls.addEventListener('click', () => {
		if($('input:checkbox[name=Checkboxes1]').is(':checked')) {
			const noticeEndDate = $('#noticeEndDate').val();
			const popupClose = $('#popupClose').val();
			cookie.setCookie('notice', popupClose , noticeEndDate);
		}
    	popupBox.classList.toggle('open');
    })

	// 쿠키에 따라 팝업 show / not show 
	if((cookie.getCookie('notice') == 'Y')) {
		popupBox.classList.remove('open');
	} else {
		popupBox.classList.add('open');	
	}

	// 공지사항 상세페에지로 이동
	noticeView.addEventListener('click', () => {
		const noticeSeq = $('#noticeSeq').val();
		noticePopup.detailData(noticeSeq);
	})
})	/* end: document function */