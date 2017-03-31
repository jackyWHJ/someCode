import React from 'react';
import classnames from 'classnames';
import defineProperty from 'babel-runtime/helpers/defineProperty';
import NukaCarousel from 'nuka-carousel';
import _ from 'lodash';

import "../style/index.scss";

const Decorators = [{
	component: React.createClass({
		render() {
			const count = this.props.slideCount;
			const sliders = [];
			for (let i = 0; i < count; i++) {
				const cls = classnames("zn-slide-item", {
					"zn-slide-active": this.props.currentSlide == i
				});

				sliders.push(<li className={cls} key={i}></li>);
			}

			return <ul className="zn-slide-box">
					{
						sliders
					}
				</ul>
		}
	}),

	// position: 'BottomRight'
}];

const ZnCarousel = React.createClass({
	mixins: [NukaCarousel.ControllerMixin],

	getInitialState() {
		return {
			currentIndex: 0,
			autoplay: this.props.autoplay
		}
	},

	getDefaultProps() {
		return {
			decorators: Decorators,
			dotsPosition: 'BottomRight',
			autoplay: true
		}
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.autoplay != this.props.autoplay) {
			this.setState({ autoplay: nextProps.autoplay });
		}
	},

	onChange(index) {
		const updater = { currentIndex: index };

		if (this.props.children.length < 2) {
			updater.autoplay = false;
		}

		this.setState( updater );
	},

	render() {
		if (this.props.dotsPosition) {
			this.props.decorators[0].position = this.props.dotsPosition
		}

		const { boxStyle, ..._props } = this.props;
		return (<div style={ boxStyle }>
				<NukaCarousel ref="znCarousel" 
					data={this.setCarouselData.bind(this, "znCarousel")}
					afterSlide={this.onChange} 
					slideIndex={this.state.currentIndex} 
					{..._props} 
					autoplay={this.state.autoplay}/>
			</div>)
	}
});

export default ZnCarousel;