const path = require('path')
const express = require('express')
const WebSocket = require('ws')
const puppeteer = require('puppeteer')

const list = [{
  url: 'https://www.zeit.de/suche/index?q=covid',
  selector: '.zon-teaser-standard__title'
}, {
  url: 'https://www.brigitte.de/search?q=covid',
  selector: '.a-headline-teaser'
}, {
  url: 'https://www.positanonews.it/?s=covid&post_type=post',
  selector: '.news-item h1 a'
}, {
  url: 'https://www.der-postillon.com/search?q=covid',
  selector: '.post-title.entry-title a'
}, {
  url: 'https://www.vice.com/en_us/search?q=covid',
  selector: '.heading'
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

async function go (browser, url, selector) {
  console.log(url, selector)
  const page = await browser.newPage()
  await page.goto(url)
  await page.waitForSelector(selector)

  const data = await page.evaluate((selector) => {
    const headings = Array.from(document.querySelectorAll(selector))
    return headings.map(h => h.innerText)
  }, selector)

  return data
}

async function init () {
  const browser = await puppeteer.launch()

  for (const entry of list) {
    const headings = await go(browser, entry.url, entry.selector)
    state[entry.url] = headings
  }

  console.log(state)
  await browser.close()
}

init()