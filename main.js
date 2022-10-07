/**
 * Imports
 */
import { searchLocation, getTrip, requestVisitorId, process } from "./api.js";
import {
  RANDOM_CITIES,
  PARTICIPANT_TEMPLATE,
  hide,
  show,
  empty,
  updateList,
  updateImage,
  participants,
  getHTMLFromParticipant,
  datesRangeFromTo,
  formatRequest,
  getVisitorId,
} from "./common.js";
import { tripPlan } from "./tripPlan.js";
import "./typedefs.js";

/**
 * Globals
 */
// Cities list for dropdown
var cities = [];
// * Liste des dates à planifier
window.dates = [];

/**
 * Initialize the display of the plan request
 * Called when page is loaded.
 */
window.initPlan = () => {
  const input = RANDOM_CITIES[Math.floor(Math.random() * RANDOM_CITIES.length)];
  searchLocation(input).then((data) => {
    updateImage(data[0]);
  });
};

/**
 * Search locations that starts with user's input
 * @param {string} input
 */
window.search = (input) => {
  // if input less than 2 characters, then do nothing
  if (input.length < 3) return;

  empty(document.getElementById("destList"));
  searchLocation(input).then((data) => {
    cities = data;
    updateList(data);
  });
};

/**
 * Load trip planning page without removing data.
 */
window.back = () => {
  hide(document.getElementById("tripPlanContainer"));
  show(document.getElementById("tripRequest"));
};

/**
 * Load trip planning page
 */
window.planTrip = () => {
  hide(document.getElementById("tripPlanContainer"));
  window.search("");
  show(document.getElementById("tripRequest"), "flex");
};

/**
 * Set the current city to the user's selected one
 * @param {number} index
 */
window.selectCity = (index) => {
  updateImage(cities[index]);
  document.getElementById("city").value = cities[index].name;
  empty(document.getElementById("destList"));
  show(document.getElementById("dates"), "flex");
};

window.addParticipant = () => {
  const inputParticipants = document.getElementById("participantsList");
  const participantSection = document.createElement("section");

  const participant = PARTICIPANT_TEMPLATE;
  participant.id = participants.length;
  participants.push(participant);

  participantSection.id = "participant" + participant.id;
  participantSection.innerHTML += getHTMLFromParticipant(participant);

  inputParticipants.appendChild(participantSection);
};

window.removeParticipant = () => {
  // I don't think the following algorithm will
  // guarantee correct identification of participants...
  // Should be checked
  if (participants.length === 0) return;
  participants.pop();
  const participantsList = document.getElementById("participantsList");
  participantsList.children[participantsList.children.length - 1].remove();
};

/**
 * Select date
 */
window.selectDate = () => {
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;
  if (start === "") return;
  if (end === "") return;
  const startDate = new Date(start);
  const endDate = new Date(end);
  window.dates = datesRangeFromTo(startDate, endDate);
  show(document.getElementById("participants"), "flex");
  show(document.getElementById("requestActions"), "flex");
};

/**
 *
 * @param {Event} e
 * @param {number} id
 */
window.changeParticipant = (e, id) => {
  participants[id].age = e.value;
};

/**
 * Get the plan from the server.
 * The returned triprequest id is pushed to the localStorage
 */
window.getPlan = async () => {
  const tripRequest = formatRequest();
  console.log("Trip request:", tripRequest);
  const visitorId = await getVisitorId();
  console.log(visitorId);
  process(tripRequest, visitorId).then((data) => {
    console.log("Triprequest id:", data);
    localStorage.setItem("trip", data);
    window.loadTrip(data);
  });
}

/**
 * Load trip plan from server
 * @param {string} tripId
 */
window.loadTrip = (tripId) => {
  hide(document.getElementById("tripRequest"));
  show(document.getElementById("tripPlanContainer"));
  let isFinished = false;
  var loading = 0;
  loading = setInterval(() => {
    getTrip(tripId).then((data) => {
      let tripPlanElement = document.querySelector("#tripPlanContainer > ul");
      if(data.plan === "undefined") return;
      isFinished = data.plan.every(day => day.progress === "finished");
      tripPlanElement.parentNode.replaceChild(
        show(tripPlan(data.plan, !isFinished), "flex"),
        tripPlanElement
      );
    })
    if (isFinished) {
      clearInterval(loading);
    }
  }, 1000);
};
