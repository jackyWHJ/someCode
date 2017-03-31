export default{
    name: 'examMain',
    breadcrumbName: '考试',
    path: 'examMain',
    getIndexRoute(location, cb) {
        require.ensure([], (require) => {
            cb(null, {
                component: require('./container/examMain')
            })
        }, './container/examMain');
    },
    childRoutes: [
        {
            name: 'examIntroduction',
            breadcrumbName: '考试介绍',
            path: 'examIntroduction(/:examId)',
            getComponents(location, cb) {
            require.ensure([], (require) => {
                cb(null, require('./container/examIntroduction'))
                }, './container/examIntroduction')
            }
        },
        {
            name: 'examDetails',
            breadcrumbName: '考试试题',
            path: 'examDetails/:examId/:examType(/:errorType/:paperNo(/:attemptId)(/:previous))',
            getComponents(location, cb) {
            require.ensure([], (require) => {
                    cb(null, require('./container/examDetails'))
                }, './container/examDetails')
            }
        },
        {
            name: 'examResult',
            breadcrumbName: '考试结果',
            path: 'examResult(/:paperNo/:attemptId)',
            getComponents(location, cb) {
            require.ensure([], (require) => {
                    cb(null, require('./container/examResult'))
                }, './container/examResult')
            }
        },
        {
            name: 'examHistory',
                breadcrumbName: '历史成绩',
            path: 'examHistory/:id',
            getComponents(location, cb) {
            require.ensure([], (require) => {
                cb(null, require('./container/ExamHistory'))
                }, './container/ExamHistory')
            }
        },
    ]

};