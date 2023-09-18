package apps.homepage.common.dao.core;


import org.springframework.stereotype.Repository;

import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;


@Repository
@SuppressWarnings("rawtypes")
public class CheckDao extends CmDaoExt {
	/**
	 * DB 체크 
	 * @param reqVo
	 */
	public CmResMap getDBConnectCheck(CmMap reqVo) {
		return this.cmDao.getObject("CheckDao.getDBConnectCheck",reqVo);
	}
}