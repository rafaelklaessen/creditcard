class CreditCardInformation {
  /**
   * @constructor
   * @param {object} info Credit card information.
   * @param {string} iin Issues Identifier Number.
   * @param {string} mii Major Industry Identifier.
   * @param {string} formatted Formatted version.
   * @param {number} cvv
   * @param {string} truncated PAN truncated version.
   * @param {string} scheme Credit card scheme.
   * @param {boolean} valid Credit card validation status.
   */
  constructor(info) {
    for (const key in info) {
      this[key] = info[key];
    }
  }
}

module.exports = CreditCardInformation;
