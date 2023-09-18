package apps.framework.dao;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;

import apps.framework.dao.CmDao;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.utils.CmFunction;
import apps.framework.utils.CmPathInfo;

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
