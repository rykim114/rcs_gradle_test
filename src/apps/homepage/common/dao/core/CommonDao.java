package apps.homepage.common.dao.core;

import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Repository;
import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;


@Repository
@SuppressWarnings("rawtypes")
public class CommonDao extends CmDaoExt {

	/** The Constant logger. */
	protected final Logger logger = LogManager.getLogger(this.getClass());
	
	public void logInsertSysLog(CmMap reqVo){
		this.cmDao.insert("CommonDao.logInsertSysLog", reqVo);
	}
	
	public String PgmAuth(CmMap reqVo){
		return this.cmDao.getString("CommonDao.PgmAuth", reqVo);
	}
	
	public List<CmResMap> XmlSelectsql(String sqlname, CmMap reqVo) {
		return this.cmDao.getList(sqlname, reqVo);
	}
	
	/**
	 * 공통 코드 조회
	 * @param reqVo
	 */
	public List<CmResMap> getCommCodeList(CmMap reqVo) {
		return this.cmDao.getList("CommonDao.getCommCodeList", reqVo);
	}
}
