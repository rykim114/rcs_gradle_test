jQuery(document).ready(function() {
	$(".selectpicker").selectpicker();
	
	var menucode = z.getValue("menuCode");
	dataQuery(menucode);
	
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

function menuList(){
	z.buttonClick("MA0609", "공지목록", "R");
	z.menuLink("MA0609");
}	
