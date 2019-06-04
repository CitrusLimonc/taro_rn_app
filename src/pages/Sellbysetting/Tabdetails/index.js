import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text ,ScrollView,Image} from '@tarojs/components';
import styles from './styles';
import {GoToView} from '../../../Public/Biz/GoToView.js';
import px from '../../../Biz/px.js';

/**
 * @author wzm
 * 详细描述组件
 */
export default class Tabdetails extends Component {
    constructor(props){
        super(props);
        this.state = {
            data:this.props.alldata.show_desimg, //数据源
            majordata:this.props.alldata.pic_path, //图片信息
            shopType:this.props.shopType,
            shopId:this.props.shopId,
            productId:this.props.productId,
            numIid:this.props.numIid,
        };
    }

    componentWillReceiveProps(nextProps){
        let params = {};
        if (nextProps.alldata) {
            params.data = nextProps.alldata.show_desimg;
            params.majordata = nextProps.alldata.pic_path;
            
        }
        if (nextProps.shopType != this.state.shopType) {
            params.shopType = nextProps.shopType;
        }
        if (nextProps.shopId != this.state.shopId) {
            params.shopId = nextProps.shopId;
        }
        if (nextProps.productId != this.state.productId) {
            params.productId = nextProps.productId;
        }
        if (nextProps.numIid != this.state.numIid) {
            params.numIid = nextProps.numIid;
        }

        this.setState({
            ...params
        })
    }
    //渲染详情图片列表
    detailPics(){
        let body =[];
        let pics = [];
        pics = this.state.data;
        if(!pics==false){
            pics.map((item,index)=>{
                if(item.show==1){
                    body.push(<Image  src={item.url} resizeMode={"contain"} style={{width:px(750),height:px(750)}} />)
                }
            })
        }
        return body;
    }
    //渲染主图图片列表
    majorpic(){
        let body =[];
        let pics = [];
        pics = this.state.majordata;
        if(!pics==false){
            pics.map((item,index)=>{
                let url = item;
                if(this.state.shopType == 'wc'){
                    url = 'https://cbu01.alicdn.com/'+item;
                }
                body.push(<Image src={url} style={styles.titlescrPic}></Image>)

            })
        }
        return body;
    }

    render(){
        const self = this;

        return (
            <ScrollView style={styles.commonLine} >
                <View style={styles.title}>
                    <Text style={styles.titleTop}>商品主图</Text>
                    <ScrollView horizontal={true} style={styles.titlescr}>
                        {this.majorpic()}
                    </ScrollView>
                </View>
                <View style={styles.details}>
                    <View style={styles.detailsTop}>
                        <Text style={styles.titleTopLeft}>详情描述</Text>
                        <Text onClick={()=>{
                            GoToView({
                                status:'Changepic',
                                query:{
                                    productId:self.state.productId,
                                    numIid:self.state.numIid,
                                    shopType:self.state.shopType,
                                    shopId:self.state.shopId
                                }
                            });
                        }} style={styles.titleTopRight}>选择要展示的图片</Text>
                    </View>
                    {
                        this.detailPics()
                    }
                </View>
            </ScrollView>
        );
    }
}
