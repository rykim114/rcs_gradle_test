'use strict';
// Class definition
 
var searchtext = "";
if( z.getValue("searchtext") !=null){
	searchtext = z.getValue("searchtext");
	$('#kt_datatable_search_query').val(searchtext).trigger($.Event("keyup", { keyCode: 13 }));
}

var KTDatatableNotice = function() {
    // Private functions

    // demo initializer
    var demo = function() {
        var dataJSONArray = z.xA("Admin", "zeons_공지사항", "select", {}, "json2");
        
        var datatable = $('#notice_table').KTDatatable({
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
                footer: false, // display/hide footer,
            },

            // column sorting
            sortable: false,

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
                width: 20,
                type: 'number',
                textAlign: 'center'
            }, {
                field: 'seq',
                title: '',
                visible: false,
                width: 0,
                type: 'number',
                textAlign: 'center',
            }, {
                field: '분류',
                title: '분류',
                width: 70,
                // callback function support for column rendering
                template: function(row) {

                    var status = {
                        10: {
                            'title': '공지',
                            'class' : 'label-outline-primary'
                        },
                        20: {
                            'title': '안내',
                            'class' : 'label-outline-secondary'
                           
                        },
                        30: {
                            'title': '업데이트',
                            'class' : 'label-outline-danger'
                        },
                        40: {
                            'title': '이벤트',
                            'class' : 'label-outline-warning'
                            
                        },
                    };
                    return '<span class="label font-weight-bold ' + status[row.분류].class + ' label-lg label-inline">' + status[row.분류].title + '</span>';
                },
                textAlign: 'center',
            }, {
                field: 't_title',
                title: '제목',
                width: 620,
                textAlign: 'center',
                template: function(row) {
                    return '<a href="javascript:;" onclick="noticeView('+ row.seq+');">' + row.t_title  + '</a>';
                },
            }, {
                field: '입력일자',
                title: '등록일시',
                type: 'date',
                sortable: false,
                width: 80,
                dateFormat:'YYYY-MM-DD',
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
                                <a onclick="noticeModify('+ row.seq + ');" class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">\
                                    <i class="flaticon2-pen"></i>\
                                </a>\
                                <a onclick="noticeDelete('+ row.seq + '); return false;" class="btn btn-sm btn-clean btn-icon" title="Delete">\
                                    <i class="flaticon2-trash"></i>\
                                </a>\
                            </div>\
						';
	                },
	            }
            ],
        })

        $('#kt_datatable_search_status').on('change', function() {
            datatable.search($(this).val().toLowerCase(), '분류');
        });
        
        $('#kt_datatable_search_status').selectpicker();

		// 20210614 퍼블 요청으로 추가
		$('#notice_table table').addClass('table-vertical table-td-fixed-height');
		
        $('#kt_datatable_search_query').keyup(function () { //input의 값대로 search
            searchtext = $(this).val();
        })
    };


    return {
        // Public functions
        init: function() {
            // init dmeo
            demo();
        },
    };
}();

function noticeDelete(seq){
	z.msgYN("삭제하시겠습니까?",  function (res) {
		if(res == true){
			var dataJSONArray  = z.xA("Admin", "zeons_공지사항", "delete", {"seq" : seq}, "json2");
			z.buttonClick("MA0612", "공지삭제", "D");
			$('#notice_table').KTDatatable().destroy();
			noticeInit();
		}else{
			return;
		}
	});
};

function noticeModify(seq){
	
	z.msgYN("수정하시겠습니까?",  function (res) {
		if(res == true){
			z.setValue("noticeSeq", seq);
			z.buttonClick("MA0612", "공지수정", "U");
			z.menuLink("MA061203");
		}else{
			return;
		}
	});
}

function noticeInit(){
	KTDatatableNotice.init(); // reload 안되서 init
}

function noticeView(seq){
	z.setValue('searchtext', searchtext);
	z.setValue('seq', seq);
	z.setValue('detailView', 'N');
	z.buttonClick("MA061209", "상세조회", "R" );
	z.menuLink("MA061209");
}

jQuery(document).ready(function() {
	KTDatatableNotice.init();
	
	$('#noticeWrite').on('click', function(e){		
		z.setValue("noticeSeq", "");
		z.menuLink("MA061203");
	})
});	

