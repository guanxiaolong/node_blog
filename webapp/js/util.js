var util = (function() {
	//常用公共jq对象
	var $win = $(window);
	var $doc = $(document);

	var loadBox = (function() {
		var $ele;
		var html = [
				'<div style="bottom: 0;left: 0;overflow: hidden;position: fixed;right: 0;top: 0;z-index: 400;background-color: rgba(255,255,255,0.3);">',
				'<div style="position: absolute;top: 40%;width: 100%;text-align: center;" class="loadIcon"><div class="ball"></div><div class="ball1"></div></div></div>' ]
				.join('');
		return {
			show : function(time) {
				if (!$ele) {
					$ele = $(html).appendTo('body');
				}
				$ele.show();
				if (time) {
					setTimeout(function() {
						loadBox.hide();
					}, time);
				}
			},
			hide : function() {
				if($ele) $ele.hide();
			},
			stop : function() {
				if($ele) $ele.hide();
			}
		}
	})();
	
	var userAgent = navigator.userAgent;
	var detect = {
		isAndroidClient: function() {
			return userAgent && userAgent.toLowerCase().indexOf("android") > -1
		},
		isIos: function() {
			return userAgent && userAgent.toLowerCase().indexOf("iphone") > -1
		},
		getBrowserInfo: function () {
			var a = userAgent;
			var b = {
				os: "iphone",
				version: 6,
				browser: "safari",
				keyboardHeight: 250,
				ios6: function() {
					return "iphone" === this.os && this.version >= 6
				},
				lowLevel: function() {
					return !1
				}
			},
			c = a.toUpperCase(),
			d = c.indexOf("IPHONE") >= 0 || c.indexOf("IPOD") >= 0 || c.indexOf("IPAD") >= 0;
			c.indexOf("IPAD") >= 0 && (b.keyboardHeight = 450),
			d || (b.os = "android");
			var e = a.match(/UC\sAppleWebKit\/([\d.]+)/),
			f = a.match(/(UCWEB)(\d.+?(?=\/))/);
			if (e || f ? b.browser = "uc": a.match(/MQQBrowser/) ? b.browser = "qq": a.match(/(Chrome)|(CriOS)/) && (b.browser = "chrome"), "iphone" === b.os) b.version = parseFloat(("" + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ""])[1]).replace("undefined", "3_2").replace("_", ".").replace("_", "")) || 6;
			else if ("android" === b.os) {
				var g = a.indexOf("Android "),
				h = a.substr(g + 8, 6),
				i = h.split(/_|\./);
				b.version = parseFloat(i.join("."))
			}
			return d || (b.keyboardHeight = .8 * window.innerWidth), b
		}
	};
	
	var loading = function ($ele) {
		var html = '<img src="'+ HOME_URL +'/images/bottom_loading.gif">';
		var status = 'loaded';
		return {
			loadinit: function () {
				status = 'loaded';
				$ele.html("加载更多");
				return true;
			},
			loadon: function() {
				if (status == 'loaded') {
					status = 'loading';
					$ele.html(html+ "加载中...");
					return true;
				} else {
					return false;
				}
			},
			loadoff: function() {
				if (status != 'end') {
					status = 'loaded';
					$ele.html("加载更多");
					return true;
				}
				return false;
			},
			loadover: function() {
				status = 'end';
				$ele.html("加载完毕");
				return true;
			}
		}
	};
	
	//cookie
	(function ($) {
		var pluses = /\+/g;
		function encode(s) {
			return config.raw ? s : encodeURIComponent(s);
		}
		function decode(s) {
			return config.raw ? s : decodeURIComponent(s);
		}
		function stringifyCookieValue(value) {
			return encode(config.json ? JSON.stringify(value) : String(value));
		}
		function parseCookieValue(s) {
			if (s.indexOf('"') === 0) {
				// This is a quoted cookie as according to RFC2068, unescape...
				s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
			}
			try {
				// Replace server-side written pluses with spaces.
				// If we can't decode the cookie, ignore it, it's unusable.
				s = decodeURIComponent(s.replace(pluses, ' '));
			} catch(e) {
				return;
			}
			try {
				// If we can't parse the cookie, ignore it, it's unusable.
				return config.json ? JSON.parse(s) : s;
			} catch(e) {}
		}
		function read(s, converter) {
			var value = config.raw ? s : parseCookieValue(s);
			return $.isFunction(converter) ? converter(value) : value;
		}
		var config = $.cookie = function (key, value, options) {
			if (value !== undefined && !$.isFunction(value)) {
				options = $.extend({}, config.defaults, options);
				if (typeof options.expires === 'number') {
					var days = options.expires, t = options.expires = new Date();
					t.setDate(t.getDate() + days);
				}
				return (document.cookie = [
					encode(key), '=', stringifyCookieValue(value),
					options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
					options.path    ? '; path=' + options.path : '',
					options.domain  ? '; domain=' + options.domain : '',
					options.secure  ? '; secure' : ''
				].join(''));
			}
			var result = key ? undefined : {};
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			for (var i = 0, l = cookies.length; i < l; i++) {
				var parts = cookies[i].split('=');
				var name = decode(parts.shift());
				var cookie = parts.join('=');
				if (key && key === name) {
					result = read(cookie, value);
					break;
				}
				if (!key && (cookie = read(cookie)) !== undefined) {
					result[name] = cookie;
				}
			}
			return result;
		};
		config.defaults = {};
		$.removeCookie = function (key, options) {
			if ($.cookie(key) !== undefined) {
				$.cookie(key, '', $.extend({}, options, { expires: -1 }));
				return true;
			}
			return false;
		};
	})($);

	var winScroll = function (opt) {
		var _opt = $.extend({
			dalay: 2000,
			minSHight: 60
		}, opt)
		return {
			isOnloading: false,
			onScroll: function (fn) {
				if (!this.isOnloading) {
					if ($doc.height() - $win.scrollTop() - $win.height() < _opt.minSHight) {
						this.isOnloading = true;
						fn();
					}
				}
			}
		}
		
	};
	
	var template = (function () {
		var noMatch = /(.)^/;
		var escapes = {
			"'" : "'",
			'\\' : '\\',
			'\r' : 'r',
			'\n' : 'n',
			'\t' : 't',
			'\u2028' : 'u2028',
			'\u2029' : 'u2029'
		};
		var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
		var settings = {
			evaluate : /<@([\s\S]+?)@>/g,
			interpolate : /<@=([\s\S]+?)@>/g,
			escape : /<@-([\s\S]+?)@>/g
		};
		
		var matcher = new RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g');
		
		return function(text, data) {
			var render;
			var index = 0;
			var source = "__p+='";
			text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
				source += text.slice(index, offset).replace(escaper, function(match) {
					return '\\' + escapes[match];
				});
				if(escape) {
					source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
				}
				if(interpolate) {
					source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
				}
				if(evaluate) {
					source += "';\n" + evaluate + "\n__p+='";
				}
				index = offset + match.length;
				return match;
			});
			source += "';\n";
			if (!settings.variable)
				source = 'with(obj||{}){\n' + source + '}\n';
			source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
			
			try {
				render = new Function(settings.variable || 'obj', source);
			} catch (e) {
				e.source = source;
				throw e;
			}
			
			if(data)
				return render(data);
			var template = function(data) {
				return render.call(this, data);
			};
			template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';
			return template;
		};
	})();
	
	var getJSONCallback = function (fun) {
		return function (data, status, xhr) {
			loadBox.hide();
			if (data.flag == 200) {
				fun.call(this, data, status, xhr);
			} else if (data.flag == 404) {
				window.location= HOME_URL + '/userCenter/login.jsp?rurl='+encodeURIComponent(location.href);
			} else {
				alert("服务器繁忙,请稍后再试!");
			}
		}
	};
	
	var getParam = function (search) {
		search = search.replace(/#.+$/,'');
		var re = {};
		if (search == "" || typeof search == "undefined") {
			return {};
		} else {
			search = search.substr(1).split('&');
			for (var i = 0, len = search.length; i < len; i++) {
				var tmp = search[i].split('=');
				if(i == 0 && tmp.length == 1) {//?132141
					return {
						'__search__' : tmp[0]
					};
				}
				re[tmp.shift()] = tmp.join('=');
			}
			return re;
		}
	};
	var _param = getParam(window.location.search);
	
	var geolocation = (function () {
		var degrees2Radians = function(degrees) {
			return (degrees * Math.PI)/180;
		}
		var getDistence = function (placeA, placeB) {
			var dimRadsA = degrees2Radians(placeA.dim);
			var logRadsA = degrees2Radians(placeA.long);
			var dimRadsB = degrees2Radians(placeB.dim);
			var logRadsB = degrees2Radians(placeB.long);
			var Radius = 6371;
			return distance = Math.acos(Math.sin(dimRadsA) * Math.sin(dimRadsB) + 
							Math.cos(dimRadsA) * Math.cos(dimRadsB) *
							Math.cos(logRadsA - logRadsB)) * Radius * 1000;
		}
		
		var msgMap = ["未知错误", '用户禁止', 'GPS或者网络中断', '通信超时'];		
		return {
			place: false,
			getPlace: function (callback) {
				if (cookie.getCookie("disablePlace") != 1) {
					this._load(function (code, msg) {
						if (code == "error") {
							console.log(msg);
							if (msg == '用户禁止') {
								cookie.putCookie("disablePlace",  "1", 24);
							}
							geolocation.place = false;
						} else {
							var position = msg;
							geolocation.place = {
								dim: position.coords.latitude,
								long: position.coords.longitude,
							}
						}
					})
				} else {
					geolocation.place = false;
				}
				!!callback && callback();
			},
			getDistence: function (placeB) {
				if (this.place == false) {
					return -1;
				}
				console.log(this.place);
				return getDistence(this.place ,placeB)
			},
			getDisDes: function (dis) {
				if (dis == -1) {
					return "未知距离";
				} else if (dis > 1000) {
					return parseInt(dis/100)/10 + 'Km';
				} else {
					return dis + 'm';
				}
			},
			_load: function (callback) {
				geolocation.place = false;
				window.navigator.geolocation.getCurrentPosition(function (position) {
					callback('success', position)
				}, 
				function (e) {
					callback('error', msgMap[e.code]||"未知错误")
				}, {
					enableHighAccuracy: true
				});
			}
		}
	})();
	
	var notification = (function() {
		function dialog(opt) {
			this._options = $.extend({
				mode: "msg",
				text: "网页提示",
				useTap: false,
				isResize: true,
				hasBlankDiv: false
			}, opt || {}),
			this._init()
		};
		var html = ['<div class="c-float-popWrap msgMode hide">', 
				'<div class="c-float-modePop">', 
					'<div class="warnMsg"></div>', 
					'<div class="content"></div>', 
					'<div class="doBtn">', 
						'<button class="ok">确定</button>', 
						'<button class="cancel">取消</button>', 
					"</div>", 
				"</div>", 
			"</div>"].join("");
		var $blankDiv = $('<div style="bottom: 0;left: 0;overflow: hidden;position: fixed;right: 0;top: 0;z-index: 400;background-color: rgba(255,255,255,0.3);display:none;"></div>');
		var $ele = $(html);
		var $text = $ele.find(".warnMsg");
		var $content = $ele.find(".content");
		var $okBtn = $ele.find(".doBtn .ok");
		var $cancelBtn = $ele.find(".doBtn .cancel");
		var isInit = false;
		var timeId;
		
		$.extend(dialog.prototype, {
			_init: function() {
				var self = this;
				var opt = self._options;
				var callback = opt.callback;
				var type = opt.useTap ? "tap": "click";
				var className = $ele.attr("class").replace(/(msg|alert|confirm)Mode/i, opt.mode + "Mode");
				$ele.attr("class", className);
				if (opt.background) {
					$ele.css("background", opt.background);
				}
				$text.html(opt.text);
				$content.html(opt.content);
				$okBtn.off(type).on(type, function(e) {
					callback.call(self, e, true)
				});
				
				$cancelBtn.off(type).on(type, function(e) {
					callback.call(self, e, false)
				});
				if (isInit == false) {
					isInit = true;
					$blankDiv.click(function () {
						self.hide();
					});
					$("body").append($blankDiv);
					$("body").append($ele);
					if (opt.isResize) {
						$win.bind("resize", function() {
							setTimeout(function() {
								self._pos()
							},
							500)
						})
					}
				}
			},
			_pos: function() {
				var doc = document;
				var docEle = doc.documentElement;
				var body = doc.body;
				var self = this;
				if (self.isHide() == false) {
					$ele.css({
						top: body.scrollTop + (docEle.clientHeight - $ele.height()) / 2,
						left: body.scrollLeft + (docEle.clientWidth - $ele.width()) / 2
					})
				}
			},
			isShow: function() {
				return $ele.hasClass("show")
			},
			isHide: function() {
				return $ele.hasClass("hide")
			},
			_cbShow: function() {
				var onShow = this._options.onShow;
				$ele.css("opacity", "1").addClass("show");
				if (onShow)  {
					onShow.call(this);
				}
			},
			show: function() {
				timeId && (clearTimeout(timeId), timeId = void 0);
				var self = this;
				if (this.isShow()) {
					this._cbShow();
				} else {
					$ele.css("opacity", "0").removeClass("hide");
					var hasBlankDiv = this._options.hasBlankDiv;
					if (hasBlankDiv) {
						$blankDiv.show();
					}
					self._pos();
					setTimeout(function() {
						self._cbShow();
					}, 300)
					setTimeout(function() {
						$ele.animate({
							opacity: "1"
						},300, "linear");
					}, 1);
				}
			},
			_cbHide: function() {
				var onHide = this._options.onHide;
				$ele.css("opacity", "0").addClass("hide");
				if (onHide) {
					onHide.call(this);
				}
			},
			hide: function() {
				var self = this;
				if (this.isHide()) {
					this._cbHide();
				} else {
					$ele.css("opacity", "1").removeClass("show");
					var hasBlankDiv = this._options.hasBlankDiv;
					if (hasBlankDiv) {
						$blankDiv.hide();
					}
					setTimeout(function() {
						self._cbHide()
					}, 300);
					setTimeout(function() {
						$ele.animate({
							opacity: "0"
						}, 300, "linear")
					},1);
				}
			},
			flash: function(time) {
				var self = this;
				self._options.onShow = function() {
					timeId = setTimeout(function() {
						timeId && self.hide()
					}, time);
				},
				self.show();
			}
		});
		return {
			simple: function(text, bground, time) {
				if (2 == arguments.length && "number" == typeof arguments[1]) {
					time = arguments[1];
					bground = void 0;
				}
				var obj = new dialog({
					mode: "msg",
					text: text,
					background: bground
				});
				obj.flash(time || 2000);
				return obj;
			},
			msg: function(text, opt) {
				return new dialog($.extend({
					mode: "msg",
					text: text
				}, opt || {}));
			},
			alert: function(text, callback, opt) {
				return new dialog($.extend({
					mode: "alert",
					text: text,
					callback: callback
				}, opt || {hasBlankDiv: true}));
			},
			confirm: function(text, content, callback, opt) {
				return new dialog($.extend({
					mode: "confirm",
					text: text,
					content: content,
					callback: callback
				}, opt || {}))
			},
			pop: function(opt) {
				return new dialog(opt)
			}
		}
	})(); 
	
	var simple = notification.simple;
	
	var countTool = function (opt) {
		var $div = opt.$div;
		var max;
		if (opt.max ===0 || opt.max === "0") {
			max = 0;
		} else {
			max = opt.max || -1;//<0 没有限制
		}
		var value = opt.value || 1;
		
		$div.html(['<span class="count-btn disable count-btn-cut" style="font-size: 18px;">-</span>',
	'<input class="count-input" name="count" value="'+value+'" type="tel" >',
	'<span class="count-btn count-btn-add">+</span>'].join(''));

		var $input = $('.count-input', $div);
		var $cutBtn = $('.count-btn-cut', $div);
		var $addBtn = $('.count-btn-add', $div);
		
		var obj = {
			value: value,
			onCheck: opt.onCheck,
			setVal: function (val) {
				$input.val(val);
				return this.check(val);
			},
			getVal: function () {
				return parseInt($.trim($input.val()), 10);
			},
			add: function () {
				return this.check(this.getVal() + 1);
			},
			cut: function () {
				return this.check(this.getVal()-1);
			},
			change: function () {
				return this.check($.trim($input.val()));//用户可能输入非数字
			},
			check: function (val) {
				var v = val;
				var flag = true;
				if (!/^\d+$/.test(val)) {
					simple("请输入有效数量");
					v = val = parseInt(val, 10)||1;
					flag = false;
				}
				$cutBtn.removeClass('disable');
				$addBtn.removeClass('disable');
				if (val <= 1) {
					$cutBtn.addClass('disable');
				}
				if (max >= 0 && val >= max) {
					$addBtn.addClass('disable');
				}
				if (val < 1) {
					v = 1;
					flag = false;
				}
				if (max >= 0 && val > max) {
					v = max;
					simple("此商品仅剩" + max + "件");
					flag = false;
				}
				
				$input.val(v);
				this.value = v;
				this.onCheck && this.onCheck(v);
				return flag;
			}
		};
		$cutBtn.click(function () {
			if (!$(this).hasClass('disable'))
				obj.cut();
		});
		$addBtn.click(function () {
			if (!$(this).hasClass('disable'))
				obj.add();
		});
		$input.keyup(function () {
			obj.change();
		});
		obj.change();//初始化数据，按钮状态
		return obj;
	};
	
	var runLoad = function (opts) {
		var callList = [];
		var state = 'init';
		return {
			load: function (callback) {
				if (state == 'load') {
					callback && callback(this.data);
				} else if (state == 'init') {
					state = 'loading';
					callback && callList.push(callback);
					opts.fun.call(this);
				} else if (state == 'loading') {
					callback && callList.push(callback);
				}
			},
			init: function () {
				state = 'init';
			},
			done: function (data) {
				this.data = data;
				state = 'load';
				if (callList.length > 0) {
					for (var i = 0, len = callList.length; i < len ; i++) {
						callList[i](this.data);
					}
					callList = [];
				}
			}
		}
	};
	/*
	var urlHash = {
		reg: /^([^\(]*)(?:\(([^\)]*)\))?$/,
		defaultKey: 'default',
		get: function () {
			var hash = decodeURIComponent(location.hash.substr(1)) || this.defaultKey;
			var match = hash.match(this.reg);
			if (match) {
				return {
					hash: match[1],
					json: eval('('+ (match[2]||'{}') +')')
				}	
			} else {
				return {
					hash: this.defaultKey,
					json: {}
				}
			}
		}, 
		set: function (hash, json) {
			json = json || {};
			var str = '';
			var type;
			for (key in json) {
				type = typeof json[key];
				if (type == "number" || type == "string") {
					str += "," + key + ':' + (type=="number"?json[key]:('"'+json[key]+'"'));
				}
			}
			if (str) {
				location.hash = hash + '(' + encodeURIComponent('{'+ str.substr(1) +'}') + ')';
			} else {
				location.hash = hash;
			}
		}
	};
	*/
	var urlHash = {
		reg: /^([^\(]*)(?:\(([^\)]*)\))?$/,
		defaultKey: 'default',
		get: function () {
			var hash = decodeURIComponent(location.hash.substr(1)) || this.defaultKey;
			var match = hash.match(this.reg);
			if (match) {
				return {
					hash: match[1],
					json: JSON.parse(match[2]||'{}')
				}	
			} else {
				return {
					hash: this.defaultKey,
					json: {}
				}
			}
		}, 
		set: function (hash, json) {
			location.hash = hash + (json? '(' + encodeURIComponent(JSON.stringify(json)) + ')':'');
		}
	};
	
	var loadScript = function (url, callback) {
		var script = document.createElement("script") 
		script.type = "text/javascript";
		if (callback) {
			script.onload = function(){ 
				callback(); 
			};
		}
		script.src = url; 
		document.body.appendChild(script); 
	};
	
	var articleManage = (function () {
		var articleCach = {};
		var lastKey;
		var ckFun = function (callback) {
			callback&&callback();
		};
		var onFun = function () {};
		function Article (opt) {
			if (!(this instanceof Article)) {
				return new Article(opt);
			}
			this.opt = opt;
			this.$elm;
			if (opt.temple && typeof opt.temple == "string") {
				opt.temple = util.template(opt.temple);
			}
			for (var key in opt)  {
				if (key.substring(0,2) == 'on' || key.substring(0,2) == 'ck') {
					this[key] = opt[key];
				}
			}
			articleCach[opt.key] = this;
		}
		Article.prototype = {
			init: function () {
				if (this.$elm) return this;
				var opt = this.opt, key = opt.key;
				var id = (opt.id || key) + 'Article';
				if ($('#'+id).length == 0) {
					if (opt.temple) {
						this.$elm = $('<article id="'+ id + '" class="article" style="display:none">'+opt.temple({mData: articleManage.data, aData: this.data})+'</article>').appendTo('#section');
					} else {
						this.$elm = $('<article id="'+ id + '" class="article" style="display:none">'+(opt.html||"")+'</article>').appendTo('#section');		
					}
				} else {
					this.$elm = $('#'+id);
				}
				this.onInit();
				return this;
			},
			isInit: function () {
				return !!this.$elm;
			},
			show: function () {
				var self = this;
				if (!this.isInit()) {
					this.ckInit(function () {
						self.init().show();
					})
				} else {
					this.ckShow(function () {
						self.$elm.show();
						if (self.opt.headerTitle) {
							$('#headerTitle').html(self.opt.headerTitle);
							document.title = self.opt.headerTitle;
						}
						window.scrollTo(0,0);
						self.onShow();
					})
				}
			},
			hide: function () {
				var self = this;
				this.ckHide(function () {
					self.$elm && self.$elm.hide();
					self.onHide();
				});
			},
			back: function () {
				var self = this;
				this.ckBack(function () {
					self.onBack();
				});
			},
			ckInit: ckFun, ckShow: ckFun, ckHide: ckFun, ckBack: ckFun,
			onInit: onFun, onShow: onFun, onHide: onFun, 
			onBack: function () {
				history.back();
			}
		};
		return {
			data: {hashJson: {}},
			Article: Article,
			articleCach: articleCach,
			hashChange: function () {
				var obj = urlHash.get();
				articleManage.data.hashJson = obj.json;
				var key = obj.hash;
				if (articleCach[key]) {
					if (articleCach[lastKey]) articleCach[lastKey].hide();
					lastKey = key;
					articleCach[key].show();
				} else if (!lastKey) {
					location.hash = "";
				}
			},
			back: function (flag) {
				flag = flag || false;
				var hashJson = articleManage.data.hashJson;
				var _rHash = hashJson.rHash || "";
				var tab = _rHash.split("|");
				var hash = urlHash.get().hash;
				var key;
				if (tab.length > 0) {
					key = tab.pop();
					if (hashJson.backLogin == 1 && hash == "login" && flag == true) {
						key = tab.pop();
						delete articleManage.data.hashJson.backLogin;
					}
				} 
				if (tab.length == 0) {
					delete articleManage.data.hashJson.rHash;
				} else {
					articleManage.data.hashJson.rHash = tab.join('|');
				}
				if (key) {
					urlHash.set(key, articleManage.data.hashJson);
					return;
				}
				
				if (articleCach[hash]) {
					articleCach[hash].back();
					return;
				}
				history.back();
			},
			jump: function (hash, rHash) {
				if (hash) {
					rHash = rHash || urlHash.get().hash;
					var _rHash = articleManage.data.hashJson.rHash || "";
					var tab;
					if (_rHash === "") {
						tab = [];
					} else {
						tab = _rHash.split("|");
					}
					tab.push(rHash);
					articleManage.data.hashJson.rHash = tab.join("|");
					urlHash.set(hash, articleManage.data.hashJson);
				}
			},
			init: function (defaultKey) {
				if (defaultKey) {
					urlHash.defaultKey = defaultKey;
					this.defaultKey = defaultKey;
					articleCach["default"] = articleCach[defaultKey];
				}
				$(window).bind('hashchange', articleManage.hashChange);
				$('#articleManageBack').click(function () {
					articleManage.back(true);
				});
				articleManage.hashChange();
				$(document).delegate(".article-manage-link", 'click', function () {
					articleManage.jump($(this).attr('data-hash'), $(this).attr('data-rHash'));
					return false;
				});
			}
		}
	})();
	
	var loginArticle = articleManage.Article({
		key: 'login',
		headerTitle: "登录",
		html: '<div class="login-logo"></div>\
<ul class="login-menu-ul" style="display:none;">\
	<li class="login-menu-li login-menu-li-border active">\
		服务密码登录\
	</li>\
	<li class="login-menu-li login-menu-li-border" >\
		互联网密码登录\
	</li>\
</ul>\
<div class="login-tab-pane" >\
	<div class="login-tab">\
		<input type="tel" id="loginMobile" maxlength="11" placeholder="手机号码" class="login-ipt"><button class="login-account-del"><span></span></button>\
		<input type="password" id="loginPwMobile" maxlength="6"  placeholder="服务密码" class="login-ipt login-ipt-bottom">\
	</div>\
	<div class="login-tab hide">\
		<input type="text" id="loginEmail"  placeholder="互联网帐号" class="login-ipt"><button class="login-account-del"><span></span></button>\
		<input type="password" id="loginPwEmail" placeholder="登录密码" class="login-ipt login-ipt-bottom">\
	</div>\
	<div class="login-checkbox">\
		<label >\
			<input type="checkbox" checked="checked" id="loginRemember" >记住密码\
		</label>\
	</div>\
	<button class="login-btn" id="loginBtn" >登录</button>\
</div>',
		onBack: function () {
			history.back();
		},
		onInit: function () {
			var article = this; 
			article.islogin = false;
			var $box = $('.login-tab');
			$('ul').delegate('li', 'click', function () {
				var $elm = $(this);
				$elm.addClass('active').siblings('li').removeClass('active');
				var index = $elm.index();
				$box.removeClass('hide');
				$box[1-index].className = "login-tab hide";
			});

			$('#loginMobile, #loginEmail').keyup(function () {
				if (this.value == "") {
					$(this).next('.login-account-del').hide();
				} else {
					$(this).next('.login-account-del').show();
				}
			});
			$('.login-account-del').click(function () {
				$(this).hide().prev('.login-ipt').val("").focus();
			});
			var $mobile = $('#loginMobile');
			var $pwMobile = $('#loginPwMobile');
			var $email = $('#loginEmail');
			var $pwEmail = $('#loginPwEmail');
			var remember = $('#loginRemember')[0];
			var simple = notification.simple;
			var ifCk = 0;
			$('#loginBtn').click(function () {
				if (remember.checked){
					ifCk = 1;
				} else {
					ifCk = 0;
				}
				var index = $('li.active').index();
				index = 0;
				var opt;
				if (index == 0) {//mobile
					var mobile = $mobile.val(), password = $pwMobile.val();
					if (!(mobile.length == 11 && password.length == 6)) {
						simple('帐号密码格式错误');
						return false;
					}
					opt = {mobile: mobile, pwd: password, 'ifCk': ifCk, lt: 1};
				} else {
					var mobile = $email.val(), password = $pwEmail.val();
					if (!(mobile.length > 0 && password.length > 0)) {
						simple('帐号密码格式错误');
						return false;
					}
					opt = {mobile: mobile, pwd: password, 'ifCk': ifCk, lt: 0};
				}
				util.loadBox.show();
				$.post(HOME_URL + "/userCenter/login.do", opt, function(json){
					util.loadBox.hide();
					if (json.flag == 200) {
						article.islogin = true;
						var href = window.location.href;
						if (href.indexOf('/userCenter/login')!=-1) {
							window.location.replace(decodeURIComponent(_param.rurl||HOME_URL));
						} else {
							articleManage.back();
						}
					} else {
						simple('帐号密码错误')
					}
				}, 'json');
			});
		}
	});
	$('#backBtn').click(function () {
		window.history.back()
		return false;
	});
	
	var isTouchSupport = (function () {
		var support = {}, events = ['touchstart', 'touchmove', 'touchend'],
		el = document.createElement('div'), i;
		try {
			for (i = 0; i < events.length; i++) {
				var eventName = events[i];
				eventName = 'on' + eventName;
				var isSupported = (eventName in el);
				if (!isSupported) {
					el.setAttribute(eventName, 'return;');
					isSupported = typeof el[eventName] == 'function';
				}
				support[events[i]] = isSupported;
			}
			return support.touchstart && support.touchend && support.touchmove;
		} catch(err) {
			return false;
		}
	})();

	window.CLICK_TYPE = (isTouchSupport ? "tap": "click");
	/*var log = (function () {
		var $div = $("<div/>").appendTo("body");
		var slice = [].slice;
		return function (str) {
			$div.append("<div>"+slice.call(arguments).join(" ")+"</div>")
		}
	})();*/
	return {
		loadBox : loadBox,
		template: template,
		winScroll: winScroll,
		getJSONCallback: getJSONCallback,
		getParam: getParam,
		_param: _param,
		geolocation: geolocation,
		notification: notification,
		loading: loading,
		articleManage: articleManage,
		countTool: countTool,
		runLoad: runLoad,
		urlHash: urlHash,
		loadScript: loadScript,
		detect: detect,
		isTouchSupport: isTouchSupport
	}
})();