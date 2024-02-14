<script>
let videoBlobUrl

export default {
  name: "mp4-downloader",
  props: {
    url: '',
    name: '',
  },
  data() {
    return {
      conf: {
        autoDownload: true,
        autoSave: true,
        autoClose: false,
      },
      retryCount: 0,
      progress: 0,
      show: false,
      tips: 'm3u8 视频在线提取工具', // 顶部提示
      isPause: false, // 是否暂停下载
      isGetMP4: false, // 是否转码为 MP4 下载
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
      document.title = Number(n).toFixed(0) + '% ' + this.name
    }
  },
  created() {
    console.log('mp4-downloader.vue')
    this.getConf()
    if (this.conf.autoDownload) {
      this.download()
    }
    window.onbeforeunload = () => {
      if (videoBlobUrl) {
        URL.revokeObjectURL(videoBlobUrl)
      }
    }
  },
  methods: {
    getConf() {
      let confStr = localStorage.getItem('porn-plus')
      if (confStr) {
        try {
          this.conf = JSON.parse(confStr)
        } catch (e) {
        }
      }
    },
    download() {
      let u = new URLSearchParams(location.search)
      let retryCount = u.get('retryCount') || 0
      if (retryCount) {
        retryCount = Number(retryCount)
        if (retryCount >= 3) {
          return document.title = '下载失败！'
        }
      }

      let xhr = new XMLHttpRequest();
      xhr.open('GET', this.url, true);
      xhr.responseType = 'blob';
      xhr.onprogress = event => {
        this.progress = Number(Number(event.loaded / event.total).toFixed(2)) * 100
        // console.log('进度', this.progress)
      };
      xhr.onreadystatechange = () => {
        // console.log('onreadystatechange', xhr.readyState, xhr.status)
        if (xhr.readyState === 4) {
          let status = xhr.status;
          if (status >= 200 && status < 300) {
            videoBlobUrl = window.URL.createObjectURL(xhr.response);
            this.progress = 100
            this.getConf()
            this.$emit('end', videoBlobUrl)
            if (this.conf.autoSave) {
              this.save()
            }
          } else {
            retryCount++
            document.title = `下载失败${retryCount}次！`
            setTimeout(() => {
              u.set('retryCount', retryCount)
              location.search = u.toString()
            }, 3000)
            console.log('请求失败了')
          }
        }
      }
      xhr.send();
    },
    save() {
      if (!videoBlobUrl) {
        videoBlobUrl = window.URL.createObjectURL(xhr.response);
      }
      this.getConf()
      let a = document.createElement('a');
      a.style.display = 'none';
      document.body.appendChild(a);
      a.href = videoBlobUrl;
      a.download = this.name + '.mp4';
      a.click();
      URL.revokeObjectURL(videoBlobUrl);
      a.remove()
      setTimeout(() => {
        if (this.conf.autoClose) {
          window.opener = null;
          window.open('', '_self', '');
          window.close()
        }
      }, 1000)
    }
  }
}
</script>

<template>
  <div class="mp4-downloader">
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
          <label for="a2">下载完成后自动保存</label>
          <input id="a2" type="checkbox" v-model="conf.autoSave">
        </div>
        <div class="option">
          <label for="a3">保存后自动关闭</label>
          <input id="a3" type="checkbox" v-model="conf.autoClose">
        </div>
      </div>
    </div>

    <div class="row2" v-if="!show">
      <div class="big-btn" @click="save">
        <span>保存</span>
      </div>
      <div class="big-btn" @click="show = !show">
        <span>{{ !show ? '展开' : '收起' }}下载详情</span>
      </div>
    </div>

    <div class="wrapper" v-show="show">
      <section class="m-p-input-container">
        <input type="text" :value="url" :disabled="true" placeholder="请输入 链接">
        <!--还未开始下载-->
        <template v-if="progress === 0">
          <div class="big-btn" @click="download">下载</div>
        </template>
        <div v-else-if="progress === 100"
             class="disable big-btn">
          下载完成
        </div>
        <!--        <div class="big-btn" v-else @click="togglePause">{{ isPause ? '恢复下载' : '暂停下载' }}</div>-->

        <div class="big-btn" v-if="progress === 100"
             @click="save">
          <span>保存</span>
        </div>

        <div class="big-btn detail" @click="show = !show">
          <span>{{ !show ? '展开' : '收起' }}下载详情</span>
        </div>
      </section>
      <div class="m-p-tips">进度：{{ progress }}%</div>
    </div>
  </div>
</template>

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
