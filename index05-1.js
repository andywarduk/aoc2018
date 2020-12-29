const fs = require('fs');

main()

function main() {
    const elements = getInput()

    while (reducePolymer(elements));

    console.log(elements.length)
}

function getInput() {
    const chars = fs.readFileSync('input05.txt').toString().split("\n")[0].split("")

    return chars
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