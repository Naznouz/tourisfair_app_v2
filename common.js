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
  "Vienna"
];

export const PARTICIPANT_TEMPLATE = {
  id: 0,
  age: 18,
  category: 1
};

// Trip request parameters initialisation

// * Participatns
export var participants = [
  {
    id: 0,
    age: 18,
    category: 1
  }
];
// Trips history
// (would be empty, but here just to develop and test)
export var testTrips = ["62e5288606d336069b7c794f"];

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
 * Set current map centered on position "pos".
 * @param {GeolocationPosition} pos
 * @param {number} zoomLevel
 */
export function setCurrentMap(pos, zoomLevel) {
  let mapL = initMapL();
  mapL.setView(
    [pos.coords.latitude, pos.coords.longitude],
    zoomLevel != null ? zoomLevel : 13
  );
  setSelectedCityMarker(pos).addTo(mapL);
}

/**
 * Initialize Leaflet map
 */
export function initMapL() {
  let L = window.L;
  if (!window.mapL) {
    window.mapL = L.map("mapLeaflet");
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> - using Leaftlet"
    }).addTo(window.mapL);
  }

  return window.mapL;
}

/**
 * Set position as selected city marker
 * @param {GeolocationPosition} pos
 */
export function setSelectedCityMarker(pos) {
  let L = window.L;
  removeSelectedCityMarker();
  window.selectedCityMarker = L.marker([
    pos.coords.latitude,
    pos.coords.longitude
  ]);
  return window.selectedCityMarker;
}

/**
 * Remove the selected city marker
 */
export function removeSelectedCityMarker() {
  if (window.selectedCityMarker) {
    window.selectedCityMarker.remove();
  }
}

/**
 * Get day trip activities' bounds
 * @param {*} day
 */
export function getDayTripBounds(day) {
  return day.activities.map((act) => [
    act.coordinates.latitude,
    act.coordinates.longitude
  ]);
}

/**
 * Add marker to map for an activity.
 * @param {activity} act
 * @param {number} zoomLevel
 */
export function addDayPlanMarkers(day) {
  let mapL = initMapL();
  let bounds = getDayTripBounds(day);
  mapL.flyToBounds(bounds, { animate: false });
  setDayTripMarkers(day);
  computeItinerary(bounds);
}

/**
 *
 * @param {number[][]} bounds
 */
function computeItinerary(bounds) {
  let ORS = window.Openrouteservice;
  let orsDirections = new ORS.Directions({
    api_key: "5b3ce3597851110001cf6248cffea99d0c1540d8b26f4594e4d6f74c"
  });

  // Coordinates are not GeoLocationPosition compatible !
  // They need to be adapted
  let coords = bounds.map((b) => b.reverse());
  orsDirections
    .calculate({
      coordinates: [coords[0], coords[1]],
      profile: "driving-car",
      extra_info: ["waytype", "steepness"],
      format: "json"
    })
    .then(function (json) {
      // Add your own result handling here
      console.log(JSON.stringify(json.routes));
      json.routes.forEach((route) => {
        console.log(`Distance: ${route.summary.distance} m`);
        console.log(`Duration: ${route.summary.duration} sec`);
      });
    })
    .catch(function (err) {
      console.error(err);
    });
}

/**
 * Set day trip activities' markers
 * @param {*} day
 */
export function setDayTripMarkers(day) {
  let L = window.L;
  let mapL = initMapL();
  if (window.tripMarkers) {
    removeSelectedCityMarker();
    for (let marker of window.tripMarkers) {
      marker.remove();
    }
  }
  window.tripMarkers = day.activities.map((act) =>
    L.marker([act.coordinates.latitude, act.coordinates.longitude]).addTo(mapL)
  );
}

/**
 * Load previous trips from local storage
 */
export function previousTrips() {
  if (!localStorage.getItem("trips")) {
    // Comment the following 2 lines in prod
    localStorage.setItem("trips", JSON.stringify(testTrips));
    previousTrips();
    return;
  }
  let trips = JSON.parse(localStorage.getItem("trips"));
  const tripsList = document.getElementById("trips");
  addTripsList(trips, tripsList);
}

/**
 * Add trips to the existing UL element
 * @param {string[]} trips
 * @param {HTM} ulElem
 */
export function addTripsList(trips, ulElem) {
  ulElem.innerHTML = "";
  for (let trip of trips) {
    addTripItem(trip, ulElem);
  }
}

/**
 * Add a trip to the UL element
 * @param {string} trip
 * @param {HTMLUListElement} ulElem
 */
export function addTripItem(trip, ulElem) {
  let tripElem = document.createElement("li");
  tripElem.id = trip;
  tripElem.innerHTML = `
      <a href="javascript:loadTrip('${trip}')">${trip}</a>
    `;
  ulElem.appendChild(tripElem);
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
 * Update the displayed map
 * @param {TfLocation} location
 */
export function updateMap(location) {
  var currentPos = {
    coords: {
      latitude: location.coordinates.center.coordinates[1],
      longitude: location.coordinates.center.coordinates[0]
    },
    timestamp: +new Date()
  };
  setCurrentMap(currentPos, location.coordinates.zoomLevel);
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
    participants: participants
  };
}
