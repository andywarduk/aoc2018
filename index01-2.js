const fs = require('fs');
const { mainModule } = require('process');

main()

function main() {
    const freqs = getInput()

    let seenFreqs = {}

    let freq = 0
    let finished = false
    while (!finished) {
        for (f of freqs) {
            freq += f

            if (seenFreqs[freq] === undefined) {
                seenFreqs[freq] = true
            } else {
                console.log(`Frequency ${freq} reached twice`)
                finished = true
                break
            }
        }
    }
}

function getInput() {
    var input = fs.readFileSync('input01.txt').toString().split("\n")

    return input.filter((elem) => elem != "").map((elem) => parseInt(elem))
}
