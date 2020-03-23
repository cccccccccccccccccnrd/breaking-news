const path = require('path')
const express = require('express')
const WebSocket = require('ws')
const puppeteer = require('puppeteer')

const term = 'covid'

const list = [{
  url: `https://www.zeit.de/suche/index?q=${ term }`,
  selector: '.zon-teaser-standard__title'
}, {
  url: `https://www.brigitte.de/search?q=${ term }`,
  selector: '.a-headline-teaser'
}, {
  url: `https://www.positanonews.it/?s=${ term }&post_type=post`,
  selector: '.news-item h1 a'
}, {
  url: `https://www.der-postillon.com/search?q=${ term }`,
  selector: '.post-title.entry-title a'
}, {
  url: `https://www.vice.com/en_us/search?q=${ term }`,
  selector: '.heading'
}, {
  url: `https://www.irinn.ir/fa/search?query=${ term }`,
  selector: '.search_result_container .tag_title'
}, {
  url: `https://search.cctv.com/search.php?qtext=${ term }&type=web`,
  selector: '.tuwenjg h3'
}]

const state = {}

const app = express()
const port = 3330

app.use('/', express.static(path.join(__dirname, 'public')))

app.listen(port, () => console.log(`breaking-news served on ${port}`))

const wss = new WebSocket.Server({ port: 3331 })

wss.on('connection', (ws) => {
  ws.send(JSON.stringify(state))
})

function broadcast () {
  console.log(state)

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(state))
    }
  })
}

async function go (browser, url, selector) {
  console.log(url, selector)

  try {
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(0)
    await page.goto(url, { waitUntil: 'networkidle2' })
    await page.waitForSelector(selector)
  
    const data = await page.evaluate((selector) => {
      const headings = Array.from(document.querySelectorAll(selector))
      return headings.map(h => h.innerText)
    }, selector)
  
    page.close()
    return data
  } catch(error) {
    console.log(error)
  }
}

async function init () {
  const browser = await puppeteer.launch(/* { headless: false } */)

  for (const entry of list) {
    const headings = await go(browser, entry.url, entry.selector)
    state[entry.url] = headings
  }

  await browser.close()
  broadcast()
}

init()