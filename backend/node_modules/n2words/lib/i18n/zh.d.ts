/**
 * Converts a value to cardinal (written) form.
 * @param {number|string|bigint} value Number to be convert.
 * @param {object} [options] Options for class.
 * @returns {string} Value in cardinal (written) format.
 * @throws {Error} Value cannot be invalid.
 */
export default function floatToCardinal(value: number | string | bigint, options?: object): string;
export class N2WordsZH extends BaseLanguage {
    constructor(options: any);
    merge(lPair: any, rPair: any): {
        [x: string]: bigint;
    };
    decimalToCardinal(decimal: any): string;
    digit(number_: any): any;
    zeroDigit(number_: any): number;
}
import BaseLanguage from '../classes/base-language.js';
