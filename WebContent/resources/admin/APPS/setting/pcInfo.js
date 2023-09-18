'use strict';
// Class definition

var $showName = $('#showName'),
	$showDate = $('#showDate'),
	$showContDuration = $('#showContDuration'),
	$showUsageDuraion = $('#showUsageDuraion'),
	$showTel = $('#showTel'),
	$showStatusTel = $('#showStatusTel'),
	$currentIp = $('#currentIp'),
	$availableIp = $('#availableIp'),
	$total = $('#total');

var KTDatatablePCInfo = function() {
    // Private functions
	
    var demo = function() {
	
	    var pcArr = z.xA("Setting", "zeons_IP등록현황", "select", {}, "json2");

        var datatable = $('#kt_datatable_status').KTDatatable({
            // datasource definition 
            data: {
                type: 'local',
                source: pcArr,
                pageSize: 10,
            },

            // layout definition
            layout: {
                scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
                // height: 450, // datatable's body's fixed height
                footer: false, // display/hide footer
            },

            // column sorting
            sortable: true,

            pagination: true,

            toolbar: {
                items: {
                    info: false,
                }
            },

//            search: {
//                input: $('#kt_datatable_search_query'),
//                key: 'generalSearch'
//            },

            // columns definition
            columns: [{
                field: 'seq',
                title: '',
                sortable: false,
                width: 50,
                type: 'number',
                textAlign: 'center',
            }, {
                field: 'pc명',
                title: 'IP구분명',
                textAlign: 'center',
            }, {
                field: '아이피',
                title: 'IP주소',
                textAlign: 'center',
            }, {
                field: '등록일시',
                title: '등록일시',
                type: 'date',
                format: 'YYYY-MM-DD',
                textAlign: 'center',
            }, {
                field: '발생일시',
                title: '최근접속시간',
                type: 'date',
                format: 'YYYY-MM-DD',
                textAlign: 'center',
            }],
        });
       
        $('#kt_datatable_search_status').selectpicker();

		datatable.setDataSourceParam("sort", {sort: "asc", field: "seq"});
    };
    return {
        // Public functions
        init: function() {
            // init dmeo
            demo();
            
        },
    };
}();

var KTDatatablePCInfoList = function(params) {

    var demo = function() {
	
	    var IpArr = z.xA("Setting", "zeons_PC접속정보", "select", {}, "json2");

		$total.text(z.toComma(IpArr.length));
		
        var datatable = $('#kt_datatable_info').KTDatatable({
            // datasource definition
            data: {
                type: 'local',
                source: IpArr,
                pageSize: 10,
            },

            // layout definition
            layout: {
                scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
                // height: 450, // datatable's body's fixed height
                footer: false, // display/hide footer
            },

            // column sorting
            sortable: true,

            pagination: true,

            toolbar: {
                items: {
                    info: false,
                }
            },

            search: {
                input: $('#kt_datatable_search_query'),
                key: 'generalSearch'
            },

            // columns definition
            columns: [{
                field: '순번',
                title: '',
                sortable: false,
                width: 20,
                type: 'number',
                textAlign: 'center',
            }, {
                field: 'pc명',
                title: 'IP구분명',
                textAlign: 'center',
            }, {
                field: '아이피',
                title: 'IP주소',
                textAlign: 'center',
            }, {
                field: '접속상태',
                title: '접속상태',
                textAlign: 'center',
            }, {
                field: '발생일시',
                title: '발생시간',
                type: 'date',
                format: 'YYYY-MM-DD',
                textAlign: 'center',
            }],

        });

    };
    return {
        // Public functions
        init: function() {          
            demo();
        },
    };
}();

var fnGetPcInfo = function() {
	
	return z.xAsync("Setting", "zeons_PC등록정보", "select", {}, "json2").done(function(resp) {
	
		var pcInfoArr = resp[0],
			availableIp = parseInt(pcInfoArr.pc등록대수) - parseInt(pcInfoArr.사용중인ip);
			
		if (availableIp < 1) {
			availableIp = 0;
		}	
		
		$showName.text(pcInfoArr.pc등록대수);
		$showDate.text(pcInfoArr.계약일자)
		$showContDuration.text(pcInfoArr.계약시작일 + ' ~ ' + pcInfoArr.계약종료일);
		$showUsageDuraion.text(pcInfoArr.잔여일 + '일 남았습니다. 계약 연장을 원하시면 담당자에게 연락해 주시기 바랍니다.');
		$showTel.text('031-1234-1234');	
		$showStatusTel.text('031-1234-1234');
		$currentIp.text(pcInfoArr.사용중인ip);
		$availableIp.text(availableIp);
	});
}

jQuery(document).ready(function() {
    KTDatatablePCInfo.init();
	KTDatatablePCInfoList.init();
	fnGetPcInfo();
});
