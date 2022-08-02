import path from 'path'
import defaultTheme from '@vuepress/theme-default'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'


module.exports = {
  title: '笔记',
  description: '前端学习笔记',
  theme: defaultTheme({
    navbar: [
      { text: '首页', link: '/JavaScriptNotes' },
      { text: 'python', link: '/PythonNotes' }
    ],
    sidebarDepth: 2,
    sidebar: 'auto',
  }),
  plugins: [
    [
      registerComponentsPlugin({
        componentsDir: path.resolve(__dirname, './components'),
      })
    ],
  ],
  themeConfig: {
   
    
  },
  markdown: {
    lineNumbers: true
  },

  // devServer: {
  //   headers: {
  //     'Cross-Origin-Embedder-Policy': 'require-corp',
  //     'Cross-Origin-Opener-Policy': 'same-origin',
  //   }
  // }
};