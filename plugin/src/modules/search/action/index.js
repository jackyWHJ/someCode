import { URL } from '../dataConfig';
import { Toast } from 'antd-mobile';

export const search = (content) => {
	return dispatch => {
		Toast.loading("正在搜索相关课程", 0);

		Ajax({
			url: URL.search,
			data: {
				sid: Util.storage.getSid(),
				ver: Util.getVersion(),
				nonGzip: 1,
				searchWord: content
			},
			success(data) {
				Toast.hide();

				if (data.code == 0 && data.body) {
					dispatch({
						myCourses: data.body.comCourse || [],
						shareCourses: data.body.otherCourse || [],
						value: content
					});
				}
			},
			error(error) {
				Toast.hide();
			}
		});
	}
};

export const searchCourse = (searchWord, curPage, isShare, oldList = [], loading = false) => {
	const url = isShare ? URL.searchShareCourse : URL.searchMyCourse ;

	return dispatch => {
		if (loading) {
			dispatch({ loading: true });
		} else {
			Toast.loading("正在搜索相关课程", 0);
		}

		Ajax({
			url,
			data: {
				searchWord,
				curPage,
				numPerPage: 15,
				sid: Util.storage.getSid(),
				ver: Util.getVersion(),
				nonGzip: 1
			},
			success(data) {
				let updater = {};
				if (loading) {
					updater.loading = false;
				} else {
					Toast.hide();	
				}

				if (data.code == 0 && data.body) {
					updater = {
						list: data.body.courseArr || [],
						value: searchWord,
						totalPage: Number(data.body.totalPage),
						curPage,
						...updater
					};
				}

				updater.list = [...oldList, ...updater.list];
				dispatch(updater);
			},
			error(error) {
				if (loading) {
					dispatch({ loading: false });
				} else {
					Toast.hide();
				}
			}
		});
	}
};