const clockElement = document.getElementById("time");
const hourInput = document.getElementById("hour");
const minuteInput = document.getElementById("minute");
const secondInput = document.getElementById("second");
const ampmInput = document.getElementById("ampm");
const alarmsList = document.getElementById("alarms-list");
class AlarmStorage {
  constructor() {
    this.key = "alarms";
  }
  getAlarms() {
    return JSON.parse(localStorage.getItem(this.key)) || [];
  }
  setAlarms(alarmsList = []) {
    localStorage.setItem(this.key, JSON.stringify(alarmsList));
  }
}
const st = new AlarmStorage();

let alarms = [];
// alarms.push({ hour: 1, minute: 2, second: 3, ampm: "am" })
function updateTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  clockElement.textContent = `${formattedHours}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`;
  checkAlarms(hours, minutes, seconds, ampm);
}

function setAlarm() {
  const hour = parseInt(hourInput.value);
  const minute = parseInt(minuteInput.value);
  const second = parseInt(secondInput.value);
  const ampm = ampmInput.value;
  const alarmTime = { hour, minute, second, ampm };
  let result = vlaidateAlarms(alarmTime);
  if (result.length) {
    alert(result.join("\n"));
    return;
  }
  alarms.push(alarmTime);
  st.setAlarms(alarms);
  addAlarmToList(alarmTime);
}
function vlaidateAlarms({ hour, minute, second, ampm }) {
  const err = [];
  if (!hour || !minute || !second || !ampm) {
    err.push("Please input values");
  }
  if (hour > 12 || hour < 0) {
    err.push("hours should be 0-12");
  }

  if (minute > 59 || minute < 0) {
    err.push("minute should be 0-59");
  }
  if (second > 59 || second < 0) {
    err.push("second should be 0-59");
  }

  return err;
}

function addAlarmToList(alarm, index) {
  const li = document.createElement("li");
  const divRow = document.createElement("div");
  const col1 = document.createElement("div");
  const col2 = document.createElement("div");
  const text = document.createElement("div");
  const deleteButton = createDeleteButton();
  //     `
  // <li>
  //     <div class="d-flex flex-row gap-4">
  //         <div class="col">
  //           <div>{alarm text}</div>
  //         </div>
  //         <div class="ms-auto">
  //             <button class="btn btn-danger">Delete</button>
  //         </div>
  //     </div>
  // </li>
  // `

  li.className = "list-group-item";
  divRow.className = "d-flex flex-row gap-4";
  text.className = "align-self-center";
  text.textContent = ` ${alarm.hour}:${alarm.minute
    .toString()
    .padStart(2, "0")}:${alarm.second.toString().padStart(2, "0")} ${
    alarm.ampm
  }`;
  col1.className = "row";
  col1.appendChild(text);
  col2.className = "ms-auto";

  deleteButton.addEventListener("click", () =>
    deleteAlarm(alarms.indexOf(alarm))
  );

  col2.appendChild(deleteButton);

  divRow.appendChild(col1);
  divRow.appendChild(col2);
  li.appendChild(divRow);

  alarmsList.appendChild(li);
}

function createDeleteButton(params) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "btn btn-sm  btn-danger";
  return deleteButton;
}
function deleteAlarm(index) {
  alarms.splice(index, 1);
  alarmsList.innerHTML = "";
  alarms.forEach(addAlarmToList);
  st.setAlarms(alarms);
}

function checkAlarms(hours, minutes, seconds, ampm) {
  alarms.forEach((alarm) => {
    if (alarm.hour === hours % 12 || (alarm.hour === 12 && hours === 0)) {
      if (
        alarm.minute === minutes &&
        alarm.second === seconds &&
        alarm.ampm === ampm
      ) {
        alert("Alarm!"); // Use a better UI than JS alert.
      }
    }
  });
}

alarms = st.getAlarms();
updateTime();
alarms.forEach(addAlarmToList);
setInterval(updateTime, 1000);
