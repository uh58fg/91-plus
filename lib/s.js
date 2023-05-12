// ==UserScript==
// @name         my-91porn去广告+支持弹幕
// @version      0.1
// @description  91porn去广告+支持弹幕,自动生效！
// @author       Panda1337
// @match        */view_video.php?**
// @icon         https://www.google.com/s2/favicons?domain=workarea2.live
// @grant        none
// @namespace https://greasyfork.org/users/730524
// ==/UserScript==
let isClose = true
let videoWrapper = $('#player_one_html5_api')
const userWrapper = $('.title-yakov')
if (userWrapper && userWrapper.length === 2) {
  let href = userWrapper[1].firstElementChild.href
  let start = href.indexOf('UID')
  let uid = href.substring(start + 4)
  console.log('uid', uid)
  window.author = `https://91porn.com/uvideos.php?UID=${uid}&type=public`
}
window.title = '91'
if (!videoWrapper[0]) {
  document.title = '作为游客，你每天只可观看15个视频'
} else {
  let url = videoWrapper.find('source')[0].src
  let vid = $('#favorite #VID').text()
// $(document.body).html(`<div className="comments">${h}</div>`)
  window.title = document.title
  htmls = `<!DOCTYPE HTML>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="referrer" content="never">
  <style>
    .content {
      display: flex;
    }

    .left {
      width: 29%;
    }

    .right {
      width: 70%;
    }

    .comments {
    color: white;
      height: 100vh;
      overflow: auto;
    }

    .item {
      margin-bottom: 5px;
      padding: 10px;
      border-bottom: 1px solid darkgrey;
    }

    .quote {
      padding: 10px;
      padding-left: 0;
      margin-bottom: 10px;
    }

    .replay {
    }

    .ml20 {
      margin-left: 20px;
    }
  </style>
</head>
<body style="background: rgb(32,33,36);">
<meta name="referrer" content="never">
<script crossorigin="anonymous" integrity="sha384-NowxCVrymxfs88Gx+ygXX3HCvpP7JE1nsDUuIshgWg2gO2eFCaePIdAuOfnG6ZjM" src="https://lib.baomitu.com/hls.js/8.0.0-beta.3/hls.min.js"></script>
<!--<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>-->
<link rel="stylesheet" href="DPlayer.min.css"/>
<h2 style="color: gray;">${document.title}</h2>
<div style="display: flex">
<h2 style="color: gray;" id="m3u8_url">${url}</h2>
<a href="${window.author}" target="_blank">作者主页</a>
</div>
<div class="content">
  <div class="left">
        <div class="comments"></div>
  </div>
  <div class="right">
      <div id="dplayer" class="dplayer" style="height: 70vh;"></div>
    </div>
</div>
<script crossorigin="anonymous" integrity="sha512-1t2U1/0xGhBZAriD+/9llOhjPs5nFBDZ7KbnHB4SGwAUPrzyS+02Kus1cz0exk5eMyXxwfHxj/1JLuie/p6xXA==" src="https://lib.baomitu.com/dplayer/1.26.0/DPlayer.min.js"></script>
</body>
<script>
  let dp = new DPlayer({
    container: document.getElementById('dplayer'),
    autoplay: false,
    video: {
      url: '${url}',
    },
  });
  dp.seek(10);
</script>
</html>
`
// console.log('url-------', url)
// console.log('title--------', title)
// htmls = htmls.replace("urlhere", url).replace("urlhere", url).replace("titlehere", document.title)
  document.write(htmls)

  $.ajax({
    url: `https://91porn.com/show_comments2.php?VID=${vid}&start=1&comment_per_page=30`,
    success(r) {
      let start = r.indexOf('<script')
      let end = r.indexOf('<\/script>')
      console.log(start)
      console.log(end)
      let sss = r.slice(start, end + 9)
      r = r.replace(sss, '')
      start = r.indexOf('<script')
      end = r.indexOf('<\/script>')
      // console.log(start)
      // console.log(end)
      sss = r.slice(start, end + 9)
      r = r.replace(sss, '')
      let h = ''
      $(r).each(function (i) {
        let name = $(this).find('a:first').remove().text().trim()
        let body = $(this).find('.comment-body')
        let quote = body.find('.comment_quote').text().replaceAll(' ', '').replaceAll('\n', '')
        body.find('.comment_quote').remove()
        let replay = body.find('a').remove().end().text().trim()
        let item = ''
        if (!quote && !replay) {
          return
        }
        if (quote) {
          quote = quote.replace(':', '：')
          item = `
        <div class="item">
          <div class="quote">
            ${quote}
          </div>
          <div class="replay ml20">
            ${name}： ${replay}
          </div>
        </div>`
          console.log(quote, name + '回复：', replay)
        } else {
          item = `
        <div class="item">
          <div class="replay">
            ${name}： ${replay}
          </div>
        </div>`
          console.log(name + '：' + replay)
        }
        h += item
      })
      $('.comments').html(h)
    }
  })


  let htmlVue = `<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="keywords" content="m3u8 downloader for web">
  <meta name="description" content="m3u8 downloader for web, Momo's Blog, LuckyMomo">
  <title>m3u8 downloader</title>
  <style>
  /*全局设置*/
  html, body {
    margin: 0;
    padding: 0;
  }
  body::-webkit-scrollbar { display: none}
  p {
    margin: 0;
  }
  [v-cloak] {
    display: none;
  }
  #m-app {
    height: 100%;
    width: 100%;
    text-align: center;
    padding: 10px 50px 80px;
    box-sizing: border-box;
  }
  .m-p-action {
    margin: 20px auto;
    max-width: 1100px;
    width: 100%;
    font-size: 35px;
    text-align: center;
    font-weight: bold;
  }
  .m-p-other, .m-p-tamper, .m-p-github, .m-p-language {
    position: fixed;
    right: 50px;
    background-color: #eff3f6;
    background-image: linear-gradient(-180deg, #fafbfc, #eff3f6 90%);
    color: #24292e;
    border: 1px solid rgba(27, 31, 35, .2);
    border-radius: 3px;
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    padding: 6px 12px;
    z-index: 99;
  }
  .m-p-help {
    position: fixed;
    right: 50px;
    top: 50px;
    width: 30px;
    height: 30px;
    color: #666666;
    z-index: 2;
    line-height: 30px;
    font-weight: bolder;
    border-radius: 50%;
    border: 1px solid rgba(27, 31, 35, .2);
    cursor: pointer;
    background-color: #eff3f6;
    background-image: linear-gradient(-180deg, #fafbfc, #eff3f6 90%);
  }
  .m-p-github:hover, .m-p-other:hover, .m-p-tamper:hover, .m-p-help:hover, .m-p-language:hover {
    opacity: 0.9;
  }
  .m-p-language {
    bottom: 70px;
  }
  .m-p-other {
    bottom: 110px;
  }
  .m-p-tamper {
    bottom: 30px;
  }
  .m-p-github {
    bottom: 150px;
  }
  /*广告*/
  .m-p-refer {
    position: absolute;
    left: 50px;
    bottom: 50px;
  }
  .m-p-refer .text {
    position: absolute;
    top: -80px;
    left: -40px;
    animation-name: upAnimation;
    transform-origin: center bottom;
    animation-duration: 2s;
    animation-fill-mode: both;
    animation-iteration-count: infinite;
    animation-delay: .5s;
  }
  .m-p-refer .close {
    display: block;
    position: absolute;
    top: -110px;
    right: -50px;
    padding: 0;
    margin: 0;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    z-index: 3;
    transition: 0.3s all;
    background-size: 30px 30px;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url(https://blog.luckly-mjw.cn/tool-show/m3u8-downloader/imgs/close.png);
    background-color: rgba(0, 0, 0, 0.5);
  }
  .m-p-refer .close:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
  .m-p-refer .link {
    border-radius: 4px;
    text-decoration: none;
    background-color: #4E84E6;
    transition: 0.3s all;
  }
  .m-p-refer .link:hover {
    top: -10px;
    color: #333333;
    border: 1px solid transparent;
    background: rgba(0, 0, 0, 0.6);
    box-shadow: 2px 11px 20px 0 rgba(0, 0, 0, 0.6);
  }
  @keyframes upAnimation {
    0% {
      transform: rotate(0deg);
      transition-timing-function: cubic-bezier(0.215, .61, .355, 1)
    }

    10% {
      transform: rotate(-12deg);
      transition-timing-function: cubic-bezier(0.215, .61, .355, 1)
    }

    20% {
      transform: rotate(12deg);
      transition-timing-function: cubic-bezier(0.215, .61, .355, 1)
    }

    28% {
      transform: rotate(-10deg);
      transition-timing-function: cubic-bezier(0.215, .61, .355, 1)
    }

    36% {
      transform: rotate(10deg);
      transition-timing-function: cubic-bezier(0.755, .5, .855, .06)
    }

    42% {
      transform: rotate(-8deg);
      transition-timing-function: cubic-bezier(0.755, .5, .855, .06)
    }

    48% {
      transform: rotate(8deg);
      transition-timing-function: cubic-bezier(0.755, .5, .855, .06)
    }

    52% {
      transform: rotate(-4deg);
      transition-timing-function: cubic-bezier(0.755, .5, .855, .06)
    }

    56% {
      transform: rotate(4deg);
      transition-timing-function: cubic-bezier(0.755, .5, .855, .06)
    }

    60% {
      transform: rotate(0deg);
      transition-timing-function: cubic-bezier(0.755, .5, .855, .06)
    }

    100% {
      transform: rotate(0deg);
      transition-timing-function: cubic-bezier(0.215, .61, .355, 1)
    }
  }
  /*顶部信息录入*/
  .m-p-temp-url {
    padding-top: 50px;
    padding-bottom: 10px;
    width: 100%;
    color: #999999;
    text-align: left;
    font-style: italic;
    word-break: break-all;
  }
  .m-p-input-container {
    display: flex;
  }
  .m-p-input-container input {
    flex: 1;
    margin-bottom: 30px;
    display: block;
    width: 280px;
    padding: 16px;
    font-size: 24px;
    border-radius: 4px;
    box-shadow: none;
    color: #444444;
    border: 1px solid #cccccc;
  }
  .m-p-input-container .range-input {
    margin-left: 10px;
    flex: 0 0 100px;
    width: 100px;
    box-sizing: border-box;
  }
  .m-p-input-container div {
    position: relative;
    display: inline-block;
    margin-left: 10px;
    height: 60px;
    line-height: 60px;
    font-size: 24px;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid #eeeeee;
    background-color: #3D8AC7;
    opacity: 1;
    transition: 0.3s all;
  }
  .m-p-input-container div:hover {
    opacity: 0.9;
  }
  .m-p-input-container div {
    width: 200px;
  }
  .m-p-input-container .disable {
    cursor: not-allowed;
    background-color: #dddddd;
  }
  /*下载状态*/
  .m-p-line {
    margin: 20px 0 50px;
    vertical-align: top;
    width: 100%;
    height: 5px;
    border-bottom: dotted;
  }
  .m-p-tips {
    width: 100%;
    color: #999999;
    text-align: left;
    font-style: italic;
    word-break: break-all;
  }
  .m-p-tips p {
    width: 100px;
    display: inline-block;
  }
  .m-p-segment {
    text-align: left;
  }
  .m-p-segment .item {
    display: inline-block;
    margin: 10px 6px;
    width: 50px;
    height: 40px;
    color: white;
    line-height: 40px;
    text-align: center;
    border-radius: 4px;
    cursor: help;
    border: solid 1px #eeeeee;
    background-color: #dddddd;
  }
  .m-p-segment .finish {
    background-color: #0ACD76;
  }
  .m-p-segment .error {
    cursor: pointer;
    background-color: #DC5350;
  }
  .m-p-cross, .m-p-final {
    display: inline-block;
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 20px;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid #eeeeee;
    background-color: #3D8AC7;
    opacity: 1;
    transition: 0.3s all;
  }
  .m-p-final {
    margin-top: 10px;
    text-decoration: none;
  }
  .m-p-force, .m-p-retry {
    position: absolute;
    right: 50px;
    display: inline-block;
    padding: 6px 12px;
    font-size: 18px;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid #eeeeee;
    background-color: #3D8AC7;
    opacity: 1;
    transition: 0.3s all;
  }
  .m-p-retry {
    right: 250px;
  }
  .m-p-force:hover, .m-p-retry:hover {
    opacity: 0.9;
  }

  </style>
</head>

<body>
 <meta name="referrer" content="never" >
<div id="loading">页面加载中，请耐心等待...</div>

<section id="m-app" v-cloak>
   <!-- <link rel="stylesheet" href="DPlayer.min.css" /> -->
  <!--文件载入-->
  <section class="m-p-input-container">
    <input type="text" v-model="url" :disabled="downloading" placeholder="请输入 m3u8 链接">

    <!--范围查询-->
    <template v-if="!downloading || rangeDownload.isShowRange">
      <div v-if="!rangeDownload.isShowRange" @click="getM3U8(true)">特定范围下载</div>
      <template v-else>
        <input class="range-input" type="number" v-model="rangeDownload.startSegment" :disabled="downloading" placeholder="起始片段">
        <input class="range-input" type="number" v-model="rangeDownload.endSegment" :disabled="downloading" placeholder="截止片段">
      </template>
    </template>

    <!--还未开始下载-->
    <template v-if="!downloading">
      <div @click="getM3U8(false)">原格式下载</div>
      <div @click="getMP4">转码为MP4下载</div>
    </template>
    <div v-else-if="finishNum === rangeDownload.targetSegment && rangeDownload.targetSegment > 0" class="disable">下载完成</div>
    <div v-else @click="togglePause">{{ isPause ? '恢复下载' : '暂停下载' }}</div>
  </section>

  <template v-if="finishList.length > 0">
    <div class="m-p-line"></div>
    <div class="m-p-retry" v-if="errorNum && downloadIndex >= rangeDownload.targetSegment" @click="retryAll">重新下载错误片段</div>
    <div class="m-p-force" v-if="mediaFileList.length" @click="forceDownload">强制下载现有片段</div>
    <div class="m-p-tips">待下载碎片总量：{{ rangeDownload.targetSegment }}，已下载：{{ finishNum }}，错误：{{ errorNum }}，进度：{{ (finishNum / rangeDownload.targetSegment * 100).toFixed(2) }}%</div>
    <div class="m-p-tips">若某视频碎片下载发生错误，将标记为红色，可点击相应图标进行重试</div>
    <section class="m-p-segment">
      <div class="item" v-for="(item, index) in finishList" :class="[item.status]" :title="item.title" @click="retry(index)">{{ index + 1 }}</div>
    </section>
  </template>
</section>
</body>

`

  let $section = document.createElement('section')
  $section.innerHTML = htmlVue
  $section.style.width = '100%'
  $section.style.height = '800px'
  $section.style.top = '0'
  $section.style.left = '0'
  $section.style.position = 'relative'
  $section.style.zIndex = '9999'
  $section.style.backgroundColor = 'white'

  setTimeout(() => {
    let dplayer = $('#dplayer')
    dplayer.after($($section))
    // console.log(dplayer)
    // document.body.appendChild($section);

// 加载 ASE 解密
    let $ase = document.createElement('script')
    $ase.src = 'https://blog.luckly-mjw.cn/tool-show/m3u8-downloader/aes-decryptor.js'

// 加载 mp4 转码
    let $mp4 = document.createElement('script')
    $mp4.src = 'https://blog.luckly-mjw.cn/tool-show/m3u8-downloader/mux-mp4.js'

// 加载 vue
    let $vue = document.createElement('script')
    $vue.src = 'https://blog.luckly-mjw.cn/tool-show/m3u8-downloader/vue.js'

// 监听 vue 加载完成，执行业务代码
    $vue.addEventListener('load', () => {
      new Vue({
        el: '#m-app',

        data() {
          return {
            url: '', // 在线链接
            tips: 'm3u8 视频在线提取工具', // 顶部提示
            isPause: false, // 是否暂停下载
            isGetMP4: false, // 是否转码为 MP4 下载
            durationSecond: 0, // 视频持续时长
            isShowRefer: true, // 是否显示推送
            downloading: false, // 是否下载中
            beginTime: '', // 开始下载的时间
            errorNum: 0, // 错误数
            finishNum: 0, // 已下载数
            downloadIndex: 0, // 当前下载片段
            finishList: [], // 下载完成项目
            tsUrlList: [], // ts URL数组
            mediaFileList: [], // 下载的媒体数组
            rangeDownload: { // 特定范围下载
              isShowRange: false, // 是否显示范围下载
              startSegment: '', // 起始片段
              endSegment: '', // 截止片段
              targetSegment: 1, // 待下载片段
            }, aesConf: { // AES 视频解密配置
              method: '', // 加密算法
              uri: '', // key 所在文件路径
              iv: '', // 偏移值
              key: '', // 秘钥
              decryptor: null, // 解码器对象

              stringToBuffer: function (str) {
                return new TextEncoder().encode(str)
              },
            },
          }
        },
        created() {
          this.getSource();
          document.getElementById('loading') && document.getElementById('loading').remove()
          window.addEventListener('keyup', this.onKeyup)
          setTimeout(() => {
            this.getMP4()
          }, 5000)
        },
        beforeDestroy() {
          window.removeEventListener('keyup', this.onKeyup)
        },
        methods: {
          // 获取链接中携带的资源链接
          getSource() {
            let {href} = location
            if (href.indexOf('?source=') > -1) {
              this.url = href.split('?source=')[1]
            }
          },

          // 退出弹窗
          onKeyup(event) {
            if (event.keyCode === 13) { // 键入ESC
              this.getM3U8()
            }
          },

          // ajax 请求
          ajax(options) {
            options = options || {};
            let xhr = new XMLHttpRequest();
            if (options.type === 'file') {
              xhr.responseType = 'arraybuffer';
            }

            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                let status = xhr.status;
                if (status >= 200 && status < 300) {
                  options.success && options.success(xhr.response);
                } else {
                  options.fail && options.fail(status);
                }
              }
            };

            xhr.open("GET", options.url, true);
            xhr.send(null);
          },

          // 合成URL
          applyURL(targetURL, baseURL) {
            baseURL = baseURL || location.href
            if (targetURL.indexOf('http') === 0) {
              return targetURL
            } else if (targetURL[0] === '/') {
              let domain = baseURL.split('/')
              return domain[0] + '//' + domain[2] + targetURL
            } else {
              let domain = baseURL.split('/')
              domain.pop()
              return domain.join('/') + '/' + targetURL
            }
          },

          // 解析为 mp4 下载
          getMP4() {
            this.url = $('#m3u8_url').text()
            this.isGetMP4 = true
            this.getM3U8()
          },

          // 获取在线文件
          getM3U8(onlyGetRange) {
            if (!this.url) {
              alert('请输入链接')
              return
            }
            if (this.url.toLowerCase().indexOf('.m3u8') === -1) {
              alert('链接有误，请重新输入')
              return
            }
            if (this.downloading) {
              alert('资源下载中，请稍后')
              return
            }

            // 在下载页面才触发，代码注入的页面不需要校验
            // 当前协议不一致，切换协议
            if (location.href.indexOf('blog.luckly-mjw.cn') > -1 && this.url.indexOf(location.protocol) === -1) {
              //alert('当前协议不一致，跳转至正确页面重新下载')
              location.href = `${this.url.split(':')[0]}://blog.luckly-mjw.cn/tool-show/m3u8-downloader/index.html?source=${this.url}`
              return
            }

            // 在下载页面才触发，修改页面 URL，携带下载路径，避免刷新后丢失
            if (location.href.indexOf('blog.luckly-mjw.cn') > -1) {
              window.history.replaceState(null, '', `${location.href.split('?')[0]}?source=${this.url}`)
            }

            this.tips = 'm3u8 文件下载中，请稍后'
            this.beginTime = new Date()
            this.ajax({
              url: this.url,
              success: (m3u8Str) => {
                this.tsUrlList = []
                this.finishList = []

                // 提取 ts 视频片段地址
                m3u8Str.split('\n').forEach((item) => {
                  if (item.toLowerCase().indexOf('.ts') > -1 || item.toLowerCase().indexOf('.image') > -1) {
                    this.tsUrlList.push(this.applyURL(item, this.url))
                    this.finishList.push({
                      title: item, status: ''
                    })
                  }
                })

                // 仅获取视频片段数
                if (onlyGetRange) {
                  this.rangeDownload.isShowRange = true
                  this.rangeDownload.endSegment = this.tsUrlList.length
                  this.rangeDownload.targetSegment = this.tsUrlList.length
                  return
                } else {
                  let startSegment = Math.max(this.rangeDownload.startSegment || 1, 1) // 最小为 1
                  let endSegment = Math.max(this.rangeDownload.endSegment || this.tsUrlList.length, 1)
                  startSegment = Math.min(startSegment, this.tsUrlList.length) // 最大为 this.tsUrlList.length
                  endSegment = Math.min(endSegment, this.tsUrlList.length)
                  this.rangeDownload.startSegment = Math.min(startSegment, endSegment)
                  this.rangeDownload.endSegment = Math.max(startSegment, endSegment)
                  this.rangeDownload.targetSegment = this.rangeDownload.endSegment - this.rangeDownload.startSegment + 1
                  this.downloadIndex = this.rangeDownload.startSegment - 1
                  this.downloading = true
                }

                // 获取需要下载的 MP4 视频长度
                if (this.isGetMP4) {
                  let infoIndex = 0
                  m3u8Str.split('\n').forEach(item => {
                    if (item.toUpperCase().indexOf('#EXTINF:') > -1) { // 计算视频总时长，设置 mp4 信息时使用
                      infoIndex++
                      if (this.rangeDownload.startSegment <= infoIndex && infoIndex <= this.rangeDownload.endSegment) {
                        this.durationSecond += parseFloat(item.split('#EXTINF:')[1])
                      }
                    }
                  })
                }

                console.log('this.durationSecond', this.durationSecond)


                // 检测视频 AES 加密
                if (m3u8Str.indexOf('#EXT-X-KEY') > -1) {
                  this.aesConf.method = (m3u8Str.match(/(.*METHOD=([^,\s]+))/) || ['', '', ''])[2]
                  this.aesConf.uri = (m3u8Str.match(/(.*URI="([^"]+))"/) || ['', '', ''])[2]
                  this.aesConf.iv = (m3u8Str.match(/(.*IV=([^,\s]+))/) || ['', '', ''])[2]
                  this.aesConf.iv = this.aesConf.iv ? this.aesConf.stringToBuffer(this.aesConf.iv) : ''
                  this.aesConf.uri = this.applyURL(this.aesConf.uri, this.url)

                  // let params = m3u8Str.match(/#EXT-X-KEY:([^,]*,?METHOD=([^,]+))?([^,]*,?URI="([^,]+)")?([^,]*,?IV=([^,^\n]+))?/)
                  // this.aesConf.method = params[2]
                  // this.aesConf.uri = this.applyURL(params[4], this.url)
                  // this.aesConf.iv = params[6] ? this.aesConf.stringToBuffer(params[6]) : ''
                  this.getAES();
                } else if (this.tsUrlList.length > 0) { // 如果视频没加密，则直接下载片段，否则先下载秘钥
                  this.downloadTS()
                } else {
                  this.alertError('资源为空，请查看链接是否有效')
                }
              }, fail: () => {
                this.alertError('链接不正确，请查看链接是否有效')
              }
            })
          },

          // 获取AES配置
          getAES() {
            alert('视频被 AES 加密，点击确认，进行视频解码')
            this.ajax({
              type: 'file', url: this.aesConf.uri, success: (key) => {
                // console.log('getAES', key)
                // this.aesConf.key = this.aesConf.stringToBuffer(key)
                this.aesConf.key = key
                this.aesConf.decryptor = new AESDecryptor()
                this.aesConf.decryptor.constructor()
                this.aesConf.decryptor.expandKey(this.aesConf.key);
                this.downloadTS()
              }, fail: () => {
                this.alertError('视频已进行定制化加密，不提供定制化解密下载')
              }
            })
          },

          // ts 片段的 AES 解码
          aesDecrypt(data, index) {
            let iv = this.aesConf.iv || new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, index])
            return this.aesConf.decryptor.decrypt(data, 0, iv.buffer || iv, true)
          },

          // 下载分片
          downloadTS() {
            this.tips = 'ts 视频碎片下载中，请稍后'
            let download = () => {
              let isPause = this.isPause // 使用另一个变量来保持下载前的暂停状态，避免回调后没修改
              let index = this.downloadIndex
              this.downloadIndex++
              if (this.finishList[index] && this.finishList[index].status === '') {
                this.ajax({
                  url: this.tsUrlList[index], type: 'file', success: (file) => {
                    this.dealTS(file, index, () => this.downloadIndex < this.rangeDownload.endSegment && !isPause && download())
                  }, fail: () => {
                    this.errorNum++
                    this.finishList[index].status = 'error'
                    if (this.downloadIndex < this.rangeDownload.endSegment) {
                      !isPause && download()
                    }
                  }
                })
              } else if (this.downloadIndex < this.rangeDownload.endSegment) { // 跳过已经成功的片段
                !isPause && download()
              }
            }

            // 建立多少个 ajax 线程
            for (let i = 0; i < Math.min(10, this.rangeDownload.targetSegment - this.finishNum); i++) {
              download(i)
            }
          },

          // 处理 ts 片段，AES 解密、mp4 转码
          dealTS(file, index, callback) {
            const data = this.aesConf.uri ? this.aesDecrypt(file, index) : file
            this.conversionMp4(data, index, (afterData) => { // mp4 转码
              this.mediaFileList[index - this.rangeDownload.startSegment + 1] = afterData // 判断文件是否需要解密
              this.finishList[index].status = 'finish'
              this.finishNum++
              if (this.finishNum === this.rangeDownload.targetSegment) {
                this.downloadFile(this.mediaFileList, this.formatTime(this.beginTime, 'YYYY_MM_DD hh_mm_ss'))
              }
              callback && callback()
            })
          },

          // 转码为 mp4
          conversionMp4(data, index, callback) {
            if (this.isGetMP4) {
              let transmuxer = new muxjs.Transmuxer({
                keepOriginalTimestamps: true, duration: parseInt(this.durationSecond),
              });
              transmuxer.on('data', segment => {
                if (index === this.rangeDownload.startSegment - 1) {
                  let data = new Uint8Array(segment.initSegment.byteLength + segment.data.byteLength);
                  data.set(segment.initSegment, 0);
                  data.set(segment.data, segment.initSegment.byteLength);
                  callback(data.buffer)
                } else {
                  callback(segment.data)
                }
              })
              transmuxer.push(new Uint8Array(data));
              transmuxer.flush();
            } else {
              callback(data)
            }
          },

          // 暂停与恢复
          togglePause() {
            this.isPause = !this.isPause
            !this.isPause && this.retryAll()
          },

          // 重新下载某个片段
          retry(index) {
            if (this.finishList[index].status === 'error') {
              this.finishList[index].status = ''
              this.ajax({
                url: this.tsUrlList[index], type: 'file', success: (file) => {
                  this.errorNum--
                  this.dealTS(file, index)
                }, fail: () => {
                  this.finishList[index].status = 'error'
                }
              })
            }
          },

          // 重新下载所有错误片段
          retryAll() {
            this.finishList.forEach((item) => { // 重置所有片段状态
              if (item.status === 'error') {
                item.status = ''
              }
            })
            this.errorNum = 0
            this.downloadIndex = this.rangeDownload.startSegment - 1
            this.downloadTS()
          },

          // 下载整合后的TS文件
          downloadFile(fileDataList, fileName) {
            this.tips = 'ts 碎片整合中，请留意浏览器下载'
            let fileBlob = null
            let a = document.createElement('a')
            fileName = window.title
            fileName = fileName.replace('Chinese homemade video', '')
            if (this.isGetMP4) {
              fileBlob = new Blob(fileDataList, {type: 'video/mp4'}) // 创建一个Blob对象，并设置文件的 MIME 类型
              a.download = fileName + '.mp4'
            } else {
              fileBlob = new Blob(fileDataList, {type: 'video/MP2T'}) // 创建一个Blob对象，并设置文件的 MIME 类型
              a.download = fileName + '.ts'
            }
            a.href = URL.createObjectURL(fileBlob)
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            a.remove()
            setTimeout(() => {
              document.title = "下载完成"

            }, 1000)
          },

          // 格式化时间
          formatTime(date, formatStr) {
            const formatType = {
              Y: date.getFullYear(),
              M: date.getMonth() + 1,
              D: date.getDate(),
              h: date.getHours(),
              m: date.getMinutes(),
              s: date.getSeconds(),
            }
            return formatStr.replace(/Y+|M+|D+|h+|m+|s+/g, target => (new Array(target.length).join('0') + formatType[target[0]]).substr(-target.length))
          },

          // 强制下载现有片段
          forceDownload() {
            if (this.mediaFileList.length) {
              this.downloadFile(this.mediaFileList, this.formatTime(this.beginTime, 'YYYY_MM_DD hh_mm_ss'))
            } else {
              alert('当前无已下载片段')
            }
          },

          // 发生错误，进行提示
          alertError(tips) {
            alert(tips)
            this.downloading = false
            this.tips = 'm3u8 视频在线提取工具';
          },

          // 拷贝剪切板
          copyToClipboard(content) {
            clearTimeout(this.timeouter)

            if (!document.queryCommandSupported('copy')) {
              return false
            }

            let $input = document.createElement('textarea')
            $input.style.opacity = '0'
            $input.value = content
            document.body.appendChild($input)
            $input.select()

            const result = document.execCommand('copy')
            document.body.removeChild($input)
            $input = null

            return result
          },
        }
      })
    })
    document.body.appendChild($vue);
    document.body.appendChild($mp4);
    document.body.appendChild($ase);

  }, 100)


}