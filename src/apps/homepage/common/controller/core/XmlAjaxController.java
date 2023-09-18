package apps.homepage.common.controller.core;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import com.fasterxml.jackson.databind.ObjectMapper;

import apps.framework.annotation.SslOn;
import apps.framework.controller.CmController;
import apps.framework.object.CmMap;
import apps.homepage.admin.service.member.AdminLoginService;
import apps.homepage.common.service.core.XmlAjaxService;

/**
 * @author sanggyu.lee(zeons)
 * [ajax controller]
 * /common/core/xmlAjax
 * /common/core/xmlAjaxUpdate
 * /common/core/xmlAjaxUpdateModal
 */
@Controller
@SuppressWarnings("rawtypes")
@RequestMapping("/common")
public class XmlAjaxController extends CmController {

	/** The Constant logger. */
	protected final Log	logger = LogFactory.getLog(this.getClass());
	
	@Autowired
	private AdminLoginService adminMemberService;
	
	@Resource
	MappingJackson2JsonView ajaxMainView;

	@Autowired
	private XmlAjaxService xmlAjaxService;
	

	@SslOn
	@RequestMapping(value="/core/xmlAjax")
	@ResponseBody
	public ModelAndView XmlAjax(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		ModelAndView mav = new ModelAndView("jsonView");
		Map<String, Object> model = new HashMap<>();
		
		model.put("datas", "");
		
		if ( ! adminMemberService.isUserLoginCheck(reqVo,response) ) {
			model.put("result", "LoginOut");
			model.put("errmsg", "세션이 종료되어 로그인 화면으로 이동합니다.");
			
			return new ModelAndView(this.ajaxMainView, model);
			
			/*mav.setViewName("/common/core/javascript");
			mav.addObject("excute_script", CmFunction.jsmsgLink("로그인 페이지로 이동합니다.", "/admin/member/aLogin.do","MA" ));
			
			return mav; */
		}
		
		try {
			String pageParam = (String) reqVo.get("pageParam");
			pageParam        = xmlAjaxReplaceString(pageParam);
			
			if ( pageParam.indexOf("datatable_v7_0_5") > -1 ) {
				int startPaginationIdx = pageParam.indexOf("&pagination[page]");
				
				pageParam = pageParam.substring(17, startPaginationIdx == -1 ? pageParam.length() - 1 : startPaginationIdx);
			}
			
			JSONObject pageJson = new JSONObject(pageParam);
			CmMap paramMap      = new ObjectMapper().readValue(pageJson.toString(), CmMap.class);
			
			String zAction      = paramMap.getString("z.action");
			String zSqlFile     = paramMap.getString("z.sqlFile");
			String zSqlId       = paramMap.getString("z.sqlId");
			String zReturnType  = paramMap.getString("z.returnType");
			String zRowSeparate = paramMap.getString("z.rowSeparate");
			String zColSeparate = paramMap.getString("z.colSeparate");
			
			if ( zAction.equals("") || zSqlFile.equals("") || zSqlId.equals("") || zReturnType.equals("") || zRowSeparate.equals("") || zColSeparate.equals("") ) {
				model.put("result", "ERROR");
				model.put("errmsg", "XmlAjax 필수항목이 없습니다.");
			}
			else {
				CmMap params = getParamsToCmMap(paramMap, "z.params");
				
				if ( ! reqVo.getString("admin_userId").equals("") ) {
					params.put("companyCode", reqVo.getString("admin_companyCode"));
					params.put("userId"     , reqVo.getString("admin_userId"));
				} else {
					params.put("companyCode", reqVo.getString("s_companyCode"));
					params.put("userId"     , reqVo.getString("s_userId"));
				}
				
				params.put("userIp", request.getRemoteAddr());
				params.put("sessionId", request.getSession().getId());
		        
		        // dao: action
				if ( zAction.equals("select") ) {
					model.put("datas", xmlAjaxService.selectXmlAjax(zAction, zSqlFile, zSqlId, zReturnType, zRowSeparate, zColSeparate, params, model));
				}
				else if ( zAction.equals("insert") ) {
					xmlAjaxService.insertXmlAjax(zAction, zSqlFile, zSqlId, zReturnType, zRowSeparate, zColSeparate, params, model);
				}
				else if ( zAction.equals("update") ) {
					xmlAjaxService.updateXmlAjax(zAction, zSqlFile, zSqlId, zReturnType, zRowSeparate, zColSeparate, params, model);
				}
				else if ( zAction.equals("delete") ) {
					xmlAjaxService.deleteXmlAjax(zAction, zSqlFile, zSqlId, zReturnType, zRowSeparate, zColSeparate, params, model);
				}
				
				model.put("result", "OK");
			}
		} catch ( Exception ex ) {
			model.put("result", "ERROR");
			model.put("errmsg", "작업중 오류가 발생하였습니다.");
			
			//throw ex;
			logger.error(ex);
		}
		
		return new ModelAndView(this.ajaxMainView, model);
	}
	
	
	
	@SslOn
	@RequestMapping(value="/core/xmlAjaxUpdate")
	@ResponseBody
	public ModelAndView xmlAjaxUpdate(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		ModelAndView mav = new ModelAndView("jsonView");
		Map<String, Object> model = new HashMap<>();

		model.put("datas", "");
		
		if ( ! adminMemberService.isUserLoginCheck(reqVo,response) ) {
			model.put("result", "LoginOut");
			model.put("errmsg", "세션이 종료되어 로그인 화면으로 이동합니다.");
			
			return new ModelAndView(this.ajaxMainView, model);
		}
		
		try {
			String pageParam    = (String) reqVo.get("pageParam");
			pageParam           = xmlAjaxReplaceString(pageParam);
			JSONObject pageJson = new JSONObject(pageParam);
			CmMap paramMap      = new ObjectMapper().readValue(pageJson.toString(), CmMap.class);
			
			String zSqlFile     = paramMap.getString("z.sqlFile");
			String zSqlId       = paramMap.getString("z.sqlId");
			String zReturnType  = paramMap.getString("z.returnType");
			String zRowSeparate = paramMap.getString("z.rowSeparate");
			String zColSeparate = paramMap.getString("z.colSeparate");
			String companyCode;
			String userId;
			String userIp;
			
			if ( zSqlFile.equals("") || zSqlId.equals("") || zReturnType.equals("") || zRowSeparate.equals("") || zColSeparate.equals("") ) {
				model.put("result", "ERROR");
				model.put("errmsg", "XmlAjaxUpdate 필수항목이 없습니다.");
			}
			else {
				if ( ! reqVo.getString("admin_userId").equals("") ) {
					companyCode = reqVo.getString("admin_companyCode");
					userId      = reqVo.getString("admin_userId");
				} else {
					companyCode = reqVo.getString("s_companyCode");
					userId      = reqVo.getString("s_userId");
				}				
				
				userIp = request.getRemoteAddr();
				
				CmMap params = getParamsToCmMap(paramMap, "z.params");
				
				int insertCnt = params.getInt("insertCnt");
				int updateCnt = params.getInt("updateCnt");
				int deleteCnt = params.getInt("deleteCnt");
				
				if ( insertCnt == 0 && updateCnt == 0 && deleteCnt == 0) {
					model.put("result", "ERROR");
					model.put("errmsg", "업데이트할 내용이 없습니다.");
					return new ModelAndView(this.ajaxMainView, model);
				}
				
				// service:
				xmlAjaxService.XmlAjaxUpdate(zSqlFile, zSqlId, zReturnType, zRowSeparate, zColSeparate, insertCnt, updateCnt, deleteCnt, params, companyCode, userId, userIp, model);
		        
				model.put("result", "OK");
			}
		} catch ( Exception ex ) {
			model.put("result", "ERROR");
			model.put("errmsg", "작업중 오류가 발생하였습니다.");
			
			//throw ex;
			logger.error(ex);
		}
		
		return new ModelAndView(this.ajaxMainView, model);
	}
	
	
	
	@SslOn
	@RequestMapping(value="/core/xmlAjaxUpdateModal")
	@ResponseBody
	public ModelAndView xmlAjaxUpdateModal(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		ModelAndView mav = new ModelAndView("jsonView");
		Map<String, Object> model = new HashMap<>();
		
		model.put("datas", "");
		
		if ( ! adminMemberService.isUserLoginCheck(reqVo,response) ) {
			model.put("result", "LoginOut");
			model.put("errmsg", "세션이 종료되어 로그인 화면으로 이동합니다.");
			
			return new ModelAndView(this.ajaxMainView, model);
		}
		
		try {
			String pageParam    = (String) reqVo.get("pageParam");
			pageParam           = xmlAjaxReplaceString(pageParam);
			JSONObject pageJson = new JSONObject(pageParam);
			CmMap paramMap      = new ObjectMapper().readValue(pageJson.toString(), CmMap.class);
			
			String zSqlFile     = paramMap.getString("z.sqlFile");
			String zSqlId       = paramMap.getString("z.sqlId");
			String zReturnType  = paramMap.getString("z.returnType");
			String zRowSeparate = paramMap.getString("z.rowSeparate");
			String zColSeparate = paramMap.getString("z.colSeparate");
			String companyCode;
			String userId;
			String userIp;
			
			if ( zSqlFile.equals("") || zSqlId.equals("") || zReturnType.equals("") || zRowSeparate.equals("") || zColSeparate.equals("") ) {
				model.put("result", "ERROR");
				model.put("errmsg", "XmlAjaxUpdate 필수항목이 없습니다.");
			}
			else {
				if ( ! reqVo.getString("admin_userId").equals("") ) {
					companyCode = reqVo.getString("admin_companyCode");
					userId      = reqVo.getString("admin_userId");
				} else {
					companyCode = reqVo.getString("s_companyCode");
					userId      = reqVo.getString("s_userId");
				}
				
				userIp = request.getRemoteAddr();
				
				CmMap params = getParamsToCmMap(paramMap, "z.params");
				
				int insertCnt = params.getInt("insertCnt");
				int updateCnt = params.getInt("updateCnt");
				int deleteCnt = params.getInt("deleteCnt");
				
				if ( insertCnt == 0 && updateCnt == 0 && deleteCnt == 0) {
					model.put("result", "ERROR");
					model.put("errmsg", "업데이트할 내용이 없습니다.");
					return new ModelAndView(this.ajaxMainView, model);
				}
				
				// service:
				xmlAjaxService.XmlAjaxUpdateModal(zSqlFile, zSqlId, zReturnType, zRowSeparate, zColSeparate, insertCnt, updateCnt, deleteCnt, params, companyCode, userId, userIp, model);
		        
				model.put("result", "OK");
			}
		} catch ( Exception ex ) {
			model.put("result", "ERROR");
			model.put("errmsg", "작업중 오류가 발생하였습니다.");
			
			//throw ex;
			logger.error(ex);
		}
		
		return new ModelAndView(this.ajaxMainView, model);
	}
	
	private CmMap getParamsToCmMap(CmMap cmMap, String key) throws Exception {
		CmMap params = new CmMap();
		
		if ( cmMap != null ) {
			if ( cmMap.get(key).getClass().toString().equals("class java.lang.String") ) {
				JSONObject paramJson = new JSONObject(cmMap.getString(key));
				
				if ( paramJson != null ) {
					params = new ObjectMapper().readValue(paramJson.toString(), CmMap.class);
				}
			} else {
				LinkedHashMap lhMap = (LinkedHashMap) cmMap.get(key);
				
				if ( lhMap != null ) {
					params = getMapToCmMap(lhMap);
				}
			}
		}
		
		return params;
	}
		
	private CmMap getMapToCmMap(Map map) throws Exception {
		CmMap cmMap = new CmMap();
		
		Iterator<String> iter = map.keySet().iterator();
		while ( iter.hasNext() ) {
			String key = iter.next();
			cmMap.put(key, map.get(key));
		}
		
		return cmMap;
	}
}
