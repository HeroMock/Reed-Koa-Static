const request = require('supertest'),
    assert = require('assert'),
    app = require('./app')


process.env.NODE_ENV = 'test'

describe('Static HTTP Server', () => {

    it('1. Request index page', async () => {
        const server = app.startServer();

        const res = await request(server)
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200)

        assert.strictEqual(Number(res.header['content-length']) > 0, true)

        server.close()
    })

    it('2. Request non-html file', async () => {
        const server = app.startServer();

        const res = await request(server)
            .get('/app.js')
            .expect('Content-Type', /javascript/)
            .expect(200)

        assert.strictEqual(Number(res.header['content-length']) > 0, true)

        server.close()
    })

    it('3. Request non-existed file', async () => {
        const server = app.startServer();

        const res = await request(server)
            .get('/no-existed.js')
            .expect(404)

        assert.strictEqual(Number(res.header['content-length']) > 0, true)

        server.close()
    })

    it('4. Request index with prefix', async () => {
        const server = app.startServer('public');

        const res = await request(server)
            .get('/public/')
            .expect('Content-Type', /html/)
            .expect(200)

        assert.strictEqual(Number(res.header['content-length']) > 0, true)

        server.close()
    })

})
