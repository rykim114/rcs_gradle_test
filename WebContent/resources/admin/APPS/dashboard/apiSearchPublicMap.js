'use strict';
// Class definition

var map = null,
$map = $('#map');
var miniMap = null;
var lan = 'KOR';

var apiSearchPublicMap = function() {
    // Private functions
	var loaded = $.Deferred(),
		isTabidx = '1',
		$btnSearchArea,
		$btnSearchAreaSpan,
		$addrWrapper = $('#addrWrapper'),
		$listSidoArea = $addrWrapper.children().eq(0),
		$listWideArea = $addrWrapper.children().eq(1),
		$listArea = $addrWrapper.children().eq(2),
		$divSearchArea = $('#divSearchArea'),
		$searchbizdist = $('.searchbizdist'),
		$spanSidoNm = $searchbizdist.find('[data-addr-sidonm]'),
		$spanWideAreaNm = $searchbizdist.find('[data-addr-wideareanm]'),
		$spanAreaNm = $searchbizdist.find('[data-addr-areanm]'),
		tmplArea = Handlebars.compile($('#tmplAreaList').html()),
		sidoArr = null,
		wideAreaArr = null,
		areaArr = null,
		areaCdListener,
		contentMode = 'emd',
		isfirst = true,
		prevOriginArea = {
			sidonm: '',
			wideareanm: '',
			areanm: ''
		},  
		prevArea = {
			sidonm: '',
			wideareanm: '',
			areanm: ''
		};
	
	KTUtil.scrollInit($listSidoArea[0], {
		mobileNativeScroll: true,
		handleWindowResize: true,
		rememberPosition: ($listSidoArea.data('remember-position') == 'true' ? true : false)
	});

	KTUtil.scrollInit($listWideArea[0], {
		mobileNativeScroll: true,
		handleWindowResize: true,
		rememberPosition: ($listWideArea.data('remember-position') == 'true' ? true : false)
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
			var param = $.extend(true, {}, prevArea);
			var sidonm = (prevArea.sidonm == "전체"?"":prevArea.sidonm);
			var wideareanm = (prevArea.wideareanm == "전체"?"":prevArea.wideareanm);  
			var areanm = (prevArea.areanm == "전체"?"":prevArea.areanm);
			param.sidonm = sidonm;
			param.wideareanm = wideareanm;
			param.areanm = areanm;
			param.tabidx = isTabidx;
			areaCdListener(param);
			
			//z.addEmdSearchLog(param);
			
			$btnSearchAreaSpan.text(prevArea.sidonm + ' ' + wideareanm + ' ' + areanm);
			$divSearchArea.hide();
		});
		
		$('.btnSearchAreaClose').click(function(){
			prevArea = prevOriginArea;
			$divSearchArea.hide();
		});

		$('[data-target="#tab01"], [data-target="#tab02"]').off('click').on('click', function() {
			var $this = $(this),
				tab = $this.attr('data-target'),
				$tab1 = $('#tab01 detailContent'),
				$tab2 = $('#tab02 detailContent'),
				$detail = $tab1.length ? $tab1 : $tab2;
			
			KTApp.blockPage({message: '잠시 기다려 주십시오'});
			switch (tab) {
				case '#tab01':
					isTabidx = '1';
					$('[data-content-mode="emd"]').show();
					$('[data-content-mode="floor"]').hide();
					break;
				case '#tab02':
					isTabidx = '2';
					$('[data-content-mode="emd"]').hide();
					$('[data-content-mode="floor"]').show();
					break;
			}
			setData();
			setTimeout(function() {
				KTApp.unblockPage();
			}, 1000);
			/*
			prevArea = {
				sidonm: '',
				wideareanm: '',
				areanm: ''
			};
			*/
			if(!isfirst){
				$('.btnSearchAreaOk').click();
			} else {
				isfirst = true;
			}	
		});
		
		$listSidoArea.on('click', '[data-list-addr-sidonm]', function() {
			var $this = $(this),
				sidonm = $this.attr('data-list-addr-sidonm');
			
			if (prevArea.sidonm === sidonm) {
				return;
			}
			
			if(_isDemo && _DemoSidonm != sidonm) {
				z.msg(_DemoMsgX);
				return false;
			}

			$listSidoArea.find('a').removeClass('active');
			$this.addClass('active');
			fnUpdateWideAreaList(sidonm, "");
		});
		
		
		$listWideArea.on('click', '[data-list-addr-wideareanm]', function() {
			var $this = $(this),
				sidonm = $this.attr('data-list-addr-sidonm'),
				wideareanm = $this.attr('data-list-addr-wideareanm');
			
			// 전체 클릭 시			
			if (prevArea.wideareanm === wideareanm) {
				return;
			} 
			
			/* 
			if(_isDemo && _DemoSggnm != wideareanm) {
				z.msg(_DemoMsgX);
				return false;
			}
			*/
			
			$listWideArea.find('a').removeClass('active');
			$this.addClass('active');
			
			fnUpdateAreaList(sidonm, wideareanm, "", "");
		});	
		
		$listArea.on('click', '[data-list-addr-areanm]', function() {
			var $this = $(this);
			
			var sidonm = $this.attr('data-list-addr-sidonm'),
				wideareanm = $this.attr('data-list-addr-wideareanm'),
				areanm = $this.attr('data-list-addr-areanm');			
			
			// 전체 클릭 시			
			if (prevArea.areanm === areanm) {
				return;
			} 
			
			$listArea.find('a').removeClass('active');
			$this.addClass('active');
			
			prevArea.areanm = areanm;
			$spanAreaNm.text(areanm);
		});	
	};
	
	var setData = function(){		
	    var self = this;
		fnUpdateSidoList("").done(function() {
			loaded.resolve();
		}); 
	}; 
	
	var fnListPrivate = function(lvl, jsonText) {
		var queryName;
		switch(lvl){
			case 1: 
				queryName = (isTabidx=="1"?"selectSidoText":"selectSidoFloorText");
			break;
			case 2:
				queryName = (isTabidx=="1"?"selectWideAreaText":"selectWideAreaFloorText");
			break;
			case 3:
				queryName = (isTabidx=="1"?"selectAreaText":"selectAreaFloorText");
			break;
		}
		return z.xAsync('publicData', queryName, 'select', jsonText, 'json').done(function(resp){});
	};
	
	// 처음 한번만 호출되긴 함
	var fnUpdateSidoList = function(sidonm) {
		/*
		if (sidoArr) {
			return $.Deferred().resolve({response: sidoArr});
		}
		*/
		return fnListPrivate(1, {
		}).done(function(resp) {			
			sidoArr = resp;
			var sidoArrList = JSON.parse(JSON.stringify(sidoArr));
			var sidoArrall = {'지역코드': '', '지역' : '전체'}
			sidoArrList.unshift(sidoArrall);
			
			var	$list = $listSidoArea.children('ul');
			
			$list.append(tmplArea({sidoArr: sidoArrList}));
			if(sidonm === ""){
				sidonm = sidoArrList[1].지역;
				fnUpdateWideAreaList(sidonm, "");
			}		
			$list.find('a').removeClass('active');
			$list.find('[data-list-addr-sidonm="' + sidonm + '"]').addClass('active');
		});
	};	   
	
	var fnUpdateWideAreaList = function(sidonm, wideareanm) {		
		if (prevArea.wideareanm === wideareanm && prevArea.sidonm === sidonm) {
			return $.Deferred().resolve({});
		}
		prevArea.sidonm = sidonm;
		$spanSidoNm.text(sidonm);
		
		return fnListPrivate(2, {
			sidonm: sidonm
		}).done(function(resp) {	
			wideAreaArr = resp;
			var wideAreaArrList = JSON.parse(JSON.stringify(wideAreaArr));
			var wideareaall = {'지역' : sidonm, '광역상권' : '전체'} 
			wideAreaArrList.unshift(wideareaall);
			
			var	$list = $listWideArea.children('ul');
			
			// 동 정보도 삭제
			$listArea.children('ul').children(':not(.all-item)').remove();
			
			$list.children(':not(.all-item)').remove();
			
			$list.append(tmplArea({wideAreaArr: wideAreaArrList}));	
			if(wideareanm === ""){
				wideareanm = wideAreaArrList[0].광역상권;
				fnUpdateAreaList(sidonm, wideareanm, "");
			}			
			$list.find('[data-list-addr-wideareanm ="' + wideareanm + '"]').addClass('active');
		});
	};
	
	var fnUpdateAreaList = function(sidonm, wideareanm, areanm) {	
		if (prevArea.wideareanm === wideareanm && prevArea.areanm === areanm) {
			return $.Deferred().resolve({});
		}
		prevArea.wideareanm = wideareanm;
		
		$spanWideAreaNm.text(wideareanm);
		
		var	$list = $listArea.children('ul');
		
		return fnListPrivate(3, {
			sidonm: sidonm,
			wideareanm: wideareanm
		}).done(function(resp) {
			areaArr = resp;
			var areaArrList = JSON.parse(JSON.stringify(areaArr));
			var areaall = {'지역' : sidonm, '광역상권' : wideareanm, '하위상권' : '전체'}  
				
			areaArrList.unshift(areaall);
			
			$list.children(':not(.all-item)').remove();
			
			$list.append(tmplArea({areaArr: areaArrList}));
			
			if(areanm === ""){
				areanm = areaArrList[0].하위상권; 
				prevArea.areanm = areanm;
				$spanAreaNm.text(areanm);
				if(isfirst){
					$('.btnSearchAreaOk').click();
					isfirst = false;
				} 
			}	
			$list.find('[data-list-addr-areanm="' + areanm + '"]').addClass('active');
		});			
	};
	
    return { // Public functions
        init: function(options) {  
			// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
    		$btnSearchArea = options.btnSearchArea;
			$btnSearchAreaSpan = options.btnSearchAreaSpan;
			areaCdListener = options.areaCdListener;
			setBtnListener();
			setData();
			KTApp.init();
        },
    	
    	getDongArr: function() {
			return $.extend(true, [], dongArr);
		},

		getSggArr: function() {
			return $.extend(true, [], sggArr);
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
	//apiSearchPublicMap.init();
});
