<script lang="ts">
  import { book, books, records, imgUrl } from '../store'

</script>

<div class="flex justify-center">
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
</div>
