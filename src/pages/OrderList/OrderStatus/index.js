
import Taro, { Component, Config } from '@tarojs/taro';
import {View,Text,ScrollView,Image} from '@tarojs/components';
import ItemIcon from '../../../Component/ItemIcon';
import styles from './styles.js';
import px from '../../../Biz/px.js';
// const {MultiRow}=Layout;
/**
*  @author cy
*  此处显示所有订单状态
**/
export default class OrderStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {status:'待采购',num:0},
                {status:'待发货',num:0},
                {status:'已发货',num:0},
                // {status:'待评价',num:0},
                {status:'退款中',num:0},
                {status:'已关闭',num:0},
                {status:'已成功',num:0},
                // {status:'近三个月',num:0},
                // {status:'三个月前',num:0}
            ],//订单状态及数量
            lastStatus:'待采购',//上一次选中的状态
            key:'statusView',
        };
        this.changeStatus=this.changeStatus.bind(this);
    };
    componentWillReceiveProps(nextProps){
        if(nextProps.tabStatus){
            let data = this.state.data;
            data.map((dataItem,k)=>{
                if(dataItem.status == nextProps.tabStatus){
                    dataItem.num = nextProps.tabNum;
                    // this.refs.scroller1.scrollTo({x:150*k,y:0});
                }
            });
            for(let k in this.state.data){
                if (this.state.data[k].status==this.state.lastStatus && this.state.key=='statusMask') {
                    this.refs.scroller1.scrollTo({x:150*k,y:0});
                }
            }
            this.setState({
                lastStatus:nextProps.tabStatus,
                data:data,
                key:'statusView',
            });
        }
    }
    /*改变当前的所处订单状态
    * 参数：key(菜单或遮盖层),status(状态名)
    */
    changeStatus(status){
        if(this.state.lastStatus != status){
            this.state.lastStatus = status;
            this.props.changeStatus(status);
        }
    };

    //添加订单状态中的子节点
    getViews=()=>{
        let doms=[];
        this.state.data.map((dataItem,index)=>{
            doms.push(
                <View key={index} style={styles.dataHeaderItem} onClick={()=>{this.changeStatus(dataItem.status)}}>
                    <Text style={[styles.statusText,dataItem.status==this.state.lastStatus?styles.faab89:'']}>{dataItem.status}</Text>&nbsp;
                    {dataItem.status==this.state.lastStatus?(<Text style={[styles.num,dataItem.status==this.state.lastStatus?styles.faab89:'']}>{dataItem.num}</Text>):(null)}
                </View>
            );
        });
        return doms;
    }
    //渲染小图标
    renderlittleicon(){
        var self=this;

        switch (this.props.shopType) {
            case 'taobao':{
                return  (<Image src={'https://q.aiyongbao.com/1688/web/img/preview/taoLogo.png'}
                        style={{width:px(60),height:px(60)}}
                        />);
            } break;
            case 'pdd':{
                return  (<Image src={'https://q.aiyongbao.com/1688/web/img/preview/pingDDLogo.png'}
                        style={{width:px(60),height:px(60)}}
                        />);
            } break;
            case 'wc':{
                return  (<Image src={'https://q.aiyongbao.com/1688/web/img/preview/weichatLogo.png'}
                        style={{width:px(60),height:px(60)}}
                        />);
            } break;
            default: {
                return  (<ItemIcon onClick={this.props.showSideDialog}
                        iconStyle={{color:'#666666'}}
                        code={"\ue6a6"}
                        />);
            }
            break;
        }
                    // this.props.shopType == 'taobao' ?
                    // <Image src={'https://q.aiyongbao.com/1688/web/img/preview/taoLogo.png'}
                    // style={{width:px(60),height:px(60)}}
                    // />
                    // :
                    // (
                    //     this.props.shopType == 'pdd' ?
                    //     <Image src={'https://q.aiyongbao.com/1688/web/img/preview/pingDDLogo.png'}
                    //     style={{width:px(60),height:px(60)}}
                    //     />
                    //     :
                    //     <ItemIcon onClick={this.props.showSideDialog}
                    //     iconStyle={{color:'#666666'}}
                    //     code={"\ue6a6"}
                    //     />
                    // )
    }
    render(){
        var self=this;
        return (
            <View style={{paddingRight:px(100),backgroundColor:'#fff'}}>
                <ScrollView
                    ref="scroller1"
                    style={styles.listContainer}
                    horizontal={true}
                    disabledPtr={true}
                    onEndReachedThreshold={20}
                    showsHorizontalScrollIndicator={false}>
                    {this.getViews()}
                </ScrollView>
                <View style={styles.arrowDown} onClick={this.props.showSideDialog}>
                {
                    this.renderlittleicon()
                }
                </View>
            </View>
        )
    }
}
