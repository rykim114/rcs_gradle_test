package apps.framework.utils.view;

import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.servlet.view.AbstractView;

import apps.framework.utils.CmFunction;


@SuppressWarnings("rawtypes")
public class ExcelView extends AbstractView {

	@Override
	protected void renderMergedOutputModel(Map model, HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		OutputStream out 	= response.getOutputStream();
		
		try {
			
			HSSFWorkbook	 	wb	 	= null;
			SimpleDateFormat 	sdf 	= new SimpleDateFormat("yyyyMMdd");
			String 				title 	= new String( CmFunction.getStrVal(model.get("excelFileName")).getBytes("EUC_KR"),"8859_1" );
			
			if ( !title.equals("")) {
				
				if (model.get("XSSFWorkbook") != null) {
					response.setHeader("Content-Disposition", "attachment; filename=\"" +title + "_" + sdf.format(new Date()) + ".xlsx\";");
				}else{
					response.setHeader("Content-Disposition", "attachment; filename=\"" +title + "_" + sdf.format(new Date()) + ".xls\";");
				}
				
				/*response.setHeader("Content-Type", "application/octet-stream; charset=euc-kr");
				response.setHeader("Content-Transfer-Encoding", "binary");*/
				response.setHeader("Content-Type", "application/vnd.ms-excel; charset=MS949");
			    response.setHeader("Content-Description", "JSP Generated Data"); 
			    response.setHeader("Content-Transfer-Encoding", "binary;"); 
			    response.setHeader("Pragma", "no-cache;"); 
			    response.setHeader("Expires", "-1;");
			}
			
			if (model.get("HSSFWorkbook") != null) {
				wb		= (HSSFWorkbook)model.get("HSSFWorkbook");
				wb.write(out);
		        out.close();
				out.flush();
			}
			else if (model.get("XSSFWorkbook") != null) {
				
				XSSFWorkbook xwb = new XSSFWorkbook();
				xwb		= (XSSFWorkbook)model.get("XSSFWorkbook");
				xwb.write(out);
		        out.close();
				out.flush();
			}
			else {
				wb		= new HSSFWorkbook();
				wb.write(out);
		        out.close();
				out.flush();
			}
						

		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		} finally {
			if (out != null) {
				out.close();
			}
		}
	}

}


