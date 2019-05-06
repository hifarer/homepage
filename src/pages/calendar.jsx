
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import LunarCalendar from 'lunar-calendar'

import '../style/calendar.less'
import '../images/calendar.png'

// 如果是节日，显示节日
// 如果不是节日但是是节气，显示节气
// 如果不是节日和节气但是是每月农历初一，显示农历月份
// 否则显示农历日
function lunarFestivalFilter (value) {
  switch (value) {
    case '龙抬头节':
    case '妈祖生辰':
    case '下元节':
      return ''
    case '七夕情人节':
      return '七夕节'
    default:
      return value
  }
}

function getAlmanac (yyyymm) {
  let arr = []
  let lunar = LunarCalendar.calendar(yyyymm.substr(0, 4), yyyymm.substr(4, 2), false).monthData
  // 生肖年 节气 干支年 干支月 干支日 农历月 农历日 公历节日 农历节日
  // let keys = ['zodiac', 'term', 'GanZhiYear', 'GanZhiMonth', 'GanZhiDay', 'lunarMonthName', 'lunarDayName', 'solarFestival', 'lunarFestival']
  for (let i = 0; i < lunar.length; i++) {
    let lu = lunar[i]
    lu.lunarFestival = lunarFestivalFilter(lu.lunarFestival)
    lu.lunarValue = lu.lunarFestival || lu.term || (lu.lunarDayName === '初一' ? lu.lunarMonthName : lu.lunarDayName)
    arr.push(lu)
  }
  return arr
}

class Calendar extends Component {
  constructor () {
    super()
    this.state = {
      date: new Date(),
      lunar: {},
      holiday: {}
    }
  }
  render () {
    let oDate = this.state.date
    let year = oDate.getFullYear()
    let month = oDate.getMonth()
    let date = oDate.getDate()
    let days = this.getMonthDays(year, month, date)
    let rows = []
    let cells = []
    for (let i = 0; i < days.length; i++) {
      let classList = ['cell']
      if (days[i].inactive) {
        classList.push('inactive')
      } else if (days[i].date === date) {
        classList.push('current')
      }
      cells.push(
        <div className={classList.join(' ')} key={i}>
          {(days[i].holiday && days[i].holiday.status) && (days[i].holiday.status === '1' ? <div className='rest'>休</div> : <div className='work'>班</div>)}
          <p>{days[i].date}</p>
          {(days[i].holiday && days[i].holiday.name) ? <p>{days[i].holiday.name}</p> : <p>{days[i].lunar.lunarValue}</p>}
        </div>
      )
    }
    for (let i = 0; i < Math.ceil(cells.length / 7); i++) {
      rows.push(
        <div className='row' key={i}>
          {cells.slice(i * 7, (i + 1) * 7)}
        </div>
      )
    }

    return (
      <div className='calendar'>
        <div className='ctrl'>
          <div className='year'>
            <select onChange={this.yearChange.bind(this)} value={year}>
              <option value={year - 2}>{year - 2}年</option>
              <option value={year - 1}>{year - 1}年</option>
              <option value={year}>{year}年</option>
              <option value={year + 1}>{year + 1}年</option>
              <option value={year + 2}>{year + 2}年</option>
              <option value={year + 3}>{year + 3}年</option>
            </select>
          </div>
          <div className='month'>
            <a href='javascript:;' className='btn-prev' onClick={this.prevHandler.bind(this)}>&lt;</a>
            <select onChange={this.monthChange.bind(this)} value={month}>
              {(function () {
                let arr = []
                for (let i = 0; i < 12; i++) {
                  arr.push(<option value={i} key={i}>{i + 1}月</option>)
                }
                return arr
              })()}
            </select>
            <a href='javascript:;' className='btn-next' onClick={this.nextHandler.bind(this)}>&gt;</a>
          </div>
          <div className='today'>
            <a href='javascript:;' onClick={this.todayHandler.bind(this)}>返回今天</a>
          </div>
        </div>
        <div className='table' onClick={this.dateChange.bind(this)}>
          <div className='row'>
            <div className='cell'><p>一</p></div>
            <div className='cell'><p>二</p></div>
            <div className='cell'><p>三</p></div>
            <div className='cell'><p>四</p></div>
            <div className='cell'><p>五</p></div>
            <div className='cell'><p>六</p></div>
            <div className='cell'><p>日</p></div>
          </div>
          {rows}
        </div>
      </div>
    )
  }

  componentWillMount () {
    // 节气 ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至']
    // 天干 ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
    // 地址 ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
    // 生效 ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
    let oDate = this.state.date
    let yyyymms = this.getYYYYMMs(oDate.getFullYear(), oDate.getMonth())
    this.getAlmanacInfo(yyyymms)
    this.getHolidayInfo(yyyymms)
  }

  shouldComponentUpdate (nextProps, nextState) {
    let oDate = nextState.date
    let lunar = nextState.lunar
    let holiday = nextState.holiday
    let bool = true
    let yyyymms = this.getYYYYMMs(oDate.getFullYear(), oDate.getMonth())
    yyyymms.forEach(item => {
      if (bool === true) {
        if (!lunar[item]) {
          bool = false
        }
        if (holiday[item] === undefined) {
          bool = false
        }
      }
    })
    return bool
  }

  getYYYYMMs (year, month) {
    return [
      month === 0 ? (year - 1) + '12' : year + ('0' + month).substr(-2, 2),
      year + ('0' + (month + 1)).substr(-2, 2),
      month === 11 ? (year + 1) + '01' : year + ('0' + (month + 2)).substr(-2, 2)
    ]
  }

  getMonthDays (year, month, date) {
    let lunar = this.state.lunar
    let holiday = this.state.holiday
    let [prev, now, next] = this.getYYYYMMs(year, month)
    let dateStr = year + '-' + ('0' + (month + 1)).substr(-2, 2) + '-' + ('0' + date).substr(-2, 2)
    let firstDay = this.getFirstDay(dateStr) || 7 // 本月第一天星期几, 星期一是1, 星期日是0, 用7表示
    let days = this.getDayCountByMonth(dateStr) // 本月一共多少天
    // 上个月一共多少天
    let lastMonthDays = this.getDayCountByMonth(month === 0 ? (year - 1) + '-12' : year + '-' + ('0' + month).substr(-2, 2))
    let arr = []
    // 需要显示的上个月日期
    for (let i = lastMonthDays - (firstDay - 1) + 1; i <= lastMonthDays; i++) {
      arr.push({
        date: i,
        lunar: lunar[prev][i - 1],
        holiday: (holiday && holiday[prev]) ? holiday[prev][i] : {},
        inactive: true
      })
    }
    for (let i = 1; i <= days; i++) {
      arr.push({
        date: i,
        lunar: lunar[now][i - 1],
        holiday: (holiday && holiday[now]) ? holiday[now][i] : {}
      })
    }
    if (arr.length % 7 !== 0) {
      arr = arr.concat([1, 2, 3, 4, 5, 6, 7].slice(0, 7 - arr.length % 7).map(i => {
        return {
          date: i,
          lunar: lunar[next][i - 1],
          holiday: (holiday && holiday[next]) ? holiday[next][i] : {},
          inactive: true
        }
      }))
    }
    return arr
  }

  getAlmanacInfo (arr) {
    let state = {}
    for (let i = 0; i < arr.length; i++) {
      state[arr[i]] = getAlmanac(arr[i])
    }
    this.setState({
      lunar: state
    })
  }

  getHolidayInfo (arr) {
    let state = {}
    let temp = []
    let data = JSON.parse(window.localStorage.getItem('holiday') || '{}')
    arr.map(yyyymm => {
      if (data && data[yyyymm] && Object.keys(data[yyyymm]).length !== 0) {
        state[yyyymm] = data[yyyymm]
      } else {
        state[yyyymm] = {}
        temp.push(yyyymm)
      }
    })
    if (temp.length > 0 && navigator.onLine) {
      this.fetchHolidayInfo(temp).then(holiday => {
        for (let name in holiday) {
          data[name] = holiday[name]
          state[name] = holiday[name]
        }
        this.setState({
          holiday: state
        })
        window.localStorage.setItem('holiday', JSON.stringify(data))
      }, err => {
        throw err
      })
    } else {
      this.setState({
        holiday: state
      })
    }
  }

  fetchHolidayInfo (range) {
    return new Promise((resolve, reject) => {
      let xhr = new window.XMLHttpRequest()
      xhr.responseType = 'json'
      xhr.open('POST', window.location.protocol + '//hunter.im-flower.com/holiday')
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      xhr.send('yyyymms=' + range.join('|'))
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
            resolve(xhr.response)
          } else {
            reject(new Error('fetch holiday info error'))
          }
        }
      }
    })
  }

  setDate (oDate) {
    this.setState({
      date: oDate
    })
    let yyyymms = this.getYYYYMMs(oDate.getFullYear(), oDate.getMonth())
    this.getAlmanacInfo(yyyymms)
    this.getHolidayInfo(yyyymms)
  }

  yearChange (e) {
    let value = Number(e.nativeEvent.target.value)
    let oDate = this.state.date
    oDate.setFullYear(value)
    this.setDate(oDate)
  }

  monthChange (e) {
    let value = Number(e.nativeEvent.target.value)
    let oDate = this.state.date
    oDate.setMonth(value)
    this.setDate(oDate)
  }

  dateChange (e) {
    let oDate = this.state.date
    let year = oDate.getFullYear()
    let month = oDate.getMonth()
    // let date = oDate.getDate()
    let target = e.nativeEvent.target
    target.tagName.toLowerCase() === 'p' && (target = target.parentNode)
    let inactive = target.className.indexOf('inactive') !== -1
    let value = target.innerText
    // 点到 一二三
    if (value.match(/\d+/g) === null || target.className.indexOf('cell') === -1) {
      return
    }
    value = Number(value.match(/\d+/g)[0])
    oDate.setDate(value)
    if (inactive) {
      // 上个月
      if (value > 20) {
        month--
        if (month === -1) {
          oDate.setFullYear(year - 1)
          oDate.setMonth(11)
        } else {
          oDate.setMonth(month)
        }
      }
      // 下个月
      if (value < 7) {
        month++
        if (month === 12) {
          oDate.setFullYear(year + 1)
          oDate.setMonth(0)
        } else {
          oDate.setMonth(month)
        }
      }
    }
    this.setDate(oDate)
  }

  prevHandler () {
    let oDate = this.state.date
    let year = oDate.getFullYear()
    let month = oDate.getMonth()
    if (this.state.month === 0) {
      oDate.setFullYear(year - 1)
      oDate.setMonth(11)
    } else {
      oDate.setMonth(month - 1)
    }
    this.setDate(oDate)
  }

  nextHandler () {
    let oDate = this.state.date
    let year = oDate.getFullYear()
    let month = oDate.getMonth()
    if (month === 11) {
      oDate.setFullYear(year + 1)
      oDate.setMonth(0)
    } else {
      oDate.setMonth(month + 1)
    }
    this.setDate(oDate)
  }

  todayHandler () {
    this.setDate(new Date())
  }

  // 求出本月有多少天？
  // 先把日期调到1号(避免5.31号的下个月6月没有31号)，月份再调到下个月，最后日期调到0。
  getDayCountByMonth (date) {
    let oDate = new Date('' + date)
    oDate.setDate(1)
    oDate.setMonth(oDate.getMonth() + 1)
    oDate.setDate(0)
    return oDate.getDate()
  }
  // 求出本月第一天是周几？
  getFirstDay (date) {
    let oDate = new Date('' + date)
    oDate.setDate(1)
    return oDate.getDay()
  }
}

ReactDOM.render(<Calendar />, document.getElementById('app'))
