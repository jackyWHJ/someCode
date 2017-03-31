import React from 'react';
import { Flex } from 'antd-mobile';
import _ from 'lodash';

const FlexItem = Flex.Item;
const NewColumnCard = function( props = { layout: "vertical", contents: [] } ) {
	const { layout, contents, ..._props } = props;
	let elements = [];

	if (layout == 'horizontal') {
		elements.push(<Flex>
				{ contents.map((item, index) => {
					return <FlexItem key={`horizontal-${index + 1}`}>{ item }</FlexItem>
				}) }
			</Flex>);

	} else {
		elements = contents.map((item, index) => {
			// if ()
			return <Flex key={`vertical-${index + 1}`}>
					<FlexItem>{ item }</FlexItem>
				</Flex>
		});

	}

	return <div { ..._props } >
			{ elements }
		</div>;
};

NewColumnCard.propTypes = {
	layout: React.PropTypes.oneOf(["horizontal", "vertical"]),
	contents: React.PropTypes.array
};

export default NewColumnCard;