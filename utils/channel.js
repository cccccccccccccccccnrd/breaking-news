require('dotenv').config()
const Telegraf = require('telegraf')
const WebSocket = require('ws')

let state = {
  list: [],
  timestamp: null
}

let context = null

const ws = new WebSocket('wss://infodemic.live/ws')

ws.on('message', (message) => {
  state = JSON.parse(message)
  console.log(`got ${ state.list.length } headlines`)
})

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.on('start', (ctx) => {
  context = ctx
})

bot.launch()

function headline (headline) {
  console.log(headline)
  if (context) {
    /* context.telegram.sendMessage('@infodemiclive', `<a href="${ headline.url }">${ headline.title }</a>`, { parse_mode: 'html' }) */
    context.telegram.sendMessage('@infodemiclive', headline.title)
  } else {
    console.log('no context :-(')
  }
}

function track () {
  const interval = 60 * 30
  const since = Math.floor((Date.now() - state.timestamp) / 1000)
  const until = interval - since

  const count = state.list.length
  const index = Math.floor((count / interval) * since)
  
  if (state.current !== state.list[index]) {
    headline(state.list[index])
  }
  
  state.current = state.list[index]

  setTimeout(() => {
    track()
  }, 1000)
}

track()