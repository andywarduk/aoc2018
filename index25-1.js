/* eslint-disable no-console */
var fs = require('fs')

function getInput() {
    var input = fs.readFileSync('input25.txt').toString().split('\n')

    var points = []
    for (var line of input) {
        if (line != '') {
            var valsStr = line.split(',')
            points.push({
                a: parseInt(valsStr[0]),
                b: parseInt(valsStr[1]),
                c: parseInt(valsStr[2]),
                d: parseInt(valsStr[3])
            })
        }
    }

    return points
}

function dist(p1, p2) {
    return Math.abs(p1.a - p2.a) + Math.abs(p1.b - p2.b) + Math.abs(p1.c - p2.c) + Math.abs(p1.d - p2.d)
}

function main() {
    var points = getInput()

    var groups = []
    for (var point of points) {
        var matchingGroups = []
        for (var groupNo in groups) {
            groupNo = parseInt(groupNo)
            for (var mPoint of groups[groupNo]) {
                if (dist(point, mPoint) <= 3) {
                    matchingGroups.push(groupNo)
                    break
                }
            }
        }
        if (matchingGroups.length == 0) {
            groups.push([point])
        } else {
            var newGroups = groups.filter((elem, elemNo) => {
                return matchingGroups.findIndex((elem2) => elem2 == elemNo) < 0
            })
            var group = [point]
            for (var mergeGroup of matchingGroups) {
                group = group.concat(groups[mergeGroup])
            }
            newGroups.push(group)
            groups = newGroups
        }
    }
    console.log(groups.length)
}

main()
