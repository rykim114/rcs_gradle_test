package apps.framework.controller;

import java.io.File;
import java.io.FileInputStream;
import java.net.URLEncoder;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import apps.framework.annotation.SslOn;
import apps.framework.utils.CmPathInfo;

@Controller
@RequestMapping("/file")
@SuppressWarnings("rawtypes")
public class FileController {

	protected final Log	logger = LogFactory.getLog(this.getClass());
	
	@Resource
	MappingJackson2JsonView ajaxMainView;
	
	
	@SslOn
	@RequestMapping(value="/formDownload")
	public void formDownload(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String fileName = request.getParameter("fileName");
		String filePass = request.getParameter("filePass");
		
		/*fileName = fileName.replaceAll("/", "");
		fileName = StringUtils.replace(fileName, "\\n", "\n");
		fileName = StringUtils.replace(fileName, "\\r", "\r");
		fileName = fileName.replaceAll("..", "");
		
		filePass = filePass.replaceAll("..", "");
		*/
		String fileSrc = CmPathInfo.getUPLOAD_PATH() + filePass + fileName;
		String docName = URLEncoder.encode(fileName,"UTF-8"); // UTF-8로 인코딩
		
		File downfile = new File(fileSrc);
		
		if(!downfile.exists() || !downfile.isFile()){
			//System.out.println("nofile");
		}else{
			ServletOutputStream outStream = null;
			FileInputStream inputStream = null;
			       
			try {
		        outStream = response.getOutputStream();
		        inputStream = new FileInputStream(downfile);               
		 
		        //Setting Resqponse Header
		        String file_extension = fileName.substring(fileName.indexOf(".") + 1, fileName.length());
		        String ctype = "";
		        ctype = "application/octet-stream";
		  				        
		        response.setCharacterEncoding("utf-8");
		        response.setContentType(ctype);
		        response.setContentLength((int) downfile.length());
		        
		        response.setHeader("Content-Disposition","attachment;filename=\""+docName+"\"");
		       
		        //Writing InputStream to OutputStream
		        byte[] outByte = new byte[4096];
		        while(inputStream.read(outByte, 0, 4096) != -1)
		        {
		          outStream.write(outByte, 0, 4096);
		        }
		        
		        
			} catch (Exception e) {
				logger.error(e.getMessage());
				logger.error(e); //e.printStackTrace();
			} finally {
				if (inputStream != null) inputStream.close();
			        
			    if (outStream != null) {
			    	outStream.flush();
			    	outStream.close();
			    }
			}
		}
	}
	
}
