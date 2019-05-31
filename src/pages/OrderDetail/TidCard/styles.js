import px from '../../Biz/px.js';
export default {
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
        flexDirection: 'row',
        height: px(148),
        borderBottomWidth: px(1),
        borderBottomColor: '#e5e5e5',
        alignItems: 'center',
    },
    item:{
        flexDirection: 'column',
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
    text_item:{
        color: '#333333',
        fontSize: px(28),
        width: px(420),
        height: px(80),
        textOverflow: 'ellipsis',
    },
    image:{
        height: px(36),
        width: px(32),
    },
    cell_img:{
        height: px(120),
        width: px(120),
    },
    grey_view:{
        height:px(24),
        backgroundColor:'#F5F5F5',
    },
    dgrey_title:{
        height: px(60),
        backgroundColor: '#C8C7CC',
        justifyContent: 'center',
        paddingLeft: px(24),
        paddingTop:px(16),
        paddingBottom: px(4),
    },
    dgrey_text:{
        color: '#6D6D72',
        fontSize: px(28),
    },
    white_bk:{
        backgroundColor: '#ffffff',
        flex:1,
        flexDirection: 'column',
    },
}
