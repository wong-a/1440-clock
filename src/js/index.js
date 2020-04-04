import { Clock } from './clock.js'
import { getSettings } from './settings.js'

;(async () => {
  const {
    startHour,
    hoursToDisplay,
    showMs
  } = await getSettings()
  const targetEl = document.getElementById('clock')
  const clock = new Clock(targetEl, startHour, hoursToDisplay, showMs)
  clock.start()
})()