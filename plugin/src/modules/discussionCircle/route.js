export default{
    name: 'discussionCircleMain',
    breadcrumbName: '����',
    path: 'discussionCircleMain',
    getIndexRoute(location, cb) {
        require.ensure([], (require) => {
            cb(null, {
                component: require('./container/discussionCircleMain')
            })
        }, './container/discussionCircleMain');
    },
    childRoutes: [
        {
            name: 'postsDetailMain',
            breadcrumbName: '��ʷ�ɼ�',
            path: 'postsDetailMain',
            getComponents(location, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./container/postsDetailMain'))
                }, './container/postsDetailMain')
            }
        },
    ]
};