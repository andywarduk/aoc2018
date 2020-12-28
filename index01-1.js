const fs = require('fs');

main()

function main() {
    const freqs = getInput()

    const result = freqs.reduce((acc, elem) => acc + elem, 0)
    
    console.log(result)    
}

function getInput() {
    var input = fs.readFileSync('input01.txt').toString().split("\n")

    return input.filter((elem) => elem != "").map((elem) => parseInt(elem))
}
