require('dotenv').config()
const path = require('path')
const express = require('express')
const WebSocket = require('ws')
const puppeteer = require('puppeteer')
const db = require('monk')(`${ process.env.DB_USER }:${ process.env.DB_PASS }@localhost/breaking-news`, { authSource: 'admin' })
const states = db.get('states')

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
  url: `http://search.cctv.com/search.php?qtext=${ term }&type=web`,
  selector: '.tuwenjg h3'
}, {
  url: `https://ariananews.af/?s=${ term }`,
  selector: '.post-box-title a'
}, {
  url: `https://www.africanews.com/search/${ term }`,
  selector: '.teaser__title a'
}, {
  url: `https://www.trthaber.com/arama.html?q=${ term }`,
  selector: '.gsc-thumbnail-inside a.gs-title'
}, {
  url: `https://www.zimlive.com/?s=${ term }`,
  selector: '.gsc-thumbnail-inside a.gs-title'
}, {
  url: `https://de.reuters.com/search/news?blob=${ term }`,
  selector: '.search-result-title a'
}, {
  url: `https://www.1stheadlines.com/cgi-bin/searchhedsd.cgi?search=${ term }&action=Search&stype=2`,
  selector: '.hed'
}, {
  url: `https://www.newyorker.com/search/q/${ term }`,
  selector: '.River__hed___re6RP'
}, {
  url: `https://us.cnn.com/search?q=${ term }`,
  selector: '.cnn-search__result-headline a'
}, {
  url: `https://www.vaticannews.va/en/search.html?q=${ term }&in=all&sorting=latest`,
  selector: '.teaser__title a span'
}, {
  url: `https://www.alarabiya.net/ar/tools/search?query=${ term }`,
  selector: '.ttl'
}, {
  url: `https://112.ua/search?q=${ term }`,
  selector: '.desc-bold'
}, {
  url: `https://www.antena3.com/buscador-site/index.html?q=${ term }`,
  selector: '.gsc-thumbnail-inside a.gs-title'
}, {
  url: `https://www.ntv.ru/finder/?keytext=${ term }`,
  selector: '.fndr_news h5'
}, {
  url: `https://www.sapo.pt/pesquisa/sapo/tudo?q=${ term }#gsc.tab=0&gsc.q=${ term }&gsc.page=1`,
  selector: '.gsc-thumbnail-inside a.gs-title'
}, {
  url: `https://nos.nl/zoeken/?q=${ term }`,
  selector: '.search-results__title'
}, {
  url: `http://www.italynews.it/?s=${ term }`,
  selector: '.entry-title.td-module-title a'
}, {
  url: `https://www.scmp.com/search/${ term }`,
  selector: '.content-link__title'
}, {
  url: `https://www.jiji.com/jc/search?q=${ term }`,
  selector: '.popIn_ArticleTitle .popInLink'
}, {
  url: `https://r.nikkei.com/search?keyword=${ term }`,
  selector: '.nui-card__title a'
}]

const state = {
  raw: {},
  old: {},
  list: [],
  timestamp: null
}

const app = express()
const port = 3330

app.set('json spaces', 2)

app.use('/', express.static(path.join(__dirname, 'public')))

app.get('/list', (req, res) => {
  const urls = list.map((entry) => entry.url)
  res.json(urls)
})

app.get('/data', (req, res) => {
  const lists = retrieve()
  res.json(lists)
})

app.listen(port, () => console.log(`breaking-news served on ${port}`))

const wss = new WebSocket.Server({ port: 3331 })

wss.on('connection', (ws) => {
  ws.send(JSON.stringify(state))
})

async function retrieve () {
  return await states.find({})
}

function store () {
  const entry = {
    list: state.list,
    timestamp: Date.now()
  }

  states.insert(entry)
    .then((entries) => {
      console.log('stored')
    })
    .catch((error) => {
      console.log('while storing', error)
    })
}

function flatten (object) {
  if (Object.keys(object).length === 0) {
    return []
  } else {
    return Object
    .keys(object)
    .map((url) => {
      if (typeof object[url] !== 'undefined') {
        return object[url].map((title) => {
          return {
            title,
            url
          } 
        })
      } else {
        return null
      }
    })
    .flat()
    .filter(Boolean)
  }
}

function difference () {
  const old = flatten(state.old)
  const raw = flatten(state.raw)

  return raw.filter((r) => !old.some((o) => o.title === r.title))
}

function broadcast () {
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
      return headings.map((h) => h.innerText.trim()).filter(Boolean)
    }, selector)
    
    await page.close()
    return data
  } catch(error) {
    console.log('while fetching', error)
  }
}

async function check () {
  state.old = JSON.parse(JSON.stringify(state.raw))

  const browser = await puppeteer.launch(/* { headless: false } */)
  try {
    for (const entry of list) {
      const headings = await go(browser, entry.url, entry.selector)
      state.raw[entry.url] = headings
    }

    await browser.close()
  } catch(error) {
    await browser.close()
  } finally {
    await browser.close()
  }

  state.timestamp = Date.now()
  state.list = difference()

  broadcast()
  store()
}

check()

setInterval(() => {
  check()
}, 30 * 60 * 1000)