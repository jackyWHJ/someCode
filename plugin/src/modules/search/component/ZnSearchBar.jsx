import React from 'react';
import ZnNavBar from 'zn-component/znNavBar';
import { InputItem, Icon } from 'antd-mobile';

import "../style/znSearchBar.scss";

const ZnSearchBar = function ZnSearchBar( props ) {
	const { onSearch, onChange, defaultValue, ..._props } = props
	const searchBtn = <span onClick={onSearch}>搜索</span>;

	return <ZnNavBar rightContent={ searchBtn } className="zn-search-bar">
			<Icon className="zn-search-icon" type="search" size="md"/>
			<InputItem className="zn-search-input" clear 
				placeholder="请输入关键字" defaultValue={defaultValue}
				onChange={onChange}/>
		</ZnNavBar>
};

export default ZnSearchBar;