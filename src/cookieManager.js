function cookieManager() 
{
    this.domain = "";
    this.domainsInfo = {

    }; 
}

var o = cookieManager.prototype;
o.domain = "";
o.domainsInfo = {
    "default": {
        "cookies": {}
    }
};

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

o.getCookies = function (domain) 
{//{{{
    if (!domain) domain = this.domain;
    if (this.domainsInfo[domain]) {
        return this.domainsInfo[domain].cookies;
    } else {
        this.domainsInfo[domain] = {
            cookies: {}
        };
    }
    return this.domainsInfo[domain].cookies;
};//}}}


o.getCookieString = function () 
{//{{{
    var key, str = [];
    for (key in this.cookies) {
        str.push(key + "="+this.cookies[key]['value']);
    }
    return str.join('; ');
};//}}}

o.getCookie = function (key, hasDetail) 
{//{{{
    var cookies = this.getCookies();
    if (cookies[key]) {
        if (typeof(hasDetail) != "undefined" && hasDetail === true) {
            return cookies[key];
        } else {
            return cookies[key]['value'];
        }
    }

    return "";
};//}}}

o.setCookie = function (key, name, value, domain) 
{//{{{
    var cookies;
    if (typeof(domain) != "undefined") {
        cookies = this.getCookies(domain);
    } else {
        cookies = this.getCookies();
    }
    if (!cookies[key]) cookies[key] = {};
    cookies[key][name] = value;
};//}}}

o.setCookies = function (str, domain) 
{//{{{
    var i, n, findPos, name, value, self;
    self = this;
    if (typeof(str) == "string") {
        var s = str.split(/; /);
        s.map(function (v, i) {
            findPos = v.indexOf("=");
            name = v.substring(0, findPos);
            value = v.substring(findPos + 1, v.length);
            self.setCookie(name, "value", value, domain);
        });
        for (var key in s) {
            this.setCookie(str, "value", domain);
        }
    } else {
        for (var key in str) {
            this.setCookie(key, "value", str[key], domain);
        }
    }
}//}}}

o.clearCookie = function (key, value) {
    this.cookies = {};
};



module = module.exports = cookieManager;
