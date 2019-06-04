import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Image, Button} from '@tarojs/components';
import Event from 'ay-event';
import styles from './styles';
import {UitlsRap} from '../../Public/Biz/UitlsRap.js';
import {NetWork} from '../../Public/Common/NetWork/NetWork';
import {GetQueryString} from '../../Public/Biz/GetQueryString.js';
// import {GoToView} from '../../Public/Biz/GoToView.js';
import {IsEmpty} from '../../Public/Biz/IsEmpty';
import ItemIcon from '../../Component/ItemIcon';

/**
 * @author wzm
 * 扫描二维码开旺铺
 */
export default class Openwd extends Component {
    constructor(props){
        super(props);
        this.state={
            searchValue:'',
            pic:'',
            shopid:'',
            shopname:'',
            loginId:'',
            picid:''
        }
        Event.on('back',(result)=>{
            Event.emit('APP.reload_shoplist_info',{});
            GoToView({page_status:'pop'});
        });
    }

    // config: Config = {
    //     navigationBarTitleText: '分享商品'
    // }

    componentWillMount(){
        const self =this;
        let shopid = GetQueryString({name:'shopid'});
        let shopname = GetQueryString({name:'shopname'});
        let shopnamede = decodeURI(shopname);
        this.state.shopid = shopid;
        this.state.shopname = shopnamede;
        // RAP.user.getUserInfo({extraInfo: true}).then((info) => {
        //     console.log('getUserInfo',info);
        //     console.log('shopid',shopid);
        //     self.state.loginId = info.extraInfo.result.loginId;
        //     if(!IsEmpty(info.extraInfo) && info.extraInfo != false && info.extraInfo != 'false'){
        //         self.state.loginId = info.extraInfo.result.loginId;
        //     } else {
        //         self.state.loginId = info.nick;
        //     }
            //获取picid
            NetWork.Get({
                host:'https://zk1688.aiyongbao.com/',
                url:'wx/setrelation',
                params:{
                    shop_id:shopid,
                    shop_name:shopnamede,
                    seller_nick:info.extraInfo.result.loginId,
                    nick1688:info.extraInfo.result.loginId,
                }
            },(data)=>{
                console.log('getpic',data);
                let picid = data.id*1;
                let picurl = 'https://zk1688.aiyongbao.com/wx/xcxQrcode?page=pages/login/login&str='+picid;
                console.log('getpics',picurl);
                    self.setState({
                        pic:picurl,
                        picid:picid
                    })
            });
        // });

    }

    componentDidMount(){

    }
    //重新获取图片
    reloadpic=()=>{
        const self =this;
        let picid = this.state.picid;
        let picurl = 'https://zk1688.aiyongbao.com/wx/xcxQrcode?page=pages/login/login&str='+picid;
        console.log('getpics',picurl);
        self.setState({
            pic:picurl
        })
    }


    render(){
        return (
            <View style={styles.body}>
                <Text style={styles.firstLine}>免费开通爱用旺铺小程序店铺</Text>
                <Text style={styles.firstText}>1.微信扫描下方二维码，开通您的小程序店铺</Text>
                <View style={styles.Picbody}>
                {
                    IsEmpty(this.state.pic)?(<View  style={styles.Picbodypic}></View>):(<Image src={this.state.pic} style={styles.Picbodypic}></Image>)
                }
                    {/* <Image src={this.state.pic} style={styles.Picbodypic}></Image> */}
                    <Button onClick={()=>{this.reloadpic()}} style={styles.Picbodybutton} type="normal">重新生成</Button>
                </View>
                <Text style={styles.importText}>注意：这是您的开通爱用旺铺的专属二维码，请不要分享给除您以外的任何人，分享行为带来的风险，由您自行承担</Text>
                <Text style={styles.firstText}>2.开通成功后，使用代发助手铺货的商品自动同步到小程序店铺；小程序分享的商品如果有买家付款，订单会自动同步到代发助手的待采购列表。</Text>
                <View style={styles.wangwangbody} onClick={()=>{UitlsRap.openChat('爱用科技1688')}}>
                    <Text style={styles.wangwangLeft}>添加店铺遇到问题？</Text>
                    <Text style={styles.wangwangRight}>联系我们</Text>
                    <ItemIcon iconStyle={styles.wangwangicon} name="\ue6ba"/>
                </View>
            </View>
        );
    }
}