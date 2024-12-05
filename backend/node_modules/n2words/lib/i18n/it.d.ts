/**
 * Converts a value to cardinal (written) form.
 * @param {number|string|bigint} value Number to be convert.
 * @param {object} [options] Options for class.
 * @returns {string} Value in cardinal (written) format.
 * @throws {Error} Value cannot be invalid.
 */
export default function floatToCardinal(value: number | string | bigint, options?: object): string;
export class N2WordsIT extends BaseLanguage {
    constructor(options: any);
    cardinalWords: string[];
    strTens: {
        '2': string;
        '3': string;
        '4': string;
        '6': string;
    };
    exponentPrefixes: string[];
    accentuate(string: any): any;
    omitIfZero(numberToString: any): any;
    phoneticContraction(string: any): any;
    tensToCardinal(number: any): any;
    hundredsToCardinal(number: any): any;
    thousandsToCardinal(number: any): string;
    exponentLengthToString(exponentLength: any): string;
    bigNumberToCardinal(number: any): string;
    toCardinal(number: any): any;
}
import BaseLanguage from '../classes/base-language.js';
