package apps.homepage.common.dao.core;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;


@Repository
@SuppressWarnings("rawtypes")
public class SendDao extends CmDaoExt {

	/** The Constant logger. */
	protected final Log	logger = LogFactory.getLog(this.getClass());
	
	
	public List<CmResMap> selectEmailSendHistory(CmMap reqVo) {
		return this.cmDao.getList("SendDao.selectEmailSendHistory", reqVo);
	}
	public List<CmResMap> selectSmSSendHistory(CmMap reqVo) {
		return this.cmDao.getList("SendDao.selectSmSSendHistory", reqVo);
	}	
}
