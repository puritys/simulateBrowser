# simulateBrowser

simulateBrowser 是一個 command line 專用的假瀏覽器

npm install simulate-browser

下面這段程式，試範一個簡單的 command line 登入 Yahoo ，並取得  Cookie。

    var b = require('simulate-browser');
    // 連到 Yahoo Login 頁面
    var user = "xxx@yahoo.com.tw";
    var pswd = "1231123";
    b.get("https://login.yahoo.com/m?.intl=tw&.done=https://tw.mobi.yahoo.com")
        .then(function (text) {
            // 處理 Form 表單資料
            var params, _crumb, reg, mat, inputs;
            params = {
                username: user,
                passwd: pswd,
                ".format": "json"
            };
            inputs = ["_ts", "_tps", "_muh", "_crumb", "_uuid", "_seqid", "otp_channel", "otp_ref_cc_intl"];
            for (var k in inputs) {
                reg = new RegExp('<input type="hidden" name="'+inputs[k]+'" value="([^\"]+)"');
                mat = text.match(reg);
                if (mat && mat[1]) params[inputs[k]] = mat[1];

            }
            // 送出 Form 表單
            return b.post("https://login.yahoo.com/m?.intl=tw&.done=https%3A%2F%2Ftw.mobi.yahoo.com", params);
        })
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
