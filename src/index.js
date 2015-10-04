if(process.argv.length < 3){
    throw "Expected commandline line format: node index.js test-data-path [port]";
}
var responseFetcher = require('./response_fetcher')(process.argv[2]);

var app = require('./app')(responseFetcher);

var stubPort = process.argv.length == 4 ? process.argv[3] : 3000;

var server = app.listen(stubPort, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log('Stub listening at http://%s:%s', host, port);
});

