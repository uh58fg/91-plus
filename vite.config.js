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
        namespace: '91porn',
        match: [
          // 'v2ex.com',
          '*91porn.com/view_video.php?*',
        ],
        require: [
          'https://cdn.bootcdn.net/ajax/libs/hls.js/8.0.0-beta.3/hls.min.js',
          'https://cdn.bootcdn.net/ajax/libs/dplayer/1.26.0/DPlayer.min.js',
          'https://raw.githubusercontent.com/uh58fg/91-plus/master/lib/mux-mp4.js',
          'https://raw.githubusercontent.com/uh58fg/91-plus/master/lib/aes-decryptor-min.js',
          'https://raw.githubusercontent.com/uh58fg/91-plus/master/lib/stream-saver.js',
          // 'https://cdn.bootcdn.net/ajax/libs/mux.js/6.3.0/mux-mp4.min.js',
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
