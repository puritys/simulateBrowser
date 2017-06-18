var Q = require('q');
var prompt = require('prompt');
var b = require('./../../index.js');
var user = "...@yahoo.com.tw";
var pswd = "";

// Get user inputs
var schema = {
    properties: {
      user: {
        //pattern: /^[a-zA-Z\s\-]+$/,
        message: 'Yahoo Account (xxx@yahoo.com)',
        required: true
      },
      pswd: {
        message: 'Password',
        hidden: true
      }
   }
};
var ts = 0;
prompt.start();
Q.nfcall(prompt.get, schema)
    .then(function (result) {
        //user = result.user;
        //pswd = result.pswd;
    })
    .then(function () {
        return Q.promise(function (resolve, reject) {
            Q.nfcall(loginYahoo, user, pswd)
                .fail(function (err) {
                    console.log("err = " + err);
                })
                .then(function (t) {
                    resolve(t)
                });
        });
    })
    .then(function (info) {
        console.log("info = " , info);
    });

function loginYahoo(user, pswd, callback) {
    if (!user || !pswd) return ;
    var err = "";
    b.get("https://login.yahoo.com/m?.intl=tw&.done=https://tw.mobi.yahoo.com")
    .then(function (text) {
        var params, _crumb, reg, mat, inputs;
        params = {
            username: user,
            signin: "authtype",
            "countrycode": 886
        };

        inputs = ["_ts", "_tps", "_muh", "_crumb", "_uuid", "_seqid", "otp_channel", "otp_ref_cc_intl", "countrycode"];
        for (var k in inputs) {
            reg = new RegExp('<input type="hidden" name="'+inputs[k]+'" value="([^\"]+)"');
            mat = text.match(reg);
            if (mat && mat[1]) params[inputs[k]] = mat[1];

        }
        if (params['_ts']) ts = params['_ts'];
        console.log("Your input: ", params);
        return b.post("https://login.yahoo.com/m?.intl=tw&.done=https%3A%2F%2Ftw.mobi.yahoo.com", params);
    }).fail(error)
    .then(function (text) {
        //var header = b.getResponseHeaders();
        //console.log("Firt step header = ", header , "\n\n");
        console.log(text);
        var nextUrl = "https://login.yahoo.com/account/challenge/password";
        var params, _crumb, reg, mat, inputs;
        params = {
            username: user,
            signin: "authtype",
            password: pswd,
            _ts: ts,
            verifyPassword: "登入",
            passwordContext: "yakEligible"

        };

        inputs = ["_ts", "_tps", "acrumb", "crumb", "config", "s"];
        for (var k in inputs) {
            reg = new RegExp('<input type="hidden" name="'+inputs[k]+'" value="([^\"]+)"');
            mat = text.match(reg);
            if (mat && mat[1]) params[inputs[k]] = mat[1];

        }
        console.log("Password page, Your input:", params);
        return b.post(nextUrl, params);
    }).fail(error)
    .then(function (text) {
        var header = b.getResponseHeaders();
        console.log("Login header = ", header , "\n\n");
        return b.get("https://my.yahoo.com/");
    }).fail(error)
    .then(function (text) {
        var ret;
        ret = b.getCookieString();
        callback(err, ret);
    });

}








function error(err) {
    console.log("Has error: ", err);
}
