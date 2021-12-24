const { path } = require('@vuePress/utils')

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
    ],
    sidebar:{
      '/JavaScriptNotes/': [
        {
          children: [
            { text: '正则', link: '/JavaScriptNotes/regular' },
            { text: '项目相关代码', link: '/JavaScriptNotes/work' },
            { text: '知识点记载', link: '/JavaScriptNotes/newknowlage' },
            { text: 'typeScript', link: '/JavaScriptNotes/ts' }
          ]
        }
      ],
    },
  },
  markdown: {
    lineNumbers: true
  }
};