﻿﻿
/**
 * @author sanggyu.lee(zeons)
 */
var z  = {};
var zo = {};

// '.','/','-',',' 문자제거
z.strPurify = function (a_str, a_ch) {
    if ( a_ch == "" || a_ch == null ) {
        return z.strPurify(z.strPurify(z.strPurify(z.strPurify(String(a_str), "."), "/"), "-"), ",");
    }

    var v_ret = a_str;
	 var v_i = 0;

    while ( v_ret.indexOf(a_ch) != -1 ) {
        v_i = v_ret.indexOf(a_ch);
        v_ret = v_ret.substr(0,v_i) + v_ret.substr(v_i+1,v_ret.length-v_i) ;
    }

    return v_ret;
};

// 문자열 양쪽의 whitespace를 모두 제거
z.trim = function(str) {
	if (!str||typeof(str)!="string")
		return str; //입력값 없는 경우는 Pass
	else
		return str.replace(/^\s*/ ,"").replace(/\s*$/ ,"");
};

// 문자열 왼쪽의 whitespace를 모두 제거
z.lTrim = function (str) {
	if (!str||typeof(str)!="string")
		return str; //입력값 없는 경우는 Pass
	else
		return str.replace(/^\s*/,"");
};

// 문자열 오른쪽의 whitespace를 모두 제거
z.rTrim = function (str) {
	if (!str||typeof(str)!="string")
		return str; //입력값 없는 경우는 Pass
	else
		return str.replace(/\s*$/,"");
};

z.pad = function (psStr, piLen, psSeed, psTag) {
	var sRtnStr = String(psStr);

	psSeed = String(psSeed);
	if (z.ByteLen(psSeed) != 1) return sRtnStr;

	for (var i = 0; i < (piLen - z.ByteLen(String(psStr))); i++) {
	  sRtnStr = (psTag=='left' ? psSeed + sRtnStr : sRtnStr + psSeed);
	}

	return sRtnStr;
};

// 문자열의 정해진 길이만큼 왼쪽 부분을 특정한 문자로 채워서 반환
z.lPad = function (psStr, piLen, psSeed) {
	if(psSeed==null) psSeed='0';
	return z.pad(psStr, piLen, psSeed, 'left');
};

// 문자열의 정해진 길이만큼 오른쪽 부분을 특정한 문자로 채워서 반환
z.rPad = function (psStr, piLen, psSeed) {
	if(psSeed==null) psSeed='0';
	return z.pad(psStr, piLen, psSeed, 'right');
};

//문자열의 Byte 수를 구한다.
z.getByteLen = function (bstr) {
	len = bstr.length;
	for (var i=0; i<bstr.length; i++){
	 xx = bstr.substr(i,1).charCodeAt(0);
	 if (xx > 127) { len++; }
	}
	return len;
};

// 왼쪽 문자열 자르기
z.getLeft = function(str, n){
	if (n <= 0)
	  return "";
	else if (n > String(str).length)
	  return str;
	else
	  return String(str).substring(0,n);
};
// 오른쪽 문자열 자르기
z.getRight = function(str, n){
  if (n <= 0)
     return "";
  else if (n > String(str).length)
     return str;
  else {
     var iLen = String(str).length;
     return String(str).substring(iLen, iLen - n);
  }
};

// 스트링의 문자열을 주어진 문자열로 변경
z.getReplaceString = function(a_str,a_old,a_new) {
    if (!a_str) return "";
    if (!a_old) return a_str;
    if (!a_new) a_new = "";

		var temp = a_str.split(a_old);
		return temp.join(a_new);
};

// 문자열 중간의 공백 제거
z.getClearSpaces = function (str) {
	var newStr = "";
	for (var i=0; i< str.length; i++) {
		 if ( (str.charAt(i) != " ") && (str.charAt(i) != " ") ) {
			newStr = newStr + str.charAt(i);
		 }
	}
	return newStr;
};

// 문자열 앞에 0을 제거
z.getClearZero = function (a_str) {
  a_str = String(a_str);
  if (a_str.charAt(0)!="0") return a_str;
  var pos = 0;
  for (var i = 1; i< a_str.length; i++) {
    if (a_str.charAt(i) != "0") {
      pos = i;
      break;
    }
  }
  return a_str.substring(pos, a_str.length);
};

// 수치금액을 한글로
z.getKoreanNumber = function (ad_num) {
	if(typeof(ad_num)!="number" || ad_num==null || ad_num=='') return '';
	var i, li_len, li_mod;
	var ls_num, ls_return = "", ls_temp = "";
	var ls_str  = new Array();
	var ls_UNIT = new Array('천','백','십','조','천','백','십','억','천','백','십','만','천','백','십','');
	var NUM     = new Array('','일','이','삼','사','오','육','칠','팔','구');

	if (ad_num < 0) {
		ad_num = - ad_num;
		ls_return = '-';
	}

	ls_num = z.trim(String(Math.round(ad_num)));

	if (ls_num=="") return "";

	li_len = ls_num.length;
	if (li_len>16) {
		// _X.MBox("금액범위 초과",'[' + ls_num +"]<BR>금액이 너무 큽니다. 확인 바랍니다." );
		return ls_num;
	}

	for (i=0;i<li_len;i++) ls_str[i] = ls_num.substr(i,1);

	for (i=0;i<li_len;i++) {
		if (ls_str[i]=="0")
			ls_str[i] = "";
		else
			ls_str[i] = NUM[z.toInt(ls_str[i])];
	}

	for (i=0;i<li_len;i++) {
		li_mod = 16 - li_len + i;
		if (li_mod==16 || li_mod==12 || li_mod==8 || li_mod==4 || li_mod==0) {
			 if ((ls_str[i]) != "" || li_mod==3 || li_mod==7 || li_mod==11 || li_mod==15) {
				 ls_return += ls_str[i] + ls_UNIT[li_mod];
		    }
			 ls_temp = "";
		}
		 else {
			ls_temp += ls_str[i];
			if (ls_str[i]!="" || li_mod==3 || li_mod==7 || li_mod==11 || li_mod==15) {
		 	 	ls_return += ls_str[i] + ls_UNIT[li_mod];
		 	}
		}
	}

	return ls_return;
};

// date object 반환
z.getNewDate = function (a_date) {
	var newDate = new Date(a_date.getFullYear(), a_date.getMonth(), a_date.getDate(), a_date.getHours(), a_date.getMinutes(), a_date.getSeconds());
	return newDate;
};

// 지정일자부터 n일자 이후의 날짜
z.getRelativeDate = function (a_date, n) {
	var newdate =(typeof(a_date)=="string" ? z.toDate(a_date) : z.getNewDate(a_date));
	newdate.setDate(newdate.getDate() + n);

	return (typeof(a_date)=="string" ? z.toString(newdate): newdate);
};

// 지정일자부터 n월 이후의 날짜
z.getRelativeMonth = function (a_date, n) {
	var newdate =(typeof(a_date)=="string" ? z.toDate(a_date): z.NewDate(a_date));
	newdate.setMonth(newdate.getMonth() + n);

	return (typeof(a_date)=="string" ? z.toString(newdate): newdate);
};

// 지정일자의 다음일자
z.getNextDate = function (a_date) {
	return z.getRelativeDate(a_date, 1);
};

// 날짜사이의 간격
z.getDaysAfter = function (a_date1, a_date2) {
	var newdate1 = (typeof(a_date1)=="string" ? z.toDate(a_date1) : a_date1);
	var newdate2 = (typeof(a_date2)=="string" ? z.toDate(a_date2) : a_date2);

	return parseInt((newdate2 - newdate1) / 86400000, 10);
};

// 마지막일자
z.getLastDate = function (a_date) {
  var ls_date = (typeof(a_date)=="string" ? a_date : z.toString(a_date));
  var ls_yyyy = ls_date.substr(0,4);
  var ls_mm   = ls_date.substr(4,2);
  var ls_dd;

  var li_yyyy = z.toInt(ls_yyyy);
  var li_mm   = z.toInt(ls_mm);

  switch (li_mm) {
        case 2:
        	  ls_dd=(z.isLeap(li_yyyy) ? '29' : '28');
	        break;
        case 4:
        case 6:
        case 9:
        case 11: ls_dd='30'; break;
        default: ls_dd='31';
    }
	return (typeof(a_date)=="string" ? ls_yyyy + ls_mm + ls_dd : z.toDate(ls_yyyy + ls_mm + ls_dd));
};

// 한글요일
z.getDayName = function (dateStr) {
	var dayIndex = (typeof(dateStr)=="string"?z.toDate(dateStr).getDay():dateStr.getDay());
	switch(dayIndex){
		case 0: return '일';
		case 1: return '월';
		case 2: return '화';
		case 3: return '수';
		case 4: return '목';
		case 5: return '금';
		case 6: return '토';
	}
	return '';
};

//서버 시간
z.getSysDate = function () {
	return z.xA("Comm", "SysDate_Pg", "select")[0][0];
};


/* to *****************************************************************************************************************************/

// 배열을 문자열로 변경
z.arrayToString = z.getArrayToString = function(a_arr, colSepa) {
	if(colSepa==null) colSepa=_Col_Separate;

	if(a_arr==null) return;
	
	/*json 처리 일때는 배열처리 하지 않아야 한다 */
	if (a_arr[0] == "{" ) return a_arr;
	 
		
	var rtVal = "";
	for(var i=0; i<a_arr.length; i++)
	{
		rtVal += (i==0 ? "" : colSepa) + a_arr[i] + "";
	}
	return rtVal;
};

// 문자열을 숫자로
z.toInt = z.stringToInt = function(a_str) {
	if (a_str==null || a_str=="") return 0;
	if (typeof(a_str)=="string"){
		a_str = z.getReplaceString(z.getReplaceString(z.getReplaceString(z.getReplaceString(a_str,' ', ''),'!',''),'px',''),',','');
		if (isNaN(a_str)) return 0;
		if (a_str.charAt(0)!="0") return parseInt(a_str);
	}
	var rtValue = parseInt(z.getClearZero(a_str));
	return isNaN(rtValue) ? 0 : rtValue;
};

//1234567 -> 1,234,567 로 변경
z.toComma = z.numberToComma = function (num, len, comma, zerotonull, removezero) {
	if (num === "" || isNaN(num)) {
	 return "";
	}
	
	 if (zerotonull !==null && zerotonull && num==0) {
	   return "";
	 }
	
	var currency = "",
	   snum = num + "",
	   l, r;
	
	if (snum.indexOf(".") !== -1) {
	 l = snum.split(".")[0] || "0";
	 r = snum.split(".")[1];
	} else {
	 l = parseInt(num, 10) + "";
	 r = "";
	}
	
	if (len > 0) {
	 if (r.length > len) {
	   r = r.substring(0, len);
	 } else {
	   r = z.rPad(r, len, "0");
	 }
	 r = "." + r;
	}
	else {
	 r = "";
	}
	
	while (!comma && l.length > 3) {
	 currency = "," + l.substr(l.length - 3, 3) + currency;
	 l = l.substring(0, l.length - 3);
	}
	
	var retVal = l + currency + r;
	
	if ( retVal.substring(0, 1) == "." ) {
		retVal = "0" + retVal;
	}
	
	retVal = retVal.replace("-,", "-").replace("-.", "-0.");
	
	if(removezero !==null && removezero){
	 if(retVal.indexOf(".")>0 && parseInt(retVal)==parseFloat(retVal)){
	  retVal = retVal.substr(0,retVal.indexOf("."));
	 }
	}
	return retVal;
}

// Date변수를 String변수로 변환
z.toString = z.dateToString = function (a_date, a_format) {
	if (a_date==null)	return null;
	if (typeof(a_date)=="number") return String(a_date);
	if (a_format==null) a_format = 'yyyymmdd';
	if (typeof(a_date)=="date") a_date=a_date;
	if (typeof(a_date)=="string" && a_format == 'yyyy-mm' ) a_date=z.toDate( String(a_date) + '01');
	if (typeof(a_date)=="string" && a_format != 'yyyy-mm') a_date=z.toDate(a_date);
	if(a_date==null) return null;
	var ls_yyyy	= "" + (a_date.getYear() + (a_date.getYear() < 1000 ? 1900 : 0));
	var ls_yy   = ls_yyyy.substr(2,2);
	var ls_mm	= ((a_date.getMonth()+1)<10 ? "0" : "") + (a_date.getMonth()+1);
	var ls_dd	= (a_date.getDate()<10 ? "0" : "") + a_date.getDate();
	var ls_hh	= (a_date.getHours()<10 ? "0" : "") + a_date.getHours();
	var ls_mi	= (a_date.getMinutes()<10 ? "0" : "") + a_date.getMinutes();
	var ls_ss	= (a_date.getSeconds()<10 ? "0" : "") + a_date.getSeconds();
	return a_format.toLowerCase().replace("yyyy",ls_yyyy).replace("yy",ls_yy).replace("mm",ls_mm).replace("dd",ls_dd).replace("hh",ls_hh).replace("mi",ls_mi).replace("ss",ls_ss);
};

// String을 Date Object로 변환
z.toDate = z.stringToDate = function (dateStr) {
	if (dateStr==null) return null;
	var	li_yyyy, li_mm, li_dd, li_hh=0, li_mi=0, li_ss=0;

	if(dateStr.length==8) {
		li_yyyy = z.toInt(dateStr.substr(0,4));
		li_mm	= z.toInt(dateStr.substr(4,2));
		li_dd	= z.toInt(dateStr.substr(6,2));
	} else if(dateStr.length==10) {
		li_yyyy = z.toInt(dateStr.substr(0,4));
		li_mm	= z.toInt(dateStr.substr(5,2));
		li_dd	= z.toInt(dateStr.substr(8,2));
	} else if(dateStr.length>10) {
		li_yyyy = z.toInt(dateStr.substr(0,4));
		li_mm	= z.toInt(dateStr.substr(5,2));
		li_dd	= z.toInt(dateStr.substr(8,2));
		li_hh	= z.toInt(dateStr.substr(11,2));
		li_mi	= z.toInt(dateStr.substr(14,2));
		li_ss	= z.toInt(dateStr.substr(17,2));
	} else {
		return null;
	}

	return (new Date(li_yyyy, li_mm -1, li_dd, li_hh, li_mi, li_ss));
};


/* is *****************************************************************************************************************************/
//윤년체크
z.isLeap = function (year) {
	return ((year%4 == 0 && year%100 != 0) || year%400 == 0);
};


/* check *****************************************************************************************************************************/
//숫자길이와 소숫점길이 체크
z.checkLengthPoint = function(a_value, a_len, a_po){
	if(typeof(a_value) == "number"){
		a_value = z.trim(String(a_value));
	}else{
		a_value = z.trim(a_value);
	}
	
	if(a_value.substring(0, 1) == "-") a_value = a_value.substring(1);

	if(a_po == null) a_po = 0;

	if(a_po == 0){

		if(a_value.indexOf('.') != -1){
			// _X.MBox('확인','소숫점은 입력할 수 없습니다.');
			return false;
		}else{
			if(a_len < a_value.length){
				// _X.MBox('확인','숫자열 길이가 '+ a_len+' 보다 같거나 작아야 합니다.');
				return false;
			}
		}
	}else{
		if(a_value.indexOf('.') == -1){
			var num = a_value;
		  var numPoint = "";
		}else{
			var num = a_value.substring(0, a_value.indexOf('.'));
		  var numPoint = a_value.substring(a_value.indexOf('.')+1, a_value.length);
		}

	  if(a_len < num.length){
			// _X.MBox('확인','숫자열 길이가 '+ a_len+' 보다 같거나 작아야 합니다.');
			return false;
		}
		if(a_po < numPoint.length){
			// _X.MBox('확인','소숫점 길이가 '+ a_po+' 보다 같거나 작아야 합니다.');
			return false;
		}
	}

	return true;
}

// date 유효성 검사
z.checkDate = function (as_date) {
	if(as_date==null||z.trim(as_date)=="") return true;
	as_date = z.strPurify(as_date);
	var lb_result=true;
	var ls_lastdate = as_date;

	if(as_date.length==10) as_date=z.toString(as_date,'yyyymmdd');
	if (as_date.length!=8) lb_result=false;
	else if (z.toInt(as_date.substr(0,4))<1 || z.toInt(as_date.substr(0,4)) > 9999) 	lb_result=false;
	else if (z.toInt(as_date.substr(4,2))<1 || z.toInt(as_date.substr(4,2)) > 12) 	lb_result=false;
	else if (z.toInt(as_date.substr(6,2))<1 || z.toInt(as_date.substr(6,2)) > 31) 	lb_result=false;
	else {
		ls_lastdate = z.getLastDate(as_date.substr(0,6)+'01');
		if (z.toInt(as_date.substr(6,2))>z.toInt(ls_lastdate.substr(6,2))) lb_result=false;
	}
	
	return lb_result;
};

// 주민번호체크
z.checkJumin = function (jumin) {
 var strJumin = jumin.replace(/-/gi,'');
 var checkBit = new Array(2,3,4,5,6,7,8,9,2,3,4,5);
 var num7  = strJumin.charAt(6);
 var num13 = strJumin.charAt(12);
 var total = 0;
 if (strJumin.length == 13 ) {
  for (i=0; i<checkBit.length; i++) {
    total += strJumin.charAt(i)*checkBit[i];
  }
  // 외국인 구분 체크
  if (num7 == 0 || num7 == 9) { // 내국인 ( 1800년대 9: 남자, 0:여자)
   total = (11-(total%11)) % 10;
  }
  else if (num7 > 4) {  // 외국인 ( 1900년대 5:남자 6:여자  2000년대 7:남자, 8:여자)
   total = (13-(total%11)) % 10;
  }
  else { // 내국인 ( 1900년대 1:남자 2:여자  2000년대 3:남자, 4:여자)
   total = (11-(total%11)) % 10;
  }

  if(total != num13) {
   return false;
  }
  return true;
  } else{
  return false;
  }
}

// 사업자번호체크
z.checkBiz = function(bizID) {
	bizID = bizID.replace(/-/gi,'');
	var checkID = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5, 1);
	var tmpBizID, i, chkSum=0, c2, remander;

	for(i=0; i<=7; i++) 
		chkSum += checkID[i] * bizID.charAt(i);

	c2 = "0" + (checkID[8] * bizID.charAt(8));
	c2 = c2.substring(c2.length - 2, c2.length);
	chkSum += Math.floor(c2.charAt(0)) + Math.floor(c2.charAt(1));
	remander = (10 - (chkSum % 10)) % 10 ;

	if(Math.floor(bizID.charAt(9)) == remander) 
		return true;

	return false;
}

// 오브젝트 비교
z.checkObjectEquals = function (object1, object2) {
	if ( object1.length == object2.length ) {
		var matchCnt = 0;
		
		for ( var prop in object1 ) {
			if ( object1.hasOwnProperty(prop) ) {
				if ( object1[prop] == object2[prop] ) {
					matchCnt++;
				}
			}
		}
		
		return object1.length == matchCnt;
	}
}

// element 중복 값 체크
z.checkDupValue = function (selector, checkNames) {
	var duplicateCheckObj = {
		"selector"    : "",
		"checkedValue": {},
		"dupElement"  : []
	};
	
	if ( checkNames == null || ! checkNames.length ) {
		return duplicateCheckObj;
	}
	
	var $ele = $(selector);
	
	for ( var i = 0, ii = checkNames.length; i < ii; i++ ) {
		duplicateCheckObj["selector"] += "[name=" + checkNames[i] + "],";
	}
	
	if ( duplicateCheckObj["selector"].length ) {
		duplicateCheckObj["selector"] = duplicateCheckObj["selector"].substring(0, duplicateCheckObj["selector"].length - 1);
	}
	
	for ( var i = 0, ii = $ele.length; i < ii; i++ ) {
		var $checkEles = $($ele[i]).find(duplicateCheckObj["selector"]);
		var checkValue = "";
		
		for ( var j = 0, jj = $checkEles.length; j < jj; j++ ) {
			checkValue += z.getTypeValue( $checkEles[j] );
		}
		
		if ( duplicateCheckObj["checkedValue"][checkValue] ) {
			if ( ! duplicateCheckObj["dupElement"].length ) {
				duplicateCheckObj["dupElement"].push( duplicateCheckObj["checkedValue"][checkValue] );
			}
			
			duplicateCheckObj["dupElement"].push($ele[i]);
		}
		else {
			duplicateCheckObj["checkedValue"][checkValue] = $ele[i];
			
			var $feedbackParent = $checkEles.removeClass("is-invalid").closest("div");
			
			if ( ! $feedbackParent.find(".is-invalid").length ) {
				$feedbackParent.find(".invalid-feedback").remove();
			}
		}
	}
	
	$(duplicateCheckObj["dupElement"]).find(duplicateCheckObj["selector"]).not(".is-invalid").addClass("is-invalid").after('<div class="invalid-feedback">중복된 값이 있습니다.</div>');
	
	return duplicateCheckObj;
}

// datatable 중복 값 체크
z.checkDatatableDupValue = function (checkDatatableId, checkModalId, checkNames) {
	var duplicateCheckObj = {
		"selector"   : "",
		"$dupElement": null
	};
	
	if ( checkNames == null || ! checkNames.length ) {
		return duplicateCheckObj;
	}
	
	var $ele = $("#" + checkModalId);
	
	for ( var i = 0, ii = checkNames.length; i < ii; i++ ) {
		duplicateCheckObj["selector"] += "[name=" + checkNames[i] + "],";
	}
	
	if ( duplicateCheckObj["selector"].length ) {
		duplicateCheckObj["selector"] = duplicateCheckObj["selector"].substring(0, duplicateCheckObj["selector"].length - 1);
	}
	
	var $checkEles  = $ele.find(duplicateCheckObj["selector"]);
	var checkValue  = "";
	var checkValue2 = "";
	
	for ( var j = 0, jj = $checkEles.length; j < jj; j++ ) {
		checkValue  += z.getTypeValue( $checkEles[j] );
		checkValue2 += z.__ModalData[checkModalId] && z.__ModalData[checkModalId][ $checkEles[j].name ] || "";
	}
	
	var dataSet = z.__Datatable[checkDatatableId].datatable.getDataSet();
	
	for ( var i = 0, ii = dataSet.length; i < ii; i++ ) {
		let checkDataSetValue = "";
		
		for ( var j = 0, jj = checkNames.length; j < jj; j++ ) {
			checkDataSetValue += dataSet[i][checkNames[j]];
		}
		
		if ( checkDataSetValue == checkValue && checkValue != checkValue2 ) {
			duplicateCheckObj["$dupElement"] = $checkEles;
			break;
		}
	}
	
	if ( duplicateCheckObj["$dupElement"] ) {
		duplicateCheckObj["$dupElement"].not(".is-invalid").addClass("is-invalid").after('<div class="invalid-feedback">중복된 값이 있습니다.</div>');
	}
	
	return duplicateCheckObj;
}


/* msg *****************************************************************************************************************************/
// 메세지 alert 호출
z.msg = function (text, callBackFunc, type) {
	swal.fire({ html: text || "", icon: "success"}).then(function(result) {
		if ( typeof callBackFunc == "function" ) {
			callBackFunc(result.value);
		}
	});
/*	$('.owl-carousel').owlCarousel({
		loop:true,
		margin:10,
		nav:true,
		items:1,
		navText : ['<i class="la la-angle-left" aria-hidden="true"></i>','<i class="la la-angle-right" aria-hidden="true"></i>']
	});*/
}

// 메세지 yesno alert 호출
z.msgYN = function (text, callBackFunc, yesMsg, noMsg) {
	Swal.fire({	
	html: text,
	icon: "question",
	showCancelButton: true,
	confirmButtonText:'확인',
	cancelButtonText: "취소",
	customClass: {
		confirmButton: "btn btn-danger font-weight-bold border px-6",
		cancelButton: "btn btn-outline-secondary font-weight-bold border px-6"
	}
	}).then(function(result) {
		if ( typeof callBackFunc == "function" ) {
			callBackFunc(result.value);
		}
	});
	/*$('.owl-carousel').owlCarousel({
		loop:true,
		margin:10,
		nav:true,
		items:1,
		navText : ['<i class="la la-angle-left" aria-hidden="true"></i>','<i class="la la-angle-right" aria-hidden="true"></i>']
	}); */
}

z.notify = function (title, message, element) {
	$.notify({
		title: title,
		message: message,
		url: null,
		target: null
	},{
		// settings
		element: element || 'body',
		type: 'info',
		delay: 1000,
		timer: 1000,
		allow_dismiss: false,
		newest_on_top: true
	});
}


// alert, confirm 퍼블리싱 제공 예시대로 반영한 함수 추가했습니다
z.msgAlert = function(option) {
	var optDefault = {
			html: '',
			icon: 'success',
			showCancelButton: false,
			confirmButtonText: '확인',
			customClass: {
				confirmButton: 'btn btn-danger font-weight-bold border px-6'
			}
		};
			
	option = $.extend(true, optDefault, option);

	return Swal.fire(option);
};

z.msgConfirm = function(option) {
	var optDefault = {
			html: '',
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: '확인',
			cancelButtonText: '취소',
			customClass: {
				confirmButton: 'btn btn-danger font-weight-bold border px-6',
				cancelButton: 'btn btn-outline-secondary font-weight-bold border px-6'
			}
		};
			
	option = $.extend(true, optDefault, option);

	return Swal.fire(option);	
};



/* jsp popup *****************************************************************************************************************************/
z.findZipcode = function (a_win, a_ele, a_div) {
	a_win._FindEle = a_ele;
	a_win._FindDiv = a_div;
	
	var mWidth  = 700;
	var mHeight = 450
	var mLeft   = (screen.width - mWidth) / 2;
	var mTop    = (screen.height - mHeight) / 2;

	w = window.open("/common/zipcode.do", "zip", "width=700px,height=450px,scrollbars=yes, left=" + mLeft + "px,top=" + mTop + "px");
	w.focus();
}

z.findZipCodeCallBack = function (a_win, roadFullAddr, roadAddrPart1, addrDetail, roadAddrPart2, engAddr, jibunAddr, zipNo, admCd, rnMgtSn, bdMgtSn
		, detBdNmList, bdNm, bdKdcd, siNm, sggNm, emdNm, liNm, rn, udrtYn, buldMnnm, buldSlno, mtYn, lnbrMnnm, lnbrSlno, emdNo){
	
	var Return ={
		"roadFullAddr"	: roadFullAddr,		//전체 도로명주소
		"roadAddrPart1"	: roadAddrPart1,	//도로명주소(참고항목 제외)
		"addrDetail"	: addrDetail,		//고객 입력 상세 주소
		"roadAddrPart2"	: roadAddrPart2,	//도로명주소 참고항목
		"engAddr"		: engAddr,			//도로명주소(영문)
		"jibunAddr"		: jibunAddr,		//지번 정보
		"zipNo"			: zipNo,			//우편번호
		"admCd"			: admCd,			//행정구역코드
		"rnMgtSn"		: rnMgtSn,			//도로명코드
		"bdMgtSn"		: bdMgtSn,			//건물관리번호
		"detBdNmList"	: detBdNmList,		//상세건물명
		"bdNm"			: bdNm,				//건물명
		"bdKdcd"		: bdKdcd,			//공동주택여부 (1:공동주택, 0: 비공동주택)
		"siNm"			: siNm,				//시도명
		"sggNm"			: sggNm,			//시군구명
		"emdNm"			: emdNm,			//읍면동명
		"liNm"			: liNm,				//법정리명
		"rn"			: rn,				//도로명
		"udrtYn"		: udrtYn,			//지하여부 (0:지상, 1:지하)
		"buldMnnm"		: buldMnnm,			//건물본번
		"buldSlno"		: buldSlno,			//건물부번 (부번이 없는 경우 0)
		"mtYn"			: mtYn,				//산여부 (0:대지, 1:산)
		"lnbrMnnm"		: lnbrMnnm,			//지번본번(번지)
		"lnbrSlno"		: lnbrSlno,			//지번부번(호) (부번이 없는 경우 0)
		"emdNo"			: emdNo				//읍면동일련번호
	}
	
	return zo.receveZipcode(z.getPortlet(a_win._FindEle), a_win._FindDiv, Return);
}



/**
 * @author sanggyu.lee(zeons)
 */
/* menu *****************************************************************************************************************************/
// 메뉴 열기
z.menuLink = function ( pgmCode ) {
	if ( pgmCode == null || pgmCode == "") {
		return;
	}
	
	/**************************************************
	 * init
	 **************************************************/
	zo = {
		pgmCode: pgmCode,
		py2m: 3.3058
	};

	var pgmUrl  = "jsp";
	var pgmInfo = {};
	
	$('#kt_content').empty();
	
	/**************************************************
	 * header
	 **************************************************/
	
	pgmInfo = z.xA("Comm", "getUserMenu", "select", {"pgm_code": pgmCode}, "json2");
		
	if ( pgmInfo == null || pgmInfo.length <= 0 ) {
		z.msg("프로그램 또는 권한이 없습니다.");
		return;
	} else {
		pgmInfo = pgmInfo[0];
		pgmUrl  = pgmInfo.pgmurl;
		menuBarYn = pgmInfo.menubaryn;
        var _body = KTUtil.getBody();
        
		if(menuBarYn == "Y"){
			KTUtil.removeClass(_body, 'aside-minimize');
		    KTUtil.addClass(_body, 'aside-fixed');
		} else {
			KTUtil.removeClass(_body, 'aside-fixed');
		    KTUtil.addClass(_body, 'aside-minimize');
		}
	}
	
	/**************************************************
	 * content
	 **************************************************/
	var params = {};	
	params["z.pgmCode"] = pgmCode;
	
	var jsonInfo = JSON.stringify(params);
	
	$.ajax({
		type       : 'post',
		url        : "/admin/com/menuJsp.do",
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
				z.msg("세션이 종료되어 로그인 화면으로 이동합니다.");
	    		zoMainOpenReLogin();
			}
			else if ( resp.result == "ERROR" ) {
				z.msg(resp.message);
			}
			else {
				$('#kt_content').html(resp);

				if (! z.isNotPushState) {
					z.pushStateUrl('/admin/main/adminMain.do?menuCd=' + pgmCode);
				}
				z.isNotPushState = false;
				
				//$("head").append('<script id="kt_script" src="/resources/admin/APPS/' + sysId.toLowerCase() + '/js/metronic_v7.0.5/' + pgmInfo.pgm_code + '.js" type="text/javascript"></script>');
				if ( typeof zoInit !== "undefined" ) {
					zoInit();
				}
			}
		},
		error: function(resp) {
			//_X.MBox("프로그램 로드 중 오류가 발생 하였습니다.");
		}
	});
	
	if(pgmInfo.modalyn == "Y"){
		$.ajax({
			type       : 'post',
			url        : "/admin/com/menuModalJsp.do",
		    dataType   : "text",
		    data       : z.encodeParam(jsonInfo),
		    timeout    : 10000,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			async      : false,
			cache      : false,
			success: function(resp2) {
				if ( resp2.result == "LoginOut" ) {
					z.msg("세션이 종료되어 로그인 화면으로 이동합니다.");
		    		zoMainOpenReLogin();
				}
				else if ( resp2.result == "ERROR" ) {
					//z.msg(resp2.message);
				}
				else {
					$('#kt_datatable_modal').html(resp2);
				}
			},
			error: function(resp2) {
				//_X.MBox("프로그램 로드 중 오류가 발생 하였습니다.");
			}
		});
	}
	
	// js 파일 중복 import 방지
	if ($('#kt_script').length > 0) {
		$('#kt_script').remove();
	}
	
	$("head").append('<script id="kt_script" src="/resources/admin/APPS' + pgmInfo.pgmurl + '.js" type="text/javascript"></script>');
}

/**
 * @author sanggyu.lee(zeons)
 */
/* menu *****************************************************************************************************************************/
// 메뉴 열기
z.buttonClick = function ( pgmCode, btnName, inTent ) {
	if ( pgmCode == null || pgmCode == "" || btnName == null || btnName == "") {
		return;
	}
	
	/* 페이지이동 : P */
	/* 버튼기능 : F */
	if ( inTent == null || inTent == "" ) {
		inTent = "P";
	}

	var params = {};	
	params["z.pgmCode"] = pgmCode;
	params["z.btnName"] = btnName;
	params["z.inTent" ] = inTent;
	
	var jsonInfo = JSON.stringify(params);
	$.ajax({
		type       : 'post',
		url        : "/admin/com/buttonLog.do",
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
				z.msg("세션이 종료되어 로그인 화면으로 이동합니다.");
	    		zoMainOpenReLogin();
			}
			else if ( resp.result == "ERROR" ) {
				z.msg(resp.message);
			}
			else {
				console.log(resp);
			}
		},
		error: function(resp) {
			//_X.MBox("프로그램 로드 중 오류가 발생 하였습니다.");
		}
	});
}

var htValues = new Array( );

z.setValue = function ( key, value ){
	if(htValues[key]==null){
		var idx = htValues.length;
		htValues[idx] = {val:value};
		htValues[key] = htValues[idx];
	}else{
		htValues[key].val = value;
	}
}

z.getValue = function ( key ){
	if(htValues[key]==null)
		return null;
	else
		return htValues[key].val;
}


z.setParam = function ( param ){
	z.setValue('GlobalParam', param);
}

z.getParam = function ( clear ){
	var param = z.getValue('GlobalParam');
	if((clear==null||clear)&&param!=null)
		z.setParam(null);
	return param;
}

z.getMetronicDatatableDataObj = function (sqlFile, sqlId, action, params, returnType) {
	return {
		type  : 'remote',
		source: {
			read: {
				url        : '/common/core/xmlAjax.do',
				method     : 'POST',
				headers    : {},
				contentType: 'application/x-www-form-urlencoded',
				charset    : 'UTF-8',
				params     : {
					"datatable_v7_0_5": JSON.stringify({
						"z.action"     : action,
						"z.sqlFile"    : sqlFile,
						"z.sqlId"      : sqlId,
						"z.returnType" : returnType || "json2",
						"z.rowSeparate": z._Row_Separate,
						"z.colSeparate": z._Col_Separate,
						"z.params"     : params
					})
				},
				map: function(raw) {
					let dataSet;
					
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
		pageSize       : 10
	};
};

z.addDownloadLog = function(downNm, downType) {
	return z.xAsync('Gis', '사용자다운로드메뉴로그', 'insert', {
		menuCd: zo.pgmCode,
		downNm: downNm,
		downType: downType || 'excel'
	}, 'json');
};

/**
	param: {sido: '', sgg: '', dong: '', isBizdist: false}
 */
z.addEmdSearchLog = function(param) {
	return z.xAsync('Gis', '사용자검색지역로그', 'insert', {
		menuCd: zo.pgmCode,
		sido: param.sidonm,
		sgg: '전체' === param.sggnm ? '' : param.sggnm,
		dong: '전체' === param.dongnm ? '' : (param.isBizdist ? param.bizdistnm : param.dongnm),
		emdType: param.isBizdist ? 'biz' : 'emd'
	}, 'json');
};

z.pushStateInit = function() {
	$(window).on('popstate', function(evt) {
		z.menuSelect();
	});
};

z.pushStateUrl = function(url) {
	z.pushState(null, null, url);
};

z.pushState = function(state, title, url) {
	history.pushState(state, title, url);
};

z.menuSelect = function(isLoadDefault) {
	var startMenu = '',
		idxParam = location.search.indexOf('menuCd=');
		
	if (-1 < idxParam) {
		startMenu = location.search.substring(idxParam + 7);
		idxParam = startMenu.indexOf('&');
		
		if (-1 < idxParam) {
			startMenu = startMenu.substring(0, idxParam);
		}
	}

	if (! startMenu) {
		startMenu = "MA0101";
	}
	
	z.isNotPushState = true;
	
	var $startMenu = $('#kt_aside_menu #' + startMenu);

	// 권한이 없거나 삭제된 메뉴: MA0101 도 삭제되면 수정 필요
	if (1 > $startMenu.length) {
		if (! isLoadDefault) {
			z.menuLink(startMenu);
			return;
		}
		$startMenu = $('#kt_aside_menu :not(.menu-toggle)#MA0101');
	}
	

	$startMenu.last().click();
};

// 데이터 출처 표시용 공통 호출
z.getDataReference = function() {
	if (z._dfrDataReference) {
		return z._dfrDataReference;
	}
	
	z._dfrDataReference = $.Deferred();
	
	z.xAsync('Dashboard', '자료출처_최종시간', 'select', {}, 'json').done(function(resp) {
		var resMap = {};
		if (resp) {
			resMap = resp.reduce(function(acc, cur) {
				acc[cur['이름']] = cur;
				return acc;
			}, resMap);
		}

		// CM unit 요청으로 삭제 
		// 임대료 정보만 분기별 기준시간으로 수정
		// if (resMap['매물']) {
			
		// 	var lastTime = moment(resMap['매물']['최종시간'], 'YYYYMM'),
		// 		lastQuarter = lastTime.clone().endOf('quarter'),
		// 		diff = lastQuarter.diff(lastTime, 'months');
			
		// 	if (0 < diff) {
		// 		resMap['매물']['최종시간'] = lastQuarter.subtract(1, 'quarters').format('YYYYMM');
		// 	}
		// }
		
		z._dfrDataReference.resolve(resMap);
	});

	
	return z._dfrDataReference;
	
};

z.formatDataReference = function(key) {
	var result = $.Deferred();
	
	z.getDataReference().done(function(map) {
		if (! map || ! map[key]) {
			result.resolve('');
		}
		
		var row = map[key],
			text = '출처: ' + row['출처'] + ' / 기준일: ' + moment(row['최종시간'], 'YYYYMM').format('YYYY.MM');

		result.resolve(text);
	});
	
	return result;
};

z.getCommCode = function(master, detail, order) {
	if (! order) {
		order = 'asc';
	}
	
	return z.xAsync('Admin', 'zeons_공통코드관리상세', 'select', {
		master: master,
		detail: detail || '',
		YN: 'Y',
		order: order
	}, 'json');
};
