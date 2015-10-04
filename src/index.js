var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');

if(process.argv.length < 3){
    throw "Expected commandline line format: node index.js test-data-path [port]";
}
var stubPort = process.argv.length == 4 ? process.argv[3] : 3000;

var responseFetcher = require('./response_fetcher')(process.argv[2]);


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

    var request = {
                    "method": req.method,
                    "path": req.path,
                    "query": req.query,
                    "body": req.body,
                    "originalUrl": req.originalUrl
                  };
    var response = responseFetcher.fetchResponse(request);

    if (response.code == null && response.body == null){
        return res.status(404).end();
    }

    return res.status(response.code).json(response.body);
};
var server = app.listen(stubPort, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log('Stub listening at http://%s:%s', host, port);
});

