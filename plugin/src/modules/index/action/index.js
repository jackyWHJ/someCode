// import axios from 'zn-common/utils/axios';
import { Toast } from 'antd-mobile';

import { API } from '../dataConfig';
import {storageKeys} from 'zn-common/constants';

export const loadIndexData = (extraParams = {}, refreshing = false) => {
	return dispatch => {
		if (refreshing) {
			dispatch({ isRefreshing: refreshing });
		} else {
			Toast.loading('加载中...', 0);
		}

		Ajax({ 
			url: API.indexDataAPI, 
			data: {
				nonGzip: 1,
				pageType: "plugin",
			 	umId: '',
			 	ver: Util.getVersion(),
			 	sid: Util.storage.getSid(),
			 	...extraParams
			},
			success(data) {
				let updater = {};
				if (refreshing) {
					updater.isRefreshing = false;
				} else {
					Toast.hide();
				}

				if (data.code == 0) {
					updater = {...updater, ...dataAdapter(data)};
				} else {
					Toast.info(data.message, 3);
				}

				dispatch(updater);
			},
			error(xhr, type) {
				if (refreshing) {
					dispatch({ isRefreshing: false });
				} else {
					Toast.hide();
				}
			}
		});
	}
};

const dataAdapter = function dataAdapter( data ) {
	if (data && data.body) {
		const home = data.body.home;

		if (home) {
			const data = {};

			data.navBar = {
				color: home.headBorderColor,
				logo: home.logo,
				title: home.title,
			};
			data.banner = home.bannerList;
			data.choice = home.choiceList;
			data.columns = home.columnList;
			data.links = home.homeLinkList;

			data.extra = {
				homeId: home.homeId,
				updateDate: home.updatedDate
			};

			Util.storage.push(storageKeys.HOMEINFO, {
				homeId: home.homeId,
				navBarColor: home.headBorderColor,
				title: home.title,
				logo: home.logo
			});

			return data;
		}
	}

	return {};
};