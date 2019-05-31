import px from '../../../Biz/px.js';
export default {
	gridcell: {
		width: px(340),
		marginBottom: px(48),
		marginLeft: px(24),
	},
	gridcellsmall: {
		width: px(218),
		marginLeft: px(20),
	},
	gridcellnoimage:{
		height: px(340),
		width: px(340),
		backgroundColor: "#fafafa"
	},
	gridcellnoimagesmall: {
		height: px(218),
		width: px(218),
		backgroundColor: "#fafafa"
	},
	gridcellimage:{
		height: px(340),
		width: px(340),
		borderRadius: px(8),
		borderWidth: 1,
		borderColor: "#e5e5e5",
		backgroundColor: "#fafafa"
	},
	gridcellimagesmall :{
		height: px(218),
		width: px(218),
		borderRadius: px(8),
		borderWidth: px(1),
		borderColor: "#e5e5e5",
		backgroundColor: "#fafafa"
	},
	gridcelltitle:{
	},
	gridcelltitlecenter: {
		flexDirection: 'column',
	},
	rowNoData: {
		flex: 1,
		height: px(218),
		width: px(218),
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: px(20),
		borderRadius: "20%",
		borderWidth: px(1),
		borderColor: "#e5e5e5",
		backgroundColor: "#fff",
	},
	gridtitle:{
		alignItems: 'center',
		justifyContent: 'space-around',
		flexDirection: 'column',
		fontSize: px(24),
		textOverflow: 'ellipsis',
		color: '#333333'
	},
}
