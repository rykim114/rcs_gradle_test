package apps.framework.object;

import java.io.Reader;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import apps.framework.utils.CmPathInfo;
import apps.framework.utils.CmSecretUtil;

@SuppressWarnings("rawtypes")
public class CmResMap<K, V> extends CmMap{
	
	private Log	logger	= LogFactory.getLog(this.getClass());
	
	
	private static final long serialVersionUID = 1L;
	
	@Override
	public Object get(Object key) {
		return super.get(key.toString().toLowerCase());
	}

	/**
	 * 
	 */
	@SuppressWarnings("unchecked")
	@Override
	public Object put(Object key, Object value) {
		
		//java 에서 암호화를 하자 ( java <- > DB )
		if (key.toString().toLowerCase().startsWith("decrypt_")) {			
			String dec_value = value+"";		
			String dec_key = key.toString().toLowerCase().replaceAll("decrypt_", "");
			try {
				dec_value = CmSecretUtil.decodeAES_Base64(value+"", CmPathInfo.getSECRET_AES_DB_KEY());				
			}catch (Exception ex) {
				dec_value = value+"";				
			}			
			return map.put(dec_key , dec_value);
		}else if (key.toString().toLowerCase().startsWith("encrypt_")) {			
			String enc_value = value+"";
			String enc_key = key.toString().toLowerCase().replaceAll("encrypt_", "");
			try {
				enc_value = CmSecretUtil.encodeAES_Base64(value+"", CmPathInfo.getSECRET_AES_DB_KEY());
			}catch (Exception ex) {
				enc_value = value+"";
			}			
			return map.put(enc_key , enc_value);
			
		}else {
			if (value instanceof oracle.sql.CLOB) {
				return map.put(key.toString().toLowerCase() , clobToString((oracle.sql.CLOB)value));
			}else {
				return map.put(key.toString().toLowerCase() , value);
			}
		}
	}
	
	/**
	 * 
	 * @param clob
	 * @return
	 */
	private String clobToString ( oracle.sql.CLOB clob ) {
		StringBuilder	sbf		= new StringBuilder();
		Reader			rd		= null;
		char[]			buf		= new char[1024];
		int				readCnt	= 0;
		
		try {
			rd	= clob.getCharacterStream(0l);
			while ((readCnt = rd.read(buf, 0, 1024)) != -1 ) {
				sbf.append(buf, 0, readCnt);
			}
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		} finally {
			try {
				if (rd != null){
					rd.close();
				}
			} catch (Exception e) {
				logger.error(e); //e.printStackTrace();
			}
		}
		
		return sbf.toString();
	}
}
