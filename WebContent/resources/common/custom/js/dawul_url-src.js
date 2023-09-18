//var jUrl = "http://222.239.253.12:8000/MapAppServer/DWService";
//var jUrl = "http://192.168.100.198:7070/MapAppServer/DWService";
//var jUrl = "http://vapi.dawulmap.com:8000/MapAppServer/DWService";
//var jUrl = "https://vapi.dawulmap.com:8443/MapAppServer/DWService";
//var jUrl = "http://192.168.100.211:8070/MapAppServer/DWService";
//var jUrl = "http://222.239.253.19:8000/MapAppServer/DWService";
//var jUrl = "http://222.239.253.23:8000/MapAppServer/DWService";
//var jUrl = "http://222.239.253.24:8000/MapAppServer/DWService";
//var jUrl = "http://192.168.100.9:8000/MapAppServer/DWService";
var jUrl = "https://rmap.r114.com:8000/MapAppServer/DWService";
//var key = "c507f63d67f91877e3b93ee816838b3302c3cce6";
var key = "14cc08123cd6d425d603917caf3ee061895e4192";
var jHeader = {
	"format":"JSON",
	"key":key,
	"serviceName":null
};

var geoBody = { // 지오코딩 body
	"crs":"GRS_80",
	"fulladdress":null,
	"addressType":"HLS",
	"selectFields":{
		"geoType":null
	},
	"reqLang":"KOR",
	"resLang":"KOR"
};

var revBody = { // 리버스 지오코딩 body
	"crs":"GRS_80",
	"point":null,
	"adminType":null,
	"spatialOperation":null,   //INTERSECT , NEARBY
	"selectFields":{
		"geoType":null
	},
	"reqLang":"KOR",
	"resLang":"KOR"
};

var subBody = { // 서브 지오코딩 body
	"crs":"GRS_80",
	"code":null,
	"adminType":null,
	"selectFields":{
		"geoType":null
	},
	"page":{
		"cnt":null,
		"pageNo":null
	},
	"reqLang":"KOR",
	"resLang":"KOR"
};


var poiBody = { // POI body
	"crs":"GRS_80",
	"fulltext":null,
	"admin":"",
	"reqLang":"KOR",
	"resLang":"KOR"
};

var extBody = { // extension body
	"crs":"UTMK",
	"conditions":{
		"geometry":{
			"spatialOp":"INTERSECT"
		}
	},
	"selectFields":{
		"geoType":null
	},
	"contentName":null
};


var naviBody = {
	"middlePoint":[],
	"mileage":{
		"normalWayFuel":1570,
		"fuelCost":15,
		"highWayFuel":15
	},
	"endPoint":{
		"coordinate":null
	},
	"exception":null,
	"pathFindType":null,
	"middlePointAutoOrder":null,
	"startPoint":{
		"coordinate":null
	},
	"netMethod":"JNI",
	"reqLang":"KOR",
	"resLang":"KOR"
};


var naviConstantBody = {
	"name":[
		"facilityType",
		"roadType",
		"linkType",
		"guideType",
		"guideTypeHighway"
	]
};