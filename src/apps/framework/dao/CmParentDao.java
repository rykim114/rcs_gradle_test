package apps.framework.dao;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.ibatis.session.RowBounds;
import org.mybatis.spring.support.SqlSessionDaoSupport;

import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.utils.CmFunction;

@SuppressWarnings("rawtypes")
public class CmParentDao extends SqlSessionDaoSupport{
	
	protected Log logger = LogFactory.getLog(this.getClass());
	
	/*protected SqlSessionTemplate sqlSessionTemplate;
	
	public void setSqlSessionTemplate(SqlSessionTemplate sqlSession) {
		this.sqlSessionTemplate = sqlSession;
	}*/
	
	private void printstatementName(String sql_id) {
		if (logger.isDebugEnabled()) {
			logger.debug("$$$$ SQL ID : " + sql_id);
		}
	}
	
	private void setCommonParameterSetting(Object parameterObject) {
		
		if (parameterObject == null) {
			return;
		}
		if ( !(parameterObject instanceof CmMap) ) {
			return;
		}
		
		CmMap reqVo = (CmMap) parameterObject;
		
		String requestUrl = null;
		try {
			if ( CmFunction.getCurrentRequest() != null){
				
				requestUrl = CmFunction.getCurrentRequest().getRequestURL().toString();
				
				if (requestUrl.toLowerCase().indexOf("https") > -1 )  {
					reqVo.put("i_sFlagSSL", "Y");
				}
				
				CmMap tempVo = new CmMap();
				CmFunction.setSessionValue(CmFunction.getCurrentRequest(), tempVo);
			}
			
		} catch (Exception e) {
			//logger.error(e); //e.printStackTrace();
			throw e;
		}
		
	}
	
	public Object selectOne(String statementName) {
		this.printstatementName(statementName);
		return this.getSqlSession().selectOne(statementName);
	}
	
	
	public Object selectOne(String statementName, Object parameterObject) {
		this.printstatementName(statementName);
		this.setCommonParameterSetting(parameterObject);
		return this.getSqlSession().selectOne(statementName, parameterObject);
	}
	
	public List selectList(String statementName) {
		this.printstatementName(statementName);
		return this.getSqlSession().selectList(statementName);
	}
	

	public List selectList(String statementName, Object parameterObject) {
		this.printstatementName(statementName);
		this.setCommonParameterSetting(parameterObject);
		return this.getSqlSession().selectList(statementName, parameterObject);
	}
	
	
	public List selectList(String statementName, Object parameterObject, RowBounds rowBounds) {
		this.printstatementName(statementName);
		this.setCommonParameterSetting(parameterObject);
		return this.getSqlSession().selectList(statementName, parameterObject, rowBounds);
	}
	
	public Map selectMap(String statementName, String mapKey) {
		this.printstatementName(statementName);
		return this.getSqlSession().selectMap(statementName, mapKey);
	}
	

	public Map selectMap(String statementName, Object parameterObject, String mapKey) {
		this.printstatementName(statementName);
		this.setCommonParameterSetting(parameterObject);
		return this.getSqlSession().selectMap(statementName, parameterObject, mapKey);
	}
	
	
	public Map selectMap(String statementName, Object parameterObject, String mapKey, RowBounds rowBounds) {
		this.printstatementName(statementName);
		this.setCommonParameterSetting(parameterObject);
		return this.getSqlSession().selectMap(statementName, parameterObject, mapKey, rowBounds);
	}
	
	
	
	/**
	 * insert
	 * @param statementName
	 * @return
	 */
	public int insert(String statementName) {
		this.printstatementName(statementName);
		return this.getSqlSession().insert(statementName);
	}
	

	/**
	 * 
	 * @param statementName
	 * @param parameterObject
	 * @return
	 */
	public int insert(String statementName, Object parameterObject) {
		this.printstatementName(statementName);
		this.setCommonParameterSetting(parameterObject);
		return this.getSqlSession().insert(statementName, parameterObject);
	}
	
	/**
	 * 
	 * @param statementName
	 * @return
	 */
	public int update(String statementName) {
		this.printstatementName(statementName);
		return this.getSqlSession().update(statementName);
	}

	/**
	 * 
	 * @param statementName
	 * @param parameterObject
	 * @return
	 */
	public int update(String statementName, Object parameterObject) {
		this.printstatementName(statementName);
		this.setCommonParameterSetting(parameterObject);
		return this.getSqlSession().update(statementName, parameterObject);
	}
	
	/**
	 * 
	 * @param statementName
	 * @return
	 */
	public int delete(String statementName) {
		this.printstatementName(statementName);
		return this.getSqlSession().delete(statementName);
	}
	
	
	/**
	 * 
	 * @param statementName
	 * @param parameterObject
	 * @return
	 */
	public int delete(String statementName, Object parameterObject) {
		this.printstatementName(statementName);
		this.setCommonParameterSetting(parameterObject);
		return this.getSqlSession().delete(statementName, parameterObject);
	}
	
	
	/**
	 * 
	 * @param statementName
	 * @return
	 */
	public int getCount(String statementName) {
		this.printstatementName(statementName);
		return (Integer)this.selectOne(statementName);
	}
	

	/**
	 * 
	 * @param statementName
	 * @param parameterObject
	 * @return
	 */
	public int getCount(String statementName, Object parameterObject) {
		return (Integer)this.selectOne(statementName, parameterObject);
	}
	
	/**
	 * 
	 * @param statementName
	 * @return
	 */
	public CmResMap getObject(String statementName) {
		return (CmResMap) this.selectOne(statementName);
	}
	

	/**
	 * 
	 * @param statementName
	 * @param parameterObject
	 * @return
	 */
	public CmResMap getObject(String statementName, Object parameterObject) {
		return (CmResMap) this.selectOne(statementName, parameterObject);
	}
	
	/**
	 * 
	 * @param statementName
	 * @return
	 */
	public LinkedHashMap  getLHObject(String statementName) {
		return (LinkedHashMap ) this.selectOne(statementName);
	}
	
	/**
	 * 
	 * @param statementName
	 * @param parameterObject
	 * @return
	 */
	public LinkedHashMap  getLHObject(String statementName, Object parameterObject) {
		return (LinkedHashMap ) this.selectOne(statementName, parameterObject);
	}
	
	
	/**
	 * 
	 * @param statementName
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<CmResMap> getList(String statementName) {
		return (List<CmResMap>)this.selectList(statementName);
	}
	

	/**
	 * 
	 * @param statementName
	 * @param parameterObject
	 * @param skipResults
	 * @param maxResults
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<CmResMap> getList(String statementName, RowBounds rowBounds) {
		return (List<CmResMap>)this.selectList(statementName, rowBounds);
	}
	
	/**
	 * 
	 * @param statementName
	 * @param parameterObject
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<CmResMap> getList(String statementName, Object parameterObject) {
		return (List<CmResMap>)this.selectList(statementName, parameterObject);
	}
	
	/**
	 * 
	 * @param statementName
	 * @param parameterObject
	 * @param skipResults
	 * @param maxResults
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<CmResMap> getList(String statementName, Object parameterObject, RowBounds rowBounds) {		
		return (List<CmResMap>)this.selectList(statementName, parameterObject, rowBounds);
	}
	
	
	
	@SuppressWarnings("unchecked")
	public List<String> getSList(String statementName, Object parameterObject) {
		return (List<String>)this.selectList(statementName, parameterObject);
	}
	@SuppressWarnings("unchecked")
	public List<String> getSList(String statementName, Object parameterObject, RowBounds rowBounds) {		
		return (List<String>)this.selectList(statementName, parameterObject, rowBounds);
	}
	
	/**
	 * 
	 * @param statementName
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<LinkedHashMap> getLHList(String statementName) {
		return (List<LinkedHashMap>)this.selectList(statementName);
	}
	

	/**
	 * 
	 * @param statementName
	 * @param parameterObject
	 * @param skipResults
	 * @param maxResults
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<LinkedHashMap> getLHList(String statementName, RowBounds rowBounds) {
		return (List<LinkedHashMap>)this.selectList(statementName, rowBounds);
	}
	
	/**
	 * 
	 * @param statementName
	 * @param parameterObject
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<LinkedHashMap> getLHList(String statementName, Object parameterObject) {
		return (List<LinkedHashMap>)this.selectList(statementName, parameterObject);
	}
	
	/**
	 * 
	 * @param statementName
	 * @param parameterObject
	 * @param skipResults
	 * @param maxResults
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<LinkedHashMap> getHLList(String statementName, Object parameterObject, RowBounds rowBounds) {		
		return (List<LinkedHashMap>)this.selectList(statementName, parameterObject, rowBounds);
	}
	
	
	/**
	 * 
	 * @param statementName
	 * @param parameterObject
	 * @param keyProperty
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public Map<String, CmResMap> getMap(String statementName, Object parameterObject, String keyProperty) {
		return (Map<String, CmResMap>)this.selectMap(statementName, parameterObject, keyProperty);
	}
		
	public String getString(String statementName, Object parameterObject) {
		return (String)this.selectOne(statementName, parameterObject);
	}
	
	public String getString(String statementName) {
		return (String)this.selectOne(statementName);
	}
}
