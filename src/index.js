var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var responseFetcher = require('./response_fetcher');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('*', function(req, res){
    return handleRequest(req, res);
});

app.post('*', function(req, res){
    return handleRequest(req, res);
});

function handleRequest(req, res){
    console.log("request path " +  req.path);
    console.log("request method " + req.method);
    console.log("request query string");
    console.dir(req.query);
    console.log("request body");
    console.dir(req.body);

    var request = {"method": req.method, "path": req.path, "query": req.query, "body": req.body};
    var response = responseFetcher.fetchResponse(request);

    if (response == null){
        return res.status(404).end();
    }

    return res.json(response);
};
var server = app.listen(3000, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log('Stub listening at http://%s:%s', host, port);
});

