const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

const LetterToScore = letters.reduce((acc, letter, index) => ({
	...acc,
	[letter]: index + 1,
	[letter.toUpperCase()]: letters.length + index + 1
}), {})

const __dirname = new URL('.', import.meta.url).pathname;
const text = Deno.readTextFileSync(`${__dirname}input.txt`).toString();

const findCommonLetterWithinWords = ([firstWord, ...otherWords]: string[]) =>
	[...firstWord].find((letter) => otherWords.every((word) => word.includes(letter)))

const arrayFromInput = text
	.split('\n')
	.filter((text) => text !== '')

const arrayOfCommonLettersFirstStrategy = arrayFromInput
	.map((line) => [line.substring(0, line.length / 2), line.substring(line.length / 2)])
	.map(findCommonLetterWithinWords) as (keyof typeof LetterToScore)[]

const arrayOfCommonLettersSecondStrategy = Array(arrayFromInput.length / 3)
	.fill([])
	.map((_, index) => arrayFromInput.slice(index * 3, (index * 3) + 3))
	.map(findCommonLetterWithinWords) as (keyof typeof LetterToScore)[]

const getTotalScoreForArray = (array: (keyof typeof LetterToScore)[]) => array.reduce((acc, letter) => acc + LetterToScore[letter], 0)

console.log(`A: ${getTotalScoreForArray(arrayOfCommonLettersFirstStrategy)}`)
console.log(`B: ${getTotalScoreForArray(arrayOfCommonLettersSecondStrategy)}`)
