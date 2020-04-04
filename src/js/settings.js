import { HOURS_IN_DAY } from './constants.js'

const SETTING_KEYS = ['startHour', 'hoursToDisplay', 'showMs']

const getSettings = async () => {
  const DEFAULT_START_HOUR = 0;
  const DEFAULT_HOURS_TO_DISPLAY = HOURS_IN_DAY;

  const {
    startHour,
    hoursToDisplay,
    showMs
  } = await new Promise((resolve) => {
    chrome.storage.sync.get(
      SETTING_KEYS,
      (result) => resolve(result)
    )
  })

  return {
    startHour: startHour ?
      parseInt(startHour, 10) :
      DEFAULT_START_HOUR,
    hoursToDisplay: parseInt(hoursToDisplay, 10) ?
      Math.min(parseInt(hoursToDisplay, 10), HOURS_IN_DAY) :
      DEFAULT_HOURS_TO_DISPLAY,
    showMs,
  }
}

const saveSettings = (form) => {
  const inputsIds = SETTING_KEYS
  const settings = inputsIds.reduce((options, inputId) => {
    const formField = form.elements[inputId]
    options[inputId] = (formField.type === 'checkbox')
      ? formField.checked
      : formField.value

    return options
  }, {})
  chrome.storage.sync.set(settings)
}

export {
  getSettings,
  saveSettings,
}