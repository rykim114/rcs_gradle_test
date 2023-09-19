package apps.framework.service;

import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.utils.CmPathInfo;
import apps.homepage.common.dao.core.CommDao;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;


@Service
@SuppressWarnings("rawtypes")
public class CommonExtsService  extends CmService  {
	
	/** The Constant logger. */
	protected final Log	logger = LogFactory.getLog(this.getClass());

	@Autowired
	private CommDao commDao;

	/**
	 * 휴대폰인증
	 * @param reqVo
	 * @param rmap
	 * @param request
	 * @return
	 */
	public boolean requestNplus(CmMap reqVo, ModelAndView rmap, HttpServletRequest request) {	
		CmMap dbparams = new CmMap();
		
		NiceID.Check.CPClient niceCheck = new  NiceID.Check.CPClient();
		
		String sSiteCode = CmPathInfo.getCERTIFY_NICE_ID();			// NICE로부터 부여받은 사이트 코드
	    String sSitePassword = CmPathInfo.getCERTIFY_NICE_PW();		// NICE로부터 부여받은 사이트 패스워드
	    
	    String sRequestNumber = "REQ0000000001";        	// 요청 번호, 이는 성공/실패후에 같은 값으로 되돌려주게 되므로 
	    													// 업체에서 적절하게 변경하여 쓰거나, 아래와 같이 생성한다.
	    sRequestNumber = niceCheck.getRequestNO(sSiteCode);
	    
	    HttpSession	session	= request.getSession();
	    
		session.setAttribute("NICE_REQ_SEQ" , sRequestNumber);	// 해킹등의 방지를 위하여 세션을 쓴다면, 세션에 요청번호를 넣는다.
	    
	   	String sAuthType = "M";      	// 없으면 기본 선택화면, M: 핸드폰, C: 신용카드, X: 공인인증서
	   	
	   	String popgubun 	= "N";		//Y : 취소버튼 있음 / N : 취소버튼 없음
		String customize 	= "";		//없으면 기본 웹페이지 / Mobile : 모바일페이지
		
		String sGender = ""; 			//없으면 기본 선택 값, 0 : 여자, 1 : 남자 
		
	    // CheckPlus(본인인증) 처리 후, 결과 데이타를 리턴 받기위해 다음예제와 같이 http부터 입력합니다.
		//리턴url은 인증 전 인증페이지를 호출하기 전 url과 동일해야 합니다. ex) 인증 전 url : http://www.~ 리턴 url : http://www.~
	    String sReturnUrl = CmPathInfo.getSSL_URL()+"/exts/nice/callback_success.do";      // 성공시 이동될 URL
	    String sErrorUrl = CmPathInfo.getSSL_URL()+"/exts/nice/callback_fail.do";          // 실패시 이동될 URL

	    // 입력될 plain 데이타를 만든다.
	    String sPlainData = "7:REQ_SEQ" + sRequestNumber.getBytes().length + ":" + sRequestNumber +
	                        "8:SITECODE" + sSiteCode.getBytes().length + ":" + sSiteCode +
	                        "9:AUTH_TYPE" + sAuthType.getBytes().length + ":" + sAuthType +
	                        "7:RTN_URL" + sReturnUrl.getBytes().length + ":" + sReturnUrl +
	                        "7:ERR_URL" + sErrorUrl.getBytes().length + ":" + sErrorUrl +
	                        "11:POPUP_GUBUN" + popgubun.getBytes().length + ":" + popgubun +
	                        "9:CUSTOMIZE" + customize.getBytes().length + ":" + customize + 
							"6:GENDER" + sGender.getBytes().length + ":" + sGender;
	    
	    String sMessage = "";
	    String sEncData = "";
	    
	    int iReturn = niceCheck.fnEncode(sSiteCode, sSitePassword, sPlainData);
	    
	    rmap.addObject("iReturn", iReturn);
	    if( iReturn == 0 )
	    {
	        sEncData = niceCheck.getCipherData();	        
	        rmap.addObject("sEncData", sEncData);
	        sMessage = "";
	    }
	    else if( iReturn == -1)
	    {
	        sMessage = "암호화 시스템 에러입니다.";
	    }    
	    else if( iReturn == -2)
	    {
	        sMessage = "암호화 처리오류입니다.";
	    }    
	    else if( iReturn == -3)
	    {
	        sMessage = "암호화 데이터 오류입니다.";
	    }    
	    else if( iReturn == -9)
	    {
	        sMessage = "입력 데이터 오류입니다.";
	    }    
	    else
	    {
	        sMessage = "알수 없는 에러 입니다. iReturn : " + iReturn;
	    }
	    rmap.addObject("sMessage", sMessage);
	    
		return true;
	}
	
	
	public boolean callback_success(CmMap reqVo, ModelAndView rmap, HttpServletRequest request) {	
		CmMap dbparams = new CmMap();
        HttpSession	session	= request.getSession();
		
		NiceID.Check.CPClient niceCheck = new  NiceID.Check.CPClient();

	    //String sEncodeData = requestReplace(request.getParameter("EncodeData"), "encodeData");
		String sEncodeData = requestReplace(reqVo.getString("EncodeData"), "encodeData");

		String sSiteCode = CmPathInfo.getCERTIFY_NICE_ID();			// NICE로부터 부여받은 사이트 코드
	    String sSitePassword = CmPathInfo.getCERTIFY_NICE_PW();		// NICE로부터 부여받은 사이트 패스워드
	    
	    String sCipherTime = "";			// 복호화한 시간
	    String sRequestNumber = "";			// 요청 번호
	    String sResponseNumber = "";		// 인증 고유번호
	    String sAuthType = "";				// 인증 수단
	    String sName = "";					// 성명
	    String sDupInfo = "";				// 중복가입 확인값 (DI_64 byte)
	    String sConnInfo = "";				// 연계정보 확인값 (CI_88 byte)
	    String sBirthDate = "";				// 생년월일(YYYYMMDD)
	    String sGender = "";				// 성별
	    String sNationalInfo = "";			// 내/외국인정보 (개발가이드 참조)
		String sMobileNo = "";				// 휴대폰번호
		String sMobileCo = "";				// 통신사
	    String sMessage = "";
	    String sPlainData = "";
	    
	    int iReturn = niceCheck.fnDecode(sSiteCode, sSitePassword, sEncodeData);
	    
	    rmap.addObject("iReturn", iReturn);
	    
	    if( iReturn == 0 )
	    {
	        sPlainData = niceCheck.getPlainData();
	        sCipherTime = niceCheck.getCipherDateTime();
	        
	        // 데이타를 추출합니다.
	        java.util.HashMap mapresult = niceCheck.fnParse(sPlainData);
	        
	        sRequestNumber  = (String)mapresult.get("REQ_SEQ");
	        sResponseNumber = (String)mapresult.get("RES_SEQ");
	        sAuthType		= (String)mapresult.get("AUTH_TYPE");
	        sName			= (String)mapresult.get("NAME");
			//sName			= (String)mapresult.get("UTF8_NAME"); //charset utf8 사용시 주석 해제 후 사용
	        sBirthDate		= (String)mapresult.get("BIRTHDATE");
	        sGender			= (String)mapresult.get("GENDER");
	        sNationalInfo  	= (String)mapresult.get("NATIONALINFO");
	        sDupInfo		= (String)mapresult.get("DI");
	        sConnInfo		= (String)mapresult.get("CI");
	        sMobileNo		= (String)mapresult.get("MOBILE_NO");
	        sMobileCo		= (String)mapresult.get("MOBILE_CO");
	        
			
	        String session_sRequestNumber = (String)session.getAttribute("NICE_REQ_SEQ");
	        if(!sRequestNumber.equals(session_sRequestNumber))
	        {
	            sMessage = "세션값이 다릅니다. 올바른 경로로 접근하시기 바랍니다.";
	            sResponseNumber = "";
	            sAuthType = "";
	        }
	        
	    }
	    else if( iReturn == -1)
	    {
	        sMessage = "복호화 시스템 에러입니다.";
	    }    
	    else if( iReturn == -4)
	    {
	        sMessage = "복호화 처리오류입니다.";
	    }    
	    else if( iReturn == -5)
	    {
	        sMessage = "복호화 해쉬 오류입니다.";
	    }    
	    else if( iReturn == -6)
	    {
	        sMessage = "복호화 데이터 오류입니다.";
	    }    
	    else if( iReturn == -9)
	    {
	        sMessage = "입력 데이터 오류입니다.";
	    }    
	    else if( iReturn == -12)
	    {
	        sMessage = "사이트 패스워드 오류입니다.";
	    }    
	    else
	    {
	        sMessage = "알수 없는 에러 입니다. iReturn : " + iReturn;
	    }
	    rmap.addObject("sMessage", sMessage);
	    
	    rmap.addObject("sRequestNumber", sRequestNumber);
	    rmap.addObject("sResponseNumber", sResponseNumber);
	    rmap.addObject("sAuthType", sAuthType);
	    rmap.addObject("sName", sName);
	    rmap.addObject("sBirthDate", sBirthDate);
	    rmap.addObject("sGender", sGender);
	    rmap.addObject("sNationalInfo", sNationalInfo);
	    rmap.addObject("sDupInfo", sDupInfo);
	    rmap.addObject("sConnInfo", sConnInfo);
	    rmap.addObject("sMobileNo", sMobileNo);
	    rmap.addObject("sMobileCo", sMobileCo);
	    
	    session.setAttribute("s_RequestNumber", sRequestNumber);
	    session.setAttribute("s_ResponseNumber", sResponseNumber);
	    session.setAttribute("s_AuthType", sAuthType);
	    session.setAttribute("s_Name", sName);
	    session.setAttribute("s_BirthDate", sBirthDate);
	    session.setAttribute("s_Gender", sGender);
	    session.setAttribute("s_NationalInfo", sNationalInfo);
	    session.setAttribute("s_DupInfo", sDupInfo);
	    session.setAttribute("s_ConnInfo", sConnInfo);
	    session.setAttribute("s_MobileNo", sMobileNo);
	    session.setAttribute("s_MobileCo", sMobileCo);
	    
	    CmMap cm = new CmResMap();
	    
	    cm.put("iReturn", iReturn);
	    cm.put("sMessage", sMessage);
	    cm.put("sRequestNumber", sRequestNumber);
	    cm.put("sResponseNumber", sResponseNumber);
	    cm.put("sAuthType", sAuthType);
	    cm.put("sName", sName);
	    cm.put("sBirthDate", sBirthDate);
	    cm.put("sGender", sGender);
	    cm.put("sNationalInfo", sNationalInfo);
	    cm.put("sDupInfo", sDupInfo);
	    cm.put("sConnInfo", sConnInfo);
	    cm.put("sMobileNo", sMobileNo);
	    cm.put("sMobileCo", sMobileCo);

		commDao.insertNiceSendHistory(cm);
		return true;
	}
	
	
	public boolean callback_fail(CmMap reqVo, ModelAndView rmap, HttpServletRequest request) {	
		CmMap dbparams = new CmMap();
        HttpSession	session	= request.getSession();
		
		NiceID.Check.CPClient niceCheck = new  NiceID.Check.CPClient();

	    //String sEncodeData = requestReplace(request.getParameter("EncodeData"), "encodeData");
		String sEncodeData = requestReplace(reqVo.getString("EncodeData"), "encodeData");

		String sSiteCode = CmPathInfo.getCERTIFY_NICE_ID();			// NICE로부터 부여받은 사이트 코드
	    String sSitePassword = CmPathInfo.getCERTIFY_NICE_PW();		// NICE로부터 부여받은 사이트 패스워드

	    String sCipherTime = "";			// 복호화한 시간
	    String sRequestNumber = "";			// 요청 번호
	    String sErrorCode = "";				// 인증 결과코드
	    String sAuthType = "";				// 인증 수단
	    String sMessage = "";
	    String sPlainData = "";
	    
	    int iReturn = niceCheck.fnDecode(sSiteCode, sSitePassword, sEncodeData);
	    
	    rmap.addObject("iReturn", iReturn);
	    
	    if( iReturn == 0 )
	    {
	        sPlainData = niceCheck.getPlainData();
	        sCipherTime = niceCheck.getCipherDateTime();
	        
	        // 데이타를 추출합니다.
	        java.util.HashMap mapresult = niceCheck.fnParse(sPlainData);
	        
	        sRequestNumber 	= (String)mapresult.get("REQ_SEQ");
	        sErrorCode 		= (String)mapresult.get("ERR_CODE");
	        sAuthType 		= (String)mapresult.get("AUTH_TYPE");
	        
	    }
	    else if( iReturn == -1)
	    {
	        sMessage = "복호화 시스템 에러입니다.";
	    }    
	    else if( iReturn == -4)
	    {
	        sMessage = "복호화 처리오류입니다.";
	    }    
	    else if( iReturn == -5)
	    {
	        sMessage = "복호화 해쉬 오류입니다.";
	    }    
	    else if( iReturn == -6)
	    {
	        sMessage = "복호화 데이터 오류입니다.";
	    }    
	    else if( iReturn == -9)
	    {
	        sMessage = "입력 데이터 오류입니다.";
	    }    
	    else if( iReturn == -12)
	    {
	        sMessage = "사이트 패스워드 오류입니다.";
	    }    
	    else
	    {
	        sMessage = "알수 없는 에러 입니다. iReturn : " + iReturn;
	    }
	    rmap.addObject("sMessage", sMessage);
	    
	    rmap.addObject("sRequestNumber", sRequestNumber);
	    rmap.addObject("sAuthType", sAuthType);
        
	    session.removeAttribute("s_RequestNumber" );
	    session.removeAttribute("s_ResponseNumber");
	    session.removeAttribute("s_AuthType"      );
	    session.removeAttribute("s_Name"          );
	    session.removeAttribute("s_BirthDate"     );
	    session.removeAttribute("s_Gender"        );
	    session.removeAttribute("s_NationalInfo"  );
	    session.removeAttribute("s_DupInfo"       );
	    session.removeAttribute("s_ConnInfo"      );
	    session.removeAttribute("s_MobileNo"      );
	    session.removeAttribute("s_MobileCo"      );

	    CmMap cm = new CmResMap();
	    
	    cm.put("iReturn", iReturn);
	    cm.put("sMessage", sMessage);
	    cm.put("sRequestNumber", sRequestNumber);
	    cm.put("sAuthType", sAuthType);

		commDao.insertNiceSendHistory(cm);
		return true;
	}
	
	public String requestReplace (String paramValue, String gubun) {

        String result = "";
        
        if (paramValue != null) {
        	
        	paramValue = paramValue.replaceAll("<", "&lt;").replaceAll(">", "&gt;");

        	paramValue = paramValue.replaceAll("\\*", "");
        	paramValue = paramValue.replaceAll("\\?", "");
        	paramValue = paramValue.replaceAll("\\[", "");
        	paramValue = paramValue.replaceAll("\\{", "");
        	paramValue = paramValue.replaceAll("\\(", "");
        	paramValue = paramValue.replaceAll("\\)", "");
        	paramValue = paramValue.replaceAll("\\^", "");
        	paramValue = paramValue.replaceAll("\\$", "");
        	paramValue = paramValue.replaceAll("'", "");
        	paramValue = paramValue.replaceAll("@", "");
        	paramValue = paramValue.replaceAll("%", "");
        	paramValue = paramValue.replaceAll(";", "");
        	paramValue = paramValue.replaceAll(":", "");
        	paramValue = paramValue.replaceAll("-", "");
        	paramValue = paramValue.replaceAll("#", "");
        	paramValue = paramValue.replaceAll("--", "");
        	paramValue = paramValue.replaceAll("-", "");
        	paramValue = paramValue.replaceAll(",", "");
        	
        	if(gubun != "encodeData"){
        		paramValue = paramValue.replaceAll("\\+", "");
        		paramValue = paramValue.replaceAll("/", "");
            paramValue = paramValue.replaceAll("=", "");
        	}
        	
        	result = paramValue;
            
        }
        return result;
  }
	
}
