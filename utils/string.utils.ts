import { words } from "~/assets/words";
import { WordsLevelsEnum } from "./enums.utils";
import { generateRandomIndices } from "./array.utils";

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
  first = first.replace(/\s+/g, "");
  second = second.replace(/\s+/g, "");

  if (first === second) return 1; // identical or empty
  if (first.length < 2 || second.length < 2) return 0; // if either is a 0-letter or 1-letter string

  let firstBigrams = new Map();
  for (let i = 0; i < first.length - 1; i++) {
    const bigram = first.substring(i, i + 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;

    firstBigrams.set(bigram, count);
  }

  let intersectionSize = 0;
  for (let i = 0; i < second.length - 1; i++) {
    const bigram = second.substring(i, i + 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;

    if (count > 0) {
      firstBigrams.set(bigram, count - 1);
      intersectionSize++;
    }
  }

  return (2.0 * intersectionSize) / (first.length + second.length - 2);
};

const countSyllables = (word: string) => {
  const syllableRegex = /[aeiouáéíóúãõâêîôûàäëïöü]/gi;
  const matches = word.match(syllableRegex);
  return matches ? matches.length : 0;
};

const hasAccents = (word: string) => {
  const accentRegex = /[áéíóúãõâêîôûàäëïöü]/gi;
  return accentRegex.test(word);
};

/**
 * Function to get words by difficulty level.
 *
 * @param amount - The number of words to return.
 * @param difficulty - The difficulty level of the words to return.
 * @returns An array of words matching the specified difficulty level.
 */
export const getWordsByDifficulty = (
  amount: number,
  difficulty: WordsLevelsEnum
): Array<string> => {
  const easyWords: Array<string> = [];
  const mediumWords: Array<string> = [];
  const hardWords: Array<string> = [];
  const harderWords: Array<string> = [];

  words.forEach((word) => {
    const syllableCount = countSyllables(word);
    const accents = hasAccents(word);

    if (syllableCount <= 2 && !accents) {
      easyWords.push(word);
    } else if (syllableCount === 3) {
      mediumWords.push(word);
    } else if (syllableCount === 4 || syllableCount === 5) {
      hardWords.push(word);
    } else if (syllableCount >= 6) {
      harderWords.push(word);
    }
  });

  let selectedWords;

  switch (difficulty) {
    case WordsLevelsEnum.EASY:
      selectedWords = easyWords;
      break;
    case WordsLevelsEnum.MEDIUM:
      selectedWords = mediumWords;
      break;
    case WordsLevelsEnum.HARD:
      selectedWords = hardWords;
      break;
    case WordsLevelsEnum.HARDER:
      selectedWords = harderWords;
      break;
    default:
      return [];
  }

  selectedWords = selectedWords.sort(() => 0.5 - Math.random());
  return selectedWords.slice(0, amount);
};
