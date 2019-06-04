import px from '../../Biz/px.js';
export default {
    rx_btn:{
        height:px(64),
        width:px(162),
        justifyContent:'center',
        alignItems:'center',
        borderRadius:px(5),
        borderWidth:px(2),
        borderColor:'#fff',

    },
    rx_head:{
        height:px(46),
        paddingLeft:px(26),
        paddingTop:px(8),
        backgroundColor:'rgba(245,119,69,0.8)',
        borderTopLeftRadius: px(23),
        borderTopRightRadius:px(23),
    },
    rx_foot:{
        height:px(112),
        paddingLeft:px(24),
        paddingRight:px(24),
        paddingTop:px(8),
        backgroundColor:'rgba(245,119,69,0.8)',
        flexDirection:'row',
        alignItems:'center',
    },
    new:{
        fontSize:px(36),
        color: '#47B4F8',
        height: px(36),
        width: px(36),
    },
    line_item:{
        flexDirection: 'row',
        height: px(72),
        borderBottomWidth: px(1),
        borderBottomColor: '#e5e5e5',
        alignItems: 'center',
    },
    line_cell:{
        paddingTop: px(14),
        paddingBottom: px(14),
        flexDirection: 'row',
        borderBottomWidth: px(1),
        borderBottomColor: '#e5e5e5',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    item:{
        flexDirection: 'column',
    },
    item_momey:{
        flex:1,
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginRight: px(25),
        justifyContent:"space-between",
        height:px(70)
    },
    itemfoot:{
        flex:1,
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginRight: px(25),
    },
    text:{
        fontSize: px(28),
    },
    text_grey:{
        fontSize: px(24),
        color: '#999999',
    },
    text_content:{
        fontSize: px(24),
    },
    text_right24:{
        fontSize: px(24),
        textAlign: 'right',
    },
    text_right28:{
        fontSize: px(28),
        textAlign: 'right',
    },
    text_item:{
        color: '#333333',
        fontSize: px(26),
        width: px(420),
        height: px(70),
        textOerflow: 'ellipsis',
    },
    text_row:{
        flexDirection: 'row',
        flex:1,
    },
    view_text:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    image:{
        height: px(36),
        width: px(32),
    },
    cell_img:{
        height: px(120),
        width: px(120),
        justifyContent: 'flex-end',

    },
    white_text:{
        color: '#ffffff',
        fontSize: px(24)
    },
    status_color:{
        height: px(30),
        width: px(120),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: px(0),
    },
    red_text:{
        color: '#F23C3C',
        fontSize: px(24),
    },
    red_button:{
        borderRadius: px(6),
        borderWidth: px(2),
        width:px(116),
        height: px(36),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#F23C3C',
        flexDirection: 'row',
    },
    new2:{
      fontSize:px(22),
      color: '#C7C7C7',
      height: px(22),
      width: px(22),
    },
}
