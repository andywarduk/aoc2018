/* eslint-disable no-console */
const fs = require('fs')

function getInput() {
    const input = fs.readFileSync('input23.txt').toString().split('\n')

    return input
}

function main() {
    const input = getInput()

    const bots = []

    for (var line of input) {
        const sline = line.split('=')
        if (line !== '') {
            const bot = {}
            bot.r = parseInt(sline[2])
            const sline2 = sline[1].split(',')
            bot.x = parseInt(sline2[0].substr(1))
            bot.y = parseInt(sline2[1])
            bot.z = parseInt(sline2[2])
            bots.push(bot)
        }
    }

    console.log('(declare-const x Int)')
    console.log('(declare-const y Int)')
    console.log('(declare-const z Int)')
    console.log('')
    console.log('(define-fun abs ((v Int)) Int (ite (> v 0) v (- v)))')
    console.log('')
    console.log('(define-fun dist ((x1 Int) (y1 Int) (z1 Int) (x2 Int) (y2 Int) (z2 Int)) Int')
    console.log(' (+ (abs (- x2 x1))')
    console.log('    (abs (- y2 y1))')
    console.log('    (abs (- z2 z1))))')
    console.log('')
    console.log('(define-fun inrange ((x Int) (y Int) (z Int)) Int')
    console.log(' (+')
    for (bot of bots) {
        console.log(`  (if (<= (dist x y z ${bot.x} ${bot.y} ${bot.z}) ${bot.r}) 1 0)`)
    }
    console.log('  ))')
    console.log('')
    console.log('(maximize (inrange x y z))')
    console.log('(minimize (dist 0 0 0 x y z))')
    console.log('(check-sat)')
    console.log('(get-objectives)')
    console.log('(get-model)')
    console.log('(eval (dist 0 0 0 x y z))')
}

main()
