const fs = require('fs-extra');
const path = require('path');

test('adventDay51', () => {
    let input = fs.readFileSync(path.join(__dirname, 'input-5.txt')).toString();

    let chunkSize = 50;
    let chunkNo = Math.floor(input.length / chunkSize) + 1;

    let result = [...Array(chunkNo).keys()].reduce((acc, c) => {
        let slicedInput = input.slice(chunkSize * c, chunkSize * (c + 1));
        return solveAdventDay51(slicedInput, 0, acc);
    }, '');


    console.log(result.length);
    expect(result).toEqual('dabCBAcaDA');
});

test('adventDay51Bis', () => {
    let input = fs.readFileSync(path.join(__dirname, 'input-5.txt')).toString();


    let result = solveAdventDay51Bis(input);
    console.log(result.length);
    expect(result).toEqual('dabCBAcaDA');
});

test('adventDay52', () => {
    let input = fs.readFileSync(path.join(__dirname, 'input-5.txt')).toString();


    let reducedPolymersVariants = ['a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z']
        .reduce((acc, c) => {
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
            let reducedInput = input.replace(new RegExp(c, 'gi'), '');
            acc[c] = solveAdventDay51Bis(reducedInput).length;

            return acc;
        }, {});

    console.log(reducedPolymersVariants);
});

let solveAdventDay51 = (input, position, currentResult) => {
    if (position === input.length) {
        return currentResult;
    }

    let lastResultChar = '';

    if (currentResult.length > 0) {
        lastResultChar = currentResult.slice(-1);
    }

    let inputChar = input.charAt(position);

    let newResult;
    if (react(lastResultChar, inputChar)) {
        newResult = currentResult.slice(0, -1);
    } else {
        newResult = `${currentResult}${inputChar}`;
    }

    return solveAdventDay51(input, ++position, newResult);
};

let solveAdventDay51Bis = (input) => {


    let result = input;
    let resultLength;

    while (result.length !== resultLength) {
        resultLength = result.length;
        result = reactPolymers(result);
    }

    return result;
};

reactPolymers = (input) => {
    return [
        'aA', 'Aa',
        'bB', 'Bb',
        'cC', 'Cc',
        'dD', 'Dd',
        'eE', 'Ee',
        'fF', 'Ff',
        'gG', 'Gg',
        'hH', 'Hh',
        'iI', 'Ii',
        'jJ', 'Jj',
        'kK', 'Kk',
        'lL', 'Ll',
        'mM', 'Mm',
        'nN', 'Nn',
        'oO', 'Oo',
        'pP', 'Pp',
        'qQ', 'Qq',
        'rR', 'Rr',
        'sS', 'Ss',
        'tT', 'Tt',
        'uU', 'Uu',
        'vV', 'Vv',
        'wW', 'Ww',
        'xX', 'Xx',
        'yY', 'Yy',
        'zZ', 'Zz'
    ].reduce((acc, c) => {
        return acc.replace(c, '');
    }, input)

};

react = (char1, char2) => {
    return Math.abs(char1.charCodeAt(0) - char2.charCodeAt(0)) === 32;
};







