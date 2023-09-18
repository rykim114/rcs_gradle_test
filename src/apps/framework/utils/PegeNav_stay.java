package apps.framework.utils;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import apps.framework.object.CmMap;

public class PegeNav_stay {
	
	private static final Log	logger = LogFactory.getLog(PegeNav_stay.class);
	
	private static String	callFuncName;
	
	private static String	formName;
	
	private static String	pageSizeYn;

	public static String getPageSizeYn() {
		return pageSizeYn;
	}

	public static void setPageSizeYn(String cpageSizeYn) {
		pageSizeYn = cpageSizeYn;
	}

	public static String getFormName() {
		return formName;
	}

	public static void setFormName(String cformName) {
		formName = cformName;
	}
	

	public static String getCallFuncName() {
		return callFuncName;
	}

	public static void setCallFuncName(String ccallFuncName) {
		callFuncName = ccallFuncName;
	}
	public static String makePagingCmPageMove(CmMap cmMap){
		int pageTotal		= cmMap.getInt("i_iTotalPageCnt");
		int pageSize		= cmMap.getInt("i_iPageSize"); 
		String i_sNtCode    = cmMap.getString("i_sNtCode"); 
		StringBuffer 	sb 			= new StringBuffer();
		try {
			
			if (pageTotal > 0) 
			{
				/*if (getCallFuncName() == null || getCallFuncName().equals(""))
				{*/
					if (CmFunction.getStrVal(formName).equals(""))
						setFormName("frm");
					
					sb.append("\n");
					sb.append("\n").append("<script type=\"text/javascript\">                           ");
					sb.append("\n").append("//<![CDATA[                                                 ");
					sb.append("\n").append("    function CmPageMove( pg , size ) {                      ");
					sb.append("\n").append("        var frm     = document."+ getFormName() +";         ");
					sb.append("\n").append("        frm[\"i_sNtCode\"].value	= \""+i_sNtCode+"\";        ");
					sb.append("\n").append("        frm[\"i_iNowPageNo\"].value	= pg;                   ");
					sb.append("\n");
					sb.append("\n").append("        if (size != undefined) {                            ");
					sb.append("\n").append("            frm[\"i_iPageSize\"].value	= size;             ");
					sb.append("\n").append("        }                                                   ");
					sb.append("\n");
					sb.append("\n").append("        frm.submit();                                       ");
					sb.append("\n").append("    }                                                       ");
					sb.append("\n").append("//]]>                                                       ");
					sb.append("\n").append("</script>                                                   ");
				/*}*/
			}
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		return sb.toString();
	}
	
	public static String makePagingBack(CmMap cmMap){
		int nowPageNo		= cmMap.getInt("i_iNowPageNo");
		int pageTotal		= cmMap.getInt("i_iTotalPageCnt");
		int pageSize		= cmMap.getInt("i_iPageSize"); 
		int pageGroupSize 	= cmMap.getInt("i_iGroupSize");
		int pageGroupStart; 
		int pageGroupEnd; 
		
		if (pageGroupSize == 0)
			pageGroupSize		= 5;

		StringBuffer 	sb 			= new StringBuffer();
		try {
			
			String beginLabel 		= "btn_first.png";
			String prevLabel 		= "btn_prev.png";
			String nextLabel 		= "btn_next.png";
			String endLabel 		= "btn_last.png";

			pageGroupStart 	= (int)((nowPageNo-1) / pageGroupSize) * pageGroupSize + 1;
			pageGroupEnd 	= pageGroupStart + pageGroupSize;
			
			if (pageGroupEnd > pageTotal) {
				pageGroupEnd = pageTotal + 1;
			}
			
			boolean hasPreviousPage = nowPageNo - pageGroupSize >= 0;
			boolean hasNextPage 	= pageGroupStart + pageGroupSize - 1 < pageTotal;
			
			if (pageTotal > 0) 
			{
				/*if (getCallFuncName() == null || getCallFuncName().equals(""))
				{
					if (CmFunction.getStrVal(formName).equals(""))
						setFormName("frm");
					
					sb.append("\n");
					sb.append("\n").append("<script type=\"text/javascript\">                           ");
					sb.append("\n").append("//<![CDATA[                                                 ");
					sb.append("\n").append("    function CmPageMove( pg , size ) {                      ");
					sb.append("\n").append("        var frm     = document."+ getFormName() +";         ");
					sb.append("\n").append("        frm[\"i_iNowPageNo\"].value	= pg;                   ");
					sb.append("\n");
					sb.append("\n").append("        if (size != undefined) {                            ");
					sb.append("\n").append("            frm[\"i_iPageSize\"].value	= size;             ");
					sb.append("\n").append("        }                                                   ");
					sb.append("\n");
					sb.append("\n").append("        frm.submit();                                       ");
					sb.append("\n").append("    }                                                       ");
					sb.append("\n").append("//]]>                                                       ");
					sb.append("\n").append("</script>                                                   ");
				}*/
				
/*				if ( "Y".equals(getPageSizeYn()) || "y".equals(getPageSizeYn()) )
				{
					sb.append("\n").append("    <div class=\"pagging-wrap\">       ");
					sb.append("\n").append("        <div class=\"page-number\">    ");
				}
*/
				
				//sb.append("\n").append("			<div class=\"table_bottom\">");
				//sb.append("\n").append("				<div class=\"pagination\">");
				sb.append("\n").append("					<ul>");
				sb.append("\n").append((nowPageNo > 1) ? makeLink(1, beginLabel, "first") : makeNotLink(beginLabel, "first"));
				sb.append("\n").append(hasPreviousPage ? makeLink(pageGroupStart - 1, prevLabel, "prev") : makeNotLink(prevLabel, "prev"));
				/*sb.append("\n").append("				<span class=\"num\">");*/
				
				for (int i = pageGroupStart; i < pageGroupEnd; i++) {
					
					if (i == nowPageNo) 
					{
						sb.append("<li class=\"active\">"); 
						sb.append("\n").append("				<a href=\"javascript:;\">").append(i).append("</a>");
						sb.append("\n").append("			</li>");
						
					} else {
						
						sb.append("<li>"); 
						sb.append("\n").append("				<a href=\"javascript:CmPageMove('" + i + "')\" ").append(">").append(i).append("</a>");
						sb.append("\n").append("			</li>");
					}
				}
				/*sb.append("\n").append("				</span>");*/
				sb.append("\n").append(hasNextPage ? makeLink(pageGroupEnd, nextLabel, "next") : makeNotLink(nextLabel,"next"));
				sb.append("\n").append((nowPageNo < pageTotal) ? makeLink(pageTotal, endLabel, "last") : makeNotLink(endLabel, "last"));
				sb.append("\n").append("        			</ul>") ;
				//sb.append("\n").append("        		</div>") ;
				//sb.append("\n").append("        	</div>") ;
				
			/*	if ( "Y".equals(getPageSizeYn()) || "y".equals(getPageSizeYn()) )
				{
					
					if (getCallFuncName() == null || getCallFuncName().equals("") ) {
						setCallFuncName("CmPageMove");
					}
					
					sb.append("\n").append("        </div>");
					sb.append("\n").append("        <div class=\"tb_number\">");
					sb.append("\n").append("            <span class=\"blind\">개수 선택</span> &nbsp;");
					sb.append("\n").append("            <select name='i_iPageSize' onchange=\""+ getCallFuncName() + "(" + nowPageNo +", this.value);\">");
					sb.append("\n").append("                <option value=\"10\"").append(pageSize == 10 ? "selected" : "").append(">10</option>");
					sb.append("\n").append("                <option value=\"20\"").append(pageSize == 20 ? "selected" : "").append(">20</option>");
					sb.append("\n").append("                <option value=\"40\"").append(pageSize == 40 ? "selected" : "").append(">40</option>");
					sb.append("\n").append("                <option value=\"60\"").append(pageSize == 60 ? "selected" : "").append(">60</option>");
					sb.append("\n").append("                <option value=\"80\"").append(pageSize == 80 ? "selected" : "").append(">80</option>");
					sb.append("\n").append("                <option value=\"300\"").append(pageSize == 300 ? "selected" : "").append(">300</option>");
					sb.append("\n").append("            </select>\n");
					sb.append("\n").append("        </div>\n");
					sb.append("\n").append("        <div class=\"clear\"></div>\n");
					sb.append("\n").append("    </div>\n");
				}*/
			}
			else
			{
				sb.append("\n").append("<div class=\"table_bottom\" >"); 
				sb.append("\n").append("	<div class=\"pagination\" >"); 
				sb.append("\n").append("		<ul>"); 
				sb.append("\n").append("			<li class=\"first\">"); 
				sb.append("\n").append("				<a href=\"javascript:;\"><img src=\"/resources/admin/APPS/hp/images/common/btn_first.png\" alt=\"처음으로\"></a>");
				sb.append("\n").append("			</li>");				
				sb.append("\n").append("			<li class=\"pre\">"); 
				sb.append("\n").append("				<a href=\"javascript:;\"><img src=\"/resources/admin/APPS/hp/images/common/btn_prev.png\" alt=\"이전으로\"></a>");
				sb.append("\n").append("			</li>");
				
				sb.append("\n").append("			<li>"); 
				sb.append("\n").append("				<a href=\"javascript:;\">1</a>");
				sb.append("\n").append("			</li>");
				
				sb.append("\n").append("			<li class=\"next\">"); 
				sb.append("\n").append("				<a href=\"javascript:;\"><img src=\"/resources/admin/APPS/hp/images/common/btn_next.png\" alt=\"다음으로\"></a>");
				sb.append("\n").append("			</li>");
				
				sb.append("\n").append("			<li class=\"last\">"); 
				sb.append("\n").append("				<a href=\"javascript:;\"><img src=\"/resources/admin/APPS/hp/images/common/btn_last.png\" alt=\"다음으로\"></a>");
				sb.append("\n").append("			</li>");				
				sb.append("\n").append("		</ul>");
				sb.append("\n").append("	</div>") ;
				sb.append("\n").append("</div>") ;
			}
			
			
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		return sb.toString();
	}
	
	public static String makeLink(int page, String label, String className) {
		StringBuffer tmp = new StringBuffer();
		
		if (getCallFuncName() == null || getCallFuncName().equals("") ) {
			setCallFuncName("CmPageMove");
		}
		
		if (className != null && !className.equals(""))
			tmp.append("<li class='").append(className).append("'>");
		
		tmp.append("                <a href=\"javascript:"+getCallFuncName()+"('" + page + "')\" ").append(">");
		
		if (label != null && !label.equals(""))
			tmp.append("<img src=\"/resources/admin/APPS/hp/images/common/").append(label).append("\">");
		
		tmp.append("</a>");
		tmp.append("</li>");
		return tmp.toString();
	}
	
	public static String makeNotLink(String label, String className) {
		
		StringBuffer tmp = new StringBuffer();
		
/*		tmp.append("                <a href=\"javascript:;\" ");

		if (className != null && !className.equals(""))
			tmp.append("class='").append(className).append("'");

		tmp.append(">").append(label).append("</a>");
		
		*/
		if (className != null && !className.equals(""))
			tmp.append("<li class='").append(className).append("'>");
		
		tmp.append("                <a href=\"javascript:;\">");
		
		if (label != null && !label.equals(""))
			tmp.append("<img src=\"/resources/admin/APPS/hp/images/common/").append(label).append("\">");
		
		tmp.append("</a>");
		tmp.append("</li>");
		
		return tmp.toString();
	}
	
}
