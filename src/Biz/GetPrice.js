//获取最高价和最低价
import {IsEmpty} from '../Public/Biz/IsEmpty.js';
var GetPrice = function(data,type = 'normal'){
    let price=0;
    let max=0;//最高价
    let min=0;//最低价
    if (data.saleInfo.quoteType==0 || data.saleInfo.quoteType==2) {
        if (!IsEmpty(data.saleInfo.priceRanges)) {
            max=data.saleInfo.priceRanges[0].price;
            min=data.saleInfo.priceRanges[0].price;
            data.saleInfo.priceRanges.map((item,key)=>{
                if (item.price>max) {
                    max=item.price;
                }

                if (item.price<min) {
                    min=item.price;
                }
            })
        }
    } else if (data.saleInfo.quoteType==1) {
        for (var i = 0; i < data.skuInfos.length; i++) {
            //库存为0的或者价格不存在的不算在价格区间内
            if(!IsEmpty(data.skuInfos[i].price)){
                max=data.skuInfos[i].price;
                min=data.skuInfos[i].price;
                break;
            }
        }
        data.skuInfos.map((item,key)=>{
            if(!IsEmpty(item.price)){
                if (item.price>max) {
                    max=item.price;
                }
                if (item.price<min) {
                    min=item.price;
                }
            }
        })
    }

    if (type == 'one') {
        return min;
    } else {
        if (max == min) {
            return '¥' + parseFloat(min).toFixed(2);
        } else {
            return '¥' + parseFloat(min).toFixed(2) + '~¥' + parseFloat(max).toFixed(2);
        }
    }
}

export {GetPrice};
