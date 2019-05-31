import px from '../../Biz/px.js';
export default {
    body:{
        paddingLeft:24,
        paddingRight:24,
        paddingBottom:24,
        paddingTop:24,
        backgroundColor:'#f5f5f5',
        borderBottomStyle:'solid',
        borderBottomWidth:px(1),
        borderBottomColor:'#CCCCCC',
    },
    whiteBody:{
        borderRadius:px(12),
        backgroundColor:'#ffffff',
        flexDirection:'row',
        alignItems:'center',
        height:px(112),
        width:px(714),
        paddingLeft:px(24)
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
        width:150,
    },
}
