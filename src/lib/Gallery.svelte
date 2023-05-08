<script lang="ts">
  import { book, books, records, imgUrl, imgBaseUrl, imgTitle } from '../store'

  let taxmaps = []
  let page = '*'
  let year = '*'

  $: if ($book) {
    page = '*'
    year = '*'
  }

  $: if ($imgUrl, $records.length > 0) {
    // highlight selected if there
    const rec = $records.filter(el => el.file === $imgUrl)
    if (rec.length > 0) {
      $imgTitle = `${rec[0].year} ${rec[0].book}-${rec[0].page}`
    }

    filterGallery()
  }

  function filterGallery() {
    taxmaps = [...$records]

    if (page !== '*') {
      taxmaps = taxmaps.filter(el => el.page === page)
    }
    if (year !== '*') {
      taxmaps = taxmaps.filter(el => el.year === year)
    }
  }

</script>

<section class="bg-neutral-200 rounded p-2 mb-2">
  <!-- filters -->
  <div class="flex justify-around gap-x-2">
    <div>
      <label for="book" class="block text-center text-sm font-bold">Book</label>
      <select bind:value={$book} id="book" class=" text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-1 py-2">
        {#each $books as book}
          <option>{book.book}</option>
          {/each}
      </select>
    </div>
    <div>
      <label for="page" class="block text-center text-sm font-bold">Page</label>
      <select bind:value={page} id="page" on:change={filterGallery} class="text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-1 py-2">
        <option>*</option>
        {#each [...new Set($records.map(el => el.page))].sort() as pg}
        <option>{pg}</option>
        {/each}
      </select>
    </div>
    <div>
      <label for="year" class="block text-center text-sm font-bold">Year</label>
      <select bind:value={year} id="year" on:change={filterGallery} class="text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-1 py-2">
        <option>*</option>
        {#each [...new Set($records.map(el => el.year))].sort() as yr}
        <option>{yr}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- show drop down for small screens -->
  <div class="mt-3 mx-4 lg:hidden">
    <select bind:value={$imgUrl} aria-label="Tax Maps" class="w-full text-center text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-1 py-2">
      {#each taxmaps as record}
        <option value={record.file}>{record.year} {record.book}-{record.page}</option>
      {/each}
    </select>
  </div>
</section>

<!-- image gallery area for larger screens -->
<section class="hidden lg:block grow rounded overflow-auto overflow-y-scroll">
  {#each taxmaps as record}
  <div
    class="min-h-10 rounded mb-2 mr-2 text-center hover:shadow cursor-pointer transition-all ease-in-out duration-300 {record.file === $imgUrl ? 'bg-yellow-300':'bg-neutral-100'}"
    on:click={() => $imgUrl = record.file}
    on:keypress={() => $imgUrl = record.file}
    data-file={record.file}
    >
    <img class="block rounded px-1 pt-1" src={$imgBaseUrl + record.file} alt={record.book} loading="lazy">
    <span class="text-sm">{record.year} {record.book}-{record.page}</span>
  </div>
  {/each}
</section>
