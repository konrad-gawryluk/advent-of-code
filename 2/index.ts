type OpponentShape = 'A' | 'B' | 'C'
type MyShape = 'X' | 'Y' | 'Z'

const CaseWhenLose: {[key in OpponentShape]: MyShape} = {
	A: 'Z',
	B: 'X',
	C: 'Y',
}

const CaseWhenDraw: {[key in OpponentShape]: MyShape} = {
	A: 'X',
	B: 'Y',
	C: 'Z',
}

const CaseWhenWin: {[key in OpponentShape]: MyShape} = {
	A: 'Y',
	B: 'Z',
	C: 'X',
}

const PointsForShape: {[key in MyShape]: number} = {
	X: 1,
	Y: 2,
	Z: 3,
}

type ArrayOfArrays = [OpponentShape, MyShape][]

const __dirname = new URL('.', import.meta.url).pathname;
const text = Deno.readTextFileSync(`${__dirname}input.txt`).toString();

const arrayOfArraysFirstStrategy = text
	.split('\n')
	.filter((line) => line !== '')
	.map((line) => line.split(' ')) as ArrayOfArrays

const arrayOfArraysSecondStrategy: ArrayOfArrays = arrayOfArraysFirstStrategy.map(([opponentShape, myShape]) => {
	if (myShape === 'X') {
		return [opponentShape, CaseWhenLose[opponentShape]]
	}

	if (myShape === 'Y') {
		return [opponentShape, CaseWhenDraw[opponentShape]]
	}

	return [opponentShape, CaseWhenWin[opponentShape]]
})

const getPointsForResult = (opponentShape: OpponentShape, myShape: MyShape) => {
	if (CaseWhenLose[opponentShape] === myShape) {
		return 0
	}

	if (CaseWhenDraw[opponentShape] === myShape) {
		return 3
	}

	return 6
};

const getTotalScoreForArrayInput = (arrayOfArrays: ArrayOfArrays) => arrayOfArrays.reduce((acc, [opponentShape, myShape]) => {
	return acc + PointsForShape[myShape] + getPointsForResult(opponentShape, myShape)
}, 0)

console.log(`A: ${getTotalScoreForArrayInput(arrayOfArraysFirstStrategy)}`)
console.log(`B: ${getTotalScoreForArrayInput(arrayOfArraysSecondStrategy)}`)
