'use strict';
// Class definition
var KTDatatableMenu = function() {
    // Private functions
    // demo initializer
    var demo = function() {
      //  var dataJSONArray = z.xA("Admin", "zeons_메뉴", "select", {'useyn' : kt_datatable_search_use.value}, "json2");
        var datatable = $('#menuAuthTable').KTDatatable({
            // datasource definition
        	data : z.getMetronicDatatableDataObj("Admin", "zeons_메뉴", "select", {'useyn' : kt_datatable_search_use.value}, "json2"),
            // layout definition
            layout: {
                scroll: true, // enable/disable datatable scroll both horizontal and vertical when needed.
                // height: 450, // datatable's body's fixed height
                footer: false, // display/hide footer
            }, 
            
            // column sorting
            sortable: false,
           

            pagination: true,

            toolbar: {
                items: {
                    info: false,
                }
            },
            // columns definition
            columns: [{
                field: 'sortmenu',
                title: '',
                sortable: false,
                width: 20,
                type: 'number',
                textAlign: 'center'
            }, {
                field: 'menucode',
                title: '메뉴코드',
                sortable: false,
                width: 80,
                type: 'text',
                textAlign: 'center'
            }, {
                field: 'lvl',
                title: '레벨',
                sortable: false,
                width: 80,
                type: 'number',
                textAlign: 'center'
            }, {
            	field: 'upmenucode',
                title: '상위메뉴코드',
                type: 'text',
                visible: false,
                width: 80,
                textAlign: 'center'
            }, {
                field: 'menuname',
                title: '메뉴명',
                width: 300,
                textAlign: 'left',
                template: function(row) {
                    return '<a href="javascript:;" onclick="menuView(\''+ row.menucode +'\');">' + row.menuname  + '</a>';
                }
            }, {
                field: 'menubaryn',
                title: '메뉴바오픈여부',
                type: 'text',
                sortable: false,
                width: 100,
                textAlign: 'center',
                template: function(row) {
                    var status = {
                        'N': {
                            'title': '미사용'
                        },
                        'Y': {
                            'title': '사용'
                        },
                    };
                    return (status[row.menubaryn].title=='미사용'?'<div class="label label-outline-warning  font-weight-bold label-lg label-inline">' + status[row.menubaryn].title + '</div>':'<div class="label label-outline-primary font-weight-bold label-lg label-inline">' + status[row.menubaryn].title + '</div>');
                }
            }, {
                field: 'modalyn',
                title: '모달창사용여부',
                type: 'text',
                sortable: false,
                width: 100,
                textAlign: 'center',
                template: function(row) {
                    var status = {
                        'N': {
                            'title': '미사용'
                        },
                        'Y': {
                            'title': '사용'
                        },
                    };
                    return (status[row.modalyn].title=='미사용'?'<div class="label label-outline-warning font-weight-bold label-lg label-inline">' + status[row.modalyn].title + '</div>':'<div class="label label-outline-primary font-weight-bold label-lg label-inline">' + status[row.modalyn].title + '</div>');
                }
            }, {
                field: 'useyn',
                title: '사용여부',
                type: 'text',
                sortable: false,
                width: 100,
                textAlign: 'center',
                template: function(row) {
                    var status = {
                        'N': {
                            'title': '미사용'
                        },
                        'Y': {
                            'title': '사용'
                        },
                    };
                    return (status[row.useyn].title=='미사용'?'<div class="label label-outline-warning font-weight-bold label-lg label-inline">' + status[row.useyn].title + '</div>':'<div class="label label-outline-primary font-weight-bold label-lg label-inline">' + status[row.useyn].title + '</div>');
                }
            }, {
                field: 'Actions',
                title: '관리',
                sortable: false,
                width: 125,
                textAlign: 'center',
                template: function(row) {
                    return '\
							<div>\
                                <a onclick="menuModify(\''+ row.menucode + '\');" class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">\
                                    <i class="flaticon2-pen"></i>\
                                </a>\
                                <a onclick="menuDelete(\''+ row.menucode + '\'); return false;" class="btn btn-sm btn-clean btn-icon" title="Delete">\
                                    <i class="flaticon2-trash"></i>\
                                </a>\
                            </div>\
						';
	                },
	            }
            ],
        })
        $('#kt_datatable_search_use').on('change', function(){
        	datatable.search($(this).val().toLowerCase(), 'useyn');
        });
        $('#kt_datatable_search_use').selectpicker();
    };
    return {
        // Public functions
        init: function() {
            // init dmeo
        	kt_datatable_search_use.value = "Y";
            demo();
        	$("#menuAuthTable > table > thead > tr > th").removeClass('datatable-cell-left'); 
        	$("#menuAuthTable > table > thead > tr > th").addClass('datatable-cell');
        },
    };
}();

function menuDelete(menucode){
	z.msgYN("미사용으로 변경하시겠습니까?",  function (res) {
		if(res == true){
			var dataJSONArray  = z.xA("Admin", "zeons_메뉴", "delete", {"menucode" : menucode}, "json2");
			z.buttonClick("MA0609", "메뉴삭제", "D");
		
			z.msg("사용여부가 변경됐습니다.", function(res){
				
				$('#menuAuthTable').KTDatatable().reload();
			});
		
		}else{
			return;
		}
	});
};

function menuModify(menucode){	
	z.msgYN("수정하시겠습니까?",  function (res) {
		if(res == true){
			z.setValue("menuCode", menucode);
			z.menuLink("MA060906");
		}else{
			return;
		}
	});
}

function menuView(menucode){
	z.setValue('menuCode', menucode);
	z.buttonClick("MA060909", "상세조회", "R" );
	z.menuLink("MA060909");
}

jQuery(document).ready(function() {
	KTDatatableMenu.init();

	$('#menuWrite').on('click', function(e){		
		z.setValue("menuCode", "");
		z.menuLink("MA060903");
	})
});	

