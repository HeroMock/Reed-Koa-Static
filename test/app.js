const Koa = require('koa'),
    path = require('path'),
    static = require('../index')

process.env.NODE_ENV = 'test'

exports.startServer = function (urlPrefix) {
    const app = new Koa(),
        dirPath = path.join(process.cwd(), 'test', 'static')

    app.use(static({ urlPrefix, dirPath }))

    return app.listen()
}