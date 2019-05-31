import Taro, { Component, Config } from '@tarojs/taro';
import {View,Text} from '@tarojs/components';
import styles from './styles';
import GoodsProductMap from '../../Component/GoodsProductMap';
import ItemIcon from '../../Component/ItemIcon';
import { GoToView } from '../../Public/Biz/GoToView.js';
import { IsEmpty } from '../../Public/Biz/IsEmpty.js';
import { NetWork } from '../../Public/Common/NetWork/NetWork';
/**
 * @author SmingPro
 * 货源推荐
 */
const PAGE_SIZE = 10;
export default class SupplierList extends Component {
    constructor(props) {
		super(props);
		this.state = {
			rowData: [], //供应商列表
            isRefreshing: false, //是否下拉刷新
			refreshText: '↓ 下拉刷新', //下拉刷新文字
            loadmore:false //是否加载更多
		}
		this.memberId = ""; //供应商memberid
		this.supplierLoginId = ""; //供应商昵称
		this.pageNo = 1; //页码
		this.relationModels = [];
		this.suppliersCount = 0; //供应商总数
		this.singleSuppliersCount = 0;

		let self = this;
		//刷新供应商列表
		// RAP.on('App.RefreshSupplierList', (data) => {
		// 	self.pageNo = 1;
		// 	self.setState({
		// 		rowData:[],
		// 	});
		// 	Taro.showLoading({ title: '供应商列表加载中...' });
		// 	self.querySuppliers(1);
		// });
	}

	// config: Config = {
    //     navigationBarTitleText: '合作中的供应商'
	// }
	
	componentDidMount(){
		Taro.showLoading({ title: '供应商列表加载中...' });
		this.querySuppliers(1);
	}

	/**
	 * 查询供应商列表
	 */
	querySuppliers = (pageNo) => {

		this.pageNo++;
		let self = this;
		NetWork.Get({
			url:"Distributeproxy/querySuppliers",
			data:{
				currentPage: pageNo,
				pageSize:PAGE_SIZE,
			}
		},(result)=>{
			console.log("SupplierList-querySuppliers",result);
			if (!IsEmpty(result.result) && !IsEmpty(result.result.relationModels)) {
				let querySuppliersResult = result.result;
				self.suppliersCount = querySuppliersResult.count;
				self.singleSuppliersCount = querySuppliersResult.relationModels.length;
				if (parseInt(querySuppliersResult.count) > 0) {
					let dataarr = [];
					for (let i in querySuppliersResult.relationModels) {
						let data = {};
						data.title = querySuppliersResult.relationModels[i].supplierCompany;
						data.primaryID = querySuppliersResult.relationModels[i].memberId;
						data.supplierLoginId = querySuppliersResult.relationModels[i].supplierLoginId;
						dataarr[dataarr.length] = data;
					}
					self.relationModels = dataarr;
					self.listForAllConsignment();
				}
			} else {
                self.setState({
                    loadmore:false,
                    refreshText: '↓ 下拉刷新',
                    isRefreshing:false
                });
            }
			Taro.hideLoading();
		},(error)=>{
			self.setState({
                loadmore:false,
                refreshText: '↓ 下拉刷新',
                isRefreshing:false
            });
			Taro.hideLoading();
			console.error(error);
		});
	}
	/**
	 * 获取可代销产品列表
	 */
	listForAllConsignment = () => {
		let self = this;
		this.relationModels.map((item, index) => {
			// console.log(index, item);
			NetWork.Get({
				url:"Distributeproxy/listForAllConsignment",
				data:{
					supplierMemberId: item.primaryID,
					pageNo: 1,
					pageSize: PAGE_SIZE,
				}
			},(result)=>{
				// console.log("listForAllConsignment", result);
				let dataarr = [];
				for (let i in result.productInfo) {
					let data = {};
					data.primaryID = result.productInfo[i].productId;
					data.price = result.productInfo[i].minPurchasePrice;
					data.image = "https://cbu01.alicdn.com/" + result.productInfo[i].picURI;
					dataarr.push(data);
				}
				if (dataarr.length > 9) {
					dataarr[dataarr.length] = {
						title: undefined,
						image: "https://q.aiyongbao.com/1688/web/img/shopsMore.png",
						primaryID: 'supperlierList'
					}
				}
				item.productInfo = dataarr;
				// console.log("index", index);
				// console.log("self.suppliersCount", self.suppliersCount);
				// console.log("self.singleSuppliersCount", self.singleSuppliersCount);
				if (index == (self.suppliersCount - 1) || index == self.singleSuppliersCount - 1) {
					// console.log("listForAllConsignment-2", JSON.stringify(self.relationModels));
					Taro.hideLoading();
					setTimeout(function () {
						self.setState({
							rowData: self.state.rowData.concat(self.relationModels),
                            loadmore:false,
                            refreshText: '↓ 下拉刷新',
                            isRefreshing:false
						});
                        // self.refs.supperlierList.resetLoadmore();
					}, 300);
				}
			},(error)=>{
				self.setState({
                    loadmore:false,
                    refreshText: '↓ 下拉刷新',
                    isRefreshing:false
                });
				Taro.hideLoading();
				console.error(error);
			});
		});
	}

    // 底部加载更多
	listLoadMore = () => {
        console.log('到底了。。');
        if (this.state.rowData.length < 10) {
            return ;
        }
        this.setState({
            loadmore:true
		});
		this.querySuppliers(this.pageNo);
	}
    //跳转页面
	goToView = (info)=>{
		GoToView(info);
	}
    //打开旺旺
	openChat = (loginid)=>{
		console.log('联系了[' + loginid+"]");
		// RAP.aliwangwang.openChat(loginid).then((result) => {
		// 	console.log("成功", result);
		// }).catch((error) => {
		// 	console.log('失败', error);
		// });
	}
    //渲染页面主体
	showLists = (item,index)=>{
        return (
            <View style={{backgroundColor:"#fff",marginBottom:px(24)}}>
                <View style={{justifyContent:"space-between",flexDirection: 'row',alignItems:'center',paddingBottom: px(24), paddingLeft: px(24), paddingRight: px(24), paddingTop: px(24),}}>
                    <View style={{ flex: 7, flexDirection: 'row',alignItems:'center' }} onClick={this.openChat.bind(this,item.supplierLoginId)}>
                        <ItemIcon code={"\ue6ba"} iconStyle={{ fontSize: px(40), color: '#2DA9F7', paddingRight: px(16)}} />
                        <Text style={{fontSize:px(28), color: "#333333", width: px(400), textOverflow: 'ellipsis', }} ellipsizeMode={'tail'} numberOfLines={1}>{item.title}</Text>
                    </View>
                    <View
                    onClick={
                        this.goToView.bind(this, {
                            status:'SupplierDetails',
                            query:{
                                supplierLoginId: encodeURIComponent(item.supplierLoginId),
                                memberId:item.primaryID
                            }
                        })
                    } style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                        <Text style={{fontSize:px(28),color:"#999999"}}>更多货源</Text>
                        <ItemIcon code={"\ue6a7"} iconStyle={{fontSize:px(40),color:'#979797'}}/>
                    </View>
                </View>
                <GoodsProductMap size={"small"}
                type={"price"}
                horizontal={true}
                dataSource={item.productInfo}
                supplierLoginId={item.supplierLoginId}
                memberId={item.primaryID}
                goProduct={true} />
            </View>
        );

	}
    //下拉加载更多
    handleRefresh = () =>{
        this.setState({
			isRefreshing: true,
			refreshText: '加载中...',
		});
        this.querySuppliers(1);
    }
    //渲染下拉刷新
    renderHeader = () =>{
        return (
            <RefreshControl refreshing={this.state.isRefreshing} style={styles.itemRefresh} onRefresh={this.handleRefresh}>
                <Text style={{fontSize:px(28),color:"#3089dc"}}>{this.state.refreshText}</Text>
            </RefreshControl>
        );
    }
    //渲染底部
    renderFooter = () =>{
        return this.state.loadmore ? (
                <View style={styles.loadmore_view}>
                    <Text style={styles.loadmore_text}>加载更多</Text>
                </View>
            ):(null)
    }
    //渲染空列表
    rederNull = (item,index) =>{
        return(
            <View style={{backgroundColor:"#fff",marginBottom:px(24)}}>
                <View style={{justifyContent:"space-between",flexDirection: 'row',alignItems:'center',paddingBottom: px(24), paddingLeft: px(24), paddingRight: px(24), paddingTop: px(24),}}>
                    <View style={{flex:7,flexDirection:'row',alignItems:'center'}}>
                        <ItemIcon code={"\ue6ba"} iconStyle={{ fontSize: px(40), color: '#2DA9F7', paddingRight: px(16)}} />
                        <View style={{backgroundColor:"#fafafa",width:px(300),height:px(46),}}></View>
                    </View>
                    <View onClick={this.goToView.bind(this,{status:''})} style={{flex:3,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                        <Text style={{fontSize:px(28),color:"#999999"}}>更多货源</Text>
                        <ItemIcon code={"\ue6a7"} iconStyle={{fontSize:px(40),color:'#979797'}}/>
                    </View>
                </View>
                <GoodsProductMap size={"small"} horizontal={true} dataSource={[]} />
            </View>
        );
    }

    render(){
		// console.log("render", this.state.rowData);
        return (
            <View>
                {
                    this.state.rowData.length > 0 ?
                    <ListView
                    ref = "supperlierList"
                    style = {{flex:1,backgroundColor:'#f5f5f5'}}
                    onEndReachedThreshold = {300}
                    onEndReached = {this.listLoadMore}
                    renderFooter = {this.renderFooter}
                    renderHeader = {this.renderHeader}
                    renderRow = {this.showLists}
                    dataSource = {this.state.rowData}
                    />
                    :
                    <ListView
                    style = {{flex:1,backgroundColor:'#f5f5f5'}}
                    renderHeader = {this.renderHeader}
                    renderRow = {this.rederNull}
                    dataSource = {['1','2','3']}
                    />
                }
            </View>
        );
    }
}