var express = require('express');
var app = express();
var fs = require('fs');
var responseFetcher = require('./response_fetcher');

app.get('*', function(req, res){
    console.log("request path " +  req.path);
    console.log("request method " + req.method);
    console.log("request query string");
    console.dir(req.query);

    var response = responseFetcher.fetchResponse(req.method, req.path, req.query);
    if (response == null){
        return res.status(404).end();
    }
    return res.json(response);
});

var server = app.listen(3000, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log('Stub listening at http://%s:%s', host, port);
});

