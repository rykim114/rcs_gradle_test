package apps.homepage.common.dao.custom.sign;

import java.util.List;

import org.springframework.stereotype.Repository;

import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;

@Repository
@SuppressWarnings("rawtypes")
public class SignDao extends CmDaoExt {

	public List<CmResMap> selectSignMyList(CmMap reqVo) {
		return this.cmDao.getList("AdminSignDao.selectSignMyList", reqVo);
	}

	public CmResMap selectSignPaper(CmMap reqVo) {
		return this.cmDao.getObject("AdminSignDao.selectSignPaper", reqVo);
	}

	public CmResMap selectSignDetail(CmMap reqVo) {
		return this.cmDao.getObject("AdminSignDao.selectSignDetail", reqVo);
	}

	public List<CmResMap> selectRecipientList(CmMap reqVo) {
		return this.cmDao.getList("AdminSignDao.selectRecipientList", reqVo);
	}
	
	public List<CmResMap> selectemaillist(CmMap reqVo) {
		return this.cmDao.getList("AdminSignDao.selectemaillist", reqVo);
	}	
	
	public List<CmResMap> selectSenderList(CmMap reqVo) {
		return this.cmDao.getList("AdminSignDao.selectSenderList", reqVo);
	}

	public int updateRecipientRead(CmMap reqVo) {
		return this.cmDao.update("AdminSignDao.updateRecipientRead", reqVo);
	}

	public int updateRecipientSignOn(CmMap reqVo) {
		return this.cmDao.update("AdminSignDao.updateRecipientSignOn", reqVo);
	}
	
	public int updateSaveReportPath(CmMap reqVo) {
		return this.cmDao.update("AdminSignDao.updateSaveReportPath", reqVo);
	}
	
	public int insertemaillog(CmMap reqVo) {
		return this.cmDao.update("AdminSignDao.insertemaillog", reqVo);
	}	

	public int updateAwrtAnthImgPathSignOn(CmMap reqVo) {
		return this.cmDao.update("AdminSignDao.updateAwrtAnthImgPathSignOn", reqVo);
	}
	
	public CmResMap selectSignPreview(CmMap reqVo) {
		return this.cmDao.getObject("AdminSignDao.selectSignPreview", reqVo);
	}
}
