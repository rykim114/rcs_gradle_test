var infoSeedUrl1 = "https://geohash.info/api/v2/coords2gridaddress.do?"; // 위경도 좌표를 격자주소로 변환
var infoSeedUrl2 = "https://geohash.info/api/v2/gridaddress2coords.do?"; // 격자주소를 위경도 좌표로 변환
var infoSeedUrl3 = "https://geohash.info/api/v2/gagridlines.do?"; // 지도화면의 격자를 반환
var infoSeedUrl4 = "https://geohash.info/api/v2/searchgridaddress.do?"; // 격자주소를 검색

var infoSeedKey = "";

var gridFlag = false; // 격자가 on/off 인지 판별하는 플래그
var gridRightFlag = false; // 오른쪽 클릭 격자주소 보기 클릭 시 여부 판단하는 플래그

var gridCellRectangleArr = new Array(); // 셀 영역의 격자를 담는 배열
var gridBoundsRectangleArr = new Array(); // 전체 영역의 격자를 담는 배열

var gridTooltip = null;
var gridCellRectangle = null;

/**
 * 격자 버튼 ON/OFF 이벤트
 * gridFlag : false 종료, true 실행
 */
function gridDisplay(){
	if($("#naviForm").css("display") == "none") // 길찾기 비 활성화 시
	{	
		searchModeChange(0); // 검색모드 통합검색(0)
		searchReset(); // 길찾기 검색모드 종료 및 검색 초기화
		
		if(gridFlag == false){
			gridAllClear(0); // 격자주소 on/off버튼 표출 후 초기화
			
			var nowLevel = map.getZoom();
			if(nowLevel == 12 || nowLevel == 13)
			{
				$("#gridOff").css("display","none");
				$("#gridOn").css("display","");

				gridBounds();
			}
			else if(nowLevel < 12)
			{
				$("#gridPopBg").css("display",""); // 12레벨 이하일 시 팝업 표출
				
				var html_ = "";
				html_ += "<p>격자주소는 30m/20m 축척에서 확인 가능합니다.</p>";
				html_ += "<p>해당 축척으로 이동하시겠습니까?</p>";
				html_ += "<div class='btn_E'><a href='#' onclick='gridScaleCheck();'>확인</a></div>";
				
				$("#gridPopCon").html(html_);
			}
			
			gridFlag = true;
		}else if(gridFlag == true){
			gridCellClear(); // 셀 초기화
			gridBoundsClear(); // 영역 초기화
			gridTooltipClose(); // 툴팁 초기화
			
			$("#gridOff").css("display","");
			$("#gridOn").css("display","none");
			
			gridFlag = false;
		}
	}
	else if($("#naviForm").css("display") == "block") // 길찾기 활성화 시
	{
		$("#gridPopBg").css("display",""); // 길찾기에서 격자주소 화면 넘어올 시 팝업
		
		var html_ = "";
		html_ += "<p>격자주소 활성화 시 길찾기는 초기화되며,</p>";
		html_ += "<p>격자주소 화면으로 전환됩니다.</p>";
		html_ += "<div class='btn_E'><a href='#' onclick='gridScaleCheck();'>확인</a></div>";
		
		$("#gridPopCon").html(html_);
	}
	
}

/** 화면 전체 영역의 격자를 가져옴 **/
function gridBounds(){
	var bounds = map.getBounds(); // 지도의 영역
	
	var minx = bounds._northEast.lat;
	var miny = bounds._northEast.lng;
	var maxx = bounds._southWest.lat;
	var maxy = bounds._southWest.lng;
	
	var centers = map.getCenter();
	var centersLat = centers.lat;
	var centersLng = centers.lng;
	
	var dataString = "bbox=" +miny+ "," +minx+ "," +maxy+ "," +maxx+ "&key=" +infoSeedKey+ "&coords=" +centersLat+ "," +centersLng;
	$.ajax({
		url:infoSeedUrl3, // 지도 화면 영역의 격자 반환
		async:true,
		type:'POST',
		dataType:'json',
		data:dataString,
		timeout : 200000,
		error : function(d, textStatus, error){
			alert("다시 실행해주시기 바랍니다. code:11 \n"+"getJSON failed : "+d+",  status: " + textStatus + ",  error: "+error);
		},success: function(data, result){
			gridBoundsClear();
				
			var gridLines = data.gridlines;
				
			for(var i = 0; i < gridLines.length; i++){
				var maxx = gridLines[i].start_x;
				var maxy = gridLines[i].start_y;
				var minx = gridLines[i].end_x;
				var miny = gridLines[i].end_y;
					
				var maxCoordi = new Array();
				maxCoordi.push(maxy);
				maxCoordi.push(maxx);
				var minCoordi = new Array();
				minCoordi.push(miny);
				minCoordi.push(minx);
				
				var bounds = new Array();
				bounds.push(maxCoordi);
				bounds.push(minCoordi);
				
				gridBoundsRectangleArr.push(L.rectangle(bounds, {color: "#8C8C8C", weight: 0.9}).addTo(map));
			}
		}
	});
}

/** 
 * 클릭 한 위치의 격자정보 표출
 * @param lat, lng 클릭 한 위치의 위도,경도
 * @param gridRightType 우클릭 시
 */
function girdCellBounds(lat, lng, gridRightType){
	if(gridRightType == 1){ // 우클릭 시 이벤트
		map.closePopup(rightClickPop);
		
		$("#naviForm").css("display","none")
		$("#gridPopBg").css("display","none");
	}
	
	var gridCelldata = null; // 클릭한 위치에 대한 격자 데이터
	var gridRevJibunData = null; // 클릭한 위치에 대한 지번 주소 데이터
	var gridRevRoadData = null; // 클릭한 위치에 대한 도로명 주소 데이터
	
	var dataString = "coords="+ lat +","+ lng +"&key="+ infoSeedKey +"&display=full&lang=ko";
	$.ajax({
		url:infoSeedUrl1, // 위경도 좌표를 격자주소로 변환
		async:true,
		type:'POST',
		dataType:'json',
		data:dataString,
		timeout : 200000,
		error : function(d, textStatus, error){
			alert("다시 실행해주시기 바랍니다. code:11 \n"+"getJSON failed : "+d+",  status: " + textStatus + ",  error: "+error);
		},success: function(data, result){
			gridCelldata = data;
			
			jHeader.serviceName = "REVERSE_GEOCODING";
			revBody.point = lat +","+ lng;
			revBody.selectFields.geoType = "ORIGIN";
			revBody.adminType = "JIBUN_ADDRESS";
			revBody.spatialOperation = "INTERSECT";
			
			var jReqBody = {
				"header" : jHeader,
				"body" : revBody
			};
			
			var dataString = "callback=?&req="+ encodeURIComponent(objectToJSONString(jReqBody));
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
					gridRevJibunData = data;
					
					if(gridRevJibunData.body.geojson != undefined){
						var properties = gridRevJibunData.body.geojson.features[0].properties;
						
						jHeader.serviceName = "REVERSE_GEOCODING";
						revBody.point = lat +","+ lng;
						revBody.selectFields.geoType = "ORIGIN";
						revBody.adminType = "ROAD_ADDRESS";
						revBody.spatialOperation = "INTERSECT";
						
						var jReqBody = {
							"header" : jHeader,
							"body" : revBody
						};
						
						var dataString = "callback=?&req="+ encodeURIComponent(objectToJSONString(jReqBody));
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
								gridTooltipClose()
								
								gridRevRoadData = data;
								
								var middleCnt = middleCoords.size();
								if(middleNames.get("middleInput0")==null) {
									middleCnt = 0;
								}else if(middleNames.get("middleInput1")==null) {
									middleCnt = 1;
								}else if(middleNames.get("middleInput2")==null) {
									middleCnt = 2;
								}else if(middleNames.get("middleInput3")==null) {
									middleCnt = 3;
								}else if(middleNames.get("middleInput4")==null) {
									middleCnt = 4;
								}
								
								var content1 = gridCelldata.gridaddress.cityname +"."+ gridCelldata.gridaddress.gridword +"."+ gridCelldata.gridaddress.cellcode; // 클릭 한 격자 정보
								var content2 = "";
								var content3 = "";
								var content4 = "";
								var addressType = "";
								
								var html_  = "";
								html_ += '<div class="tooltip t_size">';
								html_ += '<div class="t_bx opacity">';
								html_ += '<div class="info i_size2 clear">';
								var bodyLength = Object.keys(gridRevRoadData.body).length;
								if(bodyLength > 0) // 도로명 주소가 존재
								{
									content2 = gridRevRoadData.body.geojson.features[0].properties.newrpnuname; // 도로명 주소
									//content3 = gridRevRoadData.body.geojson.features[0].properties.pnuname; // 지번 주소
									content3 = gridRevJibunData.body.geojson.features[0].properties.pnuname;
									content4= gridRevRoadData.body.geojson.features[0].properties.buildname; // 건물 명
									
									html_ += '<h3 class="clear">';
									html_ += '<span class="title3">'+ content1 +'</span>';
									html_ += '</h3>';
									html_ += '<ul class="con">';
									html_ += '<li class="txt2">도로명 : '+ content2 +'</li>';
									html_ += '<li class="txt2">지번 : '+ content3 +'</li>';
									html_ += '<li class="txt2">'+ content4 +'</li>';
									html_ += '</ul>';
									html_ += '<ul class="t_btn2 clear">';
									html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'startInput\','+ lat +','+ lng +',\''+ content2 +'\');">출발</a></li>';
									html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'middleInput'+middleCnt+'\','+ lat +','+ lng +',\''+ content2 +'\');">경유</a></li>';
									html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'endInput\','+ lat +','+ lng +',\''+ content2 +'\');">도착</a></li>';
									html_ += '</ul>';
									html_ += '<ul class="t_btn3 clear">';
									html_ += '<li class="btn_B"><a href="#" onclick="outLink(\'grid\',\'ROAD_ADDRESS\',\''+ lat +'_'+ lng +'\');");">지도복사</a></li>';
									html_ += '</ul>';
								}
								else // 도로명 주소가 미 존재
								{
									content2 = gridRevJibunData.body.geojson.features[0].properties.pnuname;
									
									html_ += '<h3 class="clear">';
									html_ += '<span class="title3">'+ content1 +'</span>';
									html_ += '</h3>';
									html_ += '<ul class="con">';
									html_ += '<li class="txt2">지번 : '+ content2 +'</li>';
									html_ += '</ul>';
									html_ += '<ul class="t_btn2 clear">';
									html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'startInput\','+lat+','+lng+',\''+content2+'\');">출발</a></li>';
									html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'middleInput'+middleCnt+'\','+lat+','+lng+',\''+content2+'\');">경유</a></li>';
									html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'endInput\','+lat+','+lng+',\''+content2+'\');">도착</a></li>';
									html_ += '</ul>';
									html_ += '<ul class="t_btn3 clear">';
									html_ += '<li class="btn_B"><a href="#" onclick="outLink(\'grid\',\'JIBUN_ADDRESS\',\''+lat+'_'+lng+'\');");");">지도복사</a></li>';
									html_ += '</ul>';
								}
								html_ += '</div>';
								html_ += '</div>';
								html_ += '<div class="t_arrow opacity"></div>';
								html_ += '<!-- 닫기 버튼 --><div class="t_close"><span><a href="#" onclick="gridTooltipClose();"></a></span></div>';
								html_ += '</div>';
								
								// 툴팁
								gridTooltip = L.popup({
									autoPanPaddingBottomRight:[75,0], offset:[-32,27.5], minWidth:168, autoPan:true, closeButton:false, 'className':'dawul'
								});
								gridTooltip.setContent(html_);
								gridTooltip.setLatLng([gridCelldata.cellcenter.lat, gridCelldata.cellcenter.lng]);
								gridTooltip.addTo(map);
								
								var maxx = gridCelldata.gridbounds.maxx;
								var maxy = gridCelldata.gridbounds.maxy;
								var minx = gridCelldata.gridbounds.minx;
								var miny = gridCelldata.gridbounds.miny;
								
								var maxCoordi = new Array();
								maxCoordi.push(maxy);
								maxCoordi.push(maxx);
								var minCoordi = new Array();
								minCoordi.push(miny);
								minCoordi.push(minx);
								
								var bounds = new Array();
								bounds.push(maxCoordi);
								bounds.push(minCoordi);
								
								gridCellRectangleArr.push(L.rectangle(bounds, {fillColor:"#F7941D",fillOpacity:0.4,color: "#F7941D",weight: 4, opacity: 1}).addTo(map));
								gridCellRectangleArr[gridCellRectangleArr.length-1].bounds = bounds;
								gridCellRectangleArr[gridCellRectangleArr.length-1].lat = gridCelldata.cellcenter.lat;
								gridCellRectangleArr[gridCellRectangleArr.length-1].lng = gridCelldata.cellcenter.lng;
								gridCellRectangleArr[gridCellRectangleArr.length-1].on("click",function(e) {
									gridTooltip.addTo(map);
								});
								
								//map.fitBounds(bounds);
								
								/*var maxx = data.cellbounds.maxx;
								var maxy = data.cellbounds.maxy;
								var minx = data.cellbounds.minx;
								var miny = data.cellbounds.miny;
								
								var maxCoordi = new Array();
								maxCoordi.push(maxy);
								maxCoordi.push(maxx);
								var minCoordi = new Array();
								minCoordi.push(miny);
								minCoordi.push(minx);
								
								var bounds = new Array();
								bounds.push(maxCoordi);
								bounds.push(minCoordi);
								
								gridCellRectangle = L.rectangle(bounds, {color: "#FF0000", weight: 2}).addTo(map);*/
							}
						}); // 도로명 주소 API 호출//
					}else{
						$("#gridPopBg").css("display","");
						
						var html_ = "";
						html_ += "<p>선택한 위치의 격자주소를 </p>";
						html_ += "<p>찾을 수 없습니다.</p>";
						html_ += "<div class='btn_E'><a href='#' onclick='gridPopClose(1)'>확인</a></div>";
						
						$("#gridPopCon").html(html_);
					}
				}
			}); // 지번 주소 API 호출 //
		}
	}); // 격자 정보 API 호출 //
}

/** 마우스 우클릭 시 격자 주소 보기 이벤트 **/
function gridRightTooltipLayout(lat, lng){
	gridRightFlag = true;
	
	gridAllClear(0);
	
	if($("#naviForm").css("display") == "block")
	{
		$("#gridPopBg").css("display","");
		
		var html_ = "";
		html_ += "<p>격자주소 활성화시 길찾기는 초기화되며,</p>";
		html_ += "<p>격자주소 화면으로 전환됩니다.</p>";
		html_ += "<div class='btn_E'><a href='#' onclick='girdCellBounds("+ lat +","+ lng +",1)'>확인</a></div>";
		
		$("#gridPopCon").html(html_);
	}
	else if($("#naviForm").css("display") == "none")
	{
		var nowLevel = map.getZoom();
		
		if(nowLevel == 12 || nowLevel == 13){
			//$("#gridOff").css("display","none");
			//$("#gridOn").css("display","");

			girdCellBounds(lat, lng, 1);
		}else if(nowLevel < 12){
			$("#gridPopBg").css("display","");
			
			var html_ = "";
			html_ += "<p>격자주소는 30m/20m 축척에서 확인 가능합니다.</p>";
			html_ += "<p>해당 축척으로 이동하시겠습니까?</p>";
			html_ += "<div class='btn_E'><a href='#' onclick='girdCellBounds(" +lat+","+ lng+",1)'>확인</a></div>";
			
			$("#gridPopCon").html(html_);
		}
		
		//gridFlag = true;
	}
}

var gridWordArr = new Array();
var gridTooltipArr = new Array();

var gridIndex = 0;
var gridTotalIndex = 0;
var gridTotalCheckCnt = 0;
var gridDotCount = 0; // 격자주소 검색 시 . 을 담는 숫자

var gridHtml_ = "";

/**
 * 격자 주소 검색 시
 */
function gridSerach(){
	var gridSearchDatas = null; // 격자주소 검색 시 데이터(격자주소의 gridword 값을 알기 위해서)
	
	var dataString = "gridword=" + searchName + "&lang=ko&lng=126.99044270833338&lat=37.40092916666667&key="+infoSeedKey;
	$.ajax({
		url:infoSeedUrl4,
		async: false,
		type:'post',
		dataType:'json',
		data:dataString,
		timeout:200000,
		error : function(d, txtStatus, error) {
			//alert("다시 실행해주시기 바랍니다. code:11 \n"+"getJSON failed : " + d + ",  status: "+ txtStatus + ",  error: " + error);
			alert("다시 검색 해 주세요.");
		},success: function(data,result){
			gridSearchDatas = data;
			var gridSearchTotalLength = gridSearchDatas.searchdatas.length; // 검색 한 격자주소의 전체 개수
				
			if(gridSearchTotalLength > 0){
				$("#address_list_more").css("display", "none");
				
				for(var i = 0 ; i < gridSearchTotalLength; i++){
					var gridWord = data.searchdatas[i].areaname + "." + data.searchdatas[i].gridword + "." + data.searchdatas[i].cellcode;
					
					gridWordArr.push(gridWord);
				}
				
				gridAjaxCommunity(0, gridSearchTotalLength);
			}else{
				$("#addressSearchForm").css("display","none");
				$("#poiSearchForm").css("display","none");
				searchListNull();
			}
		}
   });
}

function gridAjaxCommunity(gridSize, girdWordTotalCnt){
	var gridWord = gridWordArr[gridSize];
	
	gridIndex = (gridSize+1);
	gridTotalIndex = girdWordTotalCnt;
	
	var gridCellData = null; // cell 정보
	var cellCenter = null; // cell 중심좌표정보
	var gridRevJibunData = null;
	var gridRevRoadData = null;
	
	var dataString = "gridword=" + gridWord + "&key=" + infoSeedKey + "&display=full&lang=ko";
	$.ajax({
		url:infoSeedUrl2,
		async: true,
		type:'post',
		dataType:'json',
		data:dataString,
		timeout:200000,
		error : function(d, txtStatus, error) {
			alert("다시 실행해주시기 바랍니다. code:11 \n"+"getJSON failed : " + d + ",  status: "+ txtStatus + ",  error: " + error);
		},success: function(data2,result){
			cellCenter = data2.cellcenter;
			
			var dataString = "coords="+ cellCenter.lat +","+ cellCenter.lng +"&key="+ infoSeedKey +"&display=full&lang=ko";
			$.ajax({
				url:infoSeedUrl1,
				async:true,
				type:'POST',
				dataType:'json',
				data:dataString,
				timeout : 200000,
				error : function(d, textStatus, error){
					alert("다시 실행해주시기 바랍니다. code:11 \n"+"getJSON failed : "+d+",  status: " + textStatus + ",  error: "+error);
				},success: function(data, result){
					gridCellData = data;
					
					jHeader.serviceName = "REVERSE_GEOCODING";
					revBody.point = cellCenter.lat +","+ cellCenter.lng;
					revBody.selectFields.geoType = "ORIGIN";
					revBody.adminType = "JIBUN_ADDRESS";
					revBody.spatialOperation = "INTERSECT";
					
					var jReqBody = {
						"header" : jHeader,
						"body" : revBody
					};
		
					var dataString = "callback=?&req="+ encodeURIComponent(objectToJSONString(jReqBody));
					$.ajax({
						url:jUrl,
						async:false,
						type:'POST',
						dataType:'jsonp',
						data:dataString,
						timeout : 200000,
						error : function(d, textStatus, error){
							alert("다시 실행해주시기 바랍니다. code:11 \n"+"getJSON failed : "+d+",  status: " + textStatus + ",  error: "+error);
						},success: function(data3, result){
							gridRevJibunData = data3;
							
							if(gridRevJibunData.body.geojson != undefined){
								jHeader.serviceName = "REVERSE_GEOCODING";
								revBody.point = cellCenter.lat +","+ cellCenter.lng;
								revBody.selectFields.geoType = "ORIGIN";
								revBody.adminType = "ROAD_ADDRESS";
								revBody.spatialOperation = "INTERSECT";
								
								var jReqBody = {
									"header" : jHeader,
									"body" : revBody
								};
								
								var dataString = "callback=?&req="+ encodeURIComponent(objectToJSONString(jReqBody));
								$.ajax({
									url:jUrl,
									async:false,
									type:'POST',
									dataType:'jsonp',
									data:dataString,
									timeout : 200000,
									error : function(d, textStatus, error){
										alert("다시 실행해주시기 바랍니다. code:11 \n"+"getJSON failed : "+d+",  status: " + textStatus + ",  error: "+error);
									},success: function(data4, result){
										gridRevRoadData = data4;
										
										var middleCnt = middleCoords.size();
										if(middleNames.get("middleInput0")==null) {
											middleCnt = 0;
										}else if(middleNames.get("middleInput1")==null) {
											middleCnt = 1;
										}else if(middleNames.get("middleInput2")==null) {
											middleCnt = 2;
										}else if(middleNames.get("middleInput3")==null) {
											middleCnt = 3;
										}else if(middleNames.get("middleInput4")==null) {
											middleCnt = 4;
										}
										
										//var gridAddress = "["+ gridCellData.gridaddress.split(".")[0] +"] "+ gridCellData.gridaddress.split(".")[1] +"."+ gridCellData.gridaddress.split(".")[2] +"."+ gridCellData.gridaddress.split(".")[3]; // 클릭 한 격자 정보
										var gridAddress = gridCellData.gridaddress.cityname +"."+ gridCellData.gridaddress.gridword +"."+ gridCellData.gridaddress.cellcode; // 클릭 한 격자 정보
										var properties = null;
										var properties2 = null;
										
										var content1 = "";
										
										var bodyLength = Object.keys(gridRevRoadData.body).length;
										if(bodyLength > 0) // 도로명 주소가 존재
										{
											properties = gridRevRoadData.body.geojson.features[0].properties;
											
											var html_  = "";
											
											var pnuName = properties.pnuname;
											
											//html_ += '<div class="tooltip t_size" style="opacity: 0.83;">';
											html_ += '<div class="tooltip t_size">';
											html_ += '<div class="t_bx opacity">';
											html_ += '<div class="info i_size2 clear">';
											html_ += '<h3 class="clear">';
											html_ += '<span class="title3">'+ gridAddress +'</span>';
											html_ += '</h3>';
												
											var content2 = gridRevRoadData.body.geojson.features[0].properties.newrpnuname; // 도로명 주소
											//var content3 = gridRevRoadData.body.geojson.features[0].properties.pnuname; // 지번 주소
											var content3 = gridRevJibunData.body.geojson.features[0].properties.pnuname;
											var content4= gridRevRoadData.body.geojson.features[0].properties.buildname; // 건물 명
												
											html_ += '<ul class="con">';
											html_ += '<li class="txt2">도로명 : '+ content2 +'</li>';
											html_ += '<li class="txt2">지번 : '+ content3 +'</li>';
											html_ += '<li class="txt2">'+ content4 +'</li>';
											html_ += '</ul>';
											html_ += '<ul class="t_btn2 clear">';
											html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'startInput\','+ cellCenter.lat +','+ cellCenter.lng +',\''+ content2 +'\');">출발</a></li>';
											html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'middleInput'+middleCnt+'\','+ cellCenter.lat +','+ cellCenter.lng +',\''+ content2 +'\');">경유</a></li>';
											html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'endInput\','+ cellCenter.lat +','+ cellCenter.lng +',\''+ content2 +'\');">도착</a></li>';
											html_ += '</ul>';
											html_ += '<ul class="t_btn3 clear">';
											html_ += '<li class="btn_B"><a href="#" onclick="outLink(\'grid\',\'ROAD_ADDRESS\',\''+ cellCenter.lat +'_'+ cellCenter.lng +'\');");">지도복사</a></li>';
											html_ += '</ul>';
												
											html_ += '</div>';
											html_ += '</div>';
											html_ += '<div class="t_arrow opacity"></div>';
											//html_ += '<!-- 닫기 버튼 --><div class="t_close"><span><a href="#" onclick="gridTooltipClose2()"></a></span></div>';
											html_ += '</div>';
												
											// 툴팁
											gridTooltipArr.push(L.popup({
												autoPanPaddingBottomRight:[75,0], offset:[-32,27.5],minWidth:168, keepInView:false, autoPan:true, closeButton:false, 'className':'dawul'
											}));
											gridTooltipArr[gridTooltipArr.length -1].setContent(html_);
											gridTooltipArr[gridTooltipArr.length -1].setLatLng([cellCenter.lat, cellCenter.lng]);
										}
										else
										{
											properties = gridRevJibunData.body.geojson.features[0].properties;
											
											var pnuName = properties.pnuname;
											
											var html_  = "";
											
											html_ += '<div class="tooltip t_size">';
											html_ += '<div class="t_bx opacity">';
											html_ += '<div class="info i_size2 clear">';
											html_ += '<h3 class="clear">';
											html_ += '<span class="title3">'+ gridAddress +'</span>';
											html_ += '</h3>';
												
											var content2 = gridRevJibunData.body.geojson.features[0].properties.pnuname;
												
											html_ += '<ul class="con">';
											html_ += '<li class="txt2">지번 : '+ content2 +'</li>';
											html_ += '</ul>';
											html_ += '<ul class="t_btn2 clear">';
											html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'startInput\','+cellCenter.lat+','+cellCenter.lng+',\''+content2+'\');">출발</a></li>';
											html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'middleInput'+middleCnt+'\','+cellCenter.lat+','+cellCenter.lng+',\''+content2+'\');">경유</a></li>';
											html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'endInput\','+cellCenter.lat+','+cellCenter.lng+',\''+content2+'\');">도착</a></li>';
											html_ += '</ul>';
											html_ += '<ul class="t_btn3 clear">';
											html_ += '<li class="btn_B"><a href="#" onclick="outLink(\'grid\',\'JIBUN_ADDRESS\',\''+cellCenter.lat+'_'+cellCenter.lng+'\');");");">지도복사</a></li>';
											html_ += '</ul>';
											
											html_ += '</div>';
											html_ += '</div>';
											html_ += '<div class="t_arrow opacity"></div>';
											//html_ += '<!-- 닫기 버튼 --><div class="t_close"><span><a href="#" onclick="gridTooltipClose2();"></a></span></div>';
											html_ += '</div>';
												
											// 툴팁
											gridTooltipArr.push(L.popup({
												autoPanPaddingBottomRight:[75,0], offset:[-32,27.5],minWidth:168, keepInView:false, autoPan:true, closeButton:false, 'className':'dawul'
											}));
											gridTooltipArr[gridTooltipArr.length - 1].setContent(html_);
											gridTooltipArr[gridTooltipArr.length - 1].setLatLng([cellCenter.lat, cellCenter.lng]);
										}
										
										var maxx = gridCellData.gridbounds.maxx;
										var maxy = gridCellData.gridbounds.maxy;
										var minx = gridCellData.gridbounds.minx;
										var miny = gridCellData.gridbounds.miny;
										
										var maxCoordi = new Array();
										maxCoordi.push(maxy);
										maxCoordi.push(maxx);
										var minCoordi = new Array();
										minCoordi.push(miny);
										minCoordi.push(minx);
										
										var bounds = new Array();
										bounds.push(maxCoordi);
										bounds.push(minCoordi);
		
										var listMarkerImg = "/resources/common/custom/images/pin/pin_"+(gridCellRectangleArr.length+1)+".png";
										gridCellRectangleArr.push(L.rectangle(bounds, {fillColor:"#F7941D",fillOpacity:0.4,color: "#F7941D", weight: 4, opacity: 1}).addTo(map));
										gridCellRectangleArr[gridCellRectangleArr.length-1].listMarkerImg = listMarkerImg;
										gridCellRectangleArr[gridCellRectangleArr.length-1].gridIndex = (gridIndex-1);
										gridCellRectangleArr[gridCellRectangleArr.length-1].bounds = bounds;
										gridCellRectangleArr[gridCellRectangleArr.length-1].on("click",function(e) {
											
											for(var i = 0; i < gridCellRectangleArr.length; i++){
												if(i == this.gridIndex){
													$(".JusoResult").eq(this.gridIndex).addClass("on");
													gridTooltipArr[this.gridIndex].addTo(map);
												}else{
													$(".JusoResult").eq(i).removeClass("on");
													map.removeLayer(gridTooltipArr[i]);
												}
											}
										});
										
										if(gridIndex != gridTotalIndex){ // 순차적 ajax통신(순서 != 마지막순서)
											if(gridIndex == 1){ map.fitBounds(bounds); }
											
											gridHtml_ += searchList("gridSearch", properties, cellCenter.lat, cellCenter.lng, "", "", gridAddress);
											
											gridAjaxCommunity(gridIndex, gridTotalIndex);
										}else{
											gridHtml_ += searchList("gridSearch", properties, cellCenter.lat, cellCenter.lng, "", "", gridAddress);
											
											$("#poiSearchForm").css("display","none");
											searchResult("gridSearch",0,gridTotalIndex,gridHtml_,1);
										}
										
									}
								});
							}else{
								if(gridIndex == gridTotalIndex){
									gridTotalCheckCnt++;
									gridTotalIndex = gridTotalIndex - gridTotalCheckCnt;
									
									searchResult("gridSearch",0,gridTotalIndex,gridHtml_,1);
									
									$("#poiSearchForm").css("display","none");
								}else{
									gridTotalCheckCnt++;
									
									gridAjaxCommunity(gridIndex, gridTotalIndex);
								}
							}
						}
					});
				}
			});
		}
	});
}

/** 12레벨 미만일 시 12레벨로 들어가는 이벤트 **/
function gridScaleCheck(){
	$("#gridPopBg").css("display","none");
	$("#gridOff").css("display","none");
	$("#gridOn").css("display","");
	$("#m_nearby").attr("class","m_nearby");
	
	gridFlag = true;
	map.setZoom(12);
	gridBounds();
	searchModeChange(0);
	ncodePOISearchClear();
	
	map.closePopup(rightClickPop);
}

/** 전체 격자 영역 초기화 **/
function gridBoundsClear(){
	while (gridBoundsRectangleArr.length > 0) {
		map.removeLayer(gridBoundsRectangleArr[gridBoundsRectangleArr.length - 1]);
		gridBoundsRectangleArr.pop();
	}
}

/** 선택 한 격자 영역 초기화 **/
function gridCellClear(){
	while (gridCellRectangleArr.length > 0) {
		map.removeLayer(gridCellRectangleArr[gridCellRectangleArr.length - 1]);
		gridCellRectangleArr.pop();
	}
	if(gridCellRectangle != null){
		map.removeLayer(gridCellRectangle);
		gridCellRectangle = null;
	}
}

/** 팝업 초기화 **/
function gridPopClose(mode){
	if(mode == 0){
		gridFlag = false;
		
		$("#gridPopBg").css("display","none");
		$("#gridOff").css("display","");
		$("#gridOn").css("display","none");
		
		gridBoundsClear();
	}else if(mode == 1){
		$("#gridPopBg").css("display","none");
	}
}

/** 선택 한 격자 툴팁 초기화 **/
function gridTooltipClose(){
	if(gridTooltip!=null) {
		map.removeLayer(gridTooltip);
		gridTooltip = null;
	}
	
	gridCellClear();
}

function gridTooltipClose2(){
	while (gridTooltipArr.length > 0) {
		map.removeLayer(gridTooltipArr[gridTooltipArr.length - 1]);
		gridTooltipArr.pop();
	}
}

/**
 * 격자 정보 전체 초기화
 * @param mode 0 : 일반지도 1 : 일반지도 아닌 다른 하이브리드 지도
 */
function gridAllClear(mode){
	if(mode == 0){
		$("#gridForm").css("display","");
		
		if(gridRightFlag == true){
			searchModeChange(0);
			searchReset();
		}
		
		gridRightFlag = false;
	}
	else if(mode == 1)
	{
		$("#gridForm").css("display","none");
		
		if(gridWordArr.length > 0) {
			searchModeChange(0); // 검색모드 통합검색(0)
			searchReset(); // 길찾기 검색모드 종료 및 검색 초기화
		}
	}
	
	while (gridWordArr.length > 0) {
		gridWordArr.pop();
	}
	
	gridIndex = 0;
	gridTotalIndex = 0;
	gridTotalCheckCnt = 0;
	gridHtml_ = "";
	
	gridDotCount = 0;
	gridBoundsClear();
	gridCellClear();
	gridPopClose(0);
	gridTooltipClose();
	gridTooltipClose2();
	
	map.closePopup(rightClickPop);
}