<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%-- <jsp:include page="/WEB-INF/view/front/${devicemode}/inc/_head.jsp"/> --%>

<link rel="stylesheet" href="/resources/front/css/error.css">
<div data-page="404_error" class="page navbar-fixed remark_page" style="background-color:#fff; background-position: 0,0; background-repeat: no-repeat; background-size:cover; ">
    <!--error_page start-->
    <div id="error_warp">
      <div class="error-content">
        <div class="txt">
            <h1>ERROR</h1>
             <h2>서비스 이용에 불편을 드려 죄송합니다 </h2>
             <p>접속하신 페이지의 주소가 잘못 입력되었거나, <br>요청하신 페이지의 주소가 변경 및 삭제되어 찾을 수 없습니다. </p>
        </div>
        <div class="btnArea">
            <button onClick="goHome();" class="link border-rect">메인으로 이동</button>
            <button onClick="javascript:history.back();" class="back border-rect">이전 페이지로 이동</button>
        </div>
      </div>
    </div><!--error_page end-->
</div>



<script type="text/javascript"> 
    function goHome() {
        location.href="/front/"; 
    } 
</script>

