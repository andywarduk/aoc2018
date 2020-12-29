const fs = require('fs');

main()

function main() {
    const coordData = getInput()

    // Calculate total distance to each coord for each position
    let area = 0
    
    for (let y = coordData.minY; y <= coordData.maxY; y++) {
        for (let x = coordData.minX; x <= coordData.maxX; x++) {
            let dists = distSum(x, y, coordData.coords)
            if (dists < 10000) ++area
        }
    }

    console.log(area)
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
        }
    }

    return null
}

function distSum(x, y, coords) {
    return coords.map(coord => manhattanDist(x, y, coord.x, coord.y)).reduce((acc, d) => acc + d)
}

function manhattanDist(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}
