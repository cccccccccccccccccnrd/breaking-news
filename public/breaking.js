const url = window.location.hostname === 'localhost' ? 'ws://localhost:3331' : 'wss://gruppe5.org/breaking-news-ws'
const socket = new WebSocket(url)

let state = {
  list: {},
  timestamp: null
}

socket.addEventListener('message', (message) => {
  check(JSON.parse(message.data))
})

function check (newState) {
  if (state.list !== newState.list) {
    console.log('state changed, updating')
    const diff = DeepDiff.diff(state.list, newState.list)
    console.log(newState)
    console.log(diff)
    state = newState
    update()
  } else {
    console.log('no state changes')
  }
}

function update () {
  const since = (Date.now() - state.timestamp) / 1000
  console.log(since)

  let html = ''
  for (const entry in state.list) {
    html += `<h1>${ entry.replace(/(^\w+:|^)\/\//, '') }</h1>`
    state.list[entry].forEach((heading) => {
      html += `<p>${ heading }</p>`
    })
  }

  document.querySelector('#container').innerHTML = html
}