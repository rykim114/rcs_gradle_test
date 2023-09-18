<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>

<script type="text/javaScript">
	//alert(document.location.href);
	
	//document.location.href = "/admin/main/adminMain.do";
	//location.reload(true);
	
	alert("세션이 종료되었습니다. 로그인 폐이지로 이동합니다");
	parent.location.href = "/admin/member/aLogin.do";
</script>
	
<body>
	
</body>
</html>		