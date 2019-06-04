import px from '../../../Biz/px.js';
export default {
    item:{
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        borderBottomWidth: px(1),
        borderBottomColor: '#e5e5e5',
        paddingTop:px(10),
        paddingRight:px(20),
        paddingBottom:px(10),
        paddingLeft:px(20),
    },
    delayValue:{
        color: '#666',
        fontSize: px(30),
    },
    activedValue:{
        fontSize: px(30),
        color:'#f6834e',
    },
    modalStyle:{
        justifyContent: 'flex-end',
        backgroundColor:'#fff',
        borderRadius:px(3),
    },
    footer:{
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: px(94),
    },
    dlgBtn:{
        flex:1,
        backgroundColor: '#f6834e',
        fontSize: px(28),
    },
    Head_v:{
        height:px(100),
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth:px(1),
        borderBottomColor:'#e5e5e5',
    },
    methodHead:{
        fontSize:px(32),
        color:'#5a5a5a',
        fontWeight:'300',
        lineHeight: px(100),
    },
    groupWrap:{
        backgroundColor:'#fff',
        flexDirection:'column',
        justifyContent:'flex-end',

    },
    foot:{
        borderTopWidth: px(1),
        borderTopColor: '#e5e5e5',
        height: px(100),
        flexDirection: 'row',
    },
    left:{
        flex:1,
        height: px(100),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    left_text:{
        fontSize: px(32),
        color: '#4a4a4a',
    },
    right:{
        flex:1,
        height: px(100),
        backgroundColor: '#FF6000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    right_text:{
        fontSize: px(32),
        color: '#ffffff',
    },
    right_text32:{
        fontSize: px(32),
        color: '#ffffff',
    },

}
