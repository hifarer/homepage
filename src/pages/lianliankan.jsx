
import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'

import '../style/lianliankan.less'
// 引用一下程序中动态加载的资源
import '../assets/bonus.mp3'
import '../assets/flip.mp3'

import '../images/lianliankan/bg.gif'
import '../images/lianliankan/icon-clock.png'
import '../images/lianliankan/icon-dismiss.png'

import '../images/lianliankan/ill1.jpg'
import '../images/lianliankan/ill2.jpg'
import '../images/lianliankan/ill3.jpg'
import '../images/lianliankan/ill4.jpg'
import '../images/lianliankan/ill5.jpg'
import '../images/lianliankan/ill6.jpg'

import '../images/lianliankan/cover1.jpg'
import '../images/lianliankan/cover2.jpg'
import '../images/lianliankan/cover3.jpg'
import '../images/lianliankan/cover4.jpg'
import '../images/lianliankan/cover5.jpg'
import '../images/lianliankan/cover6.jpg'
import '../images/lianliankan/cover7.jpg'
import '../images/lianliankan/cover8.jpg'
import '../images/lianliankan/cover9.jpg'
import '../images/lianliankan/cover10.jpg'
import '../images/lianliankan/cover11.jpg'
import '../images/lianliankan/cover12.jpg'
import '../images/lianliankan/cover13.jpg'
import '../images/lianliankan/cover14.jpg'

const createjs = window.createjs

class Game extends Component {
  constructor () {
    super()
    this.state = {
      show: 'home',
      // 已加载的比例
      percent: 0,
      dismiss: false,
      dialog: false
    }
    // 游戏时间
    this.time = 60
    // 游戏得分
    this.score = 0
    // 翻转图关系集合
    this.matrix = []
    // 上一个点击的坐标
    this.prevIndex = -1
  }
  render () {
    return (
      <Fragment>
        {this.state.show === 'home' && (
          <div id='home'>
            <div className='btn-box'>
              {/* <a href="javascript:;" className="btn-mark" onClick={this.switch.bind(this, 'score')}><i className="icon-mark"></i><span>我的成绩</span></a> */}
              <a href='javascript:;' className='btn-rules' onClick={this.switch.bind(this, 'rules')}><i className='icon-rules' /><span>活动规则</span></a>
            </div>
            <a href='javascript:;' className='btn-start' onClick={this.switch.bind(this, 'loading')} />
          </div>
        )}

        {this.state.show === 'loading' && (
          <div id='loading'>
            <div className='wrap'>
              <div className='progress'>
                <div className='bar-box'>
                  <div className='bar' style={{width: parseInt(this.state.percent * 100) + '%'}} />
                </div>
                <div className='percent'>{parseInt(this.state.percent * 100)}%</div>
              </div>
            </div>
          </div>
        )}

        {this.state.show === 'rules' && (
          <div id='rules'>
            <div className='wrap'>
              <p><span className='rule-title'>活动时间：</span>5.6 18:00 - 5.8 18:00</p>
              <p><span className='rule-title'>游戏玩法：</span>开始游戏后，屏幕上会出现20个题板，点击题板会随机出现各种未知的疾病症状，每翻开两个相同症状的题板积一分，每轮游戏时间为60s，该轮结束后积分会被记录在成绩单。初始每人拥有5次游戏机会，转发至朋友圈即可获得无限次游戏机会。</p>
              <p><span className='rule-title'>领奖须知：</span>在5月9日中午12:00前，将“我的成绩单”保存在相册/截图后，发至宏德医药消栓肠溶胶囊学术专员处。最高成绩达到25分，可获得三等奖保鲜套盒一份；最高成绩达到30分，可获得二等奖健身套装一份；更有一等奖神秘大奖，敬请期待。</p>
              <p>本活动最终解释权归某公司所有。</p>
            </div>
            <a href='javascript:;' className='btn-iknow' onClick={this.switch.bind(this, 'home')}><img src={require('../images/lianliankan/icon-iknow.png')} /></a>
          </div>
        )}

        {this.state.show === 'score' && (
          <div id='score'>
            <div className='wrap'>
              <table>
                <tbody>
                  <tr>
                    <td><img src={require('../images/lianliankan/icon-clock.png')} /></td>
                    <td><img src={require('../images/lianliankan/icon-dismiss.png')} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <a href='javascript:;' className='btn-iknow' onClick={this.switch.bind(this, 'home')}><img src={require('../images/lianliankan/icon-iknow.png')} /></a>
          </div>
        )}

        {this.state.dialog && (
          <div id='dialog'>
            <div className='wrap'>
              <div className='msg-box'>
                <img src={require('../images/lianliankan/bubble.png')} />
                <div className='msg'>
                  <h3 className='msg-title'>很厉害！</h3>
                  <p className='msg-body'>
                    恭喜您在<span>{this.time}</span>秒得到了<span>{this.score}</span>分。
                  </p>
                </div>
              </div>
              <div className='btn-box'>
                <a href='javascript:;' className='btn-again' onClick={this.reInit.bind(this)}><img src={require('../images/lianliankan/icon-again.png')} /></a>
                {/* <span className="btn-gap"></span> */}
                {/* <a href="javascript:;" className="btn-share"><img src="./images/lianliankan/icon-share.png"/></a> */}
              </div>
            </div>
          </div>
        )}

        {this.state.dismiss === true && (
          <div className='dismiss-plus'>
            <span>+</span>
            <img src={require('../images/lianliankan/icon-dismiss.png')} />
          </div>
        )}

        <canvas id='stage'>浏览器版本太旧请升级!</canvas>

      </Fragment>
    )
  }

  componentDidUpdate (props, states) {
    if (this.state.show === 'loading' && states.show !== 'loading') {
      this.init()
    }
  }

  switch (block) {
    this.setState({
      show: block
    })
  }

  init () {
    this.stage = new createjs.Stage('stage') // 不用加#号
    this.stage.canvas.width = document.body.clientWidth * 2
    this.stage.canvas.height = document.body.clientHeight * 2
    this.stage.canvas.style.width = document.body.clientWidth + 'px'
    this.stage.canvas.style.height = document.body.clientHeight + 'px'

    if (createjs.Touch.isSupported()) {
      createjs.Touch.enable(this.stage, true)
    }
    let context = this.stage.canvas.getContext('2d')
    context.imageSmoothingEnabled = context.webkitImageSmoothingEnabled = context.mozImageSmoothingEnabled = true
    createjs.Ticker.timingMode = createjs.Ticker.RAF
    createjs.Ticker.setFPS(60)
    createjs.Ticker.addEventListener('tick', this.stage)

    this.padding = { left: this.stage.canvas.width * 0.12 / 2, top: '' }
    this.loadAssets()
  }

  reInit () {
    let second = this.time
    this.score = 0
    this.prevIndex = -1

    this.setState({
      dialog: false
    })
    this.removeItems()
    this.getIllList()
    this.getCoverList()
    this.leftText.set({ text: 'X 0' })
    this.rightText.set({ text: second-- + '秒' })
    this.startGame()
  }

  // 资源加载
  loadAssets () {
    // 这里的加载是在打包后，路径和打包前不一样
    let assets = {
      ill: {
        'path': './images/lianliankan/ill',
        'manifest': [
          '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg'
        ]
      },
      cover: {
        'path': './images/lianliankan/cover',
        'manifest': [
          '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg',
          '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg'
        ]
      },
      otherImage: {
        'path': './images/lianliankan/',
        'manifest': [
          {id: 'bg', src: 'bg.gif'},
          {id: 'clock', src: 'icon-clock.png'},
          {id: 'dismiss', src: 'icon-dismiss.png'}
        ]
      }
    }
    let loader = new createjs.LoadQueue()
    loader.loadManifest(assets.otherImage)
    loader.addEventListener('complete', () => {
      let bg = new createjs.Bitmap(loader.getResult('bg'))
      let xScale = this.stage.canvas.width / bg.getBounds().width
      let yScale = this.stage.canvas.height / bg.getBounds().height
      bg.setTransform(0, 0, xScale, yScale)
      this.dismiss = new createjs.Bitmap(loader.getResult('dismiss'))
      this.clock = new createjs.Bitmap(loader.getResult('clock'))
      this.stage.addChild(bg)
      this.stage.update()
    })

    this.coverLoader = new createjs.LoadQueue()
    this.illLoader = new createjs.LoadQueue()
    this.illLoader.loadManifest(assets.ill)
    this.illLoader.addEventListener('progress', (event) => {
      this.progress('ill', event.progress)
    })
    this.illLoader.addEventListener('complete', () => {
      this.getIllList()
      this.coverLoader.loadManifest(assets.cover)
      this.coverLoader.addEventListener('progress', (event) => {
        this.progress('cover', event.progress)
      })
      this.coverLoader.addEventListener('complete', this.getCoverList.bind(this))
    })

    createjs.Sound.registerSound('./assets/flip.mp3', 'flip')
    createjs.Sound.registerSound('./assets/bonus.mp3', 'bonus')
  }

  progress (type, percent) {
    let totalPercent = type === 'ill' ? percent * 6 / 20 : 6 / 20 + percent * 14 / 20 // 6/20为ill加载完后的百分比
    if (this.state.percent !== totalPercent) {
      this.setState({
        percent: totalPercent
      })
    }
    if (totalPercent === 1) {
      // 显示canvas
      setTimeout(() => {
        this.switch('stage')
      }, 500)
    }
  }

  // 获取翻转后的图片列表
  getIllList () {
    let items = this.illLoader.getItems(true)
    let arr = [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5]
    let temp = []
    while (arr.length < 20) {
      let num = parseInt(Math.random() * 6)
      arr.filter(function (item) { return item === num }).length === 2 && (arr = arr.concat([num, num]))
    }
    arr.sort(function () {
      return Math.random() - 0.5
    }).forEach(function (value) {
      temp.push({item: items[value], key: value})
    })
    this.illList = temp
  }

  // 获取翻转前的图片列表
  getCoverList () {
    let items = this.coverLoader.getItems(true)
    /* let arr = []
    for(let i = 0; i < 14; i++){  //保证14张图片每张都有
     arr.push(i);
     }
     while(arr.length < 20){   //一共20张，每张图片最多重复2次。
     let num = parseInt(Math.random()*14);
     arr.filter(function (item) {return item == num;}).length < 2 && arr.push(num);
     }
     arr.sort(function () {   //随机排序
     return Math.random() - 0.5;
     }).forEach(function (item, index) {
     this.createItems(items[item], index);
     }.bind(this)); */

    for (let i = 0; i < 20; i++) {
      this.createItems(items[i % 14], i)
    }
  }

  // 插入一个个图片
  createItems (item, index) {
    let total = 12
    let num = 2 // total一个图分成的总份数， num边距占的份数。
    let picWidth = 130
    let picHeight = 156
    let outerWidth = 0.88 * this.stage.canvas.width / 4 // 分成四份
    let partWidth = outerWidth / total // 每份的total-num/total是图部分的宽度，num/total是两边间距之和。
    let margin = partWidth * 2 * 4 / 5 // 每份有两个边距，一共4份，4份之间有5个间隔。

    if (!this.scale) {
      this.scale = (partWidth * (total - num) / picWidth).toFixed(2) // partWidth*(total-num)为一个图的宽度
      this.margin = margin
      this.calcPicWidth = partWidth * (total - num)
      this.calcPicHeight = this.scale * picHeight
    }
    let x = this.padding.left + parseInt(margin * (index % 4 + 1) + index % 4 * partWidth * (total - num))
    let y = parseInt(margin * (parseInt(index / 4) + 1) + parseInt(index / 4) * this.scale * picHeight)

    if (!this.padding.top) {
      let top = this.stage.canvas.height * 0.03
      let left1 = this.padding.left + this.margin
      let left2 = this.padding.left + 0.88 * this.stage.canvas.width - margin - this.clock.getBounds().width * 0.8
      this.padding.top = (this.stage.canvas.height - (picHeight * this.scale * 5 + margin * 6)) / 2
      this.addIcon(left1, left2, top)
    }
    y += this.padding.top

    let scale = Number(this.scale) // createjs 不会对scale的值进行类型转换，如果转成number格式会导致动画错乱。
    let centerX = x + this.calcPicWidth / 2
    let ill = new createjs.Bitmap(this.illList[index].item.result)
    ill.set({x: centerX, y: y, scaleX: 0, scaleY: scale})
    let cover = new createjs.Bitmap(item.result)
    cover.set({x: x, y: y, scaleX: scale, scaleY: scale})
    cover.addEventListener('click', function () {
      cover.mouseEnabled = false
      this.clickHandler(cover, index, {x: x, y: y})
    }.bind(this))
    this.stage.addChild(ill, cover)
    this.stage.update()
    this.matrix[index] = {cover: cover, ill: ill, key: this.illList[index].key, x: x, y: y}
  }

  removeItems () {
    this.matrix.forEach(function (item, index) {
      this.stage.removeChild(item.cover, item.ill)
    }.bind(this))
    this.matrix = []
  }

  // 点击事件
  clickHandler (bitmap, index, pos) {
    let self = this
    let scale = this.scale
    let centerX = pos.x + this.calcPicWidth / 2
    createjs.Sound.play('flip')
    createjs.Tween.get(bitmap).to({x: centerX, scaleX: 0}, 80).call(function (event) {
      createjs.Tween.get(self.matrix[index].ill).to({x: pos.x, scaleX: Number(scale)}, 80).call(function () {
        self.updateBoard(index)
      })
    })
  }

  // 更新"棋盘"
  updateBoard (index) {
    let self = this
    let prevIndex = this.prevIndex
    this.prevIndex = index
    if (prevIndex !== -1 && prevIndex !== index) { // 判断点击的是否是同一个
      let centerX = this.matrix[index].x + this.calcPicWidth / 2
      let centerY = this.matrix[index].y + this.calcPicHeight / 2
      let prevX = this.matrix[prevIndex].x
      let prevCenterX = prevX + this.calcPicWidth / 2
      let prevCenterY = this.matrix[prevIndex].y + this.calcPicHeight / 2
      if (this.matrix[index].key === this.matrix[prevIndex].key) { // 判断两个的key是否一样，一样的话消掉
        this.setState({
          dismiss: true
        })
        createjs.Sound.play('bonus')
        createjs.Tween.get(this.matrix[index].ill).to({rotation: 180, x: centerX, y: centerY, scaleX: 0, scaleY: 0}, 80)
        createjs.Tween.get(this.matrix[prevIndex].ill).to({rotation: 180, x: prevCenterX, y: prevCenterY, scaleX: 0, scaleY: 0}, 80).call(function () {
          self.stage.removeChild(self.matrix[prevIndex].cover, self.matrix[prevIndex].ill, self.matrix[index].cover, self.matrix[index].ill)
          self.matrix[prevIndex] = self.matrix[index] = {cover: null, ill: null, key: ''}
          self.prevIndex = -1
          if (!self.gameOver) {
            self.score++
            self.leftText.set({ text: 'X ' + self.score })
            setTimeout(function () {
              self.setState({
                dismiss: false
              })
            }, 220)
            if (self.score % 10 === 0) {
              self.getIllList()
              self.getCoverList()
            }
          }
        })
      } else {
        createjs.Tween.get(this.matrix[prevIndex].ill).to({x: prevCenterX, scaleX: 0}, 80).call(function () {
          createjs.Tween.get(self.matrix[prevIndex].cover).to({x: prevX, scaleX: Number(self.scale)}, 80).call(function () {
            this.mouseEnabled = true
          })
        })
      }
    }
  }

  // 添加时钟等小图标、文字
  addIcon (left1, left2, top) {
    let leftText = new createjs.Text('X 0', 'bold 50px Arial', '#1eaee0')
    let dismissContainer = new createjs.Container()
    leftText.x = 90
    leftText.y = 16
    this.dismiss.set({scaleX: 1.5, scaleY: 1.5})
    dismissContainer.addChild(this.dismiss, leftText)
    dismissContainer.setTransform(left1, top, 0.8, 0.8)

    let second = this.time
    let rightText = new createjs.Text(second + '秒', 'bold 50px Arial', '#1eaee0')
    let clockContainer = new createjs.Container()
    rightText.x = 80
    rightText.y = 16
    this.clock.set({scaleX: 1.5, scaleY: 1.5})
    clockContainer.addChild(this.clock, rightText)
    clockContainer.setTransform(left2 - rightText.getBounds().width, top, 0.8, 0.8)

    // let bottomText = new createjs.Text('某公司', 'bold 30px Arial', '#5d7f89');
    // bottomText.x = (this.stage.canvas.width - bottomText.getBounds().width) / 2;
    // bottomText.y = this.stage.canvas.height - 45;

    this.stage.addChild(dismissContainer, clockContainer/*, bottomText */)
    this.stage.update()
    this.leftText = leftText
    this.rightText = rightText // 便于重新开始游戏。
    this.startGame()
  }

  // 开始游戏
  startGame () {
    this.gameOver = false
    let second = this.time
    let timer = setInterval(() => {
      this.rightText.set({text: second-- + '秒'})
      if (second === -1) {
        clearInterval(timer)
        this.gameOver = true
        this.setState({
          dialog: true
        })
      }
    }, 1000)
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
