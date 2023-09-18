'use strict';
// Class definition

var isInit = true;
var datatable2 = null;
var KTDatatableAccount = function() {
    // Private functions

    // demo initializer
    var demo = function() {
    	//상단 사용자 쿼리 조회 
    	var dataJSONArray =  z.xA("Admin", "zeons_계정관리_상세", "select", {"targetId":z.getValue("seq")}, "json2");
    	//사용자 아이디 노출
    	$("#showUserId").text(dataJSONArray[0].아이디);
    	//사용자 법인명 노출
    	$("#showCom").text(dataJSONArray[0].법인명);
    	//사용자 담당자 노출
    	$("#showManager").text(dataJSONArray[0].담당자+" / "+dataJSONArray[0].담당자연락처);
    	//사용자 IP 노출
    	$("#showIP").text("IP "+dataJSONArray[0].ip현재+" 개 등록");
    	//사용자 계약기간 노출
    	$("#showContract").text(dataJSONArray[0].계약시작일+" ~ "+dataJSONArray[0].계약종료일);
    	//사용자 사용기간 노출
    	$("#showLastDay").text(dataJSONArray[0].잔여일+"일 남았습니다.");
    	//사용자 등록 IP노출
    	$("#showIPAllCnt").text(dataJSONArray[0].ip전체+"개");
    	//수정 버튼
    	$("#updateBtn").attr("onclick","updateAccount('"+dataJSONArray[0].아이디+"');");
    	
    	
    	var dataIPlist =  z.xA("Admin", "zeons_계정관리_상세_IP_목록", "select", {"targetId":z.getValue("seq")}, "json2");
    	//접속상태랑 발생일시는 별도로
    	for(var i=0; i<dataIPlist.length; i++){
			var dataIPDetail =  z.xA("Admin", "zeons_계정관리_상세_IP_목록상세", "select", {"targetId":z.getValue("seq") , "ip":dataIPlist[i].아이피}, "json2");
			if(dataIPDetail!=null && dataIPDetail!=""){
				dataIPlist[i].접속상태 = dataIPDetail[0].접속상태;
    			dataIPlist[i].발생일시 = dataIPDetail[0].발생일시;
			}
		}
    	
    	//3개까지만 노출 
    	/*if(dataIPlist.length>3){
    		for(i=3; i<dataIPlist.length; i++){
    			dataIPlist.splice(i);
    		}
    	}*/
    	
    	var datatable = $('#kt_datatable_IP_list').KTDatatable({
            // datasource definition
            data: {
                type: 'local',
                source: dataIPlist,
                /*pageSize: 10,*/
            },

            // layout definition
            layout: {
                scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
                // height: 450, // datatable's body's fixed height
                footer: false, // display/hide footer
            },

            // column sorting
            sortable: false,

            pagination: false,

            toolbar: {
                items: {
                    info: false,
                }
            },

            /*search: {
                input: $('#kt_datatable_search_query'),
                key: 'generalSearch'
            },*/

            // columns definition
            columns: [{
                field: '순번',
                title: 'No',
                width: 30,
                textAlign: 'center'
            }, {
                field: 'pc명',
                title: 'PC명',
                width: 100,
                textAlign: 'center'
            }, {
                field: '아이피',
                title: 'IP주소',
                width: 110,
                textAlign: 'center'
            }, {
                field: '접속상태',
                title: '접속상태',
                width: 80,
                textAlign: 'center'
            },{
                field: '발생일시',
                title: '발생시간',
                type: 'date',
                format: 'YYYY-MM-DD HH:MM:SS',
                width: 250,
                textAlign: 'center'
            }
            ],
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

var KTDatatableAccountLoginHistory = function() {
    // Private functions
	
    // demo initializer
    var demo = function() {
    	var dataJSONArray =  z.xA("Admin", "zeons_계정관리_상세_접속내역", "select", {"targetId":z.getValue("seq")}, "json2");
    	var datatable = $('#kt_datatable_login_history').KTDatatable({
            // datasource definition
            data: {
                type: 'local',
                source: dataJSONArray,
                pageSize: 10,
                pageSizeSelect: [10, 20, 30, 50, 100]
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
                    info: true,
                }
            },

            search: {
                input: $('#kt_datatable_login_search'),
                key: 'generalSearch'
            },

            // columns definition
            columns: [{
                field: '순번',
                title: 'No',
                width: 50,
                textAlign: 'center'
            }, {
                field: 'pc명',
                title: 'PC명',
                width: 100,
                textAlign: 'center'
            }, {
                field: '아이피',
                title: 'IP주소',
                width: 110,
                textAlign: 'center'
            }, {
                field: '발생일시',
                title: '접속시간',
                type: 'date',
                format: 'YYYY-MM-DD HH:MM:SS',
                width: 250,
                textAlign: 'center'
            },{
                field: '종료일시',
                title: '종료시간',
                type: 'date',
                format: 'YYYY-MM-DD HH:MM:SS',
                width: 250,
                textAlign: 'center'
            },{
                field: '체류시간',
                title: '체류시간',
                width: 110,
                textAlign: 'center'
            },{
                field: '상세정보',
                title: '상세정보',
                width: 130,
                textAlign: 'center',
	        	template: function(row) {
	                return '\
	                    <button data-record-id="' + row.아이디 + '" data-record-ip="'+ row.아이피 + '" + class="btn btn-sm btn-clean" data-toggle="modal" data-target="#kt_datatable_modal" title="View records">\
	                    <i class="flaticon2-document"></i> 메뉴별 접속시간\
	                </button>';
	        		//return '<a href="javascript:popUpModal(\''+row.아이피+'\');">메뉴별 접속시간</a>';
	            }
            }
            ],
			rows: {
				afterTemplate: function ($row, data, index) {
					$row.find(".btn.btn-sm.btn-clean").off("click").on("click", function (e) {
						var recordId = $(this).data("record-id");
						var recordIp = $(this).data("record-ip");
						var params   = JSON.stringify({
							"z.action"     : "select",
							"z.sqlFile"    : "Admin",
							"z.sqlId"      : "zeons_계정관리_상세_메뉴별접속시간",
							"z.returnType" : "json2",
							"z.rowSeparate": z._Row_Separate,
							"z.colSeparate": z._Col_Separate,
							"z.params"     : {
												"아이디" : recordId,
												"아이피" : recordIp}
						});
						
						if ( datatable2 == null ) {
							initDatatableModal(params);
						} else {
							datatable2.setDataSourceParam("datatable_v7_0_5", params);
							datatable2.reload();
							$("#kt_datatable_menu_access_time").hide();
						}
						
						$('#kt_datatable_modal').modal('show');
					});
				}
			}
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



var KTDatatableAccountIPChangeHistory = function() {
    // Private functions
	
    // demo initializer
    var demo = function() {
    	var dataJSONArray =  z.xA("Admin", "zeons_계정관리_상세_아이피변경내역", "select", {"targetId":z.getValue("seq")}, "json2");
    	var datatable = $('#kt_datatable_IPChange_history').KTDatatable({
            // datasource definition
            data: {
                type: 'local',
                source: dataJSONArray,
                pageSize: 10,
                pageSizeSelect: [10, 20, 30, 50, 100]
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
                    info: true,
                }
            },

            search: {
                input: $('#kt_datatable_ipchange_search'),
                key: 'generalSearch'
            },

            // columns definition
            columns: [{
                field: '순번',
                title: 'No',
                width: 30,
                textAlign: 'center'
            }, {
                field: 'pc명',
                title: 'PC명',
                width: 50,
                textAlign: 'center'
            }, {
                field: '아이피',
                title: 'IP주소',
                width: 110,
                textAlign: 'center'
            }, {
                field: '이벤트',
                title: '이벤트',
                width: 50,
                textAlign: 'center'
            },{
                field: '이벤트변경일시',
                title: '이벤트변경일자',
                type: 'date',
                format: 'YYYY-MM-DD HH:MM:SS',
                width: 250,
                textAlign: 'center'
            },{
                field: '담당자',
                title: '담당자',
                width: 110,
                textAlign: 'center'
            }
            ],
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


function updateAccount(seq){
	z.setValue('seq', seq);
	z.menuLink("MA060606");
	z.buttonClick("MA060606", "계정관리수정", "U" );	
}

function checkAccountDatatable(){
	if($('#kt_datatable_IP_list').html()!=""){
		if($("#kt_datatable_IP_list > .datatable-table > .datatable-body > .datatable-row").length>3){
			$("#kt_datatable_IP_list > .datatable-table > .datatable-body > .datatable-row").each(function(idx){
				if(idx>2){
					$(this).hide();
				}
			});
			//노출된 목록 하단으로 전체보기를 노출한다
			$("#kt_datatable_IP_list > .datatable-table").append(
				'<btn class="btn btn-outline-secondary btn-block" onclick="ipListshowAll(this);">전체보기'
					+'<span class="px-2">'+$('#kt_datatable_IP_list').KTDatatable().dataSet.length+'개</span> <i class="fa fa-chevron-down"></i>'
				+'</btn>'
			)
		}
	}
	
}

function ipListshowAll(obj){
	if($(obj).find("i").attr("class").indexOf("down")>-1){
		$("#kt_datatable_IP_list > .datatable-table > .datatable-body > .datatable-row").show(500);
		$(obj).find("i").removeClass("fa-chevron-down");
		$(obj).find("i").addClass("fa-chevron-up");
	}else{
		$("#kt_datatable_IP_list > .datatable-table > .datatable-body > .datatable-row").each(function(idx){
			if(idx>2){
				$(this).hide(500);
			}
		});
		$(obj).find("i").removeClass("fa-chevron-up");
		$(obj).find("i").addClass("fa-chevron-down");
	}
	
}

//메뉴별 접속 시간
function popUpModal(mId){
	// console.log(mId);
	z.buttonClick("MA0606", "계정관리 메뉴별접속시간", "R");
	/*$('#insertModal').text('공통코드 등록');
	$('#masterCode').val('');
	$('#masterCodeName').val('');
	$('#masterCodeSort').val('');
	$('#masterCode').removeAttr('readonly');
	if($("input:checkbox[id='useYN']").is(":checked")){
		$('input:checkbox[id="useYN"]').prop('checked',false);		
	}
	whichModal = 'MasterInsert';*/
}

var initDatatableModal = function(params) {

	datatable2 = $('#kt_datatable_menu_access_time').KTDatatable({
        // datasource definition
        data: {
            type  : 'remote',
			source: {
				read: {
					url        : '/common/core/xmlAjax.do',
					method     : 'POST',
					headers    : {},
					contentType: 'application/x-www-form-urlencoded',
					charset    : 'UTF-8',
					params     : {
						"datatable_v7_0_5": params || JSON.stringify({
							"z.action"     : "select",
							"z.sqlFile"    : "Admin",
							"z.sqlId"      : "zeons_계정관리_상세_메뉴별접속시간",
							"z.returnType" : "json2",
							"z.rowSeparate": z._Row_Separate,
							"z.colSeparate": z._Col_Separate,
							"z.params"     : {}
						})
					},
					map: function(raw) {
						var dataSet;
						
						if ( raw.result == "OK" ) {
							if ( typeof raw.datas !== 'undefined' ) {
								dataSet = z.getAjaxJsonData(raw.datas);
							}
						}
						
						return dataSet;
					},
					timeout	: 3000,
				}
			}
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
            width: 50,
            type: 'number',
            textAlign: 'center',
        }, {
            field: '메뉴명',
            title: '메뉴명',
            width: 110,
            textAlign: 'center',
        }, {
            field: '발생일시',
            title: '접속시간',
            type: 'date',
            width: 220,
            format: 'YYYY-MM-DD HH:MM:SS',
            textAlign: 'center',
        }, {
            field: '종료일시',
            title: '종료시간',
            type: 'date',
            width: 220,
            format: 'YYYY-MM-DD HH:MM:SS',
            textAlign: 'center',
        }, {
            field: '체류시간',
            title: '체류시간',
            type: 'date',
            width: 70,
            format: 'YYYY-MM-DD HH:MM:SS',
            textAlign: 'center',
        }]
    });

		datatable2.on('datatable-on-ajax-done', function(event, data) {
			$("#kt_datatable_menu_access_time").show();
		});
	
};

jQuery(document).ready(function() {
	KTDatatableAccount.init();//상단 상세정보 , 데이터 테이블
	KTDatatableAccountLoginHistory.init();//하단 사용자 계정 접속내역 데이터 테이블
	KTDatatableAccountIPChangeHistory.init();//하단 사용자 계정 IP 변경 내역 , 데이터 테이블
	setTimeout(checkAccountDatatable,100);//상단 상세정보 , 데이터 테이블 확인
	initDatatableModal();//메뉴별 접속 시간 팝업 초기화
	//팝업 닫기시 배경 안 닫기는것 강제로 닫기
	$(".close").click(function(){
		if($(".modal-backdrop").is(":visible")){
			$(".modal-backdrop").hide();
		}
	});
	//ip변경이력 열기
	if(z.getValue("showIpChange")=="show"){
		$("a").each(function(){
			if($(this).attr("data-target")=="#tab02"){
				$(this).get(0).click();
				//$(this).trigger("click");
				$("html , body").animate({scrollTop : $(this).offset().top},500);
			}
		});
	}
});
