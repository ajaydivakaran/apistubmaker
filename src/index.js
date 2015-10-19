var argv = require('yargs')
    .usage('Usage: index.js -l [stub-path] -p [port number] -c [enable-cache]')
    .demand(['l'])
    .describe('l', 'stub folder location')
    .alias('l', 'stubFolderLocation')
    .describe('p', 'port number to listen on')
    .alias('p', 'stubPort')
    .describe('c', 'enable caching of response file being read from disk')
    .alias('c', 'enableCache')
    .default('p', 3000)
    .default('c', false)
    .argv;


var responseFetcher = require('./response_fetcher')(argv.stubFolderLocation, argv.enableCache);

var app = require('./app')(responseFetcher);

var server = app.listen(argv.stubPort, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log('Stub listening at http://%s:%s', host, port);
});

