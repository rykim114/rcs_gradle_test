package apps.homepage.common.dao.core;


import java.util.List;

import org.springframework.stereotype.Repository;

import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;


@Repository
@SuppressWarnings("rawtypes")
public class Com_UserDao extends CmDaoExt{
	
	public List<CmResMap> getProjList(CmMap reqVo) {
		return this.cmDao.getList("Com_UserDao.getProjList",reqVo);
	}

}