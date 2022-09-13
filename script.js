const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdown-form');
const dateElement = document.getElementById('date-picker');

const countdownElement = document.getElementById('countdown');
const countdownElementTitle = document.getElementById('countdown-title');
const timeElements = document.querySelectorAll('span');
const resetBtn = document.getElementById('reset');

const completeElement = document.getElementById('complete');
const completeInfo = document.getElementById('complete-info');
const newCountdownBtn = document.getElementById('new-countdown');

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

let countdown;
let countdownValue;
let countdownActive;

// Date Input Validation - Set Minimum to Today
const today = new Date().toISOString().split('T')[0];
dateElement.setAttribute('min', today);

// Update DOM with corresponding containers at one-second intervals
function updateDOM() {
    countdownValue = new Date(countdown.date).getTime();    // Get Epoch Time for countdown time
    countdownActive = setInterval(() => {
        const now = new Date().getTime();   // Get Epoch Time for now
        const diff = countdownValue - now;

        const days = Math.floor(diff / day);
        const hours = Math.floor((diff % day) / hour);
        const minutes = Math.floor((diff % hour) / minute);
        const seconds = Math.floor((diff % minute) / second);

        // Hide Input div, Show complete or countdown div based on diff value
        inputContainer.hidden = true;
        if (diff < 0) {
            countdownElement.hidden = true;
            clearInterval(countdownActive);
            completeInfo.textContent = `${countdown.title} finished on ${countdown.date}`;
            completeElement.hidden = false;
        } else {
            countdownElementTitle.textContent = `${countdown.title}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;
            completeElement.hidden = true;
            countdownElement.hidden = false;
        }
    }, second);
}

function updateCountdown(event) {
    event.preventDefault();
    countdown = {
        title: event.srcElement[0].value,
        date: event.srcElement[1].value,
    };
    localStorage.setItem('countdown', JSON.stringify(countdown));
    updateDOM();
}

function resetCountdown() {
    clearInterval(countdownActive);
    countdown = {};
    countdownForm.reset();
    countdownElement.hidden = true;
    completeElement.hidden = true;
    inputContainer.hidden = false;
    localStorage.removeItem('countdown');
}

function restoreFromLocalStorage() {
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        countdown = JSON.parse(localStorage.getItem('countdown'));
        updateDOM();
    }
}

// Event Listeners
countdownForm.addEventListener('submit', updateCountdown);
resetBtn.addEventListener('click', resetCountdown);
newCountdownBtn.addEventListener('click', resetCountdown);

// On load
restoreFromLocalStorage();