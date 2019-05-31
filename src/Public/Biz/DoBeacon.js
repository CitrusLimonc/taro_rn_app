/**
 * 埋点
 */
import Taro from '@tarojs/taro';

var DoBeacon = function(ProjectCode, EventCode, UserNick){
    console.error();
    let data ="https://mcs.aiyongbao.com/1.gif?t=" + (new Date).getTime() + "&p=" + ProjectCode + "&n=" + UserNick + "&e=" + EventCode;
    // if(window.__weex_env__.platform == "iOS"){
    //     data ="https://mcs.aiyongbao.com/1.gif?t=" + (new Date).getTime() + "&p=" + ProjectCode + "&n=" + encodeURIComponent(UserNick) + "&e=" + EventCode;
    // }
    console.log(data);
    Taro.request({
        method: 'GET',
        url: encodeURI(data),
    }).then((result) => {
        console.log('DoBeacon',result);
    }).catch((error) => {
        console.error('DoBeacon',error);
    });
};
export {DoBeacon};
