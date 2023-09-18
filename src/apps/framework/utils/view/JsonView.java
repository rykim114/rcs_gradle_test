package apps.framework.utils.view;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.view.AbstractView;

@SuppressWarnings("rawtypes")
public class JsonView extends AbstractView {

	@Override
	protected void renderMergedOutputModel(Map model, HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		try {

			StringBuffer xmlSb = new StringBuffer();

			xmlSb.append(model.get("JSON"));
			
			logger.debug(model.get("JSON"));
			
			String contentType = (String)model.get("CONTENT_TYPE");
			
			if (contentType == null || contentType.equals("")) {
				response.setContentType("application/json");
			}
			else {
				//response.setContentType("text/html");
				response.setContentType(contentType);
			}
			response.setCharacterEncoding("utf-8");
			/*response.setHeader("X-Requested-With","XMLHttpRequest");*/
			response.setHeader("Cache-Control","no-store");
			/*response.setHeader("Progma","no-cache");*/
			response.setContentLength(xmlSb.toString().getBytes("utf-8").length);
			
			response.getWriter().print(xmlSb.toString());
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		} finally {
		}
	}
}
