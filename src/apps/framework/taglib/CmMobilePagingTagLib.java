package apps.framework.taglib;

import apps.framework.object.CmMap;
import apps.framework.utils.CmFunction;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.tagext.TagSupport;


public class CmMobilePagingTagLib extends TagSupport{
	
	protected final Log	logger = LogFactory.getLog(this.getClass());
	
	private static final long serialVersionUID = 1L;
	
	private CmMap<Object, Object> cmMap;
	
	private String	callFuncName;
	
	private String	formName;
	
	public int doStartTag() {
		return SKIP_BODY;
	}
	
	public void release() {
		super.release();
	}

	public void setCmMap(CmMap<Object, Object> cmMap) {
		this.cmMap = cmMap;
	}

	public void setCallFuncName(String callFuncName) {
		this.callFuncName = callFuncName;
	}
	
	public String getCallFuncName() {
		return callFuncName;
	}

	public void setFormName(String formName) {
		this.formName = formName;
	}
	
	public String getFormName() {
		return formName;
	}
	
	public int doEndTag() throws JspException
	{
		int nowPageNo		= cmMap.getInt("i_iNowPageNo");
		int pageTotal		= cmMap.getInt("i_iTotalPageCnt");
		//int pageSize		= cmMap.getInt("i_iPageSize"); 
		int pageGroupSize 	= cmMap.getInt("i_iPageGroupSize");
		int pageGroupStart; 
		int pageGroupEnd; 
		
		if (pageGroupSize == 0)
			pageGroupSize		= 5;
		
		try{
			JspWriter 		out 		= this.pageContext.getOut();
			StringBuffer 	sb 			= new StringBuffer();
	
			String prevLabel 		= "이전 페이지로 가기";//이전 페이지
			String nextLabel 		= "다음 페이지로 가기";//다음 페이지
			
			pageGroupStart 	= (int)((nowPageNo-1) / pageGroupSize) * pageGroupSize + 1;
			pageGroupEnd 	= pageGroupStart + pageGroupSize;
			
			if (pageGroupEnd > pageTotal) {
				pageGroupEnd = pageTotal + 1;
			}
			
			boolean hasPreviousPage = nowPageNo > 1;
			boolean hasNextPage 	= nowPageNo < pageTotal;
			
			if(pageTotal > 0) {
				if(getCallFuncName() == null || getCallFuncName().equals("")) {
					if (CmFunction.getStrVal(formName).equals(""))
						setFormName("frm");
					
					sb.append("\n");
					sb.append("\n").append("<script type=\"text/javascript\">                           ");
					sb.append("\n").append("//<![CDATA[                                                 ");
					sb.append("\n").append("    function CmPageMove(pg , size ) {                    ");
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
					sb.append("\n").append("</script>     												");
				}
				/*			
				<div class="pagination">
				<a href="javascript:;" class="prev">이전 페이지로 가기</a>
				<a href="">1</a>
				<a href="">2</a>
				<a href="">3</a>
				<a href="">4</a>
				<a href="">5</a>
				<a href="javascript:;" class="next">다음 페이지로 가기</a>
			</div>
	*/	
				sb.append("\n").append("<div class=\"pagination\">"); 
				sb.append("\n").append(makeNotLink(prevLabel, nowPageNo, hasPreviousPage, "P"));
							
				for (int i = pageGroupStart; i < pageGroupEnd; i++) {
					if(i == nowPageNo) {
						sb.append("\n").append("<a href=\"javascript:;\">"+i+"</a>");
					} else {
						sb.append("\n").append(makeLink(i, "" + i + "", ""));
					}
				}
				sb.append("\n").append(makeNotLink(nextLabel, nowPageNo, hasNextPage, "N"));
				sb.append("\n").append("</ul> "); 
				sb.append("\n").append("</div>") ;
			} else {
				sb.append("<div class=\"clear\"></div>");
			}
			
			out.print(sb.toString());
			out.flush();

			this.release();
		} catch(Exception e) {
			logger.error(e); //e.printStackTrace();
		}
		
		return EVAL_PAGE;
	}
	
	public String makeLink(int page, String label, String className) {
		StringBuffer tmp = new StringBuffer();
		
		if (getCallFuncName() == null || getCallFuncName().equals("") ) {
			setCallFuncName("CmPageMove");
		}
		
		tmp.append("<a href=\"javascript:"+getCallFuncName()+"('" + page + "');\">"+page+"</a>");
		
		if (className != null && !className.equals(""))
			tmp.append("class='").append(className).append("'");
		
		return tmp.toString();
	}
	
	public String makeNotLink(String label, int page, boolean has, String flag) {
		
		if (getCallFuncName() == null || getCallFuncName().equals("") ) {
			setCallFuncName("CmPageMove");
		}
		
		StringBuffer tmp = new StringBuffer();
		String classnm = "";
		int pageno  = 0;
		
		if(has) {
			if(flag.equals("P")) {
				pageno	=	page - 1;
				classnm	=	"prev";
			} else {
				pageno	=	page + 1;
				classnm	=	"next";
			}
			
			tmp.append("<a href=\"javascript:"+getCallFuncName()+"('" + pageno + "')\" class=\""+classnm+"\">");
			tmp.append(label).append("</a>");
		} else {
			if(flag.equals("P")) {
				classnm	=	"prev";
			} else {
				classnm	=	"next";
			}
			
			tmp.append("<a href=\"javascript:;\" class=\""+classnm+"\">");
			tmp.append(label).append("</a>");
		}
		
		return tmp.toString();
	}
}
