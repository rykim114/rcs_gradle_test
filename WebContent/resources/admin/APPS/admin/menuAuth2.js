jQuery(document).ready(function() {
	$(".selectpicker").selectpicker();
	
	var sel = null;
	
	dataQuery();
	
	/* 조회값 세팅 */
	$(".nav-item.m-0").off("click").on("click", function (e) {
		sel = $(this);
		
		var menucode = $(this).children('#menucode').attr("value");
		var menuname = $(this).children('#menuname').attr("value");
		var upmenucode = $(this).children('#upmenucode').attr("value");
		var icon = $(this).children('#icon').attr("value");
		var filepath = $(this).children('#filepath').attr("value");
		var lvl = $(this).children('#lvl').attr("value");
		var sortcode = $(this).children('#sortcode').attr("value");
		var menubaryn = $(this).children('#menubaryn').attr("value");
		var modalyn = $(this).children('#modalyn').attr("value");
		var useyn = $(this).children('#useyn').attr("value");
		$('span[id=imenunamequery]').text(menuname);
		$('input[id=imenuname]').val(menuname);
		$('input[id=imenucode]').val(menucode);
		$('select[id=ilvl]').val(lvl);
		$('select[id=imenubaryn]').val(menubaryn);
		$('select[id=imodalyn]').val(modalyn);
		$('select[id=iuseyn]').val(useyn);
		$('.selectpicker').selectpicker('refresh');
		$('input[id=iupmenucode]').val(upmenucode);
		$('input[id=iicon]').val(icon);
		$('input[id=ifilepath]').val(filepath);
		$('input[id=isortcode]').val(sortcode);
	});
	
	/* 확인 */
	$("#submitMenuAuth").off("click").on("click", function (e) {
		var menucode = $('#imenucode').val();
		var menuname = $('#imenuname').val();
		alert(menucode + '@' + menuname);
		if(menucode != "" && menucode != null && menuname != ""  && menuname != null){
			z.msgYN("메뉴를 수정하시겠습니까?",  function (res) {
				if(res == true){
					var upmenucode = $('#iupmenucode').val();
					var icon = $('#iicon').val();
					var filepath = $('#ifilepath').val();
					var lvl = $('#ilvl').val();
					var sortcode = $('#isortcode').val();
					var menubaryn = $('#imenubaryn').val();
					var modalyn = $('#imodalyn').val();
					var useyn = $('#iuseyn').val();
					
					var dataJSONArray  = z.xA("Admin", "zeons_메뉴", "update", {"menucode" : menucode, "menuname" : menuname, "upmenucode" : upmenucode, "icon" : icon, "filepath" : filepath, "lvl" : lvl, "sortcode" : sortcode, "menubaryn" : menubaryn, "modalyn" : modalyn, "useyn" : useyn, "remarks" : "" }, "json2");
					z.buttonClick("MA0609", "메뉴수정", "U" );
				}else{
					return;
				}
			});
		}else{
			if($("#menucode").val() == ""){
				z.msg("메뉴코드를 확인해주세요");	
				return;
			}
			if($("#menuname").val() == ""){
				$("#menuname").focus();
				z.msg("메뉴명을 확인해주세요");
				return;
			}
		}
	});
	
	/* 취소 - 초기화 */
	$("#resetMenuAuth").off("click").on("click", function (e) {
		if(sel != null){
			var menucode = sel.children('#menucode').attr("value");
			var menuname = sel.children('#menuname').attr("value");
			var upmenucode = sel.children('#upmenucode').attr("value");
			var icon = sel.children('#icon').attr("value");
			var filepath = sel.children('#filepath').attr("value");
			var lvl = sel.children('#lvl').attr("value");
			var sortcode = sel.children('#sortcode').attr("value");
			var menubaryn = sel.children('#menubaryn').attr("value");
			var modalyn = sel.children('#modalyn').attr("value");
			var useyn = sel.children('#useyn').attr("value");
			$('#kt_content > div > div > div > div.card-body.pt-9 > div > div.col-md-9 > div > div.card-header.align-items-center.border-bottom > h3 > span').text(menuname);
			$('#kt_content > div > div > div > div.card-body.pt-9 > div > div.col-md-9 > div > div.card-body.pt-9 > div.table-responsive-sm > table > tbody > tr:nth-child(1) > td > input').val(menuname);
			$('#kt_content > div > div > div > div.card-body.pt-9 > div > div.col-md-9 > div > div.card-body.pt-9 > div.table-responsive-sm > table > tbody > tr:nth-child(2) > td > input').val(menucode);
			$('select[id=lvl]').val(lvl);
			$('select[id=menubaryn]').val(menubaryn);
			$('select[id=modalyn]').val(modalyn);
			$('select[id=useyn]').val(useyn);
			$('.selectpicker').selectpicker('refresh');
			$('#kt_content > div > div > div > div.card-body.pt-9 > div > div.col-md-9 > div > div.card-body.pt-9 > div.table-responsive-sm > table > tbody > tr:nth-child(4) > td > input').val(upmenucode);
			$('#kt_content > div > div > div > div.card-body.pt-9 > div > div.col-md-9 > div > div.card-body.pt-9 > div.table-responsive-sm > table > tbody > tr:nth-child(5) > td > input').val(icon);
			$('#kt_content > div > div > div > div.card-body.pt-9 > div > div.col-md-9 > div > div.card-body.pt-9 > div.table-responsive-sm > table > tbody > tr:nth-child(6) > td > input').val(filepath);
			$('#kt_content > div > div > div > div.card-body.pt-9 > div > div.col-md-9 > div > div.card-body.pt-9 > div.table-responsive-sm > table > tbody > tr:nth-child(7) > td > input').val(sortcode);
		}	
	});
});

/* 데이터조회 */
function dataQuery(){
	var dataJSONArray = z.xA("Admin", "zeons_메뉴", "select", {}, "json2");
	var datalen = dataJSONArray.length;
	var listhtml = "";
	var datahtml = "";
	for(var i= 0; i < datalen;i++){
		
		if(dataJSONArray[i].lvl=="1"){
			datahtml += '<li class="nav-item m-0 nav-1depth">'
					 + '<input type="hidden" id="menucode" name="menucode" value=' + dataJSONArray[i].menucode + '>'
					 + '<input type="hidden" id="menuname" name="menuname" value=' + dataJSONArray[i].menuname + '>'
					 + '<input type="hidden" id="upmenucode" name="upmenucode" value=' + dataJSONArray[i].upmenucode + '>'
					 + '<input type="hidden" id="icon" name="icon" value=' + dataJSONArray[i].icon + '>'
					 + '<input type="hidden" id="filepath" name="filepath" value=' + dataJSONArray[i].filepath + '>'
					 + '<input type="hidden" id="lvl" name="lvl" value=' + dataJSONArray[i].lvl + '>'
					 + '<input type="hidden" id="sortcode" name="sortcode" value=' + dataJSONArray[i].sortcode + '>'
					 + '<input type="hidden" id="menubaryn" name="menubaryn" value=' + dataJSONArray[i].menubaryn + '>'
					 + '<input type="hidden" id="modalyn" name="modalyn" value=' + dataJSONArray[i].modalyn + '>'
					 + '<input type="hidden" id="useyn" name="useyn" value=' + dataJSONArray[i].useyn + '>'
				     + '<a href="javascript:;" class="nav-link rounded-0 font-size-h6" data-toggle="pill">' 
				     + dataJSONArray[i].menuname 
				     + '</a>'
					 + '</li>'
		} else if(dataJSONArray[i].lvl=="2"){
			datahtml += '<li class="nav-item m-0 nav-2depth">'
				 + '<input type="hidden" id="menucode" name="menucode" value=' + dataJSONArray[i].menucode + '>'
				 + '<input type="hidden" id="menuname" name="menuname" value=' + dataJSONArray[i].menuname + '>'
				 + '<input type="hidden" id="upmenucode" name="upmenucode" value=' + dataJSONArray[i].upmenucode + '>'
				 + '<input type="hidden" id="icon" name="icon" value=' + dataJSONArray[i].icon + '>'
				 + '<input type="hidden" id="filepath" name="filepath" value=' + dataJSONArray[i].filepath + '>'
				 + '<input type="hidden" id="lvl" name="lvl" value=' + dataJSONArray[i].lvl + '>'
				 + '<input type="hidden" id="sortcode" name="sortcode" value=' + dataJSONArray[i].sortcode + '>'
				 + '<input type="hidden" id="menubaryn" name="menubaryn" value=' + dataJSONArray[i].menubaryn + '>'
				 + '<input type="hidden" id="modalyn" name="modalyn" value=' + dataJSONArray[i].modalyn + '>'
				 + '<input type="hidden" id="useyn" name="useyn" value=' + dataJSONArray[i].useyn + '>'
			     + '<a href="javascript:;" class="nav-link rounded-0 font-size-h6" data-toggle="pill">'
			     + '  ㄴ  ' + dataJSONArray[i].menuname 
			     + '</a>'
				 + '</li>'
		} else if(dataJSONArray[i].lvl=="3"){
			datahtml += '<li class="nav-item m-0 nav-3depth">'
				 + '<input type="hidden" id="menucode" name="menucode" value=' + dataJSONArray[i].menucode + '>'
				 + '<input type="hidden" id="menuname" name="menuname" value=' + dataJSONArray[i].menuname + '>'
				 + '<input type="hidden" id="upmenucode" name="upmenucode" value=' + dataJSONArray[i].upmenucode + '>'
				 + '<input type="hidden" id="icon" name="icon" value=' + dataJSONArray[i].icon + '>'
				 + '<input type="hidden" id="filepath" name="filepath" value=' + dataJSONArray[i].filepath + '>'
				 + '<input type="hidden" id="lvl" name="lvl" value=' + dataJSONArray[i].lvl + '>'
				 + '<input type="hidden" id="sortcode" name="sortcode" value=' + dataJSONArray[i].sortcode + '>'
				 + '<input type="hidden" id="menubaryn" name="menubaryn" value=' + dataJSONArray[i].menubaryn + '>'
				 + '<input type="hidden" id="modalyn" name="modalyn" value=' + dataJSONArray[i].modalyn + '>'
				 + '<input type="hidden" id="useyn" name="useyn" value=' + dataJSONArray[i].useyn + '>'
			     + '<a href="javascript:;" class="nav-link rounded-0 font-size-h6" data-toggle="pill">'
			     + '  ㄴ  ' + dataJSONArray[i].menuname 
			     + '</a>'
				 + '</li>'
		}
	}
	$("#ulmenulist").html(datahtml);
}
