/**
*数据存储
*@author cy
*query {key1:value1,key2:value2}
**/
import Taro from '@tarojs/taro';
import { IsEmpty } from './IsEmpty';
var LocalStore = {};

LocalStore.Set = function(query,callback,error) {
	for(let key in query){
		if (typeof(query[key])!="string") {
			query[key] = JSON.stringify(query[key]);
		}
	}
	for(let key in query){
		Taro.setStorage({key:key,data:query[key]}).then((result) => {
			console.log(result);
		}).catch((error) => {
			if(error){
				console.error(error);
				error();
			}
		});
	}
	
}

LocalStore.SetSync = function(query,callback,error) {
	for(let key in query){
		if (typeof(query[key])!="string") {
			query[key] = JSON.stringify(query[key]);
		}
	}
	for(let key in query){
		Taro.setStorageSync(newQuery.key,newQuery.data);
	}
}

LocalStore.Get = function(keys,callback) {
	let res = [];
	for(let key in query){
		Taro.getStorage({key:query[key]}).then((result) => {
			if(!IsEmpty(result.data)){
				let oneRes = {};
				oneRes[query[key]] = result.data;
				res.push(oneRes);
			}
		}).catch((error) => {
			console.error(error);
		});
	}
	callback(res);
}
LocalStore.GetSync = function(keys,callback) {
	let res = [];
	for(let key in query){
		Taro.getStorageSync(query[key]).then((result) => {
			if(!IsEmpty(result.data)){
				let oneRes = {};
				oneRes[query[key]] = result.data;
				res.push(oneRes);
			}
		}).catch((error) => {
			console.error(error);
		});
	}
	callback(res);
}

LocalStore.Remove = function(keys) {
	for(let key in query){
		Taro.removeStorage({key:query[key]}).then((result) => {
			console.log(result);
		}).catch((error) => {
			console.error(error);
		});
	}
}

LocalStore.RemoveAll = function(callback=undefined) {
	Taro.clearStorage();
}

export {LocalStore};
