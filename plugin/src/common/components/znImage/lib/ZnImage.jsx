import React from 'react';
import { findDOMNode } from 'react-dom';
import { register } from './lazyLoad';

import defImg from 'zn-image/defaultImg.png';

const ZnImage = React.createClass({
	_unRegister: null,

	getDefaultProps() {
		return {
			defSrc: defImg,
			src: "",
			inListView: true
		};
	},

	getInitialState() {
		return {
			src: this.props.defSrc
		}
	},

	componentDidMount() {
		if (this.props.inListView && this.context.registScrollEventListener) {
			const screen = window.innerHeight;
			const top = findDOMNode(this).offsetTop;

			if (top - screen < 20) {
				this.renderImage();
				return ;
			}

			const listener = this.context.registScrollEventListener((scrollTop, e) => {
				if (top - screen - scrollTop < 20) {
					this.renderImage();
					listener();
				}

			});

		} else {
			this._unRegister = register(this, () => {
				if (this.props.src) {
					// this.setState({ src: this.props.src });
					this.renderImage();
				}
			});
		}
	},

	renderImage() {
		const image = new Image();
		image.src = this.props.src;
		image.onload = () => {
			if (this.isMounted()) {
				this.setState({ src: this.props.src });
			}
		};
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.src != nextProps.src && this.props.src == this.state.src) {
			this.setState({ src: nextProps.src });
		}
	},

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.src != this.state.src ||
			nextProps.src != this.props.src ||
			nextProps.defSrc != this.props.defSrc;
	},

	componentWillUnmount() {
		if (this._unRegister) {
			this._unRegister();
		}
	},

	render() {
		const {src, defSrc, inListView, ..._props} = this.props;
		return <img src={this.state.src} {..._props} />
	}
});

ZnImage.propTypes = {
	defSrc: React.PropTypes.string,
	src: React.PropTypes.string,
	inListView: React.PropTypes.bool
};

ZnImage.contextTypes = {
	registScrollEventListener: React.PropTypes.func
};

export default ZnImage;