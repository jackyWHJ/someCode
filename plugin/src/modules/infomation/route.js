/**
 *      资讯页面
 *
 *
 *
 * **/

module.exports = {
    path: 'info',
    childRoutes:[
        {
            path: 'information',
            getIndexRoute(location, callback) {
                require.ensure([], function(require) {
                    callback(null, {component:require("./container/InfoContainer")});
                }, "InformationContainer");
            },
            childRoutes:[
                {
                    path: 'infoDetail',
                    getComponents(location, callback) {
                    require.ensure([], function(require) {
                            callback(null, require("./container/InfoDetailContainer"));
                        }, "InformationDetailContainer");
                    },

                }
            ]
        }
    ]
}