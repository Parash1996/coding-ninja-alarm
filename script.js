const clockElement = document.getElementById('time');
const hourInput = document.getElementById('hour');
const minuteInput = document.getElementById('minute');
const secondInput = document.getElementById('second');
const ampmInput = document.getElementById('ampm');
const alarmsList = document.getElementById('alarms-list');
let alarms = [];

function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12) || 12;
    clockElement.textContent = `${formattedHours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
    checkAlarms(hours, minutes, seconds, ampm);
}

function setAlarm() {
    const hour = parseInt(hourInput.value);
    const minute = parseInt(minuteInput.value);
    const second = parseInt(secondInput.value);
    const ampm = ampmInput.value;
    const alarmTime = { hour, minute, second, ampm };
    alarms.push(alarmTime);
    addAlarmToList(alarmTime);
}

function addAlarmToList(alarm) {
    const li = document.createElement('li');
    li.textContent = `${alarm.hour}:${alarm.minute.toString().padStart(2, '0')}:${alarm.second.toString().padStart(2, '0')} ${alarm.ampm}`;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteAlarm(alarms.indexOf(alarm)));
    li.appendChild(deleteButton);
    alarmsList.appendChild(li);
}

function deleteAlarm(index) {
    alarms.splice(index, 1);
    alarmsList.innerHTML = '';
    alarms.forEach(addAlarmToList);
}

function checkAlarms(hours, minutes, seconds, ampm) {
    alarms.forEach(alarm => {
        if (
            alarm.hour === (hours % 12) ||
            alarm.hour === 12 && hours === 0
        ) {
            if (alarm.minute === minutes && alarm.second === seconds && alarm.ampm === ampm) {
                alert('Alarm!'); // Use a better UI than JS alert.
            }
        }
    });
}

updateTime();
setInterval(updateTime, 1000);