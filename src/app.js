var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var responseFetcher = null;

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

    return res.status(response.code).set('Content-Type', response.contentType).send(response.body);
}

module.exports = function(responseFetcherArg){
    responseFetcher = responseFetcherArg;
    return app;
}

