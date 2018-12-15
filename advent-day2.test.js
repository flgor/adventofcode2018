const fs = require('fs-extra');
const path = require('path');

test('adventDay1', () => {
	
	let inputPath = path.join(__dirname, 'input.txt');
	let inputData = fs.readFileSync(inputPath);
	let inputArray = JSON.parse(inputData);

	let fqvSet = new Set([0]);
	let result = inputArray.reduce((acc, c) => {
		acc = acc + c;

		if (fqvSet.has(acc)) {
			console.log(acc);
		}
		fqvSet.add(acc);

		return acc;

	}, 0);
	
	console.log(result);
	
});

test('adventDay2', () => {
	
	let inputPath = path.join(__dirname, 'input2.txt');
	let inputData = fs.readFileSync(inputPath);
	let inputArray = JSON.parse(inputData);
	
	let result = inputArray
		.map(word => mapWord(word))
		.map(wordMap => mapToTwoAndThreeCharCount(wordMap))
		.reduce((acc, c) => {
			if (c.twoChars) {
				acc.two = ++acc.two;
			}
			
			if (c.threeChars) {
				acc.three = ++acc.three;
			}
			
			return acc;
		}, {two: 0, three: 0});
	
	console.log(result.three * result.two);
	
});

test('mapWord', () => {
	
	let result = mapWord('bababc');
	console.log(result);
	
	expect(result['b']).toEqual(3);
	expect(result['a']).toEqual(2);
	expect(result['c']).toEqual(1);
});

test('mapToTwoAndThreeCharCount', () => {
	
	let input = {
		'b': 2,
		'a': 2,
		'c': 1
	};
	
	expect(mapToTwoAndThreeCharCount(input).threeChars).toEqual(false);
	expect(mapToTwoAndThreeCharCount(input).twoChars).toEqual(true);
});


hasSameTypeCharCount = (wordMap, count) => {
	return Object.keys(wordMap).reduce((acc, c) => {
		if (acc === true) {
			return true;
		}
		
		return wordMap[c] === count;
		
	}, false)
};

mapToTwoAndThreeCharCount = (wordMap) => {
	return {
		twoChars: hasSameTypeCharCount(wordMap, 2),
		threeChars: hasSameTypeCharCount(wordMap, 3)
	}
};

mapWord = (word) => {
	return [...word]
		.reduce((acc, c) => {
			if (typeof acc !== 'object') {
				let acv = {};
				acv[acc] = 1;
				
				acc = acv;
			}
			
			if (acc[c] == null) {
				acc[c] = 0;
			}
			
			acc[c] = ++acc[c];
			return acc;
		});
};

