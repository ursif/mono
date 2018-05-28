# ursif/events

## Overview

This module is responsible for giving users an interface for keeping local state and to respond to outside events by emitting outward actions or by responding to actions internally. 

## Usage

```js
const { from } = require('rxjs')
const { map, flatMap } = require('rxjs/operators')
const logger = require('../logger')

// Main Module API
const {
    createStore, // Creates the system
    ofType, // helper for responding to actions
    api, // node-fetch wrapper for making API calls
} = require('./modules')

// Create an intial state for this instance
// This is where we can inject deps that our
// epics will need
const intialState = {
    urls: {
        restBase: 'http://localhost:5001'
    },
    services: {
        api
    }
}

// Epics are functions of type
// (actions$, state$) => Observable<Action>
//
// You can get the current value of state$ 
// imperatively using state$.value
//
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

// We create an instance
const store = createStore({ intialState, epics })

// Now we can react to actions from
// outside our system
store.dispatch({ type: 'SOME_TYPE' })
```