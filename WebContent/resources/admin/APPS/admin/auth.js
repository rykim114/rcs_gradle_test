'use strict';
// Class definition
var $modalAuth = $('#authModal'),
	$menuAuth = $('#authMenu'),
	$tableAuthMenu = $('#authMenuTable'),
	$btnAuthIn = $menuAuth.find('[data-btn-auth]'),
	$btnSaveAuthMenu = $menuAuth.find('[data-btn-save-menu]'),
	$btnSaveAuth = $modalAuth.find('[data-btn-save-auth]'),
	$allCheck = $tableAuthMenu.find('[type=checkbox][name=allCheck]'),
	$authName = $modalAuth.find('[name="권한_그룹명"]'),
	$authEx = $modalAuth.find('[name="권한_그룹설명"]'),
	$checkDown = $modalAuth.find('[type=checkbox][name="권한_드래그금지"]'),
	$excelDown = 'N',
	$ipChk = $modalAuth.find('[type=checkbox][name="권한_아이피확인"]'),
	$ipCheckval = 'N',
	$groupCode = $menuAuth.find('[type=hidden][name="groupCode"]').val();

//var authDataTable = (function(){
function authDataTable() {

	var dataJSONArray = z.xA("Admin", "zeons_권한관리그룹", "select", {}, "json2");
	
	$btnAuthIn.click(function() {
		$modalAuth.find('[name="권한_그룹명"]').val('');
		$modalAuth.find('[name="권한_그룹설명"]').val('');
		$modalAuth.find('[type=checkbox][name="권한_드래그금지"]').prop("checked", false);
		$modalAuth.find('[type=checkbox][name="권한_아이피확인"]').prop("checked", true);
		$modalAuth.modal('show');
		fnGroupInsert();
	});
	
	var demo = function(){
		var datatable = $('#authTable').KTDatatable({
			data:{
	             type: 'local',
	             source: dataJSONArray,
	             pageSize: 10,
	         },

	         layout: {
	             scroll: false, 
	             footer: false, 
	         },
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
	         columns: [{
	             field: '정렬',
	             title: '정렬',
	             type: 'number',
	             width: 30,
	             textAlign: 'center',
	             class : 'eventCheck',
	         }, {
	             field: '그룹코드',
	             title: '그룹코드',
	             sortable: false,
	             type: 'number',
	             visible : false, 
	             width: 0,
	             textAlign: 'center',
	             class : 'group_code',
	         }, {
	             field: '그룹명',
	             title: '그룹명',
	             width: 100,
	             textAlign: 'center',
	             class : 'eventCheck',
	         }, {
	             field: '비고',
	             title: '설명',
	             width: 120,
	             type: 'number',
	             textAlign: 'center',
	             class : 'eventCheck',
	         }, {
                field: 'Actions',
                title: '관리',
                sortable: false,
                width: 80,
                textAlign: 'center',
                class : 'eventCancel',
                template: function(row) {
                    return '<td>\
                                <a onclick="fnGroupUpdate('+ row.그룹코드 + ');" class="btn btn-sm btn-clean btn-icon mr-2 checkAuth" data-btn-auth-update >\
                                    <i class="flaticon2-pen"></i>\
                                </a>\
                                <a onclick="fnGroupDelete('+ row.그룹코드 + '); return false;" class="btn btn-sm btn-clean btn-icon checkAuth" title="Delete">\
                                    <i class="flaticon2-trash"></i>\
                                </a>\
                            </td>';
	           },
	        }],
	     })
	     .on("datatable-on-layout-updated", function (datatable) {
			//	$(datatable.currentTarget).find(".datatable-body .datatable-row").eq(0).click();
	    	 $(datatable.currentTarget).find(".datatable-body .datatable-row").off("click").on("click", function () {
	    		var $this    = $(this),
					$wrapper = $('#authTable'),
					seq   	 = $this.attr("data-row");
	    		 
	    		$groupCode = $(".group_code")[Number(seq) + 1].innerText;
	    		$groupCode = Number($groupCode);
	 			
	 			if($groupCode == 0) {
	 				$groupCode =  $(this).find('td').eq(1)[0].ariaLabel;
	 			}	
	 			
	    		$wrapper.children('table').children('tbody').children('tr:nth-child(2n)').addClass('datatable-row-even');
	    		if ($this.hasClass('datatable-row-even')) {
						$this.removeClass('datatable-row-even');					
				}			
				$this.addClass('trSelected');	
				$this.siblings().removeClass('trSelected');
				
				defaultMenu($groupCode);
	    	 });
	    	 
	    	 $(datatable.currentTarget).find(".datatable-body .datatable-row").eq(0).click();
		});
		
	};	
	
	var selectCheck = function() {
		
		if($('input:checkbox[id=allCheck]:checked')){
			$("input:checkbox[id=allCheck]").prop("checked", false);
		}	
		
		$btnSaveAuthMenu.click(function(){
			//groupMenu(groupCode);
			z.msgYN("권한을 저장하시겠습니까?", function(res){
				if(res == true){
					var array = new Array();
					var array2 = new Array();
					var array3 = new Array();
					var array4 = new Array();
					var array5 = new Array();
					var array6 = new Array();
					
					$('input:checkbox[class=menuRow]:checked').each(function(){
						array.push(this.value);
					});
					
					$('input:checkbox[class=menuRow]:not(:checked)').each(function(){
						array2.push(this.value);
					});
					
					$('input:checkbox[class=excelRow]:checked').each(function(){
						array3.push(this.value);
					});
					
					$('input:checkbox[class=excelRow]:not(:checked)').each(function(){
						array4.push(this.value);
					});
					
					$('input:checkbox[class=dtlexcelRow]:checked').each(function(){
						array5.push(this.value);
					});
					
					$('input:checkbox[class=dtlexcelRow]:not(:checked)').each(function(){
						array6.push(this.value);
					});
					
					if(array.length >= 1){
						var menuCode = array;
						z.xA("Admin", "zeons_그룹별권한수정", "update", {"menuCode" : menuCode, "groupCode" : $groupCode}, "json2");
					}
					
					if(array2.length >=1){
						var menuCode = array2;
						z.xA("Admin", "zeons_그룹별권한수정체크", "update", {"menuCode" : menuCode, "groupCode" : $groupCode}, "json2");
					}
					
					if(array3.length >= 1){
						var menuCode = array3;
						z.xA("Admin", "zeons_그룹별권한엑셀수정", "update", {"menuCode" : menuCode, "groupCode" : $groupCode}, "json2");
					}
					
					if(array4.length >=1){
						var menuCode = array4;
						z.xA("Admin", "zeons_그룹별권한엑셀수정체크", "update", {"menuCode" : menuCode, "groupCode" : $groupCode}, "json2");
					}
					
					if(array5.length >= 1){
						var menuCode = array5;
						z.xA("Admin", "zeons_그룹별상세엑셀수정", "update", {"menuCode" : menuCode, "groupCode" : $groupCode}, "json2");
					}
					if(array6.length >=1){
						var menuCode = array6;
						z.xA("Admin", "zeons_그룹별상세엑셀수정체크", "update", {"menuCode" : menuCode, "groupCode" : $groupCode}, "json2");
					}
					
					z.buttonClick("MA0621", "그룹별권한저장", "U" );
					
					z.msg("권한이 저장됐습니다.");
					if( $allCheck.prop('checked')) {
						$allCheck.prop('checked' , false);
					}
				}else{

					return;
				}
			});
		});

		$allCheck.click(function(){
			var chk = $(this).prop("checked");
			if(chk){
				$("input:checkbox[class='menuRow']").prop("checked", true);
			}else{
				$("input:checkbox[class='menuRow']").prop("checked", false);
			}
		});
	}
	
	var fnGroupInsert = function(){
		$btnSaveAuth.click(function(){
			$authName.val($.trim($authName.val())),
			$authEx.val($.trim($authEx.val()));
			
			if (! $authName[0].checkValidity()) {
				$authName.addClass('is-invalid');
				return;
			} else {
				$authName.removeClass('is-invalid');
			}
			if (! $authEx[0].checkValidity()) {
				$authEx.addClass('is-invalid');
				return;
			} else {
				$authEx.removeClass('is-invalid');
			}
			
		   if( $checkDown.prop('checked') ) {
	        	$excelDown = 'Y';
	        }
			z.msgYN("그룹을 등록하시겠습니까?", function(res){
				if(res == true){
					z.xA("Admin", "zeons_권한관리등록", "insert", {'authGroupName' : $authName.val(), 'authGroupEx' : $authEx.val(), 'excelDown' : $excelDown}, "json2");
					$modalAuth.modal('toggle');
					z.msg("그룹이 등록됐습니다.", function(res){
						menuListInsert();
						z.buttonClick("MA0621", "권한관리등록", "C" );
						z.menuLink("MA0621");
					});
				}else {
					return;
				}
			}); 
		});
	}
	
	demo();
	selectCheck();
};

function fnGroupUpdate(groupCode) {
	$modalAuth.modal('show');
	
	var dataJSONArray = z.xA("Admin", "zeons_권한그룹모달", "select", {"groupCode" : groupCode}, "json2");

	
	$authName.val(dataJSONArray[0].그룹명);
	$authEx.val(dataJSONArray[0].비고);
	
	
	 if(dataJSONArray[0].엑셀다운 == 'Y'){ 
	 	$checkDown.prop("checked" , true);
	 } else {
	  	$checkDown.prop("checked" , false);
	 }
	 
	 if(dataJSONArray[0].아이피확인 == 'Y'){ 
		$ipChk.prop("checked" , true);
	 } else {
	  	$ipChk.prop("checked" , false);
	 }
	
	$btnSaveAuth.click(function(){
		
		$authName.val($.trim($authName.val())),
		$authEx.val($.trim($authEx.val()));
		
		if (! $authName[0].checkValidity()) {
			$authName.addClass('is-invalid');
            return;
        } else {
        	$authName.removeClass('is-invalid');
        }
        if (! $authEx[0].checkValidity()) {
        	$authEx.addClass('is-invalid');
            return;
        } else {
        	$authEx.removeClass('is-invalid');
        }
        
        if( $checkDown.prop('checked') ) {
        	$excelDown = 'Y';
        }
        
        if( $ipChk.prop('checked') ) {
        	$ipCheckval = 'Y';
        }
        
		z.msgYN("그룹을 수정하시겠습니까?", function(res){
			if(res == true){
				z.xA("Admin", "zeons_권한관리수정","update", {'authGroupName' : $authName.val(), 'authGroupEx' : $authEx.val(), 'groupCode' : groupCode, 'excelDown' : $excelDown, 'ipChk' : $ipCheckval}, "json2"); 
				$modalAuth.modal('toggle');
				z.msg("그룹이 수정됐습니다.", function(res){
					z.buttonClick("MA0621", "권한관리수정", "U" );
					z.menuLink("MA0621");
				});
			}else {
				return;
			}
		}); 
	
	});
}

function fnGroupDelete(groupCode){
	z.msgYN("그룹을 삭제하시겠습니까?", function(res){
		if(res == true){
			z.xA("Admin", "zeons_권한관리삭제","update", {'groupCode' : groupCode}, "json2"); 
			z.msg("그룹이 삭제됐습니다.", function(res){
				z.buttonClick("MA0621", "권한관리삭제", "D" );
				z.menuLink("MA0621");
			});
		}else {
			return;
		}
	}); 
}

function defaultMenu(groupCode){
	z.xA("Admin", "zeons_권한관리메뉴등록","insert", {groupCode :  groupCode}, "json2"); 
	var dataJSONArray = z.xA("Admin", "zeons_권한관리메뉴", "select", {groupCode :  groupCode}, "json2");
	var value = "";
	var length = dataJSONArray.length;
	
	for(var i=0; i < length; i++){
		if(dataJSONArray[i].lvl == "1"){
			value += "<tr>" +
					"	<td class='text-center'>" + dataJSONArray[i].정렬 + "</td>" +
					"	<td>" + dataJSONArray[i].menuname + "</td>" +
					"	<td class='text-center'>" +
					"		<label class='checkbox justify-content-center'>" +
					"			<input type='checkbox' class='menuRow' name='menuRow"+[i]+"' value='"+ dataJSONArray[i].menucode + "'/><span></span>" +
					"		</label>" +
					"	</td>";
			if(dataJSONArray[i].menucode == "MA01" || dataJSONArray[i].menucode == "MA0301" || dataJSONArray[i].menucode == "MA04" ){
			value +=	"	<td class='text-center'>" +
						"		<label class='checkbox justify-content-center'>" +
						"			<input type='checkbox' class='excelRow' name='excelRow"+[i]+"' value='"+ dataJSONArray[i].menucode + "'/><span></span>" +
						"		</label>" +
						"	</td>" 
			} else {
				value +=	"	<td></td>" 			
			}	

			if(dataJSONArray[i].menucode == "MA01" ){
			value +=	"	<td class='text-center'>" +
						"		<label class='checkbox justify-content-center'>" +
						"			<input type='checkbox' class='dtlexcelRow' name='dtlexcelRow"+[i]+"' value='"+ dataJSONArray[i].menucode + "'/><span></span>" +
						"		</label>" +
						"	</td>" 
			} else {
				value +=	"	<td></td>" 			
			}	
			value +=	"</tr>";
		}else{
			value += "<tr>" +
					"	<td class='text-center'>" + dataJSONArray[i].정렬 + "</td>" +
					"	<td >" + '  ㄴ  ' + dataJSONArray[i].menuname + "</td>" +
					"	<td class='text-center'>" +
					"		<label class='checkbox justify-content-center'>" +
					"			<input type='checkbox' class='menuRow' name='menuRow"+[i]+"' value='"+ dataJSONArray[i].menucode + "'/><span></span>" +
					"		</label>" +
					"	</td>"
			if(dataJSONArray[i].menucode.substr(0,4) == "MA01"){
			value +=	"	<td class='text-center'>" +
						"		<label class='checkbox justify-content-center'>" +
						"			<input type='checkbox' class='excelRow' name='excelRow"+[i]+"' value='"+ dataJSONArray[i].menucode + "'/><span></span>" +
						"		</label>" +
						"	</td>" 
			} else {
				value +=	"	<td></td>" 			
			}	
			
			if(dataJSONArray[i].menucode.substr(0,6) == "MA0103" || dataJSONArray[i].menucode.substr(0,6) == "MA0104" || dataJSONArray[i].menucode.substr(0,6) == "MA0106" || dataJSONArray[i].menucode.substr(0,6) == "MA0108" || dataJSONArray[i].menucode.substr(0,6) == "MA0109"){
			value +=	"	<td class='text-center'>" +
						"		<label class='checkbox justify-content-center'>" +
						"			<input type='checkbox' class='dtlexcelRow' name='dtlexcelRow"+[i]+"' value='"+ dataJSONArray[i].menucode + "'/><span></span>" +
						"		</label>" +
						"	</td>" 
			} else {
				value +=	"	<td></td>" 			
			}	
			value +=	"</tr>";
		}	
	}
	$("#authMenuTable tbody").html(value);
	
	for(var i=0; i<length; i++){
		if(dataJSONArray[i].checkyn == 'Y'){
			$("input:checkbox[name='menuRow"+[i]+"'].menuRow").prop("checked", true);
		}else{
			$("input:checkbox[name='menuRow"+[i]+"'].menuRow").prop("checked", false);
		}
		
		if(dataJSONArray[i].excelyn == 'Y'){
			$("input:checkbox[name='excelRow"+[i]+"'].excelRow").prop("checked", true);
		}else{
			$("input:checkbox[name='excelRow"+[i]+"'].excelRow").prop("checked", false);
		}
		
		if(dataJSONArray[i].dtlexcelyn == 'Y'){
			$("input:checkbox[name='dtlexcelRow"+[i]+"'].dtlexcelRow").prop("checked", true);
		}else{
			$("input:checkbox[name='dtlexcelRow"+[i]+"'].dtlexcelRow").prop("checked", false);
		}
	}
	
	$('.menuRow').click(function(e) {
		var menuCode = $(this).val();
		var menuClickArr = z.xA("Admin", "zeons_메뉴클릭", "select", {"menuCode" : menuCode, "groupCode" : groupCode }, "json2");
		
		var chk = $(this).prop("checked");
		if(chk){
			for (var i=0; i<menuClickArr.length; i++){
				$("input:checkbox[value='" + menuClickArr[i].메뉴코드 + "'].menuRow").prop("checked", true);
			}
		}else{
			for (var i=0; i<menuClickArr.length; i++){
				$("input:checkbox[value='" + menuClickArr[i].메뉴코드 + "'].menuRow").prop("checked", false);
			}
		}
	});
	
	$('.excelRow').click(function(e) {
		var menuCode = $(this).val();
		var menuClickArr = z.xA("Admin", "zeons_메뉴클릭", "select", {"menuCode" : menuCode, "groupCode" : groupCode }, "json2");
		
		var chk = $(this).prop("checked");
		if(chk){
			for (var i=0; i<menuClickArr.length; i++){
				$("input:checkbox[value='" + menuClickArr[i].메뉴코드 + "'].excelRow").prop("checked", true);
			}
		}else{
			for (var i=0; i<menuClickArr.length; i++){
				$("input:checkbox[value='" + menuClickArr[i].메뉴코드 + "'].excelRow").prop("checked", false);
			}
		}
	});
	
	$('.dtlexcelRow').click(function(e) {
		var menuCode = $(this).val();
		var menuClickArr = z.xA("Admin", "zeons_메뉴클릭", "select", {"menuCode" : menuCode, "groupCode" : groupCode }, "json2");
		
		var chk = $(this).prop("checked");
		if(chk){
			for (var i=0; i<menuClickArr.length; i++){
				$("input:checkbox[value='" + menuClickArr[i].메뉴코드 + "'].dtlexcelRow").prop("checked", true);
			}
		}else{
			for (var i=0; i<menuClickArr.length; i++){
				$("input:checkbox[value='" + menuClickArr[i].메뉴코드 + "'].dtlexcelRow").prop("checked", false);
			}
		}
	});
}

var menuListInsert =  function() {
	z.buttonClick("MA0621", "그룹별권한메뉴목록", "C" );
	z.xA("Admin", "zeons_메뉴목록", "insert", {}, "json2");
};	

jQuery(document).ready(function(){
	authDataTable();
})

