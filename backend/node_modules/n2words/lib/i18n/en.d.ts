/**
 * Converts a value to cardinal (written) form.
 * @param {number|string|bigint} value Number to be convert.
 * @param {object} [options] Options for class.
 * @returns {string} Value in cardinal (written) format.
 * @throws {Error} Value cannot be invalid.
 */
export default function floatToCardinal(value: number | string | bigint, options?: object): string;
/**
 * This class is for converting numbers to english words.
 */
export class English extends BaseLanguage {
    constructor(options: any);
    /**
     * Merge word set pairs
     * @param {object} lPair {'one':1}
     * @param {object} rPair {'hundred':100}
     * @returns {object} {'one hundred': 100}
     */
    merge(lPair: object, rPair: object): object;
}
import BaseLanguage from '../classes/base-language.js';
