console.log("backListen");
var _common=new Common();
var allParams=_common.getAllParams();
function getEnv() {
    //判断访问终端
    var browser = {
            versions: function () {
                var u = navigator.userAgent,
                    app = navigator.appVersion;
                return {
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1, //是否web应用程序，没有头部与底部
                    weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                    qq: u.match(/\sQQ/i) == " qq" //是否QQ
                };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        },
        res = 0;
    if (browser.versions.mobile) {
        if (browser.versions.android) {
            res = "android";
        } else if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
            res = "ios";
        } else {
            res = "web";
        }
    } else {
        res = "web";
    }

    return res;
}


history.pushState({}, "title", location.href);
window.addEventListener("popstate", function () {

    if (allParams['_last']) {
        window.location.replace("/probes/list.html?ks=detail");
    }else{
        var _ENV=getEnv();
        switch (_ENV){
            case "ios":
                requestAnimationFrame(function() {
                    if(window.webkit && window.webkit.messageHandlers) {
                        window.webkit.messageHandlers.close.postMessage();
                    } else {
                        try {
                            close();
                        } catch(err) {

                        }

                    }

                });
                break;
            case "android":
                window.WebViewJavascriptBridge.callHandler(
                    'close', {},
                    function(responseData) {
                        //回调处理
                    });
                break;
        }
    }
    // alert("press")
    // window.location.href = "/probes/list.html?ks=detail";
});
