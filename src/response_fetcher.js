var fs = require("fs"),
    path = require("path"),
    _ = require("lodash");

var testDataFolder = "/home/ajay/learn/APIStubMaker/testdata"

function getQueryParams(jsonContent){
    var queryParamMap = {};
    var queryParams = jsonContent['url'].indexOf("?") > -1 ?
                        jsonContent['url'].substring(jsonContent['url'].indexOf("?") + 1).split("&") : [];
    queryParams.forEach(function(queryParam){
        var queryParamSplit = queryParam.split("=");
        queryParamMap[queryParamSplit[0]] = queryParamSplit[1];
    });
    return queryParamMap;
}

function queryParamsMatch(jsonContent, currentQueryParams){
    var queryParamsFromFile = getQueryParams(jsonContent);
    return _.isEqual(queryParamsFromFile, currentQueryParams);
}

function getUrl(jsonContent){
    var rawUrl = jsonContent['url'];
    return rawUrl.indexOf("?") > -1 ? rawUrl.split("?")[0] : rawUrl;
}

function requestBodyMatch(method, jsonContent, currentRequestBody){
    if(method == 'GET'){
        return true;
    }
    var match = true;

    _.forIn(jsonContent['body'], function(value, key){
        match &= currentRequestBody[key] == value;
    });

    return match;
}

module.exports.fetchResponse = function(request){
    var files = fs.readdirSync(testDataFolder);
    var response = null;

    files.forEach(function(file){
        var responseFile = path.join(testDataFolder, file);
        var fileContent = fs.readFileSync(responseFile);
        var jsonContent = JSON.parse(fileContent);

        if(jsonContent['method'] == request.method
            && request.path == getUrl(jsonContent)
            && queryParamsMatch(jsonContent, request.query)
            && requestBodyMatch(request.method, jsonContent, request.body)){
             response = jsonContent['response'];
        }
    });

    return response;
}