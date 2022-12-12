const __dirname = new URL('.', import.meta.url).pathname;
const text = Deno.readTextFileSync(`${__dirname}input.txt`).toString();

const CYCLES_TO_MEASURE_STRENGTH_DURING = [20, 60, 100, 140, 180, 220];

const arrayOfInstructions = text.split('\n').filter((line) => line !== '');

const strengthAfterEachCycle = arrayOfInstructions.reduce((acc, instruction) => {
	const lastValue = acc.at(-1) as number;

	if (instruction === 'noop') {
		return [...acc, lastValue];
	}

	return [...acc, lastValue, lastValue + Number(instruction.split(' ').at(-1))];
}, [1]);

const strengthAfterEachCycleToMeasure = CYCLES_TO_MEASURE_STRENGTH_DURING.map((cycle) => cycle * strengthAfterEachCycle[cycle - 1]);

const sumOfStrengths = strengthAfterEachCycleToMeasure.reduce((acc, value) => acc + value, 0);

const strengthAfterEachCycleWithoutFirst = strengthAfterEachCycle.slice(0, strengthAfterEachCycle.length - 1);

const linesOfText = Array(strengthAfterEachCycleWithoutFirst.length / 40)
	.fill([])
	.reduce((acc, _, lineIndex) => {
		const text = strengthAfterEachCycleWithoutFirst
			.slice(lineIndex * 40, (lineIndex + 1) * 40)
			.map((value, valueIndex) => [value - 1, value, value + 1].includes(valueIndex) ? '#' : '.')
			.join('')

		return [...acc, text];
	}, []);

console.log(`A: ${sumOfStrengths}`);
console.log(`B: \n${linesOfText.join('\n')}`)
