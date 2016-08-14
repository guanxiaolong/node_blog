<%@ page language="java" import="java.util.*, java.text.*" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
	<head>
		<%@include file="./base/base.jsp" %>
		<style>	
			body {
				background: url('images/scratch-bg-20140716.png') no-repeat top scroll #D94621;
				background-size:100% 100%;
			}
			.home-header {
				max-width: 520px;
				min-width: 300px;
				margin:0 auto;
			}			
			.c-float-popWrap .c-float-modePop .content {
    			color: white;
			}
			.clearfix:after {
				content: ".";
				display: block;
				height: 0;
				clear: both;
				visibility: hidden;
			}
			.add_roles {
				height: 70px;
			}
			.phone-num {
				text-align: left;
				position: absolute;
				left: 10px;
				bottom: 10px;
			}
			.record-btn {	
				line-height:40px;
				color:#FFF;
				position: absolute;
				top:0;
				right: 15px;
			}
			.login-info {
				display: block;
				width: 75%;
				overflow: hidden;
				height: 40px;
				margin: 0 auto;
			}
						
			.start_btn a {
				display: block;
				line-height: 40px;
				font-size: 24px;
				color:#FFF;
				padding: 8px;
				background-color:#F5AA2E;
				border-radius: 40px;
				box-shadow: 1px 4px 0px #A05B23;
			}
			.home-s-btn {
				background-color: #F5AA32;
				color: #FFF;
				border-radius: 2px;
				box-shadow: 0px 2px 0px #A05B23;
			}
			.role-detail-btn {	
				background-color:#ED6E2F;
			}
			.confirm-share-btn {
				margin: 0 34px;
				background-color: #ED6E2F;
			}
			.dialog-close-btn {
				width:20px;
				height: 20px;
				position: absolute;
				top:10px;
				right:10px;
				background:url("images/dialog-close-btn.png") no-repeat center;
				background-size:100%;
			}
			.dialog-tips {
				background-color:#FFF;
			}
			.dialog-tips p {
				color:#4E4D4E;
				font-weight: normal;
			}
		</style>
		<title>刮刮乐</title>
		<script>
			//加入时间戳
			(function () {
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
				var urlToken = _param.token||"";
				var time = _param.time||"";
				if (time == "" && urlToken != "") {
					time = +new Date();
					var newHref  = window.location.href + "&time=" + time;
					if (history.replaceState) {
						var state = {title: document.title, url: newHref};
						history.replaceState(state, document.title, newHref);
					} else {
						window.location.replace(newHref);
					}
				}
			})();
		</script>
	</head>
	<body>
		<div class="home-header" id="page">
			<div class="page_inner">
				<header>
					<div class="scratch_title">
						<div class="win_info">
							<div class="win_info_wapper"></div>
						</div>
					</div>
				</header>
				<section id="scratch_section">
					<div class="scratch_box">
						<div class="dialog-tips win" style="margin-top:100px;display: none;">
							<div class=""><span>您的当日刮奖次数已消耗完毕，请通过以下方式增加刮奖次数。</span><i class="dialog-close-btn"></i></div>
							<div>
								<p>1.开通收费会员每日刮奖次数增加为<b>10</b>次(24小时内生效)</p>
								<p>2.成功将客户端分享至微博微信即可获得额外<b>3</b>次刮奖次数(每日一次)</p>
								<p>3.使用移动积分及商城币兑换次数(限当天使用)。</p>
							</div>	
							<div class="close_p">
								<a href="javascript:;" class="close_btn tips_btn close-now-btn">关闭</a>
								<a href="javascript:;" class="close_btn tips_btn go-to-addCounts">查看</a>
							</div>
						</div>
						<div class="scratch-banner"><img src="images/scratch-banner-0716.png" ></div>
						
						<div class="scratch-area">
							<div class="lottery-box">
								<div class="lottery-box-wapper">
									<div class="lottery-box-div lottery-result-dialog lottery-win">
										<p class="lottery-result-dialog-text"></p>
										<%-- <a href="javascript:;" class="confirm confirm-share-btn">分享给好友</a> --%>
										<a href="javascript:;" class="confirm lottery-result-dialog-btn">再刮一次</a>
									</div>
									<div class="lottery-box-div lottery-action-box">
										<div id="lotteryResult" class="lottery-result" style="display:none"></div>
										<div id="lotterySP" class="lottery-action-div" style="display:none">
											<div id="scratch_quickly_id" class="scratch_quickly" style="z-index:100;"></div>
										</div>
										<div id="lotteryBlankDiv" class="lottery-action-div">
											<div class="start_btn"><a href="javascript:;"  class="corner corner_btn corner-btn-shadow corner_btn_bgcolor notStartYet "  id="lotteryStartBtn">开始刮奖</a></div>
										</div>
									</div>
									<div class="lottery-box-div lottery-result-dialog lottery-win" >
										<p class="lottery-result-dialog-text"></p>
										<%-- <a href="javascript:;" class="confirm confirm-share-btn" >分享给好友</a> --%>
										<a href="javascript:;" class="confirm lottery-result-dialog-btn" >再刮一次</a>
									</div>
								</div>
							</div>
							<div class="add_roles">
								<span class="phone-num" id="lotteryLoginTel" ></span>
								<!-- <a href="javascript:;" class="corner corner_btn corner-btn-shadow  corner_btn_bgcolor" id="lotteryAddBtn" >增加次数</a> -->
								<a href="${HOME_URL}/mall/act-details.jsp" id="lotteryDetail"class="home-s-btn role-detail-btn">规则详情</a>
								<a href="javascript:;" class="home-s-btn add-counts-btn"  id="addCountsBtn">增加次数</a>
							</div>
						</div>
						<div class="user_info">
							<div><span class="count login-info">您尚未登录</span><a href="${HOME_URL}/record" class="record-btn" >中奖记录></a></div>
						</div>
						<div class="scratch-banner"><img src="images/lottery-bottom-ad.png" ></div>
					</div>
				</section>
			</div>
		</div>
	</body>
	<script type="text/javascript" src="${HOME_URL}/js/zepto.min.js?20140507"></script>
	<script type="text/javascript" src="${HOME_URL}/js/util.js?20140408"></script>
	<script type="text/javascript" src="${HOME_URL}/js/wScratchPad.js?20140410"></script>
	<script type="text/javascript" src="${HOME_URL}/js/base64.js"></script>
	<script type="text/javascript" src="${HOME_URL}/js/lottery.js?2014052601"></script>
	<%--
		200 成功
		407 没有设备号码             请使用手机客户端登录
		408 Token == ""     登录异常，稍候再试
		409 没有手机号码             mo://
		405 用户手机号码不在本次活动范围内  很抱歉，当前活动只允许号码归属地为江苏的移动用户参加
		406 登出
		404 未登陆
		303 错误,500 异常     登录异常，稍候再试
		209 未中奖
		202 两次抽奖时间间隔不足*秒
		201 活动未开始或者已经结束
		
		<a href="javascript:;" class="member_btn tips_btn" id="openVipBtn">开通会员</a>
	--%>
</html>