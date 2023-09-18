package apps.homepage.common.utils.core;

public class StringUtil {
	public static String ifNull(String str, String defaultStr) {
		if (str == null)
			return defaultStr;
		else 
			return str;
	}
	
	public static String ifNull(String str) {
		return ifNull(str, "");
	}
}
