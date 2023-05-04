<script lang="ts">
  import { records, imgUrl, imgBaseUrl } from "../store"

</script>

{#each $records as record}
  <div class="min-h-10 rounded border-2  my-2 text-center hover:shadow cursor-pointer hover:bg-pink-200 transition-all ease-in-out duration-300 {record.url === $imgUrl ? 'border-pink-500':'border-slate-400'}" on:click={() => $imgUrl = record.url} on:keypress={() => $imgUrl = record.url}>
    <img class="block" src={$imgBaseUrl + record.url} alt={record.book} loading="lazy">
    <span class="text-xs">{record.year} {record.book}-{record.page}</span>
  </div>
{/each}
