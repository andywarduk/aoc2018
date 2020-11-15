var fs = require('fs')

var ops = {
    0: setr,
    1: eqrr,
    2: gtri,
    3: muli,
    4: eqir,
    5: borr,
    6: bori,
    7: mulr,
    8: gtrr,
    9: seti,
    10: banr,
    11: eqri,
    12: addr,
    13: gtir,
    14: addi,
    15: bani
}

var reg = [0, 0, 0, 0]

main()

function main() {
    var matches = {}
    var input = fs.readFileSync('input16.txt').toString().split("\n")
    var maxLine = 0

    for (lineNo in input) {
        lineNo = parseInt(lineNo)
        var line = input[lineNo]
        if (line.substr(0, 5) == 'After') {
            maxLine = lineNo
        }
    }

    for (lineNo in input) {
        lineNo = parseInt(lineNo)
        if (lineNo > maxLine) {
            var line = input[lineNo]
            if (line.length > 3) {
                var instr = parseInstr(line)
                ops[instr[0]](instr[1], instr[2], instr[3])
            }
        }
    }

    console.log(reg)

    function parseInstr(line) {
        var valStrs = line.split(' ')
        return valStrs.map((elem) => parseInt(elem))
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
