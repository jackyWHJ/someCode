module.exports = {
    path: 'courseLearn/:isObligatory',
    getComponents(location, callback) {
    require.ensure([], function(require) {
        callback(null, require("./container/studyDetail.jsx"));
    }, "studyDetail");
    }
}