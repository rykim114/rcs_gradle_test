package apps.framework.taglib;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.tagext.TagSupport;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import apps.framework.object.CmMap;
import apps.framework.utils.CmFunction;

public class CmPagingTagLib extends TagSupport{
	
	protected final Log	logger = LogFactory.getLog(this.getClass());
	
	private static final long serialVersionUID = 1L;
	
	private CmMap<Object, Object> cmMap;
	
	private String	callFuncName;
	
	private String	formName;
	
	private String	pageSizeYn;
	
	public int doStartTag() {
		return SKIP_BODY;
	}
	
	public void release() {
		super.release();
	}
	
	public String getPageSizeYn() {
		return pageSizeYn;
	}

	public void setPageSizeYn(String pageSizeYn) {
		this.pageSizeYn = pageSizeYn;
	}

	public String getFormName() {
		return formName;
	}

	public void setFormName(String formName) {
		this.formName = formName;
	}
	
	public void setCmMap(CmMap<Object, Object> cmMap) {
		this.cmMap = cmMap;
	}

	public String getCallFuncName() {
		return callFuncName;
	}

	public void setCallFuncName(String callFuncName) {
		this.callFuncName = callFuncName;
	}

	public int doEndTag() throws JspException 
	{
		int nowPageNo		= cmMap.getInt("i_iNowPageNo");
		int pageTotal		= cmMap.getInt("i_iTotalPageCnt");
		int pageSize		= cmMap.getInt("i_iPageSize"); 
		int pageGroupSize 	= cmMap.getInt("i_iGroupSize");
		int pageGroupStart; 
		int pageGroupEnd; 
		
		if (pageGroupSize == 0)
			pageGroupSize		= 10;

		try {
			JspWriter 		out 		= this.pageContext.getOut();
			StringBuffer 	sb 			= new StringBuffer();

			String beginLabel 		= "처음으로 가기";
			String prevLabel 		= "앞으로 가기";
			String nextLabel 		= "뒤로 가기";
			String endLabel 		= "마지막으로 가기";

			pageGroupStart 	= (int)((nowPageNo-1) / pageGroupSize) * pageGroupSize + 1;
			pageGroupEnd 	= pageGroupStart + pageGroupSize;
			
			if (pageGroupEnd > pageTotal) {
				pageGroupEnd = pageTotal + 1;
			}
			
			boolean hasPreviousPage = nowPageNo - pageGroupSize >= 0;
			boolean hasNextPage 	= pageGroupStart + pageGroupSize - 1 < pageTotal;
			
			if (pageTotal > 0) 
			{
				if (getCallFuncName() == null || getCallFuncName().equals(""))
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
				}
				
				if ( "Y".equals(getPageSizeYn()) || "y".equals(getPageSizeYn()) )
				{
					sb.append("\n").append("    <div class=\"pagging-wrap\">       ");
					sb.append("\n").append("        <div class=\"page-number\">    ");
				}
				
				/*
				<div class="pagination">
					<a href="javascript:;" class="first">처음으로 가기</a>
					<a href="javascript:;" class="prev">앞으로 가기</a>
					<span class="num">
						<em>1</em>
						<a href="javascript:;">2</a>
						<a href="javascript:;">3</a>
						<a href="javascript:;">4</a>
						<a href="javascript:;">5</a>
					</span>
					<a href="javascript:;" class="next">뒤로 가기</a>
					<a href="javascript:;" class="last">마지막으로 가기</a>
				</div>
			*/
				
				sb.append("\n").append("			<div class=\"pagination\">");
				sb.append("\n").append((nowPageNo > 0) ? makeLink(1, beginLabel, "first") : makeNotLink(beginLabel, "first"));
				sb.append("\n").append(hasPreviousPage ? makeLink(pageGroupStart - 1, prevLabel, "prev") : makeNotLink(prevLabel, "prev"));
				sb.append("\n").append("				<span class=\"num\">");
				
				for (int i = pageGroupStart; i < pageGroupEnd; i++) {
					if (i == nowPageNo) 
					{
						sb.append("\n").append("				<em>").append(i).append("</em>");
					} else {
						sb.append("\n").append(makeLink(i, i+"", ""));
					}
				}
				sb.append("\n").append("				</span>");
				sb.append("\n").append(hasNextPage ? makeLink(pageGroupEnd, nextLabel, "next") : makeNotLink(nextLabel,"next"));
				sb.append("\n").append((nowPageNo < pageTotal) ? makeLink(pageTotal, endLabel, "last") : makeNotLink(endLabel, "last"));
				sb.append("\n").append("        	</div>") ;
				
				if ( "Y".equals(getPageSizeYn()) || "y".equals(getPageSizeYn()) )
				{
					
					if (getCallFuncName() == null || getCallFuncName().equals("") ) {
						setCallFuncName("CmPageMove");
					}
					
					sb.append("\n").append("        </div>");
					sb.append("\n").append("        <div class=\"page-size\">");
					sb.append("\n").append("            <label>페이지당</label> &nbsp;");
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
				}
			}
			else
			{
				sb.append("\n").append("<div class=\"pagination\">"); 
				sb.append("\n").append("	<a href=\"javascript:;\" class=\"first\">처음으로 가기</a>"); 
				sb.append("\n").append("	<a href=\"javascript:;\" class=\"prev\">앞으로 가기</a>"); 
				sb.append("\n").append("	<span class=\"num\">") ;
				sb.append("\n").append("		<em>1</em>") ;
				sb.append("\n").append("	</span>") ;
				sb.append("\n").append("	<a href=\"javascript:;\" class=\"next\">뒤로 가기</a>"); 
				sb.append("\n").append("	<a href=\"javascript:;\" class=\"prev\">앞으로 가기</a>"); 
				sb.append("\n").append("</div>") ;
			}
			
			out.print(sb.toString());
			out.flush();

			this.release();
		} catch (Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		return EVAL_PAGE;
	}
	
	public String makeLink(int page, String label, String className) {
		StringBuffer tmp = new StringBuffer();
		
		if (getCallFuncName() == null || getCallFuncName().equals("") ) {
			setCallFuncName("CmPageMove");
		}
		
		tmp.append("                <a href=\"javascript:"+getCallFuncName()+"('" + page + "')\" ");
		
		if (className != null && !className.equals(""))
			tmp.append("class='").append(className).append("'");
		
		tmp.append(">").append(label).append("</a>");
		return tmp.toString();
	}
	
	public String makeNotLink(String label, String className) {
		
		StringBuffer tmp = new StringBuffer();
		
		tmp.append("                <a href=\"javascript:;\" ");

		if (className != null && !className.equals(""))
			tmp.append("class='").append(className).append("'");

		tmp.append(">").append(label).append("</a>");
		return tmp.toString();
	}

}
