var assert = require('assert');
var cookieManager = require('./../../src/cookieManager.js');
var obj = new cookieManager();

describe("Test setCookies", function () {//{{{
    it("string cookie", function () {
        var ret;
        obj.setCookies("a=b; c=d");
        ret = obj.getCookies();
        assert.equal("b", ret.a.value);
        assert.equal("d", ret.c.value);

    });

    it("handle cookie", function () {
        var ret;
        obj.clearCookie();
        obj.handleCookie(['JSESSIONID=zzz; Path=/aso']);
        ret = obj.getCookieString();
        assert.equal("JSESSIONID=zzz", ret);
    });



    it("object cookie", function () {
        var ret;
        obj.setCookies({"a": "b", "c":"d"});
        ret = obj.getCookies();
        assert.equal("b", ret.a.value);
        assert.equal("d", ret.c.value);

    });

});//}}}

