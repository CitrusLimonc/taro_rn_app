
import Taro, { Component, Config } from '@tarojs/taro';
import {Image,ScrollView} from '@tarojs/components';
import {GetQueryString} from '../../Public/Biz/GetQueryString.js';
import px from '../../Biz/px.js';
/**
 @aythor wzm
 代发教程
*/
export default class Courses extends Component{
    constructor(props) {
        super(props);
        this.state={
            Picinfo:[],
        }

    }

    config = {
        navigationBarTitleText: '代发教程'
    }

    componentWillMount(){
        let mark = GetQueryString({name:'type',self:this});
        if(mark == 'look'){
            this.setState({
                Picinfo:[
                    {pic:'https://q.aiyongbao.com/1688/web/img/look01.png',width:px(750),height:px(560)},
                    {pic:'https://q.aiyongbao.com/1688/web/img/look02.png',width:px(750),height:px(440)},
                    {pic:'https://q.aiyongbao.com/1688/web/img/look03.png',width:px(750),height:px(430)},
                    {pic:'https://q.aiyongbao.com/1688/web/img/look04.png',width:px(750),height:px(260)},
                    {pic:'https://q.aiyongbao.com/1688/web/img/look05.png',width:px(750),height:px(1008)},
                    {pic:'https://q.aiyongbao.com/1688/web/img/look06.png',width:px(750),height:px(1180)},
                    {pic:'https://q.aiyongbao.com/1688/web/img/look07.png',width:px(750),height:px(946)},
                    {pic:'https://q.aiyongbao.com/1688/web/img/look08.png',width:px(750),height:px(1120)},
                ],
            });
        }else{
            this.setState({
                Picinfo:[
                    {pic:'https://q.aiyongbao.com/1688/web/img/get01.png',width:px(750),height:px(780)},
                    {pic:'https://q.aiyongbao.com/1688/web/img/get02.png',width:px(750),height:px(250)},
                    {pic:'https://q.aiyongbao.com/1688/web/img/get03.png',width:px(750),height:px(1160)},
                    {pic:'https://q.aiyongbao.com/1688/web/img/get04.png',width:px(750),height:px(468)},
                ],
            });
        }
    }
    //显示图片
    detailPics(){
        let body =[];
        let pics = [];
        pics = this.state.Picinfo;
        pics.map((item,index)=>{
            body.push(
                <Image 
                key={index} 
                ref="testimage" 
                src={item.pic}  
                style={[{width:item.width,height:item.height}]} 
                />
            )
        })
        return body;
    }

    render(){
        return (
            <ScrollView>
            {this.detailPics()}
            </ScrollView>
        )
    }
}
const styles = {
    textPIc:{
        width:px(750),
        height:px(600),
    },
}
