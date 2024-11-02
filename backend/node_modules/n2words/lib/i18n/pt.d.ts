/**
 * Converts a value to cardinal (written) form.
 * @param {number|string|bigint} value Number to be convert.
 * @param {object} [options] Options for class.
 * @returns {string} Value in cardinal (written) format.
 * @throws {Error} Value cannot be invalid.
 */
export default function floatToCardinal(value: number | string | bigint, options?: object): string;
export class N2WordsPT extends BaseLanguage {
    constructor(options: any);
    hundreds: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
        6: string;
        7: string;
        8: string;
        9: string;
    };
    merge(current: any, next: any): {
        [x: string]: bigint;
    };
}
import BaseLanguage from '../classes/base-language.js';
