package apps.homepage.admin.controller.main;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import apps.framework.annotation.SslOn;
import apps.framework.annotation.SslPass;
import apps.framework.controller.CmController;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.utils.CmFunction;
import apps.framework.utils.CmPathInfo;
import apps.framework.utils.CmSecretUtil;
import apps.framework.utils.FileUtil;
import apps.homepage.admin.service.main.AdminMainService;
import apps.homepage.admin.service.member.AdminLoginService;



@Controller
@RequestMapping("/admin")
@SuppressWarnings("rawtypes")
public class AdminMainController extends CmController {
	
	/** The Constant logger. */
	protected final Log	logger = LogFactory.getLog(this.getClass());
	
	@Autowired
	private AdminLoginService adminMemberService;
	
	@Autowired
	private AdminMainService adminMainService;
	
	@Resource
	MappingJackson2JsonView ajaxMainView;
	
	@Autowired
	MessageSource messageSource; 
	
	
	
	

	@SslOn
	@RequestMapping(value="/main/adminMain")
	public ModelAndView adminMain(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		ModelAndView mav = new ModelAndView("/admin/main/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminMain");
		
		if ( ! adminMemberService.isUserLoginCheck(reqVo,response) ) {
			mav.addObject("message", "로그인 후 이용하세요");
			mav.addObject("account", Integer.valueOf(0));
			
			//mav.setViewName("/admin/member/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminLogin");
			
			mav.setViewName("common/core/javascript");
			//mav.addObject("excute_script", CmFunction.jsmsg("로그인 이후 사용가능한 메뉴입니다.","B"));
			mav.addObject("excute_script", CmFunction.jsmsgLink("로그인 후 이용하세요", CmPathInfo.getSSL_URL() + "admin/member/aLogin.do", ""));
			
			return mav;
		}
		 
		adminMainService.MainFromService(reqVo, request, response, mav);

		return mav;
	}
	
	
	@SslOn
	@RequestMapping(value="/main/main" , method = { RequestMethod.GET })
	public ModelAndView main(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {

		/*ModelAndView mav = new ModelAndView("/main/dawulmap");*/		
		
		
		String strUri  = request.getRequestURI();
		String pageUri = strUri.substring(11, strUri.length() - 3);			
		
		ModelAndView mav = new ModelAndView("/admin/main/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/" + reqVo.getString("menuid"));
		
		logger.info("------------------------");
		logger.info("------------------------");
		logger.info(reqVo);
		logger.info(reqVo.getString("menuid"));
		logger.info(mav);
		logger.info("------------------------");
		
		CmResMap	rvo		= null;		
		
		if ( ! adminMemberService.isUserLoginCheck(reqVo,response) ) {
			mav.addObject("message", "로그인 후 이용하세요");
			mav.addObject("account", Integer.valueOf(0));
			
			//mav.setViewName("/admin/member/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminLogin");
			
			mav.setViewName("common/core/javascript");
			//mav.addObject("excute_script", CmFunction.jsmsg("로그인 이후 사용가능한 메뉴입니다.","B"));
			mav.addObject("excute_script", CmFunction.jsmsgLink("로그인 후 이용하세요", CmPathInfo.getSSL_URL() + "admin/member/aLogin.do", ""));
			
			return mav;
		}
		
		return mav;
	}	

	@SslOn
	@RequestMapping(value = "/main/dawulmap", method = RequestMethod.GET)
	public String dawulmap(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request,
			HttpServletResponse response) {

		return "admin/APPS/gis/dawulmap";
	}	

	@SslOn
	@RequestMapping(value = "/main/dawulmapup", method = RequestMethod.GET)
	public String dawulmapup(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request,
			HttpServletResponse response) {

		return "admin/APPS/gis/dawulmapup";
	}	

	
	
	@SslOn
	@RequestMapping(value = "/main/blockMap", method = RequestMethod.GET)
	public String blockMap(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request,
			HttpServletResponse response) {

		return "admin/main/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/blockMap";
	}
	
	@SslOn
	@RequestMapping(value = "/main/blockMap2", method = RequestMethod.GET)
	public String blockMap2(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request,
			HttpServletResponse response) {

		return "admin/main/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/blockMap2";
	}

	
	@SslOn
	@RequestMapping(value="/main/adminReloadpage")
	public ModelAndView adminReloadpage(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		ModelAndView mav = new ModelAndView("/main/adminReloadpage");
		return mav;
	}
	
	@SslPass
	@RequestMapping(value="/errmsg/adminErrorpage")
	public ModelAndView adminErrorpage(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		ModelAndView mav = new ModelAndView("/main/adminErrorpage");
		
		if ( ! adminMemberService.isUserLoginCheck(reqVo,response) ) {
			mav.addObject("message", "로그인 후 이용하세요");
			mav.addObject("account", Integer.valueOf(0));
			
			mav.setViewName("/admin/member/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminLogin");
			return mav; 
		}
		
		return mav;
	}


	@SslOn
	@RequestMapping(value="/main/heatMap")
	public ModelAndView heatMap(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request,HttpServletResponse response) {
		
		ModelAndView mav = new ModelAndView("/admin/main/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminMain");
		mav.setViewName("/admin/APPS/dashboard/heatMap");
		
		logger.info("==== heatMap ======");
		logger.info("==== heatMap ======");
		logger.info("==== heatMap ======");
		logger.info("==== heatMap ======");
		logger.info("==== heatMap ======");
		return mav;
	}
	
	@SslOn
	@RequestMapping(value="/account/excelRead")
	public ModelAndView excelRead(@ModelAttribute("reqMap") CmMap reqVo, MultipartHttpServletRequest multipartHFile, HttpServletRequest request , HttpServletResponse response) {
		Map<String, Object> model = new HashMap();
		try
		{
			//reqVo.put("xsfile", request.getParameter("xsfile"));
			
			String[] arr_Block_Ext   = {"asp","html","htm","php","php3","cgi","phtm","phtm","inc","sql","pl","jsp","js","css","war"};
			String[] arr_fileReadExt = null;
			HashMap<String,Object> rmap = new HashMap<String,Object>();
			String upload_path = CmPathInfo.getUPLOAD_PATH();
			boolean returnFlag = true;
			
			Iterator<String> itr = multipartHFile.getFileNames();	
			if(itr.hasNext()) {
				String uploadFileName = itr.next();
				MultipartFile mpf = multipartHFile.getFile(uploadFileName);
				if (mpf != null) {
					
					FileUtil.checkNotUploadFile(mpf , arr_Block_Ext, rmap);
					boolean fileResult = FileUtil.fileUpload(mpf, 30, arr_Block_Ext, CmPathInfo.getUPLOAD_PATH(), "", rmap, arr_fileReadExt);
					//boolean fileResult = FileUtil.fileUpload(excelFile, upload_max_size, arr_Block_Ext, CmPathInfo.getUPLOAD_PATH()+upload_path, "", rmap,arr_fileReadExt);
					if (!fileResult) {
						returnFlag = false;
					}
					
					if(returnFlag){
						if (!rmap.get("fname").toString().equals("") && rmap.get("fname").toString() != null) {
							
							//reqVo.put("파일저장경로", upload_path);
							//reqVo.put("파일저장명", rmap.get("fname").toString());
							
							InputStream inputStream = new FileInputStream(upload_path + File.separator + rmap.get("fname").toString());
							// 엑셀 로드 
							Workbook workbook = WorkbookFactory.create(inputStream); 
							// 시트 로드 0, 첫번째 시트 로드 
							Sheet sheet = workbook.getSheetAt(0); 
							
							List<HashMap<String, Object>> exList = new ArrayList<HashMap<String,Object>>();
							
							// 행만큼 반복
							for(int rowC = 0; rowC <= sheet.getPhysicalNumberOfRows() ; rowC++) { 
								Row row = sheet.getRow(rowC);
								HashMap<String,Object> exData = new  HashMap<String,Object>();
								if(row!=null){
									for(int cellC = 0; cellC < row.getPhysicalNumberOfCells(); cellC++){
										Cell cell = row.getCell(cellC);
										if(cell.getColumnIndex()==0){
											exData.put("pcName", cell.getStringCellValue());
										}else if(cell.getColumnIndex()==1){
											exData.put("ip", cell.getStringCellValue());
										}
									}
									exList.add(exData);
								}
							}
							if(!exList.isEmpty()){
								reqVo.put("exList", exList);
							}
						}
					}
					File exFile = new File(upload_path + File.separator + rmap.get("fname").toString());
					if(exFile.exists()){
						exFile.delete();
					}
				}
			}
			model.put("result", reqVo);
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
			model.put("result", "ERROR");
			model.put("message", "처리 중 오류 발생");
		}
		return new ModelAndView(this.ajaxMainView, model);
	}
	
	
	@SslOn
	@RequestMapping(value="/account/getPwdStr")
	public ModelAndView getPwdStr(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request , HttpServletResponse response) {
		Map<String, Object> model = new HashMap();
		model.put("pwdStr", CmSecretUtil.encodeSha256(request.getParameter("userId")+"12345678*")) ;
		return new ModelAndView(this.ajaxMainView, model);
	}
}
