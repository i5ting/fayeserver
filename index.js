var http = require('http');
var faye = require('faye'); 

var bayeux = new faye.NodeAdapter({
	mount		: '/faye', 
	timeout : 45
});

var server = http.createServer(function(req,res){
	require("./src/http_pub_api")(bayeux, req, res);
})

bayeux.attach(server);
server.listen(4567);