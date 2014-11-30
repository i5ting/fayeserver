var http = require('http');
var url  = require("url");
var faye = require('faye');
var querystring = require("querystring");

var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

var server = http.createServer(function(req,res){
	req.setEncoding('utf-8');
	
	var c = req.url == '/pub' && req.method == 'POST'
	if(!c){
	 	res.end(JSON.stringify({
	 		status:{
	 			code : 1,
	 			msg  : "url和method不合法"
	 		}
	 	}));
	}

  var post = '';    

	req.on('data', function(chunk){   
	   post += chunk;
	});

	req.on('end', function(){    
	  var params = querystring.parse(post);
		 
		var key = params.key;
		var val = params.value;
		
	 	bayeux.getClient().publish('/'+key, {
	 	  text: val
	 	});

	 	// publish http api
	 	res.writeHead(200, {
	    'Content-Type': 'application/json;charset=utf-8'
	  });
	 	res.end(JSON.stringify({
	 		data:{
	 			key  : key,
				value: val
	 		},
	 		status:{
	 			code : 0,
	 			msg  : "sucess"
	 		}
	 	}));
	});
})

bayeux.attach(server);
server.listen(4567);