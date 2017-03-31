import React, { PropTypes } from 'react';
import createContainer from 'zn-container';

import ZnSearchBar from '../component/ZnSearchBar';
import SearchResultList from '../component/SearchResultList';

import ZnListItem from 'zn-component/znListItem';
import ZnImage from 'zn-component/znImage';
import ZnMessage from 'zn-component/znMessage';

import { searchCourse } from '../action';

import "../style/search.scss";

class SearchCourseContainer extends React.Component {

	constructor( props ) {
		super(props);

		const fromState = props.location.state || {};

		this.state = {
			defaultValue: fromState.search || props.value
		};
		this._curSearchCourse = fromState.search || props.value;
		this._type = fromState.type;
	}

	componentWillMount() {
		this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
	}

	componentDidMount() {
		if (this.props.list.length == 0) {
			this.props.actions.searchCourse(this._curSearchCourse, 1, this.isShare());
		}
	}

	routerWillLeave(next) {
		if (next.pathname.indexOf('/courseDetail/') != -1)  {
			courseObserve.add('search.course', (dispatch, course) => {
				const list = this.props.list || [];

				for (let i = 0; i < list.length; i++) {
					if (course.courseId == list[i].courseId) {
						course[i] = {
							...course[i],
							isCompleted: course.isCompleted == "Y" ? "1" : "0",
							totalComments: course.totalComments,
							rating: course.rating
						}
					}
				}

				dispatch({ 
					type: "search.course", 
					list
				});

			});
		} else {
			courseObserve.remove('search.main');
		}
	}

	isShare() {
		return this._type == 'shareCourse';
	}

	onSearch() {
		if (!this._curSearchCourse) {
			ZnMessage.info('请输入关键字', 3);
			return ;
		}

		this.props.actions.searchCourse(this._curSearchCourse, 1, this.isShare());
	}

	onChange(content) {
		this._curSearchCourse = content;
	}

	onSelect(item, index) {
		this.context.router.push({ pathname: `classify/courseDetail/${item.courseId}`});
	}

	loadMore() {
		if (this.props.loading) {
			return;
		}

		const nextPage = this.props.curPage + 1;
		if(nextPage > this.props.totalPage) {
			return ;
		}

		this.props.actions.searchCourse(this._curSearchCourse, nextPage, this.isShare(), this.props.list, true);
	}

	render() {

		return <div>
				<ZnSearchBar onSearch={this.onSearch.bind(this)} onChange={this.onChange.bind(this)} defaultValue={this.state.defaultValue}/>
				<SearchResultList 
					list={this.props.list} 
					onSelect={this.onSelect.bind(this)}
					loadMore={this.loadMore.bind(this)}
					loading={this.props.loading}
					offsetTop={45}
					showEmptyTip={this._curSearchCourse == ''}
				/>
			</div>
	}
};

export default createContainer("search.course", { searchCourse }, {
	value: '',
	list: [],
	curPage: 1,
	totalPage: 0,
	loading: false
}).inject(["search.main"], function(state) {
	const defaultValue = state["search.main"] ? state["search.main"].value : "";
	return { defaultValue };
}).bind(SearchCourseContainer);