/**
 * Globals
 */

// Top cities
export const RANDOM_CITIES = [
  "Paris",
  "Berlin",
  "Rome",
  "Barcelona",
  "Budapest",
  "Vienna",
];

export const PARTICIPANT_TEMPLATE = {
  id: 0,
  age: 18,
  category: 1,
};

// Trip request parameters initialisation

// * Participatns
export var participants = [
  {
    id: 0,
    age: 18,
    category: 1,
  },
];

/**
 * Empty select element
 * @param {HTMLSelectElement} listElem
 */
export function empty(listElem) {
  hide(listElem);
  while (listElem.options.length) {
    listElem.remove(0);
  }
  // cities = [];
  return listElem;
}

/**
 * Hide HTML element
 * @param {HTMLElement} elem
 */
export function hide(elem) {
  elem.style.display = "none";
  return elem;
}

/**
 * Show HTML element using specific display
 * (Block display by default)
 * @param {HTMLElement} elem
 * @param {string} display
 * @returns {HTMLElement}
 */
export function show(elem, display = "block") {
  elem.style.display = display;
  return elem;
}

/**
 * Update cities in the typeahead selection list
 * @param {TfLocation[]} data
 */
export function updateList(data) {
  const list = empty(document.getElementById("destList"));
  for (const dest of data) {
    const option = document.createElement("option");
    option.value = dest.gygId;
    option.text = dest.name;
    list.add(option);
  }
  show(list, "block");
}

/**
 * Update the welcome image with the city selected by the user
 * @param {TfLocation} location
 */
export function updateImage(location) {
  const imageDiv = document.getElementById("cityImage");
  const imageHL = location.headerLogos.filter((hl) => hl.type === "mobile");
  const imageURL =
    imageHL.length > 0 ? imageHL[0].url : location.headerLogos[0].url;
  imageDiv.style.backgroundImage = `url(${imageURL})`;
}

/**
 * Get all the day dates between startDate and endDate (inclusive)
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Array.<string>} range of dates
 */
export function datesRangeFromTo(startDate, endDate) {
  let range = [];
  let start = startDate < endDate ? startDate : endDate;
  let end = startDate < endDate ? endDate : startDate;
  for (let day = start; day <= end; day.setDate(day.getDate() + 1)) {
    range.push(day.toISOString().slice(0, 10));
  }
  return range;
}

/**
 * Generate HTMl input for a participant
 * @param {Participant} participant
 * @returns {HTMLElement}
 */
export function getHTMLFromParticipant(participant) {
  return `
  <label for="part${participant.id}">
    Participant ${participant.id + 1}
  </label>
  <input
    type="number"
    id="part${participant.id}"
    value="${participant.age}"
    onchange="changeParticipant(this, ${participant.id})"
  />
  `;
}

/**
 * Format request body for tripRequest
 * @returns {TfTripRequest} The formatted triprequest
 */
export function formatRequest() {
  return {
    date: window.dates,
    dest_name: document.getElementById("city").value,
    dest_type: "city",
    participants: participants,
  };
}

/**
 * Get visitor id from local storage.
 * If absent, get it from the server
 */
export async function getVisitorId() {
  if (!localStorage.getItem("visitor-id")) {
    return await requestVisitorId();
  } else {
    return localStorage.getItem("visitor-id");
  }
}
