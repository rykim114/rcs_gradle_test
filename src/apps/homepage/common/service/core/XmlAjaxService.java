package apps.homepage.common.service.core;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import com.fasterxml.jackson.databind.ObjectMapper;

import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.service.CmService;
import apps.homepage.common.dao.core.XmlAjaxDao;
import apps.homepage.common.utils.core.DataRun;


@Service
@SuppressWarnings("rawtypes")
public class XmlAjaxService extends CmService {
	
	/** The Constant logger. */
	protected final Log	logger = LogFactory.getLog(this.getClass());
	
	@Autowired
	private XmlAjaxDao xmlAjaxDao;
	
	@Autowired
	private DataSourceTransactionManager transactionManager;
	
	
	public String selectXmlAjax(String zAction, String zSqlFile, String zSqlId, String zReturnType, String zRowSeparate, String zColSeparate, CmMap params, Map<String, Object> model) throws Exception {
		String sqlInfo = zSqlFile + "Dao." + zSqlId + "." + zAction;
		
		List<CmResMap> datas = null;
		
		if (StringUtils.containsIgnoreCase(zSqlFile, "oracle")) {
			datas = xmlAjaxDao.selectXmlAjaxOracle(sqlInfo, params);
		} else {
			datas = xmlAjaxDao.selectXmlAjax(sqlInfo, params);
		}

		return DataRun.getResult(zReturnType, datas, zRowSeparate, zColSeparate, 0);
	}
	
	public void insertXmlAjax(String zAction, String zSqlFile, String zSqlId, String zReturnType, String zRowSeparate, String zColSeparate, CmMap params, Map<String, Object> model) throws Exception {
		String sqlInfo = zSqlFile + "Dao." + zSqlId + "." + zAction;
		xmlAjaxDao.insertXmlAjax(sqlInfo, params);
	}
	
	public void updateXmlAjax(String zAction, String zSqlFile, String zSqlId, String zReturnType, String zRowSeparate, String zColSeparate, CmMap params, Map<String, Object> model) throws Exception {
		String sqlInfo = zSqlFile + "Dao." + zSqlId + "." + zAction;
		xmlAjaxDao.updateXmlAjax(sqlInfo, params);
	}
	
	public void deleteXmlAjax(String zAction, String zSqlFile, String zSqlId, String zReturnType, String zRowSeparate, String zColSeparate, CmMap params, Map<String, Object> model) throws Exception {
		String sqlInfo = zSqlFile + "Dao." + zSqlId + "." + zAction;
		xmlAjaxDao.deleteXmlAjax(sqlInfo, params);
	}
	

	public void XmlAjaxUpdate(String zSqlFile, String zSqlId, String zReturnType, String zRowSeparate, String zColSeparate, int insertCnt, int updateCnt, int deleteCnt, CmMap params, String companyCode, String userId, String userIp, Map<String, Object> model) throws Exception {
		DefaultTransactionDefinition def = new DefaultTransactionDefinition();
        def.setName("XmlAjaxUpdate-Transaction");
        def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        TransactionStatus status = transactionManager.getTransaction(def);
        
		int insertFinishCnt = 0;
		int updateFinishCnt = 0;
		int deleteFinishCnt = 0;
		
		String sqlInfo = zSqlFile + "Dao." + zSqlId + ".";
		
		try {
			if ( insertCnt > 0 ) {
				ArrayList datas = (ArrayList) params.get("insertData");
				
				for ( int i = 0; i < datas.size(); i++ ) {
					CmMap reqVe = new CmMap();
					reqVe.put("companyCode", companyCode);
					reqVe.put("userId"     , userId);
					reqVe.put("userIp"     , userIp);
					
					LinkedHashMap data     = (LinkedHashMap) datas.get(i);
					Set <String> keySet    = data.keySet();
					Iterator <String> iter = keySet.iterator();
					
					while ( iter.hasNext() ) {
						String key   = (String) iter.next();
						reqVe.put(key, data.get(key) != null ? data.get(key).toString() : "");
					}
					
					xmlAjaxDao.insertXmlAjax(sqlInfo + "insert", reqVe);
					
					insertFinishCnt++;
				}
				
				model.put("insertCnt"      , insertCnt);
				model.put("insertRealCnt"  , datas.size());
				model.put("insertFinishCnt", insertFinishCnt);
			}
			
			if ( updateCnt > 0 ) {
				ArrayList datas = (ArrayList) params.get("updateData");
				
				for ( int i = 0; i < datas.size(); i++ ) {
					CmMap reqVe = new CmMap();
					reqVe.put("companyCode", companyCode);
					reqVe.put("userId"     , userId);
					reqVe.put("userIp"     , userIp);
					
					LinkedHashMap data     = (LinkedHashMap) datas.get(i);
					Set <String> keySet    = data.keySet();
					Iterator <String> iter = keySet.iterator();
					
					while ( iter.hasNext() ) {
						String key   = (String) iter.next();
						reqVe.put(key, data.get(key) != null ? data.get(key).toString() : "");
					}
					
					xmlAjaxDao.updateXmlAjax(sqlInfo + "update", reqVe);
					
					updateFinishCnt++;
				}
	
				model.put("updateCnt"      , updateCnt);
				model.put("updateRealCnt"  , datas.size());
				model.put("updateFinishCnt", updateFinishCnt);
			}
			
			if ( deleteCnt > 0 ) {
				ArrayList datas = (ArrayList) params.get("deleteData");
				
				for ( int i = 0; i < datas.size(); i++ ) {
					CmMap reqVe = new CmMap();
					reqVe.put("companyCode", companyCode);
					reqVe.put("userId"     , userId);
					reqVe.put("userIp"     , userIp);
					
					LinkedHashMap data     = (LinkedHashMap) datas.get(i);
					Set <String> keySet    = data.keySet();
					Iterator <String> iter = keySet.iterator();
					
					while ( iter.hasNext() ) {
						String key   = (String) iter.next();
						reqVe.put(key, data.get(key) != null ? data.get(key).toString() : "");
					}
					
					xmlAjaxDao.deleteXmlAjax(sqlInfo + "delete", reqVe);
					
					deleteFinishCnt++;
				}
	
				model.put("deleteCnt"      , deleteCnt);
				model.put("deleteRealCnt"  , datas.size());
				model.put("deleteFinishCnt", deleteFinishCnt);
			}
	
			if ( ! zReturnType.equals("") ) {
				CmMap returnParams = getParamsToCmMap(params, "returnParams");
				
				returnParams.put("companyCode", companyCode);
				returnParams.put("userId"     , userId);
				returnParams.put("userIp"     , userIp);

				List<CmResMap> datas = xmlAjaxDao.selectXmlAjax(sqlInfo + "select", returnParams);
				
				model.put("datas", DataRun.getResult(zReturnType, datas, zRowSeparate, zColSeparate, 0));
			}
		} catch (Exception e) {
			transactionManager.rollback(status);
			throw e;
		}
		
		transactionManager.commit(status);
	}
	

	public void XmlAjaxUpdateModal(String zSqlFile, String zSqlId, String zReturnType, String zRowSeparate, String zColSeparate, int insertCnt, int updateCnt, int deleteCnt, CmMap params, String companyCode, String userId, String userIp, Map<String, Object> model) throws Exception {
		DefaultTransactionDefinition def = new DefaultTransactionDefinition();
        def.setName("XmlAjaxUpdate-Transaction");
        def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        TransactionStatus status = transactionManager.getTransaction(def);
        
		int insertFinishCnt = 0;
		int updateFinishCnt = 0;
		int deleteFinishCnt = 0;
		
		String sqlInfo = zSqlFile + "Dao." + zSqlId + ".";
		
		try {
			if ( insertCnt > 0 ) {
				ArrayList datas = (ArrayList) params.get("insertData");
				
				for ( int i = 0; i < datas.size(); i++ ) {
					CmMap reqVe = new CmMap();
					reqVe.put("companyCode", companyCode);
					reqVe.put("userId"     , userId);
					reqVe.put("userIp"     , userIp);
					
					LinkedHashMap data     = (LinkedHashMap) datas.get(i);
					Set <String> keySet    = data.keySet();
					Iterator <String> iter = keySet.iterator();
					
					while ( iter.hasNext() ) {
						String key   = (String) iter.next();
						reqVe.put(key, data.get(key) != null ? data.get(key).toString() : "");
					}
					
					xmlAjaxDao.insertXmlAjax(sqlInfo + "insert", reqVe);
					
					insertFinishCnt++;
				}
				
				model.put("insertCnt"      , insertCnt);
				model.put("insertRealCnt"  , datas.size());
				model.put("insertFinishCnt", insertFinishCnt);
			}
			
			if ( updateCnt > 0 ) {
				ArrayList datas = (ArrayList) params.get("updateData");
				
				for ( int i = 0; i < datas.size(); i++ ) {
					CmMap reqVe = new CmMap();
					reqVe.put("companyCode", companyCode);
					reqVe.put("userId"     , userId);
					reqVe.put("userIp"     , userIp);
					
					LinkedHashMap data     = (LinkedHashMap) datas.get(i);
					Set <String> keySet    = data.keySet();
					Iterator <String> iter = keySet.iterator();
					
					while ( iter.hasNext() ) {
						String key   = (String) iter.next();
						reqVe.put(key, data.get(key) != null ? data.get(key).toString() : "");
					}
					
					xmlAjaxDao.updateXmlAjax(sqlInfo + "update", reqVe);
					
					updateFinishCnt++;
				}
	
				model.put("updateCnt"      , updateCnt);
				model.put("updateRealCnt"  , datas.size());
				model.put("updateFinishCnt", updateFinishCnt);
			}
			
			if ( deleteCnt > 0 ) {
				ArrayList datas = (ArrayList) params.get("deleteData");
				
				for ( int i = 0; i < datas.size(); i++ ) {
					CmMap reqVe = new CmMap();
					reqVe.put("companyCode", companyCode);
					reqVe.put("userId"     , userId);
					reqVe.put("userIp"     , userIp);
					
					LinkedHashMap data     = (LinkedHashMap) datas.get(i);
					Set <String> keySet    = data.keySet();
					Iterator <String> iter = keySet.iterator();
					
					while ( iter.hasNext() ) {
						String key   = (String) iter.next();
						reqVe.put(key, data.get(key) != null ? data.get(key).toString() : "");
					}
					
					xmlAjaxDao.deleteXmlAjax(sqlInfo + "delete", reqVe);
					
					deleteFinishCnt++;
				}
	
				model.put("deleteCnt"      , deleteCnt);
				model.put("deleteRealCnt"  , datas.size());
				model.put("deleteFinishCnt", deleteFinishCnt);
			}
	
			if ( ! zReturnType.equals("") ) {
//				CmMap returnParams = getParamsToCmMap(params, "returnParams");
//				
//				returnParams.put("companyCode", companyCode);
//				returnParams.put("userId"     , userId);
//				returnParams.put("userIp"     , userIp);
//
//				List<CmResMap> datas = xmlAjaxDao.selectXmlAjax(sqlInfo + "select", returnParams);
//				
//				model.put("datas", DataRun.getResult(zReturnType, datas, zRowSeparate, zColSeparate, 0));
			}
		} catch (Exception e) {
			transactionManager.rollback(status);
			throw e;
		}
		
		transactionManager.commit(status);
	}
	
	private CmMap getParamsToCmMap(CmMap cmMap, String key) throws Exception {
		CmMap params = new CmMap();
		
		if ( cmMap != null ) {
			if ( cmMap.get(key).getClass().toString().equals("class java.lang.String") ) {
				JSONObject paramJson = new JSONObject(cmMap.getString(key));
				
				if ( paramJson != null ) {
					params = new ObjectMapper().readValue(paramJson.toString(), CmMap.class);
				}
			} else {
				LinkedHashMap lhMap = (LinkedHashMap) cmMap.get(key);
				
				if ( lhMap != null ) {
					params = getMapToCmMap(lhMap);
				}
			}
		}
		
		return params;
	}
	
	private CmMap getMapToCmMap(Map map) throws Exception {
		CmMap cmMap = new CmMap();
		
		Iterator<String> iter = map.keySet().iterator();
		while ( iter.hasNext() ) {
			String key = iter.next();
			cmMap.put(key, map.get(key));
		}
		
		return cmMap;
	}
}
