import px from '../../../../Biz/px.js';
export default {
    buttonGroup:{
        flexDirection: 'row',
        justifyContent:'flex-end',
        paddingTop:px(24),
        paddingBottom:px(24),
        paddingLeft:px(24),
        backgroundColor:'#faf9fa',
        borderBottomStyle:'solid',
        borderBottomWidth:px(1),
        borderBottomColor:'#e5e5e5'
    },
    buttons:{
        alignItems: 'center',
        justifyContent: 'center',
        height: px(56),
        marginRight:px(20),
        borderWidth:px(2),
        borderStyle:'solid',
        borderColor:'#DCDEE3',
        backgroundColor: '#ffffff',
        borderRadius: px(8),
        flexDirection: 'row',
        paddingLeft:px(16),
        paddingRight:px(16)
    },
    buttonText:{
        fontSize: px(28),
        color: '#5F646E'
    },
    modal2Style:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    dialogText:{
        fontSize:px(28),
        color:'#4a4a4a'
    },
    dialogContent:{
        flex:1,
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
    footBtn:{
        width:px(306),
        height:px(96),
        borderTopWidth:px(2),
        borderStyle:'solid',
        borderColor:'#DCDEE3',
        alignItems:'center',
        justifyContent:'center',
        borderBottomLeftRadius:px(8)
    },
    submitBtn:{
        width:px(306),
        height:px(96),
        borderTopWidth:px(1),
        borderTopStyle:'solid',
        borderTopColor:'#DCDEE3',
        alignItems:'center',
        justifyContent:'center',
        borderBottomRightRadius:px(8)
    },
    fontStyle:{
        fontSize:px(32),
        color:'#272636'
    },
    dialogText:{
        width:px(612),
        fontSize:px(28),
        color:'#333333',
        textAlign:'center',
        paddingLeft:px(24),
        paddingRight:px(24),
        lineHeight:px(42)
    }
}
