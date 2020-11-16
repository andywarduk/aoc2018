/* eslint-disable no-console */
var fs = require('fs')

function getInput() {
    var input = fs.readFileSync('input20.txt').toString()

    // var input = '^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$' // 23
    // var input = '^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$' // 31

    return input.split('')
}

function parseRoute(elem) {
    var route = []

    while (input[elem] !== '$') {
        switch (input[elem]) {
        case '(':
            var result = parseBracket(elem + 1)
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

function parseBracket(elem) {
    var result = {
        route: []
    }

    var curSection = []
    while (input[elem] !== ')') {
        switch (input[elem]) {
        case '(':
            var brackResult = parseBracket(elem + 1)
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

function walkRoute(route, rooms, x, y) {
    let room = rooms[`${x}x${y}`]

    for (var item of route) {
        switch (typeof item) {
        case 'string':
            switch(item) {
            case 'N':
                y++
                break
            case 'E':
                x++
                break
            case 'S':
                y--
                break
            case 'W':
                x--
                break
            }
            let newRoom = rooms[`${x}x${y}`]
            if (newRoom === undefined) {
                newRoom = {
                    dist: room.dist + 1
                }
                rooms[`${x}x${y}`] = newRoom
            }
            room = newRoom
            break
        case 'object':
            walkChoice(item, rooms, x, y)
            break
        default:
            // eslint-disable-next-line no-debugger
            debugger
        }
    }
}

function walkChoice(choices, rooms, x, y) {
    for (var choice of choices) {
        walkRoute(choice, rooms, x, y)
    }
}

var input = getInput()

var route = parseRoute(1)

rooms = {}
rooms['0x0'] = {
    dist: 0
}

walkRoute(route, rooms, 0, 0)

let maxDist = 0
for (let key in rooms) {
    maxDist = Math.max(maxDist, rooms[key].dist)
}

console.log(maxDist)
