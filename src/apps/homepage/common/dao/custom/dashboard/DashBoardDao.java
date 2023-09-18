package apps.homepage.common.dao.custom.dashboard;

import java.util.List;

import org.springframework.stereotype.Repository;

import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;

@Repository
@SuppressWarnings("rawtypes")
public class DashBoardDao extends CmDaoExt {

	public List<CmResMap> selectDashBoardTop(CmMap reqVo) {
		return this.cmDao.getList("DashBoardDao.selectDashBoardTop", reqVo);
	}
}
