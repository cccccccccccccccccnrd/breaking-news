const url = window.location.hostname === 'localhost' ? 'ws://localhost:3331' : 'wss://gruppe5.org/breaking-news-ws'
const socket = new WebSocket(url)

let state = {}

socket.addEventListener('message', (message) => {
  check(JSON.parse(message.data))
})

function check (newState) {
  if (state !== newState) {
    console.log('state changed, updating')
    const diff = DeepDiff.diff(state, newState)
    console.log(diff)
    state = newState
    update()
  } else {
    console.log('no state changes')
  }
}

function update () {
  let html = ''

  for (const entry in state) {
    html += `<h1>${ entry.replace(/(^\w+:|^)\/\//, '') }</h1>`
    state[entry].forEach((heading) => {
      html += `<p>${ heading }</p>`
    })
  }

  document.querySelector('#container').innerHTML = html
}