import React from 'react';
import createContainer from 'zn-container';

import * as actions from '../action';

import CommentInputer from '../component/CommentInputer';
import CommentList from '../component/CommentList';
import ZnMessage from 'zn-component/znMessage';

import "../style/commentContainer.scss";

const PropTypes = React.PropTypes;
const CommentContainer = React.createClass({
	_curComment: {},

	getDefaultProps() {
		return {
			courseId: ''
		}
	},

	getInitialState() {
		return {
			placeholder: '我来评一句'
		}
	},

	onFeedback(data) {
		if (!this._curComment || data.commentId != this._curComment.commentId) {
			this.setState({ placeholder: `回复: ${data.commentByName}` });
			this._curComment = data;
		} else {
			this.resetPlaceholder();
			this._curComment = {};
		}
	},

	onSubmitComment(content) {
		const data = { ...this._curComment, courseId: this.props.courseId, comment: content };
		this.props.actions.submitComment(data, (data) => {
			this.refs.commentList.loadComments();
			this.refs.commentList.loadHeadComments();

			if (this.props.updateCourseDetail) {
				this.props.updateCourseDetail();
			}

		}, error => {
			ZnMessage.error(error.message || '评论失败');
		});

		this.resetPlaceholder();
	},

	resetPlaceholder() {
		this.setState({ placeholder: '我来评一句' });
	},

	render() {
		return <div>
				<CommentList ref="commentList" {...this.props} onFeedback={this.onFeedback} courseId={this.props.courseId}/>
				<CommentInputer className="commenter-input" 
					placeholder={this.state.placeholder} 
					onSubmitComment={this.onSubmitComment}/>
			</div>
	}
});

CommentContainer.propTypes = {
	updateCourseDetail: PropTypes.func,
	courseId: PropTypes.string
}

export default createContainer("comment", actions, {}).bind(CommentContainer);