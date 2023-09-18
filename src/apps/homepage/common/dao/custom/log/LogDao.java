package apps.homepage.common.dao.custom.log;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmResMap;

@Repository
@SuppressWarnings("rawtypes")
public class LogDao extends CmDaoExt  {

	
	public int insertLogMsg(Map<String, Object> mod) {
		return this.cmDao.insert("AdminLogDao.insertLogMsg", mod);
	}
	
	public List<CmResMap> selectLogMsg(Map<String, Object> mod) {
		return this.cmDao.getList("AdminLogDao.selectLogMsg", mod);
	}
}
