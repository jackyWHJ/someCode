import React, { PropTypes } from 'react';
import { Toast } from 'antd-mobile';

import ZnSimpleListView from 'zn-component/znSimpleListView';
import ZnMessage from 'zn-component/znMessage';

import Comment from './Comment';

import "../style/commentList.scss";

const NewCommentList = React.createClass({
	_headCommentRequest: null,
	_commentRequest: null,
	_pageCount: 0,

	getDefaultProps() {
		return {
			list: []
		}
	},

	getInitialState() {
		return {
			refreshing: false,
			isLoading: false,
			curPage: 1,
			numPerPage: 10,
			headList: [],
			newList: []
		}
	},

	componentDidMount() {
		this.loadHeadComments();
		this.loadComments();
	},

	componentWillUnmount(data = {}) {
		if (this._headCommentRequest && this._headCommentRequest.abort) {
			this._headCommentRequest.abort();
			this._headCommentRequest = null;
		}

		if (this._commentRequest && this._commentRequest.abort) {
			this._commentRequest.abort();
			this._commentRequest = null;
		}
	},

	onRefresh(event) {
		if (!this.state.refreshing) {
			this.setState({ refreshing: true });
			this.loadComments();
			this.loadHeadComments();
		}
	},

	onEndReached(event) {
		if (!this.state.isLoading && event) {
			const nextPage = this.state.curPage + 1;

			if (nextPage > this._pageCount) {
				return ;
			}

			this.loadComments(nextPage);
			this.setState({ curPage: nextPage, isLoading: true });
		}
	},

	loadHeadComments() {
		this._headCommentRequest = this.props.actions.getHeadComments(this.props.courseId, (data) => {
			const updater = { refreshing: false };
			if (data.body) {
				updater.headList = data.body.commentsArr || [];
			}
			this.setState( updater );
		}, error => {
			ZnMessage.error("加载头条评论失败");
			this.setState({ refreshing: false });
		});
	},

	loadComments(curPage = 1, numPerPage = 10) {
		this._commentRequest = this.props.actions.getComments(this.props.courseId, curPage, numPerPage, data => {
			const updater = { isLoading: false };
			if (data.body) {
				if (curPage == 1) {
					updater.newList = data.body.commentsArr;
					this._pageCount = Math.ceil(Number(data.body.totalComments) / 10);
				} else {
					// 新加载的评论添加到评论列表尾部
					updater.newList = [...this.state.newList, ...data.body.commentsArr];
				}
			}
			this.setState(updater);
		}, error => {
			ZnMessage.error('加载评论失败');
			this.setState({ isLoading: false });
		});
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
			const list = [...this.state.newList];
			const target = {...list[index]};

			target.isMyLike = "1";
			const voteNumber = Number(target.commentVoteNumber);
			target.commentVoteNumber = voteNumber + 1;
			list[index] = target;

			this.setState({ newList: list });

		}, (data) => {
			ZnMessage.error("点赞失败");
		});
	},

	render() {
		const renderComment = (rowData, rowID) => {
			const _props = {	
				imageUrl: rowData.commentUserImg,
				userName: rowData.commentByName,
				content: rowData.commentContent,
				commentTime: Util.dateToStr(rowData.commentDate / 1000, "MM-dd hh:mm:ss"),
				agreementTimes: rowData.commentVoteNumber ? Number(rowData.commentVoteNumber) : 0,
				isLike: rowData.isMyLike,
				onFeedback: this.onFeedback.bind(this, rowData, Number(rowID)),
				onAgree: this.onAgree.bind(this, rowData, Number(rowID)),
				key: rowID
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

		const renderRow = (rowData, sectionID, rowID) => {
			if (rowData.data.length > 0) {
				return <div>
						<div className="comment-section">{ rowData.sectionName }</div>
						{ 
							rowData.data.map((item, index) => {
								return renderComment(item, index);
							}) }
					</div>
			}
			return <div></div>;
		};

		const list = [{ sectionName: '头条评论', data: this.state.headList}, { sectionName: '最新评论', data: this.state.newList}];

		return (
			<ZnSimpleListView 
				row={renderRow}
				list={list}
				onRefresh={this.onRefresh}
				onEndReached={this.onEndReached}
				refreshing={this.state.refreshing}
				isLoading={this.state.isLoading}
				showListView={true}
				scrollTop={0}
				offsetTop={this.props.offsetTop} />
		);
	}
});

NewCommentList.propTypes = {
	list: PropTypes.array,
	loadData: PropTypes.func	
};

export default NewCommentList;