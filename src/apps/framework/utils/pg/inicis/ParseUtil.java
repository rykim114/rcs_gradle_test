package apps.framework.utils.pg.inicis;

import java.util.Iterator;
import java.util.Map;
import java.util.TreeMap;

/**
 * key=value&key=value&key=value
 * 문자열 잘라줍니다.
 **/
 public class ParseUtil{
	
	private final static String and		= "&";
	private final static String equals	= "=";
	
	public String parseMapToString(Map<String, String> parameters) throws Exception
	{
		StringBuffer serializeString = new StringBuffer("");

		Map<String, String> sortedParamMap = new TreeMap<String, String>();
		sortedParamMap.putAll(parameters);
		Iterator<Map.Entry<String, String>> pairs = sortedParamMap.entrySet().iterator();
		while (pairs.hasNext()) {
			Map.Entry<String, String> pair = pairs.next();


			if ("class".equals(pair.getKey())) {
					continue;
			}
			
			serializeString.append(pair.getKey());
			serializeString.append(equals);
			serializeString.append((pair.getValue() == null)?"":pair.getValue());

			if (pairs.hasNext()) serializeString.append(and);
		}

		return serializeString.toString();
	}
	
}


