 /**
 *  判断手机是否为iphoneX
 **/
var IsIphoneX= function(){
    let weex_env = window.__weex_env__;
    let screenHeight = window.screen.height;
    let isPhoneX = weex_env && weex_env.deviceModel.indexOf('iPhone10') >= 0 && screenHeight == 2436;

    return isPhoneX;
}
export {IsIphoneX} ;
