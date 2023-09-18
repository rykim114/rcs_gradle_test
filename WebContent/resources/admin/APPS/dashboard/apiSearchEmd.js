'use strict';
// Class definition

var apiSearchEmd = function() {
    // Private functions
	var $addrSearchWrapper,
		$bizdistSearchWrapper,
		$btnShowAddr,
		$btnShowBizdist,
		$bizdistSearchText,
		$addrSearchText,
		$listSido,
		$listSgg,
		$listDong,
		$listSidoBizdist,
		$listSggBizdist,
		$listBizdist,
		acArr = [],
		acBizdistArr = [],
		sidoArr = null,
		sggArr = null,
		dongArr = null,
		bizdistArr = null,
		btnTag = null,
		prevAddr = {
			sidonm: '',
			sggnm: '',
			dongnm: ''
		},
		prevBizdist = {
			sidonm: '',
			sggnm: '',
			dongnm: '',
			bizdistnm: '',
			bizdistAdmCd: ''
		},
		isSyncSgg = false,
		isNotNeedSyncSgg = false,
		contentMode = 'emd',
		dongCdListener,
		loaded = $.Deferred();

	var setBtnListener = function() {

		if ($btnShowAddr) {
//			$btnShowAddr.click(function() {
//				$btnShowAddr.tab('show');
//				$bizdistSearchWrapper.hide();
//				$addrSearchWrapper.show();
				
//				$btnShowAddr.addClass('btn-danger');
//				$btnShowAddr.removeClass('btn-outline-secondary');
//				$btnShowBizdist.removeClass('btn-danger');
//				$btnShowBizdist.addClass('btn-outline-secondary');
//			});

//			$btnShowBizdist.click(function() {
//				$btnShowBizdist.tab('show');
//				$addrSearchWrapper.hide();
//				$bizdistSearchWrapper.show();
				
//				$btnShowAddr.removeClass('btn-danger');
//				$btnShowAddr.addClass('btn-outline-secondary');
//				$btnShowBizdist.addClass('btn-danger');
//				$btnShowBizdist.removeClass('btn-outline-secondary');
				
//			});

			$btnShowAddr.click(function() {
				contentMode = 'emd';
				$listDong.closest('.fixedWrap').show();
				$('[data-wrapper="searchDetail"]').detach().appendTo('[data-search-mode=emd]');

				// 성능 이슈 보완을 위해서 hide > append > show 로 수정
				KTApp.blockPage({message: '잠시 기다려 주십시오'});
				$('#table_5_1').hide();
				$('.detailContent').detach().appendTo('[data-content-mode=emd]');
				setTimeout(function() {
					KTApp.unblockPage();
					$('#table_5_1').show();
				}, 1000);
			});
			
			$btnShowBizdist.click(function() {
				contentMode = 'bizdist';
				$listDong.closest('.fixedWrap').hide();
				$('[data-wrapper="searchDetail"]').detach().appendTo('[data-search-mode=bizdist]');

				// 성능 이슈 보완을 위해서 hide > append > show 로 수정
				KTApp.blockPage({message: '잠시 기다려 주십시오'});
				$('#table_5_1').hide();
				$('.detailContent').detach().appendTo('[data-content-mode=bizdist]');
				setTimeout(function() {
					KTApp.unblockPage();
					$('#table_5_1').show();
				}, 1000);
			});

	
			$bizdistSearchText.typeahead({
				hint: true,
				highlight: true,
				minLength: 2
			}, {
				limit: 100,
				source: fnBizdistSearch
			});
			
			$bizdistSearchText.attr('data-placeholder', '예) 홍대입구, 가로수길, 샤로수길');

			$bizdistSearchText.on('typeahead:select', function(evt, selected) {
				fnUpdateBizdistTextSelected(selected);
			});
			
			$bizdistSearchText.focus(function() {
				$bizdistSearchText.select();
				$bizdistSearchText.attr('placeholder', '');
			});
			
			$bizdistSearchText.blur(function() {
				$bizdistSearchText.attr('placeholder', $addrSearchText.attr('data-placeholder'));
			});
		
		}
		
		
		$addrSearchText.typeahead({
			hint: true,
			highlight: true,
			minLength: 2
		}, {
			limit: 100,
			source: fnAddrSearch
		});
		
		$addrSearchText.attr('data-placeholder', '예) 대전, 강원도, 강남구, 보령시');
		
		$addrSearchText.on('typeahead:select', function(evt, selected) {
			fnUpdateAddrTextSelected(selected);
		});
		
		$addrSearchText.focus(function() {
			$addrSearchText.select();
			$addrSearchText.attr('placeholder', '');
		});
		
		$addrSearchText.blur(function() {
			$addrSearchText.attr('placeholder', $addrSearchText.attr('data-placeholder'));
		});
		
		$listSido.change(function() {
			if(_isDemo && _DemoSidonm != $(this).val()) {
				z.msg(_DemoMsgX);
				$(this).val(_DemoSidonm).selectpicker('refresh');
				return false;
			}

			prevAddr.sggnm = '';
			fnUpdateSggListAndSelectTotal($(this).val());
		});

		$listSidoBizdist.change(function() {
			if(_isDemo && _DemoSidonm != $(this).val()) {
				z.msg(_DemoMsgX);
				$(this).val(_DemoSidonm).selectpicker('refresh');
				return false;
			}

			prevBizdist.sggnm = '';
			fnUpdateSggListAndSelectTotal($(this).val(), false, true);
		});
		
		$listSgg.change(function() {
			var sgg = $(this).val();			
			if(_isDemo && _DemoSggnm != $(this).val()) {
				z.msg(_DemoMsgX);
				$(this).val(_DemoSggnm).selectpicker('refresh');
				return false;
			}
			
			if (isSyncSgg) {
				isSyncSgg = false;

				if (! sgg) {
					prevAddr.sggnm = '';
					fnUpdateSggList($listSido.val(), false);
				} else {
					$('[data-select-sgg] [data-sgg-nm]').text(sgg);
					fnUpdateDongList(sgg, true);
				}				
			} else {
				if (! isNotNeedSyncSgg) {
					isSyncSgg = true;
				}

				$listSggBizdist.val(sgg || '').change().selectpicker('refresh');

				if (! sgg) {
					prevAddr.sggnm = '';
					fnUpdateSggListAndSelectTotal($listSido.val(), true);
				} else {
					fnUpdateDongListAndSelectTotal(sgg, true);
				}
			}
		});

		$listSggBizdist.change(function() {
			var sgg = $(this).val(),
				admCd = $(this).children(':selected').attr('data-adm-cd');
			
			if(_isDemo && _DemoSggnm != $(this).val()) {
				z.msg(_DemoMsgX);
				$(this).val(_DemoSggnm).selectpicker('refresh');
				return false;
			}

			if (isSyncSgg) {
				isSyncSgg = false;

				if (! sgg) {
					prevBizdist.sggnm = '';
					fnUpdateSggList($listSidoBizdist.val(), false, true);
				} else {
					fnUpdateBizdistList({
						sggnm: sgg,
						adm_cd: admCd
					}, true);
				}
			} else {
				isSyncSgg = true;
				$listSgg.val(sgg || '').change().selectpicker('refresh');

				if (! sgg) {
					prevBizdist.sggnm = '';
					fnUpdateSggListAndSelectTotal($listSidoBizdist.val(), true, true);
				} else {
	//				fnUpdateDongList(sgg, true);
					fnUpdateBizdistList({
						sggnm: sgg,
						adm_cd: admCd
					}, true);
				}
			}
		});
		
		$listDong.on('click', '[data-dong-cd]', function() {
			fnChangeDong($(this));
		});
		
		$listBizdist.change(function() {
			var bizdistnm = $(this).val(),
				$selected = $(this).children(':selected');
				
//			if (bizdistnm && prevBizdist.bizdistnm !== bizdistnm) {
			if (bizdistnm) {
				prevBizdist.bizdistnm = bizdistnm;
				prevBizdist.bizdistAdmCd = $selected.attr('data-adm-cd');
				
				fnChangeDong(null, $selected);
			}
		});
		 
		fnUpdateSidoList().done(function() {
			loaded.resolve();
		});

        var scrollHorizon = $listDong.closest('.scrollHorizon').width();

        $listDong.each(function(){
//            var shoppingTypeWidth = $(this).children('li').length * 110;
//            $listDong.css('width', shoppingTypeWidth + 'px');
            var pos = 0;
            
            $listDong.closest('.scrollHorizonWrap').children('a').click(function(){

				var shoppingTypeWidth = $listDong.width();
				
                if($(this).hasClass('right')) {
                    if(pos > scrollHorizon - shoppingTypeWidth){
                        pos -= 110;
                        $listDong.animate({'left' : pos + 'px'}, 200);
                    }
                }else if($(this).hasClass('left')){
                    if(pos < 0){
                        pos += 110;
                        $listDong.animate({'left': pos + 'px'}, 200);
                    }
                }
            })
        })
		
	};

	var fnAddrSearch = function(query, result, resultAsync) {

		if (! Hangul.isCompleteAll(query)) {
			result(acArr);
			return;
		}
		
		z.xAsync('Gis', '주소_검색_시군구', 'select', {sggnm: query}, 'json').done(function(resp) {
			acArr = [];

			if (resp.length && resp[0] && resp[0].sidonm) {
				for (var i in resp) {
					var addr = resp[i];
					
					acArr.push(addr.sidonm + ' > ' + addr.sggnm);
				}
			}

			resultAsync(acArr);			
		});
	};
	
	var fnUpdateAddrTextSelected = function(selected) {
		if (! selected) {
			return;
		}
		
		var idxFirstSpace = selected.indexOf(' > '),
			sidonm = selected.substring(0, idxFirstSpace),
			sggnm = selected.substring(idxFirstSpace + 3);

		prevAddr.sggnm = sggnm;
		
		$addrSearchText.typeahead('val', sggnm);
		
		fnUpdateSggList(sidonm).done(function() {
			$listSido.val(sidonm).change().selectpicker('refresh');
			$listSgg.val(sggnm).change().selectpicker('refresh');
		});
	};


	var fnBizdistSearch = function(query, result, resultAsync) {

		if (! Hangul.isCompleteAll(query)) {
			result(acArr);
			return;
		}
		
		z.xAsync('Gis', '주소_검색_상권명', 'select', {bizdist: query}, 'json').done(function(resp) {
			acArr = [];
			acBizdistArr = resp || [];

			if (resp.length && resp[0] && resp[0].bizdist_nm) {
				for (var i in resp) {
					var addr = resp[i];
					
					acArr.push(addr.sidonm + ' ' + addr.sggnm + ' ' + addr.dongnm + ' > ' + addr.bizdist_nm);
				}
			}

			resultAsync(acArr);			
		});
	};
	

	var fnUpdateBizdistTextSelected = function(selected) {
		if (! selected) {
			return;
		}

		var selectedObj = null,
			bizdistIdx = selected.indexOf(' > '),
			bizdistNm = selected.substring(bizdistIdx + 3);

		for (var i in acBizdistArr) {
			if (acBizdistArr[i].bizdist_nm === bizdistNm) {
				$bizdistSearchText.typeahead('val', bizdistNm);
				
				selectedObj = acBizdistArr[i];
				break;
			}
		}
		
//		adm_cd: "11440120"
//		bizdist_nm: "홍대입구역_1"

		if (selectedObj) {
			fnUpdateSggList(selectedObj.sidonm, true, true).done(function() {
				$listSidoBizdist.val(selectedObj.sidonm).change().selectpicker('refresh');
				$listSggBizdist.val(selectedObj.sggnm).change().selectpicker('refresh');

				fnUpdateBizdistList(selectedObj).done(function() {
					fnChangeDong(null, $listBizdist.children(':selected'));
				});
			});
		}
	};	

	var fnListPrivate = function(jsonText) {
		return $.ajax({
			url: '/api/gis/address.do',
			method: 'GET',
			data: jsonText
		});		
	};
	
	// 처음 한번만 호출되긴 함
	var fnUpdateSidoList = function() {
		if (sidoArr) {
			return $.Deferred().resolve({response: sidoArr});
		}
		
		return fnListPrivate({
		}).done(function(resp) {

			sidoArr = resp.response;

			$listSido.html('').append($('<option/>', {value: '', text: '시, 도'}));
			$listSidoBizdist.html('').append($('<option/>', {value: '', text: '시, 도'}));

			for (var i in sidoArr) {
				var sido = sidoArr[i],
					$opt = $('<option/>', {text: sido.sidonm, 'data-adm-cd': sido.adm_cd});
					
				$listSido.append($opt);
				$listSidoBizdist.append($opt.clone());
			}
			
			$listSido.selectpicker('refresh');
			$listSidoBizdist.selectpicker('refresh');
			
			if (! $listSido.val()) {
				$listSgg.val('');
				$listSgg.selectpicker('refresh');
			} else if (sidoArr.length) {
				fnUpdateSggList(sidoArr[0].sidonm);
			}
		});
	};


	var fnUpdateSggList = function(sidonm, isReloadSgg, isBizdist) {
		var prevAddress = prevAddr,
			$listArr = [$listSgg, $listSggBizdist];
			
		if (isBizdist) {
			prevAddress = prevBizdist;
//			$listArr.shift();
		}
			
		if (prevAddress.sidonm === sidonm && ! isReloadSgg) {
			return $.Deferred().resolve({});
		}

		prevAddr.sidonm = prevBizdist.sidonm = sidonm;
		
//		var sggnm = prevAddress.sggnm;
		var sggnm = prevAddr.sggnm;
		
		return fnListPrivate({
			sidonm: sidonm
		}).done(function(resp) {

			sggArr = resp.response;

			for (var k in $listArr) {
				var $list = $listArr[k];
	
				$list.html('').append($('<option/>', {value: '', text: '전체'}));
				
				for (var i in sggArr) {
					var sgg = sggArr[i],
						$opt = $('<option/>', {text: sgg.sggnm, 'data-adm-cd': sgg.adm_cd});
						
					if (sggnm && sggnm === sgg.sggnm) {
						$opt.prop('selected', true);
					}
						
					$list.append($opt);
				}
	
				$list.selectpicker('refresh');
			}

			if (! prevAddress.sggnm && ! isBizdist) {
				dongArr = [];
				
				$listDong.html('');
				
				// 전체 버튼 추가
				// 시도(2) + 시군구(3) + 읍면동(3) + 리(2) 에서 시군구 까지만
				var isBtn = 'list' !== btnTag,
					textTag = isBtn ? '<span/>' : '<a/>',
					wrapTag = isBtn ? '<button style="padding: 4px; margin-left: 8px; margin-bottom: 8px;" />' : '<li/>',
					$opt = $(textTag, {
						text: '전체'
					});
				
				if (sggArr.length) {
					$opt.attr('data-dong-cd', sggArr[0].adm_cd.substring(0, 2));
				}
				
				$listDong.append($(wrapTag).append($opt));
	
				for (var i in sggArr) {
					var sgg = sggArr[i],
						$opt = $(textTag, {
							'data-dong-cd': sgg.adm_cd.substring(0, 5),
							text: sgg.sggnm,
						});
						
					$listDong.append($(wrapTag).append($opt));
				}

				$listDong.css('width', ($opt.width() + 10) * (sggArr.length + 1));
			}
		});
	};
	
	
	var fnUpdateSggListAndSelectTotal = function(sidonm, isReloadSgg, isBizdist) {
		return fnUpdateSggList(sidonm, isReloadSgg, isBizdist).done(function() {			
			if (! isBizdist) {
				var $btn = $listDong.children(':first-child').children();
	
				$btn.click();
				
				$listSidoBizdist.val(sidonm).change().selectpicker('refresh');
			} else {
				$listBizdist.html('').append($('<option/>', {value: '', text: '상권을 선택해 주세요'}));
				$listBizdist.selectpicker('refresh');
			}
		});
	};
	
	
	var fnUpdateDongList = function(sggnm, isReloadDong) {
		if (prevAddr.sggnm === sggnm && ! isReloadDong) {
			return $.Deferred().resolve({});
		}

		prevAddr.sggnm = sggnm;

		return fnListPrivate({
			sidonm: prevAddr.sidonm,
			sggnm: sggnm
		}).done(function(resp) {

			dongArr = resp.response;
			
			$listDong.html('');
			
			// 전체 버튼 추가
			// 시도(2) + 시군구(3) + 읍면동(3) + 리(2) 에서 시군구 까지만
			var isBtn = 'list' !== btnTag,
				textTag = isBtn ? '<span/>' : '<a/>',
				wrapTag = isBtn ? '<button style="padding: 4px; margin-left: 8px; margin-bottom: 8px;" />' : '<li/>',
				$opt = $(textTag, {
					text: '전체'
				});
			
			if (dongArr.length) {
				$opt.attr('data-dong-cd', dongArr[0].adm_cd.substring(0, 5));
			}
			
			$listDong.append($(wrapTag).append($opt));

			for (var i in dongArr) {
				var dong = dongArr[i],
					$opt = $(textTag, {
						'data-dong-cd': dong.adm_cd,
						text: dong.dongnm
					});
					
				$listDong.append($(wrapTag).append($opt));
			}

			$listDong.css('width', ($opt.width() + 10) * (dongArr.length + 1));
		});
	};
	
	var fnUpdateDongListAndSelectTotal = function(sggnm, isReloadDong) {
		return fnUpdateDongList(sggnm, isReloadDong).done(function() {
			var $btn = $listDong.children(':first-child').children();

			$btn.click();
		});
	};
	
	var fnUpdateBizdistList = function(bizdistObj, isReload) {
		
		if (prevBizdist.bizdistAdmCd === bizdistObj.adm_cd && ! isReload || ! bizdistObj.adm_cd) {
			return $.Deferred().resolve({});
		}
		
//		prevBizdist.sggnm = bizdistObj.sggnm;
		prevAddr.sggnm = prevBizdist.sggnm = bizdistObj.sggnm;
		prevBizdist.bizdistAdmCd = bizdistObj.adm_cd;

		if (bizdistObj.bizdist_nm) {
			prevBizdist.bizdistnm = bizdistObj.bizdist_nm;
		}
		
		
		return z.xAsync('Gis', '주소_검색_상권명', 'select', {admCd: prevBizdist.bizdistAdmCd.substring(0, 5)}, 'json').done(function(resp) {

			$listBizdist.html('').append($('<option/>', {value: '', text: '상권을 선택해 주세요'}));

			for (var i in resp) {
				var bizdist = resp[i],
					$opt = $('<option/>', {
						text: bizdist.bizdist_nm,
						'data-adm-cd': bizdist.adm_cd,
						'data-dongnm': bizdist.dongnm,
						'data-geom': bizdist.geom
					});
					
				if (prevBizdist.bizdistnm === bizdist.bizdist_nm) {
					$opt.prop('selected', true);
//					bizdistArr = [bizdist];
				}
					
				$listBizdist.append($opt);
			}
			
			$listBizdist.selectpicker('refresh');
			
		});
		
	};
	
	var fnChangeDong = function($btn, $bizdist) {
		if (! dongCdListener) {
			return;
		}
		
		var param = $.extend(true, {}, prevAddr);
		
		if ($btn) {
			param.dongCd = $btn.attr('data-dong-cd');
			param.dongnm = $btn.text();
			param.isBizdist = false;
			
			var $wrap = $btn.parent('li');
				
			$wrap.siblings('li').removeClass('on');
			$wrap.addClass('on');
			
		} else {
			param = $.extend(true, {}, prevBizdist);
			
			param.isBizdist = true;
			param.bizdistGeom = $bizdist.attr('data-geom');
			
			var $biz = $bizdistSearchWrapper.find('[name=listBizdistDong]');
			
			$biz.html($('<option/>', {text: $bizdist.attr('data-dongnm')}));
			$biz.selectpicker('refresh');
		}
		
		// 시/도 or 시군구 or 읍면동 모드 판별
		if (! sggArr || ! sggArr.length || 3 > (param.dongCd && param.dongCd.length)) {
			param.jusoCd = 'sido';
		} else if (! dongArr || ! dongArr.length) {
			param.jusoCd = 'sgg';
		} else {
			param.jusoCd = 'emd';
		}

		dongCdListener(param);

		z.addEmdSearchLog(param);
	};

    return {
        // Public functions
        init: function(options) {
			if (options.addrSearchWrapper) {
				$addrSearchWrapper = options.addrSearchWrapper;
				$bizdistSearchWrapper = options.bizdistSearchWrapper;
				$btnShowAddr = options.btnShowAddr;
				$btnShowBizdist = options.btnShowBizdist;
				$bizdistSearchText = options.bizdistSearchText;
			}

			$addrSearchText = options.addrSearchText;
			$listSido = options.listSido;
			$listSgg = options.listSgg;
			$listDong = options.listDong;
			$listSidoBizdist = options.listSidoBizdist;
			$listSggBizdist = options.listSggBizdist;
			$listBizdist = options.listBizdist;
			btnTag = options.btnTag;
			dongCdListener = options.dongCdListener;
			isNotNeedSyncSgg = options.isNotNeedSyncSgg;

			if ($listSggBizdist) {
				$listSggBizdist.selectpicker('refresh');			
			}
			if ($listBizdist) {
				$listBizdist.selectpicker('refresh');
			}
			setBtnListener();

			if (! options.isCustomAddress) {
				this.setAddress();
			}
			
			KTApp.init();
        },

		setDongCdListener: function(callback) {
			dongCdListener = callback;
		},
		
		getDongArr: function() {
			return $.extend(true, [], dongArr);
		},

		getSggArr: function() {
			return $.extend(true, [], sggArr);
		},
		
		getBizdistArr: function() {
			return $.extend(true, [], [prevBizdist]);
		},

		getContentMode: function() {
			return contentMode;
		},
		
		setAddress: function(sido, sgg, dong) {
			sido = sido || '서울특별시';
			sgg = sgg || '강남구';
			dong = dong || '전체';
			
			prevAddr.sggnm = sgg;

			loaded.done(function() {
				fnUpdateSggList(sido).done(function() {
					$listSido.val(sido).change().selectpicker('refresh');
					
					fnUpdateDongList(sgg).done(function() {
						var $btn = $listDong.find('a:contains("' + dong + '")');

						if (! $btn.length) {
							$btn = $listDong.children(':first-child a');
						}

						$btn.click();
					});

					fnUpdateBizdistList({
						sggnm: sgg,
						adm_cd: $listSggBizdist.find(':selected').attr('data-adm-cd')
					}, true);
				});
			});
		},
		
		addDownloadLog: function(downNm, downType) {
			return z.addDownloadLog(downNm, downType);
		}
		
    };
}();
