var map = null;
var reqLang = "";
var resLang = "";
var tooltip = new DW.ToolTipCreater;
var chkDist = false; // 거리재기, 면적재기 <-> 우클릭POI 검색 제어 변수
var rightClickPop = null;
var overlaySlideMode = true;  //오버레이 드롭다운 모드 (디폴트 true);
var $popup = "";
var ls_status = "0";
var ls_code = "";
var ls_xy = "";
var	ls_lat = "";
var	ls_lng = "";
var count =	0;
var time = 0;
var ls_html = '';

var z_index	=	99;

var ls_sale = "1";
var ls_rent = "1";
var ls_trading = "1";
var ls_realtran = "1";
var	ls_rent_status	=	"0"
var	ls_bunji			=	'';
var	ls_year_length		=	[];

var	ls_a_sangga	=	'1';
var	ls_b_sangga	=	'1';
var	ls_c_sangga	=	'1';
var	ls_d_sangga	=	'1';

var	ls_neLat	=	'';
var	ls_neLng	=	'';
var	ls_swLat	=	'';
var	ls_swLng	=	'';

var ls_pnu = '0';
var ls_click_name	=	'';
var ls_click_move	=	'';
var	ls_move_status	=	'';

/*var ls_sale_html	=	'';*/

var map_popup_check = false;

var buildingSearchLayer = null;   //건물내 poi 검색    건물 레이어
var buildingSearchMainMarker = null;  //건물내 poi 검색    건물 마커

var bPoiSearchMarker = new Array();
var map_popup_item = "";
var map_popup_num = "";

var fieldName = "";
var fieldValue = "";

var ncodePOISearchCheck = false;
var ncodeSearchMarker = new Array();  //건물내 poi 검색    건물 마커
var ncodeSelectMid = "";

var myLocationMarker = null;
var chkTakji = ["UDT101","UDT102","UDA100","UDS100","UDT100","UDT103","UQQ300","UQQ310","UQQ320","UDE100",,"UQQ321"]; // 개발지구, 레벨별 다르게

var jiguLayer = new Array(); //개발정도 확장컨텐츠 레이어
var jiguMarker = new Array(); //개발정도 확장컨텐츠 마커
var jiguSelectMid = "";

var ncodeIndex = null;
var ncodeIndex2 = null ; // 주변검색 index

var dist = null;  //거리재기
var area = null;  //면적재기
var marker = null;
var settimeoutList = [];
var setintervalList = [];

var ls_dist = "dist_off"; //거리재기 확설중일떄는 마우스 왼쪽클릭 off
var arrTab = new Array('SearchTab', 'NaviTab', 'ThemeTab', 'LifeTab', 'StatsTab', 'FavoriteTab'); //왼쪽 탭 버튼

//현위치 사용 스위치
var myGPS = false
var position = [37.50587647959517, 127.05146545764119];

//초기화
var init = function(){	
	//GIS 블럭에서 이동시 선택한 좌표로 이동
	if(sessionStorage.GIS_pos_building == null || sessionStorage.GIS_pos_building == ''){	
	}else{		
		var obj = JSON.parse(sessionStorage.GIS_pos_building);
		ls_lat = obj.y;
		ls_lng = obj.x;		
		position	=	[obj.y, obj.x];
		getAddress(obj.y,obj.x,'JIBUN_ADDRESS');
		sessionStorage.GIS_pos_building = '';
	}
	
	var ls_year_html	=	'';
	ls_year = new Date().getFullYear();		
	
	for(var i=2017; i<ls_year; i++) {		
		ls_year_html += "<li class='btn_year on'><span></span><strong>"+ (i + 1) +"</strong></li>";
		ls_year_length.push(String(i + 1));
	}	
	$('.radio-years').html(ls_year_html);
	
	var select = $('.select-script select');
	select.change(function(){
		var select_name = $(this).children('option:selected').text();
		$(this).siblings("label").text(select_name);
	});
	
	map = L.map('map', {
		continuousWorld : true,
		zoomControl : false,
		zoomAnimation : true,
		fadeAnimation : false,
		inertia : false,
		center: position,  // 지도 초기 위치
	    zoom: 12, // 지도 초기 줌 레벨 (실제 지도의 레벨 : 11)
	    attributionControl : false
	});	
	
	apiBuildingDtl.fnInitDtl();
	
	if(firstLat!="" && firstLng!="" && firstLevel!="") {
		map.setView(new L.LatLng(firstLat, firstLng) , firstLevel); //지도 위치 이동  (좌표, 지도 레벨)
	}
	languageMapChange();
	
	var scaleBar = new L.Control.Scale({
		position : 'bottomright'
	});
	map.addControl(scaleBar);		
	
	// 바운드가 실제 화면보다 약간 넓어서 범위 보정함
	var bound = map.getBounds(),
	data = {
		'neLat': bound._northEast.lat,
		'neLng': bound._northEast.lng,
		'swLat': bound._southWest.lat,
		'swLng': bound._southWest.lng
	};
	/*0.0125*/
	if(map.getZoom() == 13){
    	deltaX = 0.00735 * map.getZoom() - 0.08925,
    	deltaY = 0.006 * map.getZoom() - 0.0762;
	}else if(map.getZoom() == 12){
    	deltaX = 0.00655 * map.getZoom() - 0.07800,
    	deltaY = 0.006 * map.getZoom() - 0.0722;
	}else if(map.getZoom() < 12){
    	deltaX = 0.00625 * map.getZoom() - 0.06825,
    	deltaY = 0.006 * map.getZoom() - 0.063;
	}

	data.neLng += deltaX;
	data.swLng -= deltaX;
	data.neLat += deltaY;
	data.swLat -= deltaY;
	
    map.addEventListener('zoomend', function(evt) {
		$('.tool-group [data-gis-zoom]').text(map.getZoom());
    });	
	
	$('.tool-group [data-gis-zoom]').text(map.getZoom());
	
	/*상권영역*/
	ls_neLat	=	data.neLat;
	ls_neLng	=	data.neLng;
	ls_swLat	=	data.swLat;
	ls_swLng	=	data.swLng;	
	
	/* 마커 표시 */
	sample_marker(data.neLat,data.neLng,data.swLat,data.swLng,ls_year_length);
	
	/*마우스좌측클릭*/
	map.on("click", function(e){		
		if(ls_dist == "dist_off"){
			ls_lat = e.latlng.lat;
			ls_lng = e.latlng.lng;
			if(map.getZoom() > 10){				
				getAddress(e.latlng.lat,e.latlng.lng,'JIBUN_ADDRESS');
			}			
			return;
		}		
		var nowZoom = this.getZoom();
		if(nowZoom == 12 || nowZoom == 13){
			if(gridFlag == true){
				var lat = e.latlng.lat;
				var lng = e.latlng.lng;					
				girdCellBounds(lat, lng, 0);				
			}
		}		
	});
	
	dist = new L.Control.Measure({mode:"dist"});
	area = new L.Control.Measure({mode:"area"});
	map.addLayer(dist);
	map.addLayer(area);
	
	/*상세정보*/
	var self = this,
	favorite = store.get('GIS_building_favorite') || {};
		
	if(favorite.좌표x != null){
		getAddress(favorite.좌표y,favorite.좌표x,'JIBUN_ADDRESS');
		store.remove('GIS_building_favorite');
	}
	
	$("#indoor_on").click(function() { // 실내지도 체크 클릭시
		stopProp();
	});
	
	$("#indoor_off").click(function() { // 실내지도 체크 클릭시
		stopProp();
	});
	ncodeList(1);
	ncodeList2(1);
	//주변시설 이벤트
	$("#m_nearby2_sub1_1 li").click(function() {
		ncodeIndex = $(this).index();
		ncodeClickSubDepth(ncodeIndex);
	});
	
	$("#m_nearby2_sub1_2 li").click(function() {
		ncodeIndex = $(this).index();
		ncodeClickSubDepth2(ncodeIndex);
	});	
	
	$("#m_nearby2_sub2").on("click","li",function() {
		ncodeIndex1 = $(this).index();
	});

	$('#mapPannel1 [data-btn-export]').click(function() {
		//분양 익스포트
		apiBuildingDtl.fnExport($(this).attr('data-btn-export'));
	});
	
	$('#mapPannel1 [data-btn-export]').click(function() {
		apiBuildingDtl.fnExport($(this).attr('data-btn-export'));
	});		
	
	$('#mapPannel1_2 [data-btn-export]').click(function() {
		apiBuildingDtl.fnExport($(this).attr('data-btn-export'));
	});
	
	$('#mapPannel2 [data-btn-export]').click(function() {
		apiBuildingDtl.fnExport($(this).attr('data-btn-export'));
	});	
	
	$("#m_nearby2_sub3").on("click","li",function() {
		ncodeIndex2 = $(this).index();
	});
	
	$('.btn-zoom-in').click(function() {		
		map.setZoom(map.getZoom() + 1);
	});
	
	$('.btn-zoom-out').click(function() {		
		map.setZoom(map.getZoom() - 1);
	});
	
	$('#mapBuildingClose').click(function(){
		apiBuildingDtl.fnCloseDtl();
	});
	//그래프 리사이징
	$('#mapPannel1 [data-toggle="tab"]').click(function() {// 탭 변경 시 스크롤 상단 이동
		apiBuildingDtl.fnReloadHack();
	});
	$('#mapPannel1_2 [data-toggle="tab"]').click(function() {// 탭 변경 시 스크롤 상단 이동
		apiBuildingDtl.fnReloadHack();
	});
	$('#mapPannel2 [data-toggle="tab"]').click(function() {// 탭 변경 시 스크롤 상단 이동
		apiBuildingDtl.fnReloadHack();
	});
	
    // 21.01.04 편의시설 추가 
    var map_plant_num = $('#map_plant_bt').length;
    if(map_plant_num > 0  ){
        var map_plant_list = $('.map_plant_list_box li').length;
        $('#map_plant_bt').click(function (){
             $('.map_plant_box').toggle();
        });
        $('.map_plant_list_box li a').click(function (e){
            e.preventDefault();
        })
        $('.map_plant_list_box li').click(function (){
            if($(this).hasClass('active') == true){
                $(this).removeClass('active');
            }else{
                $('.map_plant_list_box li').removeClass('active');
                $(this).addClass('active');
            }
            plant_sub_depth_hide();
        })

        $('.map_plant_list_box li.sub_depth_in').click(function (){   
        	document.documentElement.scrollTop = 0;
            var plant_sub_depth_position = $(this).closest('ul').index();
            if(plant_sub_depth_position==0){
               $('#plant_sub_depth_box').css('right','0'); 
               $('#plant_sub_depth_box').css('left','auto'); 
            }else{
                $('#plant_sub_depth_box').css('left','0'); 
                $('#plant_sub_depth_box').css('right','auto');
            }
            if($(this).hasClass('active') == true){
                plant_sub_depth_visible();
            }else{
                $('.map_plant_list_box li').removeClass('active');
                plant_sub_depth_hide();
            }
        })
        $('.map_plant_box').mouseleave(function (){
            $(this).hide();
        })
    }	
	
	// 행정동 주소 검색 레이어
	$(document).on('click', '#btnSearchAddr', function(){
	    $('#divSearchAddr').show();
	});
	$(document).on('click', '.btnSearchAddrClose', function(){
	    $('#divSearchAddr').hide();
	});
	$(document).mouseup(function (e){
	    var container = $('#divSearchAddr');
	    if( container.has(e.target).length === 0){
	      container.hide();
	    }
	});
	$(document).on('click', '#mapSrcClose', function(){
	    $('#mapSrcResult').hide();
	});	
	
	var $today = $('[data-today]');
	
	$today.text(moment().format($today.attr('data-today')));
	
	building_apiAddr.fnSetMap(map);
    building_apiAddr.fnGps(new L.LatLng(position[0], position[1]), map.getBounds());
	
	/*상세정보*/
	$(document).on('click', '.leaflet-popup-close-button', function(e){})
	
	// 맵버튼 레이어
	$(document).on('click', '#btnMapType1', function(){
	    $('#mapTypeLayer1').show();
	});
	$(document).on('click', '.btnMapType1Close', function(){
	    $('#mapTypeLayer1').hide();
	});

	$('#btnMapType2_2').click(function(evt) {
		var $btn = $(this);

		overlayMapChanges(2);

		if ($btn.hasClass('btn-danger')) {
			$btn.removeClass('btn-danger').addClass('btn-outline-secondary');
			$btn.css({'color': '#707070', 'background-color': '#ffffff'});
		} else {
			$btn.addClass('btn-danger').removeClass('btn-outline-secondary');
			$btn.css({'color': '#ffffff', 'background-color': '#333333'});
		}
	});
	
	$(document).on('click', '#mapInfo1', function(e){
		var $this = $(e.currentTarget);
		apiBuildingDtl.fnOpenSecondDtl();
	});
	
	// 토글 클래스 (분양 / 임대료 / 실거래)
	$(document).on('click', '.btn-toggle', function(){
		console.log('.btn-toggle');
	    if($(this).hasClass("on")){	    	    	    	
			if($(this).text()	==	"분양"){
				ls_sale	=	"0";
			}else if($(this).text()	==	"임대료"){				
				ls_rent	=	"0";
			}else if($(this).text()	==	"매매"){				
				ls_trading	=	"0";
			}else if($(this).text()	==	"실거래"){
				ls_realtran	=	"0";
			}	 
			ls_xy	=	"";
			setTimeout(function() {sample_marker(ls_neLat,ls_neLng,ls_swLat,ls_swLng,ls_year_length)});			
	        $(this).removeClass("on");
	    } else {			
			if($(this).text()	==	"분양"){
				ls_sale	=	"1";				
			}else if($(this).text()	==	"임대료"){				
				ls_rent	=	"1";
			}else if($(this).text()	==	"매매"){				
				ls_trading	=	"1";
			}else if($(this).text()	==	"실거래"){
				ls_realtran	=	"1";
			}			
			ls_xy	=	"";
			setTimeout(function() {sample_marker(ls_neLat,ls_neLng,ls_swLat,ls_swLng,ls_year_length)});			
	        $(this).addClass("on");
	    }
	});
	
	// 토글 클래스2 (등록 년도 / 근린 / 단지내 / 복합 / 기타)
	$(document).on('click', '#btnFilter1', function(){
	    if($(this).hasClass("btn-danger")){
	        $(this).removeClass("btn-danger");
	        $(this).addClass("btn-outline-secondary");
	        $('#filterLayer1').hide();
	        $('#filterLayer2').hide();
	        $('#mapSrcResult .tab-content').height('500');
	    } else if($(this).hasClass("btn-outline-secondary")) {
	        $(this).removeClass("btn-outline-secondary");
	        $(this).addClass("btn-danger");
	        $('#filterLayer1').show();
	        $('#filterLayer2').show();
	        $('#mapSrcResult .tab-content').height('250');
	    }
	});	
	
	// 토글 클래스3 (등록 년도 / 근린 / 단지내 / 복합 / 기타)
	$(document).on('click', '.btn-togsanga', function(){		
		if($(this).hasClass("btn-danger")){
	        $(this).removeClass("btn-danger");
	        $(this).addClass("btn-outline-secondary");      
			if($(this).text()	==	"근린" ){
				$('.a_sangga').parent().parent().parent().css("display","none");
				ls_a_sangga	=	"0";
			}else if($(this).text()	==	"단지내"){
				$('.b_sangga').parent().parent().parent().css("display","none");
				ls_b_sangga	=	"0";
			}else if($(this).text()	==	"복합"){
				$('.c_sangga').parent().parent().parent().css("display","none");
				ls_c_sangga	=	"0";
			}else if($(this).text()	==	"기타"){
				$('.d_sangga').parent().parent().parent().css("display","none");
				ls_d_sangga	=	"0";
			}
	    } else if($(this).hasClass("btn-outline-secondary")) {
	        
	    	if($('.btn-rent').hasClass("on")){
				if($(this).text()	==	"근린"){
					$('.a_sangga').parent().parent().parent().css("display","");						
				}else if($(this).text()	==	"단지내"){
					$('.b_sangga').parent().parent().parent().css("display","");						
				}else if($(this).text()	==	"복합"){
					$('.c_sangga').parent().parent().parent().css("display","");						
				}else if($(this).text()	==	"기타"){
					$('.d_sangga').parent().parent().parent().css("display","");						
				}
	    	}
			if($(this).text()	==	"근린"){
				ls_a_sangga	=	"1";					
			}else if($(this).text()	==	"단지내"){
				ls_b_sangga	=	"1";					
			}else if($(this).text()	==	"복합"){
				ls_c_sangga	=	"1";					
			}else if($(this).text()	==	"기타"){
				ls_d_sangga	=	"1";						
			}	
	        $(this).removeClass("btn-outline-secondary");
	        $(this).addClass("btn-danger");			
	    }	
	});
	
	$('.radio-years').find('li').click(function(){		
		$(this).toggleClass('on');
	})
	
	// 토글 클래스7 (등록년도)
	$(document).on('click', '.btn_year', function(){		
		ls_year_length	=	[];
		for(var i=0; i<$(".radio-years .on").length; i++) {
			ls_year_length.push($(".radio-years .on")[i].innerText);
		}						
		ls_xy	=	'';
		setTimeout(function() {sample_marker(ls_neLat,ls_neLng,ls_swLat,ls_swLng,ls_year_length)});
	});		
	
	$(document).on('click', '.z_leaflet-popup-close-button', function(){
		$('.z_leaflet-popup').removeClass('on');
	});	
	
	$('.z_leaflet-popup').removeClass('on');
	
	$(document).on('click', '#mapPannel1Close', function(){
	    $('#mapPannel1').removeClass('d-flex');
	    $('#mapPannel1').addClass('d-none');
	});
	$(document).on('click', '#mapPannel1_2Close', function(){
	    $('#mapPannel1_2').removeClass('d-flex');
	    $('#mapPannel1_2').addClass('d-none');
	});
	$(document).on('click', '#mapSrcClose', function(){
	    $('#mapSrcResult').hide();
	});
	$(document).on('click', '#mapInfo2', function(){
	    $('#mapPannel2').removeClass('d-none');
	    $('#mapPannel2').addClass('d-flex');
	    $('#mapPannel1').removeClass('d-flex');
	    $('#mapPannel1').addClass('d-none');
	});
	$(document).on('click', '#mapPannel2Close', function(){
	    $('#mapPannel2').removeClass('d-flex');
	    $('#mapPannel2').addClass('d-none');
	});
	var outZoomFlag = false;	

	map.on("drag",function(e) {
		//if(map.getZoom() == 11){
		// 반을 지우고 시작!!!
		if (map.popupList && 0 < map.popupList.length && 100 < map.popupList.length) {			
			for (var i=0; i< Math.round(map.popupList.length / 2); i ++) {
				map.removeLayer(map.popupList[i]);
			}
		}
		//}
		clearInterval(time);
		count = 0;
		return false;
	});
	
	map.on("move",function(e) {		
		clearInterval(time);
		count = 0;
		return false;
	});

	map.on("moveend",function(e) {	
		console.log("moveend");
		if($("#overPlan").is(':checked')) {
			themeJiguLayerDraw(false);	
		}		
		if(ncodePOISearchCheck) {
			if(ncodeDatas.cate[ncodeIndex].depth==1){ // 여기서 불러와야함.
				ncodePOISearch(ls_code, ls_img, false);   //(코드,이미지,autopan)
			}else if(ncodeDatas.cate[ncodeIndex].depth==2){
				ncodePOISearch(ls_code, img, false); //(코드,이미지,autopan)
			}
		}
		
		if(setintervalList.length > 0 || settimeoutList.length > 0){
			clearInterval(setintervalList);
			clearTimeout(settimeoutList);
			settimeoutList = []; 
			setintervalList = [];
		} else {
			return; 	
		}
		
		if(map.getZoom() == 13){			
			building_apiAddr.fnGps(map.getCenter(), map.getBounds());	
	    	var bound = map.getBounds(),
			data = {
				'neLat': bound._northEast.lat,
				'neLng': bound._northEast.lng,
				'swLat': bound._southWest.lat,
				'swLng': bound._southWest.lng
	    	};
	    		    
	    	if(map.getZoom() == 13){
	        	deltaX = 0.01115 * map.getZoom() - 0.14325,
	        	deltaY = 0.006 * map.getZoom() - 0.0772;
	    	}else if(map.getZoom() == 12){
	        	deltaX = 0.00655 * map.getZoom() - 0.07800,
	        	deltaY = 0.006 * map.getZoom() - 0.0722;
	    	}else if(map.getZoom() <= 10 && map.getZoom() >= 7){
	        	deltaX = 0.001 * map.getZoom(),
	        	deltaY = 0.001 * map.getZoom();
	    	}

			data.neLng += deltaX;
			data.swLng -= deltaX;
			data.neLat += deltaY;
			data.swLat -= deltaY;
			
			ls_neLat	=	data.neLat;
			ls_neLng	=	data.neLng;
			ls_swLat	=	data.swLat;
			ls_swLng	=	data.swLng;		
			
	        if(ls_click_move == "1"){
	            sample_marker(data.neLat,data.neLng,data.swLat,data.swLng,ls_year_length);
	            ls_click_move   =   "";
	        }else{        	
	            sample_marker(data.neLat,data.neLng,data.swLat,data.swLng,ls_year_length);
	            if(ls_xy != ""){
	            	$('.' + ls_xy + '').parent().parent().parent().removeClass('on');
	            }
	            ls_xy   =   "";
	            ls_click_move   =   "";
	        }
	    	ls_status = "0";			
		}else if(map.getZoom() != 13){
			ls_move_status	=	"1";
    		time = setInterval("func()", 300);
    		setintervalList.push(time);
	    }
		
		/** 190829_JIK **/    	
		var nowZoom = this.getZoom();
		if(nowZoom == 12 || nowZoom == 13){ // 레벨 12, 13 => 격자보기ON => 격자영역 초기화 => 셀과 툴팁 없애주기
			
			if(gridFlag == true){				
				gridBounds();
				if(gridCellRectangleArr.length > 0){
					gridCellRectangleArr[gridCellRectangleArr.length - 1].addTo(map);
					gridTooltip.addTo(map);
					
					if(outZoomFlag == true){
						map.invalidateSize(false); // 맵 갱신
					
						var lat = gridCellRectangleArr[gridCellRectangleArr.length - 1].lat;
						var lng = gridCellRectangleArr[gridCellRectangleArr.length - 1].lng;
					
						map.setView(new L.LatLng(lat, lng) , nowZoom); //지도 위치 이동  (좌표, 지도 레벨)
						
						outZoomFlag = false;
					}
				}
			}
		}else if(nowZoom < 12){ // 레벨 12미만 => 격자영역 초기화
			outZoomFlag = true;
			
			gridBoundsClear();
			if(gridWordArr.length == 0 && gridRightFlag == true){
				gridCellClear();
				gridTooltipClose();
			}
			if(gridFlag == true){
				if(gridCellRectangleArr.length > 0){
					map.removeLayer(gridCellRectangleArr[gridCellRectangleArr.length - 1]);
					map.removeLayer(gridTooltip);
				}
			}
		}
    });
	defaultSetting();
}

function sample_marker(neLat,neLng,swLat,swLng,ls_year_length){ // 마커 설정
	if(ls_status == "0"){														
		clearInterval(time);
		var self = this,
		param = {
			neLng: neLng,
			swLng: swLng,
			neLat: neLat,
			swLat: swLat,
			ls_year_length: ls_year_length,
			sale: ls_sale,
			rent: ls_rent,
			trading: ls_trading,
			realtran: ls_realtran,
			groupCode: _GroupCode,
			demoSidonm: _DemoSidonm,
			demoSggnm: _DemoSggnm,
		};		
		var html_ = "";
		var html2_ = "";
	
		if(ls_sale + ls_rent + ls_trading + ls_realtran == "0000" || ls_year_length == ''){
			if (map.popupList && 0 < map.popupList.length) {			
				for (var i in map.popupList) {
					map.removeLayer(map.popupList[i]);
				}
			}
			return;
		}
		
		/*분양가*/
		if(map.getZoom() > 10 && ls_year_length != '' && ls_sale + ls_rent + ls_trading + ls_realtran != "0000"){
			return z.xAsync('dawulmap', 'zeons_마커생성', 'select', param, 'json2').always(function() {
				if (map.popupList && 0 < map.popupList.length) {			
					for (var i in map.popupList) {
						map.removeLayer(map.popupList[i]);
					}
				}
				map.popupList = [];
			}).done(function(resp) {
				self.rawDataArr = resp;
				for(var i = 0; i < resp.length; i++){
					
					$popup = L.popup({
						maxWidth:200,          //가로 최대 크기
						offset:[30,0],          //오프셋
						keepInView:false,      //팝업이 열려 있는동안 지도 벗어나게 이동 막기
						autoPan:false,          //팝업창이 지도에서 안보일시 보이는 위치까지 자동 지도 이동
						closeButton:false,     //팝업 닫기 버튼 유,무
						autoClose:false,
						closeOnClick: false,
						'className':'dawul'    //팝업 테두리 없애기  (팝업 기본 테두리를 없애시려면 추가  중요:dw_popup.css 추가 시켜줘야 함.  테두리 제거 css가 들어있음)
					});					
						
					map.popupList.push($popup);
					
					if(resp[i].z_status == "분양"){
						html_ = "<div class='flag flag-sales map-info-popup cursor-pointer mapInfo1 " + resp[i].w_year + " " + resp[i].sanga_status + "'>";
					}else if(resp[i].z_status == "임대료"){
						html_ = "<div class='flag flag-rent map-info-popup cursor-pointer mapInfo1'>";
					}else if(resp[i].z_status == "매매"){
						html_ = "<div class='flag flag-trading map-info-popup cursor-pointer mapInfo1'>";
					}else{
						html_ = "<div class='flag flag-actual map-info-popup cursor-pointer mapInfo1'>";
					}
						
					html_ += resp[i].임대료명;
					var prop=" lat='" + resp[i].x_lat + "' " 
							+" lng='"+ resp[i].y_lng + "' "
							+" pnu='"+resp[i].pnu+"' "
							+" xy='"+resp[i].xy+"' "
							+" z_status='"+ resp[i].z_status + "' "
							+" bunji='"+ resp[i].bunji +"'";
					   
					html_ += "<div class='flag-body popupopen' onclick=getPnu(this) "+ prop + ">";
					
					var popid = '';
					var popdate = '';
					
					if(resp[i].z_status == "분양"){
						popid = 'pop_sale';
						popdate = '분양일';
					}else if(resp[i].z_status == "임대료"){
						popid = 'pop_rent';
						popdate = '등록일';
					}else if(resp[i].z_status == "매매"){
						popid = 'pop_trading';
						popdate = '등록일';
					}else{
						popid = 'pop_actual';
						popdate = '최근계약일';
					}				
					html_ += "<strong>"+ popdate +"</strong>";
					html_ += "<span>" + resp[i].w_date + "</span>";
					html_ += "</div>";
					
					html_ += "<div class='z_leaflet-popup' id='"+popid+"'>";
					html_ += "<div class='z_leaflet-popup-content'>";
					html_ += "<div class='z_leaflet-content-box'>";
					html_ += "<div class='z_leaflet-header'>";
					html_ += "<h3 id=" + resp[i].xy + ">-</h3>";
					html_ += "<strong>"+popdate+" : <span>" + resp[i].w_date + "</span></strong>";
					html_ += "</div>";
					html_ += "<div class='leaflet-body " + resp[i].xy + "' data-scroll='true' data-height='155' data-mobile-height='155' style='height:155px;'>";
					html_ += "</div>";
					html_ += "<div class='z_leaflet-footer'>";
					html_ += "<button type='button' class='btn btn-outline-secondary btn-lg px-11 font-weight-bold' id='mapInfo1'>더보기</button>";
					html_ += "</div>";
					html_ += "</div>";
					html_ += "<div class='t_arrow'></div>";
					html_ += "</div>";
					html_ += "<button class='z_leaflet-popup-close-button'><i class='ki ki-close'></i></button>";
					html_ += "</div>";	
					html_ += "</div>";														
					
					$popup.setLatLng([resp[i].y_lng, resp[i].x_lat]);							
					$popup.setContent(html_);					
					/*
					var icon = L.divIcon({
				     	iconSize:null,
				     	html: html_
				    });					
					var popup = L.popup().setContent(html2_);					
					//$marker = L.marker([resp[i].y_lng, resp[i].x_lat],{icon: icon}).addTo(map);					
					//$marker.bindPopup(html2_).openPopup();
					*/
					add_marker($popup);
				}
				
				//let end = new Date();  // 종료 
				//console.log((end - start) / 1000);
				// 지도 말풍선 함수 실행
				//map_popup_item = $('.map-info-popup');
				//map_popup_num = map_popup_item.length;			    
				//map_popup_stater(map_popup_num);
		    	count	=	0;        
		    	if(ls_xy != ""){				    	
			    	$('#' + ls_xy + '').text(ls_click_name);
					$('.' + ls_xy + '').html(ls_html);
					
					KTUtil.scrollInit($('.' + ls_xy + '')[0], {
						mobileNativeScroll: true,
						handleWindowResize: true
					});
						
					if(ls_click_name == "분양"){							
						if($("#mapPannel2").attr("class")!="map-pannel-sale position-fixed w-600px pb-0 flex-column border map-pannel bg-white d-flex") {
							$('.' + ls_xy + '').parent().parent().parent().addClass('on');
						}
					}else if(ls_click_name == "실거래"){							
						if($("#mapPannel1_2").attr("class")!="map-pannel-actual position-fixed w-600px pb-0 flex-column border map-pannel bg-white d-flex") {
							$('.' + ls_xy + '').parent().parent().parent().addClass('on');
						}
					}else if(ls_click_name == "임대료"){							
						if($("#mapPannel1_2").attr("class")!="map-pannel-rent position-fixed w-600px pb-0 flex-column border map-pannel bg-white d-flex") {
							$('.' + ls_xy + '').parent().parent().parent().addClass('on');
						}							
					}else if(ls_click_name == "매매"){							
						if($("#mapPannel1_2").attr("class")!="map-pannel-trading position-fixed w-600px pb-0 flex-column border map-pannel bg-white d-flex") {
							$('.' + ls_xy + '').parent().parent().parent().addClass('on');
						}							
					}
			    	$('.' + ls_xy + '').parent().parent().parent().parent().parent().parent().parent().css("z-index",1000);
			    }	   
			})    
		} else if(map.getZoom() < 11 && map.getZoom() > 6 && ls_year_length != '' && ls_sale + ls_rent + ls_trading + ls_realtran != "0000"){
			/*분양가*/
			return z.xAsync('dawulmap', 'zeons_마커생성_dong', 'select', param, 'json2').always(function() {
				if (map.popupList && 0 < map.popupList.length) {			
					for (var i in map.popupList) {
						map.removeLayer(map.popupList[i]);
					}
				}
				map.popupList = [];
			}).done(function(resp) {
						
				self.rawDataArr = resp;
			
				for(var i = 0; i < resp.length; i++){
					$popup = L.popup({
						maxWidth:200,          //가로 최대 크기
						offset:[30,0],          //오프셋
						keepInView:false,      //팝업이 열려 있는동안 지도 벗어나게 이동 막기
						autoPan:false,          //팝업창이 지도에서 안보일시 보이는 위치까지 자동 지도 이동
						closeButton:false,     //팝업 닫기 버튼 유,무
						autoClose:false,
						closeOnClick: false,
						'className':'dawul'    //팝업 테두리 없애기  (팝업 기본 테두리를 없애시려면 추가  중요:dw_popup.css 추가 시켜줘야 함.  테두리 제거 css가 들어있음)
					});
		
					map.popupList.push($popup);
								
					html_ = "<div class='flag flag-city l1'>";
					
					html_ += "<label><em>" + resp[i].읍면동명 + "</em></label>";							
					html_ += "<div class='flag-body'>";							
					html_ += "<ul>";
					html_ += "<li>";
		
					html_ += "<strong>분양</strong>";
					html_ += "<span>" + z.toComma(resp[i].분양_cnt) + "</span>";
					html_ += "</li>";
					
					html_ += "<li>";							
					html_ += "<strong>임대료</strong>";
					html_ += "<span>" + z.toComma(resp[i].임대료_cnt) + "</span>";
					html_ += "</li>";
					
					html_ += "<li>";							
					html_ += "<strong>매매</strong>";
					html_ += "<span>" + z.toComma(resp[i].매매_cnt) + "</span>";
					html_ += "</li>";
					
					html_ += "<li>";							
					html_ += "<strong>실거래</strong>";
					html_ += "<span>" + z.toComma(resp[i].실거래_cnt) + "</span>";
					html_ += "</li>";
					
					html_ += "</ul>";
					html_ += "</div>";
					html_ += "</div>";
														
					$popup.setLatLng([resp[i].y, resp[i].x]);							
					$popup.setContent(html_);
					$popup.addTo(map);					
				}
						
				map_popup_item = $('.map-info-popup');
			    // 지도 말풍선 함수 실행  
			    map_popup_num = map_popup_item.length;			    
			    map_popup_stater(map_popup_num);
			    
		    	count	=	0;		    
			})
		} else if(map.getZoom() < 7 && map.getZoom() > 4 && ls_year_length != '' && ls_sale + ls_rent + ls_trading + ls_realtran != "0000"){
			/*분양가*/
			return z.xAsync('dawulmap', 'zeons_마커생성_sigun', 'select', param, 'json2').always(function() {
				if (map.popupList && 0 < map.popupList.length) {			
					for (var i in map.popupList) {
						map.removeLayer(map.popupList[i]);
					}
				}
				map.popupList = [];
			}).done(function(resp) {
						
				self.rawDataArr = resp;
						
				for(var i = 0; i < resp.length; i++){
					$popup = L.popup({
						maxWidth:200,          //가로 최대 크기
						offset:[30,0],          //오프셋
						keepInView:false,      //팝업이 열려 있는동안 지도 벗어나게 이동 막기
						autoPan:false,          //팝업창이 지도에서 안보일시 보이는 위치까지 자동 지도 이동
						closeButton:false,     //팝업 닫기 버튼 유,무
						autoClose:false,
						closeOnClick: false,
						'className':'dawul'    //팝업 테두리 없애기  (팝업 기본 테두리를 없애시려면 추가  중요:dw_popup.css 추가 시켜줘야 함.  테두리 제거 css가 들어있음)
					});
		
					map.popupList.push($popup);
								
					html_ = "<div class='flag flag-city l1'>";
								
					html_ += "<label><em>" + resp[i].시군구명 + "</em></label>";							
					html_ += "<div class='flag-body'>";							
					html_ += "<ul>";
					html_ += "<li>";
		
					html_ += "<strong>분양</strong>";
					html_ += "<span>" + z.toComma(resp[i].분양_cnt) + "</span>";
					html_ += "</li>";
					
					html_ += "<li>";							
					html_ += "<strong>임대료</strong>";
					html_ += "<span>" + z.toComma(resp[i].임대료_cnt) + "</span>";
					html_ += "</li>";
					
					html_ += "<li>";							
					html_ += "<strong>매매</strong>";
					html_ += "<span>" + z.toComma(resp[i].매매_cnt) + "</span>";
					html_ += "</li>";
					
					html_ += "<li>";							
					html_ += "<strong>실거래</strong>";
					html_ += "<span>" + z.toComma(resp[i].실거래_cnt) + "</span>";
					html_ += "</li>";
					
					html_ += "</ul>";
					html_ += "</div>";
					html_ += "</div>";																		
														
					$popup.setLatLng([resp[i].y, resp[i].x]);							
					$popup.setContent(html_);
					$popup.addTo(map);					
				}
							
				map_popup_item = $('.map-info-popup');
			    // 지도 말풍선 함수 실행  
			    map_popup_num = map_popup_item.length;			    
			    map_popup_stater(map_popup_num);
			    
		    	count	=	0;					    				    
									    
			})
		} else if(map.getZoom() < 5 && map.getZoom() > 1 && ls_year_length != '' && ls_sale + ls_rent + ls_trading + ls_realtran != "0000"){
			/*분양가*/
			return z.xAsync('dawulmap', 'zeons_마커생성_si', 'select', param, 'json2').always(function() {
				if (map.popupList && 0 < map.popupList.length) {			
					for (var i in map.popupList) {
						map.removeLayer(map.popupList[i]);
					}
				}
						
				map.popupList = [];
			}).done(function(resp) {
				self.rawDataArr = resp;
				for(var i = 0; i < resp.length; i++){
					$popup = L.popup({
						maxWidth:200,          //가로 최대 크기
						offset:[30,0],          //오프셋
						keepInView:false,      //팝업이 열려 있는동안 지도 벗어나게 이동 막기
						autoPan:false,          //팝업창이 지도에서 안보일시 보이는 위치까지 자동 지도 이동
						closeButton:false,     //팝업 닫기 버튼 유,무
						autoClose:false,
						closeOnClick: false,
						'className':'dawul'    //팝업 테두리 없애기  (팝업 기본 테두리를 없애시려면 추가  중요:dw_popup.css 추가 시켜줘야 함.  테두리 제거 css가 들어있음)
					});
	
					map.popupList.push($popup);
					html_ = "<div class='flag flag-city l1'>";
					html_ += "<label><em>" + resp[i].시도명 + "</em></label>";							
					html_ += "<div class='flag-body'>";							
					html_ += "<ul>";
					html_ += "<li>";
	
					html_ += "<strong>분양</strong>";
					html_ += "<span>" + z.toComma(resp[i].분양_cnt) + "</span>";
					html_ += "</li>";
					
					html_ += "<li>";							
					html_ += "<strong>임대료</strong>";
					html_ += "<span>" + z.toComma(resp[i].임대료_cnt) + "</span>";
					html_ += "</li>";
					
					html_ += "<li>";							
					html_ += "<strong>매매</strong>";
					html_ += "<span>" + z.toComma(resp[i].매매_cnt) + "</span>";
					html_ += "</li>";
					
					html_ += "<li>";							
					html_ += "<strong>실거래</strong>";
					html_ += "<span>" + z.toComma(resp[i].실거래_cnt) + "</span>";
					html_ += "</li>";
					
					html_ += "</ul>";
					html_ += "</div>";
					html_ += "</div>";															
											
					$popup.setLatLng([resp[i].y, resp[i].x]);							
					$popup.setContent(html_);
					$popup.addTo(map);				
				}
						
				map_popup_item = $('.map-info-popup');
			    // 지도 말풍선 함수 실행  
			    map_popup_num = map_popup_item.length;			    
			    map_popup_stater(map_popup_num);
			    
		    	count	=	0;		
			})
		}
	}						
}	//zoom 레벨 11이상 분양/임대료/실거래 조건에 따라 마커 숨김

function add_marker(p){
	//p.addTo(map);
	var id = setTimeout(function(){
		p.addTo(map);
	}, 5);
	settimeoutList.push(id);
}

function sample_marker_clear(){ // 마커 삭제
	if(marker != null){
		map.removeLayer(marker);
		marker = null;
		map.removeLayer(popup);
		popup = null;		
	}
}

function getPnu(obj) {
	var $this = $(obj),
	    lat = $this.attr('lat'),
		lng = $this.attr('lng'),  
		pnu = $this.attr('pnu'),           
		xy = $this.attr('xy'),
		click_name = $this.attr('z_status'),
		bunji = $this.attr('bunji'); 
	
	ls_lat = lat;
	ls_lng = lng;
	ls_bunji = bunji;		
	
	map_popup_visible2($this);
	
	if(ls_lng != ""){
		/* FIXME : 중심이동 하기 */
		map.setView(new L.LatLng((Number(ls_lng) + 0.0005).toFixed(8), ls_lat) , map.getZoom()); //지도 위치 이동  (좌표, 지도 레벨)
	    ls_click_move = '1';
	}	
	
	ls_click_name =	click_name;
	ls_xy =	xy;

	return;
	
	/*alert(lat + '@' + lng);*/
	/*129.111948	37.520497	4217010100110600002*/
	/*37.506733223290944@127.05217879689482@*/
	
	jHeader.serviceName = "REVERSE_GEOCODING";
	revBody.point = lng+","+lat;
	revBody.selectFields.geoType = "EMPTY";
	revBody.adminType = 'JIBUN_ADDRESS';
	revBody.spatialOperation = "NEARBY";	
	var jReqBody = {
		"header" : jHeader,
		"body" : revBody
	};

	var dataString = "callback=?&req="+encodeURIComponent(objectToJSONString(jReqBody));	
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
				if(pnu	==	0){
					ls_pnu	=	data.body.geojson.features[0].properties.pnu;
				}else{
					ls_pnu	=	pnu;
				}				
				/*addrname = data.body.geojson.features[0].properties.pnuname; // 지번 주소
*/			}else{
				alert("지정된위치를 찾을수 없습니다.");
				 return;
			}
			
			if(click_name == '임대료' || click_name == '실거래'){
				$('#building').removeClass('on');
				
				$('#mapPannel1').removeClass('d-flex');
				$('#mapPannel1_2').removeClass('d-flex');
				$('#mapPannel2').removeClass('d-flex');				
								
				$('#mapPannel1_2').addClass('d-none');
				$('#mapPannel2').addClass('d-none');
				
			}else if(click_name == '분양'){
				$('#building').removeClass('on');
				
				$('#mapPannel1').removeClass('d-flex');
				$('#mapPannel1_2').removeClass('d-flex');
				$('#mapPannel2').removeClass('d-flex');
				
				$('#mapPannel2').addClass('d-none');
				$('#mapPannel1_2').addClass('d-none');
				
			}else if(click_name == '실거래'){
				$('.z_leaflet-popup').removeClass('on');	
				
				$('#building').addClass("on");
				
				$('#building').parent().parent().parent().parent().css("z-index",1000);
				
				$('#mapPannel1').removeClass('d-flex');
				$('#mapPannel1_2').removeClass('d-flex');
				$('#mapPannel2').removeClass('d-flex');				
								
				$('#mapPannel1_2').addClass('d-none');
				$('#mapPannel2').addClass('d-none');
				
				ls_status	=	'0';				
			}
			apiBuildingDtl.fnOpenTable(ls_pnu,ls_click_name);
		}
	});
}


function getPnu2(lat,lng,pnu,xy,click_name,bunji) {		
	
	ls_lat = lat;
	ls_lng = lng;
	ls_bunji	=	bunji;		
		
	if(ls_lng != ""){
		map.setView(new L.LatLng((Number(ls_lng) + 0.0005).toFixed(8), ls_lat) , map.getZoom()); //지도 위치 이동  (좌표, 지도 레벨)
	    ls_click_move = '1';
	}			

	
	ls_click_name	=	click_name;
	ls_xy	=	xy;
	
	/*alert(lat + '@' + lng);*/
	
	/*129.111948	37.520497	4217010100110600002*/
	/*37.506733223290944@127.05217879689482@*/
	jHeader.serviceName = "REVERSE_GEOCODING";
	revBody.point = lng+","+lat;
	revBody.selectFields.geoType = "EMPTY";
	revBody.adminType = 'JIBUN_ADDRESS';
	revBody.spatialOperation = "NEARBY";	
	var jReqBody = {
		"header" : jHeader,
		"body" : revBody
	};
	
	var dataString = "callback=?&req="+encodeURIComponent(objectToJSONString(jReqBody));	
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
				if(pnu	==	0){
					ls_pnu	=	data.body.geojson.features[0].properties.pnu;
				}else{
					ls_pnu	=	pnu;
				}
				
				/*addrname = data.body.geojson.features[0].properties.pnuname; // 지번 주소
*/			}else{
				alert("지정된위치를 찾을수 없습니다.");
				 return;
			}
			
			if(click_name == '임대료' || click_name == '실거래'){
				$('#building').removeClass('on');
				
				$('#mapPannel1').removeClass('d-flex');
				$('#mapPannel1_2').removeClass('d-flex');
				$('#mapPannel2').removeClass('d-flex');				
								
				$('#mapPannel1_2').addClass('d-none');
				$('#mapPannel2').addClass('d-none');
				
			}else if(click_name == '분양'){
				$('#building').removeClass('on');
				
				$('#mapPannel1').removeClass('d-flex');
				$('#mapPannel1_2').removeClass('d-flex');
				$('#mapPannel2').removeClass('d-flex');
				
				$('#mapPannel2').addClass('d-none');
				$('#mapPannel1_2').addClass('d-none');
				
			}else{
				$('.z_leaflet-popup').removeClass('on');
		/*		_Taget.closest(map_popup_item).find('.z_leaflet-popup').parent().parent().parent().parent().css("z-index",z_index);
			    $('.z_leaflet-popup').removeClass('on');
			    _Taget.closest(map_popup_item).find('.z_leaflet-popup').addClass('on');*/		
						
				$('#building').addClass("on");
				
				$('#building').parent().parent().parent().parent().css("z-index",1000);
				
				$('#mapPannel1').removeClass('d-flex');
				$('#mapPannel1_2').removeClass('d-flex');
				$('#mapPannel2').removeClass('d-flex');				
								
				$('#mapPannel1_2').addClass('d-none');
				$('#mapPannel2').addClass('d-none');
				
				ls_status	=	'0';				
			}
			apiBuildingDtl.fnOpenTable(ls_pnu,ls_click_name);
		}
	});
}


function func(){	

    count = count +1;
    
	if(count > 3){
		clearInterval(time);
		return false;
	}
	
    if( count == 2 && ls_move_status == "1") {  // 카운트 진행중
    	ls_move_status	=	"0";
    	clearInterval(time);
		building_apiAddr.fnGps(map.getCenter(), map.getBounds());		
		
    	var bound = map.getBounds(),
		data = {
			'neLat': bound._northEast.lat,
			'neLng': bound._northEast.lng,
			'swLat': bound._southWest.lat,
			'swLng': bound._southWest.lng
    	};
    	/*0.0125*/
    	
    	/*0.0125*/
    	if(map.getZoom() == 13){
        	deltaX = 0.01115 * map.getZoom() - 0.14325,
        	deltaY = 0.006 * map.getZoom() - 0.0772;
    	}else if(map.getZoom() == 12){
        	deltaX = 0.00655 * map.getZoom() - 0.07800,
        	deltaY = 0.006 * map.getZoom() - 0.0722;
    	}else if(map.getZoom() > 12){
        	deltaX = 0.00625 * map.getZoom() - 0.06825,
        	deltaY = 0.006 * map.getZoom() - 0.063;
    	}
//    	deltaX = -0.0125,
//    	deltaY = -0.009;
//    	deltaX = 0,
//    	deltaY = 0;
//    	deltaX = (data.neLng - data.swLng) / 4,
//    	deltaY = (data.neLat - data.swLat) / 4;

		data.neLng += deltaX;
		data.swLng -= deltaX;
		data.neLat += deltaY;
		data.swLat -= deltaY;
		
		ls_neLat	=	data.neLat;
		ls_neLng	=	data.neLng;
		ls_swLat	=	data.swLat;
		ls_swLng	=	data.swLng;		
		
		console.log('func()');
        if(ls_click_move == "1"){
            sample_marker(data.neLat,data.neLng,data.swLat,data.swLng,ls_year_length);
            ls_click_move   =   "";
                        
        }else{        	
            sample_marker(data.neLat,data.neLng,data.swLat,data.swLng,ls_year_length);
            if(ls_xy != ""){
            	$('.' + ls_xy + '').parent().parent().parent().removeClass('on');
            }
            
            ls_xy   =   "";
            ls_click_move   =   "";
        }
    	ls_status = "0";
    }

}






//지도 말풍선 함수 
function map_popup_stater(_Num){
    map_popup_item.find('.popupopen').click(function (){
        var _this = $(this);
        map_popup_visible(_this);
    });

    $('.z_leaflet-popup-close-button').click(function (){
        map_popup_hide();
    });
    
    $('.z_leaflet-footer .btn').click(function (){
        map_popup_hide();
    });
    map_popup_item.hover(function(){    	
        map_popup_check = false;
    },function (){
    	
        map_popup_check = true;
    });
    map_popup_item.focusin(function() {
        map_popup_check = false;
    });

    map_popup_item.focusout(function() {
        map_popup_check = true;
    });
};

function map_popup_visible2(_Taget){	
	alert("map_popup_visible2");
	z_index	=	z_index + 1;
	console.log(z_index);
	console.log(map_popup_item);
	map_popup_item2 = $('.map-info-popup');
	
	/*$('.label-success').parent().parent().parent().parent().css("display","");*/
	_Taget.closest(map_popup_item2).find('.z_leaflet-popup').parent().parent().parent().parent().css("z-index",z_index);
	
	//if(ls_xy != ""){
		$('.z_leaflet-popup').removeClass('on');
	//}	
    _Taget.closest(map_popup_item2).find('.z_leaflet-popup').addClass('on');    
};

function map_popup_visible(_Taget){	
	z_index	=	z_index + 1;
	/*$('.label-success').parent().parent().parent().parent().css("display","");*/
	_Taget.closest(map_popup_item).find('.z_leaflet-popup').parent().parent().parent().parent().css("z-index",z_index);
    $('.z_leaflet-popup').removeClass('on');
    _Taget.closest(map_popup_item).find('.z_leaflet-popup').addClass('on');
};

function map_popup_hide(){	
    $('.z_leaflet-popup').removeClass('on');
};


/** PC버전 디폴트 세팅 **/
function defaultSetting(){
	$("#tooltipMapBtnViewM").css("display","none");
	$("#inputSearchM").css("display","none");
	$("#searchdFormM").remove();
	$("#naviPricePopM").remove();
}

//다국어 지도 변경
function languageMapChange() {	
	var baseMap = "";
	if(lan=="KOR") {  //국문지도
		baseMap = eval("L.Dawul.BASEMAP_GEN");
		ncodeDatas.cate[ncodeDatas.cate.length-1].depth = 2;
	}else {
		baseMap = eval("L.Dawul.BASEMAP_GEN_"+lan);
		ncodeDatas.cate[ncodeDatas.cate.length-1].depth = 1;
	}
	//다국어 체인지 함수 
	languageChange();
	geoBody.reqLang = lan;
	geoBody.resLang = lan;
	revBody.reqLang = lan;
	revBody.resLang = lan;
	subBody.reqLang = lan;
	subBody.resLang = lan;
	poiBody.reqLang = lan;
	poiBody.resLang = lan;
	naviBody.reqLang = lan;
	naviBody.resLang = lan;
	BaseMapChange(map, baseMap);	
}

function baseMapLanChange(mainUrl) {
	var lat = map.getCenter().lat;
	var lng = map.getCenter().lng;
	var level = map.getZoom();
	location.href=mainUrl+"&lat="+lat+"&lng="+lng+"&level="+level;
}

//지도 언어 변경 드롭다운
function languageListHover() {
	if($("#language_list_sub").css("display")=="none") {
		$("#language_tarrow").attr("class","l_tarrow");
		$("#language_list_sub").css("display","block");
		$("#language_list_form").css("height","100px");
	}else {
		$("#language_tarrow").attr("class","l_barrow");
		$("#language_list_sub").css("display","none");
		$("#language_list_form").css("height","30px");
	}
}

var baseMapCnt = 0;
var baseMapLandFlag = false;
//베이스맵 지도 변경
function baseMapChanges(type) {   //type(1 : 일반지도 , 2 : 부동산지도 , 3 : 위성지도)
	baseMapLandFlag = false;
	if(type==1) {
		/** 190829_JIK **/
		if($("#overJibun").is(':checked') || $("#overPlan").is(':checked') || $("#overYongdo").is(':checked') || $("#overGibok").is(':checked')){
			gridAllClear(1); // 격자 초기화(on/off 버튼 미표출)
		}else{
			gridAllClear(0); // 격자 초기화(on/off버튼 표출)
		}
		
		if(lan=="KOR") {  //국문지도
			baseMap = eval("L.Dawul.BASEMAP_GEN");
		}else {
			baseMap = eval("L.Dawul.BASEMAP_GEN_"+lan);
		}
		BaseMapChange(map, baseMap);  //일반 지도
		$("#overlay_list_off").css("display","none");
		$("#overlay_list_on").css("display","block");
		overlaySlideMode = true;
		$(".btnMapType1Close").removeClass('active');
		$("#btnMapType1").text('일반');
		$("#btnMapType1_1").addClass('active')		
		
		baseMapCnt = 1;
	}else if(type==2) { // 격자 초기화(on/off 버튼 미표출)
		/** 190829_JIK **/
		gridAllClear(1);
		
		BaseMapChange(map, L.Dawul.BASEMAP_LAND); // 부동산 지도
		$("#overlay_list_off").css("display","none");
		$("#overlay_list_on").css("display","none");
		overlaySlideMode = true;
		baseMapLandFlag = true;
		$(".btnMapType1Close").removeClass('active');
		$("#btnMapType1").text('부동산');
		$("#btnMapType1_2").addClass('active')
		baseMapCnt = 2;
	}else if(type==3) {
		/** 190829_JIK **/
		gridAllClear(1); // 격자 초기화(on/off 버튼 미표출)
		
		$("#overJibun").attr("checked", false);
		$("#overPlan").attr("checked", false);
		$("#overYongdo").attr("checked", false);
		$("#overGibok").attr("checked", false);
		OverMapChange(map, L.Dawul.OVERMAP_JIJUK, false);
		OverMapChange(map, L.Dawul.OVERMAP_DEVELOP, false);
		jiguClear();
		OverMapChange(map, L.Dawul.OVERMAP_YONGDO, false);
		OverMapChange(map, L.Dawul.OVERMAP_CONTOUR2, false);
		
		BaseMapChange(map, L.Dawul.BASEMAP_NAVER);  //위성 지도
		$("#overlay_list_off").css("display","block");
		$("#overlay_list_on").css("display","none");
		overlaySlideMode = false;
		$(".btnMapType1Close").removeClass('active');
		$("#btnMapType1").text('위성');
		$("#btnMapType1_3").addClass('active');
		baseMapCnt = 3;
	}
	if(overlaySlideMode && $("#overlay_list_on").css("height")=="121px") {
		$("#overlay_list_off").css("display","none");
		$("#overlay_list_on").css("display","block");
	}else {
		$("#overlay_list_off").css("display","block");
		$("#overlay_list_on").css("display","none");
	}
	$("#baseMapSelectForm > li > a").each(function(index,e) {
		if(index==type-1) {
			$(e).attr("class","on");
		}else {
			$(e).attr("class","off");
		}
	});
}

//오버레이 체크 리스트 드롭다운
function overlayListOnOff(mode) {   // mode (0:열기 , 1:닫기)
	if(overlaySlideMode) {
		if(mode==0) {
			$("#overlay_list_on").css("display","block");
			$("#overlay_list_on").animate({
			    height: "121px"
		  	}, 200 );
			$("#overlay_list_off").css("display","none");
		}else if(mode==1) {
			$("#overlay_list_off").css("display","block");
			$("#overlay_list_on").animate({
			    height: "29px"
		  	}, 200 , overListCallBack);
		}
	}
}

//오버레이 체크 리스트 드롭다운 닫기 콜백
function overListCallBack() {
	$("#overlay_list_on").css("display","none");
}

var overJibunOnOffFlag = false;
var overPlanOnOffFlag = false;
var overYongdoOnOffFlag = false;
var overGibokOnOffFlag = false;
//오버레이 맵 변경
function overlayMapChanges(this_) {			
	if(this_ == "1"){		
		if(overJibunOnOffFlag == true){
			$("#btnMapType2_1").removeClass('active');			
			overJibunOnOffFlag = false;
			OverMapChange(map, L.Dawul.OVERMAP_JIJUK, false);
		}else{
			$("#btnMapType2_1").addClass('active')
			OverMapChange(map, L.Dawul.OVERMAP_JIJUK);		
			overJibunOnOffFlag = true;
		}
	}else if(this_ == "2"){
		if(overPlanOnOffFlag == true){			
			$("#btnMapType2_2").removeClass('active');
			overPlanOnOffFlag = false;
			OverMapChange(map, L.Dawul.OVERMAP_DEVELOP, false);
		}else{
			$("#btnMapType2_2").addClass('active');
			OverMapChange(map, L.Dawul.OVERMAP_DEVELOP);		
			overPlanOnOffFlag = true;
		}
	}else if(this_ == "3"){
		if(overYongdoOnOffFlag == true){			
			$("#btnMapType2_3").removeClass('active');
			overYongdoOnOffFlag = false;
			OverMapChange(map, L.Dawul.OVERMAP_YONGDO, false);
		}else{
			$("#btnMapType2_3").addClass('active');
			OverMapChange(map, L.Dawul.OVERMAP_YONGDO);		
			overYongdoOnOffFlag = true;
		}
	}else if(this_ == "4"){
		if(overGibokOnOffFlag == true){			
			$("#btnMapType2_4").removeClass('active');
			overGibokOnOffFlag = false;
			OverMapChange(map, L.Dawul.OVERMAP_CONTOUR2, false);
		}else{
			$("#btnMapType2_4").addClass('active');
			OverMapChange(map, L.Dawul.OVERMAP_CONTOUR2);		
			overGibokOnOffFlag = true;
		}
	}
		
	/** 190829_JIK **/
	if($("#overJibun").is(':checked') || $("#overPlan").is(':checked') || $("#overYongdo").is(':checked') || $("#overGibok").is(':checked')){
		gridAllClear(1); // 격자 초기화(on/off버튼 미표출)
	}else{
		gridAllClear(0); // 격자 초기화(on/off버튼 표출)
		if(baseMapLandFlag == true){
			gridAllClear(1); // 격자 초기화(on/off버튼 미표출)
		}
	}
	
	if( this_.value == 0 ) { //실내지도
		if(this_.id=="indoor_on") {
			$("#indoor_off").prop("checked", this_.checked);
		}else if(this_.id=="indoor_off") {
			$("#indoor_on").prop("checked", this_.checked);
		}
	}else if( this_.value == 1){ // 편집지적
		if( $("#overJibun").is(':checked') ) {
			OverMapChange(map, L.Dawul.OVERMAP_JIJUK);
			
			overJibunOnOffFlag = true;
		}
		else {
			OverMapChange(map, L.Dawul.OVERMAP_JIJUK, false);
			
			overJibunOnOffFlag = false;
		}
	}else if( this_.value == 2){// 개발정보
		if( $("#overPlan").is(':checked') ){
			OverMapChange(map, L.Dawul.OVERMAP_DEVELOP);
			themeJiguLayerDraw(true);
			
			overPlanOnOffFlag = true;
		}
		else {
			OverMapChange(map, L.Dawul.OVERMAP_DEVELOP, false);
			jiguClear();
			
			overPlanOnOffFlag = false;
		}
	}else if( this_.value == 3){ // 용도계획
		if( $("#overYongdo").is(':checked') ){
			OverMapChange(map, L.Dawul.OVERMAP_YONGDO);
			
			overYongdoOnOffFlag = true;
		}
		else {
			OverMapChange(map, L.Dawul.OVERMAP_YONGDO, false);
			
			overYongdoOnOffFlag = false;
		}
	}else if( this_.value == 4){ // 기복도
		if( $("#overGibok").is(':checked') ){
			OverMapChange(map, L.Dawul.OVERMAP_CONTOUR2);
			
			overGibokOnOffFlag = true;
		}
		else {
			OverMapChange(map, L.Dawul.OVERMAP_CONTOUR2, false);			
			overGibokOnOffFlag = false;
		}
	}
}

function distStart() {	
	if(area != null && area._measuring == true){
		area._stopMeasuring();
		area._measuring = !area._measuring;
	}
	dist._measuring = !dist._measuring;
	if(dist._measuring) {
		ls_dist = "dist_on";
		$("#dist_b").css("background-color","#333333")
		$("#dist_b").css("color","#ffffff")
		$(".area > span").attr("class","off");
		$(".distance > span").attr("class","on");
	  	chkDist = true; // 우클릭 제어
	  	dist._startMeasuring();
	} else {
		ls_dist = "dist_off";
		$("#dist_b").css("background-color","#ffffff")
		$("#dist_b").css("color","#666666")
		$(".distance > span").attr("class","off");
		chkDist = false; // 우클릭 제어
		dist._stopMeasuring(); // 그리기 끝남.
	}
}

function distClear() {
	if(dist._layerPaint) {
		dist._layerPaint.clearLayers();
	}
}

function areaStart() {	
	if(dist != null && dist._measuring == true){
		dist._stopMeasuring();
		dist._measuring = !dist._measuring;
	}
	area._measuring = !area._measuring;
	if(area._measuring) {
		$(".area > span").attr("class","on");
		$(".distance > span").attr("class","off");
	  	chkDist = true; // 우클릭 제어
	  	area._startMeasuring();
	} else {
		$(".area > span").attr("class","off");
		chkDist = false; // 우클릭 제어
		area._stopMeasuring(); // 그리기 끝남.
	}
}

function areaClear() {
	if(area._layerPaint) {
		area._layerPaint.clearLayers();
	}
}

//줌 확대 축소 버튼
function zoomMode(mode) {	
	if(mode==0) {
		map.zoomIn(1,true);
	}else if(mode==1) {
		map.zoomOut(1,true);
	}
}

//검색 모드 변경
function searchModeChange(mode) {   //mode (0 : 통합검색 , 1 : 건물내 검색 , 2 : 길찾기)
	if(mode==0) {
		$("#searchListForm").attr("class","s_section");
		$("#searchOpen").css("display","");
		$("#searchOnOff").attr("class","ico_close");
				
		$("#searchListForm").css("display","none");
		$("#naviForm").css("display","none");
		$("#BuildingPOISearchForm").css("display","none");
		bSearchAllClear();
		navi_reset();
	}else if(mode==1) {
		$("#searchListForm").attr("class","s_section");
		$("#bSearchOpen").css("display","");
		$("#bSearchOnOff").attr("class","ico_close2");
				
		$("#searchListForm").css("display","none");
		$("#unifiedSearchForm").css("display","none");
		$("#naviForm").css("display","none");
		$("#BuildingPOISearchForm").css("display","");
		$("#inputSearch").val("");
		$("#inputSearchDel").css("display","none");
		searchClear();
		navi_reset();
	}else if(mode==2) {		
		$("#naviForm").css("display","");
		$("#naviOnOff").css("display","none");
		naviTab(0);
		naviTextForm();
		searchClear();
		bSearchAllClear();
		
		/** 190829_JIK **/
		gridAllClear(0); // 격자 초기화(on/off 버튼 표출)		
	}
}

function searchModeCloseBtn() {
	searchModeChange(0);
	if($("#inputSearch").val()!="") {
		unifiedSearch(0,1);
	}
}

//편의시설 2뎁스 함수 
function plant_sub_depth_visible(){
    $('#plant_sub_depth_box').addClass('active')
}
function plant_sub_depth_hide(){
    $('#plant_sub_depth_box').removeClass('active')
}


function onExpand(lat,lng) {
	map.setView(new L.LatLng(lat, lng) , 13); //지도 위치 이동  (좌표, 지도 레벨)
}

//자기자신만 이벤트
function stopProp() { 
	if(browser.name == 'msie'){
		window.event.cancelBubble = true; //IE
	}
	else {
		event.stopPropagation(); // ETC
	}
}

function tooltipClose() {
	for(var i=0; i<geoCodingSearchMarker.length; i++) {
		$(".JusoResult").eq(i).removeClass("on");
		geoCodingSearchMarker[i].popState = false;
		if($(".JusoResultIcon")[i]!=null) {
			$(".JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
		}
		if($(".navi_JusoResultIcon")[i]!=null) {
			$(".navi_JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
		}
		var iconOn = new L.Icon({
			iconUrl:geoCodingSearchMarker[i].markerImg,
			iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
		});
		geoCodingSearchMarker[i].setIcon(iconOn);
		geoCodingSearchMarker[i].closePopup();
	}
	
	for(var i=0; i<subGeoCodingSearchMarker.length; i++) {
		subGeoCodingSearchMarker[i].closePopup();
	}
	
	for(var i=0; i<poiSearchMarker.length; i++) {
		$(".PoiResult").eq(i).removeClass("on");
		poiSearchMarker[i].popState = false;
		if($(".POIResultIcon")[i]!=null) {
			$(".POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;
		}
		if($(".navi_POIResultIcon")[i]!=null) {
			$(".navi_POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;
		}
		var iconOn = new L.Icon({
			iconUrl:poiSearchMarker[i].markerImg,
			iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
		});
		poiSearchMarker[i].setIcon(iconOn);
		poiSearchMarker[i].closePopup();
	}
	
	for(var i=0; i<subPOISearchMarker.length; i++) {
		subPOISearchMarker[i].popState = false;
		subPOISearchMarker[i].closePopup();
	}
	
	if(buildingSearchMainMarker!=null) {
		buildingSearchMainMarker.popState = false;
		buildingSearchMainMarker.closePopup();
	}
	
	for(var i=0; i<bPoiSearchMarker.length; i++) {
		$(".bPOIResult").eq(i).removeClass("on");
		bPoiSearchMarker[i].popState = false;
		$(".bPOIResultIcon")[i].src = bPoiSearchMarker[i].listMarkerImg;
		var iconOn = new L.Icon({
			iconUrl:bPoiSearchMarker[i].markerImg,
			iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
		});
		bPoiSearchMarker[i].setIcon(iconOn);
		bPoiSearchMarker[i].closePopup();
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
	
	if(mapCopyMarker!=null) {
		mapCopyMarker.popState = false;
		mapCopyMarker.closePopup();
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
				color : "#FF0000",
				opacity : 1,
				fillColor : "#FF0000",
				fillOpacity : 1
			});
			
			$(".naviResultIcon").eq(i).attr("src",'/resources/common/custom/images/naviImg/num/rnum'+(i+1)+'.png');
			naviInfoMk[i].closePopup();
		}
		$(".naviResult").removeClass("on");
	}
	
	if(naviStartMk!=null) {
		naviStartMk.popState=false;
		naviStartMk.closePopup();
		$(".naviStart").removeClass("on");
	}
	
	if(naviEndMk!=null) {
		naviEndMk.popState=false;
		naviEndMk.closePopup();
		$(".naviEnd").removeClass("on");
	}
	
	if(naviMiddleMk.length>0) {
		for(var i=0; i<naviMiddleMk.length; i++) {
			naviMiddleMk[i].popState=false;
			naviMiddleMk[i].closePopup();
		}
		$(".naviMiddle").removeClass("on");
	}
}


//--------------------------- 개발정보 -------------------------------------------------

function themeJiguLayerDraw(autoPan) {
	if(map.getZoom()>7) {
		var bound = this.map.getBounds();
		var sw = bound.getSouthWest();
		var ne = bound.getNorthEast();
		var min = Coord_Trans('wgstoutmk', new PT(sw.lng, sw.lat));
		var max = Coord_Trans('wgstoutmk', new PT(ne.lng, ne.lat));
		jHeader.serviceName = "EXTENSION_SEARCH";
		extBody.conditions = {};
		extBody.conditions.geometry = {};
		extBody.conditions.geometry.spatialOp = "INTERSECT";
		extBody.conditions.geometry.mbr = {};
		extBody.conditions.geometry.mbr.maxx = max.x;
		extBody.conditions.geometry.mbr.maxy = max.y;
		extBody.conditions.geometry.mbr.minx = min.x;
		extBody.conditions.geometry.mbr.miny = min.y;
		extBody.selectFields.geoType = "ORIGIN";
		extBody.contentName = "takji";
		var jReqBody = {
			"header" : jHeader,
			"body" : extBody
		};
		delete extBody.page;
		
		var dataString = "callback=?&req="+encodeURIComponent(objectToJSONString(jReqBody));
		
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
				while (jiguMarker.length > 0) {
					map.removeLayer(jiguMarker[jiguMarker.length - 1]);
					jiguMarker.pop();
				}
				while (jiguLayer.length > 0) {
					map.removeLayer(jiguLayer[jiguLayer.length - 1]);
					jiguLayer.pop();
				}
				
				if(data.body.geojson!=undefined) {
					var features = data.body.geojson.features; // ID 개수
					var list = "";
					var jiguIdCheck = false;
					for ( var i = 0; i < features.length; i++) {
						var feature = features[i];
						if(feature.properties.jigu_type2!="준공") {
							var chk = false;
							for(var j=0; j<chkTakji.length; j++){
								if(feature.properties.ucode == chkTakji[j]){ // 기존데이터중에 조건이 일치하면
									chk = true;
									break;
								}
							}
							if(!chk || (chk && map.getZoom()>10)) {
								if(map.getZoom()>9) {
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
									
									
									jiguLayer.push(new L.GeoJSON(
										feature, {
											style : function() {
												return {
													color: '#08a65d',
									                weight: 2,
									                opacity: 1,
									              	dashArray: '5, 5',
									              	fill: true,
									              	fillColor: '#08a65d',
									              	fillOpacity: 0.1,
									              	clickable: false
								              	};
											}
									}).addTo(map));
									
								}
							
								var ucode = feature.properties.ucode;
								var x_pos = "";
								var y_pos = "";
								if(feature.properties.x!="" && feature.properties.y!="") {
									x_pos = feature.properties.x;
									y_pos = feature.properties.y;	
								}else {
									x_pos = feature.properties.x_pos;
									y_pos = feature.properties.y_pos;
								}
								var geoWgs = Coord_Trans("utmktowgs", new PT(x_pos, y_pos));
								jiguMarker.push(new L.Marker(new L.LatLng(geoWgs.y, geoWgs.x),{icon: new L.Icon({   // 마커 찍기
							    	iconUrl: "/resources/common/custom/images/pin/"+themeJiguMkIcon(ucode),   //핀 이미지
							    	iconSize:[67,32],
									iconAnchor:[33,35],
									popupAnchor:[0,-16]
								})}).addTo(map));
								jiguMarker[jiguMarker.length-1].popState = false;
								jiguMarker[jiguMarker.length-1].feature = feature;
								jiguMarker[jiguMarker.length-1].bindPopup(tooltip.themeContent(feature,1),{autoPan:autoPan,minWidth:362,offset:[0,-10],'className':'dawul'});								
								jiguMarker[jiguMarker.length-1].on("click",function(e) {
									if(this.popState) {
										this.popState = false;
										jiguSelectMid = "";
									}else {
										if(rightClickPop!=null) {
											map.closePopup(rightClickPop);
										}
										this.popState = true;
										this.bindPopup(tooltip.themeContent(this.feature,1),{autoPan:true,minWidth:362,offset:[0,-10],'className':'dawul'});
										jiguSelectMid = this.feature.properties.jigu_id;
										for(var i=0; i<geoCodingSearchMarker.length; i++) {
											geoCodingSearchMarker[i].popState = false;
											if($(".JusoResultIcon")[i]!=null) {
												$(".JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
											}
											if($(".navi_JusoResultIcon")[i]!=null) {
												$(".navi_JusoResultIcon")[i].src = geoCodingSearchMarker[i].listMarkerImg;
											}
											var iconOn = new L.Icon({
												iconUrl:geoCodingSearchMarker[i].markerImg,
												iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
											});
											geoCodingSearchMarker[i].setIcon(iconOn);
										}
										
										for(var i=0; i<poiSearchMarker.length; i++) {
											poiSearchMarker[i].popState = false;
											if($(".POIResultIcon")[i]!=null) {
												$(".POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;
											}
											if($(".navi_POIResultIcon")[i]!=null) {
												$(".navi_POIResultIcon")[i].src = poiSearchMarker[i].listMarkerImg;
											}
											var iconOn = new L.Icon({
												iconUrl:poiSearchMarker[i].markerImg,
												iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
											});
											poiSearchMarker[i].setIcon(iconOn);
										}
										
										for(var i=0; i<subPOISearchMarker.length; i++) {
											subPOISearchMarker[i].popState = false;
										}
										
										if(buildingSearchMainMarker!=null) {
											buildingSearchMainMarker.popState = false;
										}
										
										for(var i=0; i<bPoiSearchMarker.length; i++) {
											bPoiSearchMarker[i].popState = false;
											$(".bPOIResultIcon")[i].src = bPoiSearchMarker[i].listMarkerImg;
											var iconOn = new L.Icon({
												iconUrl:bPoiSearchMarker[i].markerImg,
												iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
											});
											bPoiSearchMarker[i].setIcon(iconOn);
										}
										
										for(var i=0; i<ncodeSearchMarker.length; i++) {
											ncodeSearchMarker[i].popState = false;
											ncodeSearchMarker[i].closePopup();
										}
										ncodeSelectMid = "";
										
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
													color : "#FF0000",
													opacity : 1,
													fillColor : "#FF0000",
													fillOpacity : 1
												});
												
												$(".naviResultIcon").eq(i).attr("src",'/resources/common/custom/images/naviImg/num/rnum'+(i+1)+'.png');
											}
											$(".naviResult").removeClass("on");
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
									}
								});
								if(jiguSelectMid==feature.properties.jigu_id) {
									jiguIdCheck = true;
									jiguMarker[jiguMarker.length-1].popState = true;
									jiguMarker[jiguMarker.length-1].openPopup();
								}
							}
						}
					}
					if(!jiguIdCheck) {
						jiguSelectMid = "";
					}
				}
			}
		});
	}else {
		jiguClear();
	}
}


function jiguClear() {
	jiguSelectMid = "";
	
	while (jiguMarker.length > 0) {
		map.removeLayer(jiguMarker[jiguMarker.length - 1]);
		jiguMarker.pop();
	}
	while (jiguLayer.length > 0) {
		map.removeLayer(jiguLayer[jiguLayer.length - 1]);
		jiguLayer.pop();
	}
}

function themeJiguMkIcon(ucode) {
	var icon = "";
	if(ucode == "UQQ300" || ucode == "UQQ310" || ucode == "UQQ320"){ // 지구단위계획
		icon = "landplan_1.png";
	}else if(ucode == "UDT101"){ // 주택재개발
		icon = "landplan_2.png";
	}else if(ucode == "UDT102"){ // 주택재건축
		icon = "landplan_3.png";
	}else if(ucode == "UDW100"){ // 도시개발
		icon = "landplan_4.png";
	}else if(ucode == "UBI100"){ // 경제자유
		icon = "landplan_5.png";
	}else if(ucode == "UBQ100"){ // 혁신도시
		icon = "landplan_6.png";
	}else if(ucode == "UBF100" || ucode == "UBF200" || ucode == "UBF300"){ // 기업도시
		icon = "landplan_7.png";
	}else if(ucode == "UDQ100"){ // 구획지구
		icon = "landplan_8.png";
	}else if(ucode == "UHE100" || ucode == "UHA100" || ucode == "UHA210" || ucode == "UHA220" || ucode == "UHA300"){ // 산업단지
		icon = "landplan_9.png";
	}else if(ucode == "UDA101"){ // 뉴타운
		icon = "landplan_10.png";
	}else if(ucode == "UDP100"){ // 택지지구
		icon = "landplan_11.png";
	}else if(ucode == "UDA100" || ucode == "UDS100" || ucode == "UDT100" || ucode == "UDT103"){ // 도시재정비
		icon = "landplan_12.png";
	}else if(ucode == "UDP101"){ // 신도시
		icon = "landplan_13.png";
	}else if(ucode == "UDL100" || ucode == "UDL101" || ucode == "UDL102" || ucode == "UDL103" || ucode == "UDL104" || ucode == "UDL105" || ucode == "UDL106"){ // 공공주택
		icon = "landplan_14.png";
	}else if(ucode == "UHD100" || ucode == "UBH200" || ucode == "UBH300"){ // 제주국제도시
		icon = "landplan_15.png";
	}else if(ucode == "UDE100"){ // 민간임대주택
		icon = "landplan_16.png";
	}else if(ucode == "UDB100"){ // 도청이전신도시
		icon = "landplan_17.png";
	}else if(ucode == "UQQ321"){ // 도시재생뉴딜
		icon = "landplan_18.png";
	}
	return icon;
}

//--------------------------- //개발정보 -------------------------------------------------


//--------------------------- 주변검색 -------------------------------------------------
function ncodeHover() {  //주변검색 마우스 클릭	
	if($("#m_nearby2").css("display")=="none") {
		$("#m_nearby2").css("display","block");
		
		$("#m_nearby2_sub2_form").css("display","none");
		$("#m_nearby2_sub3_form").css("display","none");
		$("#m_nearby2_sub2").css("display","none");
		$("#m_nearby2_sub3").css("display","none");
		
		if(ncodePOISearchCheck) {
			$("#m_nearby").attr("class","m_nearby_on");
		}else {
			$("#m_nearby").attr("class","m_nearby");
		}
	}else {		
		$("#m_nearby2").css("display","none");
		
		$("#m_nearby2_sub1 > li").each(function(index,e) {
			if($(e).hasClass("on") || $(e).hasClass("on2")) {
				if(!ncodePOISearchCheck) {
					ncodeIndex = null;
					ncodeIndex2 = null;
					ncode1depthOnOff("off",e)
				}else {
					ncode1depthOnOff("on2",e)
				}
			}
		});
	}
}



function ncode1depthOnOff(mode,tag) {   //mode (on , off)
/*	if(mode=="on" || mode=="on2") {
		$(tag).removeClass("off");
		$(tag).removeClass("on");
		$(tag).removeClass("on2");
		$(tag).addClass(mode);
		var src = $(tag).find("img").attr("src");
		$(tag).find("img").attr("src",src.replace("off","on"));
	}else if(mode=="off") {
		$(tag).removeClass("on");
		$(tag).removeClass("on2");
		$(tag).addClass(mode);
		var src = $(tag).find("img").attr("src");
		$(tag).find("img").attr("src",src.replace("on","off"));
	}*/
}


function ncodeClickSubDepth(selectIndex) {
	var ls_code = ncodeDatas.cate[ncodeIndex].code;
	var liTags = $("#m_nearby2_sub1_1 li");
	liTags.each(function(index,e) {
		if(index!=selectIndex) {
			ncode1depthOnOff("off",e);
		}else {
			if($(e).hasClass("on") || $(e).hasClass("on2")) {
				if(ncodeDatas.cate[index].depth==2) {					
					$("#m_nearby2_sub3_form").css("display","none");
					$("#m_nearby2_sub3").css("display","none");
					ncode2depthLayout(e,$("#m_nearby2_sub2_form"))
				}else {					
					ncodeIndex = null;
					ncodeIndex2 = null;
					ncodePOISearchClear();  //ncode 마커 삭제
					ncode1depthOnOff("off",e);
					$("#m_nearby2_sub2_form").css("display","none");
					$("#m_nearby2_sub3_form").css("display","none");
					$("#m_nearby2_sub2").css("display","none");
					$("#m_nearby2_sub3").css("display","none");
					$("#m_nearby2_sub2").html("");
					$("#m_nearby2_sub3").html("");
				}
			}else {				
				if(ncodeDatas.cate[index].depth==2) {					
					ncode1depthOnOff("on",e);
					ncodePOISearchClear();  //ncode 마커 삭제
					$("#m_nearby2_sub2_form").css("display","block");
					$("#m_nearby2_sub3_form").css("display","none");
					$("#m_nearby2_sub2").css("display","block");
					$("#m_nearby2_sub3").css("display","none");
					ncodeList(ncodeDatas.cate[index].depth,$("#m_nearby2_sub2"),index);				

				}else {					
					if($(e).attr("class")=="sub_depth_in off more_none") {						
						ncode1depthOnOff("on2",e);
						$("#m_nearby2_sub2_form").css("display","none");
						$("#m_nearby2_sub3_form").css("display","none");
						$("#m_nearby2_sub2").css("display","none");
						$("#m_nearby2_sub3").css("display","none");
						$("#m_nearby2_sub2").html("");
						$("#m_nearby2_sub3").html("");
						ls_code = ncodeDatas.cate[index].code;						
						ncodePOISearch(ncodeDatas.cate[index].code, ncodeDatas.cate[index].image,true);
					}else{						
						ncodePOISearchClear();  //ncode 마커 삭제
					}
				}
			}
		}
	});
}

function ncodeClickSubDepth2(selectIndex) {	
	var liTags2 = $("#m_nearby2_sub1_2 li");
	liTags2.each(function(index,e) {
		if(index!=selectIndex) {
			ncode1depthOnOff("off",e);			
		}else {
			if($(e).hasClass("on") || $(e).hasClass("on2")) {
				if(ncodeDatas2.cate[index].depth==2) {
					$("#m_nearby2_sub3_form").css("display","none");
					$("#m_nearby2_sub3").css("display","none");
					ncode2depthLayout(e,$("#m_nearby2_sub2_form"))
				}else {
					ncodeIndex = null;
					ncodeIndex2 = null;
					ncodePOISearchClear();  //ncode 마커 삭제
					ncode1depthOnOff("off",e);
					$("#m_nearby2_sub2_form").css("display","none");
					$("#m_nearby2_sub3_form").css("display","none");
					$("#m_nearby2_sub2").css("display","none");
					$("#m_nearby2_sub3").css("display","none");
					$("#m_nearby2_sub2").html("");
					$("#m_nearby2_sub3").html("");
				}
			}else {
				if(ncodeDatas2.cate[index].depth==2) {
					ncode1depthOnOff("on",e);
					ncodePOISearchClear();  //ncode 마커 삭제
					
					$("#m_nearby2_sub2_form").css("display","block");
					$("#m_nearby2_sub3_form").css("display","none");
					$("#m_nearby2_sub2").css("display","block");
					$("#m_nearby2_sub3").css("display","none");
					ncodeList2(ncodeDatas2.cate[index].depth,$("#m_nearby2_sub2"),index);
				}else {
					if($(e).attr("class")=="sub_depth_in off more_none") {
						ncode1depthOnOff("on2",e);
						$("#m_nearby2_sub2_form").css("display","none");
						$("#m_nearby2_sub3_form").css("display","none");
						$("#m_nearby2_sub2").css("display","none");
						$("#m_nearby2_sub3").css("display","none");
						$("#m_nearby2_sub2").html("");
						$("#m_nearby2_sub3").html("");
						ncodePOISearch(ncodeDatas2.cate[index].code, ncodeDatas2.cate[index].image,true);
						
					}else {
						ncodePOISearchClear();  //ncode 마커 삭제
					}
				}
			}
		}
	});	
}

	


function ncode2depthLayout(depth1Layout, depth2Layout) {
	if(depth2Layout.css("display")=="block") {
		depth2Layout.css("display","none");
		depth2Layout.find("ul").css("display","none");
		var subSelectCheck = false;
		depth2Layout.find("a").each(function(subIndex,e) {
			if($(e).hasClass("on")) {
				subSelectCheck = true;
			}
		});
		if(subSelectCheck) {
			ncode1depthOnOff("on2",depth1Layout);
		}else {
			ncodePOISearchClear();  //ncode 마커 삭제
			ncode1depthOnOff("off",depth1Layout);
		}
	}else {
		depth2Layout.css("display","block");
		depth2Layout.find("ul").css("display","block");
		ncode1depthOnOff("on",depth1Layout);
	}
}

function ncodeList(depth,tag,index) {	
	var list ="";
	if(depth==1) {
		for(var i=0; i<ncodeDatas.cate.length; i++) {
			//동적 다국어 변경
			var cateName = "";
			if(lan=="KOR") {
				cateName = ncodeDatas.cate[i].korName;
			}else if(lan=="ENG") {
				cateName = ncodeDatas.cate[i].engName;
			}else if(lan=="JAN") {
				cateName = ncodeDatas.cate[i].jpnName;
			}else if(lan=="CHINAG") {
				cateName = ncodeDatas.cate[i].chnName;
			}
			if(ncodeDatas.cate[i].depth!=2) {
				list += '<li class="sub_depth_in off more_none"><a href="javascript:;"><img src="/resources/common/custom/images/ico/nearby'+(i+1)+'_off.png" alt="" />'+cateName+'<span></span></a></li>';
			}else {
				list += '<li class="sub_depth_in off"><a href="javascript:;"><img src="/resources/common/custom/images/ico/nearby'+(i+1)+'_off.png" alt="" />'+cateName+'<span></span></a></li>';
			}
		}
		
		$("#m_nearby2_sub1_1").html(list);
	}else if(depth==2) {
		for(var i=0; i<ncodeDatas.cate[index].subcate.length; i++) {
			//동적 다국어 변경
			var cateName = "";
			if(lan=="KOR") {
				cateName = ncodeDatas.cate[index].subcate[i].korName;
			}else if(lan=="ENG") {
				cateName = ncodeDatas.cate[index].subcate[i].engName;
			}else if(lan=="JAN") {
				cateName = ncodeDatas.cate[index].subcate[i].jpnName;
			}else if(lan=="CHINAG") {
				cateName = ncodeDatas.cate[index].subcate[i].chnName;
			}
			list += '<li><a href="javascript:;" class="" onclick="ncodeSearch('+index+','+i+');">'+cateName+'<span></span></a></li>';
		}
		tag.html(list);
	}	
}

function ncodeList2(depth,tag,index) {
	var list2 ="";
	if(depth==1) {
		for(var i=0; i<ncodeDatas2.cate.length; i++) {
			//동적 다국어 변경
			var cateName2 = "";
			if(lan=="KOR") {
				cateName2 = ncodeDatas2.cate[i].korName;
			}else if(lan=="ENG") {
				cateName2 = ncodeDatas2.cate[i].engName;
			}else if(lan=="JAN") {
				cateName2 = ncodeDatas2.cate[i].jpnName;
			}else if(lan=="CHINAG") {
				cateName2 = ncodeDatas2.cate[i].chnName;
			}
			if(ncodeDatas2.cate[i].depth!=2) {
				list2 += '<li class="sub_depth_in off more_none"><a href="javascript:;"><img src="/resources/common/custom/images/ico/nearby'+(i+1)+'_off.png" alt="" />'+cateName2+'<span></span></a></li>';
			}else {
				list2 += '<li class="sub_depth_in off"><a href="javascript:;"><img src="/resources/common/custom/images/ico/nearby'+(i+1)+'_off.png" alt="" />'+cateName2+'<span></span></a></li>';
			}
		}
		
		$("#m_nearby2_sub1_2").html(list2);
	}else if(depth==2) {
		for(var i=0; i<ncodeDatas2.cate[index].subcate.length; i++) {
			//동적 다국어 변경
			var cateName2 = "";
			if(lan=="KOR") {
				cateName2 = ncodeDatas2.cate[index].subcate[i].korName;
			}else if(lan=="ENG") {
				cateName2 = ncodeDatas2.cate[index].subcate[i].engName;
			}else if(lan=="JAN") {
				cateName2 = ncodeDatas2.cate[index].subcate[i].jpnName;
			}else if(lan=="CHINAG") {
				cateName2 = ncodeDatas2.cate[index].subcate[i].chnName;
			}
			list2 += '<li><a href="javascript:;" class="" onclick="ncodeSearch2('+index+','+i+');">'+cateName2+'<span></span></a></li>';
		}
		tag.html(list2);
	}	
}


function ncodeSearch(index1,index2) {	
	/** 190829_JIK **/
	if(gridFlag == true){ gridAllClear(0); } // ncdoe 검색 시 초기화
		
	ls_code = ncodeDatas.cate[index1].subcate[index2].code;
	img = ncodeDatas.cate[index1].image;
		
	$("#m_nearby2_sub2 > li > a").each(function(index,e) {
		if(index==index2) {
			$(e).toggleClass("on");
			if($(e).attr("class")=="on") {				
				ncodePOISearch(ls_code, img, true);
			}else {
				ncodePOISearchClear();  //ncode 마커 삭제
			}
		}else {
			$(e).attr("class","");
		}
	});
}

function ncodeSearch2(index1,index2) {
	/** 190829_JIK **/
	if(gridFlag == true){ gridAllClear(0); } // ncdoe 검색 시 초기화
		
	ls_code = ncodeDatas2.cate[index1].subcate[index2].code;
	img = ncodeDatas2.cate[index1].image;
		
	$("#m_nearby2_sub2 > li > a").each(function(index,e) {
		if(index==index2) {
			$(e).toggleClass("on");
			if($(e).attr("class")=="on") {
				ncodePOISearch(ls_code, img, true);
			}else {
				ncodePOISearchClear();  //ncode 마커 삭제
			}
		}else {
			$(e).attr("class","");
		}
	});
}

var startTime1 = null;
var startTime2 = null;
var endTime = null;
function ncodePOISearch(code, img, autoPan) {
	ls_code = code;
	ls_img		=	img;	
	ncodePOISearchCheck = true;
	if(map.getZoom()>10) {
		var bound = this.map.getBounds();
		var sw = bound.getSouthWest();
		var ne = bound.getNorthEast();
		var min = Coord_Trans('wgstoutmk', new PT(sw.lng, sw.lat));
		var max = Coord_Trans('wgstoutmk', new PT(ne.lng, ne.lat));
		
		jHeader.serviceName = "POI";
		poiBody.crs = "UTMK";
		poiBody.fulltext = "";
		poiBody.field = [];
		poiBody.field[0] = {};
		poiBody.field[0].name = "ncode";
		poiBody.field[0].value = code;
		poiBody.mbr = {};
		poiBody.mbr.maxx = max.x;
		poiBody.mbr.maxy = max.y;
		poiBody.mbr.minx = min.x;
		poiBody.mbr.miny = min.y;
		poiBody.page = {};
		poiBody.page.cnt = 80;
		poiBody.page.pageNo = 1;
		//delete poiBody.page;
		var jReqBody = {
			"header" : jHeader,
			"body" : poiBody
		};
		
		var dataString = "callback=?&req="+encodeURIComponent(objectToJSONString(jReqBody));
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
				while(ncodeSearchMarker.length > 0){
					map.removeLayer(ncodeSearchMarker[ncodeSearchMarker.length - 1]);
					ncodeSearchMarker.pop();
				}
				if(data.body.geojson!=undefined) {
					var countID = data.body.geojson.features.length;
					var markerImg = "";
					
					/// 여기 poi 리스트 작업해야함. 
					
					var midCheck = false;
					for(var i = 0; i<countID; i++){
						var feature = data.body.geojson.features[i];
	
						var UtmkX = feature.geometry.coordinates[0];
						var UtmkY = feature.geometry.coordinates[1];
						
						var geoWgs = Coord_Trans("utmktowgs", new PT(UtmkX, UtmkY));
						feature.geometry.coordinates[0] = geoWgs.y;
						feature.geometry.coordinates[1] = geoWgs.x;
						
						ncodeSearchMarker.push(new L.Marker(new L.LatLng(geoWgs.y , geoWgs.x),{icon: new L.Icon({   // 마커 찍기
					    	iconUrl: img,   //핀 이미지
					    	iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
						})}).addTo(map));
						
						ncodeSearchMarker[ncodeSearchMarker.length-1].markerImg = markerImg;
						
						ncodeSearchMarker[ncodeSearchMarker.length-1].feature = feature;
						ncodeSearchMarker[ncodeSearchMarker.length-1].popState = false;
						ncodeSearchMarker[ncodeSearchMarker.length-1].index = ncodeSearchMarker.length-1;
						/*ncodeSearchMarker[ncodeSearchMarker.length-1].bindPopup(tooltip.makePOIContent(feature),{autoPan:autoPan,minWidth:362,offset:[0,-20],'className':'dawul'});*/
						
						if(ncodeSelectMid==feature.properties.mid) {
							midCheck = true;
							ncodeSearchMarker[ncodeSearchMarker.length-1].popState = true;
							ncodeSearchMarker[ncodeSearchMarker.length-1].openPopup();
						}
					}
					if(!midCheck) {
						ncodeSelectMid = "";
					}
				}else {
					
				}
			}
		});
	}else {
		while(ncodeSearchMarker.length > 0){
			map.removeLayer(ncodeSearchMarker[ncodeSearchMarker.length - 1]);
			ncodeSearchMarker.pop();
		}
	}
}


function ncodePOISearchClear() {
	ncodePOISearchCheck = false;
	ncodeSelectMid = "";
	while(ncodeSearchMarker.length > 0){
		map.removeLayer(ncodeSearchMarker[ncodeSearchMarker.length - 1]);
		ncodeSearchMarker.pop();
	}
}

//--------------------------- //주변검색 -------------------------------------------------



function getAddress(lat,lng,adminType) {
					
	
	ls_lng	=	 lng;
	ls_lat	=	 lat;
	
	/*ls_status = "1";*/
	jHeader.serviceName = "REVERSE_GEOCODING";
	revBody.point = lat+","+lng;
	revBody.selectFields.geoType = "EMPTY";
	revBody.adminType = adminType;
	revBody.spatialOperation = "NEARBY";	
	var jReqBody = {
		"header" : jHeader,
		"body" : revBody
	};
	
	var dataString = "callback=?&req="+encodeURIComponent(objectToJSONString(jReqBody));	
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
			map.closePopup(rightClickPop);
			var geojson = data.body.geojson;
			if(geojson!=null) {
				var addrname = "";
				if(adminType=="ROAD_ADDRESS") {					
					addrname = data.body.geojson.features[0].properties.newrpnuname; // 도로명주소
				}else {					
					addrname = data.body.geojson.features[0].properties.pnuname; // 지번 주소
				}				
				
				
				z.xAsync('dawulmap', 'zeons_건물_상세정보', 'select', {pnu : data.body.geojson.features[0].properties.pnu}, 'json2').done(function(resp) {
					if(resp == ''){						
						return;
					}
					
					setTimeout(function() {			
						$('#g_wdate').text(resp[0].사용승인일);
					}, 230);
					
				});
				
				/*$("#searchListForm").css("display","none");*/
				
				$("#inputSearch").val(addrname);
				
				unifiedSearch(0,1);
				
				$("#searchListForm").css("display","none");
			}else {
				if(lan=="KOR") {
					alert("선택한 위치의 주소를 찾을 수 없습니다.");	
				}else if(lan=="ENG") {
					alert("The address of the selected location can not be found.");
				}else if(lan=="JAN") {
					alert("選択した位置のアドレスが見つかりません。");
				}else if(lan=="CHINAG") {
					alert("找不到所选位置的地址。");
				}
			}
			
	
		}
	});	
}

//건물내 장소보기

function bSearchAllClear() {
	bSearchMainClear();
	bSearchPOIClear();
}

function bSearchMainClear() {
	if(buildingSearchMainMarker!=null) {
		map.removeLayer(buildingSearchMainMarker);
		buildingSearchMainMarker = null;
	}
	if(buildingSearchLayer!=null) {
		map.removeLayer(buildingSearchLayer);
		buildingSearchLayer = null;
	}
	$("#buildingSearchForm").html("");
}

function bSearchPOIClear() {
	while (bPoiSearchMarker.length>0) {
		map.removeLayer(bPoiSearchMarker[bPoiSearchMarker.length - 1]);
		bPoiSearchMarker.pop();
	}
	$("#buildingPOISearchForm").html("");
}


function bSearchOnOff() {
	if($("#bSearchOpen").css("display")=="none") {
		$("#searchListForm").attr("class","s_section");
		$("#bSearchOpen").css("display","");
		$("#bSearchOnOff").attr("class","ico_close2");
	}else {
		$("#searchListForm").attr("class","s_section2 c_size2");
		$("#bSearchOpen").css("display","none");
		$("#bSearchOnOff").attr("class","ico_open2");
	}
}

//--------------------------- //마우스 우클릭 ------------------------------------------------



//공간데이터 무게중심 좌표 구하기
function centerCoord(coordType,geometry) {    //coordType (GRS_80 , UTMK)
	var coordinates = [];
	var coords = [];
	
	if (geometry.type == "LineString") { // 2배열 라인
		coordinates = geometry.coordinates;
	}else if(geometry.type == "MultiLineString" || geometry.type == "Polygon") { // 3배열
		var cntCoord = geometry.coordinates.length;
		var max = 0;
		var index = 0;
		for(var i=0; i<cntCoord; i++) {
			if(max<geometry.coordinates[i].length) {
				index = i;
				max = geometry.coordinates[i].length;
			}
		}
		coordinates = geometry.coordinates[index];
	}else if(geometry.type == "MultiPolygon") { // 4배열 멀티폴리곤
		var cntCoord = geometry.coordinates.length;
		var max = 0;
		var index1 = 0;
		var index2 = 0;
		for(var i=0; i<cntCoord; i++) {
			var cntCoord2 = geometry.coordinates[i].length;
			for(var j=0; j<cntCoord2; j++) {
				if(max<geometry.coordinates[i][j].length) {
					index1 = i;
					index2 = j;
					max = geometry.coordinates[i][j].length;
				}
			}
		}
		coordinates = geometry.coordinates[index1][index2];
	}
	
	if(coordType=="GRS_80") {
		for(var i=0; i<coordinates.length; i++) {
			coords[i] = [];
			var lat = coordinates[i][0];
			var lng = coordinates[i][1];
			var utmks = Coord_Trans("wgstoutmk", new PT(lng, lat));
			coords[i][0] = utmks.x;
			coords[i][1] = utmks.y;
		}
	}else {
		coords = coordinates;
	}
	
	var centerX = 0;
	var centerY = 0;
	if (geometry.type == "LineString" || geometry.type == "MultiLineString") { // 라인
		//-----공간데이터로 센터 좌표 구하기------ 폴리라인
		var maxX=0;
		var maxY=0;
		var minX=10000000;
		var minY=10000000;
		var tempCenterX=0;
		var tempCenterY=0;
		for (var i=0; i<coords.length; i++) {
			if(maxX<coords[i][0]) {
				maxX = coords[i][0];
			}
			if(maxY<coords[i][1]) {
				maxY = coords[i][1];
			}
			if(minX>coords[i][0]) {
				minX = coords[i][0];
			}
			if(minY>coords[i][1]) {
				minY = coords[i][1];
			}
		}
		tempCenterX=(maxX+minX)/2;
		tempCenterY=(maxY+minY)/2;
		//-----//공간데이터로 센터 좌표 구하기------
		
		
		var min = 1000000000;
		for(var i=0; i<coords.length; i++) {
			var len = Math.pow(coords[i][0]-tempCenterX,2)+Math.pow(coords[i][1]-tempCenterY,2);
			if(min>len) {
				min = len;
				centerX = coords[i][0];
				centerY = coords[i][1];
			}
		}
	}else if(geometry.type == "Polygon" || geometry.type == "MultiPolygon") {
		//-----공간데이터로 센터 좌표 구하기------ 폴리곤
		var secondIndex=0;
		var factor=0;
		var areaa=0;
		for (var i=0; i<coords.length; i++) {
			secondIndex = (i+1)%coords.length;
			var UtmkX1 = coords[i][0];
			var UtmkY1 = coords[i][1];
			var UtmkX2 = coords[secondIndex][0];
			var UtmkY2 = coords[secondIndex][1];
			
			factor = ((UtmkX1 * UtmkY2)-(UtmkX2 * UtmkY1));
			
			areaa += factor;
			
			centerX += (UtmkX1 + UtmkX2)*factor;
			centerY += (UtmkY1 + UtmkY2)*factor;
		}
		areaa /=2.0;
		areaa *= 6.0;
		factor = 1/areaa;
		centerX *= factor;
		centerY *= factor;
		//-----//공간데이터로 센터 좌표 구하기------
	}
	if(isNaN(centerX) || isNaN(centerY)) {
		centerX = coords[0][0];
		centerY = coords[0][1];
	}
	var wgs = Coord_Trans("utmktowgs", new PT(centerX, centerY));
	var centerPoint = {};
	centerPoint.lat = wgs.y;
	centerPoint.lng = wgs.x;
	return centerPoint;	
}


//라이프코드 네임 정형화
function lfNmFormat(lfNm){
	lfNm = lfNm.split("|");
	var result_ = "";
	if(lfNm[2]=="")
	{	
		for(var i=0; i<lfNm.length; i++){
		   result_ += lfNm[i];
		   if(i < lfNm.length - 2)
			   result_ += " > ";
		}
	}else
	{
		for(var i=0; i<lfNm.length; i++){
			   result_ += lfNm[i];
			   if(i < lfNm.length - 1)
				   result_ += " > ";
			}
	}	
	return result_;
}


//세자리마다 , 표시
function toComma(value){
	var reg = /(^[+-]?\d+)(\d{3})/; // 정규식
	value += '';                    // 숫자를 문자열로 변환
	while (reg.test(value)){
	    value = value.replace(reg, '$1' + ',' + '$2');
	}
	
	return value;
}


function leadingZeros(n, digits) {
	var zero = '';
	n = n.toString();
	if (n.length < digits) {
		for (i = 0; i < digits - n.length; i++) {
			zero += '0';
		}
	}
	return zero + n;
}


function objectToJSONString(object) {
	var isArray = (object.join && object.pop && object.push
			&& object.reverse && object.shift && object.slice && object.splice);
	var results = [];

	for ( var i in object) {
		var value = object[i];

		if (typeof value == "object" && value != null)
			results.push((isArray ? "" : "\"" + i.toString() + "\" : ")
					+ objectToJSONString(value));
		else
			results.push((isArray ? "" : "\"" + i.toString() + "\" : ")
					+ (typeof value == "string" ? "\"" + value + "\""
							: value));
	}
	return (isArray ? "[" : "{") + results.join(", ") + (isArray ? "]" : "}");
}


var browser = (function() {
	var s = navigator.userAgent.toLowerCase();
	var match = /(webkit)[ \/](\w.]+)/.exec(s) ||
		/(opera)(?:.*version)?[ \/](\w.]+)/.exec(s) ||
		/(msie) ([\w.]+)/.exec(s) ||               
		/(mozilla)(?:.*? rv:([\w.]+))?/.exec(s) ||
		[];
	return { name: match[1] || "", version: match[2] || "0" };
}());


