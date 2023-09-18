package apps.homepage.common.dao.custom.dataLink;

import java.util.List;

import org.springframework.stereotype.Repository;

import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;


@Repository
@SuppressWarnings("rawtypes")
public class DataLinkDao extends CmDaoExt{
	public int selectCompCnt(CmMap reqVo) {
		return this.cmDao.getCount("ApiCommonDao.selectCompCnt", reqVo);
	}
	
	public int selectDataCnt(CmMap reqVo) {
		return this.cmDao.getCount("ApiCommonDao.selectDataCnt", reqVo);
	}
	
	public int selectPaperCnt(CmMap reqVo) {
		return this.cmDao.getCount("ApiCommonDao.selectPaperCnt", reqVo);
	}
	
	public int selectUserCnt(CmMap reqVo) {
		return this.cmDao.getCount("ApiCommonDao.selectUserCnt", reqVo);
	}
	
	public void insertApiHistory(CmMap reqVo){ 
		this.cmDao.insert("ApiCommonDao.insertApiHistory", reqVo);
	}
	
	public void insertSignMaster(CmMap reqVo){ 
		this.cmDao.insert("ApiCommonDao.insertSignMasterInfo", reqVo);
	}

	public void insertSignDetail(CmMap reqVo){ 
		this.cmDao.insert("ApiCommonDao.insertSignDetailInfo", reqVo);
	}
	
	public void insertRecipientInfo(CmMap reqVo){ 
		this.cmDao.insert("ApiCommonDao.insertRecipientInfo", reqVo);
	}
	
	public List<CmResMap> selectReceipientInfo(CmMap reqVo) {
		return this.cmDao.getList("ApiCommonDao.selectReceipientInfo", reqVo);
	}
	public int updateRecipientD(CmMap reqVo) {
		return this.cmDao.update("ApiCommonDao.updateRecipientD", reqVo);
	}
	
		
	public List<CmResMap> selectSignResultByServiceSeq(CmMap reqVo) {
		return this.cmDao.getList("ApiCommonDao.selectSignResultByServiceSeq", reqVo);
	}

	
	public CmResMap selectSignResultBySignatureSeq(CmMap reqVo) {
		return this.cmDao.getObject("ApiCommonDao.selectSignResultBySignatureSeq", reqVo);
	}

}
