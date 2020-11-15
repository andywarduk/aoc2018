var fs = require('fs')
var PNG = require('pngjs').PNG

function getInput() {
    var input = fs.readFileSync('input17.txt').toString().split('\n')

    /* var input = [
        "x=495, y=2..7",
        "y=7, x=495..501",
        "x=501, y=3..7",
        "x=498, y=2..4",
        "x=506, y=1..2",
        "x=498, y=10..13",
        "x=504, y=10..13",
        "y=13, x=498..504"
    ] */

    return input
}

function getCoordList(input) {
    var coordList = []

    for (var lineNo in input) {
        var line = input[lineNo]
        var parts = line.split(',')
        if (parts.length != 2) continue
        var coords = {}
        for (var partNo in parts) {
            var part = parts[partNo]
            var eqPos = part.indexOf('=')
            var coord = part.substr(eqPos - 1, 1)
            var numStr = part.substr(eqPos + 1)
            var dotPos = numStr.indexOf('..')
            if (dotPos > 0) {
                coords[coord] = {
                    min: parseInt(numStr.substr(0, dotPos)),
                    max: parseInt(numStr.substr(dotPos + 2))
                }
            } else {
                coords[coord] = {
                    min: parseInt(numStr),
                    max: parseInt(numStr)
                }
            }
        }
        coordList.push(coords)
    }

    return coordList
}

async function writeMap(name, scan) {
    var height = scan.length
    var width = scan[0].length

    var png = new PNG({
        width,
        height
    })
    
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var idx = ((png.width * y) + x) << 2
            switch(scan[y][x]) {
            case '.':
                png.data[idx  ] = 255
                png.data[idx+1] = 255
                png.data[idx+2] = 255
                break
            case '#':
                png.data[idx  ] = 0
                png.data[idx+1] = 0
                png.data[idx+2] = 0
                break
            case '|':
                png.data[idx  ] = 128
                png.data[idx+1] = 128
                png.data[idx+2] = 255
                break
            case '~':
                png.data[idx  ] = 0
                png.data[idx+1] = 0
                png.data[idx+2] = 255
                break
            default:
                png.data[idx  ] = 255
                png.data[idx+1] = 0
                png.data[idx+2] = 0
                break
            }
            png.data[idx+3] = 255
        }
    }
        
    await new Promise((resolve, reject) => {
        var outStream = fs.createWriteStream(`output17-${name}.png`)
        outStream.on('finish', () => {
            resolve()
        })
    
        var pipe = png.pack().pipe(outStream)
        pipe.on('error', (err) => {
            reject(err)
        })
    })
}

// var intNo = 0

async function traceDown(scan, width, height, x, y) {
    var finished = false

    while (!finished) {
        if (y + 1 == height) {
            if(y >= 0) scan[y][x] = '|'
            finished = true
            break
        }

        if (y < -1) {
            y++
            continue
        }

        switch (scan[y + 1][x]) {
        case '.':
            if(y >= 0) scan[y][x] = '|'
            ++y
            break
        case '|':
            if(y >= 0) scan[y][x] = '|'
            finished = true
            break
        case '~':
        case '#':
            scan[y][x] = '|'
            while (await traceOut(scan, width, height, x, y)){
                // await writeMap('int' + (++intNo), scan, width, height)
                y--
            }
            finished = true
            break
        default:
            finished = true
            debugger // eslint-disable-line no-debugger
        }
    }
}

async function traceOut(scan, width, height, initX, y) {
    var contained = true

    var traceLeft = false
    var traceRight = false

    var minX = initX
    var maxX = initX

    var x = initX - 1
    var finished = false
    while (!finished) {
        switch (scan[y][x]) {
        case '.': // Can flow here
            break
        case '|': // Joining downstream
            break
        case '#': // Clay
            minX = x + 1
            finished = true
            break
        case '~':
            finished = true
            break
        default:
            debugger // eslint-disable-line no-debugger
        }

        if (finished) break

        switch (scan[y + 1][x]) {
        case '.': // Leak in bottom
            traceLeft = true
            // eslint-disable-next no-fallthrough
        case '|': // Joined another stream
            contained = false
            minX = x
            finished = true
            break
        case '#': // Clay on bottom
        case '~': // Water on bottom
            // Continue
            break
        default:
            debugger // eslint-disable-line no-debugger
        }

        --x
    }

    x = initX + 1
    finished = false
    while (!finished) {
        switch (scan[y][x]) {
        case '.': // Can flow here
            break
        case '|': // Joining downstream
            break
        case '#': // Clay
            maxX = x - 1
            finished = true
            break
        case '~':
            finished = true
            break
        default:
            debugger // eslint-disable-line no-debugger
        }

        if (finished) break

        switch (scan[y + 1][x]) {
        case '.': // Leak in bottom
            traceRight = true
            // eslint-disable-next no-fallthrough
        case '|': // Joined another stream
            contained = false
            maxX = x
            finished = true
            break
        case '#': // Clay on bottom
        case '~': // Water on bottom
            // Continue
            break
        default:
            debugger // eslint-disable-line no-debugger
        }

        ++x
    }

    if (contained) {
        for (x = minX; x <= maxX; x++) scan[y][x] = '~'
    } else {
        for (x = minX; x <= maxX; x++) scan[y][x] = '|'
    }

    if (traceLeft) await traceDown(scan, width, height, minX, y)
    if (traceRight) await traceDown(scan, width, height, maxX, y)

    return contained
}

async function main() {
    var input = getInput()

    var coordList = getCoordList(input)

    // Work out max and min y
    var minX = coordList[0].x.min - 1
    var maxX = coordList[0].x.max + 1
    var minY = coordList[0].y.min
    var maxY = coordList[0].y.max

    for (var coordNo in coordList) {
        var coord = coordList[coordNo]
        minX = Math.min(minX, coord.x.min - 1)
        maxX = Math.max(maxX, coord.x.max + 1)
        minY = Math.min(minY, coord.y.min)
        maxY = Math.max(maxY, coord.y.max)
    }

    var width = (maxX - minX) + 1
    var height = (maxY - minY) + 1

    // Create the map
    var scan = new Array(height)

    for (var y = 0; y < height; y++) {
        scan[y] = new Array(width)
        for (var x = 0; x < width; x++) {
            scan[y][x] = '.'
        }
    }

    // Add the clay
    for (coordNo in coordList) {
        coord = coordList[coordNo]
        for (y = coord.y.min; y <= coord.y.max; y++) {
            for (x = coord.x.min; x <= coord.x.max; x++) {
                scan[y - minY][x - minX] = '#'
            }
        }
    }

    // Create png of the initial map
    await writeMap('init', scan, width, height)

    // Trace downwards
    var curX = 500 - minX
    var curY = 0 - minY

    await traceDown(scan, width, height, curX, curY)

    // Create png of the final map
    await writeMap('final', scan, width, height)

    // Count water squares
    var trackCnt = 0
    var waterCnt = 0
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            switch (scan[y][x]) {
            case '~':
                ++waterCnt
                break
            case '|':
                ++trackCnt
            }
        }
    }
    console.log(waterCnt + trackCnt)
    console.log(waterCnt)
}

main()
