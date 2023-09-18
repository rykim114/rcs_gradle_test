package apps.homepage.common.service.core;

import java.util.Map;

import org.springframework.stereotype.Service;

import apps.framework.object.CmMap;

@Service
public interface TelNumberConfirmService {
	final String TN_CONFIRM_URL = "https://callbackno.cloudfax.co.kr/Interface/IFHttp/CallbackNoProxy.aspx"; // 인증시스템 URL
	final String BIZTONG_LISENCE_KEY = "zHQlikmA75anxA9gPM+b1gY0LxcwH/0axdchy0/i6hpH/95LhdHmWVgNs0vaZIAR"; // 인증시스템 라이센스 키
	final String CONFIRM_LIST_FNAME = "ExistsCallbackNo"; // 리스트 리턴 함
	
	Map bizTongConfirmTelNumber(CmMap reqVo) throws Exception;
	int bizTongConfirmListTelNumber(CmMap reqVo) throws Exception;
}
