const __dirname = new URL('.', import.meta.url).pathname;
const text = Deno.readTextFileSync(`${__dirname}input.txt`).toString();

const arrayOfArraysOfArrays = text
	.split('\n')
	.filter((line) => line !== '')
	.map((line) => line.split(',').map((assignment) => assignment.split('-').map((value) => parseInt(value))));

const arrayOfArraysOfArraysFullyDuplicatedAssignments = arrayOfArraysOfArrays.filter(([firstAssignment, secondAssignment]) => {
	const [firstAssignmentFirstValue, firstAssignmentSecondValue] = firstAssignment;
	const [secondAssignmentFirstValue, secondAssignmentSecondValue] = secondAssignment;

	return (firstAssignmentFirstValue <= secondAssignmentFirstValue && secondAssignmentSecondValue <= firstAssignmentSecondValue)
	|| 	(secondAssignmentFirstValue <= firstAssignmentFirstValue && firstAssignmentSecondValue <= secondAssignmentSecondValue);
})

const arrayOfArraysOfArraysOverlappingAssignments = arrayOfArraysOfArrays.filter(([firstAssignment, secondAssignment]) => {
	const [firstAssignmentFirstValue, firstAssignmentSecondValue] = firstAssignment;
	const [secondAssignmentFirstValue, secondAssignmentSecondValue] = secondAssignment;

	return (firstAssignmentFirstValue <= secondAssignmentFirstValue && secondAssignmentFirstValue <= firstAssignmentSecondValue)
	|| 	(secondAssignmentFirstValue <= firstAssignmentFirstValue && firstAssignmentFirstValue <= secondAssignmentSecondValue);
})

console.log(`A: ${arrayOfArraysOfArraysFullyDuplicatedAssignments.length}`)
console.log(`B: ${arrayOfArraysOfArraysOverlappingAssignments.length}`)
