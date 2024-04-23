/**
 * Calculates the similarity between two strings based on the concept of bigrams.
 * 
 * @param {string} first - The first string to compare.
 * @param {string} second - The second string to compare.
 * @returns {number} A value between 0 and 1 representing the similarity between the two strings.
 *   - Returns 1 if the strings are identical or empty.
 *   - Returns 0 if either of the strings has a length of less than 2 characters.
 *   - Otherwise, returns a value calculated based on the Jaccard similarity coefficient.
 */
export const compareTwoStrings = (first: string, second: string): number => {
	first = first.replace(/\s+/g, '')
	second = second.replace(/\s+/g, '')

	if (first === second) return 1; // identical or empty
	if (first.length < 2 || second.length < 2) return 0; // if either is a 0-letter or 1-letter string

	let firstBigrams = new Map();
	for (let i = 0; i < first.length - 1; i++) {
		const bigram = first.substring(i, i + 2);
		const count = firstBigrams.has(bigram)
			? firstBigrams.get(bigram) + 1
			: 1;

		firstBigrams.set(bigram, count);
	};

	let intersectionSize = 0;
	for (let i = 0; i < second.length - 1; i++) {
		const bigram = second.substring(i, i + 2);
		const count = firstBigrams.has(bigram)
			? firstBigrams.get(bigram)
			: 0;

		if (count > 0) {
			firstBigrams.set(bigram, count - 1);
			intersectionSize++;
		}
	}

	return (2.0 * intersectionSize) / (first.length + second.length - 2);
}