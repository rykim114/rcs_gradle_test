$(document).ready(function() {	
	/*console.log(store);*/
	z.xAsync("dawul", "zeons_map", "select", {}, "json2").done(function(ls_mapdata ) {
		var tmpl = Handlebars.compile($('#tmplFavoriteList').html());
		
		for (var i in ls_mapdata) {
			var row = ls_mapdata[i];
			
			if ('build' === row['저장유형']) {
				row.isBuild = true;
			}
		}
		
		var $root = $("#save_append").append(tmpl({favoriteArr: ls_mapdata}));
		
		$root.find('li.count span').text(z.toComma((ls_mapdata && ls_mapdata.length)) || 0);
		
		$root.find('[data-btn-dtl]').click(function(evt) {
			var $btn = $(this),
				seq = $btn.attr('data-btn-dtl'),
				dtl = null;

			for (var i in ls_mapdata) {
				if (seq === ls_mapdata[i]['순번']) {
					dtl = ls_mapdata[i];
					break;
				}
			}

			if (dtl) {
				if ('build' === dtl['저장유형']) {
					store.set('GIS_building_favorite', dtl);
					
					// GIS 건물 이동
//					$('#kt_aside_menu #MA03').click();
					window.open('/admin/main/adminMain.do?menuCd=MA0301');
				} else {
					// GIS 블럭 이동
					store.set('GIS_favorite', dtl);
					
//					$('#kt_aside_menu #MA04').click();
					window.open('/admin/main/adminMain.do?menuCd=MA04');
				}
			}
		});
		
		$root.find('[data-btn-fav]').click(function(evt) {
			var $btn = $(this),
				seq = $btn.attr('data-btn-fav');
			
			z.msgYN('북마크를 해제하시겠습니까?', function(res) {
				
				if (res == true) {
					fnDeleteFav(seq, $btn);
				} else {
					return;
				}				
			})	
				
		})
	});
	
})

function fnDeleteFav(seq, btn) {
	var param = {
		'순번': seq
	};

	return z.xAsync("dawul", "deleteFavorite", "update", param, "json2").done(function(resp) {
		if (resp) {
			btn.parent().parent().parent().remove();
			var count = z.xA("dawul", "zeons_map", "select", {}, "json2").length;
			$('.bookmark').find('li.count span').text(z.toComma(count));
		}
		
	});
}
