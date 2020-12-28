const fs = require('fs');

const regex = /^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)+$/

main()

function main() {
    const claims = getInput()

    fabric = new Array(1000)
    for (i = 0; i < 1000; i++) {
        fabric[i] = new Array(1000)
    }

    let overlaps = 0
    for (let claim of claims) {
        for (let y = claim.y; y < claim.y + claim.h; y++) {
            for (let x = claim.x; x < claim.x + claim.w; x++) {
                switch (fabric[y][x]) {
                    case undefined:
                        fabric[y][x] = claim.claim
                        break
                    case 'X':
                        break
                    default:
                        ++overlaps
                        fabric[y][x] = 'X'
                        break
                }
            }    
        }
    }

    console.log(`${overlaps} square inches overlap`)

    for (let claim of claims) {
        let overlaps = false

        for (let y = claim.y; !overlaps && y < claim.y + claim.h; y++) {
            for (let x = claim.x; x < claim.x + claim.w; x++) {
                if (fabric[y][x] == 'X') {
                    overlaps = true
                    break
                }
            }    
        }

        if (!overlaps) {
            console.log(`Claim ${claim.claim} does not overlap`)
            break
        }
    }
}

function getInput() {
    const lines = fs.readFileSync('input03.txt').toString().split("\n")

    const claims = lines.map(l => parseLine(l)).filter(e => e != null)

    return claims
}

function parseLine(line) {
    let result = null

    groups = line.match(regex)

    if (groups) {
        result = {
            claim: parseInt(groups[1]),
            x: parseInt(groups[2]),
            y: parseInt(groups[3]),
            w: parseInt(groups[4]),
            h: parseInt(groups[5])
        }
    }

    return result
}