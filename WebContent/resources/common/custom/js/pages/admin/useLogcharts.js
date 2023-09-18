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

var KTApexChartsUseLog = function () {
	// Private functions

	var _demo1 = function () {
		const apexChart = "#usechart_1";
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
				height: 350,
				type: 'bar'
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
		}
	};
}();

jQuery(document).ready(function () {
	KTApexChartsUseLog.init();
});
