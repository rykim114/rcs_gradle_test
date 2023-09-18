var DW = DW || {};

DW.ToolTipCreater = L.Class.extend({
	initialize: function(data){
		this.data = data;
		this.tipType = 'BASIC';
	},
	nullAndZeroTo: function(value, type){
		if(value == "null" || value == null || value == "0" || value == 0)
			//value = "<font style='color:gray;'>  </font>";
			value = "";
		if(isNaN(parseInt(value)))
			return (type == 'link' && value != "") ? "<a href='#' onclick=javascript:window.open(\"" + value + "\");>바로가기</a>" : value;
		else if(type=='height')
			return this.toComma(value)+"m";
		else
		    return this.toComma(value);
	},
	toComma: function(value){
		var reg = /(^[+-]?\d+)(\d{3})/; // 정규식
		value += '';                    // 숫자를 문자열로 변환
		while (reg.test(value)){
		    value = value.replace(reg, '$1' + ',' + '$2');
		}
		
		return value;		
	},
	lfNmFormat: function(lfNm){
		lfNm = lfNm.split("|");
		var result_ = "";
		for(var i=0; i<lfNm.length; i++){
		   result_ += lfNm[i];
		   //if(i < lfNm.length - 2)
		   if(i < lfNm.length - 1) /** 200131_JIK_수정 - 상세검색 > 붙혀쓰기 **/
			   result_ += " > ";
		}
		
		return result_;
	},
	toLink : function(url){
		result_ = "";
		var urlP = url.split("/");
		var linkName = urlP[2];
		
		result_ = "<a href='" + url + "' style='hover:red;link:green;actived:green'>" + linkName + "</a>";
		
		if(linkName == undefined)
			result_ = "";
		
		return result_;
	},
	makeGeoContent: function(feature){  //주소 툴팁 레이아웃
		var middleCnt = middleCoords.size();
		if(middleNames.get("middleInput0")==null) {
			middleCnt = 0;
		}else if(middleNames.get("middleInput1")==null) {
			middleCnt = 1;
		}else if(middleNames.get("middleInput2")==null) {
			middleCnt = 2;
		}else if(middleNames.get("middleInput3")==null) {
			middleCnt = 3;
		}else if(middleNames.get("middleInput4")==null) {
			middleCnt = 4;
		}
		
		var coords = centerCoord("GRS_80",feature.geometry);
		var properties = feature.properties;
		
		var resKey = new Array(); // 결과값 키값
		var resVal = new Array(); // 결과값 value
		
		for ( var key in properties) {
			resKey.push(key);
			resVal.push(properties[key]);
		}
	    var content1 = "";
		var content2 = "";
		var content3 = "";
		var content4 = "";
		var content5 = "";
	    var adminType = "";
	    var addrType = properties.type; // 어떤 주소인지 판별
	    if(addrType == "sido" || addrType == "gu" || addrType == "li") {
	    	content1 = this.nullAndZeroTo(properties.name);
	    	if(properties.code.length==2) {
	    		adminType = "SIDO";
	    	}else if(properties.code.length==5) {
	    		adminType = "SIGUNGU";
	    	}
	    }else if(addrType == "road") {
	    	content1 = this.nullAndZeroTo(properties.name);
	    	adminType = "ROAD";
	    }else if(addrType == "ldong" || addrType == "hdong") {
	    	content1 = this.nullAndZeroTo(properties.name);
	    	//동적 다국어 변경
			if(lan=="KOR") {
				content2 = "관련주소 : ";
			}else if(lan=="ENG") {
				content2 = "Related address : ";
			}else if(lan=="JAN") {
				content2 = "関連住所 : ";
			}else if(lan=="CHINAG") {
				content2 = "关联地址 : ";
			}
	    	if(properties.hcodename!=undefined) {
	    		if(properties.hcodename!="") {
	    			content2 += this.nullAndZeroTo(properties.hcodename);
	    		}else {
	    			content2 = "";	
	    		}
				adminType = "LDONG";
			}else {
				if(properties.lcodename!="") {
					content2 += this.nullAndZeroTo(properties.lcodename);	
				}else {
					content2 = "";
				}
				adminType = "HDONG";
			}
	    }else if(addrType == "jijuk") {
	    	content1 = this.nullAndZeroTo(properties.pnuname);
	    	var data = properties.newrpnuname.split("|");
	    	var roadAddr = "";
			for(var i=0; i<data.length; i++) {
				var data2 = data[i].split(" ");
				roadAddr += this.nullAndZeroTo(data[i]).replace(data2[0]+" "+data2[1], "");
				if(i!=data.length-1) {
					roadAddr += ",";
				}
			}
			//동적 다국어 변경
			if(lan=="KOR") {
				content2 = "도로명 : ";
			}else if(lan=="ENG") {
				content2 = "Road name address : ";
			}else if(lan=="JAN") {
				content2 = "道路名 : ";
			}else if(lan=="CHINAG") {
				content2 = "道路名 : ";
			}
			content2 += roadAddr;
			adminType = "JIBUN_ADDRESS";
			
			content5 = feature.gridAddress; /** 190829_JIK **/
	    }else if(addrType == "build") {
	    	content1 = this.nullAndZeroTo(properties.newrpnuname);
			var data = properties.pnuname.split("|");
			var jibunAddr = "";
			for(var i=0; i<data.length; i++) {
				var data2 = data[i].split(" ");
				jibunAddr += this.nullAndZeroTo(data[i]).replace(data2[0]+" "+data2[1], "");
				if(i!=data.length-1) {
					jibunAddr += ",";
				}
			}
			//동적 다국어 변경
			if(lan=="KOR") {
				content2 = "지번 : ";
				content3 = this.nullAndZeroTo(properties.buildname);
			}else if(lan=="ENG") {
				content2 = "Lot number : ";
			}else if(lan=="JAN") {
				content2 = "地番 : ";
			}else if(lan=="CHINAG") {
				content2 = "地番 : ";
			}
			content2 += jibunAddr;
			adminType = "ROAD_ADDRESS";
			
			content5 = feature.gridAddress; /** 190829_JIK **/
	    }
	    
	    //동적 다국어 변경
		var startStr = "";
		var middleStr = "";
		var endStr = "";
		var mapCopyStr = "";
		var mapPrintStr = "";
		var expansionStr = "";
		if(lan=="KOR") {
			startStr = "출발";
			middleStr = "경유";
			endStr = "도착";
			mapCopyStr = "지도복사";
			mapPrintStr = "인쇄";
			expansionStr = "확대";
		}else if(lan=="ENG") {
			startStr = "Start";
			middleStr = "Via";
			endStr = "Arrive";
			mapCopyStr = "Map copy";
			mapPrintStr = "Print";
			expansionStr = "Expansion";
		}else if(lan=="JAN") {
			startStr = "出発";
			middleStr = "経由";
			endStr = "到着";
			mapCopyStr = "地図コピー";
			mapPrintStr = "印刷";
			expansionStr = "拡大";
		}else if(lan=="CHINAG") {
			startStr = "出发";
			middleStr = "经由";
			endStr = "到着";
			mapCopyStr = "地图复制";
			mapPrintStr = "印刷";
			expansionStr = "扩大";
		}
				

	    var html_  = "";
	    var prop=" lat='" + ls_lng + "' " 
				+" lng='"+ ls_lat + "' "
				+" pnu='0' "
				+" xy='"+ ls_lat + ls_lng +"' "
				+" z_status='건물' ";
	    
		/*html_ += '<div class="tooltip t_size">';*/		
		html_ = "<div class='flag flag-building map-info-popup cursor-pointer mapInfo1' style='width:50px; margin:auto;'>";
		html_ += "<label><em>건물</em></label>";		
		html_ += "<div class='flag-body' onclick=getPnu(this) "+ prop + ">";
		html_ += "<strong>사용승인일</strong>";
		html_ += "<span id='g_wdate'>-</span>";
		html_ += "</div>";
		
		html_ += "<div class='z_leaflet-popup' id='building'>";
		html_ += "<div class='z_leaflet-popup-content'>";
		html_ += "<div class='z_leaflet-content-box'>";
		html_ += "<div class='z_leaflet-header'>";
		html_ += "<h3 id='building_text'>-</h3>";
		html_ += "<strong id='y_사용승인일'>사용승인일 : <span></span></strong>";
		html_ += "</div>";
		html_ += "<div class='leaflet-body scroll building_append' data-scroll='true' data-height='155' data-mobile-height='155' style='height:155px;'>";
		html_ += "</div>";
		
		html_ += "<div class='z_leaflet-footer'>";
		html_ += "<button type='button' class='btn btn-outline-secondary btn-lg px-11 font-weight-bold' id='mapInfo1'>더보기</button>";
		html_ += "</div>";
		html_ += "</div>";
		html_ += "<div class='t_arrow'></div>";
		html_ += "</div>";
		html_ += "<button class='z_leaflet-popup-close-button'><i class='ki ki-close'></i></button>";
		html_ += "</div>";		
		html_ += "</div>";
		
	    
		return html_;
		
/*		KTUtil.scrollInit($('.building_append')[0], {
			mobileNativeScroll: true,
			handleWindowResize: true
		});*/
	},
	makePOIContent: function(feature,tooltipIconImg){  //POI 툴팁 레이아웃
		var middleCnt = middleCoords.size();
		if(middleNames.get("middleInput0")==null) {
			middleCnt = 0;
		}else if(middleNames.get("middleInput1")==null) {
			middleCnt = 1;
		}else if(middleNames.get("middleInput2")==null) {
			middleCnt = 2;
		}else if(middleNames.get("middleInput3")==null) {
			middleCnt = 3;
		}else if(middleNames.get("middleInput4")==null) {
			middleCnt = 4;
		}
		var coords = feature.geometry.coordinates;
		var properties = feature.properties;
		var detailUrl = "./detailInfo.jsp?lan="+lan+"&stType=poi&code="+properties.mid;
		var name = this.nullAndZeroTo(properties.name);
		var sv_cls = this.lfNmFormat(this.nullAndZeroTo(properties.sv_cls));
		var newrpnuname = this.nullAndZeroTo(properties.newrpnuname);
		//동적 다국어 변경
		var pnuname = "";
		if(lan=="KOR") {
			pnuname = "지번 : ";
		}else if(lan=="ENG") {
			pnuname = "Lot number : ";
		}else if(lan=="JAN") {
			pnuname = "地番 : ";
		}else if(lan=="CHINAG") {
			pnuname = "地番 : ";
		}
		pnuname += this.nullAndZeroTo(properties.pnuname);
		var c_tel = this.nullAndZeroTo(properties.c_tel);
		if(c_tel!="") {
			if(lan!="KOR") {
				c_tel = "82)"+c_tel;
			}
		}
		var c_url = properties.c_url;
		var c_grd_flr = this.nullAndZeroTo(properties.c_grd_flr);
		
		if(c_tel!="" && c_url!="") {
			c_tel+= " /";
		}
		
		//동적 다국어 변경
		var startStr = "";
		var middleStr = "";
		var endStr = "";
		var mapCopyStr = "";
		var mapPrintStr = "";
		var expansionStr = "";
		var detailViewStr = ""; 
		if(lan=="KOR") {
			startStr = "출발";
			middleStr = "경유";
			endStr = "도착";
			mapCopyStr = "지도복사";
			mapPrintStr = "인쇄";
			expansionStr = "확대";
			detailViewStr = "상세보기";
		}else if(lan=="ENG") {
			startStr = "Start";
			middleStr = "Via";
			endStr = "Arrive";
			mapCopyStr = "Map copy";
			mapPrintStr = "Print";
			expansionStr = "Expansion";
			detailViewStr = "View details";
		}else if(lan=="JAN") {
			startStr = "出発";
			middleStr = "経由";
			endStr = "到着";
			mapCopyStr = "地図コピー";
			mapPrintStr = "印刷";
			expansionStr = "拡大";
			detailViewStr = "詳細表示";
		}else if(lan=="CHINAG") {
			startStr = "出发";
			middleStr = "经由";
			endStr = "到着";
			mapCopyStr = "地图复制";
			mapPrintStr = "印刷";
			expansionStr = "扩大";
			detailViewStr = "查看详细";
		}
		var html_  = "";
		html_ += '<div class="tooltip t_size">';
		html_ += '<div class="t_bx">';
		html_ += '<div class="info i_size clear">';
		html_ += '<h3 class="clear">';
		if(tooltipIconImg!=undefined && tooltipIconImg!="") {
			html_ += '<span class="num"><img src="'+tooltipIconImg+'" width="22" height="22" alt="" /></span>';
			if(tooltipIconImg.indexOf("poi")!=-1) {
				html_ += '<span class="title2">'+name+'</span>';
			}else {
				html_ += '<span class="title">'+name+'</span>';
			}
		}else {
			html_ += '<span class="title">'+name+'</span>';
		}
		html_ += '</h3>';
		html_ += '<ul class="con">';
		if(newrpnuname!="") {
			html_ += '<li class="txt">'+newrpnuname+'</li>';
		}
		if(pnuname!="") {
			html_ += '<li class="txt2">'+pnuname+'</li>';
		}
		if(sv_cls!="") {
			html_ += '<li class="txt2">'+sv_cls+'</li>';
		}
		if(c_tel!="" && c_url!="") {
			html_ += '<li class="txt3">';
			if(c_tel!="") {
				html_ += '<span>'+c_tel+'</span>';
			}
			if(c_url!="") {
				html_ += '<a href="'+c_url+'" target="_blank"> '+c_url+'</a>';
			}
		}
		html_ += '</li>';
		html_ += '</ul>';
		html_ += '<!-- 상세보기 버튼 --><div class="t_btn clear"><span class="fl btn_C"><a href="#" onclick="window.open(\''+detailUrl+'\', \'상세정보\', \'scrollbars=yes,width=788,height=750,top=50,left=900,resizable=yes,location=no\');">'+detailViewStr+'</a></span></div>';
		html_ += '<ul class="t_btn2 clear">';
		name = name.replace(/'/g,"\\'");
		html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'startInput\','+coords[0]+','+coords[1]+',\''+name+'\');">'+startStr+'</a></li>';
		html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'middleInput'+middleCnt+'\','+coords[0]+','+coords[1]+',\''+name+'\');">'+middleStr+'</a></li>';
		html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'endInput\','+coords[0]+','+coords[1]+',\''+name+'\');">'+endStr+'</a></li>';
		html_ += '</ul>';
		html_ += '<ul class="t_btn3 clear">';
		html_ += '<li class="btn_B"><a href="#" onclick="outLink(\'poi\',\''+properties.mid+'\');">'+mapCopyStr+'</a></li>';
		html_ += '<li class="btn_B"><a href="#" onclick="printMap(\'poi\',\''+properties.mid+'\');">'+mapPrintStr+'</a></li>';
		html_ += '<li class="btn_B"><a href="#" onclick="onExpand('+coords[0]+','+coords[1]+');">'+expansionStr+'</a></li>';
		html_ += '</ul>';
		html_ += '</div>';
		html_ += '</div>';
		html_ += '<div class="t_arrow"></div>';
		html_ += '<!-- 닫기 버튼 --><div class="t_close"><span><a href="#" onclick="tooltipClose();"></a></span></div>';
		html_ += '</div>';
		return html_;
	},
	themeContent: function(feature,type,tooltipIconImg){
		var middleCnt = middleCoords.size();
		if(middleNames.get("middleInput0")==null) {
			middleCnt = 0;
		}else if(middleNames.get("middleInput1")==null) {
			middleCnt = 1;
		}else if(middleNames.get("middleInput2")==null) {
			middleCnt = 2;
		}else if(middleNames.get("middleInput3")==null) {
			middleCnt = 3;
		}else if(middleNames.get("middleInput4")==null) {
			middleCnt = 4;
		}
		var data = feature.properties;
		var detailUrl;
		var content1="";
		var content2="";
		var content3="";
		var content4="";
		var content5="";
		var content6="";
		var content7="";
		var x_pos = "";
		var y_pos = "";
		if(data.x!="" && data.y!="") {
			x_pos = data.x;
			y_pos = data.y;	
		}else {
			x_pos = data.x_pos;
			y_pos = data.y_pos;
		}
		var p = Coord_Trans("utmktowgs", new PT(x_pos,y_pos));
		var contentName = tree_content_name[type];
		var themeName = tree_flag_name[type];
		if(type==0) {  //아파트
			mImg = "./img/apt3.png";
			
		    //detailUrl = "./aptInfo.php?landnum=" + data.apt_id;
			detailUrl = "http://www.dawulmap.com/aptInfo.php?landnum=" + data.apt_id;
		    var dong_cnt="";
			var families="";
		    if(data.dong_cnt=="" || data.dong_cnt=="-2147483648")
		    {
		    	dong_cnt="";
		    }else
		    {
		    	dong_cnt=data.dong_cnt + "동 ";
		    }	
		    if(data.families=="" || data.families=="-2147483648")
		    {
		    	families="";
		    }else
		    {
		    	families=this.nullAndZeroTo(data.families) + "세대";
		    }	
		    
		    content1 = this.nullAndZeroTo(data.apt_nm);
			content2 = this.nullAndZeroTo(data.do_nm + " " + data.si_nm + " " + data.dong_nm + " " + (data.ri_nm == null? "":data.ri_nm));
			if(dong_cnt!="" || families!="")
			{	
				content3 = " 단지규모 : " + dong_cnt + families;
			}
			if(data.living_date!="")
			{
				content4 = " 입주시기 : " + (data.living_date);
			}
			if(data.comp_date!="")
			{	
				content5 = " 완공일 : " + (data.comp_date);
			}
			if(data.const_co!="")
			{
				content6 = " 시공사 : " + this.nullAndZeroTo(data.const_co);
			}
			content7 = this.nullAndZeroTo("");
			//themeIcon = "./img/dw_map_themebt03.png";
			detailInfo = "아파트정보";
		}else if(type==1) {  //개발지구
			//포팅시 URL 수정
			detailUrl = "./landPlanInfo.php?landnum=" + data.jigu_id;
			//detailUrl = "./landPlanInfo.jsp?landnum=" + data.jigu_id;
			//detailUrl = "http://222.239.253.18/dawulmap/landPlanInfo.php?landnum=" + data.jigu_id;
			//detailUrl = "http://www.dawulmap.com/landPlanInfo.php?landnum=" + data.jigu_id;
			var jigu_pop2="";
		    var jigu_area="";
		    if(data.jigu_pop=="-2147483648" || data.jigu_pop=="" || data.jigu_pop=="0")
		    {
		    	jigu_pop2="";
		    }else
		    {
		    	jigu_pop2 = this.nullAndZeroTo(data.jigu_pop) + "명";
		    }
		    if(data.jigu_area=="NaN" || data.jigu_area=="" || data.jigu_area=="0.0")
		    {
		    	jigu_area="";
		    	jigu_area2="";
		    }else
		    {
		    	jigu_area=this.nullAndZeroTo(data.jigu_area) + "㎡";
		    	jigu_area2="    ("+this.nullAndZeroTo((data.jigu_area/0.3025).toFixed(1))+"평)";
		    }
		    
		    content1 = this.nullAndZeroTo(data.jigu_nm);
			content2 = this.nullAndZeroTo(data.jigu_pos);
			if(data.jigu_type2!="")
			{	
				content3 = "단계 : "+this.nullAndZeroTo(data.jigu_type2);
			}
			if(data.jigu_type1!="")
			{	
				content4 = "개발명 : "+this.nullAndZeroTo(data.jigu_type1);
			}
			if(jigu_pop2!="")
			{	
				content5 = "수용인구 : " + jigu_pop2;
			}
			if(jigu_area!="")
			{	
				content6 = "지구면적 : " + jigu_area + jigu_area2;
			}
			content7 = "";
			detailInfo = "토지계획정보";
		}else if(type==2) {  //실내지도
			detailUrl = "./detailInfo.jsp?stType=2&code="+data.ufid;
			if(data.img_url!="" && data.img_url!=null) {	
				mImg = data.img_url;
			}
			content1 = this.nullAndZeroTo(data.ushop_name) + ((data.grp_name != null && data.grp_name != "") ? "(" + data.grp_name + ")" : "");
			content2 = this.nullAndZeroTo(data.addr);
			if(data.main_shop!="") {
				content3 = " 품목 : " + this.nullAndZeroTo(data.main_shop);
			}
			if(data.open_time!="") {
				content4 = " 운영시간 : " + this.nullAndZeroTo(data.open_time);
			}
			if(data.surr_trans!="") {
				content5 = " 연계교통 : " + this.nullAndZeroTo(data.surr_trans);
			}
			if(data.tel!="") {
				content6 = " 전화 : " + this.nullAndZeroTo(data.tel);
			}
			if(data.holi_date!="") {
				content7 = " 휴점일 : " + this.nullAndZeroTo(data.holi_date);
			}
			detailInfo = "실내지도정보";
		}else if(type==3) {  //핫플레이스
			detailUrl = "./detailInfo.jsp?stType=16&code=" + data.c_hotplace_id; 
			content1 = this.nullAndZeroTo(data.poi_nm);
			content2 = this.nullAndZeroTo(data.addr);
			if(data.theme!="")
			{	
				content3 = " 분류 : " + this.nullAndZeroTo(data.theme);
			}
			if(data.description!="")
			{	
				content4 = " 요약정보 : " + this.nullAndZeroTo(data.description);
			}
			if(data.url_main!="")
			{	
				content5 = " 사이트 : " + this.nullAndZeroTo(data.url_main, 'link');
			}
			content6 = "";
			content7 = "";
			//themeIcon = "./img/dw_map_themebt02.png";
			detailInfo = "HotPlace정보";
		}

		var html_  = "";
		html_ += '<div class="tooltip t_size">';
		html_ += '<div class="t_bx">';
		html_ += '<div class="info i_size clear">';
		html_ += '<h3 class="clear">';
		if(tooltipIconImg!=undefined && tooltipIconImg!="") {
			html_ += '<span class="num"><img src="'+tooltipIconImg+'" width="22" height="22" alt="" /></span>';
		}
		html_ += '<span class="title">'+content1+'</span>';
		html_ += '</h3>';
		html_ += '<ul class="con">';
		html_ += '<li class="txt">'+content2+'</li>';
		if(content3!="") {
			html_ += '<li class="txt2">'+content3+'</li>';
		}
		if(content4!="") {
			html_ += '<li class="txt2">'+content4+'</li>';
		}
		if(content5!="") {
			html_ += '<li class="txt2">'+content5+'</li>';
		}
		if(content6!="") {
			html_ += '<li class="txt2">'+content6+'</li>';
		}
		if(content7!="") {
			html_ += '<li class="txt2">'+content7+'</li>';
		}
		html_ += '</ul>';
		if(lan=="KOR") {
			if(type!=1) {
				html_ += '<!-- 상세보기 버튼 --><div class="t_btn clear"><span class="fl btn_C"><a href="#" onClick="window.open(\''+detailUrl+'\', \'상세정보\' ,\'scrollbars=yes,width=788,height=750,top=50,left=900,resizable=yes,location=no\');">상세보기</a></span></div>';
			}else {
				html_ += '<!-- 상세보기 버튼 --><div class="t_btn clear"><span class="fl btn_C"><a href="#" onClick="window.open(\''+detailUrl+'\', \'상세정보\' ,\'scrollbars=yes,width=900,height=880,top=50,left=900,resizable=yes,location=no\');">상세보기</a></span></div>';
			}
		}
		html_ += '<ul class="t_btn2 clear">';
		content1 = content1.replace(/'/g,"\\'");
		html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'startInput\','+p.y+','+p.x+',\''+content1+'\');">출발</a></li>';
		html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'middleInput'+middleCnt+'\','+p.y+','+p.x+',\''+content1+'\');">경유</a></li>';
		html_ += '<li class="btn_B"><a href="#" onclick="naviChoice(\'endInput\','+p.y+','+p.x+',\''+content1+'\');">도착</a></li>';
		html_ += '</ul>';
		html_ += '<ul class="t_btn3 clear">';
		html_ += '<li class="btn_B"><a href="#" onclick="outLink(\'theme\',\''+eval("data."+themeName)+'\','+type+');">지도복사</a></li>';
		html_ += '<li class="btn_B"><a href="#" onclick="printMap(\'theme\',\''+eval("data."+themeName)+'\','+type+');">인쇄</a></li>';
		html_ += '<li class="btn_B"><a href="#" onclick="onExpand('+p.y+','+p.x+');">확대</a></li>';
		html_ += '</ul>';
		html_ += '</div>';
		html_ += '</div>';
		html_ += '<div class="t_arrow"></div>';
		html_ += '<!-- 닫기 버튼 --><div class="t_close"><span><a href="#" onclick="tooltipClose();"></a></span></div>';
		html_ += '</div>';
		return html_;
	},
	naviContent: function(type,data){
		html_ = '';
		html_ += '<div class="tooltip t_size">';
		html_ += '<div class="t_bx">';
		html_ += '<div class="info i_size3">';
		if("naviResult"==type) {
			var properties = data.properties;
			var guideType = carRouteContent.get("guideType_"+properties.guide_type);
			var crossWayName = properties.cross_way_name;
			var dist = properties.distance;
			if(dist>=1000) {
				dist = toComma((dist/1000).toFixed(2))+"km";
			}else {
				dist = toComma(dist)+"m";
			}
			if(guideType!=null) {
				if(crossWayName!="" && lan=="KOR") {
					html_ += '<p class="txt3">'+crossWayName+'에서 '+guideType+' 후 '+dist+' 이동</p>';
				}else {
					if(lan=="KOR") {
						html_ += '<p class="txt3">'+guideType+' 후 '+dist+' 이동</p>';
					}else if(lan=="ENG") {
						html_ += '<p class="txt3">'+guideType+' after '+dist+'</p>';
					}else if(lan=="JAN") {
						html_ += '<p class="txt3">'+guideType+' 後 '+dist+' 移動</p>';
					}else if(lan=="CHINAG") {
						html_ += '<p class="txt3">'+guideType+' 后 '+dist+' 移动</p>';
					}
				}
				//html_ += '<h4>'+guideType+'<h4>';
			}else {
				if(lan=="KOR") {
					html_ += '<p class="txt3">'+dist+' 이동</p>';
				}else if(lan=="ENG") {
					html_ += '<p class="txt3">'+dist+'</p>';
				}else if(lan=="JAN") {
					html_ += '<p class="txt3">'+dist+' 移動</p>';
				}else if(lan=="CHINAG") {
					html_ += '<p class="txt3">'+dist+' 移动</p>';
				}
			}
		}else {
			html_ += '<h4>'+data+'</h4>';
		}
		
		html_ += '</div>';
		html_ += '</div>';
		html_ += '<div class="t_arrow"></div>';
		html_ += '<!-- 닫기 버튼 --><div class="t_close"><span><a href="#" onclick="tooltipClose();"></a></span></div>';
		html_ += '</div>';
		return html_;
	}		
});
