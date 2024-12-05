/**
 * Converts a value to cardinal (written) form.
 * @param {number|string|bigint} value Number to be convert.
 * @param {object} [options] Options for class.
 * @returns {string} Value in cardinal (written) format.
 * @throws {Error} Value cannot be invalid.
 */
export default function floatToCardinal(value: number | string | bigint, options?: object): string;
export class N2WordsHU extends BaseLanguage {
    constructor(options: any);
    tensToCardinal(number: any): string;
    hundredsToCardinal(number: any): string;
    thousandsToCardinal(number: any): string;
    bigNumberToCardinal(number: any): string;
    toCardinal(number: any, zero?: string): string;
}
import BaseLanguage from '../classes/base-language.js';
