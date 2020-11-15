var fs = require('fs')

function getInput() {
    var input = fs.readFileSync('input18.txt').toString().split('\n')

    /* var input = [
        '.#.#...|#.',
        '.....#|##|',
        '.|..|...#.',
        '..|#.....#',
        '#.#|||#|#|',
        '...#.||...',
        '.|....|...',
        '||...#|.#|',
        '|.||||..|.',
        '...#.|..|.'
    ] */

    return input.map((elem) => elem.split(''))
}

function *coordGen(x, y) {
    yield {x: x - 1, y: y - 1}
    yield {x, y: y - 1}
    yield {x: x + 1, y: y - 1}
    yield {x: x - 1, y}
    yield {x: x + 1, y}
    yield {x: x - 1, y: y + 1}
    yield {x, y: y + 1}
    yield {x: x + 1, y: y + 1}
}

function getStateSurround(x, y) {
    var iter = coordGen(x, y)
    var surround = []

    // eslint-disable-next-line no-constant-condition
    while (true) {
        var iterVal = iter.next()
        if (iterVal.done) break
        var coord = iterVal.value
        if (coord.x >= 0 && coord.y >= 0 &&
            coord.y < state.length && coord.x < state[coord.y].length) {
            surround.push(state[coord.y][coord.x])
        }
    }

    return surround
}

var state = getInput()

for (var i = 0; i < 1000; i++) {
    var newState = state.map((y) => y.slice())

    for (var y = 0; y < state.length; y++) {
        for (var x = 0; x < state[y].length; x++) {
            var content = state[y][x]
            var surround = getStateSurround(x, y)
            switch (content) {
            case '.': // Open
                if (surround.filter((elem) => elem === '|').length >= 3) {
                    content = '|' // Trees
                }
                break
            case '|': // Trees
                if (surround.filter((elem) => elem === '#').length >= 3) {
                    content = '#' // Lumber yard
                }
                break
            case '#': // Lumber yard
                if (surround.filter((elem) => elem === '|').length >= 1 &&
                    surround.filter((elem) => elem === '#').length >= 1) {
                    content = '#'
                } else {
                    content = '.'
                }
                break
            }

            newState[y][x] = content
        }
    }

    state = newState

    var wooded = 0
    var lumber = 0
    
    for (y = 0; y < state.length; y++) {
        for (x = 0; x < state[y].length; x++) {
            switch (state[y][x]) {
            case '|':
                ++wooded
                break
            case '#':
                ++lumber
                break
            }
        }
    }
    
    console.log(`${i + 1}: wooded ${wooded}, lumber ${lumber}, total ${wooded * lumber}`)
    if (i > 900 && (i + 1) % 28 === 1000000000 % 28) {
        break
    }
}
