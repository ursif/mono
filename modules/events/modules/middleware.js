const { applyMiddleware } = require('redux')
const { combineEpics, ofType, createEpicMiddleware } = require('redux-observable')
const { from } = require('rxjs')
const { map, flatMap } = require('rxjs/operators')

const defaultEpics = [
    (actions$) => actions$.pipe(
        ofType('SOME_TYPE'),
        map(d => ({
            ...d,
            type: 'OTHER_TYPE',
        }))
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
        map(({ payload }) => ({
            type: 'NOT REAL'
        }))
    )
]


module.exports = ({ epics = defaultEpics }) => {

    const rootEpic = combineEpics(...epics)

    const middleware = createEpicMiddleware(rootEpic)
    return applyMiddleware(middleware)
}