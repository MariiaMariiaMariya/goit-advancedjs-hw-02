import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dateInput = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');

const timerFields = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let intervalId = null;

startButton.disabled = true;

function showDateError() {
  iziToast.error({
    message: 'Please choose a date in the future',
    position: 'topRight',
  });
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  dateFormat: 'Y-m-d H:i',
  disableMobile: true,

  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    userSelectedDate = null;
    startButton.disabled = true;

    if (!selectedDate) return;

    if (selectedDate.getTime() <= Date.now()) {
      showDateError();
      return;
    }

    userSelectedDate = selectedDate;
    startButton.disabled = false;
  },
};

flatpickr(dateInput, options);

startButton.addEventListener('click', () => {
  if (intervalId !== null) return;

  if (!userSelectedDate || userSelectedDate.getTime() <= Date.now()) {
    userSelectedDate = null;
    startButton.disabled = true;
    showDateError();
    return;
  }

  startButton.disabled = true;
  dateInput.disabled = true;

  intervalId = setInterval(updateTimer, 1000);

  // Одразу показуємо залишок часу, без очікування першої секунди.
  updateTimer();
});

function updateTimer() {
  const remainingMs = userSelectedDate.getTime() - Date.now();

  if (remainingMs <= 0) {
    renderTime(convertMs(0));

    clearInterval(intervalId);
    intervalId = null;
    userSelectedDate = null;

    dateInput.disabled = false;
    startButton.disabled = true;
    return;
  }

  renderTime(convertMs(remainingMs));
}

function renderTime(time) {
  for (const key of Object.keys(timerFields)) {
    timerFields[key].textContent = addLeadingZero(time[key]);
  }
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}