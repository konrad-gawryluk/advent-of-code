const __dirname = new URL('.', import.meta.url).pathname;
const text = Deno.readTextFileSync(`${__dirname}input.txt`).toString();

const getIndex = (distinctCharacterNumber: number) => text.split('').findIndex((_, index, array) => {
	if (index < distinctCharacterNumber ) return false;

	return [...new Set(array.slice(index - distinctCharacterNumber, index))].length === distinctCharacterNumber;
});

console.log(`A: ${getIndex(4)}`)
console.log(`B: ${getIndex(14)}`)
