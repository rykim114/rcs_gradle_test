package apps.framework.utils;


import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import net.coobird.thumbnailator.Thumbnails;


public class FileUtil {
	
	/** The Constant logger. */
	private static final Log	logger = LogFactory.getLog(FileUtil.class);
	
	/** The Constant IMAGE. */
	private static final String IMAGE = "image/";
	
	/** The Constant FLASH. */
	private static final String FLASH = "application/x-shockwave-flash";
	
	/** The Constant ERR_IMG. */
	private static final String ERR_IMG = "이미지 파일만 업로드 가능합니다.";
	
	/** The Constant ERR_FLASH. */
	private static final String ERR_FLASH = "이미지 또는 플래쉬 파일만 업로드 가능합니다.";

	/**
	 * 존재여부 확인
	 *
	 * @param f the f
	 * @return true, if is exist
	 */
	public static boolean isExist(MultipartFile f) {
		if (f == null) return false;	
		return ! f.isEmpty();
	}

	/**
	 * 파일 업로드
	 *
	 * @param f the f
	 * @param max the max
	 * @param blockexts the blockexts
	 * @param targetPath the target path
	 * @param fixFilename the fix filename
	 * @param rmap the rmap
	 * @return true, if successful
	 */
	public static boolean fileUpload(MultipartFile f, int max, String[] blockexts, String targetPath, String fixFilename, Map<String, Object> rmap, String[] arr_fileReadExt) {
		if (! isExist(f)) {
			rmap.put("isok", true);
			rmap.put("path", "");
			rmap.put("fullpath", "");
			rmap.put("fname", "");
			rmap.put("size", 0);
			return true;
		}

		if (!checkUploadSizeDefault(f, max, rmap)) return false;
		if (!checkUploadFile(f, blockexts, rmap, arr_fileReadExt)) return false;

		String resultPath = targetPath;

		String fname = f.getOriginalFilename();
		
		fname = fname.replaceAll("/", "");
		fname = StringUtils.replace(fname, "\\n", "\n");
		fname = StringUtils.replace(fname, "\\r", "\r");
		
		String f_head = StringUtils.stripFilenameExtension(fname);
		String f_ext = StringUtils.getFilenameExtension(fname);

		if (logger.isDebugEnabled()) {
			logger.debug(String.format("f[%s] targetPath[%s] fname[%s] f_head[%s] f_ext[%s]" , f, targetPath, fname, f_head, f_ext));
		}

		String sFilename = "FILE_"+CmFunction.getTodayString("yyyyMMddHHmmss")+CmFunction.getRandomString(5)+ "." + f_ext;
		sFilename = getUniqueFilename(targetPath, sFilename);
		/*if (StringUtils.hasText(fixFilename)) {
			if (fixFilename.indexOf(".") == -1) {
				fixFilename = fixFilename + "." + f_ext;
			}
			sFilename = fixFilename;
			deleteAFile(targetPath, sFilename);
		} else {
			sFilename = getUniqueFilename(targetPath, excFilename(fname));
		}*/

		if (logger.isDebugEnabled()) {
			logger.debug(String.format("f[%s] targetPath[%s] fname[%s] f_head[%s] f_ext[%s] sFilename[%s]"
					, f, targetPath, fname, f_head, f_ext, sFilename));
		}

		File dir = new File(targetPath);
		if (! dir.exists()) dir.mkdirs();

		String saveFileName = "";
		
		if (targetPath.substring(targetPath.length()-1).equals("/")){
			saveFileName = targetPath + sFilename;
		}else{
			saveFileName = targetPath + "/" + sFilename;
		}
		
		File saveFile = new File(saveFileName);
		try {
			f.transferTo(saveFile);
		} catch (IllegalStateException e) {
			logger.error(e); //e.printStackTrace();
		} catch (IOException e) {
			logger.error(e); //e.printStackTrace();
		}
		
		
		

		long size = f.getSize();

		rmap.put("isok", true);
		rmap.put("path", targetPath);
		rmap.put("fullpath", saveFileName);
		rmap.put("fname", sFilename);
		rmap.put("orgfname", fname);
		rmap.put("size", size);
		rmap.put("mime", f.getContentType());
		if (logger.isDebugEnabled()) {
			logger.debug(rmap.toString());
		}

		return true;
	}

	/**
	 * 파일 복사
	 *
	 * @param originalPath the original path
	 * @param targetPath the target path
	 * @param filename the filename
	 * @param isOver the is over
	 * @return the string
	 */
	public static String copyAFile(String originalPath, String targetPath, String filename, boolean isOver) {
		File dir = new File(targetPath);
		if (! dir.exists()) dir.mkdirs();

		if (isOver) {
			deleteAFile(targetPath, filename);
		}

		String sFilename = getUniqueFilename(targetPath, filename);

		File from = new File(originalPath + "/" + filename);
		File to = new File(targetPath + "/" + sFilename);
		try {
			FileCopyUtils.copy(from, to);
		} catch (IOException e) {
			sFilename = "";
		}

		return sFilename;
	}
	

	/**
	 * 파일 존재유무
	 *
	 * @param fullpath the fullpath
	 * @return true, if is exist
	 */
	public static boolean isExist(String fullpath) {
		File f = new File(fullpath);
		return f.isFile();
	}

	/**
	 * 파일 삭제
	 *
	 * @param path the path
	 * @param fname the fname
	 * @return true, if successful
	 */
	public static boolean deleteAFile(String path, String fname) {
		String fullpath = path + "/" + fname;	
		File f = new File(fullpath);
		if (f.exists() && !f.isDirectory()) {
			f.delete();
			return true;
		}

		return false;
	}

	/**
	 * 파일 삭제
	 *
	 * @param fullPath the full path
	 * @return true, if successful
	 */
	public static boolean deleteAFile(String fullPath) {
		if ( fullPath == null || "".equals( fullPath ) ) {
			return false;
		}
		
		File f = new File(fullPath);
		if (f.exists() && !f.isDirectory()) {
			f.delete();
			return true;
		}

		return false;
	}
	
	public static boolean deleteDIR(String fullPath) {
		File[] listFile = new File(fullPath).listFiles(); 
		try{
			if (listFile != null){
				if(listFile.length > 0){
					for(int i = 0 ; i < listFile.length ; i++){
						if(listFile[i].isFile()){
							listFile[i].delete(); 
						
						}else{
							deleteDIR(listFile[i].getPath());
						}
						listFile[i].delete();
					}
				}
				
				File dir = new File(fullPath);
				dir.delete();
			}else{
				return false;
			}
			
		}catch(Exception e){
			System.err.println(System.err);
			System.exit(-1); 
			
			return false;
		}
		
		
		return true;
	}
	

	/**
	 * UNIQUE 파일명 생성
	 *
	 * @param path the path
	 * @param fname the fname
	 * @return the unique filename
	 */
	public static String getUniqueFilename(String path, String fname) {
		String f_head = StringUtils.stripFilenameExtension(fname);	
		String f_ext = StringUtils.getFilenameExtension(fname);	
		
		String newFname = fname;
		int idx = 0;
		do {
			File f = new File(path + "/" + newFname);
			if (! f.isFile()) break; 

			newFname = f_head + "_" + idx + "." + f_ext;
			++idx;
		} while(true);

		return newFname;
	}

	/**
	 * 파일명 치환
	 *
	 * @param fname the fname
	 * @return the string
	 */
	public static String excFilename(String fname) {
		String f_head = StringUtils.stripFilenameExtension(fname);	
		String f_ext = StringUtils.getFilenameExtension(fname);	

		f_head = f_head
			.replaceAll(" ", "_")
			.replaceAll(",", "_")
			.replaceAll("\"", "_")
			.replaceAll("'", "_")
			.replaceAll("`", "_")
			.replaceAll("!", "_")
			.replaceAll("%", "_")
			.replaceAll("&", "_");

		return f_head + "." + f_ext;
	}

	/**
	 * 업로드 파일 확인 (업로드 제한 파일 확인)
	 *
	 * @param f the f
	 * @param blockexts the blockexts
	 * @param rmap the rmap
	 * @return true, if successful
	 */
	public static boolean checkUploadFile(MultipartFile f, String[] blockexts, Map<String, Object> rmap,String[] arr_fileReadExt) {
		String fname = f.getOriginalFilename();
		String f_ext = StringUtils.getFilenameExtension(fname);
		if (f_ext == null) {
			rmap.put("isok", true);
		} else if(arr_fileReadExt != null && arr_fileReadExt.length > 0){
			
			
			if(in_exist_array(arr_fileReadExt, f_ext.toLowerCase())){
				rmap.put("isok", false);
				rmap.put("msg", "업로드가 불가능한 파일입니다.\\n\\n(파일명: " + fname  + ")");
				rmap.put("script_code", "B");
				
				// 신버전 호환
				rmap.put("script", "업로드가 불가능한 파일입니다.\\n\\n(파일명: "+fname+")");
				
			}
			
		} else if (in_array(blockexts, f_ext.toLowerCase())) {
			rmap.put("isok", false);
			rmap.put("msg", "업로드가 불가능한 파일입니다.\\n\\n(파일명: " + fname  + ")");
			rmap.put("script_code", "B");

			// 신버전 호환
			rmap.put("script", "업로드가 불가능한 파일입니다.\\n\\n(파일명: "+fname+")");
		}  else {
			rmap.put("isok", true);
		}

		if (logger.isDebugEnabled()) {
			logger.debug(String.format("f[%s] fname[%s] blockexts[%s] f_ext[%s] res[%b]", f, fname, blockexts, f_ext, rmap.get("isok")));
		}

		return (Boolean)rmap.get("isok");
	}
	
	/**
	 * In_array.
	 *
	 * @param haystack the haystack
	 * @param needle the needle
	 * @return true, if successful
	 */
	public static boolean in_array(String[] haystack, String needle) {
		for (String s : haystack) {
			if (s.equals(needle)) return true;
		}

		return false;
	}
	/**
	 * In_array.
	 *
	 * @param haystack the haystack
	 * @param needle the needle
	 * @return true, if successful
	 */
	public static boolean in_exist_array(String[] haystack, String needle) {
		for (String s : haystack) {
			if (!s.equals(needle)) return true;
		}
		
		return false;
	}

	/**
	 * 업로드 파일 확인 (업로드 제한 파일 확인)
	 *
	 * @param f the f
	 * @param blockexts the blockexts
	 * @param rmap the rmap
	 * @return true, if successful
	 */
	public static boolean checkNotUploadFile(MultipartFile f, String[] blockexts, Map<String, Object> rmap) {
		String fname = f.getOriginalFilename();
		String f_ext = StringUtils.getFilenameExtension(fname);
		if (f_ext == null) {
			rmap.put("isok", true);
		} else if (in_array(blockexts, f_ext.toLowerCase())) {
			rmap.put("isok", false);
			rmap.put("msg", "업로드가 불가능한 파일입니다.\\n\\n(파일명: " + fname  + ")");
			rmap.put("script_code", "B");

			// 신버전 호환
			rmap.put("script", "업로드가 불가능한 파일입니다.\\n\\n(파일명: "+fname+")");
		} else {
			rmap.put("isok", true);
		}

		if (logger.isDebugEnabled()) {
			logger.debug(String.format("f[%s] fname[%s] blockexts[%s] f_ext[%s] res[%b]", f, fname, blockexts, f_ext, rmap.get("isok")));
		}
		
		return (Boolean)rmap.get("isok");
	}

	/**
	 * 업로드 파일 사이즈 확인
	 *
	 * @param f the f
	 * @param max the max
	 * @param rmap the rmap
	 * @return true, if successful
	 */
	public static boolean checkUploadSizeDefault(MultipartFile f, int max, Map<String, Object> rmap) {
		boolean ret = false;
		
		BigDecimal bytesize =  new BigDecimal(1024);
		
		BigDecimal maxsize =  new BigDecimal(max);
		maxsize = maxsize.multiply(bytesize);
		//maxsize = maxsize.multiply(bytesize);
	    BigDecimal f_size =  new BigDecimal(f.getSize());
	     
		/*double maxsize = (double)(max * 1024 * 1024);
		double f_size = (double)f.getSize();*/
	    
		// default
		rmap.put("isok", true);
		rmap.put("msg", "");
		rmap.put("script_code", "");
		rmap.put("size", f_size.longValue());

		if (maxsize.compareTo(f_size) == -1) {
		//if (f_size > maxsize) {
			rmap.put("isok", false);
			rmap.put("msg", "업로드 가능 최대용량은 " + ((float)max / 1000f) + "MB 입니다");
			rmap.put("script_code", "B");

			// 신버전 호환
			rmap.put("script", "업로드 가능 최대용량은"+ ((float)max / 1000f) +"MB 입니다.");
		}

		if (logger.isDebugEnabled()) {
			logger.debug(String.format("f[%s] max[%d] maxsize[%s] f_size[%s] res[%b]", f, max, maxsize, f_size, rmap.get("isok")));
		}
		
		return (Boolean)rmap.get("isok");
	}

	/**
	 * 업로드 파일 사이즈 확인 (다중 폼)
	 *
	 * @param files the files
	 * @param max the max
	 * @param rmap the rmap
	 * @return true, if successful
	 */
	public static boolean checkUploadSizeMulti(List<MultipartFile> files, int max, Map<String, Object> rmap) {
		long maxsize = max * 1024 * 1024;
		
		for (MultipartFile f : files) {
			long f_size = f.getSize();

			// default
			rmap.put("isok", true);
			rmap.put("msg", "");
			rmap.put("script_code", "");
			rmap.put("size", f_size);

			if (f_size > maxsize) {
				rmap.put("isok", false);
				rmap.put("msg", "업로드 가능 최대용량은 " + max + "MB 입니다");
				rmap.put("script_code", "B");

				// 신버전 호환
				rmap.put("script", "업로드 가능 최대용량은"+max+"MB 입니다.");
				return false;
			}

			if (logger.isDebugEnabled()) {
				logger.debug(String.format("f[%s] max[%d] maxsize[%d] f_size[%d] res[%b]", f, max, maxsize, f_size, rmap.get("isok")));
			}
		}
		
		return true;
	}

	
	
	/**
	 * 썸네일 제작
	 *
	 * @param fileName the file name
	 * @param tagetPath the taget path
	 * @param fullPath the full path
	 * @param width the width
	 * @param height the height
	 * @return the string
	 */
	public static String  resizeImg ( String fileName, String tagetPath, String fullPath, int width, int height ) {
		String result = "";
		String dst = String.format("%s/%s", tagetPath, fileName);
		try {
			Thumbnails.of(fullPath).size(width, height).toFile(dst);
			result = fileName;
		} catch (IOException e) {
			logger.error(e); //e.printStackTrace();
		}
		
		return result;
	}

	/**
	* @Method Name : checkFileExists
	* @Method 설명 : 파일 존재여부 확인
	*  
	* @param path = 파일 경로
	* @param isVirtual = 가상경로 여부
	* @param serverPath = 가상경로
	* @return
	*/
	public static boolean checkFileExists ( String path, boolean isVirtual, String serverPath ) {
		String target = "";
		
		target = path;
		// 가상경로인경우
		//
		if ( isVirtual ) {
			target = serverPath + path;
		}
		
		return isExist(target);
	}

	/**
	* @Method Name : getFileInfo
	* @Method 설명 : 파일정보
	*  
	* @param mode = 구분
	* @param path = 파일 경로
	* @param filename = 파일명
	* @param isVirtual = 가상경로 여부
	* @param serverPath = 가상경로
	* @return
	*/
	public static String getFileInfo ( String mode, String path, String filename, boolean isVirtual, String serverPath ) {
		String target = "";
		
		if ( filename == null ) {
			filename = CmFunction.getStringValue(filename);
		}

		target = target + "\\" + filename;
		// 가상경로인경우
		//
		if ( isVirtual ) {
			target = serverPath + path + "\\" + filename;
		}
		
		 if ( isExist(target) ) {
			 File file = new File( target );
			 if ( "name".equals( mode )) {
				 return file.getName();
			 } else if ( "size".equals( mode )) {
				 return file.length()+"";
			 } else if ( "type".equals( mode )) {
				 return file.canWrite()+"";
			 } else if ( "path".equals( mode )) {
				return file.getAbsolutePath();
			 } else if ( "date".equals( mode )) {
				 return CmFunction.getRegDate3(new Date(file.lastModified())) + "";
			 } else if ( "ext".equals( mode )) {
				 return file.getName().substring(file.getName().lastIndexOf(".")+1, file.getName().length()); 
			 }
		 }
		
		return "";
	}
	
	/*' ######################################################################
	'	Function name	: writeAFile
	'	Parameter		:
	'			charset					= CharSet (Null, utf-8, ...)
	'			path						= 파일 경로 (경로에 파일명 포함시 filename 는 "" 또는 Null로 설정해야 함)
	'			filename				= 파일명
	'			data						= 내용
	'			isAppend				= 덧붙여쓰기여부
	'			isNl						= 개행여부
	'			isVirtual				= 가상경로 여부
	'	Return				:
	'	Description		: 파일 기록
	' ######################################################################*/
	public static void writeAFile(String charset, String path, String filename, String data, boolean isAppend, boolean isNl, boolean isVirtual, String serverPath) {
		String target = "";
		
		charset = CmFunction.getStringValue(charset); // Converter.toStr( charset );
		filename = CmFunction.getStringValue(filename); //Converter.toStr( filename );
		
		if ( isVirtual ) {
			target = serverPath + path;
		} else {
			target = path;
		}
		
		if ( !"".equals( filename ) ) {
			target = target + "\\" + filename;
		}
			
		File file = null;
		BufferedWriter out = null;
		
		try {
			file = new File(target);
			out = new BufferedWriter( new FileWriter( file ) );
			out.write(data);
			out.flush();
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		} finally {
			try {
				out.close();
			} catch (IOException e) {
				logger.error(e); //e.printStackTrace();
			}
		}
		
		
	}
	
	
	 /**
     * 파일의 확장자를 체크하여 필터링된 확장자를 포함한 파일인 경우에 true를 리턴한다.
     * @param file
     * */

    public static boolean checkImgFileExtension(File file) {

    	String fileName = file.getName();
    	String ext = fileName.substring(fileName.lastIndexOf(".") + 1,fileName.length());

    	final String[] EXTENSION = { "jpg", "gif", "png", "jpeg" };
    	int len = EXTENSION.length;

    	for (int i = 0; i < len; i++) {
    		if (ext.equalsIgnoreCase(EXTENSION[i])) {
    			return true; // 불량 확장자가 존재할때..
    		}
    	}
    	return false;
    }
    
     public static boolean checkImgFileExtension(String fullpath) {
    	 File file = new File(fullpath);
    	 
    	 String fileName = file.getName();
    	 String ext = fileName.substring(fileName.lastIndexOf(".") + 1,fileName.length());

    	 final String[] EXTENSION = { "jpg", "gif", "png", "jpeg" };
    	 int len = EXTENSION.length;

    	 for (int i = 0; i < len; i++) {
    		 if (ext.equalsIgnoreCase(EXTENSION[i])) {
    			 return true; // 불량 확장자가 존재할때..
    		 }
    	 }
    	 return false;
     }

}