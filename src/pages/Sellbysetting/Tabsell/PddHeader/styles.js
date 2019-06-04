import px from '../../../../Biz/px.js';
export default {
    body:{
        paddingLeft:px(24),
        paddingRight:px(24),
        paddingBottom:px(24),
        paddingTop:px(24),
        backgroundColor:'#f5f5f5',
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
        fontSize: px(28),
        color: '#999999',
    },
    skuoneMidtextRight:{
        fontFamily: 'PingFangSC-Regular',
        fontSize: px(28),
        color: '#333333',
    },
    skuoneMidtextRightinput:{
        height:px(48),
        width:px(150),
    },
}
