import { NetWork } from '../Public/Common/NetWork/NetWork.js';
import {Domain} from '../Env/Domain';


/**获取用户服务到期时间
* @param {string} aliId 用户Id
* 0.0.1 目前只支持交易商品手机端 trade 和 item
*/
var GetExpiryTime = function({aliId,type,SuccessCallBack,ErrorCallBack}){
	NetWork.Get({
		url:'m1688/get_service_end',
		params:{
			aliId:aliId,
			type:type,
		},
	},(data)=>{
		SuccessCallBack(data);
	},)
}


/**
 * 获取订单信息
 * @param {string} shopId 店铺ID（不传获取所有的订单信息）
 */
var GetOrderInfo = function({shopId,SuccessCallBack,ErrorCallBack}){
	NetWork.Get({
		url:'Orderreturn/getOrderMessages',
		params:{
			shopId:shopId
		}
	},(data)=>{
		SuccessCallBack(data);
	},)
}

/**
 * 同步店铺订单
 * @param {string} shopId 店铺ID
 * shopName  店铺名
 * shopType  店铺类型 
 */
var SyncShop = function({shopId,shopName,shopType,SuccessCallBack,ErrorCallBack}){
	NetWork.Get({
		url:'Orderreturn/synchroOrders',
		params:{
			shopId:shopId,
			shopName:shopName,
			shopType:shopType
		}
	},(data)=>{
		SuccessCallBack(data);
	},(error)=>{
		if (ErrorCallBack) {
			ErrorCallBack(error);
		}
	})
}
//Orderreturn/getLogMessage

/**
 * 获取铺货日志
 * @param {string} shopId 店铺ID
 */
var GetGoodsLog = function({SuccessCallBack,ErrorCallBack}){
	NetWork.Get({
		url:'Orderreturn/getLogMessage',
	},(data)=>{
		SuccessCallBack(data);
	})
}

/**
 * 获取店铺同步状态
 * @param {string} shopId 店铺ID
 */
var GetOrderState = function({shopId,SuccessCallBack,ErrorCallBack}){
	NetWork.Get({
		url:'Orderreturn/getProgress',
		params:{
			shopId:shopId
		}
	},(data)=>{
		SuccessCallBack(data);
	},)
}

/**
 * 获取用户库存预警设置
 * @param {string} userNick 用户昵称
 */
var GetSyncSetting = function({userNick,SuccessCallBack,ErrorCallBack}){
	NetWork.Post({
		url:'dishelper/getsyncsetting',
		host:Domain.WECHART_URL,
		params:{
			nick:userNick,
		}
	},(rsp)=>{
		SuccessCallBack(rsp);
	},)
}

/**
 * 获取用户属性，偏好等等
 * @param {string} userNick 用户昵称
 */
var GetUserAttr = function () {
	NetWork.Post({
		url: 'm1688/get_user_attr',
		params: {}
	}, (rsp) => {})
}


export { GetExpiryTime,GetOrderInfo,GetOrderState,SyncShop,GetGoodsLog,GetSyncSetting,GetUserAttr };
