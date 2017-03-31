import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import { NavBar, WhiteSpace, List, Icon } from 'antd-mobile';

import ColumnLayout from './ColumnLayout';
import ColumnCard from './ColumnCard';
import getLayoutByType from '../layouts';

import ZnImage from 'zn-component/znImage';
import Carousel from 'zn-component/znCarousel';
import ZnNavBar from 'zn-component/znNavBar';
import ZnMessage from 'zn-component/znMessage';
import ZnSimpleListView from 'zn-component/znSimpleListView';

import { getRouterUrl } from '../dataConfig';
import "../style/IndexApp.scss";

import defaultImg from "../../../img/defaultImg.png";

const HOME_KEY = "homeList";
Util.storage.push(HOME_KEY, []);

const ListItem = List.Item;
const IndexApp = React.createClass({

	// 返回，若首页没有历史记录，则返回到app，否则，返回到前一个首页
	goBack() {
		const homeList = Util.storage.get(HOME_KEY) || [];
		if ( !homeList || homeList.length == 0 ) {
			Util.backToNative();
		} else {
			const prevHome = homeList.pop();
			this.loadHomeData(prevHome);
			Util.storage.push(HOME_KEY, homeList);
		}
	},

	functionInvalid() {
		ZnMessage.info("当前插件不支持该功能");
	},

	goToFunction(item) {
		const page = getRouterUrl(item);
		if (page) {
			this.context.router.push({ pathname: page, state: item });
		} else {
			this.functionInvalid();
		}
	},

	// 下拉刷新时触发
	onRefresh() {
		this.loadHomeData({}, true);
	},

	// 获取首页数据， refreshing: 是否使用下拉刷新
	loadHomeData(extraParams = {}, refreshing = false) {
		if (this.props.reload) {
			this.props.reload(extraParams, refreshing);
		}
	},

	// 切换首页
	switchHome(link = {}) {
		// 获取首页数据
		this.loadHomeData({
			homeId: link.linkHomeId,	// 首页id
			verifyAuthority: 0			// =0， 不需要重新授权
		});

		// 保存当前首页的id
		const list = Util.storage.get(HOME_KEY) || [];
		list.push(Util.storage.getHomeId());
		Util.storage.push(HOME_KEY, list);

		// 回滚到页面顶部
		this.refs.listView.goScrollTop();
	},

	render() {
		const { navBar, banners, choices, columns, links, ..._props } = this.props;
		const navBarLogo = navBar.logo ? <img src={navBar.logo} style={{ height: '.5rem' }}/> : null;

		// 渲染 banner
		const renderBanner = (banners) => {
			return <Carousel className="zn-index-carousel content-panel" swiping dragging autoplay
				wrapAround
				cellAlign="right"
				autoplayInterval={2000}
				style={{ height: '3.6rem', position: 'absolute' }}
				boxStyle={{ width: '100%', position: 'relative', height: '3.6rem'}}
				>
				{
					banners.map(banner => {
						//获取相应类型的路由
						const page = getRouterUrl(banner);
						const _props = {};

						if (page) {
							_props.to = page;
							_props.state = banner;
						} else {
							_props.onClick = this.functionInvalid;
						}

						return <Link key={ banner.id } style={{ position: 'relative', display: 'block' }} {..._props}>
								<div style={{ position: 'relative' }}>
									<img className="banner-img" src={ banner.imgUrl ? banner.imgUrl : defaultImg }/>
									<div className="banner-label zn-font-md"><span>{ banner.title }</span></div>
								</div>
							</Link>
					})
				}
			</Carousel>
		}

		// 渲染频道
		const renderChoice = (choices) => {
			const choiceArr = choices.map( choice => {
					return { content: 
							<div key={choice.id} style={{ textAlign: 'center' }} onClick={this.goToFunction.bind(this, choice)}>
								<img className="choice-img" src={choice.imgUrl}/>
								<div className="word-overflow zn-font-md">{choice.title}</div>
							</div> };
				});

			return <div>
					<div className="content-panel" style={{ paddingTop: '.2rem' }}>
						<ColumnLayout columns={4} justify="center" data={choiceArr} rowClassName="choice-row"/>
					</div>
					<WhiteSpace size="sm" />
				</div>;
		}

		// 渲染栏目
		const renderColumns = (columns) => {
			return <div> 
				{
					columns.map( (column, index) => {
						// 根据栏目布局类型，获取相应的布局组件
						const Component = getLayoutByType(column.styleType, column.lineQuantity);
						if (Component) {

							const content = <div key={column.id} className="content-panel">
								<div className="content-panel-title column-panel-title">{column.title}</div>
								<Component key={index} data={ column } clickOnColumn={this.goToFunction}/>
							</div>;
							return [content, <WhiteSpace size="sm" />]
						} else {
							return [];
						}
					})
				}
			</div>
		}

		// 渲染集团链接 -- 切换首页
		const renderLinks = (links) => {
			if (links.length == 0) {
				return null;
			}

			return <div>
					<div className="content-panel">
						<div className="content-panel-title" style={{ marginLeft: '-.2rem' }}>首页链接</div>
						<List className="index-list">
							{
								links.map(link => {
									return <div key={link.id} onClick={this.switchHome.bind(this, link)}>
											<ListItem arrow="horizontal" className="index-list-item">
												<ZnImage className="index-list-img" src={link.imgUrl}/>
												<span className="zn-font-md">{link.name}</span>
											</ListItem>
										</div>
								})
							}
						</List>
					</div>
				</div>
		}

		const list = [[...banners], [...choices], [...columns], [...links]];
		const renderMapper = [renderBanner, renderChoice, renderColumns, renderLinks];

		const renderRow = (rowData, sectionID, rowID) => {
			const renderMethod = renderMapper[Number(rowID)];
			return renderMethod(rowData);
		}

		const rightContent = <Link to={{ pathname: '/search' }} style={{ color: '#fff' }}><Icon type="search" size="md" /></Link>;

		return <div className="has-bar index-body">
				<ZnNavBar className="app-bar" onLeftClick={this.goBack} rightContent={rightContent}>{ navBarLogo } { navBar.title }</ZnNavBar>
				<ZnSimpleListView ref="listView"
					showListView={true}
					row={renderRow}
					list={list}
					onRefresh={this.onRefresh}
					refreshing={this.props.isRefreshing}
					renderFooter={() => { return null; }}
					offsetTop={45}
				/>
			</div>
	}
});

IndexApp.contextTypes = {
	router: React.PropTypes.object,
	store: React.PropTypes.object
};

export default IndexApp;