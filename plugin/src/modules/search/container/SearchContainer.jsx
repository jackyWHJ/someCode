import React from 'react';
import { Link } from 'react-router';
import { Icon, Flex } from 'antd-mobile';
import createContainer from 'zn-container';

import { search } from '../action';

import ZnSearchBar from '../component/ZnSearchBar';
// import SearchResultList from '../component/SearchResultList';
import ZnListItem from 'zn-component/znListItem';
import ZnImage from 'zn-component/znImage';
import ZnNoResultTip from 'zn-component/znNoResultTip';
import ZnMessage from 'zn-component/znMessage';
import courseObserve from 'zn-common/utils/courseObserve';

import "../style/search.scss";

const FlexItem = Flex.Item;
class SearchContainer extends React.Component {

	constructor( props ) {
		super(props);

		this.state = {
			defaultValue: props.value
		};
		this._curSearchContent = props.value;
	}

	componentWillMount() {
		this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
	}

	routerWillLeave(next) {
		if (next.pathname.indexOf('/courseDetail/') != -1)  {
			courseObserve.add('search.main', (dispatch, course) => {
				const my = this.props.myCourses ? (this.props.myCourses.arr || []) : [];
				const share = this.props.shareCourses ? (this.props.shareCourses.arr || []) : [];
				const objArr = [my, share];
				let found = false;

				for (let i = 0; i < objArr.length; i++) {
					const curObj = objArr[i];

					for (let k = 0; k < curObj.length; k++) {
						if (course.courseId == curObj[k].courseId) {
							found = true;
							curObj[k] = {
								...curObj[k],
								isCompleted: course.isCompleted == "Y" ? "1" : "0",
								totalComments: course.totalComments,
								rating: course.rating
							};

							break;
						}
					}

					if (found) {
						break;
					}
				}

				if (found) {
					dispatch({ 
						type: "search.main", 
						myCourses: {...this.props.myCourses, arr:my }, 
						shareCourses: {...this.props.shareCourses, arr: share}
					});
				}

			});
		} else {
			courseObserve.remove('search.main');
		}
	}

	onSearch() {
		if (!this._curSearchContent) {
			ZnMessage.info("请输入关键字", 3);
			return ;
		}

		this.props.actions.search(this._curSearchContent);
	}

	onChange(content) {
		this._curSearchContent = content;
	}

	clickOnCourse(data) {
		this.context.router.push({ pathname: `classify/courseDetail/${data.courseId}`});
	}

	render() {
		const renderCourse = (dataObj = {}, title, type) => {
			if (dataObj.arr && dataObj.arr.length > 0) {
				return <div className="search-result-box">
						<div className="search-result-category">{ title }</div>
						{
							dataObj.arr.map((item, index) => {
								const finished = item.isCompleted == "0" ? null : <div className="course-finished" />;
								const leftContent = <div>
										{finished}
										<ZnImage src={item.courseImg} />
									</div>;
								const intro = <Flex>
											<FlexItem><span className="course-rate"></span>{ item.rating }</FlexItem>
											<FlexItem><span className="course-comments"></span>{ item.totalComments }</FlexItem>
										</Flex>;

								return <div onClick={this.clickOnCourse.bind(this, item)} key={index}>
										<ZnListItem key={index} leftContent={leftContent} 
											title={<div className="search-match" {...Util.strToReactDom(item.courseName)} />} 
											intro={intro} introAlign="right"/>
									</div>
							})
						}
						{
							dataObj.ismore == "0" ? null : <div className="search-result-category-footer">
									<Icon type="search" size="md"/>
									<Link to={{ pathname: `/search/course`, state: { type, search: this._curSearchContent } }}>查看更多</Link>
								</div>
						}
					</div>
			}

			return null;
		};

		let result = null;
		const myCourses = this.props.myCourses;
		const shareCourses = this.props.shareCourses;
		if (myCourses.arr && myCourses.arr.length == 0 && shareCourses.arr && shareCourses.arr.length == 0) {
			result = <ZnNoResultTip />
		}  else {
			result = <div>
				{ renderCourse(myCourses, "我的私密课", "myCourse") }
				{ renderCourse(shareCourses, "企业共享课", "shareCourse") }
			</div>
		}

		return <div>
			<ZnSearchBar onSearch={this.onSearch.bind(this)} onChange={this.onChange.bind(this)} defaultValue={this.state.defaultValue}/>
			{ result }
		</div>
	}
};

export default createContainer("search.main", { search }, {
	value: '',
	myCourses: {},
	shareCourses: {}
}).bind(SearchContainer);