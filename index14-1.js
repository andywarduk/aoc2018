var improveCountStr = "077201"
var improveCount = parseInt(improveCountStr)

var scores = "37"
var elfPos = [ 0, 1 ]

function dumpScores() {
    var line = ''

    for (var i = 0; i < scores.length; i++) {
        var sep = [ ' ', ' ' ]
        if (i == elfPos[0]) {
            if (elfPos[0] == elfPos[1]) sep = [ '{', '}' ]
            else sep = [ '(', ')' ]
        } else if (i == elfPos[1]) {
            sep = [ '[', ']' ]
        }

        line = `${line}${sep[0]}${scores.substr(i,1)}${sep[1]}`
    }
    console.log(line)
}

//dumpScores()

while (true) {
    // Add last two to create new scores
    var sum = parseInt(scores.substr(elfPos[0],1)) + parseInt(scores.substr(elfPos[1],1))
    if (sum / 10 >= 1) {
        scores += 1
    } 
    scores += sum % 10

    if (scores.length >= improveCount + 10) {
        var answer = ''
        for (var i = 0; i < 10; i++) {
            answer += scores[improveCount + i] 
        }
        console.log(`Part 1 answer: ${answer}`)
        break
    }

    for (j = 0; j < elfPos.length; j++) {
        elfPos[j] = (elfPos[j] + parseInt(scores.substr(elfPos[j], 1)) + 1) % scores.length
    }

    //dumpScores()
}

