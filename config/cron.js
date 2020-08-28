const cron = require('node-cron')
const fetch = require('node-fetch')
const moment = require('moment')

// 매 10분마다 데일리 싱크 업데이트
cron.schedule('0 */10 * * * *', async () => {
  try {
    var getData = await fetch(`${process.env.BASE_URL}/cron/kamis-daily-sync`)
    if (getData.status == 200) {
      console.info('KAMIS 데이터 업데이트 완료')
    }
  } catch (err) {
    console.error('KAMIS 데이터 업데이트 실패')
  }
})

// 매 8분마다 이벤트 업데이트
cron.schedule('0 */8 * * * *', async () => {
  try {
    var getData = await fetch(`${process.env.BASE_URL}/cron/process-event`)
    if (getData.status == 200) {
      console.info('KAMIS 데이터 업데이트 완료')
    }
  } catch (err) {
    console.error('KAMIS 데이터 업데이트 실패')
  }
})

module.exports = cron