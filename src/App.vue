<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import Downloader from "./downloader.vue";
import {monkeyWindow} from "$";
import Mp4Downloader from "./mp4-downloader.vue";

const dpRef = ref(null)
const dp = ref(null)
const h5Video = ref(null)
const recommendRef = ref(null)
const data = reactive({
  comments: [],
  info: window.info,
  show: true,
})

watch(() => data.show, (n, o) => {
  if (n) {
    pauseOriginVideo()
    document.body.style.overflow = 'hidden'
  } else {
    dp.value?.pause()
    document.body.style.overflow = 'unset'
  }
}, {immediate: true})

onMounted(() => {
  recommendRef.value.append($('h3').next().next()[0])
  $('br').remove()
  initComments()
  initVideo()
  checkOriginVideoIsPlay()
})

function pauseOriginVideo() {
  //如果在播放，给他暂停了
  if ($('.vjs-playing').length) {
    $('#player_one_html5_api').click()
  }
}

function checkOriginVideoIsPlay() {
  setInterval(() => {
    if (data.show) {
      pauseOriginVideo()
    }
  }, 3000)
}

function initComments() {
  $.ajax({
    url: `${location.origin}/show_comments2.php?VID=${data.info.video.vid}&start=1&comment_per_page=30`,
    success(r) {
      let h = $(r)
      h.each(function () {
        if (this.tagName === 'TABLE') {
          // console.log(this)
          let a = $(this).find('a:first');
          let name = a.text().trim()
          let url = a[0].href + '&type=public'
          let time = $(this).find('.comment-info').contents()[4]
          let body = $(this).find('.comment-body')
          let quote = body.find('.comment_quote').text().replaceAll(' ', '').replaceAll('\n', '')
          body.find('.comment_quote').remove()
          let replay = body.find('a').remove().end().text().trim()
          if (
              replay.includes('请不要发广告或与视频无关的评论') ||
              quote.includes('请不要发广告或与视频无关的评论')
          ) {
          } else {
            data.comments.push({
              name,
              time: $(time).text(),
              quote,
              replay,
              url
            })
          }
        }
      })
    }
  })
}

function initVideo() {

  let config = {
    url: data.info.video.url,
    type: data.info.video.type,
  }
  if (config.type === 'customHls') {
    if (!dpRef.value) return
    config.customType = {
      customHls: function (video, player) {
        const hls = new monkeyWindow.Hls()
        hls.loadSource(video.src)
        hls.attachMedia(video)
      }
    }
    dp.value = new monkeyWindow.DPlayer({
      container: dpRef.value,
      autoplay: true,
      video: config
    });
    dp.value.seek(10);
  } else {
    if (h5Video.value) {
      h5Video.value.currentTime = 10
    }
  }
}

function goHome() {
  location.href = 'https://91porn.com/index.php'
}

function downloadEnd(blobUrl) {
  if (h5Video.value) {
    let old = h5Video.value.currentTime
    h5Video.value.src = blobUrl
    h5Video.value.currentTime = old
  }
}
</script>

<template>
  <div class="content" v-show="data.show">
    <div class="left">
      <div class="big-title">
        评论
        <svg @click="goHome" class="home-icon" width="24" height="24" viewBox="0 0 48 48" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18V42H39V18L24 6L9 18Z" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"
                stroke-linejoin="round"/>
          <path d="M19 29V42H29V29H19Z" fill="none" stroke="#ffffff" stroke-width="4" stroke-linejoin="round"/>
          <path d="M9 42H39" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="comments">
        <div class="item" v-for="item in data.comments">
          <div class="title">
            <a :href="item.url" target="_blank"> {{ item.name }}</a>
            <span> {{ item.time }}</span>
          </div>
          <div class="quote" v-if="item.quote">
            {{ item.quote }}
          </div>
          <div class="replay">
            {{ item.replay }}
          </div>
        </div>
      </div>
    </div>
    <div class="video-wrapper">
      <div id="dplayer" ref="dpRef"></div>
      <video
          ref="h5Video"
          :src="data.info.video.url"
          controls
          preload
          autoplay
          class="my-video"></video>
      <div class="title">{{ data.info.video.name }}</div>
      <div class="author" target="_blank">
        添加时间： {{ data.info.video.date }}
      </div>
      <a v-if="data.info.author.name" :href="data.info.author.url" class="author" target="_blank">
        作者： {{ data.info.author.name }}
      </a>
      <Mp4Downloader
          v-if="data.info.video.type === 'auto'"
          :name="data.info.video.name"
          :url="data.info.video.url"
          @end="downloadEnd"
      />
      <downloader v-else :title="data.info.video.name" :url="data.info.video.url"/>
    </div>
    <div class="right">
      <div class="big-title">
        本月热播
        <div class="close" @click="data.show = !data.show"></div>
      </div>
      <div class="list" ref="recommendRef"></div>
    </div>
  </div>
  <div class="showBtn" v-show="!data.show" @click="data.show = !data.show">展开脚本</div>
</template>

<style scoped lang="less">
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-thumb {
  background: #4e4e4e;
  border-radius: 25px;
}

.showBtn {
  cursor: pointer;
  position: fixed;
  top: 1rem;
  right: 1rem;
  color: white;
  z-index: 99999;
  background: gray;
  padding: .6rem 1rem;
  border-radius: .3rem;
}

.content {
  z-index: 9999;
  background: rgb(15, 15, 15);
  //background: white;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  min-width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding: 1rem;
  display: flex;
  gap: 2rem;
  text-align: start;

  .close {
    cursor: pointer;
    @w: 2rem;
    position: absolute;
    top: 1rem;
    right: 2rem;
    width: @w;
    height: @w;
    line-height: 4rem;
    text-align: center;
    color: white;

    @c: white;

    &:before {
      position: absolute;
      content: '';
      width: 0.2rem;
      height: @w;
      background: @c;
      transform: rotate(45deg);
      top: calc(50% - 0.45rem);
      left: 50%;
    }

    &:after {
      content: '';
      position: absolute;
      width: 0.2rem;
      height: @w;
      background: @c;
      transform: rotate(-45deg);
      top: calc(50% - 0.45rem);
      left: 50%;
    }
  }

  .home-icon {
    cursor: pointer;
    right: 2rem;
    position: absolute;
  }

  .big-title {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 5rem;
    font-weight: bold;
    color: white;
    letter-spacing: 2px;
    background: rgba(33, 33, 33, 1);
    font-size: 2rem;
  }

  .video-wrapper {
    width: 60vw;
    overflow: auto;
    padding-bottom: 2rem;

    .my-video, #dplayer {
      width: 100%;
      max-height: 70vh;
    }

    .title {
      margin-top: 1rem;
      font-weight: bold;
      font-size: 2rem;
      color: white;
      margin-bottom: 1rem;
    }

    .author {
      margin-right: 2rem;
      font-weight: bold;
      font-size: 1.4rem;
      margin-bottom: 2rem;
      display: inline-block;
    }
  }

  .left {
    //opacity: 0;
    flex: 1;
    //width: 25%;
    border: 1px solid gray;
    border-radius: .5rem;
    overflow: hidden;
    position: relative;
    font-size: 1.8rem;

    .comments {
      color: white;
      height: calc(100% - 6rem);
      padding-bottom: 4rem;
      overflow: auto;

      .item {
        margin-bottom: 5px;
        padding: 10px;
        border-bottom: 1px solid #3f3f3f;
        text-align: start;

        .title {
          font-size: 1.4rem;

          span {
            margin-right: 10px;
          }
        }

        .quote {
          margin-top: .5rem;
          font-size: 1rem;
          padding: .5rem;
          padding-left: 1rem;
          border: 1px dashed gray;
        }
      }
    }
  }

  .right {
    flex: 1;
    //opacity: 0;
    //width: 25%;
    border: 1px solid gray;
    border-radius: .5rem;
    overflow: hidden;

    .list {
      color: white;
      height: calc(100% - 6rem);
      padding: 1rem;
      padding-bottom: 4rem;
      overflow: auto;
    }
  }
}


.ml20 {
  margin-left: 20px;
}
</style>
