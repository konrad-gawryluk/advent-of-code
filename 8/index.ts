const __dirname = new URL('.', import.meta.url).pathname;
const text = Deno.readTextFileSync(`${__dirname}input.txt`).toString();

const arrayOfLines = text.split('\n').filter((line) => line !== '');

const arrayOfArrays = arrayOfLines.map((line) => line.split(''));

const getTreesAround = (linesArray, lineIndex, treeIndex) => {
	const treesOnLeft = (linesArray[lineIndex].slice(0, treeIndex) || []).reverse();
	const treesOnRight = linesArray[lineIndex].slice(treeIndex + 1) || [];
	const treesOnTop = (linesArray.slice(0, lineIndex).map((line) => line[treeIndex]) || []).reverse();
	const treesOnBottom = linesArray.slice(lineIndex + 1).map((line) => line[treeIndex]) || [];

	return [treesOnLeft, treesOnRight, treesOnTop, treesOnBottom];
}

const sumOfTreesVisibleFromOutside = arrayOfArrays.reduce((acc, line, lineIndex, linesArray) => {
	const visibleTreesInLine = line.filter((tree, treeIndex) => {
		return getTreesAround(linesArray, lineIndex, treeIndex).some((trees) => trees.every((t) => t < tree));
	})

	return acc + visibleTreesInLine.length;
}	, 0);

const arrayOfScenicScores = arrayOfArrays.reduce((acc, line, lineIndex, linesArray) => {
	const scenicScores = line.map((tree, treeIndex) => {
		const scores = getTreesAround(linesArray, lineIndex, treeIndex).map((trees) => {
			const index = trees.findIndex((t) => t >= tree);
			return index === -1 ? trees.length : index + 1;
		});

		return scores.reduce((acc, score) => acc * score, 1);
	})

	return [...acc, ...scenicScores];
}	, []);

console.log(`A: ${sumOfTreesVisibleFromOutside}`);
console.log(`B: ${Math.max(...arrayOfScenicScores)}`);
