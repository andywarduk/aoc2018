const fs = require('fs');

main()

function main() {
    const lines = getInput()

    for (let i = 0; i < lines.length; i++) {
        for (let j = i + 1; j < lines.length; j++) {
            if (dist(lines[i], lines[j]) == 1) {
                console.log(`${lines[i]} and ${lines[j]} differ by 1`)
                printCommon(lines[i], lines[j])
                break
            }
        }
    }
}

function getInput() {
    return fs.readFileSync('input02.txt').toString().split("\n").filter(l => l != "")
}

function dist(str1, str2) {
    let dist = 0

    for (let i = 0; i < str1.length; i++) {
        if (str1[i] != str2[i]) {
            dist++
        }
    }

    console.log()

    return dist
}

function printCommon(str1, str2) {
    let result = ""
    for (i = 0; i < str1.length; i++) {
        if (str1[i] == str2[i]) result += str1[i];
    }
    console.log(result)
}
