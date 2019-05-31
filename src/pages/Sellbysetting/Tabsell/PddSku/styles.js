import px from '../../Biz/px.js';
export default {
    commonLine:{
        flex:1,
        backgroundColor:'#EEEEEE',
    },
    skuone:{
        height:252,
        backgroundColor:'#ffffff',
        paddingLeft:24,
        paddingRight:24,
        marginBottom:2,
    },
    head:{
        height: 50,
        alignItems: 'flex_start',
        justifyContent: 'center',
        marginTop:20,
        // marginLeft:20,
    },
    textHead:{
        color:'#3d4145',
        fontSize:32,
    },
    skuoneTop:{
        height:84,
        borderBottomColor:'#e5e5e5',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderBottomStyle:'solid',
        borderBottomWidth:px(1),
    },
    skuoneMid:{
        height:84,
        borderBottomColor:'#e5e5e5',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderBottomStyle:'solid',
        borderBottomWidth:px(1),
    },
    skuoneBot:{
        height:56,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end',

    },
    skuoneTopLeft:{
        fontFamily: 'PingFangSC-Regular',
        fontSize: 28,
        color: '#333333',
    },
    skuoneTopRight:{
        fontFamily: 'PingFangSC-Regular',
        fontSize: 28,
        color: '#3089DC',
    },
    textBox:{
        width:px(110),
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end'
    },
    skuoneMidtext:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    skuoneMidtextLeft:{
        fontFamily: 'PingFangSC-Regular',
        fontSize: 28,
        color: '#999999',
    },
    skuoneMidtextRight:{
        fontFamily: 'PingFangSC-Regular',
        fontSize: 28,
        color: '#333333',
    },
    skuoneMidtextRightinput:{
        height:48,
        width:200,
    },
    skuoneBotleft:{
        fontFamily: 'PingFangSC-Regular',
        fontSize: 28,
        color: '#999999',
    },
    skuoneBotmid:{
        fontFamily: 'PingFangSC-Regular',
        fontSize: 28,
        color: '#FF6000',
    },
    input:{
        marginTop:20,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
    },
    inputText:{
        fontFamily: 'PingFangSC-Regular',
        fontSize: 32,
        color: '#4A4A4A',
        height:40,
    },
    footer: {
        height:82,
        borderTopColor:'#dddddd',
        flexDirection:'row',
        borderTopStyle:'solid',
        borderTopWidth:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    body:{
        paddingLeft:32,
        paddingRight:32,
    },
    tips:{
        marginTop:14,
        marginBottom:44,
        fontFamily: 'PingFangSC-Regular',
        fontSize: 24,
        color: '#979797',
    },
}
