const path = require('path');

module.exports = {
  title: '笔记',
  description: '前端学习笔记',
  plugins: [
    [
      '@vuepress/register-components',
        {
          componentsDir: path.resolve(__dirname, './components'),
        },
    ],
  ],
  themeConfig: {
    navbar: [
      { text: '首页', link: '/JavaScriptNotes' },
      { text: 'python', link: '/PythonNotes' }
    ],
    displayAllHeaders: 2,
    sidebar: 'auto',
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