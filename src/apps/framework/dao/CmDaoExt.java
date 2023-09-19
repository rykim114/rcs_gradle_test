package apps.framework.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

@SuppressWarnings("rawtypes")

public class CmDaoExt {
	protected Log	logger	= LogFactory.getLog(this.getClass());
	
	@Autowired
	protected CmDao cmDao;
	
	@Autowired
	protected CmOracleDao cmOracleDao;	
	
		
	public CmDao getCmDao() {
		return this.cmDao;
	}

	public void setCmDao(CmDao cmDao) {
		this.cmDao = cmDao;
	}
	
	public CmOracleDao getCmOracleDao() {
		return this.cmOracleDao;
	}
	
	public void setCmOracleDao(CmOracleDao cmOracleDao) {
		this.cmOracleDao = cmOracleDao;
	}
		
	

}
