const __dirname = new URL('.', import.meta.url).pathname;
const text = Deno.readTextFileSync(`${__dirname}input.txt`).toString();
const arrayOfArrays = text
	.split('\n\n')
	.filter((line) => line !== '')
	.map((line) => line.split('\n'))
const sumArrayValues = (array) => array.reduce((acc, value) => acc + parseInt(value), 0);
const arrayOfCaloriesSum = arrayOfArrays.map(sumArrayValues).sort((a, b) => b - a)

console.log(`A: ${sumArrayValues(arrayOfCaloriesSum.slice(0, 1))}`)
console.log(`B: ${sumArrayValues(arrayOfCaloriesSum.slice(0, 3))}`)
