/**
 * Converts a value to cardinal (written) form.
 * @param {number|string|bigint} value Number to be convert.
 * @param {object} [options] Options for class.
 * @returns {string} Value in cardinal (written) format.
 * @throws {Error} Value cannot be invalid.
 */
export default function floatToCardinal(value: number | string | bigint, options?: object): string;
export class N2WordsNL extends BaseLanguage {
    constructor(options: any);
    includeOptionalAnd: any;
    noHundredPairs: any;
    merge(current: any, next: any): {
        [x: string]: bigint;
    } | {
        [x: string]: number;
    };
    toCardinal(value: any): string;
}
import BaseLanguage from '../classes/base-language.js';
