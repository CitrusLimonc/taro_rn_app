import px from '../../../Biz/px.js';
export default {
    firstLine:{
        borderTopWidth:px(1),
        borderTopColor:'#e5e5e5',
        borderBottomWidth:px(1),
        borderBottomColor:'#e5e5e5',
        flexDirection:'row',
        alignItems: 'center',
        height: px(75),
        paddingLeft: px(20),
        paddingRight: px(24),
    },
    orderNum:{
        borderBottomWidth:px(1),
        borderBottomColor:'#e5e5e5',
        height: px(75),
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft:px(24),
        paddingRight:px(24),
        paddingBottom:px(24),
        paddingTop:px(24),
    },
    errorLine:{
        borderBottomWidth:px(1),
        borderBottomColor:'#e5e5e5',
        paddingLeft:px(24),
        paddingRight:px(24),
        paddingBottom:px(24),
        paddingTop:px(24),
        alignItems: 'center',
        flexDirection: 'row',
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
    copy:{
        fontSize: px(18),
        color: '#666',
        marginLeft: px(8),
    },
    totals:{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderTopWidth:px(1),
        borderTopColor:'#e5e5e5',
        borderBottomWidth:px(1),
        borderBottomColor:'#e5e5e5',
        height: px(75),
        paddingLeft:px(24),
        paddingRight:px(24),
        paddingBottom:px(24),
        paddingTop:px(24),
        marginTop: px(-1),
    },
    buyerFeedback:{
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth:px(1),
        borderBottomColor:'#e5e5e5',
        height: px(75),
        paddingLeft:px(24),
        paddingRight:px(24),
        paddingBottom:px(24),
        paddingTop:px(24),
        fontSize: px(24),
    },
    logists:{
        justifyContent:'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth:px(1),
        borderBottomColor:'#e5e5e5',
        height: px(72),
        paddingLeft:px(24),
        paddingRight:px(24),
    },
    logists2:{
        height:px(140),
        backgroundColor:'#fff',
        paddingLeft:px(24),
        paddingRight:px(24),
        paddingTop:px(18),
        paddingBottom:px(18),
    },
    logistMess:{
        flexDirection: 'row',
        flex:1,
    },
    details:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText:{
        color: '#b4b4b4',
        fontSize: px(24),
        fontWeight: '200',
    },
    new:{
        height: px(24),
        width: px(24),
    },
    memoIcon:{
        flex:1,
        fontSize:px(40),
    },
    tagBox:{
        width:px(88),
        height:px(36),
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#ff6000',
        borderWidth:px(1),
        marginLeft:px(8)
    },
    tagText:{
        fontSize:px(24),
        color:'#ff6000'
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
        borderTopWidth:1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: px(94)
    },
    dlgBtn:{
        flex:1,
    },
}
