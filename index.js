const path = require('path'),
    fs = require('fs'),
    { promisify } = require('util'),
    { send } = require("@koa/send")


module.exports = function serveStatic({ urlPrefix, dirPath, indexPages }) {
    return async (ctx, next) => {

        let filePath = ctx.path
        if (urlPrefix) {
            urlPrefix = '/' + urlPrefix.replace(/^\//, '').replace(/\/$/, '')
            filePath = filePath.replace(RegExp(`^${urlPrefix}`), '')
        }

        const fullPath = path.join(dirPath, filePath),
            stats = await promisify(fs.stat)(fullPath).then(stats => stats, () => null)
        console.log(fullPath)
        if (stats && stats.isFile()) {

            await send(ctx, ctx.path, { root: dirPath })

        } else if (stats && stats.isDirectory()) {

            if (!indexPages || !indexPages.length) {
                indexPages = ['index.html', 'index.htm']
            }
            const index = indexPages.findIndex(async s => {
                const file = path.join(fullPath, s),
                    indexStats = await promisify(fs.stat)(file)
                return indexStats && indexStats.isFile()
            })

            index > -1 ? await send(ctx, indexPages[index], { root: dirPath }) : await next()
        } else {
            await next()
        }
    }
}