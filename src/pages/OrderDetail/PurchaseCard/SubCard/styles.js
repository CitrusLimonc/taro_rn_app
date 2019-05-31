import px from '../../Biz/px.js';
export default {
    cardBack:{
        backgroundColor:'#f5f5f5',
        paddingTop:24,
        paddingRight:24,
        paddingBottom:24,
        paddingLeft:24
    },
    card:{
        backgroundColor:'#ffffff',
        borderRadius:24,
        paddingLeft:24,
        flex:1,
        marginTop:24,
    },
    firstLine:{
        borderBottomColor:'#f5f5f5',
        borderBottomStyle:'solid',
        borderBottomWidth:px(2),
        height:76,
        paddingRight:12,
        flexDirection:'row',
        alignItems:'center'
    },
    copyIcon:{
        fontSize:28,
        color: '#3089DC',
        height: 28,
        width: 28,
    },
    cardLine:{
        flexDirection:'row',
        paddingTop:18,
        paddingBottom:18,
        paddingRight:24,
        borderBottomColor:'#f5f5f5',
        borderBottomStyle:'solid',
        borderBottomWidth:px(2)
    },
    footLine:{
        flexDirection:'row',
        height:100,
        alignItems:'center',
        justifyContent:'flex-end'
    },
    footBtns:{
        width:px(162),
        height:px(64),
        borderRadius:px(32),
        marginRight:px(36)
    },
    littleTag:{
        width:88,
        height:36,
        borderColor:'#ff6000',
        borderStyle:'solid',
        borderWidth:px(1),
        backgroundColor:'#ffffff',
        borderRadius:4,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    littleTagText:{
        fontSize:24,
        color:'#FF6000'
    },
    priceLine:{
        flexDirection:'row',
        flex:1,
        justifyContent:'flex-end'
    },
    priceLineBox:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        borderBottomColor:'#f5f5f5',
        borderBottomStyle:'solid',
        borderBottomWidth:px(2),
        paddingRight:24,
    },
    littleBtn:{
        width:168,
        height:48,
        borderRadius:24,
        borderColor:'#ff6000',
        borderStyle:'solid',
        borderWidth:px(2),
        color:'#ff6000',
        fontSize:px(24)
    },
    priceLine:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:px(12),
    },
    priceTag:{
        position:'absolute',
        right:0,
        top:28,
    },
    noMateTag:{
        position:'absolute',
        right:0,
        top:28,
        height:24,
        width:120,
        backgroundColor:'#ff6000',
        borderRadius:4,
        alignItems:'center',
        justifyContent:'center'
    },
    mask:{
        backgroundColor:'transparent'// 可以修改默认的灰底
    },
    categoryModel:{
        width: px(750),
        position:'absolute',
        height:px(750),
        left:0,
        right:0,
        bottom:0
    },
    body: {
        flex:1,
        backgroundColor: '#ffffff',
    },
    footer: {
        borderTopColor:'#dddddd',
        flexDirection:'row',
        borderTopStyle:'solid',
        borderTopWidth:1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: px(94)
    },
    dlgBtn:{
        flex:1,
        borderWidth:0
    },
    supplierLine:{
        height:64,
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        borderBottomStyle:'solid',
        borderBottomWidth:px(2),
        borderBottomColor:'#fafafa'
    },
    skuTag:{
        flexDirection:'row',
        backgroundColor:'#f5f5f5',
        paddingLeft:8,
        paddingRight:8,
        paddingTop:8,
        paddingBottom:8,
        borderRadius:4,
        alignItems:'center',
        maxWidth: px(300),
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    footBottom:{
        width:px(750),
        height:96,
        backgroundColor:'#ff6000',
        alignItems:'center',
        justifyContent:'center'
    },
    footText:{
        fontSize:32,
        color:'#ffffff'
    },
    footBottomGray:{
        width:px(750),
        height:96,
        backgroundColor:'#e8e8e8',
        alignItems:'center',
        justifyContent:'center'
    },
    footTextGray:{
        fontSize:32,
        color:'#BFBFBF'
    },
    headLine:{
        height:96,
        width: px(750),
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#ffffff',
        borderBottomColor:'#eeefee',
        borderBottomStyle:'solid',
        borderBottomWidth:2
    },
    closeTag:{
        position:'absolute',
        right:24,
        top:34,
    },
    cardLine1688:{
        flexDirection:'row',
        paddingLeft:24,
        paddingRight:24,
        paddingTop:18,
        paddingBottom:18,
        borderBottomColor:'#eeefee',
        borderBottomStyle:'solid',
        borderBottomWidth:2
    },
    skuNameStyle:{
        paddingLeft:32,
        paddingRight:32,
        paddingTop:12,
        paddingBottom:12,
        backgroundColor:'#F5F5F5',
        borderRadius:px(16),
        height:56,
        marginRight:24,
        flexDirection:'row',
        marginTop:18
    },
    skuTextStyle:{
        fontSize:24,
        color:'#222222'
    },
    skuBox:{
        paddingLeft:24,
        paddingBottom:24
    },
    skuLine:{
        paddingTop:24,
        paddingBottom:24,
        borderBottomColor:'#eeefee',
        borderBottomStyle:'solid',
        borderBottomWidth:2
    },
    logistCard:{
        paddingTop:24,
        paddingBottom:24,
        borderBottomColor:'#f5f5f5',
        borderBottomStyle:'solid',
        borderBottomWidth:2
    },
    tabbar:{
        flex:1,
        flexDirection:'row',
        borderBottomColor:'#ffffff',
        borderBottomStyle:'solid',
        borderBottomWidth:2,
        height:68,
        alignItems:'center',
        justifyContent:'center'
    },
    tabbarActive:{
        borderBottomColor:'#ff6000',
        borderBottomStyle:'solid',
        borderBottomWidth:2,
        flex:1,
        flexDirection:'row',
        height:68,
        alignItems:'center',
        justifyContent:'center'
    },
    img:{
        width:120,
        height:120,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bo_f:{
        height: 30,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: px(0),
        opacity: 0.8,
    },
    bo_txt:{
        fontSize: px(24),
        color: '#ffffff',
    }
}
