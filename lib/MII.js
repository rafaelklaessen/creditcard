/**
 * Major Industry Identifier.
 *
 * The first digit of a ISO/IEC 7812 issuer identifier number (inn) tells about
 * what industry the card is used. The index of the array should be the first
 * number of the inn.
 *
 * @type {Array}
 * @public
 */
const MII = [
  'ISO/TC 68 and other industry assignments',
  'Airlines',
  'Airlines and other future industry assignments',
  'Travel and entertainment and banking/financial',
  'Banking and financial',
  'Banking and financial',
  'Merchandising and banking/financial',
  'Petroleum and other future industry assignments',
  'Healthcare, telecommunications and other future industry assignments',
  'For assignment by national standards bodies'
];

module.exports = MII;
