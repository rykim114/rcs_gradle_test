"use strict";

// Shared Colors Definition
const primary = '#6993FF';
const success = '#1BC5BD';
const info = '#8950FC';
const warning = '#FFA800';
const danger = '#F64E60';

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
    
	var _demo10 = function () {
		const apexChart = "#chart_10";
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
    
	var _demo11 = function () {
		const apexChart = "#chart_11";
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
		}
	};
}();

jQuery(document).ready(function () {
	KTApexChartsGIS.init();
});
