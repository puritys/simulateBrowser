var def = {
    AUTO_REDIRECT: 1,
    NO_REDIRECT: 0,
    NO_REDIRECT_FOREVER: -1
};

var value = def.AUTO_REDIRECT;

var obj = {};

for (var key in def) {
    obj[key] = def[key];
}

obj.yes = obj.isRedirect = function () {
    switch(value) {
        case def.AUTO_REDIRECT:
            return true;
            break;
        case def.NO_REDIRECT:
            value = def.AUTO_REDIRECT;
            return false;
            break;
        case def.NO_REDIRECT_FOREVER:
            return false;
            break;
    }
    return true
};

obj.disable = function (forever) {
    value = (forever) ? def.NO_REDIRECT_FOREVER : def.NO_REDIRECT ;
};

obj.enable = function () {
    value = def.AUTO_REDIRECT;
};

module.exports = obj;
