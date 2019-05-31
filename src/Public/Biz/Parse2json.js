/**
 * string to json
 */

var Parse2json = function (info) {
    if (info && typeof info === 'string') {
        info = info.replace(/[\r\n]/g,"");
        if((info.substr(0,1) == '{' && info.substr(info.length-1,1) == '}') || (info.substr(0,1) == '[' && info.substr(info.length-1,1) == ']')){
            try {
                return JSON.parse(info);
            } catch (e) {
                return info;
            }

        } else {
            return info;
        }
    } else {
        return info;
    }
};
export {
    Parse2json
};
