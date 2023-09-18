var searchName = "";

var geoCodingSearchMarker = new Array();
var geoCodingSearchLayer = new Array();
var geoCodingSearchAreaLayer = new Array();

var subGeoCodingSearchMarker = new Array();  //서브 주소 검색 결과 마커
var subGeoCodingSearchLayer = new Array();  //서브 주소 검색 결과 레이어

var poiSearchMarker = new Array();
var poiExtensionSearchLayer = new Array();  //poi 확장 컨텐츠 레이어
var subPOISearchMarker = new Array(); //서브 poi 검색 결과 마커

var tree_content_name = ["apt","takji","indoor","hotplace","mountain","royaltomb","forest","walk","traffic","museum","zoo","garden","ski","waterpark","camping"];
var tree_flag = ["c_apt_id","c_jigu_id","c_indoor_id","c_hotplace_id","c_mountain_id","c_royaltomb_id","c_forest_id","c_walk_id","c_traffic_id","c_museum_id","c_zoo_id","c_garden_id","c_ski_id","c_waterpark_id","c_camping_id"];
var tree_flag_name = ["apt_id","jigu_id","ufid","c_hotplace_id","c_mountain_id","c_royaltomb_id","c_forest_id","c_walk_id","c_traffic_id","c_museum_id","c_zoo_id","c_garden_id","c_ski_id","c_waterpark_id","c_camping_id"];
var tree_flag_marker_img = ["dw_marker-icon_thema_building4.png","dw_marker-icon_thema_building3.png","dw_marker-icon_thema_cate5.png","dw_marker-icon_thema_cate2.png","dw_marker-icon_thema_cate4.png"];

var interval = false;
var ajaxLoding = false;



function unifiedSearch(mode, page){ // mode = 0 전체, mode = 1 주소, mode = 2 장소
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
	
	if(mapCopyData5 != ""){
		$("#inputSearch").val(mapCopyData5);
		searchName = mapCopyData5;
	}
	searchName = $("#inputSearch").val();
	
	if(searchName != ""){
		searchModeChange(0);  //통합검색 모드
		$("#searchListForm").css("display","");
		$("#unifiedSearchForm").css("display","");
		$("#inputSearchDel").css("display","");
		searchTab(mode);  //검색 탭 변경
		$("#searchNullForm").css("display","none");
		
		//동적 다국어 변경
		if(lan=="KOR") {
			$("#search_info_form").html("<span>'"+searchName+"'</span> 검색결과");	
		}else if(lan=="ENG") {
			$("#search_info_form").html("<span>'"+searchName+"'</span> Search results");
		}else if(lan=="JAN") {
			$("#search_info_form").html("<span>'"+searchName+"'</span> 検索結果");
		}else if(lan=="CHINAG") {
			$("#search_info_form").html("<span>'"+searchName+"'</span> 搜索结果");
		}
		mapCopyClear();
		searchClear();
		
		/** 190829_JIK **/
		gridAllClear(0);
		
		var gridSerachName = searchName.match(/\./g);
		if(gridSerachName != null){
			gridDotCount = gridSerachName.length;
		}
		
		if(mode!=2){
			$("#addressSearchForm").css("display","");
			if(mode==1) {
				$("#address_list_more").css("display","none");
				$("#poiSearchForm").css("display","none");
			}else {
				$("#poiSearchForm").css("display","");
			}
			/** 190829_JIK **/
			if(gridDotCount == 0){
				//geoCodingSearch(mode, page);				
			}else{ // 검색한 단어에 . 이 하나이상 일 때
				//gridSerach();				
			}
		}else{
			$("#poi_list_more").css("display","none");
			$("#addressSearchForm").css("display","none");
			$("#poiSearchForm").css("display","");
			poiSearch(mode, page);
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
		/*$("#addressSearchForm").css("display","none");
		$("#poiSearchForm").css("display","none");*/
	}		
}

function geoCodingSearchArea(addrsearchName){
	while(geoCodingSearchLayer.length > 0){
		map.removeLayer(geoCodingSearchLayer[geoCodingSearchLayer.length - 1]);
		geoCodingSearchLayer.pop();
	}
	
	jHeader.serviceName = "GEOCODING";
	geoBody.fulladdress = addrsearchName;
	geoBody.selectFields.geoType = "ORIGIN";
	geoBody.addressType = "HLS";
	var jReqBody = {
		"header" : jHeader,
		"body" : geoBody
	};
	var dataString = "callback=?&req="+encodeURIComponent(objectToJSONString(jReqBody));
	
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
				var cnt = data.body.geojson.features.length;
				var list = "";
				for(var i = 0 ; i < cnt; i++){
					var feature = data.body.geojson.features[i];
					var centerPoint = centerCoord("GRS_80",feature.geometry);
					
					var dataString = "coords="+ centerPoint.lat +","+ centerPoint.lng +"&key="+ infoSeedKey +"&display=full&lang=ko";
					$.ajax({
						url:infoSeedUrl1,
						async:false,
						type:'POST',
						dataType:'json',
						data:dataString,
						timeout : 200000,
						error : function(d, textStatus, error){
							alert("다시 실행해주시기 바랍니다. code:11 \n"+"getJSON failed : "+d+",  status: " + textStatus + ",  error: "+error);
						},success: function(data, result){
							var gridCellData = data;
							var gridAddress = gridCellData.gridaddress.cityname +"."+ gridCellData.gridaddress.gridword +"."+ gridCellData.gridaddress.cellcode; // 클릭 한 격자 정보
							
							// 레이어
							geoCodingSearchLayer.push(new L.GeoJSON(
								feature, {
									style : function() {
										return {
											weight: 2,
											dashArray: '5, 5',
											color : "orange",
											opacity : 1,
											fillColor : "orange",
											fillOpacity : 0.2
										};						
									}
								}).addTo(map));
						}
					})	
				}	
			}	
		}
	});
}


function geoCodingSearch(mode, page){	
	jHeader.serviceName = "GEOCODING";
	geoBody.fulladdress = searchName;
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
				var cnt = data.body.geojson.features.length;
				var pageCnt = 10; // 페이지당 개수
				var stIndex = (page-1)*pageCnt;
				var enIndex = (stIndex+pageCnt) < cnt ? (stIndex+pageCnt) : cnt;
				
				if(mode==0) { // 더보기 유, 무
					if(enIndex>3) {
						enIndex=3;
						$('#address_list_more').css('display', '');
					}else {
						$('#address_list_more').css('display', 'none');
					}
				}
				
				var list = "";
				for(var i = stIndex ; i < enIndex; i++){
					var feature = data.body.geojson.features[i];
					var centerPoint = centerCoord("GRS_80",feature.geometry);
						
					/** 190829_JIK **/
					var dataString = "coords="+ centerPoint.lat +","+ centerPoint.lng +"&key="+ infoSeedKey +"&display=full&lang=ko";
					$.ajax({
						url:infoSeedUrl1,
						async:false,
						type:'POST',
						dataType:'json',
						data:dataString,
						timeout : 200000,
						error : function(d, textStatus, error){
							alert("다시 실행해주시기 바랍니다. code:11 \n"+"getJSON failed : "+d+",  status: " + textStatus + ",  error: "+error);
						},success: function(data, result){
							var gridCellData = data;
							
							var gridAddress = gridCellData.gridaddress.cityname +"."+ gridCellData.gridaddress.gridword +"."+ gridCellData.gridaddress.cellcode; // 클릭 한 격자 정보
							
							// 레이어
							geoCodingSearchLayer.push(new L.GeoJSON(
									feature, {
										style : function() {
											return {
												weight: 2,
												dashArray: '5, 5',
												color : "orange",
												opacity : 1,
												fillColor : "orange",
												fillOpacity : 0.2
											};						
										}
									}).addTo(map));
							
							return;
							geoCodingSearchLayer[geoCodingSearchLayer.length-1].on("click", function(){
								for(var i=0; i<geoCodingSearchMarker.length; i++) {
									$(".JusoResult").eq(i).removeClass("on");
									geoCodingSearchMarker[i].popState = false;
									$(".JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
									var iconOn = new L.Icon({
										iconUrl:geoCodingSearchMarker[i].markerImg,
										iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
									});
									geoCodingSearchMarker[i].setIcon(iconOn);
									geoCodingSearchMarker[i].closePopup();
								}
								
								for(var i=0; i<poiSearchMarker.length; i++) {
									$(".PoiResult").eq(i).removeClass("on");
									poiSearchMarker[i].popState = false;
									$(".POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;
									var iconOn = new L.Icon({
										iconUrl:poiSearchMarker[i].markerImg,
										iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
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
								
								if(rightClickPop != null){
									map.removeLayer(rightClickPop);
								}
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
							/*var onMarkerImg = "/resources/common/custom/images/pin/mpin_on.png";*/
							var onListMarkerImg = "/resources/common/custom/images/pin/mpin_on.png";
							geoCodingSearchMarker.push(new L.Marker(new L.LatLng(centerPoint.lat, centerPoint.lng),{icon: new L.Icon({   // 마커 찍기
						    	iconUrl: markerImg,   //핀 이미지
						    	iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
							})}).addTo(map));
							geoCodingSearchMarker[geoCodingSearchMarker.length-1].markerImg = markerImg;
							geoCodingSearchMarker[geoCodingSearchMarker.length-1].listMarkerImg = listMarkerImg;
							/*geoCodingSearchMarker[geoCodingSearchMarker.length-1].onMarkerImg = onMarkerImg;*/
							/*geoCodingSearchMarker[geoCodingSearchMarker.length-1].onListMarkerImg = onListMarkerImg;*/
							geoCodingSearchMarker[geoCodingSearchMarker.length-1].gridAddress = gridAddress;
							if(i == stIndex){
								geoCodingSearchMarker[geoCodingSearchMarker.length-1].popState = true;
							}else{
								geoCodingSearchMarker[geoCodingSearchMarker.length-1].popState = false;
							}
							feature.gridAddress = gridAddress;
							geoCodingSearchMarker[geoCodingSearchMarker.length-1].feature = feature;
							geoCodingSearchMarker[geoCodingSearchMarker.length-1].index = geoCodingSearchMarker.length-1;
							geoCodingSearchMarker[geoCodingSearchMarker.length-1].bindPopup(tooltip.makeGeoContent(feature),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
							geoCodingSearchMarker[geoCodingSearchMarker.length-1].on("click", function(e) {
								var index = this.index;
								if(this.popState){
									$(".JusoResult").eq(index).removeClass("on");
									this.popState = false;
									$(".JusoResultIcon")[index].src = this.listMarkerImg;
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
											$(".JusoResult").eq(i).addClass("on");
											/*$(".JusoResultIcon")[i].src = geoCodingSearchMarker[i].onListMarkerImg;*/
											geoCodingSearchMarker[i].popState = true;
											geoCodingSearchMarker[i].setZIndexOffset(1000);
											var iconOn = new L.Icon({													
												iconAnchor: [14,33]
											});
										}else{
											$(".JusoResult").eq(i).removeClass("on");
											$(".JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
											geoCodingSearchMarker[i].popState = false;
											geoCodingSearchMarker[i].setZIndexOffset(100);
											var iconOn = new L.Icon({
												iconUrl : geoCodingSearchMarker[i].markerImg,
												iconAnchor: [14,33]
											});
										}
										/*geoCodingSearchMarker[i].setIcon(iconOn);*/											
										if(geoCodingSearchMarker[i].popState) {
											geoCodingSearchMarker[i].bindPopup(tooltip.makeGeoContent(geoCodingSearchMarker[i].feature),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
										}
									}
									
									
									for(var i=0; i<poiSearchMarker.length; i++) {
										$(".PoiResult").eq(i).removeClass("on");
										poiSearchMarker[i].popState = false;
										$(".POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;
										var iconOn = new L.Icon({
											iconUrl:poiSearchMarker[i].markerImg,
											iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
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
							
							//----------- 리스트 ---------------------------------
							var properties = feature.properties;
							list += searchList("addressSearch",properties,centerPoint.lat, centerPoint.lng,"","",gridAddress);
							//----------- //리스트 ---------------------------------
							
							if(i == (enIndex-1)){									
								searchResult("addressSearch",mode,cnt,list,page);
							}
						}
					});
				}
														
			}else{
				$("#addressSearchForm").css("display","none");
				if(mode==0) {
					poiSearch(mode, page); // 주소 없으면 장소 검색						
				}else if(mode==1) {
					searchListNull();
				}
			}
		}
	});
}


function unifiedSearch2(mode, page, lat, lng){ // mode = 0 전체, mode = 1 주소, mode = 2 장소
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
	
	if(mapCopyData5 != ""){
		$("#inputSearch").val(mapCopyData5);
		searchName = mapCopyData5;
	}
	searchName = $("#inputSearch").val();
	if(searchName != ""){
		searchModeChange(0);  //통합검색 모드
		$("#searchListForm").css("display","");
		$("#unifiedSearchForm").css("display","");
		$("#inputSearchDel").css("display","");
		searchTab(mode);  //검색 탭 변경
		$("#searchNullForm").css("display","none");
		
		//동적 다국어 변경
		if(lan=="KOR") {
			$("#search_info_form").html("<span>'"+searchName+"'</span> 검색결과");	
		}else if(lan=="ENG") {
			$("#search_info_form").html("<span>'"+searchName+"'</span> Search results");
		}else if(lan=="JAN") {
			$("#search_info_form").html("<span>'"+searchName+"'</span> 検索結果");
		}else if(lan=="CHINAG") {
			$("#search_info_form").html("<span>'"+searchName+"'</span> 搜索结果");
		}
		mapCopyClear();
		searchClear();
		
		/** 190829_JIK **/
		gridAllClear(0);
		
		var gridSerachName = searchName.match(/\./g);
		if(gridSerachName != null){
			gridDotCount = gridSerachName.length;
		}
		
		if(mode!=2){
			$("#addressSearchForm").css("display","");
			if(mode==1) {
				$("#address_list_more").css("display","none");
				$("#poiSearchForm").css("display","none");
			}else {
				$("#poiSearchForm").css("display","");
			}
			/** 190829_JIK **/
			if(gridDotCount == 0){
				//geoCodingSearch2(mode, page, lat, lng);				
			}else{ // 검색한 단어에 . 이 하나이상 일 때
				//gridSerach();				
			}
		}else{
			$("#poi_list_more").css("display","none");
			$("#addressSearchForm").css("display","none");
			$("#poiSearchForm").css("display","");
			poiSearch(mode, page);
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
		/*$("#addressSearchForm").css("display","none");
		$("#poiSearchForm").css("display","none");*/
	}		
}


function geoCodingSearch2(mode, page, lat, lng){	
		jHeader.serviceName = "GEOCODING";
		geoBody.fulladdress = searchName;
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
					var cnt = data.body.geojson.features.length;
					var pageCnt = 10; // 페이지당 개수
					var stIndex = (page-1)*pageCnt;
					var enIndex = (stIndex+pageCnt) < cnt ? (stIndex+pageCnt) : cnt;
					
					if(mode==0) { // 더보기 유, 무
						if(enIndex>3) {
							enIndex=3;
							$('#address_list_more').css('display', '');
						}else {
							$('#address_list_more').css('display', 'none');
						}
					}
					
					var list = "";
					for(var i = stIndex ; i < enIndex; i++){
						var feature = data.body.geojson.features[i];
						var centerPoint = centerCoord("GRS_80",feature.geometry);
						
						/** 190829_JIK **/
						var dataString = "coords="+ centerPoint.lat +","+ centerPoint.lng +"&key="+ infoSeedKey +"&display=full&lang=ko";
						$.ajax({
							url:infoSeedUrl1,
							async:false,
							type:'POST',
							dataType:'json',
							data:dataString,
							timeout : 200000,
							error : function(d, textStatus, error){
								alert("다시 실행해주시기 바랍니다. code:11 \n"+"getJSON failed : "+d+",  status: " + textStatus + ",  error: "+error);
							},success: function(data, result){
								var gridCellData = data;
								
								var gridAddress = gridCellData.gridaddress.cityname +"."+ gridCellData.gridaddress.gridword +"."+ gridCellData.gridaddress.cellcode; // 클릭 한 격자 정보
								
								// 레이어
								geoCodingSearchLayer.push(new L.GeoJSON(
										feature, {
											style : function() {
												return {
													weight: 2,
													dashArray: '5, 5',
													color : "black",
													opacity : 1,
													fillColor : "black",
													fillOpacity : 0
												};						
											}
										}).addTo(map));
								
								return;
								geoCodingSearchLayer[geoCodingSearchLayer.length-1].on("click", function(){
									for(var i=0; i<geoCodingSearchMarker.length; i++) {
										$(".JusoResult").eq(i).removeClass("on");
										geoCodingSearchMarker[i].popState = false;
										$(".JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
										var iconOn = new L.Icon({
											iconUrl:geoCodingSearchMarker[i].markerImg,
											iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
										});
										geoCodingSearchMarker[i].setIcon(iconOn);
										geoCodingSearchMarker[i].closePopup();
									}
									
									for(var i=0; i<poiSearchMarker.length; i++) {
										$(".PoiResult").eq(i).removeClass("on");
										poiSearchMarker[i].popState = false;
										$(".POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;
										var iconOn = new L.Icon({
											iconUrl:poiSearchMarker[i].markerImg,
											iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
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
									
									if(rightClickPop != null){
										map.removeLayer(rightClickPop);
									}
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
								/*var onMarkerImg = "/resources/common/custom/images/pin/mpin_on.png";*/
								var onListMarkerImg = "/resources/common/custom/images/pin/mpin_on.png";
								geoCodingSearchMarker.push(new L.Marker(new L.LatLng(centerPoint.lat, centerPoint.lng),{icon: new L.Icon({   // 마커 찍기
							    	iconUrl: markerImg,   //핀 이미지
							    	iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
								})}).addTo(map));
								geoCodingSearchMarker[geoCodingSearchMarker.length-1].markerImg = markerImg;
								geoCodingSearchMarker[geoCodingSearchMarker.length-1].listMarkerImg = listMarkerImg;
								/*geoCodingSearchMarker[geoCodingSearchMarker.length-1].onMarkerImg = onMarkerImg;*/
								/*geoCodingSearchMarker[geoCodingSearchMarker.length-1].onListMarkerImg = onListMarkerImg;*/
								geoCodingSearchMarker[geoCodingSearchMarker.length-1].gridAddress = gridAddress;
								if(i == stIndex){
									geoCodingSearchMarker[geoCodingSearchMarker.length-1].popState = true;
								}else{
									geoCodingSearchMarker[geoCodingSearchMarker.length-1].popState = false;
								}
								feature.gridAddress = gridAddress;
								geoCodingSearchMarker[geoCodingSearchMarker.length-1].feature = feature;
								geoCodingSearchMarker[geoCodingSearchMarker.length-1].index = geoCodingSearchMarker.length-1;
								geoCodingSearchMarker[geoCodingSearchMarker.length-1].bindPopup(tooltip.makeGeoContent(feature),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
								geoCodingSearchMarker[geoCodingSearchMarker.length-1].on("click", function(e) {
									var index = this.index;
									if(this.popState){
										$(".JusoResult").eq(index).removeClass("on");
										this.popState = false;
										$(".JusoResultIcon")[index].src = this.listMarkerImg;
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
												$(".JusoResult").eq(i).addClass("on");
												/*$(".JusoResultIcon")[i].src = geoCodingSearchMarker[i].onListMarkerImg;*/
												geoCodingSearchMarker[i].popState = true;
												geoCodingSearchMarker[i].setZIndexOffset(1000);
												var iconOn = new L.Icon({													
													iconAnchor: [14,33]
												});
											}else{
												$(".JusoResult").eq(i).removeClass("on");
												$(".JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
												geoCodingSearchMarker[i].popState = false;
												geoCodingSearchMarker[i].setZIndexOffset(100);
												var iconOn = new L.Icon({
													iconUrl : geoCodingSearchMarker[i].markerImg,
													iconAnchor: [14,33]
												});
											}
											/*geoCodingSearchMarker[i].setIcon(iconOn);*/											
											if(geoCodingSearchMarker[i].popState) {
												geoCodingSearchMarker[i].bindPopup(tooltip.makeGeoContent(geoCodingSearchMarker[i].feature),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
											}
										}
										
										
										for(var i=0; i<poiSearchMarker.length; i++) {
											$(".PoiResult").eq(i).removeClass("on");
											poiSearchMarker[i].popState = false;
											$(".POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;
											var iconOn = new L.Icon({
												iconUrl:poiSearchMarker[i].markerImg,
												iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
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
								
								//----------- 리스트 ---------------------------------
								var properties = feature.properties;
								list += searchList("addressSearch",properties,centerPoint.lat, centerPoint.lng,"","",gridAddress);
								//----------- //리스트 ---------------------------------
								
								if(i == (enIndex-1)){									
									searchResult("addressSearch",mode,cnt,list,page);
								}
							}
						});
					}
															
				}else{
					$("#addressSearchForm").css("display","none");
					if(mode==0) {
						poiSearch(mode, page); // 주소 없으면 장소 검색						
					}else if(mode==1) {
						searchListNull();
					}
				}
			}
		});	
}


function searchTab(mode) {  //mode (0: 전체 , 1: 주소 , 2: 장소)
	$("#search_tab > li").each(function(index,e) {
		if(index==mode) {
			$(e).addClass("on");
			$(e).removeClass("off");
		}else {
			$(e).addClass("off");
			$(e).removeClass("on");
		}
	});
}


//주소 페이징 
function jusoPaging(pageNum, totalCnt){
	var startPageNum = pageNum - ((pageNum-1)%5);
	var maxPageNum = Math.ceil(totalCnt/10);
	var pagingList = "";
	
	pagingList += '<div class="tc" style="margin-top:10px;">';
	pagingList += '<div class="page clear">';
		
	if(pageNum>5){
		pagingList += '<span class="off arrow"><span><a href="#" onclick="unifiedSearch(1, '+(startPageNum-1)+')">&lt;</a></span></span>';
	}
	for(var i=0; i<5; i++)
	{
		if(i+startPageNum<=maxPageNum) {	
			if(i+startPageNum==pageNum) {
				pagingList += '<span class="on">'+(i+startPageNum)+'</span>';
			}else {
				pagingList += '<span class="off" onclick="unifiedSearch(1, '+(i+startPageNum)+')"><a href="#">'+(i+startPageNum)+'</a></span>';
			}
		}
	}
	if(maxPageNum>=startPageNum+5)
	{
		pagingList += '<span class="off arrow"><span><a href="#" onclick="unifiedSearch(1, '+(startPageNum+5)+')">&gt;</a></span></span>';
	}
	
	pagingList += "</div>";
	pagingList += "</div>";
	
	return pagingList;
}


function subGeoSearch(code,geoType,page) {
	
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
					if(geoType=='ORIGIN')   //레이어 지도에 표현
					{	
						if(feature.geometry != null){
							var centerPoint = centerCoord("GRS_80",feature.geometry);  //센터좌표 구하기
							
							var markerImg = "/resources/common/custom/images/pin/mpin_s"+(subGeoCodingSearchMarker.length+1)+".png";
							var listMarkerImg = "/resources/common/custom/images/pin/pin_s"+(subGeoCodingSearchMarker.length+1)+".png";
							subGeoCodingSearchMarker.push(new L.Marker(new L.LatLng(centerPoint.lat, centerPoint.lng),{icon: new L.Icon({   // 마커 찍기
						    	iconUrl: markerImg,   //핀 이미지
						    	iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
							})}));
							
							subGeoCodingSearchMarker[subGeoCodingSearchMarker.length-1].feature = feature;
							subGeoCodingSearchMarker[subGeoCodingSearchMarker.length-1].index = subGeoCodingSearchMarker.length-1;
							subGeoCodingSearchMarker[subGeoCodingSearchMarker.length-1].markerImg = markerImg;
							subGeoCodingSearchMarker[subGeoCodingSearchMarker.length-1].listMarkerImg = listMarkerImg;
							subGeoCodingSearchMarker[subGeoCodingSearchMarker.length-1].bindPopup(tooltip.makeGeoContent(feature),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
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
							
							
							//----------- 리스트 ---------------------------------
							var properties = feature.properties;
							list += subGeoSearchList(i,properties,centerPoint.lat,centerPoint.lng);
							//----------- //리스트 ---------------------------------
						}
					}
				}
				list += subGeoPaging(page, totalCnt, code);
				$("#"+code).html(list);
			}else {
				
			}
		}
	});
}


function subGeoPaging(pageNum, totalCnt, code)
{
	var startPageNum = pageNum-((pageNum-1)%5);
	var maxPageNum = Math.ceil(totalCnt/10);// 페이지 갯수
	var subPagingList="";
	
	
	subPagingList += '<div class="tc" style="margin-top:10px;">';
	subPagingList += '<div class="page clear">';
	if(pageNum>5) {
		subPagingList += '<span class="off arrow"><span><a href="#" onclick="subMenuSlide(\'addressSearch\',\''+code+'\',1,'+(startPageNum-1)+');">&lt;</a></span></span>';
	}
	for(var i=0; i<5; i++) {	
		if(i+startPageNum<=maxPageNum) {	
			if(i+startPageNum==pageNum) {
				subPagingList += '<span class="on">'+(i+startPageNum)+'</span>';
			}else {
				subPagingList += '<span class="off" onclick="subMenuSlide(\'addressSearch\',\''+code+'\',1,'+(i+startPageNum)+');"><a href="#">'+(i+startPageNum)+'</a></span>';
			}
		}
	}
	if(maxPageNum>=startPageNum+5)
	{
		subPagingList += '<span class="off arrow"><span><a href="#" onclick="subMenuSlide(\'addressSearch\',\''+code+'\',1,'+(startPageNum+5)+');">&gt;</a></span></span>';
	}
	subPagingList += '</div>';
	subPagingList += '</div>';
    return subPagingList;
}


function poiSearch(mode, page){
	jHeader.serviceName = "POI";
	poiBody.crs = "GRS_80";
	poiBody.fulltext = searchName;
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
	console.log(jUrl+"?callback=?&req="+objectToJSONString(jReqBody));
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
					if(totalCnt>5) {
						$('#poi_list_more').css('display', 'block');
					}else {
						$('#poi_list_more').css('display', 'none');
					}
				}
				var list = "";
				for(var i=0; i<countID; i++) {
					var feature = data.body.geojson.features[i];
					/*if(feature.properties.name!="") {*/
						var centerX = feature.geometry.coordinates[0];
						var centerY = feature.geometry.coordinates[1];
						
						var contentName = "";
						var themeName = "";
						var treeFlag = "";
						var themeId = "";
						if(lan=="KOR" && (feature.properties.c_tree_flag=="1" || feature.properties.c_tree_flag=="2" || feature.properties.c_tree_flag=="3"))  //1 : 아파트, 2 : 개발지구 , 3 : 실내지도
						{
							for(var j=0; j<tree_flag.length; j++)
							{
								if(feature.properties.c_tree_flag==j+1)
								{
									contentName = tree_content_name[j];
									themeName = tree_flag_name[j];
									treeFlag = tree_flag[j];
									themeId = eval("feature.properties."+treeFlag);
									/*if(j<tree_flag_marker_img.length) {
										markerImg = tree_flag_marker_img[j]; 
									}*/
									break;
								}
							}
							if(themeId!="-2147483648" && themeId!="" && themeId!=0) {
								themeflag(feature,contentName,themeName,themeId);
							}else {
								poiflag(feature);
							}
						}else {
							poiflag(feature);
						}
						//----------- 리스트 ---------------------------------
						var properties = feature.properties;
						list += searchList("POISearch",properties,centerX,centerY,themeId,treeFlag,"");  //themeId,treeFlag : poi 확장컨텐츠가 있을때만 사용
						//----------- //리스트 ---------------------------------
					/*}*/
				}

				searchResult("POISearch",mode,totalCnt,list,page);
			}else {
				$("#poiSearchForm").css("display","none");
				if((mode==0 && geoCodingSearchMarker.length==0) || mode==2) {
					searchListNull();
				}else {
					
				}
			}
		}
	});
}
// poi 페이징 
function poiPaging(pageNum, totalCnt){

	var startPageNum = pageNum - ((pageNum-1)%5);
	var maxPageNum = Math.ceil(totalCnt/10);
	var PoiPagingList = "";
	
	PoiPagingList += '<div class="tc" style="margin-top:10px;">';
	PoiPagingList += '<div class="page clear">';
	if(pageNum>5){
		PoiPagingList += '<span class="off arrow"><span><a href="#" onclick="unifiedSearch(2, '+(startPageNum-1)+')">&lt;</a></span></span>';
	}
	for(var i=0; i<5; i++)
	{
		if(i+startPageNum<=maxPageNum) {	
			if(i+startPageNum==pageNum) {
				//PoiPagingList += '<span class="on" onclick="unifiedSearch(2, '+(i+startPageNum)+');"><a href="#">'+(i+startPageNum)+'</a></span>';
				PoiPagingList += '<span class="on">'+(i+startPageNum)+'</span>';
			}else {
				PoiPagingList += '<span class="off" onclick="unifiedSearch(2, '+(i+startPageNum)+')"><a href="#">'+(i+startPageNum)+'</a></span>';
			}
		}
	}
	if(maxPageNum>=startPageNum+5)
	{
		//pagingList += "<li><a href='#' onclick='unifiedSearch(1,"+(startPageNum+5)+");'><img src='./img/dw_arrow_right.png' alt='뒤로' /></a></li>";
		PoiPagingList += '<span class="off arrow"><span><a href="#" onclick="unifiedSearch(2, '+(startPageNum+5)+')">&gt;</a></span></span>';
	}
	PoiPagingList += "</div>";
	PoiPagingList += "</div>";
	return PoiPagingList;
}


function poiflag(feature) {
	
	var markerImg = "/resources/common/custom/images/pin/mpin_poi_"+(poiSearchMarker.length+1)+".png";
	var listMarkerImg = "/resources/common/custom/images/pin/pin_poi_"+(poiSearchMarker.length+1)+".png";
	var tooltipIconImg = "/resources/common/custom/images/num/num_"+(poiSearchMarker.length+1)+".png";
	poiSearchMarker.push(new L.Marker(new L.LatLng(feature.geometry.coordinates[0], feature.geometry.coordinates[1]),{icon: new L.Icon({   // 마커 찍기
    	iconUrl: markerImg,   //핀 이미지
    	iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
	})}).addTo(map));
	poiSearchMarker[poiSearchMarker.length-1].popState=false;
	poiSearchMarker[poiSearchMarker.length-1].feature = feature;
	poiSearchMarker[poiSearchMarker.length-1].index = poiSearchMarker.length-1;
	poiSearchMarker[poiSearchMarker.length-1].markerImg = markerImg;
	poiSearchMarker[poiSearchMarker.length-1].listMarkerImg = listMarkerImg;
	poiSearchMarker[poiSearchMarker.length-1].tooltipIconImg = tooltipIconImg;
	poiSearchMarker[poiSearchMarker.length-1].bindPopup(tooltip.makePOIContent(feature,tooltipIconImg),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
	poiSearchMarker[poiSearchMarker.length-1].on("click",function(e) {
		var index = this.index;
		if(this.popState) {
			$(".PoiResult").eq(index).removeClass("on");
			this.popState = false;
			$(".POIResultIcon")[index].src = this.listMarkerImg;
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
					$(".PoiResult").eq(i).addClass("on");
					$(".POIResultIcon")[i].src = "/resources/common/custom/images/pin/pin_on.png";
					poiSearchMarker[i].popState = true;
					poiSearchMarker[i].setZIndexOffset(1000);
					iconOn = new L.Icon({
						iconUrl:"/resources/common/custom/images/pin/mpin_on.png",
						iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
					});
				}else {
					$(".PoiResult").eq(i).removeClass("on");
					$(".POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;
					poiSearchMarker[i].popState = false;
					poiSearchMarker[i].setZIndexOffset(100);
					iconOn = new L.Icon({
						iconUrl:poiSearchMarker[i].markerImg,
						iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
					});
				}
				poiSearchMarker[i].setIcon(iconOn);
				
				if(poiSearchMarker[i].popState) {
					poiSearchMarker[i].bindPopup(tooltip.makePOIContent(poiSearchMarker[i].feature,poiSearchMarker[i].tooltipIconImg),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
				}
			}
			
			for(var i=0; i<geoCodingSearchMarker.length; i++) {
				$(".JusoResult").eq(i).removeClass("on");
				$(".JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
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


function themeflag(poiFeature,contentName,themeName,themeId) {
	var markerImg = "/resources/common/custom/images/pin/mpin_poi_son.png";
	var listMarkerImg = "/resources/common/custom/images/pin/pin_poi_son.png";
	var tooltipIconImg = "/resources/common/custom/images/num/num_"+(poiSearchMarker.length+1)+".png";
	poiSearchMarker.push(new L.Marker(new L.LatLng(poiFeature.geometry.coordinates[0], poiFeature.geometry.coordinates[1]),{icon: new L.Icon({   // 마커 찍기
    	iconUrl: markerImg,   //핀 이미지
    	iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
	})}).addTo(map));
	var poiSearchMarkerIndex = poiSearchMarker.length-1;
	poiSearchMarker[poiSearchMarker.length-1].popState=false;
	poiSearchMarker[poiSearchMarker.length-1].markerImg = markerImg;
	poiSearchMarker[poiSearchMarker.length-1].listMarkerImg = listMarkerImg;
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
					poiSearchMarker[poiSearchMarkerIndex].bindPopup(tooltip.themeContent(feature,parseInt(poiFeature.properties.c_tree_flag)-1,poiSearchMarker[poiSearchMarkerIndex].tooltipIconImg),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
					poiSearchMarker[poiSearchMarkerIndex].on("click",function(e) {
						var index = this.index;
						if(this.popState) {
							$(".PoiResult").eq(index).removeClass("on");
							this.popState = false;
							$(".POIResultIcon")[index].src = this.listMarkerImg;
							var iconOn = new L.Icon({
								iconUrl:this.markerImg,
								iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
							});
							this.setIcon(iconOn);
						}else {
							for(var i=0; i<poiSearchMarker.length; i++) {
								var iconOn = null;
								if(i==index) {
									$(".PoiResult").eq(i).addClass("on");
									$(".POIResultIcon")[i].src = "/resources/common/custom/images/pin/pin_on.png";
									poiSearchMarker[i].popState = true;
									poiSearchMarker[i].setZIndexOffset(1000);
									
									iconOn = new L.Icon({
										iconUrl:"/resources/common/custom/images/pin/mpin_on.png",
										iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
									});
								}else {
									$(".PoiResult").eq(i).removeClass("on");
									$(".POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;
									poiSearchMarker[i].popState = false;
									poiSearchMarker[i].setZIndexOffset(100);
									
									iconOn = new L.Icon({
										iconUrl:poiSearchMarker[i].markerImg,
										iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
									});
								}
								poiSearchMarker[i].setIcon(iconOn);
								
								if(poiSearchMarker[i].popState) {
									poiSearchMarker[i].bindPopup(tooltip.themeContent(feature,parseInt(poiFeature.properties.c_tree_flag)-1,poiSearchMarker[i].tooltipIconImg),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
								}
							}
							
							for(var i=0; i<geoCodingSearchMarker.length; i++) {
								$(".JusoResult").eq(i).removeClass("on");
								$(".JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
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



function subPOISearch(code,page,treeFlag,parentIndex) {
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
					subPOISearchMarker.push(new L.Marker(new L.LatLng(centerX, centerY),{icon: new L.Icon({   // 마커 찍기
				    	iconUrl: markerImg,   //핀 이미지
				    	iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
					})}).addTo(map));
					subPOISearchMarker[subPOISearchMarker.length-1].popState=false;
					subPOISearchMarker[subPOISearchMarker.length-1].feature = feature;
					subPOISearchMarker[subPOISearchMarker.length-1].index = subPOISearchMarker.length-1;
					subPOISearchMarker[subPOISearchMarker.length-1].markerImg = markerImg;
					subPOISearchMarker[subPOISearchMarker.length-1].listMarkerImg = listMarkerImg;
					subPOISearchMarker[subPOISearchMarker.length-1].tooltipIconImg = tooltipIconImg;
					subPOISearchMarker[subPOISearchMarker.length-1].bindPopup(tooltip.makePOIContent(feature,tooltipIconImg),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
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
					
					//----------- 리스트 ---------------------------------
					var properties = feature.properties;
					list += subPOISearchList(i,properties,centerX,centerY);
					//----------- //리스트 ---------------------------------
				}
				
				list += subPOIPaging(page,totalCnt,treeFlag,code,parentIndex);
				
				$("#"+code).html(list);
				
				$(".subPOIResult").hover(
					function() {
						var index = $(".subPOIResult").index(this);
						for(var i=0; i<subPOISearchMarker.length; i++) {
							if(i==index) {
								subPOISearchMarker[i].setZIndexOffset(1000);
							}else {
								subPOISearchMarker[i].setZIndexOffset(100);
							}
						}
					},function() {
						var index = $(".subPOIResult").index(this);
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

function subPOIPaging(pageNum, totalCnt, treeFlag, code, parentIndex)
{
	var startPageNum = pageNum-((pageNum-1)%5);
	var maxPageNum = Math.ceil(totalCnt/10);// 페이지 갯수
	var subPagingList="";
	subPagingList += '<div class="tc" style="margin-top:10px;">';
	subPagingList += '<div class="page clear">';
	if(pageNum>5) {
		subPagingList += '<span class="off arrow"><span><a href="#" onclick="subMenuSlide(\'POISearch\',\''+code+'\',1,'+(startPageNum-1)+','+parentIndex+',\''+treeFlag+'\');">&lt;</a></span></span>';
	}
	for(var i=0; i<5; i++) {	
		if(i+startPageNum<=maxPageNum) {	
			if(i+startPageNum==pageNum) {
				subPagingList += '<span class="on">'+(i+startPageNum)+'</span>';
			}else {
				subPagingList += '<span class="off" onclick="subMenuSlide(\'POISearch\',\''+code+'\',1,'+(i+startPageNum)+','+parentIndex+',\''+treeFlag+'\');"><a href="#">'+(i+startPageNum)+'</a></span>';
			}
		}
	}
	if(maxPageNum>=startPageNum+5)
	{
		subPagingList += '<span class="off arrow"><span><a href="#" onclick="subMenuSlide(\'POISearch\',\''+code+'\',1,'+(startPageNum+5)+','+parentIndex+',\''+treeFlag+'\');">&gt;</a></span></span>';
	}
	subPagingList += '</div>';
	subPagingList += '</div>';
    return subPagingList;
}


//동적 리스트 테이블 생성
function searchList(param, properties, lat, lng, themeId, treeFlag, gridAddress)
{	
	var content1 = "";
	var content2 = "";
	var content3 = "";
	var content4 = "";
	var content5 = "";
	var middleSize = middleCoords.size();
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
			/** 190829_JIK **/
			content5 = gridAddress;
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
			/** 190829_JIK **/
			content5 = gridAddress;
		}
		
		var list='';
		list += '<div class="JusoResult list clear" onclick="setMapClick(this);"><!-- class on : 리스트 on 상태 -->';
		list += '<!-- pin --><div class="pin"><img class="JusoResultIcon" src="'+geoCodingSearchMarker[geoCodingSearchMarker.length-1].listMarkerImg+'" width="20" height="24" alt="" /></div>';
		list += '<dl>';
		list += '<dt>'+content1+'</dt>';
		if(content2!="" && addrType == "road") {
			//list += '<dd class="txt2">'+content2+'</dd>';
		}
		if(content3!="") {
			list += '<dd class="blank"></dd>';
			list += '<dd class="txt2">'+content3+'</dd>';
		}
		if(content5 != ""){ /** 190829_JIK **/
			list += '<dd class="blank"></dd>';
			if(lan=="KOR"){
				list += '<dd class="txt2">격자주소 : '+content5+'</dd>';
			}
		}
		if(addrType == "road") { //도로
			list += '<dd class="sub_address plus"><a href="#" onclick="stopProp(); subMenuSlide(\'addressSearch\',\''+content2+'\',0,1,'+(geoCodingSearchMarker.length-1)+');"></a></dd>';
			list += '</dl>';
			list += '<div id="'+content2+'" class="sub_list slist clear" style="display:none;">';
			list += '</div>';
		}else {
			list += '</dl>';
		}
		list += '<div class="btn_option">';
		list += '<div class="over clear">';
		list += '<div class="o_arrow"></div>';
		list += '<ul>';
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
		content1 = content1.replace(/'/g,"\\'");
		list += '<li><a href="#" onclick="stopProp(); naviChoice(\'startInput\','+lat+','+lng+',\''+content1+'\');">'+startStr+'</a></li>';
		list += '<li><a href="#" onclick="stopProp(); naviChoice(\'middleInput'+middleSize+'\','+lat+','+lng+',\''+content1+'\');">'+middleStr+'</a></li>';
		list += '<li><a href="#" onclick="stopProp(); naviChoice(\'endInput\','+lat+','+lng+',\''+content1+'\');">'+endStr+'</a></li>';
		list += '</ul>';
		list += '</div>';
		list += '</div>';
		list += '</div>';
		
	}
	else if(param=="POISearch")
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
		list += '<div class="PoiResult list clear" onclick="setMapClick(this);"><!-- class on : 리스트 on 상태 -->';
		list += '<!-- pin --><div class="pin"><img class="POIResultIcon" src="'+poiSearchMarker[poiSearchMarker.length-1].listMarkerImg+'" width="20" height="24" alt="" /></div>';
		list += '<dl>';
		list += '<dt>'+content1+'</dt>';
		list += '<dd class="txt">'+content3+'</dd>';
		list += '<dd class="txt2">'+content4+'</dd>';
		list += '<dd class="blank"></dd>';
		list += '<dd class="txt2">'+content2+'</dd>';
		if(themeId!=null && themeId!="-2147483648" && themeId!="" && themeId!=0) {
			list += '<dd class="sub_poi plus2"><a href="#" onclick="stopProp(); subMenuSlide(\'POISearch\',\''+themeId+'\',0,1,'+(poiSearchMarker.length-1)+',\''+treeFlag+'\');"></a></dd>';
			list += '</dl>';
			list += '<div id="'+themeId+'" class="sub_list slist clear" style="display:none;">';
			list += '</div>';
		}else {
			list += '</dl>';
		}
		
		list += '<div class="btn_option">';
		list += '<div class="over clear">';
		list += '<div class="o_arrow"></div>';
		list += '<ul>';
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
		content1 = content1.replace(/'/g,"\\'");
		list += '<li><a href="#" onclick="stopProp(); naviChoice(\'startInput\','+lat+','+lng+',\''+content1+'\');">'+startStr+'</a></li>';
		list += '<li><a href="#" onclick="stopProp(); naviChoice(\'middleInput'+middleSize+'\','+lat+','+lng+',\''+content1+'\');">'+middleStr+'</a></li>';
		list += '<li><a href="#" onclick="stopProp(); naviChoice(\'endInput\','+lat+','+lng+',\''+content1+'\');">'+endStr+'</a></li>';
		list += '</ul>';
		list += '</div>';
		list += '</div>';
		list += '</div>';
		
	}
	else if(param=="gridSearch") /** 190829_JIK **/
	{	
		
		var content1 = "";
		var content2 = "";
		var content3 = "";
		var content4 = "";
		var content5 = "";
		var middleSize = middleCoords.size();
		
		var resKey = new Array(); // 결과값 키값
		var resVal = new Array(); // 결과값 value
		
		for ( var key in properties) {
			resKey.push(key);
			resVal.push(properties[key]);
		}
		
		var addrType = properties.type; // 어떤 주소인지 판별
		if(addrType == "jijuk") //지번주소
		{
			content1 = gridAddress;
			content2 = "지번 : " + properties.pnuname;
		}
		else if(addrType == "build") //도로명주소
		{
			content1 = gridAddress;
			content2 = "도로명 : " + properties.newrpnuname;
			var data = properties.pnuname.split("|");
			
			content3 = "지번 : ";
			content4 = properties.buildname;
			for(var i=0; i<data.length; i++) {
				var data2 = data[i].split(" ");
				content3 += data[i].replace(data2[0]+" "+data2[1], "");
				if(i!=data.length-1) {
					content3 += ",";
				}
			}
		}
		
		var list='';
		list += '<div class="JusoResult list clear" onclick="setMapClick(this);"><!-- class on : 리스트 on 상태 -->';
		list += '<!-- pin --><div class="pin"><img class="JusoResultIcon" src="' + gridCellRectangleArr[gridCellRectangleArr.length-1].listMarkerImg + '" width="20" height="24" alt="" /></div>';
		list += '<dl>';
		list += '<dt>'+content1+'</dt>';
		if(content2!="") {
			list += '<dd class="txt2">'+content2+'</dd>';
		}
		if(content3!="") {
			list += '<dd class="blank"></dd>';
			list += '<dd class="txt2">'+content3+'</dd>';
		}
		if(content4!="") {
			list += '<dd class="blank"></dd>';
			list += '<dd class="txt2">'+content4+'</dd>';
		}
		list += '</dl>';
		list += '<div class="btn_option">';
		list += '<div class="over clear">';
		list += '<div class="o_arrow"></div>';
		list += '<ul>';
		list += '<li><a href="#" onclick="stopProp(); naviChoice(\'startInput\','+lat+','+lng+',\''+content2+'\');">출발</a></li>';
		list += '<li><a href="#" onclick="stopProp(); naviChoice(\'middleInput'+middleSize+'\','+lat+','+lng+',\''+content2+'\');">경유</a></li>';
		list += '<li><a href="#" onclick="stopProp(); naviChoice(\'endInput\','+lat+','+lng+',\''+content2+'\');">도착</a></li>';
		list += '</ul>';
		list += '</div>';
		list += '</div>';
		list += '</div>';
	}
	return list;
}


function searchListNull() {
	//동적 다국어 변경
	if(lan=="KOR") {
		$("#search_info_form").html("<span>'"+searchName+"'</span>에 대한 검색 결과가 없습니다.");	
	}else if(lan=="ENG") {
		$("#search_info_form").html("Maps can't find <span>'"+searchName+"'</span>");
	}else if(lan=="JAN") {
		$("#search_info_form").html("<span>'"+searchName+"'</span> に対する住所検索結果がありません。");
	}else if(lan=="CHINAG") {
		$("#search_info_form").html("未找到关于您要的 <span>'"+searchName+"'</span>");
	}
	$("#searchNullForm").css("display","");
}


function subGeoSearchList(i, properties, centerX, centerY) {
	var newrpnuname = properties.newrpnuname;
	var pnuname = properties.pnuname;
	var buildname = "";
	if(lan=="KOR") {
		buildname = properties.buildname;
	}
	
	var data = pnuname.split("|");
	var data2 = data[0].split(" ");
	var pnuname = data[0].replace(data2[0]+" "+data2[1], "");
	
	var list = '';
	list += '<div class="subGeoResult blank clear" onclick="stopProp(); setMapClick(this);">';
	list += '<div class="pin"><img src="'+subGeoCodingSearchMarker[subGeoCodingSearchMarker.length-1].listMarkerImg+'" width="20" height="24" alt="" /></div>';
	list += '<dl>';
	list += '<dt>'+newrpnuname+'</dt>';
	list += '<dd>'+pnuname+'</dd>';
	if(buildname!="") {
		list += '<dd>'+buildname+'</dd>';
	}
	list += '</dl>';
	list += '</div>';
	return list;
}


function subPOISearchList(i, properties, centerX, centerY) {
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
	list += '<div class="subPOIResult blank clear" onclick="stopProp(); setMapClick(this);">';
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



/// 리스트 클릭시 위치로 이동...
function setMapClick(this_){
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
	if(className=="JusoResult") {  //주소리스트
		if(gridWordArr.length == 0){
			map.fitBounds(geoCodingSearchLayer[index].getBounds(),{ padding: [100, 100] });   // 레이어 크기만큼 지도 레벨조정및 위치이동
			for(var i=0; i<geoCodingSearchMarker.length; i++) {
				if(i!=index) {
					$(".JusoResult").eq(i).removeClass("on");
					geoCodingSearchMarker[i].popState = false;
					$(".JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
					var iconOn = new L.Icon({
						iconUrl:geoCodingSearchMarker[i].markerImg,
						iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
					});
					geoCodingSearchMarker[i].setIcon(iconOn);
				}else {
					$(".JusoResult").eq(i).addClass("on");
					geoCodingSearchMarker[i].popState = true;
					geoCodingSearchMarker[i].bindPopup(tooltip.makeGeoContent(geoCodingSearchMarker[i].feature),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
					geoCodingSearchMarker[i].openPopup();
				}
			}
			
			for(var i=0; i<poiSearchMarker.length; i++) {
				poiSearchMarker[i].popState = false;
			
				$(".PoiResult").eq(i).removeClass("on");
				$(".POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;
				var iconOn = new L.Icon({
					iconUrl:poiSearchMarker[i].markerImg,
					iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
				});
				poiSearchMarker[i].setIcon(iconOn);
			}
		}else{
			map.fitBounds(gridCellRectangleArr[index].bounds);
			for(var i = 0; i < gridCellRectangleArr.length; i++){
				if(i!=index) {
					$(".JusoResult").eq(i).removeClass("on");
				}else{
					$(".JusoResult").eq(i).addClass("on");
					
					gridTooltipArr[i].openOn(map);
				}
			}
			
			//console.log(this);
		}
	} else if(className=="PoiResult") {  //poi 리스트
		map.setView(poiSearchMarker[index].getLatLng(), 12); //지도 위치 이동  (좌표, 지도 레벨)
		for(var i=0; i<geoCodingSearchMarker.length; i++) {
			$(".JusoResult").eq(i).removeClass("on");
			geoCodingSearchMarker[i].popState = false;
			$(".JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
			var iconOn = new L.Icon({
				iconUrl:geoCodingSearchMarker[i].markerImg,
				iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
			});
			geoCodingSearchMarker[i].setIcon(iconOn);
		}
		
		for(var i=0; i<poiSearchMarker.length; i++) {
			if(i!=index) {
				$(".PoiResult").eq(i).removeClass("on");
				poiSearchMarker[i].popState = false;
				$(".POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;

				var iconOn = new L.Icon({
					iconUrl:poiSearchMarker[i].markerImg,
					iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
				});
				
				poiSearchMarker[i].setIcon(iconOn);
			
			}else {
				$(".PoiResult").eq(i).addClass("on");
				poiSearchMarker[i].popState=true;
				if(poiSearchMarker[i].c_tree_flag!=undefined) {
					poiSearchMarker[i].bindPopup(tooltip.themeContent(poiSearchMarker[i].feature,parseInt(poiSearchMarker[i].c_tree_flag)-1,poiSearchMarker[i].tooltipIconImg),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
				}else {
					poiSearchMarker[i].bindPopup(tooltip.makePOIContent(poiSearchMarker[i].feature,poiSearchMarker[i].tooltipIconImg),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
				}
				poiSearchMarker[i].openPopup();
			}
		}
	}else if(className=="subGeoResult") {
		map.fitBounds(subGeoCodingSearchLayer[index].getBounds(),{ padding: [100, 100] });   // 레이어 크기만큼 지도 레벨조정및 위치이동
		for(var i=0; i<geoCodingSearchMarker.length; i++) {
			geoCodingSearchMarker[i].popState = false;
			$(".JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
			var iconOn = new L.Icon({
				iconUrl:geoCodingSearchMarker[i].markerImg,
				iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
			});
			geoCodingSearchMarker[i].setIcon(iconOn);
		}
		
		for(var i=0; i<poiSearchMarker.length; i++) {
			poiSearchMarker[i].popState = false;
			$(".POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;
			var iconOn = new L.Icon({
				iconUrl:poiSearchMarker[i].markerImg,
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
		
	}else if(className=="subPOIResult") {
		map.setView(subPOISearchMarker[index].getLatLng(), 12); //지도 위치 이동  (좌표, 지도 레벨)
		for(var i=0; i<geoCodingSearchMarker.length; i++) {
			geoCodingSearchMarker[i].popState = false;
			$(".JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
			var iconOn = new L.Icon({
				iconUrl:geoCodingSearchMarker[i].markerImg,
				iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
			});
			geoCodingSearchMarker[i].setIcon(iconOn);
			geoCodingSearchMarker[i].closePopup();
		}
		
		for(var i=0; i<poiSearchMarker.length; i++) {
			poiSearchMarker[i].popState = false;
			$(".POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;
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



// 리스트 마우스 이벤트
function searchResult(type, mode, totalCnt, list, page) {
	if(type=="addressSearch") {
		if(mode==0) {
			poiSearch(mode,page);
		}else if(mode==1) {
			list += jusoPaging(page, totalCnt); // 주소리스트 페이징
		}
		//동적 다국어 변경
		if(lan=="KOR") {
			$("#addressTotalCount").html("주소 ( <span>"+toComma(totalCnt)+"</span> 건)");
		}else if(lan=="ENG") {
			$("#addressTotalCount").html("Address ( <span>"+toComma(totalCnt)+"</span> cases )");
		}else if(lan=="JAN") {
			$("#addressTotalCount").html("住所 ( <span>"+toComma(totalCnt)+"</span> 件 )");
		}else if(lan=="CHINAG") {
			$("#addressTotalCount").html("地址 ( <span>"+toComma(totalCnt)+"</span> 件 )");
		}
		$("#addressListForm").html(list);
		
		$(".JusoResult").eq(0).addClass("on");
		$(".JusoResultIcon")[0].src = "/resources/common/custom/images/pin/pin_on.png";
		var iconOn = new L.Icon({
			iconUrl:"/resources/common/custom/images/pin/mpin_on.png",
			iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
		});
		/*alert('레알마지막2222222222222222222222222222222222222');*/
		/*map.setView(new L.LatLng((Number(ls_lng) + 0.0005).toFixed(8), ls_lat) , map.getZoom());*/
		/*map.fitBounds(geoCodingSearchLayer[0].getBounds(),{ padding: [100, 100] });*/   // 레이어 크기만큼 지도 레벨조정및 위치이동
		geoCodingSearchMarker[0].setIcon(iconOn);
		geoCodingSearchMarker[0].bindPopup(tooltip.makeGeoContent(geoCodingSearchMarker[0].feature),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
		geoCodingSearchMarker[0].openPopup();
		geoCodingSearchMarker[0].setZIndexOffset(1000);
		$(".JusoResult").hover(
			function() {
				var index = $(".JusoResult").index(this);
				
				$(".JusoResultIcon")[index].src = "/resources/common/custom/images/pin/pin_on.png";
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
						geoCodingSearchMarker[i].bindPopup(tooltip.makeGeoContent(geoCodingSearchMarker[i].feature),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
					}
				}
				
				for(var i=0; i<poiSearchMarker.length; i++) {
					poiSearchMarker[i].setZIndexOffset(100);
				}
			},function() {
				var index = $(".JusoResult").index(this);
				if(geoCodingSearchMarker[index].popState) {
					geoCodingSearchMarker[index].bindPopup(tooltip.makeGeoContent(geoCodingSearchMarker[index].feature),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
					geoCodingSearchMarker[index].openPopup();
					return;
				}
				$(".JusoResultIcon")[index].src = geoCodingSearchMarker[index].listMarkerImg;
				var iconOn = new L.Icon({
					iconUrl:geoCodingSearchMarker[index].markerImg,
					iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
				});
				geoCodingSearchMarker[index].setIcon(iconOn);
				
				for(var i=0; i<geoCodingSearchMarker.length; i++) {
					if(geoCodingSearchMarker[i].popState) {
						geoCodingSearchMarker[i].setZIndexOffset(1000);
						geoCodingSearchMarker[i].bindPopup(tooltip.makeGeoContent(geoCodingSearchMarker[i].feature),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
						geoCodingSearchMarker[i].openPopup();
					}else {
						geoCodingSearchMarker[i].setZIndexOffset(100);
					}
				}
				
				for(var i=0; i<poiSearchMarker.length; i++) {
					if(poiSearchMarker[i].popState) {
						poiSearchMarker[i].setZIndexOffset(1000);
						if(poiSearchMarker[i].c_tree_flag!=undefined) {
							poiSearchMarker[i].bindPopup(tooltip.themeContent(poiSearchMarker[i].feature,parseInt(poiSearchMarker[i].c_tree_flag)-1,poiSearchMarker[i].tooltipIconImg),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
						}else {
							poiSearchMarker[i].bindPopup(tooltip.makePOIContent(poiSearchMarker[i].feature,poiSearchMarker[i].tooltipIconImg),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
						}
						poiSearchMarker[i].openPopup();
					}else {
						poiSearchMarker[i].setZIndexOffset(100);
					}
				}
		});
	
	}else if(type=="POISearch") {
		if(mode==0) {
			
		}else if(mode==2) {
			list += poiPaging(page,totalCnt);
		}
		if(lan=="KOR") {
			$("#poiTotalCount").html("장소 ( <span>"+toComma(totalCnt)+"</span> 건 )");
		}else if(lan=="ENG") {
			$("#poiTotalCount").html("Place ( <span>"+toComma(totalCnt)+"</span> cases )");
		}else if(lan=="JAN") {
			$("#poiTotalCount").html("場所 ( <span>"+toComma(totalCnt)+"</span> 件 )");
		}else if(lan=="CHINAG") {
			$("#poiTotalCount").html("场所 ( <span>"+toComma(totalCnt)+"</span> 件 )");
		}
		$("#poiListForm").html(list);
		if(geoCodingSearchMarker.length==0) {
			map.setView(poiSearchMarker[0].getLatLng(), 12); //지도 위치 이동  (좌표, 지도 레벨)
			$(".PoiResult").eq(0).addClass("on");
			$(".POIResultIcon")[0].src = "/resources/common/custom/images/pin/pin_on.png";
			var iconOn = new L.Icon({
				iconUrl:"/resources/common/custom/images/pin/mpin_on.png",
				iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
			});
			
			poiSearchMarker[0].setIcon(iconOn);
			if(poiSearchMarker[0].c_tree_flag!=undefined) {
				interval = setInterval(function() {
					if(!ajaxLoding) {
						poiSearchMarker[0].popState = true;
						poiSearchMarker[0].bindPopup(tooltip.themeContent(poiSearchMarker[0].feature,parseInt(poiSearchMarker[0].c_tree_flag)-1,poiSearchMarker[0].tooltipIconImg),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
						poiSearchMarker[0].openPopup();
						poiSearchMarker[0].setZIndexOffset(1000);
						clearInterval(interval);
						interval = null;
					}
				},100);
			}else {
				poiSearchMarker[0].popState = true;
				poiSearchMarker[0].bindPopup(tooltip.makePOIContent(poiSearchMarker[0].feature,poiSearchMarker[0].tooltipIconImg),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
				poiSearchMarker[0].openPopup();
				poiSearchMarker[0].setZIndexOffset(1000);
			}
		}
		$(".PoiResult").hover(
			function() {
				var index = $(".PoiResult").index(this);
				$(".POIResultIcon")[index].src = "/resources/common/custom/images/pin/pin_on.png";
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
							poiSearchMarker[i].bindPopup(tooltip.themeContent(poiSearchMarker[i].feature,parseInt(poiSearchMarker[i].c_tree_flag)-1,poiSearchMarker[i].tooltipIconImg),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
						}else {
							poiSearchMarker[i].bindPopup(tooltip.makePOIContent(poiSearchMarker[i].feature,poiSearchMarker[i].tooltipIconImg),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
						}
					}
				}
				
				for(var i=0; i<geoCodingSearchMarker.length; i++) {
					geoCodingSearchMarker[i].setZIndexOffset(100);
				}
			},function() {
				var index = $(".PoiResult").index(this);
				if(poiSearchMarker[index].popState) {
					if(poiSearchMarker[index].c_tree_flag!=undefined) {
						poiSearchMarker[index].bindPopup(tooltip.themeContent(poiSearchMarker[index].feature,parseInt(poiSearchMarker[index].c_tree_flag)-1,poiSearchMarker[index].tooltipIconImg),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
					}else {
						poiSearchMarker[index].bindPopup(tooltip.makePOIContent(poiSearchMarker[index].feature,poiSearchMarker[index].tooltipIconImg),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
					}
					poiSearchMarker[index].openPopup();
					return;
				}
				$(".POIResultIcon")[index].src = poiSearchMarker[index].listMarkerImg;
				var iconOn = new L.Icon({
					iconUrl:poiSearchMarker[index].markerImg,
					iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
				});
				poiSearchMarker[index].setIcon(iconOn);
				
				for(var i=0; i<poiSearchMarker.length; i++) {
					if(poiSearchMarker[i].popState) {
						poiSearchMarker[i].setZIndexOffset(1000);
						if(poiSearchMarker[i].c_tree_flag!=undefined) {
							poiSearchMarker[i].bindPopup(tooltip.themeContent(poiSearchMarker[i].feature,parseInt(poiSearchMarker[i].c_tree_flag)-1,poiSearchMarker[i].tooltipIconImg),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
						}else {
							poiSearchMarker[i].bindPopup(tooltip.makePOIContent(poiSearchMarker[i].feature,poiSearchMarker[i].tooltipIconImg),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
						}
						poiSearchMarker[i].openPopup();
					}else {
						poiSearchMarker[i].setZIndexOffset(100);
					}
				}
				
				for(var i=0; i<geoCodingSearchMarker.length; i++) {
					if(geoCodingSearchMarker[i].popState) {
						geoCodingSearchMarker[i].setZIndexOffset(1000);
						geoCodingSearchMarker[i].bindPopup(tooltip.makeGeoContent(geoCodingSearchMarker[i].feature),{autoPan:true,minWidth:50,offset:[0,-20],'className':'dawul'});
						geoCodingSearchMarker[i].openPopup();
					}else {
						geoCodingSearchMarker[i].setZIndexOffset(100);
					}
				}
		});
	}else if(type=="gridSearch"){ /** 190829_JIK **/
		$("#addressTotalCount").html("주소 ( <span>"+toComma(totalCnt)+"</span> 건 )");
		$("#addressListForm").html(list);
		
		$(".JusoResult").eq(0).addClass("on");
		gridTooltipArr[0].openOn(map);
	}
}



function searchClear() {
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
	
	while (poiExtensionSearchLayer.length > 0) {
		map.removeLayer(poiExtensionSearchLayer[poiExtensionSearchLayer.length - 1]);
		poiExtensionSearchLayer.pop();
	}
	
	while (subGeoCodingSearchMarker.length > 0) {
		map.removeLayer(subGeoCodingSearchMarker[subGeoCodingSearchMarker.length - 1]);
		subGeoCodingSearchMarker.pop();
	}
	
	while (subGeoCodingSearchLayer.length > 0) {
		map.removeLayer(subGeoCodingSearchLayer[subGeoCodingSearchLayer.length - 1]);
		subGeoCodingSearchLayer.pop();
	}
	
	while (subPOISearchMarker.length > 0) {
		map.removeLayer(subPOISearchMarker[subPOISearchMarker.length - 1]);
		subPOISearchMarker.pop();
	}
	
	/** 190829_JIK **/
	while (gridCellRectangleArr.length > 0) {
		map.removeLayer(gridCellRectangleArr[gridCellRectangleArr.length - 1]);
		gridCellRectangleArr.pop();
	}
	
	while (gridTooltipArr.length > 0) {
		map.removeLayer(gridTooltipArr[gridTooltipArr.length - 1]);
		gridTooltipArr.pop();
	}
	
	$("#addressListForm").html("");
	$("#addressTotalCount").html("0");
	$("#poiListForm").html("");
	$("#poiTotalCount").html("0");
}


function subGeoSearchClear(id) {
	while (subGeoCodingSearchMarker.length > 0) {
		map.removeLayer(subGeoCodingSearchMarker[subGeoCodingSearchMarker.length - 1]);
		subGeoCodingSearchMarker.pop();
	}
	
	while (subGeoCodingSearchLayer.length > 0) {
		map.removeLayer(subGeoCodingSearchLayer[subGeoCodingSearchLayer.length - 1]);
		subGeoCodingSearchLayer.pop();
	}
	
	var idClass=$(".sub_list");
	if(id!="") {
		/*for(var i=0; i<idClass.length; i++) {
			var tempId = idClass[i].id;
			if(tempId!=id) {
				$("#"+tempId).html("");
			}
		}*/
	}else {
		idClass.html("");
		idClass.slideUp();
		$(".sub_address").removeClass('minus');
		$(".sub_address").addClass('plus');
	}
}


function subPOISearchClear(id) {
	while (subPOISearchMarker.length > 0) {
		map.removeLayer(subPOISearchMarker[subPOISearchMarker.length - 1]);
		subPOISearchMarker.pop();
	}
	
	var idClass=$(".sub_list");
	if(id!="") {
		/*for(var i=0; i<idClass.length; i++) {
			var tempId = idClass[i].id;
			if(tempId!=id) {
				$("#"+tempId).html("");
			}
		}*/
	}else {
		idClass.html("");
		idClass.slideUp();
		$(".sub_poi").removeClass('minus2');
		$(".sub_poi").addClass('plus2');
	}
}


function searchReset() {
	$("#searchListForm").css("display","none");
	$("#unifiedSearchForm").css("display","none");
	$("#inputSearchDel").css("display","none");
	$("#inputSearch").val("");
	searchClear();
}


//슬라이드
function subMenuSlide(searchType,id,type,page,parentIndex,treeFlag) {
	if(searchType=="addressSearch") {
		if(type==0) {
			var submenu = $("#"+id);
	        // submenu 가 화면상에 보일때는 위로 보드랍게 접고 아니면 아래로 보드랍게 펼치기
			subGeoSearchClear("");
			
	        if(submenu.is(":visible")) {
	            submenu.slideUp(200);
	            var subClass = $(".JusoResult").eq(parentIndex).find(".sub_address");
	            subClass.removeClass('minus');
	            subClass.addClass('plus');
	        }else{
	        	setMapClick($(".JusoResult")[parentIndex]);
	        	subGeoSearch(id,"ORIGIN",page);
	            submenu.slideDown(200);
	            var subClass = $(".JusoResult").eq(parentIndex).find(".sub_address");
	            subClass.removeClass('plus');
	            subClass.addClass('minus');
	        }
		}else {
			subGeoSearchClear(id);
			subGeoSearch(id,"ORIGIN",page);
		}
	}else if(searchType=="POISearch") {
		if(type==0) {
			var submenu = $("#"+id);
	        // submenu 가 화면상에 보일때는 위로 보드랍게 접고 아니면 아래로 보드랍게 펼치기
			subPOISearchClear("");
	        if(submenu.is(":visible")) {
	            submenu.slideUp(200);
	            var subClass = $(".PoiResult").eq(parentIndex).find(".sub_poi");
	            subClass.removeClass('minus2');
	            subClass.addClass('plus2');
	        }else{
	        	setMapClick($(".PoiResult")[parentIndex]);
	        	subPOISearch(id,page,treeFlag,parentIndex);
	            submenu.slideDown(200);
	            var subClass = $(".PoiResult").eq(parentIndex).find(".sub_poi");
	            subClass.removeClass('plus2');
	            subClass.addClass('minus2');
	        }
		}else {
			subPOISearchClear(id);
			setMapClick($(".PoiResult")[parentIndex]);
			subPOISearch(id,page,treeFlag,parentIndex);
		}
	}
}



function searchOnOff() {
	if($("#searchOpen").css("display")=="none") {
		$("#searchListForm").attr("class","s_section");
		$("#searchOpen").css("display","");
		$("#searchOnOff").attr("class","ico_close");
	}else {
		$("#searchListForm").attr("class","s_section2 c_size");
		$("#searchOpen").css("display","none");
		$("#searchOnOff").attr("class","ico_open");
	}
}