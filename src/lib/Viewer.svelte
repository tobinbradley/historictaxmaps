<script lang="ts">
  import { onMount } from "svelte"
  import "leaflet/dist/leaflet.css"
  import L from "leaflet"
  import { selected, imgBaseUrl } from "../store"

  let imgViewer
  let imgLayer
  let map

  $: if ($selected && map) {
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
    img.src = $imgBaseUrl + $selected.file
    await img.decode()

    // calculate the edges of the image, in coordinate space
    var southWest = map.unproject([0, img.height], map.getMaxZoom() - 1)
    var northEast = map.unproject([img.width, 0], map.getMaxZoom() - 1)
    var bounds = new L.LatLngBounds(southWest, northEast)
    map.fitBounds(bounds)

    imgLayer = L.imageOverlay($imgBaseUrl + $selected.file, bounds).addTo(map)
  }
</script>

<style>
  .map {
    /* @apply absolute top-0 bottom-0 left-0 right-0; */
    box-shadow: inset 8px 8px 18px rgba(0,0,0,0.5);
    background-color: #e5e5e5;
    background-image:  linear-gradient(#404040 1px, transparent 1px), linear-gradient(to right, #404040 1px, #e5e5e5 1px);
    background-size: 20px 20px;
  }
  #imgtitle {
    box-shadow: 8px 8px 18px rgba(0,0,0,0.5);
  }
  .icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    stroke-width: 0;
    stroke: currentColor;
    fill: currentColor;
  }
</style>

<!-- info and download button -->
<div id="imgtitle"
  class="inline-block absolute top-0 right-0 rounded-bl-md text-neutral-100 z-50 bg-neutral-700 px-2 py-1 text-lg"
  >
  <div class="flex justify-center items-center">
    <div class="hidden lg:block mr-2">
      {$selected.year} {$selected.book}-{$selected.page}
    </div>
    <div class="mb-1">
      <a title="Download Tax Map"
        download={$selected.year + ' ' + $selected.book + '-' + $selected.page + '.webp'}
        class="px-2 pb-1 border border-neutral-500 hover:border-yellow-300 hover:text-yellow-300 duration-300 trasition-colors ease-in-out rounded-md"
        href={$imgBaseUrl + $selected.file}
        target="_blank"
      >
        <svg class="icon icon-folder-download"><use xlink:href="#icon-folder-download"></use></svg>
      </a>
    </div>
  </div>
</div>

<!-- download svg -->
<symbol id="icon-folder-download" viewBox="0 0 32 32">
<path d="M18 8l-4-4h-14v26h32v-22h-14zM16 27l-7-7h5v-8h4v8h5l-7 7z"></path>
</symbol>

<!-- leaflet map -->
<div class="map w-full h-full z-0" bind:this={imgViewer} />
