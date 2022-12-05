const __dirname = new URL('.', import.meta.url).pathname;
const text = Deno.readTextFileSync(`${__dirname}input.txt`).toString();

const [rawCrates, rawProcedures] = text.split('\n\n');

const crates = rawCrates.split('\n').reverse().slice(1).reduce((acc, crate) => {
	return acc.map((value, index) => {
		const newValue = crate
			.slice(index * 4, (index * 4) + 4)
			.replaceAll(' ', '')
			.replaceAll('[', '')
			.replaceAll(']', '');

		return newValue ? [...value, newValue] : value;
	});
}, Array(9).fill([]))

const procedures = rawProcedures
	.split('\n')
	.filter((line) => line !== '')
	.map((line) => line
		.replace('move ', '')
		.replace('from ', '')
		.replace('to ', '')
		.split(' ')
		.map((value) => parseInt(value))
	)

const cratesAfterProcedures = (shouldReverse = false) => procedures
	.reduce((acc, [count, from, to]) => {
		const moved = acc[from - 1].slice(-count);
		acc[to - 1] = [...acc[to - 1], ...(shouldReverse ? moved.reverse() : moved)];
		acc[from - 1] = acc[from - 1].slice(0, -count);
		return acc;
	}, structuredClone(crates))
	.map((crate) => crate.slice(-1)).join('')

console.log(`A: ${cratesAfterProcedures(true)}`)
console.log(`B: ${cratesAfterProcedures(false)}`)
