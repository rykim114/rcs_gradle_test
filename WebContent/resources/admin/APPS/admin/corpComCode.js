'use strict';
// Class definition
/**** 전역변수 ******************************************************************************************************************/
var isDetail1Opened = false,
	master_code = '',
	detail_code = '',
	whichModal = '';

/**** 테이블 1 ******************************************************************************************************************/
var corpCodeTable = function() {
	var demo = function(){		
		var datatable = $('#CorpCodeTable').KTDatatable({		
			data: z.getMetronicDatatableDataObj("Admin", "zeons_법인코드관리마스터", "select", {}, "json2"),
				
	         layout: {
	             scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
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
	
	         search: {
	             input: $('#kt_datatable_search_query'),
	             key: 'generalSearch'
	         },
	         columns: [{
	             field: '법인마스터코드',
	             title: '법인코드',
	             width: 80,
	             textAlign: 'center',
	         }, {
	             field: 't_title',
	             title: '법인코드명',
	             width: 100,
	             textAlign: 'center',
	        },{
	            field: '사용여부',
	            title: '사용여부',
	            width: 70,
	            // callback function support for column rendering
	            template: function(row) {
	
	                var status = {
	                    'Y': {
	                        'title': '사용'
	                    },
	                    'N': {
	                        'title': '미사용'
	                    },
	                };
	                return (status[row.사용여부].title=='미사용'?'<div class="label label-outline-warning  font-weight-bold label-lg label-inline">' + status[row.사용여부].title + '</div>':'<div class="label label-outline-primary font-weight-bold label-lg label-inline">' + status[row.사용여부].title + '</div>');
	           },
	            textAlign: 'center',
	        }, {
	            field: 'Actions',
	            title: '관리',
	            sortable: false,
	            width: 100,
	            textAlign: 'center',
	            template: function(row) {
	                return '\
							<div>\
	                            <a onclick="masterModify(\''+ row.법인마스터코드 + '\');" class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">\
	                                <i class="flaticon2-pen"></i>\
	                            </a>\
	                            <a onclick="masterDeleteConfirm(\''+ row.법인마스터코드 + '\'); return false;" class="btn btn-sm btn-clean btn-icon" title="Delete">\
	                                <i class="flaticon2-trash"></i>\
	                            </a>\
	                        </div>\
						';
	                },
	         }],	        
		})
		.on("datatable-on-layout-updated", function (datatable) {			
			$(datatable.currentTarget).find(".datatable-body .datatable-row").off("click").on("click", function () {
				var $this     = $(this),
					$wrapper = $('#CorpCodeTable'),
				 	ariaLabel_1 = $this.find('td').eq(0).attr("aria-label"),
				 	ariaLabel_2 = $this.find('td').eq(1)[0].ariaLabel,	
					ariaLabel = ariaLabel_1 == null ? ariaLabel_2 : ariaLabel_1;
					
				$wrapper.children('table').children('tbody').children('tr:nth-child(2n)').addClass('datatable-row-even');
				
				if ($this.hasClass('datatable-row-even')) {
					$this.removeClass('datatable-row-even');					
				}			
				$this.addClass('trSelected');	
				$this.siblings().removeClass('trSelected');
				getCodeDetail_1(ariaLabel);
			});
			$(datatable.currentTarget).find(".datatable-body .datatable-row").eq(0).click();
		});
	}
	
	demo();	
};	

function detailInit_1(code) {	
		master_code = code;
		var corpDetailTable_1 = function(){			
			var datatable = $('#CorpDetailCodeTable_1').KTDatatable({
				data: z.getMetronicDatatableDataObj("Admin", "zeons_법인코드관리상세", "select", {"master":code}, "json2"),
	
		         // layout definition
		         layout: {
		             scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
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
				 translate : {
	            	records : {
	            		noRecords : '등록된 상세코드가 없습니다.'
	            	}
	            },
	
//		         search: {
//		             input: $('#kt_datatable_search_query'),
//		             key: 'generalSearch'
//		         },
		         columns: [{
		             field: '법인상세코드',
		             title: '상세코드',
		             width: 100,
		             textAlign: 'center',
		        },{
		             field: '법인상세명',
		             title: '상세명',
		             width: 100,
		             textAlign: 'center',
		        },{
	                field: '사용여부',
	                title: '사용여부',
	                width: 70,
	                // callback function support for column rendering
	                template: function(row) {
	
	                    var status = {
	                        'Y': {
	                            'title': '사용'
	                        },
	                        'N': {
	                            'title': '미사용'
	                        },
	                    };
	                    return (status[row.사용여부].title=='미사용'?'<div class="label label-outline-warning  font-weight-bold label-lg label-inline">' + status[row.사용여부].title + '</div>':'<div class="label label-outline-primary font-weight-bold label-lg label-inline">' + status[row.사용여부].title + '</div>');
	               },
	                textAlign: 'center',
	            }, {
	                field: 'Actions',
	                title: '관리',
	                sortable: false,
	                width: 80,
	                textAlign: 'center',
	                template: function(row) {
	                    return '\
								<div>\
	                                <a onclick="detailModify(\''+ row.법인상세코드 + '\');" class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">\
	                                    <i class="flaticon2-pen"></i>\
	                                </a>\
	                                <a onclick="detailDeleteConfirm(\''+ row.법인상세코드 + '\'); return false;" class="btn btn-sm btn-clean btn-icon" title="Delete">\
									<i class="flaticon2-trash"></i>\
	                                </a>\
	                            </div>\
						';
	                },
	         }],	        
		})
		.on("datatable-on-layout-updated", function (datatable) {
			$(datatable.currentTarget).find(".datatable-body .datatable-row").on("click", function () {	
				var $this    = $(this),
					$wrapper = $('#CorpDetailCodeTable_1'),			
					ariaLabel_1 = $this.find('td').eq(0).attr("aria-label"),
					ariaLabel_2 = $this.find('td').eq(1)[0].ariaLabel,				
					ariaLabel = ariaLabel_1 == null ? ariaLabel_2 : ariaLabel_1;

	//				getCodeDetail_1(ariaLabel);
			});
			
		});
//		$(datatable.currentTarget).find(".datatable-body .datatable-row").eq(0).click();

	};
	corpDetailTable_1();
}

function getCodeDetail_1(code){	
	if(isDetail1Opened == false){	
		detailInit_1(code);
		isDetail1Opened = true;
	}else{	
		$('#CorpDetailCodeTable_1').KTDatatable().destroy();
		detailInit_1(code);
	}
}

function masterModal(){	
	$('#insertModal').text('법인코드 등록');
	$('#corpCode').val('');
	$('#corpCodeName').val('');
	$('#corpCodeSort').val('');
	$('#corpCode').removeAttr('readonly');
	if($("input:checkbox[id='useYN']").is(":checked")){
		$('input:checkbox[id="useYN"]').prop('checked',false);		
	}
	whichModal = 'MasterInsert';
}

function masterModify(code){	
	var dataJSONArray =  z.xA("Admin", "zeons_법인코드관리마스터", "select", {"master":code}, "json2");	
	$('#insertModal').text('법인공통코드 수정');
	$('#corpCode').val(dataJSONArray[0].법인마스터코드);
	$('#corpCode').attr('readonly','true');
	$('#corpCodeName').val(dataJSONArray[0].t_title);
	$('#corpCodeSort').val(dataJSONArray[0].정렬코드);
	if(dataJSONArray[0].사용여부 == 'Y'){
		$('input:checkbox[id="useYN"]').prop('checked',true);
	} else {
		$('input:checkbox[id="useYN"]').prop('checked',false);			
	}
	whichModal = 'MasterModify';
	$('#kt_auth_modal').modal('toggle');	
}

// 삭제하려는 법인구분을 사용하고 있는 법인이 있는지 확인
function masterDeleteConfirm(code){
	var resp = z.xA("Admin", "zeons_법인관리", "select",  {"corpComCode" : code}, "json2");

	if (resp.length) {
			z.msg('해당 법인구분을 사용하고 있는 법인이 있습니다.'); return;				
	} else {
		masterDeleteDetailConfirm(code);
	}	
}

// 사용여부가 Y인 상세코드가 있는지 확인
function masterDeleteDetailConfirm(code) {
	var resp = z.xA("Admin", "zeons_법인관리중불러오기", "select",  {"master" : code}, "json2");

	if (resp.length) {		
		z.msg('해당코드의 사용중인 상세코드가 있습니다.', function(res) {
			if (res == true) {
				return;
			}
		}); 				
	} else {
			masterDelete(code);													
	}
}

// 모달 삭제하려는 법인구분을 사용하고 있는 법인이 있는지 확인
function modalDeleteConfirm(code) {
	var resp = z.xA("Admin", "zeons_법인관리", "select",  {"corpComCode" : code}, "json2");

	if (resp.length > 0) {
		return 0;				
	} else {
		return -1;
	} 	
}

// 모달 사용여부가 Y인 상세코드가 있는지 확인
function modalDeleteDetailConfirm(code) {
	var resp = z.xA("Admin", "zeons_법인관리중불러오기", "select",  {"master" : code}, "json2");

	if (resp.length > 0) {
		return 0;				
	} else {
		return -1;
	}
}

// 법인마스터코드 사용여부 변경
function masterDelete(code) {
	
	z.msgYN(code + '을/를 사용중지 처리하시는게 맞습니까?', function (res) {
		
		if (res == true) {
			var dataJSONArray =  z.xA("Admin", "zeons_법인코드사용유무변경", "delete", {"master":code, "YN":'N'}, "json2");	
			
			z.msg("법인코드 사용여부가 사용중지로 변경되었습니다.", function(res){	
				if(res == true){
					$('#CorpCodeTable').KTDatatable().reload();					
				}				
			});				
		} else {
			return;
		}		
	})	
}

function detailModal(){	
	$('#insertModal').text('법인상세코드 등록');
	$('#corpCode').val('');
	$('#corpCodeName').val('');
	$('#corpCodeSort').val('');
	$('#corpCode').removeAttr('readonly');
	if($("input:checkbox[id='useYN']").is(":checked")){		
		$('input:checkbox[id="useYN"]').prop('checked',false);	
	}	
	whichModal = 'DetailInsert';
}

function detailModify(code){	
	var dataJSONArray =  z.xA("Admin", "zeons_법인코드관리상세", "select", {"master":master_code, "detail":code}, "json2");	
	$('#insertModal').text('법인상세코드 수정');
	$('#corpCode').val(dataJSONArray[0].법인상세코드);
	$('#corpCode').attr('readonly','true');
	$('#corpCodeName').val(dataJSONArray[0].법인상세명);
	$('#corpCodeSort').val(dataJSONArray[0].정렬코드);
	if(dataJSONArray[0].사용여부 == 'Y'){
		$('input:checkbox[id="useYN"]').prop('checked',true);
	} else {
		$('input:checkbox[id="useYN"]').prop('checked',false);		
	}
	whichModal = 'DetailModify';
	$('#kt_auth_modal').modal('toggle');	
}

function detailDeleteConfirm(code) {
	z.msgYN(code + '을/를 사용중지 처리하시는게 맞습니까?', function (res) {
		
		if (res == true) {
			z.xA("Admin", "zeons_법인상세코드사용유무변경", "delete", {"master":master_code, "detail":code, "YN":'N'}, "json2");	
			
			z.msg("법인상세코드 사용여부가 사용중지로 변경되었습니다.", function(res){	
				
				if(res == true){
					$('#CorpDetailCodeTable_1').KTDatatable().reload();				
				}				
			});	
						
		} else {
			return;
		}		
	});		
};

function insertCode(){

	var isInvalid = 0,	
		corpCode = $('#corpCode').val(),
		corpCodeName = $('#corpCodeName').val(),
		corpCodeSort = $('#corpCodeSort').val(), 
		useYN = '';
	
	if ($("input:checkbox[id='useYN']").is(":checked")) {		
		useYN = 'Y'
	} else {
		useYN = 'N'
	}

	switch (whichModal) {
	  case 'MasterInsert':
		var dataJSONArray_1 =  z.xA("Admin", "zeons_법인공통코드관리마스터확인", "select", {"master":corpCode}, "json2");
			if(dataJSONArray_1[0].count > 0){
			z.msg('이미 등록된 코드입니다.');
		} else {
			var dataJSONArray_insert =  z.xA("Admin", "zeons_법인코드관리마스터등록", "insert", {"master": corpCode, "법인마스터명":corpCodeName, "정렬코드":corpCodeSort,"YN":useYN}, "json2");
			z.msg("법인공통코드가 성공적으로 등록되었습니다.", function(res){	
				if(res == true){
					z.buttonClick("MA0624", "법인코드관리마스터등록", "C");
					$('#kt_auth_modal').modal('toggle');
					$('#CorpCodeTable').KTDatatable().reload();
				}				
			});			
		}
	    break;

	  case 'DetailInsert':
		var dataJSONArray_2 =  z.xA("Admin", "zeons_법인공통코드관리상세확인", "select", {"master":master_code, "detail":corpCode}, "json2");
		if(dataJSONArray_2[0].count > 0){
			z.msg('이미 등록된 코드입니다.');
		} else {
			var dataJSONArray_insert =  z.xA("Admin", "zeons_법인코드관리상세등록", "insert", {"master":master_code, "detail":corpCode, "법인상세명":corpCodeName, "정렬코드":corpCodeSort,"YN":useYN}, "json2");
			z.msg("법인상세코드가 성공적으로 등록되었습니다.", function(res){	
				if (res == true){ 	
					z.buttonClick("MA0624", "법인코드관리상세등록", "C");
					$('#kt_auth_modal').modal('toggle');
					$('#CorpDetailCodeTable_1').KTDatatable().reload();					
				}			
			});			
		}
	    break;

	  case 'MasterModify':
		// 상세코드가 있거나 사용중인 법인이 있을시 리턴
		if (useYN == 'N') {
			if (modalDeleteConfirm(corpCode) > -1) {
				z.msg('해당 법인구분을 사용하고 있는 법인이 있습니다.'); 				
				++isInvalid;
			} 

			if (modalDeleteDetailConfirm(corpCode) > -1) {
				z.msg('해당코드의 사용중인 상세코드가 있습니다.');
				++isInvalid;	
			}						
		}

		if (isInvalid < 1) {
			z.xA("Admin", "zeons_법인공통코드수정", "update", {"master":corpCode, "법인마스터명":corpCodeName, "정렬코드":corpCodeSort,"YN":useYN}, "json2");
			z.msg("법인공통코드가 성공적으로 수정되었습니다.", function(res) {	
				if (res == true) {			
					z.buttonClick("MA0624", "법인공통코드관리마스터수정", "U");	
					$('#kt_auth_modal').modal('toggle');
					$('#CorpCodeTable').KTDatatable().reload();									
				}				
			});				
		} 

	  break;

	  case 'DetailModify':

		if (useYN == 'Y') {
			var respArr = z.xA("Admin", "zeons_법인관리대불러오기", "select",  {"master" : master_code}, "json2");
			if (respArr.length < 1) {
				++isInvalid;
			}
		}

		if (isInvalid > 0) {
			z.msg('법인구분1 사용여부를 사용으로 바꿔주시기 바랍니다.')			
		} else {
			var dataJSONArray_update =  z.xA("Admin", "zeons_법인공통상세코드수정", "update", {"master":master_code, "detail":corpCode, "법인상세명":corpCodeName, "정렬코드":corpCodeSort,"YN":useYN}, "json2");
			z.msg("법인상세코드가 성공적으로 수정되었습니다.", function(res){	
				if (res == true){ 						
					z.buttonClick("MA0624", "법인공통코드관리상세수정", "U");
					$('#kt_auth_modal').modal('toggle');
					$('#CorpDetailCodeTable_1').KTDatatable().reload();			
				}				
			});				
		}
	    break;	
	}	
}

jQuery(document).ready(function(){
	corpCodeTable();
})

