# ursif/queue

## Overview

The queue keeps track of jobs that are needing to be completed. This module offers an interface for using `redis` as a distributed queue. It has default `retryStrategy` and configuration but can be extended/replaced via the configuration.

## Failed Jobs

There will come times when a worker says that they are working on a task but fails to complete it for whatever reason. `@ursif/queue` uses two different queues inside of `redis` to keep track of work. When a worker calls `next` on the queue, the item pulled from the queue is added to an `inProgress` queue. Every _x_ seconds, the `queue` checks for "dead" jobs and retries them. This is dictated by the `config.retryStrategy` function of type:

```ts
type RetryStrategy = (cache: RedisClient, config) => RedisClient
```

## API

The `queue` has the following methods:

* `add::(event) => Promise<Job>`
* `next::() => Promise<Job>`
* `finish::(job, count?) => Promise<number>`
* `count::() => Promise<{ queue, retryQueue }>`
* `drop::() => Promise<{ dropped }>`
* `clear::(queueName) => Promise<{ dropped }>`