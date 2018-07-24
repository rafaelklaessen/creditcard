const CreditCardInformation = require('./lib/CreditCardInformation');
const ExpiryNumber = require('./lib/ExpiryNumber');
const MII = require('./lib/MII');
const testNumbers = require('./lib/testNumbers');

class CreditCard {
  /**
   * @constructor
   * @param {String} number Credit card number.
   * @param {ExpiryNumber} [expiryNumber] Expiry number.
   */
  constructor(number, expiryNumber) {
    this.number = number.toString().replace(/\D/g, '');
    this.expiryNumber = expiryNumber;
  }

  /**
   * Set expiry number.
   * @param {ExpiryNumber} expiryNumber Expiry number.
   * @returns {CreditCard} The current CreditCard instance.
   * @api public
   */
  setExpiryNumber(expiryNumber) {
    this.expiryNumber = expiryNumber;
  }

  /**
   * Find out which major card scheme issued the card based on the IIN range.
   *
   * @param {String} number Credit card number.
   * @returns {String|Null}
   * @api public
   */
  getCardScheme() {
    const number = this.number.toString().replace(/\D/g, '');

    if (/^(5610|560221|560222|560223|560224|560225)/.test(number)) {
      return 'Australian Bank Card';
    }

    if (/^(2014|2149)/.test(number)) {
      return "Diner's Club";
    }

    if (/^36/.test(number)) {
      return "Diner's Club International";
    }

    if (/^35(2[89]|[3-8][0-9])/.test(number)) {
      return 'Japanese Credit Bureau';
    }

    if (/^(5018|5020|5038|6304|6759|676[1-3])/.test(number)) {
      return 'Maestro';
    }

    if (/^(6304|670[69]|6771)/.test(number)) {
      return 'laser';
    }

     if (/^(6334|6767)/.test(number)) {
      return 'Solo (Paymentech)';
    }

    if (/^(222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720|5[1-5])/.test(number)) {
      return 'MasterCard';
    }

    if (/^(6011|622|64|65)/.test(number)) {
      return 'Discover';
    }

    if (/^3[47]/.test(number)) {
      return 'American Express';
    }

    if (/^(30[0-5]|36|38|54|55|2014|2149)/.test(number)) {
      return "Diner's Club / Carte Blanche";
    }

    if (/^(4026|417500|4508|4844|491(3|7))/.test(number)) {
      return 'Visa Electron';
    }

    if (/^(4)/.test(number)) {
      return 'Visa';
    }

    return null;
  };

  /**
   * Format the credit card number in to the same patterns as seen on the actual
   * credit cards.
   *
   * @param {String} number Credit card number.
   * @returns {String} Formatted version.
   * @api public
   */
  format() {
    const number = this.number.toString().replace(/\D/g, '');

    let index = 0;
    const pattern = /^(34|37)/.test(number)
        ? 'XXXX XXXXXX XXXXX' // American express has a different pattern.
        : 'XXXX XXXX XXXX XXXX'; // All other credit cards.

    return pattern
      .replace(/X/g, char => number.charAt(index++) || '')
      .trim();
  };

  /**
   * Validates the credit card number using the Luhn10 algorithm.
   *
   * @copyright https://gist.github.com/976805
   * @param {String} number Credit card number we should validate.
   * @returns {Boolean}
   * @api public
   */
  validate() {
    const number = this.number;

    let i = number.length;
    let sum = 0;
    let mul = 1;
    let ca;

    //
    // Fast fail case, not enough credit card numbers have been entered. The
    // current shortest range of chars is 12, from Maestro.
    //
    if (i < 12) return false;

    while (i--) {
      ca = number.charAt(i) * mul;
      sum += ca - (ca > 9) * 9;
      mul ^= 3;
    }

    return sum % 10 === 0 && sum > 0;
  };

  /**
   * Applies PAN truncation to the given credit card. PAN (primary account number)
   * trunction simply replaces the credit-card number's digits by asterisks while
   * leaving the last 4 digits untouched, unless keeping the first six is specified.
   * This hides the numbers from strangers while still allowing the card holder
   * with multiple cards to identify which card was used. Keeping the first six is
   * useful to allow business to know what company the card was issued from and
   * track chargebacks.
   *
   * @param {String} replacementChar Replacement character.
   * @param {Boolean} keepFirstSix Keep first six digits of card number.
   * @returns {String} PAN.
   * @api public
   */
  truncate(replacementChar,keepFirstSix) {
    if (!replacementChar) replacementChar = 'X';
    number = this.number.toString().replace(/\D/g, '');

    var pattern = exports.format(number),
      startPosition = keepFirstSix === true ? 6 : 0,
      endPosition = number.length - 4,
      currentPosition = 0;

    return pattern.replace(/\d/g, function replace(char) {
      currentPosition++;
      return currentPosition > startPosition && currentPosition <= endPosition
        ? replacementChar
        : char;
    });
  };

  /**
   * Parse the credit card information all at once.
   *
   * @param {Boolean} keepFirstSix Keep first six digits of card number.
   * @returns {CreditCardInformation}
   * @api public
   */
  parse(keepFirstSix) {
    const number = this.number;
    const scheme = this.getCardScheme();

    return new CreditCardInformation({
      iin: number.slice(0, 9),
      mii: CreditCard.MII[Number(number.charAt(0))],
      formatted: this.format(),
      cvv:
        scheme === 'American Express'
          ? 4 // American Express requires 4 digits.
          : 3, // All other credit cards.
      truncated: this.truncate(null, keepFirstSix),
      scheme,
      valid: this.validate()
    };
  });


  /**
   * Validates the expiry number.
   *
   * @returns {Boolean}
   * @api public
   */
  validateExpiryNumber() {
    if (!this.expiryNumber) return false;
    return this.expiryNumber.validate();
  };
}

CreditCard.CreditCardInformation = CreditCardInformation;
CreditCard.ExpiryNumber = ExpiryNumber;
CreditCard.MII = MII;
CreditCard.testNumbers = testNumbers;

module.exports = CreditCard;
