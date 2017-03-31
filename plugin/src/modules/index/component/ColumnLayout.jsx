import React from 'react';
import { Flex } from 'antd-mobile';
import classnames from 'classnames';

const FlexItem = Flex.Item;
const ColumnLayout = function ColumnLayout( props ) {
	const { data, columns, ..._props } = props;
	const len = data.length;
	const colCounts = Math.ceil(len / columns);
	const rows = [];

	for (let i = 0; i < colCounts; i++) {
		const cols = [];

		let max = (i + 1) * columns;
		// max = max > len ? len : max;
		let k = i * columns;

		while(k < max) {
			if (k < len) {
				cols.push(<FlexItem key={`${i}-${k}`}>{data[k].content}</FlexItem>);
			} else if (props.justify != 'center') {
				cols.push(<FlexItem key={`${i}-${k}`}></FlexItem>);
			}

			k++;
		}

		rows.push(cols);
	}

	const cls = classnames('layout-row', props.rowClassName || "");

	return (
		<div className={ "columns-" + columns }>
			{ rows.map((row, index) => {
				return <Flex className={cls} justify={props.justify} key={index}>{ row }</Flex>
			}) }
		</div>
	);
}

export default ColumnLayout;