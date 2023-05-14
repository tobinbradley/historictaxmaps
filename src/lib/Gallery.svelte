<script lang="ts">
  import { selected, imgBaseUrl } from "../store"
  import Search from "./Search.svelte"

  let taxmaps = []
  let books = []
  let records = []
  let book = $selected.book
  let page = $selected.page
  // let year = '*'

  $: if ($selected) {
    //page = $selected.page
    //book = $selected.book
    fetchRecords()
  }

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

  function fetchRecords(bk = $selected.book, updateSelected = false) {
      fetch(
        `https://api.mcmap.org/v1/query/historic_tax_maps?columns=year,book,page,file&filter=book='${bk}'&sort=year%2C%20book%2C%20CASE%20WHEN%20page%20~%20'%5E%5Ba-zA-Z%5D'%20THEN%201%20WHEN%20page%20~%20'%5E%5B0-9%5D'%20THEN%202%20END`
      )
        .then((response) => response.json())
        .then((json) => {
          records = json
          if (json.length > 0 && updateSelected) {
            $selected = json[0]
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

  function changeBook() {
    fetchRecords(book, true)
  }

  function changePage() {
    $selected = records.filter(el => el.page === page)[0]
  }

</script>

<section class="bg-neutral-200 rounded p-2 mb-2">
  <!-- filters -->
  <div class="flex justify-around gap-x-2">
    <div>
      <label for="book" class="block text-center text-sm font-bold">Book</label>
      <select
        bind:value={book}
        on:change={changeBook}
        id="book"
        class=" text-sm rounded-lg bg-neutral-50 block px-1 py-2"
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
        on:change={changePage}
        class="text-sm rounded-lg bg-neutral-50 block px-1 py-2"
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
      bind:value={$selected.file}
      aria-label="Tax Maps"
      class="w-full text-center text-sm rounded-lg bg-neutral-50 block px-1 py-2"
    >
      {#each records.filter((el) => el.book === $selected.book && el.page === $selected.page) as record}
        <option value={record.file}
          >{record.year} {record.book}-{record.page}</option
        >
      {/each}
    </select>
  </div>
</section>

<!-- image gallery area for larger screens -->
<section class="hidden md:block grow rounded overflow-auto overflow-y-scroll">
  {#each records.filter((el) => el.book === $selected.book && el.page === $selected.page) as record}
    <div
      class="min-h-10 rounded mb-2 mr-2 text-center hover:shadow cursor-pointer transition-all ease-in-out duration-300 {record.file ===
      $selected.file
        ? 'bg-yellow-300'
        : 'bg-neutral-100'} hover:bg-yellow-100"
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
