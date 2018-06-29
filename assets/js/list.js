$(function () {
//页面管理控制
    function PageView() {
        Common.call(this);
        this.result = {
            rec_id: "",
            rec_data: [],
            dataIndex: 0
        };
        this.wrap_node = $("#wrap");
        this.list_node = $("#list");
        this.no_more_wrap_node = $("#no-more-wrap");
        this.msg_wrap_node = $("#msg-wrap");
        this.msg_content_node = $("#msg-content");
        this.msg_btn_node = $("#msg-btn");
        this.options = {};
        this.isAnimating = false;
    }

    PageView.prototype = Object.create(Common.prototype);
    PageView.prototype.constructor = PageView;
    PageView.prototype.init = function (options) {
        var _this = this;
        this.options = $.extend({}, this.options, options);
        if (this.options.requestRecData) {
            // this.options.requestRecData(_this.resultHandle.bind(_this));
            this.options.requestListen(function (data) {
                _this.resultHandle(data);
            });
            this.options.requestRecData(rec_callback);

        } else {
            this.resultHandle();
        }
    };

    PageView.prototype.resultHandle = function (data) {
        /*var str = "";
        str += "argumentLength:" + arguments.length + "<br/>";
        for (var i = 0; i < arguments.length; i++) {
            str += "第" + i + "个参数:" + Object.prototype.toString.call(arguments[i]) + " , " + JSON.stringify(arguments[i]) + "<br/>";
        }
        $("#log").append(str);*/
        var _this = this,
            resData = null,
            _newData = [];
        try {
            data = _this.isString(data) ? JSON.parse(data) : data;
        } catch (e) {
            console.log("数据尝试转换失败......");
        }
        if (_this.isArray(data)) {
            //PC及IOS的数据返回[code,msg,rid,data]
            if ((data.length > 1) && (data[1] === "OK") && (data[3].length > 0)) {
                _this.result.rec_id = data[2] || "";
                resData = data[3];
            }
        } else if (_this.isObject(data)) {
            //Android的数据返回{rid:xxx,data:[xx]}
            if (_this.isArray(data.data) && (data.data.length > 0)) {
                _this.result.rec_id = data.rid;
                resData = data.data;
            }
        }
        if (resData) {
            resData.forEach(function (value) {
                var isIn = false;
                // TODO 过滤
                $.each(_this.result.rec_data, function (index2, value2) {
                    if (value2.iid === value.iid) {
                        isIn = true;
                        return false;
                    }
                });
                if (!isIn) {
                    _newData.push($.extend({}, value, {
                        rid: _this.result.rec_id
                    }));
                }
            });
            this.result.rec_data = this.result.rec_data.concat(_newData);
            localStorage.setItem("rec_data", JSON.stringify(this.result.rec_data));
            this.recShowHandle(_newData);
            this.options.complete && this.options.complete({refresh: true});
            return true;
        }
        this.options.complete && this.options.complete({refresh: false});
        this.noMoreShow();

    };
    PageView.prototype.recShowHandle = function (data) {
        var _html = "",
            _this = this,
            // data = this.result.rec_data,
            _saveData = {},
            _now = new Date().getTime(),
            _now_Date = new Date().Format("yyyy-MM-dd");
        if (data && (data.length > 0)) {
            data.forEach(function (value) {
                _html += '<li class="item" data-index="' + _this.result.dataIndex + '">' +
                    '<div class="item-wrap" >' +
                    '<div class="item-cover"><img src="' + (value.src) + '" alt=""></div>' + /*value.src*/
                    '<h3 class="item-short-title fs32">' + value.title + '</h3>' +
                    // '<div class="item-short-info-wrap">' +
                    // '<table class="item-short-info">' +
                    // '<tr class="fs28 info"><td>地点：</td><td>新国际博览中心 浦东新区龙阳路2345号</td></tr>' +
                    // '<tr class="fs28 info"><td>时间：</td><td>2018年8月3日-8月6日</td></tr>' +
                    // '</table>' +
                    // '</div>' +
                    '<div class="item-to-detail fs28"><p>查看详情</p></div>' +
                    '</div>' +
                    // '<div class="item-time fs24">' + _now_Date + '</div>' +
                    '</li>';
                // value.frequency=1;
                _this.options.exposureHandle && _this.options.exposureHandle($.extend({}, _this.options.params, value));
                _this.result.dataIndex++;
                if (parseInt(value.frequency) > 0) {
                    _saveData[value.iid] = {
                        frequencyTime: _now + parseInt(value.frequency) * 60 * 60 * 1000
                    }
                }
            });
            this.options.saveData && this.options.saveData(_saveData);
            this.recShow(_html);
            this.recAddEvent();
        } else {
            // this.showMessage("没有数据");
            this.noMoreShow();
        }
    };

    PageView.prototype.recShow = function (htmlStr) {
        this.no_more_wrap_node.fadeOut(200);
        this.list_node.append(htmlStr);
        this.wrap_node.fadeIn(200);
    };
    PageView.prototype.recAddEvent = function () {
        var _this = this;
        _this.list_node.on("click", ".item-wrap", function () {
            if (!_this.isAnimating) {
                var index = $(this).parent().data("index");
                var rec_data = $.extend({}, _this.options.params, _this.result.rec_data[parseInt(index)]);
                _this.options.beforeClick && _this.options.beforeClick(rec_data);
                var paramStr = "rid=" + (rec_data.rid || "") +
                    "&item_type=" + (rec_data.item_type || "") +
                    "&iid=" + (rec_data.iid || "") +
                    "&pos_province=" + (rec_data.pos_province || "") +
                    "&pos_city=" + (rec_data.pos_city || "") +
                    "&car_vin=" + (rec_data.car_vin || "") +
                    "&terminal=" + (rec_data.terminal || "");
                window.location.href = rec_data.url + "?" + paramStr;//TODO 附加参数
            }
            return false;

        });
    };
    PageView.prototype.noMoreShow = function () {
        if (this.result.rec_data.length === 0) {
            this.options.noData && this.options.noData();
            this.no_more_wrap_node.show();
        }
    };
    PageView.prototype.showMessage = function (msg) {
        var _this = this;
        _this.msg_content_node.html(msg);
        _this.msg_wrap_node.show();
        _this.msg_btn_node.off("click").one("click", function () {
            _this.msg_wrap_node.hide();
        });
    };

    //本地缓存管理
    function CacheManage() {
        Common.call(this);
        this.cache_name = "rec_cache";
        this.cache_data = {};//demo: {id:{frequencyTime:XXX},id2:{frequencyTime:XXX}}
    }

    CacheManage.prototype = Object.create(Common.prototype);
    CacheManage.prototype.constructor = CacheManage;
//获取缓存的ID,并检查是否失效,返回有效的
    CacheManage.prototype.getFrequency = function () {
        var _cache = this.getCache(),
            _new_cache,
            _str = "",
            _now = new Date().getTime();
        for (var key in _cache) {
            if (_cache.hasOwnProperty(key)) {
                if (_cache[key]["frequencyTime"] && parseInt(_cache[key]["frequencyTime"]) >= _now) {
                    _str += key + ",";
                } else {
                    delete _cache[key]
                }
            }
        }
        this.setCache(_cache);
        (_str.length > 0) && (_str = _str.substr(0, _str.length - 1));
        return _str;
    };
    CacheManage.prototype.getCache = function () {
        var now = new Date().getTime();
        // this.cache_data || (this.cache_data = localStorage.getItem(this.cache_name));
        if (!this.isNotEmptyObject(this.cache_data)) {
            this.cache_data = localStorage.getItem(this.cache_name);
            try {
                this.cache_data = JSON.parse(this.cache_data);
                this.isObject(this.cache_data) || (this.cache_data = {});
            } catch (e) {
                this.cache_data = {};
            }
        }
        return this.cache_data;
    };
    CacheManage.prototype.setCache = function (data) {
        this.cache_data = data;
        localStorage.setItem(this.cache_name, JSON.stringify(data));
    };


    var bfd = new BFD(),
        page = new PageView(),
        _loading = new LoadingView(),
        _cache = new CacheManage(),
        _title = "推荐",
        _ENV = bfd.getEnv();
    document.title = _title;


    _loading.init(_ENV);
    _loading.show();
    //加载web.js
    bfd.init({
        title: _title
    });

    var _frequency = _cache.getFrequency();
    var params = _common.getAllParams() || {};
    params = $.extend({}, {
        item_type: "news",
        terminal: "app"
    }, params, {
        // bid: (_ENV === "android" ? "596709224527195" : (_ENV === "ios" ? "596709208989102" : "596973637886561"))
        // bid: (_ENV === "android" ? "596709224527195" : (_ENV === "ios" ? "596709208989102" : "596709208989102"))
    });

    // bfd.setAppkey(params.appkey);

    _frequency += (params.filter_ids && (params.filter_ids !== "undefined")) ? ("," + params.filter_ids) : "";
    _frequency = _frequency.replace(/(^,)|(,$)/ig, "");


    //等待web.js完成的事件执行
    window.addEventListener("loadscript", function () {
        getRec();

        function isPassive() {
            var supportsPassiveOption = false;
            try {
                addEventListener("test", null, Object.defineProperty({}, 'passive', {
                    get: function () {
                        supportsPassiveOption = true;
                    }
                }));
            } catch (e) {
            }
            return supportsPassiveOption;
        }

        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, isPassive() ? {
            capture: false,
            passive: false
        } : false);


    });

    //https://m-idt10.onstar.com.cn/probes/list.html?pos_city=上海市&car_vin=LSGZG5378GS026406&longitudes=121.397229546441&bid=596709208989102&idpuserid=ONSTARAPP343676152&pos_province=上海市&latitudes=31.16829291449653&appkey=87b4b263237a72d8f31969b062e3a0bc
    //car_vin \ pos_city \ pos_province \ bid \ idpuserid \ latitudes \ longitudes \ filter_ids
    //
    function getRec() {
        page.init({
            params: params,
            requestRecData: function (res_callback) {
                bfd.recommend(params.bid, {
                    "longitudes": params.longitudes || "",
                    "latitudes": params.latitudes || "",
                    "pos_province": params.pos_province || "",
                    "pos_city": params.pos_city || "",
                    "car_vin": params.car_vin || "",
                    "idpuserid": params.idpuserid || "",
                    "filter_ids": _frequency || "",
                    "appkey": params.appkey || "",
                    "gid": params.gid || ""

                }, res_callback);
            },
            requestListen: function (callback) {
                //添加事件监听
                _common.listen(rec_event_key, function (data) {
                    callback && callback(data);
                })
            },
            saveData: function (data) {
                var localCache = _cache.getCache();
                localCache = $.extend({}, localCache, data);
                _cache.setCache(localCache);
            },
            beforeClick: function (params) {
                bfd.beforeClick(params);
            },
            exposureHandle: function (params) {
                bfd.exposure(params);
            },
            complete: function (params) {
                _common.remove(rec_event_key);//清除事件监听
                _loading.hide();
                if (params && params.refresh) {
                    if (page.scroll) {
                        page.scroll && page.scroll.refresh();
                    } else {
                        page.scroll = new IScroll(page.wrap_node[0], {
                            freeScroll: true,
                            vScroll: true,
                            checkDOMChanges: true,
                            bounce: true,
                            mouseWheel: true,
                            click: true,
                            deceleration: 0.001,
                            disablePointer: true,
                            disableTouch: false,
                            disableMouse: false
                        });

                        page.scroll.on("scrollStart", function () {
                            page.isAnimating = true;
                        });

                        page.scroll.on("scrollEnd", function () {

                            page.isAnimating = false;
                            if (this.maxScrollY === this.y) {
                                console.log("我已滚动到底部");
                                page._scrollTimer = page._scrollTimer || "";
                                clearTimeout(page._scrollTimer);
                                page._scrollTimer = setTimeout(function () {
                                    getRec();
                                }, 20);
                            }
                            return false;
                        });
                    }
                }
            },
            noData: function () {
                page.scroll && page.scroll.destroy();
            }
        });
    }

});
