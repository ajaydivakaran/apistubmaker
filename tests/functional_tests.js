var assert = require("assert");
var request = require('supertest');
var fs = require('fs');
var path = require('path');

describe("APIStubMaker", function(){

    var app;

    before(function(){
        var testDataPath = path.join(__dirname, '/testdata');
        var responseFetcher = require('../src/response_fetcher')(testDataPath);
        app = require('../src/app')(responseFetcher);
    });

    describe("POST requests", function(){

        it("should return response when body matches subset", function(done){

            var expectedResponse = {
                "status": "success",
                "order": "999",
                "some": "thing"
            };
            var expectedStatusCode = 200;

            request(app)
                .post('/order/999')
                .set('Content-Type', 'application/json')
                .send({
                    "name": "Ajay",
                    "age": 29,
                    "designation": "developer"
                })
                .end(function(err, res){
                    assert.equal(expectedStatusCode, res.status);
                    assert.deepEqual(expectedResponse, res.body);
                    done();
                })

        });

        it("should not match when body does not match subset", function(done){

            var expectedStatusCode = 404;

            request(app)
                .post('/order/999')
                .set('Content-Type', 'application/json')
                .send({
                    "name": "Viki",
                    "age": 30
                })
                .end(function(err, res){
                    assert.equal(expectedStatusCode, res.status);
                    done();
                })

        });

    });

    describe("GET requests", function(){
    
        it("should return response for url with no query params", function(done){
    
            var expectedResponse = {"status": "failure", "order": "456"};
            var expectedStatusCode = 200;
    
            request(app)
                .get('/order/456')
                .end(function(err, res){
                    assert.equal(expectedStatusCode, res.status);
                    assert.deepEqual(expectedResponse, res.body);
                    done();
                })
        });
    
        it("should return response for exact url match containing query string", function(done){
    
            var expectedResponse = {"status": "success", "order": "123"};
            var expectedStatusCode = 200;
    
            request(app)
                .get('/order/123?a=10&b=11')
                .end(function(err, res){
                    assert.equal(expectedStatusCode, res.status);
                    assert.deepEqual(expectedResponse, res.body);
                    done();
                })
        });
    
        it("should return response for url containing query string is in different order", function(done){
    
            var expectedResponse = {"status": "success", "order": "123"};
            var expectedStatusCode = 200;
    
            request(app)
                .get('/order/123?b=11&a=10')
                .end(function(err, res){
                    assert.equal(expectedStatusCode, res.status);
                    assert.deepEqual(expectedResponse, res.body);
                    done();
                })
        });
    
        it("should return response for for url specified as regular expression", function(done){
    
            var expectedResponse = {"status": "success", "order": "9090"};
            var expectedStatusCode = 200;
    
            request(app)
                .get('/abc?q=3')
                .end(function(err, res){
                    assert.equal(expectedStatusCode, res.status);
                    assert.deepEqual(expectedResponse, res.body);
                    done();
                })
        });
    
        it("should return stubbed response code", function(done){
    
            var expectedStatusCode = 404;
    
            request(app)
                .get('/book/404')
                .end(function(err, res){
                    assert.equal(expectedStatusCode, res.status);
                    done();
                })
        });
    
        it("should return 404 when url does not match", function(done){
    
            var expectedStatusCode = 404;
    
            request(app)
                .get('/unknown')
                .end(function(err, res){
                    assert.equal(expectedStatusCode, res.status);
                    done();
                })
        });
    
    
    });


});
