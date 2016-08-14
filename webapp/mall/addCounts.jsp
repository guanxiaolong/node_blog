<%@ page language="java" import="java.util.*, java.text.*" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
	<head>
		<%@include file="../base/base.jsp" %>
		<title>增加次数</title>
		<style type="text/css">
			body{
				background: #F5EDE1;
			}
			.clearfix:after {
				content: ".";
				display: block;
				height: 0;
				clear: both;
				visibility: hidden;
			}
			.addCounts-section {
				max-width: 520px;
				min-width: 300px;
				margin: 0 auto;
				position: relative;
			}
			.addCounts-share {
				padding: 20px 10px 20px 10px;
				margin: 10px 0;
				background-color: #FFF;
			}
			.addCounts-info {
				width: 74%;
				float: left;
				text-align: left;
			}
			.addCounts-btn {
				float: right;
				font-size: 14px;
				color: #FFF;
				width: 70px;
				height: 30px;
				line-height: 30px;
				text-align: center;
				border-radius: 2px;
				cursor: pointer;
				background-color: #44BFE1;
			}
			.addCounts-btn:active {
				background-color: #F3B294;
			}
			.addCounts-change {
				padding:10px;
				background-color: #FFF;
			}
			.addCounts-change p {
				text-align: left;
			}
			.addCounts-change-tt {
				float: left;
				width:40px;
				height: 40px;
				padding:10px;
				margin-right: 10px;
				background-color: #DB4822;
				color: #FFF;
			}
			.addCounts-change-info {
				width: 50%;
				line-height:62px;
				float: left;
				text-align: left;
			}
			.addCounts-change-info b {
				color:#DA461F;
			}
			.addCounts-cuur-coin {
				padding-bottom:10px;
				border-bottom: 1px solid #E7E7E7;
				line-height: 20px;
			}
			.addCounts-cuur-coin b{
				float:left;
				font-size: 16px;
				margin-right: 20px;
				color:#E45927;
			}
			.get-cur-counts {
				float: left;
				height:20px;
				line-height:20px;
				display: block;
			}
			.icon-refresh {
				float:right;
				width:18px;
				height: 18px;
				background: url("../images/icon-refresh.png") no-repeat center;
				background-size:100%;
				display: block;
			}
			.addCounts-change > div {
				margin:10px 0;
			}
			.check-account-btn {
				height:35px;
				width:100%;
				line-height:35px;
				display:block;
				color: #FFFFFF;
				text-decoration: none;
				cursor: pointer;
				font-size: 14px;
				background: url("../images/check-account-icon.png") no-repeat left #ED9127;
				background-position: 32%;
				background-size: 38px;
			}
			.addCounts-change-btn {
				position: absolute;
				right:0;
				top:50%;
				margin-top:-15px;
				background-color: #ED9127;
				box-shadow: 0px 2px 1px #A05B23;
			}
			.addcounts-p {
				line-height: 60px;
				color:#E55927;
			}
			.disabled {
				background-color:#ABAAAA;
			}
			.disabled:active {
				background-color:#ABAAAA;
			}
			/***dialog**/
			#lotteryDialog {
				display: none; 
				position: absolute;
				top: 10%;
				left: 50%;
				margin-left: -150px;
				width: 300px;
				background-color: #FFF;
				border-radius: 4px;
				text-align: center;
				border:1px solid #CCC;
				z-index:101;
			/* 	margin-top: 50px; */
			}
			.lottery-dialog-closeico {
				display: block;
				width: 30px;
				height: 30px;
				background: url("../images/dialog-close-btn.png") no-repeat center;
				background-size: 20px;
				position: absolute;
				top: 0;
				right: 10px;
			}
			.lottery-dialog-prompt {
				padding:30px 20px 10px 20px;
				border-bottom: 1px solid #D2D2D2;
				color: #E55927;
				text-align: center;
			}
			.lottery-dialog-btn {
				padding: 10px;
			}
			.lottery-dialog-btn button {
				border: none;
				background-color: #2ECCF4;
				color: #FFF;
				border-radius: 4px;
				padding: 0 16px;
				height: 26px;
				margin: 0 10px;
			}
			.lottery-dialog-btn button {
				border: none;
				background-color: #2ECCF4;
				color: #FFF;
				border-radius: 4px;
				padding: 0 16px;
				height: 30px;
				margin: 0 10px;
				width: 70px;
			}
			.lottery-dialog-btn button.lottery-dialog-active {
				background-color: #E5E5E5;
				color: #706F6F;
			}
			
			#lotteryDialog1 {
				display: none; 
				position: absolute;
				top: 10%;
				left: 50%;
				margin-left: -150px;
				width: 300px;
				background-color: #FFF;
				border-radius: 4px;
				text-align: center;
				border:1px solid #CCC;
				z-index:101;
				/* margin-top: 50px; */
			}
			.lottery-dialog-closeico1 {
				display: block;
				width: 30px;
				height: 30px;
				background: url("../images/dialog-close-btn.png") no-repeat center;
				background-size: 20px;
				position: absolute;
				top: 0;
				right: 10px;
			}
			.lottery-dialog-prompt1 {
				padding:30px 20px 10px 20px;
				border-bottom: 1px solid #D2D2D2;
				color: #E55927;
				text-align: center;
			}
			.lottery-dialog-btn1 {
				padding: 10px;
			}
			.lottery-dialog-btn1 button {
				border: none;
				background-color: #2ECCF4;
				color: #FFF;
				border-radius: 4px;
				padding: 0 16px;
				height: 26px;
				margin: 0 10px;
			}
			.lottery-dialog-btn1 button.lottery-dialog-active1 button.lottery-confirm-btn1 {
				background-color: #E5E5E5;
				color: #706F6F;
				width: 70px;
				height: 30px;
			}
			.addCounts-btn-prompt {
				display: none;
				position: absolute;
				top: 10%;
				left: 50%;
				margin-left: -150px;
				width: 300px;
				background-color: #FFF;
				border-radius: 4px;
				text-align: center;
				border: 1px solid #CCC;
				z-index: 101;
			}
			.addCounts-btn-prompt span {
				padding: 30px 20px 10px 20px;
				border-bottom: 1px solid #D2D2D2;
				color: #E55927;
				text-align: center;
				display: block;
			}
			.addCounts-btn-close {
				padding: 10px;
			}
			.addCounts-btn-close button {
				border: none;
				background-color: #2ECCF4;
				color: #FFF; 
				border-radius: 4px;
				padding: 0 16px;
				height: 30px;
				width: 70px;
				margin: 0 auto;
				display: block;
			}
			.addCounts-img {
				background: none;
				height: 70px;
				width: 70px;
				top: -30px;
				position: relative;
				left: 10px;
			}
			.addCounts-share-img {
				padding: 20px 10px 0px 10px;
				margin: 10px 0 0 0;
				height: 55px;
			}
			.loading {
			    border-radius: 100%;
			    box-shadow: 0 -10px 0 1px #333, 10px 0 #333, 0 10px #333, -10px 0 #333, -7px -7px 0 0.5px #333, 7px -7px 0 1.5px #333, 7px 7px #333, -7px 7px #333;
			    height: 3px;
			    width: 3px;
			}
			.spin {
			    -webkit-transform: rotate(360deg);
			    -webkit-animation: spin 1s linear infinite; 
			}
			@-webkit-keyframes spin {
			    from {-webkit-transform: rotate(0deg);}
			      to {-webkit-transform: rotate(360deg);}
			}
			.spin {
			    transform: rotate(360deg);
			    animation: spin 1s linear infinite;
			}
			@keyframes spin {
			    from {transform: rotate(0deg);}
			      to {transform: rotate(360deg);}
			}
			.xuan-z {
				margin: 0px 0 0 80%;
				display: block;
				position: absolute;
				top: 25%;
			}
			
			.shield-class{
				display: none;
				position: absolute; 
				left: 0px; 
				top: -10px;
				width: 100%;
				text-align: center; 
				z-index: 100; 
				opacity: 0.5; 
				background: rgb(51, 51, 51);
			}
			.load-img {
				display :none;
				width: 40%;
				position: absolute;
				top: 10%;
				left: 30%;
				z-index: 100;
			}
		</style>
	</head>
	<body>
		<div id="page">
			<section class="addCounts-section">
				<div class="addCounts-share addCounts-share-img clearfix">
					<div class="addCounts-info">将客户端成功分享至微博、微信每日即可额外获赠3次刮奖次数</div>
					<div class="addCounts-btn" id="shareBtn" style="display:none">已分享</div>
					<img src="../images/fx.png" class="addCounts-img" id="shareImg" style="display:none">
				</div>
				<div class="addCounts-btn-prompt">
					<span>点击客户端右上角分享按钮将客户端分享至微信微博等平台即可获赠3次刮奖次数（每日仅可参与一次）
					<br>获赠次数仅为今日有效，且存在数分钟延时，请耐心等待。
					</span>
					<div class="addCounts-btn-close"><button>確定</button></div>
				</div>
				<div class="addCounts-share clearfix">
					<img class="load-img" src="../images/loading.gif"></img>
					<div class="addCounts-info">开通收费会员即可每日获赠10次刮奖次数，开通会员的客户次月赠送10M流量</div>
					<div class="addCounts-btn" id="addOpenVipBtn" >立即开通</div>
				</div>
				<div class="addCounts-change">
					<p class="addCounts-cuur-coin clearfix"><b>积分兑换</b><span class="get-cur-counts"></span><span class="xuan-z"></span><i class="icon-refresh"></i></p>
					<div class="clearfix">
						<div class="addCounts-change-tt">1次刮<br>奖机会</div>
						<div class="addCounts-change-info">兑换所需：<b>７</b>积分</div>
						<div class="addCounts-btn addCounts-change-btn" id="integralChange" data-type="1">立即兑换</div>
					</div>
					<div class="clearfix">
						<div class="addCounts-change-tt">10次刮<br>奖机会</div>
						<div class="addCounts-change-info">兑换所需：<b>66</b>积分</div>
						<div class="addCounts-btn addCounts-change-btn" id="mallCoinChange" data-type="2">立即兑换</div>
					</div>
				</div>
				<p class="addcounts-p">更多兑换方式，敬请期待>></p>
				<a class="check-account-btn" id="check_account_id"><i class="check-account-icon"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;积分专区>></a>
			</section>
			<div id="lotteryDialog">
				<div class="lottery-dialog-prompt"></div>
				<div class="lottery-dialog-btn"><button class="lottery-dialog-active">取消</button><button class="lottery-confirm-btn">兑换</button></div>
			</div>
			<div id="lotteryDialog1">
				<div class="lottery-dialog-prompt1"></div>
				<div class="lottery-dialog-btn1"><button class="lottery-dialog-active1"></button><button class="lottery-confirm-btn1"></button></div>
			</div>
			<div id="shield" class="shield-class"></div>
		</div>
	</body>
	<script type="text/javascript" src="${HOME_URL}/js/zepto.min.js"></script>
	<script type="text/javascript" src="${HOME_URL}/js/util.js"></script>
	<script type="text/javascript" src="${HOME_URL}/js/base64.js"></script>
	<script><!--
		(function(){
			var isLogin = false;
			var simple = util.notification.simple;
			var go2Login = function () {
				window.location.href = "mo://27_"+Base64.encode(HOME_URL+"/redirect")+"_token,imei";
			};
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
			};
			var freshAmount = function(){
				$(".xuan-z").addClass('spin loading');
				$.get('${HOME_URL}/showJF',function(json){
					var dataJF = json.amount;
					var flag = json.flag;
					if(flag == 409) {
						go2Login();
					} else if(flag == 404) {
						$('.get-cur-counts').html('当前积分：加载失败...');
					} else if(flag == 200) {
						$('.get-cur-counts').html('当前积分：'+dataJF);
					}
				},'json');
				$(".xuan-z").removeClass('spin loading');
			};
			var isShare = function(){
				var tokenCode = util._param.token;
				$.post('${HOME_URL}/login',{sys: util._param.sys||"", token: tokenCode},function(json){
					var parm = json.obj.parm;
					var flag = json.flag;
					var isBindMobile = false;
					if (flag == 407) {
						simple("请使用mo生活客户端访问");
					} else if (flag == 409) {
						//请绑定手机
						isLogin = true;
						bindMobile();
					} else if (flag == 405) {
						isLogin = true;
						isBindMobile = true;
						simple("很抱歉，此活动只允许号码归属地为江苏的移动用户参加");
						$('.count').html('此活动只允许江苏移动用户参加');
						$('#openVipBtn').hide();
					} else if (flag == 200) {
						//simple("login登陆成功");
						isLogin = true;
					} else if (flag == 406 || flag == 404) {
					} else if (flag == 410) {
						simple("您的账号未登录或已在其他设备上登录");
					} else if (flag == 201) {
					} else {
						//simple("登录异常，稍候再试");
					}
					var isPayMember = json.obj.payedMember;

					if(isPayMember) {
						$('#addOpenVipBtn').addClass("disabled").html("已开通");
						$('#addOpenVipBtn').disabled = true;
					} else {
						$('#addOpenVipBtn')[CLICK_TYPE](function(){
							if (!isLogin) {
								go2Login();
							} else if (isBindMobile) {
								bindMobile();
							} else {
								window.location.href = "mo://9";
							}
						});
					}
					
					var terminalId = json.obj.terminalId;
					
					$.get('${HOME_URL}/shareButton',{terminalId: terminalId},function(json){
						if (json.flag == 'TRUE' ){
                              $( '#shareBtn' ).addClass("disabled" ).html( "已分享");
                              $('#shareBtn').css('display', 'block');
                              $( '#shareBtn' ).disabled = true ;
                        } else {
                        	  $( '#shareImg' ).css("display","block");
                              $( '#shareImg' )[CLICK_TYPE]( function(){
                              		$('#shield').css('height',window.screen.height);
									$('#shield').css('display','block');
                                    $( ".addCounts-btn-prompt" ).css("display" ,"block" );
                              });
                        }
                        
                        $('.addCounts-btn-close')[CLICK_TYPE](function(){
                        	$('#shield').css('display','none');
							$(".addCounts-btn-prompt").css("display","none");
						});
						
					},'json');
				},'json');
			};
			var page = {
				init : function() {
					//开通会员、分享次数
					isShare();
					var type, dataType;
					$('.addCounts-change-btn')[CLICK_TYPE](function(){
						type = $(this).attr("data-type");
						if (type == 1) {
							$('#lotteryDialog').show();
							$('.lottery-dialog-prompt').html('是否确认花费7积分兑换1次刮奖机<br>&nbsp;&nbsp;&nbsp;会？(兑换成功的刮奖次数当日有效，<br>请及时使用)');
							$('.lottery-dialog-active,.lottery-dialog-closeico')[CLICK_TYPE](function(){
								$('#lotteryDialog').hide();
								$('#shield').css('display','none');
							});
							$('#shield').css('height',window.screen.height);
							$('#shield').css('display','block');
							dataType = '1';
						} else if(type == 2) {
							$('#lotteryDialog').show();
							$('.lottery-dialog-prompt').html('是否确认花费66积分兑换10次刮奖机<br>会？(兑换成功的刮奖次数当日有效，<br>请及时使用)');
							$('.lottery-dialog-active,.lottery-dialog-closeico')[CLICK_TYPE](function(){
								$('#lotteryDialog').hide();
								$('#shield').css('display','none');
							});
							$('#shield').css('height',window.screen.height);
							$('#shield').css('display','block');
							dataType = '2';
						}
						if (isLogin) {
							$('#lotteryDialog').show();
							/* if (!isExchange) {
								submitBtn(type);
								isExchange = true;
							} */
						} else {
							go2Login();
						}
					});
					
					$('.lottery-confirm-btn')[CLICK_TYPE](function(){
						$('#lotteryDialog').hide();
						var pram = {exchangeType: dataType, payMethod: "1"}; 
						$('.load-img').css('display','block');
						$.post("../exchange",pram,function(json){
							//console.log(json);
							var flag = json.flag;
							if (flag == 404) {
								go2Login();
							} else if (flag == 405)	{
								simple("很抱歉，此活动只允许号码归属地为江苏的移动用户参加");
							} else if (flag == 200) {
								$('#lotteryDialog1').show();
								$('#shield').css('height',window.screen.height);
								$('#shield').css('display','block');
								$('.lottery-dialog-prompt1').html('刮奖次数兑换成功，请及时使用！<br>(刮奖次数当日有效，次日重置)');
								$('.lottery-dialog-active1').html('继续兑换')[CLICK_TYPE](function(){
									
									$('#shield').css('height',window.screen.height);
									$('#shield').css('display','none');
									$('#lotteryDialog1').hide();
									freshAmount();
								});
								$('.lottery-confirm-btn1').html('前往刮奖');
								$('.lottery-confirm-btn1')[CLICK_TYPE](function() {
									window.location.href='../index1.html?token=' + util._param.token;
								});
							}  else if (flag == 303) {
								simple("您的余额不足，兑换失败");
							} else if (flag == 411) {
								simple("建议您在浏览器设置中清空缓存后再次尝试~");
							} else if (flag == 500) {
								simple("兑换超时，请重试尝试");
							} else {
							
							}
							if(flag != 200){
								$('#shield').css('display','none');
							}
							$('.load-img').css('display','none');
						},'json');
					});
					
					freshAmount();
					$('.icon-refresh')[CLICK_TYPE](function(){
						freshAmount();
					});
					
					$('.lottery-dialog-closeico').on(CLICK_TYPE, function (e) {
						e.preventDefault();
						$('#lotteryDialog').hide();
						$('#shield').css('display','none');
					});
					
					$('.lottery-dialog-closeico1').on(CLICK_TYPE, function (e) {
						e.preventDefault();
						$('#lotteryDialog1').hide();
						$('#shield').css('display','none');
					});
					var ua = navigator.userAgent.toLowerCase();
					$('#check_account_id')[CLICK_TYPE](function(){
					if (ua.indexOf("iphone") >= 0 || ua.indexOf("ipod") >= 0 || ua.indexOf("ipad") >= 0) {
						util.notification.simple("暂未开放");
					} else if (ua.indexOf("moapp") >= 0) {
						window.location.href = "mo://30";
					}
					});
				}
			};
			page.init();
		})();
	--></script>
</html>