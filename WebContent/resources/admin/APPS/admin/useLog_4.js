'use strict';
// Class definition

var KTDatatableUserLog4 = function() {
	 // Private functions

	 // demo initializer
	 var demo = function() {

		var dateStart = $('.dateStart').val();
		var today = $('.dateEnd').val();
		z.setValue('dateStart',dateStart);
		z.setValue('dateEnd', today);
			
	 	var dataJSONArray = z.xA("Admin", "zeons_주요다운로드메뉴", "select", {'dateStart' : dateStart, 'dateEnd' : today}, "json2");
	 	var length = dataJSONArray.length;

	 
		$('.maxMenu').html(dataJSONArray[0].주요다운로드);
		$('.maxCount').html(dataJSONArray[0].클릭수);
		$('.minMenu').html(dataJSONArray[length-1].주요다운로드);
		$('.minCount').html(dataJSONArray[length-1].클릭수);
	 	
	     var datatable = $('#kt_datatable').KTDatatable({
	         // datasource definition
	         data: {
	             type: 'local',
	             source: dataJSONArray,
	             pageSize: 10,
	         },

	         // layout definition
	         layout: {
	             scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
	             // height: 450, // datatable's body's fixed height
	             footer: false, // display/hide footer
	         },

	         // column sorting
	         sortable: true,

	         pagination: true,

	         toolbar: {
	             items: {
	                 info: false,
	             }
	         },

	         search: {
	             input: $('#kt_datatable_search_query'),
	             key: 'generalSearch'
	         },

	         // columns definition
	         columns: [{
	             field: '주요다운로드',
	             title: '주요다운로드',
	             width: 100,
	             textAlign: 'center',
	         }, {
	             field: '클릭수',
	             title: '클릭수',
	             width: 50,
	             type: 'number',
	             textAlign: 'center',
	         }],
	     });

	 };

	 return {
	     // Public functions
	     init: function() {
	         // init dmeo
	         demo();
	     },
	 };
	}();

	jQuery(document).ready(function() {
		
		
		defaultDate();
		
		KTDatatableUserLog4.init();

		
	});

function defaultDate(){
	var dateStart = z.getValue("dateStart");
	var dateEnd = z.getValue("dateEnd");
	
	$('.dateStart').datepicker('setDate', dateStart);
	$('.dateEnd').datepicker('setDate', dateEnd);
	
	
}

function dateSearch(){
	$('#kt_datatable').KTDatatable().destroy();
	KTDatatableUserLog4.init();

}

function userCount(){
	
	z.setValue("checkDate", "Y");
	z.menuLink("MA0603");
}

function menuCount(){
	z.menuLink("MA060303");
}
function searchCount(){
	z.menuLink("MA060306");
}
function downloadCount(){
	z.menuLink("MA060309");
}
