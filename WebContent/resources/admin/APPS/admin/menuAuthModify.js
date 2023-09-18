jQuery(document).ready(function() {
	$(".selectpicker").selectpicker();
	
	var menucode = z.getValue("menuCode");
	dataQuery(menucode);
	
	
	$("#submitMenuAuth").off("click").on("click", function (e) {
		var menuname = $('#imenuname').val();
		var upmenucode = $('#iupmenucode').val();
		var icon = $('#iicon').val();
		var lvl = $('#ilvl').val();
		var iurl = $('#iurl').val();
		var sortcode = $('#isortcode').val();
		var menubaryn = $('#imenubaryn').val();
		var modalyn = $('#imodalyn').val();
		var useyn = $('#iuseyn').val();
		
		
		if(menuname != "" && lvl != "" && sortcode !="" && menubaryn != "" && useyn !="" ){
			
			z.msgYN("메뉴를 수정하시겠습니까?", function(res){
				if(res == true){
					var dataJSONArray  = z.xA("Admin", "zeons_메뉴", "update", {"menucode" : menucode, "menuname" : menuname, "upmenucode" : upmenucode, "icon" : icon, "lvl" : lvl, "sortcode" : sortcode, "filepath" : iurl, "menubaryn" : menubaryn, "modalyn" : modalyn, "useyn" : useyn, "remarks" : "" }, "json2");
					z.buttonClick("MA0609", "메뉴수정", "U" );
					z.menuLink("MA0609");
				}else{
					return;
				}
			});
		}else{
			if(menuname == ""){
				z.msg("메뉴명을 입력해주세요");
				return;
			}
			if(menucode == ""){
				z.msg("메뉴코드를 입력해주세요");
				return;
			}
			if(sortcode == ""){
				z.msg("정렬순서를 설정해주세요");
				return;
			}
			if(menubaryn == ""){
				z.msg("메뉴바오픈여부를 설정해주세요");
				return;
			}
			if(useyn == ""){
				z.msg("사용유무를 설정해주세요");
				return;
			}
		}
	});
	
	/* 취소 - 초기화 */
	$("#resetMenuAuth").off("click").on("click", function (e) {
		 z.buttonClick("MA0609", "공지목록", "R");
		 z.menuLink("MA0609");
	});
});

/* 데이터조회 */
function dataQuery(menucode){
	var dataJSONArray = z.xA("Admin", "zeons_메뉴상세", "select", {'menucode' : menucode}, "json2");
	var datalen = dataJSONArray.length;
	for(var i= 0; i < datalen;i++){
		$('span[id=imenunamequery]').text(dataJSONArray[i].menuname);
		$('input[id=imenuname]').val(dataJSONArray[i].menuname);
		$('input[id=imenucode]').val(dataJSONArray[i].menucode);
		$('select[id=ilvl]').val(dataJSONArray[i].lvl);
		$('select[id=imenubaryn]').val(dataJSONArray[i].menubaryn);
		$('select[id=imodalyn]').val(dataJSONArray[i].modalyn);
		$('select[id=iuseyn]').val(dataJSONArray[i].useyn);
		$('.selectpicker').selectpicker('refresh');
		$('input[id=iupmenucode]').val(dataJSONArray[i].upmenucode);
		$('input[id=iicon]').val(dataJSONArray[i].icon);
		$('input[id=iurl]').val(dataJSONArray[i].filepath);
		$('input[id=isortcode]').val(dataJSONArray[i].sortcode);
	}
}
