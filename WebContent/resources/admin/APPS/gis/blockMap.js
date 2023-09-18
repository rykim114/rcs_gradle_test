if(_isDemo) {
	z.msg(_DemoMsgBlockX);
}

var map = null,
	$map = $('#map');
var miniMap = null;
var lan = 'KOR';


var blockMap = (function() {
	var self = this,
		$btnFavorite = $('#mapBlockPanel [data-btn-favorite]'),
		$wrapGisBlockDtl = $('#wrapGisBlockDtl'),
		$body = $('body'),
		//blockColor = '#FF5354',
		blockColor = '#FF3399',
		dfrCommCode = $.Deferred();

	/* <지도레이어 종류>
	 * map.lineLayer : 격자 선 표시
	 * map.squareLayer : 선택된 영역
	 * map.areaLayer : 선택 중 표시 
	 * map.outputAreaLayer : 집계구
	 * map.bizdistLayer : 상권
	 * 
	 * <지도관련변수>
	 * map.isDrawing : 그리기중인지 여부
	 * map.cntClicking : 클릭한 수?? 
	 * window.dist._measuring : ??
	 * 
	 * <Arr설명> 
	 * map.sqr100Arr : 격자에 대한 정보가 들어가있음
	 * map.userSelectedClickArr : 단일 선택시 선택된 격자 
	 * map.userSelectedAreaArr : 다각형 선택시 선택된 격자
	 * map.userSelectedAreaArr : 반경 선택시 선택된 격자
	 * map.bizdistArr : 상권에 대한 정보
	 * 
	 * <변수설명>
	 * wktPolyArr : ??
	 * turf.center (wrapped bbox의 중심)
	 * turf.centroid (순전히 arithmetic 중심)
	 * turf.centerOfMass (물리학에서 아는 center of mass)
	 */ 
	
	
	var sanggaTypeArr = [
		'근린상가',
		'단지내상가',
		'복합상가',
		'테마상가',
		'오피스상가',
		'기타상가'
	];

	var sanggaTypeMap = {
		'근린상가': 0,
		'단지내상가': 1,
		'복합상가': 2,
		'테마상가': 3,
		'오피스상가': 4,
		'기타상가': 5
	};
	
	var industryTypeArr_old = [
		'관광/여가/오락',
		'부동산',
		'생활서비스',
		'소매',
		'숙박',
		'스포츠',
		'음식',
		'학문/교육'
	];

	var industryTypeArr_new = [
		'과학·기술',
		'교육',
		'보건의료',
		'부동산',
		'소매',
		'수리·개인',
		'숙박',
		'시설관리·임대',
		'예술·스포츠',
		'음식'
	];
	
	var industryTypeMap_old = {
		'관광/여가/오락': 0,
		'부동산': 1,
		'생활서비스': 2,
		'소매': 3,
		'숙박': 4,
		'스포츠': 5,
		'음식': 6,
		'학문/교육': 7
	};

	var industryTypeMap_new = {
		'과학·기술': 0,
		'교육': 1,
		'보건의료': 2,
		'부동산': 3,
		'소매': 4,
		'수리·개인': 5,
		'숙박': 6,
		'시설관리·임대': 7,
		'예술·스포츠': 8,
		'음식': 9
	};

	var industryTypeSKArr = [
		'교육',
		'서비스',
		'소매',
		'음식',
		'의료',
		'F_교육',
		'F_서비스',
		'F_소매',
		'F_음식',
		'F_의료'
	];
	
	$.when(
		z.getCommCode('100100'),
		z.getCommCode('100120'),
		z.getCommCode('100201'),
		z.getCommCode('100121')
	).done(function(respSg, respIn, respInNew, respSK) {
		sanggaTypeMap = respSg.reduce(function(acc, cur) {
			acc[cur['공통상세명']] = parseInt(cur['정렬코드']);
			return acc;
		}, {});

		sanggaTypeArr = [];
		
		for (var i in respSg) {
			sanggaTypeArr.push(respSg[i]['공통상세명']);
		}

		industryTypeMap_old = respIn.reduce(function(acc, cur) {
			acc[cur['공통상세명']] = parseInt(cur['정렬코드']);
			return acc;
		}, {});

		industryTypeArr_old = [];
		
		for (var i in respIn) {
			industryTypeArr_old.push(respIn[i]['공통상세명']);
		}

		industryTypeMap_new = respInNew.reduce(function(acc, cur) {
			acc[cur['공통상세명']] = parseInt(cur['정렬코드']);
			return acc;
		}, {});

		industryTypeArr_new = [];
		
		for (var i in respInNew) {
			industryTypeArr_new.push(respInNew[i]['공통상세명']);
		}

		industryTypeSKArr = [];
		
		for (var i in respSK) {
			industryTypeSKArr.push(respSK[i]['공통상세명']);
		}
		
		dfrCommCode.resolve({
			sanggaTypeArr: sanggaTypeArr,
			sanggaTypeMap: sanggaTypeMap,
			industryTypeArr_old: industryTypeArr_old,
			industryTypeMap_old: industryTypeMap_old,
			industryTypeArr_new: industryTypeArr_new,
			industryTypeMap_new: industryTypeMap_new,
			industryTypeSKArr: industryTypeSKArr
		});
	});

	/*
     * 함수명 : fnUpdateSquareCnt
     * 내용    : 격자 선택 수량 업데이트
     */
	function fnUpdateSquareCnt() {
		var cnt = 0,
			$cnt = $('[data-cnt-square]'),
			$textEmpty = $('[data-cnt-text=empty]'),
			$textSelected = $('[data-cnt-text=selected]'),
			$btnRunVis = $('#wrapMapBlockVis [data-btn-run-vis]');

		for (var i in map.userSelectedAreaArr) {
			cnt += map.userSelectedAreaArr[i].squareArr.length;
		}
		
		for (var i in map.userSelectedCircleArr) {
			cnt += map.userSelectedCircleArr[i].squareArr.length;
		}
		
		cnt += map.userSelectedClickArr.length;

		$cnt.text(cnt);
		
		if (! cnt) {
			$textEmpty.show();
			$textSelected.hide();
			
			$('.block-layer [data-btn-gis-stat]').removeClass('on');
			$btnRunVis.removeClass('btn-danger');
		} else {
			$textEmpty.hide();
			$textSelected.show();
			
			if (1 < cnt) {
				$btnRunVis.addClass('btn-danger');
			} else {
				$btnRunVis.removeClass('btn-danger');
			}
		}
		return cnt;
	}
	
	/*
     * 함수명 : fnIsSelectedSquare
     * 내용    : 단일선택시 선택된 격자의 idx 정보를 반환 (기존에 선택된 idx 인지 )
     */
	function fnIsSelectedSquare(latLng) {
		var selectedIdx = {polygon: -1, circle: -1, idx: -1};
		// 다각형 검색
		for (var i in map.userSelectedCircleArr) {
			var area = map.userSelectedCircleArr[i];
			
			for (var j in area.squareArr) {
				if (area.squareArr[j].getBounds().contains(latLng)) {
					selectedIdx = {polygon: -1, circle: i, idx: j};
					break;
				}
			}
		}
		// 반경 검색
		for (var i in map.userSelectedAreaArr) {
			var area = map.userSelectedAreaArr[i];
			
			for (var j in area.squareArr) {
				if (area.squareArr[j].getBounds().contains(latLng)) {
					selectedIdx = {polygon: i, circle: -1, idx: j};
					break;
				}
			}
		}
		// 단일 검색
		for (var j in map.userSelectedClickArr) {
			if (map.userSelectedClickArr[j].getBounds().contains(latLng)) {
				selectedIdx = {polygon: -1, circle: -1, idx: j};
				break;
			}
		}
		return selectedIdx;
	}
	
	
	/*
     * 함수명 : fnCheckSquare
     * 내용    : 다각형선택 완료!
     * 변수    : turfPolygonArr : 다각형 클릭좌표   
     */
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
			
			swLat = Math.min(swLat, latLng.lat);
			swLng = Math.min(swLng, latLng.lng);
			neLat = Math.max(neLat, latLng.lat);
			neLng = Math.max(neLng, latLng.lng);
		}
		latLngRawArr.push([latLngArr[0].lng, latLngArr[0].lat]);
		
		/* unkinkPolygon : 꼬인 polygon 을 그냥 polygon 으로 정리 */
		var turfPolygon = turf.polygon([latLngRawArr]),
			turfPolygonArr = turf.unkinkPolygon(turfPolygon);
		
		if (! $('#btnBlock').hasClass('spinner')) {
		    KTUtil.btnWait(KTUtil.getById("btnBlock"), "spinner spinner-left spinner-dark pl-15", "Please wait");
		    KTUtil.btnWait(KTUtil.getById("btnNonBlock"), "spinner spinner-left spinner-dark pl-15", "Please wait");
		}

//	    console.log('startTime: ' + moment().format('mm:ss.SSS'));

		$.ajax({
			url: '/api/gis/sqr100GridList',
			method: 'GET',
			data:{
				swLat: swLat - 0.0125,
				swLng: swLng - 0.0125,
				neLat: neLat + 0.0125,
				neLng: neLng + 0.0125 
			}
		}).always(function() {
			if ($('#btnBlock').hasClass('spinner')) {
				KTUtil.btnRelease(KTUtil.getById("btnBlock"));
				KTUtil.btnRelease(KTUtil.getById("btnNonBlock"));
			}
		}).done(function(resp) {
//		    console.log('dataTime: ' + moment().format('mm:ss.SSS'));		
			if (200 !== resp.code) {
				return;
			}
			
			var rectArr = resp.response,
				boundaryObj = {
    				swLat: 1000,
    				swLng: 1000,
    				neLat: -1000,
    				neLng: -1000
				};
			
			for (var j in rectArr) {
				
				// 최대 추가 가능 개수 넘어간 경우 중단
				if (! (map.MAX_SELECTED > map.userSelectedClickArr.length)) {
					break;
				}
	
				var rect = rectArr[j],
					geoJson = Terraformer.WKT.parse(rect.geom),
					latLngArr = [],
					latLngRawArr = [],
					coordArr = [];
				
				coordArr.push(geoJson.coordinates[0]);

				for (k in coordArr) {
					var coord = coordArr[k];

					for (var l in coord) {
						latLngArr.push(L.latLng(coord[l][1], coord[l][0]));
					}
				}

				for (var k in latLngArr) {
					latLngRawArr.push([latLngArr[k].lng, latLngArr[k].lat]);
				}
				var bounds = turf.polygon([latLngRawArr]);
				
				for (var k in turfPolygonArr.features) {
					if (turf.intersect(turfPolygonArr.features[k], bounds)) {

						for (var kk in bounds.geometry.coordinates[0]) {
							var point = bounds.geometry.coordinates[0][kk];

							boundaryObj.swLat = Math.min(point[1], boundaryObj.swLat);
							boundaryObj.swLng = Math.min(point[0], boundaryObj.swLng);
							boundaryObj.neLat = Math.max(point[1], boundaryObj.neLat);
							boundaryObj.neLng = Math.max(point[0], boundaryObj.neLng);
						}
						
						// 이미 선택되어 있다면 제외
						var isExist = false, overlap = null, turfCenter = turf.centroid(bounds);
						for (var l in map.userSelectedClickArr) {
							var turfTest = map.userSelectedClickArr[l].turfPolygon,
								turfCenterTest = map.userSelectedClickArr[l].turfCenter;
								
							if (turfCenterTest && 0.4 < turf.distance(turfCenter, turfCenterTest)) {
								continue;
							}

							// 거리를 재봐서 400m 초과하면 제외
							// 400m 이내이면 겹치는 부분 확인
							// 인접한 경우 점 또는 선이 겹쳐서 영역이 0 이지만, 혹시 모를 오차에 대비해 200 정도 여유 판정
							// 200x200 블럭의 넓이 계산 해보면 대략 4만으로 확인됨
							if (turfTest && (overlap = turf.intersect(turfTest, bounds))
									&& 200 < turf.area(overlap)) {
								isExist = true;
								break;
							}
						}
						
						if (isExist) {
							break;
						}
						
						// 신규 영역만 추가
						var polygonSquare = L.polygon(latLngArr, {
							weight: 0,
							color: '#0100FF',
							opacity: 1,
							fillColor: blockColor,
							fillOpacity: 0.5
						});
						
						// 관리 편리하려고 통합함
//						polygon.squareArr.push(polygonSquare);
//						map.squareLayer.addLayer(polygonSquare);
//						polygonSquare.bringToBack();
						polygonSquare.turfPolygon = bounds;
						polygonSquare.turfCenter = turf.centroid(polygonSquare.turfPolygon);
						polygonSquare.turfBBox = turf.bbox(polygonSquare.turfPolygon);
						polygonSquare.blockId = rect.id;
						polygonSquare.outputAreaArr = [];
						polygonSquare.outputAreaSet = new Set();
						
		        		map.userSelectedClickArr.push(polygonSquare);
						map.userSelectedClickMap[polygonSquare.blockId] = polygonSquare;
		        		map.squareLayer.addLayer(polygonSquare);

						polygonSquare.sido = rect['시도명'];
						polygonSquare.sgg = rect['시군구명'];
						polygonSquare.emd = rect['읍면동명'];

		        		polygonSquare.on('mouseout', function(evt) {
							$wrapGisBlockDtl.hide();
							$body.css('overflow', '');
						}).on('mousemove', function(evt) {
							var target = evt.target,
								position = evt.containerPoint;

							if (! target.visTitle) {
								$wrapGisBlockDtl.hide();
								$body.css('overflow', '');
							} else {
								$wrapGisBlockDtl.show();
								$body.css('overflow', 'hidden');
								
								$wrapGisBlockDtl.css({
									left: position.x + 60,
									top: position.y + 30
								});
								
								$wrapGisBlockDtl.find('[data-block-id]').text(target.blockId);
								$wrapGisBlockDtl.find('[data-sido]').text(target.sido);
								$wrapGisBlockDtl.find('[data-sgg]').text(target.sgg);
								$wrapGisBlockDtl.find('[data-emd]').text(target.emd);
								$wrapGisBlockDtl.find('[data-vis-title]').text(target.visTitle);
								$wrapGisBlockDtl.find('[data-vis-content]').text(target.visContent);
							}
						});

						break;
					}
				}
			}
			
			$(polygon._path).fadeOut(1000, function() {
				map.areaLayer.removeLayer(polygon);
			});

			fnAttachOutputArea(boundaryObj);
			
			// 영역 삭제 > 개별 삭제로 수정
//			L.DomEvent.on(polygon, 'contextmenu', function(evt) {
//				z.msgConfirm({
//					html: '삭제 하시겠습니까?'
//				}).then(function(result) {
//					if (result.isConfirmed) {
//						blockMap.fnDrawPolygonDelete(evt.target);
//					}
//				});
//			});
	
			fnUpdateSquareCnt();
			
//		    console.log('endTime: ' + moment().format('mm:ss.SSS'));
		});
	}
	
	/*
     * 함수명 : fnCheckSquareCircle
     * 내용    : 반경선택 완료!
     * 변수    : turfPolygonArr : 다각형 클릭좌표   
     */
	function fnCheckSquareCircle(circle) {
		var neLat = -1000,
			neLng = -1000,
			swLat = 1000,
			swLng = 1000;
		
		var point = turf.point([circle._latlng.lng, circle._latlng.lat]);
		var distance = circle._mRadius / 1000;
		var options = {units: 'kilometers'};
		var destination1 = turf.destination(point, distance, -180, options);
		var destination2 = turf.destination(point, distance,  -90, options);
		var destination3 = turf.destination(point, distance,    0, options);
		var destination4 = turf.destination(point, distance,   90, options);
		// var destination5 = turf.destination(point, distance,  180, options);
		
		//var mapBound = map.getBounds();
		swLat = Math.min(swLat, destination1.geometry.coordinates[1]);
		swLng = Math.min(swLng, destination2.geometry.coordinates[0]);
		neLat = Math.max(neLat, destination3.geometry.coordinates[1]);
		neLng = Math.max(neLng, destination4.geometry.coordinates[0]);
		
		var turfCircle = turf.circle([circle._latlng.lng, circle._latlng.lat], circle._mRadius / 1000 , {steps: 64, units: 'kilometers'});
		
		if (! $('#btnBlock').hasClass('spinner')) {
		    KTUtil.btnWait(KTUtil.getById("btnBlock"), "spinner spinner-left spinner-dark pl-15", "Please wait");
		    KTUtil.btnWait(KTUtil.getById("btnNonBlock"), "spinner spinner-left spinner-dark pl-15", "Please wait");
		}

//	    console.log('startTime: ' + moment().format('mm:ss.SSS'));
		
		$.ajax({
			url: '/api/gis/sqr100GridList',
			method: 'GET',
			data:{
				swLat: swLat - 0.0025,
				swLng: swLng - 0.0025,
				neLat: neLat + 0.0025,
				neLng: neLng + 0.0025 
			}
		}).always(function() {
			if ($('#btnBlock').hasClass('spinner')) {
				KTUtil.btnRelease(KTUtil.getById("btnBlock"));
				KTUtil.btnRelease(KTUtil.getById("btnNonBlock"));
			}
		}).done(function(resp) {
//		    console.log('dataTime: ' + moment().format('mm:ss.SSS'));		
			if (200 !== resp.code) {
				return;
			}
			
			var rectArr = resp.response,
				boundaryObj = {
    				swLat: 1000,
    				swLng: 1000,
    				neLat: -1000,
    				neLng: -1000
				};
			
			for (var j in rectArr) {
				// 최대 추가 가능 개수 넘어간 경우 중단
				if (! (map.MAX_SELECTED > map.userSelectedClickArr.length)) {
					break;
				}
	
				var rect = rectArr[j],
					geoJson = Terraformer.WKT.parse(rect.geom),
					latLngArr = [],
					latLngRawArr = [],
					coordArr = [];
				
				coordArr.push(geoJson.coordinates[0]);

				for (k in coordArr) {
					var coord = coordArr[k];

					for (var l in coord) {
						latLngArr.push(L.latLng(coord[l][1], coord[l][0]));
					}
				}

				for (var k in latLngArr) {
					latLngRawArr.push([latLngArr[k].lng, latLngArr[k].lat]);
				}
				var bounds = turf.polygon([latLngRawArr]);
								
				if (turf.intersect(turfCircle, bounds)) {					
					
					for (var kk in bounds.geometry.coordinates[0]) {
						var point = bounds.geometry.coordinates[0][kk];

						boundaryObj.swLat = Math.min(point[1], boundaryObj.swLat);
						boundaryObj.swLng = Math.min(point[0], boundaryObj.swLng);
						boundaryObj.neLat = Math.max(point[1], boundaryObj.neLat);
						boundaryObj.neLng = Math.max(point[0], boundaryObj.neLng);
					}
					
					/* 이미 선택되어 있다면 제외 */
					var isExist = false, overlap = null, turfCenter = turf.centroid(bounds);
					for (var l in map.userSelectedClickArr) {
						var turfTest = map.userSelectedClickArr[l].turfPolygon,
							turfCenterTest = map.userSelectedClickArr[l].turfCenter;
						
						if (turfCenterTest && 0.4 < turf.distance(turfCenter, turfCenterTest)) {
							continue;
						}
						
						// 거리를 재봐서 400m 초과하면 제외
						// 400m 이내이면 겹치는 부분 확인
						// 인접한 경우 점 또는 선이 겹쳐서 영역이 0 이지만, 혹시 모를 오차에 대비해 200 정도 여유 판정
						// 200x200 블럭의 넓이 계산 해보면 대략 4만으로 확인됨
						if (turfTest && (overlap = turf.intersect(turfTest, bounds)) && 200 < turf.area(overlap)){ 
							isExist = true;
							break;
						}
					}
					
					if (!isExist) {
					
						// 신규 영역만 추가
						var polygonSquare = L.polygon(latLngArr, {
							weight: 0,
							color: '#0100FF',
							opacity: 1,
							fillColor: blockColor,
							fillOpacity: 0.5
						});
						
						polygonSquare.turfPolygon = bounds;
						polygonSquare.turfCenter = turf.centroid(polygonSquare.turfPolygon);
						polygonSquare.turfBBox = turf.bbox(polygonSquare.turfPolygon);
						polygonSquare.blockId = rect.id;
						polygonSquare.outputAreaArr = [];
						polygonSquare.outputAreaSet = new Set();
						
		        		map.userSelectedClickArr.push(polygonSquare);
						map.userSelectedClickMap[polygonSquare.blockId] = polygonSquare;
		        		map.squareLayer.addLayer(polygonSquare);
	
						polygonSquare.sido = rect['시도명'];
						polygonSquare.sgg = rect['시군구명'];
						polygonSquare.emd = rect['읍면동명'];
	
		        		polygonSquare.on('mouseout', function(evt) {
							$wrapGisBlockDtl.hide();
							$body.css('overflow', '');
						}).on('mousemove', function(evt) {
							var target = evt.target,
								position = evt.containerPoint;
	
							if (! target.visTitle) {
								$wrapGisBlockDtl.hide();
								$body.css('overflow', '');
							} else {
								$wrapGisBlockDtl.show();
								$body.css('overflow', 'hidden');
								
								$wrapGisBlockDtl.css({
									left: position.x + 60,
									top: position.y + 30
								});

								$wrapGisBlockDtl.find('[data-block-id]').text(target.blockId);
								$wrapGisBlockDtl.find('[data-sido]').text(target.sido);
								$wrapGisBlockDtl.find('[data-sgg]').text(target.sgg);
								$wrapGisBlockDtl.find('[data-emd]').text(target.emd);
								$wrapGisBlockDtl.find('[data-vis-title]').text(target.visTitle);
								$wrapGisBlockDtl.find('[data-vis-content]').text(target.visContent);
							}
						});
					}		
					//break;
				}
			}
			
			$(circle._path).fadeOut(1000, function() {
				map.areaLayer.removeLayer(circle);
			});

			fnAttachOutputArea(boundaryObj);
			
			// 영역 삭제 > 개별 삭제로 수정
//			L.DomEvent.on(polygon, 'contextmenu', function(evt) {
//				z.msgConfirm({
//					html: '삭제 하시겠습니까?'
//				}).then(function(result) {
//					if (result.isConfirmed) {
//						blockMap.fnDrawPolygonDelete(evt.target);
//					}
//				});
//			});
	
			fnUpdateSquareCnt();
			
//		    console.log('endTime: ' + moment().format('mm:ss.SSS'));
		});
	}	
	
	      
	/*
     * 함수명 : fnAttachOutputArea
     * 내용    : 집계구 선택 
     */
	function fnAttachOutputArea(bounds) {
		var self = this,
			temp = {
				swLat: bounds.swLat - 0.00250,
				swLng: bounds.swLng - 0.00250,
				neLat: bounds.neLat + 0.00250,
				neLng: bounds.neLng + 0.00250
			},
			// temp = {
			// 		swLat: bounds.swLat,
			// 		swLng: bounds.swLng,
			// 		neLat: bounds.neLat,
			// 		neLng: bounds.neLng
			// }
			sw = Coord_Trans('wgstoutmk', new PT(temp.swLng, temp.swLat)),
			ne = Coord_Trans('wgstoutmk', new PT(temp.neLng, temp.neLat));
		$.ajax({
			url: '/api/gis/outputAreaLineList',
			method: 'GET',
			data:{
				// swLat: temp.swLat,
				// swLng: temp.swLng,
				// neLat: temp.neLat,
				// neLng: temp.neLng
				swLat: sw.y,
				swLng: sw.x,
				neLat: ne.y,
				neLng: ne.x
			}
		}).done(function(resp) {
			var rectArr = resp.response,
				delay = 0,
				isDebugDrawArea = false; // 집계구 표시여부: 디버깅용 
			for (var j in rectArr) {
				// 연산 분량이 많아서 분리
				(function(outputArea) {
					setTimeout(function() {
						var geoJson = Terraformer.WKT.parse(outputArea.geom),
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
		//						boundsUnkinkArr = turf.unkinkPolygon(bounds),
								boundsUnkinkArr = null,
								bboxUnkinkArr = [];
		
							// 폴리곤 규칙에 위배되는 잘못된 데이터가 있어서 예외처리함
							// ex: blockCd 11040550200020000001
							try {
								boundsUnkinkArr = turf.unkinkPolygon(bounds);
								
								for (var ll in boundsUnkinkArr.features) {
									bboxUnkinkArr.push(turf.bbox(boundsUnkinkArr.features[ll]));
								}
							} catch (err) {
								console.log(err);
		//						console.log(outputArea);
								continue;
							}
							
							var isBounded = false;
							
							for (var n in map.userSelectedClickArr) {
								var polygon = map.userSelectedClickArr[n],
									turfBBox = polygon.turfBBox,
									turfPolygon = polygon.turfPolygon;
								
								// 선택범위 전체 중 1개에만 바운드에 모두 들어가 있으면 선택됨
								for (var l in boundsUnkinkArr.features) {
									// intersect 가 정교한 대신에 계산량이 많아서, bbox 에서부터 겹치지 않으면 제외
									var bbox = bboxUnkinkArr[l];
									
									if (turfBBox[0] > bbox[2] || turfBBox[2] < bbox[0] || turfBBox[1] > bbox[3] || turfBBox[3] < bbox[1]) {
										continue;
									}
									
									if (turf.intersect(turfPolygon, boundsUnkinkArr.features[l])) {
										if (! polygon.outputAreaSet.has(outputArea['block_cd'])) {
											isBounded = true;
											polygon.outputAreaSet.add(outputArea['block_cd']);
											polygon.outputAreaArr.push(outputArea);
										}
										break;
									}
								}
							}
							
							if (! isDebugDrawArea) {
								return;
							}    
								
							if (isBounded) {
								var polygonOutputArea = new L.Polygon(latLngArr, {
									weight: 2,
									color: '#0100FF',
									opacity: 1,
									fillColor: blockColor,
									fillOpacity: 0.5
								});
								
								polygonOutputArea.blockCd = outputArea['block_cd'];
		
								polygonOutputArea.turfPolygon = bounds;
								polygonOutputArea.turfCenter = turf.centroid(polygonOutputArea.turfPolygon);
				        		map.outputAreaLayer.addLayer(polygonOutputArea);
		
								polygonOutputArea.bringToBack();
							}
						}
//					}, delay += 10);
					});
				})(rectArr[j]);
			}
		});
	}
	
	/*
     * 함수명 : fnGetBlockIdArrPrivate
     * 내용    : BlockIdArr 을 get (영역선택배열과 단일선택배열)
     */
	function fnGetBlockIdArrPrivate() {
		var blockIdArr = [];

		for (var i in map.userSelectedCircleArr) {
			var arr = map.userSelectedCircleArr[i].squareArr;

			for (var j in arr) {
				if (arr[j].blockId) {
					blockIdArr.push(arr[j].blockId);
				}
			}
		}
		
		for (var i in map.userSelectedAreaArr) {
			var arr = map.userSelectedAreaArr[i].squareArr;

			for (var j in arr) {
				if (arr[j].blockId) {
					blockIdArr.push(arr[j].blockId);
				}
			}
		}
		
		for (var i in map.userSelectedClickArr) {
			if (map.userSelectedClickArr[i].blockId) {
				blockIdArr.push(map.userSelectedClickArr[i].blockId);
			}
		}

		return blockIdArr;		
	}

	/*
     * 함수명 : fnGetBlockIdArrBoundsPrivate
     * 내용    : 선택한 BlockIdArr 의 Bounds 를 구한다.
     */
	function fnGetBlockIdArrBoundsPrivate() {
		var sw = L.latLng(80, 170),
			ne = L.latLng(-80, -170);

		for (var i in map.userSelectedAreaArr) {
			var arr = map.userSelectedAreaArr[i].squareArr;

			for (var j in arr) {
				var latLngArr = arr[j].getLatLngs();
				
				for (var k in latLngArr) {
					var ll = latLngArr[k];
					
					sw.lat = Math.min(sw.lat, ll.lat);
					sw.lng = Math.min(sw.lng, ll.lng);
					ne.lat = Math.max(ne.lat, ll.lat);
					ne.lng = Math.max(ne.lng, ll.lng);
				}
			}
		}
		
		for (var i in map.userSelectedCircleArr) {
			var arr = map.userSelectedCircleArr[i].squareArr;

			for (var j in arr) {
				var latLngArr = arr[j].getLatLngs();
				
				for (var k in latLngArr) {
					var ll = latLngArr[k];
					
					sw.lat = Math.min(sw.lat, ll.lat);
					sw.lng = Math.min(sw.lng, ll.lng);
					ne.lat = Math.max(ne.lat, ll.lat);
					ne.lng = Math.max(ne.lng, ll.lng);
				}
			}
		}
		
		for (var i in map.userSelectedClickArr) {
			var latLngArr = map.userSelectedClickArr[i].getLatLngs();
			
			for (var k in latLngArr) {
				var ll = latLngArr[k];
				
				sw.lat = Math.min(sw.lat, ll.lat);
				sw.lng = Math.min(sw.lng, ll.lng);
				ne.lat = Math.max(ne.lat, ll.lat);
				ne.lng = Math.max(ne.lng, ll.lng);
			}
		}

		return L.latLngBounds(sw, ne);		
	}

	/*
     * 함수명 : fnGetBlockIdArrCenterPrivate
     * 내용    : 
     */
	function fnGetBlockIdArrCenterPrivate() {
		var wktPolyArr = [];

		for (var i in map.userSelectedAreaArr) {
			var arr = map.userSelectedAreaArr[i].squareArr;

			for (var j in arr) {
				var latLngArr = arr[j].getLatLngs(),
					wktPoly = {
						type: 'Feature',
						geometry: {
							type: 'Polygon',
							coordinates: [[]]
						}	
					};
				
				wktPolyArr.push(wktPoly);

				for (var k in latLngArr) {
					var ll = latLngArr[k];
					
					wktPoly.geometry.coordinates[0].push([ll.lng, ll.lat]);
				}
			}
		}
		
		for (var i in map.userSelectedCircleArr) {
			var arr = map.userSelectedCircleArr[i].squareArr;

			for (var j in arr) {
				var latLngArr = arr[j].getLatLngs(),
					wktPoly = {
						type: 'Feature',
						geometry: {
							type: 'Polygon',
							coordinates: [[]]
						}	
					};
				
				wktPolyArr.push(wktPoly);

				for (var k in latLngArr) {
					var ll = latLngArr[k];
					
					wktPoly.geometry.coordinates[0].push([ll.lng, ll.lat]);
				}
			}
		}
		
		for (var i in map.userSelectedClickArr) {
			var latLngArr = map.userSelectedClickArr[i].getLatLngs(),
				wktPoly = {
					type: 'Feature',
					geometry: {
						type: 'Polygon',
						coordinates: [[]]
					}	
				};
				
			wktPolyArr.push(wktPoly);
				
			for (var k in latLngArr) {
				var ll = latLngArr[k];
				
				wktPoly.geometry.coordinates[0].push([ll.lng, ll.lat]);
			}
		}
		
		if (! wktPolyArr.length) {
			return [];
		}
		
		var collection = {
			type: 'FeatureCollection',
			features: wktPolyArr
		};

		var center = turf.centroid(collection);

		return center;		
	}
	
	/*
     * 함수명 : fnGetBlockCdArrPrivate
     * 내용    : 시각화 적용버튼 클릭시 blockCdArr을 넘겨준다 set()으로 중복값 제거
     */
	function fnGetBlockCdArrPrivate() {
		var blockCdSet = new Set(),
			blockCdArr = [];
		
		for (var i in map.userSelectedClickArr) {
			var polygon = map.userSelectedClickArr[i],
				outputAreaSet = polygon.outputAreaSet;
				
			outputAreaSet.forEach(function(value) {
				blockCdSet.add(value);
			});
		}
		
		blockCdSet.forEach(function(value) {
			blockCdArr.push(value);
		});
		return blockCdArr;
	}
	

	/*
	 * 함수명 : fnDrawPointAddPrivate
	 * 내용    : 단일 선택 클릭시 다각형 선택 disable
	 */
	var fnDrawPointAddPrivate = function() {
		if (! map.drawingPolygon) {
			return;
		}
		if (! map.drawingCircle) {
			return;
		}
		map.drawingPolygon.disable();
		map.drawingCircle.disable();
	}
	
	
	/*
     * 함수명 : fnSelectNearArea
     * 내용    : 인근 버튼클릭시 (사용안함 )
     */
	function fnSelectNearArea($btn) {
		var self = this,
			blockIdArr = fnGetBlockIdArrPrivate();
		
		if ($btn.hasClass('btn-danger')) {
			
			if (self.debugCircle) {
				map.removeLayer(self.debugCircle);
				self.debugCircle = null;
			}
			
			if (self.debugAptMarkerArr) {
				for (var i in self.debugAptMarkerArr) {
					map.removeLayer(self.debugAptMarkerArr[i]);
				}
				
				self.debugAptMarkerArr = [];
			}
			
			$btn.removeClass('btn-danger').addClass('btn-outline-secondary');
			$btn.css({'color': '#707070', 'background-color': '#ffffff'});
			return;
		}
		
		if (! blockIdArr || ! blockIdArr.length) { 
			z.msgAlert({
				html: '블럭을 1개 이상 선택 해주세요',
				icon: 'error'
			});
			
			$btn.removeClass('btn-danger').addClass('btn-outline-secondary');
			$btn.css({'color': '#707070', 'background-color': '#ffffff'});
			return;
		}

		var isDebugDrawApt = true; // 아파트 위치 표시여부: 디버깅용

		if (! isDebugDrawApt) {
			return;
		}

		$btn.addClass('btn-danger').removeClass('btn-outline-secondary');
		$btn.css({'color': '#ffffff', 'background-color': '#333333'});
		
		var center = fnGetBlockIdArrCenterPrivate(),
			lat = center.geometry.coordinates[1],
			lng = center.geometry.coordinates[0],
			degreeToKm = 1 * 3.141592 / 180;
		
		self.debugCircle = L.circle(L.latLng(lat, lng), 1000).addTo(map);
		self.debugAptMarkerArr = [];
		
		self.debugCircle.setStyle({
			weight: 2,
			color : "#0100FF",
			opacity : 1,
			fillColor : "#0100FF",
			fillOpacity : 0.4 
		});
		
		var turfCircle = turf.circle([lng, lat], 1, {steps: 20, units: 'kilometers'});
		
		z.xAsync('BlockStat', '아파트리스트', 'select', {
			swLat: lat - degreeToKm,
			swLng: lng - degreeToKm,
			neLat: lat + degreeToKm,
			neLng: lng + degreeToKm
		}, 'json').done(function(resp) {
			var aptArr = resp;
			for (var j in aptArr) {

				var apt = aptArr[j],
					geoJson = Terraformer.WKT.parse('POINT(' + apt['x좌표'] + ' ' + apt['y좌표'] + ')'),
					coordArr = [],
					turfPoint = null;

				try {
					turfPoint = turf.point([apt['x좌표'], apt['y좌표']]);
				} catch (err) {
					console.log(err);
					continue;
				}
				
				var marker = null;
				
				if (turf.booleanPointInPolygon(turfPoint, turfCircle)) {					
					marker = L.marker(L.latLng(apt['y좌표'], apt['x좌표']), {
						icon: L.icon({
							iconUrl: '/resources/common/custom/images/pin/mpin_on.png',
							iconAnchor: [13,34],  // 오프셋 (핀의 끝이 좌표로 매칭하기 위해 적용)
						})
					});
					marker.addTo(map);

					self.debugAptMarkerArr.push(marker);
				}         		
			}
			
		});

	}
	
	/*
     * 함수명 : fnLoadFavoriteBlockArr
     * 내용    : 즐겨찾기 블럭 조회
     */
	var fnLoadFavoriteBlockArr = function() {
		var self = this,
			favorite = store.get('GIS_favorite') || {};

		// FIXME: 즐겨찾기 저장정보 1회용으로 사용할지 결정 필요		
		try {
			if (favorite['좌표x'] && favorite['좌표y']) {
				map.panTo(L.latLng(favorite['좌표y'], favorite['좌표x']));
			}
			
			var blockIdArr = (favorite['상세아이디'] || '').split(',');

			if (! blockIdArr || ! blockIdArr.length || ! blockIdArr[0]) {
				return;
			}
			
			$btnFavorite.attr('data-seq-favorite', favorite['순번']);
			$btnFavorite.removeClass('btn-outline-secondary').addClass('btn-danger');
		} catch (err) {
			console.error(err);
			return;
		}

		$.ajax({
			method: 'GET',
			url: '/api/gis/sqr100GridList',
			data: {
				blockIdArr: blockIdArr
			}
		}).done(function(resp) {

			var rectArr = resp.response,
				boundary = {
    				swLat: Number.MAX_VALUE,
    				swLng: Number.MAX_VALUE,
    				neLat: Number.MIN_VALUE,
    				neLng: Number.MIN_VALUE
				};

			for (var j in rectArr) {
		    	var rect = rectArr[j],
					geoJson = Terraformer.WKT.parse(rect.geom),
					coordArr = [];

				coordArr.push(geoJson.coordinates[0]);

				for (k in coordArr) {
					var coord = coordArr[k],
						latLngArr = [],
						latLngRawArr = [];

					for (var l in coord) {
						boundary.swLat = Math.min(coord[l][1], boundary.swLat);
						boundary.swLng = Math.min(coord[l][0], boundary.swLng);
						boundary.neLat = Math.max(coord[l][1], boundary.neLat);
						boundary.neLng = Math.max(coord[l][0], boundary.neLng);
						
						latLngArr.push(L.latLng(coord[l][1], coord[l][0]));
					}

		       		var polygon = L.polygon(latLngArr, {
						zIndexOffset: map.Z_INDEX_OFFSET_SQUARE,
						weight: 0,
						color: '#0100FF',
						opacity: 1,
						fillColor: blockColor,
						fillOpacity: 0.5
		       		});

					polygon.turfPolygon = turf.polygon(geoJson.coordinates);
					polygon.turfCenter = turf.centroid(polygon.turfPolygon);
					polygon.turfBBox = turf.bbox(polygon.turfPolygon); 
					polygon.blockId = rect.id;
					polygon.outputAreaArr = [];
					polygon.outputAreaSet = new Set();

	        		map.userSelectedClickArr.push(polygon);
					map.userSelectedClickMap[polygon.blockId] = polygon;
	        		map.squareLayer.addLayer(polygon);

					polygon.sido = rect['시도명'];
					polygon.sgg = rect['시군구명'];
					polygon.emd = rect['읍면동명'];

	        		polygon.on('mouseout', function(evt) {
						$wrapGisBlockDtl.hide();
						$body.css('overflow', '');
					}).on('mousemove', function(evt) {
						var target = evt.target,
							position = evt.containerPoint;
						
						if (! target.visTitle) {
							$wrapGisBlockDtl.hide();
							$body.css('overflow', '');
						} else {
							$wrapGisBlockDtl.show();
							$body.css('overflow', 'hidden');
							
							$wrapGisBlockDtl.css({
								left: position.x + 60,
								top: position.y + 30
							});
							
							$wrapGisBlockDtl.find('[data-block-id]').text(target.blockId);
							$wrapGisBlockDtl.find('[data-sido]').text(target.sido);
							$wrapGisBlockDtl.find('[data-sgg]').text(target.sgg);
							$wrapGisBlockDtl.find('[data-emd]').text(target.emd);
							$wrapGisBlockDtl.find('[data-vis-title]').text(target.visTitle);
							$wrapGisBlockDtl.find('[data-vis-content]').text(target.visContent);
						}
					});

				}
			}

			fnAttachOutputArea(boundary);
	
			fnUpdateSquareCnt();
	
		});
		
	};
	
	/*
     * 함수명 : fnUnlockFavoritePrivate
     * 내용    : 즐겨찾기 삭제 
     */
	var fnUnlockFavoritePrivate = function() {
		// FIXME: 즐겨찾기 관리기준 정리 필요
		store.remove('GIS_favorite');

		$btnFavorite.attr('data-seq-favorite', '');
		$btnFavorite.removeClass('btn-danger').addClass('btn-outline-secondary');
		apiBlockDtl.fnCloseDtl();
	};
	
	/*
     * 함수명 : fnUpdatePrevPositionPrivate
     * 내용    : 최동 이동지역 저장
     */
	var fnUpdatePrevPositionPrivate = function(map) {
		if (! map) {
			return;
		}
		
		var center = map.getCenter(),
			zoom = map.getZoom();
		
		store.set('GIS_position', {lat: center.lat, lng: center.lng, zoom: zoom});
	};
	
	/*
     * 함수명 : fnLoadBizdist
     * 내용    : 상권영역 표시
     */
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

				for (k in coordArr) {
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
	
	return {

		fnInitBlockMap: function(isPositionSelected, position) {
			var self = this,
				defaultCenter = [37.5118, 127.0592],	
				defaultZoom = 10,
				prevPosition = store.get('GIS_position');
			
			if(_isDemo) {
				prevPosition = null;
			}
				
			if (prevPosition) {
				try {
					defaultCenter = [prevPosition.lat, prevPosition.lng];
					defaultZoom = prevPosition.zoom;
				} catch (err) {
					prevPosition = null;
				}
			}
			
			if (! isPositionSelected) {
				if (! prevPosition) {
					if ('undefined' === (typeof navigator.geolocation)) {
						self.fnInitBlockMap(true, defaultCenter);
					} else {
						navigator.geolocation.getCurrentPosition(function(pos) {
							self.fnInitBlockMap(true, [pos.coords.latitude, pos.coords.longitude]);
						}, function(err) {
							self.fnInitBlockMap(true, defaultCenter);
						});
					}
				} else {
					self.fnInitBlockMap(true, defaultCenter);
				}

				return;
			}
			
			// FIXME: 번역 수정
			L.drawLocal.draw.handlers.polygon.tooltip.start = '원하시는 지점 클릭 시 영역 선택이 시작됩니다';
			L.drawLocal.draw.handlers.polygon.tooltip.cont = '다른 지점 클릭 시 도형이 그려집니다';
			L.drawLocal.draw.handlers.polygon.tooltip.end = '첫번째 지점 클릭 시 완료됩니다';
			L.drawLocal.draw.handlers.polyline.error = '동일한 선분은 포함될 수 없습니다';
			L.drawLocal.draw.handlers.circle.tooltip.start = '원하시는 지점 클릭후 마우스 드래그로 거리를 지정해주세요.(최대반경 2km)';
			L.drawLocal.draw.handlers.circle.distanceLimit = 2000;  /* 거리제한 3000 으로 설정추가 */
			L.drawLocal.draw.handlers.circle.radius = '반경';
		    map = L.map('map', {
		        continuousWorld : true,
		    	attributionControl: false,
		        zoomControl : false,
		        zoomAnimation : true,
		        fadeAnimation : false,
		        inertia : false,
		        center: position,  // 지도 초기 위치
		        zoom: defaultZoom // 지도 초기 줌 레벨
		    });
		    BaseMapChange(map, L.Dawul.BASEMAP_GEN);  //베이스맵 일반지도 호출

		    apiAddr.fnSetMap(map);
			apiAddr.fnGps(L.latLng(position[0], position[1]), map.getBounds());
			
		    //스케일바
		    var scaleBar = new L.Control.Scale({
		        position : 'bottomright'
		    });
		    map.addControl(scaleBar);

			// z-index 정렬
			map.Z_INDEX_OFFSET_LINE = 10;
			map.Z_INDEX_OFFSET_SQUARE= 20;
			map.Z_INDEX_OFFSET_AREA = 30;
			
			map.lineLayer = L.layerGroup(); 
			map.bizdistLayer = L.layerGroup();
			map.squareLayer = L.layerGroup();
			map.areaLayer = L.layerGroup();
			map.outputAreaLayer = L.layerGroup();
			
			map.addLayer(map.lineLayer);
			map.addLayer(map.bizdistLayer);
			map.addLayer(map.squareLayer);
			map.addLayer(map.areaLayer);
			map.addLayer(map.outputAreaLayer);
			
			map.outputAreaLayer.setZIndex(500 + map.Z_INDEX_LINE);
			map.lineLayer.setZIndex(500 + map.Z_INDEX_OFFSET_LINE);
			map.bizdistLayer.setZIndex(500 + map.Z_INDEX_OFFSET_LINE);
			map.squareLayer.setZIndex(500 + map.Z_INDEX_OFFSET_SQUARE);
			map.areaLayer.setZIndex(500 + map.Z_INDEX_OFFSET_AREA);

			
			map.MAX_SELECTED = 1500;
			map.MIN_GRID_ZOOM = 9;
//			map.MIN_GRID_ZOOM = 6;
		    map.lastBlockCenter = L.latLng(0, 0);
			map.cntClicking = 0;
		    
		    map.userSelectedAreaArr = [];
		    map.userSelectedCircleArr = [];
		    map.userSelectedClickArr = [];
			map.userSelectedClickMap = {};

			map.blockCdArr = [];
	
			window.dist = new L.Control.Measure({mode:"dist"});
			window.area = new L.Control.Measure({mode:"area"});
			map.addLayer(window.dist);
			map.addLayer(window.area);

			// 즐겨찾기 로딩
			fnLoadFavoriteBlockArr();
			
			map.bizdistArr = [];
			// 상권정보 로딩
			fnLoadBizdist();

		    /*
		     * 함수명 : map.repaintMapSquare2
		     * 내용    : lineLayer 에  polyline (격자그리기) 
		     */
		    map.repaintMapSquare2 = function(resp) {
		    	if (200 !== resp.code || ! resp.response) {
		    		return;
		    	}

		    	var arr = resp.response;

		    	for (var i in arr) {
		    		var pointKTM = arr[i],
		    			point = null,
						geoJson = Terraformer.WKT.parse(pointKTM.geom),
						coordArr = [];

					coordArr.push(geoJson.coordinates[0]);
	
					for (k in coordArr) {
						var coord = coordArr[k],
							latLngArr = [],
							latLngRawArr = [];

						for (var l in coord) {
							latLngArr.push(L.latLng(coord[l][1], coord[l][0]));
						}

			       		var polygon = L.polyline(latLngArr, {
							zIndexOffset: map.Z_INDEX_OFFSET_LINE,
							clickable: false,
			       			weight: 0.3,
			       			//color: '#0100FF',
			       			color: '#0A6A70',
			       			opacity: 1,
	//		       			fillColor: '#01FF00',
	//		       			fillOpacity: 0.5
			       		});

						polygon.wkt = pointKTM;
						
			       		map.sqr100Arr.push(polygon);
			       		
			       		map.lineLayer.addLayer(polygon);
					}
		    	}
		    };

		    /*
		     * 함수명 : map.loadServerGrid
		     * 내용    : 격자 관련 DB 정보 가져오기
		     */
		    map.loadServerGrid = function(option) {
				option = option || {
					isMove: false
				};
				
				option.isShowGrid = map.isShowGrid;
		    	
		    	if (option.isMove) {
			    	var distance = map.lastBlockCenter.distanceTo(map.getCenter());
			
			    	// FIXME: 어느정도 거리가 최적화일지 판단 필요
			    	if (100 > distance) {
			    		return;
			    	}

					apiAddr.fnGps(map.getCenter(), map.getBounds());			    	
		    	}

//		     	if (! map.isStop) {
//		     		map.isStop = true;
//		     	} else {
//		     		return;
//		     	}

		   		for (var i in map.sqr100Arr) {
		   			map.lineLayer.removeLayer(map.sqr100Arr[i]);
		   		}

		    	map.sqr100Arr = [];
		    	map.lastBlockCenter = map.getCenter();

		    	if (! option.isShowGrid || map.MIN_GRID_ZOOM > map.getZoom()) {
		    		return;
		    	}
		    	
				// 바운드가 실제 화면보다 약간 넓어서 범위 보정함: 실험 후 연립방정식 풀음
				// 10 -0.00625 // 9 -0.0125 // 8 -0.025
				// 10 -0.003 // 9 -0.009 // 8 -0.015
		    	var bound = map.getBounds(),
		    		data = {
						'neLat': bound._northEast.lat,
						'neLng': bound._northEast.lng,
						'swLat': bound._southWest.lat,
						'swLng': bound._southWest.lng
			    	},
			    	deltaX = 0.00625 * map.getZoom() - 0.06825,
			    	deltaY = 0.006 * map.getZoom() - 0.063;
//			    	deltaX = -0.0125,
//			    	deltaY = -0.009;
//			    	deltaX = 0,
//			    	deltaY = 0;
//			    	deltaX = (data.neLng - data.swLng) / 4,
//			    	deltaY = (data.neLat - data.swLat) / 4;

		    	data.neLng += deltaX;
		    	data.swLng -= deltaX;
		    	data.neLat += deltaY;
		    	data.swLat -= deltaY;
		    	
		    	map.boundExtend = data;

				if (self.dfrGridAjax) {
					self.dfrGridAjax.abort();
				}

				if (! $('#btnBlock').hasClass('spinner')) {
				    KTUtil.btnWait(KTUtil.getById("btnBlock"), "spinner spinner-left spinner-dark pl-15", "Please wait");
				    KTUtil.btnWait(KTUtil.getById("btnNonBlock"), "spinner spinner-left spinner-dark pl-15", "Please wait");
				}
//			    console.log('startTime: ' + moment().format('mm:ss.SSS'));

		    	self.dfrGridAjax = $.ajax({
		    		url: '/api/gis/sqr100List',
		    		method: 'GET',
		    		data: data
				}).always(function() {
					self.dfrGridAjax = null;
					if ($('#btnBlock').hasClass('spinner')) {
						KTUtil.btnRelease(KTUtil.getById("btnBlock"));
						KTUtil.btnRelease(KTUtil.getById("btnNonBlock"));
						fnUpdateSquareCnt();
					}
				}).done(function(resp) {
//				    console.log('dataTime: ' + moment().format('mm:ss.SSS'));
		    		map.repaintMapSquare2(resp); 
//				    console.log('endTime: ' + moment().format('mm:ss.SSS'));
		    	});

		    };

		    /*
		     * 함수명 : map.checkIsAbleToDraw
		     * 내용    : 다각형 그리기 가능 zoom level 확인
		     */
			map.checkIsAbleToDraw = function(isAlwaysShowMsg) {
				var zoom = map.getZoom();
				
				if (map.MIN_GRID_ZOOM > zoom) {
					if (isAlwaysShowMsg) {
						if (map.drawingPolygon) {
							z.msgAlert({
								html: '다각형 선택은 축적 ' + map.MIN_GRID_ZOOM + ' 까지 가능합니다',
								icon: 'error'
							});
						} 
						
						if (map.drawingCircle) {
							z.msgAlert({
								html: '반경 선택은 축적 ' + map.MIN_GRID_ZOOM + ' 까지 가능합니다',
								icon: 'error'
							});
						}
					}
					
					if (map.drawingPolygon) {
						fnDrawPointAddPrivate();
						
						z.msgAlert({
							html: '다각형 선택은 축적 ' + map.MIN_GRID_ZOOM + ' 까지 가능합니다',
							icon: 'error'
						});
					}
					
					if (map.drawingCircle) {
						fnDrawPointAddPrivate();
						
						z.msgAlert({
							html: '반경 선택은 축적 ' + map.MIN_GRID_ZOOM + ' 까지 가능합니다',
							icon: 'error'
						});
					}
					return false;
				}
				return true;
			};

			var fnUpdatePrevPosition = fnUpdatePrevPositionPrivate;
		    
		    map.addEventListener('moveend', function(evt) {
				fnUpdatePrevPosition(map);
		    	map.loadServerGrid({isMove: true});
		    });
		    
		    map.addEventListener('zoomend', function(evt) {
				fnUpdatePrevPosition(map);
				// XXX: 임시 - 지도 축적 표시
				$('.tool-group [data-gis-zoom]').text(map.getZoom());
		    	map.loadServerGrid();

				map.checkIsAbleToDraw();
		    });

			$('.tool-group [data-gis-zoom]').text(map.getZoom());


		    /*
		     * 지도클릭시
		     */
		    map.addEventListener('click', function(evt) {
		    	if (map.isDrawing || map.cntClicking || window.dist._measuring) {
		    		return;
		    	}
				// 변동사항이 발생하므로 이전 즐겨찾기 해제
				fnUnlockFavoritePrivate();
		    	// 이미 선택된 영역인지 확인
		    	var selectedIdx = fnIsSelectedSquare(evt.latlng);
		    	
		    	if (-1 < selectedIdx.idx) {
		    		if (-1 === selectedIdx.polygon) {
		    			var layer = map.userSelectedClickArr[selectedIdx.idx];
				 		
			    		map.removeLayer(layer);
			    		map.userSelectedClickArr.splice(selectedIdx.idx, 1);
						map.userSelectedClickMap[layer.blockId] = null;
						
						$wrapGisBlockDtl.hide();
						$body.css('overflow', '');
						
						fnUpdateSquareCnt();
		    		}
		    	} else {
			    	if (! (map.MAX_SELECTED > fnUpdateSquareCnt())) {
						z.msgAlert({
							html: '최대 ' + z.toComma(map.MAX_SELECTED) + '개 까지 선택 가능합니다',
							icon: 'error'
						});
						return;
		    		}
			    	
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
						polygonBizdist = null;

					// 상권 조회
					if ((evt.originalEvent.ctrlKey || evt.originalEvent.metaKey)
						&& map.bizdistLayer.getLayers().length) {
						
						var turfPoint = turf.point([latLng.lng, latLng.lat]);
						
						// 일치하는 상권이 있으면 바운더리 수정, 없으면 클릭과 똑같이 동작
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
								bound = {
									neLat: turfBBox[3] + 0.003,
									neLng: turfBBox[2] + 0.005,
									swLat: turfBBox[1] - 0.003,
									swLng: turfBBox[0] - 0.005
								};

								turfBizdist = turfPolygon;
								polygonBizdist = polygonBizdistI;
								break;
							}
						}
					}
					
					map.cntClicking++;
					
					if (! polygonBizdist) {
					
						var dfrSqr = $.Deferred();
						
						// 격자선이 있는 경우 + 바로 찾을 수 있으면 표시
						if (map.isShowGrid && map.sqr100Arr) {
							for (var i in map.sqr100Arr) {
								var sqr = map.sqr100Arr[i];
								
								if (sqr.getBounds().contains(latLng)) {
									dfrSqr.resolve({
										code: 200,
										response: sqr.wkt
									});
									break;
								}
							}
						}
						
						if ('resolved' !== dfrSqr.state()) {
							dfrSqr = $.ajax({
				        		url: '/api/gis/sqr100GridDetail',
				        		method: 'GET',
				        		data: bound
							});
						}
						
			        	dfrSqr.always(function() {
							map.cntClicking--;
			        	}).done(function(resp) {
			        		if (200 !== resp.code) {
			        			return;
			        		}
	
					    	var rect = resp.response,
								geoJson = Terraformer.WKT.parse(rect.geom),
								coordArr = [],
								boundary = {
				    				swLat: Number.MAX_VALUE,
				    				swLng: Number.MAX_VALUE,
				    				neLat: Number.MIN_VALUE,
				    				neLng: Number.MIN_VALUE
								};
			
							coordArr.push(geoJson.coordinates[0]);
			
							for (k in coordArr) {
								var coord = coordArr[k],
									latLngArr = [],
									latLngRawArr = [];
		
								for (var l in coord) {
									boundary.swLat = Math.min(coord[l][1], boundary.swLat);
									boundary.swLng = Math.min(coord[l][0], boundary.swLng);
									boundary.neLat = Math.max(coord[l][1], boundary.neLat);
									boundary.neLng = Math.max(coord[l][0], boundary.neLng);
									
									latLngArr.push(L.latLng(coord[l][1], coord[l][0]));
								}
		
					       		var polygon = L.polygon(latLngArr, {
									zIndexOffset: map.Z_INDEX_OFFSET_SQUARE,
									weight: 0,
									color: '#0100FF',
									opacity: 1,
									fillColor: blockColor,
									fillOpacity: 0.5
					       		});
	
								polygon.turfPolygon = turf.polygon(geoJson.coordinates);
								polygon.turfCenter = turf.centroid(polygon.turfPolygon);
								polygon.turfBBox = turf.bbox(polygon.turfPolygon);
								polygon.blockId = rect.id;
								polygon.outputAreaArr = [];
								polygon.outputAreaSet = new Set();
						
				        		map.userSelectedClickArr.push(polygon);
								map.userSelectedClickMap[polygon.blockId] = polygon;
	
				        		map.squareLayer.addLayer(polygon);

								polygon.sido = rect['시도명'];
								polygon.sgg = rect['시군구명'];
								polygon.emd = rect['읍면동명'];
		
				        		polygon.on('mouseout', function(evt) {
									$wrapGisBlockDtl.hide();
									$body.css('overflow', '');
								}).on('mousemove', function(evt) {
									var target = evt.target,
										position = evt.containerPoint;
									
									if (! target.visTitle) {
										$wrapGisBlockDtl.hide();
										$body.css('overflow', '');
									} else {
										$wrapGisBlockDtl.show();
										$body.css('overflow', 'hidden');
										
										$wrapGisBlockDtl.css({
											left: position.x + 60,
											top: position.y + 30
										});
										
										$wrapGisBlockDtl.find('[data-block-id]').text(target.blockId);
										$wrapGisBlockDtl.find('[data-sido]').text(target.sido);
										$wrapGisBlockDtl.find('[data-sgg]').text(target.sgg);
										$wrapGisBlockDtl.find('[data-emd]').text(target.emd);
										$wrapGisBlockDtl.find('[data-vis-title]').text(target.visTitle);
										$wrapGisBlockDtl.find('[data-vis-content]').text(target.visContent);
									}
								});
				        		
							}
							
							fnAttachOutputArea(boundary);
								
			        		fnUpdateSquareCnt();
			        	});

					} else {
						// 선택된 상권 색상 변경
						polygonBizdist.setStyle({fillColor: '#BBFF33'});
							
			        	$.ajax({
			        		url: '/api/gis/sqr100GridList',
			        		method: 'GET',
			        		data: bound
						}).always(function() {
							map.cntClicking--;
			        	}).done(function(resp) {
			        		if (200 !== resp.code) {
			        			return;
			        		}
	
					    	var rectArr = resp.response,
								boundaryObj = {
				    				swLat: 1000,
				    				swLng: 1000,
				    				neLat: -1000,
				    				neLng: -1000
								},
								turfBizdistArr = turf.unkinkPolygon(turfBizdist);
								
							for (var mm in rectArr) {
								var rect = rectArr[mm],
									geoJson = Terraformer.WKT.parse(rect.geom),
									coordArr = [],
									latLngArr = [],
									latLngRawArr = [];
				
								coordArr.push(geoJson.coordinates[0]);
				
								for (k in coordArr) {
									var coord = coordArr[k];
				
									for (var l in coord) {
										latLngArr.push(L.latLng(coord[l][1], coord[l][0]));
									}
								}

								for (var k in latLngArr) {
									latLngRawArr.push([latLngArr[k].lng, latLngArr[k].lat]);
								}										
									
								var bounds = turf.polygon([latLngRawArr]);

								for (var k in turfBizdistArr.features) {
									if (turf.intersect(turfBizdistArr.features[k], bounds)) {

										for (var kk in bounds.geometry.coordinates[0]) {
											var point = bounds.geometry.coordinates[0][kk];
				
											boundaryObj.swLat = Math.min(point[1], boundaryObj.swLat);
											boundaryObj.swLng = Math.min(point[0], boundaryObj.swLng);
											boundaryObj.neLat = Math.max(point[1], boundaryObj.neLat);
											boundaryObj.neLng = Math.max(point[0], boundaryObj.neLng);
										}
										
										// 이미 선택되어 있다면 제외
										var isExist = false, overlap = null, turfCenter = turf.centroid(bounds);
										for (var l in map.userSelectedClickArr) {
											var turfTest = map.userSelectedClickArr[l].turfPolygon,
												turfCenterTest = map.userSelectedClickArr[l].turfCenter;
												
											if (turfCenterTest && 0.4 < turf.distance(turfCenter, turfCenterTest)) {
												continue;
											}
				
											// 거리를 재봐서 400m 초과하면 제외
											// 400m 이내이면 겹치는 부분 확인
											// 인접한 경우 점 또는 선이 겹쳐서 영역이 0 이지만, 혹시 모를 오차에 대비해 200 정도 여유 판정
											// 200x200 블럭의 넓이 계산 해보면 대략 4만으로 확인됨
											if (turfTest && (overlap = turf.intersect(turfTest, bounds))
													&& 200 < turf.area(overlap)) {
												isExist = true;
												break;
											}
										}
										
										if (isExist) {
											break;
										}
				
							       		var polygon = L.polygon(latLngArr, {
											zIndexOffset: map.Z_INDEX_OFFSET_SQUARE,
											weight: 0,
											color: '#0100FF',
											opacity: 1,
											fillColor: blockColor,
											fillOpacity: 0.5
							       		});
			
										polygon.turfPolygon = turf.polygon(geoJson.coordinates);
										polygon.turfCenter = turf.centroid(polygon.turfPolygon);
										polygon.turfBBox = turf.bbox(polygon.turfPolygon);
										polygon.blockId = rect.id;
										polygon.outputAreaArr = [];
										polygon.outputAreaSet = new Set();
								
						        		map.userSelectedClickArr.push(polygon);
										map.userSelectedClickMap[polygon.blockId] = polygon;
			
						        		map.squareLayer.addLayer(polygon);
						        		
										polygon.sido = rect['시도명'];
										polygon.sgg = rect['시군구명'];
										polygon.emd = rect['읍면동명'];
				
						        		polygon.on('mouseout', function(evt) {
											$wrapGisBlockDtl.hide();
											$body.css('overflow', '');
										}).on('mousemove', function(evt) {
											var target = evt.target,
												position = evt.containerPoint;
											
											if (! target.visTitle) {
												$wrapGisBlockDtl.hide();
												$body.css('overflow', '');
											} else {
												$wrapGisBlockDtl.show();
												$body.css('overflow', 'hidden');
												
												$wrapGisBlockDtl.css({
													left: position.x + 60,
													top: position.y + 30
												});
												
												$wrapGisBlockDtl.find('[data-block-id]').text(target.blockId);
												$wrapGisBlockDtl.find('[data-sido]').text(target.sido);
												$wrapGisBlockDtl.find('[data-sgg]').text(target.sgg);
												$wrapGisBlockDtl.find('[data-emd]').text(target.emd);
												$wrapGisBlockDtl.find('[data-vis-title]').text(target.visTitle);
												$wrapGisBlockDtl.find('[data-vis-content]').text(target.visContent);
											}
										});
						        		
										break;
									}
								}
							}
	
							fnAttachOutputArea(boundaryObj);
	
			        		fnUpdateSquareCnt();
			        	});
			    	}
				}
		    });
		    
		    /*
		     * 이벤트명 : draw:created
		     * 내용	 : 도형이 생성될때 (폴리곤일때 마지막점 연결시)
		     */
		    map.addEventListener('draw:created', function (evt) {
		    	var type = evt.layerType;
				var layer = evt.layer;
				map.isDrawing = false;
				switch (type) {
					case 'polygon':
						map.drawingPolygon = null;
//						map.userSelectedAreaArr.push(layer);
						map.areaLayer.addLayer(layer);
						layer.setStyle({
							zIndexOffset: map.Z_INDEX_OFFSET_AREA,
							weight: 3,
							color : '#FF00DD',
							opacity : 1,
							fillColor : '#FF00DD',
							fillOpacity : 0.2
						});
						
						layer.squareArr = [];
						
						// 변동사항이 발생하므로 이전 즐겨찾기 해제
						fnUnlockFavoritePrivate();
				
						fnCheckSquare(layer);
						break;
					case 'circle':
						map.drawingCircle = null;
						map.areaLayer.addLayer(layer);
						layer.setStyle({
							zIndexOffset: map.Z_INDEX_OFFSET_AREA,
							weight: 3,
							color : '#FF00DD',
							opacity : 1,
							fillColor : '#FF00DD',
							fillOpacity : 0.2
						});
						
						layer.squareArr = [];
						
						// 변동사항이 발생하므로 이전 즐겨찾기 해제
						fnUnlockFavoritePrivate();
						fnCheckSquareCircle(layer);
						break;
				}
		    });

			map.addEventListener('draw:drawstart', function(evt) {
				if(evt.layerType == "polygon"){
					$('.block-layer [data-btn-select-block=polygon]').hide();
					$('.block-layer [data-btn-select-block=undo]').show();
				}
			});

		    map.addEventListener('draw:drawstop', function (evt) {
				map.isDrawing = false; 
				if(evt.layerType == "circle"){
					map.drawingCircle = null;
					$('.block-layer [data-btn-select-block=circle]').removeClass('on');
					$('.block-layer [data-btn-select-block=point]').addClass('on');
				} else if(evt.layerType == "polygon"){
					map.drawingPolygon = null;
					$('.block-layer [data-btn-select-block=polygon]').show();
					$('.block-layer [data-btn-select-block=undo]').hide();
					$('.block-layer [data-btn-select-block=point]').addClass('on');
				}	
			});

		    map.loadServerGrid({isMove: true});
		     
		    /*
		     * 함수명 : map.repaintMap (사용안함)
		     * 내용    : polyline 으로 격자그리기!
		     */
		    map.repaintMap = function(resp) {
		    	if (200 !== resp.code || ! resp.response) {
		    		return;
		    	}

		    	var arr = resp.response,
					pointKTMCenter = Coord_Trans('wgstoktm', new PT(map.getCenter().lng, map.getCenter().lat));

		    	for (var i in arr) {
		    		var pointKTM = arr[i],
		    			point = null,
		    			boundExtend = map.boundExtend,
		    			latLngArr = [];

		    		if (! pointKTM.top) {
		    			// 세로줄
		    			point = Coord_Trans('ktmtowgs', new PT(pointKTM.left, pointKTMCenter.y)),
		        		latLngArr.push(L.latLng(boundExtend.neLat, point.x));
		        		latLngArr.push(L.latLng(boundExtend.swLat, point.x));
		    		} else {
		    			// 가로줄
		    			point = Coord_Trans('ktmtowgs', new PT(pointKTMCenter.x, pointKTM.top)),
		        		latLngArr.push(L.latLng(point.y, boundExtend.neLng));
		        		latLngArr.push(L.latLng(point.y, boundExtend.swLng));
		    		}

		       		var polygon = L.polyline(latLngArr, {
						zIndexOffset: map.Z_INDEX_OFFSET_LINE,
						clickable: false,
		       			weight: 0.2,
		       			color: '#0100FF',
		       			opacity: 1,
		       			fillColor: '#01FF00',
		       			fillOpacity: 0.5
		       		});
		       		
		       		map.sqr100Arr.push(polygon);

		       		map.lineLayer.addLayer(polygon);
		    	}
		    };

		    /*
		     * 함수명 : map.repaintMapSquare (사용안함)
		     * 내용    : 다올지도 제공 좌표변환 사용 - 약간의 오차때문에 변경
		     */
		    map.repaintMapSquare = function(resp) {
		    	if (200 !== resp.code || ! resp.response) {
		    		return;
		    	}

		    	var arr = resp.response,
					pointKTMCenter = Coord_Trans('wgstoktm', new PT(map.getCenter().lng, map.getCenter().lat));

		    	for (var i in arr) {
		    		var pointKTM = arr[i],
		    			point = null,
		    			boundExtend = map.boundExtend,
		    			latLngArr = [],
						ktmArr = [
							[pointKTM.left, pointKTM.bottom],
							[pointKTM.left, pointKTM.top],
							[pointKTM.right, pointKTM.top],
							[pointKTM.right, pointKTM.bottom],
							[pointKTM.left, pointKTM.bottom]
						];

					for (var p in ktmArr) {
		    			point = Coord_Trans('ktmtowgs', new PT(ktmArr[p][0], ktmArr[p][1]));
	
		        		latLngArr.push(L.latLng(point.y, point.x));
					}

		       		var polygon = L.polyline(latLngArr, {
						zIndexOffset: map.Z_INDEX_OFFSET_LINE,
						clickable: false,
		       			weight: 0.2,
		       			color: '#0100FF',
		       			opacity: 1,
//		       			fillColor: '#01FF00',
//		       			fillOpacity: 0.5
		       		});
		       		
		       		map.sqr100Arr.push(polygon);

		       		map.lineLayer.addLayer(polygon);
		    	}
		    };
		}, //init
		
		fnDrawPointAdd: function() {
			if(map.drawingPolygon != undefined){
				map.drawingPolygon.disable();
			}
			if(map.drawingCircle != undefined){
				map.drawingCircle.disable();
			}
			fnDrawPointAddPrivate();
		},
		
		fnDrawCircleAdd: function() {
			if (! map.checkIsAbleToDraw(true)) {
				return;
			}
			if(map.drawingPolygon != undefined){
				map.drawingPolygon.disable();
			}	
			map.isDrawing = true;
			map.drawingCircle = new L.Draw.Circle(map, {});
			map.drawingCircle.enable();
			map.drawingCircle._endLabelText = "반경 그리기를 마치려면 마우스를 놓습니다."
			//인근버튼 스크립트
			//fnDrawCircleAddPrivate();
		},
		
		fnDrawPolygonAdd: function() {
			if (! map.checkIsAbleToDraw(true)) {
				return;
			}
			map.isDrawing = true;
			if(map.drawingCircle != undefined){
				map.drawingCircle.disable();
			}
			map.drawingPolygon = new L.Draw.Polygon(map, {});
			map.drawingPolygon.enable();
		},
		
		fnDrawPolygonUndo: function() {
			if (! map.drawingPolygon) {
				return;
			}

			map.drawingPolygon.deleteLastVertex();
			
			if (2 > map.drawingPolygon._markers.length) {
				map.drawingPolygon.disable();
			}
		},

		fnGetBlockIdArr: function() {
			return fnGetBlockIdArrPrivate();
		},
		
		fnGetBlockIdArrBounds: function() {
			return fnGetBlockIdArrBoundsPrivate();
		},
		
		fnGetBlockIdArrCenter: function() {
			return fnGetBlockIdArrCenterPrivate();
		},
		
		fnGetBlockCdArr: function() {	
			return fnGetBlockCdArrPrivate();
		},
		
		fnSelectGisStat: function($btn) {
			fnSelectGisStat($btn);
		},

		fnSelectNearArea: function($btn) {	//인근 표시/표시해제
			fnSelectNearArea($btn);
		},
				
		fnToggleGridLine: function($btn) {	//격자선 표시/표시해제 
			if (map.isShowGrid) {
				map.isShowGrid = false;
				$btn.removeClass('btn-danger').addClass('btn-outline-secondary');
				$btn.css({'color': '#707070', 'background-color': '#ffffff'});
				localStorage.setItem('GIS_GRID_HIDE', 'Y');
			} else {
				map.isShowGrid = true;
				$btn.addClass('btn-danger').removeClass('btn-outline-secondary');
				$btn.css({'color': '#ffffff', 'background-color': '#333333'});
				localStorage.removeItem('GIS_GRID_HIDE');
			}
			
			map.loadServerGrid();
		},
		
		fnToggleBizdist: function($btn, isOn) {	// 상권 표시/표시해제
			
			if (! map.bizdistArr.length) {
				return;
			}
			
			if (map.bizdistLayer.getLayers().length && !isOn) {
				map.bizdistLayer.clearLayers();
				
				$btn.css({'color': '#707070', 'background-color': '#ffffff'})
			} else {
				
				if (! map.bizdistLayer.getLayers().length) {
					for (var i in map.bizdistArr) {
						map.bizdistLayer.addLayer(map.bizdistArr[i]);
					}
				}

				$btn.css({'color': '#ffffff', 'background-color': '#333333'})
			}
		},
		
		fnGetCommCode: function() {
			return dfrCommCode;
		},
		
		//영역삭제 (사용안함)
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
				
				while (map.userSelectedCircleArr.length > 0) {
					polygon = map.userSelectedCircleArr[map.userSelectedCircleArr.length - 1];
					
					for (var i in polygon.squareArr) {
						map.squareLayer.removeLayer(polygon.squareArr[i]);
					}
					
					map.areaLayer.removeLayer(polygon);
					map.userSelectedCircleArr.pop();
				}
				
				while (map.userSelectedClickArr.length > 0) {
					polygon = map.userSelectedClickArr[map.userSelectedClickArr.length - 1];
					
					map.squareLayer.removeLayer(polygon);
					map.userSelectedClickArr.pop();
				}
				
				map.userSelectedClickMap = {};
				
				//집계구
				map.outputAreaLayer.clearLayers();

				fnUnlockFavoritePrivate();
				map.blockCdArr = [];
				
				$('.block-layer .density').hide();
			} else {
				map.areaLayer.removeLayer(polygon);
				map.userSelectedAreaArr.splice(map.userSelectedAreaArr.indexOf(polygon), 1);
				
				for (var i in polygon.squareArr) {
					map.squareLayer.removeLayer(polygon.squareArr[i]);
				}
			}
			
			// 선택됐던 상권 색상도 원복... 느리다 싶으면 최적화 필요
			var bizdistArr = map.bizdistLayer.getLayers(); 
			for (var i in bizdistArr) {
				bizdistArr[i].setStyle({fillColor: '#FFD400'});
			}

			fnUpdateSquareCnt();
		}
	};

})();


$(function() {

	$('#kt_content').addClass('p-0');
	
	// 지도API
	$.when(
		//$.getScript("https://rmap.r114.com:8000/MapAppServer/DWService?req={'header':{'format':'JSON','serviceName':'SDK_REQ','key':'14cc08123cd6d425d603917caf3ee061895e4192'},'body':{'sdkType':'AJAX','version':'2.0'}}"),
		$.getScript("/api/gis/js/dawulMap.do"),	
		$.getScript("https://cdnjs.cloudflare.com/ajax/libs/terraformer/1.0.12/terraformer.min.js")
	).always(function() {
		$.when(
			$.getScript("/resources/common/core/3rd_extends/leaflet.draw/leaflet.draw-src.js"),
			$.getScript("https://cdn.jsdelivr.net/npm/terraformer-wkt-parser@1.2.1/terraformer-wkt-parser.min.js"),
			$.getScript("https://cdnjs.cloudflare.com/ajax/libs/Turf.js/5.1.6/turf.min.js"),
//			$.getScript("/resources/common/custom/js/pages/gis/blockcharts.js"),
			$.getScript("/resources/admin/APPS/gis/apiAddress.js"),
			$.getScript("/resources/admin/APPS/gis/apiBlockDtl.js"),
			$.getScript("/resources/admin/APPS/gis/apiBlockVis.js"),
			$.getScript("/resources/common/custom/js/tooltipLayout.js"),
			$.getScript("/resources/common/custom/js/language_change.js"),
			$.getScript("/resources/common/custom/js/dawul_url-src.js"),
			$.getScript("/resources/common/custom/js/json_datas.js"),
			$.getScript("/resources/common/custom/js/common.js"),
			$.getScript("/resources/common/custom/js/grid.js")
		).always(function() {
			blockMap.fnInitBlockMap();
			apiBlockDtl.fnInitDtl();
			apiBlockVis.fnInitVis();
			apiAddr.fnInit(map);
			
			z.xAsync('AdminMain', 'getExcelDown', 'select', {pgmCode:"MA04"}, 'json').done(function(resp) {
				if(resp[0].excelyn == "N"){
					$("[data-btn-export]").css("display", "none");
				} else {
					$("[data-btn-export]").css("display", "block");
				}
			}); 
			
			// if (localStorage.getItem('GIS_GRID_HIDE')) {
			// 	blockMap.fnToggleGridLine($('#kt_content [data-btn-toggle-grid]'));
			// }

		    // 21.01.04 편의시설 추가 
			ncodeList(1);
			ncodeList2(1);
		
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
		            var plant_sub_depth_position = $(this).closest('ul').index();
		            if(plant_sub_depth_position==0){
		               $('#plant_sub_depth_box').css('right','0') 
		               $('#plant_sub_depth_box').css('left','auto') 
		            }else{
		                $('#plant_sub_depth_box').css('left','0') 
		                $('#plant_sub_depth_box').css('right','auto') 
		                
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

			$("#m_nearby2_sub1_1 li").click(function() {
				ncodeIndex = $(this).index();
				ncodeClickSubDepth(ncodeIndex);
			});
			
			$("#m_nearby2_sub1_2 li").click(function() {
				ncodeIndex = $(this).index();
				ncodeClickSubDepth2(ncodeIndex);
			});

			KTUtil.scrollInit($('#m_nearby2_sub2_form')[0], {
				mobileNativeScroll: true,
				handleWindowResize: true
			});
			KTUtil.scrollInit($('#m_nearby2_sub3_form')[0], {
				mobileNativeScroll: true,
				handleWindowResize: true
			});
		});
	});

	// 선택된블럭이 없습니다. 선택한 상권의 블럭보기 버튼클릭시 
	$('#btnBlock,#btnNonBlock').click(function(){
		if(_isDemo) {
			if($("#btnSearchAddr span[data-addr-sido]").html() != _DemoSidonm || $("#btnSearchAddr span[data-addr-sgg]").html() != _DemoSggnm) {
				z.msg(_DemoMsgBlockX);
				return;
			}
		}
		
		var blockIdArr = blockMap.fnGetBlockIdArr(),
			blockBounds = blockMap.fnGetBlockIdArrBounds(),
			blockCdArr = blockMap.fnGetBlockCdArr(),
			blockCenter = blockMap.fnGetBlockIdArrCenter();

		apiBlockDtl.fnOpenDtl(blockIdArr, blockBounds, blockCdArr, blockCenter);
	});
	$('#mapBlockClose').click(function(){
		apiBlockDtl.fnCloseDtl();
	});
	
	$('#mapBlockPanel [data-btn-export]').click(function() {
		apiBlockDtl.fnExport($(this).attr('data-btn-export'));
	});
	
	$('#kt_content .btn-zoom-in').click(function() {
		map.setZoom(map.getZoom() + 1);
	});
	
	$('#kt_content .btn-zoom-out').click(function() {
		map.setZoom(map.getZoom() - 1);
	});

	$('#kt_content .btn-toggle-bizdist').click(function() {
		blockMap.fnToggleBizdist($(this));
	});
	
	//단일버튼,반경선택,다각형선택,다각형취소 버튼클릭시
	$('.block-layer [data-btn-select-block]').click(function() {
		var $this = $(this),
			mode = $this.attr('data-btn-select-block');
		
		if (! $this.hasClass('on')) {
			switch (mode) {
				case 'point':
					blockMap.fnDrawPointAdd();
					break;
				case 'circle':
					blockMap.fnDrawCircleAdd();
					break;
				case 'polygon':
					blockMap.fnDrawPolygonAdd();
					break;
				case 'undo':
					blockMap.fnDrawPolygonUndo();
					break;
			}
		}

		$('.block-layer [data-btn-select-block]').removeClass('on');
		
		if ('point' === mode || 'circle' === mode ) {
			$this.addClass('on');
		}
	});

	//인근 기능! (현재는 사용안함)
	$('#kt_content [data-btn-near-area]').click(function() {
		blockMap.fnSelectNearArea($(this));
	});

	//격자 기능! 
	$('#kt_content [data-btn-toggle-grid]').click(function() {
		blockMap.fnToggleGridLine($(this));
	});

	// FIXME: 정확한 방법이 없어서 핵으로 해결함
	$('#mapBlockPanel [data-toggle="tab"]').click(function() {
//		var $panel = $('#mapBlockPanel');
//		
//		$panel.attr('style', 'width: 599px !important');
//		setTimeout(function() {
//			$panel.attr('style', 'width: 601px !important');
//			setTimeout(function() {
//				$panel.attr('style', '');
//			});
//		}, 160);
		
		// 탭 변경 시 스크롤 상단 이동
		apiBlockDtl.fnReloadHack();
	});

	// 맵버튼 레이어
	$('#btnMapType1').on('click', function(){
	    $('#mapTypeLayer1').show();
	});
	$('.btnMapType1Close').on('click', function(){
	    $('#mapTypeLayer1').hide();
	});

//	$('#btnMapType2').on('click', function(){
//	    $('#mapTypeLayer2').show();
//	});
//	$('.btnMapType2Close').on('click', function(){
//	    $('#mapTypeLayer2').hide();
//	});

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

	
	// 20200506 퍼블 추가 스크립트 > 클릭 시 항시 표시로 바뀜
//	$('.toolbar').find('a').mouseover(function(){
//		var toolID = $(this).attr('class');
//		$('#' + toolID).css('display','flex');
//	});
//	$('.toolbar').find('a').mouseleave(function(){
//		var toolID = $(this).attr('class');
//		$('#' + toolID).css('display','none');
//	});	

//	KTUtil.ready(function() {
//	    // Init Scrolltop
//		KTLayoutScrolltop.init('kt_scrolltop_blockmap')
//	});


	$('.table-fixed-body').on('scroll', function() {
		var $this = $(this),
			$header = $this.prev('.table-fixed-header');
			
		$header.scrollLeft($this.scrollLeft());
	});

});
