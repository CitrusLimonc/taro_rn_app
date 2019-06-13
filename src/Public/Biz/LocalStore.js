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
		if (typeof(query[key]) != "string") {
			query[key] = JSON.stringify(query[key]);
		}
	}
	for(let key in query){
		Taro.setStorage({key:key,data:query[key]}).then((result) => {
			console.log('LocalStore-Set',query[key],result);
			if (callback) {
				callback(result);
			}
		}).catch((err) => {
			console.error(err);
			if(error){
				error(err);
			}
		});
	}
	
}

LocalStore.Get = function(query,callback,error) {
	let res = [];
	let promises = [];
	let index = 0;

	for(let key in query){
		promises.push(
			new Promise(function(resolve,reject){
				let oneRes = {};
				Taro.getStorage({key:query[key]}).then((result) => {
					console.log('LocalStore-Get',query[key],result.data);
					if(!IsEmpty(result.data)){
						oneRes[query[key]] = result.data;
					}
					resolve(oneRes);
				}).catch((err) => {
					console.error(err);
					resolve(oneRes);
				});
			})
		);
	}

	Promise.all(promises).then(function(result){
		console.log('LocalStore-Promise',result);

		let promiseRes = {};
		for (let i = 0; i < result.length; i++) {
			let item = result[i];
			let storeName = '';
			for(let key in item){
				storeName = key;
			}
			for (let j = 0; j < query.length; j++) {
				if(storeName == query[j]){
					promiseRes[storeName] = item[storeName];
				}
			}
		}
		callback(promiseRes);
	});
}

LocalStore.Remove = function(query) {
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
