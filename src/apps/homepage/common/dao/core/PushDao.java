package apps.homepage.common.dao.core;

import java.util.List;

import org.springframework.stereotype.Repository;

import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;


@Repository
@SuppressWarnings("rawtypes")
public class PushDao extends CmDaoExt{
	public List<CmResMap> selectDeviceInfo(CmMap reqVo) {
		return this.cmDao.getList("PushDao.selectDeviceInfo", reqVo);
	}
	
	public CmResMap selectPushInfo(CmMap reqVo) {
		return this.cmDao.getObject("PushDao.selectPushInfo",reqVo);
	}
	
	public void insertPush(CmMap reqVo){		
		this.cmDao.update("PushDao.insertPush", reqVo);
	}

	public List<CmResMap> selectUserInfo(CmMap reqVo) {
		return this.cmDao.getList("PushDao.selectUserInfo", reqVo);
	}
	
}
