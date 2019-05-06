
import React, { Component } from 'react'

export default class Article extends Component {
  constructor () {
    super()
    this.state = {
      list: []
    }
    this.fetchArticle()
  }

  render () {
    return (
      <div id='article'>
        <h3>我的博客</h3>
        {this.state.list.length > 0 ? this.state.list.map((item, index) => {
          return (
            <div key={index} onClick={() => this.linkTo(item)}>
              <h4><a href='javascript:;'>{item.title}</a></h4>
              <div className='info'>发布日期：{item.date} 阅读量：{item.view || 0}</div>
              <div className='abstract'>{item.abstract}</div>
            </div>
          )
        }) : (
          <div>
            <p>暂无内容</p>
          </div>
        )}
      </div>
    )
  }

  fetchArticle () {
    let xhr = new window.XMLHttpRequest()
    xhr.open('POST', window.location.protocol + '//hunter.im-flower.com/article/list')
    xhr.responseType = 'json'
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(null)
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          let { status, data } = xhr.response
          if (status) {
            this.setState({
              list: data.list
            })
          }
        }
      }
    }
  }

  linkTo (item) {
    window.open('https://blog.codeidot.com/article/' + item._id)
  }
}
