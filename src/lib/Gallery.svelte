<script lang="ts">
  import { selected } from "../store"
  import Search from "./Search.svelte"

  let book
  let page
  let books = []
  let records = []
  let selectedMenu

  selected.subscribe((val) => {
    page = val.page
    if(book !== val.book) {
      book = val.book
      fetchRecords()
    }
  })

  function bookChange() {
    fetchRecords()
  }

  // fetch books
  fetch(
    "https://api.mcmap.org/v1/query/historic_tax_maps?columns=distinct(book)%20as%20book&sort=book&limit=1000"
  )
    .then((response) => response.json())
    .then((json) => {
      books = json.map((el) => el.book)
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      )
    })

  function fetchRecords() {
    fetch(
      `https://api.mcmap.org/v1/query/historic_tax_maps?columns=year,book,page,file&filter=book='${book}'&sort=book%2C%20CASE%20WHEN%20page%20~%20'%5E%5Ba-zA-Z%5D'%20THEN%201%20WHEN%20page%20~%20'%5E%5B0-9%5D'%20THEN%202%20END,year&limit=2000`
    )
      .then((response) => response.json())
      .then((json) => {
        records = json
        const pages = json.map(el => el.page)
        if (!pages.includes(page)) page = pages[0]
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        )
      })
  }
</script>

<section class="bg-neutral-200 rounded p-2 mb-2">
  <!-- filters -->
  <div class="flex justify-center md:justify-evenly gap-x-2 md:gap-x-0">
    <div>
      <label for="book" class="block text-center text-sm font-bold">Book</label>
      <select
        bind:value={book}
        id="book"
        on:change={bookChange}
      >
        {#each books as book}
          <option>{book}</option>
        {/each}
      </select>
    </div>
    <div>
      <label for="page" class="block text-center text-sm font-bold">Page</label>
      <select
        bind:value={page}
        id="page"
      >
        {#each [...new Set(records.map((el) => el.page))].sort() as pg}
          <option>{pg}</option>
        {/each}
      </select>
    </div>
    <!-- show drop down for small screens -->
    <div class="md:hidden">
      <label for="mapselector" class="block text-center text-sm font-bold">Maps</label>
      <select
        bind:value={$selected}
        id="mapselector"
      >
        {#each records.filter((el) => el.book === book && el.page === page) as record}
          <option value={record}>{record.year} {record.book}-{record.page}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- search -->
  <Search />


</section>

<!-- image gallery area for larger screens -->
<section class="hidden bg-neutral-200 px-2 py-2 md:block grow rounded overflow-auto overflow-y-scroll">
  {#each records.filter((el) => el.book === book && el.page === page) as record}
    <button
      class="py-1 rounded mb-2 w-full block border-2 drop-shadow border-transparent text-center hover:shadow cursor-pointer transition-all ease-in-out duration-300 {record.file ===
      $selected.file
        ? 'bg-pink-500 text-white'
        : 'bg-neutral-100'} hover:border-pink-500"
      on:click={() => ($selected = record)}
      data-file={record.file}
    >
      <span class="text-sm">{record.year} {record.book}-{record.page}</span>
      </button>
  {/each}
</section>
