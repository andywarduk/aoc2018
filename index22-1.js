var mouthX
var mouthY

var targetX
var targetY

var depth

var x0mult
var y0mult

var modulo

var geologicIndex
var erosion
var type

main()

function getInputs() {
    mouthX = 0
    mouthY = 0

    /*
    targetX = 10
    targetY = 10

    depth = 510
    */

    targetX = 9
    targetY = 739

    depth = 10914

    x0mult = 16807
    y0mult = 48271

    modulo = 20183
}

function drawCave()
{
    for (var y of type){
        var line = ''
        for (var x of y){
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
            }
        }
        console.log(line)
    }
}

function main() {
    var x, y

    getInputs()

    geologicIndex = new Array(targetY + 1)
    erosion = new Array(targetY + 1)
    type = new Array(targetY + 1)
    for (y = 0; y < targetY + 1; y++) {
        geologicIndex[y] = new Array(targetX + 1)
        erosion[y] = new Array(targetX + 1)
        type[y] = new Array(targetX + 1)
    }

    for (y = 0; y < targetY + 1; y++) {
        for (x = 0; x < targetX + 1; x++) {
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

            type[y][x] = erosion[y][x] % 3
        }
    }

    drawCave()

    var risk = 0
    for (y = 0; y < targetY + 1; y++) {
        for (x = 0; x < targetX + 1; x++) {
            risk += type[y][x]
        }
    }
    console.log(risk)
}
