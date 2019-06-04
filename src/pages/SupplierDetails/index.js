import Taro, { Component, Config } from '@tarojs/taro';
import {View,Text} from '@tarojs/components';
import Event from 'ay-event';
import {GetQueryString} from '../../Public/Biz/GetQueryString.js';
import styles from './styles';
import GoodsProductMap from '../../Component/GoodsProductMap';
import ItemIcon from '../../Component/ItemIcon';
import {Modal} from '../../Public/Components/Modal';
import { GoToView } from '../../Public/Biz/GoToView.js';
import { NetWork } from '../../Public/Common/NetWork/NetWork.js';
import px from '../../Biz/px.js';
/**
 * @author SmingPro
 * 货源推荐
 */
const PAGE_SIZE = 20;
export default class SupplierDetails extends Component {
    constructor(props) {
		super(props);
		this.state = {
			allConsignmentData: [],//数据源
            loadmore:false, //是否加载更多
            isRefreshing: false, //是否下拉刷新
            refreshText: '↓ 下拉刷新', //下拉刷新文字
		}
		this.memberId = ""; //供应商memberid
		this.supplierLoginId = ""; //供应商昵称
		this.supplierCompany = ""; //供应商公司名
		this.pageNo = 1; //页码
		this.alreadyConsignmentSum = 0; //已代销货品数
		this.allConsignmentSum = 0; //可代销货品数
		this.relationModels = {};
		this.needmemberid =0;
	}

	// config: Config = {
    //     navigationBarTitleText: '合作中的供应商'
	// }

	componentWillMount(){
		this.memberId = GetQueryString({
			name :'memberId'
		});
		this.needmemberid = GetQueryString({
			name :'needmemberid'
		});
		this.supplierLoginId = decodeURI(GetQueryString({
			name :'supplierLoginId'
		}));
		this.sumForAlreadyConsignment(1);
		this.querySuppliers();
		this.listForAllConsignment(1);
	}
	/**
	 * 获取已代销产品总数
	 */
	sumForAlreadyConsignment = (pageNo) => {
		let self = this;
		NetWork.Get({
			url:"Distributeproxy/listForAlreadyConsignment",
			data:{
				supplierMemberId: this.memberId,
				pageNo: pageNo,
				pageSize: PAGE_SIZE,
			}
		},(result)=>{
			self.alreadyConsignmentSum = result.count;
			console.log("sumForAlreadyConsignment", result);
		},(error)=>{
			console.error(error);
		});
	}
	/**
	 * 获取可代销产品列表
	 */
	listForAllConsignment = (pageNo) => {
		let self = this;
		NetWork.Get({
			url:"Distributeproxy/listForAllConsignment",
			data:{
				supplierMemberId: this.memberId,
				pageNo: pageNo,
				pageSize: PAGE_SIZE,
			}
		},(result)=>{
			self.allConsignmentSum = result.count;
			console.log("SupplierDetails-listForAllConsignment", result);
			let dataarr = [];
            //重组数据
			for (let i in result.productInfo) {
				if (result.productInfo[i].tips == "商品已删除") {
					continue;
				}
				let data = {};
				data.title = result.productInfo[i].productTitle;
				data.primaryID = result.productInfo[i].productId;
				data.price = result.productInfo[i].minPurchasePrice;//最低采购价
				data.image = "https://cbu01.alicdn.com/" + result.productInfo[i].picURI;
				dataarr[dataarr.length] = data;
			}
			if (dataarr.length % 2 != 0) {
				dataarr.pop();
			}

            console.log("SupplierDetails-dataarr", dataarr);
			if (dataarr.length > 0 && dataarr.length <= 6) {//当上一页页数据<6时，加载下一页数据

                console.log("当上一页页数据<6时，加载下一页数据", self.state.allConsignmentData);
				self.state.allConsignmentData = self.state.allConsignmentData.concat(dataarr);
                self.pageNo += 1;
				self.listForAllConsignment(self.pageNo);
			}else{

                console.log("结束", self.state.allConsignmentData);

				self.setState({
					allConsignmentData: self.state.allConsignmentData.concat(dataarr),
                    loadmore:false
				});
                self.refs.supperlierList.resetLoadmore();
			}
		},(error)=>{
			self.setState({
                loadmore:false
            });
			console.error(error);
		});
	}
	/**
	 * 查询供应商列表
	 */
	querySuppliers=()=>{
		let self = this;
		NetWork.Get({
			url:"Distributeproxy/querySuppliers",
			data:{
				supplierLoginId: this.supplierLoginId,
				currentPage: 1,
				pageSize: 1,
			}
		},(result)=>{
			console.log("querySuppliers", result);
			self.relationModels = result.result.relationModels[0];
			self.supplierCompany = self.relationModels.supplierCompany;
		},(error)=>{
			console.error(error);
		});
	}
    // 底部加载更多
	loadmore = () => {
        this.refs.supperlierList.resetLoadmore();
        console.log("loadmore", this.pageNo);
        this.setState({
            loadmore:true
        });
        this.pageNo += 1;
		this.listForAllConsignment(this.pageNo);
	};
	/**
	 * 终止合作
	 * https://open.1688.com/api/api.htm?ns=cn.alibaba.open&n=alibaba.relation.endConsignRelationByConsigner&v=1
	 */
	endConsign = ()=>{
		NetWork.Get({
			url:"Distributeproxy/endConsignRelationByConsigner",
			data:{
				supplierLoginId: this.supplierLoginId,
			}
		},(result)=>{
			console.log("endConsignRelationByConsigner", result);
			Taro.showToast({
				title: '[' + this.supplierLoginId+']已终止合作!',
				icon: 'none',
				duration: 2000
			});
			Event.emit('App.RefreshSupplierList');
			GoToView({ page_status: 'pop' });
		},(error)=>{
			console.error(error);
		});
	}

    //渲染终止合作
	endConsignDialog = ()=>{
		let self = this;
		console.log("self.refs", self.refs);
		let footjsx = (
			<View style={[styles.foot]}>
				<View onClick={() => { self.refs.demo.hide(); }} style={[styles.button, { backgroundColor: '#fff', borderBottomLeftRadius: px(10) }]}>
					<Text style={{ fontSize: px(32) }}>取消</Text>
				</View>
				<View onClick={() => { self.refs.demo.hide(); self.endConsign(); }} style={[styles.button, { backgroundColor: '#FF6000', borderBottomRightRadius: px(10) }]}>
					<Text style={{ fontSize: px(32), color: '#fff' }}>终止合作</Text>
				</View>
			</View>
		);
		Modal.alert({
			element: this.refs.demo,
			head: "确定要终止合作吗？",
			foot: footjsx,
			body: "终止合作后您代销的该供应商的所有商品都将取消代销关系，您可能面临因缺货而丢单的风险",
		});
	}
    //打开旺旺
	openChat = (loginid) => {
		console.log('联系了[' + loginid + "]");
		// RAP.aliwangwang.openChat(loginid).then((result) => {
		// 	console.log("成功", result);
		// }).catch((error) => {
		// 	console.log('失败', error);
		// });
	}
    //下拉刷新
    handleRefresh = () => {
        this.setState({
            isRefreshing: true,
            refreshText: '加载中...',
        });
        this.pageNo = 1;
        this.sumForAlreadyConsignment(this.pageNo);
		this.querySuppliers();
		this.listForAllConsignment(this.pageNo);
        setTimeout(() => {
            this.setState({
                isRefreshing: false,
                refreshText: '↓ 下拉刷新',
            });
        }, 2000);
    }
    //渲染头部的下拉刷新
    renderHeader = () =>{
        return (
            <RefreshControl refreshing={this.state.isRefreshing} style={styles.itemRefresh} onRefresh={this.handleRefresh}>
                <Text style={{fontSize:px(28),color:"#3089dc"}}>{this.state.refreshText}</Text>
            </RefreshControl>
        );
    }

    //渲染整个页面
    renderRow = () =>{
        let doms = [];
        doms.push(
            <View style={{backgroundColor:"#fff",height:px(260)}}>
                <View style={{justifyContent:"space-between",flexDirection: 'row',paddingBottom: px(25), paddingLeft: px(25), paddingRight: px(25), paddingTop: px(25),borderBottomWidth: 1,borderColor: "#f2f2f2"}}>
                    <View style={{ flex: 1, flexDirection: 'row',alignItems:"center" }} onClick={this.openChat.bind(this, this.supplierLoginId)}>
                        <ItemIcon code={"\ue6ba"} iconStyle={{ fontSize: px(40), color: '#2DA9F7', paddingRight: px(16), paddingLeft: px(32) }} />
                        <Text style={{fontSize:px(28),color:"#333333"}}>{this.supplierCompany}</Text>
                    </View>
                </View>
                <View style={{justifyContent:"space-around",flexDirection: 'row',height:px(180),alignItems: 'center',}}>
                    <View style={{justifyContent:"center",alignItems:"center"}}>
                        <View style={{paddingBottom: px(24),paddingTop: px(24),}}>
                            <Text style={{fontSize:px(32),color:"#333333"}}>{this.relationModels.lastAmount}</Text>
                        </View>
                        <View style={{paddingBottom: px(24)}}>
                            <Text style={{fontSize:px(28),color:"#999999"}}>180 天交易金额</Text>
                        </View>
                    </View>
                    <View style={{justifyContent:"center",alignItems:"center"}}>
                        <View style={{paddingBottom: px(24),paddingTop: px(24),}}>
                            <Text style={{fontSize:px(32),color:"#333333"}}>{this.alreadyConsignmentSum}</Text>
                        </View>
                        <View style={{paddingBottom: px(24)}}>
                            <Text style={{fontSize:px(28),color:"#999999"}}>已代销货品数</Text>
                        </View>
                    </View>
                    <View style={{justifyContent:"center",alignItems:"center"}}>
                        <View style={{paddingBottom: px(24),paddingTop: px(24),}}>
                            <Text style={{fontSize:px(32),color:"#333333"}}>{this.allConsignmentSum}</Text>
                        </View>
                        <View style={{paddingBottom: px(24)}}>
                            <Text style={{fontSize:px(28),color:"#999999"}}>可代销货品数</Text>
                        </View>
                    </View>
                </View>
            </View>
        );

        let needMid = false;
        if (this.needmemberid == '1') {
            needMid = true;
        }

        doms.push(
            <View style={{marginTop:px(24),backgroundColor:"#fff",paddingTop:px(24)}}>
                <GoodsProductMap needMid={needMid} supplierMemberId ={this.memberId} ref={"goods"} rows={2} dataSource={this.state.allConsignmentData} />
            </View>
        );

        return doms;
    }
    //渲染底部
    renderFooter = () => {
        return this.state.loadmore ? (
                <View style={styles.loadmore_view}>
                    <Text style={styles.loadmore_text}>加载更多</Text>
                </View>
            ):(null)
    }

    render(){
		// console.log(this.supplierCompany,"this.supplierCompany");
        return (
            <View>
                <ListView
                ref = "supperlierList"
                style = {{flex:1,backgroundColor:'#f5f5f5'}}
                onEndReachedThreshold={800}
                onEndReached={this.loadmore}
                renderHeader = {this.renderHeader}
                renderRow = {this.renderRow}
                renderFooter = {this.renderFooter}
                dataSource = {['null']}
                />
				<View style={styles.zdy_v}>
					<View onClick={this.endConsignDialog} style={styles.zdy_l}>
						<Text style={styles.text_l}>终止合作</Text>
					</View>
				</View>
				<Modal.AyDialog ref='demo'/>
            </View>
        );
    }
}