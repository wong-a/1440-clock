import {
  HOURS_IN_DAY,
  MINS_IN_HOUR,
  SECS_IN_MIN,
  MS_IN_SECS,
} from './constants.js'

// Calculate the vertical margins of an element
const getElementVertMarginHeight = el => {
  var styles = window.getComputedStyle(el);
  return (
    parseFloat(styles['marginTop']) +
    parseFloat(styles['marginBottom'])
  );
};

// Get the total height of an element, including the margins
const getElementTotalHeight = el =>
  Math.ceil(getElementVertMarginHeight(el) + el.offsetHeight);

const shiftHours = (hour, startHour) => (hour + startHour) % HOURS_IN_DAY;
// Prefix targetNum with zeros up to the specified digits
const zeroPad = (targetNum, digits = 2) =>
  '0'.repeat(digits - String(targetNum).length) + targetNum;

// Create the HTML for a single hour progress bar
const createHourBar = hour => {
  // Create the progress bar filler
  const hourProgBarFill = document.createElement('div')
  hourProgBarFill.className = 'hour-prog-bar-fill-complete'

  // Create the progress bar itself, append the filler
  const hourProgBar = document.createElement('div')
  hourProgBar.className = 'hour-prog-bar'
  hourProgBar.appendChild(hourProgBarFill)

  // Create the label with the hour
  const hourProgBarLabel = document.createElement('div')
  hourProgBarLabel.className = 'hour-prog-bar-label'
  hourProgBarLabel.innerText = zeroPad(hour)

  // Create the hour's wrapper, append the label and prog bar
  const hourProgBarWrap = document.createElement('div')
  hourProgBarWrap.id = 'hour-' + zeroPad(hour)
  hourProgBarWrap.className = 'hour-prog-bar-wrap'
  hourProgBarWrap.appendChild(hourProgBarLabel)
  hourProgBarWrap.appendChild(hourProgBar)

  return hourProgBarWrap;
}

export class Clock {
  constructor(elem, startHour, hoursToDisplay, showMs) {
    this.startHour = startHour
    this.hoursToDisplay = hoursToDisplay
    this.showMs = showMs
    this.displayUpdateIntervalMs = this.showMs ? 100 : 1000

    for (let h = 0; h < hoursToDisplay; ++h) {
      elem.appendChild(createHourBar(shiftHours(h, this.startHour)))
    }
  }

  update() {
    const date = new Date();
    const hours = date.getHours()
    const mins = date.getMinutes()
    const secs = date.getSeconds()
    const ms = date.getMilliseconds()

    for (let h = 0; h < this.hoursToDisplay; ++h) {
      const shiftedHours = shiftHours(h, this.startHour)

      const hourProgBarFill = document.querySelector(
        `#hour-${zeroPad(
                shiftedHours,
            )} .hour-prog-bar-fill-complete`,
      )
      const hourProgBarLabel = document.querySelector(
        `#hour-${zeroPad(shiftedHours)} .hour-prog-bar-label`,
      )

      // Past - Start by assuming the hour's 100% over
      if (shiftedHours < hours) {
        hourProgBarFill.style.width = '100%'

        hourProgBarLabel.innerText = zeroPad(shiftedHours)
        hourProgBarLabel.style.color = 'darkgrey'
        hourProgBarLabel.style.fontWeight = '400'
      }

      // Present - If it's the current hour, calculate the percent
      // of the hour that's complete
      else if (shiftedHours === hours) {
        const fractionOfSec = ms / MS_IN_SECS
        const fractionOfMin =
          (secs + fractionOfSec) / SECS_IN_MIN
        const fractionOfHour =
          (mins + fractionOfMin) / MINS_IN_HOUR
        const tenthOfSec = Math.floor(ms / 100)
        const percentHourOver = fractionOfHour * 100

        hourProgBarFill.style.width = percentHourOver + '%'

        // Set the label to the current time
        hourProgBarLabel.innerText = `${zeroPad(
                shiftedHours,
            )}:${zeroPad(mins)}:${zeroPad(secs)}`
        hourProgBarLabel.style.color = 'white'
        hourProgBarLabel.style.fontWeight = '700'

        if (this.showMs) {
          hourProgBarLabel.innerText += `.${tenthOfSec}`
        }
      }

      // Future - If it's a future hour, it's completely full
      else if (shiftedHours > hours) {
        hourProgBarFill.style.width = '0'

        hourProgBarLabel.innerText = zeroPad(shiftedHours)
        hourProgBarLabel.style.color = 'lightgrey'
        hourProgBarLabel.style.fontWeight = '400'
      }

      // Set the bar height such that the clock height completely
      // fills the screen without getting smashed
      const bodyVertMargins = getElementVertMarginHeight(
        document.querySelector('body'),
      )
      const hourProgBarFillVertMargins = getElementVertMarginHeight(
        hourProgBarFill,
      )
      const progBarLabelTotalHeight = getElementTotalHeight(
        hourProgBarLabel,
      )
      const newProgBarHeight =
        (window.innerHeight -
          bodyVertMargins -
          this.hoursToDisplay * hourProgBarFillVertMargins) /
        this.hoursToDisplay;

      hourProgBarFill.style.height =
        newProgBarHeight >= progBarLabelTotalHeight ?
        newProgBarHeight :
        progBarLabelTotalHeight;
    }
  }

  start() {
    this.update()
    setInterval(
      () => requestAnimationFrame(this.update.bind(this)),
      this.displayUpdateIntervalMs
    )
  }
}