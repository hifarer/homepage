
import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'

import '../style/weather.less'
import '../images/weather.png'

class Weather extends Component {
  constructor () {
    super()
    this.state = {
      weather: null,
      loading: true
    }
  }
  render () {
    let { weather, loading } = this.state
    let { city, today, forecast } = weather || {}
    if (weather !== null) {
      return (
        <Fragment>
          <div id='info'>
            <i className='icon-local' />
            <span className='city'>{city}</span>
            <span className='date'>{this.parseTime()}</span>
          </div>
          <div id='today'>
            <div className='temp'><span className='num'>{today.temp}</span><span className='degree'>℃</span></div>
            <div className='details'>
              <div className='wrap'>
                <p className='desc'>{today.type}{today.lowtemp}/{today.hightemp}</p>
                <p className='wind'>
                  <span>{today.winddir}</span>
                  <span>{today.windsc}</span>
                </p>
                <p className='air'>空气指数：{today.aqi || '暂无数据'}</p>
              </div>
            </div>
          </div>
          <div id='forecast'>
            {forecast.map((item, index) => {
              return (
                <div className='someday' key={index}>
                  <div className='date'><p>星期{item.day}</p><p>{item.date}</p></div>
                  <div className='icon'><i className={'icon-' + this.getWeatherIcon(item.type)} /></div>
                  <div className='desc'>{item.type}</div>
                  <div className='temp'><p>{item.lowtemp}</p><p>/</p><p>{item.hightemp}</p></div>
                </div>
              )
            })}
          </div>
        </Fragment>
      )
    }
    if (loading) {
      return (
        <div id='toast'>
          <p><i className='icon-loading' /></p>
          <p>数据加载中</p>
        </div>
      )
    }
    return null
  }

  componentDidMount () {
    if (window.location.protocol === 'https:') {
      this.getCoordinate()
    } else {
      this.coordinate = {
        lat: 25.93,
        lng: 111.07
      }
      this.getLocation().then(city => {
        return city.replace(/(市|区|县)$/g, '')
      }).then(city => {
        this.getWeather(city)
      })
    }
  }

  getWeatherIcon (desc) {
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
      if (relation[name].indexOf(desc) !== -1) {
        return name
      }
    }
    return 'qing'
  }
  getWeixinCoordinate () {
    window.wx.getLocation({
      type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: data => {
        if (data.errMsg === 'getLocation:ok') {
          this.coordinate = {
            lat: data.latitude || data.res.latitude,
            lng: data.longitude || data.res.longitude
          }
          this.getLocation().then(city => {
            return city.replace(/(市|区|县)$/g, '')
          }).then(city => {
            this.getWeather(city)
          })
        }
      }
    })
  }
  getCoordinate () {
    if (navigator.geolocation) {
      if (window.location.protocol === 'http:') {
        this.warning('请在微信中打开，或使用https模式访问本页。')
      } else {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.coordinate = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            this.getLocation().then(city => {
              return city.replace(/(市|区|县)$/g, '')
            }).then(city => {
              this.getWeather(city)
            })
          },
          () => {
            this.warning('获取位置失败，请稍后再试！')
          },
          {
            // 指示浏览器获取高精度的位置，默认为false
            enableHighAccuracy: false,
            // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
            timeout: 45 * 1000,
            // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
            maximumAge: 30 * 60 * 1000
          }
        )
      }
    } else {
      this.warning('该浏览器不支持获取地理位置！')
    }
  }
  getLocation () {
    return new Promise((resolve, reject) => {
      let xhr = new window.XMLHttpRequest()
      xhr.open('POST', window.location.protocol + '//hunter.im-flower.com/geolocation')
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      xhr.responseType = 'json'
      xhr.send('lat=' + this.coordinate.lat + '&lng=' + this.coordinate.lng)
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
            let city = xhr.response.addressComponent.city
            if (Array.isArray(city) && city.length === 0) {
              resolve('杭州市')
            } else {
              resolve(city)
            }
          }
        }
      }
    })
  }

  getWeather (city) {
    let xhr = new window.XMLHttpRequest()
    xhr.open('POST', window.location.protocol + '//hunter.im-flower.com/weather')
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.responseType = 'json'
    xhr.send('city=' + encodeURIComponent(city))
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          this.setState({ weather: xhr.response })
        }
      }
    }
  }

  warning (msg) {
    window.alert(msg)
    this.setState({
      loading: false
    })
  }

  parseTime () {
    let date = new Date()
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).substr(-2, 2) + '-' + ('0' + date.getDate()).substr(-2, 2)
  }
}

ReactDOM.render(<Weather />, document.getElementById('app'))
