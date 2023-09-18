var map = null;
var reqLang = "";
var resLang = "";
var tooltip = new DW.ToolTipCreater;
var chkDist = false; // 거리재기, 면적재기 <-> 우클릭POI 검색 제어 변수
var rightClickPop = null;
var overlaySlideMode = true;  //오버레이 드롭다운 모드 (디폴트 true);
var bPoiSearchMarker = new Array();
var buildingSearchLayer = null;   //건물내 poi 검색    건물 레이어
var buildingSearchMainMarker = null;  //건물내 poi 검색    건물 마커
var fieldName = "";
var fieldValue = "";
var ncodePOISearchCheck = false;
var ncodeSearchMarker = new Array();  //건물내 poi 검색    건물 마커
var ncodePlaceMarker = new Array();  //건물내 poi 검색    건물 마커
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
var arrTab = new Array('SearchTab', 'NaviTab', 'ThemeTab', 'LifeTab', 'StatsTab', 'FavoriteTab'); //왼쪽 탭 버튼
//현위치 사용 스위치
var myGPS = false
var position = [37.50587647959517, 127.05146545764119];

var ls_dist = "dist_off"; //거리재기 확설중일떄는 마우스 왼쪽클릭 off
var ls_status = "0";
var ls_code = "";
var ls_xy = "";
var	ls_lat = "";
var	ls_lng = "";
var count =	0;
var time = 0;
var	ls_sidonm			=	'';
var	ls_sggnm			=	'';
var	ls_dongnm			=	'';
var	ls_bunji			=	'';
var ls_sale = "1";
var ls_saleyn = "0";
var ls_rent = "1";
var ls_trading = "1";
var ls_realtran = "1";
var	ls_rent_status	=	"0"
var ls_selmarker ="";

var	ls_article_type_length = [];
	
var	ls_bunji			=	'';
var ls_inityear			=   2018;
var	ls_year_length		=	[];
var	ls_area_length		=	[];
var	ls_floor_length		=	[];
var	ls_sangga_length		=	[];
var	copy_year_length		=	[];
var	copy_area_length		=	[];
var	copy_floor_length		=	[];
var	copy_sangga_length		=	[];
var yearlen = 0;
var arealen = 8;
var floorlen = 5;

var ls_html = '';

var	ls_neLat	=	'';
var	ls_neLng	=	'';
var	ls_swLat	=	'';
var	ls_swLng	=	'';

var ls_pnu = '0';
var ls_click_name	=	'';
var ls_click_move	=	'';
var	ls_move_status	=	'';

var $body = $('body');
var $popup = "";
var $marker = "";
var map_popup_item = "";
var map_popup_num = "";

var remax_total_cnt = 0;			// 리맥스 매물 총 개수
var remax_now_page = 1;				// 리맥스 매물 현재 페이지 번호
var remax_total_page_cnt = 1;		// 리맥스 매물 총 페이지 개수
var remax_page_size = 10;			// 리맥스 매물 페이지당 개수

//초기화
var init = function(){
	
	var ls_year_html	=	'';
	var ls_rdo_html	=	'';
	ls_year = new Date().getFullYear();		
	
	for(var i = ls_inityear; i<=ls_year; i++) {
		ls_year_html += "<li class='item btn_year'><span></span><strong>"+ i +"</strong></li>";
		yearlen += 1;
	}	
	$('.radio-years').html(ls_year_html);
	
	// 상품유형 설정
    ls_article_type_length=[];
	for(var i=0; i<$('.select-article-type .btn-article-type.on').length; i++){
		ls_article_type_length.push($(".select-article-type .btn-article-type.on").eq(i).attr('data-item'));
	}

	/* 좌측필터 버튼 */
	var rdo_years = $('.radio-years').owlCarousel({
	    nav:false,
	    loop:false,
	    dots:false,
	    items: 4,
	    slideBy : 4,
	    startPosition : yearlen - 4
	});
	
	$('.select-years a.left').click(function() {
		rdo_years.trigger('prev.owl.carousel');
	})
	
	$('.select-years a.right').click(function() {
		rdo_years.trigger('next.owl.carousel');
	})	
	
	/* 좌측필터 버튼 */
	var rdo_area = $('.radio-areabound').owlCarousel({
	    nav:false,
	    loop:false,
	    dots:false,
	    items: 4,
	    slideBy : 4,
	    startPosition : 0
	});
	
	$('.select-areabound a.left').click(function() {
		rdo_area.trigger('prev.owl.carousel');
	})
	
	$('.select-areabound a.right').click(function() {
		rdo_area.trigger('next.owl.carousel');
	})	
	
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

	
	map.buildingList = [];
	/* 마커 표시 */

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
				//girdCellBounds(lat, lng, 0);				
			}
		}		
	});
	
	dist = new L.Control.Measure({mode:"dist"});
	area = new L.Control.Measure({mode:"area"});
	map.addLayer(dist);
	map.addLayer(area);
	
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
	    $('#wrapGisPopup').hide();
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
	
	$(document).on('click', '.z_leaflet-popup-close-button', function() {
		$('#wrapGisPopup').hide();
	});	
	
	var $today = $('[data-today]');
	
	$today.text(moment().format($today.attr('data-today')));
	
	building_apiAddr.fnSetMap(map);
    self.fnGps = building_apiAddr.fnGps(new L.LatLng(position[0], position[1]), map.getBounds());
	
	/*상세정보*/
	$(document).on('click', '.leaflet-popup-close-button', function(e){})
	
	// 맵버튼 레이어
	$(document).on('click', '#btnMapType1', function(){
	    $('#mapTypeLayer1').show();
	});
	$(document).on('click', '.btnMapType1Close', function(){
	    $('#mapTypeLayer1').hide();
	});
	
	$(document).on('click', '#mapPannel1Close', function(){
	    $('#mapPannel1').removeClass('d-flex');
	    $('#mapPannel1').addClass('d-none');
	});
	$(document).on('click', '#mapPannel1_2Close', function(){
	    $('#mapPannel1_2').removeClass('d-flex');
	    $('#mapPannel1_2').addClass('d-none');
	    remax_now_page = 1;		// 리맥스 매물 현재 페이지 번호 초기화
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
	
	// 토글 클래스 (분양 / 임대료 / 매매 / 실거래) (상가 / 지식산업센터 / 오피스)
	$(document).on('click', '.btn-toggle', function(){
	    if($(this).hasClass("on")){	    	    	    	
			if($(this).text()	==	"분양"){
				ls_sale	=	"0";
				$(".radio-salepriceall .item").addClass("disable");
				$('.radio-salepriceall span').css("background", "darkgray");
			}else if($(this).text()	==	"임대료"){				
				ls_rent	=	"0";
			}else if($(this).text()	==	"매매"){				
				ls_trading	=	"0";
			}else if($(this).text()	==	"실거래"){
				ls_realtran	=	"0";
			}	 
			ls_xy	=	"";
			$(this).removeClass("on");			
	    } else {			
			if($(this).text()	==	"분양"){
				ls_sale	=	"1";			
				$('.radio-salepriceall span').css("background", "#fff");
				$(".radio-salepriceall .item").removeClass("disable");
			}else if($(this).text()	==	"임대료"){				
				ls_rent	=	"1";
			}else if($(this).text()	==	"매매"){				
				ls_trading	=	"1";
			}else if($(this).text()	==	"실거래"){
				ls_realtran	=	"1";
			}			
			ls_xy	=	"";
			$(this).addClass("on");	
	    }
	    
	    // 상품유형 설정
	    ls_article_type_length=[];
		for(var i=0; i<$('.select-article-type .btn-article-type.on').length; i++){
			ls_article_type_length.push($(".select-article-type .btn-article-type.on").eq(i).attr('data-item'));
		}
		
	    // 분양만 선택 시 상품유형에서 '지식산업센터'와 '오피스' 숨기기
	    if (ls_sale == "1" &&  ls_rent == "0" && ls_trading == "0" && ls_realtran == "0") {
	    	$('.btn-article-type-02').hide();
	    	$('.btn-article-type-03').hide();
	    } else {
			$('.btn-article-type-02').show();
			$('.btn-article-type-03').show();
		}
		
		// 상품유형에서 '상가'가 선택 안되었을 시에는 필터항목에서 '층'과 '상가유형' 항목 숨기기
		if($('#btnFilter1').hasClass("btn-danger")){
			if (ls_article_type_length.indexOf('D02') < 0) {
				$('#filterLayer3').hide();
				$('#filterLayer4').hide();
			} else {
				$('#filterLayer3').show();
				$('#filterLayer4').show();
			}
		}
	    
		$('.btnFilterOk').click();    
	});
	
	// 토글 클래스2 (등록 년도 / 근린 / 단지내 / 복합 / 기타)
	$(document).on('click', '#btnFilter1', function(){
	    if($(this).hasClass("btn-danger")){
	        $(this).removeClass("btn-danger");
	        $(this).addClass("btn-outline-secondary");
	        $('#filterLayer1').hide();
	        $('#filterLayer2').hide();
	        $('#filterLayer3').hide();
	        $('#filterLayer4').hide();
	        $('#mapSrcResult .tab-content').height('500');
	    } else if($(this).hasClass("btn-outline-secondary")) {
	        $(this).removeClass("btn-outline-secondary");
	        $(this).addClass("btn-danger");
	        $('#filterLayer1').show();
	        $('#filterLayer2').show();
	        if (ls_article_type_length.indexOf('D02') >= 0) {
		        $('#filterLayer3').show();
		        $('#filterLayer4').show();
		    }
	        $('#mapSrcResult .tab-content').height('250');
	    }
	});	
	
	/* 토글 클래스3 (등록 년도 / 근린 / 단지내 / 복합 / 기타) */
	$(document).on('click', '.btn-togsanga', function(){
		//if($(this).hasClass("btn-secondary")){
		if($(this).hasClass("on")){	   
			$(this).removeClass("on");
	        //$(this).removeClass("btn-secondary");
			//$(this).addClass("btn-outline-secondary");
	    } else {
			$(this).addClass("on");	
	    	//$(this).removeClass("btn-outline-secondary");
	    	//$(this).addClass("btn-secondary");			
	    }	
	});
	
	// 필터확인
	$(document).on('click', '.btnFilterOk', function(){		
		ls_year_length = [];	
		if($(".radio-yearsall .on").length > 0){
			for(var i=0; i<$(".radio-years .item").length; i++) {
				ls_year_length.push($(".radio-years .item")[i].innerText.trim());
			}		
		} else {	
			for(var i=0; i<$(".radio-years .on").length; i++) {
				ls_year_length.push($(".radio-years .on")[i].innerText.trim());
			}		
		}	
		
		ls_area_length = [];
		if($(".radio-areaall .on").length > 0){
			for(var i=0; i<$(".radio-areabound .item").length; i++) {
				ls_area_length.push($(".radio-areabound .item").eq(i).attr('data-item'));
			}		
		} else {	
			for(var i=0; i<$(".radio-areabound .on").length; i++) {
				ls_area_length.push($(".radio-areabound .on").eq(i).attr('data-item'));
			}		
		}
				
		ls_floor_length = [];		
		if($(".radio-floorall .on").length > 0){
			for(var i=0; i<$(".radio-floor .item").length; i++) {
				ls_floor_length.push($(".radio-floor .item").eq(i).attr('data-item'));
			}		
		} else {	
			for(var i=0; i<$(".radio-floor .on").length; i++) {
				ls_floor_length.push($(".radio-floor .on").eq(i).attr('data-item'));
			}		
		}
		
		ls_sangga_length=[];
		for(var i=0; i<$('.select-sangga .btn-togsanga.on').length; i++){
			ls_sangga_length.push($(".select-sangga .btn-togsanga.on").eq(i).attr('data-item'));
		}
		
		/*상세정보*/
		var self = this,
		favorite = store.get('GIS_building_favorite') || {};
			
		if(favorite.좌표x != null){
			getAddress(favorite.좌표y,favorite.좌표x,'JIBUN_ADDRESS');
			store.remove('GIS_building_favorite');
		}

		copy_query();
		
		sample_marker(ls_neLat, ls_neLng, ls_swLat, ls_swLng, ls_year_length, ls_area_length, ls_floor_length, ls_sangga_length);	
	});	
	
	
	
	// 필터취소
	$(document).on('click', '.btnFilterCancel', function(){
		ls_year_length = copy_year_length; 
		ls_area_length = copy_area_length; 
		ls_floor_length = copy_floor_length;
		ls_sangga_length = copy_sangga_length;
		
		if(ls_year_length.length == yearlen){
			$('.radio-yearsall').find('li').addClass('on');
			$('.btn_year').each(function (index, item){
				$(item).removeClass('on');
			})
		} else {
			$('.btn_year').each(function (index, item){
				$(item).removeClass('on');
				
				for(var i in ls_year_length){	
					var idx = $('.btn_year')[index].innerHTML.indexOf(ls_year_length[i]);
					if(idx > -1){
						$(item).addClass('on');
					}
				}	
			})
		}
		
		if(ls_area_length.length == arealen){
			$('.radio-areaall').find('li').addClass('on');
			
			$('.radio-areabound .owl-stage .item').each(function (index, item){
				$(item).removeClass('on');
			})
		} else {
			$('.radio-areabound .owl-stage .item').each(function (index, item){
				$(item).removeClass('on');
				
				for(var i in ls_area_length){	
					var idx = $('.radio-areabound .owl-stage .item')[index].innerHTML.indexOf(ls_area_length[i]);
					if(idx > -1){
						$(item).addClass('on');
					}
				}	
			})
		}
		
		if(ls_floor_length.length == floorlen){
			$('.radio-floorall').find('li').addClass('on');
			
			$('.radio-floor li').each(function (index, item){
				$(item).removeClass('on');
			})
		} else {
			$('.radio-floor .item').each(function (index, item){
				$(item).removeClass('on');
				
				for(var i in ls_floor_length){	
					var idx = $('.radio-floor .item')[index].innerHTML.indexOf(ls_floor_length[i]);
					if(idx > -1){
						$(item).addClass('on');
					}
				}	
			})
		}
		
		$('.btn-togsanga').each(function (index, item){
			$(this).removeClass("on");
			for(var i in ls_sangga_length){	
				var idx = $('.btn-togsanga').eq(index).attr('data-item').indexOf(ls_sangga_length[i]);
				if(idx > -1){
					$(this).addClass("on");
				}	
			}
		})		     
	});	
	
	$('.radio-years').find('span').click(function(){
		$(this).parent('li').toggleClass('on');
		$('#filterLayer1 > div.select-header.d-flex.align-items-center.justify-content-between li').removeClass('on');
	});
	
	$('.radio-areabound').find('span').click(function(){		
		$(this).parent('li').toggleClass('on');
		$('#filterLayer2 > div.select-header.d-flex.align-items-center.justify-content-between li').removeClass('on');
	});
	
	$('.radio-floor').find('span').click(function(){		
		$(this).parent('li').toggleClass('on');
		$('#filterLayer3 > div.select-header.d-flex.align-items-center.justify-content-between li').removeClass('on');
	});
	
	$('.radio-all').find('li').click(function(){	
		
		var on = $(this).hasClass("on")?true:false;
				
		var target = $(this).attr('alltarget');
		switch(target){
			case "radio-years" :
				$('div.select-years > ul > div.owl-stage-outer li').each(function(){
					if(on){
						$( this ).removeClass("on");
					} else {
						$( this ).addClass("on");
					}
				});
			break;
			case "radio-areabound" :
				$('div.select-areabound > ul > div.owl-stage-outer li').each(function(){
					if(on){
						$( this ).removeClass("on");
					} else {
						$( this ).addClass("on");
					}
				});
			break;
			case "radio-floor" :
				$('div.select-floor > ul > li').each(function(){
					if(on){
						$( this ).removeClass("on");
					} else {
						$( this ).addClass("on");
					}
				});
			break;
			case "radio-saleprice" :
				if($(this).hasClass('on')){
					ls_saleyn = '0';
				} else {
					ls_saleyn = '1';
				}	
				if($('.btn-toggle.on.btn-sale').length > 0){
					$('.btnFilterOk').click();
				} else {
					return;
				} 
			break;
		}	
		$(this).toggleClass('on');
	});
	
	map.on("drag",function(e) {
		/*
		 for (var i=0; i< settimeoutList.length; i ++) {
			clearTimeout(settimeoutList[i]);
		}
		*/
		for (var i=0; i< map.popupList.length; i ++) {
			map.removeLayer(map.popupList[i]);
		}
		$('#wrapGisPopup').hide();
		return false;
	});
	
	map.on('zoomstart', function() {
		for (var i=0; i< map.popupList.length; i ++) {
			map.removeLayer(map.popupList[i]);
		}
		$('#wrapGisPopup').hide();
	});
		
	map.on("moveend",function(e) {
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
		
		/*
		if(setintervalList.length > 0 || settimeoutList.length > 0){
			clearInterval(setintervalList);
			clearTimeout(settimeoutList);
			settimeoutList = []; 
			setintervalList = [];
		} else {
			return; 	
		}
		*/
		//if(map.getZoom() == 13){
			if(self.fnGps){
				self.fnGps.abort();
				self.fnGps = null;
			}
		
			self.fnGps = building_apiAddr.fnGps(map.getCenter(), map.getBounds());	
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
        	
			$('.btnFilterOk').click();    			
	        if(ls_click_move == "1"){
	            ls_click_move   =   "";
	        }else{        	
	            if(ls_xy != ""){
	            	$('.' + ls_xy + '').parent().parent().parent().removeClass('on');
	            }
	            ls_xy   =   "";
	            ls_click_move   =   "";
	        }
	    	ls_status = "0";			
		//}else if(map.getZoom() != 13){
		//	ls_move_status	=	"1";
		//	time = setInterval("recyclefunc()", 300);
			//setintervalList.push(time);
	    //}
		
		/** 190829_JIK **/    	
		var nowZoom = this.getZoom();
		if(nowZoom == 12 || nowZoom == 13){ // 레벨 12, 13 => 격자보기ON => 격자영역 초기화 => 셀과 툴팁 없애주기
			
			if(gridFlag == true){				
				//gridBounds();
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
	
	// 리맥스 매물 더 보기 버튼
	$("#btn_remax_more").click(function() { // 실내지도 체크 클릭시
		getRemaxMore();
	});
	
	//최초 마커표시
	$('.btnFilterOk').click();
	defaultSetting();
}

function copy_query(){	
	copy_year_length = ls_year_length; 
	copy_area_length = ls_area_length; 
	copy_floor_length = ls_floor_length;
	copy_sangga_length = ls_sangga_length;
}

function sample_marker(neLat,neLng,swLat,swLng,ls_year_length,ls_area_length,ls_floor_length, ls_sangga_length ){ // 마커 설정
	var self = this,
	param = {
		neLng: neLng,
		swLng: swLng,
		neLat: neLat,
		swLat: swLat,
		ls_year_length: ls_year_length,
		ls_area_length: ls_area_length,
		ls_floor_length: ls_floor_length,
		ls_sangga_length: ls_sangga_length,
		sale: ls_sale,
		rent: ls_rent,
		trading: ls_trading,
		realtran: ls_realtran,
		saleyn: ls_saleyn,
		ls_article_type_length: ls_article_type_length,
		groupCode: _GroupCode,
		demoSidonm: _DemoSidonm,
		demoSggnm: _DemoSggnm,
	};		
	var html_ = "";
	var html2_ = "";
	
	if(ls_sale + ls_rent + ls_trading + ls_realtran == "0000" || ls_sangga_length =='' || ls_year_length == '' || ls_area_length == '' || ls_floor_length == ''){
		if (map.popupList && 0 < map.popupList.length) {			
			for (var i in map.popupList) {
				map.removeLayer(map.popupList[i]);
			}
		}
		return;
	}
	
	if (self.dfrMarkerAjax) {
		self.dfrMarkerAjax.abort();
		self.dfrMarkerAjax = null;
	}
	
	if (map.popupList && 0 < map.popupList.length) {			
		for (var i in map.popupList) {
			map.removeLayer(map.popupList[i]);
		}
	}
	map.popupList = [];
	
	if(map.getZoom() > 10 && ls_year_length != '' && ls_area_length != '' && ls_floor_length != '' && ls_sale + ls_rent + ls_trading + ls_realtran != "0000"){
		var ajaxParams = {};
		returnType = "json2" || "array";
		
		ajaxParams["z.action"]      = 'select';
		ajaxParams["z.sqlFile"]     = 'dawulmap';
		ajaxParams["z.sqlId"]       = 'zeons_마커생성';
		ajaxParams["z.returnType"]  = returnType;
		ajaxParams["z.rowSeparate"] = z._Row_Separate;
		ajaxParams["z.colSeparate"] = z._Col_Separate;
		ajaxParams["z.params"]      = param || {}; 

		var jsonInfo   = JSON.stringify(ajaxParams);

		self.dfrMarkerAjax = $.ajax({
			type       : 'post',
			url        : "/common/core/xmlAjax.do",
		    dataType   : "json",
		    data       : z.encodeParam(jsonInfo),
		    timeout    : 600000,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			cache      : false,
		    success: function(resp2) {
		    	self.rawDataArr = resp = z.getAjaxJsonData(resp2.datas);
		    	
				var startDate = new Date();
				for(var i = 0; i < resp.length; i++){
					
					var markerhtml = "", pophtml = "", className="", remax="";
					
					// 리맥스 매물 데이터 여부
					if ((resp[i].z_status == "임대료" || resp[i].z_status == "매매") && resp[i].리맥스매물유무 == "Y") {
						remax = "y";
					} else {
						remax = "n";
					}
					
					var prop=" lat='" + resp[i].x_lat + "' " 
						+" lng='" + resp[i].y_lng + "' "
						+" pnu='" + resp[i].pnu + "' "
						+" xy='" + resp[i].xy + "' "
						+" z_status='" + resp[i].z_status + "' "
						+" bunji='" + resp[i].bunji + "'"
						+" w_date='" + resp[i].w_date + "'"
						+" remax='" + remax + "'";
						
					if(map.getZoom() == 11){
						className = "flag-mini map-info-popup-mini " + resp[i].wyear + " " + resp[i].sanga_status + " " + resp[i].totarea + " " + resp[i].saleyn;
					} else {
						className = "flag map-info-popup " + resp[i].wyear + " " + resp[i].sanga_status + " " + " " + resp[i].totarea + " " + resp[i].saleyn;
					}
					
					if(resp[i].z_status == "분양"){
						markerhtml = "<div id='"+resp[i].xy+"' class='" + className + " flag-sales cursor-pointer mapInfo1'  onclick=getPnu(this) "+ prop + ">";
					}else if(resp[i].z_status == "임대료"){
						markerhtml = "<div id='"+resp[i].xy+"' class='" + className + " flag-rent cursor-pointer mapInfo1' onclick=getPnu(this) "+ prop + ">";
					}else if(resp[i].z_status == "매매"){
						markerhtml = "<div id='"+resp[i].xy+"' class='" + className + " flag-trading cursor-pointer mapInfo1' onclick=getPnu(this) "+ prop + ">"
					}else{
						markerhtml = "<div id='"+resp[i].xy+"' class='" + className + " flag-actual cursor-pointer mapInfo1' onclick=getPnu(this) "+ prop + ">";
					}
					
					// 마커종류, 마커에 리맥스매물유무 표시하기
					if ((resp[i].z_status == "임대료" || resp[i].z_status == "매매") && resp[i].리맥스매물유무 == "Y") {
						var remaxHtml = '&ensp;<img class="ico_remax"></label>';
						//var remaxHtml = '&ensp;<em style="color:#DC1C2D;font-size:14px;font-weight:bold;">✓</em></label>';
						markerhtml += resp[i].임대료명.replace("</label>", remaxHtml);
					} else {
						markerhtml += resp[i].임대료명;
					}	
					
					markerhtml += "<div class='flag-body popupopen'>";
					
					if(map.getZoom() != 11){
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
						markerhtml += "<strong>"+ popdate +"</strong>";
						markerhtml += "<span>" + resp[i].w_date + "</span>";
					}	
					markerhtml += "</div>";
					markerhtml += "</div>";
					
					var icon = L.divIcon({
						html: markerhtml
					});
					
					add_marker([parseFloat(resp[i].y_lng), parseFloat(resp[i].x_lat)] , icon, 1, resp[i].xy);
				}	
				var endDate   = new Date();
				var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
		    },
		    error : function(resp) {
		    	console.log("작업중 오류가 발생 하였습니다!");
		    	console.log(resp);
		    }
		});
	} else {
		//FIXME : 속도때문에 임시로 막음
		return;
		var divarea, divname, sqlname;
	
		if(map.getZoom() < 11 && map.getZoom() > 6 && ls_year_length != '' && ls_area_length != '' && ls_floor_length != '' && ls_sale + ls_rent + ls_trading + ls_realtran != "0000"){
			divarea = 'dong';
			sqlname = 'zeons_마커생성_dong';
		} else if(map.getZoom() < 7 && map.getZoom() > 4 && ls_year_length != '' && ls_area_length != '' && ls_floor_length != '' && ls_sale + ls_rent + ls_trading + ls_realtran != "0000"){
			divarea = 'sigun';
			sqlname = 'zeons_마커생성_sigun';
		} else {
			divarea = 'si';
			sqlname = 'zeons_마커생성_si';
		}
		
		
		var ajaxParams = {};
		returnType = "json2" || "array";
		
		ajaxParams["z.action"]      = 'select';
		ajaxParams["z.sqlFile"]     = 'dawulmap';
		ajaxParams["z.sqlId"]       = sqlname;
		ajaxParams["z.returnType"]  = returnType;
		ajaxParams["z.rowSeparate"] = z._Row_Separate;
		ajaxParams["z.colSeparate"] = z._Col_Separate;
		ajaxParams["z.params"]      = param || {}; 

		var jsonInfo   = JSON.stringify(ajaxParams);

		self.dfrMarkerAjax = $.ajax({
			type       : 'post',
			url        : "/common/core/xmlAjax.do",
		    dataType   : "json",
		    data       : z.encodeParam(jsonInfo),
		    timeout    : 600000,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			cache      : false,
		    success: function(resp2) {
		    	self.rawDataArr = resp = z.getAjaxJsonData(resp2.datas);
		    	var startDate = new Date();
				
				for(var i = 0; i < resp.length; i++){
					switch(divarea){
						case "dong":
							divname = resp[i].읍면동명;	
						break;
						case "sigun":
							divname = resp[i].시군구명;
						break;
						case "si":
							divname = resp[i].시도명;
						break;
					}
					
					html_ = "<div class='flag flag-city map-info-popup-area l1'>";
					
					html_ += "<label><em>" + divname + "</em></label>";							
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
					
					var icon = L.divIcon({
						html: html_
					});
					add_marker([resp[i].y, resp[i].x], icon, 1, resp[i].xy);
				}	
				var endDate   = new Date();
				var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
		    },
		    error : function(resp) {
		    	console.log("작업중 오류가 발생 하였습니다!");
		    	console.log(resp);
		    }
		});
	}
}	

function add_marker(xy, icon, gbn, mid){
	/*
	if(mid == null || mid == ''){
		var markerid = {}
		markerid[mid] = L.marker(xy,{icon: icon}).addTo(map);
		markerid[mid]._icon.id = mid;
	} else {
		var markerid = L.marker(xy,{icon: icon}).addTo(map);
	}
	*/		
	var markerid = L.marker(xy,{icon: icon}).addTo(map);
	if(gbn == 1){
		map.popupList.push(markerid);
	} else {
		map.buildingList.push(markerid);
	}	
	

	if(ls_selmarker != "" && ls_selmarker == mid){
		maxIndex = Math.max.apply(null, $.map($('.leaflet-marker-icon'), function(e,n){if($(e).css('position')=='absolute')return parseInt($(e).css('z-index'))||1;}));
		$('#' + mid + '').parent().css("z-index", maxIndex + 1000);
	}
	
	/*
	var timerid = setTimeout(function(){
		var markerid = L.marker(xy,{icon: icon}).addTo(map);
		map.popupList.push(markerid);
	}, 0);
	settimeoutList.push(timerid);
	*/
}


function getPnu(obj) {
	event.stopPropagation();
	var $this = $(obj),
	    lat = $this.attr('lat'),
		lng = $this.attr('lng'),  
		pnu = $this.attr('pnu'),           
		xy = $this.attr('xy'),
		click_name = $this.attr('z_status'),
		bunji = $this.attr('bunji'),
		wdate = $this.attr('w_date'),
		remax = $this.attr('remax'),
		map_popup_item = $('.map-info-popup'); 
	
	ls_selmarker = xy;
	ls_lat = lat;
	ls_lng = lng;
	
	//return;
	ls_bunji = bunji;		
	if(click_name == "분양"){
		popid = 'pop_sale';
		popdate = '분양일';
	}else if(click_name == "임대료"){
		popid = 'pop_rent';
		popdate = '등록일';
	}else if(click_name == "매매"){
		popid = 'pop_trading';
		popdate = '등록일';
	}else if(click_name == "실거래가"){
		popid = 'pop_actual';
		popdate = '최근계약일';
	}else{
		popid = 'pop_building';
		popdate = '사용승인일';
	}
	
	var x = $('#map').width() - 70,
		y = $('#map').height();
	
	if(map.getZoom() == 11){
		var markerh = -37;
	} else {
		var markerh = -66.984;
	} 
	
	$('#wrapGisPopup').css({
		left: ((x / 2) + (x / 30)),
		top: y / 2 - 345 + markerh ,
		height : 341,  
	});
	
	$('#spnm').text(click_name);
	$('#spdt').text(popdate + ":" + wdate);
	$('.z_leaflet-content-box').attr('id', popid);
	$('.leaflet-body').addClass(xy);
	
	if(ls_lng != ""){
		/* FIXME : 중심이동 하기 */
		map.panTo(new L.LatLng(ls_lng  , ls_lat));
		//map.setView(new L.LatLng((Number(ls_lng) + 0.0005).toFixed(8), ls_lat) , map.getZoom()); //지도 위치 이동  (좌표, 지도 레벨)
	    ls_click_move = '1';
	}
	$('#wrapGisPopup').show();
	
	if(click_name != "건물"){
		if (map.buildingList && 0 < map.buildingList.length) {	
			for (var i in map.buildingList) {
				map.removeLayer(map.buildingList[i]);
			}
			map.buildingList = [];
		} else {
			map.buildingList = [];
		}
	}	
	
	ls_click_name =	click_name;
	ls_xy =	xy;
	
	if(pnu == 0){
		console.log('REVERSE_GEOCODING');
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
				async:false,
				cache:false, 
				type:'POST',
				dataType:'jsonp',
				data:dataString,  
				timeout : 200000,
			error : function(d, textStatus, error){
				alert("다시 실행해주시기 바랍니다. code:11 \n"+"getJSON failed : "+d+",  status: " + textStatus + ",  error: "+error);
			},success: function(data, result){
				var geojson = data.body.geojson;
				if(geojson!=null) {
					ls_pnu	=	data.body.geojson.features[0].properties.pnu;
					/*addrname = data.body.geojson.features[0].properties.pnuname; // 지번 주소 */
				}else{
					alert("지정된위치를 찾을수 없습니다.");
					return;
				}
			}
		});
	} else {
		ls_pnu = pnu;
	}	 
	
	if(click_name == '임대료' || click_name == '실거래' || click_name == '매매'){
		//$('#building').removeClass('on');
		// 1 : 건물 
		// 1_2 : 임대
		// 2 : 분양
		$('#mapPannel1').removeClass('d-flex');
		$('#mapPannel1_2').removeClass('d-flex');
		$('#mapPannel2').removeClass('d-flex');				
						
		$('#mapPannel1_2').addClass('d-none');
		$('#mapPannel2').addClass('d-none');
		
	}else if(click_name == '분양'){
		//$('#building').removeClass('on');
		
		$('#mapPannel1').removeClass('d-flex');
		$('#mapPannel1_2').removeClass('d-flex');
		$('#mapPannel2').removeClass('d-flex');
		
		$('#mapPannel2').addClass('d-none');
		$('#mapPannel1_2').addClass('d-none');
		
	} else if(click_name == '실거래'){
		//$('.z_leaflet-popup').removeClass('on');	
		//$('#building').addClass("on");
		//$('#building').parent().parent().parent().parent().css("z-index",1000);
		
		$('#mapPannel1').removeClass('d-flex');
		$('#mapPannel1_2').removeClass('d-flex');
		$('#mapPannel2').removeClass('d-flex');				
						
		$('#mapPannel1_2').addClass('d-none');
		$('#mapPannel2').addClass('d-none');
		
		ls_status	=	'0';				
	}
	
	// 상세 정보 레이어에서 리맥스 매물 탭 추가/삭제
	var remaxTabHtml = '';
	
	remaxTabHtml += '<li class="nav-item" id="remaxTab">';
	remaxTabHtml += '	<a class="nav-link justify-content-center m-0 font-size-h6 tab_content_show" data-toggle="tab" href="#kt_tab_pane_1_2_4">매물정보+</a>';
	remaxTabHtml += '</li>';
	
	if (remax == 'y') {
		if ($('#remaxTab').length <= 0) {
			$('#detailTabList').append(remaxTabHtml);
		}
	} else {
		$('#remaxTab').remove();
		$('#remaxMemulList').html('');
		$('#kt_tab_pane_1_2_4').removeClass('active show');
	}
	
	apiBuildingDtl.fnOpenTable(ls_pnu,ls_click_name);
}


function getAddress(lng, lat, adminType) {
	$('#wrapGisPopup').hide();
	ls_lng	=	 parseFloat(lng).toFixed(6);
	ls_lat	=	 parseFloat(lat).toFixed(6);
	xy = ls_lng.replace('.', '') + ls_lat.replace('.', '');
	/*ls_status = "1";*/
	jHeader.serviceName = "REVERSE_GEOCODING";
	revBody.point = lng+","+lat;
	revBody.selectFields.geoType = "EMPTY";
	revBody.adminType = adminType;
	revBody.spatialOperation = "NEARBY";	
	var jReqBody = {
		"header" : jHeader,
		"body" : revBody
	};
	
	if (map.buildingList && 0 < map.buildingList.length) {	
		for (var i in map.buildingList) {
			map.removeLayer(map.buildingList[i]);
		}
		map.buildingList = [];
	} else {
		map.buildingList = [];
	}
	
	if(ls_lng != ""){
		map.panTo(new L.LatLng(ls_lng  , ls_lat));
	}	
	
	var dataString = "callback=?&req="+encodeURIComponent(objectToJSONString(jReqBody));	
	$.ajax({
		url:jUrl,
		async: true,
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
					if(resp != ''){		
						/*
						z.msgAlert({
							html: '건물에 대한 정보가 없습니다.',
							icon: 'error'
						});
						*/
						
						var markerhtml = "", pophtml = "", className="";
					    var prop=" lat='" + ls_lat + "' " 
								+" lng='"+ ls_lng + "' "
								+" pnu='" + data.body.geojson.features[0].properties.pnu + "' "
								+" xy='"+ xy +"' "
								+" z_status='건물' "
								+" w_date='"+resp[0].사용승인일+"'";
					    
					    if(map.getZoom() == 11){
							className = "flag-mini map-info-popup-mini ";
						} else {
							className = "flag map-info-popup ";
						}
					    markerhtml = "<div id='" + ls_lng.replace('.', '') +ls_lat.replace('.', '')  + "' class='" + className + " flag-building cursor-pointer mapInfo1' onclick=getPnu(this) "+ prop + ">";
					    markerhtml += "<label><em>건물</em></label>";  
						markerhtml += "<div class='flag-body onclick=getPnu(this) "+ prop + ">";
						if(map.getZoom() != 11){
							markerhtml += "<strong>사용승인일</strong>";
							markerhtml += "<span>" + resp[0].사용승인일 + "</span>";
						}	
						markerhtml += "</div>";
						markerhtml += "</div>";
					    
						var icon = L.divIcon({
							html: markerhtml
						});
						
						add_marker([ ls_lng, ls_lat] , icon, 2);
						
						/*					
						html_ += "<div class='z_leaflet-popup' id='building'>";
						html_ += "<div class='z_leaflet-popup-content'>";
						html_ += "<div class='z_leaflet-content-box'>";
						html_ += "<div class='z_leaflet-header'>";
						html_ += "<h3 id='building_text'>-</h3>";
						html_ += "<strong id='y_사용승인일'>사용승인일 : <span></span></strong>";
						html_ += "</div>";
						html_ += "<div class='leaflet-body scroll building_append' data-scroll='true' data-height='155' data-mobile-height='155' style='height:155px;'>";
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
						setTimeout(function() {			
							$('#g_wdate').text(resp[0].사용승인일);
						}, 230);
						*/	
					} 
					//건물마커
					$("#inputSearch").val(addrname);
					unifiedSearch(0,1);
					$("#searchListForm").css("display","none");
				});
				/*$("#searchListForm").css("display","none");*/
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

/*
function recyclefunc(){	
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

		data.neLng += deltaX;
		data.swLng -= deltaX;
		data.neLat += deltaY;
		data.swLat -= deltaY;
		
		ls_neLat	=	data.neLat;
		ls_neLng	=	data.neLng;
		ls_swLat	=	data.swLat;
		ls_swLng	=	data.swLng;	
		$('.btnFilterOk').click();   
        if(ls_click_move == "1"){
            ls_click_move   =   "";
        }else{        	
            if(ls_xy != ""){
            	$('.' + ls_xy + '').parent().parent().parent().removeClass('on');
            }
            
            ls_xy   =   "";
            ls_click_move   =   "";
        }
    	ls_status = "0";
    }
}
*/

/** PC버전 디폴트 세팅 **/
function defaultSetting(){
	$("#tooltipMapBtnViewM").css("display","none");
	$("#inputSearchM").css("display","none");
	$("#searchdFormM").remove();
	$("#naviPricePopM").remove();
	
	z.xAsync('AdminMain', 'getExcelDown', 'select', {pgmCode:"MA0301"}, 'json').done(function(resp) {
		if(resp[0].excelyn == "N"){
			$("[data-btn-export]").css("display", "none");
		} else {
			$("[data-btn-export]").css("display", "block");
		}
	}); 
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
	//console.log('ncodeList');
	//console.log(depth +'@'+ tag +'@'+ index);
	//console.log(ncodeDatas.cate);
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
	//console.log('ncodeList2');
	//console.log(depth +'@'+ tag +'@'+ index);
	//console.log(ncodeDatas2.cate);
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
				list2 += '<li class="sub_depth_in off more_none"><a href="javascript:;"><img src="/resources/common/custom/images/ico/nearby'+(i+8)+'_off.png" alt="" />'+cateName2+'<span></span></a></li>';
			}else {
				list2 += '<li class="sub_depth_in off"><a href="javascript:;"><img src="/resources/common/custom/images/ico/nearby'+(i+8)+'_off.png" alt="" />'+cateName2+'<span></span></a></li>';
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

function ncodePlaceSearch(x, y) {
	if(map.getZoom() < 9) {
		map.setZoom(9);
	}

	if(map.getZoom() > 10) {
		while(ncodePlaceMarker.length > 0) {
			map.removeLayer(ncodePlaceMarker[ncodePlaceMarker.length - 1]);
			ncodePlaceMarker.pop();
		}
	} else {
		if(ncodePlaceMarker) {
			while(ncodePlaceMarker.length > 0) {
				map.removeLayer(ncodePlaceMarker[ncodePlaceMarker.length - 1]);
				ncodePlaceMarker.pop();
			}
		}	
	}
	var markerImg = "/resources/common/custom/images/pin/pin_on.png";
	var midCheck = false;
	
	ncodePlaceMarker.push(new L.Marker(new L.LatLng(y, x),{icon: new L.Icon({   // 마커 찍기
		iconUrl: markerImg,   //핀 이미지
		iconAnchor: [14,33]  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
	})}).addTo(map));
	
	ncodePlaceMarker[ncodePlaceMarker.length-1].index = ncodePlaceMarker.length-1;
}

function ncodePlaceearchClear() {
	while(ncodePlaceMarker.length > 0){
		map.removeLayer(ncodePlaceMarker[ncodePlaceMarker.length - 1]);
		ncodePlaceMarker.pop();
	}
}

function ncodePOISearch(code, img, autoPan) {
	ls_code = code;
	ls_img = img;	
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


// 리맥스 매물 더 보기
function getRemaxMore() {
	
	if (remax_now_page < remax_total_page_cnt) {
		remax_now_page = remax_now_page + 1;
		$('.remax-page-' + String(remax_now_page)).show();
		$("#btn_remax_more").blur();
	}
	
	if (remax_now_page == remax_total_page_cnt) {
		$('#btn_remax_more').hide();
	}
	
}

// 리맥스 매물 사진 보기
function showRemaxPhoto(obj) {
	
	event.stopPropagation();
	
	var $this = $(obj);
	var remaxCode = $this[0].dataset['code'];
	var remaxType = $this[0].dataset['type'];
	
	var param = {					
					code: remaxCode,	
					type: remaxType				
				};
	
	return z.xAsync('dawulmap', '리맥스_매물사진정보', 'select', param, 'json2').done(function(resp) {
		
		var remaxImgArr = [];
		
		for (var i in resp) {	
			var row = resp[i];
			remaxImgArr.push(row['이미지정보']);
		}
		
		ls_imgsrcArr = remaxImgArr;
		
		$('#exampleModalLabel').text('사진정보');
	
		ls_imghtml	=	'';
		$('#exampleModal .owl_slide').remove();
		$('#exampleModal .owl-carousel').remove();
		ls_imghtml	=	'<div class="owl-carousel owl-theme">';				
		for(var i = 0; i < ls_imgsrcArr.length; i++){					
			ls_imghtml	+=	"<div class='item'><img src='" + ls_imgsrcArr[i] + "' alt=''></div>";
		}
		ls_imghtml	+=	'</div>';
		$('#exampleModal #owl_slide').append(ls_imghtml);
		
		$('#exampleModal .owl-carousel').owlCarousel({
			loop:true,
			margin:10,
			nav:true,
			items:1,
			dots: true,
			navText: ['<i class="la la-angle-left" aria-hidden="true"></i>','<i class="la la-angle-right" aria-hidden="true"></i>'],
			onResized: $('#btnRemaxPhoto').trigger('click')
		});
		
	});
	  
}
