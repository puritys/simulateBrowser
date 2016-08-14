var obj = require('../../../src/define/autoRedirect.js');
var assert = require('assert');

describe("isRedirect", function () {
    it("normal", function () {
        var res = obj.isRedirect();
        assert.equal(true, res);
    });

    it("not redirect this time", function () {
        var res;
        obj.disable();
        res = obj.isRedirect();
        assert.equal(false, res);
        res = obj.isRedirect();
        assert.equal(true, res);

    });

    it("not redirect forever", function () {
        var res;
        obj.disable(true);
        res = obj.isRedirect();
        assert.equal(false, res);
        res = obj.isRedirect();
        assert.equal(false, res);

    });

});
