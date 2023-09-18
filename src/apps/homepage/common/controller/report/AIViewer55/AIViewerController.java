package apps.homepage.common.controller.report.AIViewer55;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import apps.framework.annotation.SslPass;
import apps.framework.controller.CmController;
import apps.framework.object.CmMap;

@Controller
@SuppressWarnings("rawtypes")
public class AIViewerController extends CmController {

	/** The Constant logger. */
	protected final Log logger = LogFactory.getLog(this.getClass());

	@Resource
	MappingJackson2JsonView ajaxMainView;

	@SslPass
	@RequestMapping(value = { "/AIViewer55/*", "/AIViewer55/*/*" })
	public ModelAndView AIViewerManager(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request,
			HttpServletResponse response) {
		ModelAndView mav = new ModelAndView("");

		String uri = request.getRequestURI();
		String url = request.getRequestURL().toString();

		uri = uri.substring(0, uri.length() - 3);
		mav.setViewName("/common/report/" + uri);

		String as_comp = (String) reqVo.get("as_comp");
		String as_proj = (String) reqVo.get("as_proj");
		String as_sell = (String) reqVo.get("as_sell");
		String as_contid = (String) reqVo.get("as_contid");
		String menu = (String) reqVo.get("menu");

		String reportMode = (reqVo.get("reportMode") == null) ? "" : (String) reqVo.get("reportMode");

		if (!reportMode.equals("PDF") && !reportMode.equals("AR5") && !reportMode.equals("")) {

			//Map<String, Object> model = new HashMap<>();

			//model.put("message", "잘못된 접근입니다.");

			mav.addObject("message", "잘못된 접근입니다.");
	//		mav.setViewName("front/pc/signon/elesign_list");
			return mav;

//			return new ModelAndView("front/pc/signon/elesign_list" , model);
		}else {
			
			
			mav.addObject("as_comp", as_comp);
			mav.addObject("as_proj", as_proj);
			mav.addObject("as_sell", as_sell);
			mav.addObject("as_contid", as_contid);
			mav.addObject("menu", menu);
			
			return mav;
		}
	}
	/*
	 * 
	 * @RequestMapping(value="/AIViewer55/report/contract_form") public ModelAndView
	 * AIViewerContract(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest
	 * request, HttpServletResponse response) { ModelAndView mav = new
	 * ModelAndView("/AIViewer55/report/contract_form");
	 * 
	 * String as_comp = (String)reqVo.get("as_comp"); String as_proj =
	 * (String)reqVo.get("as_proj"); String as_sell = (String)reqVo.get("as_sell");
	 * String as_contid = (String)reqVo.get("as_contid"); String menu =
	 * (String)reqVo.get("menu");
	 * 
	 * 
	 * mav.addObject("as_comp", as_comp); mav.addObject("as_proj", as_proj);
	 * mav.addObject("as_sell", as_sell); mav.addObject("as_contid", as_contid);
	 * mav.addObject("menu", menu);
	 * 
	 * return mav; }
	 * 
	 * @RequestMapping(value="/AIViewer55/report/bill_total") public ModelAndView
	 * AIViewerBillTotal(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest
	 * request, HttpServletResponse response) { ModelAndView mav = new
	 * ModelAndView("/AIViewer55/report/bill_total");
	 * 
	 * String as_comp = (String)reqVo.get("as_comp"); String as_proj =
	 * (String)reqVo.get("as_proj"); String as_sell = (String)reqVo.get("as_sell");
	 * String as_contid = (String)reqVo.get("as_contid"); String menu =
	 * (String)reqVo.get("menu");
	 * 
	 * 
	 * mav.addObject("as_comp", as_comp); mav.addObject("as_proj", as_proj);
	 * mav.addObject("as_sell", as_sell); mav.addObject("as_contid", as_contid);
	 * mav.addObject("menu", menu);
	 * 
	 * return mav; }
	 */
//	@CheckSSL
//	@RequestMapping(value="/AIViewer55/dojang")	
//	public ModelAndView AiviewerDojang(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) throws Exception {		
//				
//		ModelAndView mav = new ModelAndView("jsonView");		
//		Map<String, Object> model = new HashMap<>();
//		
//		String pageParam = (String)reqVo.get("pageParam");
//		
//
//		JSONObject json = null;
//		json = new JSONObject(pageParam);
//		CmMap jreqMap = new ObjectMapper().readValue(json.toString(), CmMap.class);
//		
//		String data1 =(String)jreqMap.get("company_code");
//		String data2 = (String)jreqMap.get("proj_code");
//		String data3 = (String)jreqMap.get("sell_code");
//		String data4 = (String)jreqMap.get("g_c_id");
//		String data5 = (String)jreqMap.get("c_id");
//
//		
//		
//		CmMap reqMap = new CmMap();
//		reqMap.put("data1", data1);
//		reqMap.put("data2", data2);
//		reqMap.put("data3", data3);
//		reqMap.put("data4", data4);
//		reqMap.put("data5", data5);
//
//		String sqlname= "LM02070_Dao.LM02070_print_dojang.select";
//		SealFileImageVO seal =  commonDao.SealFileVoSelectsql(sqlname, reqMap);
//		
//		 byte[] imageFile = null;
//		 String origin_file_nm = "";
//		 String file_ext = "";
//		 Object seal_obj;
//		 
//		 
//		if (seal != null){
//				
//				origin_file_nm = seal.getOrigin_file_nm();
//				file_ext = seal.getFile_ext();
//				//seal_obj = cmResMap.get("seal");
//				imageFile = seal.getSeal();
//
//				model.put("img_result", imageFile);
//				model.put("ajaxResult", "OK");
//		
//
//		}else{
//			model.put("errmsg", "파일없음");
//			model.put("ajaxResult", "ERROR");
//		}
//		return new ModelAndView(this.ajaxMainView, model);	
//	}
}