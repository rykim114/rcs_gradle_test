package apps.homepage.common.utils.core.push;

public class PushResult {

	// 결과 코드
	private String resultCode;
	
	// 결과 메시지
	private String resultMsg;
	
	public String getResultCode() {
		return resultCode;
	}

	public void setResultCode(String resultCode) {
		this.resultCode = resultCode;
	}

	public String getResultMsg() {
		return resultMsg;
	}

	public void setResultMsg(String resultMsg) {
		this.resultMsg = resultMsg;
	}

	public PushResult(String resultCode, String resultMsg) {
		super();
		this.resultCode = resultCode;
		this.resultMsg = resultMsg;
	}
	
	
}
