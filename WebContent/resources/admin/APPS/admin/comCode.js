'use strict';
// Class definition
/**** 전역변수 ******************************************************************************************************************/
var master_code = '';
var whichModal  = '';


/**** 테이블 1 ******************************************************************************************************************/
var comCodeDataTable = function(){
	var demo = function(){
		var datatable = $('#comCodeTable').KTDatatable({
			data: z.getMetronicDatatableDataObj("Admin", "zeons_공통코드관리마스터", "select", {}, "json2"),
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
	             field: '공통마스터코드',
	             title: '공통코드',
	             width: 80,
	             textAlign: 'center',
	         }, {
	             field: '공통마스터명',
	             title: '공통코드명',
	             width: 100,
	             textAlign: 'center',
				 template: function(row){
                    return row.t_title;
				}
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
                                <a onclick="masterModify(\''+ row.공통마스터코드 + '\');" class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">\
                                    <i class="flaticon2-pen"></i>\
                                </a>\
                                <a onclick="masterDelete(\''+ row.공통마스터코드 + '\');" class="btn btn-sm btn-clean btn-icon" title="Delete">\
                                    <i class="flaticon2-trash"></i>\
                                </a>\
                            </div>\
						';
	                },
	         }],	        
		})
		.on("datatable-on-layout-updated", function (datatable) {
			$(datatable.currentTarget).find(".datatable-body .datatable-row").off("click").on("click", function () {
				var $this    = $(this),
					$wrapper = $('#comCodeTable'),
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
	};	
	
	demo();
};


/**** 테이블 1 함수 ******************************************************************************************************************/

function masterModal(){	
	$('#insertModal').text('공통코드 등록');
	$('#masterCode').val('');
	$('#masterCodeName').val('');
	$('#masterCodeSort').val('');
	$('#masterCode').removeAttr('readonly');
	if($("input:checkbox[id='useYN']").is(":checked")){
		$('input:checkbox[id="useYN"]').prop('checked',false);		
	}
	whichModal = 'MasterInsert';
}

function masterModify(code){
	var dataJSONArray =  z.xA("Admin", "zeons_공통코드관리마스터", "select", {"master":code}, "json2");	
	$('#insertModal').text('공통코드 수정');
	$('#masterCode').val(dataJSONArray[0].공통마스터코드);
	$('#masterCode').attr('readonly','true');
	$('#masterCodeName').val(dataJSONArray[0].t_title);
	$('#masterCodeSort').val(dataJSONArray[0].정렬코드);
	if(dataJSONArray[0].사용여부 == 'Y'){
		$('input:checkbox[id="useYN"]').prop('checked',true);
	} else {
		$('input:checkbox[id="useYN"]').prop('checked',false);			
	}
	whichModal = 'MasterModify';
	$('#kt_auth_modal').modal('toggle');	
}

function masterDelete(code) {
	
	z.msgYN(code + '을/를 사용중지 처리하시는게 맞습니까?', function (res) {
		
		if (res == true) {
			var dataJSONArray =  z.xA("Admin", "zeons_공통코드사용유무변경", "delete", {"master":code, "YN":'N'}, "json2");		
			
			z.msg("법인코드 사용여부가 사용중지로 변경되었습니다.", function(res){	
				if(res == true){
					$('#comCodeTable').KTDatatable().reload();	
						if($('#masterCodeDiv').css('display') != 'none'){
							$('#masterCodeDiv').css('display','none');
					}				
				}				
			});				
		} else {
			return;
		}		
	});			
};


/**** 테이블 2 ******************************************************************************************************************/
var isOpened = false;

function detailInit(code){
	master_code = code;	
	var comCodeDetailTable = function(){
		var demo_1 = function(){		
			var datatable = $('#comCodeDetailTable').KTDatatable({
				data: z.getMetronicDatatableDataObj("Admin", "zeons_공통코드관리상세", "select", {"master":code}, "json2"),
	
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
		             field: '공통상세코드',
		             title: '공통상세코드',
		             width: 60,
		             textAlign: 'center',
		        },{
		             field: '공통상세명',
		             title: '공통상세명',
		             width: 120,
		             textAlign: 'center',
		        },{
		             field: '정렬코드',
		             title: '정렬순서',
		             width: 60,
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
	                                <a onclick="detailModify(\''+ row.공통상세코드 + '\');" class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">\
	                                    <i class="flaticon2-pen"></i>\
	                                </a>\
	                                <a onclick="detailDelete(\''+ row.공통상세코드 + '\'); return false;" class="btn btn-sm btn-clean btn-icon" title="Delete">\
									<i class="flaticon2-trash"></i>\
	                                </a>\
	                            </div>\
							';
		                },
		            }],		        
			     });	
				};		
			return {
				init : function(){
					demo_1();
				},
			};
		}();	
	comCodeDetailTable.init();
}

/**** 테이블 2 함수 ******************************************************************************************************************/

function getCodeDetail_1(code){
	if (isOpened == false){
		$('#masterCodeDiv').css('display','');
		detailInit(code);
		isOpened = true;
	} else {
		$('#masterCodeDiv').css('display','');
		$('#comCodeDetailTable').KTDatatable().destroy();
		detailInit(code);
	}
}

function detailModal(){	
	$('#insertModal').text('공통상세코드 등록');
	$('#masterCode').val('');	
	$('#masterCodeName').val('');
	$('#masterCodeSort').val('');
	$('#masterCode').removeAttr('readonly');
	if ($("input:checkbox[id='useYN']").is(":checked")){		
		$('input:checkbox[id="useYN"]').prop('checked',false);	
	}	
	whichModal = 'DetailInsert';
}

function detailModify(code){	
	var dataJSONArray =  z.xA("Admin", "zeons_공통코드관리상세", "select", {"master":master_code, "detail":code}, "json2");	
	$('#insertModal').text('공통상세코드 수정');
	$('#masterCode').val(dataJSONArray[0].공통상세코드);
	$('#masterCode').attr('readonly','true');
	$('#masterCodeName').val(dataJSONArray[0].공통상세명);
	$('#masterCodeSort').val(dataJSONArray[0].정렬코드);
	if (dataJSONArray[0].사용여부 == 'Y'){
		$('input:checkbox[id="useYN"]').prop('checked',true);
	} else {
		$('input:checkbox[id="useYN"]').prop('checked',false);		
	}
	whichModal = 'DetailModify';
	$('#kt_auth_modal').modal('toggle');	
}

function detailDelete(code){
	var dataJSONArray =  z.xA("Admin", "zeons_공통상세코드사용유무변경", "delete", {"master":master_code, "detail":code, "YN":'N'}, "json2");

	z.msg("공통상세코드 사용여부가 사용중지로 변경되었습니다.", function(res){	
		if (res == true){
			$('#comCodeDetailTable').KTDatatable().reload();
			comCodeDetailDataTable.init(code);
		}				
	});
}


/**** 테이블 공통 함수 ******************************************************************************************************************/

function insertCode(){
	var masterCode = $('#masterCode').val();
	var mastercodeName = $('#masterCodeName').val();
	var masterCodeSort = $('#masterCodeSort').val(); 
	var useYN = '';
	if ($("input:checkbox[id='useYN']").is(":checked")){		
		useYN = 'Y'
	} else {
		useYN = 'N'
	}
	
	switch (whichModal) {
	  case 'MasterInsert':
		var dataJSONArray_1 =  z.xA("Admin", "zeons_공통코드관리마스터확인", "select", {"master":masterCode}, "json2");
			if(dataJSONArray_1[0].count > 0){
			z.msg('이미 등록된 코드입니다.');
		} else {
			var dataJSONArray_insert =  z.xA("Admin", "zeons_공통코드관리마스터등록", "insert", {"master": masterCode, "공통마스터명":mastercodeName, "정렬코드":masterCodeSort,"YN":useYN}, "json2");
			z.msg("공통코드가 성공적으로 등록되었습니다.", function(res){	
				if(res == true){
					z.buttonClick("MA0618", "공통코드관리마스터등록", "C");
					$('#kt_auth_modal').modal('toggle');
					$('#comCodeTable').KTDatatable().reload();	
					if($('#masterCodeDiv').css('display') != 'none'){
						$('#masterCodeDiv').css('display','none');
					}
				}				
			});			
		}
	    break;
	  case 'DetailInsert':
		var dataJSONArray_2 =  z.xA("Admin", "zeons_공통코드관리상세확인", "select", {"master":master_code, "detail":masterCode}, "json2");
		if (dataJSONArray_2[0].count > 0){
			z.msg('이미 등록된 코드입니다.');
		} else {
			var dataJSONArray_insert =  z.xA("Admin", "zeons_공통코드관리상세등록", "insert", {"master":master_code, "detail":masterCode, "공통상세명":mastercodeName, "정렬코드":masterCodeSort,"YN":useYN}, "json2");
			z.msg("공통상세코드가 성공적으로 등록되었습니다.", function(res){	
				if(res == true){
					z.buttonClick("MA0618", "공통코드관리상세등록", "C");
					$('#kt_auth_modal').modal('toggle');
					$('#comCodeDetailTable').KTDatatable().reload();
					comCodeDetailDataTable.init(masterCode);				
				}				
			});			
		}
	    break;
	  case 'MasterModify':
		var dataJSONArray_3 =  z.xA("Admin", "zeons_공통코드수정", "update", {"master":masterCode, "공통마스터명":mastercodeName, "정렬코드":masterCodeSort,"YN":useYN}, "json2");
			z.msg("공통코드가 성공적으로 수정되었습니다.", function(res){	
				if (res == true){
					z.buttonClick("MA0618", "공통코드관리마스터수정", "U");
					$('#kt_auth_modal').modal('toggle');
					$('#comCodeTable').KTDatatable().reload();	
					if ($('#masterCodeDiv').css('display') != 'none'){
						$('#masterCodeDiv').css('display','none');
					}
				}				
			});		
	    break;
	  case 'DetailModify':
		var dataJSONArray_update =  z.xA("Admin", "zeons_공통상세코드수정", "update", {"master":master_code, "detail":masterCode, "공통상세명":mastercodeName, "정렬코드":masterCodeSort,"YN":useYN}, "json2");
			z.msg("공통상세코드가 성공적으로 수정되었습니다.", function(res){	
				if (res == true){
					z.buttonClick("MA0618", "공통코드관리상세수정", "U");
					$('#kt_auth_modal').modal('toggle');
					$('#comCodeDetailTable').KTDatatable().reload();
					comCodeDetailDataTable.init(masterCode);		
				}				
			});	
	    break;
	}
}


jQuery(document).ready(function(){
	$('#masterCodeDiv').css('display','none');
	comCodeDataTable();
})

