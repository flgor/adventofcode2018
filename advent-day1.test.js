const fs = require('fs-extra');
const path = require('path');

const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(path.join(__dirname, 'input.txt'))
});

test('adventDay1', () => {
    readChanges().then(changes => {

        let changeSet = new Set();
        let currentChangResult = 0;

        let found = false;
        while (!found) {
            for (let i = 0; i < changes.length; i++) {
                currentChangResult = currentChangResult + changes[i];

                if (changeSet.has(currentChangResult)) {
                    found = true;
                    break;
                }
                changeSet.add(currentChangResult);
            }
        }

        console.log(currentChangResult)
    });

});

readChanges = () => {
    return readFile().then((inputLines) => {
        return inputLines.map(change => {
            if (change.startsWith('-')) {
                return Number(change);
            }

            if (change.startsWith('+')) {
                change.replace('+', '');
                return Number(change);
            }
        })

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




