package apps.homepage.common.dao.core;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;
import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;

@Repository
@SuppressWarnings("rawtypes")
public class TelNumberConfirmDao extends CmDaoExt {
	/** The Constant logger. */
	protected final Log logger = LogFactory.getLog(this.getClass());
	
	public CmResMap getVendorNo(CmMap reqVo) {
		return this.cmDao.getObject("TelNumberConfirmDao.getVendorNum", reqVo);
	}
}
