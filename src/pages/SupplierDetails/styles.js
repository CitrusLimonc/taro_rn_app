import px from '../../Biz/px.js';
export default {
	zdy_v: {
		height: px(100),
		backgroundColor: '#FFF',
		flexDirection: 'row',
		borderTopWidth: px(1),
		borderTopColor: '#e5e5e5',
		borderTopStyle: 'solid'
	},
	zdy_l: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text_l: {
		fontSize: px(32),
		color: '#666',
	},
	foot: {
		height: px(90),
		flexDirection: 'row',
		borderTopWidth: px(1),
		borderTopColor: '#e5e5e5',
	},
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1
	},
	itemRefresh:{
        width:px(750),
        height:px(100),
        alignItems:'center',
        justifyContent:'center'
    },
	loadmore_view:{
        height: px(60),
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadmore_text:{
        fontSize: px(24),
        color: '#FF6000'
    },
}
