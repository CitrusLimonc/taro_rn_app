import px from '../../Biz/px.js';
export default {
	tableHead: {
		backgroundColor: '#f8f8f8',
		height: px(48),
		borderColor: '#eeeeee',
		borderWidth: px(2),
		alignItems: 'center',
		justifyContent: 'center'
	},
	tableBodyLine: {
		backgroundColor:'#fff',
        borderColor:'#eeeeee',
        borderWidth:px(2),
        marginTop:px(-2),
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row'
	},
	paginationStyle: {
		position: 'absolute',
		width: px(700),
		height: px(100),
		left: px(0),
		bottom: px(0),
		color: 'rgba(255, 255, 255 ,0.5)',
		itemColor: '#fffaaa',
		itemSelectedColor: '#f1f1f1'
	},
	foot: {
		borderTopWidth: px(1),
		borderTopColor: '#e5e5e5',
		height: px(100),
		flexDirection: 'row',
	},
	right: {
		flex: 1,
		height: px(100),
		backgroundColor: '#FF6000',
		justifyContent: 'center',
		alignItems: 'center',
	},
	right_text: {
		fontSize: px(32),
		color: '#ffffff',
	},
}
