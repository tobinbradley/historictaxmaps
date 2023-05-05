import { writable, readable, derived } from 'svelte/store'

export const imgBaseUrl = readable('//maps.co.mecklenburg.nc.us/taxmaps/')
export let imgUrl = writable("1970-00101.webp")
export let imgTitle = writable('')
export const book = writable('001')
export const books = writable([])
export const records = writable([])


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
  fetch(`https://api.mcmap.org/v1/query/historic_tax_maps?columns=year%2C%20book%2C%20page%2C%20file&filter=book%3D'${val}'&sort=year%2C%20book%2C%20page`)
    .then(response => response.json())
    .then(json => {
      records.set(json)
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    })
})
