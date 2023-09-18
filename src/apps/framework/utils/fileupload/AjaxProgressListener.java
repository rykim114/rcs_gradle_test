package apps.framework.utils.fileupload;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.fileupload.ProgressListener;

public class AjaxProgressListener implements ProgressListener {

	private double percentDone;
	
	public double getPercentDone() {
		return percentDone;
	}
	
	public AjaxProgressListener(HttpServletRequest request) {
		final HttpSession session = request.getSession();
		session.setAttribute("progress", this);
	}

	@Override
	public void update(long bytesRead, long contentLength, int items) {
		percentDone = (100 * bytesRead) / contentLength;		
	}
	
}
