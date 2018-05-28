# ursif/logger

## Overview

This is the default logger for all `ursif` modules. It uses `console.log` but also exposes a `createLogger` function which will use the provided function. `logger` uses `createLogger(console.log)` under the hood.

Log Format:

```
[PID]:[LEVEL]:[TIMESTAMP]:[title]:<message>
```

## Interface

```ts
interface LogMessage {
    title?: string;
    message?: string;
}

type LogFn = (msg: LogMessage) => void;

interface Logger {
    debug: LogFn;
    info: LogFn;
    warn: LogFn;
    error: LogFn;
}

type LoggerFn = (str: string) => void;
```

## Usage


```js
logger.info({
    title: 'REST_START',
    message: `REST Service Started at http://localhost:${REST_SERVER_PORT}`
})
// [1416]:[INFO]:[1527533803898]:[REST_START]:REST Service Started at http://localhost:5001

logger.debug({
    title: 'REST_START',
    message: `REST Service Started at http://localhost:${REST_SERVER_PORT}`
})
// [1416]:[DEBUG]:[1527533803898]:[REST_START]:REST Service Started at http://localhost:5001
```