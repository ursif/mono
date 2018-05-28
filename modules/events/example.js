const { from } = require('rxjs')
const { map, flatMap } = require('rxjs/operators')
const logger = require('../logger')

// Main Module API
const { createStore, ofType, api } = require('./modules')

const intialState = {
    urls: {
        restBase: 'http://localhost:5001'
    },
    services: {
        api
    }
}

const epics = [
    (actions$) => actions$.pipe(
        ofType('SOME_TYPE'),
        map(d => {
            logger.debug({
                message: 'Some Type'
            })

            return ({
                ...d,
                type: 'OTHER_TYPE',
            })
        })
    ),
    (a$, s$) => a$.pipe(
        ofType('OTHER_TYPE'),
        flatMap(() => from(
            s$.value.services.api.get(
                s$.value.urls.restBase
            )
        )),
        map(data => ({
            type: 'THIRD_TYPE',
            payload: data
        }))
    ),
    (a$) => a$.pipe(
        ofType('THIRD_TYPE'),
        map(({ payload }) => {
            logger.debug({
                title: 'EPIC_DEBUG_THIRD',
                message: `Payload: ${JSON.stringify(payload)}`
            })

            return ({
                type: 'NOT REAL'
            })
        })
    )
]

const store = createStore({ intialState, epics })

store.dispatch({ type: 'SOME_TYPE' })