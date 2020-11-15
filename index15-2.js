var fs = require('fs')

function play(eDamage) {

    function getInput() {
        var input = fs.readFileSync('input15.txt').toString().split("\n")

        function addPlayer(yPos, xPos) {
            var type = input[yPos].substr(xPos, 1)
            players.push({
                type,
                y: yPos,
                x: xPos,
                health: 200,
                attack: (type == 'E' ? eDamage : 3)
            })
        }

        var players = []
        for (lineNo in input) {
            lineNo = parseInt(lineNo)
            var line = input[lineNo]
            while(true) {
                if (line.indexOf("E") >= 0) {
                    var xPos = line.indexOf("E")
                    line = line.substr(0, xPos) + '.' + line.substr(xPos + 1)
                    addPlayer(lineNo, xPos)
                } else if (line.indexOf("G") >= 0) {
                    var xPos = line.indexOf("G")
                    line = line.substr(0, xPos) + '.' + line.substr(xPos + 1)
                    addPlayer(lineNo, xPos)
                } else {
                    break
                }
            }
        }

        return {
            players,
            map: input.map((line) => {
                var lineArr = new Array(line.length)
                for(var i = 0; i < line.length; i++) {
                    lineArr[i] = line.substr(i, 1)
                }
                return lineArr
            })
        }
    }

    function dumpMap(map, players) {
        for (y in map) {
            var line = ''
            for (x in map[y]) {
                line += map[y][x]
            }
            var linePlayers = players.filter((elem) => elem.y == y).sort((a, b) => a.x - b.x)
            for (var p in linePlayers) {
                line += ` ${linePlayers[p].health}`
            }
            console.log(line)
        }
    }

    function readSort(array) {
        array.sort((a, b) => {
            if (a.y < b.y) return -1
            if (a.y == b.y) {
                if (a.x < b.x) return -1
                if (a.x == b.x) return 0
                return 1
            }
            return 1
        })
    }

    function tick() {
        var players = state.players
        var map = state.map

        function cloneMap(map) {
            return map.map((elem) => elem.slice(0))
        }

        function calcDist(map, fromX, fromY, toX, toY) {
            var result = { dist: Infinity }
            var depth = 0

            function setResult(depth, squareNo)
            {
                var route = []
                var i = depth

                while (squareNo >= 0) {
                    route.push(search[i][squareNo])
                    squareNo = search[i][squareNo].parent
                    i--
                }

                result = {
                    dist: depth + 1,
                    route
                }
            }

            var search = [[{x: fromX, y: fromY, parent: -1}]]
            map[fromY][fromX] = 0

            while (search[depth].length > 0) {
                var next = []

                for (squareNo in search[depth]) {
                    squareNo = parseInt(squareNo)
                    square = search[depth][squareNo]
                    var { x, y } = square

                    if (y - 1 == toY && x == toX) {
                        setResult(depth, squareNo)
                        break
                    }
                    if (y == toY && x - 1 == toX) {
                        setResult(depth, squareNo)
                        break
                    }
                    if (y == toY && x + 1 == toX) {
                        setResult(depth, squareNo)
                        break
                    }
                    if (y + 1 == toY && x == toX) {
                        setResult(depth, squareNo)
                        break
                    }

                    if (map[y - 1][x] == '.') {
                        map[y - 1][x] = depth
                        next.push({x, y: y - 1, parent: squareNo})
                    }
                    if (map[y][x - 1] == '.') {
                        map[y][x - 1] = depth
                        next.push({x: x - 1, y, parent: squareNo})
                    }
                    if (map[y][x + 1] == '.') {
                        map[y][x + 1] = depth
                        next.push({x: x + 1, y, parent: squareNo})
                    }
                    if (map[y + 1][x] == '.') {
                        map[y + 1][x] = depth
                        next.push({x, y: y + 1, parent: squareNo})
                    }
                }

                if (result.dist !== Infinity)
                    break

                ++depth
                search.push(next)
            }

            return result
        }

        function getAttackSquares(player) {
            var attackSquares = []
            var attackType = (player.type == 'E' ? 'G' : 'E')

            if (player.y > 0 && map[player.y - 1][player.x] == attackType) attackSquares.push({y: player.y - 1, x: player.x})
            if (player.x > 0 && map[player.y][player.x - 1] == attackType) attackSquares.push({y: player.y, x: player.x - 1})
            if (player.x < map[player.y].length && map[player.y][player.x + 1] == attackType) attackSquares.push({y: player.y, x: player.x + 1})
            if (player.y < map.length && map[player.y + 1][player.x] == attackType) attackSquares.push({y: player.y + 1, x: player.x})

            return attackSquares
        }

        // Sort in to reading order
        readSort(players)

        var newPlayers = []
        while (players.length >= 1) {
            var curPlayers = newPlayers.concat(players)
            var player = players.shift()

            // Identify targets
            var targets = curPlayers.filter((elem) => elem.type != player.type)
            readSort(targets)

            // Identify attack squares
            attackSquares = getAttackSquares(player)

            if (attackSquares.length == 0) {
                // Identify target squares
                var targetSquares = []
                for (var targetNo in targets) {
                    var x = targets[targetNo].x
                    var y = targets[targetNo].y
                    if (y > 0 && map[y - 1][x] == '.') targetSquares.push({y: y - 1, x})
                    if (x > 0 && map[y][x - 1] == '.') targetSquares.push({y, x: x - 1})
                    if (x < map[y].length && map[y][x + 1] == '.') targetSquares.push({y, x: x + 1})
                    if (y < map.length && map[y + 1][x] == '.') targetSquares.push({y: y + 1, x})
                }

                if (targetSquares.length > 0) {
                    // Move
                    // Calculate distance to target squares
                    targetSquares = targetSquares.map((elem) => {
                        var dist = calcDist(cloneMap(map), elem.x, elem.y, player.x, player.y)
                        return {...elem, ...dist }
                    })

                    // Filter out infinite distance target squares
                    targetSquares = targetSquares.filter((elem) => elem.dist !== Infinity)

                    if (targetSquares.length > 0) {
                        // Sort in to distance order
                        targetSquares.sort((elem1, elem2) => elem1.dist - elem2.dist)

                        // Filter lowest distance only
                        targetSquares = targetSquares.filter((elem) => elem.dist == targetSquares[0].dist)

                        // Sort in to read order
                        readSort(targetSquares)

                        // Choose the first target
                        var moveTo = targetSquares[0]

                        map[player.y][player.x] = '.'
                        player.x = moveTo.route[0].x
                        player.y = moveTo.route[0].y
                        map[player.y][player.x] = player.type
                    }
                }
            }

            attackSquares = getAttackSquares(player)

            if (attackSquares.length > 0) {
                // Map player to squares
                attackSquares = attackSquares.map((as) => { return {
                    ...as,
                    player: players.find((p) => p.x == as.x && p.y == as.y) || 
                            newPlayers.find((p) => p.x == as.x && p.y == as.y)
                }})

                // Find opponent with lowest health to attack
                attackSquares.sort((as1, as2) => {
                    var result = as1.player.health - as2.player.health
                    if (result == 0) {
                        if (as1.y < as2.y) return -1
                        if (as1.y == as2.y) {
                            if (as1.x < as2.x) return -1
                            if (as1.x == as2.x) return 0
                            return 1
                        }
                        return 1
                    }
                    return result
                })

                var attack = attackSquares[0]
                attack.player.health -= player.attack
                if (attack.player.health < 0) {
                    // Player killed
                    newPlayers = newPlayers.filter((elem) => elem.x != attack.x || elem.y != attack.y)
                    players = players.filter((elem) => elem.x != attack.x || elem.y != attack.y)
                    map[attack.y][attack.x] = '.'
                }
            }

            newPlayers.push(player)
        }

        // Set player array for the next round
        state.players = newPlayers
    }

    var state = getInput()

    var initElf = state.players.filter((elem) => elem.type =='E').length

    var ticks = 0
    while (true) {
        if (state.players.filter((elem) => elem.type =='E').length == 0) {
            break
        }
        if (state.players.filter((elem) => elem.type =='G').length == 0) {
            break
        }
        
        tick()
        ++ticks
    }

    var score = 0
    for (p in state.players) {
        score += state.players[p].health
    }
    score *= (ticks - 1)
    
    return {
        score,
        eDead: initElf - state.players.filter((elem) => elem.type =='E').length
    }
}

var damage = 3
while (true) {
    var result = play(damage)
    console.log(`damage: ${damage}, dead: ${result.eDead}, score: ${result.score}`)
    if (result.eDead == 0) {
        break
    }
    ++damage
}
