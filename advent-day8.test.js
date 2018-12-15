const fs = require('fs-extra');
const path = require('path');

test('adventDay81', () => {

    let dataArray = getTreeArray();
    let rootNote = {c: [], h: [], cc: null, hc: null, is: null};

    while (dataArray.length !== 0) {
        let node = findNodeToDecrypt(rootNote);
        constructNode(node, dataArray);
    }

    //expect(sum(rootNote)).toEqual(138);
    expect(moreComplexSum(rootNote)).toEqual(66);
});

let constructNode = (node, dataArray) => {
    if (node.cc === null) {
        node.cc = dataArray.splice(0, 1)[0];
        node.hc = dataArray.splice(0, 1)[0];
        return;
    }

    if (node.cc !== node.c.length) {
        node.c.push({c: [], h: [], cc: null, hc: null, is: null});
        return;
    }

    if (node.hc !== node.h.length) {
        node.h.push(...dataArray.splice(0, node.hc));
        return;
    }
};

let findNodeToDecrypt = (node) => {
    for (let i = 0; i < node.c.length; i++) {
        let nodeToDecrypt = findNodeToDecrypt(node.c[i]);

        if (nodeToDecrypt != null) {
            return nodeToDecrypt;
        }
    }

    if (node.cc === null) {
        return node;
    }

    if (node.cc !== node.c.length) {
        return node;
    }

    if (node.hc !== node.h.length) {
        return node;
    }

    return null;
};


let sum = (node) => {
    let nodeSum = node.h.reduce((acc, h) => acc + h, 0);
    return nodeSum + node.c.reduce((acc, c) => acc + sum(c), 0);
};

let moreComplexSum = (node) => {
    if (node == null) {
        return 0;
    }

    if (node.cc === 0) {
        return node.h.reduce((acc, h) => acc + h, 0);
    }

    return node.h
        .filter(h => h <= node.cc)
        .filter(h => h > 0)
        .reduce((acc, childNodeIdx) => {
            return acc + moreComplexSum(node.c[childNodeIdx - 1])
        }, 0);

    return 0;
};

let getTreeArray = () => {
    return fs.readFileSync(path.join(__dirname, 'input-8.txt')).toString()
        .split(' ')
        .map(n => Number(n))
};




