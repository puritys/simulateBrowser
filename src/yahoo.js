var Q = require("q");
var ts = 0;

function yahoo(browser) {
    this.browser = browser;
}

var o = yahoo.prototype;
o.login = function (user, pswd, callback) {
    if (!user || !pswd) return ;
    return this.startYahooLogin(user, pswd)
           .then(function (t) {
                if (callback)
                   callback("", "success");
           })
           .fail(function (err) {
                console.log("err = " + err);
                callback("error", "failed");
           });

}

o.startYahooLogin = function (user, pswd) {
    var err = "";
    var self = this;
    return Q.Promise(function (resolve, reject, notify) {
        self.browser.get("https://login.yahoo.com/m?.intl=tw&.done=https://tw.mobi.yahoo.com")
        .then(function (text) {
//console.log(text);
            var params, _crumb, reg, mat, inputs;
            params = {
                username: user,
                signin: "authtype",
                "countrycode": 886
            };

            inputs = ["_ts", "_tps", "_muh", "crumb", "acrumb", "config", "_uuid", "_seqid", "otp_channel", "otp_ref_cc_intl", "countrycode", "session"];
            for (var k in inputs) {
                reg = new RegExp('<input type="hidden" name="'+inputs[k]+'" value="([^\"]+)"');
                mat = text.match(reg);
                if (mat && mat[1]) params[inputs[k]] = mat[1];
            }
            if (params['_ts']) ts = params['_ts'];
            console.log("Your input: ", params);
            return self.browser.post("https://login.yahoo.com/m?.intl=tw&.done=https%3A%2F%2Ftw.mobi.yahoo.com", params);
        }).fail(reject)
        .then(function (text) {
            //var header = browser.getResponseHeaders();
            //console.log("Firt step header = ", header , "\n\n");
            var nextUrl = "https://login.yahoo.com/account/challenge/password";
            var params, _crumb, reg, mat, inputs;
            params = {
                username: user,
                yid: user,
                dname: user,
                signin: "authtype",
                password: pswd,
                _ts: ts,
                verifyPassword: "登入",
                passwordContext: "normal"//"yakEligible"

            };

            inputs = ["_ts", "_tps", "acrumb", "crumb", "config", "s", "authMechanism"];
            for (var k in inputs) {
                reg = new RegExp('<input type="hidden" name="'+inputs[k]+'" value="([^\"]+)"');
                mat = text.match(reg);
                if (mat && mat[1]) params[inputs[k]] = mat[1];

            }
            console.log("Password page, Your input:", params);
            return self.browser.post(nextUrl, params);
        }).fail(reject)
        .then(function (text) {
            console.log(text);
            var header = self.browser.getResponseHeaders();
            console.log("Login header = ", header , "\n\n");
            return self.browser.get("https://my.yahoo.com/");
        }).fail(reject)
        .then(function (text) {
            var ret;
            ret = self.browser.getCookieString();
            resolve(ret);
        });
    });
}


o.error = function(err) {
    console.log("Has error: ", err);
}

module.exports = yahoo;
