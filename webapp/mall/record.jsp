<%@page language="java" import="java.util.*, java.text.*" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
	<head>
		<%@include file="../base/base.jsp" %>
		<title>中奖记录</title>
		<style type="text/css">
			body{
				background:#ED6E2F;
			}
			ul,li {
				list-style: none;
			}
			.record-list-title {
				width:90%;
				border: 1px solid #B12F25;
				margin: 0 auto;
				z-index: 999;
				margin-bottom:30px;
			}
			.record-list-title span {
				float: left;
				width:33%;
				color:#FFF;
				text-align: center;
				height: 30px;
				line-height: 30px;
				border-left: 1px solid #B12F25;
			}
			.record-list-title span:first-child {
				border:none;
			}
			.record-list-title div {
				border-top:1px solid #B12F25;
			}
			.record-list-title div:first-child {
				background-color: #AB2C25;
				border:none;
			}
			.home-header {
				max-width: 520px;
				min-width: 300px;
				margin:0 auto;
			}
			.record_tbl th, .record_tbl td {
				width:17%;
			}
			.ownrecord {
				background-color:#D94621;
			}
			.ownrecord::after {
				content: " ";
				width: 100%;
				height: 50px;
				background: url("images/record-top-bg-back.png") no-repeat top;
				background-size: 100%;
				z-index: 0;
				position: absolute;
				bottom: -30px;
				left: 0;
				background-color: #ED6E2F;
			}
			.top-slider-btn {
				position:absolute;
				top:55%;
				margin-top:-20px;
				display:block;
				width:16px;
				height:40px;
				background-repeat: no-repeat;
				background-size:100%;
				background-position: center;
				z-index: 1000;
			}
			.record-prev {
				left:0;
				background-image: url("images/record-btn-prev.png");
			}
			.record-next {
				right:0;
				background-image: url("images/record-btn-next.png");
			}
			.win_info_wapper li {
				padding-left:24px;
				color:#FFF;
			}
			.win_info_wapper li {
				background: url("images/broadcast-ico.png") no-repeat;
				background-size: 20px;
				background-position: 5px 5px;
				padding: 0 30px;
				color: #FFF;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
				overflow: hidden;
				height: 30px;
			}
			
		</style>
	</head>
	<body>
		<div class="home-header" id="page">
				<section class="record-section">
					<div class="ownrecord">
						<h3 class="title corner_btn corner_btn_bgcolor">尊敬的客户，您的中奖记录如下</h3>	
						<div class="own_list list" id="ownRecordList">
							<div class="record-list-title">
								
								
							</div>
						</div>
						<div class="good-detail-indicator good-indicator clear">
							<span></span>
							<span></span>
							<span></span>
						</div>
						<span class="top-slider-btn record-prev touchslider-prev" id="record-prev" data-order="-1"></span>
						<span class="top-slider-btn record-next touchslider-next" id="record-next" data-order="1"></span>
					</div>
				</section>
				<section class="record-section">
					<div class="haswin">
						<div class="haswin_list list" style="height:295px;">
							<!-- <h3 class="title corner_btn corner_btn_bgcolor">已中奖客户名单公布</h3> -->
							<div class="haswin_list-son" >
								<ul class="win_info_wapper"></ul>
							</div>
						</div>
					</div>
				</section>
		</div>
	</body>
	<script type="text/javascript" src="${HOME_URL}/js/zepto.min.js?20140507"></script>
<script type="text/javascript" src="${HOME_URL}/js/touchslider.js"></script>
	<script type="text/javascript" src="${HOME_URL}/js/util.js"></script>
	<script type="text/jstmp" id="sliderTmp">
<div class="clearfix"><span>中奖时间</span><span>奖品</span><span>奖励发放</span></div>	
	<@
		var data = data;
		var len = data.length;
		for(var i = 0;i < len;i++){
			var item = data[i];
	@>		
		
		<div class="clearfix">
			<span><@=item.prizeDate@></span>
			<span><@=item.prizeName@></span>
			<span>次月发放</span>
		</div>
	<@	
		}
	@>
	</script>
	<script>
		var scroll = (function () {
			var $wapper;
			var num = 0;
			var sleepTime = 2000;
			var data;
			var index = 0;
			var height = 30;
			var showNum = 10;
			
			var slider = function (id, selector, auto) {
				var $menus = $(selector), nowIndex = 0;
				var slider =  new TouchSlider(id,{
					auto: auto,
					fx: 'ease-out',
					direction: 'left',
					speed: 600,
					next: ".touchslider-next", // next 样式指定
					prev: ".touchslider-prev", // prev 样式指定
					timeout: 3000,
					mouseDrag:true, 
					mouseWheel:false,
					before: function(index) {
						$menus[nowIndex].className = '';
						$menus[index].className = 'active';
						nowIndex = index;
					}
				});
				$menus.on(CLICK_TYPE, function () {
					slider.slide($(this).index());
					return false;
				});
			};
			slider('ownRecordList', ".good-detail-indicator span",false);
			return {
				all: function(order){
					$all = $('.record-list-title');
					var sliderTmp = util.template($('#sliderTmp').html());
					$.post("${HOME_URL}/prizeInfo/user",{ pageNum : order },function (json) {
						var data = json.obj;
						if(data.length== 0){
							util.notification.simple("您尚未有中奖记录");
						}
						if(data.length < 9 ){
							$('.record-next').css("display","none");
							$('.record-prev').css("display","none");
							$all.append(sliderTmp({data: data}));
						}
						else{
							$('.record-prev').css("display","none");
							$all.append(sliderTmp({data: data}));
						}
					}, 'json');
				},
				init: function () {
					var oscorder = $('.record-next').attr("data-order");
					var ascorder = $('.record-prev').attr("data-order");
					$all = $('.record-list-title');
					$('#record-next').on(CLICK_TYPE,function(){
						$('.record-prev').css("display","block");
						$(".record-list-title").html("");
						oscorder++;
						var sliderTmp = util.template($('#sliderTmp').html());
						$.post("${HOME_URL}/prizeInfo/user",{ pageNum : oscorder },function (json) {
							var data = json.obj;
							if(data.length > 0 && data.length < 8){
								$all.append(sliderTmp({data: data}));
								$('.record-next').css("display","none");
							}else{
								$all.append(sliderTmp({data: data}));
							}
						}, 'json');
					});
					$('#record-prev').on(CLICK_TYPE,function(){
						$('.record-next').css("display","block");
						$(".record-list-title").html("");
						oscorder--;
						var sliderTmp = util.template($('#sliderTmp').html());
						if(oscorder==1){
							$('.record-prev').css("display","none");
						}
						$.post("${HOME_URL}/prizeInfo/user",{ pageNum : oscorder },function (json) {
							var data = json.obj;
							if(data.length > 0 && data.length < 8){
								$('.record-prev').css("display","none");
								$all.append(sliderTmp({data: data}));
							}else{
								$all.append(sliderTmp({data: data}));
							}
						}, 'json');
					});
					scroll.all(1);
					$wapper = $('.win_info_wapper');
					$.post("${HOME_URL}/prizeInfo/all",function (json) {
						if (json.flag == 200) {
							var data = json.obj || [];
							var html = [];
							html.push('<li>恭喜客户151****9256成功获得500元话费奖励</li>');
							$.each(data, function () {
								html.push('<li>恭喜客户'+this.terminalId.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')+'成功获得'+this.prizeName+'奖励</li>');
							});	
							if (data.length > showNum ) {
								num = data.length;
								index = 0;
								for (var i=0; i<showNum; i++) {
									html.push('<li>恭喜客户'+data[i].terminalId.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')+'成功获得'+data[i].prizeName+'奖励</li>');
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
		})();
		scroll.init();
	</script>
</html>