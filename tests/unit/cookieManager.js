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


    it("object cookie", function () {
        var ret;
        obj.setCookies({"a": "b", "c":"d"});
        ret = obj.getCookies();
        assert.equal("b", ret.a.value);
        assert.equal("d", ret.c.value);

    });

});//}}}

