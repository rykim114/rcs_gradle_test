package apps.homepage.admin.dao.member;

import org.springframework.stereotype.Repository;
import java.util.List;

import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;

@Repository
@SuppressWarnings("rawtypes")
public class AdminLoginDao extends CmDaoExt {
	
	public int joinProc(CmMap reqVo) {
		return this.cmDao.update("AdminLoginDao.insertJoin", reqVo);
	}
	
	public CmResMap adminActionLogin(CmMap reqVo) {
		return this.cmDao.getObject("AdminLoginDao.adminActionLogin", reqVo);
	}

	public CmResMap adminCheckPcCount(CmMap reqVo) {
		return this.cmDao.getObject("AdminLoginDao.adminCheckPcCount", reqVo);
	}
	
	public List<CmResMap> adminoraclecheck(){		
		return this.cmOracleDao.getList("AdminLoginDao.oraclecheck");	
	}	
	
	
	public void insertLoginHistory(CmMap reqVo) {
		this.cmDao.update("AdminLoginDao.insertLoginHistory", reqVo);
	}
	
	public CmResMap adminActionLoginTry(CmMap reqVo) {
		return this.cmDao.getObject("AdminLoginDao.adminActionLoginTry", reqVo);
	}
	
	public void updateCountTagLogin(CmMap reqVo) {
		this.cmDao.update("AdminLoginDao.updateCountTag", reqVo);
	}

	public void updateLockTagLogin(CmMap reqVo) {
		this.cmDao.update("AdminLoginDao.updateLockTag", reqVo);
	}
	
	public void updateLogin(CmMap reqVo) {
		this.cmDao.update("AdminLoginDao.updateLogin", reqVo);
	}
	
	public void updateLogout(CmMap reqVo) {
		this.cmDao.update("AdminLoginDao.updateLogout", reqVo);
	}
	
	public void updatePassword(CmMap reqVo) {
		this.cmDao.update("AdminLoginDao.updatePassword", reqVo);
	}
	public void updatePasswordNext(CmMap reqVo) {
		this.cmDao.update("AdminLoginDao.updatePasswordNext", reqVo);
	}
	
	public void insertUserLoginHistory(CmMap reqVo) {
		this.cmDao.update("AdminLoginDao.insertUserLoginHistory", reqVo);
	}
	
	public void updateUserLoginHistory(CmMap reqVo) {
		this.cmDao.update("AdminLoginDao.updateUserLoginHistory", reqVo);
	}
	
	public void updateUserLoginHistorySessionKey(CmMap reqVo) {
		this.cmDao.update("AdminLoginDao.updateUserLoginHistorySessionKey", reqVo);
	}

	public void updateThreeMonthNoLoginUser() {
		this.cmDao.update("AdminLoginDao.updateThreeMonthNoLoginUser");
	}
}
