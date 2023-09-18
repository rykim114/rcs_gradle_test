var naviAddTextFormCnt = 0;  // 길찾기 경유지 개수
var naviSearchType = "";
var startName = ""; // 시작점
var startCoord = ""; // 시작 좌표
var endName = ""; // 도착지점
var endCoord = ""; // 도착지점 좌표
var middleNames = new HashMap(); // 경유지
var middleCoords = new HashMap(); // 경유지 좌표


var carRouteContent = new HashMap();
var naviMiddleMk = new Array();
var naviStartMk;
var naviEndMk;
var naviLayer;
var naviLayers = new Array();
var naviInfoMk = new Array();

var fullLineDatas = new Array();

var navi_searchName = "";

var allDist = 0;

var navi_rsize_check = false;

// 길찾기 상단 탭 (자동차, 대중교통, 도보)
function naviTab(mode) {  // mode (0:자동차 , 1: 대중교통 , 2: 도보)
	$("#navi_tab > li").each(function(index,e) {
		if(index==mode) {
			$(e).addClass("on");
			$(e).removeClass("off");
		}else {
			$(e).addClass("off");
			$(e).removeClass("on");
		}
	});
	
	if(mode==0) {
		$("#naviTeb1").css("display","");
		$("#naviTeb2").css("display","none");
		$("#naviTeb3").css("display","none");
		if(navi_rsize_check) {
			if($("#naviOnOff").attr("class").indexOf("ico_close")!=-1 || $("#naviOnOff").attr("class").indexOf("ico_close2")!=-1) {
				$("#naviFromBg").addClass("r_size");
			}
			$("#naviOnOff").css("display","");
		}
	}else if(mode==1) {
		$("#naviTeb1").css("display","none");
		$("#naviTeb2").css("display","");
		$("#naviTeb3").css("display","none");
		
		$("#naviFromBg").removeClass("r_size");
		$("#naviOnOff").css("display","none");
	}else if(mode==2) {
		$("#naviTeb1").css("display","none");
		$("#naviTeb2").css("display","none");
		$("#naviTeb3").css("display","");

		$("#naviFromBg").removeClass("r_size");
		$("#naviOnOff").css("display","none");
	}
}

// 검색창 기본 셋팅 (출발지,도착지)
function naviTextForm() {
	//동적 다국어 변경
	var startInfoStr = "";
	var middleInfoStr = "";
	var endInfoStr = "";
	if(lan=="KOR") {
		startInfoStr = "출발지를 입력하세요.";
		middleInfoStr = "경유지를 입력하세요.";
		endInfoStr = "도착지를 입력하세요.";
	}else if(lan=="ENG") {
		startInfoStr = "Input the starting place.";
		middleInfoStr = "Input the stopover place.";
		endInfoStr = "Input the destination.";
	}else if(lan=="JAN") {
		startInfoStr = "出発地入力";
		middleInfoStr = "経由地入力";
		endInfoStr = "目的地入力";
	}else if(lan=="CHINAG") {
		startInfoStr = "输入出发地";
		middleInfoStr = "输入经由地";
		endInfoStr = "输入目的地";
	}
	
	naviAddTextFormCnt=0;  // 경유지개수 초기화
	var html = '';
	html += '<div class="pr d_form">';
	html += '<form onsubmit="return false">';
	html += '<fieldset>';
	html += '<legend>길찾기 검색</legend>';
	html += '<label for="startInput">검색어 입력</label>';
	html += '<input type="text" id="startInput" name="startInput" class="naviSearchInput" placeholder="'+startInfoStr+'" onKeyDown="javascript:if(event.keyCode == 13){ naviSearch(\'startInput\');}">';
	html += '</fieldset>';
	html += '</form>';
	html += '<!-- 검색 아이콘 --><div class="navi_search ico_search" style="display: none;"><a href="#" onmouseenter="blurUnbind();" onmouseleave="blurbind();" onclick="naviSearch(\'startInput\');"></a></div>';
	html += '<!-- 초기화 아이콘 --><div class="text_del ico_reset" style="display: none;"><a href="#" onclick="naviTextDel(\'startInput\');"></a></div>';
	html += '</div>';
	
	html += '<div class="pr d_form">';
	html += '<form onsubmit="return false">';
	html += '<fieldset>';
	html += '<legend>길찾기 검색</legend>';
	html += '<label for="endInput">검색어 입력</label>';
	html += '<input type="text" id="endInput" name="endInput" class="naviSearchInput" placeholder="'+endInfoStr+'" onKeyDown="javascript:if(event.keyCode == 13){ naviSearch(\'endInput\');}">';
	html += '</fieldset>';
	html += '</form>';
	html += '<!-- 검색 아이콘 --><div class="navi_search ico_search" style="display: none;"><a href="#" onmouseenter="blurUnbind();" onmouseleave="blurbind();" onclick="naviSearch(\'endInput\');"></a></div>';
	html += '<!-- 초기화 아이콘 --><div class="text_del ico_reset" style="display: none;"><a href="#" onclick="naviTextDel(\'endInput\');"></a></div>';
	html += '</div>';
	
	html += '<!-- 출발지/도착지 전환 아이콘 --><div class="ico_change"><a href="#" onclick="naviSearchChange();"></a></div>';
	
	$("#naviInputForm").html(html);
	
	
	$('.naviSearchInput').bind("focus",function() {
		naviSearchBtnOn(this);
	});
	$('.naviSearchInput').bind("blur",function() {
		naviSearchBtnOff(this);
	});
	
	for(var i=0; i<$(".naviSearchInput").length; i++) {
		if($(".naviSearchInput").eq(i).val()!="") {
			textDelOn(i);
		}
	}
}

function naviAddTextForm() {
	//동적 다국어 변경
	var startInfoStr = "";
	var middleInfoStr = "";
	var endInfoStr = "";
	if(lan=="KOR") {
		startInfoStr = "출발지를 입력하세요.";
		middleInfoStr = "경유지를 입력하세요.";
		endInfoStr = "도착지를 입력하세요.";
	}else if(lan=="ENG") {
		startInfoStr = "Input the starting place.";
		middleInfoStr = "Input the stopover place.";
		endInfoStr = "Input the destination.";
	}else if(lan=="JAN") {
		startInfoStr = "出発地入力";
		middleInfoStr = "経由地入力";
		endInfoStr = "目的地入力";
	}else if(lan=="CHINAG") {
		startInfoStr = "输入出发地";
		middleInfoStr = "输入经由地";
		endInfoStr = "输入目的地";
	}
	if(naviAddTextFormCnt<5) {
		naviAddTextFormCnt++;
		var html = '';
		html += '<div class="pr d_form">';
		html += '<form onsubmit="return false">';
		html += '<fieldset>';
		html += '<legend>길찾기 검색</legend>';
		html += '<label for="startInput">검색어 입력</label>';
		html += '<input type="text" id="startInput" name="startInput" class="naviSearchInput" placeholder="'+startInfoStr+'" onKeyDown="javascript:if(event.keyCode == 13){ naviSearch(\'startInput\');}">';
		html += '</fieldset>';
		html += '</form>';
		html += '<!-- 검색 아이콘 --><div class="navi_search ico_search" style="display: none;"><a href="#" onmouseenter="blurUnbind();" onmouseleave="blurbind();" onclick="naviSearch(\'startInput\');"></a></div>';
		html += '<!-- 초기화 아이콘 --><div class="text_del ico_reset" style="display: none;"><a href="#" onclick="naviTextDel(\'startInput\');"></a></div>';
		html += '</div>';
		
		for(var i=0; i<naviAddTextFormCnt; i++) {
			html += '<div class="pr d_form">';
			html += '<form onsubmit="return false">';
			html += '<fieldset>';
			html += '<legend>길찾기 검색</legend>';
			html += '<label for="middleInput'+i+'">검색어 입력</label>';
			html += '<input type="text" id="middleInput'+i+'" name="middleInput'+i+'" class="naviSearchInput" placeholder="'+middleInfoStr+'" onKeyDown="javascript:if(event.keyCode == 13){ naviSearch(\'middleInput'+i+'\');}">';
			html += '</fieldset>';
			html += '</form>';
			html += '<!-- 검색 아이콘 --><div class="navi_search ico_search" style="display: none;"><a href="#" onmouseenter="blurUnbind();" onmouseleave="blurbind();" onclick="naviSearch(\'middleInput'+i+'\');"></a></div>';
			html += '<!-- 초기화 아이콘 --><div class="text_del ico_reset" style="display: none;"><a href="#" onclick="naviTextDel(\'middleInput'+i+'\');"></a></div>';
			html += '<!-- 경유지 삭제 아이콘 --><div class="ico_del"><a href="#" onclick="middleRmTextForm('+i+');"></a></div>';
			html += '</div>';
		}
		
		html += '<div class="pr d_form">';
		html += '<form onsubmit="return false">';
		html += '<fieldset>';
		html += '<legend>길찾기 검색</legend>';
		html += '<label for="endInput">검색어 입력</label>';
		html += '<input type="text" id="endInput" name="endInput" class="naviSearchInput" placeholder="'+endInfoStr+'" onKeyDown="javascript:if(event.keyCode == 13){ naviSearch(\'endInput\');}">';
		html += '</fieldset>';
		html += '</form>';
		html += '<!-- 검색 아이콘 --><div class="navi_search ico_search" style="display: none;"><a href="#" onmouseenter="blurUnbind();" onmouseleave="blurbind();" onclick="naviSearch(\'endInput\');"></a></div>';
		html += '<!-- 초기화 아이콘 --><div class="text_del ico_reset" style="display: none;"><a href="#" onclick="naviTextDel(\'endInput\');"></a></div>';
		html += '</div>';
		
		$("#naviInputForm").html(html);
		
		$('.naviSearchInput').bind("focus",function() {
			naviSearchBtnOn(this);
		});
		$('.naviSearchInput').bind("blur",function() {
			naviSearchBtnOff(this);
		});
		
		if(startName!="") {
			$("#startInput").val(startName);
		}
		if(endName!="") {
			$("#endInput").val(endName);
		}
		
		for(var i=0; i<middleNames.size(); i++) {
			$("#"+middleNames.keySet()[i]).val(middleNames.valSet()[i]);
		}
		
		for(var i=0; i<$(".naviSearchInput").length; i++) {
			if($(".naviSearchInput").eq(i).val()!="") {
				textDelOn(i);
			}
		}
		
		return true;
	}else {
		if(lan=="KOR") {
			alert("경유지는 최대 5개까지 적용됩니다.");
		}else if(lan=="ENG") {
			alert("Up to five different waypoints are applicable.");
		}else if(lan=="JAN") {
			alert("経由地は最大5個まで適用されます。");
		}else if(lan=="CHINAG") {
			alert("经由地最多可适用5个。");
		}
		if(rightClickPop!=null) {
			map.removeLayer(rightClickPop);
		}
		return false;
	}
}

function middleRmTextForm(keyId) {
	//동적 다국어 변경
	var startInfoStr = "";
	var middleInfoStr = "";
	var endInfoStr = "";
	var subFolder = "";
	if(lan=="KOR") {
		startInfoStr = "출발지를 입력하세요.";
		middleInfoStr = "경유지를 입력하세요.";
		endInfoStr = "도착지를 입력하세요.";
		subFolder = "kor";
	}else if(lan=="ENG") {
		startInfoStr = "Input the starting place.";
		middleInfoStr = "Input the stopover place.";
		endInfoStr = "Input the destination.";
		subFolder = "eng";
	}else if(lan=="JAN") {
		startInfoStr = "出発地入力";
		middleInfoStr = "経由地入力";
		endInfoStr = "目的地入力";
		subFolder = "jpn";
	}else if(lan=="CHINAG") {
		startInfoStr = "输入出发地";
		middleInfoStr = "输入经由地";
		endInfoStr = "输入目的地";
		subFolder = "chn";
	}
	
	naviAddTextFormCnt--;
	var html = '';
	html += '<div class="pr d_form">';
	html += '<form onsubmit="return false">';
	html += '<fieldset>';
	html += '<legend>길찾기 검색</legend>';
	html += '<label for="startInput">검색어 입력</label>';
	html += '<input type="text" id="startInput" name="startInput" class="naviSearchInput" placeholder="'+startInfoStr+'" onKeyDown="javascript:if(event.keyCode == 13){ naviSearch(\'startInput\');}">';
	html += '</fieldset>';
	html += '</form>';
	html += '<!-- 검색 아이콘 --><div class="navi_search ico_search" style="display: none;"><a href="#" onmouseenter="blurUnbind();" onmouseleave="blurbind();" onclick="naviSearch(\'startInput\');"></a></div>';
	html += '<!-- 초기화 아이콘 --><div class="text_del ico_reset" style="display: none;"><a href="#" onclick="naviTextDel(\'startInput\');"></a></div>';
	html += '</div>';
	
	for(var i=0; i<naviAddTextFormCnt; i++) {
		html += '<div class="pr d_form">';
		html += '<form onsubmit="return false">';
		html += '<fieldset>';
		html += '<legend>길찾기 검색</legend>';
		html += '<label for="middleInput'+i+'">검색어 입력</label>';
		html += '<input type="text" id="middleInput'+i+'" name="middleInput'+i+'" class="naviSearchInput" placeholder="'+middleInfoStr+'" onKeyDown="javascript:if(event.keyCode == 13){ naviSearch(\'middleInput'+i+'\');}">';
		html += '</fieldset>';
		html += '</form>';
		html += '<!-- 검색 아이콘 --><div class="navi_search ico_search" style="display: none;"><a href="#" onmouseenter="blurUnbind();" onmouseleave="blurbind();" onclick="naviSearch(\'middleInput'+i+'\');"></a></div>';
		html += '<!-- 초기화 아이콘 --><div class="text_del ico_reset" style="display: none;"><a href="#" onclick="naviTextDel(\'middleInput'+i+'\');"></a></div>';
		html += '<!-- 경유지 삭제 아이콘 --><div class="ico_del"><a href="#" onclick="middleRmTextForm('+i+');"></a></div>';
		html += '</div>';
	}
	
	html += '<div class="pr d_form">';
	html += '<form onsubmit="return false">';
	html += '<fieldset>';
	html += '<legend>길찾기 검색</legend>';
	html += '<label for="endInput">검색어 입력</label>';
	html += '<input type="text" id="endInput" name="endInput" class="naviSearchInput" placeholder="'+endInfoStr+'" onKeyDown="javascript:if(event.keyCode == 13){ naviSearch(\'endInput\');}">';
	html += '</fieldset>';
	html += '</form>';
	html += '<!-- 검색 아이콘 --><div class="navi_search ico_search" style="display: none;"><a href="#" onmouseenter="blurUnbind();" onmouseleave="blurbind();" onclick="naviSearch(\'endInput\');"></a></div>';
	html += '<!-- 초기화 아이콘 --><div class="text_del ico_reset" style="display: none;"><a href="#" onclick="naviTextDel(\'endInput\');"></a></div>';
	html += '</div>';
	
	if(naviAddTextFormCnt==0) {
		html += '<!-- 출발지/도착지 전환 아이콘 --><div class="ico_change"><a href="#" onclick="naviSearchChange();"></a></div>';
	}
	$("#naviInputForm").html(html);
	
	$('.naviSearchInput').bind("focus",function() {
		naviSearchBtnOn(this);
	});
	$('.naviSearchInput').bind("blur",function() {
		naviSearchBtnOff(this);
	});
	
	if(startName!="") {
		$("#startInput").val(startName);
	}
	if(endName!="") {
		$("#endInput").val(endName);
	}
	
	middleNames.remove("middleInput"+keyId);
	middleCoords.remove("middleInput"+keyId);
	while (naviMiddleMk.length > 0) {
		map.removeLayer(naviMiddleMk[naviMiddleMk.length - 1]);
		naviMiddleMk.pop();
	}
	
	for(var i=0; i<middleCoords.size(); i++) {
		var num = /\d/.exec(middleNames.keySet()[i]);
		if(keyId<num) {
			middleNames.keySet()[i] = "middleInput"+(num-1);
			middleCoords.keySet()[i] = "middleInput"+(num-1);
		}
		
		var coords = middleCoords.get(middleCoords.keySet()[i]).split(",");
		var iconIndex = parseInt(middleCoords.keySet()[i].replace("middleInput",""));
		naviMiddleMk.push(new L.Marker(new L.LatLng(coords[0], coords[1]),{icon: new L.Icon({
   			iconUrl: "/resources/common/custom/images/naviImg/"+subFolder+"/rpin_via_"+(iconIndex+1)+".png",
				// iconUrl: "/resources/common/custom/img/test_pin/"+leadingZeros(i+1,3)+".png",
   			iconAnchor: [20,53],
   		})}).addTo(map));
		naviMiddleMk[naviMiddleMk.length-1].setZIndexOffset(10000);
		
		$("#"+middleNames.keySet()[i]).val(middleNames.valSet()[i]);
	}
	
	var inputCheck = true;
	for(var i=0; i<$(".naviSearchInput").length; i++) {
		if($(".naviSearchInput").eq(i).val()!="") {
			textDelOn(i);
		}else {
			inputCheck = false;
		}
	}
	
	while (naviLayers.length>0) {
		map.removeLayer(naviLayers[naviLayers.length - 1]);
		naviLayers.pop();
	}
	if(naviLayer!=null) {
		map.removeLayer(naviLayer);
		naviLayer = null;
	}
	while (naviInfoMk.length>0) {
		map.removeLayer(naviInfoMk[naviInfoMk.length - 1]);
		naviInfoMk.pop();
	}
	while (fullLineDatas.length>0) {
		fullLineDatas.pop();
	}
	
	if(inputCheck) {
		naviStart();
	}
}


function middleSetTextForm() {
	//동적 다국어 변경
	var startInfoStr = "";
	var middleInfoStr = "";
	var endInfoStr = "";
	if(lan=="KOR") {
		startInfoStr = "출발지를 입력하세요.";
		middleInfoStr = "경유지를 입력하세요.";
		endInfoStr = "도착지를 입력하세요.";
	}else if(lan=="ENG") {
		startInfoStr = "Input the starting place.";
		middleInfoStr = "Input the stopover place.";
		endInfoStr = "Input the destination.";
	}else if(lan=="JAN") {
		startInfoStr = "出発地入力";
		middleInfoStr = "経由地入力";
		endInfoStr = "目的地入力";
	}else if(lan=="CHINAG") {
		startInfoStr = "输入出发地";
		middleInfoStr = "输入经由地";
		endInfoStr = "输入目的地";
	}
	
	naviAddTextFormCnt = middleNames.size();
	var html = '';
	html += '<div class="pr d_form">';
	html += '<form onsubmit="return false">';
	html += '<fieldset>';
	html += '<legend>길찾기 검색</legend>';
	html += '<label for="startInput">검색어 입력</label>';
	html += '<input type="text" id="startInput" name="startInput" class="naviSearchInput" placeholder="'+startInfoStr+'" onKeyDown="javascript:if(event.keyCode == 13){ naviSearch(\'startInput\');}">';
	html += '</fieldset>';
	html += '</form>';
	html += '<!-- 검색 아이콘 --><div class="navi_search ico_search" style="display: none;"><a href="#" onmouseenter="blurUnbind();" onmouseleave="blurbind();" onclick="naviSearch(\'startInput\');"></a></div>';
	html += '<!-- 초기화 아이콘 --><div class="text_del ico_reset" style="display: none;"><a href="#" onclick="naviTextDel(\'startInput\');"></a></div>';
	html += '</div>';
	
	for(var i=0; i<naviAddTextFormCnt; i++) {
		html += '<div class="pr d_form">';
		html += '<form onsubmit="return false">';
		html += '<fieldset>';
		html += '<legend>길찾기 검색</legend>';
		html += '<label for="middleInput'+i+'">검색어 입력</label>';
		html += '<input type="text" id="middleInput'+i+'" name="middleInput'+i+'" class="naviSearchInput" placeholder="'+middleInfoStr+'" onKeyDown="javascript:if(event.keyCode == 13){ naviSearch(\'middleInput'+i+'\');}">';
		html += '</fieldset>';
		html += '</form>';
		html += '<!-- 검색 아이콘 --><div class="navi_search ico_search" style="display: none;"><a href="#" onmouseenter="blurUnbind();" onmouseleave="blurbind();" onclick="naviSearch(\'middleInput'+i+'\');"></a></div>';
		html += '<!-- 초기화 아이콘 --><div class="text_del ico_reset" style="display: none;"><a href="#" onclick="naviTextDel(\'middleInput'+i+'\');"></a></div>';
		html += '<!-- 경유지 삭제 아이콘 --><div class="ico_del"><a href="#" onclick="middleRmTextForm('+i+');"></a></div>';
		html += '</div>';
	}
	
	html += '<div class="pr d_form">';
	html += '<form onsubmit="return false">';
	html += '<fieldset>';
	html += '<legend>길찾기 검색</legend>';
	html += '<label for="endInput">검색어 입력</label>';
	html += '<input type="text" id="endInput" name="endInput" class="naviSearchInput" placeholder="'+endInfoStr+'" onKeyDown="javascript:if(event.keyCode == 13){ naviSearch(\'endInput\');}">';
	html += '</fieldset>';
	html += '</form>';
	html += '<!-- 검색 아이콘 --><div class="navi_search ico_search" style="display: none;"><a href="#" onmouseenter="blurUnbind();" onmouseleave="blurbind();" onclick="naviSearch(\'endInput\');"></a></div>';
	html += '<!-- 초기화 아이콘 --><div class="text_del ico_reset" style="display: none;"><a href="#" onclick="naviTextDel(\'endInput\');"></a></div>';
	html += '</div>';
	
	if(naviAddTextFormCnt==0) {
		html += '<!-- 출발지/도착지 전환 아이콘 --><div class="ico_change"><a href="#" onclick="naviSearchChange();"></a></div>';
	}
	$("#naviInputForm").html(html);
	
	$('.naviSearchInput').bind("focus",function() {
		naviSearchBtnOn(this);
	});
	$('.naviSearchInput').bind("blur",function() {
		naviSearchBtnOff(this);
	});
	
	if(startName!="") {
		$("#startInput").val(startName);
		textDelOn(0);
	}
	if(endName!="") {
		$("#endInput").val(endName);
		textDelOn($(".text_del").length-1);
	}
	
	for(var outer = middleNames.size()-1; outer>0; outer--) {
        for(var inner=0; inner<outer; inner++) {
        	var number1 = Number(middleNames.keySet()[inner].replace("middleInput",""));
    		var number2 = Number(middleNames.keySet()[inner+1].replace("middleInput",""));
            if(number1>number2) {
            	var temp = "";
    			temp1 = middleNames.keySet()[inner]; 
    			middleNames.keySet()[inner] = middleNames.keySet()[inner+1];
    			middleNames.keySet()[inner+1] = temp1;
    			
    			temp = middleNames.valSet()[inner]; 
    			middleNames.valSet()[inner] = middleNames.valSet()[inner+1];
    			middleNames.valSet()[inner+1] = temp;
    			
    			temp = middleCoords.keySet()[inner]; 
    			middleCoords.keySet()[inner] = middleCoords.keySet()[inner+1];
    			middleCoords.keySet()[inner+1] = temp;
    			
    			temp = middleCoords.valSet()[inner]; 
    			middleCoords.valSet()[inner] = middleCoords.valSet()[inner+1];
    			middleCoords.valSet()[inner+1] = temp;
            }
        }
    }
	
	for(var i=0; i<middleNames.size(); i++) {
		middleNames.keySet()[i] = "middleInput"+i;
		middleCoords.keySet()[i] = "middleInput"+i;
		$("#"+middleNames.keySet()[i]).val(middleNames.valSet()[i]);
		textDelOn((i+1));
	}
}

function blurbind() {
	$('.naviSearchInput').bind("blur",function() {
		naviSearchBtnOff(this);
	});
}

function blurUnbind() {
	$(".naviSearchInput").unbind("blur");
}

function navi_reset() {
	$("#naviFromBg").removeClass("r_size");
	navi_rsize_check = false;
	$("#naviSearchForm").css("display","none");
	$("#naviResultForm").css("display","none");
	$("#naviOnOff").css("display","none");
	startName = "";
	startCoord = "";
	endName = "";
	endCoord = "";
	middleNames.clear();
	middleCoords.clear();
	navi_searchClear();
	naviResultClear();
	naviTextForm();
}



function textDelOn(index) {
	if($(".naviSearchInput").eq(index).val()!="") {
		$(".text_del").eq(index).css("display","");
	}
}

function textDelOff(index) {
	$(".text_del").eq(index).css("display","none");
}

function naviSearchBtnOn(this_) {
	var index = $("#naviInputForm").find("input").index(this_);
	textDelOff(index);
	$(".navi_search").eq(index).css("display","");
}

function naviSearchBtnOff(this_) {
	var index = $("#naviInputForm").find("input").index(this_);
	textDelOn(index);
	$(".navi_search").eq(index).css("display","none");
}


function naviSearchChange() {
	var temp = "";
	temp = startName;
	startName = endName;
	endName = temp;
	
	temp = startCoord;
	startCoord = endCoord;
	endCoord = temp;
	
	$("#startInput").val(startName);
	$("#endInput").val(endName);
	
	if(startName!="" && endName!="") {
		naviStart();
	}
}


function naviTextDel(type) {
	if(type=="startInput") {
		startName="";
		startCoord="";
		if(naviStartMk!=null) {
			map.removeLayer(naviStartMk);
			naviStartMk = null;
		}
		textDelOff(0);
	}else if(type=="endInput") {
		endName="";
		endCoord="";
		if(naviEndMk!=null) {
			map.removeLayer(naviEndMk);
			naviEndMk = null;
		}
		textDelOff($(".naviSearchInput").length-1);
	}else {
		var subFolder = "";
		if(lan=="KOR") {
			subFolder = "kor";
		}else if(lan=="ENG") {
			subFolder = "eng";
		}else if(lan=="JAN") {
			subFolder = "jpn";
		}else if(lan=="CHINAG") {
			subFolder = "chn";
		}
		
		middleNames.remove(type);
		middleCoords.remove(type);
		while (naviMiddleMk.length > 0) {
			map.removeLayer(naviMiddleMk[naviMiddleMk.length - 1]);
			naviMiddleMk.pop();
		}
		textDelOff(parseInt(type.replace("middleInput",""))+1);
		for(var i=0; i<middleCoords.size(); i++) {
			var coords = middleCoords.get(middleCoords.keySet()[i]).split(",");
			var iconIndex = parseInt(middleCoords.keySet()[i].replace("middleInput",""));
			naviMiddleMk.push(new L.Marker(new L.LatLng(coords[0], coords[1]),{icon: new L.Icon({
	   			iconUrl: "/resources/common/custom/images/naviImg/"+subFolder+"/rpin_via_"+(iconIndex+1)+".png",
					// iconUrl: "/resources/common/custom/img/test_pin/"+leadingZeros(i+1,3)+".png",
	   			iconAnchor: [20,53],
	   		})}).addTo(map));
			naviMiddleMk[naviMiddleMk.length-1].setZIndexOffset(10000);
			
			$("#"+middleNames.keySet()[i]).val(middleNames.valSet()[i]);
		}
	}
	$("#"+type).val("");
	navi_searchClear();
	$("#naviFromBg").removeClass("r_size");
	navi_rsize_check = false;
	$("#naviSearchForm").css("display","none");
	$("#naviResultForm").css("display","none");
	$("#naviOnOff").css("display","none");
	$("#naviResultList").html("");
	
	while (naviLayers.length>0) {
		map.removeLayer(naviLayers[naviLayers.length - 1]);
		naviLayers.pop();
	}
	if(naviLayer!=null) {
		map.removeLayer(naviLayer);
		naviLayer = null;
	}
	while (naviInfoMk.length>0) {
		map.removeLayer(naviInfoMk[naviInfoMk.length - 1]);
		naviInfoMk.pop();
	}
	while (fullLineDatas.length>0) {
		fullLineDatas.pop();
	}
}


function naviOnOff() {
	if($("#naviSearchForm").css("display")=="none" && $("#naviResultForm").css("display")=="none") {
		$("#naviFromBg").addClass("r_size");
		if($("#naviOnOff").attr("class").indexOf("naviOnOff2")!=-1) {
			$("#naviSearchForm").css("display","");
			$("#naviOnOff").attr("class","ico_close2 naviOnOff2");
		}else {
			$("#naviResultForm").css("display","");
			$("#naviOnOff").attr("class","ico_close naviOnOff");
		}
	}else {
		$("#naviFromBg").removeClass("r_size");
		$("#naviSearchForm").css("display","none");
		$("#naviResultForm").css("display","none");
		if($("#naviOnOff").attr("class").indexOf("naviOnOff2")!=-1) {
			$("#naviOnOff").attr("class","ico_open2 naviOnOff2");
		}else {
			$("#naviOnOff").attr("class","ico_open2 naviOnOff");
		}
		
	}
}


// !----------------------- 네비게이션 통합검색 ----------------------------------


function navi_searchTab(mode) {  // mode (0: 전체 , 1: 주소 , 2: 장소)
	$("#naviOnOff").css("display","");
	$("#naviOnOff").attr("class","ico_close2 naviOnOff2");
	$("#navi_search_tab > li").each(function(index,e) {
		if(index==mode) {
			$(e).addClass("on");
			$(e).removeClass("off");
		}else {
			$(e).addClass("off");
			$(e).removeClass("on");
		}
	});
}

function naviSearch(type) {  // type(startInput: 출발 endInput: 도착 middleInput+숫자 : 경유지)
	naviSearchType = type;
	navi_unifiedSearch(0,1,true);
}

function naviTextFormFocus() {
	if(naviSearchType.indexOf("start")!=-1) {
		for(var i=0; i<naviAddTextFormCnt; i++) {
			if($("#middleInput"+i).val()=="") {
				$("#middleInput"+i).focus();
				return;
			}
		}
		if($("#endInput").val()=="") {
			$("#endInput").focus();
			return;
		}
	}else if(naviSearchType.indexOf("end")!=-1) {
		if($("#startInput").val()=="") {
			$("#startInput").focus();
			return;
		}
		for(var i=0; i<naviAddTextFormCnt; i++) {
			if($("#middleInput"+i).val()=="") {
				$("#middleInput"+i).focus();
				return;
			}
		}
	}else if(naviSearchType.indexOf("middle")!=-1) {
		if($("#startInput").val()=="") {
			$("#startInput").focus();
			return;
		}
		for(var i=0; i<naviAddTextFormCnt; i++) {
			if($("#middleInput"+i).val()=="") {
				$("#middleInput"+i).focus();
				return;
			}
		}
		if($("#endInput").val()=="") {
			$("#endInput").focus();
			return;
		}
	}
}

function navi_unifiedSearch(mode, page, first){ // mode = 0 전체, mode = 1 주소, mode = 2 장소 , first(true:첫검색, false:이미검색된 결과)	
	if(rightClickPop!=null) {
		map.closePopup(rightClickPop);
	}
	for(var i=0; i<ncodeSearchMarker.length; i++) {
		ncodeSearchMarker[i].popState = false;
		ncodeSearchMarker[i].closePopup();
	}
	ncodeSelectMid = "";
	
	for(var i=0; i<jiguMarker.length; i++) {
		jiguMarker[i].popState = false;
		jiguMarker[i].closePopup();
	}
	jiguSelectMid = "";
	
	if(first) {
		navi_searchName = $("#"+naviSearchType).val();
	}
	if(navi_searchName != ""){
		naviSearchBtnOff(document.getElementById(naviSearchType));
		
		$("#naviFromBg").addClass("r_size");
		navi_rsize_check = true;
		$("#naviSearchForm").css("display","");
		navi_searchTab(mode);  // 검색 탭 변경
		$("#navi_searchNullForm").css("display","none");
		//동적 다국어 변경
		if(lan=="KOR") {
			$("#navi_search_info_form").html("<span>'"+navi_searchName+"'</span> 검색결과");	
		}else if(lan=="ENG") {
			$("#navi_search_info_form").html("<span>'"+navi_searchName+"'</span> Search results");
		}else if(lan=="JAN") {
			$("#navi_search_info_form").html("<span>'"+navi_searchName+"'</span> 検索結果");
		}else if(lan=="CHINAG") {
			$("#navi_search_info_form").html("<span>'"+navi_searchName+"'</span> 搜索结果");
		}
		mapCopyClear();
		navi_searchClear();
		naviResultClear();
		$("#naviResultForm").css("display","none");
		if(mode!=2){
			$("#navi_addressSearchForm").css("display","");
			if(mode==1) {
				$("#navi_address_list_more").css("display","none");
				$("#navi_poiSearchForm").css("display","none");
			}else {
				$("#navi_poiSearchForm").css("display","");
			}
			navi_geoCodingSearch(mode, page);
		}else{
			$("#navi_poi_list_more").css("display","none");
			$("#navi_addressSearchForm").css("display","none");
			$("#navi_poiSearchForm").css("display","");
			navi_poiSearch(mode, page);
		}
	}else{
		if(lan=="KOR") {
			alert("검색어를 입력해주세요.");
		}else if(lan=="ENG") {
			alert("Please enter your search words.");
		}else if(lan=="JAN") {
			alert("検索語を入力してください。");
		}else if(lan=="CHINAG") {
			alert("请输入您的搜索字词。");
		}
		if(naviSearchType.indexOf("start")!=-1) {
			if($("#startInput").val()=="") {
				$("#startInput").focus();
				return;
			}
		}else if(naviSearchType.indexOf("end")!=-1) {
			if($("#endInput").val()=="") {
				$("#endInput").focus();
				return;
			}
		}else if(naviSearchType.indexOf("middle")!=-1) {
			for(var i=0; i<naviAddTextFormCnt; i++) {
				if($("#middleInput"+i).val()=="") {
					$("#middleInput"+i).focus();
					return;
				}
			}
		}
	}
}


function navi_geoCodingSearch(mode, page){
	jHeader.serviceName = "GEOCODING";
	geoBody.fulladdress = navi_searchName;
	geoBody.selectFields.geoType = "ORIGIN";
	geoBody.addressType = "HLS";

	var jReqBody = {
			"header" : jHeader,
			"body" : geoBody
		};

	var dataString = "callback=?&req="+encodeURIComponent(objectToJSONString(jReqBody));
	//console.log(jUrl + "?callback=?&req=" + objectToJSONString(jReqBody));

	$.ajax({
		url:jUrl,
		async: true,
		type:'post',
		dataType:'jsonp',
		data:dataString,
		timeout:200000,
		error : function(d, txtStatus, error) {
			alert("다시 실행해주시기 바랍니다. code:11 \n"+"getJSON failed : " + d + ",  status: "+ txtStatus + ",  error: " + error);
		},success: function(data,result){
			if(data.body.geojson != undefined){
				naviTextFormFocus();
				var cnt = data.body.geojson.features.length;
				var pageCnt = 10; // 페이지당 개수
				var stIndex = (page-1)*pageCnt;
				var enIndex = (stIndex+pageCnt) < cnt ? (stIndex+pageCnt) : cnt;
				
				if(mode==0) { // 더보기 유, 무
					if(enIndex>3) {
						enIndex=3;
						$('#navi_address_list_more').css('display', '');
					}else {
						$('#navi_address_list_more').css('display', 'none');
					}
				}
				
				var list = "";
				for(var i = stIndex ; i < enIndex; i++){
					var feature = data.body.geojson.features[i];
					var centerPoint = centerCoord("GRS_80",feature.geometry);
					
					// 레이어
					geoCodingSearchLayer.push(new L.GeoJSON(
							feature, {
								style : function() {
									return {
										weight: 2,
										dashArray: '5, 5',
										color : "#ff6e04",
										opacity : 1,
										fillColor : "#ff6e04",
										fillOpacity : 0
									};						
								}
							}).addTo(map));
					
					geoCodingSearchLayer[geoCodingSearchLayer.length-1].on("click", function(){
						
						for(var i=0; i<geoCodingSearchMarker.length; i++) {
							geoCodingSearchMarker[i].popState = false;
							$(".navi_JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
							var iconOn = new L.Icon({
								iconUrl:geoCodingSearchMarker[i].markerImg,
								iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기
														// 위해 적용)
							});
							geoCodingSearchMarker[i].setIcon(iconOn);
							geoCodingSearchMarker[i].closePopup();
						}
						
						for(var i=0; i<poiSearchMarker.length; i++) {
							poiSearchMarker[i].popState = false;
							$(".navi_POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;
							var iconOn = new L.Icon({
								iconUrl:poiSearchMarker[i].markerImg,
								iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기
														// 위해 적용)
							});
							poiSearchMarker[i].setIcon(iconOn);
							poiSearchMarker[i].closePopup();
						}
						
						for(var i=0; i<ncodeSearchMarker.length; i++) {
							ncodeSearchMarker[i].popState = false;
							ncodeSearchMarker[i].closePopup();
						}
						ncodeSelectMid = "";
						
						for(var i=0; i<jiguMarker.length; i++) {
							jiguMarker[i].popState = false;
							jiguMarker[i].closePopup();
						}
						jiguSelectMid = "";
						
						map.removeLayer(rightClickPop);
					});
					
					geoCodingSearchLayer[geoCodingSearchLayer.length-1].on("mouseover", function(){
						this.setStyle({opacity:1, fillOpacity:0.2});
					});
					geoCodingSearchLayer[geoCodingSearchLayer.length-1].on("mouseout", function(){
						this.setStyle({opacity:1, fillOpacity:0});
					});
					
					geoCodingSearchLayer[geoCodingSearchLayer.length-1].on("contextmenu", function(e) {
						if(chkDist == false){
							tooltipClose();
							//var p = Coord_Trans("wgstoutmk", new PT(e.latlng.lng, e.latlng.lat));
							var lat = e.latlng.lat;
							var lng = e.latlng.lng;
							rightClickPopup(lat,lng,0);
						}
					});
					
					// 마커
					var markerImg = "/resources/common/custom/images/pin/mpin_"+(geoCodingSearchMarker.length+1)+".png";
					var listMarkerImg = "/resources/common/custom/images/pin/pin_"+(geoCodingSearchMarker.length+1)+".png";
					var onMarkerImg = "/resources/common/custom/images/pin/mpin_on.png";
					var onListMarkerImg = "/resources/common/custom/images/pin/mpin_on.png";
					
					geoCodingSearchMarker.push(new L.Marker(new L.LatLng(centerPoint.lat, centerPoint.lng),{icon: new L.Icon({   // 마커
																																	// 찍기
				    	iconUrl: markerImg,   // 핀 이미지
				    	iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
					})}).addTo(map));
					geoCodingSearchMarker[geoCodingSearchMarker.length-1].markerImg = markerImg;
					geoCodingSearchMarker[geoCodingSearchMarker.length-1].listMarkerImg = listMarkerImg;
					geoCodingSearchMarker[geoCodingSearchMarker.length-1].onMarkerImg = onMarkerImg;
					geoCodingSearchMarker[geoCodingSearchMarker.length-1].onListMarkerImg = onListMarkerImg;
					if(i == stIndex){
						geoCodingSearchMarker[geoCodingSearchMarker.length-1].popState = true;
					}else{
						geoCodingSearchMarker[geoCodingSearchMarker.length-1].popState = false;
					}
					geoCodingSearchMarker[geoCodingSearchMarker.length-1].feature = feature;
					geoCodingSearchMarker[geoCodingSearchMarker.length-1].index = geoCodingSearchMarker.length-1;
					geoCodingSearchMarker[geoCodingSearchMarker.length-1].bindPopup(tooltip.makeGeoContent(feature),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
					geoCodingSearchMarker[geoCodingSearchMarker.length-1].on("click", function(e) {
						var index = this.index;
						if(this.popState){
							this.popState = false;
							$(".navi_JusoResultIcon")[index].src = this.listMarkerImg;
							var iconOn = new L.Icon({
								iconUrl: this.markerImg,
								iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
							});
							this.setIcon(iconOn);
						}else{
							if(rightClickPop!=null) {
								map.closePopup(rightClickPop);
							}
							for(var i = 0; i<geoCodingSearchMarker.length; i++){
								if(i == index){
									$(".navi_JusoResultIcon")[i].src = geoCodingSearchMarker[i].onListMarkerImg;
									geoCodingSearchMarker[i].popState = true;
									geoCodingSearchMarker[i].setZIndexOffset(1000);
									var iconOn = new L.Icon({
										iconUrl : geoCodingSearchMarker[i].onMarkerImg,
										iconAnchor: [14,33]
									});
								}else{
									$(".navi_JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
									geoCodingSearchMarker[i].popState = false;
									geoCodingSearchMarker[i].setZIndexOffset(100);
									var iconOn = new L.Icon({
										iconUrl : geoCodingSearchMarker[i].markerImg,
										iconAnchor: [14,33]
									});
								}
								geoCodingSearchMarker[i].setIcon(iconOn);

								if(geoCodingSearchMarker[i].popState) {
									geoCodingSearchMarker[i].bindPopup(tooltip.makeGeoContent(geoCodingSearchMarker[i].feature),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
								}
							}
							
							
							for(var i=0; i<poiSearchMarker.length; i++) {
								poiSearchMarker[i].popState = false;
								$(".navi_POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;
								var iconOn = new L.Icon({
									iconUrl:poiSearchMarker[i].markerImg,
									iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로
															// 매칭하기 위해 적용)
								});
								poiSearchMarker[i].setIcon(iconOn);
								poiSearchMarker[i].closePopup();
							}
							
							
							for(var i=0; i<ncodeSearchMarker.length; i++) {
								ncodeSearchMarker[i].popState = false;
								ncodeSearchMarker[i].closePopup();
							}
							ncodeSelectMid = "";
							
							for(var i=0; i<jiguMarker.length; i++) {
								jiguMarker[i].popState = false;
								jiguMarker[i].closePopup();
							}
							jiguSelectMid = "";
						}
					});
					
					// ----------- 리스트 ---------------------------------
					var properties = feature.properties;
					list += navi_searchList("addressSearch",properties,centerPoint.lat, centerPoint.lng);
					// ----------- //리스트 ---------------------------------
				}
				navi_searchResult("addressSearch",mode,cnt,list,page);
			}else{
				$("#navi_addressSearchForm").css("display","none");
				if(mode==0) {
					navi_poiSearch(mode, page); // 주소 없으면 장소 검색
				}else if(mode==1) {
					navi_searchListNull();
				}
			}
		}
	});
}


// 주소 페이징
function navi_jusoPaging(pageNum, totalCnt){
	var startPageNum = pageNum - ((pageNum-1)%5);
	var maxPageNum = Math.ceil(totalCnt/10);
	var pagingList = "";
	
	pagingList += '<div class="tc" style="margin-top:10px;">';
	pagingList += '<div class="page clear">';
		
	if(pageNum>5){
		pagingList += '<span class="off arrow"> <span> <a href="#" onclick="navi_unifiedSearch(1, '+(startPageNum-1)+',false);">&lt;</a></span></span>';
	}
	for(var i=0; i<5; i++)
	{
		if(i+startPageNum<=maxPageNum) {	
			if(i+startPageNum==pageNum) {
				pagingList += '<span class="on">'+(i+startPageNum)+'</span>';
			}else {
				pagingList += '<span class="off" onclick="navi_unifiedSearch(1, '+(i+startPageNum)+',false);"><a href="#">'+(i+startPageNum)+'</a></span>';
			}
		}
	}
	if(maxPageNum>=startPageNum+5)
	{
		pagingList += '<span class="off arrow"><span><a href="#" onclick="navi_unifiedSearch(1, '+(startPageNum+5)+',false);">&gt;</a></span></span>';
	}
	
	pagingList += "</div>";
	pagingList += "</div>";
	
	return pagingList;
}


function navi_searchListNull() {
	$("#"+naviSearchType).focus();
	if(lan=="KOR") {
		$("#navi_search_info_form").html("<span>'"+navi_searchName+"'</span>에 대한 검색 결과가 없습니다.");	
	}else if(lan=="ENG") {
		$("#navi_search_info_form").html("Maps can't find <span>'"+navi_searchName+"'</span>");
	}else if(lan=="JAN") {
		$("#navi_search_info_form").html("<span>'"+navi_searchName+"'</span> に対する住所検索結果がありません。");
	}else if(lan=="CHINAG") {
		$("#navi_search_info_form").html("未找到关于您要的 <span>'"+navi_searchName+"'</span>");
	}
	$("#navi_searchNullForm").css("display","");
}


function navi_subGeoSearch(code,geoType,page) {
	
	jHeader.serviceName = "SUB_GEOCODING";
	subBody.code = code;
	subBody.selectFields.geoType = geoType;
	subBody.adminType = "ROAD_ADDRESS";
	subBody.page.cnt = 10;
	subBody.page.pageNo = page;
	var jReqBody = {
		"header" : jHeader,
		"body" : subBody
	};
	
	var dataString = "callback=?&req="+encodeURIComponent(objectToJSONString(jReqBody));
	//console.log(jUrl+"?callback=?&req="+objectToJSONString(jReqBody));
	$.ajax({
		url:jUrl,
		async:true,
		type:'POST',
		dataType:'jsonp',
		data:dataString,
		timeout : 200000,
		error : function(d, textStatus, error){
			alert("다시 실행해주시기 바랍니다. code:11 \n"+"getJSON failed : "+d+",  status: " + textStatus + ",  error: "+error);
		},success: function(data, result){
			if(data.body.geojson!=undefined) {
				var listCount = data.body.geojson.features.length; // ID 개수
				var totalCnt = data.body.page.totalCnt;
				var list = "";
				for ( var i = 0; i < listCount; i++) {
					var feature = data.body.geojson.features[i];
					if(geoType=='ORIGIN')   // 레이어 지도에 표현
					{
						var centerPoint = centerCoord("GRS_80",feature.geometry);  // 센터좌표
																					// 구하기
						
						var markerImg = "/resources/common/custom/images/pin/mpin_s"+(subGeoCodingSearchMarker.length+1)+".png";
						var listMarkerImg = "/resources/common/custom/images/pin/pin_s"+(subGeoCodingSearchMarker.length+1)+".png";
						subGeoCodingSearchMarker.push(new L.Marker(new L.LatLng(centerPoint.lat, centerPoint.lng),{icon: new L.Icon({   // 마커
																																		// 찍기
					    	iconUrl: markerImg,   // 핀 이미지
					    	iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해
													// 적용)
						})}));
						
						subGeoCodingSearchMarker[subGeoCodingSearchMarker.length-1].feature = feature;
						subGeoCodingSearchMarker[subGeoCodingSearchMarker.length-1].index = subGeoCodingSearchMarker.length-1;
						subGeoCodingSearchMarker[subGeoCodingSearchMarker.length-1].markerImg = markerImg;
						subGeoCodingSearchMarker[subGeoCodingSearchMarker.length-1].listMarkerImg = listMarkerImg;
						subGeoCodingSearchMarker[subGeoCodingSearchMarker.length-1].bindPopup(tooltip.makeGeoContent(feature),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
						subGeoCodingSearchMarker[subGeoCodingSearchMarker.length-1].on("click",function(e) {
							if(rightClickPop!=null) {
								map.closePopup(rightClickPop);
							}
							for(var i=0; i<ncodeSearchMarker.length; i++) {
								ncodeSearchMarker[i].popState = false;
								ncodeSearchMarker[i].closePopup();
							}
							ncodeSelectMid = "";
							
							for(var i=0; i<jiguMarker.length; i++) {
								jiguMarker[i].popState = false;
								jiguMarker[i].closePopup();
							}
							jiguSelectMid = "";
						});
						
						subGeoCodingSearchLayer.push(new L.GeoJSON(
							feature, {
								style : function() {
									return {
										weight: 2,
										dashArray: '5, 5',
										color : "#0100FF",
										opacity : 1,
										fillColor : "#0100FF",
										fillOpacity : 0.2,
								      	clickable : false
									};						
								}
							}).addTo(map));
						
						
						// ----------- 리스트 ---------------------------------
						var properties = feature.properties;
						list += navi_subGeoSearchList(i,properties,centerPoint.lat,centerPoint.lng);
						// ----------- //리스트 ---------------------------------
					}
				}
				list += navi_subGeoPaging(page, totalCnt, code);
				$("#"+code).html(list);
			}else {
				
			}
		}
	});
}


function navi_subGeoPaging(pageNum, totalCnt, code)
{
	var startPageNum = pageNum-((pageNum-1)%5);
	var maxPageNum = Math.ceil(totalCnt/10);// 페이지 갯수
	var subPagingList="";
	
	
	subPagingList += '<div class="tc" style="margin-top:10px;">';
	subPagingList += '<div class="page clear">';
	if(pageNum>5) {
		subPagingList += '<span class="off arrow"><span><a href="#" onclick="navi_subMenuSlide(\'addressSearch\',\''+code+'\',1,'+(startPageNum-1)+');">&lt;</a></span></span>';
	}
	for(var i=0; i<5; i++) {	
		if(i+startPageNum<=maxPageNum) {	
			if(i+startPageNum==pageNum) {
				subPagingList += '<span class="on">'+(i+startPageNum)+'</span>';
			}else {
				subPagingList += '<span class="off" onclick="navi_subMenuSlide(\'addressSearch\',\''+code+'\',1,'+(i+startPageNum)+');"><a href="#">'+(i+startPageNum)+'</a></span>';
			}
		}
	}
	if(maxPageNum>=startPageNum+5)
	{
		subPagingList += '<span class="off arrow"><span><a href="#" onclick="navi_subMenuSlide(\'addressSearch\',\''+code+'\',1,'+(startPageNum+5)+');">&gt;</a></span></span>';
	}
	subPagingList += '</div>';
	subPagingList += '</div>';
    return subPagingList;
}


function navi_poiSearch(mode, page){
	jHeader.serviceName = "POI";
	poiBody.crs = "GRS_80";
	poiBody.fulltext = navi_searchName;
	poiBody.page = {};
	if(mode==0) {
		poiBody.page.cnt = 5;
	}else {
		poiBody.page.cnt = 10 ;
	}
	
    poiBody.page.pageNo = page;
    var jReqBody = {
		"header" : jHeader,
		"body" : poiBody
	};
	
	delete poiBody.field;
	delete poiBody.mbr;
	var dataString = "callback=?&req="+encodeURIComponent(objectToJSONString(jReqBody));
	//console.log(jUrl+"?callback=?&req="+objectToJSONString(jReqBody));
	$.ajax({
		url:jUrl,
		async:true,
		type:'POST',
		dataType:'jsonp',
		data:dataString,
		timeout : 200000,
		error : function(d, textStatus, error){
			alert("다시 실행해주시기 바랍니다. code:22 \n"+"getJSON failed : "+d+",  status: " + textStatus + ",  error: "+error);
		},success: function(data, result){
			if(data.body.geojson!=undefined) {
				var countID = data.body.geojson.features.length; // ID 개수
				var totalCnt = data.body.page.totalCnt;
				if(mode==0) {
					if(geoCodingSearchMarker.length==0) {
						naviTextFormFocus();
					}
					if(totalCnt>5) {
						$('#navi_poi_list_more').css('display', 'block');
					}else {
						$('#navi_poi_list_more').css('display', 'none');
					}
				}
				var list = "";
				for(var i=0; i<countID; i++) {
					
					var feature = data.body.geojson.features[i];
					var centerX = feature.geometry.coordinates[0];
					var centerY = feature.geometry.coordinates[1];
					
					var contentName = "";
					var themeName = "";
					var treeFlag = "";
					var themeId = "";
					if(lan=="KOR" && (feature.properties.c_tree_flag=="2" || feature.properties.c_tree_flag=="3"))  // 2 : 개발지구 , 3 : 실내지도
					{
						for(var j=0; j<tree_flag.length; j++)
						{
							if(feature.properties.c_tree_flag==j+1)
							{
								contentName = tree_content_name[j];
								themeName = tree_flag_name[j];
								treeFlag = tree_flag[j];
								themeId = eval("feature.properties."+treeFlag);
								/*
								 * if(j<tree_flag_marker_img.length) {
								 * markerImg = tree_flag_marker_img[j]; }
								 */
								break;
							}
						}
						if(themeId!="-2147483648" && themeId!="" && themeId!=0) {
							navi_themeflag(feature,contentName,themeName,themeId);
						}else {
							navi_poiflag(feature);
						}
					}else {
						navi_poiflag(feature);
					}
					// ----------- 리스트 ---------------------------------
					var properties = feature.properties;
					list += navi_searchList("POISearch",properties,centerX,centerY,themeId,treeFlag);  // themeId,treeFlag
																										// :
																										// poi
																										// 확장컨텐츠가
																										// 있을때만
																										// 사용
					// ----------- //리스트 ---------------------------------
				}
				navi_searchResult("POISearch",mode,totalCnt,list,page);
			}else {
				$("#navi_poiSearchForm").css("display","none");
				if((mode==0 && geoCodingSearchMarker.length==0) || mode==2) {
					navi_searchListNull();
				}else {
					
				}
			}
		}
	});
}
// poi 페이징
function navi_poiPaging(pageNum, totalCnt){

	var startPageNum = pageNum - ((pageNum-1)%5);
	var maxPageNum = Math.ceil(totalCnt/10);
	var PoiPagingList = "";
	
	PoiPagingList += '<div class="tc" style="margin-top:10px;">';
	PoiPagingList += '<div class="page clear">';
	if(pageNum>5){
		PoiPagingList += '<span class="off arrow"> <span> <a href="#" onclick="navi_unifiedSearch(2, '+(startPageNum-1)+',false);">&lt;</a></span></span>';
	}
	for(var i=0; i<5; i++)
	{
		if(i+startPageNum<=maxPageNum) {	
			if(i+startPageNum==pageNum) {
				// PoiPagingList += '<span class="on" onclick="unifiedSearch(2,
				// '+(i+startPageNum)+');"><a
				// href="#">'+(i+startPageNum)+'</a></span>';
				PoiPagingList += '<span class="on">'+(i+startPageNum)+'</span>';
			}else {
				PoiPagingList += '<span class="off" onclick="navi_unifiedSearch(2, '+(i+startPageNum)+',false);"><a href="#">'+(i+startPageNum)+'</a></span>';
			}
		}
	}
	if(maxPageNum>=startPageNum+5)
	{
		// pagingList += "<li><a href='#'
		// onclick='unifiedSearch(1,"+(startPageNum+5)+");'><img
		// src='/resources/common/custom/img/dw_arrow_right.png' alt='뒤로' /></a></li>";
		PoiPagingList += '<span class="off arrow"><span><a href="#" onclick="navi_unifiedSearch(2, '+(startPageNum+5)+',false);">&gt;</a></span></span>';
	}
	PoiPagingList += "</div>";
	PoiPagingList += "</div>";
	return PoiPagingList;
}


function navi_poiflag(feature) {
	
	var markerImg = "/resources/common/custom/images/pin/mpin_poi_"+(poiSearchMarker.length+1)+".png";
	var listMarkerImg = "/resources/common/custom/images/pin/pin_poi_"+(poiSearchMarker.length+1)+".png";
	var tooltipIconImg = "/resources/common/custom/images/num/num_"+(poiSearchMarker.length+1)+".png";
	poiSearchMarker.push(new L.Marker(new L.LatLng(feature.geometry.coordinates[0], feature.geometry.coordinates[1]),{icon: new L.Icon({   // 마커
																																			// 찍기
    	iconUrl: markerImg,   // 핀 이미지
    	iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
	})}).addTo(map));
	poiSearchMarker[poiSearchMarker.length-1].popState=false;
	poiSearchMarker[poiSearchMarker.length-1].feature = feature;
	poiSearchMarker[poiSearchMarker.length-1].index = poiSearchMarker.length-1;
	poiSearchMarker[poiSearchMarker.length-1].markerImg = markerImg;
	poiSearchMarker[poiSearchMarker.length-1].listMarkerImg = listMarkerImg;
	poiSearchMarker[poiSearchMarker.length-1].tooltipIconImg = tooltipIconImg;
	poiSearchMarker[poiSearchMarker.length-1].bindPopup(tooltip.makePOIContent(feature,tooltipIconImg),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
	poiSearchMarker[poiSearchMarker.length-1].on("click",function(e) {
		var index = this.index;
		if(this.popState) {
			this.popState = false;
			$(".navi_POIResultIcon")[index].src = this.listMarkerImg;
			var iconOn = new L.Icon({
				iconUrl:this.markerImg,
				iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
			});
			this.setIcon(iconOn);
		}else {
			if(rightClickPop!=null) {
				map.closePopup(rightClickPop);
			}
			for(var i=0; i<poiSearchMarker.length; i++) {
				var iconOn = null;
				if(i==index) {
					$(".navi_POIResultIcon")[i].src = "/resources/common/custom/images/pin/pin_on.png";
					poiSearchMarker[i].popState = true;
					poiSearchMarker[i].setZIndexOffset(1000);
					iconOn = new L.Icon({
						iconUrl:"/resources/common/custom/images/pin/mpin_on.png",
						iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
					});
				}else {
					$(".navi_POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;
					poiSearchMarker[i].popState = false;
					poiSearchMarker[i].setZIndexOffset(100);
					iconOn = new L.Icon({
						iconUrl:poiSearchMarker[i].markerImg,
						iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
					});
				}
				poiSearchMarker[i].setIcon(iconOn);
				
				if(poiSearchMarker[i].popState) {
					poiSearchMarker[i].bindPopup(tooltip.makePOIContent(poiSearchMarker[i].feature,poiSearchMarker[i].tooltipIconImg),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
				}
			}
			
			for(var i=0; i<geoCodingSearchMarker.length; i++) {
				$(".navi_JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
				geoCodingSearchMarker[i].popState = false;
				geoCodingSearchMarker[i].setZIndexOffset(100);
				
				var iconOn = new L.Icon({
					iconUrl:geoCodingSearchMarker[i].markerImg,
					iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
				});
				geoCodingSearchMarker[i].setIcon(iconOn);
			}
			
			for(var i=0; i<ncodeSearchMarker.length; i++) {
				ncodeSearchMarker[i].popState = false;
				ncodeSearchMarker[i].closePopup();
			}
			ncodeSelectMid = "";
			
			for(var i=0; i<jiguMarker.length; i++) {
				jiguMarker[i].popState = false;
				jiguMarker[i].closePopup();
			}
			jiguSelectMid = "";
		}
	});
}


function navi_themeflag(poiFeature,contentName,themeName,themeId) {
	var markerImg = "/resources/common/custom/images/pin/mpin_poi_son.png";
	var listMarkerImg = "/resources/common/custom/images/pin/pin_poi_son.png";
	var tooltipIconImg = "/resources/common/custom/images/num/num_"+(poiSearchMarker.length+1)+".png";
	poiSearchMarker.push(new L.Marker(new L.LatLng(poiFeature.geometry.coordinates[0], poiFeature.geometry.coordinates[1]),{icon: new L.Icon({   // 마커
																																					// 찍기
    	iconUrl: markerImg,   // 핀 이미지
    	iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
	})}).addTo(map));
	var poiSearchMarkerIndex = poiSearchMarker.length-1;
	poiSearchMarker[poiSearchMarker.length-1].popState=false;
	poiSearchMarker[poiSearchMarker.length-1].markerImg = markerImg;
	poiSearchMarker[poiSearchMarker.length-1].listMarkerImg = markerImg;
	poiSearchMarker[poiSearchMarker.length-1].tooltipIconImg = tooltipIconImg;
	poiSearchMarker[poiSearchMarker.length-1].c_tree_flag = poiFeature.properties.c_tree_flag;
	
	jHeader.serviceName = "EXTENSION_SEARCH";
	extBody.conditions = {};
	extBody.conditions.geometry = {};
	extBody.conditions.geometry.spatialOp = "INTERSECT";
	extBody.conditions.field = [];
	extBody.conditions.field[extBody.conditions.field.length] = {};
	extBody.conditions.field[extBody.conditions.field.length-1].name = themeName;
	extBody.conditions.field[extBody.conditions.field.length-1].value = themeId;
	
	extBody.contentName = contentName;
	extBody.selectFields.geoType = "ORIGIN";
	extBody.page = {};
	extBody.page.cnt=10;
	extBody.page.pageNo=1;
	var jReqBody = {
		"header" : jHeader,
		"body" : extBody
	};
	ajaxLoding = true;
	var dataString = "callback=?&req="+encodeURIComponent(objectToJSONString(jReqBody));
	//console.log(jUrl+"?callback=?&req="+objectToJSONString(jReqBody));
	$.ajax({
		url:jUrl,
		type:'POST',
		dataType:'jsonp',
		data:dataString,
		timeout : 200000,
		async : false,
		error : function(d, textStatus, error){
			alert("다시 실행해주시기 바랍니다. code:11 \n"+"getJSON failed : "+d+",  status: " + textStatus + ",  error: "+error);
		},success: function(data, result){
			if(data.body.geojson!=undefined) {
				var countID = data.body.geojson.features.length; // ID 개수
				var totalCnt = data.body.page.totalCnt;
				var list = "";
				for ( var i = 0; i < countID; i++) {
					var feature = data.body.geojson.features[i];
					poiSearchMarker[poiSearchMarkerIndex].popState=false;
					poiSearchMarker[poiSearchMarkerIndex].feature = feature;
					poiSearchMarker[poiSearchMarkerIndex].index = poiSearchMarkerIndex;
					poiSearchMarker[poiSearchMarkerIndex].bindPopup(tooltip.themeContent(feature,parseInt(poiFeature.properties.c_tree_flag)-1,poiSearchMarker[poiSearchMarkerIndex].tooltipIconImg),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
					poiSearchMarker[poiSearchMarkerIndex].on("click",function(e) {
						var index = this.index;
						if(this.popState) {
							this.popState = false;
							$(".navi_POIResultIcon")[index].src = this.listMarkerImg;
							var iconOn = new L.Icon({
								iconUrl:this.markerImg,
								iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기
														// 위해 적용)
							});
							this.setIcon(iconOn);
						}else {
							for(var i=0; i<poiSearchMarker.length; i++) {
								var iconOn = null;
								if(i==index) {
									$(".navi_POIResultIcon")[i].src = "/resources/common/custom/images/pin/pin_on.png";
									poiSearchMarker[i].popState = true;
									poiSearchMarker[i].setZIndexOffset(1000);
									
									iconOn = new L.Icon({
										iconUrl:"/resources/common/custom/images/pin/mpin_on.png",
										iconAnchor: [14,33]  // 오프셋 (핀의 끝이
																// 좌표로 매칭하기 위해
																// 적용)
									});
								}else {
									$(".navi_POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;
									poiSearchMarker[i].popState = false;
									poiSearchMarker[i].setZIndexOffset(100);
									
									iconOn = new L.Icon({
										iconUrl:poiSearchMarker[i].markerImg,
										iconAnchor: [14,33]  // 오프셋 (핀의 끝이
																// 좌표로 매칭하기 위해
																// 적용)
									});
								}
								poiSearchMarker[i].setIcon(iconOn);
								
								if(poiSearchMarker[i].popState) {
									poiSearchMarker[i].bindPopup(tooltip.themeContent(feature,parseInt(poiFeature.properties.c_tree_flag)-1,poiSearchMarker[i].tooltipIconImg),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
								}
							}
							
							for(var i=0; i<geoCodingSearchMarker.length; i++) {
								$(".navi_JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
								geoCodingSearchMarker[i].popState = false;
								geoCodingSearchMarker[i].setZIndexOffset(100);
								
								var iconOn = new L.Icon({
									iconUrl:geoCodingSearchMarker[i].markerImg,
									iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로
															// 매칭하기 위해 적용)
								});
								geoCodingSearchMarker[i].setIcon(iconOn);
							}
							
							for(var i=0; i<ncodeSearchMarker.length; i++) {
								ncodeSearchMarker[i].popState = false;
								ncodeSearchMarker[i].closePopup();
							}
							ncodeSelectMid = "";
							
							for(var i=0; i<jiguMarker.length; i++) {
								jiguMarker[i].popState = false;
								jiguMarker[i].closePopup();
							}
							jiguSelectMid = "";
						}
					});
					
					if (feature.geometry.type == "Polygon") { // 3배열
						var cntCoord = feature.geometry.coordinates.length;
						for ( var j = 0; j < cntCoord; j++) {
							var cntCoord2 = feature.geometry.coordinates[j].length;
							for ( var k = 0; k < cntCoord2; k++) {
								var UtmkX = feature.geometry.coordinates[j][k][0];
								var UtmkY = feature.geometry.coordinates[j][k][1];
								var geoWgs = Coord_Trans("utmktowgs", new PT(UtmkX, UtmkY));
								feature.geometry.coordinates[j][k][0] = geoWgs.y;
								feature.geometry.coordinates[j][k][1] = geoWgs.x;
							}
						}
					}else if (feature.geometry.type == "MultiPolygon") { // 4배열
						var cntCoord = feature.geometry.coordinates.length; // Coordinates
																			// 1차배열
																			// 개수
						for ( var j = 0; j < cntCoord; j++) {
							var cntCoord2 = feature.geometry.coordinates[j].length;

							for ( var k = 0; k < cntCoord2; k++) {
								var cntCoord3 = feature.geometry.coordinates[j][k].length;

								for ( var l = 0; l < cntCoord3; l++) {
									var UtmkX = feature.geometry.coordinates[j][k][l][0];
									var UtmkY = feature.geometry.coordinates[j][k][l][1];
									var geoWgs = Coord_Trans("utmktowgs", new PT(UtmkX, UtmkY));
									feature.geometry.coordinates[j][k][l][0] = geoWgs.y;
									feature.geometry.coordinates[j][k][l][1] = geoWgs.x;
								}
							}
						}
					}
					if(contentName=="takji") {
						poiExtensionSearchLayer.push(new L.GeoJSON(
							feature, {
								style : function() {
									return {
										color: '#08a65d',
								        weight: 2,
								        opacity: 1,
								      	dashArray: '5, 5',
								      	fill: true,
								      	fillColor: '#08a65d',
								      	fillOpacity: 0.2,
								      	clickable : false
					              	};
								}
						}).addTo(map));
					}else if(contentName=="indoor") {
						poiExtensionSearchLayer.push(new L.GeoJSON(
							feature, {
								style : function() {
									return {
										color: '#018ece',
							            weight: 2,
										dashArray: '5, 5',
							            opacity: 1,
							          	fill: true,
							          	fillColor: '#018ece',
							          	fillOpacity: 0.2,
							          	clickable : false
					              	};
								}
						}).addTo(map));
					}
				}
			}
			ajaxLoding = false;
		}
	});
}



function navi_subPOISearch(code,page,treeFlag,parentIndex) {
	jHeader.serviceName = "POI";
	poiBody.crs = "GRS_80";
	poiBody.fulltext = "";
	poiBody.field = [];
	poiBody.field[0] = {};
	poiBody.field[0].name = treeFlag;
	poiBody.field[0].value = code;
	poiBody.page = {};
	poiBody.page.cnt = 10;
    poiBody.page.pageNo = page;
	var jReqBody = {
		"header" : jHeader,
		"body" : poiBody
	};
	delete poiBody.mbr;
	var dataString = "callback=?&req="+encodeURIComponent(objectToJSONString(jReqBody));
	//console.log(jUrl+"?callback=?&req="+objectToJSONString(jReqBody));
	$.ajax({
		url:jUrl,
		async:true,
		type:'POST',
		dataType:'jsonp',
		data:dataString,
		timeout : 200000,
		error : function(d, textStatus, error){
			alert("다시 실행해주시기 바랍니다. code:11 \n"+"getJSON failed : "+d+",  status: " + textStatus + ",  error: "+error);
		},success: function(data, result){
			if(data.body.geojson!=undefined) {
				var listCount = data.body.geojson.features.length; // ID 개수
				var totalCnt = data.body.page.totalCnt;
				var list = "";
				for(var i=0; i<listCount; i++) {
					var feature = data.body.geojson.features[i];
					var centerX = feature.geometry.coordinates[0];
					var centerY = feature.geometry.coordinates[1];
					
					var markerImg = "/resources/common/custom/images/pin/mpin_poi_s"+(subPOISearchMarker.length+1)+".png";
					var listMarkerImg = "/resources/common/custom/images/pin/pin_poi_s"+(subPOISearchMarker.length+1)+".png";
					var tooltipIconImg = "/resources/common/custom/images/num/num_poi_"+(subPOISearchMarker.length+1)+".png";
					subPOISearchMarker.push(new L.Marker(new L.LatLng(centerX, centerY),{icon: new L.Icon({   // 마커
																												// 찍기
				    	iconUrl: markerImg,   // 핀 이미지
				    	iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
					})}).addTo(map));
					subPOISearchMarker[subPOISearchMarker.length-1].popState=false;
					subPOISearchMarker[subPOISearchMarker.length-1].feature = feature;
					subPOISearchMarker[subPOISearchMarker.length-1].index = subPOISearchMarker.length-1;
					subPOISearchMarker[subPOISearchMarker.length-1].markerImg = markerImg;
					subPOISearchMarker[subPOISearchMarker.length-1].listMarkerImg = listMarkerImg;
					subPOISearchMarker[subPOISearchMarker.length-1].tooltipIconImg = tooltipIconImg;
					subPOISearchMarker[subPOISearchMarker.length-1].bindPopup(tooltip.makePOIContent(feature,tooltipIconImg),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
					subPOISearchMarker[subPOISearchMarker.length-1].on("click",function(e) {
						var index = this.index;
						if(this.popState) {
							this.popState = false;
						}else {
							if(rightClickPop!=null) {
								map.closePopup(rightClickPop);
							}
							this.popState = true;
							this.setZIndexOffset(1000);
							for(var i=0; i<subPOISearchMarker.length; i++) {
								if(i!=index) {
									subPOISearchMarker[i].popState = false;
									subPOISearchMarker[i].setZIndexOffset(100);
								}
							}
							
							for(var i=0; i<ncodeSearchMarker.length; i++) {
								ncodeSearchMarker[i].popState = false;
								ncodeSearchMarker[i].closePopup();
							}
							ncodeSelectMid = "";
							
							for(var i=0; i<jiguMarker.length; i++) {
								jiguMarker[i].popState = false;
								jiguMarker[i].closePopup();
							}
							jiguSelectMid = "";
						}
					});
					
					// ----------- 리스트 ---------------------------------
					var properties = feature.properties;
					list += navi_subPOISearchList(i,properties,centerX,centerY);
					// ----------- //리스트 ---------------------------------
				}
				
				list += navi_subPOIPaging(page,totalCnt,treeFlag,code,parentIndex);
				
				$("#"+code).html(list);
				
				$(".navi_subPOIResult").hover(
					function() {
						var index = $(".navi_subPOIResult").index(this);
						for(var i=0; i<subPOISearchMarker.length; i++) {
							if(i==index) {
								subPOISearchMarker[i].setZIndexOffset(1000);
							}else {
								subPOISearchMarker[i].setZIndexOffset(100);
							}
						}
					},function() {
						var index = $(".navi_subPOIResult").index(this);
						for(var i=0; i<subPOISearchMarker.length; i++) {
							if(subPOISearchMarker[i].popState) {
								subPOISearchMarker[i].setZIndexOffset(1000);
							}else {
								subPOISearchMarker[i].setZIndexOffset(100);
							}
						}
				});
				
			}else {
			}
		}
	});
}

function navi_subPOIPaging(pageNum, totalCnt, treeFlag, code, parentIndex)
{
	var startPageNum = pageNum-((pageNum-1)%5);
	var maxPageNum = Math.ceil(totalCnt/10);// 페이지 갯수
	var subPagingList="";
	subPagingList += '<div class="tc" style="margin-top:10px;">';
	subPagingList += '<div class="page clear">';
	if(pageNum>5) {
		subPagingList += '<span class="off arrow"><span><a href="#" onclick="navi_subMenuSlide(\'POISearch\',\''+code+'\',1,'+(startPageNum-1)+','+parentIndex+',\''+treeFlag+'\');">&lt;</a></span></span>';
	}
	for(var i=0; i<5; i++) {	
		if(i+startPageNum<=maxPageNum) {	
			if(i+startPageNum==pageNum) {
				subPagingList += '<span class="on">'+(i+startPageNum)+'</span>';
			}else {
				subPagingList += '<span class="off" onclick="navi_subMenuSlide(\'POISearch\',\''+code+'\',1,'+(i+startPageNum)+','+parentIndex+',\''+treeFlag+'\');"><a href="#">'+(i+startPageNum)+'</a></span>';
			}
		}
	}
	if(maxPageNum>=startPageNum+5)
	{
		subPagingList += '<span class="off arrow"><span><a href="#" onclick="navi_subMenuSlide(\'POISearch\',\''+code+'\',1,'+(startPageNum+5)+','+parentIndex+',\''+treeFlag+'\');">&gt;</a></span></span>';
	}
	subPagingList += '</div>';
	subPagingList += '</div>';
    return subPagingList;
}


// 길찾기 동적 리스트 테이블 생성
function navi_searchList(param, properties, centerX, centerY, themeId, treeFlag)
{
	var content1 = "";
	var content2 = "";
	var content3 = "";
	var content4 = "";
	
	if(param=="addressSearch")
	{
		var resKey = new Array(); // 결과값 키값
		var resVal = new Array(); // 결과값 value
		
		for ( var key in properties) {
			resKey.push(key);
			resVal.push(properties[key]);
		}
		
		var addrType = properties.type; // 어떤 주소인지 판별
		if(addrType == "sido" || addrType == "gu" || addrType == "li")  //시도,시군구
		{
			content1 = properties.name;
		}else if(addrType == "road") //도로
		{
			content1 = properties.name;
			content2 = properties.code;
		}else if(addrType == "ldong" || addrType == "hdong") //읍면동(행정동,법정동)
		{
			content1 = properties.name;
			//동적 다국어 변경
			if(lan=="KOR") {
				content2 = "관련주소 : ";
			}else if(lan=="ENG") {
				content2 = "Related address : ";
			}else if(lan=="JAN") {
				content2 = "関連住所 : ";
			}else if(lan=="CHINAG") {
				content2 = "关联地址 : ";
			}
			if(properties.hcodename!=undefined) {
				if(properties.hcodename!="") {
					content2 += properties.hcodename;	
				}else {
					content2 = "";
				}
			}else {
				if(properties.lcodename!="") {
					content2 += properties.lcodename;	
				}else {
					content2 = "";
				}
			}
		}else if(addrType == "jijuk") //지번주소
		{
			content1 = properties.pnuname;
			var data = properties.newrpnuname.split("|");
			//동적 다국어 변경
			if(lan=="KOR") {
				content2 = "도로명 : ";
			}else if(lan=="ENG") {
				content2 = "Road name address : ";
			}else if(lan=="JAN") {
				content2 = "道路名 : ";
			}else if(lan=="CHINAG") {
				content2 = "道路名 : ";
			}
			for(var i=0; i<data.length; i++) {
				var data2 = data[i].split(" ");
				content2 += data[i].replace(data2[0]+" "+data2[1], "");
				if(i!=data.length-1) {
					content2 += ",";
				}
			}
		}else if(addrType == "build") //도로명주소
		{
			content1 = properties.newrpnuname;
			var data = properties.pnuname.split("|");
			//동적 다국어 변경
			if(lan=="KOR") {
				content2 = "지번 : ";
				content3 = properties.buildname;
			}else if(lan=="ENG") {
				content2 = "Lot number : ";
			}else if(lan=="JAN") {
				content2 = "地番 : ";
			}else if(lan=="CHINAG") {
				content2 = "地番 : ";
			}
			for(var i=0; i<data.length; i++) {
				var data2 = data[i].split(" ");
				content2 += data[i].replace(data2[0]+" "+data2[1], "");
				if(i!=data.length-1) {
					content2 += ",";
				}
			}
		}
		
		
		var list='';
		list += '<div class="navi_JusoResult list clear" onclick="navi_setMapClick(this); startEndChoice(this,\''+content1+'\','+centerX+','+centerY+');"><!-- class on : 리스트 on 상태 -->';
		list += '<!-- pin --><div class="pin"><img class="navi_JusoResultIcon" src="'+geoCodingSearchMarker[geoCodingSearchMarker.length-1].listMarkerImg+'" width="20" height="24" alt="" /></div>';
		list += '<dl>';
		list += '<dt>'+content1+'</dt>';
		if(content2!="" && addrType == "road") {
			list += '<dd class="txt2">'+content2+'</dd>';
		}
		if(content3!="") {
			list += '<dd class="blank"></dd>';
			list += '<dd class="txt2">'+content3+'</dd>';
		}
		if(addrType == "road") { //도로
			list += '<dd class="navi_sub_address plus"><a href="#" onclick="stopProp(); navi_subMenuSlide(\'addressSearch\',\''+content2+'\',0,1,'+(geoCodingSearchMarker.length-1)+');"></a></dd>';
			list += '</dl>';
			list += '<div id="'+content2+'" class="navi_sub_list slist clear" style="display:none;">';
			list += '</div>';
		}else {
			list += '</dl>';
		}
		
		//동적 다국어 변경
		var startStr = "";
		var middleStr = "";
		var endStr = "";
		if(lan=="KOR") {
			startStr = "출발";
			middleStr = "경유";
			endStr = "도착";
		}else if(lan=="ENG") {
			startStr = "Start";
			middleStr = "Via";
			endStr = "Arrive";
		}else if(lan=="JAN") {
			startStr = "出発";
			middleStr = "経由";
			endStr = "到着";
		}else if(lan=="CHINAG") {
			startStr = "出发";
			middleStr = "经由";
			endStr = "到着";
		}
		if(naviSearchType.indexOf("start")!=-1) {
			list += '<div class="navi_fix_addr_list ico_start" style="display:none;"><span>'+startStr+'</span></div>';	
		}else if(naviSearchType.indexOf("end")!=-1) {
			list += '<div class="navi_fix_addr_list ico_arrival" style="display:none;"><span>'+endStr+'</span></div>';
		}else {
			list += '<div class="navi_fix_addr_list ico_via" style="display:none;"><span>'+middleStr+'</span></div>';
		}
		
		list += '</div>';
		
	}else if(param=="POISearch")
	{
		
		content1 = properties.name;
		var htmlChar = lfNmFormat(properties.sv_cls);
		content2 = htmlChar;
		content3 = properties.newrpnuname;
		if(properties.newrpnuname!="" && properties.newrpnuname!=null)
		{
			var addr = properties.newrpnuname.split(" ");
			jibunAddr = properties.pnuname.replace(addr[0]+" "+addr[1], "");
		}else
		{
			jibunAddr = properties.pnuname;
		}
		//동적 다국어 변경
		if(lan=="KOR") {
			content4 = "지번 : ";
		}else if(lan=="ENG") {
			content4 = "Lot number : ";
		}else if(lan=="JAN") {
			content4 = "地番 : ";
		}else if(lan=="CHINAG") {
			content4 = "地番 : ";
		}
		content4 += jibunAddr;
		
		var list = '';
		list += '<div class="navi_PoiResult list clear" onclick="navi_setMapClick(this); startEndChoice(this,\''+content1+'\','+centerX+','+centerY+');"><!-- class on : 리스트 on 상태 -->';
		list += '<!-- pin --><div class="pin"><img class="navi_POIResultIcon" src="'+poiSearchMarker[poiSearchMarker.length-1].listMarkerImg+'" width="20" height="24" alt="" /></div>';
		list += '<dl>';
		list += '<dt>'+content1+'</dt>';
		list += '<dd class="txt">'+content3+'</dd>';
		list += '<dd class="txt2">'+content4+'</dd>';
		list += '<dd class="blank"></dd><!-- blank : txt2 와 txt2 사이 padding 값 -->';
		list += '<dd class="txt2">'+content2+'</dd>';
		if(themeId!=null && themeId!="-2147483648" && themeId!="" && themeId!=0) {
			list += '<dd class="navi_sub_poi plus"><a href="#" onclick="stopProp(); navi_subMenuSlide(\'POISearch\',\''+themeId+'\',0,1,'+(poiSearchMarker.length-1)+',\''+treeFlag+'\');"></a></dd>';
			list += '</dl>';
			list += '<div id="'+themeId+'" class="navi_sub_list slist clear" style="display:none;">';
			list += '</div>';
		}else {
			list += '</dl>';
		}
		
		//동적 다국어 변경
		var startStr = "";
		var middleStr = "";
		var endStr = "";
		if(lan=="KOR") {
			startStr = "출발";
			middleStr = "경유";
			endStr = "도착";
		}else if(lan=="ENG") {
			startStr = "Start";
			middleStr = "Via";
			endStr = "Arrive";
		}else if(lan=="JAN") {
			startStr = "出発";
			middleStr = "経由";
			endStr = "到着";
		}else if(lan=="CHINAG") {
			startStr = "出发";
			middleStr = "经由";
			endStr = "到着";
		}
		if(naviSearchType.indexOf("start")!=-1) {
			list += '<div class="navi_fix_poi_list ico_start" style="display:none;"><span>'+startStr+'</span></div>';	
		}else if(naviSearchType.indexOf("end")!=-1) {
			list += '<div class="navi_fix_poi_list ico_arrival" style="display:none;"><span>'+endStr+'</span></div>';
		}else {
			list += '<div class="navi_fix_poi_list ico_via" style="display:none;"><span>'+middleStr+'</span></div>';
		}
		list += '</div>';
	}	
	return list;
}


function navi_subGeoSearchList(i, properties, centerX, centerY) {
	var newrpnuname = properties.newrpnuname;
	var pnuname = properties.pnuname;
	var buildname = properties.buildname;
	var data = pnuname.split("|");
	var data2 = data[0].split(" ");
	var pnuname = data[0].replace(data2[0]+" "+data2[1], "");
	
	var list = '';
	list += '<div class="navi_subGeoResult blank clear" onclick="stopProp(); navi_setMapClick(this);">';
	list += '<div class="pin"><img src="'+subGeoCodingSearchMarker[subGeoCodingSearchMarker.length-1].listMarkerImg+'" width="20" height="24" alt="" /></div>';
	list += '<dl>';
	list += '<dt>'+newrpnuname+'</dt>';
	list += '<dd>'+pnuname+'</dd>';
	list += '<dd>'+buildname+'</dd>';
	list += '</dl>';
	list += '</div>';
	return list;
}


function navi_subPOISearchList(i, properties, centerX, centerY) {
	var content1 = "";
	var content2 = "";
	var content3 = "";
	var content4 = "";
	content1 = properties.name;
	var htmlChar = lfNmFormat(properties.sv_cls);
	content2 = htmlChar;
	content3 = properties.newrpnuname;
	if(properties.newrpnuname!="" && properties.newrpnuname!=null)
	{
		var addr = properties.newrpnuname.split(" ");
		jibunAddr = properties.pnuname.replace(addr[0]+" "+addr[1], "");
	}else
	{
		jibunAddr = properties.pnuname;
	}
	content4 = "지번 : "+jibunAddr;
	
	var list = '';
	list += '<div class="navi_subPOIResult blank clear" onclick="stopProp(); navi_setMapClick(this);">';
	list += '<div class="pin"><img src="'+subPOISearchMarker[subPOISearchMarker.length-1].listMarkerImg+'" width="20" height="24" alt="" /></div>';
	list += '<dl>';
	list += '<dt>'+content1+'</dt>';
	list += '<dd>'+content3+'</dd>';
	list += '<dd>'+content4+'</dd>';
	list += '<dd>'+content2+'</dd>';
	list += '</dl>';
	list += '</div>';
	return list;
}



// 리스트 마우스 이벤트
function navi_searchResult(type, mode, totalCnt, list, page) {
	if(type=="addressSearch") {
		if(mode==0) {
			navi_poiSearch(mode,page);
		}else if(mode==1) {
			list += navi_jusoPaging(page, totalCnt); // 주소리스트 페이징
		}
		//동적 다국어 변경
		if(lan=="KOR") {
			$("#navi_addressTotalCount").html("주소 ( <span>"+toComma(totalCnt)+"</span> 건)");
		}else if(lan=="ENG") {
			$("#navi_addressTotalCount").html("Address ( <span>"+toComma(totalCnt)+"</span> cases )");
		}else if(lan=="JAN") {
			$("#navi_addressTotalCount").html("住所 ( <span>"+toComma(totalCnt)+"</span> 件 )");
		}else if(lan=="CHINAG") {
			$("#navi_addressTotalCount").html("地址 ( <span>"+toComma(totalCnt)+"</span> 件 )");
		}
		$("#navi_addressListForm").html(list);
		
		startEndChoice($(".navi_JusoResult")[0],$(".navi_JusoResult > dl > dt").html(),geoCodingSearchMarker[0].getLatLng().lat,geoCodingSearchMarker[0].getLatLng().lng);
		$(".navi_JusoResultIcon")[0].src = "/resources/common/custom/images/pin/pin_on.png";
		var iconOn = new L.Icon({
			iconUrl:"/resources/common/custom/images/pin/mpin_on.png",
			iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
		});
		
		geoCodingSearchMarker[0].setIcon(iconOn);
		geoCodingSearchMarker[0].bindPopup(tooltip.makeGeoContent(geoCodingSearchMarker[0].feature),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
		geoCodingSearchMarker[0].openPopup();
		geoCodingSearchMarker[0].setZIndexOffset(1000);
		$(".navi_JusoResult").hover(
			function() {
				var index = $(".navi_JusoResult").index(this);
				$(".navi_JusoResultIcon")[index].src = "/resources/common/custom/images/pin/pin_on.png";
				var iconOn = new L.Icon({
					iconUrl:"/resources/common/custom/images/pin/mpin_on.png",
					iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
				});
				geoCodingSearchMarker[index].setIcon(iconOn);
				
				for(var i=0; i<geoCodingSearchMarker.length; i++) {
					if(i==index) {
						geoCodingSearchMarker[i].setZIndexOffset(1000);
					}else {
						geoCodingSearchMarker[i].setZIndexOffset(100);
					}
					if(geoCodingSearchMarker[i].popState) {
						geoCodingSearchMarker[i].bindPopup(tooltip.makeGeoContent(geoCodingSearchMarker[i].feature),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
					}
				}
				
				for(var i=0; i<poiSearchMarker.length; i++) {
					poiSearchMarker[i].setZIndexOffset(100);
				}
			},function() {
				var index = $(".navi_JusoResult").index(this);
				if(geoCodingSearchMarker[index].popState) {
					geoCodingSearchMarker[index].bindPopup(tooltip.makeGeoContent(geoCodingSearchMarker[index].feature),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
					geoCodingSearchMarker[index].openPopup();
					return;
				}
				$(".navi_JusoResultIcon")[index].src = geoCodingSearchMarker[index].listMarkerImg;
				var iconOn = new L.Icon({
					iconUrl:geoCodingSearchMarker[index].markerImg,
					iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
				});
				geoCodingSearchMarker[index].setIcon(iconOn);
				
				for(var i=0; i<geoCodingSearchMarker.length; i++) {
					if(geoCodingSearchMarker[i].popState) {
						geoCodingSearchMarker[i].setZIndexOffset(1000);
						geoCodingSearchMarker[i].bindPopup(tooltip.makeGeoContent(geoCodingSearchMarker[i].feature),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
						geoCodingSearchMarker[i].openPopup();
					}else {
						geoCodingSearchMarker[i].setZIndexOffset(100);
					}
				}
				
				for(var i=0; i<poiSearchMarker.length; i++) {
					if(poiSearchMarker[i].popState) {
						poiSearchMarker[i].setZIndexOffset(1000);
						if(poiSearchMarker[i].c_tree_flag!=undefined) {
							poiSearchMarker[i].bindPopup(tooltip.themeContent(poiSearchMarker[i].feature,parseInt(poiSearchMarker[i].c_tree_flag)-1),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
						}else {
							poiSearchMarker[i].bindPopup(tooltip.makePOIContent(poiSearchMarker[i].feature),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
						}
						poiSearchMarker[i].openPopup();
					}else {
						poiSearchMarker[i].setZIndexOffset(100);
					}
				}
		});
		map.fitBounds(geoCodingSearchLayer[0].getBounds(),{ padding: [100, 100] });
	}else if(type=="POISearch") {
		if(mode==0) {
			
		}else if(mode==2) {
			list += navi_poiPaging(page,totalCnt);
		}
		//동적 다국어 변경
		if(lan=="KOR") {
			$("#navi_poiTotalCount").html("장소 ( <span>"+toComma(totalCnt)+"</span> 건 )");
		}else if(lan=="ENG") {
			$("#navi_poiTotalCount").html("Place ( <span>"+toComma(totalCnt)+"</span> cases )");
		}else if(lan=="JAN") {
			$("#navi_poiTotalCount").html("場所 ( <span>"+toComma(totalCnt)+"</span> 件 )");
		}else if(lan=="CHINAG") {
			$("#navi_poiTotalCount").html("场所 ( <span>"+toComma(totalCnt)+"</span> 件 )");
		}
		$("#navi_poiListForm").html(list);
		
		if(geoCodingSearchMarker.length==0) {
			map.setView(poiSearchMarker[0].getLatLng(), 12); // 지도 위치 이동 (좌표,지도 레벨)
			startEndChoice($(".navi_PoiResult")[0],$(".navi_PoiResult > dl > dt").html(),poiSearchMarker[0].getLatLng().lat,poiSearchMarker[0].getLatLng().lng);
			$(".navi_POIResultIcon")[0].src = "/resources/common/custom/images/pin/pin_on.png";
			var iconOn = new L.Icon({
				iconUrl:"/resources/common/custom/images/pin/mpin_on.png",
				iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
			});
			
			poiSearchMarker[0].setIcon(iconOn);
			if(poiSearchMarker[0].c_tree_flag!=undefined) {
				interval = setInterval(function() {
					if(!ajaxLoding) {
						poiSearchMarker[0].popState = true;
						poiSearchMarker[0].bindPopup(tooltip.themeContent(poiSearchMarker[0].feature,parseInt(poiSearchMarker[0].c_tree_flag)-1,poiSearchMarker[0].tooltipIconImg),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
						poiSearchMarker[0].openPopup();
						poiSearchMarker[0].setZIndexOffset(1000);
						clearInterval(interval);
						interval = null;
					}
				},100);
			}else {
				poiSearchMarker[0].popState = true;
				poiSearchMarker[0].bindPopup(tooltip.makePOIContent(poiSearchMarker[0].feature,poiSearchMarker[0].tooltipIconImg),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
				poiSearchMarker[0].openPopup();
				poiSearchMarker[0].setZIndexOffset(1000);
			}
		}
		$(".navi_PoiResult").hover(
			function() {
				var index = $(".navi_PoiResult").index(this);
				$(".navi_POIResultIcon")[index].src = "/resources/common/custom/images/pin/pin_on.png";
				var iconOn = new L.Icon({
					iconUrl:"/resources/common/custom/images/pin/mpin_on.png",
					iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
				});
				poiSearchMarker[index].setIcon(iconOn);
				for(var i=0; i<poiSearchMarker.length; i++) {
					if(i==index) {
						poiSearchMarker[i].setZIndexOffset(1000);
					}else {
						poiSearchMarker[i].setZIndexOffset(100);
					}
					if(poiSearchMarker[i].popState) {
						if(poiSearchMarker[i].c_tree_flag!=undefined) {
							poiSearchMarker[i].bindPopup(tooltip.themeContent(poiSearchMarker[i].feature,parseInt(poiSearchMarker[i].c_tree_flag)-1,poiSearchMarker[i].tooltipIconImg),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
						}else {
							poiSearchMarker[i].bindPopup(tooltip.makePOIContent(poiSearchMarker[i].feature,poiSearchMarker[i].tooltipIconImg),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
						}
					}
				}
				
				for(var i=0; i<geoCodingSearchMarker.length; i++) {
					geoCodingSearchMarker[i].setZIndexOffset(100);
				}
			},function() {
				var index = $(".navi_PoiResult").index(this);
				if(poiSearchMarker[index].popState) {
					if(poiSearchMarker[index].c_tree_flag!=undefined) {
						poiSearchMarker[index].bindPopup(tooltip.themeContent(poiSearchMarker[index].feature,parseInt(poiSearchMarker[index].c_tree_flag)-1,poiSearchMarker[index].tooltipIconImg),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
					}else {
						poiSearchMarker[index].bindPopup(tooltip.makePOIContent(poiSearchMarker[index].feature,poiSearchMarker[index].tooltipIconImg),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
					}
					poiSearchMarker[index].openPopup();
					return;
				}
				$(".navi_POIResultIcon")[index].src = poiSearchMarker[index].listMarkerImg;
				var iconOn = new L.Icon({
					iconUrl:poiSearchMarker[index].markerImg,
					iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
				});
				poiSearchMarker[index].setIcon(iconOn);
				
				for(var i=0; i<poiSearchMarker.length; i++) {
					if(poiSearchMarker[i].popState) {
						poiSearchMarker[i].setZIndexOffset(1000);
						if(poiSearchMarker[i].c_tree_flag!=undefined) {
							poiSearchMarker[i].bindPopup(tooltip.themeContent(poiSearchMarker[i].feature,parseInt(poiSearchMarker[i].c_tree_flag)-1,poiSearchMarker[i].tooltipIconImg),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
						}else {
							poiSearchMarker[i].bindPopup(tooltip.makePOIContent(poiSearchMarker[i].feature,poiSearchMarker[i].tooltipIconImg),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
						}
						poiSearchMarker[i].openPopup();
					}else {
						poiSearchMarker[i].setZIndexOffset(100);
					}
				}
				
				for(var i=0; i<geoCodingSearchMarker.length; i++) {
					if(geoCodingSearchMarker[i].popState) {
						geoCodingSearchMarker[i].setZIndexOffset(1000);
						geoCodingSearchMarker[i].bindPopup(tooltip.makeGeoContent(geoCodingSearchMarker[i].feature),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
						geoCodingSearchMarker[i].openPopup();
					}else {
						geoCodingSearchMarker[i].setZIndexOffset(100);
					}
				}
		});
	}
}


// / 리스트 클릭시 위치로 이동...
function navi_setMapClick(this_){
	if(rightClickPop!=null) {
		map.closePopup(rightClickPop);
	}
	for(var i=0; i<ncodeSearchMarker.length; i++) {
		ncodeSearchMarker[i].popState = false;
		ncodeSearchMarker[i].closePopup();
	}
	ncodeSelectMid = "";
	
	for(var i=0; i<jiguMarker.length; i++) {
		jiguMarker[i].popState = false;
		jiguMarker[i].closePopup();
	}
	jiguSelectMid = "";
	
	var className = this_.className.split(" ")[0];
	var index = $("."+className).index(this_);
	for(var i=0; i<subGeoCodingSearchMarker.length; i++) {
		map.removeLayer(subGeoCodingSearchMarker[i]);
	}
	if(className=="navi_JusoResult") {  // 주소리스트
		map.fitBounds(geoCodingSearchLayer[index].getBounds(),{ padding: [100, 100] });
		for(var i=0; i<geoCodingSearchMarker.length; i++) {
			if(i!=index) {
				geoCodingSearchMarker[i].popState = false;
				$(".navi_JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
				var iconOn = new L.Icon({
					iconUrl:geoCodingSearchMarker[i].markerImg,
					iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
				});
				geoCodingSearchMarker[i].setIcon(iconOn);
			}else {
				geoCodingSearchMarker[i].popState = true;
				geoCodingSearchMarker[i].bindPopup(tooltip.makeGeoContent(geoCodingSearchMarker[i].feature),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
				geoCodingSearchMarker[i].openPopup();
			}
		}
		
		for(var i=0; i<poiSearchMarker.length; i++) {
			poiSearchMarker[i].popState = false;
			
			$(".navi_POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;
			var iconOn = new L.Icon({
				iconUrl:poiSearchMarker[i].markerImg,
				iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
			});
			poiSearchMarker[i].setIcon(iconOn);
		}
	} else if(className=="navi_PoiResult") {  // poi 리스트
		map.setView(poiSearchMarker[index].getLatLng(), 12); // 지도 위치 이동 (좌표,지도 레벨)
		for(var i=0; i<geoCodingSearchMarker.length; i++) {
			geoCodingSearchMarker[i].popState = false;
			$(".navi_JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
			var iconOn = new L.Icon({
				iconUrl:geoCodingSearchMarker[i].markerImg,
				iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
			});
			geoCodingSearchMarker[i].setIcon(iconOn);
		}
		
		for(var i=0; i<poiSearchMarker.length; i++) {
			if(i!=index) {
				poiSearchMarker[i].popState = false;
				$(".navi_POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;

				var iconOn = new L.Icon({
					iconUrl:poiSearchMarker[i].markerImg,
					iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
				});
				
				poiSearchMarker[i].setIcon(iconOn);
			
			}else {
				poiSearchMarker[i].popState=true;
				if(poiSearchMarker[i].c_tree_flag!=undefined) {
					poiSearchMarker[i].bindPopup(tooltip.themeContent(poiSearchMarker[i].feature,parseInt(poiSearchMarker[i].c_tree_flag)-1,poiSearchMarker[i].tooltipIconImg),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
				}else {
					poiSearchMarker[i].bindPopup(tooltip.makePOIContent(poiSearchMarker[i].feature,poiSearchMarker[i].tooltipIconImg),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
				}
				poiSearchMarker[i].openPopup();
			}
		}
	}else if(className=="navi_subGeoResult") {
		map.fitBounds(subGeoCodingSearchLayer[index].getBounds(),{ padding: [100, 100] });
		for(var i=0; i<geoCodingSearchMarker.length; i++) {
			geoCodingSearchMarker[i].popState = false;
			$(".navi_JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
			var iconOn = new L.Icon({
				iconUrl:geoCodingSearchMarker[i].markerImg,
				iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
			});
			geoCodingSearchMarker[i].setIcon(iconOn);
		}
		
		for(var i=0; i<poiSearchMarker.length; i++) {
			poiSearchMarker[i].popState = false;
			$(".navi_POIResultIcon")[i].src = poiSearchMarker[i].markerImg;
			var iconOn = new L.Icon({
				iconUrl:poiSearchMarker[i].listMarkerImg,
				iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
			});
			poiSearchMarker[i].setIcon(iconOn);
		}
		
		for(var i=0; i<ncodeSearchMarker.length; i++) {
			ncodeSearchMarker[i].popState = false;
			ncodeSearchMarker[i].closePopup();
		}
		ncodeSelectMid = "";
		
		for(var i=0; i<jiguMarker.length; i++) {
			jiguMarker[i].popState = false;
			jiguMarker[i].closePopup();
		}
		jiguSelectMid = "";
		
		subGeoCodingSearchMarker[index].addTo(map);
		subGeoCodingSearchMarker[index].openPopup();
		
	}else if(className=="navi_subPOIResult") {
		map.setView(subPOISearchMarker[index].getLatLng(), 12); // 지도 위치 이동 (좌표,지도 레벨)
		for(var i=0; i<geoCodingSearchMarker.length; i++) {
			geoCodingSearchMarker[i].popState = false;
			$(".navi_JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
			var iconOn = new L.Icon({
				iconUrl:geoCodingSearchMarker[i].markerImg,
				iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
			});
			geoCodingSearchMarker[i].setIcon(iconOn);
			geoCodingSearchMarker[i].closePopup();
		}
		
		for(var i=0; i<poiSearchMarker.length; i++) {
			poiSearchMarker[i].popState = false;
			$(".navi_POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;
			var iconOn = new L.Icon({
				iconUrl:poiSearchMarker[i].markerImg,
				iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
			});
			poiSearchMarker[i].setIcon(iconOn);
			poiSearchMarker[i].closePopup();
		}
		for(var i=0; i<subPOISearchMarker.length; i++) {
			if(i!=index) {
				subPOISearchMarker[i].popState = false;
			}else {
				subPOISearchMarker[i].popState = true;
				subPOISearchMarker[i].openPopup();
			}
		}
	}
}


function startEndChoice(this_,name,lat,lng) {
	var subFolder = "";
	if(lan=="KOR") {
		subFolder = "kor";
	}else if(lan=="ENG") {
		subFolder = "eng";
	}else if(lan=="JAN") {
		subFolder = "jpn";
	}else if(lan=="CHINAG") {
		subFolder = "chn";
	}
	
	var className = this_.className.split(" ")[0];
	var index = $("."+className).index(this_);
	if(className=="navi_JusoResult") {  // 주소리스트
		$(".navi_fix_addr_list").each(function(index2,e) {
			if(index!=index2) {
				$(e).css("display","none");
			}else {
				$(e).css("display","");
			}
		});
		
		$(".navi_fix_poi_list").css("display","none");
	}else if(className=="navi_PoiResult") {  // poi 리스트
		$(".navi_fix_poi_list").each(function(index2,e) {
			if(index!=index2) {
				$(e).css("display","none");
			}else {
				$(e).css("display","");
			}
		});
		
		$(".navi_fix_addr_list").css("display","none");
	}
	
	$("#"+naviSearchType).val(name);
	if(naviSearchType.indexOf("start")!=-1) {
		startName = name;
		startCoord = lat+","+lng;
		if(naviStartMk!=null) {
			naviStartMk.setLatLng(new L.LatLng(lat, lng));	
		}else {
			naviStartMk = new L.Marker(new L.LatLng(lat, lng),{icon: new L.Icon({
				iconUrl: "/resources/common/custom/images/naviImg/"+subFolder+"/rpin_start.png",
				iconAnchor: [15,36]
			})}).addTo(map);
			naviStartMk.setZIndexOffset(10000);	
		}
	}else if(naviSearchType.indexOf("end")!=-1) {
		endName = name;
		endCoord = lat+","+lng;
		if(naviEndMk!=null) {
			naviEndMk.setLatLng(new L.LatLng(lat, lng));	
		}else {
			naviEndMk = new L.Marker(new L.LatLng(lat, lng),{icon: new L.Icon({
	 	    	iconUrl: "/resources/common/custom/images/naviImg/"+subFolder+"/rpin_arrival.png",
	 	    	iconAnchor: [15,36]
			})}).addTo(map);
			naviEndMk.setZIndexOffset(10000);	
		}
	}else {
		middleNames.set(naviSearchType,name);
		middleCoords.set(naviSearchType,lat+","+lng);
		while (naviMiddleMk.length > 0) {
			map.removeLayer(naviMiddleMk[naviMiddleMk.length - 1]);
			naviMiddleMk.pop();
		}
		for(var i=0; i<middleCoords.size(); i++) {
			var coords = middleCoords.get(middleCoords.keySet()[i]).split(",");
			var iconIndex = parseInt(middleCoords.keySet()[i].replace("middleInput",""));
			naviMiddleMk.push(new L.Marker(new L.LatLng(coords[0], coords[1]),{icon: new L.Icon({
	   			iconUrl: "/resources/common/custom/images/naviImg/"+subFolder+"/rpin_via_"+(iconIndex+1)+".png",
	   			iconAnchor: [15,36]
	   		})}).addTo(map));
			naviMiddleMk[naviMiddleMk.length-1].setZIndexOffset(10000);
		}
	}
}

function navi_searchClear() {
	while(geoCodingSearchLayer.length > 0){
		map.removeLayer(geoCodingSearchLayer[geoCodingSearchLayer.length - 1]);
		geoCodingSearchLayer.pop();
	}
	
	while (geoCodingSearchMarker.length > 0) {
		map.removeLayer(geoCodingSearchMarker[geoCodingSearchMarker.length - 1]);
		geoCodingSearchMarker.pop();
	}
	
	while(poiSearchMarker.length > 0){
		map.removeLayer(poiSearchMarker[poiSearchMarker.length - 1]);
		poiSearchMarker.pop();
	}
	
	$("#navi_addressListForm").html("");
	$("#navi_addressTotalCount").html("0");
	$("#navi_poiListForm").html("");
	$("#navi_poiTotalCount").html("0");
}

function navi_subGeoSearchClear(id) {
	while (subGeoCodingSearchMarker.length > 0) {
		map.removeLayer(subGeoCodingSearchMarker[subGeoCodingSearchMarker.length - 1]);
		subGeoCodingSearchMarker.pop();
	}
	
	while (subGeoCodingSearchLayer.length > 0) {
		map.removeLayer(subGeoCodingSearchLayer[subGeoCodingSearchLayer.length - 1]);
		subGeoCodingSearchLayer.pop();
	}
	
	var idClass=$(".navi_sub_list");
	if(id!="") {
		/*
		 * for(var i=0; i<idClass.length; i++) { var tempId = idClass[i].id;
		 * if(tempId!=id) { $("#"+tempId).html(""); } }
		 */
	}else {
		idClass.html("");
		idClass.slideUp();
		$(".navi_sub_address").removeClass('minus');
		$(".navi_sub_address").addClass('plus');
	}
}


function navi_subPOISearchClear(id) {
	while (subPOISearchMarker.length > 0) {
		map.removeLayer(subPOISearchMarker[subPOISearchMarker.length - 1]);
		subPOISearchMarker.pop();
	}
	
	var idClass=$(".navi_sub_list");
	if(id!="") {
		/*
		 * for(var i=0; i<idClass.length; i++) { var tempId = idClass[i].id;
		 * if(tempId!=id) { $("#"+tempId).html(""); } }
		 */
	}else {
		idClass.html("");
		idClass.slideUp();
		$(".navi_sub_poi").removeClass('minus');
		$(".navi_sub_poi").addClass('plus');
	}
}


function navi_searchReset() {
	$("#unifiedSearchForm").css("display","none");
	$("#inputSearchDel").css("display","none");
	$("#inputSearch").val("");
	searchClear();
}


// 슬라이드
function navi_subMenuSlide(searchType,id,type,page,parentIndex,treeFlag) {
	if(searchType=="addressSearch") {
		if(type==0) {
			var submenu = $("#"+id);
	        // submenu 가 화면상에 보일때는 위로 보드랍게 접고 아니면 아래로 보드랍게 펼치기
			navi_subGeoSearchClear("");
			
	        if(submenu.is(":visible")) {
	            submenu.slideUp(200);
	            var subClass = $(".navi_JusoResult").eq(parentIndex).find(".navi_sub_address");
	            subClass.removeClass('minus');
	            subClass.addClass('plus');
	        }else{
	        	navi_setMapClick($(".navi_JusoResult")[parentIndex]);
	        	navi_subGeoSearch(id,"ORIGIN",page);
	            submenu.slideDown(200);
	            var subClass = $(".navi_JusoResult").eq(parentIndex).find(".navi_sub_address");
	            subClass.removeClass('plus');
	            subClass.addClass('minus');
	        }
		}else {
			navi_subGeoSearchClear(id);
			navi_subGeoSearch(id,"ORIGIN",page);
		}
	}else if(searchType=="POISearch") {
		if(type==0) {
			var submenu = $("#"+id);
	        // submenu 가 화면상에 보일때는 위로 보드랍게 접고 아니면 아래로 보드랍게 펼치기
			navi_subPOISearchClear("");
	        if(submenu.is(":visible")) {
	            submenu.slideUp(200);
	            var subClass = $(".navi_PoiResult").eq(parentIndex).find(".navi_sub_poi");
	            subClass.removeClass('minus');
	            subClass.addClass('plus');
	        }else{
	        	navi_setMapClick($(".navi_PoiResult")[parentIndex]);
	        	navi_subPOISearch(id,page,treeFlag,parentIndex);
	            submenu.slideDown(200);
	            var subClass = $(".navi_PoiResult").eq(parentIndex).find(".navi_sub_poi");
	            subClass.removeClass('plus');
	            subClass.addClass('minus');
	        }
		}else {
			navi_subPOISearchClear(id);
			navi_setMapClick($(".navi_PoiResult")[parentIndex]);
			navi_subPOISearch(id,page,treeFlag,parentIndex);
		}
	}
}


function naviChoice(type,lat,lng,name) {
	/** 190829_JIK **/
	gridAllClear(0);
	
	if($("#naviForm").css("display")=="none") {
		naviTextForm();
	}
	$("#searchForm").css("display","none");
	$("#naviForm").css("display","");
	naviTab(0);
	searchClear();
	bSearchAllClear();
	
	for(var i=0; i<ncodeSearchMarker.length; i++) {
		ncodeSearchMarker[i].popState = false;
	}
	ncodeSelectMid = "";
	
	if(startName=="" || endName=="") {
		$("#naviFromBg").removeClass("r_size");
		navi_rsize_check = false;
		$("#naviOnOff").css("display","none");
	}
	
	for(var i=0; i<jiguMarker.length; i++) {
		jiguMarker[i].popState = false;
	}
	jiguSelectMid = "";
	
	navi_searchClear();
	$("#naviSearchForm").css("display","none");
	map.closePopup(rightClickPop);
	if(name==null) {  //오른쪽 팝업에서 출발,경유,도착 선택
		naviGatAddress(type,lat,lng,"ROAD_ADDRESS");
	}else {  //리스트 및 팝업에서 출발,경유,도착 선택
		setNaviInfo(type,lat,lng,name);
	}
}



function naviGatAddress(type,lat,lng,adminType) {
	jHeader.serviceName = "REVERSE_GEOCODING";
	revBody.point = lat+","+lng;
	revBody.selectFields.geoType = "EMPTY";
	revBody.adminType = adminType;
	revBody.spatialOperation = "INTERSECT";
	
	var jReqBody = {
		"header" : jHeader,
		"body" : revBody
	};
	
	var dataString = "callback=?&req="+encodeURIComponent(objectToJSONString(jReqBody));
	//console.log(jUrl+"?callback=?&req="+objectToJSONString(jReqBody));
	$.ajax({
		url:jUrl,
		async:true,
		type:'POST',
		dataType:'jsonp',
		data:dataString,
		timeout : 200000,
		error : function(d, textStatus, error){
			alert("다시 실행해주시기 바랍니다. code:11 \n"+"getJSON failed : "+d+",  status: " + textStatus + ",  error: "+error);
		},success: function(data, result){
			var geojson = data.body.geojson;
			if(geojson!=null) {
				var addrname = "";
				if(adminType=="ROAD_ADDRESS") {
					addrname = data.body.geojson.features[0].properties.newrpnuname; // 도로명주소
				}else {
					addrname = data.body.geojson.features[0].properties.pnuname; // 지번 주소
				}
				setNaviInfo(type,lat,lng,addrname);
			}else {
				if(adminType=="ROAD_ADDRESS") {
					naviGatAddress(type,lat,lng,"JIBUN_ADDRESS");
				}else {
					if(lan=="KOR") {
						alert("주소를 찾을 수 없습니다.");
					}else if(lan=="ENG") {
						alert("You have not found the address you want.");
					}else if(lan=="JAN") {
						alert("住所を見つけられません。");
					}else if(lan=="CHINAG") {
						alert("未找到您要的地址。");
					}
				}
			}
		}
	});
}


function setNaviInfo(type, lat, lng, name){
	var subFolder = "";
	if(lan=="KOR") {
		subFolder = "kor";
	}else if(lan=="ENG") {
		subFolder = "eng";
	}else if(lan=="JAN") {
		subFolder = "jpn";
	}else if(lan=="CHINAG") {
		subFolder = "chn";
	}
	
	if(type.indexOf("start")!=-1) {
		if(naviStartMk==null) {
			naviStartMk = new L.Marker(new L.LatLng(lat,lng),{icon: new L.Icon({
   	 	    	iconUrl: "/resources/common/custom/images/naviImg/"+subFolder+"/rpin_start.png",
   	 	    	iconAnchor: [15,36]
   			})}).addTo(map);
		}else {
			naviStartMk.setLatLng(new L.LatLng(lat,lng));
		}
		naviStartMk.setZIndexOffset(10000);
		if(name=="") {
			if(lan=="KOR") {
				name = "출발";
			}else if(lan=="ENG") {
				name = "Start";
			}else if(lan=="JAN") {
				name = "出発";
			}else if(lan=="CHINAG") {
				name = "出发";
			}
		}
		$("#startInput").val(name);
		startName = name;
		startCoord=lat+","+lng;
		naviTextFormFocus(type);
		
	}else if(type.indexOf("end")!=-1) {
		if(naviEndMk==null) {
			naviEndMk = new L.Marker(new L.LatLng(lat,lng),{icon: new L.Icon({
				iconUrl: "/resources/common/custom/images/naviImg/"+subFolder+"/rpin_arrival.png",
				iconAnchor: [15,36]
   			})}).addTo(map);
		}else {
			naviEndMk.setLatLng(new L.LatLng(lat,lng));
		}
		naviEndMk.setZIndexOffset(10000);
		if(name=="") {
			if(lan=="KOR") {
				name = "도착";
			}else if(lan=="ENG") {
				name = "Arrive";
			}else if(lan=="JAN") {
				name = "到着";
			}else if(lan=="CHINAG") {
				name = "到着";
			}
		}
		$("#endInput").val(name);
		endName = name;
		endCoord=lat+","+lng;
		naviTextFormFocus(type);
	}else if(type.indexOf("middle")!=-1){
		var middleCnt = parseInt(type.replace("middleInput",""));
		if(middleCnt>=naviAddTextFormCnt) {
			var check = naviAddTextForm();
			if(!check) {
				return;
			}
		}
		naviMiddleMk.push(new L.Marker(new L.LatLng(lat,lng),{icon: new L.Icon({
   			iconUrl: "/resources/common/custom/images/naviImg/"+subFolder+"/rpin_via_"+(middleCnt+1)+".png",
   			iconAnchor: [15,36]
   		})}).addTo(map));
		naviMiddleMk[naviMiddleMk.length-1].setZIndexOffset(10000);
		if(name=="") {
			if(lan=="KOR") {
				name = "경유";
			}else if(lan=="ENG") {
				name = "Via";
			}else if(lan=="JAN") {
				name = "経由";
			}else if(lan=="CHINAG") {
				name = "经由";
			}
		}
		$("#"+type).val(name);
		middleNames.set(type,name);
		middleCoords.set(type,lat+","+lng);
		naviTextFormFocus(type);
	}
	
	for(var i=0; i<$(".naviSearchInput").length; i++) {
		if($(".naviSearchInput").eq(i).val()!="") {
			textDelOn(i);
		}
	}
	
	if(startName!="" && endName!="") {
		naviStart();
	}
}


// ==================================== 길찾기 ==========================================


function naviStart(){
	if(rightClickPop!=null) {
		map.closePopup(rightClickPop);
	}
	var startInfoStr = "";
	var middleInfoStr = "";
	var endInfoStr = "";
	var startEndEqual = "";
	if(lan=="KOR") {
		startInfoStr = "출발지를 입력하세요.";
		middleInfoStr = "경유지를 입력하세요.";
		endInfoStr = "도착지를 입력하세요.";
		startEndSame = "출발지와 도착지가 같습니다.";
	}else if(lan=="ENG") {
		startInfoStr = "Input the starting place.";
		middleInfoStr = "Input the stopover place.";
		endInfoStr = "Input the destination.";
		startEndSame = "Starting point and destination are the Same.";
	}else if(lan=="JAN") {
		startInfoStr = "出発地入力";
		middleInfoStr = "経由地入力";
		endInfoStr = "目的地入力";
		startEndSame = "出発地と到着地が同じです。";
	}else if(lan=="CHINAG") {
		startInfoStr = "输入出发地";
		middleInfoStr = "输入经由地";
		endInfoStr = "输入目的地";
		startEndSame = "出发地和目的地相同。";
	}
	if(startName=="") {
		alert(startInfoStr);
	}else if(endName=="") {
		alert(endInfoStr);
	}else if(startCoord==endCoord && middleNames.size()==0) {
		alert(startEndSame);
	}else {
		$("#naviOnOff").css("display","");
		$("#naviOnOff").attr("class","ico_close naviOnOff");
		
		$("#naviFromBg").addClass("r_size");
		navi_rsize_check = true;
		middleSetTextForm();
		$("#naviSearchForm").css("display","none");
		$("#naviResultForm").css("display","block");
		$('#startEndName').html($('#startInput').val()+'<span class="p_arrow"></span>'+$('#endInput').val());
		navi_searchClear();
		naviResultClear();
		naviSubmit();
	}
}


function naviSubmit() {
	var pathFindType = $(".pathFindType:checked").val();
	var realTimeCheck = document.getElementById("realTime");
	jHeader.serviceName = "CAR_ROUTE";
	naviBody.startPoint.coordinate = startCoord;
	naviBody.endPoint.coordinate = endCoord;
	naviBody.middlePoint = [];
	if(middleCoords.size()>0) {
		for(var i=0; i<middleCoords.size(); i++) {
			naviBody.middlePoint[i] = {};
			naviBody.middlePoint[i].order = i+1;
			naviBody.middlePoint[i].coordinate = middleCoords.get(middleCoords.keySet()[i]);
			naviBody.middlePoint[i].id = i+1;
		}
	}
	naviBody.exception = "";
	naviBody.pathFindType = pathFindType;
	naviBody.middlePointAutoOrder = false;
	naviBody.realtime = false;
	
	if($(realTimeCheck).is(":checked")){
		naviBody.pathFindType = pathFindType;
		naviBody.realtime = true;
	}
	
	var jReqBody = {
		"header" : jHeader,
		"body" : naviBody
	};
	
	var dataString = "callback=?&req="+encodeURIComponent(objectToJSONString(jReqBody));
	//console.log(jUrl+"?callback=?&req="+objectToJSONString(jReqBody));
	console.log(jUrl+"?callback=?&req="+objectToJSONString(jReqBody));
	
	/*
	 * $('#lodingBg').fadeIn(500); $('#viewLoading').fadeIn(500);
	 */

	$.ajax({
		url:jUrl,
		async:true,
		type:'POST',
		dataType:'jsonp',
		data:dataString,
		timeout : 200000,
		error : function(d, textStatus, error){
			alert("다시 실행해주시기 바랍니다. code:11 \n"+"getJSON failed : "+d+",  status: " + textStatus + ",  error: "+error);
		},success: function(data, result){
			if(data.header.result=="00") {
				if(data.body.geojson != undefined){
					/*if(carRouteContent.size()==0) {
						jHeader.serviceName = "CAR_ROUTE_CONSTANT";
						var jReqBody2 = {
							"header" : jHeader,
							"body" : naviConstantBody
						};
						var dataString2 = "callback=?&req="+encodeURIComponent(objectToJSONString(jReqBody2));
						//console.log(jUrl+"?"+dataString2);
						$.ajax({
							url:jUrl,
							async:true,
							type:'POST',
							dataType:'jsonp',
							data:dataString2,
							timeout : 200000,
							error : function(d, textStatus, error){
								alert("다시 실행해주시기 바랍니다. code:11 \n"+"getJSON failed : "+d+",  status: " + textStatus + ",  error: "+error);
							},success: function(data2, result2){
								var constant = data2.body.constant;
				   				for(var i=0; i<constant.length; i++) {
				   					var desc = constant[i].desc;
				   					var code = constant[i].code;
				   					
				   					if(code!=undefined && code!=null) {
					   					for(var j=0; j<code.length; j++) {
					   						carRouteContent.set(desc+"_"+code[j].code,code[j].desc);
					   					}
				   					}
				   				}
				   				naviResult(data);
							}
						});
					}else {*/
					 	naviResult(data);
					/*}*/
				}else {
					if(lan=="KOR") {
						alert("길찾기에 실패 하였습니다.");
					}else if(lan=="ENG") {
						alert("The route search failed.");
					}else if(lan=="JAN") {
						alert("道探しに失敗しました。");
					}else if(lan=="CHINAG") {
						alert("路线搜索失败了。");
					}
				}
			}else {
				if(lan=="KOR") {
					alert("길찾기에 실패 하였습니다.");
				}else if(lan=="ENG") {
					alert("The route search failed.");
				}else if(lan=="JAN") {
					alert("道探しに失敗しました。");
				}else if(lan=="CHINAG") {
					alert("路线搜索失败了。");
				}
				/*$('#viewLoading').fadeOut(500);
   				$('#lodingBg').fadeOut(500);*/
   				// alert('데이터가 존재하지 않습니다.');
			}
		}
	});
}


function naviResult(data) {
	try{
		naviStartCheck = true;
		var list = '';
		if(data!=null && data != ""){
			var body = data.body;
			allDist = body.totalDistance;
			var dist = allDist;
			var time = body.totalTime;
			var hour = parseInt(time/3600);
			var min = parseInt((time%3600)/60);
			var middles = body.middlePoint;
			
			if(hour==0 && min==0) {
				min=1;
			}
			
			if(dist>=1000) {
				dist = toComma(dist/1000);
				$('#naviDist').html('<span>'+dist+'</span> km');
			}else {
				dist = toComma(dist);
				$('#naviDist').html('<span>'+dist+'</span> m');
			}
			
			//동적 다국어 변경
			var subFolder = "";
			if(lan=="KOR") {
				$('#naviTime').html('<span>'+hour+'</span> 시간 <span>'+min+'</span> 분');
				subFolder = "kor";
			}else if(lan=="ENG") {
				$('#naviTime').html('<span>'+hour+'</span> hr <span>'+min+'</span> min');
				subFolder = "eng";
			}else if(lan=="JAN") {
				$('#naviTime').html('<span>'+hour+'</span> 時間 <span>'+min+'</span> 分');
				subFolder = "jpn";
			}else if(lan=="CHINAG") {
				$('#naviTime').html('<span>'+hour+'</span> 时间 <span>'+min+'</span> 分');
				subFolder = "chn";
			}
			
			$("#price1").val(body.totalGatePrice[0].price);
			$("#price2").val(body.totalGatePrice[1].price);
			$("#price3").val(body.totalGatePrice[2].price);
			$("#price4").val(body.totalGatePrice[3].price);
			$("#price5").val(body.totalGatePrice[4].price);
			$("#price6").val(body.totalGatePrice[5].price);
			
			tollChange();
			
			oilChange();
			
			if(middles!=null) {
				for(var i=0,j=0; i<middles.length; i++) {
					/*if(middles[i].isRoute) {*/
						var middleCoord = middles[i].coordinate.split(",");
						naviMiddleMk.push(new L.Marker(new L.LatLng(middleCoord[0], middleCoord[1]),{icon: new L.Icon({
							iconUrl : "/resources/common/custom/images/naviImg/"+subFolder+"/rpin_via_"+(j+1)+".png",
							iconAnchor: [15,36]
				   		})}).addTo(map));
						naviMiddleMk[naviMiddleMk.length-1].popState = false;
						naviMiddleMk[naviMiddleMk.length-1].index = naviMiddleMk.length-1;
						naviMiddleMk[naviMiddleMk.length-1].bindPopup(tooltip.naviContent("middle",middleNames.get(middleNames.keySet()[i])),{autoPan:true,minWidth:362,offset:[0,-15],'className':'dawul'});
						naviMiddleMk[naviMiddleMk.length-1].setZIndexOffset(10000);
						naviMiddleMk[naviMiddleMk.length-1].on("click", function(){
							var index = this.index;
							if(this.popState) {
								this.popState = false;
							}else {
								if(rightClickPop!=null) {
									map.closePopup(rightClickPop);
								}
								this.popState = true;
								$(".naviMiddle").eq(index).addClass("on");
								naviStartMk.popState=false;
								$(".naviStart").removeClass("on");
								naviEndMk.popState=false;
								$(".naviEnd").removeClass("on");
								for(var i=0; i<naviMiddleMk.length; i++) {
									if(i!=index) {
										naviMiddleMk[i].popState=false;
										$(".naviMiddle").eq(i).removeClass("on");
									}
								}
								for(var i=0; i<naviInfoMk.length; i++) {
									naviInfoMk[i].popState = false;
									naviInfoMk[i].setZIndexOffset(100);
									
									var iconOff = new L.Icon({
										iconUrl:'/resources/common/custom/images/naviImg/num/rnum'+(i+1)+'.png',
										iconAnchor: [12,12]
									});
									naviInfoMk[i].setIcon(iconOff);
									naviLayers[i].setStyle({
										weight: 4,
										color : "#FF0000",
										opacity : 1,
										fillColor : "#FF0000",
										fillOpacity : 1
									});
									$(".naviResultIcon").eq(i).attr("src",'/resources/common/custom/images/naviImg/num/rnum'+(i+1)+'.png');
								}
								$(".naviResult").removeClass("on");
								
								for(var i=0; i<ncodeSearchMarker.length; i++) {
									ncodeSearchMarker[i].popState = false;
									ncodeSearchMarker[i].closePopup();
								}
								ncodeSelectMid = "";
								
								for(var i=0; i<jiguMarker.length; i++) {
									jiguMarker[i].popState = false;
									jiguMarker[i].closePopup();
								}
								jiguSelectMid = "";
							}
						});
						j++;
					/*}else {
						//alert("경유지 실패");
					}*/
				}
			}
			var startcoordT = body.startPoint.coordinate.split(",");
			naviStartMk = new L.Marker(new L.LatLng(startcoordT[0], startcoordT[1]),{icon: new L.Icon({
		    	iconUrl: "/resources/common/custom/images/naviImg/"+subFolder+"/rpin_start.png",
		    	iconAnchor: [15,36]
			})}).addTo(map);
			naviStartMk.popState = false;
			naviStartMk.bindPopup(tooltip.naviContent("start",startName),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
			naviStartMk.setZIndexOffset(10000);
			naviStartMk.on("click", function(){
				if(this.popState) {
					this.popState = false;
				}else {
					if(rightClickPop!=null) {
						map.closePopup(rightClickPop);
					}
					this.popState = true;
					$(".naviStart").addClass("on");
					naviEndMk.popState=false;
					$(".naviEnd").removeClass("on");
					if(naviMiddleMk.length>0) {
						for(var i=0; i<naviMiddleMk.length; i++) {
							naviMiddleMk[i].popState=false;
						}
						$(".naviMiddle").removeClass("on");
					}
					
					for(var i=0; i<naviInfoMk.length; i++) {
						naviInfoMk[i].popState = false;
						naviInfoMk[i].setZIndexOffset(100);
						
						var iconOff = new L.Icon({
							iconUrl:'/resources/common/custom/images/naviImg/num/rnum'+(i+1)+'.png',
							iconAnchor: [12,12]
						});
						naviInfoMk[i].setIcon(iconOff);
						naviLayers[i].setStyle({
							weight: 4,
							color : "#FF0000",
							opacity : 1,
							fillColor : "#FF0000",
							fillOpacity : 1
						});
						$(".naviResultIcon").eq(i).attr("src",'/resources/common/custom/images/naviImg/num/rnum'+(i+1)+'.png');
					}
					$(".naviResult").removeClass("on");
					
					for(var i=0; i<ncodeSearchMarker.length; i++) {
						ncodeSearchMarker[i].popState = false;
						ncodeSearchMarker[i].closePopup();
					}
					ncodeSelectMid = "";
					
					for(var i=0; i<jiguMarker.length; i++) {
						jiguMarker[i].popState = false;
						jiguMarker[i].closePopup();
					}
					jiguSelectMid = "";
				}
			});
		
			var endcoordT = body.endPoint.coordinate.split(",");
			naviEndMk = new L.Marker(new L.LatLng(endcoordT[0], endcoordT[1]),{icon: new L.Icon({
		    	iconUrl: "/resources/common/custom/images/naviImg/"+subFolder+"/rpin_arrival.png",
		    	iconAnchor: [15,36]
			})}).addTo(map);
			naviEndMk.popState = false;
			naviEndMk.bindPopup(tooltip.naviContent("end",endName),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
			naviEndMk.setZIndexOffset(10000);
			naviEndMk.on("click", function(){
				if(this.popState) {
					this.popState = false;
				}else {
					if(rightClickPop!=null) {
						map.closePopup(rightClickPop);
					}
					this.popState = true;
					naviStartMk.popState=false;
					$(".naviStart").removeClass("on");
					$(".naviEnd").addClass("on");
					if(naviMiddleMk.length>0) {
						for(var i=0; i<naviMiddleMk.length; i++) {
							naviMiddleMk[i].popState=false;
						}
						$(".naviMiddle").removeClass("on");
					}
					
					for(var i=0; i<naviInfoMk.length; i++) {
						naviInfoMk[i].popState = false;
						naviInfoMk[i].setZIndexOffset(100);
						
						var iconOff = new L.Icon({
							iconUrl:'/resources/common/custom/images/naviImg/num/rnum'+(i+1)+'.png',
							iconAnchor: [12,12]
						});
						naviInfoMk[i].setIcon(iconOff);
						naviLayers[i].setStyle({
							weight: 4,
							color : "#FF0000",
							opacity : 1,
							fillColor : "#FF0000",
							fillOpacity : 1
						});
						$(".naviResultIcon").eq(i).attr("src",'/resources/common/custom/images/naviImg/num/rnum'+(i+1)+'.png');
					}
					$(".naviResult").removeClass("on");
					
					for(var i=0; i<ncodeSearchMarker.length; i++) {
						ncodeSearchMarker[i].popState = false;
						ncodeSearchMarker[i].closePopup();
					}
					ncodeSelectMid = "";
					
					for(var i=0; i<jiguMarker.length; i++) {
						jiguMarker[i].popState = false;
						jiguMarker[i].closePopup();
					}
					jiguSelectMid = "";
				}
			});
			
			list += '<li class="naviStart clear" onclick="naviResult_setMapClick(this);">';
			list += '<div class="ico"><img src="/resources/common/custom/images/naviImg/'+subFolder+'/rpin_start.png" width="30" height="36" alt="" /></div>';
			list += '<div class="fl">';
			list += '<p><a href="#" class="txt">'+startName+'</a></p>';
			list += '</div>';
			list += '</li>';
			
			var features = body.geojson.features;
			var fullLineData = null;
			var fullLineDataCnt = 0;
			fullLineData = {};
			fullLineData.type="Feature";
			fullLineData.id="0";
			fullLineData.geometry={};
			fullLineData.geometry.type="LineString";
			fullLineData.geometry.coordinates=[];
			
			var middleNum = 0;
			for(var i=0; i<features.length; i++) {
				var feature = features[i];
				if (feature.geometry.type == "LineString") { // 2배열
					var coordCount = feature.geometry.coordinates.length;
					var k = fullLineDataCnt;
					var x = 0;
					var y = 0;
							
					for(var j=k,l=0; j<feature.geometry.coordinates.length+k; j++,l++) {
						if(l==0) {
							x = feature.geometry.coordinates[l][0];
							y = feature.geometry.coordinates[l][1];
						}
						fullLineData.geometry.coordinates[j]=[];
						fullLineData.geometry.coordinates[j][0] = feature.geometry.coordinates[l][0];
						fullLineData.geometry.coordinates[j][1] = feature.geometry.coordinates[l][1];
						fullLineDataCnt++;
					}

					fullLineDatas.push(feature);
					naviLayers.push(new L.GeoJSON(
						fullLineDatas[fullLineDatas.length-1], {
							style : function() {
								return {
									weight: 4,
									color : "#DF0000",
									opacity : 1,
									fillColor : "#DF0000",
									fillOpacity : 1
								};						
							}
						}).addTo(map));

					var listNumImg = '/resources/common/custom/images/naviImg/num/rnum'+(naviInfoMk.length+1)+'.png';
					var onListNumImg = '/resources/common/custom/images/naviImg/num/on/rnum'+(naviInfoMk.length+1)+'.png';
					naviInfoMk.push(new L.Marker(new L.LatLng(x, y),{icon: new L.Icon({
				    	iconUrl: listNumImg,
				    	iconAnchor: [12,12],
				    })}).addTo(map));
					naviInfoMk[naviInfoMk.length-1].popState = false;
					naviInfoMk[naviInfoMk.length-1].listNumImg = listNumImg;
					naviInfoMk[naviInfoMk.length-1].onListNumImg = onListNumImg;
					naviInfoMk[naviInfoMk.length-1].index = naviInfoMk.length-1;
					naviInfoMk[naviInfoMk.length-1].bindPopup(tooltip.naviContent("naviResult",feature),{autoPan:true,minWidth:362,offset:[0,-15],'className':'dawul'});
					
					naviInfoMk[naviInfoMk.length-1].on("click", function(){
						var index = this.index;
						if(this.popState) {
							this.popState = false;
						}else {
							if(rightClickPop!=null) {
								map.closePopup(rightClickPop);
							}
							this.popState = true;
							this.setZIndexOffset(1000);
							for(var i=0; i<naviInfoMk.length; i++) {
								if(i!=index) {
									naviInfoMk[i].popState = false;
									naviInfoMk[i].setZIndexOffset(100);
									
									var iconOff = new L.Icon({
										iconUrl:'/resources/common/custom/images/naviImg/num/rnum'+(i+1)+'.png',
										iconAnchor: [12,12]
									});
									naviInfoMk[i].setIcon(iconOff);
									naviLayers[i].setStyle({
										weight: 4,
										color : "#DF0000",
										opacity : 1,
										fillColor : "#DF0000",
										fillOpacity : 1
									});
									
									$(".naviResultIcon").eq(i).attr("src",'/resources/common/custom/images/naviImg/num/rnum'+(i+1)+'.png');
									$(".naviResult").eq(i).removeClass("on");
								}
							}
							
							for(var i=0; i<ncodeSearchMarker.length; i++) {
								ncodeSearchMarker[i].popState = false;
								ncodeSearchMarker[i].closePopup();
							}
							ncodeSelectMid = "";
							
							for(var i=0; i<jiguMarker.length; i++) {
								jiguMarker[i].popState = false;
								jiguMarker[i].closePopup();
							}
							jiguSelectMid = "";
						}
					});
					
					naviInfoMk[naviInfoMk.length-1].on("mouseover", function(){
						var index = this.index;
						var iconOn = new L.Icon({
							iconUrl:'/resources/common/custom/images/naviImg/num/on/rnum'+(index+1)+'.png',
							iconAnchor: [12,12]
						});
						this.setIcon(iconOn);
						
						for(var i=0; i<naviInfoMk.length; i++) {
							naviInfoMk[i].setZIndexOffset(100);
						}
						naviInfoMk[index].setZIndexOffset(1000);
						map.removeLayer(naviLayers[index]);
						naviLayers[index] = new L.GeoJSON(
							fullLineDatas[index], {
								style : function() {
									return {
										weight: 4,
										color : "#0100FF",
										opacity : 1,
										fillColor : "#0100FF",
										fillOpacity : 1
									};						
								}
						}).addTo(map);
						
						$(".naviResultIcon").eq(index).attr("src",'/resources/common/custom/images/naviImg/num/on/rnum'+(index+1)+'.png');
						$(".naviResult").eq(index).addClass("on");
					});
					
					naviInfoMk[naviInfoMk.length-1].on("mouseout", function(){
						if(!this.popState) {
							var index = this.index;
							var iconOff = new L.Icon({
								iconUrl:'/resources/common/custom/images/naviImg/num/rnum'+(index+1)+'.png',
								iconAnchor: [12,12]
							});
							this.setIcon(iconOff);
							map.removeLayer(naviLayers[index]);
							naviLayers[index] = new L.GeoJSON(
								fullLineDatas[index], {
									style : function() {
										return {
											weight: 4,
											color : "#DF0000",
											opacity : 1,
											fillColor : "#DF0000",
											fillOpacity : 1
										};						
									}
							}).addTo(map);
							
							$(".naviResultIcon").eq(index).attr("src",'/resources/common/custom/images/naviImg/num/rnum'+(index+1)+'.png');
							$(".naviResult").eq(index).removeClass("on");
						}
					});
					
					list += naviResultList(feature,middleNum);
					if(feature.properties.guide_type=="63") {
						middleNum++;
					}
					listHoverEvt();
				}
			}
			
			naviLayer = new L.GeoJSON(
				fullLineData, {
					style : function() {
						return {
							weight: 4,
							color : "#FF0000",
							opacity : 1,
							fillColor : "#FF0000",
							fillOpacity : 1
						};						
					}
				});
			
			map.fitBounds(naviLayer.getBounds(),{ padding: [100, 100] });
			
			list += '<li class="naviEnd clear" onclick="naviResult_setMapClick(this);">';
			list += '<div class="ico"><img src="/resources/common/custom/images/naviImg/'+subFolder+'/rpin_arrival.png" width="30" height="36" alt="" /></div>';
			list += '<div class="fl">';
			list += '<p><a href="#" class="txt">'+endName+'</a></p>';
			list += '</div>';
			list += '</li>';
		}else {
			
		}
		$('#naviResultList').html(list);
		listHoverEvt();
		/*$('#viewLoading').fadeOut(500);
		$('#lodingBg').fadeOut(500);*/
	}catch (e) {
		// TODO: handle exception
		/*$('#viewLoading').fadeOut(500);
		$('#lodingBg').fadeOut(500);*/
	}
}



function naviResultList(feature,middleNum){
	var subFolder = "";
	if(lan=="KOR") {
		subFolder = "kor";
	}else if(lan=="ENG") {
		subFolder = "eng";
	}else if(lan=="JAN") {
		subFolder = "jpn";
	}else if(lan=="CHINAG") {
		subFolder = "chn";
	}
	
	var list = '';
	var properties = feature.properties;
	var facilityType = carRouteContent.get("facilityType_"+properties.facility_type);
	var roadType = carRouteContent.get("roadType_"+properties.road_type);
	var type = carRouteContent.get("linkType_"+properties.type);
	var guideType = carRouteContent.get("guideType_"+properties.guide_type);
	var guideTypeHighway = carRouteContent.get("guideTypeHighway_"+properties.guide_type_highway);
	var crossWayName = properties.cross_way_name; 
	var dist = properties.distance;
	if(dist>=1000) {
		dist = toComma((dist/1000).toFixed(2))+"km";
	}else {
		dist = toComma(dist)+"m";
	}
	if(properties.guide_type=="63"){  //경유지부근
		list += '<li class="naviMiddle clear" onclick="naviResult_setMapClick(this);">';
		list += '<div class="ico"><img src="/resources/common/custom/images/naviImg/'+subFolder+'/rpin_via_'+(middleNum+1)+'.png" width="30" height="36" alt="" /></div>';
		list += '<div class="fl">';
		list += '<p><a href="#" class="txt">'+middleNames.get(middleNames.keySet()[middleNum])+'</a></p>';
		list += '</div>';
		list += '</li>';
	}
	list += '<li class="naviResult clear" onclick="naviResult_setMapClick(this);">';
	list += '<div class="ico"><img class="naviResultIcon" src="/resources/common/custom/images/naviImg/num/rnum'+naviInfoMk.length+'.png" width="24" height="24" alt="" /></div>';
	list += '<div class="fl">';
	list += '<p><a href="#" class="txt2">'+properties.name+'</a></p>';
	if(guideType!=null) {
		if(crossWayName!="" && lan=="KOR") {
			list += '<p class="txt3">'+crossWayName+'에서 '+guideType+' 후 '+dist+' 이동</p>';
		}else {
			if(lan=="KOR") {
				list += '<p class="txt3">'+guideType+' 후 '+dist+' 이동</p>';
			}else if(lan=="ENG") {
				list += '<p class="txt3">'+guideType+' after '+dist+'</p>';
			}else if(lan=="JAN") {
				list += '<p class="txt3">'+guideType+' 後 '+dist+' 移動</p>';
			}else if(lan=="CHINAG") {
				list += '<p class="txt3">'+guideType+' 后 '+dist+' 移动</p>';
			}
		}
	}else {
		if(lan=="KOR") {
			list += '<p class="txt3">'+dist+' 이동</p>';
		}else if(lan=="ENG") {
			list += '<p class="txt3">'+dist+'</p>';
		}else if(lan=="JAN") {
			list += '<p class="txt3">'+dist+' 移動</p>';
		}else if(lan=="CHINAG") {
			list += '<p class="txt3">'+dist+' 移动</p>';
		}
	}
	list += '</div>';
	list += '<div class="direction">';
	if(properties.guide_type=="62") {  //경로안내시작
		list += '<div><img class="naviRouteIcon" src="/resources/common/custom/images/naviImg/route/arrow_node01.png" width="33" height="24" alt="" /></div>';
	}else {
		if(guideType!=null) {
			list += '<div><img class="naviRouteIcon" src="/resources/common/custom/images/naviImg/route/arrow_node0'+properties.guide_type+'.png" width="33" height="24" alt="" /></div>';
		}else {
			list += '<div><img class="naviRouteIcon" src="/resources/common/custom/images/naviImg/route/arrow_node01.png" width="33" height="24" alt="" /></div>';
		}
	}
	list += '<div>'+dist+'</div>';
	list += '</div>';
	list += '</li>';
	
	return list;
}


function listHoverEvt() {
	$(".naviResult").hover(
	function() {
		var index = $(".naviResult").index(this);
		var iconOn = new L.Icon({
			iconUrl: naviInfoMk[index].onListNumImg,
		    iconAnchor: [12,12]
		}); 
		naviInfoMk[index].setIcon(iconOn);
		for(var i=0; i<naviInfoMk.length; i++) {
			naviInfoMk[i].setZIndexOffset(100);
		}
		naviInfoMk[index].setZIndexOffset(1000);
		map.removeLayer(naviLayers[index]);
		naviLayers[index] = new L.GeoJSON(
			fullLineDatas[index], {
				style : function() {
					return {
						weight: 4,
						color : "#0100FF",
						opacity : 1,
						fillColor : "#0100FF",
						fillOpacity : 1
					};
				}
		}).addTo(map);
		
		$(".naviResultIcon").eq(index).attr("src",'/resources/common/custom/images/naviImg/num/on/rnum'+(index+1)+'.png');
	},
	function() {
		var index = $(".naviResult").index(this);
		if(!naviInfoMk[index].popState) {
			var iconOff = new L.Icon({
				iconUrl:naviInfoMk[index].listNumImg,
			    iconAnchor: [12,12]
			}); 
			naviInfoMk[index].setIcon(iconOff);
			map.removeLayer(naviLayers[index]);
			naviLayers[index] = new L.GeoJSON(
				fullLineDatas[index], {
					style : function() {
						return {
							weight: 4,
							color : "#DF0000",
							opacity : 1,
							fillColor : "#DF0000",
							fillOpacity : 1
						};						
					}
			}).addTo(map);
			
			$(".naviResultIcon").eq(index).attr("src",'/resources/common/custom/images/naviImg/num/rnum'+(index+1)+'.png');
		}
	});
}

function naviResult_setMapClick(this_){
	if(rightClickPop!=null) {
		map.closePopup(rightClickPop);
	}
	var className = this_.className.split(" ")[0];
	var index = $("."+className).index(this_);
	if(className == "naviResult"){
		naviInfoMk[index].popState = true;
		$(".naviResult").eq(index).addClass("on");
		naviInfoMk[index].setZIndexOffset(1000);
		map.setView(naviInfoMk[index].getLatLng(), 12);
		naviInfoMk[index].openPopup();
		
		for(var i=0; i<naviInfoMk.length; i++) {
			if(i!=index) {
				naviInfoMk[i].popState = false;
				naviInfoMk[i].setZIndexOffset(100);
				
				var iconOff = new L.Icon({
					iconUrl:'/resources/common/custom/images/naviImg/num/rnum'+(i+1)+'.png',
					iconAnchor: [12,12]
				});
				naviInfoMk[i].setIcon(iconOff);
				naviLayers[i].setStyle({
					weight: 4,
					color : "#DF0000",
					opacity : 1,
					fillColor : "#DF0000",
					fillOpacity : 1
				});
				
				$(".naviResultIcon").eq(i).attr("src",'/resources/common/custom/images/naviImg/num/rnum'+(i+1)+'.png');
				$(".naviResult").eq(i).removeClass("on");
			}
		}
		
		if(naviStartMk!=null) {
			naviStartMk.popState=false;
			$(".naviStart").removeClass("on");
		}
		if(naviEndMk!=null) {
			naviEndMk.popState=false;
			$(".naviEnd").removeClass("on");
		}
		if(naviMiddleMk.length>0) {
			for(var i=0; i<naviMiddleMk.length; i++) {
				naviMiddleMk[i].popState=false;
			}
			$(".naviMiddle").removeClass("on");
		}
	}else {
		if(className == "naviStart") {
			naviStartMk.popState=true;
			$(".naviStart").addClass("on");
			map.setView(naviStartMk.getLatLng(), 12);
			naviStartMk.openPopup();
			
			if(naviEndMk!=null) {
				naviEndMk.popState=false;
				$(".naviEnd").removeClass("on");
			}
			if(naviMiddleMk.length>0) {
				for(var i=0; i<naviMiddleMk.length; i++) {
					naviMiddleMk[i].popState=false;
				}
				$(".naviMiddle").removeClass("on");
			}
		}else if(className == "naviEnd") {
			naviEndMk.popState=true;
			$(".naviEnd").addClass("on");
			map.setView(naviEndMk.getLatLng(), 12);
			naviEndMk.openPopup();
			
			if(naviStartMk!=null) {
				naviStartMk.popState=false;
				$(".naviStart").removeClass("on");
			}
			if(naviMiddleMk.length>0) {
				for(var i=0; i<naviMiddleMk.length; i++) {
					naviMiddleMk[i].popState=false;
				}
				$(".naviMiddle").removeClass("on");
			}
		}else if(className == "naviMiddle") {
			naviMiddleMk[index].popState = true;
			$(".naviMiddle").eq(index).addClass("on");
			map.setView(naviMiddleMk[index].getLatLng(), 12);
			naviMiddleMk[index].openPopup();
			
			if(naviStartMk!=null) {
				naviStartMk.popState=false;
				$(".naviStart").removeClass("on");
			}
			if(naviEndMk!=null) {
				naviEndMk.popState=false;
				$(".naviEnd").removeClass("on");
			}
			for(var i=0; i<naviMiddleMk.length; i++) {
				if(i!=index) {
					naviMiddleMk[i].popState=false;
					$(".naviMiddle").eq(i).removeClass("on");
				}
			}
		}
		
		
		if(naviInfoMk.length>0) {
			for(var i=0; i<naviInfoMk.length; i++) {
				naviInfoMk[i].popState = false;
				naviInfoMk[i].setZIndexOffset(100);
				
				var iconOff = new L.Icon({
					iconUrl:'/resources/common/custom/images/naviImg/num/rnum'+(i+1)+'.png',
					iconAnchor: [12,12]
				});
				naviInfoMk[i].setIcon(iconOff);
				naviLayers[i].setStyle({
					weight: 4,
					color : "#DF0000",
					opacity : 1,
					fillColor : "#DF0000",
					fillOpacity : 1
				});
				
				$(".naviResultIcon").eq(i).attr("src",'/resources/common/custom/images/naviImg/num/rnum'+(i+1)+'.png');
			}
			$(".naviResult").removeClass("on");
		}
	}
}


function naviResultClear() {
	if(naviStartMk!=null) {
		map.removeLayer(naviStartMk);
		naviStartMk = null;
	}
	if(naviEndMk!=null) {
		map.removeLayer(naviEndMk);
		naviEndMk = null;
	}
	while (naviMiddleMk.length>0) {
		map.removeLayer(naviMiddleMk[naviMiddleMk.length - 1]);
		naviMiddleMk.pop();
	}
	while (naviLayers.length>0) {
		map.removeLayer(naviLayers[naviLayers.length - 1]);
		naviLayers.pop();
	}
	if(naviLayer!=null) {
		map.removeLayer(naviLayer);
		naviLayer = null;
	}
	while (naviInfoMk.length>0) {
		map.removeLayer(naviInfoMk[naviInfoMk.length - 1]);
		naviInfoMk.pop();
	}
	
	while (fullLineDatas.length>0) {
		fullLineDatas.pop();
	}
	
	$("#naviResultList").html("");
	
	naviStartCheck = false;
}

// ==================================== //길찾기 ================================


//요금설정 팝업
function naviPricePopup() {
	if(lan == "KOR"){
		$("#lan_cost_Setting").html('요금설정<span><a href="#" onclick="naviPricePopupClose();"></a></span>');
		$("#lan_tollSetting").html("통행료 설정");
		$("#lan_price1").html("<span>1종 :</span> 승용차, 소형 승합차");
		$("#lan_price2").html("<span>2종 :</span> 중형 승합차, 중형 화물차");
		$("#lan_price3").html("<span>3종 :</span> 대형 승합차, 2축 대형 화물차");
		$("#lan_price4").html("<span>4종 :</span> 3축 대형 화물차");
		$("#lan_price5").html("<span>5종 :</span> 4축 이상 특수화물차");
		$("#lan_price6").html("<span>6종 :</span> 경차");
		$("#lan_gasChargeSetting").html("주유비 설정");
		$("#lan_oil").html("유종");
		$("#lan_oli_select").html("휘발유");
		$("#lan_gasoline").html("휘발유");
		$("#lan_ligthOil").html("경유");
		$("#lan_mileage").html("연료1L당 주행거리");
		$("#lan_costComplete").html("설정완료");
	}else if(lan == "ENG"){
		$("#lan_cost_Setting").html('Cost setting<span><a href="#" onclick="naviPricePopupClose();"></a></span>');
		$("#lan_tollSetting").html("Toll setting");
		$("#lan_price1").html("<span>1 kinds :</span> Cars, Small van");
		$("#lan_price2").html("<span>2 kinds :</span> Medium sized van, Medium truck");
		$("#lan_price3").html("<span>3 kinds :</span> Large van, 2 axle freight car");
		$("#lan_price4").html("<span>4 kinds :</span> 3 axle freight car");
		$("#lan_price5").html("<span>5 kinds :</span> Special truck over 4 axes");
		$("#lan_price6").html("<span>6 kinds :</span> Small car");
		$("#lan_gasChargeSetting").html("Gas charge setting");
		$("#lan_oil").html("Oil");
		$("#lan_oli_select").html("Gasoline");
		$("#lan_gasoline").html("Gasoline");
		$("#lan_ligthOil").html("Light oil");
		$("#lan_mileage").html("Fuel 1L mileage");
		$("#lan_costComplete").html("Completed setup");
	}else if(lan == "JAN"){
		$("#lan_cost_Setting").html('料金設定<span><a href="#" onclick="naviPricePopupClose();"></a></span>');
		$("#lan_tollSetting").html("通行料設定");
		$("#lan_price1").html("<span>1種 :</span> 乗用車、小型ワゴン車");
		$("#lan_price2").html("<span>2種 :</span> 中型ワゴン車、中型貨物車");
		$("#lan_price3").html("<span>3種 :</span> 大型ワゴン車、2軸の大型貨物車");
		$("#lan_price4").html("<span>4種 :</span> 3軸の大型貨物車");
		$("#lan_price5").html("<span>5種 :</span> 4軸以上特殊貨物車");
		$("#lan_price6").html("<span>6種 :</span> 軽自動車");
		$("#lan_gasChargeSetting").html("注油費設定");
		$("#lan_oil").html("有終");
		$("#lan_oli_select").html("ガソリン");
		$("#lan_gasoline").html("ガソリン");
		$("#lan_ligthOil").html("軽油");
		$("#lan_mileage").html("燃料1L当たりの走行距離");
		$("#lan_costComplete").html("設定完了");
	}else if(lan == "CHINAG"){
		$("#lan_cost_Setting").html('费用设定<span><a href="#" onclick="naviPricePopupClose();"></a></span>');
		$("#lan_tollSetting").html("通行费设定");
		$("#lan_price1").html("<span>1种 :</span> 轿车、小型面包车");
		$("#lan_price2").html("<span>2种 :</span> 中型面包车、中型货车");
		$("#lan_price3").html("<span>3种 :</span> 大型面包车、2轴大型货车");
		$("#lan_price4").html("<span>4种 :</span> 3轴大型货车");
		$("#lan_price5").html("<span>5种 :</span> 4轴以上特殊货车");
		$("#lan_price6").html("<span>6种 :</span> 轻型车");
		$("#lan_gasChargeSetting").html("加油费设定");
		$("#lan_oil").html("油种");
		$("#lan_oli_select").html("汽油");
		$("#lan_gasoline").html("汽油");
		$("#lan_ligthOil").html("轻油");
		$("#lan_mileage").html("每燃料1L车程");
		$("#lan_costComplete").html("设定完了");
	}
	
	$("#naviPricePop").css("display","");
}


//요금설정 팝업 닫기
function naviPricePopupClose() {
	tollChange();
	oilChange();
	$("#naviPricePop").css("display","none");
}

//톨게이트 통행료 설정 
function tollChange() {
	var toll = $(".price:checked").val();
	if(lan=="KOR") {
		$("#naviToll").html('통행료 : '+toll+'원');
	}else if(lan=="ENG") {
		$("#naviToll").html('Toll : '+toll+' won');
	}else if(lan=="JAN") {
		$("#naviToll").html('通行料 : '+toll+' won');
	}else if(lan=="CHINAG") {
		$("#naviToll").html('通行费 : '+toll+' won');
	}
}

//주유비 설정
function oilChange() {
	var oil = $("#oil").val();
	var mileage = $("#mileage").val();
	
	//동적 다국어 변경
	if(lan=="KOR") {
		$("#oilPrice").html("2018.03.08 기준 유가 <span>"+oil+" 원/L</span>");
		$("#naviMileage").html('주유비 : '+toComma(Math.ceil(allDist/1000/mileage*oil))+'원');
	}else if(lan=="ENG") {
		$("#oilPrice").html("2018.03.08 standard price <span>"+oil+" won/L</span>");
		$("#naviMileage").html('Gas price : '+toComma(Math.ceil(allDist/1000/mileage*oil))+' won');
	}else if(lan=="JAN") {
		$("#oilPrice").html("2018.03.08基準の原油価格 <span>"+oil+" won/L</span>");
		$("#naviMileage").html('ガソリン代 : '+toComma(Math.ceil(allDist/1000/mileage*oil))+' won');
	}else if(lan=="CHINAG") {
		$("#oilPrice").html("2018.03.08标准油价 <span>"+oil+" won/L</span>");
		$("#naviMileage").html('耗油费 : '+toComma(Math.ceil(allDist/1000/mileage*oil))+' won');
	}
	
}
