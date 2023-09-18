package apps.framework.utils;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.ibatis.io.Resources;
import javax.servlet.http.HttpServletRequest;

public class CmPathInfo {
	
	protected final Log	logger = LogFactory.getLog(this.getClass());
	
	private static String	SERVER_TYPE;
	private static String	SERVER_SITECD;
	private static String 	CHARSET		= "UTF-8";

	private static String	SITE_CHCD;
	private static String	SAPCD;
	private static String	SAPCD_NM;
	
	private static String	WEB_ROOT;
	private static String	WEB_URL;
	private static String	SITE_URL;
	private static String 	MOBILE_URL;
	private static String	SSL_URL;
	private static String	CDN_URL;

	private static String	IMG_SERVER_URL;
	private static String	IMG_UPLOAD_URL;

	private static String	IMG_SERVER_SSL_URL;
	private static String	IMG_UPLOAD_SSL_URL;

	private static String	COMMON_IMG_URL;
	private static String	COMMON_CSS_URL;
	private static String	COMMON_JS_URL;
	
	private static String	ROOT_PATH;
	private static String 	UPLOAD_PATH;
	
	private static String 	SQL_LOG_PATH;

	private static String 	TEST_RECEIVED_EMAIL;

	private static String	SMS_CALLBACK;
	private static String	MAIL_FROM_NAME;
	private static String	MAIL_FROM_EMAIL;
	
	private static String	ROW_SEPARATE;
	private static String	COL_SEPARATE;

	private static String	SECRET_AES_KEY;
	private static String	SECRET_AES_DB_KEY;
	
	private	static String	TASK_SCHEDULER_SERVER;
	private static String	TASK_SCHEDULER_URL;
	
	private static String	CERTIFY_NICE_ID;
	private static String	CERTIFY_NICE_PW;
	private static String	CERTIFY_IPIN_ID;
	private static String	CERTIFY_IPIN_PW;
	
	private static String	KAKAO_ID;
	private static String	KAKAO_TOKEN;
				
	private static String	KAKAOALIMTALK_ID;
	private static String	KAKAOALIMTALK_PW;
	private static String	KAKAOALIMTALK_SENDER_KEY;
	
		
	private static Map<String, Map<String, String>> PG_KEY = new HashMap<>();
	
	private static String	IOS_P12PATH;
	
	private static String	SETTLEBANK_MID;
	private static String	SETTLEBANK_AUTH_KEY;

	private static String	METRONIC_VERSION;
	
	private static int		SESSION_LOGIN_CONCURRENT_MAX_CNT;
	
	static {
		if (WEB_ROOT == null || WEB_ROOT.equals("")) {
			new CmPathInfo();
		}
	}
	
	public CmPathInfo() {
		if (WEB_ROOT == null || WEB_ROOT.equals("")) {
			this.setPath();
		}
	}

	public void setPath() {
		try {
			Properties	props	= Resources.getResourceAsProperties("ezREMS.properties");
					
 
			SERVER_TYPE					= CmFunction.getStrVal(props.getProperty("SERVER_TYPE")).toUpperCase().trim();
			SERVER_SITECD				= CmFunction.getStrVal(props.getProperty("SERVER_SITECD")).toUpperCase().trim();
			
			ROW_SEPARATE				= CmFunction.getStrVal(props.getProperty("ROW_SEPARATE")).trim();
			COL_SEPARATE				= CmFunction.getStrVal(props.getProperty("COL_SEPARATE")).trim();

			SITE_CHCD					= "";
			SAPCD						= "";
			SAPCD_NM					= "ezREMS";
			
			
			if ("REAL".equals(SERVER_TYPE)) {

				WEB_ROOT					= "/";
				WEB_URL						= "https://mabs.r114.co.kr/";
				MOBILE_URL					= "https://mabs.r114.co.kr/";
				SSL_URL						= "https://mabs.r114.co.kr/";
				CDN_URL						= "https://mabs.r114.co.kr/";
				
				SITE_URL					= "mabs.r114.co.kr/";

				IMG_SERVER_URL				= "https://mabs.r114.co.kr/FileUpload/";
				IMG_UPLOAD_URL				= "https://mabs.r114.co.kr/FileUpload/";

				IMG_SERVER_SSL_URL			= "https://mabs.r114.co.kr/FileUpload/";
				IMG_UPLOAD_SSL_URL			= "https://mabs.r114.co.kr/FileUpload/";

				ROOT_PATH					= "/DATA/CONTENT/mabs.r114.co.kr/";
				UPLOAD_PATH					= "/DATA/CONTENT/mabs.r114.co.kr/FileUpload/";
				
				SQL_LOG_PATH				= "/APP_log/mabs.r114.co.kr/";
				
				IOS_P12PATH					= "/DATA/CONTENT/mabs.r114.co.kr/WEB-INF/classes/pro.p12";
				
				TEST_RECEIVED_EMAIL			= "";

				SMS_CALLBACK 				= "02-0000-0000";
				MAIL_FROM_NAME 				= "ezREMS_SYSTEM";
				MAIL_FROM_EMAIL 			= "ezremsadmin@ezrems.com";
												
				KAKAO_ID                    = "1208757657002";
				KAKAO_TOKEN                 = "5C8B9D74FCDAC9170F8593AB131E9166A5F1A2AF09979EE800FD44CC3C910F32";
				
			} else if ("DEV".equals(SERVER_TYPE)) {

				WEB_ROOT					= "/";
				WEB_URL						= "http://mabs.r114.co.kr/";
				MOBILE_URL					= "http://mabs.r114.co.kr/";
				SSL_URL						= "http://mabs.r114.co.kr/";
				CDN_URL						= "http://mabs.r114.co.kr/";
				
				SITE_URL					= "mabs.r114.co.kr/";

				IMG_SERVER_URL				= "http://mabs.r114.co.kr/FileUpload/";
				IMG_UPLOAD_URL				= "http://mabs.r114.co.kr/FileUpload/";

				IMG_SERVER_SSL_URL			= "http://mabs.r114.co.kr/FileUpload/";
				IMG_UPLOAD_SSL_URL			= "http://mabs.r114.co.kr/FileUpload/";

				ROOT_PATH					= "/DATA/CONTENT/mabs.r114.co.kr/";
				UPLOAD_PATH					= "/DATA/CONTENT/web_mabs.r114.co.kr/FileUpload/";
				
				SQL_LOG_PATH				= "/APP_log/mabs.r114.co.kr/";
				
				IOS_P12PATH					= "/DATA/CONTENT/mabs.r114.co.kr/WEB-INF/classes/pro.p12";
				
				TEST_RECEIVED_EMAIL			= "";

				SMS_CALLBACK 				= "02-0000-0000";
				MAIL_FROM_NAME 				= "ezREMS_SYSTEM";
				MAIL_FROM_EMAIL 			= "ezremsadmin@ezrems.com";
								
				KAKAO_ID                    = "1208757657002";
				KAKAO_TOKEN                 = "5C8B9D74FCDAC9170F8593AB131E9166A5F1A2AF09979EE800FD44CC3C910F32";

			} else {
				setLocalPath(props);
			}
			
			COMMON_IMG_URL				= CDN_URL + "static/common/images/";
			COMMON_CSS_URL				= WEB_URL + "static/common/css/";
			COMMON_JS_URL				= WEB_URL + "static/common/js/";
			
			CERTIFY_NICE_ID = CmFunction.getStrVal(props.getProperty("CERTIFY_NICE_ID")).trim();
			CERTIFY_NICE_PW = CmFunction.getStrVal(props.getProperty("CERTIFY_NICE_PW")).trim();
			CERTIFY_IPIN_ID = CmFunction.getStrVal(props.getProperty("CERTIFY_IPIN_ID")).trim();
			CERTIFY_IPIN_PW = CmFunction.getStrVal(props.getProperty("CERTIFY_IPIN_PW")).trim();

			KAKAOALIMTALK_ID = CmFunction.getStrVal(props.getProperty("KAKAOALIMTALK_ID")).trim();
			KAKAOALIMTALK_PW = CmFunction.getStrVal(props.getProperty("KAKAOALIMTALK_PW")).trim();
			KAKAOALIMTALK_SENDER_KEY = CmFunction.getStrVal(props.getProperty("KAKAOALIMTALK_SENDER_KEY")).trim();
			
			SECRET_AES_KEY				= CmFunction.getStrVal(props.getProperty("SECRET_AES_KEY")).trim();
			SECRET_AES_DB_KEY			= CmFunction.getStrVal(props.getProperty("SECRET_AES_DB_KEY")).trim();

			TASK_SCHEDULER_SERVER		= CmFunction.getStrVal(props.getProperty("TASK_SCHEDULER_SERVER")).trim();
			TASK_SCHEDULER_URL			= CmFunction.getStrVal(props.getProperty("TASK_SCHEDULER_URL")).trim();
			
			SETTLEBANK_MID              = CmFunction.getStrVal(props.getProperty("SETTLEBANK_MID")).trim();
			SETTLEBANK_AUTH_KEY         = CmFunction.getStrVal(props.getProperty("SETTLEBANK_AUTH_KEY")).trim();

			METRONIC_VERSION     	    = CmFunction.getStrVal(props.getProperty("METRONIC_VERSION")).trim();

			SESSION_LOGIN_CONCURRENT_MAX_CNT = CmFunction.getIntVal(props.getProperty("SESSION_LOGIN_CONCURRENT_MAX_CNT"));

		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
	}

	private static void setLocalPath(Properties props) {

		WEB_ROOT					= CmFunction.getStrVal(props.getProperty("WEB_ROOT")).trim();
		WEB_URL						= CmFunction.getStrVal(props.getProperty("WEB_URL")).trim();
		MOBILE_URL					= CmFunction.getStrVal(props.getProperty("MOBILE_URL")).trim();
		SSL_URL						= CmFunction.getStrVal(props.getProperty("SSL_URL")).trim();		
		CDN_URL						= WEB_URL;
		
		SITE_URL					= CmFunction.getStrVal(props.getProperty("SITE_URL")).trim();

		IMG_SERVER_URL				= CmFunction.getStrVal(props.getProperty("IMG_SERVER_URL")).trim();
		IMG_UPLOAD_URL				= CmFunction.getStrVal(props.getProperty("IMG_UPLOAD_URL")).trim();

		IMG_SERVER_SSL_URL			= CmFunction.getStrVal(props.getProperty("IMG_SERVER_SSL_URL")).trim();
		IMG_UPLOAD_SSL_URL			= CmFunction.getStrVal(props.getProperty("IMG_UPLOAD_SSL_URL")).trim();
		
		ROOT_PATH					= CmFunction.getStrVal(props.getProperty("ROOT_PATH")).trim();
		UPLOAD_PATH					= CmFunction.getStrVal(props.getProperty("UPLOAD_PATH")).trim();
		
		SQL_LOG_PATH				= CmFunction.getStrVal(props.getProperty("SQL_LOG_PATH")).trim();

		IOS_P12PATH					= CmFunction.getStrVal(props.getProperty("IOS_P12PATH")).trim();
		
		TEST_RECEIVED_EMAIL			= CmFunction.getStrVal(props.getProperty("TEST_RECEIVED_EMAIL")).trim();

		SMS_CALLBACK 				= CmFunction.getStrVal(props.getProperty("SMS_CALLBACK")).trim();
		MAIL_FROM_NAME 				= CmFunction.getStrVal(props.getProperty("MAIL_FROM_NAME")).trim();
		MAIL_FROM_EMAIL 			= CmFunction.getStrVal(props.getProperty("MAIL_FROM_EMAIL")).trim();
		
		SECRET_AES_KEY				= CmFunction.getStrVal(props.getProperty("SECRET_AES_KEY")).trim();
		SECRET_AES_DB_KEY			= CmFunction.getStrVal(props.getProperty("SECRET_AES_DB_KEY")).trim();
		
		TASK_SCHEDULER_SERVER		= CmFunction.getStrVal(props.getProperty("TASK_SCHEDULER_SERVER")).trim();
		TASK_SCHEDULER_URL			= CmFunction.getStrVal(props.getProperty("TASK_SCHEDULER_URL")).trim();
		
		KAKAO_ID                    = CmFunction.getStrVal(props.getProperty("KAKAO_ID")).trim();
		KAKAO_TOKEN                 = CmFunction.getStrVal(props.getProperty("KAKAO_TOKEN")).trim();

	}
		
	public static String getWEB_URL_CHANGE() {
		String	url	= CmFunction.getCurrentRequest().getRequestURL().toString();
		
		return WEB_URL;
	}

	public static String getSSL_URL_CHANGE() {
		String	url	= CmFunction.getCurrentRequest().getRequestURL().toString();

		return SSL_URL;
	}

	public static String getSERVER_TYPE() {
		return SERVER_TYPE;
	}

	public static String getSERVER_SITECD() {
		return SERVER_SITECD;
	}

	public static String getCHARSET() {
		return CHARSET;
	}

	public static String getSITE_CHCD() {
		return SITE_CHCD;
	}

	public static String getSAPCD() {
		return SAPCD;
	}

	public static String getSAPCD_NM() {
		return SAPCD_NM;
	}

	public static String getWEB_ROOT() {
		return WEB_ROOT;
	}
	
	public static String setWEB_URL(String wurl){
		WEB_URL = wurl;
		return WEB_URL;
	}
	public static String getWEB_URL() {
		return WEB_URL;
	}
	public static String setSITE_URL(String wurl){
		SITE_URL = wurl;
		return SITE_URL;
	}
	public static String getSITE_URL() {
		return SITE_URL;
	}
	public static String setMOBILE_URL(String wurl){
		MOBILE_URL = wurl;
		return MOBILE_URL;
	}
	public static String getMOBILE_URL() {
		return MOBILE_URL;
	}
	
	public static String setSSL_URL(String wurl){
		SSL_URL = wurl;
		return SSL_URL;
	}
	public static String getSSL_URL() {
		return SSL_URL;
	}
	
	public static String getCDN_URL() {
		return CDN_URL;
	}
	
	public static String setIMG_SERVER_URL(String wurl){
		IMG_SERVER_URL = wurl;
		return IMG_SERVER_URL;
	}
	public static String getIMG_SERVER_URL() {
		return IMG_SERVER_URL;
	}
	
	public static String setIMG_UPLOAD_URL(String wurl){
		IMG_UPLOAD_URL = wurl;
		return IMG_UPLOAD_URL;
	}
	public static String getIMG_UPLOAD_URL() {
		return IMG_UPLOAD_URL;
	}
	
	public static String setIMG_SERVER_SSL_URL(String wurl){
		IMG_SERVER_SSL_URL = wurl;
		return IMG_SERVER_SSL_URL;
	}
	public static String getIMG_SERVER_SSL_URL() {
		return IMG_SERVER_SSL_URL;
	}
	
	public static String setIMG_UPLOAD_SSL_URL(String wurl){
		IMG_UPLOAD_SSL_URL = wurl;
		return IMG_UPLOAD_SSL_URL;
	}
	public static String getIMG_UPLOAD_SSL_URL() {
		return IMG_UPLOAD_SSL_URL;
	}

	

	public static String getROOT_PATH() {
		return ROOT_PATH;
	}

	public static String getUPLOAD_PATH() {
		return UPLOAD_PATH;
	}
	
	public static String getSQL_LOG_PATH() {
		return SQL_LOG_PATH;
	}

	public static String getTEST_RECEIVED_EMAIL() {
		return TEST_RECEIVED_EMAIL;
	}

	public static String getSMS_CALLBACK() {
		return SMS_CALLBACK;
	}

	public static String getMAIL_FROM_NAME() {
		return MAIL_FROM_NAME;
	}

	public static String getMAIL_FROM_EMAIL() {
		return MAIL_FROM_EMAIL;
	}
	
	public static String getROW_SEPARATE() {
		return ROW_SEPARATE;
	}
	public static String getCOL_SEPARATE() {
		return COL_SEPARATE;
	}

	public static String getSECRET_AES_KEY() {
		return SECRET_AES_KEY;
	}
	public static String getSECRET_AES_DB_KEY() {
		return SECRET_AES_DB_KEY;
	}

	
	public static String getCOMMON_IMG_URL() {
		return COMMON_IMG_URL;
	}

	public static String getCOMMON_CSS_URL() {
		return COMMON_CSS_URL;
	}

	public static String getCOMMON_JS_URL() {
		return COMMON_JS_URL;
	}
	
	public static String getTASK_SCHEDULER_URL() {
		return TASK_SCHEDULER_URL;
	}
	public static String getTASK_SCHEDULER_SERVER() {
		return TASK_SCHEDULER_SERVER;
	}
	
	
	public static String getCERTIFY_NICE_ID() {
		return CERTIFY_NICE_ID;
	}
	public static String getCERTIFY_NICE_PW() {
		return CERTIFY_NICE_PW;
	}
	public static String getCERTIFY_IPIN_ID() {
		return CERTIFY_IPIN_ID;
	}
	public static String getCERTIFY_IPIN_PW() {
		return CERTIFY_IPIN_PW;
	}
	
	public static String getKAKAO_ID() {
		return KAKAO_ID;
	}
	public static String getKAKAO_TOKEN() {
		return KAKAO_TOKEN;
	}
	
	public static String getKAKAOALIMTALK_ID() {
		return KAKAOALIMTALK_ID;
	}
	public static String getKAKAOALIMTALK_PW() {
		return KAKAOALIMTALK_PW;
	}
	public static String getKAKAOALIMTALK_SENDER_KEY() {
		return KAKAOALIMTALK_SENDER_KEY;
	}

	
	public static Map<String, String> getPG_KEY(String pg) {
		return PG_KEY.get(pg);
	}
		
	public static String getIOS_P12PATH() {
		return IOS_P12PATH;
	}
	
	public static String getSETTLEBANK_MID() {
		return SETTLEBANK_MID;
	}
	
	public static String getSETTLEBANK_AUTH_KEY() {
		return SETTLEBANK_AUTH_KEY;
	}

	public static String getMETRONIC_VERSION() {
		return METRONIC_VERSION;
	}

	public static int getSESSION_LOGIN_CONCURRENT_MAX_CNT() {
		return SESSION_LOGIN_CONCURRENT_MAX_CNT;
	}

}
