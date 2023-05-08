import './app.postcss'
import './lib/registerServiceWorker'
import Viewer from './lib/Viewer.svelte'
import Gallery from './lib/Gallery.svelte'


new Viewer({
  target: document.getElementById("viewer")
})
new Gallery({
  target: document.getElementById("gallery")
})
