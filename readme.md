#APIStubMaker [![Build Status](https://snap-ci.com/ajaydivakaran/apistubmaker/branch/master/build_image)](https://snap-ci.com/ajaydivakaran/apistubmaker/branch/master)
###Quick and easy way to create API stubs

On receiving a request the stub traverses through the stub response folder files to find a matching response based
on HTTP verb, url, query-strings and request body parameters.
The response of the first suitable match is returned and a 404 is returned if no match is found.

#Features
1. Match url using regular expressions.
2. Stub HTTP response code.
3. Support GET/POST requests.

##Steps to execute
1. git clone https://github.com/ajaydivakaran/apistubmaker.git
2. cd apistubmaker && npm install
3. Create folder containing text files of the below mentioned format.
4. node src/index.js [stub-response-folder path] [optional port number] 

##Response file format:

###Stub response file format for GET request:

```javascript
{
  "method": "GET",
  "url": "/order/123?a=10&b=11",
  "response": {
    "status": "success",
    "order": "123"
  }
}
```

###Stub response file format for GET request with regex URL match:

```javascript
{
  "method": "GET",
  "match_regex": true,
  "url": "^\/abc\\?q=3$",
  "response": {
    "status": "success",
    "order": "123"
  }
}
```

###Stub response file format for GET request with response code:

```javascript
{
  "method": "GET",
  "match_regex": true,
  "url": "/books/1234",
  "response_code": 404
}
```

### Stub response file format for POST request:

```javascript

{
  "method": "POST",
  "url": "/order/999",
  "body": {
    "name": "David",
    "age": 29
  },
  "response": {
    "status": "success",
    "order": "999",
    "some": "thing"
  }
}
```