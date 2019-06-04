import px from '../../Biz/px.js';
export default {
    image:{
        width: px(540),
        height: px(540)
    },
    codeContent:{
        marginTop: px(-50),
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeIcon:{
        position: 'absolute',
        right: px(30),
        top: px(40)
    },
    saveBtn:{
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth:px(1),
        borderColor:'#ffffff',
        width: px(250),
        height: px(70),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: px(20),
        borderRadius: px(10)
    },
    saveText:{
        color: '#fff',
        fontSize: px(28),
        fontWeight: '300'
    },
    modal2Style:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    textarea:{
        height:px(135),
        borderWidth:px(1),
        borderColor:'#C4C6CF',
        borderRadius: px(8),
        flex: 1,
        paddingTop: px(10),
        paddingRight: px(10),
        paddingBottom: px(10),
        paddingLeft: px(10),
        marginTop: px(20),
        fontSize: px(28),
        color: '#4A4A4A',
        marginLeft: px(25),
        marginRight: px(25)
    },
    dialogContent:{
        flex:1,
        borderRadius: px(8),
        backgroundColor: '#fff',
        paddingTop:px(20),
        width: px(612)
    },
    words:{
        position: 'absolute',
        right:px(30),
        top: px(120),
        fontSize: px(24),
        color: '#333'
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
        borderBottomRightRadius:px(8)
    },
    fontStyle:{
        fontSize:px(32),
        color:'#272636'
    }
}
