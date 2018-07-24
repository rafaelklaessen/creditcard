class ExpiryNumber {
  /**
   * @constructor
   * @param {object} expiryNumber
   * @param {String|Number} expiryNumber.month Expiry month.
   * @param {String|Number} expiryNumber.year Expiry year.
   */
  constructor({ month, year }) {
    this.month = Number(month);
    this.year = Number(year);
  }

  /**
   * Validates the expiry number.
   *
   * @returns {Boolean}
   * @api public
   */
  validate() {
    const month = this.month;
    const year = this.year;

    // incorrect numbers should fail fast instantly
    if (!month || !year || month > 12) return false;

    const date = new Date();

    date.setFullYear(year);
    date.setMonth(--month);

    return date.getTime() >= Date.now();
  }
}

module.exports = ExpiryNumber;
