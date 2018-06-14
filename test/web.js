/***2017/05/27 08:30 version-1.1 添加热力图事件***/
window["_BFD"] = window["_BFD"] || {};
_BFD.Listener = document.createEvent("Event");
_BFD.Listener.initEvent("loadscript",true,true);
/***加载文件的方法及封装的一些方法***/
_BFD.addEvent=function(a,b,c){if(a.addEventListener){a.addEventListener(b,c,false)}else{if(a.attachEvent){a.attachEvent("on"+b,function(){c.call(a)})}else{a["on"+b]=c}}};_BFD.removeEvent=function(a,b,c){if(a.removeEventListener){a.removeEventListener(b,c,false)}else{if(a.detachEvent){a.detachEvent("on"+b,function(){c.call(a)})}else{a["on"+b]=null}}};_BFD.createElement=function(d,a){var c=document.createElement(d);if(a){for(var b in a){if(a.hasOwnProperty(b)){if(b==="class"||b==="className"){c.className=a[b]}else{if(b==="style"){c.style.cssText=a[b]}else{c.setAttribute(b,a[b])}}}}}return c};_BFD.loadScript=function(a,b){setTimeout(function(){var c=_BFD.createElement("script",{src:a,type:"text/javascript"});if(c.readyState){_BFD.addEvent(c,"readystatechange",function(){if(c.readyState==="loaded"||c.readyState==="complete"){if(b){b()}_BFD.removeEvent(c,"readystatechange",arguments.callee)}})}else{_BFD.addEvent(c,"load",function(){if(b){b()}_BFD.removeEvent(c,"load",arguments.callee)})}document.getElementsByTagName("head")[0].appendChild(c)},0)};_BFD.getByAttribute=function(g,h,a){var b=[],a=(a)?a:document,e=a.getElementsByTagName("*"),d=new RegExp("\\b"+h+"\\b","i");for(var c=0;c<e.length;c++){var f=e[c];if(g==="className"||g==="class"){if(d.test(f.className)){b.push(f)}}else{if(f.getAttribute(g)===h){b.push(f)}}}return b};_BFD.getByClass=function(b,a){return _BFD.getByAttribute("className",b,a)};_BFD.getById=function(a){if(typeof a==="string"&&!!a){return document.getElementById(a)}};_BFD.loadCss=function(a){var b=_BFD.createElement("link",{href:a,rel:"stylesheet",type:"text/css"});document.getElementsByTagName("head")[0].appendChild(b)};_BFD.insertAfter=function(d,c){var b=c.parentNode;if(b.lastChild==c){b.appendChild(d)}else{var a=c.nextElementSibling||c.nextSibling;b.insertBefore(d,a)}};

/***Load Bcore***/
_BFD.loadScript('/mssos/sos/recommendproxy/acquisition/bcore.min.js',function(){
	
	/***webservice地址***/
	//_BFD.webservice_src = "http://10.216.83.75:9999/probes/2.0/input/UserAction/?actionname=";
	//_BFD.rec_src = "http://10.216.83.75:9999/rec/"
	_BFD.webservice_src = "/mssos/sos/recommendproxy/probes/2.0/input/UserAction/?actionname="
	_BFD.rec_src = "/mssos/sos/recommendproxy/rec/2.0/P.do?"

	/***Gid准备完成***/
	bcore.onGidReady(function(gid){
		console.log(gid)
	},{
		/***静态资源路径，包括 clientData.html***/
		assetsPath: '/mssos/sos/recommendproxy/acquisition/',
		/***gid 服务地址***/
		stdIdURL: _BFD.webservice_src + "StdID&appkey=" + _BFD.USER_INFO.appkey
	})
	
	/***新页面发送jsonp请求的实现***/
	_BFD.RequestSave = function () {}
	_BFD.RequestSave.urlarray = [];
	_BFD.RequestSave.prototype = {
		/***将请求缓存***/
		save : function (url, param, callback) {
			param || (param = {})
			param.random = (new Date()).getTime()
			url = url + "&"
			if (typeof callback === 'function') {
				var callbackName = '__JSONPCallBack_' + Math.random().toString(16).slice(2)
				window[callbackName] = function() {
					callback.apply(null, arguments)
					//delete window[callbackName]
				}
				param.callback = 'window.' + callbackName
			}

			var params = []
			for (var k in param) {
				param.hasOwnProperty(k) && params.push(k + '=' + encodeURIComponent(param[k]))
			}
			
			url += params.join('&')
			_BFD.RequestSave.urlarray.push(url);
			bcore.localData.set("save_request_url",_BFD.RequestSave.urlarray);
		},
		/***将缓存的请求发送***/
		send : function () {
			var save_request_url = bcore.localData.get("save_request_url");
			if (save_request_url !=null && save_request_url != "null") {
				save_request_url_array = save_request_url.split(",");
				for(var urli = 0;urli<save_request_url_array.length;urli++){
					var script = document.createElement('script')
					script.setAttribute('src', save_request_url_array[urli])
					script.setAttribute('charset', 'utf-8')
					document.getElementsByTagName('head')[0].appendChild(script)
					//删除jsonp缓存
					script.parentNode.removeChild(script);
				}
			}
			bcore.localData.remove("save_request_url")
		}

	}
	/***页面加载自动执行***/
	_BFD.RequestSave.prototype.send()
	
	/***获取flash版本***/
	_BFD.FlashVersion = function(){
		var fv = " ";
		if (navigator.plugins && navigator.plugins.length) {
			for (var ii = 0; ii < navigator.plugins.length; ii++) {
				if (navigator.plugins[ii].name.indexOf('Shockwave Flash') != -1) {
					fv = navigator.plugins[ii].description.split('Shockwave Flash ')[1];
					break;
				}
			}
		} else if (window.ActiveXObject) {
			for (var ii = 10; ii >= 2; ii--) {
				try {
					var fl = eval("new ActiveXObject('ShockwaveFlash.ShockwaveFlash." + ii + "');");
					if (fl) {
						fv = ii + '.0';
						break;
					}
				} catch (e) {}
			}
		}
		return fv;
	}
	/***获取设备及网页信息***/
	_BFD.pv_params = {}
	_BFD.pv_params.cookiesupport = window.navigator.cookieEnabled ? 0 : 1;
	_BFD.pv_params.ep = document.location.href;
	_BFD.pv_params.ln = document.referrer;
	_BFD.pv_params.lk = bcore.getSearchEngine().searchWords;
	_BFD.pv_params.bt = bcore.getBrowser().name + " " + bcore.getBrowser().version;
	_BFD.pv_params.ot = bcore.getOS().name + " " + bcore.getOS().version;
	_BFD.pv_params.rs = bcore.getScreen().width + "*" + bcore.getScreen().height;
	_BFD.pv_params.ct = document.charset || document.characterSet;
	_BFD.pv_params.cb = screen.colorDepth;
	_BFD.pv_params.fv = _BFD.FlashVersion();
	_BFD.pv_params.ja = navigator.javaEnabled() ? 1 : 0;
	_BFD.pv_params.oc = navigator.systemLanguage || navigator.browserLanguage || navigator.language || navigator.userLanguage || "";	
	/***获取用户标识及客户标识***/
	_BFD.common_params = {}
	_BFD.common_params.gid = bcore.cookie.get("bfd_g");
	_BFD.common_params.sid = bcore.getSid();
	_BFD.common_params.tma = bcore.getUserTrack().tma;
	_BFD.common_params.tmc = bcore.getUserTrack().tmc;
	_BFD.common_params.tmd = bcore.getUserTrack().tmd;
	_BFD.common_params.cid = _BFD.USER_INFO.client_id;
	_BFD.common_params.appkey = _BFD.USER_INFO.appkey;
	
	/**
	 *对外提供的埋点调用方法
	 *actionname为埋点方案中的事件id
	 *params为埋点方案中需要回传的参数
	 *request_type为可选参数，只有在点击某个功能时，页面跳转太快，导致请求中断时才需要回传此参数，并且只能回传为字符串'save'
	 **/
	_BFD.UserAction = function(actionname,params,request_type){
		try{
			var uid = _BFD.USER_INFO.user_id;
			if(params.uid !=undefined){
				uid = params.uid;
			}
			if((window.BFDMethod && window.BFDMethod.onBFDEvent && typeof window.BFDMethod.onBFDEvent === "function") || (window.IOSBFDEvent && typeof window.IOSBFDEvent === "function")){
				if(actionname.indexOf("PageView")!=-1){
					if(actionname == "PageView"){
						params.action_name = "start";
						actionname = "MAction";
					}
					if(actionname == "EndPageView"){
						params.action_name = "end";
						actionname = "MAction";
					}
					if(params.title){
						params.name = params.title;
						delete params["title"];
					}else if(params.p_s){
						params.name = params.p_s;
						delete params["p_s"];
					}else{
						params.name = "页面名称未回传";
					}
					if(window.BFDMethod && window.BFDMethod.onBFDEvent){
						params.type = "page";
						window.BFDMethod.onBFDEvent(actionname,JSON.stringify({params:params}));
					}
					if(window.IOSBFDEvent){
						params.type = "app";
						window.IOSBFDEvent(actionname,JSON.stringify(params));
					}
				}else{
					try{
						window.BFDMethod.onBFDEvent(actionname,JSON.stringify({params:params}));
					}catch(e){
						try{
							window.IOSBFDEvent(actionname,JSON.stringify(params));
						}catch(e){
							
						}
					}
				}
			}else{
				if(actionname === 'PageView' || actionname === 'EndPageView'){
					params.p_s = params.p_s || params.title || document.title;
					for(var pv_key in _BFD.pv_params){
						params[pv_key] = _BFD.pv_params[pv_key];
					}
					for(var params_pv_key in params){
						if(params_pv_key == 'title'){
							delete params[params_pv_key];
						}
					}
				}
				for(var common_key in _BFD.common_params){
					params[common_key] = _BFD.common_params[common_key];
				}
				params.uid = uid;
				if(request_type !== undefined && request_type === 'save'){
					_BFD.RequestSave.prototype.save(_BFD.webservice_src + actionname,params);
				}else{
					bcore.send(_BFD.webservice_src + actionname,params);
				}
			}
		}catch(e){

		}
	}
	try{
		if(_BFD.USER_INFO && _BFD.USER_INFO.pv_type != undefined){
			if(_BFD.USER_INFO.pv_type == "0"){
				var title = document.title;
				if(_BFD.USER_INFO.title && _BFD.USER_INFO.title !== ""){
					title = _BFD.USER_INFO.title;
				}
				_BFD.UserAction("PageView",{"p_s":title})
				bcore.onPageClose(function(){
					_BFD.UserAction("EndPageView",{"p_s":title},"save")
				});
			}
		}
	}catch(e){
		
	}
	
	
	/***LinkClick***/
	//获取当前点击节点的父节点	
	function getParentAlabel(e) {
		while (e.tagName.toLowerCase() !== "a" && e.tagName.toLowerCase() !== "body" && e.tagName.toLowerCase() !== "html") {
			e = e.parentNode;
		}			
		return e;
	}
	//LinkClick方法调用
	_BFD.LinkClick = function(){
		bcore.on(document, "click", function(e) {
			var ev = e || window.event;   
			var _st = document.body.scrollTop || document.documentElement.scrollTop;
			var offsetX = ev.clientX;
			var offsetY = ev.clientY + _st;
			var target = ev.target || ev.srcElement;
			var link = getParentAlabel(target)
			if (link.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button') {
				var linkparams = {};
				linkparams.lt = offsetX;
				linkparams.ln = document.referrer;
				linkparams.tp = offsetY;
				linkparams.ep = document.location.href;
				for(var linkp in _BFD.common_params){
					linkparams[linkp] = _BFD.common_params[linkp];
				}
				if(link.tagName.toLowerCase() === 'a'){
					linkparams.title = link.text;
					linkparams.pth = bcore.getXPath(link);
				}else{
					linkparams.title = target.innerHTML;
					linkparams.pth = bcore.getXPath(target);
				}
				
				_BFD.UserAction("LinkClick",linkparams);
			}
		}, true);
	}
	/***POS***/
	function fpos(e) {
		var e = e || window.event;
		if (document.documentElement && document.documentElement.scrollTop) {
			return {
				x : e.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft,
				y : e.clientY + document.documentElement.scrollTop - document.documentElement.clientTop
			};
		} else if (document.body) {
			return {
				x : e.clientX + document.body.scrollLeft - document.body.clientLeft,
				y : e.clientY + document.body.scrollTop - document.body.clientTop
			};
		}
	}
	_BFD.mouseDownEvent = function() {
		bcore.off(document, "mousedown", dealMouseDown);
		bcore.on(document, "mousedown", dealMouseDown, true);
		function dealMouseDown(e) {
			var pos = fpos(e);
			reportMouseDownEvent(pos.x, pos.y);
		}
	};
	function reportMouseDownEvent(x, y) {
		try {
			if (_BFD.mouseDownEvent && _BFD.mouseDownEvent !== "") {
				var params = {
					x : x,
					y : y,
					prs : (document.documentElement.scrollWidth + '*' + document.documentElement.scrollHeight),
					ep : window.location.href
				}
				var posparams = {};
				posparams.x = x;
				posparams.y = y;
				posparams.prs = (document.documentElement.scrollWidth + '*' + document.documentElement.scrollHeight);
				posparams.ep = window.location.href;
				for(var posp in _BFD.common_params){
					posparams[posp] = _BFD.common_params[posp];
				}
				_BFD.UserAction("Pos",posparams);
			}
		} catch (e) {

		}
	};
	try{
		if(_BFD.USER_INFO.pos){
			if(_BFD.USER_INFO.pos == true){
				_BFD.mouseDownEvent();
			}
			if(_BFD.USER_INFO.lc == true){
				_BFD.LinkClick();
			}
		}
	}catch(e){
		
	}
	/***推荐埋点调用的方法，callback为埋点人员自己写的函数***/
	_BFD.Recommend = function(rec_id,rec_params,callback){
		var rec_callback = callback;
		rec_params.bid = rec_id;
		rec_params.rec_callback = rec_callback;
		try{
			window.BFDMethod.onBFDEvent("bfd_rec", JSON.stringify(rec_params));
		}catch(e){
			try{
				window.IOSBFDEvent("bfd_rec", JSON.stringify(rec_params));
			}catch(e){
				for(var rec_key in _BFD.common_params){
					rec_params[rec_key] = _BFD.common_params[rec_key];
				}
				bcore.send(_BFD.rec_src,rec_params,rec_callback)
			}
		}
	};
	/*埋点人员自己定义的函数，用来获取推荐返回结果
		function rec_results(data){
			//console.log(data)
		}
	
	埋点人员调用方法示例
	_BFD.Recommend('A1467600072499',{'iid':'123abc'},rec_results);
	*/
	window.dispatchEvent(_BFD.Listener);
});
