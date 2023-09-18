

var apiBlockDtl = (function() {

	var URL_DAWUL_API = 'https://vapi.dawulmap.com:8443/MapAppServer/DWService',
		$dtlRoot = $('#mapBlockPanel'),
		$dtlScroll = $('#mapBlockPanel .ps.scroll'),
		$btnFavorite = $dtlRoot.find('[data-btn-favorite]'),
		$modalFavorite = $('#favModal'),
		$btnSaveFavorite = $modalFavorite.find('[data-btn-save-favorite]'),
		blockIdArr,
		blockBounds,
		blockCdArr,
		blockCenter,
		sanggaTypeArr,
		sanggaTypeMap,
		industryTypeArr_old,
		industryTypeMap_old,
		industryTypeArr_new,
		industryTypeMap_new,
		industryTypeSKArr;

	blockMap.fnGetCommCode().done(function(resp) {
		sanggaTypeArr = resp.sanggaTypeArr;
		sanggaTypeMap = resp.sanggaTypeMap;
		industryTypeArr_old = resp.industryTypeArr_old;
		industryTypeMap_old = resp.industryTypeMap_old;
		industryTypeArr_new = resp.industryTypeArr_new;
		industryTypeMap_new = resp.industryTypeMap_new;
		industryTypeSKArr = resp.industryTypeSKArr;
	});

	KTUtil.scrollInit($dtlScroll[0], {
		mobileNativeScroll: true,
		handleWindowResize: true,
		rememberPosition: ($dtlScroll.data('remember-position') == 'true' ? true : false)
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

	
	// Private functions
	var fnLoadDtlPrivate = function(arr, bounds, cdArr, center) {
		var self = this;
		
		blockIdArr = arr;
		blockBounds = bounds;
		blockCdArr = cdArr;
		blockCenter = center;
	};
	
	// 블럭 내 단지 리스트: 분양현장
	var tableComplexList = {
		init: function() {
			var self = this;
			
			self.blockIdArr = blockIdArr;
			self.blockBounds = blockBounds;
			
			self.$tbody = $('#tbodyBlockComplex').html('');
		
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});

			z.formatDataReference('상가').done(function(refText) {
				self.$tbody.closest('.position-relative').find('.reference').text(refText);
			});			
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {
			var self = this;

			self.$tbody.off('click', '[data-btn-open-building]').on('click', '[data-btn-open-building]', function(evt) {
				var $this = $(this),
					x = $this.attr('data-x'),
					y = $this.attr('data-y');
					
				if (! x || ! y) {
					return;
				}
				
				sessionStorage.setItem('GIS_pos_building', JSON.stringify({x: x, y: y}));
				
				window.open('/admin/main/adminMain.do?menuCd=MA0301');
			});			
		},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
				blockBounds = self.blockBounds,
				param = {
					blockIdArr: self.blockIdArr,
					east: blockBounds.getEast(),
					west: blockBounds.getWest(),
					south: blockBounds.getSouth(),
					north: blockBounds.getNorth(),
					startYMD: moment().subtract(3, 'year').format('YYYY'),
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
				};

			return z.xAsync('BlockStat', '단지리스트', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;

				for (var i in resp) {
					var row = resp[i];
					
					row['주소'] = row['도시'] + ' ' + row['구시군'] + ' ' + row['읍면동'] + ' ' + row['번지']; 
					row['건축규모'] = '지상' + row['지상총층'] + '층';
					
					if (row['지하총층']) {
						row['건축규모'] += '/지하' + row['지하총층'] + '층';						
					}
					
					row['대지면적'] = z.toComma(row['대지면적']);
					row['연면적'] = z.toComma(row['연면적']);
					row['총점포수'] = z.toComma(row['총점포수']);
					
					if (0 > row['점포수1f']) {
						row['점포수1f'] = '-';
					} else {
						row['점포수1f'] = z.toComma(row['점포수1f']);
					}
					if (0 > row['계약평당가1f']) {
						row['계약평당가1f'] = '-';
					} else {
						row['계약평당가1f'] = z.toComma(row['계약평당가1f']);
					}
					if (0 > row['전용평당가1f']) {
						row['전용평당가1f'] = '-';
					} else {
						row['전용평당가1f'] = z.toComma(row['전용평당가1f']);
					}
					if (0 > row['전용율']) {
						row['전용율'] = '-';
					} else {
						row['전용율'] = z.toComma(row['전용율']) + '%';
					}
					if (row['분양일']) {
						row['분양년월'] = moment(row['분양일'], 'YYYYMM').format('YYYY.MM');
					}
					if (row['입주일']) {
						row['입주년월'] = moment(row['입주일'], 'YYYYMM').format('YYYY.MM');
					}
				}
				
				// 상가명 정렬
				self.rawDataArr = self.rawDataArr.sort(function(a, b) {
					if (a['상가명'] < b['상가명']) {
						return -1;
					}
					if (a['상가명'] > b['상가명']) {
						return 1;
					}
				});
				
				$('#blockListSales [data-cnt-sales]').text('총 ' + z.toComma(self.rawDataArr.length) + ' 건');
			});
		},
		
		updateData: function() {
			var self = this,
				$tbody = self.$tbody,
				tmpl = Handlebars.compile($('#tmplBlockComplexList').html());

			$tbody.html(tmpl({cmplArr: self.rawDataArr}));
			
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = self.$tbody.closest('table'),
					$header = $table.parent().prev().children('table');

				var wsHeader = XLSX.utils.table_to_sheet($header[0]);
				var wsBody = XLSX.utils.table_to_sheet($table[0], {raw: true});
				
				var jsonHeader = XLSX.utils.sheet_to_json(wsHeader, {header: 1});
				//var jsonBody = XLSX.utils.sheet_to_json(wsBody, {raw: true, header: 1});
				var jsonBody2 = [];
				var row = Array.apply(null, Array(12)).map(function() {return 0;})
				
				for (var i in self.rawDataArr ) {
					var rowData = $.extend(true, [], row);
					rowData[0] = self.rawDataArr[i]['상가명'];
					rowData[1] = self.rawDataArr[i]['도시'] + ' ' + self.rawDataArr[i]['구시군'] + ' ' + self.rawDataArr[i]['읍면동'] + ' ' + self.rawDataArr[i]['번지'];
					rowData[2] = '지상' + self.rawDataArr[i]['지상총층'] + '층'; ;
					rowData[3] = self.rawDataArr[i]['대지면적'];
					rowData[4] = self.rawDataArr[i]['연면적'];					
					rowData[5] = self.rawDataArr[i]['총점포수'];					
					rowData[6] = self.rawDataArr[i]['점포수1f'];					
					rowData[7] = self.rawDataArr[i]['계약평당가1f'];
					rowData[8] = self.rawDataArr[i]['전용평당가1f'];
					rowData[9] = self.rawDataArr[i]['전용율'];
					rowData[10] = moment(self.rawDataArr[i]['분양일'], 'YYYYMM').format('YYYY.MM') ;
					rowData[11] = moment(self.rawDataArr[i]['입주일'], 'YYYYMM').format('YYYY.MM') ;
					
					jsonBody2.push(rowData);
				}
				
				var jsonMerge = jsonHeader.concat(jsonBody2);
				var ws = XLSX.utils.json_to_sheet(jsonMerge, {raw: true, skipHeader: true});

				result.resolve(ws);
			});
			return result;
		}
	};
	
	// 블럭 내 실거래가 리스트
	var tableTRDList = {
		init: function() {
			var self = this;
			
			self.deferred = $.Deferred();
			
			self.blockIdArr = blockIdArr;
			self.blockBounds = blockBounds;
			
			self.$tbody = $('#tbodyBlockTRD').html('');
		
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			}).always(function() {
				self.deferred.resolve();
			});

			z.formatDataReference('실거래').done(function(refText) {
				self.$tbody.closest('.position-relative').find('.reference').text(refText);
			});

			return self.deferred;
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {
			var self = this;
			
			self.$tbody.off('click', '[data-btn-open-building]').on('click', '[data-btn-open-building]', function(evt) {
				var $this = $(this),
					x = $this.attr('data-x'),
					y = $this.attr('data-y');
					
				if (! x || ! y) {
					return;
				}
				
				sessionStorage.setItem('GIS_pos_building', JSON.stringify({x: x, y: y}));
				
				window.open('/admin/main/adminMain.do?menuCd=MA0301');
			});
		},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
				blockBounds = self.blockBounds,
				param = {
					blockIdArr: self.blockIdArr,
					east: blockBounds.getEast(),
					west: blockBounds.getWest(),
					south: blockBounds.getSouth(),
					north: blockBounds.getNorth(),
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
				};
			
			return z.xAsync('BlockStat', '실거래가', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp,
				self.rawDataArrCopy = [];

				// 매물등록일 역순 정렬
				self.rawDataArr = self.rawDataArr.sort(function(a, b) {
					if (a['계약일자'] > b['계약일자']) {
						return -1;
					}
					if (a['계약일자'] < b['계약일자']) {
						return 1;
					}
				});
				
				self.rawDataArr.filter(function(element, index, array){
					if(index < 30){
						self.rawDataArrCopy.push(element);
					}	
				}); 
				
				for (var i in self.rawDataArrCopy) {
					var row = self.rawDataArrCopy[i];
					
					row['계약일자'] = moment(row['계약일자'], 'YYYYMMDD').format('YYYY.MM.DD');
					row['거래금액'] = z.toComma(row['거래금액']);
				}
				
				$('#blockListRealTran [data-cnt-realtran]').text('총 ' + z.toComma(self.rawDataArr.length) + ' 건  중 ' + z.toComma(self.rawDataArrCopy.length) + ' 건');
			});
		},
		
		updateData: function() {
			var self = this,
				$tbody = self.$tbody,
				tmpl = Handlebars.compile($('#tmplBlockTRDList').html());

			$tbody.html(tmpl({trdArr: self.rawDataArrCopy}));
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = self.$tbody.closest('table'),
					$header = $table.parent().prev().children('table');

				var wsHeader = XLSX.utils.table_to_sheet($header[0]);
				var wsBody = XLSX.utils.table_to_sheet($table[0], {raw: true});
				
				var jsonHeader = XLSX.utils.sheet_to_json(wsHeader, {header: 1});
				//var jsonBody = XLSX.utils.sheet_to_json(wsBody, {raw: true, header: 1});
				var jsonBody2 = [];
				var row = Array.apply(null, Array(8)).map(function() {return 0;})
				
				for (var i in self.rawDataArr ) {
					var rowData = $.extend(true, [], row);
					rowData[0] = self.rawDataArr[i]['계약일자'];
					rowData[1] = self.rawDataArr[i]['상가유형'];
					rowData[2] = self.rawDataArr[i]['건물명'];
					rowData[3] = self.rawDataArr[i]['시군구명'];
					rowData[4] = self.rawDataArr[i]['건물용도'];
					rowData[5] = self.rawDataArr[i]['층'];
					rowData[6] = self.rawDataArr[i]['전유면적'];
					rowData[7] = self.rawDataArr[i]['용도지역'];
					rowData[8] = self.rawDataArr[i]['거래금액'];
					rowData[9] = self.rawDataArr[i]['건축년도'];
					jsonBody2.push(rowData);
				}
				
				var jsonMerge = jsonHeader.concat(jsonBody2);
				var ws = XLSX.utils.json_to_sheet(jsonMerge, {raw: true, skipHeader: true});

				result.resolve(ws);
			});

			return result;
		}
	};


	// 임대매물 리스트
	var tableRentForSaleList = {
		init: function() {
			var self = this;
			
			self.blockIdArr = blockIdArr;
			self.blockBounds = blockBounds;

			self.$tbody = $('#tbodyBlockRentForSale').html('');
		
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});

			z.formatDataReference('매물').done(function(refText) {
				self.$tbody.closest('.position-relative').find('.reference').text(refText);
			});			
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {
			var self = this;
			
			self.$tbody.off('click', '[data-btn-open-building]').on('click', '[data-btn-open-building]', function(evt) {
				var $this = $(this),
					x = $this.attr('data-x'),
					y = $this.attr('data-y');
					
				if (! x || ! y) {
					return;
				}
				
				sessionStorage.setItem('GIS_pos_building', JSON.stringify({x: x, y: y}));
				
				window.open('/admin/main/adminMain.do?menuCd=MA0301');
			});
		},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
				blockBounds = self.blockBounds,
				param = {
					blockIdArr: self.blockIdArr,
					east: blockBounds.getEast(),
					west: blockBounds.getWest(),
					south: blockBounds.getSouth(),
					north: blockBounds.getNorth(),
					startYMD: moment().subtract(3, 'year').format('YYYY'),
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
				};

			return z.xAsync('BlockStat', '임대매물', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp,
				self.rawDataArrCopy = [];
				
				// 매물등록일 역순 정렬
				self.rawDataArr = self.rawDataArr.sort(function(a, b) {
					if (a['매물등록일'] > b['매물등록일']) {
						return -1;
					}
					if (a['매물등록일'] < b['매물등록일']) {
						return 1;
					}
				});
				
				self.rawDataArr.filter(function(element, index, array){
					if(index < 30){
						self.rawDataArrCopy.push(element);
					}	
				}); 
				
				for (var i in self.rawDataArrCopy ) {
					var row = self.rawDataArrCopy[i];
					
					if (row['사용승인일']) {
						row['사용승인일'] = moment(row['사용승인일'], 'YYYYMMDD').format('YYYY.MM.DD');
					}
					
					if (row['매물등록일']) {
						var regDt = row['매물등록일'];
						
						if (0 === regDt.indexOf('00')) {
							regDt = '20' + regDt.substr(2);
						}
						
						row['매물등록일'] = moment(regDt, 'YYYYMMDD').format('YYYY.MM.DD');
					}
					
					row['보증금'] = z.toComma(row['보증금']);
					row['월세'] = z.toComma(row['월세']);
					row['권리금'] = z.toComma(row['권리금']);

					row['전용면적'] = Math.round(100 * parseFloat(row['전용면적'])) / 100;
					row['계약면적'] = Math.round(100 * parseFloat(row['계약면적'])) / 100;
				}
				
				$('#blockListRent [data-cnt-rent]').text('총 ' + z.toComma(self.rawDataArr.length) + ' 건  중 ' + z.toComma(self.rawDataArrCopy.length) + ' 건');
			});
		},
		
		updateData: function() {
			var self = this,
				$tbody = self.$tbody,
				tmpl = Handlebars.compile($('#tmplBlockRentForSaleList').html()),
				saleArr = self.rawDataArrCopy;
				

			$tbody.html(tmpl({saleArr: saleArr}));
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = self.$tbody.closest('table'),
					$header = $table.parent().prev().children('table');

				var wsHeader = XLSX.utils.table_to_sheet($header[0]);
				var wsBody = XLSX.utils.table_to_sheet($table[0], {raw: true});
				
				var jsonHeader = XLSX.utils.sheet_to_json(wsHeader, {header: 1});
				//var jsonBody = XLSX.utils.sheet_to_json(wsBody, {raw: true, header: 1});
				var jsonBody2 = [];
				var row = Array.apply(null, Array(11)).map(function() {return 0;})
				
				for (var i in self.rawDataArr) {
					var rowData = $.extend(true, [], row);
					rowData[0] = self.rawDataArr[i]['매물등록일'];
					rowData[1] = self.rawDataArr[i]['상가유형'];
					rowData[2] = self.rawDataArr[i]['건물명'];
					rowData[3] = self.rawDataArr[i]['주소'];
					rowData[4] = self.rawDataArr[i]['층'];
					rowData[5] = self.rawDataArr[i]['전용면적'];
					rowData[6] = self.rawDataArr[i]['계약면적'];					
					rowData[7] = self.rawDataArr[i]['보증금'];
					rowData[8] = self.rawDataArr[i]['월세'];
					rowData[9] = self.rawDataArr[i]['권리금'];
					rowData[10] = self.rawDataArr[i]['사용승인일'];
					jsonBody2.push(rowData);
				}
				
				var jsonMerge = jsonHeader.concat(jsonBody2);
				var ws = XLSX.utils.json_to_sheet(jsonMerge, {raw: true, skipHeader: true});

				result.resolve(ws);
			});

			return result;
		}
	};
	

	// 매매매물 리스트
	var tableTradingForSaleList = {
		init: function() {
			var self = this;
			
			self.blockIdArr = blockIdArr;
			self.blockBounds = blockBounds;

			self.$tbody = $('#tbodyBlockTradingForSale').html('');
		
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});

			z.formatDataReference('매물').done(function(refText) {
				self.$tbody.closest('.position-relative').find('.reference').text(refText);
			});			
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {
			var self = this;
			
			self.$tbody.off('click', '[data-btn-open-building]').on('click', '[data-btn-open-building]', function(evt) {
				var $this = $(this),
					x = $this.attr('data-x'),
					y = $this.attr('data-y');
					
				if (! x || ! y) {
					return;
				}
				
				sessionStorage.setItem('GIS_pos_building', JSON.stringify({x: x, y: y}));
				
				window.open('/admin/main/adminMain.do?menuCd=MA0301');
			});
		},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
				blockBounds = self.blockBounds,
				param = {
					blockIdArr: self.blockIdArr,
					east: blockBounds.getEast(),
					west: blockBounds.getWest(),
					south: blockBounds.getSouth(),
					north: blockBounds.getNorth(),
					startYMD: moment().subtract(3, 'year').format('YYYY'),
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
				};

			return z.xAsync('BlockStat', '매매매물', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp,
				self.rawDataArrCopy = [];

				// 매물등록일 역순 정렬
				self.rawDataArr = self.rawDataArr.sort(function(a, b) {
					if (a['매물등록일'] > b['매물등록일']) {
						return -1;
					}
					if (a['매물등록일'] < b['매물등록일']) {
						return 1;
					}
					
				});
				
				self.rawDataArr.filter(function(element, index, array){
					if(index < 30){
						self.rawDataArrCopy.push(element);
					}	
				}); 
				
				for (var i in self.rawDataArrCopy) {
					var row = self.rawDataArrCopy[i];
					
					if (row['매물등록일']) {
						var regDt = row['매물등록일'];
						
						if (0 === regDt.indexOf('00')) {
							regDt = '20' + regDt.substr(2);
						}
						
						row['매물등록일'] = moment(regDt, 'YYYYMMDD').format('YYYY.MM.DD');
					}
					
					row['매매가'] = z.toComma(row['매매가']);
					row['권리금'] = z.toComma(row['권리금']);

					row['전용면적'] = Math.round(100 * parseFloat(row['전용면적'])) / 100;
					row['계약면적'] = Math.round(100 * parseFloat(row['계약면적'])) / 100;
				}
				
				$('#blockListTrading [data-cnt-trading]').text('총 ' + z.toComma(self.rawDataArr.length) + ' 건  중 ' + z.toComma(self.rawDataArrCopy.length) + ' 건');
			});
		},
		
		updateData: function() {
			var self = this,  
				$tbody = self.$tbody,
				tmpl = Handlebars.compile($('#tmplBlockTradingForSaleList').html()),
				saleArr = self.rawDataArrCopy;
			$tbody.html(tmpl({saleArr: saleArr}));
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = self.$tbody.closest('table'),
					$header = $table.parent().prev().children('table');

				var wsHeader = XLSX.utils.table_to_sheet($header[0]);
				var wsBody = XLSX.utils.table_to_sheet($table[0], {raw: true});
				
				var jsonHeader = XLSX.utils.sheet_to_json(wsHeader, {header: 1});
				//var jsonBody = XLSX.utils.sheet_to_json(wsBody, {raw: true, header: 1});
				var jsonBody2 = [];
				var row = Array.apply(null, Array(10)).map(function() {return 0;})
				
				for (var i in self.rawDataArr) {
					var rowData = $.extend(true, [], row);
					rowData[0] = self.rawDataArr[i]['매물등록일'];
					rowData[1] = self.rawDataArr[i]['상가유형'];
					rowData[2] = self.rawDataArr[i]['건물명'];
					rowData[3] = self.rawDataArr[i]['주소'];
					rowData[4] = self.rawDataArr[i]['층'];
					rowData[5] = self.rawDataArr[i]['전용면적'];
					rowData[6] = self.rawDataArr[i]['계약면적'];
					rowData[7] = self.rawDataArr[i]['매매가'];
					rowData[8] = self.rawDataArr[i]['권리금'];
					rowData[9] = self.rawDataArr[i]['수익률'];
					jsonBody2.push(rowData);
				}
				
				var jsonMerge = jsonHeader.concat(jsonBody2);
				var ws = XLSX.utils.json_to_sheet(jsonMerge, {raw: true, skipHeader: true});

				result.resolve(ws);
			});

			return result;
		}
	};
	
	// 인근 (반경 5km) 아파트단지 리스트
	var tableNearAptList = {
		init: function() {
			var self = this;
			
			self.blockCenter = blockCenter;

			self.$tbody = $('#tbodyBlockNearApt').html('');
		
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});

			z.formatDataReference('매물').done(function(refText) {
				self.$tbody.closest('.position-relative').find('.reference').text(refText);
			});
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {
			var self = this;
			
			self.$tbody.off('click', '[data-btn-open-building]').on('click', '[data-btn-open-building]', function(evt) {
				var $this = $(this),
					x = $this.attr('data-x'),
					y = $this.attr('data-y');
					
				if (! x || ! y) {
					return;
				}
				
				sessionStorage.setItem('GIS_pos_building', JSON.stringify({x: x, y: y}));
				
				window.open('/admin/main/adminMain.do?menuCd=MA0301');
			});
		},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
				center = self.blockCenter,
				lat = center.geometry.coordinates[1],
				lng = center.geometry.coordinates[0],
				degreeToKm = 5 * 3.141592 / 180
				param = {
					swLat: lat - degreeToKm,
					swLng: lng - degreeToKm,
					neLat: lat + degreeToKm,
					neLng: lng + degreeToKm,
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
				};
				
			self.turfCircle = turf.circle([lng, lat], 5, {steps: 20, units: 'kilometers'});
				
			
			return z.xAsync('BlockStat', '아파트리스트', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;
			});
		},
		
		updateData: function() {
			var self = this,
				$tbody = self.$tbody,
				tmpl = Handlebars.compile($('#tmplBlockNearAptList').html()),
				aptArr = self.rawDataArr,
				resultArr = [];

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

				if (turf.booleanPointInPolygon(turfPoint, self.turfCircle)) {
					resultArr.push(apt);

					// km 거리 계산
					apt['km'] = Math.round(100 * turf.distance(turfPoint, self.blockCenter)) / 100;
				}
			}
			
			var cntApt = resultArr.length,
				cntHo = 0;

			for (var i in resultArr) {
				var row = resultArr[i];
				
				if (row['사용승인일']) {
					row['사용승인일'] = moment(row['사용승인일'], 'YYYYMMDD').format('YYYY.MM.DD');
				}
				if (row['착공일']) {
					row['착공일'] = moment(row['착공일'], 'YYYYMMDD').format('YYYY.MM.DD');
				}
				
				if (! isNaN(row['세대수'] || 0)) {
					cntHo += parseInt(row['세대수'] || 0);
				}
				
				row['면적'] = z.toComma(row['면적']);
				row['세대수'] = z.toComma(row['세대수']);
			}
			
			$('#blockNearApt [data-cnt-apt]').text('총 ' + z.toComma(cntApt) + ' 단지 / ' + z.toComma(cntHo) + ' 세대');
			
			// 데이터 정렬: 시군구, 읍면동, 단지명 순서
			resultArr = resultArr.sort(function(a, b) {
				if (a['시군구'] < b['시군구']) {
					return -1;
				}
				if (a['시군구'] > b['시군구']) {
					return 1;
				}

				if (a['읍면동'] < b['읍면동']) {
					return -1;
				}
				if (a['읍면동'] > b['읍면동']) {
					return 1;
				}

				if (a['단지명'] < b['단지명']) {
					return -1;
				}
				if (a['단지명'] > b['단지명']) {
					return 1;
				}
				
				return 0;
			});

			$tbody.html(tmpl({aptArr: resultArr}));
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = self.$tbody.closest('table'),
					$header = $table.parent().prev().children('table');

				var wsHeader = XLSX.utils.table_to_sheet($header[0]);
				var wsBody = XLSX.utils.table_to_sheet($table[0], {raw: true});
				
				var jsonHeader = XLSX.utils.sheet_to_json(wsHeader, {header: 1});
				var jsonBody = XLSX.utils.sheet_to_json(wsBody, {raw: true, header: 1});

				var jsonMerge = jsonHeader.concat(jsonBody);

				var ws = XLSX.utils.json_to_sheet(jsonMerge, {raw: true, skipHeader: true});

				result.resolve(ws);
			});

			return result;
		}
	};
	
	// 인근 (반경 5km) 시설 정보 리스트
	var tableNearFacStatList = {
		init: function() {
			var self = this;
			
			self.blockCenter = blockCenter;

			self.$tbody = $('#tbodyBlockNearFacStat').html('');

			self.$tbody2 = $('#tbodyBlockNearFacList').html('');
		
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});

			z.formatDataReference('매물').done(function(refText) {
				self.$tbody.closest('.position-relative').find('.reference').text(refText);
			});
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {
			var self = this;
			
			self.$tbody2.off('click', '[data-btn-open-building]').on('click', '[data-btn-open-building]', function(evt) {
				var $this = $(this),
					x = $this.attr('data-x'),
					y = $this.attr('data-y');
					
				if (! x || ! y) {
					return;
				}
				
				sessionStorage.setItem('GIS_pos_building', JSON.stringify({x: x, y: y}));
				
				window.open('/admin/main/adminMain.do?menuCd=MA0301');
			});
		},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
				center = self.blockCenter,
				lat = center.geometry.coordinates[1],
				lng = center.geometry.coordinates[0],
				degreeToKm = 5 * 3.141592 / 180
				param = {
					swLat: lat - degreeToKm,
					swLng: lng - degreeToKm,
					neLat: lat + degreeToKm,
					neLng: lng + degreeToKm,
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
				};
				
			self.turfCircle = turf.circle([lng, lat], 5, {steps: 20, units: 'kilometers'});
			
			return z.xAsync('BlockStat', '시설정보리스트', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;
			});
		},
		
		updateData: function() {
			var self = this,
				$tbody = self.$tbody,
				$tbody2 = self.$tbody2,
				tmpl = Handlebars.compile($('#tmplBlockNearFacStat').html()),
				tmpl2 = Handlebars.compile($('#tmplBlockNearFacList').html()),
				facStatArr = self.rawDataArr,
				resultArr = [],
				cntFacStat = [],
				resultCnt = [];

			for (var j in facStatArr) {

				var facstat = facStatArr[j],
					geoJson = Terraformer.WKT.parse('POINT(' + facstat['x좌표'] + ' ' + facstat['y좌표'] + ')'),
					coordArr = [],
					turfPoint = null;

				try {
					turfPoint = turf.point([facstat['x좌표'], facstat['y좌표']]);
				} catch (err) {
					console.log(err);
					continue;
				}

				if (turf.booleanPointInPolygon(turfPoint, self.turfCircle)) {
					resultArr.push(facstat);
					facstat['특징2'] = z.toComma(facstat['특징2']);
					// km 거리 계산
					facstat['km'] = Math.round(100 * turf.distance(turfPoint, self.blockCenter)) / 100;
				}
			}
			
			var cntFacStatTot = resultArr.length,
				cntFacStat1 = 0,
				cntFacStat2 = 0,
				cntFacStat3 = 0,
				cntFacStat4 = 0;

			for (var i in resultArr) {
				var row = resultArr[i];
								
				switch(row['gbn']){
					case '1' :
						cntFacStat1++;	
					break;
					case '2' :
						cntFacStat2++;
					break;
					case '3' :
						cntFacStat3++;
					break;
					case '4' :
						cntFacStat4++;
					break;
				}
			}
			
			cntFacStat['cntFacStat1'] = z.toComma(cntFacStat1);
			cntFacStat['cntFacStat2'] = z.toComma(cntFacStat2);
			cntFacStat['cntFacStat3'] = z.toComma(cntFacStat3);
			cntFacStat['cntFacStat4'] = z.toComma(cntFacStat4);
			
			resultCnt.push(cntFacStat);
			// 데이터 정렬: 시군구, 읍면동, 단지명 순서
			resultArr = resultArr.sort(function(a, b) {
				if (a['km'] < b['km']) {
					return -1;
				}
				if (a['km'] > b['km']) {
					return 1;
				}
				return 0;
			});
			
			$tbody.html(tmpl({facStatCnt: resultCnt}));
			$tbody2.html(tmpl2({facStatArr: resultArr}));
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = self.$tbody2.closest('table'),
					$header = $table.parent().prev().children('table');

				var wsHeader = XLSX.utils.table_to_sheet($header[0]);
				var wsBody = XLSX.utils.table_to_sheet($table[0], {raw: true});
				
				var jsonHeader = XLSX.utils.sheet_to_json(wsHeader, {header: 1});
				var jsonBody = XLSX.utils.sheet_to_json(wsBody, {raw: true, header: 1});

				var jsonMerge = jsonHeader.concat(jsonBody);

				var ws = XLSX.utils.json_to_sheet(jsonMerge, {raw: true, skipHeader: true});

				result.resolve(ws);
			});

			return result;
		}
	};

	// 인근 (반경 5km) 교통 정보 리스트
	var tableNearTrafficStatList = {
		init: function() {
			var self = this;
			
			self.blockCenter = blockCenter;

			self.$tbody = $('#tbodyBlockNearTrafficStat').html('');

			self.$tbody2 = $('#tbodyBlockNearTrafficList').html('');
		
			self.setBtnListener();
			
			self.loadData().done(function(resp) {
				self.updateData();
			});

			z.formatDataReference('매물').done(function(refText) {
				self.$tbody.closest('.position-relative').find('.reference').text(refText);
			});
		},
		
		// 동적 수정이 필요 없는 경우에는 제외해도 문제없음
		setBtnListener: function() {
			var self = this;
			
			self.$tbody2.off('click', '[data-btn-open-building]').on('click', '[data-btn-open-building]', function(evt) {
				var $this = $(this),
					x = $this.attr('data-x'),
					y = $this.attr('data-y');
					
				if (! x || ! y) {
					return;
				}
				
				sessionStorage.setItem('GIS_pos_building', JSON.stringify({x: x, y: y}));
				
				window.open('/admin/main/adminMain.do?menuCd=MA0301');
			});
		},

		// 서버 쿼리 조회는 여기만 다른 쿼리로 바꾸면 됨
		loadData: function() {
			var self = this,
				center = self.blockCenter,
				lat = center.geometry.coordinates[1],
				lng = center.geometry.coordinates[0],
				degreeToKm = 5 * 3.141592 / 180
				param = {
					swLat: lat - degreeToKm,
					swLng: lng - degreeToKm,
					neLat: lat + degreeToKm,
					neLng: lng + degreeToKm,
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
				};
				
			self.turfCircle = turf.circle([lng, lat], 5, {steps: 20, units: 'kilometers'});
			
			return z.xAsync('BlockStat', '교통정보리스트', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;
			});
		},
		
		updateData: function() {
			var self = this,
				$tbody = self.$tbody,
				$tbody2 = self.$tbody2,
				tmpl = Handlebars.compile($('#tmplBlockNearTrafficStat').html()),
				tmpl2 = Handlebars.compile($('#tmplBlockNearTrafficList').html()),
				trafficStatArr = self.rawDataArr,
				resultArr = [],
				cntFacStat = [],
				resultCnt = [];

			for (var j in trafficStatArr) {

				var trafficstat = trafficStatArr[j],
					geoJson = Terraformer.WKT.parse('POINT(' + trafficstat['x좌표'] + ' ' + trafficstat['y좌표'] + ')'),
					coordArr = [],
					turfPoint = null;

				try {
					turfPoint = turf.point([trafficstat['x좌표'], trafficstat['y좌표']]);
				} catch (err) {
					console.log(err);
					continue;
				}

				if (turf.booleanPointInPolygon(turfPoint, self.turfCircle)) {
					resultArr.push(trafficstat);
					trafficstat['특징2'] = z.toComma(trafficstat['특징2']);
					// km 거리 계산
					trafficstat['km'] = Math.round(100 * turf.distance(turfPoint, self.blockCenter)) / 100;
				}
			}
			
			var cntTrafficStatTot = resultArr.length,
				cntTrafficStat1 = 0,
				cntTrafficStat2 = 0,
				cntTrafficStat3 = 0,
				cntTrafficStat4 = 0;

			for (var i in resultArr) {
				var row = resultArr[i];
								
				switch(row['gbn']){
					case '1' :
						cntTrafficStat1++;	
					break;
					case '2' :
						cntTrafficStat2++;
					break;
					case '3' :
						cntTrafficStat3++;
					break;
					case '4' :
						cntTrafficStat4++;
					break;
				}
			}
			
			trafficstat['cntTrafficStat1'] = z.toComma(cntTrafficStat1);
			trafficstat['cntTrafficStat2'] = z.toComma(cntTrafficStat2);
			trafficstat['cntTrafficStat3'] = z.toComma(cntTrafficStat3);
			trafficstat['cntTrafficStat4'] = z.toComma(cntTrafficStat4);
			
			resultCnt.push(trafficstat);
			// 데이터 정렬: 시군구, 읍면동, 단지명 순서
			resultArr = resultArr.sort(function(a, b) {
				if (a['km'] < b['km']) {
					return -1;
				}
				if (a['km'] > b['km']) {
					return 1;
				}
				return 0;
			});
			
			$tbody.html(tmpl({trafficStatCnt: resultCnt}));
			$tbody2.html(tmpl2({trafficStatArr: resultArr}));
		},

		exportSheet: function() {
			var self = this,
				result = $.Deferred();
			
			// 서버를 다녀와도 괜찮고, 가급적이면 이미 조회된 데이터로 해결 권장
			setTimeout(function() {
				var $table = self.$tbody2.closest('table'),
					$header = $table.parent().prev().children('table');

				var wsHeader = XLSX.utils.table_to_sheet($header[0]);
				var wsBody = XLSX.utils.table_to_sheet($table[0], {raw: true});
				
				var jsonHeader = XLSX.utils.sheet_to_json(wsHeader, {header: 1});
				var jsonBody = XLSX.utils.sheet_to_json(wsBody, {raw: true, header: 1});

				var jsonMerge = jsonHeader.concat(jsonBody);

				var ws = XLSX.utils.json_to_sheet(jsonMerge, {raw: true, skipHeader: true});

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
			
			self.blockCdArr = blockCdArr;
			self.blockCdSet = new Set();
			
			for (var i in blockCdArr) {
				self.blockCdSet.add(blockCdArr[i].substring(0, 11));
			}
			
			// 전체 조회 > 최근 3년만 조회 > 올해 데이터만 조회 > 데이터가 있는 마지막 연도 조회 > 최근 1년만 조회
			self.endYMD = moment().format('YYYYMM');
			// 20230811 최근 5개년으로 수정 
			self.startYMD = moment().startOf('year').add(-48, 'months').format('YYYYMM');

			self.loadData().done(function(resp) {
			}).always(function() {
				self.deferred.resolve();
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
					blockCdArr: Array.from(self.blockCdSet),
					startYMD: self.startYMD,
					endYMD: self.endYMD,
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
					demoLdongcd: _DemoLdongcd,
				};
				
			if (! isFromCache) {
				self.deferredData = $.Deferred();

				z.xAsync('BlockStatOracle', '인구정보', 'select', param, 'json2').done(function(resp) {
					// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
					self.rawResp = resp;

					// 불필요 데이터 제외
					if (resp) {
						self.rawDataArr = resp.filter(function(elm) {
							return -1 < self.blockCdArr.indexOf(elm['block_cd']);
						});
					}
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
					// 소수점 0자리까지 출력
					self.sumObj[j] = Math.round(self.sumObj[j] / cnt);
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


	// 20230811
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
						offsetX: -20
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

					if(0 > idxGenderColumn) {
						continue;
					}

					for(var k in chartSeries) {
						if(chartSeries[k].name == row['기준월'].substring(0,4)) {
							chartSeries[k].data[idxGenderColumn] += parseInt(row[j]);
							chartSeries[k].cnt[idxGenderColumn] = Math.max(parseInt(row['기준월'].substring(4,6)));
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
	}


	// 20230811
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
						offsetX: -20
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

					if(0 > idxGenderColumn) {
						continue;
					}

					for(var k in chartSeries) {
						if(chartSeries[k].name == row['기준월'].substring(0,4)) {
							chartSeries[k].data[idxGenderColumn] += parseInt(row[j]);
							chartSeries[k].cnt[idxGenderColumn] = Math.max(parseInt(row['기준월'].substring(4,6)));
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
	}


	// 20230811
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
						offsetX: -20
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
							chartSeries[k].cnt[idxGenderColumn] = Math.max(parseInt(row['기준월'].substring(4,6)));
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

	// 업종별 매출 추이
	var chartLobzIndustry = {
		
		init: function(apexChart) {
			var self = this;
			
			self.deferred = $.Deferred();
			
			self.minYear = moment().subtract(4, 'years').year();
			self.maxYear = self.minYear + 3;
			
			self.blockCdArr = blockCdArr;
			self.blockCdSet = new Set();
			
			for (var i in blockCdArr) {
				self.blockCdSet.add(blockCdArr[i].substring(0, 11));
			}
			
			// 차트 초기화 퍼블리싱 코드 옮겨옴		
			var options = {
				chartID: '업종별 매출 추이',
				series: [{
					name: '2019',
					data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				}],
				chart: {
					width: 500,
					height: 410,
	                type: 'bar',
					stacked: false,
			        toolbar: {
			            show: true,
			            offsetY: -40,
						offsetX: -32 //230807추가수정
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
			    grid: {
			        show: false,
			    },
	            plotOptions: {
					bar: {
						horizontal: true
					},
				},
				dataLabels: {
					enabled: false
				},
				stroke: {
					show: true,
					width: 1,
					colors: ['transparent']
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
					categories: industryTypeSKArr,
					labels: {
						formatter: function(value) {
							return z.toComma(value);
						}
					}
	            },
				colors: ['#8176d4','#4d5dbe','#2985d2','#2eb7c4','#4cd3c5'],
			    legend: {
					showForSingleSeries: true,
					showForNullSeries: true,
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
			            offsetY: 20
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
					blockCdArr: Array.from(self.blockCdSet),
					minYear: self.minYear,
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
					demoLdongcd: _DemoLdongcd,
				};
				
			if (! isFromCache) {
				self.deferredData = $.Deferred();
				
				z.xAsync('BlockStatOracle', '업종별_매출추이', 'select', param, 'json2').done(function(resp) {
					// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
					if (resp) {
						self.rawDataArr = resp.filter(function(elm) {
							return -1 < self.blockCdArr.indexOf(elm['block_cd']);
						});
					}

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
					row[j] = Math.round(row[j] / 100000000),
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
			
			self.blockCdArr = blockCdArr;
			self.blockCdSet = new Set();
			
			for (var i in blockCdArr) {
				self.blockCdSet.add(blockCdArr[i].substring(0, 11));
			}
			
			// 차트 초기화 퍼블리싱 코드 옮겨옴		
			var options = {
				series: [{
					name: '총 매출',
					data: [0, 0, 0]
				}],
				chart: {
			        width: 480,
			        height: 270,
	                type: 'line',
					stacked: false,
	                toolbar: {
	                    show: true,
						offsetY: -45,
						offsetX: -22 //230807수정
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
				colors: ['#5e58c9'],
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
			var self = this;

			return chartLobzIndustry.loadData(true).done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				if (resp) {
					self.rawDataArr = resp.filter(function(elm) {
						return -1 < self.blockCdArr.indexOf(elm['block_cd']);
					});
				}
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
//				for (var i in xAxisArr) {
//					excelOpt.header.push(xAxisArr[i]);
//				}
				
				// 헤더 표시가 필요 없는 경우 아래의 1줄 추가
//				excelOpt.header.skipHeader = true;
				
				// json_to_sheet 방식은 한줄의 각 key 값이 첫째줄 헤더의 key 와 일치하는 위치에 표시됨
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

	// 평균분양가 차트 관리 객체
	var chartLotAvg = {
		
		init: function(apexChart, $form) {
			var self = this;
			
			self.deferred = $.Deferred();
			
			self.blockIdArr = blockIdArr;
			self.blockBounds = blockBounds;
			self.$form = $form;
			
			self.sanggaArr = $.extend(true, [], sanggaTypeArr);
			self.sanggaMap = $.extend(true, {}, sanggaTypeMap);
			
			// 최근 3년만 조회
			self.endYMD = moment().endOf('year');
			self.startYMD = self.endYMD.clone().subtract(2, 'year').startOf('year');
			
			
			// 차트 초기화 퍼블리싱 코드 옮겨옴		
//			const apexChart = "#chart_1_1";
			var options = {
				series: [],
				noData: {
					text: 'loading'
				},
				chart: {
					height: 300,
					width: 500,
					type: 'bar',
					zoom: {
						enabled: false
					},
	                toolbar: {
	                    show: true,
						offsetY: -38,
	                },
					events: {
						click: function(event, chartContext, config) {
				    		var $target = $(event.target);
				    							
				    		if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
				    			z.addDownloadLog('평균분양가', 'chart');
				    		}
			           	}
					}
				},
				plotOptions: {
					bar: {
						horizontal: true,
						columnWidth: '90%'
					}
				},
				dataLabels: { 	
					enabled: false
				},
				stroke: {
					width: 1,
					colors: ['transparent']
				},
			    grid: {
			        show: false,
			    },
				xaxis: {
					categories: [],
					labels: {
						formatter: function(value) {
							return z.toComma(value);
						},
			            show: true,
			            align: 'left',
			            minWidth: 0,
			            maxWidth: 80,
			            style: {
			                colors: [],
			                fontSize: '12px',
			                fontFamily: 'Helvetica, Arial, sans-serif',
			                fontWeight: 400,
			                cssClass: 'apexcharts-yaxis-label',
			            },
					},
//			        axisBorder: {
//			            show: false,
//			        },
			        axisTicks: {
			            show: true,
			        },
				},
				yaxis: {
					title: {
						text: undefined
					}
				},
				colors: ['#5e58c9','#2985d2','#2eb7c4','#a7c4a2','#b5bf1b','#f1c644','#f28f6c'],
				tooltip: {
					y: {
						formatter: function(value, point) {
							return z.toComma(value) + ' 만원';
						}
					}
				},
			    legend: {
					showForSingleSeries: true,
					showForNullSeries: true,
			        show: true,
			        fontSize: '10px',
			        fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
			        fontWeight: 400,
			        inverseOrder: false,
			        horizontalAlign: 'left',
			        offsetX: 0,
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
			            offsetY: 20
			        },
			        itemMargin: {
			            horizontal: 10,
			            vertical: 0
			        },
			    },
			};
	
			if (self.chart) {
				self.chart.destroy();
			}
	
			var chart = new ApexCharts($('#chart_1_1')[0], options);
			
			self.chart = chart;

			self.setBtnListener();


			chart.render().then(function() {
				// 이 호출이 없으면 두번째부터 로딩화면 표시가 안되는듯
				chart.updateSeries([]);

				self.loadData().done(function(resp) {
					self.loadCondition();
					self.loadXAxis();
					self.updateData();
				}).always(function() {
					self.deferred.resolve();
				});
			});
			z.formatDataReference('상가').done(function(refText) {
				self.$form.closest('.position-relative').find('.reference').text(refText);
			});
			
			return self.deferred;
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
			var self = this,
				blockBounds = self.blockBounds,
				param = {
					blockIdArr: self.blockIdArr,
					east: blockBounds.getEast(),
					west: blockBounds.getWest(),
					south: blockBounds.getSouth(),
					north: blockBounds.getNorth(),
					startYMD: self.startYMD.format('YYYYMM'),
					endYMD: self.endYMD.format('YYYYMM'),
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
				};
				
			return z.xAsync('BlockStat', '평균분양가', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;

				for (var i in resp) {
					var row = resp[i];
					
					// js 는 64비트 자료형 (long, double 과 동일함)
					row['분양가'] = parseInt(row['분양가']);
					row['분양면적'] = parseFloat(row['분양면적']);
					row['연면적'] = parseFloat(row['연면적']);
					row['전용면적'] = parseFloat(row['전용면적']);
					
					// 분양일이 YYYYMM 인데 YYYY 로 자름
					row['분양일'] = row['분양일'].substr(0, 4);
					
					// FIXME: 분양일 없는 데이터는? 현재 1900 로 고정시킴
					if (! row['분양일']) {
						row['분양일'] = '1900';
					}
					
					// 층 정보 재입력
					var floor = parseInt(row['층']);
					
					if (isNaN(floor) || 1 > floor) {
						row['층'] = -1;
					} else if (3 < floor) {
						row['층'] = 4;
					} else {
						row['층'] = floor;
					}
					
				}
			});
		},
		
		// 층 정보는 상권 선택에 따라서 동적으로 바뀔 수 있어서 분리함 > B1 이하 ~ 4층 이상 으로 고정
		loadCondition: function() {
			var self = this,
				rawDataArr = self.rawDataArr,
				floorArr = [
					{value: -1, text:'B1 이하'},
					{value: 1, text: '1F'},
					{value: 2, text: '2F'},
					{value: 3, text: '3F'},
					{value: 4, text: '4F 이상'}
				],
				$floor = self.$form.find('select[name=select_층]');

			$floor.html('').append($('<option/>', {value: '', text: '층'}));
			
			for (var i in floorArr) {
				$floor.append($('<option/>', floorArr[i]));
			}

			$floor.selectpicker('destroy');
			$floor.selectpicker();			
		},

		// x축 기준이 연도별 조회 만 있어서 고정시키는 함수
		loadXAxis: function() {
			var self = this
				xAxisArr = [];

			var diffTime = self.endYMD.diff(self.startYMD, 'years') + 1;
			var tmp = self.startYMD.clone();
			
			for (var i = 0; diffTime > i; ++i) {
				xAxisArr.push(tmp.format('YYYY'));
				tmp.add(1, 'year');
			}
			
			
			// 기본은 오름차순 정렬 > 내림차순으로 변경됨
			xAxisArr.reverse();

			// 엑셀 저장용 정보로도 활용될 예정
			self.xAxisArr = xAxisArr;
		},


		// 데이터 정제 후에 updateOptions, updateSeries 호출
		updateData: function() {
			var self = this,
				chartOptions = {
					xaxis: {
						categories: self.xAxisArr
					},
					noData: {
						text: '검색된 데이터가 없습니다'
					}
				},
				chartSeries = [],
				$form = self.$form,
				axisColumn = $form.find('[name=select_분류기준]').val();

			for (var i in self.sanggaArr) {
				var prevData = {
					name: self.sanggaArr[i],
					data: [],
					cnt: [],
					area: []
				};
				
				chartSeries.push(prevData);

				for (var j = 0, len = self.xAxisArr.length; len > j; ++j) {
					prevData.data.push(0);
					prevData.cnt.push(0);
					prevData.area.push(0);
				}
			}

			self.updateDataByShop(chartOptions, chartSeries);

			// 엑셀 저장용 정보로도 활용될 예정
			self.yAxisArr = chartSeries;
			
			if (chartOptions.isAllZero) {
				chartSeries = [];
			}

			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);
		},
		
		updateDataByShop: function(chartOptions, chartSeries) {
			var self = this,
				$form = self.$form,
				codeUnit = $form.find('[name=select_면적단위]').val(),
				codeArea = $form.find('[name=select_면적구분]').val(),
				codeFloor = $form.find('[name=select_층]').val(),
				isPy = '평' === codeUnit,
				prevCodeShop = '',
				prevData = null;
			
			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));			
			
			// 1. 상가유형별 정렬, 2. x축(연도)별 정렬, 3. 층 정렬 
			rawDataArr.sort(function(a, b) {
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
				
				if (a['층'] !== b['층']) {
					if (a['층'] < b['층']) {
						return -1;
					} else {
						return 1;
					}
				}
			});

			for (var i in rawDataArr) {
				var row = rawDataArr[i],
					idxData = self.sanggaMap[row['상가유형']];

				if (isNaN(idxData)) {
					continue;
				}
				
				// 특정 층만 계산하는데 층이 다르면 패스
				if (codeFloor && codeFloor != row['층']) {
					continue;
				}
				
				// 평균계산 기준인 면적이 없으면 패스 (전용면적 / 분양면적)
				if (! row[codeArea]) {
					continue;
				}
				
				var idxYear = self.xAxisArr.indexOf(row['분양일']);

				// cnt 로 평균 나눗셈 > 면적으로 평균 나눗셈 변경됨
				if (-1 < idxYear) {
					chartSeries[idxData].data[idxYear] += parseFloat(row['분양가']);
					chartSeries[idxData].cnt[idxYear] += 1;
					chartSeries[idxData].area[idxYear] += row[codeArea];
				}
			}
			
			// 소수점 2자리까지 출력
			for (var i in chartSeries) {
				var row = chartSeries[i],
					arr = row.data;
					
				for (var j in arr) {
					if (row.area[j]) {
						arr[j] = Math.round(100 * arr[j] / row.area[j] * (isPy ? zo.py2m : 1)) / 100;
					}
				}
			}
			
			var isAllZero = true;
			
			for (var i in chartSeries) {
				var arr = chartSeries[i].data;
				
				for (var j in arr) {
					if (arr[j]) {
						isAllZero = false;
						break;
					}
				}
				
				if (! isAllZero) {
					break;
				}
			}

			if (isAllZero) {
				chartOptions.isAllZero = true;
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
				
				result.resolve(ws);
			});
			return result;
		}
	};

	// 평균임대료 차트 관리 객체
	var chartRentAvg = {
		
		init: function(apexChart, $form) {
			var self = this;
			
			self.blockIdArr = blockIdArr;
			self.blockBounds = blockBounds;
			self.$form = $form;
			
			self.sanggaArr = $.extend(true, [], sanggaTypeArr);
			self.sanggaMap = $.extend(true, {}, sanggaTypeMap);
			
			// 최근 3년만 조회
			self.endYMD = moment().endOf('year');
			self.startYMD = self.endYMD.clone().subtract(2, 'year').startOf('year');
			
			// 차트 초기화 퍼블리싱 코드 옮겨옴		
			var options = {
				series: [],
				noData: {
					text: 'loading'
				},
				chart: {
					height: 300,
					width: 500,
					type: 'bar',
					zoom: {
						enabled: false
					},
	                toolbar: {
	                    show: true,
						offsetY: -45, //230807수정
						offsetX: -29 //230807수정
	                },
					events: {
						click: function(event, chartContext, config) {
				    		var $target = $(event.target);
				    							
				    		if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
				    			z.addDownloadLog('평균임대료', 'chart');
				    		}
			           	}
					}
				},
				plotOptions: {
					bar: {
						horizontal: true,
			            dataLabels: {
			                position: 'top',
			            },
					}
				},
				dataLabels: { 	
					enabled: false
				},
			    stroke: {
			        show: true,
			        width: 1,
			        colors: ['transparent']
			    },
			    grid: {
			        show: false,
			    },
				xaxis: {
					categories: [],
			        labels: {
			            show: true,
			            align: 'left',
			            minWidth: 0,
			            maxWidth: 80,
			            style: {
			                colors: [],
			                fontSize: '12px',
			                fontFamily: 'Helvetica, Arial, sans-serif',
			                fontWeight: 400,
			                cssClass: 'apexcharts-yaxis-label',
			            },
			        },
//			        axisBorder: {
//			            show: false,
//			        },
			        axisTicks: {
			            show: true,
			        },
				},
				yaxis: {
					title: {
						text: undefined
					}
				},
				tooltip: {
					y: {
						formatter: function(value, point) {
							return value + ' 만원';
						}
					}
				},
				colors: ['#5e58c9','#2985d2','#2eb7c4','#a7c4a2','#b5bf1b','#f1c644','#f28f6c'],
			    legend: {
					showForSingleSeries: true,
					showForNullSeries: true,
			        show: true,
			        fontSize: '10px',
			        fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
			        fontWeight: 400,
			        inverseOrder: false,
			        horizontalAlign: 'left',
			        offsetX: 0,
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
			            offsetY: 20
			        },
			        itemMargin: {
			            horizontal: 10,
			            vertical: 0
			        },
			    },
			};
	
			if (self.chart) {
				self.chart.destroy();
			}
	
			var chart = new ApexCharts($('#chart_3_1')[0], options);
			
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

			z.formatDataReference('매물').done(function(refText) {
				self.$form.closest('.position-relative').find('.reference').text(refText);
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
			var self = this,
				blockBounds = self.blockBounds,
				param = {
					blockIdArr: self.blockIdArr,
					east: blockBounds.getEast(),
					west: blockBounds.getWest(),
					south: blockBounds.getSouth(),
					north: blockBounds.getNorth(),
					startYMD: self.startYMD.format('YYYYMM'),
					endYMD: self.endYMD.format('YYYYMM')
				};
				
			return z.xAsync('BlockStat', '평균임대료', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;

				for (var i in resp) {
					var row = resp[i];
					
					// js 는 64비트 자료형 (long, double 과 동일함)
					row['층'] = parseInt(row['층']);
					row['임대료'] = parseFloat(row['임대료']);
					row['계약면적'] = parseFloat(row['계약면적']);
					row['계약면적_당_임대료'] = parseFloat(row['계약면적_당_임대료']);
					row['전용면적'] = parseFloat(row['전용면적']);
					row['전용면적_당_임대료'] = parseFloat(row['전용면적_당_임대료']);

					// 분양일이 YYYYMM 인데 YYYY 로 자름
					row['계약월'] = row['계약월'].substr(0, 4);

					// 층 정보 재입력
					var floor = parseInt(row['층']);
					
					if (isNaN(floor) || 1 > floor) {
						row['층'] = -1;
					} else if (3 < floor) {
						row['층'] = 4;
					} else {
						row['층'] = floor;
					}
				}
				
				// 임대료 0원 데이터 제외
				self.rawDataArr = (resp || []).filter(function(item) {
					return 0 < item['임대료'];
				});
				
			});
		},
		
		// 층 정보는 상권 선택에 따라서 동적으로 바뀔 수 있어서 분리함
		loadCondition: function() {
		},

		// x축 기준이 연도별 조회 만 있어서 고정시키는 함수
		loadXAxis: function() {
			var self = this,
				xAxisArr = [];

			var diffTime = self.endYMD.diff(self.startYMD, 'years') + 1;
			var tmp = self.startYMD.clone();
			
			for (var i = 0; diffTime > i; ++i) {
				xAxisArr.push(tmp.format('YYYY'));
				tmp.add(1, 'year');
			}

			// 기본은 오름차순 정렬 > 내림차순으로 변경
			xAxisArr.reverse();

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

			for (var i in self.sanggaArr) {
				var prevData = {
					name: self.sanggaArr[i],
					data: [],
					cnt: [],
					area: []
				};
				
				chartSeries.push(prevData);
				
				for (var j = 0, len = self.xAxisArr.length; len > j; ++j) {
					prevData.data.push(0);
					prevData.cnt.push(0);
					prevData.area.push(0);
				}
			}

			self.updateDataByFloor(chartOptions, chartSeries);

			// 엑셀 저장용 정보로도 활용될 예정
			self.yAxisArr = chartSeries;

			if (! chartSeries[0] || ! chartSeries[0].data.length) {
				chartOptions.noData = {
					text: '검색된 데이터가 없습니다'
				};
			}

			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);
		},
		
		updateDataByFloor: function(chartOptions, chartSeries) {
			var self = this,
				$form = self.$form,
				codeUnit = $form.find('[name=select_면적단위]').val(),
				codeArea = $form.find('[name=select_면적구분]').val(),
				codeFloor = $form.find('[name=select_층]').val(),
				isPy = '평' === codeUnit,
				prevCodeFloor = '',
				prevData = null;
			
			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));			
			
			// 1. 상가유형별 정렬, 2. x축(연도)별 정렬, 3. 층 정렬  
			rawDataArr.sort(function(a, b) {
				if (a['상가유형'] !== b['상가유형']) {
					if (a['상가유형'] < b['상가유형']) {
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
				
				if (a['층'] !== b['층']) {
					if (a['층'] < b['층']) {
						return -1;
					} else {
						return 1;
					}
				}

				return 0;
			});

			for (var i in rawDataArr) {
				var row = rawDataArr[i],
					idxData = self.sanggaMap[row['상가유형']];

				if (isNaN(idxData)) {
					continue;
				}
								
				// 특정 층만 계산하는데 층이 다르면 패스
				if (codeFloor && codeFloor != row['층']) {
					continue;
				}
				
				// 평균계산 기준인 면적이 없으면 패스 (전용면적 / 분양면적)
				if (! row[codeArea]) {
					continue;
				}

				var idxYear = self.xAxisArr.indexOf(row['계약월']);

				// 평균계산기준 수정: cnt 나눗셈 > area 나눗셈
				if (-1 < idxYear) {
					chartSeries[idxData].data[idxYear] += row['임대료'];
					chartSeries[idxData].cnt[idxYear] += 1;
					chartSeries[idxData].area[idxYear] += row[codeArea];
				}
			}

			// 소수점 2자리까지 출력
			for (var i in chartSeries) {
				var row = chartSeries[i],
					arr = row.data;
					
				for (var j in arr) {
					if (row.area[j]) {
						arr[j] = Math.round(100 * arr[j] / row.area[j] * (isPy ? zo.py2m : 1)) / 100;
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

	// 평균매매가 차트 관리 객체
	var chartTradingAvg = {
		
		init: function(apexChart, $form) {
			var self = this;
			
			self.blockIdArr = blockIdArr;
			self.blockBounds = blockBounds;
			self.$form = $form;
			
			self.sanggaArr = $.extend(true, [], sanggaTypeArr);
			self.sanggaMap = $.extend(true, {}, sanggaTypeMap);
			
			// 최근 3년만 조회
			self.endYMD = moment().endOf('year');
			self.startYMD = self.endYMD.clone().subtract(2, 'year').startOf('year');
			
			// 차트 초기화 퍼블리싱 코드 옮겨옴		
			var options = {
				series: [],
				noData: {
					text: 'loading'
				},
				chart: {
					height: 300,
					width: 500,
					type: 'bar',
					zoom: {
						enabled: false
					},
	                toolbar: {
	                    show: true,
						offsetY: -45, //230807수정
						offsetX: -29  //230807수정
	                },
					events: {
						click: function(event, chartContext, config) {
				    		var $target = $(event.target);
				    							
				    		if ($target.hasClass('exportSVG') || $target.hasClass('exportPNG')) {
				    			z.addDownloadLog('평균매매가', 'chart');
				    		}
			           	}
					}
				},
				plotOptions: {
					bar: {
						horizontal: true,
			            dataLabels: {
			                position: 'top',
			            },
					}
				},
				dataLabels: { 	
					enabled: false
				},
			    stroke: {
			        show: true,
			        width: 1,
			        colors: ['transparent']
			    },
			    grid: {
			        show: false,
			    },
				xaxis: {
					categories: [],
			        labels: {
			            show: true,
			            align: 'left',
			            minWidth: 0,
			            maxWidth: 80,
			            style: {
			                colors: [],
			                fontSize: '12px',
			                fontFamily: 'Helvetica, Arial, sans-serif',
			                fontWeight: 400,
			                cssClass: 'apexcharts-yaxis-label',
			            },
			        },
//			        axisBorder: {
//			            show: false,
//			        },
			        axisTicks: {
			            show: true,
			        },
				},
				yaxis: {
					title: {
						text: undefined
					}
				},
				tooltip: {
					y: {
						formatter: function(value, point) {
							return value + ' 만원';
						}
					}
				},
				colors: ['#5e58c9','#2985d2','#2eb7c4','#a7c4a2','#b5bf1b','#f1c644','#f28f6c'],
			    legend: {
					showForSingleSeries: true,
					showForNullSeries: true,
			        show: true,
			        fontSize: '10px',
			        fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
			        fontWeight: 400,
			        inverseOrder: false,
			        horizontalAlign: 'left',
			        offsetX: 0,
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
			            offsetY: 20
			        },
			        itemMargin: {
			            horizontal: 10,
			            vertical: 0
			        },
			    },
			};
	
			if (self.chart) {
				self.chart.destroy();
			}
	
			var chart = new ApexCharts($('#chart_4_1')[0], options);
			
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

			z.formatDataReference('매물').done(function(refText) {
				self.$form.closest('.position-relative').find('.reference').text(refText);
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
			var self = this,
				blockBounds = self.blockBounds,
				param = {
					blockIdArr: self.blockIdArr,
					east: blockBounds.getEast(),
					west: blockBounds.getWest(),
					south: blockBounds.getSouth(),
					north: blockBounds.getNorth(),
					startYMD: self.startYMD.format('YYYYMM'),
					endYMD: self.endYMD.format('YYYYMM')
				};
				
			return z.xAsync('BlockStat', '평균매매가', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서
				self.rawDataArr = resp;

				for (var i in resp) {
					var row = resp[i];
					
					// js 는 64비트 자료형 (long, double 과 동일함)
					row['층'] = parseInt(row['층']);
					row['매매가'] = parseFloat(row['매매가']);
					row['계약면적'] = parseFloat(row['계약면적']);
					row['계약면적_당_매매가'] = parseFloat(row['계약면적_당_매매가']);
					row['전용면적'] = parseFloat(row['전용면적']);
					row['전용면적_당_매매가'] = parseFloat(row['전용면적_당_매매가']);

					// 분양일이 YYYYMM 인데 YYYY 로 자름
					row['계약월'] = row['계약월'].substr(0, 4);

					// 층 정보 재입력
					var floor = parseInt(row['층']);
					
					if (isNaN(floor) || 1 > floor) {
						row['층'] = -1;
					} else if (3 < floor) {
						row['층'] = 4;
					} else {
						row['층'] = floor;
					}
				}
				
				// 임대료 0원 데이터 제외
				self.rawDataArr = (resp || []).filter(function(item) {
					return 0 < item['매매가'];
				});
				
			});
		},
		
		// 층 정보는 상권 선택에 따라서 동적으로 바뀔 수 있어서 분리함
		loadCondition: function() {
		},

		// x축 기준이 연도별 조회 만 있어서 고정시키는 함수
		loadXAxis: function() {
			var self = this,
				xAxisArr = [];

			var diffTime = self.endYMD.diff(self.startYMD, 'years') + 1;
			var tmp = self.startYMD.clone();
			
			for (var i = 0; diffTime > i; ++i) {
				xAxisArr.push(tmp.format('YYYY'));
				tmp.add(1, 'year');
			}

			// 기본은 오름차순 정렬 > 내림차순으로 변경
			xAxisArr.reverse();

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

			for (var i in self.sanggaArr) {
				var prevData = {
					name: self.sanggaArr[i],
					data: [],
					cnt: [],
					area: []
				};
				
				chartSeries.push(prevData);
				
				for (var j = 0, len = self.xAxisArr.length; len > j; ++j) {
					prevData.data.push(0);
					prevData.cnt.push(0);
					prevData.area.push(0);
				}
			}

			self.updateDataByFloor(chartOptions, chartSeries);

			// 엑셀 저장용 정보로도 활용될 예정
			self.yAxisArr = chartSeries;

			if (! chartSeries[0] || ! chartSeries[0].data.length) {
				chartOptions.noData = {
					text: '검색된 데이터가 없습니다'
				};
			}

			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);
		},
		
		updateDataByFloor: function(chartOptions, chartSeries) {
			var self = this,
				$form = self.$form,
				codeUnit = $form.find('[name=select_면적단위]').val(),
				codeArea = $form.find('[name=select_면적구분]').val(),
				codeFloor = $form.find('[name=select_층]').val(),
				isPy = '평' === codeUnit,
				prevCodeFloor = '',
				prevData = null;
			
			// 원본 복사 후 복사본 정렬
			var rawDataArr = JSON.parse(JSON.stringify(self.rawDataArr));			
			
			// 1. 상가유형별 정렬, 2. x축(연도)별 정렬, 3. 층 정렬  
			rawDataArr.sort(function(a, b) {
				if (a['상가유형'] !== b['상가유형']) {
					if (a['상가유형'] < b['상가유형']) {
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
				
				if (a['층'] !== b['층']) {
					if (a['층'] < b['층']) {
						return -1;
					} else {
						return 1;
					}
				}

				return 0;
			});

			for (var i in rawDataArr) {
				var row = rawDataArr[i],
					idxData = self.sanggaMap[row['상가유형']];

				if (isNaN(idxData)) {
					continue;
				}
								
				// 특정 층만 계산하는데 층이 다르면 패스
				if (codeFloor && codeFloor != row['층']) {
					continue;
				}
				
				// 평균계산 기준인 면적이 없으면 패스 (전용면적 / 분양면적)
				if (! row[codeArea]) {
					continue;
				}

				var idxYear = self.xAxisArr.indexOf(row['계약월']);

				// 평균계산기준 수정: cnt 나눗셈 > area 나눗셈
				if (-1 < idxYear) {
					chartSeries[idxData].data[idxYear] += row['매매가'];
					chartSeries[idxData].cnt[idxYear] += 1;
					chartSeries[idxData].area[idxYear] += row[codeArea];
				}
			}

			// 소수점 2자리까지 출력
			for (var i in chartSeries) {
				var row = chartSeries[i],
					arr = row.data;
					
				for (var j in arr) {
					if (row.area[j]) {
						arr[j] = Math.round(arr[j] / row.area[j] * (isPy ? zo.py2m : 1));
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
				excelOpt = {header: ["평균매매가"]};
			
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
					
					row['평균매매가'] = y.name;
					
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
			
			self.blockIdArr = blockIdArr;
			self.blockBounds = blockBounds;
			self.$form = $form;

			// 최근 3년만 조회
			self.endYMD = moment().endOf('quarter');
			self.startYMD = self.endYMD.clone().subtract(11, 'quarter').startOf('quarter');

			// 차트 초기화 퍼블리싱 코드 옮겨옴		
			var options = {
				series: [{
					name: '',
					data: []
				}],
				noData: {
					text: 'loading'
				},
				chart: {
			        type: 'line',
	                toolbar: {
	                    show: true,
						offsetY: -39, //230807수정
						offsetX: -28 //230807수정
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
				dataLabels: {
					enabled: false
				},
				xaxis: {
					categories: [],
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
			            offsetY: 20
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
				blockBounds = self.blockBounds,
				param = {
					blockIdArr: self.blockIdArr,
					east: blockBounds.getEast(),
					west: blockBounds.getWest(),
					south: blockBounds.getSouth(),
					north: blockBounds.getNorth(),
					startYMD: self.startYMD.format('YYYYMM'),
					endYMD: self.endYMD.format('YYYYMM')
				};
				
			return $.when(
				z.xAsync('BlockStat', '업종분포V2_old', 'select', param, 'json'),
				z.xAsync('BlockStat', '업종분포V2_new', 'select', param, 'json')
			).done(function(resp, resp2) {
				resp = [
					...resp,
					...resp2
				];
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
				$selectYear = $form.find('[name=select_업종현황]'),
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
			// self.yAxisArr = chartSeries;

			if (! chartSeries[0] || ! chartSeries[0].data.length) {
				chartOptions.noData = {
					text: '검색된 데이터가 없습니다'
				};
			}

			self.chart.updateOptions(chartOptions);
			self.chart.updateSeries(chartSeries);			
		},
		
		updateDataByIndustry: function(chartOptions, chartSeries) {
			var self = this,
				$form = self.$form,
				$selectYear = $form.find('[name=select_업종현황]');

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
				excelOpt = {header: ['업종분포']};
			
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


	// 유동인구: 요일 x 시간대별
	var chartPopFlowTime = {		
		init: function(apexChart) {
			var self = this;
			
			self.blockCdArr = blockCdArr;
			
			self.blockCdSet = new Set();
			
			for (var i in blockCdArr) {
				self.blockCdSet.add(blockCdArr[i].substring(0, 11));
			}

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
			            offsetX: -25 //230807수정
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
					showForSingleSeries: true,
					showForNullSeries: true,
			        fontSize: '10px',
			        fontFamily: "'Noto Sans Korean', 'Helvetica', sans-serif'",
			        fontWeight: 400,
			        inverseOrder: false,
			        verticalAlign: 'bottom',
			        horizontalAlign: 'left',
			        offsetX: 0,
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
			            offsetY: 20
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
					blockCdArr: Array.from(self.blockCdSet),
					startYMD: self.startYMD.format('YYYY'),
					endYMD: self.endYMD.format('YYYY'),
					groupCode: _GroupCode,
					demoSidonm: _DemoSidonm,
					demoSggnm: _DemoSggnm,
					demoLdongcd: _DemoLdongcd,
				};

			return z.xAsync('BlockStatOracle', '유동인구_시간별', 'select', param, 'json2').done(function(resp) {
				// 서버 데이터를 받자마자 2차가공이 바로 필요하면 여기에서

				// 불필요 데이터 제외
				if (resp) {
					self.rawDataArr = resp.filter(function(elm) {
						return -1 < self.blockCdArr.indexOf(elm['block_cd']);
					});
				}
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

	
	$btnFavorite.click(function() {
		if ($btnFavorite.hasClass('btn-danger')) {
			// 기존 즐겨찾기 삭제
			fnDeleteFavorite($btnFavorite.attr('data-seq-favorite'));
		} else {
			// 신규 즐겨찾기 등록
			$modalFavorite.find('[name="즐겨찾기_제목"]').val('');
			$modalFavorite.modal('show');
		}
	});
	
	var fnUpdateFavorite = function($name) {
		var self = this,
			name = $name.val(),
			addr = apiAddr.fnGetAddress();

		// FIXME: blockMap 과의 연관도 정리 필요
		var center = blockMap.fnGetBlockIdArrCenter(),
			bArr = blockIdArr.slice().sort(),
			description = addr.sidonm + ' ' + addr.sggnm + ' ' + addr.dongnm;

		if (1 < bArr.length) {
			description += ' 외 ' + (bArr.length - 1) + '건';
		}
		
		$.ajax({
			method: 'POST',
			url: '/api/gis/favorite',
			data: {
				'저장유형': 'block',
				'제목': name,
				'설명': description,
				'좌표X': center.geometry.coordinates[0],
				'좌표Y': center.geometry.coordinates[1],
				'대표아이디': bArr[0],
				blockIdArr: bArr
			}
		}).done(function(resp) {
			if (200 !== resp.code) {
				toastr.error('저장 중 오류가 발생했습니다', '오류', {timeOut: 3000});			
				return;
			}
			
			toastr.success('저장 되었습니다', '즐겨찾기', {timeOut: 3000});
			$modalFavorite.modal('hide');
			
			$btnFavorite.attr('data-seq-favorite', resp.response);
			$btnFavorite.removeClass('btn-outline-secondary').addClass('btn-danger');
		});
	};
	
	var fnDeleteFavorite = function(seq) {
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


	return {
		
		fnInitDtl: function() {
			$dtlRoot.find('.selectpicker').selectpicker();
		},
		
		fnLoadDtl: function(blockIdArr, blockBounds, blockCdArr, blockCenter) {
			fnLoadDtlPrivate(blockIdArr, blockBounds, blockCdArr, blockCenter);

			$dtlRoot.find('#cntDtlBlockArr').text(z.toComma(blockIdArr && blockIdArr.length || 0));
			
			// 먼저 표시되어야 하는 데이터 순서대로 호출
			chartRentAvg.init('#chart_3_1', $('#form_chart_3_1'));
			chartTradingAvg.init('#chart_4_1', $('#form_chart_4_1'));
			chartLotAvg.init('#chart_1_1', $('#form_chart_1_1')).always(function() {
				tableComplexList.init();
				tableNearAptList.init();
				tableNearFacStatList.init();
				tableNearTrafficStatList.init();
				tableRentForSaleList.init();
				tableTradingForSaleList.init();
				tableTRDList.init().always(function() {
					chartPopFlowTime.init('#chart_pop_flow_time');

					chartLobzIndustry.init('#chart_lobz_5');
					chartLobzTotal.init('#chart_lobz_6', $('#form_chart_lobz_6'));

					chartIndustry.init('#chart_5_1', $('#form_chart_5_1'));

					chartPopDaily.init('#chart_11').always(function() {
						chartDwlPopGenderAge.init('#chart_map_commerce_04');	// 거주인구 : 성별 x 연령별
						chartWorkPopGenderAge.init('#chart_7_2');				// 직장인구 : 성별 x 연령별
						chartFlowPopGenderAge.init('#chart_7_3');				// 유동인구 : 성별 x 연령별
					});
				});
			});
		},
		
		fnOpenDtl: function(blockIdArr, blockBounds, blockCdArr, blockCenter) {
			var self = this;
			if (! blockIdArr || ! blockIdArr.length) {
				z.msgAlert({
					html: '블럭을 1개 이상 선택 해주세요',
					icon: 'error'
				});
				return;
			}
			
			if (! blockCdArr || ! blockCdArr.length) {
				z.msgAlert({
					html: '집계할 데이터 범위를 계산중입니다. 잠시후 선택한 블럭의 상권분석보기 버튼을 다시 눌러주세요.',
					icon: 'error'
				});
				return;
			}
			
			$dtlRoot.removeClass('d-none');
			$dtlRoot.addClass('d-flex');
			
			// 첫번째탭에서 스크롤 리셋
			$dtlRoot.find('ul.nav-tabs [href="#kt_tab_pane_1"]').click();
			$dtlRoot.children('[data-scroll]').scrollTop(0);
			
			self.fnLoadDtl(blockIdArr, blockBounds, blockCdArr, blockCenter);
		},
		
		fnCloseDtl: function() {
			$dtlRoot.removeClass('d-flex');
			$dtlRoot.addClass('d-none');
		},
		
		fnReloadHack: function() {
			$dtlScroll.scrollTop(0);
			
			setTimeout(function() {
				chartDwlPopGenderAge.init('#chart_map_commerce_04');	// 거주인구 성별 * 연령별
				chartWorkPopGenderAge.init('#chart_7_2');				// 직장인구 성별 * 연령별
				chartFlowPopGenderAge.init('#chart_7_3');				// 유동인구 성별 * 연령별
			}, 200);
		},
		
		fnExport: function(attr) {
			switch (attr) {
				case 'png':
					break;
				case 'svg':
					break;
				case 'excel':
				default:
					$.when(
						chartLotAvg.exportSheet(),
						tableComplexList.exportSheet(),
						chartRentAvg.exportSheet(),
						tableRentForSaleList.exportSheet(),
						chartTradingAvg.exportSheet(),
						tableTradingForSaleList.exportSheet(),
						tableTRDList.exportSheet(),
						chartIndustry.exportSheet_1(),
						chartIndustry.exportSheet_2(),
						tableNearAptList.exportSheet(),
						tableNearFacStatList.exportSheet(),
						tableNearTrafficStatList.exportSheet()
					).done(function() {
						if (1 > arguments.length) {
							return;
						}
						
						var wb = XLSX.utils.book_new(),
							sheetNameArr = ['평균분양가', '분양현장 리스트', '평균임대료', '임대매물 리스트', '평균매매가', '매매매물 리스트', '실거래 리스트', '업종 현황_2022', '업종 현황_2023','아파트정보 리스트', '시설정보 리스트', '교통정보 리스트'];
						
						for (var i in arguments) {
							var ws = arguments[i];
							XLSX.utils.book_append_sheet(wb, ws, sheetNameArr[i]);
						}
						
						// FIXME: 다운로드 이름형식 결정 필요
						XLSX.writeFile(wb, moment().format('YYYYMMDD') + '_상권분석정보.xlsx');
						
						z.xAsync('Gis', '사용자다운로드메뉴로그', 'insert', {
							menuCd: zo.pgmCode,
							downNm: '상권분석정보'
						}, 'json');						
					});
					break;
			}
		}
	};
})();