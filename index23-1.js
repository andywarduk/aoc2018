/* eslint-disable no-console */
const fs = require('fs')

function getInput() {
    const input = fs.readFileSync('input23.txt').toString().split('\n')

    return input
}

function manhattanDist(src, dst) {
    return Math.abs(src.x - dst.x) + Math.abs(src.y - dst.y) + Math.abs(src.z - dst.z)
}

function main() {
    const input = getInput()

    const bots = []

    for (let line of input) {
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

    let largestBot = null
    let largestR = 0

    for (bot of bots) {
        if (bot.r > largestR) {
            largestR = bot.r
            largestBot = bot
        }
    }

    console.log("Bot with largest radius is:", largestBot)

    let inRange = 0
    for (bot of bots) {
        if (manhattanDist(bot, largestBot) <= largestR) {
            ++inRange
        }
    }

    console.log(`Bots in range ${inRange}`)
}

main()
