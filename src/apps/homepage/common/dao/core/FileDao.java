package apps.homepage.common.dao.core;

import java.io.File;
import java.util.List;

import org.springframework.stereotype.Repository;

import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.utils.CmPathInfo;


@Repository
@SuppressWarnings("rawtypes")
public class FileDao extends CmDaoExt{
	
	public CmResMap selectFileInfo(CmMap reqVo) {
		return this.cmDao.getObject("FileDao.selectFileInfo",reqVo);
	}

	public CmResMap selectFileMstInfo(CmMap reqVo) {
		return this.cmDao.getObject("FileDao.selectFileMstInfo",reqVo);
	}
	
	public String selectFileId(CmMap reqVo) {
		return this.cmDao.getString("FileDao.selectFileId",reqVo);
	}
	
	public void insertFileMaster(CmMap reqVo){
		this.cmDao.update("FileDao.insertFileMaster", reqVo);
	}
	
	public void insertFileDetail(CmMap reqVo){
		this.cmDao.update("FileDao.insertFileDetail", reqVo);
	}
	
	public void deleteFileDetail(CmMap reqVo){
		this.cmDao.update("FileDao.deleteFileDetail", reqVo);
	}
	
	public void deleteFileMaster(CmMap reqVo){
		this.cmDao.update("FileDao.deleteFileMaster", reqVo);
	}
	
	public List<CmResMap> selectFileList(CmMap reqVo) {
		return this.cmDao.getList("FileDao.selectFileList",reqVo);
	}
	
	public int getDeleteCount(CmMap reqVo) {
		return this.cmDao.getCount("FileDao.getDeleteCount",reqVo);
	}
	/**
	 * 첨부 파일 삭제
	 * @param reqVo
	 * @return
	 */
	public void deleteFile(CmMap reqVo) {

		String serverPath = CmPathInfo.getUPLOAD_PATH();
		String upload_path =  reqVo.getString("filePath");
		String fileName =  reqVo.getString("filename");
		
		logger.debug("=============================  reqVo : "+reqVo.toString());
		// 파일이 등록된 파일이 아닐경우
		if(!reqVo.getString("atchFileId").isEmpty() && !reqVo.getString("fileSn").isEmpty()){
			try {
				
				if(upload_path.isEmpty() || fileName.isEmpty()){
					CmResMap fileInfo = this.selectFileInfo(reqVo);
					if(fileInfo != null){
						logger.debug("select fileInfo : "+fileInfo.toString());
						upload_path =  fileInfo.getString("file_stre_cours");
						fileName =  fileInfo.getString("stre_file_nm");
					}
				}
				
				logger.debug("FileDb delete reqVo : " + reqVo.toString());
				this.deleteFileDetail(reqVo);
			} catch (Exception e) {
				// TODO: handle exception
			}
		}
		
		String path = serverPath + upload_path + fileName;
		
		File file = new File(path);
        // 파일 삭제
        if(file.exists()){
        	logger.debug("serverFile delete file_full_path : " + path);
        	file.delete();
        }
        
	}
	public CmResMap selectFileInf(CmMap reqVo) {
		return this.cmDao.getObject("FileDao.selectFileInf",reqVo);
	}

	public int getMaxFileSN(CmMap reqVo) {
		return this.cmDao.getCount("FileDao.getMaxFileSN",reqVo);
	}
}