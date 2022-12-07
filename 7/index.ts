const __dirname = new URL('.', import.meta.url).pathname;
const text = Deno.readTextFileSync(`${__dirname}input.txt`).toString();

const arrayOfLines = text.split('\n').filter((line) => line !== '');

const CD_COMMAND_PREFIX = '$ cd ';
const LS_COMMAND = '$ ls';
const DIR_PREFIX = 'dir ';

type DefaultValues = {
	dirArray: string[]
	dirMap: { [dirPath: string]: { [fileName: string]: number } }
}

const defaultValues: DefaultValues = {
	dirArray: [],
	dirMap: {},
}

const MAX_DISK_SIZE = 70_000_000;
const REQUIRED_DISK_SIZE = 30_000_000;

const mappedData = arrayOfLines.reduce((acc, line) => {
	if (line.startsWith(CD_COMMAND_PREFIX)) {
		const dirName = line.replace(CD_COMMAND_PREFIX, '');
		const dirArray = dirName === '..' ? acc.dirArray.slice(0, -1) : [...acc.dirArray, dirName];

		return { ...acc, dirArray }
	}

	if (line.startsWith(LS_COMMAND)) {
		return acc;
	}

	if (line.startsWith(DIR_PREFIX)) {
		const dirName = [...acc.dirArray, line.replace(DIR_PREFIX, '')].join('/');

		return {
			...acc,
			dirMap: {
				...acc.dirMap,
				[dirName]: acc.dirMap[dirName] || {},
			}
		};
	}

	const dirName = acc.dirArray.join('/');
	const [fileSize, fileName] = line.split(' ');

	return {
		...acc,
		dirMap: {
			...acc.dirMap,
			[dirName]: {
				...acc.dirMap[dirName],
				[fileName]: parseInt(fileSize)
			}
		}
	}
}, defaultValues);

const directoriesWithTheirSize = Object.entries(mappedData.dirMap).reduce((acc, [dirName], _index, array) => {
	const sizeOfDirWithSubDirs = array
		.filter(([subDirName]) => subDirName.startsWith(dirName))
		.reduce((acc, [, subDirFiles]) => {
			return acc + Object.values(subDirFiles).reduce((subDirSize, fileSize) => subDirSize + fileSize, 0)
		}, 0)

	return { ...acc, [dirName]: sizeOfDirWithSubDirs };
}, {});

const sortedDirectoriesSizes = Object.values(directoriesWithTheirSize).sort((a, b) => a - b);

const sumOfDirectoriesSizesLowerThanMaxSize = sortedDirectoriesSizes.reduce((acc, size) => size < 100_000 ? acc + size : acc, 0);

const sizeToFreeUp = Math.abs(MAX_DISK_SIZE - REQUIRED_DISK_SIZE - sortedDirectoriesSizes.at(-1));

const directorySizeToRemove = sortedDirectoriesSizes.find((size) => size > sizeToFreeUp);

console.log(`A: ${sumOfDirectoriesSizesLowerThanMaxSize}`);
console.log(`B: ${directorySizeToRemove}`);
