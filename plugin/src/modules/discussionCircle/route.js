export default{
    name: 'discussionCircleMain',
    breadcrumbName: '¿¼ÊÔ',
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
            breadcrumbName: 'ÀúÊ·³É¼¨',
            path: 'postsDetailMain',
            getComponents(location, cb) {
                require.ensure([], (require) => {
                    cb(null, require('./container/postsDetailMain'))
                }, './container/postsDetailMain')
            }
        },
    ]
};