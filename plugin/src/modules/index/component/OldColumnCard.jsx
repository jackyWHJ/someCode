import React from 'react';
import { Flex } from 'antd-mobile';

const FlexItem = Flex.Item;
const ColumnCard = function( props ) {
	const { type, ..._props } = props;
	let content = null;

	if (type == 'horizontal') {
		content = <div>
					<Flex>
						{ _props.left ? <FlexItem>{ _props.left }</FlexItem> : null }
						{ _props.center ? <FlexItem>{ _props.center }</FlexItem> : null }
						{ _props.right ? <FlexItem>{ _props.right }</FlexItem> : null }
					</Flex>
				</div>;
	} else {
		content = <div>
					<Flex>
						<FlexItem>{ _props.top }</FlexItem>
					</Flex>
					<Flex>
						<FlexItem>{ _props.middle }</FlexItem>
					</Flex>
					<Flex>
						<FlexItem>{ _props.bottom }</FlexItem>
					</Flex>
				</div>;
	}

	return content;
};

export default ColumnCard;