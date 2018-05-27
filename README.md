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
* `@ursif/user`: A service for keeping the state of the User
* `@ursif/posts`: A service for keeping the state of the Posts of the User
* `@ursif/messages`: A service for keeping the state of the Messages of the User
* `@ursif/graph`: A service for connecting many `ursif` networks
* `@ursif/dashboard`: A service for viewing the `@ursif/graph` of different networks

## TODO

* [x] - Auth Service Skeleton
* [x] - Posts Service Skeleton
* [ ] - User Service Skeleton
* [ ] - Messages Service Skeleton
* [ ] - Dashboard Service Skeleton

## Code of Conduct

Don't be a doo-doo head. If you need more than that, please read the [Code of Conduct](./CODE_OF_CONDUCT.md).