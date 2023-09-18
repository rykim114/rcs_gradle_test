package apps.framework.object;

import java.io.Serializable;
import java.util.Map;

import org.apache.commons.collections.FastHashMap;
import org.springframework.util.SerializationUtils;

import apps.framework.utils.CmPathInfo;
import apps.framework.utils.CmSecretUtil;

@SuppressWarnings("rawtypes")
public class CmMap<K, V> extends FastHashMap implements Map, Serializable{
	
	private static final long serialVersionUID = 1L;
	
	
	//private static  LinkedHashMap map;
	
	
	public Object get(Object key) {
		
		//java 에서 암호화를 하자 ( java <- > DB )
		if (key.toString().toLowerCase().startsWith("decrypt_")) {			
			String dec_value = map.get(key)+"";			
			try {
				dec_value = CmSecretUtil.decodeAES_Base64(dec_value+"", CmPathInfo.getSECRET_AES_DB_KEY());
			}catch (Exception ex) {
				dec_value =  map.get(key)+"";
			}			
			return dec_value;
		}else if (key.toString().toLowerCase().startsWith("encrypt_")) {
			
			String enc_value = map.get(key)+"";			
			
			if (enc_value == null || enc_value.equals("") || enc_value.equals("null")) {
				String keystr = key.toString().toLowerCase();
				keystr = keystr.replaceAll("encrypt_", "");
				enc_value = map.get(keystr)+"";			 
			}
			
			try {
				enc_value = CmSecretUtil.encodeAES_Base64(enc_value+"", CmPathInfo.getSECRET_AES_DB_KEY());
			}catch (Exception ex) {
				enc_value =  map.get(key)+"";
			}			
			return enc_value;
			
		}else {			
			return map.get(key);			
		}
	}
	
	
	/**
	 * 
	 * @param key
	 * @return
	 */
	public int getInt(String key) {
		int result = 0;
		
		try {
			result = Integer.parseInt(String.valueOf(map.get(key)));
		} catch (Exception e) {
			result = 0; 
		}
		
		return result;
	}
	
	/**
	 * 
	 * @param key
	 * @param defaultValue
	 * @return
	 */
	public int getInt(String key, int defaultValue) {
		int result = 0;
		
		try {
			result = Integer.parseInt(String.valueOf(map.get(key)));
		} catch (Exception e) {
			result = defaultValue; 
		}
		
		return result;
	}
	
	/**
	 * 
	 * @param key
	 * @return
	 */
	public long getLong(String key) {
		long result = 0;
		
		try {
			result = Long.parseLong(String.valueOf(map.get(key)));
		} catch (Exception e) {
			result = 0; 
		}
		return result;
	}
	
	public double getDouble(String key) {
		double result = 0;
		
		try {
			result = Double.parseDouble(String.valueOf(map.get(key)));
		} catch (Exception e) {
			result = 0;
		}
		return result;
	}
	
	/**
	 * 
	 * @param key
	 * @return
	 */
	public String getString(String key) {
		String result = "";
		
		try {
			result = (map.get(key) == null ? "" : String.valueOf(map.get(key)));
		} catch (Exception e) {
			result = "";
		}
		
		return result;
	}
	
	/**
	 * 
	 * @param key
	 * @param defaultValue
	 * @return
	 */
	public String getString(String key, String defaultValue) {
		String result = "";
		
		try {
			result = (map.get(key) == null ? defaultValue : String.valueOf(map.get(key)));
		} catch (Exception e) {
			result = defaultValue;
		}
		
		return result;
	}
	
	/**
	 * 
	 * @param key
	 * @return
	 */
	public String[] getStringArray(String key) {
		if (map.get(key) == null)
			return null;
		
		if (!map.get(key).getClass().isArray()) {
			return new String[] { (String)map.get(key) };
		}
		
		return (String[])map.get(key);
	}
	
	/**
	 * 해당 key 값이 null or 빈값 일경우 defaultVal 값 삽입
	 * @param key
	 * @param defaultVal
	 */
	public void putDefault(String key, String defaultVal) {
		this.putAnullB(key, this.getString(key), defaultVal);
	}
	
	/**
	 * value1 빈값일 경우 value2 로 대체
	 * @param key
	 * @param value1
	 * @param value2
	 */
	public void putAnullB(String key, String value1, String value2) {
		String value = (value1 != null && !value1.equals("")) ? value1 : value2;
		this.put(key, value);
	}
	
	
	public String getOnlyNumber(String key) {
		String 			str = this.getString(key);
		StringBuffer 	sb 	= new StringBuffer();
		if (str != null) {
			int len		= str.length();
			for (int i = 0; i < len; i++) {
				char	c	= str.charAt(i);
				if ((i == 0 && c == '-') || (c >= '0' && c <= '9')) {
					sb.append(c);
	           }				
			}
		}
		return sb.toString();
		
	}
	
	public byte[] getBytes(String key) {
		
		return SerializationUtils.serialize(map.get(key));
		
	}
}
