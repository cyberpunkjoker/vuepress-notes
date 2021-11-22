module.exports = {
  title: '笔记',
  description: '前端学习笔记',
  themeConfig: {
    navbar: [
      { text: '首页', link: '/Regular/base' },
    ],
    sidebar:{
      '/Regular/': [
        {
          children: [
            {text: '正则', link: '/Regular/base'}
          ]
        }
      ],
      '/accumulate/': [
        {
          children: [
            { text: '日常项目积累笔记', link: '/accumulate/' },
            { text: '项目经验', link: '/accumulate/work' },
            { text: '知识记载', link: '/accumulate/newknowlage'}
          ]
        }
      ]
    }
}
};