const cron = require('node-cron')
const fetch = require('node-fetch')
const moment = require('moment')
const pool = require('../config/db')

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

// 30분마다 평점 취합
cron.schedule("* */30 * * * *", async () => {
  try {
    let [score] = await pool.query(
      "SELECT si.store_id, FORMAT(avg(so.question1), 1) AS question1, FORMAT(avg(so.question2), 1) AS question2, FORMAT(avg(so.question3), 1) AS question3, FORMAT((so.question1 + so.question2 + so.question3)/3, 1) AS average\
      FROM store_information si  \
      LEFT JOIN store_vote_grade so ON si.store_id = so.store_id  AND is_available = 1 \
      WHERE so.question1 IS NOT NULL \
      GROUP BY si.store_id"
    )

    let sql = "UPDATE store_information si JOIN ("
    let array = []
    let i = 0;

    for (let row in score) {
      let id = score[row]["store_id"]
      let question1 = score[row]["question1"]
      let question2 = score[row]["question2"]
      let question3 = score[row]["question3"]
      let average = score[row]["average"]
      if (i === 0) {
        array.push("SELECT " + id + " as store_id, " + question1 + " as question1_average, " + question2 + " as question2_average, " + question3 + " as question3_average, " + average + " as average")
      } else {
        array.push("SELECT " + id + ", " + question1 + ", " + question2 + ", " + question3 + ", " + average)
      }
      ++i;
    }

    sql += array.join(" UNION ALL ")
    sql += ") vals ON si.store_id = vals.store_id SET si.question1_average = vals.question1_average, si.question2_average = vals.question2_average, si.question3_average = vals.question3_average, si.vote_grade_average = vals.average"
    let [result] = await pool.execute(sql)


    console.log("평점 취합 SQL: ", sql)
    console.log("평점 취합 완료: ", result)
    console.log("평점 취합 완료 시간: ", new Date())
  } catch (e) {
    console.log("평점 취합 중 오류 발생", e)
    throw new Error("평점 취합 중 오류 발생", e)
  }
}),


  // 30분마다 평점 카운트 취합
  cron.schedule("* */30 * * * *", async () => {
    try {

      let [count] = await pool.query(
        "SELECT store_id, COUNT(store_id) AS vote_count FROM store_vote_grade WHERE is_available = 1 GROUP BY store_id"
      )

      let array = []
      let i = 0;

      let sql = "UPDATE store_information si JOIN ("
      for (let row in count) {
        let id = count[row]["store_id"]
        let vote_count = count[row]["vote_count"]
        if (i === 0) {
          array.push("SELECT " + id + " as store_id, " + vote_count + " as vote_grade_count")
        } else {
          array.push("SELECT " + id + ", " + vote_count)
        }
        ++i
      }

      sql += array.join(" UNION ALL ")
      sql += ") vals ON si.store_id = vals.store_id SET si.vote_grade_count = vals.vote_grade_count"
      console.log(sql)

      let [result] = await pool.execute(sql)

      console.log("카운트 취합 SQL: ", sql)
      console.log("카운트 취합 완료: ", result)
      console.log("카운트 취합 완료 시간: ", new Date())
    } catch (e) {
      console.log("카운트 취합 중 오류 발생", e)
      throw new Error("카운트 취합 중 오류 발생", e)
    }
  })

module.exports = cron