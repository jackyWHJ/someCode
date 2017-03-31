import React from 'react';
import { Flex } from 'antd-mobile';

import ZnCarousel from 'zn-component/znCarousel';

import "../style/emoji.scss";
import { emojis } from "../emojis";

const FlexItem = Flex.Item;
const perPage = 21;
// const ctx = require.context("../../../img/emoji", false, /\.png$/);
// const emojis = ctx.keys();
const count = emojis.length;
const pages = Math.ceil(count / perPage);

const Emoji = React.createClass({
	getDefaultProps() {
		return {
			visible: false
		}
	},

	getInitialState() {
		return {
			rendered: 0
		}
	},

	shouldComponentUpdate(nextProps, nextState) {
		return this.state.rendered != nextState.rendered || this.props.visible != nextProps.visible;
	},

	beforeSlide(curIndex, index) {
		if (index > this.state.rendered) {
			this.setState({ rendered: index });
		}
	},

	onSelect(item) {
		if (this.props.onSelectEmoji) {
			this.props.onSelectEmoji(item);
		}
	},

	render() {
		const panelList = [];
		const renderPanel = (page) => {
			const startIndex = page * perPage;
			const panel = [];

			for (let i = 0; i < 3; i++) {
				// 每个面板显示3行表情
				const elements = [];
				const index = i * 7; 
				const tar = index + 7;

				for (let k = index; k < tar; k++) {
					const emojiIndex = startIndex + k;

					if (emojiIndex < count) {
						const src = emojis[startIndex + k].url;
						elements.push(<FlexItem key={k} className="emoji-item"><img src={src} onClick={this.onSelect.bind(this, emojis[startIndex + k].str)}/></FlexItem>);
					} else {
						elements.push(<FlexItem key={k} className="emoji-item"></FlexItem>);
					}
				}

				panel.push(<Flex key={i} className="emoji-line">{ elements }</Flex>);
			}

			return panel;
		};

		for (let i = 0; i < pages; i++) {
			let panel = null;

			if (i <= this.state.rendered) {
				panel = renderPanel(i);
			}

			panelList.push(<div key={i}>{ panel }</div>);
		}

		const carouselVisible = this.props.visible ? '' : 'emoji-hidden';
		return <div className={`emoji-panel ${carouselVisible}`}>
			<ZnCarousel swiping dragging 
				autoplay={false}
				dotsPosition="BottomCenter"
				beforeSlide={this.beforeSlide}
				style={{ height: '2.8rem', backgroundColor: '#fff' }}>
				{ panelList }
			</ZnCarousel>
		</div>
	}
});

Emoji.propTypes = {
	visible: React.PropTypes.bool,
	onSelectEmoji: React.PropTypes.func
};

export default Emoji;