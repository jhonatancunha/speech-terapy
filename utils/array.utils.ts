/**
 * Generates an array of random indices within a specified range.
 * @param count The number of random indices to generate.
 * @param min The minimum value of the range (inclusive).
 * @param max The maximum value of the range (inclusive).
 * @returns An array of random indices within the specified range.
 */
export const generateRandomIndices = (
  count: number,
  min: number,
  max: number,
): number[] => {
  const randomIndices: number[] = [];

  const formattedCount = Math.min(count, max - min + 1);

  while (randomIndices.length < formattedCount) {
    const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!randomIndices.includes(randomIndex)) {
      randomIndices.push(randomIndex);
    }
  }

  return randomIndices;
};
