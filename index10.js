var fs = require('fs');
var PNG = require('pngjs').PNG

var points = getInput()
Promise.all([process(points)])

function getInput() {
    var input = fs.readFileSync('input10.txt').toString().split("\n")

    return input.map((elem) => {
        if (elem === "") return null
        var split1 = elem.split("<")
        var coords = split1[1].split(">")[0].split(",")
        var vel = split1[2].split(">")[0].split(",")
        var x = parseInt(coords[0])
        var y = parseInt(coords[1])
        var dx = parseInt(vel[0])
        var dy = parseInt(vel[1])

        return {
            x, y,
            dx, dy
        }
    }).filter((x) => x !== null)
}

async function process(points) {
    var time = 0
    var pics = 0
    while (true){
        ++time
        points = points.map((elem) => {
            return {
                ...elem,
                x: elem.x + elem.dx,
                y: elem.y + elem.dy
            }
        })

        var maxX = 0
        var maxY = 0
        var minX = 0
        var minY = 0
        var allPositive = true
        for (pn in points) {
            var p = points[pn]
            if (p.x < 0 || p.y < 0) {
                allPositive = false
                break
            }
            minX = (minX === 0 ? p.x + 1 : Math.min(minX, p.x + 1))
            minY = (minY === 0 ? p.y + 1 : Math.min(minY, p.y + 1))
            maxX = (maxX === 0 ? p.x + 1 : Math.max(maxX, p.x + 1))
            maxY = (maxY === 0 ? p.y + 1 : Math.max(maxY, p.y + 1))
        }

        if (allPositive) {
            console.log(`time: ${time}, maxX: ${maxX}, maxY: ${maxY}`)

            var png = new PNG({
                width: (maxX - minX) + 1,
                height: (maxY - minY) + 1
            });

            for (pn in points) {
                var p = points[pn]

                var idx = (png.width * (p.y - minY + 1) + (p.x - minX + 1)) << 2
                png.data[idx  ] = 0
                png.data[idx+1] = 0
                png.data[idx+2] = 0
                png.data[idx+3] = 255
            }
            
            await new Promise((resolve, reject) => {
                var outStream = fs.createWriteStream(`output10-${time}.png`)
                outStream.on('finish', () => {
                    resolve();
                });

                var pipe = png.pack().pipe(outStream);
                pipe.on('error', (err) => {
                    reject(err);
                });
            });

            if (++pics == 50) break
        }
        else {
            if (pics > 0) break
        }
    }
}
