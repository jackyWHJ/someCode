

export default {
    name: 'questionnaire',
    breadcrumbName: '问卷',
    path: 'questionnaire',
    getIndexRoute(location, cb) {
        require.ensure([], (require) => {
            cb(null, {
                component: require('./container/Questionnaire')
            })
        }, './container/Questionnaire');
    },
    childRoutes: [
        {
            name: 'questionnaireDetails',
            breadcrumbName: '问卷详情',
            path: 'questionnaireDetails/:intgId',//intgId:问卷id
            getComponents(location, cb) {
            require.ensure([], (require) => {
                cb(null, require('./container/QuestionnaireDetails'))
                }, './container/QuestionnaireDetails')
            }
        }
    ]

};