<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<!-- 카카오톡 메타테그 -->
	<meta property="og:image" content="https://mabs.r114.co.kr/resources/common/core/img/kakao_img.png" /> 
	<meta property="og:title" content="MABS | 부동산114" /> 
	<meta property="og:description" content=" " />
</head>
<body>
<script type="text/javaScript">
//redirect 시 최상위로..
var host = location.host.toLowerCase();
var currentAddress = location.href;
var isFromApp = 'undefined' !== (typeof window.ReactNativeWebView);

if ( top.location.href != self.location.href ) {
	top.location.href = self.location.href;
}

<%-- / 으로 접속 시 사용자 페이지 표시 --%>
document.location.href = "/admin/member/aLogin.do";
</script>
</body>
</html>