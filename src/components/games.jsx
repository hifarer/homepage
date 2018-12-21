
import React, { Component } from 'react'

export default class Games extends Component {
  constructor () {
    super()
    this.state = {
      ddsDesc: false,
      llkDesc: false,
      qrcode: null,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
  }

  render () {
    return (<section id='games'>
      <h3>我的游戏</h3>
      <div className='game'
        onMouseDown={this.clickHandler.bind(this, 'dadishu')}
        onMouseOver={this.overHandler.bind(this, 'ddsDesc')}
        onMouseOut={this.outHandler.bind(this, 'ddsDesc')}>
        <img src={require('../images/games/dadishu.png')} />
        {this.state.isMobile ? '' : (
          <div className='desc' style={{display: this.state.ddsDesc ? 'block' : 'none'}}>
            <div className='wrap'>
              <div className='qrcode'>
                <img src={this.state.qrcode.dds} alt='' />
              </div>
              <h4>打地鼠</h4>
              <p>扫码开始游戏</p>
            </div>
          </div>
        )}
      </div>
      <div className='game'
        onMouseDown={this.clickHandler.bind(this, 'lianliankan')}
        onMouseOver={this.overHandler.bind(this, 'llkDesc')}
        onMouseOut={this.outHandler.bind(this, 'llkDesc')}>
        <img src={require('../images/games/lianliankan.png')} />
        {this.state.isMobile ? '' : (
          <div className='desc' style={{display: this.state.llkDesc ? 'block' : 'none'}}>
            <div className='wrap'>
              <div className='qrcode'>
                <img src={this.state.qrcode.llk} alt='' />
              </div>
              <h4>连连看</h4>
              <p>扫码开始游戏</p>
            </div>
          </div>
        )}
      </div>
    </section>)
  }

  componentWillMount () {
    let data = {
      dds: 'https://www.codeidot.com/dadishu.html',
      llk: 'https://www.codeidot.com/lianliankan.html'
    }
    let state = {}
    let qrcode = new window.QRCode(document.createElement('div'), '')
    for (let name in data) {
      qrcode.makeCode(data[name])
      state[name] = qrcode._el.children[0].toDataURL()
    }
    this.setState({
      qrcode: state
    })
  }

  overHandler (state, ev) {
    let current = ev.currentTarget
    let event = ev.nativeEvent
    let obj = event.fromElement || event.relatedTarget
    let json = {}
    json[state] = true
    if (!current.contains(obj)) {
      this.setState(json)
    }
  }

  outHandler (state, ev) {
    let current = ev.currentTarget
    let event = ev.nativeEvent
    let obj = event.toElement || event.relatedTarget
    let json = {}
    json[state] = false
    if (!current.contains(obj)) {
      this.setState(json)
    }
  }

  clickHandler (name) {
    if (this.state.isMobile) {
      window.open('https://www.codeidot.com/' + name + '.html')
    }
  }
}
