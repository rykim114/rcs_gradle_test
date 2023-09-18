
/**
 * @author sanggyu.lee(zeons)
 */
function getCallbackResult(result) {
	return result == null ? true : result === true;
}

function zoInit() {
	if ( typeof zo.init !== "undefined" ) {
		zo.init();
	}
}

function zoRetrieve(template) {
	var result = true;
	
	if ( typeof zo.retrieve !== "undefined" ) {
		result = zo.retrieve();
	}
	
	result = getCallbackResult(result);
	
	if ( result ) {
		ziRetrieve();
	}
}

function zoSelectSqlAfter(template, datas) {
	if ( typeof zo.selectSqlAfter !== "undefined" ) {
		zo.selectSqlAfter(template, datas);
	}
}

function zoFormControlChanged(ele, name, newValue, oldValue) {
	var result = true;
	
	if ( typeof zo.formControlChanged !== "undefined" ) {
		result = zo.formControlChanged(ele, name, newValue, oldValue);
	}
	
	return getCallbackResult(result);
}

function zoSave(template) {
	var result = true;
	
	if ( typeof zo.save !== "undefined" ) {
		result = zo.save(template);
	}
	
	result = getCallbackResult(result);
	
	if ( result ) {
		ziSave();
	}
}

function zoSaveActionBefore(template, saveParams) {
	var result = true;
	
	if ( typeof zo.saveActionBefore !== "undefined" ) {
		result = zo.saveActionBefore(template, saveParams);
	}
	
	return getCallbackResult(result);
}

function zoInsert(template) {
	var result = true;
	
	if ( typeof zo.insert !== "undefined" ) {
		result = zo.insert(template);
	}
	
	return getCallbackResult(result);
}

function zoInsertAfter(template, portlet) {
	var result = true;
	
	if ( typeof zo.insertAfter !== "undefined" ) {
		result = zo.insertAfter(portlet);
	}
	
	return getCallbackResult(result);
}

function zoAppend(template) {
	var result = true;
	
	if ( typeof zo.append !== "undefined" ) {
		result = zo.append(template);
	}
	
	return getCallbackResult(result);
}

function zoAppendAfter(template, portlet) {
	var result = true;
	
	if ( typeof zo.appendAfter !== "undefined" ) {
		result = zo.appendAfter(template, portlet);
	}
	
	return getCallbackResult(result);
}

function zoDelete(template, portlet) {
	var result = true;
	
	if ( typeof zo.delete !== "undefined" ) {
		result = zo.delete(template, portlet);
	}
	
	return getCallbackResult(result);
}

/* modal *****************************************************************************************************************************/
function zoShowModalBefore() {
	var $zFormControl = $(this).find(".z-form-control").not("label").val("");
	
	if ( z.__InsertOnly[this.id] ) {
		var isInsert = false;
		
		if ( z.__ModalBtns[this.id] && typeof z.__ModalBtns[this.id] == "object" && z.__ModalBtns[this.id] instanceof Array ) {
			if ( z.__ModalBtns[this.id].length ) {
				isInsert = z.__ModalBtns[this.id].indexOf("insert") != -1;
			}
		}
		
		for ( var i = 0, ii = $zFormControl.length; i < ii; i++ ) {
			if ( z.__InsertOnly[this.id].indexOf( $zFormControl[i].name ) != -1 ) {
				$($zFormControl[i]).prop("disabled", ! isInsert);
			}
		}
	}
	
	if ( z.__DefaultValue[this.id] ) {
		for ( var i = 0, ii = $zFormControl.length; i < ii; i++ ) {
			var defaultValue = z.__DefaultValue[this.id][ $zFormControl[i].name ];
			
			if ( defaultValue ) {
				if ( typeof defaultValue === "object" ) {
					z.setTypeValue($($zFormControl[i]), z.getTypeValue(defaultValue));
				}
				else if ( typeof defaultValue === "string" ) {
					z.setTypeValue($($zFormControl[i]), defaultValue);
				}
			}
			else {
				$zFormControl[i].value = "";
			}
		}
	}
	
	if ( z.__ModalData[this.id] ) {
		for ( var i = 0, ii = $zFormControl.length; i < ii; i++ ) {
			var initValue = z.__ModalData[this.id][ $zFormControl[i].name ];
			
			if ( initValue ) {
				if ( typeof initValue === "object" ) {
					z.setTypeValue($($zFormControl[i]), z.getTypeValue(initValue));
				}
				else if ( typeof initValue === "string" ) {
					z.setTypeValue($($zFormControl[i]), initValue);
				}
			}
		}
	}
	
	if ( typeof zo.showModalBefore !== "undefined" ) {
		zo.showModalBefore(this.id);
	}
}

function zoShowModalAfter() {
	$(this).trigger("scroll");
	
	if ( typeof zo.showModalAfter !== "undefined" ) {
		zo.showModalAfter(this.id);
	}
}

function zoHideModalBefore() {
	z.__ModalData[this.id]     = null;
	z.__ModalTemplate[this.id] = null;
	
	$(this).find(".z-form-control").not("label").val("");
	$(this).find(".is-invalid").removeClass("is-invalid");
	$(this).find(".invalid-feedback").remove();
	
	if ( typeof zo.hideModalBefore !== "undefined" ) {
		zo.hideModalBefore(this.id);
	}
}
/* calendar *****************************************************************************************************************************/
function zoMakeCalendarBefore(datas) {
	if ( typeof zo.makeCalendarBefore !== "undefined" ) {
		zo.makeCalendarBefore(datas);
	}
}

function zoCalendarDateClick(date) {
	if ( typeof zo.calendarDateClick !== "undefined" ) {
		zo.calendarDateClick(date);
	}
}

function zoCalendarEventclick(title, start, end, datas) {
	if ( typeof zo.calendarEventClick !== "undefined" ) {
		zo.calendarEventClick(title, start, end, datas);
	}
}

function zoCalendarEventResize(data) {
	var result = false;
	
	if ( typeof zo.calendarEventResize !== "undefined" ) {
		result = zo.calendarEventResize(data);
	}
	
	return getCallbackResult(result);
}

function zoCalendarEventDrop(data) {
	var result = false;
	
	if ( typeof zo.calendarEventDrop !== "undefined" ) {
		result = zo.calendarEventDrop(data);
	}
	
	return getCallbackResult(result);
}

/* datatable *****************************************************************************************************************************/
function zoDatatableSave(action) {
	var result      = true;
	var modalId     = $(event.target).closest(".z-modal")[0].id;
	var portlet     = z.getPortlet(z.__DatatableModal[modalId]);
	var datatableId = $(portlet).find(".z-datatable")[0].id;
	
	if ( action == "delete" ) {
		if ( ! z.msgYN("데이타를 삭제 하시겠습니까?") ) {
			return;
		}
	}
	
	if ( typeof zo.datatableSave !== "undefined" ) {
		result = zo.datatableSave(datatableId, action);
	}
	
	result = getCallbackResult(result);
	
	if ( result ) {
		z.datatable(datatableId).save(action);
	}
}

function zoDatatableSaveActionBefore(template, saveParams) {
	var result = true;
	
	if ( typeof zo.saveActionBefore !== "undefined" ) {
		result = zo.saveActionBefore(template, saveParams);
	}
	
	return getCallbackResult(result);
}

function zoDatatableOptionBtnClick(datatableId, option) {
	if ( typeof zo.datatableOption !== "undefined" ) {
		zo.datatableOption(datatableId, option);
	}
}

function zoDatatableAppendBtnClick(datatableId) {
	var result      = true;
	
	if ( typeof zo.datatableAppend !== "undefined" ) {
		result = zo.datatableAppend(datatableId);
	}
	
	result = getCallbackResult(result);
	
	if ( result ) {
		z.datatable(datatableId).showModal("insert");
	}
}

function zoDatatableRowUpdateBtnClick(datatableId, rowData, index) {
	var result = true;
	
	if ( typeof zo.datatableRowUpdate !== "undefined" ) {
		result = zo.datatableRowUpdate(datatableId, rowData, index);
	}
	
	result = getCallbackResult(result);
	
	if ( result ) {
		z.datatable(datatableId).showModal(["update", "delete"], rowData);
	}
}

function zoDatatableRowDeleteBtnClick(datatableId, rowData, index) {
	var result = true;
	
	if ( typeof zo.datatableRowDelete !== "undefined" ) {
		result = zo.datatableRowDelete(datatableId, rowData, index);
	}
	
	if ( getCallbackResult(result) ) {
		z.msgYN("데이타를 삭제 하시겠습니까?", function (res) {
			if ( res ) {
				z.xA(z.__Datatable[datatableId].params["z.sqlFile"], z.__Datatable[datatableId].params["z.sqlId"], "delete", rowData, null, function (res) {
					if ( res ) {
						z.msg("삭제 되었습니다.");
						z.__Datatable[datatableId].dataSourceParamPagination = z.__Datatable[datatableId].datatable.getDataSourceParam("pagination");
						z.__Datatable[datatableId].dataSourceParamSort       = z.__Datatable[datatableId].datatable.getDataSourceParam("sort");
						
						var page    = z.__Datatable[datatableId].dataSourceParamPagination.page;
						var pages   = z.__Datatable[datatableId].dataSourceParamPagination.pages;
						var perpage = z.__Datatable[datatableId].dataSourceParamPagination.perpage;
						var total   = z.__Datatable[datatableId].dataSourceParamPagination.total;
						
						if ( page > 1 && page == pages ) {
							if ( total % perpage == 1 ) {
								z.__Datatable[datatableId].dataSourceParamPagination.page  = page - 1;
								z.__Datatable[datatableId].dataSourceParamPagination.pages = pages - 1;
								z.__Datatable[datatableId].dataSourceParamPagination.total = total - 1;
							}
						}
						
						z.__Datatable[datatableId].datatable.reload();
					} else {
						z.msg("삭제 중 오류가 발생 하였습니다.");
					}
				});
			}
		});
	}
}

function zoDatatableRowOptionBtnClick(datatableId, rowData, index, option) {
	if ( typeof zo.datatableRowOption !== "undefined" ) {
		zo.datatableRowOption(datatableId, rowData, index, option);
	}
}

function zoDataTableModalBtnClick(modalId, div) {
	var result = true;
	
	if ( typeof zo.datatableModalBtnClick !== "undefined" ) {
		result = zo.datatableModalBtnClick(modalId, div);
	}
	
	result = getCallbackResult(result);
	
	if ( result ) {
		z.findZipcode(window, event.target, div);
	}
}

function zoDataTableOnAjaxDone(event, dataSet) {
	if ( z.__Datatable[event.target.id].dataSourceParamPagination ) {
		z.__Datatable[event.target.id].datatable.setDataSourceParam("pagination", z.__Datatable[event.target.id].dataSourceParamPagination);
		z.__Datatable[event.target.id].datatable.dataSourceParamPagination = null;
	}
	if ( z.__Datatable[event.target.id].dataSourceParamSort ) {
		z.__Datatable[event.target.id].datatable.setDataSourceParam("sort", z.__Datatable[event.target.id].dataSourceParamSort);
		z.__Datatable[event.target.id].datatable.dataSourceParamSort = null;
	}
	
//	if ( typeof zo.dataTableOnAjaxDone !== "undefined" ) {
//		zo.dataTableOnAjaxDone(event.target.id, event, dataSet);
//	}
}
