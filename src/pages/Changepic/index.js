import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Image, ScrollView, Radio } from '@tarojs/components';
import Event from 'ay-event';
import styles from './styles';
import {NetWork} from '../../Public/Common/NetWork/NetWork.js';
import {IsEmpty} from '../../Public/Biz/IsEmpty.js';
import {GetQueryString} from '../../Public/Biz/GetQueryString.js';
import {GoToView} from '../../Public/Biz/GoToView.js';
import px from '../../Biz/px.js';

/**
 * @author wzm
 * 选择详情图片
 */
export default class Changepic extends Component {
    constructor(props){
        super(props);
        this.state = {
			gridData:[

            ],//所有图片
        };
        this.numIid = ''; //多平台商品id
        this.productId = ''; //1688商品id
        this.shopType = ''; //店铺类型
        this.addnum =0; //添加个数
        this.shopId = '';
    }

    // config: Config = {
    //     navigationBarTitleText: '分享商品'
    // }

    componentWillMount(){
        const self = this;
        let numIid = GetQueryString({name:'numIid'});
        let productId = GetQueryString({name:'productId'});
        let shopType = GetQueryString({name:'shopType'});
        let shopId = GetQueryString({name:'shopId'});
        this.numIid = numIid;
        this.productId = productId;
        this.shopType = shopType;
        this.shopId = shopId;
        // Taro.showLoading({ title: '加载中...' });
        //获取商品设置信息
        NetWork.Get({
            url:'Orderreturn/getOneGoodSetting',
            params:{
                numIid:numIid,
                shopType:shopType,
                productID:productId,
                shopId:shopId
            }
        },(data)=>{
            let pics = data.show_desimg;
            let outdata = pics.length%4;
            if (outdata != 0){
                let addnum = 4 - outdata;
                this.addnum = addnum;
                for( let i=0;i<addnum;i++){
                    pics.push('');

                }
            }
            self.setState({
                gridData:pics,
            })
            // Taro.hideLoading();
        });
    }

    //点击选择函数
    onChange = (index) => {
        let tmp = this.state.gridData[index].show;
        let notmp = 1;
        if(tmp == 1){
            notmp = 0;
        }
        let alldata = this.state.gridData;
        alldata[index].show = notmp;
        this.setState({
            gridData: alldata
        });
      };
    //点击保存
    save=()=>{
        const self = this;
        let imgs = self.state.gridData;
        let changes = '';
        for(let i=0;i<imgs.length;i++){
            if(!IsEmpty(imgs[i].show)&&imgs[i].show==1){
                changes=changes + imgs[i].id + ',' ;
            }
        }

        changes = changes.substring(0, changes.lastIndexOf(','));
        if(IsEmpty(changes)){
            Taro.showToast({
                title: '请至少保留一张详情图片',
                icon: 'none',
                duration: 2000
            });
        }else{
            let url = 'Orderreturn/changeProductSetting';
            let params = {
                numIid:this.numIid,
                shopType:this.shopType,
                productID:this.productId,
                type:'img',
                imgs:changes,
            };
            if (this.shopType == 'pdd') {
                url = 'Orderreturn/editItemForPdd';
                params = {
                    numIid:this.numIid,
                    shopId:this.shopId,
                    editType:'detail_gallery',
                    detail_gallery:changes,
                };
            }
            NetWork.Post({
                url:url,
                data:params
            },(data)=>{
                if(data.code == 200){
                    Event.emit('App.changeAlldata');
                    GoToView({page_status:'pop'});
                }else{
                    if (!IsEmpty(data.msg)) {
                        Taro.showToast({
                            title: data.msg,
                            icon: 'none',
                            duration: 2000
                        });
                    } else {
                        Taro.showToast({
                            title: '修改失败',
                            icon: 'none',
                            duration: 2000
                        });
                    }
                }
            });
        }

    }
	//渲染每一项
	renderGridCell = (item,index)=>{
        let checked = false;
        if(item.show == 1){
            checked = true;
        };
        if(IsEmpty(item)){
            return (
                <View style={styles.Piconekong}></View>
            )
        }else{
            return (
                <View style={checked ?styles.Piconechecked:styles.Picone} onClick={()=>this.onChange(index)} >
                    <Image src={item.url} resizeMode={"contain"} style={styles.PiconePic}></Image>
                    <View style={styles.Piconeradio}>
                    <Radio
                        ref="ridio"
                        size="small"
                        checked={checked}
                        onChange={()=>this.onChange(index)}
                    />
                    </View>

                </View>
            )
        }

	}

    render(){

        let name = '';
        switch (this.shopType) {
            case 'wc':{name = '在爱用旺铺';}break;
            case 'pdd':{name = '在拼多多店铺';}break;
            default:break;
        }
        return (
            <View>
                <ScrollView style={styles.body}>
                    <Text style={styles.title}>请选择要{name}展示的详情图片</Text>
                    <MultiRow dataSource={this.state.gridData} rows={4} renderCell={this.renderGridCell.bind(this)} />
                </ScrollView>
                <View onClick={()=>{this.save()}} style={{position:'fixed',bottom:px(0),left:px(0),right:px(0),backgroundColor:'#ff6000',height:px(96),alignItems:'center',justifyContent:'center'}}>
                    <Text style={{color:'#ffffff',fontSize:px(32)}}>保存</Text>
                </View>
            </View>
        );
    }
}
