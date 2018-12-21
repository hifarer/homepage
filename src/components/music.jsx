
import React, { Component} from 'react'

let raf = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame

function random (m, n) {
  return Math.round(Math.random() * (n - m) + m)
}

export default class Music extends Component {
  constructor (options) {
    super()
    this.state = {
      width: 0,
      height: 0,
      left: 100,
      display: 'none',
      playState: 'pause'
    }
    this.currentTime = 0
    this.tempBuffers = []
    this.playlist = []
    this.musicIndex = 0
    this.loadedCount = 0
    this.size = options.size || 32
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    this.gainNode = this.audioCtx.createGain() || this.audioCtx.createGainNode()
    this.gainNode.connect(this.audioCtx.destination)
    this.analyser = this.audioCtx.createAnalyser()
    this.analyser.connect(this.gainNode)
    this.analyser.fftSize = this.size * 2
    this.xhr = new window.XMLHttpRequest()
    this.getDots()
    window.addEventListener('resize', this.resizeStage.bind(this), false)
  }

  render () {
    return (
      <section id='music' ref='music'>
        <div className={'ctrl-box'} ref={'ctrlBox'} style={{display: this.state.display}}
          onMouseOut={this.outHandler.bind(this)}>
          <div className={'wrap'}>
            <a href='javascript:;' onClick={this.play.bind(this)}
              className={this.state.playState === 'play' ? 'pause-icon' : 'play-icon'} />
            <a href='javascript:;' onClick={this.next.bind(this)} className={'next-icon'} />
            <div className={'range-box'} onClick={this.rangeClick.bind(this)}>
              <p className={'range-progress'} style={{width: (this.state.left + 20) + 'px'}} />
              <span className={'range-thumb'} ref='thumb' style={{left: this.state.left + 'px'}}
                onMouseDown={this.drag.bind(this)} />
            </div>
          </div>
        </div>
        <canvas ref='stage' width={this.state.width} height={this.state.height}
          onMouseOver={this.overHandler.bind(this)} />
      </section>
    )
  }

  componentDidMount () {
    this.resizeStage()
    this.changeVolume(this.state.left / 180)
    this.playlist = ['青花瓷 - 周杰伦.mp3', '龙卷风 - 周杰伦.mp3']
    this.raf(this.visualize)
  }

  componentDidUpdate (props, states) {
    // willUpdate: next
    // didUpdate: prev
    if (states.width !== this.state.width || states.height !== this.state.height) {
      this.getDots()
    }
    if (states.left !== this.state.left) {
      this.changeVolume(this.state.left / 180)
    }
  }

  overHandler () {
    this.setState({
      display: 'block'
    })
  }

  outHandler (e) {
    let event = e.nativeEvent
    if (!this.refs.ctrlBox.contains(event.toElement)) {
      this.setState({
        display: 'none'
      })
    }
  }

  rangeClick (e) {
    let event = e.nativeEvent
    if (event.target !== this.refs.thumb) {
      this.setState({
        left: Math.min(event.layerX, 180)
      })
    }
  }

  drag (e) {
    let event = e.nativeEvent
    let obj = event.target
    let clientLeft = obj.parentNode.getBoundingClientRect().left
    document.onmousemove = function (event) {
      let left = event.clientX - clientLeft
      left < 0 && (left = 0)
      left > obj.parentNode.offsetWidth - obj.offsetWidth && (left = obj.parentNode.offsetWidth - obj.offsetWidth)
      this.setState({
        left: left
      })
    }.bind(this)
    document.onmouseup = function () {
      this.onmousemove = null
      this.onmouseup = null
    }
    return false
  }

  resizeStage () {
    if (this.refs.stage) {
      this.setState({
        width: parseInt(this.refs.stage.offsetWidth),
        height: parseInt(this.refs.stage.offsetHeight)
      })
    }
  }

  getDots () {
    let width = this.state.width
    let height = this.state.height
    this.dots = []
    for (var i = 0; i < this.size; i++) {
      this.dots[i] = {
        x: random(0, width),
        y: random(0, height),
        dx: random(1, 3),
        color: 'rgba(' + random(0, 255) + ', ' + random(0, 255) + ', ' + random(0, 255) + ', 0.6)'
      }
    }
  }

  load () {
    let name = this.playlist[this.musicIndex % this.playlist.length]
    let url = './assets/' + name
    let data = this.findCache(name)
    if (!data) {
      this.xhr.abort()
      this.xhr.open('GET', url)
      this.xhr.responseType = 'arraybuffer' // 注意b小写
      this.xhr.send()
      this.xhr.onload = this.decode.bind(this, name)
    } else {
      this.start(data)
    }
  }

  decode (name) {
    if (this.loadedCount !== this.musicIndex) {
      this.loadedCount = this.musicIndex
      return
    }
    this.audioCtx.decodeAudioData(this.xhr.response, function (bs) {
      if (this.loadedCount !== this.musicIndex) {
        this.loadedCount = this.musicIndex
        return
      }
      this.tempBuffers.push({name: name, bs: bs})
      this.loadedCount++
      this.start(bs)
    }.bind(this), function (err) {
      console.log(err)
    })
  }

  findCache (name) {
    let data = null
    this.tempBuffers.forEach(function (item) {
      item.name === name && (data = item.bs)
    })
    return data
  }

  start (bs) {
    this.bufferSource = this.audioCtx.createBufferSource()
    this.bufferSource.buffer = bs
    this.bufferSource.connect(this.analyser)
    this.bufferSource[this.bufferSource.start ? 'start' : 'noteOn'](0, this.currentTime, bs.duration)
  }

  play () {
    let playState = this.state.playState === 'pause' ? 'play' : 'pause'
    this.setState({
      playState: playState
    })
    this.bufferSource && this.bufferSource[this.bufferSource.stop ? 'stop' : 'noteOff']()
    if (playState === 'play') {
      this.load()
    } else {
      this.currentTime = this.audioCtx.currentTime
    }
  }

  next () {
    this.setState({
      playState: 'play'
    })
    this.bufferSource && this.bufferSource[this.bufferSource.stop ? 'stop' : 'noteOff']()
    this.currentTime = 0
    this.musicIndex++
    this.load()
  }

  changeVolume (percent) {
    this.gainNode.gain.value = percent
  }

  raf (fn) {
    raf(fn.bind(this))
  }

  visualize () {
    let count = this.size
    let arr = new Uint8Array(count)
    this.analyser.getByteFrequencyData(arr)
    this.draw(arr)
    this.raf(this.visualize)
  }

  draw (arr) {
    let { playState, width, height } = this.state
    let dots = this.dots
    let context = this.refs.stage ? this.refs.stage.getContext('2d') : null
    if (!context) return
    context.clearRect(0, 0, width, height)
    arr.forEach(function (radius, i) {
      let r = 10 + Math.round(radius / 256 * (Math.min(width, height) / 5))
      let c = dots[i]
      let g = context.createRadialGradient(c.x, c.y, 0, c.x, c.y, r)
      g.addColorStop(0, 'rgba(255, 255, 255, 0.6)')
      g.addColorStop(1, c.color)

      context.beginPath()
      context.arc(c.x, c.y, r, 0, Math.PI * 2, false)
      context.fillStyle = g
      context.fill()
      if (playState === 'play') {
        c.x += c.dx
        c.x = c.x > width ? 0 : c.x
      }
    })
  }
}
