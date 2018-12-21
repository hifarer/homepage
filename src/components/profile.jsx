
import React from 'react'

export default () => {
  let data = {
    name: '蒋大山',
    origin: '桂林',
    residence: '老余杭',
    experience: '四年',
    email: 'hifarer#163.com',
    skills: [
      {name: 'ECMAScript6', percent: '85%'},
      {name: 'Typescript', percent: '80%'},
      {name: 'Vue.js|React.js', percent: '90%'},
      {name: 'HTML5+CSS3', percent: '80%'},
      {name: 'Node.js', percent: '75%'},
      {name: 'Webpack', percent: '90%'}
    ]
  }
  return (
    <div id='profile'>
      <div className='portrait'>
        <img src={require('../images/portrait.jpg')} title='这显然不是我的真容=_=！' />
      </div>
      <div className='info table'>
        <div className='cell'>
          <p>姓名</p>
          <p>籍贯</p>
          <p>现居</p>
          <p>经验</p>
          <p>邮箱</p>
        </div>
        <div className='cell'>
          <p>{data.name}</p>
          <p>{data.origin}</p>
          <p>{data.residence}</p>
          <p>{data.experience}</p>
          <p>{data.email}</p>
        </div>
      </div>
      <div className='skills'>
        <h3>技能</h3>
        {
          data.skills.map(function (item, index) {
            return (
              <div key={index}>
                <div className='wrap'>
                  <p className='skill-bar' style={{width: item.percent}} />
                </div>
                <p className='clear'><span className='fl'>{item.name}</span><span className='fr'>{item.percent}</span>
                </p>
              </div>
            )
          })
        }
      </div>
      <div className='resume'>
        <a href='assets/resume.pdf' download='蒋伟成-前端开发-简历'>点击下载我的简历</a>
      </div>
    </div>
  )
}
