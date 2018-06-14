//designWidth:设计稿的实际宽度值，需要根据实际设置
//maxWidth:制作稿的最大宽度值，需要根据实际设置
//这段js的最后面有两个参数记得要设置，一个为设计稿实际宽度，一个为制作稿最大宽度，例如设计稿为750，最大宽度为750，则为(750,750)
;(function (designWidth, maxWidth) {
    var doc = document,
        win = window,
        docEl = doc.documentElement,
        tid;

    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        maxWidth = maxWidth || 540;
        width > maxWidth && (width = maxWidth);
        docEl.style.fontSize = width * 100 / designWidth + "px"
    }

    //要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
    refreshRem();

    win.addEventListener("resize", function () {
        clearTimeout(tid); //防止执行两次
        tid = setTimeout(refreshRem, 300);
    }, false);

    win.addEventListener("pageshow", function (e) {
        if (e.persisted) { // 浏览器后退的时候重新计算
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);
})(750, 750);

/*公共类*/
function Common() {
    this.event_list = [];
}

Common.prototype.getSystem = function () {
    var browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {// 移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, // IE内核
                presto: u.indexOf('Presto') > -1, // opera内核
                webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/)
                || !!u.match(/AppleWebKit/), // 是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, // 是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, // 是否iPad
                webApp: u.indexOf('Safari') == -1
                // 是否web应该程序，没有头部与底部
            };
        }(),
        language: (navigator.browserLanguage || navigator.language)
            .toLowerCase()
    }
    if (browser.versions.ios || browser.versions.iPhone
        || browser.versions.iPad) {
        browser.isIos = true;
    } else if (browser.versions.android) {
        browser.isAndroid = true;
    }
    return browser;
};
Common.prototype.isObject = function (p) {
    return p && (typeof p === "object");
};
Common.prototype.isArray = function (o) {
    return Object.prototype.toString.call(o) === '[object Array]';
};
Common.prototype.listen = function (key, fn) {
    if (!this.event_list[key]) {
        this.event_list[key] = [];
    }
    // 订阅的消息添加到缓存列表中
    this.event_list[key].push(fn);
};
Common.prototype.trigger = function () {
    var key = Array.prototype.shift.call(arguments);
    var fns = this.event_list[key];
    // 如果没有订阅过该消息的话，则返回
    if (!fns || fns.length === 0) {
        return;
    }
    for (var i = 0, fn; fn = fns[i++];) {
        fn.apply(this, arguments);
    }
};
Common.prototype.remove = function (key, fn) {
    var fns = this.event_list[key];
    // 如果key对应的消息没有订阅过的话，则返回
    if (!fns) {
        return false;
    }
    // 如果没有传入具体的回调函数，表示需要取消key对应消息的所有订阅
    if (!fn) {
        fn && (fns.length = 0);
    } else {
        for (var i = fns.length - 1; i >= 0; i--) {
            var _fn = fns[i];
            if (_fn === fn) {
                fns.splice(i, 1); // 删除订阅者的回调函数
            }
        }
    }
};

Common.prototype.getQueryVariable = function (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return false;
};
Common.prototype.getAllParams = function () {
    var query = window.location.search.substring(1),
        vars = query.split("&"),
        res = {},
        temp = "";
    for (var i = 0; i < vars.length; i++) {
        temp = vars[i].split("=");
        res[temp[0]] = decodeURIComponent(temp[1]);
    }
    return res;
};
//将参数转字符串附加在URL地址之后
Common.prototype._paramsToString = function (params) {
    var str = "";
    if (params && this.isObject(params)) {
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                str += key + "=" + params[key] + "&";
            }
        }
        str = str.replace(/&$/ig, "");
    }
    return str;
};

/*loading管理*/
function LoadingView() {
    this.node = $("#loading-view");
    this.env = "web";
    this.speed = 200;
}

LoadingView.prototype = Object.create(Common.prototype);
LoadingView.prototype.constructor = LoadingView;
LoadingView.prototype.init = function (env) {
    this.env = env || "web";
    if (this.env === "web" && (!this.node[0])) {
        this.addLoadingNode();
    }
};
LoadingView.prototype.show = function (speed) {
    var _this = this,
        env = _this.env;
    switch (env) {
        case "android":
            window.WebViewJavascriptBridge.callHandler(
                'showLoading', {
                    'param': 'showLoading'
                },
                function (responseData) {
                }
            );
            break;
        case "ios":
            requestAnimationFrame(function () {
                if (window.webkit && window.webkit.messageHandlers) {
                    window.webkit.messageHandlers.showLoading.postMessage();
                } else {
                    try {
                        showLoading();
                    } catch (err) {
                        //onstar.topTips("call ios app loading fail");
                        console.log("showAppLoading fail");
                    }

                }
            });
            break;
        default:
            _this.node.fadeIn(speed || this.speed);
    }


};
LoadingView.prototype.hide = function (speed) {
    var _this = this,
        env = _this.env;
    switch (env) {
        case "android":
            window.WebViewJavascriptBridge.callHandler(
                'closeLoading', {
                    'param': 'closeLoading'
                },
                function (responseData) {
                }
            );
            break;
        case "ios":
            requestAnimationFrame(function () {
                if (window.webkit && window.webkit.messageHandlers) {
                    window.webkit.messageHandlers.closeLoading.postMessage();
                } else {
                    try {
                        closeLoading();
                    } catch (err) {
                        console.log("closeAppLoading fail");
                    }

                }
            });
            break;
        default:
            _this.node.fadeOut(speed || this.speed)
    }


};
LoadingView.prototype.addLoadingNode = function () {
    $("body").append('<div id="loading-view" style="display: none"><img class="loading-gif" src="./assets/images/loading-501.gif" alt=""></div>');
    this.node = $("#loading-view");
};

//日期格式化
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds()
        // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};