 /**
 *  获取url中的参数
 **/
import Taro from '@tarojs/taro';
import { IsEmpty } from './IsEmpty.js';
var GetQueryString = function({name,string=''}){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");

	// let currentPages = Taro.getCurrentPages();
	// let lastPage = currentPages[currentPages.length];
	// var destr = IsEmpty(string)?lastPage:string;
	// var r = destr.substring(destr.indexOf('?')+1,destr.length).match(reg);
	// if (r != null)return unescape(decodeURI(r[2]));
	return null;
}
export { GetQueryString };
