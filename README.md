# ursif

## Main Repo

This is the parent of the `@ursif` monorepo. To install:

```
yarn // install deps
yarn run lerna bootstrap // install module deps
```

To Run:

```
yarn start // build services
```

You will now have to go into each `module` and run `yarn start`. _**Note**_: This is being actively worked on to be done during `docker-compose up`.


## Application Overview

`ursif` is a blogging platform built on microservices, because why not? It is composed of

* `@usrif/auth`: An authorization service for creating opaque reference tokens for clients and JWTs for internal services
* `@ursif/logger`: A helper module for logging ( _not for Event Sourcing_ )
* `@ursif/user`: A service for keeping the state of the User
* `@ursif/rest`: A service for CRUD updates to a View of a service's state
* `@ursif/events`: A service for Actor-esqueue state handling
* `@ursif/bus`: A service for connecting to and interacting with a Redis message bus
* `@ursif/queue`: A helper module for interacting with a Redis Queue
* `@ursif/graph`: A service for connecting many `ursif` networks
* `@ursif/dashboard`: A service for viewing the `@ursif/graph` of different networks

## TODO

* [x] - Auth Service Skeleton
* [x] - REST Service Skeleton
* [x] - Logger Skeleton
* [x] - Events Service Skeleton
* [x] - Bus Service Skeleton
* [ ] - Messages Service Skeleton
* [ ] - Dashboard Service Skeleton

## Code of Conduct

Don't be a doo-doo head. If you need more than that, please read the [Code of Conduct](./CODE_OF_CONDUCT.md).