
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Profile from '../components/profile.jsx'
import Weather from '../components/weather.jsx'
import Projects from '../components/projects.jsx'
import Games from '../components/games.jsx'
import Clock from '../components/clock.jsx'
import Music from '../components/music.jsx'
import Article from '../components/article.jsx'

import '../style/homepage.less'

class App extends Component {
  constructor () {
    super()
    this.state = {
      width: document.documentElement.clientWidth
    }
  }
  render () {
    let width = this.state.width
    return (
      <div>
        <Profile />
        <div id='main'>
          <div className='column'>
            {width > 750 && <Weather />}
            <Projects />
            <Games />
          </div>
          <div className='column'>
            {width > 750 && <Clock />}
            {width > 750 && <Music />}
            <Article />
          </div>
        </div>
        <a href='https://github.com/hifarer' target='blank' className='github'>
          <img src={require('../images/github.png')} alt='Fork me on GitHub' />
        </a>
      </div>
    )
  }
  componentDidMount () {
    this.resize()
  }
  resize () {
    window.addEventListener('resize', () => {
      this.setState({
        width: document.documentElement.clientWidth
      })
    }, false)
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
