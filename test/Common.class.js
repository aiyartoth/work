/**
 * 公共基础类
 * 日期:2018年3月16日09:49:34
 * AUTHOR:xyn
 * Require:config.js
 */

/**
 * 公共基础库
 * @constructor Common
 */
function Common() {

    this.event_list = [];
}

/**
 * 给原型添加方法
 * @param {Object} obj
 */
Common.prototype.extend = function (obj) {
    var _this = this,
        options = arguments[0];
    options = options || {};
    for (var name in options) {
        if (options.hasOwnProperty(name)) {
            _this[name] = options[name];
        }
    }
};
/**
 * 根据运行环境打印参数
 */
/*Common.prototype.print = function () {
    //车机环境只能用alert来打印log,模拟器用console.log打印
    APP_CONFIG.ENV === "dev" ? console.log(arguments[0]) : alert(arguments[0]);
};*/
/**
 * 通用的log函数
 * @param data
 */
Common.prototype.log = function (data) {
    Util.log(data);
    /*var now = new Date();
    var timer = now.getFullYear() + "-"
        + (now.getMonth() + 1) + "-"
        + (now.getDate()) + " "
        + (now.getHours()) + ":"
        + (now.getMinutes()) + ":"
        + (now.getSeconds());
    var str = "";
    for (var i = 0; i < arguments.length; i++) {
        try {
            str = (typeof arguments[i] === "string") ? arguments[i] : JSON.stringify(arguments[i]);
            this.print(timer + ":" + str);
        } catch (e) {
            str = JSON.stringify(e);
            this.print(timer + ":" + str);
        }
    }*/
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