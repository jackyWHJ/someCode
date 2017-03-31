import React from 'react';
import { Flex } from 'antd-mobile';
import _ from 'lodash';

const FlexItem = Flex.Item;
const ColumnCard = function( props = { layout: "vertical", contents: [] } ) {
	const { layout, contents, ..._props } = props;
	let elements = [];

	if (layout == 'horizontal') {
		elements.push(<Flex key={1}>
				{ contents.map((item, index) => {
					return <FlexItem key={index}>{ item }</FlexItem>
				}) }
			</Flex>);

	} else {
		elements = contents.map((item, index) => {
			// if ()
			return <Flex key={index}>
					<FlexItem>{ item }</FlexItem>
				</Flex>
		});

	}

	return <div { ..._props } >
			{ elements }
		</div>;
};

ColumnCard.propTypes = {
	layout: React.PropTypes.oneOf(["horizontal", "vertical"]),
	contents: React.PropTypes.array
};

export default ColumnCard;