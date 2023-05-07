<script lang="ts">
  import { onMount } from "svelte"
  import "leaflet/dist/leaflet.css"
  import L from "leaflet"
  import { imgUrl, imgBaseUrl, imgTitle } from "../store"

  let imgViewer
  let imgLayer
  let map

  $: if ($imgUrl && map) {
		loadImg()
	}


  onMount(async () => {
    const L = await import("leaflet")

    map = L.map(imgViewer, {
      maxZoom: 4,
      minZoom: 0,
      center: [0, 0],
      zoom: 1,
      preferCanvas: true,
      zoomSnap: 0.1,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 120,
      crs: L.CRS.Simple
    })

    map.attributionControl.setPrefix('<a href="https://leafletjs.com/" target="_blank">Leaflet</a>')
    map.attributionControl.addAttribution('<a href="https://gis.mecknc.gov" target="_blank">Mecklenburg County GIS</a>');

  })


  async function loadImg() {
    if (imgLayer) imgLayer.remove()

    // get image dimensions
    const img = new Image()
    img.src = $imgBaseUrl + $imgUrl
    await img.decode()

    // calculate the edges of the image, in coordinate space
    var southWest = map.unproject([0, img.height], map.getMaxZoom() - 1)
    var northEast = map.unproject([img.width, 0], map.getMaxZoom() - 1)
    var bounds = new L.LatLngBounds(southWest, northEast)
    map.fitBounds(bounds)

    imgLayer = L.imageOverlay($imgBaseUrl + $imgUrl, bounds).addTo(map)
  }
</script>

<style>
  .map {
    @apply bg-gray-300;
  }
</style>

<div class="inline-block absolute top-0 right-0 text-white z-50 bg-blue-700 px-4 py-1 rounded-bl border-b-4 border-l-4 border-white font-bold text-lg">{$imgTitle}</div>

<div class="map h-full w-full z-0" bind:this={imgViewer} />

<a class="absolute bottom-3 left-3 px-4 py-3 bg-pink-500 text-white z-50 rounded shadow hover:bg-pink-600 transition-all duration-300" href={$imgBaseUrl + $imgUrl} target="_blank" rel="noreferrer">Download</a>
