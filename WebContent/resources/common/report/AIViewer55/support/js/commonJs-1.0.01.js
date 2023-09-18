/**
 * AIReport 5.6 이상 HTML 버전용
 *
 * @fileName	commonJs
 * @Version	1.0.01
 *
 * =============== 수정이력 ==================
 *  담당자		수정일			비고
 *	sa				2016.09.20		EXE뷰어 로직수정
 *  sa				2017.05.10		사용자 툴바커스텀 컨트롤 기능추가
 * ============================================
 *
 *
 * Copyright (c) 2016 SOLBITECH All rights reserved.
 *
 * SOLBITECH www.solbitech.com
 */

var commonJsControl = {};

$(document).ready(function(){
	
	commonJsControl = {
		ierendering : false, // IE10 렌더링 사용여부
		windowresize : false, // 팝업창 리사이즈 사용여부
		windowpopbutt : false, // 팝업 버튼 활성화 사용여부
		windowdivpop : false, // 모달팝업 활성화 사용여부
		partViewZoom : true, // 파트뷰 줌 활성화 사용여부
		editViewMode : false,
		topToolbarStyle : {
			show : true, // 커스텀툴바 컨트롤 활성화 사용여부
			align : 'center', // left, center, right 정렬
			color : '',
			background : '#323232', // def, blue, green, orange, black or 툴바 색상
			l_icon : '2', // 0 ~ 4
			r_icon : '0' // 0 ~ 4
		}
	};
	
	if (commonJsControl.ierendering) {
		commonJs.ierendering();
	}
	if (commonJsControl.windowresize) {
		commonJs.windowresize();
	}
	if (commonJsControl.windowpopbutt) {
		commonJs.windowpopbutt();
	}
	if (commonJsControl.windowdivpop) {
		commonJs.windowdivpop();
	}
	if (commonJsControl.partViewZoom) {
		commonJs.partViewZoom();
	}
	if (commonJsControl.editViewMode) {
		commonJs.editViewMode();
	}
	if (commonJsControl.topToolbarStyle.show) {
		commonJs.topToolbarStyle(commonJsControl.topToolbarStyle);
	}
});


var popupCk = '';

var commonJsInfo = {
	'userAgent' : navigator.userAgent,
	'popaction' : '/app/support/reportPopView.jsp'
}

/*var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var img = new Image();
img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    var data = canvas.toDataURL("image/png");
    
    var length = 10000;
    for (var i = 0 ; i < (data.length / 10000);i++) {
    	$('body').append('<div id="images' + i + '"></div>');
    	$('#images' + i).html(data.substring((i * length), ((i+1) * length)));
    }
};
img.src = "http://localhost:51/app/support/css/r_icon.png";*/

var commonJs = {};

commonJs.topToolbarStyle = function(ondata) {
	
	var toolbaroption = {
		menuliparser : function(menu) {
			var addview = function(li){
				if (li == 'goToNext') { menuList.push('page'); } else if (li == 'ZoomIn') { menuList.push('size'); }
				return li;
			},
			menuList = [], // 툴바 리스트 설정
			option = function(li) {
				for (var n = 0 ; n < li.length ; n++) {
					menuList.push(addview($(li[n]).attr('id')));
				}
			}
			
			if (menu.indexOf('oldmenu') != -1) {
				option($('#oldmenu table td input'));
			} else {
				for (var m = 1 ; m < 4 ; m++) {
					option($('.menu_' + m + ' li input'));
				}
			}
			$(menu).html(''); // 툴바 초기화
			return menuList;
		},
		menulimake : function(menuList) {
			var inputEvent = {
				'goToTop' : {
					action : { type : 'button', onClick : 'goScroll(startPage);', title : 'Top' },
					cls : 'menu-l-icon-toolbar',
					css : {
						'background-position' : '0px ' + (ondata.l_icon * -40) + 'px',
						'margin-left' : '2px',
						'margin-right' : '2px'
					}
				},
				'goToPrev' : {
					action : { type : 'button', onClick : 'goPrev();', title : 'Prev' },
					cls : 'menu-l-icon-toolbar',
					css : {
						'background-position' : '-40px ' + (ondata.l_icon * -40) + 'px',
						'margin-left' : '2px',
						'margin-right' : '5px'
					}
				},
				'goToNext' : {
					action : { type : 'button', onClick : 'goNext();', title : 'Next' },
					cls : 'menu-l-icon-toolbar',
					css : {
						'background-position' : '-80px ' + (ondata.l_icon * -40) + 'px',
						'margin-left' : '5px',
						'margin-right' : '2px'
					}
				},
				'goToBottom' : { 
					action : { type : 'button', onClick : 'goScroll(endPage);', title : 'Bottom' },
					cls : 'menu-l-icon-toolbar',
					css : {
						'background-position' : '-120px ' + (ondata.l_icon * -40) + 'px',
						'margin-left' : '2px',
						'margin-right' : '0px'
					}
				},
				'ZoomOut' : { 
					action : { type : 'button', onClick : 'ZoomOut();', title : 'Zoom Out' }, 
					cls : 'menu-l-icon-toolbar',
					css : {
						'background-position' : '-160px ' + (ondata.l_icon * -40) + 'px',
						'margin-left' : '20px',
						'margin-right' : '5px'
					}
				},
				'ZoomIn' : { 
					action : { type : 'button', onClick : 'ZoomIn();', title : 'Zoom In' }, 
					cls : 'menu-l-icon-toolbar',
					css : {
						'background-position' : '-200px ' + (ondata.l_icon * -40) + 'px',
						'margin-left' : '5px',
						'margin-right' : '0px'
					}
				},
				'print' : { 
					action : { type : 'button', onClick : 'PDFPrint();', title : 'Print' },
					cls : 'menu-r-icon-toolbar',
					css : {
						'background-position' : '-0px ' + (ondata.r_icon * -40) + 'px',
						'margin-left' : '20px',
						'margin-right' : '2px'
					}
				},
				'pdfConvert' : { 
					action : { type : 'button', onClick : 'PDFConvert();', title : 'PDF SAVE' }, 
					cls : 'menu-r-icon-toolbar',
					css : {
						'background-position' : '-40px ' + (ondata.r_icon * -40) + 'px',
						'margin-left' : '2px',
						'margin-right' : '2px'
					}
				},
				'hwpConvert' : { 
					action : { type : 'button', onClick : 'hwpConvert();', title : 'HWP SAVE' },
					cls : 'menu-r-icon-toolbar',
					css : {
						'background-position' : '-80px ' + (ondata.r_icon * -40) + 'px',
						'margin-left' : '2px',
						'margin-right' : '2px'
					}
				},
				'excelConvert' : { 
					action : { type : 'button', onClick : 'ExcelConvert();', title : 'Excel SAVE' },
					cls : 'menu-r-icon-toolbar',
					css : {
						'background-position' : '-120px ' + (ondata.r_icon * -40) + 'px',
						'margin-left' : '2px',
						'margin-right' : '2px'
					}
				},
				'msWordConvert' : { 
					action : { type : 'button', onClick : 'mswordConvert();', title : 'Word SAVE' },
					cls : 'menu-r-icon-toolbar',
					css : {
						'background-position' : '-160px ' + (ondata.r_icon * -40) + 'px',
						'margin-left' : '2px',
						'margin-right' : '2px'
					}
				},
				'mswordConvert' : { 
					action : { type : 'button', onClick : 'mswordConvert();', title : 'Word SAVE' },
					cls : 'menu-r-icon-toolbar',
					css : {
						'background-position' : '-160px ' + (ondata.r_icon * -40) + 'px',
						'margin-left' : '2px',
						'margin-right' : '2px'
					}
				},
				'powerPointConvert' : { 
					action : { type : 'button', onClick : 'powerPointConvert();', title : 'PPT SAVE' },
					cls : 'menu-r-icon-toolbar',
					css : {
						'background-position' : '-200px ' + (ondata.r_icon * -40) + 'px',
						'margin-left' : '2px',
						'margin-right' : '2px'
					}
				},
				'datasave' : { 
					action : { type : 'button', onClick : 'commonJs.editsave();', title : 'DATA SAVE' },
					cls : 'menu-r-icon-toolbar',
					css : {
						'background-position' : '-320px ' + (ondata.r_icon * -40) + 'px',
						'margin-left' : '20px',
						'margin-right' : '0px'
					}
				}
			}
			
			var selectEvent = {
				'page' : { onclick : 'goToMove()', title : 'page' },
				'size' : { onclick : 'ZoomInOut()', title : 'zoom' }
			}
			
			var $vipmenulimake = $('<td></td>');
			var $vipobject = null;
			for (var ls in menuList) {
				var key = menuList[ls];
				if (selectEvent[key] != null) {
					$vipobject = $('<select/>').attr({'id' : key, 'alt' : ' '}).addClass('custom-select' + ((ondata.background.indexOf('#') == -1) ? ' menu-color-' + ondata.background : ''));
					$vipobject.attr(selectEvent[key]);
					if (ondata.background.indexOf('#') != -1) { $vipobject.css({'background':ondata.background,'color':(ondata.color == '' ? '#FFFFFF' : ondata.color)}); }
					if (key == 'size') {
						for (var i = 50 ; i <= 150 ; ) {
							$vipobject.append($('<option/>').html(i + '%'));
							i+=10;
						}
					}
				} else {
					var option = inputEvent[key];
					$vipobject = $('<input/>').attr(option.action).css(option.css).addClass('custom-buttom ' + option.cls);
				}
				$vipmenulimake.append($vipobject);
			}
			
			if (commonJsControl.editViewMode) {
				var option = inputEvent['datasave'];
				$vipobject = $('<input/>').attr(option.action).css(option.css).addClass('custom-buttom ' + option.cls);
				$vipmenulimake.append($vipobject);
			}
			
			return $vipmenulimake;
		}
	};
	
	var vipmap = {
		menuId : ($('#menu').length > 0) ? '#menu' : '#oldmenu',
		menuList : null,
		option : function() {
			var vipmapoption = {
				'width' : '100%',
				'background' : ondata.background
			}
			if (ondata.color.indexOf('#') == -1) {
				delete vipmapoption['background'];
				$(vipmap.menuId).addClass('menu-border-color');
				if (ondata.background.indexOf('#') != -1) {
					$(vipmap.menuId).css({'background' : ondata.background});
				} else {
					$(vipmap.menuId).addClass('menu-color-' + ondata.background);
				}
			}
			$(vipmap.menuId).css(vipmapoption);
		}
	}
	vipmap.option();
	vipmap.menuList = toolbaroption.menuliparser(vipmap.menuId);
	
	var $vipTable = $('<table/>').attr('id', 'topToolBar').css({'margin-left': '20px', 'margin-right': '20px', 'padding-top': '7px'});
	if (ondata.align == 'center') {
		$vipTable = $('<center/>').append($vipTable);
	} else {
		$vipTable.css('float', ondata.align);
	}
	
	var $vipTr = $('<tr></tr>');
	$vipTr.append(toolbaroption.menulimake(vipmap.menuList));
	$(vipmap.menuId).append($vipTable.append($vipTr));
	
	$('#page *').remove();
	for(var page = 1 ; page <= endPage ; page++){
		var optionStr = '<option>' + page + '/' + endPage + 'page</option>';
		$('#page').append(optionStr);
	}
};

commonJs.resizeWin = function(maxX, maxY, speed, delay, win) {
	this.obj = "resizeWin" + (commonJs.resizeWin.count++);
	eval(this.obj + "=this");
	if (!win)     this.win = self;    else this.win = eval(win);
	if (!maxX)    this.maxX = 400;    else this.maxX = maxX;
	if (!maxY)    this.maxY = 300;    else this.maxY = maxY;
	if (!speed)   this.speed = 1/2;   else this.speed = 1/speed;
	if (!delay)   this.delay = 0;    else this.delay = delay;
	this.doResize = (document.all || document.getElementById);
	this.stayCentered = false;
	
	this.initWin = function() {rla
		if (this.doResize) {
			this.resizeMe();
		} else {
			this.win.resizeTo(this.maxX + 10, this.maxY - 20);
		}
	}

	this.resizeMe = function() {
		this.win.focus();
		this.updateMe();
	}
	
	this.resizeTo = function(x,y) {
		this.maxX = x;
		this.maxY = y;
		this.resizeMe();
	}
		
	this.stayCentered = function() {
		this.stayCentered = true;
	}

	this.updateMe = function() {
		this.resizing = true;
		var x = Math.ceil((this.maxX - this.getX()) * this.speed);
		var y = Math.ceil((this.maxY - this.getY()) * this.speed);
		if (x == 0 && this.getX() != this.maxX) {
			if (this.getX() > this.maxX) x = -1;
			else  x = 1;
		}
		if (y == 0 && this.getY() != this.maxY){
			if (this.getY() > this.maxY) y = -1;
			else y = 1;
		}
		if (x == 0 && y == 0) {
			this.resizing = false;
    	} else {
			this.win.top.resizeBy(parseInt(x),parseInt(y));
			if (this.stayCentered == true) this.win.moveTo((screen.width - this.getX()) / 2,(screen.height - this.getY()) / 2);
				setTimeout(this.obj + '.updateMe()',this.delay)
			}
		}
		
	this.write =  function(text){
		if (document.all && this.win.document.all["coords"]) this.win.document.all["coords"].innerHTML = text;
		else if (document.getElementById && this.win.document.getElementById("coords")) this.win.document.getElementById("coords").innerHTML = text;
	}
		
	this.getX =  function(){
		if (document.all) return (this.win.top.document.body.clientWidth + 10)
		else if (document.getElementById)
			return this.win.top.outerWidth;
		else return this.win.top.outerWidth - 12;
	}
	
	this.getY = function(){
		if (document.all) return (this.win.top.document.body.clientHeight + 29)
		else if (document.getElementById)
			return this.win.top.outerHeight;
		else return this.win.top.outerHeight - 31; 
	}
	
	this.onResize =  function(){
		if (this.doResize){
			if (!this.resizing) this.resizeMe();
		}
	}
	return this;
}
commonJs.resizeWin.count = 0;

commonJs.userbrowser = function() {
	var userBrs = commonJsInfo.userAgent;
	if (userBrs.indexOf('MSIE') != -1 || userBrs.indexOf('Trident') != -1) {
		if (userBrs.indexOf('Mozilla/5.0') != -1 && userBrs.indexOf('MSIE 10.0') != -1) { return true; }
		if (userBrs.indexOf('MSIE 7.0') != -1 && userBrs.indexOf('Trident/6.0') != -1) { return true; }
	}
	return false;
}

commonJs.ierendering = function() {
	if (commonJs.userbrowser) { // IE10 렌더링 문제 해결 함수.
		$('meta[content="IE=edge"]').attr('content', 'IE=EmulateIE9');
	}
}

commonJs.windowresize = function() {
	if ($('#p1').width() < 800) {
		dolion = new commonJs.resizeWin(1000,1000); //세로보고서
	} else {
		dolion = new commonJs.resizeWin(1800,500); //가로보고서
	}
	dolion.stayCentered();
	dolion.initWin();
	dolion.onResize();
}

commonJs.windowpopbutt = function() {
	$('#root').append('<input type="button" id="windowpopbutt" onclick="commonJs.windowpopview()" value="" title="팝업창 열기"/>');
}

commonJs.windowdivpop = function() {
	$('#root').append('<iframe id="aireport_pop" name="aireport_pop" style="" width="100px" height="100px" src=""/>');
}

commonJs.windowpopview = function() {
	var d = propParameter;
	d['url'] = document.location.href;
	var f = document.createElement('form');
	f.setAttribute('method', 'post');
	f.setAttribute('id', 'actionformpost');
	f.setAttribute('target', 'solbipopview');
	f.setAttribute('action', commonJsInfo.popaction);
	document.body.appendChild(f);
	for (var k in d) {
		var i = document.createElement('input');
		i.setAttribute('type', 'hidden');
		i.setAttribute('name', k);
		i.setAttribute('value', d[k]);
		f.appendChild(i);
	}
	popupCk = window.open('', 'solbipopview', 'width=800px,height=800px');
	f.submit();
	$('#actionformpost').remove();
}

var inputTitle = 'no Data';
var fontSize = '';

function valuefillter(value) {
	value = value.replace(/&nbsp;/gi, ' ');
	return value;
}



commonJs.partViewZoom = function() {
	var script = $('script[type="text/javascript"]');
	var scriptFlag = false;
	for (var i = 0 ; i < script.length ; i++) {
		var srcnm = $(script[i]).attr('src');
		if (srcnm != null) {
			if ($(script[i]).attr('src').indexOf('newAireport') != -1) {
				scriptFlag = true;
			}
		}
	}
	if (!scriptFlag) {
		return;
	}
	var header = $($('#oldmenu tr')[1])[0];
	var headerList =  $($($('#oldmenu tr')[1])[0]).children();
	var src = $('#excelConvert').attr('src').replace('excel.png', '');
	var zoomin = '<input type="image" alt=" " src="' + src + 'zoomin.png" id="ZoomIn" class="zoomin" width="55" height="23" border="0" onclick="ZoomIn();" value="확대"></td>';
	var zoomsize = '<select id="size" title="zoom" onchange="ZoomInOut();">';
	for (var zoom = 50 ; zoom <= 150 ;) {
		zoomsize +=	'<option>' + zoom + '%</option>';
		zoom += 10;
	}
	var zoomout = '<input type="image" alt=" " src="' + src + 'zoomout.png" id="ZoomOut" class="zoomout" width="55" height="23" border="0" onclick="ZoomOut();" value="축소"></td>';
	var arry = [];
	var icon = ['d_01.png', 'd_02.png', '', 'd_03.png', 'd_04.png'];
	var nicon = ['KO/first.png', 'KO/pre.png', '', 'KO/next.png', 'KO/last.png'];
	for (var i = 0 ; i < headerList.length ; i++) {
		if (i < icon.length) {
			arry.push(headerList[i].innerHTML.replace(icon[i], nicon[i]));
		} else {
			arry.push(headerList[i].innerHTML);
		}
		if (i == 4) { arry.push(zoomout); arry.push(zoomsize); arry.push(zoomin); }
	}
	var tr = '';
	for (var td in arry) {
		tr += '<td>' + arry[td] + '</td>';
	}
	header.innerHTML = tr;
}

commonJs.editViewMode = function() {
	var report_object = $('#root td');
	
	var styleoption = function(control, cellStyle) {
		var userBrs = navigator.userAgent;
		if (control == 'style') {
			if (userBrs.indexOf('Swing') != -1 || userBrs.indexOf('MSIE') != -1
					|| userBrs.indexOf('Trident') != -1 || userBrs.indexOf('Firefox') != -1) {
				$(cellStyle).css('margin', '1px');
				$(cellStyle).css('padding', '1px');
			} else {
				$(cellStyle).css('margin', '0');
				$(cellStyle).css('padding', '0');
			}
			return true;
		} else if (control == 'width') {
			if (userBrs.indexOf('Chrome') != -1 
					|| userBrs.indexOf('Opera') != -1) {
				return '99%'
			} else if (userBrs.indexOf('MSIE') != -1 || userBrs.indexOf('Trident') != -1) {
				return (cellStyle.width - 3) + 'px';
			} else {
				return '98%';
			}
		} else if (control == 'height') {
			return (cellStyle.height) + 'px';
		}
	}
	
	var rendering = function(jsondata, cellStyle) {
		var inputadd;
		try {
			var parser = new DOMParser;
			var dom = parser.parseFromString('<!doctype html><body>' + jsondata.value, 'text/html');
			jsondata.value = dom.body.textContent;
			
			if (jsondata.type == 'input' || jsondata.type == 'textarea' || jsondata.type == 'select' || jsondata.type == 'button') {
				if (jsondata.type == 'button') {
					inputadd = document.createElement('input');
					inputadd.setAttribute('type', jsondata.type);
					inputadd.setAttribute('id', jsondata.name);
					inputadd.setAttribute('value', jsondata.value);
					inputadd.setAttribute('class', 'editValue');
					if (jsondata.name == 'submit') {
						inputadd.setAttribute('onclick', 'parent.formsubmit()');
					}
				} else {
					inputadd = document.createElement(jsondata.type);
					if (jsondata.type != 'select') {
						inputadd.setAttribute('type', 'text');
						if (jsondata.value != null && jsondata.value != '') {
							inputadd.setAttribute('value', jsondata.value);
						} else {
							inputadd.setAttribute('value', '');
						}
						inputadd.setAttribute('placeholder', inputTitle);
					}
					inputadd.style.background = '#FFFFF6';
				}
				inputadd.setAttribute('class', 'editValue ' + cellStyle.cls);
				inputadd.setAttribute('name', jsondata.name);
				inputadd.style.width = styleoption('width', cellStyle);
				if (jsondata.type == 'textarea') {
					inputadd.style.width = '98%';
					if (jsondata.value != null && jsondata.value != '') {
						inputadd.value = jsondata.value.replace(/\[BR\]/g, '\n');
					}
				}
				inputadd.style.fontSize = cellStyle.fontSize;
				//inputadd.style.height = styleoption('height', cellStyle);
				inputadd.style.padding = '0px';
				inputadd.style.margin = '0px';
				inputadd.style.border = '1px solid #cccccc';
			}
			
			if (jsondata.type == 'select') {
				for (var item in jsondata.item) {
					if (jsondata.item[item].indexOf('~') != -1) {
						var items = jsondata.item[item].split('~');
						for (var i = items[0]; i <= items[1]; i++) {
							var itembox = document.createElement('option');
							itembox.setAttribute('value', i);
							itembox.innerHTML = i;
							inputadd.appendChild(itembox);
						}
					} else {
						var itembox = document.createElement('option');
						itembox.setAttribute('value', jsondata.item[item]);
						itembox.innerHTML = jsondata.item[item];
						inputadd.appendChild(itembox);
					}
				}
			} else if (jsondata.type == 'checkbox' || jsondata.type == 'radio') {
				inputadd = document.createElement('div');
				for (var item in jsondata.item) {
					var itembox = document.createElement('input');
					itembox.setAttribute('type', jsondata.type);
					itembox.setAttribute('name', jsondata.name);
					var value = valuefillter(jsondata.item[item]);
					if (value.indexOf(':') != -1) {
						value = value.replace(':checked', '');
						itembox.setAttribute('value', value);
						itembox.setAttribute('checked', 'checked');
					} else {
						itembox.setAttribute('value', jsondata.item[item]);
					}
					inputadd.appendChild(itembox);
					inputadd.appendChild(document.createTextNode(value));
				}
			} else if (jsondata.type == 'canvas') {
				inputadd = document.createElement('canvas');
				inputadd.setAttribute('id', 'canvas_signature');
				inputadd.setAttribute('class', 'loadvis');
			}
		} catch (err) {
		}
		return inputadd;
	}
	
	for (var convert = 0; convert < report_object.length; convert++) {
		var cellobject = $(report_object[convert])[0];
		var calldata = cellobject.innerHTML.replace(/<br>/gi, '\r\n').replace(/\r\n/g, '').replace(/\n/g, '[BR]').replace(/(<([^>]+)>)/ig, '');
		try {
			calldata = jQuery.parseJSON(calldata);
			styleoption('style', report_object[convert]);
		} catch (err) {
		}
		if(calldata && typeof calldata =='object') {
			cellobject.innerHTML = '';
			//cellobject.appendChild(rendering(calldata, {'cls' : $(cellobject).attr('class'), 'width' : cellobject.clientWidth, 'height' : cellobject.clientHeight, 'fontSize' : (fontSize == '' ? '9pt' : fontSize)}));
			cellobject.appendChild(rendering(calldata, {'cls' : $(cellobject).attr('class'), 'width' : cellobject.clientWidth, 'height' : cellobject.clientHeight}));
		}
	}
}

commonJs.editsave = function() {
	var data = $('.editValue');
	$.ajax({
		type : 'post',
		dataType : 'json',
		url : 'serversave.jsp',
		data : data,
		success : function(data) {
			parent.toastMessage(data.code);
		},
		error : function(e) {
			parent.toastMessage('500');
		}
	});
}

commonJs.windowTotPageInput = function() {
	//console.log(endPage);
	//opener.document.getElementById("opentotPage").value=getTotPage();
	//parent.document.getElementById("totPage").value= getTotPage();
}