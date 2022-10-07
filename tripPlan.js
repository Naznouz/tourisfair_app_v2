export const tripPlan = (plan, loading) => {
  console.log(plan);
  let planSection = document.createElement("ul");
  planSection.id = "tripPlan";
  plan.forEach((day) => {
    planSection.appendChild(dayTab(day, loading));
  });
  return planSection;
};

function dayTab(day, loading = false) {
  var daySection = document.createElement("li");
  daySection.id = dayDate(day);
  daySection.innerHTML = loading
  ? 'Loading...'
  : `
    <a href='#${dayDate(day)}'>${dayDate(day)}</a>
  `;
  daySection.appendChild(activities(day));
  return daySection;
}

function dayDate(day) {
  let date = new Date(day.date);
  return date.toLocaleDateString(navigator.language, {
    day: "numeric",
    month: "short",
  });
}

function activities(day) {
  const actSection = document.createElement("ul");
  day.activities.forEach((act) => {
    var actChild = activitySection(act);
    actSection.appendChild(actChild);
  });
  return actSection;
}

function activitySection(act) {
  const actItem = document.createElement("li");
  actItem.innerHTML = `
  <style>
    #act${act.activity_gyg_id} {
      background-image: url('${act.activity_image.url}');
    }
  </style>
  <dl>
    <dt>
      ${act.start_time.substr(11, 5)} -
      ${act.end_time.substr(11, 5)}
    </dt>
    <dd id="act${act.activity_gyg_id}" >
      <details>
        <summary>
          ${act.activity_title}
        </summary>
        <em>${act.option_title}</em>
      </details>
    </dd>
  </dl>
  `;
  return actItem;
}
