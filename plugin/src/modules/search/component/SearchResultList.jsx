import React, { PropTypes } from 'react';
import { Flex } from 'antd-mobile';

import ZnSimpleListView from 'zn-component/znSimpleListView';
import ZnNoResultTip from 'zn-component/znNoResultTip';
import ZnListItem from 'zn-component/znListItem';
import ZnImage from 'zn-component/znImage';

const FlexItem = Flex.Item;
class SearchResultList extends React.Component {
	static propTypes = {
		list: PropTypes.array,
		onSelect: PropTypes.func,
		showEmptyTip: PropTypes.bool,
		emptyText: PropTypes.string
	}

	static defaultProps = {
		list: [],
		showEmptyTip: false,
		emptyText: ''
	}

	constructor( props ) {
		super(props);

		this.state = {
			isLoading: false
		}
	}

	loadMore() {
		if (this.props.loadMore) {
			this.props.loadMore();
		}
	}

	onSelect(rowData, index) {
		if (this.props.onSelect) {
			this.props.onSelect(rowData, index);
		}
	}

	render() {
		let emptyTip = null;
		if (this.props.showEmptyTip && this.props.list.length > 0) {
			emptyTip = <ZnNoResultTip content={this.props.emptyText} />
		}

		const renderRow = (rowData, sectionID, rowID) => {
			const finished = rowData.isCompleted == "0" ? null : <div className="course-finished"></div>
			const image = <div>{ finished }<ZnImage src={rowData.courseImg} /></div>;
			const intro = <Flex>
							<FlexItem><span className="course-rate"></span>{ rowData.rating }</FlexItem>
							<FlexItem><span className="course-comments"></span>{ rowData.totalComments }</FlexItem>
						</Flex>;

			return <div onClick={this.onSelect.bind(this, rowData, Number(rowID))}>
					<ZnListItem leftContent={image} title={<div className="search-match" {...Util.strToReactDom(rowData.courseName)} />} intro={intro} introAlign="right"/>
				</div>
		}

		return <div>
				{ emptyTip }
				<ZnSimpleListView showListView={this.props.list.length > 0} 
					row={renderRow}
					list={this.props.list}
					onEndReached={this.loadMore.bind(this)}
					isLoading={this.props.loading}
					noRefresh={true}
					offsetTop={this.props.offsetTop}/>
			</div>
	}
};

export default SearchResultList;