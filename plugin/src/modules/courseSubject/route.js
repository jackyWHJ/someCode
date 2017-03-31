module.exports = {
	//name:"courseSubject",
	path: 'courseSubject',

	getIndexRoute(location, cb) {
		require.ensure([], (require) => {
			cb(null, {component: require('./container/CourseSubjectContainer')	})
		}, 'CourseSubjectContainer');
	},

	childRoutes:[
		{
			//name:"subjectDetail",
			path: 'subjectDetail/:id',
			getIndexRoute(location, cb) {
			require.ensure([], (require) => {
				cb(null, {
					component: require('./container/CourseSubjectDetail')
				})
				}, 'CourseSubjectDetail');
			}

		}
	]
}