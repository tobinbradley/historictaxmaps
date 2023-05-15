import { writable, readable } from 'svelte/store'

export const selected = writable({
  book: '001',
  page: '01',
  year: 1970,
  file: '1970-001Index.webp'
})

export const imgBaseUrl = readable('//maps.co.mecklenburg.nc.us/taxmaps/')
export const book = writable('001')

// Handle nav events
let browserNav = false

function readHash() {
  const arg = window.location.hash.replace('#', '')
  if (arg.length > 1) {
    fetch(
      `https://api.mcmap.org/v1/query/historic_tax_maps?columns=year,book,page,file&filter=file='${arg}'&sort=year%2C%20book%2C%20CASE%20WHEN%20page%20~%20'%5E%5Ba-zA-Z%5D'%20THEN%201%20WHEN%20page%20~%20'%5E%5B0-9%5D'%20THEN%202%20END`
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.length === 1) {
          selected.set(json[0])
        }
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        )
      })
  }
}
readHash()

selected.subscribe(val => {
  if (!browserNav) history.pushState( {} , '', `#${val.file}` )
  browserNav = false
})
window.addEventListener('popstate', (event) => {
  browserNav = true
  readHash()
})
