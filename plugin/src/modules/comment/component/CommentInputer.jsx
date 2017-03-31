import React from 'react';
import { InputItem, Flex, Button } from 'antd-mobile';
import addEventListener from 'add-dom-event-listener';
import autosize from 'autosize';

import Emoji from './Emoji';

import "../style/commentInputer.scss";

const FlexItem = Flex.Item;
const CommentInputer = React.createClass({
	// 标记输入框的高度
	_textAreaInitHeight: 0,

	// 存储全局click事件，在组件unmount时移除
	_clickEvent: null,

	// 标记事件是否为冒泡，提供给表情框隐藏使用
	_isPropagation: false,

	getDefaultProps() {
		return {
			placeholder: '我来评一句'
		}
	},

	getInitialState() {
		return {
			visible: false,
			isEmoji: false
		}
	},

	componentDidMount() {
		const commenter =this.getTextArea();
		this._textAreaInitHeight = commenter.clientHeight;
		autosize(commenter);

		//全局点击事件
		this._clickEvent = addEventListener(document, "click", (e) => {
			if (!this._isPropagation && this.state.visible) {
				// 非由输入框冒泡上来的，隐藏表情框，输入框回复原始状态
				this.setState({ visible: false, isEmoji: false });
			} else {
				this._isPropagation = false;
			}
		});
	},

	componentWillUnmount() {
		// 移除全局点击事件
		if (this._clickEvent) {
			this._clickEvent.remove();
			this._clickEvent = null;
		}
	},

	getTextArea() {
		return document.querySelector('#commenter');
	},

	changeInputType() {
		// isEmoji为true时，即却换为键盘输入
		const isEmoji = this.state.isEmoji;
		this.setState({ isEmoji: !this.state.isEmoji });

		if (isEmoji) { 
			this.setState({ visible: false });
		} else {
			this.setState({ visible: true });
		}
	},

	submitComment(e) {
		if (this.props.onSubmitComment) {
			const textarea = this.getTextArea();
			this.props.onSubmitComment(textarea.value);
			textarea.value = "";
		}

		this._isPropagation = false;
	},

	clickOnCommentBox(e) {
		// 捕获事件阶段
		this._isPropagation = true;

		// if (this._isPropagation) {
			// 由点评按钮冒泡上来的，因此把输入框全部重置
			// this._isPropagation = false;
		// } else {
			// 点击输入框区域，不需要重置
			// this._isPropagation = true;

			// 点击输入宽，表情，均设置输入框为焦点
			// const commenter = this.getTextArea();
			// commenter.focus();
		// }
	},

	onSelectEmoji(str) {
		const commenter = this.getTextArea();
		const start = commenter.selectionStart;
		const end = commenter.selectionEnd;

		const oldValue = commenter.value;
		let newValue = `${oldValue.substring(0, start)}${str}${oldValue.substring(end)}`;

		commenter.value = newValue;
		const index = start + str.length;

		commenter.selectionStart = index;
		commenter.selectionEnd = index;
	},

	render() {
		const emoji = this.state.isEmoji ? 'img-keyboard' : 'img-smeil'

		return <div className={`comment-inputer-box ${this.props.className}`} onClickCapture={this.clickOnCommentBox}>
				<Flex className="comment-inputer">
					<FlexItem className="comment-switcher"><div className={emoji} onClick={this.changeInputType}></div></FlexItem>
					<FlexItem className="comment-input">
						<textarea id="commenter" rows="1" className={`comment-content-inputer`} 
							placeholder={this.props.placeholder} spellCheck={false}
							maxLength={200}></textarea>
					</FlexItem>
					<FlexItem className="comment-submit" onClick={this.submitComment}>
						<Button style={{ backgroundColor: Util.storage.getNavBarColor() }}>评论</Button>
					</FlexItem>
				</Flex>
				<Emoji visible={this.state.visible} onSelectEmoji={this.onSelectEmoji}></Emoji>
			</div>
	}
});

export default CommentInputer;