'use strict';
// Class definition


var KTDatatableUserLog = function() {
    // Private functions

    // demo initializer
    var demo = function() {
  
    	var dateStart = $('.dateStart').val();
    	var today = $('.dateEnd').val();
    	
    	z.setValue('dateStart',dateStart);
		z.setValue('dateEnd', today);
		
    	var dataJSONArray = z.xA("Admin", "zeons_사용자접속로그", "select", {'dateStart' : dateStart, 'dateEnd' : today}, "json2");
    	
        var datatable = $('#kt_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'local',
                source: dataJSONArray,
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
                width: 0,
                type: 'number',
                visible : false, 
                width: 0,
                textAlign: 'center',
            }, {
                field: '번호',
                title: '',
                type: 'number',
                width: 30,
                textAlign: 'center',
            }, {
                field: '아이디',
                title: 'ID',
                width: 145,
            }, {
                field: '아이피',
                title: 'IP',
                
            }, {
                field: '브라우저구분',
                title: '브라우저',
                width: 145,
                textAlign: 'center',
            }, {
                field: '발생일시',
                title: '등록일시',
                type: 'date',
                width: 145,
                format: 'YYYY-MM-DD HH:MM:SS',
                textAlign: 'center',
            }],
        });

    };

    return {
        // Public functions
        init: function() {
            // init dmeo
            demo();
        },
    };
}();

jQuery(document).ready(function() {
	
	
	defaultDate();
	
	KTDatatableUserLog.init();

	
});

function defaultDate(){

	var today 		= new Date();
	var month 		= today.getMonth() -1;
	var year 		= today.getFullYear();
	var day 		= today.getDate();
	var dateStart;
	var dateEnd;
	
	var checkDate	= z.getValue("checkDate");
	if(checkDate == 'Y'){
		dateStart = z.getValue("dateStart");
		dateEnd = z.getValue("dateEnd");
		$('.dateStart').datepicker('setDate', dateStart);
		$('.dateEnd').datepicker('setDate', dateEnd);
		
	}else{
		dateStart = new Date(year, month , day);
		
		$('.dateStart').datepicker('setDate', dateStart);
		$('.dateEnd').datepicker('setDate', today);
		
	}
}

function dateSearch(){
	$('#kt_datatable').KTDatatable().destroy();
	KTDatatableUserLog.init();

}

function userCount(){
	z.menuLink("MA0603");
}

function menuCount(){
	z.menuLink("MA060303");
}
function searchCount(){
	z.menuLink("MA060306");
}
function downloadCount(){
	z.menuLink("MA060309");
}


