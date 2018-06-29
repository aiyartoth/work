function BFD() {
    window["_BFD"] = window["_BFD"] || {};
    this._BFD = _BFD;

}

/**
 * 引入JS文件
 * @param options 目前仅需要title
 */
BFD.prototype.init = function (options) {
    var _this = this,
        env = _this.getEnv();
    _BFD.USER_INFO = {
        "client_id": "sgm_onstar_pc",             //实施人员提供
        // "appkey": "87b4b263237a72d8f31969b062e3a0bc",   //实施人员提供
        "pv_type": "1",                        //页面埋点请求方式，0为自动发送，1为手动调用
        "title": options.title || "",                             //当前页面标题
        "user_id": "1a2b3c"                   //用户id，如果未登录就回传空字符串
    };
    switch (env) {
        case "android":
        // _BFD.USER_INFO.appkey = "fb2e4f45e590518428b64a957faa30bf";
        // break;
        case "ios":
            // _BFD.USER_INFO.appkey = "";
            // _BFD.USER_INFO.appkey = "87b4b263237a72d8f31969b062e3a0bc";
            break;
        default:
            // delete _BFD.USER_INFO.appkey;
            // _BFD.USER_INFO.appkey = "fb2e4f45e590518428b64a957faa30bf";
            _BFD.USER_INFO.appkey = "87b4b263237a72d8f31969b062e3a0bc";
        // _BFD.USER_INFO.appkey = "1d02c27669c2111e283b55fcd685166f";
    }


    this.loadScript('/mssos/sos/recommendproxy/acquisition/web.js');
};

BFD.prototype.setAppkey = function (appkey) {
    _BFD.USER_INFO.appkey = appkey;
};
/**
 * 调用推荐接口
 * @param rec_id {String} 推荐栏id
 * @param rec_params {Object}
 * @param cbname 回调函数名称 不能匿名函数
 */
BFD.prototype.recommend = function (rec_id, rec_params, cbname) {
    _BFD.Recommend(rec_id, rec_params, cbname);
    // _BFD.Recommend(rec_id, rec_params, "test_rec");
};

function test_rec(data) {
    alert(JSON.stringify(data));
    console.log(data);
}

BFD.prototype.beforeClick = function (params, actionname) {
    actionname = actionname || "MFeedBack";
    this._BFD.UserAction(actionname, {
        "rid": params.rid,
        "item_type": params.item_type || "news",
        "iid": params.iid,
        "pos_province": params.pos_province,
        "pos_city": params.pos_city,
        "car_vin": params.car_vin,
        "terminal": params.terminal || "app"
    });
};
BFD.prototype.exposure = function (params, actionname) {
    actionname = actionname || "MDFeedBack";
    this._BFD.UserAction(actionname, {
        "rid": params.rid,
        "item_type": params.item_type || "news",
        "iid": params.iid,
        "pos_province": params.pos_province,
        "pos_city": params.pos_city,
        "car_vin": params.car_vin,
        "terminal": params.terminal || "app"
    });
};
BFD.prototype.addEvent = function (a, b, c) {
    if (a.addEventListener) {
        a.addEventListener(b, c, false)
    } else {
        if (a.attachEvent) {
            a.attachEvent("on" + b, function () {
                c.call(a)
            })
        } else {
            a["on" + b] = c
        }
    }
};

BFD.prototype.removeEvent = function (a, b, c) {
    if (a.removeEventListener) {
        a.removeEventListener(b, c, false)
    } else {
        if (a.detachEvent) {
            a.detachEvent("on" + b, function () {
                c.call(a)
            })
        } else {
            a["on" + b] = null
        }
    }
};

BFD.prototype.createElement = function (d, a) {
    var c = document.createElement(d);
    if (a) {
        for (var b in a) {
            if (a.hasOwnProperty(b)) {
                if (b === "class" || b === "className") {
                    c.className = a[b]
                } else {
                    if (b === "style") {
                        c.style.cssText = a[b]
                    } else {
                        c.setAttribute(b, a[b])
                    }
                }
            }
        }
    }
    return c
};

BFD.prototype.loadScript = function (a, b) {
    // setTimeout(function () {
    var _this = this,
        c = this.createElement("script", {
            src: a,
            type: "text/javascript",
            async: true
        });
    if (c.readyState) {
        _this.addEvent(c, "readystatechange", function () {
            if (c.readyState === "loaded" || c.readyState === "complete") {
                if (b) {
                    b()
                }
                _this.removeEvent(c, "readystatechange", arguments.callee)
            }
        });
    } else {
        _this.addEvent(c, "load", function () {
            if (b) {
                b()
            }
            _this.removeEvent(c, "load", arguments.callee)
        })
    }
    document.getElementsByTagName("head")[0].appendChild(c)
// }, 0)
};

BFD.prototype.getEnv = function () {
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
};

// 目前需要的数据
// rec_id	    推荐栏id	String	A123456789
// longitudes	经度	Stirng	115.3063008000
// latitudes	纬度	String	38.4442926889
// pos_province	省份	String	四川
// pos_city	    城市	String	成都
// car_vin	    车辆vin码	String	20180032343
// idpuserid	用户唯一标识	String	20183455

// rid	        推荐id,服务器返回	String	rec_45202d802_11
// item_type	产品资源库	String	news
// iid	        产品唯一标识	String	201800321
// terminal	    终端类型(android和ios固定为app, 车机为car)	String	app
