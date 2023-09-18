<%--
/**
  * @Class Name : newLink.jsp
  * @Description: welcome page
  * @Modification Information
  * @
  * @  수정일        		 수정자                   수정내용
  * @ -------    --------    ---------------------------
  * @
  */
%>
--%>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<script type="text/javaScript">
	//alert(document.location.href);
	
	document.location.href = "/admin/main/adminMain.do";
	//OpenPopUp("http://" + window.location.host  +  '${pageContext.request.getContextPath()}' + "/admin/main/adminMain.do","",1260,700);  
	//CloseMe();

	function OpenPopUp(url, name, width, height) {
		if(width==null) width=1280;
		if(height==null) height=700;				

		if(width>screen.availWidth) 	width = screen.availWidth;
		if(height>screen.availHeight) height = screen.availHeight;
		var xc = (screen.availWidth - width)/2 -12;
		var yc = (screen.availHeight - height)/2 -60;
		var windowprops = "top=" + yc + ",left=" + xc + ",width=" + width + ",height=" + height + ",location=0,scrollbars=yes,menubar=0,toolbar=0,resizable=1,status=1";
		popup = window.open(url,name,windowprops);
		popup.focus();
	}

	//이전페이지 닫기
	function CloseMe()	{
		opener = window;
		window.open('','_parent','');
		opener.close();
	}
</script>
