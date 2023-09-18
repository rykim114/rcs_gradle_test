package apps.homepage.common.dao.core;


import java.util.List;

import org.springframework.stereotype.Repository;

import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;


@Repository
@SuppressWarnings("rawtypes")
public class CommDao extends CmDaoExt{
	
	public CmResMap getDBConnectCheck(CmMap reqVo) {
		return this.cmDao.getObject("CommDao.getDBConnectCheck",reqVo);
	}

	public List<CmResMap> getCommCodeList(CmMap reqVo) {
		return this.cmDao.getList("CommDao.getCommCodeList", reqVo);
	}

	public void insertEmailSendHistory(CmMap reqVo){
		//if (getProperties("smode").equals("")) {
			this.cmDao.update("CommDao.insertEmailSendHistory", reqVo);
		//}
	}

	public CmResMap getPgmCodePageLink(CmMap reqVo) {
		return this.cmDao.getObject("CommDao.getPgmCodePageLink",reqVo);
	}

	public void insertNiceSendHistory(CmMap reqVo){
		//if (getProperties("smode").equals("")) {
			this.cmDao.update("CommDao.insertNiceSendHistory", reqVo);
		//}
	}
}