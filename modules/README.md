# ursif/mono

## Overview

These are the pieces that make up `ursif`. If any other part depends on something not in userland, this is where it lives. If a module depends on some external service for development, there will be a `Dockerfile` that describes how to build the needed services and on the default ports.