/** 
 * 工具
 * @author cy
 **/
var UitlsRap = {};
import Taro from '@tarojs/taro';
/**
* 粘贴板
* value string userid
* callback funciton 回调
*/
UitlsRap.clipboard = function(value,callback){
	Taro.setClipboardData({
		data:value
	});
	if(callback){
		callback()
	}
}

export  {UitlsRap};
