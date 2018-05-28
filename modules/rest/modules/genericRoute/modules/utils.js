
const DB_ERROR = (msg = 'DB_ERROR', code = 500) => {
    const err = new Error(msg)
    
    err.code = code

    return err
}

const getPost = ({ ops, result }) => {
    if (!result.ok) {
        throw DB_ERROR('ERROR_WITH_POST', 500)
    }

    return ops
}

const getUpdateResult = ({ value, ok }) => {
    if(!ok) {
        throw DB_ERROR('ERROR_WITH_UPDATE', 400)
    }

    return value
}

const isBadPost = ({ resources, resource }) => (!resources || !Array.isArray(resources)) && !resource

const isBadPatch = ({ update }) => !update

const isBadPut = ({ replacement }) => !replacement

const JSONAPI = {
    response: (res, meta = {}, code = 200) => data => res
        .status(code)
        .json({
            data,
            meta,
        }),
    error: (res, meta = {}, code = 400) => error => res
        .status(code)
        .json({
            error,
            meta
        })
}

module.exports = {
    JSONAPI,
    isBadPost,
    isBadPut,
    isBadPatch,
    DB_ERROR,
    getPost,
    getUpdateResult
}