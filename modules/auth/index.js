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

// User -> Opaque Reference Token
server.app.post('/', async (req, res) => {
    const { user } = req.body
    const token = await tokens.createOpToken(user)
    const jwt = await tokens.createJWT(user)
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

server.start(5000, () => console.log('Auth is alive!'))
