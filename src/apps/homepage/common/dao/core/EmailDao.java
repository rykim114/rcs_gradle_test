package apps.homepage.common.dao.core;

import java.util.List;
import ai.org.apache.commons.logging.Log;
import ai.org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;
import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;


@Repository
@SuppressWarnings("rawtypes")
public class EmailDao extends CmDaoExt {

	/** The Constant logger. */
	protected final Log logger = LogFactory.getLog(this.getClass());


	public int getNoticeEmailSendCount(CmMap reqVo) {
		return this.cmDao.getCount("EmailDao.getNoticeEmailSendCount",reqVo);
	}
	
	public int getNoticeEmailSendCount_Lotte(CmMap reqVo) {
		return this.cmDao.getCount("EmailDao.getNoticeEmailSendCount_Lotte",reqVo);
	}	
	
	public int getNoticeEmailSendCount_Ezrems(CmMap reqVo) {
		return this.cmDao.getCount("EmailDao.getNoticeEmailSendCount_Ezrems",reqVo);
	}	
	
	public int getNoticeEmailSendCountInvoice_Ezrems(CmMap reqVo) {
		return this.cmDao.getCount("EmailDao.getNoticeEmailSendCountInvoice_Ezrems",reqVo);
	}	
	
	public List<CmResMap> getNoticeEmailSendList(CmMap reqVo) {
		return this.cmDao.getList("EmailDao.getNoticeEmailSendList",reqVo);
	}
	
	public List<CmResMap> getRentEmailSendList(CmMap reqVo) {
		return this.cmDao.getList("EmailDao.getRentEmailSendList",reqVo);
	}	
	
	public List<CmResMap> getNoticeEmailSendList_Lotte(CmMap reqVo) {
		return this.cmDao.getList("EmailDao.getNoticeEmailSendList_Lotte",reqVo);
	}	
	
	public List<CmResMap> getNoticeEmailSendList_Ezrems(CmMap reqVo) {
		return this.cmDao.getList("EmailDao.getNoticeEmailSendList_Ezrems",reqVo);
	}
	
	public CmResMap getNoticeEmailSendCodeCust(CmMap reqVo) {
		return this.cmDao.getObject("EmailDao.getNoticeEmailSendCodeCust",reqVo);
	}
	
	public CmResMap getRentEmailSendCodeCust(CmMap reqVo) {
		return this.cmDao.getObject("EmailDao.getRentEmailSendCodeCust",reqVo);
	}	
	
	public CmResMap getNoticeEmailSendCodeCust_Lotte(CmMap reqVo) {
		return this.cmDao.getObject("EmailDao.getNoticeEmailSendCodeCust_Lotte",reqVo);
	}	
	
	public CmResMap getNoticeEmailSendCodeCust_Ezrems(CmMap reqVo) {
		return this.cmDao.getObject("EmailDao.getNoticeEmailSendCodeCust_Ezrems",reqVo);
	}
	
	public CmResMap getNoticeEmailSendCodeCustCont(CmMap reqVo) {
		return this.cmDao.getObject("EmailDao.getNoticeEmailSendCodeCustCont",reqVo);
	}
		
	public void insertNoticeEmailSend(CmMap reqVo){		
		this.cmDao.update("EmailDao.insertNoticeEmailSend", reqVo);
	}
	
	public void insertNoticeEmailSend_Lotte(CmMap reqVo){		
		this.cmDao.update("EmailDao.insertNoticeEmailSend_Lotte", reqVo);
	}	
	
	public void insertNoticeEmailSend_Ezrems(CmMap reqVo){		
		this.cmDao.update("EmailDao.insertNoticeEmailSend_Ezrems", reqVo);
	}
	
	public void insertRentEmailSend_Ezrems(CmMap reqVo){		
		this.cmDao.update("EmailDao.insertRentEmailSend_Ezrems", reqVo);
	}	
	
	public void insertNoticeEmailSendInvoice_Ezrems(CmMap reqVo){		
		this.cmDao.update("EmailDao.insertNoticeEmailSendInvoice_Ezrems", reqVo);
	}	
	
	public void updateNoticeEmailSend(CmMap reqVo){
		this.cmDao.update("EmailDao.updateNoticeEmailSend", reqVo);
	}
	
	public void updateRentEmailSend(CmMap reqVo){
		this.cmDao.update("EmailDao.updateRentEmailSend", reqVo);
	}
	
	public void updateNoticeEmailSend_Lotte(CmMap reqVo){
		this.cmDao.update("EmailDao.updateNoticeEmailSend_Lotte", reqVo);
	}	
	
	public void updateNoticeEmailSend_Ezrems(CmMap reqVo){
		this.cmDao.update("EmailDao.updateNoticeEmailSend_Ezrems", reqVo);
	}
	
	public void insertEmailSendHistory(CmMap reqVo){		
		this.cmDao.update("EmailDao.insertEmailSendHistory", reqVo);
	}

}
