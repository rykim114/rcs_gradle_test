
/**
 * @author sanggyu.lee(zeons)
 */
/* menu *****************************************************************************************************************************/
// 메뉴 열기
//z.menuLink = function (sysId, pgmCode) {

/* header *****************************************************************************************************************************/
//z.setSearchSelectBox = function (label, id, all, event, sqlFileOrFunction, sqlId, params, parentNames, colspan) {
//z.setSearchSelectBoxChild = function (id, children) {
//z.searchSelectBoxRender = function (label, id, all, event, colspan) {
//z.setSearchInputText = z.setSearchInput = function (label, id, event, colspan) {
//z.setSearchInputRender = function (label, id, event, colspan) {
//z.setMenuSelectBox = function (label, id, all, event, sqlFileOrFunction, sqlId, params, parentNames, colspan) {
//z.setMenuSelectBoxChild = function (id, children) {
//z.menuSelectBoxRender = function (label, id, all, event, colspan) {
//z.setMenuButton = function (text, handler) {
//z.menuButtonClick = function (text) {
//z.setMenuDropDown = function (text, handler) {
//z.menuDropdownClick = function (text) {
//z.setRetrieveInput = function (display) {

/* content *****************************************************************************************************************************/
//z.getSelector = function (names) {
//z.setNotNullVal = z.setNotNull = function (template, names) {
//z.setDupliCheck = z.setDupCheck = function (template, names) {
//z.setInsertOnly = function (template, names) {
//z.setDefaultVal = z.setDefaultValue = function (template, defaultValue) {
//z.setSelectBox = function (template, name, sqlFileOrFunction, sqlId, params, parentNames, selectFirstOption, $portletEle) {
//z.setSelectBoxChild = function (template, name, children) {
//z.selectBoxRender = function (template, parentEle, name) {
//z.setSqlInfo = function (template, sqlFile, sqlId, params, mainSql, contentId) {
//z.selectSql = function (template) {
//z.selectSqlAction = function (template, datas) {
//z.getSelectBoxRender = function (template, templateHtml) {
//z.getNotNullLabelColor = function (template, templateHtml) {
//z.setNotNullLabelColor = function (template, ele) {
//z.getInsertOnlyInput = function (template, templateHtml) {
//z.setInsertOnlyInput = function (template, ele) {
//z.getParams = function (params, params2) {
//z.getConcatParamValue = function (params, params2) {
//z.getTypeValue = function (ele) {
//z.setTypeValue = function ($ele, value) {
//z.getPortlet = function (ele) {
//z.getPortletCnt = function (template) {
//z.getValue = function (ele, name) {
//z.setValue = function (ele, name, value) {
//z.save = function (template, selectSqlOrCallbackFunc, msg) {

/* modal *****************************************************************************************************************************/
//z.showModal = function (modalId, showBtns, datas, template) {
//z.setModalSticky = function ($modal, onOff) {
//z.saveModal = function (modalId, sqlFile, sqlId, action, callbackFunc, msg) {
//z.hideModal = function (modalId) {

/* calendar *****************************************************************************************************************************/
//z.setCalendar = function (calendarId, sqlFile, sqlId, params, options) {
//z.selectCalendar = function (calendarId, maintainBaseDate) {
//z.getCalendarStartEnd = function (calendarId, data) {
//z.getCalendarExtendedProps = function (calendarId, info) {
//z.setCalendarExtendedProps = function (calendarId, info, extendedProps) {
//z.makeCalendar = function (calendarId, datas, headerRight, calendarBaseDate, view) {
//z.getCalendar = function (calendarId) {

/* datatable *****************************************************************************************************************************/
//z.datatableInit = function (options) {
//z.getSubDatatableInit = function (datatableId, options) {
//z.datatableHtmlRender = function (options) {
//z.setDatatableOptions = function (initOptions, options) {
//z.datatable = function (datatableId) {

/* callback *****************************************************************************************************************************/
function ziInit() {
	switch ( z.__LayoutDiv ) {
		case "basic":
//			$("#" + z.__Options.layout).remove();
			
			z.setSqlInfo(z.__Options.form, z.__Options.file, z.__Options.id, z.__Options.param, true);
			z.selectSql(z.__Options.form);
			break;
			
		case "accordions":
			
			break;
			
		case "datatable":
			z.__Options.datatable.layoutId      = z.__Options.layout;
			z.__Options.datatable.modalId       = z.__Options.form;
			z.__Options.datatable.sFile         = z.__Options.file;
			z.__Options.datatable.sId           = z.__Options.id;
			z.__Options.datatable.sParam        = z.__Options.param;
			z.__Options.datatable.button        = z.__Options.button;
			z.__Options.datatable.buttonIcon    = z.__Options.buttonIcon;
			z.__Options.datatable.rowButton     = z.__Options.rowButton;
			z.__Options.datatable.rowButtonIcon = z.__Options.rowButtonIcon;
			z.__Options.datatable.columns       = z.__Options.column;
			
			z.datatableInit(z.__Options.datatable);
			break;
	}
}

function ziRetrieve() {
	switch ( z.__LayoutDiv ) {
		case "basic":
			z.selectSql(z.__Options.form);
			break;
			
		case "accordions":
			
			break;
			
		case "datatable":
			z.datatable(z.__Options.datatable.datatableId).load();
			break;
	}
}

function ziSave() {
	switch ( z.__LayoutDiv ) {
		case "basic":
			z.save(z.__Options.form, true);
			break;
			
		case "accordions":
			
			break;
			
		case "datatable":
			
			break;
	}
}

function ziGetTemplateScript(template) {
	switch ( z.__LayoutDiv ) {
		case "basic":
			if ( template == z.__Options.form ) {
				if ( z.__Options.column && z.__Options.column.length ) {
					var templateHtml = [];
					
					templateHtml.push('<script type="text/x-handlebars-template" name="z-handlebars-template" id="' + template + '">\
											{{#each datas}}\
										<div class="' + template + ' z-kt-portlet" data-zc="z-kt-portlet">\
											<!--begin::card-->\
											<div class="z-card card card-custom gutter-b example example-compact">\
												<!--begin::card-header-->\
												<div class="z-card-header card-header">\
													<h3 class="card-title align-items-start flex-column">\
														<div class="symbol symbol-35 mt-4 mr-5">\
															<span class="z-symbol-label symbol-label">\
																<span class="z-svg-icon svg-icon svg-icon-lg svg-icon-success">\
																	<!--begin::Svg Icon | path:../../../../../metronic/themes/metronic/theme/html/demo1/dist/assets/media/svg/icons/Communication/Write.svg-->\
																	<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
																		<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
																			<rect x="0" y="0" width="24" height="24"></rect>\
																			<path d="M12.2674799,18.2323597 L12.0084872,5.45852451 C12.0004303,5.06114792 12.1504154,4.6768183 12.4255037,4.38993949 L15.0030167,1.70195304 L17.5910752,4.40093695 C17.8599071,4.6812911 18.0095067,5.05499603 18.0083938,5.44341307 L17.9718262,18.2062508 C17.9694575,19.0329966 17.2985816,19.701953 16.4718324,19.701953 L13.7671717,19.701953 C12.9505952,19.701953 12.2840328,19.0487684 12.2674799,18.2323597 Z" fill="#000000" fill-rule="nonzero" transform="translate(14.701953, 10.701953) rotate(-135.000000) translate(-14.701953, -10.701953)"></path>\
																			<path d="M12.9,2 C13.4522847,2 13.9,2.44771525 13.9,3 C13.9,3.55228475 13.4522847,4 12.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L12.9,2 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"></path>\
																		</g>\
																	</svg>\
																	<!--end::Svg Icon-->\
																</span>\
															</span>\
														</div>\
													</h3>\
													<div class="card-toolbar">\
														<div class="dropdown dropdown-inline" data-toggle="tooltip" data-placement="left">\
															<a href="javascript:;" class="btn btn-clean btn-hover-light-primary btn-sm btn-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
																<i class="ki ki-bold-more-ver"></i>\
															</a>\
															<div class="dropdown-menu dropdown-menu-md dropdown-menu-right">\
																<!--begin::Navigation-->\
																<ul class="navi navi-hover py-5">\
																	<li class="navi-item">\
																		<a href="javascript:;" class="navi-link">\
																			<span class="navi-icon">\
																				<i class="flaticon2-drop"></i>\
																			</span>\
																			<span class="navi-text">New Group</span>\
																		</a>\
																	</li>\
																</ul>\
															</div>\
														</div>\
														<a href="javascript:;" class="z-btn-hover-bg-danger btn btn-hover-bg-danger btn-text-danger btn-hover-text-white border-0 font-weight-bold mr-2">삭제</a>\
													</div>\
												</div>\
												<!--end::card-header-->\
												<!--begin::card-body-->\
												<div class="z-card-body card-body">\
													<div class="z-form-group form-group" data-zc="z-form-group">');
					
					templateHtml = templateHtml.concat(ziGetColumnHtml());
					
					templateHtml.push('				</div>\
												</div>\
												<!--end::card-body-->\
											</div>\
											<!--end::card-->\
										</div>\
											{{/each}}\
										</script>');
					
					var html = '';
					
					for ( var i = 0, ii = templateHtml.length; i < ii; i++ ) {
						if ( typeof templateHtml[i] == "string" ) {
							html += templateHtml[i] || '';
						}
						else {
							for ( var j = 0, jj = templateHtml[i].length; j < jj; j++ ) {
								html += templateHtml[i][j] || '';
							}
						}
					}
					
					return $(html).insertAfter("#" + z.__Options.layout);
				}
			}
			break;
			
		case "accordions":
			
			break;
			
		case "datatable":
			
			break;
	}
}

function ziGetModal(modalId) {
	switch ( z.__LayoutDiv ) {
		case "basic":
			
			break;
			
		case "accordions":
			
			break;
			
		case "datatable":
			if ( modalId == z.__Options.form ) {
				if ( z.__Options.column && z.__Options.column.length ) {
					var modalHtml = [];
					
					modalHtml.push('<div class="z-modal modal fade" id="' + modalId + '" tabindex="-1" role="dialog" aria-labelledby="checkHtmlModalLabel" aria-hidden="true">\
									    <div class="z-modal-dialog modal-dialog modal-xl" role="document">\
									        <div class="z-modal-content modal-content">\
									            <div class="z-modal-header modal-header">\
									                <h5 class="z-modal-title modal-title" id="' + modalId + '_title">' + z.__Options.datatable.title + '</h5>\
									                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
									                    <i aria-hidden="true" class="ki ki-close"></i>\
									                </button>\
									            </div>\
									            <div class="z-modal-body modal-body">\
									                <div id="' + modalId + '_content">\
														<div class="z-kt-portlet">\
															<div class="z-form-group form-group">');
					
					modalHtml = modalHtml.concat(ziGetColumnHtml());
					
					modalHtml.push('						</div>\
														</div>\
													</div>\
												</div>\
												<div class="z-modal-footer modal-footer">\
													<button type="button" class="z-modal-btn-update btn btn-success" onclick="zoDatatableSave(\'update\');">저장</button>\
													<button type="button" class="z-modal-btn-insert btn btn-success" onclick="zoDatatableSave(\'insert\');">저장</button>\
													<button type="button" class="z-modal-btn-delete btn btn-danger" onclick="zoDatatableSave(\'delete\');">삭제</button>\
													<button type="button" class="z-modal-btn-close btn btn-secondary" data-dismiss="modal">닫기</button>\
												</div>\
											</div>\
										</div>\
									</div>');
					
					var html = '';
					
					for ( var i = 0, ii = modalHtml.length; i < ii; i++ ) {
						if ( typeof modalHtml[i] == "string" ) {
							html += modalHtml[i] || '';
						}
						else {
							for ( var j = 0, jj = modalHtml[i].length; j < jj; j++ ) {
								html += modalHtml[i][j] || '';
							}
						}
					}
					
					return $(html).insertAfter("#" + z.__Options.layout);
				}
			}
			break;
	}
}

function ziGetColumnHtml (modalId) {
	switch ( z.__LayoutDiv ) {
		case "basic":
		case "accordions":
		case "datatable":
			var isBasic    = z.__LayoutDiv == "basic";
			var columnHtml = [];
			
			columnHtml.push([]);
			columnHtml.push('<div class="z-row row">');
			
			var columns = z.__Options.column;
			var group   = {};
			var colspan = 0;
			
			for ( var i = 0, ii = columns.length; i < ii; i++ ) {
				if ( columns[i].colspan == null ) {
					continue;
				}
				
				if ( columns[i].colspan == 0 ) {
					columnHtml[0].push('<input type="hidden" class="z-form-control form-control z-update" name="' + columns[i].field + '"' + (isBasic ? ' value="{{' + columns[i].field + '}}"' : '') + '>');
					continue;
				}
				
				var newRow = colspan == 12;
				
				if ( ! newRow && colspan + columns[i].colspan > 12 ) {
					newRow = ! columns[i].groupKey || (columns[i].groupKey && ! group[columns[i].groupKey] && colspan + columns[i].groupColspan > 12);
				}

				if ( newRow ) {
					colspan = 0;
					
					columnHtml.push('</div>\
									<div class="z-row row">');
				}
				
				switch ( columns[i].type ) {
					case "select":
						colspan += Math.abs(columns[i].colspan);
						columnHtml.push('<div class="z-col col-' + Math.abs(columns[i].colspan) + '">\
											<label for="" class="z-label" name="label_' + columns[i].field + '">' + columns[i].title + '</label>\
											<select class="z-form-control custom-select form-control z-update" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' data-selected="{{' + columns[i].field + '}}"' : '') + '></select>\
										</div>');
						break;
						
					case "text":
					case "search":
					case "password":
					case "number":
					case "date":
					case "month":
					case "time":
					case "color":
						colspan += Math.abs(columns[i].colspan);
						columnHtml.push('<div class="z-col col-' + Math.abs(columns[i].colspan) + '">\
											<label for="" class="z-label" name="label_' + columns[i].field + '">' + columns[i].title + '</label>\
											<input type="' + columns[i].type + '" class="z-form-control form-control z-update" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' value="{{' + columns[i].field + '}}"' : '') + '>\
										</div>');
						break;
						
					case "datetime":
						colspan += Math.abs(columns[i].colspan);
						columnHtml.push('<div class="z-col col-' + Math.abs(columns[i].colspan) + '">\
											<label for="" class="z-label" name="label_' + columns[i].field + '">' + columns[i].title + '</label>\
											<input type="datetime-local" class="z-form-control form-control z-update" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' value="{{' + columns[i].field + '}}"' : '') + '>\
										</div>');
						break;
						
					case "textarea":
						colspan += Math.abs(columns[i].colspan);
						columnHtml.push('<div class="z-col col-' + Math.abs(columns[i].colspan) + '">\
											<label for="" class="z-label" name="label_' + columns[i].field + '">' + columns[i].title + '</label>\
											<textarea class="z-form-control form-control z-update" rows="' + (columns[i].textareaRows || '3') + '" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' value="{{' + columns[i].field + '}}"' : '') + '></textarea>\
										</div>');
						break;
						
					case "group_text_button":
						colspan += Math.abs(columns[i].colspan);
						columnHtml.push('<div class="z-col col-' + Math.abs(columns[i].colspan) + '">\
											<label for="" class="z-label" name="label_' + columns[i].field + '">' + columns[i].title + '</label>\
											<div class="input-group">\
												<input type="text" class="z-form-control form-control z-update" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' value="{{' + columns[i].field + '}}"' : '') + '>\
												<div class="input-group-append">\
													<button class="btn btn-primary" type="button" onclick="zoDataTableModalBtnClick(\'' + modalId + '\', \'' + columns[i].field + '\');">' + (columns[i].groupBtnText || 'search') + '</button>\
												</div>\
											</div>\
										</div>');
						break;
						
					case "group_file_button":
						colspan += Math.abs(columns[i].colspan);
						columnHtml.push('<div class="z-col col-' + Math.abs(columns[i].colspan) + '">\
											<label for="" class="z-label" name="label_' + columns[i].field + '">' + columns[i].title + '</label>\
											<div class="custom-file">\
											  	<input type="file" class="z-form-control form-control custom-file-input z-update" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' value="{{' + columns[i].field + '}}"' : '') + '>\
											  	<label class="custom-file-label" for="customFile">' + (columns[i].groupBtnText || 'Choose file') + '</label>\
											</div>\
										</div>');
						break;
						
					case "group_text_3":
						if ( columns[i].groupKey && columns[i].groupColspan ) {
							if ( ! group[columns[i].groupKey] ) {
								colspan += Math.abs(columns[i].groupColspan);
								columnHtml.push('<div class="z-col col-' + Math.abs(columns[i].groupColspan) + '">\
													<label for="" class="z-label" name="label_' + columns[i].field + '">' + (columns[i].groupTitle || columns[i].title) + '</label>\
													<div class="input-group">');
								
								group[columns[i].groupKey] = {
									"htmlIdx"        : columnHtml.length,
									"groupColumnHtml": []
								};

								columnHtml.push( group[columns[i].groupKey].groupColumnHtml );
								columnHtml.push(	'</div>\
												</div>');
							}
							
							group[columns[i].groupKey].groupColumnHtml.push('<input type="text" class="z-form-control form-control z-update col-' + Math.abs(columns[i].colspan) + '" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' value="{{' + columns[i].field + '}}"' : '') + '>');
						}
						break;
						
					case "group_zipcode":
						if ( columns[i].groupKey && columns[i].groupColspan ) {
							if ( ! group[columns[i].groupKey] ) {
								colspan += Math.abs(columns[i].groupColspan);
								columnHtml.push('<div class="z-col col-' + Math.abs(columns[i].groupColspan) + '">\
													<label for="" class="z-label" name="label_' + columns[i].field + '">' + (columns[i].groupTitle || columns[i].title || '주소') + '</label>\
													<div class="input-group">');
								
								group[columns[i].groupKey] = {
									"htmlIdx"        : columnHtml.length,
									"groupColumnHtml": [
										'<input type="text" class="z-form-control form-control z-update col-' + Math.abs(columns[i].colspan) + '" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' value="{{' + columns[i].field + '}}"' : '') + '>\
										<div class="input-group-append">\
  											<button class="btn btn-primary" type="button" onclick="zoDataTableModalBtnClick(\'' + modalId + '\', \'' + columns[i].field + '\');">' + (columns[i].groupBtnText || 'search') + '</button>\
										</div>'
									]
								};
								
								columnHtml.push( group[columns[i].groupKey].groupColumnHtml );
								columnHtml.push(	'</div>\
												</div>');
							}
							else {
								group[columns[i].groupKey].groupColumnHtml.push('<input type="text" class="z-form-control form-control z-update col-' + Math.abs(columns[i].colspan) + '" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' value="{{' + columns[i].field + '}}"' : '') + '>');
							}
						}
						break;
					
					case "checkbox":
					case "checkbox_primary":
						colspan += Math.abs(columns[i].colspan);
						columnHtml.push('<div class="z-col col-' + Math.abs(columns[i].colspan) + '">\
											<label for="" class="z-label" name="label_' + columns[i].field + '"></label>\
											<div class="checkbox-inline">\
												<label class="z-form-control z-checkbox checkbox checkbox-primary">\
													<input type="checkbox" class="z-form-control form-control z-update" checked="" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' data-checked="{{' + columns[i].field + '}}"' : '') + '><span></span>' + columns[i].title + '\
												</label>\
											</div>\
										</div>');
						break;
						
					case "checkbox_success":
						colspan += Math.abs(columns[i].colspan);
						columnHtml.push('<div class="z-col col-' + Math.abs(columns[i].colspan) + '">\
											<label for="" class="z-label" name="label_' + columns[i].field + '"></label>\
											<div class="checkbox-inline">\
												<label class="z-form-control z-checkbox checkbox checkbox-success">\
													<input type="checkbox" class="z-form-control form-control z-update" checked="" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' data-checked="{{' + columns[i].field + '}}"' : '') + '><span></span>' + columns[i].title + '\
												</label>\
											</div>\
										</div>');
						break;
						
					case "checkbox_info":
						colspan += Math.abs(columns[i].colspan);
						columnHtml.push('<div class="z-col col-' + Math.abs(columns[i].colspan) + '">\
											<label for="" class="z-label" name="label_' + columns[i].field + '"></label>\
											<div class="checkbox-inline">\
												<label class="z-form-control z-checkbox checkbox checkbox-info">\
													<input type="checkbox" class="z-form-control form-control z-update" checked="" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' data-checked="{{' + columns[i].field + '}}"' : '') + '><span></span>' + columns[i].title + '\
												</label>\
											</div>\
										</div>');
						break;
						
					case "checkbox_warning":
						colspan += Math.abs(columns[i].colspan);
						columnHtml.push('<div class="z-col col-' + Math.abs(columns[i].colspan) + '">\
											<label for="" class="z-label" name="label_' + columns[i].field + '"></label>\
											<div class="checkbox-inline">\
												<label class="z-form-control z-checkbox checkbox checkbox-warning">\
													<input type="checkbox" class="z-form-control form-control z-update" checked="" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' data-checked="{{' + columns[i].field + '}}"' : '') + '><span></span>' + columns[i].title + '\
												</label>\
											</div>\
										</div>');
						break;
						
					case "checkbox_danger":
						colspan += Math.abs(columns[i].colspan);
						columnHtml.push('<div class="z-col col-' + Math.abs(columns[i].colspan) + '">\
											<label for="" class="z-label" name="label_' + columns[i].field + '"></label>\
											<div class="checkbox-inline">\
												<label class="z-form-control z-checkbox checkbox checkbox-danger">\
													<input type="checkbox" class="z-form-control form-control z-update" checked="" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' data-checked="{{' + columns[i].field + '}}"' : '') + '><span></span>' + columns[i].title + '\
												</label>\
											</div>\
										</div>');
						break;
						
					case "checkbox_dark":
						colspan += Math.abs(columns[i].colspan);
						columnHtml.push('<div class="z-col col-' + Math.abs(columns[i].colspan) + '">\
											<label for="" class="z-label" name="label_' + columns[i].field + '"></label>\
											<div class="checkbox-inline">\
												<label class="z-form-control z-checkbox checkbox checkbox-dark">\
													<input type="checkbox" class="z-form-control form-control z-update" checked="" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' data-checked="{{' + columns[i].field + '}}"' : '') + '><span></span>' + columns[i].title + '\
												</label>\
											</div>\
										</div>');
						break;
						
					case "radio_primary":
						colspan += Math.abs(columns[i].colspan);
						columnHtml.push('<div class="z-col col-' + Math.abs(columns[i].colspan) + '">\
											<label for="" class="z-label" name="label_' + columns[i].field + '"></label>\
											<div class="radio-inline">\
												<label class="z-form-control z-radio radio radio-primary">\
													<input type="radio" class="z-form-control form-control z-update" checked="" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' data-checked="{{' + columns[i].field + '}}"' : '') + '><span></span>' + columns[i].title + '\
												</label>\
											</div>\
										</div>');
						break;
						
					case "radio_success":
						colspan += Math.abs(columns[i].colspan);
						columnHtml.push('<div class="z-col col-' + Math.abs(columns[i].colspan) + '">\
											<label for="" class="z-label" name="label_' + columns[i].field + '"></label>\
											<div class="radio-inline">\
												<label class="z-form-control z-radio radio radio-success">\
													<input type="radio" class="z-form-control form-control z-update" checked="" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' data-checked="{{' + columns[i].field + '}}"' : '') + '><span></span>' + columns[i].title + '\
												</label>\
											</div>\
										</div>');
						break;
				
					case "radio_info":
						colspan += Math.abs(columns[i].colspan);
						columnHtml.push('<div class="z-col col-' + Math.abs(columns[i].colspan) + '">\
											<label for="" class="z-label" name="label_' + columns[i].field + '"></label>\
											<div class="radio-inline">\
												<label class="z-form-control z-radio radio radio-info">\
													<input type="radio" class="z-form-control form-control z-update" checked="" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' data-checked="{{' + columns[i].field + '}}"' : '') + '><span></span>' + columns[i].title + '\
												</label>\
											</div>\
										</div>');
						break;
						
					case "radio_warning":
						colspan += Math.abs(columns[i].colspan);
						columnHtml.push('<div class="z-col col-' + Math.abs(columns[i].colspan) + '">\
											<label for="" class="z-label" name="label_' + columns[i].field + '"></label>\
											<div class="radio-inline">\
												<label class="z-form-control z-radio radio radio-warning">\
													<input type="radio" class="z-form-control form-control z-update" checked="" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' data-checked="{{' + columns[i].field + '}}"' : '') + '><span></span>' + columns[i].title + '\
												</label>\
											</div>\
										</div>');
						break;
				
					case "radio_danger":
						colspan += Math.abs(columns[i].colspan);
						columnHtml.push('<div class="z-col col-' + Math.abs(columns[i].colspan) + '">\
											<label for="" class="z-label" name="label_' + columns[i].field + '"></label>\
											<div class="radio-inline">\
												<label class="z-form-control z-radio radio radio-danger">\
													<input type="radio" class="z-form-control form-control z-update" checked="" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' data-checked="{{' + columns[i].field + '}}"' : '') + '><span></span>' + columns[i].title + '\
												</label>\
											</div>\
										</div>');
						break;
				
					case "radio_dark":
						colspan += Math.abs(columns[i].colspan);
						columnHtml.push('<div class="z-col col-' + Math.abs(columns[i].colspan) + '">\
											<label for="" class="z-label" name="label_' + columns[i].field + '"></label>\
											<div class="radio-inline">\
												<label class="z-form-control z-radio radio radio-dark">\
													<input type="radio" class="z-form-control form-control z-update" checked="" name="' + columns[i].field + '"' + (columns[i].readonly ? ' readonly' : '') + (columns[i].disabled ? ' disabled' : '') + '' + (isBasic ? ' data-checked="{{' + columns[i].field + '}}"' : '') + '><span></span>' + columns[i].title + '\
												</label>\
											</div>\
										</div>');
						break;
				}
				
				if ( columns[i].colspan < 0 ) {
					colspan = 12;
				}
			}
			
			columnHtml.push('</div>');
			
			return columnHtml;
			break;
	}
}
