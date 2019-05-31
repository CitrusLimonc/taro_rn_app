/**
 * @author cy
 * 网络请求
 */
import {Domain} from '../../../Env/Domain.js';
import {ToQueryString} from '../../Biz/ToQueryString.js';
import { IsEmpty } from '../../Biz/IsEmpty.js';
import {Parse2json} from '../../Biz/Parse2json.js';
import Taro from '@tarojs/taro';

var NetWork={};
const WEB_URL=Domain.WEB_URL;
const URL=Domain.URL;
const PCURL=Domain.PCURL
const ITEM_URL=Domain.ITEM_URL;

var transquery = function (args, query, str) {
    for (let i in args) {
        if (typeof (args[i]) == 'object') {
            if (IsEmpty(args[i])) {
                if (IsEmpty(str)) {
                    query[`${i}[0]`] = '';
                } else {
                    query[`${str}[${i}][0]`] = '';
                } //对象或者数组为空判断
            } else {
                for (let k in args[i]) {
                    if (typeof (args[i][k]) == 'object') {
                        query = this.transquery(args[i][k], query, IsEmpty(str) ? `${i}[${k}]` : `${str}[${i}][${k}]`);
                    } else {
                        if (IsEmpty(str)) {
                            query[`${i}[${k}]`] = args[i][k];
                        } else {
                            query[`${str}[${i}][${k}]`] = args[i][k];
                        }
                    }
                }
            }
        } else {
            if (IsEmpty(str)) {
                query[`${i}`] = args[i];
            } else {
                query[`${str}[${i}]`] = args[i];
            }

        }
    }
    return query;
}

let default_post_option = {
    mode: 'jsonp',
};

NetWork.Post = function({url,params,host=WEB_URL,data=undefined,retry=0},callback,error_callback){
    let queryStr = '';
    if(IsEmpty(params)){
        params = data;
    }
    if (IsEmpty(params)) {
        queryStr = '';
    } else {
        queryStr = ToQueryString(params);
        if (queryStr) {
            queryStr = "?" + queryStr;
        } else {
            queryStr = '';
        }
    }

    let codeUrl = host+url+queryStr;
    console.log(codeUrl);

    Taro.request({
        method: 'POST',
        url: encodeURI(codeUrl),
        dataType: 'jsonp',
        mode: 'same-origin',
        body: '',
        headers:{
            "X-Request-Auth": "UserId/AES"
        },
    }).then((result) => {
        console.log(result);
        if (!IsEmpty(result) && !IsEmpty(result.body)) {
            if (result.body == 'fail') {
                Taro.showToast({
                    title: '用户信息已失效，请退出重启',
                    icon: 'none',
                    duration: 2000
                });
            } else {
                if (callback) {
                    try {
                        callback(Parse2json(result.body));
                    } catch (e) {
                        console.error("NetWork-jsonparse", e);
                        callback(result.body);
                    }
                }
            }
        } else {
            if(callback){
                callback('');
            }
        }
    }).catch((e) => {
        console.error('FAIL::' + JSON.stringify(e));
        if (retry<3) {
            console.log('Error-retry::' + retry);
            retry ++;
            NetWork.Post({url,params,host,data,retry},callback,error_callback);
        } else {
            retry = 0;
            if(error_callback){
                error_callback(e);
            }
        }
    });
}

/**
    Get
*/
NetWork.Get = function({url,params=undefined,host=WEB_URL,data=undefined,retry=0},callback,error_callback=undefined){
    let queryStr = '';
    if(IsEmpty(params)){
        params = data;
    }
    if (IsEmpty(params)) {
        queryStr = '';
    } else {
        queryStr = ToQueryString(params);
        if (queryStr) {
            queryStr = "?" + queryStr;
        } else {
            queryStr = '';
        }
    }

    let codeUrl = host+url+queryStr;
    console.log(codeUrl);

    Taro.request({
        method: 'GET',
        url: encodeURI(codeUrl),
        dataType: 'jsonp',
        mode: 'same-origin',
        headers:{
            "X-Request-Auth": "UserId/AES"
        },
    }).then((result) => {
        console.log(result);
        if(result.body=='fail'){
            Taro.showToast({
                title: '用户信息已失效，请退出重启',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        if(IsEmpty(callback)){return;}
        if(!IsEmpty(result) && !IsEmpty(result.body)){
            try{
                callback(Parse2json(result.body));
            }catch(e){
                console.error("NetWork-jsonparse", e);
            }
        }else{
            callback({});
        }
    }).catch((e) => {
        console.error('GetUserSets-Error::' + JSON.stringify(e));
        if (retry<3) {
            console.log('Error-retry::' + retry);
            retry ++;
            NetWork.Get({url,params,host,data,retry},callback,error_callback);
        } else {
            retry = 0;
            if(error_callback){
                error_callback(e);
            }
        }
    });
}

NetWork.GetSpe = function({url,retry=0},callback,error_callback){
    Taro.request({
        method: 'GET',
        url: encodeURI(url),
        dataType: 'jsonp',
        mode: 'same-origin',
        headers:{
            "X-Request-Auth": "UserId/AES"
        }
    }).then((result) => {
        console.log(url,result);
        if(result.body=='fail'){
            Taro.showToast({
                title: '用户信息已失效，请退出重启',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        if(IsEmpty(callback)){return;}
        if(!IsEmpty(result) && !IsEmpty(result.body)){
            callback(Parse2json(result.body));
        }else{
            callback('');
        }
    }).catch((e) => {
        console.error('GetUserSets-Error::' + JSON.stringify(e));
        if (retry<3) {
            console.log('Error-retry::' + retry);
            retry ++;
            NetWork.GetSpe({url,retry},callback,error_callback);
        } else {
            retry = 0;
            if(error_callback){
                error_callback(e);
            }
        }
    });
}
export {NetWork};
