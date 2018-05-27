const { Subject } = require('rxjs')
const { filter, merge } = require('rxjs/operators')

module.exports = subscriber => {
    const messages$ = new Subject()

    subscriber.on('message', (channel, message) => {
        messages$.next({
            channel,
            ...JSON.parse(message),
         })
    })

    return ({
        subscribeTo: (channels, isChannel) => {
            const channelList = Array.isArray(channels) ? channels : [channels]
            const pred = isChannel ||
                (({ channel }) => channelList.indexOf(channel) > -1)


            channelList.forEach(c => subscriber.subscribe(c))

            return messages$.pipe(
                filter(pred)
            )
        }
    })
}