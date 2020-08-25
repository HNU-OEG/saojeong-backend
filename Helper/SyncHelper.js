const moment = require('moment')

module.exports = {
  PickBy1Weeks: (yyyymmdd = null) => {
    if (yyyymmdd == null) {
      moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().valueOf()
      return {
        current: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().valueOf(),
        one_week: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().subtract(1, 'week').valueOf(),
        two_week: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().subtract(2, 'week').valueOf(),
        three_week: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().subtract(3, 'week').valueOf(),
        four_week: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().subtract(4, 'week').valueOf(),
        five_week: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().subtract(5, 'week').valueOf(),
      }
    }
    return {
      current: moment(yyyymmdd, 'YYYYMMDD').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().valueOf(),
      one_week: moment(yyyymmdd, 'YYYYMMDD').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().subtract(1, 'week').valueOf(),
      two_week: moment(yyyymmdd, 'YYYYMMDD').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().subtract(2, 'week').valueOf(),
      three_week: moment(yyyymmdd, 'YYYYMMDD').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().subtract(3, 'week').valueOf(),
      four_week: moment(yyyymmdd, 'YYYYMMDD').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().subtract(4, 'week').valueOf(),
      five_week: moment(yyyymmdd, 'YYYYMMDD').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().subtract(5, 'week').valueOf(),
    }
  },
  PickBy3Weeks: (yyyymmdd = null) => {
    if (yyyymmdd == null) {
      moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().valueOf()
      return {
        current: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().valueOf(),
        one_week: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().subtract(3, 'week').valueOf(),
        two_week: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().subtract(6, 'week').valueOf(),
        three_week: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().subtract(9, 'week').valueOf(),
        four_week: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().subtract(12, 'week').valueOf(),
        five_week: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().subtract(15, 'week').valueOf(),
      }
    }
    return {
      current: moment(yyyymmdd, 'YYYYMMDD').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().valueOf(),
      one_week: moment(yyyymmdd, 'YYYYMMDD').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().subtract(3, 'week').valueOf(),
      two_week: moment(yyyymmdd, 'YYYYMMDD').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().subtract(6, 'week').valueOf(),
      three_week: moment(yyyymmdd, 'YYYYMMDD').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().subtract(9, 'week').valueOf(),
      four_week: moment(yyyymmdd, 'YYYYMMDD').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().subtract(12, 'week').valueOf(),
      five_week: moment(yyyymmdd, 'YYYYMMDD').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().subtract(15, 'week').valueOf(),
    }
  },
  GenerateDate: (yyyymmdd = null, today = false) => {
    if (today === true) {
      return moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add('9', 'hour').utc().valueOf()
    }
    var date = moment(yyyymmdd, 'YYYYMMDD').add('9', 'hour').utc().valueOf()
    return date
  }
}
