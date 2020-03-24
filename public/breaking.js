const url = window.location.hostname === 'localhost' ? 'ws://localhost:3331' : 'wss://gruppe5.org/breaking-news-ws'
const socket = new WebSocket(url)

let state = {
  list: {},
  timestamp: null
}

socket.addEventListener('message', (message) => {
  check(JSON.parse(message.data))
})

function difference (newState) {
  const diff = DeepDiff.diff(state.list, newState.list)
  console.log(newState)
  /* console.log(diff) */
}

function check (newState) {
  if (state.list !== newState.list) {
    console.log('state changed, updating')
    difference(newState)
    update(newState)
  } else {
    console.log('no state changes')
  }
}

function animate () {
  const since = Math.floor((Date.now() - state.timestamp) / 1000)
  const time = (60 * 10) - since

  const entries = []
  for (const entry in state.list) {
    entries.push(state.list[entry])
  }

  const count = entries.flat().length
  const index = Math.floor((count / (60 * 10)) * since)

  console.clear()
  console.log(`%c${ since } (time since update)`, 'padding: 5px; background: blue; color: white;')
  console.log(`%c${ time } (time until update)`, 'padding: 5px; background: blue; color: white;')
  console.log(`%c${ count } (total headlines)`, 'padding: 5px; background: blue; color: white;')
  console.log(`%c${ index } (current headline index)`, 'padding: 5px; background: blue; color: white;')

  setTimeout(() => {
    animate()
  }, 1000)
}

function update (newState) {
  state = newState
  animate()

  let html = ''
  for (const entry in state.list) {
    html += `<h1>${ entry.replace(/(^\w+:|^)\/\//, '') }</h1>`
    state.list[entry].forEach((heading) => {
      html += `<p>${ heading }</p>`
    })
  }

  document.querySelector('#container').innerHTML = html
}