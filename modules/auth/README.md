# ursif/auth

## Overview

This module is a wrapper on top of redis that creates opaque reference tokens for client consumption and ties them with JWT tokens for internal consumption. 

## Opaque vs JWT

There is no reason that clients need to have a JWT as the their identity token. The only place in our application that we need to use the JWT is when a service needs the identity of the request. In light of this, we have created two different types of `tokens` that our system as a whole will ever see: `opaque reference` and `jwt`. Both are just hashes of the same `user` object, with the `opaque reference token` using `bcrypt.hash` while `jwt` following the JSON Web Token standard.

The `opaque reference token` is a generated hash for the client to use when making requests to any service. In this way, there are limited cases where the client stores sensitive information or sends that information across the wire. Each request outside of our "walled garden" will use the opaque reference token. 

The `jwt` holds the context information for the user making the requests. This can be any JSON-able value. It is used throughout the lifecycle of the `reference token` and consumed by the internal services. Anything that any service will need to have needs to be held inside the `jwt`.

## API

* `GET /`
    - Requires:
        * `Headers.authtoken` to be set to the opaque reference token
    - Returns:
        * The `JWT` associated with that opaque reference token

* `POST /`
    - Requires:
        * `Body.context` to be set to the JSON value to store in the JWT
    - Returns:
        * The `opaque reference token` for client consumption

* `PATCH /`
    - Requires:
        * `Headers.authtoken` to be set to the original opaque reference token
        * `Body.context` to be set to the JSON value to store in the JWT
    - Returns:
        * The `opaque reference token` for the client consumption