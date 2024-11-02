/**
 * Converts a value to cardinal (written) form.
 * @param {number|string|bigint} value Number to be convert.
 * @param {object} [options] Options for class.
 * @returns {string} Value in cardinal (written) format.
 * @throws {Error} Value cannot be invalid.
 */
export default function floatToCardinal(value: number | string | bigint, options?: object): string;
export class Arabic extends AbstractLanguage {
    constructor(options: any);
    number: any;
    feminine: any;
    ones: {
        masculine: string[];
        feminine: string[];
    };
    arabicTens: string[];
    arabicHundreds: string[];
    arabicAppendedTwos: string[];
    arabicTwos: string[];
    arabicGroup: string[];
    arabicAppendedGroup: string[];
    arabicPluralGroups: string[];
    digitFeminineStatus(digit: any): string;
    /**
     * Processes the Arabic group number and returns the corresponding Arabic representation.
     * @param {number} groupNumber - The number to process. (Range: 1-999)
     * @param {number} groupLevel - Group level to process. (See example)
     * @returns {string} The Arabic representation of the group number.
     * @example 12345678 is processed in blocks of 3: '678' (group 0), '345' (group 1), '12' (group 2).
     */
    processArabicGroup(groupNumber: number, groupLevel: number): string;
    /**
     * Converts a number to its cardinal representation in Arabic.
     * It process by blocks of 3 digits.
     * @param {number} number - The number to convert.
     * @returns {string} The cardinal representation of the number in Arabic.
     */
    toCardinal(number: number): string;
}
import AbstractLanguage from '../classes/abstract-language.js';
