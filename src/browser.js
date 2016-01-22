
/*
 * This is a simulator of browser.
 * It will automatically handle header and cookie after completing a request.
 * 
 **/

var http = require('light-http');
var Q = require('q');


function browser() {
    this.cookies = {};
    this.headers = {};
    this.html = "";
}

var o = browser.prototype;
o.headers = {};
o.cookies = {};
o.html = "";
o.get = function (url, param, header) {
    var defer, self;
    self = this;
    defer = Q.defer();
    if (typeof(header) === "undefined") {
        header = {};
    }
    this.setDefaultHeader(header);
    header['Cookie'] = this.getCookieString();
    http.disableSslVerification();
    http.get(url, param, header)
        .then(function (resp) {
            var headers;
            this.html = resp;
            headers = http.getResponseHeaders();
            if (headers['set-cookie']) {
                self.handleCookie(headers['set-cookie']);
            }
            defer.resolve(resp);
        });
    return defer.promise;
};

o.post = function (url, param, header, file) {
    var defer, self;
    self = this;
    defer = Q.defer();
    if (typeof(header) === "undefined") {
        header = {};
    }
    this.setDefaultHeader(header);
    header['Cookie'] = this.getCookieString();
    http.disableSslVerification();
    http.post(url, param, header)
        .then(function (resp) {
            var headers;
            this.html = resp;
            headers = http.getResponseHeaders();
            if (headers['set-cookie']) {
                self.handleCookie(headers['set-cookie']);
            }
            defer.resolve(resp);
        });
    return defer.promise;
};

o.setDefaultHeader = function (header) 
{//{{{
    if (!header['user-agent']) {
        header['user-agent']  = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10) AppleWebKit/517.36 (KHTML, like Gecko) Chrome/48.0.2125.104 Safari/597.16";
    }
    header['Accept'] = 'Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
//    header['Accept-Encoding'] = "gzip, deflate, sdch";
};//}}}

/*
 * cookie format: key=value; expires=Fri, 22-Jan-2016 18:32:06 GMT; Max-Age=3600; path=/
 */
o.handleCookie = function (resCookie) 
{//{{{
    var i, n, findPos, key, value, parts, partsN, name;
    n = resCookie.length;
    for (i = 0; i < n; i++) {
        parts = resCookie[i].split(/;/);
        partsN = parts.length;
        for (j = 0; j < partsN; j++) {
            str = parts[j].replace(/^[\s]+/, '');
            findPos = str.indexOf("=");
            if (findPos != -1) {
                name = str.substring(0, findPos);
                value = str.substring(findPos + 1, str.length);
            } else {
                continue;
            }
            if (j == 0) {
                this.setCookie(name, "value", value);
                key = name;
            } else { 
                this.setCookie(key, name, value);
            }
        }
    }
};//}}}

o.setHeader = function (header) {
    this.headers = header;
};

o.getHeaders = function () {
    return this.headers;
};

o.getHeader = function (key) 
{//{{{
    if (!key) {
        return this.headers;
    } else if (this.headers[key]) {
        return this.headers[key];
    }
    return "";
};//}}}

o.getCookies = function () 
{//{{{
    return this.cookies;
};//}}}

o.getCookie = function (key, hasDetail) 
{//{{{
    if (this.cookies[key]) {
        if (typeof(hasDetail) != "undefined" && hasDetail === true) {
            return this.cookies[key];
        } else {
            return this.cookies[key]['value'];
        }
    }

    return "";
};//}}}

o.getCookieString = function () 
{
    var key, str = [];
    for (key in this.cookies) {
        str.push(key + "="+this.cookies[key]['value']);
    }
    return str.join('; ');
};

o.setCookie = function (key, name, value) {
    if (!this.cookies[key]) this.cookies[key] = {};
    this.cookies[key][name] = value;
};

o.clearCookie = function (key, value) {
    this.cookies = {};
};

module.exports = exports = browser;
