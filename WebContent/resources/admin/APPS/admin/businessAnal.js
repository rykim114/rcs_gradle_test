'use strict';
// Class definition
var	$selectpicker = $("#kt_datatable_search_status");
var searchtext = "";

if( z.getValue("searchtext") !=null){
	searchtext = z.getValue("searchtext");
	$('#kt_datatable_search_query').val(searchtext).trigger($.Event("keyup", { keyCode: 13 }));
}

$(document).ready(function() {	
	
	$('#businessAnalWrite').on('click', function(e){
		z.setValue("businessSeq", "");
		z.menuLink("MA061503");		
	})

});

function businessView(seq){
	if(_isDemo || _isTest) {
	
	} else {
		z.setValue('searchtext', searchtext);
		z.setValue('seq', seq);
		z.setValue('detailView', 'Y');
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

var KTDatatableBusinessAnal = function() {
    // Private functions

    // demo initializer
    var demo = function() {
	
        var dataJSONArray = z.xA("Admin", "zeons_상권분석관리", "select", {}, "json2");

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
                  sortable: false,
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
                field: 'Subject',
                title: '제목',
                width: 600,
				textAlign: 'center',
                template: function(row) {
                    return '<a href="javascript:;" onclick="businessView('+ row.seq +')";>' + row.t_title  + '</a>';
                },
            }, {
                field: '입력일자',
                title: '등록일시',
                type: 'date',         
                width: 145,
                dateFormat : 'YYYY-MM-DD',
                textAlign: 'center',
            }, {
                field: '공지구분',
                title: '상태',
                type: 'text',
                sortable: false,
                width: 80,
                textAlign: 'center',
                template: function(row) {

                    var status = {
                        'N': {
                        	'class' : 'label-primary',
                            'title': '작성중'
                        },
                        'Y': {
                            'title': '작성완료'
                        },
                    };
                    return '<div class="label font-weight-bold label-lg ' + status[row.공지구분].class + ' label-inline">' + status[row.공지구분].title + '</div>';
                },
            }, {
                field: 'Actions',
                title: '관리',
                sortable: false,
                width: 125,
                textAlign: 'center',
                template: function(row) {
                    return '\
							<div>\
                                <a onclick="businessAnalModify('+ row.seq + ');" class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">\
                                    <i class="flaticon2-pen"></i>\
                                </a>\
                                <a onclick="businessAnalDelete('+ row.seq + '); return false;" class="btn btn-sm btn-clean btn-icon" title="Delete">\
                                    <i class="flaticon2-trash"></i>\
                                </a>\
                            </div>\
						';
                },
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

function businessAnalDelete(seq){

	z.msgYN("삭제하시겠습니까?",  function (res) {
		if(res == true){
			var dataJSONArray  = z.xA("Admin", "zeons_상권분석관리", "delete", {"seq" : seq}, "json2");
			z.buttonClick("MA0615", "상권분석삭제", "D");
			$('#kt_datatable').KTDatatable().destroy();
			bizInit();
		}else{
			return;
		}
	});
};

function businessAnalModify(seq){
	
	z.msgYN("수정하시겠습니까?",  function (res) {
		if(res == true){
			z.setValue("businessSeq", seq);
			z.menuLink("MA061503");		
		}else{
			return;
		}
	});
	
}

function bizInit(){

	KTDatatableBusinessAnal.init();
}

jQuery(document).ready(function() {
    KTDatatableBusinessAnal.init();
});
