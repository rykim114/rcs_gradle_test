package apps.homepage.admin.service.member;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.object.CustomUserDetails;
import apps.framework.service.CmService;
import apps.framework.utils.CmSecretUtil;
import apps.homepage.admin.dao.member.AdminLoginDao;
import apps.homepage.common.dao.core.CommonDao;



@Service
@SuppressWarnings("rawtypes")

public class AdminLoginService extends CmService {
	
	@Autowired
	private AdminLoginDao logInDao;
	
	@Autowired
	private CommonDao commonDao;
	
	
	public boolean isUserLoginCheck(CmMap reqVo, HttpServletResponse response) {	
		
		if ( reqVo.getString("admin_userId").equals("") ) { 
			reqVo.put("message", "ID가 존재 하지 않습니다");
			return false;
		}
		
		String companyCode = reqVo.getString("companyCode");
		
		/*
		if ( (companyCode == null) || (companyCode.equals("")) ) {
			companyCode = "100";
		}
		
		reqVo.put("companyCode", companyCode);*/
		
		/*
		CmResMap k1Info = adminLogInOutDao.adminActionLogin(reqVo); 
		
		if ( k1Info == null ) { 
			reqVo.put("message", "ID가 검색이 되지 않습니다!!");
			reqVo.put("target" , "id");
			return false;
		}
		*/
		
		return true;
	}

	public CmResMap SpringSecurityUserLogin(String user_id) {				
		CmMap reqVo = new CmMap();
		reqVo.put("userId", user_id);
		
		CmResMap rvo = logInDao.adminActionLogin(reqVo);
		return rvo;
	}
	
	public boolean LogoutTimeUpdate(){	
    	CustomUserDetails userDetails = (CustomUserDetails)SecurityContextHolder.getContext().getAuthentication().getDetails();    	
    	String userId = (String) userDetails.getUsername();
    	CmMap reqVo   = new CmMap();
    	
    	reqVo.put("userId", userId);
    	
    	if ( userId != null || ! userId.equals("") ) {
    		logInDao.updateLogout(reqVo);
    	}
		
		return true;
	}
	
	public boolean memberPassWordMark(CmMap reqVo, HttpServletRequest request, HttpServletResponse response, Map<String, Object> model) {	
		String result    = "OK";
		String message   = "";
		String userId    = "";
		String newpwdstr = "";
		String new_pwd   = "";
		
		try {
			if ( reqVo.getString("pw_userId") == null || reqVo.getString("pw_userId").equals("") ) {
				userId = "";
			}
			else {
				userId = reqVo.getString("pw_userId");
			
				if ( reqVo.getString("newpwdstr") == null || reqVo.getString("newpwdstr").equals("") ) {
					newpwdstr = "";
					
					CmMap   newMap = new CmMap();
					String daoname = "BI0201Dao.select_ha_auth_user_Pass.select";
					
					newMap.put("data1", reqVo.getString("companyCode"));
					newMap.put("data2", "0004");			
					newMap.put("data3", "10");
					
					List<CmResMap> comp_info = commonDao.XmlSelectsql(daoname, newMap);
					
					if ( comp_info.size() > 0 ) {
						CmResMap cmResMap = (CmResMap) comp_info.iterator().next();
						
						if ( cmResMap.get("label") != null ) {
							newpwdstr = cmResMap.get("label").toString();
						}
					}
				}
				else {
					newpwdstr = reqVo.getString("newpwdstr");
				}			
			}
						
			if ( ! userId.equals("") && ! newpwdstr.equals("") ) {
				new_pwd = CmSecretUtil.encodeSha256(userId+newpwdstr);
			}
			
			if ( new_pwd.equals("") ) {
				result  = "ERROR";
				message = "비밀번호 생성 오류";
			} else {
				result  = "OK";
				message = new_pwd;
			}
		} catch(Exception ex) {
			logger.error(ex);
			result  = "ERROR";
			message = "비밀번호 생성 오류";
		}
		
		model.put("result" , result);
		model.put("message", message);
		
		return true;
	}
	
	/**
	 *  3개월 미로그인 계정 LOCK
	 */
	public void lockThreeMonthNoLoginUser() {
		try {
			logInDao.updateThreeMonthNoLoginUser();
		} catch (Exception e) {
			logger.error(e);
		}
	}
}
