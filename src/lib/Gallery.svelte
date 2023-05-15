<script lang="ts">
  import { book, selected, imgBaseUrl } from "../store"
  import Search from "./Search.svelte"

  let books = []
  let records = []
  let page = $selected.page
  let selectedMenu

  book.subscribe((val) => {
    fetchRecords()
  })

  // fetch books
  fetch(
    "https://api.mcmap.org/v1/query/historic_tax_maps?columns=distinct(book)%20as%20book&sort=book"
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
      `https://api.mcmap.org/v1/query/historic_tax_maps?columns=year,book,page,file&filter=book='${$book}'&sort=book%2C%20CASE%20WHEN%20page%20~%20'%5E%5Ba-zA-Z%5D'%20THEN%201%20WHEN%20page%20~%20'%5E%5B0-9%5D'%20THEN%202%20END,year`
    )
      .then((response) => response.json())
      .then((json) => {
        records = json
        if (json.length > 0) {
          page = json[0].page
        }
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
        bind:value={$book}
        id="book"
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
  </div>

  <!-- search -->
  <Search />

  <!-- show drop down for small screens -->
  <div class="my-6 mx-2 md:hidden">
    <select
      bind:value={selectedMenu}
      on:change="{() => $selected = selectedMenu}"
      aria-label="Tax Maps"
      class="w-full block"
    >
      {#each records.filter((el) => el.book === $book && el.page === page) as record}
        <option value={record}>{record.year} {record.book}-{record.page}</option>
      {/each}
    </select>
  </div>
</section>

<!-- image gallery area for larger screens -->
<section class="hidden md:block grow rounded overflow-auto overflow-y-scroll">
  {#each records.filter((el) => el.book === $book && el.page === page) as record}
    <div
      class="min-h-10 rounded mb-2 mr-2 border-4 border-transparent text-center hover:shadow cursor-pointer transition-all ease-in-out duration-300 {record.file ===
      $selected.file
        ? 'bg-pink-500 text-white'
        : 'bg-neutral-100'} hover:border-yellow-500"
      on:click={() => ($selected = record)}
      on:keypress={() => ($selected = record)}
      data-file={record.file}
    >
      <img
        class="block rounded px-1 pt-1"
        src={$imgBaseUrl + record.file}
        alt={record.book}
        loading="lazy"
      />
      <span class="text-sm">{record.year} {record.book}-{record.page}</span>
    </div>
  {/each}
</section>
