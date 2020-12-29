const fs = require('fs');

// eg [1518-06-02 23:58] Guard #179 begins shift
const regex = /^\[(\d+)-(\d+)-(\d+) (\d+):(\d+)\] (.*)$/

main()

function main() {
    const log = getInput()

    const guardData = {}
    let curGuard = null
    let asleepTime = null

    for (let entry of log) {
        const msg = entry.msg

        if (msg.startsWith("Guard #")) {
            if (asleepTime && curGuard) {
                logAsleep(guardData, curGuard, asleepTime, entry.date)
                asleepTime = null
            }
            curGuard = parseInt(msg.substr(7))
        } else {
            switch(msg) {
                case "falls asleep":
                    asleepTime = entry.date
                    break
                case "wakes up":
                    logAsleep(guardData, curGuard, asleepTime, entry.date)
                    asleepTime = null
                    break
                default:
                    debugger
            }
        }
    }

    for (guard of Object.values(guardData)) {
        calcMostAsleepMinute(guard)
    }

    const mostAsleep = Object.values(guardData).reduce((acc, guard) => {
        if (guard.mostAsleepMinute.maxCount > acc.maxCount) {
            acc.maxCount = guard.mostAsleepMinute.maxCount
            acc.guard = guard.guard
        }
        return acc
    }, {
        guard: 0,
        maxCount: 0
    })

    console.log(`Guard ${mostAsleep.guard} was asleep most at minute ${guardData[mostAsleep.guard].mostAsleepMinute.min} (${mostAsleep.maxCount} times)`)
    console.log(`Answer: ${mostAsleep.guard * guardData[mostAsleep.guard].mostAsleepMinute.min}`)
}

function logAsleep(guardData, guard, asleepTime, wakeTime) {
    if (guardData[guard] == undefined) {
        guardData[guard] = {
            guard,
            asleepTime: 0,
            periods: []
        }
    }

    const sleepMs = wakeTime - asleepTime
    guardData[guard].asleepTime += (sleepMs / 1000) / 60
    guardData[guard].periods.push({
        wakeTime,
        asleepTime
    })
}

function calcMostAsleepMinute(guard) {
    const dayMinutes = new Array(24 * 60).fill(0)

    for (period of guard.periods) {
        for (millis = period.asleepTime; millis < period.wakeTime; millis += 60 * 1000) {
            const milliDate = new Date(millis)
            dayMinutes[(milliDate.getUTCHours() * 60) + milliDate.getUTCMinutes()]++
        }
    }

    const mostAsleepMinute = dayMinutes.reduce((acc, count, min) => {
        if (count > acc.maxCount) {
            acc.min = min
            acc.maxCount = count
        }
        return acc
    }, {
        min: 0,
        maxCount: 0
    })

    guard.mostAsleepMinute = mostAsleepMinute
}

function getInput() {
    const lines = fs.readFileSync('input04.txt').toString().split("\n")

    const log = lines.map(l => parseLogLine(l)).filter(e => e != null)

    log.sort((a, b) => a.date - b.date)

    return log
}

function parseLogLine(line) {
    let result = null

    groups = line.match(regex)

    if (groups) {
        result = {
            yr: groups[1],
            mo: groups[2],
            dy: groups[3],
            hr: groups[4],
            mi: groups[5],
            msg: groups[6]
        }

        result.date = Date.parse(`${result.yr}-${result.mo}-${result.dy}T${result.hr}:${result.mi}:00.000Z`)
    }

    return result
}