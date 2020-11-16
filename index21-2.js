/* eslint-disable no-console */
var fs = require('fs')

// 0 - loop 18-25

// #ip 2                    set ip to reg 2
//  0 seti 123 0 1          reg[1] = 0x7b
//  1 bani 1 456 1          reg[1] &= 0x1c8 (0x48) <------------\
//  2 eqri 1 72 1           reg[1] = (reg[1] == 0x48 ? 1 : 0)   |
//  3 addr 1 2 2            reg[2] += reg[1] (jmp)              |
//  4 seti 0 0 2            reg[2] = 0 (jmp) >------------------/
//  5 seti 0 4 1            reg[1] = 0
//  6 bori 1 65536 3        reg[3] = reg[1] | 0x10000 <---------------------\   0 or 65536
//  7 seti 10905776 4 1     reg[1] = 0xA668B0                               |   
//  8 bani 3 255 4          reg[4] = reg[3] & 0xff <--------------------\   |   
//  9 addr 1 4 1            reg[1] += reg[4]                            |   |
// 10 bani 1 16777215 1     reg[1] &= 0xFFFFFF                          |   |
// 11 muli 1 65899 1        reg[1] *= 0x1016B                           |   |   (prime)
// 12 bani 1 16777215 1     reg[1] &= 0xFFFFFF                          |   |
// 13 gtir 256 3 4          reg[4] = (0xff > reg[3] ? 1 : 0)            |   |   -\
// 14 addr 4 2 2            reg[2] += reg[4] (jmp)                      |   |   -- reg[3] <= 0xff? jmp to 28
// 15 addi 2 1 2            reg[2]++ (jmp) >---\                        |   |
// 16 seti 27 1 2           reg[2] = 27 (jmp)  |                        |   |   jump out to halt test
// 17 seti 0 6 4            reg[4] = 0 <-------/                        |   |
// 18 addi 4 1 5            reg[5] = reg[4] + 1 <---------------\       |   |
// 19 muli 5 256 5          reg[5] *= 0x100                     |       |   |
// 20 gtrr 5 3 5            reg[5] = (reg[5] > reg[3] ? 1 : 0)  |       |   |
// 21 addr 5 2 2            reg[2] += reg[5] (jmp)              |       |   |
// 22 addi 2 1 2            reg[2]++ (jmp)                      |       |   |
// 23 seti 25 1 2           reg[2] = 25 (jmp) ------------------|----\  |   |
// 24 addi 4 1 4            reg[4]++                            |    |  |   |
// 25 seti 17 9 2           reg[2] = 17 (jmp) >-----------------/ <--/  |   |
// 26 setr 4 7 3            reg[3] = reg[4]                             |   |
// 27 seti 7 4 2            reg[2] = 7 (jmp) >--------------------------/   |
// 28 eqrr 1 0 4            reg[4] = (reg[1] == reg[0] ? 1 : 0)             |   -\
// 29 addr 4 2 2            reg[2] += reg[4] (jmp)                          |   -- (halt if reg[1]=reg[0])
// 30 seti 5 1 2            reg[2] = 5 (jmp) >------------------------------/


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
var reg = [0, 0, 0, 0, 0, 0]

var trace = false

main()

function getInput() {
    var input = fs.readFileSync('input21.txt').toString().split('\n')

    return input
}

function main() {
    var input = getInput()
    var program = []
    var numbers = []
    var last

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

            if (trace)
                var traceBefore = `ip=${curAddr} [${reg.join(' ')}] ${curStat.instr} ${curStat.operands.join(' ')}`

            if (ipReg >= 0) reg[ipReg] = curAddr

            if (curAddr === 28) {
                if (numbers[reg[1]] !== undefined) {
                    console.log(last)
                    break
                }
                last = reg[1]
                numbers[reg[1]] = true
            }
    
            ops[curStat.instr](...curStat.operands)

            if (trace)
                console.log(`${traceBefore} [${reg.join(' ')}]`)

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
