/**
 * Converts a value to cardinal (written) form.
 * @param {number|string|bigint} value Number to be convert.
 * @param {object} [options] Options for class.
 * @returns {string} Value in cardinal (written) format.
 * @throws {Error} Value cannot be invalid.
 */
export default function floatToCardinal(value: number | string | bigint, options?: object): string;
export class N2WordsID extends AbstractLanguage {
    constructor(options: any);
    base: {
        0: any[];
        1: string[];
        2: string[];
        3: string[];
        4: string[];
        5: string[];
        6: string[];
        7: string[];
        8: string[];
        9: string[];
    };
    thousands: {
        3: string;
        6: string;
        9: string;
        12: string;
        15: string;
        18: string;
        21: string;
        24: string;
        27: string;
        30: string;
        33: string;
    };
    splitBy3(number: any): any[][];
    spell(blocks: any): any[];
    getHundreds(number: any): any[];
    getTens(number: any): any;
    join(wordBlocks: any): string;
    toCardinal(number: any): string;
}
import AbstractLanguage from '../classes/abstract-language.js';
