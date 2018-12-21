
import React, { Component, Fragment } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import ReactDOM from 'react-dom'

import '../style/dadishu.less'

// 引用一下程序中动态加载的图片
import '../images/dadishu/bg.jpg'
import '../images/dadishu/time.png'
import '../images/dadishu/score.png'
import '../images/dadishu/hole.png'
import '../images/dadishu/broom.png'

const createjs = window.createjs

class Game extends Component {
  constructor () {
    super()
    this.state = {
      show: 'loading',
      chest: 'none',
      dialog: false,
      dialogBody: '',
      light: false,
      coin: [0, 0, 0, 0, 0],
      progress: 0
    }
    this.assets = {} // 静态资源
    this.time = 30
    this.score = 0
    this.interval = 300 // 老鼠出现的间隔单位为毫秒
    this.stack = [] // 每次出现老鼠的index数组的集合，只保留最近三次
    this.coordinates = [] // 老鼠洞位置信息
    this.record = {mouse: 0, bottle: 0, bear: 0}
  }
  render () {
    return (
      <Fragment>
        {this.state.show === 'loading' && (
          <div id='loading'>
            <div id='playground' className={this.state.light ? 'light-on' : 'light-off'} />
            <div id='dropping-coin'>
              {[1, 2, 3, 4, 5].map((item, index) => {
                return (
                  <ReactCSSTransitionGroup
                    component='div'
                    key={index}
                    transitionName='coin'
                    transitionLeave={false}
                    transitionEnterTimeout={750}
                  >
                    {this.state.coin[index] ? <span className={'coin-shape' + item} /> : null}
                  </ReactCSSTransitionGroup>
                )
              })}
            </div>
            {this.state.chest === 'full' ? [1, 2].map((item, index) => {
              return (
                <div className={'dropped-coin-box' + item} key={index}>
                  <div className={'dropped-coin' + item} />
                </div>
              )
            }) : null}
            <div id='chest' className={this.state.chest}>
              <p>{this.state.progress}%</p>
            </div>
          </div>
        )}
        {this.state.show === 'home' && (
          <div id='home'>
            <div id='home-ctrl'>
              <a href='javascript:;' id='btn-start' onClick={this.switch.bind(this, 'stage')}>
                <img src={require('../images/dadishu/start.png')} />
              </a>
              <a href='javascript:;' id='btn-rules' onClick={this.showDialog.bind(this, 'rules')}>活动规则</a>
            </div>
          </div>
        )}

        {this.state.show === 'stage' && (
          <canvas id='stage' />
        )}

        <div id='get-score' ref='getScore' className='score-ctrl'>
          <p>+10</p>
        </div>
        <div id='lost-score' ref='lostScore' className='score-ctrl'>
          <p>-10</p>
        </div>

        {this.state.dialog && (
          <div id='dialog'>
            {this.state.dialogBody === 'rules' && (
              <div id='rules'>
                <header>
                  <span className='rule-title'>X任务</span>来啦，<br />给你一所豪宅，有点凌乱，<br />快进行保洁战争吧，狂揽X币啦！
                </header>
                <p className='rule-item'><span className='rule-title'>时间：</span>30秒</p>
                <p className='rule-item'><span className='rule-title'>分数：</span></p>
                <table>
                  <tbody>
                    <tr>
                      <td><img src={require('../images/dadishu/mouse.png')} alt='mouse' /></td>
                      <td><img src={require('../images/dadishu/bottle.png')} alt='bottle' /></td>
                      <td><img src={require('../images/dadishu/bear.png')} alt='bear' /></td>
                    </tr>
                    <tr>
                      <td className='plus'>+10</td>
                      <td className='minus'>-10</td>
                      <td>0</td>
                    </tr>
                  </tbody>
                </table>
                <p className='rule-item'><span className='rule-title'>奖励：</span></p>
                <p className='rule-item rule-reward'>1.根据玩家所获积分，予以相应币奖励</p>
                <p className='rule-item rule-reward'>2.每日TOP10的玩家会得到额外X币奖励<br />（第二日发放，相同分数以完成游戏先后顺序为准）</p>
                <a href='javascript:;' className='btn-iknow' onClick={this.hideDialog.bind(this)}>
                  <img src={require('../images/dadishu/iknow.png')} alt='' />
                </a>
              </div>
            )}
            {this.state.dialogBody === 'result' && (
              <div id='result'>
                <div className='result-title'>
                  <img src={require('../images/dadishu/result-title.png')} alt='' />
                </div>
                <table>
                  <thead>
                    <tr>
                      <td>击中了</td>
                      <td>数量</td>
                      <td>得分</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><img src={require('../images/dadishu/mouse.png')} alt='' /></td>
                      <td><span>{this.record.mouse}</span></td>
                      <td>+<span>{this.record.mouse * 10}</span></td>
                    </tr>
                    <tr>
                      <td><img src={require('../images/dadishu/bear.png')} alt='' /></td>
                      <td><span>{this.record.bear}</span></td>
                      <td><span>0</span></td>
                    </tr>
                    <tr>
                      <td><img src={require('../images/dadishu/bottle.png')} alt='' /></td>
                      <td><span>{this.record.bottle}</span></td>
                      <td>-<span>{this.record.bottle * 10}</span></td>
                    </tr>
                  </tbody>
                </table>
                <div id='total-score'>
                  <p>总得分&nbsp;<span>{this.score}</span></p>
                </div>
                <a href='javascript:;' id='btn-again' onClick={this.restart.bind(this)}>
                  <img src={require('../images/dadishu/play-again.png')} />
                </a>
              </div>
            )}
          </div>
        )}
      </Fragment>
    )
  }

  componentDidMount () {
    this.setTimer()
    this.loadAssets()
  }

  componentDidUpdate (props, states) {
    if (this.state.show === 'stage' && states.show !== 'stage') {
      this.init()
    }
  }

  setTimer () {
    let n = 0
    let coin = setInterval(() => {
      let arr = this.state.coin
      arr[n % 5] = n % 2
      n++
      n === 50 && (n = 0)
      this.setState({
        coin: arr
      })
      if (this.state.progress === 100) {
        clearInterval(coin)
      }
    }, 150)

    // 跑马灯
    let light = setInterval(() => {
      this.setState({
        light: !this.state.light
      })
      if (this.state.progress === 100) {
        clearInterval(light)
      }
    }, 750)
  }

  switch (block) {
    this.setState({
      show: block
    })
  }

  showDialog (block) {
    this.setState({
      dialog: true,
      dialogBody: block
    })
  }

  hideDialog () {
    this.setState({
      dialog: false
    })
  }

  restart () {
    this.hideDialog()
    this.startGame()
  }

  loadAssets () {
    // 这里的加载是在打包后，路径和打包前不一样
    let assets = {
      'path': './images/dadishu/',
      'manifest': [
        {id: 'bg', src: 'bg.jpg'},
        {id: 'time', src: 'time.png'},
        {id: 'score', src: 'score.png'},
        {id: 'hole', src: 'hole.png'},
        {id: 'broom', src: 'broom.png'},
        {id: 'bear', src: 'bear.png'},
        {id: 'mouse', src: 'mouse.png'},
        {id: 'bottle', src: 'bottle.png'}
      ]
    }

    let loader = new createjs.LoadQueue()
    loader.loadManifest(assets)
    loader.addEventListener('progress', this.progress.bind(this))
    loader.addEventListener('complete', () => {
      assets.manifest.forEach((item) => {
        this.assets[item.id] = new createjs.Bitmap(loader.getResult(item.id))
      })
    })
  }

  progress (event) {
    // 延迟1s 让动画展示完整
    setTimeout(() => {
      let percent = parseInt(event.progress * 100)
      if (percent >= 20) {
        this.setState({
          chest: 'little',
          progress: percent
        })
      }
      if (percent >= 80) {
        this.setState({
          chest: 'full',
          progress: percent
        })
      }
      if (percent === 100) {
        setTimeout(() => {
          this.setState({
            show: 'home',
            progress: percent
          })
        }, 1200)
      }
    }, 1000)
  }

  init () {
    let stage = new createjs.Stage('stage')
    stage.canvas.width = document.body.clientWidth * 2 // 解决图片模糊
    stage.canvas.height = document.body.clientHeight * 2
    stage.canvas.style.width = document.body.clientWidth + 'px'
    stage.canvas.style.height = document.body.clientHeight + 'px'
    stage.enableDOMEvents(false)

    createjs.Touch.enable(stage, true)
    createjs.Ticker.setFPS(60)
    createjs.Ticker.addEventListener('tick', stage)
    createjs.Ticker.timingMode = createjs.Ticker.RAF // 解决点击卡顿
    this.stage = stage
    this.getPosition(0) // 获得scale等值。
    this.addBgAndWidgets()
    this.startGame()
  }

  startGame () {
    this.score = 0
    this.stack = []
    this.coordinates = [] // 老鼠洞位置信息
    this.record = {mouse: 0, bottle: 0, bear: 0}
    this.createHoles()

    this.scoreText.set({text: this.score})
    this.scoreText.set({x: 210, y: 55})
    this.timeText.set({text: this.time + "'s"})
    this.timeText.set({x: 150, y: 55})
    this.interval = parseInt(25 * 1000 / (120 / 2))
    this.targetsArray = this.createTargetsArray({'mouse': 70, 'bottle': 30, 'bear': 20})
    // 间隔时间 = 总时间/总次数。前25秒: 25*1000/(120/2); 后5秒: 5*1000/(70/2);
    let time = this.time
    let S5 = null
    let S25 = setInterval(function () {
      time > 0 && this.random()
    }.bind(this), this.interval)
    let timer = setInterval(function () {
      if (time < 10) {
        this.timeText.set({x: 160, y: 55})
      }
      if (time === 6) {
        clearInterval(S25)
        this.interval = parseInt(5 * 1000 / (35 / 2))
        this.targetsArray = this.createTargetsArray({'mouse': 15, 'bottle': 15, 'bear': 5})
        S5 = setInterval(function () {
          time > 0 && this.random()
        }.bind(this), this.interval)
      }
      if (time === 0) {
        clearInterval(timer)
        clearInterval(S5)
        // 显示成绩
        this.showDialog('result')
      }
      this.timeText.set({text: time-- + "'s"})
    }.bind(this), 1000)
  }

  // 计算老鼠洞的位置信息
  getPosition (index) {
    let num = 3
    let portion = 1 / 4 // num: 一行放几个；portion边距占一个图宽度的比例，即两边边距之和。
    let picWidth = 166
    let picHeight = 73
    let outerWidth = this.stage.canvas.width * 0.88 / num // 把canvas的88%设为图显示区，分成num份。
    let innerWidth = (1 - portion) * outerWidth
    let marginX = outerWidth * portion / 2
    let marginY = 2.2 * marginX
    if (!this.scale) {
      this.scale = (innerWidth / picWidth).toFixed(2)
      this.marginX = marginX
      this.marginY = marginY
      this.innerWidth = innerWidth
      this.innerHeight = this.scale * picHeight
    }
    // x: 前面所有图的outerWidth之和+自己的左margin。y同理，margin设为x轴的1.倍
    let x = parseInt(index % num * outerWidth + marginX)
    let y = parseInt(marginY * 2 * parseInt(index / num) + marginY + parseInt(index / num) * this.innerHeight)
    return {x: x, y: y, scaleX: this.scale, scaleY: this.scale}
  }

  // 添加背景和顶部小部件。
  addBgAndWidgets () {
    let bg = this.assets.bg
    let time = this.assets.time
    let score = this.assets.score
    let xScale = this.stage.canvas.width / this.assets.bg.image.naturalWidth
    let yScale = this.stage.canvas.height / this.assets.bg.image.naturalHeight

    let scoreCtn = new createjs.Container()
    let scoreText = new createjs.Text('0', '52px 黑体,SimHei,sans-serif', '#e42f2c')
    scoreText.set({x: 210, y: 55})
    scoreCtn.addChild(score, scoreText)
    scoreCtn.setChildIndex(score, 0)
    scoreCtn.setChildIndex(scoreText, 1)
    scoreCtn.set({x: this.stage.canvas.width * 0.12 / 2, y: 0, scaleX: this.scale, scaleY: this.scale})

    let timeCtn = new createjs.Container()
    let timeText = new createjs.Text(this.time + "'s", '52px 黑体,SimHei,sans-serif', '#e42f2c')
    timeText.set({x: 150, y: 55})
    timeCtn.addChild(time, timeText)
    timeCtn.setChildIndex(time, 0)
    timeCtn.setChildIndex(timeText, 1)
    timeCtn.set({x: this.stage.canvas.width * (1 - 0.12 / 2) - time.getBounds().width * this.scale, y: 0, scaleX: this.scale, scaleY: this.scale})

    bg.set({scaleX: xScale, scaleY: yScale})
    this.timeText = timeText
    this.scoreText = scoreText
    this.stage.addChild(bg, scoreCtn, timeCtn)
    this.stage.setChildIndex(bg, 0)
    this.addBroomAndTargetsCtn()
  }

  // 添加老鼠的容器及扫帚
  addBroomAndTargetsCtn () {
    let targetCtn = new createjs.Container()
    targetCtn.set({x: this.stage.canvas.width * 0.12 / 2, y: this.stage.canvas.height * 0.40})
    this.broom = this.assets.broom
    this.broom.visible = false
    this.stage.addChild(targetCtn, this.broom)
    this.stage.setChildIndex(targetCtn, 2)
    this.targetCtn = targetCtn
  }

  // 创建老鼠洞。
  createHoles () {
    let holeCtn = new createjs.Container()
    holeCtn.set({x: this.stage.canvas.width * 0.12 / 2, y: this.stage.canvas.height * 0.4})
    for (let i = 0; i < 9; i++) {
      let hole = this.assets.hole.clone()
      let style = this.getPosition(i)
      hole.set(style)
      holeCtn.addChild(hole)
      this.coordinates.push(style)
      this.beatTarget(hole, style)
    }
    this.stage.addChild(holeCtn)
    this.stage.setChildIndex(holeCtn, 1)
    this.holeCtn = holeCtn
  }

  // 生成老鼠数组。
  // json e.g. {'mouse': 70, 'bottle': 30, 'bear': 20}
  createTargetsArray (json) {
    let arr = []
    for (let name in json) {
      for (let i = 0; i < json[name]; i++) {
        arr.push(name)
      }
    }
    arr.sort(function (item) {
      return Math.random() - 0.5
    })
    return arr
  }

  random () {
    let count = 2 || Math.ceil(Math.random() * 3) // 本次出多少个
    let temp = [] // 本次出哪些
    let his = [] // 前两次出现的
    this.stack.forEach(function (arr) {
      his = his.concat(arr)
    })
    while (temp.length < count) {
      let index = Math.floor(Math.random() * 9)
      if (his.filter(function (value) { return value === index }).length === 0) {
        his.push(index)
        temp.push(index)
      }
    }
    this.stack.push(temp)
    this.stack.length === 3 && this.stack.shift()
    temp.forEach(function (value) {
      this.createTarget(value)
    }.bind(this))
  }

  createTarget (index) {
    let animateTime = this.interval * 3
    let targetCtn = this.targetCtn
    let i = parseInt(Math.random() * this.targetsArray.length)
    let targetName = this.targetsArray[i]
    let target = this.assets[targetName].clone()
    let hole = this.holeCtn.children[index]
    let offsetY = this.innerHeight * 11 / 73
    let style = {} // 直接等于是引用赋值，会互相影响。
    for (let name in this.coordinates[index]) {
      style[name] = this.coordinates[index][name]
    }
    style.x = style.x + (this.innerWidth - target.getBounds().width * style.scaleX) / 2
    style.y = style.y - (target.getBounds().height * style.scaleY - this.innerHeight) - offsetY
    this.targetsArray.splice(i, 1)
    let width = target.getBounds().width * style.scaleX
    let height = target.getBounds().height * style.scaleY
    let shape = new createjs.Shape()
    shape.graphics.drawRect(style.x, style.y, width, height)
    target.mask = shape
    target.set(style)
    hole.targetKey = targetName
    hole.targetObject = target
    targetCtn.addChild(target)
    target.set({y: style.y + target.getBounds().height + offsetY})
    createjs.Tween.get(target).to({y: style.y}, 3 / 10 * animateTime).wait(2 / 5 * animateTime).call(function () {
      createjs.Tween.get(target).to({y: style.y + target.getBounds().height + offsetY}, 3 / 10 * animateTime).call(function () {
        targetCtn.removeChild(target)
        hole.targetKey = ''
      })
    })
    target.addEventListener('mousedown', function () {
      hole.dispatchEvent('mousedown')
    })
    target.addEventListener('pressup', function () {
      hole.dispatchEvent('pressup')
    })
  }

  beatTarget (obj, style) {
    let targetCtn = this.targetCtn
    let animateTime = this.interval * 3
    let offsetY = this.innerHeight * 11 / 73
    let broom = this.broom
    let broomWidth = broom.image.naturalWidth
    let getScore = this.refs.getScore
    let lostScore = this.refs.lostScore
    obj.addEventListener('mousedown', function (event) {
      if (obj.targetKey) {
        createjs.Tween.removeTweens(obj.targetObject)
        createjs.Tween.get(obj.targetObject).to({y: style.y + obj.targetObject.getBounds().height + offsetY}, 3 / 10 * animateTime * 0.5).call(function () {
          targetCtn.removeChild(obj.targetObject)
          obj.targetKey = ''
        })
        let scoreCtrl = null
        if (obj.targetKey === 'mouse') {
          scoreCtrl = getScore
          this.score += 10
          this.record.mouse++
        }
        if (obj.targetKey === 'bottle') {
          scoreCtrl = lostScore
          this.score -= 10
          this.score < 0 && (this.score = 0)
          this.record.bottle++
        }
        if (obj.targetKey === 'bear') {
          this.record.bear++
        }
        if (scoreCtrl) {
          scoreCtrl.style.left = style.x / 2 + this.innerWidth / 2 - scoreCtrl.offsetWidth + 'px'
          scoreCtrl.style.top = style.y / 2 + document.body.clientHeight * 0.4 + 'px'
          scoreCtrl.classList.add('score-changed')
          setTimeout(function () {
            scoreCtrl.classList.remove('score-changed')
          }, 500)
        }
      }

      obj.targetKey = ''
      this.scoreText.set({text: this.score})
      this.score >= 10 && this.scoreText.set({x: 190, y: 55})
      this.score >= 100 && this.scoreText.set({x: 170, y: 55})
      this.stage.setChildIndex(broom, 5)
      broom.visible = true
      broom.set({x: style.x + broomWidth / 2, y: style.y - 50 + this.stage.canvas.height * 0.4, scaleX: this.scale, scaleY: this.scale})
    }.bind(this))

    obj.addEventListener('pressup', function (event) {
      broom.visible = false
    })
  }
}

let rootEle = document.getElementById('app')

ReactDOM.render(<Game />, rootEle)

document.addEventListener('DOMContentLoaded', () => {
  if (!navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
    rootEle.style.display = 'none'
    window.alert('本游戏没有对PC端进行适配，请使用移动设备尝试！')
  }
})
window.addEventListener('orientationchange', () => {
  if (window.orientation !== 0) {
    rootEle.style.display = 'none'
    window.alert('本游戏不支持横屏！')
  } else {
    rootEle.style.display = 'block'
  }
}, false)
