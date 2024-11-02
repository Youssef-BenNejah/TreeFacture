/**
 * Converts a value to cardinal (written) form.
 * @param {number|string|bigint} value Number to be convert.
 * @param {object} [options] Options for class.
 * @returns {string} Value in cardinal (written) format.
 * @throws {Error} Value cannot be invalid.
 */
export default function floatToCardinal(value: number | string | bigint, options?: object): string;
export class N2WordsHR extends N2WordsRU {
    ones: {
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
    tens: {
        0: string;
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
    twenties: {
        2: string;
        3: string;
        4: string;
        5: string;
        6: string;
        7: string;
        8: string;
        9: string;
    };
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
    SCALE: {
        0: (string | boolean)[];
        1: (string | boolean)[];
        2: (string | boolean)[];
        3: (string | boolean)[];
        4: (string | boolean)[];
        5: (string | boolean)[];
        6: (string | boolean)[];
        7: (string | boolean)[];
        8: (string | boolean)[];
        9: (string | boolean)[];
        10: (string | boolean)[];
    };
}
import { N2WordsRU } from './ru.js';
