package apps.homepage.common.dao.core;


import java.util.List;

import org.springframework.stereotype.Repository;

import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;


@Repository
@SuppressWarnings("rawtypes")
public class XmlAjaxDao extends CmDaoExt {

	public List<CmResMap> selectXmlAjax(String sqlInfo, CmMap reqVo) {
		return this.cmDao.getList(sqlInfo, reqVo);
	}
	
	public void insertXmlAjax(String sqlInfo, CmMap reqVo){
		this.cmDao.insert(sqlInfo, reqVo);
	}
	
	public void updateXmlAjax(String sqlInfo, CmMap reqVo){
		this.cmDao.update(sqlInfo, reqVo);
	}
	
	public void deleteXmlAjax(String sqlInfo, CmMap reqVo){
		this.cmDao.delete(sqlInfo, reqVo);
	}

	// XXX: CRUD 전체 필요하시면 추가 가능합니다
	public List<CmResMap> selectXmlAjaxOracle(String sqlInfo, CmMap reqVo) {
		return this.cmOracleDao.getList(sqlInfo, reqVo);
	}
	
}