/**
 * Creates new common language class that uses a highest matching word value algorithm.
 * Number matching word {@link cards} must be provided for this to work.
 * See {@link AbstractLanguage} for further requirements.
 * @classdesc Common class for (mostly european) languages.
 */
export default class BaseLanguage extends AbstractLanguage {
    /**
     * @param {object} options Options for class.
     * @param {string} [options.negativeWord] Word that precedes a negative number (if any).
     * @param {string} options.separatorWord Word that separates cardinal numbers (i.e. "and").
     * @param {string} options.zero Word for 0 (i.e. "zero").
     * @param {string} [options.spaceSeparator] Character that separates words.
     * @param {Array} cards Array of number matching "cards" from highest-to-lowest.
     */
    constructor(options: {
        negativeWord?: string;
        separatorWord: string;
        zero: string;
        spaceSeparator?: string;
    }, cards: any[]);
    /**
     * Set array of number matching "cards" from highest-to-lowest.
     * First element in card array is the number to match while the second is the word to use.
     * @example
     * [
     *   ...
     *   [100, 'hundred'],
     *   ...
     *   [1, 'one'],
     * ]
     */
    set cards(value: any[]);
    /**
     * Get array of number matching "cards" from highest-to-lowest.
     * @returns {Array} Array of number matching "cards" from highest-to-lowest.
     */
    get cards(): any[];
    /**
     * Get word for number if it matches a language card.
     * @param {number|bigint} number Card number value.
     * @returns {string|undefined} Return card word or undefined if no card.
     */
    getCardWord(number: number | bigint): string | undefined;
    /**
     * Get array of card matches.
     * @param {number|bigint} value The number value to convert to cardinal form.
     * @returns {object} Word sets (and pairs) from value.
     */
    toCardMatches(value: number | bigint): object;
    clean(words: any): any;
    postClean(out0: any): any;
    /**
     * Convert a whole number to written format.
     * @param {number|bigint} value The number value to convert to cardinal form.
     * @returns {string} Value in written format.
     */
    toCardinal(value: number | bigint): string;
    #private;
}
import AbstractLanguage from './abstract-language.js';
