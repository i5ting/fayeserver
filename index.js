var http = require('http');
var url  = require("url");
var faye = require('faye');
var querystring = require("querystring");

var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

var server = http.createServer(function(req,res){
	require("./http_pub_api")(bayeux, req, res);
})

bayeux.attach(server);
server.listen(4567);