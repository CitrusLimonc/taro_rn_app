import px from '../../../../Biz/px.js';
export default {
    card:{
        backgroundColor:'#ffffff',
        borderRadius:px(24),
        paddingLeft:px(24),
        flex:1,
        marginTop:px(24),
    },
    firstLine:{
        borderBottomColor:'#f5f5f5',
        borderBottomWidth:px(2),
        height:px(76),
        paddingRight:px(12),
        flexDirection:'row',
        alignItems:'center'
    },
    copyIcon:{
        fontSize:px(28),
        color: '#3089DC',
        height: px(28),
        width: px(28),
    },
    cardLine:{
        flexDirection:'row',
        paddingTop:px(18),
        paddingBottom:px(18),
        paddingRight:px(24),
        borderBottomColor:'#f5f5f5',
        borderBottomWidth:px(2)
    },
    footLine:{
        flexDirection:'row',
        height:px(100),
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
        width:px(88),
        height:px(36),
        borderColor:'#ff6000',
        borderWidth:px(1),
        backgroundColor:'#ffffff',
        borderRadius:px(4),
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    littleTagText:{
        fontSize:px(24),
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
        borderBottomWidth:px(2),
        paddingRight:px(24),
    },
    littleBtn:{
        width:px(168),
        height:px(48),
        borderRadius:px(24),
        borderColor:'#ff6000',
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
        right:px(0),
        top:px(28),
    },
    noMateTag:{
        position:'absolute',
        right:px(0),
        top:px(120),
        height:px(24),
        width:px(120),
        backgroundColor:'#ff6000',
        borderRadius:px(4),
        alignItems:'center',
        justifyContent:'center'
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
    logistCard:{
        paddingTop:px(24),
        paddingBottom:px(24),
        borderBottomColor:'#f5f5f5',
        borderBottomWidth:px(2)
    },
    tabbar:{
        flex:1,
        flexDirection:'row',
        borderBottomColor:'#ffffff',
        borderBottomWidth:px(2),
        height:px(68),
        alignItems:'center',
        justifyContent:'center'
    },
    tabbarActive:{
        borderBottomColor:'#ff6000',
        borderBottomWidth:px(2),
        flex:1,
        flexDirection:'row',
        height:px(68),
        alignItems:'center',
        justifyContent:'center'
    },
    img:{
        width:px(120),
        height:px(120),
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bo_f:{
        height: px(30),
        width: px(120),
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
