import px from '../../Biz/px.js';
export default {
    topLine:{
        width:px(750),
        height:px(96),
        backgroundColor:'#ffffff',
        borderBottomWidth:px(1),
        borderBottomColor:'#e5e5e5',
        paddingLeft:px(24),
        flexDirection:'row',
        alignItems:'center'
    },
    mask:{
        backgroundColor:'transparent'// 可以修改默认的灰底
    },
    categoryModel:{
        width: px(750),
        position:'absolute',
        height:px(750),
        left:px(0),
        right:px(0),
        bottom:px(0)
    },
    body: {
        flex:1,
        backgroundColor: '#ffffff',
    },
    footer: {
        borderTopColor:'#dddddd',
        flexDirection:'row',
        borderTopWidth:px(1),
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: px(94)
    },
    dlgBtn:{
        flex:1,
        borderWidth:px(0)
    },
    card:{
        backgroundColor:'#ffffff',
        borderRadius:px(24),
        paddingLeft:px(24),
        paddingRight:px(24),
        paddingBottom:px(24),
        width:px(702),
        marginLeft:px(24),
        marginRight:px(24),
        marginTop:px(24)
    },
    supplierLine:{
        height:px(64),
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:px(2),
        borderBottomColor:'#fafafa'
    },
    cardLine:{
        flexDirection:'row',
        paddingBottom:px(18)
    },
    skuTag:{
        flexDirection:'row',
        backgroundColor:'#f5f5f5',
        paddingLeft:px(8),
        paddingRight:px(8),
        paddingTop:px(8),
        paddingBottom:px(8),
        borderRadius:px(4),
        alignItems:'center',
        maxWidth: px(300),
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    littleBtn:{
        width:px(168),
        height:px(48),
        borderRadius:px(24),
        borderWidth:px(2),
    },
    priceLine:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:px(12),
    },
    priceTag:{
        position:'absolute',
        right:px(0),
        top:px(28),
    },
    noMateTag:{
        position:'absolute',
        right:px(0),
        top:px(28),
        height:px(24),
        width:px(120),
        backgroundColor:'#ff6000',
        borderRadius:px(4),
        alignItems:'center',
        justifyContent:'center'
    },
    footLine:{
        position:'absolute',
        bottom:px(0),
        left:px(0),
        right:px(0),
        borderTopColor:'#e3e3e3',
        borderTopWidth:px(2)
    },
    footTop:{
        height:px(56),
        width:px(750),
        paddingLeft:px(24),
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#ffffff'
    },
    footBottom:{
        width:px(750),
        height:px(96),
        backgroundColor:'#ff6000',
        alignItems:'center',
        justifyContent:'center'
    },
    footText:{
        fontSize:px(32),
        color:'#ffffff'
    },
    footBottomGray:{
        width:px(750),
        height:px(96),
        backgroundColor:'#e8e8e8',
        alignItems:'center',
        justifyContent:'center'
    },
    footTextGray:{
        fontSize:px(32),
        color:'#BFBFBF'
    },
    headLine:{
        height:px(96),
        width: px(750),
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#ffffff',
        borderBottomColor:'#eeefee',
        borderBottomWidth:px(2)
    },
    closeTag:{
        position:'absolute',
        right:px(24),
        top:px(34),
    },
    cardLine1688:{
        flexDirection:'row',
        paddingLeft:px(24),
        paddingRight:px(24),
        paddingTop:px(18),
        paddingBottom:px(18),
        borderBottomColor:'#eeefee',
        borderBottomWidth:px(2)
    },
    skuNameStyle:{
        paddingLeft:px(32),
        paddingRight:px(32),
        paddingTop:px(12),
        paddingBottom:px(12),
        backgroundColor:'#F5F5F5',
        borderRadius:px(16),
        height:px(56),
        marginRight:px(24),
        flexDirection:'row',
        marginTop:px(18)
    },
    skuTextStyle:{
        fontSize:px(24),
        color:'#222222'
    },
    skuBox:{
        paddingLeft:px(24),
        paddingBottom:px(24)
    },
    skuLine:{
        paddingTop:px(24),
        paddingBottom:px(24),
        borderBottomColor:'#eeefee',
        borderBottomWidth:px(2)
    }
}
