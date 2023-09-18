package apps.framework.utils.pg.inicis;

import java.security.MessageDigest;
import java.security.SignatureException;
import java.util.Calendar;
import java.util.Iterator;
import java.util.Map;
import java.util.TreeMap;

/**
 *	oid, ,price timestamp를 가지고 암호화하는 Class
 *	timestamp를 getTimeInMillis로 구해옵니다.
 *
 */
public class SignatureUtil{
	
	private final static String and		= "&";
	private final static String equals	= "=";
	
	public String makeSignature(Map<String, String> parameters) throws Exception {

		if (parameters == null || parameters.isEmpty()) {
			throw new RuntimeException("Parameters can not be empty.");
		}

		String parametersString = calculateString(parameters);

		String signature = hash(parametersString, "SHA-256");

		return signature;
	}
	
	private String calculateString(Map<String, String> parameters) throws SignatureException {
		StringBuffer stringToSign = new StringBuffer("");

		Map<String, String> sortedParamMap = new TreeMap<String, String>();
		sortedParamMap.putAll(parameters);
		Iterator<Map.Entry<String, String>> pairs = sortedParamMap.entrySet().iterator();
		while (pairs.hasNext()) {
			Map.Entry<String, String> pair = pairs.next();

			stringToSign.append(pair.getKey().trim());
			stringToSign.append(equals);
			stringToSign.append(pair.getValue().trim());

			if (pairs.hasNext()) stringToSign.append(and);
		}
		System.out.println("stringToSign.toString()="+stringToSign.toString()) ;
		return stringToSign.toString();
	}
	
	public String hash(String data, String algorithm) throws Exception {


		// SHA를 사용하기 위해 MessageDigest 클래스로부터 인스턴스를 얻는다.
		MessageDigest md = MessageDigest.getInstance(algorithm);

		// 해싱할 byte배열을 넘겨준다.
		// SHA-256의 경우 메시지로 전달할 수 있는 최대 bit 수는 2^64-1개 이다.
		md.update(data.getBytes("UTF-8"));

		// 해싱된 byte 배열을 digest메서드의 반환값을 통해 얻는다.
		byte[] hashbytes = md.digest();

		// 보기 좋게 16진수로 만드는 작업
		StringBuilder sbuilder = new StringBuilder();
		for(int i=0 ; i<hashbytes.length ; i++){

			// %02x 부분은 0 ~ f 값 까지는 한자리 수이므로 두자리 수로 보정하는 역할을 한다.
			sbuilder.append(String.format("%02x", hashbytes[i] & 0xff));

		}

		return sbuilder.toString();
	}
	
	public static String getTimestamp() {
		Calendar cal = Calendar.getInstance();
		return cal.getTimeInMillis()+"";
	}
}