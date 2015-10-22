#APIStubMaker [![Build Status](https://snap-ci.com/ajaydivakaran/apistubmaker/branch/master/build_image)](https://snap-ci.com/ajaydivakaran/apistubmaker/branch/master)
### Create stub responses using specifications and not code!

On receiving a request the stub traverses through the stub response folder files to find a matching response based
on HTTP verb, url, query-strings and request body parameters.
The response of the first suitable match is returned and a 404 is returned if no match is found.
If multiple response files match then the response from the file with highest priority value will be returned.

#Features
1. Match url using regular expressions.
2. Customize HTTP response code.
3. Support GET/POST requests.
4. Customize response Content-Type.
5. Specify response file priority when multiple matches present.
6. Cache response files to memory for faster response times.

##Steps to execute
1. git clone https://github.com/ajaydivakaran/apistubmaker.git
2. cd apistubmaker && npm install
3. Create folder containing text files of the below mentioned format.
4. node src/index.js -l [stub-response-folder path] -p [optional port number] -c [cache response files] 

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

### Stub response file format for GET request with specified content-type:

```javascript

{
  "method": "GET",
  "match_regex": false,
  "url": "/books.html",
  "content_type": "text/html",
  "response": "<html><body><h1>some html</h1></body></html>"
}

```

### Stub response file format for GET request with priority value:

```javascript

{
  "method": "GET",
  "match_regex": false,
  "priority": 1,
  "url": "/books.html",
  "content_type": "text/html",
  "response": "<html><body><h1>some html</h1></body></html>"
}

```