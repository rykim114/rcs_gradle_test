package apps.homepage.admin.controller.member;

import apps.framework.annotation.CheckSSL;
import apps.framework.annotation.SslOn;
import apps.framework.controller.CmController;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.object.CustomUserDetails;
import apps.framework.utils.CmPathInfo;
import apps.framework.utils.CmSecretUtil;
import apps.framework.utils.listener.ezREMSHttpSessionListener;
import apps.homepage.admin.dao.member.AdminAuthDao;
import apps.homepage.admin.dao.member.AdminLoginDao;
import apps.homepage.admin.service.member.AdminLoginService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;


@Controller
@SuppressWarnings("rawtypes")
@RequestMapping("/admin")
public class AdminLoginController extends CmController {
	
	/** The Constant logger. */
	protected final Logger logger = LogManager.getLogger(this.getClass());
	
	@Autowired
	private AdminLoginService adminLoginService;
	
	@Autowired
	private AdminLoginDao adminLogInDao;
	
	@Autowired
	AdminAuthDao adminAuthDao;
	
	@Resource
	MappingJackson2JsonView ajaxMainView;


	@Resource(name = "cacheManager")
	EhCacheCacheManager cacheManager;
	
	@Autowired
	ezREMSHttpSessionListener ezREMSHttpSessionListener;

	
	@SslOn
	@RequestMapping(value={"", "/", "index", "/member/aLogin"})
	public ModelAndView aLogin(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		ModelAndView mav = new ModelAndView("/admin/member/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminLogin");
		CmResMap rvo     = null;
		return mav;
	}
	
	/**
	 * @param reqVo
	 * @param request
	 * @param response
	 * @return
	 */
	@SslOn
	@RequestMapping(value="/member/adminActionLogin")
	public ModelAndView adminActionLogin(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		ModelAndView mav = new ModelAndView("/admin/main/adminNewLink");
		CmResMap rvo     = null;
		CmResMap rvo2     = null;
		CmResMap rvo3     = null;

		try {
			CustomUserDetails userDetails = (CustomUserDetails)SecurityContextHolder.getContext().getAuthentication().getDetails();
			
			String userId         = (String)userDetails.getUsername();
			String userPassword   = (String)userDetails.getPassword();
			String in_captchaCode = (String)userDetails.getCaptchaCode();
			String companyCode    = reqVo.getString("companyCode");
			String act            = reqVo.getString("act");
			Integer account       = 1;
			
			HttpSession session = request.getSession();
			String session_id = session.getId();
			String browser = this.isBrowserCheck(request);
			String ipaddr = request.getRemoteAddr();
			String premainCnt = "";
			String cremainCnt = "";
			
			if ( (companyCode == null) || (companyCode.equals("")) ) {
				companyCode = "100";
			}
			
			if ( userId == null || userId.equals("") ) {
				mav.addObject("message"    , "아이디를 입력하세요");
				mav.addObject("account"    , Integer.valueOf(0));
				mav.addObject("companyCode", companyCode);
				
				mav.setViewName("/admin/member/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminLogin");
				return mav; 
			}

			if ( userPassword == null || userPassword.equals("") ) {
				mav.addObject("message"    , "비밀번호를 입력하세요.");
				mav.addObject("account"    , Integer.valueOf(0));
				mav.addObject("companyCode", companyCode);
				
				mav.setViewName("/admin/member/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminLogin");
				return mav; 
			}

			reqVo.put("companyCode"   , companyCode);
			reqVo.put("userId"        , userId);
			reqVo.put("encrypt_userId", userId);
  
			// dao: login info
			rvo = adminLogInDao.adminActionLogin(reqVo);
			
			logger.info("rvo" + rvo);
			
			if ( rvo != null && ! rvo.getString("user_id").equals("") && ! rvo.getString("user_password").equals("") ) {
				account = Integer.parseInt(rvo.getString("login_count"));
			
				/* 아이디, 패스워드 확인 */
				userPassword = CmSecretUtil.decodeAES(userPassword, CmPathInfo.getSECRET_AES_KEY());				
				String chkIdPassword = CmSecretUtil.encodeSha256(userId + userPassword);
			     
				if ( (rvo != null) &&
					 (rvo.getString("user_id")   != null) && (! rvo.getString("user_id").equals("")) &&
					 (rvo.getString("user_name") != null) && (! rvo.getString("user_name").equals("")) ) {
					
					companyCode = rvo.getString("company_code");
					premainCnt = rvo.getString("pass_remain_daycnt");
					cremainCnt = rvo.getString("cont_remain_daycnt");
					reqVo.put("companyCode", companyCode);
					reqVo.put("session_id" , session_id);		
					reqVo.put("browser_gub", browser);
					reqVo.put("ipAddr", ipaddr);
					
					if ( (rvo.getString("login_lock_yesno").equals("Y")) ) {	
						reqVo.put("loginYn", "N");	
						reqVo.put("loginMsg", "사용중지");	
						
						adminLogInDao.insertLoginHistory(reqVo);
						
						mav.addObject("message"    , "사용이 중지 되었습니다 관리자에게 문의 하십시요");
						mav.addObject("account"    , Integer.valueOf(0));
						mav.addObject("companyCode", companyCode);
						
						mav.setViewName("/admin/member/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminLogin");
						return mav; 
					} else if ( (rvo.getString("cont_yn").equals("N")) ) {	
						reqVo.put("loginYn", "N");	
						reqVo.put("loginMsg", "계약기간오류");	
						
						adminLogInDao.insertLoginHistory(reqVo);
						
						mav.addObject("message"    , "계약기간이 만료되어 사용이 중지 되었습니다 관리자에게 문의 하십시요 ");
						mav.addObject("account"    , Integer.valueOf(0));
						mav.addObject("companyCode", companyCode);
						
						mav.setViewName("/admin/member/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminLogin");
						return mav; 
					}  
						
			        if (!rvo.getString("user_password").equals(chkIdPassword) ) {
			        	
			        	if ( (account == null) || account.equals("") ) {
			        		account = 0;
			        	}
			        	
			        	reqVo.put("loginYn", "N");	
						reqVo.put("loginMsg", "아이디/비밀번호오류");	
						
						adminLogInDao.insertLoginHistory(reqVo);
			        	
			        	mav.addObject("companyCode", companyCode);
			        	mav.addObject("message"    , "아이디 또는 비밀번호가 잘못 입력 하셨습니다! 5회 이상 오류시 일시 중단 됩니다" );
			        	mav.addObject("account"    , Integer.valueOf(account + 1));
			          
			        	reqVo.put("account", Integer.valueOf(account + 1));
			        	
			        	// dao: update login count		        	
			        	if ( account + 1 >= 5 ) {
			        		reqVo.put("loginLockYesNo", "Y");			        		
			        		// dao: update login lock
			        		this.adminLogInDao.updateLockTagLogin(reqVo);
			        	}
			        	
			        	mav.setViewName("/admin/member/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminLogin");
			        	return mav;
			        }
			        		
			        if ((rvo.getString("ipchk").equals("Y"))) {
				        /* 아이피체크로직(PC체크) */
						rvo2 = adminLogInDao.adminCheckPcCount(reqVo);
						
						if (rvo2.getString("checkyn").equals("N")){
	
				        	reqVo.put("loginYn", "N");	
							reqVo.put("loginMsg", "미등록 PC 로그인시도 ");	
							
							adminLogInDao.insertLoginHistory(reqVo);
							
							mav.addObject("message"    , "아이피등록이 된 PC가 아닙니다. 관리자에게 문의해주세요.");
							mav.addObject("account"    , Integer.valueOf(0));
							mav.addObject("companyCode", companyCode);
							
							mav.setViewName("/admin/member/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminLogin");
							return mav; 
						} 
						logger.info("아이피 체크확인중");
			        } else {			        
			        	logger.info("아이피 체크확인로직 건너뜀");
			        }	
					
			        /* 아이피체크로직(PC체크)끝 */
			        /*******************************************
			         * start: 로그인 성공
			         *******************************************/					
					// dao: update login
					this.adminLogInDao.updateLogin(reqVo);
	
					mav.addObject("account"    , Integer.valueOf(0));
					mav.addObject("companyCode", companyCode);
					mav.addObject("premainCnt", premainCnt);
					mav.addObject("cremainCnt", cremainCnt);
					
					reqVo.put("account", Integer.valueOf(0));
					
					// dao: update login login
					/*this.adminLogInDao.updateCountTagLogin(reqVo)  ;*/
					/* 사용자 접속로그 남기기 */		
					reqVo.put("loginYn", "Y");		

					adminLogInDao.insertLoginHistory(reqVo);
					
					/* 사용자 접속로그 남기기 */
					// dao: insert user login history
					/*this.adminLogInDao.insertUserLoginHistory(reqVo);*/

					session.setAttribute("admin_userId"        , rvo.getString("user_id"));
					session.setAttribute("admin_userNm"        , rvo.getString("user_name"));
					
					session.setAttribute("admin_groupcode"     , rvo.getString("group_code"));
					session.setAttribute("admin_usertag"       , rvo.getString("user_tag"));
					session.setAttribute("admin_useyesno"      , rvo.getString("use_yesno"));					
					session.setAttribute("admin_userdesc"      , rvo.getString("user_desc"));
					
					session.setAttribute("admin_loginlockyesno", rvo.getString("login_lock_yesno"));									
					
					session.setAttribute("admin_logintime"     , rvo.getString("login_time"));
					session.setAttribute("admin_ipaddr"        , ipaddr);

					session.setAttribute("admin_excelyn"       , rvo.getString("excel_yesno"));

					ezREMSHttpSessionListener.setLoginSession(session);
					
			        return mav;
			        /*******************************************
			         * end: 로그인 성공
			         */
				}
			} else if (null == rvo) {
				mav.addObject("message"    , "아이디를 잘못 입력 하셨습니다!");
				mav.addObject("companyCode", companyCode);
				
				mav.setViewName("/admin/member/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminLogin");
				return mav;
		    } else {
		    	logger.info("no-id : " + rvo);
		    	
				account = Integer.parseInt(rvo.getString("login_count")) + 1;
				mav.addObject("message"    , "아이디 또는 비밀번호가 잘못 입력 하셨습니다! 5회 이상 오류시 일시 중단 됩니다");
				mav.addObject("account"    , Integer.valueOf(account));
				mav.addObject("companyCode", companyCode);
				
				mav.setViewName("/admin/member/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminLogin");
				return mav;
			}  
		}
		catch (Exception ex) {
			logger.error("adminActionLogin Exception===>" + (new StringBuilder("adminActionLogin : exception ")).append(ex.getMessage()).append("\r\n").append(ex.getStackTrace().toString()).toString());
			logger.error(ex);
			ex.printStackTrace();
			
			mav.addObject("message", "로그인 작업중 오류발생 시스템 관리자에게 문의해 주시기 바랍니다.");
			mav.addObject("account", Integer.valueOf(0));
			
			mav.setViewName("/admin/member/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminLogin");
		}
		
		return mav;
	}

	@SslOn
	@RequestMapping(value={"/member/checkDuplicateSession"}, method=RequestMethod.GET)
	public ModelAndView checkDuplicateSession(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> model = new HashMap<>();
		
		HttpSession session = request.getSession();

		model.put("cntMax", ezREMSHttpSessionListener.getMaxSessionValidCount());
		model.put("cntSession", ezREMSHttpSessionListener.checkDuplicationLogin(session.getId(), (String) session.getAttribute("admin_userId")));

		return new ModelAndView(this.ajaxMainView, model);
	}


	@SslOn
	@RequestMapping(value={"/member/invalidateDuplicateSession"}, method=RequestMethod.POST)
	public ModelAndView invalidateDuplicateSession(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		Map<String, Object> model = new HashMap<>();
		
		HttpSession session = request.getSession();

		model.put("cnt", ezREMSHttpSessionListener.invalidateDuplicationLogin((String) session.getAttribute("admin_userId"), session));

		return new ModelAndView(this.ajaxMainView, model);
	}

	
	/**
	 * @param reqVo
	 * @param request
	 * @param response
	 * @return
	 */
	@SslOn	
	@RequestMapping(value={"/member/adminActionLogout", "/member/adminActionLogoutSuccess"})	
	public ModelAndView adminActionLogout(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		ModelAndView mav = new ModelAndView("redirect:" + CmPathInfo.getWEB_URL() + "admin/member/aLogin.do");
		CmResMap rvo     = null;

		logger.info("adminActionLogout");
		// dao: update logout
		this.adminLogInDao.updateLogout(reqVo);
		logger.info("저장후");
		
		HttpSession session = request.getSession();
		
		logger.info("getSession");
		String session_id   = session.getId();
		logger.info("session_id" + session_id);
		
		reqVo.put("session_id", session_id);	
		logger.info("reqVo : " + reqVo);	
		
		// dao: update user login history
		this.adminLogInDao.updateUserLoginHistory(reqVo);

		/*
		if ( session != null ) {
		 	session.invalidate();
		 	request.getSession();
	 	}
		*/
		return mav;
	}

	
	
	
	
	/**
	 * @param reqVo
	 * @param request
	 * @param response
	 * @return
	 */
	@SslOn
	@RequestMapping(value="/member/adminPassWordChange")
	public ModelAndView adminPassWordChange(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		ModelAndView mav = new ModelAndView("/admin/member/adminPassWordChange");
		CmResMap rvo     = null;
		
		if ( ! adminLoginService.isUserLoginCheck(reqVo,response) ) {
			mav.setViewName("redirect:" + CmPathInfo.getWEB_URL() + "index");
			return mav;
		}
		
		// dao: login info
		rvo = adminLogInDao.adminActionLogin(reqVo);
		
		String _LoginTag   = "N";
		String companyCode = reqVo.getString("companyCode");
		
		if ( rvo != null ) {
			if ( (companyCode == null) || (companyCode.equals("")) ) {
				companyCode = rvo.getString("company_code");
			}
			
			if ( rvo.getString("password_expire") != null ) {
				if ( ! rvo.getString("password_expire").equals("") ) {
					if ( rvo.getInt("password_expire") > 0 ) {
						_LoginTag = "Y";
					}
				}
			}
			
			if ( rvo.getString("password_update") == null || rvo.getString("password_update").equals("") ) {
				_LoginTag = "Y";
			}
			
			if ( rvo.getString("user_id").equals("MANAGER") ) {
				_LoginTag = "N";
			}
		}
		
		mav.addObject("_LoginTag", _LoginTag);
		mav.addObject("userId"   , reqVo.getString("userId"));
		
		return mav;
	}
	
	
	
	
	
	/**
	 * @param reqVo
	 * @param request
	 * @param response
	 * @return
	 */
	@CheckSSL
	@RequestMapping(value = "/member/adminPassWordChangeUpdate")
//	@RequestMapping(value="/member/UserPasswordUpdt")
	public ModelAndView adminPassWordChangeUpdate(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request,
			HttpServletResponse response, @RequestBody Map<String, Object> param) {
		Map<String, Object> model = new HashMap<String, Object>();

		if (!adminLoginService.isUserLoginCheck(reqVo, response)) {
			ModelAndView mav = new ModelAndView("jsonView");
			mav.setViewName("redirect:" + CmPathInfo.getWEB_URL() + "index");
			return mav;
		}

		reqVo.putAll(param);

		String oldPassword = reqVo.getString("oldPassword");
		String newPassword = reqVo.getString("newPassword");
		String newPassword2 = reqVo.getString("newPassword2");

		String userId = reqVo.getString("admin_userId");
		System.out.println("reqVo : " + reqVo);
		System.out.println("userId: " + userId);

//		String company_code = reqVo.getString("admin_companyCode");

//		reqVo.put("companyCode", company_code);		
		reqVo.put("userId", userId);

		// dao: login info

		CmResMap rvo = adminLogInDao.adminActionLogin(reqVo);
		System.out.println("rvo : " + rvo);

		String user_password = rvo.getString("user_password");
		System.out.println("user_password : " + user_password);

		String chkpwd = CmSecretUtil.encodeSha256(oldPassword);
		String chkpwd2 = CmSecretUtil.encodeSha256(reqVo.getString("userId") + oldPassword);

		if (user_password.equals(chkpwd) || user_password.equals(chkpwd2)) {

		} else {
			model.put("result", "ERROR1");
			model.put("message", "현재 패스워드가 일치하지 않습니다.");
		}

		if (oldPassword.equals(newPassword)) {
			model.put("result", "ERROR2");
			model.put("message", "현재 패스워드와 동일하게 변경할 수 없습니다.");
		}

		if (!newPassword.equals(newPassword2)) {
			model.put("result", "ERROR3");
			model.put("message", "신규 패스워드와 비밀번호 확인이 동일하지 않습니다.");
		}
		
	   if ( model.get("result") == null || model.get("result").equals("") ){
		  String changpwd = CmSecretUtil.encodeSha256(reqVo.getString("admin_userId") + newPassword);
	  
		  reqVo.put("userPassword", changpwd);		  
		  adminLogInDao.updatePassword(reqVo);
	  
		  model.put("result" , "OK"); 
		  model.put("message", "변경 완료");
	   }
		 
		return new ModelAndView(this.ajaxMainView, model);
	}
	
	
	
	
	/**
	 * @param reqVo
	 * @param request
	 * @param response
	 * @return
	 */
	@CheckSSL
	@RequestMapping(value="/member/adminPassWordChangeUpdateNext")
//	@RequestMapping(value="/member/UserPasswordUpdtNext")
	public ModelAndView adminPassWordChangeUpdateNext(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		ModelAndView mav          = new ModelAndView("jsonView");
		Map<String, Object> model = new HashMap<String, Object>();
		
		if ( ! adminLoginService.isUserLoginCheck(reqVo,response) ) {
			mav.setViewName("redirect:" + CmPathInfo.getWEB_URL() + "index");
			return mav;
		}
		
		// dao: update password next
		adminLogInDao.updatePasswordNext(reqVo);
		
		model.put("result" , "OK");
		model.put("message", "변경 완료");
		
		return new ModelAndView(this.ajaxMainView, model);
	}
	
	
	
	
	
	/**
	 * @param reqVo
	 * @param request
	 * @param response
	 * @return
	 */
	@CheckSSL
	@RequestMapping(value="/member/adminPassWordMark")
//	@RequestMapping(value="/member/UserPwdmark")
	public ModelAndView adminPassWordMark(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		ModelAndView mav          = new ModelAndView("jsonView");
		CmResMap rvo              = null;
		Map<String, Object> model = new HashMap<String, Object>();
		String result             = "OK";
		String message            = "";
		
		if ( ! adminLoginService.isUserLoginCheck(reqVo,response) ) {
			mav.setViewName("redirect:" + CmPathInfo.getWEB_URL() + "index");
			return mav;
		}
		
		String pw_userId = "";
		String newpwdstr = "";
		String new_pwd   = "";
		String pageParam = reqVo.getString("pageParam");
		
		try {
			CmMap newMap    = new CmMap();
			JSONObject json = null;
			
			json = new JSONObject(pageParam);
			
			CmMap jreqMap = new ObjectMapper().readValue(json.toString(), CmMap.class);
			
			if ( jreqMap.getString("pw_userid") == null || jreqMap.getString("pw_userid").equals("") ) {
				pw_userId = reqVo.getString("userId");
			}
			else {
				pw_userId = jreqMap.getString("pw_userid");
			
				if ( jreqMap.getString("newpwd") == null || jreqMap.getString("newpwd").equals("") ) {
					newpwdstr = "";
				}
			}
			
			newMap.put("pw_userId"  , pw_userId);
			newMap.put("newpwdstr"  , newpwdstr);
			newMap.put("companyCode", reqVo.getString("admin_companyCode"));

			// service: 
			adminLoginService.memberPassWordMark(newMap, request, response, model);
		} catch(Exception ex) {
			logger.error(ex);
			result  = "ERROR";
			message = "비밀번호 생성 오류";
			
			model.put("result" , result);
			model.put("message", message);
		}
		
		return new ModelAndView(this.ajaxMainView, model);
	}
	
	
	
	
	
	@CheckSSL
	@RequestMapping(value="/member/adminPassWordReset")
//	@RequestMapping(value="/member/UserPwdReset")
	public ModelAndView adminPassWordReset(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		ModelAndView mav          = new ModelAndView("jsonView");
		CmResMap rvo              = null;
		Map<String, Object> model = new HashMap<String, Object>();
		String result             = "OK";
		String message            = "";
		
		if ( ! adminLoginService.isUserLoginCheck(reqVo,response) ) {
			mav.setViewName("redirect:" + CmPathInfo.getWEB_URL() + "index");
			return mav;
		}
		
		String pw_userId = "";
		String newpwdstr = "";
		String new_pwd   = "";
		String pageParam = reqVo.getString("pageParam");
		
		try {
			CmMap newMap    = new CmMap();
			JSONObject json = null;
			
			json = new JSONObject(pageParam);
			
			CmMap jreqMap = new ObjectMapper().readValue(json.toString(), CmMap.class);
			
			if ( jreqMap.getString("pw_userid") == null || jreqMap.getString("pw_userid").equals("") ) {
				pw_userId = reqVo.getString("userId");
			}
			else {
				pw_userId = jreqMap.getString("pw_userid");
			
				if ( jreqMap.getString("newpwd") == null || jreqMap.getString("newpwd").equals("") ) {
					newpwdstr = "";
				}
			}
			
			newMap.put("pw_userId"  , pw_userId);
			newMap.put("newpwdstr"  , newpwdstr);
			newMap.put("companyCode", reqVo.getString("admin_companyCode"));

			// service: 
			adminLoginService.memberPassWordMark(newMap, request, response, model);
			
			if ( model.get("result").toString().equals("OK") ) {
				
				CmMap updateMap = new CmMap();
				updateMap.put("companyCode" , reqVo.getString("admin_companyCode"));
				updateMap.put("userPassword", model.get("message").toString());
				updateMap.put("userId"      , pw_userId);
				
				// dao: update password
				adminLogInDao.updatePassword(updateMap);
				
				model.put("message", model.get("message").toString());
			}
		} catch(Exception ex) {
			logger.error(ex);
			result  = "ERROR";
			message = "비밀번호 생성 오류";
			
			model.put("result" , result);
			model.put("message", message);
		}
		
		return new ModelAndView(this.ajaxMainView, model);
	}
	
	
	
	
	
	@CheckSSL
	@RequestMapping(value="/member/adminLoginSuccess")	
	public ModelAndView adminLoginSuccess(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		ModelAndView mav = new ModelAndView("/admin/member/adminLoginSuccess");
		
		HttpSession session = request.getSession();
		
		CustomUserDetails userDetails = (CustomUserDetails)SecurityContextHolder.getContext().getAuthentication().getDetails();
	         
		//logger.info("Welcome adminLoginSuccess! "+ session.getId()+ userDetails.getUsername() + "/" + userDetails.getPassword());
		session.setAttribute("userLoginInfo", userDetails);
		
		return mav;
	}
	
	
	@CheckSSL
	@RequestMapping(value="/member/adminLoginFailure")
	public ModelAndView adminLoginFailure(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		ModelAndView mav = new ModelAndView("/admin/member/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminLogin");
		mav.addObject("message", "로그인 정보 또는 보안문자가 올바르지 않습니다");
		return mav;
	}

	
	/**
	 * @param reqVo
	 * @param request
	 * @param response
	 * @return
	 */
	@SslOn
	@RequestMapping(value="/member/adminActionLoginDemo")
	public ModelAndView adminActionLoginDemo(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		ModelAndView mav = new ModelAndView("/admin/main/adminNewLink");
		CmResMap rvo     = null;
		CmResMap rvo2     = null;
		CmResMap rvo3     = null;

		try {
			String userId         = "demo";		
			String userPassword   = "cdd252ebf6d7efff11d52a21a1c50245";
			String companyCode    = "100";
			Integer account       = 1;

			HttpSession session = request.getSession();
			String session_id = session.getId();
			String browser = this.isBrowserCheck(request);
			String ipaddr = request.getRemoteAddr();
			String premainCnt = "";
			String cremainCnt = "";
			
			reqVo.put("companyCode"   , companyCode);
			reqVo.put("userId"        , userId);
			reqVo.put("encrypt_userId", userId);
  
			// dao: login info
			rvo = adminLogInDao.adminActionLogin(reqVo);
			
			logger.info("rvo" + rvo);
			
			if ( rvo != null && ! rvo.getString("user_id").equals("") && ! rvo.getString("user_password").equals("") ) {
				account = Integer.parseInt(rvo.getString("login_count"));
			
				/* 아이디, 패스워드 확인 */
				userPassword = CmSecretUtil.decodeAES(userPassword, CmPathInfo.getSECRET_AES_KEY());				
				String chkIdPassword = CmSecretUtil.encodeSha256(userId + userPassword);
			     
				if ( (rvo != null) &&
					 (rvo.getString("user_id")   != null) && (! rvo.getString("user_id").equals("")) &&
					 (rvo.getString("user_name") != null) && (! rvo.getString("user_name").equals("")) ) {
					
					companyCode = rvo.getString("company_code");
					premainCnt = rvo.getString("pass_remain_daycnt");
					cremainCnt = rvo.getString("cont_remain_daycnt");
					reqVo.put("companyCode", companyCode);
					reqVo.put("session_id" , session_id);		
					reqVo.put("browser_gub", browser);
					reqVo.put("ipAddr", ipaddr);
					
					if ( (rvo.getString("login_lock_yesno").equals("Y")) ) {	
						reqVo.put("loginYn", "N");	
						reqVo.put("loginMsg", "사용중지");	
						
						adminLogInDao.insertLoginHistory(reqVo);
						
						mav.addObject("message"    , "사용이 중지 되었습니다 관리자에게 문의 하십시요");
						mav.addObject("account"    , Integer.valueOf(0));
						mav.addObject("companyCode", companyCode);
						
						mav.setViewName("/admin/member/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminLogin");
						return mav; 
					} else if ( (rvo.getString("cont_yn").equals("N")) ) {	
						reqVo.put("loginYn", "N");	
						reqVo.put("loginMsg", "계약기간오류");	
						
						adminLogInDao.insertLoginHistory(reqVo);
						
						mav.addObject("message"    , "사용이 중지 되었습니다 관리자에게 문의 하십시요");
						mav.addObject("account"    , Integer.valueOf(0));
						mav.addObject("companyCode", companyCode);
						
						mav.setViewName("/admin/member/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminLogin");
						return mav; 
					}  
						
			        if (!rvo.getString("user_password").equals(chkIdPassword) ) {
			        	
			        	if ( (account == null) || account.equals("") ) {
			        		account = 0;
			        	}
			        	
			        	reqVo.put("loginYn", "N");	
						reqVo.put("loginMsg", "아이디/비밀번호오류");	
						
						adminLogInDao.insertLoginHistory(reqVo);
			        	
			        	mav.addObject("companyCode", companyCode);
			        	mav.addObject("message"    , "아이디 또는 비밀번호가 잘못 입력 하셨습니다! 5회 이상 오류시 일시 중단 됩니다" );
			        	mav.addObject("account"    , Integer.valueOf(account + 1));
			          
			        	reqVo.put("account", Integer.valueOf(account + 1));
			        	
			        	// dao: update login count		        	
			        	if ( account + 1 >= 5 ) {
			        		reqVo.put("loginLockYesNo", "Y");			        		
			        		// dao: update login lock
			        		this.adminLogInDao.updateLockTagLogin(reqVo);
			        	}
			        	
			        	mav.setViewName("/admin/member/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminLogin");
			        	return mav;
			        }
			        			       			        
			        /* 아이피체크로직(PC체크) */
					rvo2 = adminLogInDao.adminCheckPcCount(reqVo);
					/* 오라클 커넥트 체크 확인  추후 삭제 해야됨*/
/*					logger.info("==== oracle select time ======");
					logger.info("==== oracle select time ======");
					logger.info("==== oracle select time ======");
					
					List<CmResMap> oraclecheck = adminLogInDao.adminoraclecheck();
					logger.info(oraclecheck);*/
					
			        /* 아이피체크로직(PC체크)끝 */
			        /*******************************************
			         * start: 로그인 성공
			         *******************************************/					
					// dao: update login
					/*this.adminLogInDao.updateLogin(reqVo);*/
	
					mav.addObject("account"    , Integer.valueOf(0));
					mav.addObject("companyCode", companyCode);
					mav.addObject("premainCnt", premainCnt);
					mav.addObject("cremainCnt", cremainCnt);
					
					reqVo.put("account", Integer.valueOf(0));
					
					// dao: update login login
					/*this.adminLogInDao.updateCountTagLogin(reqVo)  ;*/
					/* 사용자 접속로그 남기기 */		
					reqVo.put("loginYn", "Y");		

					adminLogInDao.insertLoginHistory(reqVo);
					
					/* 사용자 접속로그 남기기 */
					// dao: insert user login history
					/*this.adminLogInDao.insertUserLoginHistory(reqVo);*/

					session.setAttribute("admin_userId"        , rvo.getString("user_id"));
					session.setAttribute("admin_userNm"        , rvo.getString("user_name"));
					
					session.setAttribute("admin_groupcode"     , rvo.getString("group_code"));
					session.setAttribute("admin_usertag"       , rvo.getString("user_tag"));
					session.setAttribute("admin_useyesno"      , rvo.getString("use_yesno"));					
					session.setAttribute("admin_userdesc"      , rvo.getString("user_desc"));
					
					session.setAttribute("admin_loginlockyesno", rvo.getString("login_lock_yesno"));									
					
					session.setAttribute("admin_logintime"     , rvo.getString("login_time"));
					session.setAttribute("admin_ipaddr"        , ipaddr);

					session.setAttribute("admin_excelyn"       , rvo.getString("excel_yesno"));

					ezREMSHttpSessionListener.setLoginSession(session);
					
			        return mav;
			        /*******************************************
			         * end: 로그인 성공
			         */
				}
			} else if (null == rvo) {
				mav.addObject("message"    , "아이디를 잘못 입력 하셨습니다!");
				mav.addObject("companyCode", companyCode);
				
				mav.setViewName("/admin/member/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminLogin");
				return mav;
		    } else {
		    	logger.info("no-id : " + rvo);
		    	
				account = Integer.parseInt(rvo.getString("login_count")) + 1;
				mav.addObject("message"    , "아이디 또는 비밀번호가 잘못 입력 하셨습니다! 5회 이상 오류시 일시 중단 됩니다");
				mav.addObject("account"    , Integer.valueOf(account));
				mav.addObject("companyCode", companyCode);
				
				mav.setViewName("/admin/member/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminLogin");
				return mav;
			}  
		}
		catch (Exception ex) {
			logger.error("adminActionLogin Exception===>" + (new StringBuilder("adminActionLogin : exception ")).append(ex.getMessage()).append("\r\n").append(ex.getStackTrace().toString()).toString());
			logger.error(ex);
			ex.printStackTrace();
			
			mav.addObject("message", "로그인 작업중 오류발생 시스템 관리자에게 문의해 주시기 바랍니다.");
			mav.addObject("account", Integer.valueOf(0));
			
			mav.setViewName("/admin/member/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminLogin");
		}
		
		return mav;
	}
	
}
