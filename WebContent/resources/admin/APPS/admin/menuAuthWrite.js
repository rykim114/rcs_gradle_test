jQuery(document).ready(function() {
	$(".selectpicker").selectpicker();
	$("#submitMenuAuth").off("click").on("click", function (e) {
		var menuname = $('#imenuname').val();
		var menucode = $('#imenucode').val();
		var upmenucode = $('#iupmenucode').val();
		var icon = $('#iicon').val();
		var lvl = $('#ilvl').val();
		var iurl = $('#iurl').val();
		var sortcode = $('#isortcode').val();
		var menubaryn = $('#imenubaryn').val();
		var modalyn = $('#imodalyn').val();
		var useyn = $('#iuseyn').val();
		
		
		if(menuname != "" && lvl != "" && sortcode !="" && menubaryn != "" && useyn !="" ){
			
			z.msgYN("메뉴를 등록하시겠습니까?", function(res){
				if(res == true){
					var dataJSONArray  = z.xA("Admin", "zeons_메뉴", "insert", {"menucode" : menucode, "menuname" : menuname, "upmenucode" : upmenucode, "icon" : icon, "lvl" : lvl, "sortcode" : sortcode, "filepath" : iurl, "menubaryn" : menubaryn, "modalyn" : modalyn, "useyn" : useyn, "remarks" : "" }, "json2");
					z.buttonClick("MA0609", "메뉴등록", "I" );
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

