package apps.homepage.common.dao.core;

import java.util.List;

import org.springframework.stereotype.Repository;

import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;


@Repository
@SuppressWarnings("rawtypes")
public class SMSDao extends CmDaoExt{
	
	
	public void insertSmsQueue(CmMap reqVo){		
		this.cmDao.update("SMSDao.insertSmsQueue", reqVo);
	}
	
	public void insertSmsQueueReceiver(CmMap reqVo){
		this.cmDao.update("SMSDao.insertSmsQueueReceiver", reqVo);
	}
	
	
	public CmResMap getNoticeSMSSendCodeCust(CmMap reqVo) {
		return this.cmDao.getObject("SMSDao.getNoticeSMSSendCodeCust",reqVo);
	}
	
	public int getNoticeSMSSendCountInvoice_Ezrems(CmMap reqVo) {
		return this.cmDao.getCount("SMSDao.getNoticeSMSSendCountInvoice_Ezrems",reqVo);
	}
	
	public CmResMap getNoticeSMSSendCodeCust_Ezrems(CmMap reqVo) {
		return this.cmDao.getObject("SMSDao.getNoticeSMSSendCodeCust_Ezrems",reqVo);
	}
	
	public List<CmResMap> getNoticeSMSSendInvoice_Ezrems(CmMap reqVo) {
		return this.cmDao.getList("SMSDao.getNoticeSMSSendInvoice_Ezrems",reqVo);
	}

	public CmResMap getNoticeSMSSendCodeCust400(CmMap reqVo) {
		return this.cmDao.getObject("SMSDao.getNoticeSMSSendCodeCust400",reqVo);
	}

	public CmResMap getSmsTmplList(CmMap reqVo) {
		return this.cmDao.getObject("SMSDao.getSmsTmplList", reqVo);
	}

	public void insertReSmsSend(CmMap reqVo) {
		this.cmDao.update("SMSDao.insertReSmsSend", reqVo);
	}

	public void insertSmsReserve(CmMap reqVo){		
		this.cmDao.update("SMSDao.insertSmsReserve", reqVo);
	}
	
	public List<CmResMap> getSmsReserveList() {
		return this.cmDao.getList("SMSDao.getSmsReserveList");
	}
	
	public void deleteSmsReserveList(CmMap reqVo) {
		this.cmDao.delete("SMSDao.deleteSmsReserveList", reqVo);
	}
	
	public int getSmsBatchId() {
		return this.cmDao.getCount("SMSDao.getSmsBatchId");
	}
	
	public void insertSmsQueueZo(CmMap reqVo){		
		this.cmDao.update("SMSDao.insertSmsQueueZo", reqVo);
	}

	public void insertSmsQueueReceiverZo(CmMap reqVo){
		this.cmDao.update("SMSDao.insertSmsQueueReceiverZo", reqVo);
	}
	
	public void insertReSmsSendZo(CmMap reqVo) {
		this.cmDao.update("SMSDao.insertReSmsSendZo", reqVo);
	}

	public List<CmResMap> getSmsParamList(CmMap reqVo) {
		return this.cmDao.getList("SMSDao.getSmsParamList", reqVo);
	}
	
	public CmResMap getSmsSendData(CmMap reqVo) {
		return this.cmDao.getObject("SMSDao.getSmsSendData",reqVo);
	}
	public CmResMap getSmsFormInfo(CmMap reqVo) {
		return this.cmDao.getObject("SMSDao.getSmsFormInfo",reqVo);
	}
	public void insertReSmsSendZo_Ezrems(CmMap reqVo) {
		this.cmDao.update("SMSDao.insertReSmsSendZo_Ezrems", reqVo);
	}
	
    public void insertKakaoAlimTalk(CmMap reqVo){
    	this.cmDao.getString("SMSDao.insertKakaoAlimTalk", reqVo);
    	//#{msg_title}, #{msg_content}, #{recv_num}, #{send_num}, #{template_code}, #{batch_id}
    }
}
