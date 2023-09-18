//"use strict";

// Shared Colors Definition
var primary = '#6993FF';
var success = '#1BC5BD';
var info = '#8950FC';
var warning = '#FFA800';
var danger = '#F64E60';

// Class definition
function generateBubbleData(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;;
      var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;
  
      series.push([x, y, z]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

function generateData(count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
        var x = 'w' + (i + 1).toString();
        var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        series.push({
            x: x,
            y: y
        });
        i++;
    }
    return series;
}

var KTApexChartsGIS = function () {
	// Private functions
	var _demo1 = function () {
		const apexChart = "#chart_1";
		var options = {
			series: [{
				name: "2020",
                data: [20.8, 18, 20.8, 18, 20.8]
            }, {
				name: '2019',
                data: [17.5, 28.9, 20.8, 31, 20.8]
            }, {
				name: '2018',
				data: [16, 21, 23, 22, 11]
			}],
			chart: {
				height: 200,
				type: 'line',
				zoom: {
					enabled: false
                },
                toolbar: {
                    show: false
                },
            },
            legend: {
                show: false
            },
			dataLabels: { 	
				enabled: false
			},
			stroke: {
                curve: 'straight',
                width: 1
			},
			grid: {
				row: {
					colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
					opacity: 0.5
				},
			},
			xaxis: {
				categories: ['근린상가', '단지내상가', '복합상가', '태마상가', '기타상가'],
			},
			colors: [primary, success, info]
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
	}

	var _demo2 = function () {
		const apexChart = "#chart_2";
		var options = {
			series: [{
				name: 'B1',
				data: [1200, 2300, 1200, 2300, 1200]
			}, {
				name: '1F',
				data: [12000, 22000, 12000, 22000, 12000]
			}, {
				name: '2F',
				data: [8000, 7500, 8000, 7500, 8000]
			}, {
				name: '3F이상',
				data: [3000, 3400, 3000, 3400, 3000]
			}],
			chart: {
				height: 200,
                type: 'area',
                toolbar: {
                    show: false
                },
            },
            legend: {
                show: false
            },
            plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '55%',
					endingShape: 'rounded'
				},
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},
			xaxis: {
				categories: ['근린상가', '단지내상가', '복합상가', '태마상가', '기타상가'],
			},
			colors: [primary, success, info, warning]
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
    }
    
	var _demo3 = function () {
		const apexChart = "#chart_3";
		var options = {
			series: [{
				name: 'B1',
				data: [1200, 2300, 1200, 2300, 1200]
			}, {
				name: '1F',
				data: [12000, 22000, 12000, 22000, 12000]
			}, {
				name: '2F',
				data: [8000, 7500, 8000, 7500, 8000]
			}, {
				name: '3F이상',
				data: [3000, 3400, 3000, 3400, 3000]
			}],
			chart: {
				height: 200,
                type: 'bar',
                toolbar: {
                    show: false
                },
            },
            legend: {
                show: false
            },
            plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '55%',
					endingShape: 'rounded'
				},
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},
			xaxis: {
				categories: ['근린상가', '단지내상가', '복합상가', '태마상가', '기타상가'],
			},
			colors: [primary, success, info, warning]
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
    }
    
	var _demo4 = function () {
		const apexChart = "#chart_4";
		var options = {
			series: [{
				name: 'B1',
				data: [1200, 2300, 1200, 2300, 1200]
			}, {
				name: '1F',
				data: [12000, 22000, 12000, 22000, 12000]
			}, {
				name: '2F',
				data: [8000, 7500, 8000, 7500, 8000]
			}, {
				name: '3F이상',
				data: [3000, 3400, 3000, 3400, 3000]
			}],
			chart: {
				height: 200,
                type: 'bar',
                toolbar: {
                    show: false
                },
            },
            legend: {
                show: false
            },
            plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '55%',
					endingShape: 'rounded'
				},
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},
			xaxis: {
				categories: ['근린상가', '단지내상가', '복합상가', '태마상가', '기타상가'],
            },
            yaxis: {
                show: false,
            },
			colors: [primary, success, info, warning]
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
    }
    
	var _demo5 = function () {
		const apexChart = "#chart_5";
		var options = {
			series: [{
				name: 'B1',
				data: [1200, 2300, 1200, 2300, 1200]
			}, {
				name: '1F',
				data: [12000, 22000, 12000, 22000, 12000]
			}, {
				name: '2F',
				data: [8000, 7500, 8000, 7500, 8000]
			}, {
				name: '3F이상',
				data: [3000, 3400, 3000, 3400, 3000]
			}],
			chart: {
				height: 200,
                type: 'bar',
                toolbar: {
                    show: false
                },
            },
            legend: {
                show: false
            },
            plotOptions: {
				bar: {
					horizontal: true,
					columnWidth: '55%',
					endingShape: 'rounded'
				},
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},
			xaxis: {
				categories: ['근린상가', '단지내상가', '복합상가', '태마상가', '기타상가'],
            },
            yaxis: {
                show: false,
            },
			colors: [primary, success, info, warning]
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
    }
    
	var _demo6 = function () {
		const apexChart = "#chart_6";
		var options = {
			series: [{
				name: 'B1',
				data: [1200, 2300, 1200, 2300, 1200]
			}, {
				name: '1F',
				data: [12000, 22000, 12000, 22000, 12000]
			}, {
				name: '2F',
				data: [8000, 7500, 8000, 7500, 8000]
			}, {
				name: '3F이상',
				data: [3000, 3400, 3000, 3400, 3000]
			}],
			chart: {
				height: 200,
                type: 'bar',
                stacked: true,
                toolbar: {
                    show: false
                },
            },
            legend: {
                show: false
            },
            plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '55%',
					endingShape: 'rounded'
				},
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},
			xaxis: {
				categories: ['근린상가', '단지내상가', '복합상가', '태마상가', '기타상가'],
            },
            yaxis: {
                show: false,
            },
			colors: [primary, success, info, warning]
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
    }
    
	var _demo7 = function () {
		const apexChart = "#chart_7";
		var options = {
			series: [{
				name: 'B1',
				data: [1200, 2300, 1200, 2300, 1200]
			}, {
				name: '1F',
				data: [12000, 22000, 12000, 22000, 12000]
			}, {
				name: '2F',
				data: [8000, 7500, 8000, 7500, 8000]
			}, {
				name: '3F이상',
				data: [3000, 3400, 3000, 3400, 3000]
			}],
			chart: {
				height: 200,
                type: 'bar',
                stacked: true,
                toolbar: {
                    show: false
                },
            },
            legend: {
                show: false
            },
            plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '55%',
					endingShape: 'rounded'
				},
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},
			xaxis: {
				categories: ['근린상가', '단지내상가', '복합상가', '태마상가', '기타상가'],
            },
            yaxis: {
                show: false,
            },
			colors: [primary, success, info, warning]
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
    }
    
	var _demo8 = function () {
		const apexChart = "#chart_8";
		var options = {
			series: [{
				name: 'B1',
				data: [1200, 2300, 1200, 2300, 1200]
			}, {
				name: '1F',
				data: [12000, 22000, 12000, 22000, 12000]
			}, {
				name: '2F',
				data: [8000, 7500, 8000, 7500, 8000]
			}, {
				name: '3F이상',
				data: [3000, 3400, 3000, 3400, 3000]
			}],
			chart: {
				height: 200,
                type: 'bar',
                toolbar: {
                    show: false
                },
            },
            legend: {
                show: false
            },
            plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '55%',
					endingShape: 'rounded'
				},
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},
			xaxis: {
				categories: ['근린상가', '단지내상가', '복합상가', '태마상가', '기타상가'],
            },
            yaxis: {
                show: false,
            },
			colors: [primary, success, info, warning]
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
    }
    
	var _demo9 = function () {
		const apexChart = "#chart_9";
		var options = {
			series: [{
				name: '남',
				data: [1200, 2300, 1200, 2300]
			}, {
				name: '여',
				data: [1500, 2000, 1000, 2000]
			}],
			chart: {
				height: 200,
                type: 'bar',
                toolbar: {
                    show: false
                },
            },
            legend: {
                show: false
            },
            plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '55%',
					endingShape: 'rounded'
				},
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},
			xaxis: {
				categories: ['2017', '2018', '2019', '2020'],
            },
            yaxis: {
                show: false,
            },
			colors: [primary, warning]
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
    }
    
	var _demo10 = function () {
		const apexChart = "#chart_10";
		var options = {
			series: [{
				name: '요일별',
				data: [14, 20, 50, 12, 22, 30, 40]
			}],
			chart: {
				height: 200,
                type: 'bar',
                toolbar: {
                    show: false
                },
            },
            legend: {
                show: false
            },
            plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '55%',
					endingShape: 'rounded'
				},
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},
			xaxis: {
				categories: ['월', '화', '수', '목', '금', '토', '일'],
            },
            yaxis: {
                show: false,
            },
			colors: [primary, success, info, warning]
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
    }
    
	var _demo11 = function () {
		const apexChart = "#chart_11";
		var options = {
			series: [{
				name: '시간별',
				data: [40, 50, 120, 70, 50, 50, 120, 70, 50, 50, 120, 70, 50, 50, 120, 70, 50, 50, 120, 70, 50, 50, 120, 70]
			}],
			chart: {
				height: 200,
                type: 'bar',
                toolbar: {
                    show: false
                },
            },
            legend: {
                show: false
            },
            plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '55%',
					endingShape: 'rounded'
				},
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},
			xaxis: {
				categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
            },
            yaxis: {
                show: false,
            },
			colors: [primary, success, info, warning]
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
    }
    
	var _demo12 = function () {
		const apexChart = "#chart_12";
		var options = {
			series: [{
				name: 'B1',
				data: [1200, 2300, 1200, 2300, 1200]
			}, {
				name: '1F',
				data: [12000, 22000, 12000, 22000, 12000]
			}, {
				name: '2F',
				data: [8000, 7500, 8000, 7500, 8000]
			}, {
				name: '3F이상',
				data: [3000, 3400, 3000, 3400, 3000]
			}],
			chart: {
				height: 200,
                type: 'bar',
                toolbar: {
                    show: false
                },
            },
            legend: {
                show: false
            },
            plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '55%',
					endingShape: 'rounded'
				},
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},
			xaxis: {
				categories: ['근린상가', '단지내상가', '복합상가', '태마상가', '기타상가'],
			},
			colors: [primary, success, info, warning]
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
    }
    
	var _demo13 = function () {
		const apexChart = "#chart_13";
		var options = {
			series: [{
				name: 'B1',
				data: [1200, 2300, 1200, 2300, 1200]
			}, {
				name: '1F',
				data: [12000, 22000, 12000, 22000, 12000]
			}, {
				name: '2F',
				data: [8000, 7500, 8000, 7500, 8000]
			}, {
				name: '3F이상',
				data: [3000, 3400, 3000, 3400, 3000]
			}],
			chart: {
				height: 200,
                type: 'bar',
                toolbar: {
                    show: false
                },
            },
            legend: {
                show: false
            },
            plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '55%',
					endingShape: 'rounded'
				},
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},
			xaxis: {
				categories: ['근린상가', '단지내상가', '복합상가', '태마상가', '기타상가'],
			},
			colors: [primary, success, info, warning]
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
    }
    
	var _demo14 = function () {
		const apexChart = "#chart_14";
		var options = {
			series: [{
				name: 'B1',
				data: [1200, 2300, 1200, 2300, 1200]
			}, {
				name: '1F',
				data: [12000, 22000, 12000, 22000, 12000]
			}, {
				name: '2F',
				data: [8000, 7500, 8000, 7500, 8000]
			}, {
				name: '3F이상',
				data: [3000, 3400, 3000, 3400, 3000]
			}],
			chart: {
				height: 200,
                type: 'bar',
                toolbar: {
                    show: false
                },
            },
            legend: {
                show: false
            },
            plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '55%',
					endingShape: 'rounded'
				},
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},
			xaxis: {
				categories: ['근린상가', '단지내상가', '복합상가', '태마상가', '기타상가'],
			},
			colors: [primary, success, info, warning]
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
    }
    
	var _demo15 = function () {
		const apexChart = "#chart_15";
		var options = {
			series: [44, 55, 13, 43, 22],
			chart: {
				width: 380,
				type: 'pie',
			},
			labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
			responsive: [{
				breakpoint: 480,
				options: {
					chart: {
						width: 200
					},
					legend: {
						position: 'bottom'
					}
				}
			}],
			colors: [primary, success, warning, danger, info]
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
    }
    
    var _demo16 = function () {
		const apexChart = "#chart_16";
		var options = {
			series: [{
				name: "2020",
                data: [20.8, 18, 20.8, 18, 20.8]
            }, {
				name: '2019',
                data: [17.5, 28.9, 20.8, 31, 20.8]
            }, {
				name: '2018',
				data: [16, 21, 23, 22, 11]
			}],
			chart: {
				height: 200,
				type: 'line',
				zoom: {
					enabled: false
                },
                toolbar: {
                    show: false
                },
            },
            legend: {
                show: false
            },
			dataLabels: { 	
				enabled: false
			},
			stroke: {
                curve: 'straight',
                width: 1
			},
			grid: {
				row: {
					colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
					opacity: 0.5
				},
			},
			xaxis: {
				categories: ['근린상가', '단지내상가', '복합상가', '태마상가', '기타상가'],
			},
			colors: [primary, success, info]
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
    }

	var _demo1_1 = function () {
		const apexChart = "#chart_1_1";
		var options = {
			series: [{
				name: "B1",
                data: [20.8, 18, 20.8]
            }, {
				name: 'F1',
                data: [17.5, 28.9, 20.8]
            }, {
				name: 'F2',
				data: [16, 21, 23]
			}],
			chart: {
				height: 200,
				type: 'line',
				zoom: {
					enabled: false
                },
                toolbar: {
                    show: false
                },
            },
            legend: {
                show: false
            },
			dataLabels: { 	
				enabled: false
			},
			stroke: {
                curve: 'straight',
                width: 1
			},
			grid: {
				row: {
					colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
					opacity: 0.5
				},
			},
			xaxis: {
				categories: ['2018', '2019', '2020'],
			},
			colors: [primary, success, info]
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
	}

	var _demo3_1 = function () {
		const apexChart = "#chart_3_1";
		var options = {
			series: [{
				name: 'B1',
				data: [1200, 2300, 1200]
			}, {
				name: '1F',
				data: [12000, 22000, 12000]
			}, {
				name: '2F',
				data: [8000, 7500, 8000]
			}, {
				name: '3F이상',
				data: [3000, 3400, 3000]
			}],
			chart: {
				height: 200,
                type: 'bar',
                toolbar: {
                    show: false
                },
            },
            legend: {
                show: false
            },
            plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '55%',
					endingShape: 'rounded'
				},
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				show: true,
				width: 2,
				colors: ['transparent']
			},
			xaxis: {
				categories: ['2018', '2019', '2020'],
			},
			colors: [primary, success, info, warning]
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
	}
	var _demo5_1 = function () {
		const apexChart = "#chart_5_1";
		var options = {
			series: [{
				name: '2020',
				data: [10, 12, 11, 4, 20, 40, 10, 50]
			}],
			chart: {
				height: 300,
				type: 'bar',
				stacked: false,
				zoom: {
					enabled: false
				},
				toolbar: {
                    show: false
                },
			},
			plotOptions: {
				bar: {
					horizontal: true,
					endingShape: 'rounded'
				},
			},
			dataLabels: {
				enabled: false
			},
			grid: {
				show: false,
				xaxis: {
					lines: {
						show: true
					}
				}, 
				yaxis: {
					lines: {
						show: true
					}
				}, 
			},
			xaxis: {
				categories: ['도소매', '외식', '서비스', '제조', '금융', '종교', '국가기관', '기타'],
			},
			colors: [primary, success, info, warning]
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
	}

	var _demo6_1 = function () {
		const apexChart = "#chart_6_1";
		var options = {
			series: [{
				name: 'Income',
				type: 'column',
				data: [30, 35, 40, 22]
			}, {
				name: 'Cashflow',
				type: 'column',
				data: [ 20, 30, 35, 15]
			}, {
				name: 'Revenue',
				type: 'line',
				data: [40, 44, 50, 25]
			}],
			chart: {
				height: 200,
				type: 'line',
				stacked: false,
				zoom: {
					enabled: false
				},
				toolbar: {
                    show: false
                },
			},
			legend: {
                show: false
            },
			dataLabels: {
				enabled: false
			},
			stroke: {
				width: [1, 1, 4]
			},
			
			yaxis: {
                show: false,
            },
			xaxis: {
				categories: [2017, 2018, 2019, 2020],
			}
			
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
	}

	return {
		// public functions
		init: function () {
			_demo1();
			_demo2();
			_demo3();
			_demo4();
			_demo5();
			_demo6();
			_demo7();
			_demo8();
			_demo9();
			_demo10();
			_demo11();
			_demo12();
			_demo13();
			_demo14();
			_demo15();
			_demo16();
			_demo1_1();
			_demo3_1();
			_demo5_1();
			_demo6_1();
		}
	};
}();

$(function () {
	KTApexChartsGIS.init();
});
