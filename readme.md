# voxel-app-server

This is an extended implementation of [voxel server](http://github.com/maxogden/voxel-server),
which is a multiplayer server for [voxel-engine](http://github.com/maxogden/voxel-engine).
It shows how to implement a voxeljs game using express (specifically express3) with use registration and authentication.

The basic_auth.js file has an example of how to use express with the basicAuth middleware as an alternative.

You may code your own client implementation using  [voxel-client](https://github.com/maxogden/voxel-client), or use this app's webapp.

This webapp uses [everyauth](https://github.com/bnoguchi/everyauth/tree/express3) for user registration and authentication.
It stores username and gravitar data in a session cookie, which is passed on to the ws websocket server.

It also uses [levelup](https://github.com/rvagg/node-levelup) to store the user registration.

## Get it running on your machine

```
npm install
```

Run the start script:

```
npm start
```

This gets the server running on port 8080. It's using [nodaemon](https://github.com/remy/nodemon) to restart the server
when there are changes. Edit .nodemonignore to ignore files.

This version uses browserify_express to browserify the js bundle, which is useful while developing. You may wish to
generate a static version of this file (browserify demo.js >| bundle.js -d) and link to it in production.

The webapp is configured to let any username/password combination pass and does not persist the registrations yet.

You may view a voxel-client demo at http://127.0.0.1:8080. Click the register link at the bottom of the Login page to
register.

## Sharing game settings

If the client sends an object with a settings property, it will use those settings when creating its game instance
and will send those instances to other clients that connect.

If the client settings have the property "resetSettings", the server will switch to those.
It deletes any game instance and clears the chunkCache.

## explanation

background research:

- http://buildnewgames.com/real-time-multiplayer/
- https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking
- http://www.gabrielgambetta.com/?p=63 (all three parts)
- http://gafferongames.com/networking-for-game-programmers/what-every-programmer-needs-to-know-about-game-networking/
- http://gafferongames.com/game-physics/networked-physics/
- http://udn.epicgames.com/Three/NetworkingOverview.html

## license

BSD
