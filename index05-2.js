const fs = require('fs');

main()

function main() {
    const elements = getInput()

    const elemSet = new Set(elements.map(e => e.toLowerCase()))

    let minLength = Number.MAX_SAFE_INTEGER;
    for (elem of elemSet) {
        let length = getPolymerLength(elements.filter(e => e.toLowerCase() != elem))

        console.log(`Length without ${elem} is ${length}`)

        if (length < minLength) {
            minLength = length
        }
    }

    console.log(`Shortest: ${minLength}`)
}

function getInput() {
    const chars = fs.readFileSync('input05.txt').toString().split("\n")[0].split("")

    return chars
}

function getPolymerLength(elements) {
    while (reducePolymer(elements));

    return elements.length
}

function reducePolymer(elements) {
    let changed = false

    for (let i = elements.length - 2; i >= 0; i--) {
        let remove = false

        if (elements[i + 1] == elements[i + 1].toUpperCase()) {
            if (elements[i].toUpperCase() == elements[i + 1] && elements[i] == elements[i].toLowerCase()) {
                remove = true
            }
        } else {
            if (elements[i].toLowerCase() == elements[i + 1] && elements[i] == elements[i].toUpperCase()) {
                remove = true
            }
        }

        if (remove) {
            changed = true
            elements.splice(i, 2)
            i--
        }
    }

    return changed
}