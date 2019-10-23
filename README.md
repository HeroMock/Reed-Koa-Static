# Reed Koa Static
Rule based koa static file server middleware


## Sample

```js

    const static = require('eed-koa-static')

    const app = new Koa()

    //rule could comes form config file
    const rule = {
        urlPrefix: 'foo',
        dirPath: 'static',
        // indexPages: ['index.html', 'index.htm']
    }

    app.use(static(rule))

    return app.listen(8000)

```



## Options

__urlPrefix__: _Optional_ Set the URL path prefix 

__dirPath__: _Required_ Dir path to the static files

__indexPages__: _Optional_ Set the index page array, default value is `['index.html', 'index.htm']`
