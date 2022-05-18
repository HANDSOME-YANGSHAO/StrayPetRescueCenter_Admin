import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// vite是依赖rollup的打包功能，rollup具有tree-shaking的功能，会自动把没有引入的组件给裁剪掉，直接全局引入组件库直接用也可以这是一种办法；
// 下面是按照官方做法实现按需自动引入，用到什么引入什么，但是打包效率会更高，思路也更加的清晰，开发阶段需多下载两个插件和进行一些配置
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import jojocompare from 'vite-plugin-compare'

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      comps: path.resolve(__dirname, 'src/components'),
      stores: path.resolve(__dirname, 'src/stores')
    }
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    jojocompare()
  ],
  // 配置代理
  server: {
    open: true,
    port: 9090,
    strictPort: true, // 严格端口 true:如果端口已被使用，则直接退出，而不会再进行后续端口的尝试。
    /**
     * @description 解决chrome设置origin:*也跨域机制,代理/api前缀到服务基地址
     * 最终的地址会将axios设置的baseUrl:/api代理拼接成[target][/api],然后通过rewrite重写掉/api为'' 这样就是我们真实的基地址了
     */
    proxy: {
      '/api': {
        target: 'https://api.zhuishushenqi.com', // 接口基地址
        changeOrigin: true, // 开启代理
        rewrite: path => {
          console.log(path) // 打印[/api/userInfo] 这就是http-proxy要请求的url,我们基地址实际是没有/api 所以replace掉
          return path.replace(/^\/api/, '')
        }
      }
    }
  }
})
