const serial = 8868
const dim = 300

var cells = new Array(dim);

for (var y = 0; y < dim; y++) {
    cells[y] = new Array(dim);
    for (var x = 0; x < dim; x++) {
        var rackId = x + 1 + 10
        var power = rackId * (y + 1)
        power += serial
        power *= rackId
        power = Math.trunc((power % 1000) / 100)
        power -= 5
        cells[y][x] = power
    }
}

var maxTotal = -1000
var maxX
var maxY
for (var y1 = 0; y1 < dim - 2; y1++) {
    for (var x1 = 0; x1 < dim - 2; x1++) {
        var total = 0
        for (y2 = 0; y2 < 3; y2++){
            for (x2 = 0; x2 < 3; x2++){
                total += cells[y1 + y2][x1 + x2]
            }
        }
        if (total > maxTotal) {
            maxTotal = total
            maxX = x1
            maxY = y1
        }
    }
}

console.log(`${maxX+1},${maxY+1}`)

var maxTotal = -1000
var maxX
var maxY
var maxDim
for (var dim1 = 1; dim1 < dim; dim1++) {
    for (var y1 = 0; y1 < dim - (dim1 - 1); y1++) {
        for (var x1 = 0; x1 < dim - (dim1 - 1); x1++) {
            var total = 0
            for (y2 = 0; y2 < dim1; y2++){
                for (x2 = 0; x2 < dim1; x2++){
                    total += cells[y1 + y2][x1 + x2]
                }
            }
            if (total > maxTotal) {
                maxTotal = total
                maxX = x1
                maxY = y1
                maxDim = dim1
            }
        }
    }
}

console.log(`${maxX+1},${maxY+1},${maxDim}`)
