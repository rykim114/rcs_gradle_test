'use strict';
// Class definition

var KTDatatableSupplyTrend = function() {
    // Private functions
	$(".selectpicker").selectpicker();
    // demo initializer
	var _demo1_1 = function () {
		var apexChart = "#chart_1_1";
		var options = {
			series: [{
				name: '지역비교',
                data: [563, 577, 96, 370, 120, 350]
            }],
			chart: {
				height: 200,
				type: 'bar',
				stacked: true,
				zoom: {
					enabled: false
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
				categories: ['세곡동', '첨당동', '자곡동', '개포동', '대치동', '역삼동'],
			},
			colors: ["#7ed0f3", "#4b8eef", "#ff6f38", "#dcdcde"]
		};

		var chart = new ApexCharts(document.querySelector(apexChart), options);
		chart.render();
	}
	var _demo2 = function () {
	var apexChart = "#chart_2";
	var options = {
		series: [{
			name: 'B1',
			data: [210, 788, 791]
		}, {
			name: '1F',
			data: [756, 636, 860]
		}, {
			name: '2F',
			data: [347, 383, 476]
		}],
		chart: {
			height: 200,
			type: 'line',
			zoom: {
				enabled: false
			}
        },
		dataLabels: {
			enabled: false
		},
		stroke: {
			show: true,
			width: 1,
		},
		xaxis: {
			categories: ['2018', '2019', '2020'],
		},
		colors: [primary, success, info]
	};

	var chart = new ApexCharts(document.querySelector(apexChart), options);
	chart.render();
}
	
    var demo1 = function() {
        var dataJSONArray = JSON.parse('[{"Sido":"서울특별시","Gu":"강남구","Dong":"개포동","Store":"푸드코리아(석탑프라자)","Type":"근린상가","StrNum":42,"Floor":"B1","FlrNum":38,"RegDate":"2020.10.10"},\n' +
            '{"Sido":"서울특별시","Gu":"강남구","Dong":"개포동","Store":"푸드코리아(석탑프라자)","Type":"근린상가","StrNum":42,"Floor":"B1","FlrNum":38,"RegDate":"2020.10.10"},\n' +
            '{"Sido":"서울특별시","Gu":"강남구","Dong":"개포동","Store":"푸드코리아(석탑프라자)","Type":"근린상가","StrNum":42,"Floor":"B1","FlrNum":38,"RegDate":"2020.10.10"},\n' +
            '{"Sido":"서울특별시","Gu":"강남구","Dong":"개포동","Store":"푸드코리아(석탑프라자)","Type":"근린상가","StrNum":42,"Floor":"B1","FlrNum":38,"RegDate":"2020.10.10"},\n' +
            '{"Sido":"서울특별시","Gu":"강남구","Dong":"개포동","Store":"푸드코리아(석탑프라자)","Type":"근린상가","StrNum":42,"Floor":"B1","FlrNum":38,"RegDate":"2020.10.10"},\n' +
            '{"Sido":"서울특별시","Gu":"강남구","Dong":"개포동","Store":"푸드코리아(석탑프라자)","Type":"근린상가","StrNum":42,"Floor":"B1","FlrNum":38,"RegDate":"2020.10.10"},\n' +
            '{"Sido":"서울특별시","Gu":"강남구","Dong":"개포동","Store":"푸드코리아(석탑프라자)","Type":"근린상가","StrNum":42,"Floor":"B1","FlrNum":38,"RegDate":"2020.10.10"},\n' +
            '{"Sido":"서울특별시","Gu":"강남구","Dong":"개포동","Store":"푸드코리아(석탑프라자)","Type":"근린상가","StrNum":42,"Floor":"B1","FlrNum":38,"RegDate":"2020.10.10"},\n' +
            '{"Sido":"서울특별시","Gu":"강남구","Dong":"개포동","Store":"푸드코리아(석탑프라자)","Type":"근린상가","StrNum":42,"Floor":"B1","FlrNum":38,"RegDate":"2020.10.10"},\n' +
            '{"Sido":"서울특별시","Gu":"강남구","Dong":"개포동","Store":"푸드코리아(석탑프라자)","Type":"근린상가","StrNum":42,"Floor":"B1","FlrNum":38,"RegDate":"2020.10.10"}]');

        var datatable = $('#kt_datatable_1').KTDatatable({
            // datasource definition
            data: {
                type: 'local',
                source: dataJSONArray,
                pageSize: 10,
            },

            // layout definition
            layout: {
                scroll: true, // enable/disable datatable scroll both horizontal and vertical when needed.
                height: 450, // datatable's body's fixed height
                footer: false, // display/hide footer
            },

            // column sorting
            sortable: true,

            pagination: false,

            toolbar: {
                items: {
                    info: false,
                }
            },

            // columns definition
            columns: [{
                field: 'Sido',
                title: '시도',
                textAlign: 'center',
            }, {
                field: 'Gu',
                title: '구시군',
                textAlign: 'center',
            }, {
                field: 'Dong',
                title: '읍면동',
                textAlign: 'center',
            }, {
                field: 'Store',
                title: '상가',
                textAlign: 'center',
            }, {
                field: 'Type',
                title: '유형',
                textAlign: 'center',
            }, {
                field: 'StrNum',
                title: '총점포수',
                textAlign: 'center',
            }, {
                field: 'Floor',
                title: '층별',
                textAlign: 'center',
            }, {
                field: 'FlrNum',
                title: '층별점포수',
                textAlign: 'center',
            }, {
                field: 'RegDate',
                title: '입주년월',
                type: 'date',
                width: 145,
                format: 'YYYY-MM-DD',
                textAlign: 'center',
            }],
        });

    };

    var demo2 = function() {
        var dataJSONArray = JSON.parse('[{"Sido":"서울특별시","Gu":"강남구","Dong":"개포동","Store":"푸드코리아(석탑프라자)","Type":"근린상가","StrNum":42,"Floor":"B1","FlrNum":38,"RegDate":"2020.10.10"},\n' +
        '{"Sido":"서울특별시","Gu":"강남구","Dong":"개포동","Store":"푸드코리아(석탑프라자)","Type":"근린상가","StrNum":42,"Floor":"B1","FlrNum":38,"RegDate":"2020.10.10"},\n' +
        '{"Sido":"서울특별시","Gu":"강남구","Dong":"개포동","Store":"푸드코리아(석탑프라자)","Type":"근린상가","StrNum":42,"Floor":"B1","FlrNum":38,"RegDate":"2020.10.10"},\n' +
        '{"Sido":"서울특별시","Gu":"강남구","Dong":"개포동","Store":"푸드코리아(석탑프라자)","Type":"근린상가","StrNum":42,"Floor":"B1","FlrNum":38,"RegDate":"2020.10.10"},\n' +
        '{"Sido":"서울특별시","Gu":"강남구","Dong":"개포동","Store":"푸드코리아(석탑프라자)","Type":"근린상가","StrNum":42,"Floor":"B1","FlrNum":38,"RegDate":"2020.10.10"},\n' +
        '{"Sido":"서울특별시","Gu":"강남구","Dong":"개포동","Store":"푸드코리아(석탑프라자)","Type":"근린상가","StrNum":42,"Floor":"B1","FlrNum":38,"RegDate":"2020.10.10"},\n' +
        '{"Sido":"서울특별시","Gu":"강남구","Dong":"개포동","Store":"푸드코리아(석탑프라자)","Type":"근린상가","StrNum":42,"Floor":"B1","FlrNum":38,"RegDate":"2020.10.10"},\n' +
        '{"Sido":"서울특별시","Gu":"강남구","Dong":"개포동","Store":"푸드코리아(석탑프라자)","Type":"근린상가","StrNum":42,"Floor":"B1","FlrNum":38,"RegDate":"2020.10.10"},\n' +
        '{"Sido":"서울특별시","Gu":"강남구","Dong":"개포동","Store":"푸드코리아(석탑프라자)","Type":"근린상가","StrNum":42,"Floor":"B1","FlrNum":38,"RegDate":"2020.10.10"},\n' +
        '{"Sido":"서울특별시","Gu":"강남구","Dong":"개포동","Store":"푸드코리아(석탑프라자)","Type":"근린상가","StrNum":42,"Floor":"B1","FlrNum":38,"RegDate":"2020.10.10"}]');

        var datatable = $('#kt_datatable_2').KTDatatable({
            // datasource definition
            data: {
                type: 'local',
                source: dataJSONArray,
                pageSize: 10,
            },

            // layout definition
            layout: {
                scroll: true, // enable/disable datatable scroll both horizontal and vertical when needed.
                height: 400, // datatable's body's fixed height
                footer: false, // display/hide footer
            },

            // column sorting
            sortable: true,

            pagination: false,

            toolbar: {
                items: {
                    info: false,
                }
            },

            // columns definition
            columns: [{
                field: 'Sido',
                title: '시도',
                textAlign: 'center',
            }, {
                field: 'Gu',
                title: '구시군',
                textAlign: 'center',
            }, {
                field: 'Dong',
                title: '읍면동',
                textAlign: 'center',
            }, {
                field: 'Store',
                title: '상가',
                textAlign: 'center',
            }, {
                field: 'Type',
                title: '유형',
                textAlign: 'center',
            }, {
                field: 'StrNum',
                title: '총점포수',
                textAlign: 'center',
            }, {
                field: 'Floor',
                title: '층별',
                textAlign: 'center',
            }, {
                field: 'FlrNum',
                title: '층별점포수',
                textAlign: 'center',
            }, {
                field: 'RegDate',
                title: '입주년월',
                type: 'date',
                width: 145,
                format: 'YYYY-MM-DD',
                textAlign: 'center',
            }],
        });

    };

    // 201215 데모테이블 추가 
    // demo initializer
    var demo3 = function() {
        var dataJSONArray = JSON.parse('[{"Category":"도소매","2020":"10","2019":"12","2018":"10","2017":"12","2016":11,"2015":"10","2014":20},\n' +
            '{"Category":"외식","2020":"10","2019":"12","2018":"10","2017":"12","2016":11,"2015":"10","2014":20},\n' +
            '{"Category":"서비스","2020":"10","2019":"12","2018":"10","2017":"12","2016":11,"2015":"10","2014":20},\n' +
            '{"Category":"제조","2020":"10","2019":"12","2018":"10","2017":"12","2016":11,"2015":"10","2014":20},\n' +
            '{"Category":"금융","2020":"10","2019":"12","2018":"10","2017":"12","2016":11,"2015":"10","2014":20},\n' +
            '{"Category":"종교","2020":"10","2019":"12","2018":"10","2017":"12","2016":11,"2015":"10","2014":20},\n' +
            '{"Category":"국가기관","2020":"10","2019":"12","2018":"10","2017":"12","2016":11,"2015":"10","2014":20},\n' +
            '{"Category":"기타","2020":"10","2019":"12","2018":"10","2017":"12","2016":11,"2015":"10","2014":20},\n' +
            '{"Category":"기타","2020":"10","2019":"12","2018":"10","2017":"12","2016":11,"2015":"10","2014":20}]');

        var datatable = $('#kt_datatable_3').KTDatatable({
            // datasource definition
            data: {
                type: 'local',
                source: dataJSONArray,
                pageSize: 10,
            },

            // layout definition
            layout: {
                scroll: true, // enable/disable datatable scroll both horizontal and vertical when needed.
                height: 450, // datatable's body's fixed height
                footer: false, // display/hide footer
            },

            // column sorting
            sortable: true,

            pagination: false,

            toolbar: {
                items: {
                    info: false,
                }
            },

            // columns definition
            columns: [{
                field: 'Category',
                title: '업종',
                textAlign: 'center',
            }, {
                field: '2020',
                title: '2020년',
                textAlign: 'center',
            }, {
                field: '2019',
                title: '2019년',
                textAlign: 'center',
            }, {
                field: '2018',
                title: '2018년',
                textAlign: 'center',
            }, {
                field: '2017',
                title: '2017년',
                textAlign: 'center',
            }, {
                field: '2016',
                title: '2016년',
                textAlign: 'center',
            }, {
                field: '2015',
                title: '2015년',
                textAlign: 'center',
            }, {
                field: '2014',
                title: '2014년',
                textAlign: 'center',
            }],
        });

    };

    return {
        // Public functions
        init: function() {
            // init dmeo
        	_demo1_1();
        	demo1();
            _demo2();
            demo2();
            demo3();
        },
    };
}();

$(document).on('click', '.dashboard_tab_box button', function(){
    var tab_current_Num = $(this).index();
    var tab_length = $('.dashboard_tab_content').length;
    for(var i=0;i<tab_length;i++){
        if( i == tab_current_Num){
            // $('#dashboard_tab_content_'+i).css('display','block');
            $('#dashboard_tab_content_'+i).addClass('active');
        }else{
            // $('#dashboard_tab_content_'+i).css('display','none');
            $('#dashboard_tab_content_'+i).removeClass('active');
        }
    }
});
jQuery(document).ready(function() {
    KTDatatableSupplyTrend.init();
});
