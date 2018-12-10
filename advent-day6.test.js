const fs = require('fs-extra');
const path = require('path');

const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(path.join(__dirname, 'input-6.txt'))
});

test('adventDay61', () => {
    readCoordinates().then(coordinates => {

        console.log(coordinates);

        let maxX = findMaxCoordinate(coordinates, 'x');
        let maxY = findMaxCoordinate(coordinates, 'y');
        let max = Math.max(maxX, maxY) + 1;

        let matrix = [...Array(max).keys()].map(_ => Array(max).fill('.'));

        // populate matrix with coordinates
        coordinates.reduce((acc, c) => {
            //acc[c.x][c.y] = `${c.point}C`;
            acc[c.x][c.y] = c.point;
            return acc;
        }, matrix);

        // populate the rest of the matrix
        for (let i = 0; i < max; i++) {
            for (let j = 0; j < max; j++)
                if (matrix[i][j] === '.') {
                    matrix[i][j] = findClosestPointFrom({x: i, y: j}, coordinates);
                }
        }

        // for (let i = 0; i < max; i++) {
        //     console.log(matrix[i]);
        // }

        let excludedPoints = new Set();

        for (let i = 0; i < max; i++) {
            for (let j = 0; j < max; j++)
                if (i === 0 || j === 0 || i === max - 1 || j === max - 1) {
                    excludedPoints.add(matrix[i][j]);
                }
        }


        coordinates
            .forEach(c => {
                c.pointCount = 0;
                if (!excludedPoints.has(c.point)) {
                    c.pointCount = countPointInMatrix(c.point, matrix, max);
                }
            });

        coordinates
            .sort((c1, c2) => {
                let count1 = c1.pointCount;
                let count2 = c2.pointCount;
                if (count1 === count2) {
                    return 0;
                }

                return count1 > count2 ? -1 : 1;
            });


        console.log(coordinates);
    });
});

test('adventDay62', () => {
    readCoordinates().then(coordinates => {

        console.log(coordinates);

        let maxX = findMaxCoordinate(coordinates, 'x');
        let maxY = findMaxCoordinate(coordinates, 'y');
        let max = Math.max(maxX, maxY) + 1;

        let matrix = [...Array(max).keys()]
            .map(_ => [...Array(max).keys()]
                .map(_ => {
                    return {point: '.'}
                }));

        // populate matrix with coordinates
        coordinates.reduce((acc, c) => {
            //acc[c.x][c.y] = `${c.point}C`;
            acc[c.x][c.y].point = c.point;
            acc[c.x][c.y].distanceSum = distanceSumForPoint(c, coordinates);
            return acc;
        }, matrix);

        // populate the rest of the matrix
        for (let i = 0; i < max; i++)
            for (let j = 0; j < max; j++)
                if (matrix[i][j].point === '.') {
                    matrix[i][j].point = findClosestPointFrom({x: i, y: j}, coordinates);
                    matrix[i][j].distanceSum = distanceSumForPoint({x: i, y: j}, coordinates)
                }

        let result = 0;
        for (let i = 0; i < max; i++)
            for (let j = 0; j < max; j++) {
                if (matrix[i][j].distanceSum < 10000) {
                    result++;
                }
            }

        console.log(result);

    });
});

let findMaxCoordinate = (coordinates, objProp) => {
    return coordinates.reduce((acc, c) => {
        return c[objProp] > acc ? c[objProp] : acc;
    }, 0)
};

readCoordinates = () => {
    return readFile().then((inputLines) => {
        return [...inputLines.keys()].map(key => {
            let line = inputLines[key];
            return {
                point: key,
                x: Number(line.split(',')[0]),
                y: Number(line.split(',')[1])
            }
        });
    });
};

readFile = () => {
    return new Promise(resolve => {
        let inputLines = [];
        lineReader
            .on('line', (line) => {
                inputLines.push(line);
            })
            .on('close', () => {
                resolve(inputLines);
            });
    })
};

let findClosestPointFrom = (mPoint, coordinates) => {
    let distanceForEachCoordinate = coordinates
        .reduce((acc, c) => {
            acc[c.point] = taxicabDistance(mPoint, c);
            return acc;
        }, {});

    coordinates.sort((c1, c2) => {
        let d1 = distanceForEachCoordinate[c1.point];
        let d2 = distanceForEachCoordinate[c2.point];
        if (d1 === d2) {
            return 0;
        }

        return d1 > d2 ? 1 : -1;
    });

    let d1 = distanceForEachCoordinate[coordinates[0].point];
    let d2 = distanceForEachCoordinate[coordinates[1].point];

    if (d1 === d2) {
        // multiple coordinates are closest to point
        // and not zero (not the point)
        return '.';
    }

    return coordinates[0].point;
};

let distanceSumForPoint = (mPoint, coordinates) => {
    return coordinates.reduce((acc, c) => {
        return acc + taxicabDistance(mPoint, c);
    }, 0);
};

let taxicabDistance = (a = {x: 0, y: 0}, b = {x: 0, y: 0}) => {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

let countPointInMatrix = (point, matrix, max) => {
    let result = 0;
    for (let i = 0; i < max; i++) {
        for (let j = 0; j < max; j++)
            if (matrix[i][j] === point) {
                result++;
            }
    }
    return result;
};

/*
x,y
1, 1
1, 6
8, 3
3, 4
5, 5
8, 9

..........----x->
.A........
..........
........C.
...D......
.....E....
.B........
..........
..........
........F.
|
|
|
y
|
V

 */




