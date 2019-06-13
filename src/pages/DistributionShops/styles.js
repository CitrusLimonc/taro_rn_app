import px from '../../Biz/px.js';
export default {
    topLine:{
        flexDirection:'row',
        width:px(750),
        height:px(120),
        paddingLeft:px(24),
        paddingRight:px(24),
        alignItems:'center',
        backgroundColor:'#f5f5f5'
    },
    addIcon: {
        fontSize:px(60),
        color:'#2357ff'
    },
    shopLine:{
        borderBottomColor:'#f5f5f5',
        borderBottomWidth:px(2),
        height:px(170),
        paddingLeft:px(24),
        paddingRight:px(24),
        flexDirection:'row',
        alignItems:'center',
        width:px(750)
    },
    shopImage:{
        width:px(82),
        height:px(82),
        borderRadius:px(8)
    },
    footLine:{
        position:'absolute',
        bottom:px(0),
        left:px(0),
        right:px(0),
        height:px(96),
        flexDirection:'row',
        borderTopColor:'#e5e5e5',
        borderTopWidth:px(1)
    },
    footLeft:{
        backgroundColor:'#ffffff',
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    footRight:{
        backgroundColor:'#ff6000',
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    maskStyle:{
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    modal2Style:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    modalStyle:{
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'rgba(0,0,0,0)'
        backgroundColor:'transparent',
    },
    dialogContent:{
        borderRadius: px(8),
        backgroundColor: '#fff',
        paddingTop:px(20),
        width: px(612)
    },
    foot:{
        width:px(612),
        flexDirection:'row',
        height:px(96),
        marginTop:px(20)
    },
    cancelBtn:{
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
        borderBottomRightRadius:px(8)
    },
    submitBtnall:{
        flex:1,
        height:px(96),
        borderTopWidth:px(1),
        borderTopColor:'#DCDEE3',
        alignItems:'center',
        justifyContent:'center',
        borderBottomRightRadius:px(8)
    },
    fontStyle:{
        fontSize:px(32),
        color:'#272636'
    },
    addBtn:{
        flexDirection:'column',
        borderStyle:'dashed',
        borderColor:'#E5E5E5',
        borderWidth:px(4),
        borderRadius:px(8),
        alignItems:'center',
        justifyContent:'center',
        width:px(200),
        height:px(200),
        marginTop:px(24)
    },
    tagImage:{
        width:px(80),
        height:px(80),
        borderRadius:px(8),
        borderWidth:px(2),
        borderColor:'#E5E5E5',
        marginTop:px(24),
        marginRight:px(32),
        alignItems:'center',
        justifyContent:'center'
    },
    tagImageActive:{
        width:px(80),
        height:px(80),
        borderRadius:px(8),
        borderWidth:px(2),
        borderColor:'#0077FF',
        marginTop:px(24),
        marginRight:px(32),
        alignItems:'center',
        justifyContent:'center'
    },
    dialogBody:{
        paddingTop:px(28),
        paddingLeft:px(40),
        paddingRight:px(40)
    },
    borderLine:{
        borderBottomColor:'#E5E5E5',
        borderBottomWidth:px(2),
        marginTop:px(56),
        paddingBottom:px(8)
    },
    tokenBody:{
        height:px(216),
        paddingLeft:px(40),
        paddingRight:px(40),
        alignItems:'center',
        justifyContent:'center'
    },
    refresh: {
        width: px(750),
        height:px(80),
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#3089dc',
    },
    authError:{
        position:'absolute',
        top:px(112),
        left:px(204)
    },
    WDinput:{
        width:px(500),
        height:px(50),
        borderBottomColor:'#333333',
        borderBottomWidth:px(2),
        borderTopColor:'#E5E5E5',
        borderTopWidth:px(0),
        borderLeftColor:'#E5E5E5',
        borderLeftWidth:px(0),
        borderRightColor:'#E5E5E5',
        borderRightWidth:px(0),

    },
    questionnaireclose:{
        width:px(432),
        height:px(80),
        backgroundColor:'#108EE9',
        borderRadius:px(47),
        marginBottom:px(24),
        color:'#FFFFFF',
    },
    questionnairebutton:{
        width:px(432),
        height:px(80),
        backgroundColor:'#108EE9',
        borderRadius:px(47),
        marginBottom:px(24),
        color:'#FFFFFF',
    },
    WDinputout:{
        height:px(50),
        marginTop:px(50),
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
    },
    close:{
        color:'#e7e7e7',
        fontSize:px(32),
    },
    closeout:{
        marginTop:px(24),
        height:px(50),
        width:px(50),
        borderWidth: px(2),
        borderColor:'#e7e7e7',
        borderRadius: px(42),
        alignItems:'center',
        justifyContent:'center'
    }
};
