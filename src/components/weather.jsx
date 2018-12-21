
import React, { Component } from 'react'

export default class Weather extends Component {
  constructor () {
    super()
    this.state = {
      weather: null,
      showForecast: false
    }
  }

  render () {
    let { weather, showForecast } = this.state
    let { city, today, forecast } = weather || {}
    let date = new Date()
    let week = ['日', '一', '二', '三', '四', '五', '六']

    if (!weather) {
      return null
    }
    return (
      <section id='weather' className={this.getBackground(today.type) || 'sunny'}>
        <a href='javascript:;' onClick={() => this.toggleForecast()}>
          <i className={showForecast ? 'icon-arrow rotate90' : 'icon-arrow'} />
        </a>
        <div className='wrap'>
          {today && (
            <div id='today'>
              <div><i className={'icon-' + this.getIcon(today.type)} /></div>
              <div>
                <p>{city}</p>
                <p>{today.type} {today.temp}℃</p>
                <p>{date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).substr(-2, 2) + '-' + ('0' + date.getDate()).substr(-2, 2)} 周{week[date.getDay()]}</p>
              </div>
              <div>
                <p>温度范围：{today.lowtemp}~{today.hightemp}</p>
                <p>{today.winddir}{today.windsc}</p>
                <p>空气污染指数：{today.aqi}</p>
              </div>
            </div>
          )}
          {showForecast && forecast && (
            <div id='forecast'>
              {forecast.map((item, index) => {
                return (
                  <div key={index}>
                    <header>星期{item.day}<br />{item.date}</header>
                    <div>
                      <i className={'icon-' + this.getIcon(item.type)} />
                    </div>
                    <footer>{item.type}<br />{item.lowtemp}~{item.hightemp}</footer>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    )
  }

  toggleForecast () {
    this.setState({
      showForecast: !this.state.showForecast
    })
  }

  getIcon (desc) {
    let relation = {
      qing: ['晴'],
      duoyun: ['多云'],
      yin: ['阴'],
      wu: ['雾'],
      bingbao: ['冰雹'],
      shachen: ['沙尘', '沙尘暴', '雾霾', '霾'],
      leizhenyu: ['雷阵雨'],
      zhenyu: ['阵雨'],
      xiaoyu: ['小雨'],
      zhongyu: ['中雨', '小到中雨'],
      dayu: ['大雨', '中到大雨'],
      baoyu: ['暴雨', '大到暴雨'],
      yujiaxue: ['雨夹雪'],
      xiaoxue: ['小雪'],
      zhongxue: ['中雪', '小到中雪'],
      daxue: ['大雪', '中到大雪'],
      baoxue: ['暴雪', '大到暴雪']
    }
    for (let name in relation) {
      let result = relation[name].filter(item => item === desc)
      if (result.length !== 0) {
        return name
      }
    }
  }

  getBackground (desc) {
    let relation = {
      sunny: ['晴', '多云', '阴'],
      fog: ['雾', '大雾'],
      dust: ['沙尘', '沙尘暴', '霾', '雾霾'],
      thunder: ['雷阵雨'],
      rain: ['阵雨', '小雨', '中雨', '大雨', '暴雨'],
      snow: ['雨夹雪', '小雪', '中雪', '大雪', '暴雪']
    }
    for (let name in relation) {
      let result = relation[name].filter(item => item === desc)
      if (result.length !== 0) {
        return name
      }
    }
  }

  componentWillMount () {
    let data = this.retrive()
    if (!data || data.stamp <= new Date().getTime() - 1000 * 60 * 15) {
      this.getIPLocation().then(city => {
        return city.replace(/(市|区|县)$/g, '')
      }).then(city => {
        this.getWeather(city)
      })
    } else {
      this.setState({
        weather: data.weather
      })
    }
  }

  getIPLocation () {
    return new Promise((resolve, reject) => {
      let xhr = new window.XMLHttpRequest()
      xhr.open('POST', 'http://118.24.116.182:3000/iplocation')
      xhr.send(null)
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
            resolve(xhr.responseText)
          }
        }
      }
    })
  }

  getWeather (city) {
    let xhr = new window.XMLHttpRequest()
    xhr.open('POST', 'http://118.24.116.182:3000/weather')
    xhr.responseType = 'json'
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send('city=' + encodeURIComponent(city))
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          this.setState({
            weather: xhr.response
          })
          this.restore({
            weather: xhr.response,
            stamp: new Date().getTime()
          })
        }
      }
    }
  }

  restore (data) {
    window.localStorage.setItem('locationWeather', JSON.stringify(data))
  }

  retrive () {
    return JSON.parse(window.localStorage.getItem('locationWeather'))
  }
}
