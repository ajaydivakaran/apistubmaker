var fs = require("fs"),
    path = require("path"),
    _ = require("lodash");

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
    if(isRegexMatchEnabled(jsonContent))
        return true;

    var queryParamsFromFile = getQueryParams(jsonContent);
    return _.isEqual(queryParamsFromFile, currentQueryParams);
}

function getUrl(jsonContent){
    var rawUrl = jsonContent['url'];
    return rawUrl.indexOf("?") > -1 ? rawUrl.split("?")[0] : rawUrl;
}

function requestBodyMatch(method, jsonContent, currentRequestBody){
    if(method == 'GET')
        return true;

    var match = true;

    _.forIn(jsonContent['body'], function(value, key){
        match &= currentRequestBody[key] == value;
    });

    return match;
}

function verbMatch(jsonContent, request){
    return jsonContent['method'] == request.method;
}

function isRegexMatchEnabled(jsonContent){
    return 'match_regex' in jsonContent && jsonContent['match_regex']
}

function urlMatch(jsonContent, request){
    if(isRegexMatchEnabled(jsonContent))
        return request.originalUrl.match(jsonContent['url']);

    return request.path == getUrl(jsonContent)
}

module.exports = function(testDataPath){

    return {
                'fetchResponse': function(request){
                   var responseFiles = fs.readdirSync(testDataPath);
                   var responseBody = null;
                   var responseCode = null;
                   var contentType = null;


                   responseFiles.forEach(function(file){
                       var responseFile = path.join(testDataPath, file);
                       var fileContent = fs.readFileSync(responseFile);
                       var jsonContent = JSON.parse(fileContent);

                       if( verbMatch(jsonContent, request)
                           && urlMatch(jsonContent, request)
                           && queryParamsMatch(jsonContent, request.query)
                           && requestBodyMatch(request.method, jsonContent, request.body)){
                            responseBody = jsonContent['response'];
                            responseCode = _.get(jsonContent, 'response_code', 200);
                            contentType = _.get(jsonContent, 'content_type', 'application/json');
                       }
                   });

                   return {'code': responseCode, 'contentType': contentType,  'body': responseBody};
               }
          };

}

