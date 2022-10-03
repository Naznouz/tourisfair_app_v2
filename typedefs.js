/**
 * Type definitions
 * @typedef HeaderLogo
 * @property {string} type
 * @property {string} url
 *
 * @typedef {Object} TfLocation
 * @property {number} gygId
 * @property {string} name
 * @property {HeaderLogo[]} headerLogos
 *
 * @typedef {Object} Participant
 * @property {number} id
 * @property {number} age
 * @property {number} category
 *
 * @typedef {Object} TfQueryRequest
 * @property {string} verb
 * @property {string} [parameters=""]
 * @property {Object} [options={}]
 *
 * @typedef {Object} TfSuccessResponse
 * @property {('success'|'failure')} status - Response status
 * @property {Object} data - Result data
 *
 * @typedef {Object} TfSuccessArrayResponse
 * @property {('success'|'failure')} status
 * @property {Array} data   - Result data for the current page
 * @property {number} page  - Current page of results
 * @property {number} pages - Total number of pages
 * @property {number} limit - Limit or size of a page of result
 * @property {number} total - Total number of results
 *
 * @typedef {Object} TfParticipant
 * @property {number} age
 * @property {number} category
 *
 * @typedef {Object} TfTripRequest
 * @property {Array.<string>} date
 * @property {string} dest_name
 * @property {('country'|'city'|'poi')} dest_type
 * @property {Array.<TfParticipant>} participants
 */
