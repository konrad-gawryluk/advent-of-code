const __dirname = new URL('.', import.meta.url).pathname;
const text = Deno.readTextFileSync(`${__dirname}input.txt`).toString();

const arrayOfInstructions = text.split('\n').filter((line) => line !== '').map((line) => line.split(' '));

type Position = {
	x: number;
	y: number;
}

const initialPosition: Position = {
	x: 0,
	y: 0
};

const getNewPosition = (firstPosition: Position, secondPosition: Position): Position => {
	const horizontalDiff = firstPosition.x - secondPosition.x;
	const verticalDiff = firstPosition.y - secondPosition.y;
	const diffSum = Math.abs(horizontalDiff) + Math.abs(verticalDiff);
	const hasBigDiffSum = diffSum > 2;

	return {
		x: (Math.abs(horizontalDiff) > 1 || hasBigDiffSum) ? secondPosition.x + Math.sign(horizontalDiff) : secondPosition.x,
		y: (Math.abs(verticalDiff) > 1 || hasBigDiffSum) ? secondPosition.y + Math.sign(verticalDiff) : secondPosition.y,
	};
}

const getStateAfterEachInstruction = (lineLength: number) => arrayOfInstructions.reduce((acc, [direction, count]) => {
	return [...Array(parseInt(count)).keys()].reduce((positions) => {
		const [head, ...others] = positions.at(-1);

		const newHead = {
			x: head.x + (direction === 'R' ? 1 : direction === 'L' ? -1 : 0),
			y: head.y + (direction === 'U' ? 1 : direction === 'D' ? -1 : 0),
		};

		const newPositions = others.reduce((acc, position) => {
			const newPosition = getNewPosition(acc.at(-1), position);
			return [...acc, newPosition];
		}, [newHead]);

		return [...positions, newPositions];
	}, acc);
}, [Array(lineLength).fill(initialPosition)]);

const getTailUniquePositions = (lineLength: number) => [...new Set(getStateAfterEachInstruction(lineLength).map((state) => {
	const { x, y } = state.at(-1);
	return `${x},${y}`;
}))].length;

console.log(`A: ${getTailUniquePositions(2)}`);
console.log(`B: ${getTailUniquePositions(10)}`);
