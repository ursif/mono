# ursif/rest

## Overview

This module is a wrapper on top of MongoDB for storing a user's data There is no schema nor enforcement or validation of any kind. It is up to a consumer/user of this package to implement those things. This module is aimed at offering a simple interface for CRUD events on a collection type and creating/removing collections.

## API

* `GET /`
    - Returns:
        * A list of Collections the User has along with information about them

* `POST /:collection`
    - Requires:
        * `Body.resources` as an array of `resource` objects to insert into the collection OR
        * `Body.resource` as a single resource to insert
    - Returns:
        * The result of the insert operation

* `DELETE /:collection`
    - Returns:
        * The result of dropping the `collection`

* `GET /:collection`
    - Accepts:
        * Query strings as detailed in `mongo-querystring` package.
    - Returns:
        * A list of `resources` of matching the query inside the collection

* `GET /:collection/:id`
    - Returns:
        * The resource inside the `collection` with the given `id`

* `PATCH /:collection/:id`
    - Requires:
        * `Body.update` to be the updated parts of the `resource` that is being updated
    - Returns:
        * The new `resource` value after updating

* `PUT /:collection/:id`
    - Requires:
        * `Body.replacement` to be the new value to replace the old `resource` with
    - Returns:
        * The new `resource` after replacing it with `replacement`

* `DELETE /:collection/:id`
    - Returns:
        * The result of `deleting` the `resource`