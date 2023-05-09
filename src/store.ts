import { writable, readable } from 'svelte/store'

export const imgBaseUrl = readable('//maps.co.mecklenburg.nc.us/taxmaps/')
export let imgUrl = writable("1970-001Index.webp")
export let imgTitle = writable('')
export const book = writable('001')
export const books = writable([])
export const records = writable([])

// Handle nav events
let browserNav = false

function readHash() {
  const arg = window.location.hash.replace('#', '')
  if (arg.length > 1) {
    imgUrl.set(arg)
    book.set(arg.substring(5, 8))
  }
}
readHash()

imgUrl.subscribe(val => {
  if (!browserNav) history.pushState( {} , '', `#${val}` )
  browserNav = false
})
window.addEventListener('popstate', (event) => {
  browserNav = true
  readHash()
})

// fetch books
fetch('https://api.mcmap.org/v1/query/historic_tax_maps?columns=distinct(book)%20as%20book&sort=book')
  .then(response => response.json())
  .then(json => {
    books.set(json)
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  })

// fetch records
book.subscribe(val => {
  fetch(`https://api.mcmap.org/v1/query/historic_tax_maps?columns=year%2C%20book%2C%20page%2C%20file&filter=book%3D'${val}'&sort=year%2C%20book%2C%20CASE%20WHEN%20page%20~%20'%5E%5Ba-zA-Z%5D'%20THEN%201%20WHEN%20page%20~%20'%5E%5B0-9%5D'%20THEN%202%20END`)
    .then(response => response.json())
    .then(json => {
      records.set(json)
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    })
})
