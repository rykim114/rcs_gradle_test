package apps.framework.dao.exts;

import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import org.springframework.stereotype.Repository;

import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;

@Repository
@SuppressWarnings("rawtypes")
public class SettlebankDao extends CmDaoExt{

	public void insertPgRequest(CmMap reqVo) {
		this.cmDao.insert("SettlebankDao.insertPgRequest", reqVo);
	}

	public void insertPgResult(CmMap notiVo) {
		this.cmDao.insert("SettlebankDao.insertPgResult", notiVo);
	}

	public void insertPgTemp(CmMap reqVo) {
		this.cmDao.insert("SettlebankDao.insertPgTemp", reqVo);
	}
	
	public boolean updatePg(CmMap reqVo){ 
		this.cmDao.update("SettlebankDao.updatePg", reqVo);
		this.cmDao.update("SettlebankDao.updatePgTemp", reqVo);
		return true;
	}
	
	public boolean noti_success(CmMap notiVo, String[] noti) throws IOException
	{
	    //결제에 관한 log남기게 됩니다. log path수정 및 db처리루틴이 추가하여 주십시요.
		this.insertPgResult(notiVo);
	    //noti_write("C:\\log\\noti_success.log", noti);
	    return true;
	}

	public boolean noti_failure(CmMap notiVo, String[] noti) throws IOException
	{
	    //결제에 관한 log남기게 됩니다. log path수정 및 db처리루틴이 추가하여 주십시요.
		this.insertPgResult(notiVo);
	    //noti_write("C:\\log\\noti_failure.log", noti);
	    return true;
	}

	public boolean noti_hash_err(CmMap notiVo, String[] noti) throws IOException
	{
	    //결제에 관한 log남기게 됩니다. log path수정 및 db처리루틴이 추가하여 주십시요.
		this.insertPgResult(notiVo);
	    //noti_write("C:\\log\\noti_hash_err.log", noti);
	    return true;
	}

	public boolean noti_waiting_pay(CmMap notiVo, String[] noti) throws IOException
	{
		//CmPathInfo.getSSL_URL();
	    //결제에 관한 log남기게 됩니다. log path수정 및 db처리루틴이 추가하여 주십시요.
		this.insertPgResult(notiVo);
	    //noti_write("C:\\log\\noti_waiting_pay.log", noti);
	    return true;
	}

	public void noti_write(String file, String noti[]) throws IOException
	{
	    StringBuffer strBuf = new StringBuffer();

	    strBuf.append("거래상태:" + noti[0] + "::");
	    strBuf.append("거래번호:" + noti[1] + "::");
	    strBuf.append("승인날짜:" + noti[2] + "::");
	    strBuf.append("거래종류:" + noti[3] + "::");
	    strBuf.append("회원사ID:" + noti[4] + "::");
	    strBuf.append("주문번호:" + noti[5] + "::");
	    strBuf.append("금융사코드:" + noti[6] + "::");
	    strBuf.append("금융사코드:" + noti[7] + "::");
	    strBuf.append("금융사명:" + noti[8] + "::");
	    strBuf.append("주문자명:" + noti[9] + "::");
	    strBuf.append("거래금액:" + noti[10] + "::");
	    strBuf.append("주문정보:" + noti[11] + "::");
	    strBuf.append("메세지1:" + noti[12] + "::");
	    strBuf.append("메세지2:" + noti[13] + "::");
	    strBuf.append("승인번호:" + noti[14] + "::");
	    strBuf.append("P_HASH:" + noti[15] + "::");        
	    strBuf.append("HashedData:" + noti[16]);
	    strBuf.append("\n");

	    byte b[] = strBuf.toString().getBytes("EUC-KR");
	    BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(file, true));
	    stream.write(b);
	    stream.close();
	}
	
	public CmResMap selectKey(String ptrno) {
		return this.cmDao.getObject("SettlebankDao.selectKey", ptrno); 
	} 
	
	public Object chkPgValue(CmMap reqVo) {
		return this.cmDao.selectOne("SettlebankDao.chkPgValue", reqVo); 
	}
}
