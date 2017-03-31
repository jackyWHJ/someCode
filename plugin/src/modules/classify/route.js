

module.exports = {
  name: 'classify',
  path: 'classify',

  childRoutes: [
    {
      name: 'courseDetail',
      path: 'courseDetail/:courseId',

      getIndexRoute(location, cb) {
        require.ensure([], (require) => {
          cb(null, {
            component: require('./container/CourseDetailContainer')
          })
        }, 'classify/CourseDetailContainer');
      }
    },
    {
      name: 'mainface',
      path: 'mainface(/:type)',

      getIndexRoute(location, cb) {
        require.ensure([], (require) => {
          cb(null, {
            component: require('./container/ClassifyContainer')
          })
        }, 'classify/ClassifyContainer');
      }
    },
    {
      name: 'courselist',
      path: 'courselist/:moduleTagId/:moduleId(/:type)',

      getIndexRoute(location, cb) {
        require.ensure([], (require) => {
          cb(null, {
            component: require('./container/ClassifyListContainer')
          })
        }, 'classify/ClassifyListContainer');
      }
    },
    {
      name: 'courseall',
      path: 'courseall',

      getIndexRoute(location, cb) {
        require.ensure([], (require) => {
          cb(null, {
            component: require('./container/CourseAllContainer')
          })
        }, 'classify/CourseAllContainer');
      }
    }
  ]
};
