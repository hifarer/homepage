
import React, { Component } from 'react'

export default class Clock extends Component {
  constructor () {
    super()
    this.oldTime = Clock.time()
    this.state = {
      time: Clock.time()
    }
  }

  render () {
    let time = this.state.time
    let oldTime = this.oldTime
    let arr = [{className: 'hour', refNum: 3}, {className: 'hour', refNum: 10}, {className: 'minute', refNum: 6},
      {className: 'minute', refNum: 10}, {className: 'second', refNum: 6}, {className: 'second', refNum: 10}]
    let classList = ['front', 'top', 'back', 'bottom', 'left', 'right']
    return (
      <section id='clock' className={'clock'}>
        {arr.map(function (item, i) {
          let wrapClass = `wrap${time[i] !== oldTime[i] ? ' animation' : ''}`
          return (
            <div className={item.className} key={i}>
              <div className={wrapClass}>
                {classList.map(function (sideName, index) {
                  return <div className={sideName}
                    key={index}>{index > 3 ? '' : (Number(oldTime[i]) + index) % item.refNum}</div>
                })}
              </div>
            </div>
          )
        })}
      </section>
    )
  }

  componentDidMount () {
    setInterval(() => {
      this.oldTime = this.state.time.map(item => item)
      this.setState({time: Clock.time()})
    }, 1000)
  }

  static time () {
    let date = new Date()
    let arr = ('0' + date.getHours()).substr(-2).split('')
    arr = arr.concat(('0' + date.getMinutes()).substr(-2).split(''))
    arr = arr.concat(('0' + date.getSeconds()).substr(-2).split(''))
    return arr
  }
};
