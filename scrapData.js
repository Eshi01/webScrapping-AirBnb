const puppeteer = require('puppeteer')
const fs = require('fs/promises')
//const Express = require('express')
//const BodyParser = require('body-parser')
const EventEmmiter = require('events')
//const { Console } = require('console')
//const emmiter = new EventEmmiter()
EventEmmiter.defaultMaxListeners = 200

const express = require('express')
const bodyParser = require('body-parser')
const AirBnb = require('./data')
//const getData = require('./test.js')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const dbConfig = require('./databaseUrl.js')
const mongoose = require('mongoose')

mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    //const airBnb = new AirBnb()
    //airBnb.save()

    console.log('successfully connected')
    //console.log(getData)
  })

async function getPageData(url) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url)

  await page.waitForSelector('._1n81at5', { waitUntil: 'load', timeout: 0 })
  const name = await page.$eval('._1n81at5', (name) => name.textContent)
  try {
    await page.waitForSelector('span._1ne5r4rt', {
      waitUntil: 'load',
      timeout: 50000,
    })
  } catch (err) {
    //console.log(err)
  }
  const ratings = await page.$eval(
    'span._1ne5r4rt',
    (ratings) => ratings.textContent
  )

  await page.waitForSelector('._1qf7wt4w', { waitUntil: 'load', timeout: 0 })
  const no_of_ratings = await page.$eval(
    '._1qf7wt4w',
    (no_of_ratings) => no_of_ratings.textContent
  )

  const rate = no_of_ratings.replace(/\D/g, '')

  const dataObj = {
    title: name,
    rating: ratings,
    reviews: rate,
  }

  return dataObj
}

function start(pagesToScrape) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!pagesToScrape) {
        pagesToScrape = 1
      }
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.goto('https://www.airbnb.com/')

      await page.waitForSelector('._1slbw8s')
      const links = await page.$$eval('._1slbw8s a', (allAs) =>
        allAs.map((a) => a.href)
      )
      console.log(links)
      //const scrapeData = []
      var testId = 0

      for (let url of links) {
        await page.goto(url)
        await page.waitForSelector('a._mm360j', {
          waitUntil: 'load',
          timeout: 0,
        })
        const link1 = await page.$$eval('a._mm360j', (allAs) =>
          allAs.map((a) => a.href)
        )

        console.log(link1)

        for (let url1 of link1) {
          testId = testId + 1
          console.log(testId)

          await page.goto(url1)
          const data = await getPageData(url1, page)
          //await page.waitFor(3000);
          console.log(data)
          //scrapeData.push(data)

          const air = new AirBnb(data)
          air.save()
          //console.log(data)
        }
      }
      //console.log(scrapeData);

      await browser.close()
    } catch (e) {
      return reject(e)
    }
  })
}

start(5).then(console.log).catch(console.error)
