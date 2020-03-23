const url = window.location.hostname === 'localhost' ? 'ws://localhost:3331' : 'wss://gruppe5.org/breaking-news-ws'
const socket = new WebSocket(url)

let state = {}

socket.addEventListener('message', (message) => {
  state = JSON.parse(message.data)
  console.log(state)
  update()
})

function update () {
  let html = ''

  for (const entry in state) {
    html += `<h1>${ entry }</h1>`
    state[entry].forEach((heading) => {
      html += `<p>${ heading }</p>`
    })
  }

  document.querySelector('#container').innerHTML = html
}