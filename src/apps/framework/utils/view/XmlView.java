package apps.framework.utils.view;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.view.AbstractView;

@SuppressWarnings("rawtypes")
public class XmlView extends AbstractView{
	
	@Override
	protected void renderMergedOutputModel(Map model, HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		try {

			StringBuffer xmlSb = new StringBuffer();

			xmlSb.append("<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n");
			xmlSb.append(model.get("XML"));

			response.setContentType("application/xml"); 
			response.setCharacterEncoding("utf-8");
			response.setHeader("Cache-Control", "no-cache");
			response.setContentLength(xmlSb.toString().getBytes("utf-8").length);
					
			response.getWriter().print(xmlSb.toString());
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		} finally {
		}
	}
}
