<script lang="ts">
  import { years, records, imgUrl } from '../store'

</script>

<div class="flex justify-center">
  <div>
    <select>
      {#each $years as year}
      <option>{year}</option>
      {/each}
    </select>
  </div>
  <div>
    <select>
      <option value="books">Books</option>
      <option value="html">HTML</option>
      <option value="css">CSS</option>
      <option value="php">PHP</option>
      <option value="js">JavaScript</option>
    </select>
  </div>
  <div class="lg:hidden">
    <select bind:value={$imgUrl}>
      {#each $records as record}
        <option>{record.url}</option>
      {/each}
    </select>
  </div>


</div>
