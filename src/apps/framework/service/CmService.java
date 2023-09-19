package apps.framework.service;

import apps.framework.dao.CmDao;
import apps.framework.object.CmMap;
import apps.framework.utils.CmFunction;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mobile.device.Device;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@SuppressWarnings("rawtypes")
public class CmService {
	
	protected Log	logger	= LogFactory.getLog(this.getClass());
	
	@Autowired
	protected CmDao cmDao;
	
	public CmDao getCmDao() {
		return this.cmDao;
	}

	public void setCmDao(CmDao cmDao) {
		this.cmDao = cmDao;
	}


		
	public boolean isAdminLoginCheck() {
		HttpSession	session	= CmFunction.getCurrentRequest().getSession();
		String		userid	= CmFunction.getStringValue(session.getAttribute("admin_userId"));
		return CmFunction.isNotEmpty(userid); 
	}
	
	public boolean isLoginCheck() {
		HttpSession	session	= CmFunction.getCurrentRequest().getSession();
		String		userid	= CmFunction.getStringValue(session.getAttribute("s_userId"));
		return CmFunction.isNotEmpty(userid); 
	}
	

	public String isDeviceNm (HttpServletRequest request ) {
		String retViewStr = "";
		
		Device device = (Device)request.getAttribute("currentDevice");
		
		if (device.isNormal()) {
			retViewStr = "PC";
	    } else if (device.isTablet()) {
	    	retViewStr = "tablet";
	    } else if (device.isMobile()) {
	    	retViewStr = "mobile";	    
	    }
	    return retViewStr;
	}
	
	protected CmMap  setListPaging (int recordCnt, CmMap reqVo, int i_iPageSize, int i_iNowPageNo) {
		
		CmMap page = new CmMap();
		
		if (reqVo == null)
			reqVo		= new CmMap();
		
		String historyBack = reqVo.getString("i_sFlagHistoryBack");
		
		int	totalPageCnt		= 0;
		int startRownum			= 0;
		int endRownum			= 0;
		
		if (i_iPageSize <= 0)	i_iPageSize	= 20;
		if (i_iNowPageNo <= 0)	i_iNowPageNo	= 1;
		
		if (recordCnt <= i_iPageSize)
			totalPageCnt	= 1;
		else
			totalPageCnt	= ((recordCnt - 1) / i_iPageSize) + 1;
		
		if (totalPageCnt < i_iNowPageNo)	i_iNowPageNo		= totalPageCnt;
		
		startRownum = (i_iNowPageNo - 1) * i_iPageSize + 1;
		endRownum 	= i_iNowPageNo * i_iPageSize;
		
		if (historyBack.equals("Y")) {
			startRownum = 1;
		}
		
		reqVo.put("i_iTotalPageCnt", "" + totalPageCnt);
		reqVo.put("i_iRecordCnt", ""+recordCnt);
		reqVo.put("i_iPageSize", ""+i_iPageSize);
		reqVo.put("i_iNowPageNo", ""+i_iNowPageNo);
		reqVo.put("i_iStartRownum", "" + startRownum);
		reqVo.put("i_iEndRownum", "" + endRownum);
		
		page.put("i_iTotalPageCnt", "" + totalPageCnt);
		page.put("i_iRecordCnt", ""+recordCnt);
		page.put("i_iPageSize", ""+i_iPageSize);
		page.put("i_iNowPageNo", ""+i_iNowPageNo);
		page.put("i_iStartRownum", "" + startRownum);
		page.put("i_iEndRownum", "" + endRownum);
		
		return page;
	}
	
	
}
