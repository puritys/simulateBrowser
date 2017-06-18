var assert = require('assert');
var obj = require('./../../src/browser.js');
var Q = require('q');
var baseUrl = "https://www.puritys.me";

describe("Test get", function () {//{{{
    var resp1;
    before(function (done) {
        var url;
        url = "http://www.puritys.me/unit.php?unit=1";
        obj.get(url, {}, {})
            .fail(function (err) {console.log(err);})
            .then(function (resp) {
                return Q.promise(function (resolve, reject) {
                    obj.get(url, {}, {})
                        .then(function (text) {resolve(text)});
                });
            })
            .then(function (resp) {
                resp1 = JSON.parse(resp);
                done();
            });
    });

    it("Get html and set cookie", function () {
        //console.log(obj.getCookies());
        assert.equal(1, resp1.unit);
        assert.equal('v2', obj.getCookie('b'));
        assert.equal('/', obj.getCookie('a', true).path);
        assert.equal('v1', obj.getCookie('a', true).value);
    });

    it("Get all cookies", function () {
        var cookies = obj.getCookies();
        assert.equal("v2", cookies['b']['value']);
        assert.equal("v1", cookies['a']['value']);

    });

});//}}}

describe("Test get https", function () {//{{{
    var resp1;
    before(function (done) {
        var url;
        url = "https://www.puritys.me/unit.php?unit=1";
        obj.get(url, {}, {})
            .then(function (resp) {
                return obj.get(url, {}, {});
            })
            .then(function (resp) {
                resp1 = JSON.parse(resp);
                done();
            });
    });
    it("Get all cookies", function () {
        var cookies = obj.getCookies();
        assert.equal("v2", cookies['b']['value']);
        assert.equal("v1", cookies['a']['value']);

    });

});//}}}

describe("Test post", function () {//{{{
    var resp;
    before(function (done) {
        var url;
        url = baseUrl + "/unit.php?unit=1";
        obj.post(url, {"a":"b"}, {})
            .then(function (text) {
                resp = JSON.parse(text);
                done();
            });
    });
    it("normal case", function () {
        assert.equal("b", resp.a);

    });

});//}}}

describe("Test location redirect", function () {//{{{
    var resp;
    before(function (done) {
        var url;
        url = baseUrl + "/unit.php?redirect=1";
        obj.get(url, {}, {})
            .then(function (text) {
                resp = text;
                done();
            });
    });
    it("normal case", function () {
        var c = obj.baseUrl;
        assert.equal("https://www.google.com.tw", c);

    });

});//}}}

describe("Test cookie", function () {//{{{
    var resp, cookie1, cookie2;
    before(function (done) {
        var url;
        url = baseUrl + "/unit.php?unit=1";
        obj.get(url, {}, {})
            .then(function (text) {
                return Q.promise(function (resolve, reject) {
                    cookie1 = obj.getCookies();
                    obj.get("http://www.google.com.tw/")
                        .then(function (tx) {
                            cookie2 = obj.getCookies();
                            resolve(tx);
                        });
                })
            })
            .then(function () {
                done();
            });
    });
    it("normal case", function () {
        //console.log(cookie1);
        assert.equal("v1", cookie1['a'].value);
        //console.log(cookie2);
        if (cookie2['NID']) {
            assert.equal(true, true);
        } else {
            assert.equal(true, false, "can not get the cookie from the url of browser");
        }

    });

});//}}}

describe("Test setCookies", function () {//{{{
    it("normal case", function () {
        var userId, age;
        obj.setCookies("userId=1; age=13");
        userId = obj.getCookie('userId');
        age = obj.getCookie('age');
        assert.equal(1, userId);
        assert.equal(13, age);
    });

});//}}}

