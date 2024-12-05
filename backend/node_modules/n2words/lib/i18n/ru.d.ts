/**
 * Converts a value to cardinal (written) form.
 * @param {number|string|bigint} value Number to be convert.
 * @param {object} [options] Options for class.
 * @returns {string} Value in cardinal (written) format.
 * @throws {Error} Value cannot be invalid.
 */
export default function floatToCardinal(value: number | string | bigint, options?: object): string;
export class N2WordsRU extends AbstractLanguage {
    constructor(options: any);
    /** @type {boolean} */
    feminine: boolean;
    /** @type {object} */
    ones: object;
    /** @type {object} */
    onesFeminine: object;
    /** @type {object} */
    tens: object;
    /** @type {object} */
    twenties: object;
    /** @type {object} */
    hundreds: object;
    /** @type {object} */
    thousands: object;
    toCardinal(number: any): string;
    splitByX(n: any, x: any): bigint[];
    getDigits(value: any): bigint[];
    pluralize(n: any, forms: any): any;
}
import AbstractLanguage from '../classes/abstract-language.js';
