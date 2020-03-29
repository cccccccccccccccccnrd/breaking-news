const url = window.location.hostname === 'localhost' ? 'ws://localhost:3331' : 'wss://infodemic.live/ws'
const socket = new WebSocket(url)

document.addEventListener('CABLES.jsLoaded', (event) => {
  CABLES.patch = new CABLES.Patch({
    patch: CABLES.exportedPatch,
    prefixAssetPath: '',
    glCanvasId: 'glcanvas',
    glCanvasResizeToWindow: true,
    variables: {
      'headline': ''
    },
    onError: (error) => console.log(error)
  })

  track()
})

let state = {
  list: [],
  timestamp: null
}

socket.addEventListener('message', (message) => {
  state = JSON.parse(message.data)
  console.log(state)
})

function log (since, until, count, index) {
  console.clear()
  console.log(`%c${ since } (time since update)`, 'padding: 5px; background: blue; color: white;')
  console.log(`%c${ until } (time until update)`, 'padding: 5px; background: blue; color: white;')
  console.log(`%c${ count } (total headlines)`, 'padding: 5px; background: blue; color: white;')
  console.log(`%c${ index } (current headline index)`, 'padding: 5px; background: blue; color: white;')
}

function source (url) {
  const html = `<a href="${ url }">${ new URL(url).hostname }</a>`
  document.querySelector('#source').innerHTML = html
}

function headline (headline) {
  console.log(headline)
  CABLES.patch.setVariable('headline', headline.title)
  source(headline.url)
}

function track () {
  const interval = 60 * 30
  const since = Math.floor((Date.now() - state.timestamp) / 1000)
  const until = interval - since

  const count = state.list.length
  const index = Math.floor((count / interval) * since)

  /* log(since, until, count, index) */
  
  if (typeof CABLES !== 'undefined' && state.current !== state.list[index]) {
    headline(state.list[index])
  }
  
  state.current = state.list[index]

  setTimeout(() => {
    track()
  }, 1000)
}