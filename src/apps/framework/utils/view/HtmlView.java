package apps.framework.utils.view;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.view.AbstractView;

@SuppressWarnings("rawtypes")
public class HtmlView extends AbstractView {
	
	@Override
	protected void renderMergedOutputModel(Map model, HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		try {

			StringBuffer htmlSb = new StringBuffer();

			htmlSb.append(model.get("HTML"));
			
			logger.debug(model.get("HTML"));

			response.setContentType("text/html"); 
			response.setCharacterEncoding("utf-8");
			response.setHeader("Cache-Control", "no-cache");
			response.setContentLength(htmlSb.toString().getBytes("utf-8").length);
					
			response.getWriter().print(htmlSb.toString());
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		} finally {
		}
	}


}
