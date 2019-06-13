 /**
 *  获取url中的参数
 **/
import Taro from '@tarojs/taro';
import { IsEmpty } from './IsEmpty.js';
var GetQueryString = function({name,self=''}){
	let lastParam = '';
	if (!IsEmpty(self)) {
		let querys = self.props.navigation.state.params;


		if (!IsEmpty(querys)) {
			lastParam = querys[name];
		}
	}
	
	// let destr = IsEmpty(string)?lastParam:string;
	// let r = destr.substring(destr.indexOf('?')+1,destr.length).match(reg);
	
	if (lastParam != null && lastParam != undefined) return lastParam;
	return null;
}
export { GetQueryString };
