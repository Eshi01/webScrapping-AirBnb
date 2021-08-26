const puppeteer = require('puppeteer')
const fs = require('fs/promises')
const EventEmmiter = require('events')
const emitter = new EventEmmiter()
emitter.setMaxListeners(0)
const readline = require('readline')
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
  .catch((err) => {
    console.log('not connected', err)
    process.exit()
  })

var filter = ''
const name = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
async function filterData() {
  name.question('enter host name : ', (answer1) => {
    filter = answer1

    name.close()
    dataPage()
  })
}

async function mainPage() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(
    'https://www.airbnb.com/s/Portugal/homes?place_id=ChIJ1SZCvy0kMgsRQfBOHAlLuCo&refinement_paths%5B%5D=%2Fhomes&adults=0&children=0&infants=0&search_type=AUTOSUGGEST'
  )

  await page.waitForSelector('._wy1hs1')

  const names = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a._wy1hs1')).map((x) => x.href)
  })

  console.log(names)
  //await fs.writeFile('names.txt', names.join('\r\n'))

  await browser.close()
  return names
}

async function hotelPage() {
  const links = await mainPage()
  const hotelLinks = []
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  for (let link of links) {
    await page.goto(link)

    await page.waitForSelector('._mm360j')

    const hotelLink = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a._mm360j')).map(
        (x) => x.href
      )
    })

    for (let hotel of hotelLink) {
      //await console.log(hotel)
      await hotelLinks.push(hotel)
    }
  }
  await browser.close()
  // await fs.writeFile('nameHotels.txt', hotelLinks.join('\r\n'))
  await console.log(hotelLinks)
  return hotelLinks
}

async function dataPage() {
  const links = await hotelPage()
  const title = []
  const rating = []
  const noOfRating = []
  const data = []
  var testId = 0

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setDefaultNavigationTimeout(0)
  console.log(filter)
  for (let link of links) {
    testId = testId + 1
    console.log(testId)

    await page.goto(link)

    await page.waitForSelector('._fecoyn4', {
      waitUntil: 'load',
      timeout: 0,
    })

    const titles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('h1._fecoyn4')).map(
        (x) => x.textContent
      )
    })

    await page.waitForSelector('h2._14i3z6h', {
      waitUntil: 'load',
      timeout: 0,
    })

    const hosts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('h2._14i3z6h')).map(
        (x) => x.textContent
      )
    })
    var host = ''

    var hName = hosts[0]
    var b = hName.split(' ')
    if (b[0] == 'Meet' || b[0] == 'meet') {
      var c = hName.split('Host, ')
      host = c[1]
    } else {
      var c = hName.split('hosted by')
      var e = c.length
      var d = c[e - 1].split('')
      // console.log(d)
      for (let i = 1; i < d.length; i++) {
        host = host + d[i]
      }
    }
    await console.log('checking...' + host)

    if (host == filter) {
      try {
        await page.waitForSelector('div.rgpeg0e', {
          waitUntil: 'load',
          timeout: 50000,
        })
      } catch (err) {
        console.log('error')
      }
      console.log('*')

      // -> 153
      //var ret = 'data-123'.replace('data-', '')
      // var [hostName] = host.replace("Meet your Host,")
      // console.log(hostName)
      //function replaceAll(str, find, replace) {
      //   var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')
      //   return str.replace(new RegExp(escapedFind, 'g'), replace)
      // }
      // //usage example
      // var a = hosts[0]
      // var host = replaceAll(a, 'Meet your Host,', '')
      // console.log(host)

      /*await page.waitForSelector('div._12oal24')

    const bedRooms = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          'div._12oal24 div:nth-child(3) span:nth-child(3)'
        ) 
      ).map((x) => x.textContent)
    })*/

      /*await page.waitForSelector(
      'div._tqmy57 div:nth-child(2) span:nth-child(4)',
      {
        waitUntil: 'load',
        timeout: 0,
      }
    )

    const beds = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          'div._tqmy57 div:nth-child(2) span:nth-child(4)'
        )
      ).map((x) => x.textContent)
    })*/

      /* const baths = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          'div._12oal24 div:nth-child(3) span:nth-child(7)'
        )
      ).map((x) => x.textContent)
    })*/

      //await console.log(titles[0])
      //await title.push(titles[0])

      /*  await page.waitForSelector('span._1ne5r4rt', {
      waitUntil: 'load',
      timeout: 0,
    })

    const ratings = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('span._1ne5r4rt')).map(
        (x) => x.textContent
      )
    })
*/
      // await console.log(ratings[0])
      //await rating.push(ratings[0])

      /*await page.waitForSelector(' button._1qf7wt4w', {
      waitUntil: 'load',
      timeout: 0,
    })

    const noOfRatings = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button._1qf7wt4w')).map(
        (x) => x.textContent
      )
    })*/

      /* await page.waitForSelector(' div.rgpeg0e div:nth-child(1) span._4oybiu', {
      waitUntil: 'load',
      timeout: 0,
    })

      const Cleanliness = await page.evaluate(() => {
        try {
          return Array.from(
            document.querySelectorAll(
              'div.rgpeg0e div:nth-child(1) span._4oybiu'
            )
          ).map((x) => x.textContent)
        } catch (err) {
          console.log('error')
        }
      })

      await page.waitForSelector(' div.rgpeg0e div:nth-child(2) span._4oybiu', {
        waitUntil: 'load',
        timeout: 50000,
      })

       const Accuracy = await page.evaluate(() => {
        try {
          return Array.from(
            document.querySelectorAll(
              'div.rgpeg0e div:nth-child(2) span._4oybiu'
            )
          ).map((x) => x.textContent)
        } catch (err) {
          console.log('error')
        }
      })

      await page.waitForSelector(' div.rgpeg0e div:nth-child(3) span._4oybiu', {
        waitUntil: 'load',
        timeout: 50000,
      })

      const Communication = await page.evaluate(() => {
        try {
          return Array.from(
            document.querySelectorAll(
              'div.rgpeg0e div:nth-child(3) span._4oybiu'
            )
          ).map((x) => x.textContent)
        } catch (err) {
          console.log('error')
        }
      })

      await page.waitForSelector(' div.rgpeg0e div:nth-child(4) span._4oybiu', {
        waitUntil: 'load',
        timeout: 50000,
      })

      const Location = await page.evaluate(() => {
        try {
          return Array.from(
            document.querySelectorAll(
              'div.rgpeg0e div:nth-child(4) span._4oybiu'
            )
          ).map((x) => x.textContent)
        } catch (err) {
          console.log('error')
        }
      })

      await page.waitForSelector(' div.rgpeg0e div:nth-child(5) span._4oybiu', {
        waitUntil: 'load',
        timeout: 50000,
      })

      const Checkin = await page.evaluate(() => {
        try {
          return Array.from(
            document.querySelectorAll(
              'div.rgpeg0e div:nth-child(5) span._4oybiu'
            )
          ).map((x) => x.textContent)
        } catch (err) {
          console.log('error')
        }
      })

      await page.waitForSelector(' div.rgpeg0e div:nth-child(6) span._4oybiu', {
        waitUntil: 'load',
        timeout: 50000,
      })

      const Value = await page.evaluate(() => {
        try {
          return Array.from(
            document.querySelectorAll(
              'div.rgpeg0e div:nth-child(6) span._4oybiu'
            )
          ).map((x) => x.textContent)
        } catch (err) {
          console.log('error')
        }
      })*/

      try {
        await page.waitForSelector(
          '#site-content > div > div:nth-child(1) > div:nth-child(4) > div > div > div > div:nth-child(2) > div:nth-child(2) > div > div.ciubx2o',
          {
            waitUntil: 'load',
            timeout: 50000,
          }
        )
      } catch (err) {
        console.log('error')
      }
      console.log('*')

      const ratings = await page.evaluate(() => {
        try {
          return Array.from(
            document.querySelectorAll(
              'div.ciubx2o div._1s11ltsf div._bgq2leu span._4oybiu'
            )
          ).map((x) => x.textContent)
        } catch (err) {
          console.log('error')
        }
      })

      // await console.log(noOfRatings[0])
      //await noOfRating.push(noOfRatings[0])
      const dataObj = {
        title: titles[0],
        host: host,
        //BedRooms: bedRooms[0],
        // Beds: beds[0],
        //Baths: baths[0],

        //rating: 5, //ratings[0],
        //Reviews: noOfRatings[0],

        Cleanliness: ratings[0],
        Accuracy: ratings[1],
        Communication: ratings[2],
        Location: ratings[3],
        Checkin: ratings[4],
        Value: ratings[5],
      }

      const air = new AirBnb(dataObj)
      air.save()
      console.log(dataObj)
      //await data.push(dataObj)
      // await console.log(dataObj)
    }

    //await console.log(data)
  }
  await browser.close()
}
setTimeout(filterData, 1000)
