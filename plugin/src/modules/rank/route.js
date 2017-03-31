module.exports = {
    path: 'rank',
    getComponents(location, callback) {
        require.ensure([], function(require) {
            callback(null, require("./container/rank"));
        }, "rankContainer");
    }
}