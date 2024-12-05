/**
 * Creates new language class that processes decimals separately.
 * Requires implementing `toCardinal`.
 */
export default class AbstractLanguage {
    /**
     * @param {object} options Options for class.
     * @param {string} [options.negativeWord] Word that precedes a negative number (if any).
     * @param {string} options.separatorWord Word that separates cardinal numbers (i.e. "and").
     * @param {string} options.zero Word for 0 (i.e. "zero").
     * @param {string} [options.spaceSeparator] Character that separates words.
     */
    constructor(options: {
        negativeWord?: string;
        separatorWord: string;
        zero: string;
        spaceSeparator?: string;
    });
    /**
     * @returns {string} Word that precedes a negative number (if any).
     */
    get negativeWord(): string;
    /**
     * @returns {string} Word that separates cardinal numbers (i.e. "and").
     */
    get separatorWord(): string;
    /**
     * @returns {string} Word for 0 (i.e. "zero").
     */
    get zero(): string;
    /**
     * @returns {string} Character that separates words.
     */
    get spaceSeparator(): string;
    /**
     * @returns {number} Input value without decimal.
     */
    get wholeNumber(): number;
    /**
     * Convert ONLY decimal portion of number (processing leading zeros) to a string array of cardinal numbers.
     * @param {string} decimal Decimal string to convert.
     * @returns {string} Value in written format.
     */
    decimalToCardinal(decimal: string): string;
    /**
     * Convert a number to cardinal form.
     * @param {number|string|bigint} value Number to be convert.
     * @returns {string} Value in written format.
     * @throws {Error} Value must be a valid number.
     */
    floatToCardinal(value: number | string | bigint): string;
    #private;
}
