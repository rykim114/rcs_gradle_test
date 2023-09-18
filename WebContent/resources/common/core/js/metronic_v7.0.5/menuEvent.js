
/**
 * @author sanggyu.lee(zeons)
 */
/* search left *****************************************************************************************************************************/
z.setSearchChangeEvent = function ($element) {
	$element.off("change").on("change", function () {
		if ( this.type == "select-one" ) {
			if ( z.__SearchSelectBox[this.id] && z.__SearchSelectBox[this.id]["childNames"] ) {
				var childName;
				
				for ( var i = 0, ii = z.__SearchSelectBox[this.id]["childNames"].length; i < ii; i++ ) {
					childName = z.__SearchSelectBox[this.id]["childNames"][i];
					
					z.setSearchSelectBox(z.__SearchSelectBox[childName].label, childName, z.__SearchSelectBox[childName].all, z.__SearchSelectBox[childName].event, z.__SearchSelectBox[childName].sqlFile, z.__SearchSelectBox[childName].sqlId, z.__SearchSelectBox[childName].params, null);
					
					$("#kt_content_web_header_main_search #" + childName).val( $("#kt_content_web_header_main_search #" + childName).eq(0).val() );
				}
			}
		}
		
		zoRetrieve();
	});
}

z.setMenuChangeEvent = function ($element) {
	$element.off("change").on("change", function () {
		if ( this.type == "select-one" ) {
			if ( z.__MenuSelectBox[this.id] && z.__MenuSelectBox[this.id]["childNames"] ) {
				var childName;
				
				for ( var i = 0, ii = z.__MenuSelectBox[this.id]["childNames"].length; i < ii; i++ ) {
					childName = z.__MenuSelectBox[this.id]["childNames"][i];

					z.setMenuSelectBox(z.__MenuSelectBox[childName].label, childName, z.__MenuSelectBox[childName].all, z.__MenuSelectBox[childName].event, z.__MenuSelectBox[childName].sqlFile, z.__MenuSelectBox[childName].sqlId, z.__MenuSelectBox[childName].params, null, z.__MenuSelectBox[childName].all, z.__MenuSelectBox[childName].event);
					
					$("#kt_content_web_header_main_buttons #" + childName).val( $("#kt_content_web_header_main_buttons #" + childName).eq(0).val() );
				}
			}
		}
	});
}

z.setSearchKeyDownEvent = function ($element) {
	$element.off("keydown").on("keydown", function (e) {
		if ( e.keyCode == 13 ) {
			e.preventDefault();
			zoRetrieve();
		}
	});
}

/* search right *****************************************************************************************************************************/
z.setMainSearchEvent = function () {
	$("#main_search_key_word").off("keydown").on("keydown", function (e) {
		if ( e.keyCode == 13 ) {
			e.preventDefault();
			zoRetrieve();
		}
	})
	.off("change").on("change", function (e) {
		zoRetrieve();
	});
}

z.setMainBtnEvent = function (action) {
	$("#kt_subheader .z-main-btn-save").off("click").on("click", function () {
		zoSave(z.__SqlInfo["mainTemplate"]);
	});
	
	$("#kt_subheader .z-main-btn-retrieve").off("click").on("click", function () {
		zoRetrieve(z.__SqlInfo["mainTemplate"]);
	});
	
	$("#kt_subheader .z-main-btn-insert").off("click").on("click", function () {
		
	});
	
	$("#kt_subheader .z-main-btn-append").off("click").on("click", function () {
		if ( zoAppend(z.__SqlInfo["mainTemplate"]) ) {
			if ( z.__SqlInfo && z.__SqlInfo[ z.__SqlInfo["mainTemplate"] ] ) {
				var jsonList = {};
				jsonList.datas = JSON.parse(JSON.stringify([{}]));
				var template   = Handlebars.compile($("#" + z.__SqlInfo["mainTemplate"]).html());
				
				$("#kt_content_web_content").prepend(template(jsonList));
				
				var $newPortlet = $("#kt_content_web_content").children(".z-kt-portlet:first");
				
				$newPortlet.find(".z-svg-icon").removeClass("svg-icon-success").addClass("svg-icon-info").addClass("z-state-i");
				
				z.selectBoxRender(z.__SqlInfo["mainTemplate"], $newPortlet[0]);
				
				z.setFormEvent($newPortlet[0]);

				$newPortlet.find(".z-form-control.z-custom-select").each(function () {
					z.setChildSelectBox($newPortlet[0].classList[0], this);
				});
				
				if ( z.__DefaultValue[ $newPortlet[0].classList[0] ] ) {
					$newPortlet.find(".z-form-control").each(function () {
						var defaultValue = z.__DefaultValue[ $newPortlet[0].classList[0] ][this.name];
						
						if ( defaultValue ) {
							if ( typeof defaultValue === "object" ) {
								z.setTypeValue($(this), z.getTypeValue(defaultValue));
							}
							else if ( typeof defaultValue === "string" ) {
								z.setTypeValue($(this), defaultValue);
							}
						}
					});
				}
				
				z.setNotNullLabelColor(z.__SqlInfo["mainTemplate"], $newPortlet[0]);
				
				$newPortlet.find(".z-card-header").addClass("z-border-info").find(".symbol-label .svg-icon").removeClass("svg-icon-success").addClass("svg-icon-info");
				
				$(window).scrollTop(0);
				
				zoAppendAfter(z.__SqlInfo["mainTemplate"], $newPortlet[0]);
			}
		}
	});
	
	$("#kt_subheader .z-main-btn-duplicate").off("click").on("click", function () {
		
	});
	
	$("#kt_subheader .z-main-btn-delete").off("click").on("click", function () {
		
	});
	
	$("#kt_subheader .z-main-btn-print").off("click").on("click", function () {
		
	});
	
	$("#kt_subheader .z-main-btn-excel").off("click").on("click", function () {
		
	});
	
	$("#kt_subheader .z-main-btn-close").off("click").on("click", function () {
		
	});
}

/* form *****************************************************************************************************************************/
z.setFormEvent = function (element) {
	z.setFormChangeEvent(element);
	z.setFormChangeEventSelectBox(element);
	z.setFormClickEvent(element);
}

z.setFormChangeEvent = function (element) {
	// input value change
	$(element).find(".z-form-control").not("label,.z-custom-select").off("change").on("change", function () {
		var $this         = $(this);
		var $z_kt_portlet = $this.closest(".z-kt-portlet");
		var $ktBadge      = $z_kt_portlet.find(".z-svg-icon");
		
		if ( $ktBadge.hasClass("svg-icon-success") ) {
			$ktBadge.removeClass("svg-icon-success").addClass("svg-icon-warning").addClass("z-state-u");

			$z_kt_portlet.find(".z-card-header").addClass("z-border-warning");
		}
		else if ( $ktBadge.hasClass("svg-icon-warning") ) {
			
		}
		else if ( $ktBadge.hasClass("svg-icon-danger") ) {
			return;
		}
		
		var template = $z_kt_portlet[0].classList[0];
		
		if ( z.__DupCheck[template] && z.__DupCheck[template].indexOf(this.name) != -1 ) {
			z.checkDupValue(".z-kt-portlet." + template, [this.name]);
		} else {
			var $feedbackParent = $this.removeClass("is-invalid").closest("div");
			
			if ( ! $feedbackParent.find(".is-invalid").length ) {
				$feedbackParent.find(".invalid-feedback").remove();
			}
		}
		
		if ( this.type == "checkbox" ) {
			$this.data("checked", this.checked ? "Y" : "N");
		}
		
		var valueInfo = z.setAndGetFormControlChangedValue(this);
		
		zoFormControlChanged(this, this.name, valueInfo.new, valueInfo.old);
	});
}

z.setFormChangeEventSelectBox = function (element) {
	// input value change
	$(element).find(".z-form-control.z-custom-select").off("change").on("change", function () {
		var $this         = $(this);
		var $z_kt_portlet = $this.closest(".z-kt-portlet");
		var $ktBadge      = $z_kt_portlet.find(".z-svg-icon");
		
		if ( $ktBadge.hasClass("svg-icon-success") ) {
			$ktBadge.removeClass("svg-icon-success").addClass("svg-icon-warning").addClass("z-state-u");

			$z_kt_portlet.find(".z-card-header").addClass("z-border-warning");
		}
		else if ( $ktBadge.hasClass("svg-icon-warning") ) {
			
		}
		else if ( $ktBadge.hasClass("svg-icon-danger") ) {
			return;
		}
		
		var template = $z_kt_portlet[0].classList[0];
		
		if ( z.__DupCheck[template] && z.__DupCheck[template].indexOf(this.name) != -1 ) {
			z.checkDupValue(".z-kt-portlet." + template, [this.name]);
		} else {
			var $feedbackParent = $this.removeClass("is-invalid").closest("div");
			
			if ( ! $feedbackParent.find(".is-invalid").length ) {
				$feedbackParent.find(".invalid-feedback").remove();
			}
		}
		
		if ( this.type == "select-one" ) {
			z.setChildSelectBox(template, this);
		}
		
		var valueInfo = z.setAndGetFormControlChangedValue(this);
		
		zoFormControlChanged(this, this.name, valueInfo.new, valueInfo.old);
	});
}

z.setChildSelectBox = function (template, element) {
	var $ele          = $(element);
	var $z_kt_portlet = $ele.closest(".z-kt-portlet");
	var name          = element.name;
	
	if ( z.__SelectBox[template] && z.__SelectBox[template][name] && z.__SelectBox[template][name]["childNames"] ) {
		var childName;
		
		for ( var i = 0, ii = z.__SelectBox[template][name]["childNames"].length; i < ii; i++ ) {
			childName = z.__SelectBox[template][name]["childNames"][i];
			
			z.setSelectBox(template, childName, z.__SelectBox[template][childName].sqlFile, z.__SelectBox[template][childName].sqlId, z.__SelectBox[template][childName].params, null, null, $z_kt_portlet);
			
			z.selectBoxRender(template, $z_kt_portlet[0], childName);
			
			$z_kt_portlet.find("select[name=" + childName + "]")[0].value = "";
			
			var $feedbackParent = $z_kt_portlet.find("[name=" + childName + "]").removeClass("is-invalid").closest("div");
			
			if ( ! $feedbackParent.find(".is-invalid").length ) {
				$feedbackParent.find(".invalid-feedback").remove();
			}
		}
	}
}

z.setFormClickEvent = function (element) {
	// delete button click
	$(element).find(".z-card-header .z-btn-hover-bg-danger").off("click").on("click", function () {
		var $z_kt_portlet = $(this).closest(".z-kt-portlet");
		
		if ( zoDelete($z_kt_portlet[0].classList[0], $z_kt_portlet[0]) ) {
			$z_kt_portlet.find(".z-card-header").removeClass("z-border-warning").removeClass("z-border-info").addClass("z-border-danger");
			
			var $ktBadge = $z_kt_portlet.find(".z-svg-icon");
			
			if ( $ktBadge.hasClass("svg-icon-success") ) {
				$ktBadge.removeClass("svg-icon-success").addClass("svg-icon-danger").addClass("z-state-d");
			}
			else if ( $ktBadge.hasClass("svg-icon-info") ) {
				$z_kt_portlet.remove();
			}
			else if ( $ktBadge.hasClass("svg-icon-warning") ) {
				$ktBadge.removeClass("svg-icon-warning").removeClass("z-state-u").addClass("svg-icon-danger").addClass("z-state-d");
			}
			else if ( $ktBadge.hasClass("svg-icon-danger") ) {
				
			}
			
			var $feedbackParent = $z_kt_portlet.find(".is-invalid").removeClass("is-invalid").closest("div");
			
			if ( ! $feedbackParent.find(".is-invalid").length ) {
				$feedbackParent.find(".invalid-feedback").remove();
			}
			
			$z_kt_portlet.find(".z-form-control").prop("disabled", true);
		}
	});
}

z.setAndGetFormControlChangedValue = function (element) {
	var valueInfo = {};
	
	if ( this.type == "select-one" ) {
		valueInfo.new = element.value;
		valueInfo.old = $(element).data("oldValue");
	}
	else if ( this.type == "checkbox" ) {
		valueInfo.new = element.checked ? "Y" : "N";
		valueInfo.old = $(element).data("oldValue");
	}
	else {
		valueInfo.new = element.value;
		valueInfo.old = $(element).data("oldValue");
	}
	
	$(element).data("oldValue", valueInfo.new);
	
	return valueInfo;
}

/* modal *****************************************************************************************************************************/
z.setModalBtnEvent = function (modalId) {
	$("#" + modalId + " .z-modal-btn-save").off("click").on("click", function () {
		zoSave(z.__ModalTemplate[modalId] || modalId);
	});
	
	$("#" + modalId + " .z-modal-btn-retrieve").off("click").on("click", function () {
		zoRetrieve(z.__ModalTemplate[modalId] || modalId);
	});
	
	$("#" + modalId + " .z-modal-btn-insert").off("click").on("click", function () {
		
	});
	
	$("#" + modalId + " .z-modal-btn-append").off("click").on("click", function () {
		if ( zoAppend(z.__ModalTemplate[modalId] || modalId) ) {
			if ( z.__SqlInfo && z.__SqlInfo[z.__ModalTemplate[modalId]] ) {
				var jsonList = {};
				jsonList.datas = JSON.parse(JSON.stringify([{}]));
				var template   = Handlebars.compile($("#" + z.__ModalTemplate[modalId]).html());
				
				var $contentId = $("#" + z.__SqlInfo[ z.__ModalTemplate[modalId] ]["contentId"]);
				
				$contentId.prepend(template(jsonList));
				
				var $newPortlet = $contentId.children(".z-kt-portlet:first");
				
				$newPortlet.find(".z-svg-icon").removeClass("svg-icon-success").addClass("svg-icon-info").addClass("z-state-i");
				
				z.selectBoxRender(z.__ModalTemplate[modalId], $newPortlet[0]);
				
				z.setFormEvent($newPortlet[0]);

				$newPortlet.find(".z-form-control.z-custom-select").each(function () {
					z.setChildSelectBox($newPortlet[0].classList[0], this);
				});
				
				if ( z.__DefaultValue[ $newPortlet[0].classList[0] ] ) {
					$newPortlet.find(".z-form-control").each(function () {
						var defaultValue = z.__DefaultValue[ $newPortlet[0].classList[0] ][this.name];
						
						if ( defaultValue ) {
							if ( typeof defaultValue === "object" ) {
								z.setTypeValue($(this), z.getTypeValue(defaultValue));
							}
							else if ( typeof defaultValue === "string" ) {
								z.setTypeValue($(this), defaultValue);
							}
						}
					});
				}
				
				z.setNotNullLabelColor(z.__ModalTemplate[modalId], $newPortlet[0]);
				
				$newPortlet.find(".z-card-header").addClass("z-border-info");
				
				$(window).scrollTop(0);
				
				zoAppendAfter(z.__ModalTemplate[modalId] || modalId, $newPortlet[0]);
			}
		}
	});
	
	$("#" + modalId + " .z-modal-btn-duplicate").off("click").on("click", function () {
		
	});
	
	$("#" + modalId + " .z-modal-btn-delete").off("click").on("click", function () {
		
	});
	
	$("#" + modalId + " .z-modal-btn-print").off("click").on("click", function () {
		
	});
	
	$("#" + modalId + " .z-modal-btn-excel").off("click").on("click", function () {
		
	});
	
	$("#" + modalId + " .z-modal-btn-close").off("click").on("click", function () {
		
	});
}

/* calendar form *****************************************************************************************************************************/
// 사용안함 삭제예정
z.setCalendarFormEvent = function (calendarId) {
	$("." + calendarId).find(".z-form-control").not("label").change(function () {
		
	});
}