<script lang="ts">
  import { records, imgUrl, imgBaseUrl, imgTitle } from "../store"

  $: if ($imgUrl, $records.length > 0) {
    const rec = $records.filter(el => el.file === $imgUrl)
    if (rec.length > 0) {
      $imgTitle = `${rec[0].year} ${rec[0].book}-${rec[0].page}`
    }
  }

</script>

{#each $records as record}
  <div
    class="min-h-10 rounded border-2 border-slate-400 my-2 text-center hover:shadow cursor-pointer transition-all ease-in-out duration-300 {record.file === $imgUrl ? 'bg-blue-700 text-white':'bg-white text-black'}"
    on:click={() => $imgUrl = record.file}
    on:keypress={() => $imgUrl = record.file}
    data-file={record.file}
    >
    <img class="block rounded px-1 pt-1" src={$imgBaseUrl + record.file} alt={record.book} loading="lazy">
    <span class="text-sm">{record.year} {record.book}-{record.page}</span>
  </div>
{/each}
