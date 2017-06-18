# simulateBrowser

[simulateBrowser] (https://www.npmjs.com/package/simulate-browser) 是一個 command line 專用的假瀏覽器，能夠用來做網站測試或自動化功能，例如我可以寫一個自動登入 Facebook 網站並發送訊息給每一個朋友，或是自動登入 Yahoo 收信。

simulateBrowser 的使用方式如下。


npm install simulate-browser

下面這段程式，示範一個簡單的 command line 登入 Yahoo ，並取得  Cookie。

    var b = require('simulate-browser');
    var user = "xxx@yahoo.com.tw";
    var pswd = "1231123";
    
    // 連到 Yahoo Login 頁面
    b.get("https://login.yahoo.com/m?.intl=tw&.done=https://tw.mobi.yahoo.com")
        .then(function (text) {
            // 處理 Form 表單資料
            var params, _crumb, reg, mat, inputs;
            params = {
                username: user,
                signin: "authtype",
                "countrycode": 886
            };

            inputs = ["_ts", "_tps", "_muh", "_crumb", "_uuid", "_seqid", "otp_channel", "otp_ref_cc_intl"];
            for (var k in inputs) {
                reg = new RegExp('<input type="hidden" name="'+inputs[k]+'" value="([^\"]+)"');
                mat = text.match(reg);
                if (mat && mat[1]) params[inputs[k]] = mat[1];

            }
            // 送出 Form 表單
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
            // 連到 My Yahoo 頁面
            return b.get("https://my.yahoo.com/");
        })
        .then(function (text) {
            // 印出  cookie
            var ret;
            ret = b.getCookieString();
            console.log("cookie = " + ret);
        });


Initialize cookie

    var b = require('simulate-browser');
    // object    
    b.setCookies({"userId": "xxx", "PHPSESSION": "zzzz"});
    // string
    b.setCookies("userId=xxx; PHPSESSION=zzzz");

    b.get("https://tw.mobi.yahoo.com")
        .then(function (xx) {

        });



