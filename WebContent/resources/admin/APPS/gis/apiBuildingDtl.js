
var primary = '#6993FF';
var success = '#1BC5BD';
var info = '#8950FC';
var warning = '#FFA800';
var danger = '#F64E60';
var	blockIdArr		=	[];
var	blockBounds		=	[];
var	blockCdArr		=	[];
var	ls_imgsrcArr	=	"";
var	ls_imghtml		=	"";


var apiBuildingDtl = (function() {
	
	var //URL_DAWUL_API = 'https://vapi.dawulmap.com:8443/MapAppServer/DWService',
		$dtlRoot = $('#mapPannel1'),
		$dtlRoot1_2 = $('#mapPannel1_2'),
		$dtlRoot2 = $('#mapPannel2'),
		$btnFavorite = $dtlRoot.find('[data-btn-favorite]'),
		$btnFavorite1_2 = $dtlRoot1_2.find('[data-btn-favorite]'),
		$btnFavorite2 = $dtlRoot2.find('[data-btn-favorite]'),
		$modalFavorite = $('#favModal'),		
		$btnSaveFavorite = $modalFavorite.find('[data-btn-save-favorite]'),
		$dtlScroll = $('#mapPannel1 .ps.scroll');
	
	// FIXME: 상가코드 공통코드화 필요
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
	
	// FIXME: iframe 에서 전환되면 아래의 하드코딩 필요없어짐
	zo.pgmCode = 'MA0301';
	zo.py2m = 3.3058;

	z.getCommCode('100100').done(function(resp) {
		if (! resp || ! resp.length) {
			return;
		}
		
		sanggaTypeMap = resp.reduce(function(acc, cur) {
			acc[cur['공통상세명']] = parseInt(cur['정렬코드']);
			return acc;
		}, {});

		sanggaTypeArr = [];
		
		for (var i in resp) {
			sanggaTypeArr.push(resp[i]['공통상세명']);
		}
	});
	
	// 2022년 업종코드 
	z.getCommCode('100120').done(function(resp) {
		if (! resp || ! resp.length) {
			return;
		}
		
		industryTypeMap_old = resp.reduce(function(acc, cur) {
			acc[cur['공통상세명']] = parseInt(cur['정렬코드']);
			return acc;
		}, {});

		industryTypeArr_old = [];
		
		for (var i in resp) {
			industryTypeArr_old.push(resp[i]['공통상세명']);
		}
	});

	// 2023년 업종코드 
	z.getCommCode('100201').done(function(resp) {
		if (! resp || ! resp.length) {
			return;
		}
		
		industryTypeMap_new = resp.reduce(function(acc, cur) {
			acc[cur['공통상세명']] = parseInt(cur['정렬코드']);
			return acc;
		}, {});

		industryTypeArr_new = [];
		
		for (var i in resp) {
			industryTypeArr_new.push(resp[i]['공통상세명']);
		}
	});

	
	z.getCommCode('100121').done(function(resp) {
		if (! resp || ! resp.length) {
			return;
		}

		industryTypeSKArr = [];
		
		for (var i in resp) {
			industryTypeSKArr.push(resp[i]['공통상세명']);
		}
	});
		
	$btnSaveFavorite.click(function() {
		var $name = $modalFavorite.find('[name="즐겨찾기_제목"]');
		
		$name.val($.trim($name.val()));

		if (! $name[0].checkValidity()) {
			
			$name.addClass('is-invalid');
			return;
		} else {			
			$name.removeClass('is-invalid');
		}

		z.msgConfirm({
			html: '등록 하시겠습니까?'
		}).then(function(result) {
			if (result.isConfirmed) {
				fnUpdateFavorite($name);
			}
		});
	});
	
	// 상가 연면적
	var building_ComplexList_1_1 = {
			
		init: function(ls_pnu) {			
			var self = this;			
			
			$('#tbodyBuildingComplex7').html('');
			$('#tbodyBuildingComplex7_1').html('');
		
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
			param = {					
					pnu: ls_pnu					
				};
						
			return z.xAsync('dawulmap', 'zeons_상가연면적', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;
			});
		},
		
		updateData: function() {
			var self = this,
				$tbody 	= $('#tbodyBuildingComplex7').html(''),
				$tbody2 = $('#tbodyBuildingComplex7_1').html(''),
				tmpl = Handlebars.compile($('#tmplBuildingComplexList7').html());

			$tbody.append(tmpl({zrdArr: self.rawDataArr}));
			$tbody2.append(tmpl({zrdArr: self.rawDataArr}));
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				if(ls_click_name == '분양'){
					var $table = $('#tbodyBuildingComplex7').closest('table');					
				}else{
					var $table = $('#tbodyBuildingComplex7_1').closest('table');
				}
				
				var ws = XLSX.utils.table_to_sheet($table[0], {raw: true, type: 'string'});

				result.resolve(ws);
			});

			return result;
		}
	};
	
	
	// 건축물 현황,물건현황
	var building_ComplexList_1_2 = {		
		init: function(ls_pnu) {
			var self = this;									
			$('#tbodyBuildingComplex1_2').html('');
			
			self.$tbody	=	$('#tbodyBuildingComplex1_2').html('');
		
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
			param = {					
					pnu: ls_pnu					
				};			
						
			return z.xAsync('dawulmap', 'zeons_건축물현황', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서				
				self.rawDataArr = resp;
			});
		},
		
		updateData: function() {
			var self = this,
				$tbody = $('#tbodyBuildingComplex1_2').html(''),							
				$tbody2 = $('#tbodyBuildingComplex1_22').html(''),				
				tmpl = Handlebars.compile($('#tmplBuildingComplexList2').html());
				
				$tbody.append(tmpl({trdArr: self.rawDataArr}));
				$tbody2.append(tmpl({trdArr: self.rawDataArr}));
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = self.$tbody.closest('table');
				var ws = XLSX.utils.table_to_sheet($table[0], {raw: true, type: 'string'});

				result.resolve(ws);
			});

			return result;
		}
	};
	
	// 임대매물정보_동
	var building_ComplexList_1_3 = {		
		init: function(ls_pnu) {
			var self = this;									
			$('#tbodyBuildingComplex2').html('');
			
			self.$tbody	=	$('#tbodyBuildingComplex2').html('');
		
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
				
		loadData: function() {
			var self = this,
			param = {
					sidonm: ls_sidonm,
					sggnm: ls_sggnm,
					dongnm: ls_dongnm,
					pnu: ls_pnu, 
					lat: ls_lat,
					lng: ls_lng,
					ls_article_type_length: ls_article_type_length
				};
						
			return z.xAsync('dawulmap', 'zeons_임대매물정보_동', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서				
				self.rawDataArr = resp,
				self.rawDataArrCopy = [];
				
				self.rawDataArr.filter(function(element, index, array){
					if(index < 30){
						self.rawDataArrCopy.push(element);
					}	
				});

				$('.rent_two [data-cnt-trading]').text('총 ' + z.toComma(self.rawDataArr.length) + ' 건  중 ' + z.toComma(self.rawDataArrCopy.length) + ' 건');
			});
		},
		
		updateData: function() {
			var self = this,
				$tbody = $('#tbodyBuildingComplex2').html(''),				
				tmpl = Handlebars.compile($('#tmplBuildingComplexList3').html());
			$tbody.append(tmpl({urdArr: self.rawDataArrCopy}));
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = self.$tbody.closest('table');
				var ws = XLSX.utils.table_to_sheet($table[0], {raw: true, type: 'string'});
				
				var $header = $table;
	
				var wsHeader = XLSX.utils.table_to_sheet($header[0]);
				var wsBody = XLSX.utils.table_to_sheet($table[0], {raw: true});
				
				var jsonHeader = XLSX.utils.sheet_to_json(wsHeader, {header: 1}).splice(0,1);
				var jsonBody2 = [];
				var row = Array.apply(null, Array(10)).map(function() {return 0;})
				
				
				for (var i in self.rawDataArr ) {
					var rowData = $.extend(true, [], row);
					rowData[0] = self.rawDataArr[i]['건물명'];
					rowData[1] = self.rawDataArr[i]['번지'];
					rowData[2] = self.rawDataArr[i]['층'];
					rowData[3] = self.rawDataArr[i]['상가유형'];
					rowData[4] = self.rawDataArr[i]['면적'];
					rowData[5] = self.rawDataArr[i]['전용면적'];
					rowData[6] = self.rawDataArr[i]['보증금'];
					rowData[7] = self.rawDataArr[i]['월세'];
					rowData[8] = self.rawDataArr[i]['권리금'];
					rowData[9] = self.rawDataArr[i]['등록일'];
					jsonBody2.push(rowData);
				}
				
				var jsonMerge = jsonHeader.concat(jsonBody2);
				var ws = XLSX.utils.json_to_sheet(jsonMerge, {raw: true, skipHeader: true});
				
				result.resolve(ws);
			});

			return result;
		}
	};
	
	// 임대매물정보_지번
	var building_ComplexList_1_3_1 = {		
		init: function(ls_pnu) {
			var self = this;
			$('#tbodyBuildingComplex2_1').html('');
			
			self.$tbody	= $('#tbodyBuildingComplex2_1').html('');
		
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
			param = {
					sidonm: ls_sidonm,
					sggnm: ls_sggnm,
					dongnm: ls_dongnm,
					lat: ls_lat,
					lng: ls_lng,
					bunji: ls_bunji,
					xy: ls_xy,
					pnu: ls_pnu,
					ls_article_type_length: ls_article_type_length
				};
						
			return z.xAsync('dawulmap', 'zeons_임대매물정보_지번', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서				
				self.rawDataArr = resp,
				self.rawDataArrCopy = [];
				
				self.rawDataArr.filter(function(element, index, array){
					if(index < 30){
						self.rawDataArrCopy.push(element);
					}	
				});
				$('.rent_one [data-cnt-trading]').text('총 ' + z.toComma(self.rawDataArr.length) + ' 건  중 ' + z.toComma(self.rawDataArrCopy.length) + ' 건');
			});
		},
		
		updateData: function() {
			var self = this,
				$tbody = $('#tbodyBuildingComplex2_1').html(''),				
				tmpl = Handlebars.compile($('#tmplBuildingComplexList3').html());
			$tbody.append(tmpl({urdArr: self.rawDataArrCopy}));
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = self.$tbody.closest('table');

				var ws = XLSX.utils.table_to_sheet($table[0], {raw: true, type: 'string'});
				
				var $header = $table;
	
				var wsHeader = XLSX.utils.table_to_sheet($header[0]);
				var wsBody = XLSX.utils.table_to_sheet($table[0], {raw: true});
				
				var jsonHeader = XLSX.utils.sheet_to_json(wsHeader, {header: 1}).splice(0,1);
				var jsonBody2 = [];
				var row = Array.apply(null, Array(10)).map(function() {return 0;})
				
				for (var i in self.rawDataArr) {
					var rowData = $.extend(true, [], row);
					rowData[0] = self.rawDataArr[i]['건물명'];
					rowData[1] = self.rawDataArr[i]['번지'];
					rowData[2] = self.rawDataArr[i]['층'];
					rowData[3] = self.rawDataArr[i]['상가유형'];
					rowData[4] = self.rawDataArr[i]['면적'];
					rowData[5] = self.rawDataArr[i]['전용면적'];
					rowData[6] = self.rawDataArr[i]['보증금'];
					rowData[7] = self.rawDataArr[i]['월세'];
					rowData[8] = self.rawDataArr[i]['권리금'];
					rowData[9] = self.rawDataArr[i]['등록일'];
					jsonBody2.push(rowData);
				}
				
				var jsonMerge = jsonHeader.concat(jsonBody2);
				var ws = XLSX.utils.json_to_sheet(jsonMerge, {raw: true, skipHeader: true});
				
				result.resolve(ws);
			});

			return result;
		}
	};	
	
	// 매매실거래가정보_동
	var building_ComplexList_1_4 = {		
		init: function(ls_pnu) {
			var self = this;									
			$('#tbodyBuildingComplex3').html('');
			
			self.$tbody	= $('#tbodyBuildingComplex3').html('');
			
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
			param = {
					pnu: ls_pnu,
					lat: ls_lat,
					lng: ls_lng,
					ls_article_type_length: ls_article_type_length					
				};			
						
			return z.xAsync('dawulmap', 'zeons_매매실거래가정보_동', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서	
				if (resp == null) {
					resp = [];
				}				
				self.rawDataArr = resp,
				self.rawDataArrCopy = [];
			
				self.rawDataArr.filter(function(element, index, array){
					if(index < 30){
						self.rawDataArrCopy.push(element);
					}	
				}); 

				$('.realtran_two [data-cnt-trading]').text('총 ' + z.toComma(self.rawDataArr.length) + ' 건  중 ' + z.toComma(self.rawDataArrCopy.length) + ' 건');
			});
		},
		
		updateData: function() {
			var self = this,
				$tbody = $('#tbodyBuildingComplex3').html(''),				
				tmpl = Handlebars.compile($('#tmplBuildingComplexList4').html());
			$tbody.append(tmpl({rrdArr: self.rawDataArrCopy}));
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = self.$tbody.closest('table');

				var ws = XLSX.utils.table_to_sheet($table[0], {raw: true, type: 'string'});

				var $header = $table;
	
				var wsHeader = XLSX.utils.table_to_sheet($header[0]);
				var wsBody = XLSX.utils.table_to_sheet($table[0], {raw: true});
				
				var jsonHeader = XLSX.utils.sheet_to_json(wsHeader, {header: 1}).splice(0,1);
				
				var jsonBody2 = [];
				var row = Array.apply(null, Array(8)).map(function() {return 0;})
				
				for (var i in self.rawDataArr ) {
					var rowData = $.extend(true, [], row);
					rowData[0] = self.rawDataArr[i]['건물명'];
					rowData[1] = self.rawDataArr[i]['번지'];
					rowData[2] = self.rawDataArr[i]['층'];
					rowData[3] = self.rawDataArr[i]['상가유형'];
					rowData[4] = self.rawDataArr[i]['주용도'];
					rowData[5] = self.rawDataArr[i]['전용면적'];
					rowData[6] = self.rawDataArr[i]['거래금액'];
					rowData[7] = self.rawDataArr[i]['계약일'];
					jsonBody2.push(rowData);
				}
				
				var jsonMerge = jsonHeader.concat(jsonBody2);
				var ws = XLSX.utils.json_to_sheet(jsonMerge, {raw: true, skipHeader: true});
				
				result.resolve(ws);
			});

			return result;
		}
	};
	
	// 매매실거래가정보_지번
	var building_ComplexList_1_4_1 = {		
		init: function(ls_pnu) {
			var self = this;									
			$('#tbodyBuildingComplex3_1').html('');
			
			self.$tbody	= $('#tbodyBuildingComplex3_1').html('');
		
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
			param = {
					pnu: ls_pnu,
					lat: ls_lat,
					lng: ls_lng,
					bunji: ls_bunji,
					xy: ls_xy,
					ls_article_type_length: ls_article_type_length
				};			
						
			return z.xAsync('dawulmap', 'zeons_매매실거래가정보_지번', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서		
				if (resp == null) {
					resp = [];
				}		
				self.rawDataArr = resp,
				self.rawDataArrCopy = [];
			
				self.rawDataArr.filter(function(element, index, array){
					if(index < 30){
						self.rawDataArrCopy.push(element);
					}	
				});

				$('.realtran_one [data-cnt-trading]').text('총 ' + z.toComma(self.rawDataArr.length) + ' 건  중 ' + z.toComma(self.rawDataArrCopy.length) + ' 건');
			});
		},
		
		updateData: function() {
			var self = this,
				$tbody = $('#tbodyBuildingComplex3_1').html(''),				
				tmpl = Handlebars.compile($('#tmplBuildingComplexList4').html());
			$tbody.append(tmpl({rrdArr: self.rawDataArrCopy}));
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = self.$tbody.closest('table');
				var ws = XLSX.utils.table_to_sheet($table[0], {raw: true, type: 'string'});

				result.resolve(ws);
			});

			return result;
		}
	};	
	
	// 상가업소정보(임대료 1번탭 )
	var building_ComplexList_1_5 = {		
		init: function(ls_pnu) {
			var self = this;									
			$('#tbodyBuildingComplex5').html('');
			$('#tbodyBuildingComplex5_1').html('');
			$('#tbodyBuildingComplex5_2').html('');
			
			self.$tbody	=	$('#tbodyBuildingComplex5').html('');
		
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
			param = {
					pnu: ls_pnu,
					sidonm: ls_sidonm,
					sggnm: ls_sggnm,
					dongnm: ls_dongnm
				};			
						
			return z.xAsync('dawulmap', 'zeons_상가업소정보', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서				
				self.rawDataArr = resp;
			});
		},
		
		updateData: function() {
			var self = this,
				$tbody = $('#tbodyBuildingComplex5').html(''),
				$tbody2 = $('#tbodyBuildingComplex5_1').html(''),
				$tbody3 = $('#tbodyBuildingComplex5_2').html(''),
				tmpl = Handlebars.compile($('#tmplBuildingComplexList5').html());
			
				$tbody.append(tmpl({srdArr: self.rawDataArr}));
				$tbody2.append(tmpl({srdArr: self.rawDataArr}));
				$tbody3.append(tmpl({srdArr: self.rawDataArr}));
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = self.$tbody.closest('table');
				var ws = XLSX.utils.table_to_sheet($table[0], {raw: true, type: 'string'});

				result.resolve(ws);
			});

			return result;
		}
	};
	
	// 호구분별분양가정보(분양 - 층호별 분양가정보 )
	var building_ComplexList_1_6 = {		
		init: function(ls_pnu) {
			var self = this;									
			$('#tbodyBuildingComplex6').html('');
			
			self.$tbody	= $('#tbodyBuildingComplex6').html('');
		
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
			param = {
					pnu: ls_pnu,
					sidonm: ls_sidonm,
					sggnm: ls_sggnm,
					dongnm: ls_dongnm,
					ls_article_type_length: ls_article_type_length
				};			
						
			return z.xAsync('dawulmap', '호구분별분양가', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서				
				self.rawDataArr = resp;
			});
		},
		
		updateData: function() {
			var self = this,
				$tbody = $('#tbodyBuildingComplex6').html(''),				
				tmpl = Handlebars.compile($('#tmplBuildingComplexList6').html());
			$tbody.append(tmpl({lrdArr: self.rawDataArr}));
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = self.$tbody.closest('table');
				var ws = XLSX.utils.table_to_sheet($table[0], {raw: true, type: 'string'});

				result.resolve(ws);
			});

			return result;
		}
	};	
	
	// 매매매물정보_동
	var building_ComplexList_1_7 = {		
		init: function(ls_pnu) {
			var self = this;									
			$('#tbodyBuildingComplex4').html('');
			
			self.$tbody	= $('#tbodyBuildingComplex4').html('');
		
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
			param = {
					sidonm: ls_sidonm,
					sggnm: ls_sggnm,
					dongnm: ls_dongnm,
					pnu: ls_pnu, 
					lat: ls_lat,
					lng: ls_lng,
					ls_article_type_length: ls_article_type_length
				};
						
			return z.xAsync('dawulmap', 'zeons_매매매물정보_동', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서				
				self.rawDataArr = resp,
				self.rawDataArrCopy = [];
			
				self.rawDataArr.filter(function(element, index, array){
					if(index < 30){
						self.rawDataArrCopy.push(element);
					}	
				}); 

				$('.trading_two [data-cnt-trading]').text('총 ' + z.toComma(self.rawDataArr.length) + ' 건  중 ' + z.toComma(self.rawDataArrCopy.length) + ' 건');
			});
		},
		
		updateData: function() {
			var self = this,
				$tbody = $('#tbodyBuildingComplex4').html(''),				
				tmpl = Handlebars.compile($('#tmplBuildingComplexList8').html());
			$tbody.append(tmpl({urdArr: self.rawDataArrCopy}));
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = self.$tbody.closest('table');

				var ws = XLSX.utils.table_to_sheet($table[0], {raw: true, type: 'string'});
				
				var $header = $table;
	
				var wsHeader = XLSX.utils.table_to_sheet($header[0]);
				var wsBody = XLSX.utils.table_to_sheet($table[0], {raw: true});
				
				var jsonHeader = XLSX.utils.sheet_to_json(wsHeader, {header: 1}).splice(0,1);
				var jsonBody2 = [];
				var row = Array.apply(null, Array(10)).map(function() {return 0;});
				
				for (var i in self.rawDataArr ) {
					var rowData = $.extend(true, [], row);
					rowData[0] = self.rawDataArr[i]['건물명'];
					rowData[1] = self.rawDataArr[i]['번지'];
					rowData[2] = self.rawDataArr[i]['층'];
					rowData[3] = self.rawDataArr[i]['상가유형'];
					rowData[4] = self.rawDataArr[i]['면적'];
					rowData[5] = self.rawDataArr[i]['전용면적'];
					rowData[6] = self.rawDataArr[i]['매매가'];
					rowData[7] = self.rawDataArr[i]['권리금'];
					rowData[8] = self.rawDataArr[i]['수익률'];
					rowData[9] = self.rawDataArr[i]['등록일'];
					jsonBody2.push(rowData);
				}
				
				var jsonMerge = jsonHeader.concat(jsonBody2);
				var ws = XLSX.utils.json_to_sheet(jsonMerge, {raw: true, skipHeader: true});
				
				result.resolve(ws);
			});

			return result;
		}
	};
	
	// 매매매물정보_지번
	var building_ComplexList_1_7_1 = {		
		init: function(ls_pnu) {
			var self = this;
			$('#tbodyBuildingComplex4_1').html('');
			
			self.$tbody	= $('#tbodyBuildingComplex4_1').html('');
		
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
			param = {
					sidonm: ls_sidonm,
					sggnm: ls_sggnm,
					dongnm: ls_dongnm,
					lat: ls_lat,
					lng: ls_lng,
					bunji: ls_bunji,
					xy: ls_xy,
					pnu: ls_pnu,
					ls_article_type_length: ls_article_type_length
				};
						
			return z.xAsync('dawulmap', 'zeons_매매매물정보_지번', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서				
				self.rawDataArr = resp,
				self.rawDataArrCopy = [];
				
				self.rawDataArr.filter(function(element, index, array){
					if(index < 30){
						self.rawDataArrCopy.push(element);
					}	
				});

				$('.trading_one [data-cnt-trading]').text('총 ' + z.toComma(self.rawDataArr.length) + ' 건  중 ' + z.toComma(self.rawDataArrCopy.length) + ' 건');
			});
		},
		
		updateData: function() {
			var self = this,
				$tbody = $('#tbodyBuildingComplex4_1').html(''),				
				tmpl = Handlebars.compile($('#tmplBuildingComplexList8').html());
			$tbody.append(tmpl({urdArr: self.rawDataArrCopy}));
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = self.$tbody.closest('table');

				var ws = XLSX.utils.table_to_sheet($table[0], {raw: true, type: 'string'});
				
				var $header = $table;
	
				var wsHeader = XLSX.utils.table_to_sheet($header[0]);
				var wsBody = XLSX.utils.table_to_sheet($table[0], {raw: true});
				
				var jsonHeader = XLSX.utils.sheet_to_json(wsHeader, {header: 1}).splice(0,1);
				var jsonBody2 = [];
				var row = Array.apply(null, Array(10)).map(function() {return 0;});
				
				for (var i in self.rawDataArr) {
					var rowData = $.extend(true, [], row);
					rowData[0] = self.rawDataArr[i]['건물명'];
					rowData[1] = self.rawDataArr[i]['번지'];
					rowData[2] = self.rawDataArr[i]['층'];
					rowData[3] = self.rawDataArr[i]['상가유형'];
					rowData[4] = self.rawDataArr[i]['면적'];
					rowData[5] = self.rawDataArr[i]['전용면적'];
					rowData[6] = self.rawDataArr[i]['매매가'];
					rowData[7] = self.rawDataArr[i]['권리금'];
					rowData[8] = self.rawDataArr[i]['수익률'];
					rowData[9] = self.rawDataArr[i]['등록일'];
					jsonBody2.push(rowData);
				}
				
				var jsonMerge = jsonHeader.concat(jsonBody2);
				var ws = XLSX.utils.json_to_sheet(jsonMerge, {raw: true, skipHeader: true});
				
				result.resolve(ws);
			});

			return result;
		}
	};	

	
	
	// Private functions
	// 분양
	var building_ComplexList_1 = {			
		init: function(ls_pnu) {
			var self = this;
			
			self.ls_pnu = ls_pnu;
			
			$('#tableBodyBlockComplex').html('');
		
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
			param = {
					pnu: ls_pnu,
					sidonm: ls_sidonm,
					sggnm: ls_sggnm,
					dongnm: ls_dongnm,
					xy: ls_xy
				};
			
			return z.xAsync('dawulmap', 'zeons_분양_상세정보', 'select', param, 'json2').done(function(resp) {
				ls_addr	= '';
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;
				ls_html	= '';
				
				if(resp == ''){
					$(".mt-n1").css("display","none");					
					ls_html += "<td class='bg-light-secondary py-2' style='padding : inherit;'>데이터가 존재하지 않습니다.</td>";
                    
    				$('#q_위치').text('-');
    				$('#q_사업명').text('-');
    				
    				$('#q_분양일').text('-');
    				$('#q_입주일').text('-');
    				$('#q_점포수').text('-');
    				
    				$('#a_상가명').text('-');
    				$('#a_위치').text('-');
    				$('#a_대지면적').text('-');
    				$('#a_연면적').text('-');
    				$('#a_주용도').text('-');
    				$('#a_건축규모').text('-');
    				
    				$('#a_건폐율').text('-');
    				$('#a_주차장').text('-');                    
                    
					$('.' + ls_xy + '').html(ls_html);
					
					//$('#' + ls_xy + '').text("분양");
    				                    
					return;
				}
				
				$(".mt-n1").css("display","");
				
				if(resp[0].cnt == '1') {
					$btnFavorite2.removeClass('btn-outline-secondary').addClass('btn-danger');														
				} else {
					$btnFavorite2.removeClass('btn-danger').addClass('btn-outline-secondary');
				}				
				
				ls_addr	= resp[0].위치;
				
				ls_html += "<table id='tableBodyBlockComplex_a' class='table table-bordered table-td-right m-0' style='table-layout:fixed;'>";
				ls_html += "<colgroup>";
				ls_html += "<col style='width:120px'>";
				ls_html += "<col style='width:auto'>";
				ls_html += "</colgroup>";
				ls_html += "<tbody>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>사업명</td>";
				ls_html += "<td class='py-2'>"+ resp[0].건물명 +"</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>위치</td>";
				ls_html += "<td class='py-2' style='word-break: keep-all;'>"+ resp[0].위치 +"</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>건축규모</td>";
				ls_html += "<td class='py-2'>지상 "+ Number(resp[0].지상층수) +"층/지하 " + Number(resp[0].지하층수) + "층</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>대지면적</td>";
				ls_html += "<td class='py-2'>"+ z.toComma(Number(resp[0].대지면적)) +"(㎡)</td>";
				ls_html += "</tr>";				
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>연면적</td>";
				ls_html += "<td class='py-2'>"+ z.toComma(Number(resp[0].연면적)) +"(㎡)</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>1F전용평당가</td>";
				ls_html += "<td class='py-2'>"+ resp[0].전용평당가 +"(만원)</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>1F계약평당가</td>";
				ls_html += "<td class='py-2'>"+ resp[0].계약평당가 +"(만원)</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>분양일</td>";
				ls_html += "<td class='py-2'>"+ resp[0].분양일 +"</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>입주일</td>";
				ls_html += "<td class='py-2'>"+ resp[0].입주일 +"</td>";
				ls_html += "</tr>";				
				
				ls_html += "</tbody>";
				ls_html += "</table>";

				
				$('.' + ls_xy + '').html(ls_html);
				
				KTUtil.scrollInit($('.' + ls_xy + '')[0], {
					mobileNativeScroll: true,
					handleWindowResize: true
				});
				
				//$('#' + ls_xy + '').text("분양");
				
				if(resp[0].img_url == "" || resp[0].img_url == null) {
					$('.sales_img').css("visibility", "hidden");
				} else {
					$('.sales_img').css("visibility", "visible");
				}
				
				ls_imgsrcArr = resp[0].img_url.split(",");

				$('#exampleModalLabel').text('조감도사진');
				
				ls_imghtml = '';
				$('#exampleModal .owl_slide').remove();
				$('#exampleModal .owl-carousel').remove();
				ls_imghtml = '<div class="owl-carousel owl-theme">';				
				for(var i = 0; i < ls_imgsrcArr.length; i++){					
					ls_imghtml += "<div class='item'><img src='" + ls_imgsrcArr[i] + "' alt=''></div>";
				}
				ls_imghtml += '</div>';
				$('#exampleModal #owl_slide').append(ls_imghtml);
				
				$('#exampleModal .owl-carousel').owlCarousel({
					loop:true,
					margin:10,
					nav:true,
					items:1,
					dots: true,
					navText : ['<i class="la la-angle-left" aria-hidden="true"></i>','<i class="la la-angle-right" aria-hidden="true"></i>']
				});
				
				$('#img_src').attr("src",ls_imgsrcArr[0]);
				$('#img_src2').attr("src",ls_imgsrcArr[0]);
				
				$('#img_length').text("+ " + ls_imgsrcArr.length);
				
				$('#q_위치').text(resp[0].위치);
				$('#q_사업명').text(resp[0].건물명);
				
				$('#q_분양일').text(resp[0].분양일);
				$('#q_입주일').text(resp[0].입주일);
				$('#q_점포수').text(resp[0].점포수 + " 개");								
				
				$('#a_상가명').text(resp[0].건물명);
				$('#a_위치').text(resp[0].위치);
				//geoCodingSearchArea(resp[0].위치);
				$('#a_시행사').text(resp[0].시행사);
				$('#a_대지면적').text(z.toComma(resp[0].대지면적) + " ㎡ (" + z.toComma(Math.round(resp[0].대지면적 / zo.py2m)) + " 평)");
				$('#a_연면적').text("약 " + z.toComma(resp[0].연면적) + " ㎡ (" + z.toComma(Math.round(resp[0].연면적 / zo.py2m)) + " 평)");
				$('#a_주용도').text(resp[0].상가유형);				
				$('#a_건축규모').text("지하 " + resp[0].지하층수 + "층/지상 " + resp[0].지상층수 + "층");				
				
				$('#a_건폐율').text(resp[0].건폐율 + "%/" + resp[0].용적율 + " %");
				$('#a_주차장').text(resp[0].주차장 + "대/" + resp[0].승강기 + " 대");
			});
		},
		
		updateData: function() {
			var self = this,
				$tbody = $('#tableBodyBuildingComplex').html('')
		},
		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = $('#tableBodyBlockComplex_a');
				var ws = XLSX.utils.table_to_sheet($table[0], {raw: true, type: 'string'});

				result.resolve(ws);
			});

			return result;
		}		
	};
	
	// Private functions
	// 임대료
	var building_ComplexList_2 = {			
		init: function(ls_pnu) {
			var self = this;
			
			self.ls_pnu = ls_pnu;
			
			document.getElementById('mapPannel1_2').className = 'map-pannel-rent position-fixed w-800px pb-0 d-none flex-column border map-pannel bg-white';
			
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
			param = {
				pnu: ls_pnu,
				xy: ls_xy
			};			
			
			return z.xAsync('dawulmap', 'zeons_임대료_상세정보', 'select', param, 'json2').done(function(resp) {
				
				ls_addr	=	'';
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;											
				
				ls_html	=	'';
								
				if(resp[0].위치 == '' && resp[0].대지면적 == 0 || resp == ''){
					$(".mt-n1").css("display","none");					
						ls_html += "<td class='bg-light-secondary py-2' style='padding : inherit;'>데이터가 존재하지 않습니다.</td>";
									
						//$('#' + ls_xy + '').text("임대료");
						$('.' + ls_xy + '').html(ls_html);						
						
						$('#o_위치').text('-');
						$('#o_기타용도').text('-');
						$('#o_사용승인일').text('-');
						$('#o_건축규모').text('-');
						$('#o_주용도').text('-');
						$('#o_대지면적').text('-');
						$('#o_건축면적').text('-');
						$('#o_연면적').text('-');
						
						$('#o_건폐율').text('-');
						$('#o_용적률').text('-');
						
						$('#o_a주차').text('-');
						$('#o_b주차').text('-');
						$('#o_c주차').text('-');
						$('#o_d주차').text('-');
						
						$('#o_승강기').text('-');											
						return;
				}
				
				$(".mt-n1").css("display","");
				
				if(resp[0].cnt == '1'){
					$btnFavorite1_2.removeClass('btn-outline-secondary').addClass('btn-danger');														
				}else{
					$btnFavorite1_2.removeClass('btn-danger').addClass('btn-outline-secondary');
				}				
								
				ls_addr	= resp[0].위치;
				
				ls_html += "<table id='tableBodyBuildingComplex_a' class='table table-bordered table-td-right m-0' style='table-layout:fixed;'>";
				ls_html += "<colgroup>";
				ls_html += "<col style='width:120px'>";
				ls_html += "<col style='width:auto'>";
				ls_html += "</colgroup>";
				ls_html += "<tbody>";				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>위치</td>";
				ls_html += "<td class='py-2' style='word-break: keep-all;'>"+ resp[0].위치 +"</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>대지면적</td>";
				ls_html += "<td class='py-2'>"+ z.toComma(Number(resp[0].대지면적)) +"(㎡)</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>연면적</td>";
				ls_html += "<td class='py-2'>"+ z.toComma(Number(resp[0].연면적)) +"(㎡)</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>건폐율/용적율</td>";
				ls_html += "<td class='py-2'>"+ Number(resp[0].건폐율) +"%/" + Number(resp[0].용적율) + "%</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>주용도</td>";
				ls_html += "<td class='py-2'>"+ resp[0].주용도 +"</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>건축규모</td>";
				ls_html += "<td class='py-2'>지상 "+ Number(resp[0].지상층수) +"층/지하 " + Number(resp[0].지하층수) + "층</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>주차</td>";
				ls_html += "<td class='py-2'>총 "+ Number(resp[0].주차장) +"대<br>(자주식 "+ Number(resp[0].자주식) +", 기계식 "+ Number(resp[0].기계식) +")</td>";
				ls_html += "</tr>";				
				ls_html += "</tbody>";
				ls_html += "</table>";				
				
				ls_html += "<table class='table-gray  mt-9'>";
				ls_html += "<thead>";
				ls_html += "<tr>";
				ls_html += "<th>층</th>";
				ls_html += "<th>호</th>";
				ls_html += "<th>보증금<br>(만원)</th>";
				ls_html += "<th>월세<br>(만원)</th>";
				ls_html += "</tr>";
				ls_html += "</thead>";
				ls_html += "<tbody style='font-size: 13px;'>";
				ls_html += "<tr>";
				ls_html += "<td>"+ resp[0].해당층 +"</td>";
				ls_html += "<td>"+ resp[0].호 +"</td>";
				ls_html += "<td>"+ z.toComma(resp[0].보증금) +"</td>";
				ls_html += "<td>"+ z.toComma(resp[0].월세) +"</td>";
				ls_html += "</tr>";
				ls_html += "</tbody>";
				ls_html += "</table>";                                                
				/*z.toComma(val.toFixed(1));*/		
				$('.' + ls_xy + '').html(ls_html);

				KTUtil.scrollInit($('.' + ls_xy + '')[0], {
					mobileNativeScroll: true,
					handleWindowResize: true
				});
				
				//$('#' + ls_xy + '').text("임대료");

				$('#o_위치').text(resp[0].위치);
				//geoCodingSearchArea(resp[0].위치);
				$('#o_기타용도').text(resp[0].주용도);
				$('#o_사용승인일').text(resp[0].사용승인_일);
				$('#o_건축규모').text("지하 " + resp[0].지하층수 + "층 / 지상 " + resp[0].지상층수 + "층");
				$('#o_주용도').text(resp[0].주용도);
				$('#o_대지면적').text(z.toComma(resp[0].대지면적) + " ㎡ (" + z.toComma(Math.round(resp[0].대지면적 / zo.py2m)) + " 평)");
				$('#o_건축면적').text(z.toComma(resp[0].건축면적) + " ㎡ (" + z.toComma(Math.round(resp[0].건축면적 / zo.py2m)) + " 평)");
				$('#o_연면적').text("약 " + z.toComma(resp[0].연면적) + " ㎡ (" + z.toComma(Math.round(resp[0].연면적 / zo.py2m)) + " 평)");
				
				$('#o_건폐율').text(resp[0].건폐율 + " %");
				$('#o_용적률').text(resp[0].용적율 + " %");
				
				$('#o_a주차').text(resp[0].옥내자주식 + "대");
				$('#o_b주차').text(resp[0].옥외자주식 + "대");
				$('#o_c주차').text(resp[0].옥내기계식 + "대");
				$('#o_d주차').text(resp[0].옥외기계식 + "대");
				
				$('#o_승강기').text("승용: " + resp[0].승용_승강기_수 + "기 / 비상용: " + resp[0].비상용_승강기_수 + "기");			
			});
		},		
		updateData: function() {
			var self = this,
				$tbody = $('#tableBodyBuildingComplex').html('')
		},
		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				
				
				var $table = $('#tableBodyBuildingComplex_a');

				var ws = XLSX.utils.table_to_sheet($table[0], {raw: true, type: 'string'});

				result.resolve(ws);
			});

			return result;
		}			
	};
	
	// Private functions
	// 실거래
	var building_ComplexList_3 = {			
		init: function(ls_pnu) {
			var self = this;			
			self.ls_pnu = ls_pnu;						
			
			document.getElementById('mapPannel1_2').className = 'map-pannel-actual position-fixed w-800px pb-0 d-none flex-column border map-pannel bg-white';				
		
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
			param = {
					pnu: ls_pnu,
					sidonm: ls_sidonm,
					sggnm: ls_sggnm,
					dongnm: ls_dongnm,
					xy: ls_xy
				};			
						
				return z.xAsync('dawulmap', 'zeons_실거래가_상세정보', 'select', param, 'json2').done(function(resp) {
				
				ls_addr	= '';
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;
				ls_html	= '';
				
				if(resp[0].위치 == '' && resp[0].대지면적 == 0 || resp == ''){
					$(".mt-n1").css("display","none");					
					ls_html += "<td class='bg-light-secondary py-2' style='padding : inherit;'>데이터가 존재하지 않습니다.</td>";
					$('.' + ls_xy + '').html(ls_html);
					
					//$('#' + ls_xy + '').text("실거래");					
					
					$('#o_위치').text('-');
					$('#o_기타용도').text('-');
					$('#o_사용승인일').text('-');
					$('#o_건축규모').text('-');
					$('#o_주용도').text('-');
					$('#o_대지면적').text('-');
					$('#o_건축면적').text('-');
					$('#o_연면적').text('-');
					
					$('#o_건폐율').text('-');
					$('#o_용적률').text('-');
					
					$('#o_a주차').text('-');
					$('#o_b주차').text('-');
					$('#o_c주차').text('-');
					$('#o_d주차').text('-');
					
					$('#o_승강기').text('-');										
					return;
				}
				$(".mt-n1").css("display","");
				
				if(resp[0].cnt == '1'){
					$btnFavorite1_2.removeClass('btn-outline-secondary').addClass('btn-danger');														
				}else{
					$btnFavorite1_2.removeClass('btn-danger').addClass('btn-outline-secondary');
				}
								
				ls_addr	= resp[0].위치;
				
				ls_html += "<table id='kt_tab_pane_1_2_1_a' class='table table-bordered table-td-right m-0' style='table-layout:fixed;'>";
				ls_html += "<colgroup>";
				ls_html += "<col style='width:120px'>";
				ls_html += "<col style='width:auto'>";
				ls_html += "</colgroup>";
				ls_html += "<tbody>";				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>위치</td>";
				ls_html += "<td class='py-2' style='word-break: keep-all;'>"+ resp[0].위치 +"</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>대지면적</td>";
				ls_html += "<td class='py-2'>"+ z.toComma(Number(resp[0].대지면적)) +"(㎡)</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>연면적</td>";
				ls_html += "<td class='py-2'>"+ z.toComma(Number(resp[0].연면적)) +"(㎡)</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>건폐율/용적율</td>";
				ls_html += "<td class='py-2'>"+ Number(resp[0].건폐율) +"%/" + Number(resp[0].용적율) + "%</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>주용도</td>";
				ls_html += "<td class='py-2'>"+ resp[0].주용도 +"</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>건축규모</td>";
				ls_html += "<td class='py-2'>지상 "+ Number(resp[0].지상층수) +"층/지하 " + Number(resp[0].지하층수) + "층</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>주차</td>";
				ls_html += "<td class='py-2'>총 "+ Number(resp[0].주차장) +"대<br>(자주식 "+ Number(resp[0].자주식) +", 기계식 "+ Number(resp[0].기계식) +")</td>";
				ls_html += "</tr>";				
				ls_html += "</tbody>";
				ls_html += "</table>";				
				
				ls_html += "<table class='table-gray  mt-9'>";
				ls_html += "<thead>";
				ls_html += "<tr>";
				ls_html += "<th>층</th>";
				ls_html += "<th>계약일</th>";
				ls_html += "<th>면적<br>(㎡)</th>";
				ls_html += "<th>금액<br>(만원)</th>";
				ls_html += "</tr>";
				ls_html += "</thead>";
				ls_html += "<tbody style='font-size: 13px;'>";
				ls_html += "<tr>";
				if(resp[0].층 == '' || resp[0].층 == null){
					ls_html += "<td>-</td>";
				}else{
					ls_html += "<td>"+ resp[0].층 +"</td>";
				}
				
				ls_html += "<td>"+ resp[0].계약일 +"</td>";
				ls_html += "<td>"+ z.toComma(resp[0].면적) +"</td>";
				ls_html += "<td>"+ z.toComma(resp[0].금액) +"</td>";
				ls_html += "</tr>";
				ls_html += "</tbody>";
				ls_html += "</table>";
				   

				setTimeout(function() {			
					$('.' + ls_xy + '').html(ls_html);
					
					KTUtil.scrollInit($('.' + ls_xy + '')[0], {
						mobileNativeScroll: true,
						handleWindowResize: true
					});
					$('#' + ls_xy + '').text("실거래");
				}, 0);
																
								
				$('#o_위치').text(resp[0].위치);
				//geoCodingSearchArea(resp[0].위치);
				$('#o_기타용도').text(resp[0].주용도);
				$('#o_사용승인일').text(resp[0].사용승인_일);
				$('#o_건축규모').text("지하 " + resp[0].지하층수 + "층 / 지상 " + resp[0].지상층수 + "층");
				$('#o_주용도').text(resp[0].주용도);
				$('#o_대지면적').text(z.toComma(resp[0].대지면적) + " ㎡ (" + z.toComma(Math.round(resp[0].대지면적 / zo.py2m)) + " 평)");
				$('#o_건축면적').text(z.toComma(resp[0].건축면적) + " ㎡ (" + z.toComma(Math.round(resp[0].건축면적 / zo.py2m)) + " 평)");
				$('#o_연면적').text("약 " + z.toComma(resp[0].연면적) + " ㎡ (" + z.toComma(Math.round(resp[0].연면적 / zo.py2m)) + " 평)");
				
				$('#o_건폐율').text(resp[0].건폐율 + " %");
				$('#o_용적률').text(resp[0].용적율 + " %");
				
				$('#o_a주차').text(resp[0].옥내자주식 + "대");
				$('#o_b주차').text(resp[0].옥외자주식 + "대");
				$('#o_c주차').text(resp[0].옥내기계식 + "대");
				$('#o_d주차').text(resp[0].옥외기계식 + "대");
				
				$('#o_승강기').text("승용: " + resp[0].승용_승강기_수 + "기 / 비상용: " + resp[0].비상용_승강기_수 + "기");
				
			
			});
		},
		
		updateData: function() {
			var self = this,
				$tbody = $('#tableBodyBuildingComplex').html('')
		},
		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = $('#kt_tab_pane_1_2_1_a');
				var ws = XLSX.utils.table_to_sheet($table[0], {raw: true, type: 'string'});

				result.resolve(ws);
			});

			return result;
		}		
	};
	
	// Private functions
	// 건물
	var building_ComplexList_4 = {			
		init: function(ls_pnu) {
			var self = this;
			
			self.ls_pnu = ls_pnu;						
		
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
			param = {
					pnu: ls_pnu,
					xy: ls_xy
				};			
			
			return z.xAsync('dawulmap', 'zeons_건물_상세정보', 'select', param, 'json2').done(function(resp) {
				ls_addr	=	'';
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;				
				ls_html	= '';
								
				if(resp == ''){
					$(".mt-n1").css("display","none");					
					ls_html += "<td class='bg-light-secondary py-2' style='padding : inherit;'>데이터가 존재하지 않습니다.</td>";
                    
    				$('#z_사용승인일').text('-');
    				$('#y_사용승인일').text('-');
    				$('#z_건축규모').text('-');
    				$('#z_주용도').text('-');				
    				
    				$('#s_건물명').text('-');
    				$('#y_건물명').text('-');
    				
    				$('#s_위치').text('-');
    				$('#y_위치').text('-');
    				
    				$('#s_대지면적').text('-');
    				$('#s_연면적').text('-');
    				$('#s_주용도').text('-');
    				$('#s_규모').text('-');
    				$('#s_주차장').text('-');
    				
                    setTimeout(function() {         
                    	$('.' + ls_xy + '').html(ls_html);
        				//$('.building_append').html(ls_html);
        				
        				//$('#building_text').text("건물");        				
                    }, 0);     				

					return;
				}
				
				$(".mt-n1").css("display","");
				
				if(resp[0].cnt == '1'){
					$btnFavorite.removeClass('btn-outline-secondary').addClass('btn-danger');														
				}else{
					$btnFavorite.removeClass('btn-danger').addClass('btn-outline-secondary');
				}				
				
				ls_addr	= resp[0].위치;
				
				ls_html += "<table id='mapPannel1_a' class='table table-bordered table-td-right m-0' style='table-layout:fixed;'>";
				ls_html += "<colgroup>";
				ls_html += "<col style='width:120px'>";
				ls_html += "<col style='width:auto'>";
				ls_html += "</colgroup>";
				ls_html += "<tbody>";				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>위치</td>";
				ls_html += "<td class='py-2' style='word-break: keep-all;'>"+ resp[0].위치 +"</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>대지면적</td>";
				ls_html += "<td class='py-2'>"+ z.toComma(Number(resp[0].대지면적)) +"(㎡)</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>연면적</td>";
				ls_html += "<td class='py-2'>"+ z.toComma(Number(resp[0].연면적)) +"(㎡)</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>건폐율/용적율</td>";
				ls_html += "<td class='py-2'>"+ Number(resp[0].건폐율) +"%/" + Number(resp[0].용적율) + "%</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>주용도</td>";
				ls_html += "<td class='py-2'>"+ resp[0].주용도 +"</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>건축규모</td>";
				ls_html += "<td class='py-2'>지상"+ Number(resp[0].지상층수) +"/지하" + Number(resp[0].지하층수) + "</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>주차장</td>";
				ls_html += "<td class='py-2'>"+ Number(resp[0].주차장) +"대</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>승강기</td>";
				ls_html += "<td class='py-2'>"+ Number(resp[0].승강기) +"</td>";
				ls_html += "</tr>";
				
				ls_html += "</tbody>";
				ls_html += "</table>";
				
			       
            	$('.' + ls_xy + '').html(ls_html);
            	//$('.building_append').html(ls_html);
				
				//$('#building_text').text("건물");        				
				
				KTUtil.scrollInit($('.' + ls_xy + '')[0], {
					mobileNativeScroll: true,
					handleWindowResize: true
				});				
				
				$('#z_사용승인일').text(resp[0].사용승인일);
				$('#y_사용승인일').text("사용승인일: " +resp[0].사용승인일);
				$('#z_건축규모').text("지하 " + resp[0].지하층수 + "층 / 지상 " + resp[0].지상층수 + "층");
				$('#z_주용도').text(resp[0].주용도);				
				
				$('#s_건물명').text(resp[0].건물명);
				$('#y_건물명').text(resp[0].건물명);
				 
				$('#s_위치').text(resp[0].위치);
				$('#y_위치').text(resp[0].위치);
				
				$('#s_대지면적').text(z.toComma(resp[0].대지면적));
				$('#s_연면적').text(z.toComma(resp[0].연면적));
				$('#s_주용도').text(resp[0].주용도);
				$('#s_규모').text("지하 " + resp[0].지하층수 + "층 / 지상 " + resp[0].지상층수 + "층");
				$('#s_주차장').text(resp[0].주차장 + "대 / " + resp[0].승강기 + "대");
			});
		},
		
		updateData: function() {
			var self = this,
				$tbody = $('#tableBodyBuildingComplex').html('')
		},
		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = $('#mapPannel1_a');
				var ws = XLSX.utils.table_to_sheet($table[0], {raw: true, type: 'string'});

				result.resolve(ws);
			});

			return result;
		}		
	};

	// Private functions
	// 매매
	var building_ComplexList_5 = {			
		init: function(ls_pnu) {
			var self = this;
			
			self.ls_pnu = ls_pnu;
			
			document.getElementById('mapPannel1_2').className = 'map-pannel-trading position-fixed w-800px pb-0 d-none flex-column border map-pannel bg-white';
			
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
			param = {
				pnu: ls_pnu,
				xy: ls_xy
			};			
			
			return z.xAsync('dawulmap', 'zeons_매매_상세정보', 'select', param, 'json2').done(function(resp) {
				ls_addr	= '';
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;											
				ls_html	= '';
								
				if(resp[0].위치 == '' && resp[0].대지면적 == 0 || resp == ''){
					$(".mt-n1").css("display","none");					
						ls_html += "<td class='bg-light-secondary py-2' style='padding : inherit;'>데이터가 존재하지 않습니다.</td>";
									
						//$('#' + ls_xy + '').text("매매");
						$('.' + ls_xy + '').html(ls_html);						
						
						$('#o_위치').text('-');
						$('#o_기타용도').text('-');
						$('#o_사용승인일').text('-');
						$('#o_건축규모').text('-');
						$('#o_주용도').text('-');
						$('#o_대지면적').text('-');
						$('#o_건축면적').text('-');
						$('#o_연면적').text('-');
						
						$('#o_건폐율').text('-');
						$('#o_용적률').text('-');
						
						$('#o_a주차').text('-');
						$('#o_b주차').text('-');
						$('#o_c주차').text('-');
						$('#o_d주차').text('-');
						
						$('#o_승강기').text('-');											
						return;
				}
				
				$(".mt-n1").css("display","");
				
				if(resp[0].cnt == '1'){
					$btnFavorite1_2.removeClass('btn-outline-secondary').addClass('btn-danger');														
				}else{
					$btnFavorite1_2.removeClass('btn-danger').addClass('btn-outline-secondary');
				}				
								
				ls_addr	= resp[0].위치;
				
				ls_html += "<table id='tableBodyBuildingComplex_a' class='table table-bordered table-td-right m-0' style='table-layout:fixed;'>";
				ls_html += "<colgroup>";
				ls_html += "<col style='width:120px'>";
				ls_html += "<col style='width:auto'>";
				ls_html += "</colgroup>";
				ls_html += "<tbody>";				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>위치</td>";
				ls_html += "<td class='py-2' style='word-break: keep-all;'>"+ resp[0].위치 +"</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>대지면적</td>";
				ls_html += "<td class='py-2'>"+ z.toComma(Number(resp[0].대지면적)) +"(㎡)</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>연면적</td>";
				ls_html += "<td class='py-2'>"+ z.toComma(Number(resp[0].연면적)) +"(㎡)</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>건폐율/용적율</td>";
				ls_html += "<td class='py-2'>"+ Number(resp[0].건폐율) +"%/" + Number(resp[0].용적율) + "%</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>주용도</td>";
				ls_html += "<td class='py-2'>"+ resp[0].주용도 +"</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>건축규모</td>";
				ls_html += "<td class='py-2'>지상 "+ Number(resp[0].지상층수) +"층/지하 " + Number(resp[0].지하층수) + "층</td>";
				ls_html += "</tr>";
				
				ls_html += "<tr>";
				ls_html += "<td class='bg-light-secondary py-2'>주차</td>";
				ls_html += "<td class='py-2'>총 "+ Number(resp[0].주차장) +"대<br>(자주식 "+ Number(resp[0].자주식) +", 기계식 "+ Number(resp[0].기계식) +")</td>";
				ls_html += "</tr>";				
				ls_html += "</tbody>";
				ls_html += "</table>";				
				
				ls_html += "<table class='table-gray  mt-9'>";
				ls_html += "<thead>";
				ls_html += "<tr>";
				ls_html += "<th>층</th>";
				ls_html += "<th>호</th>";
				ls_html += "<th>매매가<br>(만원)</th>";
				ls_html += "</tr>";
				ls_html += "</thead>";
				ls_html += "<tbody style='font-size: 13px;'>";
				ls_html += "<tr>";
				ls_html += "<td>"+ resp[0].해당층 +"</td>";
				ls_html += "<td>"+ resp[0].호 +"</td>";
				ls_html += "<td>"+ z.toComma(resp[0].매매가) +"</td>";
				ls_html += "</tr>";
				ls_html += "</tbody>";
				ls_html += "</table>";                                                
				/*z.toComma(val.toFixed(1));*/		
				$('.' + ls_xy + '').html(ls_html);
				
				KTUtil.scrollInit($('.' + ls_xy + '')[0], {
					mobileNativeScroll: true,
					handleWindowResize: true
				});
				
				//$('#' + ls_xy + '').text("매매");

				$('#o_위치').text(resp[0].위치);
				//geoCodingSearchArea(resp[0].위치);
				$('#o_기타용도').text(resp[0].주용도);
				$('#o_사용승인일').text(resp[0].사용승인_일);
				$('#o_건축규모').text("지하 " + resp[0].지하층수 + "층 / 지상 " + resp[0].지상층수 + "층");
				$('#o_주용도').text(resp[0].주용도);
				$('#o_대지면적').text(z.toComma(resp[0].대지면적) + " ㎡ (" + z.toComma(Math.round(resp[0].대지면적 / zo.py2m)) + " 평)");
				$('#o_건축면적').text(z.toComma(resp[0].건축면적) + " ㎡ (" + z.toComma(Math.round(resp[0].건축면적 / zo.py2m)) + " 평)");
				$('#o_연면적').text("약 " + z.toComma(resp[0].연면적) + " ㎡ (" + z.toComma(Math.round(resp[0].연면적 / zo.py2m)) + " 평)");
				
				$('#o_건폐율').text(resp[0].건폐율 + " %");
				$('#o_용적률').text(resp[0].용적율 + " %");
				
				$('#o_a주차').text(resp[0].옥내자주식 + "대");
				$('#o_b주차').text(resp[0].옥외자주식 + "대");
				$('#o_c주차').text(resp[0].옥내기계식 + "대");
				$('#o_d주차').text(resp[0].옥외기계식 + "대");
				
				$('#o_승강기').text("승용: " + resp[0].승용_승강기_수 + "기 / 비상용: " + resp[0].비상용_승강기_수 + "기");			
			});
		},		
		updateData: function() {
			var self = this,
				$tbody = $('#tableBodyBuildingComplex').html('')
		},
		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = $('#tableBodyBuildingComplex_a');
				var ws = XLSX.utils.table_to_sheet($table[0], {raw: true, type: 'string'});

				result.resolve(ws);
			});

			return result;
		}			
	};
	
	// Private functions
	// 리맥스 매물
	var remax_MemulList = {			
		init: function(ls_pnu) {
			var self = this;
			
			self.ls_pnu = ls_pnu;
			
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
			param = {
				pnu: ls_pnu
			};			
			
			return z.xAsync('dawulmap', '리맥스_매물정보', 'select', param, 'json2').done(function(resp) {
				self.rawDataArr = resp,
				self.rawDataArrCopy = [];
				
				self.rawDataArrExcel_1 = [];
				self.rawDataArrExcel_2 = [];
				
				self.rawDataArr.filter(function(element, index, array){
					
					if (element.매물구분 == '매매') {
						
						element.층정보항목명 = '매매 층';
						element.면적항목명 = '매매면적';
						element.면적정보 = (element.면적 == '0' ? '-' : z.toComma(element.면적) + '㎡');
						element.전용면적정보 = (element.전용면적 == '0' ? '-' : z.toComma(element.전용면적) + '㎡');
						element.사진보기링크 = (element.이미지여부 == '1' ? '사진 보기 >' : '-');
						element.가격정보1항목명 = '매매가격';
						element.가격정보2항목명 = '월 관리비';
						element.가격정보3항목명 = '총 보증금';
						element.가격정보4항목명 = '월 임대료';
						element.가격정보5항목명 = '';
						element.가격정보6항목명 = '';
						element.가격정보1 = (element.매매가 == '0' ? '-' : z.toComma(element.매매가) + '만원');
						element.가격정보2 = (element.관리비 == '0' ? '-' : z.toComma(element.관리비) + '만원');
						element.가격정보3 = (element.보증금 == '0' ? '-' : z.toComma(element.보증금) + '만원');
						element.가격정보4 = (element.임대료 == '0' ? '-' : z.toComma(element.임대료) + '만원');
						element.가격정보5 = '';
						element.가격정보6 = '';
						element.추가가격정보여부 = false;
						element.매물등록일 = (element.매물등록일자 == '' ? '-' : moment(element.매물등록일자, 'YYYY-MM-DD').format('YYYY-MM-DD'));
						
					} else {
						
						element.층정보항목명 = '임대 층';
						element.면적항목명 = '임대면적';
						element.면적정보 = (element.면적 == '0' ? '-' : z.toComma(element.면적) + '㎡');
						element.전용면적정보 = (element.전용면적 == '0' ? '-' : z.toComma(element.전용면적) + '㎡');
						element.사진보기링크 = (element.이미지여부 == '1' ? '사진 보기 >' : '-');
						element.가격정보1항목명 = '월 임대료';
						element.가격정보2항목명 = '관리비 유형';
						element.가격정보3항목명 = '총 보증금';
						element.가격정보4항목명 = '총 관리비';
						element.가격정보5항목명 = '권리금';
						element.가격정보6항목명 = '평당 관리비';
						element.가격정보1 = (element.임대료 == '0' ? '-' : z.toComma(element.임대료) + '만원');
						element.가격정보2 = element.관리비유형;
						element.가격정보3 = (element.보증금 == '0' ? '-' : z.toComma(element.보증금) + '만원');
						element.가격정보4 = (element.관리비 == '0' ? '-' : z.toComma(element.관리비) + '만원');
						element.가격정보5 = (element.권리금 == '0' ? '-' : z.toComma(element.권리금) + '만원');
						element.가격정보6 = (element.평당관리비 == '0' ? '-' : z.toComma(element.평당관리비) + '원');
						element.추가가격정보여부 = true;
						element.매물등록일 = (element.매물등록일자 == '' ? '-' : moment(element.매물등록일자, 'YYYY-MM-DD').format('YYYY-MM-DD'));
						
					}
					
					var remaxPageNum = Math.floor(index / 10) + 1;
					element.페이지번호 = String(remaxPageNum);
					
					if (remaxPageNum == 1) {
						element.페이지디스플레이 = '';
					} else {
						element.페이지디스플레이 = 'none';
					}
					self.rawDataArrCopy.push(element);
					
					if (element.매물구분 == '매매') {
						self.rawDataArrExcel_1.push(element);
					} else if (element.매물구분 == '임대') {
						self.rawDataArrExcel_2.push(element);
					}
					
				});
			});
		},		
		updateData: function() {
			var self = this,
				$tbody = $('#remaxMemulList').html(''),				
				tmpl = Handlebars.compile($('#tmplRemaxMemulList').html());
				
			$tbody.append(tmpl({memulArr: self.rawDataArrCopy}));
			
			var $tbody_excel_1 = $('#tbodyTableRemax_1').html('');		
			var	tmpl_excel_1 = Handlebars.compile($('#tmplTbodyTableRemax_1').html());
			$tbody_excel_1.append(tmpl_excel_1({memulExcelArr1: self.rawDataArrExcel_1}));
			
			var $tbody_excel_2 = $('#tbodyTableRemax_2').html('');		
			var	tmpl_excel_2 = Handlebars.compile($('#tmplTbodyTableRemax_2').html());
			$tbody_excel_2.append(tmpl_excel_2({memulExcelArr2: self.rawDataArrExcel_2}));
			
			// 매물 더 보기 버튼
			remax_total_cnt = self.rawDataArrCopy.length;
			remax_total_page_cnt = Math.floor(remax_total_cnt / remax_page_size) + 1;
			
			if (remax_total_cnt > remax_page_size) {
				$('#btn_remax_more').show();
			} else {
				$('#btn_remax_more').hide();
			}
		},

		exportSheet_1: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var ws = {};
				if ($('#remaxTab').length > 0 && _GroupCode == '4') {	// 리맥스매물정보가 있고 관리자계정인 경우
					var $table = $('#tableRemax_1');
					ws = XLSX.utils.table_to_sheet($table[0], {raw: true, type: 'string'});
				}
				result.resolve(ws);
			});

			return result;
		},
		
		exportSheet_2: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var ws = {};
				if ($('#remaxTab').length > 0 && _GroupCode == '4') {	// 리맥스매물정보가 있고 관리자계정인 경우
					var $table = $('#tableRemax_2');
					ws = XLSX.utils.table_to_sheet($table[0], {raw: true, type: 'string'});
				}
				result.resolve(ws);
			});

			return result;
		}				
	};
	
	
	/*분양*/
	var _demo_table_1 = function(ls_pnu) {
		building_ComplexList_1.init(ls_pnu);
	};
	
	/*상가면적*/
	var _demo_table_1_1 = function(ls_pnu) {
		building_ComplexList_1_1.init(ls_pnu);
	};
	
	/*건축물현황*/
	var _demo_table_1_2 = function(ls_pnu) {
		building_ComplexList_1_2.init(ls_pnu);
	};
	
	/*임대매물정보_동*/
	var _demo_table_1_3 = function(ls_pnu) {
		building_ComplexList_1_3.init(ls_pnu);
	};
	
	/*임대매물정보_지번*/
	var _demo_table_1_3_1 = function(ls_pnu) {
		building_ComplexList_1_3_1.init(ls_pnu);
	};	
	
	/*매매실거래가정보_동*/
	var _demo_table_1_4 = function(ls_pnu) {
		building_ComplexList_1_4.init(ls_pnu);
	};
	
	/*매매실거래가정보_지번*/
	var _demo_table_1_4_1 = function(ls_pnu) {
		building_ComplexList_1_4_1.init(ls_pnu);
	};	
	
	/*상가업소정보*/
	var _demo_table_1_5 = function(ls_pnu) {
		building_ComplexList_1_5.init(ls_pnu);
	};
	
	/*호구분별분양가정보*/
	var _demo_table_1_6 = function(ls_pnu) {
		building_ComplexList_1_6.init(ls_pnu);
	};	
	
	/*매매매물정보_동*/
	var _demo_table_1_7 = function(ls_pnu) {
		building_ComplexList_1_7.init(ls_pnu);
	};
	
	/*매매매물정보_지번*/
	var _demo_table_1_7_1 = function(ls_pnu) {
		building_ComplexList_1_7_1.init(ls_pnu);
	};		
	
	/*임대료*/
	var _demo_table_2 = function(ls_pnu) {
		building_ComplexList_2.init(ls_pnu);
	};
	
	/*실거래*/
	var _demo_table_3 = function(ls_pnu) {
		building_ComplexList_3.init(ls_pnu);
	};
	/*건물*/
	var _demo_table_4 = function(ls_pnu) {
		building_ComplexList_4.init(ls_pnu);
	};
	/*매매*/
	var _demo_table_5 = function(ls_pnu) {
		building_ComplexList_5.init(ls_pnu);
	};
	
	/*리맥스 매물*/
	var _remax_table = function(ls_pnu) {
		remax_MemulList.init(ls_pnu);
	};
	
	$btnFavorite.click(function() {
		if ($btnFavorite.hasClass('btn-danger')) {
			// 기존 즐겨찾기 삭제
			alert('이미 추가된 즐겨찾기 입니다.');			
			return;
		} else {
			// 신규 즐겨찾기 등록
			$modalFavorite.find('[name="즐겨찾기_제목"]').val('');
			$modalFavorite.modal('show');
		}
	});
	
	$btnFavorite1_2.click(function() {
		if ($btnFavorite1_2.hasClass('btn-danger')) {
			// 기존 즐겨찾기 삭제
			alert('이미 추가된 즐겨찾기 입니다.');
			return;
		} else {
			// 신규 즐겨찾기 등록
			$modalFavorite.find('[name="즐겨찾기_제목"]').val('');
			$modalFavorite.modal('show');
		}
	});
	
	$btnFavorite2.click(function() {
		if ($btnFavorite2.hasClass('btn-danger')) {
			// 기존 즐겨찾기 삭제
			alert('이미 추가된 즐겨찾기 입니다.');
			return;
		} else {
			// 신규 즐겨찾기 등록
			$modalFavorite.find('[name="즐겨찾기_제목"]').val('');
			$modalFavorite.modal('show');
		}
	});	
	
	var fnUpdateFavorite = function($name) {		
		var self = this,
			name = $name.val();		
		
		$.ajax({
			method: 'POST',
			url: '/api/gis/favorite',
			data: {
				'저장유형': 'build',
				'제목': name,
				'설명': ls_addr,
				'좌표X': ls_lat,			//좌포 X값 팝업 클릭시 가져와서 넣어야함
				'좌표Y': ls_lng,			//좌포 Y값 팝업 클릭시 가져와서 넣어야함
				'대표아이디': 'MANAGER',	  //대표 아이디 넣어야 할듯
			}
		}).done(function(resp) {
			if (200 !== resp.code) {
				toastr.error('저장 중 오류가 발생했습니다', '오류', {timeOut: 3000});			
				return;
			}
			
			toastr.success('저장 되었습니다', '즐겨찾기', {timeOut: 3000});
			$modalFavorite.modal('hide');
			
			if(ls_click_name == "분양"){
				$btnFavorite2.removeClass('btn-outline-secondary').addClass('btn-danger');;				
			}else if(ls_click_name == "임대료" || ls_click_name == "매매" || ls_click_name == "실거래"){
				$btnFavorite1_2.removeClass('btn-outline-secondary').addClass('btn-danger');
			}else{
				$btnFavorite.removeClass('btn-outline-secondary').addClass('btn-danger');;
			}			
			
		});
	};
	
	var fnDeleteFavorite = function(seq) {
		var self = this;
		
		z.msgConfirm({
			html: '삭제 하시겠습니까?'
		}).then(function(result) {
			if (result.isConfirmed) {
				$.ajax({
					method: 'POST',
					url: '/api/gis/deleteFavorite',
					data: {
						'순번': seq
					}
				}).done(function(resp) {
					if (200 !== resp.code) {
						toastr.error('오류가 발생했습니다', '오류', {timeOut: 3000});			
						return;
					}
					
					toastr.success('삭제 되었습니다', '즐겨찾기', {timeOut: 3000});

					$btnFavorite.removeAttr('data-seq-favorite');
					$btnFavorite.removeClass('btn-danger').addClass('btn-outline-secondary');
				});
			}
		});
		
	};	
        
	// 평균분양가 차트 관리 객체
	var chartLotAvg = {
		
		init: function(apexChart, $form, ls_pnu) {
			var self = this;
			
			self.ls_pnu = ls_pnu
			self.$form = $form;
			
			// 차트 초기화 퍼블리싱 코드 옮겨옴		
//			const apexChart = "#chart_1_1";
	
			var options = {
				series: [],
				noData: {
					text: 'loading'
				},
				chart: {
					height: 200,
					type: 'line',
					zoom: {
						enabled: false
	                },
	                toolbar: {
	                    show: false
	                },
	            },
	            legend: {
	                show: false
	            },
				dataLabels: { 	
					enabled: false
				},
				stroke: {
	                curve: 'straight',
	                width: 1
				},
				grid: {
					row: {
						colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
						opacity: 0.5
					},
				},
				xaxis: {
					categories: ['2018', '2019', '2020'],
				},
				yaxis: {
					labels: {
						formatter: function(val) {
							return z.toComma(val.toFixed(1));
						}
					}
				},
				colors: [primary, success, info]
			};
			
			if (self.chart) {
				self.chart.destroy();
			}
	
			var chart = new ApexCharts($(apexChart)[0], options);
			
			self.chart = chart;
			
			self.setBtnListener();

			chart.render().then(function() {
				// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
				chart.updateSeries([]);
				self.loadData().done(function(resp) {
					self.loadCondition();
					self.loadXAxis();
					/*self.updateData();*/
				});
			});

		},
		
		// input, form 변경 시 수정사항 정리영역
		// 검색 조건 바뀔 때 + 업데이트 전 파라메터 정리 필요하면 여기에서 실행
		setBtnListener: function() {
			var self = this,
				$form = self.$form;

			// form 검색조건 초기화
			$form.find('select').each(function(idx, elm) {
				var $elm = $(elm);
				
				$elm.val($elm.children('option:first').val());

				$elm.off('change').on('change', function() {
					self.updateData();
				});

				// 초기화로 호출하지 않으면 안되는듯?
//				$elm.selectpicker('refresh');
				$elm.selectpicker('destroy');
				$elm.selectpicker();
			});			
		},
		
		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this;
		},
		
		// 층 정보는 상권 선택에 따라서 동적으로 바뀔 수 있어서 분리함
		loadCondition: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				floorMap = {},
				floorArr = [],
				$floor = self.$form.find('select[name=select_층]');

			for (var i in rawDataArr) {
				floorMap[rawDataArr[i]['층']] = true;
			}
			
			for (var i in floorMap) {
				floorArr.push(i);
			}

			// 기본은 오름차순 정렬
			floorArr.sort();

			$floor.html('').append($('<option/>', {value: '', text: '층'}));
			
			for (var i in floorArr) {
				$floor.append($('<option/>', {value: floorArr[i], text: floorArr[i]}));
			}


			// 초기화로 호출하지 않으면 안되는듯?
//			$floor.selectpicker('refresh');
			$floor.selectpicker('destroy');
			$floor.selectpicker();			
		},

		// x축 기준이 연도별 조회 만 있어서 고정시키는 함수
		loadXAxis: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				xAxisMap = {},
				xAxisArr = [];
				
			
			for (var i in rawDataArr) {
				// 분양일이 YYYY 로 가공돼있음
				xAxisMap[rawDataArr[i]['분양일']] = true;
			}
			
			for (var i in xAxisMap) {
				xAxisArr.push(i);
			}
			
			// 기본은 오름차순 정렬
			xAxisArr.sort();

			// 엑셀 저장용 정보로도 활용될 예정
			self.xAxisArr = xAxisArr;
		},


		// 데이터 정제 후에 updateOptions, updateSeries 호출
		updateData: function() {
			var self = this,
				chartOptions = {
					xaxis: {
						categories: self.xAxisArr
					}
				},
				chartSeries = [],
				$form = self.$form,
				axisColumn = $form.find('[name=select_분류기준]').val();
			
			// 검색조건 값 기준으로 x축, y축 각각 결정해서 데이터 취합
			switch (axisColumn) {
				case 'area':
					self.updateDataByArea(chartOptions, chartSeries);
					break;
				case 'floor':
					self.updateDataByFloor(chartOptions, chartSeries);
					break;
				case 'shop':
				default:
					self.updateDataByShop(chartOptions, chartSeries);
					break;
			}			

			// 엑셀 저장용 정보로도 활용될 예정
			self.yAxisArr = chartSeries;

			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);			
		},
		
		updateDataByShop: function(chartOptions, chartSeries) {
			var self = this,
				$form = self.$form,
				codeUnit = $form.find('[name=select_면적단위]').val(),
				codeArea = $form.find('[name=select_면적구분]').val(),
				codeFloor = $form.find('[name=select_층]').val(),
				prevCodeShop = '',
				prevData = null;
			
			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));			
			
			// 1. 상가유형별 정렬, 2. 층 정렬, 3. x축(연도)별 정렬
			rawDataArr.sort(function(a, b) {
				if (a['상가유형'] !== b['상가유형']) {
					return a['상가유형'] < b['상가유형'];
				}

				if (a['층'] !== b['층']) {
					return a['층'] < b['층'];
				}
				
				return a['분양일'] < b['분양일'];
			});
			
			var cnt = 0, sum = 0, prevYear = '';
			
			for (var i in rawDataArr) {
				var row = rawDataArr[i];
				
				// 특정 층만 계산하는데 층이 다르면 패스
				if (codeFloor && codeFloor != row['층']) {
					continue;
				}

				// 상가유형이 바뀌면 신규 그래프
				if (prevCodeShop !== row['상가유형']) {
					
					// 이전 데이터가 있다면 입력
					if (prevData && cnt) {
						// 소수점 2자리까지 출력
						prevData.data.push(Math.round(100 * sum / cnt) / 100);
					
						prevYear = '';
						cnt = sum = 0;	
					}
					
					prevCodeShop = row['상가유형'];
					prevData = {
						name: prevCodeShop,
						data: []
					};
					
					chartSeries.push(prevData);
				}

				// 분양가 연도가 바뀌면 이전 데이터 평균내고 새로 입력
				if (prevYear && prevYear !== row['분양일']) {
					// 소수점 2자리까지 출력
					prevData.data.push(Math.round(100 * sum / cnt) / 100);
					
					// 변경된 다음부터는 1베이스 합산
					prevYear = row['분양일'];
					cnt = 1;
					sum = row['분양가'];
				} else {
					if (! prevYear) {
						prevYear = row['분양일'];
					}
					
					cnt++;
					sum += row['분양가'];
				}
				
			}

			// 마지막줄 추가
			// 소수점 2자리까지 출력
			if (cnt) {
				prevData.data.push(Math.round(100 * sum / cnt) / 100);
			}

			if (! chartSeries.length) {
				chartOptions.noData = {
					text: '검색된 데이터가 없습니다'
				};
			}
		},

		updateDataByArea: function(chartOptions, chartSeries) {},

		updateDataByFloor: function(chartOptions, chartSeries) {
			var self = this,
				$form = self.$form,
				codeUnit = $form.find('[name=select_면적단위]').val(),
				codeArea = $form.find('[name=select_면적구분]').val(),
				codeFloor = $form.find('[name=select_층]').val(),
				prevCodeFloor = '',
				prevData = null;
			
			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));			
			
			// 1. 층 정렬, 2. 상가유형별 정렬, 3. x축(연도)별 정렬
			rawDataArr.sort(function(a, b) {
				if (a['층'] !== b['층']) {
					if (a['층'] < b['층']) {
						return -1;
					} else {
						return 1;
					}
				}

				if (a['상가유형'] !== b['상가유형']) {
					if (a['상가유형'] < b['상가유형']) {
						return -1;
					} else {
						return 1;
					}
				}
				
				if (a['분양일'] !== b['분양일']) {
					if (a['분양일'] < b['분양일']) {
						return -1;
					} else {
						return 1;
					}
				}

				return 0;
			});
			
			var cnt = 0, sum = 0, prevYear = '';
			
			for (var i in rawDataArr) {
				var row = rawDataArr[i];

				// 층이 바뀌면 신규 그래프
				if (prevCodeFloor !== row['층']) {
					
					// 이전 데이터가 있다면 입력
					if (prevData && cnt) {
						// 소수점 2자리까지 출력
						prevData.data.push(Math.round(100 * sum / cnt) / 100);
					
						prevYear = '';
						cnt = sum = 0;	
					}
					
					prevCodeFloor = row['층'];
					prevData = {
						name: prevCodeFloor,
						data: []
					};
					
					chartSeries.push(prevData);
				}

				// 분양가 연도가 바뀌면 이전 데이터 평균내고 새로 입력
				if (prevYear && prevYear !== row['분양일']) {
					// 소수점 2자리까지 출력
					prevData.data.push(Math.round(100 * sum / cnt) / 100);

					// 변경된 다음부터는 1베이스 합산
					prevYear = row['분양일'];
					cnt = 1;
					sum = row['분양가'];
				} else {
					if (! prevYear) {
						prevYear = row['분양일'];
					}
					
					cnt++;
					sum += row['분양가'];
				}
				
			}
			
			// 마지막줄 추가
			// 소수점 2자리까지 출력
			if (cnt) {
				prevData.data.push(Math.round(100 * sum / cnt) / 100);
			}

			if (! chartSeries.length) {
				chartOptions.noData = {
					text: '검색된 데이터가 없습니다'
				};
			}
		},
		
		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = self.xAxisArr,
				yAxisArr = self.yAxisArr,
				excelData = [],
				excelOpt = {header: ["평균분양가"]};
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {

				for (var i in xAxisArr) {
					excelOpt.header.push(xAxisArr[i]);
				}
				
				// 헤더 표시가 필요 없는 경우 아래의 1줄 추가
//				excelOpt.header.skipHeader = true;
				
				// json_to_sheet 방식은 한줄의 각 key 값이 첫째줄 헤더의 key 와 일치하는 위치에 표시됨
				for (var i in yAxisArr) {
					var row = {},
						y = yAxisArr[i];
					
					row['평균분양가'] = y.name;
					
					for (var j in y.data) {
						row[xAxisArr[j]] = y.data[j];
					}
					excelData.push(row);
				}
				var ws = XLSX.utils.json_to_sheet(excelData, excelOpt);
				
				// FIXME: colspan, rowspan 필요한 경우 여기에 추가
				/**
					예시: 1~2행 0셀, 3~4행 0셀 merge
					const merge = [
					  { s: { r: 1, c: 0 }, e: { r: 2, c: 0 } },{ s: { r: 3, c: 0 }, e: { r: 4, c: 0 } },
					];
					ws["!merges"] = merge;
				*/
					
				result.resolve(ws);
			});
			return result;
		}
	};

	// 평균임대료 차트 관리 객체
	var chartRentAvg = {
		
		init: function(apexChart, $form, ls_pnu) {
			var self = this;
			
			self.ls_pnu = ls_pnu
			self.$form = $form;
			
			// 차트 초기화 퍼블리싱 코드 옮겨옴		
			var options = {
				series: [{
					name: 'B1',
					data: [1200, 2300, 1200]
				}, {
					name: '1F',
					data: [12000, 22000, 12000]
				}, {
					name: '2F',
					data: [8000, 7500, 8000]
				}, {
					name: '3F이상',
					data: [3000, 3400, 3000]
				}],
				noData: {
					text: 'loading'
				},
				chart: {
					height: 200,
	                type: 'bar',
	                toolbar: {
	                    show: false
	                },
	            },
	            legend: {
	                show: false
	            },
	            plotOptions: {
					bar: {
						horizontal: false,
						columnWidth: '55%',
						endingShape: 'rounded'
					},
				},
				dataLabels: {
					enabled: false
				},
				stroke: {
					show: true,
					width: 2,
					colors: ['transparent']
				},
				xaxis: {
					categories: ['2018', '2019', '2020'],
				},
				colors: [primary, success, info, warning]
			};
			
			if (self.chart) {
				self.chart.destroy();
			}
	
			var chart = new ApexCharts($(apexChart)[0], options);
			
			self.chart = chart;
			
			self.setBtnListener();

			chart.render().then(function() {
				// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
				chart.updateSeries([]);
				self.loadData().done(function(resp) {
					self.loadCondition();
					self.loadXAxis();
					self.updateData();
				});
			});

		},
		
		// input, form 변경 시 수정사항 정리영역
		// 검색 조건 바뀔 때 + 업데이트 전 파라메터 정리 필요하면 여기에서 실행
		setBtnListener: function() {
			var self = this,
				$form = self.$form;

			// form 검색조건 초기화
			$form.find('select').each(function(idx, elm) {
				var $elm = $(elm);
				
				$elm.val($elm.children('option:first').val());

				$elm.off('change').on('change', function() {
					self.updateData();
				});

				$elm.selectpicker('destroy');
				$elm.selectpicker();
			});			
		},
		
		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this;
		},
		
		// 층 정보는 상권 선택에 따라서 동적으로 바뀔 수 있어서 분리함
		loadCondition: function() {
		},

		// x축 기준이 연도별 조회 만 있어서 고정시키는 함수
		loadXAxis: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				xAxisMap = {},
				xAxisArr = [];
				
			for (var i in rawDataArr) {
				// 계약월이 YYYY 로 가공돼있음
				xAxisMap[rawDataArr[i]['계약월']] = true;
			}
			
			for (var i in xAxisMap) {
				xAxisArr.push(i);
			}
			
			// 기본은 오름차순 정렬
			xAxisArr.sort();

			// 엑셀 저장용 정보로도 활용될 예정
			self.xAxisArr = xAxisArr;
		},


		// 데이터 정제 후에 updateOptions, updateSeries 호출
		updateData: function() {
			var self = this,
				chartOptions = {
					xaxis: {
						categories: self.xAxisArr
					}
				},
				chartSeries = [],
				$form = self.$form,
				axisColumn = $form.find('[name=select_분류기준]').val();
			
			// 검색조건 값 기준으로 x축, y축 각각 결정해서 데이터 취합
			switch (axisColumn) {
				default:
					self.updateDataByFloor(chartOptions, chartSeries);
					break;
			}			

			// 엑셀 저장용 정보로도 활용될 예정
			self.yAxisArr = chartSeries;

			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);			
		},
		
		updateDataByFloor: function(chartOptions, chartSeries) {
			var self = this,
				$form = self.$form,
				codeUnit = $form.find('[name=select_면적단위]').val(),
				codeArea = $form.find('[name=select_면적구분]').val(),
				codeFloor = $form.find('[name=select_층]').val(),
				prevCodeFloor = '',
				prevData = null;
			
			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));			
			
			// 1. 층 정렬, 2. x축(연도)별  
			rawDataArr.sort(function(a, b) {
				if (a['층'] !== b['층']) {
					if (a['층'] < b['층']) {
						return -1;
					} else {
						return 1;
					}
				}
				
				if (a['계약월'] !== b['계약월']) {
					if (a['계약월'] < b['계약월']) {
						return -1;
					} else {
						return 1;
					}
				}

				return 0;
			});

			var cnt = 0, sum = 0, prevYear = '';
			
			for (var i in rawDataArr) {
				var row = rawDataArr[i];
				
				// 특정 층만 계산하는데 층이 다르면 패스
				if (codeFloor && codeFloor != row['층']) {
					continue;
				}

				// 층이 바뀌면 신규 그래프
				if (prevCodeFloor !== row['층']) {
					
					// 이전 데이터가 있다면 입력
					if (prevData && cnt) {
						// 소수점 2자리까지 출력
						prevData.data.push(Math.round(100 * sum / cnt) / 100);
					
						prevYear = '';
						cnt = sum = 0;	
					}
					
					prevCodeFloor = row['층'];
					prevData = {
						name: prevCodeFloor,
						data: []
					};
					
					chartSeries.push(prevData);
				}

				// 계약월 연도가 바뀌면 이전 데이터 평균내고 새로 입력
				if (prevYear && prevYear !== row['계약월']) {
					// 소수점 2자리까지 출력
					prevData.data.push(Math.round(100 * sum / cnt) / 100);
					
					// 변경된 다음부터는 1베이스 합산
					prevYear = row['계약월'];
					cnt = 1;
					sum = row['임대료'];
				} else {
					if (! prevYear) {
						prevYear = row['계약월'];
					}
					
					cnt++;
					sum += row['임대료'];
				}
				
			}

			// 마지막줄 추가
			// 소수점 2자리까지 출력
			if (cnt) {
				prevData.data.push(Math.round(100 * sum / cnt) / 100);
			}
			
			if (! chartSeries.length) {
				chartOptions.noData = {
					text: '검색된 데이터가 없습니다'
				};
			}

		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = self.xAxisArr,
				yAxisArr = self.yAxisArr,
				excelData = [],
				excelOpt = {header: ["평균임대료"]};
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {

				for (var i in xAxisArr) {
					excelOpt.header.push(xAxisArr[i]);
				}
				
				// 헤더 표시가 필요 없는 경우 아래의 1줄 추가
//				excelOpt.header.skipHeader = true;
				
				// json_to_sheet 방식은 한줄의 각 key 값이 첫째줄 헤더의 key 와 일치하는 위치에 표시됨
				for (var i in yAxisArr) {
					var row = {},
						y = yAxisArr[i];
					
					row['평균임대료'] = y.name;
					
					for (var j in y.data) {
						row[xAxisArr[j]] = y.data[j];
					}
					
					excelData.push(row);
				} 
				
				var ws = XLSX.utils.json_to_sheet(excelData, excelOpt);
					
				result.resolve(ws);
			});
			return result;
		}
	};	
	
	// 업종 현황 차트 관리 객체
	var chartIndustry = {
		
		init: function(apexChart, $form) {
			var self = this;
			
			self.deferred = $.Deferred();
			
			self.$form = $form;

			// 최근 3년만 조회
			self.endYMD = moment().endOf('quarter');
			self.startYMD = self.endYMD.clone().subtract(11, 'quarter').startOf('quarter');
			

			// 차트 초기화 퍼블리싱 코드 옮겨옴		
			var options = {
				series: [{
					name: '2020',
					data: [10, 12, 11, 4, 20, 40, 10, 50]
				}],
				noData: {
					text: 'loading'
				},
			    chart: {
			        type: 'line',
	                toolbar: {
	                    show: true,
						offsetY: -32,
						offsetX: -30
	                },
			        width: 500,
			        height: 320,
			        zoom: {
			            enabled: false,
			        },
			        offsetX: 15,
					events: {
						click: function(event, chartContext, config) {
				    		var $target = $(event.target);
				    		if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
				    			z.addDownloadLog('업종 현황', 'chart');
				    		}
			           	}
					}
			    },
				xaxis: {
					categories: ['관광/여가/오락', '부동산', '생활서비스', '소매', '숙박', '스포츠', '음식', '학문/교육'],
					tooltip: {
						enabled: false
					}
				},
			    colors: ['#5e58c9','#2985d2','#2eb7c4','#6d9d64','#b5bf1b','#f1c644','#f28f6c', '#e55d81'],
			    stroke: {
			        show: true,
			        width: 2,
			        dashArray: 0,
			    },
			    markers: {
			        size: 5,
			        colors: ['#5e58c9','#2985d2', '#2eb7c4','#6d9d64','#b5bf1b','#f1c644','#f28f6c', '#e55d81'],
			        strokeColors: '#fff',
			        strokeWidth: 2,
			        strokeOpacity: 0.9,
			        shape: "circle",
			        radius: 2,
			        offsetX: 0,
			        offsetY: 0,
			    },
			    tooltip: {
					y: {
						formatter: function(value) {
							return z.toComma(value) + ' 개소';
						}
					}
				},
			    legend: {
			        show: true,
			        fontSize: '10px',
			        fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
			        fontWeight: 400,
			        inverseOrder: false,
			        horizontalAlign: 'left',
			        offsetX: 0,
			        offsetY: 5,
			        labels: {
			            useSeriesColors: false
			        },
			        markers: {
			            width: 8,
			            height: 8,
			            strokeWidth: 0,
			            strokeColor: '#fff',
			            radius: 12,
			            offsetX: 0,
			            offsetY: 0
			        },
			        itemMargin: {
			            horizontal: 30,
			            vertical: 0
			        },
			        onItemClick: {
			            toggleDataSeries: true
			        },
			        onItemHover: {
			            highlightDataSeries: true
			        },
			    },			    
				yaxis: {
					labels: {
						formatter: function(value) {
							return z.toComma(value);
						}
					}
				}
			};
			
			if (self.chart) {
				self.chart.destroy();
			}
	
			var chart = new ApexCharts($(apexChart)[0], options);
			
			self.chart = chart;
			
			self.setBtnListener();

			chart.render().then(function() {
				// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
				chart.updateSeries([]);
				self.loadData().done(function(resp) {
					self.loadXAxis();
					self.updateData();
				}).always(function() {
					self.deferred.resolve();
				});
			});

			z.formatDataReference('업종').done(function(refText) {
				$(apexChart).closest('.position-relative').find('.reference').text(refText);
			});
			
			return self.deferred;
		},
		
		// input, form 변경 시 수정사항 정리영역
		// 검색 조건 바뀔 때 + 업데이트 전 파라메터 정리 필요하면 여기에서 실행
		// 2023년 업종코드 변경으로 인해 selecbox 추가 
		setBtnListener: function() {
			var self = this,
				$form = self.$form,
				$selectYear = $form.find('[name=select_업종현황]');

			$selectYear.val('2022');
			$selectYear.selectpicker('refresh');

			$selectYear.off('change').on('change', function(evt, idx, isSelected) {
				$selectYear.selectpicker('refresh');

				self.updateData();
			});
		},
		
		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
			param = {
					pnu: ls_pnu,
					sidonm: ls_sidonm,
					sggnm: ls_sggnm,
					dongnm: ls_dongnm,
					xy: ls_xy,
					startYMD: self.startYMD.format('YYYYMM'),
					endYMD: self.endYMD.format('YYYYMM')
				};
				
			return z.xAsync('dawulmap', 'zeons_업종분포V2', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;

				var yyyyQTxt = '',
					yyyyQ = '';
				for (var i in resp) {
					var row = resp[i];
					if (row['기준월']) {
						yyyyQ = moment(row['기준월'], 'YYYYMM');
						yyyyQTxt = yyyyQ.format('YYYY.Q[Q]');
						yyyyQ = yyyyQ.format('YYYYQ');
						break;
					}
				}

				// 기준월이 없는 경우 (= 데이터 없는경우) 는 이번달로 표시
				// 월별표시 > 쿼터표시 로 변경됨
				if (! yyyyQ) {
					yyyyQTxt = moment().format('YYYY.Q[Q]');
					yyyyQ = moment().format('YYYYQ');
				}
				
				for (var i in resp) {
					var row = resp[i];
					
					if (! row['기준월']) {
						row['기준월'] = yyyyQTxt;
						row['기준월N'] = yyyyQ;
					} else {
						row['기준월'] = moment(row['기준월'], 'YYYYMM');
						row['기준월N'] = row['기준월'].format('YYYYQ');
						row['기준월'] = row['기준월'].format('YYYY.Q[Q]');
					}
				}
			});
		},
		
		loadCondition: function() {
		},

		loadXAxis: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				xAxisArr = [],
				prevQ = '';
				
			// 쿼터별로 정렬 후 unique 값 추출
			// 정렬 순서
			// 1. 기준월, 2. 대분류명
			rawDataArr = rawDataArr.sort(function(a, b) {
				if (a['기준월'] !== b['기준월']) {
					if (a['기준월'] < b['기준월']) {
						return -1;
					}
					return 1;
				}
				if (a['대분류명'] !== b['대분류명']) {
					if (a['대분류명'] < b['대분류명']) {
						return -1;
					}
					return 1;
				}

				return 0;
			});
			
			// 기준월 최대값, 최소값 사이에 빈칸 채워넣기
			var diffTime = self.endYMD.diff(self.startYMD, 'quarters') + 1;
			
			var tmp = self.startYMD.clone();
			
			for (var i = 0; diffTime > i; ++i) {
				xAxisArr.push(tmp.format('YYYY.Q[Q]'));
				tmp.add(1, 'quarter');
			}

			// 엑셀 저장용 정보로도 활용될 예정
			self.xAxisArr = xAxisArr;
		},


		// 데이터 정제 후에 updateOptions, updateSeries 호출
		updateData: function() {
			var self = this,
				$form = self.$form,
				$selectYear = $form.find('[name=select_업종현황]')
				selectedYear = $selectYear.val();
				xAxisArr = [],
				xAxisArr_old = [],
				xAxisArr_new = [],
				yAxisArr_old = [],
				yAxisArr_new = [],
				row_old = {},
				row_new = {},
				chartSeries_old = [],
				chartSeries_new = [];

			for(let i in self.xAxisArr) {
				if(self.xAxisArr[i].substring(0, 4) <= '2022') {
					xAxisArr_old.push(self.xAxisArr[i]);
				} else if (self.xAxisArr[i].substring(0, 4) >= '2023') {
					xAxisArr_new.push(self.xAxisArr[i]);
				}
			}
			self.xAxisArr_old = xAxisArr_old,
			self.xAxisArr_new = xAxisArr_new;

			// 2022년 이전
			for(let i in industryTypeArr_old) {
				row_old = {
					name: industryTypeArr_old[i],
					data: Array.apply(null, Array(xAxisArr_old.length)).map(function() {return 0;})
				} 
				chartSeries_old.push(row_old);
			}

			// 2023년 이후 
			for(let i in industryTypeArr_new) {
				row_new = {
					name: industryTypeArr_new[i],
					data: Array.apply(null, Array(xAxisArr_new.length)).map(function() {return 0;})
				} 
				chartSeries_new.push(row_new);
			}
			var	chartOptions = {
					xaxis: {
						categories: (selectedYear == '2022' ? xAxisArr_old : xAxisArr_new)
					}
				},
				chartSeries = (selectedYear == '2022' ? chartSeries_old : chartSeries_new);

			industryTypeArr = (selectedYear == '2022' ? industryTypeArr_old : industryTypeArr_new);
			
			self.updateDataByIndustry(chartOptions, chartSeries);


			// 엑셀 저장용 정보로도 활용될 예정
			self.yAxisArr_old = chartSeries_old;
			self.yAxisArr_new = chartSeries_new;
			self.yAxisArr = chartSeries;

			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);			
		},
		
		updateDataByIndustry: function(chartOptions, chartSeries) {
			var self = this,
				$form = self.$form,
				$selectYear = $form.find('[name=select_업종현황]'),
				selectedYear = $selectYear.val();

			// 원본 복사 후 복사본 정렬
			var rawDataArr_old = [],
				rawDataArr_new = [];
			for(let i in self.rawDataArr) {
				if(self.rawDataArr[i]['기준월'].substring(0, 4) <= '2022') {
					rawDataArr_old.push(self.rawDataArr[i]);
				} else if(self.rawDataArr[i]['기준월'].substring(0,4) >= '2023') {
					rawDataArr_new.push(self.rawDataArr[i]);
				}
			}

			var xAxisArr_old = self.xAxisArr_old,
				xAxisArr_new = self.xAxisArr_new,
				row_old = [],
				row_new = [];

			for(let i in rawDataArr_old) {
				row_old = rawDataArr_old[i],
				idxIndustry = industryTypeMap_old[row_old['대분류명']],
				idxQ = xAxisArr_old.indexOf(row_old['기준월']);

				chartSeries_old[idxIndustry].data[idxQ] += parseInt(row_old['지점수']);
			}

			for(let i in rawDataArr_new) {
				row_new = rawDataArr_new[i],
				idxIndustry = industryTypeMap_new[row_new['대분류명']],
				idxQ = xAxisArr_new.indexOf(row_new['기준월']);

				chartSeries_new[idxIndustry].data[idxQ] += parseInt(row_new['지점수']);
			}

		},

		exportSheet_1: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = self.xAxisArr_old,
				yAxisArr = self.yAxisArr_old,
				excelData = [],
				excelOpt = {header: ["업종분포"]};
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {

				for (var i in xAxisArr) {
					if(xAxisArr[i].substring(0,4) <= '2022') {
						excelOpt.header.push(xAxisArr[i]);
					}
				}
				
				// 헤더 표시가 필요 없는 경우 아래의 1줄 추가
//				excelOpt.header.skipHeader = true;
				
				// json_to_sheet 방식은 한줄의 각 key 값이 첫째줄 헤더의 key 와 일치하는 위치에 표시됨
				for (var i in yAxisArr) {
					var row = {},
						y = yAxisArr[i];
					
					row['업종분포'] = y.name;
					
					for (var j in y.data) {
						row[xAxisArr[j]] = y.data[j];
					}
					excelData.push(row);
				} 
				
				var ws = XLSX.utils.json_to_sheet(excelData, excelOpt);
					
				result.resolve(ws);
			});

			return result;
		},
		exportSheet_2: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = self.xAxisArr_new,
				yAxisArr = self.yAxisArr_new,
				excelData = [],
				excelOpt = {header: ["업종분포"]};

			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {

				for (var i in xAxisArr) {
					if(xAxisArr[i].substring(0,4) >= '2023') {
						excelOpt.header.push(xAxisArr[i]);
					}
				}
				
				// 헤더 표시가 필요 없는 경우 아래의 1줄 추가
//				excelOpt.header.skipHeader = true;
				
				// json_to_sheet 방식은 한줄의 각 key 값이 첫째줄 헤더의 key 와 일치하는 위치에 표시됨
				for (var i in yAxisArr) {
					var row = {},
						y = yAxisArr[i];
					
					row['업종분포'] = y.name;
					
					for (var j in y.data) {
						row[xAxisArr[j]] = y.data[j];
					}
					
					excelData.push(row);
				}
				var ws = XLSX.utils.json_to_sheet(excelData, excelOpt);
					
				result.resolve(ws);
			});

			return result;
		}
	};
	
	
	
	// 업종별 매출 추이
	var chartLobzIndustry = {
		
		init: function(apexChart) {
			var self = this;
			
			self.deferred = $.Deferred();
			self.minYear = moment().subtract(4, 'years').year();
			self.maxYear = self.minYear + 3;
			
			// 차트 초기화 퍼블리싱 코드 옮겨옴		
			var options = {
				chartID: '업종별 매출 추이',
				series: [{
					name: '2019',
					data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				}],
			    chart: {
			        type: 'bar',
					width: 500,
			        height: 410,
			        toolbar: {
			            show: true,
			            offsetY: -32,
						offsetX: -10
			        },
					offsetX: 20,
					events: {
						click: function(event, chartContext, config) {
							config.globals.chartID = options.chartID;

				    		var $target = $(event.target);
				    		if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
				    			z.addDownloadLog('업종별 매출', 'chart');
				    		}
			           	}
					}
			    },
			    legend: {
			        show: true,
			        fontSize: '10px',
			        fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
			        fontWeight: 400,
			        inverseOrder: false,
			        horizontalAlign: 'left',
			        offsetX: 36,
			        offsetY: 8,
			        labels: {
			            useSeriesColors: false
			        },
			        markers: {
			            width: 8,
			            height: 8,
			            strokeWidth: 0,
			            strokeColor: '#fff',
			            radius: 12,
			            offsetX: 0,
			            offsetY: 0
			        },
			        itemMargin: {
			            horizontal: 30,
			            vertical: 0
			        },
			    },
	            plotOptions: {
					bar: {
						horizontal: true
					},
				},
			    grid: {
			        show: false,
			    },				
			    stroke: {
			        show: true,
			        width: 1,
			        colors: ['transparent']
			    },
			    dataLabels: {
			        enabled: false,
			    },			    
				tooltip: {
			        shared: true,
			        intersect: false,					
					y: {
						formatter: function(value, point) {
//							return z.toComma(value * 10000);
							var txt = z.toComma(value) + ' 억원';
							
							if (self.yAxisArr) {
								var cnt = self.yAxisArr[point.seriesIndex].cnt[point.dataPointIndex],
									amt = self.yAxisArr[point.seriesIndex].amt[point.dataPointIndex];
								
								txt += ' (현대카드매출 : ' +z.toComma(amt)+ '억원 / ' +z.toComma(cnt)+ ' 건)'; 
							}
							return txt;
						}
					}
				},
				xaxis: {
					categories: industryTypeSKArr,
					labels: {
			            show: true,
			            align: 'left',
			            minWidth: 0,
			            maxWidth: 80,
			            style: {
			                colors: ['#888'],
			                fontSize: '12px',
			                fontFamily: 'Helvetica, Arial, sans-serif',
			                fontWeight: 400,
			                cssClass: 'apexcharts-yaxis-label',
			            },				
			            axisBorder: {
			                show: true,
			            },
			            axisTicks: {
			                show: false,
			            },			            
						formatter: function(value) {
							return z.toComma(value);
						}
					}
	            },
	            colors: ['#8176d4','#4d5dbe','#2985d2','#2eb7c4','#4cd3c5']
			};
			
			if (self.chart) {
				self.chart.destroy();
			}

			var chart = new ApexCharts($(apexChart)[0], options);
			
			self.chart = chart;
			
			self.setBtnListener();

			chart.render().then(function() {
				// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
				chart.updateSeries([]);
				self.loadData().done(function(resp) {
					self.loadXAxis();
					self.updateData();
				}).always(function() {
					self.deferred.resolve();
				});
			});

			z.formatDataReference('매출').done(function(refText) {
				$(apexChart).closest('.position-relative').find('.reference').text(refText);
			});
						
			return self.deferred;

		},
		
		// input, form 변경 시 수정사항 정리영역
		// 검색 조건 바뀔 때 + 업데이트 전 파라메터 정리 필요하면 여기에서 실행
		setBtnListener: function() {
			var self = this;
		},
		
		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function(isFromCache) {
			var self = this,
				param = {					
					minYear: self.minYear,
					pnu: ls_pnu,
					sidonm: ls_sidonm,
					sggnm: ls_sggnm,
					dongnm: ls_dongnm					
				};
				
			if (! isFromCache) {
				self.deferredData = $.Deferred();
				
				z.xAsync('dawulmap', 'zeons_업종별매출추이', 'select', param, 'json2').done(function(resp) {
					
					self.rawDataArr = resp;
					
					var minYear = self.minYear;
					
					for (var i in self.rawDataArr) {
						// 업종코드 F_의료 가 0 으로 돼있어서 한칸씩 shift
						var row = self.rawDataArr[i];
						
						row['업종코드'] = parseInt(row['업종코드']) - 1;
						
						if (0 > row['업종코드']) {
							row['업종코드'] = 9;
						}
						
						row['년도순번'] = parseInt(row['년도']) - minYear;
					}
					
					self.deferredData.resolve(self.rawDataArr);
				});				
			}

			return self.deferredData;
		},
		
		loadCondition: function() {
		},


		loadXAxis: function() {
			var self = this,
				xAxisArr = [self.minYear, self.minYear + 1, self.minYear + 2, self.minYear + 3, self.minYear + 4];
				
			// 엑셀 저장용 정보로도 활용될 예정
			self.xAxisArr = xAxisArr;
		},


		// 데이터 정제 후에 updateOptions, updateSeries 호출
		updateData: function() {
			var self = this,
				chartOptions = {
					xaxis: {
						categories: industryTypeSKArr
					}
				},
				chartSeries = [];

			for (var i in self.xAxisArr) {
				var row = {
					name: self.xAxisArr[i],
					data: Array.apply(null, Array(industryTypeSKArr.length)).map(function() {return 0;}),
					cnt: Array.apply(null, Array(industryTypeSKArr.length)).map(function() {return 0;}),
					amt: Array.apply(null, Array(industryTypeSKArr.length)).map(function() {return 0;})
				};
				
				chartSeries.push(row);
			}

			self.updateDataByIndustry(chartOptions, chartSeries);

			// 엑셀 저장용 정보로도 활용될 예정
			self.yAxisArr = chartSeries;
			
			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);			
		},
		
		updateDataByIndustry: function(chartOptions, chartSeries) {
			var self = this;

			for (var i in self.rawDataArr) {
				var row = self.rawDataArr[i],
					series = chartSeries[row['년도순번']];
				
				series.data[row['업종코드']] += parseFloat(row['매출']);
				series.cnt[row['업종코드']] += parseFloat(row['건']);
				series.amt[row['업종코드']] += parseFloat(row['카드매출']);
			}
			
			// 평균 후 만원단위 반올림 > 평균 제외 > 억원단위 반올림
			for (var i in chartSeries) {
				var row = chartSeries[i].data,
					cnt = chartSeries[i].cnt,
					amt = chartSeries[i].amt;
				
				for (var j in row) {
					row[j] = Math.round(row[j] / 100000000);
					amt[j] = Math.round(amt[j] / 100000000);
				}
			}
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = industryTypeSKArr,
				yAxisArr = self.yAxisArr,
				excelData = [],
				excelOpt = {header: ['업종별 매출']};
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {

				for (var i in xAxisArr) {
					excelOpt.header.push(xAxisArr[i]);
				}
				
				// 헤더 표시가 필요 없는 경우 아래의 1줄 추가
//				excelOpt.header.skipHeader = true;
				
				// json_to_sheet 방식은 한줄의 각 key 값이 첫째줄 헤더의 key 와 일치하는 위치에 표시됨
				for (var i in yAxisArr) {
					var row = {},
						y = yAxisArr[i];
					
					row['업종별 매출'] = y.name;
					
					for (var j in y.data) {
						row[xAxisArr[j]] = y.data[j];
					}
					
					excelData.push(row);
				} 
				
				
				var ws = XLSX.utils.json_to_sheet(excelData, excelOpt);
					
				result.resolve(ws);
			});
			
			return result;
		}
	};
	
	// 총 매출 추이
	var chartLobzTotal = {
		
		init: function(apexChart, $form) {
			var self = this;
			
			self.$form = $form;
			self.minYear = moment().subtract(4, 'years').year();
			self.maxYear = self.minYear + 3;			
			
			// 차트 초기화 퍼블리싱 코드 옮겨옴		
			var options = {
				series: [{
					name: '총 매출',
					data: [0, 0, 0]
				}],
			    chart: {
			        type: 'line',
			        width: 480,
			        height: 270,
			        zoom: {
			            enabled: false,
			        },
	                toolbar: {
	                    show: true,
						offsetY: -38,
						offsetX: 16
	                },
					offsetX: 40,
					events: {
						click: function(event, chartContext, config) {
				    		var $target = $(event.target);
				    		if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
				    			z.addDownloadLog('총 매출', 'chart');
				    		}
			           	}
					}
			    },
				legend: {
					showForSingleSeries: true,
					showForNullSeries: true
				},
	            plotOptions: {
					bar: {
						horizontal: false
					},
				},
				dataLabels: {
					enabled: false
				},
				stroke: {
					show: true,
					width: 2
				},
				markers: {
					size: 5,
					hover: {
						size: 7
					}
				},
				tooltip: {
					y: {
						formatter: function(value, point) {
							var txt = z.toComma(value) + ' 억원';
							
							if (self.yAxisArr) {
								var cnt = self.yAxisArr[point.seriesIndex].cnt[point.dataPointIndex],
									amt = self.yAxisArr[point.seriesIndex].amt[point.dataPointIndex];
							
								txt += ' (현대카드매출 : ' +z.toComma(amt)+ '억원 / ' +z.toComma(cnt)+ ' 건)'; 
							}
							return txt;
						}
					}
				},
				xaxis: {
					categories: [self.minYear, self.minYear + 1, self.minYear + 2, self.minYear + 3, self.minYear + 4],
			        tickPlacement: 'between',
					tooltip: {
						enabled: false
					}
	            },
				yaxis: {
					labels: {
						formatter: function(value) {
							return z.toComma(value);
						}
					}
				},
			    markers: {
			        size: 8,
			        colors: ['#5e58c9'],
			        strokeColors: '#fff',
			        strokeWidth: 2,
			        strokeOpacity: 0.9,
			        shape: "circle",
			        radius: 2,
			        offsetX: 0,
			        offsetY: 0,
			    },
			    legend: {
			        show: false,
			        markers: {
			            width: 8,
			            height: 8,
			            strokeWidth: 0,
			            strokeColor: '#fff',
			            radius: 12,
			            offsetX: 0,
			            offsetY: 20
			        },
			    },				
				colors: ['#5e58c9']
			};
			
			if (self.chart) {
				self.chart.destroy();
			}

			var chart = new ApexCharts($(apexChart)[0], options);
			
			self.chart = chart;
			
			self.setBtnListener();

			chart.render().then(function() {
				// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
				chart.updateSeries([]);
				self.loadData().done(function(resp) {
					self.loadXAxis();
					self.updateData();
				});
			});

			z.formatDataReference('매출').done(function(refText) {
				$(apexChart).closest('.position-relative').find('.reference').text(refText);
			});			
		},
		
		// input, form 변경 시 수정사항 정리영역
		// 검색 조건 바뀔 때 + 업데이트 전 파라메터 정리 필요하면 여기에서 실행
		setBtnListener: function() {
			var self = this,
				$form = self.$form,
				$selectIndustry = $form.find('[name=select_업종구분]');
				
			$selectIndustry.val('');
			$selectIndustry.selectpicker('refresh');
			
			$selectIndustry.off('changed.bs.select').on('changed.bs.select', function(evt, idx, isSelected) {
				var $optAll = $selectIndustry.find('[value=""]'),
					$liAll = $selectIndustry.parent('.dropdown').find('ul.dropdown-menu li:first');
	
				if (isSelected) {
					if (0 === idx) {
						$selectIndustry.selectpicker('deselectAll');
						$optAll.prop('selected', true);
						$liAll.addClass('selected');
					} else {
						$optAll.prop('selected', false);
						$liAll.removeClass('selected');
					}
				} else if (false === isSelected) {
					var valueArr = $selectIndustry.val();
					
					if (! valueArr || ! valueArr.length) {
						$optAll.prop('selected', true);
						$liAll.addClass('selected');
					}
				}
				
				$selectIndustry.selectpicker('refresh');
	
				self.updateData();
			});
		},
		
		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
				param = {					
					minYear: self.minYear
				};
			return chartLobzIndustry.loadData(true).done(function(resp) {				
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;
			});
		},
		
		loadCondition: function() {
		},


		loadXAxis: function() {
			var self = this,
				xAxisArr = [self.minYear, self.minYear + 1, self.minYear + 2, self.minYear + 3, self.minYear + 4];
				
			// 엑셀 저장용 정보로도 활용될 예정
			self.xAxisArr = xAxisArr;
		},


		// 데이터 정제 후에 updateOptions, updateSeries 호출
		updateData: function() {
			var self = this,
				chartOptions = {
					xaxis: {
						categories: self.xAxisArr
					}
				},
				chartSeries = [];

			var row = {
				name: '총 매출',
				data: Array.apply(null, Array(self.xAxisArr.length)).map(function() {return 0;}),
				cnt: Array.apply(null, Array(self.xAxisArr.length)).map(function() {return 0;}),
				amt: Array.apply(null, Array(self.xAxisArr.length)).map(function() {return 0;})
			};
			
			chartSeries.push(row);

			self.updateDataTotal(chartOptions, chartSeries);

			// 엑셀 저장용 정보로도 활용될 예정
			self.yAxisArr = chartSeries;
			
			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);			
		},
		
		updateDataTotal: function(chartOptions, chartSeries) {
			var self = this,
				$form = self.$form,
				$selectIndustry = $form.find('[name=select_업종구분]'),
				industryArr = $selectIndustry.val(),
				isAll = ! industryArr.length || ! industryArr[0];

			for (var i in self.rawDataArr) {
				var row = self.rawDataArr[i],
					series = chartSeries[0];
					
				if (! isAll) {
					if (0 > industryArr.indexOf('' + row['업종코드'])) {
						continue;
					}
				}
				
				series.data[row['년도순번']] += parseFloat(row['매출']);
				series.cnt[row['년도순번']] += parseFloat(row['건']);
				series.amt[row['년도순번']] += parseFloat(row['카드매출']);
			}
			
			// 평균 후 만원단위 반올림 > 평균 제외 > 억원단위 반올림
			for (var i in chartSeries) {
				var row = chartSeries[i].data,
					amt = chartSeries[i].amt;
				
				for (var j in row) {
					row[j] = Math.round(row[j] / 100000000);
					amt[j] = Math.round(amt[j] / 100000000);
				}
			}
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = self.xAxisArr,
				yAxisArr = self.yAxisArr,
				excelData = [],
				excelOpt = {header: ['총 매출']};
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				for (var i in yAxisArr) {
					var row = {},
						y = yAxisArr[i];
					
					row['총 매출'] = y.name;
					
					for (var j in y.data) {
						row[xAxisArr[j]] = y.data[j];
					}

					excelData.push(row);
				} 
				var ws = XLSX.utils.json_to_sheet(excelData, excelOpt);
					
				result.resolve(ws);
			});
			return result;
		}
	};	
	
	// 20230712 
	// 최근 5개년 거주인구 성별 * 연령별 차트 관리 객체
	var chartDwlPopGenderAge = {
		
		init: function(apexChart) {
			var self = this;
			
			// 차트 초기화 퍼블리싱 코드 옮겨옴		
			var options = {
				chartID: '거주인구 성별*연령별',
				series: [],
				noData: {
					text: 'loading'
				},
				chart: {
			        type: 'bar',
					width: 500,
			        height: 450,
			        toolbar: {
			            show: true,
			            offsetY: -32,
						offsetX: -10
			        },
					offsetX: 10,
					events: {
						click: function(event, chartContext, config) {
							config.globals.chartID = options.chartID;

				    		var $target = $(event.target);
				    		if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
				    			z.addDownloadLog('거주인구:성별x연령별', 'chart');
				    		}
			           	}
					}
			    },
				legend: {
			        show: true,
			        fontSize: '10px',
			        fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
			        fontWeight: 400,
			        inverseOrder: false,
			        horizontalAlign: 'left',
			        offsetX: 36,
			        offsetY: 8,
			        labels: {
			            useSeriesColors: false
			        },
			        markers: {
			            width: 8,
			            height: 8,
			            strokeWidth: 0,
			            strokeColor: '#fff',
			            radius: 12,
			            offsetX: 0,
			            offsetY: 0
			        },
			        itemMargin: {
			            horizontal: 20,
			            vertical: 0
			        },
			    },
				plotOptions: {
			        bar: {
			            horizontal: true,
			        },
			    },
				grid: {
			        show: false,
			    },
				stroke: {
					show: true,
			        width: 1,
			        colors: ['transparent']
			    },
				dataLabels: {
			        enabled: false,
			    },
				tooltip: {
			        shared: true,
			        intersect: false,
					  y: {
						    formatter: function (val) {
						    	return z.toComma(Math.floor(val)) + ' 명';
							}
						  }
			    },
				xaxis: {
					categories: ['10대미만(남)', '10대(남)', '20대(남)', '30대(남)', '40대(남)', '50대(남)', '60대이상(남)', 
								 '10대미만(여)', '10대(여)', '20대(여)', '30대(여)', '40대(여)', '50대(여)', '60대이상(여)'],
			        axisBorder: {
			            show: true,
			        },
			        axisTicks: {
			            show: true,
						axisTicks: {
							show: true,
						},
			        },
			        labels: {
			            show: true,
			        },					
					labels: {
						formatter: function(value) {
							return z.toComma(value);
						}
					}
				},
				colors: ['#8176d4','#4d5dbe','#2985d2','#2eb7c4','#4cd3c5'],
			    yaxis: {
			        show: true,
			        axisTicks: {
			            show: false,
			        },
			    },
			    
			};
			
			if (self.chart) {
				self.chart.destroy();
			}
			
			var chart = new ApexCharts($(apexChart)[0], options);
			
			self.chart = chart;
			
			self.setBtnListener();

			chart.render().then(function() {
				// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
				chart.updateSeries([]);
				self.loadData().done(function(resp) {
					self.loadXAxis();
					self.updateData();
				});
			});

			z.formatDataReference('인구').done(function(refText) {
				$(apexChart).closest('.position-relative').find('.reference').text(refText);
			});
		},
		
		// input, form 변경 시 수정사항 정리영역
		// 검색 조건 바뀔 때 + 업데이트 전 파라메터 정리 필요하면 여기에서 실행
		setBtnListener: function() {
		},
		
		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this;

			return chartPopDaily.loadData(true).done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				resp = $.extend(true, [], resp);
				
				// 불필요 데이터 제외
				self.rawDataArr = resp;
			
			});
		},
		
		loadCondition: function() {
		},
		loadXAxis: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				endYear = moment().year(),
				xAxisArr = [endYear - 4, endYear - 3, endYear - 2, endYear - 1, endYear];

			// 엑셀 저장용 정보로도 활용될 예정
			self.xAxisArr = xAxisArr;
			self.xAxisColumnArr = ['거주_남성_10l', '거주_남성_10', '거주_남성_20', '거주_남성_30', '거주_남성_40', '거주_남성_50', '거주_남성_60u', 
								   '거주_여성_10l', '거주_여성_10', '거주_여성_20', '거주_여성_30', '거주_여성_40', '거주_여성_50', '거주_여성_60u']
			self.xAxisGenderArr = ['10대미만(남)', '10대(남)', '20대(남)', '30대(남)', '40대(남)', '50대(남)', '60대이상(남)', 
								   '10대미만(여)', '10대(여)', '20대(여)', '30대(여)', '40대(여)', '50대(여)', '60대이상(여)']
		},


		// 데이터 정제 후에 updateOptions, updateSeries 호출
		updateData: function() {
			var self = this,
				chartOptions = {
					xaxis: {
						categories: self.xAxisGenderArr
					}
				},
				chartSeries = [];
				
			for (var i in self.xAxisArr) {
				var row = {
					name: self.xAxisArr[i],
					data: Array.apply(null, Array(self.xAxisGenderArr.length)).map(function() {return 0;}),
					cnt: Array.apply(null, Array(self.xAxisGenderArr.length)).map(function() {return 0;})
				};
				
				chartSeries.push(row);
			}

			self.updateDataByGender(chartOptions, chartSeries);

			// 엑셀 저장용 정보로도 활용될 예정
			self.yAxisArr = chartSeries;

			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);			
		},
		
		updateDataByGender: function(chartOptions, chartSeries) {
			var self = this;

			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));

			// 인구수 소수점 버림으로 수정됨
			for (var i in rawDataArr) {
				var row = rawDataArr[i];

				for(var j in row) {
					if (0 > j.indexOf('거주')) {
						continue;
					}

					if (isNaN(parseInt(row[j]))) {
						continue;
					}

					var idxGenderColumn = self.xAxisColumnArr.indexOf(j);

					for(var k in chartSeries) {
						if(chartSeries[k].name == row['기준월'].substring(0,4)) {
							chartSeries[k].data[idxGenderColumn] += parseInt(row[j]);
							chartSeries[k].cnt[idxGenderColumn] += 1;
						}
					}
				}
			};
			

			// 소수점 2자리까지 출력
			for (var i in chartSeries) {
				var data = chartSeries[i].data,
					cnt = chartSeries[i].cnt;
				
				for (var j in data) {
					if (cnt[j]) {
						data[j] = Math.floor(data[j] / cnt[j]);
					}
				}
			}

			if (! chartSeries.length) {
				chartOptions.noData = {
					text: '검색된 데이터가 없습니다'
				};
			}			
		},
		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = self.xAxisArr,
				yAxisArr = self.yAxisArr,
				excelData = [],
				excelOpt = {header: ['성별']};
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {

				for (var i in xAxisArr) {
					excelOpt.header.push(xAxisArr[i]);
				}
				
				// 헤더 표시가 필요 없는 경우 아래의 1줄 추가
//				excelOpt.header.skipHeader = true;
				
				// json_to_sheet 방식은 한줄의 각 key 값이 첫째줄 헤더의 key 와 일치하는 위치에 표시됨
				for (var i in yAxisArr) {
					var row = {},
						y = yAxisArr[i];
					
					row['성별'] = y.name;
					
					for (var j in y.data) {
						row[xAxisArr[j]] = y.data[j];
					}
					
					excelData.push(row);
				} 
				var ws = XLSX.utils.json_to_sheet(excelData, excelOpt);
					
				result.resolve(ws);
			});
			return result;
		}
	};
	
	// 인구 일별 차트 관리 객체
	var chartPopDaily = {
		
		init: function(apexChart) {
			var self = this;
			
			self.deferred = $.Deferred();			

			self.endYMD = moment().format('YYYYMM');
			// 20230712 최근 5개년으로 수정 
			self.startYMD = moment().startOf('year').add(-48, 'months').format('YYYYMM');
			
			// 차트 초기화 퍼블리싱 코드 옮겨옴		
			var options = {
				series: [{
					name: '요일별',
					data: [14, 20, 50, 12, 22, 30, 40]
				}],
				chart: {
					height: 200,
	                type: 'bar',
	                toolbar: {
	                    show: false
	                },
	            },
				legend: {
					showForSingleSeries: true,
					showForNullSeries: true
				},
	            plotOptions: {
					bar: {
						horizontal: false,
						columnWidth: '55%',
						endingShape: 'rounded'
					},
				},
				dataLabels: {
					enabled: false
				},
				stroke: {
					show: true,
					width: 2,
					colors: ['transparent']
				},
				xaxis: {
					categories: ['월', '화', '수', '목', '금', '토', '일'],
	            },
	            yaxis: {
	                show: false,
	            },
	            colors: ['#8176d4','#4d5dbe','#2985d2','#2eb7c4','#4cd3c5','#60bd85', '#609057']
			};
			
			if (self.chart) {
				self.chart.destroy();
			}

			var chart = new ApexCharts($(apexChart)[0], options);
			
			self.chart = chart;
			
			self.setBtnListener();

			chart.render().then(function() {
				// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
				chart.updateSeries([]);
				self.loadData().done(function(resp) {
					self.loadXAxis();
					self.updateData();
				}).always(function() {
					self.deferred.resolve();
				});
			});

			return self.deferred;
		},
		
		// input, form 변경 시 수정사항 정리영역
		// 검색 조건 바뀔 때 + 업데이트 전 파라메터 정리 필요하면 여기에서 실행
		setBtnListener: function() {
		},
		
		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function(isFromCache) {
			var self = this,
			param = {					
					pnu: ls_pnu,
					sidonm: ls_sidonm,
					sggnm: ls_sggnm,
					dongnm: ls_dongnm,
					startYMD: self.startYMD,
					endYMD: self.endYMD
				};
			
			if (! isFromCache) { 
				self.deferredData = $.Deferred();

				z.xAsync('dawulmap', '인구정보', 'select', param, 'json2').done(function(resp) {
					// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
					self.rawResp = resp;

					// 불필요 데이터 제외
					self.rawDataArr = resp;
					
					self.deferredData.resolve(resp);
				});
				
			}
			return self.deferredData;
		},
		
		loadCondition: function() {
		},

		loadXAxis: function() {
			var self = this,
				xAxisArr = [
					'00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
					'10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
					'20', '21', '22', '23'
				];
				
			// 엑셀 저장용 정보로도 활용될 예정
			self.xAxisArr = xAxisArr;
		},


		// 데이터 정제 후에 updateOptions, updateSeries 호출
		updateData: function() {
			var self = this,
				chartOptions = {
					xaxis: {
						categories: self.xAxisArr
					}
				},
				chartSeries = [];

			self.updateDataByWeekday(chartOptions, chartSeries);

			// 엑셀 저장용 정보로도 활용될 예정
			self.yAxisArr = chartSeries;
			
			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);			
		},
		
		updateDataByWeekday: function(chartOptions, chartSeries) {
			var self = this,
				prevCodeYm = '',
				prevData = null;

			var resp = $.extend(true, [], self.rawDataArr);
			var yyyymm = '';

			for (var i in resp) {
				var row = resp[i];
				
				if (row['기준월']) {
					yyyymm = row['기준월'];
					break;
				}
			}
			
			// 기준월이 없는 경우 (= 데이터 없는경우) 는 이번달로 표시
			if (! yyyymm) {
				yyyymm = moment().format('YYYYMM');
			}
			
			for (var i in resp) {
				var row = resp[i];
				
				if (! row['기준월']) {
					row['기준월'] = yyyymm;
				}
			}
			
			// FIXME: 일단 합산조회...
			self.sumObj = {
				'유동_시간_00' : 0,
				'유동_시간_01' : 0,
				'유동_시간_02' : 0,
				'유동_시간_03' : 0,
				'유동_시간_04' : 0,
				'유동_시간_05' : 0,
				'유동_시간_06' : 0,
				'유동_시간_07' : 0,
				'유동_시간_08' : 0,
				'유동_시간_09' : 0,
				'유동_시간_10' : 0,
				'유동_시간_11' : 0,
				'유동_시간_12' : 0,
				'유동_시간_13' : 0,
				'유동_시간_14' : 0,
				'유동_시간_15' : 0,
				'유동_시간_16' : 0,
				'유동_시간_17' : 0,
				'유동_시간_18' : 0,
				'유동_시간_19' : 0,
				'유동_시간_20' : 0,
				'유동_시간_21' : 0,
				'유동_시간_22' : 0,
				'유동_시간_23' : 0
			};
			
			for (var i in resp) {
				var row = resp[i];
				
				for (var j in self.sumObj) {
					self.sumObj[j] += parseFloat(row[j] || 0);
				}
			}
			
			if (resp.length) {
				var cnt = resp.length;
				
				for (var j in self.sumObj) {
					// 소수점 2자리까지 출력
					self.sumObj[j] = Math.round(100 * self.sumObj[j] / cnt);
				}
			}
			
			
			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.sumObj));			

			prevData = {
				name: '유동인구',
				data: []
			};
			
			chartSeries.push(prevData);
			
			for (var i in self.xAxisArr) {
				var row = self.xAxisArr[i];

				prevData.data.push(rawDataArr['유동_시간_' + row]);
			}

		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred(),
				xAxisArr = self.xAxisArr,
				yAxisArr = self.yAxisArr,
				excelData = [],
				excelOpt = {header: ['업종분포']};
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {

				for (var i in xAxisArr) {
					excelOpt.header.push(xAxisArr[i]);
				}
				
				// 헤더 표시가 필요 없는 경우 아래의 1줄 추가
//				excelOpt.header.skipHeader = true;
				
				// json_to_sheet 방식은 한줄의 각 key 값이 첫째줄 헤더의 key 와 일치하는 위치에 표시됨
				for (var i in yAxisArr) {
					var row = {},
						y = yAxisArr[i];
					
					row['업종분포'] = y.name;
					
					for (var j in y.data) {
						row[xAxisArr[j]] = y.data[j];
					}
					
					excelData.push(row);
				}
				var ws = XLSX.utils.json_to_sheet(excelData, excelOpt);
					
				result.resolve(ws);
			});
			
			return result;
		}
	};	
	
	// 20230712 
	// 최근 5개년 직장인구 성별 * 연령별 차트 관리 객체
	var chartWorkPopGenderAge = {
		
		init: function(apexChart) {
			var self = this;
			
			// 차트 초기화 퍼블리싱 코드 옮겨옴		
			var options = {
				chartID: '직장인구 성별*연령별',
				series: [],
				noData: {
					text: 'loading'
				},
			    chart: {
			        type: 'bar',
					width: 500,
			        height: 410,
			        toolbar: {
			            show: true,
			            offsetY: -32,
						offsetX: -10
			        },
					offsetX: 20,
					events: {
						click: function(event, chartContext, config) {
				    		config.globals.chartID = options.chartID;

				    		var $target = $(event.target);
				    		if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
				    			z.addDownloadLog('직장인구:성별x연령별', 'chart');
				    		}
			           	}
					}
			    },
				legend: {
			        show: true,
			        fontSize: '10px',
			        fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
			        fontWeight: 400,
			        inverseOrder: false,
			        horizontalAlign: 'left',
			        offsetX: 36,
			        offsetY: 8,
			        labels: {
			            useSeriesColors: false
			        },
			        markers: {
			            width: 8,
			            height: 8,
			            strokeWidth: 0,
			            strokeColor: '#fff',
			            radius: 12,
			            offsetX: 0,
			            offsetY: 0
			        },
			        itemMargin: {
			            horizontal: 30,
			            vertical: 0
			        },
			    },
				plotOptions: {
			        bar: {
			            horizontal: true,
			        },
			    },
				grid: {
			        show: false,
			    },
				stroke: {
			        show: true,
			        width: 1,
			        colors: ['transparent']
			    },
				dataLabels: {
			        enabled: false,
			    },
				tooltip: {
			        shared: true,
			        intersect: false,
					  y: {
						    formatter: function (val) {
						    	return z.toComma(Math.floor(val)) + ' 명';
							}
						  }
			    },
				xaxis: {
					categories: ['20대(남)', '30대(남)', '40대(남)', '50대(남)', '60대이상(남)',
								 '20대(여)', '30대(여)', '40대(여)', '50대(여)', '60대이상(여)'],
			        axisBorder: {
			            show: true,
			        },
			        axisTicks: {
			            show: true,
			        },
			        labels: {
			            show: true,
			        },					
					labels: {
						formatter: function(value) {
							return z.toComma(value);
						}
					}
				},
			    colors: ['#8176d4','#4d5dbe','#2985d2','#2eb7c4','#4cd3c5'],
			    yaxis: {
			        show: true,
			        axisTicks: {
			            show: false,
			        },
			    },
			    		    
			};
			
			if (self.chart) {
				self.chart.destroy();
			}
			
			var chart = new ApexCharts($(apexChart)[0], options);
			
			self.chart = chart;
			
			self.setBtnListener();

			chart.render().then(function() {
				// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
				chart.updateSeries([]);
				self.loadData().done(function(resp) {
					self.loadXAxis();
					self.updateData();
				});
			});

			z.formatDataReference('인구').done(function(refText) {
				$(apexChart).closest('.position-relative').find('.reference').text(refText);
			});
		},
		
		// input, form 변경 시 수정사항 정리영역
		// 검색 조건 바뀔 때 + 업데이트 전 파라메터 정리 필요하면 여기에서 실행
		setBtnListener: function() {
		},
		
		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this;
				
			return chartPopDaily.loadData(true).done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				resp = $.extend(true, [], resp);
				
				// 불필요 데이터 제외
				self.rawDataArr = resp;
			});
		},
		loadCondition: function() {
		},
		loadXAxis: function() {
			var self = this,
				endYear = moment().year(),
				xAxisArr = [endYear - 4, endYear - 3, endYear - 2, endYear - 1, endYear];
				

			// 엑셀 저장용 정보로도 활용될 예정
			self.xAxisArr = xAxisArr;
			self.xAxisColumnArr = ['직장_남성_20', '직장_남성_30', '직장_남성_40', '직장_남성_50', '직장_남성_60u', 
								   '직장_여성_20', '직장_여성_30', '직장_여성_40', '직장_여성_50', '직장_여성_60u']
			self.xAxisGenderArr = ['20대(남)', '30대(남)', '40대(남)', '50대(남)', '60대이상(남)', 
								   '20대(여)', '30대(여)', '40대(여)', '50대(여)', '60대이상(여)']
		},


		// 데이터 정제 후에 updateOptions, updateSeries 호출
		updateData: function() {
			var self = this,
				chartOptions = {
					xaxis: {
						categories: self.xAxisGenderArr
					}
				},
				chartSeries = [];

			for (var i in self.xAxisArr) {
				var row = {
					name: self.xAxisArr[i],
					data: Array.apply(null, Array(self.xAxisGenderArr.length)).map(function() {return 0;}),
					cnt: Array.apply(null, Array(self.xAxisGenderArr.length)).map(function() {return 0;})
				};
				
				chartSeries.push(row);
			}
			
			self.updateDataByGender(chartOptions, chartSeries);

			// 엑셀 저장용 정보로도 활용될 예정
			self.yAxisArr = chartSeries;
			
			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);			
		},
		
		updateDataByGender: function(chartOptions, chartSeries) {
			var self = this;
			
			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));

			// 인구수 소수점 버림으로 수정됨
			for (var i in rawDataArr) {
				var row = rawDataArr[i];

				for(var j in row) {
					if (0 > j.indexOf('직장')) {
						continue;
					}

					if (isNaN(parseInt(row[j]))) {
						continue;
					}

					var idxGenderColumn = self.xAxisColumnArr.indexOf(j);

					for(var k in chartSeries) {
						if(chartSeries[k].name == row['기준월'].substring(0,4)) {
							chartSeries[k].data[idxGenderColumn] += parseInt(row[j]);
							chartSeries[k].cnt[idxGenderColumn] += 1;
						}
					}
				}
			};

			// 소수점 2자리까지 출력
			for (var i in chartSeries) {
				var data = chartSeries[i].data,
					cnt = chartSeries[i].cnt;
				
				for (var j in data) {
					if (cnt[j]) {
						data[j] = Math.floor(data[j] / cnt[j]);
					}
				}
			}
			
			if (! chartSeries.length) {
				chartOptions.noData = {
					text: '검색된 데이터가 없습니다'
				};
			}
		},

		exportSheet: function() {
			var self = this,
			result = $.Deferred(),
			xAxisArr = self.xAxisGenderArr,
			yAxisArr = self.yAxisArr,
			excelData = [],
			excelOpt = {header: ['성별x연령별']};
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				for (var i in xAxisArr) {
					excelOpt.header.push(xAxisArr[i]);
				}
				
				// 헤더 표시가 필요 없는 경우 아래의 1줄 추가
//				excelOpt.header.skipHeader = true;
				
				// json_to_sheet 방식은 한줄의 각 key 값이 첫째줄 헤더의 key 와 일치하는 위치에 표시됨
				for (var i in yAxisArr) {
					var row = {},
						y = yAxisArr[i];
					
					row['성별x연령별'] = y.name;
					
					for (var j in y.data) {
						row[xAxisArr[j]] = y.data[j];
					}
					excelData.push(row);
				} 
				
				var ws = XLSX.utils.json_to_sheet(excelData, excelOpt);
					
				result.resolve(ws);
			});
			return result;
		}
	};


	// 20230712 
	// 최근 5개년 유동인구 성별 * 연령별 차트 관리 객체
	var chartFlowPopGenderAge = {
		
		init: function(apexChart) {
			var self = this;
			
			// 차트 초기화 퍼블리싱 코드 옮겨옴		
			var options = {
				chartID: '유동인구 성별*연령별',
				series: [],
				noData: {
					text: 'loading'
				},
			    chart: {
			        type: 'bar',
					width: 500,
			        height: 410,
			        toolbar: {
			            show: true,
			            offsetY: -32,
						offsetX: -10
			        },
					offsetX: 20,
					events: {
						click: function(event, chartContext, config) {
				    		config.globals.chartID = options.chartID;

				    		var $target = $(event.target);
				    		if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
				    			z.addDownloadLog('유동인구:성별x연령별', 'chart');
				    		}
			           	}
					}
			    },
			    colors: ['#8176d4','#4d5dbe','#2985d2','#2eb7c4','#4cd3c5'],
			    plotOptions: {
			        bar: {
			            horizontal: true,
			        },
			    },
			    dataLabels: {
			        enabled: false,
			    },
			    stroke: {
			        width: 1,
			        colors: ['transparent']
			    },
				xaxis: {
					categories: ['10대(남)', '20대(남)', '30대(남)', '40대(남)', '50대(남)', '60대이상(남)', 
							     '10대(여)', '20대(여)', '30대(여)', '40대(여)', '50대(여)', '60대이상(여)'],
			        axisBorder: {
			            show: true,
			        },
			        axisTicks: {
			            show: true,
			        },
			        labels: {
			            show: true,
			        },					
					labels: {
						formatter: function(value) {
							return z.toComma(value);
						}
					}
				},
			    grid: {
			        show: false,
			    },
			    yaxis: {
			        show: true,
			        axisTicks: {
			            show: false,
			        },
			    },
			    tooltip: {
			        shared: true,
			        intersect: false,
					  y: {
						    formatter: function (val) {
						    	return z.toComma(Math.floor(val)) + ' 명';
							}
						  }
			    },			    
			    legend: {
			        show: true,
			        fontSize: '10px',
			        fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
			        fontWeight: 400,
			        inverseOrder: false,
			        verticalAlign: 'bottom',
			        horizontalAlign: 'left',
			        offsetX: 36,
			        offsetY: 8,
			        labels: {
			            useSeriesColors: false
			        },
			        markers: {
			            width: 8,
			            height: 8,
			            strokeWidth: 0,
			            strokeColor: '#fff',
			            radius: 12,
			            offsetX: 0,
			            offsetY: 0
			        },
			        itemMargin: {
			            horizontal: 30,
			            vertical: 0
			        },
			    },
			};
			
			if (self.chart) {
				self.chart.destroy();
			}
			
			var chart = new ApexCharts($(apexChart)[0], options);
			
			self.chart = chart;
			
			self.setBtnListener();

			chart.render().then(function() {
				// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
				chart.updateSeries([]);
				self.loadData().done(function(resp) {
					self.loadXAxis();
					self.updateData();
				});
			});

			z.formatDataReference('인구').done(function(refText) {
				$(apexChart).closest('.position-relative').find('.reference').text(refText);
			});
		},
		
		// input, form 변경 시 수정사항 정리영역
		// 검색 조건 바뀔 때 + 업데이트 전 파라메터 정리 필요하면 여기에서 실행
		setBtnListener: function() {
		},
		
		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this;
				
			return chartPopDaily.loadData(true).done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				resp = $.extend(true, [], resp);
				
				// 불필요 데이터 제외
				self.rawDataArr = resp;
			});
		},
		loadCondition: function() {
		},
		loadXAxis: function() {
			var self = this,
				endYear = moment().year(),
				xAxisArr = [endYear - 4, endYear - 3, endYear - 2, endYear - 1, endYear];

			// 엑셀 저장용 정보로도 활용될 예정
			self.xAxisArr = xAxisArr;
			self.xAxisColumnArr = ['유동_남성_10', '유동_남성_20', '유동_남성_30', '유동_남성_40', '유동_남성_50', '유동_남성_60u', 
								   '유동_여성_10', '유동_여성_20', '유동_여성_30', '유동_여성_40', '유동_여성_50', '유동_여성_60u']
			self.xAxisGenderArr = ['10대(남)', '20대(남)', '30대(남)', '40대(남)', '50대(남)', '60대이상(남)', 
								   '10대(여)', '20대(여)', '30대(여)', '40대(여)', '50대(여)', '60대이상(여)']
		},

		// 데이터 정제 후에 updateOptions, updateSeries 호출
		updateData: function() {
			var self = this,
				chartOptions = {
					xaxis: {
						categories: self.xAxisGenderArr
					}
				},
				chartSeries = [];

			for (var i in self.xAxisArr) {
				var row = {
					name: self.xAxisArr[i],
					data: Array.apply(null, Array(self.xAxisGenderArr.length)).map(function() {return 0;}),
					cnt: Array.apply(null, Array(self.xAxisGenderArr.length)).map(function() {return 0;})
				};
				chartSeries.push(row);
			}
			
			self.updateDataByGender(chartOptions, chartSeries);

			// 엑셀 저장용 정보로도 활용될 예정
			self.yAxisArr = chartSeries;
			
			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);			
		},
		
		updateDataByGender: function(chartOptions, chartSeries) {
			var self = this;
			
			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));

			// 인구수 소수점 버림으로 수정됨
			for (var i in rawDataArr) {
				var row = rawDataArr[i];

				for(var j in row) {
					if (0 > j.indexOf('유동')) {
						continue;
					}

					if (isNaN(parseInt(row[j]))) {
						continue;
					}

					var idxGenderColumn = self.xAxisColumnArr.indexOf(j);

					if(0 > idxGenderColumn) {
						continue;
					}

					for(var k in chartSeries) {
						if(chartSeries[k].name == row['기준월'].substring(0,4)) {
							chartSeries[k].data[idxGenderColumn] += parseInt(row[j]);
							chartSeries[k].cnt[idxGenderColumn] += 1;
						}
					}
				}
			};

			// 소수점 2자리까지 출력
			for (var i in chartSeries) {
				var data = chartSeries[i].data,
					cnt = chartSeries[i].cnt;
				
				for (var j in data) {
					if (cnt[j]) {
						data[j] = Math.floor(data[j] / cnt[j]);
					}
				}
			}
			
			if (! chartSeries.length) {
				chartOptions.noData = {
					text: '검색된 데이터가 없습니다'
				};
			}
		},

		exportSheet: function() {
			var self = this,
			result = $.Deferred(),
			xAxisArr = self.xAxisGenderArr,
			yAxisArr = self.yAxisArr,
			excelData = [],
			excelOpt = {header: ['성별x연령별']};
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {

				for (var i in xAxisArr) {
					excelOpt.header.push(xAxisArr[i]);
				}
				
				// 헤더 표시가 필요 없는 경우 아래의 1줄 추가
//				excelOpt.header.skipHeader = true;
				
				// json_to_sheet 방식은 한줄의 각 key 값이 첫째줄 헤더의 key 와 일치하는 위치에 표시됨
				for (var i in yAxisArr) {
					var row = {},
						y = yAxisArr[i];
					
					row['성별x연령별'] = y.name;
					
					for (var j in y.data) {
						row[xAxisArr[j]] = y.data[j];
					}
					excelData.push(row);
				} 
				
				var ws = XLSX.utils.json_to_sheet(excelData, excelOpt);
					
				result.resolve(ws);
			});
			
			return result;
		}
	};


	// 유동인구: 요일 x 시간대별
	var chartPopFlowTime = {		
		init: function(apexChart) {
			var self = this;

			// 전체 조회 > 최근 3년만 조회 > 올해 데이터만 조회 > 데이터가 있는 마지막 연도 조회 > 최근 1년만 조회
			self.endYMD = moment().endOf('year');
			self.startYMD = self.endYMD.clone().startOf('year');

			// 차트 초기화 퍼블리싱 코드 옮겨옴		
			var options = {
				chartID: '유동인구 요일*시간대별',
				series: [],
				noData: {
					text: 'loading'
				},
				chart: {
			        width: 510,
			        height: 330,
					type: 'bar',
					stacked: true,
					zoom: {
						enabled: false
					},
			        offsetX: 40,
			        toolbar: {
			            show: true,
			            offsetY: -30,
			            offsetX: 0
			        },
					events: {
						click: function(event, chartContext, config) {
				    		config.globals.chartID = options.chartID;

				    		var $target = $(event.target);		
				    		if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
				    			z.addDownloadLog('유동인구:시간별', 'chart');
				    		}
			           	}
					}
				},
				tooltip: {
					y: {
						formatter: function(value) {
							return z.toComma(value) + ' 명';
						}
					}
				},
				plotOptions: {
					bar: {
						horizontal: true
					},
				},
				dataLabels: {
					enabled: false
				},
				grid: {
					show: false,
					xaxis: {
						lines: {
							show: true
						}
					}, 
					yaxis: {
						lines: {
							show: true
						}
					}, 
				},
				xaxis: {
					categories: ['일', '월', '화', '수', '목', '금', '토'],
					labels: {
						formatter: function(value) {
							return z.toComma(value);
						}
					}
				},
				colors: ['#8176d4','#4d5dbe','#2985d2','#2eb7c4','#4cd3c5','#60bd85', '#609057'],
			    legend: {
			        show: true,
			        fontSize: '10px',
			        fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
			        fontWeight: 400,
			        inverseOrder: false,
			        verticalAlign: 'bottom',
			        horizontalAlign: 'left',
			        offsetX: 0,
			        offsetY: 0,
			        labels: {
			            useSeriesColors: false
			        },
			        markers: {
			            width: 8,
			            height: 8,
			            strokeWidth: 0,
			            strokeColor: '#fff',
			            radius: 12,
			            offsetX: 0,
			            offsetY: 0
			        },
			        itemMargin: {
			            horizontal: 15,
			            vertical: 0
			        },
			    },
			};
			
			if (self.chart) {
				self.chart.destroy();
			}
			
			var chart = new ApexCharts($(apexChart)[0], options);
			
			self.chart = chart;
			
			self.setBtnListener();

			chart.render().then(function() {
				// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
				chart.updateSeries([]);
				self.loadData().done(function(resp) {
					self.loadXAxis();
					self.updateData();
				});
			});

			z.formatDataReference('인구').done(function(refText) {
				$(apexChart).closest('.position-relative').find('.reference').text(refText);
			});
		},
		
		// input, form 변경 시 수정사항 정리영역
		// 검색 조건 바뀔 때 + 업데이트 전 파라메터 정리 필요하면 여기에서 실행
		setBtnListener: function() {
		},
		
		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
				param = {
					pnu: ls_pnu.substring(0, 10),
					startYMD: self.startYMD.format('YYYY'),
					endYMD: self.endYMD.format('YYYY'),
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
					demoLdongcd: _DemoLdongcd,
				};

			return z.xAsync('BlockStatOracle', '유동인구_시간별', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;
			});
		},
		
		loadCondition: function() {
		},


		loadXAxis: function() {
			var self = this;

			// 엑셀 저장용 정보로도 활용될 예정
			self.xAxisArr = ['00시 ~ 08시', '09시 ~ 12시', '13시 ~ 18시', '19시 ~ 23시'];
			self.xAxisWeekdayArr = ['일', '월', '화', '수', '목', '금', '토'];
		},


		// 데이터 정제 후에 updateOptions, updateSeries 호출
		updateData: function() {
			var self = this,
				chartOptions = {
					xaxis: {
						categories: self.xAxisWeekdayArr
					}
				},
				chartSeries = [];

			for (var i in self.xAxisArr) {
				var row = {
					name: self.xAxisArr[i],
					data: Array.apply(null, Array(self.xAxisWeekdayArr.length)).map(function() {return 0;}),
					cnt: Array.apply(null, Array(self.xAxisWeekdayArr.length)).map(function() {return 0;})
				};
				
				chartSeries.push(row);
			}

			self.updateDataByWeekday(chartOptions, chartSeries);

			// 엑셀 저장용 정보로도 활용될 예정
			self.yAxisArr = chartSeries;

			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);			
		},
		
		updateDataByWeekday: function(chartOptions, chartSeries) {
			var self = this;
				
			
			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr)),
				isCntObj = {};

			// 인구수 소수점 버림으로 수정됨
			for (var i in rawDataArr) {
				var row = rawDataArr[i],
					cntMan = parseInt(row['남성']),
					cntWoman = parseInt(row['여성']);
				
				if (isNaN(cntMan) || isNaN(cntWoman)) {
					continue;
				}
				
				var idxTime = parseInt(row['시간']) - 1,
					idxWeekday = parseInt(row['요일']) - 1;
					
				chartSeries[idxTime].data[idxWeekday] += cntMan + cntWoman;
				if (! isCntObj[idxTime + '_' + idxWeekday + '_' + row['년도']]) {
					isCntObj[idxTime + '_' + idxWeekday + '_' + row['년도']] = true;
					chartSeries[idxTime].cnt[idxWeekday] += 1;
				}
			}

			// 소수점 0자리까지 출력 + cnt 로 평균
			for (var i in chartSeries) {
				var data = chartSeries[i].data,
					cnt = chartSeries[i].cnt;
				
				for (var j in data) {
					if (cnt[j]) {
						data[j] = Math.floor(data[j] / cnt[j]);
					}
				}
			}

			if (! chartSeries.length) {
				chartOptions.noData = {
					text: '검색된 데이터가 없습니다'
				};
			}
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred().resolve(),
				xAxisArr = self.xAxisWeekdayArr,
				yAxisArr = self.yAxisArr,
				excelData = [],
				excelOpt = {header: ['']};

			return result;
		}
	};


	return {
		fnInitDtl: function() {
			var self = this;
			
			$dtlRoot.find('.selectpicker').selectpicker();
		},
		
		fnLoadTable: function(ls_pnu,ls_click_name) {
			var self = this;						
			//1
			if(ls_click_name == '분양'){
				_demo_table_1(ls_pnu);	/*분양*/				
			}else if(ls_click_name == '임대료'){
				_demo_table_2(ls_pnu);	/*임대료*/			
			}else if(ls_click_name == '실거래'){
				_demo_table_3(ls_pnu);	/*실거래*/			
			}else if(ls_click_name == '건물'){
				_demo_table_4(ls_pnu);	/*건물*/
			}else if(ls_click_name == '매매'){
				_demo_table_5(ls_pnu);	/*매매*/			
			}			
		},		
		
		fnLoadDtl: function(ls_pnu,ls_click_name) {
			var self = this;						
			//1
			if(ls_click_name == '분양'){
				/*_demo_table_1(ls_pnu);		분양*/
				_demo_table_1_1(ls_pnu);	/*상가면적*/
				_demo_table_1_5(ls_pnu);	/*상가업소정보*/
				_demo_table_1_6(ls_pnu);	/*호구분별분양가*/				
				
				chartIndustry.init('#z_chart_5_1', $('#form_z_chart_5_1')).always(function() {	//업종분포		
					chartPopDaily.init('#z_chart_11').always(function() {
						chartDwlPopGenderAge.init('#z_chart_7_1');	// 거주인구 : 성별 x 연령별
						chartWorkPopGenderAge.init('#z_chart_7_2');	// 직장인구 : 성별 x 연령별
						chartFlowPopGenderAge.init('#z_chart_7_3'); // 유동인구 : 성별 x 연령별
						
						chartLobzIndustry.init('#z_chart_lobz_5').always($.noop);			// 업종별 매출 추이
						chartLobzTotal.init('#z_chart_lobz_6', $('#form_z_chart_lobz_6'));	// 총 매출 추이					
					});
					chartPopFlowTime.init('#z_chart_pop_flow_time');
				});					
			} else if(ls_click_name == '임대료') {
				$(".rent_one").after($(".trading_one"));
				$(".trading_one").after($(".realtran_one"));
				$(".realtran_one").after($(".rent_two"));
				$(".rent_two").after($(".trading_two"));
				$(".trading_two").after($(".realtran_two"));

				/*_demo_table_2(ls_pnu);	임대료*/
				_demo_table_1_2(ls_pnu);	/*건축물현황*/
				_demo_table_1_3(ls_pnu);	/*임대매물정보_동*/
				_demo_table_1_4(ls_pnu);	/*매매실거래가정보_동*/
				_demo_table_1_7(ls_pnu);	/*매매매물정보*/
				
				_demo_table_1_3_1(ls_pnu);	/*임대매물정보_지번*/
				_demo_table_1_4_1(ls_pnu);	/*매매실거래가정보_지번*/
				_demo_table_1_7_1(ls_pnu);	/*매매매물정보_지번*/
				_demo_table_1_5(ls_pnu);	/*상가업소정보*/

				chartIndustry.init('#chart_5_1', $('#form_chart_5_1')).always(function() {	//업종분포		
					chartPopDaily.init('#chart_11').always(function() {
						chartDwlPopGenderAge.init('#chart_7_1');	// 거주인구 : 성별 x 연령별
						chartWorkPopGenderAge.init('#chart_7_2');	// 직장인구 : 성별 x 연령별
						chartFlowPopGenderAge.init('#chart_7_3');	// 유동인구 : 성별 x 연령별
						
						chartLobzIndustry.init('#chart_lobz_5').always($.noop);			// 업종별 매출 추이
						chartLobzTotal.init('#chart_lobz_6', $('#form_chart_lobz_6'));	// 총 매출 추이					
					});
					chartPopFlowTime.init('#chart_pop_flow_time');
				});				
			} else if(ls_click_name == '매매'){
				$(".trading_one").after($(".realtran_one"));
				$(".realtran_one").after($(".rent_one"));
				$(".rent_one").after($(".trading_two"));
				$(".trading_two").after($(".realtran_two"));					
				$(".realtran_two").after($(".rent_two"));

				/*_demo_table_2(ls_pnu);	임대료*/
				_demo_table_1_2(ls_pnu);	/*건축물현황*/
				_demo_table_1_3(ls_pnu);	/*임대매물정보_동*/
				_demo_table_1_4(ls_pnu);	/*매매실거래가정보_동*/
				_demo_table_1_7(ls_pnu);	/*매매매물정보*/
				
				_demo_table_1_3_1(ls_pnu);	/*임대매물정보_지번*/
				_demo_table_1_4_1(ls_pnu);	/*매매실거래가정보_지번*/	
				_demo_table_1_7_1(ls_pnu);	/*매매매물정보_지번*/			
				_demo_table_1_5(ls_pnu);	/*상가업소정보*/
				
				chartIndustry.init('#chart_5_1', $('#form_chart_5_1')).always(function() {	//업종분포		
					chartPopDaily.init('#chart_11').always(function() {
						chartDwlPopGenderAge.init('#chart_7_1');	// 거주인구 : 성별 x 연령별
						chartWorkPopGenderAge.init('#chart_7_2');	// 직장인구 : 성별 x 연령별
						chartFlowPopGenderAge.init('#chart_7_3'); 	// 유동인구 : 성별 x 연령별
						
						chartLobzIndustry.init('#chart_lobz_5').always($.noop);			// 업종별 매출 추이
						chartLobzTotal.init('#chart_lobz_6', $('#form_chart_lobz_6'));	// 총 매출 추이					
					});
					chartPopFlowTime.init('#chart_pop_flow_time');
				});				
			}else if(ls_click_name == '실거래'){
				
				$(".realtran_one").after($(".trading_one"));
				$(".trading_one").after($(".rent_one"));
				$(".rent_one").after($(".realtran_two"));
				$(".realtran_two").after($(".trading_two"));					
				$(".trading_two").after($(".rent_two"));
				
				//ls_rent_status	=	'1';
/*				$(".three").insertAfter(".two");
				$(".four").insertAfter(".one");*/
				/*_demo_table_3(ls_pnu);	실거래*/
				_demo_table_1_2(ls_pnu);	/*건축물현황*/
				_demo_table_1_3(ls_pnu);	/*임대매물정보_동*/
				_demo_table_1_4(ls_pnu);	/*매매실거래가정보_동*/
				_demo_table_1_7(ls_pnu);	/*매매매물정보*/
				
				_demo_table_1_3_1(ls_pnu);	/*임대매물정보_지번*/
				_demo_table_1_4_1(ls_pnu);	/*매매실거래가정보_지번*/	
				_demo_table_1_7_1(ls_pnu);	/*매매매물정보_지번*/
				_demo_table_1_5(ls_pnu);	/*상가업소정보*/
				
				chartIndustry.init('#chart_5_1', $('#form_chart_5_1')).always(function() {	//업종분포		
					chartPopDaily.init('#chart_11').always(function() {
						chartDwlPopGenderAge.init('#chart_7_1');	// 거주인구 : 성별 x 연령별
						chartWorkPopGenderAge.init('#chart_7_2');	// 직장인구 : 성별 x 연령별
						chartFlowPopGenderAge.init('#chart_7_3'); 	// 유동인구 : 성별 x 연령별
						
						chartLobzIndustry.init('#chart_lobz_5').always($.noop);			// 업종별 매출 추이
						chartLobzTotal.init('#chart_lobz_6', $('#form_chart_lobz_6'));	// 총 매출 추이					
					});
					chartPopFlowTime.init('#chart_pop_flow_time');
				});				
			}else if(ls_click_name == '건물'){
				/*_demo_table_4(ls_pnu);	건물*/
				_demo_table_1_1(ls_pnu);	/*상가면적*/
				_demo_table_1_2(ls_pnu);	/*건축물현황*/
				_demo_table_1_5(ls_pnu);	/*상가업소정보*/
				
				chartIndustry.init('#g_chart_5_1', $('#form_g_chart_5_1')).always(function() {	//업종분포		
					chartPopDaily.init('#g_chart_11').always(function() {
						chartDwlPopGenderAge.init('#g_chart_7_1');	// 거주인구 : 성별 x 연령별
						chartWorkPopGenderAge.init('#g_chart_7_2');	// 직장인구 : 성별 x 연령별
						chartFlowPopGenderAge.init('#g_chart_7_3'); // 유동인구 : 성별 x 연령별
						
						chartLobzIndustry.init('#g_chart_lobz_5').always($.noop);			// 업종별 매출 추이
						chartLobzTotal.init('#g_chart_lobz_6', $('#form_g_chart_lobz_6'));	// 총 매출 추이					
					});
					chartPopFlowTime.init('#g_chart_pop_flow_time');
				});				
			}
			
			// 리맥스 매물 데이터
			if ($('#remaxTab').length > 0) {
				_remax_table(ls_pnu);
			}

		},
		fnOpenTable: function() {
			var self = this;
			
			self.fnLoadTable(ls_pnu,ls_click_name);
		},		
		fnOpenDtl: function() {
			var self = this;
						
			self.fnLoadDtl(ls_pnu,ls_click_name);
		},
		fnOpenSecondDtl: function() {			
			var self = this;
			$('#wrapGisPopup').hide();
			
			$('.tab_content_show').removeClass('active');
			$('.flex-column-fluid').scrollTop(1);
			
			apiBuildingDtl.fnOpenDtl(ls_pnu,ls_click_name);
			
			if(ls_click_name == "건물"){				
				
				$('#building').removeClass('on');
				
				$('#kt_tab_pane_1').addClass('active show');
				$('.kt_tab_pane_1').addClass('active');	
				
				$('#kt_tab_pane_3').removeClass('active show');
				
				$dtlRoot.addClass('d-flex');
			} else if(ls_click_name == "임대료" || ls_click_name == "매매" || ls_click_name == "실거래") {
				$('#kt_tab_pane_1_2_1').addClass('active show');
				$('.kt_tab_pane_1_2_1').addClass('active');
				
				$('#kt_tab_pane_1_2_2').removeClass('active show');
				$('#kt_tab_pane_1_2_3').removeClass('active show');

				$dtlRoot1_2.removeClass('d-none');
				$dtlRoot1_2.addClass('d-flex');
								
			} else if(ls_click_name == "분양") {
				
				$('#kt_tab_pane_1_1_1').addClass('active show');
				$('.kt_tab_pane_1_1_1').addClass('active');	
				
				$('#kt_tab_pane_1_1_2').removeClass('active show');
				$('#kt_tab_pane_1_1_3').removeClass('active show');				
				
				$dtlRoot2.removeClass('d-none');
				$dtlRoot2.addClass('d-flex');
			}
			$('.flex-column-fluid').scrollTop(1);

		},		
		
		fnCloseDtl: function() {
			var self = this;			
			
			if(ls_click_name == "분양"){
				$dtlRoot.removeClass('d-none');
				$dtlRoot.addClass('d-flex');
			} else if(ls_click_name == "임대료" || ls_click_name == "매매" || ls_click_name == "실거래") {
				$dtlRoot1_2.removeClass('d-none');
				$dtlRoot1_2.addClass('d-flex');
			} else {
				$dtlRoot2.removeClass('d-none');
				$dtlRoot2.addClass('d-flex');
			}
		},

		fnReloadHack: function() {
			var selectorGender = '#chart_7_1',
				selectorAge = '#chart_7_2';
				selectorFlow = '#chart_7_3';

			$dtlRoot.find('[data-scroll]').scrollTop(0);
			$dtlRoot1_2.find('[data-scroll]').scrollTop(0);
			$dtlRoot2.find('[data-scroll]').scrollTop(0);
			
			switch (ls_click_name) {
				case '분양':
					selectorGender = '#z_chart_7_1',
					selectorAge = '#z_chart_7_2';
					selectorFlow = '#z_chart_7_3';
					break;
				case '건물':
					selectorGender = '#g_chart_7_1',
					selectorAge = '#g_chart_7_2';
					selectorFlow = '#g_chart_7_3';
					break;
			}

			setTimeout(function() {
				chartDwlPopGenderAge.init(selectorGender);
				chartWorkPopGenderAge.init(selectorAge);
				chartFlowPopGenderAge.init(selectorFlow);
			}, 200);
		},

		fnExport: function(attr) {
			var self = this;
			
			switch (attr) {
				case 'png':
					break;
				case 'svg':
					break;
				case 'excel':
				default:
					if(ls_click_name == '분양'){
						$.when(
							building_ComplexList_1.exportSheet(),		//기본정보
							building_ComplexList_1_1.exportSheet(),		//상가면적
							building_ComplexList_1_5.exportSheet(),		//상가업소정보
							building_ComplexList_1_6.exportSheet(),		//층·호별 분양가 정보
							chartIndustry.exportSheet_1(),				//업종분포 2022
							chartIndustry.exportSheet_2()				//업종분포 2023
						).done(function() {
							if (1 > arguments.length) {
								return;
							}
							
							var wb = XLSX.utils.book_new(),
								/*분양*/
								sheetNameArr = ['기본정보','상가면적','상가업소정보','층·호별분양가정보','업종분포_2022', '업종분포_2023'];
							
							for (var i in arguments) {
								var ws = arguments[i];
	
								XLSX.utils.book_append_sheet(wb, ws, sheetNameArr[i]);
							}
							
							// FIXME: 다운로드 이름형식 결정 필요
							XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_분양_정보.xlsx');
	
							z.xAsync('Gis', '사용자다운로드메뉴로그', 'insert', {
								menuCd: zo.pgmCode,
								downNm: '분양_정보'
							}, 'json');						
						});							
					}else if(ls_click_name == '임대료'){
						$.when(
							building_ComplexList_2.exportSheet(),		//기본정보
							building_ComplexList_1_2.exportSheet(),		//물건현황
							building_ComplexList_1_5.exportSheet(),		//상가업소정보
							building_ComplexList_1_3_1.exportSheet(),	//임대매물정보(지번)
							building_ComplexList_1_3.exportSheet(),		//임대매물정보(동)							
							building_ComplexList_1_7_1.exportSheet(),	//매매매물정보(지번)
							building_ComplexList_1_7.exportSheet(),		//매매매물정보(동)						
							building_ComplexList_1_4_1.exportSheet(),	//매매실거래가정보(지번)
							building_ComplexList_1_4.exportSheet(),		//매매실거래가정보(동)
							chartIndustry.exportSheet_1(),				//업종분포_2022
							chartIndustry.exportSheet_2(),				//업종분포_2023
							remax_MemulList.exportSheet_1(),			//리맥스매물 매매
							remax_MemulList.exportSheet_2()				//리맥스매물 임대
						).done(function() {
							if (1 > arguments.length) {
								return;
							}
							
							var wb = XLSX.utils.book_new();
							var sheetNameArr;
								/*임대료*/
								if ($('#remaxTab').length > 0 && _GroupCode == '4') {	// 리맥스매물정보가 있고 관리자계정인 경우
									sheetNameArr = ['기본정보','물건현황','상가업소정보','임대매물정보_지번','임대매물정보_동','매매매물정보_지번','매매매물정보_동','매매실거래가정보_지번','매매실거래가정보_동','업종분포_2022','업종분포_2023', '매물정보플러스_매매','매물정보플러스_임대'];
								} else {
									sheetNameArr = ['기본정보','물건현황','상가업소정보','임대매물정보_지번','임대매물정보_동','매매매물정보_지번','매매매물정보_동','매매실거래가정보_지번','매매실거래가정보_동','업종분포_2022','업종분포_2023'];
								}
							for (var i in arguments) {
								var ws = arguments[i];
								
								if (i > sheetNameArr.length - 1) {
									break;
								}
	
								XLSX.utils.book_append_sheet(wb, ws, sheetNameArr[i]);
							}
							
							// FIXME: 다운로드 이름형식 결정 필요
							XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_임대료_정보.xlsx');
	
							z.xAsync('Gis', '사용자다운로드메뉴로그', 'insert', {
								menuCd: zo.pgmCode,
								downNm: '임대료_정보'
							}, 'json');						
						});							
					} else if(ls_click_name == '매매'){
						$.when(
							building_ComplexList_2.exportSheet(),		//기본정보
							building_ComplexList_1_2.exportSheet(),		//물건현황
							building_ComplexList_1_5.exportSheet(),		//상가업소정보						
							building_ComplexList_1_7_1.exportSheet(),	//매매매물정보(지번)
							building_ComplexList_1_7.exportSheet(),		//매매매물정보(동)	
							building_ComplexList_1_3_1.exportSheet(),	//임대매물정보(지번)
							building_ComplexList_1_3.exportSheet(),		//임대매물정보(동)							
							building_ComplexList_1_4_1.exportSheet(),	//매매실거래가정보(지번)
							building_ComplexList_1_4.exportSheet(),		//매매실거래가정보(동)
							chartIndustry.exportSheet_1(),				//업종분포 2022
							chartIndustry.exportSheet_2(),				//업종분포 2023
							remax_MemulList.exportSheet_1(),			//리맥스매물 매매
							remax_MemulList.exportSheet_2()				//리맥스매물 임대
						).done(function() {
							if (1 > arguments.length) {
								return;
							}
							
							var wb = XLSX.utils.book_new();
							var sheetNameArr;
								/*임대료*/
								if ($('#remaxTab').length > 0 && _GroupCode == '4') {	// 리맥스매물정보가 있고 관리자계정인 경우
									sheetNameArr = ['기본정보','물건현황','상가업소정보','임대매물정보_지번','임대매물정보_동','매매매물정보_지번','매매매물정보_동','매매실거래가정보_지번','매매실거래가정보_동','업종분포_2022', '업종분포_2023', '매물정보플러스_매매','매물정보플러스_임대'];
								} else {
									sheetNameArr = ['기본정보','물건현황','상가업소정보','매매매물정보_지번','매매매물정보_동','임대매물정보_지번','임대매물정보_동','매매실거래가정보_지번','매매실거래가정보_동','업종분포_2022', '업종분포_2023'];
								}
							
							for (var i in arguments) {
								var ws = arguments[i];
								
								if (i > sheetNameArr.length - 1) {
									break;
								}
	
								XLSX.utils.book_append_sheet(wb, ws, sheetNameArr[i]);
							}
							
							// FIXME: 다운로드 이름형식 결정 필요
							XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_매물_정보.xlsx');
	
							z.xAsync('Gis', '사용자다운로드메뉴로그', 'insert', {
								menuCd: zo.pgmCode,
								downNm: '매물_정보'
							}, 'json');						
						});							
					}else if(ls_click_name == '실거래'){						
						$.when(
						/*실거래*/
							building_ComplexList_3.exportSheet(),		//기본정보
							building_ComplexList_1_2.exportSheet(),		//물건현황
							building_ComplexList_1_5.exportSheet(),		//상가업소정보
							building_ComplexList_1_4_1.exportSheet(),	//매매실거래가정보(지번)
							building_ComplexList_1_4.exportSheet(),		//매매실거래가정보(동)					
							building_ComplexList_1_7_1.exportSheet(),	//매매매물정보(지번)
							building_ComplexList_1_7.exportSheet(),		//매매매물정보(동)	
							building_ComplexList_1_3_1.exportSheet(),	//임대매물정보(지번)
							building_ComplexList_1_3.exportSheet(),		//임대매물정보(동)
							chartIndustry.exportSheet_1(),				//업종분포 2022
							chartIndustry.exportSheet_2()				//업종분포 2023
						).done(function() {
							if (1 > arguments.length) {
								return;
							}
							
							var wb = XLSX.utils.book_new(),
								/*실거래*/
								sheetNameArr = ['기본정보','물건현황','상가업소정보','매매실거래가정보_지번','매매실거래가정보_동','매매매물정보_지번','매매매물정보_동','임대매물정보_지번','임대매물정보_동','업종분포_2022', '업종분포_2023'];
							
							for (var i in arguments) {
								var ws = arguments[i];
	
								XLSX.utils.book_append_sheet(wb, ws, sheetNameArr[i]);
							}
							
							// FIXME: 다운로드 이름형식 결정 필요
							XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_실거래_정보.xlsx');
	
							z.xAsync('Gis', '사용자다운로드메뉴로그', 'insert', {
								menuCd: zo.pgmCode,
								downNm: '실거래_정보'
							}, 'json');						
						});
					}else if(ls_click_name == '건물'){
						$.when(
								/*건물*/						
								building_ComplexList_4.exportSheet(),		//기본정보
								building_ComplexList_1_1.exportSheet(),		//상가면적
								building_ComplexList_1_2.exportSheet(),		//건축물현황
								building_ComplexList_1_5.exportSheet(),		//상가업소정보
								chartIndustry.exportSheet_1(),				//업종분포 2022
								chartIndustry.exportSheet_2()				//업종분포 2023
						).done(function() {
							if (1 > arguments.length) {
								return;
							}
							
							var wb = XLSX.utils.book_new(),
								/*건물*/
								sheetNameArr = ['기본정보','상가면적','건축물현황','상가업소정보','업종분포_2022', '업종분포_2023'];
							
							for (var i in arguments) {
								var ws = arguments[i];

								XLSX.utils.book_append_sheet(wb, ws, sheetNameArr[i]);
							}
							
							// FIXME: 다운로드 이름형식 결정 필요
							XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_건물_정보.xlsx');
	
							z.xAsync('Gis', '사용자다운로드메뉴로그', 'insert', {
								menuCd: zo.pgmCode,
								downNm: '건물_정보'
							}, 'json');						
						});							
					}
					break;
			}
		}
	};
})();