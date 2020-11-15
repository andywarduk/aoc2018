var initState="#...####.##..####..#.##....##...###.##.#..######..#..#..###..##.#.###.#####.##.#.#.#.##....#..#..#.."

var rules = [
    ["...##","."],
    ["...#.","#"],
    ["....#","."],
    ["###.#","#"],
    [".....","."],
    ["..#..","."],
    ["#.#.#","."],
    ["#..#.","."],
    ["#...#","."],
    ["##...","."],
    [".#.#.","#"],
    [".#..#","."],
    [".###.","."],
    ["#..##","#"],
    ["..#.#","#"],
    [".####","#"],
    ["##..#","#"],
    ["##.#.","#"],
    [".#...","#"],
    ["#.#..","."],
    ["#####","."],
    ["###..","#"],
    [".##.#","."],
    ["#.##.","."],
    ["..###","."],
    [".#.##","#"],
    ["..##.","#"],
    ["#.###","."],
    [".##..","#"],
    ["##.##","."],
    ["#....","."],
    ["####.","#"]
]

/*
var initState = "#..#.#..##......###...###"

var rules = [
    ["...##","#"],
    ["..#..","#"],
    [".#...","#"],
    [".#.#.","#"],
    [".#.##","#"],
    [".##..","#"],
    [".####","#"],
    ["#.#.#","#"],
    ["#.###","#"],
    ["##.#.","#"],
    ["##.##","#"],
    ["###..","#"],
    ["###.#","#"],
    ["####.","#"],
]
*/

var preamble=10
var state=''
for(var i=0;i<preamble;i++) state+='.'
state+=initState
for(var i=0;i<preamble;i++) state+='.'

var lastScore=0

for (var g = 0; g < 1000; g++){
    var newState = ".."
    for (p = 0; p < state.length - 4; p++) {
        var match = state.substr(p, 5)
        var found = false
        for (m = 0; m < rules.length; m++) {
            if (rules[m][0] === match) {
                newState += rules[m][1]
                found = true
                break
            }
        }
        if (!found) newState += '.'
    }
    state = newState

    if (state.substr(0,5).indexOf("#") >= 0){
        preamble += 10
        var saveState = state
        var state = ''
        for(var i = 0; i < 10; i++) state += '.'
        state += saveState
    }
    if (state.substr(state.length - 5,5).indexOf("#") >= 0) {
        for(var i = 0;i < 10; i++) state += '.'
    }

    console.log(state)
    var thisScore = score()
    console.log(`g ${g + 1} score ${thisScore} diff ${thisScore - lastScore}`)
    lastScore = thisScore
}

function score() {
    var score = 0
    for (p = 0; p < state.length; p++) {
        if(state.substr(p,1) === '#'){
            score += p - preamble
        }
    }
    return score
}

console.log(score())

console.log(13480 + ((50000000000 - 150) * 80))