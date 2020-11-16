/* eslint-disable no-console */
var fs = require('fs')
var PNG = require('pngjs').PNG

function getInput() {
    var input = fs.readFileSync('input20.txt').toString()

    // var input = '^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$' // 23
    // var input = '^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$' // 31

    return input.split('')
}

function parseRoute(input, elem) {
    var route = []

    while (input[elem] !== '$') {
        switch (input[elem]) {
        case '(':
            var result = parseBracket(input, elem + 1)
            elem = result.elem - 1
            route.push(result.route)
            break
        default:
            route.push(input[elem])
            break
        }
        ++elem
    }

    return route
}

function parseBracket(input, elem) {
    var result = {
        route: []
    }

    var curSection = []
    while (input[elem] !== ')') {
        switch (input[elem]) {
        case '(':
            var brackResult = parseBracket(input, elem + 1)
            elem = brackResult.elem - 1
            curSection.push(brackResult.route)
            break
        case '|':
            result.route.push(curSection)
            curSection = []
            break
        default:
            curSection.push(input[elem])
            break
        }
        ++elem
    }
    result.route.push(curSection)

    result.elem = elem + 1

    return result
}

var dist = 1000

var rooms = []

function setPixel(png, x, y, r, g, b) {
    var idx = ((png.width * y) + x) << 2
    png.data[idx  ] = r
    png.data[idx+1] = g
    png.data[idx+2] = b
    png.data[idx+3] = 255
}

function findRoom(x, y) {
    return rooms.find((elem) => elem.x === x && elem.y === y)
}

function createRoom(x, y, depth) {
    var room = {
        x,
        y,
        depth
    }

    rooms.push(room)

    return room
}

function walkRooms(room, route, png) {
    function move(dX, dY, dir) {
        var pngX = (room.x * 2) + pngOriginX
        var pngY = (room.y * 2) + pngOriginY

        // Draw door
        pngX += dX
        pngY += dY

        setPixel(png, pngX, pngY, 255, 255, 255)

        var nextRoom = findRoom(room.x + dX, room.y + dY)
        if (!nextRoom) {
            nextRoom = createRoom(room.x + dX, room.y + dY, room.depth + 1)
        } else {
            nextRoom.depth = Math.min(nextRoom.depth, room.depth + 1)
        }
        room[dir] = nextRoom
        room = nextRoom

        // Draw room
        pngX += dX
        pngY += dY

        var r = 255
        var g = 255
        var b = 255

        if (nextRoom.depth > dist) {
            b = 0
        } else {
            r = (nextRoom.depth / dist) * 255
            g = 255 - ((nextRoom.depth / dist) * 255)
            b = 0
        }
        setPixel(png, pngX, pngY, r, g, b)        
    }

    for (var item of route) {
        switch (typeof item) {
        case 'string':
            switch(item) {
            case 'N':
                move(0, -1, item)
                break
            case 'E':
                move(1, 0, item)
                break
            case 'S':
                move(0, 1, item)
                break
            case 'W':
                move(-1, 0, item)
                break
            default:
                debugger
            }
            break
        case 'object':
            room = walkChoices(item, room, png)
            break
        default:
            // eslint-disable-next-line no-debugger
            debugger
        }
    }

    return room
}

function walkChoices(choices, startRoom, png) {
    var room

    for (var choice of choices) {
        room = walkRooms(startRoom, choice, png)
    }

    return room
}

var pngOriginX = 106
var pngOriginY = 100

async function main() {
    var input = getInput()

    var route = parseRoute(input, 1)

    var width = 203
    var height = 203

    var png = new PNG({
        width,
        height
    })

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            setPixel(png, x, y, 0, 0, 0)
        }
    }

    setPixel(png, pngOriginX, pngOriginY, 255, 0, 0)

    var rootRoom = createRoom(0, 0, 0)
    walkRooms(rootRoom, route, png)

    var farRooms = rooms.filter((elem) => elem.depth >= dist)

    console.log(farRooms.length)

    var p = new Promise((resolve, reject) => {
        var outStream = fs.createWriteStream('output20-map.png')
        outStream.on('finish', () => {
            resolve()
        })

        var pipe = png.pack().pipe(outStream)
        pipe.on('error', (err) => {
            reject(err)
        })
    })

    await p
}

main()