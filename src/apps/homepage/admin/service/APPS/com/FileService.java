package apps.homepage.admin.service.APPS.com;


import java.io.File;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.service.CmService;
import apps.framework.utils.CmPathInfo;
import apps.homepage.common.dao.core.FileDao;


@Service
@SuppressWarnings("rawtypes")


public class FileService extends CmService {

	/** The Constant logger. */
	protected final Log	logger = LogFactory.getLog(this.getClass());
	
	
	@Autowired
	private FileDao fileDao;

	/**
	 * DaumEdit 이미지 첨부 파일 전체삭제
	 * @param reqVo
	 * @return
	 */
	public void deleteFileAll(CmMap reqVo) {
		
		List<CmResMap> fileList = this.fileDao.selectFileList(reqVo);
		
		if(fileList.size() > 0){
			try {
				File file;
				for (Iterator iterator = fileList.iterator(); iterator.hasNext();) {
					CmResMap cmResMap = (CmResMap) iterator.next();
					
					CmMap newMap = new CmMap();
					newMap.put("atchFileId", cmResMap.getString("atch_file_id"));
					newMap.put("fileSn", cmResMap.getString("file_sn"));
					logger.debug("FileDb delete newMap : " + newMap.toString());
					
					this.fileDao.deleteFileDetail(newMap);
					
					file = new File(cmResMap.getString("file_stre_cours"));
					// 파일 삭제
					if(file.exists()){
						logger.debug("serverFile delete newReqVo : " + cmResMap.getString("file_stre_cours"));
						file.delete();
					}	
				}
			} catch (Exception e) {
				// TODO: handle exception
				if (logger.isDebugEnabled()) logger.error(e); //e.printStackTrace();
			}

		}
        
	}
	/**
	 * DaumEdit 이미지 첨부 파일 삭제
	 * @param reqVo
	 * @return
	 */
	public void deleteFile(CmMap reqVo) {
		
		// 파일이 등록된 파일이 아닐경우
		if(!reqVo.getString("atchFileId").isEmpty() && !reqVo.getString("fileSn").isEmpty()){
			try {
				logger.debug("FileDb delete reqVo : " + reqVo.toString());
				
				this.fileDao.deleteFileDetail(reqVo);
			} catch (Exception e) {
				// TODO: handle exception
				if (logger.isDebugEnabled()) logger.error(e); //e.printStackTrace();
			}
		}
		
		String serverPath = CmPathInfo.getUPLOAD_PATH();
		String upload_path =  reqVo.getString("filePath");
		String fileName =  reqVo.getString("filename");
		
		String path = serverPath + upload_path + fileName;
		
		File file = new File(path);
        // 파일 삭제
        if(file.exists()){
        	logger.debug("serverFile delete file_full_path : " + path);
        	file.delete();
        }
        
	}
	
		
	
}
