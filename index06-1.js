const fs = require('fs');

main()

function main() {
    const coordData = getInput()

    // Construct board
    board = new Array(coordData.maxY + 1)
    for (let y = coordData.minY; y <= coordData.maxY; y++) {
        board[y] = new Array(coordData.maxX + 1)
    }

    // Calculate nearest coord for each position
    for (let y = coordData.minY; y <= coordData.maxY; y++) {
        for (let x = coordData.minX; x <= coordData.maxX; x++) {
            board[y][x] = nearestCoord(x, y, coordData.coords)
        }
    }

    // Calculate area for each coord
    for (let y = coordData.minY; y <= coordData.maxY; y++) {
        for (let x = coordData.minX; x <= coordData.maxX; x++) {
            let idx = board[y][x]

            if (idx >= 0) {
                coordData.coords[idx].area++
            }
        }
    }

    // Work out which coords are infinite
    for (let y = coordData.minY; y <= coordData.maxY; y++) {
        markInfinite(board[y][coordData.minX], coordData.coords)
        markInfinite(board[y][coordData.maxX], coordData.coords)
    }

    for (let x = coordData.minX; x <= coordData.maxX; x++) {
        markInfinite(board[coordData.minY][x], coordData.coords)
        markInfinite(board[coordData.maxY][x], coordData.coords)
    }

    const largestArea = coordData.coords.reduce((area, coord, idx) => {
        if (!coord.infinite && coord.area > area) {
            area = coord.area
        }

        return area
    }, 0)

    console.log(largestArea)
}

function getInput() {
    const lines = fs.readFileSync('input06.txt').toString().split("\n")

    const coords = lines
        .filter(l => l != "")
        .map(parseCoord)
        .filter(coord => !!coord)

    const coordData = {
        coords,
        minX: Number.MAX_SAFE_INTEGER,
        maxX: 0,
        minY: Number.MAX_SAFE_INTEGER,
        maxY: 0
    }

    for (let coord of coordData.coords) {
        coordData.minX = Math.min(coordData.minX, coord.x)
        coordData.maxX = Math.max(coordData.maxX, coord.x)
        coordData.minY = Math.min(coordData.minY, coord.y)
        coordData.maxY = Math.max(coordData.maxY, coord.y)
    }

    return coordData
}

function parseCoord(line) {
    const regex = /^\s*(\d+)\s*,\s*(\d+)\s*$/
    const groups = line.match(regex)

    if (groups) {
        return {
            x: parseInt(groups[1]),
            y: parseInt(groups[2]),
            area: 0,
            infinite: false
        }
    }

    return null
}

function nearestCoord(x, y, coords) {
    const nearest = coords.reduce((nearest, coord, idx) => {
        const dist = manhattanDist(x, y, coord.x, coord.y)

        if (dist < nearest.dist) {
            nearest.dist = dist
            nearest.coords = [idx]
        } else if (dist == nearest.dist) {
            nearest.coords.push(idx)
        }

        return nearest
    }, {
        dist: Number.MAX_SAFE_INTEGER,
        coords: []
    })

    if (nearest.coords.length > 1) return -1

    return nearest.coords[0]
}

function markInfinite(coord, coords) {
    if (coord >= 0) {
        coords[coord].infinite = true
    }
}

function manhattanDist(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}
