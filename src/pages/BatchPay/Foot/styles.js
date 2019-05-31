import px from '../../../Biz/px.js';
export default {
    footBottom:{
        position:'fixed',
        bottom: px(0),
        left: px(0),
        right: px(0),
        height: px(160),
        backgroundColor:'#fff'
    },
    footTop:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#ffffff',
        height: px(60),
        borderTopColor:'#e5e5e5',
        borderTopStyle:'solid',
        borderTopWidth:px(2),
        paddingRight:px(24),
        paddingLeft:px(24),
        flex:1,
    },
    footBtn:{
        flex:1,
        alignItems:'center',
        justifyContent: 'center',
        height: px(100),
        backgroundColor:'#ff6000'
    },
    footText:{
        fontSize: px(32),
        color: '#ffffff',
        fontWeight: '300'
    },
}
