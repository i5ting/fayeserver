// <script type="text/javascript">
//   var client = new Faye.Client('http://at35.com:4567/faye', {
//   	timeout : 120,
// 		retry		: 5
// 	});
//
// 	var subscription = client.subscribe('/foo', function(message) {
// 	  // handle message
// 		alert(message.text);
// 		console.log(message);
// 	});
//
// 	setTimeout(function(){
// 		var publication = client.publish('/foo', {text: 'Hi there, foo test'});
//
// 		publication.then(function() {
// 		  alert('Message received by server!');
// 		}, function(error) {
// 		  alert('There was a problem: ' + error.message);
// 		});
//
// 	},2000);
// </script>
//

function __extend(des, src) { 
  if (!des) { 
    des = {}; 
  } 
  if (src) { 
    for (var i in src) { 
      des[i] = src[i]; 
    } 
  } 
	
  return des; 
} 

window.iChatClient = iChatClient = function(option){
	this.subs = [];
	this.sifter = new Sifter([]);
	this.debug = true;
	
	var opt = __extend({
		url: 'http://127.0.0.1:4567/faye',
  	timeout : 120,
		retry		: 5
	},option);
	
	this.client = new Faye.Client(opt.url, opt);
	
	return this;
}


iChatClient.prototype.log = function(t) {
	if (this.debug) {
		console.log('[iChat LOG] ' + t);
	}
}

iChatClient.prototype.add = function(item) { 
	if(this.is_exist(item.chat_id) == true){
		this.log('chat_id以及存在了');
		return;
	}
	
	this.subs.push(item);
	this.sifter = new Sifter(this.subs);
}
 
/**
 *
client.join('a_chat_id',function(message) {
	  // handle message
		alert(message.text);
		console.log(message);
	});
 *
 */ 
iChatClient.prototype.join = function(chat_id,cb){
	var topic = '/' + chat_id;
	
	var subscription = this.client.subscribe(topic, cb);
	
	this.add({
		'chat_id' : chat_id,
		'subscription' : subscription
	});
}

iChatClient.prototype.is_exist = function(chat_id){
	this.log(' chat_id = ' + chat_id);
	var result = this.search(chat_id, 1);
	return (result.items.length > 0) ? true : false;
}


iChatClient.prototype.fetch = function(chat_id, cb){
	this.log(' chat_id = ' + chat_id);
	var result = this.search(chat_id, 1);
	if(result.items.length > 0 && cb) {
		var obj = this.subs[result.items[0].id];
		cb(obj);
	}else {
		console.log('当前'+ chat_id +'没有订阅,无需离开');
	}
}

iChatClient.prototype.search = function(chat_id, limit){
	this.log(' chat_id = ' + chat_id);
	
	var result = this.sifter.search('' + chat_id, {
	  fields: ['chat_id'],
	  sort: [{field: 'chat_id', direction: 'asc'}],
		limit: limit
	});
	
	return result;
}

iChatClient.prototype.leave = function(chat_id, cb){
	this.log(' chat_id = ' + chat_id);

	this.fetch(chat_id, function(obj){
		var sub = obj.subscription;
		sub.cancel();
	
		if(cb){
			cb();
		}
	});
}

iChatClient.prototype.send = function(topic, message, cb_received_by_server, cb_error){
	var publication = this.client.publish('/' + topic, message);

	publication.then(function() {
	  // alert('Message received by server!');
		if(cb_received_by_server)
			cb_received_by_server();
	}, function(error) {
	  // alert('There was a problem: ' + error.message);
		if(cb_error)
			cb_error(error);
	});
}

iChatClient.prototype.disable_autodisconnect = function(){
	this.client.disable('autodisconnect');
}

iChatClient.prototype.disable_websocket = function(){
	this.client.disable('websocket');
}

iChatClient.prototype.disconnect = function(){
	this.client.disconnect();
}

iChatClient.prototype.reconnect = function(){
	// 实际上是重新subscribe就可以了
	// this.client.connect(callback, context);
}

// module.exports = iChatClient;