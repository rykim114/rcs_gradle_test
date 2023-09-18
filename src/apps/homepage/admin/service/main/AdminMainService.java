package apps.homepage.admin.service.main;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.service.CmService;
import apps.homepage.admin.dao.main.AdminMainDao;
import apps.homepage.admin.dao.member.AdminLoginDao;
import apps.homepage.admin.service.member.AdminLoginService;



@Service
@SuppressWarnings("rawtypes")
public class AdminMainService extends CmService {
	
	/** The Constant logger. */
	protected final Log	logger = LogFactory.getLog(this.getClass());

	@Autowired
	private AdminLoginService adminMemberService;
	
	@Autowired
	private AdminMainDao adminMainDao;
	
	@Autowired
	private AdminLoginDao adminLogInDao;
	
	@Resource
	MappingJackson2JsonView ajaxMainView;

		
	public boolean MainFromService(CmMap reqVo, HttpServletRequest request, HttpServletResponse response, ModelAndView mav) {
		if ( ! adminMemberService.isUserLoginCheck(reqVo,response) ) {			
			return false;
		}

		String userId      = reqVo.getString("admin_userId");
		
		CmMap reqVe = new CmMap();
		CmResMap rvo = null;
		reqVe.put("userId"     , userId);

		// 메뉴정보
		List<CmResMap> pgmList = adminMainDao.getUserPgmList(reqVo);
		rvo = adminLogInDao.adminActionLogin(reqVe);
		
		mav.addObject("pgmList", pgmList);
		mav.addObject("pDayCnt", rvo.get("pass_remain_daycnt"));
		mav.addObject("cDayCnt", rvo.get("cont_remain_daycnt"));
		return true;
	}
}
