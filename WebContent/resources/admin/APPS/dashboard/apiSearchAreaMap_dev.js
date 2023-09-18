'use strict';
// Class definition

var map = null,
$map = $('#map');
var miniMap = null;
var lan = 'KOR';

var apiSearchAreaMap = function() {
    // Private functions
	var loaded = $.Deferred(),
		$btnSearchArea,
		$btnSearchAreaSpan,
		$addrWrapper = $('#addrWrapper'),
		$listSidoArea = $addrWrapper.children().eq(0),
		$listSggArea = $addrWrapper.children().eq(1),
		$listArea = $addrWrapper.children().eq(2),
		$divSearchArea = $('#divSearchArea'),
		$searchbizdist = $('.searchbizdist'),
		$spanSidoNm = $searchbizdist.find('[data-addr-sido]'),
		$spanSggNm = $searchbizdist.find('[data-addr-sgg]'),
		$spanAreaNm = $searchbizdist.find('[data-addr-area]'),
		tmplArea = Handlebars.compile($('#tmplAreaList').html()),
		bizdistShow = true,
		sidoArr = null,
		sggArr = null,
		dongArr = null,
		apiMap = null,
		areaCdListener,
		contentMode = 'emd',
		isfirst = true,
		prevOriginArea = {
			sidocd: '',
			sidonm: '',
			sggnm: '',
			sggcd: '',
			dongnm: '',
			dongcd: '',
			bizdistnm: '',
			bizdistcd: '',
			bizdistAdmCd: '',
			bizdistGeom : '',
			chkbizdist:''
		},  
		prevArea = {
			sidocd: '',
			sidonm: '',
			sggnm: '',
			sggcd: '',
			dongnm: '',
			dongcd: '',
			bizdistnm: '',
			bizdistcd: '',
			bizdistAdmCd: '',
			bizdistGeom : '',
			chkbizdist:''
		};
	
	KTUtil.scrollInit($listSidoArea[0], {
		mobileNativeScroll: true,
		handleWindowResize: true,
		rememberPosition: ($listSidoArea.data('remember-position') == 'true' ? true : false)
	});

	KTUtil.scrollInit($listSggArea[0], {
		mobileNativeScroll: true,
		handleWindowResize: true,
		rememberPosition: ($listSggArea.data('remember-position') == 'true' ? true : false)
	});

	KTUtil.scrollInit($listArea[0], {
		mobileNativeScroll: true,
		handleWindowResize: true,
		rememberPosition: ($listArea.data('remember-position') == 'true' ? true : false)
	});
	
	var setBtnListener = function() {
		$btnSearchArea.on('click', function() {
			prevOriginArea = prevArea;
		    $divSearchArea.show();
		});

		$('.btnSearchAreaOk').click(function(){
			if (! areaCdListener) {
				return;
			}
			// 전체 버튼 추가
			// 시도(2) + 시군구(3) + 읍면동(3) + 리(2) 에서 시군구 까지만
			
			var dongcd, dongnm;
			
			var param = $.extend(true, {}, prevArea);	  
			var sggnm = (prevArea.sggnm == "전체"?"":prevArea.sggnm);
			param.isBizdist = (prevArea.chkbizdist?true:false);
			param.bizdistAdmCd = prevArea.bizdistcd;
			param.sidonm = prevArea.sidonm;
			param.sggnm = sggnm;
			param.dongnm = (prevArea.chkbizdist?prevArea.bizdistnm:prevArea.dongnm);
			dongcd = ((prevArea.chkbizdist?prevArea.bizdistcd:prevArea.dongcd) == "전체" ? "" : (prevArea.chkbizdist ? prevArea.bizdistcd : prevArea.dongcd)) 
			dongnm = ((prevArea.chkbizdist?prevArea.bizdistnm:prevArea.dongnm) == "전체" ? "" : (prevArea.chkbizdist ? prevArea.bizdistnm : prevArea.dongnm))
			
			// 시/도 or 시군구 or 읍면동 모드 판별
			if (prevArea.chkbizdist){
				param.bizdistGeom = prevArea.bizdistGeom;
			} else if (! prevArea.chkbizdist && prevArea.dongcd.length > 0 && prevArea.sggcd.length > 0) {
				param.jusoCd = 'emd';
				param.dongCd = prevArea.dongcd;
			} else if (! prevArea.chkbizdist && prevArea.sggcd.length > 0){
				param.jusoCd = (prevArea.dongnm == "전체" ? 'emd' : 'sgg');
				param.dongCd = (prevArea.dongnm == "전체" ? prevArea.sggcd.substring(0, 5):prevArea.sggcd);
			} else {
				//param.jusoCd = (prevArea.sggnm == "전체" ? 'sgg' : 'sido');
				param.jusoCd = (prevArea.sggnm == "전체" ? 'sido' : 'sido');
				param.dongCd = (prevArea.sidonm == "전국" ? "all" : (prevArea.sggnm == "전체" ? prevArea.sidocd.substring(0, 2):prevArea.sidocd));
				// param.dongCd = (prevArea.sggnm == "전체" ? prevArea.sidocd.substring(0, 2):prevArea.sidocd);  
			}
			areaCdListener(param);
			z.addEmdSearchLog(param);
			
			$btnSearchAreaSpan.text(prevArea.sidonm + ' ' + sggnm + ' ' + dongnm);
			$divSearchArea.hide();
			
			// 지역현황판 메뉴 내 선택한 지역설정 값 유지
			dashboardSelectedAddr.sidonm = prevArea.sidonm;
			dashboardSelectedAddr.sggnm = sggnm;
			dashboardSelectedAddr.dongnm = dongnm;
			dashboardSelectedAddr.sidocd = prevArea.sidocd;
			dashboardSelectedAddr.sggcd = (sggnm == "" ? '' : prevArea.sggcd);
			dashboardSelectedAddr.dongcd = (dongnm == "" ? '' : prevArea.dongcd);
			
		});
		
		$('.btnSearchAreaClose').click(function(){
			prevArea = prevOriginArea;
			$divSearchArea.hide();
		});
		
		$listSidoArea.on('click', '[data-list-addr-sido]', function() {
			var $this = $(this),
				sidocd = $this.attr('data-list-addr-sidocd'),
				sidonm = $this.attr('data-list-addr-sido');
			
			if (prevArea.sidonm === sidonm && prevArea.chkbizdist === $('.market_check_wrap input').is(":checked")) {
				return;
			}
			
			if(_isDemo && _DemoSidonm != sidonm) {
				z.msg(_DemoMsgX);
				return false;
			}

			$listSidoArea.find('a').removeClass('active');
			$this.addClass('active');
			fnUpdateSggList(sidonm, sidocd, "", "", 'list');
		});
		
		
		$listSggArea.on('click', '[data-list-addr-sgg]', function() {
			var $this = $(this),
				sggcd = $this.attr('data-list-addr-sggcd'),
				sggnm = $this.attr('data-list-addr-sgg');
			
			// 전체 클릭 시			
			if (prevArea.sggnm === sggnm && prevArea.chkbizdist === $('.market_check_wrap input').is(":checked")) {
				return;
			} 
			
			if(_isDemo && _DemoSggnm != sggnm) {
				z.msg(_DemoMsgX);
				return false;
			}
			
			$listSggArea.find('a').removeClass('active');
			$this.addClass('active');
			
			fnUpdateAreaList(sggnm, sggcd, "", "", 'list');
		});	
		
		$listArea.on('click', '[data-list-addr-dong], [data-list-addr-bizdist]', function() {
			var $this = $(this),
				chkbizdist = $('.market_check_wrap input').is(":checked"),
				gisX = $this.attr('data-list-addr-x'),
				gisY = $this.attr('data-list-addr-y'),
				geom = $this.attr('data-geom');
			
			var areacd = (chkbizdist?$this.attr('data-list-addr-bizdistseq'):$this.attr('data-list-addr-dongcd')),
				areanm = (chkbizdist?$this.attr('data-list-addr-bizdist'):$this.attr('data-list-addr-dong'));			
			
			// 전체 클릭 시			
			if (prevArea.areanm === areanm && prevArea.chkbizdist === $('.market_check_wrap input').is(":checked")) {
				return;
			} 
			
			$listArea.find('a').removeClass('active');
			$this.addClass('active');
			
			if(chkbizdist){ // map 호출
				fnMoveMap(areacd);
				prevArea.bizdistnm = areanm;
				prevArea.bizdistcd = areacd;
				prevArea.bizdistGeom = geom;
			} else {
				prevArea.dongnm = areanm;
				prevArea.dongcd = areacd;
				prevArea.bizdistGeom = null;
			}
		
			$spanAreaNm.text(areanm);
		});	
		
		$('.market_check_wrap input').on('click', function(){
			var $this = $(this);
			if($this.is(":checked")){
				contentMode = 'bizdist';
				//setTimeout(function() {fnMoveMap(prevArea.bizdistcd);}, 0);
				$('.market_map_warp').show();
				setTimeout(function(){ map.invalidateSize()}, 100);
				setTimeout(function(){fnToggleBizdistMap();}, 0);
			} else {
				contentMode = 'emd';
				$('.market_map_warp').hide();
			}
			$listSidoArea.find('[data-list-addr-sido="' + prevArea.sidonm + '"]').click();
		});	
	};
	
	var setMap = function(){		
	    var self = this,
			defaultCenter = [37.5118, 127.0592],	
			defaultZoom = 9;
			prevArea.chkbizdist = false;
	    	
		map = L.map('map', {
			doubleClickZoom: false, 
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
		
		fnUpdateSidoList("", 'list').done(function() {
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
			polygonBizdistseq = null,
			polygonId = 0;
			
			/* 상권 조회 */	
			if ((evt.originalEvent.ctrlKey || evt.originalEvent.metaKey || evt.originalEvent.detail === 2) && map.bizdistLayer.getLayers().length) {
				/* 색 해제 */
				/*var bizdistArr = map.bizdistLayer.getLayers(); 
				for (var i in bizdistArr) {
					bizdistArr[i].setStyle({fillColor: '#FFD400'});
				}
				*/
				
				var turfPoint = turf.point([latLng.lng, latLng.lat]),
					insideClickCnt = 0;
				for (var i in map.bizdistArr) {
					var polygonBizdistI = map.bizdistArr[i],
						turfBBox = polygonBizdistI.turfBBox,
						turfPolygon = polygonBizdistI.turfPolygon,
						polygonBizdistseq = polygonBizdistI.bizdist.순번;
					
					// bbox 에 포함 안되면 패스
					if (latLng.lat > turfBBox[3] || latLng.lat < turfBBox[1] || latLng.lng > turfBBox[2] || latLng.lng < turfBBox[0]) {
						continue;
					} 
					
					/* 상권영역 이외의 지도 클릭시 색원복위해 */
					polygonId = i
					
					// polygon 에도 포함되면 선택
					//if (turf.inside(turfPoint, turfPolygon) || evt.originalEvent.searchBizdist) {
					if (polygonBizdistI.bizdist.순번 === evt.originalEvent.bizdistseq || evt.originalEvent.searchBizdist) {
						polygonBizdist = polygonBizdistI;
						break; 
					} else {
						if (turf.inside(turfPoint, turfPolygon)){
							//console.log('inside : true ' + polygonBizdistseq);
							if(polygonBizdistseq > 0){
								polygonBizdist = polygonBizdistI;
								var sidonm = polygonBizdistI.bizdist.sidonm;
								var sggnm = polygonBizdistI.bizdist.sggnm;
								var admcd = polygonBizdistI.bizdist.법정동코드;
								var bizdistnm = polygonBizdistI.bizdist.상권;
								var bizdistseq = polygonBizdistI.bizdist.순번;
								var bizdistgeom = polygonBizdistI.bizdist.geom;
								
								setTimeout(fnUpdateSidoList, 0, sidonm, 'map');
								setTimeout(fnUpdateSggList,  0, sidonm, admcd.substring(0,2), sggnm, admcd.substring(0,5), 'map');
								setTimeout(fnUpdateAreaList, 0, sggnm, admcd.substring(0,5), bizdistnm, bizdistseq, bizdistgeom, 'map');
							} else {
								continue;
							}
						} else {
							//console.log('inside : false ' + polygonBizdistseq);
							continue;
						}	
					}
				}	
				/* 색변환 */
				if(polygonBizdist != null && polygonId > 0) {
					for (var i in map.bizdistArr) {
						map.bizdistArr[i].setStyle({fillColor: '#FFD400'});
					}
				}
				if(polygonBizdist == null){
					if(polygonId > 0){
						//console.log('aaaa : ' + polygonId);
						map.bizdistArr[map.polygonId].setStyle({fillColor: '#BBFF33'});
					}
				} else {
					//console.log('bbbb');
					polygonBizdist.setStyle({fillColor: '#BBFF33'});
					map.polygonId = polygonId;
				}	
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
		
		//FIXME : 강제 클릭시 상권 키로 수정처리필요 !!
		if (bizdistseq) {
			map.fireEvent('click', {
				latlng: latlng, 
				originalEvent: {
					ctrlKey: true,
					bizdistseq : bizdistseq,
					searchBizdist : true		/* 상권검색후 리스트 클릭시 구분필요로 추가  */
				}
			});
		}
	};
	
	// 지역(시/도) 리스트
	var fnUpdateSidoList = function(sidonm, clickobj) {
		if (sidoArr && clickobj === 'list') {
			return $.Deferred().resolve({response: sidoArr});
		}
		return fnListPrivate({
		}).done(function(resp) {
			var	$list = $listSidoArea.children('ul');
			sidoArr = resp.response;
			
			$list.children('ul').children(':not(.all-item)').remove();

			var sidoAll = {'adm_cd' : '', 'sidonm'  : '전국', 'x좌표'   : '', 'y좌표'   : ''};
			sidoArr.unshift(sidoAll);
			$list.append(tmplArea({sidoArr: sidoArr}));

			if(isfirst == true && sidonm === ""){
				// sidonm = sidoArr[0].sidonm;
				// fnUpdateSggList(sidonm, sidoArr[0].adm_cd, "", "", clickobj);
				
				// 지역현황판 메뉴 내 선택한 지역설정 값 유지
				var adm_cd;
				sidoArr.forEach(function(el, i) {
					if (el.sidonm == dashboardSelectedAddr.sidonm) {
						sidonm = el.sidonm;
						adm_cd = el.adm_cd;
					}
				})
				fnUpdateSggList(sidonm, adm_cd, "", "", clickobj);	
			}
			
			$list.find('a').removeClass('active');
			$list.find('[data-list-addr-sido="' + sidonm + '"]').addClass('active');
			if($list.find('[data-list-addr-sido ="' + sidonm + '"]').position().top <= 0 || $list.find('[data-list-addr-sido ="' + sidonm + '"]').position().top > 262.5){
				$('#pop_sido').scrollTop(0).scrollTop($list.find('[data-list-addr-sido="' + sidonm + '"]').position().top);
			}
		}); 
	};	   
	
	// 지역(시/군/구) 리스트
	var fnUpdateSggList = function(sidonm, sidocd, sggnm, sggcd, clickobj) {
		var chkbizdist = $('.market_check_wrap input').is(":checked");
		
		if (prevArea.sggnm === sggnm && prevArea.sidonm === sidonm && prevArea.chkbizdist === chkbizdist) {
			return $.Deferred().resolve({});
		}
		prevArea.sidonm = sidonm;
		prevArea.sidocd = sidocd;
		
		$spanSidoNm.text(sidonm);
		
		return fnListPrivate({
			sidonm: sidonm
		}).done(function(resp) {
			sggArr = resp.response;
			var sggArrList = (sidonm == "전국" ? [] : JSON.parse(JSON.stringify(sggArr)));
			if(!chkbizdist){
				var sggall = {'adm_cd' : '', 'sggnm'  : '전체', 'sidonm' : sidonm, 'x좌표'   : '', 'y좌표'   : ''} 
				sggArrList.unshift(sggall);
			}
			
			var	$list = $listSggArea.children('ul');
			
			// 동 정보도 삭제
			$listArea.children('ul').children(':not(.all-item)').remove();
			
			$list.children(':not(.all-item)').remove();
			
			$list.append(tmplArea({sggArr: sggArrList}));
			
			if(chkbizdist){
				if(sggnm === ""){
					sggnm = sggArrList[0].sggnm;
					fnUpdateAreaList(sggnm, sggArrList[0].adm_cd, "", "", "", clickobj);
				} else {
					sggnm = sggnm;
				}	
			} else {
				if(isfirst == true) {
					// 지역현황판 메뉴 내 선택한 지역설정 값 유지
					var adm_cd;
					sggArrList.forEach(function(el, i) {
						if (el.sggnm == (dashboardSelectedAddr.sggnm == '' ? '전체' : dashboardSelectedAddr.sggnm)) {
							sggnm = el.sggnm;
							adm_cd = el.adm_cd;
						}
					})
					fnUpdateAreaList(sggnm, adm_cd, "", "", "", clickobj);
					
				} else {
					sggnm = (sidonm == '전국' ? sggArrList[0].sggnm : sggArrList[1].sggnm);
					adm_cd = (sidonm == '전국' ? sggArrList[0].adm_cd : sggArrList[1].adm_cd)
					fnUpdateAreaList(sggnm, adm_cd, "", "", "", clickobj);
				}
			}
			
			$list.find('[data-list-addr-sgg ="' + sggnm + '"]').addClass('active');
			if($list.find('[data-list-addr-sgg ="' + sggnm + '"]').position().top <= 0 || $list.find('[data-list-addr-sgg ="' + sggnm + '"]').position().top > 262.5){
				$('#pop_sgg').scrollTop(0).scrollTop($list.find('[data-list-addr-sgg ="' + sggnm + '"]').position().top);
			}
		});
	};
	
	// 지역(읍/면/동 또는 상권) 리스트
	var fnUpdateAreaList = function(sggnm, sggcd, areanm, areacd, geom, clickobj) {		
		var chkbizdist = $('.market_check_wrap input').is(":checked");
		
		if (prevArea.sggnm === sggnm && (chkbizdist?prevArea.bizdistnm:prevArea.dongnm) === areanm && prevArea.chkbizdist === $('.market_check_wrap input').is(":checked")) {
			return $.Deferred().resolve({});
		}	
		prevArea.sggnm = sggnm;
		prevArea.sggcd = sggcd;	
		$spanSggNm.text(sggnm);
		
		var	$list = $listArea.children('ul');
		prevArea.chkbizdist = chkbizdist;
		if(chkbizdist){
			return z.xAsync('Gis', '주소_검색_상권명', 'select', {admCd: prevArea.sggcd.substring(0,5)}, 'json').done(function(resp) {
				var bizdistArr = resp;
				
				$list.children(':not(.all-item)').remove();
				
				$list.append(tmplArea({bizdistArr: bizdistArr}));
				
				if(areanm === ""){
					areanm = bizdistArr[0].bizdist_nm;
					areacd = bizdistArr[0].순번;
					prevArea.bizdistnm = areanm;
					prevArea.bizdistcd = areacd;
					prevArea.bizdistGeom = bizdistArr[0].geom;
					$spanAreaNm.text(areanm);
					fnMoveMap(areacd);
				} else if (clickobj === 'map'){
					prevArea.bizdistnm = areanm;
					prevArea.bizdistcd = areacd;
					prevArea.bizdistGeom = geom;
					$spanAreaNm.text(areanm);
					fnMoveMap(areacd);
				}	
				$list.find('[data-list-addr-bizdist="' + areanm + '"]').addClass('active');  
				
				if($list.find('[data-list-addr-bizdist ="' + areanm + '"]').position().top <= 0 || $list.find('[data-list-addr-bizdist ="' + areanm + '"]').position().top > 262.5){
					$('#pop_area').scrollTop(0).scrollTop($list.find('[data-list-addr-bizdist="' + areanm + '"]').position().top);
				}	
			});
		} else {
			/* 전체를 선택한 경우
			if (! sggnm) {
				$list.children(':not(.all-item)').remove();
				return $.Deferred().resolve({});
			}*/			
			
			return fnListPrivate({
				sidonm: prevArea.sidonm,
				sggnm: sggnm
			}).done(function(resp) {
				dongArr = resp.response;
				var dongArrList = (prevArea.sidonm == "전국" ? [] : JSON.parse(JSON.stringify(dongArr)));
				var dongall = {'adm_cd' : '', 'dongnm'  : '전체',  'sggnm'  : sggnm, 'sidonm' : prevArea.sidonm, 'x좌표'   : '', 'y좌표'   : ''} 
				
				dongArrList.unshift(dongall);
				
				$list.children(':not(.all-item)').remove();
				
				$list.append(tmplArea({dongArr: dongArrList}));
				
				if(areanm === ""){
					if(isfirst){//최초에만 실행!
						// 지역현황판 메뉴 내 선택한 지역설정 값 유지
						dongArrList.forEach(function(el, i) {
							if (el.dongnm == (dashboardSelectedAddr.dongnm == '' ? '전체' : dashboardSelectedAddr.dongnm)) {
								areanm = el.dongnm;
								areacd = el.adm_cd;
							}
						})
						
						prevArea.dongnm = areanm;
						prevArea.dongcd = areacd;	
						$spanAreaNm.text(areanm);
						
						$('.btnSearchAreaOk').click();
						isfirst = false;
					} else {
						areanm = dongArrList[0].dongnm;
						areacd = dongArrList[0].adm_cd;  
						prevArea.dongnm = areanm;
						prevArea.dongcd = areacd;	
						$spanAreaNm.text(areanm);
					}
				}

				$list.find('[data-list-addr-dong="' + areanm + '"]').addClass('active');
				if($list.find('[data-list-addr-dong ="' + areanm + '"]').position().top <= 0 || $list.find('[data-list-addr-dong ="' + areanm + '"]').position().top > 262.5){
					$('#pop_area').scrollTop(0).scrollTop($list.find('[data-list-addr-dong="' + areanm + '"]').position().top);
				}	
				
				
				/* 시군구 변경사항도 active 클래스 반영
				$list = $listSggArea.children('ul');
				
				var $sgg = $list.find('[data-list-addr-sgg="' + sggnm + '"]');
				
				if ($sgg.length) {
					$list.find('[data-list-addr-sgg]').removeClass('active');
					$sgg.addClass('active');
				}
				*/	
			});
		}		
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
			
			$('.market_check_wrap input').attr('disabled', false);
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
			// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
        		$btnSearchArea = options.btnSearchArea;
    			$btnSearchAreaSpan = options.btnSearchAreaSpan;
    			areaCdListener = options.areaCdListener;
    			bizdistShow = (options.bizdistShow==null?true:false);
    			(bizdistShow?$('#market_check').show():$('#market_check').hide());
    			$('.market_check_wrap input').attr('disabled', true);
    			setBtnListener();
    			
    			KTApp.init();
        },
    	mapinit: function(){
    		setMap();    		
    	},
    	
    	getDongArr: function() {
			return $.extend(true, [], dongArr);
		},

		getSggArr: function() {
			return $.extend(true, [], sggArr);
		},

		getSidoArr: function() {
			return $.extend(true, [], sidoArr);
		},
		
		getBizdistArr: function() {
			return $.extend(true, [], [prevArea]);
		},
		getContentMode: function() {
			return contentMode;
		},
		getAreaOk : function (){
			return $('.btnSearchAreaOk');
		},
		addDownloadLog: function(downNm, downType) {
			return z.addDownloadLog(downNm, downType);
		}
    };    
}();
  
$(function() {
	// 지도API
	$.when(
		//$.getScript("https://rmap.r114.com:8000/MapAppServer/DWService?req={'header':{'format':'JSON','serviceName':'SDK_REQ','key':'14cc08123cd6d425d603917caf3ee061895e4192'},'body':{'sdkType':'AJAX','version':'2.0'}}"),
		$.getScript("/api/gis/js/dawulMap.do"),	
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
				apiSearchAreaMap.mapinit();
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