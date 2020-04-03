require('dotenv').config()
const path = require('path')
const express = require('express')
const WebSocket = require('ws')
const puppeteer = require('puppeteer')
const db = require('monk')(`${ process.env.DB_USER }:${ process.env.DB_PASS }@localhost/breaking-news`, { authSource: 'admin' })
const states = db.get('states')

const term = 'covid'

const list = [/* {
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
}, {
  url: `https://www.nytimes.com/search?query=${ term }`,
  selector: 'li[data-testid="search-bodega-result"] h4'
}, {
  url: `https://www.5.ua/search?q=${ term }`,
  selector: '.gsc-thumbnail-inside a.gs-title'
}, {
  url: `https://www.aljazeera.net/home/search?q=${ term }`,
  selector: 'article h1 a'
}, {
  url: `https://www.businessmalawi.com/?s=${ term }`,
  selector: 'article h1 a'
}, {
  url: `http://www.rainews.it/dl/rainews/ricerca.html?s=${ term }`,
  selector: '.articolo h2 a'
}, {
  url: `https://www.newsfirst.lk/?s=${ term }`,
  selector: '.search-result-contend-block h2'
}, {
  url: `https://www.thelocal.fr/search/?q=${ term }`,
  selector: '.gsc-thumbnail-inside a.gs-title'
}, {
  url: `https://www.telegraph.co.uk/search.html?q=${ term }`,
  selector: '.gsc-thumbnail-inside a.gs-title'
}, {
  url: `https://www.n-tv.de/suche/?a=search&at=all&q=${ term }`,
  selector: '.teaser__headline'
}, {
  url: `https://www.timesofisrael.com/search/?q=${ term }&submit=search`,
  selector: '.gsc-thumbnail-inside a.gs-title'
}, {
  url: `https://taz.de/!s=${ term }/`,
  selector: '.Titel'
}, {
  url: `https://www.wsj.com/search/term.html?KEYWORDS=${ term }&mod=searchresults_viewallresults`,
  selector: '.headline'
}, {
  url: `https://www.sankei.com/search/?q=${ term }`,
  selector: '.popIn_ArticleTitle .popInLink'
}, {
  url: `https://mainichi.jp/search?q=${ term }&s=date`,
  selector: '.midashi'
}, {
  url: `https://sitesearch.asahi.com/.cgi/sitesearch/sitesearch.pl?Keywords=${ term }`,
  selector: '.SearchResult_Headline em'
}, {
  url: `https://www.azzaman.com/?s=${ term }`,
  selector: '.entry-title.td-module-title a'
}, {
  url: `https://mangish.net/?s=${ term }`,
  selector: '.post-box-title'
}, {
  url: `https://www.tagesanzeiger.ch/search?q=${ term }`,
  selector: 'article .title'
}, {
  url: `https://www.nzz.ch/suche?q=${ term }`,
  selector: '.teaser__title-name'
}, {
  url: `https://www.tachles.ch/suche?suche=${ term }`,
  selector: '.article__headline'
}, {
  url: `https://www.rsi.ch/ricerca/?q=${ term }`,
  selector: '.c-teaserSmall_title a'
}, {
  url: `https://www.stern.de/search?q=${ term }`,
  selector: '.a-headline'
}, {
  url: `https://www.merkur.de/suche/?tt=1&tx=&sb=&td=&fd=&qr=${ term }`,
  selector: '.id-Teaser-el > a'
}, {
  url: `https://www.ndr.de/suche10.html?query=${ term }`,
  selector: '.content a'
}, {
  url: `https://www.deutschlandfunk.de/suchergebnisse.448.de.html?search%5Bsubmit%5D=1&search%5BwithNews%5D%5B%5D=WithNews&search%5Bword%5D=${ term }`,
  selector: '.listright a'
}, {
  url: `https://www.ardmediathek.de/ard/search/${ term }`,
  selector: '.headline'
}, {
  url: `https://www.hongkongfp.com/?s=${ term }`,
  selector: '.entry-title a'
}, {
  url: `https://www.881903.com/search?q=${ term }`,
  selector: '.archive-grid__headline'
}, {
  url: `https://www.thelocal.it/search/?q=${ term }`,
  selector: '.gsc-thumbnail-inside a.gs-title'
}, {
  url: `https://www.blikopnieuws.nl/zoeken?query=${ term }`,
  selector: '.title'
},  {
  url: `https://www.nknews.org/?s=${ term }`,
  selector: '.news-block-standard-inner h2 a'
}, {
  url: `https://www.palestinechronicle.com/?s=${ term }`,
  selector: '.entry-title a'
}, {
  url: `https://www.tsf.pt/pesquisa.html?q=${ term }`,
  selector: '.gsc-thumbnail-inside a.gs-title'
}, {
  url: `http://www.rtp.pt/pesquisa/?q=covid#gsc.tab=0&gsc.q=${ term }&gsc.page=1`,
  selector: '.gsc-thumbnail-inside a.gs-title'
}, {
  url: `https://www.rferl.org/s?k=${ term }&tab=all&pi=1&r=any&pp=20`,
  selector: '.media-block__title'
}, {
  url: `https://www.1tv.ru/search?q=text%3A${ term }`,
  selector: '.show-name'
}, {
  url: `https://2stv.net/?s=${ term }`,
  selector: '.entry-title a'
}, {
  url: `https://www.biznews.com/?s=${ term }`,
  selector: 'h2.entry-title'
}, {
  url: `https://www.africanews24-7.co.za/?s=${ term }`,
  selector: 'h3.entry-title'
}, {
  url: `http://search.hankooki.com/search.php?q=&kw=${ term }`,
  selector: 'li.title a'
}, {
  url: `https://www.dw.com/search/uk?searchNavigationId=9874&languageCode=uk&origin=gN&item=${ term }`,
  selector: '.tw h2'
}, {
  url: `https://www.bbc.co.uk/search?q=${ term }&page=1`,
  selector: '.css-1aofmbn-PromoHeadline a'
}, {
  url: `https://www.rki.de/SiteGlobals/Forms/Suche/serviceSucheForm.html?searchEngineQueryString=${ term }`,
  selector: '#searchResult h3 a'
}, {
  url: `https://news.un.org/en/search/${ term }`,
  selector: '.story-title'
}, {
  url: `https://www.nbcnews.com/search?q=${ term }`,
  selector: '.gsc-thumbnail-inside a.gs-title'
}, {
  url: `https://edition.cnn.com/search?q=${ term }`,
  selector: '.cnn-search__result-headline a'
}, {
  url: `https://www.upi.com/search?ss=${ term }`,
  selector: '.list .title'
}, {
  url: `https://www.news.com.au/search?q=${ term }`,
  selector: '.story-block .heading'
}, */ {
  url: `https://www.euronews.com/search?query=${ term }`,
  selector: 'article h3 a'
}, {
  url: `https://www.rt.com/search?q=${ term }`,
  selector: '.card .card__header .link'
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

  res.json({ 
    list: urls,
    length: urls.length
  })
})

app.get('/data', async (req, res) => {
  const lists = await retrieve()
  res.json(lists)
})

app.listen(port, () => console.log(`breaking-news serving on ${port}`))

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

function shuffle(actual) {
  for (let i = actual.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [actual[i], actual[j]] = [actual[j], actual[i]]
  }

  return actual
}

function difference () {
  const old = flatten(state.old)
  const raw = flatten(state.raw)
  const actual = raw.filter((r) => !old.some((o) => o.title === r.title))

  return shuffle(actual)
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

  const start = Date.now()
  const browser = await puppeteer.launch(/* { headless: false } */)
  try {
    for (const entry of list) {
      const headings = await go(browser, entry.url, entry.selector)
      /* console.log(headings) */
      state.raw[entry.url] = headings
    }

    await browser.close()
  } catch(error) {
    await browser.close()
  } finally {
    await browser.close()
  }

  const time = (Date.now() - start) / 1000 / 60
  console.log(`scraping time ${ time } minutes`)

  state.timestamp = Date.now()
  state.list = difference()

  broadcast()
  store()
}

check()

setInterval(() => {
  check()
}, 30 * 60 * 1000)