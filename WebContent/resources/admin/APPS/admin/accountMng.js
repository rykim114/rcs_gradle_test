'use strict';
// Class definition

var isInit = true;

var KTDatatableAccount = function() {
    // Private functions

    // demo initializer
    var demo = function() {
    	var dataJSONArray =  z.xA("Admin", "zeons_계정관리", "select", {}, "json2");
    	//상단 껀수 노출
        $("#accountMngCnt").text(dataJSONArray.length);
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
                textAlign: 'center',
            },{
                field: '번호',
                title: 'No',
                width: 21,
                textAlign: 'center',
            }, {
                field: '법인명',
                title: '법인명',
                width: 56,
                textAlign: 'center',
            }/*, {
                field: '법인구분1',
                title: '법인구분1',
                width: 66,
                textAlign: 'center',
            }, {
                field: '법인구분2',
                title: '법인구분2',
                width: 66,
                textAlign: 'center',
            }*/,{
                field: '아이디',
                title: '아이디',
                width: 136,
				textAlign: 'center',
            }, {
                field: '담당자',
                title: '담당자',
                width: 42,
                textAlign: 'center',
            }, {
                field: '담당자연락처',
                title: '담당자연락처',
                width: 90,
                textAlign: 'center',
            }, {
                field: 'ip등록',
                title: 'IP등록',
                width: 45,
                textAlign: 'center',
            }, {
                field: '총로그인',
                title: '총로그인',
                width: 55,
                type: 'number',
                textAlign: 'center',
            }, {
                field: '그룹명',
                title: '그룹명',
                width: 40,
				textAlign: 'center',
            }, {
                field: '계약구분',
                title: '계약구분',
                width: 55,
				textAlign: 'center',
            }, {
                field: '계약시작일',
                title: '계약시작일',
                type: 'date',
                format: 'YYYY-MM-DD',
                width: 80,
                textAlign: 'center',
            }, {
                field: 'd+day',
                title: 'D+day',
                width: 55,
                type: 'number',
                textAlign: 'center',
            }, {
                field: '계약종료일',
                title: '계약종료일',
                type: 'date',
                format: 'YYYY-MM-DD',
                width: 80,
                textAlign: 'center',
            }, {
                field: '잔여일',
                title: '잔여일',
                type: 'number',
                width: 40,
                textAlign: 'center',
            }, {
                field: '최근접속일',
                title: '최근접속일',
                type: 'date',
                format: 'YYYY-MM-DD HH:MM:SS',
                width: 120,
                textAlign: 'center',
            }, {
                field: '사용여부',
                title: '사용여부',
                width: 70,
                template: function(row) {
                    var status = {
                        '만료': {
                        	'class' : 'label-primary',
                            'title': '만료'
                        },
                        '사용중': {
                        	'class' : 'label-outline-danger',
                            'title': '사용중'
                        },
                    };
                    return '<div class="label font-weight-bold label-lg ' + status[row.사용여부].class + ' label-inline">' + status[row.사용여부].title + '</div>';
                },
                textAlign: 'center',
            } ,{
                field: '관리',
                title: '관리',
                textAlign: 'center',
                template: function(row) {
                    return '<a href="javascript:;" onclick="javascript:viewAccount(\''+row.아이디+'\');">상세</a>\
                    &nbsp; <a href="javascript:;" onclick="javascript:updateAccount(\''+row.아이디+'\');">수정</a>\
                    &nbsp; <a href="javascript:;" onclick="javascript:deleteAccount(\''+row.아이디+'\');">삭제</a>';
                }
            }/*,{
                field: '',
                title: '관리',
                textAlign: 'center',
                template: function(row) {
                    return '<button type="button" class="btn btn-outline-secondary" onclick="javascript:updateAccount(\''+row.아이디+'\');">수정</button><button type="button" class="btn btn-outline-secondary" onclick="javascript:deleteAccount(\''+row.아이디+'\');">삭제</button>';
                }
            }*/
            ],
        });
        $('#kt_datatable_search_use').on('change', function(){
        	datatable.search($(this).val().toLowerCase(), '사용여부');
        });
        $('#kt_datatable_search_use').selectpicker();
        
        $('#kt_datatable_search_use').change();
    };

    return {
        // Public functions
        init: function() {
            // init dmeo
            demo();
        },
    };
}();

var initDatatableModal = function(id) {

	var dataJSONArray =  z.xA("Admin", "zeons_계정관리사용자접속정보", "select", {"id":id}, "json2");
    var modal = $('#kt_datatable_modal');

    var datatable = $('#kt_datatable_3').KTDatatable({
        // datasource definition
        data: {
            type: 'local',
            source: dataJSONArray,
            pageSize: 5,
        },

        // layout definition
        layout: {
            scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
            // height: 400, // datatable's body's fixed height
            minHeight: 400,
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

        // columns definition
        columns: [{
            field: '순번',
            title: '',
            sortable: false,
            width: 100,
            type: 'number',
            textAlign: 'center',
        }, {
            field: '아이디',
            title: '아이디',
            textAlign: 'center',
        }, {
            field: '사용자이름',
            title: '사용자명',
            textAlign: 'center',
        }, {
            field: '아이피',
            title: 'IP',
            textAlign: 'center',
        }, {
            field: '발생일시',
            title: '발생일시',
            type: 'date',
            format: 'YYYY-MM-DD',
            textAlign: 'center',
        }]
    });
};

var initDatatableModal2 = function(id) {
	var dataJSONArray =  z.xA("Admin", "zeons_계정관리PC등록정보", "select", {"id":id}, "json2");       
    var modal = $('#kt_datatable_modal');

    var datatable = $('#kt_datatable_2').KTDatatable({
        // datasource definition
        data: {
            type: 'local',
            source: dataJSONArray,
            pageSize: 5,
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

        // columns definition
        columns: [{
            field: '순번',
            title: '',
            sortable: false,
            width: 100,
            type: 'number',
            textAlign: 'center',
        }, {
            field: '아이디',
            title: '아이디',
            textAlign: 'center',
        }, {
            field: '사용자이름',
            title: '사용자명',
            textAlign: 'center',
        }, {
            field: '아이피',
            title: 'IP',
            textAlign: 'center',
        }, {
            field: '등록일시',
            title: '등록일시',
            type: 'date',
            format: 'YYYY-MM-DD',
            textAlign: 'center',
        }, {
            field: '사용여부',
            title: '사용여부',
            // callback function support for column rendering
            template: function(row) {
                var status = {
                    'Y': {
                        'title': '사용',
                        'class': ''
                    },
                    'N': {
                        'title': '삭제',
                        'class': ' label-light-danger'
                    },
                };
                return '<span class="label font-weight-bold label-lg ' + status[row.사용여부].class + ' label-inline">' + status[row.사용여부].title + '</span>';
            },
            textAlign: 'center',
        }, {
            field: '삭제사용자',
            title: '삭제사용자',
            textAlign: 'center',
        }, {
            field: '삭제일시',
            title: '삭제일시',
            type: 'date',
            format: 'YYYY-MM-DD',
            textAlign: 'center',
        }],
    });        
};

function openModal(id){
	
	if( isInit ){
		initDatatableModal(id);
		initDatatableModal2(id);
		isInit = false		
	} else {
		$('#kt_datatable_2').KTDatatable().destroy();
		$('#kt_datatable_3').KTDatatable().destroy();
		initDatatableModal(id);
		initDatatableModal2(id);		
	}
	
}


function listAccount(){
	z.menuLink("MA0606");
	z.buttonClick("MA0606", "계정관리", "R" );
}

function newAccount(){
	z.setValue('seq', "");
	z.menuLink("MA060603");
	z.buttonClick("MA060603", "계정관리등록", "C" );
}

function updateAccount(seq){
	z.setValue('seq', seq);
	z.menuLink("MA060606");
	z.buttonClick("MA060606", "계정관리수정", "U" );
}

function deleteAccount(seq){
	
	z.msgYN("삭제하시겠습니까?",  function (res) {
		if(res == true){
			var dataJSONArray  = z.xA("Admin", "zeons_계정관리사용자삭제", "delete", {"아이디" : seq}, "json2");
			z.buttonClick("MA0606", "계정관리사용자삭제", "D");
			$('#kt_datatable').KTDatatable().destroy();
			KTDatatableAccount.init();
		}else{
			return;
		}
	});
}

function setHeaderFont(){
	$('#kt_datatable > table > thead > tr > th').each(function(){
		$(this).find('span').css('font-size','13px');
	});
}


function viewAccount(seq){
	z.setValue('seq', seq);
	z.setValue("showIpChange" , "hide");
	z.menuLink("MA060601");
	z.buttonClick("MA060601", "계정관리상세", "R" );	
}



jQuery(document).ready(function() {
    KTDatatableAccount.init();
    setTimeout(setHeaderFont , 200);
});
