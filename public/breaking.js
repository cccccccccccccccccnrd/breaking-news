const url = window.location.hostname === 'localhost' ? 'ws://localhost:3331' : 'wss://gruppe5.org/breaking-news-ws'
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
  list: {},
  collection: [],
  timestamp: null
}

socket.addEventListener('message', (message) => {
  update(JSON.parse(message.data))
})

function html () {
  let html = ''
  for (const entry in state.list) {
    html += `<h1>${ entry.replace(/(^\w+:|^)\/\//, '') }</h1>`
    state.list[entry].forEach((heading) => {
      html += `<p>${ heading }</p>`
    })
  }

  document.querySelector('#container').innerHTML = html
}

function difference (newState) {
  const diff = DeepDiff.diff(state.list, newState.list)
  console.log(newState)
  console.log(diff)
}

function update (newState) {
  state = newState
  state.collection = Object.keys(state.list).map((key) => state.list[key]).flat()
}

function track () {
  const since = Math.floor((Date.now() - state.timestamp) / 1000)
  const until = (60 * 10) - since

  const count = state.collection.length
  const index = Math.floor((count / (60 * 10)) * since)

  /* console.clear()
  console.log(`%c${ since } (time since update)`, 'padding: 5px; background: blue; color: white;')
  console.log(`%c${ until } (time until update)`, 'padding: 5px; background: blue; color: white;')
  console.log(`%c${ count } (total headlines)`, 'padding: 5px; background: blue; color: white;')
  console.log(`%c${ index } (current headline index)`, 'padding: 5px; background: blue; color: white;') */
  
  if (typeof CABLES !== 'undefined' && state.current !== state.collection[index]) {
    CABLES.patch.setVariable('headline', state.collection[index])
  }
  
  state.current = state.collection[index]

  setTimeout(() => {
    track()
  }, 1000)
}