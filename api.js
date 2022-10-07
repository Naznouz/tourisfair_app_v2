/**
 * Globals
 *
 */

import "./typedefs.js";

// API Constants
export const BASE_URL = "https://api.tourisfair.de/api/v1";
export const SEARCH_VERB = "/locations/search";
export const TRIPREQUEST_VERB = "/triprequests";
export const NEW_VISITOR_VERB = "/visitors/new";

/**
 * A monad representing a fetch request to Tourisfair API.
 * @param {TfQueryRequest} query
 * @returns {Promise<TfSuccessArrayResponse>|Promise<TfSuccessResponse>} data response
 */
export async function tfFetch(query) {
  const url = BASE_URL + query.verb + query.parameters;
  // TODO: should catch errors and check for incorrect HTTP statuses
  return await fetch(url, query.options)
    .then((res) => res.json())
    .then((json) => json.data);
}

/**
 * Search for the cities starting with input
 *
 * @param {string} input
 * @returns {TfSuccessArrayResponse} an array of locations
 */
export async function searchLocation(input) {
  /**
   * @type TfQueryRequest
   */
  const query = {
    verb: SEARCH_VERB,
    parameters: `?type=city&name=/^${input}/gi`,
    options: {},
  };

  return await tfFetch(query);
}

/**
 * Get the information about the triprequest.
 *
 * @param {number} tripId
 * @returns {TfSuccessResponse} Trip data (request and plan)
 */
export async function getTrip(tripId) {
  /**
   * @type TfQueryRequest
   */
  const query = {
    verb: TRIPREQUEST_VERB + "/" + tripId,
    parameters: "",
    options: {},
  };

  return await tfFetch(query);
}

/**
 * Get visitor id from server
 * @returns {string} Visitor Id (uuid)
 */
export async function requestVisitorId() {
  /**
   * @type TfQueryRequest
   */
  const query = {
    verb: NEW_VISITOR_VERB,
    parameters: "",
    options: {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        signature: "tourisfair_front_app",
      }),
    },
  };
  return await tfFetch(query).then((data) => {
    console.log("Visitor ID: ", data.visitorId);
    localStorage.setItem("visitor-id", data.visitorId);
    return data.visitorId;
  });
}

/**
 * Process the triprequest and plan it.
 * @param {TfTripRequest} tripRequest
 * @param {string}        visitorId
 * @returns {TfSuccessResponse} The response data that will
 *                              contain the triprequest id
 *                              to make the follow-up.
 */
export async function process(tripRequest, visitorId) {
  /**
   * @type TfQueryRequest
   */
  const query = {
    verb: TRIPREQUEST_VERB,
    parameters: "",
    options: {
      method: "POST",
      headers: {
        accept: "application/json",
        "visitor-id": visitorId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tripRequest),
    },
  };
  return await tfFetch(query);
}
