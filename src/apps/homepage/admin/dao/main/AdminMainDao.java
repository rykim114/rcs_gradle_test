package apps.homepage.admin.dao.main;

import java.util.List;

import org.springframework.stereotype.Repository;

import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;


@Repository
@SuppressWarnings("rawtypes")
public class AdminMainDao extends CmDaoExt{
	public List<CmResMap> getUserPgmList(CmMap reqVo) {
		return this.cmDao.getList("AdminMainDao.getUserPgmList.select", reqVo);
	}
	
	public List<CmResMap> getUserPgmLvl(CmMap reqVo) {
		return this.cmDao.getList("AdminMainDao.getPgmLvl.select", reqVo);
	}
	
	public void updateMenuTime(CmMap reqVo) {
		this.cmDao.update("AdminMainDao.updateMenuTime", reqVo);
	}
	
	
	public void insertMenuLog(CmMap reqVo) {
		this.cmDao.insert("AdminMainDao.insertMenuLog", reqVo);
	} 	
	
	public void insertMenuBtnLog(CmMap reqVo) {
		this.cmDao.insert("AdminMainDao.insertMenuBtnLog", reqVo);
	}
	
	public void insertMenuDownBtnLog(CmMap reqVo) {
		this.cmDao.insert("AdminMainDao.insertMenuDownBtnLog", reqVo);
	}
}
