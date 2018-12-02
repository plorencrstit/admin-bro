const NotImplementedError = require('../../utils/not-implemented-error')
const TITLE_COLUMN_NAMES = ['title', 'name', 'subject']

/**
 * Represents resource properties
 */
class BaseProperty {

  /**
   * @param  {Object} options
   * @param  {String} options.path property path: usually it its key but when
   *                               property is for an object the path can be
   *                               divided to parts by dots: i.e. 'address.street'
   * @param  {String} options.type on if: id, string, float, number, boolean, date
   */
  constructor({ path, type }) {
    this._path = path
    this._type = type
  }

  /**
   * Name of the property
   * @return {String} name of the property
   */
  name() {
    return this._path
  }

  /**
   * Return type of a property
   * @return {String} One of available property types:
   *                      [id, string, float, number, boolean, date]
   */
  type() {
    return this._type || 'string'
  }

  /**
   * Indicates if given property should be visible
   * @return {Boolean}
   */
  isVisible() {
    return true
  }

  /**
   * Indicates if value of given property can be updated
   * @return {Boolean}
   */
  isEditable() {
    return true
  }

  /**
   * Returns true if given property is a uniq key in a table/collection
   * @return {Boolean}
   */
  isId() {
    return false
  }
}

module.exports = BaseProperty