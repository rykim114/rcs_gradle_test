
/**
 * @author sanggyu.lee(zeons)
 */
z._Row_Separate = "˛";
z._Col_Separate = "¸";

z.encodeParam = function(a_data){
	return encodeURIComponent(z.getReplaceString(z.getReplaceString(z.getReplaceString(z.getReplaceString(z.getReplaceString(z.getReplaceString(String(a_data),'&','[(am)]'),'=','[(eq)]'),'?','[(qu)]'),'%','[(ps)]'),'#','[(Sh)]'),'+','[(pl)]'));
};

z.decodeParam = function(a_data){
  return z.getReplaceString(z.getReplaceString(z.getReplaceString(z.getReplaceString(z.getReplaceString(z.getReplaceString(String(a_data),'[(am)]','&'),'[(eq)]','='),'[(qu)]','?'),'[(ps)]','%'),'[(Sh)]','#'),'[(pl)]','+');
};

z.getAjaxArrayData = function(datas) {
	var arrayData = [];

	var rowDatas = datas.split( z._Row_Separate );
	  
	for ( var i = 0, ii = rowDatas.length; i < ii; i++ ) {
		arrayData[i] = [];
		
		var colDatas = rowDatas[i].split( z._Col_Separate );
		
	    for ( var j = 0, jj = colDatas.length; j < jj; j++ ) {
	    	arrayData[i][j] = colDatas[j];
	    }
	}
	
	datas = null;
	return arrayData;
};

z.getAjaxJsonData = function(datas) {
	var jSonData = [];

	if ( datas != null && datas != "" ) {
		try{	
			if ( datas.indexOf("\r\n") != -1 ) {
				datas = datas.replace(/\r\n/g, '\\n');    		    	
			}
			if ( datas.indexOf("\r") != -1 ) {
				datas = datas.replace(/[\r]/g, '\\n');    		
			}
			if ( datas.indexOf("\n") != -1 ) {
				datas = datas.replace(/[\n]/g, '\\n');    		
			}
			
			jSonData = eval(datas);
		} catch (exception) {
			console.log("exception: " + exception);
			jSonData = datas;
		}
	}

	datas = null;
	return jSonData;
};

z.ajaxJsonObjectCalcAct = function (url, data, contentType) {
	var ajaxReturn;
	
	$.ajax({
		type       : 'post',
		url        : url,
	    dataType   : "json",
	    data       : z.encodeParam(data),
	    timeout    : 600000,
		contentType: contentType || "application/x-www-form-urlencoded; charset=UTF-8",
		async      : false,
		cache      : false,
/*	    beforeSend : function(xhr){
	    	KTApp.block(".top-body", {
	    		overlayColor: "#000000",
	    		type        : "v2",
	    		state       : "success",
	    		message     : "처리중..."
	    	});
		},*/
		complete: function(){
			KTApp.unblockPage();
		},
	    success: function(resp) {
	    	if ( resp.result == "LoginOut" ) {
	    		alert("세션이 종료되어 로그인 화면으로 이동합니다.");
	    		zoMainOpenReLogin();
	    	}
	    	else {
	    		ajaxReturn = resp;
	    	}
	    },
	    error: function(resp) {
	      //_X.MBox("작업중 오류가 발생 하였습니다!"+resp);
	    }
	});
	
	return ajaxReturn;
}


z.ajaxJsonObjectCalcActAsync = function (url, data, contentType) {
	return $.ajax({
		type       : 'post',
		url        : url,
	    dataType   : "json",
	    data       : z.encodeParam(data),
	    timeout    : 600000,
		contentType: contentType || "application/x-www-form-urlencoded; charset=UTF-8",
		cache      : false,
	    success: function(resp) {
	    	if ( resp.result == "LoginOut" ) {
	    		alert("세션이 종료되어 로그인 화면으로 이동합니다.");
	    		zoMainOpenReLogin();
	    	}
	    },
	    error: function(resp) {
	      //_X.MBox("작업중 오류가 발생 하였습니다!"+resp);
	    }
	});
};

z.xAsync2 = function(sqlFile, sqlId, action, params, returnType) {
	if ( action == null || sqlFile == null || sqlId == null ) {
		return $.Deferred().reject();
	}
	
	returnType = returnType || "array";
	
	var ajaxParams = {};
	
	ajaxParams["z.action"]      = action;
	ajaxParams["z.sqlFile"]     = sqlFile;
	ajaxParams["z.sqlId"]       = sqlId;
	ajaxParams["z.returnType"]  = returnType;
	ajaxParams["z.rowSeparate"] = z._Row_Separate;
	ajaxParams["z.colSeparate"] = z._Col_Separate;
	ajaxParams["z.params"]      = params || {};
	
	var jsonInfo   = JSON.stringify(ajaxParams);
	
	var deferred = $.Deferred();
	
	z.ajaxJsonObjectCalcActAsync("/common/core/xmlAjax.do", jsonInfo).always(function(ajaxReturn, statusText, xhr) {
		var resultData = null;

		if ( ajaxReturn.result == "OK" ) {
			if ( ajaxReturn.datas != null ) {
				switch ( returnType.toLowerCase() ) {
					case "array":
						resultData = z.getAjaxArrayData(ajaxReturn.datas);
						break;
						
					case "json":
					case "json2":
					case "jsonwithlower":
					case "jsonwithid":
						resultData = z.getAjaxJsonData(ajaxReturn.datas);
						break;
						
					default:
						resultData = ajaxReturn.datas;
				}
			}
		// HTTP/2 에서 빈칸 올 수도 있다고 해서 수정
//		} else if ('timeout' === ajaxReturn.statusText) {
		} else if ('string' === (typeof xhr) && ! ajaxReturn.getAllResponseHeaders()) {
			toastr.error('데이터 조회 시간이 초과되었습니다', '오류', {timeOut: 5000});
		}
		deferred.resolve(resultData, xhr);
	});

	return deferred;
};

z.xAsync = z.xmlAjaxAsync = function(sqlFile, sqlId, action, params, returnType) {
	if ( action == null || sqlFile == null || sqlId == null ) {
		return $.Deferred().reject();
	}
	
	returnType = returnType || "array";
	
	var ajaxParams = {};
	
	ajaxParams["z.action"]      = action;
	ajaxParams["z.sqlFile"]     = sqlFile;
	ajaxParams["z.sqlId"]       = sqlId;
	ajaxParams["z.returnType"]  = returnType;
	ajaxParams["z.rowSeparate"] = z._Row_Separate;
	ajaxParams["z.colSeparate"] = z._Col_Separate;
	ajaxParams["z.params"]      = params || {};
	
	var jsonInfo   = JSON.stringify(ajaxParams);
	
	var deferred = $.Deferred();
	
	z.ajaxJsonObjectCalcActAsync("/common/core/xmlAjax.do", jsonInfo).always(function(ajaxReturn, statusText, xhr) {
		var resultData = null;

		if ( ajaxReturn.result == "OK" ) {
			if ( ajaxReturn.datas != null ) {
				switch ( returnType.toLowerCase() ) {
					case "array":
						resultData = z.getAjaxArrayData(ajaxReturn.datas);
						break;
						
					case "json":
					case "json2":
					case "jsonwithlower":
					case "jsonwithid":
						resultData = z.getAjaxJsonData(ajaxReturn.datas);
						break;
						
					default:
						resultData = ajaxReturn.datas;
				}
			}
		// HTTP/2 에서 빈칸 올 수도 있다고 해서 수정
//		} else if ('timeout' === ajaxReturn.statusText) {
		} else if ('string' === (typeof xhr) && ! ajaxReturn.getAllResponseHeaders()) {
			toastr.error('데이터 조회 시간이 초과되었습니다', '오류', {timeOut: 5000});
		}
		
		deferred.resolve(resultData);
	});

	return deferred;
};

z.xA = z.xmlAjax = function(sqlFile, sqlId, action, params, returnType, callbackFunc) {
	if ( action == null || sqlFile == null || sqlId == null ) {
		return;
	}
	
	returnType = returnType || "array";
	
	var ajaxParams = {};
	
	ajaxParams["z.action"]      = action;
	ajaxParams["z.sqlFile"]     = sqlFile;
	ajaxParams["z.sqlId"]       = sqlId;
	ajaxParams["z.returnType"]  = returnType;
	ajaxParams["z.rowSeparate"] = z._Row_Separate;
	ajaxParams["z.colSeparate"] = z._Col_Separate;
	ajaxParams["z.params"]      = params || {};
	
	var jsonInfo   = JSON.stringify(ajaxParams);
	var ajaxReturn = z.ajaxJsonObjectCalcAct("/common/core/xmlAjax.do", jsonInfo);
	var resultData = null;
	
	if ( ajaxReturn.result == "OK" ) {
		if ( ajaxReturn.datas != null ) {
			switch ( returnType.toLowerCase() ) {
				case "array":
					resultData = z.getAjaxArrayData(ajaxReturn.datas);
					break;
					
				case "json":
				case "json2":
				case "jsonwithlower":
				case "jsonwithid":
					resultData = z.getAjaxJsonData(ajaxReturn.datas);
					break;
					
				default:
					resultData = ajaxReturn.datas;
			}
		}
	}
	
	if ( callbackFunc ) {
		callbackFunc(ajaxReturn.result, resultData);
	} else {
		return resultData;
	}
};

z.xAU = z.xmlAjaxUpdate = function(elementClass, template, selectSqlOrCallbackFunc, returnType, returnParams, msg) {
	if ( template == null ) {
		return;
	}
	if ( z.__SqlInfo[template] == null ) {
		return;
	}
	
	elementClass = elementClass || "z-kt-portlet";
	returnType   = returnType || "json2";
	
	var ajaxParams = {};
	
	ajaxParams["z.sqlFile"]     = z.__SqlInfo[template]["sqlFile"];
	ajaxParams["z.sqlId"]       = z.__SqlInfo[template]["sqlId"];
	ajaxParams["z.returnType"]  = returnType;
	ajaxParams["z.rowSeparate"] = z._Row_Separate;
	ajaxParams["z.colSeparate"] = z._Col_Separate;
	ajaxParams["z.params"]      = z.getXAUParams(elementClass, template, returnParams || z.getParams(z.__SqlInfo[template]["params"], {"main_search_key_word": $("#main_search_key_word")[0]}));
	
	if ( ajaxParams["z.params"] == "ERROR" ) {
		return;
	}
	if ( ajaxParams["z.params"] == null ) {
		z.msg("업데이트할 내용이 없습니다.");
		return;
	}
	
	if ( zoSaveActionBefore(template, ajaxParams["z.params"]) ) {
		var jsonInfo   = JSON.stringify(ajaxParams);
		var ajaxReturn = z.ajaxJsonObjectCalcAct("/common/core/xmlAjaxUpdate.do", jsonInfo);
		var resultData = null;

		var result = {
			"result"         : ajaxReturn.result,
			"insertCnt"      : ajaxReturn.insertCnt,
			"updateCnt"      : ajaxReturn.updateCnt,
			"deleteCnt"      : ajaxReturn.deleteCnt,
			"insertRealCnt"  : ajaxReturn.insertRealCnt,
			"updateRealCnt"  : ajaxReturn.updateRealCnt,
			"deleteRealCnt"  : ajaxReturn.deleteRealCnt,
			"insertFinishCnt": ajaxReturn.insertFinishCnt,
			"updateFinishCnt": ajaxReturn.updateFinishCnt,
			"deleteFinishCnt": ajaxReturn.deleteFinishCnt
		};
		
		if ( ajaxReturn.result == "OK" ) {
			if ( ajaxReturn.datas != null ) {
				switch ( returnType.toLowerCase() ) {
					case "array":
						resultData = z.getAjaxArrayData(ajaxReturn.datas);
						break;
						
					case "json":
					case "json2":
					case "jsonwithlower":
					case "jsonwithid":
						resultData = z.getAjaxJsonData(ajaxReturn.datas);
						break;
						
					default:
						resultData = ajaxReturn.datas;
				}
			}
			
			if ( ! (msg === false) ) {
				z.msg("저장 되었습니다.");
			}
			
			if ( selectSqlOrCallbackFunc && typeof selectSqlOrCallbackFunc === "function" ) {
				selectSqlOrCallbackFunc(result, resultData);
				return;
			}
			else {
				z.selectSqlAction(template, resultData);
				return resultData;
			}
		}
		else if ( ajaxReturn.result == "LoginOut" ) {
			z.msg("세션이 종료되어 로그인 화면으로 이동합니다.");
			zoMainOpenReLogin();
		}
		else {
			z.msg("저장 중 오류가 발생 하였습니다.");
			
			result["errmsg"] = ajaxReturn.errmsg;
			
			if ( selectSqlOrCallbackFunc && typeof selectSqlOrCallbackFunc === "function" ) {
				selectSqlOrCallbackFunc(result, resultData);
			}
			else {
				return resultData;
			}
		}
	}
};

z.getXAUParams = function (elementClass, template, returnParams) {
	var selector = "." + elementClass + "." + template;
	var $ele     = $(selector);
	
	if ( ! $ele.length ) {
		return null;
	}
	
	var duplicateCheckObj = z.checkDupValue(selector, z.__DupCheck[template]);
	var notNullCheckObj   = {
		"nullElement"   : [],
		"notNullElement": []
	};
	
	var xmlAjaxUpdateParams = {
		"insertData"  : [],
		"updateData"  : [],
		"deleteData"  : [],
		"insertCnt"   : 0,
		"updateCnt"   : 0,
		"deleteCnt"   : 0,
		"returnParams": returnParams
	};
	
	
	var $stateI = $ele.find(".z-svg-icon.svg-icon-info.z-state-i").closest(".z-kt-portlet");
	
	for ( var i = 0, ii = $stateI.length; i < ii; i++ ) {
		var $insert = $($stateI[i]).find(".z-update");
		
		for ( var j = 0, jj = $insert.length; j < jj; j++ ) {
			if ( z.__NotNull[template] && z.__NotNull[template].indexOf($insert[j].name) != -1 ) {
				if ( $insert[j].value == null || $insert[j].value == "" ) {
					notNullCheckObj["nullElement"].push($insert[j]);
				} else {
					notNullCheckObj["notNullElement"].push($insert[j]);
				}
			}
			
			if ( ! xmlAjaxUpdateParams["insertData"][i] ) {
				xmlAjaxUpdateParams["insertData"][i] = {};
			}
			
			if ( xmlAjaxUpdateParams["insertData"][i][ $insert[j].name ] == null ) {
				xmlAjaxUpdateParams["insertData"][i][ $insert[j].name ] = z.getTypeValue($insert[j]);
			}
		}

		xmlAjaxUpdateParams["insertCnt"]++;
	}
	
	var $stateU = $ele.find(".z-svg-icon.svg-icon-warning.z-state-u").closest(".z-kt-portlet");
	
	for ( var i = 0, ii = $stateU.length; i < ii; i++ ) {
		var $update = $($stateU[i]).find(".z-update");
		
		for ( var j = 0, jj = $update.length; j < jj; j++ ) {
			if ( z.__NotNull[template] && z.__NotNull[template].indexOf($update[j].name) != -1 ) {
				if ( $update[j].value == null || $update[j].value == "" ) {
					notNullCheckObj["nullElement"].push($update[j]);
				} else {
					notNullCheckObj["notNullElement"].push($update[j]);
				}
			}
			
			if ( ! xmlAjaxUpdateParams["updateData"][i] ) {
				xmlAjaxUpdateParams["updateData"][i] = {};
			}
			
			if ( xmlAjaxUpdateParams["updateData"][i][ $update[j].name ] == null ) {
				xmlAjaxUpdateParams["updateData"][i][ $update[j].name ] = z.getTypeValue($update[j]);
			}
		}

		xmlAjaxUpdateParams["updateCnt"]++;
	}
	
	if ( notNullCheckObj["nullElement"].length ) {
		z.msg("필수입력 항목이 입력되지 않았습니다.", "info");

		$(notNullCheckObj["notNullElement"]).removeClass("is-invalid").closest("div").find(".invalid-feedback").remove();
		
		var $feedbackParent = $(notNullCheckObj["nullElement"]).not(".is-invalid").addClass("is-invalid").closest("div");
		
		if ( ! $feedbackParent.find(".invalid-feedback").length ) {
			$feedbackParent.append('<div class="invalid-feedback">필수입력 항목 입니다.</div>');
		}
		
		return "ERROR";
	}
	
	if ( duplicateCheckObj["dupElement"].length ) {
		z.msg("중복된 값이 입력되었습니다.", "info");
		return "ERROR";
	}
	
	
	var $stateD = $ele.find(".z-svg-icon.svg-icon-danger.z-state-d").closest(".z-kt-portlet");
	
	for ( var i = 0, ii = $stateD.length; i < ii; i++ ) {
		var $delete = $($stateD[i]).find(".z-update");
		
		for ( var j = 0, jj = $delete.length; j < jj; j++ ) {
			if ( ! xmlAjaxUpdateParams["deleteData"][i] ) {
				xmlAjaxUpdateParams["deleteData"][i] = {};
			}
			
			if ( xmlAjaxUpdateParams["deleteData"][i][ $delete[j].name ] == null ) {
				xmlAjaxUpdateParams["deleteData"][i][ $delete[j].name ] = z.getTypeValue($delete[j]);
			}
		}

		xmlAjaxUpdateParams["deleteCnt"]++;
	}
	
	if ( ! (xmlAjaxUpdateParams["insertCnt"] + xmlAjaxUpdateParams["updateCnt"] + xmlAjaxUpdateParams["deleteCnt"]) ) {
		return null;
	}
	
	return xmlAjaxUpdateParams;
}

z.xAUM = z.xmlAjaxUpdateModal = function(modalId, sqlFile, sqlId, action, callbackFunc, msg) {
	if ( modalId == null ) {
		return;
	}
	
	var ajaxParams = {};
	
	ajaxParams["z.sqlFile"]     = sqlFile;
	ajaxParams["z.sqlId"]       = sqlId;
	ajaxParams["z.returnType"]  = "json2";
	ajaxParams["z.rowSeparate"] = z._Row_Separate;
	ajaxParams["z.colSeparate"] = z._Col_Separate;
	ajaxParams["z.params"]      = z.getXAUMParams(modalId, action);
	
	if ( ajaxParams["z.params"] == "ERROR" ) {
		return;
	}
	if ( ajaxParams["z.params"] == null ) {
		z.msg("업데이트할 내용이 없습니다.");
		return;
	}

	if ( zoSaveActionBefore(modalId, ajaxParams["z.params"]) ) {
		var jsonInfo   = JSON.stringify(ajaxParams);
		var ajaxReturn = z.ajaxJsonObjectCalcAct("/common/core/xmlAjaxUpdateModal.do", jsonInfo);
		var resultData = null;
		var msgTitle   = action == "delete" ? "삭제" : "저장";

		var result = {
			"result"   : ajaxReturn.result,
			"cnt"      : ajaxReturn.cnt,
			"realCnt"  : ajaxReturn.realCnt,
			"finishCnt": ajaxReturn.finishCnt
		};
		
		if ( ajaxReturn.result == "OK" ) {
			if ( ! (msg === false) ) {
				z.msg(msgTitle + " 되었습니다.");
			}
			
			if ( callbackFunc && typeof callbackFunc === "function" ) {
				callbackFunc(result.result, result);
				return;
			}
			else {
				return result;
			}
		}
		else if ( ajaxReturn.result == "LoginOut" ) {
			z.msg("세션이 종료되어 로그인 화면으로 이동합니다.");
			zoMainOpenReLogin();
		}
		else {
			z.msg(msgTitle + " 중 오류가 발생 하였습니다.");
			
			if ( callbackFunc && typeof callbackFunc === "function" ) {
				callbackFunc(result.result, result);
				return;
			}
			else {
				return result;
			}
		}
	}
};

z.getXAUMParams = function (modalId, action) {
	var $modal = $("#" + modalId);
	
	if ( ! $modal.length ) {
		return null;
	}
	
	var notNullCheckObj   = {
		"nullElement"   : [],
		"notNullElement": []
	};
	
	var xmlAjaxUpdateModalParams = {
		"insertData"  : [],
		"updateData"  : [],
		"deleteData"  : [],
		"insertCnt"   : 0,
		"updateCnt"   : 0,
		"deleteCnt"   : 0
	};
	
	
	if ( action === "insert" ) {
		var $insert = $modal.find(".z-update");
		
		for ( var j = 0, jj = $insert.length; j < jj; j++ ) {
			if ( z.__NotNull[modalId] && z.__NotNull[modalId].indexOf($insert[j].name) != -1 ) {
				if ( $insert[j].value == null || $insert[j].value == "" ) {
					notNullCheckObj["nullElement"].push($insert[j]);
				} else {
					notNullCheckObj["notNullElement"].push($insert[j]);
				}
			}
			
			if ( ! xmlAjaxUpdateModalParams["insertData"][0] ) {
				xmlAjaxUpdateModalParams["insertData"][0] = {};
			}
			
			if ( xmlAjaxUpdateModalParams["insertData"][0][ $insert[j].name ] == null ) {
				xmlAjaxUpdateModalParams["insertData"][0][ $insert[j].name ] = z.getTypeValue($insert[j]);
			}
		}

		xmlAjaxUpdateModalParams["insertCnt"]++;
	}
	else if ( action === "update" ) {
		var $update = $modal.find(".z-update");
		
		for ( var j = 0, jj = $update.length; j < jj; j++ ) {
			if ( z.__NotNull[modalId] && z.__NotNull[modalId].indexOf($update[j].name) != -1 ) {
				if ( $update[j].value == null || $update[j].value == "" ) {
					notNullCheckObj["nullElement"].push($update[j]);
				} else {
					notNullCheckObj["notNullElement"].push($update[j]);
				}
			}
			
			if ( ! xmlAjaxUpdateModalParams["updateData"][0] ) {
				xmlAjaxUpdateModalParams["updateData"][0] = {};
			}
			
			if ( xmlAjaxUpdateModalParams["updateData"][0][ $update[j].name ] == null ) {
				xmlAjaxUpdateModalParams["updateData"][0][ $update[j].name ] = z.getTypeValue($update[j]);
			}
		}

		xmlAjaxUpdateModalParams["updateCnt"]++;
	}
	else if ( action === "delete" ) {
		var $delete = $modal.find(".z-update");
		
		for ( var j = 0, jj = $delete.length; j < jj; j++ ) {
			if ( ! xmlAjaxUpdateModalParams["deleteData"][0] ) {
				xmlAjaxUpdateModalParams["deleteData"][0] = {};
			}
			
			if ( xmlAjaxUpdateModalParams["deleteData"][0][ $delete[j].name ] == null ) {
				xmlAjaxUpdateModalParams["deleteData"][0][ $delete[j].name ] = z.getTypeValue($delete[j]);
			}
		}

		xmlAjaxUpdateModalParams["deleteCnt"]++;
	}

	if ( notNullCheckObj["nullElement"].length ) {
		z.msg("필수입력 항목이 입력되지 않았습니다.", "info");
		
		$(notNullCheckObj["notNullElement"]).removeClass("is-invalid").closest("div").find(".invalid-feedback").remove();
		
		var $feedbackParent = $(notNullCheckObj["nullElement"]).not(".is-invalid").addClass("is-invalid").closest("div");
		
		if ( ! $feedbackParent.find(".invalid-feedback").length ) {
			$feedbackParent.append('<div class="invalid-feedback">필수입력 항목 입니다.</div>');
		}
		
		return "ERROR";
	}
	
	if ( ! (xmlAjaxUpdateModalParams["insertCnt"] + xmlAjaxUpdateModalParams["updateCnt"] + xmlAjaxUpdateModalParams["deleteCnt"]) ) {
		return null;
	}
	
	return xmlAjaxUpdateModalParams;
}

