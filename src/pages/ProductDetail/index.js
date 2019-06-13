import Taro, { Component, Config } from '@tarojs/taro';
import {View,ScrollView,Text,Image} from '@tarojs/components';
import { Carousel } from '@ant-design/react-native';
import { IsEmpty } from '../../Public/Biz/IsEmpty.js';
import styles from './styles';
import ItemIcon from '../../Component/ItemIcon';
import {GetQueryString} from '../../Public/Biz/GetQueryString.js';
import { GoToView } from '../../Public/Biz/GoToView.js';
import {DoBeacon} from '../../Public/Biz/DoBeacon';
import { NetWork } from '../../Public/Common/NetWork/NetWork.js';
import px from '../../Biz/px.js';
/**
 * @author SmingPro
 * 产品详情页
 */
export default class ProductDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tabIndex: 0, //当前tab值
			isRender: false, //是否渲染
			loginId:'', //用户名
		};
		this.babyDeatil = {
			basicInfo: {}, //商品基本信息 包含:title ,price ,amount
			businessGuaranteeInfo: [], //商家保障信息
			pics: [], //产品主图
			saleInfo: {}, //销售规格
			productAttributes: {}, //产品属性
		};//产品详细信息
		this.offerid = ""; //商品id
		this.bookedCount = ""; //销量
		this.gmtPost = "";
		this.quantitySumMonth = "";
		this.memberId = ""; //供应商memberId
		this.hasSkuPrice = false; //sku是否有价格
		this.from = '';
		this.type = "";

	}

	config = {
        navigationBarTitleText: '产品详情'
    }

	componentWillMount() {
        const self = this;
		this.offerid = GetQueryString({
			name: 'offerid',self:this
		});
		this.type = GetQueryString({
			name: 'type',self:this
		});
		this.memberId = GetQueryString({
			name: 'memberId',self:this
		});
		console.log('memberId',this.memberId);

		this.bookedCount = GetQueryString({
			name: 'bookedCount',self:this
		});
		this.quantitySumMonth = GetQueryString({
			name: 'quantitySumMonth',self:this
		});
		this.from = GetQueryString({
			name: 'from',self:this
		});
		this.getProductInfo();
		// RAP.user.getUserInfo({extraInfo: true}).then((info) => {
        //     self.state.loginId = info.extraInfo.result.loginId;
        //     if(!IsEmpty(info.extraInfo) && info.extraInfo != false && info.extraInfo != 'false'){
        //         self.state.loginId = info.extraInfo.result.loginId;
        //     } else {
        //         self.state.loginId = info.nick;
        //     }
        // });
	}
	/**
	 * 获取产品详情
	 * @link https: //open.1688.com/api/api.htm?ns=com.alibaba.product&n=alibaba.agent.product.simple.get&v=1
	 * @author SmingPro
	 */
	getProductInfo = () => {
		let self = this;
		NetWork.Get({
			url:"Distributeproxy/productSimple",
			data:{
				productID: this.offerid,
				webSite: 1688
			}
		},(result)=>{
			console.log('productInfo', result);
			let productInfo = result.productInfo;
			let images = productInfo.image.images;
			let pics = [];
			for (let i in images) {
				pics.push("https://cbu01.alicdn.com/" + images[i]);
			}
			self.babyDeatil.pics = pics;

			let basicInfo = {};
			basicInfo.title = productInfo.subject;
			basicInfo.price = productInfo.referencePrice; //区间价格
			let amountOnSale = 0;
			let retailPrice = 0;
			//重组数据
			for (let key in productInfo.skuInfos) {
				if (!IsEmpty(productInfo.skuInfos[key].amountOnSale)) {
					amountOnSale += parseInt(productInfo.skuInfos[key].amountOnSale);
				}
				if (!IsEmpty(productInfo.skuInfos[key].retailPrice)) {
					retailPrice += productInfo.skuInfos[key].retailPrice;
				}
				if (!IsEmpty(productInfo.skuInfos[key].priceRange)) {
					self.hasSkuPrice = true;
				}
				if (!IsEmpty(productInfo.skuInfos[key].price)) {
					self.hasSkuPrice = true;
				}
			}
			basicInfo.amount = amountOnSale; //可售数量
			self.babyDeatil.basicInfo = basicInfo;
			//重组商品图片数据
			let descriptionArr = [];
			console.debug("productInfo.description", productInfo.description);
			let imgReg = /<img.*?(?:>|\/>)/gi;
			var regArr = productInfo.description.match(imgReg);
			console.debug("productInfo.arr", regArr);
			for (let key in regArr) {
				var srcReg = /http(s):\/\/(\d|\.|\w|\/)+/g;
				var src = regArr[key].match(srcReg);
				console.debug("productInfo.src", src);
				if (!IsEmpty(src)) {
					descriptionArr.push(src[0]);
				}
			}
			self.babyDeatil.descriptionArr = descriptionArr;

			// let extend_info = productInfo.extendInfos;
			// var bzvalue = "";
			// for (let i in extend_info) {
			// 	if (extend_info[i].key == "buyerProtection") {
			// 		bzvalue = Parse2json(extend_info[i].value);
			// 	}
			// }
			let bizGroupInfos = [];
			for (let key in result.bizGroupInfos) {
				if(!IsEmpty(result.bizGroupInfos[key])){
					bizGroupInfos.push(result.bizGroupInfos[key].description);
				}
			}
			self.babyDeatil.businessGuaranteeInfo = [];//bizGroupInfos;
			// console.log('bzvalue', bzvalue);
			// if (bzvalue) {
			// 	let businessGuaranteeInfo = [];
			// 	for (var j = 0; j < bzvalue.length; j++) {
			// 		if (bzvalue[j].indexOf('czbz') > -1) {
			// 			businessGuaranteeInfo.push("材质保障");
			// 		} else if (bzvalue[j].indexOf('swtbh') > -1) {
			// 			businessGuaranteeInfo.push("15天包换");
			// 		} else if (bzvalue[j].indexOf('ssbxsfh') > -1) {
			// 			businessGuaranteeInfo.push("48小时发货");
			// 		} else if (bzvalue[j].indexOf('swtwlybt') > -1) {
			// 			businessGuaranteeInfo.push("15天无理由包退");
			// 		} else if (bzvalue[j].indexOf('psbj') > -1) {
			// 			businessGuaranteeInfo.push("破损补寄");
			// 		} else if (bzvalue[j].indexOf("esytbhfw") > -1) {
			// 			businessGuaranteeInfo.push("21天包换");
			// 		} else if (bzvalue[j].indexOf("jqbz") > -1) {
			// 			businessGuaranteeInfo.push("交期保障");
			// 		} else if (bzvalue[j].indexOf("whbp") > -1) {
			// 			businessGuaranteeInfo.push("无货必赔");
			// 		} else if (bzvalue[j].indexOf("qtbh") > -1) {
			// 			businessGuaranteeInfo.push("7天包换");
			// 		} else if (bzvalue[j].indexOf("qsexsfh") > -1) {
			// 			businessGuaranteeInfo.push("72小时发货");
			// 		} else if (bzvalue[j].indexOf("lstbhfw") > -1) {
			// 			businessGuaranteeInfo.push("60天包换");
			// 		} else if (bzvalue[j].indexOf("zpbz") > -1) {
			// 			businessGuaranteeInfo.push("正品保障");
			// 		} else if (bzvalue[j].indexOf("essxsfh") > -1) {
			// 			businessGuaranteeInfo.push("24小时发货");
			// 		} else if (bzvalue[j].indexOf("ynzb") > -1) {
			// 			businessGuaranteeInfo.push("一年质保");
			// 		} else if (bzvalue[j].indexOf("qtdhbz") > -1) {
			// 			businessGuaranteeInfo.push("7天到货保障");
			// 		} else if (bzvalue[j].indexOf("wtdhbz") > -1) {
			// 			businessGuaranteeInfo.push("5天到货保障");
			// 		} else if (bzvalue[j].indexOf("xqbz") > -1) {
			// 			businessGuaranteeInfo.push("效期保障");
			// 		} else if (bzvalue[j].indexOf("syzj") > -1) {
			// 			businessGuaranteeInfo.push("溯源质检");
			// 		} else {
			// 		}
			// 	}
			// 	console.log("businessGuaranteeInfo", businessGuaranteeInfo);
			// 	self.babyDeatil.businessGuaranteeInfo = businessGuaranteeInfo;
			// }

			let saleInfo = {};
			if (retailPrice == 0) {
				retailPrice = "";
			}
			saleInfo.retailprice = retailPrice;//建议零售价
			saleInfo.skuInfos = productInfo.skuInfos; //sku 信息
			self.babyDeatil.saleInfo = saleInfo;

			// self.babyDeatil.productAttributes = productInfo.attributes;
			console.log("babyDeatil", self.babyDeatil);
			self.setState({
				isRender: true
			});
		},(error)=>{
			console.error(error);
		});
	}
	// 底部加载更多
	loadmore = () => {
		console.log("loadmore");
	};
	// 滚动图片修改事件
	sliderChange = e => {
		console.log(e);
	};
	/**
	 * 显示产品主图轮播图
	 */
	renderPics() {
		let body = [];
		this.babyDeatil.pics.map((item, index) => {
			body.push(
				<View style={{ width: px(750), height: px(750) }}>
					<Image resizeMode={"contain"} src={item} style={{ width: px(750), height: px(750) }} />
				</View>
			);
		});
		return body;
	}
	/**
	 * 显示产品属性列表
	 */
	showProductAttributes() {
		let self = this;
		let attrDom = [];
		for (let i in self.babyDeatil.productAttributes) {
			attrDom.push(
				<View style={{ backgroundColor: "#ffffff", paddingTop: px(24), paddingBottom: px(24), borderBottomWidth: 1, borderColor: "#f5f5f5", flexDirection: "row", }}>
					<Text style={{ flex: 1, paddingLeft: "", justifyContent: "flex-start", fontSize: px(28) }}>{self.babyDeatil.productAttributes[i].attributeName}: </Text>
					<Text style={{ flex: 1, justifyContent: "flex-start", paddingLeft: px(40), fontSize: px(28) }}>{self.babyDeatil.productAttributes[i].value}</Text>
				</View>
			);
		}
		return attrDom;
	}
	/**
	 * 显示列表
	 */
	showList() {
		let jsx = [];
		switch (this.state.tabIndex) {
			case 0://详情
				let imgJsx = [];
				console.log('this.babyDeatil.descriptionArr',this.babyDeatil.descriptionArr);
				for (let key in this.babyDeatil.descriptionArr) {
					imgJsx.push(<Image resizeMode={"contain"} src={this.babyDeatil.descriptionArr[key]} style={{ width: px(750),height:px(750),backgroundColor: "#ffffff" }} />);
				}
				jsx.push(
					<View style={{ backgroundColor: "#ffffff", flex: 1, paddingTop: px(24), paddingBottom: px(60),width:px(750) }}>
						{imgJsx}
					</View>
				);
				break;
			case 1://销售规格
				jsx.push(
					<View style={{ backgroundColor: "#ffffff", flex: 1, paddingLeft: px(40), paddingRight: px(40), paddingTop: px(24), paddingBottom: px(60) }}>
						{
							IsEmpty(this.babyDeatil.saleInfo.retailprice) ? null :
								<View style={{ backgroundColor: "#ffffff", height: px(40), width: px(704), flexDirection: 'row', marginBottom: px(24) }}>
									<View><Text style={{ color: "#999999", fontSize: px(28) }}>建议零售价:¥{this.babyDeatil.saleInfo.retailprice}</Text></View>
								</View>
						}
						<View style={{ backgroundColor: "#ffffff", height: px(40), width: px(704), flexDirection: 'row', marginBottom: px(18), }}>
							<View><Text style={{ color: "#999999", fontSize: px(28) }}>规格及库存:</Text></View>
						</View>
						<View style={{ flexDirection: 'row', flex: 1 }}>
							<View style={[styles.tableHead, { flex: 1 }]}>
								<Text style={{ fontSize: px(24), color: '#9e9e9e' }}>规格</Text>
							</View>
							{this.hasSkuPrice ? <View style={[styles.tableHead, { marginLeft: px(-2), flex: 1 }]}>
								<Text style={{ fontSize: px(24), color: '#9e9e9e' }}>采购价(元)</Text>
							</View>:null}
							<View style={[styles.tableHead, { marginLeft: px(-2), flex: 1 }]}>
								<Text style={{ fontSize: px(24), color: '#9e9e9e' }}>库存(件)</Text>
							</View>
						</View>
						{
							this.getSkuNumberPrice()
						}
					</View>
				);
				break;
		}
		return jsx;
		// if (this.state.tabIndex) {
		// 	return (//产品属性
		// 		<View style={{ backgroundColor: "#ffffff", flex: 1, paddingLeft: px(24) }}>
		// 			{this.showProductAttributes()}
		// 		</View>
		// 	);
		// } else {
		// }
	}
	/**
	 * 获取销售规格
	 */
	getSkuNumberPrice = () => {
		let tableDoms = [];
		for (let i in this.babyDeatil.saleInfo.skuInfos) {
			let price = "";
			if (!IsEmpty(this.babyDeatil.saleInfo.skuInfos[i].priceRange)) {
				price = this.babyDeatil.saleInfo.skuInfos[i].priceRange[0].price;
			} else {
				price = this.babyDeatil.saleInfo.skuInfos[i].price;
			}
			let attributes = [];
			for (let j in this.babyDeatil.saleInfo.skuInfos[i].attributes) {
				attributes.push(this.babyDeatil.saleInfo.skuInfos[i].attributes[j].attributeValue);
			}
			attributes = attributes.join(',');

			let height = 72;
            let rows = 1;
			let textNumber = 23;
			if (this.hasSkuPrice) {
				textNumber = 16;
			}
            let length = attributes.replace(/[\u0391-\uFFE5]/g,"aa").length;
            rows = Math.ceil(length/textNumber);
            if (rows>1) {
                height = 72 + (rows-1) * 36;
            }

			console.log('length',length,'rows',rows);

			tableDoms.push(
				<View style={{ flexDirection: 'row' }}>
					<View style={[styles.tableBodyLine, {flex:1,height:height}]}>
						<Text style={[{fontSize:px(28),color:'#727272',textAlign:'center'},this.hasSkuPrice ?{width:px(221)}:{width:px(332)}]}>{attributes}</Text>
					</View>
					{this.hasSkuPrice ? <View style={[styles.tableBodyLine, { marginLeft: px(-2), flex: 1 ,height:height}]}>
						<Text style={{ fontSize: px(28), color: '#727272' }}>{price}</Text>
					</View>:null}
					<View style={[styles.tableBodyLine, { marginLeft: px(-2), flex: 1 ,height:height}]}>
						<Text style={{ fontSize: px(28), color: '#727272' }}>{this.babyDeatil.saleInfo.skuInfos[i].amountOnSale}</Text>
					</View>
				</View>
			)
		}

		return tableDoms;
	}
	/**
	 * 立即铺货
	 * 尝试使用一键代销
	 * https://open.1688.com/api/api.htm?ns=cn.alibaba.open&n=alibaba.distributor.fastConsign&v=1
	 */
	immediateDistribution = () => {
		if(this.from == 'suppliergoods'){
			DoBeacon('TD20181012161059','qualitysupplier_btn_distribute',this.state.loginId);
		}else{
			DoBeacon('TD20181012161059','goods_recommend_distribute',this.state.loginId);
		}
		if (this.from == 'hasCancelRelation') {
			GoToView({status:'DistributionResult',query:{
                offerId:this.offerid,
                supplierMemberId:this.memberId,
				from:'hasCancelRelation',
				isfromself:'1',
            }});
		} else {
			GoToView({ status: 'DistributionShops', query: {
				offerId: this.offerid,
				supplierMemberId: this.memberId,
				isfromself:'1',
				type:this.type
			}});
		}
	}
	/**
	 * 显示商家保障列表
	 */
	showBusinessGuaranteeInfo = () => {
		console.log("showBusinessGuaranteeInfo", this.babyDeatil.businessGuaranteeInfo);
		let binfo = [];
		if (this.babyDeatil.businessGuaranteeInfo.length <= 3) {
			let dom = [];
			for (let i in this.babyDeatil.businessGuaranteeInfo) {
				dom.push(
					<View style={{ flexDirection: 'row' }}>
						<ItemIcon code={"\ue71c"} iconStyle={{ color: "#FF6000", paddingTop: px(3), paddingRight: px(5) }} />
						<Text style={{ color: "#999999", fontSize: px(24) }}>{this.babyDeatil.businessGuaranteeInfo[i]}</Text>
					</View>
				);
			}
			binfo.push(
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: px(10) }}>
					{dom}
				</View>
			);
		} else {

			let businessGuaranteeInfo = this.babyDeatil.businessGuaranteeInfo.join(",");
			businessGuaranteeInfo = businessGuaranteeInfo.split(',');
			let bcount = businessGuaranteeInfo.length / 3;
			for (let index = 0; index < bcount; index++) {
				let dom = [];
				let j = 0;
				while (j < 3) {
					if (businessGuaranteeInfo[0]) {
						dom.push(
							<View style={{ flexDirection: 'row' }}>
								<ItemIcon code={"\ue71c"} iconStyle={{ color: "#FF6000", paddingTop: px(3), paddingRight: px(5) }} />
								<Text style={{ color: "#999999", fontSize: px(24) }}>{businessGuaranteeInfo[0]}</Text>
							</View>
						);
						businessGuaranteeInfo.splice(0, 1);
					}
					j++;
				}
				binfo.push(
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: px(10) }}>
						{dom}
					</View>
				);
			}
		}
		return binfo;


	}
	render() {
		return (
			<View>
				<ScrollView
					style={{ flex: 1, backgroundColor: '#f5f5f5' }} >
					<View style={{ backgroundColor: "#ffffff", flex:1,width: px(750), marginBottom: px(6), }}>
						<View style={{ backgroundColor: "#000000", height: px(750), width: px(750), }}>
							<Carousel
								ref="Slider"
								style={{overflow: 'hidden',width:px(750),height:px(750)}}
								autoplay={false}
								infinite={false}
								onChange={this.sliderChange}
							>
								{this.renderPics()}
							</Carousel>
						</View>
						<View style={{ backgroundColor: "#ffffff", width: px(750) }}>
							<View style={{ backgroundColor: "#ffffff", height: px(80), width: px(704), margin: px(24), }}>
								<Text style={{ color: "#333333", fontSize: px(28) }}>{this.babyDeatil.basicInfo.title}</Text>
							</View>
							<View style={{ backgroundColor: "#ffffff", width: px(704), marginLeft: px(24), marginRight: px(24), flexDirection: 'row', justifyContent: 'space-between', marginBottom: px(24), }}>
								<View><Text style={{ color: "#666666", fontSize: px(28) }}>代销价:¥{this.babyDeatil.basicInfo.price}</Text></View>
								<View><Text style={{ color: "#666666", fontSize: px(28) }}>库存:{parseInt(this.babyDeatil.basicInfo.amount)}</Text></View>
							</View>
							{
								IsEmpty(this.bookedCount) && IsEmpty(this.quantitySumMonth) ? null :
								<View style={{ backgroundColor: "#ffffff", width: px(704), marginLeft: px(24), marginRight: px(24), flexDirection: 'row', justifyContent: 'space-between', marginBottom: px(24), }}>
									{
										IsEmpty(this.bookedCount) ? null :
											<View>
													<Text style={{ color: "#666666", fontSize: px(28) }}>90天成交笔数:{this.bookedCount}</Text>
											</View>
									}
									{
										IsEmpty(this.quantitySumMonth) ? null :
												<View><Text style={{ color: "#666666", fontSize: px(28) }}>月销售件数:{parseInt(this.quantitySumMonth)}</Text></View>
									}
								</View>
							}
						</View>
					</View>
					{
						this.babyDeatil.businessGuaranteeInfo.length == 0 ? null :
							<View style={{ backgroundColor: "#ffffff", width: px(750), marginBottom: px(6), paddingBottom: px(12), }}>
								<View style={{ backgroundColor: "#ffffff", width: px(704), marginTop: px(24), marginLeft: px(24) }}>
									<Text style={{ color: "#666666", fontSize: px(28) }}>商家保障</Text>
									{this.showBusinessGuaranteeInfo()}
								</View>
							</View>
					}
					<Tabheader
						dataSource={[
							'商品详情',
							'销售规格'
						]}
						initIndex={0}
						height={80}
						itemWidth={375}
						type={'normal'}
						isDrop={false}
						fontSize={28}
						selectTextColor={'#FF7300'}
						selectLineColor={'#FF6000'}
						isShowSelectLine={true}
						onSelect = {
							(index) => this.setState({
								tabIndex: index
							})
						}
					/>
					<View style={{ borderColor: "#f5f5f5", borderWidth: 1, }}></View>
					{this.showList()}
				</ScrollView>
				<View style={styles.foot}>
					<View onClick={this.immediateDistribution} style={styles.right}>
						<Text style={styles.right_text}>立即铺货</Text>
					</View>
				</View>
			</View>
		);
	}
}