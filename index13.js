var fs = require('fs')

function getInput() {
    /*var input = [
        "/->-\\        ",
        "|   |  /----\\",
        "| /-+--+-\\  |",
        "| | |  | v  |",
        "\\-+-/  \\-+--/",
        "  \\------/   ",
    ]*/
    var input = fs.readFileSync('input13.txt').toString().split("\n")

    function getSurround(xPos, yPos) {
        var l = (xPos == 0 ? ' ' : input[yPos].substr(xPos - 1, 1))
        var t = (yPos == 0 || xPos >= input[yPos - 1].length ? ' ' : input[yPos - 1].substr(xPos, 1))
        var r = (xPos >= input[yPos].length ? ' ' : input[yPos].substr(xPos + 1, 1))
        var b = (yPos == input.length || xPos >= input[yPos + 1].length ? ' ' : input[yPos + 1].substr(xPos, 1))

        return {
            l,
            t,
            r,
            b
        }
    }

    function addCart(xPos, yPos, replace) {
        var dir = input[yPos].substr(xPos, 1)
        input[yPos] = input[yPos].substr(0, xPos) + replace + input[yPos].substr(xPos + 1)
        carts.push({
            xPos,
            yPos,
            dir,
            nextTurn: 'l'
        })
    }

    // Get cart coordinates and direction and fill in the gaps
    var carts = []
    var maxLen = 0
    for (lineNo in input) {
        lineNo = parseInt(lineNo)
        maxLen = Math.max(maxLen, input[lineNo].length)
        var replaced = true
        while(replaced) {
            var line = input[lineNo]
            if (line.indexOf("v") >= 0) {
                var xPos = line.indexOf("v")
                var surround = getSurround(xPos, lineNo)
                var replace = '|'
                if ((surround.t == '|' || surround.t == '\\' || surround.t == '/' || surround.t == '+') &&
                    (surround.b == '|' || surround.b == '\\' || surround.t == '/' || surround.b == '+') &&
                    (surround.l == '|' || surround.l == ' ') &&
                    (surround.r == '|' || surround.r == ' ')) {
                    // Replace with |
                } else {
                    console.log("Unhandled v!")
                }
                addCart(xPos, lineNo, replace)
            } else if (line.indexOf("^") >= 0) {
                var xPos = line.indexOf("^")
                var surround = getSurround(xPos, lineNo)
                var replace = '|'
                if ((surround.t == '|' || surround.t == '\\' || surround.t == '/' || surround.t == '+') &&
                    (surround.b == '|' || surround.b == '\\' || surround.t == '/' || surround.b == '+') &&
                    (surround.l == '|' || surround.l == ' ') &&
                    (surround.r == '|' || surround.r == ' ')) {
                    // Replace with |
                } else {
                    console.log("Unhandled ^!")
                }
                addCart(xPos, lineNo, replace)
            } else if (line.indexOf(">") >= 0) {
                var xPos = line.indexOf(">")
                var surround = getSurround(xPos, lineNo)
                var replace = '-'
                if ((surround.l == '-' || surround.l == '\\' || surround.l == '/' || surround.l == '+') &&
                    (surround.r == '-' || surround.r == '\\' || surround.r == '/' || surround.r == '+') &&
                    (surround.t == '-' || surround.t == ' ') &&
                    (surround.b == '-' || surround.b == ' ')) {
                    // Replace with -
                } else {
                    console.log("Unhandled >!")
                }
                addCart(xPos, lineNo, replace)
            } else if (line.indexOf("<") >= 0) {
                var xPos = line.indexOf("<")
                var surround = getSurround(xPos, lineNo)
                var replace = '-'
                if ((surround.l == '-' || surround.l == '\\' || surround.l == '/' || surround.l == '+') &&
                    (surround.r == '-' || surround.r == '\\' || surround.r == '/' || surround.r == '+') &&
                    (surround.t == '-' || surround.t == ' ') &&
                    (surround.b == '-' || surround.b == ' ')) {
                    // Replace with -
                } else {
                    console.log("Unhandled <!")
                }
                addCart(xPos, lineNo, replace)
            } else {
                replaced = false
                break
            }
        }
    }

    return {
        carts,
        track: input.map((line) => {
            var lineArr = new Array(maxLen)
            for(var i = 0; i < maxLen; i++) {
                lineArr[i] = (i > line.length ? ' ' : line.substr(i, 1))
            }
            return lineArr
        })
    }
}

function dumpTrack(track) {
    for (y in track) {
        var line = ''
        for (x in track[y]) {
            line += track[y][x]
        }
        console.log(line)
    }
}

function nextTurn(dir) {
    switch(dir){
    case 'l':
        return 's'
    case 's':
        return 'r'
    case 'r':
        return 'l'
    }
}

function moveCarts() {
    // Sort the carts top to bottom, left to right
    state.carts.sort((cart1, cart2) => {
        if (cart1.yPos < cart2.yPos) return -1
        if (cart1.yPos == cart2.yPos) {
            if (cart1.xPos < cart2.xPos) return -1
            if (cart1.xPos == cart2.xPos) return 0
            return 1
        }
        return 1
    })

    var newCarts = []

    while (true){
        cart = state.carts.shift()
        if (!cart) break

        switch(cart.dir){
        case '<':
            cart.xPos--
            switch (state.track[cart.yPos][cart.xPos]) {
            case '-':
                break
            case '/':
                cart.dir = 'v'
                break
            case '\\':
                cart.dir = '^'
                break
            case '+':
                switch (cart.nextTurn) {
                case 'l':
                    cart.dir = 'v'
                    break
                case 'r':
                    cart.dir = '^'
                    break
                }
                cart.nextTurn = nextTurn(cart.nextTurn)
                break
            default:
                console.log("Bad state")
                break
            }
            break
        case '>':
            cart.xPos++
            switch (state.track[cart.yPos][cart.xPos]) {
            case '-':
                break
            case '/':
                cart.dir = '^'
                break
            case '\\':
                cart.dir = 'v'
                break
            case '+':
                switch (cart.nextTurn) {
                case 'l':
                    cart.dir = '^'
                    break
                case 'r':
                    cart.dir = 'v'
                    break
                }
                cart.nextTurn = nextTurn(cart.nextTurn)
                break
            default:
                console.log("Bad state")
                break
            }
            break
        case 'v':
            cart.yPos++
            switch (state.track[cart.yPos][cart.xPos]) {
            case '|':
                break
            case '/':
                cart.dir = '<'
                break
            case '\\':
                cart.dir = '>'
                break
            case '+':
                switch (cart.nextTurn) {
                case 'l':
                    cart.dir = '>'
                    break
                case 'r':
                    cart.dir = '<'
                    break
                }
                cart.nextTurn = nextTurn(cart.nextTurn)
                break
            default:
                console.log("Bad state")
                break
            }
            break
        case '^':
            cart.yPos--
            switch (state.track[cart.yPos][cart.xPos]) {
            case '|':
                break
            case '/':
                cart.dir = '>'
                break
            case '\\':
                cart.dir = '<'
                break
            case '+':
                switch (cart.nextTurn) {
                case 'l':
                    cart.dir = '<'
                    break
                case 'r':
                    cart.dir = '>'
                    break
                }
                cart.nextTurn = nextTurn(cart.nextTurn)
                break
            default:
                console.log("Bad state")
                break
            }
            break
        default:
            console.log("Bad direction")
            break
        }

        // Check for collisions
        var collision = false

        for (var cartNo in newCarts) {
            var checkCart = newCarts[cartNo]
            if (checkCart.xPos == cart.xPos && checkCart.yPos == cart.yPos) {
                collision = true
                newCarts = newCarts.filter((elem) => elem.xPos != cart.xPos || elem.yPos != cart.yPos)
                break
            }
        }

        for (var cartNo in state.carts) {
            var checkCart = state.carts[cartNo]
            if (checkCart.xPos == cart.xPos && checkCart.yPos == cart.yPos) {
                collision = true
                state.carts = state.carts.filter((elem) => elem.xPos != cart.xPos || elem.yPos != cart.yPos)
                break
            }
        }

        if (collision) {
            state.collisions.push({x: cart.xPos, y: cart.yPos})
        } else {
            newCarts.push(cart)
        }
    }

    state.carts = newCarts
}

var state = getInput()
state.collisions = []

dumpTrack(state.track)

var tick = 0
while (true) {
    ++tick
    moveCarts()

    for (var collNo in state.collisions) {
        var coll = state.collisions[collNo]
        console.log(`Collision at ${coll.x},${coll.y} during tick ${tick}, ${state.carts.length} carts left`)
    }

    state.collisions = []
    if (state.carts.length == 1) {
        console.log(`Last cart at ${state.carts[0].xPos},${state.carts[0].yPos}`)
        break
    }
}