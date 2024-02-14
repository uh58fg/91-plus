import {createApp} from 'vue';
import App from './App.vue';
import {monkeyWindow} from "$";

window.info = {
  author: {
    name: '',
    url: '',
    vid: ''
  },
  video: {
    name: '',
    url: '',
    vid: '',
  },
  // videoUrl:'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
}

function init() {
  if (window.info.videoUrl) return;
  const videoWrapper = $('#player_one_html5_api')
  const userWrapper = $('.title-yakov')
  if (userWrapper?.length === 2) {
    let href = userWrapper[1].firstElementChild.href
    let start = href.indexOf('UID')
    let uid = href.substring(start + 4)
    window.info.author = {
      name: userWrapper.find('.title').text(),
      url: `https://91porn.com/uvideos.php?UID=${uid}&type=public`,
      uid,
    }
  }

  if (!videoWrapper[0]) {
    document.title = '作为游客，你每天只可观看15个视频'
  } else {
    window.info.video = {
      name: document.title.replace('Chinese homemade video', ''),
      url: videoWrapper.find('source')[0].src,
      vid: $('#favorite #VID').text(),
      date: $('.title-yakov')[0].innerText
    }

    if (window.info.video.url.toLowerCase().indexOf('m3u8') === -1) {
      window.info.video.type = 'auto'
    } else {
      window.info.video.type = 'customHls'
    }

    createApp(App).mount(
      (() => {
        const app = document.createElement('div');
        document.body.append(app);
        return app;
      })(),
    );
  }
  console.log(window.info)
}

try {
  let style2 = `
  .ad_img{display:none;}
  `
  let addStyle2 = document.createElement("style");
  // @ts-ignore
  addStyle2.rel = "stylesheet";
  addStyle2.type = "text/css";
  addStyle2.innerHTML = style2
  document.head.append(addStyle2)
  $('iframe').hide()

  let l = window.location
  if (l.pathname === '/index.php') {

  } else if (l.pathname === '/view_video.php') {
    init()
  }
} catch (e) {
  console.log('init报错了', e)
}

