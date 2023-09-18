var mapCopyMarker = null;
var mapCopyLayer = null;

function mapMarkerCopy() {   //type(0: poi , 1: extension)
	if(mapCopyType=="address") {
		copy_geoSearch();
	}else if(mapCopyType=="poi") {
		copy_poiSearch();
	}else if(mapCopyType=="theme") {
		copy_extensionSearch();
	}
	/** 190829_JIK **/
	else if(mapCopyType=="grid"){
		copy_gridSearch();
	}else if(mapCopyType=="normal"){
		var coords = mapCopyData2.split("_");
		var zoomLevel = mapCopyData1;

		if(mapCopyData3 != ""){
			if(mapCopyData3 == "2" || mapCopyData3 == "3"){
				//$("#mSetOnOff").attr("class","Mset on"); // 지도모드 버튼 on
			}
			baseMapChanges(mapCopyData3);
		}
		if(mapCopyData4 != ""){
			//$("#mSetOnOff").attr("class","Mset on"); // 지도모드 버튼 on
			
			if(mapCopyData4.split("_").length == 0){
				if(mapCopyData4.split("_")[0] == 1){
					OverMapChange(map, L.Dawul.OVERMAP_JIJUK);
					
					$("#overJibun").attr("checked",true);
				}else if(mapCopyData4.split("_")[0] == 2){
					OverMapChange(map, L.Dawul.OVERMAP_DEVELOP);
					themeJiguLayerDraw(true);
					$("#overPlan").attr("checked",true);
				}else if(mapCopyData4.split("_")[0] == 3){
					OverMapChange(map, L.Dawul.OVERMAP_YONGDO);
					
					$("#overYongdo").attr("checked",true);
				}else if(mapCopyData4.split("_")[0] == 4){
					OverMapChange(map, L.Dawul.OVERMAP_CONTOUR2);
					
					$("#overGibok").attr("checked",true);
				} 
			}else{
				for(var i = 0; i < mapCopyData4.split("_").length; i++){
					//overlayMapChanges(mapCopyData4.split("_")[i]);
					if(mapCopyData4.split("_")[i] == 1){
						OverMapChange(map, L.Dawul.OVERMAP_JIJUK);
						
						$("#overJibun").attr("checked",true);
					}else if(mapCopyData4.split("_")[i] == 2){
						OverMapChange(map, L.Dawul.OVERMAP_DEVELOP);
						themeJiguLayerDraw(true);
						$("#overPlan").attr("checked",true);
					}else if(mapCopyData4.split("_")[i] == 3){
						OverMapChange(map, L.Dawul.OVERMAP_YONGDO);
						
						$("#overYongdo").attr("checked",true);
					}else if(mapCopyData4.split("_")[i] == 4){
						OverMapChange(map, L.Dawul.OVERMAP_CONTOUR2);
						
						$("#overGibok").attr("checked",true);
					} 
				}
			}
		}
		if(mapCopyData5 != ""){
			unifiedSearch(0,1);
		}else{
			map.invalidateSize(false); // 맵 갱신
			map.setView(new L.LatLng(coords[0], coords[1]), zoomLevel); //지도 위치 이동  (좌표, 지도 레벨)
			map.invalidateSize(false); // 맵 갱신
		}
		
		if(mapCopyData6 != ""){
			gridDisplay();
		}
		
	}
}

function copy_geoSearch() {
	var coords = mapCopyData2.split("_");
	var adminType = "";
	jHeader.serviceName = "REVERSE_GEOCODING";
	revBody.point = coords[0]+","+coords[1];
	revBody.selectFields.geoType = "ORIGIN";
	revBody.adminType = mapCopyData1;
	revBody.spatialOperation = "NEARBY";
	
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
			if(data.body.geojson != undefined){
				var listCount = data.body.geojson.features.length;
				
				for(var i=0; i<listCount; i++){
					var feature = data.body.geojson.features[i];
					var centerPoint = centerCoord("GRS_80",feature.geometry);
					
					// 레이어
					mapCopyLayer = new L.GeoJSON(
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
						}).addTo(map);
					
					mapCopyLayer.on("mouseover", function(){
						  this.setStyle({opacity:1, fillOpacity:0.2});
					  });
					mapCopyLayer.on("mouseout", function(){
						  this.setStyle({opacity:1, fillOpacity:0});
					  });
					
					// 마커
					mapCopyMarker = new L.Marker(new L.LatLng(centerPoint.lat, centerPoint.lng),{icon: new L.Icon({   // 마커 찍기
						iconUrl: "/resources/common/custom/images/pin/mpin_on.png",   //핀 이미지
				    	iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
					})}).addTo(map);
					mapCopyMarker.bindPopup(tooltip.makeGeoContent(feature),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
					
					map.fitBounds(mapCopyLayer.getBounds(),{ padding: [100, 100] });   // 레이어 크기만큼 지도 레벨조정및 위치이동
					mapCopyMarker.openPopup();
				}
			}
		}
	});
}

function copy_poiSearch() {
	jHeader.serviceName = "POI";
	poiBody.crs = "GRS_80";
	poiBody.fulltext = "";
	poiBody.field = [];
	poiBody.field[0] = {};
	poiBody.field[0].name = "mid";
	poiBody.field[0].value = mapCopyData1;
	delete poiBody.page;
	delete poiBody.mbr;
	var jReqBody = {
		"header" : jHeader,
		"body" : poiBody
	};
	
	var dataString = "callback=?&req="+encodeURIComponent(objectToJSONString(jReqBody));
	//console.log(jUrl+"?callback=?&req="+objectToJSONString(jReqBody));
	//console.log(jUrl+"?"+dataString);
	
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
				var countID = data.body.geojson.features.length;
				
				for(var i = 0; i<countID; i++){
					var feature = data.body.geojson.features[i];

					var lat = feature.geometry.coordinates[0];
					var lng = feature.geometry.coordinates[1];
					
					mapCopyMarker = new L.Marker(new L.LatLng(lat , lng),{icon: new L.Icon({   // 마커 찍기
				    	iconUrl: "/resources/common/custom/images/pin/mpin_on.png",   //핀 이미지
				    	iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
					})}).addTo(map);
					
					mapCopyMarker.feature = feature;
					mapCopyMarker.bindPopup(tooltip.makePOIContent(feature),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
					mapCopyMarker.on("click", function(){
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
				}
				map.setView(mapCopyMarker.getLatLng(), 12); //지도 위치 이동  (좌표, 지도 레벨)
				mapCopyMarker.openPopup();
			}else {
				
			}
		}
	});
}


function copy_extensionSearch() {
	var contentName = tree_content_name[mapCopyData2];
	
	jHeader.serviceName = "EXTENSION_SEARCH";
	extBody.conditions = {};
	extBody.conditions.geometry = {};
	extBody.conditions.geometry.spatialOp = "INTERSECT";
	extBody.conditions.field = [];
	extBody.conditions.field[extBody.conditions.field.length] = {};
	extBody.conditions.field[extBody.conditions.field.length-1].name = tree_flag_name[mapCopyData2];
	extBody.conditions.field[extBody.conditions.field.length-1].value = mapCopyData1;
	extBody.contentName = contentName;
	extBody.selectFields.geoType = "ORIGIN";
	var jReqBody = {
		"header" : jHeader,
		"body" : extBody
	};
	delete poiBody.page;
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

				for ( var i = 0; i < countID; i++) {
					var feature = data.body.geojson.features[i];
					var x_pos = feature.properties.x_pos;
					var y_pos = feature.properties.y_pos;
					var geoWgs = Coord_Trans("utmktowgs", new PT(x_pos, y_pos));
					mapCopyMarker = new L.Marker(new L.LatLng(geoWgs.y , geoWgs.x),{icon: new L.Icon({   // 마커 찍기
				    	iconUrl: "/resources/common/custom/images/pin/mpin_on.png",   //핀 이미지
				    	iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
					})}).addTo(map);
					mapCopyMarker.feature = feature;
					mapCopyMarker.bindPopup(tooltip.themeContent(feature,mapCopyData2),{autoPan:true,minWidth:362,offset:[0,-20],'className':'dawul'});
					mapCopyMarker.on("click",function(e) {
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
						var cntCoord = feature.geometry.coordinates.length; // Coordinates 1차배열 개수
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
						mapCopyLayer = new L.GeoJSON(
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
						}).addTo(map);
					}else if(contentName=="indoor") {
						mapCopyLayer = new L.GeoJSON(
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
						}).addTo(map);
					}
				}
				map.fitBounds(mapCopyLayer.getBounds(),{ padding: [100, 100] });   // 레이어 크기만큼 지도 레벨조정및 위치이동
				mapCopyMarker.openPopup();
			}
		}
	});
}


function mapCopyClear() {
	if(mapCopyMarker!=null) {
		map.removeLayer(mapCopyMarker);
		mapCopyMarker = null;
	}
	
	if(mapCopyLayer!=null) {
		map.removeLayer(mapCopyLayer);
		mapCopyLayer = null;
	}
	
	/*while (bPoiSearchMarker.length>0) {
		map.removeLayer(bPoiSearchMarker[bPoiSearchMarker.length - 1]);
		bPoiSearchMarker.pop();
	}
	
	while (bPoiSearchMarker.length>0) {
		map.removeLayer(bPoiSearchMarker[bPoiSearchMarker.length - 1]);
		bPoiSearchMarker.pop();
	}*/
}


function outLink(type,data1,data2){
	var level = map.getZoom();
	var noParam = (location.href).split("?"); // get parameter 있을경우 제거
	noParam = (noParam[0]).split("#"); // # 있을경우 제거
	var link = noParam[0]+"?lan="+lan+"&type="+type+"&data1="+data1;
	
	if(data2!=null) {
		link += "&data2="+data2;	
	}
	$("#mapCopyUrl").val(link);
	$("#mapCopyPop").show();
	
    /*if (browser.name == 'msie') {
         window.clipboardData.setData('Text', link);
         alert('주소가 클립보드에 복사되었습니다.');
    } else {
        temp = prompt("이 지도의 주소입니다. Ctrl+C를 눌러 클립보드로 복사하세요.", link);
    }*/
}

function outLink2(type, data1,data2, data3, data4, data5, data6){
	var level = map.getZoom();
	var noParam = (location.href).split("?"); // get parameter 있을경우 제거
	noParam = (noParam[0]).split("#"); // # 있을경우 제거
	
	var mParameter = "";
	//mParameter = "lan="+lan+"&type="+type+"&data1="+data1;
	var link = noParam[0]+"?lan="+lan+"&type="+type+"&data1="+data1;
	//var link = "";
	
	if(data2!=null) {
		link += "&data2="+data2;	
		//mParameter += "&data2="+data2;
	}
	if(data3!=""){
		link += "&data3="+data3;
		//mParameter += "&data3="+data3;
	}
	if(data4!=""){
		var totalData4 = "";
		for(var i = 0; i < data4.length; i++){
			if((data4.length-1) == i){
				totalData4 += data4[i];
			}else{
				totalData4 += data4[i] + "_";
			}
		}
		link += "&data4="+totalData4;
		//mParameter += "&data4="+totalData4;
	}
	if(data5!=""){
		link += "&data5=" + data5;
		//mParameter += "&data5=" + data5;
	}
	if(data6!=""){
		link += "&data6=" + data6;
		//mParameter += "&data5=" + data5;
	}
	
	
	//link = noParam[0] + "?"+ encodeURIComponent(mParameter);
	
	$("#mapCopyUrl").val(link);
	$("#mapCopyPop").show();
	
    /*if (browser.name == 'msie') {
         window.clipboardData.setData('Text', link);
         alert('주소가 클립보드에 복사되었습니다.');
    } else {
        temp = prompt("이 지도의 주소입니다. Ctrl+C를 눌러 클립보드로 복사하세요.", link);
    }*/
}

function mapCopyPopClose() {
	$("#mapCopyPop").hide();
}

function mapCopy() {
	$("#mapCopyUrl").select();
	try {
		// The important part (copy selected text) 
		var successful = document.execCommand('copy'); 
		// if(successful) answer.innerHTML = 'Copied!'; 
		// else answer.innerHTML = 'Unable to copy!'; 
		if(successful) {
			if(lan=="KOR") {
				alert("주소가 클립보드에 복사되었습니다.");
			}else if(lan=="ENG") {
				alert("The address has been copied to the clipboard.");
			}else if(lan=="JAN") {
				alert("住所がクリップボードにコピーされました。");
			}else if(lan=="CHINAG") {
				alert("该地址已被复制到剪贴板。");
			}
		}else {
			if(lan=="KOR") {
				alert("이 브라우저는 지원하지 않습니다.\n Ctrl+C를 눌러 클립보드로 복사하세요.");	
			}else if(lan=="ENG") {
				alert("This browser is not supported.\n Please press Ctrl+C to copy it to the clipboard.");
			}else if(lan=="JAN") {
				alert("このブラウザは支援していません。\n Ctrl+Cを押してクリップボードにコピーしてください。");
			}else if(lan=="CHINAG") {
				alert("此浏览器不受支持。\n 请按Ctrl+C将它复制到剪贴板。");
			}
		}
	} catch (err) { 
		if(lan=="KOR") {
			alert("이 브라우저는 지원하지 않습니다.\n Ctrl+C를 눌러 클립보드로 복사하세요.");	
		}else if(lan=="ENG") {
			alert("This browser is not supported.\n Please press Ctrl+C to copy it to the clipboard.");
		}else if(lan=="JAN") {
			alert("このブラウザは支援していません。\n Ctrl+Cを押してクリップボードにコピーしてください。");
		}else if(lan=="CHINAG") {
			alert("此浏览器不受支持。\n 请按Ctrl+C将它复制到剪贴板。");
		}
	}
}

/** 190829_JIK **/
function copy_gridSearch(){
	gridAllClear(0);
	
	var coords = mapCopyData2.split("_");
	
	var gridCelldata = null;
	var gridRevJibunData = null;
	var gridRevRoadData = null;
	
	var url = infoSeedUrl1 +"coords="+ coords[0] +","+ coords[1] +"&key="+ infoSeedKey +"&display=full&lang=ko";
	$.getJSON(url, function(data){
		gridCelldata = data;
		
		jHeader.serviceName = "REVERSE_GEOCODING";
		revBody.point = coords[0]+","+coords[1];
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
				
				var properties = gridRevJibunData.body.geojson.features[0].properties;
				
				jHeader.serviceName = "REVERSE_GEOCODING";
				revBody.point = coords[0] +","+ coords[1];
				revBody.selectFields.geoType = "ORIGIN";
				revBody.adminType = "ROAD_ADDRESS";
				revBody.spatialOperation = "INTERSECT";
				
				var jReqBody = {
					"header" : jHeader,
					"body" : revBody
				};
				
				var dataString = "callback=?&req= "+encodeURIComponent(objectToJSONString(jReqBody));
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
						gridCellClear();
						
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
						
						var content1 = "["+ gridCelldata.gridaddress.cityname +"] "+ gridCelldata.gridaddress.gridword +"." +gridCelldata.gridaddress.cellcode;
						var content2 = "";
						var content3 = "";
						var content4 = "";
						
						var html_  = "";
						html_ += '<div class="tooltip t_size" style="opacity: 0.83;">';
						html_ += '<div class="t_bx">';
						html_ += '<div class="info i_size2 clear">';
						html_ += '<h3 class="clear">';
						html_ += '<span class="title3">'+ content1 +'</span>';
						html_ += '</h3>';
						var bodyLength = Object.keys(gridRevRoadData.body).length;
						if(bodyLength > 0){
							content2 = gridRevRoadData.body.geojson.features[0].properties.newrpnuname;
							content3 = gridRevRoadData.body.geojson.features[0].properties.pnuname;
							content4 = gridRevRoadData.body.geojson.features[0].properties.buildname;
							
							html_ += '<ul class="con">';
							html_ += '<li class="txt2">도로명 : '+ content2 +'</li>';
							html_ += '<li class="txt2">지번 : '+ content3 +'</li>';
							html_ += '<li class="txt2">'+ content4 +'</li>';
							html_ += '</ul>';
							html_ += '<ul class="t_btn2 clear">';
							html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'startInput\','+ coords[0] +','+ coords[1] +',\''+ content1 +'\');">출발</a></li>';
							html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'middleInput'+ middleCnt +'\','+ coords[0] +','+ coords[1] +',\''+ content1 +'\');">경유</a></li>';
							html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'endInput\','+ coords[0] +','+ coords[1] +',\''+ content1 +'\');">도착</a></li>';
							html_ += '</ul>';
							html_ += '<ul class="t_btn3 clear">';
							html_ += '<li class="btn_B"><a href="#" onclick="outLink(\'grid\',\'ROAD_ADDRESS\',\''+ coords[0] +'_'+ coords[1] +'\');");">지도복사</a></li>';
							html_ += '</ul>';
						}else{
							content2 = gridRevJibunData.body.geojson.features[0].properties.pnuname;
							
							html_ += '<ul class="con">';
							html_ += '<li class="txt2">지번 : '+ content2 +'</li>';
							html_ += '</ul>';
							html_ += '<ul class="t_btn2 clear">';
							html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'startInput\','+ coords[0] +','+ coords[1] +',\''+ content1 +'\');">출발</a></li>';
							html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'middleInput'+ middleCnt +'\','+ coords[0] +','+ coords[1] +',\''+ content1 +'\');">경유</a></li>';
							html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'endInput\','+ coords[0] +','+ coords[1] +',\''+ content1 +'\');">도착</a></li>';
							html_ += '</ul>';
							html_ += '<ul class="t_btn3 clear">';
							html_ += '<li class="btn_B"><a href="#" onclick="outLink(\'grid\',\'JIBUN_ADDRESS\',\''+ coords[0] +'_'+ coords[1] +'\');");");">지도복사</a></li>';
							html_ += '</ul>';
						}
						html_ += '</div>';
						html_ += '</div>';
						html_ += '<div class="t_arrow"></div>';
						html_ += '<!-- 닫기 버튼 --><div class="t_close"><span><a href="#" onclick="gridTooltipClose();"></a></span></div>';
						html_ += '</div>';
						
						gridTooltip = L.popup({
							autoPanPaddingBottomRight:[75,0], offset:[-32,27.5],minWidth:168, keepInView:false, autoPan:true, closeButton:false, 'className':'dawul'
						});
						gridTooltip.setContent(html_); // 팝업창 내용
						gridTooltip.setLatLng([coords[0], coords[1]]); // 팝업창 좌표
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
						
						gridCellRectangleArr.push(L.rectangle(bounds, {fillColor:"#F7941D",fillOpacity:0.4,color: "#F7941D", weight: 4, opacity: 1}).addTo(map));
						gridCellRectangleArr[gridCellRectangleArr.length-1].bounds = bounds;
						gridCellRectangleArr[gridCellRectangleArr.length-1].on("click",function(e) {
							gridTooltip.addTo(map);
						});
						map.fitBounds(bounds);
					}
				});
			}
		});
	});
}