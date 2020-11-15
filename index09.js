"use strict";

//play(9, 25)
//play(10, 1618)
//play(13, 7999)
//play(17, 1104)
//play(21, 6111)
//play(30, 5807)
play(448, 71628)
play(448, 71628*100)

function play(players, highMarble) {
    var curMarble = null
    var score = new Array(players)
    for(var loop = 0; loop < players; loop++) score[loop] = 0

    var curGo = 0
    var curPlayer = 1

    // Place marble 0
    curMarble = { marble: 0 }
    curMarble.next = curMarble
    curMarble.prev = curMarble

    var zeroMarble = curMarble

    while (++curGo <= highMarble) {
        if (curGo % 23 === 0) {
            scoreGo(curPlayer, curGo)
        } else {
            placeMarble(curGo)
        }
        // dump()

        curPlayer++
        if (curPlayer > players) curPlayer = 1
    }

    var maxScore = 0
    for (var loop = 0; loop < players; loop++){
        console.log(`${loop+1} : ${score[loop]}`)
        maxScore = Math.max(maxScore, score[loop])
    }
    console.log(`${players} players, max marble ${highMarble}, max score: ${maxScore}`)

    function dump() {
        var output;
        var dumpMarble;

        output = `[${curPlayer}]`
        dumpMarble = zeroMarble
        do {
            if (dumpMarble === curMarble) output += ` (${dumpMarble.marble})`
            else output += ` ${dumpMarble.marble}`
            dumpMarble = dumpMarble.next
        } while (dumpMarble != zeroMarble)

        console.log(output)
    }

    function placeMarble(marbleNo) {
        var insPoint1 = curMarble.next
        var insPoint2 = insPoint1.next

        var newMarble = { 
            marble: marbleNo,
            next: insPoint2,
            prev: insPoint1
        }

        insPoint1.next = newMarble
        insPoint2.prev = newMarble

        curMarble = newMarble
    }

    function scoreGo(player, marbleNo)
    {
        var rmMarble = curMarble
        for(var loop = 0; loop < 7; loop++) rmMarble = rmMarble.prev 

        score[player - 1] += marbleNo + rmMarble.marble

        rmMarble.prev.next = rmMarble.next
        rmMarble.next.prev = rmMarble.prev

        curMarble = rmMarble.next
    }
}
