import { URL } from '../dataConfig';

export const getComments = (courseId, curPage, numPerPage, success, fail) => {
	return dispatch => {
		Ajax({
			url: URL.getComments,
			data: {
				courseId,
				curPage,
				numPerPage,
				nonGzip: 1,
				sid: Util.storage.getSid(),
				type: 0
			},
			success(data) {
				if (data.code == 0) {
					success(data);
				} else {
					fail(data);
				}
			},
			error(error) {
				fail(error);
			}
		})
	}
};

export const getHeadComments = (courseId, success, fail) => {
	return dispatch => {
		Ajax({
			url: URL.getHeadComments,
			data: {
				courseId,
				nonGzip: 1,
				sid: Util.storage.getSid(),
				type: 0
			},
			success(data) {
				if (data.code == 0) {
					success(data);
				} else {
					fail(data);
				}
			},
			error(error) {
				fail(error);
			}
		})
	}
};

export const addLike = (commentId, success, fail) => {
	return dispatch => {
		Ajax({
			url: URL.addLike,
			data: {
				likeType: 1,
				id: commentId,
				sid: Util.storage.getSid(),
				nonGzip: 1
			},
			success(data) {
				if (data.code == 0) {
					success(data);
				} else {
					fail(data);
				}
			},
			error(error) {
				fail(error);
			}
		})
	}
};

export const submitComment = (data, success, fail) => {
	const params = {
		type: data.commentId ? 1 : 0, 	// 0: 课程评论; 1: 评论
		sid: Util.storage.getSid(),
		nonGzip: 1,
		comment: data.comment,
		courseId: data.courseId
	};

	if (data.commentId) {
		params.criticsBy = data.commentBy;
		params.parentCommentId = data.commentId;
	}

	return dispatch => {
		Ajax({
			url: URL.submitComment,
			data: params,
			success(data) {
				if (data.code == 0) {
					success(data);
				} else {
					fail(data);
				}
			},
			error(error) {
				fail(error);
			}
		})
	}
};