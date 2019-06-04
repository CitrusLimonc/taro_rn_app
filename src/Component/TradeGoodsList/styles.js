import px from '../../Biz/px.js';
export default {
    inputNormal:{
        width:px(110),
        height: px(40),
        borderWidth:px(1),
        borderColor:'#979797',
    },
    layGrid:{
        flexDirection: 'row',
    },
    lays:{
        paddingTop:px(15),
        paddingRight:px(24),
        paddingBottom:px(15),
        marginLeft:px(24),
        borderBottomWidth: px(1),
        borderBottomColor:'#e5e5e5',
        backgroundColor: '#ffffff',
    },
    laysLast:{
        paddingTop:px(15),
        paddingRight:px(24),
        paddingBottom:px(15),
        marginLeft:px(24),
        backgroundColor: '#ffffff'
    },
    imgCol:{
        width:px(120),
        height:px(120),
    },
    img:{
        width:px(120),
        height:px(120),
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mesCol:{
        flex:1,
    },
    priceCol:{
        height:px(120),
        width:px(118),
        alignItems:'flex-end',
        justifyContent:'space-between',
    },
    colors:{
        flexDirection: 'row',
        fontSize: px(22),
        marginTop:px(28),
        width: px(420),
    },
    name:{
        fontSize: px(26),
        color: '#333',
        width: px(420),
    },
    newPrice:{
        fontSize: px(26),
        textAlign: 'right',
        lineHeight: px(40),
        color:'#333'
    },
    oldPrice:{
        fontSize: px(24),
        color: '#999',
        textDecoration: 'line-through',
        textAlign: 'right',
    },
    numbers:{
        fontSize: px(24),
        color: '#ff6000',
        textAlign: 'right',
    },
    priceText:{
        fontSize: px(24),
        color: '#4c9ee4',
        textAlign: 'right',
        lineHeight: px(40),
    },
    inputPrice:{
        width: px(130),
        height: px(40),
        fontSize: px(24),
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
    },
    new:{
        fontSize:px(36),
        color: '#E41010',
        height: px(36),
        width: px(36),
    },
    v_row:{
        flexDirection: 'row',
    },
    iv_row:{
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    red_btn:{
        width: px(116),
        height: px(36),
        borderWidth: px(1),
        borderColor: '#E41010',
        borderRadius: px(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
}
