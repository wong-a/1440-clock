import { getSettings, saveSettings } from './settings.js'

const enableForm = (form) => {
  [...form.elements].forEach(elem => elem.disabled = false)
}

const disableForm = (form) => {
  [...form.elements].forEach(elem => elem.disabled = true)
}

const loadSavedSettings = async (form) => {
  const { startHour, hoursToDisplay, showMs } = await getSettings()
  if (startHour) form.elements['startHour'].value = startHour
  if (hoursToDisplay) form.elements['hoursToDisplay'].value = hoursToDisplay
  form.elements['showMs'].checked = !!showMs
}

const attachEventListeners = (form) => {
  form.addEventListener('submit', (event) => {
    disableForm(form)
    event.preventDefault()
    saveSettings(form)
    enableForm(form)
  })

  form.addEventListener('reset', (event) => {
    disableForm(form)
    saveSettings(form)
    enableForm(form)
  })
}

;(async () => {
  const form = document.getElementById('settings')

  await loadSavedSettings(form)
  attachEventListeners(form)
  enableForm(form)
})()
