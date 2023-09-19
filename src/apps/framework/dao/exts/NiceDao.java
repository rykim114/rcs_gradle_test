package apps.framework.dao.exts;


import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import org.springframework.stereotype.Repository;


@Repository
@SuppressWarnings("rawtypes")
public class NiceDao extends CmDaoExt{
	
	public void insertNiceRequest(CmMap reqVo) {
		this.cmDao.insert("NiceDao.insertNiceRequest", reqVo);
	}
	
	public void updateNiceRequest(CmMap reqVo) {
		this.cmDao.insert("NiceDao.updateNiceRequest", reqVo);
	}

}