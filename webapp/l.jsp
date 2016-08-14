<%@ page language="java" import="java.util.*, java.text.*" pageEncoding="utf-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>TestLogin.html</title>

		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="this is my page">
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<script type="text/javascript">
	function getXmlHttpRequest() {
		var xmlHttpRequest = null;
		if ((typeof XMLHttpRequest) != 'undefined') {
			xmlHttpRequest = new XMLHttpRequest();
		} else {
			xmlHttpRequest = new ActiveXObject('Microsoft.XMLHttp');
		}
		return xmlHttpRequest;
	}
	function f1() {
		var deviceId = document.getElementById("deviceId").value;
		var terminalId = document.getElementById("terminalId").value;
		var userLevel = document.getElementById("userLevel").value;
		var userArea = document.getElementById("userArea").value;
		var url = "${HOME_URL}/loginTest?deviceId="
				+ deviceId + "&&terminalId=" + terminalId + "&&userLevel="
				+ userLevel + "&&userArea=" + userArea;

		var xmlReq = getXmlHttpRequest();
		var url = url;
		xmlReq.open("post", url, true);
		xmlReq.setRequestHeader("Content-Type",
				"application/x-www-form-urlencoded");
		xmlReq.onreadystatechange = function() {
			if (xmlReq.readyState == 4) {
				//qq:qqme:qq2
				res = xmlReq.responseText;
				alert(res);
			}
		};
		xmlReq.send("product=value");
	}
</script>
	</head>
	<body>

		设备编号:
		<input type="text" style="height: 25px; width: 150px"
			value="0000-0000-0000" id="deviceId">
		<br>
		手机号码:
		<input type="text" style="height: 25px; width: 150px"
			value="15151508537" id="terminalId">
		<br>
		用户等级:
		<select style="height: 25px; width: 150px" id="userLevel">
			<option value="540001">
				免费
			</option>
			<option value="540002">
				3元/月
			</option>
			<option value="540003">
				5元/月
			</option>
			<option value="540004">
				10元/月
			</option>
			<option value="360001" selected>
				30元包年
			</option>
		</select>
		<br>

		用户区域:
		<select style="height: 25px; width: 150px" id="userArea">
			<option value="江苏省">
				江苏省
			</option>
			<option value="苏州市">
				苏州市
			</option>
			<option value="苏州市辖区">
				苏州市辖区
			</option>
		</select>
		<br>
		<br>
		<input type="button" value="提交" onclick="f1()";
>
	</body>
</html>
