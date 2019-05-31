import px from '../../Biz/px.js';
export default {
	gridcell: {
		flex:1,
		height: px(464),
		width: px(340),
		marginBottom: px(24),
		marginLeft: px(24),
	},
	rowData:{
		flex:1,
		height: px(244),
		width: px(218),
		marginLeft:px(20),
	},
	rowNoData: {
		flex: 1,
		height: px(218),
		width: px(218),
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: px(20),
		borderRadius: "20%",
		borderWidth: 1,
		borderColor: "#e5e5e5",
		backgroundColor: "#fff",
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
    }
}
