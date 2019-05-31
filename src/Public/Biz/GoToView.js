/**
 * @author cy
 */
import Taro from '@tarojs/taro';
import { IsEmpty } from './IsEmpty.js';
/**
 * 页面之间的交互
 * status string 页面url
 * query object 跳转参数
 * page_status string 页面事件 push:跳转 pop:返回
 */
var GoToView = function({status=undefined,query={},page_status='push',pop_index=1}){
	if (!status) {
		status = 'index';
	}
	let str = '';
    if(!IsEmpty(query)){
        if (typeof(query) == 'string') {
            str = '?query=' + query;
        } else if (typeof(query) == 'object') {
            str = '?';
            for(let key in query){
    			if(IsEmpty(query[key])){
    				query[key] = '';
    			}
    			str += key + '=' + query[key] + "&";
    		}
        }
	}

	switch (page_status){
		case "push":{ //跳转到目的页面，打开新页面
			Taro.navigateTo({
				url: 'pages/'+status+'/index'+str,
			});
			break;
		}
		case "pop":{
			Taro.navigateBack({
				delta:1 
			});
			break;
		}
		case "popTo":{
			Taro.navigateBack({
				delta:pop_index
			});
			break;
		}
		case "special":{
			Taro.navigateTo({
				url: status,
			});
			break;
		}
		default:break;
	}

}

export {GoToView};