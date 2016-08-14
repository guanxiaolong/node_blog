/*****/
(function () {
	
	var LOTTERY_TXT = ["换个姿势再刮一次吧！", 
	                   "您与奖品擦肩而过！",
	                   "您长得太帅，奖品害羞了！",
	                   "错过是为了更好的相遇，继续刮吧！",
	                   "奖品未中，我心依旧！",
	                   "如果上天再给我一次机会，我一定会再刮一次！",
	                   "积累人品再刮一次!",
	                   "越刮越快乐，再刮一次！",
	                   "奖品排队中，继续刮吧！",
	                   "刮奖欢乐多，持之以恒，好运伴你行！"];
	var YES_MAP = {"1": "1", "5": "1", "10": "1", "20": "1"};
	var simple = util.notification.simple;
	var isMoApp = function () {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf("iphone") >= 0 || ua.indexOf("ipod") >= 0 || ua.indexOf("ipad") >= 0) {
			return "ios";
		} else if (ua.indexOf("moapp") >= 0) {
			return "moapp";
		}
		return false;
	};
	var go2Login = function () {
		window.location.href = "mo://27_"+Base64.encode(HOME_URL+"/redirect")+"_token,imei";
	};
	var info = (function () {
		var $dialog = $(".lottery-result-dialog");
		var $wapper = $(".lottery-box-wapper");
		var $dialogTxt = $(".lottery-result-dialog-text");
		var state = "init";
		var width = 274;
		return {
			show: function (opt, callback) {
				if (state == "init" || state == "hide") {
					state = "showing";
					opt.dir = opt.dir || "right"; 
					$dialogTxt.html(opt.html);
					$wapper[0].className = "lottery-box-wapper lottery-box-wapper-"+opt.dir;
					setTimeout(function () {
						state = "show";
						callback && callback();
					}, 1000);
				}
			},
			hide: function (callback) {
				if (state == "show") {
					state = "hideing";
					$wapper[0].className = "lottery-box-wapper";
					setTimeout(function () {
						state = "hide";
						callback && callback();
					}, 1000);
				} else if (state == "init" || state == "hide") {
					callback && callback();
				}
			}
		}
	})();
	var lottery = (function () {
		var state;
		var $sp;
	 	var _p = 40;
	 	var timeId = 0;
	 	var endTime = 20000;
		var wScratchPadOpt = {
			scratchUp: function(e, percent){
				if (percent > _p) {	
					lottery.action("end", {dir: this.lastDir});
				}
			},
			width: 274,
			height: 184,
			image: null,
			image2: '../images/scratch-area-0717.png',
			size: 25
		};
		var $blank = $('#lotteryBlankDiv');
		return {
			init: function () {
				$sp = $("#lotterySP").wScratchPad(wScratchPadOpt);
				$('#lotterySP').delegate(".scratch_quickly", CLICK_TYPE, function(e){
					if (state == "start") {
						lottery.action("end", {dir: Math.random()>0.5?"right":"left"});
					}
				});
//				$('.scratch_quickly')[CLICK_TYPE](function () {
//					if (state == "start") {
//						lottery.action("end", {dir: Math.random()>0.5?"right":"left"});
//					}
//				});
				this.action("begin");
				return this;
			},
			action: function (s, opt) {
				state = s;
				if (state == "begin") {
					$sp.wScratchPad('enabled', false);
					$blank.show();
				} else if (state == "start") {
					/*timeId = setTimeout(function () {
						lottery.action("end", {dir: Math.random()>0.5?"right":"left"});
					}, endTime);*/
					$('#scratch_quickly_id').html('<span class="scratch_quickly_span">快速刮开</span>');
					$blank.hide();
					setTimeout(function () {
						$sp.wScratchPad('enabled', true);
					}, 400);
				} else if (state == "end") {
					clearTimeout(timeId);
					$sp.wScratchPad('enabled', false);
					$('.scratch_quickly').removeClass('bounceIn').addClass('text-red');
					info.show(opt, function () {
						$('.scratch_quickly').html('');
						$sp.wScratchPad('reset');
					});
					//$sp.wScratchPad('clear');
				} else if (state == "reset") {
					$blank.show();
					info.hide();
				}
			}
		}
	})();

	var scroll = (function () {
		var $wapper;
		var num = 0;
		var sleepTime = 2000;
		var data;
		var index = 0;
		var height = 30;
		var showNum = 1;
		return {
			init: function () {
				$wapper = $('.win_info_wapper');
				$.get(HOME_URL+"/prizeInfo/all", function (json) {
					if (json.flag == 200) {
						var data = json.obj || [];
						var html = [];
						$.each(data, function () {
							html.push('<p>恭喜用户'+this.terminalId+'成功获得'+this.prizeName+'奖励</p>');
						})	
						if (data.length > showNum ) {
							num = data.length;
							index = 0;
							for (var i=0; i<showNum; i++) {
								html.push('<p>恭喜用户'+data[i].terminalId+'成功获得'+data[i].prizeName+'奖励</p>');
							}
							setTimeout(scroll.doScroll, sleepTime);
						} 
						$wapper.html(html.join(''));
					}
				}, 'json');
				return this;
			},
			doScroll: function () {
				index++;						
				$wapper.animate({
					marginTop: (-height*index+'px')
				}, 500, 'ease-out', function () {
					setTimeout(scroll.doScroll, sleepTime);
					if (index == num ) {
						index = 0;
						$wapper.hide().css('marginTop', '0px').show();
					}
				})
			}
		}
	});
	
	var bindMobile = function () {
		var confirm = util.notification.confirm("", "当前活动只允许江苏移动用户参与，请先绑定您的手机号码", function (e, type) {
				this.hide();
				if (type == false) {
					window.location.href = "mo://29";
				}
			}
		);
		$(".doBtn .cancel").html("绑定");
		$(".doBtn .ok").html("取消");
		confirm.show();
	}
	
	var lotteryCount = 10;
	var userInfo;
	var page = {
		init: function () {
			/*if (!$.cookie("hasReadRole")) {//首次登陆显示规则
				$.cookie("hasReadRole", 1, 31);
				$('#lotteryAddBtn')[0].click();
				//location.href = HOME_URL+"/mall/act-details.jsp";
			}*/
			//$.cookie('JSESSIONID', null);
			lottery.init();
			var isLotteryLoading = false;
			var isLoginLoading = false;
			var isLogin = false;
			var isBindMobile = false;
			var isSuZhouMobile = false;
			var isStart = true;
			var lastLotteryTime;
			$('#lotteryStartBtn').on('touchend', function (e) {
				e.preventDefault();
				
				$('#lotteryResult').show();
				$('#lotterySP').show();
				if (isStart == false) {
					return;
				}
				//添加等待背景
				$('#shieldIndex').css('height',window.screen.height);
				$('#shieldIndex').css('display','block');
				$('.load-img').css('display','block');
				if (true) {
					/*if (!isBindMobile) {
						bindMobile();
						$('#shieldIndex').css('display','none');
						$('.load-img').css('display','none');
						return;
					}*/
					/*
					if (isSuZhouMobile == false) {
						simple("很抱歉，此活动只允许号码归属地为江苏的移动用户参加");
						return;
					}*/
					if (lotteryCount == 0) {
						//simple("今天次数已经用光了，请查看如何增加次数");
						$('.dialog-tips').show();
						$('#shieldIndex').css('display','none');
						$('.load-img').css('display','none');
					} else if (lotteryCount > 0) {
						if (lastLotteryTime) {
							if (new Date() - lastLotteryTime <= 3000) {
								 simple("不要太心急哦~休息一会~");
								 $('#shieldIndex').css('display','none');
								 $('.load-img').css('display','none');
								 return;
							}
						}
						if (!isLotteryLoading) {
							isLotteryLoading = true;
							$.ajax({
								type: 'get',
								url: "/lottery?_="+ new Date().valueOf(),
								dataType: 'text',
								timeout: 10000,
								success: function (json, status, xhr) {
									$('#shieldIndex').css('display','none');
									$('.load-img').css('display','none');
									isLotteryLoading = false;
									lastLotteryTime = new Date();
									
									//json = {flag: 209};
									var json = JSON.parse(json)
									var flag = json.obj;
									lotteryCount--;
									var yesNo = flag;
									if (!YES_MAP[yesNo]) yesNo = 20;
									$('.count').html('<div class="scratch_quickly"></div>'+'<span id="lotteryCountTxt">今日刮奖次数:'+lotteryCount+'</span></div>');
									$('.scratch_quickly').addClass('bounceIn');
									$('.lottery-result-dialog').removeClass('lottery-notwin').addClass('lottery-win');
									$('#lotteryResult').removeClass('lottery-notwin').addClass('lottery-win').css("backgroundImage","url(/images/yes"+yesNo+".png)")
										.html('<div class="lottery-result-box"><div class="lottery-result-big">'+json.message+'</div><div class="lottery-result-small">小宇宙爆发了!</div></div>');
									$('.lottery-result-dialog-text').css("backgroundImage","url(/images/yes"+yesNo+".png)").html('恭喜您获得'+json.message+'奖励，奖品将于次月15个工作日内发放。');
									lottery.action("start");
									/*lotteryCount--;
									$('.count').addClass('text-left').html('<div class="scratch_quickly"></div>'+'<span id="lotteryCountTxt">今日刮奖次数:'+lotteryCount+'</span></div>');
									$('.scratch_quickly').addClass('bounceIn');
									var r = [(Math.random()*10+1)>>0, (Math.random()*10)>>0];
									$('.lottery-result-dialog').removeClass('lottery-win').addClass('lottery-notwin');
									$('#lotteryResult').removeClass('lottery-win').addClass('lottery-notwin').css("backgroundImage","url(/images/no"+r[0]+".png)")
										.html('<div class="lottery-result-box"><div class="lottery-result-big">'+LOTTERY_TXT[r[1]]+'</div></div>');
									$('.lottery-result-dialog-text').css("backgroundImage","url(/images/no"+r[0]+".png)").html(LOTTERY_TXT[r[1]]);
									lottery.action("start");*/
									/*if (flag == 404) {
										go2Login();
									} else if (flag == 405)	{
										simple("很抱歉，此活动只允许号码归属地为江苏的移动用户参加");
									} else if (flag == 200) {
										lotteryCount--;
										var yesNo = json.obj.replace(/\D+/, '');
										if (!YES_MAP[yesNo]) yesNo = 20;
										$('.count').html('<div class="scratch_quickly"></div>'+'<span id="lotteryCountTxt">今日刮奖次数:'+lotteryCount+'</span></div>');
										$('.scratch_quickly').addClass('bounceIn');
										$('.lottery-result-dialog').removeClass('lottery-notwin').addClass('lottery-win');
										$('#lotteryResult').removeClass('lottery-notwin').addClass('lottery-win').css("backgroundImage","url("+HOME_URL+"/images/yes"+yesNo+".png)")
														  .html('<div class="lottery-result-box"><div class="lottery-result-big">'+json.obj+'</div><div class="lottery-result-small">小宇宙爆发了!</div></div>');
										$('.lottery-result-dialog-text').css("backgroundImage","url("+HOME_URL+"/images/yes"+yesNo+".png)").html('恭喜您获得'+json.obj+'奖励，奖品将于次月15个工作日内发放。');
										lottery.action("start");
									} else if (flag == 209) {
										lotteryCount--;
										$('.count').addClass('text-left').html('<div class="scratch_quickly"></div>'+'<span id="lotteryCountTxt">今日刮奖次数:'+lotteryCount+'</span></div>');
										$('.scratch_quickly').addClass('bounceIn');
										var r = [(Math.random()*10+1)>>0, (Math.random()*10)>>0];
										$('.lottery-result-dialog').removeClass('lottery-win').addClass('lottery-notwin');
										$('#lotteryResult').removeClass('lottery-win').addClass('lottery-notwin').css("backgroundImage","url("+HOME_URL+"/images/no"+r[0]+".png)")
												.html('<div class="lottery-result-box"><div class="lottery-result-big">'+LOTTERY_TXT[r[1]]+'</div></div>');
										$('.lottery-result-dialog-text').css("backgroundImage","url("+HOME_URL+"/images/no"+r[0]+".png)").html(LOTTERY_TXT[r[1]]);
										lottery.action("start"); 
									} else if (flag == 202) {
										simple("不要太心急哦~休息一会~");
									} else if (flag == 201) {
										simple("活动未开始或者已经结束");
									} else if (flag == 500) {
										simple("刮奖异常，请稍后再试");
									} else if (flag == 411) {
										simple("建议您在浏览器设置中清空缓存后再次尝试~");
									}*/
								},
								error: function (xhr, errorType, error){
									isLotteryLoading = false;
									$('#shieldIndex').css('display','none');
									$('.load-img').css('display','none');
								}
							});
						}
					}
				} else if (isLoginLoading == true) {//登陆中
					ios_page_load(util._param.token||"", util._param.time||"");
					simple("登录中，请耐心等待...");
				} else {
					$('#shieldIndex').css('display','none');
					$('.load-img').css('display','none');
					go2Login();
				}
				return false;
			});
			$('.lottery-result-dialog-btn')[CLICK_TYPE](function () {
				lottery.action("reset");
			});

			//弹出框
			$('#lotteryAddBtn')[CLICK_TYPE](function(){
				$('.dialog-tips').show();
			});
			$('.close-now-btn,.dialog-close-btn')[CLICK_TYPE](function(){
				$('.dialog-tips').hide();
			});
			//scroll.init();
			
			var lastLoginTime, lastLoginToken;
			window.ios_page_load =  function (token, time) {
				time = time || "";
				if (time == "") {
					$.cookie("h5_login_token", token, {path: "/"});
					$.cookie("h5_login_token_time", +new Date(), {path: "/"});
				} else {
					var ctoken = $.cookie("h5_login_token");
					var ctime = $.cookie("h5_login_token_time");
					if (ctime > time) {
						token = ctoken;
					}
				}
				
				var isApp = isMoApp();
				if (isApp == false) {
					simple("请将客户端更新至最新版本");
					$('#shieldIndex').css('display','none');
					$('.load-img').css('display','none');
					return;
				}
				var urlToken = util._param.token||"";
				if (isApp == "moapp" && urlToken != token) {
					var newHref  = window.location.href.replace(/([&\?])token=[^&]+/, "$1token="+token);
					if (history.replaceState) {
						var state = {title: document.title, url: newHref};
						history.replaceState(state, document.title, newHref);
						util._param.token = token;
					} else {
						window.location.replace(newHref);
						$('#shieldIndex').css('display','none');
						$('.load-img').css('display','none');
						return;
					}
				}
				
				if (lastLoginToken == token) {
					if (new Date() - lastLoginTime <= 5000) {
						$('#shieldIndex').css('display','none');
						$('.load-img').css('display','none');
						 return;
					}
				}
				lastLoginToken = token;
				lastLoginTime = new Date();
				isLoginLoading = true;
				$.ajax({
					type: 'POST',
					url: HOME_URL+"/login?_="+ new Date().valueOf(),
					data: {sys: util._param.sys||"", token: token},
					dataType: 'json',
					timeout: 10000,
					success: function (json, status, xhr) {
						$('#shieldIndex').css('display','none');
						$('.load-img').css('display','none');
						isLoginLoading = false;
						isLogin = false;
						//json = {flag: 200, obj: {allLotteryTimes: 100, hideTerminalId: '15850116859', payedMember: true}};
						var flag = json.flag;
						if (flag == 407) {
							simple("请使用mo生活客户端访问");
						} else if (flag == 409) {
							//请绑定手机
							isLogin = true;
							bindMobile();
							$('.count').html('请绑定手机号码');
						} else if (flag == 405) {
							isLogin = true;
							isBindMobile = true;
							simple("很抱歉，此活动只允许号码归属地为江苏的移动用户参加");
							$('.count').html('此活动只允许江苏移动用户参加');
							$('#openVipBtn').hide();
						} else if (flag == 200) {
							//isSuZhouMobile = true;
							isBindMobile = true;
							isLogin = true;
							userInfo = json.obj;
							lotteryCount = userInfo.allLotteryTimes;
							$('.count').addClass('text-left').html('今日刮奖次数:<span id="lotteryCountTxt">'+lotteryCount+'</span>');
							$('#lotteryLoginTel').html(userInfo.hideTerminalId);
							var lastClickTime = '';
							$('#addCountsBtn,.go-to-addCounts')[CLICK_TYPE](function(){
								if (lastClickTime) {
									if (new Date() - lastClickTime <= 5000) {
										 simple("不要太心急哦~休息一会~");
										 return;
									}
								}
								if(isLogin == true) {
									window.location.href = "mall/addCounts.jsp?token="+userInfo.parm;
									lastClickTime = new Date();
								} else {
									go2Login();
								}
							});
							if (userInfo.payedMember) {
								$('.member_btn').remove();
								//$('.close-now-btn').css("background","#666666");
							}
						} else if (flag == 406 || flag == 404) {
						} else if (flag == 410) {
							//simple("您的账号未登录或已在其他设备上登录");
						} else if (flag == 201) {
							$('#lotteryStartBtn').css('background','#7c4e4e').css('color','#cccccc').html('活动尚未开始');
							isStart = false;
						} else {
							//simple("登录异常，稍候再试");
						}
						
						$('#addCountsBtn,.go-to-addCounts')[CLICK_TYPE](function(){
								if(isLogin != true) {
									go2Login();
								}
							});
						
						$('.record-btn')[CLICK_TYPE](function(){
							if(isLogin != true) {
								go2Login();
							} else {
								window.location.href = HOME_URL + "/record";
							}
						});
					},
					error: function (xhr, errorType, error){
						$('#shieldIndex').css('display','none');
						$('.load-img').css('display','none');
						isLoginLoading = false;
					}
				});
			};
			
			//ios_page_load(util._param.token||"", util._param.time||"");
//			$('#openVipBtn')[CLICK_TYPE](function(){
//				if (!isLogin) {
//					go2Login();
//				} else if (!isBindMobile) {
//					bindMobile();
//				} else {
//					window.location.href = "mo://9";
//				}
//			});
		}
	};
	page.init();
})();