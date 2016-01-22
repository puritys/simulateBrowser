var assert = require('assert');
var browser = require('./../../src/browser.js');
var Q = require('q');
var obj = new browser();
var baseUrl = "http://www.puritys.me";

describe("Test get", function () {//{{{
    var resp1;
    before(function (done) {
        var url;
        url = "http://localhost:8080/";
        url = "http://www.puritys.me/unit.php?unit=1";
        obj.get(url, {}, {})
            .then(function (resp) {
                return obj.get(url, {}, {});
            })
            .then(function (resp) {
                resp1 = JSON.parse(resp);
                done();
            });
    });

    it("Get html and set cookie", function () {
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


