const fetch = require('node-fetch')
const fs = require('fs')

function save(filename, string) {
  fs.writeFileSync(`${ filename }`, string)
}

async function init () {
  const response = await fetch('https://infodemic.live/data')
  const json = await response.json()
  const titles = json.map((entry) => entry.list).flat().map((entry) => entry.title)
  const string = titles.join(' ')
  save('wow.txt', string)
}

init()
