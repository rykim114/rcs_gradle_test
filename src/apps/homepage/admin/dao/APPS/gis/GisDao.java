package apps.homepage.admin.dao.APPS.gis;

import java.util.List;
import org.springframework.stereotype.Repository;
import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;

@Repository
@SuppressWarnings("rawtypes")
public class GisDao extends CmDaoExt {

	/******************************* 격자 100 * 100 ********************************/
	public List<CmResMap> selectSqr100List(CmMap reqVo) {
		return this.cmDao.getList("GisDao.selectSqr100List", reqVo);
	}

	public List<CmResMap> selectSqr100GridList(CmMap reqVo) {
		return this.cmDao.getList("GisDao.selectSqr100GridList", reqVo);
	}

	public List<CmResMap> selectSqr100GridByIdList(CmMap reqVo) {
		return this.cmDao.getList("GisDao.selectSqr100GridByIdList", reqVo);
	}

	public CmResMap selectSqr100GridDetail(CmMap reqVo) {
		return this.cmDao.getObject("GisDao.selectSqr100GridDetail", reqVo);
	}
	/***************************** 격자 100 * 100 ********************************/

	public List<CmResMap> selectOutputAreaLineList(CmMap reqVo) {
		return this.cmDao.getList("GisDao.selectOutputAreaLineList", reqVo);
	}

	public CmResMap selectOutputAreaDetail(CmMap reqVo) {
		return this.cmDao.getObject("GisDao.selectOutputAreaDetail", reqVo);
	}

	public CmResMap selectAddressByGps(CmMap reqVo) {
		return this.cmDao.getObject("GisDao.selectAddressByGps", reqVo);
	}

	public List<CmResMap> selectAddressListByText(CmMap reqVo) {
		return this.cmDao.getList("GisDao.selectAddressListByText", reqVo);
	}


	public Integer updateFavorite(CmMap reqVo) {
		return this.cmDao.insert("GisDao.updateFavorite", reqVo);
	}

	public Integer deleteFavorite(CmMap reqVo) {
		return this.cmDao.update("GisDao.deleteFavorite", reqVo);
	}

	public Integer deleteFavoriteDtl(CmMap reqVo) {
		return this.cmDao.delete("GisDao.deleteFavoriteDtl", reqVo);
	}

	public Integer insertFavoriteDtl(CmMap reqVo) {
		return this.cmDao.insert("GisDao.insertFavoriteDtl", reqVo);
	}

}
