var map = null,
	$map = $('#map');

var miniMap = null;



var outputAreaMap = (function() {
	var self = this;


	function fnUpdateSquareCnt() {
		var cnt = 0,
			$cnt = $('[data-cnt-square]'),
			$textEmpty = $('[data-cnt-text=empty]'),
			$textSelected = $('[data-cnt-text=selected]');
		
		for (var i in map.userSelectedAreaArr) {
			cnt += map.userSelectedAreaArr[i].squareArr.length;
		}

		cnt += map.userSelectedClickArr.length;

		
		$cnt.text(cnt);
		
		if (! cnt) {
			$cnt.removeClass('label-danger').addClass('label-secondary');
			$textEmpty.show();
			$textSelected.hide();
		} else {
			$cnt.removeClass('label-secondary').addClass('label-danger');
			$textEmpty.hide();
			$textSelected.show();
			
		}
		
		return cnt;
	}

	function fnIsSelectedSquare(latLng) {
		
		var selectedIdx = {polygon: -1, idx: -1};
		
		for (var i in map.userSelectedAreaArr) {
			var area = map.userSelectedAreaArr[i];
			
			for (var j in area.squareArr) {
				if (area.squareArr[j].getBounds().contains(latLng)) {
					selectedIdx = {polygon: i, idx: j};
					break;
				}
			}
		}
		
		for (var j in map.userSelectedClickArr) {
			if (map.userSelectedClickArr[j].getBounds().contains(latLng)) {
				selectedIdx = {polygon: -1, idx: j};
				break;
			}
		}
		
		return selectedIdx;
	}

	function fnCheckSquare(polygon) {
		var neLat = -1000,
			neLng = -1000,
			swLat = 1000,
			swLng = 1000,
			latLngArr = polygon._latlngs,
			latLngRawArr = [];
		
		for (var i in latLngArr) {
			var latLng = latLngArr[i];
			
			latLngRawArr.push([latLng.lng, latLng.lat]);
			
			if (swLat > latLng.lat) {
				swLat = latLng.lat;
			}
			if (swLng > latLng.lng) {
				swLng = latLng.lng;
			}
			
			if (neLat < latLng.lat) {
				neLat = latLng.lat;
			}
			if (neLng < latLng.lng) {
				neLng = latLng.lng;
			}
		}
		
		latLngRawArr.push([latLngArr[0].lng, latLngArr[0].lat]);

		var turfPolygon = turf.polygon([latLngRawArr]),
			turfPolygonArr = turf.unkinkPolygon(turfPolygon);


		var temp = {
				swLat: swLat - 0.00125,
				swLng: swLng - 0.00125,
				neLat: neLat + 0.00125,
				neLng: neLng + 0.00125
			},
			sw = Coord_Trans('wgstoutmk', new PT(temp.swLng, temp.swLat)),
			ne = Coord_Trans('wgstoutmk', new PT(temp.neLng, temp.neLat));	

	    KTUtil.btnWait(KTUtil.getById("btnBlock"), "spinner spinner-left spinner-dark pl-15", "Please wait");
	    
	    console.log('startTime: ' + moment().format('mm:ss.SSS'));

		$.ajax({
			url: '/api/gis/outputAreaLineList',
			method: 'GET',
			data:{
				swLat: sw.y,
				swLng: sw.x,
				neLat: ne.y,
				neLng: ne.x
			}
		}).always(function() {
			KTUtil.btnRelease(KTUtil.getById("btnBlock"));
		}).done(function(resp) {
		    console.log('dataTime: ' + moment().format('mm:ss.SSS'));		
			if (200 !== resp.code) {
				return;
			}
			
			var rectArr = resp.response,
				colorArr = [
//					'#FFE6E6',
//					'#FFB3B3',
//					'#FF9999',
					'#FF5354',
//					'#FF0000'
				];
			
			for (var j in rectArr) {

				var outputArea = rectArr[j],
					geoJson = Terraformer.WKT.parse(outputArea.geom),
					coordArr = [];

				// 사실 다 넣어도 되는데 새로운 케이스가 나오면 오류 확인 필요해서
				switch (geoJson.type) {
				case 'MultiPolygon':
					for (var k in geoJson.coordinates) {
						coordArr.push(geoJson.coordinates[k][0]);
					}
					break;
//				case 'Polygon':
				default:
					coordArr.push(geoJson.coordinates[0]);
					break;
				}

				for (k in coordArr) {
					var coord = coordArr[k],
						latLngArr = [],
						latLngRawArr = [];

					for (var l in coord) {
						latLngArr.push(new L.LatLng(coord[l][1], coord[l][0]));
					}
					
					// 시작점과 끝점이 일치하지 않는 경우 일치시키도록 1점 더 추가
					var firstLatLng = latLngArr[0],
						lastLatLng = latLngArr[latLngArr.length - 1];
					
					if (firstLatLng.lat !== lastLatLng.lat || firstLatLng.lng !== lastLatLng.lng) {
						latLngArr.push(new L.LatLng(firstLatLng.lat, firstLatLng.lng));
					}

					for (var l in latLngArr) {
						latLngRawArr.push([latLngArr[l].lng, latLngArr[l].lat]);
					}
					
					var bounds = turf.polygon([latLngRawArr]),
//						boundsUnlinkArr = turf.unkinkPolygon(bounds),
						boundsUnlinkArr = null,
						isBounded = false;

					// 폴리곤 규칙에 위배되는 잘못된 데이터가 있어서 예외처리함
					// ex: blockCd 11040550200020000001
					try {
						boundsUnlinkArr = turf.unkinkPolygon(bounds);					
					} catch (err) {
//						console.log(err);
//						console.log(outputArea);
						continue;
					}
					
					// 선택범위 전체 중 1개에만 바운드에 모두 들어가 있으면 선택됨
					for (var k in turfPolygonArr.features) {
						for (var l in boundsUnlinkArr.features) {
							if (turf.intersect(turfPolygonArr.features[k], boundsUnlinkArr.features[l])) {
								isBounded = true;
								break;
							}
						}

						if (isBounded) {
							break;
						}
					}
					
					if (isBounded) {
						
						var randomOpacity = Math.floor(colorArr.length * Math.random());

						var polygonSquare = new L.Polygon(latLngArr, {
							weight: 2,
							color: '#0100FF',
							opacity: 1,
							fillColor: colorArr[randomOpacity],
							fillOpacity: 0.5
						});
						
						polygonSquare.blockCd = outputArea['block_cd'];
						
						polygon.squareArr.push(polygonSquare);

						map.squareLayer.addLayer(polygonSquare);
						
						polygonSquare.bringToBack();
					}

				}
			}
			
			L.DomEvent.on(polygon, 'contextmenu', function(evt) {
				if (confirm('삭제 하시겠습니까?')) {
					fnDrawPolygonDelete(evt.target);
				}
			});

			fnUpdateSquareCnt();
			
		    console.log('endTime: ' + moment().format('mm:ss.SSS'));
		});
	}
	
	
	
	return {

		fnInitBlockMap: function(isPositionSelected, position) {
			var self = this;
			
			if (! isPositionSelected) {
				var defaultCenter = [37.5118, 127.0592];
				
				if ('undefined' !== (typeof navigator.geolocation)) {
					navigator.geolocation.getCurrentPosition(function(pos) {
						self.fnInitBlockMap(true, [pos.coords.latitude, pos.coords.longitude]);
					}, function(err) {
						self.fnInitBlockMap(true, defaultCenter);
					});
				} else {
					self.fnInitBlockMap(true, defaultCenter);
				}
				
				return;
			}

		    map = L.map('map', {
		        continuousWorld : true,
		        zoomControl : false,
		        zoomAnimation : true,
		        fadeAnimation : false,
		        inertia : false,
		        center: position,  // 지도 초기 위치
		        zoom: 10 // 지도 초기 줌 레벨
		    });
		    BaseMapChange(map, L.Dawul.BASEMAP_GEN);  //베이스맵 일발지도 호출
//		     OverMapChange(map, L.Dawul.OVERMAP_JIJUK);

		    //미니맵
//		    miniMap = new L.Control.MiniMap(null, {
//		        width : 250,
//		        height : 250,
//		        toggleDisplay : true,
//		        position : 'topleft',
//		        miniMapDefaultMode : false
//		    });
//		    map.addControl(miniMap);
		 
		    apiAddr.fnSetMap(map);
			apiAddr.fnGps(new L.LatLng(position[0], position[1]));

			//스케일바
		    var scaleBar = new L.Control.Scale({
		        position : 'bottomright'
		    });
		    map.addControl(scaleBar);
		 
		    //줌 바
//		    var slider = new L.Control.Zoomslider({
//		        position : 'topright'
//		    });
//		    map.addControl(slider);
		     
		    //user 버튼 (면적,거리,지도 저장...)
//		    var userBtns = new L.Control.UserBtns({
//		        position:'topright'
//		    });
//		    map.addControl(userBtns);

//		 	var drawnItems = new L.FeatureGroup();
//		 	map.addLayer(drawnItems);

//		 	var drawControl = new L.Control.Draw({
//		 		edit: {
//		 			featureGroup: drawnItems,
//		 			edit: true,
//		 			'delete': true
//		 		}
//		 	});
//		 	map.addControl(drawControl);

			map.createPane = function(name, container) {
				var className = 'leaflet-pane' + (name ? ' leaflet-' + name.replace('Pane', '') + '-pane' : ''),
			    pane = L.DomUtil.create('div', className, container || this._mapPane);

				if (name) {
					map._panes[name] = pane;
				}
				return pane;
			};


			// z-index 정렬
			map.Z_INDEX_OFFSET_LINE = 10;
			map.Z_INDEX_OFFSET_SQUARE= 20;
			map.Z_INDEX_OFFSET_AREA = 30;

			map.lineLayer = new L.LayerGroup();
			map.squareLayer = new L.LayerGroup();
			map.areaLayer = new L.LayerGroup();
			
			map.addLayer(map.lineLayer);
			map.addLayer(map.squareLayer);
			map.addLayer(map.areaLayer);
			
			map.lineLayer.setZIndex(500 + map.Z_INDEX_OFFSET_LINE);
			map.squareLayer.setZIndex(500 + map.Z_INDEX_OFFSET_SQUARE);
			map.areaLayer.setZIndex(500 + map.Z_INDEX_OFFSET_AREA);

			
			map.MAX_SELECTED = 1000;
			map.MIN_GRID_ZOOM = 8;
		    map.lastBlockCenter = new L.LatLng(0, 0);
		    
		    map.userSelectedAreaArr = [];
		    map.userSelectedClickArr = [];

		    map.repaintMap = function(resp) {

		    	if (200 !== resp.code || ! resp.response) {
		    		return;
		    	}

		    	var arr = resp.response;

		    	for (var i in arr) {
		    		var outputArea = arr[i],
		    			geoJson = Terraformer.WKT.parse(outputArea.geom),
		    			boundExtend = map.boundExtend,
		    			latLngArr = [];
		    		
		    		if (! geoJson) {
		    			continue;
		    		}

		    		var coord = geoJson.coordinates[0];

		    		for (var j in coord) {
		    			latLngArr.push(new L.LatLng(coord[j][1], coord[j][0]));
		    		}

		       		var polygon = new L.Polyline(latLngArr, {
						zIndexOffset: map.Z_INDEX_OFFSET_LINE,
						clickable: false,
		       			weight: 0.5,
		       			color: '#0100FF',
		       			opacity: 1,
		       			fillColor: '#01FF00',
		       			fillOpacity: 0.5
		       		});
		       		
		       		map.sqr200Arr.push(polygon);

		       		map.lineLayer.addLayer(polygon);
		    	}
		    };
		    
//		     map.isStop = false;
		    
		    map.serverGrid = function(isMove) {

		    	if (isMove) {
			    	var distance = map.lastBlockCenter.distanceTo(map.getCenter());
			
			    	// FIXME: 어느정도 거리가 최적화일지 판단 필요
			    	if (100 > distance) {
			    		return;
			    	}

					apiAddr.fnGps(map.getCenter());
		    	}

		    	return;
		    	
//		     	if (! map.isStop) {
//		     		map.isStop = true;
//		     	} else {
//		     		return;
//		     	}

		   		for (var i in map.sqr200Arr) {
		   			map.lineLayer.removeLayer(map.sqr200Arr[i]);
		   		}

		    	map.sqr200Arr = [];
		    	map.lastBlockCenter = map.getCenter();
		    	
		    	if (map.MIN_GRID_ZOOM > map.getZoom()) {
		    		return;
		    	}
		    	
		    	var bound = map.getBounds(),
		    		data = {
						'neLat': bound._northEast.lat,
						'neLng': bound._northEast.lng,
						'swLat': bound._southWest.lat,
						'swLng': bound._southWest.lng
			    	},
			    	deltaX = (data.neLng - data.swLng) / 2,
			    	deltaY = (data.neLat - data.swLat) / 2;

		    	data.neLng += deltaX;
		    	data.swLng -= deltaX;
		    	data.neLat += deltaY;
		    	data.swLat -= deltaY;
		    	
		    	map.boundExtend = data;
		    	
		    	var temp = $.extend(true, {}, data),
					sw = Coord_Trans('wgstoutmk', new PT(temp.swLng, temp.swLat)),
					ne = Coord_Trans('wgstoutmk', new PT(temp.neLng, temp.neLat));
		    	
		    	data.neLat = ne.y;
		    	data.neLng = ne.x;
		    	data.swLat = sw.y;
		    	data.swLng = sw.x;

		    	$.ajax({
		    		url: '/api/gis/outputAreaLineList',
		    		method: 'GET',
		    		data: data
		    	}).done(function(resp) {
		    		map.repaintMap(resp);
		    	});
		    	
		    };

		    
		    map.addEventListener('moveend', function(evt) {
		    	map.serverGrid(true);
		    });
		    
		    map.addEventListener('zoomend', function(evt) {
		    	map.serverGrid();
		    });
		    
		    map.addEventListener('click', function(evt) {
		    	
		    	if (map.isDrawing) {
		    		return;
		    	}

		    	// 이미 선택된 영역인지 확인
		    	var selectedIdx = fnIsSelectedSquare(evt.latlng);

		    	if (-1 < selectedIdx.idx) {
		    		if (-1 === selectedIdx.polygon) {
			    		map.removeLayer(map.userSelectedClickArr[selectedIdx.idx]);
			    		map.userSelectedClickArr.splice(selectedIdx.idx, 1);
		    		}
		    	} else {
		    		if (! (map.MAX_SELECTED > fnUpdateSquareCnt())) {
						alert('최대 ' + map.MAX_SELECTED + '개 까지 선택 가능합니다');
						return;
		    		}
		    		
		    		var bound = map.getBounds();

		        	var temp = $.extend(true, {}, bound),
		    			sw = Coord_Trans('wgstoutmk', new PT(temp._southWest.lng, temp._southWest.lat)),
		    			ne = Coord_Trans('wgstoutmk', new PT(temp._northEast.lng, temp._northEast.lat)),
		    			latlng = evt.latlng,
		    			latlngTrs = Coord_Trans('wgstoutmk', new PT(evt.latlng.lng, evt.latlng.lat));

		        	$.ajax({
		        		url: '/api/gis/outputAreaDetail',
		        		method: 'GET',
		        		data: {
		        			lat: latlng.lat,
		        			lng: latlng.lng,
		        			'latTrs': latlngTrs.y,
		        			'lngTrs': latlngTrs.x,
		    				'neLat': ne.y,
		    				'neLng': ne.x,
		    				'swLat': sw.y,
		    				'swLng': sw.x
		        		}
		        	}).done(function(resp) {
		        		if (200 !== resp.code) {
		        			return;
		        		}
		        		
		        		var outputArea = resp.response,
			    			latLngArr = [],
			    			geoJson = Terraformer.WKT.parse(outputArea.geom),
			    			coordArr = [];

		    			// 사실 다 넣어도 되는데 새로운 케이스가 나오면 오류 확인 필요해서
		    			switch (geoJson.type) {
		    			case 'MultiPolygon':
		    				for (var k in geoJson.coordinates) {
		    					coordArr.push(geoJson.coordinates[k][0]);
		    				}
		    				break;
//		    			case 'Polygon':
		    			default:
		    				coordArr.push(geoJson.coordinates[0]);
		    				break;
		    			}
		    			
		    			for (var i in coordArr) {
			    			var coord = coordArr[i];
				
				    		for (var j in coord) {
				    			latLngArr.push(new L.LatLng(coord[j][1], coord[j][0]));
				    		}
			
			        		var polygon = new L.Polygon(latLngArr, {
								zIndexOffset: map.Z_INDEX_OFFSET_SQUARE,
			        			weight: 2,
			        			color: '#0100FF',
			        			opacity: 1,
			        			fillColor: '#FF5354',
			        			fillOpacity: 0.5
			        		});
			        		
			        		map.userSelectedClickArr.push(polygon);
			
			        		map.squareLayer.addLayer(polygon);
			        		
			        		polygon.blockCd = outputArea['block_cd'];
		    			}
		        		
		        		fnUpdateSquareCnt();
		        	});
		    	}
		    });
		    
		    map.addEventListener('draw:created', function (evt) {
		    	var type = evt.layerType;
				var layer = evt.layer;
				
//		 		drawnItems.addLayer(layer);

				map.isDrawing = false;

				switch (type) {
					case 'polygon':
						map.userSelectedAreaArr.push(layer);
						map.areaLayer.addLayer(map.userSelectedAreaArr[map.userSelectedAreaArr.length-1]);
						layer.setStyle({
							zIndexOffset: map.Z_INDEX_OFFSET_AREA,
							weight: 3,
							color : "#FF00DD",
							opacity : 1,
							fillColor : "#FF00DD",
							fillOpacity : 0.2
						});
						
						layer.squareArr = [];
						
						fnCheckSquare(layer);
						break;
				}
		    });
		    
		    map.serverGrid(true);
		     
		}, //init

		fnDrawPolygonAdd: function() {
			if (map.isDrawing) {
				return;
			}
			map.isDrawing = true;
			
			var obj = new L.Draw.Polygon(map, {});
			obj.enable();
		},

		fnDrawPolygonDelete: function(polygon) {
			
			if (! polygon) {
				while (map.userSelectedAreaArr.length > 0) {
					polygon = map.userSelectedAreaArr[map.userSelectedAreaArr.length - 1];
					
					for (var i in polygon.squareArr) {
						map.squareLayer.removeLayer(polygon.squareArr[i]);
					}
					
					map.areaLayer.removeLayer(polygon);
					map.userSelectedAreaArr.pop();
				}
				
				while (map.userSelectedClickArr.length > 0) {
					polygon = map.userSelectedClickArr[map.userSelectedClickArr.length - 1];
					
					map.squareLayer.removeLayer(polygon);
					map.userSelectedClickArr.pop();
				}
			} else {
				map.areaLayer.removeLayer(polygon);
				map.userSelectedAreaArr.splice(map.userSelectedAreaArr.indexOf(polygon), 1);
				
				for (var i in polygon.squareArr) {
					map.squareLayer.removeLayer(polygon.squareArr[i]);
				}
			}

			fnUpdateSquareCnt();
		}
		
	};
})();



$(function() {
	
	// FIXME: 공통으로 정해야 할 필요 있음
	$('#kt_content').addClass('p-0');
	
	// 지도API
	$.when(
		$.getScript("http://vapi.dawulmap.com:8000/MapAppServer/DWService?req={'header':{'format':'JSON','serviceName':'SDK_REQ','key':'14cc08123cd6d425d603917caf3ee061895e4192'},'body':{'sdkType':'AJAX','version':'2.0'}}"),
//		$.getScript("https://vapi.dawulmap.com:8443/MapAppServer/DWService?req={'header':{'format':'JSON','serviceName':'SDK_REQ','key':'14cc08123cd6d425d603917caf3ee061895e4192'},'body':{'sdkType':'AJAX','version':'2.0'}}"),
		$.getScript("https://unpkg.com/terraformer@1.0.12/terraformer.js")
	).always(function() {
		$.when(
			$.getScript("/resources/common/core/3rd_extends/leaflet.draw/leaflet.draw-src.js"),
			$.getScript("https://unpkg.com/terraformer-wkt-parser@1.1.2/terraformer-wkt-parser.js"),
			$.getScript("https://cdn.jsdelivr.net/npm/@turf/turf@5/turf.min.js"),
			$.getScript("/resources/common/custom/js/pages/gis/blockcharts.js"),
			$.getScript("/resources/admin/APPS/gis/apiAddress.js")
		).always(function() {
			outputAreaMap.fnInitBlockMap();
		});
	});

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

	$(document).on('click', '#btnBlock', function(){
	    $('#mapBlockPanel').removeClass('d-none');
	    $('#mapBlockPanel').addClass('d-flex');
	});
	$(document).on('click', '#mapBlockClose', function(){
	    $('#mapBlockPanel').removeClass('d-flex');
	    $('#mapBlockPanel').addClass('d-none');
	});
	
	$('#kt_content .btn-zoom-in').click(function() {
		map.setZoom(map.getZoom() + 1);
	});
	
	$('#kt_content .btn-zoom-out').click(function() {
		map.setZoom(map.getZoom() - 1);
	});
	
	var $today = $('#kt_content [data-today]');
	
	$today.text(moment().format($today.attr('data-today')));

//	KTUtil.ready(function() {
//	    // Init Scrolltop
//		KTLayoutScrolltop.init('kt_scrolltop_blockmap')
//	});
	
	var $scroll = $('#mapBlockPanel .ps.scroll');

	KTUtil.scrollInit($scroll[0], {
		mobileNativeScroll: true,
		handleWindowResize: true,
		rememberPosition: ($scroll.data('remember-position') == 'true' ? true : false)
	});

});
