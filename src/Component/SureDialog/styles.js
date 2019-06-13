import px from '../../Biz/px.js';
export default {
    maskStyle:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        position:'absolute',
        left:px(0),
        right:px(0),
        top:px(0),
        bottom:px(0)
    },
    dialogContent:{
        borderRadius: px(8),
        backgroundColor: '#ffffff',
        paddingTop:px(20),
        width: px(612),
        minHeight:px(348)
    },
    foot:{
        width:px(612),
        flexDirection:'row',
        height:px(96),
        marginTop:px(20)
    },
    footBtn:{
        width:px(306),
        height:px(96),
        borderTopWidth:px(2),
        borderColor:'#DCDEE3',
        alignItems:'center',
        justifyContent:'center',
        borderBottomLeftRadius:px(8)
    },
    submitBtn:{
        width:px(306),
        height:px(96),
        borderTopWidth:px(1),
        borderTopColor:'#DCDEE3',
        alignItems:'center',
        justifyContent:'center',
        borderBottomRightRadius:px(8),
        backgroundColor:'#ff6000'
    },
    fontStyle:{
        fontSize:px(32),
        color:'#272636'
    },
    tokenBody:{
        // minHeight:px(216),
        paddingLeft:px(40),
        paddingRight:px(40),
        alignItems:'center',
        justifyContent:'center',
        flex:1,
        flexDirection:'row'
    }
}
