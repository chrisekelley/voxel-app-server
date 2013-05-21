var createClient = require('voxel-client')
var highlight = require('voxel-highlight')
var extend = require('extend')
var voxelPlayer = require('voxel-player')
var game
var playerLabel
var LabelPlugin =  require('voxel-label')

module.exports = function(opts, setup) {
  setup = setup || defaultSetup
  opts = extend({}, opts || {})
  var labels = []

  var client = createClient("ws://192.168.1.60:8080/")
  //var client = createClient("ws://localhost:8080/")
  
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
    var labelText = game.settings.username
    // init LabelPlugin
    LabelPlugin(game)
    playerLabel = LabelPlugin.label(labelText, avatar, game, client.playerID)
      setTimeout(function() {
        client.emitter.on('update', function(updates) {

          Object.keys(updates.userInfo).map(function(playerId) {
            var update = updates.userInfo[playerId]
            if (playerId === self.playerID) return  // local playerId
            var playerSkin = this.others[playerId]
            if (playerSkin != null) {
              playerSkin.userInfo = update
              if (labels[playerId] !== playerSkin.userInfo.username) {
                var otherPlayerLabel = LabelPlugin.label(playerSkin.userInfo.username, playerSkin.mesh, game, playerId)
                labels[playerId] = playerSkin.userInfo.username
              }
            }
          })

//          Object.keys(client.others).map(function(playerId) {
//            var playerSkin = client.others[playerId]
//            if ((playerSkin.userInfo != null) && (labels[playerId] !== playerSkin.userInfo.username)) {
//              playerLabel = LabelPlugin.label(playerSkin.userInfo.username, playerSkin.mesh, game, playerId)
//              labels[playerId] = playerSkin.userInfo.username
//            }
//          })
        })
      }, 1000)

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