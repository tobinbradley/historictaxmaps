import "./app.postcss";
import Filter from './lib/Filter.svelte'
import Viewer from './lib/Viewer.svelte'
import Gallery from './lib/Gallery.svelte'


new Filter({
  target: document.getElementById("filter")
})
new Viewer({
  target: document.getElementById("viewer")
})
new Gallery({
  target: document.getElementById("gallery")
})
