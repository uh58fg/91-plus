import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, {cdn} from 'vite-plugin-monkey';

export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.js',
      userscript: {
        icon: 'https://img-blog.csdnimg.cn/20181221195058594.gif',
        namespace: 'jiuyi',
        author: 'uh58fg',
        version: '18',
        license: 'WTFPL',
        description: '多线程下载91porn视频，跳过广告，清除页面广告。',
        match: [
          '*.com/view_video.php?*',
          '*.com/index.php',
        ],
        require: [
          'https://cdn.bootcdn.net/ajax/libs/hls.js/8.0.0-beta.3/hls.min.js',
          'https://cdn.bootcdn.net/ajax/libs/dplayer/1.26.0/DPlayer.min.js',
          'https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js',
          'https://greasyfork.org/scripts/466106-91-plus-mux-mp4/code/91-plus-mux-mp4.js?version=1189391',
          // 'https://raw.githubusercontent.com/uh58fg/91-plus/master/lib/mux-mp4.js',
          // 'https://raw.githubusercontent.com/uh58fg/91-plus/master/lib/stream-saver.js',
        ]
      },
      build: {
        externalGlobals: {
          vue: cdn.bootcdn('Vue', 'vue.runtime.global.prod.min.js'),
        },
      },
    }),
  ],
});