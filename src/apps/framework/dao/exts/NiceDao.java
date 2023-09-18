package apps.framework.dao.exts;


import java.util.List;

import org.springframework.stereotype.Repository;

import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;


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