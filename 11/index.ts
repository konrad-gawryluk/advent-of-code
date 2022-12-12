import iter = Deno.iter;

const __dirname = new URL('.', import.meta.url).pathname;
const text = Deno.readTextFileSync(`${__dirname}input.txt`).toString();

const arrayOfMonkeysText = text.split('\n\n').filter((line) => line !== '');

type Monkey = {
	items: number[];
	throwCount: number;
	number: 'old' | string;
	symbol: '+' | '*';
	divisibleBy: number;
	ifTrueMonkeyIndex: number;
	ifFalseMonkeyIndex: number;
}

const getNewItemForMonkey = (monkey: Monkey, oldItem: number): number => {
	const addedValue = monkey.number === 'old' ? oldItem : Number(monkey.number);

	return monkey.symbol === '+' ? oldItem + addedValue : oldItem * addedValue;

};

const arrayOfMonkeys: Monkey[] = arrayOfMonkeysText
	.map((monkeyText) => monkeyText.split('\n'))
	.map((monkeyTextArray) => {
		const [_, items, operation, test, ifTrue, ifFalse] = monkeyTextArray;
		const [symbol, number] = operation.replace('  Operation: new = old ', '').split(' ');

		return {
			items: items.replace('  Starting items: ', '').split(', ').map((item) => Number(item)),
			throwCount: 0,
			number,
			symbol: symbol as Monkey['symbol'],
			divisibleBy: Number(test.replace('  Test: divisible by ', '')),
			ifTrueMonkeyIndex: Number(ifTrue.replace('    If true: throw to monkey ', '')),
			ifFalseMonkeyIndex: Number(ifFalse.replace('    If false: throw to monkey ', '')),
		};
	});

const getArrayOfMonkeysStateAfterEachRound = (rounds: number, fearDivider: number) => Array(rounds).fill(undefined).reduce((state) => {
	const stateCopy: Monkey[] = structuredClone(state.at(-1));

	stateCopy.forEach((monkey) => {
		monkey.items.forEach((item) => {
			const newItem = Math.floor( getNewItemForMonkey(monkey, item) / fearDivider);
			const newMonkeyIndex = newItem % monkey.divisibleBy === 0 ? monkey.ifTrueMonkeyIndex : monkey.ifFalseMonkeyIndex;

			stateCopy[newMonkeyIndex].items.push(newItem);
		});

		monkey.throwCount = monkey.throwCount + monkey.items.length;
		monkey.items = [];
	});

	return [...state, stateCopy];
}, [arrayOfMonkeys]);



const getMonkeyBusinessValueForRoundsAndFearDivider = (rounds: number, fearDivider: number): number => {
	const arrayOfSumOfThrowCountForEachMonkey = getArrayOfMonkeysStateAfterEachRound(rounds, fearDivider)
		.at(-1)
		.map((monkey) => monkey.throwCount)
		.sort((a, b) => b - a);

	return arrayOfSumOfThrowCountForEachMonkey[0] * arrayOfSumOfThrowCountForEachMonkey[1];
}

console.log(`A: ${getMonkeyBusinessValueForRoundsAndFearDivider(20, 3)}`);
console.log(`B: ${getMonkeyBusinessValueForRoundsAndFearDivider(10000, 1)}`);
