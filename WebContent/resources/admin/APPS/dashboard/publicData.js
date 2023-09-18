'use strict';
// Class definition
var apiSearchEmd;
var excelyn;
var apiPublicData = function() {
	var sanggaTypeArr = [
		'집합_상가',
		'중대형_상가',
		'소규모_상가',
		'오피스'
	];
	
	var  gbnTypeArr = [
		'효용비율',
		'임대료'
	];
	
	var resultTypeArr = [
		'공실률',
		'전환률',
		'투자수익률',
		'소득수익률',
		'자본수익률'
	];
	
	var resultTypeArr2 = [
		'B1F',
		'1F',
		'2F',
		'3F',
		'4F',
		'5F',
		'6F_10F',
		'11F'
	];
	
    // Private functions
	// 추이 데이터
	var tablePublicData = {
		init: function(param, searchDtl) {
			var self = this;
			self.param = param;
			self.searchDtl = searchDtl;
			self.$table = $('#table_1_1');
			self.$table2 = $('#table_2_1');
			self.$thead = self.$table.find('thead');
			self.$thead2 = self.$table2.find('thead');
			self.$tbody = $('#tbody_1_1').html('');
			self.$tbody2 = $('#tbody_2_1').html('');
			self.$wrapper = self.$tbody.closest('[data-table-wrapper]');
			
			if (self.searchDtl && self.searchDtl.checkSanggaType.length) {
				self.param.sanggaArr = $.extend(true, [], self.searchDtl.checkSanggaType);
			} else {
				self.param.sanggaArr = $.extend(true, [], sanggaTypeArr);
			}
			
			if (self.searchDtl && self.searchDtl.startYMD) {
				self.param.startYMD = self.searchDtl.startYMD;
				self.param.endYMD = self.searchDtl.endYMD;
				self.param.pastYMD = self.searchDtl.pastYMD;
			}
			
			self.setBtnListener();

			self.loadData().done(function(resp) {
				if(self.param.tabidx=="1"){
					self.updateDataBySanggaType();
					self.updateData();
				} else {
					self.updateDataByFloorType();
					self.updateDataFloor();
				}	
			});
		},	

		setBtnListener: function() {
			var self=this;
			self.$wrapper = self.$tbody.closest('[data-table-wrapper]');
		
			self.$wrapper.find('.allView2').off('click').on('click', function() {
				tableaverageTradingDetail.openAllView();
			});
		},	

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,		
				param = self.param;
			return $.when(
				z.xAsync('publicData', (param.tabidx=="1"?'상업용_통계':'상업용_층별통계'), 'select', param, 'json'),
				z.xAsync('publicData', (param.tabidx=="1"?'상업용_상권':'상업용_층별상권'), 'select', param, 'array'),
				z.xAsync('publicData', (param.tabidx=="1"?'상업용_시점':'상업용_층별시점'), 'select', param, 'array')
			).done(function(resp, respBizdist, respPeriod) {
				self.rawDataArr = resp;
				self.bizdistArr = [];
				self.periodArr = [];
				for(var i=0; i<respBizdist.length; i++) {
					for(var j=0; j<respBizdist[i].length; j++) {
						self.bizdistArr.push(respBizdist[i][j]);
					}
				}    
				for(var i=0; i<respPeriod.length; i++) {
					for(var j=0; j<respPeriod[i].length; j++) {
						self.periodArr.push(respPeriod[i][j]);
					}
				}   
			});
		},	
		
		updateDataBySanggaType: function() {
			var self = this,
				searchDtl = self.searchDtl,
				rawDataArr = self.rawDataArr,
				sanggaArr = self.param.sanggaArr,
				bizdistArr = self.bizdistArr,
				periodArr = self.periodArr,
				param = self.param,
				resultArr = [];
			
			if(rawDataArr.length == 0) return; 
			
			var period = self.rawDataArr[0].시점건수;
			var row = {
				sidonm: '',
				wideareanm: '',
				areanm: '',
				data: Array.apply(null, Array(sanggaArr.length)).map(function() {
					return Array.apply(null, Array(resultTypeArr.length * periodArr.length)).map(function() {return 0;});
				})
			};
						
			for(var i in bizdistArr){
				var rowData = $.extend(true, {}, row);
				rowData.sidonm = JSON.stringify(bizdistArr[i]).split('-')[0].replace(/\"/gi, "");
				rowData.wideareanm = JSON.stringify(bizdistArr[i]).split('-')[1].replace(/\"/gi, "");
				rowData.areanm = JSON.stringify(bizdistArr[i]).split('-')[2].replace(/\"/gi, "");
				resultArr.push(rowData);
			}	 
			
			// 2. 1번 형식대로 데이터 입력
			for (var i in rawDataArr) {
				var rawData = rawDataArr[i],
					idxBizdist = bizdistArr.indexOf(rawData.상권명),
					idxSangga = sanggaArr.indexOf(rawData.유형),
					idxPeriod = periodArr.indexOf(rawData.시점),
					idxResult = resultTypeArr.indexOf(rawData.구분);
				
				// 미포함 데이터 제외
				if (0 > idxBizdist || 0 > idxSangga || 0 > idxPeriod || 0 >idxResult) {
					continue;
				}
				var bizdistData = resultArr[idxBizdist];
				var period = (idxPeriod * resultTypeArr.length) + idxResult   
				bizdistData.data[idxSangga][period] = (rawData.비율 ==0?'-':parseFloat(rawData.비율)); 
			}			
			self.resultArr = resultArr;	
		},			
				
		updateData: function() {					
			var self = this,
				columnMode = self.columnMode,
				tmpl = Handlebars.compile($('#tmplTablepublicData').html()),
				$tr = self.$thead.find('tr:first-child'),
				$tr2 = self.$thead.find('tr:nth-child(2)'),
				periodArr = self.periodArr,
				sanggaArr = self.param.sanggaArr;

			$tr.find('th[colspan="' + resultTypeArr.length + '"].period').remove();
			$tr2.find('th[rowspan="1"]').remove();
			
			for (var i = 0; i < periodArr.length; i++) {
				var $th = $('<th/>', {class : 'period', colspan: resultTypeArr.length, text: periodArr[i].substr(0, 4) +'년 ' + periodArr[i].substr(5, 1) + '분기'});
				$tr.append($th);
				for (var j = 0; j < resultTypeArr.length; j++) {
					var $th2 = $('<th/>', {rowspan: '1', text: resultTypeArr[j]});
					$tr2.append($th2);
				}
			}
			
			Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
			    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
			});
			
			self.$tbody.html('').append(tmpl({dataArr: self.resultArr
											, sanggaRowspan: sanggaArr.length
				                            , sanggaArr: sanggaArr }));
			
			//$('#tbody_5_1 .maintotal').click();
		},
		
		updateDataByFloorType: function() {
			var self = this,
				searchDtl = self.searchDtl,
				rawDataArr = self.rawDataArr,
				sanggaArr = self.param.sanggaArr,
				bizdistArr = self.bizdistArr,
				periodArr = self.periodArr,
				param = self.param,
				resultArr = [];
			
			if(rawDataArr.length == 0) return; 
			
			var period = self.rawDataArr[0].시점건수;
			var row = {
				sidonm: '',
				wideareanm: '',
				areanm: '',
				sanggaData : []
			};
						
			for(var i in bizdistArr){
				var rowData = $.extend(true, {}, row);
				rowData.sidonm = JSON.stringify(bizdistArr[i]).split('-')[0].replace(/\"/gi, "");
				rowData.wideareanm = JSON.stringify(bizdistArr[i]).split('-')[1].replace(/\"/gi, "");
				rowData.areanm = JSON.stringify(bizdistArr[i]).split('-')[2].replace(/\"/gi, "");
				for (var j in sanggaTypeArr) {		
					rowData.sanggaData.push({						
						data: Array.apply(null, Array(gbnTypeArr.length)).map(function() {
							return Array.apply(null, Array(resultTypeArr2.length * periodArr.length)).map(function() {return 0;});
						})
					})
				}	
				resultArr.push(rowData);
			}	 
			
			// 2. 1번 형식대로 데이터 입력
			for (var i in rawDataArr) {
				var rawData = rawDataArr[i],
					idxBizdist = bizdistArr.indexOf(rawData.상권명),
					idxSangga = sanggaArr.indexOf(rawData.유형),
					idxPeriod = periodArr.indexOf(rawData.시점),
					idxGbn = gbnTypeArr.indexOf(rawData.구분);
				
				// 미포함 데이터 제외
				if (0 > idxBizdist || 0 > idxSangga || 0 > idxPeriod || 0 >idxGbn) {
					continue;
				}
				var bizdistData = resultArr[idxBizdist];
				var period = (idxPeriod * resultTypeArr2.length); 
				bizdistData.sanggaData[idxSangga].data[idxGbn][period] = (rawData.비율_b1f ==0?'-':parseFloat(rawData.비율_b1f)); 
				bizdistData.sanggaData[idxSangga].data[idxGbn][period + 1] = (rawData.비율_1f ==0?'-':parseFloat(rawData.비율_1f));
				bizdistData.sanggaData[idxSangga].data[idxGbn][period + 2] = (rawData.비율_2f ==0?'-':parseFloat(rawData.비율_2f));
				bizdistData.sanggaData[idxSangga].data[idxGbn][period + 3] = (rawData.비율_3f ==0?'-':parseFloat(rawData.비율_3f));
				bizdistData.sanggaData[idxSangga].data[idxGbn][period + 4] = (rawData.비율_4f ==0?'-':parseFloat(rawData.비율_4f));
				bizdistData.sanggaData[idxSangga].data[idxGbn][period + 5] = (rawData.비율_5f ==0?'-':parseFloat(rawData.비율_5f));
				bizdistData.sanggaData[idxSangga].data[idxGbn][period + 6] = (rawData.비율_6_10f ==0?'-':parseFloat(rawData.비율_6_10f));
				bizdistData.sanggaData[idxSangga].data[idxGbn][period + 7] = (rawData.비율_11f이상 ==0?'-':parseFloat(rawData.비율_11f이상));
			}			
			self.resultArr = resultArr;	
		},			
				
		updateDataFloor: function() {					
			var self = this,
				columnMode = self.columnMode,
				tmpl = Handlebars.compile($('#tmplTablepublicData2').html()),
				$tr = self.$thead2.find('tr:first-child'),
				$tr2 = self.$thead2.find('tr:nth-child(2)'),
				periodArr = self.periodArr,
				sanggaArr = self.param.sanggaArr;

			$tr.find('th[colspan="8"]').remove();
			$tr2.find('th[rowspan="1"]').remove();
			
			for (var i = 0; i < periodArr.length; i++) {
				var $th = $('<th/>', {colspan: resultTypeArr2.length, text: periodArr[i].substr(0, 4) +'년 ' + periodArr[i].substr(5, 1) + '분기'});
				$tr.append($th);
				for (var j = 0; j < resultTypeArr2.length; j++) {
					var $th2 = $('<th/>', {rowspan: '1', text: resultTypeArr2[j]});
					$tr2.append($th2);
				}
			}
			
			Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
			    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
			});
			
			self.$tbody2.html('').append(tmpl({dataArr: self.resultArr
											, sanggaRowspan: sanggaArr.length
				                            , sanggaArr: sanggaArr
				                            , gbnTypeArr : gbnTypeArr}));
			
			//$('#tbody_5_1 .maintotal').click();
		},
		
		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
				periodArr = self.periodArr;
			
			setTimeout(function() {
				if(self.param.tabidx == "1"){
					var $table = self.$tbody.closest('table');
				} else {
					var $table = self.$tbody2.closest('table');
				}
				
				var wsBody = XLSX.utils.table_to_sheet($table[0], {
					display: true
				});
				
				var jsonBody = XLSX.utils.sheet_to_json(wsBody, {header: 1});

//				var jsonMerge = jsonHeader.concat(jsonBody);
				var jsonMerge = jsonBody;
				
				for (var i in jsonBody) {
					if(i > 0) continue;
					var row = jsonBody[i];			
					for(var j=0; j < row.length; j++){
						if(row[j] == undefined){
							row[j] = '';
						}
					}
				}
				
				var wsJson = [];
				for (var i in jsonBody) {
					var row = jsonBody[i];
					
					if (row.length > 0) {
						wsJson.push(row)
					} 
				}
				
				var ws = XLSX.utils.json_to_sheet(wsJson, {skipHeader: true});	         

				result.resolve(ws);	
				if(self.param.tabidx=="1"){
					apiSearchEmd.addDownloadLog('공공_데이터');		
				} else {
					apiSearchEmd.addDownloadLog('공공_층별데이터');	
				}	
			});

			return result;
		}		
	};
	
	return {
        // Public functions
        init: function() {
			var self = this;			
			self.setBtnListener();
        },
		setBtnListener: function() {
			var self = this;
			$('[data-btn-download="table_1_1"]').click(function() {
				if(_isDemo) {
					z.msg(_DemoMsgDownloadX);
					return;
				}
				
				if(excelyn == "N"){
					z.msg(_NoPemissionMsgDownloadX);
					return;
				}

				$.when(
						tablePublicData.exportSheet()
				).done(function(workSheet) {

					var wb = XLSX.utils.book_new();
					
					XLSX.utils.book_append_sheet(wb, workSheet, '공공데이터');

					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_공공데이터.xlsx');					
				});
			});
			
			$('[data-btn-download="table_2_1"]').click(function() {
				if(_isDemo) {
					z.msg(_DemoMsgDownloadX);
					return;
				}
				
				if(excelyn == "N"){
					z.msg(_NoPemissionMsgDownloadX);
					return;
				}

				$.when(
						tablePublicData.exportSheet()
				).done(function(workSheet) {

					var wb = XLSX.utils.book_new();
					
					XLSX.utils.book_append_sheet(wb, workSheet, '공공층별데이터');

					XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_공공층별데이터.xlsx');					
				});
			});
			
			/* 추이클릭시 펼치기/닫기(지역별 평균 분양가) */ 
			$('#tbody_5_1').on('click', '.maintotal', function() {
				var dong = $(this).attr('data-dong');
				var sangga = $(this).attr('data-sangga');
				var show = $(this).hasClass('data-show');
				var len = 0;
				var sanggalen = 0;
				var sanggadata = 0;
				var showlen = 0;
								
				$('#tbody_5_1 tr').each(function(index, item){
					if($(item).attr('data-dong') === dong){
						len++;
						if($(this).hasClass('subtotal')){
							sanggalen++;
						}
						if($(this).hasClass('subdata') && $(this).hasClass('data-show')){
							sanggadata++;
						}
						if($(this).hasClass('data-show')){
							showlen++;
						}
					} 
				});
				
				if(show){//숨기기
					$('#tbody_5_1 tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){
							//if($(item).children().eq(0).attr('rowspan') == len || $(item).children().eq(0).attr('rowspan') == sanggalen+1){
							$(item).children().eq(0).attr('rowspan','1');
							//}	
							$(item).not('.maintotal').hide();
							$(item).removeClass('data-show').addClass('data-hide');
							$(item).removeClass('data-s-show').addClass('data-s-hide');
						}
					});		
				} else {//보이기
					$('#tbody_5_1 tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){
							if($(item).hasClass('maintotal')){
								if($(item).children().eq(0).attr('rowspan') == '1'){
									$(item).children().eq(0).attr('rowspan', sanggalen + 1);
								};
								$(item).removeClass('data-hide').addClass('data-show');
							}
							if($(item).hasClass('subtotal')){
								$(item).children().eq(0).attr('rowspan', '1');
								$(item).show();
								$(item).removeClass('data-hide').addClass('data-show');
							}
							$(item).removeClass('data-s-show').addClass('data-s-hide');
						}
					});	
				}	
			});	
			
			/* 추이클릭시 펼치기/닫기(상가유형별 평균 분양가) */ 
			$('#tbody_5_1').on('click', '.subtotal', function() {
				var dong = $(this).attr('data-dong');
				var sangga = $(this).attr('data-sangga');
				var show = $(this).hasClass('data-s-show');
				var len = 0;
				var sanggalen = 0;
				var sanggadata = 0;
				
				$('#tbody_5_1 tr').each(function(index, item){
					if($(item).attr('data-dong') === dong && $(this).hasClass('data-show')){
						len++;
					}
					
					if($(item).attr('data-dong') === dong && $(item).attr('data-sangga') === sangga){
						if($(this).hasClass('subtotal')){
							sanggalen++;
						}
						if(show){//상세숨기기
							if($(this).hasClass('subdata') && $(this).hasClass('data-s-show')){
								sanggadata++;
							}
						}else{
							if($(this).hasClass('subdata') && $(this).hasClass('data-s-hide')){
								sanggadata++;
							}
						}
					}
				});
				
				if(show){ // 상세숨기기
					$('#tbody_5_1 tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){//첫번째 rowspan 수정
							if($(item).hasClass('maintotal')){
								if($(item).children().eq(0).attr('rowspan') == len){
									$(item).children().eq(0).attr('rowspan', len - sanggadata ); //전체에서 상가로우데이터 빼면 
								}
							}
						}	
						
						if($(item).attr('data-dong') === dong && $(item).attr('data-sangga') === sangga){
							if($(item).hasClass('subtotal')){
								$(item).children().eq(0).attr('rowspan', '1' );
							} else {
								$(item).hide();
								$(item).removeClass('data-show').addClass('data-hide');
							}
							$(item).removeClass('data-s-show').addClass('data-s-hide');	
						}
					});
					
				} else { // 상세보기
					$('#tbody_5_1 tr').each(function(index, item){
						if($(item).attr('data-dong') === dong){//첫번째 rowspan 수정
							if($(item).hasClass('maintotal')){
								if($(item).children().eq(0).attr('rowspan') == len){
									$(item).children().eq(0).attr('rowspan', len + sanggalen + sanggadata - 1); //자기자신 빼기!
								}
							}
						}	
						
						if($(item).attr('data-dong') === dong && $(item).attr('data-sangga') === sangga){
							if($(item).hasClass('subtotal')){
								if($(item).children().eq(0).attr('rowspan') == '1'){
									$(item).children().eq(0).attr('rowspan', sanggalen + sanggadata );
								}
							}
							$(item).show();
							$(item).removeClass('data-hide').addClass('data-show');
							$(item).removeClass('data-s-hide').addClass('data-s-show');
						}
					});
				}
			});	
		},

		setDongCd: function(param) {
			var searchDtl = apiSearchPublicData.getSearchDtl(param);
			tablePublicData.init(param, searchDtl);
		}
    };
}();

$(function() {
	$.when(
		$.getScript('/resources/admin/APPS/dashboard/apiSearchPublicMap.js'),
		$.getScript('/resources/admin/APPS/dashboard/publicDataSearch.js'),
		$.getScript('/resources/common/custom/js/commonDashboard.js')
	).done(function() {		
		z.xAsync('AdminMain', 'getExcelDown', 'select', {pgmCode:"MA0124"}, 'json').done(function(resp) {
			if(resp[0].excelyn == "N"){
				$("[data-btn-download]").css("display", "none");
			} else {
				$("[data-btn-download]").css("display", "block");
			}
		}); 
		
		apiSearchPublicMap.init({
			btnSearchArea: $('#btnSearchArea'),
			btnSearchAreaSpan: $('#btnSearchArea > span'),
			areaCdListener: apiPublicData.setDongCd
		});
		
		apiSearchEmd = apiSearchPublicMap;
		
		apiSearchPublicData.init({
			btnActivate: $('[data-btn-search-detail]'),
			searchWrapper: $('[data-wrapper="searchDetail"]'),
			searchDateRange: $('[data-wrapper="searchDetail"] [data-search-time]'),
			btnOk: $('[data-wrapper="searchDetail"] [data-btn-ok]'),
			btnClose: $('[data-wrapper="searchDetail"] [data-btn-close]')
		}); 
		
		apiPublicData.init();
	});
	
});
