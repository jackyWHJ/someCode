import React from 'react';
import ZnListView from 'zn-component/znListView';
import ZnMessage from 'zn-component/znMessage';

import Comment from './Comment';

import { URL } from '../dataConfig';

const CommentList = React.createClass({
	getInitialState() {
		return {
			list: [],
			ajaxParams: {}
		}
	},

	onRefreshSuccess(data, ajaxParams) {
		if (data.code == 0) {
			const body = data.body || {};
			const arr = body.commentsArr || [];

			this.setState({ 
				list: arr,
				ajaxParams: {
					...ajaxParams, 
					showedAllPages: data.totalPage<=1, 
					showNoResultTip: data.totalPage==0, 
					showListView: data.totalPage!=0 
				}
			 });
		}		
	},

	onEndReachedSuccess(data, ajaxParams) {
		if (data.code == 0) {
			const oldList = this.state.list;
			const body = data.body || {};
			const arr = [...oldList, ...body.commentsArr];

			this.setState({ 
				list: arr,
				ajaxParams: {
					...ajaxParams, 
					showedAllpages: data.totalPage == ajaxParams.curPage,
					showNoResultTip: data.totalPage==0, 
					showListView: data.totalPage!=0 
				}
			 });
		}
	},

	onFeedback(data) {
		if (this.props.onFeedback) {
			this.props.onFeedback(data);
		}
	},

	onAgree(data, index) {
		if (data.isMyLike != '0') {
			return;
		}

		this.props.actions.addLike(data.commentId, (data) => {
			const list = [...this.state.list];
			const target = {...list[index]};

			target.isMyLike = "1";
			const voteNumber = Number(target.commentVoteNumber);
			target.commentVoteNumber = voteNumber + 1;
			list[index] = target;

			this.setState({ list });

		}, (data) => {
			ZnMessage.error("点赞失败");
		});
	},

	render() {
		const row = (rowData, sectionID, rowID) => {
			const _props = {	
				imageUrl: rowData.commentUserImg,
				userName: rowData.commentByName,
				content: rowData.commentContent,
				commentTime: Util.dateToStr(rowData.commentDate / 1000, "MM-dd hh:mm:ss"),
				agreementTimes: rowData.commentVoteNumber ? Number(rowData.commentVoteNumber) : 0,
				isLike: rowData.isMyLike,
				onFeedback: this.onFeedback.bind(this, rowData, Number(rowID)),
				onAgree: this.onAgree.bind(this, rowData, Number(rowID))
			};

			if (rowData.subCommArr) {
				const feedbacks = [];
				rowData.subCommArr.map(( comment, index ) => {
					feedbacks.push({ userName: comment.subcommentByName, content: comment.subcommentContent });
				});

				_props.feedbacks = feedbacks;
			}

			return <Comment {..._props}/>
		};

		const listProps = {
			row: row,
			list: this.state.list,
			url: URL.getComments,
			ajaxParams: {
				... this.state.ajaxParams,
                courseId: 'N060678',
                type: 0
			},
			onRefreshSuccess: this.onRefreshSuccess,
			onEndReachedSuccess: this.onEndReachedSuccess
		};

		return (
			<div>
				<ZnListView { ...listProps } />
			</div>
		);
	}
});

export default CommentList;