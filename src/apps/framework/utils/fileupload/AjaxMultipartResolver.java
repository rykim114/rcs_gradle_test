package apps.framework.utils.fileupload;

import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.FileUpload;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.servlet.http.HttpServletRequest;

public class AjaxMultipartResolver extends CommonsMultipartResolver {
	
	private static ThreadLocal<AjaxProgressListener> progressListener = new ThreadLocal<AjaxProgressListener>();
	
	@Override
	public void cleanupMultipart(MultipartHttpServletRequest request) {
		super.cleanupMultipart(request);
		progressListener = null;
		progressListener = new ThreadLocal<AjaxProgressListener>();
	}
	
	@Override
	protected FileUpload newFileUpload(FileItemFactory fileItemFactory) {
		FileUpload fileUpload = super.newFileUpload(fileItemFactory);
		fileUpload.setProgressListener(progressListener.get());
		
		
		return fileUpload;
	}
	
	@Override
	public MultipartHttpServletRequest resolveMultipart(HttpServletRequest request) throws MultipartException {
		progressListener.set(new AjaxProgressListener(request));
		
		return super.resolveMultipart(request);
	}

}
