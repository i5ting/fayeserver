fayeserver
==========

faye server for nodejs

## 安装

在终端里输入

	git clone https://github.com/i5ting/fayeserver.git
	npm install
	npm start
	
默认端口是`4567`，如果需要，请修改`index.js`文件。


	npm run publish	
	
## 用法

在网页里

```
<script type="text/javascript" 
        src="http://at35.com:4567/faye/client.js">
        </script>
<script type="text/javascript">
  var client = new Faye.Client('http://at35.com:4567/faye', {
  	timeout : 120,
		retry		: 5
	});
	
	var subscription = client.subscribe('/foo', function(message) {
	  // handle message
		console.log(message);
	});
	
	setTimeout(function(){
		var publication = client.publish('/foo', {text: 'Hi there, foo test'});

		publication.then(function() {
		  alert('Message received by server!');
		}, function(error) {
		  alert('There was a problem: ' + error.message);
		});
		
	},2000);
</script>
```

说明

- `/foo`是需要订阅的主题
- subscribe是订阅（浏览器端订阅主题，当其他地方发布一样的主题的时候，回调里的message会收到信息的）
- publish是发布（浏览器发布主题，服务器端其实也可以发布的，暂未提供，见todo）

如果访问不了 `http://at35.com:4567/faye/client.js` ，请邮件给我，shiren1118@126.com

## publish http api

发布主题的http api 说明

- POST
- url = /pub
- post data = key=foo&value=somevalue`

通过curl命令测试本地POST

	curl -d "key=foo&value=sss" http://127.0.0.1:4567/pub

测试线上环境

	curl -d "key=foo&value=sss" http://at35.com:4567/pub
	
检测步骤

- 打开client/index.html
- 在终端里执行curl命令
- 看浏览器，是否会弹出`sss`

## 优化

todo

- [ ] 试验redis作为存储
- [ ] 可视化monitor
- [x] publish http api
- [ ] add mocha && supertest for test
