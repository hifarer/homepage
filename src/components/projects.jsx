
import React from 'react'

export default () => {
  let data = [
    {
      title: 'Vueditor',
      desc: '采用Vue.js+Vuex开发的富文本编辑器, 实现了常见编辑器大部分功能, 体积小兼容性强, 使用部分ECMAScript6特性。',
      linkName: 'link',
      href: 'http://hifarer.github.io/vueditor/'
    },
    {
      title: 'Websocket',
      desc: '研究websocket原理, 运用websocket建立连接、打包解包数据、心跳检测等知识, 实现Node.js版本的websocket服务器。',
      linkName: 'link',
      href: 'https://github.com/hifarer/websocket'
    },
    {
      title: 'Node.js Blog',
      desc: '采用Node.js+Express+Mongodb+Vue.js全家桶开发，具有Server Side Render服务器渲染，按需加载等特点。',
      linkName: 'link',
      href: 'https://blog.codeidot.com'
    },
    {
      title: 'Mobile Site',
      desc: '移动端自适应页面集合，包括天气、日历等。',
      linkName: 'link',
      href: 'https://www.codeidot.com/weather'
    }
  ]
  return (
    <section id='projects'>
      <h3>我的项目</h3>
      {data.map(function (item, index) {
        return (
          <div className='project' key={index}>
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
            <a href={item.href} target='blank'>{item.linkName}</a>
          </div>
        )
      })}
    </section>
  )
}
