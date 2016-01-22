var b = new (require('./../../index.js'));
var user = "xxxxxx@yahoo.com.tw";
var pswd = "";

b.get("https://login.yahoo.com/m?.intl=tw&.done=https://tw.mobi.yahoo.com")
    .then(function (text) {

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
        return b.post("https://login.yahoo.com/m?.intl=tw&.done=https%3A%2F%2Ftw.mobi.yahoo.com", params);
    })
    .then(function (text) {
        return b.get("https://my.yahoo.com/");
    })
    .then(function (text) {
        console.log(text);
    });
