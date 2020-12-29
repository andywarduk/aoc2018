const fs = require('fs');

main()

function main() {
    const stepTree = getInput()

    // Determine which steps can be done now
    const activeSteps = Object.values(stepTree).filter((step) => step.depon.length == 0).map((step) => step.step)

    // Initialise result order
    const stepOrder = []

    // Loop while work to do
    while (activeSteps.length > 0) {
        // Sort alphabetically
        activeSteps.sort()

        // Get next step
        const nextStep = activeSteps.shift()

        // Add to result order
        stepOrder.push(nextStep)

        // Process dependencies loking for units which can now be started
        for (let dep of stepTree[nextStep].deps) {
            let depsCompleted = true

            for (let cmpDep of stepTree[dep].depon) {
                if (stepOrder.indexOf(cmpDep) == -1) {
                    // Dependency isn't completed yet
                    depsCompleted = false
                    break
                }
            }

            if (depsCompleted) {
                // Add this one
                activeSteps.push(dep)
            }
        }
    }

    console.log(stepOrder.join(""))
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
