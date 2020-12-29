const fs = require('fs');

main()

function main() {
    const tree = getInput()

    sum = sumTree(tree)

    console.log(sum)
}

function getInput() {
    const line = fs.readFileSync('input08.txt').toString().split("\n")[0]

    const numbers = line.split(" ").map(n => parseInt(n))

    const [_, root] = parseNode(numbers, 0)

    return root
}

function parseNode(numbers, idx) {
    const childNodes = numbers[idx++]
    const metaCount = numbers[idx++]

    const node = {
        childNodes: [],
        meta: []
    }

    for (let i = 0; i < childNodes; i++) {
        const [newIdx, childNode] = parseNode(numbers, idx)
        idx = newIdx
        node.childNodes.push(childNode)
    }

    for (let i = 0; i < metaCount; i++) {
        node.meta.push(numbers[idx++])
    }

    return [idx, node]
}

function sumTree(node) {
    let result = node.meta.reduce((acc, elem) => acc + elem, 0)

    for (child of node.childNodes) {
        result += sumTree(child)
    }

    return result
}
