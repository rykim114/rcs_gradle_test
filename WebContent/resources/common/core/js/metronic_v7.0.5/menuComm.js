
/**
 * @author sanggyu.lee(zeons)
 */
/* menu *****************************************************************************************************************************/
// 메뉴 열기
z.menuLink = function (sysId, pgmCode) {
	if ( sysId == null || sysId == "" || pgmCode == null || pgmCode == "" ) {
		return;
	}
	
	/**************************************************
	 * init
	 */
	zo = {};
	
	z.__LayoutDiv = "basic";
	z.__Options   = null;
	
	z.__SearchSelectBox   = {};
	z.__SearchInput       = [];
	z.__MenuElementCount  = 0;
	z.__MenuSelectBox     = {};
	z.__MenuButtonHandler = {};
	z.__MenuDropdown      = {};
	
	z.__NotNull       = {};
	z.__DupCheck      = {};
	z.__InsertOnly    = {};
	z.__DefaultValue  = {};
	z.__SelectBox     = {};
	z.__SqlInfo       = {};
	z.__CalendarInfo  = {};
	z.__ModalBtns     = {};
	z.__ModalData     = {};
	z.__ModalTemplate = {};
	
	for ( prop in z.__Datatable ) {
		z.__Datatable[prop].datatable.destroy();
	}
	
	z.__Datatable      = {};
	z.__DatatableModal = {};
	
	var pgmUrl  = "jsp";
	var pgmInfo = {};
	
	$("#kt_content_web_content_css").remove();
	$("#kt_content_web_content_options_script").remove();
	$("#kt_content_web_content_script").remove();
	$("#kt_content_web_header_main_search").empty();
	$("#kt_content_web_header_main_buttons").empty();
	
//	$("[name=z-handlebars-template").remove();
	$('#kt_content_web_content').empty();
	
	
	/**************************************************
	 * header
	 */
	if ( pgmCode == "dashboard" ) {
		$("#z-menu-text").text("Dashboard");
		pgmInfo.pgm_code = "dashboard";
	}
	else if ( pgmCode == "changePassword" ) {
		$("#z-menu-text").text("Change Password");
		pgmInfo.pgm_code = "changePassword";
	}
	else {
		pgmInfo = z.xA("Comm", "getUserMenu", "select", {"decrypt_pgm_code": pgmCode}, "json2");
		
		if ( pgmInfo == null || pgmInfo.length <= 0 ) {
			_X.MBox("확인", "프로그램 또는 권한이 없습니다.");
			return;
		}
		else {
			pgmInfo = pgmInfo[0];
			pgmUrl  = pgmInfo.pgm_url;
			
			z.__LayoutDiv = pgmInfo.layout_div;
			
			/**************************************************
			 * title
			 */
			$("#z-menu-text").text(pgmInfo.pgm_name);
			
			/**************************************************
			 * buttons
			 */
			var mainBtnHtml    = "";
			var isNotDatatable = z.__LayoutDiv != "datatable";

			if ( pgmInfo.retrieve_yesno == "Y" ) {
				mainBtnHtml += '<input type="search" class="z-main-search-key-word" id="main_search_key_word" placeHolder="Search..">';
				mainBtnHtml += '<button type="submit" class="btn btn-success z-main-btn z-main-btn-retrieve mr-2">조회</button>';
			}
			if ( isNotDatatable && pgmInfo.insert_yesno == "Y" ) {
				mainBtnHtml += '<button type="submit" class="btn btn-info z-main-btn z-main-btn-insert mr-2">삽입</button>';
			}
			if ( isNotDatatable && pgmInfo.append_yesno == "Y" ) {
				mainBtnHtml += '<button type="submit" class="btn btn-info z-main-btn z-main-btn-append mr-2">추가</button>';
			}
			if ( isNotDatatable && pgmInfo.duplicate_yesno == "Y" ) {
				mainBtnHtml += '<button type="submit" class="btn btn-info z-main-btn z-main-btn-duplicate mr-2">복제</button>';
			}
			if ( isNotDatatable && pgmInfo.delete_yesno == "Y" ) {
				mainBtnHtml += '<button type="submit" class="btn btn-info z-main-btn z-main-btn-delete mr-2">삭제</button>';
			}
			if ( isNotDatatable && pgmInfo.update_yesno == "Y" ) {
				mainBtnHtml += '<button type="submit" class="btn btn-warning z-main-btn z-main-btn-save mr-2">저장</button>';
			}
			if ( isNotDatatable && pgmInfo.print_yesno == "Y" ) {
				mainBtnHtml += '<button type="submit" class="btn btn-info z-main-btn z-main-btn-print mr-2">인쇄</button>';
			}
			if ( isNotDatatable && pgmInfo.excel_yesno == "Y" ) {
				mainBtnHtml += '<button type="submit" class="btn btn-info z-main-btn z-main-btn-excel mr-2">엑셀</button>';
			}
			if ( isNotDatatable && pgmInfo.close_yesno == "Y" ) {
				mainBtnHtml += '<button type="submit" class="btn btn-outline-danger z-main-btn z-main-btn-close mr-2">닫기</button>';
			}
			
			$("#kt_content_web_header_main_buttons").html(mainBtnHtml);
			z.setMainSearchEvent();
			z.setMainBtnEvent();
		}
	}
	
	$("#z-menu-text").off("click").on("click", function (e) {
		if ( e.altKey && e.ctrlKey && e.shiftKey && pgmInfo.user_tag === "10" ) {
			alert(pgmInfo.pgm_code);
		}
	});
	
	
	/**************************************************
	 * content
	 */
	if ( pgmUrl == "iframe" ) {
		$("#kt_content_web_content").html('<iframe id="kt_content_web_content_iframe" src="/admin/com/menuLinkIframe.do?z.sysId=' + encodeURIComponent(sysId) + '&z.pgmCode=' + encodeURIComponent(pgmCode) + '" />');
	}
	else if ( pgmUrl == "jsp" ) {
		var params = {};
		
		params["z.sysId"]   = sysId;
		params["z.pgmCode"] = pgmCode;
		
		var jsonInfo = JSON.stringify(params);
		
		$.ajax({
			type       : 'post',
			url        : "/admin/com/menuLinkJsp.do",
		    dataType   : "text",
		    data       : z.encodeParam(jsonInfo),
		    timeout    : 10000,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			async      : false,
			cache      : false,
		    beforeSend : function(xhr){
		    	KTApp.block(".top-body", {
		    		overlayColor: "#000000",
		    		type        : "v2",
		    		state       : "success",
		    		message     : "프로그램 로드..."
		    	});
			},
			complete: function(){
				KTApp.unblockPage();
			},
			success: function(resp) {
				if ( resp.result == "LoginOut" ) {
					alert("세션이 종료되어 로그인 화면으로 이동합니다.");
		    		zoMainOpenReLogin();
				}
				else if ( resp.result == "ERROR" ) {
		    		alert(resp.message);
				}
				else {
					$('#kt_content_web_content').html(resp);
					
					$("head").append('<link id="kt_content_web_content_css" href="/resources/admin/APPS/' + sysId.toLowerCase() + '/css/metronic_v7.0.5/' + pgmInfo.pgm_code + '.css" rel="stylesheet" type="text/css" />');
					$("head").append('<script id="kt_content_web_content_options_script" src="/resources/admin/APPS/' + sysId.toLowerCase() + '/options.js/metronic_v7.0.5/' + pgmInfo.pgm_code + '.options.js" type="text/javascript"></script>');
					$("head").append('<script id="kt_content_web_content_script" src="/resources/admin/APPS/' + sysId.toLowerCase() + '/js/metronic_v7.0.5/' + pgmInfo.pgm_code + '.js" type="text/javascript"></script>');
					
					if ( typeof zoInit !== "undefined" ) {
						zoInit();
					}
				}
			},
			error: function(resp) {
				//_X.MBox("프로그램 로드 중 오류가 발생 하였습니다.");
			}
		});
	}
	else if ( pgmUrl == "jspIframe" ) {
		var params = {};
		
		params["z.sysId"]   = sysId;
		params["z.pgmCode"] = pgmCode;
		
		var jsonInfo = JSON.stringify(params);
		
		$.ajax({
			type       : 'post',
			url        : "/admin/com/menuLinkJspIframe.do",
		    dataType   : "text",
		    data       : z.encodeParam(jsonInfo),
		    timeout    : 10000,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			async      : false,
			cache      : false,
		    beforeSend : function(xhr){
		    	KTApp.block(".top-body", {
		    		overlayColor: "#000000",
		    		type        : "v2",
		    		state       : "success",
		    		message     : "프로그램 로드..."
		    	});
			},
			complete: function(){
				KTApp.unblockPage();
			},
			success: function(resp) {
				if ( resp.result == "OK" ) {
					$('#kt_content_web_content').html(resp.content);

					$("head").append('<link id="kt_content_web_content_css" href="/resources/admin/APPS/' + sysId.toLowerCase() + '/css/metronic_v7.0.5/' + pgmInfo.pgm_code + '.css" rel="stylesheet" type="text/css" />');
					$("head").append('<script id="kt_content_web_content_options_script" src="/resources/admin/APPS/' + sysId.toLowerCase() + '/options.js/metronic_v7.0.5/' + pgmInfo.pgm_code + '.options.js" type="text/javascript"></script>');
					$("head").append('<script id="kt_content_web_content_script" src="/resources/admin/APPS/' + sysId.toLowerCase() + '/js/metronic_v7.0.5/' + pgmInfo.pgm_code + '.js" type="text/javascript"></script>');
					
					if ( typeof zoInit !== "undefined" ) {
						zoInit();
					}
				}
				else if ( resp.result == "LoginOut" ) {
		    		alert("세션이 종료되어 로그인 화면으로 이동합니다.");
		    		zoMainOpenReLogin();
		    	
				}
				else {
					alert(resp.message);
					//_X.MBox(resp.errmsg);
				}
			},
			error: function(resp) {
				//_X.MBox("프로그램 로드 중 오류가 발생 하였습니다.");
			}
		});
	}
	else if ( pgmUrl == "file" ) {
		var params = {};
		
		params["z.sysId"]   = sysId;
		params["z.pgmCode"] = pgmCode;
		
		var jsonInfo = JSON.stringify(params);
		
		$.ajax({
			type       : 'post',
			url        : "/admin/com/menuLinkFile.do",
		    dataType   : "text",
		    data       : z.encodeParam(jsonInfo),
		    timeout    : 10000,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			async      : false,
			cache      : false,
		    beforeSend : function(xhr){
		    	KTApp.block(".top-body", {
		    		overlayColor: "#000000",
		    		type        : "v2",
		    		state       : "success",
		    		message     : "프로그램 로드..."
		    	});
			},
			complete: function(){
				KTApp.unblockPage();
			},
			success: function(resp) {
				if ( resp.result == "OK" ) {
					$('#kt_content_web_content').html(resp.content);

					$("head").append('<link id="kt_content_web_content_css" href="/resources/admin/APPS/' + sysId.toLowerCase() + '/css/metronic_v7.0.5/' + pgmInfo.pgm_code + '.css" rel="stylesheet" type="text/css" />');
					$("head").append('<script id="kt_content_web_content_options_script" src="/resources/admin/APPS/' + sysId.toLowerCase() + '/options.js/metronic_v7.0.5/' + pgmInfo.pgm_code + '.options.js" type="text/javascript"></script>');
					$("head").append('<script id="kt_content_web_content_script" src="/resources/admin/APPS/' + sysId.toLowerCase() + '/js/metronic_v7.0.5/' + pgmInfo.pgm_code + '.js" type="text/javascript"></script>');
					
					if ( typeof zoInit !== "undefined" ) {
						zoInit();
					}
				}
				else {
					//_X.MBox(resp.errmsg);
				}
			},
			error: function(resp) {
				//_X.MBox("프로그램 로드 중 오류가 발생 하였습니다.");
			}
		});
	}
}

/* header *****************************************************************************************************************************/
z.setSearchSelectBox = function (label, id, all, event, sqlFileOrFunction, sqlId, params, parentNames, colspan) {
	if ( ! z.__SearchSelectBox ) {
		z.__SearchSelectBox = {};
	}
	if ( ! z.__SearchSelectBox[id] ) {
		z.__SearchSelectBox[id] = {
			"label"      : label,
			"all"        : all,
			"event"      : event,
			"sqlFile"    : sqlFileOrFunction,
			"sqlId"      : sqlId,
			"params"     : params,
			"childNames" : [],
			"parentNames": parentNames || [],
			"cacheDatas" : {},
			"datas"      : []
		};
	}
	else {
		z.__SearchSelectBox[id]["label"]       = label;
		z.__SearchSelectBox[id]["all"]         = all;
		z.__SearchSelectBox[id]["event"]       = event;
		z.__SearchSelectBox[id]["sqlFile"]     = sqlFileOrFunction;
		z.__SearchSelectBox[id]["sqlId"]       = sqlId;
		z.__SearchSelectBox[id]["params"]      = params;
		z.__SearchSelectBox[id]["parentNames"] = parentNames || z.__SearchSelectBox[id]["parentNames"];
	}

	if ( parentNames ) {
		for ( var i = 0, ii = parentNames.length; i < ii; i++ ) {
			z.setSearchSelectBoxChild(parentNames[i], [id]);
		}
	}
	
	if ( typeof sqlFileOrFunction === "string" ) {
		var params2 = {};
		
		for ( var i = 0, ii = z.__SearchSelectBox[id]["parentNames"].length; i < ii; i++ ) {
			params2[ z.__SearchSelectBox[id]["parentNames"][i] ] = $("#kt_content_web_header_main_search #" + z.__SearchSelectBox[id]["parentNames"][i]).val();
		}
		
		var cacheKey = sqlFileOrFunction + sqlId + z.getConcatParamValue(params, params2);
		
		if ( ! z.__SearchSelectBox[id]["cacheDatas"][cacheKey] ) {
			z.xA(sqlFileOrFunction, sqlId, "select", z.getParams(params, params2), "json2", function (result, datas) {
				if ( result == "OK" ) {
					z.__SearchSelectBox[id]["cacheDatas"][cacheKey] = datas;
					z.__SearchSelectBox[id]["datas"]                = datas;
					z.searchSelectBoxRender(label, id, all, event, colspan);
				}
			});
		}
		else {
			z.__SearchSelectBox[id]["datas"] = z.__SearchSelectBox[id]["cacheDatas"][cacheKey];
			z.searchSelectBoxRender(label, id, all, event, colspan);
		}
	}
	else if ( typeof sqlFileOrFunction === "function" ) {
		z.__SearchSelectBox[id]["datas"] = sqlFileOrFunction();
		z.searchSelectBoxRender(label, id, all, event, colspan);
	}
}

z.setSearchSelectBoxChild = function (id, children) {
	if ( z.__SearchSelectBox && z.__SearchSelectBox[id] ) {
		for ( var i = 0, ii = children.length; i < ii; i++ ) {
			if ( z.__SearchSelectBox[id]["childNames"].indexOf(children[i]) == -1 ) {
				z.__SearchSelectBox[id]["childNames"].push(children[i]);
			}
		}
	}
}

z.searchSelectBoxRender = function (label, id, all, event, colspan) {
	var $selectBox = $("#kt_content_web_header_main_search").find("#" + id);
	
	if ( $selectBox.length ) {
		var html = all ? '		<option value="">전체</option>' : '';
		
		for ( var i = 0, ii = z.__SearchSelectBox[id]["datas"].length; i < ii; i++ ) {
			html += '		<option value="' + z.__SearchSelectBox[id]["datas"][i].code + '">' + z.__SearchSelectBox[id]["datas"][i].label + '</option>';
		}
		
		$selectBox.html(html);
	}
	else {
		var html = '<div class="col-' + (colspan || "2") + ' pl-0">';
		
		html += '	<label class="z-search-label">' + label + '</label>';
		html += '	<select class="z-search-form-control" id="' + id + '">';
		html += all ? '		<option value="">전체</option>' : '';
	
		for ( var i = 0, ii = z.__SearchSelectBox[id]["datas"].length; i < ii; i++ ) {
			html += '		<option value="' + z.__SearchSelectBox[id]["datas"][i].code + '">' + z.__SearchSelectBox[id]["datas"][i].label + '</option>';
		}
		
		html += '	</select>';
		html += '</div>';
		
		$("#kt_content_web_header_main_search").append(html);
		
		if ( ! (event === false) ) {
			z.setSearchChangeEvent($("#" + id));
		}
	}
}

z.setSearchInputText = z.setSearchInput = function (label, id, event, colspan) {
	if ( ! z.__SearchInput ) {
		z.__SearchInput = [];
	}
	
	z.__SearchInput.push(id);
	
	z.setSearchInputRender(label, id, event, colspan);
}

z.setSearchInputRender = function (label, id, event, colspan) {
	var html = '<div class="col-' + (colspan || "2") + ' pl-0">';
	
	html += '	<label class="z-search-label">' + label + '</label>';
	html += '	<input class="z-search-form-control" id="' + id + '">';
	html += '</div>';
	
	$("#kt_content_web_header_main_search").append(html);
	
	if ( ! (event === false) ) {
		z.setSearchKeyDownEvent($("#" + id));
	}	
}

z.setMenuSelectBox = function (label, id, all, event, sqlFileOrFunction, sqlId, params, parentNames, colspan) {
	if ( ! z.__MenuSelectBox ) {
		z.__MenuSelectBox = {};
	}
	
	if ( ! z.__MenuSelectBox[id] ) {
		z.__MenuElementCount++;
		z.__MenuSelectBox[id] = {
			"label"      : label,
			"all"        : all,
			"event"      : event,
			"sqlFile"    : sqlFileOrFunction,
			"sqlId"      : sqlId,
			"params"     : params,
			"childNames" : [],
			"parentNames": parentNames || [],
			"cacheDatas" : {},
			"datas"      : []
		};
	}
	else {
		z.__MenuSelectBox[id]["label"]       = label;
		z.__MenuSelectBox[id]["all"]         = all;
		z.__MenuSelectBox[id]["event"]       = event;
		z.__MenuSelectBox[id]["sqlFile"]     = sqlFileOrFunction;
		z.__MenuSelectBox[id]["sqlId"]       = sqlId;
		z.__MenuSelectBox[id]["params"]      = params;
		z.__MenuSelectBox[id]["parentNames"] = parentNames || z.__MenuSelectBox[id]["parentNames"];
	}

	if ( parentNames ) {
		for ( var i = 0, ii = parentNames.length; i < ii; i++ ) {
			z.setMenuSelectBoxChild(parentNames[i], [id]);
		}
	}
	
	if ( typeof sqlFileOrFunction === "string" ) {
		var params2 = {};
		
		for ( var i = 0, ii = z.__MenuSelectBox[id]["parentNames"].length; i < ii; i++ ) {
			params2[ z.__MenuSelectBox[id]["parentNames"][i] ] = $("#kt_content_web_header_main_buttons #" + z.__MenuSelectBox[id]["parentNames"][i]).val();
		}
		
		var cacheKey = sqlFileOrFunction + sqlId + z.getConcatParamValue(params, params2);
		
		if ( ! z.__MenuSelectBox[id]["cacheDatas"][cacheKey] ) {
			z.xA(sqlFileOrFunction, sqlId, "select", z.getParams(params, params2), "json2", function (result, datas) {
				if ( result == "OK" ) {
					z.__MenuSelectBox[id]["cacheDatas"][cacheKey] = datas;
					z.__MenuSelectBox[id]["datas"]                = datas;
					z.menuSelectBoxRender(label, id, all, event, colspan);
				}
			});
		}
		else {
			z.__MenuSelectBox[id]["datas"] = z.__MenuSelectBox[id]["cacheDatas"][cacheKey];
			z.menuSelectBoxRender(label, id, all, event, colspan);
		}
	}
	else if ( typeof sqlFileOrFunction === "function" ) {
		z.__MenuSelectBox[id]["datas"] = sqlFileOrFunction();
		z.menuSelectBoxRender(label, id, all, event, colspan);
	}
}

z.setMenuSelectBoxChild = function (id, children) {
	if ( z.__MenuSelectBox && z.__MenuSelectBox[id] ) {
		for ( var i = 0, ii = children.length; i < ii; i++ ) {
			if ( z.__MenuSelectBox[id]["childNames"].indexOf(children[i]) == -1 ) {
				z.__MenuSelectBox[id]["childNames"].push(children[i]);
			}
		}
	}
}

z.menuSelectBoxRender = function (label, id, all, event, colspan) {
	var $selectBox = $("#kt_content_web_header_main_buttons").find("#" + id);
	
	if ( $selectBox.length ) {
		var html = '		<option value="">- 선택 -</option>';
		
		for ( var i = 0, ii = z.__MenuSelectBox[id]["datas"].length; i < ii; i++ ) {
			html += '		<option value="' + z.__MenuSelectBox[id]["datas"][i].code + '">' + z.__MenuSelectBox[id]["datas"][i].label + '</option>';
		}
		
		$selectBox.html(html);
	}
	else {
		var html = '<div class="col-' + (colspan || "2") + ' pl-0">';
		
		html += '	<label class="z-search-label">' + label + '</label>';
		html += '	<select class="z-search-form-control" id="' + id + '">';
		html += '		<option value="">- 선택 -</option>';
	
		for ( var i = 0, ii = z.__MenuSelectBox[id]["datas"].length; i < ii; i++ ) {
			html += '		<option value="' + z.__MenuSelectBox[id]["datas"][i].code + '">' + z.__MenuSelectBox[id]["datas"][i].label + '</option>';
		}
		
		html += '	</select>';
		html += '</div>';

		$("#kt_content_web_header_main_buttons").children().eq(z.__MenuElementCount - 1).before(html);
		
		if ( ! (event === false) ) {
			z.setMenuChangeEvent($("#" + id));
		}
	}
}

z.setMenuButton = function (text, handler) {
	if ( ! z.__MenuButtonHandler ) {
		z.__MenuButtonHandler = {};
	}
	
	if ( ! z.__MenuButtonHandler[text] ) {
		z.__MenuElementCount++;
	}
	
	z.__MenuButtonHandler[text] = handler;
	
	var html = '<button type="submit" class="btn btn-outline-secondary z-menu-btn" onclick="z.menuButtonClick(\'' + text + '\');">' + text + '</button>';
	
	$("#kt_content_web_header_main_buttons").children().eq(z.__MenuElementCount - 1).before(html);
}

z.menuButtonClick = function (text) {
	if ( z.__MenuButtonHandler[text] ) {
		z.__MenuButtonHandler[text]();
	}
}

z.setMenuDropDown = function (text, handler) {
	if ( ! z.__MenuDropdown ) {
		z.__MenuDropdown = {};
	}
	
	if ( ! Object.keys(z.__MenuDropdown).length ) {
		z.__MenuElementCount++;
	}
	
	z.__MenuDropdown[text] = handler;
	
	var html = '';
	
	var $zMenuDropdownList = $("#zMenuDropdownList");
	if ( $zMenuDropdownList.length ) {
		for ( var prop in z.__MenuDropdown ) {
			if ( z.__MenuDropdown.hasOwnProperty(prop) ) {
				html += '			<li class="navi-item">';
				html += '				<a href="javascrpt: void(0);" class="navi-link" onclick="z.menuDropdownClick(\'' + prop + '\');">';
				html += '					<span class="navi-text">New Group</span>';
				html += '				</a>';
				html += '			</li>';
			}
		}
		
		$zMenuDropdownList.html(html);
	}
	else {
		html += '<div class="dropdown dropdown-inline mr-2" id="zMenuDropdownList" data-toggle="tooltip" data-placement="left">';
		html += '	<a href="javascript:;" class="btn btn-clean btn-hover-light-primary btn-sm btn-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
		html += '		<i class="ki ki-bold-more-ver"></i>';
		html += '	</a>';
		html += '	<div class="dropdown-menu dropdown-menu-md dropdown-menu-right">';
		html += '		<ul class="navi navi-hover py-5">';
		
		for ( var prop in z.__MenuDropdown ) {
			if ( z.__MenuDropdown.hasOwnProperty(prop) ) {
				html += '			<li class="navi-item">';
				html += '				<a href="javascrpt: void(0);" class="navi-link" onclick="z.menuDropdownClick(\'' + prop + '\');">';
				html += '					<span class="navi-text">New Group</span>';
				html += '				</a>';
				html += '			</li>';
			}
		}
		
		html += '		</ul>';
		html += '	</div>';
		html += '</div>';
		
		$("#main_search_key_word").before(html);
	}
}

z.menuDropdownClick = function (text) {
	if ( z.__MenuDropdown[text] ) {
		z.__MenuDropdown[text]();
	}
}

z.setRetrieveInput = function (display) {
	if ( display ) {
		$("#main_search_key_word").show();
	} else {
		$("#main_search_key_word").hide();
	}
}

/* content *****************************************************************************************************************************/
z.getSelector = function (names) {
	var selector = "";
	
	for ( var i = 0, ii = names.length; i < ii; i++ ) {
		selector += "[name=" + names[i] + "],";
	}
	
	if ( selector.length ) {
		selector = selector.substring(0, selector.length - 1);
	}
	
	return selector;
}

z.setNotNullVal = z.setNotNull = function (template, names) {
	if ( ! z.__NotNull ) {
		z.__NotNull = {};
	}
	if ( ! z.__NotNull["selector"] ) {
		z.__NotNull["selector"] = {};
	}
	
	z.__NotNull[template]             = names;
	z.__NotNull["selector"][template] = z.getSelector(names);
}

z.setDupliCheck = z.setDupCheck = function (template, names) {
	if ( ! z.__DupCheck ) {
		z.__DupCheck = {};
	}
	if ( ! z.__DupCheck["selector"] ) {
		z.__DupCheck["selector"] = {};
	}
	
	z.__DupCheck[template]             = names;
	z.__DupCheck["selector"][template] = z.getSelector(names);
}

z.setInsertOnly = function (template, names) {
	if ( ! z.__InsertOnly ) {
		z.__InsertOnly = {};
	}
	if ( ! z.__InsertOnly["selector"] ) {
		z.__InsertOnly["selector"] = {};
	}
	
	z.__InsertOnly[template]             = names;
	z.__InsertOnly["selector"][template] = z.getSelector(names);
}

z.setDefaultVal = z.setDefaultValue = function (template, defaultValue) {
	if ( ! z.__DefaultValue ) {
		z.__DefaultValue = {};
	}
	
	z.__DefaultValue[template] = defaultValue;
}

z.setSelectBox = function (template, name, sqlFileOrFunction, sqlId, params, parentNames, selectFirstOption, $portletEle) {
	if ( ! z.__SelectBox ) {
		z.__SelectBox = {};
	}
	if ( ! z.__SelectBox[template] ) {
		z.__SelectBox[template] = {};
	}
	if ( ! z.__SelectBox[template][name] ) {
		z.__SelectBox[template][name] = {
			"sqlFile"          : sqlFileOrFunction,
			"sqlId"            : sqlId,
			"params"           : params,
			"childNames"       : [],
			"parentNames"      : parentNames || [],
			"selectFirstOption": selectFirstOption,	// 개발 보류중 (첫옵션 자동선택)
			"cacheDatas"       : {},
			"datas"            : [],
			"label"            : {}
		};
	}
	else {
		z.__SelectBox[template][name]["sqlFile"]     = sqlFileOrFunction;
		z.__SelectBox[template][name]["sqlId"]       = sqlId;
		z.__SelectBox[template][name]["params"]      = params;
		z.__SelectBox[template][name]["parentNames"] = parentNames || z.__SelectBox[template][name]["parentNames"];
	}

	if ( parentNames ) {
		for ( var i = 0, ii = parentNames.length; i < ii; i++ ) {
			z.setSelectBoxChild(template, parentNames[i], [name]);
		}
	}
	
	if ( typeof sqlFileOrFunction === "string" ) {
		var params2 = {};
		
		if ( $portletEle ) {
			for ( var i = 0, ii = z.__SelectBox[template][name]["parentNames"].length; i < ii; i++ ) {
				params2[ z.__SelectBox[template][name]["parentNames"][i] ] = $portletEle.find("[name=" + z.__SelectBox[template][name]["parentNames"][i] + "]").val();
			}
		}
		
		var cacheKey = sqlFileOrFunction + sqlId + z.getConcatParamValue(params, params2);
		
		if ( ! z.__SelectBox[template][name]["cacheDatas"][cacheKey] ) {
			z.xA(sqlFileOrFunction, sqlId, "select", z.getParams(params, params2), "json2", function (result, datas) {
				if ( result == "OK" ) {
					z.__SelectBox[template][name]["cacheDatas"][cacheKey] = datas;
					z.__SelectBox[template][name]["datas"]                = datas;
					
					for ( var i = 0, ii = datas.length; i < ii; i++ ) {
						z.__SelectBox[template][name]["label"][ datas[i].code ] = datas[i].label;
					}
				}
			});
		}
		else {
			z.__SelectBox[template][name]["datas"] = z.__SelectBox[template][name]["cacheDatas"][cacheKey];
		}
	}
	else if ( typeof sqlFileOrFunction === "function" ) {
		var datas = sqlFileOrFunction();
		
		z.__SelectBox[template][name]["datas"] = datas;
		
		for ( var i = 0, ii = datas.length; i < ii; i++ ) {
			z.__SelectBox[template][name]["label"][ datas[i].code ] = datas[i].label;
		}
	}
}

z.setSelectBoxChild = function (template, name, children) {
	if ( z.__SelectBox[template] && z.__SelectBox[template][name] ) {
		for ( var i = 0, ii = children.length; i < ii; i++ ) {
			if ( z.__SelectBox[template][name]["childNames"].indexOf(children[i]) == -1 ) {
				z.__SelectBox[template][name]["childNames"].push(children[i]);
			}
		}
	}
}

z.selectBoxRender = function (template, parentEle, name) {
	if ( name ) {
		if ( z.__SelectBox && z.__SelectBox[template] && z.__SelectBox[template][name] ) {
			var html = '<option value="">- 선택 -</option>';
			
			for ( var i = 0, ii = z.__SelectBox[template][name]["datas"].length; i < ii; i++ ) {
				html += '<option value="' + z.__SelectBox[template][name]["datas"][i].code + '">' + z.__SelectBox[template][name]["datas"][i].label + '</option>';
			}
			
			$(parentEle).find("select[name=" + name + "]").html(html);
		}
	}
	else {
		if ( z.__SelectBox && z.__SelectBox[template] ) {
			for ( var name in z.__SelectBox[template] ) {
				if ( z.__SelectBox[template].hasOwnProperty(name) ) {
					var html = '<option value="">- 선택 -</option>';

					for ( var i = 0, ii = z.__SelectBox[template][name]["datas"].length; i < ii; i++ ) {
						html += '<option value="' + z.__SelectBox[template][name]["datas"][i].code + '">' + z.__SelectBox[template][name]["datas"][i].label + '</option>';
					}
					
					$(parentEle).find("select[name=" + name + "]").html(html);
				}
			}
		}
	}
}

z.init = function (options) {
	z.__Options = options;
	
	ziInit();
}

z.setSqlInfo = function (template, sqlFile, sqlId, params, mainSql, contentId) {
	if ( ! z.__SqlInfo ) {
		z.__SqlInfo = {};
	}
	
	if ( mainSql ) {
		z.__SqlInfo["mainTemplate"] = template;
	}
	
	z.__SqlInfo[template] = {
		"sqlFile"  : sqlFile,
		"sqlId"    : sqlId,
		"params"   : params,
		"contentId": contentId || "kt_content_web_content"
	};
}

z.selectSql = function (template) {
	if ( z.__SqlInfo[template] ) {
		var params1 = z.getParams(z.__SqlInfo[template]["params"]);
		var params2 = {"main_search_key_word": $("#main_search_key_word")[0]};
		
		z.xA(z.__SqlInfo[template]["sqlFile"], z.__SqlInfo[template]["sqlId"], "select", z.getParams(params1, params2), "json2", function (result, datas) {
			if ( result == "OK" ) {
				z.selectSqlAction(template, datas);
			} else {
				z.msg("조회중 오류가 발생 하였습니다.");
			}
		});
	}
}

z.selectSqlAction = function (template, datas) {
	$contentBox = $("#" + z.__SqlInfo[template]["contentId"]);
	$contentBox.find("." + template + ".z-kt-portlet").remove();
	
	var jsonList = {
		"datas": JSON.parse(JSON.stringify(datas))
	};
	
	var $templateHtml = $("#" + template);
	
	if ( ! $templateHtml.length ) {
		$templateHtml = ziGetTemplateScript(template);
		
		if ( ! $templateHtml ) {
			return;
		}
	}
	
	if ( $templateHtml.length ) {
		var templateHtml = $templateHtml.html();
		
		templateHtml = z.getInsertOnlyInput(template, templateHtml);
		templateHtml = z.getNotNullLabelColor(template, templateHtml);
		templateHtml = z.getSelectBoxRender(template, templateHtml);
		
		var handleBartemplate = Handlebars.compile(templateHtml);
		
		$contentBox.append(handleBartemplate(jsonList));
	}
	else {
		z.selectBoxRender(template, $contentBox[0]);
		z.setNotNullLabelColor(template, $contentBox[0]);
		z.setInsertOnlyInput(template, $contentBox[0]);
	}
	
	$contentBox.find("input[type=checkbox]").each(function () {
		$(this).prop("checked", $(this).data("checked") == "Y");
	});
	
	z.setFormEvent($contentBox[0]);
	
	$contentBox.find("select").each(function () {
		$(this).val($(this).data("selected"));
		
		z.setChildSelectBox(template, this);
	});
	
	$(window).scrollTop(0);
	
	zoSelectSqlAfter(template, datas);
}

z.getSelectBoxRender = function (template, templateHtml) {
	for ( var name in z.__SelectBox[template] ) {
		if ( z.__SelectBox[template].hasOwnProperty(name) ) {
			var html = '<option value="">- 선택 -</option>';

			for ( var i = 0, ii = z.__SelectBox[template][name]["datas"].length; i < ii; i++ ) {
				html += '<option value="' + z.__SelectBox[template][name]["datas"][i].code + '">' + z.__SelectBox[template][name]["datas"][i].label + '</option>';
			}
			
			var leftIdx  = templateHtml.indexOf('name="' + name + '"');
			var rightStr = templateHtml.substring(leftIdx);
			var rightIdx = rightStr.indexOf("</select>");
			
			var leftTemplateHtml   = templateHtml.substring(0, leftIdx + rightIdx);
			var centerTemplateHtml = html + "</select>";
			var rightTemplateHtml  = templateHtml.substring(leftIdx + rightIdx + 9);

			templateHtml = leftTemplateHtml + centerTemplateHtml + rightTemplateHtml;
		}
	}
	
	return templateHtml;
}

z.getNotNullLabelColor = function (template, templateHtml) {
	if ( z.__NotNull[template] ) {
		for ( var i = 0, ii = z.__NotNull[template].length; i < ii; i++ ) {
			var lastIdx   = templateHtml.indexOf('name="label_' + z.__NotNull[template][i] + '"');
			
			if ( lastIdx == -1 ) {
				continue;
			}
			
			var leftStr   = templateHtml.substring(0, lastIdx);
			var firstIdx  = leftStr.lastIndexOf('class="');
			var middleStr = leftStr.substring(firstIdx);
			var classStr  = middleStr.split('"')[1];
			
			var leftTemplateHtml   = templateHtml.substring(0, firstIdx);
			var centerTemplateHtml = 'class="' + classStr + ' text-warning"';
			var rightTemplateHtml  = templateHtml.substring(firstIdx + 8 + classStr.length);
			
			templateHtml = leftTemplateHtml + centerTemplateHtml + rightTemplateHtml;
		}
	}
	
	return templateHtml;
}

z.setNotNullLabelColor = function (template, ele) {
	if ( z.__NotNull["selector"] && z.__NotNull["selector"][template] ) {
		$(ele).find(z.__NotNull["selector"][template]).each(function () {
			var $label = $(this).closest(".z-col").find("label");
			
			if ( $label.hasClass("z-label") ) {
				$label.addClass("text-warning");
			}
		});
	}
}

z.getInsertOnlyInput = function (template, templateHtml) {
	if ( z.__InsertOnly[template] ) {
		for ( var i = 0, ii = z.__InsertOnly[template].length; i < ii; i++ ) {
			templateHtml = templateHtml.replace('name="' + z.__InsertOnly[template][i] + '"', 'name="' + z.__InsertOnly[template][i] + '" disabled="disabled"');
		}
	}
	
	return templateHtml;
}

z.setInsertOnlyInput = function (template, ele) {
	if ( z.__InsertOnly["selector"] && z.__InsertOnly["selector"][template] ) {
		$(ele).find(z.__InsertOnly["selector"][template]).prop("disabled", true);
	}
}

z.getParams = function (params, params2) {
	var returnParams = {};
	
	for ( var prop in params ) {
		if ( params.hasOwnProperty(prop) ) {
			if ( typeof params[prop] === "object" ) {
				returnParams[prop] = z.getTypeValue(params[prop]);
			}
			else if ( typeof params[prop] === "string" ) {
				if ( params[prop].indexOf("#") == 0 ) {
					returnParams[prop] = z.getTypeValue( $(params[prop])[0] );
				} else {
					returnParams[prop] = params[prop];
				}
			}
		}
	}
	
	if ( params2 ) {
		for ( var prop in params2 ) {
			if ( params2.hasOwnProperty(prop) ) {
				if ( typeof params2[prop] === "object" ) {
					returnParams[prop] = z.getTypeValue(params2[prop]);
				}
				else if ( typeof params2[prop] === "string" ) {
					if ( params2[prop].indexOf("#") == 0 ) {
						returnParams[prop] = z.getTypeValue( $(params2[prop])[0] );
					} else {
						returnParams[prop] = params2[prop];
					}
				}
			}
		}
	}
	
	return returnParams;
}

z.getConcatParamValue = function (params, params2) {
	var returnParamValue = "";
	
	for ( var prop in params ) {
		if ( params.hasOwnProperty(prop) ) {
			if ( typeof params[prop] === "object" ) {
				returnParamValue += z.getTypeValue(params[prop]);
			}
			else if ( typeof params[prop] === "string" ) {
				returnParamValue += params[prop];
			}
		}
	}
	
	if ( params2 ) {
		for ( var prop in params2 ) {
			if ( params2.hasOwnProperty(prop) ) {
				if ( typeof params2[prop] === "object" ) {
					returnParamValue += z.getTypeValue(params2[prop]);
				}
				else if ( typeof params2[prop] === "string" ) {
					returnParamValue += params2[prop];
				}
			}
		}
	}
	
	return returnParamValue;
}

z.getTypeValue = function (ele) {
	switch ( ele.type ) {
		case "hidden":	// 
			return ele.value || "";
			break;
			
		case "text":	//
			return ele.value || "";
			break;
			
		case "search":	// 
			return ele.value || "";
			break;
			
		case "email":	// 
			return ele.value || "";
			break;
				
		case "password":	// 
			return ele.value || "";
			break;
			
		case "number":	// 
			return ele.value || "0";
			break;
			
		case "datetime-local":	// 
			return ele.value || "";
			break;
			
		case "date":	// 
			return ele.value || "";
			break;
			
		case "month":	// 
			return ele.value || "";
			break;
			
		case "time":	// 
			return ele.value || "";
			break;
			
		case "file":	// 
//			return ele.value || "";
			break;
			
		case "color":	// 
			return ele.value || "";
			break;
			
		case "select-one":	// 
			return ele.value || "";
			break;
			
		case "textarea":	// 
			return ele.value || "";
			break;
			
		case "checkbox":	// 
			return ele.checked ? "Y" : "N";
			break;
			
		case "radio":	//
			return $(":input:radio[name=" + ele.name + "]:checked").val() || "";
			break;
	}
}

z.setTypeValue = function ($ele, value) {
	var ele = $ele[0];

	switch ( ele.type ) {
		case "hidden":	//  
			ele.value = value;
			break;
			
		case "text":	// 
			ele.value = value;
			break;
			
		case "search":	//  
			ele.value = value;
			break;
			
		case "email":	//  
			ele.value = value;
			break;
				
		case "password":	//  
			ele.value = value;
			break;
			
		case "number":	// 
			if ( ! isNaN(value) ) {
				ele.value = value;
			}
			break;
			
		case "datetime-local":	//  
			ele.value = value;
			break;
			
		case "date":	//  
			ele.value = value;
			break;
			
		case "month":	//  
			ele.value = value;
			break;
			
		case "time":	//  
			ele.value = value;
			break;
			
		case "file":	//  
//			ele.value = value;
			break;
			
		case "color":	//  
			ele.value = value;
			break;
			
		case "select-one":	//  
			ele.value = value;
			break;
			
		case "textarea":	// 
			ele.value = value;
			break;
			
		case "checkbox":	// 
			if ( value === true ) {
				$(ele).prop("checked", true); 
			}
			else if ( value === false ) {
				$(ele).prop("checked", false);
			}
			else if ( value === "Y" ) {
				$(ele).prop("checked", true);
			}
			else if ( value === "N" ) {
				$(ele).prop("checked", false);
			}
			break;
			
		case "radio":	//
			for ( var i = 0, ii = $ele.length; i < ii; i++ ) {
				if ( $ele.eq(i).val() == value ) {
					$ele.eq(i).prop("checked", true);
					return;
				}
			}
			break;
	}
	
	$ele.trigger("change");
}

z.getPortlet = function (ele) {
	var $portlet;
	
	if ( typeof ele === "string" ) {
		$portlet = $("#" + ele).closest('.z-kt-portlet');
	} else {
		$portlet = $(ele).closest('.z-kt-portlet');
	}
	
	if ( $portlet.length ) {
		return $portlet[0];
	} else {
		return null;
	}
}

z.getPortletCnt = function (template) {
	return $("." + template).length;
}

z.getValue = function (ele, name) {
	if ( ele == null ) {
		return "";
	}
	
	var $ele;
	
	if ( typeof ele === "string" ) {
		$ele = $("#" + ele).find('[name="' + name + '"]');
	} else {
		$ele = $(ele).find('[name="' + name + '"]');
	}
	
	if ( $ele.length ) {
		return z.getTypeValue($ele[0]);
	} else {
		return "";
	}
}

z.setValue = function (ele, name, value) {
	if ( ele == null ) {
		return;
	}
	
	var $ele;
	
	if ( typeof ele === "string" ) {
		$ele = $("#" + ele).find('[name="' + name + '"]');
	} else {
		$ele = $(ele).find('[name="' + name + '"]');
	}
	
	if ( $ele.length ) {
		z.setTypeValue($ele, value);
	}
}

z.save = function (template, selectSqlOrCallbackFunc, msg) {
	z.xAU("z-kt-portlet", template, selectSqlOrCallbackFunc, null, null, msg);
}

/* modal *****************************************************************************************************************************/
z.setModal = function (modalId, column) {
	
}

z.showModal = function (modalId, showBtns, datas, template) {
	var $modal = $("#" + modalId);
	
	if ( ! $modal.length ) {
		$modal = ziGetModal(modalId);
		
		if ( ! $modal ) {
			return;
		}
	}
	
	z.setModalSticky($modal, true);
	
	if ( showBtns ) {
		$modal.find(".z-modal-footer .btn").not(".z-modal-btn-close").hide();
		
		if ( typeof showBtns === "string" ) {
			showBtns = [showBtns];
		}
		
		var btnSelector = '';
		
		for ( var i = 0, ii = showBtns.length; i < ii; i++ ) {
			btnSelector += '.z-modal-btn-' + showBtns[i] + ',';
		}
		
		btnSelector = btnSelector.substring(0, btnSelector.length - 1);
		
		$modal.find(".z-modal-footer").find(btnSelector).show();
	}
	else {
		$modal.find(".z-modal-footer .btn").show();
	}
	
	z.__ModalBtns[modalId]     = showBtns;
	z.__ModalData[modalId]     = datas;
	z.__ModalTemplate[modalId] = template;
	
	z.selectBoxRender(modalId, $modal[0]);
	z.setNotNullLabelColor(modalId, $modal[0]);
	z.setFormEvent($modal[0]);
	z.setModalBtnEvent(modalId);
	
	$modal.off("show.bs.modal").on("show.bs.modal", zoShowModalBefore)
			.off("shown.bs.modal").on("shown.bs.modal", zoShowModalAfter)
			.off("hide.bs.modal").on("hide.bs.modal", zoHideModalBefore)
			.modal("show");
}

z.setModalSticky = function ($modal, onOff) {
	if ( onOff ) {
		$modal.off("scroll").on("scroll", function () {
			var $target = $(this);
			var targetH = $target.height() + $target.scrollTop();
			var $client = $target.find(".modal-dialog");
			var clientH = $client.height();
			var $footer = $client.find(".modal-footer");
			
			if ( (clientH + 22) < targetH ) {
				if ( $footer.hasClass("z-modal-sticky-bottom") ) {
					$footer.removeClass("z-modal-sticky-bottom");
				}
			} else {
				if ( ! $footer.hasClass("z-modal-sticky-bottom") ) {
					$footer.addClass("z-modal-sticky-bottom");
				}
			}
		});
	}
	else {
		$modal.off("scroll");
	}
}

z.saveModal = function (modalId, sqlFile, sqlId, action, callbackFunc, msg) {
	z.xAUM(modalId, sqlFile, sqlId, action, callbackFunc, msg);
}

z.hideModal = function (modalId) {
	$("#" + modalId).find(".z-modal-footer .z-modal-btn-close").click();
}

/* calendar *****************************************************************************************************************************/
z.setCalendar = function (calendarId, sqlFile, sqlId, params, options) {
	if ( ! z.__CalendarInfo ) {
		z.__CalendarInfo = {};
	}
	if ( ! calendarId && ! sqlFile && ! sqlId && ! options["title"] && ! options["startDate"] && ! options["startDateFormat"] && (options["endDate"] && ! options["endDateFormat"]) ) {
		console.log("No required options");
		return;
	}
	
	z.__CalendarInfo[calendarId] = {
		"sqlFile"        : sqlFile,
		"sqlId"          : sqlId,
		"params"         : params,
		"autoSave"       : options["autoSave"],
		"title"          : options["title"],
		"startDate"      : options["startDate"],
		"endDate"        : options["endDate"],
		"startDateFormat": options["startDateFormat"],
		"endDateFormat"  : options["endDateFormat"],
		"startTime"      : options["startTime"],
		"endTime"        : options["endTime"],
		"editable"       : options["editable"],
		"dayGridMonth"   : options["dayGridMonth"],
		"timeGridWeek"   : options["timeGridWeek"],
		"listWeek"       : options["listWeek"],
		"timeGridDay"    : options["timeGridDay"]
	};

//	z.setCalendarFormEvent(calendarId); 사용안함 삭제예정
}

z.selectCalendar = function (calendarId, maintainBaseDate) {
	if ( z.__CalendarInfo[calendarId] ) {
		var params1 = z.getParams(z.__CalendarInfo[calendarId]["params"]);
		var params2 = {"main_search_key_word": $("#main_search_key_word")[0]};
		
		var view = "dayGridMonth";
		
		if ( maintainBaseDate ) {
			view = z.getCalendar(calendarId).view.type;
			
			params1["calendarBaseDate"] = z.toString(z.getCalendar(calendarId).getDate(), 'yyyy-mm-dd');
		} else {
			params1["calendarBaseDate"] = z.toString(z.getSysDate(), 'yyyy-mm-dd');
		}
		
		z.xA(z.__CalendarInfo[calendarId]["sqlFile"], z.__CalendarInfo[calendarId]["sqlId"], "select", z.getParams(params1, params2), "json2", function (result, datas) {
			if ( result == "OK" ) {
				var headerRight = [];
				
				if ( ! (z.__CalendarInfo[calendarId]["dayGridMonth"] === false) ) {
					headerRight.push("dayGridMonth");
				}
				if ( ! (z.__CalendarInfo[calendarId]["timeGridWeek"] === false) ) {
					headerRight.push("timeGridWeek");
				}
				if ( ! (z.__CalendarInfo[calendarId]["listWeek"] === false) ) {
					headerRight.push("listWeek");
				}
				if ( ! (z.__CalendarInfo[calendarId]["timeGridDay"] === false) ) {
					headerRight.push("timeGridDay");
				}
				
				for ( var i = 0, ii = datas.length; i < ii; i++ ) {
					datas[i]["calendarId"] = calendarId;
					
					datas[i]["title"] = datas[i][ z.__CalendarInfo[calendarId]["title"] ];
					
					var calendarStartEnd = z.getCalendarStartEnd(calendarId, datas[i]);
					
					datas[i]["start"] = calendarStartEnd.start;
					datas[i]["end"]   = calendarStartEnd.end;
				}
				
				z.makeCalendar(calendarId, datas, headerRight.join(","), params1["calendarBaseDate"], view);
			} else {
				z.msg("조회중 오류가 발생 하였습니다.");
			}
		});
	}
}

z.getCalendarStartEnd = function (calendarId, data) {
	var calendarStartEnd = {};
	
	if ( z.__CalendarInfo[calendarId]["startDate"] ) {
		if ( z.__CalendarInfo[calendarId]["startDateFormat"] === "yyyy-mm-dd" ) {
			var startDate = z.toString(data[ z.__CalendarInfo[calendarId]["startDate"] ], z.__CalendarInfo[calendarId]["startDateFormat"]);
			var startTime = "";
			
			if ( data[ z.__CalendarInfo[calendarId]["startTime"] ] ) {
				startTime = data[ z.__CalendarInfo[calendarId]["startTime"] ];
				
				startTime = " " + z.getLeft(startTime, 2) + ":" + z.getRight(startTime, 2);
			}
			
			calendarStartEnd["start"] = startDate + startTime;
		}
		else if ( z.__CalendarInfo[calendarId]["startDateFormat"] === "yyyy-mm-dd hh:mi" ) {
			calendarStartEnd["start"] = z.toString(data[ z.__CalendarInfo[calendarId]["startDate"] ], z.__CalendarInfo[calendarId]["startDateFormat"]);
		}
	}
	
	if ( z.__CalendarInfo[calendarId]["endDate"] ) {
		if ( z.__CalendarInfo[calendarId]["endDateFormat"] === "yyyy-mm-dd" ) {
			var endDate = z.toString(data[ z.__CalendarInfo[calendarId]["endDate"] ], z.__CalendarInfo[calendarId]["endDateFormat"]);
			var endTime = "";
			
			if ( data[ z.__CalendarInfo[calendarId]["endTime"] ] ) {
				endTime = data[ z.__CalendarInfo[calendarId]["endTime"] ];
				
				endTime = " " + z.getLeft(endTime, 2) + ":" + z.getRight(endTime, 2);
			}
			else {
				endDate = z.getRelativeDate(endDate, 1);
			}
			
			calendarStartEnd["end"] = endDate + endTime;
		}
		else if ( z.__CalendarInfo[calendarId]["endDateFormat"] === "yyyy-mm-dd hh:mi" ) {
			calendarStartEnd["end"] = z.toString(data[ z.__CalendarInfo[calendarId]["endDate"] ], z.__CalendarInfo[calendarId]["endDateFormat"]);
		}
	}
	else {
		if ( z.__CalendarInfo[calendarId]["startDateFormat"] === "yyyy-mm-dd" && z.__CalendarInfo[calendarId]["endTime"] ) {
			var endDate = z.toString(data[ z.__CalendarInfo[calendarId]["startDate"] ], z.__CalendarInfo[calendarId]["startDateFormat"]);
			var endTime = "";
			
			if ( data[ z.__CalendarInfo[calendarId]["endTime"] ] ) {
				endTime = data[ z.__CalendarInfo[calendarId]["endTime"] ];
				
				endTime = " " + z.getLeft(endTime, 2) + ":" + z.getRight(endTime, 2);
			}
			
			calendarStartEnd["end"] = endDate + endTime;
		}
	}
	
	return calendarStartEnd;
}

z.getCalendarExtendedProps = function (calendarId, info) {
	var extendedProps = $.extend(true, {}, info.event._def.extendedProps);
	
	if ( z.__CalendarInfo[calendarId]["title"] === "title" ) {
		extendedProps["title"] = info.event.title;
	}
	
	if ( z.__CalendarInfo[calendarId]["startDate"] ) {
		if ( z.__CalendarInfo[calendarId]["startDateFormat"] === "yyyy-mm-dd" ) {
			extendedProps[ z.__CalendarInfo[calendarId]["startDate"] ] = z.toString(info.event.start, z.__CalendarInfo[calendarId]["startDateFormat"]);
			
			if ( z.__CalendarInfo[calendarId]["startTime"] ) {
				extendedProps[ z.__CalendarInfo[calendarId]["startTime"] ] = z.toString(info.event.start, "hhmi");
			}
		}
		else if ( z.__CalendarInfo[calendarId]["startDateFormat"] === "yyyy-mm-dd hh:mi" ) {
			extendedProps[ z.__CalendarInfo[calendarId]["startDate"] ] = z.toString(info.event.start, z.__CalendarInfo[calendarId]["startDateFormat"]);
		}
	}
	
	if ( z.__CalendarInfo[calendarId]["endDate"] ) {
		if ( z.__CalendarInfo[calendarId]["endDateFormat"] === "yyyy-mm-dd" ) {
			extendedProps[ z.__CalendarInfo[calendarId]["endDate"] ] = z.toString(info.event.end, z.__CalendarInfo[calendarId]["endDateFormat"]);
			
			if ( z.__CalendarInfo[calendarId]["endTime"] ) {
				extendedProps[ z.__CalendarInfo[calendarId]["endTime"] ] = z.toString(info.event.end, "hhmi");
			}
		}
		else if ( z.__CalendarInfo[calendarId]["endDateFormat"] === "yyyy-mm-dd hh:mi" ) {
			extendedProps[ z.__CalendarInfo[calendarId]["endDate"] ] = z.toString(info.event.end, z.__CalendarInfo[calendarId]["endDateFormat"]);
		}
	}
	else {
		if ( z.__CalendarInfo[calendarId]["startDateFormat"] === "yyyy-mm-dd" && z.__CalendarInfo[calendarId]["endTime"] ) {
			extendedProps[ z.__CalendarInfo[calendarId]["endTime"] ] = z.toString(info.event.end, "hhmi");
		}
	}
	
	return extendedProps;
}

z.setCalendarExtendedProps = function (calendarId, info, extendedProps) {
	if ( extendedProps ) {
		for ( var prop in extendedProps ) {
			if ( extendedProps.hasOwnProperty(prop) ) {
				info.event.setExtendedProp(prop, extendedProps[prop]);
			}
		}
	}
	else if ( info ) {
		if ( z.__CalendarInfo[calendarId]["title"] === "title" ) {
			info.event.setExtendedProp("title", info.event.title);
		}
		
		if ( z.__CalendarInfo[calendarId]["startDate"] ) {
			if ( z.__CalendarInfo[calendarId]["startDateFormat"] === "yyyy-mm-dd" ) {
				info.event.setExtendedProp(z.__CalendarInfo[calendarId]["startDate"], z.toString(info.event.start, z.__CalendarInfo[calendarId]["startDateFormat"]));
				
				if ( z.__CalendarInfo[calendarId]["startTime"] ) {
					info.event.setExtendedProp(z.__CalendarInfo[calendarId]["startTime"], z.toString(info.event.start, "hhmi"));
				}
			}
			else if ( z.__CalendarInfo[calendarId]["startDateFormat"] === "yyyy-mm-dd hh:mi" ) {
				info.event.setExtendedProp(z.__CalendarInfo[calendarId]["startDate"], z.toString(info.event.start, z.__CalendarInfo[calendarId]["startDateFormat"]));
			}
		}
		
		if ( z.__CalendarInfo[calendarId]["endDate"] ) {
			if ( z.__CalendarInfo[calendarId]["endDateFormat"] === "yyyy-mm-dd" ) {
				info.event.setExtendedProp(z.__CalendarInfo[calendarId]["endDate"], z.toString(info.event.end, z.__CalendarInfo[calendarId]["endDateFormat"]));
				
				if ( z.__CalendarInfo[calendarId]["endTime"] ) {
					info.event.setExtendedProp(z.__CalendarInfo[calendarId]["endTime"], z.toString(info.event.end, "hhmi"));
				}
			}
			else if ( z.__CalendarInfo[calendarId]["endDateFormat"] === "yyyy-mm-dd hh:mi" ) {
				info.event.setExtendedProp(z.__CalendarInfo[calendarId]["endDate"], z.toString(info.event.end, z.__CalendarInfo[calendarId]["endDateFormat"]));
			}
		}
		else {
			if ( z.__CalendarInfo[calendarId]["startDateFormat"] === "yyyy-mm-dd" && z.__CalendarInfo[calendarId]["endTime"] ) {
				info.event.setExtendedProp(z.__CalendarInfo[calendarId]["endTime"], z.toString(info.event.end, "hhmi"));
			}
		}
	}
}

z.makeCalendar = function (calendarId, datas, headerRight, calendarBaseDate, view) {
	zoMakeCalendarBefore(datas);
	
	var today = new Date(calendarBaseDate);  
	var year  = today.getFullYear();
	var month = today.getMonth() + 1;
	var date  = today.getDate();
	
	var defaultDate = year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date)
	
	var calendarEl = $("#" + calendarId).empty()[0];

	z.__CalendarInfo[calendarId]["calendar"] = new FullCalendar.Calendar(calendarEl, {
		plugins: ['interaction', 'dayGrid', 'list', 'timeGrid'],
		isRTL  : KTUtil.isRTL(),
		header : {
			left  : 'prev,next today',
			center: 'title',
			right : headerRight
		},
//		contentHeight: 780,
//		aspectRatio : 3,  // see: https://fullcalendar.io/docs/aspectRatio
		nowIndicator: true,
		now         : defaultDate,
		views       : {
			dayGridMonth: { buttonText: '월' },
			timeGridWeek: { buttonText: '주' },
			listWeek    : { buttonText: '주(리스트)' },
			timeGridDay : { buttonText: '일' }
		},
		defaultView  : view,
		defaultDate  : defaultDate,
		editable     : true,
		eventLimit   : true, // allow \"more\" link when too many events
		navLinks     : true, // can click day/week names to navigate views
		businessHours: true, // display business hours
		locale       : "ko",
		eventClick   : function(info) {
			var datas = $.extend(true, {}, info.event._def.extendedProps);
			
			if ( ! datas.title ) {
				datas.title = info.event._def.title;
			}
			if ( ! datas.start ) {
				datas.start = info.event._def.start;
			}
			if ( ! datas.end ) {
				datas.end = info.event._def.end;
			}
			
			zoCalendarEventclick(info.event._def.title, info.event._def.start, info.event._def.end, datas);
		},
		eventResize: function(info, a, b) {
			var calendarId = info.event._def.extendedProps.calendarId;
			
			if ( ! z.__CalendarInfo[calendarId]["endDate"] ) {
				if ( z.__CalendarInfo[calendarId]["startDateFormat"] === "yyyymmdd" || z.__CalendarInfo[calendarId]["startDateFormat"] === "yyyy-mm-dd" ) {
					if ( z.__CalendarInfo[calendarId]["startTime"] && z.__CalendarInfo[calendarId]["endTime"] ) {
						var start = z.toString(info.event.start, 'yyyymmdd');
						var end   = z.toString(info.event.end  , 'yyyymmdd');
						
						if ( start == end ) {
							z.msgYN("일정을 변경 하시겠습니까?", function (res) {
								if ( res ) {
									var data = z.getCalendarExtendedProps(calendarId, info);
									
									if ( z.__CalendarInfo[calendarId]["autoSave"] ) {
										if ( zoCalendarEventResize(data) ) {
											z.xA(z.__CalendarInfo[calendarId]["sqlFile"], z.__CalendarInfo[calendarId]["sqlId"], "update", data, null, function (res) {
												if ( res == "OK" ) {
													z.setCalendarExtendedProps(calendarId, info, data);
												} else {
													info.revert();
												}
											});
										}
										else {
											info.revert();
										}
									}
									else {
										if ( zoCalendarEventResize(data) ) {
											z.setCalendarExtendedProps(calendarId, info, data);
										} else {
											info.revert();
										}
									}
								}
								else {
									info.revert();
								}
							});
							
							return;
						}
					}
				}
				
				z.notify("일정변경 불가", "일정을 변경할 수 없습니다.");
				info.revert();
			}
			else {
				z.msgYN("일정을 변경 하시겠습니까?", function (res) {
					if ( res ) {
						var data = z.getCalendarExtendedProps(calendarId, info);
						
						if ( z.__CalendarInfo[calendarId]["autoSave"] ) {
							if ( zoCalendarEventResize(data) ) {
								z.xA(z.__CalendarInfo[calendarId]["sqlFile"], z.__CalendarInfo[calendarId]["sqlId"], "update", data, null, function (res) {
									if ( res == "OK" ) {
										z.setCalendarExtendedProps(calendarId, info, data);
									} else {
										info.revert();
									}
								});
							}
							else {
								info.revert();
							}
						}
						else {
							if ( zoCalendarEventResize(data) ) {
								z.setCalendarExtendedProps(calendarId, info, data);
							} else {
								info.revert();
							}
						}
					}
					else {
						info.revert();
					}
				});
			}
		},
		eventDrop: function(info) {
			z.msgYN("일정을 변경 하시겠습니까?", function (res) {
				if ( res ) {
					var data = z.getCalendarExtendedProps(calendarId, info);
					
					if ( z.__CalendarInfo[calendarId]["autoSave"] ) {
						if ( zoCalendarEventDrop(data) ) {
							z.xA(z.__CalendarInfo[calendarId]["sqlFile"], z.__CalendarInfo[calendarId]["sqlId"], "update", data, null, function (res, result) {
								if ( res == "OK" ) {
									z.setCalendarExtendedProps(calendarId, info, data);
								} else {
									info.revert();
								}
							});
						}
						else {
							info.revert();
						}
					}
					else {
						if ( zoCalendarEventDrop(data) ) {
							z.setCalendarExtendedProps(calendarId, info, data);
						} else {
							info.revert();
						}
					}
				}
				else {
					info.revert();
				}
			});
		},
		dateClick: function(info) {
			zoCalendarDateClick(info.dateStr);
		},
		events: datas //data
	});

	z.__CalendarInfo[calendarId]["calendar"].render();
}

z.getCalendar = function (calendarId) {
	if ( z.__CalendarInfo[calendarId]["calendar"] ) {
		return z.__CalendarInfo[calendarId]["calendar"];
	}
	
	return null;
}

/* datatable *****************************************************************************************************************************/
z.datatableInit = function (options) {
	if ( ! z.datatableHtmlRender(options) ) {
		console.log("No required options");
		return;
	}
	
	var datatableId = options.datatableId;
	
	if ( z.__Datatable[datatableId] && z.__Datatable[datatableId].datatable ) {
		z.__Datatable[datatableId].datatable.destroy();
	}
	
	z.__Datatable[datatableId] = {};
	
	if ( options.modalId ) {
		z.__Datatable[datatableId].modalId  = options.modalId;
		z.__DatatableModal[options.modalId] = datatableId;
	}
	
	for ( var i = 0, ii = options.columns.length; i < ii; i++ ) {
		if ( options.columns[i].view == null ) {
			var getTemplate = function (datatableId, title, field, type, selectView) {
				if ( type.indexOf("checkbox") == 0 ) {
					var types = type.split("_");
					return function (row, index, datatable) {
						return '<label class="checkbox checkbox-' + (types.length == 1 ? 'primary' : types[1]) + '"><input type="checkbox" value="' + row[field] + '"' + (row[field] == "Y" ? ' checked="checked"' : '') + ' readonly disabled>&nbsp;<span></span></label>';
					}
				}
				else if ( type == "select" && selectView == "label" && z.__SelectBox[datatableId] && z.__SelectBox[datatableId][field] ) {
					return function (row, index, datatable) {
						return '<text data-toggle="popover" title="' + title + '" data-html="true" data-content="' + z.__SelectBox[datatableId][field]["label"][ row[field] ] + '">' + z.__SelectBox[datatableId][field]["label"][ row[field] ] + '</text>';
					}
				}
				else {
					return function (row, index, datatable) {
						return '<text data-toggle="popover" title="' + title + '" data-html="true" data-content="' + row[field] + '">' + row[field] + '</text>';
					}
				}
			}
			
			options.columns[i].template = getTemplate(datatableId, options.columns[i].title, options.columns[i].field, options.columns[i].type, options.columns[i].selectView);
//			options.columns[i].template = "{{" + options.columns[i].field + "}}";
		}
		else {
			options.columns[i].template = options.columns[i].view;
			delete options.columns[i].view;
		}
		
		if ( options.columns[i].sort != null ) {
			options.columns[i].sortCallback = options.columns[i].sort;
			delete options.columns[i].sort;
		}
		
		if ( options.columns[i].visible == true ) {
			delete options.columns[i].visible;
		}
		
		if ( options.columns[i].width == 0 ) {
			options.columns[i].visible = false;
		}
	}
	
	if ( options.checkbox ) {
		var checkbox = {
			field     : 'RecordID',
			title     : '#',
			width     : 40,
			textAlign : 'center',
			overflow  : 'visible',
			responsive: {visible: 'md', hidden: 'lg'},
			selector  : {class: 'kt-checkbox--solid'},
			autoHide  : false
		}
		
		options.columns.unshift(checkbox);
	}
	
	options.layout = {};
	
	if ( options.header != null ) {
		options.layout.header = options.header;
	}
	
	if ( options.footer != null ) {
		options.layout.footer = options.footer;
	}
	
	z.__Datatable[datatableId].params = {
		"z.action"     : "select",
		"z.sqlFile"    : options.sFile,
		"z.sqlId"      : options.sId,
		"z.returnType" : "json2",
		"z.rowSeparate": z._Row_Separate,
		"z.colSeparate": z._Col_Separate,
		"z.params"     : {}
	};
	
	z.__Datatable[datatableId].params1 = options.sParam;
	z.__Datatable[datatableId].params2 = {"main_search_key_word": $("#main_search_key_word")[0]};
	
	options.search = {};
	
	if ( options.searchInputId != null ) {
		options.search.input = $('#' + options.searchInputId);
		delete options.searchInputId;
		
		z.__Datatable[datatableId].params2[options.searchInputId] = $("#" + options.searchInputId)[0];
	}
	
	z.__Datatable[datatableId].params["z.params"] = z.getParams(z.__Datatable[datatableId].params1, z.__Datatable[datatableId].params2);
	
	if ( options.rowButton && options.rowButton.length || options.updatable || options.deletable ) {
		if ( options.columns[options.columns.length - 1].field == "Actions" ) {
			options.columns.splice(options.columns.length - 1, 1);
		}
		
		var mHtml = '';
		
		if ( options.rowButton && options.rowButton.length ) {
			mHtml += '<a href="javascript: void(0);" class="btn btn-sm btn-clean btn-icon mr-2" data-toggle="dropdown">\
						<span class="svg-icon svg-icon-md">\
							<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
								<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
									<rect x="0" y="0" width="24" height="24"/>\
									<path d="M5,8.6862915 L5,5 L8.6862915,5 L11.5857864,2.10050506 L14.4852814,5 L19,5 L19,9.51471863 L21.4852814,12 L19,14.4852814 L19,19 L14.4852814,19 L11.5857864,21.8994949 L8.6862915,19 L5,19 L5,15.3137085 L1.6862915,12 L5,8.6862915 Z M12,15 C13.6568542,15 15,13.6568542 15,12 C15,10.3431458 13.6568542,9 12,9 C10.3431458,9 9,10.3431458 9,12 C9,13.6568542 10.3431458,15 12,15 Z" fill="#000000"/>\
								</g>\
							</svg>\
						</span>\
					</a>\
					<div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">\
						<ul class="navi flex-column navi-hover py-2">\
							<li class="navi-header font-weight-bolder text-uppercase font-size-xs text-primary pb-2">\
								Choose an action:\
							</li>\
							';
		}
		
		if ( options.rowButton && options.rowButton.length ) {
			for ( var i = 0, ii = options.rowButton.length; i < ii; i++ ) {
				if ( options.rowButton[i] == "print" ) {
					mHtml += '<li class="navi-item">\
								<a href="javascript: void(0);" class="z-datatable-row-option-btn navi-link" data-option="' + options.rowButton[i] + '">\
									<span class="navi-icon"><i class="' + (options.rowButtonIcon && options.rowButtonIcon[i] || 'la la-print') + '"></i></span>\
									<span class="navi-text">Print</span>\
								</a>\
							</li>\
						';
				}
				else if ( options.rowButton[i] == "copy" ) {
					mHtml += '<li class="navi-item">\
								<a href="javascript: void(0);" class="z-datatable-row-option-btn navi-link" data-option="' + options.rowButton[i] + '">\
									<span class="navi-icon"><i class="' + (options.rowButtonIcon && options.rowButtonIcon[i] || 'la la-copy') + '"></i></span>\
									<span class="navi-text">Copy</span>\
								</a>\
							</li>\
						';
				}
				else if ( options.rowButton[i] == "excel" ) {
					mHtml += '<li class="navi-item">\
								<a href="javascript: void(0);" class="z-datatable-row-option-btn navi-link" data-option="' + options.rowButton[i] + '">\
									<span class="navi-icon"><i class="' + (options.rowButtonIcon && options.rowButtonIcon[i] || 'la la-file-excel-o') + '"></i></span>\
									<span class="navi-text">Excel</span>\
								</a>\
							</li>\
						';
				}
				else if ( options.rowButton[i] == "csv" ) {
					mHtml += '<li class="navi-item">\
								<a href="javascript: void(0);" class="z-datatable-row-option-btn navi-link" data-option="' + options.rowButton[i] + '">\
									<span class="navi-icon"><i class="' + (options.rowButtonIcon && options.rowButtonIcon[i] || 'la la-file-text-o') + '"></i></span>\
									<span class="navi-text">CSV</span>\
								</a>\
							</li>\
						';
				}
				else if ( options.rowButton[i] == "pdf" ) {
					mHtml += '<li class="navi-item">\
								<a href="javascript: void(0);" class="z-datatable-row-option-btn navi-link" data-option="' + options.rowButton[i] + '">\
									<span class="navi-icon"><i class="' + (options.rowButtonIcon && options.rowButtonIcon[i] || 'la la-file-pdf-o') + '"></i></span>\
									<span class="navi-text">PDF</span>\
								</a>\
							</li>\
						';
				}
				else {
					mHtml += '<li class="navi-item">\
								<a href="javascript: void(0);" class="z-datatable-row-option-btn navi-link" data-option="' + options.rowButton[i] + '">\
									<span class="navi-icon"><i class="' + (options.rowButtonIcon && options.rowButtonIcon[i] || 'la la-square') + '"></i></span>\
									<span class="navi-text">' + options.rowButton[i] + '</span>\
								</a>\
							</li>\
						';
				}
			}
		}
		
		if ( options.rowButton && options.rowButton.length ) {
			mHtml += '	</ul>\
					</div>\
				';
		}
		
		if ( options.rowButton && options.updatable ) {
			mHtml += '<a href="javascript:void(0);" class="z-datatable-row-update-btn btn btn-sm btn-clean btn-icon mr-2" title="Edit details">\
						<span class="svg-icon svg-icon-md">\
							<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
								<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
									<rect x="0" y="0" width="24" height="24"/>\
									<path d="M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z" fill="#000000" fill-rule="nonzero"\ transform="translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) "/>\
									<rect fill="#000000" opacity="0.3" x="5" y="20" width="15" height="2" rx="1"/>\
								</g>\
							</svg>\
						</span>\
					</a>\
				';
		}
		
		if ( options.rowButton && options.deletable ) {
			mHtml += '<a href="javascript:void(0);" class="z-datatable-row-delete-btn btn btn-sm btn-clean btn-icon" title="Delete">\
						<span class="svg-icon svg-icon-md">\
							<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
								<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
									<rect x="0" y="0" width="24" height="24"/>\
									<path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="#000000" fill-rule="nonzero"/>\
									<path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3"/>\
								</g>\
							</svg>\
						</span>\
					</a>\
				';
		}
		
		var lastColumn = {
			field    : 'Actions',
			title    : 'Actions',
			textAlign: 'center',
			overflow : 'visible',
			autoHide : false,
			sortable : false,
			width    : 120,
			template : function(row, index, datatable) {
				var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
				var html = '<div class="dropdown ' + dropup + '">\
							';
				
				html += mHtml;
				
				html += '</div>\
						';
				
				return html;
			}
		};
		
		options.columns.push(lastColumn);
	}
	
	var defaultOptions = {
		data: {
			type  : 'remote',
			source: {
				read: {
					url        : '/common/core/xmlAjax.do',
					method     : 'POST',
					headers    : {},
					contentType: 'application/x-www-form-urlencoded',
					charset    : 'UTF-8',
					params     : {
						"datatable_v7_0_5": JSON.stringify(z.__Datatable[datatableId].params)
					},
					map: function(raw) {
						var dataSet;
						
						if ( raw.result == "OK" ) {
							if ( typeof raw.datas !== 'undefined' ) {
								dataSet = z.getAjaxJsonData(raw.datas);
							}
						}
						
						return dataSet;
					},
					timeout	: 3000,
				}
			},
			pageSize       : 10,
			saveState      : false,
			serverPaging   : false,
			serverFiltering: false,
			serverSorting  : false,
			autoColumns    : false
		},
		layout: {
			theme  : 'default',
			class  : 'datatable-brand',
			footer : false,
			header : true,
			spinner: {
				overlayColor: '#000000',
				opacity     : 0,
				type        : 'loader',
				state       : 'brand',
				message     : 'Loading..'
			},
			icons: {
				sort: {
					asc : 'la la-arrow-up',
					desc: 'la la-arrow-down'
				},
				pagination: {
					next : 'la la-angle-right',
					prev : 'la la-angle-left',
					first: 'la la-angle-double-left',
					last : 'la la-angle-double-right',
					more : 'la la-ellipsis-h'
				},
				rowDetail: {
					expand  : 'fa fa-caret-down',
					collapse: 'fa fa-caret-right'
				}
			}
		},
		sortable  : true,
		pagination: true,
		search: {
			onEnter: true,
			input  : null,
			delay  : 0
		},
		toolbar: {
			layout   : ['info', 'pagination'],
			placement: ['bottom'],
			items    : {
				pagination: {
					type : 'default',
					navigation: {
						prev : true,
						next : true,
						first: true,
						last : true
					},
					pageSizeSelect: [10, 20, 30, 50, 100, -1],
				},
				info: true
			}
		},
		rows: {
			callback: function ($row, data, index) {

			},
			beforeTemplate: function ($row, data, index) {

			},
			afterTemplate: function ($row, data, index) {
				$row.find(".z-datatable-row-option-btn").off("click").on("click", function (e) {
					var portlet     = z.getPortlet($row[0]);
					var datatableId = $(portlet).find(".z-datatable")[0].id;
					var option      = $(this).data("option");
					
					zoDatatableRowOptionBtnClick(datatableId, data, index, option);
				});
				$row.find(".z-datatable-row-update-btn").off("click").on("click", function (e) {
					var portlet     = z.getPortlet(this);
					var datatableId = $(portlet).find(".z-datatable")[0].id;
					
					zoDatatableRowUpdateBtnClick(datatableId, data, index);
				});
				$row.find(".z-datatable-row-delete-btn").off("click").on("click", function (e) {
					var portlet     = z.getPortlet(this);
					var datatableId = $(portlet).find(".z-datatable")[0].id;
					
					zoDatatableRowDeleteBtnClick(datatableId, data, index);
				});
				$row.find('[data-toggle="popover"]').each(function() {
					KTApp.initPopover($(this));
				});
			},
			autoHide: true
		}
	};
	
	defaultOptions = $.extend(true, {}, defaultOptions, options);
	
	delete defaultOptions.appendable;
	delete defaultOptions.autoForm;
	delete defaultOptions.button;
	delete defaultOptions.buttonIcon;
	delete defaultOptions.checkbox;
	delete defaultOptions.childDataTableOptions;
	delete defaultOptions.datatableId;
	delete defaultOptions.deletable;
	delete defaultOptions.layoutId;
	delete defaultOptions.modalId;
	delete defaultOptions.rowButton;
	delete defaultOptions.RowButtonIcon;
	delete defaultOptions.sFile;
	delete defaultOptions.sId;
	delete defaultOptions.sParam;
	delete defaultOptions.subTitle;
	delete defaultOptions.title;
	delete defaultOptions.updatable;
	
	z.__Datatable[datatableId].datatable = $('#' + datatableId).KTDatatable(defaultOptions);
	
	var eventsCapture = function() {
		z.__Datatable[datatableId].datatable.on('datatable-on-init', function(event, options) {
			eventsWriter('Datatable init');
		}).on('datatable-on-destroy', function(event) {
			eventsWriter('Layout render updated');
		}).on('datatable-on-layout-updated', function(event, args) {
			eventsWriter('Layout render updated');
		}).on('datatable-on-ajax-done', function(event, data) {
			zoDataTableOnAjaxDone(event, data);
			eventsWriter('Ajax data successfully updated');
		}).on('datatable-on-ajax-fail', function(event, jqXHR) {
			eventsWriter('Ajax error');
		}).on('datatable-on-goto-page', function(event, args) {
			eventsWriter('Goto to pagination: ' + args.page);
		}).on('datatable-on-update-perpage', function(event, args) {
			eventsWriter('Update page size: ' + args.perpage);
		}).on('datatable-on-reloaded', function(event) {
			eventsWriter('Datatable reloaded');
		}).on('datatable-on-check', function(event, args) {
			eventsWriter('Checkbox active: ' + args.toString());
		}).on('datatable-on-uncheck', function(event, args) {
			eventsWriter('Checkbox inactive: ' + args.toString());
		}).on('datatable-on-sort', function(event, args) {
			eventsWriter('Datatable sorted by ' + args.field + ' ' + args.sort);
		});
	};

	var eventsWriter = function(string) {
//		console.log(string + '\t\n');
	};
	
	eventsCapture();
}

z.getSubDatatableInit = function (datatableId, options) {
	var subDatatableInit = function (e) {
		$('<div/>').attr('id', 'child_data_ajax_' + e.data.RecordID).appendTo(e.detailCell).KTDatatable({
			data: {
				type: 'remote',
				source: {
					read: {
						url: HOST_URL + '/api/datatables/demos/orders.php',
						params: {
							// custom query params
							query: {
								generalSearch: '',
								CustomerID: e.data.RecordID,
							},
						},
					},
				},
				pageSize: 5,
				serverPaging: true,
				serverFiltering: false,
				serverSorting: true,
			},

			// layout definition
		layout: {
				scroll: false,
				footer: false,

				// enable/disable datatable spinner.
				spinner: {
					type: 1,
					theme: 'default',
				},
			},

			sortable: true,

			// columns definition
			columns: [
				{
					field: 'RecordID',
					title: '#',
					sortable: false,
					width: 30,
				}, {
					field: 'OrderID',
					title: 'Order ID',
					template: function(row) {
						return '<span>' + row.OrderID + ' - ' + row.ShipCountry + '</span>';
					},
				}, {
					field: 'ShipCountry',
					title: 'Country',
					width: 100
				}, {
					field: 'ShipAddress',
					title: 'Ship Address',
				}, {
					field: 'ShipName',
					title: 'Ship Name',
				}, {
					field: 'TotalPayment',
					title: 'Payment',
					type: 'number',
				}, {
					field: 'Status',
					title: 'Status',
					// callback function support for column rendering
					template: function(row) {
						var status = {
							1: {'title': 'Pending', 'class': 'label-light-primary'},
							2: {'title': 'Delivered', 'class': ' label-light-danger'},
							3: {'title': 'Canceled', 'class': ' label-light-primary'},
							4: {'title': 'Success', 'class': ' label-light-success'},
							5: {'title': 'Info', 'class': ' label-light-info'},
							6: {'title': 'Danger', 'class': ' label-light-danger'},
							7: {'title': 'Warning', 'class': ' label-light-warning'},
						};
						return '<span class="label ' + status[row.Status].class + ' label-inline label-bold">' + status[row.Status].title + '</span>';
					},
				}, {
					field: 'Type',
					title: 'Type',
					autoHide: false,
					// callback function support for column rendering
					template: function(row) {
						var status = {
							1: {'title': 'Online', 'state': 'danger'},
							2: {'title': 'Retail', 'state': 'primary'},
							3: {'title': 'Direct', 'state': 'success'},
						};
						return '<span class="label label-' + status[row.Type].state + ' label-dot mr-2"></span><span class="font-weight-bold text-' +
							status[row.Type].state + '">' +
							status[row.Type].title + '</span>';
					},
				}],
		});
	};
	
	return subDatatableInit;
}

z.datatableHtmlRender = function (options) {
	if ( ! options.layoutId || ! options.datatableId || ! options.columns ) {
		return false;
	}
	
	$("#" + options.layoutId).empty();
	
	var html = '';
		
	html += '<div class="card card-custom">\
				<div class="z-card-header card-header flex-wrap border-0 pt-6 pb-0">\
					<div class="card-title">\
						<h3 class="card-label">\
							<text class="z-datatable-title">' + options.title + '</text>\
							<span class="text-muted pt-2 font-size-sm d-block"><text class="z-datatable-sub-title">' + options.subTitle + '</text></span>\
						</h3>\
					</div>\
					<div class="card-toolbar">\
			';
	
	if ( options.button && options.button.length ) {
		html += '			<!--begin::Dropdown-->\
							<div class="dropdown dropdown-inline mr-2">\
								<button type="button" class="btn btn-light-primary font-weight-bolder dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
								<span class="svg-icon svg-icon-md">\
									<!--begin::Svg Icon | path:/metronic/theme/html/demo1/dist/assets/media/svg/icons/Design/PenAndRuller.svg-->\
									<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
										<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
											<rect x="0" y="0" width="24" height="24"></rect>\
											<path d="M3,16 L5,16 C5.55228475,16 6,15.5522847 6,15 C6,14.4477153 5.55228475,14 5,14 L3,14 L3,12 L5,12 C5.55228475,12 6,11.5522847 6,11 C6,10.4477153 5.55228475,10 5,10 L3,10 L3,8 L5,8 C5.55228475,8 6,7.55228475 6,7 C6,6.44771525 5.55228475,6 5,6 L3,6 L3,4 C3,3.44771525 3.44771525,3 4,3 L10,3 C10.5522847,3 11,3.44771525 11,4 L11,19 C11,19.5522847 10.5522847,20 10,20 L4,20 C3.44771525,20 3,19.5522847 3,19 L3,16 Z" fill="#000000" opacity="0.3"></path>\
											<path d="M16,3 L19,3 C20.1045695,3 21,3.8954305 21,5 L21,15.2485298 C21,15.7329761 20.8241635,16.200956 20.5051534,16.565539 L17.8762883,19.5699562 C17.6944473,19.7777745 17.378566,19.7988332 17.1707477,19.6169922 C17.1540423,19.602375 17.1383289,19.5866616 17.1237117,19.5699562 L14.4948466,16.565539 C14.1758365,16.200956 14,15.7329761 14,15.2485298 L14,5 C14,3.8954305 14.8954305,3 16,3 Z" fill="#000000"></path>\
										</g>\
									</svg>\
									<!--end::Svg Icon-->\
								</span>Export</button>\
								<!--begin::Dropdown Menu-->\
								<div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">\
									<!--begin::Navigation-->\
									<ul class="navi flex-column navi-hover py-2">\
										<li class="navi-header font-weight-bolder text-uppercase font-size-sm text-primary pb-2">Choose an option:</li>\
			';
		
		for ( var i = 0, ii = options.button.length; i < ii; i++ ) {
			if ( options.button[i] == "print" ) {
				html += '						<li class="navi-item">\
													<a href="javascript: void(0);" class="z-datatable-option-btn navi-link" data-option="' + options.button[i] + '">\
														<span class="navi-icon">\
															<i class="' + (options.buttonIcon && options.buttonIcon[i] || 'la la-print') + '"></i>\
														</span>\
														<span class="navi-text">Print</span>\
													</a>\
												</li>\
						';
			}
			else if ( options.button[i] == "copy" ) {
				html += '						<li class="navi-item">\
												<a href="javascript: void(0);" class="z-datatable-option-btn navi-link" data-option="' + options.button[i] + '">\
														<span class="navi-icon">\
															<i class="' + (options.buttonIcon && options.buttonIcon[i] || 'la la-copy') + '"></i>\
														</span>\
														<span class="navi-text">Copy</span>\
													</a>\
												</li>\
						';
			}
			else if ( options.button[i] == "excel" ) {
				html += '						<li class="navi-item">\
													<a href="javascript: void(0);" class="z-datatable-option-btn navi-link" data-option="' + options.button[i] + '">\
														<span class="navi-icon">\
															<i class="' + (options.buttonIcon && options.buttonIcon[i] || 'la la-file-excel-o') + '"></i>\
														</span>\
														<span class="navi-text">Excel</span>\
													</a>\
												</li>\
						';
			}
			else if ( options.button[i] == "csv" ) {
				html += '						<li class="navi-item">\
													<a href="javascript: void(0);" class="z-datatable-option-btn navi-link" data-option="' + options.button[i] + '">\
														<span class="navi-icon">\
															<i class="' + (options.buttonIcon && options.buttonIcon[i] || 'la la-file-text-o') + '"></i>\
														</span>\
														<span class="navi-text">CSV</span>\
													</a>\
												</li>\
						';
			}
			else if ( options.button[i] == "pdf" ) {
				html += '						<li class="navi-item">\
													<a href="javascript: void(0);" class="z-datatable-option-btn navi-link" data-option="' + options.button[i] + '">\
														<span class="navi-icon">\
															<i class="' + (options.buttonIcon && options.buttonIcon[i] || 'la la-file-pdf-o') + '"></i>\
														</span>\
														<span class="navi-text">PDF</span>\
													</a>\
												</li>\
						';
			}
			else {
				html += '						<li class="navi-item">\
													<a href="javascript: void(0);" class="z-datatable-option-btn navi-link" data-option="' + options.button[i] + '">\
														<span class="navi-icon">\
															<i class="' + (options.buttonIcon && options.buttonIcon[i] || 'la la-square') + '"></i>\
														</span>\
														<span class="navi-text">' + options.button[i] + '</span>\
													</a>\
												</li>\
						';
			}
		}
		
		html += '					</ul>\
									<!--end::Navigation-->\
								</div>\
								<!--end::Dropdown Menu-->\
							</div>\
							<!--end::Dropdown-->\
				';
	}

	if ( options.appendable ) {
		html += '			<!--begin::Button-->\
							<a href="javascript: void(0);" class="z-datatable-append-btn btn btn-primary font-weight-bolder">\
								<span class="svg-icon svg-icon-md">\
									<!--begin::Svg Icon | path:/metronic/theme/html/demo1/dist/assets/media/svg/icons/Design/Flatten.svg-->\
									<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
										<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
											<rect x="0" y="0" width="24" height="24"></rect>\
											<circle fill="#000000" cx="9" cy="15" r="6"></circle>\
											<path d="M8.8012943,7.00241953 C9.83837775,5.20768121 11.7781543,4 14,4 C17.3137085,4 20,6.6862915 20,10 C20,12.2218457 18.7923188,14.1616223 16.9975805,15.1987057 C16.9991904,15.1326658 17,15.0664274 17,15 C17,10.581722 13.418278,7 9,7 C8.93357256,7 8.86733422,7.00080962 8.8012943,7.00241953 Z" fill="#000000" opacity="0.3"></path>\
										</g>\
									</svg>\
									<!--end::Svg Icon-->\
								</span>New Record\
							</a>\
							<!--end::Button-->\
				';
	}
	
	html += '		</div>\
				</div>\
				<div class="card-body">\
					<div class="mb-7">\
						<div class="row align-items-center">\
							<div class="col-9">\
								<div class="row align-items-center">\
									\
								</div>\
							</div>\
							<div class="col-3">\
								<div class="datatable_filter">\
			';
	
	if ( options.searchInputId ) {
		html += '						<div class="input-icon">\
											<input type="text" class="form-control" placeholder="Search..." id="' + options.searchInputId + '">\
											<span>\
												<i class="flaticon2-search-1 text-muted"></i>\
											</span>\
											<!-- div class="input-group">\
												<input type="text" class="form-control" placeholder="Search..." id="' + options.searchInputId + '">\
												<span>\
													<i class="flaticon2-search-1 text-muted"></i>\
												</span>\
												<div class="input-group-append">\
													<a href="javascript:;" class="btn btn-light-primary px-6 font-weight-bold">Search</a>\
												</div>\
											</div -->\
										</div>\
				';
	}
	
	html += '					</div>\
							</div>\
						</div>\
					</div>\
					<!--begin: Datatable -->\
					<div class="z-datatable datatable datatable-bordered datatable-head-custom" id="' + options.datatableId + '">\
						\
					</div>\
					<!--end: Datatable -->\
				</div>\
			</div>\
			';
	
	$("#" + options.layoutId).html(html);
	
	$("#" + options.layoutId).find(".z-datatable-append-btn").off("click").on("click", function (e) {
		var portlet     = z.getPortlet(this);
		var datatableId = $(portlet).find(".z-datatable")[0].id;
		
		zoDatatableAppendBtnClick(datatableId);
	});
	
	$("#" + options.layoutId).find(".z-datatable-option-btn").off("click").on("click", function (e) {
		var portlet     = z.getPortlet(this);
		var datatableId = $(portlet).find(".z-datatable")[0].id;
		var option      = $(this).data("option");
		
		zoDatatableOptionBtnClick(datatableId, option);
	});
	
	return true;
}

z.setDatatableOptions = function (initOptions, options) {
	if ( initOptions && options ) {
		var reRenderProperty = [
			"layoutId",
			"datatableId",
//			"modalId",
//			"title",
//			"subTitle",
			"searchInputId",
			"button",
			"buttonIcon",
			"rowButton",
			"rowButtonIcon",
			"appendable",
			"updatable",
			"deletable",
			"header",
			"footer",
			"checkbox",
			"columns"
		];
		
		var reRender = false;
		
		for ( var i = 0, ii = reRenderProperty.length; i < ii; i++ ) {
			if ( options.hasOwnProperty(reRenderProperty[i]) ) {
				reRender = true;
				break;
			}
		}
		
		if ( reRender ) {
			var params = $.extend(true, [], [
				z.__Datatable[initOptions.datatableId].params["z.sqlFile"],
				z.__Datatable[initOptions.datatableId].params["z.sqlId"],
				z.__Datatable[initOptions.datatableId].params["params1"]
			]);
			
			if ( z.__Datatable[initOptions.datatableId] && z.__Datatable[initOptions.datatableId].datatable ) {
				z.__Datatable[initOptions.datatableId].datatable.destroy();
			}
			
			z.__Datatable[initOptions.datatableId]  = null;
			z.__DatatableModal[initOptions.modalId] = null;
			
			$("#" + initOptions.layoutId).empty();
			
			initOptions = $.extend(true, {}, initOptions, options);
			
			z.datatableInit(initOptions, params);
		}
		else {
			for ( var prop in options ) {
				if ( options.hasOwnProperty(prop) ) {
					if ( prop == "modalId" ) {
						z.__Datatable[initOptions.datatableId].modalId = options[prop];
						
						z.__DatatableModal[options.modalId]     = z.__DatatableModal[initOptions.modalId];
						z.__DatatableModal[initOptions.modalId] = null;
					}
					else if ( prop == "title" ) {
						$("#" + initOptions.layoutId).find(".z-datatable-title").text(options[prop]);
					}
					else if ( prop == "subTitle" ) {
						$("#" + initOptions.layoutId).find(".z-datatable-sub-title").text(options[prop]);
					}
				} 
			}
			
			initOptions = $.extend(true, {}, initOptions, options);
		}	
	}
}

z.datatable = function (datatableId) {
	if ( ! z.__Datatable[datatableId].returnDatatable ) {
		z.__Datatable[datatableId].returnDatatable = {
			load: function () {
				z.__Datatable[datatableId].params["z.params"] = z.getParams(z.__Datatable[datatableId].params1, z.__Datatable[datatableId].params2);
				
				z.__Datatable[datatableId].datatable.setDataSourceParam("datatable_v7_0_5", JSON.stringify(z.__Datatable[datatableId].params));
				z.__Datatable[datatableId].datatable.reload();
			},
			getRecord: function (id) {
				z.__Datatable[datatableId].datatable.getRecord(id);
				return z.__Datatable[datatableId].datatable.API.record;
			},
			getColumn: function (columnName) {
				z.__Datatable[datatableId].datatable.getColumn(columnName);
				return z.__Datatable[datatableId].datatable.API.value;
			},
			getValue: function () {
				return z.__Datatable[datatableId].datatable.getValue();
			},
			sort: function (columnName, sort) {
				z.__Datatable[datatableId].datatable.sort(columnName, sort);
			},
			setActive: function (cell) {
				z.__Datatable[datatableId].datatable.setActive(cell);
			},
			setInactive: function (cell) {
				z.__Datatable[datatableId].datatable.setInactive(cell);
			},
			setActiveAll: function (active) {
				z.__Datatable[datatableId].datatable.setActiveAll(active);
			},
			getSelectedRecords: function () {
				return z.__Datatable[datatableId].datatable.getSelectedRecords();
			},
			search: function (value, columns) {
				z.__Datatable[datatableId].datatable.search(value, columns);
			},
			getCurrentPage: function () {
				return z.__Datatable[datatableId].datatable.getCurrentPage();
			},
			getPageSize: function () {
				return z.__Datatable[datatableId].datatable.getPageSize();
			},
			getTotalRows: function () {
				return z.__Datatable[datatableId].datatable.getTotalRows();
			},
			showModal: function (action, data) {
				z.showModal(z.__Datatable[datatableId].modalId, action, data);
			},
			save: function (action, sqlFile, sqlId, msg, callbackFunc) {
				var modalId = z.__Datatable[datatableId].modalId;
				
				if ( modalId && action ) {
					var duplicateCheckObj = z.checkDatatableDupValue(datatableId, modalId, z.__DupCheck[modalId]);
					
					if ( duplicateCheckObj["$dupElement"] ) {
						z.msg("중복된 값이 입력되었습니다.", "info");
						return;
					}
					
					z.xAUM(modalId, sqlFile || z.__Datatable[datatableId].params["z.sqlFile"], sqlId || z.__Datatable[datatableId].params["z.sqlId"], action, function (result, datas) {
						if ( ! callbackFunc ) {
							z.__Datatable[datatableId].dataSourceParamPagination = z.__Datatable[datatableId].datatable.getDataSourceParam("pagination");
							z.__Datatable[datatableId].dataSourceParamSort       = z.__Datatable[datatableId].datatable.getDataSourceParam("sort");
							
							var page    = z.__Datatable[datatableId].dataSourceParamPagination.page;
							var pages   = z.__Datatable[datatableId].dataSourceParamPagination.pages;
							var perpage = z.__Datatable[datatableId].dataSourceParamPagination.perpage;
							var total   = z.__Datatable[datatableId].dataSourceParamPagination.total;
							
							if ( action == "delete" && page > 1 && page == pages ) {
								if ( total % perpage == 1 ) {
									z.__Datatable[datatableId].dataSourceParamPagination.page  = page - 1;
									z.__Datatable[datatableId].dataSourceParamPagination.pages = pages - 1;
									z.__Datatable[datatableId].dataSourceParamPagination.total = total - 1;
								}
							}
							
							z.__Datatable[datatableId].datatable.reload();
							z.hideModal(modalId);
						}
						else {
							callbackFunc(result, datas);
						}
					}, msg);
				}
			}
		}
	}

	return z.__Datatable[datatableId].returnDatatable;
}
