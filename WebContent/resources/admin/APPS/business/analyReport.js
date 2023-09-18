'use strict';
// Class definition
var	$selectpicker = $("#kt_datatable_search_status");
var searchtext = "";

if( z.getValue("searchtext") !=null){
	searchtext = z.getValue("searchtext");
	$('#kt_datatable_search_query').val(searchtext).trigger($.Event("keyup", { keyCode: 13 }));
}

function businessView(seq){	
	if(_isDemo || _isTest) {
	} else {
		z.setValue('searchtext', searchtext);
		z.setValue('seq', seq);
		z.setValue('detailView', 'N');
		z.buttonClick("MA061509", "상권분석상세조회", "R" );
		z.menuLink("MA061509")
	}	      
}

var fnGetList = function() {
	return z.xAsync("Admin", "zeons_공통코드관리상세", "select", {master: '100200', detail: '', YN: 'Y', order: 'asc'}, "json2").done(function(resp) {
		var listArr = resp;
		$selectpicker.html('').append($('<option/>', {value: '', text: '전체'}));
		
		for (var i in listArr) {
			var list = listArr[i],
				$opt = $('<option/>', {text: list.공통상세명, value: list.공통상세코드});
			$selectpicker.append($opt);	
		}
		
		$selectpicker.selectpicker('refresh');

	})
};

var KTDatatableAnalReport = function() {
    // Private functions
    // demo initializer
    var demo = function() {
	
        var dataJSONArray = z.xA("Admin", "zeons_상권분석관리", "select", {status: 'Y'}, "json2");

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
            sortable: false,

            bSortable: false ,
            
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
            	  field: '번호',
                  title: '',
                  sortable: true,
                  type: 'date',
                  width: 40,
                  type: 'number',
                  textAlign: 'center',
            }, {
                field: 'seq',
                title: '',
                visible: false,
                width: 0,
                type: 'number',
                textAlign: 'center',
            }, {
                field: '분류명',
                title: '분류명',
                width: 60,
				textAlign: 'center',
                template: function(row) {   
                	return '<span class="label font-weight-bold label-lg label-inline label-outline-primary">' + row.분류명 + '</span>';
                    
                },
            }, {
                field: 't_title',
                title: '제목',
                width: 900,
				textAlign: 'center',
                template: function(row) {
                    return '<a href="javascript:;" onclick="businessView('+ row.seq +')";>' + row.t_title  + '</a>';
                },
            }, {
                field: '입력일자',
                title: '등록일시',
                type: 'date',
                width: 145,
                textAlign: 'center',
            }],
        });

        $('#kt_datatable_search_status').on('change', function() {
            datatable.search($(this).val().toLowerCase(), '분류');
        });
        
        $('#kt_datatable_search_status').selectpicker();

        $('#kt_datatable_search_query').keyup(function () { //input의 값대로 search
            searchtext = $(this).val();
        })
        
    };

    return {
        // Public functions
        init: function() {
            // init dmeo
        	fnGetList();
            demo();
        },
    };
}();

jQuery(document).ready(function() {
    KTDatatableAnalReport.init();
});
