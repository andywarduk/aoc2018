const fs = require('fs');

const WORKERS = 5
const MINTIME = 60

main()

function main() {
    const stepTree = getInput()

    // Determine which steps can be done now
    const availableSteps = Object.values(stepTree).filter((step) => step.depon.length == 0).map((step) => step.step)

    // Sort alphabetically
    availableSteps.sort()

    // Count how many work units left to do
    let workUnitsLeft = Object.keys(stepTree).length

    // Build worker array
    const workers = buildWorkers()

    // Initialise completed steps array
    const completedSteps = []

    // Initialise time
    let time = 0

    // Loop while work to do
    while (workUnitsLeft > 0) {
        // Allocate work to workers
        for (let worker of workers) {
            if (availableSteps.length == 0) {
                break
            }

            if (worker.curUnit == '.') {
                let unit = availableSteps.shift()
                worker.curUnit = unit
                worker.timeLeft = MINTIME + (unit.charCodeAt(0) - 64)
            }
        }

        // Dump work
        console.log(`Time: ${time}  Workers: ${workers.map(w => w.curUnit).join("")}  Complete: ${completedSteps.join("")}`)

        // Step time
        ++time
        for (let worker of workers) {
            if (worker.curUnit != '.') {
                worker.timeLeft--

                if (worker.timeLeft == 0) {
                    // Finished work unit
                    const unit = worker.curUnit
                    worker.curUnit = '.'
                    workUnitsLeft--
                    completedSteps.push(unit)

                    // Process dependencies looking for units which can now be started
                    let changed = false

                    for (let dep of stepTree[unit].deps) {
                        let depsCompleted = true

                        for (let cmpDep of stepTree[dep].depon) {
                            if (completedSteps.indexOf(cmpDep) == -1) {
                                // Dependency isn't completed yet
                                depsCompleted = false
                                break
                            }
                        }

                        if (depsCompleted) {
                            // Add this one
                            availableSteps.push(dep)
                            changed = true
                        }
                    }

                    if (changed) {
                        availableSteps.sort()
                    }
                }
            }
        }
    }

    console.log(time)
}

function getInput() {
    const lines = fs.readFileSync('input07.txt').toString().split("\n")

    const steps = lines.map(parseStep).filter(step => !!step)

    const stepTree = {}

    for (let step of steps) {
        if (!stepTree[step.b]) {
            stepTree[step.b] = {
                step: step.b,
                depon: [],
                deps: []
            }
        }

        if (!stepTree[step.a]) {
            stepTree[step.a] = {
                step: step.a,
                depon: [],
                deps: []
            }
        }

        stepTree[step.b].depon.push(step.a)
        stepTree[step.a].deps.push(step.b)
    }

    return stepTree
}

function parseStep(line) {
    const regex = /^Step (.) must be finished before step (.) can begin.$/
    const groups = line.match(regex)

    if (groups) {
        return {
            a: groups[1],
            b: groups[2],
        }
    }

    return null
}

function buildWorkers() {
    const workers = []

    for (i = 0; i < WORKERS; i++) {
        workers.push({
            id: i,
            curUnit: '.',
            timeLeft: 0
        })
    }

    return workers
}
