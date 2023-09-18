    if(window.console == undefined)
        console = window.console || { log: function() {} };

    /***************************************************************
     * 보고서에 대한 (exeViewer)호출 API제공 (ActiveX뷰어는 기존 API사용) *
     * <body>를 가지는 문서에만 사용가능 (head에서 포함하여 반복사용)     *
     * <frameset>구조인 경우에는 하위의 특정frame 문서에 배치하여 사용    *
     ***************************************************************/
    var customUri="aireport:///";
    var aireportVersion = 55023;

    //사용자 setting...
    //*****************************************************************************************
    var installUrl="http://192.168.0.29:8085/viewer60/AIUpdate/NonActiveXInstall.html";
    var viewerSetup="AIViewer50Setup.exe";
    var fullSetup="AIViewer55Install.exe";

    //dlawoejr 2015.09.24
    var sessionIDGetUrl="/viewer60/AIUpdate/AIsessionIDGet.jsp";
    var updateUrl="http://192.168.0.29:8085/viewer60/AIUpdate/";
    var installCheckUrl="http://127.0.0.1:59481/AIInstallCheck";
    var paramSaveUrl="http://127.0.0.1:59481/AIParamSave";
    var paramGetUrl="http://127.0.0.1:59481/AIViewerParamGet";
    //******************************************************************************************

    var method='POST';
    var sessionID;

    var match = navigator.userAgent.match(/(CrOS\ \w+|Windows\ NT|Mac\ OS\ X|Linux)\ ([\d\._]+)?/);
    var os = (match || [])[1] || "Unknown";

    var cookie=document.cookies;

    $(document).ready(function(){

        $.ajax({
            type: method,
            dataType: "json",
            url: sessionIDGetUrl,
            success: function (result) {
                sessionID="JSESSIONID="+result.sessionID;
            },
            error:function (error) {
                sessionID="";
                alert("AIsessionIDGet 호출 에라입니다.\n호출url 확인바랍니다.");
            }
        });

        //dlawoejr 2015.09.24
        /*
        $(document).ajaxStart(function() {
            $( "#loading" ).show();
        });

        $(document).ajaxStop(function() {
            $( "#loading" ).hide();
        });
        */

    });


    function launchAIReportExe(url, reportMode, ai_params, cgi_params) {

        if(sessionID == undefined)
            sessionID = "";
        if(sessionID == 'undefined')
            sessionID = "";

        if(cookie == undefined)
            cookie = "undefined";

        //dlawoejr 2015.09.24
        var ajaxParam;
        if(cgi_params.length==0)
            ajaxParam="aiParam=" + ai_params + "&" + "callUrl=" + url + "&reportMode="+ reportMode + "&cookies=" + cookie;
        else
            ajaxParam=cgi_params + "&" + "aiParam=" + ai_params + "&" + "callUrl=" + url + "&reportMode="+ reportMode + "&cookies=" + cookie;
        ajaxParam=ajaxParam + "&viewerSetup=" + viewerSetup + "&fullSetup=" + fullSetup;

        $.support.cors = true;
        $.ajax({

            type: 'GET',
            dataType: "jsonp",
            jsonp: "callback",
            //crossDomain: true,
            cache: false,
            url: installCheckUrl,
            timeout: 10000,
            success: function (result) {

                if(result.version!=aireportVersion){
                    alert('프로그램 version이 일치하지않습니다.\n설치 페이지로 이동 합니다.');
                    document.location=installUrl;
                    return;
                }

                $(document).ajaxStart(function() {
                    $( "#loading" ).show();
                });

                $(document).ajaxStop(function() {
                    $( "#loading" ).hide();
                });

                $.ajax({

                    type: 'POST',
                    data: ajaxParam,
                    dataType: "jsonp",
                    jsonp: "callback",
                    cache: false,
                    url: paramSaveUrl,
                    timeout: 10000,
                    success: function (result) {
                        cgi_params = "param=" + result.target + "&reportMode=" + reportMode + "&method=" + "POST";
                        var callUrl = customUri + ",," + sessionID + ",," + cgi_params +
                            ",," + updateUrl + ",," + paramGetUrl;
                        launchApp(callUrl);
                    },
                    error: function (error) {
                        cgi_params = "";

                        for (i in error) {
                            console.log(i + " : " + error[i])
                        }

                        alert("AIParamSave 호출 에라입니다.\n호출url 확인바랍니다.");
                    }
                });

            },
            error: function (error) {
                cgi_params = "";

                for (i in error) {
                    console.log(i + " : " + error[i])
                }
                alert('프로그램이 설치되어있지않아 설치 페이지로 이동 합니다.');
                document.location=installUrl;
            }
        });

    }

    function launchApp(callUrl) {

        //dlawoejr 2015.09.24
        var iframe = document.createElement('iframe');
        iframe.style.display = "none";
        iframe.style.position = 'absolute';
        iframe.style.left = '-999px';
        iframe.style.height = '1px';
        iframe.style.width = '1px';
        document.body.appendChild(iframe);
        iframe.contentWindow.location = callUrl;
        iframe.onload = function () {
            document.body.removeChild(iframe);
        };

    }