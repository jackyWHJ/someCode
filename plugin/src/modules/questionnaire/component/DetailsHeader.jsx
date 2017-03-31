import React from 'react';



const DetailsHeader = React.createClass({


	render() {

		return (
			<div className="questionnaire-details-header">
				<img src={this.props.data.imgUrl} />
			</div>
		)
	}
});

export default DetailsHeader;