<template>
  <section id="app">
    <div class="info">
      <div class="progress" @click="show = !show">
        <div class="bar" :style="{width:  progress + '%'}"></div>
      </div>
      <div class="options">
        <div class="option">
          <label for="a1">自动下载</label>
          <input id="a1" type="checkbox" v-model="conf.autoDownload">
        </div>
        <div class="option">
          <label for="a2">自动保存</label>
          <input id="a2" type="checkbox" v-model="conf.autoSave">
        </div>
        <div class="option">
          <label for="a3">下载完自动关闭</label>
          <input id="a3" type="checkbox" v-model="conf.autoClose">
        </div>
      </div>
    </div>

    <div class="row2" v-if="!show">
      <div class="big-btn"
           v-if="finishNum === rangeDownload.targetSegment
         && rangeDownload.targetSegment > 0
         && !conf.autoSave"
           @click="forceDownload">
        <span>保存</span>
      </div>
      <div class="big-btn" @click="show = !show">
        <span>{{ !show ? '展开' : '收起' }}下载详情</span>
      </div>
    </div>


    <div class="wrapper" v-show="show">
      <section class="m-p-input-container">
        <input type="text" :value="url" :disabled="true" placeholder="请输入 m3u8 链接">
        <!--还未开始下载-->
        <template v-if="!downloading">
          <div class="big-btn" @click="getMP4">下载</div>
        </template>
        <div v-else-if="finishNum === rangeDownload.targetSegment && rangeDownload.targetSegment > 0"
             class="disable big-btn">
          下载完成
        </div>
        <div class="big-btn" v-else @click="togglePause">{{ isPause ? '恢复下载' : '暂停下载' }}</div>

        <div class="big-btn" v-if="finishNum === rangeDownload.targetSegment
         && rangeDownload.targetSegment > 0
         && !conf.autoSave"
             @click="forceDownload">
          <span>保存</span>
        </div>

        <div class="big-btn detail" @click="show = !show">
          <span>{{ !show ? '展开' : '收起' }}下载详情</span>
        </div>
      </section>
      <template v-if="finishList.length > 0">
        <div class="error-btns">
          <div class="m-p-retry" v-if="errorNum && downloadIndex >= rangeDownload.targetSegment" @click="retryAll">
            重新下载错误片段
          </div>
          <div class="m-p-force" v-if="mediaFileList.length && !streamWriter" @click="forceDownload">强制下载现有片段
          </div>
          <!--        <div class="m-p-retry" @click="retryAll">重新下载错误片段</div>-->
          <!--        <div class="m-p-force" @click="forceDownload">强制下载现有片段</div>-->
        </div>
        <div class="m-p-tips">待下载碎片总量：{{ rangeDownload.targetSegment }}，已下载：{{ finishNum }}，错误：{{
            errorNum
          }}，进度：{{ progress }}%
        </div>
        <div class="m-p-tips" :class="[errorNum ? 'error-tips' : '']">
          若某视频碎片下载发生错误，将标记为红色，可点击相应图标进行重试
        </div>
        <section class="m-p-segment">
          <div class="item" v-for="(item, index) in finishList" :class="[item.status]" :title="item.title"
               @click="retry(index)">{{ index + 1 }}
          </div>
        </section>
      </template>
    </div>
  </section>
</template>

<script>
import {monkeyWindow} from "$";

export default {
  name: "downloader",
  props: {
    url: '',
    title: '',
  },
  data() {
    return {
      conf: {
        autoDownload: false,
        autoClose: false,
        autoSave: false,
      },
      show: false,
      tips: 'm3u8 视频在线提取工具', // 顶部提示
      isPause: false, // 是否暂停下载
      isGetMP4: false, // 是否转码为 MP4 下载
      durationSecond: 0, // 视频持续时长
      isShowRefer: false, // 是否显示推送
      downloading: false, // 是否下载中
      beginTime: '', // 开始下载的时间
      errorNum: 0, // 错误数
      finishNum: 0, // 已下载数
      downloadIndex: 0, // 当前下载片段
      finishList: [], // 下载完成项目
      tsUrlList: [], // ts URL数组
      mediaFileList: [], // 下载的媒体数组
      isSupperStreamWrite: monkeyWindow.streamSaver && !monkeyWindow.streamSaver.useBlobFallback, // 当前浏览器是否支持流式下载
      streamWriter: null, // 文件流写入器
      streamDownloadIndex: 0, // 文件流写入器，正准备写入第几个视频片段
      rangeDownload: { // 特定范围下载
        isShowRange: false, // 是否显示范围下载
        startSegment: '', // 起始片段
        endSegment: '', // 截止片段
        targetSegment: 1, // 待下载片段
      },
      aesConf: { // AES 视频解密配置
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
  computed: {
    progress() {
      return (this.finishNum / this.rangeDownload.targetSegment * 100).toFixed(2)
    }
  },
  watch: {
    conf: {
      handler(n, o) {
        localStorage.setItem('porn-plus', JSON.stringify(n))
      },
      deep: true
    },
    progress(n, o) {
      document.title = Number(n).toFixed(0) + '% ' + this.title
    }
  },
  created() {
    this.getConf()
    if (this.conf.autoDownload) {
      this.getMP4()
    }
    setInterval(this.retryAll.bind(this), 2000) // 每两秒重新下载一遍错误片段，实现错误自动重试
  },
  methods: {
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
        // 当前页面使用 https 协议时，强制使 ts 资源也使用 https 协议获取
        if (location.href.indexOf('https') === 0) {
          return targetURL.replace('http://', 'https://')
        }
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
    // 使用流式下载，边下载边保存，解决大视频文件内存不足的难题
    streamDownload(isMp4) {
      this.isGetMP4 = isMp4
      // this.title = new URL(this.url).searchParams.get('title') || this.title // 获取视频标题
      let fileName = this.title || this.formatTime(new Date(), 'YYYY_MM_DD hh_mm_ss')
      this.streamWriter = monkeyWindow.streamSaver.createWriteStream(`${fileName}.${isMp4 ? 'mp4' : 'ts'}`).getWriter()
      this.getM3U8()
    },
    // 解析为 mp4 下载
    getMP4() {
      this.isGetMP4 = true
      this.getM3U8()
    },
    // 获取在线文件
    getM3U8(onlyGetRange) {
      if (!this.url) {
        alert('请输入链接')
        return
      }
      if (this.url.toLowerCase().indexOf('m3u8') === -1) {
        alert('链接有误，请重新输入')
        return
      }
      if (this.downloading) {
        alert('资源下载中，请稍后')
        return
      }

      // this.title = new URL(this.url).searchParams.get('title') || this.title // 获取视频标题
      this.tips = 'm3u8 文件下载中，请稍后'
      this.beginTime = new Date()
      this.ajax({
        url: this.url,
        success: (m3u8Str) => {
          this.tsUrlList = []
          this.finishList = []

          // 提取 ts 视频片段地址
          m3u8Str.split('\n').forEach((item) => {
            // if (/.(png|image|ts|jpg|mp4|jpeg)/.test(item)) {
            // 放开片段后缀限制，下载非 # 开头的链接片段
            //                  if (item.toLowerCase().indexOf('.ts') > -1 || item.toLowerCase().indexOf('.image') > -1) {

            if (/^[^#]/.test(item)) {
              // console.log(item)
              this.tsUrlList.push(this.applyURL(item, this.url))
              this.finishList.push({
                title: item,
                status: ''
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
        },
        fail: () => {
          this.alertError('链接不正确，请查看链接是否有效')
        }
      })
    },
    // 获取AES配置
    getAES() {
      // alert('视频被 AES 加密，点击确认，进行视频解码')
      this.ajax({
        type: 'file',
        url: this.aesConf.uri,
        success: (key) => {
          // console.log('getAES', key)
          // this.aesConf.key = this.aesConf.stringToBuffer(key)
          this.aesConf.key = key
          this.aesConf.decryptor = new monkeyWindow.AES.AESDecryptor()
          this.aesConf.decryptor.constructor()
          this.aesConf.decryptor.expandKey(this.aesConf.key);
          this.downloadTS()
        },
        fail: () => {
          this.alertError('视频已加密，可试用右下角入口的「无差别提取工具」')
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
        if (index >= this.rangeDownload.endSegment) {
          return
        }
        this.downloadIndex++
        if (this.finishList[index] && this.finishList[index].status === '') {
          this.finishList[index].status = 'downloading'
          this.ajax({
            url: this.tsUrlList[index],
            type: 'file',
            success: (file) => {
              this.dealTS(file, index, () => this.downloadIndex < this.rangeDownload.endSegment && !isPause && download())
            },
            fail: () => {
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
      for (let i = 0; i < Math.min(6, this.rangeDownload.targetSegment - this.finishNum); i++) {
        download()
      }
    },
    // 处理 ts 片段，AES 解密、mp4 转码
    dealTS(file, index, callback) {
      const data = this.aesConf.uri ? this.aesDecrypt(file, index) : file
      this.conversionMp4(data, index, (afterData) => { // mp4 转码
        this.mediaFileList[index - this.rangeDownload.startSegment + 1] = afterData // 判断文件是否需要解密
        this.finishList[index].status = 'finish'
        this.finishNum++
        if (this.streamWriter) {
          for (let index = this.streamDownloadIndex; index < this.mediaFileList.length; index++) {
            if (this.mediaFileList[index]) {
              this.streamWriter.write(new Uint8Array(this.mediaFileList[index]))
              this.mediaFileList[index] = null
              this.streamDownloadIndex = index + 1
            } else {
              break
            }
          }
          if (this.streamDownloadIndex >= this.rangeDownload.targetSegment) {
            this.streamWriter.close()
          }
        } else if (this.finishNum === this.rangeDownload.targetSegment) {
          let fileName = this.title || this.formatTime(this.beginTime, 'YYYY_MM_DD hh_mm_ss')
          this.downloadFile(this.mediaFileList, fileName)
        }
        callback && callback()
      })
    },
    // 转码为 mp4
    conversionMp4(data, index, callback) {
      if (this.isGetMP4) {
        let transmuxer = new monkeyWindow.muxjs.Transmuxer({
          keepOriginalTimestamps: true,
          duration: parseInt(this.durationSecond),
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
      !this.isPause && this.retryAll(true)
    },
    // 重新下载某个片段
    retry(index) {
      if (this.finishList[index].status === 'error') {
        this.finishList[index].status = ''
        this.ajax({
          url: this.tsUrlList[index],
          type: 'file',
          success: (file) => {
            this.errorNum--
            this.dealTS(file, index)
          },
          fail: () => {
            this.finishList[index].status = 'error'
          }
        })
      }
    },
    // 重新下载所有错误片段
    retryAll(forceRestart) {
      if (!this.finishList.length || this.isPause) {
        return
      }
      let firstErrorIndex = this.downloadIndex // 没有错误项目，则每次都递增
      this.finishList.forEach((item, index) => { // 重置所有错误片段状态
        if (item.status === 'error') {
          item.status = ''
          firstErrorIndex = Math.min(firstErrorIndex, index)
        }
      })
      this.errorNum = 0
      // 已经全部下载进程都跑完了，则重新启动下载进程
      if (this.downloadIndex >= this.rangeDownload.endSegment || forceRestart) {
        this.downloadIndex = firstErrorIndex
        this.downloadTS()
      } else { // 否则只是将下载索引，改为最近一个错误的项目，从那里开始遍历
        this.downloadIndex = firstErrorIndex
      }
    },
    // 下载整合后的TS文件
    downloadFile(fileDataList, fileName, forceSave = false) {
      setTimeout(() => {
        document.title = "下载完成 " + this.title
      }, 1000)
      if (!this.conf.autoSave && !forceSave) {
        return
      }
      this.tips = 'ts 碎片整合中，请留意浏览器下载'
      let fileBlob = null
      let a = document.createElement('a')
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
        this.getConf()
        if (this.conf.autoClose) {
          window.opener = null;
          window.open('', '_self', '');
          window.close()
        }
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
      return formatStr.replace(
          /Y+|M+|D+|h+|m+|s+/g,
          target => (new Array(target.length).join('0') + formatType[target[0]]).substr(-target.length)
      )
    },
    // 强制下载现有片段
    forceDownload() {
      if (this.mediaFileList.length) {
        let fileName = this.title || this.formatTime(this.beginTime, 'YYYY_MM_DD hh_mm_ss')
        this.downloadFile(this.mediaFileList, fileName, true)
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
    getConf() {
      let confStr = localStorage.getItem('porn-plus')
      if (confStr) {
        try {
          this.conf = JSON.parse(confStr)
        } catch (e) {
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.row2 {
  display: flex;
  justify-content: flex-end;
}

.big-btn {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-left: 1rem;
  font-size: 1.6rem;
  min-width: 10rem;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #eeeeee;
  background-color: #3D8AC7;
  opacity: 1;
  transition: 0.3s all;
  padding: .5rem 1rem;

  &:hover {
    opacity: 0.9;
  }

  &.disable {
    cursor: not-allowed;
    background-color: #dddddd;
    color: black;
  }
}

.m-p-input-container {
  display: flex;

  input {
    flex: 1;
    display: block;
    padding: 0 1rem;
    //padding: 1rem;
    font-size: 1.8rem;
    border-radius: 4px;
    box-shadow: none;
    color: white;
    background: rgba(239, 239, 239, 0.3);
    border: 1px solid #cccccc;
  }
}

.m-p-tips {
  width: 100%;
  color: #999999;
  text-align: left;
  font-style: italic;
  word-break: break-all;

  p {
    width: 100px;
    display: inline-block;
  }

  &.error-tips {
    color: #DC5350;
  }
}

.m-p-segment {
  text-align: left;

  .item {
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
    transition: 0.3s all;
  }

  .finish {
    background-color: #0ACD76;
  }

  .error {
    cursor: pointer;
    background-color: #DC5350;
  }

  .error:hover {
    opacity: 0.9;
  }
}

.error-btns {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.m-p-force, .m-p-retry {
  margin-top: 1rem;
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

.info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  .options {
    margin-right: 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .option {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    margin-bottom: .3rem;

    label {
      margin: 0;
    }

    input {
      margin: 0;
      margin-left: 1rem;
      @w: 1.4rem;
      width: @w;
      height: @w;
    }
  }
}

.progress {
  flex: 1;
  border-radius: .8rem;
  opacity: 1;
  height: 1.5rem;
  background: #FCFDFF;
  box-sizing: border-box;
  border: .1rem solid #FFFFFF;
  box-shadow: inset 0rem -1rem 4rem 0rem rgba(255, 255, 255, 0.8), inset 0rem 1rem 4rem 0rem rgba(45, 76, 114, 0.4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  .bar {
    height: 100%;
    width: 50%;
    left: 0;
    top: 0;
    position: absolute;
    background: linear-gradient(90deg, #9CDCFF 0%, #0ACD76 100%);
    border-radius: .8rem;
  }
}

</style>