const fs = require('fs-extra');
const path = require('path');

const lineReader = require('readline').createInterface({
	input: require('fs').createReadStream(path.join(__dirname, 'input3.txt'))
});

test('adventDay3', () => {
	readClaims().then(claims => {
		
		
		let maxSize = claims.reduce((a, c) => {
			return {
				w: Math.max(a.w, c.x + c.w),
				h: Math.max(a.h, c.y + c.h)
			};
		}, {w: 0, h: 0});
		
		let matrix = [...Array(maxSize.h)]
			.map(() => Array(maxSize.w).fill('.'));
		
		/*
			3,2: 5x4
			(x,y: wxh)
				i		x
			...........->
			...........
			...#w###...
			...h####...
		j	...#####...
			...#####...
			...........
			...........
			...........
			|
			v
			y
			 */
		
		claims.forEach(c => {
			
			for (let i = 0; i < maxSize.w; i++)
				for (let j = 0; j < maxSize.h; j++)
					if (c.x <= i && i < c.ex && c.y <= j && j < c.ey) {
						if (matrix[i][j] === 'x') {
							matrix[i][j] = 'o';
						}
						
						if (matrix[i][j] === '.') {
							matrix[i][j] = 'x';
						}
					}
			
		});
		
		let count = 0;
		for (let i = 0; i < maxSize.w; i++)
			for (let j = 0; j < maxSize.h; j++)
				if (matrix[i][j] === 'o') {
					count++;
				}
		
		console.log(count);
	});
});

readClaims = () => {
	return readFile().then((inputLines) => {
		return inputLines
			.map(line => line.split(' @ ')[1])
			.map(line => {
				let parts = line.split(': ');
				return {
					xAndY: parts[0],
					wAndH: parts[1]
				}
			})
			.map(cp => {
				return {
					x: Number(cp.xAndY.split(',')[0]),
					y: Number(cp.xAndY.split(',')[1]),
					w: Number(cp.wAndH.split('x')[0]),
					h: Number(cp.wAndH.split('x')[1])
				}
			})
			.map(cp => {
				return {
					...cp,
					ex: cp.x + cp.w,
					ey: cp.y + cp.h
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




