import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text,ScrollView,Image} from '@tarojs/components';
import { Toast , Portal , Grid } from '@ant-design/react-native';
import { FlatList , RefreshControl}  from 'react-native';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import GoodsProductMap from '../../Component/GoodsProductMap';
import {GoToView} from '../../Public/Biz/GoToView.js';
import ItemIcon from '../../Component/ItemIcon';
// import {UitlsRap} from '../../Public/Biz/UitlsRap.js';
import styles from './styles.js';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import {DoBeacon} from '../../Public/Biz/DoBeacon';
import {Domain} from '../../Env/Domain';
import px from '../../Biz/px.js';

/**
 * @author SmingPro
 * 货源推荐
 */
const PAGE_SIZE = 20;
export default class RecommendationSource extends Component {
    constructor(props) {
        super(props);
        this.state={
			gridData :[], //当前显示的推荐商品数据
			rowData:[], //供应商数据
			slider:[],//轮播图内容
			suppliers:[], //优质供应商列表
			newsuppliers:[],//新版优质供应商列表
			isRefreshing: false, //是否正在下拉刷新
			refreshText: '↓ 下拉刷新', //下拉刷新文字
			loadmore:false, //是否加载更多
			loginId:'', //用户名
			cargo:[],
			titlePic:'',
		};
		this.gridDataSource = [];//所有推荐商品数据源
		this.page_no = 1; //页码
		this.suppliersCount = 0; //供应商个数
		this.singleSuppliersCount = 0;//第一页供应商数
		this.relationModels = []; //供应商列表
		this.userInfo = {}; //用户信息
	}
	
	config = {
        navigationBarTitleText: '货源推荐'
    }

    componentWillMount(){
		let self = this;
		//获取用户信息
		self.userInfo = {
			'loginId':'萌晓月cy',
			'userId':'2190174972'
		};
		DoBeacon('TD20181012161059','goodspage_show',self.userInfo.loginId);
		// this.getSumSuggest();
		// this.getSlider();
		// this.querySuppliers();
		// this.getNewBestSupplier();	
		// this.getCargo();	
		// this.getbestsupplier();
	}

	/**
	 * 获取优质供应商列表
	 */
	// getbestsupplier=()=>{
	// 	let self = this;
    //     NetWork.Post({
	// 		url:'dishelper/index',
	// 		host:Domain.WECHART_URL,
    //     },(rsp)=>{
	// 		if(rsp.code == 200){
	// 			for(let i=0;i<rsp.value.length;i++){
	// 				let item = rsp.value[i];
	// 				NetWork.Post({
	// 					url:'dishelper/getprodect',
	// 					host:Domain.WECHART_URL,
	// 					params:{
	// 						memberId:item.memberId,
	// 						page:0,
	// 						pagenum:4,
	// 					}
	// 				},(result)=>{
	// 					console.log('kankanresult',result.value)
	// 					rsp.value[i].newsuppliergoods = result.value
	// 					// if(i>=(rsp.count-1)){
	// 						self.setState({
	// 							suppliers:rsp.value
	// 						})
	// 					// }
	// 				});
				
	// 			}

	// 		}else{
	// 			Toast.info('获取数据失败', 2);
	// 		}
    //     });
	// }

	/**
	 * 获取轮播图内容
	 */
	getSlider=()=>{
		let self = this;
        NetWork.Post({
			url:'dishelper/slider',
			host:Domain.WECHART_URL,
        },(rsp)=>{
			if(rsp.code == 200){
				self.setState({
					slider:rsp.value
				})
			}else{
				Toast.info('获取数据失败', 2);
			}

        });
	}
	/**
	 * 获取新版优质供应商列表
	 */
	getNewBestSupplier=()=>{
		let self = this;
        NetWork.Post({
			url:'dishelper/getnewsupplier',
			host:Domain.WECHART_URL,
        },(rsp)=>{
			if(rsp.code == 200){
				console.log('kankannewsupplier',rsp);
				for(let i=0;i<rsp.value.length;i++){
					let item = rsp.value[i];
					NetWork.Post({
						url:'dishelper/getprodect',
						host:Domain.WECHART_URL,
						params:{
							memberId:item.memberId,
							page:0,
							pagenum:4,
						}
					},(result)=>{
						console.log('kankanresult',result.value)
						rsp.value[i].newsuppliergoods = result.value
						// if(i>=(rsp.count-1)){
							self.setState({
								newsuppliers:rsp.value
							})
						// }
					});
				
				}

			}else{
				Toast.info('获取供应商数据失败', 2);
			}

        });
	}
	/**
	 * 获取可代销产品列表
	 */
	listForAllConsignment=()=>{
		let self = this;
		console.log("this.relationModels-length", this.relationModels.length);
		this.relationModels.map((item, index) => {
			NetWork.Get({
				url:"Distributeproxy/listForAllConsignment",
				data:{
					supplierMemberId: item.primaryID,
					pageNo: 1,
					pageSize: 1,
				}
			},(result)=>{
				// console.log("listForAllConsignment", result);
				if (!IsEmpty(result) && !IsEmpty(result.productInfo)) {
					if (result.productInfo.length > 0) {
						item.image = "https://cbu01.alicdn.com/" + result.productInfo[0].picURI;
						// console.log("self.suppliersCount", self.suppliersCount);
						// console.log("index", index);
						if (index == (self.suppliersCount - 1) || index == self.singleSuppliersCount - 1) {
							setTimeout(function () {
								self.setState({
									rowData: self.relationModels
								});
							}, 300);
						}
					}
				}else{
					// console.log("self.suppliersCount-1", self.suppliersCount);
					// console.log("index-1", index);

					if (index == (self.suppliersCount - 1) || index == self.singleSuppliersCount - 1) {
						console.log("listForAllConsignment", JSON.stringify(self.relationModels));
						setTimeout(function () {
							self.setState({
								rowData: self.relationModels
							});
						}, 300);
					}
				}
			},(error)=>{
				console.error(error);
			});
		});
	}
	/**
	 * 查询供应商列表
	 */
	querySuppliers=()=>{
		let self = this;
		NetWork.Get({
			url:"Distributeproxy/querySuppliers",
			data:{}
		},(result)=>{
			if (IsEmpty(result.errorCode)) {
				let querySuppliersResult = result.result;
				self.suppliersCount = querySuppliersResult.count;
				if (parseInt(self.suppliersCount) > 0) {
					let dataarr = [];
					self.singleSuppliersCount = querySuppliersResult.relationModels.length;
					for (let i in querySuppliersResult.relationModels) {
						let data = {};
						data.title = querySuppliersResult.relationModels[i].supplierCompany;
						data.primaryID = querySuppliersResult.relationModels[i].memberId;
						data.supplierLoginId = querySuppliersResult.relationModels[i].supplierLoginId;
						dataarr[dataarr.length] = data;
					}
					if (dataarr.length > 9) {
						dataarr[dataarr.length] = {
							title: undefined,
							image: "https://q.aiyongbao.com/1688/web/img/shopsMore.png",
							primaryID: 'source'
						}
					}
					self.relationModels = dataarr;
					self.listForAllConsignment();
				}
			}
			// console.log(result);
		},(error)=>{
			console.error(error);
		});
	}
	/**
	 * 根据 Api 获取所有推荐商品数据
	 */
	getSumSuggest = ()=>{
		let self = this;
		NetWork.Get({
			url:"Distributeproxy/guessDaiXiaoOffer",
			data:{
				companyMemberId: self.userInfo.memberId,
				pageSize: 6,
			}
		},(result)=>{
			console.log('gridDataSource', result);
            if (!IsEmpty(result.result) && !IsEmpty(result.result.result)) {
                result = result.result.result;
    			if (result.count > 0) {
    				let dataarr = [];
    				for (let i in result.offerList) {
    					try {
    						let data = {};
    						data.title = result.offerList[i].subject;
    						data.primaryID = result.offerList[i].id;
    						data.price = result.offerList[i].price;
    						data.image = result.offerList[i].imageUrlMobile;
    						data.bookedCount = result.offerList[i].bookedCount;//90天成交笔数
    						data.gmtPost = result.offerList[i].gmtPost;//发布时间
    						data.memberId = result.offerList[i].memberId;
    						data.quantitySumMonth = result.offerList[i].quantitySumMonth;//月销售件数
    						dataarr[dataarr.length] = data;
    					} catch (error) {
    						console.error(error);
    					}
    				}
    				self.gridDataSource = dataarr;
    				console.log('gridDataSource', self.gridDataSource);
    				self.getProductSuggest(self.page_no);
    			}
            }
		},(error)=>{
			console.error(error);
		});
	}
	/**
	 * 分页获取推荐商品
	 */
	getProductSuggest = (page_no)=>{
		this.page_no ++;
		let start = (page_no - 1) * PAGE_SIZE;
		let end = page_no * PAGE_SIZE;
		let subArr = this.gridDataSource.slice(start, end);
		console.log('pageNo',page_no,subArr);
		this.setState({
			gridData: this.state.gridData.concat(subArr),
            loadmore:false
		});

        // this.refs.recommendList.resetLoadmore();
	}

	// 获取包邮活动商品信息
	getCargo=()=>{
        const self = this;
        NetWork.Get({
			host:Domain.WECHART_URL,			
            url:'Supplygood/postageFree',
        },(data)=>{
            if(data.code == 200){
                self.setState({
					cargo:data.value,
					titlePic:data.titlePic,
                });
            }else{
				Toast.info('获取包邮活动商品信息失败', 2);
            }
        });
    }

    // 底部加载更多
	loadmore = () => {
        console.log('gridDataSource',this.gridDataSource.length);
        if (this.gridDataSource.length < 20) {
            return ;
        }
        this.setState({
            loadmore:true
		});
		// this.getbestsupplier();
	};
	/**
	 * 跳转到页面
	 */
	goToView = (info) => {
		GoToView(info);
	}

	handleRefresh = () => {
		this.setState({
			isRefreshing: true,
			refreshText: '加载中...',
		});
        this.page_no = 1;
        this.getSumSuggest();
		this.querySuppliers();
		this.getSlider();
		this.getNewBestSupplier();
		this.getCargo();		
		// this.getbestsupplier();
		setTimeout(() => {
			this.setState({
				isRefreshing: false,
				refreshText: '↓ 下拉刷新',
			});
		}, 2000);
	}

    renderHeader = () =>{
        // return (
        //     <RefreshControl refreshing={this.state.isRefreshing} style={styles.itemRefresh} onRefresh={this.handleRefresh}>
        //         <Text style={{fontSize:px(28),color:"#3089dc"}}>{this.state.refreshText}</Text>
        //     </RefreshControl>
        // );
    } 
	// supliers = () =>{
	// 	let doms = [];
	// 	// this.state.suppliers.map((item,key)=>{
	// 	for(let i=0;i<this.state.suppliers.length;i++){
	// 		let item = this.state.suppliers[i];
	// 		let gotoData = item;
	// 		// gotoData.newsuppliergoods = '';
	// 		let supplierdata = JSON.stringify(gotoData);
	// 		let supplierdatanew = encodeURI(supplierdata);
	// 		doms.push(
	// 			<View style={{backgroundColor:"#fff",height:396,width:px(750),alignItems:'center'}} onClick={()=>{GoToView({status:'SupplierGoods',query:{fromPage:'RecommendationSource',supplierdata:supplierdatanew}});}}>
	// 				<Image style={{ height:326, width:654,borderWidth:px(1),borderColor:'#e5e5e5',borderRadius: px(8) }} src={item.supplierimg} />
	// 				<View style={{ flexDirection: "row",alignItems:'center',width:654,marginTop:12}}>
	// 					<Text style={{ color: "#121314", fontSize: px(24)}}>{item.suppliertitle}</Text>
	// 					<Text style={{backgroundColor:"rgb(238,103,35)",width:24,height:24,marginLeft:12,color:'#ffffff',fontSize: px(20)}}>诚</Text>
	// 				</View>
	// 			</View>
	// 		);
	// 	}
	// 	// });
	// 	return doms;
	// }
	//获取悬浮窗口的图片数据
	getFloatData=(data)=>{
		console.log('kankanchuancan',data);
		let dom=[];
		if(!IsEmpty(data)){
			data.map((item,key)=>{
				let pic = "https://cbu01.alicdn.com/"+item.picURI;
				dom.push(<Image key={key} src={pic} style={{width:px(130),height:px(130),borderRadius: px(8), borderWidth:px(1),borderColor:'#e5e5e5',}}/>)
			});
		}
		return dom;
	}
	newSupliers = () =>{
		const self = this;
		let doms = [];
		for(let j=0;j<this.state.newsuppliers.length;j++){
			let itemnew = this.state.newsuppliers[j];
			console.log('kankanitemnew',itemnew);
			let gotoData = {
				memberId: itemnew.memberId,
				supplierid: itemnew.supplierName,
				suppliertag: '一件代发,源头商家',
				suppliertitle: itemnew.supplierName,
				supplierwangwang: itemnew.supplierLoginId,
			};
			let supplierData = JSON.stringify(gotoData);
			let supplierDatanew = encodeURI(supplierData);
			doms.push(
				<View key={j}>
					<View onClick={()=>{
						DoBeacon('TD20181012161059','goodspage_qualitysupplier_click',self.userInfo.loginId);
						GoToView({status:'SupplierGoods',query:{fromPage:'RecommendationSource',supplierdata:supplierDatanew}});
					}} 
					style={{backgroundColor:"#fff",width:px(700),alignItems:'center',borderRadius: px(8), borderWidth:px(1),borderColor:'#e5e5e5',paddingTop:px(12),paddingBottom:px(12)}}>
						<View style={{width:652,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
							{this.getFloatData(itemnew.newsuppliergoods)}
						</View>
						<View style={{ flexDirection: "row",alignItems:'center',width:px(654),marginTop:px(12)}}>
							<Text style={{ color: "#121314", fontSize: px(28),marginRight:px(12)}}>{itemnew.supplierName}</Text>
							<ItemIcon onClick={()=>{}} iconStyle={styles.wangwangicon} code={"\ue6ba"}/>
							<View style={{ flexDirection: "row",alignItems:'center',flex:1,justifyContent:"flex-end"}}>
								<ItemIcon iconStyle={{fontSize: px(32),color:'#666666'}}  code={"\ue65b"}/>
							</View>
						</View>
					</View>
					<View style={styles.shadow}></View>
				</View>
			);
		}
		// for(let i=0;i<this.state.newsuppliers.length;i++){
		// 	let item = this.state.newsuppliers[i];
		// 	console.log('kankanrsp',item);
		// 	if(!IsEmpty(item.newsuppliergoods)){
		// 		doms.push(
		// 			<View onClick={()=>{this.gotoOutUrl(item.supplierUrl);DoBeacon('TD20181012161059','goodspage_qualitysupplier_click',self.userInfo.loginId);}} style={{backgroundColor:"#fff",width:700,alignItems:'center',borderRadius: px(8), borderWidth:px(1),borderColor:'#e5e5e5',marginBottom:24,paddingTop:12,paddingBottom:12}}>
		// 				<View style={{width:652,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
		// 					{this.getFloatData(item.newsuppliergoods)}
		// 				</View>
		// 				<View style={{ flexDirection: "row",alignItems:'center',width:654,marginTop:12}}>
		// 					<Text style={{ color: "#121314", fontSize: px(28),marginRight:12}}>{item.supplierName}</Text>
		// 					<ItemIcon onClick={()=>{UitlsRap.openChat(item.supplierLoginId)}} iconStyle={styles.wangwangicon} code={"\ue6ba"}/>
		// 					<View style={{ flexDirection: "row",alignItems:'center',flex:1,justifyContent:"flex-end"}}>
		// 						<ItemIcon iconStyle={{fontSize: px(32),color:'#666666'}}  code={"\ue65b"}/>
		// 					</View>
		// 				</View>
		// 			</View>
		// 		);
		// 	}
		// }
		return doms;
	}
	//显示轮播图
	renderPics() {
		const self = this;
		let body = [];
		this.state.slider.map((item, index) => {
			let beacon = 'goodspage_banner'+(index+1);
			body.push(
				<View key={index} style={{ width: px(750), height: px(200) }}>
					<Image resizeMode={"contain"} src={item.sliderimg} onClick={()=>{this.gotoOutUrl(item.sliderurl);}} style={{ width: px(750), height: 200 }} />
				</View>
			);
		});
		return body;
	}

	//跳转外部链接方法
	gotoOutUrl=(url,index)=>{
		if(!IsEmpty(index)){
			let name = 'free_shipping_'+index+'_click';
			console.log('gotohtml',url,name);
			DoBeacon('TD20181012161059',name,this.userInfo.loginId);
		}
		console.log('kankanwangzhi',url);
		let urlnew = encodeURI(url);
		console.log('kankanwangzhinew',urlnew);
		GoToView({status:urlnew,page_status:'special'});
	}


    //渲染每一项
    renderGridCell = (item, index) => {
		let url = 'https://detail.1688.com/offer/'+item.cargonumid+'.html'
        return(
            <View onClick={()=>{this.gotoOutUrl(url,item.cargoid)}} style={styles.imgBody} key={index}>
            {/* <View style={styles.imgBody}> */}
                <Image  src={item.cargoimg} style={styles.imgOne}/>
            </View>
          ) 
    }
    renderRow = () =>{
		let doms = [];
		doms.push(
			<View key={0} onClick={()=>{GoToView({status:'ItemSelectPage',query:{from:'searchSource'}})}}>
				<Image src={'https://q.aiyongbao.com/1688/web/img/newSearchTitle.png'} style={{width:px(750),height:px(128)}}/>
			</View>
		)
		// doms.push(
		// 	<Slider
		// 		ref="Slider"
		// 		style={{ overflow: 'hidden' }}
		// 		paginationStyle={styles.paginationStyle}
		// 		width={750}
		// 		height={200}  
		// 		autoplay={true}
		// 		showsPagination={true}
		// 		loop={false}
		// 		index={0}
		// 	>
		// 		{this.renderPics()}
		// 	</Slider>
		// )
        doms.push(
            <View key={1} style={{backgroundColor:"#fff"}}>
                <View style={{justifyContent:"space-between",flexDirection: 'row',alignItems:'center',paddingBottom: px(30), paddingLeft: px(24), paddingRight: px(24), paddingTop: px(30)}}>
                    <View><Text style={{ color: "#333333", fontSize: px(32), fontWeight:"bold"}}>合作商家</Text></View>
                    <View onClick={this.goToView.bind(this,{status:'SupplierList',backgroundColor:'red'})} style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                        <Text style={{color:"#999999",fontSize:px(28)}}>查看全部{this.suppliersCount}个供应商</Text>
                        <ItemIcon code={"\ue6a7"} iconStyle={{fontSize:px(40),color:'#979797'}}/>
                    </View>
                </View>
                <GoodsProductMap size={"small"} horizontal={true} dataSource={this.state.rowData} />
            </View>
		);
		if(!IsEmpty(this.state.titlePic)&&!IsEmpty(this.state.cargo)){
			doms.push(
				<View key={2} style={{ marginTop: px(32),backgroundColor:'#ffffff'}}>
					<View style={styles.titleImg}>
						<Image src={this.state.titlePic} style={styles.titleImg}/>
					</View>
					<Grid
                    data = { this.state.cargo }
                    columnNum = { 2 }
                    renderItem = {this.renderGridCell}
					style={{ marginBottom: px(20)}}
                    />
				</View>
			)
		}

		// doms.push(
        //     <View style={{marginTop:px(24),backgroundColor:"#fff"}}>
        //         <View style={{justifyContent:"space-between",flexDirection: 'row',alignItems:'center',paddingBottom: px(30), paddingLeft: px(24), paddingRight: px(24), paddingTop: px(30)}}>
        //             <View><Text style={{ color: "#333333", fontSize: px(28)}}>优质供应商</Text></View>
        //         </View>
		// 		{
		// 			this.supliers()
		// 		}
        //     </View>
		// );
		doms.push(
            <View key={3} style={{marginTop:px(24),backgroundColor:"#fff"}}>
                <View style={{justifyContent:"space-between",flexDirection: 'row',alignItems:'center',paddingBottom: px(30), paddingLeft: px(24), paddingRight: px(24), paddingTop: px(30)}}>
                    <View><Text style={{ color: "#333333", fontSize: px(32)}}>推荐货源</Text></View>
                    <View onClick={this.goToView.bind(this,{status:'GoodsSource'})} style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                        <Text style={{color:"#999999",fontSize:px(28)}}>查看更多</Text>
                        <ItemIcon code={"\ue6a7"} iconStyle={{fontSize:px(40),color:'#979797'}}/>
                    </View>
                </View>
                <GoodsProductMap size={"small"}  hasprice={true} goProduct={true} needMid={true} horizontal={true} dataSource={this.state.gridData} />
            </View>
		);
		doms.push(
            <View key={4} style={{marginTop:px(24),backgroundColor:"#fff",alignItems:'center'}}>
                <View style={{width:px(750),justifyContent:"flex-start",flexDirection: 'row',alignItems:'center',paddingBottom: px(30), paddingLeft: px(24), paddingRight: px(24), paddingTop: px(30)}}>
                    <View><Text style={{ color: "#333333", fontSize: px(32),fontWeight:"bold"}}>优质供应商</Text></View>
                </View>
				{
					this.newSupliers()
				}
            </View>
		);


        return doms;
    }

    renderFooter = () => {
        return this.state.loadmore ? (
                <View style={styles.loadmore_view}>
                    <Text style={styles.loadmore_text}>加载更多</Text>
                </View>
            ):(null)
    }

    render(){
        return (
			<FlatList
			ref="recommendList"
			style = {{flex:1,backgroundColor:'#f5f5f5'}}
			data={['null']}
			horizontal={false}
			renderItem={this.renderRow}
			ListFooterComponent={this.renderFooter}
			refreshing={this.state.isRefreshing}
			onRefresh={()=>{this.handleRefresh()}}
			onEndReached = {()=>{console.log('到底了。。',this.page_no);this.loadmore();}}
			onEndReachedThreshold={800}
			keyExtractor={(item, index) => (index + '1')}
			/>
        );
    }
}