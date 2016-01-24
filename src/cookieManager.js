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
{
    var key, str = [];
    for (key in this.cookies) {
        str.push(key + "="+this.cookies[key]['value']);
    }
    return str.join('; ');
};

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


o.setCookie = function (key, name, value) {
    var cookies;
    cookies = this.getCookies();
    if (!cookies[key]) cookies[key] = {};
    cookies[key][name] = value;
};

o.clearCookie = function (key, value) {
    this.cookies = {};
};



module = module.exports = cookieManager;
