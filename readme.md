#APIStubMaker


##Steps to execute
1) git clone https://github.com/ajaydivakaran/apistubmaker.git
2) cd apistubmaker && npm install
3) Create folder containing text files of the below mentioned format.
4) node src/index.js [stub-response-folder path] [optional port number] 

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