

var apiAddr = (function() {
	
	// FIXME: 지도 두개가 주소창 똑같이 쓴다고 가정하고 코딩하긴 헀는데,
	// 나뉘어지면 리팩토링 필요
	var LICENSE_KEY = '14cc08123cd6d425d603917caf3ee061895e4192',
		URL_DAWUL_API = 'https://vapi.dawulmap.com:8443/MapAppServer/DWService',
		prevAddr = {
			sidonm: '',
			sggnm: '',
			dongnm: ''
		},
		$addrWrapper = $('#addrWrapper'),
		$listSido = $addrWrapper.children().eq(0),
		$listSgg = $addrWrapper.children().eq(1),
		$listDong = $addrWrapper.children().eq(2),
		$btnSearchAddr = $('#btnSearchAddr'),
		$btnSearchAddrSido = $btnSearchAddr.find('[data-addr-sido]'),
		$btnSearchAddrSgg = $btnSearchAddr.find('[data-addr-sgg]'),
		$btnSearchAddrDong = $btnSearchAddr.find('[data-addr-dong]'),
		$divSearchAddr = $('#divSearchAddr'),
		$divSearchAddrSido = $divSearchAddr.find('[data-addr-sido]'),
		$divSearchAddrSgg = $divSearchAddr.find('[data-addr-sgg]'),
		$divSearchAddrDong = $divSearchAddr.find('[data-addr-dong]'),
		tmplAddr = Handlebars.compile($('#tmplAddrList').html()),
		sidoArr = null,
		sggArr = null,
		dongArr = null,
		apiMap = null,
		$mapSrcResult = $('#mapSrcResult'),
		$mapSrcResultBizdist = $('#mapSrcResultBizdist'),
		$addrSearchText = $('#kt_content [data-addr-search-text]'),
		$btnClearSearchText = $('#kt_content [data-btn-clear-addr]'),
		$addrSearchResultText = $mapSrcResult.find('[data-search-result-text]'),
		$addrSearchResultAllList = $mapSrcResult.find('#kt_tab_pane_4'),
		$addrSearchResultAddrList = $mapSrcResult.find('#kt_tab_pane_5'),
		$addrSearchResultPlaceList = $mapSrcResult.find('#kt_tab_pane_6'),
		$cntAddrSearchAll = $mapSrcResult.find('[data-cnt="addrSearchResultAll"]'),
		$cntAddrSearchAddr = $mapSrcResult.find('[data-cnt="addrSearchResultAddr"]'),
		$cntAddrSearchPlace = $mapSrcResult.find('[data-cnt="addrSearchResultPlace"]'),
		$bizdistSearchText = $('#kt_content [data-bizdist-search-text]'),
		$bizdistSearchResultText = $mapSrcResultBizdist.find('[data-bizdist-search-result-text]'),
		$bizdistSearchResultAllList = $mapSrcResultBizdist.find('#kt_tab_pane_2_1'),
		$btnClearSearchBizdistText = $('#kt_content [data-btn-clear-bizdist]'),
		tmplAllSearch = Handlebars.compile($('#tmplAllTextSearchList').html()),
		tmplPlaceSearch = Handlebars.compile($('#tmplPlaceTextSearchList').html()),
		tmplAddrSearch = Handlebars.compile($('#tmplAddrTextSearchList').html()),
		tmplAddrRoadSub = Handlebars.compile($('#tmplAddrRoadSubList').html()),
		tmplBizdist = Handlebars.compile($('#tmplBizdistList').html());

	KTUtil.scrollInit($listSido[0], {
		mobileNativeScroll: true,
		handleWindowResize: true,
		rememberPosition: ($listSido.data('remember-position') == 'true' ? true : false)
	});

	KTUtil.scrollInit($listSgg[0], {
		mobileNativeScroll: true,
		handleWindowResize: true,
		rememberPosition: ($listSgg.data('remember-position') == 'true' ? true : false)
	});

	KTUtil.scrollInit($listDong[0], {
		mobileNativeScroll: true,
		handleWindowResize: true,
		rememberPosition: ($listDong.data('remember-position') == 'true' ? true : false)
	});

	KTUtil.scrollInit($mapSrcResult.find('[data-scroll=true]')[0], {
		mobileNativeScroll: true,
		handleWindowResize: true,
		rememberPosition: false
	});

	KTUtil.scrollInit($mapSrcResultBizdist.find('[data-scroll=true]')[0], {
		mobileNativeScroll: true,
		handleWindowResize: true,
		rememberPosition: false
	});
	
	
	var fnUpdateAddr = function(addr) {
		if (prevAddr.dongnm === addr.dongnm) {
			return;
		}
		
		$btnSearchAddrSido.text(addr.sidonm);
		$btnSearchAddrSgg.text(addr.sggnm);
		$btnSearchAddrDong.text(addr.dongnm);

		$divSearchAddrSido.text(addr.sidonm);
		$divSearchAddrSgg.text(addr.sggnm);
		$divSearchAddrDong.text(addr.dongnm);
		
		$listSido.find('ul a').removeClass('active');
		$listSido.find('[data-list-addr-sido="' + addr.sidonm + '"]').addClass('active');
		
		fnUpdateSidoList(addr.sidonm);
		fnUpdateSggList(addr.sidonm).done(function() {
			fnUpdateDongList(addr.sggnm, addr.dongnm);
		});
	};
	
	var fnListPrivate = function(jsonText) {
		return $.ajax({
			url: '/api/gis/address.do',
			method: 'GET',
			data: jsonText
		});		
	};

	// 처음 한번만 호출되긴 함
	var fnUpdateSidoList = function(sidonm) {
		if (sidoArr) {
			return $.Deferred().resolve({response: sidoArr});
		}
		
		return fnListPrivate({
		}).done(function(resp) {
			var	$list = $listSido.children('ul');

			sidoArr = resp.response;

			$list.append(tmplAddr({sidoArr: sidoArr}));

			$list.find('[data-list-addr-sido="' + sidonm + '"]').addClass('active');
		});
	};
	
	fnUpdateSidoList();

	var fnUpdateSggList = function(sidonm) {
		if (prevAddr.sidonm === sidonm) {
			return $.Deferred().resolve({});
		}
		
		prevAddr.sidonm = sidonm;
		
		return fnListPrivate({
			sidonm: sidonm
		}).done(function(resp) {

			sggArr = resp.response;
			
			var	$list = $listSgg.children('ul');
			
			// 동 정보도 삭제
			$listDong.children('ul').children(':not(.all-item)').remove();
			
			$list.children(':not(.all-item)').remove();
			
			$list.append(tmplAddr({sggArr: sggArr}));

			$list.find('[data-list-addr-sgg="' + prevAddr.sggnm + '"]').addClass('active');
		});
	};
	
	var fnUpdateDongList = function(sggnm, dongnm) {
		if (prevAddr.sggnm === sggnm) {
			if (dongnm && prevAddr.dongnm !== dongnm) {
				prevAddr.dongnm = dongnm;
				
				var $list = $listDong.children('ul');
				
				$list.find('[data-list-addr-dong].active').removeClass('active');
				$list.find('[data-list-addr-dong="' + dongnm + '"]').addClass('active');
			}

			return $.Deferred().resolve({});
		}
		
		prevAddr.sggnm = sggnm;
		prevAddr.dongnm = dongnm;

		var	$list = $listDong.children('ul');
		
		// 전체를 선택한 경우
		if (! sggnm) {
			$list.children(':not(.all-item)').remove();
			return $.Deferred().resolve({});
		}
		
		
		return fnListPrivate({
			sidonm: prevAddr.sidonm,
			sggnm: sggnm
		}).done(function(resp) {

			dongArr = resp.response;
			
			$list.children(':not(.all-item)').remove();
			
			$list.append(tmplAddr({dongArr: dongArr}));

			$list.find('[data-list-addr-dong="' + dongnm + '"]').addClass('active');
			
			// 시군구 변경사항도 active 클래스 반영
			$list = $listSgg.children('ul');
			
			var $sgg = $list.find('[data-list-addr-sgg="' + sggnm + '"]');
			
			if ($sgg.length) {
				$list.find('[data-list-addr-sgg]').removeClass('active');
				$sgg.addClass('active');
			}
		});
	};
	
	
	var fnMoveMap = function(x, y, bizdistSeq, markerVis) {		
		if (! apiMap || ! x || ! y) {
			return;
		}
		
		var latlng = L.latLng(y, x);
		
		apiMap.panTo(latlng);
		
		if (bizdistSeq) {
			blockMap.fnToggleBizdist($('[btn-toggle-bizdist]'), true);
			blockMap.fnDrawPolygonDelete();
			
			apiMap.fireEvent('click', {
				latlng: latlng,
				originalEvent: {
					ctrlKey: true,
					searchBizdist : true		/* 상권검색후 리스트 클릭시 구분필요로 추가  */
				}
			});
		}
		
		if(markerVis){
			ncodePlaceSearch(x, y);
		}
	};
	
	$listSido.on('click', '[data-list-addr-sido]', function() {
		var $this = $(this),
			sidonm = $this.attr('data-list-addr-sido');
		
		if (prevAddr.sidonm === sidonm) {
			return;
		}
		
		if(_isDemo && _DemoSidonm != sidonm) {
			z.msg(_DemoMsgX);
			return false;
		}

		$listSido.find('a').removeClass('active');
		$this.addClass('active');
		
		fnUpdateSggList(sidonm);
	});

	$listSgg.on('click', '[data-list-addr-sgg]', function() {
		var $this = $(this),
			sggnm = $this.attr('data-list-addr-sgg');
		
		// 전체 클릭 시
		
		if (prevAddr.sggnm === sggnm) {
			return;
		}
		
		if(_isDemo && _DemoSggnm != sggnm) {
			z.msg(_DemoMsgX);
			return false;
		}
		
		$listSgg.find('a').removeClass('active');
		$this.addClass('active');
		
		fnUpdateDongList(sggnm);
	});
	
	// 주소 목록선택 후 검색버튼
	$('.btnSearchAddrClose.btn-danger').click(function() {
		var $sido = $listSido.find('a.active'),
			$sgg = $listSgg.find('a.active'),
			$dong = $listDong.find('a.active'),
			sido = $sido.attr('data-list-addr-sido'),
			sgg = $sgg.attr('data-list-addr-sgg'),
			dong = $dong.attr('data-list-addr-dong'),
			zoom = null,
			x = null,
			y = null;
		
		if (! dong) {
			if (! sgg) {
				x = $sido.attr('data-list-addr-x');
				y = $sido.attr('data-list-addr-y');
				zoom = 7;
			} else {
				x = $sgg.attr('data-list-addr-x');
				y = $sgg.attr('data-list-addr-y');
				zoom = 9;
				
				if (! x || ! y) {
					x = $sido.attr('data-list-addr-x');
					y = $sido.attr('data-list-addr-y');
					zoom = 7;
				}
			}
		} else {
			x = $dong.attr('data-list-addr-x');
			y = $dong.attr('data-list-addr-y');
			zoom = 11;
			
			if (! x || ! y) {
				if (! sgg) {
					x = $sido.attr('data-list-addr-x');
					y = $sido.attr('data-list-addr-y');
					zoom = 7;
				} else {
					x = $sgg.attr('data-list-addr-x');
					y = $sgg.attr('data-list-addr-y');
					zoom = 9;
					
					if (! x || ! y) {
						x = $sido.attr('data-list-addr-x');
						y = $sido.attr('data-list-addr-y');
						zoom = 7;
					}
				}
			}
		}
		
		if (apiMap) {
			apiMap.setZoom(zoom, {animate: false});
		}
		fnMoveMap(x, y);
		
	});
	
	$addrSearchText.keyup(function(evt) {
		var text = $.trim($(this).val());

		if (13 === evt.which) {
			if (! text) {
				z.msgAlert({
					html: '검색어를 입력 해주세요',
					icon: 'error'
				});
				return;
			}
			
			fnTextSearchPrivate(text);
		}
	});
	
	$bizdistSearchText.keyup(function(evt) {
		var text = $.trim($(this).val());

		if (13 === evt.which) {
			if (! text) {
				z.msgAlert({
					html: '검색어를 입력 해주세요',
					icon: 'error'
				});
				return;
			}
			
			fnBizdistSearchPrivate(text);
		}
	});
	
	
	
	var fnTextSearchPrivate = function(text) {

		var dataPlace = {
				header: {
					format: "JSON",
					key: LICENSE_KEY,
					serviceName: "POI"
				},
				body: {
					crs: "GRS_80",
					fulltext: text,
					admin: "",
					reqLang: "KOR",
					resLang: "KOR",
					page: {
						cnt: 100,
						pageNo: 1				
					}
				}
			},
			dataAddr = $.extend(true, {}, dataPlace, {
				header: {
					serviceName: 'GEOCODING'
				},
				body: {
					addressType: 'HLS',
					fulladdress: text,
					selectFields: {
						geoType: 'ORIGIN'
					}
				}
			});
		
		$mapSrcResult.show();
		
		$addrSearchResultAllList.html('');
		$addrSearchResultAddrList.html('');
		$addrSearchResultPlaceList.html('');

		$addrSearchText.val(text);
		$addrSearchResultText.text(text);
		
		$.when(
			$.ajax({
				url: URL_DAWUL_API,
				method: 'GET',
				data: {
					req: JSON.stringify(dataPlace)
				}
			}),
			$.ajax({
				url: URL_DAWUL_API,
				method: 'GET',
				data: {
					req: JSON.stringify(dataAddr)
				}
			})
		).done(function(respPlace, respAddr) {
			respPlace = respPlace[0];
			respAddr = respAddr[0];
			
			var pagePlace = respPlace.body.page,
				pageAddr = respAddr.body && respAddr.body.geojson,
				cntTotalPlace = pagePlace && pagePlace.totalCnt || 0,
				cntTotalAddr = pageAddr && pageAddr.features && pageAddr.features.length || 0,
				addrList = respAddr.body && respAddr.body.geojson && respAddr.body.geojson.features || [],
				placeList = respPlace.body.geojson && respPlace.body.geojson.features || [];

			$cntAddrSearchAll.text(z.toComma(cntTotalPlace + cntTotalAddr));
			$cntAddrSearchAddr.text(z.toComma(cntTotalAddr));
			$cntAddrSearchPlace.text(z.toComma(cntTotalPlace));
			
			for (var i in addrList) {
				var addr = addrList[i];
				
				if(addr.properties.type == "ldong" || addr.properties.type == "hdong"){
					addr.properties.name = addr.properties.name;
				}else if(addr.properties.type == "build"){
					addr.properties.name	=	addr.properties.newrpnuname;
				}else if(addr.properties.type == "jijuk"){
					addr.properties.name = addr.properties.pnuname;
				}
				
				if ('road' === (addr.properties && addr.properties.type || '')) {
					addr.isSubList = true;
				}				
				
				if ('road' === (addr.properties && addr.properties.type || '')) {
					addr.isSubList = true;
				}
				
				switch (addr.geometry.type) {
					case 'Point':
						addr.x = addr.geometry.coordinates[1];
						addr.y = addr.geometry.coordinates[0];
						break;
					case 'Polygon':
					case 'MultiPolygon':
					case 'LineString':
					case 'MultiLineString':
						var turfCenter = centerCoord('GRS_80', addr.geometry);

						addr.x = turfCenter.lng;
						addr.y = turfCenter.lat;
						break;
				}
			}
			
			var allArr = {
				addrArr: $.extend(true, [], addrList).splice(0, 3),
				placeArr: $.extend(true, [], placeList).splice(0, 5)
			};

			$addrSearchResultAllList.append(tmplAllSearch(allArr));
			$addrSearchResultAddrList.append(tmplAddrSearch({searchArr: addrList}));
			$addrSearchResultPlaceList.append(tmplPlaceSearch({searchArr: placeList}));
		});
		
	};
	
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
		
	var fnLoadSubRoadList = function(roadCode, $root) {
		
		$root = $root || $addrSearchResultAddrList;

		var $list = $root.find('[data-list-road="' + roadCode + '"]'),
			dataRoad = {
				header: {
					format: "JSON",
					key: LICENSE_KEY,
					serviceName: "SUB_GEOCODING"
				},
				body: {
					crs: "GRS_80",
					code: roadCode,
					adminType: "ROAD_ADDRESS",
					selectFields: {
						geoType: "ORIGIN"
					},
					reqLang: "KOR",
					resLang: "KOR",
					page: {
						cnt: 10,
						pageNo: 1				
					}
				}
			};

		if (! $list.length) {
			return;
		}
		
		$list.html('');
		
		$.ajax({
			url: URL_DAWUL_API,
			method: 'GET',
			data: {
				req: JSON.stringify(dataRoad)
			}
		}).done(function(resp) {
			var searchArr = resp.body.geojson.features || [];
			
			for (var i in searchArr) {
				var addr = searchArr[i];
				
				addr.properties.addrname = (addr.properties.pnuname || '').split('|')[0];
			}

			$list.append(tmplAddrRoadSub({searchArr: searchArr}));
		});
	};
	
	var fnBizdistSearchPrivate = function(text) {
		var bizdistArr = map.bizdistArr,
			searchArr = [];

		$mapSrcResultBizdist.show();
		
		$bizdistSearchText.val(text);
		$bizdistSearchResultText.text(text);

		for (var i in bizdistArr) {
			var biz = bizdistArr[i],
				data = biz.bizdist;
				
			if (-1 < (data['상권'] || '').indexOf(text)) {
				searchArr.push({
					bizdist: $.extend(true, [], data),
					center: $.extend(true, [], biz.turfCenter.geometry.coordinates)
				});
			}
		}
		
		searchArr = searchArr.sort(function(a, b) {
			if (a.bizdist['상권'] < b.bizdist['상권']) {
				return -1;
			} else if (a.bizdist['상권'] > b.bizdist['상권']) {
				return 1;
			}

			return 0;
		});
		$bizdistSearchResultAllList.html(tmplBizdist({searchArr: searchArr}));
	};
	
	$addrSearchResultAddrList.on('click', '[data-btn-gis]', function() {
		var $this = $(this),
			gisX = $this.attr('data-gis-x'),
			gisY = $this.attr('data-gis-y');
		
		fnMoveMap(gisX, gisY, null, true);
	});

	$bizdistSearchResultAllList.on('click', '[data-btn-bizdist]', function() {
		var $this = $(this),
			gisX = $this.attr('data-gis-x'),
			gisY = $this.attr('data-gis-y'),
			bizdistSeq = $this.attr('data-btn-bizdist');
		
		fnMoveMap(gisX, gisY, bizdistSeq);
	});

	
	var fnToggleSubList = function($this, $root) {
		var $icon = $this,
			$list = $this.parent('.one_depth_dl').next('[data-list-road]'),
			roadCode = $this.attr('data-btn-road');

		if ($icon.hasClass('plus')) {
			$list.show();
			$icon.removeClass('plus').addClass('minus');
			fnLoadSubRoadList(roadCode, $root);
		} else {
			$list.hide();
			$icon.removeClass('minus').addClass('plus');
		}
	};
	
	$addrSearchResultAllList.on('click', '[data-btn-road]', function() {
		fnToggleSubList($(this), $addrSearchResultAllList);
	});
	$addrSearchResultAddrList.on('click', '[data-btn-road]', function() {
		fnToggleSubList($(this), $addrSearchResultAddrList);
	});

	var fnBtnSubGis = function($this) {
		var gisX = $this.attr('data-gis-x'),
			gisY = $this.attr('data-gis-y');
		
		fnMoveMap(gisX, gisY, null, true);
	};

	$addrSearchResultAllList.on('click', '[data-btn-gis]', function() {
		fnBtnSubGis($(this));
	});

	$addrSearchResultPlaceList.on('click', '[data-btn-gis]', function() {
		fnBtnSubGis($(this));
	});
	
	$btnClearSearchText.click(function() {
		$mapSrcResult.hide();
		$addrSearchText.val('');
		$addrSearchResultText.text('');
	});
	
	$mapSrcResult.on('click', '[data-btn-toggle-tab]', function(evt) {
		var tab = $(this).attr('data-btn-toggle-tab');

		$mapSrcResult.find('[href="' + tab + '"]').click();
	});
	
	$btnClearSearchBizdistText.click(function() {
		$mapSrcResultBizdist.hide();
		$bizdistSearchText.val('');
		$bizdistSearchResultText.text('');
	});
	
	
	var fnGetAddressPrivate = function() {
		var self = this;

		return $.extend(true, {}, prevAddr);
	};

	return {
		
		LICENSE_KEY: LICENSE_KEY,
		
		// 초기화 호출은 한번만 가능
		fnInit: function(map) {
			var self = this;
			
			if (self.isInit) {
				return;
			}
			
			self.isInit = true;
			
			// 행정동 주소 검색 레이어
			$btnSearchAddr.click(function(){
			    $divSearchAddr.show();
			});
			
			$('.btnSearchAddrClose').click(function(){
			    $divSearchAddr.hide();
			});
			
			$(document).mouseup(function (e){
			    var container = $divSearchAddr;
			    if( container.has(e.target).length === 0){
			      container.hide();
			    }
			});
			
			$('#mapSrcClose').click(function(){
			    $mapSrcResult.hide();
			});

			var $today = $('#kt_content [data-today]');
			
			$today.text(moment().format($today.attr('data-today')));
			
			if (map) {
				self.fnSetMap(map);
			}
		},
		
		fnSetMap: function(map) {
			apiMap = map;
		},

		fnList: function(jsonText) {
			return fnListPrivate(jsonText);
		},
		
		fnGps: function(latLng, bound) {
			var data = {
				lat: latLng.lat,
				lng: latLng.lng
			};

			if (bound) {
				data.west = bound.getWest() - 0.1;
				data.east = bound.getEast() + 0.1;
				data.south = bound.getSouth() - 0.1;
				data.north = bound.getNorth() + 0.1;
			}
			
			return 	$.ajax({
				url: '/api/gis/addressGps.do',
				method: 'GET',
				data: data
			}).done(function(resp) {
				if (200 !== resp.code) {
					return;
				}
				
				var addr = resp.response;
				
				fnUpdateAddr(addr);
			});
		},
		
		fnTextSearch: function(text) {
			return fnTextSearchPrivate(text);
		},
		
		fnGetAddress: function() {
			return fnGetAddressPrivate();
		}
	};
})();