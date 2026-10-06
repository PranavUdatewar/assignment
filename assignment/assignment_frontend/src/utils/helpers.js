export const statusColors = {
  ignition_off: '#e2eef0',
  idling: '#e8770e',
  ignition: '#00b5a5',
  alert: '#a8973a',
}

export const statusLabels = {
  ignition_off: 'Ignition Off',
  idling: 'Idling',
  ignition: 'Ignition',
  alert: 'Alert',
}

export const toDateString = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export const daysAgo = (days) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return toDateString(date)
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const shortDate = (value) => {
  const date = new Date(value + 'T00:00:00')
  return date.getDate() + ' ' + months[date.getMonth()]
}

export const longDate = (value) => {
  return new Date(value + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export const shortNumber = (value) => {
  if (value >= 1000) {
    return (value / 1000).toFixed(1).replace('.0', '') + 'k'
  }
  return value
}
