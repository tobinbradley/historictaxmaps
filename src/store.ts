import { writable, readable } from 'svelte/store'

export const imgBaseUrl = readable('//maps.co.mecklenburg.nc.us/unrecordedmaps/scans/')

export let imgUrl = writable("001%20cowans%20ford%20project%20mcguire.jpg")
export let years = writable([1970, 1971, 1972])
export let book = writable()
export let records = writable([
  {
    id: 1,
    year: 1970,
    book: '001',
    page: '01',
    url: "001%20cowans%20ford%20project%20mcguire.jpg"
  },
  {
    id: 2,
    year: 1970,
    book: '001',
    page: '01',
    url: "001%20martin_marietta%20co.jpg"
  },
  {
    id: 3,
    year: 1970,
    book: '001',
    page: '01',
    url: "001%20cowans%20ford%20project%20mcguire.jpg"
  },
  {
    id: 1,
    year: 1970,
    book: '001',
    page: '01',
    url: "001%20cowans%20ford%20project%20mcguire.jpg"
  }
])

// set year list based on fetch
// set book list based on subscribe to year
// set page list based on subscribe to book
// if img url in hash load it and fetch other attributes or
