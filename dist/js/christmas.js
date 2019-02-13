
let shareConfig = {
  title: '王阿姨你有一份礼物待领取！', // 分享标题
  desc: '请温柔的戳我一下', // 分享描述
  link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
  imgUrl: 'https://codeidot.com/images/christmas/gift.png', // 分享图标
  success: () => {}
}
let wxConfig = {
  debug: true,
  appId: '',
  timestamp: '',
  nonceStr: '',
  signature: '',
  jsApiList: [
    'checkJsApi',
    'updateAppMessageShareData',
    'updateTimelineShareData',
    'onMenuShareAppMessage',
    'onMenuShareTimeline'
  ]
}

function getWxConfig () {
  let xhr = new XMLHttpRequest()
  xhr.open('POST', 'http://118.24.116.182:3000/wechat/config')
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.responseType = 'json'
  xhr.send('url=' + encodeURIComponent(location.href))
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
      setWxShare(Object.assign(wxConfig, xhr.response))
    }
  }
}

function setWxShare (data) {
  wx.config(data);
  wx.ready(function(){
    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    wx.updateAppMessageShareData(shareConfig)
    wx.updateTimelineShareData(shareConfig)
    wx.onMenuShareAppMessage(shareConfig)
    wx.onMenuShareTimeline(shareConfig)
  })
}

getWxConfig()

window.onload = function () {
  document.forms[0].onsubmit = function (event) {
    event.preventDefault()
    let receiver = document.getElementById('receiver').value
    let mobile = document.getElementById('mobile').value
    let address = document.getElementById('address').value
    let params = 'receiver=' + encodeURIComponent(receiver) + '&mobile=' + encodeURIComponent(mobile) + '&address=' + encodeURIComponent(address)
    let xhr = new XMLHttpRequest()
    xhr.open('POST', 'http://118.24.116.182:3000/wechat/gift')
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(params)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          document.getElementById('dialog').style.display = 'block';
        }
      }
    }
  }
  document.getElementById('btn-close').onclick = function () {
    document.getElementById('dialog').style.display = 'none';
    document.getElementById('info-box').style.display = 'none';
  }
}
