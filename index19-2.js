/* eslint-disable no-console */
var fs = require('fs')

var ops = {
    'setr': setr,
    'eqrr': eqrr,
    'gtri': gtri,
    'muli': muli,
    'eqir': eqir,
    'borr': borr,
    'bori': bori,
    'mulr': mulr,
    'gtrr': gtrr,
    'seti': seti,
    'banr': banr,
    'eqri': eqri,
    'addr': addr,
    'gtir': gtir,
    'addi': addi,
    'bani': bani
}

var ipReg = -1
var reg = [1, 0, 0, 0, 0, 0]

main()

function getInput() {
    var input = fs.readFileSync('input19.txt').toString().split('\n')

    /* var input = [
        '#ip 0',
        'seti 5 0 1',
        'seti 6 0 2',
        'addi 0 1 0',
        'addr 1 2 3',
        'setr 1 0 0',
        'seti 8 0 4',
        'seti 9 0 5'
    ] */

    return input
}

function main() {
    var input = getInput()
    var program = []

    var addr = 0
    for (var line of input) {
        var stat = {}
        if (line.substr(0,1) === '#') {
            stat.directive = true
            stat.addr = addr - 1
        } else {
            stat.directive = false
            stat.addr = addr++
        }
        var lineSplit = line.split(' ')
        stat.instr = lineSplit.shift()
        stat.operands = lineSplit.map((elem) => parseInt(elem))

        if (stat.instr !== '')
            program.push(stat)
    }

    var progElem = 0
    while (progElem >= 0 && progElem < program.length) {
        var curStat = program[progElem]
        if (curStat.directive) {
            switch (curStat.instr) {
            case '#ip':
                ipReg = curStat.operands[0]
                ++progElem
                break
            default:
                // eslint-disable-next-line no-debugger
                debugger
            }
        } else {
            var curAddr = curStat.addr

            if (curAddr == 1) {
                console.log(`Answer is sum of factors of ${reg[1]}`)
                break
            }

            // var traceBefore = `ip=${curAddr} [${reg.join(' ')}] ${curStat.instr} ${curStat.operands.join(' ')}`

            if (ipReg >= 0) reg[ipReg] = curAddr

            ops[curStat.instr](...curStat.operands)

            // console.log(`${traceBefore} [${reg.join(' ')}]`)

            if (ipReg >= 0) {
                if (reg[ipReg] !== curAddr) {
                    progElem = program.findIndex((elem) => elem.addr === reg[ipReg])
                    if (progElem == -1)
                        break
                }
                ++progElem
                ++reg[ipReg]
            }
        }

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
