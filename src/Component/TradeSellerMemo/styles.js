import px from '../../Biz/px.js';
export default {
    memo:{
        paddingLeft: px(20),
        paddingRight: px(20),
        alignItems: 'center',
        height: px(70),
        borderBottomWidth: px(1),
        borderBottomColor: '#e5e5e5',
        flexDirection: 'row',
        fontSize: px(24),
        backgroundColor: '#fff',
    },
    sellerText:{
        flexDirection: 'row',
        fontSize: px(24),
        fontWeight: 100,
        color: '#b4b4b4',
    },
    text:{
        fontSize: px(24),
        fontWeight: 400,
        color: '#333',
    },
    memoIcon:{
        display: 'inline-block',
        flex:1,
        fontSize: px(45),
    },
    seller:{
        color: '#999',
        fontSize: px(24),
    },
    iconView:{
        flexDirection: 'row',
    }
}
