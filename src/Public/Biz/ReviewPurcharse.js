/**
 * 重组采购单，主要是同一供应商拼在一起，方便显示
 */
import {IsEmpty} from './IsEmpty.js';
import {Parse2json} from './Parse2json.js';
var ReviewPurcharse = function (purchase) {
    for (let k = 0; k < purchase.length; k++) {
        if (purchase[k].isPurchaseOrder == '1') {
            let subOrderList = purchase[k].order.orderModel.subOrderList;
            let len = subOrderList.length;
            for (let i = 0; i < len; i++) {
                for (let j = i+1; j < len; j++) {
                    if (subOrderList[i].supplierNickName == subOrderList[j].supplierNickName) {
                        if (IsEmpty(subOrderList[i].itemlist)) {
                            subOrderList[i].itemlist = [];
                            subOrderList[i].itemlist.push(Parse2json(JSON.stringify(subOrderList[i])));
                            subOrderList[i].itemlist.push(Parse2json(JSON.stringify(subOrderList[j])));
                        } else {
                            subOrderList[i].itemlist.push(Parse2json(JSON.stringify(subOrderList[j])));
                        }
                        subOrderList.splice(j,1);
                        len = len-1;
                        j--;
                    }
                }
            }
            purchase[k].order.orderModel.subOrderList = Parse2json(JSON.stringify(subOrderList));
        }
    }

    return purchase;
};
export {
    ReviewPurcharse
};
