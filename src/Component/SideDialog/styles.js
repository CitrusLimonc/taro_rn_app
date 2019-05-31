import px from '../../Biz/px.js';
export default {
    maskStyle:{
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    modalStyle:{
        position: 'absolute',
        right: px(0),
        top: px(0),
        bottom: px(0),
        width: px(560),
        backgroundColor: '#ffffff',
    },
    normalLine:{
        backgroundColor: '#f5f5f5',
        height: px(90),
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: px(20)
    },
    filterItem:{
        backgroundColor:'#eeefee',
        height:px(52),
        width:px(162),
        borderRadius:px(4),
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#eeefee',
        borderWidth:px(2),
        marginLeft:px(20),
        marginTop:px(20)
    },
    filterActive:{
        backgroundColor:'#ffefe5',
        height:px(52),
        width:px(162),
        borderRadius:px(4),
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#ff6000',
        borderWidth:px(2),
        marginLeft:px(20),
        marginTop:px(20)
    },
    filterItemText:{
        fontSize:px(24),
        color:'#333333'
    },
    filterActiveText:{
        fontSize:px(24),
        color:'#ff6000'
    },
    items:{
        flexDirection:'row',
        flexWrap:'wrap'
    },
    filterFoot:{
        position:'absolute',
        bottom:px(0),
        left:px(0),
        right:px(0),
        height:px(100),
        flexDirection:'row',
        borderTopWidth: px(1),
        borderTopColor: '#DCDDE3',
    },
    filterFootLeft:{
        flex:1,
        backgroundColor:'#fff',
        height:px(100),
        alignItems:'center',
        justifyContent:'center'
    },
    filterFootRight:{
        flex:1,
        backgroundColor:'#ff6000',
        height:px(100),
        alignItems:'center',
        justifyContent:'center'
    },
    subjectText:{
        color:'#333333',
        fontSize:px(28),
        width:px(555)
    },
    mask:{
        flex:1,
        width:px(750),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'rgba(0,0,0,0.3)'
    },
    tagIcon:{
        position:'absolute',
        right:0,
        bottom:0,
        color:'#ff6000',
        fontSize:px(28),
    }
}
