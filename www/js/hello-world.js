var createClient = require('voxel-client')
var highlight = require('voxel-highlight')
var extend = require('extend')
var voxelPlayer = require('voxel-player')
var game
//var LabelMaker = require('./Label.js')
//var LabelPlugin = require('./LabelPlugin.js')()
var playerLabel
var LabelMaker =  require('voxel-label')

module.exports = function(opts, setup) {
  setup = setup || defaultSetup
  opts = extend({}, opts || {})

  var client = createClient("ws://localhost:8080/")
  
  client.emitter.on('noMoreChunks', function(id) {
    console.log("Attaching to the container and creating player")
    var container = opts.container || document.body
    game = client.game
    game.appendTo(container)
    if (game.notCapable()) return game
    var createPlayer = voxelPlayer(game)

    // create the player from a minecraft skin file and tell the
    // game to use it as the main player
    var playerSettings = {playerName :game.settings.username, gravitar :game.settings.gravitar}
    var avatar = createPlayer('player.png', playerSettings)
//    var THREE = game.THREE
//    var createLabel = LabelMaker(THREE, LabelPlugin)
//    console.log("Creating label for " + game.settings.username)
//    playerLabel = new createLabel(avatar, client.playerID, game.settings.username);
//      // setTimeout is because three.js seems to throw errors if you add stuff too soon
//      setTimeout(function() {
//        client.emitter.on('update', function(updates) {
//          Object.keys(updates.positions).map(function(playerId) {
//            if (playerId != client.playerID)  {
//              var other = this.others[playerId]
//              if (other && !other.labelled) {
//                var name = "Dude " + playerId.slice(0,4);
//                if (other.registration!= null) {
//                  var name = other.registration.username
//                }
//                new createLabel(other.mesh, playerId, name);
//                other.labelled = true
//              }
//            }
//          })
//        })
//      }, 1000)

//    game.view.renderer.addPostPlugin(LabelPlugin);
    var labelText = game.settings.username
    playerLabel = LabelMaker(labelText, avatar, game, client.playerID, client.emitter, client.others)

    window.avatar = avatar
    avatar.possess()
    var settings = game.settings.avatarInitialPosition
    var username = game.settings.username
    console.log("Username: " + username)
    avatar.position.set(settings[0],settings[1],settings[2])
    setup(game, avatar, client)
  })

  return game
}

function defaultSetup(game, avatar, client) {
  // highlight blocks when you look at them, hold <Ctrl> for block placement
  var blockPosPlace, blockPosErase
  var hl = game.highlighter = highlight(game, { color: 0xff0000 })
  hl.on('highlight', function (voxelPos) { blockPosErase = voxelPos })
  hl.on('remove', function (voxelPos) { blockPosErase = null })
  hl.on('highlight-adjacent', function (voxelPos) { blockPosPlace = voxelPos })
  hl.on('remove-adjacent', function (voxelPos) { blockPosPlace = null })

  // toggle between first and third person modes
  window.addEventListener('keydown', function (ev) {
    if (ev.keyCode === 'R'.charCodeAt(0)) avatar.toggle()
  })

  // block interaction stuff, uses highlight data
  var currentMaterial = 1

  game.on('fire', function (target, state) {
    var position = blockPosPlace
    if (position) {
      game.createBlock(position, currentMaterial)
      client.emitter.emit('set', position, currentMaterial)
    } else {
      position = blockPosErase
      if (position) {
        game.setBlock(position, 0)
        console.log("Erasing point at " + JSON.stringify(position))
        client.emitter.emit('set', position, 0)
      }
    }
  })
}