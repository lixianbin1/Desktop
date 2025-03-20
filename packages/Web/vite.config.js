import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Layouts from 'vite-plugin-vue-layouts';
import Pages from 'vite-plugin-pages'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Layouts(),
    AutoImport({ 
      imports: [ //需要全局自动导入的模块API
        'vue',
        'vue-i18n',
        'vue-router',
        '@vueuse/core',
      ],
      dts: 'src/auto-imports.d.ts', //自动生成的导入文件路径
      dirs: [ //需要自动导入的模块文件
        'src/common/',
        'src/stores/',
      ],
      vueTemplate: true, //在vue模板中开启
      resolvers: [
        ElementPlusResolver(),
      ],
    }),
    Components({
      extensions: ['vue'], //需要全局自动导入的模块组件
      include: [/\.vue$/, /\.vue\?vue/], //包含匹配文件
      exclude: [/[\\/]\.git[\\/]/], //过滤匹配文件
      dts: 'src/components.d.ts', //自动生成的导入文件路径
      dirs: [ //需要自动导入的模块文件
        'src/components',
      ],
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'icon',
          enabledCollections: ['ep','carbon'],
        }),
      ],
    }),
    Icons({
      autoInstall: true,
    }),
    VueI18nPlugin({
      // runtimeOnly: true,
      // compositionOnly: true,
      fullInstall: true,
      include: [path.resolve(__dirname, 'src/language/*')],
    }),
    Pages({
      extensions: ['vue'], //有效的文件后缀
      dirs: 'src/views', //指定文件根目录
      extendRoute(route, parent) {
        return route
      },
    }),
  ],
  // 本地服务
  server:{
    open: true,
    port: 8080,
    host: "0.0.0.0",
    proxy: { //设置代理
      '/socket.io': { 
        target: 'http://localhost:3000/', //本地
        changeOrigin: true, // 是否跨域
        rewrite: path => path.replace(/^\/socket.io/, '/socket.io'),
      },
      '/api': { 
        target: 'http://localhost:3000/', //本地
        changeOrigin: true, // 是否跨域
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
