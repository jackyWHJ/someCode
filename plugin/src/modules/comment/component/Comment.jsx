import React from 'react';
import { Flex } from 'antd-mobile';

import ZnImage from 'zn-component/znImage';
import { getEmoji } from '../emojis';

import "../style/comment.scss";

const renderContent = (content) => {
	const result = [];

	if (content) {
		let emojiArr = content.match(/\[[^\[\]]*?]/ig) || [];
		const len = emojiArr.length;

		if (len == 0) {
			return <span>{ content }</span>;
		}

		for (let i = 0; i < len; i++) {
			const index = content.indexOf(emojiArr[i]);
			const start = content.substring(0, index);
			if (start) {
				result.push(start);	
			}
			
			result.push(<img key={i} src={getEmoji(emojiArr[i])} />);

			content = content.substring(index + emojiArr[i].length);
		}

		result.push(content);
	}

	return <span>
			{ result }
		</span>

};

const FlexItem = Flex.Item;
const Comment = React.createClass({
	getDefaultProps() {
		return {
			imageUrl: '',
			userName: '',
			content: '',
			commentTime: '',
			agreementTimes: 0,
			footer: null,
			feedbacks: []
		}
	},

	render() {

		return <Flex className="comment-box">
				<FlexItem className="comment-image-box">
					<ZnImage className="comment-user-image" src={this.props.imageUrl}/>
				</FlexItem>
				<FlexItem className="comment-body">
					<div>
						<div onClick={this.props.onFeedback}>
							<div className="comment-name comment-host-name">{ this.props.userName }</div>
							<div className="comment-content">
								{ renderContent(this.props.content) }
							</div>
						</div>
						<div className="comment-footer">
							{ this.props.footer || <div className="comment-default-footer">
													<span>{ this.props.commentTime }</span>
													<span className={`comment-agreement ${this.props.isLike != '0' ? 'like': ''}`} onClick={this.props.onAgree}>
														{ this.props.agreementTimes }
													</span>
												</div> }
						</div>
					</div>
					{ this.props.feedbacks.length > 0 ? <div className="comment-feedback">
							{ 
								this.props.feedbacks.map((feedback, index) => {
									return <div className="comment-feedback-item" key={index}>
											<span className="comment-name">{ feedback.userName }:</span> { renderContent(feedback.content) }
										</div>
								}) 
							}
						</div> : null }
				</FlexItem>
			</Flex>
	}
});

const PropTypes = React.PropTypes;
Comment.propTypes = {
	imageUrl: PropTypes.string,
	userName: PropTypes.string,
	content: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.element
		]),
	commentTime: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
	agreementTimes: PropTypes.number,
	footer: PropTypes.element,
	feedbacks: PropTypes.array
};

export default Comment;