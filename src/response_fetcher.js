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

function getResponsePriorityValue(jsonContent) {
    return _.get(jsonContent, 'priority', 0);
}

function comparePriorityValue(currentPriorityValue, jsonContent){
    var responsePriorityValue = getResponsePriorityValue(jsonContent);
    return currentPriorityValue <= responsePriorityValue;
}

var responseFileCache = [];
var fileNameToContentMap = {};

function getResponseFileNames(enableCache, testDataPath){
    if(enableCache && responseFileCache.length > 0){
        return responseFileCache;
    }
    responseFileCache = fs.readdirSync(testDataPath);
    return responseFileCache;
}

function getFileContentAsJSON(enableCache, responseFilePath){
    if(enableCache && _.get(fileNameToContentMap, responseFilePath, null)){
        return _.get(fileNameToContentMap, responseFilePath);
    }
    var fileContent = fs.readFileSync(responseFilePath);
    var jsonContent = JSON.parse(fileContent);
    fileNameToContentMap[responseFilePath] = jsonContent;
    return fileNameToContentMap[responseFilePath];
}

module.exports = function(testDataPath, enableCache){

    return {
                'fetchResponse': function(request){
                   var responseFiles = getResponseFileNames(enableCache, testDataPath);
                   var responseBody = null;
                   var responseCode = null;
                   var contentType = null;
                   var priorityValue = 0;


                   responseFiles.forEach(function(file){
                       var responseFilePath = path.join(testDataPath, file);
                       var jsonContent = getFileContentAsJSON(enableCache, responseFilePath);

                       if( verbMatch(jsonContent, request)
                           && urlMatch(jsonContent, request)
                           && queryParamsMatch(jsonContent, request.query)
                           && requestBodyMatch(request.method, jsonContent, request.body)
                           && comparePriorityValue(priorityValue, jsonContent) ){
                            responseBody = jsonContent['response'];
                            responseCode = _.get(jsonContent, 'response_code', 200);
                            contentType = _.get(jsonContent, 'content_type', 'application/json');
                            priorityValue = getResponsePriorityValue(jsonContent);
                       }
                   });

                   return {'code': responseCode, 'contentType': contentType,  'body': responseBody};
               }
          };

};

