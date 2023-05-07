<script lang="ts">
  import { book, books, records, imgUrl } from '../store'

</script>

<div>
  <label for="book" class="block text-center text-sm font-medium">Book</label>
  <select bind:value={$book} id="book" class=" text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-1 py-2">
    {#each $books as book}
      <option>{book.book}</option>
      {/each}
  </select>
</div>
<div>
  <label for="page" class="block text-center text-sm font-medium">Page</label>
  <select id="page" class=" text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-1 py-2">
    <option selected>01</option>
  </select>
</div>
<div>
  <label for="year" class="block text-center text-sm font-medium">Year</label>
  <select id="year" class=" text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-1 py-2">
    <option selected>1970</option>
  </select>
</div>

<!-- <div class="flex justify-center">
  <div>
    <select bind:value={$book}>
      {#each $books as book}
      <option>{book.book}</option>
      {/each}
    </select>
  </div>
  <div class="lg:hidden">
    <select bind:value={$imgUrl}>
      {#each $records as record}
        <option value={record.file}>{record.year} {record.book}-{record.page}</option>
      {/each}
    </select>
  </div>
</div> -->
