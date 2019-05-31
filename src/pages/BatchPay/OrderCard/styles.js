import px from '../../../Biz/px.js';
export default {
    cardBox:{
        backgroundColor:'#fff',
    },
    orderNum:{
        borderBottomWidth:px(1),
        borderBottomColor:'#e5e5e5',
        borderBottomStyle:'solid',
        height: px(75),
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft:px(24),
        paddingRight:px(24),
        paddingBottom:px(24),
        paddingTop:px(24),
        fontSize: px(24),
        color: '#333',
        fontWeight: '200',
    },
    orderText:{
        color: '#999',
        fontSize: px(24),
    },
    number:{
        fontWeight:'normal',
        color:'#333',
        fontSize: px(24),
    },
    tagBox:{
        width:px(88),
        height:px(36),
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#ff6000',
        borderWidth:px(1),
        borderStyle:'solid',
        marginLeft:px(8)
    },
    tagText:{
        fontSize:px(24),
        color:'#ff6000'
    },
    cardLine:{
        flexDirection:'row',
        paddingTop:px(18),
        paddingBottom:px(18),
        paddingRight:px(24),
        borderBottomColor:'#f5f5f5',
        borderBottomStyle:'solid',
        borderBottomWidth:px(2),
        marginLeft:px(24)
    },
    img:{
        width:px(120),
        height:px(120),
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    wangwang:{
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth:px(1),
        borderBottomColor:'#e5e5e5',
        borderBottomStyle:'solid',
        height: px(75),
        paddingLeft: px(24),
        paddingRight: px(24),
        width:px(750)
    },
    wangIcon:{
        fontSize: px(35),
        marginLeft: px(10),
        color: '#51bcf9',
        fontWeight:100,
    },
    wangText:{
        fontSize: px(24),
        lineHeight: px(35),
        fontWeight: 400,
        alignItems: 'center',
        marginLeft: px(10),
        color:'#333'
    },
}
