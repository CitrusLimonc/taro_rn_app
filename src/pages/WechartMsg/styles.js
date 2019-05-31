import px from '../../Biz/px.js';
export default {
    imgLine:{
        backgroundColor:'#fff',
        height:px(400),
        width:px(750),
        alignItems:'center',
        justifyContent:'center'
    },
    btnBox:{
        position:'fixed',
        bottom:px(24),
        left:px(30),
        height:px(80),
        width:px(690),
        backgroundColor:'#3089dc',
        borderRadius:px(8),
        alignItems:'center',
        justifyContent:'center'
    },
    btnText:{
        color:'rgba(255,255,255,0.8)',
        fontSize:px(32)
    },
    maskStyle:{
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    modal2Style:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    dialogContent:{
        flex:1,
        borderRadius: px(8),
        backgroundColor: '#fff',
        paddingTop:px(20),
        width: px(612)
    },
    adStyle:{
        backgroundColor:'#000000',
        width:px(750),
        flex:1,
        flexDirection: 'column',
        paddingTop:px(100),
        alignItems: 'center',
    },
    close:{
        color:'#fff',
        fontSize:42,
        borderWidth:'2',
        borderColor:'#fff',
        borderRadius: 21,
        marginTop:24,
    },
    shopLine:{
        borderBottomColor:'#f5f5f5',
        borderBottomStyle:'solid',
        borderBottomWidth:px(2),
        paddingLeft:24,
        paddingRight:24,
        backgroundColor:'#fff',
        flexDirection:'row',
        alignItems:'center',
        width:px(750),
        marginTop:24,
        height:88
    },
    titleText:{
        color:'#000',
        fontSize:px(28),
        fontWeight:'600'
    },
    switchLine:{
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center',
    }
};
