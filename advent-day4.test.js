const fs = require('fs-extra');
const path = require('path');

const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(path.join(__dirname, 'input-4.txt'))
});

test('adventDay4', () => {
    readTimestamps().then(timestamps => {

        let analysedGuardTimes = timestamps.reduce((acc, ts) => {

            if (ts.hasOwnProperty('guard')) {
                let guardTimes = acc[ts.guard];

                if (guardTimes == null) {
                    acc[ts.guard] = {
                        midnightMinutes: Array(60).fill(0),
                        totalTime: 0,
                        mostFrequentMinute: 0,
                        mostSameMinute: 0
                    }
                }
                acc.ltstGuard = ts.guard;
            }

            if (ts.hasOwnProperty('start')) {
                acc.ltstStart = ts.start;
            }

            if (ts.hasOwnProperty('end')) {
                let start = acc.ltstStart;
                let end = ts.end;

                [...Array(end - start).keys()]
                    .map(idx => {
                        return idx + start;
                    })
                    .forEach(idx => {
                        acc[acc.ltstGuard].midnightMinutes[idx] = ++acc[acc.ltstGuard].midnightMinutes[idx];
                        acc[acc.ltstGuard].totalTime = ++acc[acc.ltstGuard].totalTime;

                        if (acc[acc.ltstGuard].mostSameMinute < acc[acc.ltstGuard].midnightMinutes[idx]) {
                            acc[acc.ltstGuard].mostSameMinute = acc[acc.ltstGuard].midnightMinutes[idx];
                            acc[acc.ltstGuard].mostFrequentMinute = idx;
                        }
                    });
            }
            return acc;

        }, {});


        let solution1GuardWithMinutes = Object
            .keys(analysedGuardTimes)
            .filter(key => !['ltstStart', 'ltstGuard'].includes(key))
            .reduce((acc, c) => {
                acc.push({
                    guardId: parseInt(c.substring(1, c.length)),
                    midnightMinutes: analysedGuardTimes[c].midnightMinutes,
                    totalTime: analysedGuardTimes[c].totalTime,
                    mostFrequentMinute: analysedGuardTimes[c].mostFrequentMinute
                });
                return acc;
            }, Array(0))
            .filter(agt => agt.totalTime !== 0)
            .sort((ag1, ag2) => {
                if (ag1.totalTime === ag2.totalTime) {
                    return 0
                }
                return ag1.totalTime > ag2.totalTime ? -1 : 1;
            })
            [0];

        let mostSleptMinute = solution1GuardWithMinutes.midnightMinutes.indexOf(Math.max(...solution1GuardWithMinutes.midnightMinutes));
        console.log('solution 1', solution1GuardWithMinutes.guardId * mostSleptMinute);

        let solution2GuardWithMinutes = Object
            .keys(analysedGuardTimes)
            .filter(key => !['ltstStart', 'ltstGuard'].includes(key))
            .reduce((acc, c) => {
                acc.push({
                    guardId: parseInt(c.substring(1, c.length)),
                    mostFrequentMinute: analysedGuardTimes[c].mostFrequentMinute,
                    mostSameMinute: analysedGuardTimes[c].mostSameMinute
                });
                return acc;
            }, Array(0))
            .filter(agt => agt.mostSameMinute !== 0)
            .sort((ag1, ag2) => {
                if (ag1.mostSameMinute === ag2.mostSameMinute) {
                    return 0
                }
                return ag1.mostSameMinute > ag2.mostSameMinute ? -1 : 1;
            })
            [0];
        console.log('solution 2', solution2GuardWithMinutes.guardId * solution2GuardWithMinutes.mostFrequentMinute);
    });
});
readTimestamps = () => {
    return readFile().then((inputLines) => {
        return inputLines
            .sort()
            .map(line => {
                return {
                    line: line,
                }
            })
            .map(e => {
                if (e.line.includes('Guard')) {
                    return {
                        ...e,
                        guard: e.line.split(' Guard ')[1].split(' begins')[0]
                    }
                }

                if (e.line.includes('falls asleep')) {
                    // [1518-11-01 00:05] falls asleep
                    return {
                        ...e,
                        start: Number(readSeconds(e.line)),
                        date: readDay(e.line)
                    }
                }

                if (e.line.includes('wakes up')) {
                    return {
                        ...e,
                        end: Number(readSeconds(e.line)),
                        date: readDay(e.line)
                    }
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

test('testReadLine', () => {

    let actualSeconds = readSeconds("[1518-11-01 00:05] falls asleep");
    expect(actualSeconds).toEqual('05');

});

readSeconds = (line) => {
    //   "line": "[1518-11-01 00:05] falls asleep"
    return /(\[\d{4}-\d{2}-\d{2} \d{2}:)(\d\d)(\] .*)/g.exec(line)[2];
};

readDay = (line) => {
    //   "line": "[1518-11-01 00:05] falls asleep"
    return /\[(\d{4}-\d{2}-\d{2}).*/g.exec(line)[1];
};




