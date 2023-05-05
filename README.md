# TODO

* Selected img in hash
* Styling (header, filter area, favicon, header stuff, etc.)
  * Maybe engineering blue with tax map background and white text
* PWA/workbox

```bash
#! /bin/bash

IMGSOURCEPATH="/mnt/e/HistoricTaxMaps1970_1998"
IMGDESTPATH="/mnt/c/workspace/code/historictaxmaps/public/taxmaps"

for f in $(find $IMGSOURCEPATH -name '*.tif')
  do
    if [ ! -f "$IMGDESTPATH/$f" ]
    then
      echo "Converting $f"
      mogrify -quality 1 -colors 256 -resize 50% -format webp -path "$IMGDESTPATH" "$f"
    fi
done
```

```javascript
require("dotenv").config()
const fs = require("fs")
const pgp = require("pg-promise")({
  capSQL: true
})
const db = pgp(process.env.POSTGRES_CONNECTION)

const folder = "public/taxmaps"
const cs = new pgp.helpers.ColumnSet(["year", "book", "page", "file"], { table: "historic_tax_maps" })

// data input values:
const values = []
fs.readdirSync(folder).forEach((file) => {
  const year = file.substring(0, 4)
  const book = file.substring(5, 8)
  let page = file.substring(8, 10)
  if (file.toUpperCase().indexOf("INDEX") !== -1) {
    page = "index"
  }
  values.push({'year': year, 'book': book, 'page': page, 'file': file})
})

async function insert() {
  const query = pgp.helpers.insert(values, cs)
  await db.none(query)
}

insert()
```