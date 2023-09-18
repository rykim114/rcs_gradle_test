// 행정동 주소 검색 레이어
/*
$(document).on('click', '#btnSearchAddr', function(){
    $('#divSearchAddr').show();
});
$(document).on('click', '.btnSearchAddrClose', function(){
    $('#divSearchAddr').hide();
});
$(document).mouseup(function (e){
    var container = $('#divSearchAddr');
    if( container.has(e.target).length === 0){
      container.hide();
    }
});
*/

// 상권레이어
//$(document).on('click', '#ktStrBtn', function(){
//    $('#strStrLayer').show();
//    $('#ktAreaBtn').removeClass('btn-danger');
//    $('#ktAreaBtn').addClass('btn-outline-secondary');
//    $('#ktStrBtn').addClass('btn-danger');
//    $('#ktStrBtn').removeClass('btn-outline-secondary');
//});
//$(document).on('click', '#ktAreaBtn', function(){
//    $('#strStrLayer').hide();
//    $('#ktAreaBtn').addClass('btn-danger');
//    $('#ktAreaBtn').removeClass('btn-outline-secondary');
//    $('#ktStrBtn').removeClass('btn-danger');
//    $('#ktStrBtn').addClass('btn-outline-secondary');
//});
// 맵버튼 레이어
$(document).on('click', '#btnMapType1', function(){
    $('#mapTypeLayer1').show();
});
$(document).on('click', '.btnMapType1Close', function(){
    $('#mapTypeLayer1').hide();
});
$(document).on('click', '#btnMapType2', function(){
    $('#mapTypeLayer2').show();
});
$(document).on('click', '.btnMapType2Close', function(){
    $('#mapTypeLayer2').hide();
});

$(document).on('click', '#mapInfo1', function(){
    $('#mapPannel1').removeClass('d-none');
    $('#mapPannel1').addClass('d-flex');
    $('#mapPannel2').removeClass('d-flex');
    $('#mapPannel2').addClass('d-none');
});
$(document).on('click', '#mapPannel1Close', function(){
    $('#mapPannel1').removeClass('d-flex');
    $('#mapPannel1').addClass('d-none');
});
$(document).on('click', '#mapSrcClose', function(){
    $('#mapSrcResult').hide();
});
$(document).on('click', '#mapInfo2', function(){
    $('#mapPannel2').removeClass('d-none');
    $('#mapPannel2').addClass('d-flex');
    $('#mapPannel1').removeClass('d-flex');
    $('#mapPannel1').addClass('d-none');
});
$(document).on('click', '#mapPannel2Close', function(){
    $('#mapPannel2').removeClass('d-flex');
    $('#mapPannel2').addClass('d-none');
});
// 버튼이벤트 겹치는 부분들 하나씩 제거 예정입니다
// 다른 화면에서 문제가 될 수 있는데, 필요하시면 각자 화면으로 가져가되 전역(Global) 이벤트로 걸지는 말아주세요
// A화면 -> B화면(Global event) -> 다시 A화면 에서 문제됩니다
/*
$(document).on('click', '#btnBlock', function(){
    $('#mapBlockPanel').removeClass('d-none');
    $('#mapBlockPanel').addClass('d-flex');
});
$(document).on('click', '#mapBlockClose', function(){
    $('#mapBlockPanel').removeClass('d-flex');
    $('#mapBlockPanel').addClass('d-none');
});
*/

// 토글 클래스
$(document).on('click', '.btn-togclass', function(){
    if($(this).hasClass("btn-danger")){
        $(this).removeClass("btn-danger");
        $(this).addClass("btn-outline-secondary");
    } else {
        $(this).removeClass("btn-outline-secondary");
        $(this).addClass("btn-danger");
    }
});
// 토글 클래스2
$(document).on('click', '#btnFilter1', function(){
    if($(this).hasClass("btn-danger")){
        $(this).removeClass("btn-danger");
        $(this).addClass("btn-outline-secondary");
        $('#filterLayer1').hide();
        $('#filterLayer2').hide();
    } else if($(this).hasClass("btn-outline-secondary")) {
        $(this).removeClass("btn-outline-secondary");
        $(this).addClass("btn-danger");
        $('#filterLayer1').show();
        $('#filterLayer2').show();
    }
});
function srcResult () {
    if ( window.event.keyCode == 13 ) {
        $('#mapSrcResult').show();
    }
}

//대시보드 tab 스크립트 201215추가 
$(document).on('click', '.dashboard_tab_box button', function(){
    var tab_current_Num = $(this).index();
    var tab_length = $('.dashboard_tab_content').length;
    for(var i=0;i<tab_length;i++){
        if( i == tab_current_Num){
            // $('#dashboard_tab_content_'+i).css('display','block');
            $('#dashboard_tab_content_'+i).addClass('active');
        }else{
            // $('#dashboard_tab_content_'+i).css('display','none');
            $('#dashboard_tab_content_'+i).removeClass('active');
        }
    }
});