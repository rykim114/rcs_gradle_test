'use strict';
// Class definition
var searchtext = "";
if( z.getValue("searchtext") !=null){
	searchtext = z.getValue("searchtext");
	$('#kt_datatable_search_query').val(searchtext).trigger($.Event("keyup", { keyCode: 13 }));
}

function noticeView(seq){
	z.setValue('searchtext', searchtext);
	z.setValue('seq', seq);
	z.setValue('detailView', 'Y');
	z.buttonClick("MA0612", "공지상세", "R" );
	z.menuLink("MA061209");
}

var KTDatatableNotice = function() {
    // Private functions

    // demo initializer
    var demo = function() {
        var dataJSONArray = z.xA("Setting", "zeons_사용자공지사항", "select", {}, "json2");
       
        var datatable = $('#notice_user_table').KTDatatable({
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
                field: '번호',
                title: '',
                sortable: true,
                width: 20,
                type: 'number',
                textAlign: 'center',
            }, {
                field: 'seq',
                title: 'seq',
                type: 'number',
                width: 0,
                visible: false,
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
                    
                 
                    return '<span class="label font-weight-bold label-lg label-inline '+ status[row.분류].class + '">' + status[row.분류].title + '</span>';
                },
                textAlign: 'center',
            }, {
                field: '제목',
                title: '제목',
                width: 700,
                textAlign: 'center',
                template: function(row) {
                    return '<a href="javascript:;" onclick="noticeView('+ row.seq+');">' + row.제목  + '</a>';
                },
 
	         }, {
	                field: '입력일자',
	                title: '등록일시',
	                type: 'date',
	                width: 80,
	                textAlign: 'center',
	            }
            ],
        })

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
            demo();
        },
    };
}();

jQuery(document).ready(function() {
    KTDatatableNotice.init();
});
