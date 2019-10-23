const path = require('path'),
    fs = require('fs'),
    { promisify } = require('util'),
    send = require('koa-sendfile')


module.exports = function serveStatic({ urlPrefix, dirPath, indexPages }) {
    return async (ctx, next) => {

        let filePath = ctx.path
        if (urlPrefix) {
            urlPrefix = '/' + urlPrefix.replace(/^\//, '').replace(/\/$/, '')
            filePath = filePath.replace(RegExp(`^${urlPrefix}`), '')
        }

        let fullPath = path.join(dirPath, filePath),
            stats = await promisify(fs.stat)(fullPath).then(stats => stats, () => null)

        if (stats && stats.isFile()) {

            await send(ctx, fullPath)

        } else if (stats && stats.isDirectory()) {

            if (!indexPages || !indexPages.length) {
                indexPages = ['index.html', 'index.htm']
            }

            let indexPaths = indexPages.map(s => path.join(fullPath, s)),
                indexFile = indexPaths.find(async s => {
                    let indexStats = await promisify(fs.stat)(s)
                    return indexStats && indexStats.isFile()
                })

            indexFile ? await send(ctx, indexFile) : await next()

        } else {
            await next()
        }
    }
}