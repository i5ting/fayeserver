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

iChatClient.prototype.leave = function(chat_id, cb){
	this.log(' chat_id = ' + chat_id);
	
	var result = this.sifter.search('' + chat_id, {
	  fields: ['chat_id'],
	  sort: [{field: 'chat_id', direction: 'asc'}],
		limit: 1
	});
	
	if (result.items.length > 0) {
		var sub = this.subs[result.items[0].id].subscription;
		sub.cancel();
		
		if(cb){
			cb();
		}
	}else {
		console.log('当前'+ chat_id +'没有订阅,无需离开');
	}
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