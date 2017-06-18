
/*
 * This is a simulator of browser.
 * It will automatically handle header and cookie after completing a request.
 * 
 **/

var http = require('light-http');
var Q = require('q');
var _ = require('underscore');

var cManager = new (require('./cookieManager.js'));
var defaultHeader = {
       "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
};

http.followLocation = false;

function browser() {
    this.baseUrl = "";
    this.cookies = {};
    this.headers = {};
    this.html = "";
    this.domain = "";
    this.url = "";
    this.responseHeaders = {};
    this.isRedirect = require('./define/autoRedirect.js');
    this.responseDetail = {};
}

var o = browser.prototype;
o.headers = {};
o.cookies = {};
o.html = "";
o.domain = "";
o.url = ""; // the url of browser

o.getResponseDetail = function () {
    return _.clone(this.responseDetail);
};

o.get = function (url, param, header)
{//{{{
    var defer, self;
    self = this;
    this.responseHeader = {};
    this.setUrlInfo(url);
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
        self.html = resp;
        self.responseHeaders = headers = http.getResponseHeaders();
        self.baseUrl = self.getBaseUrl(url);
        cManager.processHeaderCookie(headers);
        if (self.isRedirect.yes() && 
            (headers['status-code'] === 301 || headers['status-code'] === 302)
        ) {
            self.handleLocation(headers, defer);
        } else {
            this.responseDetail = http.getResponseDetail();
            defer.resolve(resp);
        }
    })
    .fail(function (err) {
        console.log("exception ", err);
    });
    return defer.promise;
};//}}}

o.post = function (url, param, header, file) 
{//{{{
    var defer, self;
    self = this;
    this.responseHeader = {};
    this.setUrlInfo(url);
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
        self.html = resp;
        self.responseHeaders = headers = http.getResponseHeaders();
        cManager.processHeaderCookie(headers);
        if (self.isRedirect.yes() &&
            (headers['status-code'] === 301 || headers['status-code'] === 302)
        ) {
            self.handleLocation(headers, defer);
        } else {
            self.responseDetail = http.getResponseDetail();
            defer.resolve(resp);
        }
    })
    .fail(function (err) {console.log("err",err);});
    return defer.promise;
};//}}}

o.handleLocation = function (headers, defer)
{//{{{
    var url;
    url = (headers.Location)? headers.Location: headers.location;
    if (url.substring(0, 1) == "/") {
        url = this.baseUrl + url;
    }
    //console.log("location url = " + url);
    this.get(url)
        .then(function (text) {
             defer.resolve(text);
        });

}//}}}

o.getBaseUrl = function (url) {
    var res = url.match(/https?:\/\/[^\/]+/);
    if (!res || !res[0]) {
        this.throwException("failed to getBaseUrl, url is " + url);
    }
    return res[0];
};

o.setUrlInfo = function (url) 
{//{{{
    var reg, mat, domain;
    this.url = url;
    reg = /https?:\/\/([^\/]+)/;
    mat = url.match(reg);
    if (mat && mat[1]) {
        domain = _.last(mat[1].split(/\./), 2).join(".");
        this.domain = domain;
        cManager.domain = domain;
    }
};//}}}

o.setDefaultHeader = function (header) 
{//{{{
    if (!header['user-agent']) {
        header['user-agent']  = defaultHeader["user-agent"];
    }
//    header['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
//    header['Accept-Encoding'] = "gzip, deflate, sdch";
};//}}}

o.changeDefaultHeader = function (key, value) {
    if (!defaultHeader[key]) {
        console.log("The default header is not exist.");
        return false;
    }
    defaultHeader[key] = value;
}

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

o.getResponseHeaders = function () {
    return this.responseHeaders;
};

o.setCookies = function (str, domain) 
{//{{{
    cManager.setCookies(str, domain);
};//}}}


o.getCookies = function (domain) 
{//{{{
    return cManager.getCookies(domain);
};//}}}

o.getCookie = function (key, hasDetail) 
{//{{{
    return cManager.getCookie(key, hasDetail);
};//}}}

o.getCookieString = function () 
{
    return cManager.getCookieString(this.domain);
};

o.clearCookie = function () {
    return cManager.clearCookie();
};

o.disableAutoRedirect = function (forever) {
    this.isRedirect.disable(forever);
};

o.enableAutoRedirect = function () {
    this.isRedirect.enaable();
};

o.throwException = function (msg) {
    console.error(msg);
    throw new Exception(msg);
};

module.exports = new browser();
module.exports.constructor = browser;
