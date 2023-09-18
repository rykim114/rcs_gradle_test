package apps.homepage.admin.controller.APPS.com;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import java.net.URLEncoder;
import java.io.FileInputStream;
import java.io.PrintWriter;
import java.io.IOException;
import javax.servlet.ServletOutputStream;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import com.fasterxml.jackson.databind.ObjectMapper;

import apps.framework.annotation.CheckSSL;
import apps.framework.annotation.SslOn;
import apps.framework.controller.CmController;
import apps.framework.dao.CmDao;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.utils.CmFunction;
import apps.framework.utils.CmPathInfo;
import apps.homepage.admin.dao.main.AdminMainDao;
import apps.framework.utils.FileUtil;
import apps.homepage.admin.service.member.AdminLoginService;
import apps.homepage.common.dao.core.CommonDao;
import apps.homepage.common.dao.core.FileDao;



@Controller
@RequestMapping("/admin")
@SuppressWarnings("rawtypes")
public class ComController extends CmController {
	
	/** The Constant logger. */
	protected final Log	logger = LogFactory.getLog(this.getClass());
	
	@Autowired
	private AdminLoginService adminMemberService;
	
	@Autowired AdminMainDao adminMainDao; 
	
	@Autowired
	private CommonDao commonDao;
	
	@Autowired

	private CmDao cmDao;
	
	@Autowired
	private FileDao fileDao;
	

	@Resource
	MappingJackson2JsonView ajaxMainView;
		
	private CmResMap checkAuthUserPgm(String userId, String pgmCode) {
		
		CmMap reqVe = new CmMap();
		reqVe.put("userId"  , userId);
		reqVe.put("pgm_code", pgmCode);
		
		List<CmResMap> datas = commonDao.XmlSelectsql("CommDao.getUserMenu.select", reqVe);

		return datas.size() > 0 ? datas.get(0) : null;
	}
	
	@SslOn
	@RequestMapping(value="/com/menuJsp")
	public ModelAndView menuLinkJsp(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		ModelAndView mav = new ModelAndView("/admin/main/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminMain");
		
		if ( ! adminMemberService.isUserLoginCheck(reqVo,response) ) {
			Map<String, Object> model = new HashMap<>();
			model.put("result" , "LoginOut");
			model.put("message", "세션이 종료되어 로그인 화면으로 이동합니다.");
			model.put("datas"  , "");
			
			return new ModelAndView(this.ajaxMainView, model);
		}
		
		try {
			String pageParam = (String) reqVo.get("pageParam");
			pageParam        = xmlAjaxReplaceString(pageParam);
			JSONObject json  = new JSONObject(pageParam);
			CmMap paramMap   = new ObjectMapper().readValue(json.toString(), CmMap.class);
			
			HttpSession session = request.getSession();
			String session_id = session.getId();
			String zPgmCode = paramMap.getString("z.pgmCode");
			String userId = CmFunction.getStrVal((String)session.getAttribute("admin_userId"));
			
			reqVo.put("userId", userId);
			reqVo.put("session_id", session_id);
			reqVo.put("pgmCode", zPgmCode);
			
			if ( zPgmCode.equals("") ) {
				Map<String, Object> model = new HashMap<>();
				model.put("result", "ERROR");
				model.put("message", "프로그램 로드에 필요한 필수항목이 없습니다.");
				return new ModelAndView(this.ajaxMainView, model);
			}
			else {
				CmResMap pgmInfo = checkAuthUserPgm(reqVo.getString("admin_userId"), zPgmCode);
				
				if ( pgmInfo == null ) {
					Map<String, Object> model = new HashMap<>();
					model.put("result", "ERROR");
					model.put("message", "프로그램 또는 권한이 없습니다.");
					return new ModelAndView(this.ajaxMainView, model);
				}
				
				/* 이전메뉴 체류시간 기록 */
				adminMainDao.updateMenuTime(reqVo);
				adminMainDao.insertMenuLog(reqVo);
				
				mav.setViewName("/admin/APPS" + pgmInfo.getString("pgmurl"));
			}
		} catch ( Exception ex ) {
			//throw ex;
			logger.error(ex);
			
			Map<String, Object> model = new HashMap<>();
			model.put("result", "ERROR");
			model.put("message", "작업중 오류가 발생하였습니다.");
			return new ModelAndView(this.ajaxMainView, model);
		}
		return mav;
	}
	
	@SslOn
	@RequestMapping(value="/com/menuModalJsp")
	public ModelAndView menuLinkModalJsp(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {
		ModelAndView mav = new ModelAndView("/admin/main/metronic_v" + reqVo.getString("METRONIC_VERSION") + "/adminMain");
		
		try {
			String pageParam = (String) reqVo.get("pageParam");
			pageParam        = xmlAjaxReplaceString(pageParam);
			JSONObject json  = new JSONObject(pageParam);
			CmMap paramMap   = new ObjectMapper().readValue(json.toString(), CmMap.class);
			
			HttpSession session = request.getSession();
			String session_id = session.getId();
			String zPgmCode = paramMap.getString("z.pgmCode");
			String userId = CmFunction.getStrVal((String)session.getAttribute("admin_userId"));
			
			logger.info(zPgmCode);
			
			reqVo.put("userId", userId);
			reqVo.put("session_id", session_id);
			reqVo.put("pgmCode", zPgmCode);
			
			logger.info(session_id);
			
			if ( zPgmCode.equals("") ) {
				Map<String, Object> model = new HashMap<>();
				model.put("result", "ERROR");
				model.put("message", "프로그램 로드에 필요한 필수항목이 없습니다.");
				return new ModelAndView(this.ajaxMainView, model);
			}
			else {
				CmResMap pgmInfo = checkAuthUserPgm(reqVo.getString("admin_userId"), zPgmCode);
				
				if( pgmInfo.getString("modalyn").equals("N")){
					Map<String, Object> model = new HashMap<>();
					model.put("result", "ERROR");
					model.put("message", "프로그램 페이지가 필요한 필수항목이 없습니다.");
					return new ModelAndView(this.ajaxMainView, model);
				}
				
				mav.setViewName("/admin/APPS" + pgmInfo.getString("pgmurl") + "Modal");
			}
		} catch ( Exception ex ) {
			//throw ex;
			logger.error(ex);
			
			Map<String, Object> model = new HashMap<>();
			model.put("result", "ERROR");
			model.put("message", "작업중 오류가 발생하였습니다.");
			return new ModelAndView(this.ajaxMainView, model);
		}
		
		logger.info(mav);
		
		return mav;
	}
	
	
	@SslOn
	@RequestMapping(value="/com/buttonLog")
	public ModelAndView buttonLog(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) throws Exception {		
		ModelMap   model = new ModelMap();
		
		if ( ! adminMemberService.isUserLoginCheck(reqVo,response) ) {
			model.put("result" , "LoginOut");
			model.put("message", "세션이 종료되어 로그인 화면으로 이동합니다.");
			model.put("datas"  , "");
			
			return new ModelAndView(this.ajaxMainView, model);
		}
		try {
			String pageParam = (String) reqVo.get("pageParam");
			pageParam        = xmlAjaxReplaceString(pageParam);
			JSONObject json  = new JSONObject(pageParam);
			CmMap paramMap   = new ObjectMapper().readValue(json.toString(), CmMap.class);
			
			HttpSession session = request.getSession();
			String session_id = session.getId();
			String zPgmCode = paramMap.getString("z.pgmCode");
			String zIntent  = paramMap.getString("z.inTent");
			String zBtnName = paramMap.getString("z.btnName");
			String userId = CmFunction.getStrVal((String)session.getAttribute("admin_userId"));
			
			reqVo.put("userId", userId);
			reqVo.put("session_id", session_id);
			reqVo.put("pgmCode", zPgmCode);
			reqVo.put("inTent" , zIntent);
			reqVo.put("btnName", zBtnName);
			
			adminMainDao.insertMenuBtnLog(reqVo);
			
			//F : 파일, E : 엑셀, C : 차트 현재 이 의도로 사용하고 있지 않음
/*			if ( zIntent.equals("F") || zIntent.equals("E") || zIntent.equals("C")){
				adminMainDao.insertMenuDownBtnLog(reqVo);
			}*/
		} catch ( Exception ex ) {
			//throw ex;
			logger.error(ex);
			model.put("result", "ERROR");
			model.put("message", "작업중 오류가 발생하였습니다.");
			
		}
		return new ModelAndView(this.ajaxMainView, model);
	}
	
	@CheckSSL
	@RequestMapping(value="/file/download")
	public void FileDownload(HttpServletRequest request, HttpServletResponse response) throws Exception {

		String atchFileId = CmFunction.getStrVal(request.getParameter("atchFileId"));
		String fileSn = CmFunction.getStrVal(request.getParameter("fileSn"));

		CmMap       reqVo = new CmMap();
		CmResMap	rvo		= null;

		String msgstr = "";
		boolean filedownchk =true;
		/*atchFileId = "FILE_000000000001017";
		fileSn ="1";*/

		logger.debug("=====================atchFileId = "+atchFileId);
		logger.debug("=====================fileSn = "+fileSn);


		if ( (atchFileId != null && !atchFileId.equals("")) && (fileSn != null && !fileSn.equals("")) ){
			reqVo.put("atchFileId", atchFileId );
			reqVo.put("fileSn", fileSn );
			reqVo.put("masterSeq", atchFileId );
			reqVo.put("detailSeq", fileSn );

			logger.debug("=====================fileSn = "+fileSn);
			rvo = this.fileDao.selectFileInf(reqVo);

			if ( rvo != null ){
//				String filePath = CmPathInfo.getUPLOAD_PATH()+rvo.getString("file_stre_cours");
				String filePath = rvo.getString("file_stre_cours");
				byte[] fn = rvo.getString("stre_file_nm").getBytes();
				String filename = new String(fn,"UTF-8");

				String sfileName = rvo.getString("orignl_file_nm").toString(); //리퀘스트로 넘어온 파일명
				String docName = URLEncoder.encode(sfileName,"UTF-8"); // UTF-8로 인코딩

				//String filename = rvo.getString("stre_file_nm");

				//System.out.println("filePath.substring(filePath.length())====>"+filePath.substring(filePath.length()-1));
				if (!filePath.substring(filePath.length()-1).equals("/") ){
					filePath = filePath+"/";
				}

				File downfile = new File(filePath+filename);

				if(!downfile.exists() || !downfile.isFile()){
					downfile = new File(filePath+rvo.getString("stre_file_nm"));
				}

				if(!downfile.exists() || !downfile.isFile()){
					filedownchk = false;
					msgstr = "파일이 존재하지 않습니다.";

				}else{
					ServletOutputStream outStream = null;
					FileInputStream inputStream = null;

					try {
				        outStream = response.getOutputStream();
				        inputStream = new FileInputStream(downfile);

				        //Setting Resqponse Header
				        String arrFileN = rvo.getString("stre_file_nm");
				        String []arrFile = arrFileN.split("\\.");
				        String file_extension = "";
				        if  (arrFile != null && arrFile.length > 0){
				        	file_extension = arrFile[arrFile.length-1];
				        }else{
				        	file_extension = arrFileN.substring(arrFileN.length()-4);
				        }
				        file_extension = file_extension.toUpperCase().trim();
				        String ctype = "";
				        ctype = "application/octet-stream";

				        response.setCharacterEncoding("utf-8");
				        response.setContentType(ctype);
				        response.setContentLength((int) downfile.length());

				        /*if (file_extension.equals("pdf")){
				        	response.setHeader("Content-Disposition","inline;filename=\""+docName+"\"");
				        }else{*/
				        	response.setHeader("Content-Disposition","attachment;filename=\""+docName+"\"");
						//}

				        //Writing InputStream to OutputStream
				        byte[] outByte = new byte[4096];
				        while(inputStream.read(outByte, 0, 4096) != -1)
				        {
				          outStream.write(outByte, 0, 4096);
				        }


					} catch (Exception e) {
						logger.error(e.getMessage());

						filedownchk = false;
						msgstr = "다운로드 스트림 오류발생!!";

					} finally {
					        inputStream.close();
					        outStream.flush();
					        outStream.close();
					}

		        }

			}else{
				filedownchk = false;
				msgstr = "파일 데이터 DB에 존재하지 않는 Key";
			}
		}

		if (!filedownchk){
			PrintWriter out = null;
			response.setContentType("text/html; charset=utf-8");
			try
	        {
	            out = response.getWriter();
	        }
	        catch(IOException e1)
	        {
	            e1.printStackTrace();
	        }

			out.println("<script type=\"text/javascript\">");
			out.println((new StringBuilder("alert('")).append(msgstr).append("')"));
	        out.println("</script>");
	        out.flush();
	        out.close();
		}

	}	

	
	
	@CheckSSL
	@RequestMapping(value="/main/com/uploadDropzone")
	public ModelAndView FileUploadDropzone(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response, MultipartHttpServletRequest file) throws Exception {
		ModelAndView mav = new ModelAndView("jsonView");

		String userId      = (String)reqVo.get("admin_userId");
		String userIp      = (String)reqVo.get("ipAddr");
		String obj         = (String)reqVo.get("obj");
		String fileid      = (String)reqVo.get("fileid");
		String detailSeq   = (String)reqVo.get("detailSeq");
		String encFileid   = "";
		String upload_path = CmPathInfo.getUPLOAD_PATH();
		String block_ext   = "asp,html,htm,php,php3,cgi,phtm,phtm,inc,sql,pl,jsp,js,css,war";  // 업로드 불가 확장자
		String fileReadExt = null;
		
		int maxcount        = Integer.parseInt(detailSeq);
		int fileSize        = 0;
		int upload_max_size =  30 * 1024;  //10MB
		
		boolean returnFlag = true;
		
		
		if (reqVo.get("fileReadExt") != null && !reqVo.get("fileReadExt").equals("") && !reqVo.get("fileReadExt").equals("undefined")) {
			fileReadExt = (String)reqVo.get("fileReadExt");
		}
		if (reqVo.get("fileSize") != null && !reqVo.get("fileSize").equals("") && Integer.parseInt((String) reqVo.get("fileSize")) > 0) {
			fileSize = Integer.parseInt((String) reqVo.get("fileSize"));
		}
	//	if (upload_path == null){
			//upload_path = CmFunction.getTodayString("YYYY")+"/"+CmFunction.getTodayString("MM")+"/";

	//	}
		
		if (reqVo.get("fileSize") == null ) {
			reqVo.put("fileSize","0");
		}
		if (reqVo.get("fileSize").equals("undefined")) {
			reqVo.put("fileSize","0");
		}
		
		reqVo.put("userId", userId);
		reqVo.put("userIp", userIp);

		int count = fileDao.getDeleteCount(reqVo);
		
		if(count == 0) {
			reqVo.put("masterSeq", "0");
			maxcount = 0;
			// detailSeq도 reset!!
		}
		
		List<HashMap<String, Object>> ListReturnValue = new ArrayList<HashMap<String,Object>>();
		HashMap<String, Object> ReturnValue = new HashMap<String, Object>();
		HashMap<String,Object> rmap = new HashMap<String,Object>();
		
		
		Iterator<String> iter  = file.getFileNames();  //file 객체 이름을 가져온다.
		
		while (iter.hasNext()) {
			String uploadFileName = iter.next();
			
			List<MultipartFile> excelFiles = file.getFiles(uploadFileName);

			String[] arr_Block_Ext   = block_ext.split(",");
			String[] arr_fileReadExt = null;
			
			if (fileReadExt != null && !fileReadExt.equals("")) {
				arr_fileReadExt = fileReadExt.split(",");
			}

			if(fileSize > 0) {
				upload_max_size = fileSize;
			}

			if (excelFiles != null) {
				for ( MultipartFile excelFile : excelFiles ) {
					FileUtil.checkNotUploadFile(excelFile, arr_Block_Ext, rmap);

					boolean fileResult = FileUtil.fileUpload(excelFile, upload_max_size, arr_Block_Ext, CmPathInfo.getUPLOAD_PATH(), "", rmap,arr_fileReadExt);
					//boolean fileResult = FileUtil.fileUpload(excelFile, upload_max_size, arr_Block_Ext, CmPathInfo.getUPLOAD_PATH()+upload_path, "", rmap,arr_fileReadExt);
					
					if (!fileResult) {
						returnFlag = false;
					}
				}
			}

			if (returnFlag) {
				if (!rmap.get("fname").toString().equals("") && rmap.get("fname").toString() != null) {
					if ((fileid == null || fileid.equals("") || fileid.equals("null"))) {
					
						if ( reqVo.get("masterSeq").equals("0") ) {

							this.fileDao.insertFileMaster(reqVo);
							
						}
					} else {
						encFileid = fileid;
						reqVo.put("atchFileId", fileid);
					}

					reqVo.put("순번", ++maxcount);
					reqVo.put("파일저장경로", upload_path);
					reqVo.put("파일저장명", rmap.get("fname").toString());
					reqVo.put("원본파일명", rmap.get("orgfname").toString());
					reqVo.put("파일확장자", rmap.get("mime").toString());
					reqVo.put("파일사이즈", rmap.get("size").toString());
					
					String fileStreUrl = CmPathInfo.getIMG_UPLOAD_SSL_URL()+upload_path+"/"+rmap.get("fname").toString();
					//reqVo.put("파일저장URL", fileStreUrl);
					reqVo.put("파일저장URL", "" );
					reqVo.put("파일내용", " ");

					this.fileDao.insertFileDetail(reqVo);
					
					ReturnValue = new HashMap<String, Object>();
					ReturnValue.put("첨부파일ID", reqVo.get("masterSeq"));
					ReturnValue.put("fileSn", maxcount);
					ReturnValue.put("streFileNm", rmap.get("fname").toString());
					ReturnValue.put("orignlFileNm", rmap.get("orgfname").toString());
					ReturnValue.put("fileStreCours", upload_path);
					ReturnValue.put("fileExtsn", rmap.get("mime").toString());
					ReturnValue.put("path", rmap.get("path").toString());
					ReturnValue.put("fullpath", rmap.get("fullpath").toString());
					ReturnValue.put("size", rmap.get("size").toString());
					ReturnValue.put("fileStreUrl", fileStreUrl);
					ReturnValue.put("obj", obj);

					ListReturnValue.add(ReturnValue);
				}
			}
		}

		String result = "";
	
		if (returnFlag) {
			result = "OK";
			
			mav.addObject("message", "업로드 완료!!");
			mav.addObject("ReturnValue", ListReturnValue);
			mav.addObject("result", "OK");
			mav.addObject("script", "");
			mav.addObject("obj", "");
		} else {
			result = "SERVER ERROR";
			mav.addObject("result", "ERROR");
			mav.addObject("script", "파일 업로드시 오류가 발생하였습니다." ); //파일 업로드 오류시 alert 메세지
			mav.addObject("message", "업로드 오류!!");
			mav.addObject("obj", obj);
		}

		Map<String, Object> model = new HashMap();
		model.put("fileInfo", ListReturnValue);
		model.put("result", result);
		model.put("fileId", reqVo.get("masterSeq"));

		System.out.println(model);
		return new ModelAndView(this.ajaxMainView, model);
	}
	
	@CheckSSL
	@RequestMapping(value="/main/com/deleteDropzone")
	public ModelAndView FileDeleteDropzone(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) throws Exception {
		String deleteConfirm   = (String)reqVo.get("deleteConfirm");
		
		if(deleteConfirm.equals("null")|| deleteConfirm == "" || deleteConfirm.equals("")) {
			deleteConfirm = "N";
		}
		Map<String, Object> model = new HashMap();
	//	List<CmResMap> rvo = (List<CmResMap>) new CmResMap();

	//	rvo = fileDao.selectFileInf(reqVo);
		String masterSeq = (String)reqVo.get("masterSeq");
		
		if (masterSeq == "") {
			model.put("datas", "업로드된 첨부파일 없음!!");
			model.put("result", "");
		} else {
			int count = fileDao.getDeleteCount(reqVo);		
					
			try{
				//String fullpath = CmPathInfo.getUPLOAD_PATH()+rvo.getString("파일저장경로")+rvo.getString("원본파일명");
			//	String fullpath = rvo.getString("파일저장경로")+rvo.getString("파일저장명");

				
				//File file = new File(fullpath);
				//file.delete();
				
				if(deleteConfirm.equals("Y")) {
					
					this.fileDao.deleteFileMaster(reqVo);
					
					
					for(int i=1; i<=count; i++) {
						reqVo.put("detailSeq", i);
						this.fileDao.deleteFileDetail(reqVo);
					}
					
				}else {
					if(count-1 < 1) {
						this.fileDao.deleteFileMaster(reqVo);
					}
					
					this.fileDao.deleteFileDetail(reqVo);
				}
				
				model.put("datas", "삭제완료!!");
				model.put("result", "OK");

			}catch(Exception ex){
				model.put("datas", "삭제실패!!");
				model.put("result", "");
		    }
	
		}	

		return new ModelAndView(ajaxMainView, model);
	}
}
