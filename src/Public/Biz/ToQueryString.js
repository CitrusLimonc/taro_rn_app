import { IsEmpty } from './IsEmpty';
/**
 * JSON to String
 */
var ToQueryString = function(info){
    if (IsEmpty(info)) {
        return "";
    }else{
        let arr = [];
        for (var i in info) {
            arr[arr.length] = i + "=" + info[i];
        }
        arr = arr.join("&");
        return arr;
    }
};
export {ToQueryString};
