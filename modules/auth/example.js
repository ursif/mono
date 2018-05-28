const { cache, server, tokens } = require('./modules')

// Opaque Reference Token -> JWT
server.app.get('/', async (req, res) => {
    if (!req.headers.authtoken) {
        return res.status(400).json({
            error: {
                message: 'No auth token'
            }
        })
    }

    const jwt = await cache.get(req.headers.authtoken)

    if (!jwt) {
        return res.status(417).json({
            error: {
                message: 'Not Authorized'
            }
        })
    }

    res.json({
        jwt
    })
})

// Context -> Opaque Reference Token
server.app.post('/', async (req, res) => {
    const { context } = req.body
    const token = await tokens.createOpToken(context)
    const jwt = await tokens.createJWT(context)
    const didSet = await cache.set(token, jwt)

    if(!didSet) {
        return res.status(400).json({
            error: {
                message: 'Error authorizing'
            }
        })
    }

    res.json({
        token
    })
})

// Opaque Reference Token -> Opaque Reference Token
server.app.patch('/', async (req, res) => {
    const authtoken = req.headers.authtoken
    const { context } = req.body
    const jwt = await tokens.createJWT(context)
    const didSet = await cache.set(authtoken, jwt)

    if(!didSet) {
        return res.status(400).json({
            error: {
                message: 'Error authorizing'
            }
        })
    }

    res.json({
        token: authtoken
    })
})

server.start(5000, () => console.log('Auth is alive!'))
