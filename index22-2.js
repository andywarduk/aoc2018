let mouthX
let mouthY

let targetX
let targetY

let depth

let mapX
let mapY

let x0mult
let y0mult

let modulo

let geologicIndex
let erosion
let types

main()

function getInputs() {
    mouthX = 0
    mouthY = 0

    /*
    targetX = 10
    targetY = 10
    depth = 510
    */

    /*
    // Expect 1087 with this
    targetX = 9
    targetY = 796
    depth = 6969
    */

    targetX = 9
    targetY = 739
    depth = 10914

    mapX = targetX + 32
    mapY = targetY + 32

    x0mult = 16807
    y0mult = 48271

    modulo = 20183
}

function toolList(terrain) {
    switch (terrain) {
    case 0:
        return ['C', 'T']
    case 1:
        return ['C', 'N']
    case 2:
        return ['T', 'N']
    }
    debugger
}

function main() {
    getInputs()

    geologicIndex = new Array(mapY)
    erosion = new Array(mapY)
    types = new Array(mapY)
    for (let y = 0; y < mapY; y++) {
        geologicIndex[y] = new Array(mapX)
        erosion[y] = new Array(mapX)
        types[y] = new Array(mapX)
    }

    for (let y = 0; y < mapY; y++) {
        for (let x = 0; x < mapX; x++) {
            if ((x == mouthX && y == mouthY) || (x == targetX && y == targetY)) {
                geologicIndex[y][x] = 0
            } else if (x == 0) {
                geologicIndex[y][x] = y * y0mult
            } else if (y == 0) {
                geologicIndex[y][x] = x * x0mult
            } else {
                geologicIndex[y][x] = erosion[y][x - 1] * erosion[y - 1][x]
            }

            erosion[y][x] = (geologicIndex[y][x] + depth) % modulo

            types[y][x] = erosion[y][x] % 3
        }
    }

    const vertices = []
    for (let y = 0; y < mapY; y++) {
        for (let x = 0; x < mapX; x++) {
            if (x == mouthX && y == mouthY) {
                vertices.push({x, y, tool: 'T', dist: 0})
            } else if (x == targetX && y == targetY) {
                vertices.push({x, y, tool: 'T', dist: Infinity})
            } else {
                for (let tool of toolList(types[y][x])) {
                    vertices.push({x, y, tool, dist: Infinity})
                }
            }
        }
    }

    function *neighbours(v) {
        if (v.x > 0) yield {x: v.x - 1, y: v.y}
        if (v.y > 0) yield {x: v.x, y: v.y - 1}
        if (v.x < mapX - 1) yield {x: v.x + 1, y: v.y}
        if (v.y < mapY - 1) yield {x: v.x, y: v.y + 1}
    }

    const Q = vertices.slice()

    while(Q.length > 0) {
        Q.sort((elem1, elem2) => elem1.dist - elem2.dist)

        // Get next vertex (the one with the shortest distance)
        const v = Q.shift()

        if (v.dist === Infinity) {
            debugger
            break
        }

        // Build string of valid tools for this vertex
        const validTools = toolList(types[v.y][v.x]).join('')

        for (let n of neighbours(v)) {
            const moves = Q.filter((elem) => elem.x == n.x && elem.y == n.y && validTools.indexOf(elem.tool) != -1)

            for (let u of moves) {
                const alt = v.dist + (u.tool == v.tool ? 1 : 8)

                if (alt < u.dist) {
                    u.dist = alt
                    u.prev = v
                }
            }
        }
    }

    function transTool(tool, type) {
        switch (tool) {
        case 'T':
            switch (type) {
            case 0: // Rocky
                return 'T'
            case 2: // Narrow
                return 't'
            default:
                debugger
            }
            break
        case 'C':
            switch (type) {
            case 0: // Rocky
                return 'C'
            case 1: // Wet
                return 'c'
            default:
                debugger
            }
            break
        case 'N':
            switch (type) {
            case 1: // Wet
                return 'N'
            case 2: // Narrow
                return 'n'
            default:
                debugger
            }
        }
    }

    // Find the target vertex
    const target = vertices.find((elem) => elem.x == targetX && elem.y == targetY)

    // Create map showing tool transitions for the shortest path
    const map = []
    for (y of types) {
        map.push(y.slice())
    }

    let prev = target
    while (prev) {
        map[prev.y][prev.x] = transTool(prev.tool, map[prev.y][prev.x])
        prev = prev.prev
    }
    drawCave(map)

    console.log(target)
}

function drawCave(map)
{
    for (let y of map){
        let line = ''

        for (let x of y){
            switch (x) {
            case 0: // Rocky
                line += '.'
                break
            case 1: // Wet
                line += '='
                break
            case 2: // Narrow
                line += '|'
                break
            default:
                line += x
            }
        }

        console.log(line)
    }
}
