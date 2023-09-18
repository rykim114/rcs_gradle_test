package apps.homepage.common.impl.core;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLEncoder;

import javax.net.ssl.HttpsURLConnection;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.bouncycastle.util.encoders.Base64;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apps.framework.object.CmMap;
import apps.homepage.common.dao.core.TelNumberConfirmDao;
import apps.homepage.common.service.core.TelNumberConfirmService;
import apps.homepage.common.utils.core.AESManage;

@Service
public class TelNumberConfirmServiceImpl implements TelNumberConfirmService {
	
	protected final Log	logger = LogFactory.getLog(this.getClass());
	
	@Autowired
	private TelNumberConfirmDao telNumberConfirmDao;
	
	@Override
	public CmMap bizTongConfirmTelNumber(CmMap reqVo) throws Exception {
		CmMap<String, String> cmm = new CmMap<String, String>();
		AESManage aesManage = new AESManage(); // 상호 통신 암복호화 클래스
		
		String licenseKey = BIZTONG_LISENCE_KEY;
		String vendorNo = telNumberConfirmDao.getVendorNo(reqVo).getString("vendor_no");

		String rstLK = "";
		String rstVN = "";
		
		byte [] btLK = null;
		byte [] btVN = null;
		
		try {
			btLK = licenseKey.getBytes("UTF-8");
			btVN = vendorNo.getBytes("UTF-8");
			
			rstLK = URLEncoder.encode(Base64.toBase64String(btLK));
			rstVN = URLEncoder.encode(Base64.toBase64String(btVN));
			
			cmm.put("licenseKey", rstLK);
			cmm.put("vendorNo", rstVN);
			
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			logger.error(e); //e.printStackTrace();
		}
		return cmm;
	}

	@Override
	public int bizTongConfirmListTelNumber(CmMap reqVo) throws Exception {
		// API 규약상 모든정보는 JSON(AES암호화)
		AESManage aesManage = new AESManage(); 
		BufferedReader resultJson = null;
		
		JSONObject jsonObj = new JSONObject(); // JSON 으로 변환되어 인증사이트에 보내질 오브젝트
		JSONArray telListArr = new JSONArray(); // 전화정보 정보를 JSON 형식으로 최종 OBJECT 넣기위한 JSONARRAY (API 규약상 BODY는 LIST 형태로 보내야하기 때문에
		JSONObject telListObj = new JSONObject(); // 전화정보 JSON

		String vendorNo = telNumberConfirmDao.getVendorNo(reqVo).getString("vendor_no");
		String tel_no = reqVo.getString("tel_no");
		
		int cnt = 0;
		
		try {
			if(!aesManage.setKeyText("QdK87givadQacYWj")) {
				// 에러 처리
				return -1;
			}
			if(!aesManage.setIvHexText("00000000000000000000000000000000")) {
				// 에러 처리
				return -1;
			}
			if(!aesManage.initializeAES()) {
				// 에러 처리
				return -1;
			}	
			
			URL url = new URL(TN_CONFIRM_URL);
			
			HttpsURLConnection httpCon = (HttpsURLConnection) url.openConnection();
			
			httpCon.setRequestProperty("Accept", "application/json");
            httpCon.setRequestProperty("Content-type", "application/json");
            
            httpCon.setDoOutput(true);
            
            httpCon.setDoInput(true);
            
            telListObj.put("CNo", tel_no);
            
            telListArr.add(telListObj);
            
            jsonObj.put("FName", CONFIRM_LIST_FNAME);
            jsonObj.put("PKey", BIZTONG_LISENCE_KEY);

            // if RED / HTH 처리
            jsonObj.put("BizNo", vendorNo);
            jsonObj.put("Body", telListArr); // JSON BODY 정보는 LIST 형태로 보내야하기때문에..
            
            String setJson = aesManage.encryptionTextWithBase64Encoding(jsonObj.toString());
            
            OutputStream os = httpCon.getOutputStream();
            os.write(setJson.getBytes("utf-8"));
            os.flush();
			
            resultJson = new BufferedReader(new InputStreamReader(httpCon.getInputStream(), "utf-8"));
            
			String line;
			StringBuffer st = new StringBuffer();
			
			while((line = resultJson.readLine()) != null) { // response를 차례대로 출력
				st.append(line);
			}
			
			String result = aesManage.decryptionTextWithBase64Decoding(st.toString()).trim();
			
			JSONParser jp = new JSONParser();
			JSONObject resultJsonObj = new JSONObject();
			resultJsonObj = (JSONObject) jp.parse(result);
			
			telListArr = (JSONArray)resultJsonObj.get("Body");
			for(int i=0; i < telListArr.size(); i++) {
				resultJsonObj = (JSONObject)telListArr.get(i);
				if(resultJsonObj.get("ST").equals("1")) cnt++;
			}
		}catch(Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		return cnt;
	}

}
