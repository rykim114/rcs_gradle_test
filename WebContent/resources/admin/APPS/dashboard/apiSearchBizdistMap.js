'use strict';
// Class definition

var map = null,
$map = $('#map');
var miniMap = null;
var lan = 'KOR';

var apiSearchBizdistMap = function() {
    // Private functions
	var $modal = $('#modalBizdist'),
		$modalbtnBizdist,
		loaded = $.Deferred(),
		LICENSE_KEY = '14cc08123cd6d425d603917caf3ee061895e4192',
		URL_DAWUL_API = 'https://vapi.dawulmap.com:8443/MapAppServer/DWService',
		$addrWrapper = $('#addrWrapper'),
		$searchbizdist = $('.searchbizdist'),
		$spanSidoNm = $searchbizdist.find('[data-addr-sido]'),
		$spanSggNm = $searchbizdist.find('[data-addr-sgg]'),
		$spanBizdistNm = $searchbizdist.find('[data-addr-bizdist]'),
		$listSidoBizdist = $addrWrapper.children().eq(0),
		$listSggBizdist = $addrWrapper.children().eq(1),
		$listBizdist = $addrWrapper.children().eq(2),
		tmplAddr = Handlebars.compile($('#tmplBizdistList').html()),
		sidoArr = null,
		sggArr = null,
		dongArr = null,
		apiMap = null,
		prevBizdist = {
			sidocd: '',
			sidonm: '',
			sggnm: '',
			sggcd: '',
			dongnm: '',
			dongcd: '',
			bizdistnm: '',
			bizdistcd: ''
		};
	
	KTUtil.scrollInit($listSidoBizdist[0], {
		mobileNativeScroll: true,
		handleWindowResize: true,
		rememberPosition: ($listSidoBizdist.data('remember-position') == 'true' ? true : false)
	});

	KTUtil.scrollInit($listSggBizdist[0], {
		mobileNativeScroll: true,
		handleWindowResize: true,
		rememberPosition: ($listSggBizdist.data('remember-position') == 'true' ? true : false)
	});

	KTUtil.scrollInit($listBizdist[0], {
		mobileNativeScroll: true,
		handleWindowResize: true,
		rememberPosition: ($listBizdist.data('remember-position') == 'true' ? true : false)
	});
	
	var setBtnListener = function() {
		
		/* 팝업버튼- 변경가능  */
		$modalbtnBizdist.click(function() {
			$modal.modal({
				backdrop: 'static'
			}).modal('show');
		});
		
		$('#modalBizdist').on('shown.bs.modal', function(){
			setTimeout(function() {map.invalidateSize();}, 0);
			setTimeout(function() {fnToggleBizdistMap();}, 0);
			setTimeout(function() {fnMoveMap(prevBizdist.bizdistcd);}, 0);
		});
		
		$listSidoBizdist.on('click', '[data-list-addr-sido]', function() {
			var $this = $(this),
				sidocd = $this.attr('data-list-addr-sidocd'),
				sidonm = $this.attr('data-list-addr-sido');
			
			if (prevBizdist.sidonm === sidonm) {
				return;
			}
			
			if(_isDemo && _DemoSidonm != sidonm) {
				z.msg(_DemoMsgX);
				return false;
			}

			$listSidoBizdist.find('a').removeClass('active');
			$this.addClass('active');
			fnUpdateSggList(sidonm, sidocd);
		});
		
		
		$listSggBizdist.on('click', '[data-list-addr-sgg]', function() {
			var $this = $(this),
				sggcd = $this.attr('data-list-addr-sggcd'),
				sggnm = $this.attr('data-list-addr-sgg');
			
			// 전체 클릭 시			
			if (prevBizdist.sggnm === sggnm) {
				return;
			} 
			
			if(_isDemo && _DemoSggnm != sggnm) {
				z.msg(_DemoMsgX);
				return false;
			}
			
			$listSggBizdist.find('a').removeClass('active');
			$this.addClass('active');
			
			fnUpdateBizdistList(sggnm, sggcd, "", "");
		});	
		
		$listBizdist.on('click', '[data-list-addr-bizdist]', function() {
			var $this = $(this),
				bizdistcd = $this.attr('data-list-addr-bizdistseq'),
				bizdistnm = $this.attr('data-list-addr-bizdist'),
				gisX = $this.attr('data-list-addr-x'),
				gisY = $this.attr('data-list-addr-y');
			
			// 전체 클릭 시			
			if (prevBizdist.bizdistnm === bizdistnm) {
				return;
			} 
			
			if(_isDemo && _DemoSggnm != sggnm) {
				z.msg(_DemoMsgX);
				return false;
			}
			
			$listBizdist.find('a').removeClass('active');
			$this.addClass('active');
			
			fnMoveMap(bizdistcd);
			// map 호출
		});	
	};
	
	var setMap = function(){		
	    var self = this,
			defaultCenter = [37.5118, 127.0592],	
			defaultZoom = 9;
		  
		map = L.map('map', {
	        continuousWorld : true,
	    	attributionControl: false,
	        zoomControl : false,
	        zoomAnimation : true,
	        fadeAnimation : false,
	        inertia : false,
	        center: defaultCenter,  // 지도 초기 위치
	        zoom: defaultZoom // 지도 초기 줌 레벨
	    });
    	BaseMapChange(map, L.Dawul.BASEMAP_GEN);  //베이스맵 일반지도 호출
    	
    	var scaleBar = new L.Control.Scale({
    		position : 'bottomright'
    	});
    	map.addControl(scaleBar);		
    	
	    // z-index 정렬
		map.Z_INDEX_OFFSET_LINE = 10;
		map.Z_INDEX_OFFSET_SQUARE= 20;
		map.Z_INDEX_OFFSET_AREA = 30;
		
		map.bizdistLayer = L.layerGroup();
		
		map.addLayer(map.bizdistLayer);
		
		map.bizdistLayer.setZIndex(500 + map.Z_INDEX_OFFSET_LINE);
		map.lastBlockCenter = L.latLng(0, 0);
		
		window.dist = new L.Control.Measure({mode:"dist"});
		map.addLayer(window.dist);
		
		// 상권정보 로딩
		map.bizdistArr = [];
		fnLoadBizdist();
		fnUpdateSidoList("").done(function() {
			loaded.resolve();
		});
		
		map.addEventListener('click', function(evt) {
			var latLng = evt.latlng,
			mapBound = map.getBounds(),
			bound = {
    			lat: latLng.lat,
    			lng: latLng.lng,
				neLat: latLng.lat + 0.002,
				neLng: latLng.lng + 0.0035,
				swLat: latLng.lat - 0.002,
				swLng: latLng.lng - 0.0035						 	
			},
			turfBizdist = null,
			polygonBizdist = null,
			polygonBizdistseq = null;
			
			/* 상권 조회 */	
			if ((evt.originalEvent.ctrlKey || evt.originalEvent.metaKey)
				&& map.bizdistLayer.getLayers().length) {

				/* 색 해제 */
				var bizdistArr = map.bizdistLayer.getLayers(); 
				for (var i in bizdistArr) {
					bizdistArr[i].setStyle({fillColor: '#FFD400'});
				}
				
				var turfPoint = turf.point([latLng.lng, latLng.lat]);
				for (var i in map.bizdistArr) {
					var polygonBizdistI = map.bizdistArr[i],
						turfBBox = polygonBizdistI.turfBBox,
						turfPolygon = polygonBizdistI.turfPolygon;
					
					// bbox 에 포함 안되면 패스
					if (latLng.lat > turfBBox[3] || latLng.lat < turfBBox[1]
						|| latLng.lng > turfBBox[2] || latLng.lng < turfBBox[0]) {
							continue;
						} 
					
					// polygon 에도 포함되면 선택
					if (turf.inside(turfPoint, turfPolygon) || evt.originalEvent.searchBizdist) {						
						polygonBizdist = polygonBizdistI;
						console.log(polygonBizdist);
						var sidonm = polygonBizdistI.bizdist.sidonm;
						var sggnm = polygonBizdistI.bizdist.sggnm;
						var admcd = polygonBizdistI.bizdist.법정동코드;
						var bizdistnm = polygonBizdistI.bizdist.상권;
						var bizdistseq = polygonBizdistI.bizdist.순번;
						
						fnUpdateSidoList(sidonm);
						
						fnUpdateSggList(sidonm, admcd.substring(0,2), sggnm).done(function() {
							fnUpdateBizdistList(sggnm, admcd.substring(0,5), bizdistnm, bizdistseq);
						});
						break; 
					}
				}
				polygonBizdist.setStyle({fillColor: '#BBFF33'});
			}
		});
	}; 
	
	var fnListPrivate = function(jsonText) {
		return $.ajax({
			url: '/api/gis/address.do',
			method: 'GET',
			data: jsonText
		});		
	};
	
	var fnMoveMap = function(bizdistseq) {	
		var latlng = null,
			x = null,
			y = null;
		for (var i in map.bizdistArr) {
			if (map.bizdistArr[i].bizdist.순번 === bizdistseq){
				x = map.bizdistArr[i].turfCenter.geometry.coordinates[0];
				y = map.bizdistArr[i].turfCenter.geometry.coordinates[1];
				break;
			} 
			
		}
		latlng = L.latLng(y, x);
		
		map.panTo(latlng);
		
		if (bizdistseq) {
			map.fireEvent('click', {
				latlng: latlng, 
				originalEvent: {
					ctrlKey: true,
					searchBizdist : true		/* 상권검색후 리스트 클릭시 구분필요로 추가  */
				}
			});
		}
	};
	
	
	// 처음 한번만 호출되긴 함
	var fnUpdateSidoList = function(sidonm) {
		//if (sidoArr) {
		//	console.log("aaadfda");
		//	return $.Deferred().resolve({response: sidoArr});
		//}
		return fnListPrivate({
		}).done(function(resp) {
			var	$list = $listSidoBizdist.children('ul');
			sidoArr = resp.response;
			
			$list.append(tmplAddr({sidoArr: sidoArr}));

			if(sidonm === ""){
				sidonm = sidoArr[0].sidonm;
				fnUpdateSggList(sidonm, sidoArr[0].adm_cd, "");
			}		
			$list.find('a').removeClass('active');
			$list.find('[data-list-addr-sido="' + sidonm + '"]').addClass('active');
		});
	};	
	
	var fnUpdateSggList = function(sidonm, sidocd, sggnm) {
		if (prevBizdist.sggnm === sggnm && prevBizdist.sidonm === sidonm) {
			return $.Deferred().resolve({});
		}
		
		prevBizdist.sidonm = sidonm;
		prevBizdist.sidocd = sidocd;
		
		$spanSidoNm.text(sidonm);
		
		return fnListPrivate({
			sidonm: sidonm
		}).done(function(resp) {
			
			sggArr = resp.response;
			
			var	$list = $listSggBizdist.children('ul');
			
			// 동 정보도 삭제
			$listBizdist.children('ul').children(':not(.all-item)').remove();
			
			$list.children(':not(.all-item)').remove();
			
			$list.append(tmplAddr({sggArr: sggArr}));
			
			if(sggnm === ""){
				sggnm = sggArr[0].sggnm;
				fnUpdateBizdistList(sggnm, sggArr[0].adm_cd, "", "");
			}
			
			$list.find('[data-list-addr-sgg ="' + sggnm + '"]').addClass('active');
		});
	};
	
	var fnUpdateBizdistList = function(sggnm, sggcd, bizdistnm, bizdistcd) {
		
		if (prevBizdist.sggnm === sggnm && prevBizdist.bizdistnm === bizdistnm) {
			return $.Deferred().resolve({});
		}
		prevBizdist.sggnm = sggnm;
		prevBizdist.sggcd = sggcd;	
		$spanSggNm.text(sggnm);	

		var	$list = $listBizdist.children('ul');
		
		return z.xAsync('Gis', '주소_검색_상권명', 'select', {admCd: prevBizdist.sggcd.substring(0,5)}, 'json').done(function(resp) {
			var bizdistArr = resp;

			var	$list = $listBizdist.children('ul');
			
			$list.children(':not(.all-item)').remove();
			
			$list.append(tmplAddr({bizdistArr: bizdistArr}));
			
			if(bizdistnm === ""){
				bizdistnm = bizdistArr[0].bizdist_nm;
				bizdistcd = bizdistArr[0].순번;  
			}	
			
			$list.find('[data-list-addr-bizdist="' + bizdistnm + '"]').addClass('active');
			
			prevBizdist.bizdistnm = bizdistnm;
			prevBizdist.bizdistcd = bizdistcd;
			$spanBizdistNm.text(bizdistnm);				
			fnMoveMap(bizdistcd);
		});
	};
	
	
	var fnLoadBizdist = function() {
		var param = {};
		
		return z.xAsync('Gis', '상권영역', 'select', param, 'json2').done(function(resp) {
			if (! resp.length) {
				return;
			}
			 
			for (var i in resp) {
				var bizdist = resp[i],
					geoJson = Terraformer.WKT.parse(bizdist.geom),
					coordArr = [];
				
				coordArr.push(geoJson.coordinates[0]);
				
				for (var k in coordArr) {
					var coord = coordArr[k],
						latLngArr = [],  
						latLngRawArr = [];

					for (var l in coord) {
						latLngArr.push(L.latLng(coord[l][1], coord[l][0]));
					}

		       		var polygon = L.polygon(latLngArr, {
						zIndexOffset: map.Z_INDEX_OFFSET_LINE,
						weight: 1,
						color: '#0100FF',
						opacity: 1,
						fillColor: '#FFD400',
						fillOpacity: 0.5
		       		});

					polygon.turfPolygon = turf.polygon(geoJson.coordinates);
					polygon.turfCenter = turf.centroid(polygon.turfPolygon);
					polygon.turfBBox = turf.bbox(polygon.turfPolygon);
					polygon.bizdist = bizdist;
					bizdist.geom = null;

					polygon.bindLabel($('<label/>', {text: bizdist['상권'], 'class': 'title'}).prop('outerHTML'), {
						noHide: true,
						className: 'block-map commercial-name on',
						offset: [0, -50]
					});

					map.bizdistArr.push(polygon);
				}
			}
		});
	};
	
	var fnToggleBizdistMap = function(){
		if (! map.bizdistArr.length) {
			return;
		}
		if (! map.bizdistLayer.getLayers().length) {
			for (var i in map.bizdistArr) {
				map.bizdistLayer.addLayer(map.bizdistArr[i]);
			}
		}
	}
	
    return {
        // Public functions
        init: function(options) {        	
			$modalbtnBizdist = options.btnBizdist;			
			// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
			setBtnListener();
        },
    	mapinit: function(){
    		setMap();    		
    	}
    };    
}();
  
$(function() {
	// 지도API
	$.when(
		$.getScript("https://vapi.dawulmap.com:8443/MapAppServer/DWService?req={'header':{'format':'JSON','serviceName':'SDK_REQ','key':'14cc08123cd6d425d603917caf3ee061895e4192'},'body':{'sdkType':'AJAX','version':'2.0'}}"),
		$.getScript("https://cdnjs.cloudflare.com/ajax/libs/terraformer/1.0.12/terraformer.min.js")
	).always(function(){
		$.when(
			$.getScript("https://cdn.jsdelivr.net/npm/terraformer-wkt-parser@1.2.1/terraformer-wkt-parser.min.js"),
			$.getScript("https://cdnjs.cloudflare.com/ajax/libs/Turf.js/5.1.6/turf.min.js"),
			$.getScript("/resources/common/core/3rd_extends/leaflet.draw/leaflet.draw-src.js")
		).always(function() {
			$.when(
				$.getScript("/resources/common/custom/js/tooltipLayout.js"),
				$.getScript("/resources/common/custom/js/language_change.js"),
				$.getScript("/resources/common/custom/js/dawul_url-src.js"),
				$.getScript("/resources/common/custom/js/json_datas.js"),
				$.getScript("/resources/common/custom/js/grid.js"),
				$.getScript("/resources/common/custom/js/common.js")
			).always(function(){
				apiSearchBizdistMap.mapinit();
			})
		});
		
		$('.modal-content .btn-zoom-in').click(function() {
			map.setZoom(map.getZoom() + 1);
		});
		
		$('.modal-content .btn-zoom-out').click(function() {
			map.setZoom(map.getZoom() - 1);
		});
	});
});
