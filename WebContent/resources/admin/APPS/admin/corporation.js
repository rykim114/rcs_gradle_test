'use strict';
// Class definition
/**** 전역변수 ******************************************************************************************************************/
var	$corp1Selectpicker = $(".selectpicker[name='corporation1']"),	
	$corp2Selectpicker = $(".selectpicker[name='corporation2']"),
	$corp3Selectpicker = $(".selectpicker[name='corporation3']"),
	$corp4Selectpicker = $(".selectpicker[name='corporation4']"),	
	$corp1 = $('#corp1'),
	isCorpNumChk = false;

/**** 테이블  ******************************************************************************************************************/
var KTDatatableCorporation = function() {
    var demo = function() {
        var dataJSONArray = z.xA("Admin", "zeons_법인관리", "select", {}, "json2");

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
//            sortable: false,

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
                field: '법인코드',
                title: '',
                width: 20,
                type: 'number',
				visible : false, 
                selector: {
                    class: '법인코드'
                },
                textAlign: 'center',
            }, {
                field: '법인명',
                title: '법인명',
                textAlign: 'center',
            }, {
                field: '사업자등록번호',
                title: '사업자등록번호',
                textAlign: 'center',
            }, {
                field: '법인마스터명',
                title: '법인구분1',
                textAlign: 'center',
            }, {
                field: '법인상세명',
                title: '법인구분2',
                textAlign: 'center',
            }, 
		       {
                field: '등록일자',
                title: '등록일',
                type: 'date',
                format: 'YYYY-MM-DD',
                textAlign: 'center',
            },/*{
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
            },*/ {
                field: 'Actions',
                title: '관리',
                width: 125,
                textAlign: 'center',
                template: function(row) {
                    return '<button type="button" class="btn btn-outline-secondary" onclick="javascript:goUpdate(\''+ row.법인코드 + '\');">수정</button><button type="button" class="btn btn-outline-secondary" onclick="javascript:confirmDeleteCorp(\''+ row.법인코드 + '\');">삭제</button>';
                },
            }],
        });
       
//        $('#kt_datatable_search_status').selectpicker();
        
    };

    return {
        init: function() {
            demo();
        },
    };
}();

var fnGetCorpList1 = function() {	
	return z.xAsync("Admin", "zeons_법인관리대불러오기", "select", {}, "json2").done(function(resp) {
	
		var corpListArr1 = resp;
		
		$corp1Selectpicker.html('').append($('<option/>', {value: '', text: '법인구분1을 선택해 주세요.'}));
		
		for (var i in corpListArr1) {
			var corpList1 = corpListArr1[i],
				$opt = $('<option/>', {text: corpList1.법인마스터명, value: corpList1.법인마스터코드});
			$corp1Selectpicker.append($opt);	
		}
		
		$corp1Selectpicker.selectpicker('refresh');

	})
};

var fnGetCorpList2 = function(corp1) {	
		var master_code = corp1;

	return z.xAsync("Admin", "zeons_법인관리중불러오기", "select",  {"master" : master_code}, "json2").done(function(resp) {

		$corp2Selectpicker.html('').append($('<option/>', {value: '', text: '법인구분2를 선택해 주세요.'}));
					
		var corpListArr2 = resp;

		if (corpListArr2.length > 0) {
			for (var i in corpListArr2) {
				var corpList2 = corpListArr2[i],
					$opt = $('<option/>', {text: corpList2.법인상세명, value: corpList2.법인상세코드});
				$corp2Selectpicker.append($opt);	
			}	
			$corp2Selectpicker.prop('disabled', false);
			$corp2Selectpicker.selectpicker('val', corpListArr2[0].법인상세코드);	
			$corp2Selectpicker.selectpicker('refresh');
		} else {
			$corp2Selectpicker.html('').append($('<option/>', {value: '', text: '해당하는 법인구분2가 존재하지 않습니다.'}));
			$corp2Selectpicker.prop('disabled', true);
			$corp2Selectpicker.selectpicker('refresh');
		}
	
	})
};
						
var fnGetCorpList3 = function(corp1, corp2) {	
	return z.xAsync("Admin", "zeons_법인관리대불러오기", "select", {}, "json2").done(function(resp) {
	
		var corpListArr1 = resp;
		
		$corp3Selectpicker.html('').append($('<option/>', {value: '', text: ''}));
		
		for (var i in corpListArr1) {
			var corpList1 = corpListArr1[i],
				$opt = $('<option/>', {text: corpList1.법인마스터명, value: corpList1.법인마스터코드});
			$corp3Selectpicker.append($opt);	
		}

		$corp3Selectpicker.selectpicker('val', corp1);	
		fnGetCorpList4(corp1, corp2);

		$corp3Selectpicker.selectpicker('refresh');

	})
};
						
var fnGetCorpList4 = function(corp1, corp2) {	
		var master_code = corp1;

	return z.xAsync("Admin", "zeons_법인관리중불러오기", "select",  {"master" : master_code}, "json2").done(function(resp) {
					
		var corpListArr2 = resp;

		if (corpListArr2.length > 0) {
			$corp4Selectpicker.html('').append($('<option/>', {value: '', text: ''}));

			for (var i in corpListArr2) {
				var corpList2 = corpListArr2[i],
					$opt = $('<option/>', {text: corpList2.법인상세명, value: corpList2.법인상세코드});
				$corp4Selectpicker.append($opt);	
			}
			var corpDetailCode = corp2 == '' ? corpListArr2[0].법인상세코드 : corp2; 

			$corp4Selectpicker.prop('disabled', false);
			$corp4Selectpicker.selectpicker('val', corpDetailCode);	
			$corp4Selectpicker.selectpicker('refresh');
		} else {
			$corp4Selectpicker.html('').append($('<option/>', {value: '', text: '해당하는 법인구분2가 존재하지 않습니다.'}));
			$corp4Selectpicker.prop('disabled', true);
			$corp4Selectpicker.selectpicker('refresh');
		}
	
	})
};


var fnGetTotal = function(){
	return z.xAsync("Admin", "zeons_법인관리", "select",  {}, "json2").done(function(resp) {
		$('#count').text(resp.length);
	})
}

$('input[name=corpRNumber]').focusout(function() {
	var $this = this,
		$name = $('input[name=corpRNumber]'),
		corpNum = $.trim($name.val()).replace(/-/g,'');
	$name.removeClass('is-invalid')
	if (corpNum.length == 10 && checkNum(corpNum) == true){		
		if (corpNum.length == 10){
			var str_1 = corpNum.substring(0,3);
			var str_2 = corpNum.substring(2,4);
			var str_3 = corpNum.substring(5,10);
			var corpRNumber = str_1.concat('-', str_2, '-', str_3);		
			$name.val(corpRNumber);
		} 		
	} else {		
//		z.msg("사업자번호 양식이 틀립니다.");
		$name.addClass('is-invalid');
		$name.attr('placeholder', '사업자번호 양식이 틀립니다.')
		$name.val('');
		return;
	}
})

function newCorpNumChk(data) {
	var $num = data.parentElement.children[0].value.replaceAll('-', ''),
		$name = $('input[name=corpRNumber]');

	if ($name.hasClass('is-invalid')){
		z.msg('사업자번호양식이 틀립니다.');
		return;
	}
	
	return z.xAsync("Admin", "zeons_법인관리사업자번호체크", "select", {"사업자번호": $num}, "json2").done(function(resp) {				
		
		if (resp[0].count > 0) {
			z.msg("이미 존재하는 사업자등록번호입니다.");
		} else {
			z.msg("이 사업자번호를 등록하실 수 있습니다.");
			isCorpNumChk = true;		
		}
	})	
}

function corpNumChk(data) {
	var $num = data.parentElement.children[0].value.replaceAll('-', ''),
		$updateCorpRNum = $('#updateCorpRNum').val().replaceAll('-', ''),
		$name = $('input[name=corpRNumber]');
	
	if (($updateCorpRNum != '') && ($num === $updateCorpRNum)) {
		z.msg('수정하신 내용이 없습니다.')
		return;
	}
	
	if ($name.hasClass('is-invalid')){
		z.msg('사업자번호양식이 틀립니다.');
		return;
	}	
	
	return z.xAsync("Admin", "zeons_법인관리사업자번호체크", "select", {"사업자번호": $num}, "json2").done(function(resp) {				
		
		if (resp[0].count > 0) {
			z.msg("이미 존재하는 사업자등록번호입니다.");
		} else {
			z.msg("이 사업자번호를 등록하실 수 있습니다.");
			isCorpNumChk = true;		
		}
	})
}

function checkNum(str){
	if (/[0-9]/.test(str) || str.length == 0){
		return true;
	} else {
		return false;
	}
}

function confirmDeleteCorp(corpCode){
	
	return z.xAsync("Admin", "zeons_법인관리", "select", {"corpCode": corpCode}, "json2").done(function(resp) {	

		if (resp.length < 0) {return;}
		
		var corpName = resp[0].법인명;

		z.msgYN(corpName + ' 법인정보를 삭제하시는게 맞습니까?', function (res) {
			
			if (res === true) {
				deleteCorp(corpCode);
			} else {
				return;
			};			
		});	
	});
};

function deleteCorp (corpCode) {

	return z.xAsync("Admin", "zeons_법인관리삭제", "delete", {"corpCode": corpCode}, "json2").done(function(resp) {	
		z.msg('선택하신 법인이 성공적으로 삭제되었습니다.');
		z.buttonClick("MA0607", "법인관리삭제", "D");	
		$('#kt_datatable').KTDatatable().destroy();
	    KTDatatableCorporation.init();					
		fnGetTotal();

		$corp1Selectpicker.selectpicker('refresh');
		$corp2Selectpicker.selectpicker('refresh');
		$corp3Selectpicker.selectpicker('refresh');
		$corp4Selectpicker.selectpicker('refresh');		
	});	
}

function goWrite() {	
	fnGetCorpList1();
	$('#updateCorpCode').val('');
	$('#updateCorpName').val('');
	$('#updateCorpRNum').val('');
	$corp2Selectpicker.selectpicker('refresh');
	$corp2Selectpicker.prop('disabled', true);
	$corp2Selectpicker.selectpicker('refresh');		
}

function goUpdate(corpCode) {	
	var $tabWrapper = $('[name=tabWrapper]');
	$tabWrapper.children('li').children(':last-child a')[2].click();
	fnGetUpdate(corpCode);
}

var fnGetUpdate = function(corpCode) {
	return z.xAsync("Admin", "zeons_법인관리", "select", {"corpCode": corpCode}, "json2").done(function(resp) {
		var corpArr = resp[0],
			corp1 = corpArr.법인구분_대,
			corp2 = corpArr.법인구분_중,
			corpName = corpArr.법인명,
			corpRNum = corpArr.사업자등록번호;
		$('#updateCorpCode').val(corpCode);	
		$('#updateCorpName').val(corpName);	
		$('#updateCorpRNum').val(corpRNum);	
		$('#corpName').val(corpArr.법인명);
		$('#corpRNumber').val(corpArr.사업자등록번호);
		$('#remarks').val(corpArr.비고);
		fnGetCorpList3(corp1, corp2);
	})
}

$corp1Selectpicker.change(function(){
	var master_code = $corp1Selectpicker.val();
	fnGetCorpList2(master_code);
})

$corp3Selectpicker.change(function(){
	var master_code = $corp3Selectpicker.val();
	var corp2 = '';
	fnGetCorpList4(master_code, corp2);
})

function insertCorp() {
	var corpName = $.trim($('#newCorpName').val()),
		corpRNumber = $.trim($('#newCorpRNumber').val().replace(/-/g,'')),
		corp1 = $(".selectpicker[name='corporation1']")[0].value,
		corp2 = $(".selectpicker[name='corporation2']")[0].value,
		remarks = $('#newRemarks').val(),
		$tabWrapper = $('[name=tabWrapper]');;
		
	if (corp1 === '' || corp2 === '') {
		z.msg('법인구분을 선택해 주세요.'); return;
	}
	
	if (!isCorpNumChk) {
		z.msg('사업자번호 중복확인을 해주세요.'); return;
	}
	
	if (corpName == '') {
		z.msg('법인명을 입력해 주세요.'); return;
	}
	
	return z.xAsync("Admin", "zeons_법인관리", "select", {"corpNameCheck":corpName}, "json2").done(function(resp) {
		if (resp.length) {
			z.msg('중복된 법인이 존재합니다.'); return;
		} else {
			var insertRes = z.xA("Admin", "zeons_법인관리등록", "insert", {"법인명":corpName, "법인구분_대":corp1, "법인구분_중":corp2, "사업자번호": corpRNumber, "비고": remarks}, "json2");
						
			z.msg('법인정보가 성공적으로 등록되었습니다.');
			z.buttonClick("MA060703", "법인등록", "C" );
			$('#kt_datatable').KTDatatable().destroy();
		    KTDatatableCorporation.init();					
			$tabWrapper.children('li').children(':last-child a')[0].click();
			fnGetTotal();
			$corp1Selectpicker.selectpicker('refresh');
			$corp2Selectpicker.selectpicker('refresh');
			$corp3Selectpicker.selectpicker('refresh');
			$corp4Selectpicker.selectpicker('refresh');	
			isCorpNumChk = false;			
		}	
	});	
}

function updateCorp() {
	var corpName = $.trim($('#corpName').val()),
		corpRNumber = $.trim($('#corpRNumber').val().replace(/-/g,'')),
		corp1 = $(".selectpicker[name='corporation3']")[0].value,
		corp2 = $(".selectpicker[name='corporation4']")[0].value,
		remarks = $('#remarks').val(),
		$tabWrapper = $('[name=tabWrapper]'),
		corpCode = $('#updateCorpCode').val(),
		$updateCorpRNum = $('#updateCorpRNum').val().replaceAll('-', ''),
		$updateCorpName = $('#updateCorpName').val();	
		
	if (corp1 === '' || corp2 === '') {
		z.msg('법인구분을 선택해 주세요.'); return;
	}
	
	if (!isCorpNumChk && ($updateCorpRNum != corpRNumber)) {
		z.msg('사업자번호 중복확인을 해주세요.'); return;
	}
	
	var corpDupChk = z.xA("Admin", "zeons_법인관리", "select", {"corpNameCheck":corpName}, "json2");

	if (corpName == '') {
		z.msg('법인명을 입력해주세요.');
		return;
	}

	if ((corpName !=  $updateCorpName) && corpDupChk.length) {
		z.msg('중복된 법인이 존재합니다.'); return;
	}
	
	var corpRNumChk = z.xA("Admin", "zeons_법인관리사업자번호체크", "select", {"사업자번호": corpRNumber}, "json2");
	
	if ((corpRNumChk[0].count != 0) && ($updateCorpRNum != corpRNumber)) {
		z.msg('이미 존재하는 사업자등록번호입니다.');
		return;
	}
	
	return z.xAsync("Admin", "zeons_법인관리수정", "update", {"법인명": corpName, "법인구분_대": corp1, "법인구분_중": corp2, "사업자번호": corpRNumber, "비고": remarks, "corpCode": corpCode}, "json2").done(function(resp) {
		
		z.msg('법인정보가 성공적으로 수정되었습니다.');
		
		z.buttonClick("MA060703", "법인수정", "U" );
		$('#kt_datatable').KTDatatable().destroy();
	    KTDatatableCorporation.init();
		$tabWrapper.children('li').children(':last-child a')[0].click();
		fnGetTotal();
		$corp1Selectpicker.selectpicker('refresh');
		$corp2Selectpicker.selectpicker('refresh');
		$corp3Selectpicker.selectpicker('refresh');
		$corp4Selectpicker.selectpicker('refresh');	
		isCorpNumChk = false;
		$('#updateCorpCode').val('');
	});					
}

jQuery(document).ready(function() {
    KTDatatableCorporation.init();
	fnGetTotal();
});
