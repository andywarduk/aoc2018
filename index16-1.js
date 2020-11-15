var fs = require('fs')

var reg = [0, 0, 0, 0]

main()

function main() {
    var answer = 0
    var input = fs.readFileSync('input16.txt').toString().split("\n")

    for (lineNo in input) {
        lineNo = parseInt(lineNo)
        var line = input[lineNo]
        if (line.substr(0, 6) == 'Before') {
            processSample(parseReg(input[lineNo]), ...parseInstr(input[lineNo + 1]), parseReg(input[lineNo + 2]))
        }
    }

    console.log(answer)

    function parseReg(line) {
        var openPos = line.indexOf('[')
        line = line.substr(openPos + 1)
        var closePos = line.indexOf(']')
        line = line.substr(0, closePos)
        var valStrs = line.split(',')
        return valStrs.map((elem) => parseInt(elem))
    }

    function parseInstr(line) {
        var valStrs = line.split(' ')
        return valStrs.map((elem) => parseInt(elem))
    }

    function processSample(befVals, op, A, B, C, aftVals) {
        var matches = 0
        function test(opFn) {
            reg[0] = befVals[0]
            reg[1] = befVals[1]
            reg[2] = befVals[2]
            reg[3] = befVals[3]

            opFn(A, B, C)

            if (reg[0] == aftVals[0] &&
                reg[1] == aftVals[1] &&
                reg[2] == aftVals[2] &&
                reg[3] == aftVals[3]) {
                    ++matches
            }
        }

        test(addr)
        test(addi)
        test(mulr)
        test(muli)
        test(banr)
        test(bani)
        test(borr)
        test(bori)
        test(setr)
        test(seti)
        test(gtir)
        test(gtri)
        test(gtrr)
        test(eqir)
        test(eqri)
        test(eqrr)

        if (matches >= 3) ++answer
    }
}

function addr(A, B, C) {
    reg[C] = reg[A] + reg[B]
}

function addi(A, B, C) {
    reg[C] = reg[A] + B
}

function mulr(A, B, C) {
    reg[C] = reg[A] * reg[B]
}

function muli(A, B, C) {
    reg[C] = reg[A] * B
}

function banr(A, B, C) {
    reg[C] = reg[A] & reg[B]
}

function bani(A, B, C) {
    reg[C] = reg[A] & B
}

function borr(A, B, C) {
    reg[C] = reg[A] | reg[B]
}

function bori(A, B, C) {
    reg[C] = reg[A] | B
}

function setr(A, B, C) {
    reg[C] = reg[A]
}

function seti(A, B, C) {
    reg[C] = A
}

function gtir(A, B, C) {
    reg[C] = (A > reg[B] ? 1 : 0)
}

function gtri(A, B, C) {
    reg[C] = (reg[A] > B ? 1 : 0)
}

function gtrr(A, B, C) {
    reg[C] = (reg[A] > reg[B] ? 1 : 0)
}

function eqir(A, B, C) {
    reg[C] = (A == reg[B] ? 1 : 0)
}

function eqri(A, B, C) {
    reg[C] = (reg[A] == B ? 1 : 0)
}

function eqrr(A, B, C) {
    reg[C] = (reg[A] == reg[B] ? 1 : 0)
}
